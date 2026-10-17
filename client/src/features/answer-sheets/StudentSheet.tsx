import { useEffect, useRef, useState } from "react";
import { AppLink } from "../../components/AppLink";
import { sheetCounts, responseState } from "../../../../server/src/shared/answerSheets";
import { answerSheetApi, type Attempt, type ReleasedResult } from "./api";
import { AnswerSheetSync } from "./sync";
import { ResponseControl } from "./ResponseControl";
import { selectionLabel, rawAnswer } from "./responseLabels";

export function StudentSheet({ token, userId, assignmentId }: { token: string; userId: string; assignmentId: string }) {
  const [controller, setController] = useState<AnswerSheetSync | null>(null), [, render] = useState(0);
  const [error, setError] = useState(""), [locked, setLocked] = useState(false), [busy, setBusy] = useState(false), [review, setReview] = useState(false), [filter, setFilter] = useState("all");
  const active = useRef<AnswerSheetSync | null>(null), mounted = useRef(true);
  const [initialResult, setInitialResult] = useState<ReleasedResult | null>(null);
  const [sessionId] = useState(() => {
    const key = `nathan-tutors:answer-sheet-session:${userId}:${assignmentId}`;
    const reload = performance.getEntriesByType("navigation").some(entry => (entry as PerformanceNavigationTiming).type === "reload");
    try { const value = reload ? sessionStorage.getItem(key) || crypto.randomUUID() : crypto.randomUUID(); sessionStorage.setItem(key, value); return value; } catch { return crypto.randomUUID(); }
  });
  async function open(takeover = false) {
    setBusy(true); setError("");
    try {
      const api = answerSheetApi(token), value = await api.open(assignmentId, sessionId, takeover);
      if (!mounted.current) return;
      if (value.attempt.studentId !== userId) throw new Error("This attempt belongs to another account.");
      active.current?.stop(); setInitialResult(value.result);
      const sync = new AnswerSheetSync(value.attempt, sessionId, { save: input => api.save(assignmentId, input), submit: input => api.submit(assignmentId, input) }, localStorage, () => { if (mounted.current) render(value => value + 1); });
      active.current = sync; setController(sync); setLocked(false);
    } catch (error) { if (!mounted.current) return; setError(error instanceof Error ? error.message : "Could not open the answer sheet."); setLocked([409, 423].includes((error as { status?: number }).status ?? 0)); }
    finally { if (mounted.current) setBusy(false); }
  }
  useEffect(() => {
    mounted.current = true; void Promise.resolve().then(() => open());
    const online = () => { void active.current?.retry(); };
    const beforeUnload = (event: BeforeUnloadEvent) => { if (active.current?.hasPending) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("online", online); window.addEventListener("beforeunload", beforeUnload);
    return () => { mounted.current = false; active.current?.stop(); window.removeEventListener("online", online); window.removeEventListener("beforeunload", beforeUnload); };
    // The route is keyed by authenticated student and assignment; do not reopen on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId, assignmentId]);
  if (!controller) return <main className="as-shell"><AppLink href="/study-hall/shsat/assignments">← My assignments</AppLink><h1>Digital answer sheet</h1>{error ? <p role="alert" className="as-alert">{error}</p> : <p>Loading saved responses…</p>}<button disabled={busy} onClick={() => open(locked)}>{locked ? "Take over this attempt" : "Retry opening"}</button>{locked && <p>Taking over stops the other tab or device from saving. Its unsynced work stays on that device.</p>}</main>;
  const attempt: Attempt = controller.visible, counts = sheetCounts(attempt.sheet, attempt.answers, attempt.flags), submitted = attempt.status === "submitted";
  const result = controller.result ?? initialResult;
  const disabled = busy || submitted || Boolean(controller.submissionId) || controller.status === "Session conflict";
  const section = attempt.sheet.sections.find(section => section.id === attempt.sectionId) ?? attempt.sheet.sections[0];
  const jump = (sectionId: string, itemId?: string) => { controller.navigate(sectionId); setReview(false); setFilter("all"); if (itemId) requestAnimationFrame(() => document.getElementById(`as-item-${itemId}`)?.scrollIntoView({ block: "center", behavior: "smooth" })); };
  return <main className="as-shell as-student"><header className="as-page-heading"><div><AppLink href="/study-hall/shsat/assignments">← My assignments</AppLink><p>Digital answer sheet · paper/PDF test</p><h1>{attempt.sheet.title}</h1><span>{attempt.sheet.sourceVersion || "Teacher-provided test"}</span></div><div className="as-save" role="status"><strong>{controller.status}</strong><small>{controller.server.savedAt ? `Last server save: ${new Date(controller.server.savedAt).toLocaleTimeString()}` : ""}</small></div></header>
    {attempt.sheet.instructions && <p className="as-instructions">{attempt.sheet.instructions}</p>}{attempt.sheet.sourceUrl && <a href={attempt.sheet.sourceUrl} target="_blank" rel="noreferrer">Open teacher-provided source ↗</a>}
    {(error || controller.error) && <p role="alert" className="as-alert">{error || controller.error}</p>}
    {controller.recoveredUnsubmitted.length > 0 && <details className="as-alert"><summary>Recovered device answers not included in the submission</summary>{controller.recoveredUnsubmitted.map(change => { const source = attempt.sheet.sections.flatMap(section => section.items.map(item => ({ section, item }))).find(row => row.item.id === change.itemId); return source ? <div key={change.itemId}><strong>{source.section.title} · Question {source.item.number}</strong><pre className="as-full-answer">{rawAnswer(source.item, change.answer)}</pre>{change.flagged !== undefined && <small>{change.flagged ? "Flagged for review" : "Review flag cleared"}</small>}</div> : null; })}</details>}
    {controller.hasPending && !submitted && <p className="as-pending">Changes pending server confirmation. Unsynced answers are available only on this device. Keep this page open while reconnecting.</p>}
    {controller.recoveryConflict ? <div className="as-alert"><p>Recovered device answers conflict with newer server answers. Your recovered text is shown below for inspection.</p><button onClick={() => controller.chooseRecovery(true)}>Use these recovered answers</button><button onClick={() => controller.chooseRecovery(false)}>Keep server answers</button></div> : controller.status === "Session conflict" ? <button onClick={() => open(true)}>Reopen and explicitly take over</button> : null}
    <div className="as-summary"><span><b>{counts.answered}</b> answered</span><span><b>{counts.unanswered}</b> unanswered</span><span><b>{counts.attention}</b> need attention</span><span><b>{counts.flagged}</b> flagged</span></div>
    {attempt.submissions.length > 0 && <details className="as-submission-history"><summary>Saved submission history ({attempt.submissions.length})</summary>{attempt.submissions.map(submission => <details key={submission.id}><summary>{new Date(submission.at).toLocaleString()} · submission {submission.id}</summary>{attempt.sheet.sections.map(section => <section key={section.id}><h3>{section.title}</h3>{section.items.map(item => <div key={item.id}><strong>Question {item.number}</strong><pre className="as-full-answer">{rawAnswer(item, submission.answers[item.id]) || "(unanswered)"}</pre></div>)}</section>)}</details>)}</details>}
    {submitted ? <section className="as-confirmation"><h2>Submitted{result ? " — results released" : " — awaiting grading"}</h2><p>Your responses are stored on the server. Submission {attempt.submissions.at(-1)?.id} · {new Date(attempt.submissions.at(-1)!.at).toLocaleString()}</p>{result && <><strong>{result.answerSheet.grade.earned} / {result.answerSheet.grade.possible} points · key revision {result.answerSheet.grade.keyVersion}</strong><div className="as-table-wrap"><table><thead><tr><th>Question</th><th>Your exact response</th><th>Result</th><th>Points</th></tr></thead><tbody>{attempt.sheet.sections.flatMap(section => section.items.map(item => { const grade = result.answerSheet.grade.items.find(row => row.itemId === item.id); return <tr key={item.id}><td>{section.title} · {item.number}</td><td><pre>{rawAnswer(item, attempt.answers[item.id]) || "(unanswered)"}</pre></td><td>{grade?.status}</td><td>{grade?.earned} / {grade?.possible}</td></tr>; }))}</tbody></table></div></>}</section> : <>
      <nav className="as-sections" aria-label="Answer-sheet sections">{attempt.sheet.sections.map(item => <button type="button" key={item.id} aria-current={item.id === section.id ? "page" : undefined} onClick={() => jump(item.id)}>{item.title}<small>{item.items.filter(item => responseState(item, attempt.answers[item.id]) === "answered").length}/{item.items.length}</small></button>)}<button type="button" onClick={() => setReview(true)}>Review & submit</button></nav>
      {review ? <section className="as-panel"><h2>Review before submitting</h2><p>Check unresolved selections and use your paper/PDF booklet to verify answers. {attempt.sheet.allowUnanswered ? "You may explicitly submit unanswered items." : "Every item must be answered."}</p><div className="as-question-map">{attempt.sheet.sections.flatMap(section => section.items.map(item => <button key={item.id} className={`is-${responseState(item, attempt.answers[item.id])}`} onClick={() => jump(section.id, item.id)}>{section.title} · {item.number}<small>{responseState(item, attempt.answers[item.id])}{attempt.flags.includes(item.id) ? " · flagged" : ""}</small></button>))}</div><button className="as-primary" disabled={busy || counts.attention > 0 || !attempt.sheet.allowUnanswered && counts.unanswered > 0 || controller.status === "Session conflict"} onClick={async () => { setBusy(true); await controller.submit(true); setBusy(false); }}>{busy ? "Saving and submitting…" : controller.submissionId ? "Retry pending submission" : `Confirm & submit${counts.unanswered ? ` with ${counts.unanswered} unanswered` : ""}`}</button><button disabled={busy || Boolean(controller.submissionId)} onClick={() => setReview(false)}>Return to answers</button>{controller.submissionId && <p>Submission is pending. It will be confirmed only after the server acknowledges it.</p>}</section> : <section className="as-panel"><div className="as-section-heading"><h2>{section.title}</h2><label>Show<select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All questions</option><option value="unanswered">Unanswered</option><option value="attention">Needs attention</option><option value="flagged">Flagged for review</option></select></label></div>
      <div className="as-response-rows">{section.items.filter(item => filter === "all" || filter === "flagged" ? filter !== "flagged" || attempt.flags.includes(item.id) : responseState(item, attempt.answers[item.id]) === filter).map(item => <div className={`as-response-row is-${responseState(item, attempt.answers[item.id])}`} key={item.id} id={`as-item-${item.id}`}><div><strong>Question {item.number}</strong><small>{selectionLabel(item)}</small><small>{responseState(item, attempt.answers[item.id])}</small></div><ResponseControl item={item} value={attempt.answers[item.id]} disabled={disabled} onChange={answer => controller.edit(item.id, answer)} /><button className="as-flag" aria-pressed={attempt.flags.includes(item.id)} disabled={disabled} onClick={() => controller.edit(item.id, undefined, !attempt.flags.includes(item.id))} aria-label={`Flag question ${item.number} for review`}>{attempt.flags.includes(item.id) ? "★ Flagged" : "☆ Flag"}</button></div>)}</div></section>}
      <footer className="as-footer"><span>{controller.status}{controller.hasPending ? " · Changes pending" : ""}</span><button disabled={disabled} onClick={() => setReview(true)}>Review & submit →</button></footer>
    </>}
  </main>;
}
