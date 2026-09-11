import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

test('new exams are locked, registered, editable, unique, and protected by the editor token', async () => {
  const toolsRoot = dirname(fileURLToPath(import.meta.url));
  const root = resolve(toolsRoot, '..');
  const fixture = await mkdtemp(join(toolsRoot, '.exam-create-test-'));
  const modulePath = join(toolsRoot, `.exam-create-test-${Date.now()}.mjs`);
  let server;
  try {
    await mkdir(join(fixture, 'client/src'), { recursive: true });
    await mkdir(join(fixture, 'server/data'), { recursive: true });
    await mkdir(join(fixture, 'tools'), { recursive: true });
    await cp(join(root, 'client/src/content'), join(fixture, 'client/src/content'), { recursive: true });
    await cp(join(root, 'server/data/assessments.json'), join(fixture, 'server/data/assessments.json'));
    await cp(join(toolsRoot, 'practice-topics.json'), join(fixture, 'tools/practice-topics.json'));
    await cp(join(toolsRoot, 'content-topics.json'), join(fixture, 'tools/content-topics.json'));
    const source = (await readFile(join(toolsRoot, 'content-studio.mjs'), 'utf8'))
      .replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");', `const workspaceRoot = ${JSON.stringify(fixture)};`)
      .split('if (process.argv.includes("--validate"))')[0] + '\nexport { handleRequest, getState, saveTest };\n';
    await writeFile(modulePath, source);
    const studio = await import(pathToFileURL(modulePath).href);
    server = createServer(studio.handleRequest);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/api/exams`;
    const state = await studio.getState();
    const send = (body, token = state.editToken) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, body: JSON.stringify(body) });
    assert.equal((await send({ title: 'New example' }, 'invalid')).status, 403);
    assert.equal((await send({ title: ' ', durationMinutes: 180 })).status, 400);
    assert.equal((await send({ title: 'Example test', durationMinutes: 0 })).status, 400);
    const created = await send({ title: 'Example new exam', durationMinutes: 90, description: 'A past paper test.' });
    const payload = await created.json();
    assert.equal(created.status, 201, JSON.stringify(payload));
    assert.equal(payload.assessment.correctionsOpen, false);
    assert.deepEqual(payload.assessment.sectionAccess, { english: false, math: false });
    assert.equal(payload.assessment.status, 'locked');
    assert.equal((await send({ title: 'Example new exam' })).status, 409);
    const refreshed = await studio.getState();
    const exam = refreshed.tests.find(test => test.assessmentId === payload.assessment.id);
    assert.ok(exam); assert.equal(exam.passageIds.length, 0);
    const exported = JSON.parse(await readFile(join(fixture, 'server/data/exam-content.json'), 'utf8'));
    assert.equal(exported[payload.assessment.id].passageSets.length, 0);
    await studio.saveTest({ assessmentId: payload.assessment.id, readingPassageIds: [refreshed.passages[0].id], sourceHash: exam.sourceHash });
    const saved = await studio.getState();
    assert.equal(saved.assessments.find(item => item.id === payload.assessment.id).questions.length, refreshed.passages[0].questions.length);
    assert.deepEqual(saved.tests.find(item => item.assessmentId === payload.assessment.id).readingPassageIds, [refreshed.passages[0].id]);
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await rm(modulePath, { force: true });
    if (resolve(fixture).startsWith(resolve(toolsRoot) + '\\') || resolve(fixture).startsWith(resolve(toolsRoot) + '/')) {
      await rm(fixture, { recursive: true, force: true });
    } else throw new Error('Test cleanup path was outside tools.');
  }
});
