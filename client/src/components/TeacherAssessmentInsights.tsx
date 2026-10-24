import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, BarChart3, Eye, Search } from "lucide-react";
import { AppLink } from "./AppLink";
import { isFullExamResult, submittedExamSections } from "../../../server/src/shared/examCompletion";
import type { StudentProgressSnapshot } from "../lib/api";
import type { ClassAssessmentInsight, ClassLeaderboard } from "../pages/TeacherDashboardPage";

const percent = (value: number | null) => value === null ? "—" : `${value}%`;
function resultStatus(result?: Record<string, unknown>) {
  if (!result) return "Not submitted";
  if (isFullExamResult(result)) return "Full exam submitted";
  const sections = submittedExamSections(result);
  return sections.includes("math") ? "English pending" : sections.includes("english") ? "Math pending" : "Summary only";
}

export function TeacherAssessmentInsights({ insight, students, previewHref, studentHref, renderLeaderboard }: {
  insight: ClassAssessmentInsight;
  students: StudentProgressSnapshot[];
  previewHref: string;
  studentHref: (studentId: string) => string;
  renderLeaderboard: (leaderboard: ClassLeaderboard, subtitle: string) => ReactNode;
}) {
  const [view, setView] = useState("students");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name");
  const [selectedPassage, setSelectedPassage] = useState("");
  const rows = useMemo(() => {
    const english = new Map(insight.english.entries.map(entry => [entry.studentId, entry.score]));
    const math = new Map(insight.math.entries.map(entry => [entry.studentId, entry.score]));
    return students.map(student => {
      const result = student.progress.examResults.find(item => item.assessmentId === insight.assessmentId);
      const complete = Boolean(result && isFullExamResult(result));
      return { student, result, complete, english: english.get(student.id), math: math.get(student.id), overall: complete && typeof result?.percentage === "number" ? result.percentage : null };
    }).filter(row => `${row.student.fullName} ${row.student.username}`.toLowerCase().includes(search.toLowerCase()) && (status === "all" || status === "full" && row.complete || status === "partial" && row.result && !row.complete || status === "pending" && !row.result))
      .sort((a,b) => {
        const score = (row: typeof a) => sort === "overall" ? row.overall : row[sort === "english" ? "english" : "math"] ? 100 * row[sort === "english" ? "english" : "math"]!.correct / row[sort === "english" ? "english" : "math"]!.total : null;
        if (sort === "name") return a.student.fullName.localeCompare(b.student.fullName);
        const left = score(a), right = score(b);
        return left === null || right === null ? left === right ? a.student.fullName.localeCompare(b.student.fullName) : left === null ? 1 : -1 : left - right || a.student.fullName.localeCompare(b.student.fullName);
      });
  }, [insight, students, search, status, sort]);
  const passage = insight.passages.find(item => item.id === selectedPassage) ?? insight.passages[0];
  const scoreCell = (score: typeof insight.english.entries[number]["score"] | undefined, pending: string) => score ? <><strong>{Math.round(100 * score.correct / score.total)}%</strong><small>{score.correct} / {score.total} correct</small></> : <><span className="assessment-no-score">—</span><small>{pending}</small></>;
  return <section className="assessment-insights" aria-label={`${insight.title} class insights`}>
    <div className="assessment-insights-heading"><div><BarChart3 size={18} /><span>Class performance</span></div><a className="assessment-button" href={previewHref} target="_blank" rel="noreferrer"><Eye size={15} /> View test <ArrowUpRight size={13} /></a></div>
    <div className="assessment-insight-metrics">
      <article><span>Full-exam average</span><strong>{percent(insight.overallAverage)}</strong><small>{insight.fullSubmissions} full exam{insight.fullSubmissions === 1 ? "" : "s"} · mean of percentages</small></article>
      <article><span>English average</span><strong>{percent(insight.english.average)}</strong><small>{insight.english.scoredStudents} / {students.length} students scored</small></article>
      <article><span>Math average</span><strong>{percent(insight.math.average)}</strong><small>{insight.math.scoredStudents} / {students.length} students scored</small></article>
      <article><span>Submission coverage</span><strong>{insight.submissions}<em> / {students.length}</em></strong><small>{insight.submissions - insight.fullSubmissions} section / other · {students.length - insight.submissions} not submitted</small></article>
    </div>
    <div className="assessment-insight-navigation" aria-label="Class insight views">
      {[["students", `Student results (${students.length})`], ["sections", "Section rankings"], ["passages", `Passage analysis (${insight.passages.length})`]].map(([id,label]) => <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}
    </div>
    {view === "students" && <section className="assessment-results-panel" aria-label="Student exam results">
      <div className="assessment-results-toolbar"><label className="assessment-search"><Search size={16} /><input aria-label="Find a student" type="search" placeholder="Find a student…" value={search} onChange={event => setSearch(event.target.value)} /></label><label>Submission<select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All students</option><option value="full">Full exam submitted</option><option value="partial">Section / other results</option><option value="pending">Not submitted</option></select></label><label>Sort<select value={sort} onChange={event => setSort(event.target.value)}><option value="name">Name A–Z</option><option value="english">Lowest English</option><option value="math">Lowest Math</option><option value="overall">Lowest full-exam score</option></select></label><span aria-live="polite">{rows.length} student{rows.length === 1 ? "" : "s"}</span></div>
      <div className="assessment-results-scroll"><table><thead><tr><th scope="col">Student</th><th scope="col">English</th><th scope="col">Math</th><th scope="col">Full exam</th><th scope="col">Submission</th><th scope="col"><span className="sr-only">Student analytics</span></th></tr></thead><tbody>{rows.map(row => <tr key={row.student.id}><th scope="row"><strong>{row.student.fullName}</strong><small>@{row.student.username}</small></th><td>{scoreCell(row.english, row.result ? "Not graded" : "Not submitted")}</td><td>{scoreCell(row.math, row.result ? "Not graded" : "Not submitted")}</td><td><strong>{percent(row.overall)}</strong><small>{row.complete ? "Both sections" : "Awaiting both sections"}</small></td><td><span className={`assessment-submission-status ${row.complete ? "is-complete" : row.result ? "is-partial" : ""}`}>{resultStatus(row.result)}</span></td><td>{row.result ? <AppLink className="assessment-row-link" href={studentHref(row.student.id)}>Analytics <ArrowUpRight size={13} /></AppLink> : <span className="assessment-no-score">—</span>}</td></tr>)}</tbody></table></div>
      {!rows.length && <div className="assessment-empty"><strong>{students.length ? "No matching students" : "No students enrolled"}</strong><p>{students.length ? "Adjust the search or submission filter." : "Results will appear here when students join the class."}</p>{students.length > 0 && <button className="assessment-button" type="button" onClick={() => { setSearch(""); setStatus("all"); }}>Clear filters</button>}</div>}
    </section>}
    {view === "sections" && <div className="teacher-leaderboard-grid teacher-section-leaderboards">{renderLeaderboard(insight.english,"English section")}{renderLeaderboard(insight.math,"Math section")}</div>}
    {view === "passages" && <section className="assessment-passage-panel" aria-label="Passage analysis">
      <div className="assessment-results-panel"><div className="assessment-panel-heading"><h2>Passage comparison</h2><p>Select a passage to inspect its student rankings.</p></div><div className="assessment-results-scroll"><table><thead><tr><th scope="col">English passage</th><th scope="col">Class average</th><th scope="col">Students scored</th><th scope="col">Correct / tested</th></tr></thead><tbody>{insight.passages.map((item,index) => <tr key={item.id} className={passage?.id === item.id ? "is-selected" : ""}><th scope="row"><button type="button" className="assessment-passage-link" aria-pressed={passage?.id === item.id} onClick={() => setSelectedPassage(item.id)}><small>Passage {index+1}</small>{item.title}</button></th><td><strong>{percent(item.average)}</strong></td><td>{item.scoredStudents} / {students.length}</td><td>{item.entries.reduce((sum,entry) => sum + (entry.score?.correct ?? 0),0)} / {item.entries.reduce((sum,entry) => sum + (entry.score?.total ?? 0),0)}</td></tr>)}</tbody></table></div>{!insight.passages.length && <div className="assessment-empty"><p>Passage-level scores are unavailable for this exam.</p></div>}</div>
      {passage && renderLeaderboard(passage,"Selected passage")}
    </section>}
    <p className="assessment-data-note">Only submitted sections are graded. Full-exam averages require both English and Math; missing scores stay unknown. Section and passage averages are means of recorded student percentages. Rankings use percent accuracy, with shared ranks for ties.</p>
  </section>;
}
