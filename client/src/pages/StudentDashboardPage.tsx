import { LoginStreak } from "../features/account/LoginStreak";
import { StudentPracticeShelf } from "../features/math-command/StudentPracticeShelf";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { StudentLearningPlan } from "../components/StudentLearningPlan";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { StudentAnswerSheetList } from "../features/answer-sheets/StudentAnswerSheetList";
import { ShsatCountdown } from "../components/ShsatCountdown";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentAssessments, type StudentAssessment } from "../lib/api";
import { appendStudentPreview } from "../lib/studentPreview";
import { WontonCompanion } from "../components/WontonCompanion";
import "../styles/student-overview.css";

export function StudentDashboardPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [assessments, setAssessments] = useState<StudentAssessment[] | null>(null);
  const [assessmentError, setAssessmentError] = useState(false);
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    getStudentAssessments(accessToken).then(items => { if (active) setAssessments(items); }).catch(() => { if (active) setAssessmentError(true); });
    return () => { active = false; };
  }, [accessToken]);
  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }
  if (isCheckingSession) return <main className="loading-shell">Loading course portal...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;
  const openAssessments = assessments?.filter(item => item.status === "open");
  const link = (href: string) => appendStudentPreview(href, previewContext);
  return <StudentPortalShell activeId="home" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
    <div className="student-course-home">
      <header className="student-course-heading"><div><h1>Make today count.</h1><span>Welcome back, {studentName.split(' ')[0]}. Pick up your assignments, then explore something new.</span></div><AppLink href={link("/study-hall/shsat/assignments")}>All assignments <ArrowRight size={15} /></AppLink></header>
      <div className="student-overview-grid"><div className="student-overview-work">
        <StudentLearningPlan accessToken={accessToken} previewContext={previewContext} compact />
        <StudentAnswerSheetList token={accessToken} previewContext={previewContext} compact />
      </div><aside className="student-overview-aside" aria-label="Your classroom"><WontonCompanion previewContext={previewContext} /><ShsatCountdown />{!previewContext.isPreview && <LoginStreak />}</aside></div>
      <StudentPracticeShelf previewContext={previewContext}/>
      <section className="student-upcoming" aria-label="Available assessments"><header><h2>Available assessments</h2><AppLink href={link("/study-hall/shsat/assessments")}>Assessment library</AppLink></header><p>Availability does not mean homework was assigned. Your personalized tasks are listed above.</p>
        {openAssessments?.slice(0, 3).map(item => <article key={item.id}><div><strong>{item.title}</strong><small>{item.questionCount} questions · {item.durationMinutes} minutes</small></div><AppLink href={link(`/exam/${item.id}`)}>Open</AppLink></article>)}
        {openAssessments?.length === 0 && <p>No assessments are currently open.</p>}
        {!assessments && <p role={assessmentError ? 'alert' : 'status'}>{assessmentError ? 'Assessments could not be loaded. Open the assessment library to try again.' : 'Loading available assessments…'}</p>}
      </section>
      <AppLink className="student-materials-callout" href={link("/study-hall/shsat/materials")}><div><BookOpen size={21} /><span><small>Independent study</small><strong>Browse English and Math by topic</strong><em>Practice, passage library, long reading, and assessment resources</em></span></div><ArrowRight size={20} /></AppLink>
    </div>
  </StudentPortalShell>;
}
