// One math question renderer for the student player and Content Studio preview.
/* eslint react-refresh/only-export-components: ["error", { "allowExportNames": ["renderKatexExpression", "renderInlineMathText", "getBoldFormattedText", "renderMathAuthoredText", "renderMathRichText"] }] */
import { parseInlineDropdownTemplate } from '../lib/inlineDropdownTemplate';
import { useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import katex from 'katex';
import { MathEntryResponse } from './MathEntryResponse';
import { parseMathDragTable } from '../lib/mathDragTable';
import { pointGraphLayout } from '../lib/pointGraphLayout';
import { numberLineTicks, clampNumberLineValue } from '../lib/numberLineInteraction';
import { moveMathDragAnswer, type MathDragSelection } from '../lib/mathDragDrop';
import type { ExamQuestion, ExamNumberLine } from '../../../server/src/shared/examTypes';
import type { CategoryPlacements, SelectedAnswer } from '../../../server/src/shared/examGrading';
import 'katex/dist/katex.min.css';

export function renderKatexExpression(expression: string, displayMode = false) {
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

export function renderInlineMathText(expression: string) {
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

function MathDragDropResponse({
  answer,
  onChange,
  question,
}: {
  answer: CategoryPlacements;
  onChange: (answer: CategoryPlacements) => void;
  question: ExamQuestion;
}) {
  const [selected, setSelected] = useState<MathDragSelection>();
  const [announcement, setAnnouncement] = useState("");
  const bankRef = useRef<HTMLDivElement>(null);
  const [bankWidth, setBankWidth] = useState<number>();
  const responseRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ id: number; x: number; y: number; selection: MathDragSelection; moving: boolean } | undefined>(undefined);
  const suppressClick = useRef(false);
  const [dragged, setDragged] = useState<{ itemId: string; x: number; y: number }>();
  const items = question.items ?? [];
  const slots = question.dragDropSlots ?? [];
  const table = parseMathDragTable(question.dragDropContent);
  const dragStyle = question.dragDropStyle ?? (table ? "outlined" : "compact");
  const placedItemIds = Object.values(answer);
  const availableItems = question.allowReuse
    ? items
    : items.filter((item) => !placedItemIds.includes(item.id));

  function move(selection: MathDragSelection, slotId?: string) {
    const next = moveMathDragAnswer(question, answer, selection, slotId);
    if (next !== answer) {
      onChange(next);
      const text = items.find(item => item.id === selection.itemId)?.text || "Answer";
      setAnnouncement(slotId ? `${text} placed in answer box ${slots.findIndex(slot => slot.id === slotId) + 1}.` : `${text} returned to the answer bank.`);
      requestAnimationFrame(() => {
        const destination = slotId
          ? Array.from(responseRef.current?.querySelectorAll<HTMLButtonElement>("[data-answer-slot]") ?? [])
            .find(slot => slot.dataset.answerSlot === slotId)
          : Array.from(bankRef.current?.querySelectorAll("button") ?? [])
            .find(tile => tile.dataset.itemId === selection.itemId);
        destination?.focus();
      });
    }
    setSelected(undefined);
  }

  function startPointer(event: PointerEvent<HTMLButtonElement>, selection: MathDragSelection) {
    if (event.button !== 0 || !event.isPrimary) return;
    suppressClick.current = false;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, selection, moving: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePointer(event: PointerEvent) {
    const active = pointer.current;
    if (!active || active.id !== event.pointerId) return;
    if (!active.moving && Math.hypot(event.clientX - active.x, event.clientY - active.y) < 5) return;
    if (!active.moving) selectTile(active.selection);
    active.moving = true;
    setDragged({ itemId: active.selection.itemId, x: event.clientX, y: event.clientY });
  }

  function endPointer(event: PointerEvent) {
    const active = pointer.current;
    if (!active || active.id !== event.pointerId) return;
    pointer.current = undefined;
    if (!active.moving) return;
    suppressClick.current = true;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const slot = target?.closest<HTMLElement>("[data-answer-slot]");
    if (slot && responseRef.current?.contains(slot)) move(active.selection, slot.dataset.answerSlot);
    else if (target && bankRef.current?.contains(target)) move(active.selection);
    setDragged(undefined);
    setSelected(undefined);
  }

  function selectTile(selection: MathDragSelection) {
    // Keep the return target in place as single-use choices leave the bank.
    if (bankRef.current) setBankWidth(bankRef.current.getBoundingClientRect().width);
    setSelected(selection);
  }

  function renderSlot(slotId: string, key: string) {
    const placedItem = items.find((item) => item.id === answer[slotId]);
    return (
      <button
        aria-label={placedItem ? `Answer box ${slots.findIndex(slot => slot.id === slotId) + 1}: ${placedItem.text}. Select, then click the bank to return or an empty box to move. Delete also returns to bank.` : `Empty answer box ${slots.findIndex(slot => slot.id === slotId) + 1}`}
        aria-pressed={placedItem ? selected?.slotId === slotId : undefined}
        className={`exam-math-drag-slot ${placedItem ? "is-filled" : ""} ${selected?.slotId === slotId ? "is-selected" : ""} ${selected && !placedItem ? "is-drop-target" : ""}`}
        data-answer-slot={slotId}
        draggable={false}
        key={key}
        onClick={() => {
          if (placedItem) selectTile({ itemId: placedItem.id, slotId });
          else if (selected) move(selected, slotId);
        }}
        onKeyDown={event => {
          if (placedItem && ["Delete", "Backspace"].includes(event.key)) { event.preventDefault(); move({ itemId: placedItem.id, slotId }); }
        }}
        onPointerDown={event => { if (placedItem) startPointer(event, { itemId: placedItem.id, slotId }); }}
        type="button"
      >
        {placedItem ? <span className="exam-math-drag-placed-tile">{renderInteractionMath(placedItem.text, `${key}-placed`)}</span> : "\u00a0"}
      </button>
    );
  }

  function renderLine(template: string, lineIndex: number | string) {
    return parseInlineDropdownTemplate(template).map((part, partIndex) => {
      const key = `drag-${lineIndex}-${partIndex}`;
      if (part.kind === "dropdown") return renderSlot(part.value, key);
      if (part.kind === "math") return <span className="exam-inline-math" key={key}>{renderKatexExpression(part.value)}</span>;
      return renderInteractionMath(part.value, key);
    });
  }

  return (
    <div ref={responseRef} className={`exam-math-drag-response is-${dragStyle} ${table ? "is-table" : ""} ${(question.dragDropContent?.length ?? 0) === 1 ? "is-single-line" : ""}`}
      onPointerMove={movePointer} onPointerUp={endPointer}
      onPointerCancel={() => { pointer.current = undefined; setDragged(undefined); setSelected(undefined); }}
      onClickCapture={event => { if (suppressClick.current) { suppressClick.current = false; if (event.detail > 0) { event.preventDefault(); event.stopPropagation(); } } }}
      onKeyDown={event => { if (event.key === "Escape") { pointer.current = undefined; setDragged(undefined); setSelected(undefined); } }}>
      <span className="sr-only" aria-live="polite">{announcement}</span>
      {dragged && <span aria-hidden="true" className="exam-math-drag-ghost" style={{ left: dragged.x, top: dragged.y }}>
        {renderInteractionMath(items.find(item => item.id === dragged.itemId)?.text ?? "", "drag-ghost")}
      </span>}
      <div
        aria-label="Answer bank"
        className={`exam-math-drag-bank ${selected?.slotId ? "is-drop-target" : ""}`}
        ref={bankRef}
        style={bankWidth && !table ? { minWidth: `min(${bankWidth}px, 100%)` } : undefined}
        role="group"
        tabIndex={selected?.slotId ? 0 : undefined}
        onClick={event => { if (!(event.target as Element).closest("button") && selected?.slotId) move(selected); }}
        onKeyDown={event => { if (event.target === event.currentTarget && selected?.slotId && ["Enter", " "].includes(event.key)) { event.preventDefault(); move(selected); } }}
      >
        {availableItems.map((item) => (
          <button
            className={selected?.itemId === item.id && !selected.slotId ? "is-selected" : ""}
            aria-pressed={selected?.itemId === item.id && !selected.slotId}
            data-item-id={item.id}
            draggable={false}
            key={item.id}
            onClick={() => selectTile({ itemId: item.id })}
            onPointerDown={event => startPointer(event, { itemId: item.id })}
            type="button"
          >
            {renderInteractionMath(item.text, `drag-bank-${item.id}`)}
          </button>
        ))}
      </div>
      {table ? (
        <div className="exam-math-drag-table-wrap">
          <table className="exam-math-drag-table">
            {table.caption && <caption>{renderInteractionMath(table.caption, "drag-caption")}</caption>}
            <thead><tr>{table.headers.map((header, index) => (
              <th scope="col" key={index}>{renderInteractionMath(header, `drag-header-${index}`)}</th>
            ))}</tr></thead>
            <tbody>{table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>{row.map((cell, columnIndex) => (
                <td key={columnIndex}>{renderLine(cell, `${rowIndex}-${columnIndex}`)}</td>
              ))}</tr>
            ))}</tbody>
          </table>
        </div>
      ) : <div className="exam-math-drag-lines">
        {(question.dragDropContent ?? []).map((line, lineIndex) => (
          <div className="exam-math-drag-line" key={`drag-line-${lineIndex}`}>
            {renderLine(line, lineIndex)}
          </div>
        ))}
      </div>}
    </div>
  );
}

export function MatrixChoiceResponse({
  answer,
  onChange,
  question,
}: {
  answer: CategoryPlacements;
  onChange: (answer: CategoryPlacements) => void;
  question: ExamQuestion;
}) {
  const categories = question.categories ?? [];
  const items = question.items ?? [];
  const evidence = question.matrixStyle === 'evidence';

  return (
    <div className={`exam-matrix-choice-wrap${evidence ? ' is-evidence-matrix' : ''}`}>
      <table className="exam-matrix-choice-table">
        <thead>
          <tr>
            <th scope="col">{evidence ? '' : question.tableHeaders?.row ?? "Sentence"}</th>
            {categories.map((category) => <th key={category.id} scope="col">{category.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.html ? <span className="exam-rich-text" dangerouslySetInnerHTML={{ __html: item.html }} /> : item.text}</th>
              {categories.map((category) => (
                <td key={category.id}>
                  <label className="exam-matrix-choice-option">
                    <input
                      aria-label={`${item.text}: ${category.title}`}
                      checked={answer[item.id] === category.id}
                      name={`matrix-${question.id}-${item.id}`}
                      onChange={() => {
                        const next = { ...answer };
                        if (evidence && answer[item.id] === category.id) delete next[item.id];
                        else next[item.id] = category.id;
                        onChange(next);
                      }}
                      type={evidence ? 'checkbox' : 'radio'}
                      value={category.id}
                    />
                    <span aria-hidden="true" />
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GraphPointResponse({
  onToggle,
  question,
  selectedIds,
  eliminatedIds,
}: {
  onToggle: (pointId: string) => void;
  question: ExamQuestion;
  selectedIds: string[];
  eliminatedIds: string[];
}) {
  const graph = question.graph;
  if (!graph) return null;
  const layout = pointGraphLayout(graph);
  if (!layout) return <p role="status">Set valid graph bounds and positive tick spacing to display the graph.</p>;
  const { left: axisLeft, right: axisRight, top: axisTop, bottom: axisBottom, xFor, yFor, xTicks, yTicks, width, height } = layout;

  return (
    <div className="exam-graph-point-response" style={{width, maxWidth: '100%'}}>
      <svg aria-label={graph.title ? `${graph.title}. Select points on the coordinate graph.` : "Selectable coordinate graph"} role="group" viewBox={`0 0 ${width} ${height}`}>
        {graph.title && <text className="exam-graph-title" x={axisLeft} y="14">{graph.title.toUpperCase()}</text>}
        {xTicks.map((value) => (
          <g key={`x-${value}`}>
            <line className="exam-graph-grid-line" x1={xFor(value)} x2={xFor(value)} y1={axisTop} y2={axisBottom} />
            {value !== 0 && <text textAnchor="middle" x={xFor(value)} y={axisBottom + 18}>{value}</text>}
          </g>
        ))}
        {yTicks.map((value) => (
          <g key={`y-${value}`}>
            <line className="exam-graph-grid-line" x1={axisLeft} x2={axisRight} y1={yFor(value)} y2={yFor(value)} />
            {value !== 0 && <text textAnchor="end" x={axisLeft - 6} y={yFor(value) + 4}>{value}</text>}
          </g>
        ))}
        <line className="exam-graph-axis" x1={axisLeft} x2={axisRight + 20} y1={axisBottom} y2={axisBottom} />
        <line className="exam-graph-axis" x1={axisLeft} x2={axisLeft} y1={axisBottom + 4} y2={axisTop - 20} />
        <path className="exam-graph-arrow" d={`M ${axisRight + 20} ${axisBottom} l -7 -3 l 2 3 l -2 3 Z M ${axisLeft} ${axisTop - 20} l -3 7 l 3 -2 l 3 2 Z`} />
        {graph.xMin === 0 && graph.yMin === 0 && <text className="exam-graph-variable" x={axisLeft - 15} y={axisBottom + 15}>O</text>}
        <text className="exam-graph-variable" x={axisRight + 25} y={axisBottom + 4}>x</text>
        <text className="exam-graph-variable" x={axisLeft - 3} y={axisTop - 29}>y</text>
        <text className="exam-graph-x-label" textAnchor="middle" x={(axisLeft + axisRight) / 2} y={axisBottom + 38}>{graph.xLabel}</text>
        <text className="exam-graph-y-label" textAnchor="middle" transform={`rotate(-90 15 ${(axisTop + axisBottom) / 2})`} x="15" y={(axisTop + axisBottom) / 2}>{graph.yLabel}</text>
        {graph.points.map((point) => {
          const selected = selectedIds.includes(point.id);
          const eliminated = eliminatedIds.includes(point.id);
          return (
            <g
              aria-label={`Point ${point.x}, ${point.y}${eliminated ? ", eliminated" : ""}`}
              aria-checked={selected}
              className={`exam-graph-point ${selected ? "is-selected" : ""} ${eliminated ? "is-eliminated" : ""}`}
              key={point.id}
              onClick={() => onToggle(point.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggle(point.id);
                }
              }}
              role="checkbox"
              tabIndex={0}
            >
              <circle className="exam-graph-point-hit" cx={xFor(point.x)} cy={yFor(point.y)} r="9" />
              <circle className="exam-graph-point-dot" cx={xFor(point.x)} cy={yFor(point.y)} r="6" />
              {eliminated && <path className="exam-graph-elimination" d={`M ${xFor(point.x)-4} ${yFor(point.y)-4} l 8 8 m 0 -8 l -8 8`} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RayIcon({direction, endpoint}: {direction: "left" | "right"; endpoint: "closed" | "open"}) {
  const left = direction === "left";
  return <svg aria-hidden="true" viewBox="0 0 44 28">
    <path d={left ? "M 5 14 H 33 M 5 14 L 13 7 M 5 14 L 13 21" : "M 11 14 H 39 M 39 14 L 31 7 M 39 14 L 31 21"} fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx={left ? 35 : 9} cy="14" r="6" fill={endpoint === "closed" ? "currentColor" : "var(--ray-icon-background, white)"} stroke="currentColor" strokeWidth="1" />
  </svg>;
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
  const dragPointer = useRef<number | undefined>(undefined);
  const dragOrigin = useRef(0);
  const dragStarted = useRef(false);
  const endpointRef = useRef<SVGGElement>(null);
  const firstRayRef = useRef<HTMLButtonElement>(null);
  const config = question.numberLineResponse;
  if (!config) return null;
  if (![config.min, config.max, config.tickStep].every(Number.isFinite) || config.max <= config.min || config.tickStep <= 0 || (config.max - config.min) / config.tickStep > 1000) return <p role="status">Set valid number-line bounds and positive tick spacing to display the number line.</p>;
  const axisLeft = 50;
  const axisRight = 450;
  const axisY = 65;
  const xFor = (value: number) => axisLeft + ((value - config.min) / (config.max - config.min)) * (axisRight - axisLeft);
  const ticks = numberLineTicks(config);
  const selectedValue = Number(answer.value);
  const hasValue = answer.value !== undefined && Number.isFinite(selectedValue);
  const direction = answer.direction as "left" | "right" | undefined;
  const endpoint = answer.endpoint as "closed" | "open" | undefined;
  const hasRay = hasValue && (direction === 'left' || direction === 'right') && (endpoint === 'closed' || endpoint === 'open');

  function chooseRay(nextDirection: "left" | "right", nextEndpoint: "closed" | "open") {
    if (hasRay) return;
    onChange({ value: String(clampNumberLineValue(config!, 0)), direction: nextDirection, endpoint: nextEndpoint });
  }

  function removeRay() {
    dragPointer.current = undefined;
    onChange({});
    requestAnimationFrame(() => firstRayRef.current?.focus());
  }

  function moveEndpoint(event: PointerEvent<SVGGElement>) {
    if (!config || !hasRay || dragPointer.current !== event.pointerId) return;
    if (!dragStarted.current && Math.abs(event.clientX - dragOrigin.current) < 3) return;
    dragStarted.current = true;
    const bounds = event.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const svgX = ((event.clientX - bounds.left) / bounds.width) * 500;
    const raw = config.min + ((svgX - axisLeft) / (axisRight - axisLeft)) * (config.max - config.min);
    onChange({ ...answer, value: String(clampNumberLineValue(config, raw)) });
  }

  return (
    <div className="exam-number-line-response">
      <svg
        aria-label="Interactive number line"
        role="group"
        viewBox="0 0 500 125"
      >
        <line className="exam-number-line-axis" x1="10" x2="490" y1={axisY} y2={axisY} />
        <path className="exam-number-line-axis" d={`M 30 37 L 10 ${axisY} L 30 93 M 470 37 L 490 ${axisY} L 470 93`} />
        {ticks.map(({value, showLabel}) => (
          <g key={value}>
            <line className="exam-number-line-tick" x1={xFor(value)} x2={xFor(value)} y1={axisY - 25} y2={axisY + 25} />
            {showLabel && <text textAnchor="middle" x={xFor(value)} y="30">{value}</text>}
          </g>
        ))}
        {hasRay ? (
          <g className="exam-number-line-selected-ray">
            <circle className="exam-number-line-halo" cx={xFor(selectedValue)} cy={axisY} r="40" />
            <line
              x1={direction === "left" ? 10 : xFor(selectedValue) + (endpoint === 'open' ? 8 : 0)}
              x2={direction === "right" ? 490 : xFor(selectedValue) - (endpoint === 'open' ? 8 : 0)}
              y1={axisY}
              y2={axisY}
            />
            <path className="exam-number-line-ray-arrow" d={direction === 'left' ? 'M 30 37 L 10 65 L 30 93' : 'M 470 37 L 490 65 L 470 93'} />
            <g ref={endpointRef} role="slider" tabIndex={0} aria-label="Ray endpoint" aria-valuemin={config.min} aria-valuemax={config.max} aria-valuenow={selectedValue} aria-valuetext={`${selectedValue}, ${endpoint} endpoint, ray extends ${direction}`} className="exam-number-line-endpoint"
              onPointerDown={event => { if (event.button !== 0 || !event.isPrimary) return; dragPointer.current = event.pointerId; dragOrigin.current = event.clientX; dragStarted.current = false; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.focus(); event.preventDefault(); }}
              onPointerMove={moveEndpoint}
              onPointerUp={event => { moveEndpoint(event); dragPointer.current = undefined; }}
              onPointerCancel={() => { dragPointer.current = undefined; }}
              onKeyDown={event => {
                if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); removeRay(); return; }
                const next = event.key === 'Home' ? config.min : event.key === 'End' ? config.max : ['ArrowLeft','ArrowDown'].includes(event.key) ? selectedValue - config.tickStep : ['ArrowRight','ArrowUp'].includes(event.key) ? selectedValue + config.tickStep : undefined;
                if (next === undefined) return;
                event.preventDefault(); onChange({...answer, value: String(clampNumberLineValue(config, next))});
              }}>
              <circle className="exam-number-line-endpoint-hit" cx={xFor(selectedValue)} cy={axisY} r="40" />
              <circle className="exam-number-line-endpoint-dot" cx={xFor(selectedValue)} cy={axisY} fill={endpoint === 'closed' ? 'currentColor' : 'none'} r="8" />
            </g>
          </g>
        ) : null}
      </svg>
      <p className="sr-only" aria-live="polite">
        {hasRay ? `Endpoint: ${selectedValue}. Drag the endpoint or use the arrow keys to move it. Remove the ray to choose a different one.` : "Select a ray, then drag its endpoint to the correct position."}
      </p>
      <div className={`exam-number-line-controls ${hasRay ? 'has-ray' : ''}`}>
      <div aria-label="Choose a ray" className="exam-number-line-ray-picker">
        {[
          ["left", "closed", "Left ray with a closed endpoint"],
          ["left", "open", "Left ray with an open endpoint"],
          ["right", "open", "Right ray with an open endpoint"],
          ["right", "closed", "Right ray with a closed endpoint"],
        ].map(([rayDirection, rayEndpoint, label], index) => (
          <button
            aria-label={label}
            ref={index === 0 ? firstRayRef : undefined}
            disabled={hasRay}
            className={direction === rayDirection && endpoint === rayEndpoint ? "is-selected" : ""}
            key={`${rayDirection}-${rayEndpoint}`}
            onClick={() => chooseRay(rayDirection as "left" | "right", rayEndpoint as "closed" | "open")}
            type="button"
          >
            <RayIcon direction={rayDirection as "left" | "right"} endpoint={rayEndpoint as "closed" | "open"} />
          </button>
        ))}
      </div>
      {hasRay && <div className="exam-number-line-ray-actions">
        <button type="button" aria-label="Focus selected ray" className="exam-number-line-current-ray" onClick={() => endpointRef.current?.focus()}><RayIcon direction={direction} endpoint={endpoint} /></button>
        <button type="button" onClick={removeRay}>Remove</button>
      </div>}
      </div>
    </div>
  );
}

export function getBoldFormattedText(text: string) {
  const boldRanges: {start: number; end: number}[] = [];
  const italicRanges: {start: number; end: number}[] = [];
  const mathRanges: {start: number; end: number}[] = [];
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

function renderMathPlainText(text: string, key: string) {
  const {displayText, boldRanges, italicRanges} = getBoldFormattedText(text);
  const boundaries = [...new Set([0, displayText.length, ...boldRanges.flatMap(r => [r.start, r.end]), ...italicRanges.flatMap(r => [r.start, r.end])])].sort((a,b) => a-b);
  return boundaries.slice(0,-1).map((start,index) => {
    const end = boundaries[index+1];
    let content: ReactNode = displayText.slice(start,end);
    if (italicRanges.some(r => r.start <= start && r.end >= end)) content = <em>{content}</em>;
    if (boldRanges.some(r => r.start <= start && r.end >= end)) content = <strong>{content}</strong>;
    return <span key={`${key}-${start}-${end}`}>{content}</span>;
  });
}

export function renderMathAuthoredText(text: string, highlightKey: string, renderPlain: (text: string, key: string) => ReactNode = renderMathPlainText) {
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
            {renderPlain(part, `${highlightKey}:text:${index}`)}
          </span>
        );
      });
  }

export function renderMathRichText(html: string | undefined, text: string, highlightKey: string, renderPlain?: (text: string, key: string) => ReactNode) {
    if (!html) {
      return renderPlain ? renderPlain(text, highlightKey) : renderMathAuthoredText(text, highlightKey);
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

function renderInlineDropdownText(question: ExamQuestion, template: string, templateIndex: number, answer: SelectedAnswer | undefined, onChange: (value: SelectedAnswer) => void) {
    const dropdownAnswers = placements(answer);

    return parseInlineDropdownTemplate(template).map((token, partIndex) => {
        const part = token.value;
        if (token.kind === 'math') {
          return <span className={token.display ? 'exam-katex-template-display' : 'exam-inline-math'} key={`math-${templateIndex}-${partIndex}`}>{renderKatexExpression(part, token.display)}</span>;
        }
        if (token.kind === 'dropdown') {
          const dropdownId = part;
          const dropdown = question.dropdowns?.find((candidate) => candidate.id === dropdownId);

          if (!dropdown) {
            return null;
          }

          return (
            <select
              aria-label={`Answer menu ${(question.dropdowns?.findIndex(item => item.id === dropdown.id) ?? 0) + 1}`}
              className="exam-inline-dropdown-select"
              key={`dropdown-${templateIndex}-${partIndex}`}
              onChange={(event) =>
                onChange({ ...dropdownAnswers, [dropdown.id]: event.target.value })
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


type Props = {
  question: ExamQuestion; answer?: SelectedAnswer; onChange: (value: SelectedAnswer) => void;
  onSelectChoice?: (id: string) => void; onTogglePoint?: (id: string) => void;
  onEliminatePoint?: (id: string) => void;
  allowExtraSelections?: boolean;
  eliminatedIds?: string[]; onChoiceLabelClick?: (event: MouseEvent<HTMLLabelElement>, id: string) => void;
  onTextSelection?: (event: MouseEvent<HTMLElement>) => void; children?: ReactNode;
  renderText?: (html: string | undefined, text: string, key: string) => ReactNode;
  answerFeedback?: 'correct' | 'incorrect';
};
const placements = (answer: SelectedAnswer | undefined): CategoryPlacements => answer && typeof answer === 'object' && !Array.isArray(answer) ? answer : {};
const isTextEntryQuestion = (q: ExamQuestion) => ['short_response','numeric_entry','expression_entry','grid_in'].includes(q.type);
const usesMathEntryKeypad = (q: ExamQuestion) => ['numeric_entry','expression_entry','grid_in'].includes(q.type);
const isInlineDropdownQuestion = (q: ExamQuestion) => q.type === 'inline_dropdown';
export function ExamMathQuestion({question, answer, onChange, onSelectChoice, onTogglePoint, onEliminatePoint, allowExtraSelections = false, eliminatedIds = [], onChoiceLabelClick, onTextSelection, children, renderText = renderMathRichText, answerFeedback}: Props) {
  const [selectionWarning, setSelectionWarning] = useState(false);
  const choices = question.choices || [], selectedIds = Array.isArray(answer) ? answer : typeof answer === 'string' && answer ? [answer] : [];
  const textAnswer = typeof answer === 'string' ? answer : '';
  const maxChoices = question.requiredSelections ?? question.correctPointIds?.length ?? question.correctChoiceIds?.length ?? 2;
  const toggle = (id: string) => onChange(selectedIds.includes(id) ? selectedIds.filter(value => value !== id) : [...selectedIds, id]);
  const select = (id: string, callback?: (id: string) => void) => {
    if (!allowExtraSelections && question.type === 'multi_select' && !selectedIds.includes(id) && selectedIds.length >= maxChoices) { setSelectionWarning(true); return; }
    setSelectionWarning(false);
    if (callback) callback(id);
    else if (['multi_select', 'graph_point_select'].includes(question.type)) toggle(id);
    else onChange(id);
  };
  return (<section
          aria-labelledby={`math-title-${question.id}`}
          className={`exam-standalone-document exam-math-document ${
            isTextEntryQuestion(question) ? "is-text-entry" : ""
          } ${isInlineDropdownQuestion(question) ? "is-inline-dropdown" : ""} ${question.type === "graph_point_select" ? "is-point-graph" : ""} ${question.type === "number_line_response" ? "is-number-line-response" : ""} ${
            question.image ? "is-image-question" : ""
          } ${question.type === "math_drag_drop" ? `is-math-drag ${parseMathDragTable(question.dragDropContent) ? "is-math-table-drag" : ""} ${question.dragDropStyle === "outlined" ? "is-math-outlined-drag" : ""}` : ""
          } ${answerFeedback ? `has-answer-feedback is-${answerFeedback}` : ''}`}
          onMouseUp={onTextSelection}
        >
          <form key={question.id} className="exam-standalone-panel exam-math-panel" onSubmit={event => event.preventDefault()}>
            {children}
            {question.image ? (
              <figure className="exam-question-image">
                <img alt={question.image.alt} src={question.image.src} />
                {question.image.caption ? (
                  <figcaption>{question.image.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}

            <h1
              className="exam-highlightable"
              data-highlight-key={`prompt:${question.id}`}
              id={`math-title-${question.id}`}
            >
              {renderText(
                question.promptHtml,
                question.prompt,
                `prompt:${question.id}`,
              )}
            </h1>

            {question.stimulus ? (
              <div
                className="exam-standalone-stimulus exam-highlightable"
                data-highlight-key={`stimulus:${question.id}`}
              >
                {renderText(
                  question.stimulusHtml,
                  question.stimulus,
                  `stimulus:${question.id}`,
                )}
              </div>
            ) : null}

            {question.instructions ? (
              <p
                className="exam-standalone-instructions exam-highlightable"
                data-highlight-key={`instructions:${question.id}`}
              >
                {renderText(
                  question.instructionsHtml,
                  question.instructions,
                  `instructions:${question.id}`,
                )}
              </p>
            ) : null}

            {question.type === "short_response" ? (
              <label className="exam-math-text-entry is-short-response">
                <span className="sr-only">Answer</span>
                <input
                  aria-label="Answer"
                  onChange={(event) =>
                    onChange(event.target.value)
                  }
                  type="text"
                  value={textAnswer}
                />
              </label>
            ) : usesMathEntryKeypad(question) ? (
              <MathEntryResponse
                key={question.id}
                advanced={question.type === "expression_entry"}
                layout={question.entryLayout ?? "plain"}
                variable={question.entryVariable}
                onChange={(value) => onChange(value)}
                value={textAnswer}
              />
            ) : question.type === "math_drag_drop" ? (
              <MathDragDropResponse
                key={question.id}
                answer={placements(answer)}
                onChange={(value) => onChange(value)}
                question={question}
              />
            ) : question.type === "graph_point_select" ? (
              <GraphPointResponse
                onToggle={(pointId) => onEliminatePoint ? onEliminatePoint(pointId) : select(pointId, onTogglePoint)}
                question={question}
                selectedIds={selectedIds}
                eliminatedIds={eliminatedIds}
              />
            ) : question.type === "number_line_response" ? (
              <NumberLineResponse
                key={question.id}
                answer={placements(answer)}
                onChange={(value) => onChange(value)}
                question={question}
              />
            ) : isInlineDropdownQuestion(question) && question.dropdownContent ? (
              <div className="exam-inline-dropdown-content">
                {question.dropdownContent.map((line, index) => (
                  <p key={`${question.id}-dropdown-line-${index}`}>
                    {renderInlineDropdownText(question, line, index, answer, onChange)}
                  </p>
                ))}
              </div>
            ) : choices.length > 0 ? (
              <div className="exam-choice-list exam-standalone-choice-list">
                {choices.map((choice) => (
                  <label
                    className={`exam-choice ${
                      eliminatedIds.includes(choice.id) ? "is-eliminated" : ""
                    } ${answerFeedback ? choice.id === question.correctChoiceId || question.correctChoiceIds?.includes(choice.id) ? 'is-answer-correct' : selectedIds.includes(choice.id) ? 'is-answer-incorrect' : '' : ''}`}
                    key={choice.id}
                    onClick={(event) => onChoiceLabelClick?.(event, choice.id)}
                  >
                    <input
                      checked={
                        question.type === "multi_select"
                          ? selectedIds.includes(choice.id)
                          : answer === choice.id
                      }
                      name={question.id}
                      onChange={() => select(choice.id, onSelectChoice)}
                      type={question.type === "multi_select" ? "checkbox" : "radio"}
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
                          : `choice:${question.id}:${choice.id}`
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
                        renderText(
                          choice.html,
                          choice.text,
                          `choice:${question.id}:${choice.id}`,
                        )
                      )}
                    </span>
                    {eliminatedIds.includes(choice.id) ? (
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
          {selectionWarning && <section aria-label="Choice limit warnings" aria-live="polite" className="exam-choice-warning-stack"><article className="exam-choice-warning"><button aria-label="Close warning" type="button" onClick={() => setSelectionWarning(false)}>x</button><p>You are permitted a <strong>maximum of {maxChoices} choices</strong> for this question.</p><p>Please unselect one of your choices before making another choice.</p></article></section>}
        </section>);
}
