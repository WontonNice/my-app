import { createHash } from "node:crypto";
import { readFile, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";

// Verified from SHSATLab's ELA topic screen, October 5, 2026. No Math units or mappings.
export const labTopics = ["Central Idea & Theme", "Author's Point of View", "Word & Phrase Meaning", "Figurative Language & Imagery", "Tone & Mood", "Text Structure", "Evidence & Support", "Inference", "Sentence Structure", "Pronouns", "Verbs", "Modifiers", "Punctuation", "Word Choice & Precision", "Topic & Transitions", "Relevance & Conclusion"];
const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 24);
const text = (value, max = 100000, preserve = false) => { if (typeof value !== "string" || value.length > max) throw new Error("Invalid or oversized text field."); const normalized = value.replace(/\r\n?/g, "\n"); return preserve ? normalized : normalized.trim(); };
export function labUnit(url) {
  const parsed = new URL(url);
  const match = parsed.pathname.match(/^\/units\/unit-(\d+)\/practice\/?$/);
  if (parsed.protocol !== "https:" || !["shsatlab.com", "www.shsatlab.com"].includes(parsed.hostname) || parsed.username || parsed.password || parsed.port || !match || +match[1] < 1 || +match[1] > 16) throw new Error("SHSATLab capture is ELA only (verified units 1–16). Math and unknown pages cannot be imported.");
  return +match[1];
}
export function normalizeCapture(raw) {
  if (raw?.subject !== "English" || raw?.source !== "SHSAT Lab") throw new Error("This importer accepts Subject English / Source SHSAT Lab only. Use the separate Math editor for Math.");
  const unit = labUnit(raw.sourceUrl);
  if (raw.sourceUnit !== unit || raw.sourceTopic !== labTopics[unit - 1]) throw new Error("The captured unit and ELA topic do not match the verified source taxonomy.");
  const choices = raw.choices?.map((c, i) => ({ id: String.fromCharCode(65 + i), text: text(c.text, 20000) }));
  if (!Array.isArray(choices) || choices.length !== 4 || choices.some(c => !c.text) || raw.choices.some((c, i) => c.id !== choices[i].id)) throw new Error("Include exactly four choices in printed A–D order.");
  const prompt = text(raw.prompt, 20000); if (!prompt) throw new Error("Question wording is missing.");
  const correctChoiceId = text(raw.correctChoiceId ?? "", 1);
  if (correctChoiceId && !choices.some(c => c.id === correctChoiceId)) throw new Error("The answer key must reference an included choice.");
  let passage = null;
  if (raw.passage) { if (!["prose", "poem", "sentence_prose"].includes(raw.passage.format)) throw new Error("Choose a valid passage format."); passage = { title: text(raw.passage.title, 300), text: text(raw.passage.text, 100000, true), format: raw.passage.format }; if (!passage.text.trim()) throw new Error("Passage text is empty."); }
  if (unit <= 8 && !passage) throw new Error("Reading questions must include their passage.");
  const incorrectChoiceExplanations = {};
  for (const [id, value] of Object.entries(raw.incorrectChoiceExplanations ?? {})) { if (!choices.some(c => c.id === id) || id === correctChoiceId) throw new Error("Invalid wrong-choice explanation label."); incorrectChoiceExplanations[id] = text(value, 20000); }
  const strings = value => { if (!Array.isArray(value ?? []) || (value?.length ?? 0) > 100) throw new Error("Invalid review notes or visuals."); return (value ?? []).map(v => text(v, 5000)); };
  const item = { subject: "English", source: "SHSAT Lab", sourceUrl: `https://www.shsatlab.com/units/unit-${unit}/practice`, sourceUnit: unit, sourceTopic: labTopics[unit - 1],
    topic: unit === 6 ? "Text Structure & Purpose" : labTopics[unit - 1], section: unit <= 8 ? "reading" : "revising_editing_a",
    difficulty: ["easy", "medium", "hard", "elite"].includes(raw.difficulty) ? raw.difficulty : "unknown", prompt, choices, correctChoiceId,
    explanation: text(raw.explanation ?? ""), incorrectChoiceExplanations, passage, reviewNotes: strings(raw.reviewNotes), visuals: strings(raw.visuals),
    capturedAt: typeof raw.capturedAt === "string" && Number.isFinite(Date.parse(raw.capturedAt)) ? raw.capturedAt : new Date().toISOString(), status: "draft" };
  if (raw.visualImage) { if (!/^\/exam-images\/[\w.-]+\.(?:png|jpg|jpeg|webp|gif|svg|svgz)$/i.test(raw.visualImage.src) || !raw.visualImage.alt?.trim()) throw new Error("Upload a supporting visual through the editor and use its /exam-images/ path plus alt text."); item.visualImage = { src: raw.visualImage.src, alt: text(raw.visualImage.alt, 2000) }; }
  // Stable identity deliberately excludes revealed keys/explanations: recapturing enriches a draft, not a duplicate.
  return { ...item, id: `lab-q-${hash([item.subject, item.source, item.prompt, item.choices, item.passage?.text ?? ""])}` };
}
export function importCaptures(bank, envelope) {
  if (envelope?.format !== "nathan-tutors-shsatlab-ela-v1" || !Array.isArray(envelope.questions) || !envelope.questions.length || envelope.questions.length > 1000) throw new Error("Upload a SHSATLab ELA capture JSON containing 1–1,000 questions.");
  const incoming = envelope.questions.map(normalizeCapture); // All-or-nothing validation before changing the bank.
  const next = structuredClone(bank); let added = 0, enriched = 0, duplicates = 0;
  for (const q of incoming) {
    const old = next.questions.find(old => old.id === q.id);
    if (!old) { next.questions.push(q); added++; }
    else if (old.status === "draft" && (!old.correctChoiceId && q.correctChoiceId || !old.explanation && q.explanation)) { Object.assign(old, q, { correctChoiceId: old.correctChoiceId || q.correctChoiceId, explanation: old.explanation || q.explanation }); enriched++; }
    else { if (old.correctChoiceId && q.correctChoiceId && old.correctChoiceId !== q.correctChoiceId) throw new Error(`Conflicting answer key for ${q.id}. Existing content was not changed.`); duplicates++; }
  }
  return { bank: next, added, enriched, duplicates };
}
function reviewedQuestion(bank, input) {
  const old = bank.questions.find(q => q.id === input.id);
  if (!old || old.status !== "draft") throw new Error("Choose an unpublished draft. Published questions are immutable to protect saved assignments.");
  if (input.verified !== true) throw new Error("Review the passage, wording, choices, key, and explanation before publishing.");
  const q = normalizeCapture({ ...input.question, ...{ subject: old.subject, source: old.source, sourceUnit: old.sourceUnit, sourceUrl: old.sourceUrl, sourceTopic: old.sourceTopic } });
  if (!q.correctChoiceId || !q.explanation || q.difficulty === "unknown") throw new Error("Publishing requires a reviewed answer, explanation, and difficulty.");
  if (q.visuals.length && !q.visualImage) throw new Error("A required supporting visual is missing. Upload it first; do not publish an incomplete item.");
  if (q.id !== old.id && bank.questions.some(item => item.id === q.id)) throw new Error("This edited question already exists in the bank.");
  return { index: bank.questions.findIndex(q => q.id === old.id), question: { ...q, status: "published", reviewedAt: new Date().toISOString() } };
}
export function publishQuestion(bank, input) {
  const reviewed = reviewedQuestion(bank, input);
  const next = structuredClone(bank);
  next.questions[reviewed.index] = reviewed.question;
  return next;
}
export function publishQuestions(bank, input, visualErrors = {}) {
  if (input.verified !== true) throw new Error("Confirm that you reviewed every matching draft against its source before bulk publishing.");
  const ids = input.questionIds;
  if (!Array.isArray(ids) || !ids.length || ids.length > 1000 || ids.some(id => typeof id !== "string") || new Set(ids).size !== ids.length) throw new Error("Choose 1–1,000 unique draft questions to publish.");
  const questions = ids.map(id => bank.questions.find(q => q.id === id));
  if (questions.some(q => !q || q.status !== "draft" || q.subject !== "English" || q.source !== "SHSAT Lab")) throw new Error("Bulk publishing accepts only existing English / SHSAT Lab drafts. Published questions remain unchanged.");
  const next = structuredClone(bank); let published = 0; const skipped = [];
  for (const question of questions) {
    try {
      if (visualErrors[question.id]) throw new Error(visualErrors[question.id]);
      const reviewed = reviewedQuestion(next, { id: question.id, question, verified: true });
      next.questions[reviewed.index] = reviewed.question;
      published++;
    } catch (error) { skipped.push({ id: question.id, reason: error.message }); }
  }
  return { bank: next, published, skipped };
}
export function createBankSet(bank, input) {
  const title = text(input.title, 300); if (!title) throw new Error("Enter a practice-set title.");
  if (!Array.isArray(input.questionIds) || !input.questionIds.length || input.questionIds.length > 100 || new Set(input.questionIds).size !== input.questionIds.length) throw new Error("Select 1–100 unique questions.");
  const questions = input.questionIds.map(id => bank.questions.find(q => q.id === id && q.status === "published"));
  if (questions.some(q => !q) || questions.some(q => q.subject !== "English" || q.source !== "SHSAT Lab")) throw new Error("SHSATLab sets contain only published English questions from SHSAT Lab.");
  const id = `lab-set-${hash([title, input.questionIds])}`;
  const next = structuredClone(bank);
  if (!next.sets.some(set => set.id === id)) next.sets.push({ id, title, subject: "English", source: "SHSAT Lab", questionIds: [...input.questionIds], createdAt: new Date().toISOString() });
  return next;
}
export async function readBank(root) { return JSON.parse(await readFile(join(root, "server/data/question-bank.json"), "utf8")); }
let pending = Promise.resolve();
export function mutateBank(root, revision, transform) {
  const run = pending.then(async () => {
    const current = await readBank(root);
    if (revision !== current.revision) throw new Error("The question bank changed in another window. Reload it before saving.");
    const next = transform(current); next.revision = current.revision + 1;
    const path = join(root, "server/data/question-bank.json"); const temporary = `${path}.${process.pid}.tmp`;
    await writeFile(temporary, JSON.stringify(next, null, 2) + "\n"); await rename(temporary, path); return next;
  });
  pending = run.catch(() => {}); return run;
}
