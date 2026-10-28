// Browser regression fixture. The production exam page, API client, content,
// response state, navigation, persistence, and grading all run unchanged.
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { ExamMathQuestion } from '../client/src/components/ExamMathQuestion';
import { ExamTimeExpiredDialog } from '../client/src/components/ExamTimeExpiredDialog';
import { content20262027FormDMathSection } from '../client/src/content/exams/mathSets/2026-2027-form-dMath';
import { content20262027FormAMathSection } from '../client/src/content/exams/mathSets/2026-2027-form-aMath';
import type { SelectedAnswer } from '../server/src/shared/examGrading';
import { ExamSessionPage } from '../client/src/pages/ExamSessionPage';
import { ExamLaunchPage } from '../client/src/pages/ExamLaunchPage';
import '../client/src/styles/global.css';
const subject = new URLSearchParams(location.search).get('subject');
if (subject) sessionStorage.setItem(`exam-start-subject:${location.pathname.split('/')[2]}`, subject);
const questionId = new URLSearchParams(location.search).get('question');
const previewQuestion = [...content20262027FormDMathSection.questions, ...content20262027FormAMathSection.questions].find(question => question.id === questionId);
function QuestionPreview() {
  const [answer, setAnswer] = useState<SelectedAnswer>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const expired = new URLSearchParams(location.search).has('expired');
  return <div className="exam-session-shell is-math-session" style={{padding: 32}}>
    <ExamMathQuestion question={previewQuestion!} answer={answer} onChange={setAnswer} />
    {expired && !submitted && <ExamTimeExpiredDialog onSubmit={async () => { if (!attempted && new URLSearchParams(location.search).has('failOnce')) { setAttempted(true); throw new Error('Test save failed. Please try again.'); } setSubmitted(true); }} />}
    {submitted && <p role="status">Final answers submitted.</p>}
  </div>;
}
createRoot(document.getElementById('root')!).render(previewQuestion ? <QuestionPreview /> : location.pathname.endsWith('/launch') ? <ExamLaunchPage /> : <ExamSessionPage />);
