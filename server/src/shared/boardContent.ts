import type { ExamPassage, ExamPassageDirections, ExamQuestion } from "./examTypes";
import type { BoardReference } from "./boards";

export type BoardContent = {
  reference: BoardReference; title: string; href: string; prompt?: string;
  choices?: { id: string; text?: string; html?: string }[]; passage?: string; skill?: string;
  viewer?: { passage?: ExamPassage; directions?: ExamPassageDirections; questions: ExamQuestion[] };
};

// Explicit public presentation fields: never copy answer keys or explanations,
// including the answers nested inside dropdowns and response specifications.
export function boardQuestion(source: ExamQuestion): ExamQuestion {
  const fields = ["id", "type", "topic", "prompt", "promptHtml", "instructions", "instructionsHtml", "stimulus", "stimulusHtml", "image", "graph", "choices", "items", "categories", "tableHeaders", "dropdownContent", "dragDropContent", "entryLayout", "requiredSelections", "requiredPlacements", "allowReuse", "categoryCapacity", "transitionBlankAfter", "transitionBlankBefore", "transitionSentenceNumber"] as const;
  const question: ExamQuestion = { ...Object.fromEntries(fields.filter(key => source[key] !== undefined).map(key => [key, source[key]])), id: source.id, type: source.type, topic: source.topic, prompt: source.prompt };
  if (source.dropdowns) question.dropdowns = source.dropdowns.map(({ id, options }) => ({ id, options }));
  // These legacy rendering types require answer fields. At the HTTP boundary
  // omit them entirely; the viewer is read-only and never grades responses.
  if (source.dragDropSlots) question.dragDropSlots = source.dragDropSlots.map(({ id }) => ({ id })) as ExamQuestion["dragDropSlots"];
  if (source.numberLineResponse) {
    const { min, max, tickStep, labelStep } = source.numberLineResponse;
    question.numberLineResponse = { min, max, tickStep, labelStep } as ExamQuestion["numberLineResponse"];
  }
  return question;
}
