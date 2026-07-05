import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, ClipboardList, LayoutDashboard, Target, Users } from "lucide-react";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import {
  getTeacherAssessments,
  updateTeacherAssessmentStatus,
  type AssessmentStatus,
  type TeacherAssessment,
} from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

function formatQuestionType(questionType: string) {
  return questionType.replace("_", " ");
}

function createTeacherStats(assessments: TeacherAssessment[]) {
  const openAssessments = assessments.filter((assessment) => assessment.status === "open").length;

  return [
    {
      label: "Class enrollment",
      value: "128",
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
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [message, setMessage] = useState("");
  const [savingStatusId, setSavingStatusId] = useState("");
  const [teacherName, setTeacherName] = useState("Teacher");

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

      const userRole = getUserRole(data.session.user);
      const metadata = data.session.user.user_metadata as { full_name?: string; name?: string };
      setTeacherName(metadata.full_name ?? metadata.name ?? "Teacher");

      if (userRole !== "teacher") {
        window.location.assign(getDashboardPath(userRole));
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
  const statIcons = [Users, ClipboardList, CheckCircle2, BookOpen];
  const navItems = [
    { id: "overview", label: "Overview", href: "/teacher", icon: LayoutDashboard },
    { id: "assessments", label: "Assessments", href: "#assessments", icon: ClipboardList },
    { id: "student", label: "Student view", href: "/dashboard?preview=student&teacherTools=1", icon: Target },
  ];

  return (
    <CorporateDashboardShell activeId="overview" navItems={navItems} onSignOut={handleSignOut} profileName={teacherName} profileRole="Teacher account">
      <header className="staff-page-heading corporate-page-heading">
        <div><p><LayoutDashboard size={15} /> Teacher dashboard</p><h1>Academic control center</h1><span>Manage assessments, staff access, and student learning from one workspace.</span></div>
        <a className="corporate-heading-action" href="/staff?preview=staff&teacherTools=1">Open staff dashboard</a>
      </header>

      <section className="staff-kpi-grid" aria-label="Analytics summary">
        {teacherStats.map((stat, index) => {
          const Icon = statIcons[index];
          return <article key={stat.label}><span><Icon size={19} /></span><div><p>{stat.label}</p><strong>{stat.value}</strong></div><em>Current workspace total</em></article>;
        })}
      </section>

      {message && <p className="teacher-message corporate-message">{message}</p>}

      <section className="teacher-section-grid" id="assessments">
        <section className="teacher-panel teacher-class-panel">
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
    </CorporateDashboardShell>
  );
}
