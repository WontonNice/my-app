import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getExamSessionProgress, getStudentAssessment, saveExamSessionProgress, type TeacherAssessment } from "../lib/api";
import {
  createAssessmentSectionLines,
  formatDuration,
  getAssessmentIdFromPath,
  getDisplayName,
} from "../lib/exam";
import { resetExamTimer } from "../lib/examTimer";
import { clearLocalExamSession, loadLocalExamSession } from "../lib/examSessionProgress";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type StartingSubject = "english" | "math";

export function ExamLaunchPage() {
  const [assessment, setAssessment] = useState<TeacherAssessment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [hasCompletedEnglish, setHasCompletedEnglish] = useState(false);
  const [startingSubject, setStartingSubject] = useState<StartingSubject>("english");
  const [studentName, setStudentName] = useState("Student");
  const [typedName, setTypedName] = useState("Student");
  const [studentId, setStudentId] = useState("");
  const [accessToken, setAccessToken] = useState("");

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
      setStudentId(data.session.user.id);
      setAccessToken(data.session.access_token);
      setStudentName(nextStudentName);
      setTypedName(nextStudentName);

      try {
        const nextAssessment = await getStudentAssessment(data.session.access_token, assessmentId);
        setAssessment(nextAssessment);
        if (nextAssessment.split) {
          const localProgress = loadLocalExamSession(data.session.user.id, assessmentId);
          let progress = localProgress;
          try {
            const cloudSessions = await getExamSessionProgress(data.session.access_token);
            progress = cloudSessions[assessmentId] ?? localProgress;
          } catch {
            // The local section marker still allows the second session to continue offline.
          }
          const englishDone = progress?.completedSections.includes("english") ?? false;
          setHasCompletedEnglish(englishDone);
          setStartingSubject(englishDone ? "math" : "english");
        }
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

    if (!assessment) {
      return;
    }

    const launchName = typedName.trim() || studentName;
    window.sessionStorage.setItem(`exam-student-name:${assessment.id}`, launchName);
    window.sessionStorage.setItem(`exam-start-subject:${assessment.id}`, startingSubject);
    if (assessment.split && startingSubject === "english" && studentId) {
      clearLocalExamSession(studentId, assessment.id);
      if (accessToken) {
        void saveExamSessionProgress(accessToken, assessment.id, { answers: {}, completedSections: [] }).catch(() => undefined);
      }
    }
    resetExamTimer(assessment.id);
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

              <form className="exam-launch-form" onSubmit={handleStartExam}>
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
                    <p>{hasCompletedEnglish ? "Your English answers are saved. Complete Math to finish the exam." : "After English is submitted, return to your class dashboard to start Math."}</p>
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
                <button type="submit">{assessment.split && hasCompletedEnglish ? "Start Math" : "Start"} &gt;&gt;</button>
                {errorMessage && <p>{errorMessage}</p>}
              </form>
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
