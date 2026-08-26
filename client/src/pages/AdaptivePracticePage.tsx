import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, ClipboardList, Search, Sparkles, Target } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { advancedPracticePassages } from "../content/advancedPractice";
import { practiceTopics } from "../content/practice";
import { getExamSessionProgress, getLearningProgress, getStudentAssessments, getStudentClasses, getTeacherStudentProgress, type ExamSessionProgress, type StudentAssessment } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getExamResults, replaceExamResults, type ExamResult } from "../lib/examResults";
import { isExamResultCompleteForQuestionCount } from "../lib/examSessionProgress";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  cacheStudentClasses,
  cacheStudentDashboard,
  getActiveSession,
  getCachedStudentClasses,
  getCachedStudentDashboard,
  peekActiveSession,
} from "../lib/sessionCache";
import { getStudentClassNavigation } from "../lib/studentClassNavigation";
import { appendStudentPreview, getStudentPreviewContext } from "../lib/studentPreview";

type LabSection = "Adaptive Practice" | "Advanced Practice" | "Assessments" | "Test Results";

function getInitialSection(): LabSection {
  const section = new URLSearchParams(window.location.search).get("section");
  if (section === "advanced") return "Advanced Practice";
  if (section === "assessments") return "Assessments";
  if (section === "results") return "Test Results";
  return "Adaptive Practice";
}

function getLabHref(section?: "advanced" | "assessments" | "results") {
  const params = new URLSearchParams();
  if (section) params.set("section", section);
  const query = params.toString();
  return appendStudentPreview(`/study-hall${query ? `?${query}` : ""}`);
}

function getAssessmentStartHref(assessmentId: string) {
  return appendStudentPreview(`/exam/${assessmentId}`);
}

function getAdvancedPassageHref(passageId: string) {
  return appendStudentPreview(`/advanced-practice/${passageId}`);
}

function getTopicHref(topicSlug: string) {
  return appendStudentPreview(`/practice/${topicSlug}`);
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

function getSectionHeading(section: LabSection, isStudentPreview: boolean) {
  if (section === "Assessments") {
    return {
      description: "Exams stay locked until your teacher opens them from the teacher dashboard.",
      title: "Assigned SHSAT exams",
    };
  }

  if (section === "Test Results") {
    return {
      description: "See which assessments are complete or still need another section.",
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
  const previewContext = getStudentPreviewContext();
  const initialSession = peekActiveSession();
  const initialDashboardCacheKey = previewContext.isPreview && previewContext.studentId
    ? `preview:${previewContext.studentId}`
    : initialSession?.user.id ?? "";
  const initialDashboardCache = initialDashboardCacheKey
    ? getCachedStudentDashboard(initialDashboardCacheKey)
    : null;
  const initialMetadata = initialSession?.user.user_metadata as { full_name?: string; name?: string } | undefined;
  const [activeSection] = useState<LabSection>(getInitialSection);
  const [assessmentMessage, setAssessmentMessage] = useState("");
  const [assessments, setAssessments] = useState<StudentAssessment[]>(initialDashboardCache?.assessments ?? []);
  const [examResults, setExamResults] = useState<ExamResult[]>(initialDashboardCache?.examResults ?? []);
  const [examSessions, setExamSessions] = useState<Record<string, ExamSessionProgress>>(initialDashboardCache?.examSessions ?? {});
  const [isCheckingSession, setIsCheckingSession] = useState(
    isSupabaseConfigured && !initialDashboardCache,
  );
  const [studentName, setStudentName] = useState(previewContext.studentName || initialMetadata?.full_name || initialMetadata?.name || initialSession?.user.email?.split("@")[0] || "Student");
  const [dashboardCacheKey, setDashboardCacheKey] = useState(initialDashboardCacheKey);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getActiveSession().then(async (session) => {
      if (!session) {
        window.location.assign("/login");
        return;
      }

      const userRole = getUserRole(session.user);
      const metadata = session.user.user_metadata as { full_name?: string; name?: string };
      setStudentName(previewContext.studentName || metadata.full_name || metadata.name || session.user.email?.split("@")[0] || "Student");

      if (userRole !== "student" && !(userRole === "teacher" && previewContext.isPreview)) {
        window.location.assign(getDashboardPath(userRole));
        return;
      }

      const nextDashboardCacheKey = previewContext.isPreview && previewContext.studentId
        ? `preview:${previewContext.studentId}`
        : session.user.id;
      setDashboardCacheKey(nextDashboardCacheKey);
      const cachedDashboard = getCachedStudentDashboard(nextDashboardCacheKey);
      if (cachedDashboard) {
        setAssessments(cachedDashboard.assessments);
        setExamResults(cachedDashboard.examResults);
        setExamSessions(cachedDashboard.examSessions);
        setIsCheckingSession(false);
      }

      if (userRole === "teacher" && previewContext.isPreview && previewContext.studentId) {
        try {
          const previewStudent = (await getTeacherStudentProgress(session.access_token))
            .find((student) => student.id === previewContext.studentId);
          if (previewStudent) {
            setStudentName(previewStudent.fullName);
            setExamResults(previewStudent.progress.examResults as unknown as ExamResult[]);
            setExamSessions(previewStudent.examSessions);
          } else {
            setAssessmentMessage("This student account is no longer available.");
          }
        } catch {
          setAssessmentMessage("Could not load this student's saved progress.");
        }
      } else {
        let savedResults = getExamResults(session.user.id);
        try {
          const cloudProgress = await getLearningProgress(session.access_token);
          if (cloudProgress.examResults.length > 0) {
            replaceExamResults(session.user.id, cloudProgress.examResults as unknown as ExamResult[]);
            savedResults = getExamResults(session.user.id);
          }
        } catch {
          // Local results remain available while offline.
        }
        setExamResults(savedResults);
        try {
          setExamSessions(await getExamSessionProgress(session.access_token));
        } catch {
          // Assessment cards can still load when session progress is temporarily unavailable.
        }
      }

      if (userRole === "student") {
        try {
          const studentClasses = getCachedStudentClasses(session.user.id) ?? await getStudentClasses(session.access_token);
          cacheStudentClasses(session.user.id, studentClasses);
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
        const nextAssessments = await getStudentAssessments(session.access_token);
        setAssessments(nextAssessments);
      } catch (error) {
        setAssessmentMessage(error instanceof Error ? error.message : "Could not load assessments.");
      }

      setIsCheckingSession(false);
    });
  }, [previewContext.isPreview, previewContext.studentId, previewContext.studentName]);

  useEffect(() => {
    if (!dashboardCacheKey || isCheckingSession) return;
    cacheStudentDashboard(dashboardCacheKey, assessments, examResults, examSessions);
  }, [assessments, dashboardCacheKey, examResults, examSessions, isCheckingSession]);

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      await signOutCurrentAccount();
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

  const visibleExamResults = examResults.filter((result) =>
    result.source === "manual" ||
    assessments.some((assessment) => assessment.id === result.assessmentId),
  );
  const sectionHeading = getSectionHeading(activeSection, previewContext.isPreview);
  const activeId = activeSection === "Test Results" ? "results" : activeSection === "Assessments" ? "assessments" : activeSection === "Advanced Practice" ? "advanced" : "practice";
  const navItems = getStudentClassNavigation(previewContext.query);

  return (
    <CorporateDashboardShell activeId={activeId} navItems={navItems} onSignOut={handleSignOut} profileName={studentName} profileRole={previewContext.isPreview ? `Viewing ${studentName}` : "Student account"} returnHref={previewContext.isPreview ? previewContext.returnHref : undefined} returnLabel="Teacher dashboard">
      <header className="staff-page-heading corporate-page-heading shsat-lab-heading">
        <div><p><BookOpen size={15} /> SHSAT Lab</p><h1>{sectionHeading.title}</h1><span>{sectionHeading.description}</span></div>
        <AppLink className="corporate-heading-action" href={getLabHref("advanced")}><Sparkles size={15} /> Browse advanced practice</AppLink>
      </header>
      <section className="staff-kpi-grid" aria-label="SHSAT learning summary">
        <article><span><Target size={19} /></span><div><p>Practice topics</p><strong>{practiceTopics.length}</strong></div><em>Four difficulty levels</em></article>
        <article><span><BarChart3 size={19} /></span><div><p>Tests completed</p><strong>{visibleExamResults.filter((result) => {
          const currentQuestionCount = assessments.find((assessment) => assessment.id === result.assessmentId)?.questionCount ?? result.total;
          return isExamResultCompleteForQuestionCount(result, currentQuestionCount);
        }).length}</strong></div><em>Saved assessment history</em></article>
        <article><span><ClipboardList size={19} /></span><div><p>Open assessments</p><strong>{assessments.filter((assessment) => assessment.status === "open").length}</strong></div><em>{assessments.length} assigned total</em></article>
        <article><span><Sparkles size={19} /></span><div><p>Advanced passages</p><strong>{advancedPracticePassages.length}</strong></div><em>Close-reading catalog</em></article>
      </section>

      <div className="shsat-lab-content" id="adaptive">

        {activeSection === "Assessments" ? (
          <AssessmentsSection assessments={assessments} examSessions={examSessions} message={assessmentMessage} results={visibleExamResults} />
        ) : activeSection === "Test Results" ? (
          <ResultsSection assessments={assessments} results={visibleExamResults} />
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

            <TopicsSection results={visibleExamResults} />
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
              <AppLink
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
                      ? "Updated from completed assessments"
                      : "Tap to explore"}
                  </span>
                </div>
              </AppLink>
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
          <AppLink href={getTopicHref(focusTopic.slug)}>Start focused practice</AppLink>
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
          const session = examSessions[assessment.id];
          const englishComplete = Boolean(
            session?.completedSections.includes("english") ||
            result?.completedSections?.includes("english"),
          );
          const sessionIsComplete = Boolean(
            session?.status === "submitted" &&
            session.completedSections.includes("english") &&
            session.completedSections.includes("math") &&
            Object.keys(session.answers).length >= assessment.questionCount,
          );
          const resultIsComplete =
            isExamResultCompleteForQuestionCount(result, assessment.questionCount) || sessionIsComplete;
          const hasSavedProgress = Boolean(
            session && (Object.keys(session.answers).length > 0 || session.completedSections.length > 0),
          );
          const onlyOpenSection = assessment.sectionAccess.english && !assessment.sectionAccess.math
            ? "English"
            : assessment.sectionAccess.math && !assessment.sectionAccess.english
              ? "Math"
              : "";
          const nextSection = englishComplete && assessment.sectionAccess.math
            ? "Math"
            : onlyOpenSection;

          return (
          <article className="assessment-card" key={assessment.id}>
            <div className="assessment-card-top">
              <span className={`status-pill status-pill-${resultIsComplete ? "complete" : assessment.status}`}>
                {resultIsComplete ? "Complete" : assessment.status}
              </span>
              <small>{assessment.durationMinutes} min · one session</small>
            </div>
            <h3>{assessment.title}</h3>
            <p>{assessment.description}</p>
            <div className="assessment-meta">
              <span>{assessment.questionCount} questions</span>
              <span>{assessment.passageCount} passages</span>
            </div>
            <div className="assessment-card-actions">
              {resultIsComplete && assessment.allowCompletedAccess && assessment.status === "open" ? (
                <AppLink className="assessment-start-link" href={getAssessmentStartHref(assessment.id)}>
                  {onlyOpenSection ? `Reopen ${onlyOpenSection}` : "Reopen submitted exam"}
                </AppLink>
              ) : resultIsComplete ? (
                <button className="assessment-complete-button" disabled type="button">
                  Complete
                </button>
              ) : assessment.status === "open" ? (
                <AppLink className="assessment-start-link" href={getAssessmentStartHref(assessment.id)}>
                  {hasSavedProgress || result
                    ? nextSection
                      ? `Continue ${nextSection}`
                      : "Continue exam"
                    : onlyOpenSection
                      ? `Start ${onlyOpenSection}`
                      : "Start exam"}
                </AppLink>
              ) : (
                <button disabled type="button">
                  Locked by teacher
                </button>
              )}
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

function ResultsSection({
  assessments,
  results,
}: {
  assessments: StudentAssessment[];
  results: ExamResult[];
}) {
  const completedCount = results.filter((result) => {
    const currentQuestionCount =
      assessments.find((assessment) => assessment.id === result.assessmentId)?.questionCount ?? result.total;
    return isExamResultCompleteForQuestionCount(result, currentQuestionCount);
  }).length;

  return (
    <section className="assessments-panel" aria-labelledby="results-title">
      <div className="section-heading">
        <div>
          <span>Assessment status</span>
          <h2 id="results-title">Your assessment history</h2>
        </div>
        <p>{completedCount} completed</p>
      </div>

      {results.length > 0 ? (
        <div className="assessment-grid">
          {results.map((result) => {
            const assessment = assessments.find((candidate) => candidate.id === result.assessmentId);
            const isComplete = isExamResultCompleteForQuestionCount(
              result,
              assessment?.questionCount ?? result.total,
            );
            const englishScore = result.subjects.find(
              (subject) => subject.subject === "English Language Arts",
            );
            const mathScore = result.subjects.find(
              (subject) => subject.subject === "Mathematics",
            );

            return (
            <article className="assessment-card result-summary-card" key={result.assessmentId}>
              <div className="assessment-card-top">
                <span className={`status-pill status-pill-${isComplete ? "complete" : "open"}`}>
                  {isComplete ? "Complete" : "In progress"}
                </span>
                <small>{result.completionStatus === "english_complete"
                  ? "English submitted · Math pending"
                  : result.completionStatus === "math_complete"
                    ? "Math submitted · English pending"
                    : new Date(result.completedAt).toLocaleDateString()}</small>
              </div>
              <h3>{result.title}</h3>
              <p>
                {result.source === "manual"
                  ? "This paper exam score was entered by your teacher."
                  : isComplete
                  ? "Your answers were submitted. Your teacher can view your score."
                  : "Additional questions are available. Your earlier answers are saved."}
              </p>
              <div className="assessment-meta">
                <span>{result.correct} / {result.total} correct</span>
                <span>{result.percentage}%</span>
              </div>
              {result.source === "manual" ? (
                <div className="paper-result-sections">
                  <span><small>English</small><strong>{englishScore ? `${englishScore.correct} / ${englishScore.total}` : "—"}</strong></span>
                  <span><small>Math</small><strong>{mathScore ? `${mathScore.correct} / ${mathScore.total}` : "—"}</strong></span>
                </div>
              ) : null}
              {result.source !== "manual" && assessment?.status === "open" && (
                !isComplete || assessment.allowCompletedAccess
              ) ? (
                <AppLink className="assessment-start-link" href={getAssessmentStartHref(result.assessmentId)}>
                  {isComplete
                    ? assessment.sectionAccess.english && assessment.sectionAccess.math
                      ? "Reopen submitted exam"
                      : `Reopen ${assessment.sectionAccess.english ? "English" : "Math"}`
                    : "Continue assessment"}
                </AppLink>
              ) : null}
            </article>
            );
          })}
        </div>
      ) : (
        <div className="results-empty-state">
          <h3>No completed assessments yet</h3>
          <p>Your completed assessments will appear here. Scores are available to your teacher.</p>
        </div>
      )}
    </section>
  );
}
