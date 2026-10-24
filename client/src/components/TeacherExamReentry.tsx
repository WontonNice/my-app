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
  const [sections, setSections] = useState<AssessmentSection[]>(["english", "math"]);
  const [additionalMinutes, setAdditionalMinutes] = useState(0);
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

  useEffect(() => {
    if (!accessToken || !assessmentId || !studentId) return;
    let cancelled = false;
    getTeacherExamReentry(accessToken, assessmentId, studentId).then(value => {
      if (!cancelled) setRecord({ key: selectionKey, value });
    }).catch(error => { if (!cancelled) { setRecord({ key: selectionKey, value: null }); setMessage(error instanceof Error ? error.message : "Could not load student access."); } });
    return () => { cancelled = true; };
  }, [accessToken, assessmentId, studentId, selectionKey]);

  async function update(revoke = false) {
    if (!assessmentId || !studentId) return;
    setSaving(true); setMessage("");
    try {
      const result = await setTeacherExamReentry(accessToken, assessmentId, studentId, revoke ? null : { sections, additionalMinutes });
      setRecord(previous => previous?.value ? { ...previous, value: { ...previous.value, grant: result.grant } } : previous);
      setMessage(revoke ? `Re-entry revoked for ${selectedStudent?.fullName}.` : `${selectedStudent?.fullName} can reopen ${sections.map(section => section === "math" ? "Math" : "English").join(" and ")} from their Assessments page. Saved answers will load.`);
      onChanged?.();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update re-entry access."); }
    finally { setSaving(false); }
  }

  return <section className="teacher-exam-reentry" aria-labelledby="exam-reentry-title">
    <header><div><p><RotateCcw size={14} aria-hidden="true" /> Individual exam re-entry</p><h3 id="exam-reentry-title">Reopen an accidental submission</h3></div><span><ShieldCheck size={14} aria-hidden="true" /> Only the selected student</span></header>
    <p>Let a student edit or finish selected sections with their saved answers. Each permission closes when those sections are submitted again.</p>
    <div className="exam-reentry-fields">
      <label>Assessment<select value={assessmentId} disabled={saving} onChange={event => { setAssessmentId(event.target.value); setStudentId(initialStudentId); setMessage(""); }}><option value="">Choose an assessment</option>{assessments.map(assessment => <option key={assessment.id} value={assessment.id}>{assessment.title}</option>)}</select></label>
      <label>Student<select value={studentId} disabled={!assessmentId || saving} onChange={event => { setStudentId(event.target.value); setMessage(""); }}><option value="">Choose a student</option>{eligibleStudents.map(student => <option key={student.id} value={student.id}>{student.fullName}</option>)}</select></label>
      <fieldset disabled={!status?.hasSubmission || loading || saving}><legend>Sections to reopen</legend>{(["english", "math"] as const).map(section => <label key={section}><input type="checkbox" checked={sections.includes(section)} onChange={event => setSections(current => event.target.checked ? [...current, section] : current.filter(item => item !== section))} />{section === "math" ? "Math" : "English"}</label>)}</fieldset>
      <label>Extra time (minutes)<input type="number" min={0} max={180} step={1} value={additionalMinutes} disabled={saving} onChange={event => setAdditionalMinutes(Number(event.target.value))} /><small>0 keeps the remaining 3-hour allowance.</small></label>
    </div>
    {loading ? <p role="status">Checking this student's submission…</p> : null}
    {status && !status.hasSubmission ? <p>This student has no submitted digital exam to reopen.</p> : null}
    {activeGrant ? <p className="exam-reentry-active">Re-entry open: {activeGrant.remainingSections.map(section => section === "math" ? "Math" : "English").join(" and ")} · {activeGrant.additionalMinutes} extra minutes · granted {new Date(activeGrant.grantedAt).toLocaleString()}</p> : null}
    <footer><button type="button" disabled={saving || loading || !status?.hasSubmission || !sections.length || !Number.isInteger(additionalMinutes) || additionalMinutes < 0 || additionalMinutes > 180} onClick={() => void update()}>{saving ? "Saving…" : activeGrant ? "Update re-entry permission" : "Allow re-entry"}</button>{activeGrant ? <button type="button" disabled={saving} onClick={() => void update(true)}>Revoke permission</button> : null}<small>The original submission is preserved. Older exams without recorded time need an explicit extra-time allowance.</small></footer>
    {message ? <p role="status">{message}</p> : null}
  </section>;
}
