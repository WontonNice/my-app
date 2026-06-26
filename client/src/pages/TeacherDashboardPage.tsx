import { useEffect, useState, type FormEvent } from "react";
import {
  createTeacherAssessment,
  getTeacherAssessments,
  updateTeacherAssessmentStatus,
  type AssessmentStatus,
  type QuestionType,
  type TeacherAssessment,
} from "../lib/api";
import { getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type AssessmentDraft = {
  classId: string;
  description: string;
  durationMinutes: string;
  imageUrl: string;
  passageText: string;
  passageTitle: string;
  questionAnswer: string;
  questionChoices: string;
  questionPrompt: string;
  questionType: QuestionType;
  title: string;
};

const defaultDraft: AssessmentDraft = {
  classId: "shsat",
  description: "",
  durationMinutes: "45",
  imageUrl: "",
  passageText: "",
  passageTitle: "",
  questionAnswer: "",
  questionChoices: "",
  questionPrompt: "",
  questionType: "multiple_choice",
  title: "",
};

const questionTypeOptions: { label: string; value: QuestionType }[] = [
  { label: "Multiple choice", value: "multiple_choice" },
  { label: "Multi select", value: "multi_select" },
  { label: "Category sort", value: "category_sort" },
  { label: "Inline dropdown", value: "inline_dropdown" },
  { label: "Numeric entry", value: "numeric_entry" },
  { label: "Short response", value: "short_response" },
  { label: "Grid in", value: "grid_in" },
  { label: "Essay", value: "essay" },
];

function formatQuestionType(questionType: string) {
  return questionType.replace("_", " ");
}

function createTeacherStats(assessments: TeacherAssessment[]) {
  const openAssessments = assessments.filter((assessment) => assessment.status === "open").length;

  return [
    {
      label: "Active students",
      value: "0",
    },
    {
      label: "Assessment bank",
      value: String(assessments.length),
    },
    {
      label: "Open exams",
      value: String(openAssessments),
    },
    {
      label: "Question items",
      value: String(assessments.reduce((total, assessment) => total + assessment.questions.length, 0)),
    },
  ] as const;
}

export function TeacherDashboardPage() {
  const [accessToken, setAccessToken] = useState("");
  const [assessments, setAssessments] = useState<TeacherAssessment[]>([]);
  const [draft, setDraft] = useState<AssessmentDraft>(defaultDraft);
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [savingStatusId, setSavingStatusId] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    async function loadTeacherDashboard() {
      const { data } = await getSupabaseClient().auth.getSession();

      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      if (getUserRole(data.session.user) !== "teacher") {
        window.location.assign("/dashboard");
        return;
      }

      setAccessToken(data.session.access_token);

      try {
        setAssessments(await getTeacherAssessments(data.session.access_token));
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load assessments.");
      } finally {
        setIsCheckingSession(false);
      }
    }

    loadTeacherDashboard();
  }, []);

  async function handleCreateAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const assessment = await createTeacherAssessment(accessToken, {
        ...draft,
        durationMinutes: Number(draft.durationMinutes) || 45,
      });

      setAssessments((currentAssessments) => [assessment, ...currentAssessments]);
      setDraft(defaultDraft);
      setMessage(`${assessment.title} was saved as a locked assessment.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the assessment.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleAssessment(assessment: TeacherAssessment) {
    if (!accessToken) {
      return;
    }

    const nextStatus: AssessmentStatus = assessment.status === "open" ? "locked" : "open";

    setSavingStatusId(assessment.id);
    setMessage("");

    try {
      const updatedAssessment = await updateTeacherAssessmentStatus(accessToken, assessment.id, nextStatus);

      setAssessments((currentAssessments) =>
        currentAssessments.map((currentAssessment) =>
          currentAssessment.id === updatedAssessment.id ? updatedAssessment : currentAssessment,
        ),
      );
      setMessage(`${updatedAssessment.title} is now ${updatedAssessment.status}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update the assessment.");
    } finally {
      setSavingStatusId("");
    }
  }

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      await getSupabaseClient().auth.signOut();
    }

    window.location.assign("/");
  }

  if (isCheckingSession) {
    return <main className="loading-shell">Loading teacher dashboard...</main>;
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="loading-shell">
        Supabase auth is not configured. Add your Vite Supabase env vars, then log in.
      </main>
    );
  }

  const teacherStats = createTeacherStats(assessments);

  return (
    <main className="teacher-shell">
      <header className="teacher-header">
        <div>
          <p>Teacher dashboard</p>
          <h1>Assessment control room</h1>
        </div>
        <div className="teacher-header-actions">
          <a href="/study-hall?preview=student&teacherTools=1">Student view</a>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <section className="teacher-grid" aria-label="Analytics summary">
        {teacherStats.map((stat) => (
          <article className="teacher-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      {message && <p className="teacher-message">{message}</p>}

      <section className="teacher-section-grid">
        <section className="teacher-panel">
          <div className="teacher-panel-header">
            <div>
              <span>Builder</span>
              <h2>Construct an exam</h2>
            </div>
            <p>Saved exams stay locked until you open them for students.</p>
          </div>

          <form className="teacher-assessment-form" onSubmit={handleCreateAssessment}>
            <div className="teacher-field-grid">
              <label>
                Exam title
                <input
                  required
                  type="text"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </label>
              <label>
                Class
                <select
                  value={draft.classId}
                  onChange={(event) => setDraft({ ...draft, classId: event.target.value })}
                >
                  <option value="shsat">SHSAT</option>
                </select>
              </label>
              <label>
                Duration
                <input
                  min="1"
                  type="number"
                  value={draft.durationMinutes}
                  onChange={(event) => setDraft({ ...draft, durationMinutes: event.target.value })}
                />
              </label>
              <label>
                Question type
                <select
                  value={draft.questionType}
                  onChange={(event) =>
                    setDraft({ ...draft, questionType: event.target.value as QuestionType })
                  }
                >
                  {questionTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Exam description
              <textarea
                rows={3}
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              />
            </label>

            <div className="teacher-field-grid teacher-field-grid-wide">
              <label>
                Passage title
                <input
                  type="text"
                  value={draft.passageTitle}
                  onChange={(event) => setDraft({ ...draft, passageTitle: event.target.value })}
                />
              </label>
              <label>
                Image URL
                <input
                  placeholder="Optional image link"
                  type="url"
                  value={draft.imageUrl}
                  onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })}
                />
              </label>
            </div>

            <label>
              Passage text
              <textarea
                rows={5}
                value={draft.passageText}
                onChange={(event) => setDraft({ ...draft, passageText: event.target.value })}
              />
            </label>

            <label>
              Question prompt
              <textarea
                rows={4}
                value={draft.questionPrompt}
                onChange={(event) => setDraft({ ...draft, questionPrompt: event.target.value })}
              />
            </label>

            <div className="teacher-field-grid teacher-field-grid-wide">
              <label>
                Choices
                <textarea
                  placeholder="One choice per line"
                  rows={4}
                  value={draft.questionChoices}
                  onChange={(event) => setDraft({ ...draft, questionChoices: event.target.value })}
                />
              </label>
              <label>
                Answer key or rubric note
                <textarea
                  rows={4}
                  value={draft.questionAnswer}
                  onChange={(event) => setDraft({ ...draft, questionAnswer: event.target.value })}
                />
              </label>
            </div>

            <button disabled={isSaving} type="submit">
              {isSaving ? "Saving" : "Save locked exam"}
            </button>
          </form>
        </section>

        <section className="teacher-panel">
          <div className="teacher-panel-header">
            <div>
              <span>Assignments</span>
              <h2>Open or lock exams</h2>
            </div>
            <p>Students can only start exams marked open.</p>
          </div>

          <div className="teacher-assessment-list">
            {assessments.map((assessment) => (
              <article className="teacher-assessment-card" key={assessment.id}>
                <div>
                  <span className={`status-pill status-pill-${assessment.status}`}>
                    {assessment.status}
                  </span>
                  <small>{assessment.durationMinutes} min</small>
                </div>
                <h3>{assessment.title}</h3>
                <p>{assessment.description || "No description yet."}</p>
                <dl>
                  <div>
                    <dt>Passages</dt>
                    <dd>{assessment.passages.length}</dd>
                  </div>
                  <div>
                    <dt>Questions</dt>
                    <dd>{assessment.questions.length}</dd>
                  </div>
                  <div>
                    <dt>Types</dt>
                    <dd>
                      {assessment.questions.map((question) => formatQuestionType(question.type)).join(", ") ||
                        "None"}
                    </dd>
                  </div>
                </dl>
                <button
                  disabled={savingStatusId === assessment.id}
                  type="button"
                  onClick={() => handleToggleAssessment(assessment)}
                >
                  {assessment.status === "open" ? "Lock exam" : "Open exam"}
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
