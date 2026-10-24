import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { GameRooms } from "../features/games/GameRooms";

export function StudentGameRoomsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  if (isCheckingSession) return <main className="loading-shell">Loading game rooms…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Sign in to join live game rooms.</main>;
  return <StudentPortalShell activeId="games" studentName={studentName} previewContext={previewContext} onSignOut={() => { void signOutCurrentAccount().then(() => window.location.assign("/")); }}><div className="student-section-page">{previewContext.isPreview ? <p>Use your teacher Game rooms tab to host. Students join from their own accounts.</p> : <GameRooms accessToken={accessToken} />}</div></StudentPortalShell>;
}
