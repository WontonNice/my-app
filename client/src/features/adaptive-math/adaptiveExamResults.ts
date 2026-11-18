import { createAuthHeaders, requestApi } from '../../lib/api';
import { parseAdaptiveState, type AdaptiveState } from '../../../../server/src/shared/adaptiveMath/engine';

// What a teacher can read about students' Adaptive Math Exams. Every call here is a GET:
// the teacher view never saves anything to a student's exam.

const examPath = '/api/infinite-practice/adaptive-exam';

/** One student's saved exam, or null if the student has not started. The server allows teachers and admins only. */
export async function loadStudentAdaptiveExam(accessToken: string, studentId: string): Promise<AdaptiveState | null> {
  const result = await requestApi<{ state: unknown }>(`${examPath}?studentId=${encodeURIComponent(studentId)}`, { headers: createAuthHeaders(accessToken) });
  if (result.state === null || result.state === undefined) return null;
  const state = parseAdaptiveState(result.state);
  if (!state) throw new Error('This saved exam could not be read. Refresh the page and try again.');
  return state;
}

export type AdaptiveRoster = { total: number; students: Record<string, number> };
/** Topics mastered for every student who has started the exam, keyed by student ID. Teachers and admins only. */
export async function loadAdaptiveRoster(accessToken: string): Promise<AdaptiveRoster> {
  const result = await requestApi<Partial<AdaptiveRoster>>(`${examPath}/roster`, { headers: createAuthHeaders(accessToken) });
  const students: Record<string, number> = {};
  for (const [id, mastered] of Object.entries(result.students ?? {})) if (Number.isSafeInteger(mastered) && mastered >= 0) students[id] = mastered;
  return { total: Number.isSafeInteger(result.total) ? result.total! : 0, students };
}
