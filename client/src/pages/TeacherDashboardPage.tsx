import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Activity, BarChart3, BookOpen, Bus, CheckCircle2, ChevronDown, ClipboardList, Clock3, LayoutDashboard, Pencil, Target, Trash2, UserRoundPlus, Users, X } from "lucide-react";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { hasSavedAdminSession, returnToSavedAdminSession } from "../lib/accountSwitching";
import {
  getTeacherAssessments,
  getTeacherStudentProgress,
  deleteStudentAccount,
  updateStudentDismissal,
  updateStudentAccount,
  updateTeacherAssessmentSplit,
  updateTeacherAssessmentStatus,
  type AssessmentStatus,
  type StudentProgressSnapshot,
  type TeacherAssessment,
} from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function labelFromSlug(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function examValue(result: Record<string, unknown>, key: string, fallback = "—") {
  const value = result[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function practiceSummary(progress: Record<string, unknown>) {
  const levels = Object.values(progress).filter((value): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value));
  const values = levels.length ? levels : [progress];
  return values.reduce<{ answered: number; correct: number }>((total, value) => ({
    answered: total.answered + (typeof value.answered === "number" ? value.answered : typeof value.total === "number" ? value.total : typeof value.questionsAnswered === "number" ? value.questionsAnswered : 0),
    correct: total.correct + (typeof value.correct === "number" ? value.correct : 0),
  }), { answered: 0, correct: 0 });
}

function questionTypeSummary(result: Record<string, unknown>) {
  if (!Array.isArray(result.questionTypes)) return [];
  return result.questionTypes.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const value = item as Record<string, unknown>;
    if (typeof value.questionType !== "string" || typeof value.correct !== "number" || typeof value.total !== "number") return [];
    return [{ correct: value.correct, label: labelFromSlug(value.questionType), total: value.total }];
  });
}

function localDateValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function displayPickupTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value;
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 1, hours, minutes)));
}

function vanRideLabel(value: StudentProgressSnapshot["dismissal"]["vanRide"]) {
  if (value === "2pm") return "Van · 2 PM";
  if (value === "5pm") return "Van · 5 PM";
  return "No van";
}

function StudentDetail({ student }: { student: StudentProgressSnapshot }) {
  return (
    <section className="teacher-student-detail" aria-label={`${student.fullName} record`}>
      <div className="teacher-panel-header"><div><span>Student record</span><h2>{student.fullName}</h2></div><p>Last login: {formatDate(student.lastLoginAt)}</p></div>
      <div className="teacher-insight-grid">
        <article><span>Test average</span><strong>{student.insights.averageTestScore === null ? "—" : `${student.insights.averageTestScore}%`}</strong></article>
        <article><span>Best score</span><strong>{student.insights.bestTestScore === null ? "—" : `${student.insights.bestTestScore}%`}</strong></article>
        <article><span>Tests taken</span><strong>{student.insights.testsCompleted}</strong></article>
        <article><span>Practice accuracy</span><strong>{student.insights.practiceAccuracy === null ? "—" : `${student.insights.practiceAccuracy}%`}</strong></article>
      </div>
      <h3 className="teacher-detail-heading">Test history</h3>
      <div className="teacher-results-table" role="table" aria-label={`${student.fullName} test history`}>
        <div className="teacher-results-row teacher-results-head" role="row"><span>Assessment</span><span>Date</span><span>Score</span><span>Correct</span></div>
        {student.progress.examResults.map((result, index) => (
          <div className="teacher-results-row" key={`${examValue(result, "assessmentId")}-${index}`} role="row">
            <strong>{examValue(result, "title", examValue(result, "assessmentId", "Assessment"))}<small>{result.completionStatus === "english_complete" ? "English submitted · Math pending" : "Complete"}</small></strong>
            <span>{typeof result.completedAt === "string" ? formatDate(result.completedAt) : "—"}</span>
            <strong>{examValue(result, "percentage")}%</strong>
            <span>{examValue(result, "correct")} / {examValue(result, "total")}{questionTypeSummary(result).map((item) => <small key={item.label}>{item.label}: {item.correct}/{item.total}</small>)}</span>
          </div>
        ))}
        {!student.progress.examResults.length && <p className="teacher-empty-state">No test results recorded yet.</p>}
      </div>
      <h3 className="teacher-detail-heading">Practice progress</h3>
      <div className="teacher-practice-grid">
        {Object.entries(student.progress.practice).map(([topic, progress]) => {
          const summary = practiceSummary(progress);
          return <article key={topic}><strong>{labelFromSlug(topic)}</strong><span>{summary.correct} correct</span><span>{summary.answered} questions</span></article>;
        })}
        {!Object.keys(student.progress.practice).length && <p className="teacher-empty-state">No practice activity recorded yet.</p>}
      </div>
    </section>
  );
}

export function TeacherDashboardPage() {
  const [accessToken, setAccessToken] = useState("");
  const [assessments, setAssessments] = useState<TeacherAssessment[]>([]);
  const [students, setStudents] = useState<StudentProgressSnapshot[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [message, setMessage] = useState("");
  const [savingStatusId, setSavingStatusId] = useState("");
  const [savingDismissalId, setSavingDismissalId] = useState("");
  const [pickupTimeDrafts, setPickupTimeDrafts] = useState<Record<string, string>>({});
  const [savingAccountId, setSavingAccountId] = useState("");
  const [editingStudentAccountId, setEditingStudentAccountId] = useState("");
  const [studentAccountDraft, setStudentAccountDraft] = useState({ fullName: "", password: "", username: "" });
  const [dismissalDate, setDismissalDate] = useState(localDateValue);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [canReturnToAdmin] = useState(hasSavedAdminSession);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    async function loadTeacherDashboard() {
      const { data } = await getSupabaseClient().auth.getSession();
      if (!data.session) { window.location.assign("/login"); return; }
      const userRole = getUserRole(data.session.user);
      const metadata = data.session.user.user_metadata as { full_name?: string; name?: string };
      setTeacherName(metadata.full_name ?? metadata.name ?? "Teacher");
      if (userRole !== "teacher") { window.location.assign(getDashboardPath(userRole)); return; }
      setAccessToken(data.session.access_token);
      try {
        const [nextAssessments, nextStudents] = await Promise.all([
          getTeacherAssessments(data.session.access_token),
          getTeacherStudentProgress(data.session.access_token),
        ]);
        setAssessments(nextAssessments);
        setStudents(nextStudents);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load the teacher dashboard.");
      } finally { setIsCheckingSession(false); }
    }
    loadTeacherDashboard();
  }, []);

  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const shsatStudents = useMemo(() => students.filter((student) => student.classes.includes("shsat")), [students]);
  useEffect(() => {
    setPickupTimeDrafts(Object.fromEntries(shsatStudents.map((student) => [student.id, student.dismissal.earlyPickupTimes[dismissalDate] ?? ""])));
  }, [dismissalDate, shsatStudents]);
  const classAverage = useMemo(() => {
    const values = students.map((student) => student.insights.averageTestScore).filter((value): value is number => value !== null);
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
  }, [students]);
  const assessmentAverages = useMemo(() => {
    const grouped = new Map<string, { scores: number[]; title: string }>();
    shsatStudents.forEach((student) => {
      student.progress.examResults.forEach((result) => {
        const assessmentId = examValue(result, "assessmentId", "unknown");
        const percentage = typeof result.percentage === "number" ? result.percentage : null;
        if (percentage === null) return;
        const current = grouped.get(assessmentId) ?? { scores: [], title: examValue(result, "title", assessmentId) };
        current.scores.push(percentage);
        grouped.set(assessmentId, current);
      });
    });
    return new Map(Array.from(grouped, ([assessmentId, value]) => [assessmentId, {
      average: Math.round(value.scores.reduce((sum, score) => sum + score, 0) / value.scores.length),
      submissions: value.scores.length,
      title: value.title,
    }]));
  }, [shsatStudents]);

  async function handleToggleAssessment(assessment: TeacherAssessment) {
    if (!accessToken) return;
    const nextStatus: AssessmentStatus = assessment.status === "open" ? "locked" : "open";
    setSavingStatusId(assessment.id); setMessage("");
    try {
      const updated = await updateTeacherAssessmentStatus(accessToken, assessment.id, nextStatus);
      setAssessments((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMessage(`${updated.title} is now ${updated.status}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update the assessment."); }
    finally { setSavingStatusId(""); }
  }

  async function handleToggleSplit(assessment: TeacherAssessment) {
    if (!accessToken) return;
    setSavingStatusId(assessment.id); setMessage("");
    try {
      const updated = await updateTeacherAssessmentSplit(accessToken, assessment.id, !assessment.split);
      setAssessments((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMessage(`${updated.title} will ${updated.split ? "run in two sessions" : "run as one continuous session"}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update the exam format."); }
    finally { setSavingStatusId(""); }
  }

  async function handleDismissalUpdate(
    student: StudentProgressSnapshot,
    input: { date?: string; pickedUpEarly?: boolean; pickupTime?: string; vanRide?: StudentProgressSnapshot["dismissal"]["vanRide"] },
  ) {
    if (!accessToken) return;
    setSavingDismissalId(student.id); setMessage("");
    try {
      const dismissal = await updateStudentDismissal(accessToken, student.id, input);
      setStudents((current) => current.map((item) => item.id === student.id ? { ...item, dismissal } : item));
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update dismissal information."); }
    finally { setSavingDismissalId(""); }
  }

  function beginEditingStudentAccount(student: StudentProgressSnapshot) {
    setEditingStudentAccountId(student.id);
    setStudentAccountDraft({ fullName: student.fullName, password: "", username: student.username || student.email.split("@")[0] || "" });
    setMessage("");
    document.getElementById("student-accounts")?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEditingStudentAccount() {
    setEditingStudentAccountId("");
    setStudentAccountDraft({ fullName: "", password: "", username: "" });
  }

  async function handleSaveStudentAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !editingStudentAccountId) return;
    setSavingAccountId(editingStudentAccountId);
    setMessage("");
    try {
      const updated = await updateStudentAccount(accessToken, editingStudentAccountId, studentAccountDraft);
      setStudents((current) => current.map((student) => student.id === updated.id ? { ...student, email: updated.email, fullName: updated.fullName, username: updated.username } : student));
      setMessage(`${updated.fullName}'s account was updated.`);
      cancelEditingStudentAccount();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update the student account.");
    } finally {
      setSavingAccountId("");
    }
  }

  async function handleDeleteStudentAccount(student: StudentProgressSnapshot) {
    if (!accessToken || !window.confirm(`Delete ${student.fullName}'s student account? This removes their login and saved progress.`)) return;
    setSavingAccountId(student.id);
    setMessage("");
    try {
      await deleteStudentAccount(accessToken, student.id);
      setStudents((current) => current.filter((item) => item.id !== student.id));
      if (selectedStudentId === student.id) setSelectedStudentId("");
      if (editingStudentAccountId === student.id) cancelEditingStudentAccount();
      setMessage(`${student.fullName}'s account was deleted.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete the student account.");
    } finally {
      setSavingAccountId("");
    }
  }

  async function handleSignOut() {
    if (isSupabaseConfigured) await getSupabaseClient().auth.signOut();
    window.location.assign("/");
  }

  async function handleReturnToAdmin() {
    setIsSwitchingAccount(true);
    setMessage("");
    try {
      await returnToSavedAdminSession();
      window.location.assign("/admin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not return to the administrator account.");
      setIsSwitchingAccount(false);
    }
  }

  if (isCheckingSession) return <main className="loading-shell">Loading teacher dashboard...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  const teacherStats = [
    { icon: Users, label: "SHSAT students", value: String(shsatStudents.length) },
    { icon: BarChart3, label: "Average test score", value: classAverage === null ? "—" : `${classAverage}%` },
    { icon: CheckCircle2, label: "Tests completed", value: String(students.reduce((sum, student) => sum + student.insights.testsCompleted, 0)) },
    { icon: BookOpen, label: "Open exams", value: String(assessments.filter((assessment) => assessment.status === "open").length) },
  ];
  const navItems = [
    { id: "overview", label: "Overview", href: "/teacher", icon: LayoutDashboard },
    { id: "students", label: "Student progress", href: "#students", icon: Activity },
    { id: "accounts", label: "Student accounts", href: "#student-accounts", icon: UserRoundPlus },
    { id: "dismissal", label: "Dismissal", href: "#dismissal", icon: Bus },
    { id: "assessments", label: "Assessments", href: "#assessments", icon: ClipboardList },
    { id: "student", label: "Student view", href: "/dashboard?preview=student&teacherTools=1", icon: Target },
  ];

  return (
    <CorporateDashboardShell activeId="overview" isSwitchingAccount={isSwitchingAccount} navItems={navItems} onSignOut={handleSignOut} onSwitchAccount={canReturnToAdmin ? handleReturnToAdmin : undefined} profileName={teacherName} profileRole="Teacher account" switchAccountLabel="Return to admin">
      <header className="staff-page-heading corporate-page-heading">
        <div><p><LayoutDashboard size={15} /> Teacher dashboard</p><h1>Student performance</h1><span>SHSAT enrollment, recent activity, test scores, and practice progress in one view.</span></div>
        <a className="corporate-heading-action" href="/dashboard?preview=student&teacherTools=1">Preview student view</a>
      </header>

      <section className="staff-kpi-grid" aria-label="Analytics summary">
        {teacherStats.map(({ icon: Icon, label, value }) => <article key={label}><span><Icon size={19} /></span><div><p>{label}</p><strong>{value}</strong></div><em>Live student data</em></article>)}
      </section>
      {message && <p className="teacher-message corporate-message">{message}</p>}

      <section className="teacher-panel teacher-roster-panel" id="students">
          <div className="teacher-panel-header"><div><span>Roster</span><h2>SHSAT student progress</h2></div><p>Tap a student to open their record here.</p></div>
          <div className="teacher-student-list">
            {shsatStudents.map((student) => {
              const isOpen = student.id === selectedStudent?.id;
              return <div className={`teacher-student-entry${isOpen ? " is-open" : ""}`} key={student.id}>
              <button aria-expanded={isOpen} onClick={() => setSelectedStudentId(isOpen ? "" : student.id)} type="button">
                <span className="teacher-student-avatar">{student.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                <span><strong>{student.fullName}</strong><small>{student.email}</small><small>Last login: {formatDate(student.lastLoginAt)}</small></span>
                <span className="teacher-score-badge">{student.insights.averageTestScore === null ? "—" : `${student.insights.averageTestScore}%`}<small>avg.</small></span>
                <ChevronDown className="teacher-roster-chevron" size={18} />
              </button>
              {isOpen && <StudentDetail student={student} />}
              </div>;
            })}
            {!shsatStudents.length && <p className="teacher-empty-state">No students are enrolled in SHSAT yet.</p>}
          </div>

      </section>

      <section className="teacher-panel teacher-staff-panel teacher-student-accounts-panel" id="student-accounts">
        <div className="teacher-panel-header"><div><span>Account access</span><h2>SHSAT student accounts</h2></div><p>Edit student names, usernames, and passwords or delete accounts that should no longer have access.</p></div>
        <div className="teacher-staff-layout">
          <form className="teacher-assessment-form teacher-staff-form" onSubmit={handleSaveStudentAccount}>
            <div className="admin-student-form-title"><UserRoundPlus size={18} /><strong>{editingStudentAccountId ? "Edit student account" : "Choose a student"}</strong></div>
            <label>Student name<input disabled={!editingStudentAccountId} required value={studentAccountDraft.fullName} onChange={(event) => setStudentAccountDraft({ ...studentAccountDraft, fullName: event.target.value })} /></label>
            <label>Username<input autoCapitalize="none" disabled={!editingStudentAccountId} minLength={3} pattern="[a-zA-Z0-9._-]+" required value={studentAccountDraft.username} onChange={(event) => setStudentAccountDraft({ ...studentAccountDraft, username: event.target.value.toLowerCase() })} /></label>
            <label>New password <small>Optional</small><input autoComplete="new-password" disabled={!editingStudentAccountId} minLength={6} type="password" value={studentAccountDraft.password} onChange={(event) => setStudentAccountDraft({ ...studentAccountDraft, password: event.target.value })} /></label>
            <div className="admin-account-form-actions">
              <button disabled={!editingStudentAccountId || savingAccountId === editingStudentAccountId} type="submit">{savingAccountId === editingStudentAccountId ? "Saving account" : "Save account"}</button>
              {editingStudentAccountId ? <button className="is-secondary" onClick={cancelEditingStudentAccount} type="button"><X size={15} /> Cancel</button> : null}
            </div>
          </form>
          <div className="teacher-staff-list" aria-label="SHSAT student accounts">
            {shsatStudents.length ? shsatStudents.map((student) => <article key={student.id}><span>{student.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span><div><strong>{student.fullName}</strong><small>Username: {student.username}</small><small>Email: {student.email}</small></div><div className="admin-account-actions"><button disabled={savingAccountId === student.id} onClick={() => beginEditingStudentAccount(student)} type="button"><Pencil size={14} /> Edit</button><button className="is-danger" disabled={savingAccountId === student.id} onClick={() => handleDeleteStudentAccount(student)} type="button"><Trash2 size={14} /> Delete</button></div></article>) : <p>No SHSAT student accounts found.</p>}
          </div>
        </div>
      </section>

      <section className="teacher-panel teacher-dismissal-panel" id="dismissal">
        <div className="teacher-panel-header">
          <div><span>Dismissal</span><h2>Pickup and van roster</h2></div>
          <label className="teacher-dismissal-date"><span>Roster date</span><input type="date" value={dismissalDate} onChange={(event) => setDismissalDate(event.target.value)} /></label>
        </div>
        <div className="teacher-dismissal-summary" aria-label="Dismissal summary">
          <span><Clock3 size={15} /> {shsatStudents.filter((student) => student.dismissal.earlyPickupDates.includes(dismissalDate)).length} early pickup</span>
          <span><Bus size={15} /> {shsatStudents.filter((student) => student.dismissal.vanRide === "2pm").length} at 2 PM</span>
          <span><Bus size={15} /> {shsatStudents.filter((student) => student.dismissal.vanRide === "5pm").length} at 5 PM</span>
        </div>
        <div className="teacher-dismissal-list">
          {shsatStudents.map((student) => {
            const pickedUpEarly = student.dismissal.earlyPickupDates.includes(dismissalDate);
            const pickupTime = pickupTimeDrafts[student.id] ?? "";
            const isSaving = savingDismissalId === student.id;
            return (
              <article key={student.id}>
                <span className="teacher-student-avatar">{student.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                <div className="teacher-dismissal-name"><strong>{student.fullName}</strong><span className={`teacher-van-indicator is-${student.dismissal.vanRide}`}>{pickedUpEarly && student.dismissal.earlyPickupTimes[dismissalDate] ? `Picked up ${displayPickupTime(student.dismissal.earlyPickupTimes[dismissalDate])}` : vanRideLabel(student.dismissal.vanRide)}</span></div>
                <label><span>Ride home</span><select aria-label={`${student.fullName} ride home`} disabled={isSaving} value={student.dismissal.vanRide} onChange={(event) => handleDismissalUpdate(student, { vanRide: event.target.value as StudentProgressSnapshot["dismissal"]["vanRide"] })}><option value="none">No van</option><option value="2pm">Van at 2 PM</option><option value="5pm">Van at 5 PM</option></select></label>
                <label><span>Time picked up</span><input aria-label={`${student.fullName} pickup time`} disabled={isSaving || !dismissalDate} type="time" value={pickupTime} onChange={(event) => setPickupTimeDrafts((current) => ({ ...current, [student.id]: event.target.value }))} /></label>
                <div className="teacher-dismissal-actions">
                  <button className={pickedUpEarly ? "is-early" : ""} disabled={isSaving || !dismissalDate || !pickupTime} onClick={() => handleDismissalUpdate(student, { date: dismissalDate, pickedUpEarly: true, pickupTime })} type="button"><CheckCircle2 size={16} />{pickedUpEarly ? "Save pickup time" : "Mark early pickup"}</button>
                  {pickedUpEarly ? <button className="is-clear" disabled={isSaving || !dismissalDate} onClick={() => handleDismissalUpdate(student, { date: dismissalDate, pickedUpEarly: false })} type="button">Clear</button> : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="teacher-panel teacher-class-averages" aria-labelledby="class-averages-title">
        <div className="teacher-panel-header"><div><span>Class insights</span><h2 id="class-averages-title">Overall average by test</h2></div><p>Calculated from all SHSAT student submissions.</p></div>
        <div className="teacher-results-table" role="table" aria-label="Overall class average by test">
          <div className="teacher-results-row teacher-class-average-row teacher-results-head" role="row"><span>Assessment</span><span>Submissions</span><span>Class average</span></div>
          {Array.from(assessmentAverages, ([assessmentId, result]) => (
            <div className="teacher-results-row teacher-class-average-row" key={assessmentId} role="row"><strong>{result.title}</strong><span>{result.submissions}</span><strong>{result.average}%</strong></div>
          ))}
          {!assessmentAverages.size && <p className="teacher-empty-state">No completed tests yet.</p>}
        </div>
      </section>

      <section className="teacher-panel" id="assessments">
        <div className="teacher-panel-header"><div><span>Assignments</span><h2>Exam access and sessions</h2></div><p>Open or lock each exam, and choose whether English and Math run separately.</p></div>
        <div className="teacher-assessment-list">
          {assessments.map((assessment) => {
            const classResult = assessmentAverages.get(assessment.id);
            return <article className="teacher-assessment-card" key={assessment.id}>
              <div><span className={`status-pill status-pill-${assessment.status}`}>{assessment.status}</span><small>{assessment.split ? "Split · 2 sessions" : "Continuous · 1 session"}</small><small>{assessment.durationMinutes} min</small></div>
              <h3>{assessment.title}</h3><p>{assessment.description || "No description yet."}</p>
              <dl><div><dt>Passages</dt><dd>{assessment.passages.length}</dd></div><div><dt>Questions</dt><dd>{assessment.questions.length}</dd></div><div><dt>Class average</dt><dd>{classResult ? `${classResult.average}%` : "—"}</dd></div><div><dt>Submissions</dt><dd>{classResult?.submissions ?? 0}</dd></div></dl>
              <div className="teacher-assessment-actions">
                <button disabled={savingStatusId === assessment.id} type="button" onClick={() => handleToggleAssessment(assessment)}>{assessment.status === "open" ? "Lock exam" : "Open exam"}</button>
                <button className="is-secondary" disabled={savingStatusId === assessment.id} type="button" onClick={() => handleToggleSplit(assessment)}>{assessment.split ? "Make one session" : "Split English / Math"}</button>
              </div>
            </article>;
          })}
        </div>
      </section>
    </CorporateDashboardShell>
  );
}
