import type { ExamQuestion } from "./examTypes";
import { canonicalElaTopic, labElaTopics } from "./questionBank";
export function correctionQuestionTypes(questions: ExamQuestion[], section: "english" | "math") {
  const base = section === "english" ? labElaTopics : ["Number & Operations", "Algebra", "Geometry", "Data Analysis & Probability"];
  return [...new Set([...base, ...questions.map(question => section === "english" ? canonicalElaTopic(question.topic) : question.topic).filter(Boolean)])];
}
