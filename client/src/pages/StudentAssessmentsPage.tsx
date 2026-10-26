import { useEffect, useState } from "react";
import { StudentAssessmentLibrary } from "../components/StudentAssessmentLibrary";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentAssessments, type StudentAssessment } from "../lib/api";

export function StudentAssessmentsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    getStudentAssessments(accessToken).then(items => { if (isMounted) { setAssessments(items); setError(false); } })
      .catch(() => { if (isMounted) setError(true); }).finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [accessToken, reload]);

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading assessments...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  return (
    <StudentPortalShell activeId="assessments" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      <StudentAssessmentLibrary assessments={assessments} previewContext={previewContext} loading={loading} error={error} onRetry={() => { setLoading(true); setError(false); setReload(value => value + 1); }} />
    </StudentPortalShell>
  );
}
