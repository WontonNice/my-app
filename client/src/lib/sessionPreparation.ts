import type { AnalyticsExam, SkillMetric } from "./studentAnalytics";
export const activityLabel = (kind?: string) => kind === "passage" ? "Passage practice" : kind === "practice" ? "Question practice" : "Exams & sections";
export const recordDate = (date: string | null) => date ? new Date(date).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "Date unavailable";
export function rawScore(exam: AnalyticsExam | undefined, metric: "overall" | "english" | "math") {
  if (!exam) return "—";
  if (exam.points?.pending) return "Pending";
  const score = metric === "overall" ? exam : exam.subjects.find(subject => subject.subject === (metric === "english" ? "English Language Arts" : "Mathematics"));
  return score && score.correct !== null && score.total ? `${score.correct}/${score.total}` : "—";
}
/** Fixed, inspectable rules, not a diagnosis: recent repeated low accuracy with unique evidence. */
export function reviewPriorities(skills: SkillMetric[], now = Date.now()) {
  return skills.filter(skill => skill.label.trim() && skill.label !== "Unclassified").map(skill => {
    const recent = skill.history.filter(item => item.date && now - Date.parse(item.date) <= 90 * 86400000 && Date.parse(item.date) <= now);
    const responses = skill.evidence.filter(row => row.date && now - Date.parse(row.date) <= 90 * 86400000 && Date.parse(row.date) <= now && row.status !== "Pending");
    const unique = new Set(responses.map(row => row.identity)).size;
    const total = recent.reduce((sum, item) => sum + item.total, 0), correct = recent.reduce((sum, item) => sum + item.correct, 0);
    const weak = recent.filter(item => item.correct / item.total < .7).length;
    return { skill, recent, unique, total, correct, weak, qualified: unique >= 5 && weak >= 2, score: total ? correct / total : 1 };
  }).filter(item => item.recent.length && item.score < .7).sort((a, b) => Number(b.qualified) - Number(a.qualified) || b.weak - a.weak || b.unique - a.unique || a.score - b.score || a.skill.key.localeCompare(b.skill.key)).slice(0, 3);
}

