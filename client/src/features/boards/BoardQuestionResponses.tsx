import type { ExamQuestion } from "../../content/exams";
import { ExamText } from "../../components/ExamReviewQuestion";

// Reference screens show every authored response option and target. They do
// not submit an exam attempt or expose grading information.
export function BoardQuestionResponses({ question }: { question: ExamQuestion }) {
  return <div className="board-question-responses">
    {question.items && ["category_sort", "table_match", "math_drag_drop"].includes(question.type) && <div className="board-response-bank">{question.items.map(item => <span key={item.id}><ExamText text={item.text} html={item.html} /></span>)}</div>}
    {question.type === "category_sort" && <div className="board-response-targets">{question.categories?.map(category => <section key={category.id}><strong>{category.title}</strong><div className="board-response-box" aria-label={category.title}>Drop answer here</div></section>)}</div>}
    {question.type === "table_match" && <table className="board-response-table"><thead><tr><th>{question.tableHeaders?.row || "Row"}</th><th>{question.tableHeaders?.answer || "Answer"}</th></tr></thead><tbody>{question.categories?.map(category => <tr key={category.id}><th>{category.title}</th><td><div className="board-response-box">Drop answer here</div></td></tr>)}</tbody></table>}
    {question.type === "transition_drop" && <p className="board-transition-preview">{question.transitionSentenceNumber} <ExamText text={question.transitionBlankBefore} /><span className="board-inline-box">Drop answer</span><ExamText text={question.transitionBlankAfter} /></p>}
    {question.dropdowns?.map((dropdown, index) => <label className="board-dropdown-preview" key={dropdown.id}>Answer menu {index + 1}<select aria-label={`Answer menu ${index + 1}`} disabled defaultValue=""><option value="">Choose an answer</option>{dropdown.options.map(option => <option key={option.id} value={option.id}>{option.math || option.text}</option>)}</select></label>)}
    {question.type === "math_drag_drop" && <div className="board-response-targets">{question.dragDropSlots?.map((slot, index) => <div className="board-response-box" key={slot.id}>Answer box {index + 1}</div>)}</div>}
    {["numeric_entry", "grid_in"].includes(question.type) && <label className="board-dropdown-preview">Enter your answer<input aria-label="Question answer" readOnly inputMode="decimal" placeholder={question.entryLayout === "fraction" ? "numerator / denominator" : question.entryLayout === "x_equals" ? "x =" : "Answer"} /></label>}
    {["short_response", "essay"].includes(question.type) && <textarea readOnly aria-label="Question response" placeholder="Write your response" rows={4} />}
    {question.numberLineResponse && <div className="board-number-line"><span>{question.numberLineResponse.min}</span><hr /><span>{question.numberLineResponse.max}</span></div>}
  </div>;
}
