import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const compact = process.argv.includes("--compact");
const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim();
const serviceRole = process.env.SUPABASE_SERVICE_ROLE?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !serviceRole) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE before running the migration.");
}

const supabase = createClient(supabaseUrl, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });
const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listed.error) throw listed.error;

const staffUsers = listed.data.users.filter((user) => (user.app_metadata.role ?? user.user_metadata.role) === "staff");
let migrated = 0;
let compacted = 0;

for (const user of staffUsers) {
  const legacy = user.user_metadata.dashboard_data;
  const dashboardData = legacy && typeof legacy === "object" && !Array.isArray(legacy) ? { ...legacy } : { attendance: [], roster: [] };
  const attendanceRecords = dashboardData.attendanceRecords && typeof dashboardData.attendanceRecords === "object" && !Array.isArray(dashboardData.attendanceRecords)
    ? dashboardData.attendanceRecords
    : {};
  delete dashboardData.attendanceRecords;

  const dashboardSave = await supabase.from("staff_dashboard_data").upsert({
    dashboard_data: dashboardData,
    staff_user_id: user.id,
    updated_at: new Date().toISOString(),
  }, { ignoreDuplicates: true, onConflict: "staff_user_id" });
  if (dashboardSave.error) throw new Error(`${user.email}: ${dashboardSave.error.message}`);

  const attendanceRows = Object.entries(attendanceRecords).map(([date, statuses]) => ({
    attendance_date: date,
    staff_user_id: user.id,
    statuses,
    updated_at: new Date().toISOString(),
  }));
  if (attendanceRows.length) {
    const attendanceSave = await supabase.from("staff_attendance_records").upsert(attendanceRows, { ignoreDuplicates: true, onConflict: "staff_user_id,attendance_date" });
    if (attendanceSave.error) throw new Error(`${user.email}: ${attendanceSave.error.message}`);
  }

  const verification = await Promise.all([
    supabase.from("staff_dashboard_data").select("staff_user_id").eq("staff_user_id", user.id).single(),
    supabase.from("staff_attendance_records").select("attendance_date").eq("staff_user_id", user.id),
  ]);
  const savedDates = new Set((verification[1].data ?? []).map((row) => row.attendance_date));
  if (verification[0].error || verification[1].error || attendanceRows.some((row) => !savedDates.has(row.attendance_date))) {
    throw new Error(`${user.email}: database verification failed; Auth metadata was not changed.`);
  }
  migrated += 1;

  if (compact && Object.hasOwn(user.user_metadata, "dashboard_data")) {
    const nextMetadata = { ...user.user_metadata };
    delete nextMetadata.dashboard_data;
    const updated = await supabase.auth.admin.updateUserById(user.id, { user_metadata: nextMetadata });
    if (updated.error) throw new Error(`${user.email}: ${updated.error.message}`);
    compacted += 1;
  }
}

console.log(JSON.stringify({ compacted, migrated, mode: compact ? "copy-verify-compact" : "copy-verify", staffUsers: staffUsers.length }, null, 2));
