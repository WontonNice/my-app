import { Achievements } from "../features/achievements/Achievements";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";

export function StudentAchievementsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  if (isCheckingSession) return <main className="loading-shell">Loading achievements…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Sign in to see your achievements.</main>;
  return <StudentPortalShell activeId="achievements" studentName={studentName} previewContext={previewContext} onSignOut={() => { void signOutCurrentAccount().then(() => window.location.assign("/")); }}><div className="student-section-page">{previewContext.isPreview ? <p>Achievements use each student's submitted results and daily logins. The English badge counts official practice tests only; Prestige tests are excluded. Seven consecutive login days earn the streak badge. Open Achievement studio in your teacher dashboard to preview the designs.</p> : <Achievements accessToken={accessToken} />}</div></StudentPortalShell>;
}
