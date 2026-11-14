import { useEffect, useState } from "react";
import { getAllExamCorrectionsAccess, setAllExamCorrectionsAccess } from "../lib/api";

export function TeacherCorrectionsAccess({ accessToken, onChange }: { accessToken: string; onChange: (open: boolean) => void }) {
  const [open, setOpen] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    getAllExamCorrectionsAccess(accessToken).then(value => {
      if (active) { setOpen(value.open); setError(""); }
    }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Correction access could not be loaded."); });
    return () => { active = false; };
  }, [accessToken, retry]);
  async function toggle() {
    if (open === null || saving) return;
    setSaving(true); setError("");
    try {
      const saved = await setAllExamCorrectionsAccess(accessToken, !open);
      setOpen(saved.open); onChange(saved.open);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Correction access could not be saved. Try again."); }
    finally { setSaving(false); }
  }
  return <section className="teacher-corrections-access" aria-label="Corrections for all exams">
    <div className="teacher-corrections-access-row">
      <div><strong id="all-exam-corrections-label">Open corrections for all exams</strong><p id="all-exam-corrections-help">Includes current and future exams, including partial submissions. Students must submit answers first. Turning this off restores per-exam and automatic access.</p></div>
      <button type="button" role="switch" aria-checked={open === true} aria-labelledby="all-exam-corrections-label" aria-describedby="all-exam-corrections-help" disabled={!accessToken || open === null || saving} onClick={() => void toggle()}><span className="teacher-corrections-switch" aria-hidden="true" /><span>{saving ? "Saving…" : open === null ? "Loading…" : open ? "On" : "Off"}</span></button>
    </div>
    <p className="teacher-corrections-access-status" role="status">{open === null ? "" : open ? "Corrections are open for submitted work across all exams." : "Per-exam and automatic correction access are in effect."}</p>
    {error && <p role="alert" className="exam-review-error">{error} {open === null && <button type="button" onClick={() => setRetry(value => value + 1)}>Retry</button>}</p>}
  </section>;
}
