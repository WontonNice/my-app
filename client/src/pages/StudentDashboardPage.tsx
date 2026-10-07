import { useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { StudentLearningPlan } from "../components/StudentLearningPlan";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentAssessments, type StudentAssessment } from "../lib/api";
import { appendStudentPreview } from "../lib/studentPreview";

export function StudentDashboardPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [assessments, setAssessments] = useState<StudentAssessment[] | null>(null);
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    getStudentAssessments(accessToken).then(items => { if (active) setAssessments(items); }).catch(() => undefined);
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
      <header className="student-course-heading"><div><p>Study Hall</p><h1>Your next steps</h1><span>Your teacher's personalized homework, followed by resources you can explore.</span></div><AppLink href={link("/study-hall/shsat/assignments")}>All assignments <ArrowRight size={15} /></AppLink></header>
      <StudentLearningPlan accessToken={accessToken} previewContext={previewContext} compact />
      <section className="student-upcoming" aria-label="Available assessments"><header><h2>Available assessments</h2><AppLink href={link("/study-hall/shsat/assessments")}>Assessment library</AppLink></header><p>Availability does not mean homework was assigned. Your personalized tasks are listed above.</p>
        {openAssessments?.slice(0, 3).map(item => <article key={item.id}><div><strong>{item.title}</strong><small>{item.questionCount} questions · {item.durationMinutes} minutes</small></div><AppLink href={link(`/exam/${item.id}`)}>Open</AppLink></article>)}
        {openAssessments?.length === 0 && <p>No assessments are currently open.</p>}
      </section>
      <AppLink className="student-materials-callout" href={link("/study-hall/shsat/materials")}><div><BookOpen size={21} /><span><small>Independent study</small><strong>Browse English and Math by topic</strong><em>Practice, passage library, long reading, and assessment resources</em></span></div><ArrowRight size={20} /></AppLink>
    </div>
  </StudentPortalShell>;
}
