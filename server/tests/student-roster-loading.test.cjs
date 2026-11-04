const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
let calls = 0, fail = false;
const id = require.resolve('../src/lib/supabase.ts');
require.cache[id] = { id, filename: id, loaded: true, exports: { supabase: { auth: { admin: {
  async listUsers({page}) {
    calls++;
    await new Promise(resolve => setImmediate(resolve));
    if (fail) return { data: null, error: { message: 'unavailable' } };
    return { data: { users: Array.from({ length: page === 1 ? 1000 : 1 }, (_, n) => ({ id: `${page}-${n}` })) }, error: null };
  }
} } } } };
const { listDashboardUsers } = require('../src/lib/studentRoster.ts');
test('concurrent sections share paginated roster, later reads refresh and failures can recover', async () => {
  const [first, second] = await Promise.all([listDashboardUsers(), listDashboardUsers()]);
  assert.equal(calls, 2);
  assert.equal(first.data.users.length, 1001);
  assert.equal(second.data.users.length, 1001);
  await listDashboardUsers();
  assert.equal(calls, 4);
  fail = true;
  assert.equal((await listDashboardUsers()).error.message, 'unavailable');
  fail = false;
  assert.equal((await listDashboardUsers()).data.users.length, 1001);
});
