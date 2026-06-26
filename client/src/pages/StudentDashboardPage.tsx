import { useEffect, useState } from "react";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { featuredSlides, navItems } from "../content/landingPage";
import { getStudentClasses } from "../lib/api";
import { getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

const isStudentPreview = new URLSearchParams(window.location.search).get("preview") === "student";

export function StudentDashboardPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);

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

      if (userRole === "teacher" && !isStudentPreview) {
        window.location.assign("/teacher");
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

  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Student dashboard navigation">
        <a className="site-logo" href="/dashboard">
          Nathan Tutors
        </a>
        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>
        {isStudentPreview ? (
          <a className="dashboard-signout" href="/teacher">
            Teacher dashboard
          </a>
        ) : (
          <button className="dashboard-signout" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        )}
      </header>

      <FeaturedCarousel slides={featuredSlides} />
    </main>
  );
}
