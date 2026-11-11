import { useEffect, useState } from "react";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { getTeacherExamReentry, setTeacherExamReentry, type AssessmentSection, type StudentProgressSnapshot, type TeacherAssessment, type TeacherExamReentryStatus } from "../lib/api";
import "./TeacherExamReentry.css";

export function TeacherExamReentry({ accessToken, assessments, students, initialStudentId = "", onChanged }: {
  accessToken: string;
  assessments: Pick<TeacherAssessment, "id" | "title" | "classId">[];
  students: Pick<StudentProgressSnapshot, "id" | "fullName" | "classes">[];
  onChanged?: () => void;
  initialStudentId?: string;
}) {
  const [assessmentId, setAssessmentId] = useState("");
  const [studentId, setStudentId] = useState(initialStudentId);
  const [resetSection, setResetSection] = useState<AssessmentSection>("english");
  const [sections, setSections] = useState<AssessmentSection[]>(["english", "math"]);
  const [additionalMinutes, setAdditionalMinutes] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);
  const [record, setRecord] = useState<{ key: string; value: TeacherExamReentryStatus | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const selectionKey = `${assessmentId}:${studentId}`;
  const status = record?.key === selectionKey ? record.value : null;
  const loading = Boolean(assessmentId && studentId && record?.key !== selectionKey);
  const selectedAssessment = assessments.find(assessment => assessment.id === assessmentId);
  const eligibleStudents = students.filter(student => !selectedAssessment || student.classes.includes(selectedAssessment.classId));
  const selectedStudent = students.find(student => student.id === studentId);
  const activeGrant = status?.grant?.remainingSections.length ? status.grant : null;
  const retakeOpen = Boolean(activeGrant?.newAttempt);

  useEffect(() => {
    if (!accessToken || !assessmentId || !studentId) return;
    let cancelled = false;
    getTeacherExamReentry(accessToken, assessmentId, studentId).then(value => {
      if (!cancelled) setRecord({ key: selectionKey, value });
    }).catch(error => { if (!cancelled) { setRecord({ key: selectionKey, value: null }); setMessage(error instanceof Error ? error.message : "Could not load student access."); } });
    return () => { cancelled = true; };
  }, [accessToken, assessmentId, studentId, selectionKey]);

  async function update(revoke = false, resetAnswers = false, newAttempt = false) {
    if (!assessmentId || !studentId) return;
    if (resetAnswers && !window.confirm(`Reset ${resetSection === "english" ? "English" : "Math"} for ${selectedStudent?.fullName} on ${selectedAssessment?.title}? This section will start with blank answers. The original submission will be archived.`)) return;
    setSaving(true); setMessage("");
    try {
      const result = await setTeacherExamReentry(accessToken, assessmentId, studentId, revoke ? null : { sections: newAttempt ? ["english", "math"] : resetAnswers ? [resetSection] : sections, additionalMinutes: resetTimer || newAttempt ? 0 : additionalMinutes, resetAnswers, resetTimer, newAttempt });
      setRecord(previous => previous?.key === selectionKey && previous.value ? { ...previous, value: { ...previous.value, grant: result.grant } } : previous);
      setMessage(revoke ? `Re-entry revoked for ${selectedStudent?.fullName}.` : newAttempt ? `${selectedStudent?.fullName} can start another attempt with blank answers and 3 hours. Both results will be saved in exam history.` : resetAnswers ? `${selectedStudent?.fullName} can start ${resetSection === "english" ? "English" : "Math"} again with blank answers${resetTimer ? " and a fresh 3-hour timer" : ""}.` : `${selectedStudent?.fullName} can reopen ${sections.map(section => section === "math" ? "Math" : "English").join(" and ")} from their Assessments page. Saved answers will load${resetTimer ? " with a fresh 3-hour timer" : ""}.`);
      onChanged?.();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update re-entry access."); }
    finally { setSaving(false); }
  }

  return <section className="teacher-exam-reentry" aria-labelledby="exam-reentry-title">
    <header><div><p><RotateCcw size={14} aria-hidden="true" /> Individual exam re-entry</p><h3 id="exam-reentry-title">Reopen or reset an exam section</h3></div><span><ShieldCheck size={14} aria-hidden="true" /> Only the selected student</span></header>
    <p>Let a student edit or finish selected sections with their saved answers. Each permission closes when those sections are submitted again.</p>
    <div className="exam-reentry-fields">
      <label>Assessment<select value={assessmentId} disabled={saving} onChange={event => { setAssessmentId(event.target.value); setStudentId(initialStudentId); setMessage(""); }}><option value="">Choose an assessment</option>{assessments.map(assessment => <option key={assessment.id} value={assessment.id}>{assessment.title}</option>)}</select></label>
      <label>Student<select value={studentId} disabled={!assessmentId || saving} onChange={event => { setStudentId(event.target.value); setMessage(""); }}><option value="">Choose a student</option>{eligibleStudents.map(student => <option key={student.id} value={student.id}>{student.fullName}</option>)}</select></label>
      <fieldset disabled={!status?.hasSubmission || loading || saving}><legend>Sections to reopen</legend>{(["english", "math"] as const).map(section => <label key={section}><input type="checkbox" checked={sections.includes(section)} onChange={event => setSections(current => event.target.checked ? [...current, section] : current.filter(item => item !== section))} />{section === "math" ? "Math" : "English"}</label>)}</fieldset>
      <label>Extra time (minutes)<input type="number" min={0} max={180} step={1} value={additionalMinutes} disabled={saving || resetTimer || retakeOpen} onChange={event => setAdditionalMinutes(Number(event.target.value))} /><small>{resetTimer ? "Timer will reset to exactly 3 hours." : "0 keeps the remaining 3-hour allowance."}</small></label>
    </div>
    <label className="exam-reentry-timer-option"><input type="checkbox" checked={resetTimer} disabled={saving || retakeOpen} onChange={event => setResetTimer(event.target.checked)} />Reset timer to 3 hours</label>
    <small>Applies when you allow re-entry or reset a section. Saved answers stay unless you reset a section.</small>
    {loading ? <p role="status">Checking this student's submission…</p> : null}
    {status && !status.hasSubmission ? <p>This student has no submitted digital exam to reopen.</p> : null}
    {activeGrant ? <p className="exam-reentry-active">{retakeOpen ? "New attempt" : "Re-entry"} open: {activeGrant.remainingSections.map(section => section === "math" ? "Math" : "English").join(" and ")} · {activeGrant.resetTimer ? "3-hour timer reset" : `${activeGrant.additionalMinutes} extra minutes`} · granted {new Date(activeGrant.grantedAt).toLocaleString()}</p> : null}
    <footer><button type="button" disabled={saving || loading || retakeOpen || !status?.hasSubmission || !sections.length || (!resetTimer && (!Number.isInteger(additionalMinutes) || additionalMinutes < 0 || additionalMinutes > 180))} onClick={() => void update()}>{saving ? "Saving…" : activeGrant ? "Update re-entry permission" : "Allow re-entry"}</button>{activeGrant ? <button type="button" disabled={saving} onClick={() => void update(true)}>Revoke permission</button> : null}<small>The original submission is preserved. For older exams without recorded time, reset the timer or add extra minutes.</small></footer>
    <fieldset disabled={!status?.hasSubmission || loading || saving || retakeOpen}><legend>Reset a section</legend>
      <label>Start with blank answers <select value={resetSection} onChange={event => setResetSection(event.target.value as AssessmentSection)}><option value="english">English</option><option value="math">Math</option></select></label>
      <button type="button" disabled={!status?.completedSections.includes(resetSection) || (!resetTimer && (!Number.isInteger(additionalMinutes) || additionalMinutes < 0 || additionalMinutes > 180))} onClick={() => void update(false,true)}>Reset {resetSection === 'english' ? 'English' : 'Math'}</button>
      <small>{resetTimer ? "The selected section starts with a fresh 3-hour timer." : "The selected section uses the remaining exam time plus any extra minutes above."}</small>
    </fieldset>
    <fieldset disabled={!status?.hasSubmission || loading || saving || retakeOpen}><legend>Another exam attempt</legend>
      <p>Start English and Math with blank answers and a fresh 3-hour timer. The previous result is kept, and the new result is saved separately in exam history.</p>
      <button type="button" disabled={status?.completedSections.length !== 2} onClick={() => void update(false, false, true)}>Allow another attempt</button>
      <small>{retakeOpen ? "Another attempt is already open for this student." : status?.hasSubmission && status.completedSections.length !== 2 ? "The student must submit both sections before another full attempt." : "Only this student gets access, even if the exam is locked for the class."}</small>
    </fieldset>
    {message ? <p role="status">{message}</p> : null}
  </section>;
}
