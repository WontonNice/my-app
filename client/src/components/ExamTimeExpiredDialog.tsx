import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './ExamTimeExpiredDialog.css';

export function ExamTimeExpiredDialog({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const node = dialog.current;
    const preventDismiss = (event: Event) => event.preventDefault();
    node?.addEventListener('cancel', preventDismiss);
    node?.showModal();
    return () => { node?.removeEventListener('cancel', preventDismiss); node?.close(); };
  }, []);
  async function submit() {
    if (submitting.current) return;
    submitting.current = true; setBusy(true); setError('');
    try { await onSubmit(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not submit your answers. Please try again.'); }
    finally { submitting.current = false; setBusy(false); }
  }
  return createPortal(<dialog ref={dialog} className="exam-time-expired-dialog" aria-labelledby="exam-time-expired-title" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); } }} onCancel={event => event.preventDefault()}>
    <header><h2 id="exam-time-expired-title">Time Expired</h2></header>
    <div className="exam-time-expired-actions"><button autoFocus type="button" disabled={busy} onClick={() => { void submit(); }}>{busy ? 'Submitting…' : 'Submit Final Answers'}</button></div>
    {error && <p role="alert">{error}</p>}
  </dialog>, document.body);
}
