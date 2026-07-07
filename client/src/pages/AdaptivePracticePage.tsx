import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, ClipboardList, Search, Sparkles, Target } from "lucide-react";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { advancedPracticePassages } from "../content/advancedPractice";
import { practiceTopics } from "../content/practice";
import { getExamSessionProgress, getLearningProgress, getStudentAssessments, getStudentClasses, type ExamSessionProgress, type StudentAssessment } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getExamResults, replaceExamResults, type ExamResult } from "../lib/examResults";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { getStudentClassNavigation } from "../lib/studentClassNavigation";

const pageSearchParams = new URLSearchParams(window.location.search);
const isStudentPreview = pageSearchParams.get("preview") === "student";
const hasTeacherPreviewTools = isStudentPreview && pageSearchParams.get("teacherTools") === "1";
const previewQuery = hasTeacherPreviewTools ? "?preview=student&teacherTools=1" : "";

type LabSection = "Adaptive Practice" | "Advanced Practice" | "Assessments" | "Test Results";

function getInitialSection(): LabSection {
  const section = pageSearchParams.get("section");
  if (section === "advanced") return "Advanced Practice";
  if (section === "assessments") return "Assessments";
  if (section === "results") return "Test Results";
  return "Adaptive Practice";
}

function getLabHref(section?: "advanced" | "assessments" | "results") {
  const params = new URLSearchParams();
  if (section) params.set("section", section);
  if (hasTeacherPreviewTools) {
    params.set("preview", "student");
    params.set("teacherTools", "1");
  }
  const query = params.toString();
  return `/study-hall${query ? `?${query}` : ""}`;
}

function getAssessmentStartHref(assessmentId: string) {
  if (!hasTeacherPreviewTools) {
    return `/exam/${assessmentId}`;
  }

  return `/exam/${assessmentId}?preview=student&teacherTools=1`;
}

function getAssessmentResultHref(assessmentId: string) {
  const query = hasTeacherPreviewTools ? "?preview=student&teacherTools=1" : "";
  return `/results/${assessmentId}${query}`;
}

function getAdvancedPassageHref(passageId: string) {
  const query = hasTeacherPreviewTools ? "?preview=student&teacherTools=1" : "";
  return `/advanced-practice/${passageId}${query}`;
}

function getTopicHref(topicSlug: string) {
  const query = hasTeacherPreviewTools ? "?preview=student&teacherTools=1" : "";
  return `/practice/${topicSlug}${query}`;
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

function getTopicStatus(correct: number, total: number) {
  if (total === 0) {
    return { key: "untested", label: "Not tested yet" } as const;
  }

  const percentage = correct / total;

  if (percentage < 0.5) {
    return { key: "needs-work", label: "Needs work" } as const;
  }

  if (percentage < 0.8) {
    return { key: "practicing", label: "Keep practicing" } as const;
  }

  return { key: "strong", label: "Strong" } as const;
}

function getEnglishTopicProgress(results: ExamResult[]) {
  const progress = new Map<string, { correct: number; total: number }>();

  results.forEach((result) => {
    (Array.isArray(result.subjects) ? result.subjects : [])
      .filter((subject) => subject.subject === "English Language Arts")
      .flatMap((subject) => Array.isArray(subject.topics) ? subject.topics : [])
      .forEach((topic) => {
        const current = progress.get(topic.topic) ?? { correct: 0, total: 0 };
        progress.set(topic.topic, {
          correct: current.correct + topic.correct,
          total: current.total + topic.total,
        });
      });
  });

  return progress;
}

function getSectionHeading(section: LabSection) {
  if (section === "Assessments") {
    return {
      description: "Exams stay locked until your teacher opens them from the teacher dashboard.",
      title: "Assigned SHSAT exams",
    };
  }

  if (section === "Test Results") {
    return {
      description: "Review your scores and see which topics deserve your next study session.",
      title: "Assessment history",
    };
  }

  if (section === "Advanced Practice") {
    return {
      description: "Choose a full-length passage, read closely, and then continue into focused skill practice.",
      title: "Advanced passage library",
    };
  }

  return {
    description: isStudentPreview
      ? "You are viewing the student experience as a teacher."
      : "Take a diagnostic to unlock topic recommendations and smarter practice paths.",
    title: isStudentPreview ? "Student preview room" : "Personalized SHSAT prep room",
  };
}

export function AdaptivePracticePage() {
  const [activeSection] = useState<LabSection>(getInitialSection);
  const [assessmentMessage, setAssessmentMessage] = useState("");
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [examSessions, setExamSessions] = useState<Record<string, ExamSessionProgress>>({});
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [studentName, setStudentName] = useState("Student");

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
      const metadata = data.session.user.user_metadata as { full_name?: string; name?: string };
      setStudentName(metadata.full_name ?? metadata.name ?? data.session.user.email?.split("@")[0] ?? "Student");
      let savedResults = getExamResults(data.session.user.id);
      try {
        const cloudProgress = await getLearningProgress(data.session.access_token);
        if (cloudProgress.examResults.length > 0) {
          replaceExamResults(data.session.user.id, cloudProgress.examResults as unknown as ExamResult[]);
          savedResults = getExamResults(data.session.user.id);
        }
      } catch {
        // Local results remain available while offline.
      }
      setExamResults(savedResults);
      try {
        setExamSessions(await getExamSessionProgress(data.session.access_token));
      } catch {
        // Assessment cards can still load when session progress is temporarily unavailable.
      }

      if (userRole !== "student" && !(userRole === "teacher" && isStudentPreview)) {
        window.location.assign(getDashboardPath(userRole));
        return;
      }

      if (userRole === "student") {
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

  const sectionHeading = getSectionHeading(activeSection);
  const activeId = activeSection === "Test Results" ? "results" : activeSection === "Assessments" ? "assessments" : activeSection === "Advanced Practice" ? "advanced" : "practice";
  const navItems = getStudentClassNavigation(previewQuery);

  return (
    <CorporateDashboardShell activeId={activeId} navItems={navItems} onSignOut={handleSignOut} profileName={studentName} profileRole={isStudentPreview ? "Teacher preview" : "Student account"} returnHref={isStudentPreview ? "/teacher" : undefined} returnLabel="Teacher dashboard">
      <header className="staff-page-heading corporate-page-heading shsat-lab-heading">
        <div><p><BookOpen size={15} /> SHSAT Lab</p><h1>{sectionHeading.title}</h1><span>{sectionHeading.description}</span></div>
        <a className="corporate-heading-action" href={getLabHref("advanced")}><Sparkles size={15} /> Browse advanced practice</a>
      </header>
      <section className="staff-kpi-grid" aria-label="SHSAT learning summary">
        <article><span><Target size={19} /></span><div><p>Practice topics</p><strong>{practiceTopics.length}</strong></div><em>Four difficulty levels</em></article>
        <article><span><BarChart3 size={19} /></span><div><p>Tests completed</p><strong>{examResults.filter((result) => result.completionStatus !== "english_complete").length}</strong></div><em>Saved assessment history</em></article>
        <article><span><ClipboardList size={19} /></span><div><p>Open assessments</p><strong>{assessments.filter((assessment) => assessment.status === "open").length}</strong></div><em>{assessments.length} assigned total</em></article>
        <article><span><Sparkles size={19} /></span><div><p>Advanced passages</p><strong>{advancedPracticePassages.length}</strong></div><em>Close-reading catalog</em></article>
      </section>

      <div className="shsat-lab-content" id="adaptive">

        {activeSection === "Assessments" ? (
          <AssessmentsSection assessments={assessments} examSessions={examSessions} message={assessmentMessage} results={examResults} />
        ) : activeSection === "Test Results" ? (
          <ResultsSection results={examResults} />
        ) : activeSection === "Advanced Practice" ? (
          <AdvancedPracticeCatalogue />
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

            <TopicsSection results={examResults} />
          </>
        )}
      </div>
    </CorporateDashboardShell>
  );
}

function AdvancedPracticeCatalogue() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [query, setQuery] = useState("");
  const genres = useMemo(
    () => ["All", ...new Set(advancedPracticePassages.map((passage) => passage.genre))],
    [],
  );
  const visiblePassages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return advancedPracticePassages.filter((passage) => {
      const matchesGenre = activeGenre === "All" || passage.genre === activeGenre;
      const searchableText = [
        passage.passageSet.passage.title,
        passage.genre,
        passage.excerpt,
        ...passage.passageSet.questions.map((question) => question.topic),
      ].join(" ").toLowerCase();

      return matchesGenre && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeGenre, query]);

  return (
    <section className="advanced-catalogue" aria-labelledby="advanced-catalogue-title">
      <div className="advanced-catalogue-heading">
        <div>
          <span><Sparkles aria-hidden="true" size={15} /> Passage catalogue</span>
          <h2 id="advanced-catalogue-title">Choose your next close read</h2>
          <p>Build stamina with complete passages organized by genre, difficulty, and skill.</p>
        </div>
        <strong>{visiblePassages.length} selections</strong>
      </div>

      <div className="advanced-catalogue-tools">
        <label className="advanced-catalogue-search">
          <Search aria-hidden="true" size={18} />
          <span className="sr-only">Search passages</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles or skills"
            type="search"
            value={query}
          />
        </label>
        <div className="advanced-catalogue-filters" aria-label="Filter passages by genre">
          {genres.map((genre) => (
            <button
              aria-pressed={genre === activeGenre}
              className={genre === activeGenre ? "is-active" : undefined}
              key={genre}
              onClick={() => setActiveGenre(genre)}
              type="button"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {visiblePassages.length > 0 ? (
        <div className="advanced-catalogue-grid">
          {visiblePassages.map((passage) => (
            <article className="advanced-passage-card" key={passage.id}>
              <div className={`advanced-passage-cover is-${passage.tone}`}>
                {passage.thumbnail ? (
                  <img alt={passage.thumbnailAlt} loading="lazy" src={passage.thumbnail} />
                ) : (
                  <>
                    <BookOpen aria-hidden="true" size={34} strokeWidth={1.6} />
                    <span>{passage.genre}</span>
                    <strong>{passage.passageSet.passage.title}</strong>
                  </>
                )}
              </div>
              <div className="advanced-passage-card-body">
                <h3>{passage.passageSet.passage.title}</h3>
                <p>{passage.excerpt}</p>
                <a
                  aria-label={`Start ${passage.passageSet.passage.title}`}
                  className="advanced-passage-start"
                  href={getAdvancedPassageHref(passage.id)}
                >
                  Start
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="advanced-catalogue-empty">
          <Search aria-hidden="true" size={24} />
          <h3>No passages match that search</h3>
          <button onClick={() => { setActiveGenre("All"); setQuery(""); }} type="button">Clear filters</button>
        </div>
      )}

    </section>
  );
}

function formatQuestionType(questionType: string) {
  return questionType.replace("_", " ");
}

function TopicsSection({ results }: { results: ExamResult[] }) {
  const progressByTopic = getEnglishTopicProgress(results);
  const topicCards = practiceTopics.map((topic, index) => {
    const progress = progressByTopic.get(topic.key) ?? { correct: 0, total: 0 };
    const percentage = progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;

    return {
      ...topic,
      index: index + 1,
      percentage,
      progress,
      status: getTopicStatus(progress.correct, progress.total),
    };
  });
  const startedCount = topicCards.filter((topic) => topic.progress.total > 0).length;
  const focusTopic =
    [...topicCards]
      .filter((topic) => topic.progress.total > 0)
      .sort((left, right) => left.percentage - right.percentage)[0] ?? topicCards[0];

  return (
    <section className="topics-panel" id="topics" aria-labelledby="topics-title">
      <div className="topics-heading-row">
        <div>
          <span>Skill map</span>
          <h2 id="topics-title">All Reading Topics</h2>
          <p>Your test results automatically shape this practice map.</p>
        </div>
        <div className="topic-legend" aria-label="Topic legend">
          <span className="is-needs-work">Needs Work</span>
          <span className="is-practicing">Keep Practicing</span>
          <span className="is-strong">Strong</span>
          <span className="is-untested">Not Tested Yet</span>
        </div>
      </div>

      <div className="topic-group">
        <div className="topic-group-header">
          <span className="topic-subject-icon" aria-hidden="true">
            <BookOpen size={22} strokeWidth={2.1} />
          </span>
          <div className="topic-group-summary">
            <div>
              <strong>ELA - Reading Comprehension</strong>
              <span className="topic-focus-badge">
                Focus area
              </span>
              <small>{startedCount} of {topicCards.length} topics measured</small>
            </div>
            <div className="topic-overall-progress" aria-label={`${startedCount} of ${topicCards.length} topics measured`}>
              <span style={{ width: `${(startedCount / topicCards.length) * 100}%` }} />
            </div>
          </div>
          <span aria-hidden="true" className="topic-collapse-icon">^</span>
        </div>

        <div className="topic-card-grid">
          {topicCards.map((topic) => {
            const isFocus = topic.key === focusTopic.key;

            return (
              <a
                className={`topic-card is-${topic.status.key} ${isFocus ? "is-selected" : ""}`}
                href={getTopicHref(topic.slug)}
                key={topic.key}
              >
                <div className="topic-card-header">
                  <span>{topic.index}</span>
                  <div>
                    {isFocus ? <small className="topic-level-badge">Level up</small> : null}
                    <small className="topic-status-badge">
                      <i aria-hidden="true" /> {topic.status.label}
                    </small>
                  </div>
                </div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <div className="topic-card-footer">
                  <span>
                    {topic.progress.total > 0
                      ? `${topic.progress.correct}/${topic.progress.total} correct`
                      : "Tap to explore"}
                  </span>
                  {topic.progress.total > 0 ? (
                    <span>{topic.percentage}%</span>
                  ) : null}
                </div>
              </a>
            );
          })}
        </div>

        <div className="topic-insight-strip" aria-live="polite">
          <span aria-hidden="true"><BookOpen size={19} /></span>
          <div>
            <small>Recommended focus</small>
            <strong>{focusTopic.title}</strong>
            <p>{focusTopic.description}</p>
          </div>
          <a href={getTopicHref(focusTopic.slug)}>Start focused practice</a>
        </div>
      </div>
    </section>
  );
}

function AssessmentsSection({
  assessments,
  examSessions,
  message,
  results,
}: {
  assessments: StudentAssessment[];
  examSessions: Record<string, ExamSessionProgress>;
  message: string;
  results: ExamResult[];
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
        {assessments.map((assessment) => {
          const result = results.find((candidate) => candidate.assessmentId === assessment.id);
          const englishComplete = assessment.split && (examSessions[assessment.id]?.completedSections.includes("english") || result?.completionStatus === "english_complete");
          const resultIsComplete = result && result.completionStatus !== "english_complete";

          return (
          <article className="assessment-card" key={assessment.id}>
            <div className="assessment-card-top">
              <span className={`status-pill status-pill-${assessment.status}`}>{assessment.status}</span>
              <small>{assessment.split ? "2 sessions" : `${assessment.durationMinutes} min`}</small>
            </div>
            <h3>{assessment.title}</h3>
            <p>{assessment.description}</p>
            <div className="assessment-meta">
              <span>{assessment.questionCount} questions</span>
              <span>{assessment.passageCount} passages</span>
              <span>{assessment.questionTypes.map(formatQuestionType).join(", ") || "mixed"}</span>
            </div>
            <div className="assessment-card-actions">
              {assessment.status === "open" ? (
                <a className="assessment-start-link" href={getAssessmentStartHref(assessment.id)}>
                  {englishComplete && !resultIsComplete ? "Start Math" : resultIsComplete ? "Retake exam" : assessment.split ? "Start English" : "Start exam"}
                </a>
              ) : (
                <button disabled type="button">
                  Locked by teacher
                </button>
              )}
              {result ? (
                <a className="assessment-result-link" href={getAssessmentResultHref(assessment.id)}>
                  {result.completionStatus === "english_complete" ? "English score" : "Results"}: {result.correct}/{result.total}
                </a>
              ) : null}
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

function ResultsSection({ results }: { results: ExamResult[] }) {
  return (
    <section className="assessments-panel" aria-labelledby="results-title">
      <div className="section-heading">
        <div>
          <span>Test Results</span>
          <h2 id="results-title">Your completed assessments</h2>
        </div>
        <p>{results.length} completed</p>
      </div>

      {results.length > 0 ? (
        <div className="assessment-grid">
          {results.map((result) => (
            <article className="assessment-card result-summary-card" key={result.assessmentId}>
              <div className="assessment-card-top">
                <span className="result-score-pill">{result.percentage}%</span>
                <small>{result.completionStatus === "english_complete" ? "English submitted · Math pending" : new Date(result.completedAt).toLocaleDateString()}</small>
              </div>
              <h3>{result.title}</h3>
              <p>
                {result.correct} of {result.total} questions correct across {result.topics.length} topics.
              </p>
              <a className="assessment-result-link" href={getAssessmentResultHref(result.assessmentId)}>
                View breakdown
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="results-empty-state">
          <h3>No results yet</h3>
          <p>Finish an assessment and its score and topic breakdown will appear here.</p>
        </div>
      )}
    </section>
  );
}
