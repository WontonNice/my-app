import { useEffect, useState } from "react";
import { ExamReviewQuestion } from "../components/ExamReviewQuestion";
import { getExamCorrectionView, submitExamCorrections } from "../lib/api";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { peekActiveSession } from "../lib/sessionCache";
import { validateCorrections, type CorrectionResponse, type ExamCorrectionView } from "../../../server/src/shared/examCorrections";

export function ExamCorrectionsPage() {
  const { accessToken, studentName } = useStudentPortalAccess();
  const assessmentId = decodeURIComponent(window.location.pathname.split("/")[2] ?? "");
  const [view, setView] = useState<ExamCorrectionView | null>(null);
  const [draft, setDraft] = useState<Record<string, CorrectionResponse>>({});
  const [active, setActive] = useState(0);
  const [isQuestionMenuOpen, setIsQuestionMenuOpen] = useState(false);
  const [revealedQuestionIds, setRevealedQuestionIds] = useState<Set<string>>(() => new Set());
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
      const submitted = data.submission ? Object.fromEntries(data.submission.responses.map(item => [item.questionId, item])) : {};
      setDraft({ ...submitted, ...(saved && typeof saved === "object" ? saved : {}) });
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
    const item = view?.questions[active];
    if (!view || !item || item.isCorrect || saving) return;
    setError("");
    let responses: CorrectionResponse[];
    try { responses = validateCorrections([item], [draft[item.question.id] ?? { questionId: item.question.id, whyChosenIncorrect: "", whyCorrectAnswerCorrect: "", understanding: 0 }]); }
    catch (reason) {
      setError(reason instanceof Error ? reason.message : "Complete this correction before submitting it.");
      return;
    }
    setSaving(true);
    try {
      const submission = await submitExamCorrections(accessToken, assessmentId, view.resultVersion, responses);
      setView({ ...view, submission });
      setDraftNotice(`Question ${item.number} correction saved for your teacher.`);
      try { localStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* The submitted correction is safely stored on the server. */ }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Corrections could not be submitted."); }
    finally { setSaving(false); }
  }

  const question = view?.questions[active];
  const response = question ? draft[question.question.id] : undefined;
  const incorrect = view?.questions.filter(item => !item.isCorrect) ?? [];
  const submittedQuestionIds = new Set(view?.submission?.responses.map(item => item.questionId) ?? []);
  const submittedCount = submittedQuestionIds.size;

  function goToQuestion(index: number) {
    setActive(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <main className="exam-corrections-page">
    <header className="exam-corrections-toolbar" aria-label="Correction controls">
      <div className="exam-corrections-toolbar-inner">
        <a href="/study-hall/shsat/results">← Back to results</a>
        <div className="exam-corrections-toolbar-navigation" aria-label="Previous and next question">
          <button type="button" aria-label="Previous question" disabled={!view || active === 0} onClick={() => goToQuestion(active - 1)}><span aria-hidden="true">‹</span></button>
          <button type="button" aria-label="Next question" disabled={!view || active >= view.questions.length - 1} onClick={() => goToQuestion(active + 1)}><span aria-hidden="true">›</span></button>
        </div>
        <button className="exam-corrections-question-toggle" type="button" aria-expanded={isQuestionMenuOpen} onClick={() => setIsQuestionMenuOpen(value => !value)}>Questions <span aria-hidden="true">{isQuestionMenuOpen ? "▴" : "▾"}</span></button>
        <strong>Exam corrections</strong>
        <span>{studentName}</span>
      </div>
    </header>
    <div className="exam-corrections-bluebar" />
    <nav className="exam-corrections-breadcrumb" aria-label="Correction location">
      <div>
        <span>{view?.result.title ?? "Exam corrections"}</span>
        {question ? <><span>/</span><span>{question.section === "english" ? "English" : "Math"}</span><span>/</span><span>Question {question.number}</span></> : null}
      </div>
    </nav>

    <div className="exam-corrections-content">
      <header className="exam-corrections-intro">
        <div><p>Learn from your answers</p><h1>{view?.result.title ?? "Exam corrections"}</h1></div>
        <span>{submittedCount} of {incorrect.length} corrections submitted</span>
      </header>

      {error && <div className="exam-review-error" role="alert">{error} <button type="button" onClick={() => setReload(value => value + 1)}>Reload corrections</button></div>}
      {!view && !error && <p className="exam-corrections-loading">Loading corrections…</p>}
      {view && <div className="exam-corrections-layout">
        {isQuestionMenuOpen && <nav className="exam-corrections-question-map" aria-label="Question navigation">
          <div className="exam-corrections-question-map-heading"><h2>Questions</h2><p><span className="is-incorrect" /> Incorrect <span className="is-correct" /> Correct <strong>✓</strong> Submitted</p></div>
          <div className="exam-corrections-question-sections">{(["english", "math"] as const).map(section => {
            const sectionQuestions = view.questions.map((item, index) => ({ item, index })).filter(entry => entry.item.section === section);
            if (!sectionQuestions.length) return null;
            return <section key={section}><h3>{section === "english" ? "English" : "Math"}</h3><div className="exam-correction-nav">{sectionQuestions.map(({ item, index }) => <button key={item.question.id} type="button" className={`${item.isCorrect ? "is-correct" : "is-incorrect"}${index === active ? " is-active" : ""}`} aria-current={index === active ? "step" : undefined} aria-label={`${section} question ${item.number}, ${item.isCorrect ? "correct" : "incorrect"}`} onClick={() => goToQuestion(index)}>{item.number}{submittedQuestionIds.has(item.question.id) ? " ✓" : ""}</button>)}</div></section>;
          })}</div>
        </nav>}

        <section className="exam-correction-work">
          {submittedCount > 0 && <p className="exam-review-success" role="status">{submittedCount} correction{submittedCount === 1 ? " is" : "s are"} saved for your teacher. You can keep working and submit the others as you finish them.</p>}
          {!incorrect.length && <p className="exam-review-success">All answers were correct. No corrections are required.</p>}
          {question && <div key={question.question.id}>
            <article className="exam-correction-viewer">
              <div className="exam-correction-question-heading"><strong>{question.section === "english" ? "English" : "Math"} · Question {question.number}</strong><div className="exam-correction-question-actions"><span className={question.isCorrect ? "is-correct" : "is-incorrect"}>{question.isCorrect ? "Correct answer" : "Incorrect answer"}</span><button type="button" aria-pressed={revealedQuestionIds.has(question.question.id)} onClick={() => setRevealedQuestionIds(current => { const next = new Set(current); if (next.has(question.question.id)) next.delete(question.question.id); else next.add(question.question.id); return next; })}>{revealedQuestionIds.has(question.question.id) ? "Hide answer" : "Show answer"}</button></div></div>
              <ExamReviewQuestion answerPresentation="correction" item={question} showAnswers={revealedQuestionIds.has(question.question.id)} variant="exam" />
            </article>

            {!question.isCorrect ? <section className="exam-correction-response-panel" aria-labelledby={`correction-response-${question.question.id}`}>
              <header><div><p>Correction response</p><h2 id={`correction-response-${question.question.id}`}>Explain your thinking</h2></div><span>{submittedQuestionIds.has(question.question.id) ? "Submitted" : "Required"}</span></header>
              <fieldset disabled={saving}>
                {question.section === "english" && <label>Why is the answer you chose wrong? <small>Required; if blank, explain why you did not answer.</small><textarea required maxLength={10000} rows={4} value={response?.whyChosenIncorrect ?? ""} onChange={event => update(question.question.id, { whyChosenIncorrect: event.target.value })} /></label>}
                <label>Why is the correct answer correct? <small>Required{question.section === "math" ? ". Explain your reasoning or show your steps." : ". Use evidence from the text."}</small><textarea required maxLength={10000} rows={4} value={response?.whyCorrectAnswerCorrect ?? ""} onChange={event => update(question.question.id, { whyCorrectAnswerCorrect: event.target.value })} /></label>
                <label className="exam-correction-understanding">How much do you understand the question now?<strong>{response?.understanding ? `${response.understanding} / 5` : "Choose a rating from 1–5"}</strong><input aria-label="Understanding from 1 to 5" type="range" min={1} max={5} step={1} value={response?.understanding || 1} onChange={event => update(question.question.id, { understanding: Number(event.target.value) })} onPointerUp={event => update(question.question.id, { understanding: Number(event.currentTarget.value) })} onKeyUp={event => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) update(question.question.id, { understanding: Number(event.currentTarget.value) }); }} /><span className="exam-slider-labels"><span>1 · Still unsure</span><span>5 · I can explain it</span></span></label>
              </fieldset>
            </section> : <p className="exam-correction-not-required">This answer was correct, so no written correction is required.</p>}
          </div>}

          <footer><div className="exam-correction-pagination"><button type="button" disabled={active === 0} onClick={() => goToQuestion(active - 1)}>← Previous</button><button type="button" disabled={active >= view.questions.length - 1} onClick={() => goToQuestion(active + 1)}>Next →</button></div><span>{question && submittedQuestionIds.has(question.question.id) ? "This correction is saved. You may update and submit it again." : draftNotice || "Complete and submit each incorrect question when it is ready."}</span>{question && !question.isCorrect && <button className="exam-review-primary" type="button" disabled={saving} onClick={submit}>{saving ? "Saving…" : submittedQuestionIds.has(question.question.id) ? "Update this correction" : "Submit this correction"}</button>}</footer>
        </section>
      </div>}
    </div>
  </main>;
}
