import type { ExamContent, ExamQuestion } from './examTypes';
import { getAllExamQuestions, type ExamResult, type SelectedAnswer } from './examGrading';
import { isFullExamResult } from './examCompletion';
import { isMathAnswerComplete } from './mathAnswer';

function answered(question: ExamQuestion, answer: SelectedAnswer | undefined): boolean {
  const ids = Array.isArray(answer) ? answer : typeof answer === 'string' && answer.trim() ? [answer] : [];
  const placements = answer && typeof answer === 'object' && !Array.isArray(answer) ? answer : {};
  const choices = question.choices ?? [];
  if (question.type === 'multiple_choice' || question.type === 'transition_drop' && !question.dragDropSlots?.length)
    return typeof answer === 'string' && choices.some(choice => choice.id === answer);
  if (question.type === 'multi_select' || question.type === 'graph_point_select') {
    const available = question.type === 'graph_point_select' ? question.graph?.points ?? [] : choices;
    const required = question.requiredSelections ?? (question.type === 'graph_point_select' ? question.correctPointIds?.length ?? 1 : question.correctChoiceIds?.length ?? 2);
    return required > 0 && new Set(ids).size === required && ids.every(id => available.some(item => item.id === id));
  }
  if (question.type === 'math_drag_drop' || question.type === 'transition_drop') {
    const slots = question.dragDropSlots ?? [];
    const items = question.type === 'transition_drop' ? choices : question.items ?? [];
    if (question.type === 'transition_drop' && slots.length === 1 && typeof answer === 'string') return items.some(item => item.id === answer);
    return slots.length > 0 && slots.every(slot => items.some(item => item.id === placements[slot.id]));
  }
  if (question.type === 'inline_dropdown') return Boolean(question.dropdowns?.length) && question.dropdowns!.every(dropdown => dropdown.options.some(option => option.id === placements[dropdown.id]));
  if (['category_sort', 'matrix_choice', 'table_match'].includes(question.type)) {
    const valid = (question.items ?? []).filter(item => (question.categories ?? []).some(category => category.id === placements[item.id]));
    const required = question.requiredPlacements ?? question.items?.length ?? 0;
    return required > 0 && valid.length >= required;
  }
  if (question.type === 'number_line_response') return ['left','right'].includes(placements.direction) && ['open','closed'].includes(placements.endpoint) && typeof placements.value === 'string' && placements.value.trim() !== '' && Number.isFinite(Number(placements.value));
  if (['numeric_entry','expression_entry','grid_in'].includes(question.type)) return typeof answer === 'string' && isMathAnswerComplete(answer);
  return (question.type === 'short_response' || question.type === 'essay') && typeof answer === 'string' && answer.trim().length > 0;
}

/** Access belongs to this submitted attempt, without opening the exam for classmates. */
export function hasFullyAnsweredExam(result: ExamResult | null | undefined, content: ExamContent | undefined = result?.analysisContent): boolean {
  if (!result || result.source === 'answer_sheet' || result.source === 'manual' || !isFullExamResult(result) || !result.answers || !content) return false;
  const questions = getAllExamQuestions(content);
  return questions.length > 0 && result.total === questions.length && questions.every(question => answered(question, result.answers[question.id]));
}
