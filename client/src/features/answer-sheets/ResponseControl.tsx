import type { SelectedAnswer } from "../../../../server/src/shared/examGrading";
import type { SheetItem } from "../../../../server/src/shared/answerSheets";
export function ResponseControl({ item, value, onChange, disabled = false, name = item.id }: { item: SheetItem; value?: SelectedAnswer; onChange: (answer: SelectedAnswer) => void; disabled?: boolean; name?: string }) {
  if (item.type === "short_response") return <label className="as-short"><span className="sr-only">Question {item.number} short answer</span>{item.multiline ? <textarea aria-label={`Question ${item.number} short answer`} disabled={disabled} rows={3} value={typeof value === "string" ? value : ""} onChange={event => onChange(event.target.value)} /> : <input aria-label={`Question ${item.number} short answer`} disabled={disabled} value={typeof value === "string" ? value : ""} onChange={event => onChange(event.target.value)} />}<small>{typeof value === "string" ? value.length : 0} / 10,000 characters · stored exactly as typed</small></label>;
  const selected = Array.isArray(value) ? value : [];
  return <div className="as-choices" role="group" aria-label={`Question ${item.number} ${item.type === "multi_select" ? "multiple selections" : "single choice"}`}>
    {item.options.map(option => <label key={option.id} className={(item.type === "multi_select" ? selected.includes(option.id) : value === option.id) ? "is-selected" : ""}><input type={item.type === "multi_select" ? "checkbox" : "radio"} name={name} disabled={disabled} checked={item.type === "multi_select" ? selected.includes(option.id) : value === option.id} onChange={() => onChange(item.type === "multi_select" ? selected.includes(option.id) ? selected.filter(id => id !== option.id) : [...selected, option.id] : option.id)} /><span>{option.label}</span></label>)}
    <button className="as-clear" type="button" disabled={disabled} onClick={() => onChange(item.type === "multi_select" ? [] : "")}>Clear</button>
  </div>;
}
