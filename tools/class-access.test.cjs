const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Exercise the components' actual effects and handlers with controlled async
// responses; no real accounts or enrollment changes are needed.
function fixture(page = false) {
  const student = { user: { id: 'student', app_metadata: { role: 'student' } }, access_token: 'test' };
  const state = { session: student, classes: [{ id: 'shsat' }], failure: false, redirects: [], cached: [], calls: 0 };
  let slots = [], cursor = 0, dirty = false, effects = [], tree;
  const hooks = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; dirty = true; }];
    },
    useEffect(callback, deps) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || deps.some((value, i) => !Object.is(value, previous.deps[i]))) {
        previous?.cleanup?.();
        slots[index] = { deps };
        effects.push(() => { slots[index].cleanup = callback(); });
      }
    },
  };
  async function classes() { state.calls++; if (state.failure) throw new Error('API unavailable'); return state.classes; }
  const stubs = {
    react: { ...React, ...hooks },
    '../lib/api': { getStudentClasses: classes, getStudentClassAccess: async () => ({ classes: await classes(), pendingRequests: [] }) },
    '../lib/auth': { getUserRole: user => user.app_metadata.role },
    '../lib/sessionCache': { getActiveSession: async () => { if (state.sessionFailure) throw new Error('Storage unavailable'); return state.session; }, peekActiveSession: () => state.session, cacheStudentClasses: (id, value) => state.cached.push({ id, value }) },
    '../lib/supabase': { isSupabaseConfigured: true },
    '../lib/accountSwitching': { signOutCurrentAccount: async () => {} },
    '../hooks/useStudentPortalAccess': { useStudentPortalAccess: () => ({ accessToken: 'test', isCheckingSession: false, isSupabaseConfigured: true, previewContext: { isPreview: false }, studentName: 'Test Student' }) },
  };
  const window = { location: { search: '', assign: value => state.redirects.push(value), replace: value => state.redirects.push(value) } };
  function load(relative) {
    const code = ts.transpileModule(readFileSync(resolve(__dirname, '../client/src', relative), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
    const module = { exports: {} };
    runInNewContext(code, { exports: module.exports, module, window, require: id => stubs[id] ?? (id.endsWith('/ClassAccessError') ? load('components/ClassAccessError.tsx') : require(id)) });
    return module.exports;
  }
  const Component = page ? load('pages/StudentClassroomPage.tsx').StudentClassroomPage : load('components/ClassAccessGate.tsx').ClassAccessGate;
  function render() {
    cursor = 0; dirty = false;
    tree = Component({ children: React.createElement('p', null, 'Protected dashboard') });
    const pending = effects; effects = []; pending.forEach(effect => effect());
  }
  return {
    state, window,
    async settle() { render(); for (let i = 0; i < 5; i++) { await new Promise(setImmediate); if (dirty) render(); } return renderToStaticMarkup(tree); },
    retry() { assert.equal(typeof tree.props.onRetry, 'function'); tree.props.onRetry(); },
    unmount() { slots.forEach(slot => slot?.cleanup?.()); },
  };
}

test('failed enrollment lookup neither redirects nor clears cached enrollment; retry recovers', async () => {
  const f = fixture(); f.state.failure = true;
  const failed = await f.settle();
  assert.match(failed, /Retry classroom access/);
  assert.doesNotMatch(failed, /Protected dashboard/);
  assert.deepEqual(f.state.redirects, []); assert.deepEqual(f.state.cached, []);
  f.state.failure = false; f.retry();
  assert.match(await f.settle(), /Protected dashboard/);
  assert.equal(f.state.calls, 2); assert.equal(f.state.cached[0].value[0].id, 'shsat');
});

test('only a successful lookup with no enrollment redirects to the code page, including student preview URLs', async () => {
  const f = fixture(); f.state.classes = []; f.window.location.search = '?preview=student';
  assert.doesNotMatch(await f.settle(), /Protected dashboard/);
  assert.deepEqual(f.state.redirects, ['/study-hall/classroom']);
});

test('missing sessions go to login and session lookup failures remain retryable', async () => {
  const missing = fixture(); missing.state.session = null; await missing.settle();
  assert.deepEqual(missing.state.redirects, ['/login']);
  const failed = fixture(); failed.state.sessionFailure = true;
  assert.match(await failed.settle(), /Retry classroom access/);
  assert.deepEqual(failed.state.redirects, []);
});

test('teacher preview opens without a student enrollment lookup', async () => {
  const f = fixture(); f.state.session.user.app_metadata.role = 'teacher';
  assert.match(await f.settle(), /Protected dashboard/); assert.equal(f.state.calls, 0);
});

test('class-code page hides enrollment form on lookup failure and retry restores enrolled dashboard', async () => {
  const f = fixture(true); f.state.failure = true;
  const failed = await f.settle();
  assert.match(failed, /Retry classroom access/); assert.doesNotMatch(failed, /Request access|student-class-code/);
  assert.deepEqual(f.state.cached, []);
  f.state.failure = false; f.retry(); await f.settle();
  assert.deepEqual(f.state.redirects, ['/study-hall/shsat']); assert.equal(f.state.calls, 2);
});

test('class-code page still offers enrollment after a successful empty lookup', async () => {
  const f = fixture(true); f.state.classes = [];
  assert.match(await f.settle(), /Request access/); assert.deepEqual(f.state.redirects, []);
});
