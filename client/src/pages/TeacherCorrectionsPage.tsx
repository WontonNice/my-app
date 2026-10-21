import { useEffect, useState } from "react";
import { AppLink } from "../components/AppLink";
import { CorrectionCanvas } from "../components/CorrectionCanvas";
import { ExamReviewQuestion } from "../components/ExamReviewQuestion";
import { getExamCorrectionSubmissions, getTeacherAssessments, getTeacherStudentProgress } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getActiveSession } from "../lib/sessionCache";
import type { CorrectionSubmission } from "../../../server/src/shared/examCorrections";

export function TeacherCorrectionAnalysis({ submission, studentName, title }: { submission: CorrectionSubmission; studentName: string; title: string }) {
  const [active, setActive] = useState(() => Math.max(0, submission.questions.findIndex(item => item.question.id === new URLSearchParams(location.search).get("question"))));
  const [revealed, setRevealed] = useState(false);
  const question = submission.questions[active];
  const responses = new Map(submission.responses.map(response => [response.questionId, response]));
  const response = question ? responses.get(question.question.id) : undefined;
  const incorrect = submission.questions.filter(item => !item.isCorrect);
  const lowConfidence = submission.responses.filter(item => item.understanding <= 2).length;
  const average = submission.responses.length ? (submission.responses.reduce((sum, item) => sum + item.understanding, 0) / submission.responses.length).toFixed(1) : "—";
  function goTo(index: number) { setActive(index); setRevealed(false); }
  return <main className="teacher-correction-page">
    <header className="teacher-correction-page-header"><div><AppLink href="/teacher/assessments">← Assessments</AppLink><p>{title} · Submitted {new Date(submission.submittedAt).toLocaleString()} · Original test: {submission.questions.length - incorrect.length} / {submission.questions.length} correct</p><h1>{studentName} <span>Correction analysis</span></h1></div><button type="button" onClick={() => window.print()}>Print question</button></header>
    <section className="teacher-correction-metrics" aria-label="Correction summary">
      <div><strong>{submission.responses.length} / {incorrect.length}</strong><span>Corrections submitted</span></div><div><strong>{average} / 5</strong><span>Average understanding</span></div><div><strong>{lowConfidence}</strong><span>Need more support · rating 1–2</span></div><div><strong>{incorrect.filter(item => !responses.has(item.question.id)).length}</strong><span>Awaiting correction</span></div>
    </section>
    <nav className="teacher-correction-full-nav" aria-label="Full exam question navigation"><header><strong>All questions</strong><span><i className="is-correct" /> Correct <i className="is-submitted" /> Submitted <i className="is-pending" /> Awaiting correction</span></header>
      {(["english", "math"] as const).map(section => <div key={section}><strong>{section === "math" ? "Math" : "English"}</strong><div>{submission.questions.map((item, index) => ({ item, index })).filter(({ item }) => item.section === section).map(({ item, index }) => <button type="button" key={item.question.id} aria-current={active === index ? "step" : undefined} aria-label={`${section} question ${item.number}, ${item.isCorrect ? "correct" : responses.has(item.question.id) ? "correction submitted" : "awaiting correction"}`} className={`${item.isCorrect ? "is-correct" : responses.has(item.question.id) ? "is-submitted" : "is-pending"}${active === index ? " is-active" : ""}`} onClick={() => goTo(index)}>{item.number}{responses.has(item.question.id) ? " ✓" : ""}</button>)}</div></div>)}
    </nav>
    {question ? <><div className="teacher-correction-question-bar"><button type="button" disabled={!active} onClick={() => goTo(active - 1)}>← Previous</button><strong>{question.section === "math" ? "Math" : "English"} · Question {question.number} <small>{active + 1} of {submission.questions.length}</small></strong><button type="button" disabled={active >= submission.questions.length - 1} onClick={() => goTo(active + 1)}>Next →</button></div>
      <div className="teacher-correction-analysis-layout"><article className="exam-correction-viewer"><div className="exam-correction-question-heading"><strong>{question.question.topic}{question.question.subtopic ? ` · ${question.question.subtopic}` : ""}</strong><button type="button" aria-pressed={revealed} onClick={() => setRevealed(value => !value)}>{revealed ? "Hide answer" : "Show answer"}</button></div><ExamReviewQuestion item={question} showAnswers={revealed} answerPresentation="correction" variant="exam" /></article>
        <aside className="exam-correction-response-panel teacher-correction-analysis-response"><header><div><p>Student correction</p><h2>{response ? "Explanation & working" : question.isCorrect ? "Answered correctly" : "Awaiting correction"}</h2></div>{response && <strong className={response.understanding <= 2 ? "needs-support" : ""}>{response.understanding} / 5</strong>}</header>
          {response ? <><dl><dt>Student-selected question type</dt><dd>{response.questionType || "Not provided"}</dd>{response.whyChosenIncorrect && <><dt>Why their original answer was wrong</dt><dd>{response.whyChosenIncorrect}</dd></>}<dt>Why the correct answer is correct</dt><dd>{response.whyCorrectAnswerCorrect || (response.drawing?.length ? "See handwritten work below." : "Not provided")}</dd></dl>{response.drawing?.length ? <CorrectionCanvas key={question.question.id} readOnly value={response.drawing} /> : null}{response.understanding <= 2 && <p className="teacher-correction-support-note">Follow up on this question: the student rated their understanding as {response.understanding} out of 5.</p>}</> : <p>{question.isCorrect ? "No correction is required for this question." : "The student has not submitted a correction for this question yet."}</p>}
        </aside></div></> : <p role="alert">The questions for this submission are unavailable.</p>}
  </main>;
}

export function TeacherCorrectionsPage() {
  const assessmentId = decodeURIComponent(location.pathname.split("/")[3] || "");
  const params = new URLSearchParams(location.search);
  const studentId = params.get("student") || "", version = params.get("version") || "";
  const [data, setData] = useState<{ submission: CorrectionSubmission; studentName: string; title: string } | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const session = await getActiveSession();
        if (!session) { location.assign("/login"); return; }
        const role = getUserRole(session.user);
        if (!["teacher", "admin"].includes(role)) { location.assign(getDashboardPath(role)); return; }
        const [submissions, assessments, students] = await Promise.all([getExamCorrectionSubmissions(session.access_token, assessmentId), getTeacherAssessments(session.access_token), getTeacherStudentProgress(session.access_token)]);
        const submission = submissions.find(item => item.studentId === studentId && item.resultVersion === version);
        if (!submission) throw new Error("This correction submission could not be found. Return to Assessments and open a submission.");
        if (mounted) { setData({ submission, studentName: students.find(student => student.id === studentId)?.fullName || "Student", title: assessments.find(item => item.id === assessmentId)?.title || "Exam" }); setError(""); }
      } catch (reason) { if (mounted) setError(reason instanceof Error ? reason.message : "Corrections could not be loaded."); }
    }
    void load(); return () => { mounted = false; };
  }, [assessmentId, studentId, version, reload]);
  if (error) return <main className="teacher-correction-page"><AppLink href="/teacher/assessments">← Assessments</AppLink><p role="alert">{error}</p><button type="button" onClick={() => setReload(value => value + 1)}>Try again</button></main>;
  return data ? <TeacherCorrectionAnalysis key={`${studentId}:${version}`} {...data} /> : <main className="loading-shell">Loading correction analysis…</main>;
}
