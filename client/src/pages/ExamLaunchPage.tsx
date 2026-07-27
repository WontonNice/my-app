import { useEffect, useMemo, useState, type FormEvent } from "react";
import { resolveExamContent } from "../content/exams";
import { getExamSessionProgress, getLearningProgress, getStudentAssessment, getTeacherStudentProgress, type TeacherAssessment } from "../lib/api";
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
  getOpenExamSubject,
  isExamResultCompleteForQuestionCount,
  isExamSessionCompleteForContent,
  loadLocalExamSession,
} from "../lib/examSessionProgress";
import { getExamResult, type ExamResult } from "../lib/examResults";
import { appendStudentPreview, getStudentPreviewContext } from "../lib/studentPreview";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type StartingSubject = "english" | "math";

function getAssessmentDashboardHref() {
  const previewContext = getStudentPreviewContext();
  return previewContext.mode === "teacher"
    ? previewContext.returnHref
    : appendStudentPreview("/study-hall?section=assessments", previewContext);
}

export function ExamLaunchPage() {
  const previewContext = getStudentPreviewContext();
  const [assessment, setAssessment] = useState<TeacherAssessment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isComplete, setIsComplete] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
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

      const nextStudentName = previewContext.studentName || getDisplayName(data.session.user);
      setStudentName(nextStudentName);
      setTypedName(nextStudentName);

      try {
        const nextAssessment = await getStudentAssessment(data.session.access_token, assessmentId);
        setAssessment(nextAssessment);
        const examContent = resolveExamContent(nextAssessment);
        const isAccountPreview = previewContext.mode === "student" && Boolean(previewContext.studentId);
        const localProgress = previewContext.isPreview
          ? null
          : loadLocalExamSession(data.session.user.id, assessmentId);
        let progress = localProgress;
        let savedResult = previewContext.isPreview ? null : getExamResult(data.session.user.id, assessmentId);
        if (isAccountPreview) {
          const previewStudent = (await getTeacherStudentProgress(data.session.access_token))
            .find((student) => student.id === previewContext.studentId);
          progress = previewStudent?.examSessions[assessmentId] ?? null;
          savedResult = (previewStudent?.progress.examResults.find(
            (candidate) => candidate.assessmentId === assessmentId,
          ) as unknown as ExamResult | undefined) ?? null;
        } else if (!previewContext.isPreview) {
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
        const currentQuestionCount = nextAssessment.questions.length;
        const complete =
          isExamSessionCompleteForContent(examContent, progress) ||
          isExamResultCompleteForQuestionCount(savedResult, currentQuestionCount);
        setIsComplete(complete);
        setHasSavedProgress(
          Boolean(progress && (Object.keys(progress.answers).length > 0 || currentCompletedSections.length > 0)),
        );
        const preferredSubject = complete
          ? "english"
          : getNextExamSubject("english", currentCompletedSections);
        setStartingSubject(
          getOpenExamSubject(preferredSubject, nextAssessment.sectionAccess) ?? "english",
        );
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Could not load this exam.");
      } finally {
        setIsCheckingSession(false);
      }
    }

    loadExam();
  }, [previewContext.isPreview, previewContext.mode, previewContext.studentId, previewContext.studentName]);

  const sectionLines = useMemo(() => (assessment ? createAssessmentSectionLines(assessment) : []), [assessment]);
  const canOpenCompletedExam = Boolean(assessment?.allowCompletedAccess || previewContext.isPreview);

  function handleStartExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !assessment ||
      !assessment.sectionAccess[startingSubject] ||
      (isComplete && !canOpenCompletedExam)
    ) {
      return;
    }

    const launchName = typedName.trim() || studentName;
    window.sessionStorage.setItem(`exam-student-name:${assessment.id}`, launchName);
    window.sessionStorage.setItem(`exam-start-subject:${assessment.id}`, startingSubject);
    if (!hasSavedProgress || isComplete) resetExamTimer(assessment.id);
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
                <p>This exam runs as one continuous session with {sectionLines.length} sections.</p>
                <div className="exam-launch-access-status" aria-label="Open exam sections">
                  <span className={assessment.sectionAccess.english ? "is-open" : "is-locked"}>English: {assessment.sectionAccess.english ? "Open" : "Locked"}</span>
                  <span className={assessment.sectionAccess.math ? "is-open" : "is-locked"}>Math: {assessment.sectionAccess.math ? "Open" : "Locked"}</span>
                </div>

                <div className="exam-launch-section-list">
                  {sectionLines.map((section) => (
                    <p key={section.label}>
                      There are {section.questionCount} questions in {section.label}.
                    </p>
                  ))}
                </div>

                <p>You have {formatDuration(assessment.durationMinutes)} to complete this test.</p>
              </div>

              {isComplete && !canOpenCompletedExam ? (
                <div className="exam-launch-form exam-launch-complete">
                  <h2>Complete</h2>
                  <p>Your answers have been submitted. Your teacher can view your score.</p>
                  <a href={getAssessmentDashboardHref()}>Return to assessments</a>
                </div>
              ) : <form className="exam-launch-form" onSubmit={handleStartExam}>
                <h2>{isComplete ? "Reopen submitted exam" : "Enter your name:"}</h2>
                {isComplete ? <p>Your saved answers will load. Submit both sections again to replace this attempt.</p> : null}
                <label>
                  Name:
                  <input
                    required
                    type="text"
                    value={typedName}
                    onChange={(event) => setTypedName(event.target.value)}
                  />
                </label>

                <fieldset className="exam-launch-start-options">
                  <legend>Start with:</legend>
                  <label>
                    <input
                      checked={startingSubject === "english"}
                      disabled={!assessment.sectionAccess.english}
                      name="startingSubject"
                      onChange={() => setStartingSubject("english")}
                      type="radio"
                    />
                    English
                    {!assessment.sectionAccess.english ? " (locked)" : ""}
                  </label>
                  <label>
                    <input
                      checked={startingSubject === "math"}
                      disabled={!assessment.sectionAccess.math}
                      name="startingSubject"
                      onChange={() => setStartingSubject("math")}
                      type="radio"
                    />
                    Math
                    {!assessment.sectionAccess.math ? " (locked)" : ""}
                  </label>
                </fieldset>
                <button type="submit">
                  {isComplete
                    ? "Open submitted exam"
                    : hasSavedProgress
                    ? `Continue ${startingSubject === "math" ? "Math" : "English"}`
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
