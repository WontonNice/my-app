import { useEffect, useState, type DragEvent, type MouseEvent, type ReactNode } from "react";
import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  List,
  MessageSquare,
  Monitor,
  MousePointer2,
  Pencil,
  User,
  X,
} from "lucide-react";
import { resolveExamContent, type ExamQuestion } from "../content/exams";
import { getStudentAssessment, type TeacherAssessment } from "../lib/api";
import { getUserRole } from "../lib/auth";
import { formatDuration, getAssessmentIdFromPath, getDisplayName } from "../lib/exam";
import {
  createExamResult,
  getAllExamQuestions,
  saveExamResult,
  type CategoryPlacements,
  type SelectedAnswer,
  type SelectedAnswers,
} from "../lib/examResults";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type StartingSubject = "english" | "math";
type SessionScreen =
  | "directions"
  | "passageIntro"
  | "readingDirections"
  | "passage"
  | "passageEnd"
  | "standaloneIntro"
  | "standaloneDirections"
  | "standaloneQuestion"
  | "endSection"
  | "mathIntro"
  | "mathDirections"
  | "mathQuestion"
  | "testOver";
type ReviewItemId = "directions" | "passageEnd" | "endSection" | `question-${number}`;
type ReviewFilter = "all" | "notAnswered" | "bookmarks";
type ReviewItemKind = "directions" | "question" | "passageEnd" | "endSection";
type ReviewItem = {
  id: ReviewItemId;
  isAnswered?: boolean;
  isBookmarked?: boolean;
  kind: ReviewItemKind;
  label: string;
};
type ExamTool = "pointer" | "eliminator" | "notepad" | "pencil";
type EliminatedChoices = Record<string, string[]>;
type PassageNotes = Record<string, string>;
type TextHighlightColor = "blue" | "pink";
type TextHighlightRange = {
  color: TextHighlightColor;
  end: number;
  start: number;
};
type TextHighlights = Record<string, TextHighlightRange[]>;
type PendingTextSelection = {
  end: number;
  key: string;
  start: number;
};
type HighlightToolbarState = {
  ranges: PendingTextSelection[];
  x: number;
  y: number;
};
type ChoiceLimitWarning = {
  id: string;
  maxChoices: number;
};
type BoldTextRange = {
  end: number;
  start: number;
};

function isTextEntryQuestion(question: ExamQuestion) {
  return question.type === "numeric_entry" || question.type === "short_response" || question.type === "grid_in";
}

function isInlineDropdownQuestion(question: ExamQuestion) {
  return question.type === "inline_dropdown";
}

function getBoldFormattedText(text: string) {
  const boldRanges: BoldTextRange[] = [];
  const italicRanges: BoldTextRange[] = [];
  const mathRanges: BoldTextRange[] = [];
  let displayText = "";
  let cursor = 0;

  while (cursor < text.length) {
    if (text.startsWith("\\(", cursor)) {
      const closingIndex = text.indexOf("\\)", cursor + 2);

      if (closingIndex !== -1) {
        const content = text.slice(cursor + 2, closingIndex);
        const mathStart = displayText.length;
        displayText += content;
        mathRanges.push({
          end: displayText.length,
          start: mathStart,
        });
        cursor = closingIndex + 2;
        continue;
      }
    }

    if (text.startsWith("**", cursor)) {
      const closingIndex = text.indexOf("**", cursor + 2);

      if (closingIndex !== -1) {
        const content = text.slice(cursor + 2, closingIndex);
        const boldStart = displayText.length;
        displayText += content;
        boldRanges.push({
          end: displayText.length,
          start: boldStart,
        });
        cursor = closingIndex + 2;
        continue;
      }
    }

    if (text[cursor] === "*" && !text.startsWith("**", cursor)) {
      const closingIndex = text.indexOf("*", cursor + 1);

      if (closingIndex !== -1) {
        const content = text.slice(cursor + 1, closingIndex);
        const italicStart = displayText.length;
        displayText += content;
        italicRanges.push({
          end: displayText.length,
          start: italicStart,
        });
        cursor = closingIndex + 1;
        continue;
      }
    }

    displayText += text[cursor];
    cursor += 1;
  }

  return {
    boldRanges,
    displayText,
    italicRanges,
    mathRanges,
  };
}

function getRequiredSelectionCount(question: ExamQuestion) {
  return question.requiredSelections ?? question.correctChoiceIds?.length ?? 2;
}

function getSelectedChoiceIds(answer: SelectedAnswer | undefined) {
  if (Array.isArray(answer)) {
    return answer;
  }

  return typeof answer === "string" && answer ? [answer] : [];
}

function getTextEntryValue(answer: SelectedAnswer | undefined) {
  return typeof answer === "string" ? answer : "";
}

function parseLatexFraction(expression: string) {
  const fractionMatch = expression.match(/^\\frac\{(.+)\}\{(.+)\}$/);

  if (!fractionMatch) {
    return null;
  }

  return {
    denominator: fractionMatch[2],
    numerator: fractionMatch[1],
  };
}

function renderMathExpression(expression: string) {
  const fraction = parseLatexFraction(expression);

  if (!fraction) {
    return <span className="exam-math-expression">{renderMathInline(expression)}</span>;
  }

  return (
    <span className="exam-math-expression exam-math-fraction" aria-label={expression}>
      <span className="exam-math-fraction-row">{renderMathInline(fraction.numerator)}</span>
      <span className="exam-math-fraction-bar" />
      <span className="exam-math-fraction-row">{renderMathInline(fraction.denominator)}</span>
    </span>
  );
}

function renderMathInline(expression: string) {
  const compactExpression = expression.replace(/\s*\\cdot\s*/g, " \\cdot ").trim();

  return compactExpression
    .split(/(\\cdot|[+\-=()]|[a-zA-Z]+|\s+)/)
    .filter(Boolean)
    .map((part, index) => {
      if (/^\s+$/.test(part)) {
        return null;
      }

      if (/^[a-zA-Z]+$/.test(part)) {
        return (
          <span className="exam-math-variable" key={`${part}-${index}`}>
            {part}
          </span>
        );
      }

      if (part === "\\cdot") {
        return (
          <span className="exam-math-dot" key={`${part}-${index}`}>
            &middot;
          </span>
        );
      }

      if (part === "-") {
        return (
          <span className="exam-math-operator" key={`${part}-${index}`}>
            &minus;
          </span>
        );
      }

      if (part === "+" || part === "=") {
        return (
          <span className="exam-math-operator" key={`${part}-${index}`}>
            {part}
          </span>
        );
      }

      return part === "(" || part === ")" ? (
        <span className="exam-math-parenthesis" key={`${part}-${index}`}>
          {part}
        </span>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      );
    });
}

function renderInlineMathText(expression: string) {
  return expression.split(/([a-zA-Z]+|=|-|\+|\\cdot)/).map((part, index) => {
    if (!part) {
      return null;
    }

    if (/^[a-zA-Z]+$/.test(part)) {
      return (
        <span className="exam-inline-math-variable" key={`${part}-${index}`}>
          {part}
        </span>
      );
    }

    if (part === "-") {
      return (
        <span className="exam-inline-math-operator" key={`${part}-${index}`}>
          &minus;
        </span>
      );
    }

    if (part === "=" || part === "+" || part === "\\cdot") {
      return (
        <span className="exam-inline-math-operator" key={`${part}-${index}`}>
          {part === "\\cdot" ? <>&middot;</> : part}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function getPassageSetLabel(index: number, total: number) {
  return `ELA - Passage Set ${index + 1} of ${total}`;
}

function getCategoryPlacements(answer: SelectedAnswer | undefined): CategoryPlacements {
  if (!answer || typeof answer === "string" || Array.isArray(answer)) {
    return {};
  }

  return answer;
}

function isQuestionAnswered(question: ExamQuestion, selectedAnswers: SelectedAnswers) {
  if (question.type === "multiple_choice") {
    return typeof selectedAnswers[question.id] === "string" && Boolean(selectedAnswers[question.id]);
  }

  if (question.type === "multi_select") {
    return getSelectedChoiceIds(selectedAnswers[question.id]).length >= getRequiredSelectionCount(question);
  }

  if (question.type === "category_sort") {
    const placements = getCategoryPlacements(selectedAnswers[question.id]);
    const items = question.items ?? [];
    const requiredPlacements = question.requiredPlacements ?? items.length;
    return requiredPlacements > 0 && Object.keys(placements).length >= requiredPlacements;
  }

  if (question.type === "transition_drop") {
    return typeof selectedAnswers[question.id] === "string" && Boolean(selectedAnswers[question.id]);
  }

  if (isInlineDropdownQuestion(question)) {
    const dropdowns = question.dropdowns ?? [];
    const answers = getCategoryPlacements(selectedAnswers[question.id]);

    return dropdowns.length > 0 && dropdowns.every((dropdown) => Boolean(answers[dropdown.id]));
  }

  if (isTextEntryQuestion(question)) {
    const answer = selectedAnswers[question.id];

    return typeof answer === "string" && answer.trim().length > 0;
  }

  return true;
}

function getRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function createRandomQuestionAnswer(question: ExamQuestion): SelectedAnswer {
  if (question.type === "multiple_choice" || question.type === "transition_drop") {
    return getRandomItem(question.choices ?? [])?.id ?? "preview-answer";
  }

  if (question.type === "multi_select") {
    const choiceIds = (question.choices ?? []).map((choice) => choice.id);
    const selectionCount = Math.min(getRequiredSelectionCount(question), choiceIds.length);

    return [...choiceIds].sort(() => Math.random() - 0.5).slice(0, selectionCount);
  }

  if (question.type === "category_sort") {
    const categoryIds = (question.categories ?? []).map((category) => category.id);
    const items = [...(question.items ?? [])].sort(() => Math.random() - 0.5);
    const placementCount = Math.min(question.requiredPlacements ?? items.length, items.length);

    return Object.fromEntries(
      items
        .slice(0, placementCount)
        .map((item) => [item.id, getRandomItem(categoryIds) ?? "preview-category"]),
    );
  }

  if (question.type === "inline_dropdown") {
    return Object.fromEntries(
      (question.dropdowns ?? []).map((dropdown) => [
        dropdown.id,
        getRandomItem(dropdown.options)?.id ?? "preview-option",
      ]),
    );
  }

  if (question.type === "numeric_entry" || question.type === "grid_in") {
    return String(Math.floor(Math.random() * 100));
  }

  return "Teacher preview response";
}

function getStoredExamName(assessmentId: string, fallbackName: string) {
  const storedName = window.sessionStorage.getItem(`exam-student-name:${assessmentId}`);
  return storedName?.trim() || fallbackName;
}

function getStoredStartingSubject(assessmentId: string): StartingSubject {
  const storedSubject = window.sessionStorage.getItem(`exam-start-subject:${assessmentId}`);
  return storedSubject === "math" ? "math" : "english";
}

function getTeacherPreviewDashboardHref() {
  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get("preview") === "student" && searchParams.get("teacherTools") === "1") {
    return "/study-hall?preview=student&teacherTools=1";
  }

  return "/study-hall";
}

function ExamUserMenu({ studentName }: { studentName: string }) {
  return (
    <div className="exam-module-user">
      <span>{studentName}</span>
      <button type="button" aria-label="User menu">
        <User aria-hidden="true" size={14} fill="currentColor" strokeWidth={2.2} />
        <ChevronDown aria-hidden="true" size={12} strokeWidth={2.4} />
      </button>
    </div>
  );
}

function ExamModuleHeader({ studentName }: { studentName: string }) {
  return (
    <>
      <header className="exam-module-header">
        <a className="exam-module-brand" href="/study-hall">
          Nathan Tutors
        </a>
        <ExamUserMenu studentName={studentName} />
      </header>
      <div className="exam-module-bluebar" />
      <div className="exam-module-shadow" />
    </>
  );
}

function ExamToolbar({
  assessmentLabel,
  breadcrumbMiddle,
  breadcrumbCurrent,
  bookmarkCount = 0,
  currentReviewItemId,
  canUseFastForward = false,
  isBookmarkActive = false,
  isFastForwardEnabled = false,
  isNextActive = true,
  activeTool = "pointer",
  isPreviousActive = false,
  isReviewOpen = false,
  isNotepadOpen = false,
  onNext,
  onPrevious,
  onReviewFilterChange,
  onReviewItemSelect,
  onSelectTool,
  onSpeedFinish,
  onToggleFastForward,
  onToggleReview,
  onToggleBookmark,
  reviewFilter = "all",
  reviewItems = [],
  reviewQuestionCount = 0,
  showReviewTools = true,
  showStatusIcon = true,
  showTimer = true,
  showWorkTools = true,
  unansweredCount = 0,
  studentName,
}: {
  assessmentLabel: string;
  breadcrumbCurrent: string;
  breadcrumbMiddle: string;
  bookmarkCount?: number;
  canUseFastForward?: boolean;
  currentReviewItemId?: ReviewItemId;
  activeTool?: ExamTool;
  isBookmarkActive?: boolean;
  isFastForwardEnabled?: boolean;
  isNextActive?: boolean;
  isPreviousActive?: boolean;
  isReviewOpen?: boolean;
  isNotepadOpen?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onReviewFilterChange?: (filter: ReviewFilter) => void;
  onReviewItemSelect?: (itemId: ReviewItemId) => void;
  onSelectTool?: (tool: ExamTool) => void;
  onSpeedFinish?: () => void;
  onToggleFastForward?: () => void;
  onToggleReview?: () => void;
  onToggleBookmark?: () => void;
  reviewFilter?: ReviewFilter;
  reviewItems?: ReviewItem[];
  reviewQuestionCount?: number;
  showReviewTools?: boolean;
  showStatusIcon?: boolean;
  showTimer?: boolean;
  showWorkTools?: boolean;
  unansweredCount?: number;
  studentName: string;
}) {
  const hasReviewMenu = Boolean(showReviewTools && reviewItems.length && onReviewItemSelect && onToggleReview);
  const filteredReviewItems = reviewItems.filter((item) => {
    if (reviewFilter === "notAnswered") {
      return item.kind === "question" && !item.isAnswered;
    }

    if (reviewFilter === "bookmarks") {
      return item.kind === "question" && item.isBookmarked;
    }

    return true;
  });

  return (
    <>
      <header className="exam-session-toolbar" aria-label="Exam controls">
        <div className="exam-session-toolbar-inner">
          <div className="exam-session-toolbar-cluster">
            <div className="exam-session-toolbar-group exam-session-question-nav">
              <button
                data-tooltip="Previous"
                className={`exam-session-toolbar-button ${isPreviousActive ? "is-next" : "is-muted"}`}
                aria-disabled={isPreviousActive ? undefined : true}
                aria-label="Previous item"
                onClick={isPreviousActive ? onPrevious : undefined}
                type="button"
              >
                <span aria-hidden="true" className="exam-session-arrow-glyph is-left" />
              </button>
              <button
                data-tooltip="Next"
                className={`exam-session-toolbar-button ${isNextActive ? "is-next" : "is-muted"}`}
                aria-disabled={isNextActive ? undefined : true}
                aria-label="Next item"
                onClick={isNextActive ? onNext : undefined}
                type="button"
              >
                <span aria-hidden="true" className="exam-session-arrow-glyph is-right" />
              </button>
            </div>

            {showReviewTools ? (
              <div className="exam-session-toolbar-group exam-session-review-tools">
                <button
                  data-tooltip="Review"
                  className={`exam-session-toolbar-button is-review ${isReviewOpen ? "is-active-review" : ""}`}
                  onClick={onToggleReview}
                  type="button"
                >
                  <span>Review</span>
                  <List aria-hidden="true" size={16} strokeWidth={2.4} />
                </button>
                <button
                  aria-disabled={onToggleBookmark ? undefined : true}
                  aria-pressed={isBookmarkActive}
                  className={`exam-session-toolbar-button is-bookmark ${
                    isBookmarkActive ? "is-bookmarked" : ""
                  }`}
                  onClick={onToggleBookmark}
                  type="button"
                >
                  <Bookmark
                    aria-hidden="true"
                    fill={isBookmarkActive ? "currentColor" : "none"}
                    size={17}
                    strokeWidth={2.2}
                  />
                  <span>Bookmark</span>
                  <span className="exam-bookmark-tooltip">Bookmark Question for Review</span>
                </button>

                {hasReviewMenu && isReviewOpen ? (
                  <section className="exam-review-menu" aria-label="Review questions">
                    <div className="exam-review-tabs">
                      <button
                        className={`exam-review-tab ${reviewFilter === "all" ? "is-active" : ""}`}
                        onClick={() => onReviewFilterChange?.("all")}
                        type="button"
                      >
                        <span className="exam-review-tab-icon exam-review-tab-icon-square">
                          {reviewQuestionCount}
                        </span>
                        <span>All Questions</span>
                      </button>
                      <button
                        className={`exam-review-tab ${reviewFilter === "notAnswered" ? "is-active" : ""}`}
                        onClick={() => onReviewFilterChange?.("notAnswered")}
                        type="button"
                      >
                        <span className="exam-review-tab-icon exam-review-tab-icon-circle">
                          {unansweredCount}
                        </span>
                        <span>Not Answered</span>
                      </button>
                      <button
                        className={`exam-review-tab ${reviewFilter === "bookmarks" ? "is-active" : ""}`}
                        onClick={() => onReviewFilterChange?.("bookmarks")}
                        type="button"
                      >
                        <span className="exam-review-tab-icon exam-review-tab-icon-bookmark">
                          {bookmarkCount}
                        </span>
                        <span>Bookmarks</span>
                      </button>
                    </div>

                    <div className="exam-review-list">
                      {filteredReviewItems.length > 0 ? (
                        filteredReviewItems.map((item) => (
                          <button
                            className={`exam-review-row ${
                              currentReviewItemId === item.id ? "is-current" : ""
                            } ${item.kind === "question" && !item.isAnswered ? "is-unanswered" : ""}`}
                            key={item.id}
                            onClick={() => onReviewItemSelect?.(item.id)}
                            type="button"
                          >
                            {item.kind === "question" && !item.isAnswered ? (
                              <span className="exam-review-row-dot" aria-hidden="true" />
                            ) : null}
                            <span>{item.label}</span>
                            {item.kind === "question" && item.isBookmarked ? (
                              <Bookmark
                                aria-label="Bookmarked"
                                className="exam-review-row-bookmark"
                                fill="currentColor"
                                size={15}
                                strokeWidth={2.2}
                              />
                            ) : null}
                          </button>
                        ))
                      ) : (
                        <p className="exam-review-empty">No questions to show.</p>
                      )}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : null}

            {showWorkTools ? (
              <div className="exam-session-toolbar-group exam-session-work-tools">
                <button
                  aria-label="Pointer tool"
                  className={`exam-session-tool-button ${activeTool === "pointer" ? "is-active" : ""}`}
                  data-tooltip="Pointer"
                  onClick={() => onSelectTool?.("pointer")}
                  type="button"
                >
                  <MousePointer2 aria-hidden="true" size={18} fill="currentColor" strokeWidth={1.6} />
                </button>
                <button
                  aria-label="Eliminate answer tool"
                  className={`exam-session-tool-button ${activeTool === "eliminator" ? "is-active" : ""}`}
                  data-tooltip="Answer Eliminator"
                  onClick={() => onSelectTool?.("eliminator")}
                  type="button"
                >
                  <X aria-hidden="true" size={18} strokeWidth={1.8} />
                </button>
                <button
                  aria-label="Notepad tool"
                  className={`exam-session-tool-button ${
                    activeTool === "notepad" || isNotepadOpen ? "is-active" : ""
                  }`}
                  data-tooltip="Notepad"
                  onClick={() => onSelectTool?.("notepad")}
                  type="button"
                >
                  <MessageSquare aria-hidden="true" size={17} strokeWidth={1.9} />
                </button>
                <button
                  aria-label="Pencil tool"
                  className={`exam-session-tool-button ${activeTool === "pencil" ? "is-active" : ""}`}
                  data-tooltip="Pencil"
                  onClick={() => onSelectTool?.("pencil")}
                  type="button"
                >
                  <Pencil aria-hidden="true" size={17} strokeWidth={2} />
                </button>
              </div>
            ) : null}
          </div>

          <div className="exam-session-user-tools">
            {canUseFastForward ? (
              <div className="exam-teacher-preview-tools">
                <label className="exam-fast-forward-toggle">
                  <input
                    checked={isFastForwardEnabled}
                    onChange={() => onToggleFastForward?.()}
                    type="checkbox"
                  />
                  Fast-forward
                </label>
                <button className="exam-speed-finish-button" onClick={onSpeedFinish} type="button">
                  Speed finish
                </button>
              </div>
            ) : null}
            {showTimer ? (
              <button type="button" className="exam-session-timer-button" aria-label="Show timer">
                <Clock3 aria-hidden="true" size={16} strokeWidth={2.2} />
              </button>
            ) : null}
            <span className="exam-session-user-name">{studentName}</span>
            <button type="button" className="exam-session-user-button" aria-label="User menu">
              <User aria-hidden="true" size={14} fill="currentColor" strokeWidth={2.2} />
              <ChevronDown aria-hidden="true" size={12} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </header>

      <div className="exam-session-bluebar" />

      <nav className="exam-session-breadcrumb" aria-label="Exam location">
        <div className="exam-session-breadcrumb-inner">
          <div className="exam-session-breadcrumb-text">
            <span>{assessmentLabel}</span>
            <span>/</span>
            <span>{breadcrumbMiddle}</span>
            {breadcrumbCurrent ? (
              <>
                <span>/</span>
                <span>{breadcrumbCurrent}</span>
              </>
            ) : null}
          </div>
          {showStatusIcon ? (
            <span className="exam-session-status-icon" aria-hidden="true">
              <Monitor size={19} strokeWidth={2.2} />
            </span>
          ) : null}
        </div>
      </nav>
    </>
  );
}

export function ExamSessionPage() {
  const [assessment, setAssessment] = useState<TeacherAssessment | null>(null);
  const [activeTool, setActiveTool] = useState<ExamTool>("pointer");
  const [activeMathQuestionIndex, setActiveMathQuestionIndex] = useState(0);
  const [activePassageSetIndex, setActivePassageSetIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeStandaloneQuestionIndex, setActiveStandaloneQuestionIndex] = useState(0);
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([]);
  const [choiceLimitWarnings, setChoiceLimitWarnings] = useState<ChoiceLimitWarning[]>([]);
  const [eliminatedChoices, setEliminatedChoices] = useState<EliminatedChoices>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [highlightToolbar, setHighlightToolbar] = useState<HighlightToolbarState | null>(null);
  const [hasCompletedMath, setHasCompletedMath] = useState(false);
  const [isFastForwardEnabled, setIsFastForwardEnabled] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isUnansweredModalOpen, setIsUnansweredModalOpen] = useState(false);
  const [isTeacherPreviewSession, setIsTeacherPreviewSession] = useState(false);
  const [passageNotes, setPassageNotes] = useState<PassageNotes>({});
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [selectedCategoryItemId, setSelectedCategoryItemId] = useState("");
  const [sessionScreen, setSessionScreen] = useState<SessionScreen>("directions");
  const [startingSubject, setStartingSubject] = useState<StartingSubject>("english");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("Student");
  const [textHighlights, setTextHighlights] = useState<TextHighlights>({});

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    async function loadExamSession() {
      const assessmentId = getAssessmentIdFromPath(window.location.pathname);
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const fallbackName = getDisplayName(data.session.user);
      const nextStartingSubject = getStoredStartingSubject(assessmentId);
      setStudentId(data.session.user.id);
      setStudentName(getStoredExamName(assessmentId, fallbackName));
      setStartingSubject(nextStartingSubject);
      setSessionScreen(nextStartingSubject === "math" ? "mathIntro" : "directions");
      setIsTeacherPreviewSession(
        new URLSearchParams(window.location.search).get("preview") === "student" &&
          new URLSearchParams(window.location.search).get("teacherTools") === "1" &&
          getUserRole(data.session.user) === "teacher",
      );

      try {
        const nextAssessment = await getStudentAssessment(data.session.access_token, assessmentId);
        setAssessment(nextAssessment);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Could not load this exam.");
      } finally {
        setIsCheckingSession(false);
      }
    }

    loadExamSession();
  }, []);

  if (isCheckingSession) {
    return <main className="loading-shell">Loading exam session...</main>;
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="loading-shell">
        Supabase auth is not configured. Add your Vite Supabase env vars, then log in.
      </main>
    );
  }

  if (!assessment) {
    return (
      <main className="exam-session-shell">
        <section className="exam-session-error">
          <h1>Exam unavailable</h1>
          <p>{errorMessage || "This exam could not be loaded."}</p>
          <a href="/study-hall">Return to Study Hall</a>
        </section>
      </main>
    );
  }

  const examContent = resolveExamContent(assessment);
  const mathSection = examContent.mathSection ?? {
    directions: {
      body:
        "Solve each problem. Select the answer from the choices given or enter your answer in the space provided.",
      breadcrumbLabel: "MATH DIRECTIONS",
      notes: [
        "Formulas and definitions of mathematical terms and symbols are not provided.",
        "Diagrams other than graphs are not necessarily drawn to scale.",
        "Assume that a diagram is in one plane unless the question specifically states that it is not.",
        "Graphs are drawn to scale unless stated otherwise.",
      ],
      subject: "MATHEMATICS",
      title: "IMPORTANT NOTES",
    },
    id: "math",
    label: "Math",
    questionCount: 0,
    questions: [],
  };
  const mathQuestions = mathSection.questions;
  const activeMathQuestion = mathQuestions[activeMathQuestionIndex] ?? mathQuestions[0];
  const activeMathQuestionChoices = activeMathQuestion?.choices ?? [];
  const activeMathQuestionEliminatedChoiceIds = activeMathQuestion
    ? (eliminatedChoices[activeMathQuestion.id] ?? [])
    : [];
  const activeMathQuestionSelectedChoiceIds = getSelectedChoiceIds(
    activeMathQuestion ? selectedAnswers[activeMathQuestion.id] : undefined,
  );
  const standaloneSection = examContent.standaloneSection;
  const activePassageSet = examContent.passageSets[activePassageSetIndex] ?? examContent.passageSets[0];
  const activeQuestion = activePassageSet.questions[activeQuestionIndex] ?? activePassageSet.questions[0];
  const activeStandaloneQuestion =
    standaloneSection?.questions[activeStandaloneQuestionIndex] ?? standaloneSection?.questions[0];
  const activeStandaloneQuestionChoices = activeStandaloneQuestion?.choices ?? [];
  const activeStandaloneQuestionCategoryPlacements = getCategoryPlacements(
    activeStandaloneQuestion ? selectedAnswers[activeStandaloneQuestion.id] : undefined,
  );
  const activeStandaloneQuestionEliminatedChoiceIds = activeStandaloneQuestion
    ? (eliminatedChoices[activeStandaloneQuestion.id] ?? [])
    : [];
  const activeStandaloneQuestionSelectedChoiceIds = getSelectedChoiceIds(
    activeStandaloneQuestion ? selectedAnswers[activeStandaloneQuestion.id] : undefined,
  );
  const activeQuestionChoices = activeQuestion.choices ?? [];
  const hasLongAnswerContent =
    activeQuestion.prompt.length > 190 ||
    (activeQuestion.instructions?.length ?? 0) > 160 ||
    activeQuestionChoices.some((choice) => choice.text.length > 130) ||
    (activeQuestion.items ?? []).some((item) => item.text.length > 90);
  const isExpandedQuestionLayout = activeQuestion.type === "category_sort" || hasLongAnswerContent;
  const activeQuestionSelectedChoiceIds = getSelectedChoiceIds(selectedAnswers[activeQuestion.id]);
  const activeQuestionCategoryPlacements = getCategoryPlacements(selectedAnswers[activeQuestion.id]);
  const activeQuestionEliminatedChoiceIds = eliminatedChoices[activeQuestion.id] ?? [];
  const activeTransitionChoiceId =
    typeof selectedAnswers[activeQuestion.id] === "string" ? selectedAnswers[activeQuestion.id] : "";
  const activeTransitionChoice = activeQuestionChoices.find(
    (choice) => choice.id === activeTransitionChoiceId,
  );
  const activeQuestionTitleId = `question-title-${activeQuestion.id}`;
  const activeQuestionNumber = Math.min(activeQuestionIndex + 1, activePassageSet.questionCount);
  const assessmentLabel = examContent.title.toUpperCase();
  const passageSetDisplayLabel = getPassageSetLabel(
    activePassageSetIndex,
    examContent.passageSets.length,
  );
  const passageSetLabel = passageSetDisplayLabel.toUpperCase();
  const isProsePassage = activePassageSet.passage.format === "prose";
  const isSentenceProsePassage = activePassageSet.passage.format === "sentence_prose";
  const hasNextPassageSet = activePassageSetIndex < examContent.passageSets.length - 1;
  const accessibleQuestionCount =
    isFastForwardEnabled && (sessionScreen === "passage" || sessionScreen === "passageEnd")
      ? activePassageSet.questions.length
      : sessionScreen === "passage"
      ? activeQuestionIndex + 1
      : sessionScreen === "passageEnd"
        ? activePassageSet.questions.length
        : 0;
  const accessibleQuestions = activePassageSet.questions.slice(0, accessibleQuestionCount);
  const unansweredCount = accessibleQuestions.filter(
    (question) => !isQuestionAnswered(question, selectedAnswers),
  ).length;
  const bookmarkCount = accessibleQuestions.filter((question) =>
    bookmarkedQuestionIds.includes(question.id),
  ).length;
  const isActiveQuestionBookmarked =
    sessionScreen === "passage" && bookmarkedQuestionIds.includes(activeQuestion.id);
  const directionsBreadcrumbLabel =
    activePassageSet.directions.breadcrumbLabel ??
    `${activePassageSet.directions.title.split(" ").slice(0, 3).join(" ")} DIRECTIONS`;
  const shouldShowPassageDirections = activePassageSetIndex === 0 || Boolean(activePassageSet.showDirectionsBefore);
  const reviewItems: ReviewItem[] = [
    ...(shouldShowPassageDirections && (sessionScreen === "readingDirections" || sessionScreen === "passageEnd")
      ? [
          {
            id: "directions" as const,
            kind: "directions" as const,
            label: "ELA Rdg Comp Directions",
          },
        ]
      : []),
    ...accessibleQuestions.map((question, index) => ({
      id: `question-${index}` as const,
      isAnswered: isQuestionAnswered(question, selectedAnswers),
      isBookmarked: bookmarkedQuestionIds.includes(question.id),
      kind: "question" as const,
      label: `Question ${index + 1}`,
    })),
    ...(sessionScreen === "passageEnd"
      ? [
          {
            id: "passageEnd" as const,
            kind: "passageEnd" as const,
            label: "Passage End Directions",
          },
          {
            id: "endSection" as const,
            kind: "endSection" as const,
            label: "End of Section",
          },
        ]
      : []),
  ];

  function clearTransientExamUi() {
    setChoiceLimitWarnings([]);
    setHighlightToolbar(null);
  }

  function saveCompletedExam(answers: SelectedAnswers) {
    if (!studentId) {
      return;
    }

    saveExamResult(studentId, createExamResult(examContent, answers));
  }

  function handleSpeedFinish() {
    if (!isTeacherPreviewSession) {
      return;
    }

    const randomAnswers = Object.fromEntries(
      getAllExamQuestions(examContent).map((question) => [question.id, createRandomQuestionAnswer(question)]),
    );

    setSelectedAnswers(randomAnswers);
    setHasCompletedMath(true);
    clearTransientExamUi();
    setActiveTool("pointer");
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    saveCompletedExam(randomAnswers);
    setSessionScreen("testOver");
  }

  function showChoiceLimitWarning(maxChoices: number) {
    setChoiceLimitWarnings((currentWarnings) => [
      ...currentWarnings,
      {
        id: `${Date.now()}-${Math.random()}`,
        maxChoices,
      },
    ]);
  }

  function handlePassageNext() {
    if (!isFastForwardEnabled && !isQuestionAnswered(activeQuestion, selectedAnswers)) {
      setIsUnansweredModalOpen(true);
      return;
    }

    if (activeQuestionIndex < activePassageSet.questions.length - 1) {
      setSelectedCategoryItemId("");
      clearTransientExamUi();
      setIsReviewOpen(false);
      setActiveQuestionIndex((currentIndex) => currentIndex + 1);
      return;
    }

    setSelectedCategoryItemId("");
    clearTransientExamUi();
    setIsReviewOpen(false);
    setReviewFilter("all");
    setSessionScreen("passageEnd");
  }

  function handlePassageEndNext() {
    if (!hasNextPassageSet) {
      if (standaloneSection) {
        setActiveStandaloneQuestionIndex(0);
        setActiveTool("pointer");
        clearTransientExamUi();
        setIsNotepadOpen(false);
        setIsReviewOpen(false);
        setIsUnansweredModalOpen(false);
        setReviewFilter("all");
        setSelectedCategoryItemId("");
        setSessionScreen("standaloneIntro");
      }

      return;
    }

    setActivePassageSetIndex((currentIndex) => currentIndex + 1);
    setActiveQuestionIndex(0);
    setActiveTool("pointer");
    clearTransientExamUi();
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setReviewFilter("all");
    setSelectedCategoryItemId("");
    setSessionScreen("passageIntro");
  }

  function handlePassagePrevious() {
    clearTransientExamUi();
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);

    if (activeQuestionIndex > 0) {
      setSelectedCategoryItemId("");
      setActiveQuestionIndex((currentIndex) => currentIndex - 1);
      return;
    }

    setSessionScreen(shouldShowPassageDirections ? "readingDirections" : "passageIntro");
  }

  function handleChooseAnswer(questionId: string, choiceId: string) {
    setEliminatedChoices((currentChoices) => ({
      ...currentChoices,
      [questionId]: (currentChoices[questionId] ?? []).filter(
        (currentChoiceId) => currentChoiceId !== choiceId,
      ),
    }));
    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: choiceId,
    }));
  }

  function handleChangeTextEntry(questionId: string, value: string) {
    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
    }));
  }

  function handleChangeInlineDropdownAnswer(questionId: string, dropdownId: string, choiceId: string) {
    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: {
        ...getCategoryPlacements(currentAnswers[questionId]),
        [dropdownId]: choiceId,
      },
    }));
  }

  function handleToggleMultiSelectAnswer(question: ExamQuestion, choiceId: string) {
    const currentChoiceIds = getSelectedChoiceIds(selectedAnswers[question.id]);
    const maxChoices = getRequiredSelectionCount(question);

    if (currentChoiceIds.includes(choiceId)) {
      setSelectedAnswers((currentAnswers) => ({
        ...currentAnswers,
        [question.id]: currentChoiceIds.filter((currentChoiceId) => currentChoiceId !== choiceId),
      }));
      return;
    }

    if (!isFastForwardEnabled && currentChoiceIds.length >= maxChoices) {
      showChoiceLimitWarning(maxChoices);
      return;
    }

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.id]: [...currentChoiceIds, choiceId],
    }));
    setEliminatedChoices((currentChoices) => ({
      ...currentChoices,
      [question.id]: (currentChoices[question.id] ?? []).filter(
        (currentChoiceId) => currentChoiceId !== choiceId,
      ),
    }));
  }

  function handleToggleEliminatedChoice(questionId: string, choiceId: string) {
    setEliminatedChoices((currentChoices) => {
      const currentChoiceIds = currentChoices[questionId] ?? [];
      const nextChoiceIds = currentChoiceIds.includes(choiceId)
        ? currentChoiceIds.filter((currentChoiceId) => currentChoiceId !== choiceId)
        : [...currentChoiceIds, choiceId];

      return {
        ...currentChoices,
        [questionId]: nextChoiceIds,
      };
    });
  }

  function handleChoiceClick(question: ExamQuestion, choiceId: string) {
    if (activeTool === "eliminator") {
      handleToggleEliminatedChoice(question.id, choiceId);
      return;
    }

    if (question.type === "multi_select") {
      handleToggleMultiSelectAnswer(question, choiceId);
      return;
    }

    handleChooseAnswer(question.id, choiceId);
  }

  function handleSelectTool(tool: ExamTool) {
    setHighlightToolbar(null);

    if (tool === "notepad") {
      const nextNotepadState = !isNotepadOpen;
      setIsNotepadOpen(nextNotepadState);
      setActiveTool(nextNotepadState ? "notepad" : "pointer");
      return;
    }

    setActiveTool(tool);
  }

  function handleChangePassageNote(note: string) {
    setPassageNotes((currentNotes) => ({
      ...currentNotes,
      [activePassageSet.id]: note,
    }));
  }

  function getHighlightOffset(element: Element, container: Node, offset: number) {
    const offsetRange = document.createRange();
    offsetRange.selectNodeContents(element);
    offsetRange.setEnd(container, offset);
    return offsetRange.toString().length;
  }

  function getSelectionRanges(root: HTMLElement, range: Range): PendingTextSelection[] {
    return Array.from(root.querySelectorAll<HTMLElement>("[data-highlight-key]"))
      .map((element) => {
        if (!range.intersectsNode(element)) {
          return null;
        }

        const key = element.dataset.highlightKey;
        const textLength = element.textContent?.length ?? 0;

        if (!key || textLength === 0) {
          return null;
        }

        const start = element.contains(range.startContainer)
          ? getHighlightOffset(element, range.startContainer, range.startOffset)
          : 0;
        const end = element.contains(range.endContainer)
          ? getHighlightOffset(element, range.endContainer, range.endOffset)
          : textLength;
        const normalizedStart = Math.max(0, Math.min(start, textLength));
        const normalizedEnd = Math.max(normalizedStart, Math.min(end, textLength));

        if (normalizedStart === normalizedEnd) {
          return null;
        }

        return {
          end: normalizedEnd,
          key,
          start: normalizedStart,
        };
      })
      .filter((selectionRange): selectionRange is PendingTextSelection => Boolean(selectionRange));
  }

  function handleExamTextSelection(event: MouseEvent<HTMLElement>) {
    const root = event.currentTarget;

    window.setTimeout(() => {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setHighlightToolbar(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const selectionRanges = getSelectionRanges(root, range);

      if (selectionRanges.length === 0) {
        setHighlightToolbar(null);
        return;
      }

      const firstRect = range.getClientRects()[0] ?? range.getBoundingClientRect();

      if (!firstRect) {
        setHighlightToolbar(null);
        return;
      }

      setHighlightToolbar({
        ranges: selectionRanges,
        x: Math.max(46, firstRect.left + firstRect.width / 2),
        y: Math.max(44, firstRect.top - 48),
      });
    }, 0);
  }

  function handleApplyTextHighlight(color: TextHighlightColor) {
    if (!highlightToolbar) {
      return;
    }

    setTextHighlights((currentHighlights) => {
      const nextHighlights = { ...currentHighlights };

      highlightToolbar.ranges.forEach((selectionRange) => {
        const remainingRanges = (nextHighlights[selectionRange.key] ?? []).flatMap((highlightRange) => {
          if (highlightRange.end <= selectionRange.start || highlightRange.start >= selectionRange.end) {
            return [highlightRange];
          }

          const splitRanges: TextHighlightRange[] = [];

          if (highlightRange.start < selectionRange.start) {
            splitRanges.push({
              ...highlightRange,
              end: selectionRange.start,
            });
          }

          if (highlightRange.end > selectionRange.end) {
            splitRanges.push({
              ...highlightRange,
              start: selectionRange.end,
            });
          }

          return splitRanges;
        });

        nextHighlights[selectionRange.key] = [
          ...remainingRanges,
          {
            color,
            end: selectionRange.end,
            start: selectionRange.start,
          },
        ];
      });

      return nextHighlights;
    });

    window.getSelection()?.removeAllRanges();
    setHighlightToolbar(null);
  }

  function handleClearTextHighlights() {
    if (!highlightToolbar) {
      return;
    }

    setTextHighlights((currentHighlights) => {
      const nextHighlights = { ...currentHighlights };

      highlightToolbar.ranges.forEach((selectionRange) => {
        nextHighlights[selectionRange.key] = (nextHighlights[selectionRange.key] ?? []).flatMap(
          (highlightRange) => {
            if (highlightRange.end <= selectionRange.start || highlightRange.start >= selectionRange.end) {
              return [highlightRange];
            }

            const remainingRanges: TextHighlightRange[] = [];

            if (highlightRange.start < selectionRange.start) {
              remainingRanges.push({
                ...highlightRange,
                end: selectionRange.start,
              });
            }

            if (highlightRange.end > selectionRange.end) {
              remainingRanges.push({
                ...highlightRange,
                start: selectionRange.end,
              });
            }

            return remainingRanges;
          },
        );
      });

      return nextHighlights;
    });

    window.getSelection()?.removeAllRanges();
    setHighlightToolbar(null);
  }

  function renderHighlightedText(text: string, highlightKey: string): ReactNode {
    const { boldRanges, displayText, italicRanges, mathRanges } = getBoldFormattedText(text);
    const ranges = [...(textHighlights[highlightKey] ?? [])]
      .filter((range) => range.end > range.start)
      .sort((firstRange, secondRange) => firstRange.start - secondRange.start);
    const clippedHighlightRanges = ranges
      .map((range) => ({
        ...range,
        end: Math.min(range.end, displayText.length),
        start: Math.max(0, Math.min(range.start, displayText.length)),
      }))
      .filter((range) => range.end > range.start);
    const boundaries = new Set([0, displayText.length]);
    const nodes: ReactNode[] = [];

    clippedHighlightRanges.forEach((range) => {
      boundaries.add(range.start);
      boundaries.add(range.end);
    });

    boldRanges.forEach((range) => {
      boundaries.add(range.start);
      boundaries.add(range.end);
    });

    italicRanges.forEach((range) => {
      boundaries.add(range.start);
      boundaries.add(range.end);
    });

    mathRanges.forEach((range) => {
      boundaries.add(range.start);
      boundaries.add(range.end);
    });

    const orderedBoundaries = [...boundaries].sort((firstBoundary, secondBoundary) => {
      return firstBoundary - secondBoundary;
    });

    orderedBoundaries.slice(0, -1).forEach((start, index) => {
      const end = orderedBoundaries[index + 1];
      const segment = displayText.slice(start, end);

      if (!segment) {
        return;
      }

      const highlightRange = clippedHighlightRanges.find((range) => {
        return range.start <= start && range.end >= end;
      });
      const isBold = boldRanges.some((range) => {
        return range.start <= start && range.end >= end;
      });
      const isItalic = italicRanges.some((range) => {
        return range.start <= start && range.end >= end;
      });
      const isMath = mathRanges.some((range) => {
        return range.start <= start && range.end >= end;
      });
      let content: ReactNode = segment;

      if (isMath) {
        content = <span className="exam-inline-math">{renderInlineMathText(segment)}</span>;
      }

      if (isItalic) {
        content = <em>{content}</em>;
      }

      if (isBold) {
        content = <strong>{content}</strong>;
      }

      if (highlightRange) {
        content = <mark className={`exam-text-highlight is-${highlightRange.color}`}>{content}</mark>;
      }

      nodes.push(<span key={`${highlightKey}-${start}-${end}`}>{content}</span>);
    });

    if (nodes.length === 0) {
      return displayText;
    }

    return nodes;
  }

  function renderInlineDropdownText(question: ExamQuestion, template: string, templateIndex: number) {
    const dropdownAnswers = getCategoryPlacements(selectedAnswers[question.id]);

    return template
      .split(/(\\\([\s\S]+?\\\)|\{\{[\w-]+\}\})/g)
      .filter(Boolean)
      .map((part, partIndex) => {
        if (part.startsWith("\\(") && part.endsWith("\\)")) {
          return (
            <span className="exam-inline-math" key={`math-${templateIndex}-${partIndex}`}>
              {renderInlineMathText(part.slice(2, -2))}
            </span>
          );
        }

        if (part.startsWith("{{") && part.endsWith("}}")) {
          const dropdownId = part.slice(2, -2);
          const dropdown = question.dropdowns?.find((candidate) => candidate.id === dropdownId);

          if (!dropdown) {
            return null;
          }

          return (
            <select
              aria-label="Choose answer"
              className="exam-inline-dropdown-select"
              key={`dropdown-${templateIndex}-${partIndex}`}
              onChange={(event) =>
                handleChangeInlineDropdownAnswer(question.id, dropdown.id, event.target.value)
              }
              value={dropdownAnswers[dropdown.id] ?? ""}
            >
              <option value="">Choose...</option>
              {dropdown.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.text}
                </option>
              ))}
            </select>
          );
        }

        return part.split("\n").map((line, lineIndex, lines) => (
          <span key={`text-${templateIndex}-${partIndex}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ));
      });
  }

  function handlePlaceCategoryItem(question: ExamQuestion, itemId: string, categoryId: string) {
    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.id]:
        question.requiredPlacements === 1
          ? {
              [itemId]: categoryId,
            }
          : {
              ...getCategoryPlacements(currentAnswers[question.id]),
              [itemId]: categoryId,
            },
    }));
    setSelectedCategoryItemId("");
  }

  function handleReturnCategoryItem(question: ExamQuestion, itemId: string) {
    setSelectedAnswers((currentAnswers) => {
      const nextPlacements = { ...getCategoryPlacements(currentAnswers[question.id]) };
      delete nextPlacements[itemId];

      return {
        ...currentAnswers,
        [question.id]: nextPlacements,
      };
    });
    setSelectedCategoryItemId("");
  }

  function handleCategoryDrop(question: ExamQuestion, categoryId: string, event: DragEvent<HTMLElement>) {
    event.preventDefault();

    const itemId = event.dataTransfer.getData("text/plain");

    if (itemId) {
      handlePlaceCategoryItem(question, itemId, categoryId);
    }
  }

  function handleCategoryBankDrop(question: ExamQuestion, event: DragEvent<HTMLElement>) {
    event.preventDefault();

    const itemId = event.dataTransfer.getData("text/plain");

    if (itemId) {
      handleReturnCategoryItem(question, itemId);
    }
  }

  function handleCategoryClick(question: ExamQuestion, categoryId: string) {
    if (selectedCategoryItemId) {
      handlePlaceCategoryItem(question, selectedCategoryItemId, categoryId);
    }
  }

  function handleCategoryBankClick(question: ExamQuestion) {
    if (selectedCategoryItemId) {
      handleReturnCategoryItem(question, selectedCategoryItemId);
    }
  }

  function handleTransitionChoiceDrop(question: ExamQuestion, event: DragEvent<HTMLElement>) {
    event.preventDefault();

    const choiceId = event.dataTransfer.getData("text/plain");

    if (choiceId && question.choices?.some((choice) => choice.id === choiceId)) {
      handleChooseAnswer(question.id, choiceId);
    }
  }

  function handleTransitionBankDrop(question: ExamQuestion, event: DragEvent<HTMLElement>) {
    event.preventDefault();

    const choiceId = event.dataTransfer.getData("text/plain");

    if (choiceId && selectedAnswers[question.id] === choiceId) {
      setSelectedAnswers((currentAnswers) => {
        const nextAnswers = { ...currentAnswers };
        delete nextAnswers[question.id];
        return nextAnswers;
      });
    }
  }

  function handleToggleBookmark() {
    if (sessionScreen !== "passage") {
      return;
    }

    setBookmarkedQuestionIds((currentIds) =>
      currentIds.includes(activeQuestion.id)
        ? currentIds.filter((questionId) => questionId !== activeQuestion.id)
        : [...currentIds, activeQuestion.id],
    );
  }

  function handleReviewItemSelect(itemId: ReviewItemId) {
    if (!reviewItems.some((item) => item.id === itemId)) {
      return;
    }

    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    clearTransientExamUi();
    setSelectedCategoryItemId("");

    if (itemId === "directions") {
      setSessionScreen("readingDirections");
      return;
    }

    if (itemId === "passageEnd" || itemId === "endSection") {
      setSessionScreen("passageEnd");
      return;
    }

    const questionIndex = Number(itemId.replace("question-", ""));

    if (!Number.isNaN(questionIndex) && activePassageSet.questions[questionIndex]) {
      setActiveQuestionIndex(questionIndex);
      setSessionScreen("passage");
    }
  }

  function handleStandaloneNext() {
    if (!standaloneSection || !activeStandaloneQuestion) {
      return;
    }

    if (!isFastForwardEnabled && !isQuestionAnswered(activeStandaloneQuestion, selectedAnswers)) {
      setIsUnansweredModalOpen(true);
      return;
    }

    if (activeStandaloneQuestionIndex < standaloneSection.questions.length - 1) {
      setSelectedCategoryItemId("");
      clearTransientExamUi();
      setIsReviewOpen(false);
      setActiveStandaloneQuestionIndex((currentIndex) => currentIndex + 1);
      return;
    }

    setSelectedCategoryItemId("");
    clearTransientExamUi();
    setActiveTool("pointer");
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setSessionScreen("endSection");
  }

  function handleStandalonePrevious() {
    clearTransientExamUi();
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);

    if (activeStandaloneQuestionIndex > 0) {
      setSelectedCategoryItemId("");
      setActiveStandaloneQuestionIndex((currentIndex) => currentIndex - 1);
      return;
    }

    setSessionScreen("standaloneDirections");
  }

  function handleEndSectionSubmit() {
    clearTransientExamUi();
    setActiveTool("pointer");
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setSelectedCategoryItemId("");

    if (startingSubject === "english" && !hasCompletedMath) {
      setSessionScreen("mathIntro");
      return;
    }

    saveCompletedExam(selectedAnswers);
    setSessionScreen("testOver");
  }

  function finishMathSection() {
    clearTransientExamUi();
    setActiveTool("pointer");
    setHasCompletedMath(true);
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setReviewFilter("all");
    setSelectedCategoryItemId("");

    if (startingSubject === "math") {
      setActivePassageSetIndex(0);
      setActiveQuestionIndex(0);
      setSessionScreen("passageIntro");
      return;
    }

    saveCompletedExam(selectedAnswers);
    setSessionScreen("testOver");
  }

  function handleStartMathSection() {
    clearTransientExamUi();
    setActiveTool("pointer");
    setActiveMathQuestionIndex(0);
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setReviewFilter("all");
    setSelectedCategoryItemId("");

    if (mathQuestions.length === 0) {
      finishMathSection();
      return;
    }

    setSessionScreen("mathDirections");
  }

  function handleMathNext() {
    if (!activeMathQuestion) {
      finishMathSection();
      return;
    }

    if (!isFastForwardEnabled && !isQuestionAnswered(activeMathQuestion, selectedAnswers)) {
      setIsUnansweredModalOpen(true);
      return;
    }

    if (activeMathQuestionIndex < mathQuestions.length - 1) {
      setSelectedCategoryItemId("");
      clearTransientExamUi();
      setIsReviewOpen(false);
      setActiveMathQuestionIndex((currentIndex) => currentIndex + 1);
      return;
    }

    finishMathSection();
  }

  function handleMathPrevious() {
    if (!isFastForwardEnabled) {
      return;
    }

    clearTransientExamUi();
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);

    if (activeMathQuestionIndex > 0) {
      setSelectedCategoryItemId("");
      setActiveMathQuestionIndex((currentIndex) => currentIndex - 1);
      return;
    }

    setSessionScreen("mathDirections");
  }

  const currentReviewItemId: ReviewItemId | undefined =
    sessionScreen === "readingDirections"
      ? "directions"
      : sessionScreen === "passageEnd"
        ? "passageEnd"
        : sessionScreen === "passage"
          ? (`question-${activeQuestionIndex}` as const)
          : undefined;
  const fastForwardToolbarProps = {
    canUseFastForward: isTeacherPreviewSession,
    isFastForwardEnabled,
    onSpeedFinish: handleSpeedFinish,
    onToggleFastForward: () => setIsFastForwardEnabled((currentValue) => !currentValue),
  };

  const reviewToolbarProps = {
    activeTool,
    bookmarkCount,
    currentReviewItemId,
    ...fastForwardToolbarProps,
    isBookmarkActive: isActiveQuestionBookmarked,
    isNotepadOpen,
    isReviewOpen,
    onReviewFilterChange: setReviewFilter,
    onReviewItemSelect: handleReviewItemSelect,
    onSelectTool: handleSelectTool,
    onToggleBookmark: sessionScreen === "passage" ? handleToggleBookmark : undefined,
    onToggleReview: () => {
      setReviewFilter("all");
      setIsReviewOpen((currentValue) => !currentValue);
    },
    reviewFilter,
    reviewItems,
    reviewQuestionCount: accessibleQuestions.length,
    unansweredCount,
  };

  if (sessionScreen === "mathIntro") {
    return (
      <main className="exam-module-shell">
        <ExamModuleHeader studentName={studentName} />

        <section className="exam-passage-intro-card" aria-labelledby="math-intro-title">
          <div className="exam-passage-intro-panel">
            <div className="exam-passage-intro-copy">
              <h1 id="math-intro-title">{mathSection.label}</h1>
              <p>{mathSection.questionCount} Questions</p>
            </div>
            <div className="exam-passage-intro-actions">
              <button type="button" onClick={handleStartMathSection}>
                Start
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (sessionScreen === "mathDirections") {
    return (
      <main className="exam-session-shell">
        <ExamToolbar
          activeTool={activeTool}
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={mathSection.directions.breadcrumbLabel ?? "MATH DIRECTIONS"}
          breadcrumbMiddle={mathSection.label.toUpperCase()}
          {...fastForwardToolbarProps}
          isNotepadOpen={isNotepadOpen}
          onNext={() => {
            setHighlightToolbar(null);
            setIsReviewOpen(false);
            setReviewFilter("all");
            setActiveMathQuestionIndex(0);
            setSessionScreen("mathQuestion");
          }}
          onSelectTool={handleSelectTool}
          showReviewTools={false}
          studentName={studentName}
        />

        <section className="exam-math-directions-document" aria-labelledby="math-directions-title">
          <article className="exam-math-directions-page">
            <header>
              <p>{mathSection.directions.subject}</p>
              <h1 id="math-directions-title">{mathSection.directions.title}</h1>
            </header>

            <ol>
              {mathSection.directions.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ol>

            <h2>DIRECTIONS:</h2>
            <p>{mathSection.directions.body}</p>
          </article>
        </section>
      </main>
    );
  }

  if (sessionScreen === "mathQuestion" && activeMathQuestion) {
    const mathNoteKey = mathSection.id;

    return (
      <main className="exam-session-shell">
        <ExamToolbar
          activeTool={activeTool}
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={`${activeMathQuestionIndex + 1} OF ${mathSection.questionCount}`}
          breadcrumbMiddle={mathSection.label.toUpperCase()}
          {...fastForwardToolbarProps}
          isNotepadOpen={isNotepadOpen}
          isPreviousActive={isFastForwardEnabled}
          onNext={handleMathNext}
          onPrevious={handleMathPrevious}
          onSelectTool={handleSelectTool}
          showReviewTools={false}
          showTimer={false}
          studentName={studentName}
        />

        <section
          aria-labelledby={`math-title-${activeMathQuestion.id}`}
          className={`exam-standalone-document exam-math-document ${
            isTextEntryQuestion(activeMathQuestion) ? "is-text-entry" : ""
          } ${isInlineDropdownQuestion(activeMathQuestion) ? "is-inline-dropdown" : ""} ${
            activeMathQuestion.image ? "is-image-question" : ""
          }`}
          onMouseUp={handleExamTextSelection}
        >
          <form className="exam-standalone-panel exam-math-panel">
            {activeMathQuestion.image ? (
              <figure className="exam-question-image">
                <img alt={activeMathQuestion.image.alt} src={activeMathQuestion.image.src} />
              </figure>
            ) : null}

            <h1
              className="exam-highlightable"
              data-highlight-key={`prompt:${activeMathQuestion.id}`}
              id={`math-title-${activeMathQuestion.id}`}
            >
              {renderHighlightedText(activeMathQuestion.prompt, `prompt:${activeMathQuestion.id}`)}
            </h1>

            {activeMathQuestion.stimulus ? (
              <div
                className="exam-standalone-stimulus exam-highlightable"
                data-highlight-key={`stimulus:${activeMathQuestion.id}`}
              >
                {renderHighlightedText(activeMathQuestion.stimulus, `stimulus:${activeMathQuestion.id}`)}
              </div>
            ) : null}

            {activeMathQuestion.instructions ? (
              <p
                className="exam-standalone-instructions exam-highlightable"
                data-highlight-key={`instructions:${activeMathQuestion.id}`}
              >
                {renderHighlightedText(
                  activeMathQuestion.instructions,
                  `instructions:${activeMathQuestion.id}`,
                )}
              </p>
            ) : null}

            {isTextEntryQuestion(activeMathQuestion) ? (
              <div className="exam-math-text-entry">
                <input
                  aria-label="Answer"
                  inputMode={activeMathQuestion.type === "short_response" ? "text" : "decimal"}
                  onChange={(event) => handleChangeTextEntry(activeMathQuestion.id, event.target.value)}
                  type="text"
                  value={getTextEntryValue(selectedAnswers[activeMathQuestion.id])}
                />
              </div>
            ) : isInlineDropdownQuestion(activeMathQuestion) && activeMathQuestion.dropdownContent ? (
              <div className="exam-inline-dropdown-content">
                {activeMathQuestion.dropdownContent.map((line, index) => (
                  <p key={`${activeMathQuestion.id}-dropdown-line-${index}`}>
                    {renderInlineDropdownText(activeMathQuestion, line, index)}
                  </p>
                ))}
              </div>
            ) : activeMathQuestionChoices.length > 0 ? (
              <div className="exam-choice-list exam-standalone-choice-list">
                {activeMathQuestionChoices.map((choice) => (
                  <label
                    className={`exam-choice ${
                      activeMathQuestionEliminatedChoiceIds.includes(choice.id) ? "is-eliminated" : ""
                    }`}
                    key={choice.id}
                    onClick={(event) => {
                      if (activeTool === "eliminator") {
                        event.preventDefault();
                      }
                      if (window.getSelection()?.toString().trim()) {
                        return;
                      }
                      handleChoiceClick(activeMathQuestion, choice.id);
                    }}
                  >
                    <input
                      checked={
                        activeMathQuestion.type === "multi_select"
                          ? activeMathQuestionSelectedChoiceIds.includes(choice.id)
                          : selectedAnswers[activeMathQuestion.id] === choice.id
                      }
                      name={activeMathQuestion.id}
                      onChange={() => undefined}
                      type={activeMathQuestion.type === "multi_select" ? "checkbox" : "radio"}
                    />
                    <span>{choice.id}.</span>
                    <span
                      aria-label={choice.math ? choice.text : undefined}
                      className={choice.math ? "exam-choice-math" : "exam-highlightable"}
                      data-highlight-key={
                        choice.math ? undefined : `choice:${activeMathQuestion.id}:${choice.id}`
                      }
                    >
                      {choice.math
                        ? renderMathExpression(choice.math)
                        : renderHighlightedText(choice.text, `choice:${activeMathQuestion.id}:${choice.id}`)}
                    </span>
                    {activeMathQuestionEliminatedChoiceIds.includes(choice.id) ? (
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
                ))}
              </div>
            ) : (
              <p className="exam-question-placeholder">This math question type is not ready in the player yet.</p>
            )}
          </form>
        </section>

        {highlightToolbar ? (
          <div
            className="exam-highlight-toolbar"
            onMouseDown={(event) => event.preventDefault()}
            role="toolbar"
            style={{ left: highlightToolbar.x, top: highlightToolbar.y }}
          >
            <button
              aria-label="Remove highlights"
              className="is-clear"
              onClick={handleClearTextHighlights}
              type="button"
            >
              <span />
            </button>
            <button
              aria-label="Highlight blue"
              className="is-blue"
              onClick={() => handleApplyTextHighlight("blue")}
              type="button"
            >
              <span />
            </button>
            <button
              aria-label="Highlight pink"
              className="is-pink"
              onClick={() => handleApplyTextHighlight("pink")}
              type="button"
            >
              <span />
            </button>
          </div>
        ) : null}

        {isNotepadOpen ? (
          <section className="exam-notepad-window" aria-label="Notepad">
            <header>
              <h2>Notepad</h2>
              <button
                aria-label="Close notepad"
                onClick={() => {
                  setIsNotepadOpen(false);
                  setActiveTool("pointer");
                }}
                type="button"
              >
                x
              </button>
            </header>
            <textarea
              aria-label="Math notes"
              autoFocus
              onChange={(event) =>
                setPassageNotes((currentNotes) => ({
                  ...currentNotes,
                  [mathNoteKey]: event.target.value,
                }))
              }
              value={passageNotes[mathNoteKey] ?? ""}
            />
          </section>
        ) : null}

        {isUnansweredModalOpen ? (
          <div className="exam-attention-layer">
            <section
              aria-describedby="exam-attention-message"
              aria-labelledby="exam-attention-title"
              aria-modal="true"
              className="exam-attention-modal"
              role="alertdialog"
            >
              <header>
                <h2 id="exam-attention-title">Attention</h2>
                <button
                  aria-label="Close attention dialog"
                  className="exam-attention-close"
                  onClick={() => setIsUnansweredModalOpen(false)}
                  type="button"
                >
                  x
                </button>
              </header>
              <p id="exam-attention-message">
                You must answer all parts of the question before you can continue. You might need to scroll down
                to see what is unanswered.
              </p>
              <div className="exam-attention-actions">
                <button onClick={() => setIsUnansweredModalOpen(false)} type="button">
                  OK
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    );
  }

  if (sessionScreen === "standaloneIntro" && standaloneSection) {
    return (
      <main className="exam-module-shell">
        <ExamModuleHeader studentName={studentName} />

        <section className="exam-passage-intro-card" aria-labelledby="standalone-intro-title">
          <div className="exam-passage-intro-panel">
            <div className="exam-passage-intro-copy">
              <h1 id="standalone-intro-title">{standaloneSection.label}</h1>
              <p>{standaloneSection.questionCount} Questions</p>
            </div>
            <div className="exam-passage-intro-actions">
              <button
                type="button"
                onClick={() => {
                  setHighlightToolbar(null);
                  setIsReviewOpen(false);
                  setReviewFilter("all");
                  setActiveStandaloneQuestionIndex(0);
                  setSessionScreen("standaloneDirections");
                }}
              >
                Start
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (sessionScreen === "standaloneDirections" && standaloneSection) {
    return (
      <main className="exam-session-shell">
        <ExamToolbar
          activeTool={activeTool}
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={standaloneSection.directions.breadcrumbLabel ?? "ELA REV/EDIT B DIRECTIONS"}
          breadcrumbMiddle={standaloneSection.label.toUpperCase()}
          {...fastForwardToolbarProps}
          isNotepadOpen={isNotepadOpen}
          onNext={() => {
            setHighlightToolbar(null);
            setIsReviewOpen(false);
            setReviewFilter("all");
            setActiveStandaloneQuestionIndex(0);
            setSessionScreen("standaloneQuestion");
          }}
          onPrevious={() => {
            setHighlightToolbar(null);
            setIsReviewOpen(false);
            setSessionScreen("standaloneIntro");
          }}
          onSelectTool={handleSelectTool}
          showReviewTools={false}
          showTimer={false}
          studentName={studentName}
        />

        <section className="exam-reading-directions-document" aria-labelledby="standalone-directions-title">
          <article className="exam-reading-directions-page">
            <div className="exam-reading-directions-content">
              <header>
                <p>{standaloneSection.directions.subject}</p>
                <h1 id="standalone-directions-title">{standaloneSection.directions.title}</h1>
              </header>
              <p>
                <strong>DIRECTIONS:</strong> {standaloneSection.directions.body}
              </p>
            </div>
          </article>
        </section>
      </main>
    );
  }

  if (sessionScreen === "standaloneQuestion" && standaloneSection && activeStandaloneQuestion) {
    const standaloneNoteKey = standaloneSection.id;

    return (
      <main className="exam-session-shell">
        <ExamToolbar
          activeTool={activeTool}
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={`${activeStandaloneQuestionIndex + 1} OF ${standaloneSection.questionCount}`}
          breadcrumbMiddle={standaloneSection.label.toUpperCase()}
          {...fastForwardToolbarProps}
          isNotepadOpen={isNotepadOpen}
          isPreviousActive
          onNext={handleStandaloneNext}
          onPrevious={handleStandalonePrevious}
          onSelectTool={handleSelectTool}
          showReviewTools={false}
          showTimer={false}
          studentName={studentName}
        />

        <section
          aria-labelledby={`standalone-title-${activeStandaloneQuestion.id}`}
          className="exam-standalone-document"
          onMouseUp={handleExamTextSelection}
        >
          <form className="exam-standalone-panel">
            <h1
              className="exam-highlightable"
              data-highlight-key={`prompt:${activeStandaloneQuestion.id}`}
              id={`standalone-title-${activeStandaloneQuestion.id}`}
            >
              {renderHighlightedText(
                activeStandaloneQuestion.prompt,
                `prompt:${activeStandaloneQuestion.id}`,
              )}
            </h1>

            {activeStandaloneQuestion.stimulus ? (
              <div
                className="exam-standalone-stimulus exam-highlightable"
                data-highlight-key={`stimulus:${activeStandaloneQuestion.id}`}
              >
                {renderHighlightedText(
                  activeStandaloneQuestion.stimulus,
                  `stimulus:${activeStandaloneQuestion.id}`,
                )}
              </div>
            ) : null}

            {activeStandaloneQuestion.instructions ? (
              <p
                className="exam-standalone-instructions exam-highlightable"
                data-highlight-key={`instructions:${activeStandaloneQuestion.id}`}
              >
                {renderHighlightedText(
                  activeStandaloneQuestion.instructions,
                  `instructions:${activeStandaloneQuestion.id}`,
                )}
              </p>
            ) : null}

            {activeStandaloneQuestion.type === "category_sort" &&
            activeStandaloneQuestion.items &&
            activeStandaloneQuestion.categories ? (
              <div className="exam-standalone-category-sort">
                <div
                  aria-label="Answer choice bank. Drop an answer here to undo a selection."
                  className="exam-standalone-category-bank"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleCategoryBankDrop(activeStandaloneQuestion, event)}
                >
                  {activeStandaloneQuestion.items
                    .filter((item) => !activeStandaloneQuestionCategoryPlacements[item.id])
                    .map((item) => (
                      <button
                        className={`exam-standalone-category-card ${
                          selectedCategoryItemId === item.id ? "is-selected" : ""
                        }`}
                        draggable
                        key={item.id}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCategoryItemId((currentItemId) =>
                            currentItemId === item.id ? "" : item.id,
                          );
                        }}
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/plain", item.id);
                          setSelectedCategoryItemId(item.id);
                        }}
                        type="button"
                      >
                        {item.text}
                      </button>
                    ))}
                </div>

                <div className="exam-standalone-category-target-grid">
                  {activeStandaloneQuestion.categories.map((category) => {
                    const placedItems = activeStandaloneQuestion.items?.filter(
                      (item) => activeStandaloneQuestionCategoryPlacements[item.id] === category.id,
                    );

                    return (
                      <section
                        className="exam-standalone-category-target"
                        key={category.id}
                        onClick={() => handleCategoryClick(activeStandaloneQuestion, category.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => handleCategoryDrop(activeStandaloneQuestion, category.id, event)}
                      >
                        <h2>{category.title}</h2>
                        <div className="exam-standalone-category-target-items">
                          {placedItems?.map((item) => (
                            <button
                              className="exam-standalone-category-card is-placed"
                              draggable
                              key={item.id}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedCategoryItemId(item.id);
                              }}
                              onDragStart={(event) => {
                                event.dataTransfer.setData("text/plain", item.id);
                                setSelectedCategoryItemId(item.id);
                              }}
                              type="button"
                            >
                              {item.text}
                            </button>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="exam-choice-list exam-standalone-choice-list">
                {activeStandaloneQuestionChoices.map((choice) => (
                  <label
                    className={`exam-choice ${
                      activeStandaloneQuestionEliminatedChoiceIds.includes(choice.id)
                        ? "is-eliminated"
                        : ""
                    }`}
                    key={choice.id}
                    onClick={(event) => {
                      if (activeTool === "eliminator") {
                        event.preventDefault();
                      }
                      if (window.getSelection()?.toString().trim()) {
                        return;
                      }
                      handleChoiceClick(activeStandaloneQuestion, choice.id);
                    }}
                  >
                    <input
                      checked={
                        activeStandaloneQuestion.type === "multi_select"
                          ? activeStandaloneQuestionSelectedChoiceIds.includes(choice.id)
                          : selectedAnswers[activeStandaloneQuestion.id] === choice.id
                      }
                      name={activeStandaloneQuestion.id}
                      onChange={() => undefined}
                      type={activeStandaloneQuestion.type === "multi_select" ? "checkbox" : "radio"}
                    />
                    <span>{choice.id}.</span>
                    <span
                      className="exam-highlightable"
                      data-highlight-key={`choice:${activeStandaloneQuestion.id}:${choice.id}`}
                    >
                      {renderHighlightedText(
                        choice.text,
                        `choice:${activeStandaloneQuestion.id}:${choice.id}`,
                      )}
                    </span>
                    {activeStandaloneQuestionEliminatedChoiceIds.includes(choice.id) ? (
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
                ))}
              </div>
            )}
          </form>
        </section>

        {highlightToolbar ? (
          <div
            className="exam-highlight-toolbar"
            onMouseDown={(event) => event.preventDefault()}
            role="toolbar"
            style={{ left: highlightToolbar.x, top: highlightToolbar.y }}
          >
            <button
              aria-label="Remove highlights"
              className="is-clear"
              onClick={handleClearTextHighlights}
              type="button"
            >
              <span />
            </button>
            <button
              aria-label="Highlight blue"
              className="is-blue"
              onClick={() => handleApplyTextHighlight("blue")}
              type="button"
            >
              <span />
            </button>
            <button
              aria-label="Highlight pink"
              className="is-pink"
              onClick={() => handleApplyTextHighlight("pink")}
              type="button"
            >
              <span />
            </button>
          </div>
        ) : null}

        {isNotepadOpen ? (
          <section className="exam-notepad-window" aria-label="Notepad">
            <header>
              <h2>Notepad</h2>
              <button
                aria-label="Close notepad"
                onClick={() => {
                  setIsNotepadOpen(false);
                  setActiveTool("pointer");
                }}
                type="button"
              >
                x
              </button>
            </header>
            <textarea
              aria-label="Stand-alone item notes"
              autoFocus
              onChange={(event) =>
                setPassageNotes((currentNotes) => ({
                  ...currentNotes,
                  [standaloneNoteKey]: event.target.value,
                }))
              }
              value={passageNotes[standaloneNoteKey] ?? ""}
            />
          </section>
        ) : null}

        {isUnansweredModalOpen ? (
          <div className="exam-attention-layer">
            <section
              aria-describedby="exam-attention-message"
              aria-labelledby="exam-attention-title"
              aria-modal="true"
              className="exam-attention-modal"
              role="alertdialog"
            >
              <header>
                <h2 id="exam-attention-title">Attention</h2>
                <button
                  aria-label="Close attention dialog"
                  className="exam-attention-close"
                  onClick={() => setIsUnansweredModalOpen(false)}
                  type="button"
                >
                  x
                </button>
              </header>
              <p id="exam-attention-message">
                You must answer all parts of the question before you can continue. You might need to scroll down
                to see what is unanswered.
              </p>
              <div className="exam-attention-actions">
                <button onClick={() => setIsUnansweredModalOpen(false)} type="button">
                  OK
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    );
  }

  if (sessionScreen === "endSection") {
    const endSectionLabel = standaloneSection?.label ?? "ELA - Stand alone items";

    return (
      <main className="exam-session-shell">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent=""
          breadcrumbMiddle="END SECTION"
          isNextActive={false}
          showReviewTools={false}
          showStatusIcon={false}
          showTimer={false}
          showWorkTools={false}
          studentName={studentName}
        />

        <section className="exam-end-section-card" aria-labelledby="exam-end-section-title">
          <h1 id="exam-end-section-title">End of {endSectionLabel}</h1>
          <span className="exam-end-section-check" aria-hidden="true">
            <Check size={31} strokeWidth={3.2} />
          </span>
          <p>All Questions Answered</p>
          <p className="exam-end-section-copy">
            Use the <strong>Submit</strong> button below to submit your answers.
          </p>
          <button className="exam-end-section-submit" onClick={handleEndSectionSubmit} type="button">
            Submit <span aria-hidden="true">&gt;&gt;</span>
          </button>
        </section>
      </main>
    );
  }

  if (sessionScreen === "testOver") {
    return (
      <main className="exam-session-shell">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent=""
          breadcrumbMiddle="TEST OVER"
          isNextActive={false}
          showReviewTools={false}
          showStatusIcon={false}
          showTimer={false}
          showWorkTools={false}
          studentName={studentName}
        />

        <section className="exam-end-section-card exam-test-over-card" aria-labelledby="exam-test-over-title">
          <h1 id="exam-test-over-title">Test Over</h1>
          <span className="exam-end-section-check" aria-hidden="true">
            <Check size={31} strokeWidth={3.2} />
          </span>
          <p>Your answers have been submitted.</p>
          <p className="exam-end-section-copy">You can now return to your dashboard.</p>
          <div className="exam-test-over-actions">
            <a className="exam-end-section-submit" href={`/results/${assessment.id}${window.location.search}`}>
              View Results
            </a>
            <button
              className="exam-end-section-submit is-secondary"
              onClick={() => window.location.assign(getTeacherPreviewDashboardHref())}
              type="button"
            >
              Return to Dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (sessionScreen === "passageIntro") {
    return (
      <main className="exam-module-shell">
        <ExamModuleHeader studentName={studentName} />

        <section className="exam-passage-intro-card" aria-labelledby="passage-intro-title">
          <div className="exam-passage-intro-panel">
            <div className="exam-passage-intro-copy">
              <h1 id="passage-intro-title">{passageSetDisplayLabel}</h1>
              <p>{activePassageSet.questionCount} Questions</p>
            </div>
            <div className="exam-passage-intro-actions">
              <button
                type="button"
                onClick={() => {
                  setHighlightToolbar(null);
                  setIsReviewOpen(false);
                  setReviewFilter("all");
                  setActiveQuestionIndex(0);
                  setSessionScreen(shouldShowPassageDirections ? "readingDirections" : "passage");
                }}
              >
                Start
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (sessionScreen === "readingDirections") {
    return (
      <main className="exam-session-shell">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={directionsBreadcrumbLabel}
          breadcrumbMiddle={passageSetLabel}
          {...reviewToolbarProps}
          onNext={() => {
            setHighlightToolbar(null);
            setIsReviewOpen(false);
            setReviewFilter("all");
            setActiveQuestionIndex(0);
            setSessionScreen("passage");
          }}
          onPrevious={() => {
            setHighlightToolbar(null);
            setIsReviewOpen(false);
            setSessionScreen("passageIntro");
          }}
          studentName={studentName}
        />

        <section className="exam-reading-directions-document" aria-labelledby="reading-directions-title">
          <article className="exam-reading-directions-page">
            <div className="exam-reading-directions-content">
              <header>
                <p>{activePassageSet.directions.subject}</p>
                <h1 id="reading-directions-title">{activePassageSet.directions.title}</h1>
              </header>
              <p>
                <strong>DIRECTIONS:</strong> {activePassageSet.directions.body}
              </p>
            </div>
          </article>
        </section>
      </main>
    );
  }

  if (sessionScreen === "passageEnd") {
    return (
      <main className="exam-session-shell">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent="PASSAGE END DIRECTIONS"
          breadcrumbMiddle={passageSetLabel}
          isPreviousActive
          {...reviewToolbarProps}
          onNext={handlePassageEndNext}
          onPrevious={() => {
            setHighlightToolbar(null);
            setIsReviewOpen(false);
            setActiveQuestionIndex(activePassageSet.questions.length - 1);
            setSessionScreen("passage");
          }}
          studentName={studentName}
        />

        <section className="exam-passage-end-document" aria-labelledby="passage-end-title">
          <article className="exam-passage-end-page">
            <div className="exam-passage-end-content">
              <p id="passage-end-title">
                <strong>There are no more questions for this passage set.</strong>
              </p>
              <p>
                Use the review button{" "}
                <span className="exam-passage-end-review-demo" aria-hidden="true">
                  Review <List size={14} strokeWidth={2.5} />
                </span>{" "}
                to return to any
                <br />
                questions about the passage you have just read.
              </p>
              <p>
                Once you select the blue arrow{" "}
                <span className="exam-passage-end-arrow-demo" aria-hidden="true">
                  <span>
                    <ChevronLeft size={16} strokeWidth={3} />
                  </span>
                  <span>
                    <ChevronRight size={16} strokeWidth={3} />
                  </span>
                </span>{" "}
                at the top of this screen,
                <br />
                you will <strong>not</strong> be able to return to any questions about this passage.
              </p>
            </div>
          </article>
        </section>
      </main>
    );
  }

  if (sessionScreen === "passage") {
    return (
      <main className="exam-session-shell">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={`${activeQuestionNumber} OF ${activePassageSet.questionCount}`}
          breadcrumbMiddle={passageSetLabel}
          isPreviousActive
          {...reviewToolbarProps}
          onNext={handlePassageNext}
          onPrevious={handlePassagePrevious}
          studentName={studentName}
        />

        <section
          className={`exam-question-document ${isExpandedQuestionLayout ? "is-expanded-layout" : ""}`}
          aria-labelledby={activeQuestionTitleId}
          onMouseUp={handleExamTextSelection}
        >
          <div className="exam-question-passage">
            <div
              className={`exam-question-passage-scroll ${
                isSentenceProsePassage ? "is-sentence-prose" : isProsePassage ? "is-prose" : "is-poem"
              }`}
              aria-label={activePassageSet.passage.title}
            >
              {activePassageSet.passage.lines.map((line, index) =>
                isSentenceProsePassage && !line.text ? (
                  <p
                    aria-hidden="true"
                    className="exam-sentence-prose-line is-spacer"
                    key={`${line.lineNumber}-${line.text}-${index}`}
                  />
                ) : isSentenceProsePassage ? (
                  <p
                    className={`exam-sentence-prose-line ${
                      line.align === "center" ? "is-title" : ""
                    }`}
                    key={`${line.lineNumber}-${line.text}-${index}`}
                  >
                    <span
                      className="exam-highlightable"
                      data-highlight-key={`passage:${activePassageSet.id}:line-${index}`}
                    >
                      {renderHighlightedText(line.text, `passage:${activePassageSet.id}:line-${index}`)}
                    </span>
                  </p>
                ) : isProsePassage && !line.text ? (
                  <p
                    aria-hidden="true"
                    className="exam-prose-line is-spacer"
                    key={`${line.lineNumber}-${line.text}-${index}`}
                  />
                ) : isProsePassage ? (
                  (() => {
                    const isFullWidthProseLine = Boolean(line.kind) || line.align === "center";
                    const proseLineClassName = [
                      "exam-prose-line",
                      line.kind ? `is-${line.kind}` : "",
                      line.align === "center" && !line.kind ? "is-title" : "",
                      line.text ? "" : "is-spacer",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <p
                        className={proseLineClassName}
                        key={`${line.lineNumber}-${line.text}-${index}`}
                      >
                        {isFullWidthProseLine ? (
                          <span
                            className="exam-highlightable"
                            data-highlight-key={`passage:${activePassageSet.id}:line-${index}`}
                          >
                            {renderHighlightedText(
                              line.text,
                              `passage:${activePassageSet.id}:line-${index}`,
                            )}
                          </span>
                        ) : (
                          <>
                            {line.lineNumber ? <span>{line.lineNumber}</span> : null}
                            <span
                              className="exam-highlightable"
                              data-highlight-key={`passage:${activePassageSet.id}:line-${index}`}
                            >
                              {renderHighlightedText(
                                line.text,
                                `passage:${activePassageSet.id}:line-${index}`,
                              )}
                            </span>
                          </>
                        )}
                      </p>
                    );
                  })()
                ) : (
                  <p
                    className={`exam-poem-line ${line.align === "center" ? "is-centered" : ""} ${
                      line.text ? "" : "is-spacer"
                    }`}
                    key={`${line.lineNumber}-${line.text}-${index}`}
                  >
                    <span>{line.lineNumber}</span>
                    <span
                      className="exam-highlightable"
                      data-highlight-key={`passage:${activePassageSet.id}:line-${index}`}
                    >
                      {renderHighlightedText(line.text, `passage:${activePassageSet.id}:line-${index}`)}
                    </span>
                  </p>
                ),
              )}
              {activePassageSet.passage.sourceNote ? (
                <p className="exam-passage-source-note">{activePassageSet.passage.sourceNote}</p>
              ) : null}
            </div>
          </div>

          <form className="exam-question-panel">
            <h1
              className="exam-highlightable"
              data-highlight-key={`prompt:${activeQuestion.id}`}
              id={activeQuestionTitleId}
            >
              {renderHighlightedText(activeQuestion.prompt, `prompt:${activeQuestion.id}`)}
            </h1>
            {activeQuestion.instructions ? (
              <p
                className="exam-question-instructions exam-highlightable"
                data-highlight-key={`instructions:${activeQuestion.id}`}
              >
                {renderHighlightedText(
                  activeQuestion.instructions,
                  `instructions:${activeQuestion.id}`,
                )}
              </p>
            ) : null}
            {activeQuestion.type === "category_sort" && activeQuestion.items && activeQuestion.categories ? (
              <div className="exam-category-sort">
                <div
                  aria-label="Answer choice bank. Drop an answer here to undo a category selection."
                  className={`exam-category-bank ${
                    selectedCategoryItemId && activeQuestionCategoryPlacements[selectedCategoryItemId]
                      ? "is-return-target"
                      : ""
                  }`}
                  onClick={() => handleCategoryBankClick(activeQuestion)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleCategoryBankDrop(activeQuestion, event)}
                >
                  {activeQuestion.items
                    .filter((item) => !activeQuestionCategoryPlacements[item.id])
                    .map((item) => (
                      <button
                        className={`exam-category-card ${
                          selectedCategoryItemId === item.id ? "is-selected" : ""
                        }`}
                        draggable
                        key={item.id}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCategoryItemId((currentItemId) =>
                            currentItemId === item.id ? "" : item.id,
                          );
                        }}
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/plain", item.id);
                          setSelectedCategoryItemId(item.id);
                        }}
                        type="button"
                      >
                        {item.text}
                      </button>
                    ))}
                </div>

                <div className="exam-category-target-grid">
                  {activeQuestion.categories.map((category) => {
                    const placedItems = activeQuestion.items?.filter(
                      (item) => activeQuestionCategoryPlacements[item.id] === category.id,
                    );

                    return (
                      <section
                        className="exam-category-target"
                        key={category.id}
                        onClick={() => handleCategoryClick(activeQuestion, category.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => handleCategoryDrop(activeQuestion, category.id, event)}
                      >
                        <h2>{category.title}</h2>
                        <div className="exam-category-target-items">
                          {placedItems?.map((item) => (
                            <button
                              className={`exam-category-card is-placed ${
                                selectedCategoryItemId === item.id ? "is-selected" : ""
                              }`}
                              draggable
                              key={item.id}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedCategoryItemId((currentItemId) =>
                                  currentItemId === item.id ? "" : item.id,
                                );
                              }}
                              onDragStart={(event) => {
                                event.dataTransfer.setData("text/plain", item.id);
                                setSelectedCategoryItemId(item.id);
                              }}
                              type="button"
                            >
                              {item.text}
                            </button>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            ) : activeQuestion.type === "transition_drop" && activeQuestionChoices.length > 0 ? (
              <div className="exam-transition-drop">
                <div
                  aria-label="Transition answer bank"
                  className="exam-transition-bank"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleTransitionBankDrop(activeQuestion, event)}
                >
                  {activeQuestionChoices
                    .filter((choice) => choice.id !== activeTransitionChoiceId)
                    .map((choice) => (
                      <button
                        className="exam-transition-chip"
                        draggable
                        key={choice.id}
                        onClick={() => handleChooseAnswer(activeQuestion.id, choice.id)}
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/plain", choice.id);
                        }}
                        type="button"
                      >
                        {choice.text}
                      </button>
                    ))}
                </div>

                <p className="exam-transition-sentence">
                  {activeQuestion.transitionSentenceNumber ? (
                    <span>{activeQuestion.transitionSentenceNumber}</span>
                  ) : null}
                  {activeQuestion.transitionBlankBefore}{" "}
                  <button
                    aria-label="Drop transition answer here"
                    className={`exam-transition-blank ${activeTransitionChoice ? "is-filled" : ""}`}
                    draggable={Boolean(activeTransitionChoice)}
                    onClick={() => {
                      if (activeTransitionChoice) {
                        setSelectedAnswers((currentAnswers) => {
                          const nextAnswers = { ...currentAnswers };
                          delete nextAnswers[activeQuestion.id];
                          return nextAnswers;
                        });
                      }
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(event) => {
                      if (activeTransitionChoice) {
                        event.dataTransfer.setData("text/plain", activeTransitionChoice.id);
                      }
                    }}
                    onDrop={(event) => handleTransitionChoiceDrop(activeQuestion, event)}
                    type="button"
                  >
                    {activeTransitionChoice?.text ?? ""}
                  </button>{" "}
                  {activeQuestion.transitionBlankAfter}
                </p>
              </div>
            ) : (
              <div className="exam-choice-list">
                {activeQuestion.type === "multi_select" && activeQuestionChoices.length > 0 ? (
                  activeQuestionChoices.map((choice) => (
                    <label
                      className={`exam-choice ${
                        activeQuestionEliminatedChoiceIds.includes(choice.id) ? "is-eliminated" : ""
                      }`}
                      key={choice.id}
                      onClick={(event) => {
                        if (activeTool === "eliminator") {
                          event.preventDefault();
                        }
                        if (window.getSelection()?.toString().trim()) {
                          return;
                        }
                        handleChoiceClick(activeQuestion, choice.id);
                      }}
                    >
                      <input
                        checked={activeQuestionSelectedChoiceIds.includes(choice.id)}
                        name={activeQuestion.id}
                        onChange={() => undefined}
                        type="checkbox"
                      />
                      <span>{choice.id}.</span>
                      <span
                        className="exam-highlightable"
                        data-highlight-key={`choice:${activeQuestion.id}:${choice.id}`}
                      >
                        {renderHighlightedText(choice.text, `choice:${activeQuestion.id}:${choice.id}`)}
                      </span>
                      {activeQuestionEliminatedChoiceIds.includes(choice.id) ? (
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
                  ))
                ) : activeQuestionChoices.length > 0 ? (
                  activeQuestionChoices.map((choice) => (
                    <label
                      className={`exam-choice ${
                        activeQuestionEliminatedChoiceIds.includes(choice.id) ? "is-eliminated" : ""
                      }`}
                      key={choice.id}
                      onClick={(event) => {
                        if (activeTool === "eliminator") {
                          event.preventDefault();
                        }
                        if (window.getSelection()?.toString().trim()) {
                          return;
                        }
                        handleChoiceClick(activeQuestion, choice.id);
                      }}
                    >
                      <input
                        checked={selectedAnswers[activeQuestion.id] === choice.id}
                        name={activeQuestion.id}
                        onChange={() => undefined}
                        type="radio"
                      />
                      <span>{choice.id}.</span>
                      <span
                        className="exam-highlightable"
                        data-highlight-key={`choice:${activeQuestion.id}:${choice.id}`}
                      >
                        {renderHighlightedText(choice.text, `choice:${activeQuestion.id}:${choice.id}`)}
                      </span>
                      {activeQuestionEliminatedChoiceIds.includes(choice.id) ? (
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
                  ))
                ) : (
                  <p className="exam-question-placeholder">This question type is not ready in the player yet.</p>
                )}
              </div>
            )}
          </form>
        </section>

        {choiceLimitWarnings.length > 0 ? (
          <section
            aria-label="Choice limit warnings"
            aria-live="polite"
            className="exam-choice-warning-stack"
          >
            {choiceLimitWarnings.map((warning) => (
              <article className="exam-choice-warning" key={warning.id}>
                <button
                  aria-label="Close warning"
                  onClick={() =>
                    setChoiceLimitWarnings((currentWarnings) =>
                      currentWarnings.filter((currentWarning) => currentWarning.id !== warning.id),
                    )
                  }
                  type="button"
                >
                  x
                </button>
                <p>
                  You are permitted a <strong>maximum of {warning.maxChoices} choices</strong> for this
                  question.
                </p>
                <p>Please unselect one of your choices before making another choice.</p>
              </article>
            ))}
            {choiceLimitWarnings.length > 1 ? (
              <button
                className="exam-choice-warning-close-all"
                onClick={() => setChoiceLimitWarnings([])}
                type="button"
              >
                [close all]
              </button>
            ) : null}
          </section>
        ) : null}

        {highlightToolbar ? (
          <div
            className="exam-highlight-toolbar"
            onMouseDown={(event) => event.preventDefault()}
            role="toolbar"
            style={{ left: highlightToolbar.x, top: highlightToolbar.y }}
          >
            <button
              aria-label="Remove highlights"
              className="is-clear"
              onClick={handleClearTextHighlights}
              type="button"
            >
              <span />
            </button>
            <button
              aria-label="Highlight blue"
              className="is-blue"
              onClick={() => handleApplyTextHighlight("blue")}
              type="button"
            >
              <span />
            </button>
            <button
              aria-label="Highlight pink"
              className="is-pink"
              onClick={() => handleApplyTextHighlight("pink")}
              type="button"
            >
              <span />
            </button>
          </div>
        ) : null}

        {isNotepadOpen ? (
          <section className="exam-notepad-window" aria-label="Notepad">
            <header>
              <h2>Notepad</h2>
              <button
                aria-label="Close notepad"
                onClick={() => {
                  setIsNotepadOpen(false);
                  setActiveTool("pointer");
                }}
                type="button"
              >
                x
              </button>
            </header>
            <textarea
              aria-label="Passage notes"
              autoFocus
              onChange={(event) => handleChangePassageNote(event.target.value)}
              value={passageNotes[activePassageSet.id] ?? ""}
            />
          </section>
        ) : null}

        {isUnansweredModalOpen ? (
          <div className="exam-attention-layer">
            <section
              aria-describedby="exam-attention-message"
              aria-labelledby="exam-attention-title"
              aria-modal="true"
              className="exam-attention-modal"
              role="alertdialog"
            >
              <header>
                <h2 id="exam-attention-title">Attention</h2>
                <button
                  aria-label="Close attention dialog"
                  className="exam-attention-close"
                  onClick={() => setIsUnansweredModalOpen(false)}
                  type="button"
                >
                  x
                </button>
              </header>
              <p id="exam-attention-message">
                You must answer all parts of the question before you can continue. You might need to scroll down
                to see what is unanswered.
              </p>
              <div className="exam-attention-actions">
                <button onClick={() => setIsUnansweredModalOpen(false)} type="button">
                  OK
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    );
  }

  return (
    <main className="exam-session-shell">
      <ExamToolbar
        assessmentLabel={assessmentLabel}
        breadcrumbCurrent="GENERAL DIRECTIONS"
        breadcrumbMiddle="GENERAL DIRECTIONS"
        {...fastForwardToolbarProps}
        onNext={() => {
          setHighlightToolbar(null);
          setActivePassageSetIndex(0);
          setActiveQuestionIndex(0);
          setSessionScreen("passageIntro");
        }}
        studentName={studentName}
      />

      <section className="exam-session-document" aria-labelledby="exam-session-title">
        <article className="exam-session-page">
          <header className="exam-session-page-header">
            <p>The New York City Department of Education</p>
            <h1 id="exam-session-title">Specialized High Schools Admissions Test</h1>
            <p>Grade 8</p>
          </header>

          <section className="exam-session-content-block">
            <h2>General Directions</h2>
            <p>
              This practice test has 100 questions across two subjects, English Language Arts and Mathematics.
            </p>

            <div className="exam-session-section-list">
              <p>
                <strong>PART 1 - ENGLISH LANGUAGE ARTS</strong>
                <strong>50 QUESTIONS</strong>
              </p>
              <p className="exam-session-question-range">Questions 1-50</p>

              <p>
                <strong>PART 2 - MATHEMATICS</strong>
                <strong>50 QUESTIONS</strong>
              </p>
              <p className="exam-session-question-range">Questions 51-100</p>
            </div>
          </section>

          <hr />

          <section className="exam-session-content-block">
            <h2>Planning Your Time</h2>
            <ul>
              <li>
                If the timer is enabled, your session will end after {formatDuration(assessment.durationMinutes)}.
              </li>
              <li>
                You should answer every question. For Math and stand-alone revising and editing items, you will
                not be able to return to a question after moving forward.
              </li>
              <li>
                For each ELA passage set, you may return to questions in that set until you advance past the final
                question in the set.
              </li>
              <li>
                Do not spend too much time on any one question. If you are unsure, choose the response you think
                is best.
              </li>
              <li>
                Complete the subject area you started before moving to the next subject area. Once submitted, that
                subject area will be locked.
              </li>
            </ul>
          </section>
        </article>
      </section>
    </main>
  );
}
