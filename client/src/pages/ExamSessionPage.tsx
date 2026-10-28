import { toolSetter, mergeToolLists, type SharedExamTools } from "../features/games/useTeamTools";
import { SharedToolNotes } from "../features/games/SharedToolNotes";
import { SentenceDragDrop } from '../components/SentenceDragDrop';
import { ExamSectionSubmission } from "../components/ExamSectionSubmission";
import { ExamTimeExpiredDialog } from "../components/ExamTimeExpiredDialog";
import { restoredReentryTimer } from "../../../server/src/shared/examReentry";
import { normalizeExamNavigation, type ExamNavigation } from "../../../server/src/shared/examNavigation";
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction, type DragEvent, type MouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getBoldFormattedText, renderMathAuthoredText, ExamMathQuestion, renderMathRichText, renderInlineMathText, MatrixChoiceResponse } from "../components/ExamMathQuestion";
import { PassageGlossary } from "../components/PassageGlossary";
import { isMathAnswerComplete } from "../../../server/src/shared/mathAnswer";
import "katex/dist/katex.min.css";

// Keep glossary anchors intact when the exam timer or answer state updates.
const AuthoredRichText = memo(function AuthoredRichText({ html, highlights }: { html: string; highlights?: TextHighlightRange[] }) {
  const displayHtml = useMemo(() => {
    if (!highlights?.length) return html;
    const container = document.createElement("span");
    container.innerHTML = html;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
    let offset = 0;
    for (const node of textNodes) {
      const value = node.data;
      const ranges = highlights.map(range => ({ ...range, start: Math.max(0, range.start - offset), end: Math.min(value.length, range.end - offset) })).filter(range => range.end > range.start);
      offset += value.length;
      if (!ranges.length) continue;
      const boundaries = [...new Set([0, value.length, ...ranges.flatMap(range => [range.start, range.end])])].sort((a, b) => a - b);
      const fragment = document.createDocumentFragment();
      boundaries.slice(0, -1).forEach((start, index) => {
        const end = boundaries[index + 1];
        const range = ranges.find(range => range.start <= start && range.end >= end);
        if (!range) fragment.append(document.createTextNode(value.slice(start, end)));
        else {
          const mark = document.createElement("mark");
          mark.className = `exam-text-highlight is-${range.color}`;
          mark.textContent = value.slice(start, end);
          fragment.append(mark);
        }
      });
      node.replaceWith(fragment);
    }
    return container.innerHTML;
  }, [html, highlights]);
  return <span className="exam-rich-text" dangerouslySetInnerHTML={{ __html: displayHtml }} />;
});
import {
  BatteryCharging,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Folder,
  List,
  MessageSquare,
  MousePointer2,
  Pause,
  Pencil,
  Play,
  Redo2,
  Trash2,
  Undo2,
  User,
  X,
} from "lucide-react";
import {
  resolveExamContent,
  type ExamContent,
  type ExamQuestion,
} from "../content/exams";
import { getExamSessionProgress, getLearningProgress, getStudentAssessment, getTeacherStudentProgress, saveCloudExamResult, saveExamSessionProgress, type TeacherAssessment } from "../lib/api";
import { getUserRole } from "../lib/auth";
import { formatDuration, getAssessmentIdFromPath, getDisplayName } from "../lib/exam";
import {
  getExamTimerDisplay,
  isExamTimeExpired,
  loadExamTimer,
  pauseExamTimer,
  resumeExamTimer,
  saveExamTimerState,
  type ExamTimerState,
} from "../lib/examTimer";
import {
  getExamSectionQuestionIds,
  getExamResumePosition,
  getExamSectionAccess,
  prepareSectionSubmission,
  getCurrentCompletedSections,
  getNextExamSubject,
  getOpenExamSubject,
  getStoredStartingSubject,
  isExamResultCompleteForContent,
  isExamSessionCompleteForContent,
  loadLocalExamSession,
  saveLocalExamSession,
  type ExamSection,
} from "../lib/examSessionProgress";
import {
  createExamResult,
  getExamResult,
  getAllExamQuestions,
  saveExamResult,
  type CategoryPlacements,
  type SelectedAnswer,
  type SelectedAnswers,
} from "../lib/examResults";
import { appendStudentPreview, getStudentPreviewContext } from "../lib/studentPreview";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

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
  | "sectionComplete"
  | "testOver";
type ReviewItemId = string;
type ReviewFilter = "all" | "notAnswered" | "bookmarks";
type ReviewItemKind = "directions" | "endSection" | "passageEnd" | "question";
type ReviewItemTarget =
  | { kind: "math"; questionIndex: number }
  | { kind: "passage"; passageSetIndex: number; questionIndex: number }
  | { kind: "standalone"; questionIndex: number };
type ReviewItem = {
  id: ReviewItemId;
  isAnswered?: boolean;
  isBookmarked?: boolean;
  kind: ReviewItemKind;
  label: string;
  target?: ReviewItemTarget;
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


type PencilPoint = {
  x: number;
  y: number;
};

type PencilStroke = {
  points: PencilPoint[];
};

const emptyPencilStrokes: PencilStroke[] = [];
type PencilDrawings = Record<string, PencilStroke[]>;
type PencilStorage = {
  drawings: PencilDrawings;
  peerDrawings?: PencilDrawings;
  shared?: boolean;
  redoStacks: PencilDrawings;
  setDrawings: Dispatch<SetStateAction<PencilDrawings>>;
  setRedoStacks: Dispatch<SetStateAction<PencilDrawings>>;
};

function QuestionTimeTracker({
  onElapsed,
  questionId,
}: {
  onElapsed: (questionId: string, seconds: number) => void;
  questionId: string;
}) {
  useEffect(() => {
    let startedAt = document.visibilityState === "visible" ? performance.now() : null;
    const commitElapsed = () => {
      if (startedAt === null) return;
      const now = performance.now();
      const seconds = (now - startedAt) / 1000;
      startedAt = now;
      if (seconds > 0) onElapsed(questionId, seconds);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        commitElapsed();
        startedAt = null;
      } else {
        startedAt = performance.now();
      }
    };
    const interval = window.setInterval(commitElapsed, 1_000);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      commitElapsed();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onElapsed, questionId]);
  return null;
}

function isTextEntryQuestion(question: ExamQuestion) {
  return (
    question.type === "short_response" ||
    question.type === "expression_entry" ||
    question.type === "numeric_entry" ||
    question.type === "grid_in"
  );
}

function usesMathEntryKeypad(question: ExamQuestion) {
  return question.type === "numeric_entry" || question.type === "expression_entry" || question.type === "grid_in";
}

function isInlineDropdownQuestion(question: ExamQuestion) {
  return question.type === "inline_dropdown";
}

function getRequiredSelectionCount(question: ExamQuestion) {
  return question.requiredSelections ?? question.correctPointIds?.length ?? question.correctChoiceIds?.length ?? 2;
}

function getSelectedChoiceIds(answer: SelectedAnswer | undefined) {
  if (Array.isArray(answer)) {
    return answer;
  }

  return typeof answer === "string" && answer ? [answer] : [];
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

  if (question.type === "graph_point_select") return getSelectedChoiceIds(selectedAnswers[question.id]).length > 0;
  if (question.type === "multi_select") {
    return getSelectedChoiceIds(selectedAnswers[question.id]).length >= getRequiredSelectionCount(question);
  }

  if (question.type === 'transition_drop' && question.dragDropSlots?.length === 1 && typeof selectedAnswers[question.id] === 'string') return Boolean(selectedAnswers[question.id]);
  if (question.type === "math_drag_drop" || question.type === "transition_drop" && question.dragDropSlots?.length) {
    const placements = getCategoryPlacements(selectedAnswers[question.id]);
    const slots = question.dragDropSlots ?? [];
    return slots.length > 0 && slots.every((slot) => Boolean(placements[slot.id]));
  }

  if (question.type === "number_line_response") {
    const response = getCategoryPlacements(selectedAnswers[question.id]);
    return Boolean(response.direction && response.endpoint && response.value !== undefined);
  }

  if (["category_sort", "matrix_choice", "table_match"].includes(question.type)) {
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

    return typeof answer === "string" && (usesMathEntryKeypad(question) ? isMathAnswerComplete(answer) : answer.trim().length > 0);
  }

  return true;
}

function getRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function createRandomQuestionAnswer(question: ExamQuestion): SelectedAnswer {
  if (question.type === "transition_drop" && question.dragDropSlots?.length) {
    const available = [...(question.choices || [])];
    return Object.fromEntries(question.dragDropSlots.map(slot => { const item = getRandomItem(available); if (!question.allowReuse && item) available.splice(available.indexOf(item), 1); return [slot.id, item?.id || ""]; }));
  }
  if (question.type === "multiple_choice" || question.type === "transition_drop") {
    return getRandomItem(question.choices ?? [])?.id ?? "preview-answer";
  }

  if (question.type === "multi_select" || question.type === "graph_point_select") {
    const choiceIds = (question.choices ?? []).map((choice) => choice.id);
    const graphPointIds = question.graph?.points.map((point) => point.id) ?? [];
    const selectableIds = choiceIds.length ? choiceIds : graphPointIds;
    const selectionCount = Math.min(getRequiredSelectionCount(question), selectableIds.length);

    return [...selectableIds].sort(() => Math.random() - 0.5).slice(0, selectionCount);
  }

  if (question.type === "math_drag_drop") {
    const itemIds = (question.items ?? []).map((item) => item.id);
    return Object.fromEntries(
      (question.dragDropSlots ?? []).map((slot) => [slot.id, getRandomItem(itemIds) ?? "preview-item"]),
    );
  }

  if (question.type === "number_line_response") {
    const config = question.numberLineResponse;
    return {
      direction: Math.random() > 0.5 ? "right" : "left",
      endpoint: Math.random() > 0.5 ? "closed" : "open",
      value: String(config?.min ?? 0),
    };
  }

  if (["category_sort", "matrix_choice", "table_match"].includes(question.type)) {
    const categoryIds = (question.categories ?? []).map((category) => category.id);
    const items = [...(question.items ?? [])].sort(() => Math.random() - 0.5);
    const placementCount = Math.min(question.requiredPlacements ?? items.length, items.length);
    const randomizedCategoryIds =
      question.categoryCapacity === 1
        ? [...categoryIds].sort(() => Math.random() - 0.5)
        : categoryIds;

    return Object.fromEntries(
      items
        .slice(0, placementCount)
        .map((item, index) => [
          item.id,
          question.categoryCapacity === 1
            ? randomizedCategoryIds[index] ?? "preview-category"
            : getRandomItem(categoryIds) ?? "preview-category",
        ]),
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

  if (
    question.type === "short_response" ||
    question.type === "expression_entry" ||
    question.type === "numeric_entry" ||
    question.type === "grid_in"
  ) {
    return String(Math.floor(Math.random() * 100));
  }

  return "Teacher preview response";
}

function getStoredExamName(assessmentId: string, fallbackName: string) {
  const storedName = window.sessionStorage.getItem(`exam-student-name:${assessmentId}`);
  return storedName?.trim() || fallbackName;
}

function getAssessmentDashboardHref() {
  const previewContext = getStudentPreviewContext();
  return previewContext.mode === "teacher"
    ? previewContext.returnHref
    : appendStudentPreview("/study-hall/shsat/assessments", previewContext);
}

function ExamUserMenu({
  isOpen = false,
  onPauseTimer,
  onToggle,
  studentName,
}: {
  isOpen?: boolean;
  onPauseTimer?: () => void;
  onToggle?: () => void;
  studentName: string;
}) {
  return (
    <div className="exam-module-user">
      <span>{studentName}</span>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
        type="button"
        aria-label="User menu"
      >
        <User aria-hidden="true" size={14} fill="currentColor" strokeWidth={2.2} />
        <ChevronDown aria-hidden="true" size={12} strokeWidth={2.4} />
      </button>
      {isOpen && onPauseTimer ? (
        <div className="exam-user-menu-dropdown" role="menu">
          <button onClick={onPauseTimer} role="menuitem" type="button">
            <Pause aria-hidden="true" size={15} strokeWidth={2.2} />
            Pause timer
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ExamModuleHeader({
  isUserMenuOpen,
  onPauseTimer,
  onToggleUserMenu,
  studentName,
  onTimeExpiredSubmit,
}: {
  isUserMenuOpen?: boolean;
  onPauseTimer?: () => void;
  onToggleUserMenu?: () => void;
  studentName: string;
  onTimeExpiredSubmit?: () => Promise<void>;
}) {
  return (
    <>
      <header className="exam-module-header">
        <a className="exam-module-brand" href={getAssessmentDashboardHref()}>
          Nathan Tutors
        </a>
        <ExamUserMenu
          isOpen={isUserMenuOpen}
          onPauseTimer={onPauseTimer}
          onToggle={onToggleUserMenu}
          studentName={studentName}
        />
      </header>
      <div className="exam-module-bluebar" />
      <div className="exam-module-shadow" />
      {onTimeExpiredSubmit && <ExamTimeExpiredDialog onSubmit={onTimeExpiredSubmit} />}
    </>
  );
}

function ExamExhibits({ showExhibits = false }: { showExhibits?: boolean }) {
  const [isExhibitsOpen, setIsExhibitsOpen] = useState(false);

  return (
    <>
      {showExhibits ? (
        <button
          aria-expanded={isExhibitsOpen}
          className="exam-exhibits-toggle"
          onClick={() => setIsExhibitsOpen(true)}
          type="button"
        >
          <span>Exhibits</span>
          <Folder aria-hidden="true" fill="currentColor" size={19} />
        </button>
      ) : null}

      {isExhibitsOpen ? (
        <div className="exam-exhibits-layer">
          <section aria-labelledby="exam-exhibits-title" aria-modal="true" className="exam-exhibits-dialog" role="dialog">
            <header>
              <h2 id="exam-exhibits-title">Exhibits</h2>
              <button aria-label="Close exhibits" onClick={() => setIsExhibitsOpen(false)} type="button">
                x
              </button>
            </header>
            <div className="exam-exhibits-tabs"><span>Exhibit 1</span></div>
            <div className="exam-exhibits-content">
              <p>Reference materials provided for a question will appear in this window.</p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function PencilWorkspace({
  active,
  drawingKey = "exam",
  contained = false,
  onDeactivate,
  storage,
}: {
  active: boolean;
  drawingKey?: string;
  contained?: boolean;
  onDeactivate?: () => void;
  storage: PencilStorage;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [canvasVersion, setCanvasVersion] = useState(0);
  const [controlsHost, setControlsHost] = useState<HTMLElement | null>(null);
  const { drawings, peerDrawings, setDrawings, redoStacks, setRedoStacks } = storage;
  const peerStrokes = peerDrawings?.[drawingKey] ?? emptyPencilStrokes;
  const [anchorBounds, setAnchorBounds] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const shared = Boolean(storage.shared);
  useEffect(() => {
    // Keep controls in the player's stacking context when it opens as an overlay.
    setControlsHost(canvasRef.current?.closest<HTMLElement>('dialog, .mc-exam-viewer, .mc-mini-viewport') ?? document.body);
  }, []);
  useEffect(() => {
    if (!shared || contained) return;
    const panel = canvasRef.current?.closest(".game-exam-player")?.querySelector(".exam-math-panel, .exam-standalone-panel");
    if (!panel) return;
    const measure = () => { const { left, top, width, height } = panel.getBoundingClientRect(); setAnchorBounds({ left, top, width, height }); };
    const observer = new ResizeObserver(measure); observer.observe(panel);
    window.addEventListener("scroll", measure, true); window.addEventListener("resize", measure); measure();
    return () => { observer.disconnect(); window.removeEventListener("scroll", measure, true); window.removeEventListener("resize", measure); };
  }, [shared, contained, drawingKey]);
  const strokes = drawings[drawingKey] ?? emptyPencilStrokes;
  const redoStrokes = redoStacks[drawingKey] ?? emptyPencilStrokes;

  useEffect(() => {
    const handleResize = () => setCanvasVersion((version) => version + 1);
    const observer = new ResizeObserver(handleResize);
    if (canvasRef.current) observer.observe(canvasRef.current);
    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    isDrawingRef.current = false;
  }, [active, drawingKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 2.4;
    context.strokeStyle = "#151515";
    for (const stroke of [...strokes, ...peerStrokes]) {
      if (!stroke.points.length) continue;
      context.beginPath();
      const firstPoint = stroke.points[0];
      context.moveTo(firstPoint.x * width, firstPoint.y * height);
      for (const point of stroke.points.slice(1)) {
        context.lineTo(point.x * width, point.y * height);
      }
      if (stroke.points.length === 1) {
        context.lineTo(firstPoint.x * width + 0.01, firstPoint.y * height + 0.01);
      }
      context.stroke();
    }
  }, [canvasVersion, drawingKey, strokes, peerStrokes]);

  function pointFromEvent(event: ReactPointerEvent<HTMLCanvasElement>): PencilPoint {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
    };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!active || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    const point = pointFromEvent(event);
    setDrawings((current) => ({
      ...current,
      [drawingKey]: [...(current[drawingKey] ?? []), { points: [point] }],
    }));
    setRedoStacks((current) => ({ ...current, [drawingKey]: [] }));
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!active || !isDrawingRef.current) return;
    event.preventDefault();
    const point = pointFromEvent(event);
    setDrawings((current) => {
      const currentStrokes = current[drawingKey] ?? [];
      const activeStroke = currentStrokes.at(-1);
      if (!activeStroke) return current;
      const previousPoint = activeStroke.points.at(-1);
      if (previousPoint && Math.abs(previousPoint.x - point.x) + Math.abs(previousPoint.y - point.y) < 0.0008) {
        return current;
      }
      return {
        ...current,
        [drawingKey]: [
          ...currentStrokes.slice(0, -1),
          { points: [...activeStroke.points, point] },
        ],
      };
    });
  }

  function finishStroke(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function undo() {
    const stroke = strokes.at(-1);
    if (!stroke) return;
    setDrawings((current) => ({ ...current, [drawingKey]: (current[drawingKey] ?? []).slice(0, -1) }));
    setRedoStacks((current) => ({ ...current, [drawingKey]: [...(current[drawingKey] ?? []), stroke] }));
  }

  function redo() {
    const stroke = redoStrokes.at(-1);
    if (!stroke) return;
    setRedoStacks((current) => ({ ...current, [drawingKey]: (current[drawingKey] ?? []).slice(0, -1) }));
    setDrawings((current) => ({ ...current, [drawingKey]: [...(current[drawingKey] ?? []), stroke] }));
  }

  function clear() {
    if (!strokes.length) return;
    setDrawings((current) => ({ ...current, [drawingKey]: [] }));
    setRedoStacks((current) => ({ ...current, [drawingKey]: [] }));
  }

  return (
    <>
    <div className={`exam-pencil-layer ${contained ? "is-contained" : ""} ${active ? "is-active" : ""}`} style={shared && !contained && anchorBounds ? { inset: "auto", ...anchorBounds } : undefined}>
      <canvas
        aria-hidden="true"
        className="exam-pencil-canvas"
        onPointerCancel={finishStroke}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishStroke}
        onLostPointerCapture={() => { isDrawingRef.current = false; }}
        ref={canvasRef}
      />
    </div>
      {active ? createPortal(
        <div aria-label="Pencil controls" className="exam-pencil-controls" role="toolbar">
          <button aria-label="Turn off pencil" aria-pressed="true" className="is-active" onClick={onDeactivate} type="button">
            <Pencil aria-hidden="true" size={20} strokeWidth={2.2} />
          </button>
          <button aria-label="Undo pencil stroke" disabled={!strokes.length} onClick={undo} type="button">
            <Undo2 aria-hidden="true" size={20} strokeWidth={2.2} />
          </button>
          <button aria-label="Redo pencil stroke" disabled={!redoStrokes.length} onClick={redo} type="button">
            <Redo2 aria-hidden="true" size={20} strokeWidth={2.2} />
          </button>
          <button aria-label="Clear pencil marks" disabled={!strokes.length} onClick={clear} type="button">
            <Trash2 aria-hidden="true" size={19} strokeWidth={2.2} />
          </button>
        </div>, controlsHost ?? document.body
      ) : null}
    </>
  );
}

export function ExamToolbar({
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
  sectionSubmission,
  onPauseTimer,
  onPrevious,
  onReviewFilterChange,
  onReviewItemSelect,
  onSelectTool,
  onSpeedFinish,
  onToggleFastForward,
  onToggleReview,
  onToggleBookmark,
  onToggleTimer,
  onToggleUserMenu,
  pencilKey,
  pencilStorage,
  pencilInPassage = false,
  reviewFilter = "all",
  reviewItems = [],
  reviewQuestionCount = 0,
  questionProgress,
  showExhibits = false,
  showReviewTools = true,
  showStatusIcon = true,
  showTimer = true,
  showWorkTools = true,
  canEliminate = true,
  isTimerOvertime = false,
  isTimerVisible = false,
  isUserMenuOpen = false,
  timerText = "3:00:00",
  unansweredCount = 0,
  studentName,
  sessionStats,
  exitLabel = "Pause timer",
  onTimeExpiredSubmit,
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
  isTimerOvertime?: boolean;
  isTimerVisible?: boolean;
  isUserMenuOpen?: boolean;
  sectionSubmission?: { section: ExamSection; answered: number; total: number; disabled: boolean; finishesExam?: boolean; onSubmit: () => Promise<void> };
  onNext?: () => void;
  onPauseTimer?: () => void;
  onPrevious?: () => void;
  onReviewFilterChange?: (filter: ReviewFilter) => void;
  onReviewItemSelect?: (itemId: ReviewItemId) => void;
  onSelectTool?: (tool: ExamTool) => void;
  onSpeedFinish?: () => void;
  onToggleFastForward?: () => void;
  onToggleReview?: () => void;
  onToggleBookmark?: () => void;
  onToggleTimer?: () => void;
  onToggleUserMenu?: () => void;
  pencilKey?: string;
  pencilStorage?: PencilStorage;
  pencilInPassage?: boolean;
  reviewFilter?: ReviewFilter;
  reviewItems?: ReviewItem[];
  reviewQuestionCount?: number;
  questionProgress?: { answered: number; total: number };
  showExhibits?: boolean;
  showReviewTools?: boolean;
  showStatusIcon?: boolean;
  showTimer?: boolean;
  showWorkTools?: boolean;
  canEliminate?: boolean;
  timerText?: string;
  unansweredCount?: number;
  studentName: string;
  sessionStats?: ReactNode;
  exitLabel?: string;
  onTimeExpiredSubmit?: () => Promise<void>;
}) {
  const progress = questionProgress ?? { answered: reviewQuestionCount - unansweredCount, total: reviewQuestionCount };
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
                  aria-expanded={isReviewOpen}
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
                            aria-current={currentReviewItemId === item.id ? "step" : undefined}
                            aria-label={item.kind === "question" ? `${item.label}, ${item.isAnswered ? "answered" : "not answered"}${item.isBookmarked ? ", bookmarked" : ""}` : item.label}
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
                  disabled={!canEliminate}
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
            {sessionStats}
            {sectionSubmission && <ExamSectionSubmission {...sectionSubmission} />}
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
              <div
                className={`exam-session-timer ${isTimerVisible ? "is-visible" : ""} ${
                  isTimerOvertime ? "is-overtime" : ""
                }`}
              >
                {isTimerVisible ? (
                  <output aria-label={isTimerOvertime ? "Overtime elapsed" : "Time remaining"}>
                    {timerText}
                  </output>
                ) : null}
                <button
                  aria-label={isTimerVisible ? "Hide timer" : "Show timer"}
                  className="exam-session-timer-button"
                  data-tooltip={isTimerVisible ? "Hide Timer" : "Show Timer"}
                  onClick={onToggleTimer}
                  type="button"
                >
                  <Clock3 aria-hidden="true" size={16} strokeWidth={2.2} />
                </button>
              </div>
            ) : null}
            <span className="exam-session-user-name">{studentName}</span>
            <div className="exam-session-user-menu-wrap">
              <button
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                className="exam-session-user-button"
                onClick={onToggleUserMenu}
                type="button"
                aria-label="User menu"
              >
                <User aria-hidden="true" size={14} fill="currentColor" strokeWidth={2.2} />
                <ChevronDown aria-hidden="true" size={12} strokeWidth={2.4} />
              </button>
              {isUserMenuOpen && onPauseTimer ? (
                <div className="exam-user-menu-dropdown" role="menu">
                  <button onClick={onPauseTimer} role="menuitem" type="button">
                    <Pause aria-hidden="true" size={15} strokeWidth={2.2} />
                    {exitLabel}
                  </button>
                </div>
              ) : null}
            </div>
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
            {progress.total > 0 && <span className="exam-session-progress"><progress aria-label="Questions answered" max={progress.total} value={progress.answered} /><span>{Math.round(progress.answered / progress.total * 100)}%</span></span>}
          </div>
          {showStatusIcon ? (
            <span className="exam-session-status-icon" aria-label="Current battery level 100%">
              <BatteryCharging size={20} strokeWidth={2.2} />
              <small>100%</small>
            </span>
          ) : null}
        </div>
      </nav>
      {showWorkTools ? <ExamExhibits showExhibits={showExhibits} /> : null}
      {showWorkTools && pencilStorage && !pencilInPassage ? <PencilWorkspace active={activeTool === "pencil"} drawingKey={pencilKey} storage={pencilStorage} onDeactivate={() => onSelectTool?.("pointer")} /> : null}
      {onTimeExpiredSubmit && <ExamTimeExpiredDialog onSubmit={onTimeExpiredSubmit} />}
    </>
  );
}

export type ExamGameSession = {
  assessment: TeacherAssessment; content: ExamContent; studentName: string;
  screen: "mathQuestion" | "passage" | "standaloneQuestion";
  answers: SelectedAnswers; onAnswersChange: (answers: SelectedAnswers) => void;
  onSubmit: (answers: SelectedAnswers) => Promise<boolean>; timerText: string;
  hideTimer?: boolean;
  subjectPosition: { current: number; total: number };
  sharedTools?: SharedExamTools;
  lockedQuestionIds?: string[];
  onCurrentQuestionChange?: (questionId: string | null) => void;
  teamNavigation?: { step: number; onNext: () => void; onReview: (step: number) => void };
  practice?: { stats: ReactNode; feedback: ReactNode; onExit: () => void; exitLabel?: string; result?: 'correct' | 'incorrect' };
};

export function ExamSessionPage({ gameSession }: { gameSession?: ExamGameSession } = {}) {
  const isGameSession = Boolean(gameSession);
  const AnswerLock = gameSession ? "fieldset" : Fragment;
  const [pencilDrawings, setLocalPencilDrawings] = useState<PencilDrawings>({});
  const [pencilRedoStacks, setPencilRedoStacks] = useState<PencilDrawings>({});
  const sharedTools = gameSession?.sharedTools;
  const setPencilDrawings = toolSetter(sharedTools, "drawings", setLocalPencilDrawings);
  const pencilStorage: PencilStorage = { shared: Boolean(sharedTools), drawings: sharedTools?.own.drawings ?? pencilDrawings, peerDrawings: sharedTools ? mergeToolLists({}, sharedTools.peers.map(peer => peer.state.drawings)) : undefined, redoStacks: pencilRedoStacks, setDrawings: setPencilDrawings, setRedoStacks: setPencilRedoStacks };
  const [accessToken, setAccessToken] = useState("");
  const [assessment, setAssessment] = useState<TeacherAssessment | null>(gameSession?.assessment ?? null);
  const [attemptContent, setAttemptContent] = useState<ExamContent | null>(gameSession?.content ?? null);
  const [activeTool, setActiveTool] = useState<ExamTool>("pointer");
  const [activeMathQuestionIndex, setActiveMathQuestionIndex] = useState(0);
  const [activePassageSetIndex, setActivePassageSetIndex] = useState(0);
  const [localQuestionIndex, setActiveQuestionIndex] = useState(0);
  const activeQuestionIndex = gameSession?.teamNavigation ? Math.min(gameSession.teamNavigation.step, Math.max(0, (gameSession.content.passageSets[0]?.questions.length ?? 1) - 1)) : localQuestionIndex;
  const [activeStandaloneQuestionIndex, setActiveStandaloneQuestionIndex] = useState(0);
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([]);
  const [choiceLimitWarnings, setChoiceLimitWarnings] = useState<ChoiceLimitWarning[]>([]);
  const [completedSections, setCompletedSections] = useState<ExamSection[]>([]);
  const [submittedSection, setSubmittedSection] = useState<ExamSection>("math");
  const sectionDatesRef = useRef<Partial<Record<ExamSection, string>>>({});
  const attemptIdRef = useRef<string>(crypto.randomUUID());
  const [localEliminatedChoices, setLocalEliminatedChoices] = useState<EliminatedChoices>({});
  const eliminatedChoices = sharedTools ? mergeToolLists(sharedTools.own.eliminated, sharedTools.peers.map(peer => peer.state.eliminated)) : localEliminatedChoices;
  const setEliminatedChoices = toolSetter(sharedTools, "eliminated", setLocalEliminatedChoices);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlightToolbar, setHighlightToolbar] = useState<HighlightToolbarState | null>(null);
  const [isFastForwardEnabled, setIsFastForwardEnabled] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(!isGameSession && isSupabaseConfigured);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);
  const [hasSubmittedAttempt, setHasSubmittedAttempt] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [isUnansweredModalOpen, setIsUnansweredModalOpen] = useState(false);
  const [isTeacherPreviewSession, setIsTeacherPreviewSession] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [localPassageNotes, setLocalPassageNotes] = useState<PassageNotes>({});
  const passageNotes = sharedTools?.own.notes ?? localPassageNotes;
  const setPassageNotes = toolSetter(sharedTools, "notes", setLocalPassageNotes);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [examAnswers, setExamAnswers] = useState<SelectedAnswers>({});
  const selectedAnswers = gameSession?.answers ?? examAnswers;
  const setSelectedAnswers: Dispatch<SetStateAction<SelectedAnswers>> = useCallback(value => {
    if (gameSession) {
      const next = { ...(typeof value === "function" ? value(gameSession.answers) : value) };
      for (const id of gameSession.lockedQuestionIds ?? []) { if (gameSession.answers[id] === undefined) delete next[id]; else next[id] = gameSession.answers[id]; }
      gameSession.onAnswersChange(next);
    }
    else setExamAnswers(value);
  }, [gameSession]);
  const [selectedCategoryItemId, setSelectedCategoryItemId] = useState("");
  const [localSessionScreen, setSessionScreen] = useState<SessionScreen>(gameSession?.screen ?? "directions");
  const sessionScreen = gameSession?.teamNavigation
    ? gameSession.screen === "passage" && gameSession.teamNavigation.step >= (gameSession.content.passageSets[0]?.questions.length ?? 0) ? "passageEnd" : gameSession.screen
    : localSessionScreen;
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState(gameSession?.studentName ?? "Student");
  const [localTextHighlights, setLocalTextHighlights] = useState<TextHighlights>({});
  const textHighlights = sharedTools ? mergeToolLists(sharedTools.own.highlights, sharedTools.peers.map(peer => peer.state.highlights)) : localTextHighlights;
  const setTextHighlights = toolSetter(sharedTools, "highlights", setLocalTextHighlights);
  const peerNotesSignature = JSON.stringify(sharedTools?.peers.filter(peer => Object.values(peer.state.notes).some(Boolean)).map(peer => ({ playerId: peer.playerId, notes: peer.state.notes })) ?? []);
  const previousPeerNotes = useRef(peerNotesSignature);
  useEffect(() => { if (previousPeerNotes.current !== peerNotesSignature) { previousPeerNotes.current = peerNotesSignature; setIsNotepadOpen(true); } }, [peerNotesSignature]);
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const [timerState, setTimerState] = useState<ExamTimerState | null>(null);
  const autosaveInFlightRef = useRef(false);
  const autosavePromiseRef = useRef<Promise<void> | null>(null);
  const finalSubmissionRef = useRef(false);
  const latestAnswersRef = useRef<SelectedAnswers>({});
  const navigationRef = useRef<ExamNavigation | undefined>(undefined);
  const lastAutosaveSignatureRef = useRef("");
  const questionTimesRef = useRef<Record<string, number>>({});
  const recordQuestionTime = useCallback((questionId: string, seconds: number) => {
    questionTimesRef.current[questionId] = (questionTimesRef.current[questionId] ?? 0) + seconds;
  }, []);
  const getQuestionTimesSnapshot = useCallback(() => Object.fromEntries(
    Object.entries(questionTimesRef.current).map(([questionId, seconds]) => [questionId, Math.max(1, Math.round(seconds))]),
  ), []);

  useEffect(() => {
    if (isGameSession || !isSupabaseConfigured) {
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

      const previewContext = getStudentPreviewContext();
      const fallbackName = previewContext.studentName || getDisplayName(data.session.user);
      const storedStartingSubject = getStoredStartingSubject(assessmentId);
      let hadLocalTimer = false;
      try { hadLocalTimer = Boolean(window.localStorage.getItem(`exam-timer:${assessmentId}`)); } catch { /* Cloud timer can restore without device storage. */ }
      setTimerState(loadExamTimer(assessmentId));
      setTimerNow(Date.now());
      setStudentId(data.session.user.id);
      setAccessToken(data.session.access_token);
      setStudentName(getStoredExamName(assessmentId, fallbackName));
      const isTeacherPreview = previewContext.isPreview && getUserRole(data.session.user) === "teacher";
      setIsTeacherPreviewSession(isTeacherPreview);
      setIsFastForwardEnabled(isTeacherPreview && previewContext.mode === "teacher");

      try {
        const nextAssessment = await getStudentAssessment(data.session.access_token, assessmentId);
        let nextStartingSubject = storedStartingSubject;
        const localProgress = isTeacherPreview ? null : loadLocalExamSession(data.session.user.id, assessmentId);
        let progress = localProgress;
        let savedResult = isTeacherPreview ? null : getExamResult(data.session.user.id, assessmentId);
        if (isTeacherPreview && previewContext.studentId) {
          const previewStudent = (await getTeacherStudentProgress(data.session.access_token))
            .find((student) => student.id === previewContext.studentId);
          progress = previewStudent?.examSessions[assessmentId] ?? null;
          savedResult = (previewStudent?.progress.examResults.find(
            (candidate) => candidate.assessmentId === assessmentId,
          ) as unknown as NonNullable<ReturnType<typeof getExamResult>> | undefined) ?? null;
        } else if (!isTeacherPreview) {
          try {
            const [cloudSessions, cloudLearningProgress] = await Promise.all([
              getExamSessionProgress(data.session.access_token),
              getLearningProgress(data.session.access_token),
            ]);
            const cloudSession = cloudSessions[assessmentId];
            progress =
              cloudSession &&
              (!localProgress || Date.parse(cloudSession.updatedAt) >= Date.parse(localProgress.updatedAt))
                ? {
                  ...cloudSession,
                  ...(localProgress?.questionTimes ? { questionTimes: localProgress.questionTimes } : {}),
                }
                : localProgress;
            savedResult =
              (cloudLearningProgress.examResults.find((candidate) => candidate.assessmentId === assessmentId) as unknown as
                NonNullable<ReturnType<typeof getExamResult>> | undefined) ??
              savedResult;
          } catch {
            if (nextAssessment.reentry) throw new Error("Could not load the saved submission. Please reconnect and reload before editing reopened sections.");
            // Continue with the locally saved English answers when cloud sync is unavailable.
          }
        }
        setHasSubmittedAttempt(Boolean(savedResult));
        const reentry = !isTeacherPreview ? nextAssessment.reentry : undefined;
        if (reentry && progress && Date.parse(progress.updatedAt) < Date.parse(reentry.draftsFrom ?? reentry.grantedAt)) progress = null;
        if (savedResult && progress && !isTeacherPreview) {
          const submittedIds = getExamSectionQuestionIds(savedResult.analysisContent ?? resolveExamContent(nextAssessment));
          const savedSections = (savedResult.completedSections ?? []).filter(section => !reentry?.remainingSections.includes(section) && (!nextAssessment.canEditSubmittedSections || !nextAssessment.sectionAccess[section]));
          const protectedAnswers = Object.fromEntries(savedSections.flatMap(section => submittedIds[section].filter(id => Object.hasOwn(savedResult!.answers, id)).map(id => [id, savedResult!.answers[id]])));
          progress = { ...progress, answers: { ...savedResult.answers, ...progress.answers, ...protectedAnswers }, completedSections: [...new Set([...progress.completedSections, ...savedSections])] };
        }
        if (!progress && savedResult) {
          progress = {
            answers: savedResult.answers,
            completedSections: savedResult.completedSections,
            status: savedResult.completionStatus === "complete" ? "submitted" : "in_progress",
            submittedAt: savedResult.completedAt,
            updatedAt: savedResult.completedAt,
            ...(savedResult.questionTimes ? { questionTimes: savedResult.questionTimes } : {}),
          };
        }
        sectionDatesRef.current = savedResult?.sectionCompletedAt ?? {};
        if (reentry) {
          const timerGrantKey = `exam-reentry-timer:${data.session.user.id}:${assessmentId}`;
          let timerGrantId: string | null = null;
          try { timerGrantId = window.localStorage.getItem(timerGrantKey); } catch { /* Restore from the server. */ }
          if (timerGrantId !== reentry.id || !hadLocalTimer) {
            const restoredTimer = restoredReentryTimer(reentry, savedResult);
            saveExamTimerState(assessmentId, restoredTimer); setTimerState(restoredTimer);
            try { window.localStorage.setItem(timerGrantKey, reentry.id); } catch { /* Keep the restored in-memory timer. */ }
          }
          sectionDatesRef.current = Object.fromEntries(Object.entries(sectionDatesRef.current).filter(([section]) => !reentry.remainingSections.includes(section as ExamSection)));
        }
        if (savedResult?.timerState && !isTeacherPreview && !hadLocalTimer && !reentry) { saveExamTimerState(assessmentId, savedResult.timerState); setTimerState(savedResult.timerState); }
        const examContent = nextAssessment.resumeContent ?? savedResult?.analysisContent ?? resolveExamContent(nextAssessment);
        const hasCompletedAttempt =
          isExamSessionCompleteForContent(examContent, progress) ||
          isExamResultCompleteForContent(savedResult, examContent);
        if (
          !isTeacherPreview &&
          hasCompletedAttempt &&
          !nextAssessment.allowCompletedAccess && !reentry
        ) {
          window.location.assign(getAssessmentDashboardHref());
          return;
        }
        const isReopeningCompletedAttempt =
          !isTeacherPreview && hasCompletedAttempt && nextAssessment.allowCompletedAccess && !nextAssessment.canEditSubmittedSections && !reentry;
        attemptIdRef.current = isReopeningCompletedAttempt ? crypto.randomUUID() : savedResult ? savedResult.attemptId ?? `legacy:${assessmentId}:${savedResult.completedAt}` : attemptIdRef.current;
        if (nextAssessment.resumeContent) setAttemptContent(nextAssessment.resumeContent);
        else if (!isReopeningCompletedAttempt && savedResult?.analysisContent) setAttemptContent(savedResult.analysisContent);
        const effectiveSectionAccess = getExamSectionAccess(
          examContent,
          isTeacherPreview ? { english: true, math: true } : nextAssessment.sectionAccess,
        );
        const savedCompletedSections = getCurrentCompletedSections(examContent, progress).filter(section => !reentry?.remainingSections.includes(section));
        const currentCompletedSections = isReopeningCompletedAttempt || nextAssessment.canEditSubmittedSections
          ? savedCompletedSections.filter((section) => !effectiveSectionAccess[section])
          : savedCompletedSections;
        setCompletedSections(currentCompletedSections);
        const requestedSubject = new URLSearchParams(window.location.search).get("subject");
        const resumeSubject = requestedSubject === "english" || requestedSubject === "math"
          ? requestedSubject : progress?.navigation?.subject ?? storedStartingSubject;
        const preferredStartingSubject = isReopeningCompletedAttempt || nextAssessment.canEditSubmittedSections
          ? resumeSubject
          : getNextExamSubject(resumeSubject, currentCompletedSections);
        const openStartingSubject = getOpenExamSubject(
          preferredStartingSubject,
          { english: effectiveSectionAccess.english && !currentCompletedSections.includes("english"), math: effectiveSectionAccess.math && !currentCompletedSections.includes("math") },
        );
        if (!openStartingSubject) {
          window.location.assign(getAssessmentDashboardHref());
          return;
        }
        nextStartingSubject = openStartingSubject;
        if (progress) {
          setSelectedAnswers((progress.answers ?? {}) as SelectedAnswers);
          if (progress.questionTimes && typeof progress.questionTimes === "object") {
            questionTimesRef.current = Object.fromEntries(Object.entries(progress.questionTimes).filter(([, seconds]) => Number.isFinite(seconds) && seconds > 0));
          }
        }
        navigationRef.current = normalizeExamNavigation(progress?.navigation);
        const resume = getExamResumePosition(examContent, nextStartingSubject, progress);
        setActivePassageSetIndex(resume.passageIndex);
        setActiveQuestionIndex(resume.questionIndex);
        setActiveStandaloneQuestionIndex(resume.questionIndex);
        setActiveMathQuestionIndex(resume.questionIndex);
        try { window.sessionStorage.setItem(`exam-start-subject:${assessmentId}`, nextStartingSubject); } catch { /* Optional device storage. */ }
        setAssessment(nextAssessment);
        setSessionScreen(resume.screen);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Could not load this exam.");
      } finally {
        setIsCheckingSession(false);
      }
    }

    loadExamSession();
  }, [isGameSession, setSelectedAnswers]);

  useEffect(() => {
    latestAnswersRef.current = selectedAnswers;
    if (isGameSession || !assessment || !studentId || isCheckingSession || isTeacherPreviewSession || sessionScreen === "testOver") return;
    const content = attemptContent ?? resolveExamContent(assessment);
    const subject = sessionScreen.startsWith("math") ? "math" : "english";
    const passage = content.passageSets[activePassageSetIndex];
    const position = normalizeExamNavigation({ subject, [subject]: {
      screen: sessionScreen,
      ...(sessionScreen.startsWith("passage") || sessionScreen === "readingDirections" ? { passageSetId: passage?.id, questionId: passage?.questions[activeQuestionIndex]?.id } : {}),
      ...(sessionScreen === "mathQuestion" ? { questionId: content.mathSection?.questions[activeMathQuestionIndex]?.id } : {}),
      ...(sessionScreen === "standaloneQuestion" ? { questionId: content.standaloneSection?.questions[activeStandaloneQuestionIndex]?.id } : {}),
    } });
    if (position?.[subject]) navigationRef.current = { ...navigationRef.current, ...position };
    saveLocalExamSession(studentId, assessment.id, selectedAnswers, completedSections, "in_progress", getQuestionTimesSnapshot(), navigationRef.current);
  }, [isGameSession, assessment, attemptContent, activePassageSetIndex, activeQuestionIndex, activeStandaloneQuestionIndex, activeMathQuestionIndex, completedSections, getQuestionTimesSnapshot, isCheckingSession, isTeacherPreviewSession, selectedAnswers, sessionScreen, studentId]);

  useEffect(() => {
    if (isGameSession || !assessment || !accessToken || isCheckingSession || isTeacherPreviewSession || sessionScreen === "testOver") return;

    const assessmentId = assessment.id;
    async function syncAnswers() {
      const answers = latestAnswersRef.current;
      if (autosaveInFlightRef.current || finalSubmissionRef.current) return;
      const navigation = navigationRef.current;
      if (studentId) saveLocalExamSession(studentId, assessmentId, answers, completedSections, "in_progress", getQuestionTimesSnapshot(), navigation);
      const signature = JSON.stringify({ answers, completedSections, navigation });
      if (signature === lastAutosaveSignatureRef.current) return;
      autosaveInFlightRef.current = true;
      const savePromise = saveExamSessionProgress(accessToken, assessmentId, {
        reentryGrantId: assessment?.reentry?.id,
        answers: answers as Record<string, unknown>,
        completedSections,
        navigation,
        status: "in_progress",
      }).then(() => {
        lastAutosaveSignatureRef.current = signature;
      }).catch(() => {
        // Local storage remains the immediate fallback; the interval retries the database save.
      }).finally(() => {
        autosaveInFlightRef.current = false;
        if (autosavePromiseRef.current === savePromise) autosavePromiseRef.current = null;
      });
      autosavePromiseRef.current = savePromise;
      await savePromise;
    }

    const firstSave = window.setTimeout(() => void syncAnswers(), 2_000);
    const saveInterval = window.setInterval(() => void syncAnswers(), 15_000);
    const saveWhenHidden = () => {
      if (document.visibilityState === "hidden") void syncAnswers();
    };
    document.addEventListener("visibilitychange", saveWhenHidden);
    return () => {
      window.clearTimeout(firstSave);
      window.clearInterval(saveInterval);
      document.removeEventListener("visibilitychange", saveWhenHidden);
    };
  }, [isGameSession, accessToken, assessment, activePassageSetIndex, activeQuestionIndex, activeStandaloneQuestionIndex, activeMathQuestionIndex, completedSections, getQuestionTimesSnapshot, isCheckingSession, isTeacherPreviewSession, sessionScreen, studentId]);

  useEffect(() => {
    if (!timerState || timerState.pausedAt !== null) {
      return;
    }

    const timerInterval = window.setInterval(() => setTimerNow(Date.now()), 1000);
    return () => window.clearInterval(timerInterval);
  }, [timerState]);

  useEffect(() => {
    if (isGameSession || !assessment || isCheckingSession || sessionScreen === "testOver") {
      return;
    }

    function confirmBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", confirmBeforeLeaving);
    return () => window.removeEventListener("beforeunload", confirmBeforeLeaving);
  }, [isGameSession, assessment, isCheckingSession, sessionScreen]);

  const gameQuestions = sessionScreen === "mathQuestion" ? gameSession?.content.mathSection?.questions
    : sessionScreen === "standaloneQuestion" ? gameSession?.content.standaloneSection?.questions
      : sessionScreen === "passage" ? gameSession?.content.passageSets[activePassageSetIndex]?.questions : undefined;
  const gameQuestionIndex = sessionScreen === "mathQuestion" ? activeMathQuestionIndex
    : sessionScreen === "standaloneQuestion" ? activeStandaloneQuestionIndex : activeQuestionIndex;
  const visibleGameQuestionId = (gameQuestions?.[gameQuestionIndex] ?? gameQuestions?.[0])?.id ?? null;
  const reportGameQuestion = gameSession?.onCurrentQuestionChange;
  useEffect(() => { reportGameQuestion?.(visibleGameQuestionId); }, [reportGameQuestion, visibleGameQuestionId]);

  if (isCheckingSession) {
    return <main className="loading-shell">Loading exam session...</main>;
  }

  if (!isGameSession && !isSupabaseConfigured) {
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
          <a href={getAssessmentDashboardHref()}>Return to assessments</a>
        </section>
      </main>
    );
  }

  const currentAssessmentId = assessment.id;
  const examContent = gameSession?.practice ? gameSession.content : attemptContent ?? resolveExamContent(assessment);
  const sectionAccess = getExamSectionAccess(examContent, isTeacherPreviewSession ? { english: true, math: true } : assessment.sectionAccess);
  const canAccessEnglish = sectionAccess.english && (isTeacherPreviewSession || !completedSections.includes("english"));
  const canAccessMath = sectionAccess.math && (isTeacherPreviewSession || !completedSections.includes("math"));
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
  const activeMathQuestionEliminatedChoiceIds = activeMathQuestion
    ? (eliminatedChoices[activeMathQuestion.id] ?? [])
    : [];
  const standaloneSection = examContent.standaloneSection;
  const activePassageSet = examContent.passageSets.at(activePassageSetIndex) ?? examContent.passageSets.at(0);
  const activeQuestion = activePassageSet?.questions.at(activeQuestionIndex) ?? activePassageSet?.questions.at(0);
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
  const activeQuestionChoices = activeQuestion?.choices ?? [];
  const hasLongAnswerContent =
    (activeQuestion?.prompt.length ?? 0) > 190 ||
    (activeQuestion?.instructions?.length ?? 0) > 160 ||
    activeQuestionChoices.some((choice) => choice.text.length > 130) ||
    (activeQuestion?.items ?? []).some((item) => item.text.length > 90);
  const isExpandedQuestionLayout =
    activeQuestion?.type === "category_sort" ||
    activeQuestion?.type === "matrix_choice" ||
    activeQuestion?.type === "table_match" ||
    hasLongAnswerContent;
  const activePassageAnswer = activeQuestion ? selectedAnswers[activeQuestion.id] : undefined;
  const activeQuestionSelectedChoiceIds = getSelectedChoiceIds(activePassageAnswer);
  const activeQuestionCategoryPlacements = getCategoryPlacements(activePassageAnswer);
  const activeQuestionEliminatedChoiceIds = activeQuestion ? eliminatedChoices[activeQuestion.id] ?? [] : [];
  const activeQuestionTitleId = activeQuestion ? `question-title-${activeQuestion.id}` : undefined;
  const passageQuestionCount = examContent.passageSets.reduce(
    (total, passageSet) => total + passageSet.questions.length,
    0,
  );
  const standaloneQuestionCount = standaloneSection?.questions.length ?? 0;
  const mathQuestionCount = mathQuestions.length;
  const englishQuestionCount = passageQuestionCount + standaloneQuestionCount;
  const totalExamQuestionCount = passageQuestionCount + standaloneQuestionCount + mathQuestionCount;
  const assessmentLabel = examContent.title.toUpperCase();
  const timerDisplay = gameSession ? { isOvertime: false, text: gameSession.timerText } : timerState
    ? getExamTimerDisplay(timerState, timerNow)
    : { isOvertime: false, text: "3:00:00" };
  const isExamPaused = Boolean(timerState && timerState.pausedAt !== null);
  const activePassageSection =
    activePassageSet?.section ?? (activePassageSet ? examContent.passageSections?.[activePassageSet.id] : undefined) ?? "reading";
  const passageSetDisplayLabel =
    activePassageSection === "reading"
      ? "ELA Rdg Comp"
      : activePassageSection === "revising_editing_a"
        ? "ELA Rev/Edit A"
        : activePassageSet?.label ?? getPassageSetLabel(activePassageSetIndex, examContent.passageSets.length);
  const passageSetLabel = passageSetDisplayLabel.toUpperCase();
  const isProsePassage = activePassageSet?.passage.format === "prose";
  const isSentenceProsePassage = activePassageSet?.passage.format === "sentence_prose";
  const hasNextPassageSet = activePassageSetIndex < examContent.passageSets.length - 1;
  const shouldShowPassageDirections = Boolean(activePassageSet && (activePassageSetIndex === 0 || activePassageSet.showDirectionsBefore));
  const reviewItems: ReviewItem[] = [];
  const isTeacherTestView = isTeacherPreviewSession && getStudentPreviewContext().mode === "teacher";
  const accessibleQuestions: ExamQuestion[] = [];
  const addReviewQuestion = (
    id: ReviewItemId,
    question: ExamQuestion,
    label: string,
    target: ReviewItemTarget,
  ) => {
    accessibleQuestions.push(question);
    reviewItems.push({
      id,
      isAnswered: isQuestionAnswered(question, selectedAnswers),
      isBookmarked: bookmarkedQuestionIds.includes(id),
      kind: "question",
      label,
      target,
    });
  };

  if (isTeacherTestView) {
    let englishNumber = 0;
    examContent.passageSets.forEach((set, passageSetIndex) => {
      set.questions.forEach((question, questionIndex) => {
        addReviewQuestion(`review:passage:${passageSetIndex}:${questionIndex}`, question,
          `English ${++englishNumber} · ${set.passage.title}`,
          { kind: "passage", passageSetIndex, questionIndex });
      });
    });
    standaloneSection?.questions.forEach((question, questionIndex) => {
      addReviewQuestion(`review:standalone:${questionIndex}`, question,
        `English ${++englishNumber} · Revising / editing`, { kind: "standalone", questionIndex });
    });
    mathQuestions.forEach((question, questionIndex) => {
      addReviewQuestion(`review:math:${questionIndex}`, question, `Math ${questionIndex + 1}`,
        { kind: "math", questionIndex });
    });
  } else if (sessionScreen === "directions") {
    reviewItems.push({
      id: "review:directions:general",
      kind: "directions",
      label: "General Directions",
    });
  } else if (
    activePassageSet && (sessionScreen === "readingDirections" ||
    sessionScreen === "passage" ||
    sessionScreen === "passageEnd")
  ) {
    if (shouldShowPassageDirections) {
      reviewItems.push({
        id: `review:directions:passage:${activePassageSetIndex}`,
        kind: "directions",
        label: activePassageSet.directions.breadcrumbLabel ?? "ELA Rdg Comp Directions",
      });
    }

    const accessibleQuestionCount = sessionScreen === "readingDirections" ? 0 : activePassageSet.questions.length;
    activePassageSet.questions.slice(0, accessibleQuestionCount).forEach((question, questionIndex) => {
      addReviewQuestion(
        `review:passage:${activePassageSetIndex}:${questionIndex}`,
        question,
        `Question ${questionIndex + 1}`,
        { kind: "passage", passageSetIndex: activePassageSetIndex, questionIndex },
      );
    });

    if (sessionScreen === "passageEnd") {
      reviewItems.push(
        {
          id: `review:passage-end:${activePassageSetIndex}`,
          kind: "passageEnd",
          label: "Passage End Directions",
        },
        {
          id: `review:end-section:passage:${activePassageSetIndex}`,
          kind: "endSection",
          label: "End of Section",
        },
      );
    }
  } else if (sessionScreen === "standaloneDirections" && standaloneSection) {
    reviewItems.push({
      id: "review:directions:standalone",
      kind: "directions",
      label: standaloneSection.directions.breadcrumbLabel ?? "ELA Rev/Edit B Directions",
    });
  } else if (sessionScreen === "standaloneQuestion" && standaloneSection && activeStandaloneQuestion) {
    standaloneSection.questions
      .forEach((question, questionIndex) => {
        addReviewQuestion(
          `review:standalone:${questionIndex}`,
          question,
          `Question ${questionIndex + 1}`,
          { kind: "standalone", questionIndex },
        );
      });
  } else if (sessionScreen === "mathDirections") {
    reviewItems.push({
      id: "review:directions:math",
      kind: "directions",
      label: mathSection.directions.breadcrumbLabel ?? "Math Directions",
    });
  } else if (sessionScreen === "mathQuestion" && activeMathQuestion) {
    mathQuestions
      .forEach((question, questionIndex) => {
        addReviewQuestion(
          `review:math:${questionIndex}`,
          question,
          `Question ${questionIndex + 1}`,
          { kind: "math", questionIndex },
        );
      });
  } else if (sessionScreen === "endSection") {
    reviewItems.push({
      id: "review:end-section",
      kind: "endSection",
      label: "End of Section",
    });
  }
  const unansweredCount = accessibleQuestions.filter(
    (question) => !isQuestionAnswered(question, selectedAnswers),
  ).length;
  const bookmarkCount = reviewItems.filter(
    (item) => item.kind === "question" && item.isBookmarked,
  ).length;
  const currentReviewItemId: ReviewItemId | undefined =
    sessionScreen === "directions"
      ? "review:directions:general"
      : sessionScreen === "readingDirections"
        ? `review:directions:passage:${activePassageSetIndex}`
        : sessionScreen === "passage"
          ? `review:passage:${activePassageSetIndex}:${activeQuestionIndex}`
          : sessionScreen === "passageEnd"
            ? `review:passage-end:${activePassageSetIndex}`
            : sessionScreen === "standaloneDirections"
              ? "review:directions:standalone"
              : sessionScreen === "standaloneQuestion"
                ? `review:standalone:${activeStandaloneQuestionIndex}`
                : sessionScreen === "mathDirections"
                  ? "review:directions:math"
                  : sessionScreen === "mathQuestion"
                    ? `review:math:${activeMathQuestionIndex}`
                    : sessionScreen === "endSection"
                      ? "review:end-section"
                      : undefined;
  const isActiveQuestionBookmarked = Boolean(
    currentReviewItemId && bookmarkedQuestionIds.includes(currentReviewItemId),
  );
  const directionsBreadcrumbLabel = activePassageSet
    ? activePassageSet.directions.breadcrumbLabel ??
      `${activePassageSet.directions.title.split(" ").slice(0, 3).join(" ")} DIRECTIONS`
    : "";

  function clearTransientExamUi() {
    setChoiceLimitWarnings([]);
    setHighlightToolbar(null);
  }

  async function saveCompletedExam(answers: SelectedAnswers) {
    if (!studentId) {
      throw new Error("Your student session is unavailable. Refresh and try again.");
    }

    finalSubmissionRef.current = true;
    try {
      await autosavePromiseRef.current;
      const result = { ...createExamResult(examContent, answers, ["english", "math"], getQuestionTimesSnapshot()), attemptId: attemptIdRef.current, sectionCompletedAt: sectionDatesRef.current, ...(assessment?.reentry ? { reentryGrantId: assessment.reentry.id, reentrySubmittedSections: assessment.reentry.sections } : {}), ...(timerState ? { timerState: pauseExamTimer(timerState) } : {}) };
      if (accessToken && !isTeacherPreviewSession) {
        await saveCloudExamResult(
          accessToken,
          result.assessmentId,
          result as unknown as Record<string, unknown>,
        );
        try {
          await saveExamSessionProgress(accessToken, result.assessmentId, {
            reentryGrantId: assessment?.reentry?.id,
            answers: answers as Record<string, unknown>,
            completedSections: ["english", "math"],
            status: "submitted",
            navigation: navigationRef.current,
          });
        } catch {
          // The submitted result itself also contains the permanent answer record.
        }
      }
      saveExamResult(studentId, result);
      saveLocalExamSession(studentId, result.assessmentId, answers, ["english", "math"], "submitted", getQuestionTimesSnapshot());
      setCompletedSections(["english", "math"]);
      setHasSubmittedAttempt(true);
    } catch (error) {
      finalSubmissionRef.current = false;
      throw error;
    }
  }

  async function saveSectionCompletion(section: ExamSection) {
    if (!studentId) throw new Error("Your student session is unavailable. Refresh and try again.");
    const submission = prepareSectionSubmission(examContent, selectedAnswers, completedSections, section);
    finalSubmissionRef.current = true;
    try {
      await autosavePromiseRef.current;
      const pausedTimer = pauseExamTimer(timerState ?? loadExamTimer(currentAssessmentId));
      const dates = { ...sectionDatesRef.current, [section]: new Date().toISOString() };
      const result = { ...createExamResult(examContent, submission.answers, submission.completedSections, getQuestionTimesSnapshot()), attemptId: attemptIdRef.current, sectionCompletedAt: dates, timerState: pausedTimer, ...(assessment?.reentry ? { reentryGrantId: assessment.reentry.id, reentrySubmittedSections: submission.completedSections.filter(section => assessment.reentry!.sections.includes(section)) } : {}) };
      if (!isTeacherPreviewSession) {
        if (accessToken) await saveCloudExamResult(accessToken, currentAssessmentId, result as unknown as Record<string, unknown>);
        saveExamResult(studentId, result);
        saveLocalExamSession(studentId, currentAssessmentId, submission.answers, submission.completedSections, result.completionStatus === "complete" ? "submitted" : "in_progress", getQuestionTimesSnapshot());
        if (accessToken) {
          try { await saveExamSessionProgress(accessToken, currentAssessmentId, { reentryGrantId: assessment?.reentry?.id, answers: submission.answers, completedSections: submission.completedSections, navigation: navigationRef.current, status: result.completionStatus === "complete" ? "submitted" : "in_progress" }); }
          catch { /* The durable result also preserves answers and completed sections. */ }
        }
      }
      sectionDatesRef.current = dates;
      setSelectedAnswers(submission.answers); setCompletedSections(submission.completedSections);
      setHasSubmittedAttempt(true);
      saveExamTimerState(currentAssessmentId, pausedTimer); setTimerState(pausedTimer);
      return submission.completedSections;
    } finally { finalSubmissionRef.current = false; }
  }

  function continueExamSection(subject: ExamSection) {
    handleResumeTimer();
    const resume = getExamResumePosition(examContent, subject, {
      answers: selectedAnswers, completedSections, navigation: navigationRef.current,
      status: "in_progress", updatedAt: new Date().toISOString(),
    });
    setActivePassageSetIndex(resume.passageIndex);
    setActiveQuestionIndex(resume.questionIndex);
    setActiveStandaloneQuestionIndex(resume.questionIndex);
    setActiveMathQuestionIndex(resume.questionIndex);
    setSessionScreen(resume.screen);
  }

  function handleSpeedFinish() {
    if (!isTeacherPreviewSession) {
      return;
    }

    const randomAnswers = Object.fromEntries(
      getAllExamQuestions(examContent).map((question) => [question.id, createRandomQuestionAnswer(question)]),
    );

    setSelectedAnswers(randomAnswers);
    clearTransientExamUi();
    setActiveTool("pointer");
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    void saveCompletedExam(randomAnswers).then(() => setSessionScreen("testOver"));
  }

  function handlePauseTimer() {
    if (!timerState) {
      return;
    }

    const nextTimerState = pauseExamTimer(timerState);
    saveExamTimerState(currentAssessmentId, nextTimerState);
    setTimerState(nextTimerState);
    setTimerNow(nextTimerState.pausedAt ?? timerNow);
    setIsUserMenuOpen(false);
    setIsReviewOpen(false);
    setIsNotepadOpen(false);
    setActiveTool("pointer");
    clearTransientExamUi();
  }

  function handleResumeTimer() {
    if (!timerState) {
      return;
    }

    const nextTimerState = resumeExamTimer(timerState);
    saveExamTimerState(currentAssessmentId, nextTimerState);
    setTimerState(nextTimerState);
    setTimerNow(Date.now());
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
    if (!activePassageSet || !activeQuestion) return;
    if (!isFastForwardEnabled && !isQuestionAnswered(activeQuestion, selectedAnswers)) {
      setIsUnansweredModalOpen(true);
      return;
    }

    if (gameSession?.teamNavigation) { gameSession.teamNavigation.onNext(); return; }

    if (activeQuestionIndex < activePassageSet.questions.length - 1) {
      setSelectedCategoryItemId("");
      clearTransientExamUi();
      setIsReviewOpen(false);
      setActiveQuestionIndex((currentIndex) => currentIndex + 1);
      return;
    }

    if (!isFastForwardEnabled && activePassageSet.questions.some(question => !isQuestionAnswered(question, selectedAnswers))) {
      setReviewFilter("notAnswered");
      setIsReviewOpen(true);
      return;
    }

    setSelectedCategoryItemId("");
    clearTransientExamUi();
    setIsReviewOpen(false);
    setReviewFilter("all");
    setSessionScreen("passageEnd");
  }

  function handlePassageEndNext() {
    if (gameSession) { void gameSession.onSubmit(selectedAnswers); return; }
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
    if (gameSession?.teamNavigation) { gameSession.teamNavigation.onReview(Math.max(0, activeQuestionIndex - 1)); return; }
    if (gameSession && activeQuestionIndex === 0) return;
    if (activeQuestionIndex === 0 && !shouldShowPassageDirections && !isFastForwardEnabled) {
      return;
    }

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



  function handleChangeStructuredAnswer(questionId: string, value: CategoryPlacements) {
    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
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

    if (question.type !== 'graph_point_select' && !isFastForwardEnabled && currentChoiceIds.length >= maxChoices) {
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

  function handleChoiceLabelClick(event: MouseEvent<HTMLLabelElement>, question: ExamQuestion, choiceId: string) {
    if (activeTool === "eliminator") {
      event.preventDefault();
      handleToggleEliminatedChoice(question.id, choiceId);
      return;
    }
    const selection = window.getSelection();
    if (!(event.target instanceof HTMLInputElement) && selection?.toString().trim()
      && event.currentTarget.contains(selection.anchorNode)
      && event.currentTarget.contains(selection.focusNode)) {
      event.preventDefault();
    }
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
    if (!activePassageSet) return;
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

  function renderAuthoredText(html: string | undefined, text: string, highlightKey: string) {
    return html ? <AuthoredRichText html={html} highlights={textHighlights[highlightKey]} /> : renderHighlightedText(text, highlightKey);
  }

  function handlePlaceCategoryItem(question: ExamQuestion, itemId: string, categoryId: string) {
    setSelectedAnswers((currentAnswers) => {
      const currentPlacements = getCategoryPlacements(currentAnswers[question.id]);
      const nextPlacements =
        question.requiredPlacements === 1
          ? {}
          : {
              ...currentPlacements,
            };

      if (question.categoryCapacity === 1) {
        Object.entries(nextPlacements).forEach(([placedItemId, placedCategoryId]) => {
          if (placedItemId !== itemId && placedCategoryId === categoryId) {
            delete nextPlacements[placedItemId];
          }
        });
      }

      nextPlacements[itemId] = categoryId;
      return {
        ...currentAnswers,
        [question.id]: nextPlacements,
      };
    });
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

  function handleToggleBookmark() {
    if (!currentReviewItemId || !reviewItems.some((item) => item.id === currentReviewItemId && item.kind === "question")) return;

    setBookmarkedQuestionIds((currentIds) =>
      currentIds.includes(currentReviewItemId)
        ? currentIds.filter((questionId) => questionId !== currentReviewItemId)
        : [...currentIds, currentReviewItemId],
    );
  }

  function handleReviewItemSelect(itemId: ReviewItemId) {
    const item = reviewItems.find((candidate) => candidate.id === itemId);
    if (!item) return;
    if (gameSession?.teamNavigation) {
      setIsReviewOpen(false);
      if (item.target?.kind === "passage") gameSession.teamNavigation.onReview(item.target.questionIndex);
      else if (item.kind === "passageEnd") gameSession.teamNavigation.onReview(gameSession.content.passageSets[0]?.questions.length ?? 0);
      return;
    }

    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    clearTransientExamUi();
    setSelectedCategoryItemId("");

    if (item.kind === "directions") {
      if (sessionScreen === "directions") {
        setSessionScreen("directions");
      } else if (sessionScreen === "standaloneDirections") {
        setSessionScreen("standaloneDirections");
      } else if (sessionScreen === "mathDirections") {
        setSessionScreen("mathDirections");
      } else {
        setSessionScreen("readingDirections");
      }
      return;
    }

    if (item.kind === "passageEnd" || item.kind === "endSection") {
      setSessionScreen(
        item.kind === "passageEnd" || item.id.startsWith("review:end-section:passage:")
          ? "passageEnd"
          : "endSection",
      );
      return;
    }

    if (!item.target) return;
    if (item.target.kind === "passage") {
      setActivePassageSetIndex(item.target.passageSetIndex);
      setActiveQuestionIndex(item.target.questionIndex);
      setSessionScreen("passage");
      return;
    }
    if (item.target.kind === "standalone") {
      setActiveStandaloneQuestionIndex(item.target.questionIndex);
      setSessionScreen("standaloneQuestion");
      return;
    }
    setActiveMathQuestionIndex(item.target.questionIndex);
    setSessionScreen("mathQuestion");
  }

  function handleStandaloneNext() {
    if (!standaloneSection || !activeStandaloneQuestion) {
      return;
    }

    if (!isFastForwardEnabled && !isQuestionAnswered(activeStandaloneQuestion, selectedAnswers)) {
      setIsUnansweredModalOpen(true);
      return;
    }
    if (gameSession) { void gameSession.onSubmit(selectedAnswers); return; }

    if (activeStandaloneQuestionIndex < standaloneSection.questions.length - 1) {
      setSelectedCategoryItemId("");
      clearTransientExamUi();
      setIsReviewOpen(false);
      setActiveStandaloneQuestionIndex((currentIndex) => currentIndex + 1);
      return;
    }

    if (!isFastForwardEnabled && standaloneSection.questions.some(question => !isQuestionAnswered(question, selectedAnswers))) {
      setReviewFilter("notAnswered");
      setIsReviewOpen(true);
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
    if (gameSession && activeStandaloneQuestionIndex === 0) return;
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

  async function submitExamSection(section: ExamSection) {
    if (gameSession) { await gameSession.onSubmit(selectedAnswers); return; }
    if (isSubmittingSection) return;
    setIsSubmittingSection(true); setErrorMessage("");
    try {
      const sections = await saveSectionCompletion(section);
      clearTransientExamUi(); setIsReviewOpen(false); setIsNotepadOpen(false); setIsUserMenuOpen(false); setIsUnansweredModalOpen(false);
      setSubmittedSection(section);
      setSessionScreen(sections.includes("english") && sections.includes("math") ? "testOver" : "sectionComplete");
    } finally { setIsSubmittingSection(false); }
  }
  async function handleEndSectionSubmit() {
    try { await submitExamSection("english"); } catch (reason) { setErrorMessage(reason instanceof Error ? reason.message : "Could not save English. Try again."); }
  }
  async function finishMathSection() {
    try { await submitExamSection("math"); } catch (reason) { setErrorMessage(reason instanceof Error ? reason.message : "Could not save Math. Try again."); }
  }

  function handleStartMathSection() {
    clearTransientExamUi();
    setActiveTool("pointer");
    const firstUnansweredMathIndex = mathQuestions.findIndex((question) =>
      !Object.prototype.hasOwnProperty.call(selectedAnswers, question.id),
    );
    setActiveMathQuestionIndex(firstUnansweredMathIndex >= 0 ? firstUnansweredMathIndex : 0);
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
    if (gameSession?.practice?.feedback) clearTransientExamUi();
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

    if (!isFastForwardEnabled && mathQuestions.some(question => !isQuestionAnswered(question, selectedAnswers))) {
      setReviewFilter("notAnswered");
      setIsReviewOpen(true);
      return;
    }

    finishMathSection();
  }

  function handleMathPrevious() {
    if (!isTeacherPreviewSession && !isFastForwardEnabled) return;
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

  const activeSubmissionSection: ExamSection = sessionScreen.startsWith("math") ? "math" : "english";
  const onTimeExpiredSubmit = !isGameSession && !isTeacherPreviewSession && !(assessment?.canEditSubmittedSections && hasSubmittedAttempt) && timerState && timerState.pausedAt === null && sessionScreen !== "testOver" && sessionScreen !== "sectionComplete" && isExamTimeExpired(timerState, timerNow)
    ? async () => { await saveCompletedExam(selectedAnswers); setSessionScreen("testOver"); }
    : undefined;
  const submissionQuestions = activeSubmissionSection === "math" ? mathQuestions : [...examContent.passageSets.flatMap(set => set.questions), ...(standaloneSection?.questions ?? [])];
  const timerToolbarProps = {
    showTimer: !gameSession?.hideTimer,
    onTimeExpiredSubmit,
    sectionSubmission: !isGameSession && !isTeacherPreviewSession && !completedSections.includes(activeSubmissionSection) && submissionQuestions.length ? { section: activeSubmissionSection, answered: submissionQuestions.filter(question => isQuestionAnswered(question, selectedAnswers)).length, total: submissionQuestions.length, disabled: isSubmittingSection, finishesExam: completedSections.includes(activeSubmissionSection === "math" ? "english" : "math"), onSubmit: () => submitExamSection(activeSubmissionSection) } : undefined,
    isTimerOvertime: timerDisplay.isOvertime,
    isTimerVisible,
    isUserMenuOpen,
    onPauseTimer: isGameSession ? undefined : handlePauseTimer,
    onToggleTimer: () => {
      setIsUserMenuOpen(false);
      setIsTimerVisible((currentValue) => !currentValue);
    },
    onToggleUserMenu: () => setIsUserMenuOpen((currentValue) => !currentValue),
    timerText: timerDisplay.text,
  };
  const fastForwardToolbarProps = {
    ...timerToolbarProps,
    canUseFastForward: isTeacherPreviewSession,
    isFastForwardEnabled,
    onSpeedFinish: handleSpeedFinish,
    onToggleFastForward: () => setIsFastForwardEnabled((currentValue) => !currentValue),
  };

  const reviewToolbarProps = {
    activeTool,
    bookmarkCount,
    currentReviewItemId,
    pencilKey: currentReviewItemId,
    pencilStorage,
    pencilInPassage: sessionScreen === "passage",
    ...fastForwardToolbarProps,
    isBookmarkActive: isActiveQuestionBookmarked,
    isNotepadOpen,
    isReviewOpen,
    onReviewFilterChange: setReviewFilter,
    onReviewItemSelect: handleReviewItemSelect,
    onSelectTool: handleSelectTool,
    onToggleBookmark:
      currentReviewItemId &&
      reviewItems.some((item) => item.id === currentReviewItemId && item.kind === "question")
        ? handleToggleBookmark
        : undefined,
    onToggleReview: () => {
      setReviewFilter("all");
      setIsReviewOpen((currentValue) => !currentValue);
    },
    reviewFilter,
    reviewItems,
    reviewQuestionCount: accessibleQuestions.length,
    questionProgress: gameSession ? { total: gameSession.subjectPosition.total, answered: gameSession.subjectPosition.current - 1 + accessibleQuestions.length - unansweredCount } : undefined,
    unansweredCount,
  };

  const moduleHeaderProps = {
    onTimeExpiredSubmit,
    isUserMenuOpen,
    onPauseTimer: handlePauseTimer,
    onToggleUserMenu: () => setIsUserMenuOpen((currentValue) => !currentValue),
  };

  if (sessionScreen === "sectionComplete") {
    const next = submittedSection === "math" ? "english" : "math";
    const mayContinue = next === "math" ? canAccessMath : canAccessEnglish;
    return <main className="exam-session-shell"><section className="exam-end-section-card"><h1>{submittedSection === "math" ? "Math" : "English"} submitted</h1><p>Your teacher can now review this section. {assessment.canEditSubmittedSections ? "You can continue to the next section or return to any open section later." : <>{next === "math" ? "Math" : "English"} remains unfinished and has not been graded.</>}</p><p>The shared three-hour exam timer is paused. Time remaining: {timerDisplay.text}.</p><div className="exam-test-over-actions"><button className="exam-end-section-submit" onClick={() => window.location.assign(getAssessmentDashboardHref())} type="button">Save & exit</button>{mayContinue && <button className="exam-end-section-submit" onClick={() => continueExamSection(next)} type="button">Continue {next === "math" ? "Math" : "English"}</button>}</div></section></main>;
  }

  if (isExamPaused && sessionScreen !== "testOver") {
    return (
      <main className="exam-paused-screen" aria-label="Exam paused">
        <button onClick={handleResumeTimer} type="button">
          <Play aria-hidden="true" fill="currentColor" size={16} strokeWidth={2} />
          Resume exam
        </button>
        <button onClick={() => window.location.assign(getAssessmentDashboardHref())} type="button">Save & exit</button>
      </main>
    );
  }

  if (sessionScreen === "mathIntro") {
    return (
      <main className="exam-module-shell">
        {isTeacherTestView ? <ExamToolbar assessmentLabel={assessmentLabel} breadcrumbMiddle="TEACHER TEST VIEW" breadcrumbCurrent="" {...reviewToolbarProps} isNextActive={false} showTimer={false} showWorkTools={false} studentName={studentName} /> : <ExamModuleHeader {...moduleHeaderProps} studentName={studentName} />}

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
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={mathSection.directions.breadcrumbLabel ?? "MATH DIRECTIONS"}
          breadcrumbMiddle={mathSection.label.toUpperCase()}
          {...reviewToolbarProps}
          isNotepadOpen={isNotepadOpen}
          onNext={() => {
            setHighlightToolbar(null);
            setIsReviewOpen(false);
            setReviewFilter("all");
            setActiveMathQuestionIndex(0);
            setSessionScreen("mathQuestion");
          }}
          onSelectTool={handleSelectTool}
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
      <main className="exam-session-shell is-math-session">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={gameSession?.practice ? `QUESTION ${gameSession.subjectPosition.current}` : gameSession ? `${gameSession.subjectPosition.current} OF ${gameSession.subjectPosition.total}` : `${activeMathQuestionIndex + 1} OF ${mathQuestions.length}`}
          breadcrumbMiddle={mathSection.label.toUpperCase()}
          {...reviewToolbarProps}
          {...(gameSession?.practice ? { sessionStats: gameSession.practice.stats, showTimer: false, onPauseTimer: gameSession.practice.onExit, exitLabel: gameSession.practice.exitLabel ?? "End practice" } : {})}
          isNotepadOpen={isNotepadOpen}
          isPreviousActive={isTeacherPreviewSession || isFastForwardEnabled}
          showReviewTools={isTeacherPreviewSession || isFastForwardEnabled}
          onNext={handleMathNext}
          onPrevious={handleMathPrevious}
          onSelectTool={handleSelectTool}
          showExhibits
          canEliminate={['multiple_choice', 'multi_select', 'graph_point_select'].includes(activeMathQuestion.type)}
          studentName={studentName}
        />

        <ExamMathQuestion
          key={activeMathQuestion.id} question={activeMathQuestion}
          answerFeedback={gameSession?.practice?.result}
          answer={selectedAnswers[activeMathQuestion.id]}
          allowExtraSelections={isFastForwardEnabled}
          onChange={value => setSelectedAnswers(current => ({ ...current, [activeMathQuestion.id]: value }))}
          eliminatedIds={activeMathQuestionEliminatedChoiceIds}
          onSelectChoice={id => handleChoiceClick(activeMathQuestion, id)}
          onTogglePoint={id => handleToggleMultiSelectAnswer(activeMathQuestion, id)}
          onEliminatePoint={activeTool === 'eliminator' ? id => handleToggleEliminatedChoice(activeMathQuestion.id, id) : undefined}
          onChoiceLabelClick={(event, id) => handleChoiceLabelClick(event, activeMathQuestion, id)}
          onTextSelection={handleExamTextSelection}
          renderText={(html, text, key) => renderMathRichText(html, text, key, (value, id) => renderMathAuthoredText(value, id, renderHighlightedText))}
        ><QuestionTimeTracker onElapsed={recordQuestionTime} questionId={activeMathQuestion.id} /></ExamMathQuestion>

        {gameSession?.practice?.feedback}

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
              <h2>{sharedTools ? "Team Notepad · Your notes" : "Global Notepad"}</h2>
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
              maxLength={sharedTools ? 4000 : undefined}
            />
            <SharedToolNotes tools={sharedTools} noteKey={mathNoteKey} />
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
        {isTeacherTestView ? <ExamToolbar assessmentLabel={assessmentLabel} breadcrumbMiddle="TEACHER TEST VIEW" breadcrumbCurrent="" {...reviewToolbarProps} isNextActive={false} showTimer={false} showWorkTools={false} studentName={studentName} /> : <ExamModuleHeader {...moduleHeaderProps} studentName={studentName} />}

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
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={standaloneSection.directions.breadcrumbLabel ?? "ELA REV/EDIT B DIRECTIONS"}
          breadcrumbMiddle={standaloneSection.label.toUpperCase()}
          {...reviewToolbarProps}
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
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={`${activeStandaloneQuestionIndex + 1} OF ${standaloneSection.questions.length}`}
          breadcrumbMiddle={standaloneSection.label.toUpperCase()}
          {...reviewToolbarProps}
          isNotepadOpen={isNotepadOpen}
          isPreviousActive
          onNext={handleStandaloneNext}
          onPrevious={handleStandalonePrevious}
          onSelectTool={handleSelectTool}
          showExhibits
          studentName={studentName}
        />

        <section
          aria-labelledby={`standalone-title-${activeStandaloneQuestion.id}`}
          className="exam-standalone-document"
          onMouseUp={handleExamTextSelection}
        >
          <form key={activeStandaloneQuestion.id} className="exam-standalone-panel" onSubmit={event => event.preventDefault()}>
            <QuestionTimeTracker onElapsed={recordQuestionTime} questionId={activeStandaloneQuestion.id} />
            <h1
              className="exam-highlightable"
              data-highlight-key={`prompt:${activeStandaloneQuestion.id}`}
              id={`standalone-title-${activeStandaloneQuestion.id}`}
            >
              {renderAuthoredText(
                activeStandaloneQuestion.promptHtml,
                activeStandaloneQuestion.prompt,
                `prompt:${activeStandaloneQuestion.id}`,
              )}
            </h1>

            {activeStandaloneQuestion.stimulus ? (
              <div
                className="exam-standalone-stimulus exam-highlightable"
                data-highlight-key={`stimulus:${activeStandaloneQuestion.id}`}
              >
                {renderAuthoredText(
                  activeStandaloneQuestion.stimulusHtml,
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

            {activeStandaloneQuestion.type === 'transition_drop' ? <SentenceDragDrop key={activeStandaloneQuestion.id} question={activeStandaloneQuestion} answer={selectedAnswers[activeStandaloneQuestion.id]} onChange={answer => setSelectedAnswers(current => ({ ...current, [activeStandaloneQuestion.id]: answer }))} /> : activeStandaloneQuestion.type === "matrix_choice" &&
            activeStandaloneQuestion.items &&
            activeStandaloneQuestion.categories ? (
              <MatrixChoiceResponse
                answer={activeStandaloneQuestionCategoryPlacements}
                onChange={(answer) => handleChangeStructuredAnswer(activeStandaloneQuestion.id, answer)}
                question={activeStandaloneQuestion}
              />
            ) : activeStandaloneQuestion.type === "category_sort" &&
            activeStandaloneQuestion.items &&
            activeStandaloneQuestion.categories ? (
              <div
                className={`exam-standalone-category-sort ${
                  activeStandaloneQuestion.categoryCapacity === 1 ? "is-single-capacity" : ""
                } ${activeStandaloneQuestion.categories.length === 1 ? "is-single-category" : ""}`}
              >
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
                    onClick={(event) => handleChoiceLabelClick(event, activeStandaloneQuestion, choice.id)}
                  >
                    <input
                      checked={
                        activeStandaloneQuestion.type === "multi_select"
                          ? activeStandaloneQuestionSelectedChoiceIds.includes(choice.id)
                          : selectedAnswers[activeStandaloneQuestion.id] === choice.id
                      }
                      name={activeStandaloneQuestion.id}
                      onChange={() => handleChoiceClick(activeStandaloneQuestion, choice.id)}
                      type={activeStandaloneQuestion.type === "multi_select" ? "checkbox" : "radio"}
                    />
                    <span>{choice.id}.</span>
                    <span
                      className="exam-highlightable"
                      data-highlight-key={`choice:${activeStandaloneQuestion.id}:${choice.id}`}
                    >
                      {renderAuthoredText(
                        choice.html,
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
              <h2>{sharedTools ? "Team Notepad · Your notes" : "Global Notepad"}</h2>
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
              aria-label="Revising/Editing Part B notes"
              autoFocus
              onChange={(event) =>
                setPassageNotes((currentNotes) => ({
                  ...currentNotes,
                  [standaloneNoteKey]: event.target.value,
                }))
              }
              value={passageNotes[standaloneNoteKey] ?? ""}
              maxLength={sharedTools ? 4000 : undefined}
            />
            <SharedToolNotes tools={sharedTools} noteKey={standaloneNoteKey} />
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
    const endSectionLabel = standaloneSection?.label ?? "ELA - Revising/Editing Part B";

    return (
      <main className="exam-session-shell">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent=""
          breadcrumbMiddle="END SECTION"
          {...(isTeacherTestView ? reviewToolbarProps : {})}
          onTimeExpiredSubmit={onTimeExpiredSubmit}
          isNextActive={false}
          showReviewTools={isTeacherTestView}
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
          <p>English section ready to submit</p>
          <p className="exam-end-section-copy">
            Use the <strong>Submit</strong> button below to submit your answers.
          </p>
          <button className="exam-end-section-submit" disabled={isSubmittingSection} onClick={handleEndSectionSubmit} type="button">
            {isSubmittingSection ? "Saving" : "Submit"} <span aria-hidden="true">&gt;&gt;</span>
          </button>
          {errorMessage && <p className="auth-message">{errorMessage}</p>}
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
          {...(isTeacherTestView ? reviewToolbarProps : {})}
          isNextActive={false}
          showReviewTools={isTeacherTestView}
          showStatusIcon={false}
          showTimer={false}
          showWorkTools={false}
          studentName={studentName}
        />

        <section className="exam-end-section-card exam-test-over-card" aria-labelledby="exam-test-over-title">
          <h1 id="exam-test-over-title">Complete</h1>
          <span className="exam-end-section-check" aria-hidden="true">
            <Check size={31} strokeWidth={3.2} />
          </span>
          <p>Your answers have been submitted.</p>
          <p className="exam-end-section-copy">Your teacher can view your score from the teacher dashboard.</p>
          <div className="exam-test-over-actions">
            <button
              className="exam-end-section-submit"
              onClick={() => window.location.assign(getAssessmentDashboardHref())}
              type="button"
            >
              Return to Assessments
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (sessionScreen === "passageIntro" && activePassageSet) {
    return (
      <main className="exam-module-shell">
        {isTeacherTestView ? <ExamToolbar assessmentLabel={assessmentLabel} breadcrumbMiddle="TEACHER TEST VIEW" breadcrumbCurrent="" {...reviewToolbarProps} isNextActive={false} showTimer={false} showWorkTools={false} studentName={studentName} /> : <ExamModuleHeader {...moduleHeaderProps} studentName={studentName} />}

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

  if (sessionScreen === "readingDirections" && activePassageSet) {
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

  if (sessionScreen === "passageEnd" && activePassageSet) {
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
            if (gameSession?.teamNavigation) { gameSession.teamNavigation.onReview(activePassageSet.questions.length - 1); return; }
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

  if (sessionScreen === "passage" && activePassageSet && activeQuestion) {
    return (
      <main className="exam-session-shell">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={`${activeQuestionIndex + 1} OF ${activePassageSet.questions.length}`}
          breadcrumbMiddle={passageSetLabel}
          isPreviousActive={activeQuestionIndex > 0 || shouldShowPassageDirections || isFastForwardEnabled}
          {...reviewToolbarProps}
          onNext={handlePassageNext}
          onPrevious={handlePassagePrevious}
          showExhibits
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
              tabIndex={0}
              key={activePassageSet.id}
            >
              <div className="exam-passage-pencil-surface">
              <PencilWorkspace active={activeTool === "pencil"} contained drawingKey={`passage:${activePassageSet.id}`} storage={pencilStorage} onDeactivate={() => handleSelectTool("pointer")} />
              <PassageGlossary contextKey={activeQuestion.id}>
              {activePassageSet.passage.lines.filter((line) => line.kind !== "image").map((line, index) =>
                isSentenceProsePassage && !line.text ? (
                  <p
                    aria-hidden="true"
                    className="exam-sentence-prose-line is-spacer"
                    key={`${line.lineNumber}-${line.text}-${index}`}
                  />
                ) : isSentenceProsePassage ? (
                  <p
                    className={`exam-sentence-prose-line ${
                      line.kind ? `is-${line.kind}` : line.align === "center" ? "is-title" : ""
                    }`}
                    key={`${line.lineNumber}-${line.text}-${index}`}
                  >
                    <span
                      className="exam-highlightable"
                      data-highlight-key={`passage:${activePassageSet.id}:line-${index}`}
                    >
                      {renderAuthoredText(line.html, line.text, `passage:${activePassageSet.id}:line-${index}`)}
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
                    const ProseLine = line.kind === "list" ? "div" : "p";
                    const proseLineClassName = [
                      "exam-prose-line",
                      line.kind ? `is-${line.kind}` : "",
                      line.align === "center" && !line.kind ? "is-title" : "",
                      line.text ? "" : "is-spacer",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <ProseLine
                        className={proseLineClassName}
                        role={line.kind === "heading" ? "heading" : undefined}
                        aria-level={line.kind === "heading" ? 2 : undefined}
                        key={`${line.lineNumber}-${line.text}-${index}`}
                      >
                        {isFullWidthProseLine ? (
                          <span
                            className="exam-highlightable"
                            data-highlight-key={`passage:${activePassageSet.id}:line-${index}`}
                          >
                            {renderAuthoredText(
                              line.html,
                              line.text,
                              `passage:${activePassageSet.id}:line-${index}`,
                            )}
                          </span>
                        ) : (
                          <>
                            {line.lineNumber ? <span className="exam-paragraph-number">{line.lineNumber}</span> : null}
                            <span
                              className="exam-highlightable"
                              data-highlight-key={`passage:${activePassageSet.id}:line-${index}`}
                            >
                              {renderAuthoredText(
                                line.html,
                                line.text,
                                `passage:${activePassageSet.id}:line-${index}`,
                              )}
                            </span>
                          </>
                        )}
                      </ProseLine>
                    );
                  })()
                ) : (
                  <p
                    className={`exam-poem-line ${line.align === "center" ? "is-centered" : line.align === "indent" ? "is-indented" : ""} ${
                      line.kind ? `is-${line.kind}` : ""
                    } ${
                      line.text ? "" : "is-spacer"
                    }`}
                    key={`${line.lineNumber}-${line.text}-${index}`}
                  >
                    <span>{line.lineNumber}</span>
                    <span
                      className="exam-highlightable"
                      data-highlight-key={`passage:${activePassageSet.id}:line-${index}`}
                    >
                      {renderAuthoredText(line.html, line.text, `passage:${activePassageSet.id}:line-${index}`)}
                    </span>
                  </p>
                ),
              )}
              {activePassageSet.passage.sourceNote ? (
                <p className="exam-passage-source-note">{activePassageSet.passage.sourceNote}</p>
              ) : null}
              {activePassageSet.passage.lines
                .filter((line) => line.kind === "image" && line.image)
                .map((line, index) =>
                  line.image ? (
                    <figure className="exam-passage-image" key={`${line.image.src}-footer-${index}`}>
                      <img alt={line.image.alt} src={line.image.src} />
                      {line.image.caption ? <figcaption>{line.image.caption}</figcaption> : null}
                    </figure>
                  ) : null,
                )}
              </PassageGlossary>
              </div>
            </div>
          </div>

          <form key={activeQuestion.id} className="exam-question-panel" onSubmit={event => event.preventDefault()}>
            <AnswerLock {...(gameSession ? { className: "game-answer-lock", disabled: gameSession.lockedQuestionIds?.includes(activeQuestion.id) } : {})}>
            {gameSession?.lockedQuestionIds?.includes(activeQuestion.id) && <p className="game-locked-answer-note">Answer locked · Your result is shown above. You can still use tools and review the passage.</p>}
            <QuestionTimeTracker onElapsed={recordQuestionTime} questionId={activeQuestion.id} />
            <h1
              className="exam-highlightable"
              data-highlight-key={`prompt:${activeQuestion.id}`}
              id={activeQuestionTitleId}
            >
              {renderAuthoredText(activeQuestion.promptHtml, activeQuestion.prompt, `prompt:${activeQuestion.id}`)}
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
            {activeQuestion.type === "matrix_choice" && activeQuestion.items && activeQuestion.categories ? (
              <MatrixChoiceResponse
                answer={activeQuestionCategoryPlacements}
                onChange={(answer) => handleChangeStructuredAnswer(activeQuestion.id, answer)}
                question={activeQuestion}
              />
            ) : activeQuestion.type === "table_match" && activeQuestion.items && activeQuestion.categories ? (
              <div className="exam-table-match">
                <div
                  aria-label="Answer choice bank. Drop an answer here to undo a table selection."
                  className={`exam-table-match-bank ${
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
                        className={`exam-table-match-card ${
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
                        {item.html ? <span dangerouslySetInnerHTML={{ __html: item.html }} /> : item.text}
                      </button>
                    ))}
                </div>

                <table className="exam-table-match-table">
                  <thead>
                    <tr>
                      <th scope="col">{activeQuestion.tableHeaders?.row ?? "Rows"}</th>
                      <th scope="col">{activeQuestion.tableHeaders?.answer ?? "Answer"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeQuestion.categories.map((category) => {
                      const placedItems = activeQuestion.items?.filter(
                        (item) => activeQuestionCategoryPlacements[item.id] === category.id,
                      );
                      return (
                        <tr key={category.id}>
                          <th scope="row">{category.title}</th>
                          <td
                            className="exam-table-match-target"
                            onClick={() => handleCategoryClick(activeQuestion, category.id)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => handleCategoryDrop(activeQuestion, category.id, event)}
                          >
                            <div className="exam-table-match-slot">
                              {placedItems?.map((item) => (
                                <button
                                  className={`exam-table-match-card is-placed ${
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
                                  {item.html ? <span dangerouslySetInnerHTML={{ __html: item.html }} /> : item.text}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : activeQuestion.type === "category_sort" && activeQuestion.items && activeQuestion.categories ? (
              <div
                className={`exam-category-sort ${
                  activeQuestion.categoryCapacity === 1 ? "is-single-capacity" : ""
                } ${activeQuestion.categories.length === 1 ? "is-single-category" : ""}`}
              >
                <div
                  aria-label="Answer choice bank. Drop an answer here to undo a category selection."
                  role="group"
                  tabIndex={0}
                  onKeyDown={event => {
                    if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      handleCategoryBankClick(activeQuestion);
                    }
                  }}
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
                        {item.html ? <span dangerouslySetInnerHTML={{ __html: item.html }} /> : item.text}
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
                        role="group"
                        aria-label={`${category.title}. Select an answer, then press Enter here to place it.`}
                        tabIndex={0}
                        onKeyDown={event => {
                          if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                            event.preventDefault();
                            handleCategoryClick(activeQuestion, category.id);
                          }
                        }}
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
                              {item.html ? <span dangerouslySetInnerHTML={{ __html: item.html }} /> : item.text}
                            </button>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            ) : activeQuestion.type === "transition_drop" && activeQuestionChoices.length > 0 ? (
              <SentenceDragDrop key={activeQuestion.id} question={activeQuestion} answer={activePassageAnswer} onChange={answer => setSelectedAnswers(current => ({ ...current, [activeQuestion.id]: answer }))} />
            ) : (
              <div className="exam-choice-list">
                {activeQuestion.type === "multi_select" && activeQuestionChoices.length > 0 ? (
                  activeQuestionChoices.map((choice) => (
                    <label
                      className={`exam-choice ${
                        activeQuestionEliminatedChoiceIds.includes(choice.id) ? "is-eliminated" : ""
                      }`}
                      key={choice.id}
                      onClick={(event) => handleChoiceLabelClick(event, activeQuestion, choice.id)}
                    >
                      <input
                        checked={activeQuestionSelectedChoiceIds.includes(choice.id)}
                        name={activeQuestion.id}
                        onChange={() => handleChoiceClick(activeQuestion, choice.id)}
                        type="checkbox"
                      />
                      <span>{choice.id}.</span>
                      <span
                        className="exam-highlightable"
                        data-highlight-key={`choice:${activeQuestion.id}:${choice.id}`}
                      >
                        {renderAuthoredText(choice.html, choice.text, `choice:${activeQuestion.id}:${choice.id}`)}
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
                      onClick={(event) => handleChoiceLabelClick(event, activeQuestion, choice.id)}
                    >
                      <input
                        checked={selectedAnswers[activeQuestion.id] === choice.id}
                        name={activeQuestion.id}
                        onChange={() => handleChoiceClick(activeQuestion, choice.id)}
                        type="radio"
                      />
                      <span>{choice.id}.</span>
                      <span
                        className="exam-highlightable"
                        data-highlight-key={`choice:${activeQuestion.id}:${choice.id}`}
                      >
                        {renderAuthoredText(choice.html, choice.text, `choice:${activeQuestion.id}:${choice.id}`)}
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
          </AnswerLock>
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
              <h2>{sharedTools ? "Team Notepad · Your notes" : "Global Notepad"}</h2>
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
              maxLength={sharedTools ? 4000 : undefined}
            />
            <SharedToolNotes tools={sharedTools} noteKey={activePassageSet.id} />
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
        {...reviewToolbarProps}
        onNext={() => {
          setHighlightToolbar(null);
          setActivePassageSetIndex(0);
          setActiveQuestionIndex(0);
          setSessionScreen(activePassageSet ? "passageIntro" : standaloneQuestionCount > 0 ? "standaloneIntro" : "mathIntro");
        }}
        studentName={studentName}
      />

      <section className="exam-session-document" aria-labelledby="exam-session-title">
        <article className="exam-session-page">
          <header className="exam-session-page-header">
            <h1 id="exam-session-title">SHSAT Practice Test</h1>
            <p>Grade 8</p>
          </header>

          <section className="exam-session-content-block">
            <h2>General Directions</h2>
            <p>
              This test consists of {totalExamQuestionCount} questions in {[englishQuestionCount > 0 ? "English Language Arts" : "", mathQuestionCount > 0 ? "Mathematics" : ""].filter(Boolean).join(" and ")}.
            </p>

            <div className="exam-session-section-list">
              {englishQuestionCount > 0 && <><p>
                <strong>PART 1 - ENGLISH LANGUAGE ARTS</strong>
                <strong>{englishQuestionCount} QUESTIONS</strong>
              </p>
              <p className="exam-session-question-range">Questions 1-{englishQuestionCount}</p></>}

              {mathQuestionCount > 0 && <><p>
                <strong>PART {englishQuestionCount > 0 ? 2 : 1} - MATHEMATICS</strong>
                <strong>{mathQuestionCount} QUESTIONS</strong>
              </p>
              <p className="exam-session-question-range">
                Questions {englishQuestionCount + 1}-{totalExamQuestionCount}
              </p></>}
            </div>
          </section>

          <hr />

          <section className="exam-session-content-block">
            <h2>Planning Your Time</h2>
            <ul>
              <li>
                {assessment.canEditSubmittedSections ? <>The first timed attempt allows {formatDuration(assessment.durationMinutes)}. You can revisit submitted work while your teacher keeps the exam open.</> : <>If the timer is enabled, your session will end after {formatDuration(assessment.durationMinutes)}.</>}
              </li>
              <li>
                Answer every question. Use Previous, Next, or Review to navigate within your current passage set or section.
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
                {assessment.canEditSubmittedSections ? "Your answers stay saved after submission. You can return to and revise any section your teacher keeps open." : "Complete the subject area you started before moving to the next subject area. Once submitted, that subject area will be locked."}
              </li>
            </ul>
          </section>
        </article>
      </section>
    </main>
  );
}
