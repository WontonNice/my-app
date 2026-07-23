import { useEffect, useMemo, useState, type FormEvent } from "react";
import { resolveExamContent } from "../content/exams";
import { getExamSessionProgress, getLearningProgress, getStudentAssessment, type TeacherAssessment } from "../lib/api";
import {
  createAssessmentSectionLines,
  formatDuration,
  getAssessmentIdFromPath,
  getDisplayName,
} from "../lib/exam";
import { resetExamTimer } from "../lib/examTimer";
import {
  getCurrentCompletedSections,
  getNextExamSubject,
  isExamResultCompleteForQuestionCount,
  isExamSessionCompleteForContent,
  loadLocalExamSession,
} from "../lib/examSessionProgress";
import { getExamResult, type ExamResult } from "../lib/examResults";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type StartingSubject = "english" | "math";

function getAssessmentDashboardHref() {
  const searchParams = new URLSearchParams(window.location.search);
  const params = new URLSearchParams({ section: "assessments" });
  if (searchParams.get("preview") === "student" && searchParams.get("teacherTools") === "1") {
    params.set("preview", "student");
    params.set("teacherTools", "1");
  }
  return `/study-hall?${params.toString()}`;
}

export function ExamLaunchPage() {
  const [assessment, setAssessment] = useState<TeacherAssessment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isComplete, setIsComplete] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [hasCompletedEnglish, setHasCompletedEnglish] = useState(false);
  const [startingSubject, setStartingSubject] = useState<StartingSubject>("english");
  const [studentName, setStudentName] = useState("Student");
  const [typedName, setTypedName] = useState("Student");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    async function loadExam() {
      const assessmentId = getAssessmentIdFromPath(window.location.pathname);
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const nextStudentName = getDisplayName(data.session.user);
      setStudentName(nextStudentName);
      setTypedName(nextStudentName);

      try {
        const nextAssessment = await getStudentAssessment(data.session.access_token, assessmentId);
        setAssessment(nextAssessment);
        const examContent = resolveExamContent(nextAssessment);
        const localProgress = loadLocalExamSession(data.session.user.id, assessmentId);
        let progress = localProgress;
        let savedResult = getExamResult(data.session.user.id, assessmentId);
        try {
          const [cloudSessions, cloudProgress] = await Promise.all([
            getExamSessionProgress(data.session.access_token),
            getLearningProgress(data.session.access_token),
          ]);
          const cloudSession = cloudSessions[assessmentId];
          progress =
            cloudSession &&
            (!localProgress || Date.parse(cloudSession.updatedAt) >= Date.parse(localProgress.updatedAt))
              ? cloudSession
              : localProgress;
          savedResult =
            (cloudProgress.examResults.find((candidate) => candidate.assessmentId === assessmentId) as ExamResult | undefined) ??
            null;
        } catch {
          // Device progress still allows the student to continue while cloud sync is unavailable.
        }
        if (!progress && savedResult) {
          progress = {
            answers: savedResult.answers,
            completedSections: savedResult.completedSections,
            status: savedResult.completionStatus === "complete" ? "submitted" : "in_progress",
            submittedAt: savedResult.completedAt,
            updatedAt: savedResult.completedAt,
          };
        }
        const currentCompletedSections = getCurrentCompletedSections(examContent, progress);
        const englishDone = currentCompletedSections.includes("english");
        const currentQuestionCount = nextAssessment.questions.length;
        const complete =
          isExamSessionCompleteForContent(examContent, progress) ||
          isExamResultCompleteForQuestionCount(savedResult, currentQuestionCount);
        setIsComplete(complete);
        setHasSavedProgress(
          Boolean(progress && (Object.keys(progress.answers).length > 0 || currentCompletedSections.length > 0)),
        );
        setHasCompletedEnglish(englishDone);
        setStartingSubject(getNextExamSubject("english", currentCompletedSections));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Could not load this exam.");
      } finally {
        setIsCheckingSession(false);
      }
    }

    loadExam();
  }, []);

  const sectionLines = useMemo(() => (assessment ? createAssessmentSectionLines(assessment) : []), [assessment]);

  function handleStartExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!assessment || isComplete) {
      return;
    }

    const launchName = typedName.trim() || studentName;
    window.sessionStorage.setItem(`exam-student-name:${assessment.id}`, launchName);
    window.sessionStorage.setItem(`exam-start-subject:${assessment.id}`, startingSubject);
    if (!hasSavedProgress) resetExamTimer(assessment.id);
    window.location.assign(`/exam/${assessment.id}/session${window.location.search}`);
  }

  if (isCheckingSession) {
    return <main className="loading-shell">Loading exam...</main>;
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="loading-shell">
        Supabase auth is not configured. Add your Vite Supabase env vars, then log in.
      </main>
    );
  }

  return (
    <main className="exam-launch-shell">
      <header className="exam-launch-header">
        <a className="exam-launch-brand" href="/study-hall">
          Nathan Tutors
        </a>
        <div className="exam-launch-user">
          <span>{studentName}</span>
          <button type="button" aria-label="User menu">
            <span aria-hidden="true">U</span>
          </button>
        </div>
      </header>

      <div className="exam-launch-bluebar" />
      <div className="exam-launch-shadow" />

      <section className="exam-launch-content" aria-labelledby="exam-launch-title">
        <div className="exam-launch-welcome">Welcome, {studentName}!</div>

        <div className="exam-launch-card">
          {assessment ? (
            <div className="exam-launch-panel">
              <div className="exam-launch-summary">
                <h1 id="exam-launch-title">{assessment.title}</h1>
                <p>{assessment.split ? "This exam is split into separate English and Math sessions." : `There are ${sectionLines.length} sections.`}</p>

                <div className="exam-launch-section-list">
                  {sectionLines.map((section) => (
                    <p key={section.label}>
                      There are {section.questionCount} questions in {section.label}.
                    </p>
                  ))}
                </div>

                <p>You have {formatDuration(assessment.durationMinutes)} to complete this test.</p>
              </div>

              {isComplete ? (
                <div className="exam-launch-form exam-launch-complete">
                  <h2>Complete</h2>
                  <p>Your answers have been submitted. Your teacher can view your score.</p>
                  <a href={getAssessmentDashboardHref()}>Return to assessments</a>
                </div>
              ) : <form className="exam-launch-form" onSubmit={handleStartExam}>
                <h2>Enter your name:</h2>
                <label>
                  Name:
                  <input
                    required
                    type="text"
                    value={typedName}
                    onChange={(event) => setTypedName(event.target.value)}
                  />
                </label>

                {assessment.split ? (
                  <div className="exam-launch-start-options">
                    <strong>{hasCompletedEnglish ? "Session 2 of 2: Math" : "Session 1 of 2: English"}</strong>
                    <p>{hasCompletedEnglish ? "Your English answers are saved. Complete Math to finish the exam." : "After English is submitted, Math will open automatically."}</p>
                  </div>
                ) : <fieldset className="exam-launch-start-options">
                  <legend>Start with:</legend>
                  <label>
                    <input
                      checked={startingSubject === "english"}
                      name="startingSubject"
                      onChange={() => setStartingSubject("english")}
                      type="radio"
                    />
                    English
                  </label>
                  <label>
                    <input
                      checked={startingSubject === "math"}
                      name="startingSubject"
                      onChange={() => setStartingSubject("math")}
                      type="radio"
                    />
                    Math
                  </label>
                </fieldset>}
                <button type="submit">
                  {hasSavedProgress
                    ? `Continue ${startingSubject === "math" ? "Math" : "English"}`
                    : assessment.split && hasCompletedEnglish
                      ? "Start Math"
                      : "Start"} &gt;&gt;
                </button>
                {errorMessage && <p>{errorMessage}</p>}
              </form>}
            </div>
          ) : (
            <div className="exam-launch-error">
              <h1>Exam unavailable</h1>
              <p>{errorMessage || "This exam could not be loaded."}</p>
              <a href="/study-hall">Return to Study Hall</a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
