import { useEffect, useState } from "react";
import { resolveExamContent, type ExamQuestion } from "../content/exams";
import { createExamResult, type SelectedAnswer, type SelectedAnswers, type ExamResult } from "../lib/examResults";
import { enterStudentExamAnswers, getExamCorrectionSubmissions, setExamCorrectionsAccess, type AssessmentSection, type StudentProgressSnapshot, type TeacherAssessment } from "../lib/api";
import { reviewQuestions, type CorrectionSubmission } from "../../../server/src/shared/examCorrections";
import { ExamReviewQuestion, ExamText } from "./ExamReviewQuestion";

function AnswerInput({ question, answer, onChange }: { question: ExamQuestion; answer?: SelectedAnswer; onChange: (value: SelectedAnswer) => void }) {
  const scalar = typeof answer === "string" ? answer : "";
  const values = answer && typeof answer === "object" && !Array.isArray(answer) ? answer : {};
  const multiple = Array.isArray(answer) ? answer : [];
  const choices = question.type === "graph_point_select" ? question.graph?.points.map(point => ({ id: point.id, text: `(${point.x}, ${point.y})` })) : question.choices;
  if (["multiple_choice", "transition_drop"].includes(question.type)) return <select aria-label="Student answer" value={scalar} onChange={event => onChange(event.target.value)}><option value="">No answer / blank</option>{question.choices?.map(choice => <option key={choice.id} value={choice.id}>{choice.id}</option>)}</select>;
  if (["multi_select", "graph_point_select"].includes(question.type)) return <div className="exam-answer-checkboxes">{choices?.map(choice => <label key={choice.id}><input type="checkbox" checked={multiple.includes(choice.id)} onChange={event => onChange(event.target.checked ? [...multiple, choice.id] : multiple.filter(id => id !== choice.id))} /><ExamText text={choice.text || choice.id} /></label>)}</div>;
  if (question.type === "inline_dropdown") return <div>{question.dropdowns?.map(dropdown => <label key={dropdown.id}>{dropdown.id}<select value={values[dropdown.id] ?? ""} onChange={event => onChange({ ...values, [dropdown.id]: event.target.value })}><option value="">No answer / blank</option>{dropdown.options.map(option => <option key={option.id} value={option.id}>{option.text || option.math || option.id}</option>)}</select></label>)}</div>;
  if (["category_sort", "matrix_choice", "table_match"].includes(question.type)) return <div>{question.items?.map(item => <label key={item.id}><ExamText text={item.text} html={item.html} /><select value={values[item.id] ?? ""} onChange={event => { const next = { ...values }; if (event.target.value) next[item.id] = event.target.value; else delete next[item.id]; onChange(next); }}><option value="">No answer / blank</option>{question.categories?.map(category => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>)}</div>;
  if (question.type === "math_drag_drop") return <div>{question.dragDropSlots?.map(slot => <label key={slot.id}>{slot.id}<select value={values[slot.id] ?? ""} onChange={event => { const next = { ...values }; if (event.target.value) next[slot.id] = event.target.value; else delete next[slot.id]; onChange(next); }}><option value="">Not placed</option>{question.items?.map(item => <option key={item.id} value={item.id}>{item.text || item.id}</option>)}</select></label>)}</div>;
  if (question.type === "number_line_response") return <div className="exam-paper-number-line"><label>Boundary value<input type="text" inputMode="decimal" value={values.value ?? ""} onChange={event => onChange({ ...values, value: event.target.value })} /></label><label>Direction<select value={values.direction ?? ""} onChange={event => onChange({ ...values, direction: event.target.value })}><option value="">Blank</option><option value="left">Left</option><option value="right">Right</option></select></label><label>Endpoint<select value={values.endpoint ?? ""} onChange={event => onChange({ ...values, endpoint: event.target.value })}><option value="">Blank</option><option value="open">Open</option><option value="closed">Closed</option></select></label></div>;
  return <input aria-label="Student answer" type="text" value={scalar} placeholder="Enter the student's answer; leave empty for blank" onChange={event => onChange(event.target.value)} />;
}

function PaperAnswerEntry({ assessment, student, accessToken, onSaved }: { assessment: TeacherAssessment; student: StudentProgressSnapshot; accessToken: string; onSaved: (result: ExamResult) => void }) {
  const form = assessment.forms?.find(form => form.id === assessment.formAssignments?.[student.id]);
  const content = resolveExamContent({ ...assessment, passageOrder: form?.passageOrder });
  const availableSections: AssessmentSection[] = [
    ...(content.passageSets.some(set => set.questions.length) || content.standaloneSection?.questions.length ? ["english" as const] : []),
    ...(content.mathSection?.questions.length ? ["math" as const] : []),
  ];
  const draftKey = `teacher-paper-answers:${assessment.id}:${student.id}`;
  const [answers, setAnswers] = useState<SelectedAnswers>(() => { try { const value = JSON.parse(localStorage.getItem(draftKey) ?? "{}"); return value && typeof value === "object" && !Array.isArray(value) ? value : {}; } catch { return {}; } });
  const [sections, setSections] = useState<AssessmentSection[]>(availableSections);
  const [completedDate, setCompletedDate] = useState(() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; });
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const allItems = reviewQuestions(content, createExamResult(content, {}, sections));
  const selectedAnswers = Object.fromEntries(allItems.filter(item => Object.hasOwn(answers, item.question.id)).map(item => [item.question.id, answers[item.question.id]]));
  const result = createExamResult(content, selectedAnswers, sections);
  const existing = student.progress.examResults.some(item => item.assessmentId === assessment.id);
  async function save() {
    if (!confirmed || saving || existing || saved || !sections.length) return;
    setSaving(true); setMessage("");
    try {
      const result = await enterStudentExamAnswers(accessToken, assessment.id, student.id, { answers: selectedAnswers, completedSections: sections, completedDate });
      setSaved(true); setMessage(`Answers saved for ${student.fullName}. Score: ${result.correct}/${result.total} (${result.percentage}%).`);
      try { localStorage.removeItem(draftKey); } catch { /* The cloud result is saved. */ }
      onSaved(result);
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Answers could not be saved."); }
    finally { setSaving(false); }
  }
  if (saved) return <p className="exam-review-success" role="status">{message}</p>;
  if (existing) return <p>This student already has a saved result for this exam. Select another student to enter a past test.</p>;
  return <section className="exam-paper-entry">
    <p>Enter answers from the student's original paper. {form ? `Numbering follows ${form.label}.` : "Numbering follows the default exam order."} Empty answers count as incorrect.</p>
    <fieldset disabled={saving}>
      <label>Test date<input type="date" required value={completedDate} onChange={event => setCompletedDate(event.target.value)} /></label>
      <div className="exam-answer-checkboxes">{availableSections.map(section => <label key={section}><input type="checkbox" checked={sections.includes(section)} onChange={event => { setSections(current => event.target.checked ? [...current, section] : current.filter(value => value !== section)); setConfirmed(false); }} />{section === "english" ? "English" : "Math"}</label>)}</div>
      <div className="exam-paper-question-list">{allItems.map(item => <article key={item.question.id}><details><summary>{item.section === "english" ? "English" : "Math"} · Question {item.number} · View question</summary><ExamReviewQuestion item={item} showAnswers={false} /></details><AnswerInput question={item.question} answer={answers[item.question.id]} onChange={answer => {
        const next = { ...answers, [item.question.id]: answer }; setAnswers(next); setConfirmed(false);
        try { localStorage.setItem(draftKey, JSON.stringify(next)); } catch { setMessage("Device storage is unavailable. Keep this page open until you save."); }
      }} /></article>)}</div>
      <div className="exam-paper-summary"><strong>Score preview: {result.correct} / {result.total} ({result.percentage}%)</strong>{result.subjects.map(subject => <span key={subject.subject}>{subject.subject}: {subject.correct} / {subject.total}</span>)}</div>
      <label className="exam-paper-confirm"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />I checked these answers against the student's paper, including any blanks.</label>
      <button type="button" className="exam-review-primary" disabled={!confirmed || !sections.length || !completedDate || !allItems.length} onClick={save}>{saving ? "Saving…" : `Save answers for ${student.fullName}`}</button>
    </fieldset>
    {message && <p role="alert" className="exam-review-error">{message}</p>}
  </section>;
}

function CorrectionSubmissionReview({ studentName, submission }: { studentName: string; submission: CorrectionSubmission }) {
  const items = submission.responses.flatMap(response => {
    const item = submission.questions.find(question => question.question.id === response.questionId);
    return item ? [{ item, response }] : [];
  });
  const [active, setActive] = useState(0);
  const [isQuestionMenuOpen, setIsQuestionMenuOpen] = useState(false);
  const [revealedQuestionIds, setRevealedQuestionIds] = useState<Set<string>>(() => new Set());
  const current = items[active] ?? items[0];
  if (!current) return <p className="exam-review-error">The submitted explanations were found, but their exam questions are no longer available.</p>;
  const { item, response } = current;
  const isRevealed = revealedQuestionIds.has(item.question.id);
  const goTo = (index: number) => setActive(Math.max(0, Math.min(index, items.length - 1)));

  return <section className="teacher-exam-correction-review exam-correction-work">
    <header className="teacher-exam-correction-review-toolbar">
      <div className="teacher-exam-correction-review-controls">
        <button aria-label="Previous correction" disabled={active === 0} onClick={() => goTo(active - 1)} type="button">‹</button>
        <button aria-expanded={isQuestionMenuOpen} onClick={() => setIsQuestionMenuOpen(value => !value)} type="button">Questions <span aria-hidden="true">{isQuestionMenuOpen ? "▴" : "▾"}</span></button>
        <button aria-label="Next correction" disabled={active >= items.length - 1} onClick={() => goTo(active + 1)} type="button">›</button>
      </div>
      <div><strong>{studentName}</strong><span>{active + 1} of {items.length} · Submitted {new Date(submission.submittedAt).toLocaleString()}</span></div>
    </header>
    {isQuestionMenuOpen ? <nav className="teacher-exam-correction-question-menu" aria-label="Submitted correction navigation">{items.map(({ item: question }, index) => <button aria-current={index === active ? "step" : undefined} className={index === active ? "is-active" : ""} key={question.question.id} onClick={() => { goTo(index); setIsQuestionMenuOpen(false); }} type="button">{question.section === "math" ? "Math" : "English"} {question.number}</button>)}</nav> : null}
    <article className="exam-correction-viewer">
      <div className="exam-correction-question-heading">
        <strong>{item.section === "english" ? "English" : "Math"} · Question {item.number}</strong>
        <div className="exam-correction-question-actions"><span className="is-incorrect">Incorrect answer</span><button aria-pressed={isRevealed} onClick={() => setRevealedQuestionIds(currentIds => { const next = new Set(currentIds); if (next.has(item.question.id)) next.delete(item.question.id); else next.add(item.question.id); return next; })} type="button">{isRevealed ? "Hide answer" : "Show answer"}</button></div>
      </div>
      <ExamReviewQuestion answerPresentation="correction" item={item} showAnswers={isRevealed} variant="exam" />
    </article>
    <section className="exam-correction-response-panel teacher-correction-writing">
      <header><div><p>Student correction</p><h4>Explanation and self assessment</h4></div><span>Submitted</span></header>
      {response.whyChosenIncorrect ? <div><h5>Why the chosen answer is wrong</h5><p>{response.whyChosenIncorrect}</p></div> : null}
      <div><h5>Why the correct answer is correct</h5><p>{response.whyCorrectAnswerCorrect}</p></div>
      <strong>Understanding: {response.understanding} / 5</strong>
    </section>
  </section>;
}

export function TeacherExamTools({ assessment, students, accessToken, onAssessmentChange, onResultSaved }: {
  assessment: TeacherAssessment; students: StudentProgressSnapshot[]; accessToken: string;
  onAssessmentChange: (assessment: TeacherAssessment) => void;
  onResultSaved: (studentId: string, result: ExamResult) => void;
}) {
  const [entryOpen, setEntryOpen] = useState(new URLSearchParams(window.location.search).get("enterAnswers") === assessment.id);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
  const [selectedSubmissionKey, setSelectedSubmissionKey] = useState("");
  const [studentId, setStudentId] = useState("");
  const [submissions, setSubmissions] = useState<CorrectionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const student = students.find(student => student.id === studentId);
  useEffect(() => {
    if (!accessToken) return;
    let mounted = true;
    getExamCorrectionSubmissions(accessToken, assessment.id).then(data => { if (mounted) { setSubmissions(data.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))); setError(""); } }).catch(reason => { if (mounted) setError(reason instanceof Error ? reason.message : "Submissions could not be loaded."); }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [accessToken, assessment.id, refresh]);
  useEffect(() => {
    if (!submissionsOpen) return;
    const interval = window.setInterval(() => setRefresh(value => value + 1), 15000);
    return () => window.clearInterval(interval);
  }, [submissionsOpen]);
  const activeSubmission = submissions.find(submission => `${submission.studentId}:${submission.resultVersion}` === selectedSubmissionKey) ?? submissions[0];
  async function toggleAccess() {
    setSaving(true); setError("");
    try { onAssessmentChange(await setExamCorrectionsAccess(accessToken, assessment.id, !assessment.correctionsOpen)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Correction access could not be updated."); }
    finally { setSaving(false); }
  }
  function toggleSubmissions() {
    const next = !submissionsOpen;
    setSubmissionsOpen(next);
    if (next) {
      setLoading(true);
      setRefresh(current => current + 1);
    }
  }
  return <section className="teacher-exam-tools">
    <div className="teacher-exam-tools-actions"><span><strong>Corrections {assessment.correctionsOpen ? "open" : "locked"}</strong><small>Students can open and submit corrections only while this is open.</small></span><button type="button" disabled={saving} onClick={toggleAccess}>{saving ? "Saving…" : assessment.correctionsOpen ? "Lock corrections" : "Open corrections"}</button><button type="button" onClick={toggleSubmissions}>{submissionsOpen ? "Hide correction submissions" : `Correction submissions${loading ? "" : ` (${submissions.length})`}`}</button><button type="button" onClick={() => setEntryOpen(value => !value)}>{entryOpen ? "Close answer entry" : "Enter student answers"}</button></div>
    {error && <p className="exam-review-error" role="alert">{error}</p>}
    {entryOpen && <section className="teacher-paper-panel"><h3>Enter answers from a previously taken test</h3><label>Student<select value={studentId} onChange={event => setStudentId(event.target.value)}><option value="">Choose a student</option>{students.filter(student => student.classes.includes(assessment.classId)).map(student => <option key={student.id} value={student.id}>{student.fullName}</option>)}</select></label>{student && <PaperAnswerEntry key={student.id} accessToken={accessToken} assessment={assessment} student={student} onSaved={result => onResultSaved(student.id, result)} />}</section>}
    {submissionsOpen && <section className="teacher-correction-submissions"><header><h3>Correction submissions</h3><button type="button" disabled={loading} onClick={() => { setLoading(true); setRefresh(value => value + 1); }}>Refresh submissions</button></header>{loading ? <p>Loading submissions…</p> : !submissions.length ? <p>No correction submissions yet.</p> : <><div aria-label="Submitted corrections" className="teacher-correction-submission-list">{submissions.map(submission => {
      const key = `${submission.studentId}:${submission.resultVersion}`;
      const name = students.find(student => student.id === submission.studentId)?.fullName ?? "Student";
      return <button aria-pressed={activeSubmission === submission} key={key} onClick={() => setSelectedSubmissionKey(key)} type="button"><strong>{name}</strong><span>Updated {new Date(submission.submittedAt).toLocaleString()} · {submission.responses.length} correction{submission.responses.length === 1 ? "" : "s"}</span></button>;
    })}</div>{activeSubmission ? <CorrectionSubmissionReview key={`${activeSubmission.studentId}:${activeSubmission.resultVersion}`} studentName={students.find(student => student.id === activeSubmission.studentId)?.fullName ?? "Student"} submission={activeSubmission} /> : null}</>}</section>}
  </section>;
}
