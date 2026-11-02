import { useState } from "react";
import { PASSAGE_CATEGORIES, passageCategoryLabel } from "../../../server/src/shared/passageCategories";
import { contentHasCompleted, filterContentInventory, passageCompletionDate, passageSource, type ContentInventory, type PassageCompletionFilter } from "../lib/passageOrganization";

export function StudentPassageProgress({ inventory, completion, onCompletionChange }: {
  inventory?: ContentInventory;
  completion: PassageCompletionFilter;
  onCompletionChange: (value: PassageCompletionFilter) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category,setCategory]=useState(''),[score,setScore]=useState(''),[order,setOrder]=useState('newest');
  const passages = inventory?.filter(row => row.content.kind === "passage" && row.content.subject === "English") ?? [];
  const completed = passages.filter(contentHasCompleted).length;
  const rows = filterContentInventory(passages, { kind: "passage", status, genre: "", category, score, subject: "English", skill: "", search, sort: order==='newest'||order==='oldest'?'completed':order==='title'?'title':'score', direction: order==='newest'||order==='highest'?'desc':'asc', completion });
  const hasFilters = Boolean(search.trim() || status || category || score || order!=='newest');
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
      <div className="sa-filters"><label>Search passages or sources<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Title or 2020-2021 Form B" /></label><label>Assignment status<select value={status} onChange={event => setStatus(event.target.value)}><option value="">All statuses</option>{[...new Set(passages.map(row => row.status))].sort().map(value => <option key={value}>{value}</option>)}</select></label><label>Source type<select value={category} onChange={event=>setCategory(event.target.value)}><option value="">All source types</option>{PASSAGE_CATEGORIES.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label>Score<select value={score} onChange={event=>setScore(event.target.value)}><option value="">All scores</option><option value="below70">Below 70%</option><option value="atleast70">70% and above</option><option value="unscored">No recorded score</option></select></label><label>Order<select value={order} onChange={event=>setOrder(event.target.value)}><option value="newest">Recently completed</option><option value="oldest">Oldest completion</option><option value="lowest">Lowest score</option><option value="highest">Highest score</option><option value="title">Title A–Z</option></select></label></div>
      {rows.length > 0 && <div className="sa-table-scroll" role="region" aria-label="Passage checklist table" tabIndex={0}><table aria-label="English passage completion"><thead><tr><th scope="col">Passage</th><th scope="col">Source / version</th><th scope="col">Latest recorded score</th><th scope="col">Completion</th><th scope="col">Assignment status</th><th scope="col">Last completed</th></tr></thead><tbody>{rows.map(row => <tr key={row.content.id}><td>{row.content.title}<small>{passageCategoryLabel(row.content.passageCategory)}</small></td><td>{passageSource(row.content)}</td><td>{row.latestScore?`${row.latestScore.correct}/${row.latestScore.total} · ${Math.round(100*row.latestScore.correct/row.latestScore.total)}%`:"No recorded score"}{row.latestScore&&<small>{passageCompletionDate(row.latestScore.at)}</small>}</td><td>{contentHasCompleted(row) ? "Completed" : "Not yet completed"}</td><td>{row.status}</td><td>{passageCompletionDate(row.lastCompletedAt)}</td></tr>)}</tbody></table></div>}
      {!rows.length && <p role="status">{!passages.length ? "No English passages are available in the content library yet." : hasFilters ? "No passages match these filters. Try another title, source, or assignment status." : completion === "not_completed" ? "All available passages have a recorded completion. Choose Completed to review them." : completion === "completed" ? "No passages have a recorded completion yet. Choose Not yet completed to see what remains." : "No passages match these filters."}</p>}
      <footer><small>{rows.length} matching passages. Dates come from recorded completions; missing dates show No Data. Scores use the latest scored completion, which may precede the last completion. Missing scores stay unknown.</small>{hasFilters && <button type="button" onClick={() => { setSearch(""); setStatus(""); setCategory('');setScore('');setOrder('newest'); }}>Clear checklist filters</button>}</footer>
    </>}
  </section>;
}
