import { useEffect, useState } from "react";
import { BarChart3, BookOpen, CalendarDays, CheckCircle2, ClipboardList, GraduationCap, LayoutDashboard, Target, Zap } from "lucide-react";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { getStudentClasses } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

const isStudentPreview = new URLSearchParams(window.location.search).get("preview") === "student";
const previewQuery = isStudentPreview ? "?preview=student&teacherTools=1" : "";

export function StudentDashboardPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getSupabaseClient().auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const userRole = getUserRole(data.session.user);
      const metadata = data.session.user.user_metadata as { full_name?: string; name?: string };
      setStudentName(metadata.full_name ?? metadata.name ?? "Student");

      if (userRole !== "student" && !(userRole === "teacher" && isStudentPreview)) {
        window.location.assign(getDashboardPath(userRole));
        return;
      }

      const classId = window.location.pathname.split("/").filter(Boolean)[1];

      if (classId && userRole !== "teacher") {
        try {
          const studentClasses = await getStudentClasses(data.session.access_token);
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
  }, []);

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      await getSupabaseClient().auth.signOut();
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

  const classId = window.location.pathname.split("/").filter(Boolean)[1] ?? "shsat";
  const navItems = [
    { id: "dashboard", label: "Dashboard", href: `/dashboard${previewQuery}`, icon: LayoutDashboard },
    { id: "class", label: "Class portal", href: `/study-hall/${classId}${previewQuery}`, icon: GraduationCap },
    { id: "practice", label: "Practice", href: `/study-hall${previewQuery}`, icon: Target },
    { id: "progress", label: "Progress", href: `/study-hall/${classId}${previewQuery}`, icon: BarChart3 },
  ];

  return (
    <CorporateDashboardShell activeId="class" navItems={navItems} onSignOut={handleSignOut} profileName={studentName} profileRole={isStudentPreview ? "Teacher preview" : "Student account"} returnHref={isStudentPreview ? "/teacher" : undefined} returnLabel="Teacher dashboard">
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
        <a className="staff-panel student-portal-card" href={`/study-hall${previewQuery}`}><span><Target size={21} /></span><div><small>Practice question catalog</small><h2>All SHSAT reading skills</h2><p>Practice Author's Point of View, inference, evidence, vocabulary, tone, and more.</p></div></a>
        <a className="staff-panel student-portal-card" href={`/practice/authors-point-of-view${previewQuery}`}><span><ClipboardList size={21} /></span><div><small>Featured practice</small><h2>Author's Point of View</h2><p>Work through the complete question bank across all four difficulty levels.</p></div></a>
        <a className="staff-panel student-portal-card" href={`/study-hall?section=advanced${isStudentPreview ? "&preview=student&teacherTools=1" : ""}`}><span><BookOpen size={21} /></span><div><small>Advanced practice</small><h2>Passage catalog</h2><p>Browse every advanced close-reading passage by genre, skill, and difficulty.</p></div></a>
        <article className="staff-panel student-upcoming-panel"><header><small>Upcoming</small><h2>This week</h2></header><div><span>Sat</span><p><strong>SHSAT class session</strong><small>10:00 AM · Rooms 201–204</small></p></div><div><span>Mon</span><p><strong>Practice review due</strong><small>11:59 PM · Online</small></p></div></article>
      </section>
    </CorporateDashboardShell>
  );
}
