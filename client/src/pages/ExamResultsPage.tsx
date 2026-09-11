import { useEffect, useState } from "react";
import { getLearningProgress, getStudentAssessments } from "../lib/api";
import { getExamResult, replaceExamResults, type ExamResult } from "../lib/examResults";
import { appendStudentPreview } from "../lib/studentPreview";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

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
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [correctionsOpen, setCorrectionsOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getSupabaseClient().auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const [assessments, progress] = await Promise.allSettled([
        getStudentAssessments(data.session.access_token),
        getLearningProgress(data.session.access_token),
      ]);
      if (assessments.status === "fulfilled") {
        setCorrectionsOpen(assessments.value.find(item => item.id === getAssessmentIdFromResultsPath())?.correctionsOpen === true);
      }
      if (progress.status === "fulfilled" && progress.value.examResults.length > 0) {
        replaceExamResults(data.session.user.id, progress.value.examResults as unknown as ExamResult[]);
      }
      setResult(getExamResult(data.session.user.id, getAssessmentIdFromResultsPath()));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <main className="loading-shell">Loading assessment status...</main>;
  }

  if (!result) {
    return (
      <main className="results-page-shell">
        <section className="results-missing-card">
          <p>Assessment status</p>
          <h1>No completion record was found.</h1>
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
        {correctionsOpen ? <a href={`/results/${encodeURIComponent(result.assessmentId)}/corrections`}>Corrections →</a> : <button type="button" disabled>Corrections locked by your teacher</button>}
      </section>
    </main>
  );
}
