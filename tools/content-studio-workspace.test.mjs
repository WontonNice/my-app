import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";
import DocumentImport from "./document-import.cjs";

const source = await readFile(new URL("./content-studio-workspace.js", import.meta.url), "utf8");
const setup = (questions = []) => {
  const app = { passageMode: "exam", selectedPassageId: "passage-a", passageDraft: { questions } };
  return { app, ui: vm.runInNewContext(`${source}\nstudioUI;`, { app, URL, DocumentImport }) };
};

const editorHtml = await readFile(new URL('./content-studio.html', import.meta.url), 'utf8');
const editorFunction = name => {
  const start = editorHtml.search(new RegExp(`^    (?:async )?function ${name}\\(`, 'm'));
  assert.notEqual(start, -1, name);
  const next = editorHtml.slice(start + 1).search(/^    (?:async )?function /m);
  return editorHtml.slice(start, next < 0 ? undefined : start + 1 + next);
};

test('Part B uses its own student document in authoring and Student view without reading content or keys leaking', () => {
  const nodes = { '#student-preview-modal': { hidden: false }, '#student-preview-subtitle': {}, '#student-preview-question': {}, '#student-preview-frame': {} };
  const app = { previewMode: 'standalone', previewQuestionIndex: 12, studentStyles: '', passageDraft: { title: 'Reading sentinel', text: 'Other unsaved content', questions: [] }, standaloneDraft: { type: 'multiple_choice', prompt: 'Which revision?', promptHtml: 'Which <strong>revision</strong>?', stimulus: 'Paragraph text.', choices: ['A','B','C','D'].map(id => ({ id, text: `Answer ${id}` })), correctChoiceId: 'C' } };
  const reading = JSON.stringify(app.passageDraft);
  const render = vm.runInNewContext(`${editorFunction('inlineRichValue')}\n${editorFunction('studentQuestionMarkup')}\n${editorFunction('renderStudentPreview')}\nrenderStudentPreview;`, {
    app, $: selector => nodes[selector], studioUI: { selectedQuestionIndex: 7 }, escapeHtml: value => String(value ?? ''),
    studentPassageMarkup() { assert.fail('Part B must not render the Reading passage'); },
  });
  render();
  const student = nodes['#student-preview-frame'].srcdoc;
  assert.match(student, /<section class="exam-standalone-document">/);
  assert.match(student, /Which <strong>revision<\/strong>\?/);
  assert.match(student, /Paragraph text\./);
  assert.doesNotMatch(student, /Reading sentinel|Other unsaved content|checked|studio-key-correct/);
  assert.equal(app.previewQuestionIndex, 0);
  const frame = { tagName: 'IFRAME', dataset: { editor: 'standalone' } };
  app.previewMode = 'math'; nodes['#student-preview-modal'].hidden = true;
  render(frame);
  assert.match(frame.srcdoc, /<section class="exam-standalone-document">/);
  assert.match(frame.srcdoc, /html, body \{ min-width: 0; background: #f7f7f7; color: #111820; color-scheme: light;/);
  assert.match(frame.srcdoc, /\.exam-session-shell \{ min-height: 100vh; box-sizing: border-box;/);
  assert.match(frame.srcdoc, /exam-choice-list exam-standalone-choice-list/);
  assert.doesNotMatch(frame.srcdoc, /<script\b/);
  assert.equal(JSON.stringify(app.passageDraft), reading);
  app.standaloneDraft = { type: 'category_sort', prompt: 'Pick a sentence.', stimulus: 'Paragraph text.', items: [{ id: 's1', text: 'Sentence 1' }, { id: 's2', text: 'Sentence 2' }], categories: [{ id: 'box', title: 'Answer box' }], categoryCapacity: 1, correctPlacements: { s2: 'box' } };
  render(frame);
  assert.match(frame.srcdoc, /data-preview-category-item="s2"/);
  assert.match(frame.srcdoc, /data-preview-category-capacity="1"/);
  assert.match(frame.srcdoc, /class="exam-standalone-category-card"/);
  assert.match(frame.srcdoc, /class="exam-standalone-category-target-items" data-preview-category-items/);
  assert.doesNotMatch(frame.srcdoc, /class="exam-category-card"/);
});

test('direct Part B editing preserves rich text and paragraph boundaries without changing answer keys or other fields', () => {
  const app = { standaloneDraft: { type: 'multiple_choice', prompt: 'Old', stimulus: 'Old', correctChoiceId: 'B', explanation: 'Keep explanation', points: 2, choices: [{ id: 'A', text: 'First' }, { id: 'B', text: 'Second' }] } };
  const sourceEditor = { innerHTML: '' };
  const ui = vm.runInNewContext(`${source}\nstudioUI;`, { app, document: { querySelector: () => sourceEditor }, markStandaloneDirty: () => { app.standaloneDirty = true; } });
  ui.commitStandaloneRich('stimulus', 0, '<p>First <b>paragraph</b>.</p><p>Second.</p>', 'First paragraph.\nSecond.');
  assert.equal(app.standaloneDraft.stimulus, 'First paragraph.\nSecond.');
  assert.equal(app.standaloneDraft.stimulusHtml, sourceEditor.innerHTML);
  ui.commitStandaloneRich('choice', 0, '<em>Changed</em> answer', 'Changed\u00a0answer');
  assert.equal(app.standaloneDraft.choices[0].text, 'Changed answer');
  assert.equal(app.standaloneDraft.choices[0].html, '<em>Changed</em> answer');
  assert.equal(app.standaloneDraft.correctChoiceId, 'B');
  assert.equal(app.standaloneDraft.explanation, 'Keep explanation');
  assert.equal(app.standaloneDraft.points, 2); assert.equal(app.standaloneDirty, true);
  const before = ui.standaloneRenderKey();
  app.standaloneDraft.explanation = 'New explanation'; app.standaloneDraft.topic = 'Pronouns';
  assert.equal(ui.standaloneRenderKey(), before, 'Private fields do not reload the canvas');
});

test('Part B saves retain the draft on failure and always restore editing controls', async () => {
  for (const fails of [false, true]) {
    const draft = { id: 'part-b', type: 'multiple_choice', explanation: 'Unsaved explanation' };
    const app = { standaloneDraft: draft, selectedStandaloneItemId: 'part-b', standaloneDirty: true, state: { standaloneSourceHash: 'version1' } };
    const editor = { setAttribute() {}, removeAttribute() {} }, button = {};
    let posted, mounted = false;
    const save = vm.runInNewContext(`${editorFunction('saveStandaloneItem')}\nsaveStandaloneItem;`, {
      app, $: selector => selector === '#standalone-editor' ? editor : button, clone: structuredClone, setStatus() {},
      api: async (_path, options) => { assert.equal(editor.inert, true); posted = JSON.parse(options.body); if (fails) throw new Error('Save failed'); return { standalone: { item: { ...draft, explanation: 'Saved explanation' } } }; },
      reloadState: async () => {}, renderStandaloneList() {}, renderStandaloneEditor(preservePosition) { assert.equal(preservePosition, true); mounted = true; }, studioUI: { syncSaveState() {} },
    });
    await save();
    assert.equal(posted.item.explanation, 'Unsaved explanation');
    assert.equal(app.saving, false); assert.equal(editor.inert, false); assert.equal(button.disabled, false);
    assert.equal(mounted, !fails); assert.equal(app.standaloneDirty, fails);
    if (fails) assert.equal(app.standaloneDraft, draft);
    else assert.equal(app.standaloneDraft.explanation, 'Saved explanation');
  }
});

test('imported Part B drafts use versioned draft saves and retain unsaved edits when completion fails', async () => {
  const importerSource = await readFile(new URL('./content-studio-part-b.js', import.meta.url), 'utf8');
  for (const publish of [false, true]) {
    const original = { id: 'part-b-import-1', prompt: 'Teacher edit', correctChoiceId: '', importDraftId: 'draft-1', importVersion: 3 };
    const app = { standaloneDraft: original, standaloneDirty: true, state: { standaloneSourceHash: 'bank-version' } };
    const editor = {}, button = {}; let request;
    const importer = vm.runInNewContext(`${importerSource}\nPartBImport;`, {
      app, document: { getElementById: id => id === 'standalone-editor' ? editor : button }, clone: structuredClone, setStatus() {},
      api: async (path, options) => {
        request = { path, method: options.method, ...JSON.parse(options.body) };
        if (publish) throw new Error('Correct answer is required.');
        return { entry: { id: 'draft-1', version: 4, question: { id: original.id, prompt: original.prompt, correctChoiceId: '' } } };
      },
      reloadState: async () => {}, renderStandaloneList() {}, renderStandaloneEditor(preserve) { assert.equal(preserve, true); }, studioUI: { syncSaveState() {} },
    });
    await importer.saveCurrent(publish);
    assert.equal(request.path, publish ? '/api/standalone-drafts/publish' : '/api/standalone-drafts');
    assert.equal(request.version, 3); assert.equal(request.sourceHash, 'bank-version'); assert.equal(request.question.prompt, 'Teacher edit');
    assert.equal(app.saving, false); assert.equal(editor.inert, false); assert.equal(button.disabled, false);
    if (publish) { assert.equal(app.standaloneDraft, original); assert.equal(app.standaloneDirty, true); }
    else { assert.equal(app.standaloneDraft.importVersion, 4); assert.equal(app.standaloneDraft.correctChoiceId, ''); assert.equal(app.standaloneDirty, false); }
  }
});

test('Part B draft deletion supports cancel, failure, next draft, bank fallback and an empty library', async () => {
  const importerSource = await readFile(new URL('./content-studio-part-b.js', import.meta.url), 'utf8');
  for (const scenario of ['cancel', 'failure', 'next', 'bank', 'empty', 'published']) {
    const original = { id: 'q1', prompt: 'Unsaved edit', ...(scenario === 'published' ? {} : { importDraftId: 'draft-1', importVersion: 4 }) };
    const next = { id: 'draft-2', version: 2, question: { id: 'q2', prompt: 'Next draft' } };
    const bank = { id: 'bank-1', prompt: 'Saved question' };
    const drafts = [{ id: 'draft-1', question: original }, next];
    const app = { standaloneDraft: original, standaloneDirty: true, state: { standaloneImportDrafts: drafts, standaloneItems: scenario === 'bank' ? [bank] : [] } };
    const editor = {}; let requests = 0, renders = 0, focused = false;
    const importer = vm.runInNewContext(`${importerSource}\nPartBImport;`, {
      app, document: { getElementById: id => id === 'standalone-editor' ? editor : { focus() { assert.equal(editor.inert, false); focused = true; } } },
      window: { confirm(message) { assert.match(message, /Unsaved edit/); assert.match(message, /unsaved edits/); return scenario !== 'cancel'; } },
      clone: structuredClone, setStatus() {}, studioUI: { syncSaveState() {} }, renderStandaloneList() {}, renderStandaloneEditor() { renders++; },
      api: async (path, options) => {
        requests++; assert.equal(path, '/api/standalone-drafts'); assert.equal(options.method, 'DELETE');
        assert.deepEqual(JSON.parse(options.body), { id: 'draft-1', version: 4 }); assert.equal(editor.inert, true);
        if (scenario === 'failure') throw new Error('Draft changed in another editor');
        return { deleted: 'draft-1', drafts: scenario === 'next' ? [next] : [] };
      },
    });
    await importer.deleteCurrent();
    const succeeds = ['next', 'bank', 'empty'].includes(scenario);
    assert.equal(requests, ['cancel', 'published'].includes(scenario) ? 0 : 1);
    assert.equal(renders, succeeds ? 1 : 0); assert.equal(focused, succeeds);
    assert.equal(Boolean(app.saving), false); assert.equal(Boolean(editor.inert), false);
    assert.equal(app.standaloneDirty, !succeeds);
    if (!succeeds) { assert.equal(app.standaloneDraft, original); assert.equal(app.state.standaloneImportDrafts, drafts); }
    if (scenario === 'next') { assert.equal(app.standaloneDraft.importDraftId, next.id); assert.equal(app.standaloneDraft.importVersion, 2); }
    if (scenario === 'bank') { assert.deepEqual(app.standaloneDraft, bank); assert.equal(app.selectedStandaloneItemId, bank.id); }
    if (scenario === 'empty') assert.equal(app.standaloneDraft, null);
  }
});

test('passage draft deletion preserves unsaved content on cancel or failure and clears only the deleted editor', async () => {
  const documentSource = await readFile(new URL('./content-studio-documents.js', import.meta.url), 'utf8');
  for (const scenario of ['cancel', 'failure', 'delete', 'other', 'published']) {
    const original = { importDraftId: 'draft-1', title: 'Teacher edit', questions: [] };
    const app = { passageMode: 'exam', passageDraft: original, passageDirty: true, state: { passages: [{ id: 'saved', title: 'Saved passage' }] } };
    const editor = {}; let requests = 0;
    const ui = vm.runInNewContext(`${documentSource}\nDocumentStudio;`, {
      app, document: { getElementById: () => editor, querySelector: () => null }, window: { confirm: () => scenario !== 'cancel' },
      clone: structuredClone, setStatus() {}, studioUI: { syncSaveState() {} }, renderPassageList() {}, renderPassageEditor() {},
      api: async (path, options) => {
        requests++; assert.equal(path, '/api/document-drafts'); assert.equal(options.method, 'DELETE');
        assert.equal(JSON.parse(options.body).revision, 5); assert.equal(editor.inert, true);
        if (scenario === 'failure') throw new Error('Drafts changed');
        return { revision: 6, entries: [] };
      },
    });
    const id = scenario === 'other' ? 'draft-2' : 'draft-1';
    ui.state = { revision: 5, entries: [{ id, kind: 'passage', status: scenario === 'published' ? 'published' : 'draft', content: { title: 'Imported', questions: [{}] } }] };
    await ui.deleteDraft(id);
    assert.equal(requests, ['cancel', 'published'].includes(scenario) ? 0 : 1);
    assert.equal(Boolean(app.saving), false); assert.equal(Boolean(editor.inert), false);
    if (scenario === 'delete') { assert.equal(app.passageDraft.id, 'saved'); assert.equal(app.passageDirty, false); }
    else { assert.equal(app.passageDraft, original); assert.equal(app.passageDirty, true); }
  }
});

test('reading preview keeps rich question instructions in one editable block and omits the empty directions placeholder', () => {
  const nodes = { '#student-preview-modal': { hidden: false }, '#student-preview-subtitle': {}, '#student-preview-question': {}, '#student-preview-frame': {} };
  const question = { type: 'multiple_choice', prompt: 'Choose the revision.', instructionsHtml: '<p>Select <strong>two</strong> answers.</p><p>Use the evidence.</p>', choices: [] };
  const app = { passageDraft: { title: 'Passage', format: 'prose', questions: [question] }, studentStyles: '', previewQuestionIndex: 0 };
  const render = vm.runInNewContext(`${editorFunction('inlineRichValue')}\n${editorFunction('studentQuestionMarkup')}\n${editorFunction('renderStudentPreview')}\nrenderStudentPreview;`, {
    app, $: selector => nodes[selector], studioUI: { selectedQuestionIndex: 0 }, escapeHtml: value => String(value ?? ''), studentPassageMarkup: () => 'Passage text',
  });
  const frame = { tagName: 'IFRAME', dataset: {} };
  render(frame);
  assert.ok(frame.srcdoc.includes(`<div class="exam-question-instructions">${question.instructionsHtml}</div>`));
  assert.doesNotMatch(frame.srcdoc, /<p class="exam-question-instructions">/);
  question.instructionsHtml = ''; render(frame);
  assert.doesNotMatch(frame.srcdoc, /class="exam-question-instructions"|Add directions/);
});

test('reading startup mounts the editable preview after its workspace controls and survives a Practice setup error', async () => {
  const html = await readFile(new URL('./content-studio.html', import.meta.url), 'utf8');
  const start = html.indexOf('    async function initialize() {');
  const end = html.indexOf('    $$("[data-tab]")', start);
  for (const existing of [false, true]) {
    const original = { id: 'reading-draft', text: 'Unsaved passage', questions: [{ id: 'q1', prompt: 'Unsaved question', correctChoiceId: 'B' }] };
    const app = { state: { passages: [{ id: 'first', questions: [] }], assessments: [], advancedPassages: [], practice: { topics: [] } }, passageDraft: existing ? original : null, passageDirty: existing };
    let shellReady = false, canvas = false, documentsReady = false;
    const messages = [];
    const initialize = vm.runInNewContext(`${html.slice(start, end)}\ninitialize;`, {
      app, clone: structuredClone, document: { querySelector: () => canvas ? {} : null }, window: { location: { hash: '' } },
      reloadState: async () => {}, updatePassageWorkspaceLabels() {}, renderPassageList() {},
      studioUI: { readPreference: (_key, fallback) => fallback, restorePassageLibrary() {}, initialize() { shellReady = true; } },
      renderPassageEditor() { assert.equal(shellReady, true); canvas = true; },
      DocumentStudio: { initialize() { documentsReady = true; } },
      initializePracticeEditor() { throw new Error('Unrelated saved Practice settings'); },
      setStatus: message => messages.push(message),
    });
    await initialize();
    assert.equal(canvas, true); assert.equal(documentsReady, true);
    assert.match(messages.at(-1), /reading editor is ready/);
    if (existing) { assert.equal(app.passageDraft, original); assert.equal(app.passageDirty, true); assert.equal(app.passageDraft.questions[0].correctChoiceId, 'B'); }
    else { assert.equal(app.selectedPassageId, 'first'); assert.equal(app.passageDirty, false); }
  }
});

test("category filter counts include empty categories and default legacy content without changing passages", () => {
  const { app, ui } = setup();
  app.state = { passageCategories: [{ value: "official_handbook", label: "Official Handbook" }, { value: "prestige", label: "Prestige" }, { value: "miscellaneous", label: "Miscellaneous" }] };
  const passages = [{ id: "a", passageCategory: "official_handbook" }, { id: "b" }, { id: "c", passageCategory: "miscellaneous" }];
  assert.deepEqual(Array.from(ui.passageCategoryCounts(passages), category => [category.value, category.count]), [["official_handbook", 1], ["prestige", 0], ["miscellaneous", 2]]);
  assert.deepEqual(passages, [{ id: "a", passageCategory: "official_handbook" }, { id: "b" }, { id: "c", passageCategory: "miscellaneous" }]);
  assert.deepEqual(Array.from(ui.passageCategoryCounts([]), category => category.count), [0, 0, 0]);
});

test("catalog search matches separate terms across source fields, ignores accents and ranks titles first", () => {
  const { ui } = setup();
  const passages = [
    { id: 'body', title: 'History', questions: [{ topic: 'Evidence', prompt: 'At dusk we read a poem.' }] },
    { id: 'title', title: 'At Dusk', versionLabel: 'Form B', questions: [{ topic: 'Evidence', prompt: 'Explain the image.' }] },
    { id: 'accent', title: 'Café reading', questions: [] },
  ];
  assert.deepEqual(Array.from(ui.searchPassages(passages, 'dusk evidence'), item => item.id), ['title', 'body']);
  assert.deepEqual(Array.from(ui.searchPassages(passages, 'form dusk'), item => item.id), ['title']);
  assert.deepEqual(Array.from(ui.searchPassages(passages, 'cafe'), item => item.id), ['accent']);
  assert.equal(ui.searchPassages(passages, 'missing dusk').length, 0);
  assert.deepEqual(passages.map(item => item.id), ['body', 'title', 'accent']);
});

test("passage library category and question-count sorting compose with format filtering and paging", () => {
  const { app, ui } = setup();
  app.state = { passageCategories: [{ value: 'official_handbook', label: 'Official Handbook' }, { value: 'prestige', label: 'Prestige' }, { value: 'miscellaneous', label: 'Miscellaneous' }] };
  const passages = [{ id: 'a', title: 'Zeta', format: 'poem', passageCategory: 'official_handbook', questions: [1] }, { id: 'b', title: 'Alpha', format: 'prose', passageCategory: 'prestige', questions: [1, 2, 3] }, { id: 'c', title: 'Beta', format: 'poem', questions: [1, 2] }];
  assert.deepEqual(Array.from(ui.getLibrarySlice(passages, 'passages', '', '', 'category').items, item => item.id), ['c', 'a', 'b']);
  assert.deepEqual(Array.from(ui.getLibrarySlice(passages, 'passages', '', 'poem', 'questions').items, item => item.id), ['c', 'a']);
  assert.deepEqual(Array.from(ui.getLibrarySlice(passages, 'passages', '', '', 'questions-asc').items, item => item.id), ['a', 'c', 'b']);
  assert.deepEqual(passages.map(item => item.id), ['a', 'b', 'c']);
});

const readerExport = () => ({
  schemaVersion: 3,
  source: { url: "https://tutor.thesatcrashcourse.com/tests/digital-shsat/fixture" },
  testPreview: {
    testTitle: "Digital SHSAT Fixture", module: "English Language Arts",
    capture: { mode: "passage-all", warnings: [], restoredStartingQuestion: true },
    questions: Array.from({ length: 7 }, (_, index) => ({
      number: index + 1, passage: { id: "fixture-p1", text: 'Intro about an author.\nExcerpt from "A Fixture"\nby Test Author\n1 First paragraph.\n2 Second paragraph.' },
      prompt: `Prompt ${index + 1}`, explanation: `Explanation ${index + 1}`,
      choices: ["A", "B", "C", "D"].map(label => ({ label, text: `Choice ${label}`, isCorrect: label === "C" })),
      correctAnswer: { label: "C", text: "Choice C" },
    })),
  },
});

test("SAT reader JSON maps all questions, answers, explanations, source numbers, and passage metadata", () => {
  const { ui } = setup();
  const document = ui.convertSatCrashCourseImport(JSON.stringify(readerExport()), { topic: "Inference", passageType: "literary" });
  assert.equal(document.passage.questions.length, 7);
  assert.equal(document.passage.title, 'Excerpt from "A Fixture"');
  assert.equal(document.passage.author, "Test Author");
  assert.equal(document.passage.blurb, "Intro about an author.");
  assert.equal(document.passage.text, "First paragraph.\n\nSecond paragraph.");
  assert.equal(document.passage.questions[6].correctChoiceId, "C");
  assert.equal(document.passage.questions[6].explanation, "Explanation 7");
  assert.equal(document.passage.questions[6].topic, "Inference");
  assert.match(document.passage.teacherSource, /original questions 1, 2, 3, 4, 5, 6, 7/);
  assert.equal(document.sourceKind, "sat-crash-course");
});

test("SAT importer accepts legacy current-question exports but warns about incomplete capture", () => {
  const data = readerExport();
  data.schemaVersion = 2;
  data.testPreview.question = data.testPreview.questions[0];
  delete data.testPreview.questions;
  delete data.testPreview.capture;
  const result = setup().ui.convertSatCrashCourseImport(JSON.stringify(data));
  assert.equal(result.passage.questions.length, 1);
  assert.match(result.reviewNotes.join("\n"), /Only one question|may omit earlier/);
});

test('SAT imports default to Prestige and retain bold/italic passage, question, choice, and explanation formatting', () => {
  const data = readerExport();
  for (const question of data.testPreview.questions) question.passage.formattedBlocks = [
    { text: 'Intro about an author.', html: '<em>Intro about an author.</em>' },
    { text: 'Excerpt from "A Fixture"', html: 'Excerpt from "A Fixture"' },
    { text: 'by Test Author', html: 'by Test Author' },
    { text: '1 First paragraph.', html: '1 First <strong>paragraph.</strong>' },
    { text: '2 Second paragraph.', html: '2 Second <em>paragraph.</em>' },
  ];
  data.testPreview.questions[0].promptHtml = 'What is <b>most important</b>?';
  data.testPreview.questions[0].choices[0].html = '<i>Original emphasis</i><script>bad()</script>';
  data.testPreview.questions[0].explanationHtml = '<p>A <strong>source explanation</strong>.</p>';
  const result = setup().ui.convertSatCrashCourseImport(JSON.stringify(data));
  assert.equal(result.passage.passageCategory, 'prestige');
  assert.equal(result.passage.richText, '<p>First <strong>paragraph.</strong></p><p>Second <em>paragraph.</em></p>');
  assert.equal(result.passage.questions[0].promptHtml, 'What is <strong>most important</strong>?');
  assert.equal(result.passage.questions[0].choices[0].html, '<em>Original emphasis</em>');
  assert.match(result.passage.questions[0].explanationHtml, /<strong>source explanation<\/strong>/);
  const parsed = DocumentImport.parse(JSON.stringify(result))[0];
  assert.equal(parsed.content.passageCategory, 'prestige'); assert.match(parsed.content.richText, /<em>/);
});

test('SAT poetry uses detected source format and keeps blank stanza blocks and inline emphasis', () => {
  const data = readerExport();
  const blocks = [{ text: 'A poem', html: 'A poem' }, { text: 'by Author', html: 'by Author' },
    { text: 'First line', html: 'First <em>line</em>' }, { text: 'Second line', html: 'Second line' },
    { text: '', html: '<br>' }, { text: 'Last stanza', html: 'Last stanza' }];
  for (const question of data.testPreview.questions) question.passage = { id: 'poem', format: 'poem', text: blocks.map(block => block.text).join('\n'), formattedBlocks: blocks };
  const result = setup().ui.convertSatCrashCourseImport(JSON.stringify(data));
  assert.equal(result.passage.format, 'poem'); assert.equal(result.passage.passageType, 'poem');
  assert.equal(result.passage.text, 'First line\nSecond line\n\nLast stanza');
  assert.equal(result.passage.richText, '<p>First <em>line</em></p><p>Second line</p><p><br></p><p>Last stanza</p>');
});

test("SAT importer never invents missing or ambiguous answers", () => {
  const data = readerExport();
  data.testPreview.questions[2].correctAnswer = null;
  data.testPreview.questions[2].choices.forEach(choice => { choice.isCorrect = false; });
  const missing = setup().ui.convertSatCrashCourseImport(JSON.stringify(data));
  assert.equal(missing.passage.questions.length, 7);
  assert.equal(missing.passage.questions[2].correctChoiceId, '');
  assert.match(missing.reviewNotes.join('\n'), /Question 3.*missing or ambiguous/);
  data.testPreview.questions[2].correctAnswer = { label: "D" };
  data.testPreview.questions[2].choices[0].isCorrect = true;
  const ambiguous = setup().ui.convertSatCrashCourseImport(JSON.stringify(data));
  assert.equal(ambiguous.passage.questions[2].correctChoiceId, '');
  assert.equal(ambiguous.passage.questions[1].correctChoiceId, 'C');
  assert.equal(ambiguous.passage.questions[2].review.sourceQuestionData.correctAnswer.label, 'D');
  assert.ok(ambiguous.passage.questions[2].review.warnings.some(note => note.code === 'SOURCE_KEY_AMBIGUOUS'));
});

test("SAT importer retains unsupported choice counts and prompt-only questions as editable drafts", () => {
  for (const count of [0, 1, 2, 3, 5, 9]) {
    const data = readerExport();
    const question = data.testPreview.questions[2];
    question.number = 9;
    question.choices = Array.from({ length: count }, (_, i) => ({ label: String.fromCharCode(65 + i), text: `Captured choice ${i + 1}`, isCorrect: false }));
    question.correctAnswer = null;
    const converted = setup().ui.convertSatCrashCourseImport(JSON.stringify(data));
    const imported = converted.passage.questions.find(q => q.review.sourceQuestion === '9');
    assert.equal(converted.passage.questions.length, 7);
    assert.equal(imported.prompt, question.prompt);
    assert.equal(imported.explanation, question.explanation);
    assert.equal(imported.choices.length, count < 2 ? 4 : count);
    assert.deepEqual(Array.from(imported.choices.slice(0, count), choice => choice.text), question.choices.map(choice => choice.text));
    assert.ok(imported.choices.slice(count).every(choice => choice.text === ''));
    assert.equal(imported.correctChoiceId, '');
    assert.ok(imported.review.warnings.some(note => note.code === 'LOW_CONFIDENCE_QUESTION_TYPE'));
    assert.equal(imported.review.sourceQuestionData.choices.length, count);
    assert.equal(imported.review.sourceQuestionData.passage, undefined);
    const [entry] = DocumentImport.parse(JSON.stringify(converted));
    assert.equal(entry.content.questions.length, 7);
    assert.ok(DocumentImport.issues(entry, { reading: ['Central Idea & Theme'] }).some(issue => issue.scope === 'Question 9'));
  }
});

test("SAT importer keeps duplicate labels, missing prompts, and malformed choices for manual repair", () => {
  const data = readerExport();
  data.testPreview.questions[0].choices[1].label = 'A';
  data.testPreview.questions[1].choices = null;
  data.testPreview.questions[2].prompt = '';
  const converted = setup().ui.convertSatCrashCourseImport(JSON.stringify(data));
  const questions = converted.passage.questions;
  assert.equal(questions.length, 7);
  assert.equal(questions[0].correctChoiceId, '');
  assert.deepEqual(Array.from(questions[0].choices, choice => choice.id), ['A', 'B', 'C', 'D']);
  assert.equal(questions[0].review.sourceQuestionData.choices[1].label, 'A');
  assert.equal(questions[1].choices.length, 4);
  assert.equal(questions[1].correctChoiceId, '');
  assert.equal(questions[2].prompt, '');
  assert.equal(questions[3].correctChoiceId, 'C');
  assert.doesNotThrow(() => DocumentImport.parse(JSON.stringify(converted)));
});

test("SAT importer rejects mixed passages, duplicate numbers, empty groups, other sites, and invalid JSON", () => {
  const { ui } = setup();
  const mixed = readerExport(); mixed.testPreview.questions[1].passage.id = "another-passage";
  assert.throws(() => ui.convertSatCrashCourseImport(JSON.stringify(mixed)), /different passages/);
  const duplicate = readerExport(); duplicate.testPreview.questions[1].number = 1;
  assert.throws(() => ui.convertSatCrashCourseImport(JSON.stringify(duplicate)), /unique original/);
  const empty = readerExport(); empty.testPreview.questions = [];
  assert.throws(() => ui.convertSatCrashCourseImport(JSON.stringify(empty)), /no questions/);
  const other = readerExport(); other.source.url = "https://example.com";
  assert.throws(() => ui.convertSatCrashCourseImport(JSON.stringify(other)), /must come from/);
  assert.throws(() => ui.convertSatCrashCourseImport("not JSON"), /Paste valid JSON/);
});

test("SAT importer warns about partial exports, gaps and media, and preserves poetry lines", () => {
  const data = readerExport(); data.testPreview.questions.splice(2, 1);
  data.testPreview.capture.warnings = ["Timed out waiting for Question 8."];
  data.testPreview.questions[0].media = [{ url: "https://example.com/figure.png" }];
  data.testPreview.questions.forEach(q => { q.passage.text = "A poem\n  Indented line\nFinal line"; });
  const result = setup().ui.convertSatCrashCourseImport(JSON.stringify(data), { title: "Poem override", format: "poem" });
  assert.equal(result.passage.title, "Poem override");
  assert.equal(result.passage.text, "A poem\n  Indented line\nFinal line");
  assert.match(result.reviewNotes.join("\n"), /Timed out/);
  assert.match(result.reviewNotes.join("\n"), /gaps/);
  assert.match(result.reviewNotes.join("\n"), /contains images/);
});

test("focused editing follows the same question after a reorder without changing content", () => {
  const questions = [{ id: "a", prompt: "First" }, { id: "b", prompt: "Second", correctChoiceId: "D" }];
  const { app, ui } = setup(questions);
  ui.selectedQuestionId = "b";
  ui.ensureQuestionSelection();
  assert.equal(ui.selectedQuestionIndex, 1);
  app.passageDraft.questions = [questions[1], questions[0]];
  ui.ensureQuestionSelection();
  assert.equal(ui.selectedQuestionId, "b");
  assert.equal(ui.selectedQuestionIndex, 0);
  assert.deepEqual(questions[1], { id: "b", prompt: "Second", correctChoiceId: "D" });
});

test("deleting the final selected question falls back safely, including an empty set", () => {
  const { app, ui } = setup([{ id: "a" }, { id: "b" }]);
  ui.selectedQuestionId = "b";
  ui.ensureQuestionSelection();
  app.passageDraft.questions.pop();
  ui.ensureQuestionSelection();
  assert.equal(ui.selectedQuestionId, "a");
  app.passageDraft.questions.pop();
  ui.ensureQuestionSelection();
  assert.equal(ui.selectedQuestionId, "");
  assert.equal(ui.selectedQuestionIndex, 0);
  app.passageDraft.questions.push({ id: "new" });
  ui.ensureQuestionSelection();
  assert.equal(ui.selectedQuestionId, "new");
});

test("section and question selection survive rerenders but reset for another passage workspace", () => {
  const { app, ui } = setup();
  ui.preparePassage();
  ui.passageSection = "questions";
  ui.selectedQuestionId = "question-7";
  ui.preparePassage();
  assert.equal(ui.passageSection, "questions");
  assert.equal(ui.selectedQuestionId, "question-7");
  app.passageMode = "advanced";
  ui.preparePassage();
  assert.equal(ui.passageSection, "content");
  assert.equal(ui.selectedQuestionId, "");
});

test("a thousand-item library exposes every item once in bounded pages", () => {
  const { ui } = setup();
  const records = Array.from({ length: 1003 }, (_, index) => ({ id: String(index), title: `Passage ${index}`, format: "prose" }));
  const initial = ui.getLibrarySlice(records, "passages", "exam");
  assert.equal(initial.items.length, 50);
  assert.equal(initial.pageCount, 21);
  const seen = [];
  for (let page = 0; page < initial.pageCount; page++) {
    ui.pages.set("passages", { page, signature: initial.queryKey });
    seen.push(...ui.getLibrarySlice(records, "passages", "exam").items.map((item) => item.id));
  }
  assert.deepEqual(seen, records.map((item) => item.id));
  assert.equal(new Set(seen).size, 1003);
});

test("search and type filters reset pagination, and sorting never reorders source data", () => {
  const { ui } = setup();
  const records = Array.from({ length: 102 }, (_, i) => ({ id: String(i), title: `Title ${String(102 - i).padStart(3, "0")}`, format: i % 2 ? "poem" : "prose" }));
  const before = structuredClone(records);
  let result = ui.getLibrarySlice(records, "passages", "exam");
  ui.pages.set("passages", { page: 2, signature: result.queryKey });
  result = ui.getLibrarySlice(records, "passages", "exam", "poem", "az");
  assert.equal(result.page, 0);
  assert.equal(result.total, 51);
  assert.equal(result.items[0].title, "Title 001");
  assert.ok(result.items.every((item) => item.format === "poem"));
  assert.deepEqual(records, before);
  ui.pages.set("passages", { page: 1, signature: result.queryKey });
  result = ui.getLibrarySlice([], "passages", "no results", "poem", "az");
  assert.equal(result.page, 0);
  assert.equal(result.total, 0);
  assert.equal(result.items.length, 0);
});

test("pagination clamps after library shrinkage and keeps Part B and passages independent", () => {
  const { ui } = setup();
  const records = Array.from({ length: 101 }, (_, i) => ({ id: String(i), prompt: `Question ${i}`, type: "category_sort" }));
  const result = ui.getLibrarySlice(records, "standalone", "", "category_sort");
  ui.pages.set("standalone", { page: 2, signature: result.queryKey });
  assert.equal(ui.getLibrarySlice(records.slice(0, 25), "standalone", "", "category_sort").page, 0);
  ui.pages.set("standalone", { page: 1, signature: result.queryKey });
  assert.equal(ui.getLibrarySlice(records, "passages", "").page, 0);
  assert.equal(ui.getLibrarySlice(records, "standalone", "", "category_sort").page, 1);
});

test("ChatGPT export includes the classification prompt, every choice, and the answer key", () => {
  const questions = [
    {
      id: "q-1",
      type: "multiple_choice",
      prompt: "Which detail best supports the central idea?",
      choices: [
        { id: "A", text: "The first detail" },
        { id: "B", text: "The second detail" },
      ],
      correctChoiceId: "B",
      explanation: "The second detail directly supports the stated central idea.",
      topic: "Wrong existing label",
    },
    {
      id: "q-2",
      type: "category_sort",
      promptHtml: "<strong>Sort</strong> each statement.",
      categories: [{ id: "claim", title: "Claim" }, { id: "evidence", title: "Evidence" }],
      items: [{ id: "item-1", text: "A supported statement" }],
      correctPlacements: { "item-1": "claim" },
    },
  ];
  const { app, ui } = setup(questions);
  app.passageDraft.title = "A Sample Passage";
  const exported = ui.buildQuestionClassificationExport();
  assert.match(exported, /choose exactly one question type/i);
  assert.match(exported, /\| Question \| Question type \| Confidence \| Brief reason \|/);
  assert.match(exported, /PASSAGE: A Sample Passage/);
  assert.match(exported, /QUESTION COUNT: 2/);
  assert.match(exported, /- A: The first detail/);
  assert.match(exported, /Correct answer\(s\): B — The second detail/);
  assert.match(exported, /Explanation: The second detail directly supports the stated central idea\./);
  assert.match(exported, /Prompt: Sort each statement\./);
  assert.match(exported, /A supported statement → Claim/);
  assert.doesNotMatch(exported, /Wrong existing label/);
});

test("ChatGPT export uses the editor's current topic list and omits interaction types", () => {
  const { app, ui } = setup([{ id: "q-1", type: "multi_select", prompt: "Select two details.", choices: [], correctChoiceIds: [] }]);
  app.state = { topics: ["Custom Skill", "Another Skill"] };
  const exported = ui.buildQuestionClassificationExport();
  assert.match(exported, /- Custom Skill\n- Another Skill/);
  assert.doesNotMatch(exported, /Question format: multi_select/);
  assert.match(exported, /Correct answer\(s\): Not set/);
});

test("ChatGPT export limits topics to the passage section", () => {
  const { app, ui } = setup([{ id: "q-1", type: "multiple_choice", prompt: "Revise this sentence.", choices: [], correctChoiceId: "" }]);
  app.state = {
    readingTopics: ["Central Idea & Theme", "Inference"],
    revisingEditingTopics: ["Sentence Structure", "Punctuation"],
    topics: ["Central Idea & Theme", "Inference", "Sentence Structure", "Punctuation"],
  };
  app.passageDraft.section = "revising_editing_a";
  const exported = ui.buildQuestionClassificationExport();
  assert.match(exported, /- Sentence Structure\n- Punctuation/);
  assert.doesNotMatch(exported, /- Central Idea & Theme/);
  assert.doesNotMatch(exported, /- Inference/);
});

test("universal prompt is the shared contract with source-only answers and complete scope", () => {
  const { app, ui } = setup();
  app.state = { topics: ["Central Idea & Theme", "Text Structure & Purpose"], mathTopics: ["Algebra"] };
  const prompt = ui.buildOfficialPassagePrompt({ target: "Entire packet", sourceLabel: "Fixture.pdf", answerGuideLabel: "Key.pdf" });
  for (const text of ["Entire packet", "Fixture.pdf", "Key.pdf", "nathan-tutors-official-passage-v1", "DO NOT solve", "NEVER generate an explanation", "WHOLE passage", "sourceQuestion", "topicConfidence", "mathQuestions", "user-provided document transcription", "Return ONLY"]) assert.ok(prompt.includes(text), text);
  assert.ok(prompt.includes('"Algebra"'));
  assert.doesNotMatch(prompt, /Solve each question carefully|generated from an official keyed answer/);
});

test('item task and question state are associated with stable IDs when returning to a passage', () => {
  const { app, ui } = setup([{ id: 'q-stable' }]);
  ui.preparePassage(); ui.passageSection = 'questions'; ui.selectedQuestionId = 'q-stable';
  app.selectedPassageId = 'passage-b'; ui.preparePassage();
  assert.equal(ui.passageSection, 'content');
  app.selectedPassageId = 'passage-a'; app.passageDraft.title = 'Renamed title'; ui.preparePassage();
  assert.equal(ui.passageSection, 'questions'); assert.equal(ui.selectedQuestionId, 'q-stable');
});

test('review identifies absent keys and explanations without supplying either or reordering questions', () => {
  const questions = [{ id: 'q-2', type: 'multiple_choice', prompt: 'First source question', choices: [{ id: 'A', text: 'One' }, { id: 'B', text: 'Two' }], correctChoiceId: '', explanation: '' }, { id: 'q-1', type: 'multiple_choice', prompt: 'Second source question', choices: [], correctChoiceId: 'B', explanation: 'Source explanation' }];
  const { app, ui } = setup(questions);
  Object.assign(app.passageDraft, { title: 'Fixture', text: 'Exact text', passageType: 'literary', visuals: [{ state: 'unresolved', description: 'Original chart' }] });
  const before = structuredClone(app.passageDraft);
  const issues = ui.passageIssues(app.passageDraft);
  assert.ok(issues.some(issue => issue.questionId === 'q-2' && /missing answer/.test(issue.message)));
  assert.ok(issues.some(issue => issue.questionId === 'q-2' && /explanation/.test(issue.message)));
  assert.ok(issues.some(issue => issue.panel === 'media' && /Original chart/.test(issue.message)));
  assert.deepEqual(app.passageDraft, before);
});

test('failed-save feedback survives request cleanup and dirty work remains dirty', () => {
  const app = { passageDirty: true, saving: true, passageDraft: { sourceHash: 'saved-source' } };
  const badge = { textContent: '', dataset: {} };
  const document = { body: { dataset: { workspace: 'passages' } }, querySelectorAll: () => [badge] };
  const ui = vm.runInNewContext(`${source}\nstudioUI;`, { app, document, URL, DocumentImport });
  ui.syncSaveState('error'); app.saving = false; ui.syncSaveState();
  assert.equal(badge.textContent, 'Save failed · changes retained'); assert.equal(app.passageDirty, true);
  app.saving = true; ui.syncSaveState(''); assert.equal(badge.textContent, 'Saving…');
  app.saving = false; app.passageDirty = false; ui.syncSaveState(); assert.equal(badge.textContent, 'Saved');
});

test('layout preferences fail safely when browser storage is unavailable', () => {
  const { ui } = setup();
  assert.equal(ui.readPreference('library-hidden', false), false);
  assert.doesNotThrow(() => ui.remember('support-width', 40));
});

test('private question properties do not rebuild an active exam canvas, while visible edits and keys do', () => {
  const { app, ui } = setup([{ id: 'stable-question', type: 'multiple_choice', prompt: 'Source prompt', choices: [{ id: 'A', text: 'Original choice' }], correctChoiceId: 'A', topic: 'Inference', points: 1, explanation: 'Source explanation' }]);
  Object.assign(app.passageDraft, { title: 'Source title', text: 'Paragraph one.\n\nParagraph two.', richText: '<p>Paragraph one.</p><p>Paragraph two.</p>' });
  const original = ui.examRenderKey();
  const q = app.passageDraft.questions[0];
  q.topic = 'Tone & Mood'; q.explanation = 'Long private rationale'; q.explanationHtml = '<p>Long private rationale</p>'; q.points = 2; q.review = { sourceReviewed: true };
  assert.equal(ui.examRenderKey(), original, 'inspector-only edits must not replace the iframe or its selection');
  q.choices[0].text = 'Edited source choice'; assert.notEqual(ui.examRenderKey(), original);
  q.choices[0].text = 'Original choice'; q.correctChoiceId = ''; assert.notEqual(ui.examRenderKey(), original);
  q.correctChoiceId = 'A'; app.passageDraft.title = 'Renamed inline'; assert.notEqual(ui.examRenderKey(), original);
});

test('direct block commits preserve legacy poem separators, indentation, repeated words and untouched characters', () => {
  const { ui } = setup();
  const text = 'First line,\n\n        Second line with wheedling in it.\n\nThird line.\n';
  const previous = ['First line,', 'Second line with\u00a0wheedling\u00a0in it.', 'Third line.', ''];
  const next = [...previous]; next[0] += ' edited';
  assert.equal(ui.reconcileExamText(text, previous, next, 'poem'), text.replace('First line,', 'First line, edited'));
  assert.equal(ui.reconcileExamText(text, previous, previous, 'poem'), text);
  assert.equal(ui.reconcileExamText('Word.\n\nWord.', ['Word.', 'Word.'], ['Word.', 'Second word.'], 'prose'), 'Word.\n\nSecond word.');
  assert.equal(ui.reconcileExamText('', [''], ['New content.'], 'prose'), 'New content.');
  assert.equal(ui.reconcileExamText('One.\n\nTwo.', ['One.', 'Two.'], ['One.\n\nNew paragraph.', 'Two.'], 'prose'), 'One.\n\nNew paragraph.\n\nTwo.');
  assert.equal(ui.reconcileExamText('One.\n\nTwo.', ['One.', 'Two.'], ['One.\n\n', 'Two.'], 'prose', true), 'One.\n\n\n\nTwo.');
  assert.equal(ui.reconcileExamText('One.\n\n\n\nTwo.', ['One.', '', 'Two.'], ['One.', 'New.', 'Two.'], 'prose'), 'One.\n\nNew.\n\nTwo.');
});

test('direct authoring adds stable source-block markers without changing student passage markup', async () => {
  const html = await readFile(new URL('./content-studio.html', import.meta.url), 'utf8');
  const start = html.indexOf('    function studentPassageMarkup(');
  const end = html.indexOf('    function studentQuestionMarkup(', start);
  const markup = vm.runInNewContext(`${html.slice(start, end)}\nstudentPassageMarkup;`, {
    escapeHtml: text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;'),
    richBlocksFromPassage: passage => passage.blocks || null,
    location: { origin: 'http://127.0.0.1:4320' },
    numberRichSentences: vm.runInNewContext(`${html.slice(html.indexOf('    function numberRichSentences('), start)}\nnumberRichSentences;`),
  });
  for (const format of ['prose', 'poem', 'sentence_prose']) {
    const passage = { title: 'Exact title', text: 'First paragraph.\n\nSecond paragraph.', format };
    const student = markup(passage);
    const editing = markup(passage, true);
    assert.equal(editing.replace(/ data-author-block="\d+" data-author-line="\d+"/g, '').replace(/<span data-generated-number contenteditable="false">([^<]*)<\/span>/g, '$1'), student);
    assert.match(editing, /data-author-block="0"/);
    assert.doesNotMatch(student, /data-author-|contenteditable/);
  }
  const rich = { title: 'Source layout', text: 'First.\n\nHeading\n\nSecond.', format: 'prose', preserveSourceLayout: true, blocks: [{ text: 'First.', html: '<em>First.</em>' }, { text: 'Heading', html: 'Heading', kind: 'heading' }, { text: 'Second.', html: 'Second.', numbered: false }] };
  assert.equal(markup(rich, true).replace(/ data-author-block="\d+" data-author-line="\d+"/g, ''), markup(rich));
  const poem = { title: 'Source poem', subtitle: 'Excerpt', byline: 'Robert Frost', text: 'One\nTwo\nThree\nFour\nFive\n\nSix', format: 'poem', preserveSourceLayout: true };
  const poemMarkup = markup(poem);
  assert.match(poemMarkup, /<span>5<\/span><span>Five<\/span>/);
  assert.match(poemMarkup, /class="exam-poem-line is-spacer"/);
  assert.match(poemMarkup, /<span>Excerpt<\/span>/);
  assert.match(poemMarkup, /<span>Robert Frost<\/span>/);
  assert.equal(markup(poem, true).replace(/ data-author-block="\d+" data-author-line="\d+"/g, ''), poemMarkup);
  assert.match(markup({ title: '', text: '', format: 'prose' }, true), /data-author-block="0"/);
  assert.doesNotMatch(markup({ title: '', text: '', format: 'prose' }, true), /content has not been added|Untitled Passage/);
  const numbered = markup({ title: 'Labels', text: 'The source says (1) as a label. Next sentence.', format: 'sentence_prose' }, true);
  assert.match(numbered, /data-generated-number/);
  assert.match(numbered.replace(/<span data-generated-number contenteditable="false">[^<]*<\/span>/g, ''), /The source says \(1\) as a label\. Next sentence\./);
});


test("exam groups separate official forms from custom labels without moving source data", () => {
  const { ui } = setup();
  const assessments = [{ id: "2025-2026-form-a" }, { id: "fall-mock", examLabel: "Mock exams" }, { id: "publisher-1", examLabel: "Prestige" }, { id: "custom" }, { id: "other-mock", examLabel: "mock exams" }];
  const before = JSON.stringify(assessments);
  const groups = Array.from(ui.assessmentGroups(assessments), group => ({ label: group.label, ids: Array.from(group.items, item => item.id) }));
  assert.deepEqual(groups, [{ label: "Official practice", ids: ["2025-2026-form-a"] }, { label: "Mock exams", ids: ["fall-mock", "other-mock"] }, { label: "Prestige", ids: ["publisher-1"] }, { label: "Other exams", ids: ["custom"] }]);
  assert.equal(JSON.stringify(assessments), before);
  assert.equal(ui.assessmentLabel({ id: "2025-2026-form-a", examLabel: "Teacher selection" }), "Teacher selection");
});

test('created labels remain visible before any exams are assigned', () => {
  const { app, ui } = setup();
  app.state = { examLabels: ['Official practice', 'Other exams', 'Weekly quizzes'] };
  const groups = Array.from(ui.assessmentGroups([{ id: '2025-2026-form-a' }]), group => ({ label: group.label, count: group.items.length }));
  assert.deepEqual(groups, [{ label: 'Official practice', count: 1 }, { label: 'Other exams', count: 0 }, { label: 'Weekly quizzes', count: 0 }]);
});

test('answer key changes validate a separate selection without mutating the question', () => {
  const { ui } = setup();
  const question = { id: 'q1', type: 'multiple_choice', choices: [{ id: 'A' }, { id: 'B' }], correctChoiceId: 'A' };
  assert.equal(ui.choiceAnswerKey(question, ['B']).correctChoiceId, 'B');
  assert.equal(question.correctChoiceId, 'A', 'Preparing a new selection must not apply it');
  assert.throws(() => ui.choiceAnswerKey(question, []), /one correct/);
  assert.throws(() => ui.choiceAnswerKey(question, ['A', 'B']), /one correct/);
  assert.throws(() => ui.choiceAnswerKey(question, ['missing']), /from this question/);
  const multi = { ...question, type: 'multi_select', correctChoiceIds: ['A', 'B'], requiredSelections: 2 };
  const update = ui.choiceAnswerKey(multi, ['B', 'A', 'B']);
  assert.deepEqual(Array.from(update.correctChoiceIds), ['B', 'A']);
  assert.equal(update.requiredSelections, 2);
  assert.throws(() => ui.choiceAnswerKey(multi, ['B']), /at least two/);
  assert.deepEqual(multi.correctChoiceIds, ['A', 'B']);
});

test('math answer summaries preserve numeric keys and readable formula choices', () => {
  const { ui } = setup();
  assert.equal(ui.mathAnswerSummaryText({ type: 'numeric_entry', correctTextAnswers: ['-0.8', '-4/5'] }), '-0.8 or -4/5');
  assert.equal(ui.mathAnswerSummaryText({ type: 'multiple_choice', correctChoiceId: 'B', choices: [{ id: 'B', math: '\\frac{1}{2}' }] }), 'B — \\(\\frac{1}{2}\\)');
  assert.equal(ui.mathAnswerSummaryText({ type: 'multiple_choice', correctChoiceId: 'B', choices: [{ id: 'B', text: 'one-half', math: '\\frac{1}{2}' }] }), 'B — one-half');
  assert.equal(ui.mathAnswerSummaryText({ type: 'multi_select', correctChoiceIds: [] }), 'Not set');
});

test('imported Math drafts enable answer controls directly, and saved questions unlock in place', () => {
  const question = { id: 'imported-q1', type: 'multiple_choice', correctChoiceId: '', importNeedsEditing: true };
  const app = { mathDraft: { questions: [question] }, selectedMathQuestionIndex: 0 };
  const ui = vm.runInNewContext(`${source}\nstudioUI;`, { app, URL, DocumentImport, renderMathTextHtml: value => value });
  const bars = [];
  const panel = { prepend: bar => bars.push(bar) };
  const inputs = Array.from({ length: 5 }, () => ({ disabled: true, focused: false, closest: () => panel, focus() { this.focused = true; } }));
  const root = { querySelectorAll: () => inputs, querySelector: () => ({ remove() {} }) };
  ui.element = (tag, className, text = '') => ({ tag, className, text, children: [], append(...children) { this.children.push(...children); } });
  ui.lockMathAnswerKey(root);
  assert.ok(inputs.every(input => !input.disabled), 'draft keys must be directly selectable for every supported response control');
  assert.equal(bars.at(-1).children.length, 1, 'drafts do not require an unlock action');
  delete question.importNeedsEditing;
  ui.lockMathAnswerKey(root);
  assert.ok(inputs.every(input => input.disabled));
  bars.at(-1).children[1].onclick();
  assert.ok(inputs.every(input => !input.disabled), 'Edit answer key must unlock the current question without a summary dialog');
  assert.equal(inputs[0].focused, true);
  question.id = 'different-question';
  ui.lockMathAnswerKey(root);
  assert.ok(inputs.every(input => input.disabled), 'unlocking a saved question does not unlock other saved questions');
});
