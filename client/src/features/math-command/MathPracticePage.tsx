import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MathPracticeView } from "../../../../server/src/shared/mathCommandAnalytics";
import { mathAnswerPresent, mathCorrectAnswer } from "../../../../server/src/shared/mathCommandAnalytics";
import { ExamMathQuestion } from "../../components/ExamMathQuestion";
import { ExamAnswer, ExamText } from "../../components/ExamReviewQuestion";
import { navigateTo } from "../../lib/navigation";
import { AppLink } from "../../components/AppLink";
import { isExamQuestionCorrect, type SelectedAnswer, type SelectedAnswers } from "../../lib/examResults";
import { getActiveSession, peekActiveSession } from "../../lib/sessionCache";
import { getDashboardPath, getUserRole } from "../../lib/auth";
import { jsonRequest, mathCommandRequest, mathPercent, type MathCommandRequest } from "./client";
import "./math-command.css";

export function MathPracticeWorkspace({ assignmentId, request }: { assignmentId: string; request: MathCommandRequest }) {
  const [view, setView] = useState<MathPracticeView>();
  const [answers, setAnswers] = useState<SelectedAnswers>({});
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [returnAfterSave, setReturnAfterSave] = useState(false);
  const [reload, setReload] = useState(0);
  const answersRef = useRef<SelectedAnswers>({});
  const revisionRef = useRef(0);
  const editVersion = useRef(0);
  const savedVersion = useRef(0);
  const inFlight = useRef(false);
  const base = `/student/assignments/${encodeURIComponent(assignmentId)}`;
  useEffect(() => {
    let active = true;
    request<MathPracticeView>(base).then(data => {
      if (!active) return;
      setView(data); setAnswers(data.answers); answersRef.current = data.answers; revisionRef.current = data.revision;
      editVersion.current = 0; savedVersion.current = 0; setDirty(false); setError("");
    }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Could not open this assignment."); });
    return () => { active = false; };
  }, [base, request, reload]);

  const persist = useCallback(async (submit = false) => {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError("");
    const version = editVersion.current;
    try {
      const data = await request<MathPracticeView>(`${base}/${submit ? "submit" : "responses"}`, jsonRequest(submit ? "POST" : "PUT", { answers: answersRef.current, revision: revisionRef.current }));
      revisionRef.current = data.revision; savedVersion.current = version; setView(data);
      setDirty(editVersion.current !== version); if (submit) setConfirmSubmit(false);
      if (submit) { setAnswers(data.answers); answersRef.current = data.answers; }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Your answers could not be saved. Keep this page open and retry."); }
    finally { inFlight.current = false; setBusy(false); }
  }, [base, request]);

  useEffect(() => {
    if (!dirty || busy || error || view?.status === "completed") return;
    const timer = window.setTimeout(() => { void persist(); }, 700);
    return () => window.clearTimeout(timer);
  }, [answers, dirty, busy, error, persist, view?.status]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (editVersion.current !== savedVersion.current) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  useEffect(() => { if (returnAfterSave && !busy && !dirty) navigateTo("/study-hall/shsat/assignments"); }, [returnAfterSave, busy, dirty]);
  const updateAnswer = (value: SelectedAnswer) => {
    if (!view || view.status === "completed" || confirmSubmit) return;
    const next = { ...answersRef.current, [view.questions[index].id]: value };
    answersRef.current = next; editVersion.current += 1; setAnswers(next); setDirty(true);
  };
  if (!view) return <main className="mc-workspace"><div className="mc-practice"><AppLink href="/study-hall/shsat/assignments">← My learning plan</AppLink>{error ? <p className="mc-error" role="alert">{error}<button type="button" onClick={() => setReload(value => value + 1)}>Retry</button></p> : <p role="status">Opening your math assignment…</p>}</div></main>;
  const completed = view.status === "completed";
  const question = view.questions[index];
  const answered = view.questions.filter(item => mathAnswerPresent(answers[item.id])).length;
  const reviewed = completed ? view.result?.analysisContent?.mathSection?.questions.find(item => item.id === question?.id) ?? question : undefined;
  return <main className="mc-workspace"><div className="mc-practice">
    <header className="mc-header"><div><AppLink href="/study-hall/shsat/assignments" onClick={event => { if (dirty || busy) { event.preventDefault(); setReturnAfterSave(true); if (!busy) void persist(); } }}>← My learning plan</AppLink><h1>{view.assignment.title}</h1><small>{view.assignment.dueDate ? `Due ${view.assignment.dueDate} · ` : ""}{view.questions.length} math questions</small></div><span className="mc-practice-status" role="status">{completed ? "Submitted · Saved to your results" : busy ? "Saving answers…" : dirty ? "Unsaved changes" : view.savedAt ? `Saved ${new Date(view.savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Answers save automatically"}</span></header>
    {view.assignment.instructions && <p className="mc-caption">{view.assignment.instructions}</p>}
    {error && <div className="mc-error" role="alert">{error}<button type="button" disabled={busy} onClick={() => { void persist(); }}>Retry save</button></div>}
    {completed && view.result && <div className="mc-notice"><strong>{view.result.correct} / {view.result.total} correct · {mathPercent(view.result.percentage)}</strong><span>Review your submitted responses below.</span></div>}
    <nav className="mc-question-navigation" aria-label="Math assignment questions">{view.questions.map((item, itemIndex) => <button key={item.id} type="button" aria-label={`Question ${itemIndex + 1}${mathAnswerPresent(answers[item.id]) ? ", answered" : ", unanswered"}`} aria-current={index === itemIndex} className={mathAnswerPresent(answers[item.id]) ? "is-answered" : ""} onClick={() => setIndex(itemIndex)}>{itemIndex + 1}</button>)}</nav>
    <p className="mc-caption">Question {index + 1} of {view.questions.length} · {answered} answered{completed && reviewed ? ` · ${isExamQuestionCorrect(reviewed, answers[reviewed.id]) ? "Correct" : "Needs review"}` : ""}</p>
    {question && <div className={completed ? "mc-practice-completed" : ""}><ExamMathQuestion key={question.id} question={question} answer={answers[question.id]} onChange={updateAnswer}/></div>}
    {reviewed && <section className="mc-panel mc-practice-review"><header><h2>Answer review</h2></header><div><h3>Your answer</h3><ExamAnswer question={reviewed} answer={answers[reviewed.id]}/><h3>Correct answer</h3><ExamAnswer question={reviewed} answer={mathCorrectAnswer(reviewed) ?? undefined}/>{reviewed.explanation && <><h3>Explanation</h3><ExamText text={reviewed.explanation}/></>}</div></section>}
    <footer className="mc-practice-footer"><button type="button" disabled={index === 0} onClick={() => setIndex(value => value - 1)}>← Previous</button><div>{!completed && <><button type="button" disabled={busy || !dirty} onClick={() => { void persist(); }}>Save answers</button> <button className="mc-primary" type="button" disabled={busy} onClick={() => setConfirmSubmit(true)}>Submit assignment</button></>}</div><button type="button" disabled={index >= view.questions.length - 1} onClick={() => setIndex(value => value + 1)}>Next →</button></footer>
    {confirmSubmit && <div className="mc-modal-backdrop"><section className="mc-modal" role="dialog" aria-modal="true" aria-label="Submit math assignment"><header><h2>Submit your answers?</h2></header>{error && <p className="mc-error" role="alert">{error}</p>}<p>{answered} of {view.questions.length} questions have responses. {answered < view.questions.length ? "Unanswered questions will be included in your score." : "Your score and explanations will be available after submission."}</p><footer><button type="button" disabled={busy} onClick={() => setConfirmSubmit(false)}>Keep working</button><button type="button" className="mc-primary" disabled={busy} onClick={() => { void persist(true); }}>{busy ? "Submitting…" : "Submit and view results"}</button></footer></section></div>}
  </div></main>;
}

export function MathPracticePage() {
  const [session, setSession] = useState(peekActiveSession());
  const [error, setError] = useState("");
  useEffect(() => { getActiveSession().then(value => { if (!value) { window.location.assign("/login"); return; } if (getUserRole(value.user) !== "student") { window.location.assign(getDashboardPath(getUserRole(value.user))); return; } setSession(value); }).catch(reason => setError(reason instanceof Error ? reason.message : "Could not verify your account.")); }, []);
  const request = useMemo(() => mathCommandRequest(session?.access_token || ""), [session?.access_token]);
  const assignmentId = decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[1] || "");
  if (error) return <main className="loading-shell" role="alert">{error}</main>;
  if (!session || getUserRole(session.user) !== "student") return <main className="loading-shell">Opening your math practice…</main>;
  return <MathPracticeWorkspace key={assignmentId} assignmentId={assignmentId} request={request}/>;
}
