const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
const users = {
  teacher: { id: 'teacher', app_metadata: { role: 'teacher' }, user_metadata: {} },
  student: { id: 'student', app_metadata: { role: 'student', class_ids: ['shsat'] }, user_metadata: {} },
  other: { id: 'other', app_metadata: { role: 'student', class_ids: ['shsat'] }, user_metadata: {} },
  outsider: { id: 'outsider', app_metadata: { role: 'student', class_ids: [] }, user_metadata: {} },
};
const assessment = { id: 'exam', classId: 'shsat', title: 'Test exam', status: 'locked', allowCompletedAccess: false, sectionAccess: { english: false, math: false } };
const tables = { student_exam_results: [], student_exam_sessions: [], student_practice_progress: [] };
function stub(relative, exports) { const id = require.resolve(relative); require.cache[id] = { id, filename: id, loaded: true, exports }; }
stub('../src/lib/auth.ts', { getAuthenticatedUser: async header => { const user = users[header?.replace('Bearer ', '')]; return { user, error: user ? null : 'Sign in required' }; }, getEnrolledClassIds: metadata => metadata.class_ids ?? [], getUserRole: user => user.app_metadata.role, isStudentArchived: () => false });
stub('../src/config/assessments.ts', {
  listTeacherAssessments: () => [assessment], listStudentAssessments: classes => classes.includes('shsat') ? [assessment] : [],
  findAssessmentForStudent: (id, classes) => id === 'exam' && classes.includes('shsat') ? assessment : undefined, toStudentAssessmentDetail: value => value,
});
stub('../src/lib/learningPlanStore.ts', { hasAssignedContent: async () => false, assignedContentIds: async () => new Set(), recordPlanCompletion: async () => {}, recordPracticePlanCompletion: async () => {} });
stub('../src/lib/supabase.ts', { supabase: { auth: { admin: { listUsers: async () => ({ data: { users: Object.values(users) }, error: null }), getUserById: async id => ({ data: { user: users[id] }, error: null }) } }, from(table) {
  const filters = []; let single = false;
  return { select() { return this; }, eq(key, value) { filters.push(row => row[key] === value); return this; }, like(key, value) { filters.push(row => String(row[key]).startsWith(value.replace(/%$/, ''))); return this; }, maybeSingle() { single = true; return this; },
    upsert(row) { const old = tables[table].find(item => item.user_id === row.user_id && item.assessment_id === row.assessment_id); if (old) Object.assign(old, structuredClone(row)); else tables[table].push(structuredClone(row)); return Promise.resolve({ error: null }); },
    then(resolve, reject) { const rows = tables[table].filter(row => filters.every(filter => filter(row))); return Promise.resolve({ data: single ? rows[0] ?? null : rows, error: null }).then(resolve, reject); },
  };
} } });
const { createExamResult } = require('../src/shared/examGrading.ts');
const { restoredReentryTimer } = require('../src/shared/examReentry.ts');
const content = { assessmentId: 'exam', title: 'Exam', passageSets: [{ id: 'p', passage: { id: 'p', title: 'Passage', lines: [] }, questions: [{ id: 'e', type: 'multiple_choice', topic: 'Inference', choices: [{ id: 'A', text: 'Yes' }], correctChoiceId: 'A' }] }], mathSection: { id: 'math', questions: [{ id: 'm', type: 'numeric_entry', topic: 'Algebra', correctTextAnswers: ['5'] }] } };
let publishedContent=content;
stub('../src/lib/examContent.ts',{getExamContent:id=>id==='exam'?publishedContent:null});
let server, root;
before(async () => { const express = require('express'), app = express(); app.use(express.json()); app.use('/api/progress', require('../src/routes/progress.ts').progressRouter); app.use('/api/assessments', require('../src/routes/assessments.ts').assessmentsRouter); server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); }); root = `http://127.0.0.1:${server.address().port}/api`; });
after(async () => new Promise(resolve => server.close(resolve)));
beforeEach(() => { Object.values(tables).forEach(rows => rows.splice(0)); const now = Date.now(); tables.student_exam_results.push({ user_id: 'student', assessment_id: 'exam', result: { ...createExamResult(content, { e: 'A', m: '0' }, ['english', 'math']), attemptId: 'original', timerState: { startedAt: now - 60 * 60_000, pausedAt: now, totalPausedMs: 0 } } }); });
async function call(path, token = 'teacher', method = 'GET', body) { const response = await fetch(root + path, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) }); return { status: response.status, data: await response.json() }; }
const permissionPath = '/assessments/teacher/exam/reentry/student';
const latest = () => tables.student_exam_results.find(row => row.user_id === 'student' && row.assessment_id === 'exam').result;
function revision(grant, answers = { e: 'A', m: '5' }, sections = ['english', 'math']) { return { ...createExamResult(content, answers, sections), attemptId: 'original', reentryGrantId: grant.id }; }

test('re-entry resumed on another device uses elapsed time from the latest revised section', () => {
  const initial = { startedAt: 1000, pausedAt: 60000, totalPausedMs: 0 };
  const resumed = { startedAt: 1000, pausedAt: 120000, totalPausedMs: 10000 };
  const grant = { id: 'grant', timerState: initial };
  assert.deepEqual(restoredReentryTimer(grant, { reentryGrantId: 'grant', timerState: resumed }), resumed);
  assert.deepEqual(restoredReentryTimer(grant, { reentryGrantId: 'older-grant', timerState: resumed }), initial);
  assert.deepEqual(restoredReentryTimer(grant, { reentryGrantId: 'grant', timerState: { startedAt: null } }), initial);
});

test('teacher grants only enrolled individual students; other students stay locked and timer keeps original remaining allowance', async () => {
  assert.equal((await call(permissionPath, 'student', 'PUT', { sections: ['math'] })).status, 403);
  assert.equal((await call('/assessments/teacher/exam/reentry/outsider', 'teacher', 'PUT', { sections: ['math'] })).status, 404);
  assert.equal((await call('/assessments/teacher/exam/reentry/other', 'teacher', 'PUT', { sections: ['math'] })).status, 409);
  assert.equal((await call(permissionPath, 'teacher', 'PUT', { sections: ['math'], additionalMinutes: 181 })).status, 400);
  const granted = await call(permissionPath, 'teacher', 'PUT', { sections: ['math'], additionalMinutes: 10 }); assert.equal(granted.status, 200);
  const grant = granted.data.grant;
  assert.equal(grant.attemptId, 'original');
  assert.equal(180 * 60_000 - (grant.timerState.pausedAt - grant.timerState.startedAt - grant.timerState.totalPausedMs), 130 * 60_000);
  const mine = (await call('/assessments/student/exam', 'student')).data.assessment;
  assert.equal(mine.status, 'open'); assert.deepEqual(mine.sectionAccess, { english: false, math: true });
  assert.equal((await call('/assessments/student/exam', 'other')).status, 403);
  assert.equal((await call('/assessments/student', 'other')).data.assessments[0].status, 'locked');
  assert.equal(latest().answers.m, '0');
});

test('re-entry changes only allowed answers, preserves the attempt and original submission, then closes; retries are idempotent', async () => {
  const grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['math'] })).data.grant;
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: { ...revision(grant), reentryGrantId: undefined } })).status, 409);
  const changed = revision(grant, { e: 'WRONG', m: '5' });
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: changed })).status, 200);
  assert.equal(latest().answers.e, 'A'); assert.equal(latest().answers.m, '5'); assert.equal(latest().correct, 2); assert.equal(latest().attemptId, 'original');
  assert.equal((await call(permissionPath)).data.grant.remainingSections.length, 0);
  assert.equal((await call('/assessments/student/exam', 'student')).status, 403);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: changed })).status, 200);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: revision(grant, { e: 'A', m: '2' }) })).status, 403);
  const originals = tables.student_exam_results.filter(row => row.assessment_id.startsWith('__exam_revision__:'));
  assert.equal(originals.length, 1); assert.equal(originals[0].result.answers.m, '0');
  const progress = (await call('/progress/', 'student')).data.progress; assert.equal(progress.examHistory.length, 0); assert.equal(progress.examResults.length, 1);
});

test('each reopened section closes after submission and revoke prevents both answer saves and submission from an open tab', async () => {
  let grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['english', 'math'] })).data.grant;
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: revision(grant, { e: 'B', m: '5' }, ['english']) })).status, 200);
  assert.deepEqual(latest().completedSections, ['english']);
  assert.deepEqual((await call(permissionPath)).data.grant.remainingSections, ['math']);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: revision(grant, { e: 'A', m: '5' }) })).status, 200);
  assert.equal(latest().answers.e, 'B'); assert.equal(latest().answers.m, '5');
  grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['math'] })).data.grant;
  assert.equal((await call(permissionPath, 'teacher', 'DELETE')).status, 200);
  assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', { reentryGrantId: grant.id, answers: { m: '1' }, completedSections: [] })).status, 403);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: revision(grant, { e: 'A', m: '1' }) })).status, 403);
  assert.equal(latest().answers.m, '5');
});

test('open exams keep the same attempt and accept editable drafts without changing submitted grades', async () => {
  assessment.status = 'open'; assessment.sectionAccess = { english: true, math: true };
  try {
    assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: { ...createExamResult(content, { e: 'B', m: '5' }, ['english', 'math']), attemptId: 'invented' } })).status, 403);
    assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', { answers: { e: 'B', m: '5' }, completedSections: [] })).status, 200);
    const session = (await call('/progress/exam-sessions', 'student')).data.sessions.exam;
    assert.deepEqual(session.answers, { e: 'B', m: '5' }); assert.deepEqual(session.completedSections, []);
    assert.deepEqual(latest().answers,{e:'A',m:'0'},'Autosaving a revision does not grade it');
  } finally { assessment.status = 'locked'; assessment.sectionAccess = { english: false, math: false }; }
});

test('replacing active permission preserves its draft window but a fresh permission starts from the current submission', async () => {
  const first = (await call(permissionPath, 'teacher', 'PUT', { sections: ['math'] })).data.grant;
  await call('/progress/exam-sessions/exam', 'student', 'PUT', { reentryGrantId: first.id, answers: { m: '4' }, completedSections: ['english'] });
  const next = (await call(permissionPath, 'teacher', 'PUT', { sections: ['math'], additionalMinutes: 5 })).data.grant;
  assert.notEqual(next.id, first.id); assert.equal(next.draftsFrom, first.grantedAt);
  const session = (await call('/progress/exam-sessions', 'student')).data.sessions.exam;
  assert.equal(session.answers.m, '4'); assert.ok(Date.parse(session.updatedAt) >= Date.parse(next.draftsFrom));
  await call(permissionPath, 'teacher', 'DELETE');
  const fresh = (await call(permissionPath, 'teacher', 'PUT', { sections: ['math'] })).data.grant;
  assert.equal(fresh.draftsFrom, fresh.grantedAt);
});

test('students cannot alias a locked exam through unknown IDs, foreign snapshots, reserved records or teacher-only sources', async () => {
  const result = { ...createExamResult(content, { e: 'A', m: '5' }, ['english', 'math']), attemptId: 'forged' };
  assert.equal((await call('/progress/exam-results/alias', 'student', 'PUT', { result })).status, 400);
  assert.equal((await call('/progress/exam-results/alias', 'student', 'PUT', { result: { ...result, assessmentId: 'alias', analysisContent: { ...content, assessmentId: 'alias' } } })).status, 404);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: { ...result, analysisContent: { ...content, assessmentId: 'another-exam' } } })).status, 400);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: { ...result, source: 'manual' } })).status, 403);
  for (const id of ['__exam_reentry__:exam', '__exam_history__:exam', 'answer-sheet:exam']) {
    assert.equal((await call(`/progress/exam-results/${encodeURIComponent(id)}`, 'student', 'PUT', { result: { ...result, assessmentId: id, analysisContent: { ...content, assessmentId: id } } })).status, 400);
    assert.equal((await call(`/progress/exam-sessions/${encodeURIComponent(id)}`, 'student', 'PUT', { answers: { m: '5' }, completedSections: ['math'] })).status, 400);
  }
  assert.equal((await call('/progress/exam-sessions/alias', 'student', 'PUT', { answers: { m: '5' }, completedSections: ['math'] })).status, 404);
  assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', { assessmentId: 'another-exam', answers: { m: '5' }, completedSections: ['math'] })).status, 400);
  assert.equal((await call('/progress/exam-sessions/exam', 'outsider', 'PUT', { answers: { m: '5' }, completedSections: ['math'] })).status, 403);
  assert.equal(tables.student_exam_results.length, 1); assert.equal(tables.student_exam_sessions.length, 0); assert.equal(latest().answers.m, '0');
});


test('an open exam remains editable after every submission, including with an old individual grant',async()=>{
  const manual=(await call(permissionPath,'teacher','PUT',{sections:['english']})).data.grant;
  assessment.status='open';assessment.sectionAccess={english:true,math:true};
  try{
    const detail=(await call('/assessments/student/exam','student')).data.assessment;
    assert.equal(detail.canEditSubmittedSections,true);assert.equal(detail.allowCompletedAccess,true);
    assert.equal(detail.reentry,undefined);assert.deepEqual(detail.sectionAccess,{english:true,math:true});
    for(const answer of ['B','A','B']){
      const result={...createExamResult(content,{e:answer,m:'5'},['english']),attemptId:'original',reentryGrantId:manual.id};
      assert.equal((await call('/progress/exam-results/exam','student','PUT',{result})).status,200);
      assert.equal(latest().answers.e,answer);assert.equal(latest().attemptId,'original');
      assert.equal((await call('/assessments/student/exam','student')).data.assessment.canEditSubmittedSections,true);
    }
    assert.equal(tables.student_exam_results.filter(row=>row.assessment_id.startsWith('__exam_history__:')).length,0);
  }finally{assessment.status='locked';assessment.sectionAccess={english:false,math:false};}
});

test('newly published question IDs appear in a saved exam and are graded only when their section is submitted',async()=>{
  assessment.status='open';assessment.sectionAccess={english:true,math:true};
  const oldSnapshot=structuredClone(latest().analysisContent),oldEnglish=structuredClone(latest().subjects.find(s=>s.subject==='English Language Arts'));
  const extra={...content.passageSets[0].questions[0],id:'new-english',correctChoiceId:'A'};
  publishedContent={...content,passageSets:[{...content.passageSets[0],questions:[...content.passageSets[0].questions,extra]}]};
  try{
    const detail=(await call('/assessments/student/exam','student')).data.assessment;
    assert.deepEqual(detail.resumeContent.passageSets[0].questions.map(q=>q.id),['e','new-english']);
    assert.deepEqual(latest().analysisContent,oldSnapshot,'Reading the revised content does not alter the original submission');
    const math={...createExamResult(detail.resumeContent,{e:'B',m:'5'},['math']),attemptId:'original'};
    assert.equal((await call('/progress/exam-results/exam','student','PUT',{result:math})).status,200);
    assert.equal(latest().total,2);assert.deepEqual(latest().subjects.find(s=>s.subject==='English Language Arts'),oldEnglish);
    const english={...createExamResult(detail.resumeContent,{e:'A','new-english':'A',m:'0'},['english']),attemptId:'original'};
    assert.equal((await call('/progress/exam-results/exam','student','PUT',{result:english})).status,200);
    assert.equal(latest().total,3);assert.equal(latest().answers.m,'5');assert.equal(latest().answers['new-english'],'A');
    assert.equal(latest().attemptId,'original');assert.equal(tables.student_exam_results.filter(row=>row.assessment_id.startsWith('__exam_history__:')).length,0);
  }finally{publishedContent=content;assessment.status='locked';assessment.sectionAccess={english:false,math:false};}
});

test('closing an exam or section stops edits from an already open browser',async()=>{
  assessment.status='open';assessment.sectionAccess={english:false,math:true};
  try{
    assert.equal((await call('/progress/exam-sessions/exam','student','PUT',{answers:{e:'B',m:'5'},completedSections:[]})).status,200);
    let session=(await call('/progress/exam-sessions','student')).data.sessions.exam;
    assert.equal(session.answers.e,'A');assert.equal(session.answers.m,'5');assert.deepEqual(session.completedSections,['english']);
    const result={...createExamResult(content,{e:'B',m:'5'},['math']),attemptId:'original'};
    assert.equal((await call('/progress/exam-results/exam','student','PUT',{result})).status,200);
    assert.equal(latest().answers.e,'A');
    assessment.status='locked';assessment.sectionAccess={english:false,math:false};
    assert.equal((await call('/assessments/student/exam','student')).status,403);
    assert.equal((await call('/progress/exam-sessions/exam','student','PUT',{answers:{e:'B'},completedSections:[]})).status,403);
    assert.equal((await call('/progress/exam-results/exam','student','PUT',{result})).status,403);
  }finally{assessment.status='locked';assessment.sectionAccess={english:false,math:false};}
});


test('published question edits replace saved wording while new questions are detected by ID',()=>{
  const {resumeExamContent}=require('../src/shared/examResume.ts');
  const changed={...content,passageSets:[{...content.passageSets[0],questions:[{...content.passageSets[0].questions[0],prompt:'Edited question',correctChoiceId:'B'}]}],mathSection:{...content.mathSection,questions:[{...content.mathSection.questions[0],id:'replacement-math'}]}};
  const resumed=resumeExamContent(changed,content);
  assert.equal(resumed.passageSets[0].questions[0].correctChoiceId,'B');
  assert.equal(resumed.passageSets[0].questions[0].prompt,'Edited question');
  assert.equal(resumed.mathSection.questions[0].id,'replacement-math');
  assert.equal(createExamResult(resumed,{e:'A','replacement-math':'5'}).total,2);
  assert.equal(content.mathSection.questions[0].id,'m','Neither input is mutated');
});
