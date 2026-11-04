import type { ExamQuestion, ExamPassageSection } from "./examTypes";
import { canonicalElaTopic, labElaTopics } from "./questionBank";

/** Reading and editing are separate skills; math uses the live Study Hall taxonomy. */
export function correctionQuestionTypes(questions: ExamQuestion[], section: "english" | "math", passageSection: ExamPassageSection = "reading", taxonomy: { label: string; topics: string[] }[] = []) {
  if (section === "math") return [...new Set(taxonomy.length ? taxonomy.flatMap(category => [category.label, ...category.topics]) : questions.flatMap(question => [question.topic, question.subtopic ?? ""]).filter(Boolean))];
  const base = passageSection === "reading" ? labElaTopics.slice(0, 8) : labElaTopics.slice(8);
  return [...new Set([...base, ...questions.map(question => canonicalElaTopic(question.topic)).filter(topic => topic && !labElaTopics.includes(topic))])];
}
