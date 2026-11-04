import type { ExamQuestion } from './examTypes';
import type { MathQuestionRecord } from './mathCommandTypes';

export const plannerStatuses = ['draft', 'exported', 'review', 'available'] as const;
export type PlannerStatus = typeof plannerStatuses[number];
export type PlannerDestination = {
  category: string; topic: string; moduleId: string; moduleTitle: string;
  group: 'general' | 'foundation';
  skilled?: string;
};
export type PlannerSource = {
  id: string; question: ExamQuestion; sources: MathQuestionRecord['sources'];
  category: string; subcategory: string; skilled: string;
};
export type PlannerContext = { rationale: string; studentId?: string; evidenceId?: string; assessment?: string; at?: string; answer?: string; correctAnswer?: string };
export type PlannerEntry = {
  id: string; source: PlannerSource; destination: PlannerDestination;
  context?: PlannerContext; notes: string; status: PlannerStatus; addedAt: string;
};
export type GeneratorBatch = {
  id: string; name: string; notes: string; entries: PlannerEntry[]; updatedAt: string;
};
export type GeneratorPlannerState = { revision: string; activeBatchId: string; batches: GeneratorBatch[] };
export const emptyGeneratorPlanner = (): GeneratorPlannerState => ({ revision: 'new', activeBatchId: '', batches: [] });
