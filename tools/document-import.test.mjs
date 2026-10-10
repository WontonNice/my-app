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

test('E-H labels become A-D with matching single/multi-select keys and visual references, without changing choice order or wording', () => {
  const original = { id: 'labels-fixture', type: 'multiple_choice', choices: ['E', 'F', 'G', 'H'].map(id => ({ id, text: `Exact wording ${id}` })), correctChoiceId: 'G', visuals: [{ choiceId: 'F', description: 'Source figure' }] };
  const mapped = contract.normalizeChoiceLabels(original);
  assert.deepEqual(mapped.choices.map(c => c.id), ['A', 'B', 'C', 'D']);
  assert.deepEqual(mapped.choices.map(c => c.text), original.choices.map(c => c.text));
  assert.equal(mapped.correctChoiceId, 'C'); assert.equal(mapped.visuals[0].choiceId, 'B');
  assert.equal(mapped.choices.find(c => c.id === mapped.correctChoiceId).text, original.choices.find(c => c.id === original.correctChoiceId).text);
  assert.deepEqual(mapped.review.sourceChoiceIds, ['E', 'F', 'G', 'H']);
  assert.deepEqual(contract.normalizeChoiceLabels(mapped), mapped);
  assert.deepEqual(contract.normalizeChoiceLabels({ ...original, type: 'multi_select', correctChoiceIds: ['F', 'H'] }).correctChoiceIds, ['B', 'D']);
  const entry = contract.normalizeEntryChoices({ questions: [original], visuals: [{ questionId: original.id, choiceId: 'H', description: 'Last source choice' }] });
  assert.equal(entry.visuals[0].choiceId, 'D');
  assert.equal(original.correctChoiceId, 'G'); assert.equal(original.choices[0].id, 'E');
  assert.equal(contract.normalizeChoiceLabels({ ...original, correctChoiceId: '' }).correctChoiceId, '');
  const ambiguous = contract.normalizeChoiceLabels({ ...original, correctChoiceId: 'A' });
  assert.equal(ambiguous.correctChoiceId, '');
  assert.equal(ambiguous.review.warnings[0].code, 'SOURCE_KEY_AMBIGUOUS');
});

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
      assert.deepEqual(q.choices.map(c => c.text), original.questions[qi].choices.map(c => c.text));
      assert.deepEqual(q.choices.map(c => c.id), ["A", "B", "C", "D"]);
      for (const c of q.choices) assert.ok(pages.includes(c.text));
      if (q.correctChoiceId) assert.ok(observed['answers.pdf'][0].includes(`${q.review.sourceQuestion}. ${q.review.sourceChoiceIds?.[q.choices.findIndex(c => c.id === q.correctChoiceId)] || q.correctChoiceId}`));
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

test('visual-only choices become publishable after their source images are attached, while source selection counts remain enforced', () => {
  const entry = approve(contract.parse(fixture)[0]);
  const q = entry.content.questions[0];
  q.choices[0].text = '';
  q.visuals = [{ choiceId: 'A', sourceFile: 'questions.pdf', sourcePage: 1, description: 'Source visual choice E', state: 'unresolved' }];
  assert.ok(contract.issues(entry, taxonomy).some(i => i.code === 'IMAGE_REQUIRED'));
  Object.assign(q.visuals[0], { state: 'resolved', image: { src: '/exam-images/source-choice-e.png', alt: 'Source visual choice E' } });
  assert.equal(contract.issues(entry, taxonomy).filter(i => i.blocking).length, 0);
  const content = publicationContent(entry);
  assert.equal(content.questions[0].choices[0].image.src, '/exam-images/source-choice-e.png');
  assert.equal(content.teacherSource, undefined);
  q.type = 'multi_select'; q.correctChoiceIds = ['A', 'B']; q.requiredSelections = 3;
  assert.ok(contract.issues(entry, taxonomy).some(i => i.code === 'COUNT_MISMATCH'));
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
    const html = await readFile(join(toolsRoot, 'content-studio.html'), 'utf8');
    const apiStart = html.indexOf('    async function api(');
    const apiSource = html.slice(apiStart, html.indexOf('    function defaultQuestion(', apiStart));
    const browserSession = { token: state.editToken };
    const browserRequests = [];
    const browserApi = vm.runInNewContext(`${apiSource}\napi;`, {
      app: browserSession,
      fetch: (path, options) => { browserRequests.push(path); return fetch(base + path, options); },
    });
    const call = async (path, body, token = state.editToken) => {
      const response = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      return { status: response.status, data: await response.json() };
    };
    assert.equal((await call('/api/document-drafts', undefined, 'bad')).status, 403);
    assert.equal((await browserApi('/api/document-drafts')).entries.length, 0);
    assert.deepEqual(browserRequests.splice(0), ['/api/document-drafts']);
    browserSession.token = 'stale-after-editor-restart';
    assert.equal((await browserApi('/api/document-drafts', { method: 'GET' })).entries.length, 0);
    assert.equal(browserSession.token, state.editToken);
    assert.deepEqual(browserRequests.splice(0), ['/api/document-drafts', '/api/state', '/api/document-drafts']);
    browserSession.token = '';
    assert.equal((await browserApi('/api/document-drafts')).entries.length, 0);
    assert.equal(browserSession.token, state.editToken);
    assert.equal((await call('/api/document-drafts', { source: '{broken-json' })).status, 400);
    let imported = (await call('/api/document-drafts', { source: JSON.stringify(fixture) })).data;
    assert.equal(imported.entries.length, 3);
    assert.equal((await browserApi('/api/document-drafts')).entries.length, 3);
    assert.equal((await studio.getState()).passages.some(p => p.title === fixture.passages[0].title), false);
    const prose = imported.entries[0];
    assert.equal((await call('/api/passages', prose.content)).status, 400);
    approve(prose);
    prose.content.blurb = 'Teacher checked all four pages.';
    prose.content.byline = 'translated by Mira Vale';
    prose.content.subtitle = 'A record of twelve seeds';
    imported = (await call('/api/document-drafts', { revision: imported.revision, entry: prose })).data;
    assert.equal(imported.entries[0].content.blurb, prose.content.blurb);
    const published = await call('/api/passages', prose.content);
    assert.equal(published.status, 201, JSON.stringify(published.data));
    const reopened = (await studio.getState()).passages.find(p => p.id === prose.content.id);
    assert.equal(reopened.text, fixture.passages[0].text);
    assert.equal(reopened.author, fixture.passages[0].author);
    assert.equal(reopened.byline, prose.content.byline);
    assert.equal(reopened.subtitle, prose.content.subtitle);
    assert.equal(reopened.questions.length, 3);
    assert.deepEqual(reopened.questions.map(q => q.choices), fixture.passages[0].questions.map(q => q.choices.map((c,i) => ({...c,id:String.fromCharCode(65+i)}))));
    assert.deepEqual(reopened.questions.map(q => q.explanation), fixture.passages[0].questions.map(q => q.explanation));
    const books = JSON.parse(await readFile(join(dir, 'server/data/library-books.json'), 'utf8'));
    const student = books.find(b => b.id === prose.content.id).passageSet;
    assert.ok(student.passage.lines.some(line => line.text === fixture.passages[0].text.split('\n\n')[0]));
    assert.equal(student.questions[0].correctChoiceId, 'B');
    assert.deepEqual(student.passage.lines.filter(line => line.lineNumber).map(line => line.lineNumber), ['1', '2', '3']);
    assert.ok(student.passage.lines.some(line => line.text === 'translated by Mira Vale'));
    assert.ok(student.passage.lines.some(line => line.text === prose.content.subtitle));
    assert.doesNotMatch(JSON.stringify(student), /topicConfidence|answerSource|questions\.pdf|sourceReviewed|Original QA fixture/);
    const visualEntry = approve(imported.entries[2]);
    for (const v of [...visualEntry.content.visuals, ...visualEntry.content.questions.flatMap(q => q.visuals)]) Object.assign(v, { state: 'resolved', image: { src: '/exam-images/missing.png', alt: v.description } });
    assert.equal((await call('/api/passages', visualEntry.content)).status, 400);
    await mkdir(join(dir, 'client/public/exam-images'), { recursive: true });
    await writeFile(join(dir, 'client/public/exam-images/missing.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6AAAAAElFTkSuQmCC', 'base64'));
    const visualPublished = await call('/api/passages', visualEntry.content);
    assert.equal(visualPublished.status, 201, JSON.stringify(visualPublished.data));
    assert.equal(visualPublished.data.passage.questions[0].image.alt, visualEntry.content.questions[0].visuals[0].description);
    assert.equal(visualPublished.data.passage.image.src, '/exam-images/missing.png');
    assert.equal(visualPublished.data.passage.images.length, 0);
    await cp(join(dir, 'client/public/exam-images/missing.png'), join(dir, 'client/public/exam-images/same-table-copy.png'));
    const duplicateImage = await call('/api/passages', { ...visualPublished.data.passage, images: [{ src: '/exam-images/same-table-copy.png', alt: 'Same source table uploaded again' }] });
    assert.equal(duplicateImage.status, 201, JSON.stringify(duplicateImage.data));
    assert.equal(duplicateImage.data.passage.image.src, '/exam-images/missing.png');
    assert.equal(duplicateImage.data.passage.images.length, 0);
    // Poetry can publish without a source explanation after its answer is manually supplied.
    const poem = approve(imported.entries[1]); poem.content.questions[1].correctChoiceId = 'A';
    const poemPublished = await call('/api/passages', poem.content);
    assert.equal(poemPublished.status, 201, JSON.stringify(poemPublished.data));
    assert.equal(poemPublished.data.passage.questions[1].explanation, undefined);
    await studio.getState();
    const poemBook = JSON.parse(await readFile(join(dir, 'server/data/library-books.json'), 'utf8')).find(b => b.id === poem.content.id);
    assert.deepEqual(poemBook.passageSet.passage.lines.filter(l => !l.kind).map(l => l.text), fixture.passages[1].text.split('\n'));
    // The teacher can publish immediately and complete review in the normal editor.
    const immediatePayload = structuredClone(fixture);
    immediatePayload.passages = [immediatePayload.passages[0]];
    immediatePayload.passages[0].title = 'Publish immediately fixture';
    immediatePayload.passages[0].visuals = [{ scope: 'Passage', description: 'Original figure to attach later', state: 'unresolved' }];
    immediatePayload.passages[0].questions[0].topic = '';
    immediatePayload.passages[0].questions[0].correctChoiceId = '';
    const immediateDrafts = (await call('/api/document-drafts', { source: JSON.stringify(immediatePayload) })).data;
    const immediateEntry = immediateDrafts.entries.find(e => e.content.title === 'Publish immediately fixture');
    assert.equal((await call('/api/passages', immediateEntry.content)).status, 400);
    const immediate = await call('/api/passages', { ...immediateEntry.content, publishNow: true });
    assert.equal(immediate.status, 201, JSON.stringify(immediate.data));
    assert.equal(immediate.data.passage.questions[0].correctChoiceId, '');
    assert.equal(immediate.data.passage.questions[0].topic, '');
    assert.equal(immediate.data.passage.text, immediatePayload.passages[0].text);
    const retained = (await call('/api/document-drafts')).data.entries.find(e => e.id === immediateEntry.id);
    assert.equal(retained.status, 'published'); assert.equal(retained.content.visuals[0].state, 'unresolved');
    const changed = structuredClone(immediate.data.passage);
    changed.questions[0].prompt = 'Teacher edited after publishing.';
    const edited = await call('/api/passages', changed);
    assert.equal(edited.status, 201, JSON.stringify(edited.data));
    assert.equal(edited.data.passage.questions[0].prompt, changed.questions[0].prompt);
    assert.equal(edited.data.passage.questions[0].correctChoiceId, '');
    assert.equal(edited.data.passage.questions[0].topic, '');
    assert.equal(edited.data.passage.questions.length, immediatePayload.passages[0].questions.length);
    const numberedSettings = { ...edited.data.passage, richText: '<p>First body.</p><p data-numbered="false" onclick="alert(1)">Unnumbered note.</p><h2>E-books can reduce reading comprehension.</h2><p data-numbered="true"><strong>Bold body</strong></p><p>Last body.</p>' };
    const numberedSaved = await call('/api/passages', numberedSettings);
    assert.equal(numberedSaved.status, 201, JSON.stringify(numberedSaved.data));
    assert.match(numberedSaved.data.passage.richText, /data-numbered="false"/);
    assert.match(numberedSaved.data.passage.richText, /data-numbered="true"/);
    assert.doesNotMatch(numberedSaved.data.passage.richText, /onclick/);
    const numberingState = await studio.getState();
    const numberingReloaded = numberingState.passages.find(p => p.id === numberedSettings.id);
    assert.equal(numberingReloaded.richText, numberedSaved.data.passage.richText);
    const numberingBook = JSON.parse(await readFile(join(dir, 'server/data/library-books.json'), 'utf8')).find(b => b.id === numberedSettings.id);
    assert.deepEqual(numberingBook.passageSet.passage.lines.filter(l => l.lineNumber).map(l => [l.lineNumber, l.text]), [['1', 'First body.'], ['2', 'Bold body'], ['3', 'Last body.']]);
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
  assert.match(await readFile(join(toolsRoot, 'content-studio-documents.js'), 'utf8'), /publishNow: true/);
  assert.match(contract.prompt(taxonomy), /DO NOT solve, guess/);
  assert.match(contract.prompt(taxonomy), /NEVER generate an explanation/);
  assert.ok(contract.prompt(taxonomy).includes(JSON.stringify("\\(x^2\\)")));
  assert.equal(publicationContent(approve(contract.parse(fixture)[0])).questions[0].review, undefined);
});

test('imported Student view uses native passage title/paragraph classes and renders each image URL once', async () => {
  const html = await readFile(join(toolsRoot, 'content-studio.html'), 'utf8');
  const start = html.indexOf('    function studentPassageMarkup(');
  const end = html.indexOf('    function studentQuestionMarkup(', start);
  const render = vm.runInNewContext(`${html.slice(start, end)}\nstudentPassageMarkup;`, {
    escapeHtml: text => String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
    richBlocksFromPassage: () => null,
    location: { origin: 'http://fixture.test' },
  });
  const image = { src: '/exam-images/table.png', alt: 'Source table' };
  const markup = render({ title: 'Champion of the Channel', format: 'prose', text: 'First paragraph.\n\nSecond paragraph.', preserveSourceLayout: true, image, images: [image], visuals: [{ image }] });
  assert.match(markup, /<p class="exam-prose-line is-title"><span>Champion of the Channel<\/span><\/p>/);
  assert.doesNotMatch(markup, /<h2>/);
  assert.equal((markup.match(/<img /g) || []).length, 1);
  assert.match(markup, /<p class="exam-prose-line"><span class="exam-paragraph-number">1<\/span><span>First paragraph\.<\/span><\/p>/);
  assert.match(markup, /<span class="exam-paragraph-number">2<\/span>/);
  const richRender = vm.runInNewContext(`${html.slice(start, end)}\nstudentPassageMarkup;`, {
    escapeHtml: text => String(text || ''), location: { origin: 'http://fixture.test' },
    richBlocksFromPassage: () => [{ text: 'First body.', html: 'First body.' }, { text: 'E-books can reduce reading comprehension.', html: 'E-books can reduce reading comprehension.', kind: 'heading' }, { text: 'Unnumbered note.', html: 'Unnumbered note.', numbered: false }, { text: 'Last body.', html: 'Last body.' }],
  });
  for (const preserveSourceLayout of [true, false]) {
    const numbered = richRender({ title: 'Fixture', format: 'prose', text: 'Source', richText: 'provided', preserveSourceLayout });
    assert.equal((numbered.match(/class="exam-paragraph-number"/g) || []).length, 2);
    assert.match(numbered, /class="exam-paragraph-number">2<\/span>.*Last body\./);
    assert.match(numbered, /is-heading[^>]*><span><strong>E-books can reduce reading comprehension\.<\/strong><\/span>/);
    assert.doesNotMatch(numbered, /class="exam-paragraph-number">\d<\/span>[^<]*<span>E-books/);
  }
});

test('live passage preview reuses the full Student view passage markup and student stylesheet', async () => {
  const html = await readFile(join(toolsRoot, 'content-studio.html'), 'utf8');
  const markupStart = html.indexOf('    function studentPassageMarkup(');
  const markup = html.slice(markupStart, html.indexOf('    function studentQuestionMarkup(', markupStart));
  const previewStart = html.indexOf('    function passagePreviewDocument(');
  const previewCode = html.slice(previewStart, html.indexOf('    function richBlocksFromPassage(', previewStart));
  const passage = { title: 'Parity fixture', text: 'First paragraph.\n\nSecond paragraph.', format: 'prose', preserveSourceLayout: true };
  const frame = { style: {} }, preview = { style: {}, querySelector: () => null, replaceChildren: child => assert.equal(child, frame) };
  const api = vm.runInNewContext(`${markup}\n${previewCode}\n({renderPreview,studentPassageMarkup});`, {
    app: { passageDraft: passage, studentStyles: '/* Actual student stylesheet */ .exam-paragraph-number { color: green; }' },
    $: () => preview, document: { createElement: () => frame }, location: { origin: 'http://fixture.test' },
    richBlocksFromPassage: () => null, escapeHtml: text => String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;'),
  });
  api.renderPreview();
  assert.equal(frame.title, 'Student passage preview');
  assert.ok(frame.srcdoc.includes(api.studentPassageMarkup(passage)));
  assert.ok(frame.srcdoc.includes('/* Actual student stylesheet */'));
  assert.match(frame.srcdoc, /class="exam-paragraph-number">1<\/span>/);
  assert.match(frame.srcdoc, /class="exam-paragraph-number">2<\/span>/);
});
