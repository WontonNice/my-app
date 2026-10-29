import type { ExamQuestion } from "../content/exams";
import type { SelectedAnswer } from "./examResults";

export function correctExamAnswer(question: ExamQuestion): SelectedAnswer | undefined {
  if (question.type === 'transition_drop' && question.dragDropSlots?.length) return Object.fromEntries(question.dragDropSlots.map(slot => [slot.id, slot.correctItemId]));
  if (question.correctChoiceId) return question.correctChoiceId;
  if (question.correctChoiceIds) return question.correctChoiceIds;
  if (question.correctPointIds) return question.correctPointIds;
  if (question.correctTextAnswers) return question.correctTextAnswers.join(" or ");
  if (question.correctPlacements) return question.correctPlacements;
  if (question.dropdowns) return Object.fromEntries(question.dropdowns.map(dropdown => [dropdown.id, dropdown.correctChoiceId ?? ""]));
  if (question.dragDropSlots) return Object.fromEntries(question.dragDropSlots.map(slot => [slot.id, slot.correctItemId]));
  if (question.numberLineResponse) return { direction: question.numberLineResponse.correctDirection, endpoint: question.numberLineResponse.correctEndpoint, value: String(question.numberLineResponse.correctValue) };
}
