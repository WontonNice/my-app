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

test("SAT importer never invents missing or ambiguous answers", () => {
  const data = readerExport();
  data.testPreview.questions[2].correctAnswer = null;
  data.testPreview.questions[2].choices.forEach(choice => { choice.isCorrect = false; });
  assert.throws(() => setup().ui.convertSatCrashCourseImport(JSON.stringify(data)), /Question 3.*missing or ambiguous/);
  data.testPreview.questions[2].correctAnswer = { label: "D" };
  data.testPreview.questions[2].choices[0].isCorrect = true;
  assert.throws(() => setup().ui.convertSatCrashCourseImport(JSON.stringify(data)), /Question 3.*ambiguous/);
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
  for (const text of ["Entire packet", "Fixture.pdf", "Key.pdf", "nathan-tutors-official-passage-v1", "DO NOT solve", "NEVER generate an explanation", "WHOLE passage", "sourceQuestion", "topicConfidence", "mathQuestions", "public-domain", "Return ONLY"]) assert.ok(prompt.includes(text), text);
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
