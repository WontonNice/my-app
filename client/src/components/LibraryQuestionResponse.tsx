import type { ExamQuestion } from "../content/exams/types";
import { ExamText } from "./ExamReviewQuestion";
import { libraryAnswer } from "../../../server/src/shared/libraryBooks";

export function LibraryQuestionResponse({ question, value, onChange }: { question: ExamQuestion; value: string; onChange: (value: string) => void }) {
  const answer = libraryAnswer(value);
  const selected = Array.isArray(answer) ? answer : [];
  const placements = answer && typeof answer === "object" && !Array.isArray(answer) ? answer : {};
  const place = (id: string, value: string) => { const next = { ...placements }; if (value) next[id] = value; else delete next[id]; onChange(JSON.stringify(next)); };
  const toggle = (id: string) => onChange(JSON.stringify(selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id]));
  const text = typeof answer === "string" ? answer : "";
  return <div className="library-response">
    {(question.instructions || question.instructionsHtml) && <p><ExamText text={question.instructions} html={question.instructionsHtml} /></p>}
    {(question.stimulus || question.stimulusHtml) && <p><ExamText text={question.stimulus} html={question.stimulusHtml} /></p>}
    {question.image && <img src={question.image.src} alt={question.image.alt} />}
    {question.choices?.map(choice => <label className="exam-choice" key={choice.id}><input type={question.type === "multi_select" ? "checkbox" : "radio"} name={question.id} checked={question.type === "multi_select" ? selected.includes(choice.id) : text === choice.id} onChange={() => question.type === "multi_select" ? toggle(choice.id) : onChange(choice.id)} /><span>{choice.id}.</span><span><ExamText text={choice.math ? `\\(${choice.math}\\)` : choice.text} html={choice.html} />{choice.image && <img src={choice.image.src} alt={choice.image.alt} />}</span></label>)}
    {question.dropdownContent?.map((line, index) => <p key={index}><ExamText text={line.replace(/\{\{[^}]+\}\}/g, "[answer menu]")} /></p>)}
    {question.dropdowns?.map((menu, index) => <label key={menu.id}>Answer menu {index + 1}<select value={placements[menu.id] || ""} onChange={event => place(menu.id, event.target.value)}><option value="">Choose an answer</option>{menu.options.map(option => <option key={option.id} value={option.id}>{option.math || option.text}</option>)}</select></label>)}
    {question.items && ["category_sort", "table_match", "matrix_choice"].includes(question.type) && question.items.map(item => <label key={item.id}><ExamText text={item.text} html={item.html} /><select aria-label={`Placement for ${item.text}`} value={placements[item.id] || ""} onChange={event => place(item.id, event.target.value)}><option value="">Leave unused</option>{question.categories?.map(category => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>)}
    {question.dragDropContent?.map((line, index) => <p key={index}><ExamText text={line.replace(/\{\{[^}]+\}\}/g, "[answer box]")} /></p>)}
    {question.dragDropSlots?.map((slot, index) => <label key={slot.id}>Answer box {index + 1}<select value={placements[slot.id] || ""} onChange={event => place(slot.id, event.target.value)}><option value="">Choose an answer</option>{question.items?.map(item => <option key={item.id} value={item.id}>{item.text}</option>)}</select></label>)}
    {question.graph?.points.map(point => <label key={point.id}><input type="checkbox" checked={selected.includes(point.id)} onChange={() => toggle(point.id)} />({point.x}, {point.y})</label>)}
    {question.numberLineResponse && <><p>Number line: {question.numberLineResponse.min} to {question.numberLineResponse.max}</p><label>Boundary<input value={placements.value || ""} inputMode="decimal" onChange={event => place("value", event.target.value)} /></label><label>Direction<select value={placements.direction || ""} onChange={event => place("direction", event.target.value)}><option value="">Choose direction</option><option value="left">Left</option><option value="right">Right</option></select></label><label>Endpoint<select value={placements.endpoint || ""} onChange={event => place("endpoint", event.target.value)}><option value="">Choose endpoint</option><option value="open">Open</option><option value="closed">Closed</option></select></label></>}
    {["numeric_entry", "grid_in", "short_response", "essay"].includes(question.type) && <label>Answer<input value={text} onChange={event => onChange(event.target.value)} /></label>}
  </div>;
}
