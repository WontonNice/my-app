import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExamReviewQuestion, ExamText } from "./ExamReviewQuestion";
import { buildStudentAnalytics, groupResponseEvidence, mean, percentage, progression, scoresAreComparable, type AnalyticsExam, type AnalyticsInput, type Evidence, type SkillMetric } from "../lib/studentAnalytics";
import type { ExamQuestion } from "../content/exams";
import "../styles/student-analytics.css";

const pct = (value: number | null | undefined) => value == null ? "—" : `${value}%`;
const delta = (value: number | null) => value === null ? "Not enough comparable tests" : `${value > 0 ? "↑ +" : value < 0 ? "↓ " : "→ "}${value} pts`;
const dateLabel = (value: string | null) => value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Date unavailable";
const typeLabel = (value: string) => value.replace(/_/g, " ");
const skillAccuracy = (skill: SkillMetric) => percentage(skill.correct, skill.total) ?? 0;

export function StudentAnalyticsWorkstation({ inputs, initialAssessmentId, answerLabel, correctLabel, renderExam }: {
  inputs: AnalyticsInput[];
  initialAssessmentId?: string;
  answerLabel: (question: ExamQuestion, answer: unknown) => string;
  correctLabel: (question: ExamQuestion) => string;
  renderExam: (exam: AnalyticsExam) => ReactNode;
}) {
  const [source, setSource] = useState("All");
  const [tab, setTab] = useState("overview");
  const [metric, setMetric] = useState<"overall" | "english" | "math">("overall");
  const [openExam, setOpenExam] = useState(() => initialAssessmentId ? buildStudentAnalytics(inputs).exams.find(exam => exam.result.assessmentId === initialAssessmentId)?.key ?? "" : "");
  const [skillSort, setSkillSort] = useState("weakest");
  const [historySort, setHistorySort] = useState("newest");
  const [questionSort, setQuestionSort] = useState("newest");
  const [groupBy, setGroupBy] = useState<"passage" | "type">("passage");
  const [skillFilter, setSkillFilter] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [passageFilter, setPassageFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ filters: "", page: 0 });
  const [question, setQuestion] = useState<Evidence | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const table = useRef<HTMLElement>(null);
  const filteredInputs = useMemo(() => inputs.filter(input => source === "All" || (input.result.source === "manual" ? "Paper" : "Digital") === source), [inputs, source]);
  const data = useMemo(() => buildStudentAnalytics(filteredInputs), [filteredInputs]);
  const paginationFilters = JSON.stringify([skillFilter, examFilter, statusFilter, sectionFilter, passageFilter, typeFilter, search, source, questionSort]);
  const page = pagination.filters === paginationFilters ? pagination.page : 0;
  const setPage = (update: (current: number) => number) => setPagination({ filters: paginationFilters, page: update(page) });
  useEffect(() => { if (question) dialog.current?.showModal(); }, [question]);
  const complete = data.exams.filter(exam => exam.complete && exam.overall !== null);
  const overall = progression(data.exams, "overall");
  const english = progression(data.exams, "english");
  const math = progression(data.exams, "math");
  const trend = progression(data.exams, metric);
  const chartExams = data.exams.filter(exam => exam.date && exam[metric] !== null);
  const priorities = [...data.skills].filter(skill => skill.total >= 5 && skill.history.length >= 2 && skillAccuracy(skill) < 75)
    .sort((a, b) => skillAccuracy(a) - skillAccuracy(b) || (b.total - b.correct) - (a.total - a.correct)).slice(0, 3);
  const strengths = [...data.skills].filter(skill => skill.total >= 5 && skill.history.length >= 2 && skillAccuracy(skill) >= 80)
    .sort((a, b) => skillAccuracy(b) - skillAccuracy(a) || b.total - a.total).slice(0, 3);
  const skills = [...data.skills].sort((a, b) => {
    if (skillSort === "strongest") return skillAccuracy(b) - skillAccuracy(a);
    if (skillSort === "tested") return b.total - a.total;
    if (skillSort === "improving") return (b.change ?? -Infinity) - (a.change ?? -Infinity);
    if (skillSort === "declining") return (a.change ?? Infinity) - (b.change ?? Infinity);
    if (skillSort === "recent") return (Date.parse(b.history.filter(item => item.date).at(-1)?.date ?? "") || 0) - (Date.parse(a.history.filter(item => item.date).at(-1)?.date ?? "") || 0);
    return skillAccuracy(a) - skillAccuracy(b);
  });
  const history = [...data.exams].sort((a, b) => historySort === "score" ? (b.overall ?? -1) - (a.overall ?? -1) : historySort === "oldest" ? (Date.parse(a.date ?? "") || Infinity) - (Date.parse(b.date ?? "") || Infinity) : (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0));
  const chronologicalEvidence = useMemo(() => [...data.evidence].sort((a, b) => (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0) || a.examKey.localeCompare(b.examKey) || a.section.localeCompare(b.section) || a.number - b.number), [data.evidence]);
  const rows = useMemo(() => [...chronologicalEvidence].filter(row =>
    (!skillFilter || `${row.section}:${row.question.topic}` === skillFilter) && (!examFilter || row.examKey === examFilter)
    && (!statusFilter || row.status === statusFilter) && (!sectionFilter || row.section === sectionFilter)
    && (!passageFilter || row.passage?.id === passageFilter) && (!typeFilter || row.question.type === typeFilter)
    && (!search || `${row.question.prompt} ${row.examTitle} ${answerLabel(row.question, row.submittedAnswer)}`.toLowerCase().includes(search.toLowerCase())),
  ).sort((a, b) => questionSort === "number" ? a.number - b.number : questionSort === "oldest" ? (Date.parse(a.date ?? "") || Infinity) - (Date.parse(b.date ?? "") || Infinity) || a.number - b.number : 0), [chronologicalEvidence, skillFilter, examFilter, statusFilter, sectionFilter, passageFilter, typeFilter, search, answerLabel, questionSort]);
  const activeSkill = data.skills.find(skill => skill.key === skillFilter);
  const comparison = compare.map(key => data.exams.find(exam => exam.key === key)).filter((exam): exam is AnalyticsExam => Boolean(exam)).sort((a, b) => (Date.parse(a.date ?? "") || Infinity) - (Date.parse(b.date ?? "") || Infinity));
  const recentMistakes = chronologicalEvidence.filter(row => row.date && row.status === "Incorrect").slice(0, 5);
  const responseGroups = useMemo(() => groupResponseEvidence(data.evidence, groupBy), [data.evidence, groupBy]);
  const showEvidence = (skill = "", exam = "", status = "") => {
    setSkillFilter(skill); setExamFilter(exam); setStatusFilter(status); setSectionFilter(""); setPassageFilter(""); setTypeFilter(""); setSearch(""); setTab("questions");
    requestAnimationFrame(() => table.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const clear = () => { setSkillFilter(""); setExamFilter(""); setStatusFilter(""); setSectionFilter(""); setPassageFilter(""); setTypeFilter(""); setSearch(""); };
  const focusList = (items: SkillMetric[], empty: string) => items.length ? items.map(skill => <button key={skill.key} onClick={() => showEvidence(skill.key)} type="button"><span><strong>{skill.label}</strong><small>{skill.history.length} assessments · {skill.history.filter(item => item.correct < item.total).length} with missed questions</small></span><span><b>{pct(skillAccuracy(skill))}</b><small>{skill.correct}/{skill.total} · {skill.change === null ? "Trend not measured" : delta(skill.change)}</small></span></button>) : <p>{empty}</p>;

  return <div className="sa-workstation">
    <div className="sa-toolbar"><strong>Student analytics</strong><label>Assessment source <select value={source} onChange={event => { setSource(event.target.value); clear(); setCompare([]); }}><option>All</option><option>Paper</option><option>Digital</option></select></label><small>{data.exams.length} records · {data.evidence.length} question responses</small></div>
    <div className="sa-snapshot">
      {[
        ["Overall average", pct(mean(complete.map(exam => exam.overall))), `${complete.length} complete tests`],
        ["Latest complete", pct(overall.latest?.overall), overall.latest ? dateLabel(overall.latest.date) : "No dated completed test"],
        ["Recent average", pct(overall.recent), `${Math.min(3, overall.compatible.length)} comparable tests · ${overall.recentChange === null ? "last up to 3" : delta(overall.recentChange) + " vs previous 3"}`],
        ["English average", pct(mean(data.exams.map(exam => exam.english))), delta(english.change) + " since first"],
        ["Math average", pct(mean(data.exams.map(exam => exam.math))), delta(math.change) + " since first"],
        ["Best / completed", `${pct(complete.length ? Math.max(...complete.map(exam => exam.overall!)) : null)} / ${complete.length}`, `${data.exams.filter(exam => !exam.complete).length} section-only records`],
      ].map(([label, value, context]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>{context}</small></div>)}
    </div>
    <div className="sa-overview-grid">
      <section className="sa-panel sa-chart"><header><h3>Performance over time</h3><div className="sa-segments">{(["overall", "english", "math"] as const).map(value => <button aria-pressed={metric === value} key={value} onClick={() => setMetric(value)} type="button">{value === "overall" ? "Overall" : value === "english" ? "English" : "Math"}</button>)}</div></header>
        <div className="sa-progression"><span>First comparable <b>{pct(trend.first?.[metric])}</b></span><span>Latest <b>{pct(trend.latest?.[metric])}</b></span><strong>{delta(trend.change)}</strong></div>
        {chartExams.length ? <><svg viewBox="0 0 640 145" role="img" aria-label={`${metric} accuracy over time; exact scores and dates listed below`}>
          {[0, 50, 100].map(value => <g key={value}><line x1="35" y1={120 - value} x2="625" y2={120 - value} stroke="currentColor" opacity=".12" /><text x="0" y={124 - value} fontSize="10" fill="currentColor">{value}%</text></g>)}
          {chartExams.map(exam => {
            const firstDate = Date.parse(chartExams[0].date!); const lastDate = Date.parse(chartExams.at(-1)!.date!);
            const x = lastDate === firstDate ? 330 : 45 + 565 * (Date.parse(exam.date!) - firstDate) / (lastDate - firstDate);
            return <g key={exam.key}><circle cx={x} cy={120 - exam[metric]!} r="4" fill="currentColor"><title>{exam.title} · {dateLabel(exam.date)} · {pct(exam[metric])} · {exam.source}</title></circle></g>;
          })}
          <text x="35" y="142" fontSize="10" fill="currentColor">{dateLabel(chartExams[0].date)}</text><text x="625" y="142" textAnchor="end" fontSize="10" fill="currentColor">{dateLabel(chartExams.at(-1)!.date ?? null)}</text>
        </svg><div className="sa-chart-points">{chartExams.map(exam => <button key={exam.key} onClick={() => { setOpenExam(exam.key); setTab("history"); }} title={`${exam.title} · ${dateLabel(exam.date)} · Overall ${pct(exam.overall)} · English ${pct(exam.english)} · Math ${pct(exam.math)} · ${exam.correct ?? "—"}/${exam.total ?? "—"} · ${exam.source}`} type="button">{dateLabel(exam.date)} <b>{pct(exam[metric])}</b></button>)}</div></> : <p>No dated scores for this section yet.</p>}
        <small>Change uses matching question totals and completed sections. Scores from different exams do not measure test difficulty. One test cannot establish a trend.</small>
      </section>
      <section className="sa-panel sa-focus"><header><h3>Next-session targets</h3><small>Lowest accuracy first</small></header>{focusList(priorities, "No repeated weakness established yet.")}<header><h3>Demonstrated strengths</h3><small>80% or above</small></header>{focusList(strengths, "Not enough repeated evidence yet.")}<small>Targets: below 75%, at least 5 questions across 2 assessments. Smaller samples remain in the skill table.</small></section>
    </div>
    <nav className="sa-tabs" aria-label="Analytics views">{[["overview", "Overview"], ["skills", `Skills (${data.skills.length})`], ["groups", "Passages & question types"], ["history", `Assessment history (${data.exams.length})`], ["questions", `Question evidence (${data.evidence.length})`]].map(([id, label]) => <button aria-pressed={tab === id} key={id} onClick={() => setTab(id)} type="button">{label}</button>)}<button onClick={() => showEvidence("", "", "Incorrect")} type="button">Incorrect</button><button onClick={() => showEvidence("", "", "Unanswered")} type="button">Unanswered</button></nav>
    {tab === "groups" && <section className="sa-panel">
      <header><h3>Response patterns</h3><label>Group by <select value={groupBy} onChange={event => setGroupBy(event.target.value as "passage" | "type")}><option value="passage">Passage</option><option value="type">Question type</option></select></label></header>
      <div className="sa-table-scroll"><table><thead><tr><th>{groupBy === "passage" ? "Passage" : "Question type"}</th><th>Accuracy</th><th>Correct / tested</th><th>Incorrect</th><th>Unanswered</th><th>Assessments</th></tr></thead><tbody>{responseGroups.map(group => <tr key={group.key}><td><button className="sa-link" onClick={() => { showEvidence(); if (groupBy === "passage") setPassageFilter(group.key); else setTypeFilter(group.key); }} type="button">{group.label}</button>{group.total < 5 || group.assessments.size < 2 ? <small>Limited data</small> : null}</td><td>{pct(percentage(group.correct, group.total))}</td><td>{group.correct}/{group.total}</td><td>{group.incorrect}</td><td>{group.unanswered}</td><td>{group.assessments.size}</td></tr>)}</tbody></table></div>
      {!responseGroups.length && <p>No verified responses with this metadata.</p>}
      <footer><small>Weakest first. Includes only available individual responses; summary-only paper results remain in assessment history. Stand-alone questions are included by type, not passage.</small></footer>
    </section>}
    <div className={tab === "overview" ? "sa-tables-grid" : ""}>
      {(tab === "overview" || tab === "skills") && <section className="sa-panel"><header><h3>Skill performance</h3><label>Sort <select value={skillSort} onChange={event => setSkillSort(event.target.value)}>{[["weakest", "Weakest"], ["strongest", "Strongest"], ["tested", "Most tested"], ["improving", "Largest improvement"], ["declining", "Largest decline"], ["recent", "Last tested"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></header><div className="sa-table-scroll"><table><thead><tr><th>Skill / section</th><th>Overall</th><th>Correct / tested</th><th>Recent</th><th>Change</th><th>Evidence</th></tr></thead><tbody>{(tab === "overview" ? skills.slice(0, 6) : skills).map(skill => <tr key={skill.key}><td><button className="sa-link" onClick={() => showEvidence(skill.key)} type="button">{skill.label}</button><small>{skill.section} · {skill.history.length} assessments{skill.total < 5 || skill.history.length < 2 ? " · Limited data" : ""}</small></td><td>{pct(skillAccuracy(skill))}<i className="sa-meter"><i style={{ width: `${skillAccuracy(skill)}%` }} /></i></td><td>{skill.correct}/{skill.total}</td><td>{pct(skill.recent)}</td><td>{skill.change === null ? "—" : delta(skill.change)}</td><td>{skill.evidence.length}/{skill.total}<small>responses available</small></td></tr>)}</tbody></table></div>{!skills.length && <p>No skill data recorded.</p>}<footer><small>Recent = last up to 3 tested assessments; change compares the preceding up to 3. Blank responses reduce accuracy but remain separate from incorrect answers.</small>{tab === "overview" && skills.length > 6 && <button onClick={() => setTab("skills")} type="button">All {skills.length} skills →</button>}</footer></section>}
      {(tab === "overview" || tab === "history") && <section className="sa-panel"><header><h3>Assessment history</h3><label>Sort <select value={historySort} onChange={event => setHistorySort(event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="score">Highest score</option></select></label></header><div className="sa-table-scroll"><table><thead><tr><th>Compare</th><th>Assessment / date</th><th>Overall</th><th>English</th><th>Math</th><th>Correct / tested</th><th>Type</th></tr></thead><tbody>{(tab === "overview" ? history.slice(0, 5) : history).map(exam => <Fragment key={exam.key}><tr><td><input aria-label={`Compare ${exam.title} ${dateLabel(exam.date)}`} checked={compare.includes(exam.key)} disabled={!compare.includes(exam.key) && compare.length === 2} onChange={event => setCompare(current => event.target.checked ? [...current, exam.key] : current.filter(key => key !== exam.key))} type="checkbox" /></td><td><button aria-expanded={openExam === exam.key} className="sa-link" onClick={() => { setOpenExam(current => current === exam.key ? "" : exam.key); setTab("history"); }} type="button">{exam.title}</button><small>{dateLabel(exam.date)}{!exam.complete ? " · Section only" : ""}</small></td><td>{pct(exam.overall)}</td><td>{pct(exam.english)}</td><td>{pct(exam.math)}</td><td>{exam.correct ?? "—"}/{exam.total ?? "—"}</td><td>{exam.source}</td></tr>{openExam === exam.key && <tr><td colSpan={7}><div className="sa-exam-details"><button onClick={() => showEvidence("", exam.key)} type="button">View {exam.evidence.length} question responses</button><small>{exam.evidence.length ? "Question grading uses matching current exam content." : "This record has no individual answers; only stored totals are shown."}</small>{renderExam(exam)}</div></td></tr>}</Fragment>)}</tbody></table></div>{!history.length && <p>No assessments recorded yet.</p>}{tab === "overview" && history.length > 5 && <footer><button onClick={() => setTab("history")} type="button">All {history.length} assessments →</button></footer>}
        {comparison.length === 2 && <div className="sa-comparison"><header><h4>{comparison[0].title} → {comparison[1].title}</h4><button onClick={() => setCompare([])} type="button">Clear comparison</button></header><table><thead><tr><th>Measure</th><th>First selection</th><th>Second selection</th><th>Change</th></tr></thead><tbody>{(["overall", "english", "math"] as const).map(value => <tr key={value}><th>{value}</th><td>{pct(comparison[0][value])}</td><td>{pct(comparison[1][value])}</td><td>{comparison[0][value] !== null && comparison[1][value] !== null && scoresAreComparable(comparison[0], comparison[1], value) ? delta(comparison[1][value]! - comparison[0][value]!) : "Not comparable"}</td></tr>)}<tr><th>Correct / tested</th>{comparison.map(exam => <td key={exam.key}>{exam.correct ?? "—"}/{exam.total ?? "—"}</td>)}<td>Stored scores</td></tr>{data.skills.filter(skill => comparison.every(exam => skill.history.some(item => item.examKey === exam.key))).map(skill => { const samples = comparison.map(exam => skill.history.find(item => item.examKey === exam.key)!); const values = samples.map(item => percentage(item.correct, item.total)!); return <tr key={skill.key}><th>{skill.label}</th><td>{pct(values[0])} · {samples[0].correct}/{samples[0].total}</td><td>{pct(values[1])} · {samples[1].correct}/{samples[1].total}</td><td>{delta(values[1] - values[0])}</td></tr>; })}</tbody></table></div>}
      </section>}
    </div>
    {tab === "overview" && <section className="sa-panel"><header><h3>Recent incorrect responses</h3><button onClick={() => showEvidence("", "", "Incorrect")} type="button">All incorrect responses →</button></header><div className="sa-table-scroll"><table><thead><tr><th>Question / exam</th><th>Skill</th><th>Student answer</th><th>Correct answer</th></tr></thead><tbody>{recentMistakes.map(row => <tr key={row.key}><td><button className="sa-link" onClick={() => setQuestion(row)} type="button">{row.section} Q{row.number} · {row.examTitle}</button><small>{dateLabel(row.date)}</small></td><td>{row.question.topic}</td><td>{answerLabel(row.question, row.submittedAnswer)}</td><td>{correctLabel(row.question)}</td></tr>)}</tbody></table></div>{!recentMistakes.length && <p>No recorded incorrect responses.</p>}</section>}
    {tab === "questions" && <section className="sa-panel" ref={table}><header><h3>Question evidence {activeSkill ? `· ${activeSkill.label}` : ""}</h3><button onClick={clear} type="button">Reset filters</button></header>
      {activeSkill && <div className="sa-skill-history"><strong>{activeSkill.correct}/{activeSkill.total} correct · {activeSkill.evidence.length} responses available</strong><small>{activeSkill.incorrect === null ? "Some results contain totals only; unanswered counts are not measured for those results." : `${activeSkill.incorrect} incorrect · ${activeSkill.unanswered} unanswered`}</small><div>{activeSkill.history.map(item => <button key={item.examKey} onClick={() => setExamFilter(item.examKey)} type="button">{item.title} · {dateLabel(item.date)} <b>{pct(percentage(item.correct, item.total))}</b> {item.correct}/{item.total}</button>)}</div></div>}
      <div className="sa-filters">
        <label>Result<select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="">All results</option>{["Correct", "Incorrect", "Unanswered"].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Section<select value={sectionFilter} onChange={event => setSectionFilter(event.target.value)}><option value="">English + Math</option><option value="english">English</option><option value="math">Math</option></select></label>
        <label>Assessment<select value={examFilter} onChange={event => setExamFilter(event.target.value)}><option value="">All assessments</option>{data.exams.map(exam => <option key={exam.key} value={exam.key}>{exam.title} · {dateLabel(exam.date)}</option>)}</select></label>
        <label>Skill<select value={skillFilter} onChange={event => setSkillFilter(event.target.value)}><option value="">All skills</option>{data.skills.map(skill => <option key={skill.key} value={skill.key}>{skill.label} · {skill.section}</option>)}</select></label>
        <label>Passage<select value={passageFilter} onChange={event => setPassageFilter(event.target.value)}><option value="">All passages</option>{[...new Map(data.evidence.flatMap(row => row.passage ? [[row.passage.id, row.passage.title] as const] : [])).entries()].map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label>
        <label>Question type<select value={typeFilter} onChange={event => setTypeFilter(event.target.value)}><option value="">All types</option>{[...new Set(data.evidence.map(row => row.question.type))].map(type => <option key={type} value={type}>{typeLabel(type)}</option>)}</select></label>
        <label>Search<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Question, exam, or answer" /></label>
        <label>Question order<select value={questionSort} onChange={event => setQuestionSort(event.target.value)}><option value="newest">Newest assessment</option><option value="oldest">Oldest assessment</option><option value="number">Question number</option></select></label>
      </div><div className="sa-table-scroll"><table><thead><tr><th>Question / assessment</th><th>Section / passage</th><th>Skill / type</th><th>Student answer</th><th>Correct answer</th><th>Result</th><th>Time</th></tr></thead><tbody>{rows.slice(Math.min(page, Math.max(0, Math.ceil(rows.length / 40) - 1)) * 40, (Math.min(page, Math.max(0, Math.ceil(rows.length / 40) - 1)) + 1) * 40).map(row => <tr key={row.key}><td><button className="sa-link" onClick={() => setQuestion(row)} type="button">Q{row.number} · {row.examTitle}</button><small>{dateLabel(row.date)} · {row.source}</small></td><td>{row.section}<small>{row.passage?.title ?? "Stand-alone"}</small></td><td>{row.question.topic}<small>{typeLabel(row.question.type)}</small></td><td className="sa-answer-cell">{answerLabel(row.question, row.submittedAnswer)}</td><td className="sa-answer-cell">{correctLabel(row.question)}</td><td><span className={`sa-status is-${row.status.toLowerCase()}`}>{row.status === "Correct" ? "✓ " : row.status === "Incorrect" ? "✕ " : "— "}{row.status}</span></td><td>{row.seconds == null ? "Not recorded" : `${Math.round(row.seconds)}s`}</td></tr>)}</tbody></table></div>{!rows.length && <p>No question responses match these filters. Summary-only paper scores cannot supply individual answers.</p>}<footer><small>{rows.length} matching responses · {rows.filter(row => row.status === "Correct").length} correct · {rows.filter(row => row.status === "Incorrect").length} incorrect · {rows.filter(row => row.status === "Unanswered").length} unanswered</small><div><button disabled={page === 0} onClick={() => setPage(current => current - 1)} type="button">Previous</button><span>Page {Math.min(page + 1, Math.max(1, Math.ceil(rows.length / 40)))} / {Math.max(1, Math.ceil(rows.length / 40))}</span><button disabled={(page + 1) * 40 >= rows.length} onClick={() => setPage(current => current + 1)} type="button">Next</button></div></footer>
    </section>}
    <dialog aria-labelledby="sa-question-title" aria-describedby="sa-question-meta" className="sa-question-dialog" ref={dialog} onClose={() => setQuestion(null)}>{question && <><header><div><strong id="sa-question-title">{question.examTitle} · {question.section} Q{question.number}</strong><small id="sa-question-meta">{dateLabel(question.date)} · {question.source} · {question.status}</small></div><button autoFocus onClick={() => dialog.current?.close()} type="button">Close details</button></header><div className="sa-dialog-body"><p>{question.question.topic} · {typeLabel(question.question.type)}{question.seconds != null ? ` · ${Math.round(question.seconds)}s recorded` : ""}</p><details><summary>Exact stored response</summary><pre>{question.submittedAnswer === undefined ? "No answer stored" : JSON.stringify(question.submittedAnswer, null, 2)}</pre></details><ExamReviewQuestion item={question} />{(question.question.explanation || question.question.explanationHtml) && <section><h3>Answer explanation</h3><ExamText text={question.question.explanation} html={question.question.explanationHtml} /></section>}<small>Answer status is evaluated using the existing grader and current matching question content; stored exam scores are unchanged.</small></div></>}</dialog>
  </div>;
}
