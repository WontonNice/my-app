import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

async function loadRoster() {
  const users: User[] = [];
  for (let page = 1; ; page++) {
    const result = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (result.error) return result;
    users.push(...result.data.users);
    if (result.data.users.length < 1000) return { ...result, data: { ...result.data, users } };
  }
}
let pending: ReturnType<typeof loadRoster> | undefined;
/** Dashboard sections share an in-flight lookup, never a stale account/permission cache. */
export async function listDashboardUsers() {
  const current = pending ??= loadRoster();
  try { return await current; }
  finally { if (pending === current) pending = undefined; }
}
