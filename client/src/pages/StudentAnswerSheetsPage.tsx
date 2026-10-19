import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { StudentAnswerSheetList } from "../features/answer-sheets/StudentAnswerSheetList";

export function StudentAnswerSheetsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  if (isCheckingSession) return <main className="loading-shell">Loading answer sheets…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Sign in to see your answer sheets.</main>;
  return <StudentPortalShell activeId="answer-sheets" previewContext={previewContext} studentName={studentName} onSignOut={async () => { await signOutCurrentAccount(); window.location.assign("/"); }}>
    <div className="student-course-home"><header className="student-course-heading"><div><p>Paper & PDF tests</p><h1>Answer sheets</h1><span>Open a sheet, enter your answers, then review and submit. Your progress saves automatically.</span></div></header><StudentAnswerSheetList token={accessToken} previewContext={previewContext} /></div>
  </StudentPortalShell>;
}
