// Fictional browser QA. Real components; auth and the remote API use sample data.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ExamCorrectionsPage } from "../client/src/pages/ExamCorrectionsPage";
import { TeacherCorrectionsPage } from "../client/src/pages/TeacherCorrectionsPage";
import { TeacherExamTools } from "../client/src/components/TeacherExamTools";
import { cacheActiveSession } from "../client/src/lib/sessionCache";
import { resolveExamContent } from "../client/src/content/exams";
import { createExamResult } from "../server/src/shared/examGrading";
import { reviewQuestions, type CorrectionSubmission } from "../server/src/shared/examCorrections";
import "../client/src/styles/global.css";
import "../client/src/styles/examCorrections.css";

const english = { id: "ela-1", type: "multiple_choice", topic: "Inference", prompt: "Which statement explains why the narrator changes her mind?", choices: [{ id: "A", text: "She decides the trip is too difficult." }, { id: "B", text: "She sees evidence that challenges her first impression." }, { id: "C", text: "She wants to follow her friends." }, { id: "D", text: "She forgets her original plan." }], correctChoiceId: "B" };
const math = { id: "math-1", type: "numeric_entry", topic: "Algebra", subtopic: "Equations & Systems", prompt: "Solve for x: \\(2x + 3 = 13\\)", correctTextAnswers: ["5"] };
const content = { assessmentId: "2025-2026-form-b", title: "Fall practice · Fictional QA", passageSets: [{ id: "passage-1", passage: { id: "passage-1", title: "A new perspective", lines: [{ text: "At first, Maya thought the trail would be empty. Then she noticed small tracks in the mud and heard birds in the trees. She stopped to look more closely." }] }, questions: [english, { ...english, id: "ela-2", prompt: "Which detail supports the narrator’s new perspective?" }] }], mathSection: { questions: Array.from({ length: 12 }, (_, index) => ({ ...math, id: `math-${index + 1}` })) } };
const result = createExamResult(content as never, { "ela-1": "A", "ela-2": "B", "math-1": "4" });
let submission: CorrectionSubmission = JSON.parse(sessionStorage.getItem("qa-correction-submission") || "null") || { assessmentId: content.assessmentId, studentId: "sample-student", resultVersion: "sample-v1", submittedAt: "2026-10-21T14:30:00Z", questions: reviewQuestions(content as never, result), responses: [{ questionId: "ela-1", questionType: "Inference", whyChosenIncorrect: "The passage never says the trip is difficult.", whyCorrectAnswerCorrect: "The tracks and birds challenge her first impression.", understanding: 4 }, { questionId: "math-1", questionType: "Algebra", whyChosenIncorrect: "", whyCorrectAnswerCorrect: "Subtract 3, then divide by 2. I need more practice explaining each step.", understanding: 2 }] };
const view = { result, questions: reviewQuestions(content as never, result), resultVersion: "sample-v1" };
const assessment = { id: content.assessmentId, title: content.title, classId: "shsat", correctionsOpen: true, sectionAccess: { english: true, math: true }, passages: [], questions: [], forms: [], formAssignments: {} };
const students = [{ id: "sample-student", fullName: "Maya Chen · QA", classes: ["shsat"], progress: { examResults: [] } }];
window.fetch = async (input, init) => {
  const url = String(input), body = init?.body ? JSON.parse(String(init.body)) : {};
  if (url.includes("/access")) return Response.json({ assessment: { ...assessment, correctionsOpen: body.open } });
  if (url.includes("/submissions")) return Response.json({ submissions: [submission] });
  if (url.includes("/api/assessments/teacher")) return Response.json({ assessments: [assessment] });
  if (url.includes("/api/progress/students")) return Response.json({ students });
  if (url.includes("/answers/")) return Response.json({ result: createExamResult(resolveExamContent(assessment as never), body.answers, body.completedSections) });
  if (init?.method === "POST") {
    const responses = new Map(submission.responses.map(item => [item.questionId, item]));
    body.responses.forEach((item: CorrectionSubmission["responses"][number]) => responses.set(item.questionId, item));
    submission = { ...submission, responses: [...responses.values()], submittedAt: new Date().toISOString() };
    sessionStorage.setItem("qa-correction-submission", JSON.stringify(submission));
    return Response.json({ submission }, { status: 201 });
  }
  return Response.json({ ...view, submission });
};
function TeacherPreview() {
  const [exam, setExam] = useState(assessment);
  return <main style={{ maxWidth: 1280, margin: "24px auto", padding: 24, fontFamily: "Arial", background: "#fff", color: "#193b49" }}><p>Isolated sample data · teacher controls</p><h1>{exam.title}</h1><TeacherExamTools assessment={exam as never} accessToken="sample" students={students as never} onAssessmentChange={setExam as never} onResultSaved={() => undefined} /></main>;
}
const root = createRoot(document.getElementById("root")!);
function render() {
  const teacher = location.pathname.startsWith("/teacher");
  cacheActiveSession({ access_token: "sample-session", user: { id: teacher ? "sample-teacher" : "sample-student", email: "qa@example.test", user_metadata: { full_name: teacher ? "Preview Teacher" : "Maya Chen · QA" }, app_metadata: { role: teacher ? "teacher" : "student", class_ids: ["shsat"] } } } as never);
  const Page = location.pathname.startsWith("/teacher/corrections/") ? TeacherCorrectionsPage : teacher ? TeacherPreview : ExamCorrectionsPage;
  root.render(<Page key={location.pathname + location.search} />);
}
window.addEventListener("popstate", render); render();
