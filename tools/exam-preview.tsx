import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamSessionPage, type ExamPreviewSession } from '../client/src/pages/ExamSessionPage';
import { createExamPreviewSession } from './exam-preview-content';
import '../client/src/styles/global.css';

function ExamPreview() {
  const [session, setSession] = useState<ExamPreviewSession>();
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(location.search);
    const id = params.get('assessmentId');
    if (!id) { setError('Choose an exam in Content Studio to view it.'); return; }
    fetch('/api/exams/' + encodeURIComponent(id) + '/preview' + (params.get('draft')==='1'?'?draft=1':''), { signal: controller.signal, cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('The saved exam could not be loaded. Close this view and reopen it to retry.');
        return response.json();
      })
      .then(content => {
        if (!controller.signal.aborted) setSession(createExamPreviewSession(content, params.get('subject') === 'math' ? 'math' : 'english',
          () => parent.postMessage({ type: 'studio:exam-preview-close' }, location.origin)));
      })
      .catch(error => { if (!controller.signal.aborted) setError(error.message); });
    return () => controller.abort();
  }, []);
  if (error) return <main className="loading-shell" role="alert">{error}</main>;
  if (!session) return <main className="loading-shell" role="status">Loading saved exam…</main>;
  return <ExamSessionPage previewSession={session} />;
}
createRoot(document.getElementById('root')!).render(<ExamPreview />);
