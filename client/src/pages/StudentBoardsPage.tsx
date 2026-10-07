import { BoardLibrary } from "../features/boards/BoardLibrary";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";

export function StudentBoardsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  if (isCheckingSession) return <main className="loading-shell">Loading boards…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Configure Supabase and sign in to open private student boards.</main>;
  return <StudentPortalShell activeId="boards" studentName={studentName} previewContext={previewContext} onSignOut={() => { void signOutCurrentAccount().then(() => window.location.assign("/")); }}><div className="student-section-page"><BoardLibrary accessToken={accessToken} studentId={previewContext.isPreview ? previewContext.studentId : undefined} studentName={studentName} teacher={previewContext.isPreview} /></div></StudentPortalShell>;
}
