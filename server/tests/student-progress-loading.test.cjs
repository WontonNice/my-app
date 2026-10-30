const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
let tables, failures, queries;
const id = require.resolve('../src/lib/supabase.ts');
require.cache[id] = { id, filename: id, loaded: true, exports: { supabase: {
  from(table) {
    let ids, start, end;
    return {
      select() { return this; }, in(_key, values) { ids = values; return this; }, order() { return this; },
      range(from, to) { start = from; end = to; return this; },
      then(resolve, reject) {
        queries++;
        return Promise.resolve({ data: (tables[table] ?? []).filter(row => ids.includes(row.user_id)).slice(start, end + 1), error: failures[table] ?? null }).then(resolve, reject);
      },
    };
  },
} } };
const { loadStudentProgressRows } = require('../src/lib/studentProgressRows.ts');
function reset() { tables = {}; failures = {}; queries = 0; }

test('33 students use three queries and cannot receive another student\'s records', async () => {
  reset();
  const ids = Array.from({ length: 33 }, (_, i) => `student-${i}`);
  for (const table of ['student_exam_results', 'student_exam_sessions', 'student_practice_progress']) {
    tables[table] = [...ids, 'not-in-roster'].map(user_id => ({ user_id, assessment_id: 'exam', topic_slug: 'topic', result: { answers: { q: user_id } } }));
  }
  const rows = await loadStudentProgressRows(ids);
  assert.equal(queries, 3);
  for (const id of ids) for (const key of ['exams', 'practice', 'sessions']) {
    assert.equal(rows[key](id).data.length, 1);
    assert.equal(rows[key](id).data[0].user_id, id);
  }
  assert.deepEqual(rows.exams('not-in-roster').data, []);
});

test('pagination preserves more than 500 results and empty rosters make no queries', async () => {
  reset();
  await loadStudentProgressRows([]);
  assert.equal(queries, 0);
  tables.student_exam_results = Array.from({ length: 501 }, (_, i) => ({ user_id: 'student', assessment_id: `exam-${i}` }));
  const rows = await loadStudentProgressRows(['student']);
  assert.equal(rows.exams('student').data.length, 501);
  assert.equal(queries, 4);
});

test('large rosters are chunked and later chunks retain all students', async () => {
  reset();
  const ids = Array.from({ length: 101 }, (_, i) => `student-${i}`);
  tables.student_exam_results = ids.map(user_id => ({ user_id, assessment_id: 'exam' }));
  const rows = await loadStudentProgressRows(ids);
  assert.equal(queries, 6);
  assert.equal(rows.exams('student-100').data.length, 1);
});

test('legacy schema can use existing fallbacks but connection failures are not empty progress', async () => {
  reset();
  failures.student_exam_sessions = { code: 'PGRST205' };
  const rows = await loadStudentProgressRows(['student']);
  assert.equal(rows.sessions('student').error.code, 'PGRST205');
  failures.student_exam_results = { code: '57014' };
  await assert.rejects(loadStudentProgressRows(['student']), error => error.status === 503);
});
