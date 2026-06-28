import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bookmark,
  Check,
  ChevronDown,
  Clock3,
  Flame,
  GraduationCap,
  Heart,
  List,
  LockKeyhole,
  MessageSquare,
  Monitor,
  MousePointer2,
  Pencil,
  Target,
  Timer,
  Volume2,
  User,
  X,
  Zap,
} from "lucide-react";
import {
  getPracticeTopicBySlug,
  type PracticeDifficulty,
  type PracticeQuestion,
} from "../content/practice";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type PracticeMode = "levels" | "questions" | "complete";
type PracticeTool = "pointer" | "eliminator" | "notepad" | "pencil";

type LevelProgress = {
  answered: number;
  bestStreak: number;
  correct: number;
  currentStreak: number;
};

type TopicProgress = Record<PracticeDifficulty, LevelProgress>;

const emptyLevelProgress: LevelProgress = {
  answered: 0,
  bestStreak: 0,
  correct: 0,
  currentStreak: 0,
};

const levelDetails: {
  description: string;
  difficulty: PracticeDifficulty;
  label: string;
}[] = [
  { difficulty: "easy", label: "Easy", description: "Foundational concepts and confidence building" },
  { difficulty: "medium", label: "Medium", description: "Core SHSAT skills and topic mastery" },
  { difficulty: "hard", label: "Hard", description: "Advanced reasoning and higher-difficulty questions" },
  { difficulty: "elite", label: "Elite", description: "Highest challenge level for top-performing students" },
];

function getTopicSlugFromPath() {
  return window.location.pathname.split("/").filter(Boolean)[1] ?? "";
}

function createEmptyTopicProgress(): TopicProgress {
  return {
    easy: { ...emptyLevelProgress },
    medium: { ...emptyLevelProgress },
    hard: { ...emptyLevelProgress },
    elite: { ...emptyLevelProgress },
  };
}

function getProgressStorageKey(userId: string, topicSlug: string) {
  return `nathan-tutors:practice-progress:v1:${userId}:${topicSlug}`;
}

function loadTopicProgress(userId: string, topicSlug: string): TopicProgress {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(getProgressStorageKey(userId, topicSlug)) ?? "null",
    ) as Partial<TopicProgress> | null;

    if (!stored) {
      return createEmptyTopicProgress();
    }

    return {
      easy: { ...emptyLevelProgress, ...stored.easy },
      medium: { ...emptyLevelProgress, ...stored.medium },
      hard: { ...emptyLevelProgress, ...stored.hard },
      elite: { ...emptyLevelProgress, ...stored.elite },
    };
  } catch {
    return createEmptyTopicProgress();
  }
}

function isLevelUnlocked(difficulty: PracticeDifficulty, progress: TopicProgress) {
  if (difficulty === "easy" || difficulty === "medium") {
    return true;
  }

  if (difficulty === "hard") {
    return progress.medium.bestStreak >= 10;
  }

  return progress.hard.bestStreak >= 10;
}

function getUnlockMessage(difficulty: PracticeDifficulty) {
  if (difficulty === "hard") {
    return "Complete Medium with 10 correct in a row to unlock";
  }

  return "Complete Hard with 10 correct in a row to unlock";
}

function PracticeHeader({
  difficulty,
  hearts,
  streak,
  topicTitle,
  xp,
}: {
  difficulty: PracticeDifficulty | null;
  hearts: number;
  streak: number;
  topicTitle: string;
  xp: number;
}) {
  return (
    <header className="practice-header">
      <a className="practice-header-topic" href="/study-hall#topics">
        <span aria-hidden="true"><GraduationCap size={20} /></span>
        <strong>{topicTitle}</strong>
      </a>
      <div className="practice-header-stats" aria-label="Current practice stats">
        <span className="practice-hearts" aria-label={`${hearts} hearts`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Heart key={index} size={17} fill={index < hearts ? "currentColor" : "none"} />
          ))}
        </span>
        <span><Clock3 size={15} /> 0</span>
        <span><Zap size={15} /> {streak}</span>
        <span className={`practice-difficulty-pill is-${difficulty ?? "idle"}`}>
          {difficulty ?? "choose level"}
        </span>
        <span className="practice-xp-pill">{xp} XP</span>
      </div>
    </header>
  );
}

function formatPracticeTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function PracticeExamToolbar({
  activeTool,
  difficulty,
  elapsedSeconds,
  isBookmarked,
  isNotepadOpen,
  isReviewOpen,
  onNext,
  onSelectTool,
  onToggleBookmark,
  onToggleReview,
  questionIndex,
  questionTotal,
  studentName,
  topicTitle,
}: {
  activeTool: PracticeTool;
  difficulty: PracticeDifficulty;
  elapsedSeconds: number;
  isBookmarked: boolean;
  isNotepadOpen: boolean;
  isReviewOpen: boolean;
  onNext: () => void;
  onSelectTool: (tool: PracticeTool) => void;
  onToggleBookmark: () => void;
  onToggleReview: () => void;
  questionIndex: number;
  questionTotal: number;
  studentName: string;
  topicTitle: string;
}) {
  return (
    <>
      <header className="exam-session-toolbar" aria-label="Practice controls">
        <div className="exam-session-toolbar-inner">
          <div className="exam-session-toolbar-cluster">
            <div className="exam-session-toolbar-group exam-session-question-nav">
              <button
                aria-disabled="true"
                aria-label="Previous item"
                className="exam-session-toolbar-button is-muted"
                data-tooltip="Previous"
                type="button"
              >
                <span aria-hidden="true" className="exam-session-arrow-glyph is-left" />
              </button>
              <button
                aria-label="Next item"
                className="exam-session-toolbar-button is-next"
                data-tooltip="Next"
                onClick={onNext}
                type="button"
              >
                <span aria-hidden="true" className="exam-session-arrow-glyph is-right" />
              </button>
            </div>

            <div className="exam-session-toolbar-group exam-session-review-tools">
              <button
                className={`exam-session-toolbar-button is-review ${isReviewOpen ? "is-active-review" : ""}`}
                data-tooltip="Review"
                onClick={onToggleReview}
                type="button"
              >
                <span>Review</span><List aria-hidden="true" size={16} strokeWidth={2.4} />
              </button>
              <button
                aria-pressed={isBookmarked}
                className={`exam-session-toolbar-button is-bookmark ${isBookmarked ? "is-bookmarked" : ""}`}
                onClick={onToggleBookmark}
                type="button"
              >
                <Bookmark aria-hidden="true" fill={isBookmarked ? "currentColor" : "none"} size={17} />
                <span>Bookmark</span>
                <span className="exam-bookmark-tooltip">Bookmark Question for Review</span>
              </button>
              {isReviewOpen ? (
                <section className="exam-review-menu practice-review-menu" aria-label="Review questions">
                  <div className="exam-review-tabs">
                    <button className="exam-review-tab is-active" type="button">
                      <span className="exam-review-tab-icon exam-review-tab-icon-square">{questionTotal}</span>
                      <span>All Questions</span>
                    </button>
                  </div>
                  <div className="exam-review-list">
                    {Array.from({ length: questionTotal }, (_, index) => (
                      <button
                        aria-disabled={index > questionIndex}
                        className={`exam-review-row ${index === questionIndex ? "is-current" : ""}`}
                        disabled={index !== questionIndex}
                        key={index}
                        type="button"
                      >
                        <span>Question {index + 1}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="exam-session-toolbar-group exam-session-work-tools">
              <button
                aria-label="Pointer tool"
                className={`exam-session-tool-button ${activeTool === "pointer" ? "is-active" : ""}`}
                data-tooltip="Pointer"
                onClick={() => onSelectTool("pointer")}
                type="button"
              ><MousePointer2 aria-hidden="true" fill="currentColor" size={18} /></button>
              <button
                aria-label="Eliminate answer tool"
                className={`exam-session-tool-button ${activeTool === "eliminator" ? "is-active" : ""}`}
                data-tooltip="Answer Eliminator"
                onClick={() => onSelectTool("eliminator")}
                type="button"
              ><X aria-hidden="true" size={18} /></button>
              <button
                aria-label="Notepad tool"
                className={`exam-session-tool-button ${activeTool === "notepad" || isNotepadOpen ? "is-active" : ""}`}
                data-tooltip="Notepad"
                onClick={() => onSelectTool("notepad")}
                type="button"
              ><MessageSquare aria-hidden="true" size={17} /></button>
              <button
                aria-label="Pencil tool"
                className={`exam-session-tool-button ${activeTool === "pencil" ? "is-active" : ""}`}
                data-tooltip="Pencil"
                onClick={() => onSelectTool("pencil")}
                type="button"
              ><Pencil aria-hidden="true" size={17} /></button>
            </div>
          </div>

          <div className="exam-session-user-tools">
            <button
              aria-label={`Practice timer: ${formatPracticeTime(elapsedSeconds)}`}
              className="exam-session-timer-button"
              title={formatPracticeTime(elapsedSeconds)}
              type="button"
            >
              <Clock3 aria-hidden="true" size={16} />
            </button>
            <span className="exam-session-user-name">{studentName}</span>
            <button className="exam-session-user-button" type="button" aria-label="User menu">
              <User aria-hidden="true" fill="currentColor" size={14} />
              <ChevronDown aria-hidden="true" size={12} />
            </button>
          </div>
        </div>
      </header>
      <div className="exam-session-bluebar" />
      <nav className="exam-session-breadcrumb" aria-label="Practice location">
        <div className="exam-session-breadcrumb-inner">
          <div className="exam-session-breadcrumb-text">
            <span>{topicTitle.toUpperCase()}</span><span>/</span>
            <span>{difficulty.toUpperCase()} PRACTICE</span><span>/</span>
            <span>{questionIndex + 1} OF {questionTotal}</span>
          </div>
          <span className="exam-session-status-icon" aria-hidden="true"><Monitor size={19} /></span>
        </div>
      </nav>
    </>
  );
}

function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    [
      { icon: LockKeyhole, title: "Difficulty Levels", copy: "Easy and Medium are open from day one. Get 10 correct in a row at Medium to unlock Hard." },
      { icon: Target, title: "Hearts", copy: "You start with 5 hearts. Wrong answers cost one, while three correct answers restore one." },
      { icon: Flame, title: "Streaks & Speed", copy: "Build a streak for XP multipliers and learn to answer accurately under time pressure." },
    ],
    [
      { icon: Flame, title: "Streaks & Speed", copy: "Keep a streak going for XP multipliers. Your pace is tracked on every question." },
      { icon: Zap, title: "Mastery Score", copy: "Each topic has 40 mastery milestones, with 10 available at each difficulty level." },
      { icon: Timer, title: "Focused Practice", copy: "Short sessions make it easy to practice one skill without losing momentum." },
    ],
  ] as const;

  return (
    <div className="practice-onboarding-layer" role="presentation">
      <section aria-labelledby="practice-onboarding-title" aria-modal="true" className="practice-onboarding" role="dialog">
        <header>
          <div className="practice-coach-mark" aria-hidden="true">
            <GraduationCap size={28} />
            <span>Hi!</span>
          </div>
          <div>
            <small>NT Coach says</small>
            <h2 id="practice-onboarding-title">How the Game Works</h2>
          </div>
          <button aria-label="Read instructions aloud" type="button"><Volume2 size={18} /></button>
          <button aria-label="Close instructions" onClick={onClose} type="button"><X size={22} /></button>
          <p>
            Every topic starts at Easy and Medium. Answer 10 in a row correctly to unlock the next level,
            all the way to Elite. Your goal is not just to pass; it is to master every topic.
          </p>
          <div className="practice-onboarding-dots" aria-label={`Step ${step + 1} of 2`}>
            <span className={step === 0 ? "is-active" : ""} />
            <span className={step === 1 ? "is-active" : ""} />
          </div>
        </header>

        <div className="practice-onboarding-body">
          <div className="practice-onboarding-features">
            {steps[step].map((feature) => (
              <article key={feature.title}>
                <feature.icon aria-hidden="true" size={18} />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="practice-onboarding-actions">
            <button onClick={onClose} type="button">Skip</button>
            <button
              onClick={() => {
                if (step === 0) {
                  setStep(1);
                } else {
                  onClose();
                }
              }}
              type="button"
            >
              {step === 0 ? "Next" : "Let's practice"} <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function TopicPracticePage() {
  const topic = getPracticeTopicBySlug(getTopicSlugFromPath());
  const [activeTool, setActiveTool] = useState<PracticeTool>("pointer");
  const [activeDifficulty, setActiveDifficulty] = useState<PracticeDifficulty | null>(null);
  const [answerState, setAnswerState] = useState<"correct" | "incorrect" | null>(null);
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [eliminatedChoiceIds, setEliminatedChoiceIds] = useState<string[]>([]);
  const [hearts, setHearts] = useState(5);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured && Boolean(topic));
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isUnansweredModalOpen, setIsUnansweredModalOpen] = useState(false);
  const [mode, setMode] = useState<PracticeMode>("levels");
  const [notepadText, setNotepadText] = useState("");
  const [onboardingStep, setOnboardingStep] = useState<"open" | "closed">("closed");
  const [progress, setProgress] = useState<TopicProgress>(createEmptyTopicProgress);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState("");
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [studentName, setStudentName] = useState("Student");
  const [userId, setUserId] = useState("");
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured || !topic) {
      return;
    }

    getSupabaseClient().auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const nextUserId = data.session.user.id;
      const metadata = data.session.user.user_metadata as {
        full_name?: string;
        name?: string;
      };
      setStudentName(
        metadata.full_name
          ?? metadata.name
          ?? data.session.user.email?.split("@")[0]
          ?? "Student",
      );
      setUserId(nextUserId);
      setProgress(loadTopicProgress(nextUserId, topic.slug));
      setOnboardingStep(
        window.localStorage.getItem(`nathan-tutors:practice-onboarding:v1:${nextUserId}`)
          ? "closed"
          : "open",
      );
      setIsLoading(false);
    });
  }, [topic]);

  useEffect(() => {
    if (mode !== "questions") {
      return;
    }

    const timerId = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [mode]);

  const activeQuestions = useMemo(
    () => topic?.questionBank.filter((question) => question.difficulty === activeDifficulty) ?? [],
    [activeDifficulty, topic],
  );
  const currentQuestion = activeQuestions[questionIndex] as PracticeQuestion | undefined;
  const answered = progress.easy.answered + progress.medium.answered + progress.hard.answered + progress.elite.answered;
  const correct = progress.easy.correct + progress.medium.correct + progress.hard.correct + progress.elite.correct;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  function closeOnboarding() {
    if (userId) {
      window.localStorage.setItem(`nathan-tutors:practice-onboarding:v1:${userId}`, "complete");
    }
    setOnboardingStep("closed");
  }

  function startLevel(difficulty: PracticeDifficulty) {
    if (!isLevelUnlocked(difficulty, progress)) {
      return;
    }

    setActiveDifficulty(difficulty);
    setActiveTool("pointer");
    setAnswerState(null);
    setBookmarkedQuestionIds([]);
    setElapsedSeconds(0);
    setEliminatedChoiceIds([]);
    setHearts(5);
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setMode("questions");
    setNotepadText("");
    setQuestionIndex(0);
    setSelectedChoiceId("");
    setSessionCorrect(0);
    setSessionStreak(progress[difficulty].currentStreak);
    setXp(0);
  }

  function saveProgress(nextProgress: TopicProgress) {
    setProgress(nextProgress);
    if (userId && topic) {
      window.localStorage.setItem(getProgressStorageKey(userId, topic.slug), JSON.stringify(nextProgress));
    }
  }

  function submitAnswer() {
    if (!activeDifficulty || !currentQuestion || !selectedChoiceId || answerState) {
      return;
    }

    const isCorrect = selectedChoiceId === currentQuestion.correctChoiceId;
    const nextStreak = isCorrect ? sessionStreak + 1 : 0;
    const currentLevelProgress = progress[activeDifficulty];
    const nextProgress = {
      ...progress,
      [activeDifficulty]: {
        answered: currentLevelProgress.answered + 1,
        bestStreak: Math.max(currentLevelProgress.bestStreak, nextStreak),
        correct: currentLevelProgress.correct + (isCorrect ? 1 : 0),
        currentStreak: nextStreak,
      },
    };

    saveProgress(nextProgress);
    setAnswerState(isCorrect ? "correct" : "incorrect");
    setSessionStreak(nextStreak);
    if (isCorrect) {
      setSessionCorrect((value) => value + 1);
      setXp((value) => value + 10 + Math.min(nextStreak, 10));
      if (nextStreak > 0 && nextStreak % 3 === 0) {
        setHearts((value) => Math.min(5, value + 1));
      }
    } else {
      setHearts((value) => Math.max(0, value - 1));
    }
  }

  function goToNextQuestion() {
    if (questionIndex >= activeQuestions.length - 1 || hearts === 0) {
      setMode("complete");
      return;
    }

    setQuestionIndex((value) => value + 1);
    setActiveTool("pointer");
    setEliminatedChoiceIds([]);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setSelectedChoiceId("");
    setAnswerState(null);
  }

  function handlePracticeTool(tool: PracticeTool) {
    if (tool === "notepad") {
      const nextOpen = !isNotepadOpen;
      setIsNotepadOpen(nextOpen);
      setActiveTool(nextOpen ? "notepad" : "pointer");
      return;
    }

    setActiveTool(tool);
  }

  function handlePracticeChoice(choiceId: string) {
    if (answerState) {
      return;
    }

    if (activeTool === "eliminator") {
      setEliminatedChoiceIds((currentIds) =>
        currentIds.includes(choiceId)
          ? currentIds.filter((currentId) => currentId !== choiceId)
          : [...currentIds, choiceId],
      );
      return;
    }

    setSelectedChoiceId(choiceId);
    setEliminatedChoiceIds((currentIds) => currentIds.filter((currentId) => currentId !== choiceId));
  }

  function handlePracticeNext() {
    if (answerState) {
      goToNextQuestion();
      return;
    }

    if (!selectedChoiceId) {
      setIsUnansweredModalOpen(true);
      return;
    }

    submitAnswer();
  }

  if (isLoading) {
    return <main className="loading-shell">Loading practice...</main>;
  }

  if (!topic) {
    return (
      <main className="practice-shell">
        <section className="practice-missing-topic">
          <h1>Topic not found</h1>
          <a href="/study-hall#topics">Return to adaptive practice</a>
        </section>
      </main>
    );
  }

  if (mode === "questions" && currentQuestion && activeDifficulty) {
    const isBookmarked = bookmarkedQuestionIds.includes(currentQuestion.id);

    return (
      <main className="exam-session-shell practice-exam-shell">
        <PracticeExamToolbar
          activeTool={activeTool}
          difficulty={activeDifficulty}
          elapsedSeconds={elapsedSeconds}
          isBookmarked={isBookmarked}
          isNotepadOpen={isNotepadOpen}
          isReviewOpen={isReviewOpen}
          onNext={handlePracticeNext}
          onSelectTool={handlePracticeTool}
          onToggleBookmark={() =>
            setBookmarkedQuestionIds((currentIds) =>
              currentIds.includes(currentQuestion.id)
                ? currentIds.filter((questionId) => questionId !== currentQuestion.id)
                : [...currentIds, currentQuestion.id],
            )
          }
          onToggleReview={() => setIsReviewOpen((value) => !value)}
          questionIndex={questionIndex}
          questionTotal={activeQuestions.length}
          studentName={studentName}
          topicTitle={topic.title}
        />

        <section className="exam-question-document practice-exam-document" aria-labelledby="practice-question-title">
          <section className="exam-question-passage practice-exam-stimulus" aria-label="Reading selection">
            <div className="exam-question-passage-scroll is-prose">
              <h2>{topic.title}</h2>
              <p>{currentQuestion.stimulus}</p>
            </div>
          </section>

          <section className="exam-question-panel practice-exam-question-panel">
            <form className="exam-question-form" onSubmit={(event) => event.preventDefault()}>
              <h1 id="practice-question-title">{currentQuestion.prompt}</h1>
              <div className="exam-choice-list">
                {currentQuestion.choices.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  const isEliminated = eliminatedChoiceIds.includes(choice.id);
                  const isCorrectChoice = Boolean(answerState) && choice.id === currentQuestion.correctChoiceId;
                  const isWrongChoice = answerState === "incorrect" && isSelected;

                  return (
                    <label
                      className={`exam-choice practice-exam-choice ${isEliminated ? "is-eliminated" : ""} ${isCorrectChoice ? "is-correct" : ""} ${isWrongChoice ? "is-incorrect" : ""}`}
                      key={choice.id}
                      onClick={() => handlePracticeChoice(choice.id)}
                    >
                      <input
                        checked={isSelected}
                        disabled={Boolean(answerState)}
                        name={currentQuestion.id}
                        onChange={() => undefined}
                        type="radio"
                      />
                      <span>{choice.id}.</span>
                      <span>{choice.text}</span>
                      {isEliminated ? (
                        <svg
                          aria-hidden="true"
                          className="exam-choice-eliminator-x"
                          focusable="false"
                          preserveAspectRatio="none"
                          viewBox="0 0 100 100"
                        >
                          <line vectorEffect="non-scaling-stroke" x1="0" x2="100" y1="0" y2="100" />
                          <line vectorEffect="non-scaling-stroke" x1="0" x2="100" y1="100" y2="0" />
                        </svg>
                      ) : null}
                    </label>
                  );
                })}
              </div>

              {answerState ? (
                <div className={`practice-feedback is-${answerState}`}>
                  <span aria-hidden="true">{answerState === "correct" ? <Check size={20} /> : <X size={20} />}</span>
                  <div>
                    <strong>{answerState === "correct" ? "Correct" : "Not quite"}</strong>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                </div>
              ) : null}
            </form>
          </section>
        </section>

        {isNotepadOpen ? (
          <section className="exam-notepad-window" aria-label="Notepad">
            <header>
              <h2>Notepad</h2>
              <button aria-label="Close notepad" onClick={() => handlePracticeTool("notepad")} type="button">x</button>
            </header>
            <textarea autoFocus onChange={(event) => setNotepadText(event.target.value)} value={notepadText} />
          </section>
        ) : null}

        {isUnansweredModalOpen ? (
          <div className="exam-attention-layer">
            <section aria-modal="true" className="exam-attention-modal" role="alertdialog">
              <header>
                <h2>Attention</h2>
                <button className="exam-attention-close" onClick={() => setIsUnansweredModalOpen(false)} type="button">x</button>
              </header>
              <p>You must select an answer before you can continue.</p>
              <div className="exam-attention-actions">
                <button onClick={() => setIsUnansweredModalOpen(false)} type="button">OK</button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    );
  }

  return (
    <main className="practice-shell">
      <PracticeHeader difficulty={activeDifficulty} hearts={hearts} streak={sessionStreak} topicTitle={topic.title} xp={xp} />

      {mode === "levels" ? (
        <section className="practice-level-page" aria-labelledby="practice-topic-title">
          <header>
            <span>Choose your level</span>
            <h1 id="practice-topic-title">{topic.title}</h1>
            <p>Get 10 correct in a row to unlock the next level.</p>
          </header>

          <div className="practice-level-list">
            {levelDetails.map((level) => {
              const unlocked = isLevelUnlocked(level.difficulty, progress);
              return (
                <article className={`practice-level-card is-${level.difficulty} ${unlocked ? "is-unlocked" : "is-locked"}`} key={level.difficulty}>
                  <span className="practice-level-icon" aria-hidden="true"><LockKeyhole size={25} /></span>
                  <div>
                    <div className="practice-level-title">
                      <h2>{level.label}</h2>
                      <span>{unlocked ? "Unlocked" : "Locked"}</span>
                    </div>
                    <p>{level.description}</p>
                    {!unlocked ? <small><LockKeyhole size={11} /> {getUnlockMessage(level.difficulty)}</small> : null}
                  </div>
                  <button disabled={!unlocked} onClick={() => startLevel(level.difficulty)} type="button">
                    {unlocked ? `Start ${level.label}` : "Locked"}
                  </button>
                </article>
              );
            })}
          </div>

          <section className="practice-how-it-works" aria-labelledby="how-it-works-title">
            <h2 id="how-it-works-title">How it works</h2>
            <ol>
              <li><span>1</span><Target size={17} /><strong>Answer questions</strong></li>
              <li><span>2</span><Flame size={17} /><strong>Get 10 correct in a row</strong></li>
              <li><span>3</span><LockKeyhole size={17} /><strong>Unlock the next level</strong></li>
              <li><span>4</span><BarChart3 size={17} /><strong>Keep leveling up</strong></li>
            </ol>
          </section>
        </section>
      ) : null}

      {mode === "complete" ? (
        <section className="practice-complete-card">
          <span aria-hidden="true"><Check size={28} /></span>
          <p>Practice complete</p>
          <h1>{sessionCorrect}/{activeQuestions.length} correct</h1>
          <p>You earned {xp} XP and finished with a {sessionStreak}-answer streak.</p>
          <button onClick={() => setMode("levels")} type="button">Back to levels</button>
        </section>
      ) : null}

      <footer className="practice-stats-footer">
        <div><Check size={18} /><strong>{answered}</strong><span>Answered</span></div>
        <div><Target size={18} /><strong>{accuracy}%</strong><span>Accuracy</span></div>
        <div><Flame size={18} /><strong>{sessionStreak}</strong><span>Streak</span></div>
        <div><Zap size={18} /><strong>{xp} XP</strong><span>Earned</span></div>
      </footer>

      {onboardingStep === "open" ? <OnboardingModal onClose={closeOnboarding} /> : null}
    </main>
  );
}
