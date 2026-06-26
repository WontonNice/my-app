import { useEffect, useState } from "react";
import { getStudentAssessments, getStudentClasses, type StudentAssessment } from "../lib/api";
import { getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

const pageSearchParams = new URLSearchParams(window.location.search);
const isStudentPreview = pageSearchParams.get("preview") === "student";
const hasTeacherPreviewTools = isStudentPreview && pageSearchParams.get("teacherTools") === "1";

function getAssessmentStartHref(assessmentId: string) {
  if (!hasTeacherPreviewTools) {
    return `/exam/${assessmentId}`;
  }

  return `/exam/${assessmentId}?preview=student&teacherTools=1`;
}

const targetCards = [
  {
    accent: "violet",
    label: "Practice 4 Focus Topics",
    meta: "Central Idea & Theme",
    progress: "0 / 4",
    width: 0,
  },
  {
    accent: "green",
    label: "Complete 30 Questions",
    meta: "Mixed SHSAT practice",
    progress: "0 / 30",
    width: 0,
  },
  {
    accent: "orange",
    label: "Review Missed Questions",
    meta: "Error log",
    progress: "0 / 5",
    width: 0,
  },
  {
    accent: "violet",
    label: "Earn 500 XP",
    meta: "Study streak",
    progress: "0 / 500",
    width: 0,
  },
  {
    accent: "blue",
    label: "Improve 1 Topic Level",
    meta: "Reading comprehension",
    progress: "0 / 1",
    width: 0,
  },
] as const;

const recommendations = [
  {
    badge: "Start here",
    cta: "Start Practice",
    description: "Identify the main idea, recurring themes, and best summary of a passage.",
    title: "Central Idea & Theme",
  },
  {
    badge: "Start here",
    cta: "Start Practice",
    description: "Determine the author's perspective, attitude, and purpose in literary texts.",
    title: "Author's Point of View",
  },
  {
    badge: "Take a test",
    cta: "Start Diagnostic",
    description: "Unlock personalized recommendations based on your first SHSAT results.",
    title: "Take a Diagnostic",
  },
] as const;

const topicCards = [
  {
    index: "1",
    status: "Level up",
    title: "Central Idea & Theme",
  },
  {
    index: "2",
    status: "Not tested yet",
    title: "Author's Point of View",
  },
  {
    index: "3",
    status: "Not tested yet",
    title: "Word & Phrase Meaning",
  },
  {
    index: "4",
    status: "Not tested yet",
    title: "Figurative Language & Imagery",
  },
] as const;

const sidebarItems = [
  "Test Results",
  "Adaptive Practice",
  "Assessments",
  "Practice Progress",
  "Achievements",
  "Ask Tutor AI",
  "My Classes",
  "Parent Hub",
  "Membership",
  "Settings",
] as const;

type SidebarItem = (typeof sidebarItems)[number];

export function AdaptivePracticePage() {
  const [activeSection, setActiveSection] = useState<SidebarItem>("Adaptive Practice");
  const [assessmentMessage, setAssessmentMessage] = useState("");
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getSupabaseClient().auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const userRole = getUserRole(data.session.user);

      if (userRole === "teacher" && !isStudentPreview) {
        window.location.assign("/teacher");
        return;
      }

      if (userRole !== "teacher") {
        try {
          const studentClasses = await getStudentClasses(data.session.access_token);
          const isInShsat = studentClasses.some((studentClass) => studentClass.id === "shsat");

          if (!isInShsat) {
            window.location.assign("/dashboard");
            return;
          }
        } catch {
          window.location.assign("/dashboard");
          return;
        }
      }

      try {
        const nextAssessments = await getStudentAssessments(data.session.access_token);
        setAssessments(nextAssessments);
      } catch (error) {
        setAssessmentMessage(error instanceof Error ? error.message : "Could not load assessments.");
      }

      setIsCheckingSession(false);
    });
  }, []);

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      await getSupabaseClient().auth.signOut();
    }

    window.location.assign("/");
  }

  if (isCheckingSession) {
    return <main className="loading-shell">Loading adaptive practice...</main>;
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="loading-shell">
        Supabase auth is not configured. Add your Vite Supabase env vars, then log in.
      </main>
    );
  }

  return (
    <main className="shsat-shell">
      <aside className="shsat-sidebar" aria-label="SHSAT navigation">
        <a className="shsat-brand" href="/study-hall/shsat">
          <span>NT</span>
          <strong>SHSAT</strong>
          <em>lab</em>
        </a>

        <nav className="shsat-side-nav" aria-label="SHSAT sections">
          {sidebarItems.map((item) => (
            <button
              className={item === activeSection ? "is-active" : undefined}
              key={item}
              type="button"
              onClick={() => setActiveSection(item)}
            >
              <span aria-hidden="true">{item.slice(0, 1)}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="shsat-countdown">
          <span>SHSAT Countdown</span>
          <strong>142 days</strong>
        </div>

        <div className="shsat-profile">
          <span aria-hidden="true">C</span>
          <div>
            <strong>Claire</strong>
            <small>Grade 8</small>
          </div>
        </div>
      </aside>

      <section className="shsat-main" id="adaptive">
        <header className="shsat-topbar">
          <div>
            <p>{activeSection}</p>
            <h1>
              {activeSection === "Assessments"
                ? "Assigned SHSAT exams"
                : isStudentPreview
                  ? "Student preview room"
                  : "Personalized SHSAT prep room"}
            </h1>
            <span>
              {activeSection === "Assessments"
                ? "Exams stay locked until your teacher opens them from the teacher dashboard."
                : isStudentPreview
                  ? "You are viewing the student experience as a teacher."
                  : "Take a diagnostic to unlock topic recommendations and smarter practice paths."}
            </span>
          </div>
          {isStudentPreview ? (
            <a className="dashboard-signout shsat-signout" href="/teacher">
              Teacher dashboard
            </a>
          ) : (
            <button className="dashboard-signout shsat-signout" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          )}
        </header>

        {activeSection === "Assessments" ? (
          <AssessmentsSection assessments={assessments} message={assessmentMessage} />
        ) : (
          <>
            <section className="target-panel" aria-labelledby="targets-title">
              <div className="panel-title-row">
                <div className="panel-icon" aria-hidden="true">
                  T
                </div>
                <div>
                  <h2 id="targets-title">This Week's Targets</h2>
                  <p>Complete these goals to keep making progress.</p>
                </div>
                <span className="reset-note">Resets in 4 days</span>
              </div>

              <div className="target-grid">
                {targetCards.map((target) => (
                  <article className="target-card" key={target.label}>
                    <span className={`target-icon target-icon-${target.accent}`} aria-hidden="true">
                      {target.label.slice(0, 1)}
                    </span>
                    <strong>{target.label}</strong>
                    <small>{target.meta}</small>
                    <p>{target.progress}</p>
                    <div className="thin-progress" aria-hidden="true">
                      <span style={{ width: `${target.width}%` }} />
                    </div>
                    <a href="#topics">Go</a>
                  </article>
                ))}
              </div>

              <div className="unlock-strip">Finish your targets to unlock a new set of goals.</div>
            </section>

            <section className="recommended-section" aria-labelledby="recommended-title">
              <div className="section-heading">
                <div>
                  <span>Recommended Today</span>
                  <h2 id="recommended-title">Start with the highest-impact practice.</h2>
                </div>
                <a href="#topics">View all topics</a>
              </div>

              <div className="recommendation-grid">
                {recommendations.map((recommendation) => (
                  <article className="recommendation-card" key={recommendation.title}>
                    <span className="mini-badge">{recommendation.badge}</span>
                    <div>
                      <span className="recommendation-icon" aria-hidden="true">
                        R
                      </span>
                      <div>
                        <h3>{recommendation.title}</h3>
                        <p>{recommendation.description}</p>
                      </div>
                    </div>
                    <div className="thin-progress" aria-hidden="true">
                      <span />
                    </div>
                    <button type="button">{recommendation.cta}</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="topics-panel" id="topics" aria-labelledby="topics-title">
              <div className="section-heading">
                <div>
                  <span>All Topics</span>
                  <h2 id="topics-title">ELA - Reading Comprehension</h2>
                </div>
                <div className="topic-legend" aria-label="Topic legend">
                  <span>Needs Work</span>
                  <span>Keep Practicing</span>
                  <span>Strong</span>
                  <span>Not Tested Yet</span>
                </div>
              </div>

              <div className="topic-group">
                <div className="topic-group-header">
                  <span className="panel-icon" aria-hidden="true">
                    E
                  </span>
                  <div>
                    <strong>ELA - Reading Comprehension</strong>
                    <small>0 of 8 units started</small>
                  </div>
                </div>

                <div className="topic-card-grid">
                  {topicCards.map((topic) => (
                    <article className="topic-card" key={topic.title}>
                      <div className="topic-card-header">
                        <span>{topic.index}</span>
                        <small>{topic.status}</small>
                      </div>
                      <h3>{topic.title}</h3>
                      <p>Practice, review explanations, and level up this topic.</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function formatQuestionType(questionType: string) {
  return questionType.replace("_", " ");
}

function AssessmentsSection({
  assessments,
  message,
}: {
  assessments: StudentAssessment[];
  message: string;
}) {
  return (
    <section className="assessments-panel" aria-labelledby="assessments-title">
      <div className="section-heading">
        <div>
          <span>Assessments</span>
          <h2 id="assessments-title">Available exams</h2>
        </div>
        <p>{assessments.length} assigned</p>
      </div>

      {message && <p className="assessment-message">{message}</p>}

      <div className="assessment-grid">
        {assessments.map((assessment) => (
          <article className="assessment-card" key={assessment.id}>
            <div className="assessment-card-top">
              <span className={`status-pill status-pill-${assessment.status}`}>{assessment.status}</span>
              <small>{assessment.durationMinutes} min</small>
            </div>
            <h3>{assessment.title}</h3>
            <p>{assessment.description}</p>
            <div className="assessment-meta">
              <span>{assessment.questionCount} questions</span>
              <span>{assessment.passageCount} passages</span>
              <span>{assessment.questionTypes.map(formatQuestionType).join(", ") || "mixed"}</span>
            </div>
            {assessment.status === "open" ? (
              <a className="assessment-start-link" href={getAssessmentStartHref(assessment.id)}>
                Start exam
              </a>
            ) : (
              <button disabled type="button">
                Locked by teacher
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
