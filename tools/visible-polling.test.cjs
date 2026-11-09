const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../client/src/lib/visiblePolling.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const presenceCode = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../client/src/features/account/presence.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
function fixture(visibility = 'visible') {
  let now = 0, sequence = 0;
  const timers = new Map();
  const target = () => {
    const listeners = new Map();
    return {
      addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
      removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
      emit(name) { for (const fn of listeners.get(name) ?? []) fn(); },
      count() { return [...listeners.values()].reduce((sum, list) => sum + list.size, 0); },
    };
  };
  const document = { ...target(), visibilityState: visibility }, window = target(), exports = {};
  const context = {
    exports, document, window, Date: { now: () => now },
    setTimeout(fn, delay) { const id = ++sequence; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  vm.runInNewContext(code, context);
  const presence = {};
  vm.runInNewContext(presenceCode, { ...context, exports: presence, crypto: { randomUUID: () => `lease-${++sequence}` }, require: name => name.endsWith('visiblePolling') ? exports : { ACCOUNT_PRESENCE_INTERVAL_MS: 60_000 } });
  return {
    start: exports.startVisiblePolling, presence: presence.startAccountPresence, document, window, timers,
    async visible(value) { document.visibilityState = value ? 'visible' : 'hidden'; document.emit('visibilitychange'); await flush(); },
    async advance(ms) {
      const end = now + ms; await flush();
      while (true) {
        const next = [...timers.entries()].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at; timers.delete(next[0]); next[1].fn(); await flush();
      }
      now = end; await flush();
    },
  };
}

test('game polling pauses when hidden and immediately refreshes on return', async () => {
  const f = fixture(); let calls = 0;
  const stop = f.start(async () => { calls++; }, { intervalMs: 1500, immediate: false });
  await f.advance(1499); assert.equal(calls, 0);
  await f.advance(1); assert.equal(calls, 1);
  await f.visible(false); await f.advance(60_000); assert.equal(calls, 1);
  await f.visible(true); assert.equal(calls, 2);
  await f.advance(1500); assert.equal(calls, 3);
  await stop(); assert.equal(f.timers.size, 0); assert.equal(f.document.count() + f.window.count(), 0);
});

test('slow requests never overlap, and stop waits before lease cleanup', async () => {
  const f = fixture(); let release, calls = 0;
  const stop = f.start(() => { calls++; return new Promise(resolve => { release = resolve; }); }, { intervalMs: 1000 });
  await flush(); await f.advance(5000); await f.visible(false); await f.visible(true);
  assert.equal(calls, 1);
  let cleaned = false; const cleanup = stop().then(() => { cleaned = true; });
  await flush(); assert.equal(cleaned, false);
  release(); await cleanup; assert.equal(cleaned, true);
  await f.advance(60_000); assert.equal(calls, 1); assert.equal(f.timers.size, 0);
});

test('presence writes halve in visible tabs and rapid tab switching cannot add writes', async () => {
  const f = fixture(); let calls = 0;
  const stop = f.presence(async () => { calls++; }, async () => {});
  await f.advance(599_999); assert.equal(calls, 10, 'ten heartbeats in ten minutes instead of twenty');
  await f.visible(false); await f.visible(true); assert.equal(calls, 10);
  await f.advance(1); assert.equal(calls, 11);
  await f.visible(false); await f.advance(600_000); assert.equal(calls, 11);
  await f.visible(true); assert.equal(calls, 12);
  await stop();
});

test('page restore and account changes cannot have new leases deleted by an older write', async () => {
  const f = fixture(), leases = new Set(), writes = [], removed = [];
  const releases = [];
  const old = f.presence(id => { writes.push(id); return new Promise(resolve => { releases.push(() => { leases.add(id); resolve(); }); }); }, async id => { removed.push(id); leases.delete(id); });
  await flush();
  f.window.emit('pagehide');
  f.window.emit('pageshow');
  await flush();
  assert.equal(writes.length, 2); assert.notEqual(writes[0], writes[1]);
  // Retire the restored session too, then log in with a fresh lifecycle.
  const oldCleanup = old();
  const current = f.presence(async id => { writes.push(id); leases.add(id); }, async id => { removed.push(id); leases.delete(id); });
  await flush();
  releases[0](); releases[1](); await oldCleanup; await flush();
  assert.deepEqual(removed.sort(), writes.slice(0, 2).sort());
  assert.ok(leases.has(writes[2])); assert.ok(!removed.includes(writes[2]));
  await current(); assert.ok(!leases.has(writes[2]));
});

test('failures back off, success restores cadence, and hidden startup performs no requests', async () => {
  const f = fixture('hidden'); let calls = 0, failing = true;
  const stop = f.start(async () => { calls++; if (failing) throw new Error('offline'); }, { intervalMs: 1000, maxRetryMs: 4000 });
  await f.advance(10000); assert.equal(calls, 0);
  await f.visible(true); assert.equal(calls, 1);
  await f.advance(1999); assert.equal(calls, 1); await f.advance(1); assert.equal(calls, 2);
  await f.advance(4000); assert.equal(calls, 3);
  failing = false; await f.advance(4000); assert.equal(calls, 4);
  await f.advance(1000); assert.equal(calls, 5);
  await stop();
});

test('back-forward cache suspension resumes and stopped effects cannot start queued work', async () => {
  const f = fixture(); let calls = 0;
  const abandoned = f.start(async () => { calls++; }, { intervalMs: 1000 });
  await abandoned(); assert.equal(calls, 0);
  const stop = f.start(async () => { calls++; }, { intervalMs: 1000 });
  await flush(); assert.equal(calls, 1);
  f.window.emit('pagehide'); await f.advance(10000); assert.equal(calls, 1);
  f.window.emit('pageshow'); await flush(); assert.equal(calls, 2);
  await stop();
});
