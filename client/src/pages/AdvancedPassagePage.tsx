import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bookmark,
  ChevronDown,
  Clock3,
  List,
  MessageSquare,
  Monitor,
  MousePointer2,
  Pencil,
  User,
  X,
} from "lucide-react";
import { getAdvancedPracticePassage } from "../content/advancedPractice";
import { getDisplayName } from "../lib/exam";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { appendStudentPreview } from "../lib/studentPreview";

type AdvancedTool = "pointer" | "eliminator" | "notepad" | "pencil";
type ReviewFilter = "all" | "notAnswered" | "bookmarks";

function getPassageIdFromPath() {
  return window.location.pathname.split("/").filter(Boolean)[1] ?? "";
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

function AdvancedExamToolbar({
  activeTool,
  bookmarkedQuestionIds,
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
      <header className="exam-session-toolbar" aria-label="Advanced practice controls">
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
      <nav className="exam-session-breadcrumb" aria-label="Advanced practice location">
        <div className="exam-session-breadcrumb-inner">
          <div className="exam-session-breadcrumb-text">
            <span>ADVANCED PRACTICE</span><span>/</span><span>{passageTitle.toUpperCase()}</span><span>/</span>
            <span>{isComplete ? "PASSAGE END DIRECTIONS" : `${currentQuestionIndex + 1} OF ${questionIds.length}`}</span>
          </div>
          <span className="exam-session-status-icon" aria-hidden="true"><Monitor size={19} /></span>
        </div>
      </nav>
    </>
  );
}

export function AdvancedPassagePage() {
  const passageEntry = getAdvancedPracticePassage(getPassageIdFromPath());
  const passageSet = passageEntry?.passageSet;
  const [activeTool, setActiveTool] = useState<AdvancedTool>("pointer");
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([]);
  const [eliminatedChoices, setEliminatedChoices] = useState<Record<string, string[]>>({});
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isComplete, setIsComplete] = useState(false);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isUnansweredModalOpen, setIsUnansweredModalOpen] = useState(false);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0);
  const [note, setNote] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getSupabaseClient().auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      setStudentName(getDisplayName(data.session.user));
      setIsCheckingSession(false);
    });
  }, []);

  const questions = useMemo(() => passageSet?.questions ?? [], [passageSet]);
  const activeQuestion = questions[questionIndex];
  const questionIds = questions.map((question) => question.id);
  const backHref = appendStudentPreview("/study-hall?section=advanced");

  function handleNext() {
    if (!activeQuestion || !selectedAnswers[activeQuestion.id]) {
      setIsUnansweredModalOpen(true);
      return;
    }

    if (questionIndex >= questions.length - 1) {
      setIsComplete(true);
      setIsReviewOpen(false);
      return;
    }

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setMaxVisitedIndex((current) => Math.max(current, nextIndex));
    setActiveTool("pointer");
    setIsReviewOpen(false);
  }

  function handlePrevious() {
    if (isComplete) {
      setIsComplete(false);
      setQuestionIndex(questions.length - 1);
      return;
    }

    setQuestionIndex((current) => Math.max(0, current - 1));
    setIsReviewOpen(false);
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
    return <main className="loading-shell">Loading advanced practice...</main>;
  }

  if (!passageEntry || !passageSet || !activeQuestion) {
    return (
      <main className="advanced-passage-page">
        <section className="advanced-passage-missing">
          <h1>Passage not found</h1>
          <a href={backHref}>Return to Advanced Practice</a>
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
      currentQuestionIndex={questionIndex}
      isComplete={isComplete}
      isNotepadOpen={isNotepadOpen}
      isReviewOpen={isReviewOpen}
      maxVisitedIndex={maxVisitedIndex}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onReviewFilterChange={setReviewFilter}
      onReviewQuestionSelect={(index) => {
        setQuestionIndex(index);
        setIsComplete(false);
        setIsReviewOpen(false);
      }}
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
    return (
      <main className="exam-session-shell">
        {toolbar}
        <section className="exam-passage-end-document" aria-labelledby="advanced-passage-end-title">
          <article className="exam-passage-end-page">
            <div className="exam-passage-end-content advanced-passage-end-content">
              <p id="advanced-passage-end-title"><strong>There are no more questions for this passage set.</strong></p>
              <p>Use the review button to return to any question you have completed.</p>
              <a href={backHref}>Return to Advanced Practice</a>
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
    </main>
  );
}
