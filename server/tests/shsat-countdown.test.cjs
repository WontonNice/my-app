const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { getShsatCountdown, SHSAT_TEST_DAY_MS } = require('../../client/src/lib/shsatCountdown.ts');

test('SHSAT countdown targets midnight on November 18 in New York, not noon or browser-local time', () => {
  assert.equal(SHSAT_TEST_DAY_MS, Date.parse('2026-11-18T05:00:00Z'));
  assert.deepEqual(getShsatCountdown(Date.parse('2026-11-16T22:00:00-05:00')), { days: 1, hours: 2, finished: false, underHour: false });
});

test('countdown measures real elapsed hours across New York daylight saving time', () => {
  assert.deepEqual(getShsatCountdown(Date.parse('2026-10-31T00:00:00-04:00')), { days: 18, hours: 1, finished: false, underHour: false });
});

test('countdown rolls day/hour boundaries and identifies the final partial hour', () => {
  assert.deepEqual(getShsatCountdown(SHSAT_TEST_DAY_MS - 24 * 3_600_000), { days: 1, hours: 0, finished: false, underHour: false });
  assert.deepEqual(getShsatCountdown(SHSAT_TEST_DAY_MS - 23 * 3_600_000), { days: 0, hours: 23, finished: false, underHour: false });
  assert.deepEqual(getShsatCountdown(SHSAT_TEST_DAY_MS - 1), { days: 0, hours: 0, finished: false, underHour: true });
});

test('countdown stops at zero and does not roll over to a later year', () => {
  for (const now of [SHSAT_TEST_DAY_MS, SHSAT_TEST_DAY_MS + 1000, Date.parse('2027-01-01')]) {
    assert.deepEqual(getShsatCountdown(now), { days: 0, hours: 0, finished: true, underHour: false });
  }
});
