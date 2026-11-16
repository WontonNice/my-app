const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });

// Runs the real lib/auth role logic and the real auth router (other suites stub
// lib/auth). Only the Supabase client is faked: each bearer token maps to a user,
// exactly as a verified Supabase JWT would carry app_metadata and user_metadata.
const users = {
  forgedAdmin: { id: 'forged', app_metadata: {}, user_metadata: { role: 'admin' } },
  studentClaimingAdmin: { id: 'sneaky', app_metadata: { role: 'student' }, user_metadata: { role: 'admin' } },
  teacher: { id: 'teacher', app_metadata: { role: 'teacher' }, user_metadata: {} },
  student: { id: 'student', email: 'kid@students.nathantutors.local', app_metadata: { role: 'student', class_ids: ['shsat'] }, user_metadata: { username: 'kid', full_name: 'Kid' } },
};
const created = [];
const fakeSupabase = {
  auth: {
    getClaims: async token => {
      const user = users[token];
      return user ? { data: { claims: { sub: user.id, app_metadata: user.app_metadata, user_metadata: user.user_metadata, iat: 0, aud: 'authenticated' } } } : { data: null, error: { message: 'bad token' } };
    },
    getUser: async token => (users[token] ? { data: { user: users[token] }, error: null } : { data: { user: null }, error: { status: 401, message: 'bad token' } }),
    admin: {
      createUser: async attributes => { created.push(attributes); return { data: { user: { id: 'new' } }, error: null }; },
      listUsers: async () => ({ data: { users: Object.values(users) }, error: null }),
    },
  },
  from: () => { throw new Error('database not available in this test'); },
};
function stub(relative, exports) { const id = require.resolve(relative); require.cache[id] = { id, filename: id, loaded: true, exports }; }
stub('../src/lib/supabase.ts', { supabase: fakeSupabase });
stub('../src/lib/studentRoster.ts', { listDashboardUsers: async () => ({ data: { users: Object.values(users) }, error: null }) });

const { getUserRole } = require('../src/lib/auth.ts');
const express = require('express');
const { authRouter } = require('../src/routes/auth.ts');

let server;
let baseUrl;
before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  await new Promise(resolve => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(() => server?.close());
const call = (route, token, init = {}) => fetch(`${baseUrl}/api/auth${route}`, {
  ...init,
  headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
});

test('a role claimed only in user-editable metadata grants nothing', () => {
  for (const claimed of ['admin', 'teacher', 'staff']) {
    assert.equal(getUserRole({ app_metadata: {}, user_metadata: { role: claimed } }), 'student', `user_metadata.role=${claimed} must not escalate`);
  }
  assert.equal(getUserRole(users.studentClaimingAdmin), 'student');
});

test('trusted app_metadata roles still resolve', () => {
  for (const role of ['admin', 'staff', 'teacher', 'student']) {
    assert.equal(getUserRole({ app_metadata: { role }, user_metadata: {} }), role);
  }
  assert.equal(getUserRole({ app_metadata: {}, user_metadata: {} }), 'student');
});

test('exploit: updateUser({data:{role:"admin"}}) no longer unlocks teacher/admin routes', async () => {
  for (const token of ['forgedAdmin', 'studentClaimingAdmin']) {
    assert.equal((await call('/students', token)).status, 403, `${token} listed every student`);
    assert.equal((await call('/staff', token)).status >= 400, true, `${token} read staff accounts`);
    const reset = await call('/students/student', token, { method: 'PATCH', body: JSON.stringify({ password: 'Hijacked123!' }) });
    assert.equal(reset.status >= 400, true, `${token} reset another student's password`);
  }
});

test('real teachers keep access', async () => {
  const response = await call('/students', 'teacher');
  assert.equal(response.status, 200);
  const { students } = await response.json();
  assert.deepEqual(students.map(student => student.id), ['forged', 'sneaky', 'student']);
});

test('registration stores the student role in trusted app_metadata', async () => {
  const response = await call('/register', null, { method: 'POST', body: JSON.stringify({ username: 'newkid', password: 'Password123!', fullName: 'New Kid' }) });
  assert.ok(response.status < 400, `register failed with ${response.status}: ${await response.clone().text()}`);
  assert.equal(created.at(-1)?.app_metadata?.role, 'student');
});
