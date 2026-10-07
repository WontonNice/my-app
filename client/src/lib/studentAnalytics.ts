import type { ExamContent } from "../content/exams";
import type { ExamPassageResult, ExamSubjectResult, ExamResult } from "./examResults";
import { reviewQuestions, type ReviewQuestion } from "../../../server/src/shared/examCorrections";
import { passageCategory, passageCategoryLabel, type PassageCategory } from "../../../server/src/shared/passageCategories";

export type AnalyticsInput = {
  result: Record<string, unknown>;
  content?: ExamContent;
  subjects: ExamSubjectResult[];
  passages: ExamPassageResult[];
};
export type Evidence = ReviewQuestion & {
  key: string;
  examKey: string;
  examTitle: string;
  date: string | null;
  source: "Paper" | "Digital";
  status: "Correct" | "Incorrect" | "Unanswered";
  seconds?: number;
};
export type AnalyticsExam = AnalyticsInput & {
  key: string;
  title: string;
  date: string | null;
  source: "Paper" | "Digital";
  complete: boolean;
  overall: number | null;
  english: number | null;
  math: number | null;
  correct: number | null;
  total: number | null;
  comparableKey: string;
  evidence: Evidence[];
};
export type SkillMetric = {
  key: string;
  label: string;
  section: string;
  correct: number;
  total: number;
  incorrect: number | null;
  unanswered: number | null;
  recent: number | null;
  change: number | null;
  history: { examKey: string; title: string; date: string | null; correct: number; total: number }[];
  evidence: Evidence[];
};

export const percentage = (correct: number, total: number) => total > 0 ? Math.round(100 * correct / total) : null;
const number = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : null;
export function responseIsBlank(answer: unknown): boolean {
  if (answer === undefined || answer === null) return true;
  if (typeof answer === "string") return !answer.trim();
  if (Array.isArray(answer)) return !answer.length || answer.every(responseIsBlank);
  if (typeof answer === "object") return !Object.keys(answer).length || Object.values(answer).every(responseIsBlank);
  return false;
}
export function mean(values: (number | null)[]) {
  const measured = values.filter((value): value is number => value !== null);
  return measured.length ? Math.round(measured.reduce((sum, value) => sum + value, 0) / measured.length) : null;
}

export type ResponseDimension = "passage" | "category" | "type" | "skill";
export type ResponseGroup = { key: string; label: string; category?: PassageCategory; subject: string; correct: number; total: number; incorrect: number; unanswered: number; assessments: Set<string>; lastAttempt: string | null };
export type ResponseSort = "title" | "category" | "accuracy" | "correct" | "total" | "incorrect" | "unanswered" | "assessments" | "lastAttempt";
export function sortResponseGroups(groups: ResponseGroup[], sort: ResponseSort, direction: "asc" | "desc") {
  const value = (group: ResponseGroup): number | string | null => sort === "title" ? group.label : sort === "category" ? passageCategoryLabel(group.category) : sort === "accuracy" ? group.correct / group.total : sort === "assessments" ? group.assessments.size : sort === "lastAttempt" ? group.lastAttempt ? Date.parse(group.lastAttempt) : null : group[sort];
  return [...groups].sort((a, b) => {
    const left = value(a), right = value(b);
    // Missing dates always come last, never masquerade as the oldest attempt.
    if (left === null || right === null) return left === right ? a.key.localeCompare(b.key) : left === null ? 1 : -1;
    const comparison = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
    return comparison * (direction === "asc" ? 1 : -1) || a.label.localeCompare(b.label) || a.key.localeCompare(b.key);
  });
}

/** Aggregates only verifiable responses, never summary-only paper totals. */
export function groupResponseEvidence(evidence: Evidence[], dimension: ResponseDimension) {
  const groups = new Map<string, ResponseGroup>();
  for (const row of evidence) {
    const category = row.passage ? passageCategory(row.passage.passageCategory) : undefined;
    const key = dimension === "type" ? row.question.type : dimension === "skill" ? `${row.section}:${row.question.topic}` : dimension === "category" ? category ?? "" : row.passage?.id ?? "";
    if (!key) continue;
    const group = groups.get(key) ?? { key, label: dimension === "type" ? row.question.type.replace(/_/g, " ") : dimension === "skill" ? row.question.topic : dimension === "category" ? passageCategoryLabel(category) : row.passage!.title, category: dimension === "category" || dimension === "passage" ? category : undefined, subject: row.section === "english" ? "English" : "Math", correct: 0, total: 0, incorrect: 0, unanswered: 0, assessments: new Set<string>(), lastAttempt: null };
    if (group.subject !== (row.section === "english" ? "English" : "Math")) group.subject = "English + Math";
    group.total++;
    group.correct += row.status === "Correct" ? 1 : 0;
    group.incorrect += row.status === "Incorrect" ? 1 : 0;
    group.unanswered += row.status === "Unanswered" ? 1 : 0;
    group.assessments.add(row.examKey);
    if (row.date && (!group.lastAttempt || Date.parse(row.date) > Date.parse(group.lastAttempt))) group.lastAttempt = row.date;
    groups.set(key, group);
  }
  return sortResponseGroups([...groups.values()], "accuracy", "asc");
}

export function buildStudentAnalytics(inputs: AnalyticsInput[]) {
  const exams: AnalyticsExam[] = inputs.map((input, index) => {
    const { result, content, subjects } = input;
    const date = typeof result.completedAt === "string" && Number.isFinite(Date.parse(result.completedAt)) ? result.completedAt : null;
    const key = `${String(result.assessmentId ?? "exam")}:${date ?? "undated"}:${index}`;
    const title = String(result.title ?? content?.title ?? "Assessment");
    const source = result.source === "manual" ? "Paper" as const : "Digital" as const;
    const complete = result.completionStatus !== "english_complete" && result.completionStatus !== "math_complete"
      && (!Array.isArray(result.completedSections) || (result.completedSections.includes("english") && result.completedSections.includes("math")));
    const english = subjects.find(item => item.subject === "English Language Arts" && item.total > 0);
    const math = subjects.find(item => item.subject === "Mathematics" && item.total > 0);
    const answersAvailable = result.answers && typeof result.answers === "object" && !Array.isArray(result.answers)
      && (source === "Digital" || Object.keys(result.answers).length > 0);
    const candidates = content && answersAvailable ? reviewQuestions(content, result as unknown as ExamResult) : [];
    const sectionCounts = candidates.reduce((counts, row) => { counts[row.section]++; return counts; }, { english: 0, math: 0 });
    const evidence: Evidence[] = candidates.filter(item => {
      const storedSection = item.section === "english" ? english : math;
      const sectionCount = sectionCounts[item.section];
      const matchedTotals = storedSection ? storedSection.total === sectionCount : number(result.total) === candidates.length;
      // An edited/deleted exam cannot manufacture blanks for questions whose
      // membership in the original attempt is no longer verifiable.
      return matchedTotals || Object.hasOwn(result.answers as object, item.question.id);
    }).map(item => ({
      ...item, key: `${key}:${item.question.id}`, examKey: key, examTitle: title, date, source,
      status: responseIsBlank(item.submittedAnswer) ? "Unanswered" : item.isCorrect ? "Correct" : "Incorrect",
      seconds: result.questionTimes && typeof result.questionTimes === "object"
        ? number((result.questionTimes as Record<string, unknown>)[item.question.id]) ?? undefined : undefined,
    }));
    const total = number(result.total);
    const correct = number(result.correct);
    return { ...input, key, title, date, source, complete,
      overall: complete ? number(result.percentage) ?? (correct !== null && total !== null ? percentage(correct, total) : null) : null,
      english: english ? percentage(english.correct, english.total) : null,
      math: math ? percentage(math.correct, math.total) : null, correct, total,
      comparableKey: `${total ?? "unknown"}:${english?.total ?? "unknown"}:${math?.total ?? "unknown"}`,
      evidence,
    };
  }).sort((a, b) => (a.date ? Date.parse(a.date) : Infinity) - (b.date ? Date.parse(b.date) : Infinity));
  const skills = new Map<string, SkillMetric>();
  for (const exam of exams) {
    const grouped = new Map<string, { label: string; section: string; correct: number; total: number; evidence: Evidence[] }>();
    for (const row of exam.evidence) {
      const label = row.question.topic;
      const key = `${row.section}:${label}`;
      const group = grouped.get(key) ?? { label, section: row.section, correct: 0, total: 0, evidence: [] };
      group.correct += row.isCorrect ? 1 : 0;
      group.total++;
      group.evidence.push(row);
      grouped.set(key, group);
    }
    if (!exam.evidence.length) {
      const topics = exam.subjects.flatMap(subject => subject.topics.map(topic => ({ ...topic, section: subject.subject === "Mathematics" ? "math" : "english" })));
      const fallback = Array.isArray(exam.result.topics) ? exam.result.topics as { topic: string; correct: number; total: number }[] : [];
      for (const topic of topics.length ? topics : fallback.map(item => ({ ...item, section: "unspecified" }))) {
        if (!topic || typeof topic.topic !== "string" || !Number.isFinite(topic.correct) || !(topic.total > 0)) continue;
        grouped.set(`${topic.section}:${topic.topic}`, { label: topic.topic, section: topic.section, correct: topic.correct, total: topic.total, evidence: [] });
      }
    }
    for (const [key, group] of grouped) {
      const skill = skills.get(key) ?? { key, label: group.label, section: group.section, correct: 0, total: 0, incorrect: 0, unanswered: 0, recent: null, change: null, history: [], evidence: [] };
      skill.correct += group.correct;
      skill.total += group.total;
      if (group.evidence.length) {
        if (skill.incorrect !== null) skill.incorrect += group.evidence.filter(row => row.status === "Incorrect").length;
        if (skill.unanswered !== null) skill.unanswered += group.evidence.filter(row => row.status === "Unanswered").length;
      } else { skill.incorrect = null; skill.unanswered = null; }
      skill.history.push({ examKey: exam.key, title: exam.title, date: exam.date, correct: group.correct, total: group.total });
      skill.evidence.push(...group.evidence);
      skills.set(key, skill);
    }
  }
  for (const skill of skills.values()) {
    const dated = skill.history.filter(item => item.date);
    // Disjoint windows: last three tested assessments vs preceding three. A single
    // assessment never creates a trend; small question samples remain marked limited.
    const recent = dated.slice(-3);
    const previous = dated.slice(-6, -3);
    const accuracy = (items: typeof recent) => percentage(items.reduce((sum, item) => sum + item.correct, 0), items.reduce((sum, item) => sum + item.total, 0));
    skill.recent = accuracy(recent);
    const prior = accuracy(previous);
    skill.change = prior !== null && skill.recent !== null ? skill.recent - prior : null;
  }
  return { exams, skills: [...skills.values()], evidence: exams.flatMap(exam => exam.evidence) };
}

export function scoresAreComparable(a: AnalyticsExam, b: AnalyticsExam, metric: "overall" | "english" | "math") {
  if (metric === "overall") return a.total !== null && a.total > 0 && a.comparableKey === b.comparableKey;
  const section = metric === "english" ? "English Language Arts" : "Mathematics";
  const totalA = a.subjects.find(item => item.subject === section)?.total;
  const totalB = b.subjects.find(item => item.subject === section)?.total;
  return totalA !== undefined && totalA > 0 && totalA === totalB;
}

export function progression(exams: AnalyticsExam[], metric: "overall" | "english" | "math") {
  const measured = exams.filter(exam => exam.date && exam[metric] !== null);
  const latest = measured.at(-1);
  const compatible = latest ? measured.filter(exam => scoresAreComparable(exam, latest, metric)) : [];
  const first = compatible[0];
  const recent = mean(compatible.slice(-3).map(exam => exam[metric]));
  const previous = mean(compatible.slice(-6, -3).map(exam => exam[metric]));
  return { first, latest, compatible, recent, previous,
    change: compatible.length > 1 && first && latest ? latest[metric]! - first[metric]! : null,
    recentChange: compatible.length >= 6 && recent !== null && previous !== null ? recent - previous : null };
}
