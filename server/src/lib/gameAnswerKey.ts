import { isExamQuestionCorrect, type SelectedAnswer } from "../shared/examGrading";
import type { ExamQuestion } from "../shared/examTypes";

/** Test answers stay server-side and go through the normal grading rules. */
export function playtestAnswer(question: ExamQuestion, correct: boolean): SelectedAnswer {
  if (!correct) {
    const choice = question.choices?.find(item => !isExamQuestionCorrect(question, item.id));
    if (choice) return choice.id;
    let answer = "[playtest incorrect]";
    while (isExamQuestionCorrect(question, answer)) answer += "!";
    return answer;
  }
  let answer: SelectedAnswer | undefined;
  switch (question.type) {
    case "multiple_choice": answer = question.correctChoiceId; break;
    case "transition_drop": answer = question.dragDropSlots?.length ? Object.fromEntries(question.dragDropSlots.map(slot => [slot.id, slot.correctItemId])) : question.correctChoiceId; break;
    case "multi_select": answer = question.correctChoiceIds; break;
    case "graph_point_select": answer = question.correctPointIds; break;
    case "math_drag_drop": answer = Object.fromEntries((question.dragDropSlots ?? []).map(slot => [slot.id, slot.correctItemId ?? ""])); break;
    case "inline_dropdown": answer = Object.fromEntries((question.dropdowns ?? []).map(slot => [slot.id, slot.correctChoiceId ?? ""])); break;
    case "category_sort": case "matrix_choice": case "table_match": answer = question.correctPlacements; break;
    case "number_line_response": {
      const value = question.numberLineResponse;
      if (value) answer = { value: String(value.correctValue), direction: value.correctDirection, endpoint: value.correctEndpoint };
      break;
    }
    default: answer = question.correctTextAnswers?.[0];
  }
  if (!isExamQuestionCorrect(question, answer)) throw Object.assign(new Error("This question needs a valid answer key before a correct answer can be simulated."), { status: 400 });
  return answer!;
}

