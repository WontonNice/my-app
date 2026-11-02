import type { ExamQuestion } from '../../../../server/src/shared/examTypes';
import { ExamText } from '../../components/ExamReviewQuestion';

export function QuestionExplanation({ question }: { question: ExamQuestion }) {
  return <details className="mc-details"><summary>Worked explanation</summary>
    <div className="mc-worked-explanation"><ExamText text={question.explanation || 'No worked explanation saved.'} html={question.explanationHtml}/></div>
  </details>;
}
