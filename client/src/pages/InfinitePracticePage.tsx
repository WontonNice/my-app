import { StudentPortalShell } from "../components/StudentPortalShell";
import { CatalogPracticePlayer } from "../features/math-command/CatalogPracticePlayer";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";

export function InfinitePracticePage() {
  const { isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  if (isCheckingSession) return <main className="loading-shell">Loading infinite practice…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Sign in to open infinite practice.</main>;
  return <CatalogPracticePlayer renderOverview={overview => <StudentPortalShell activeId="materials" studentName={studentName} previewContext={previewContext} onSignOut={() => { void signOutCurrentAccount().then(() => window.location.assign("/login")); }}>{overview}</StudentPortalShell>} />;
}
