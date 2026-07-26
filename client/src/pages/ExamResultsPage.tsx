import { useEffect, useState } from "react";
import { getLearningProgress } from "../lib/api";
import { getExamResult, replaceExamResults, type ExamResult } from "../lib/examResults";
import { appendStudentPreview } from "../lib/studentPreview";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

function getAssessmentIdFromResultsPath() {
  return window.location.pathname.split("/").filter(Boolean)[1] ?? "";
}

function getDashboardHref() {
  return appendStudentPreview("/study-hall?section=assessments");
}

function getAssessmentHref(assessmentId: string) {
  return appendStudentPreview(`/exam/${assessmentId}`);
}

export function ExamResultsPage() {
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getSupabaseClient().auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      try {
        const cloudProgress = await getLearningProgress(data.session.access_token);
        if (cloudProgress.examResults.length > 0) {
          replaceExamResults(data.session.user.id, cloudProgress.examResults as unknown as ExamResult[]);
        }
      } catch {
        // Use the device completion record when cloud storage is temporarily unavailable.
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
        <p>{englishOnly ? "Section complete" : "Complete"}</p>
        <h1>{englishOnly ? "English is complete. Math is next." : "Your assessment is complete."}</h1>
        <span>
          {englishOnly
            ? "Your English answers are saved. Continue to Math when it opens."
            : "Your answers were submitted. Your teacher can view your score from the teacher dashboard."}
        </span>
        <a href={englishOnly ? getAssessmentHref(result.assessmentId) : getDashboardHref()}>
          {englishOnly ? "Continue assessment" : "Return to assessments"}
        </a>
      </section>
    </main>
  );
}
