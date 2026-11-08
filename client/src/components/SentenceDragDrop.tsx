import type { ExamQuestion } from '../content/exams/types';
import type { SelectedAnswer } from '../lib/examResults';
import { MathDragDropResponse } from './ExamMathQuestion';

/** Adapt stored sentence-blank answers to the existing TestNav drag-and-drop control. */
export function SentenceDragDrop({ question, answer, onChange }: { question: ExamQuestion; answer?: SelectedAnswer; onChange: (answer: SelectedAnswer) => void }) {
  const modern = Boolean(question.dragDropSlots?.length);
  const slots = modern ? question.dragDropSlots! : [{ id: 'blank-1', correctItemId: question.correctChoiceId || '' }];
  const values = answer && typeof answer === 'object' && !Array.isArray(answer) ? answer
    : typeof answer === 'string' && answer && slots.length === 1 ? { [slots[0].id]: answer } : {};
  const content = modern ? question.dragDropContent || [] : [
    [question.transitionSentenceNumber, question.transitionBlankBefore, '{{blank-1}}', question.transitionBlankAfter].filter(Boolean).join(' '),
  ];
  return <div className="exam-sentence-response"><MathDragDropResponse question={{ ...question, type: 'math_drag_drop', items: question.choices || [], dragDropStyle: question.dragDropStyle || 'outlined', dragDropSlots: slots, dragDropContent: content }}
    answer={values} onChange={next => onChange(modern ? next : next['blank-1'] || '')} /></div>;
}
