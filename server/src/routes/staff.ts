import { Router } from "express";
import { env } from "../config/env";
import { getAuthenticatedUser, getUserRole } from "../lib/auth";
import { supabase } from "../lib/supabase";

const allowedStatuses = new Set(["Absent", "Late", "Present", "Unmarked"]);
const boazRoster = ["Chloe Tong", "Harrison Cheng", "Kaitlyn Lim", "Dylan Cui", "Anabelle Liang", "Joanna Zhao", "Jun Kang"].map(
    (name, index) => ({
        assignment: "Promise Summer School",
        cohort: "Boaz Lim",
        grade: String(6 + (index % 3)),
        id: `PSS-5${String(index + 1).padStart(2, "0")}`,
        name,
        status: "Active",
    }),
);

export const staffRouter = Router();

staffRouter.put("/attendance", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const role = getUserRole(user);
    if (role !== "staff" && role !== "admin") {
        response.status(403).json({ message: "Staff or administrator access is required." });
        return;
    }

    const date = typeof request.body?.date === "string" ? request.body.date : "";
    const rawStatuses = request.body?.statuses;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !rawStatuses || typeof rawStatuses !== "object" || Array.isArray(rawStatuses)) {
        response.status(400).json({ message: "A valid attendance date and status list are required." });
        return;
    }

    const statuses = Object.fromEntries(
        Object.entries(rawStatuses).filter(([, value]) => typeof value === "string" && allowedStatuses.has(value)),
    );

    let target = user;
    const accountId = typeof request.body?.accountId === "string" ? request.body.accountId : "";
    if (role === "admin" && accountId) {
        const targetResult = await supabase.auth.admin.getUserById(accountId);
        if (targetResult.error || !targetResult.data.user) {
            response.status(404).json({ message: "Staff account was not found." });
            return;
        }
        target = targetResult.data.user;
    }

    if (getUserRole(target) !== "staff") {
        response.status(400).json({ message: "Attendance can only be saved to a staff account." });
        return;
    }

    const currentData = target.user_metadata.dashboard_data;
    const dashboardData = currentData && typeof currentData === "object" && !Array.isArray(currentData)
        ? currentData as Record<string, unknown>
        : {};
    const currentRecords = dashboardData.attendanceRecords;
    const attendanceRecords = currentRecords && typeof currentRecords === "object" && !Array.isArray(currentRecords)
        ? currentRecords as Record<string, unknown>
        : {};
    const nextDashboardData = {
        ...dashboardData,
        attendanceRecords: { ...attendanceRecords, [date]: statuses },
        roster: target.user_metadata.username === "pss5" && (!Array.isArray(dashboardData.roster) || dashboardData.roster.length === 0)
            ? boazRoster
            : dashboardData.roster,
    };

    const saved = await supabase.auth.admin.updateUserById(target.id, {
        user_metadata: { ...target.user_metadata, dashboard_data: nextDashboardData },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }

    let sheetsSynced = false;
    if (env.googleSheetsAttendanceWebhookUrl) {
        try {
            const webhookResponse = await fetch(env.googleSheetsAttendanceWebhookUrl, {
                body: JSON.stringify({ accountId: target.id, date, statuses, username: target.user_metadata.username }),
                headers: { "Content-Type": "application/json" },
                method: "POST",
            });
            sheetsSynced = webhookResponse.ok;
        } catch {
            sheetsSynced = false;
        }
    }

    response.json({ dashboardData: nextDashboardData, sheetsSynced });
});
