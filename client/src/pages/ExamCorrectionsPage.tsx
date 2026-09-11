import { useEffect, useState } from "react";
import { ExamReviewQuestion } from "../components/ExamReviewQuestion";
import { getExamCorrectionView, submitExamCorrections } from "../lib/api";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { peekActiveSession } from "../lib/sessionCache";
import { validateCorrections, type CorrectionResponse, type ExamCorrectionView } from "../../../server/src/shared/examCorrections";

export function ExamCorrectionsPage() {
  const { accessToken } = useStudentPortalAccess();
  const assessmentId = decodeURIComponent(window.location.pathname.split("/")[2] ?? "");
  const [view, setView] = useState<ExamCorrectionView | null>(null);
  const [draft, setDraft] = useState<Record<string, CorrectionResponse>>({});
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [draftNotice, setDraftNotice] = useState("");
  const [reload, setReload] = useState(0);
  const draftKey = `exam-corrections:${peekActiveSession()?.user.id}:${assessmentId}:${view?.resultVersion}`;

  useEffect(() => {
    if (!accessToken) return;
    let mounted = true;
    getExamCorrectionView(accessToken, assessmentId).then(data => {
      if (!mounted) return;
      let saved: Record<string, CorrectionResponse> = {};
      try { saved = JSON.parse(localStorage.getItem(`exam-corrections:${peekActiveSession()?.user.id}:${assessmentId}:${data.resultVersion}`) ?? "{}"); } catch { /* Start with an empty draft. */ }
      setDraft(data.submission ? Object.fromEntries(data.submission.responses.map(item => [item.questionId, item])) : saved && typeof saved === "object" ? saved : {});
      setView(data); setError("");
    }).catch(reason => { if (mounted) setError(reason instanceof Error ? reason.message : "Corrections could not be opened."); });
    return () => { mounted = false; };
  }, [accessToken, assessmentId, reload]);

  function update(questionId: string, change: Partial<CorrectionResponse>) {
    const current = draft[questionId] ?? { questionId, whyChosenIncorrect: "", whyCorrectAnswerCorrect: "", understanding: 0 };
    const next = { ...draft, [questionId]: { ...current, ...change } };
    setDraft(next);
    setError("");
    try { localStorage.setItem(draftKey, JSON.stringify(next)); setDraftNotice("Draft saved on this device"); }
    catch { setDraftNotice("Device storage is unavailable. Keep this page open until you submit."); }
  }

  async function submit() {
    if (!view || saving || view.submission) return;
    setError("");
    let responses: CorrectionResponse[];
    try { responses = validateCorrections(view.questions, view.questions.filter(item => !item.isCorrect).map(item => draft[item.question.id] ?? { questionId: item.question.id, whyChosenIncorrect: "", whyCorrectAnswerCorrect: "", understanding: 0 })); }
    catch (reason) {
      setError(reason instanceof Error ? reason.message : "Complete all corrections.");
      const missing = view.questions.findIndex(item => !item.isCorrect && (!draft[item.question.id]?.whyCorrectAnswerCorrect?.trim() || item.section === "english" && !draft[item.question.id]?.whyChosenIncorrect?.trim() || !draft[item.question.id]?.understanding));
      if (missing >= 0) setActive(missing);
      return;
    }
    setSaving(true);
    try {
      const submission = await submitExamCorrections(accessToken, assessmentId, view.resultVersion, responses);
      setView({ ...view, submission });
      try { localStorage.removeItem(draftKey); } catch { /* Submission is safely stored on the server. */ }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Corrections could not be submitted."); }
    finally { setSaving(false); }
  }

  const question = view?.questions[active];
  const response = question ? draft[question.question.id] : undefined;
  const incorrect = view?.questions.filter(item => !item.isCorrect) ?? [];
  const completed = incorrect.filter(item => {
    try { validateCorrections([item], [draft[item.question.id]]); return true; } catch { return false; }
  }).length;
  return <main className="exam-corrections-page">
    <header><a href="/study-hall/shsat/results">← Back to results</a><p>Learn from your answers</p><h1>{view?.result.title ?? "Exam corrections"}</h1><span>{view?.submission ? `Submitted ${new Date(view.submission.submittedAt).toLocaleString()}` : `${completed} of ${incorrect.length} corrections complete`}</span></header>
    {error && <div className="exam-review-error" role="alert">{error} <button type="button" onClick={() => setReload(value => value + 1)}>Reload corrections</button></div>}
    {!view && !error && <p>Loading corrections…</p>}
    {view && <div className="exam-corrections-layout">
      <aside><h2>Questions</h2><p>Red: incorrect · Green: correct · ✓: explanation complete</p><nav aria-label="Question navigation">{(["english", "math"] as const).map(section => <section key={section}><h3>{section === "english" ? "English" : "Math"}</h3><div className="exam-correction-nav">{view.questions.map((item, index) => item.section === section ? <button key={item.question.id} type="button" className={`${item.isCorrect ? "is-correct" : "is-incorrect"}${index === active ? " is-active" : ""}`} aria-current={index === active ? "step" : undefined} aria-label={`${section} question ${item.number}, ${item.isCorrect ? "correct" : "incorrect"}`} onClick={() => setActive(index)}>{item.number}{!item.isCorrect && (() => { try { validateCorrections([item], [draft[item.question.id]]); return " ✓"; } catch { return ""; } })()}</button> : null)}</div></section>)}</nav></aside>
      <section className="exam-correction-work">
        {view.submission && <p className="exam-review-success" role="status">Corrections submitted. Your teacher can now read your explanations and understanding ratings.</p>}
        {!incorrect.length && <p className="exam-review-success">All answers were correct. No corrections are required.</p>}
        {question && <article key={question.question.id}>
          <div className="exam-correction-question-heading"><strong>{question.section === "english" ? "English" : "Math"} · Question {question.number}</strong><span>{question.isCorrect ? "Correct answer" : "Incorrect answer"}</span></div>
          <ExamReviewQuestion item={question} />
          {!question.isCorrect && <fieldset disabled={Boolean(view.submission) || saving}>
            {question.section === "english" && <label>Why is the answer you chose wrong? <small>Required; if blank, explain why you did not answer.</small><textarea required maxLength={10000} rows={4} value={response?.whyChosenIncorrect ?? ""} onChange={event => update(question.question.id, { whyChosenIncorrect: event.target.value })} /></label>}
            <label>Why is the correct answer correct? <small>Required{question.section === "math" ? ". Explain your reasoning or show your steps." : ". Use evidence from the text."}</small><textarea required maxLength={10000} rows={4} value={response?.whyCorrectAnswerCorrect ?? ""} onChange={event => update(question.question.id, { whyCorrectAnswerCorrect: event.target.value })} /></label>
            <label>How much do you understand the question now?<strong>{response?.understanding ? `${response.understanding} / 5` : "Choose a rating from 1–5"}</strong><input aria-label="Understanding from 1 to 5" type="range" min={1} max={5} step={1} value={response?.understanding || 1} onChange={event => update(question.question.id, { understanding: Number(event.target.value) })} onPointerUp={event => update(question.question.id, { understanding: Number(event.currentTarget.value) })} onKeyUp={event => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) update(question.question.id, { understanding: Number(event.currentTarget.value) }); }} /><span className="exam-slider-labels"><span>1 · Still unsure</span><span>5 · I can explain it</span></span></label>
          </fieldset>}
        </article>}
        <footer><div className="exam-correction-pagination"><button type="button" disabled={active === 0} onClick={() => setActive(value => value - 1)}>← Previous</button><button type="button" disabled={active >= view.questions.length - 1} onClick={() => setActive(value => value + 1)}>Next →</button></div><span>{view.submission ? "Submission saved" : draftNotice || "Explanations are required for incorrect answers only."}</span>{!view.submission && incorrect.length > 0 && <button className="exam-review-primary" type="button" disabled={saving} onClick={submit}>{saving ? "Submitting…" : "Submit corrections"}</button>}</footer>
      </section>
    </div>}
  </main>;
}
