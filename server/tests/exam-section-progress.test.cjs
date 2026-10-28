const {test,before,after}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json')});
const users={teacher:{id:'teacher',app_metadata:{role:'teacher'},user_metadata:{full_name:'Teacher'}},student:{id:'student',email:'student@example.test',app_metadata:{role:'student',class_ids:['shsat']},user_metadata:{full_name:'Student'}},other:{id:'other',app_metadata:{role:'student',class_ids:['shsat']},user_metadata:{full_name:'Other'}}};
const tables={student_exam_results:[],student_exam_sessions:[],student_practice_progress:[]},completions=[];
function stub(relative,exports){const id=require.resolve(relative);require.cache[id]={id,filename:id,loaded:true,exports};}
stub('../src/lib/auth.ts',{getAuthenticatedUser:async header=>{const user=users[header?.replace('Bearer ','')];return{user,error:user?null:'Sign in required'};},getEnrolledClassIds:metadata=>metadata.class_ids??[],getUserRole:user=>user.app_metadata.role,isStudentArchived:()=>false});
stub('../src/lib/learningPlanStore.ts',{recordPlanCompletion:async(...args)=>completions.push(args),recordPracticePlanCompletion:async()=>{},hasAssignedContent:async()=>false});
const assessment={id:'split-time',classId:'shsat',status:'open',allowCompletedAccess:true,sectionAccess:{english:true,math:true}};
stub('../src/lib/assessmentAccess.ts', {resolveAssessmentAccess:async value=>value,resolveAssessmentAccessList:async values=>values,assessmentAccessErrorHandler:(error,_request,_response,next)=>next(error)});
stub('../src/config/assessments.ts',{listTeacherAssessments:()=>[assessment],findAssessmentForStudent:(id,classes)=>id===assessment.id&&classes.includes('shsat')?assessment:undefined});
stub('../src/lib/supabase.ts',{supabase:{auth:{admin:{listUsers:async()=>({data:{users:Object.values(users)},error:null}),getUserById:async id=>({data:{user:Object.values(users).find(user=>user.id===id)},error:null})}},from(table){let filters=[],single=false;const query={select(){return this;},eq(key,value){filters.push(row=>row[key]===value);return this;},like(key,value){filters.push(row=>String(row[key]).startsWith(value.replace(/%$/,'')));return this;},maybeSingle(){single=true;return this;},upsert(row){const records=tables[table],old=records.find(item=>item.user_id===row.user_id&&item.assessment_id===row.assessment_id);if(old)Object.assign(old,structuredClone(row));else records.push(structuredClone(row));return Promise.resolve({error:null});},then(resolve,reject){const rows=tables[table].filter(row=>filters.every(filter=>filter(row)));return Promise.resolve({data:single?rows[0]??null:rows,error:null}).then(resolve,reject);}};return query;}}});
const {createExamResult}=require('../src/shared/examGrading.ts');
const content={assessmentId:'split-time',title:'Three hour exam',passageSets:[{id:'p',passage:{id:'p',title:'Passage',lines:[]},questions:[{id:'e',type:'multiple_choice',topic:'Inference',choices:[{id:'A',text:'Yes'}],correctChoiceId:'A'}]}],mathSection:{id:'math',questions:[{id:'m',type:'numeric_entry',topic:'Algebra',correctTextAnswers:['5']}]}};
let server,root;
before(async()=>{const express=require('express'),app=express();app.use(express.json({limit:'1mb'}));app.use('/api/progress',require('../src/routes/progress.ts').progressRouter);server=await new Promise(resolve=>{const instance=app.listen(0,'127.0.0.1',()=>resolve(instance));});root=`http://127.0.0.1:${server.address().port}/api/progress`;});
after(async()=>{await new Promise(resolve=>server.close(resolve));});
async function call(url,token='student',body){const response=await fetch(root+url,{method:body?'PUT':'GET',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return{status:response.status,data:await response.json()};}

test('teacher sees submitted Math immediately; pending English is not scored, stale writes preserve Math, and retakes retain history',async()=>{
 const partial={...createExamResult(content,{m:'5'},['math']),attemptId:'first',sectionCompletedAt:{math:'2026-10-01T12:00:00Z'},timerState:{startedAt:1000,pausedAt:3601000,totalPausedMs:0}};
 assert.equal((await call('/exam-results/split-time','student',{result:partial})).status,200);
 await call('/exam-sessions/split-time','student',{answers:{m:'5'},completedSections:['math'],status:'in_progress'});
 assert.equal((await call('/students','student')).status,403);
 let roster=(await call('/students','teacher')).data.students,student=roster.find(student=>student.id==='student');
 assert.equal(student.progress.examResults[0].subjects[0].subject,'Mathematics');assert.equal(student.progress.examResults[0].correct,1);assert.equal(student.progress.examResults[0].total,1);assert.equal(student.insights.averageTestScore,null);assert.equal(student.insights.testsCompleted,0);assert.equal(completions.length,0);
 assert.equal((await call('/','other')).data.progress.examResults.length,0);
 const session=(await call('/exam-sessions')).data.sessions['split-time'];assert.deepEqual(session.completedSections,['math']);assert.equal(Object.hasOwn(session.answers,'e'),false);
 const english={...createExamResult(content,{e:'A',m:'0'},['english']),attemptId:'first',sectionCompletedAt:{english:'2026-10-03T12:00:00Z'}};
 assert.equal((await call('/exam-results/split-time','student',{result:english})).status,200);
 const full=(await call('/')).data.progress.examResults[0];assert.deepEqual(full.completedSections.sort(),['english','math']);assert.equal(full.answers.m,'5');assert.equal(full.correct,2);assert.equal(full.total,2);assert.equal(full.sectionCompletedAt.math,'2026-10-01T12:00:00Z');assert.equal(completions.length,1);
 assert.equal(tables.student_exam_results.filter(row=>row.assessment_id.startsWith('__exam_history__:')).length,0);
 const retake={...createExamResult(content,{m:'0'},['math']),attemptId:'second'};
 assert.equal((await call('/exam-results/split-time','student',{result:retake})).status,200);
 const progress=(await call('/')).data.progress;assert.equal(progress.examHistory.length,1);assert.equal(progress.examHistory[0].correct,2);assert.equal('analysisContent' in progress.examHistory[0],false);assert.equal('answers' in progress.examHistory[0],false);
 assert.equal(progress.examResults[0].attemptId,'second');assert.equal(progress.examResults[0].completionStatus,'math_complete');
});
