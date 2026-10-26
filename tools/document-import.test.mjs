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
test('Exam Builder passage shortcuts retain the exam draft and honor passage-edit cancellation', async () => {
  const html = await readFile(join(toolsRoot, 'content-studio.html'), 'utf8');
  const start = html.indexOf('    function openTestPassageEditor(');
  const source = html.slice(start, html.indexOf('    function testPassageSectionMarkup(', start));
  const draft = { readingPassageIds: ['unsaved-passage'] };
  const app = { saving: false, passageMode: 'exam', selectedPassageId: 'old', testDraft: draft, testDirty: true };
  const tabs = [];
  let allowSelection = true, allowModeChange = true;
  const open = vm.runInNewContext(`${source}\nopenTestPassageEditor`, {
    app, passageById: id => id === 'target',
    selectPassage: id => { if (allowSelection) app.selectedPassageId = id; },
    switchTab: tab => { if (allowModeChange) { tabs.push(tab); app.passageMode = 'exam'; } },
  });
  open('target');
  assert.equal(app.selectedPassageId, 'target');
  assert.deepEqual(tabs, ['passages']);
  assert.equal(app.testDraft, draft);
  assert.equal(app.testDirty, true);
  tabs.length = 0; app.selectedPassageId = 'old'; allowSelection = false;
  open('target'); assert.deepEqual(tabs, []);
  app.passageMode = 'advanced'; allowModeChange = false;
  open('target'); assert.equal(app.passageMode, 'advanced'); assert.equal(app.selectedPassageId, 'old');
  allowModeChange = true; allowSelection = true;
  open('target'); assert.equal(app.selectedPassageId, 'target'); assert.equal(app.testDraft, draft);
  tabs.length = 0; open('missing'); assert.deepEqual(tabs, []);
  app.saving = true; open('target'); assert.deepEqual(tabs, []);
});
const sectionDirections = 'DIRECTIONS: Read each of the following two texts and answer the related questions. You will be asked to improve the writing quality of each text and to correct errors so that the texts follow the conventions of standard written English. You should reread relevant parts of each text, while being mindful of time, before marking the best answer for each question.';

test('section directions are removed on import and reload while local instructions, prompts and answers stay intact', async () => {
  const original = { ...fixture.passages[0].questions[0], instructions: sectionDirections, instructionsHtml: `<p>${sectionDirections.replace('DIRECTIONS:', '<strong>DIRECTIONS:</strong>')}</p>` };
  const cleaned = contract.withoutSectionDirections(original);
  assert.equal(cleaned.instructions, ''); assert.equal(cleaned.instructionsHtml, '');
  assert.equal(cleaned.prompt, original.prompt); assert.deepEqual(cleaned.choices, original.choices);
  assert.equal(cleaned.correctChoiceId, original.correctChoiceId);
  assert.equal(original.instructions, sectionDirections);
  const mixed = contract.withoutSectionDirections({ instructions: sectionDirections + '\n\nSelect two answers.', instructionsHtml: `<div>${original.instructionsHtml}<p>Select <em>two</em> answers.</p></div>` });
  assert.equal(mixed.instructions, 'Select two answers.');
  assert.equal(mixed.instructionsHtml, '<div><p>Select <em>two</em> answers.</p></div>');
  const local = { ...original, instructions: 'DIRECTIONS: Drag the best sentence to the box.', instructionsHtml: '<p>Use the <u>underlined</u> sentence.</p>' };
  assert.deepEqual(contract.withoutSectionDirections(local), local);
  const [entry] = contract.parse({ format: contract.format, passage: { ...fixture.passages[0], questions: [original] } });
  assert.equal(entry.content.questions[0].instructionsHtml, '');
  assert.equal(contract.normalizeEntryChoices({ questions: [original] }).questions[0].instructions, '');
  assert.match(contract.prompt(taxonomy), /Exclude general exam\/section DIRECTIONS/);
});

test('all math response types retain their interactions and verified keys through prompt import, including short-answer aliases', () => {
  const questions = [
    { type:'multiple_choice', choices:[{id:'A',text:'1'},{id:'B',text:'2'}], correctChoiceId:'B' },
    { type:'multi_select', choices:[{id:'A',text:'1'},{id:'B',text:'2'}], correctChoiceIds:['A','B'], requiredSelections:2 },
    ...['numeric_entry','short_response','short_answer','short answer','short-answer','grid_in'].map(type => ({type,correctTextAnswers:['-4']})),
    { type:'inline_dropdown', dropdownContent:['{{a}} + {{b}}'], dropdowns:['a','b'].map(id=>({id,options:[{id:'one',text:'1'},{id:'two',text:'2'}],correctChoiceId:'two'})) },
    ...['compact', 'outlined'].map(dragDropStyle => ({ type:'math_drag_drop', dragDropStyle, items:[{id:'one',text:'1'},{id:'two',text:'2'}], dragDropContent:['x = {{a}}'], dragDropSlots:[{id:'a',correctItemId:'two'}], allowReuse:false })),
    { type:'graph_point_select', graph:{xMin:0,xMax:4,xStep:1,yMin:0,yMax:4,yStep:1,xLabel:'x',yLabel:'y',points:[{id:'a',x:1,y:1},{id:'b',x:2,y:2}]},correctPointIds:['a'] },
    { type:'number_line_response', numberLineResponse:{min:-2,max:4,tickStep:1,labelStep:1,correctValue:1,correctEndpoint:'closed',correctDirection:'right'} },
  ].map((question,index) => ({id:`math-type-${index}`,prompt:'Source question',topic:'Algebra',subtopic:'Equations',explanation:'Source explanation',...question}));
  const [entry] = contract.parse({format:contract.format,mathQuestions:questions});
  entry.content.review={sourceReviewed:true,completenessReviewed:true};
  entry.content.questions.forEach(question=>{question.review.classificationReviewed=true;});
  assert.deepEqual(contract.issues(entry,{...taxonomy,mathSpecificTopics:{Algebra:['Equations']}}),[]);
  const published=publicationContent(entry);
  for (const [index,question] of questions.entries()) {
    for (const key of Object.keys(question)) assert.deepEqual(published.questions[index][key], key==='type' ? contract.normalizeResponseType(question[key]) : question[key], `${question.type}: ${key}`);
  }
  entry.content.questions.find(question=>question.type==='inline_dropdown').dropdowns[0].correctChoiceId='';
  assert.ok(contract.issues(entry,taxonomy).some(issue=>issue.code==='ANSWER_KEY_MISSING'));
});
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

test('draft deletion is versioned, survives reload, allows reimport and protects published passages', async () => {
  const dir = await mkdtemp(join(toolsRoot, '.document-draft-delete-test-'));
  try {
    const store = documentDraftStore(dir);
    let state = await store.import(fixture);
    const target = structuredClone(state.entries[0]), survivor = structuredClone(state.entries[1]);
    await assert.rejects(store.delete({ id: target.id }), /Reopen/);
    await assert.rejects(store.delete({ id: target.id, revision: state.revision - 1 }), /changed/);
    state = await store.delete({ id: target.id, revision: state.revision });
    assert.equal(state.entries.length, 2); assert.deepEqual(state.entries[0], survivor);
    assert.equal((await documentDraftStore(dir).read()).entries.some(entry => entry.id === target.id), false);
    await assert.rejects(store.delete({ id: target.id, revision: state.revision }), /not found/);
    state = await store.import({ format: contract.format, passage: fixture.passages[0] }, state.revision);
    const replacement = state.entries.find(entry => entry.content.title === target.content.title);
    assert.ok(replacement); assert.notEqual(replacement.id, target.id);
    await assert.rejects(store.save({ entry: target, revision: state.revision }), /not found/);
    await store.published(replacement.id, replacement.content);
    state = await store.read();
    await assert.rejects(store.delete({ id: replacement.id, revision: state.revision }), /unpublished/);
    // Simulate an old saved draft: opening it cleans only section boilerplate.
    state.entries[0].content.questions[0].instructions = sectionDirections;
    state.entries[0].content.questions[0].instructionsHtml = `<p>${sectionDirections}</p>`;
    await writeFile(join(dir, 'tools/.content-drafts/document-imports.json'), JSON.stringify(state));
    const reopened = await documentDraftStore(dir).read();
    assert.equal(reopened.entries[0].content.questions[0].instructionsHtml, '');
    assert.equal(reopened.entries[0].content.questions[0].prompt, state.entries[0].content.questions[0].prompt);
  } finally { assert.equal(dirname(resolve(dir)), resolve(toolsRoot)); await rm(dir, { recursive: true, force: true }); }
});

test('real Content Studio endpoints: import/edit/save/reload/publish/student formatter, metadata privacy, visual gate and Math reuse', async () => {
  const fixtureRoot = join(toolsRoot, '.content-drafts');
  await mkdir(fixtureRoot, { recursive: true });
  const dir = await mkdtemp(join(fixtureRoot, 'document-roundtrip-'));
  const modulePath = join(toolsRoot, `.document-roundtrip-${Date.now()}.mjs`);
  let server;
  try {
    for (const path of ['client/src', 'client/src/lib', 'server/data', 'tools']) await mkdir(join(dir, path), { recursive: true });
    for (const path of ['client/src/content', 'server/src/shared']) await cp(join(root, path), join(dir, path), { recursive: true });
    for (const path of ['client/src/lib/studentMaterials.ts', 'server/data/assessments.json', 'tools/content-topics.json', 'tools/math-topics.json', 'tools/practice-topics.json', 'tools/content-studio-glossary.js','tools/poem-layout.js']) await cp(join(root, path), join(dir, path));
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
    const vocabularyFixture = structuredClone(fixture);
    vocabularyFixture.passages[1].richText = '<div>The gate stood still,<br>&nbsp;&nbsp;the rain came through;</div><div>I kept one seed,<br>and planted two.</div>';
    vocabularyFixture.passages[0].questions[1].promptParts = { introduction: 'Read this sentence from paragraph 1.', excerpt: 'A *source* sentence.', followUp: 'What does it suggest?', bold: true };
    const quotedPrompt = '<p>Read these lines.</p><blockquote><strong>First source line<br>Second source line</strong><br><br><em>Final stanza</em></blockquote><p>What do they convey?</p>';
    vocabularyFixture.passages[0].questions[0].prompt = 'Read these lines.\n\nFirst source line\nSecond source line\n\nFinal stanza\n\nWhat do they convey?';
    vocabularyFixture.passages[0].questions[0].promptHtml = quotedPrompt;
    const glossaryDefinition = 'a record of &quot;items&quot; &amp; totals';
    vocabularyFixture.passages[0].richText = fixture.passages[0].text.split('\n\n')
      .map(paragraph => `<p>${paragraph.replace('ledger', `<span data-glossary-definition="${glossaryDefinition}" role="link" tabindex="0">ledger</span>`)}</p>`).join('');
    let imported = (await call('/api/document-drafts', { source: JSON.stringify(vocabularyFixture) })).data;
    assert.equal(imported.entries.length, 3);
    assert.equal(imported.entries[0].content.richText, vocabularyFixture.passages[0].richText);
    assert.equal(imported.entries[0].content.questions[0].promptHtml, quotedPrompt);
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
    assert.equal(reopened.richText, vocabularyFixture.passages[0].richText);
    assert.equal(reopened.author, fixture.passages[0].author);
    assert.equal(reopened.byline, prose.content.byline);
    assert.equal(reopened.subtitle, prose.content.subtitle);
    assert.equal(reopened.questions.length, 3);
    assert.equal(reopened.questions[0].promptHtml, quotedPrompt);
    assert.equal(reopened.questions[0].prompt, vocabularyFixture.passages[0].questions[0].prompt);
    assert.equal(reopened.questions[1].promptParts, undefined);
    assert.match(reopened.questions[1].promptHtml, /<blockquote><strong>A <em>source<\/em> sentence\.<\/strong><\/blockquote><p>What does it suggest\?<\/p>/);
    const resavedQuote = await call('/api/passages', reopened);
    assert.equal(resavedQuote.status, 201);
    assert.equal(resavedQuote.data.passage.questions[0].promptHtml, quotedPrompt);
    assert.deepEqual(reopened.questions.map(q => q.choices), fixture.passages[0].questions.map(q => q.choices.map((c,i) => ({...c,id:String.fromCharCode(65+i)}))));
    assert.deepEqual(reopened.questions.map(q => q.explanation), fixture.passages[0].questions.map(q => q.explanation));
    const books = JSON.parse(await readFile(join(dir, 'server/data/library-books.json'), 'utf8'));
    const student = books.find(b => b.id === prose.content.id).passageSet;
    assert.ok(student.passage.lines.some(line => line.text === fixture.passages[0].text.split('\n\n')[0]));
    assert.equal(student.questions[0].correctChoiceId, 'B');
    assert.equal(student.questions[0].promptHtml, quotedPrompt);
    // Publish directly into an existing exam; preserve its other English sections and Math source.
    const destinationTest = state.tests.find(t=>t.mathSectionFileName && t.readingPassageIds.length && t.revisingEditingPartAPassageIds.length && t.standaloneItemIds.length) || state.tests.find(t=>t.mathSectionFileName);
    assert.ok(destinationTest, 'Fixture includes an existing exam with Math content');
    const mathSourcePath = join(dir,'client/src/content/exams/mathSets',destinationTest.mathSectionFileName);
    const originalMathSource = await readFile(mathSourcePath,'utf8');
    const directPublish = await call('/api/passages',{...resavedQuote.data.passage,publishToExamId:destinationTest.assessmentId});
    assert.equal(directPublish.status,201,JSON.stringify(directPublish.data));
    assert.equal(directPublish.data.examAssignment.error,undefined);
    assert.equal(directPublish.data.examAssignment.added,true);
    const afterDirectPublish = (await studio.getState()).tests.find(t=>t.assessmentId===destinationTest.assessmentId);
    assert.deepEqual(afterDirectPublish.readingPassageIds,[...destinationTest.readingPassageIds,prose.content.id]);
    assert.deepEqual(afterDirectPublish.revisingEditingPartAPassageIds,destinationTest.revisingEditingPartAPassageIds);
    assert.deepEqual(afterDirectPublish.standaloneItemIds,destinationTest.standaloneItemIds);
    assert.equal(await readFile(mathSourcePath,'utf8'),originalMathSource);
    const directRetry = await call('/api/passages',{...directPublish.data.passage,publishToExamId:destinationTest.assessmentId});
    assert.equal(directRetry.data.examAssignment.added,false);
    assert.equal((await studio.getState()).tests.find(t=>t.assessmentId===destinationTest.assessmentId).sourceHash,afterDirectPublish.sourceHash);
    const invalidTarget = await call('/api/passages',{...directRetry.data.passage,publishToExamId:'missing-exam'});
    assert.equal(invalidTarget.status,404);
    const partAOriginal = state.passages.find(p=>p.section==='revising_editing_a');
    assert.ok(partAOriginal);
    const partACopy={...partAOriginal,id:'publish-part-a-fixture',title:'Publish Part A fixture',fileName:'publish-part-a-fixture.ts',exportName:'publishPartAFixture',passageSetId:'ela-publish-part-a-fixture',sourceHash:'',questions:partAOriginal.questions.map(q=>({...q,id:`publish-part-a-${q.id}`})),publishToExamId:destinationTest.assessmentId};
    const partAPublished=await call('/api/passages',partACopy);
    assert.equal(partAPublished.status,201,JSON.stringify(partAPublished.data));
    assert.equal(partAPublished.data.examAssignment.error,undefined);
    const afterPartA=(await studio.getState()).tests.find(t=>t.assessmentId===destinationTest.assessmentId);
    assert.deepEqual(afterPartA.readingPassageIds,afterDirectPublish.readingPassageIds);
    assert.deepEqual(afterPartA.revisingEditingPartAPassageIds,[...destinationTest.revisingEditingPartAPassageIds,partACopy.id]);
    assert.equal(await readFile(mathSourcePath,'utf8'),originalMathSource);
    const conflict={...directRetry.data.passage,id:'publish-conflict-fixture',title:'Publish conflict fixture',fileName:'publish-conflict-fixture.ts',exportName:'publishConflictFixture',passageSetId:'ela-publish-conflict-fixture',sourceHash:'',publishToExamId:destinationTest.assessmentId};
    const conflictResult=await call('/api/passages',conflict);
    assert.equal(conflictResult.status,201);
    assert.match(conflictResult.data.examAssignment.error,/share the ID/);
    assert.ok(conflictResult.data.passage.sourceHash);
    assert.equal((await studio.getState()).tests.find(t=>t.assessmentId===destinationTest.assessmentId).sourceHash,afterPartA.sourceHash);
    const fixedRetry=await call('/api/passages',{...conflictResult.data.passage,questions:conflictResult.data.passage.questions.map(q=>({...q,id:`retry-${q.id}`})),publishToExamId:destinationTest.assessmentId});
    assert.equal(fixedRetry.data.examAssignment.error,undefined);
    // The evidence matrix uses the same publication, source writer and student library pipeline.
    const evidenceQuestion = JSON.parse(await readFile(new URL('./fixtures/evidence-matrix-question.json', import.meta.url), 'utf8'));
    evidenceQuestion.correctPlacements = {'row-1':'table','row-2':'passage','row-3':'both','row-4':'passage'}; // Synthetic test key.
    const [evidenceEntry] = contract.parse({format:contract.format,passage:{...fixture.passages[0],id:'evidence-matrix-fixture',title:'Evidence matrix fixture',questions:[evidenceQuestion]}});
    approve(evidenceEntry);
    const evidenceSaved = await call('/api/passages', evidenceEntry.content);
    assert.equal(evidenceSaved.status,201,JSON.stringify(evidenceSaved.data));
    assert.equal(evidenceSaved.data.passage.questions[0].matrixStyle,'evidence');
    const evidenceReloaded = (await studio.getState()).passages.find(p=>p.id===evidenceSaved.data.passage.id);
    assert.equal(evidenceReloaded.questions[0].type,'matrix_choice');
    assert.equal(evidenceReloaded.questions[0].matrixStyle,'evidence');
    assert.deepEqual(evidenceReloaded.questions[0].correctPlacements,evidenceQuestion.correctPlacements);
    const evidenceBook = JSON.parse(await readFile(join(dir,'server/data/library-books.json'),'utf8')).find(b=>b.id===evidenceSaved.data.passage.id);
    assert.equal(evidenceBook.passageSet.questions[0].matrixStyle,'evidence');
    assert.ok(student.passage.lines.some(line => line.html?.includes(`data-glossary-definition="${glossaryDefinition}" role="link" tabindex="0">ledger</span>`)));
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
    // SAT Reader recoverable question errors survive the real preview/draft
    // endpoints, manual editing, and publication without leaking source metadata.
    {
    const satUi = vm.runInNewContext((await readFile(join(toolsRoot, 'content-studio-workspace.js'), 'utf8')) + '\nstudioUI;', { URL });
    const satSource = satUi.convertSatCrashCourseImport(JSON.stringify({ source: { url: 'https://tutor.thesatcrashcourse.com/tests/fixture' }, testPreview: {
      testTitle: 'SAT manual repair fixture', capture: { mode: 'passage-all', warnings: [] },
      questions: [8, 9, 10].map(number => ({ number, passage: { id: 'sat-repair', title: 'SAT repair passage', text: 'The complete source passage remains here.', formattedBlocks: [{ text: 'The complete source passage remains here.', html: 'The <strong>complete</strong> source passage remains here.' }] }, prompt: `Captured source question ${number}`, promptHtml: `Captured <em>source</em> question ${number}`, choices: number === 9 ? [] : ['A', 'B', 'C', 'D'].map(label => ({ label, text: `Original ${label}`, html: `<strong>Original</strong> ${label}`, isCorrect: label === 'B' })), correctAnswer: number === 9 ? null : { label: 'B' } })),
    }}));
    const satPreview = await call('/api/passages/import-preview', { source: JSON.stringify(satSource) });
    assert.equal(satPreview.status, 200, JSON.stringify(satPreview.data));
    assert.equal(satPreview.data.passage.questions.length, 3);
    assert.ok(satPreview.data.warnings.some(warning => /Question 9.*manual editing/.test(warning)));
    const satDrafts = (await call('/api/document-drafts', { source: JSON.stringify(satSource) })).data;
    const satEntry = satDrafts.entries.find(entry => entry.content.title === 'SAT repair passage');
    assert.equal(satEntry.content.questions[1].prompt, 'Captured source question 9');
    assert.deepEqual(satEntry.content.questions[1].choices.map(choice => choice.text), ['', '', '', '']);
    assert.equal(satEntry.content.questions[1].correctChoiceId, '');
    assert.equal(satEntry.content.questions[2].correctChoiceId, 'B');
    satEntry.content.questions[1].choices.forEach((choice, index) => { choice.text = `Manually completed ${index + 1}`; });
    satEntry.content.questions[1].correctChoiceId = 'C';
    const satEdited = await call('/api/document-drafts', { revision: satDrafts.revision, entry: satEntry });
    assert.equal(satEdited.status, 200, JSON.stringify(satEdited.data));
    const satReloaded = (await call('/api/document-drafts')).data.entries.find(entry => entry.id === satEntry.id);
    assert.equal(satReloaded.content.questions[1].choices[2].text, 'Manually completed 3');
    assert.equal(satReloaded.content.questions[1].review.sourceQuestionData.choices.length, 0);
    const satPublished = await call('/api/passages', { ...satReloaded.content, publishNow: true });
    assert.equal(satPublished.status, 201, JSON.stringify(satPublished.data));
    assert.equal(satPublished.data.passage.questions[1].correctChoiceId, 'C');
    assert.equal(satPublished.data.passage.passageCategory, 'prestige');
    assert.match(satPublished.data.passage.richText, /<strong>complete<\/strong>/);
    assert.match(satPublished.data.passage.questions[0].promptHtml, /<em>source<\/em>/);
    assert.match(satPublished.data.passage.questions[0].choices[0].html, /<strong>Original<\/strong>/);
    assert.doesNotMatch(JSON.stringify(satPublished.data.passage), /sourceQuestionData|sourceChoiceIds|tutor\.thesatcrashcourse/);
    }
    {
      const { default: editorSync } = await import('../extensions/shsatlab-ela-reader/editor-sync.js');
      const captured = { subject: 'English', source: 'SHSAT Lab', sourceUnit: 1, sourceTopic: 'Central Idea & Theme', sourceUrl: 'https://www.shsatlab.com/units/unit-1/practice', difficulty: 'medium', prompt: 'AFK import fixture question', choices: ['A', 'B', 'C', 'D'].map(id => ({ id, text: `Source ${id}` })), correctChoiceId: 'B', explanation: 'The source explains B.', passage: { title: 'Source heading', text: 'Complete source passage.', format: 'prose' }, reviewNotes: [], visuals: [] };
      const memory = { elaSyncEnabled: true, elaQueue: [captured] };
      const engine = editorSync.create({ storage: { get: async () => structuredClone(memory), set: async value => Object.assign(memory, structuredClone(value)) }, fetch: (path, options) => fetch(base + path, options), origin: 'http://127.0.0.1:4319', fingerprint: async question => JSON.stringify(question) });
      await engine.sync();
      assert.equal(memory.elaEditorSync.status, 'synced', memory.elaEditorSync.message);
      const importedBank = (await call('/api/question-bank')).data;
      assert.equal(importedBank.questions[0].prompt, captured.prompt);
      assert.equal(importedBank.questions[0].status, 'draft'); assert.equal(importedBank.questions[0].explanation, captured.explanation);
      const revision = importedBank.revision; await engine.sync(); assert.equal((await call('/api/question-bank')).data.revision, revision);
    }
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
    const mathCategory=state.mathTopicConfiguration.categories[0];
    const mathPayload = { format: contract.format, mathQuestions: [{ id: 'fixture-math-1', type: 'numeric_entry', topic: mathCategory.label, subtopic: mathCategory.topics[0].label, prompt: 'What number appears in the supplied table?', correctTextAnswers: [], explanation: '', entryLayout: 'plain' }] };
    let maths = (await call('/api/document-drafts', { source: JSON.stringify(mathPayload) })).data;
    const math = approve(maths.entries.find(e => e.kind === 'math'));
    assert.ok(contract.issues(math, taxonomy).some(i => i.code === 'ANSWER_KEY_MISSING'));
    math.content.questions[0].correctTextAnswers = ['12']; math.content.questions[0].explanation = 'Source guide: the table lists 12.';
    maths = (await call('/api/document-drafts', { revision: maths.revision, entry: math })).data;
    const result = await call('/api/document-publish-math', { entryId: math.id, assessmentId: state.assessments[0].id, revision: maths.revision });
    assert.equal(result.status, 201, JSON.stringify(result.data));
    assert.ok((await studio.getState()).mathSections.some(m => m.questions.some(q => q.explanation === math.content.questions[0].explanation)));
    // SAT imports use the same extraction contract, retain every passage/question,
    // and remain in their destination after draft reload and publication.
    const satPayload = structuredClone(fixture);
    satPayload.passages = satPayload.passages.slice(0, 2);
    satPayload.passages[0].title = 'SAT import roundtrip';
    satPayload.passages[0].byline = 'translated by Mira Vale';
    satPayload.passages[0].subtitle = 'Original subtitle';
    satPayload.passages[0].images = [{ src: '/exam-images/missing.png', alt: 'Original supporting table' }];
    satPayload.passages[1].title = 'SAT poetry roundtrip';
    const satDrafts = (await call('/api/document-drafts', { source: JSON.stringify(satPayload), destination: 'advanced' })).data;
    const satEntries = satDrafts.entries.filter(entry => entry.destination === 'advanced');
    assert.equal(satEntries.length, 2);
    assert.equal((await call('/api/document-drafts', { source: JSON.stringify(satPayload), destination: 'advanced' })).data.entries.length, satDrafts.entries.length);
    assert.equal((await call('/api/passages', { ...satEntries[0].content, publishNow: true })).status, 400);
    const satSaved = [];
    for (const entry of satEntries) {
      const response = await call('/api/advanced-passages', { ...entry.content, publishNow: true });
      assert.equal(response.status, 201, JSON.stringify(response.data));
      const saved = response.data.passage;
      assert.equal(saved.text, entry.content.text);
      assert.equal(saved.questions.length, entry.content.questions.length);
      assert.equal(saved.format, entry.content.format);
      assert.equal(saved.richText, entry.content.richText);
      assert.equal(saved.preserveSourceLayout, true);
      satSaved.push(saved);
    }
    assert.equal(satSaved[0].byline, 'translated by Mira Vale');
    assert.equal(satSaved[0].subtitle, 'Original subtitle');
    assert.equal(satSaved[0].images.length, 1);
    const savedDrafts = (await call('/api/document-drafts')).data;
    assert.ok(savedDrafts.entries.filter(e => e.destination === 'advanced').every(e => e.status === 'published'));
    const satState = await studio.getState();
    assert.ok(satSaved.every(saved => satState.advancedPassages.some(p => p.id === saved.id)));
    assert.ok(satSaved.every(saved => !satState.passages.some(p => p.id === saved.id)));
    const satSource = await readFile(join(dir, 'client/src/content/advancedPractice/passageSets', satSaved[0].fileName), 'utf8');
    assert.doesNotMatch(satSource, /topicConfidence|sourceReviewed|questions\.pdf/);
    const removeSat = (body, token = state.editToken) => fetch(base + '/api/advanced-passages', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, body: JSON.stringify(body) });
    assert.equal((await removeSat(satSaved[0], 'invalid')).status, 403);
    assert.equal((await removeSat({ id: satSaved[0].id, sourceHash: 'stale' })).status, 409);
    assert.equal(await readFile(join(dir, 'client/src/content/advancedPractice/passageSets', satSaved[0].fileName), 'utf8'), satSource);
    assert.equal((await removeSat(satSaved[0])).status, 200);
    assert.equal((await removeSat(satSaved[0])).status, 404);
    assert.ok(!(await studio.getState()).advancedPassages.some(p => p.id === satSaved[0].id));
    assert.doesNotMatch(await readFile(join(dir, 'client/src/content/advancedPractice/index.ts'), 'utf8'), new RegExp(`\\b${satSaved[0].exportName}\\b`));
    await assert.rejects(readFile(join(dir, 'client/src/content/advancedPractice/passageSets', satSaved[0].fileName)), error => error.code === 'ENOENT');
    const deleteDraft = (body, token = state.editToken) => fetch(base + '/api/document-drafts', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, body: JSON.stringify(body) });
    let beforeDeletion = (await call('/api/document-drafts')).data;
    const publishedDraft = beforeDeletion.entries.find(entry => entry.status === 'published');
    assert.equal((await deleteDraft({ id: publishedDraft.id, revision: beforeDeletion.revision })).status, 400);
    const deletionImport = { format: contract.format, passage: { ...fixture.passages[0], title: 'Accidental import for deletion test', text: fixture.passages[0].text + '\n\nAn extra paragraph for this private draft.' } };
    beforeDeletion = (await call('/api/document-drafts', { source: JSON.stringify(deletionImport) })).data;
    const deletionId = beforeDeletion.lastImport.entryIds[0];
    const snapshot = await readFile(join(dir, 'server/data/library-books.json'), 'utf8');
    assert.equal((await deleteDraft({ id: deletionId, revision: beforeDeletion.revision }, 'bad')).status, 403);
    assert.equal((await deleteDraft({ id: deletionId, revision: beforeDeletion.revision - 1 })).status, 409);
    const deleted = await deleteDraft({ id: deletionId, revision: beforeDeletion.revision });
    assert.equal(deleted.status, 200);
    assert.equal((await deleted.json()).entries.some(entry => entry.id === deletionId), false);
    assert.equal((await call('/api/document-drafts')).data.entries.some(entry => entry.id === deletionId), false);
    assert.equal(await readFile(join(dir, 'server/data/library-books.json'), 'utf8'), snapshot);
    const reimport = (await call('/api/document-drafts', { source: JSON.stringify(deletionImport) })).data;
    assert.notEqual(reimport.lastImport.entryIds[0], deletionId);
  } finally {
    if (server) await new Promise(done => server.close(done));
    await rm(modulePath, { force: true });
    assert.equal(dirname(resolve(dir)), resolve(fixtureRoot)); assert.ok(dir.startsWith(join(fixtureRoot, 'document-roundtrip-'))); await rm(dir, { recursive: true, force: true });
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
  const englishPrompt = contract.prompt(taxonomy, { subject: 'english' });
  assert.match(englishPrompt, /English Language Arts section only/);
  assert.match(englishPrompt, /blank or failed text extraction does NOT mean a blank PDF/);
  assert.match(englishPrompt, /data-glossary-definition/);
  assert.match(englishPrompt, /COMPLETE passage AND ALL of its questions/);
  assert.doesNotMatch(englishPrompt, /MATH BATCHES AND CONTINUATION|"mathInteractions"|"mathBatch"|"mathQuestions":/);
  assert.match(contract.schema.passage.richText, /data-glossary-definition/);
  assert.match(html, /buildOfficialPassagePrompt\(\{\s*subject: "english"/);
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
