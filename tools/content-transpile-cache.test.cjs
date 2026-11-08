const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createTranspiler } = require('./content-transpile-cache.cjs');

test('unchanged files reuse compilation while same-length edits and reversions compile fresh', () => {
  let calls = 0;
  const compile = createTranspiler({ compile: source => { calls++; return source.toUpperCase(); } });
  assert.equal(compile('a.ts', 'old'), 'OLD');
  assert.equal(compile('a.ts', 'old'), 'OLD');
  assert.equal(calls, 1);
  assert.equal(compile('a.ts', 'new'), 'NEW');
  assert.equal(compile('a.ts', 'old'), 'OLD');
  assert.equal(calls, 3);
});

test('cache is bounded and keeps recently used files', () => {
  let calls = 0;
  const compile = createTranspiler({ maxEntries: 2, compile: source => { calls++; return source; } });
  compile('a', 'a'); compile('b', 'b'); compile('a', 'a'); compile('c', 'c');
  assert.equal(calls, 3);
  compile('a', 'a'); assert.equal(calls, 3);
  compile('b', 'b'); assert.equal(calls, 4);
});

test('invalid changed source never falls back to stale compiled code', () => {
  const compile = createTranspiler({ compile: source => { if (source === 'bad') throw new Error('invalid'); return source; } });
  compile('a', 'good');
  assert.throws(() => compile('a', 'bad'), /invalid/);
  assert.throws(() => compile('a', 'bad'), /invalid/);
  assert.equal(compile('a', 'fixed'), 'fixed');
});
