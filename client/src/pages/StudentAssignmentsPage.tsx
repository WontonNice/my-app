import { StudentLearningPlan } from "../components/StudentLearningPlan";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";

export function StudentAssignmentsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }
  if (isCheckingSession) return <main className="loading-shell">Loading assignments...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;
  return <StudentPortalShell activeId="assignments" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
    <div className="student-section-page">
      <header className="student-section-heading"><div><p>Teacher-assigned work</p><h1>Assignments</h1><span>Platform practice, passage work, and external homework assigned specifically to you.</span></div></header>
      <StudentLearningPlan accessToken={accessToken} previewContext={previewContext} />
    </div>
  </StudentPortalShell>;
}
