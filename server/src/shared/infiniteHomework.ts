import { generateCatalogQuestion, type PracticeGeneratorDefinition } from './practiceCatalog';
import { isExamQuestionCorrect, type SelectedAnswer } from './examGrading';
import type { ExamQuestion } from './examTypes';
import type { PlanAssignment } from './learningPlan';

export type HomeworkState = {
  seed: string; generators: PracticeGeneratorDefinition[]; index: number; streak: number; bestStreak: number; correct: number;
  last?: { revision: number; answer: SelectedAnswer; question: ExamQuestion; correct: boolean; at: string };
};
export type HomeworkView = {
  assignment: PlanAssignment; revision: number; streak: number; bestStreak: number; answered: number; correct: number;
  question: ExamQuestion | null; feedback: HomeworkState['last'] | null;
};
export function homeworkQuestion(state: HomeworkState) {
  const definition = state.generators[state.index % state.generators.length];
  const question = generateCatalogQuestion(definition, Math.floor(state.index / state.generators.length), state.seed);
  return { ...question, id: `homework-${state.index}` };
}
export function publicHomeworkQuestion(question: ExamQuestion): ExamQuestion {
  const safe = structuredClone(question);
  delete safe.correctChoiceId; delete safe.correctChoiceIds; delete safe.correctTextAnswers;
  delete safe.correctPointIds; delete safe.correctPlacements; delete safe.explanation; delete safe.explanationHtml;
  if (safe.numberLineResponse) safe.numberLineResponse = { ...safe.numberLineResponse, correctValue: null, correctDirection: "left", correctEndpoint: "open" };
  if (safe.dragDropSlots) safe.dragDropSlots = safe.dragDropSlots.map(slot => ({ ...slot, correctItemId: "" }));
  if (safe.dropdowns) safe.dropdowns = safe.dropdowns.map(dropdown => ({ ...dropdown, correctChoiceId: undefined }));
  return safe;
}
export function validHomeworkAnswer(answer: unknown): answer is SelectedAnswer {
  const text = (value: unknown) => typeof value === 'string' && value.length <= 2000;
  return text(answer) ? Boolean((answer as string).trim()) : Array.isArray(answer) ? answer.length > 0 && answer.length <= 100 && answer.every(text)
    : Boolean(answer && typeof answer === 'object' && Object.keys(answer).length > 0 && Object.keys(answer).length <= 100 && Object.values(answer).every(text));
}
export function gradeHomework(state: HomeworkState, revision: number, answer: SelectedAnswer, at = new Date().toISOString()): HomeworkState {
  const question = homeworkQuestion(state), correct = isExamQuestionCorrect(question, answer), streak = correct ? state.streak + 1 : 0;
  return { ...state, index: state.index + 1, streak, bestStreak: Math.max(state.bestStreak, streak), correct: state.correct + Number(correct), last: { revision, answer, question, correct, at } };
}
