// Isolated visual QA: renders the real components with sample data and an in-memory API.
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ExamCorrectionsPage } from "../client/src/pages/ExamCorrectionsPage";
import { TeacherExamTools } from "../client/src/components/TeacherExamTools";
import { cacheActiveSession } from "../client/src/lib/sessionCache";
import { createExamResult } from "../server/src/shared/examGrading";
import { reviewQuestions } from "../server/src/shared/examCorrections";
import "../client/src/styles/examCorrections.css";

const english = { id: 'ela-1', type: 'multiple_choice', topic: 'Inference', prompt: 'Which statement best explains why the narrator changes her mind?', choices: [{ id: 'A', text: 'She decides the trip is too difficult.' }, { id: 'B', text: 'She sees evidence that challenges her first impression.' }, { id: 'C', text: 'She wants to follow her friends.' }, { id: 'D', text: 'She forgets her original plan.' }], correctChoiceId: 'B' };
const math = { id: 'math-1', type: 'numeric_entry', topic: 'Algebra', prompt: 'Solve for x: \\(2x + 3 = 13\\)', correctTextAnswers: ['5'] };
const content = { assessmentId: 'test-exam', title: 'Fall Practice Test · Sample preview', passageSets: [{ id: 'passage-1', passage: { id: 'passage-1', title: 'A new perspective', lines: [{ text: 'At first, Maya thought the trail would be empty. Then she noticed small tracks in the mud and heard birds in the trees. She stopped to look more closely.' }] }, questions: [english, { ...english, id: 'ela-2', prompt: 'Which detail supports the narrator’s new perspective?' }] }], mathSection: { questions: [math] } };
const result = createExamResult(content as never, { 'ela-1': 'A', 'ela-2': 'B', 'math-1': '4' });
let submission = window.location.pathname.startsWith('/teacher') ? { assessmentId: 'test-exam', studentId: 'sample-student', resultVersion: 'sample-v1', submittedAt: new Date().toISOString(), questions: reviewQuestions(content as never, result), responses: [{ questionId: 'ela-1', whyChosenIncorrect: 'The passage never says the trip is difficult.', whyCorrectAnswerCorrect: 'The tracks and birds challenge her first impression.', understanding: 4 }, { questionId: 'math-1', whyChosenIncorrect: '', whyCorrectAnswerCorrect: 'Subtract 3, then divide by 2 to get x = 5.', understanding: 5 }] } : null;
const view = { result, questions: reviewQuestions(content as never, result), resultVersion: 'sample-v1', submission };
const assessment = { id: 'test-exam', title: content.title, classId: 'shsat', correctionsOpen: false, passages: [], questions: [english, math].map(q => ({ ...q, answer: q.correctChoiceId || '5', choices: q.choices?.map(c => c.text) ?? [], points: 1 })), forms: [], formAssignments: {} };
cacheActiveSession({ access_token: 'sample-session', user: { id: 'sample-student', email: 'sample@example.test', user_metadata: { full_name: 'Sample student' }, app_metadata: { role: 'student', class_ids: ['shsat'] } } } as never);
window.fetch = async (input, init) => {
  const url = String(input);
  const body = init?.body ? JSON.parse(String(init.body)) : {};
  if (url.includes('/access')) return Response.json({ assessment: { ...assessment, correctionsOpen: body.open } });
  if (url.includes('/submissions')) return Response.json({ submissions: submission ? [submission] : [] });
  if (url.includes('/answers/')) {
    const correct = Number(body.answers?.['ela-1'] === 'B') + Number(body.answers?.['math-1'] === '5');
    return Response.json({ result: { ...result, correct, total: 2, percentage: correct * 50 } }, { status: 201 });
  }
  if (init?.method === 'POST') {
    submission = { ...body, studentId: 'sample-student', assessmentId: 'test-exam', questions: view.questions, submittedAt: new Date().toISOString() };
    return Response.json({ submission }, { status: 201 });
  }
  return Response.json({ ...view, submission });
};
function TeacherPreview() {
  const [exam, setExam] = useState(assessment);
  return <main style={{ maxWidth: 1100, margin: '40px auto', padding: 24, fontFamily: 'system-ui', background: '#fff' }}><p>Isolated sample data · teacher controls</p><h1>{exam.title}</h1><TeacherExamTools assessment={exam as never} accessToken="sample" students={[{ id: 'sample-student', fullName: 'Sample student', classes: ['shsat'], progress: { examResults: [] } }] as never} onAssessmentChange={setExam as never} onResultSaved={() => undefined} /></main>;
}
createRoot(document.getElementById('root')!).render(window.location.pathname.startsWith('/teacher') ? <TeacherPreview /> : <ExamCorrectionsPage />);
