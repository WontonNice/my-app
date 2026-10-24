import { supabase } from "./supabase";
import { remainingReentrySections, type ExamReentryGrant } from "../shared/examReentry";

export const examReentryPrefix = "__exam_reentry__:";
export async function readExamReentries(studentId: string) {
  const query = await supabase.from("student_exam_results").select("assessment_id,result").eq("user_id", studentId);
  if (query.error) throw new Error("Could not verify exam re-entry permissions. Please retry.");
  const records = new Map((query.data ?? []).map(row => [String(row.assessment_id), row.result as Record<string, unknown>]));
  const grants: Record<string, ExamReentryGrant> = {};
  for (const [key, value] of records) {
    if (!key.startsWith(examReentryPrefix)) continue;
    const grant = value as unknown as ExamReentryGrant;
    if (!grant.id || !Array.isArray(grant.sections)) continue;
    grants[grant.assessmentId] = { ...grant, remainingSections: remainingReentrySections(grant, records.get(grant.assessmentId)) };
  }
  return { grants, records };
}

// Serialize grant/revoke and submission changes for a student's exam in this server.
// Each write rechecks the durable grant after acquiring the lock.
const writes = new Map<string, Promise<unknown>>();
export async function withExamWriteLock<T>(studentId: string, assessmentId: string, action: () => Promise<T>): Promise<T> {
  const key = `${studentId}:${assessmentId}`;
  const previous = writes.get(key) ?? Promise.resolve();
  const pending = previous.catch(() => undefined).then(action);
  writes.set(key, pending);
  try { return await pending; } finally { if (writes.get(key) === pending) writes.delete(key); }
}
