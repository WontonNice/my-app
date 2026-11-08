const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });

// Keep the real HTTP middleware and replace downstream routes so this test
// cannot authenticate or write a student's result to a database.
const appSource = fs.readFileSync(path.resolve(__dirname, '../src/app.ts'), 'utf8');
for (const [, name, route] of appSource.matchAll(/import \{ (\w+Router) \} from "\.\/routes\/([^";]+)"/g)) {
  const id = require.resolve(`../src/routes/${route}.ts`);
  const router = express.Router();
  if (name === 'progressRouter') {
    router.put('/exam-results/:assessmentId', (req, res) => res.json({ assessmentId: req.body.result.assessmentId }));
    router.put('/exam-sessions/:assessmentId', (_req, res) => res.sendStatus(204));
  }
  require.cache[id] = { id, filename: id, loaded: true, exports: { [name]: router } };
}
const { createApp } = require('../src/app.ts');
const { createExamResult } = require('../src/shared/examGrading.ts');
const content = require('../data/exam-content.json')['2024-2025-form-b'];

async function withApp(run) {
  const app = createApp({ allowedOrigins: [], clientDistPath: __dirname });
  const server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}

test('2024–2025 Form B final answers pass the real app JSON parser', async () => {
  const body = JSON.stringify({ result: createExamResult(content, {}, ['english', 'math']) });
  assert.ok(Buffer.byteLength(body) > 1024 * 1024, 'The actual exam snapshot reproduces the oversized submission');
  await withApp(async root => {
    const response = await fetch(`${root}/api/progress/exam-results/2024-2025-form-b`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body,
    });
    const payload = await response.json();
    assert.equal(response.status, 200, JSON.stringify(payload));
    assert.equal(payload.assessmentId, content.assessmentId);
  });
});

test('unrelated writes still enforce the default body limit and report HTTP 413', async () => {
  await withApp(async root => {
    const response = await fetch(`${root}/api/progress/exam-sessions/example`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ padding: 'x'.repeat(1024 * 1024) }),
    });
    assert.equal(response.status, 413);
    assert.match((await response.json()).message, /too large/i);
  });
});
