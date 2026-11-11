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
let secondAssessment = null;
const configuredAssessments = () => secondAssessment ? [assessment, secondAssessment] : [assessment];
const tables = { student_exam_results: [], student_exam_sessions: [], student_practice_progress: [] };
const reads = [], unavailable = new Set();
function stub(relative, exports) { const id = require.resolve(relative); require.cache[id] = { id, filename: id, loaded: true, exports }; }
stub('../src/lib/auth.ts', { getAuthenticatedUser: async header => { const user = users[header?.replace('Bearer ', '')]; return { user, error: user ? null : 'Sign in required' }; }, getEnrolledClassIds: metadata => metadata.class_ids ?? [], getUserRole: user => user.app_metadata.role, isStudentArchived: () => false });
stub('../src/lib/assessmentAccess.ts', {resolveAssessmentAccess:async value=>value,resolveAssessmentAccessList:async values=>values,assessmentAccessErrorHandler:(error,_request,_response,next)=>next(error)});
stub('../src/config/assessments.ts', {
  listTeacherAssessments: configuredAssessments, listStudentAssessments: classes => classes.includes('shsat') ? configuredAssessments() : [],
  findAssessmentForStudent: (id, classes) => classes.includes('shsat') ? configuredAssessments().find(item => item.id === id) : undefined, toStudentAssessmentDetail: value => value,
});
stub('../src/lib/learningPlanStore.ts', { hasAssignedContent: async () => false, assignedContentIds: async () => new Set(), recordPlanCompletion: async () => {}, recordPracticePlanCompletion: async () => {} });
stub('../src/lib/supabase.ts', { supabase: { auth: { admin: { listUsers: async () => ({ data: { users: Object.values(users) }, error: null }), getUserById: async id => ({ data: { user: users[id] }, error: null }) } }, from(table) {
  const filters = []; let single = false;
  return { select() { return this; }, eq(key, value) { filters.push(row => row[key] === value); return this; }, in(key, values) { filters.push(row => values.includes(row[key])); return this; }, like(key, value) { filters.push(row => String(row[key]).startsWith(value.replace(/%$/, ''))); return this; }, maybeSingle() { single = true; return this; },
    upsert(row) { if (unavailable.has(table)) return Promise.resolve({ error: { message: 'Unavailable' } }); const old = tables[table].find(item => item.user_id === row.user_id && item.assessment_id === row.assessment_id); if (old) Object.assign(old, structuredClone(row)); else tables[table].push(structuredClone(row)); return Promise.resolve({ error: null }); },
    then(resolve, reject) { const rows = tables[table].filter(row => filters.every(filter => filter(row))); reads.push({ table, rows: structuredClone(rows) }); return Promise.resolve({ data: unavailable.has(table) ? null : single ? rows[0] ?? null : rows, error: unavailable.has(table) ? { message: 'Unavailable' } : null }).then(resolve, reject); },
  };
} } });
const { createExamResult } = require('../src/shared/examGrading.ts');
const { restoredReentryTimer } = require('../src/shared/examReentry.ts');
const content = { assessmentId: 'exam', title: 'Exam', passageSets: [{ id: 'p', passage: { id: 'p', title: 'Passage', lines: [] }, questions: [{ id: 'e', type: 'multiple_choice', topic: 'Inference', choices: [{ id: 'A', text: 'Yes' }], correctChoiceId: 'A' }] }], mathSection: { id: 'math', questions: [{ id: 'm', type: 'numeric_entry', topic: 'Algebra', correctTextAnswers: ['5'] }] } };
let publishedContent=content;
const activityReleases=new Map();
stub('../src/lib/examContent.ts',{getActivityRelease:(id,releaseId)=>activityReleases.get(releaseId)?.assessmentId===id?structuredClone(activityReleases.get(releaseId)):null,getExamContent:id=>id==='exam'?publishedContent:id===secondAssessment?.id?{...content,assessmentId:id,title:secondAssessment.title}:null});
let server, root;
before(async () => { const express = require('express'), app = express(); app.use(express.json()); app.use('/api/progress', require('../src/routes/progress.ts').progressRouter); app.use('/api/assessments', require('../src/routes/assessments.ts').assessmentsRouter); server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); }); root = `http://127.0.0.1:${server.address().port}/api`; });
after(async () => new Promise(resolve => server.close(resolve)));
beforeEach(() => { reads.length = 0; unavailable.clear(); Object.values(tables).forEach(rows => rows.splice(0)); const now = Date.now(); tables.student_exam_results.push({ user_id: 'student', assessment_id: 'exam', result: { ...createExamResult(content, { e: 'A', m: '0' }, ['english', 'math']), attemptId: 'original', timerState: { startedAt: now - 60 * 60_000, pausedAt: now, totalPausedMs: 0 } } }); });
async function call(path, token = 'teacher', method = 'GET', body) { const response = await fetch(root + path, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) }); return { status: response.status, data: await response.json() }; }
const permissionPath = '/assessments/teacher/exam/reentry/student';
const latest = () => tables.student_exam_results.find(row => row.user_id === 'student' && row.assessment_id === 'exam').result;

test('withdrawing a timer-only override restores open sections without interrupting the active draft', async () => {
  const originalAssessment = structuredClone(assessment);
  try {
    Object.assign(assessment, { status: 'open', allowCompletedAccess: true, sectionAccess: { english: true, math: true } });
    const grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['english', 'math'], resetTimer: true })).data.grant;
    assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: revision(grant, { e: 'B', m: '0' }, ['english']) })).status, 200);
    const navigation = { subject: 'math', english: { screen: 'endSection' }, math: { screen: 'mathQuestion', questionId: 'm' } };
    const draft = { reentryGrantId: grant.id, answers: { e: 'B', m: '5' }, completedSections: ['english'], navigation };
    assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', draft)).status, 200);
    assert.equal((await call('/assessments/student/exam', 'student')).data.assessment.sectionAccess.english, false);
    const resultBefore = structuredClone(latest());
    const sessionBefore = structuredClone((await call('/progress/exam-sessions', 'student')).data.sessions.exam);

    // The live recovery changes only the timer-only permission, never student work.
    delete tables.student_exam_results.find(row => row.assessment_id === '__exam_reentry__:exam').result.resetTimer;

    const reopened = (await call('/assessments/student/exam', 'student')).data.assessment;
    assert.deepEqual(reopened.sectionAccess, { english: true, math: true });
    assert.equal(reopened.canEditSubmittedSections, true);
    assert.equal(reopened.reentry, undefined);
    assert.deepEqual(latest(), resultBefore);
    assert.deepEqual((await call('/progress/exam-sessions', 'student')).data.sessions.exam, sessionBefore);
    assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', draft)).status, 200, 'the already-open Math tab can keep saving');
    assert.deepEqual((await call('/progress/exam-sessions', 'student')).data.sessions.exam.answers, { e: 'B', m: '5' });
    assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', { ...draft, reentryGrantId: undefined, answers: { e: 'A', m: '5' } })).status, 200, 'English can be revised after refresh');
  } finally { Object.assign(assessment, originalAssessment); }
});

test('autosaves read only the current exam, grant and session even with a large history', async () => {
  const grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['math'] })).data.grant;
  const navigation = { subject: 'english', english: { screen: 'passage', passageSetId: 'p', questionId: 'e' } };
  tables.student_exam_sessions.push({ user_id: 'student', assessment_id: 'exam', answers: { e: 'A' }, completed_sections: ['english'], status: 'in_progress', updated_at: new Date().toISOString(), navigation });
  for (let i = 0; i < 1000; i++) {
    tables.student_exam_results.push({ user_id: 'student', assessment_id: `old-${i}`, result: { answers: { unrelated: 'B' } } });
    tables.student_exam_sessions.push({ user_id: 'student', assessment_id: `old-${i}`, answers: { unrelated: 'B' } });
  }
  tables.student_exam_results.push({ user_id: 'other', assessment_id: 'exam', result: { answers: { stolen: 'B' } } });
  tables.student_exam_sessions.push({ user_id: 'other', assessment_id: 'exam', answers: { stolen: 'B' } });
  reads.length = 0;
  const saved = await call('/progress/exam-sessions/exam', 'student', 'PUT', { reentryGrantId: grant.id, answers: { m: '5' }, completedSections: [] });
  assert.equal(saved.status, 200);
  assert.deepEqual(saved.data.session.answers, { e: 'A', m: '5' });
  assert.deepEqual(saved.data.session.navigation, navigation);
  assert.equal(reads.length, 3, 'one grant/result lookup and two compatible session lookups');
  assert.equal(reads.flatMap(read => read.rows).length, 3, 'history size does not increase autosave read volume');
  for (const row of reads.flatMap(read => read.rows)) {
    assert.equal(row.user_id, 'student');
    assert.ok(['exam', '__exam_reentry__:exam', '__exam_session__:exam'].includes(row.assessment_id));
  }
});

test('scoped autosaves retain legacy session fallback and fresh revocation checks', async () => {
  const grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['math'] })).data.grant;
  const navigation = { subject: 'math', math: { screen: 'mathQuestion', questionId: 'm' } };
  tables.student_exam_results.push({ user_id: 'student', assessment_id: '__exam_session__:exam', result: { answers: { m: '2' }, completedSections: ['english'], status: 'in_progress', updatedAt: new Date().toISOString(), navigation } });
  unavailable.add('student_exam_sessions');
  const body = { reentryGrantId: grant.id, answers: { m: '5' }, completedSections: [] };
  const saved = await call('/progress/exam-sessions/exam', 'student', 'PUT', body);
  assert.equal(saved.status, 200); assert.equal(saved.data.storage, 'results-database-fallback');
  assert.deepEqual(saved.data.session.navigation, navigation);
  tables.student_exam_results.find(row => row.assessment_id === '__exam_reentry__:exam').result.revokedAt = new Date().toISOString();
  assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', body)).status, 403);
});

test('unfinished bank activities keep their release across publication, reload, saves, and server grading',async()=>{
  const original=structuredClone(assessment);
  const first={...structuredClone(content),releaseId:'aaaaaaaaaaaaaaaa'},second={...structuredClone(content),releaseId:'bbbbbbbbbbbbbbbb'};
  second.mathSection.questions[0].correctTextAnswers=['9'];
  activityReleases.set(first.releaseId,first);activityReleases.set(second.releaseId,second);
  tables.student_exam_results.splice(0);
  try{
    Object.assign(assessment,{status:'open',sectionAccess:{english:true,math:true},assembly:{publishedReleaseId:first.releaseId}});publishedContent=first;
    const save=navigation=>call('/progress/exam-sessions/exam','student','PUT',{answers:{e:'A',m:'5'},completedSections:[],navigation});
    assert.equal((await save({subject:'math',activityReleaseId:first.releaseId})).status,200);
    assessment.assembly.publishedReleaseId=second.releaseId;publishedContent=second;
    const resumed=await call('/assessments/student/exam','student');assert.equal(resumed.status,200);
    assert.equal(resumed.data.assessment.resumeContent.releaseId,first.releaseId);
    const saved=await save({subject:'math',activityReleaseId:second.releaseId});assert.equal(saved.status,200);
    assert.equal(saved.data.session.navigation.activityReleaseId,first.releaseId,'Existing attempts cannot silently switch versions');
    const submission={...createExamResult(second,{e:'A',m:'5'},['english','math']),attemptId:'release-attempt'};
    assert.equal((await call('/progress/exam-results/exam','student','PUT',{result:submission})).status,200);
    assert.equal(latest().analysisContent.releaseId,first.releaseId);assert.equal(latest().correct,2);
  }finally{delete assessment.assembly;Object.assign(assessment,original);publishedContent=content;activityReleases.clear();}
});

test('saving an identical passage in another exam preserves each exam result and snapshot', async () => {
  const original = structuredClone(latest());
  secondAssessment = { ...assessment, id: 'exam-two', title: 'Second exam', status: 'open', sectionAccess: { english: true, math: true } };
  try {
    const secondContent = { ...content, assessmentId: secondAssessment.id, title: secondAssessment.title };
    const result = { ...createExamResult(secondContent, { e: 'B', m: '5' }, ['english', 'math']), attemptId: original.attemptId };
    assert.equal((await call('/progress/exam-results/exam-two', 'student', 'PUT', { result })).status, 200);
    assert.deepEqual(latest(), original);
    const saved = tables.student_exam_results.find(row => row.assessment_id === 'exam-two').result;
    assert.equal(saved.answers.e, 'B');
    assert.equal(saved.analysisContent.assessmentId, 'exam-two');
    const progress = (await call('/progress/', 'student')).data.progress;
    assert.deepEqual(progress.examResults.map(row => row.assessmentId).sort(), ['exam', 'exam-two']);
    assert.equal(progress.examHistory.length, 0, 'The other exam is independent, not a replacement attempt');
  } finally { secondAssessment = null; }
});
function revision(grant, answers = { e: 'A', m: '5' }, sections = ['english', 'math']) { return { ...createExamResult(content, answers, sections), attemptId: 'original', reentryGrantId: grant.id }; }

test('timer reset restores exactly three hours without clearing answers or creating another attempt', async () => {
  delete latest().timerState;
  delete latest().totalTimeSeconds;
  const original = structuredClone(latest());
  assessment.status = 'open';
  try {
    const granted = await call(permissionPath, 'teacher', 'PUT', { sections: ['english', 'math'], resetTimer: true, additionalMinutes: 90 });
    assert.equal(granted.status, 200);
    const grant = granted.data.grant;
    assert.equal(grant.attemptId, original.attemptId);
    assert.equal(grant.additionalMinutes, 0);
    assert.equal(grant.timerState.pausedAt - grant.timerState.startedAt - grant.timerState.totalPausedMs, 0);
    assert.deepEqual(latest(), original);
    assert.equal((await call('/assessments/student/exam', 'student')).data.assessment.reentry.id, grant.id);
    assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: revision(grant) })).status, 200);
    assert.equal((await call('/progress/', 'student')).data.progress.examHistory.length, 0);
  } finally { assessment.status = 'locked'; }
});

test('a teacher-authorized second attempt starts blank and saves both results across section submissions and retries', async () => {
  const original = structuredClone(latest());
  tables.student_exam_sessions.push({ user_id: 'student', assessment_id: 'exam', answers: { e: 'A', m: '0' }, completed_sections: ['english', 'math'], status: 'submitted', updated_at: '2020-01-01T00:00:00Z', navigation: { subject: 'math', english: { screen: 'passage', passageSetId: 'p', questionId: 'e' }, math: { screen: 'mathQuestion', questionId: 'm' } } });
  const granted = await call(permissionPath, 'teacher', 'PUT', { sections: ['english', 'math'], newAttempt: true });
  assert.equal(granted.status, 200);
  const grant = granted.data.grant;
  assert.notEqual(grant.attemptId, original.attemptId);
  assert.equal(grant.previousAttemptId, original.attemptId);
  assert.equal(grant.resetAnswers, true);
  assert.equal(grant.timerState.pausedAt - grant.timerState.startedAt - grant.timerState.totalPausedMs, 0);
  assert.deepEqual(latest(), original, 'Granting access must not replace the first result');
  assert.deepEqual((await call('/assessments/student/exam', 'student')).data.assessment.reentry.remainingSections, ['english', 'math']);
  assert.equal((await call('/assessments/student/exam', 'other')).status, 403);
  assert.equal((await call(permissionPath, 'teacher', 'PUT', { sections: ['english', 'math'], newAttempt: true })).status, 409);
  const draft = await call('/progress/exam-sessions/exam', 'student', 'PUT', { reentryGrantId: grant.id, answers: {}, completedSections: [] });
  assert.equal(draft.status, 200);
  assert.deepEqual(draft.data.session.answers, {});
  assert.deepEqual(draft.data.session.completedSections, []);
  assert.equal(draft.data.session.navigation.english, undefined);
  assert.equal(draft.data.session.navigation.math, undefined);
  const submit = (answers, sections) => ({ ...revision(grant, answers, sections), attemptId: grant.attemptId });
  const english = submit({ e: 'B' }, ['english']);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: revision(grant) })).status, 403, 'Old attempt ID cannot be submitted under the new grant');
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: english })).status, 200);
  assert.deepEqual(latest().completedSections, ['english']);
  assert.equal(latest().answers.m, undefined, 'Old Math answers must not carry over');
  assert.deepEqual((await call(permissionPath)).data.grant.remainingSections, ['math']);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: english })).status, 200);
  const math = submit({ e: 'A', m: '5' }, ['english', 'math']);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: math })).status, 200);
  assert.deepEqual(latest().answers, { e: 'B', m: '5' }, 'Submitted English remains protected');
  const retry = submit({ e: 'B', m: '5' }, ['english', 'math']);
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result: retry })).status, 200);
  const archived = tables.student_exam_results.filter(row => row.assessment_id.startsWith('__exam_history__:'));
  assert.equal(archived.length, 1);
  assert.deepEqual(archived[0].result, original);
  const progress = (await call('/progress/', 'student')).data.progress;
  assert.equal(progress.examResults.length, 1);
  assert.equal(progress.examResults[0].attemptId, grant.attemptId);
  assert.equal(progress.examHistory.length, 1);
  assert.equal(progress.examHistory[0].attemptId, original.attemptId);
  assert.deepEqual((await call(permissionPath)).data.grant.remainingSections, []);
});

test('new-attempt permissions validate completion, staff access and flags, and revoke stale tabs even on open exams', async () => {
  const input = { sections: ['english', 'math'], newAttempt: true };
  assert.equal((await call(permissionPath, 'student', 'PUT', input)).status, 403);
  assert.equal((await call(permissionPath, 'teacher', 'PUT', { ...input, newAttempt: 'true' })).status, 400);
  assert.equal((await call(permissionPath, 'teacher', 'PUT', { ...input, resetTimer: 'true' })).status, 400);
  assert.equal((await call(permissionPath, 'teacher', 'PUT', { ...input, sections: ['math'] })).status, 400);
  latest().completedSections = ['english'];
  assert.equal((await call(permissionPath, 'teacher', 'PUT', input)).status, 400);
  latest().completedSections = ['english', 'math'];
  assessment.status = 'open';
  try {
    const grant = (await call(permissionPath, 'teacher', 'PUT', input)).data.grant;
    assert.equal((await call('/assessments/student/exam', 'student')).data.assessment.reentry.id, grant.id);
    assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', { answers: {}, completedSections: [] })).status, 409);
    await call(permissionPath, 'teacher', 'DELETE');
    const result = { ...revision(grant), attemptId: grant.attemptId };
    assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result })).status, 403);
    assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', { reentryGrantId: grant.id, answers: {}, completedSections: [] })).status, 403);
    assert.equal(latest().attemptId, 'original');
  } finally { assessment.status = 'locked'; }
});

test('a failed history write leaves the first result and retake permission intact for a safe retry', async () => {
  delete latest().attemptId; // Older exams also need a stable history identity.
  const original = structuredClone(latest());
  const grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['english', 'math'], newAttempt: true })).data.grant;
  const result = { ...revision(grant), attemptId: grant.attemptId };
  const { supabase } = require('../src/lib/supabase.ts');
  const from = supabase.from;
  supabase.from = table => {
    const query = from(table), upsert = query.upsert;
    query.upsert = row => String(row.assessment_id).startsWith('__exam_history__:') ? Promise.resolve({ error: { message: 'Storage unavailable' } }) : upsert(row);
    return query;
  };
  try {
    assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result })).status, 503);
    assert.deepEqual(latest(), original);
    assert.deepEqual((await call(permissionPath)).data.grant.remainingSections, ['english', 'math']);
  } finally { supabase.from = from; }
  assert.equal((await call('/progress/exam-results/exam', 'student', 'PUT', { result })).status, 200);
  const history = tables.student_exam_results.filter(row => row.assessment_id.startsWith('__exam_history__:'));
  assert.equal(history.length, 1);
  assert.deepEqual(history[0].result, { ...original, attemptId: grant.previousAttemptId });
  assert.equal(latest().attemptId, grant.attemptId);
});

test('re-entry resumed on another device uses elapsed time from the latest revised section', () => {
  const initial = { startedAt: 1000, pausedAt: 60000, totalPausedMs: 0 };
  const resumed = { startedAt: 1000, pausedAt: 120000, totalPausedMs: 10000 };
  const grant = { id: 'grant', timerState: initial };
  assert.deepEqual(restoredReentryTimer(grant, { reentryGrantId: 'grant', timerState: resumed }), resumed);
  assert.deepEqual(restoredReentryTimer(grant, { reentryGrantId: 'older-grant', timerState: resumed }), initial);
  assert.deepEqual(restoredReentryTimer(grant, { reentryGrantId: 'grant', timerState: { startedAt: null } }), initial);
});

test('resume positions round-trip through cloud sessions; legacy saves preserve both section positions', async () => {
  const grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['english', 'math'] })).data.grant;
  const draft = { reentryGrantId: grant.id, answers: { e: 'A' }, completedSections: [] };
  const english = { screen: 'passage', passageSetId: 'p', questionId: 'e' };
  assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', { ...draft, navigation: { subject: 'english', english } })).status, 200);
  const math = { screen: 'mathQuestion', questionId: 'm' };
  await call('/progress/exam-sessions/exam', 'student', 'PUT', { ...draft, navigation: { subject: 'math', math } });
  await call('/progress/exam-sessions/exam', 'student', 'PUT', draft);
  const session = (await call('/progress/exam-sessions', 'student')).data.sessions.exam;
  assert.deepEqual(session.navigation, { subject: 'math', english, math });
  assert.equal(session.answers.e, 'A');
  assert.equal((await call('/progress/exam-sessions', 'other')).data.sessions.exam, undefined);
});

test('a newer fallback session wins over an older dedicated row', async () => {
  const navigation = { subject: 'math', math: { screen: 'mathQuestion', questionId: 'm' } };
  tables.student_exam_sessions.push({ user_id: 'student', assessment_id: 'exam', answers: { m: '1' }, completed_sections: [], updated_at: '2026-10-28T10:00:00Z' });
  tables.student_exam_results.push({ user_id: 'student', assessment_id: '__exam_session__:exam', result: { answers: { m: '4' }, completedSections: [], status: 'in_progress', updatedAt: '2026-10-28T11:00:00Z', navigation } });
  const session = (await call('/progress/exam-sessions', 'student')).data.sessions.exam;
  assert.equal(session.answers.m, '4');
  assert.deepEqual(session.navigation, navigation);
});

test('invalid resume locations are rejected without replacing a saved draft', async () => {
  const grant = (await call(permissionPath, 'teacher', 'PUT', { sections: ['math'] })).data.grant;
  const draft = { reentryGrantId: grant.id, answers: { m: '4' }, completedSections: [], navigation: { subject: 'math', math: { screen: 'mathQuestion', questionId: 'm' } } };
  await call('/progress/exam-sessions/exam', 'student', 'PUT', draft);
  for (const navigation of [null, [], { subject: 'science' }, { subject: 'math', math: { screen: 'testOver' } }, { subject: 'math', math: { screen: 'mathQuestion', questionId: 'x'.repeat(301) } }]) {
    assert.equal((await call('/progress/exam-sessions/exam', 'student', 'PUT', { ...draft, navigation, answers: { m: '9' } })).status, 400);
  }
  assert.equal((await call('/progress/exam-sessions', 'student')).data.sessions.exam.answers.m, '4');
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

test('an individual English reset starts blank, archives the submission, and leaves math intact on an open exam', async () => {
  assessment.status='open'; assessment.sectionAccess={english:true,math:true};
  try {
    const original=structuredClone(latest());
    tables.student_exam_sessions.push({user_id:'student',assessment_id:'exam',answers:{e:'A',m:'0'},completed_sections:['english','math'],updated_at:'2025-01-01T00:00:00Z'});
    const {data:{grant},status}=await call(permissionPath,'teacher','PUT',{sections:['english'],resetAnswers:true});
    assert.equal(status,200);
    const detail=(await call('/assessments/student/exam','student')).data.assessment;
    assert.equal(detail.reentry.id,grant.id);
    assert.deepEqual(detail.sectionAccess,{english:true,math:false});
    assert.deepEqual(latest(),original);
    const draft=answers=>call('/progress/exam-sessions/exam','student','PUT',{answers,completedSections:['math'],reentryGrantId:grant.id});
    assert.equal((await call('/progress/exam-sessions/exam','student','PUT',{answers:{e:'A'},completedSections:[]})).status,409);
    assert.deepEqual((await draft({m:'5'})).data.session.answers,{m:'0'});
    assert.deepEqual((await draft({e:'B'})).data.session.answers,{e:'B',m:'0'});
    const finished=await call('/progress/exam-results/exam','student','PUT',{result:revision(grant,{m:'5'},['english'])});
    assert.equal(finished.status,200);
    assert.equal(latest().answers.m,original.answers.m);
    assert.ok(!latest().answers.e);
    assert.deepEqual(latest().subjects.find(v=>v.subject==='Math'),original.subjects.find(v=>v.subject==='Math'));
    assert.deepEqual(tables.student_exam_results.find(row=>row.assessment_id.includes('__exam_revision__')).result,original);
  } finally {assessment.status='locked';assessment.sectionAccess={english:false,math:false};}
});
