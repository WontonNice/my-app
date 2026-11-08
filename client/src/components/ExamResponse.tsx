import formats from '../../../server/src/shared/teiFormats.json';
import type { ExamQuestion } from '../content/exams/types';
import type { SelectedAnswer } from '../../../server/src/shared/examGrading';
import { ExamMathQuestion, MatrixChoiceResponse } from './ExamMathQuestion';
import { InlineTextSelection } from './InlineTextSelection';
import { SentenceDragDrop } from './SentenceDragDrop';
import { CategoryResponse } from './CategoryResponse';

/** Dispatch only: renderers and their persisted answer contracts remain authoritative. */
export function ExamResponse({question, answer, onChange, standalone = false}: {
  question: ExamQuestion; answer?: SelectedAnswer; onChange: (answer: SelectedAnswer) => void; standalone?: boolean;
}) {
  const placements = answer && typeof answer === 'object' && !Array.isArray(answer) ? answer : {};
  if (question.selectionHtml) return <InlineTextSelection question={question} answer={answer} onChange={onChange} scrollable={question.source?.sourceFormat === 'testnav'} />;
  if (question.type === 'transition_drop') return <SentenceDragDrop question={question} answer={answer} onChange={onChange} />;
  if (question.type === 'matrix_choice') return <MatrixChoiceResponse question={question} answer={placements} onChange={onChange} />;
  if (question.type === 'category_sort' || question.type === 'table_match') return <CategoryResponse key={question.id} question={question} answer={placements} onChange={onChange} standalone={standalone} />;
  if (!formats.formats[question.type]?.publishable) return <p role="status">This writing response requires manual authoring and grading support before publication.</p>;
  return <ExamMathQuestion question={question} answer={answer} onChange={onChange} responseOnly />;
}
