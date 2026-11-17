const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });

// A stand-in database. `student_exam_result_summaries` is derived from the stored results the
// way the real view derives it: the result without its exam copy, the copy's hash, and the copy.
let tables, failures, queries, viewInstalled, copiesChangeWhileLoading;
const hashOf = content => crypto.createHash('md5').update(JSON.stringify(content)).digest('hex');
const summaries = () => (tables.student_exam_results ?? []).map((row, index) => {
  const { analysisContent, ...result } = row.result ?? {};
  return { id: `row-${index}`, user_id: row.user_id, assessment_id: row.assessment_id, result,
    snapshot_hash: analysisContent ? hashOf(analysisContent) : null, snapshot: analysisContent ?? null };
});
const id = require.resolve('../src/lib/supabase.ts');
require.cache[id] = { id, filename: id, loaded: true, exports: { supabase: {
  from(table) {
    let key, values, start = 0, end = Infinity, columns = '';
    return {
      select(selected) { columns = selected; return this; }, in(column, wanted) { key = column; values = wanted; return this; }, order() { return this; },
      range(from, to) { start = from; end = to; return this; },
      then(resolve, reject) {
        queries.push(table);
        let source = tables[table] ?? [];
        if (table === 'student_exam_result_summaries') {
          if (!viewInstalled) return Promise.resolve({ data: null, error: { code: 'PGRST205' } }).then(resolve, reject);
          source = summaries();
          if (copiesChangeWhileLoading && columns.includes('snapshot,') === false && columns.endsWith('snapshot')) source = source.map(row => ({ ...row, snapshot_hash: 'changed' }));
        }
        if (failures[table]) return Promise.resolve({ data: table === 'student_exam_result_summaries' ? null : source, error: failures[table] }).then(resolve, reject);
        const data = source.filter(row => values.includes(row[key])).slice(start, end === Infinity ? undefined : end + 1);
        return Promise.resolve({ data, error: null }).then(resolve, reject);
      },
    };
  },
} } };
const { loadStudentProgressRows } = require('../src/lib/studentProgressRows.ts');
const { clearExamSnapshots, stringifyWithSharedExamSnapshots } = require('../src/lib/examSnapshotStore.ts');
const { attachSharedExamSnapshots } = require('../../client/src/lib/sharedExamSnapshots.ts');
function reset() { tables = {}; failures = {}; queries = []; viewInstalled = true; copiesChangeWhileLoading = false; clearExamSnapshots(); }
const count = table => queries.filter(name => name === table).length;

test('33 students use three queries and cannot receive another student\'s records', async () => {
  reset();
  const ids = Array.from({ length: 33 }, (_, i) => `student-${i}`);
  for (const table of ['student_exam_results', 'student_exam_sessions', 'student_practice_progress']) {
    tables[table] = [...ids, 'not-in-roster'].map(user_id => ({ user_id, assessment_id: 'exam', topic_slug: 'topic', result: { answers: { q: user_id } } }));
  }
  const rows = await loadStudentProgressRows(ids);
  assert.equal(queries.length, 3);
  for (const id of ids) for (const key of ['exams', 'practice', 'sessions']) {
    assert.equal(rows[key](id).data.length, 1);
    assert.equal(rows[key](id).data[0].user_id, id);
  }
  assert.deepEqual(rows.exams('student-0').data[0], { user_id: 'student-0', assessment_id: 'exam', result: { answers: { q: 'student-0' } } });
  assert.deepEqual(rows.exams('not-in-roster').data, []);
});

test('every result gets its exam copy back; each distinct copy is read once and then reused', async () => {
  reset();
  const ids = Array.from({ length: 12 }, (_, i) => `student-${i}`);
  const formA = { title: 'Form A', passageSets: [{ questions: [{ id: 'q1' }] }] };
  const formB = { title: 'Form B', mathSection: { questions: [{ id: 'm1' }] } };
  tables.student_exam_results = [
    ...ids.map((user_id, i) => ({ user_id, assessment_id: 'exam', result: { answers: { q: user_id }, analysisContent: i < 6 ? formA : formB } })),
    { user_id: 'student-0', assessment_id: 'paper', result: { percentage: 80 } },
  ];
  const stored = JSON.parse(JSON.stringify(tables.student_exam_results));
  const rows = await loadStudentProgressRows(ids);
  assert.equal(count('student_exam_result_summaries'), 2, 'one read of the small rows, one read for the two distinct copies');
  assert.equal(count('student_exam_results'), 0);
  for (const id of ids) assert.deepEqual(rows.exams(id).data, stored.filter(row => row.user_id === id));
  assert.equal(rows.exams('student-0').data[0].result.analysisContent, rows.exams('student-5').data[0].result.analysisContent, 'results on the same exam share one copy');

  queries = [];
  const again = await loadStudentProgressRows(ids);
  assert.equal(count('student_exam_result_summaries'), 1, 'copies already in memory are not read again');
  for (const id of ids) assert.deepEqual(again.exams(id).data, stored.filter(row => row.user_id === id));
});

test('the roster sends each distinct copy once and the client restores identical results', async () => {
  reset();
  const ids = ['a', 'b', 'c'];
  const exam = { title: 'Form A', passageSets: [{ questions: [{ id: 'q1' }] }] };
  tables.student_exam_results = ids.map(user_id => ({ user_id, assessment_id: 'exam', result: { percentage: 90, analysisContent: exam } }));
  const rows = await loadStudentProgressRows(ids);
  const inlineCopy = { title: 'Loaded another way' };
  const students = ids.map(id => ({ id, progress: { practice: {}, examResults: [...rows.exams(id).data.map(row => row.result), { percentage: 50, analysisContent: inlineCopy }] } }));
  const sent = JSON.parse(stringifyWithSharedExamSnapshots(students));
  assert.equal(Object.keys(sent.examSnapshots).length, 1);
  assert.deepEqual(sent.students[0].progress.examResults[0], { percentage: 90, analysisContentRef: hashOf(exam) });
  assert.deepEqual(sent.students[0].progress.examResults[1], { percentage: 50, analysisContent: inlineCopy }, 'a copy from elsewhere stays inline');
  assert.deepEqual(attachSharedExamSnapshots(sent.students, sent.examSnapshots), JSON.parse(JSON.stringify(students)));
  const older = JSON.parse(JSON.stringify({ students }));
  assert.deepEqual(attachSharedExamSnapshots(older.students, older.examSnapshots), older.students, 'a response without shared copies passes through');
});

test('pagination preserves more than 500 results and empty rosters make no queries', async () => {
  reset();
  await loadStudentProgressRows([]);
  assert.equal(queries.length, 0);
  tables.student_exam_results = Array.from({ length: 501 }, (_, i) => ({ user_id: 'student', assessment_id: `exam-${i}` }));
  const rows = await loadStudentProgressRows(['student']);
  assert.equal(rows.exams('student').data.length, 501);
  assert.equal(queries.length, 4);
});

test('large rosters are chunked and later chunks retain all students', async () => {
  reset();
  const ids = Array.from({ length: 101 }, (_, i) => `student-${i}`);
  tables.student_exam_results = ids.map(user_id => ({ user_id, assessment_id: 'exam' }));
  const rows = await loadStudentProgressRows(ids);
  assert.equal(queries.length, 6);
  assert.equal(rows.exams('student-100').data.length, 1);
});

// Complete rows carry a full exam copy each, so without the view they load six students at a
// time; the two light tables still load a whole roster batch in one query each.
test('without the summaries view, complete rows load in small batches', async () => {
  reset();
  viewInstalled = false;
  const ids = Array.from({ length: 33 }, (_, i) => `student-${i}`);
  const exam = { title: 'Form A' };
  tables.student_exam_results = ids.map(user_id => ({ user_id, assessment_id: 'exam', result: { analysisContent: exam } }));
  const rows = await loadStudentProgressRows(ids);
  assert.equal(count('student_exam_results'), 6);
  assert.deepEqual(rows.exams('student-32').data, [{ user_id: 'student-32', assessment_id: 'exam', result: { analysisContent: exam } }]);

  reset();
  viewInstalled = false;
  tables.student_exam_results = Array.from({ length: 501 }, (_, i) => ({ user_id: 'student', assessment_id: `exam-${i}` }));
  assert.equal((await loadStudentProgressRows(['student'])).exams('student').data.length, 501);
  assert.equal(count('student_exam_results'), 26, '20-row pages');
});

test('a copy that changes while loading falls back to complete rows instead of guessing', async () => {
  reset();
  copiesChangeWhileLoading = true;
  const exam = { title: 'Form A' };
  tables.student_exam_results = [{ user_id: 'student', assessment_id: 'exam', result: { percentage: 70, analysisContent: exam } }];
  const rows = await loadStudentProgressRows(['student']);
  assert.equal(count('student_exam_results'), 1);
  assert.deepEqual(rows.exams('student').data, tables.student_exam_results);
});

test('legacy schema can use existing fallbacks but connection failures are not empty progress', async () => {
  reset();
  failures.student_exam_sessions = { code: 'PGRST205' };
  const rows = await loadStudentProgressRows(['student']);
  assert.equal(rows.sessions('student').error.code, 'PGRST205');
  failures.student_exam_result_summaries = { code: '57014' };
  await assert.rejects(loadStudentProgressRows(['student']), error => error.status === 503);
  reset();
  viewInstalled = false;
  failures.student_exam_results = { code: '57014' };
  await assert.rejects(loadStudentProgressRows(['student']), error => error.status === 503);
});
