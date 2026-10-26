import type { ExamQuestion } from '../../../server/src/shared/examTypes';

export type MathDragSelection = { itemId: string; slotId?: string };

/** Move a particular tile instance; never overwrite another answer or invent an item. */
export function moveMathDragAnswer(
  question: Pick<ExamQuestion, 'items' | 'dragDropSlots' | 'allowReuse'>,
  answer: Record<string, string>,
  selection: MathDragSelection,
  destination?: string,
): Record<string, string> {
  if (!question.items?.some(item => item.id === selection.itemId)) return answer;
  if (selection.slotId && answer[selection.slotId] !== selection.itemId) return answer;
  if (destination && (!question.dragDropSlots?.some(slot => slot.id === destination) || answer[destination])) return answer;
  if (!destination && !selection.slotId) return answer;
  const next = { ...answer };
  if (selection.slotId) delete next[selection.slotId];
  if (destination) {
    if (!question.allowReuse) {
      Object.keys(next).forEach(slot => { if (next[slot] === selection.itemId) delete next[slot]; });
    }
    next[destination] = selection.itemId;
  }
  return next;
}
