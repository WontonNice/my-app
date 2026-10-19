import { useEffect, useRef, useState } from "react";
import { AppLink } from "../../components/AppLink";
import { sheetCounts, responseState } from "../../../../server/src/shared/answerSheets";
import { answerSheetApi, type Attempt, type ReleasedResult } from "./api";
import { AnswerSheetSync } from "./sync";
import { ResponseControl } from "./ResponseControl";
import { parseAnswerColumn } from "./pasteAnswers";
import { selectionLabel, rawAnswer } from "./responseLabels";

export function StudentSheet({ token, userId, assignmentId }: { token: string; userId: string; assignmentId: string }) {
  const [controller, setController] = useState<AnswerSheetSync | null>(null), [, render] = useState(0);
  const [error, setError] = useState(""), [locked, setLocked] = useState(false), [busy, setBusy] = useState(false), [review, setReview] = useState(false), [filter, setFilter] = useState("all");
  const [pasting, setPasting] = useState(false), [pasteText, setPasteText] = useState("");
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
  const jump = (sectionId: string, itemId?: string) => {
    controller.navigate(sectionId); setReview(false); setFilter("all"); setPasting(false);
    if (itemId) requestAnimationFrame(() => document.getElementById(`as-item-${itemId}`)?.scrollIntoView({ block: "center" }));
  };
  const paste = parseAnswerColumn(section.items, pasteText);
  const visibleItems = section.items.filter(item => filter === "all" || (filter === "flagged" ? attempt.flags.includes(item.id) : responseState(item, attempt.answers[item.id]) === filter));
  return <main className="as-shell as-student as-spreadsheet">
    <header className="as-sheet-heading">
      <div><AppLink href="/study-hall/shsat/answer-sheets">← Answer sheets</AppLink><h1>{attempt.sheet.title}</h1><span>{attempt.sheet.sourceVersion || "Paper / PDF test"}</span></div>
      <div className="as-sheet-heading-actions"><span className="as-save-status" role="status" title={controller.server.savedAt ? `Last server save: ${new Date(controller.server.savedAt).toLocaleString()}` : undefined}>{controller.status}</span>{!submitted && <button className="as-primary" disabled={busy} onClick={() => { setReview(true); setPasting(false); }}>Review & submit</button>}</div>
    </header>
    {(attempt.sheet.instructions || attempt.sheet.sourceUrl) && <details className="as-source"><summary>Test instructions & source</summary><p className="as-instructions">{attempt.sheet.instructions}</p>{attempt.sheet.sourceUrl && <a href={attempt.sheet.sourceUrl} target="_blank" rel="noreferrer">Open paper / PDF source ↗</a>}</details>}
    {(error || controller.error) && <p role="alert" className="as-alert">{error || controller.error}</p>}
    {controller.recoveredUnsubmitted.length > 0 && <details className="as-alert"><summary>Recovered device answers not included in the submission</summary>{controller.recoveredUnsubmitted.map(change => { const source = attempt.sheet.sections.flatMap(section => section.items.map(item => ({ section, item }))).find(row => row.item.id === change.itemId); return source ? <div key={change.itemId}><strong>{source.section.title} · Question {source.item.number}</strong><pre className="as-full-answer">{rawAnswer(source.item, change.answer)}</pre></div> : null; })}</details>}
    {controller.hasPending && !submitted && <p className="as-pending">Changes pending. Keep this page open until the server confirms Saved. Unsynced answers are available only on this device.</p>}
    {controller.recoveryConflict ? <div className="as-alert"><p>Recovered device answers conflict with newer server answers. Inspect the recovered answers below before choosing.</p><button onClick={() => controller.chooseRecovery(true)}>Use recovered answers</button><button onClick={() => controller.chooseRecovery(false)}>Keep server answers</button></div> : controller.status === "Session conflict" ? <button onClick={() => open(true)}>Reopen and explicitly take over</button> : null}
    {submitted ? <section className="as-confirmation"><h2>{result ? "Results released" : "Submitted — awaiting grading"}</h2><p>Your answers were submitted on {new Date(attempt.submissions.at(-1)!.at).toLocaleString()}.</p>{result && <strong>{result.answerSheet.grade.earned} / {result.answerSheet.grade.possible} points</strong>}<div className="as-table-wrap"><table><thead><tr><th>Question</th><th>Your answer</th>{result && <th>Result</th>}</tr></thead><tbody>{attempt.sheet.sections.flatMap(section => section.items.map(item => { const grade = result?.answerSheet.grade.items.find(row => row.itemId === item.id); return <tr key={item.id}><td>{section.title} · {item.number}</td><td><pre>{rawAnswer(item, attempt.answers[item.id]) || "(unanswered)"}</pre></td>{result && <td>{grade?.status} · {grade?.earned}/{grade?.possible}</td>}</tr>; }))}</tbody></table></div></section> : review ? <section className="as-panel">
      <h2>Ready to submit?</h2><p>{counts.answered} answered · {counts.unanswered} blank · {counts.attention} need attention · {counts.flagged} flagged.</p><p>{attempt.sheet.allowUnanswered ? "Blank answers are allowed. Check them before confirming." : "Answer every question before submitting."}</p>
      <div className="as-question-map">{attempt.sheet.sections.flatMap(section => section.items.map(item => <button key={item.id} className={`is-${responseState(item, attempt.answers[item.id])}`} onClick={() => jump(section.id, item.id)}>{section.title} · {item.number}<small>{responseState(item, attempt.answers[item.id])}{attempt.flags.includes(item.id) ? " · flagged" : ""}</small></button>))}</div>
      <div className="as-actions"><button onClick={() => setReview(false)} disabled={busy || Boolean(controller.submissionId)}>Back to answers</button><button className="as-primary" disabled={busy || counts.attention > 0 || !attempt.sheet.allowUnanswered && counts.unanswered > 0 || controller.status === "Session conflict"} onClick={async () => { setBusy(true); await controller.submit(true); setBusy(false); }}>{busy ? "Saving and submitting…" : controller.submissionId ? "Retry pending submission" : `Confirm & submit${counts.unanswered ? ` with ${counts.unanswered} blank` : ""}`}</button></div>
      {controller.submissionId && <p>Submission is pending server confirmation.</p>}
    </section> : <>
      <div className="as-grid-toolbar"><div><strong>{counts.answered}</strong> answered <span>· {counts.unanswered} blank{counts.attention ? ` · ${counts.attention} need attention` : ""}</span></div><div><button disabled={disabled} onClick={() => setPasting(!pasting)}>Paste answer column</button><label><span className="sr-only">Show questions</span><select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All questions</option><option value="unanswered">Blank</option><option value="attention">Needs attention</option><option value="flagged">Flagged</option></select></label></div></div>
      {pasting && <section className="as-paste-panel" aria-label="Paste answer column"><h2>Paste answers for {section.title}</h2><p>One answer per row, starting at question {section.items[0].number}. For multiple selections, use commas (A, C). Blank rows clear answers. Quoted multiline cells from spreadsheets are supported; you can also paste explanations directly into their answer cell.</p><textarea aria-label="Answer column" rows={5} value={pasteText} onChange={event => setPasteText(event.target.value)} placeholder={"A\nB\nA, C\n0"} />{paste.errors.map(error => <p role="alert" key={error}>{error}</p>)}{pasteText && !paste.errors.length && <p>{paste.changes.length} answers ready: {paste.changes.slice(0, 6).map(change => rawAnswer(section.items.find(item => item.id === change.itemId)!, change.answer) || "(blank)").join(" · ")}{paste.changes.length > 6 ? "…" : ""}</p>}<div className="as-actions"><button onClick={() => setPasting(false)}>Cancel</button><button className="as-primary" disabled={disabled || !pasteText || paste.errors.length > 0} onClick={() => { paste.changes.forEach(change => controller.edit(change.itemId, change.answer)); setPasteText(""); setPasting(false); }}>Apply {paste.changes.length} answers</button></div></section>}
      <div className="as-answer-grid" onKeyDown={event => {
        if (!event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
        const rows = [...event.currentTarget.querySelectorAll<HTMLTableRowElement>("tbody tr")], current = (event.target as HTMLElement).closest("tr");
        const next = rows[rows.indexOf(current as HTMLTableRowElement) + (event.key === "ArrowDown" ? 1 : -1)];
        if (next) { event.preventDefault(); next.querySelector<HTMLElement>("input,textarea,select")?.focus(); }
      }}><table aria-label={`${section.title} answer sheet`}><thead><tr><th scope="col">Question</th><th scope="col">Your answer</th><th scope="col">Review</th></tr></thead><tbody>{visibleItems.map(item => {
        const state = responseState(item, attempt.answers[item.id]);
        return <tr className={`is-${state}`} key={item.id} id={`as-item-${item.id}`}><th scope="row"><strong>{item.number}</strong><small>{selectionLabel(item)}</small>{state === "attention" && <small className="as-attention-label">Check selection count</small>}</th><td><ResponseControl item={item} value={attempt.answers[item.id]} disabled={disabled} onChange={answer => controller.edit(item.id, answer)} compact /></td><td><button className="as-flag" aria-pressed={attempt.flags.includes(item.id)} disabled={disabled} onClick={() => controller.edit(item.id, undefined, !attempt.flags.includes(item.id))} aria-label={`Flag question ${item.number} for review`}>{attempt.flags.includes(item.id) ? "★" : "☆"}</button></td></tr>;
      })}</tbody></table>{!visibleItems.length && <p className="as-library-empty">No questions match this filter.</p>}</div>
      <footer className="as-sheet-tabs"><nav aria-label="Answer-sheet sections">{attempt.sheet.sections.map(item => <button type="button" key={item.id} aria-current={item.id === section.id ? "page" : undefined} onClick={() => jump(item.id)}>{item.title}</button>)}</nav><small>Tab between cells · Alt + ↑ / ↓ between rows</small></footer>
    </>}
    {attempt.submissions.length > 0 && <details className="as-submission-history"><summary>Earlier submissions ({attempt.submissions.length})</summary>{attempt.submissions.map(submission => <details key={submission.id}><summary>{new Date(submission.at).toLocaleString()}</summary>{attempt.sheet.sections.map(section => <section key={section.id}><h3>{section.title}</h3>{section.items.map(item => <div key={item.id}><strong>Question {item.number}</strong><pre className="as-full-answer">{rawAnswer(item, submission.answers[item.id]) || "(unanswered)"}</pre></div>)}</section>)}</details>)}</details>}
  </main>;
}
