import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { labTopics, labUnit, normalizeCapture, importCaptures, publishQuestion, publishQuestions, createBankSet, mutateBank } from "./question-bank.mjs";
const require = createRequire(new URL("../server/package.json", import.meta.url));
require("ts-node").register({ transpileOnly: true, project: resolve("server/tsconfig.json"), compilerOptions: { module: "CommonJS", moduleResolution: "Node" }, moduleTypes: { "**": "cjs" } });
const { gradeBankSet, bankCatalog, bankPassageSet, bankPassage, bankTopicCatalog } = require("../server/src/shared/questionBank.ts");
const { validateDraft } = require("../server/src/shared/learningPlan.ts");
const empty = () => ({ revision: 0, questions: [], sets: [] });
const capture = (extra = {}) => ({ subject: "English", source: "SHSAT Lab", sourceUrl: "https://www.shsatlab.com/units/unit-7/practice?src=topics", sourceUnit: 7, sourceTopic: "Evidence & Support", difficulty: "easy", prompt: "Which detail supports the claim?", choices: ["A", "B", "C", "D"].map(id => ({ id, text: `Choice ${id}` })), correctChoiceId: "A", explanation: "A directly supports the stated claim.", incorrectChoiceExplanations: { C: "C supports a different claim." }, passage: { title: "Synthetic fixture", text: "First paragraph.\n\nSecond paragraph.", format: "prose" }, reviewNotes: [], visuals: [], ...extra });
const envelope = questions => ({ format: "nathan-tutors-shsatlab-ela-v1", questions });
const published = () => { const bank = importCaptures(empty(), envelope([capture()])).bank; return publishQuestion(bank, { id: bank.questions[0].id, question: capture(), verified: true }); };

test("verified 16 ELA topics: first 8 reading, last 8 editing; no Math units", () => {
  for (let unit = 1; unit <= 16; unit++) {
    const q = normalizeCapture(capture({ sourceUrl: `https://www.shsatlab.com/units/unit-${unit}/practice`, sourceUnit: unit, sourceTopic: labTopics[unit - 1] }));
    assert.equal(q.section, unit <= 8 ? "reading" : "revising_editing_a"); assert.equal(q.subject, "English");
    assert.equal(q.topic, unit === 6 ? "Text Structure & Purpose" : labTopics[unit - 1]);
  }
  for (const url of ["https://www.shsatlab.com/units/unit-17/practice", "https://www.shsatlab.com/math", "https://evil.com/units/unit-1/practice", "https://www.shsatlab.com.evil.com/units/unit-1/practice", "https://www.shsatlab.com/units/unit-0/practice", "https://www.shsatlab.com/units", "https://user@www.shsatlab.com/units/unit-1/practice"]) assert.throws(() => labUnit(url), /ELA only/);
  assert.throws(() => normalizeCapture(capture({ subject: "Math" })), /English/);
  assert.throws(() => normalizeCapture(capture({ sourceTopic: "Algebra" })), /taxonomy/);
});
test("unrevealed key and explanation are review drafts, never invented or published", () => {
  const q = capture({ correctChoiceId: "", explanation: "", incorrectChoiceExplanations: {} });
  const bank = importCaptures(empty(), envelope([q])).bank;
  assert.equal(bank.questions[0].correctChoiceId, ""); assert.equal(bank.questions[0].status, "draft");
  assert.throws(() => publishQuestion(bank, { id: bank.questions[0].id, question: q, verified: true }), /requires/);
  assert.throws(() => createBankSet(bank, { title: "Set", questionIds: [bank.questions[0].id] }), /published/);
});
test("recapture enriches drafts and deduplicates, conflicting keys reject transaction", () => {
  const bank = importCaptures(empty(), envelope([capture({ correctChoiceId: "", explanation: "", incorrectChoiceExplanations: {} })])).bank;
  const enriched = importCaptures(bank, envelope([capture()])); assert.equal(enriched.enriched, 1); assert.equal(enriched.bank.questions.length, 1);
  assert.equal(importCaptures(enriched.bank, envelope([capture()])).duplicates, 1);
  assert.throws(() => importCaptures(enriched.bank, envelope([capture({ correctChoiceId: "B" })])), /Conflicting/);
  assert.equal(bank.questions[0].correctChoiceId, "");
});
test("preserve paragraph/poem structure; review, answer and supporting-visual guards", () => {
  const q = capture({ passage: { title: "Poem", format: "poem", text: "    Indented first line\n  Second line\n\nLast stanza" } });
  const normalized = normalizeCapture(q);
  assert.equal(normalized.passage.text, q.passage.text);
  assert.deepEqual(bankPassage(normalized).lines.map(line => line.text), q.passage.text.split("\n"));
  const bank = importCaptures(empty(), envelope([q])).bank;
  assert.throws(() => publishQuestion(bank, { id: normalized.id, question: q }), /Review/);
  assert.throws(() => publishQuestion(bank, { id: normalized.id, question: { ...q, visuals: ["Required ELA diagram"] }, verified: true }), /visual is missing/);
  assert.throws(() => normalizeCapture({ ...q, visualImage: { src: "https://evil.com/image", alt: "x" } }), /Upload/);
  assert.throws(() => normalizeCapture({ ...q, choices: q.choices.slice(0, 3) }), /four/);
  assert.throws(() => normalizeCapture({ ...q, correctChoiceId: "Z" }), /included choice/);
});
test("published items and sets immutable; no duplicate members; kind practice, not passage", () => {
  const bank = published(), id = bank.questions[0].id;
  assert.throws(() => publishQuestion(bank, { id, question: capture(), verified: true }), /immutable/);
  assert.throws(() => createBankSet(bank, { title: "Set", questionIds: [id, id] }), /unique/);
  const withSet = createBankSet(bank, { title: "Set", questionIds: [id] });
  assert.equal(createBankSet(withSet, { title: "Set", questionIds: [id] }).sets.length, 1);
  const catalog = bankCatalog(withSet); assert.equal(catalog[0].kind, "practice"); assert.equal(catalog[0].contentSource, "SHSAT Lab");
  assert.equal(catalog[0].subject, "English"); assert.equal(bankPassageSet(withSet, withSet.sets[0].id).questions[0].explanation, "A directly supports the stated claim.\n\nC: C supports a different claim.");
  assert.equal(validateDraft({ kind: "practice", contentId: catalog[0].id, status: "assigned" }, catalog).questionTarget, null);
  assert.throws(() => validateDraft({ kind: "practice", contentId: catalog[0].id, status: "assigned", questionTarget: 10 }, catalog), /all their questions/);
});
test("server grading ignores forged browser key, requires full canonical set membership", () => {
  const bank = createBankSet(published(), { title: "Set", questionIds: [published().questions[0].id] }); const id = bank.questions[0].id, set = bank.sets[0].id;
  const answers = [{ questionId: id, selectedAnswerId: "C", correctAnswerId: "C", timeSpentSeconds: 18 }];
  const grade = gradeBankSet(bank, set, answers); assert.equal(grade[0].isCorrect, false); assert.equal(grade[0].correctAnswerId, "A");
  assert.throws(() => gradeBankSet(bank, set, []), /entire/); assert.throws(() => gradeBankSet(bank, set, [{ questionId: "foreign", selectedAnswerId: "A" }]), /included/);
  assert.throws(() => gradeBankSet(bank, set, [{ questionId: id, selectedAnswerId: "Z" }]), /included/);
});
test("topic practice shelves include published mixed-topic sets, resolve legacy skill names, and exclude unrelated or unfinished sets", () => {
  const q = published().questions[0];
  const questions = [q, { ...q, id: 'central', topic: 'Central Idea & Theme' }, { ...q, id: 'legacy', topic: 'Supporting Evidence' }, { ...q, id: 'draft', status: 'draft' }, { ...q, id: 'math', subject: 'Math' }];
  const sets = [
    { id: 'mixed', title: 'Mixed practice', subject: 'English', source: 'SHSAT Lab', questionIds: [q.id, 'central'] },
    { id: 'legacy-set', title: 'Evidence practice', subject: 'English', source: 'SHSAT Lab', questionIds: ['legacy'] },
    { id: 'unrelated', subject: 'English', questionIds: ['central'] },
    { id: 'draft-set', subject: 'English', questionIds: [q.id, 'draft'] },
    { id: 'missing', subject: 'English', questionIds: ['missing-question'] },
    { id: 'empty', subject: 'English', questionIds: [] },
    { id: 'math-set', subject: 'Math', questionIds: ['math'] },
  ];
  const bank = { revision: 1, questions, sets };
  assert.deepEqual(bankTopicCatalog(bank, 'Evidence & Support').map(set => set.id), ['mixed', 'legacy-set']);
  assert.deepEqual(bankTopicCatalog(bank, 'Supporting Evidence').map(set => set.id), ['mixed', 'legacy-set']);
  assert.deepEqual(bankTopicCatalog(bank, 'Central Idea & Theme').map(set => set.id), ['mixed', 'unrelated']);
  assert.equal(bankTopicCatalog(bank, 'Evidence & Support')[0].questionCount, 2);
  assert.equal(bankTopicCatalog(bank, 'Evidence & Support')[0].href, '/study-hall/shsat/library/mixed');
  assert.deepEqual(bankTopicCatalog(bank, 'Inference'), []);
});
test("publish all uses the single-question guards, leaves incomplete drafts with reasons, and preserves old publications", () => {
  const bank = published(); const old = structuredClone(bank.questions[0]);
  const incoming = [capture({ prompt: "Complete draft" }), capture({ prompt: "Missing answer", correctChoiceId: "" }), capture({ prompt: "Missing explanation", explanation: "" }), capture({ prompt: "Unknown difficulty", difficulty: "unknown" }), capture({ prompt: "Visual required", visuals: ["Figure required"] })];
  const drafts = importCaptures(bank, envelope(incoming)).bank; const original = structuredClone(drafts);
  const result = publishQuestions(drafts, { questionIds: drafts.questions.filter(q => q.status === "draft").map(q => q.id), verified: true });
  assert.equal(result.published, 1); assert.equal(result.skipped.length, 4);
  assert.ok(result.skipped.every(q => q.id && q.reason)); assert.deepEqual(drafts, original);
  assert.deepEqual(result.bank.questions[0], old); assert.equal(result.bank.questions.filter(q => q.status === "published").length, 2);
  assert.equal(result.bank.questions.find(q => q.prompt === "Missing answer").correctChoiceId, "");
});
test("publish all requires explicit review and unique existing ELA draft IDs; only requested drafts change", () => {
  const bank = importCaptures(empty(), envelope([capture({ prompt: "First draft" }), capture({ prompt: "Second draft" })])).bank;
  const id = bank.questions[0].id;
  for (const input of [{ questionIds: [id] }, { questionIds: [], verified: true }, { questionIds: [id, id], verified: true }, { questionIds: [id, "missing"], verified: true }]) assert.throws(() => publishQuestions(bank, input), /reviewed|unique|existing/);
  const result = publishQuestions(bank, { questionIds: [id], verified: true }); assert.equal(result.published, 1); assert.equal(result.bank.questions[1].status, "draft");
  assert.throws(() => publishQuestions(result.bank, { questionIds: [id], verified: true }), /Published questions/);
  const math = structuredClone(bank); math.questions[0].subject = "Math";
  assert.throws(() => publishQuestions(math, { questionIds: [id], verified: true }), /English/);
  const foreign = structuredClone(bank); foreign.questions[0].source = "Other source";
  assert.throws(() => publishQuestions(foreign, { questionIds: [id], verified: true }), /SHSAT Lab/);
});
test("bulk visual file failures remain drafts; valid uploaded visuals use normal publication validation", () => {
  const bank = importCaptures(empty(), envelope([capture({ prompt: "Has visual", visuals: ["Figure"], visualImage: { src: "/exam-images/fixture.png", alt: "Required figure" } })])).bank;
  const id = bank.questions[0].id;
  const missing = publishQuestions(bank, { questionIds: [id], verified: true }, { [id]: "Supporting visual file not found." });
  assert.equal(missing.published, 0); assert.equal(missing.bank.questions[0].status, "draft"); assert.match(missing.skipped[0].reason, /not found/);
  assert.equal(publishQuestions(bank, { questionIds: [id], verified: true }).published, 1);
});
test("bulk publishing handles more than one UI page and remains one persisted revision", async () => {
  const bank = importCaptures(empty(), envelope(Array.from({ length: 105 }, (_, i) => capture({ prompt: `Batch draft ${i + 1}` })))).bank;
  const result = publishQuestions(bank, { questionIds: bank.questions.map(q => q.id), verified: true });
  assert.equal(result.published, 105); assert.equal(result.skipped.length, 0); assert.ok(result.bank.questions.every(q => q.status === "published"));
  assert.ok(bank.questions.every(q => q.status === "draft"));
});
test("malformed mixed-source import is atomic and does not alter original", () => {
  const bank = empty(); assert.throws(() => importCaptures(bank, envelope([capture(), capture({ subject: "Math" })])), /English/); assert.equal(bank.questions.length, 0);
});
test("concurrent stale revisions cannot overwrite bank changes", async () => {
  const root = await mkdtemp(join(tmpdir(), "nathan-bank-qa-")); await mkdir(join(root, "server/data"), { recursive: true });
  // Initial-file creation uses the repository's file-edit tool in normal work; this isolated test writes only disposable fixtures.
  const { writeFile } = await import("node:fs/promises"); await writeFile(join(root, "server/data/question-bank.json"), JSON.stringify(empty()));
  try { const results = await Promise.allSettled([mutateBank(root, 0, b => importCaptures(b, envelope([capture()])).bank), mutateBank(root, 0, b => createBankSet(b, { title: "Lost", questionIds: [] }))]); assert.equal(results[0].status, "fulfilled"); assert.equal(results[1].status, "rejected"); assert.match(results[1].reason.message, /another window/); assert.equal(JSON.parse(await readFile(join(root, "server/data/question-bank.json"), "utf8")).questions.length, 1); }
  finally { await rm(root, { recursive: true }); }
});
