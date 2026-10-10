const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
const shared = require('../src/shared/learningPlan.ts');
const studentId = '11111111-1111-1111-1111-111111111111';
const otherId = '22222222-2222-2222-2222-222222222222';
const teacherId = '33333333-3333-3333-3333-333333333333';
const users = {
  teacher: { id: teacherId, app_metadata: { role: 'teacher' } },
  student: { id: studentId, app_metadata: { role: 'student', class_ids: ['shsat'] } },
  other: { id: otherId, app_metadata: { role: 'student', class_ids: ['shsat'] } },
  archived: { id: '44444444-4444-4444-4444-444444444444', app_metadata: { role: 'student', class_ids: ['shsat'], archived: true } },
};
function stub(relative, exports) { const id = require.resolve(relative); require.cache[id] = { id, filename: id, loaded: true, exports }; }
stub('../src/lib/auth.ts', {
  getAuthenticatedUser: async header => { const user = users[header?.replace('Bearer ', '')] ?? null; return { user, error: user ? null : 'Sign in required' }; },
  getUserRole: user => user.app_metadata.role,
  getEnrolledClassIds: meta => meta.class_ids ?? [],
  isStudentArchived: user => user.app_metadata.archived === true,
});
const exam = { id: 'qa-exam', classId: 'shsat', title: 'QA exam', status: 'locked', sectionAccess: { english: false, math: false }, allowCompletedAccess: false };
stub('../src/config/assessments.ts', {
  listTeacherAssessments: () => [exam], listStudentAssessments: () => [exam],
  findAssessmentForStudent: id => id === exam.id ? exam : null,
  toStudentAssessmentDetail: item => item,
});
stub('../src/lib/examContent.ts', { getExamContent: () => ({ passageSets: [{ questions: [{ topic: 'Inference' }] }] }) });
const progress = new Map();
stub('../src/routes/progress.ts', { getDatabaseProgress: async user => progress.get(user.id) ?? { examResults: [], practice: {} } });
const bankQuestion = { id: 'lab-q-plan-fixture', subject: 'English', source: 'SHSAT Lab', status: 'published', topic: 'Evidence & Support', difficulty: 'easy', choices: ['A', 'B', 'C', 'D'].map(id => ({ id, text: id })), correctChoiceId: 'A' };
const bankSet = { id: 'lab-set-plan-fixture', title: 'Synthetic learning-plan ELA set', subject: 'English', source: 'SHSAT Lab', questionIds: [bankQuestion.id] };
stub('../src/lib/questionBank.ts', { readQuestionBank: () => ({ revision: 1, questions: [bankQuestion], sets: [bankSet] }), libraryContentKind: id => id === bankSet.id ? 'practice' : 'passage' });
const tables = { student_assignments: [], student_learning_plans: [], student_library_attempts: [], student_practice_progress: [] };
let storageFailure = false;
// In-memory fluent adapter exercises real route auth, validation, filtering and CAS writes.
const db = {
  auth: { admin: { getUserById: async id => ({ data: { user: Object.values(users).find(user => user.id === id) ?? null }, error: null }) } },
  from(table) {
    const filters = [], sorts = [];
    let columns = '*', start = 0, end = Infinity, single = false, changes, additions, ignoreDuplicates = false;
    const query = {
      select(value = '*') { columns = value; return this; },
      eq(key, value) { filters.push(row => row[key] === value); return this; },
      neq(key, value) { filters.push(row => row[key] !== value); return this; },
      in(key, values) { filters.push(row => values.includes(row[key])); return this; },
      not(key, op, value) { filters.push(row => op === 'is' ? row[key] !== value : !value.slice(1, -1).split(',').includes(row[key])); return this; },
      lt(key, value) { filters.push(row => row[key] != null && row[key] < value); return this; },
      gte(key, value) { filters.push(row => row[key] != null && row[key] >= value); return this; },
      lte(key, value) { filters.push(row => row[key] != null && row[key] <= value); return this; },
      like(key, value) { filters.push(row => String(row[key]).startsWith(value.replace('%', ''))); return this; },
      ilike(key, value) { filters.push(row => String(row[key]).toLowerCase().includes(value.replaceAll('%', '').toLowerCase())); return this; },
      or(value) { const days = value.match(/\d{4}-\d{2}-\d{2}/g); filters.push(row => { const day = row.status === 'planned' ? row.planned_date : row.due_date; return day && day >= days[0] && day <= days[1]; }); return this; },
      order(key, options = {}) { sorts.push([key, options]); return this; },
      range(a, b) { start = a; end = b + 1; return this; },
      limit(n) { end = n; return this; },
      maybeSingle() { single = true; return this; }, single() { single = true; return this; },
      update(values) { changes = values; return this; },
      insert(values) { additions = Array.isArray(values) ? values : [values]; return this; },
      upsert(values, options = {}) { additions = Array.isArray(values) ? values : [values]; ignoreDuplicates = options.ignoreDuplicates; return this; },
      then(resolve, reject) {
        if (storageFailure && table.startsWith('student_assign')) return Promise.resolve({ data: null, error: { message: 'Missing relation' } }).then(resolve, reject);
        const rows = tables[table] ?? [];
        if (additions) for (const item of additions) { const existing = rows.find(row => item.id ? row.id === item.id : row.student_id === item.student_id); if (!existing) rows.push(structuredClone(item)); else if (!ignoreDuplicates) Object.assign(existing, item); }
        let matching = rows.filter(row => filters.every(filter => filter(row)));
        if (changes) matching.forEach(row => Object.assign(row, structuredClone(changes)));
        if (additions && single) matching = additions;
        matching.sort((a, b) => { for (const [key, options] of sorts) { if (a[key] === b[key]) continue; if (a[key] == null || b[key] == null) return a[key] == null ? 1 : -1; return String(a[key]).localeCompare(String(b[key])) * (options.ascending === false ? -1 : 1); } return 0; });
        const count = matching.length;
        matching = matching.slice(start, end).map(row => columns === '*' ? structuredClone(row) : Object.fromEntries(columns.split(',').map(key => [key, row[key]])));
        return Promise.resolve({ data: single ? matching[0] ?? null : matching, count, error: null }).then(resolve, reject);
      },
    };
    return query;
  },
};
stub('../src/lib/supabase.ts', { supabase: db });
const store = require('../src/lib/learningPlanStore.ts');
const catalog = store.learningCatalog();
const passage = catalog.find(item => item.kind === 'passage');
const practice = catalog.find(item => item.kind === 'practice');
let server, root;
before(async () => {
  const express = require('express'); const app = express(); app.use(express.json());
  app.use('/plan', require('../src/routes/learningPlan.ts').learningPlanRouter);
  app.use('/exams', require('../src/routes/assessments.ts').assessmentsRouter);
  app.use('/library', require('../src/routes/library.ts').libraryRouter);
  server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  root = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });
async function call(url, token = 'teacher', method = 'GET', body) {
  const response = await fetch(root + url, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, data: await response.json() };
}
const prefix = `/plan/teacher/${studentId}`;
async function create(items, allowRepeat = false, batchId = require('node:crypto').randomUUID()) { return call(prefix + '/assignments', 'teacher', 'POST', { items, allowRepeat, batchId }); }
const task = (overrides = {}) => ({ kind: 'offline', title: 'Worksheet pages 4–7', status: 'assigned', ...overrides });

test('calendar, workload and supply calculations do not invent dates or durations', () => {
  const rows = [task({ dueDate: null, assignedAt: '2026-10-05T12:00:00Z', estimatedMinutes: null }), task({ dueDate: '2026-10-07', estimatedMinutes: 30 }), task({ status: 'planned', plannedDate: '2026-10-08', estimatedMinutes: null }), task({ status: 'completed', dueDate: '2026-10-06', completedAt: '2026-10-05T02:00:00Z', estimatedMinutes: 10 })];
  const summary = shared.planSummary(rows, '2026-10-05');
  assert.equal(summary.dueThisWeek, 1); assert.equal(summary.weekly, 3); assert.equal(summary.knownMinutes, 40); assert.equal(summary.timed, 2); assert.equal(summary.completedThisWeek, 0);
  assert.deepEqual(shared.forecast(20, 3, '2026-11-23', '2026-10-05'), { weeksSupply: 6.7, weeksAvailable: 7, needed: 21, difference: -1 });
  assert.equal(shared.forecast(20, null, null).needed, null);
  assert.equal(shared.isOverdue(task({ dueDate: '2026-10-04' }), '2026-10-05'), true);
  assert.equal(shared.isOverdue(task({ status: 'completed', dueDate: '2026-10-04' }), '2026-10-05'), false);
  assert.equal(shared.validDate('2026-02-30'), false);
  assert.equal(new Set(catalog.map(item => `${item.kind}:${item.id}`)).size, catalog.length);
  assert.ok(catalog.filter(item => item.kind === 'passage').every(item => ['official_handbook', 'prestige', 'miscellaneous'].includes(item.passageCategory)));
});
test('permissions, empty student, archived student, and malformed identity', async () => {
  assert.equal((await call(prefix, 'missing')).status, 401);
  assert.equal((await call(prefix, 'student')).status, 403);
  assert.equal((await call('/plan/student', 'teacher')).status, 403);
  assert.equal((await call('/plan/teacher/invalid')).status, 400);
  assert.equal((await call(`/plan/teacher/${users.archived.id}`)).status, 404);
  const empty = await call(prefix); assert.equal(empty.status, 200); assert.equal(empty.data.summary.assigned, 0); assert.equal(empty.data.inventory.every(row => row.status === 'Never assigned'), true);
});
test('external/offline lifecycle is persistent, teacher verified, and student isolated', async () => {
  const saved = await create([task({ instructions: 'Show work.', dueDate: shared.todayInNewYork(), estimatedMinutes: 30 })]);
  assert.equal(saved.status, 201); const item = saved.data.assignments[0];
  assert.equal(item.url, null); assert.ok(item.assignedAt);
  assert.equal((await call('/plan/student/assignments', 'other')).data.total, 0);
  assert.equal((await call(`/plan/student/assignments/${item.id}`, 'other', 'PATCH', { revision: 1, action: 'start' })).status, 404);
  assert.equal((await call(`/plan/student/assignments/${item.id}`, 'student', 'PATCH', { revision: 1, action: 'start', studentId: otherId })).status, 200);
  assert.equal((await call(`/plan/student/assignments/${item.id}`, 'student', 'PATCH', { revision: 1, action: 'submit' })).status, 409);
  const review = await call(`/plan/student/assignments/${item.id}`, 'student', 'PATCH', { revision: 2, action: 'submit' }); assert.equal(review.data.assignment.status, 'review'); assert.equal(review.data.assignment.completedAt, null);
  const completed = await call(`${prefix}/assignments/${item.id}`, 'teacher', 'PATCH', { revision: 3, status: 'completed' });
  assert.equal(completed.data.assignment.completion.source, 'teacher'); assert.equal(completed.data.assignment.events.length, 4);
  assert.equal((await call('/plan/student/assignments?status=completed', 'student')).data.total, 1);
  assert.equal((await call(`${prefix}/assignments/${item.id}`, 'teacher', 'PATCH', { revision: 4, status: 'assigned' })).status, 400);
});
test('planned passages stay private; publishing, duplicate warnings, intentional repeats and idempotency', async () => {
  const batch = require('node:crypto').randomUUID();
  const draft = task({ kind: 'passage', contentId: passage.id, status: 'planned', plannedDate: shared.weekDays()[4] });
  const saved = await create([draft], false, batch); const item = saved.data.assignments[0]; assert.equal(item.assignedAt, null);
  assert.equal((await call(`${prefix}/assignments/${item.id}`, 'teacher', 'PATCH', { revision: 1, status: 'completed' })).status, 400);
  assert.equal((await create([draft], false, batch)).status, 200);
  assert.equal((await call('/plan/student/assignments?status=all', 'student')).data.assignments.some(row => row.id === item.id), false);
  const published = await call(prefix + '/published'); assert.equal('settings' in published.data, false); assert.equal(published.data.summary.planned, 0);
  assert.equal((await create([draft])).status, 409);
  assert.equal((await create([draft], true)).status, 201);
  const issued = await call(`${prefix}/assignments/${item.id}`, 'teacher', 'PATCH', { revision: 1, status: 'assigned' }); assert.ok(issued.data.assignment.assignedAt); assert.equal(issued.data.assignment.events.length, 2);
  const otherInventory = (await call(`/plan/teacher/${otherId}`)).data.inventory.find(row => row.content.id === passage.id); assert.equal(otherInventory.status, 'Never assigned');
  await store.recordPlanCompletion(studentId, 'passage', passage.id, { source: 'library', at: new Date(Date.now() + 1000).toISOString(), correct: 7, total: 8 });
  const history = await call(`${prefix}/content/passage/${encodeURIComponent(passage.id)}`); assert.equal(history.data.assignments.find(row => row.id === item.id).status, 'completed');
  assert.equal((await create([task({ kind: 'passage', contentId: passage.id })])).status, 409);
});
test('practice completion uses new questions after publishing, not earlier progress', async () => {
  progress.set(studentId, { examResults: [], practice: { [practice.id]: { easy: { answered: 10 } } } });
  const item = (await create([task({ kind: 'practice', contentId: practice.id, questionTarget: 3 })])).data.assignments[0];
  assert.equal(item.practiceBaseline, 10);
  await store.recordPracticePlanCompletion(studentId, practice.id, { easy: { answered: 12 } }); assert.equal((await store.assignmentDetail(studentId, item.id)).status, 'assigned');
  await store.recordPracticePlanCompletion(studentId, practice.id, { easy: { answered: 13 } }); assert.equal((await store.assignmentDetail(studentId, item.id)).status, 'completed');
});
test('exam access opens for only the assigned student without modifying global gates', async () => {
  const item = (await create([task({ kind: 'exam', contentId: exam.id })])).data.assignments[0];
  assert.equal((await call(`/exams/student/${exam.id}`, 'student')).status, 200);
  assert.equal((await call(`/exams/student/${exam.id}`, 'other')).status, 403); assert.equal(exam.status, 'locked');
  await store.recordPlanCompletion(studentId, 'exam', exam.id, { source: 'exam', at: '2000-01-01T12:00:00Z' }); assert.equal((await store.assignmentDetail(studentId, item.id)).status, 'assigned');
  await store.recordPlanCompletion(studentId, 'exam', exam.id, { source: 'exam', at: new Date(Date.now() + 1000).toISOString() }); assert.equal((await store.assignmentDetail(studentId, item.id)).status, 'completed');
  assert.equal((await call(`/exams/student/${exam.id}`, 'student')).status, 200);
  assert.equal((await call(`/exams/student/${exam.id}`, 'other')).status, 403);
});
test('assigned passage access and saved native attempts complete only that student’s homework', async () => {
  const fresh = catalog.filter(item => item.kind === 'passage')[1];
  const item = (await create([task({ kind: 'passage', contentId: fresh.id })])).data.assignments[0];
  assert.equal((await call(`/library/books/${fresh.id}/access`, 'student')).data.unlocked, true);
  assert.equal((await call(`/library/books/${fresh.id}/access`, 'other')).data.unlocked, false);
  const book = require('../src/lib/libraryBooks.ts').getMergedLibraryBook(fresh.id);
  const questions = book ? book.passageSet.questions.map(question => {
    const answer = require('../src/shared/libraryBooks.ts').libraryCorrectAnswer(question);
    return { questionId: question.id, selectedAnswerId: typeof answer === 'string' ? answer : JSON.stringify(answer), timeSpentSeconds: 20 };
  }) : [{ questionId: 'q1', selectedAnswerId: 'A', correctAnswerId: 'A', timeSpentSeconds: 20 }];
  const attempt = await call(`/library/books/${fresh.id}/attempts`, 'student', 'POST', { startedAt: new Date().toISOString(), questions });
  assert.equal(attempt.status, 201);
  assert.equal((await store.assignmentDetail(studentId, item.id)).status, 'completed');
  const row = (await call(prefix)).data.inventory.find(row => row.content.id === fresh.id);
  assert.equal(row.lastCompletedAt, attempt.data.attempt.completedAt);
  assert.equal((await call(`/library/books/${fresh.id}/attempts`, 'other', 'POST', { startedAt: new Date().toISOString(), questions: [] })).status, 403);
});
test('notes, URL validation, missing content and optimistic concurrency', async () => {
  for (const draft of [task({ url: 'javascript:alert(1)' }), task({ url: 'https://name:secret@example.test' }), task({ kind: 'passage', contentId: 'missing' }), task({ estimatedMinutes: 0 }), task({ dueDate: '2026-02-30' })]) assert.equal((await create([draft])).status, 400);
  const note = { passagePace: 3, targetDate: '2026-10-30', teacherNotes: 'Save poetry for October.', revision: 0 };
  assert.equal((await call(prefix + '/settings', 'teacher', 'PATCH', note)).status, 200);
  assert.equal((await call(prefix + '/settings', 'teacher', 'PATCH', note)).status, 409);
  assert.equal('settings' in (await call('/plan/student', 'student')).data, false);
});
test('years of completed history paginates; week query filters before pagination', async () => {
  const base = tables.student_assignments.find(row => row.status === 'completed');
  for (let i = 0; i < 1200; i++) tables.student_assignments.push({ ...structuredClone(base), id: `old-${i}`, title: `Old task ${i}`, student_id: otherId, content_id: null, kind: 'offline', status: 'completed' });
  const overview = await call(`/plan/teacher/${otherId}`); assert.equal(overview.data.summary.completed, 1200);
  const page = await call(`/plan/teacher/${otherId}/assignments?status=completed&page=23`); assert.equal(page.data.assignments.length, 50); assert.equal(page.data.total, 1200); assert.equal('events' in page.data.assignments[0], false);
  for (let i = 0; i < 60; i++) tables.student_assignments.push({ ...structuredClone(base), id: `week-${i}`, student_id: otherId, kind: 'offline', content_id: null, status: 'assigned', due_date: shared.weekDays()[4] });
  const week = await call('/plan/student/assignments?status=week&page=1', 'other'); assert.equal(week.data.total, 60); assert.equal(week.data.assignments.length, 10);
});
test('real earlier results inform passage inventory without invented assigned dates', async () => {
  const fresh = catalog.filter(item => item.kind === 'passage')[2];
  progress.set(otherId, { practice: {}, examResults: [{ assessmentId: 'older-exam', completedAt: '2026-09-12T14:00:00Z', completionStatus: 'english_complete', passages: [{ id: fresh.aliases[0], correct: 7, total: 8 }] }] });
  const data = (await call(`/plan/teacher/${otherId}`)).data;
  const row = data.inventory.find(item => item.content.id === fresh.id); assert.equal(row.status, 'Completed'); assert.equal(row.assignmentCount, 0); assert.equal(row.priorCount, 1); assert.equal(row.lastCompletedAt, '2026-09-12T14:00:00Z');
  const history = (await call(`/plan/teacher/${otherId}/content/passage/${encodeURIComponent(fresh.id)}`)).data;
  assert.equal(history.total, 0); assert.equal(history.prior[0].at, '2026-09-12T14:00:00Z'); assert.equal('assignedAt' in history.prior[0], false);
});
test('a completed combined book records prior work for every original version alias', async () => {
  const id='book-a-miracle-mile', reference='combined-book-completion';
  const versions=catalog.filter(item=>item.kind==='passage'&&item.aliases.includes(id));
  assert.equal(versions.length,2);
  tables.student_library_attempts.push({id:reference,user_id:otherId,book_id:id,total_questions:9,score:7,completed_at:'2026-10-07T12:00:00Z'});
  const data=(await call(`/plan/teacher/${otherId}`)).data;
  for(const version of versions){
    const row=data.inventory.find(item=>item.content.id===version.id);assert.equal(row.hasCompleted,true);assert.equal(row.lastCompletedAt,'2026-10-07T12:00:00Z');
    const history=(await call(`/plan/teacher/${otherId}/content/passage/${encodeURIComponent(version.id)}`)).data;
    assert.ok(history.prior.some(item=>item.reference===reference));
  }
});

test('unfinished/Math-only exams do not mark passages done; undated completed passage records retain No Data dates', async () => {
  const before = (await call(`/plan/teacher/${otherId}`)).data;
  const fresh = before.inventory.find(row => row.content.kind === 'passage' && !row.hasCompleted).content;
  progress.set(otherId, { practice: {}, examResults: ['in_progress', 'math_complete'].map(completionStatus => ({ assessmentId: 'unfinished-fixture', completionStatus, completedAt: '2026-10-01T12:00:00Z', passages: [{ id: fresh.id, correct: 2, total: 4 }] })) });
  const unfinished = (await call(`/plan/teacher/${otherId}`)).data.inventory.find(row => row.content.id === fresh.id);
  assert.equal(unfinished.hasCompleted, false); assert.equal(unfinished.lastCompletedAt, null);
  progress.set(otherId, { practice: {}, examResults: [{ assessmentId: 'undated-fixture', completionStatus: 'english_complete', passages: [{ id: fresh.id, correct: 2, total: 4 }] }] });
  const undated = (await call(`/plan/teacher/${otherId}`)).data.inventory.find(row => row.content.id === fresh.id);
  assert.equal(undated.hasCompleted, true); assert.equal(undated.lastCompletedAt, null);
});
test('inventory has exclusive student-specific statuses for mixed, cancelled, repeated and exhausted content', () => {
  const passages = catalog.filter(item => item.kind === 'passage');
  const records = passages.map((content, index) => task({ id: `history-${index}`, contentId: content.id, kind: 'passage', createdAt: '2026-09-01', assignedAt: '2026-09-01T12:00:00Z', status: 'completed', completedAt: '2026-09-02T12:00:00Z' }));
  records.push(task({ id: 'repeat', kind: 'passage', contentId: passages[0].id, createdAt: '2026-10-01', status: 'in_progress', assignedAt: '2026-10-01T12:00:00Z' }));
  records[1].status = 'cancelled'; records[2].status = 'planned'; records[2].assignedAt = null;
  const rows = shared.inventory(passages, records, []);
  assert.equal(rows.filter(row => row.status === 'Never assigned').length, 0);
  assert.equal(rows[0].status, 'In progress'); assert.equal(rows[0].history.length, 2);
  assert.equal(rows[1].status, 'Previously assigned'); assert.equal(rows[2].status, 'Planned');
  assert.equal(rows.filter(row => row.status === 'Completed').length, passages.length - 3);
});
test('SHSAT Lab sets are practice, complete from exact attempts, and remain student isolated', async () => {
  const bankContent = catalog.find(item => item.id === bankSet.id);
  assert.equal(bankContent.kind, 'practice'); assert.equal(bankContent.contentSource, 'SHSAT Lab'); assert.equal(bankContent.subject, 'English');
  const saved = await create([{ kind: 'practice', contentId: bankSet.id, status: 'assigned' }]);
  assert.equal(saved.status, 201); const assignment = saved.data.assignments[0]; assert.equal(assignment.questionTarget, null);
  assert.equal(await store.hasAssignedContent(otherId, 'practice', bankSet.id), false);
  await store.recordPracticePlanCompletion(studentId, bankSet.id, { easy: { answered: 100 } });
  assert.equal((await store.assignmentDetail(studentId, assignment.id)).status, 'assigned');
  await store.recordPlanCompletion(otherId, 'practice', bankSet.id, { source: 'library', at: new Date(Date.now() + 1000).toISOString(), total: 1, correct: 1 });
  assert.equal((await store.assignmentDetail(studentId, assignment.id)).status, 'assigned');
  await store.recordPlanCompletion(studentId, 'practice', bankSet.id, { source: 'library', at: new Date(Date.now() + 1000).toISOString(), total: 1, correct: 1 });
  const completed = await store.assignmentDetail(studentId, assignment.id); assert.equal(completed.status, 'completed'); assert.equal(completed.completion.source, 'library');
});

test('missing migration is an explicit error and cannot break existing access', async () => {
  storageFailure = true;
  try { assert.equal((await call(prefix)).status, 503); assert.equal((await store.assignedContentIds(studentId, 'exam')).size, 0); } finally { storageFailure = false; }
});
