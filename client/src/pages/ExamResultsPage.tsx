import { useEffect, useState, type CSSProperties } from "react";
import { getExamResult, type ExamResult, type ExamSubjectResult } from "../lib/examResults";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

function getAssessmentIdFromResultsPath() {
  return window.location.pathname.split("/").filter(Boolean)[1] ?? "";
}

function getDashboardHref() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("preview") === "student" && searchParams.get("teacherTools") === "1"
    ? "/study-hall?preview=student&teacherTools=1"
    : "/study-hall";
}

function SubjectTopicBreakdown({ subjectResult }: { subjectResult: ExamSubjectResult }) {
  const subjectPercentage = Math.round((subjectResult.correct / subjectResult.total) * 100);

  return (
    <section className="results-topic-panel" aria-labelledby={`topic-breakdown-${subjectResult.subject}`}>
      <div className="results-topic-heading">
        <div>
          <p>Category breakdown</p>
          <h2 id={`topic-breakdown-${subjectResult.subject}`}>{subjectResult.subject}</h2>
        </div>
        <span>
          {subjectResult.correct}/{subjectResult.total} correct ({subjectPercentage}%)
        </span>
      </div>

      <div className="results-topic-list">
        {subjectResult.topics.map((topicResult) => {
          const percentage = Math.round((topicResult.correct / topicResult.total) * 100);

          return (
            <article className="results-topic-row" key={topicResult.topic}>
              <div>
                <h3>{topicResult.topic}</h3>
                <strong>{topicResult.correct}/{topicResult.total} correct</strong>
              </div>
              <div className="results-topic-track" aria-label={`${percentage}% correct`}>
                <span style={{ width: `${percentage}%` }} />
              </div>
              <span>{percentage}%</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ExamResultsPage() {
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getSupabaseClient().auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      setResult(getExamResult(data.session.user.id, getAssessmentIdFromResultsPath()));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <main className="loading-shell">Loading results...</main>;
  }

  if (!result) {
    return (
      <main className="results-page-shell">
        <section className="results-missing-card">
          <p>Test results</p>
          <h1>No saved result was found.</h1>
          <a href={getDashboardHref()}>Return to dashboard</a>
        </section>
      </main>
    );
  }

  return (
    <main className="results-page-shell">
      <header className="results-page-header">
        <div>
          <p>Assessment results</p>
          <h1>{result.title}</h1>
          <span>Completed {new Date(result.completedAt).toLocaleString()}</span>
        </div>
        <a href={getDashboardHref()}>Back to dashboard</a>
      </header>

      <section className="results-score-panel" aria-label="Overall score">
        <div className="results-score-ring" style={{ "--score": `${result.percentage * 3.6}deg` } as CSSProperties}>
          <strong>{result.percentage}%</strong>
          <span>overall</span>
        </div>
        <div>
          <p>Questions correct</p>
          <h2>{result.correct} / {result.total}</h2>
          <span>Use the topic breakdown to decide what to review next.</span>
        </div>
      </section>

      {result.passages.length > 0 ? (
        <section className="results-passage-panel" aria-labelledby="passage-breakdown-title">
          <div className="results-topic-heading">
            <div>
              <p>English breakdown</p>
              <h2 id="passage-breakdown-title">Performance by passage</h2>
            </div>
            <span>{result.passages.length} passages</span>
          </div>

          <div className="results-passage-grid">
            {result.passages.map((passageResult) => {
              const percentage = Math.round((passageResult.correct / passageResult.total) * 100);

              return (
                <article className="results-passage-row" key={passageResult.id}>
                  <div>
                    <span>{passageResult.label}</span>
                    <h3>{passageResult.title}</h3>
                  </div>
                  <strong>{passageResult.correct}/{passageResult.total}</strong>
                  <div className="results-topic-track" aria-label={`${percentage}% correct`}>
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {result.subjects.length > 0 ? (
        result.subjects.map((subjectResult) => (
          <SubjectTopicBreakdown key={subjectResult.subject} subjectResult={subjectResult} />
        ))
      ) : (
        <section className="results-detail-unavailable">
          <h2>Detailed breakdown unavailable</h2>
          <p>Retake this assessment once to generate separate English, Math, and passage results.</p>
        </section>
      )}
    </main>
  );
}
