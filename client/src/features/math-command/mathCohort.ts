import type { MathAttemptEvidence, MathStudentInsights } from '../../../../server/src/shared/mathCommandAnalytics';
import { mathQuestionMetrics } from '../../../../server/src/shared/mathCommandAnalytics';
import type { MathCommandRequest } from './client';

export function cohortTopics(students: MathStudentInsights[]) {
  const topics = new Map<string, { id: string; category: string; subcategory: string }>();
  for (const student of students) for (const skill of student.skills) {
    if (skill.level === 'subcategory') topics.set(skill.id, { id: skill.id, category: skill.category, subcategory: skill.subcategory });
  }
  return [...topics.values()].sort((a, b) => a.category.localeCompare(b.category) || a.subcategory.localeCompare(b.subcategory));
}

/** Uses the existing account-checked routes; never broadens student access. */
export async function readCohortEvidence(request: MathCommandRequest, studentIds: string[], scope: { category?: string; subcategory?: string }, signal?: AbortSignal) {
  const pages = await Promise.all(studentIds.map(async studentId => {
    const rows: MathAttemptEvidence[] = [];
    for (let page = 0; ; page++) {
      if (signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
      const result = await request<{ items: MathAttemptEvidence[]; total: number }>(`/students/${encodeURIComponent(studentId)}/evidence?${new URLSearchParams({ ...scope, page: String(page) })}`, { signal });
      rows.push(...result.items);
      if (!result.items.length || rows.length >= result.total) return rows;
    }
  }));
  return [...new Map(pages.flat().map(row => [row.id, row])).values()];
}

export function cohortQuestions(rows: MathAttemptEvidence[]) {
  const groups = new Map<string, MathAttemptEvidence[]>();
  for (const row of rows) groups.set(row.questionId, [...(groups.get(row.questionId) ?? []), row]);
  return [...groups].map(([id, evidence]) => ({ id, evidence, metrics: mathQuestionMetrics(evidence) }))
    .sort((a, b) => (a.metrics.accuracy ?? 101) - (b.metrics.accuracy ?? 101) || a.id.localeCompare(b.id));
}
