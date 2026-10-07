import type { PlanAssignment, PlanContent, PlanSettings, PriorContentActivity, InventoryStatus, AssignmentDraft } from "../../../server/src/shared/learningPlan";
export * from "../../../server/src/shared/learningPlan";
export type PlanOverview = {
  summary: ReturnType<typeof import("../../../server/src/shared/learningPlan").planSummary>;
  schedule: PlanAssignment[]; catalog: PlanContent[];
  settings?: PlanSettings;
  inventory?: { content: PlanContent; status: InventoryStatus; hasBeenAssigned?: boolean; hasCompleted?: boolean; lastActivity: string | null; dueDate: string | null; plannedDate: string | null; assignmentCount: number; priorCount: number }[];
};
export type AssignmentPage = { assignments: PlanAssignment[]; total: number; page: number };
export type ContentHistory = AssignmentPage & { prior: PriorContentActivity[] };
export type PlanClient = {
  overview: () => Promise<PlanOverview>;
  list: (status: string, page: number, search?: string) => Promise<AssignmentPage>;
  create: (items: AssignmentDraft[], batchId: string, allowRepeat: boolean) => Promise<void>;
  update: (id: string, revision: number, changes: Partial<PlanAssignment>) => Promise<void>;
  settings: (settings: PlanSettings) => Promise<void>;
  detail: (id: string) => Promise<PlanAssignment>;
  history: (kind: string, contentId: string, page: number) => Promise<ContentHistory>;
};
