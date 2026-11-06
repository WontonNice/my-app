import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { InlineTextSelection } from '../client/src/components/InlineTextSelection';
import type { ExamQuestion } from '../server/src/shared/examTypes';
import type { SelectedAnswer } from '../server/src/shared/examGrading';

function Preview({question}: {question: ExamQuestion}) {
  const [answer, setAnswer] = useState<SelectedAnswer>();
  return <InlineTextSelection question={question} answer={answer} onChange={setAnswer} scrollable={question.source?.sourceFormat === 'testnav'} />;
}

document.querySelectorAll<HTMLElement>('[data-hot-preview]').forEach(element => {
  const question: ExamQuestion = JSON.parse(element.dataset.hotPreview!);
  createRoot(element).render(<Preview question={question} />);
});
