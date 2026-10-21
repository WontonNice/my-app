import { useEffect, useState } from "react";
import { resolveExamContent } from "../content/exams";
import { createExamResult, type SelectedAnswers, type ExamResult } from "../lib/examResults";
import { enterStudentExamAnswers, getExamCorrectionSubmissions, setExamCorrectionsAccess, type AssessmentSection, type StudentProgressSnapshot, type TeacherAssessment } from "../lib/api";
import { reviewQuestions, type CorrectionSubmission } from "../../../server/src/shared/examCorrections";
import { AppLink } from "./AppLink";
import { PaperAnswerGrid } from "./PaperAnswerGrid";

export function PaperAnswerEntry({ assessment, student, accessToken, onSaved }: { assessment: TeacherAssessment; student: StudentProgressSnapshot; accessToken: string; onSaved: (result: ExamResult) => void }) {
  const form = assessment.forms?.find(form => form.id === assessment.formAssignments?.[student.id]);
  const content = resolveExamContent({ ...assessment, passageOrder: form?.passageOrder });
  const availableSections: AssessmentSection[] = [
    ...(content.passageSets.some(set => set.questions.length) || content.standaloneSection?.questions.length ? ["english" as const] : []),
    ...(content.mathSection?.questions.length ? ["math" as const] : []),
  ];
  const draftKey = `teacher-paper-answers:${assessment.id}:${student.id}`;
  const existingResult = student.progress.examResults.find(item => item.assessmentId === assessment.id);
  const existingAnswers = existingResult?.answers && typeof existingResult.answers === "object" && !Array.isArray(existingResult.answers)
    ? existingResult.answers as SelectedAnswers
    : {};
  const existingSections = Array.isArray(existingResult?.completedSections)
    ? existingResult.completedSections.filter((section): section is AssessmentSection => section === "english" || section === "math")
    : availableSections;
  const [answers, setAnswers] = useState<SelectedAnswers>(() => {
    try {
      const storedDraft = localStorage.getItem(draftKey);
      if (!storedDraft) return existingAnswers;
      const value = JSON.parse(storedDraft);
      return value && typeof value === "object" && !Array.isArray(value) ? value : existingAnswers;
    } catch { return existingAnswers; }
  });
  const [sections, setSections] = useState<AssessmentSection[]>(existingSections.length ? existingSections : availableSections);
  const [completedDate, setCompletedDate] = useState(() => {
    if (typeof existingResult?.completedAt === "string" && /^\d{4}-\d{2}-\d{2}/.test(existingResult.completedAt)) return existingResult.completedAt.slice(0, 10);
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveSucceeded, setSaveSucceeded] = useState(false);
  const [hasInvalidAnswers, setHasInvalidAnswers] = useState(false);
  const allItems = reviewQuestions(content, createExamResult(content, {}, sections));
  const selectedAnswers = Object.fromEntries(allItems.filter(item => Object.hasOwn(answers, item.question.id)).map(item => [item.question.id, answers[item.question.id]]));
  const result = createExamResult(content, selectedAnswers, sections);
  async function save() {
    if (!confirmed || saving || !sections.length || hasInvalidAnswers) return;
    setSaving(true); setMessage(""); setSaveSucceeded(false);
    try {
      const result = await enterStudentExamAnswers(accessToken, assessment.id, student.id, { answers: selectedAnswers, completedSections: sections, completedDate });
      setSaveSucceeded(true); setConfirmed(false); setMessage(`Answers saved for ${student.fullName}. Score: ${result.correct}/${result.total} (${result.percentage}%). You can continue editing and save another update.`);
      try { localStorage.removeItem(draftKey); } catch { /* The cloud result is saved. */ }
      onSaved(result);
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Answers could not be saved."); }
    finally { setSaving(false); }
  }
  return <section className="exam-paper-entry">
    <p>{existingResult ? "Update the student's saved answers. Saving will replace the current exam result. " : "Enter answers from the student's original paper. "}{form ? `Numbering follows ${form.label}.` : "Numbering follows the default exam order."} Empty answers count as incorrect.</p>
    <fieldset disabled={saving}>
      <div className="exam-paper-entry-settings"><label>Test date<input type="date" required value={completedDate} onChange={event => { setCompletedDate(event.target.value); setConfirmed(false); }} /></label><div className="exam-answer-checkboxes">{availableSections.map(section => <label key={section}><input type="checkbox" checked={sections.includes(section)} onChange={event => { setSections(current => event.target.checked ? [...current, section] : current.filter(value => value !== section)); setConfirmed(false); setHasInvalidAnswers(false); }} />{section === "english" ? "English" : "Math"}</label>)}</div></div>
      <PaperAnswerGrid key={sections.join(":")} items={allItems} answers={answers} onValidityChange={setHasInvalidAnswers} onChange={next => {
        setAnswers(next); setConfirmed(false); setSaveSucceeded(false);
        try { localStorage.setItem(draftKey, JSON.stringify(next)); } catch { setMessage("Device storage is unavailable. Keep this page open until you save."); }
      }} />
      <div className="exam-paper-summary"><strong>Score preview: {result.correct} / {result.total} ({result.percentage}%)</strong>{result.subjects.map(subject => <span key={subject.subject}>{subject.subject}: {subject.correct} / {subject.total}</span>)}</div>
      <label className="exam-paper-confirm"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />I checked these answers against the student's paper, including any blanks, and understand that saving replaces the current result.</label>
      <button type="button" className="exam-review-primary" disabled={!confirmed || !sections.length || !completedDate || !allItems.length || hasInvalidAnswers} onClick={save}>{saving ? "Saving…" : `${existingResult ? "Update" : "Save"} answers for ${student.fullName}`}</button>
    </fieldset>
    {message && <p role={saveSucceeded ? "status" : "alert"} className={saveSucceeded ? "exam-review-success" : "exam-review-error"}>{message}</p>}
  </section>;
}

export function TeacherExamTools({ assessment, students, accessToken, onAssessmentChange, onResultSaved }: {
  assessment: TeacherAssessment; students: StudentProgressSnapshot[]; accessToken: string;
  onAssessmentChange: (assessment: TeacherAssessment) => void;
  onResultSaved: (studentId: string, result: ExamResult) => void;
}) {
  const [entryOpen, setEntryOpen] = useState(new URLSearchParams(window.location.search).get("enterAnswers") === assessment.id);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
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
      return <AppLink className="teacher-correction-submission-link" key={key} href={`/teacher/corrections/${encodeURIComponent(assessment.id)}?student=${encodeURIComponent(submission.studentId)}&version=${encodeURIComponent(submission.resultVersion)}`}><strong>{name}</strong><span>Updated {new Date(submission.submittedAt).toLocaleString()} · {submission.responses.length} correction{submission.responses.length === 1 ? "" : "s"}</span><b>Open analysis →</b></AppLink>;
    })}</div></>}</section>}
  </section>;
}
