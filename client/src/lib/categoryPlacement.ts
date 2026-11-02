import type { ExamQuestion } from '../content/exams/types';

/** One placement rule for mouse, keyboard, drag-and-drop, and library controls. */
export function placeCategoryItem(question: ExamQuestion, current: Record<string, string>, itemId: string, categoryId: string) {
  if (!question.items?.some(item => item.id === itemId) || !question.categories?.some(category => category.id === categoryId)) return current;
  const next = question.requiredPlacements === 1 ? {} : { ...current };
  if (question.categoryCapacity === 1) for (const [id, category] of Object.entries(next)) {
    if (id !== itemId && category === categoryId) delete next[id];
  }
  next[itemId] = categoryId;
  if (question.requiredPlacements && Object.keys(next).length > question.requiredPlacements) return current;
  return next;
}
