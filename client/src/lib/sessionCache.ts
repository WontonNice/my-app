import type { Session } from "@supabase/supabase-js";
import type { StudentClass } from "./api";
import { getSupabaseClient } from "./supabase";

let activeSession: Session | null | undefined;
const studentClassesByUser = new Map<string, StudentClass[]>();

export function cacheActiveSession(session: Session | null) {
  activeSession = session;
}

export function peekActiveSession() {
  return activeSession;
}

export async function getActiveSession() {
  if (activeSession !== undefined) return activeSession;
  const { data } = await getSupabaseClient().auth.getSession();
  activeSession = data.session;
  return activeSession;
}

export function cacheStudentClasses(userId: string, classes: StudentClass[]) {
  studentClassesByUser.set(userId, classes);
}

export function getCachedStudentClasses(userId: string) {
  return studentClassesByUser.get(userId);
}
