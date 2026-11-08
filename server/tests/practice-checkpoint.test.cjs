const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
require('../../tools/register-practice-generator.cjs');
const { createPracticeState, checkPracticeAnswer } = require('../../client/src/features/math-command/inequalitySession.ts');

test('authenticated checkpoints survive stale writes, retry conflicts, and isolate students', async t => {
  const records = new Map();
  let conflict = false;
  function from(table) {
    assert.equal(table, 'math_practice_checkpoints');
    let insert, update;
    const filters = {};
    return {
      select() { return this; }, order() { return this; },
      not() { filters.excludeEvidence=true; return this; },
      eq(key, value) { filters[key] = value; return this; },
      insert(row) { insert = row; return this; },
      update(row) { update = row; return this; },
      range(start, end) {
        return { data: [...records.values()].filter(row => row.user_id === filters.user_id&&(!filters.excludeEvidence||!row.module_id.startsWith('__response__:')))
          .map(row => ({ ...row, moduleId: row.module_id })).slice(start, end + 1) };
      },
      maybeSingle() {
        const row = insert ?? filters;
        const key = JSON.stringify([row.user_id, row.module_id]);
        const current = records.get(key);
        if (insert && current) return { error: { code: '23505' } };
        if (update && conflict) {
          conflict = false;
          records.set(key, { ...current, best: 25, revision: 'concurrent' });
          return { data: null };
        }
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
    getAuthenticatedUser: async id => ({ user: id && { id, app_metadata: { role: 'student' } } }),
    getEnrolledClassIds: () => ['shsat'],
  } };
  const app = express();
  app.use(express.json());
  app.use('/practice', require('../src/routes/infinitePractice.ts').infinitePracticeRouter);
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = 'http://127.0.0.1:' + server.address().port + '/practice/progress';
  const call = (user, owner, body) => fetch(url, {
    method: body ? 'PUT' : 'GET', headers: { authorization: user, 'X-Practice-Owner': owner, 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) }),
  });
  const session = createPracticeState('inequalities', 'one');
  const initial = { moduleId: session.moduleId, best: 0, session };
  assert.equal((await call('bob', 'alice', initial)).status, 403);
  assert.equal((await call('alice', 'alice', { ...initial, moduleId: 'another' })).status, 400);
  assert.equal((await call('alice', 'alice', initial)).status, 200);
  conflict = true;
  const scored = checkPracticeAnswer({ ...session, answer: 'A' }, true);
  const update = await call('alice', 'alice', { ...initial, session: scored });
  assert.equal(update.status, 200);
  assert.equal((await update.json()).best, 25);
  await call('alice', 'alice', initial);
  const [restored] = await (await call('alice', 'alice')).json();
  assert.equal(restored.session.streak, 1);
  assert.equal(restored.best, 25);
  assert.equal(restored.session.evidenceThrough,0);
  assert.deepEqual(restored.session.responses,[],'Acknowledged evidence leaves the resumable checkpoint compact.');
  const evidence=[...records.values()].filter(row=>row.module_id.startsWith('__response__:'));
  assert.equal(evidence.length,1);
  assert.equal(evidence[0].session.question.prompt,scored.responses[0].question.prompt);
  assert.equal(evidence[0].session.answer,'A');
  assert.equal((await call('alice','alice',{...initial,session:scored})).status,200);
  assert.equal([...records.values()].filter(row=>row.module_id.startsWith('__response__:')).length,1,'Retries cannot duplicate evidence.');
  const conflicting=structuredClone(scored);conflicting.responses[0].answer='B';
  assert.equal((await call('alice','alice',{...initial,session:conflicting})).status,409);
  assert.deepEqual(await (await call('bob', 'bob')).json(), []);
});
