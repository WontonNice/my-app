const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
const { mapConcurrent } = require('../src/lib/mapConcurrent.ts');
const { readCachedJson } = require('../src/lib/cachedJson.ts');
test('bounded batches overlap, preserve order and keep all records', async () => {
  let active = 0, peak = 0;
  const rows = await mapConcurrent([0, 1, 2, 3, 4], 2, async n => {
    active++; peak = Math.max(active, peak);
    await new Promise(resolve => setTimeout(resolve, n === 0 ? 15 : 1));
    active--; return n;
  });
  assert.equal(peak, 2);
  assert.deepEqual(rows, [0, 1, 2, 3, 4]);
});
test('failed batches reject rather than returning partial data', async () => {
  await assert.rejects(mapConcurrent([1, 2, 3], 2, async n => {
    if (n === 2) throw new Error('storage unavailable');
    return n;
  }), /storage unavailable/);
  assert.deepEqual(await mapConcurrent([], 2, async () => assert.fail()), []);
});
test('content cache avoids repeated reads, isolates mutations and reloads file changes', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-cache-'));
  const filename = path.join(dir, 'catalog.json');
  const originalRead = fs.readFileSync;
  try {
    fs.writeFileSync(filename, '{"items":["first"]}');
    let reads = 0;
    fs.readFileSync = function(file, ...args) { if (file === filename) reads++; return originalRead.call(this, file, ...args); };
    const first = readCachedJson(filename);
    first.items.push('mutation');
    assert.deepEqual(readCachedJson(filename), { items: ['first'] });
    assert.equal(reads, 1);
    fs.writeFileSync(filename, '{"items":["updated content"]}');
    assert.deepEqual(readCachedJson(filename), { items: ['updated content'] });
    assert.equal(reads, 2);
    fs.writeFileSync(filename, 'broken json');
    assert.throws(() => readCachedJson(filename), SyntaxError);
    fs.unlinkSync(filename);
    assert.throws(() => readCachedJson(filename), { code: 'ENOENT' });
  } finally {
    fs.readFileSync = originalRead;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
