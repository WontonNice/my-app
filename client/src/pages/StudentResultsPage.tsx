import { hasFullyAnsweredExam } from "../../../server/src/shared/examCorrectionAccess";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2 } from "lucide-react";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getLearningProgress, getStudentAssessments, getStudentPreviewResults, type StudentAssessment } from "../lib/api";
import { AppLink } from "../components/AppLink";
import { examCorrectionsHref } from "../lib/correctionNavigation";
import { getExamResults, type ExamResult } from "../lib/examResults";
import { peekActiveSession } from "../lib/sessionCache";
import { filterResults, type ResultSort } from "../lib/resultFilters";
import "../styles/student-results.css";

function isExamResult(value: Record<string, unknown>): value is ExamResult & Record<string, unknown> {
  return typeof value.assessmentId === "string" && typeof value.title === "string" && typeof value.percentage === "number";
}

export function StudentResultsPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const initialSession = peekActiveSession();
  const [results, setResults] = useState<ExamResult[]>(() => initialSession && !previewContext.isPreview ? getExamResults(initialSession.user.id) : []);
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ name: "", from: "", to: "", sort: "date-desc" as ResultSort });
  const visibleResults = useMemo(() => filterResults(results, filters), [results, filters]);

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    if (previewContext.isPreview) {
      if (!previewContext.studentId) return;
      getStudentPreviewResults(accessToken, previewContext.studentId).then(data => { if (isMounted) { setResults(data.results); setAssessments(data.assessments); setError(""); } }).catch(reason => { if (isMounted) setError(reason instanceof Error ? reason.message : "Student results could not be loaded."); });
      return () => { isMounted = false; };
    }
    getStudentAssessments(accessToken).then(data => { if (isMounted) setAssessments(data); }).catch(() => undefined);
    getLearningProgress(accessToken).then((progress) => {
      const cloudResults = progress.examResults.filter(isExamResult) as ExamResult[];
      if (isMounted) setResults(cloudResults);
    }).catch(() => { if (isMounted) setError("Latest results could not be loaded. Refresh to retry; saved results are shown below."); });
    return () => { isMounted = false; };
  }, [accessToken, previewContext.isPreview, previewContext.studentId]);

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
        <header className="student-section-heading"><div><h1>Results</h1><span>Review your submissions and subject scores.</span></div><strong>{average === null ? "No results yet" : `${average}% average`}</strong></header>
        {error && <p role="alert">{error}</p>}
        {previewContext.isPreview && !previewContext.studentId && <p>Select a student to preview their results.</p>}
        <div className="student-results-filters" role="search" aria-label="Filter results">
          <label>Test name<input type="search" placeholder="Search tests" value={filters.name} onChange={event => setFilters({ ...filters, name: event.target.value })} /></label>
          <label>Taken from<input type="date" value={filters.from} max={filters.to || undefined} onChange={event => setFilters({ ...filters, from: event.target.value })} /></label>
          <label>Taken through<input type="date" value={filters.to} min={filters.from || undefined} onChange={event => setFilters({ ...filters, to: event.target.value })} /></label>
          <label>Sort by<select value={filters.sort} onChange={event => setFilters({ ...filters, sort: event.target.value as ResultSort })}><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="score-desc">Score: high to low</option><option value="score-asc">Score: low to high</option><option value="name">Test name: A–Z</option></select></label>
          <button type="button" onClick={() => setFilters({ name: "", from: "", to: "", sort: "date-desc" })}>Reset filters</button>
        </div>
        <p className="student-results-count" role="status">{visibleResults.length} of {results.length} results · Submission dates in New York time</p>
        {results.length > 0 ? (
          <section className="student-results-list" aria-label="Assessment results">
            {!visibleResults.length && <p>No results match these filters. Try a different test name or date range.</p>}
            {visibleResults.map((result) => (
              <article key={result.assessmentId}>
                <div className="student-result-score"><strong>{result.percentage}%</strong><span>{result.correct} of {result.total}</span></div>
                <div><small>{result.completionStatus === "complete" ? "Complete" : "Section submitted"}</small><h2>{result.title}</h2><p>Submitted <time dateTime={result.completedAt}>{Number.isFinite(Date.parse(result.completedAt)) ? new Date(result.completedAt).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' }) : 'Date unavailable'}</time></p></div>
                <div className="student-result-subjects">{(Array.isArray(result.subjects) ? result.subjects : []).map((subject) => <span key={subject.subject}><small>{subject.subject === "Mathematics" ? "Math" : "English"}</small><strong>{subject.correct} / {subject.total}</strong></span>)}</div>
                <div className="student-result-correction-action"><CheckCircle2 size={20} />{result.source === "answer_sheet" && (result as ExamResult & { answerSheet?: { assignmentId?: string } }).answerSheet?.assignmentId ? <AppLink href={`/answer-sheets/${(result as ExamResult & { answerSheet: { assignmentId: string } }).answerSheet.assignmentId}`}>Answer-sheet results →</AppLink> : (assessments.find(item => item.id === result.assessmentId)?.correctionsOpen || hasFullyAnsweredExam(result)) ? <AppLink href={examCorrectionsHref(result.assessmentId, previewContext)}>Corrections →</AppLink> : <button type="button" disabled title="Your teacher must open corrections first">Corrections locked</button>}</div>
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
