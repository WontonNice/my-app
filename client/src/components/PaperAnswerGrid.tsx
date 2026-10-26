import { useRef, useState } from "react";
import type { ReviewQuestion } from "../../../server/src/shared/examCorrections";
import { isExamQuestionCorrect, type SelectedAnswers } from "../lib/examResults";
import { answerCellHint, formatAnswerCell, parseAnswerCell, pasteAnswerCells } from "../lib/answerEntry";
import { ExamReviewQuestion } from "./ExamReviewQuestion";

export function PaperAnswerGrid({ items, answers, onChange, onValidityChange }: {
  items: ReviewQuestion[]; answers: SelectedAnswers; onChange: (answers: SelectedAnswers) => void; onValidityChange: (invalid: boolean) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [active, setActive] = useState(0);
  const [viewQuestion, setViewQuestion] = useState<string | null>(items[0]?.question.id ?? null);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [notice, setNotice] = useState("");
  const [undo, setUndo] = useState<SelectedAnswers[]>([]);
  const [redo, setRedo] = useState<SelectedAnswers[]>([]);
  const inputs = useRef(new Map<number, HTMLInputElement>());
  const entered = items.filter(item => formatAnswerCell(answers[item.question.id]).trim()).length;
  const current = items[active];
  function focus(index: number) { const input = inputs.current.get(index); input?.focus(); input?.select(); input?.scrollIntoView({ block: "nearest" }); }
  function replace(next: SelectedAnswers) { setUndo(current => [...current.slice(-49), answers]); setRedo([]); onChange(next); }
  function setError(id: string, message: string) {
    const next = { ...errors }; if (message) next[id] = message; else delete next[id];
    setErrors(next); onValidityChange(Object.keys(next).length > 0);
  }
  function restore(next: SelectedAnswers) { setDrafts({}); setErrors({}); onValidityChange(false); onChange(next); }
  return <div className="paper-answer-grid-workspace">
    <div className="paper-answer-grid-toolbar"><div><strong>Response grid</strong><span>{entered} entered · {items.length - entered} blank · drafts saved on this device</span></div><div><label><input type="checkbox" checked={autoAdvance} onChange={event => setAutoAdvance(event.target.checked)} />Advance after a choice</label><button type="button" disabled={!undo.length} onClick={() => { setRedo(current => [...current, answers]); setUndo(undo.slice(0, -1)); restore(undo.at(-1)!); }}>Undo</button><button type="button" disabled={!redo.length} onClick={() => { setUndo(current => [...current, answers]); setRedo(redo.slice(0, -1)); restore(redo.at(-1)!); }}>Redo</button></div></div>
    <p className="paper-answer-grid-help">Type a choice letter to advance. Enter, Tab and ↑ / ↓ move between answers. Paste a column from Excel or Google Sheets, including blank cells. For A/B/C/D choices, E/F/G/H convert automatically.</p>
    <div className="paper-answer-grid-layout"><div className="paper-answer-grid-scroll"><table className="paper-answer-grid"><thead><tr><th scope="col">Question</th><th scope="col">Student response</th><th scope="col">Result</th><th scope="col">Question</th></tr></thead><tbody>{items.map((item, index) => {
      const id = item.question.id, text = drafts[id] ?? formatAnswerCell(answers[id]);
      const entered = Boolean(formatAnswerCell(answers[id]).trim());
      const correct = entered && isExamQuestionCorrect(item.question, answers[id]);
      return <tr key={id} className={`${active === index ? "is-active" : ""}${errors[id] ? " has-error" : ""}`}>
        <th scope="row"><span>{item.section === "math" ? "Math" : "ELA"}</span> {item.number}</th><td><input ref={node => { if (node) inputs.current.set(index, node); else inputs.current.delete(index); }} aria-label={`${item.section === "math" ? "Math" : "English"} question ${item.number} answer`} aria-invalid={Boolean(errors[id])} aria-describedby={errors[id] ? `answer-error-${id}` : "answer-grid-current-hint"} value={text} autoComplete="off" spellCheck={false} onFocus={event => { setActive(index); setViewQuestion(current => current ? id : null); event.currentTarget.select(); }} onChange={event => {
          const raw = event.target.value; setDrafts(current => ({ ...current, [id]: raw }));
          try { const answer = parseAnswerCell(item.question, raw); setError(id, ""); replace({ ...answers, [id]: answer });
            if (autoAdvance && (item.question.type === 'multiple_choice' || item.question.type === 'transition_drop' && !item.question.dragDropSlots?.length) && raw.trim()) { setDrafts(current => ({ ...current, [id]: formatAnswerCell(answer) })); focus(index + 1); }
          } catch (reason) { setError(id, (reason as Error).message); }
        }} onKeyDown={event => {
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); if (event.shiftKey && redo.length) { setUndo(current => [...current, answers]); setRedo(redo.slice(0, -1)); restore(redo.at(-1)!); } else if (!event.shiftKey && undo.length) { setRedo(current => [...current, answers]); setUndo(undo.slice(0, -1)); restore(undo.at(-1)!); } return; }
          if (["Enter", "Tab", "ArrowUp", "ArrowDown"].includes(event.key)) { const delta = event.key === "ArrowUp" || event.shiftKey ? -1 : 1; if (errors[id]) { event.preventDefault(); return; } if (event.key !== "Tab" || index + delta >= 0 && index + delta < items.length) { event.preventDefault(); focus(Math.max(0, Math.min(items.length - 1, index + delta))); } }
          if (event.key === "Escape") { setDrafts(current => ({ ...current, [id]: formatAnswerCell(answers[id]) })); setError(id, ""); }
        }} onPaste={event => {
          const source = event.clipboardData.getData("text"); if (!/[\n\t]/.test(source)) return;
          event.preventDefault();
          try { const changes = pasteAnswerCells(items, index, source); replace({ ...answers, ...changes });
            setDrafts(current => ({ ...current, ...Object.fromEntries(Object.entries(changes).map(([key, value]) => [key, formatAnswerCell(value)])) }));
            const nextErrors = { ...errors }; Object.keys(changes).forEach(key => delete nextErrors[key]); setErrors(nextErrors); onValidityChange(Object.keys(nextErrors).length > 0); setNotice(`Pasted ${Object.keys(changes).length} answers. Undo is available.`); focus(Math.min(items.length - 1, index + Object.keys(changes).length));
          } catch (reason) { setNotice((reason as Error).message); }
        }} />{errors[id] && <small id={`answer-error-${id}`} role="alert">{errors[id]}</small>}</td>
        <td><span className={`paper-answer-grid-status ${errors[id] ? "is-invalid" : !entered ? "is-blank" : correct ? "is-correct" : "is-incorrect"}`}>{errors[id] ? "Invalid" : !entered ? "Blank" : correct ? "Correct" : "Incorrect"}</span></td><td><button type="button" aria-pressed={viewQuestion === id} onClick={() => { setActive(index); setViewQuestion(viewQuestion === id ? null : id); }}>View {item.number}</button></td>
      </tr>;
    })}</tbody></table></div>
      {viewQuestion && <aside className="paper-answer-question-preview"><header><strong>Question preview</strong><button type="button" onClick={() => setViewQuestion(null)}>Close</button></header><ExamReviewQuestion item={items.find(item => item.question.id === viewQuestion)!} showAnswers={false} /></aside>}
    </div>
    <div id="answer-grid-current-hint" className="paper-answer-grid-hint"><strong>{current ? `${current.section === "math" ? "Math" : "English"} ${current.number}` : "Answer format"}</strong><span>{current ? answerCellHint(current.question) : "Choose a section above."}</span></div>
    {notice && <p role="status" className="paper-answer-grid-notice">{notice}</p>}
  </div>;
}
