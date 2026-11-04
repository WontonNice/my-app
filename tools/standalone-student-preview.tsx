import { ExamMathQuestion } from '../client/src/components/ExamMathQuestion';
import { ExamText } from '../client/src/components/ExamReviewQuestion';
import { InlineTextSelection } from '../client/src/components/InlineTextSelection';
import { SentenceDragDrop } from '../client/src/components/SentenceDragDrop';
import type { ExamQuestion } from '../server/src/shared/examTypes';
import type { SelectedAnswer } from '../server/src/shared/examGrading';

/** Use the player's response controls with the standalone ELA document layout. */
export function StandaloneStudentPreview({ question, answer, onChange }: {
  question: ExamQuestion; answer: SelectedAnswer; onChange: (answer: SelectedAnswer) => void;
}) {
  return <section className={question.selectionHtml ? 'exam-question-document is-text-selection-layout' : 'exam-standalone-document'} data-question-id={question.id}>
    {question.selectionHtml && <div className="exam-question-passage"><div className="exam-question-passage-scroll is-text-selection" aria-label="Question paragraph" tabIndex={0}>
      <InlineTextSelection question={question} answer={answer} onChange={onChange} />
    </div></div>}
    <form className={question.selectionHtml ? 'exam-question-panel' : `exam-standalone-panel${question.type === 'math_drag_drop' ? ' is-drag-drop' : ''}`} onSubmit={event => event.preventDefault()}>
      <h1><ExamText text={question.prompt} html={question.promptHtml} /></h1>
      {(question.stimulus || question.stimulusHtml) && <div className="exam-standalone-stimulus"><ExamText text={question.stimulus} html={question.stimulusHtml} /></div>}
      {(question.instructions || question.instructionsHtml) && <p className="exam-standalone-instructions"><ExamText text={question.instructions} html={question.instructionsHtml} /></p>}
      {question.selectionHtml ? null : question.type === 'transition_drop'
        ? <SentenceDragDrop question={question} answer={answer} onChange={onChange} />
        : <ExamMathQuestion question={question} answer={answer} onChange={onChange} responseOnly />}
    </form>
  </section>;
}
