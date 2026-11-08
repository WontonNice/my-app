import { getActiveSession } from '../../lib/sessionCache';
import { createAuthHeaders, requestApi } from '../../lib/api';
import { mathCommandRequest, jsonRequest, type MathCommandRequest } from './client';
import type { GeneratorPlannerState } from '../../../../server/src/shared/generatorPlanner';
import { generatorPlannerQuery } from './generatorPlannerNavigation';
import { notifyPlannerChanged } from './generatorPlannerSync';

export const personalPlannerRequest: MathCommandRequest = async <T,>(path: string, options?: RequestInit) => {
  const session = await getActiveSession();
  return mathCommandRequest(session?.access_token ?? '')<T>(path, options);
};
export const personalPracticeRequest: MathCommandRequest = async <T,>(path: string, options?: RequestInit) => {
  const session = await getActiveSession();
  return requestApi<T>('/api/infinite-practice' + path, { ...options, headers: { ...createAuthHeaders(session?.access_token ?? ''), ...options?.headers } });
};
export const readPlanner = (request: MathCommandRequest) => request<GeneratorPlannerState>('/generator-planner');
export const changePlanner = async (request: MathCommandRequest, state: GeneratorPlannerState, action: Record<string, unknown>) => {
  const next = await request<GeneratorPlannerState>('/generator-planner', jsonRequest('POST', { ...action, revision: state.revision }));
  notifyPlannerChanged();
  return next;
};
export const accountPlannerDestination = (request: MathCommandRequest, questionIds: string[] = []) =>
  request<{ url: string }>('/teacher-workspace', jsonRequest('POST', { query: generatorPlannerQuery(questionIds) }));
export const plannerHref = '/teacher/math-command?tab=planner';
export const createGeneratorHref = (id: string) => '/teacher/math-command?tab=infinite&sourceQuestionId=' + encodeURIComponent(id);
export const plannerStatusLabels = { draft: 'Draft request', exported: 'Exported to Codex', review: 'Ready for review', available: 'Publish after review (legacy intent)' };
