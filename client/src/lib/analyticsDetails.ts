import { submittedExamSections } from "../../../server/src/shared/examCompletion";
import { buildStudentAnalytics, percentage, type AnalyticsInput, type Evidence } from "./studentAnalytics";

export type AnalysisFilters = { source: string; kind: string; from: string; to: string; section: string; basis: string };
export const defaultAnalysisFilters: AnalysisFilters = { source: "All", kind: "all", from: "", to: "", section: "", basis: "all" };
export function analysisDay(value: string | null | undefined) {
  if (!value || !Number.isFinite(Date.parse(value))) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}
export function inDateWindow(date: string | null | undefined, from: string, to: string) {
  const day = analysisDay(date);
  return !from && !to || Boolean(day && (!from || day >= from) && (!to || day <= to));
}
export function filterAnalysisInputs(inputs: AnalyticsInput[], filter: AnalysisFilters) {
  return inputs.flatMap(input => {
    const source = input.sourceLabel ?? (input.result.source === "manual" ? "Paper" : input.result.source === "answer_sheet" ? "Answer sheet" : "Digital");
    if (filter.source !== "All" && source !== filter.source || filter.kind !== "all" && (input.kind ?? "exam") !== filter.kind) return [];
    const submitted = submittedExamSections(input.result);
    // Legacy summary records can have a score without verifiable subject scope.
    // Keep that history visible without guessing an English/Math denominator.
    if (!submitted.length) return !filter.section && inDateWindow(input.result.completedAt as string, filter.from, filter.to) ? [input] : [];
    const sections = submitted.filter(section => (!filter.section || section === filter.section) && inDateWindow((input.result.sectionCompletedAt as Record<string,string> | undefined)?.[section] ?? input.result.completedAt as string, filter.from, filter.to));
    if (!sections.length) return [];
    const subjects = input.subjects.filter(subject => sections.includes(subject.subject === "Mathematics" ? "math" : "english"));
    const narrowed = sections.length !== submitted.length;
    return [{ ...input, subjects, result: { ...input.result, completedSections: sections, ...(narrowed ? { correct: subjects.length ? subjects.reduce((sum,subject)=>sum+subject.correct,0) : undefined, total: subjects.length ? subjects.reduce((sum,subject)=>sum+subject.total,0) : undefined, percentage: undefined, topics: undefined, questionTypes: undefined } : {}) } }];
  });
}
export function attemptEvidence(rows: Evidence[], basis: string): Evidence[] {
  if (basis === "all") return rows;
  const groups = new Map<string, Evidence[]>();
  for (const row of rows) { const group = groups.get(row.identity) ?? []; group.push(row); groups.set(row.identity, group); }
  return [...groups.values()].flatMap(group => {
    const dated = group.filter(row => row.date).sort((a,b) => Date.parse(a.date!) - Date.parse(b.date!) || a.attempt.localeCompare(b.attempt));
    if (basis === "repeats") return dated.slice(1);
    return dated.length ? [basis === "first" ? dated[0] : dated[dated.length - 1]] : [];
  });
}
export function evidenceSummary(rows: Evidence[]) {
  const correct = rows.filter(row => row.status === "Correct").length, incorrect = rows.filter(row => row.status === "Incorrect").length, unanswered = rows.filter(row => row.status === "Unanswered").length;
  const times = rows.flatMap(row => row.seconds !== undefined && row.seconds > 0 ? [row.seconds] : []).sort((a,b) => a-b);
  const median = times.length ? times.length % 2 ? times[Math.floor(times.length/2)] : (times[times.length/2-1]+times[times.length/2])/2 : null;
  const dates = rows.flatMap(row => row.date ? [row.date] : []).sort((a,b) => Date.parse(a)-Date.parse(b));
  return { correct, incorrect, unanswered, total: rows.length, accuracy: percentage(correct,rows.length), attemptedAccuracy: percentage(correct,correct+incorrect), unique: new Set(rows.map(row => row.identity)).size, assessments: new Set(rows.map(row => row.examKey)).size, timed: times.length, median, first: dates[0] ?? null, last: dates.at(-1) ?? null, averageSeconds: times.length ? times.reduce((a,b)=>a+b,0)/times.length : null };
}
export function detailedGroups(rows: Evidence[], dimension: string) {
  const groups = new Map<string, { key: string; label: string; kind: string; rows: Evidence[] }>();
  for (const row of rows) {
    const detail = dimension === "subtopic" ? row.section === "math" ? `${row.question.topic} › ${row.question.subtopic || "Unclassified"}` : "" : dimension === "passage" ? row.passage ? `${row.passage.title}${row.passage.versionLabel ? ` · ${row.passage.versionLabel}` : ""}` : "" : dimension === "format" ? row.question.type.replaceAll("_"," ") : dimension === "source" ? row.source : row.question.topic;
    if (!detail) continue;
    const key = JSON.stringify([row.kind,row.section,dimension === "passage" ? row.passage?.id : detail]);
    const group = groups.get(key) ?? { key, label: `${row.section === "math" ? "Math" : "English"} · ${detail}`, kind: row.kind, rows: [] };
    group.rows.push(row); groups.set(key,group);
  }
  return [...groups.values()].map(group=>({...group,...evidenceSummary(group.rows)}));
}
export function rosterAnalysis(inputs: AnalyticsInput[]) {
  const data = buildStudentAnalytics(inputs);
  const full = data.exams.filter(exam=>exam.complete&&exam.overall!==null);
  const latest = (section:"english"|"math") => data.exams.filter(exam=>exam[section]!==null).sort((a,b)=>Date.parse(String((b.result.sectionCompletedAt as Record<string,string>|undefined)?.[section]??b.date??""))-Date.parse(String((a.result.sectionCompletedAt as Record<string,string>|undefined)?.[section]??a.date??"")))[0];
  const dates=data.exams.flatMap(exam=>exam.date?[exam.date]:[]).sort((a,b)=>Date.parse(b)-Date.parse(a));
  return { data, full, english:latest("english"), math:latest("math"), average:full.length?Math.round(full.reduce((sum,exam)=>sum+exam.overall!,0)/full.length):null, last:dates[0]??null, evidence:data.evidence.length, total:data.exams.reduce((sum,exam)=>sum+(exam.total??0),0) };
}
export function analyticsCsv(headers: string[], rows: unknown[][]): string {
  const cell=(value:unknown)=>{let text=value==null?"":typeof value==="object"?JSON.stringify(value):String(value);if(/^[=+\-@\t\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
  return [headers,...rows].map(row=>row.map(cell).join(",")).join("\r\n");
}
export function downloadAnalysis(name: string, headers: string[], rows: unknown[][]) {
  const url=URL.createObjectURL(new Blob(["\ufeff",analyticsCsv(headers,rows)],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
