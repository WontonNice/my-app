import { useState } from "react";
import { passageCategoryLabel } from "../../../server/src/shared/passageCategories";
import { contentHasCompleted, filterContentInventory, passageCompletionDate, passageSource, type ContentInventory, type PassageCompletionFilter } from "../lib/passageOrganization";

export function StudentPassageProgress({ inventory, completion, onCompletionChange }: {
  inventory?: ContentInventory;
  completion: PassageCompletionFilter;
  onCompletionChange: (value: PassageCompletionFilter) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const passages = inventory?.filter(row => row.content.kind === "passage" && row.content.subject === "English") ?? [];
  const completed = passages.filter(contentHasCompleted).length;
  const rows = filterContentInventory(passages, { kind: "passage", status, genre: "", category: "", subject: "English", skill: "", search, sort: "title", direction: "asc", completion });
  const hasFilters = Boolean(search.trim() || status);
  return <section className="sa-panel" aria-label="Student passage progress">
    <header><h3>Passage checklist</h3><small>Each source version has its own row.</small></header>
    <p>All English passages, including those never assigned. Assessment filters above do not limit this checklist.</p>
    {inventory === undefined ? <p>Passage history is not available yet.</p> : <>
      <div className="sa-passage-options" role="group" aria-label="Passage completion">
        {([
          ["not_completed", "Not yet completed", passages.length - completed],
          ["completed", "Completed", completed],
          ["", "All passages", passages.length],
        ] as const).map(([value, label, count]) => <button key={value} type="button" aria-pressed={completion === value} onClick={() => onCompletionChange(value)}>{label} ({count})</button>)}
      </div>
      <div className="sa-filters"><label>Search passages or sources<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Title or 2020-2021 Form B" /></label><label>Assignment status<select value={status} onChange={event => setStatus(event.target.value)}><option value="">All statuses</option>{[...new Set(passages.map(row => row.status))].sort().map(value => <option key={value}>{value}</option>)}</select></label></div>
      {rows.length > 0 && <div className="sa-table-scroll" role="region" aria-label="Passage checklist table" tabIndex={0}><table aria-label="English passage completion"><thead><tr><th scope="col">Passage</th><th scope="col">Source / version</th><th scope="col">Completion</th><th scope="col">Assignment status</th><th scope="col">Last completed</th></tr></thead><tbody>{rows.map(row => <tr key={row.content.id}><td>{row.content.title}<small>{passageCategoryLabel(row.content.passageCategory)}</small></td><td>{passageSource(row.content)}</td><td>{contentHasCompleted(row) ? "Completed" : "Not yet completed"}</td><td>{row.status}</td><td>{passageCompletionDate(row.lastCompletedAt)}</td></tr>)}</tbody></table></div>}
      {!rows.length && <p role="status">{!passages.length ? "No English passages are available in the content library yet." : hasFilters ? "No passages match these filters. Try another title, source, or assignment status." : completion === "not_completed" ? "All available passages have a recorded completion. Choose Completed to review them." : completion === "completed" ? "No passages have a recorded completion yet. Choose Not yet completed to see what remains." : "No passages match these filters."}</p>}
      <footer><small>{rows.length} matching passages. Dates come from recorded completions; missing dates show No Data. Repeat assignments retain earlier completion history.</small>{hasFilters && <button type="button" onClick={() => { setSearch(""); setStatus(""); }}>Clear search and status</button>}</footer>
    </>}
  </section>;
}
