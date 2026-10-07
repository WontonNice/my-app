import type { ExamPassage, ExamPassageSet } from "./examTypes";
import type { PlanContent } from "./learningPlan";

export type BankSubject = "English" | "Math";
export type BankQuestion = {
  id: string; subject: BankSubject; source: string; sourceUrl: string; sourceUnit: number;
  sourceTopic: string; topic: string; section: "reading" | "revising_editing_a";
  difficulty: "easy" | "medium" | "hard" | "elite" | "unknown";
  prompt: string; choices: { id: string; text: string }[]; correctChoiceId: string;
  explanation: string; incorrectChoiceExplanations: Record<string, string>;
  passage: { title: string; text: string; format: "prose" | "poem" | "sentence_prose" } | null;
  reviewNotes: string[]; visuals: string[]; visualImage?: { src: string; alt: string };
  status: "draft" | "published"; capturedAt: string; reviewedAt?: string;
};
export type BankSet = { id: string; title: string; subject: BankSubject; source: string; questionIds: string[]; createdAt: string };
export type QuestionBank = { revision: number; questions: BankQuestion[]; sets: BankSet[] };
export const labElaTopics = ["Central Idea & Theme", "Author's Point of View", "Word & Phrase Meaning", "Figurative Language & Imagery", "Tone & Mood", "Text Structure & Purpose", "Evidence & Support", "Inference", "Sentence Structure", "Pronouns", "Verbs", "Modifiers", "Punctuation", "Word Choice & Precision", "Topic & Transitions", "Relevance & Conclusion"];
export const canonicalElaTopic = (topic: string) => topic === "Supporting Evidence" ? "Evidence & Support" : topic === "Vocabulary in Context" ? "Word & Phrase Meaning" : topic === "Text Structure" ? "Text Structure & Purpose" : topic;
export function bankCatalog(bank: QuestionBank): PlanContent[] {
  return bank.sets.map(set => {
    const questions = set.questionIds.map(id => bank.questions.find(q => q.id === id)!);
    return { id: set.id, kind: "practice", title: set.title, href: `/study-hall/shsat/library/${set.id}`,
      subject: set.subject, contentSource: set.source, practiceMode: "bank_set", category: "ELA question-bank set",
      skills: [...new Set(questions.map(q => q.topic))], questionCount: questions.length, aliases: [set.id] };
  });
}
/** Published sets belong on each topic represented by their questions. */
export function bankTopicCatalog(bank: QuestionBank, topic: string): PlanContent[] {
  const published = new Map(bank.questions.filter(question => question.subject === "English" && question.status === "published").map(question => [question.id, question]));
  const eligible = bank.sets.filter(set => set.subject === "English" && set.questionIds.length > 0 && set.questionIds.every(id => published.has(id)));
  return bankCatalog({ ...bank, sets: eligible }).filter(set => set.skills.some(skill => canonicalElaTopic(skill) === canonicalElaTopic(topic)));
}
export function bankPassage(question: BankQuestion): ExamPassage {
  const passage = question.passage;
  return { id: `${question.id}-passage`, title: passage?.title || "Question context", format: passage?.format ?? "prose",
    lines: passage ? passage.text.split(passage.format === "poem" ? "\n" : /\n\s*\n/).map(text => ({ text })) : [],
    sourceNote: question.source,
  };
}
export function bankPassageSet(bank: QuestionBank, id: string): ExamPassageSet | undefined {
  const set = bank.sets.find(set => set.id === id);
  if (!set) return;
  const questions = set.questionIds.map(id => bank.questions.find(q => q.id === id)!);
  return { id: set.id, passage: { id: set.id, title: set.title, lines: [] }, questionCount: questions.length,
    label: `${set.source} · ${set.subject}`, directions: { title: set.title, subject: set.subject, body: "Read each question and its accompanying passage. Choose one answer." },
    questions: questions.map(q => ({ id: q.id, type: "multiple_choice", topic: q.topic, prompt: q.prompt, choices: q.choices,
      correctChoiceId: q.correctChoiceId, explanation: [q.explanation, ...Object.entries(q.incorrectChoiceExplanations).map(([id, text]) => `${id}: ${text}`)].join("\n\n"),
      image: q.visualImage, points: 1 })),
  };
}
/** Reject partial sets, duplicate IDs, and forged answer keys. Never grade client-supplied keys. */
export function gradeBankSet(bank: QuestionBank, setId: string, input: unknown) {
  const set = bank.sets.find(set => set.id === setId);
  if (!set || !Array.isArray(input) || input.length !== set.questionIds.length) throw new Error("Complete the entire saved practice set.");
  const rows = input as Record<string, unknown>[];
  if (new Set(rows.map(q => q?.questionId)).size !== rows.length) throw new Error("Duplicate question responses.");
  return set.questionIds.map((id, index) => {
    const q = bank.questions.find(q => q.id === id && q.status === "published")!;
    const answer = rows.find(row => row?.questionId === id);
    if (!q || !answer || !q.choices.some(choice => choice.id === answer.selectedAnswerId)) throw new Error("Choose an included answer for every question.");
    return { questionId: id, questionNumber: index + 1, correctAnswerId: q.correctChoiceId,
      selectedAnswerId: String(answer.selectedAnswerId), isCorrect: answer.selectedAnswerId === q.correctChoiceId,
      timeSpentSeconds: typeof answer.timeSpentSeconds === "number" && Number.isFinite(answer.timeSpentSeconds) ? Math.max(0, Math.min(86400, Math.round(answer.timeSpentSeconds))) : 0 };
  });
}
