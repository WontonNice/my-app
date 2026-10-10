import { useState } from "react";
import { passageCategoryLabel } from "../../../server/src/shared/passageCategories";
import { contentHasCompleted, filterContentInventory, passageCompletionDate, passageSource, type ContentInventory, type PassageCompletionFilter } from "../lib/passageOrganization";

export function StudentPassageProgress({ inventory }: { inventory?: ContentInventory }) {
  const [completion, setCompletion] = useState<PassageCompletionFilter>("completed");
  const [search, setSearch] = useState("");
  const rows = filterContentInventory(inventory ?? [], { kind: "passage", status: "", genre: "", category: "", subject: "English", skill: "", search, sort: "title", direction: "asc", completion });
  return <section className="sa-panel" aria-label="Student passage progress">
    <header><h3>Passage progress</h3><small>Each source version has its own row.</small></header>
    <div className="sa-filters"><label>Passage completion<select value={completion} onChange={event => setCompletion(event.target.value as PassageCompletionFilter)}><option value="">All passages</option><option value="completed">Completed passages</option><option value="not_completed">Not yet completed</option></select></label><label>Search passages or sources<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Title or 2020-2021 Form B" /></label></div>
    {inventory === undefined ? <p>Passage history is not available yet.</p> : <>
      <div className="sa-table-scroll"><table><thead><tr><th>Passage</th><th>Source / version</th><th>Completion</th><th>Last completed</th></tr></thead><tbody>{rows.map(row => <tr key={row.content.id}><td>{row.content.title}<small>{passageCategoryLabel(row.content.passageCategory)}</small></td><td>{passageSource(row.content)}</td><td>{contentHasCompleted(row) ? "Completed" : "Not yet completed"}<small>{row.status}</small></td><td>{passageCompletionDate(row.lastCompletedAt)}</td></tr>)}</tbody></table></div>
      {!rows.length && <p>No passages match these filters.</p>}<footer><small>{rows.length} matching passages. Dates come from recorded completions; missing dates show No Data. Repeat assignments retain earlier completion history.</small></footer>
    </>}
  </section>;
}
