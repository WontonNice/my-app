import { useEffect, useRef, useState, type DragEvent, type MouseEvent, type ReactNode } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
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
  User,
  X,
} from "lucide-react";
import {
  resolveExamContent,
  type ExamNumberLine,
  type ExamQuestion,
} from "../content/exams";
import { getExamSessionProgress, getLearningProgress, getStudentAssessment, getTeacherStudentProgress, saveCloudExamResult, saveExamSessionProgress, type TeacherAssessment } from "../lib/api";
import { getUserRole } from "../lib/auth";
import { formatDuration, getAssessmentIdFromPath, getDisplayName } from "../lib/exam";
import {
  getExamTimerDisplay,
  loadExamTimer,
  pauseExamTimer,
  resetExamTimer,
  resumeExamTimer,
  saveExamTimerState,
  type ExamTimerState,
} from "../lib/examTimer";
import {
  getCurrentCompletedSections,
  getNextExamSubject,
  getOpenExamSubject,
  getStoredStartingSubject,
  isExamResultCompleteForQuestionCount,
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
type BoldTextRange = {
  end: number;
  start: number;
};

function isTextEntryQuestion(question: ExamQuestion) {
  return (
    question.type === "short_response" ||
    question.type === "numeric_entry" ||
    question.type === "grid_in"
  );
}

function usesMathEntryKeypad(question: ExamQuestion) {
  return question.type === "numeric_entry" || question.type === "grid_in";
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
  return question.requiredSelections ?? question.correctPointIds?.length ?? question.correctChoiceIds?.length ?? 2;
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

function renderKatexExpression(expression: string, displayMode = false) {
  const markup = katex.renderToString(expression, {
    displayMode,
    output: "htmlAndMathml",
    strict: false,
    throwOnError: false,
    trust: false,
  });
  return (
    <span
      className={displayMode ? "exam-katex-display" : "exam-katex-inline"}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function renderMathExpression(expression: string) {
  return (
    <span className="exam-math-expression" aria-label={expression}>
      {renderKatexExpression(expression)}
    </span>
  );
}

function ExamNumberLineGraphic({
  description,
  numberLine,
}: {
  description: string;
  numberLine: ExamNumberLine;
}) {
  const min = Number.isFinite(numberLine.min) ? numberLine.min : -10;
  const max = Number.isFinite(numberLine.max) && numberLine.max > min ? numberLine.max : min + 20;
  const tickStep =
    Number.isFinite(numberLine.tickStep) && numberLine.tickStep > 0
      ? numberLine.tickStep
      : 1;
  const labelStep =
    Number.isFinite(numberLine.labelStep) && numberLine.labelStep > 0
      ? numberLine.labelStep
      : 5;
  const solutionStart = Math.max(min, Math.min(max, numberLine.solutionStart));
  const solutionEnd = Math.max(
    solutionStart,
    Math.min(max, numberLine.solutionEnd),
  );
  const axisStart = 18;
  const axisEnd = 312;
  const axisY = 25;
  const xFor = (value: number) =>
    axisStart + ((value - min) / (max - min)) * (axisEnd - axisStart);
  const formatValue = (value: number) =>
    String(Number(value.toFixed(6))).replace("-", "−");
  const tickCount = Math.min(
    100,
    Math.floor((max - min) / tickStep + 0.000001),
  );
  const ticks = Array.from({ length: tickCount + 1 }, (_, index) => {
    const value = min + index * tickStep;
    const labelRatio = (value - min) / labelStep;
    return {
      showLabel:
        Math.abs(labelRatio - Math.round(labelRatio)) < 0.000001,
      value,
      x: xFor(value),
    };
  }).filter((tick) => tick.value <= max + tickStep / 1000);
  const lastTick = ticks.at(-1);
  if (!lastTick || Math.abs(lastTick.value - max) > 0.000001) {
    ticks.push({ showLabel: true, value: max, x: xFor(max) });
  }
  const solutionX1 = numberLine.extendLeft
    ? axisStart + 4
    : xFor(solutionStart);
  const solutionX2 = numberLine.extendRight
    ? axisEnd - 4
    : xFor(solutionEnd);

  return (
    <svg
      aria-label={description}
      className="exam-number-line"
      role="img"
      viewBox="0 0 330 58"
    >
      <title>{description}</title>
      <line
        stroke="currentColor"
        strokeWidth="1.4"
        x1={axisStart}
        x2={axisEnd}
        y1={axisY}
        y2={axisY}
      />
      <path
        d={`M ${axisStart} ${axisY} l 7 -4 v 8 z`}
        fill="currentColor"
      />
      <path
        d={`M ${axisEnd} ${axisY} l -7 -4 v 8 z`}
        fill="currentColor"
      />
      {ticks.map((tick, index) => (
        <g key={`${tick.value}-${index}`}>
          <line
            stroke="currentColor"
            strokeWidth={tick.showLabel ? 1.4 : 1}
            x1={tick.x}
            x2={tick.x}
            y1={tick.showLabel ? 17 : 19}
            y2={33}
          />
          {tick.showLabel ? (
            <text
              fill="currentColor"
              fontFamily="Arial, sans-serif"
              fontSize="11"
              textAnchor="middle"
              x={tick.x}
              y="49"
            >
              {formatValue(tick.value)}
            </text>
          ) : null}
        </g>
      ))}
      <line
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
        x1={solutionX1}
        x2={solutionX2}
        y1={axisY}
        y2={axisY}
      />
      {numberLine.extendLeft ? (
        <path
          d={`M ${axisStart + 2} ${axisY} l 8 -5 v 10 z`}
          fill="currentColor"
        />
      ) : (
        <circle
          cx={solutionX1}
          cy={axisY}
          fill={numberLine.startClosed ? "currentColor" : "#fff"}
          r="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      {numberLine.extendRight ? (
        <path
          d={`M ${axisEnd - 2} ${axisY} l -8 -5 v 10 z`}
          fill="currentColor"
        />
      ) : (
        <circle
          cx={solutionX2}
          cy={axisY}
          fill={numberLine.endClosed ? "currentColor" : "#fff"}
          r="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}

function renderInlineMathText(expression: string) {
  return renderKatexExpression(expression);
}

function renderInteractionMath(text: string, keyPrefix: string) {
  return text
    .split(/(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("\\[") && part.endsWith("\\]")) {
        return (
          <span className="exam-katex-template-display" key={`${keyPrefix}-display-${index}`}>
            {renderKatexExpression(part.slice(2, -2), true)}
          </span>
        );
      }
      if (part.startsWith("\\(") && part.endsWith("\\)")) {
        return (
          <span className="exam-inline-math" key={`${keyPrefix}-inline-${index}`}>
            {renderKatexExpression(part.slice(2, -2))}
          </span>
        );
      }
      return part.split("\n").map((line, lineIndex, lines) => (
        <span key={`${keyPrefix}-text-${index}-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 ? <br /> : null}
        </span>
      ));
    });
}

function MathEntryResponse({
  layout,
  onChange,
  value,
}: {
  layout: "fraction" | "plain" | "x_equals";
  onChange: (value: string) => void;
  value: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const numeratorRef = useRef<HTMLInputElement>(null);
  const denominatorRef = useRef<HTMLInputElement>(null);
  const [activePart, setActivePart] = useState<"denominator" | "numerator">("numerator");
  const [redoValues, setRedoValues] = useState<string[]>([]);
  const [undoValues, setUndoValues] = useState<string[]>([]);
  const [numerator = "", denominator = ""] = layout === "fraction" ? value.split("/", 2) : ["", ""];

  function commit(nextValue: string) {
    if (nextValue === value) return;
    setUndoValues((current) => [...current.slice(-39), value]);
    setRedoValues([]);
    onChange(nextValue);
  }

  function replaceActiveText(replacement: string) {
    if (layout === "fraction") {
      const nextNumerator = activePart === "numerator" ? `${numerator}${replacement}` : numerator;
      const nextDenominator = activePart === "denominator" ? `${denominator}${replacement}` : denominator;
      commit(`${nextNumerator}/${nextDenominator}`);
      window.requestAnimationFrame(() => {
        (activePart === "numerator" ? numeratorRef.current : denominatorRef.current)?.focus();
      });
      return;
    }

    const input = inputRef.current;
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? start;
    commit(`${value.slice(0, start)}${replacement}${value.slice(end)}`);
    window.requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + replacement.length, start + replacement.length);
    });
  }

  function moveCaret(direction: -1 | 1) {
    const input =
      layout === "fraction"
        ? activePart === "numerator"
          ? numeratorRef.current
          : denominatorRef.current
        : inputRef.current;
    if (!input) return;
    const position = Math.max(0, Math.min((input.selectionStart ?? input.value.length) + direction, input.value.length));
    input.focus();
    input.setSelectionRange(position, position);
  }

  function removeLastCharacter() {
    if (layout === "fraction") {
      const currentPart = activePart === "numerator" ? numerator : denominator;
      const nextPart = currentPart.slice(0, -1);
      commit(activePart === "numerator" ? `${nextPart}/${denominator}` : `${numerator}/${nextPart}`);
      return;
    }
    const input = inputRef.current;
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? start;
    if (start !== end) commit(`${value.slice(0, start)}${value.slice(end)}`);
    else if (start > 0) commit(`${value.slice(0, start - 1)}${value.slice(end)}`);
  }

  function undo() {
    const previous = undoValues.at(-1);
    if (previous === undefined) return;
    setUndoValues((current) => current.slice(0, -1));
    setRedoValues((current) => [value, ...current].slice(0, 40));
    onChange(previous);
  }

  function redo() {
    const next = redoValues[0];
    if (next === undefined) return;
    setRedoValues((current) => current.slice(1));
    setUndoValues((current) => [...current.slice(-39), value]);
    onChange(next);
  }

  return (
    <div className="exam-math-entry-response">
      <div className={`exam-math-entry-display is-${layout}`}>
        {layout === "x_equals" ? <span>{renderKatexExpression("x =")}</span> : null}
        {layout === "fraction" ? (
          <span className="exam-math-entry-fraction">
            <input
              aria-label="Fraction numerator"
              inputMode="decimal"
              onChange={(event) => onChange(`${event.target.value}/${denominator}`)}
              onFocus={() => setActivePart("numerator")}
              ref={numeratorRef}
              value={numerator}
            />
            <span aria-hidden="true" />
            <input
              aria-label="Fraction denominator"
              inputMode="decimal"
              onChange={(event) => onChange(`${numerator}/${event.target.value}`)}
              onFocus={() => setActivePart("denominator")}
              ref={denominatorRef}
              value={denominator}
            />
          </span>
        ) : (
          <input
            aria-label="Answer"
            inputMode="decimal"
            onChange={(event) => onChange(event.target.value)}
            ref={inputRef}
            type="text"
            value={value}
          />
        )}
      </div>
      <div aria-label="Math answer keypad" className="exam-math-keypad">
        <div className="exam-math-keypad-tools">
          <button aria-label="Move cursor left" onClick={() => moveCaret(-1)} type="button">←</button>
          <button aria-label="Move cursor right" onClick={() => moveCaret(1)} type="button">→</button>
          <button aria-label="Undo" disabled={!undoValues.length} onClick={undo} type="button">↶</button>
          <button aria-label="Redo" disabled={!redoValues.length} onClick={redo} type="button">↷</button>
          <button aria-label="Backspace" onClick={removeLastCharacter} type="button">⌫</button>
          <button aria-label="Clear answer" onClick={() => commit(layout === "fraction" ? "/" : "")} type="button">⌧</button>
        </div>
        {[["1", "2", "3", "4", "5"], ["6", "7", "8", "9", "0"]].map((row, rowIndex) => (
          <div className="exam-math-keypad-row" key={`keypad-row-${rowIndex}`}>
            {row.map((key) => (
              <button
                key={key}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => replaceActiveText(key)}
                type="button"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="exam-math-keypad-row">
          <button onClick={() => replaceActiveText("%")} type="button">%</button>
          <button onClick={() => replaceActiveText("-")} type="button">−</button>
          <button onClick={() => replaceActiveText(".")} type="button">.</button>
          <button
            aria-label="Fraction"
            onClick={() => {
              if (layout === "fraction") {
                setActivePart("denominator");
                denominatorRef.current?.focus();
              } else replaceActiveText("/");
            }}
            type="button"
          >
            a⁄b
          </button>
          <button aria-label="Mixed number" onClick={() => replaceActiveText(" ")} type="button">1 a⁄b</button>
        </div>
      </div>
    </div>
  );
}

function MathDragDropResponse({
  answer,
  onChange,
  question,
}: {
  answer: CategoryPlacements;
  onChange: (answer: CategoryPlacements) => void;
  question: ExamQuestion;
}) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const items = question.items ?? [];
  const slots = question.dragDropSlots ?? [];
  const placedItemIds = Object.values(answer);
  const availableItems = question.allowReuse
    ? items
    : items.filter((item) => !placedItemIds.includes(item.id));

  function place(itemId: string, slotId: string) {
    if (!itemId || !slots.some((slot) => slot.id === slotId)) return;
    const next = { ...answer };
    if (!question.allowReuse) {
      Object.entries(next).forEach(([existingSlotId, existingItemId]) => {
        if (existingItemId === itemId) delete next[existingSlotId];
      });
    }
    next[slotId] = itemId;
    onChange(next);
    setSelectedItemId("");
  }

  function renderSlot(slotId: string, key: string) {
    const placedItem = items.find((item) => item.id === answer[slotId]);
    return (
      <button
        aria-label={placedItem ? `Answer ${placedItem.text}. Click to remove.` : "Empty answer box"}
        className={`exam-math-drag-slot ${placedItem ? "is-filled" : ""}`}
        key={key}
        onClick={() => {
          if (selectedItemId) place(selectedItemId, slotId);
          else if (placedItem) {
            const next = { ...answer };
            delete next[slotId];
            onChange(next);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          place(event.dataTransfer.getData("text/plain"), slotId);
        }}
        type="button"
      >
        {placedItem ? renderInteractionMath(placedItem.text, `${key}-placed`) : "\u00a0"}
      </button>
    );
  }

  function renderLine(template: string, lineIndex: number) {
    return template
      .split(/(\{\{[\w-]+\}\})/g)
      .filter(Boolean)
      .map((part, partIndex) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          return renderSlot(part.slice(2, -2), `drag-slot-${lineIndex}-${partIndex}`);
        }
        return renderInteractionMath(part, `drag-text-${lineIndex}-${partIndex}`);
      });
  }

  return (
    <div className="exam-math-drag-response">
      <div
        aria-label="Answer bank"
        className="exam-math-drag-bank"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const itemId = event.dataTransfer.getData("text/plain");
          const slotId = Object.keys(answer).find((candidate) => answer[candidate] === itemId);
          if (slotId) {
            const next = { ...answer };
            delete next[slotId];
            onChange(next);
          }
        }}
      >
        {availableItems.map((item) => (
          <button
            className={selectedItemId === item.id ? "is-selected" : ""}
            draggable
            key={item.id}
            onClick={() => setSelectedItemId((current) => current === item.id ? "" : item.id)}
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", item.id);
              setSelectedItemId(item.id);
            }}
            type="button"
          >
            {renderInteractionMath(item.text, `drag-bank-${item.id}`)}
          </button>
        ))}
      </div>
      <div className="exam-math-drag-lines">
        {(question.dragDropContent ?? []).map((line, lineIndex) => (
          <div className="exam-math-drag-line" key={`drag-line-${lineIndex}`}>
            {renderLine(line, lineIndex)}
          </div>
        ))}
      </div>
    </div>
  );
}

function GraphPointResponse({
  onToggle,
  question,
  selectedIds,
}: {
  onToggle: (pointId: string) => void;
  question: ExamQuestion;
  selectedIds: string[];
}) {
  const graph = question.graph;
  if (!graph) return null;
  const axisLeft = 64;
  const axisRight = 404;
  const axisTop = 38;
  const axisBottom = 378;
  const xFor = (value: number) => axisLeft + ((value - graph.xMin) / (graph.xMax - graph.xMin)) * (axisRight - axisLeft);
  const yFor = (value: number) => axisBottom - ((value - graph.yMin) / (graph.yMax - graph.yMin)) * (axisBottom - axisTop);
  const xTicks = Array.from(
    { length: Math.floor((graph.xMax - graph.xMin) / graph.xStep) + 1 },
    (_, index) => graph.xMin + index * graph.xStep,
  );
  const yTicks = Array.from(
    { length: Math.floor((graph.yMax - graph.yMin) / graph.yStep) + 1 },
    (_, index) => graph.yMin + index * graph.yStep,
  );

  return (
    <div className="exam-graph-point-response">
      {graph.title ? <h2>{graph.title}</h2> : null}
      <svg aria-label="Selectable coordinate graph" role="group" viewBox="0 0 470 440">
        {xTicks.map((value) => (
          <g key={`x-${value}`}>
            <line className="exam-graph-grid-line" x1={xFor(value)} x2={xFor(value)} y1={axisTop} y2={axisBottom} />
            <text x={xFor(value)} y={axisBottom + 22}>{value}</text>
          </g>
        ))}
        {yTicks.map((value) => (
          <g key={`y-${value}`}>
            <line className="exam-graph-grid-line" x1={axisLeft} x2={axisRight} y1={yFor(value)} y2={yFor(value)} />
            <text textAnchor="end" x={axisLeft - 10} y={yFor(value) + 5}>{value}</text>
          </g>
        ))}
        <line className="exam-graph-axis" x1={axisLeft} x2={axisRight + 20} y1={axisBottom} y2={axisBottom} />
        <line className="exam-graph-axis" x1={axisLeft} x2={axisLeft} y1={axisBottom + 4} y2={axisTop - 20} />
        <text className="exam-graph-x-label" textAnchor="middle" x={(axisLeft + axisRight) / 2} y="432">{graph.xLabel}</text>
        <text className="exam-graph-y-label" textAnchor="middle" transform="rotate(-90 18 208)" x="18" y="208">{graph.yLabel}</text>
        {graph.points.map((point) => {
          const selected = selectedIds.includes(point.id);
          return (
            <g
              aria-label={`Point ${point.x}, ${point.y}${selected ? ", selected" : ""}`}
              className={`exam-graph-point ${selected ? "is-selected" : ""}`}
              key={point.id}
              onClick={() => onToggle(point.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggle(point.id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <circle cx={xFor(point.x)} cy={yFor(point.y)} r="11" />
              {selected ? <path d={`M ${xFor(point.x) - 5} ${yFor(point.y)} l 4 4 l 7 -8`} /> : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function NumberLineResponse({
  answer,
  onChange,
  question,
}: {
  answer: CategoryPlacements;
  onChange: (answer: CategoryPlacements) => void;
  question: ExamQuestion;
}) {
  const config = question.numberLineResponse;
  if (!config) return null;
  const axisLeft = 48;
  const axisRight = 572;
  const axisY = 78;
  const xFor = (value: number) => axisLeft + ((value - config.min) / (config.max - config.min)) * (axisRight - axisLeft);
  const ticks = Array.from(
    { length: Math.floor((config.max - config.min) / config.tickStep) + 1 },
    (_, index) => config.min + index * config.tickStep,
  );
  const selectedValue = Number(answer.value);
  const hasValue = answer.value !== undefined && Number.isFinite(selectedValue);
  const direction = answer.direction as "left" | "right" | undefined;
  const endpoint = answer.endpoint as "closed" | "open" | undefined;

  function chooseRay(nextDirection: "left" | "right", nextEndpoint: "closed" | "open") {
    onChange({ ...answer, direction: nextDirection, endpoint: nextEndpoint });
  }

  return (
    <div className="exam-number-line-response">
      <svg
        aria-label="Interactive number line"
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const svgX = ((event.clientX - bounds.left) / bounds.width) * 620;
          const rawValue = config.min + ((svgX - axisLeft) / (axisRight - axisLeft)) * (config.max - config.min);
          const snapped = Math.max(config.min, Math.min(config.max, Math.round(rawValue / config.tickStep) * config.tickStep));
          onChange({ ...answer, value: String(Number(snapped.toFixed(6))) });
        }}
        role="application"
        viewBox="0 0 620 130"
      >
        <line className="exam-number-line-axis" x1={axisLeft} x2={axisRight} y1={axisY} y2={axisY} />
        <path className="exam-number-line-axis" d={`M ${axisLeft} ${axisY} l 18 -24 M ${axisLeft} ${axisY} l 18 24`} />
        <path className="exam-number-line-axis" d={`M ${axisRight} ${axisY} l -18 -24 M ${axisRight} ${axisY} l -18 24`} />
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="exam-number-line-tick" x1={xFor(tick)} x2={xFor(tick)} y1={axisY - 28} y2={axisY + 28} />
            <text textAnchor="middle" x={xFor(tick)} y={axisY - 38}>{tick}</text>
          </g>
        ))}
        {hasValue && direction && endpoint ? (
          <g className="exam-number-line-selected-ray">
            <line
              x1={direction === "left" ? axisLeft + 8 : xFor(selectedValue)}
              x2={direction === "right" ? axisRight - 8 : xFor(selectedValue)}
              y1={axisY}
              y2={axisY}
            />
            <circle
              cx={xFor(selectedValue)}
              cy={axisY}
              fill={endpoint === "closed" ? "currentColor" : "#fff"}
              r="10"
            />
          </g>
        ) : null}
      </svg>
      <p className="exam-number-line-help">
        {hasValue ? `Endpoint: ${selectedValue}.` : "Click the number line to place the endpoint."}
      </p>
      <div aria-label="Choose a ray" className="exam-number-line-ray-picker">
        {[
          ["left", "closed", "←●", "Left ray with a closed endpoint"],
          ["left", "open", "←○", "Left ray with an open endpoint"],
          ["right", "open", "○→", "Right ray with an open endpoint"],
          ["right", "closed", "●→", "Right ray with a closed endpoint"],
        ].map(([rayDirection, rayEndpoint, symbol, label]) => (
          <button
            aria-label={label}
            className={direction === rayDirection && endpoint === rayEndpoint ? "is-selected" : ""}
            key={`${rayDirection}-${rayEndpoint}`}
            onClick={() => chooseRay(rayDirection as "left" | "right", rayEndpoint as "closed" | "open")}
            type="button"
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
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

  if (question.type === "multi_select" || question.type === "graph_point_select") {
    return getSelectedChoiceIds(selectedAnswers[question.id]).length >= getRequiredSelectionCount(question);
  }

  if (question.type === "math_drag_drop") {
    const placements = getCategoryPlacements(selectedAnswers[question.id]);
    const slots = question.dragDropSlots ?? [];
    return slots.length > 0 && slots.every((slot) => Boolean(placements[slot.id]));
  }

  if (question.type === "number_line_response") {
    const response = getCategoryPlacements(selectedAnswers[question.id]);
    return Boolean(response.direction && response.endpoint && response.value !== undefined);
  }

  if (question.type === "category_sort" || question.type === "table_match") {
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

  if (question.type === "category_sort" || question.type === "table_match") {
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
}: {
  isUserMenuOpen?: boolean;
  onPauseTimer?: () => void;
  onToggleUserMenu?: () => void;
  studentName: string;
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
  reviewFilter = "all",
  reviewItems = [],
  reviewQuestionCount = 0,
  showExhibits = false,
  showReviewTools = true,
  showStatusIcon = true,
  showTimer = true,
  showWorkTools = true,
  isTimerOvertime = false,
  isTimerVisible = false,
  isUserMenuOpen = false,
  timerText = "3:00:00",
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
  isTimerOvertime?: boolean;
  isTimerVisible?: boolean;
  isUserMenuOpen?: boolean;
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
  reviewFilter?: ReviewFilter;
  reviewItems?: ReviewItem[];
  reviewQuestionCount?: number;
  showExhibits?: boolean;
  showReviewTools?: boolean;
  showStatusIcon?: boolean;
  showTimer?: boolean;
  showWorkTools?: boolean;
  timerText?: string;
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
                    Pause timer
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
    </>
  );
}

export function ExamSessionPage() {
  const [accessToken, setAccessToken] = useState("");
  const [assessment, setAssessment] = useState<TeacherAssessment | null>(null);
  const [activeTool, setActiveTool] = useState<ExamTool>("pointer");
  const [activeMathQuestionIndex, setActiveMathQuestionIndex] = useState(0);
  const [activePassageSetIndex, setActivePassageSetIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeStandaloneQuestionIndex, setActiveStandaloneQuestionIndex] = useState(0);
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([]);
  const [choiceLimitWarnings, setChoiceLimitWarnings] = useState<ChoiceLimitWarning[]>([]);
  const [completedSections, setCompletedSections] = useState<ExamSection[]>([]);
  const [eliminatedChoices, setEliminatedChoices] = useState<EliminatedChoices>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [highlightToolbar, setHighlightToolbar] = useState<HighlightToolbarState | null>(null);
  const [isFastForwardEnabled, setIsFastForwardEnabled] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [isUnansweredModalOpen, setIsUnansweredModalOpen] = useState(false);
  const [isTeacherPreviewSession, setIsTeacherPreviewSession] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [passageNotes, setPassageNotes] = useState<PassageNotes>({});
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [selectedCategoryItemId, setSelectedCategoryItemId] = useState("");
  const [sessionScreen, setSessionScreen] = useState<SessionScreen>("directions");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("Student");
  const [textHighlights, setTextHighlights] = useState<TextHighlights>({});
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const [timerState, setTimerState] = useState<ExamTimerState | null>(null);
  const autosaveInFlightRef = useRef(false);
  const autosavePromiseRef = useRef<Promise<void> | null>(null);
  const finalSubmissionRef = useRef(false);
  const latestAnswersRef = useRef<SelectedAnswers>({});
  const lastAutosaveSignatureRef = useRef("");

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

      const previewContext = getStudentPreviewContext();
      const fallbackName = previewContext.studentName || getDisplayName(data.session.user);
      const storedStartingSubject = getStoredStartingSubject(assessmentId);
      setTimerState(loadExamTimer(assessmentId));
      setTimerNow(Date.now());
      setStudentId(data.session.user.id);
      setAccessToken(data.session.access_token);
      setStudentName(getStoredExamName(assessmentId, fallbackName));
      const isTeacherPreview = previewContext.isPreview && getUserRole(data.session.user) === "teacher";
      setIsTeacherPreviewSession(isTeacherPreview);

      try {
        const nextAssessment = await getStudentAssessment(data.session.access_token, assessmentId);
        setAssessment(nextAssessment);
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
                ? cloudSession
                : localProgress;
            savedResult =
              (cloudLearningProgress.examResults.find((candidate) => candidate.assessmentId === assessmentId) as unknown as
                NonNullable<ReturnType<typeof getExamResult>> | undefined) ??
              savedResult;
          } catch {
            // Continue with the locally saved English answers when cloud sync is unavailable.
          }
        }
        if (!progress && savedResult) {
          progress = {
            answers: savedResult.answers,
            completedSections: savedResult.completedSections,
            status: savedResult.completionStatus === "complete" ? "submitted" : "in_progress",
            submittedAt: savedResult.completedAt,
            updatedAt: savedResult.completedAt,
          };
        }
        const examContent = resolveExamContent(nextAssessment);
        const hasCompletedAttempt =
          isExamSessionCompleteForContent(examContent, progress) ||
          isExamResultCompleteForQuestionCount(savedResult, nextAssessment.questions.length);
        if (
          !isTeacherPreview &&
          hasCompletedAttempt &&
          !nextAssessment.allowCompletedAccess
        ) {
          window.location.assign(getAssessmentDashboardHref());
          return;
        }
        const isReopeningCompletedAttempt =
          !isTeacherPreview && hasCompletedAttempt && nextAssessment.allowCompletedAccess;
        const effectiveSectionAccess = isTeacherPreview
          ? { english: true, math: true }
          : nextAssessment.sectionAccess;
        const savedCompletedSections = getCurrentCompletedSections(examContent, progress);
        const currentCompletedSections = isReopeningCompletedAttempt
          ? savedCompletedSections.filter((section) => !effectiveSectionAccess[section])
          : savedCompletedSections;
        setCompletedSections(currentCompletedSections);
        const preferredStartingSubject = isReopeningCompletedAttempt
          ? storedStartingSubject
          : getNextExamSubject(storedStartingSubject, currentCompletedSections);
        const openStartingSubject = getOpenExamSubject(
          preferredStartingSubject,
          effectiveSectionAccess,
        );
        if (!openStartingSubject) {
          window.location.assign(getAssessmentDashboardHref());
          return;
        }
        nextStartingSubject = openStartingSubject;
        if (progress) {
          setSelectedAnswers((progress.answers ?? {}) as SelectedAnswers);
          if (nextStartingSubject === "math") {
            const firstUnansweredMathIndex =
              examContent.mathSection?.questions.findIndex((question) =>
                !Object.prototype.hasOwnProperty.call(progress.answers, question.id),
              ) ?? -1;
            setActiveMathQuestionIndex(firstUnansweredMathIndex >= 0 ? firstUnansweredMathIndex : 0);
          }
        }
        window.sessionStorage.setItem(`exam-start-subject:${assessmentId}`, nextStartingSubject);
        setSessionScreen(nextStartingSubject === "math" ? "mathIntro" : "directions");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Could not load this exam.");
      } finally {
        setIsCheckingSession(false);
      }
    }

    loadExamSession();
  }, []);

  useEffect(() => {
    latestAnswersRef.current = selectedAnswers;
    if (!assessment || !studentId || isCheckingSession || isTeacherPreviewSession || sessionScreen === "testOver") return;
    saveLocalExamSession(studentId, assessment.id, selectedAnswers, completedSections);
  }, [assessment, completedSections, isCheckingSession, isTeacherPreviewSession, selectedAnswers, sessionScreen, studentId]);

  useEffect(() => {
    if (!assessment || !accessToken || isCheckingSession || isTeacherPreviewSession || sessionScreen === "testOver") return;

    const assessmentId = assessment.id;
    async function syncAnswers() {
      const answers = latestAnswersRef.current;
      if (autosaveInFlightRef.current || finalSubmissionRef.current) return;
      const signature = JSON.stringify({ answers, completedSections });
      if (signature === lastAutosaveSignatureRef.current) return;
      autosaveInFlightRef.current = true;
      const savePromise = saveExamSessionProgress(accessToken, assessmentId, {
        answers: answers as Record<string, unknown>,
        completedSections,
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
  }, [accessToken, assessment, completedSections, isCheckingSession, isTeacherPreviewSession, sessionScreen]);

  useEffect(() => {
    if (!timerState || timerState.pausedAt !== null) {
      return;
    }

    const timerInterval = window.setInterval(() => setTimerNow(Date.now()), 1000);
    return () => window.clearInterval(timerInterval);
  }, [timerState]);

  useEffect(() => {
    if (!assessment || isCheckingSession || sessionScreen === "testOver") {
      return;
    }

    function confirmBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", confirmBeforeLeaving);
    return () => window.removeEventListener("beforeunload", confirmBeforeLeaving);
  }, [assessment, isCheckingSession, sessionScreen]);

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
          <a href={getAssessmentDashboardHref()}>Return to assessments</a>
        </section>
      </main>
    );
  }

  const currentAssessmentId = assessment.id;
  const isSplitAssessment = assessment.split;
  const canAccessEnglish = isTeacherPreviewSession || assessment.sectionAccess.english;
  const canAccessMath = isTeacherPreviewSession || assessment.sectionAccess.math;
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
  const isExpandedQuestionLayout =
    activeQuestion.type === "category_sort" ||
    activeQuestion.type === "table_match" ||
    hasLongAnswerContent;
  const activeQuestionSelectedChoiceIds = getSelectedChoiceIds(selectedAnswers[activeQuestion.id]);
  const activeQuestionCategoryPlacements = getCategoryPlacements(selectedAnswers[activeQuestion.id]);
  const activeQuestionEliminatedChoiceIds = eliminatedChoices[activeQuestion.id] ?? [];
  const activeTransitionChoiceId =
    typeof selectedAnswers[activeQuestion.id] === "string" ? selectedAnswers[activeQuestion.id] : "";
  const activeTransitionChoice = activeQuestionChoices.find(
    (choice) => choice.id === activeTransitionChoiceId,
  );
  const activeQuestionTitleId = `question-title-${activeQuestion.id}`;
  const passageQuestionCount = examContent.passageSets.reduce(
    (total, passageSet) => total + passageSet.questions.length,
    0,
  );
  const standaloneQuestionCount = standaloneSection?.questions.length ?? 0;
  const mathQuestionCount = mathQuestions.length;
  const englishQuestionCount = passageQuestionCount + standaloneQuestionCount;
  const totalExamQuestionCount = passageQuestionCount + standaloneQuestionCount + mathQuestionCount;
  const assessmentLabel = examContent.title.toUpperCase();
  const timerDisplay = timerState
    ? getExamTimerDisplay(timerState, timerNow)
    : { isOvertime: false, text: "3:00:00" };
  const isExamPaused = Boolean(timerState && timerState.pausedAt !== null);
  const activePassageSection =
    activePassageSet.section ?? examContent.passageSections?.[activePassageSet.id] ?? "reading";
  const passageSetDisplayLabel =
    activePassageSection === "reading"
      ? "ELA Rdg Comp"
      : activePassageSection === "revising_editing_a"
        ? "ELA Rev/Edit A"
        : activePassageSet.label ?? getPassageSetLabel(activePassageSetIndex, examContent.passageSets.length);
  const passageSetLabel = passageSetDisplayLabel.toUpperCase();
  const isProsePassage = activePassageSet.passage.format === "prose";
  const isSentenceProsePassage = activePassageSet.passage.format === "sentence_prose";
  const hasNextPassageSet = activePassageSetIndex < examContent.passageSets.length - 1;
  const shouldShowPassageDirections = activePassageSetIndex === 0 || Boolean(activePassageSet.showDirectionsBefore);
  const reviewItems: ReviewItem[] = [];
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

  if (sessionScreen === "directions") {
    reviewItems.push({
      id: "review:directions:general",
      kind: "directions",
      label: "General Directions",
    });
  } else if (
    sessionScreen === "readingDirections" ||
    sessionScreen === "passage" ||
    sessionScreen === "passageEnd"
  ) {
    if (shouldShowPassageDirections) {
      reviewItems.push({
        id: `review:directions:passage:${activePassageSetIndex}`,
        kind: "directions",
        label: activePassageSet.directions.breadcrumbLabel ?? "ELA Rdg Comp Directions",
      });
    }

    const accessibleQuestionCount =
      isFastForwardEnabled || sessionScreen === "passageEnd"
        ? activePassageSet.questions.length
        : sessionScreen === "passage"
          ? activeQuestionIndex + 1
          : 0;
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
    const firstQuestionIndex = isFastForwardEnabled ? 0 : activeStandaloneQuestionIndex;
    standaloneSection.questions
      .slice(firstQuestionIndex, activeStandaloneQuestionIndex + 1)
      .forEach((question, localIndex) => {
        const questionIndex = firstQuestionIndex + localIndex;
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
    const firstQuestionIndex = isFastForwardEnabled ? 0 : activeMathQuestionIndex;
    mathQuestions
      .slice(firstQuestionIndex, activeMathQuestionIndex + 1)
      .forEach((question, localIndex) => {
        const questionIndex = firstQuestionIndex + localIndex;
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
  const directionsBreadcrumbLabel =
    activePassageSet.directions.breadcrumbLabel ??
    `${activePassageSet.directions.title.split(" ").slice(0, 3).join(" ")} DIRECTIONS`;

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
      const result = createExamResult(examContent, answers);
      if (accessToken && !isTeacherPreviewSession) {
        await saveCloudExamResult(
          accessToken,
          result.assessmentId,
          result as unknown as Record<string, unknown>,
        );
        try {
          await saveExamSessionProgress(accessToken, result.assessmentId, {
            answers: answers as Record<string, unknown>,
            completedSections: ["english", "math"],
            status: "submitted",
          });
        } catch {
          // The submitted result itself also contains the permanent answer record.
        }
      }
      saveExamResult(studentId, result);
      saveLocalExamSession(studentId, result.assessmentId, answers, ["english", "math"], "submitted");
      setCompletedSections(["english", "math"]);
    } catch (error) {
      finalSubmissionRef.current = false;
      throw error;
    }
  }

  async function saveSectionCompletion(section: ExamSection) {
    if (!studentId) {
      throw new Error("Your student session is unavailable. Refresh and try again.");
    }

    const nextCompletedSections = [...new Set([...completedSections, section])];
    finalSubmissionRef.current = true;
    try {
      await autosavePromiseRef.current;
      if (!isTeacherPreviewSession) {
        saveLocalExamSession(studentId, currentAssessmentId, selectedAnswers, nextCompletedSections);
        if (accessToken) {
          await saveExamSessionProgress(accessToken, currentAssessmentId, {
            answers: selectedAnswers as Record<string, unknown>,
            completedSections: nextCompletedSections,
            status: "in_progress",
          });
        }

        const sectionResult = createExamResult(examContent, selectedAnswers, nextCompletedSections);
        if (accessToken) {
          await saveCloudExamResult(
            accessToken,
            sectionResult.assessmentId,
            sectionResult as unknown as Record<string, unknown>,
          );
        }
        saveExamResult(studentId, sectionResult);
      }
      setCompletedSections(nextCompletedSections);
      return nextCompletedSections;
    } finally {
      finalSubmissionRef.current = false;
    }
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

  function handleChangeTextEntry(questionId: string, value: string) {
    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
    }));
  }

  function handleChangeStructuredAnswer(questionId: string, value: CategoryPlacements) {
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

  function renderAuthoredText(html: string | undefined, text: string, highlightKey: string) {
    return html ? <span className="exam-rich-text" dangerouslySetInnerHTML={{ __html: html }} /> : renderHighlightedText(text, highlightKey);
  }

  function renderMathAuthoredText(text: string, highlightKey: string) {
    return text
      .split(/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g)
      .filter(Boolean)
      .map((part, index) => {
        if (part.startsWith("\\[") && part.endsWith("\\]")) {
          return (
            <span key={`${highlightKey}-display-math-${index}`}>
              {renderKatexExpression(part.slice(2, -2), true)}
            </span>
          );
        }
        if (part.startsWith("\\(") && part.endsWith("\\)")) {
          return (
            <span key={`${highlightKey}-inline-math-${index}`}>
              {renderKatexExpression(part.slice(2, -2))}
            </span>
          );
        }
        return (
          <span key={`${highlightKey}-text-${index}`}>
            {renderHighlightedText(part, `${highlightKey}:text:${index}`)}
          </span>
        );
      });
  }

  function renderMathRichText(html: string | undefined, text: string, highlightKey: string) {
    if (!html) {
      return renderMathAuthoredText(text, highlightKey);
    }

    const container = document.createElement("span");
    container.innerHTML = html;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }
    textNodes.forEach((textNode) => {
      const parts = (textNode.nodeValue ?? "")
        .split(/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g)
        .filter(Boolean);
      const hasMath = parts.some(
        (part) =>
          (part.startsWith("\\[") && part.endsWith("\\]")) ||
          (part.startsWith("\\(") && part.endsWith("\\)")),
      );
      if (!hasMath) return;
      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        const isDisplayMath = part.startsWith("\\[") && part.endsWith("\\]");
        const isInlineMath = part.startsWith("\\(") && part.endsWith("\\)");
        if (!isDisplayMath && !isInlineMath) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }
        const span = document.createElement("span");
        span.className = isDisplayMath ? "exam-katex-display" : "exam-katex-inline";
        span.innerHTML = katex.renderToString(part.slice(2, -2), {
          displayMode: isDisplayMath,
          output: "htmlAndMathml",
          strict: false,
          throwOnError: false,
          trust: false,
        });
        fragment.appendChild(span);
      });
      textNode.replaceWith(fragment);
    });

    return <span className="exam-rich-text" dangerouslySetInnerHTML={{ __html: container.innerHTML }} />;
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
    if (!isFastForwardEnabled) {
      return;
    }

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

  async function handleEndSectionSubmit() {
    if (!assessment) return;
    clearTransientExamUi();
    setActiveTool("pointer");
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setSelectedCategoryItemId("");

    setIsSubmittingSection(true);
    setErrorMessage("");
    try {
      const nextCompletedSections = await saveSectionCompletion("english");
      if (!nextCompletedSections.includes("math")) {
        if (!canAccessMath) {
          window.location.assign(getAssessmentDashboardHref());
          return;
        }
        window.sessionStorage.setItem(`exam-start-subject:${assessment.id}`, "math");
        if (assessment.split) {
          const nextTimer = resetExamTimer(assessment.id);
          setTimerState(nextTimer);
          setTimerNow(nextTimer.startedAt);
        }
        setSessionScreen("mathIntro");
      } else {
        await saveCompletedExam(selectedAnswers);
        setSessionScreen("testOver");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Your English answers could not be saved. Please submit again.");
      setSessionScreen("endSection");
    } finally {
      setIsSubmittingSection(false);
    }
  }

  async function finishMathSection() {
    clearTransientExamUi();
    setActiveTool("pointer");
    setIsNotepadOpen(false);
    setIsReviewOpen(false);
    setIsUnansweredModalOpen(false);
    setReviewFilter("all");
    setSelectedCategoryItemId("");

    setIsSubmittingSection(true);
    setErrorMessage("");
    try {
      const nextCompletedSections = await saveSectionCompletion("math");
      if (!nextCompletedSections.includes("english")) {
        if (!canAccessEnglish) {
          window.location.assign(getAssessmentDashboardHref());
          return;
        }
        window.sessionStorage.setItem(`exam-start-subject:${currentAssessmentId}`, "english");
        if (isSplitAssessment) {
          const nextTimer = resetExamTimer(currentAssessmentId);
          setTimerState(nextTimer);
          setTimerNow(nextTimer.startedAt);
        }
        setActivePassageSetIndex(0);
        setActiveQuestionIndex(0);
        setSessionScreen(isSplitAssessment ? "directions" : "passageIntro");
      } else {
        await saveCompletedExam(selectedAnswers);
        setSessionScreen("testOver");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Your Math answers could not be saved. Please submit again.");
      setSessionScreen("endSection");
    } finally {
      setIsSubmittingSection(false);
    }
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

  const timerToolbarProps = {
    isTimerOvertime: timerDisplay.isOvertime,
    isTimerVisible,
    isUserMenuOpen,
    onPauseTimer: handlePauseTimer,
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
    unansweredCount,
  };

  const moduleHeaderProps = {
    isUserMenuOpen,
    onPauseTimer: handlePauseTimer,
    onToggleUserMenu: () => setIsUserMenuOpen((currentValue) => !currentValue),
  };

  if (isExamPaused) {
    return (
      <main className="exam-paused-screen" aria-label="Exam paused">
        <button onClick={handleResumeTimer} type="button">
          <Play aria-hidden="true" fill="currentColor" size={16} strokeWidth={2} />
          Resume exam
        </button>
      </main>
    );
  }

  if (sessionScreen === "mathIntro") {
    return (
      <main className="exam-module-shell">
        <ExamModuleHeader {...moduleHeaderProps} studentName={studentName} />

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
      <main className="exam-session-shell">
        <ExamToolbar
          assessmentLabel={assessmentLabel}
          breadcrumbCurrent={`${activeMathQuestionIndex + 1} OF ${mathQuestions.length}`}
          breadcrumbMiddle={mathSection.label.toUpperCase()}
          {...reviewToolbarProps}
          isNotepadOpen={isNotepadOpen}
          isPreviousActive={isFastForwardEnabled}
          onNext={handleMathNext}
          onPrevious={handleMathPrevious}
          onSelectTool={handleSelectTool}
          showExhibits
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
                {activeMathQuestion.image.caption ? (
                  <figcaption>{activeMathQuestion.image.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}

            <h1
              className="exam-highlightable"
              data-highlight-key={`prompt:${activeMathQuestion.id}`}
              id={`math-title-${activeMathQuestion.id}`}
            >
              {renderMathRichText(
                activeMathQuestion.promptHtml,
                activeMathQuestion.prompt,
                `prompt:${activeMathQuestion.id}`,
              )}
            </h1>

            {activeMathQuestion.stimulus ? (
              <div
                className="exam-standalone-stimulus exam-highlightable"
                data-highlight-key={`stimulus:${activeMathQuestion.id}`}
              >
                {renderMathRichText(
                  activeMathQuestion.stimulusHtml,
                  activeMathQuestion.stimulus,
                  `stimulus:${activeMathQuestion.id}`,
                )}
              </div>
            ) : null}

            {activeMathQuestion.instructions ? (
              <p
                className="exam-standalone-instructions exam-highlightable"
                data-highlight-key={`instructions:${activeMathQuestion.id}`}
              >
                {renderMathRichText(
                  activeMathQuestion.instructionsHtml,
                  activeMathQuestion.instructions,
                  `instructions:${activeMathQuestion.id}`,
                )}
              </p>
            ) : null}

            {activeMathQuestion.type === "short_response" ? (
              <label className="exam-math-text-entry is-short-response">
                <span className="sr-only">Answer</span>
                <input
                  aria-label="Answer"
                  onChange={(event) =>
                    handleChangeTextEntry(activeMathQuestion.id, event.target.value)
                  }
                  type="text"
                  value={getTextEntryValue(selectedAnswers[activeMathQuestion.id])}
                />
              </label>
            ) : usesMathEntryKeypad(activeMathQuestion) ? (
              <MathEntryResponse
                layout={activeMathQuestion.entryLayout ?? "plain"}
                onChange={(value) => handleChangeTextEntry(activeMathQuestion.id, value)}
                value={getTextEntryValue(selectedAnswers[activeMathQuestion.id])}
              />
            ) : activeMathQuestion.type === "math_drag_drop" ? (
              <MathDragDropResponse
                answer={getCategoryPlacements(selectedAnswers[activeMathQuestion.id])}
                onChange={(value) => handleChangeStructuredAnswer(activeMathQuestion.id, value)}
                question={activeMathQuestion}
              />
            ) : activeMathQuestion.type === "graph_point_select" ? (
              <GraphPointResponse
                onToggle={(pointId) => handleToggleMultiSelectAnswer(activeMathQuestion, pointId)}
                question={activeMathQuestion}
                selectedIds={getSelectedChoiceIds(selectedAnswers[activeMathQuestion.id])}
              />
            ) : activeMathQuestion.type === "number_line_response" ? (
              <NumberLineResponse
                answer={getCategoryPlacements(selectedAnswers[activeMathQuestion.id])}
                onChange={(value) => handleChangeStructuredAnswer(activeMathQuestion.id, value)}
                question={activeMathQuestion}
              />
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
                      className={
                        choice.math
                          ? "exam-choice-math"
                          : choice.image?.src || choice.numberLine
                            ? "exam-choice-visual"
                            : "exam-highlightable"
                      }
                      data-highlight-key={
                        choice.math || choice.image?.src || choice.numberLine
                          ? undefined
                          : `choice:${activeMathQuestion.id}:${choice.id}`
                      }
                    >
                      {choice.image?.src ? (
                        <img
                          alt={choice.image.alt || choice.text}
                          src={choice.image.src}
                        />
                      ) : choice.numberLine ? (
                        <ExamNumberLineGraphic
                          description={choice.text}
                          numberLine={choice.numberLine}
                        />
                      ) : choice.math ? (
                        renderMathExpression(choice.math)
                      ) : (
                        renderMathRichText(
                          choice.html,
                          choice.text,
                          `choice:${activeMathQuestion.id}:${choice.id}`,
                        )
                      )}
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
              <h2>Global Notepad</h2>
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
        <ExamModuleHeader {...moduleHeaderProps} studentName={studentName} />

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
          isPreviousActive={isFastForwardEnabled}
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
          <form className="exam-standalone-panel">
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

            {activeStandaloneQuestion.type === "category_sort" &&
            activeStandaloneQuestion.items &&
            activeStandaloneQuestion.categories ? (
              <div
                className={`exam-standalone-category-sort ${
                  activeStandaloneQuestion.categoryCapacity === 1 ? "is-single-capacity" : ""
                }`}
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
              <h2>Global Notepad</h2>
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
    const endSectionLabel = standaloneSection?.label ?? "ELA - Revising/Editing Part B";

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
          isNextActive={false}
          showReviewTools={false}
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

  if (sessionScreen === "passageIntro") {
    return (
      <main className="exam-module-shell">
        <ExamModuleHeader {...moduleHeaderProps} studentName={studentName} />

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
            >
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
                            {renderAuthoredText(
                              line.html,
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
                              {renderAuthoredText(
                                line.html,
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
            </div>
          </div>

          <form className="exam-question-panel">
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
            {activeQuestion.type === "table_match" && activeQuestion.items && activeQuestion.categories ? (
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
                }`}
              >
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
              <div className="exam-transition-drop">
                <div
                  aria-label="Drag-and-drop answer bank"
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
              <h2>Global Notepad</h2>
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
        {...reviewToolbarProps}
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
              This test consists of {totalExamQuestionCount} questions across two subjects, English Language Arts
              and Mathematics.
            </p>

            <div className="exam-session-section-list">
              <p>
                <strong>PART 1 - ENGLISH LANGUAGE ARTS</strong>
                <strong>{englishQuestionCount} QUESTIONS</strong>
              </p>
              <p className="exam-session-question-range">Questions 1-{englishQuestionCount}</p>

              <p>
                <strong>PART 2 - MATHEMATICS</strong>
                <strong>{mathQuestionCount} QUESTIONS</strong>
              </p>
              <p className="exam-session-question-range">
                Questions {englishQuestionCount + 1}-{totalExamQuestionCount}
              </p>
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
                You should answer every question. For Math and Revising/Editing Part B stand-alone items, you will
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
