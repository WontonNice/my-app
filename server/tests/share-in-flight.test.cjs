const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
const { shareInFlight } = require('../src/lib/shareInFlight.ts');

test('overlapping callers share one run and a later call starts a new one', async () => {
  let runs = 0, finish;
  const shared = shareInFlight(() => { runs++; return new Promise(resolve => { finish = resolve; }); });
  const first = shared(), second = shared();
  assert.equal(runs, 1);
  finish('built');
  assert.deepEqual(await Promise.all([first, second]), ['built', 'built']);
  const third = shared();
  assert.equal(runs, 2);
  finish('rebuilt');
  assert.equal(await third, 'rebuilt');
});

test('a failed run reaches every waiting caller and does not block the next run', async () => {
  let runs = 0;
  const shared = shareInFlight(async () => { if (++runs === 1) throw new Error('unavailable'); return 'ok'; });
  const first = shared(), second = shared();
  await assert.rejects(first, /unavailable/);
  await assert.rejects(second, /unavailable/);
  assert.equal(await shared(), 'ok');
  assert.equal(runs, 2);
});
