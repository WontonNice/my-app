import { useMemo } from "react";
import { TeacherLearningPlan, type PlanView } from "../client/src/components/TeacherLearningPlan";
import { planSummary, type PlanClient, type PassageRelation } from "../client/src/lib/learningPlan";
// Isolated visual QA only. Fictional records never enter application storage.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { StudentDetail } from "../client/src/pages/TeacherDashboardPage";
import { resolveExamContent } from "../client/src/content/exams";
import { createExamResult, getAllExamQuestions } from "../client/src/lib/examResults";
import type { TeacherAssessment, StudentProgressSnapshot } from "../client/src/lib/api";
import assessmentData from "../server/data/assessments.json";
import "../client/src/styles/global.css";
import { StudentAnalyticsWorkstation } from "../client/src/components/StudentAnalyticsWorkstation";
import { StudentProgressRoster } from "../client/src/components/StudentProgressRoster";
import type { ContentInventory } from "../client/src/lib/passageOrganization";

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
// Demonstration categories are confined to cloned QA content, never authored data.
const categorizedContent = { ...content, passageSets: content.passageSets.map((set, index) => ({ ...set, passage: { ...set.passage, passageCategory: index % 3 === 0 ? "official_handbook" as const : index % 3 === 1 ? "prestige" as const : "miscellaneous" as const } })) };
const passageInventory: ContentInventory = [
  ["The Lighthouse", "2020-2021 Form B", "Never assigned", false],
  ["The Lighthouse", "2024-2025 Form A", "Assigned", true],
  ["A Walk Through the Wetlands", "Practice collection", "In progress", false],
  ["The Invention of Paper", "Practice collection", "Planned", false],
  ["An Afternoon at the Observatory", "2020-2021 Form B", "Completed", true],
].map(([title, versionLabel, status, hasCompleted], index) => ({
  content: { id: `qa-passage-${index}`, kind: "passage", title: String(title), versionLabel: String(versionLabel), subject: "English", passageCategory: index%2?"prestige":"official_handbook", contentSource: "QA source", skills: [], aliases: [`qa-passage-${index}`], questionCount: 5, category: "Nonfiction", href: "#", passageTextKey: index < 2 ? "lighthouse-original" : `text-${index}`, relationshipCandidateKey: index < 3 ? "lighthouse" : `candidate-${index}`, questionSetKey: `questions-${index}` },
  latestScore:hasCompleted?{correct:index===1?2:4,total:5,at:index===1?"2026-09-10":"2026-10-10"}:null,
  status: status as ContentInventory[number]["status"], hasCompleted: Boolean(hasCompleted), lastCompletedAt: hasCompleted ? "2026-10-10T15:00:00Z" : null, priorCount: hasCompleted ? 1 : 0, lastActivity: null, dueDate: null, plannedDate: null, assignmentCount: status === "Never assigned" ? 0 : 1,
}));
function CategoryPreview() {
  const [relationships, setRelationships] = useState<PassageRelation[]>([]), [planning, setPlanning] = useState<PlanView | null>(null), [selectedContent, setSelectedContent] = useState(""), [skill, setSkill] = useState(""), [notice,setNotice] = useState("");
  const [partial,setPartial] = useState(false), [targetSubject, setTargetSubject] = useState(""), [targetCategory,setTargetCategory] = useState("");
  const plan = useMemo(() => ({ summary: planSummary([]), schedule: [], catalog: passageInventory.map(row => row.content), inventory: passageInventory, passageRelations: relationships }), [relationships]);
  const client = useMemo<PlanClient>(() => ({ overview: async () => plan, list: async () => ({ assignments: [], total: 0, page: 0 }), create: async () => { setNotice("QA assignment saved in memory only."); }, update: async () => {}, settings: async () => {}, detail: async () => { throw new Error("No fixture assignment"); }, history: async () => ({assignments:[],total:0,page:0,prior:[]}) }), [plan]);
  const matrixResults = Array.from({ length: 10 }, (_, index) => ({ ...results[index % results.length], completedAt: `2026-09-${String(1 + index * 2).padStart(2, "0")}T12:00:00Z`, title: `QA Practice ${index + 1}` }));
  return <main className="teacher-panel" style={{ padding: 20, maxWidth: 1440, margin: "auto" }}><p>Isolated QA · fictional student responses · no production writes</p><label><input type="checkbox" checked={partial} onChange={event => setPartial(event.target.checked)} /> Simulate unavailable history</label>{notice && <p role="status">{notice}</p>}{planning ? <><button type="button" onClick={() => setPlanning(null)}>Back to student overview</button><TeacherLearningPlan accessToken="" studentId="qa-student" studentName="Jordan Example" client={client} view={planning} onView={setPlanning} skillFilter={skill} onSkillFilter={setSkill} assignmentContentId={selectedContent} targetSubject={targetSubject} targetCategory={targetCategory} /></> : <StudentAnalyticsWorkstation studentName="Jordan Example" plan={plan} onOpenPlan={() => setPlanning("plan")} evidenceState={partial ? "partial" : "complete"} evidenceMessage={partial ? "Library history unavailable. Loaded exam evidence remains available." : ""} onRetryEvidence={() => setPartial(false)} pending={[{title:"QA Session 11",detail:"English submitted · Math not submitted",at:"2026-11-02T15:00:00Z"}]} canEditQuestions initialAssessmentId={new URLSearchParams(location.search).get("exam")??undefined} passageInventory={passageInventory.map(row => ({...row,historyComplete:!partial,evidence:row.hasCompleted?[{contentId:row.content.id,source:"Existing exam passage result",assessmentId:content.assessmentId,at:matrixResults[0].completedAt,coverage:"recorded",correct:2,total:5}]:[]}))} onAssignContent={id => {setSelectedContent(id);setPlanning("content");}} onAssignMathSkill={value => {setSelectedContent("");setTargetSubject("Math");setTargetCategory(value);setSkill("");setPlanning("content");}} onAssignSkill={value => {setTargetSubject("");setSelectedContent("");setSkill(value);setPlanning("content");}} onRelatePassages={async relation => {setRelationships(current => [...current.filter(item => ![item.a,item.b].includes(relation.a) || ![item.a,item.b].includes(relation.b)), {...relation, revision:(relation.revision??0)+1,updatedAt:new Date().toISOString()}]);}} loadPassagePreview={async id => ({title:id,text:"Fictional source text for comparison. " + (id.endsWith("2") ? "This is a revised passage with different details." : "The lighthouse was visible from the harbor.")})} preferenceKey="qa-subject-matrices" inputs={matrixResults.map(result => ({ result, content: categorizedContent, subjects: result.subjects, passages: result.passages }))} answerLabel={(_question, answer) => answer === undefined ? "Unanswered" : JSON.stringify(answer)} correctLabel={question => question.correctChoiceId ?? JSON.stringify(question.correctChoiceIds ?? question.correctTextAnswers)} renderExam={exam => <p>{exam.title}</p>} />}</main>;
}
function Preview() {
  const [mode, setMode] = useState("Mixed");
  const chosen = mode === "Zero" ? [] : mode === "One" ? results.slice(0, 1) : mode === "Two" ? results.slice(0, 2) : mode === "Paper only" ? [paper] : mode === "Digital only" ? results.map(result => ({ ...result, source: "digital" })) : mode === "Missing Math" || mode === "Missing English" ? results.map(result => ({ ...result, completionStatus: mode === "Missing Math" ? "english_complete" : "math_complete", completedSections: [mode === "Missing Math" ? "english" : "math"], subjects: result.subjects.filter(subject => subject.subject === (mode === "Missing Math" ? "English Language Arts" : "Mathematics")) })) : [...results, paper];
  const student = { id: "qa-student", fullName: "Preview student", email: "preview@example.test", username: "preview", lastLoginAt: "2026-09-22T12:00:00Z", classes: ["shsat"], insights: { practiceAccuracy: null }, progress: { examResults: chosen, practice: {} }, examSessions: {} } as unknown as StudentProgressSnapshot;
  return <div className="corporate-dashboard-content" style={{ padding: "16px", maxWidth: "1440px", margin: "auto" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "12px" }}><strong>Isolated QA · fictional records, actual exam content</strong><label>Student state <select value={mode} onChange={event => setMode(event.target.value)}>{["Mixed", "Zero", "One", "Two", "Paper only", "Digital only", "Missing Math", "Missing English"].map(value => <option key={value}>{value}</option>)}</select></label></div><section className="teacher-panel sa-selected-workspace"><StudentDetail key={mode} assessments={assessments} student={student} onAddPaperScore={async () => { /* QA only: no persistence */ }} /></section></div>;
}
function RosterPreview() {
  const [selected,setSelected]=useState("");
  const math={...createExamResult(content,Object.fromEntries(questions.map(q=>[q.id,correctAnswer(q)])),["math"]),completedAt:"2026-10-02T12:00:00Z"};
  const students=[{id:"qa-1",fullName:"Alex Example",username:"alex",progress:{examResults:[...results,math]}},{id:"qa-2",fullName:"Jordan Example",username:"jordan",progress:{examResults:[]}},{id:"qa-3",fullName:"Taylor Example",username:"taylor",progress:{examResults:[paper]}}].map(student=>({...student,email:`${student.username}@example.test`,lastLoginAt:"2026-10-03T12:00:00Z",examSessions:{},classes:["shsat"],insights:{},progress:{...student.progress,practice:{}}}))as unknown as StudentProgressSnapshot[];
  return <main style={{padding:20,maxWidth:1440,margin:"auto"}}><section className="teacher-panel"><h1>Student progress · fictional QA roster</h1><StudentProgressRoster students={students} inputsFor={student=>(student.progress.examResults??[]).map(result=>({result,content,subjects:result.subjects as typeof results[number]["subjects"]??[],passages:result.passages as typeof results[number]["passages"]??[]}))} onSelect={setSelected}/>{selected&&<p role="status">Selected {students.find(student=>student.id===selected)?.fullName}</p>}</section></main>;
}
createRoot(document.getElementById("root")!).render(window.location.pathname === "/roster" ? <RosterPreview /> : window.location.pathname === "/categories" ? <CategoryPreview /> : <Preview />);
