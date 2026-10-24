import { Achievements } from "../features/achievements/Achievements";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";

export function StudentAchievementsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  if (isCheckingSession) return <main className="loading-shell">Loading achievements…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Sign in to see your achievements.</main>;
  return <StudentPortalShell activeId="achievements" studentName={studentName} previewContext={previewContext} onSignOut={() => { void signOutCurrentAccount().then(() => window.location.assign("/")); }}><div className="student-section-page">{previewContext.isPreview ? <p>Achievements are calculated from each student's submitted Math results. Open Achievement studio in your teacher dashboard to preview the design.</p> : <Achievements accessToken={accessToken} />}</div></StudentPortalShell>;
}
