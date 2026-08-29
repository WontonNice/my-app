import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Clock3,
  KeyRound,
  List,
  MessageSquare,
  Monitor,
  MousePointer2,
  Pencil,
  RotateCcw,
  Send,
  Timer,
  Trophy,
  User,
  X,
} from "lucide-react";
import { getAdvancedPracticePassage } from "../content/advancedPractice";
import { getExamLibraryPassage } from "../content/exams/passageLibrary";
import type { ExamPassageSet } from "../content/exams/types";
import {
  getStudentLibraryCorrections,
  getStudentLibraryAttempts,
  saveStudentLibraryAttempt,
  submitStudentLibraryCorrections,
  unlockLibraryBook,
  type StudentLibraryCorrectionView,
  type StudentLibraryAttempt,
} from "../lib/api";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { appendStudentPreview } from "../lib/studentPreview";

type AdvancedTool = "pointer" | "eliminator" | "notepad" | "pencil";
type ReviewFilter = "all" | "notAnswered" | "bookmarks";

function getPassageIdFromPath() {
  return window.location.pathname.split("/").filter(Boolean).at(-1) ?? "";
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatAttemptDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function renderFormattedText(text: string): ReactNode {
  return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function StudentAttemptSummary({ attempt, featured = false }: { attempt: StudentLibraryAttempt; featured?: boolean }) {
  const percentage = attempt.totalQuestions ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0;
  return (
    <article className={`library-attempt-summary${featured ? " is-featured" : ""}`}>
      <header>
        <div><small>Attempt {attempt.attemptNumber}</small><strong>{featured ? "Book complete" : formatAttemptDate(attempt.completedAt)}</strong></div>
        <span>{percentage}%</span>
      </header>
      <div className="library-attempt-totals">
        <span><Trophy size={18} /><small>Total score</small><strong>{attempt.score} / {attempt.totalQuestions}</strong></span>
        <span><Timer size={18} /><small>Total time</small><strong>{formatDuration(attempt.totalTimeSeconds)}</strong></span>
      </div>
      <div className="library-question-time-list" aria-label={`Question times for attempt ${attempt.attemptNumber}`}>
        <strong>Time by question</strong>
        <div>
          {attempt.questions.map((question) => (
            <span key={question.questionId}><small>Question {question.questionNumber}</small><b>{formatDuration(question.timeSpentSeconds)}</b></span>
          ))}
        </div>
      </div>
      <p className="library-student-privacy-note">Question results stay hidden in your score history. If corrections are needed, review them in the separate Corrections workspace.</p>
    </article>
  );
}

type CorrectionDraft = Record<string, {
  whyChosenIncorrect: string;
  whyCorrectAnswerCorrect: string;
}>;

function StudentCorrectionsPage({
  collectionLabel,
  correctionDraft,
  correctionError,
  isLoading,
  isSubmitting,
  onBack,
  onDraftChange,
  onRetry,
  onSubmit,
  passageSet,
  studentName,
  view,
}: {
  collectionLabel: string;
  correctionDraft: CorrectionDraft;
  correctionError: string;
  isLoading: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onDraftChange: (questionId: string, field: keyof CorrectionDraft[string], value: string) => void;
  onRetry: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  passageSet: ExamPassageSet;
  studentName: string;
  view: StudentLibraryCorrectionView | null;
}) {
  if (isLoading) {
    return <main className="library-corrections-page"><div className="library-corrections-loading" role="status">Loading your first attempt…</div></main>;
  }

  if (!view) {
    return (
      <main className="library-corrections-page">
        <header className="library-corrections-topbar"><button onClick={onBack} type="button"><ArrowLeft size={16} /> Back</button><span>{studentName}</span></header>
        <section className="library-corrections-error" role="alert"><MessageSquare size={24} /><h1>Corrections could not be opened</h1><p>{correctionError}</p><button onClick={onRetry} type="button">Try again</button></section>
      </main>
    );
  }

  const isSubmitted = Boolean(view.correction);
  const responsesByQuestion = new Map(view.correction?.responses.map((response) => [response.questionId, response]) ?? []);

  return (
    <main className="library-corrections-page">
      <header className="library-corrections-topbar"><button onClick={onBack} type="button"><ArrowLeft size={16} /> Back to results</button><span>{studentName}</span></header>
      <section className="library-corrections-hero">
        <span><MessageSquare size={25} /></span>
        <p>{collectionLabel} · {passageSet.passage.title}</p>
        <h1>Corrections</h1>
        <small>Your first-attempt answers are locked. Explain both parts for every question you missed.</small>
      </section>
      <div className="library-corrections-layout">
        <aside>
          <StudentAttemptSummary attempt={view.attempt} featured />
          <div className={`library-correction-status${isSubmitted ? " is-submitted" : ""}`}>
            {isSubmitted ? <CheckCircle2 size={19} /> : <MessageSquare size={19} />}
            <span><strong>{isSubmitted ? "Submitted to your teacher" : "Ready to complete"}</strong><small>{isSubmitted && view.correction ? `Submitted ${formatAttemptDate(view.correction.submittedAt)}` : "Complete every explanation, then submit once."}</small></span>
          </div>
        </aside>
        <form className="library-correction-form" onSubmit={onSubmit}>
          {passageSet.questions.map((question, index) => {
            const result = view.attempt.questions.find((item) => item.questionId === question.id);
            if (!result) return null;
            const savedResponse = responsesByQuestion.get(question.id);
            const draft = correctionDraft[question.id] ?? { whyChosenIncorrect: "", whyCorrectAnswerCorrect: "" };
            return (
              <article className={`library-correction-question${result.isCorrect ? " is-correct" : " is-missed"}`} key={question.id}>
                <header><span>Question {index + 1}</span><strong>{result.isCorrect ? "Correct on first attempt" : "Correction required"}</strong></header>
                <h2>{renderFormattedText(question.prompt)}</h2>
                <div className="library-correction-choices" aria-label={`Locked answers for question ${index + 1}`}>
                  {question.choices?.map((choice) => {
                    const isSelected = choice.id === result.selectedAnswerId;
                    const isCorrectAnswer = choice.id === result.correctAnswerId;
                    return <div className={`${isSelected ? " is-selected" : ""}${isCorrectAnswer ? " is-answer" : ""}`} key={choice.id}><b>{choice.id}</b><span>{renderFormattedText(choice.text)}</span>{isSelected ? <small>Your first answer</small> : null}{isCorrectAnswer ? <small>Correct answer</small> : null}</div>;
                  })}
                </div>
                {result.isCorrect ? (
                  <div className="library-correction-congrats"><CheckCircle2 size={20} /><span><strong>Congratulations, you got it correct.</strong><small>No written correction is needed for this question.</small></span></div>
                ) : (
                  <div className="library-correction-explanations">
                    <label>
                      <span>Why is the answer I chose incorrect?</span>
                      <textarea
                        maxLength={4000}
                        onChange={(event) => onDraftChange(question.id, "whyChosenIncorrect", event.target.value)}
                        placeholder="Explain the mistake in your first answer…"
                        readOnly={isSubmitted}
                        required
                        rows={4}
                        value={savedResponse?.whyChosenIncorrect ?? draft.whyChosenIncorrect}
                      />
                    </label>
                    <label>
                      <span>Why is the correct answer correct?</span>
                      <textarea
                        maxLength={4000}
                        onChange={(event) => onDraftChange(question.id, "whyCorrectAnswerCorrect", event.target.value)}
                        placeholder="Use evidence or reasoning to explain the correct answer…"
                        readOnly={isSubmitted}
                        required
                        rows={4}
                        value={savedResponse?.whyCorrectAnswerCorrect ?? draft.whyCorrectAnswerCorrect}
                      />
                    </label>
                  </div>
                )}
              </article>
            );
          })}
          {correctionError ? <p className="library-correction-submit-error" role="alert">{correctionError}</p> : null}
          {!isSubmitted ? <div className="library-correction-submit"><p>Corrections cannot be edited after submission.</p><button disabled={isSubmitting} type="submit"><Send size={16} /> {isSubmitting ? "Submitting…" : "Submit corrections"}</button></div> : null}
        </form>
      </div>
    </main>
  );
}

function AdvancedExamToolbar({
  activeTool,
  bookmarkedQuestionIds,
  collectionLabel,
  currentQuestionIndex,
  isComplete,
  isNotepadOpen,
  isReviewOpen,
  maxVisitedIndex,
  onNext,
  onPrevious,
  onReviewFilterChange,
  onReviewQuestionSelect,
  onSelectTool,
  onToggleBookmark,
  onToggleReview,
  passageTitle,
  questionIds,
  reviewFilter,
  selectedAnswers,
  studentName,
}: {
  activeTool: AdvancedTool;
  bookmarkedQuestionIds: string[];
  collectionLabel: string;
  currentQuestionIndex: number;
  isComplete: boolean;
  isNotepadOpen: boolean;
  isReviewOpen: boolean;
  maxVisitedIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onReviewFilterChange: (filter: ReviewFilter) => void;
  onReviewQuestionSelect: (index: number) => void;
  onSelectTool: (tool: AdvancedTool) => void;
  onToggleBookmark: () => void;
  onToggleReview: () => void;
  passageTitle: string;
  questionIds: string[];
  reviewFilter: ReviewFilter;
  selectedAnswers: Record<string, string>;
  studentName: string;
}) {
  const currentQuestionId = questionIds[currentQuestionIndex];
  const unansweredCount = questionIds.filter((questionId, index) => index <= maxVisitedIndex && !selectedAnswers[questionId]).length;
  const visibleQuestions = questionIds
    .map((questionId, index) => ({
      id: questionId,
      index,
      isAnswered: Boolean(selectedAnswers[questionId]),
      isBookmarked: bookmarkedQuestionIds.includes(questionId),
    }))
    .filter((question) => {
      if (question.index > maxVisitedIndex) {
        return false;
      }
      if (reviewFilter === "notAnswered") {
        return !question.isAnswered;
      }
      if (reviewFilter === "bookmarks") {
        return question.isBookmarked;
      }
      return true;
    });

  return (
    <>
      <header className="exam-session-toolbar" aria-label={`${collectionLabel} controls`}>
        <div className="exam-session-toolbar-inner">
          <div className="exam-session-toolbar-cluster">
            <div className="exam-session-toolbar-group exam-session-question-nav">
              <button
                aria-disabled={currentQuestionIndex === 0 && !isComplete ? true : undefined}
                aria-label="Previous item"
                className={`exam-session-toolbar-button ${currentQuestionIndex > 0 || isComplete ? "is-next" : "is-muted"}`}
                data-tooltip="Previous"
                onClick={currentQuestionIndex > 0 || isComplete ? onPrevious : undefined}
                type="button"
              >
                <span aria-hidden="true" className="exam-session-arrow-glyph is-left" />
              </button>
              <button
                aria-disabled={isComplete ? true : undefined}
                aria-label="Next item"
                className={`exam-session-toolbar-button ${isComplete ? "is-muted" : "is-next"}`}
                data-tooltip="Next"
                onClick={isComplete ? undefined : onNext}
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
                aria-pressed={Boolean(currentQuestionId && bookmarkedQuestionIds.includes(currentQuestionId))}
                className={`exam-session-toolbar-button is-bookmark ${currentQuestionId && bookmarkedQuestionIds.includes(currentQuestionId) ? "is-bookmarked" : ""}`}
                disabled={isComplete}
                onClick={onToggleBookmark}
                type="button"
              >
                <Bookmark
                  aria-hidden="true"
                  fill={currentQuestionId && bookmarkedQuestionIds.includes(currentQuestionId) ? "currentColor" : "none"}
                  size={17}
                />
                <span>Bookmark</span>
                <span className="exam-bookmark-tooltip">Bookmark Question for Review</span>
              </button>

              {isReviewOpen ? (
                <section className="exam-review-menu" aria-label="Review questions">
                  <div className="exam-review-tabs">
                    <button className={`exam-review-tab ${reviewFilter === "all" ? "is-active" : ""}`} onClick={() => onReviewFilterChange("all")} type="button">
                      <span className="exam-review-tab-icon exam-review-tab-icon-square">{maxVisitedIndex + 1}</span>
                      <span>All Questions</span>
                    </button>
                    <button className={`exam-review-tab ${reviewFilter === "notAnswered" ? "is-active" : ""}`} onClick={() => onReviewFilterChange("notAnswered")} type="button">
                      <span className="exam-review-tab-icon exam-review-tab-icon-circle">{unansweredCount}</span>
                      <span>Not Answered</span>
                    </button>
                    <button className={`exam-review-tab ${reviewFilter === "bookmarks" ? "is-active" : ""}`} onClick={() => onReviewFilterChange("bookmarks")} type="button">
                      <span className="exam-review-tab-icon exam-review-tab-icon-bookmark">{bookmarkedQuestionIds.length}</span>
                      <span>Bookmarks</span>
                    </button>
                  </div>
                  <div className="exam-review-list">
                    {visibleQuestions.length > 0 ? visibleQuestions.map((question) => (
                      <button
                        className={`exam-review-row ${!isComplete && question.index === currentQuestionIndex ? "is-current" : ""} ${question.isAnswered ? "" : "is-unanswered"}`}
                        key={question.id}
                        onClick={() => onReviewQuestionSelect(question.index)}
                        type="button"
                      >
                        {!question.isAnswered ? <span className="exam-review-row-dot" aria-hidden="true" /> : null}
                        <span>Question {question.index + 1}</span>
                        {question.isBookmarked ? <Bookmark aria-label="Bookmarked" className="exam-review-row-bookmark" fill="currentColor" size={15} /> : null}
                      </button>
                    )) : <p className="exam-review-empty">No questions to show.</p>}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="exam-session-toolbar-group exam-session-work-tools">
              <button aria-label="Pointer tool" className={`exam-session-tool-button ${activeTool === "pointer" ? "is-active" : ""}`} data-tooltip="Pointer" onClick={() => onSelectTool("pointer")} type="button">
                <MousePointer2 aria-hidden="true" fill="currentColor" size={18} />
              </button>
              <button aria-label="Eliminate answer tool" className={`exam-session-tool-button ${activeTool === "eliminator" ? "is-active" : ""}`} data-tooltip="Answer Eliminator" onClick={() => onSelectTool("eliminator")} type="button">
                <X aria-hidden="true" size={18} />
              </button>
              <button aria-label="Notepad tool" className={`exam-session-tool-button ${activeTool === "notepad" || isNotepadOpen ? "is-active" : ""}`} data-tooltip="Notepad" onClick={() => onSelectTool("notepad")} type="button">
                <MessageSquare aria-hidden="true" size={17} />
              </button>
              <button aria-label="Pencil tool" className={`exam-session-tool-button ${activeTool === "pencil" ? "is-active" : ""}`} data-tooltip="Pencil" onClick={() => onSelectTool("pencil")} type="button">
                <Pencil aria-hidden="true" size={17} />
              </button>
            </div>
          </div>

          <div className="exam-session-user-tools">
            <button aria-label="Show timer" className="exam-session-timer-button" type="button"><Clock3 aria-hidden="true" size={16} /></button>
            <span className="exam-session-user-name">{studentName}</span>
            <button aria-label="User menu" className="exam-session-user-button" type="button">
              <User aria-hidden="true" fill="currentColor" size={14} />
              <ChevronDown aria-hidden="true" size={12} />
            </button>
          </div>
        </div>
      </header>
      <div className="exam-session-bluebar" />
      <nav className="exam-session-breadcrumb" aria-label={`${collectionLabel} location`}>
        <div className="exam-session-breadcrumb-inner">
          <div className="exam-session-breadcrumb-text">
            <span>{collectionLabel.toUpperCase()}</span><span>/</span><span>{passageTitle.toUpperCase()}</span><span>/</span>
            <span>{isComplete ? "PASSAGE END DIRECTIONS" : `${currentQuestionIndex + 1} OF ${questionIds.length}`}</span>
          </div>
          <span className="exam-session-status-icon" aria-hidden="true"><Monitor size={19} /></span>
        </div>
      </nav>
    </>
  );
}

export function AdvancedPassagePage() {
  const { accessToken, isCheckingSession, previewContext, studentName } = useStudentPortalAccess();
  const isShsatLibraryPassage = window.location.pathname.includes("/study-hall/shsat/library/");
  const bookId = getPassageIdFromPath();
  const passageEntry = isShsatLibraryPassage
    ? getExamLibraryPassage(bookId)
    : getAdvancedPracticePassage(bookId);
  const passageSet = passageEntry?.passageSet;
  const [activeTool, setActiveTool] = useState<AdvancedTool>("pointer");
  const [accessCode, setAccessCode] = useState("");
  const [attempts, setAttempts] = useState<StudentLibraryAttempt[]>([]);
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([]);
  const [correctionDraft, setCorrectionDraft] = useState<CorrectionDraft>({});
  const [correctionError, setCorrectionError] = useState("");
  const [correctionView, setCorrectionView] = useState<StudentLibraryCorrectionView | null>(null);
  const [eliminatedChoices, setEliminatedChoices] = useState<Record<string, string[]>>({});
  const [isCorrectionsOpen, setIsCorrectionsOpen] = useState(false);
  const [isLoadingCorrections, setIsLoadingCorrections] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmittingCorrections, setIsSubmittingCorrections] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnansweredModalOpen, setIsUnansweredModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(previewContext.isPreview);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0);
  const [note, setNote] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [resultAttempt, setResultAttempt] = useState<StudentLibraryAttempt | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const attemptStartedAtRef = useRef(new Date().toISOString());
  const questionStartedAtRef = useRef(0);
  const questionTimesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!accessToken || previewContext.isPreview || !passageSet) return;
    let isMounted = true;
    getStudentLibraryAttempts(accessToken, bookId)
      .then((nextAttempts) => { if (isMounted) setAttempts(nextAttempts); })
      .catch(() => undefined);
    return () => { isMounted = false; };
  }, [accessToken, bookId, passageSet, previewContext.isPreview]);

  useEffect(() => {
    if (previewContext.isPreview) questionStartedAtRef.current = Date.now();
  }, [previewContext.isPreview]);

  const questions = useMemo(() => passageSet?.questions ?? [], [passageSet]);
  const activeQuestion = questions[questionIndex];
  const questionIds = questions.map((question) => question.id);
  const backHref = appendStudentPreview("/study-hall/shsat/materials?subject=english");
  const collectionLabel = isShsatLibraryPassage ? "SHSAT Library" : "Advanced Practice";
  const firstAttempt = attempts.reduce<StudentLibraryAttempt | null>((first, attempt) => (
    !first || attempt.attemptNumber < first.attemptNumber ? attempt : first
  ), null);
  const canOpenCorrections = Boolean(firstAttempt && firstAttempt.score < firstAttempt.totalQuestions);

  function recordCurrentQuestionTime() {
    const question = questions[questionIndex];
    if (!question) return;
    const elapsedSeconds = questionStartedAtRef.current
      ? Math.max(0, Math.round((Date.now() - questionStartedAtRef.current) / 1000))
      : 0;
    questionTimesRef.current[question.id] = (questionTimesRef.current[question.id] ?? 0) + elapsedSeconds;
    questionStartedAtRef.current = Date.now();
  }

  function moveToQuestion(index: number) {
    recordCurrentQuestionTime();
    setQuestionIndex(index);
    setIsComplete(false);
    setIsReviewOpen(false);
  }

  async function handleNext() {
    if (!activeQuestion || !selectedAnswers[activeQuestion.id]) {
      setIsUnansweredModalOpen(true);
      return;
    }

    if (questionIndex >= questions.length - 1) {
      recordCurrentQuestionTime();
      setSubmissionError("");
      if (previewContext.isPreview) {
        setIsComplete(true);
        setIsReviewOpen(false);
        return;
      }
      if (!accessToken || isSubmitting) return;
      setIsSubmitting(true);
      try {
        const completedAt = Date.now();
        const nextAttempt = await saveStudentLibraryAttempt(accessToken, bookId, {
          code: accessCode,
          questions: questions.map((question) => ({
            correctAnswerId: question.correctChoiceId ?? "",
            questionId: question.id,
            selectedAnswerId: selectedAnswers[question.id] ?? "",
            timeSpentSeconds: questionTimesRef.current[question.id] ?? 0,
          })),
          startedAt: attemptStartedAtRef.current,
          totalTimeSeconds: Math.max(1, Math.round((completedAt - Date.parse(attemptStartedAtRef.current)) / 1000)),
        });
        setResultAttempt(nextAttempt);
        setAttempts((current) => [nextAttempt, ...current]);
        setIsComplete(true);
        setIsReviewOpen(false);
      } catch (error) {
        setSubmissionError(error instanceof Error ? error.message : "Your attempt could not be saved. Try again.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const nextIndex = questionIndex + 1;
    moveToQuestion(nextIndex);
    setMaxVisitedIndex((current) => Math.max(current, nextIndex));
    setActiveTool("pointer");
  }

  function handlePrevious() {
    if (isComplete) {
      moveToQuestion(questions.length - 1);
      return;
    }

    moveToQuestion(Math.max(0, questionIndex - 1));
  }

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !accessCode.trim()) return;
    setIsUnlocking(true);
    setUnlockError("");
    try {
      await unlockLibraryBook(accessToken, bookId, accessCode);
      attemptStartedAtRef.current = new Date().toISOString();
      questionStartedAtRef.current = Date.now();
      setIsUnlocked(true);
    } catch (error) {
      setUnlockError(error instanceof Error ? error.message : "That code could not be verified.");
    } finally {
      setIsUnlocking(false);
    }
  }

  async function openCorrections() {
    if (!accessToken || previewContext.isPreview) return;
    setIsCorrectionsOpen(true);
    setIsLoadingCorrections(true);
    setCorrectionError("");
    try {
      const nextView = await getStudentLibraryCorrections(accessToken, bookId);
      const savedByQuestion = new Map(nextView.correction?.responses.map((response) => [response.questionId, response]) ?? []);
      setCorrectionView(nextView);
      setCorrectionDraft(Object.fromEntries(nextView.attempt.questions
        .filter((question) => !question.isCorrect)
        .map((question) => {
          const saved = savedByQuestion.get(question.questionId);
          return [question.questionId, {
            whyChosenIncorrect: saved?.whyChosenIncorrect ?? "",
            whyCorrectAnswerCorrect: saved?.whyCorrectAnswerCorrect ?? "",
          }];
        })));
    } catch (error) {
      setCorrectionView(null);
      setCorrectionError(error instanceof Error ? error.message : "Your corrections could not be opened.");
    } finally {
      setIsLoadingCorrections(false);
    }
  }

  function updateCorrectionDraft(questionId: string, field: keyof CorrectionDraft[string], value: string) {
    setCorrectionDraft((current) => ({
      ...current,
      [questionId]: {
        whyChosenIncorrect: current[questionId]?.whyChosenIncorrect ?? "",
        whyCorrectAnswerCorrect: current[questionId]?.whyCorrectAnswerCorrect ?? "",
        [field]: value,
      },
    }));
  }

  async function handleSubmitCorrections(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !correctionView || correctionView.correction || isSubmittingCorrections) return;
    setIsSubmittingCorrections(true);
    setCorrectionError("");
    try {
      const responses = correctionView.attempt.questions.filter((question) => !question.isCorrect).map((question) => ({
        questionId: question.questionId,
        whyChosenIncorrect: correctionDraft[question.questionId]?.whyChosenIncorrect ?? "",
        whyCorrectAnswerCorrect: correctionDraft[question.questionId]?.whyCorrectAnswerCorrect ?? "",
      }));
      const correction = await submitStudentLibraryCorrections(accessToken, bookId, responses);
      setCorrectionView((current) => current ? { ...current, correction } : current);
    } catch (error) {
      setCorrectionError(error instanceof Error ? error.message : "Your corrections could not be submitted. Try again.");
    } finally {
      setIsSubmittingCorrections(false);
    }
  }

  function startAnotherAttempt() {
    setActiveTool("pointer");
    setBookmarkedQuestionIds([]);
    setEliminatedChoices({});
    setIsComplete(false);
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setMaxVisitedIndex(0);
    setNote("");
    setQuestionIndex(0);
    setResultAttempt(null);
    setSelectedAnswers({});
    setSubmissionError("");
    questionTimesRef.current = {};
    attemptStartedAtRef.current = new Date().toISOString();
    questionStartedAtRef.current = Date.now();
  }

  function handleTool(tool: AdvancedTool) {
    if (tool === "notepad") {
      const nextOpen = !isNotepadOpen;
      setIsNotepadOpen(nextOpen);
      setActiveTool(nextOpen ? "notepad" : "pointer");
      return;
    }
    setActiveTool(tool);
  }

  function handleChoice(questionId: string, choiceId: string) {
    if (activeTool === "eliminator") {
      setEliminatedChoices((current) => {
        const choices = current[questionId] ?? [];
        return {
          ...current,
          [questionId]: choices.includes(choiceId)
            ? choices.filter((id) => id !== choiceId)
            : [...choices, choiceId],
        };
      });
      return;
    }

    setSelectedAnswers((current) => ({ ...current, [questionId]: choiceId }));
    setEliminatedChoices((current) => ({
      ...current,
      [questionId]: (current[questionId] ?? []).filter((id) => id !== choiceId),
    }));
  }

  if (isCheckingSession) {
    return <main className="loading-shell">Loading passage...</main>;
  }

  if (!passageEntry || !passageSet || !activeQuestion) {
    return (
      <main className="advanced-passage-page">
        <section className="advanced-passage-missing">
          <h1>Passage not found</h1>
          <a href={backHref}>Return to Study Hall</a>
        </section>
      </main>
    );
  }

  if (isCorrectionsOpen) {
    return (
      <StudentCorrectionsPage
        collectionLabel={collectionLabel}
        correctionDraft={correctionDraft}
        correctionError={correctionError}
        isLoading={isLoadingCorrections}
        isSubmitting={isSubmittingCorrections}
        onBack={() => setIsCorrectionsOpen(false)}
        onDraftChange={updateCorrectionDraft}
        onRetry={openCorrections}
        onSubmit={handleSubmitCorrections}
        passageSet={passageSet}
        studentName={studentName}
        view={correctionView}
      />
    );
  }

  if (!isUnlocked) {
    return (
      <main className="library-access-page">
        <a className="library-access-back" href={backHref}><ArrowLeft size={16} /> English library</a>
        <section className="library-access-layout">
          <div className="library-access-card">
            <span className="library-access-icon"><KeyRound size={26} /></span>
            <p>{collectionLabel}</p>
            <h1>{passageSet.passage.title}</h1>
            <span>This book is protected by a unique class code. Ask your teacher for the code created in their library dashboard.</span>
            <form onSubmit={handleUnlock}>
              <label htmlFor="library-book-code">Book access code</label>
              <input
                autoCapitalize="characters"
                autoComplete="off"
                autoFocus
                id="library-book-code"
                maxLength={12}
                onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                spellCheck={false}
                value={accessCode}
              />
              {unlockError ? <p role="alert">{unlockError}</p> : null}
              <button disabled={isUnlocking || accessCode.replace(/[^a-zA-Z0-9]/g, "").length < 6} type="submit">
                {isUnlocking ? "Checking code…" : "Unlock book"}
              </button>
            </form>
          </div>
          <aside className="library-access-history">
            <header><BarChart3 size={18} /><div><small>Your history</small><h2>{attempts.length ? `${attempts.length} completed ${attempts.length === 1 ? "attempt" : "attempts"}` : "No attempts yet"}</h2></div></header>
            {attempts.length ? attempts.map((attempt) => (
              <details key={attempt.id}>
                <summary><span>Attempt {attempt.attemptNumber}<small>{formatAttemptDate(attempt.completedAt)}</small></span><strong>{attempt.score} / {attempt.totalQuestions}</strong><em>{formatDuration(attempt.totalTimeSeconds)}</em></summary>
                <StudentAttemptSummary attempt={attempt} />
              </details>
            )) : <p>Finish this book once and your score and timing history will appear here.</p>}
            {canOpenCorrections ? <button className="library-open-corrections" onClick={openCorrections} type="button"><MessageSquare size={16} /> Corrections</button> : null}
          </aside>
        </section>
      </main>
    );
  }

  const currentQuestionId = activeQuestion.id;
  const currentEliminatedChoices = eliminatedChoices[currentQuestionId] ?? [];
  const toolbar = (
    <AdvancedExamToolbar
      activeTool={activeTool}
      bookmarkedQuestionIds={bookmarkedQuestionIds}
      collectionLabel={collectionLabel}
      currentQuestionIndex={questionIndex}
      isComplete={isComplete}
      isNotepadOpen={isNotepadOpen}
      isReviewOpen={isReviewOpen}
      maxVisitedIndex={maxVisitedIndex}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onReviewFilterChange={setReviewFilter}
      onReviewQuestionSelect={moveToQuestion}
      onSelectTool={handleTool}
      onToggleBookmark={() => setBookmarkedQuestionIds((current) =>
        current.includes(currentQuestionId)
          ? current.filter((questionId) => questionId !== currentQuestionId)
          : [...current, currentQuestionId])}
      onToggleReview={() => setIsReviewOpen((current) => !current)}
      passageTitle={passageSet.passage.title}
      questionIds={questionIds}
      reviewFilter={reviewFilter}
      selectedAnswers={selectedAnswers}
      studentName={studentName}
    />
  );

  if (isComplete) {
    if (!previewContext.isPreview && resultAttempt) {
      return (
        <main className="library-finish-page">
          <header className="library-finish-header">
            <a href={backHref}><ArrowLeft size={16} /> English library</a>
            <span>{studentName}</span>
          </header>
          <section className="library-finish-hero">
            <span><Trophy size={26} /></span>
            <p>{passageSet.passage.title}</p>
            <h1>Attempt {resultAttempt.attemptNumber} complete</h1>
            <small>Your score and time have been saved.</small>
          </section>
          <div className="library-finish-layout">
            <div>
              <StudentAttemptSummary attempt={resultAttempt} featured />
              <div className="library-finish-actions">
                <button onClick={startAnotherAttempt} type="button"><RotateCcw size={16} /> Attempt again</button>
                {canOpenCorrections ? <button className="is-corrections" onClick={openCorrections} type="button"><MessageSquare size={16} /> Corrections</button> : null}
                <a href={backHref}>Return to library</a>
              </div>
            </div>
            <aside className="library-attempt-history-panel">
              <header><BarChart3 size={18} /><div><small>Progress over time</small><h2>All attempts</h2></div></header>
              {attempts.map((attempt) => (
                <details key={attempt.id} open={attempt.id === resultAttempt.id}>
                  <summary><span>Attempt {attempt.attemptNumber}<small>{formatAttemptDate(attempt.completedAt)}</small></span><strong>{attempt.score} / {attempt.totalQuestions}</strong><em>{formatDuration(attempt.totalTimeSeconds)}</em></summary>
                  {attempt.id === resultAttempt.id ? null : <StudentAttemptSummary attempt={attempt} />}
                </details>
              ))}
            </aside>
          </div>
        </main>
      );
    }
    return (
      <main className="exam-session-shell">
        {toolbar}
        <section className="exam-passage-end-document" aria-labelledby="advanced-passage-end-title">
          <article className="exam-passage-end-page">
            <div className="exam-passage-end-content advanced-passage-end-content">
              <p id="advanced-passage-end-title"><strong>There are no more questions for this passage set.</strong></p>
              <p>Use the review button to return to any question you have completed.</p>
              <a href={backHref}>Return to Study Hall</a>
            </div>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="exam-session-shell">
      {toolbar}
      <section className="exam-question-document" aria-labelledby={`advanced-question-${currentQuestionId}`}>
        <div className="exam-question-passage">
          <div className="exam-question-passage-scroll is-prose" aria-label={passageSet.passage.title}>
            {passageSet.passage.lines.filter((line) => line.kind !== "image").map((line, index) => {
              if (!line.text) {
                return <p aria-hidden="true" className="exam-prose-line is-spacer" key={`spacer-${index}`} />;
              }

              const isFullWidth = Boolean(line.kind) || line.align === "center";
              const className = [
                "exam-prose-line",
                line.kind ? `is-${line.kind}` : "",
                line.align === "center" && !line.kind ? "is-title" : "",
              ].filter(Boolean).join(" ");

              return (
                <p className={className} key={`${line.lineNumber}-${index}`}>
                  {isFullWidth ? <span>{line.text}</span> : <><span>{line.lineNumber}</span><span>{line.text}</span></>}
                </p>
              );
            })}
            {passageSet.passage.sourceNote ? <p className="exam-passage-source-note">{passageSet.passage.sourceNote}</p> : null}
            {passageSet.passage.lines
              .filter((line) => line.kind === "image" && line.image)
              .map((line, index) =>
                line.image ? (
                  <figure className="exam-passage-image" key={`${line.image.src}-footer-${index}`}>
                    <img alt={line.image.alt} src={line.image.src} />
                    {line.image.caption ? <figcaption>{line.image.caption}</figcaption> : null}
                  </figure>
                ) : null,
              )}
          </div>
        </div>

        <form className="exam-question-panel" onSubmit={(event) => event.preventDefault()}>
          <h1 id={`advanced-question-${currentQuestionId}`}>{renderFormattedText(activeQuestion.prompt)}</h1>
          <div className="exam-choice-list">
            {activeQuestion.choices?.map((choice) => (
              <label
                className={`exam-choice ${currentEliminatedChoices.includes(choice.id) ? "is-eliminated" : ""}`}
                key={choice.id}
                onClick={(event) => {
                  if (activeTool === "eliminator") {
                    event.preventDefault();
                  }
                  handleChoice(currentQuestionId, choice.id);
                }}
              >
                <input checked={selectedAnswers[currentQuestionId] === choice.id} name={currentQuestionId} onChange={() => undefined} type="radio" />
                <span>{choice.id}.</span>
                <span>{renderFormattedText(choice.text)}</span>
                {currentEliminatedChoices.includes(choice.id) ? (
                  <svg aria-hidden="true" className="exam-choice-eliminator-x" focusable="false" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <line vectorEffect="non-scaling-stroke" x1="0" x2="100" y1="0" y2="100" />
                    <line vectorEffect="non-scaling-stroke" x1="0" x2="100" y1="100" y2="0" />
                  </svg>
                ) : null}
              </label>
            ))}
          </div>
        </form>
      </section>

      {isNotepadOpen ? (
        <section className="exam-notepad-window" aria-label="Notepad">
          <header><h2>Notepad</h2><button aria-label="Close notepad" onClick={() => handleTool("notepad")} type="button">x</button></header>
          <textarea autoFocus onChange={(event) => setNote(event.target.value)} value={note} />
        </section>
      ) : null}

      {isUnansweredModalOpen ? (
        <div className="exam-attention-layer">
          <section aria-modal="true" className="exam-attention-modal" role="alertdialog">
            <header><h2>Attention</h2><button className="exam-attention-close" onClick={() => setIsUnansweredModalOpen(false)} type="button">x</button></header>
            <p>You must answer all parts of the question before you can continue.</p>
            <div className="exam-attention-actions"><button onClick={() => setIsUnansweredModalOpen(false)} type="button">OK</button></div>
          </section>
        </div>
      ) : null}
      {submissionError ? <div className="library-submission-error" role="alert"><span>{submissionError}</span><button onClick={() => setSubmissionError("")} type="button">Dismiss</button></div> : null}
      {isSubmitting ? <div className="library-saving-attempt" role="status">Saving your score and time…</div> : null}
    </main>
  );
}
