import 'katex/dist/katex.min.css';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { ExamResponse } from '../client/src/components/ExamResponse';
import type { ExamQuestion } from '../server/src/shared/examTypes';
import type { SelectedAnswer } from '../server/src/shared/examGrading';

function Preview({question, standalone}: {question: ExamQuestion; standalone: boolean}) {
  const [answer, setAnswer] = useState<SelectedAnswer>('');
  return <ExamResponse question={question} answer={answer} onChange={setAnswer} standalone={standalone} />;
}

// An isolated response only; never writes to a question key or a student attempt.
document.querySelectorAll<HTMLElement>('[data-response-preview]').forEach(element => {
  try {
    const question: ExamQuestion = JSON.parse(element.dataset.responsePreview!);
    flushSync(() => createRoot(element).render(<Preview question={question} standalone={element.dataset.standalone === 'true'} />));
    element.dataset.responseReady = 'true';
  } catch {
    element.setAttribute('role', 'alert');
    element.textContent = 'The question preview could not load. Your draft is preserved; reopen the question to retry.';
  }
});
