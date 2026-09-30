import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("./content-studio-workspace.js", import.meta.url), "utf8");
const setup = (questions = []) => {
  const app = { passageMode: "exam", selectedPassageId: "passage-a", passageDraft: { questions } };
  return { app, ui: vm.runInNewContext(`${source}\nstudioUI;`, { app, URL }) };
};

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

test("official passage prompt targets one PDF passage and matches the import contract", () => {
  const { app, ui } = setup();
  app.state = { topics: ["Central Idea & Theme", "Text Structure & Purpose"] };
  const prompt = ui.buildOfficialPassagePrompt({
    answerGuideLabel: "20202021_form_b_-_answers.pdf",
    hasAnswerGuide: true,
    sourceLabel: "2020-2021 Form B",
    target: "Massachusetts: Lowell National Historical Park, questions 10-16",
  });
  assert.match(prompt, /Convert exactly ONE passage/);
  assert.match(prompt, /Massachusetts: Lowell National Historical Park, questions 10-16/);
  assert.match(prompt, /Official source\/version: 2020-2021 Form B/);
  assert.match(prompt, /Official answer\/explanation guide: 20202021_form_b_-_answers\.pdf/);
  assert.match(prompt, /Two source PDFs are attached/);
  assert.match(prompt, /public domain or that they are authorized to reproduce and adapt it/);
  assert.match(prompt, /user-requested format conversion into structured JSON/);
  assert.match(prompt, /Do not replace the transcription with a summary, refuse the conversion, or omit text/);
  assert.match(prompt, /permission applies only to the requested passage/);
  assert.match(prompt, /"format": "nathan-tutors-official-passage-v1"/);
  assert.match(prompt, /"explanation": "Why the keyed answer is correct/);
  assert.match(prompt, /If the PDF prints E-H, map them to A-D in order/);
  assert.match(prompt, /Match the requested passage and every question to the answer guide by the original printed question number/);
  assert.match(prompt, /E→A, F→B, G→C, H→D/);
  assert.match(prompt, /include concise labeled reasons for each incorrect normalized choice/);
  assert.match(prompt, /generated from an official keyed answer/);
  assert.match(prompt, /- Central Idea & Theme\n- Text Structure & Purpose/);
  assert.match(prompt, /Allowed Reading Comprehension topic values/);
  assert.match(prompt, /Allowed Revising\/Editing topic values/);
  assert.match(prompt, /- Sentence Structure/);
  assert.match(prompt, /- Relevance & Conclusion/);
  assert.match(prompt, /Do not include richText, HTML, sourceHash/);
});

test("official passage prompt keeps a safe inference fallback without an answer guide", () => {
  const { app, ui } = setup();
  app.state = { topics: ["Central Idea & Theme", "Inference"] };
  const prompt = ui.buildOfficialPassagePrompt({ target: "Excerpt from A Tramp Abroad" });
  assert.match(prompt, /Official answer\/explanation guide: None is expected/);
  assert.match(prompt, /answer was inferred rather than read from an official key/);
  assert.doesNotMatch(prompt, /Two source PDFs are attached/);
});
