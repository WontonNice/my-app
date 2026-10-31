const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
let calls = 0;
const student = { id: 'student', app_metadata: { role: 'student', class_ids: ['shsat'] }, user_metadata: {} };
let account = student, authError = null, throws = false;
const moduleId = require.resolve('../src/lib/supabase.ts');
require.cache[moduleId] = { id: moduleId, filename: moduleId, loaded: true, exports: { supabase: { auth: {
  getClaims() { throw new Error('Enrollment must not add a claims lookup'); },
  async getUser(token) {
    calls++;
    assert.equal(token, 'student-token');
    if (throws) throw new TypeError('fetch failed');
    return { data: { user: authError ? null : account }, error: authError };
  },
  admin: { getUserById() { throw new Error('Enrollment must not add a second account lookup'); } },
} } } };
let server, root;
before(async () => {
  const app = require('express')();
  app.use('/api/classes', require('../src/routes/classes.ts').classesRouter);
  server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  root = `http://127.0.0.1:${server.address().port}/api/classes/mine`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });
async function call(header = 'Bearer student-token') {
  const response = await fetch(root, { headers: header ? { Authorization: header } : {} });
  return { status: response.status, body: await response.json() };
}
function reset() { calls = 0; account = structuredClone(student); authError = null; throws = false; }

test('classroom entry verifies the token and current enrollment with exactly one account request', async () => {
  reset();
  const result = await call();
  assert.equal(result.status, 200);
  assert.ok(result.body.classes.some(item => item.id === 'shsat'));
  assert.equal(calls, 1);
});
test('missing or invalid sessions are rejected and archived accounts cannot enter', async () => {
  reset();
  assert.equal((await call('')).status, 401);
  assert.equal(calls, 0);
  authError = { status: 401 };
  assert.equal((await call()).status, 401);
  authError = null;
  account.app_metadata.student_archived_at = '2026-10-30';
  const archived = await call();
  assert.equal(archived.status, 403);
  assert.match(archived.body.message, /archived/);
  assert.equal(archived.body.classes, undefined);
});
test('Auth outages are retryable service failures, never expired sessions or empty enrollment', async () => {
  for (const status of [0, 429, 500, 503]) {
    reset(); authError = { status };
    const result = await call();
    assert.equal(result.status, 503);
    assert.match(result.body.message, /temporarily unavailable/);
    assert.equal(result.body.classes, undefined);
    assert.equal(calls, 1);
  }
  reset(); throws = true;
  assert.equal((await call()).status, 503);
  throws = false;
  assert.equal((await call()).status, 200);
});
test('every new entry uses fresh enrollment and cannot reuse access revoked between requests', async () => {
  reset();
  assert.equal((await call()).body.classes.length, 1);
  account.app_metadata.class_ids = [];
  const result = await call();
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.classes, []);
  assert.equal(calls, 2);
});
