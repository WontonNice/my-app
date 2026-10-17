import { supabase } from "./supabase";
import { answerSheetPrefix, sheetError } from "../shared/answerSheets";

export async function sheetRecord<T>(slug: string, userId?: string): Promise<{ owner: string; value: T } | null> {
  let query = supabase.from("student_practice_progress").select("user_id,progress").eq("topic_slug", answerSheetPrefix + slug);
  if (userId) query = query.eq("user_id", userId);
  const result = await query.maybeSingle();
  if (result.error) throw sheetError("Answer-sheet storage is unavailable. Your answers have not been saved. Please retry.", 503);
  return result.data ? { owner: result.data.user_id, value: result.data.progress as T } : null;
}
export async function insertSheetRecord<T>(owner: string, slug: string, value: T) {
  const result = await supabase.from("student_practice_progress").insert({ user_id: owner, topic_slug: answerSheetPrefix + slug, progress: value, updated_at: new Date().toISOString() });
  if (result.error?.code === "23505") throw sheetError("This session was opened in another window. Open it again to resume.", 409);
  if (result.error) throw sheetError("Answer-sheet storage is unavailable. Please retry.", 503);
}
/** A targeted patch is merged on the server and committed with one atomic JSON revision check. */
export async function changeSheetRecord<T extends { revision: number }>(owner: string, slug: string, old: T, next: T) {
  const result = await supabase.from("student_practice_progress").update({ progress: { ...next, revision: old.revision + 1 }, updated_at: new Date().toISOString() })
    .eq("user_id", owner).eq("topic_slug", answerSheetPrefix + slug).eq("progress->>revision", String(old.revision)).select("progress").maybeSingle();
  if (result.error) throw sheetError("The save failed. Keep this page open and retry.", 503);
  if (!result.data) throw sheetError("This record changed in another session. Reopen it before making more changes.", 409);
  return result.data.progress as T;
}
export async function sheetRecords<T>(pattern: string, owner?: string): Promise<{ owner: string; value: T; slug: string }[]> {
  const rows: { owner: string; value: T; slug: string }[] = [];
  for (let offset = 0; ; offset += 500) {
    let query = supabase.from("student_practice_progress").select("user_id,topic_slug,progress").like("topic_slug", answerSheetPrefix + pattern).order("id").range(offset, offset + 499);
    if (owner) query = query.eq("user_id", owner);
    const result = await query;
    if (result.error) throw sheetError("Answer-sheet storage is unavailable.", 503);
    rows.push(...(result.data ?? []).map(row => ({ owner: row.user_id, value: row.progress as T, slug: row.topic_slug })));
    if ((result.data?.length ?? 0) < 500) return rows;
  }
}
