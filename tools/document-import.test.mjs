import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cp, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';
import contract from './document-import.cjs';
import { documentDraftStore, publicationContent } from './document-drafts.mjs';

const toolsRoot = dirname(fileURLToPath(import.meta.url)), root = resolve(toolsRoot, '..');
const fixture = JSON.parse(await readFile(new URL('./fixtures/document-import/expected-import.json', import.meta.url), 'utf8'));
const observed = JSON.parse(await readFile(new URL('./fixtures/document-import/observed-source.json', import.meta.url), 'utf8'));
const topics = JSON.parse(await readFile(new URL('./content-topics.json', import.meta.url), 'utf8'));
const taxonomy = { reading: topics.slice(0, 8), revising_editing_a: topics.slice(8), math: ['Algebra'] };
const approve = entry => {
  entry.content.review.sourceReviewed = true;
  entry.content.review.completenessReviewed = true;
  for (const q of entry.content.questions) q.review.classificationReviewed = true;
  return entry;
};

test('authorized PDF package: full prose, poem, informational/multipage text, 7 questions and 28 choices match source characters', () => {
  const entries = contract.parse(fixture), pages = observed['questions.pdf'].join('\n');
  assert.equal(entries.length, 3);
  assert.equal(entries.flatMap(e => e.content.questions).length, 7);
  assert.equal(entries.flatMap(e => e.content.questions.flatMap(q => q.choices)).length, 28);
  for (const [i, entry] of entries.entries()) {
    const p = entry.content, original = fixture.passages[i];
    for (const key of ['title', 'author', 'text']) assert.equal(p[key], original[key]);
    for (const line of [p.title, p.author, ...p.text.split('\n')].filter(Boolean)) assert.ok(pages.includes(line), line);
    for (const [qi, q] of p.questions.entries()) {
      assert.equal(q.prompt, original.questions[qi].prompt);
      assert.ok(pages.includes(q.prompt));
      assert.deepEqual(q.choices, original.questions[qi].choices);
      for (const c of q.choices) assert.ok(pages.includes(c.text));
      if (q.correctChoiceId) assert.ok(observed['answers.pdf'][0].includes(`${q.review.sourceQuestion}. ${q.correctChoiceId}`));
      if (q.explanation) assert.ok(observed['explanations.pdf'][0].includes(q.explanation));
    }
  }
  assert.equal(entries[1].content.questions[1].correctChoiceId, '');
  assert.equal(entries[1].content.questions[1].explanation, '');
  assert.equal(entries[1].content.questions[1].review.topicConfidence, 0.45);
});

test('missing data, count mismatches, unresolved visuals, classifications, and forged review flags cannot appear ready', () => {
  const entries = contract.parse(fixture);
  assert.ok(contract.issues(entries[1], taxonomy).some(i => i.code === 'ANSWER_KEY_MISSING'));
  assert.ok(contract.issues(entries[1], taxonomy).some(i => i.code === 'EXPLANATION_MISSING' && !i.blocking));
  const image = approve(entries[2]);
  assert.equal(contract.issues(image, taxonomy).filter(i => i.code === 'IMAGE_REQUIRED').length, 2);
  image.content.visuals[0].state = 'resolved';
  assert.equal(contract.issues(image, taxonomy).filter(i => i.code === 'IMAGE_REQUIRED').length, 2);
  image.content.questions.pop();
  assert.ok(contract.issues(image, taxonomy).some(i => i.code === 'COUNT_MISMATCH'));
  const forged = structuredClone(fixture); forged.passages[0].review.sourceReviewed = true;
  assert.equal(contract.parse(forged)[0].content.review.sourceReviewed, false);
  assert.throws(() => contract.parse({ ...fixture, passage: fixture.passages[0] }), /not both/);
});

test('draft persistence, stale-write protection and fingerprint duplicates survive restarts without entering published sources', async () => {
  const dir = await mkdtemp(join(toolsRoot, '.document-draft-test-'));
  try {
    const store = documentDraftStore(dir);
    let state = await store.import(fixture);
    assert.equal(state.entries.length, 3);
    state = await store.import(fixture, state.revision);
    assert.equal(state.entries.length, 3);
    const saved = structuredClone(state.entries[0]); saved.content.title += ' [teacher edit]';
    await store.save({ revision: state.revision, entry: saved });
    await assert.rejects(store.save({ revision: state.revision, entry: saved }), /changed/);
    const reloaded = await documentDraftStore(dir).read();
    assert.equal(reloaded.entries[0].content.title, saved.content.title);
    assert.equal(reloaded.entries[0].content.text, fixture.passages[0].text);
    assert.equal(reloaded.entries[0].status, 'draft');
  } finally { assert.ok(resolve(dir).startsWith(resolve(toolsRoot))); await rm(dir, { recursive: true, force: true }); }
});

test('real Content Studio endpoints: import/edit/save/reload/publish/student formatter, metadata privacy, visual gate and Math reuse', async () => {
  const dir = await mkdtemp(join(toolsRoot, '.document-roundtrip-'));
  const modulePath = join(toolsRoot, `.document-roundtrip-${Date.now()}.mjs`);
  let server;
  try {
    for (const path of ['client/src', 'client/src/lib', 'server/data', 'tools']) await mkdir(join(dir, path), { recursive: true });
    for (const path of ['client/src/content', 'server/src/shared']) await cp(join(root, path), join(dir, path), { recursive: true });
    for (const path of ['client/src/lib/studentMaterials.ts', 'server/data/assessments.json', 'tools/content-topics.json', 'tools/practice-topics.json', 'tools/content-studio-glossary.js']) await cp(join(root, path), join(dir, path));
    await writeFile(join(dir, 'server/data/question-bank.json'), '{"revision":0,"questions":[],"sets":[]}');
    const source = (await readFile(join(toolsRoot, 'content-studio.mjs'), 'utf8')).replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");', `const workspaceRoot = ${JSON.stringify(dir)};`).split('if (process.argv.includes("--validate"))')[0] + '\nexport {handleRequest, getState, savePassage};';
    await writeFile(modulePath, source);
    const studio = await import(pathToFileURL(modulePath).href);
    server = createServer(studio.handleRequest); await new Promise(done => server.listen(0, '127.0.0.1', done));
    const base = `http://127.0.0.1:${server.address().port}`;
    const state = await studio.getState();
    const call = async (path, body, token = state.editToken) => {
      const response = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      return { status: response.status, data: await response.json() };
    };
    assert.equal((await call('/api/document-drafts', undefined, 'bad')).status, 403);
    let imported = (await call('/api/document-drafts', { source: JSON.stringify(fixture) })).data;
    assert.equal(imported.entries.length, 3);
    assert.equal((await studio.getState()).passages.some(p => p.title === fixture.passages[0].title), false);
    const prose = imported.entries[0];
    assert.equal((await call('/api/passages', prose.content)).status, 400);
    approve(prose);
    prose.content.blurb = 'Teacher checked all four pages.';
    imported = (await call('/api/document-drafts', { revision: imported.revision, entry: prose })).data;
    assert.equal(imported.entries[0].content.blurb, prose.content.blurb);
    const published = await call('/api/passages', prose.content);
    assert.equal(published.status, 201, JSON.stringify(published.data));
    const reopened = (await studio.getState()).passages.find(p => p.id === prose.content.id);
    assert.equal(reopened.text, fixture.passages[0].text);
    assert.equal(reopened.author, fixture.passages[0].author);
    assert.equal(reopened.questions.length, 3);
    assert.deepEqual(reopened.questions.map(q => q.choices), fixture.passages[0].questions.map(q => q.choices));
    assert.deepEqual(reopened.questions.map(q => q.explanation), fixture.passages[0].questions.map(q => q.explanation));
    const books = JSON.parse(await readFile(join(dir, 'server/data/library-books.json'), 'utf8'));
    const student = books.find(b => b.id === prose.content.id).passageSet;
    assert.ok(student.passage.lines.some(line => line.text === fixture.passages[0].text.split('\n\n')[0]));
    assert.equal(student.questions[0].correctChoiceId, 'F');
    assert.ok(student.passage.lines.every(line => !line.lineNumber));
    assert.doesNotMatch(JSON.stringify(student), /topicConfidence|answerSource|questions\.pdf|sourceReviewed/);
    const visualEntry = approve(imported.entries[2]);
    for (const v of [...visualEntry.content.visuals, ...visualEntry.content.questions.flatMap(q => q.visuals)]) Object.assign(v, { state: 'resolved', image: { src: '/exam-images/missing.png', alt: v.description } });
    assert.equal((await call('/api/passages', visualEntry.content)).status, 400);
    await mkdir(join(dir, 'client/public/exam-images'), { recursive: true });
    await writeFile(join(dir, 'client/public/exam-images/missing.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6AAAAAElFTkSuQmCC', 'base64'));
    const visualPublished = await call('/api/passages', visualEntry.content);
    assert.equal(visualPublished.status, 201, JSON.stringify(visualPublished.data));
    assert.equal(visualPublished.data.passage.questions[0].image.alt, visualEntry.content.questions[0].visuals[0].description);
    assert.equal(visualPublished.data.passage.images.length, 1);
    // Poetry can publish without a source explanation after its answer is manually supplied.
    const poem = approve(imported.entries[1]); poem.content.questions[1].correctChoiceId = 'E';
    const poemPublished = await call('/api/passages', poem.content);
    assert.equal(poemPublished.status, 201, JSON.stringify(poemPublished.data));
    assert.equal(poemPublished.data.passage.questions[1].explanation, undefined);
    await studio.getState();
    const poemBook = JSON.parse(await readFile(join(dir, 'server/data/library-books.json'), 'utf8')).find(b => b.id === poem.content.id);
    assert.deepEqual(poemBook.passageSet.passage.lines.filter(l => !l.kind).map(l => l.text), fixture.passages[1].text.split('\n'));
    const mathPayload = { format: contract.format, mathQuestions: [{ id: 'fixture-math-1', type: 'numeric_entry', topic: 'Algebra', prompt: 'What number appears in the supplied table?', correctTextAnswers: [], explanation: '', entryLayout: 'plain' }] };
    let maths = (await call('/api/document-drafts', { source: JSON.stringify(mathPayload) })).data;
    const math = approve(maths.entries.find(e => e.kind === 'math'));
    assert.ok(contract.issues(math, taxonomy).some(i => i.code === 'ANSWER_KEY_MISSING'));
    math.content.questions[0].correctTextAnswers = ['12']; math.content.questions[0].explanation = 'Source guide: the table lists 12.';
    maths = (await call('/api/document-drafts', { revision: maths.revision, entry: math })).data;
    const result = await call('/api/document-publish-math', { entryId: math.id, assessmentId: state.assessments[0].id, revision: maths.revision });
    assert.equal(result.status, 201, JSON.stringify(result.data));
    assert.ok((await studio.getState()).mathSections.some(m => m.questions.some(q => q.explanation === math.content.questions[0].explanation)));
  } finally {
    if (server) await new Promise(done => server.close(done));
    await rm(modulePath, { force: true });
    assert.ok(resolve(dir).startsWith(resolve(toolsRoot))); await rm(dir, { recursive: true, force: true });
  }
});

test('Content Studio inline scripts and review UI parse; the reusable prompt comes from the same contract', async () => {
  const html = await readFile(join(toolsRoot, 'content-studio.html'), 'utf8');
  const main = html.slice(html.indexOf('  <script>') + '  <script>'.length, html.lastIndexOf('  </script>', html.indexOf('  <script type="module">', html.lastIndexOf('function reloadState'))));
  // Compile the actual classic app script, allowing embedded preview HTML script tags.
  const start = html.indexOf('  <script>') + '  <script>'.length;
  const end = html.lastIndexOf('  </script>', html.lastIndexOf('  <script type="module">'));
  assert.ok(main.length > 1000); new vm.Script(html.slice(start, end));
  new vm.Script(await readFile(join(toolsRoot, 'content-studio-documents.js'), 'utf8'));
  assert.match(contract.prompt(taxonomy), /DO NOT solve, guess/);
  assert.match(contract.prompt(taxonomy), /NEVER generate an explanation/);
  assert.equal(publicationContent(approve(contract.parse(fixture)[0])).questions[0].review, undefined);
});
