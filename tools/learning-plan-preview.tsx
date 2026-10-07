// Fictional state only. These UI test adapters never persist to application storage.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { TeacherLearningPlan, type PlanView } from "../client/src/components/TeacherLearningPlan";
import { StudentDetail } from "../client/src/pages/TeacherDashboardPage";
import type { StudentProgressSnapshot, TeacherAssessment } from "../client/src/lib/api";
import assessmentData from "../server/data/assessments.json";
import { StudentLearningPlan, type StudentPlanClient } from "../client/src/components/StudentLearningPlan";
import { inventory, planSummary, validateDraft, weekDays, type PlanAssignment, type PlanClient, type PlanSettings } from "../client/src/lib/learningPlan";
import type { PlanContent } from "../client/src/lib/learningPlan";
import catalogData from "../server/data/learning-catalog.json";
import "../client/src/styles/global.css";
// Illustrative source assignments exist only in this in-memory QA fixture.
const catalog = (catalogData as PlanContent[]).map((content, index) => ({ ...content, ...(content.kind === "passage" ? { passageCategory: index % 3 === 0 ? "official_handbook" as const : index % 3 === 1 ? "prestige" as const : "miscellaneous" as const } : {}) }));
let items: PlanAssignment[] = [];
let settings: PlanSettings = { studentId: "qa-student", passagePace: 3, targetDate: "2026-11-23", teacherNotes: "Teacher-only note", updatedAt: null, revision: 0 };
const overview = (student = false) => {
  const visible = student ? items.filter(item => item.assignedAt && item.status !== "planned") : items;
  return { catalog, summary: planSummary(visible), schedule: visible, ...(student ? {} : { settings, inventory: inventory(catalog, items, []).map(row => ({ content: row.content, status: row.status, hasBeenAssigned: row.hasBeenAssigned, hasCompleted: row.hasCompleted, lastActivity: row.lastActivity, dueDate: row.active?.dueDate ?? null, plannedDate: row.planned?.plannedDate ?? null, assignmentCount: row.history.length, priorCount: 0 })) }) };
};
function list(status: string, page: number, search = "", published = false) {
  let filtered = items.filter(item => !published || item.assignedAt && item.status !== "planned");
  if (status === "active") filtered = filtered.filter(item => ["assigned", "in_progress", "review"].includes(item.status));
  else if (status === "schedule") { const days = weekDays(undefined, page); filtered = filtered.filter(item => days.includes(item.status === "planned" ? item.plannedDate ?? "" : item.dueDate ?? "")); }
  else if (status === "week") filtered = filtered.filter(item => ["assigned", "in_progress", "review"].includes(item.status) && weekDays().includes(item.dueDate ?? ""));
  else if (status !== "all") filtered = filtered.filter(item => item.status === status);
  filtered = filtered.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
  return { assignments: status === "schedule" ? filtered : filtered.slice(page * 50, page * 50 + 50), total: filtered.length, page };
}
const client: PlanClient = {
  overview: async () => overview(), list: async (...args) => list(...args),
  create: async (drafts, _batch, allowRepeat) => {
    if (!allowRepeat && drafts.some(draft => draft.contentId && items.some(item => item.contentId === draft.contentId))) throw new Error("This student already received or has planned this content.");
    for (const draft of drafts) { const normalized = validateDraft(draft, catalog), now = new Date().toISOString(); items.push({ ...normalized, id: crypto.randomUUID(), studentId: "qa-student", status: normalized.status, assignedAt: normalized.status === "assigned" ? now : null, completedAt: null, practiceBaseline: null, createdAt: now, createdBy: "qa-teacher", updatedAt: now, revision: 1, completion: null, events: [{ at: now, actor: "qa-teacher", action: normalized.status, changes: normalized }] }); }
  },
  update: async (id, revision, changes) => { const old = items.find(item => item.id === id)!; if (old.revision !== revision) throw new Error("Reload this changed task."); const now = new Date().toISOString(); Object.assign(old, changes, { revision: revision + 1, updatedAt: now, events: [...old.events!, { at: now, actor: "qa-teacher", action: changes.status ?? "Edited", changes }] }); if (changes.status === "assigned" && !old.assignedAt) old.assignedAt = now; if (changes.status === "completed") { old.completedAt = now; old.completion = { source: "teacher", at: now }; } },
  settings: async value => { settings = { ...value, revision: value.revision + 1, updatedAt: new Date().toISOString() }; },
  detail: async id => structuredClone(items.find(item => item.id === id)!),
  history: async (_kind, id, page) => { const filtered = items.filter(item => item.contentId === id); return { assignments: filtered.slice(page * 50, page * 50 + 50), total: filtered.length, page, prior: [] }; },
};
const studentClient: StudentPlanClient = { overview: async () => overview(true), list: async (status, page) => list(status, page, "", true), update: async (item, action) => client.update(item.id, item.revision, { status: action === "start" ? "in_progress" : "review" }) };
function Preview() {
  const [view, setView] = useState<PlanView>("content"); const [skill, setSkill] = useState(""); const [student, setStudent] = useState(false);
  const [record, setRecord] = useState(false);
  const qaStudent = { id: "qa-student", fullName: "Preview Student", email: "preview@example.test", username: "preview", lastLoginAt: null, classes: ["shsat"], insights: { practiceAccuracy: null }, progress: { examResults: [], practice: {} }, examSessions: {} } as unknown as StudentProgressSnapshot;
  if (record) return <main className="corporate-dashboard-content" style={{ padding: 20, maxWidth: 1440, margin: "auto" }}><p>Isolated full-record QA · fictional student · no production writes</p><button onClick={() => setRecord(false)}>Return to standalone QA</button><section className="teacher-panel sa-selected-workspace"><StudentDetail accessToken="qa" planClient={client} student={qaStudent} assessments={assessmentData as unknown as TeacherAssessment[]} onAddPaperScore={async () => { /* Isolated QA only */ }} /></section></main>;
  return <main className="corporate-dashboard-content" style={{ padding: 20, maxWidth: 1440, margin: "auto" }}><p>Isolated QA · fictional student · no production writes</p><nav className="lp-record-tabs"><button onClick={() => setRecord(true)}>Full student record</button><button onClick={() => setStudent(value => !value)}>Switch to {student ? "teacher" : "student"}</button>{(["summary", "plan", "content", "schedule", "history"] as PlanView[]).map(value => <button key={value} onClick={() => { setStudent(false); setView(value); }}>{value}</button>)}</nav>
    {student ? <StudentLearningPlan accessToken="" previewContext={{ isPreview: false }} client={studentClient} /> : <TeacherLearningPlan accessToken="" studentId="qa-student" studentName="Preview Student" view={view} onView={setView} skillFilter={skill} onSkillFilter={setSkill} client={client} />}
  </main>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
