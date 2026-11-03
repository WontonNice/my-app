import type { PlanAssignment, PlanContent, PlanSettings, PriorContentActivity, InventoryStatus, AssignmentDraft } from "../../../server/src/shared/learningPlan";
export * from "../../../server/src/shared/learningPlan";
export type PlanOverview = {
  summary: ReturnType<typeof import("../../../server/src/shared/learningPlan").planSummary>;
  schedule: PlanAssignment[]; catalog: PlanContent[];
  settings?: PlanSettings;
  historyIssues?: string[];
  passageRelations?: import("./learningPlan").PassageRelation[];
  inventory?: { content: PlanContent; status: InventoryStatus; hasBeenAssigned?: boolean; hasCompleted?: boolean; historyComplete?: boolean; evidence?: PriorContentActivity[]; lastActivity: string | null; lastCompletedAt?: string | null; latestScore?: { correct:number; total:number; at:string|null } | null; dueDate: string | null; plannedDate: string | null; assignmentCount: number; priorCount: number }[];
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
  relatePassages?: (relation: Pick<import("./learningPlan").PassageRelation, "a" | "b" | "relation"> & { revision?: number }) => Promise<void>;
  passagePreview?: (id: string) => Promise<{ title: string; text: string }>;
};
