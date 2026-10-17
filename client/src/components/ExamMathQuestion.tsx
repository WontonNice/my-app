// One math question renderer for the student player and Content Studio preview.
import { useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import katex from 'katex';
import { MathEntryResponse } from './MathEntryResponse';
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
    <div className={`exam-math-drag-response ${(question.dragDropContent?.length ?? 0) === 1 ? "is-single-line" : ""}`}>
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

  return (
    <div className="exam-matrix-choice-wrap">
      <table className="exam-matrix-choice-table">
        <thead>
          <tr>
            <th scope="col">{question.tableHeaders?.row ?? "Sentence"}</th>
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
                      onChange={() => onChange({ ...answer, [item.id]: category.id })}
                      type="radio"
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
}: {
  onToggle: (pointId: string) => void;
  question: ExamQuestion;
  selectedIds: string[];
}) {
  const graph = question.graph;
  if (!graph) return null;
  if (!['xMin','xMax','xStep','yMin','yMax','yStep'].every(key => Number.isFinite(graph[key as 'xMin'])) || graph.xMax <= graph.xMin || graph.yMax <= graph.yMin || graph.xStep <= 0 || graph.yStep <= 0 || (graph.xMax - graph.xMin) / graph.xStep > 1000 || (graph.yMax - graph.yMin) / graph.yStep > 1000) return <p role="status">Set valid graph bounds and positive tick spacing to display the graph.</p>;
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
  if (![config.min, config.max, config.tickStep].every(Number.isFinite) || config.max <= config.min || config.tickStep <= 0 || (config.max - config.min) / config.tickStep > 1000) return <p role="status">Set valid number-line bounds and positive tick spacing to display the number line.</p>;
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

  function moveEndpoint(event: PointerEvent<SVGSVGElement>) {
    if (!config) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const svgX = ((event.clientX - bounds.left) / bounds.width) * 620;
    const raw = config.min + ((svgX - axisLeft) / (axisRight - axisLeft)) * (config.max - config.min);
    const snapped = Math.max(config.min, Math.min(config.max, config.min + Math.round((raw - config.min) / config.tickStep) * config.tickStep));
    onChange({ ...answer, value: String(Number(snapped.toFixed(6))) });
  }

  return (
    <div className="exam-number-line-response">
      <svg
        aria-label="Interactive number line"
        onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.focus(); moveEndpoint(event); }}
        onPointerMove={event => { if (event.buttons === 1) moveEndpoint(event); }}
        onKeyDown={event => {
          const current = hasValue ? selectedValue : config.min;
          const next = event.key === 'Home' ? config.min : event.key === 'End' ? config.max : ['ArrowLeft','ArrowDown'].includes(event.key) ? current - config.tickStep : ['ArrowRight','ArrowUp'].includes(event.key) ? current + config.tickStep : undefined;
          if (next === undefined) return;
          event.preventDefault();
          onChange({ ...answer, value: String(Number(Math.max(config.min, Math.min(config.max, next)).toFixed(6))) });
        }}
        role="application"
        tabIndex={0}
        style={{touchAction: 'none'}}
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
      <p className="exam-number-line-help" aria-live="polite">
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

    return template
      .split(/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\{\{[\w-]+\}\})/g)
      .filter(Boolean)
      .map((part, partIndex) => {
        if (part.startsWith("\\[") && part.endsWith("\\]")) {
          return (
            <span className="exam-katex-template-display" key={`display-math-${templateIndex}-${partIndex}`}>
              {renderKatexExpression(part.slice(2, -2), true)}
            </span>
          );
        }
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
  allowExtraSelections?: boolean;
  eliminatedIds?: string[]; onChoiceLabelClick?: (event: MouseEvent<HTMLLabelElement>, id: string) => void;
  onTextSelection?: (event: MouseEvent<HTMLElement>) => void; children?: ReactNode;
  renderText?: (html: string | undefined, text: string, key: string) => ReactNode;
};
const placements = (answer: SelectedAnswer | undefined): CategoryPlacements => answer && typeof answer === 'object' && !Array.isArray(answer) ? answer : {};
const isTextEntryQuestion = (q: ExamQuestion) => ['short_response','numeric_entry','grid_in'].includes(q.type);
const usesMathEntryKeypad = (q: ExamQuestion) => ['numeric_entry','grid_in'].includes(q.type);
const isInlineDropdownQuestion = (q: ExamQuestion) => q.type === 'inline_dropdown';
export function ExamMathQuestion({question, answer, onChange, onSelectChoice, onTogglePoint, allowExtraSelections = false, eliminatedIds = [], onChoiceLabelClick, onTextSelection, children, renderText = renderMathRichText}: Props) {
  const [selectionWarning, setSelectionWarning] = useState(false);
  const choices = question.choices || [], selectedIds = Array.isArray(answer) ? answer : typeof answer === 'string' && answer ? [answer] : [];
  const textAnswer = typeof answer === 'string' ? answer : '';
  const maxChoices = question.requiredSelections ?? question.correctPointIds?.length ?? question.correctChoiceIds?.length ?? 2;
  const toggle = (id: string) => onChange(selectedIds.includes(id) ? selectedIds.filter(value => value !== id) : [...selectedIds, id]);
  const select = (id: string, callback?: (id: string) => void) => {
    if (!allowExtraSelections && ['multi_select', 'graph_point_select'].includes(question.type) && !selectedIds.includes(id) && selectedIds.length >= maxChoices) { setSelectionWarning(true); return; }
    setSelectionWarning(false);
    if (callback) callback(id);
    else if (['multi_select', 'graph_point_select'].includes(question.type)) toggle(id);
    else onChange(id);
  };
  return (<section
          aria-labelledby={`math-title-${question.id}`}
          className={`exam-standalone-document exam-math-document ${
            isTextEntryQuestion(question) ? "is-text-entry" : ""
          } ${isInlineDropdownQuestion(question) ? "is-inline-dropdown" : ""} ${
            question.image ? "is-image-question" : ""
          } ${question.type === "math_drag_drop" ? "is-math-drag" : ""
          }`}
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
                layout={question.entryLayout ?? "plain"}
                onChange={(value) => onChange(value)}
                value={textAnswer}
              />
            ) : question.type === "math_drag_drop" ? (
              <MathDragDropResponse
                answer={placements(answer)}
                onChange={(value) => onChange(value)}
                question={question}
              />
            ) : question.type === "graph_point_select" ? (
              <GraphPointResponse
                onToggle={(pointId) => select(pointId, onTogglePoint)}
                question={question}
                selectedIds={selectedIds}
              />
            ) : question.type === "number_line_response" ? (
              <NumberLineResponse
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
                    }`}
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
