import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2 } from "lucide-react";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getLearningProgress } from "../lib/api";
import { getExamResults, type ExamResult } from "../lib/examResults";
import { peekActiveSession } from "../lib/sessionCache";

function isExamResult(value: Record<string, unknown>): value is ExamResult & Record<string, unknown> {
  return typeof value.assessmentId === "string" && typeof value.title === "string" && typeof value.percentage === "number";
}

export function StudentResultsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const initialSession = peekActiveSession();
  const [results, setResults] = useState<ExamResult[]>(() => initialSession ? getExamResults(initialSession.user.id) : []);

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    getLearningProgress(accessToken).then((progress) => {
      const cloudResults = progress.examResults.filter(isExamResult) as ExamResult[];
      if (isMounted && cloudResults.length > 0) setResults(cloudResults);
    }).catch(() => undefined);
    return () => { isMounted = false; };
  }, [accessToken]);

  const average = useMemo(() => results.length ? Math.round(results.reduce((sum, result) => sum + result.percentage, 0) / results.length) : null, [results]);

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading results...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  return (
    <StudentPortalShell activeId="results" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      <div className="student-section-page">
        <header className="student-section-heading"><div><p>Performance history</p><h1>Results</h1><span>Review completed assessments and the subject scores shared with your teacher.</span></div><strong>{average === null ? "No results yet" : `${average}% average`}</strong></header>
        {results.length > 0 ? (
          <section className="student-results-list" aria-label="Assessment results">
            {results.map((result) => (
              <article key={result.assessmentId}>
                <div className="student-result-score"><strong>{result.percentage}%</strong><span>{result.correct} of {result.total}</span></div>
                <div><small>{result.completionStatus === "complete" ? "Complete" : "In progress"}</small><h2>{result.title}</h2><p>{new Date(result.completedAt).toLocaleDateString()}</p></div>
                <div className="student-result-subjects">{result.subjects.map((subject) => <span key={subject.subject}><small>{subject.subject === "Mathematics" ? "Math" : "English"}</small><strong>{subject.correct} / {subject.total}</strong></span>)}</div>
                <CheckCircle2 size={20} />
              </article>
            ))}
          </section>
        ) : (
          <section className="student-section-empty"><BarChart3 size={28} /><h2>No completed assessments yet</h2><p>Results will appear here after you submit work and your teacher makes it available.</p></section>
        )}
      </div>
    </StudentPortalShell>
  );
}
