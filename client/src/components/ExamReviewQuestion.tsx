import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import type { ExamChoice, ExamPassage, ExamQuestion } from "../content/exams";
import type { SelectedAnswer } from "../lib/examResults";
import type { ReviewQuestion } from "../../../server/src/shared/examCorrections";

export function ExamText({ text = "", html }: { text?: string; html?: string }) {
  const markup = useMemo(() => {
    const doc = new DOMParser().parseFromString(html || "", "text/html");
    if (!html) doc.body.textContent = text;
    doc.body.querySelectorAll("script,style,iframe,object,embed,svg,link,meta").forEach(node => node.remove());
    doc.body.querySelectorAll("*").forEach(node => {
      for (const attr of Array.from(node.attributes)) {
        if (attr.name.startsWith("on") || ["srcdoc", "style"].includes(attr.name) || (["src", "href"].includes(attr.name) && !/^(https?:|\/|#)/i.test(attr.value))) node.removeAttribute(attr.name);
      }
    });
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const nodes: Node[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const parts = (node.textContent ?? "").split(/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$\$[\s\S]+?\$\$)/g);
      if (parts.length < 2) continue;
      const replacement = doc.createDocumentFragment();
      parts.forEach((part, index) => {
        if (index % 2 === 0) { replacement.append(doc.createTextNode(part)); return; }
        const span = doc.createElement("span");
        span.innerHTML = katex.renderToString(part.slice(2, -2), { displayMode: !part.startsWith("\\("), throwOnError: false, trust: false });
        replacement.append(span);
      });
      node.parentNode?.replaceChild(replacement, node);
    }
    return doc.body.innerHTML;
  }, [text, html]);
  return <span className="exam-review-text" dangerouslySetInnerHTML={{ __html: markup }} />;
}

function correctExamAnswer(question: ExamQuestion): SelectedAnswer | undefined {
  if (question.correctChoiceId) return question.correctChoiceId;
  if (question.correctChoiceIds) return question.correctChoiceIds;
  if (question.correctPointIds) return question.correctPointIds;
  if (question.correctTextAnswers) return question.correctTextAnswers.join(" or ");
  if (question.correctPlacements) return question.correctPlacements;
  if (question.dropdowns) return Object.fromEntries(question.dropdowns.map(dropdown => [dropdown.id, dropdown.correctChoiceId ?? ""]));
  if (question.dragDropSlots) return Object.fromEntries(question.dragDropSlots.map(slot => [slot.id, slot.correctItemId]));
  if (question.numberLineResponse) return { direction: question.numberLineResponse.correctDirection, endpoint: question.numberLineResponse.correctEndpoint, value: String(question.numberLineResponse.correctValue) };
}

function ChoiceContent({ choice }: { choice: ExamChoice }) {
  return <><ExamText text={choice.math ? `\\(${choice.math}\\)` : choice.text} html={choice.html} />{choice.image && <img src={choice.image.src} alt={choice.image.alt} />}{choice.numberLine && <span>Number line: {choice.numberLine.startClosed ? "[" : "("}{choice.numberLine.extendLeft ? "−∞" : choice.numberLine.solutionStart}, {choice.numberLine.extendRight ? "∞" : choice.numberLine.solutionEnd}{choice.numberLine.endClosed ? "]" : ")"}</span>}</>;
}

function templateText(question: ExamQuestion, lines: string[]) {
  const ids = question.dropdowns?.map(item => item.id) ?? question.dragDropSlots?.map(item => item.id) ?? [];
  return lines.join("\n").replace(/\{\{([^}]+)\}\}/g, (_match, id: string) => `[Box ${Math.max(0, ids.indexOf(id)) + 1}]`);
}

export function ExamAnswer({ question, answer }: { question: ExamQuestion; answer?: SelectedAnswer }) {
  if (answer === undefined || answer === "" || Array.isArray(answer) && !answer.length || typeof answer === "object" && !Object.keys(answer).length) return <span>No answer submitted</span>;
  if (typeof answer === "string") {
    const choice = question.choices?.find(item => item.id === answer);
    return choice ? <span><b>{choice.id}. </b><ChoiceContent choice={choice} /></span> : <ExamText text={answer} />;
  }
  if (Array.isArray(answer)) return <div>{answer.map(id => {
    const point = question.graph?.points.find(item => item.id === id);
    return <div key={id}>{point ? `(${point.x}, ${point.y})` : <ExamAnswer question={question} answer={id} />}</div>;
  })}</div>;
  return <div>{Object.entries(answer).map(([id, value]) => {
    const item = question.items?.find(item => item.id === id);
    const target = question.categories?.find(item => item.id === value);
    const option = question.dropdowns?.find(item => item.id === id)?.options.find(item => item.id === value);
    const dragItem = question.type === "math_drag_drop" ? question.items?.find(item => item.id === value) : undefined;
    return <div key={id}><ExamText text={item?.text ?? id} html={item?.html} />: <ExamText text={target?.title ?? (option?.math ? `\\(${option.math}\\)` : option?.text) ?? dragItem?.text ?? value} html={dragItem?.html} /></div>;
  })}</div>;
}

function ExamReviewPassage({ passage }: { passage: ExamPassage }) {
  const format = passage.format === "sentence_prose" ? "sentence_prose" : passage.format === "prose" ? "prose" : "poem";

  return <div className="exam-question-passage">
    <div className={`exam-question-passage-scroll is-${format.replace("_", "-")}`} aria-label={passage.title}>
      {passage.lines.filter(line => line.kind !== "image").map((line, index) => {
        if (format === "sentence_prose") {
          if (!line.text && !line.html) return <p aria-hidden="true" className="exam-sentence-prose-line is-spacer" key={index} />;
          return <p className={`exam-sentence-prose-line ${line.kind ? `is-${line.kind}` : line.align === "center" ? "is-title" : ""}`} key={index}>
            <ExamText html={line.html} text={line.text} />
          </p>;
        }

        if (format === "prose") {
          if (!line.text && !line.html) return <p aria-hidden="true" className="exam-prose-line is-spacer" key={index} />;
          const isFullWidth = Boolean(line.kind) || line.align === "center";
          return <p className={`exam-prose-line ${line.kind ? `is-${line.kind}` : line.align === "center" ? "is-title" : ""}`} key={index}>
            {!isFullWidth && line.lineNumber ? <span>{line.lineNumber}</span> : null}
            <ExamText html={line.html} text={line.text} />
          </p>;
        }

        return <p className={`exam-poem-line ${line.align === "center" ? "is-centered" : ""} ${line.kind ? `is-${line.kind}` : ""} ${line.text || line.html ? "" : "is-spacer"}`} key={index}>
          <span>{line.lineNumber}</span>
          <ExamText html={line.html} text={line.text} />
        </p>;
      })}
      {passage.sourceNote ? <p className="exam-passage-source-note">{passage.sourceNote}</p> : null}
      {passage.lines.filter(line => line.kind === "image" && line.image).map((line, index) => line.image ? <figure className="exam-passage-image" key={`${line.image.src}-${index}`}>
        <img src={line.image.src} alt={line.image.alt} />
        {line.image.caption ? <figcaption>{line.image.caption}</figcaption> : null}
      </figure> : null)}
    </div>
  </div>;
}

function ReviewQuestionBody({ item, showAnswers, viewer }: { item: ReviewQuestion; showAnswers: boolean; viewer: boolean }) {
  const { question, passage } = item;
  const prompt = <ExamText html={question.promptHtml} text={question.prompt} />;

  return <>
    {!viewer && passage && <details className="exam-review-passage"><summary>Read passage: {passage.title}</summary>{passage.lines.map((line, index) => <p key={index}>{line.lineNumber && <small>{line.lineNumber} </small>}<ExamText html={line.html} text={line.text} />{line.image && <img src={line.image.src} alt={line.image.alt} />}</p>)}{passage.sourceNote && <small>{passage.sourceNote}</small>}</details>}
    {(question.instructions || question.instructionsHtml) && <p className={viewer ? "exam-question-instructions" : undefined}><ExamText html={question.instructionsHtml} text={question.instructions} /></p>}
    {(question.stimulus || question.stimulusHtml) && <p className={viewer ? "exam-question-instructions" : undefined}><ExamText html={question.stimulusHtml} text={question.stimulus} /></p>}
    {viewer ? <h1>{prompt}</h1> : <h2>{prompt}</h2>}
    {question.image && <figure className={viewer ? "exam-question-image" : undefined}><img src={question.image.src} alt={question.image.alt} /><figcaption>{question.image.caption}</figcaption></figure>}
    {question.graph && <svg viewBox="0 0 400 300" role="img" aria-label={question.graph.title ?? "Question coordinate graph"}>
      <rect x="35" y="15" width="340" height="250" fill="#fafafa" stroke="#bbb" />
      {question.graph.points.map(point => <g key={point.id}><circle cx={35 + (point.x - question.graph!.xMin) / (question.graph!.xMax - question.graph!.xMin) * 340} cy={265 - (point.y - question.graph!.yMin) / (question.graph!.yMax - question.graph!.yMin) * 250} r="4" /><text x={40 + (point.x - question.graph!.xMin) / (question.graph!.xMax - question.graph!.xMin) * 340} y={260 - (point.y - question.graph!.yMin) / (question.graph!.yMax - question.graph!.yMin) * 250} fontSize="11">({point.x}, {point.y})</text></g>)}
      <text x="175" y="290" fontSize="12">{question.graph.xLabel}</text><text x="0" y="140" fontSize="12">{question.graph.yLabel}</text>
    </svg>}
    {question.dropdownContent && <p><ExamText text={templateText(question, question.dropdownContent)} /></p>}
    {question.dragDropContent && <p><ExamText text={templateText(question, question.dragDropContent)} /></p>}
    {question.choices?.length ? <div className={viewer ? "exam-choice-list exam-review-viewer-choices" : "exam-review-choices"}>{question.choices.map(choice => <div className={viewer ? "exam-choice" : undefined} key={choice.id}>{viewer ? <span className="exam-review-choice-marker" aria-hidden="true" /> : null}<b>{choice.id}.</b><ChoiceContent choice={choice} /></div>)}</div> : null}
    {showAnswers && <div className="exam-review-answer-comparison"><section className={item.isCorrect ? "is-correct" : "is-incorrect"}><h3>Your submitted answer</h3><ExamAnswer question={question} answer={item.submittedAnswer} /></section><section className="is-correct"><h3>Correct answer</h3><ExamAnswer question={question} answer={correctExamAnswer(question)} /></section></div>}
  </>;
}

export function ExamReviewQuestion({ item, showAnswers = true, variant = "compact" }: { item: ReviewQuestion; showAnswers?: boolean; variant?: "compact" | "exam" }) {
  if (variant === "exam") {
    const panelClassName = item.passage ? "exam-question-panel" : "exam-standalone-panel exam-math-panel";
    const documentClassName = item.passage ? "exam-question-document is-expanded-layout" : "exam-standalone-document exam-math-document";
    return <div className={`exam-review-question-content is-exam-viewer ${documentClassName}`}>
      {item.passage ? <ExamReviewPassage passage={item.passage} /> : null}
      <div className={panelClassName}>
        <ReviewQuestionBody item={item} showAnswers={showAnswers} viewer />
      </div>
    </div>;
  }

  return <div className="exam-review-question-content">
    <ReviewQuestionBody item={item} showAnswers={showAnswers} viewer={false} />
  </div>;
}
