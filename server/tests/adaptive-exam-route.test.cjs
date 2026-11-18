const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
require('../../tools/register-practice-generator.cjs');
const engine = require('../src/shared/adaptiveMath/engine.ts');

const alice = '11111111-1111-4111-8111-111111111111', bob = '22222222-2222-4222-8222-222222222222', teacher = '99999999-9999-4999-8999-999999999999';
const correctAnswer = question => question.correctChoiceId ?? question.correctTextAnswers[0];
function answered(seed, count, startedAt = 1000) {
  let state = engine.createAdaptiveState(seed, startedAt, 'exam');
  for (let step = 0; step < count; step++) {
    const question = engine.adaptiveQuestion(state), answer = step % 3 ? correctAnswer(question) : question.choices ? question.choices.find(choice => choice.id !== question.correctChoiceId).id : '0.5';
    state = engine.submitAdaptiveAnswer(engine.addAdaptiveTime(engine.selectAdaptiveAnswer(state, answer), 20000), startedAt + 1000 * (step + 1));
  }
  return state;
}

test('the adaptive exam saves to the account, never rewinds, and stays private to its student', async t => {
  const records = new Map();
  let conflicts = 0, broken = false, rosterReads = 0;
  function from(table) {
    assert.equal(table, 'math_practice_checkpoints');
    let insert, update;
    const filters = {}, excluded = [];
    const visible = () => [...records.values()].filter(row => row.user_id === filters.user_id && !excluded.some(prefix => row.module_id.startsWith(prefix)));
    return {
      select() { return this; }, order() { return this; },
      // .not('module_id', 'like', '\\_\\_response\\_\\_:%') hides reserved rows from practice checkpoints.
      not(column, operator, pattern) { assert.equal(column, 'module_id'); assert.equal(operator, 'like'); excluded.push(pattern.replace(/\\/g, '').replace(/%$/, '')); return this; },
      eq(key, value) { filters[key] = value; return this; },
      insert(row) { insert = row; return this; },
      update(row) { update = row; return this; },
      range(start, end) { return { data: visible().map(row => ({ ...row, moduleId: row.module_id })).slice(start, end + 1) }; },
      // Awaiting the query itself (no maybeSingle) lists every row that matches the filters, as the class roster does.
      then(resolve) { rosterReads++; resolve(broken ? { data: null, error: { code: '08006', message: 'connection failure' } } : { data: [...records.values()].filter(row => Object.entries(filters).every(([key, value]) => row[key] === value)).map(row => ({ user_id: row.user_id, best: row.best })), error: null }); },
      maybeSingle() {
        if (broken) return { data: null, error: { code: '08006', message: 'connection failure' } };
        const row = insert ?? filters, key = JSON.stringify([row.user_id, row.module_id]), current = records.get(key);
        if (insert && current) return { data: null, error: { code: '23505' } };
        if (update && conflicts > 0) { conflicts--; records.set(key, { ...current, revision: 'changed-by-another-save' }); return { data: null }; }
        if (update && current?.revision !== filters.revision) return { data: null };
        if (insert || update) records.set(key, insert ?? { ...current, ...update });
        const saved = records.get(key);
        return { data: saved ? { ...saved, moduleId: saved.module_id } : null };
      },
    };
  }
  const db = require.resolve('../src/lib/supabase.ts');
  require.cache[db] = { id: db, filename: db, loaded: true, exports: { supabase: { from } } };
  const auth = require.resolve('../src/lib/auth.ts');
  require.cache[auth] = { id: auth, filename: auth, loaded: true, exports: {
    getAuthenticatedUser: async id => ({ user: id && { id, app_metadata: { role: id === teacher ? 'teacher' : 'student' } }, error: 'Sign in again.' }),
    getEnrolledClassIds: () => ['shsat'],
  } };
  const app = express();
  // Same body limit as the real app, so an exam that is too large to save fails here too.
  app.use(express.json({ limit: '1mb' }));
  app.use('/practice', require('../src/routes/infinitePractice.ts').infinitePracticeRouter);
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = 'http://127.0.0.1:' + server.address().port + '/practice';
  const call = (user, { owner = user, state, query = '' } = {}) => fetch(base + '/adaptive-exam' + query, {
    method: state === undefined ? 'GET' : 'PUT', headers: { ...(user ? { authorization: user } : {}), 'X-Practice-Owner': owner ?? '', 'Content-Type': 'application/json' },
    ...(state === undefined ? {} : { body: JSON.stringify({ state }) }),
  });

  assert.equal((await call('')).status, 401);
  assert.deepEqual(await (await call(alice)).json(), { state: null, summary: null });

  // A save is accepted only from the signed-in student, and only if it is a well-formed exam.
  const ten = answered('alice-exam-1', 10);
  assert.equal((await call(alice, { owner: bob, state: ten })).status, 403);
  assert.equal((await call(alice, { state: { ...ten, correct: 999 } })).status, 400);
  assert.equal((await call(alice, { state: 'not an exam' })).status, 400);
  assert.equal(records.size, 0);
  const first = await call(alice, { state: ten });
  assert.equal(first.status, 200);
  assert.deepEqual((await first.json()).state, ten);
  const stored = records.get(JSON.stringify([alice, '__adaptive__:math-v1']));
  assert.equal(stored.best, engine.adaptiveSummary(ten).mastered);
  const loaded = await (await call(alice)).json();
  assert.deepEqual(loaded.state, ten); assert.equal(loaded.summary.asked, 10);

  // More answers replace the saved copy; a delayed save with fewer answers gets the newer copy back.
  const twenty = answered('alice-exam-1', 20);
  assert.deepEqual((await (await call(alice, { state: twenty })).json()).state, twenty);
  assert.deepEqual((await (await call(alice, { state: ten })).json()).state, twenty);
  assert.equal((await (await call(alice)).json()).state.asked, 20);
  // Saving the same copy again changes nothing.
  const revision = records.get(JSON.stringify([alice, '__adaptive__:math-v1'])).revision;
  assert.equal((await call(alice, { state: twenty })).status, 200);
  assert.equal(records.get(JSON.stringify([alice, '__adaptive__:math-v1'])).revision, revision);
  // A save that collides with another device's save is retried, not lost.
  conflicts = 2;
  const thirty = answered('alice-exam-1', 30);
  assert.deepEqual((await (await call(alice, { state: thirty })).json()).state, thirty);
  // Finishing and practice-mode feedback survive the round trip.
  const finished = engine.finishAdaptive(thirty, 99000);
  assert.equal((await (await call(alice, { state: finished })).json()).state.finished, true);
  // Starting over replaces the old exam even though it has no answers yet.
  const restarted = engine.createAdaptiveState('alice-exam-2', 200000, 'practice');
  assert.deepEqual((await (await call(alice, { state: restarted })).json()).state, restarted);
  assert.equal((await (await call(alice)).json()).state.seed, 'alice-exam-2');
  // Switching between exam and practice mode is saved even before the next answer.
  assert.equal((await (await call(alice, { state: engine.setAdaptiveMode(restarted, 'exam') })).json()).state.mode, 'exam');
  assert.equal((await (await call(alice)).json()).state.mode, 'exam');

  // Students cannot read each other; a teacher can read any student.
  assert.deepEqual(await (await call(bob)).json(), { state: null, summary: null });
  assert.equal((await call(bob, { query: '?studentId=' + alice })).status, 403);
  assert.equal((await call(teacher, { query: '?studentId=not-a-student-id' })).status, 400);
  const seen = await (await call(teacher, { query: '?studentId=' + alice })).json();
  assert.equal(seen.state.seed, 'alice-exam-2'); assert.equal(seen.summary.total, Object.keys(restarted.topics).length);
  // A teacher's own save goes under the teacher's account, never a student's.
  assert.equal((await call(teacher, { owner: alice, state: ten })).status, 403);

  // The class roster is for teachers only, and lists topics mastered for each student who has started, in one query.
  assert.equal((await call('', { query: '/roster' })).status, 401);
  assert.equal((await call(alice, { query: '/roster' })).status, 403);
  assert.equal(rosterReads, 0, 'a student never reaches the class query');
  const carol = '33333333-3333-4333-8333-333333333333';
  records.set(JSON.stringify([bob, 'fractions-practice']), { user_id: bob, module_id: 'fractions-practice', best: 9, session: null, revision: 'practice' });
  records.set(JSON.stringify([carol, '__adaptive__:math-v1']), { user_id: carol, module_id: '__adaptive__:math-v1', best: 7, session: ten, revision: 'carol' });
  const roster = await (await call(teacher, { query: '/roster' })).json();
  assert.deepEqual(roster, { total: Object.keys(restarted.topics).length, students: { [alice]: engine.adaptiveSummary(restarted).mastered, [carol]: 7 } }, 'only adaptive exam rows are listed, not practice checkpoints');
  assert.equal(rosterReads, 1);
  records.delete(JSON.stringify([bob, 'fractions-practice'])); records.delete(JSON.stringify([carol, '__adaptive__:math-v1']));

  // The exam row is not a practice checkpoint: the practice sync must not see it.
  const progress = await fetch(base + '/progress', { headers: { authorization: alice, 'X-Practice-Owner': alice } });
  assert.equal(progress.status, 200); assert.deepEqual(await progress.json(), []);

  // A long exam stays far below the request size limit, and still saves.
  const long = answered('alice-exam-3', 450, 300000);
  assert.equal(long.responses.length, 300, 'the response log is capped');
  assert.ok(JSON.stringify({ state: long }).length < 250000, `saved exam is ${JSON.stringify({ state: long }).length} bytes`);
  assert.equal((await call(alice, { state: long })).status, 200);

  // Storage trouble is reported, so the browser keeps its copy and retries.
  broken = true;
  assert.equal((await call(alice)).status, 503);
  assert.equal((await call(alice, { state: long })).status, 503);
  assert.equal((await call(teacher, { query: '/roster' })).status, 503);
});
