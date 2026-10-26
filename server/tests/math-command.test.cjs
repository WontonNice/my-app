const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'math-command-test-'));
const fixture=require('../../tools/math-command-fixture.cjs').install(root);
const shared=require('../src/shared/mathCommandAnalytics.ts');
const {mathCommandRouter}=require('../src/routes/mathCommand.ts');
const express=require('express');const app=express();app.use(express.json());app.use('/api/math-command',mathCommandRouter);
let server,url;
before(async()=>{server=await new Promise(resolve=>{const value=app.listen(0,'127.0.0.1',()=>resolve(value));});url=`http://127.0.0.1:${server.address().port}/api/math-command`;});
after(()=>{server.close();fs.rmSync(root,{recursive:true,force:true});});
async function request(route,token='teacher',body,method=body?'POST':'GET'){const response=await fetch(url+route,{method,headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,body:await response.json()};}
const catalog=()=>require('../src/lib/mathCommandCatalogStore.ts').readMathCommandCatalog();

test('history uses saved question keys, deduplicates same-attempt records, and excludes unsubmitted math',()=>{
  const q=fixture.data.questions[0],snapshot={...fixture.data.content,mathSection:{...fixture.data.content.mathSection,questions:[q]}};
  const old={assessmentId:'test',attemptId:'first',completedAt:'2026-01-01',completedSections:['math'],answers:{[q.id]:'A'},analysisContent:snapshot};
  const current={...q,correctChoiceId:'B'};
  const records=shared.mathEvidenceFromResults('student',[old,old,{...old,attemptId:'english-only',completedSections:['english']}],[{id:q.id,question:current,sources:[]}],()=>null);
  assert.equal(records.length,1);assert.equal(records[0].status,'correct');assert.equal(records[0].correctAnswer,'A');
  const pending=shared.mathEvidenceFromResults('student',[{...old,analysisContent:{...snapshot,mathSection:{...snapshot.mathSection,questions:[{...q,correctChoiceId:''}]}}}],[],()=>null);
  assert.equal(pending[0].status,'pending');assert.equal(shared.mathQuestionMetrics(pending).accuracy,null);
  const invalid=shared.mathEvidenceFromResults('student',[{...old,analysisContent:{...snapshot,mathSection:{...snapshot.mathSection,questions:[{...q,correctChoiceId:'not-a-choice'}]}}}],[],()=>null);
  assert.equal(invalid[0].status,'pending');assert.equal(shared.mathQuestionMetrics(invalid).accuracy,null);
});
test('attempts, unique students, first-attempt accuracy, and answer distribution remain distinct',()=>{
  const base={id:'1',studentId:'a',questionId:'q',assessmentId:'exam',assessmentTitle:'Exam',attemptId:'one',at:'2026-01-01',answer:'B',correctAnswer:'A',status:'incorrect',category:'Algebra',subcategory:'Equations',diagnosticSkill:'linear',questionNumber:1,prompt:'Q',question:{},previouslyAttempted:false,source:'digital'};
  const rows=[base,{...base,id:'2',attemptId:'two',at:'2026-02-01',status:'correct',answer:'A'},{...base,id:'3',studentId:'b',answer:'',status:'unanswered'}];
  const stats=shared.mathQuestionMetrics(rows);assert.equal(stats.attempts,3);assert.equal(stats.uniqueStudents,2);assert.equal(stats.answeredAttempts,2);assert.equal(stats.firstAttemptAccuracy,0);assert.equal(stats.accuracy,33.3);assert.equal(stats.answerDistribution.length,2);assert.equal(stats.signals.length,0);
  const pendingFirst=shared.mathQuestionMetrics([{...base,status:'pending'},rows[1]]);assert.equal(pendingFirst.accuracy,100);assert.equal(pendingFirst.firstAttemptAccuracy,null);
  const sparse=shared.mathQuestionMetrics([base,...Array.from({length:9},(_,i)=>({...base,id:`pending-${i}`,studentId:`pending-${i}`,status:'pending'}))]);assert.equal(sparse.uniqueStudents,10);assert.equal(sparse.signals.length,0);
});
test('mapped answer sheets retain their released snapshot and manual or pending grades',()=>{
  const q=fixture.data.questions[0],snapshot={...fixture.data.content,mathSection:{...fixture.data.content.mathSection,questions:[q]}};
  const result={assessmentId:'answer-sheet:paper',source:'answer_sheet',attemptId:'released',completedAt:'2026-01-02',completedSections:['math'],answers:{[q.id]:'B'},answerSheet:{analysisContent:snapshot,mapping:{items:[{itemId:'paper-1',questionId:q.id}]},grade:{items:[{itemId:'paper-1',status:'correct'}]}}};
  const rows=shared.mathEvidenceFromResults('student',[result],catalog(),()=>null);
  assert.equal(rows.length,1);assert.equal(rows[0].status,'correct');assert.equal(rows[0].answer,'B');assert.equal(rows[0].correctAnswer,'A');
  result.answerSheet.grade.items[0].status='pending';
  const pending=shared.mathEvidenceFromResults('student',[result],catalog(),()=>null);
  assert.equal(pending[0].status,'pending');assert.equal(shared.mathQuestionMetrics(pending).accuracy,null);
});
test('weakness rules require distinct question and assessment evidence; progression has counts',()=>{
  const student=fixture.users.student;const results=fixture.db.tables.student_exam_results.map(row=>row.result);
  const rows=shared.mathEvidenceFromResults(student.id,results,catalog(),()=>null);
  const rules={...shared.defaultMathWeaknessRules,targetAccuracy:80};
  const skill=shared.mathSkillMetrics(rows,rules).find(row=>row.level==='skill');
  assert.equal(skill.correct,5);assert.equal(skill.total,12);assert.equal(skill.uniqueQuestions,6);assert.equal(skill.needsAttention,true);assert.equal(skill.trend,'Improving');assert.equal(skill.progression.length,2);assert.match(skill.reason,/configured 80%/);
  const repeated=Array.from({length:20},(_,i)=>({...rows[0],id:String(i),attemptId:String(i)}));
  assert.equal(shared.mathSkillMetrics(repeated,rules)[0].needsAttention,false);
  const oneAssessment=rows.map(row=>({...row,assessmentId:'one-assessment'}));
  const one=shared.mathSkillMetrics(oneAssessment,rules)[0];assert.equal(one.assessments,1);assert.equal(one.needsAttention,false);assert.equal(one.trend,'Insufficient data');
});
test('rule-based quotas exclude seen and assigned questions and report honest shortfalls',()=>{
  const records=catalog(),seen=new Set(records.slice(0,6).map(row=>row.id)),assigned=new Set([records[6].id]);
  const selection=shared.selectMathAssignment(records,seen,assigned,{count:10,quotas:{easy:2,medium:4,hard:3,expert:1},excludeSeen:true});
  assert.equal(selection.selected.length,10);assert.ok(selection.selected.every(row=>!seen.has(row.id)&&!assigned.has(row.id)));
  const shortage=shared.selectMathAssignment(records,seen,assigned,{count:100,excludeSeen:true});assert.ok(shortage.shortfall>0);assert.match(shortage.warnings.join(' '),/No question was invented/);
  assert.throws(()=>shared.selectMathAssignment(records,seen,assigned,{questionIds:[records[0].id],excludeSeen:true}),/already seen/);
});
test('exact duplicate records are excluded without collapsing numeric variants; intentional review survives reorder',()=>{
  const first=catalog()[0],copy={...first,id:'copy',question:{...first.question,id:'copy'}},variant=catalog()[1];
  const records=[first,copy,variant];
  const fresh=shared.selectMathAssignment(records,new Set(),new Set(),{count:3});assert.equal(fresh.selected.length,2);assert.equal(fresh.shortfall,1);
  assert.throws(()=>shared.selectMathAssignment(records,new Set(),new Set(),{questionIds:[first.id,copy.id]}),/exact copies/);
  assert.throws(()=>shared.selectMathAssignment(records,new Set([first.id]),new Set(),{questionIds:[copy.id]}),/already seen/);
  const review=shared.selectMathAssignment(records,new Set([first.id]),new Set(),{count:2,questionIds:[variant.id,first.id],excludeSeen:true,reviewCount:1});assert.equal(review.selected.length,2);
});
test('staff endpoints reject anonymous/student users and student assignments enforce ownership',async()=>{
  assert.equal((await request('/students','bad')).status,401);
  assert.equal((await request('/students','student')).status,403);
  assert.equal((await request(`/students/${fixture.studentId}/insights`,'student')).status,403);
  assert.equal((await request('/catalog','student')).status,403);
  assert.equal((await request('/student/assignments/00000000-0000-4000-8000-000000000000','other')).status,404);
});
test('user-editable role metadata cannot grant staff access to analytics or catalog mutation',async()=>{
  fixture.users.forged={...fixture.users.other,app_metadata:{class_ids:['shsat']},user_metadata:{role:'admin'}};
  for(const route of ['/students','/catalog','/overview',`/students/${fixture.studentId}/insights`,`/questions/qa-math-001/performance`])assert.equal((await request(route,'forged')).status,403);
  assert.equal((await request('/preferences','forged',{rules:{targetAccuracy:0}},'PUT')).status,403);
  assert.equal((await request('/bulk-preview','forged',{questionIds:['qa-math-001'],patch:{difficulty:'hard'}})).status,403);
  assert.equal((await request(`/students/${fixture.studentId}/assignment-preview`,'forged',{count:1})).status,403);
  delete fixture.users.forged;
});
test('student insights expose exact saved evidence and remaining inventory without invented values',async()=>{
  const insights=await request(`/students/${fixture.studentId}/insights`);assert.equal(insights.status,200);assert.equal(insights.body.summary.attempts,12);assert.equal(insights.body.summary.correct,5);assert.ok(insights.body.remaining[0].remaining>0);
  const evidence=await request(`/students/${fixture.studentId}/evidence?status=incorrect`);assert.equal(evidence.status,200);assert.ok(evidence.body.items.length);assert.ok(evidence.body.items.every(row=>row.answer==='B'&&row.correctAnswer==='A'));
  const other=await request(`/students/${fixture.otherId}/insights`);assert.equal(other.body.summary.accuracy,null);assert.equal(other.body.availableEvidence,0);
});
test('preview then assign uses existing assignments; saves, rejects stale writes, grades and preserves history',async()=>{
  const before=structuredClone(fixture.db.tables.student_exam_results);
  const preview=await request(`/students/${fixture.studentId}/assignment-preview`,'teacher',{count:10,quotas:{easy:2,medium:4,hard:3,expert:1},excludeSeen:true});assert.equal(preview.status,200,JSON.stringify(preview.body));assert.equal(preview.body.selected,10);
  const body={previewToken:preview.body.previewToken,questionIds:preview.body.questionIds,title:'Synthetic personalized math',batchId:'55555555-5555-4555-8555-555555555555'};
  const created=await request(`/students/${fixture.studentId}/assignments`,'teacher',body);assert.equal(created.status,201,JSON.stringify(created.body));const task=created.body.assignment;
  assert.equal(task.kind,'practice');assert.equal(fixture.db.tables.student_assignments.length,1);assert.equal(task.events[0].changes.mathCommand.questionIds.length,10);
  assert.equal((await request(`/student/assignments/${task.id}`,'other')).status,404);
  const opened=await request(`/student/assignments/${task.id}`,'student');assert.equal(opened.status,200,JSON.stringify(opened.body));assert.equal(opened.body.questions.length,10);assert.ok(opened.body.questions.every(q=>!q.correctChoiceId&&!q.explanation));
  const answers=Object.fromEntries(preview.body.questionIds.map(id=>[id,'A']));
  const saved=await request(`/student/assignments/${task.id}/responses`,'student',{revision:opened.body.revision,answers},'PUT');assert.equal(saved.status,200);
  assert.equal((await request(`/student/assignments/${task.id}/responses`,'student',{revision:opened.body.revision,answers:{}},'PUT')).status,409);
  const submitted=await request(`/student/assignments/${task.id}/submit`,'student',{revision:saved.body.revision,answers});assert.equal(submitted.status,200,JSON.stringify(submitted.body));assert.equal(submitted.body.result.correct,10);assert.equal(submitted.body.assignment.status,'completed');
  assert.deepEqual(fixture.db.tables.student_exam_results.slice(0,2),before);
  assert.equal(fixture.db.tables.student_exam_results.length,3);
  assert.equal((await request(`/students/${fixture.studentId}/assignments`,'teacher',body)).status,200);
  assert.equal(fixture.db.tables.student_assignments.length,1);
});
test('assignment filters remain exact and confirmation rejects changed student history',async()=>{
  const rules={count:2,catalogFilters:{difficulty:['hard'],collectionQuestionIds:['qa-math-007','qa-math-008','qa-math-009']},excludeSeen:true};
  const preview=await request(`/students/${fixture.otherId}/assignment-preview`,'teacher',rules);assert.equal(preview.status,200,JSON.stringify(preview.body));assert.equal(preview.body.selected,2);assert.ok(preview.body.questions.every(q=>q.difficulty==='hard'));
  const question=fixture.data.questions.find(q=>q.id===preview.body.questionIds[0]);
  const result={assessmentId:'new-seen-after-preview',attemptId:'new',completedSections:['math'],completedAt:new Date().toISOString(),answers:{[question.id]:'A'},analysisContent:{...fixture.data.content,mathSection:{...fixture.data.content.mathSection,questions:[question]}}};
  fixture.db.tables.student_exam_results.push({user_id:fixture.otherId,assessment_id:result.assessmentId,result,updated_at:result.completedAt});
  const created=await request(`/students/${fixture.otherId}/assignments`,'teacher',{previewToken:preview.body.previewToken,questionIds:preview.body.questionIds,batchId:'88888888-8888-4888-8888-888888888888'});assert.equal(created.status,409);assert.match(created.body.message,/history or assignments changed/);
  fixture.db.tables.student_exam_results.pop();
});
test('remaining counts partition inventory and include difficulty/source breakdowns',async()=>{
  const {body}=await request(`/students/${fixture.studentId}/insights`);
  for(const group of [...body.remaining,...body.remainingBreakdowns.difficulty,...body.remainingBreakdowns.source])assert.equal(group.total,group.seen+group.assigned+group.planned+group.completed+group.remaining+group.unready);
  assert.equal(body.remainingBreakdowns.difficulty.reduce((sum,row)=>sum+row.total,0),64);
  assert.equal(body.remaining[0].seen,16);assert.equal(body.remaining[0].assigned,0);
});
test('aggregate refresh fetches only changed payloads, respects regrades, and includes legacy metadata history',async()=>{
  const service=require('../src/lib/mathCommandAnalytics.ts');
  service.invalidateMathPerformance();await service.mathPerformance();fixture.db.queryLog.length=0;
  service.invalidateMathPerformance();const unchanged=await service.mathPerformance();
  assert.ok(fixture.db.queryLog.some(q=>q.projection==='user_id,assessment_id,updated_at,completed_at'));
  assert.equal(fixture.db.queryLog.filter(q=>q.table==='student_exam_results'&&q.projection.split(',').includes('result')).length,0);
  const row=fixture.db.tables.student_exam_results[0],old=structuredClone(row),question=fixture.data.questions[0];
  const beforeCorrect=unchanged.metrics[question.id].correct;
  row.result.answers[question.id]='B';row.updated_at=new Date().toISOString();fixture.db.queryLog.length=0;
  service.invalidateMathPerformance();const regraded=await service.mathPerformance();assert.equal(regraded.metrics[question.id].correct,beforeCorrect-1);
  assert.equal(fixture.db.queryLog.filter(q=>q.table==='student_exam_results'&&q.projection.split(',').includes('result')).length,1);
  assert.ok(fixture.db.queryLog.every(q=>!q.mutation));
  Object.assign(row,old);row.updated_at=new Date(Date.now()+1).toISOString();
  fixture.users.other.user_metadata.learning_progress={examResults:[{...old.result,assessmentId:'legacy-metadata',attemptId:'legacy-metadata',analysisContent:{...old.result.analysisContent,mathSection:{...old.result.analysisContent.mathSection,questions:[question]}},answers:{[question.id]:'A'}}]};
  service.invalidateMathPerformance();const global=await service.mathPerformance(),student=service.mathStudentInsights(fixture.users.other,await service.loadMathStudent(fixture.users.other));
  assert.equal(student.summary.attempts,1);assert.equal(global.metrics[question.id].attempts,3);
  delete fixture.users.other.user_metadata.learning_progress;service.invalidateMathPerformance();
});
test('storage failures are explicit rather than fabricated zero performance',async()=>{
  fixture.db.setFailure(true);const response=await request(`/students/${fixture.studentId}/insights`);fixture.db.setFailure(false);
  assert.equal(response.status,503);assert.match(response.body.message,/temporarily unavailable|migration|storage/i);
});
test('submission retry repairs deferred sync without changing submitted responses or duplicating results',async()=>{
  const preview=await request(`/students/${fixture.otherId}/assignment-preview`,'teacher',{count:1,excludeSeen:true});assert.equal(preview.status,200);
  const created=await request(`/students/${fixture.otherId}/assignments`,'teacher',{previewToken:preview.body.previewToken,questionIds:preview.body.questionIds,batchId:'99999999-9999-4999-8999-999999999999'});assert.equal(created.status,201);
  const id=created.body.assignment.id,opened=await request(`/student/assignments/${id}`,'other'),question=preview.body.questionIds[0],before=fixture.db.tables.student_exam_results.length;
  fixture.db.failNextMutation('student_exam_results');
  const failed=await request(`/student/assignments/${id}/submit`,'other',{revision:opened.body.revision,answers:{[question]:'A'}});assert.equal(failed.status,503);assert.match(failed.body.message,/submitted answers are saved/);
  const refreshed=await request(`/student/assignments/${id}`,'other');assert.equal(refreshed.status,200);assert.equal(refreshed.body.assignment.status,'completed');assert.equal(refreshed.body.answers[question],'A');
  const retried=await request(`/student/assignments/${id}/submit`,'other',{revision:opened.body.revision,answers:{[question]:'B'}});assert.equal(retried.status,200);assert.equal(retried.body.result.correct,1);assert.equal(retried.body.answers[question],'A');assert.equal(retried.body.assignment.status,'completed');
  assert.equal(fixture.db.tables.student_exam_results.length,before+1);
  await request(`/student/assignments/${id}/submit`,'other',{revision:opened.body.revision,answers:{}});assert.equal(fixture.db.tables.student_exam_results.length,before+1);
});
test('hosted HTTP metadata uses durable storage and never falls back to local files',async()=>{
  const file=path.join(root,'server/data/math-command.json'),before=fs.readFileSync(file),previous=process.env.MATH_COMMAND_STORAGE;
  try{
    process.env.MATH_COMMAND_STORAGE='supabase';
    const overview=await request('/overview');assert.equal(overview.status,200);assert.equal(fixture.db.tables.math_command_metadata.length,0,'read-only requests do not seed data');
    const preview=await request('/bulk-preview','teacher',{revision:overview.body.revision,questionIds:['qa-math-001'],patch:{difficulty:'expert'}});assert.equal(preview.status,200,JSON.stringify(preview.body));
    const applied=await request('/bulk-apply','teacher',{token:preview.body.token});assert.equal(applied.status,200,JSON.stringify(applied.body));
    assert.equal(fixture.db.tables.math_command_metadata[0].state.metadata['qa-math-001'].difficulty,'expert');assert.deepEqual(fs.readFileSync(file),before);
    const local=JSON.parse(before);local.metadata['qa-math-001'].difficulty='medium';fs.writeFileSync(file,JSON.stringify(local));
    const detail=await request('/catalog/qa-math-001');assert.equal(detail.status,200);assert.equal(detail.body.row.difficulty,'expert');
    fixture.db.setFailure(true);const failed=await request('/overview');fixture.db.setFailure(false);assert.equal(failed.status,503);assert.match(failed.body.message,/no local fallback/);
  }finally{fixture.db.setFailure(false);if(previous===undefined)delete process.env.MATH_COMMAND_STORAGE;else process.env.MATH_COMMAND_STORAGE=previous;fs.writeFileSync(file,before);delete fixture.db.tables.math_command_metadata;}
});
test('normal command-center modules have no AI clients, embeddings, or inference endpoints',()=>{
  for(const file of ['src/shared/mathCommandAnalytics.ts','src/lib/mathCommandAnalytics.ts','src/routes/mathCommand.ts']){const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8');assert.doesNotMatch(source,/api\.openai|anthropic|generativelanguage|embeddings\.create|chat\.completions|responses\.create|OPENAI_API_KEY/i);}
});
