// Browser QA only: synthetic bank is substituted by the preview server's in-memory build.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AdvancedPassagePage } from "../client/src/pages/AdvancedPassagePage";
import { TeacherLearningPlan } from "../client/src/components/TeacherLearningPlan";
import { questionBankCatalog } from "../client/src/content/questionBank";
import type { PlanClient, PlanOverview } from "../client/src/lib/learningPlan";
import { inventory, planSummary, validateDraft, type PlanAssignment } from "../server/src/shared/learningPlan";
import "../client/src/styles/global.css";
import "../client/src/styles/learning-plan.css";

const assignments: PlanAssignment[] = [];
const qaClient: PlanClient = {
  overview: async () => ({ catalog: questionBankCatalog, assignments, settings: { studentId: "qa-only", passagePace: null, targetDate: null, teacherNotes: "", updatedAt: null, revision: 0 }, summary: planSummary(assignments), inventory: inventory(questionBankCatalog, assignments, []).map(row => ({ ...row, dueDate: null, plannedDate: null, assignmentCount: row.history.length, priorCount: 0 })) } as PlanOverview),
  list: async (_status, page) => ({ assignments, total: assignments.length, page }),
  create: async drafts => { for (const draft of drafts) { const normalized = validateDraft(draft, questionBankCatalog); const at = new Date().toISOString(); assignments.push({ ...normalized, id: crypto.randomUUID(), studentId: "qa-only", assignedAt: normalized.status === "assigned" ? at : null, completedAt: null, practiceBaseline: null, createdAt: at, createdBy: "qa-only", updatedAt: at, revision: 1, completion: null }); } },
  update: async () => {}, settings: async () => {}, detail: async id => assignments.find(item => item.id === id)!,
  history: async (_kind, id, page) => ({ assignments: assignments.filter(item => item.contentId === id), prior: [], total: assignments.length, page }),
};
function Preview() {
  const [skill, setSkill] = useState("Evidence & Support");
  const [view, setView] = useState<"content" | "plan" | "history" | "summary" | "schedule">("content");
  if (new URLSearchParams(location.search).get("view") !== "teacher") return <AdvancedPassagePage />;
  return <main style={{ padding: 30 }}><h1>Isolated QA · SHSAT Lab assignment builder</h1><p>Synthetic content and in-memory assignments only. No database connection.</p><TeacherLearningPlan client={qaClient} accessToken="qa-not-a-token" studentId="qa-only" studentName="Fictional QA Student" view={view} onView={setView} skillFilter={skill} onSkillFilter={setSkill} /></main>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
