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
      .split('if (process.argv.includes("--validate"))')[0] + '\nexport { handleRequest, getState, savePassage, saveTest };\n';
    await writeFile(modulePath, source);
    const studio = await import(pathToFileURL(modulePath).href);
    server = createServer(studio.handleRequest);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/api/exams`;
    const state = await studio.getState();
    const send = (body, token = state.editToken, origin = '') => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-editor-token': token, ...(origin ? { origin } : {}) },
      body: JSON.stringify(body),
    });
    assert.equal((await send({ title: 'New example' }, 'invalid')).status, 403);
    assert.equal((await send({ title: 'New example' }, state.editToken, 'https://untrusted.example')).status, 403);
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
    const originalPassage = refreshed.passages.find(passage => passage.title === 'A Miracle Mile') || refreshed.passages[0];
    await assert.rejects(
      studio.savePassage({ ...originalPassage, passageType: '', section: 'reading' }),
      /Library passage type/,
    );
    await assert.rejects(
      studio.savePassage({ ...originalPassage, section: '' }),
      /Exam section/,
    );
    const versionLabel = `Automated Test ${Date.now()}`;
    const version = await studio.savePassage({
      ...originalPassage,
      directions: undefined,
      exportName: '',
      fileName: '',
      id: '',
      passageSetId: '',
      questions: originalPassage.questions.map((question, index) => ({ ...question, id: `passage-${index + 1}` })),
      section: 'revising_editing_a',
      sourceHash: '',
      teacherSource: 'Teacher archive, practice set 4, page 18',
      versionLabel,
    });
    assert.match(version.id, /^a-miracle-mile-automated-test-\d+$/);
    assert.equal(version.versionLabel, versionLabel);
    assert.equal(version.teacherSource, 'Teacher archive, practice set 4, page 18');
    assert.equal(version.section, 'revising_editing_a');
    assert.equal(version.directions.title, 'REVISING/EDITING PART A');
    assert.ok(version.questions.every(question => question.id.startsWith(`${version.id}-`)));
    const versionSource = await readFile(
      join(fixture, 'client/src/content/exams/passageSets', version.fileName),
      'utf8',
    );
    assert.match(versionSource, /teacherSource: "Teacher archive, practice set 4, page 18"/);
    assert.match(versionSource, /section: "revising_editing_a"/);
    assert.match(versionSource, /versionLabel: "Automated Test \d+"/);

    await studio.saveTest({ assessmentId: payload.assessment.id, readingPassageIds: [originalPassage.id], sourceHash: exam.sourceHash });
    let saved = await studio.getState();
    assert.equal(saved.assessments.find(item => item.id === payload.assessment.id).questions.length, originalPassage.questions.length);
    assert.deepEqual(saved.tests.find(item => item.assessmentId === payload.assessment.id).readingPassageIds, [originalPassage.id]);
    await assert.rejects(
      studio.saveTest({
        assessmentId: payload.assessment.id,
        readingPassageIds: [originalPassage.id, version.id],
        sourceHash: saved.tests.find(item => item.assessmentId === payload.assessment.id).sourceHash,
      }),
      /Choose only one version/,
    );
    await studio.saveTest({
      assessmentId: payload.assessment.id,
      readingPassageIds: [version.id],
      sourceHash: saved.tests.find(item => item.assessmentId === payload.assessment.id).sourceHash,
    });
    saved = await studio.getState();
    assert.deepEqual(saved.tests.find(item => item.assessmentId === payload.assessment.id).readingPassageIds, [version.id]);
    assert.equal(saved.assessments.find(item => item.id === payload.assessment.id).passages[0].versionLabel, versionLabel);
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await rm(modulePath, { force: true });
    if (resolve(fixture).startsWith(resolve(toolsRoot) + '\\') || resolve(fixture).startsWith(resolve(toolsRoot) + '/')) {
      await rm(fixture, { recursive: true, force: true });
    } else throw new Error('Test cleanup path was outside tools.');
  }
});
