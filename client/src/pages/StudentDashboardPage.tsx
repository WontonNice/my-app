import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, ClipboardList, Megaphone } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentAssessments, type StudentAssessment } from "../lib/api";
import { appendStudentPreview } from "../lib/studentPreview";

export function StudentDashboardPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    getStudentAssessments(accessToken).then((nextAssessments) => {
      if (isMounted) setAssessments(nextAssessments);
    }).catch(() => undefined);
    return () => { isMounted = false; };
  }, [accessToken]);

  const openAssessments = useMemo(() => assessments.filter((assessment) => assessment.status === "open"), [assessments]);
  const today = useMemo(() => new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", weekday: "long" }).format(new Date()), []);

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading course portal...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  const practiceHref = appendStudentPreview("/practice/authors-point-of-view", previewContext);
  const materialsHref = appendStudentPreview("/study-hall/shsat/materials", previewContext);
  const englishMaterialsHref = appendStudentPreview("/study-hall/shsat/materials?subject=english", previewContext);
  const assignmentsHref = appendStudentPreview("/study-hall/shsat/assignments", previewContext);
  const assessmentsHref = appendStudentPreview("/study-hall/shsat/assessments", previewContext);

  return (
    <StudentPortalShell activeId="home" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      <div className="student-course-home">
        <header className="student-course-heading">
          <div><p>{today}</p><h1>Your work for this week</h1><span>Everything below was posted, assigned, or organized by your teacher.</span></div>
          <AppLink href={assignmentsHref}>View all assignments <ArrowRight size={15} /></AppLink>
        </header>

        <div className="student-course-layout">
          <div className="student-course-primary">
            <section className="student-current-assignment" aria-labelledby="current-assignment-title">
              <div>
                <p>Continue practice</p><h2 id="current-assignment-title">Author&apos;s Point of View</h2><span>Reading comprehension · Medium · 10 questions</span>
                <div className="student-assignment-progress" aria-label="6 of 10 questions complete" role="progressbar" aria-valuemax={10} aria-valuemin={0} aria-valuenow={6}><span /></div>
                <small>6 of 10 complete</small>
              </div>
              <AppLink href={practiceHref}>Continue</AppLink>
            </section>

            <section className="student-upcoming" id="coming-up" aria-labelledby="coming-up-title">
              <header><h2 id="coming-up-title">Coming up</h2><AppLink href={assignmentsHref}>Open assignments</AppLink></header>
              <article><div><span>Study guide</span><strong>Reading Skills Review</strong><small>English · Reading comprehension</small></div><AppLink href={englishMaterialsHref}>Open</AppLink></article>
              {openAssessments.length > 0 ? openAssessments.slice(0, 2).map((assessment) => (
                <article key={assessment.id}><div><span>Assessment</span><strong>{assessment.title}</strong><small>{assessment.questionCount} questions · {assessment.durationMinutes} minutes</small></div><AppLink href={appendStudentPreview(`/exam/${assessment.id}`, previewContext)}>Details</AppLink></article>
              )) : (
                <article><div><span>Assessments</span><strong>No assessment is open right now</strong><small>Your teacher will make the next test available when it is time.</small></div><AppLink href={assessmentsHref}>View</AppLink></article>
              )}
            </section>

            <AppLink className="student-materials-callout" href={materialsHref}>
              <div><BookOpen size={21} /><span><small>Study Hall</small><strong>Browse English and Math by topic</strong><em>Focused practice, a passage library, long reading, and assessment resources</em></span></div><ArrowRight size={20} />
            </AppLink>
          </div>

          <aside className="student-course-aside">
            <section className="student-teacher-announcement" aria-labelledby="teacher-announcement-title">
              <Megaphone size={19} /><p>Teacher announcement</p><h2 id="teacher-announcement-title">Prepare before your next assessment</h2><span>Complete the Reading Skills Review and bring your calculator when your teacher opens the next form.</span><AppLink href={englishMaterialsHref}>Open review materials <ArrowRight size={14} /></AppLink>
            </section>
            <section className="student-course-progress" aria-labelledby="course-progress-title">
              <p>Course progress</p><div><strong id="course-progress-title">68%</strong><span>of assigned coursework complete</span></div>
              <div className="student-progress-track" aria-label="68 percent complete" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={68}><span /></div>
              <dl><div><dt>Completed</dt><dd>8</dd></div><div><dt>In progress</dt><dd>2</dd></div><div><dt>Open assessments</dt><dd>{openAssessments.length}</dd></div></dl>
            </section>
            <section className="student-recent-activity" aria-labelledby="recent-activity-title">
              <p id="recent-activity-title">Recent activity</p><div><CheckCircle2 size={17} /><span><strong>Inference · Hard</strong><small>Completed · 8/10</small></span></div><div><ClipboardList size={17} /><span><strong>Vocabulary Review</strong><small>Opened recently</small></span></div><div><CalendarDays size={17} /><span><strong>Course calendar</strong><small>Teacher-managed schedule</small></span></div>
            </section>
          </aside>
        </div>
      </div>
    </StudentPortalShell>
  );
}
