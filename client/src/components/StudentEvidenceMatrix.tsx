import { useId, useState } from "react";
import { analysisDay, evidenceSummary, type detailedGroups } from "../lib/analyticsDetails";
import type { AnalyticsExam, Evidence } from "../lib/studentAnalytics";

export function StudentEvidenceMatrix({ section, groups, exams, dimension, inspect }: {
  section: "english" | "math";
  groups: ReturnType<typeof detailedGroups>;
  exams: AnalyticsExam[];
  dimension: string;
  inspect: (rows: Evidence[]) => void;
}) {
  const headingId = useId();
  const subject = section === "english" ? "English" : "Math";
  const subjectGroups = groups.filter(group => group.rows[0]?.section === section);
  const recordKeys = new Set(subjectGroups.flatMap(group => group.rows.map(row => row.examKey)));
  const subjectExams = exams.filter(exam => recordKeys.has(exam.key));
  const scope = JSON.stringify([dimension, subjectGroups.map(group => group.key), subjectExams.map(exam => exam.key)]);
  const [pagination, setPagination] = useState({ scope, group: 0, record: 0 });
  const maxGroupPage = Math.max(0, Math.ceil(subjectGroups.length / 25) - 1);
  const maxRecordPage = Math.max(0, Math.ceil(subjectExams.length / 8) - 1);
  const groupPage = pagination.scope === scope ? Math.min(pagination.group, maxGroupPage) : 0;
  const recordPage = pagination.scope === scope ? Math.min(pagination.record, maxRecordPage) : 0;
  const visibleExams = subjectExams.slice(recordPage * 8, (recordPage + 1) * 8);
  const changePage = (group: number, record: number) => setPagination({ scope, group, record });
  const dimensionLabel = ({ skill: "Skill", subtopic: "Math subtopic", passage: "Passage / version", format: "Response format", source: "Evidence source" } as Record<string, string>)[dimension] ?? "Skill";

  return <section className="sa-panel sa-evidence-matrix" aria-labelledby={headingId}>
    <header>
      <h3 id={headingId}>{subject} · Assessment × skill evidence matrix</h3>
      {subjectExams.length > 0 && <div className="sa-matrix-pagination" aria-label={`${subject} assessment pages`}>
        <button disabled={recordPage === 0} onClick={() => changePage(groupPage, recordPage - 1)} type="button" aria-label={`${subject}: earlier records`}>Earlier records</button>
        <span>Records {recordPage * 8 + 1}–{Math.min((recordPage + 1) * 8, subjectExams.length)} of {subjectExams.length}</span>
        <button disabled={recordPage === maxRecordPage} onClick={() => changePage(groupPage, recordPage + 1)} type="button" aria-label={`${subject}: later records`}>Later records</button>
      </div>}
    </header>
    {subjectGroups.length && subjectExams.length ? <>
      <div className="sa-table-scroll" role="region" aria-label={`${subject} evidence table`} tabIndex={0}>
        <table aria-labelledby={headingId}>
          <thead><tr><th scope="col">{dimensionLabel}</th>{visibleExams.map(exam => <th scope="col" key={exam.key}>{exam.title}<small>{analysisDay(exam.date) || "Date unavailable"} · {exam.scope}</small></th>)}</tr></thead>
          <tbody>{subjectGroups.slice(groupPage * 25, (groupPage + 1) * 25).map(group => <tr key={group.key}>
            <th scope="row">{group.label}<small>{group.kind}</small></th>
            {visibleExams.map(exam => {
              const matched = group.rows.filter(row => row.examKey === exam.key);
              const summary = evidenceSummary(matched);
              return <td key={exam.key}>{matched.length ? <button
                className={`sa-heat-cell ${summary.accuracy! < 50 ? "is-low" : summary.accuracy! < 80 ? "is-mid" : "is-high"}`}
                aria-label={`${group.label}, ${group.kind}, ${exam.title}, ${analysisDay(exam.date) || "date unavailable"}: ${summary.accuracy}% correct, ${summary.correct} of ${summary.total} responses. View responses`}
                onClick={() => inspect(matched)} type="button"
              >{summary.accuracy}%<small>{summary.correct}/{summary.total}</small></button> : <span title="No response evidence for this group">—</span>}</td>;
            })}
          </tr>)}</tbody>
        </table>
      </div>
      <p>Each cell opens its exact {subject} responses. Different tests and question samples are descriptive comparisons, not equal-difficulty measurements.</p>
      <footer><span>{subjectGroups.length} groups · Page {groupPage + 1}/{maxGroupPage + 1}</span><div className="sa-matrix-pagination">
        <button disabled={groupPage === 0} onClick={() => changePage(groupPage - 1, recordPage)} type="button" aria-label={`${subject}: previous groups`}>Previous groups</button>
        <button disabled={groupPage === maxGroupPage} onClick={() => changePage(groupPage + 1, recordPage)} type="button" aria-label={`${subject}: next groups`}>Next groups</button>
      </div></footer>
    </> : <p>No verified {subject} responses match this breakdown and the current filters. Adjust the subject, skill, or passage filters above.</p>}
  </section>;
}
