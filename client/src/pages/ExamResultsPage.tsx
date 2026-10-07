import { useEffect, useState } from "react";
import { getLearningProgress, getStudentAssessments, getStudentPreviewResults } from "../lib/api";
import { getExamResult, replaceExamResults, type ExamResult } from "../lib/examResults";
import { appendStudentPreview } from "../lib/studentPreview";
import { isSupabaseConfigured } from "../lib/supabase";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { getActiveSession } from "../lib/sessionCache";
import { examCorrectionsHref } from "../lib/correctionNavigation";

function getAssessmentIdFromResultsPath() {
  return window.location.pathname.split("/").filter(Boolean)[1] ?? "";
}

function getDashboardHref() {
  return appendStudentPreview("/study-hall/shsat/assessments");
}

function getAssessmentHref(assessmentId: string) {
  return appendStudentPreview(`/exam/${assessmentId}`);
}

export function ExamResultsPage() {
  const { accessToken, previewContext } = useStudentPortalAccess();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [correctionsOpen, setCorrectionsOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    void getActiveSession().then(async session => {
      if (!session) return;
      const id = getAssessmentIdFromResultsPath();
      if (previewContext.isPreview) {
        if (!previewContext.studentId) throw new Error("Select a student to preview their results.");
        const data = await getStudentPreviewResults(accessToken, previewContext.studentId);
        if (active) { setResult(data.results.find(item => item.assessmentId === id) || null); setCorrectionsOpen(data.assessments.find(item => item.id === id)?.correctionsOpen === true); }
      } else {
        const [assessments, progress] = await Promise.all([getStudentAssessments(accessToken), getLearningProgress(accessToken)]);
        replaceExamResults(session.user.id, progress.examResults as unknown as ExamResult[]);
        if (active) { setResult(getExamResult(session.user.id, id)); setCorrectionsOpen(assessments.find(item => item.id === id)?.correctionsOpen === true); }
      }
    }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Results could not be loaded."); }).finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [accessToken, previewContext.isPreview, previewContext.studentId]);

  if (isLoading) {
    return <main className="loading-shell">Loading assessment status...</main>;
  }

  if (!result) {
    return (
      <main className="results-page-shell">
        <section className="results-missing-card">
          <p>Assessment status</p>
          <h1>No completion record was found.</h1>{error && <p role="alert">{error}</p>}
          <a href={getDashboardHref()}>Return to assessments</a>
        </section>
      </main>
    );
  }

  const englishOnly = result.completionStatus === "english_complete";
  const mathOnly = result.completionStatus === "math_complete";
  const sectionOnly = englishOnly || mathOnly;
  const completedSection = englishOnly ? "English" : "Math";
  const nextSection = englishOnly ? "Math" : "English";

  return (
    <main className="results-page-shell">
      <header className="results-page-header">
        <div>
          <p>Assessment status</p>
          <h1>{result.title}</h1>
          <span>{new Date(result.completedAt).toLocaleString()}</span>
        </div>
        <a href={getDashboardHref()}>Back to assessments</a>
      </header>

      <section className="results-missing-card">
        <p>{sectionOnly ? "Section complete" : "Complete"}</p>
        <h1>{sectionOnly ? `${completedSection} is complete. ${nextSection} is next.` : "Your assessment is complete."}</h1>
        <span>
          {sectionOnly
            ? `Your ${completedSection} answers are saved. Continue to ${nextSection} when it opens.`
            : "Your answers were submitted. Your teacher can view your score from the teacher dashboard."}
        </span>
        <a href={sectionOnly ? getAssessmentHref(result.assessmentId) : getDashboardHref()}>
          {sectionOnly ? "Continue assessment" : "Return to assessments"}
        </a>
        {correctionsOpen ? <a href={examCorrectionsHref(result.assessmentId)}>Corrections →</a> : <button type="button" disabled>Corrections locked by your teacher</button>}
      </section>
    </main>
  );
}
