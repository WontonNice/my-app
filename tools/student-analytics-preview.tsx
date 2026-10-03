// Isolated visual QA only. Fictional records never enter application storage.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { StudentDetail } from "../client/src/pages/TeacherDashboardPage";
import { resolveExamContent } from "../client/src/content/exams";
import { createExamResult, getAllExamQuestions } from "../client/src/lib/examResults";
import type { TeacherAssessment, StudentProgressSnapshot } from "../client/src/lib/api";
import assessmentData from "../server/data/assessments.json";
import "../client/src/styles/global.css";

const assessments = assessmentData as unknown as TeacherAssessment[];
const assessment = assessments.find(item => item.id === "2020-2021-form-b") ?? assessments[0];
const content = resolveExamContent(assessment);
const questions = getAllExamQuestions(content);
function correctAnswer(question: typeof questions[number]) {
  if (question.correctChoiceId) return question.correctChoiceId;
  if (question.correctChoiceIds) return question.correctChoiceIds;
  if (question.correctTextAnswers) return question.correctTextAnswers[0];
  return "";
}
const results = Array.from({ length: 6 }, (_, index) => {
  const answers = Object.fromEntries(questions.filter((_, i) => i % 9 !== 0).map((q, i) => [q.id, i % 10 < 4 + index ? correctAnswer(q) : q.choices?.find(c => c.id !== q.correctChoiceId)?.id ?? "4"]));
  return { ...createExamResult(content, answers), completedAt: `2026-09-${String(1 + index * 4).padStart(2, "0")}T12:00:00Z`, title: `QA Practice ${index + 1}`, source: index % 2 === 0 ? "manual" : "digital" };
});
const paper = { ...results[0], assessmentId: "manual-fixture", title: "QA Paper totals only", answers: {}, topics: [], questionTypes: [], source: "manual" };
function Preview() {
  const [mode, setMode] = useState("Mixed");
  const chosen = mode === "Zero" ? [] : mode === "One" ? results.slice(0, 1) : mode === "Two" ? results.slice(0, 2) : mode === "Paper only" ? [paper] : mode === "Digital only" ? results.map(result => ({ ...result, source: "digital" })) : mode === "Missing Math" || mode === "Missing English" ? results.map(result => ({ ...result, completionStatus: mode === "Missing Math" ? "english_complete" : "math_complete", completedSections: [mode === "Missing Math" ? "english" : "math"], subjects: result.subjects.filter(subject => subject.subject === (mode === "Missing Math" ? "English Language Arts" : "Mathematics")) })) : [...results, paper];
  const student = { id: "qa-student", fullName: "Preview student", email: "preview@example.test", username: "preview", lastLoginAt: "2026-09-22T12:00:00Z", classes: ["shsat"], insights: { practiceAccuracy: null }, progress: { examResults: chosen, practice: {} }, examSessions: {} } as unknown as StudentProgressSnapshot;
  return <div className="corporate-dashboard-content" style={{ padding: "16px", maxWidth: "1440px", margin: "auto" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "12px" }}><strong>Isolated QA · fictional records, actual exam content</strong><label>Student state <select value={mode} onChange={event => setMode(event.target.value)}>{["Mixed", "Zero", "One", "Two", "Paper only", "Digital only", "Missing Math", "Missing English"].map(value => <option key={value}>{value}</option>)}</select></label></div><section className="teacher-panel sa-selected-workspace"><StudentDetail key={mode} assessments={assessments} student={student} onAddPaperScore={async () => { /* QA only: no persistence */ }} /></section></div>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
