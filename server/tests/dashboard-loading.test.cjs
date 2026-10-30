const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function loadTS(relative) {
  const filename = path.resolve(__dirname, relative);
  const compiled = require('typescript').transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: 1, target: 9 } }).outputText;
  const Module = require('node:module');
  const loaded = new Module(filename, module);
  loaded._compile(compiled, filename);
  return loaded.exports;
}
const deadline = loadTS('../../client/src/lib/requestDeadline.ts');
const { loadDashboardResource } = loadTS('../../client/src/lib/dashboardResource.ts');

function apiWith(fetch, auth = {}) {
  const source = fs.readFileSync(path.resolve(__dirname, '../../client/src/lib/api.ts'), 'utf8').replaceAll('import.meta.env.DEV', 'false').replaceAll('import.meta.env.VITE_API_BASE_URL', 'undefined');
  const output = require('typescript').transpileModule(source, { compilerOptions: { module: 1, target: 9 } }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports, Headers, Error, URLSearchParams, fetch, setTimeout: (fn) => setTimeout(fn, 1), clearTimeout,
    require: name => {
      if (name === './supabase') return { isSupabaseConfigured: true, getSupabaseClient: () => ({ auth: { getSession: async () => ({ data: {} }), ...auth } }) };
      if (name === './requestDeadline') return { ...deadline, withRequestDeadline: (signal, run) => deadline.withRequestDeadline(signal, run, 40) };
      throw new Error(`Unexpected import ${name}`);
    },
  });
  return exports.requestApi;
}

test('successful accounts publish while analytics hangs and assessments fail', async () => {
  const state = {}, data = {};
  let finish;
  const analytics = new Promise(resolve => { finish = resolve; });
  const load = (key, fetch) => loadDashboardResource(fetch, value => { data[key] = value; }, value => { state[key] = value; });
  const pending = load('students', () => analytics);
  await Promise.all([
    load('accounts', async () => [{ id: 'student' }]),
    load('assessments', async () => { throw new Error('Unavailable'); }),
  ]);
  assert.equal(state.students.status, 'loading');
  assert.deepEqual(data.accounts, [{ id: 'student' }]);
  assert.equal(state.accounts.status, 'ready');
  assert.equal(state.assessments.status, 'error');
  assert.equal(data.assessments, undefined, 'a failed load must not publish an empty list');
  finish([{ id: 'progress' }]);
  await pending;
  await load('assessments', async () => ['exam']);
  assert.deepEqual(state.assessments, { status: 'ready' }, 'a successful retry clears the error');
});

test('one API deadline covers a hung session lookup before fetch', async () => {
  let calls = 0;
  const api = apiWith(async () => { calls++; }, { getSession: () => new Promise(() => {}) });
  await assert.rejects(api('/api/auth/students', { headers: { Authorization: 'Bearer token' } }), deadline.RequestTimeoutError);
  assert.equal(calls, 0);
});

test('a timed-out GET aborts its fetch and is not replayed three times', async () => {
  let calls = 0, signal;
  const api = apiWith((_url, init) => { calls++; signal = init.signal; return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason))); });
  await assert.rejects(api('/api/auth/students'), deadline.RequestTimeoutError);
  assert.equal(signal.aborted, true);
  assert.equal(calls, 1);
});

test('the API deadline includes a stalled response body and auth refresh', async () => {
  const api = apiWith(async () => ({ ok: true, status: 200, json: () => new Promise(() => {}) }));
  await assert.rejects(api('/api/progress/students'), deadline.RequestTimeoutError);
  const refresh = apiWith(async () => new Response('{}', { status: 401 }), { refreshSession: () => new Promise(() => {}) });
  await assert.rejects(refresh('/api/auth/students', { headers: { Authorization: 'Bearer token' } }), deadline.RequestTimeoutError);
});

test('transient GET failures can recover within the budget, writes never retry', async () => {
  let calls = 0;
  const api = apiWith(async () => ++calls === 1 ? new Response('{}', { status: 503 }) : Response.json({ students: ['saved'] }));
  assert.deepEqual(await api('/api/auth/students'), { students: ['saved'] });
  assert.equal(calls, 2);
  calls = 0;
  const write = apiWith(() => { calls++; return new Promise(() => {}); });
  await assert.rejects(write('/api/progress', { method: 'POST' }), /change was not confirmed; refresh/);
  assert.equal(calls, 1);
});

test('caller cancellation is immediate and prevents a later request', async () => {
  const controller = new AbortController();
  let resolveSession, calls = 0;
  const api = apiWith(async () => { calls++; return Response.json({}); }, { getSession: () => new Promise(resolve => { resolveSession = resolve; }) });
  const pending = api('/api/auth/students', { signal: controller.signal, headers: { Authorization: 'Bearer token' } });
  await new Promise(resolve => setImmediate(resolve));
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  resolveSession({ data: {} });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 0);
});
