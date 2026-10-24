import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./ExamSectionSubmission.css";

export function ExamSectionSubmission({ section, answered, total, disabled, finishesExam, onSubmit }: {
  section: "english" | "math"; answered: number; total: number; disabled: boolean; finishesExam?: boolean; onSubmit: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) dialog.current?.showModal(); }, [open]);
  const label = section === "math" ? "Math" : "English";
  return <>
    <button className="exam-speed-finish-button" disabled={disabled} onClick={() => { setError(""); setOpen(true); }} type="button">Submit {label}</button>
    {open && createPortal(<dialog ref={dialog} className="exam-attention-modal exam-section-submit-dialog" onCancel={() => setOpen(false)} aria-labelledby="section-submit-title">
      <header><h2 id="section-submit-title">{finishesExam ? `Submit ${label} and finish exam` : `Submit ${label} and finish later`}</h2></header>
      <p>{answered} of {total} questions answered. {total - answered > 0 ? `${total - answered} unanswered questions in ${label} will count as incorrect.` : `All ${label} questions are answered.`}</p>
      <p>{finishesExam ? "Your earlier section stays submitted. Your teacher can review both section scores and the completed exam." : "Your teacher can review this section immediately. The other section stays pending, and the shared three-hour timer pauses until you continue."}</p>
      {error && <p role="alert">{error}</p>}
      <div className="exam-attention-actions"><button autoFocus disabled={busy} onClick={() => setOpen(false)} type="button">Keep working</button><button disabled={busy} onClick={async () => { setBusy(true); setError(""); try { await onSubmit(); setOpen(false); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not submit. Try again."); } finally { setBusy(false); } }} type="button">{busy ? "Saving…" : `Submit ${label} & ${finishesExam ? "finish" : "pause"}`}</button></div>
    </dialog>, document.body)}
  </>;
}
