import { useEffect, useState } from "react";
import { BarChart3, BookOpen, CalendarDays, CheckCircle2, ClipboardList, Target, Zap } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentClasses } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { isSupabaseConfigured } from "../lib/supabase";
import { cacheStudentClasses, getActiveSession, getCachedStudentClasses, peekActiveSession } from "../lib/sessionCache";
import { getStudentClassNavigation } from "../lib/studentClassNavigation";
import { appendStudentPreview, getStudentPreviewContext } from "../lib/studentPreview";

export function StudentDashboardPage() {
  const previewContext = getStudentPreviewContext();
  const initialSession = peekActiveSession();
  const initialMetadata = initialSession?.user.user_metadata as { full_name?: string; name?: string } | undefined;
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured && !initialSession);
  const [studentName, setStudentName] = useState(previewContext.studentName || initialMetadata?.full_name || initialMetadata?.name || "Student");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getActiveSession().then(async (session) => {
      if (!session) {
        window.location.assign("/login");
        return;
      }

      const userRole = getUserRole(session.user);
      const metadata = session.user.user_metadata as { full_name?: string; name?: string };
      setStudentName(previewContext.studentName || metadata.full_name || metadata.name || "Student");

      if (userRole !== "student" && !(userRole === "teacher" && previewContext.isPreview)) {
        window.location.assign(getDashboardPath(userRole));
        return;
      }

      const classId = window.location.pathname.split("/").filter(Boolean)[1];

      if (classId && userRole !== "teacher") {
        try {
          const studentClasses = getCachedStudentClasses(session.user.id) ?? await getStudentClasses(session.access_token);
          cacheStudentClasses(session.user.id, studentClasses);
          const isInClass = studentClasses.some((studentClass) => studentClass.id === classId);

          if (!isInClass) {
            window.location.assign("/dashboard");
            return;
          }
        } catch {
          window.location.assign("/dashboard");
          return;
        }
      }

      setIsCheckingSession(false);
    });
  }, [previewContext.isPreview, previewContext.studentName]);

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      await signOutCurrentAccount();
    }

    window.location.assign("/");
  }

  if (isCheckingSession) {
    return <main className="loading-shell">Loading dashboard...</main>;
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="loading-shell">
        Supabase auth is not configured. Add your Vite Supabase env vars, then log in.
      </main>
    );
  }

  const navItems = getStudentClassNavigation(previewContext.query);

  return (
    <CorporateDashboardShell activeId="class" navItems={navItems} onSignOut={handleSignOut} profileName={studentName} profileRole={previewContext.isPreview ? `Viewing ${studentName}` : "Student account"} returnHref={previewContext.isPreview ? previewContext.returnHref : undefined} returnLabel="Teacher dashboard">
      <header className="staff-page-heading corporate-page-heading">
        <div><p><BookOpen size={15} /> Class portal</p><h1>SHSAT Prep</h1><span>Your assignments, practice tools, and progress for this class.</span></div>
      </header>
      <section className="staff-kpi-grid" aria-label="Class summary">
        <article><span><CheckCircle2 size={19} /></span><div><p>Completed</p><strong>8 <small>/ 12</small></strong></div><em>4 items remaining</em></article>
        <article><span><Zap size={19} /></span><div><p>Current streak</p><strong>7</strong></div><em>Days in a row</em></article>
        <article><span><BarChart3 size={19} /></span><div><p>Accuracy</p><strong>84%</strong></div><em>Up 6% this month</em></article>
        <article><span><CalendarDays size={19} /></span><div><p>Next session</p><strong>Sat</strong></div><em>10:00 AM</em></article>
      </section>
      <section className="student-portal-grid">
        <AppLink className="staff-panel student-portal-card" href={`/study-hall${previewContext.query}`}><span><Target size={21} /></span><div><small>Practice question catalog</small><h2>All SHSAT reading skills</h2><p>Practice Author's Point of View, inference, evidence, vocabulary, tone, and more.</p></div></AppLink>
        <AppLink className="staff-panel student-portal-card" href={`/practice/authors-point-of-view${previewContext.query}`}><span><ClipboardList size={21} /></span><div><small>Featured practice</small><h2>Author's Point of View</h2><p>Work through the complete question bank across all four difficulty levels.</p></div></AppLink>
        <AppLink className="staff-panel student-portal-card" href={appendStudentPreview("/study-hall?section=advanced", previewContext)}><span><BookOpen size={21} /></span><div><small>Advanced practice</small><h2>Passage catalog</h2><p>Browse every advanced close-reading passage by genre, skill, and difficulty.</p></div></AppLink>
        <article className="staff-panel student-upcoming-panel"><header><small>Upcoming</small><h2>This week</h2></header><div><span>Sat</span><p><strong>SHSAT class session</strong><small>10:00 AM · Rooms 201–204</small></p></div><div><span>Mon</span><p><strong>Practice review due</strong><small>11:59 PM · Online</small></p></div></article>
      </section>
    </CorporateDashboardShell>
  );
}
