import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type StaffDashboardRecord = Record<string, unknown>;

type StaffUser = Pick<User, "id" | "user_metadata">;

type DashboardRow = {
    dashboard_data: unknown;
    staff_user_id: string;
};

type AttendanceRow = {
    attendance_date: string;
    staff_user_id: string;
    statuses: unknown;
    updated_at: string;
};

function isRecord(value: unknown): value is StaffDashboardRecord {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function readLegacyStaffDashboardData(user: StaffUser): StaffDashboardRecord {
    const value = user.user_metadata.dashboard_data;
    return isRecord(value) ? value : {};
}

function hasLegacyStaffDashboardData(user: StaffUser) {
    return isRecord(user.user_metadata.dashboard_data);
}

function readAttendanceRecords(value: unknown) {
    if (!isRecord(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, statuses]) => isRecord(statuses)));
}

function combineDashboardData(
    user: StaffUser,
    storedDashboardData: unknown,
    attendanceRows: AttendanceRow[],
): StaffDashboardRecord {
    const legacy = readLegacyStaffDashboardData(user);
    const stored = isRecord(storedDashboardData) ? storedDashboardData : legacy;
    const attendanceRecords = {
        ...readAttendanceRecords(legacy.attendanceRecords),
        ...Object.fromEntries(attendanceRows.filter((row) => isRecord(row.statuses)).map((row) => [row.attendance_date, row.statuses])),
    };
    const attendanceUpdatedAt = Object.fromEntries(
        attendanceRows
            .filter((row) => typeof row.updated_at === "string" && Boolean(row.updated_at))
            .map((row) => [row.attendance_date, row.updated_at]),
    );

    return {
        ...stored,
        attendance: Array.isArray(stored.attendance) ? stored.attendance : [],
        attendanceRecords,
        attendanceUpdatedAt,
        roster: Array.isArray(stored.roster) ? stored.roster : [],
    };
}

export async function getStaffDashboardData(user: StaffUser): Promise<StaffDashboardRecord> {
    const [dashboardResult, attendanceResult] = await Promise.all([
        supabase.from("staff_dashboard_data").select("staff_user_id,dashboard_data").eq("staff_user_id", user.id).maybeSingle(),
        supabase.from("staff_attendance_records").select("staff_user_id,attendance_date,statuses,updated_at").eq("staff_user_id", user.id),
    ]);

    if (dashboardResult.error || attendanceResult.error) {
        if (hasLegacyStaffDashboardData(user)) return combineDashboardData(user, null, []);
        throw new Error(`Staff dashboard storage is unavailable: ${dashboardResult.error?.message ?? attendanceResult.error?.message}`);
    }

    const dashboardRow = dashboardResult.data as DashboardRow | null;
    if (!dashboardRow && !hasLegacyStaffDashboardData(user)) {
        throw new Error("Staff dashboard storage is missing for this account.");
    }
    return combineDashboardData(user, dashboardRow?.dashboard_data, (attendanceResult.data ?? []) as AttendanceRow[]);
}

export async function getStaffDashboardDataMap(users: StaffUser[]) {
    const fallback = new Map(users.map((user) => [user.id, combineDashboardData(user, null, [])]));
    if (!users.length) return fallback;

    const ids = users.map((user) => user.id);
    const [dashboardResult, attendanceResult] = await Promise.all([
        supabase.from("staff_dashboard_data").select("staff_user_id,dashboard_data").in("staff_user_id", ids),
        supabase.from("staff_attendance_records").select("staff_user_id,attendance_date,statuses,updated_at").in("staff_user_id", ids),
    ]);
    if (dashboardResult.error || attendanceResult.error) {
        if (users.every(hasLegacyStaffDashboardData)) return fallback;
        throw new Error(`Staff dashboard storage is unavailable: ${dashboardResult.error?.message ?? attendanceResult.error?.message}`);
    }

    const dashboards = new Map(((dashboardResult.data ?? []) as DashboardRow[]).map((row) => [row.staff_user_id, row.dashboard_data]));
    const attendanceByUser = new Map<string, AttendanceRow[]>();
    for (const row of (attendanceResult.data ?? []) as AttendanceRow[]) {
        attendanceByUser.set(row.staff_user_id, [...(attendanceByUser.get(row.staff_user_id) ?? []), row]);
    }

    return new Map(users.map((user) => {
        const storedDashboardData = dashboards.get(user.id);
        if (storedDashboardData === undefined && !hasLegacyStaffDashboardData(user)) {
            throw new Error(`Staff dashboard storage is missing for ${user.id}.`);
        }
        return [user.id, combineDashboardData(user, storedDashboardData, attendanceByUser.get(user.id) ?? [])];
    }));
}

export async function saveStaffDashboardData(staffUserId: string, value: StaffDashboardRecord) {
    const dashboardData = { ...value };
    const attendanceRecords = readAttendanceRecords(dashboardData.attendanceRecords);
    delete dashboardData.attendanceRecords;
    delete dashboardData.attendanceUpdatedAt;

    const dashboardResult = await supabase.from("staff_dashboard_data").upsert({
        dashboard_data: dashboardData,
        staff_user_id: staffUserId,
        updated_at: new Date().toISOString(),
    }, { onConflict: "staff_user_id" });
    if (dashboardResult.error) return { error: dashboardResult.error.message };

    const rows = Object.entries(attendanceRecords).map(([date, statuses]) => ({
        attendance_date: date,
        staff_user_id: staffUserId,
        statuses,
        updated_at: new Date().toISOString(),
    }));
    if (rows.length) {
        const attendanceResult = await supabase.from("staff_attendance_records").upsert(rows, { onConflict: "staff_user_id,attendance_date" });
        if (attendanceResult.error) return { error: attendanceResult.error.message };
    }

    return { error: null };
}

export async function saveStaffAttendanceRecord(
    staffUserId: string,
    date: string,
    statuses: StaffDashboardRecord,
    dashboardData: StaffDashboardRecord,
) {
    const compactDashboardData = { ...dashboardData };
    delete compactDashboardData.attendanceRecords;
    delete compactDashboardData.attendanceUpdatedAt;
    const updatedAt = new Date().toISOString();
    const [dashboardResult, attendanceResult] = await Promise.all([
        supabase.from("staff_dashboard_data").upsert({
            dashboard_data: compactDashboardData,
            staff_user_id: staffUserId,
            updated_at: updatedAt,
        }, { onConflict: "staff_user_id" }),
        supabase.from("staff_attendance_records").upsert({
            attendance_date: date,
            staff_user_id: staffUserId,
            statuses,
            updated_at: updatedAt,
        }, { onConflict: "staff_user_id,attendance_date" }),
    ]);

    const error = dashboardResult.error?.message ?? attendanceResult.error?.message ?? null;
    return { error, updatedAt: error ? null : updatedAt };
}
