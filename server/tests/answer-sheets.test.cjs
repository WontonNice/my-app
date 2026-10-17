const {test,before,after}=require('node:test');const assert=require('node:assert/strict');const {randomUUID}=require('node:crypto');
const fixture=require('./helpers/answer-sheets-fixture.cjs');const {ids,draft,tables,controls,users}=fixture;
let server,base,sheet,assignment,session=randomUUID(),attempt,submission=randomUUID();
before(async()=>{server=fixture.createFixtureApp().listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}`;});after(()=>new Promise(resolve=>server.close(resolve)));
async function call(path,role='teacher',method='GET',body){const result=await fetch(base+'/api/answer-sheets'+path,{method,headers:{authorization:`Bearer ${role}`,'content-type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});return{status:result.status,data:await result.json()};}
async function save(changes,extra={}){const result=await call(`/student/${assignment}/responses`,'student','PATCH',{sessionId:session,revision:attempt.revision,mutationId:randomUUID(),changes,sectionId:'english-section',...extra});if(result.data.attempt)attempt=result.data.attempt;return result;}
test('A: create without content/key, assign individual students, issue structure freezes stable identities',async()=>{
 assert.equal((await call('/teacher','student','POST',draft())).status,403);
 const created=await call('/teacher','teacher','POST',draft());assert.equal(created.status,201);sheet=created.data.sheet;assert.deepEqual(sheet.keys,{});
 const batchId=randomUUID(),body={studentIds:[ids.student],batchId,dueDate:'2026-11-01'};
 const assigned=await call(`/teacher/${sheet.id}/assign`,'teacher','POST',body);assert.equal(assigned.status,201);assignment=assigned.data.assignments[0].id;sheet=assigned.data.sheet;
 assert.equal((await call(`/teacher/${sheet.id}/assign`,'teacher','POST',body)).status,201);assert.equal(tables.student_assignments.length,1);
 assert.equal((await call(`/teacher/${sheet.id}`,'teacher','PUT',{...sheet,title:'changed'})).status,409);
 const opened=await call(`/student/${assignment}/open`,'student','POST',{sessionId:session});assert.equal(opened.status,200);attempt=opened.data.attempt;
 assert.equal(attempt.sheet.sections[0].items[0].number,attempt.sheet.sections[1].items[0].number);assert.notEqual(attempt.sheet.sections[0].items[0].id,attempt.sheet.sections[1].items[0].id);
 assert.equal('keys' in attempt.sheet,false);assert.equal('lease' in attempt,false);
});
test('B/C/F/G: every response type, exact text, partial selection, clears, refresh/resume same attempt',async()=>{
 const original=attempt.id, raw='  0\n1/3 + x² ≠ 0\nA short explanation.  ';
 assert.equal((await save([{itemId:'q-single',answer:'single-A'},{itemId:'q-multi',answer:['multi-A']},{itemId:'q-short',answer:raw},{itemId:'q-math',answer:'0'}])).status,200);
 const {responseState}=require('../src/shared/answerSheets.ts');assert.equal(responseState(attempt.sheet.sections[0].items[1],attempt.answers['q-multi']),'attention');
 assert.equal((await call(`/student/${assignment}/submit`,'student','POST',{sessionId:session,revision:attempt.revision,submissionId:randomUUID(),confirmUnanswered:true})).status,422);
 let reopened=await call(`/student/${assignment}/open`,'student','POST',{sessionId:session});attempt=reopened.data.attempt;assert.equal(attempt.id,original);assert.equal(attempt.answers['q-short'],raw);assert.equal(attempt.answers['q-math'],'0');
 assert.equal((await save([{itemId:'q-single',answer:''},{itemId:'q-multi',answer:[]},{itemId:'q-short',answer:''}])).status,200);
 assert.equal((await save([{itemId:'q-single',answer:'single-B'},{itemId:'q-multi',answer:['multi-C','multi-A']},{itemId:'q-short',answer:raw,flagged:true}])).status,200);
 assert.equal((await save([{itemId:'q-short',answer:'x'.repeat(10001)}])).status,400);assert.equal(attempt.answers['q-short'],raw);
 reopened=await call(`/student/${assignment}/open`,'student','POST',{sessionId:session});attempt=reopened.data.attempt;assert.equal(attempt.id,original);assert.deepEqual(attempt.answers['q-multi'],['multi-C','multi-A']);assert.ok(attempt.flags.includes('q-short'));
});
test('D/J: storage outage, idempotent retry, stale revision, concurrent-tab lease takeover and isolation',async()=>{
 const before=structuredClone(attempt);controls.fail=true;assert.equal((await save([{itemId:'q-short',answer:'unsynced'}])).status,503);controls.fail=false;assert.equal(attempt.answers['q-short'],before.answers['q-short']);
 const otherSession=randomUUID();assert.equal((await call(`/student/${assignment}/open`,'student','POST',{sessionId:otherSession})).status,423);
 const takeover=await call(`/student/${assignment}/open`,'student','POST',{sessionId:otherSession,takeover:true});assert.equal(takeover.data.attempt.id,attempt.id);
 assert.equal((await save([{itemId:'q-short',answer:'old tab overwrite'}])).status,423);session=otherSession;attempt=takeover.data.attempt;
 const mutationId=randomUUID(),revision=attempt.revision;assert.equal((await save([{itemId:'q-short',answer:'last characters 0\nend'}],{mutationId})).status,200);
 assert.equal((await save([{itemId:'q-short',answer:'last characters 0\nend'}],{mutationId,revision})).status,200);
 assert.equal((await save([{itemId:'q-short',answer:'stale'}],{revision})).status,409);
 const concurrentBody={sessionId:session,revision:attempt.revision,sectionId:'english-section',changes:[{itemId:'q-math',answer:'0'}]};
 const race=await Promise.all([call(`/student/${assignment}/responses`,'student','PATCH',{...concurrentBody,mutationId:randomUUID()}),call(`/student/${assignment}/responses`,'student','PATCH',{...concurrentBody,mutationId:randomUUID()})]);
 assert.deepEqual(race.map(result=>result.status).sort(),[200,409]);attempt=race.find(result=>result.status===200).data.attempt;
 assert.equal((await call(`/student/${assignment}/open`,'other','POST',{sessionId:randomUUID()})).status,403);
 assert.equal((await call(`/teacher/${sheet.id}`,'foreign')).status,403);
 assert.equal((await call(`/teacher/attempt/${assignment}/review`,'student')).status,403);
 users.archived={id:randomUUID(),app_metadata:{role:'student',class_ids:['shsat'],archived:true}};
 assert.equal((await call(`/teacher/${sheet.id}/assign`,'teacher','POST',{studentIds:[users.archived.id],batchId:randomUUID()})).status,404);
});
test('I: link an already submitted attempt, retain source identities, and release verified metadata for insights',async t=>{
 const linkedShort=fixture.target.passageSets[0].questions.find(question=>question.id==='target-short');linkedShort.type='essay';t.after(()=>{linkedShort.type='short_response';});
 const source=draft();source.sections=source.sections.slice(0,1);source.sections[0].items[1].options=source.sections[0].items[1].options.slice(0,2);
 let linked=(await call('/teacher','teacher','POST',source)).data.sheet;
 const issued=await call(`/teacher/${linked.id}/assign`,'teacher','POST',{studentIds:[ids.other],batchId:randomUUID()});linked=issued.data.sheet;const task=issued.data.assignments[0].id,editing=randomUUID();
 let work=(await call(`/student/${task}/open`,'other','POST',{sessionId:editing})).data.attempt;
 work=(await call(`/student/${task}/responses`,'other','PATCH',{sessionId:editing,revision:work.revision,mutationId:randomUUID(),sectionId:'english-section',changes:[{itemId:'q-single',answer:'single-A'},{itemId:'q-multi',answer:['multi-B','multi-A']},{itemId:'q-short',answer:'0'}]})).data.attempt;
 work=(await call(`/student/${task}/submit`,'other','POST',{sessionId:editing,revision:work.revision,submissionId:randomUUID(),confirmUnanswered:true})).data.attempt;const original=structuredClone(work);
 const mappings=source.sections[0].items.map((item,index)=>({itemId:item.id,questionId:['target-single','target-multi','target-short'][index],optionMap:Object.fromEntries(item.options.map(option=>[option.id,option.label]))}));
 linked=(await call(`/teacher/${linked.id}/mapping/apply`,'teacher','POST',{revision:linked.revision,assessmentId:'fixture-form-a',sourceVersion:linked.sourceVersion,items:mappings,acknowledgeChanges:true})).data.sheet;
 linked=(await call(`/teacher/${linked.id}/key`,'teacher','PUT',{revision:linked.revision,keys:{'q-single':{points:1,mode:'automatic',answer:'single-A'},'q-multi':{points:1,mode:'automatic',answer:['multi-A','multi-B']},'q-short':{points:1,mode:'exact',accepted:['0']}}})).data.sheet;
 await call(`/teacher/attempt/${task}/grade`,'teacher','POST',{});const released=await call(`/teacher/attempt/${task}/release`,'teacher','POST',{});assert.equal(released.status,200);assert.equal(released.data.result.correct,3);
 assert.deepEqual(released.data.result.answers,{'target-single':'A','target-multi':['B','A'],'target-short':'0'});assert.equal(released.data.result.answerSheet.analysisContent.passageSets[0].questions.length,3);
 const analysis=released.data.result.answerSheet.analysisContent.passageSets[0].questions;assert.equal(analysis.find(question=>question.id==='target-short').type,'short_response');for(const question of analysis)assert.equal(require('../src/shared/examGrading.ts').isExamQuestionCorrect(question,released.data.result.answers[question.id]),true);
 const reviewed=(await call(`/teacher/attempt/${task}/review`)).data.attempt;assert.equal(reviewed.id,original.id);assert.deepEqual(reviewed.submissions,original.submissions);assert.deepEqual(reviewed.answers,original.answers);
});
test('J: no forged teacher roles or generic progress endpoints can modify protected response/key/result records',async()=>{
 users.forged={id:ids.student,app_metadata:{class_ids:['shsat']},user_metadata:{role:'teacher'}};
 assert.equal((await call('/teacher','forged')).status,403);assert.equal((await call('/teacher','signed-out')).status,401);
 const app=fixture.createFixtureApp();app.use('/api/progress',require('../src/routes/progress.ts').progressRouter);const instance=app.listen(0,'127.0.0.1');await new Promise(resolve=>instance.once('listening',resolve));
 try{for(const path of ['/practice/answer-sheet%3Adef%3Aforged','/exam-results/answer-sheet%3Aforged','/exam-results/ordinary-id']){const result=await fetch(`http://127.0.0.1:${instance.address().port}/api/progress${path}`,{method:'PUT',headers:{authorization:'Bearer student','content-type':'application/json'},body:JSON.stringify({progress:{keys:{}},result:{source:'answer_sheet',percentage:100}})});assert.ok([400,403].includes(result.status));}
 users.student.user_metadata.learning_progress={examResults:[{source:'answer_sheet',assessmentId:'answer-sheet:forged',percentage:100},{source:'manual',assessmentId:'legacy-paper',correct:1,total:2}],practice:{'answer-sheet:def:forged':{keys:{}}}};
 controls.fail=true;const fallback=await fetch(`http://127.0.0.1:${instance.address().port}/api/progress/`,{headers:{authorization:'Bearer student'}});const progress=(await fallback.json()).progress;
 assert.equal(progress.examResults.some(result=>result.source==='answer_sheet'),false);assert.equal(progress.examResults.some(result=>result.assessmentId==='legacy-paper'),true);assert.deepEqual(progress.practice,{});
 }finally{controls.fail=false;delete users.student.user_metadata.learning_progress;await new Promise(resolve=>instance.close(resolve));}
});
test('E/H: immediate submission contains last saved text, retries make one immutable snapshot, no key means awaiting grading',async()=>{
 const body={sessionId:session,revision:attempt.revision,submissionId:submission,confirmUnanswered:true};
 const response=await call(`/student/${assignment}/submit`,'student','POST',body);assert.equal(response.status,200);attempt=response.data.attempt;assert.equal(response.data.result,null);
 assert.equal(attempt.submissions.length,1);assert.equal(attempt.submissions[0].answers['q-short'],'last characters 0\nend');
 assert.equal((await call(`/student/${assignment}/submit`,'student','POST',body)).status,200);
 assert.equal((await call(`/student/${assignment}/submit`,'student','POST',{...body,submissionId:randomUUID()})).status,409);
 await call(`/teacher/attempt/${assignment}/grade`,'teacher','POST',{});let reviewed=await call(`/teacher/attempt/${assignment}/review`);assert.equal(reviewed.data.grade.current.earned,null);assert.equal(reviewed.data.grade.current.pending,4);
 assert.equal((await call(`/teacher/attempt/${assignment}/release`,'teacher','POST',{})).status,409);
 const before=structuredClone(attempt.answers);const keys={'q-single':{points:1,mode:'automatic',answer:'single-B'},'q-multi':{points:1,mode:'automatic',answer:['multi-A','multi-C']},'q-short':{points:2,mode:'manual'},'q-math':{points:1,mode:'exact',accepted:['0']}};
 const keyed=await call(`/teacher/${sheet.id}/key`,'teacher','PUT',{revision:sheet.revision,keys});assert.equal(keyed.status,200);sheet=keyed.data.sheet;
 assert.equal((await call(`/teacher/attempt/${assignment}/grade`,'teacher','POST',{manual:{'q-short':1.5}})).status,200);
 reviewed=await call(`/teacher/attempt/${assignment}/review`);assert.equal(reviewed.data.grade.current.pending,0);assert.equal(reviewed.data.grade.current.earned,4.5);assert.deepEqual(reviewed.data.attempt.answers,before);
 // No private key/grading state is placed in the student's RLS-readable progress row.
 const ownRows=tables.student_practice_progress.filter(row=>row.user_id===ids.student);assert.equal(JSON.stringify(ownRows).includes('accepted'),false);assert.equal(JSON.stringify(ownRows).includes('keyHistory'),false);
 const released=await call(`/teacher/attempt/${assignment}/release`,'teacher','POST',{});assert.equal(released.status,200);assert.equal(released.data.result.source,'answer_sheet');assert.equal(released.data.result.topics.length,0);
 const studentView=await call(`/student/${assignment}/open`,'student','POST',{sessionId:session});assert.equal(studentView.data.result.answerSheet.grade.earned,4.5);
 assert.equal((await call(`/teacher/${sheet.id}/export`,'student')).status,403);const exported=await call(`/teacher/${sheet.id}/export`);assert.deepEqual(exported.data.rows[0].submissions[0].answers,before);
});
test('I/J: explicit mapping detects wrong version/type/options; reopening and repeated assignments preserve history',async()=>{
 const items=sheet.sections[0].items.map((item,index)=>({itemId:item.id,questionId:['target-single','target-multi','target-short'][index],optionMap:Object.fromEntries(item.options.map(option=>[option.id,option.label]))}));
 const bad=await call(`/teacher/${sheet.id}/mapping/preview`,'teacher','POST',{assessmentId:'fixture-form-a',sourceVersion:'Wrong form',items});assert.ok(bad.data.problems.length>=2);
 // A compatible standalone sheet can link to explicit target IDs without touching an attempt.
 const nextDraft=draft();nextDraft.sections=nextDraft.sections.slice(0,1);nextDraft.sections[0].items[1].options=nextDraft.sections[0].items[1].options.slice(0,2);
 const created=await call('/teacher','teacher','POST',nextDraft), mappedSheet=created.data.sheet;
 const mapped=items.map((mapping,index)=>index===1?{...mapping,optionMap:{'multi-A':'A','multi-B':'B'}}:mapping);
 const preview=await call(`/teacher/${mappedSheet.id}/mapping/preview`,'teacher','POST',{assessmentId:'fixture-form-a',sourceVersion:mappedSheet.sourceVersion,items:mapped});assert.deepEqual(preview.data.problems,[]);
 assert.equal((await call(`/teacher/${mappedSheet.id}/mapping/apply`,'teacher','POST',{revision:mappedSheet.revision,assessmentId:'fixture-form-a',sourceVersion:mappedSheet.sourceVersion,items:mapped,acknowledgeChanges:true})).status,200);
 const before=structuredClone(attempt.submissions);const reopened=await call(`/teacher/attempt/${assignment}/reopen`,'teacher','POST',{});assert.equal(reopened.status,200);assert.deepEqual(reopened.data.attempt.submissions,before);
 const exported=await call(`/teacher/${sheet.id}/export`);const reopenedRow=exported.data.rows.find(row=>row.assignmentId===assignment);assert.ok(reopenedRow.responses.every(row=>row.grading===null));assert.ok(reopenedRow.gradingHistory.length>0);assert.deepEqual(reopenedRow.submissions,before);
 assert.equal((await call(`/teacher/${sheet.id}/assign`,'teacher','POST',{studentIds:[ids.student],batchId:randomUUID()})).status,409);
 const repeat=await call(`/teacher/${sheet.id}/assign`,'teacher','POST',{studentIds:[ids.student],batchId:randomUUID(),allowRepeat:true});assert.equal(repeat.status,201);assert.notEqual(repeat.data.assignments[0].id,assignment);
});
