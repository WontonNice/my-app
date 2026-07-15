import { Router } from "express";
import { randomUUID } from "node:crypto";
import { env } from "../config/env";
import { getAuthenticatedUser, getUserRole } from "../lib/auth";
import { fetchWithTimeout } from "../lib/fetchWithTimeout";
import { getStaffDashboardData, getStaffDashboardDataMap, saveStaffAttendanceRecord, saveStaffDashboardData, type StaffDashboardRecord } from "../lib/staffDashboardStore";
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

const sheetsWebhookMetadataKey = "google_sheets_attendance_webhook_url";
const tasksMetadataKey = "staff_tasks";
const staffAttendanceMetadataKey = "staff_attendance_records";
const globalStoreEmail = "pss-store@staff.nathantutors.local";
const globalStoreMetadataKeys = [tasksMetadataKey, staffAttendanceMetadataKey] as const;

const defaultWeekdaySchedule = [
    { endTime: "09:15", id: "morning-arrival", place: "Student Commons", startTime: "08:30", studentIds: [], title: "Arrival and breakfast", weekdays: [1, 2, 3, 4, 5] },
    { endTime: "11:30", id: "academic-block", place: "Assigned classroom", startTime: "09:30", studentIds: [], title: "Student learning block", weekdays: [1, 2, 3, 4, 5] },
    { endTime: "13:00", id: "lunch-recreation", place: "Commons and activity areas", startTime: "11:45", studentIds: [], title: "Lunch and recreation", weekdays: [1, 2, 3, 4, 5] },
    { endTime: "15:15", id: "afternoon-program", place: "Assigned classroom", startTime: "13:15", studentIds: [], title: "Afternoon student program", weekdays: [1, 2, 3, 4, 5] },
];

function readSchedule(dashboardData: StaffDashboardRecord) {
    const schedule = dashboardData.schedule;
    return Array.isArray(schedule) ? schedule : defaultWeekdaySchedule;
}

function isTime(value: unknown): value is string {
    return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isDate(value: unknown): value is string {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function currentEasternDate() {
    const parts = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", timeZone: "America/New_York", year: "numeric" }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
}

function weeklyDates(start: string, repeatUntil: string) {
    const dates: string[] = [];
    const cursor = new Date(`${start}T12:00:00Z`);
    const end = new Date(`${repeatUntil}T12:00:00Z`);
    while (cursor <= end && dates.length < 53) {
        dates.push(cursor.toISOString().slice(0, 10));
        cursor.setUTCDate(cursor.getUTCDate() + 7);
    }
    return dates;
}

async function requireAdmin(authorizationHeader: string | undefined) {
    const authenticated = await getAuthenticatedUser(authorizationHeader);
    if (authenticated.error || !authenticated.user) return { error: authenticated.error, user: null };
    if (getUserRole(authenticated.user) !== "admin") return { error: "Administrator access is required.", user: null };
    return { error: null, user: authenticated.user };
}

function validWebhookUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === "https:";
    } catch {
        return false;
    }
}

async function getSheetsWebhookUrl() {
    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const adminUrl = listed.data?.users
        .filter((candidate) => getUserRole(candidate) === "admin")
        .map((candidate) => candidate.app_metadata[sheetsWebhookMetadataKey])
        .find((value): value is string => typeof value === "string" && Boolean(value.trim()));
    return adminUrl?.trim() || env.googleSheetsAttendanceWebhookUrl;
}

async function getGlobalStoreAdmin() {
    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) return { error: listed.error.message, user: null };
    const admin = listed.data.users.find((candidate) => getUserRole(candidate) === "admin") ?? null;
    const existingStore = listed.data.users.find((candidate) => candidate.email === globalStoreEmail || candidate.app_metadata.role === "store") ?? null;
    const migratedMetadata = Object.fromEntries(
        globalStoreMetadataKeys
            .map((key) => [key, admin?.app_metadata[key]])
            .filter(([, value]) => value !== undefined),
    );
    let store = existingStore;

    if (!store) {
        const created = await supabase.auth.admin.createUser({
            app_metadata: { ...migratedMetadata, role: "store" },
            email: globalStoreEmail,
            email_confirm: true,
            password: randomUUID(),
            user_metadata: { full_name: "PSS Global Store", role: "store", username: "pss-store" },
        });
        if (created.error || !created.data.user) return { error: created.error?.message ?? "Could not prepare dashboard storage.", user: null };
        store = created.data.user;
    } else {
        const shouldMigrate = Object.entries(migratedMetadata).some(([key, value]) => store?.app_metadata[key] === undefined && value !== undefined);
        if (shouldMigrate) {
            const updated = await supabase.auth.admin.updateUserById(store.id, {
                app_metadata: { ...migratedMetadata, ...store.app_metadata, role: "store" },
            });
            if (updated.error || !updated.data.user) return { error: updated.error?.message ?? "Could not migrate dashboard storage.", user: null };
            store = updated.data.user;
        }
    }

    if (admin && globalStoreMetadataKeys.some((key) => admin.app_metadata[key] !== undefined)) {
        const compactedMetadata = { ...admin.app_metadata };
        for (const key of globalStoreMetadataKeys) compactedMetadata[key] = null;
        const updatedAdmin = await supabase.auth.admin.updateUserById(admin.id, { app_metadata: compactedMetadata });
        if (updatedAdmin.error) return { error: updatedAdmin.error.message, user: null };
    }

    return { error: null, user: store };
}

function readTasks(user: { app_metadata: Record<string, unknown> }) {
    const tasks = user.app_metadata[tasksMetadataKey];
    return Array.isArray(tasks) ? tasks as Record<string, unknown>[] : [];
}

function readStaffAttendance(user: { app_metadata: Record<string, unknown> }) {
    const entries = user.app_metadata[staffAttendanceMetadataKey];
    if (!Array.isArray(entries)) return [];
    return entries.filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object" && !Array.isArray(entry))
        .map((entry) => ({
            date: typeof entry.date === "string" && isDate(entry.date) ? entry.date : currentEasternDate(),
            hours: Number.isFinite(Number(entry.hours)) ? Math.max(0, Math.min(24, Number(entry.hours))) : 0,
            id: typeof entry.id === "string" && entry.id ? entry.id : randomUUID(),
            note: typeof entry.note === "string" ? entry.note : "",
            staffAccountId: typeof entry.staffAccountId === "string" ? entry.staffAccountId : "",
            staffName: typeof entry.staffName === "string" && entry.staffName.trim() ? entry.staffName.trim() : "Staff",
        }));
}

staffRouter.get("/tasks", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "staff" && role !== "admin") {
        response.status(403).json({ message: "Staff or administrator access is required." });
        return;
    }
    const store = await getGlobalStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) {
        response.status(400).json({ message: listed.error.message });
        return;
    }
    const staffUsers = listed.data.users.filter((user) => getUserRole(user) === "staff");
    let tasks = readTasks(store.user);
    const currentStaffNames = new Map(staffUsers.map((staff) => [
        staff.id,
        staff.user_metadata.full_name ?? staff.user_metadata.username ?? "Staff",
    ]));
    let tasksChanged = false;
    tasks = tasks.map((task) => {
        const currentName = currentStaffNames.get(String(task.assignedToId ?? ""));
        if (!currentName || task.assignedToName === currentName) return task;
        tasksChanged = true;
        return { ...task, assignedToName: currentName };
    });
    const today = currentEasternDate();
    const missingDefaults = staffUsers.filter((staff) => !tasks.some((task) => task.assignedToId === staff.id && task.title === "Submit attendance" && task.dueDate === today));
    if (missingDefaults.length) {
        tasksChanged = true;
        tasks = [...tasks, ...missingDefaults.map((staff) => ({
            assignedToId: staff.id,
            assignedToName: staff.user_metadata.full_name ?? staff.user_metadata.username ?? "Staff",
            createdAt: new Date().toISOString(),
            description: "Complete and submit today’s student attendance.",
            dueDate: today,
            id: randomUUID(),
            status: "open",
            title: "Submit attendance",
        }))];
    }
    if (tasksChanged) {
        const saved = await supabase.auth.admin.updateUserById(store.user.id, {
            app_metadata: { ...store.user.app_metadata, [tasksMetadataKey]: tasks },
        });
        if (saved.error) {
            response.status(400).json({ message: saved.error.message });
            return;
        }
    }
    response.json({ tasks: role === "staff" ? tasks.filter((task) => task.assignedToId === authenticated.user?.id) : tasks });
});

staffRouter.post("/tasks", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const assignedToId = typeof request.body?.assignedToId === "string" ? request.body.assignedToId : "";
    const title = typeof request.body?.title === "string" ? request.body.title.trim() : "";
    const description = typeof request.body?.description === "string" ? request.body.description.trim() : "";
    const dueDate = typeof request.body?.dueDate === "string" ? request.body.dueDate : "";
    const repeatWeekly = request.body?.repeatWeekly === true;
    const repeatUntil = typeof request.body?.repeatUntil === "string" ? request.body.repeatUntil : "";
    const targetResult = await supabase.auth.admin.getUserById(assignedToId);
    const target = targetResult.data.user;
    if (!title || !description || !isDate(dueDate) || targetResult.error || !target || getUserRole(target) !== "staff") {
        response.status(400).json({ message: "Choose a staff member and provide a title, description, and due date." });
        return;
    }
    if (repeatWeekly && (!isDate(repeatUntil) || repeatUntil < dueDate)) {
        response.status(400).json({ message: "Choose a valid repeat-until date for weekly tasks." });
        return;
    }
    const store = await getGlobalStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const recurrenceGroupId = repeatWeekly ? randomUUID() : undefined;
    const createdAt = new Date().toISOString();
    const taskDates = repeatWeekly ? weeklyDates(dueDate, repeatUntil) : [dueDate];
    const createdTasks = taskDates.map((date) => ({
        assignedToId,
        assignedToName: target.user_metadata.full_name ?? target.user_metadata.username ?? "Staff",
        createdAt,
        description,
        dueDate: date,
        id: randomUUID(),
        recurrenceGroupId,
        status: "open",
        title,
    }));
    const tasks = [...readTasks(store.user), ...createdTasks];
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [tasksMetadataKey]: tasks },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.status(201).json({ task: createdTasks[0], tasks: createdTasks });
});

staffRouter.patch("/tasks/:taskId", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "staff" && role !== "admin") {
        response.status(403).json({ message: "Staff or administrator access is required." });
        return;
    }
    const store = await getGlobalStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const tasks = readTasks(store.user);
    const current = tasks.find((task) => task.id === request.params.taskId);
    if (!current || (role === "staff" && current.assignedToId !== authenticated.user.id)) {
        response.status(404).json({ message: "Task was not found." });
        return;
    }
    const completed = request.body?.completed === true;
    const task = { ...current, completedAt: completed ? new Date().toISOString() : undefined, status: completed ? "completed" : "open" };
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [tasksMetadataKey]: tasks.map((item) => item.id === current.id ? task : item) },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.json({ task });
});

staffRouter.delete("/tasks/:taskId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const store = await getGlobalStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const tasks = readTasks(store.user);
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [tasksMetadataKey]: tasks.filter((task) => task.id !== request.params.taskId) },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.status(204).send();
});

staffRouter.get("/staff-attendance", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const store = await getGlobalStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    response.json({ entries: readStaffAttendance(store.user) });
});

staffRouter.put("/staff-attendance", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }

    const date = typeof request.body?.date === "string" ? request.body.date : "";
    const hours = Number(request.body?.hours);
    const id = typeof request.body?.id === "string" ? request.body.id : "";
    const note = typeof request.body?.note === "string" ? request.body.note.trim() : "";
    const staffAccountId = typeof request.body?.staffAccountId === "string" ? request.body.staffAccountId : "";
    let staffName = typeof request.body?.staffName === "string" ? request.body.staffName.trim() : "";

    if (!isDate(date) || !Number.isFinite(hours) || hours < 0 || hours > 24) {
        response.status(400).json({ message: "Choose a valid date and enter hours from 0 to 24." });
        return;
    }

    if (staffAccountId) {
        const targetResult = await supabase.auth.admin.getUserById(staffAccountId);
        const target = targetResult.data.user;
        if (targetResult.error || !target || getUserRole(target) !== "staff") {
            response.status(404).json({ message: "Staff account was not found." });
            return;
        }
        staffName = target.user_metadata.full_name ?? target.user_metadata.username ?? staffName;
    }

    if (!staffName) {
        response.status(400).json({ message: "Choose or enter a staff member." });
        return;
    }

    const store = await getGlobalStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }

    const entry = {
        date,
        hours: Math.round(hours * 100) / 100,
        id: id || randomUUID(),
        note,
        staffAccountId,
        staffName,
    };
    const entries = readStaffAttendance(store.user);
    const nextEntries = entries.some((item) => item.id === entry.id)
        ? entries.map((item) => item.id === entry.id ? entry : item)
        : [entry, ...entries];
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [staffAttendanceMetadataKey]: nextEntries },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }

    response.json({ entries: nextEntries, entry });
});

staffRouter.delete("/staff-attendance/:entryId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const store = await getGlobalStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }

    const entries = readStaffAttendance(store.user);
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [staffAttendanceMetadataKey]: entries.filter((entry) => entry.id !== request.params.entryId) },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }

    response.status(204).send();
});

staffRouter.get("/dashboard", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "staff" && role !== "admin") {
        response.status(403).json({ message: "Staff or administrator access is required." });
        return;
    }

    let target = authenticated.user;
    const accountId = typeof request.query.accountId === "string" ? request.query.accountId : "";
    if (role === "admin" && accountId) {
        const targetResult = await supabase.auth.admin.getUserById(accountId);
        if (targetResult.error || !targetResult.data.user) {
            response.status(404).json({ message: "Staff account was not found." });
            return;
        }
        target = targetResult.data.user;
    }
    if (getUserRole(target) !== "staff") {
        response.status(400).json({ message: "A staff dashboard can only be loaded for a staff account." });
        return;
    }

    const storedDashboardData = await getStaffDashboardData(target);
    const storedRoster = Array.isArray(storedDashboardData.roster) ? storedDashboardData.roster : [];
    const dashboardData = {
        ...storedDashboardData,
        roster: target.user_metadata.username === "pss5" && storedRoster.length === 0 ? boazRoster : storedRoster,
    };
    response.json({ dashboardData });
});

staffRouter.get("/schedules", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "staff" && role !== "admin") {
        response.status(403).json({ message: "Staff or administrator access is required." });
        return;
    }
    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) {
        response.status(400).json({ message: listed.error.message });
        return;
    }
    const staffUsers = listed.data.users.filter((user) => getUserRole(user) === "staff");
    const dashboardData = await getStaffDashboardDataMap(staffUsers);
    const schedules = staffUsers.map((user) => ({
        accountId: user.id,
        fullName: user.user_metadata.full_name ?? user.user_metadata.username ?? "Staff",
        schedule: readSchedule(dashboardData.get(user.id) ?? {}),
        username: user.user_metadata.username ?? "staff",
    })).sort((a, b) => String(a.fullName).localeCompare(String(b.fullName)));
    response.json({ schedules });
});

staffRouter.put("/schedules/:accountId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const targetResult = await supabase.auth.admin.getUserById(request.params.accountId);
    const target = targetResult.data.user;
    if (targetResult.error || !target || getUserRole(target) !== "staff") {
        response.status(404).json({ message: "Staff account was not found." });
        return;
    }
    const rawSchedule = request.body?.schedule;
    if (!Array.isArray(rawSchedule) || rawSchedule.length > 60) {
        response.status(400).json({ message: "Provide a valid schedule." });
        return;
    }
    const schedule = rawSchedule.map((item) => ({
        endTime: item?.endTime,
        id: typeof item?.id === "string" && item.id ? item.id : randomUUID(),
        place: typeof item?.place === "string" ? item.place.trim() : "",
        startTime: item?.startTime,
        studentIds: Array.isArray(item?.studentIds) ? item.studentIds.filter((id: unknown) => typeof id === "string") : [],
        title: typeof item?.title === "string" ? item.title.trim() : "",
        weekdays: Array.isArray(item?.weekdays) ? Array.from(new Set(item.weekdays.filter((day: unknown) => Number.isInteger(day) && Number(day) >= 1 && Number(day) <= 5))) : [],
    }));
    if (schedule.some((item) => !item.title || !item.place || !isTime(item.startTime) || !isTime(item.endTime) || item.startTime >= item.endTime || !item.weekdays.length)) {
        response.status(400).json({ message: "Every schedule item needs a title, location, valid time range, and at least one weekday." });
        return;
    }
    const dashboardData = await getStaffDashboardData(target);
    const saved = await saveStaffDashboardData(target.id, { ...dashboardData, schedule });
    if (saved.error) {
        response.status(400).json({ message: saved.error });
        return;
    }
    response.json({ schedule });
});

staffRouter.put("/classes/:accountId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const targetResult = await supabase.auth.admin.getUserById(request.params.accountId);
    const target = targetResult.data.user;
    if (targetResult.error || !target || getUserRole(target) !== "staff") {
        response.status(404).json({ message: "Staff account was not found." });
        return;
    }
    const classes: string[] = Array.isArray(request.body?.classes)
        ? Array.from(new Set<string>(request.body.classes.map((value: unknown) => typeof value === "string" ? value.trim() : "").filter((value: string) => Boolean(value)))).slice(0, 12)
        : [];
    if (classes.some((value) => value.length > 60)) {
        response.status(400).json({ message: "Class names must be 60 characters or fewer." });
        return;
    }
    const dashboardData = await getStaffDashboardData(target);
    const nextDashboardData = { ...dashboardData, classes };
    const saved = await saveStaffDashboardData(target.id, nextDashboardData);
    if (saved.error) {
        response.status(400).json({ message: saved.error });
        return;
    }
    response.json({ classes, dashboardData: nextDashboardData });
});

staffRouter.put("/swimming/:accountId/:studentId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }

    const targetResult = await supabase.auth.admin.getUserById(request.params.accountId);
    const target = targetResult.data.user;
    if (targetResult.error || !target || getUserRole(target) !== "staff") {
        response.status(404).json({ message: "Staff account was not found." });
        return;
    }

    const dashboardData = await getStaffDashboardData(target);
    const storedRoster = Array.isArray(dashboardData.roster) ? dashboardData.roster as Record<string, unknown>[] : [];
    const roster = target.user_metadata.username === "pss5" && storedRoster.length === 0 ? boazRoster : storedRoster;
    if (!roster.some((student) => student.id === request.params.studentId)) {
        response.status(404).json({ message: "Student was not found on this roster." });
        return;
    }
    if (typeof request.body?.waiverComplete !== "boolean" || typeof request.body?.paidFee !== "boolean") {
        response.status(400).json({ message: "Swimming waiver and fee values must be checked or unchecked." });
        return;
    }

    const storedSwimmingRecords = dashboardData.swimmingRecords && typeof dashboardData.swimmingRecords === "object" && !Array.isArray(dashboardData.swimmingRecords)
        ? dashboardData.swimmingRecords as Record<string, unknown>
        : {};
    const status = {
        paidFee: request.body.paidFee as boolean,
        waiverComplete: request.body.waiverComplete as boolean,
    };
    const nextDashboardData = {
        ...dashboardData,
        roster,
        swimmingRecords: { ...storedSwimmingRecords, [request.params.studentId]: status },
    };
    const saved = await saveStaffDashboardData(target.id, nextDashboardData);
    if (saved.error) {
        response.status(400).json({ message: saved.error });
        return;
    }

    response.json({ dashboardData: nextDashboardData, status });
});

staffRouter.put("/roster/:accountId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }

    const targetResult = await supabase.auth.admin.getUserById(request.params.accountId);
    const target = targetResult.data.user;
    if (targetResult.error || !target || getUserRole(target) !== "staff") {
        response.status(404).json({ message: "Staff class was not found." });
        return;
    }

    const firstName = typeof request.body?.firstName === "string" ? request.body.firstName.trim() : "";
    const lastName = typeof request.body?.lastName === "string" ? request.body.lastName.trim() : "";
    const dob = typeof request.body?.dob === "string" ? request.body.dob.trim() : "";
    const allergies = typeof request.body?.allergies === "string" ? request.body.allergies.trim() : "";
    const specialNotes = typeof request.body?.specialNotes === "string" ? request.body.specialNotes.trim() : "";
    const className = typeof request.body?.className === "string" ? request.body.className.trim() : "";
    const requestedId = typeof request.body?.id === "string" ? request.body.id.trim() : "";
    if (!firstName || !lastName || !className || (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob))) {
        response.status(400).json({ message: "First name, last name, and class are required. Date of birth must be valid when provided." });
        return;
    }

    const dashboardData = await getStaffDashboardData(target);
    const storedRoster = Array.isArray(dashboardData.roster) ? dashboardData.roster as Record<string, unknown>[] : [];
    const roster = target.user_metadata.username === "pss5" && storedRoster.length === 0 ? boazRoster : storedRoster;
    const existing = requestedId ? roster.find((student) => student.id === requestedId) : undefined;
    const student = {
        ...(existing ?? {}),
        allergies,
        assignment: "Promise Summer School",
        className,
        cohort: className,
        dob,
        firstName,
        grade: className.match(/\d+/)?.[0] ?? (typeof existing?.grade === "string" ? existing.grade : "—"),
        id: existing?.id ?? `PSS-${randomUUID().slice(0, 8).toUpperCase()}`,
        lastName,
        name: `${firstName} ${lastName}`,
        specialNotes,
        status: existing?.status === "Waitlist" ? "Waitlist" : "Active",
    };
    const nextRoster = existing ? roster.map((item) => item.id === existing.id ? student : item) : [...roster, student];
    const nextDashboardData = { ...dashboardData, attendance: Array.isArray(dashboardData.attendance) ? dashboardData.attendance : [], roster: nextRoster };
    const saved = await saveStaffDashboardData(target.id, nextDashboardData);
    if (saved.error) {
        response.status(400).json({ message: saved.error });
        return;
    }
    response.json({ dashboardData: nextDashboardData, student });
});

staffRouter.delete("/roster/:accountId/:studentId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }

    const targetResult = await supabase.auth.admin.getUserById(request.params.accountId);
    const target = targetResult.data.user;
    if (targetResult.error || !target || getUserRole(target) !== "staff") {
        response.status(404).json({ message: "Staff account was not found." });
        return;
    }

    const dashboardData = await getStaffDashboardData(target);
    const storedRoster = Array.isArray(dashboardData.roster) ? dashboardData.roster as Record<string, unknown>[] : [];
    const roster = target.user_metadata.username === "pss5" && storedRoster.length === 0 ? boazRoster : storedRoster;
    const student = roster.find((item) => item.id === request.params.studentId);
    if (!student) {
        response.status(404).json({ message: "Student was not found on this roster." });
        return;
    }

    const attendanceRecords = dashboardData.attendanceRecords && typeof dashboardData.attendanceRecords === "object" && !Array.isArray(dashboardData.attendanceRecords)
        ? Object.fromEntries(Object.entries(dashboardData.attendanceRecords as Record<string, unknown>).map(([date, record]) => {
            if (!record || typeof record !== "object" || Array.isArray(record)) return [date, record];
            const nextRecord = { ...(record as Record<string, unknown>) };
            delete nextRecord[request.params.studentId];
            return [date, nextRecord];
        }))
        : dashboardData.attendanceRecords;
    const swimmingRecords = dashboardData.swimmingRecords && typeof dashboardData.swimmingRecords === "object" && !Array.isArray(dashboardData.swimmingRecords)
        ? { ...(dashboardData.swimmingRecords as Record<string, unknown>) }
        : {};
    delete swimmingRecords[request.params.studentId];
    const nextDashboardData = {
        ...dashboardData,
        attendanceRecords,
        roster: roster.filter((item) => item.id !== request.params.studentId),
        swimmingRecords,
    };
    const saved = await saveStaffDashboardData(target.id, nextDashboardData);
    if (saved.error) {
        response.status(400).json({ message: saved.error });
        return;
    }
    response.json({ dashboardData: nextDashboardData });
});

staffRouter.get("/google-sheets", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }

    const adminUrl = typeof admin.user.app_metadata[sheetsWebhookMetadataKey] === "string"
        ? admin.user.app_metadata[sheetsWebhookMetadataKey].trim()
        : "";
    const webhookUrl = adminUrl || env.googleSheetsAttendanceWebhookUrl;
    response.json({ configured: Boolean(webhookUrl), source: adminUrl ? "admin" : env.googleSheetsAttendanceWebhookUrl ? "environment" : "none", webhookUrl });
});

staffRouter.put("/google-sheets", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }

    const webhookUrl = typeof request.body?.webhookUrl === "string" ? request.body.webhookUrl.trim() : "";
    if (webhookUrl && !validWebhookUrl(webhookUrl)) {
        response.status(400).json({ message: "Enter a valid HTTPS Google Apps Script web app URL." });
        return;
    }

    const updated = await supabase.auth.admin.updateUserById(admin.user.id, {
        app_metadata: { ...admin.user.app_metadata, [sheetsWebhookMetadataKey]: webhookUrl },
    });
    if (updated.error) {
        response.status(400).json({ message: updated.error.message });
        return;
    }

    const effectiveUrl = webhookUrl || env.googleSheetsAttendanceWebhookUrl;
    response.json({ configured: Boolean(effectiveUrl), source: webhookUrl ? "admin" : env.googleSheetsAttendanceWebhookUrl ? "environment" : "none", webhookUrl: effectiveUrl });
});

staffRouter.post("/google-sheets/sync", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }

    const webhookUrl = await getSheetsWebhookUrl();
    if (!webhookUrl) {
        response.status(400).json({ message: "Connect a Google Sheets webhook before syncing." });
        return;
    }

    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) {
        response.status(400).json({ message: listed.error.message });
        return;
    }

    const rows: Record<string, unknown>[] = [];
    const staffUsers = listed.data.users.filter((candidate) => getUserRole(candidate) === "staff");
    const dashboards = await getStaffDashboardDataMap(staffUsers);
    for (const account of staffUsers) {
        const dashboardData = dashboards.get(account.id) ?? {};
        const roster = Array.isArray(dashboardData.roster) ? dashboardData.roster as Record<string, unknown>[] : [];
        const records = dashboardData.attendanceRecords;
        if (!records || typeof records !== "object" || Array.isArray(records)) continue;
        for (const [date, rawStatuses] of Object.entries(records as Record<string, unknown>)) {
            if (!rawStatuses || typeof rawStatuses !== "object" || Array.isArray(rawStatuses)) continue;
            for (const [studentId, status] of Object.entries(rawStatuses as Record<string, unknown>)) {
                if (status === "Unmarked") continue;
                const student = roster.find((item) => item.id === studentId);
                rows.push({
                    date,
                    staffId: account.id,
                    staffName: account.user_metadata.full_name ?? account.user_metadata.username ?? "Staff",
                    username: account.user_metadata.username ?? account.email?.split("@")[0] ?? "staff",
                    studentId,
                    studentName: student?.name ?? studentId,
                    status,
                });
            }
        }
    }

    try {
        const synced = await fetchWithTimeout(webhookUrl, {
            body: JSON.stringify({ event: "attendance.bulk_sync", generatedAt: new Date().toISOString(), rows }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        if (!synced.ok) {
            response.status(502).json({ message: `Google Sheets returned HTTP ${synced.status}. Check the Apps Script deployment.` });
            return;
        }
        response.json({ rowCount: rows.length, synced: true });
    } catch {
        response.status(502).json({ message: "Could not reach the Google Sheets webhook." });
    }
});

staffRouter.put("/dismissal", async (request, response) => {
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
        response.status(400).json({ message: "Dismissal can only be saved to a staff account." });
        return;
    }

    const studentId = typeof request.body?.studentId === "string" ? request.body.studentId : "";
    const date = request.body?.date;
    const pickedUpEarly = request.body?.pickedUpEarly;
    const pickupTime = request.body?.pickupTime;
    const vanRide = request.body?.vanRide;
    if (!studentId || (vanRide !== undefined && vanRide !== "none" && vanRide !== "2pm" && vanRide !== "5pm")) {
        response.status(400).json({ message: "A student and valid van time are required." });
        return;
    }
    if (pickedUpEarly !== undefined && (typeof pickedUpEarly !== "boolean" || !isDate(date))) {
        response.status(400).json({ message: "A valid date is required when updating early pickup." });
        return;
    }
    if (pickedUpEarly === true && !isTime(pickupTime)) {
        response.status(400).json({ message: "Enter a valid pickup time before marking early pickup." });
        return;
    }
    if (role === "staff" && isDate(date) && date > currentEasternDate()) {
        response.status(400).json({ message: "Staff cannot record an early pickup for a future date." });
        return;
    }

    const dashboardData = await getStaffDashboardData(target);
    const roster: Record<string, unknown>[] = Array.isArray(dashboardData.roster)
        ? dashboardData.roster as Record<string, unknown>[]
        : target.user_metadata.username === "pss5" ? boazRoster as Record<string, unknown>[] : [];
    if (!roster.some((student) => student.id === studentId)) {
        response.status(404).json({ message: "Student was not found on this roster." });
        return;
    }
    const nextRoster = roster.map((student) => {
        if (student.id !== studentId) return student;
        const storedDates = Array.isArray(student.earlyPickupDates)
            ? student.earlyPickupDates.filter((value): value is string => isDate(value))
            : [];
        const dates = new Set(storedDates);
        const earlyPickupTimes = student.earlyPickupTimes && typeof student.earlyPickupTimes === "object" && !Array.isArray(student.earlyPickupTimes)
            ? Object.fromEntries(Object.entries(student.earlyPickupTimes as Record<string, unknown>).filter(([storedDate, time]) => isDate(storedDate) && isTime(time)))
            : {};
        if (pickedUpEarly === true) dates.add(date as string);
        if (pickedUpEarly === true) earlyPickupTimes[date as string] = pickupTime as string;
        if (pickedUpEarly === false) {
            dates.delete(date as string);
            delete earlyPickupTimes[date as string];
        }
        return {
            ...student,
            earlyPickupDates: [...dates].sort(),
            earlyPickupTimes,
            vanRide: vanRide ?? (student.vanRide === "2pm" || student.vanRide === "5pm" ? student.vanRide : "none"),
        };
    });
    const nextDashboardData = { ...dashboardData, roster: nextRoster };
    const saved = await saveStaffDashboardData(target.id, nextDashboardData);
    if (saved.error) {
        response.status(400).json({ message: saved.error });
        return;
    }
    response.json({ dashboardData: nextDashboardData });
});

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
    if (role === "staff" && date > currentEasternDate()) {
        response.status(400).json({ message: "Staff cannot edit attendance for a future date." });
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

    const dashboardData = await getStaffDashboardData(target);
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

    const saved = await saveStaffAttendanceRecord(target.id, date, statuses, nextDashboardData);
    if (saved.error) {
        response.status(400).json({ message: saved.error });
        return;
    }

    const roster = Array.isArray(nextDashboardData.roster) ? nextDashboardData.roster as Record<string, unknown>[] : [];
    const attendanceComplete = roster.length > 0 && roster.every((student) => {
        const studentId = typeof student.id === "string" ? student.id : "";
        const status = statuses[studentId];
        return status === "Present" || status === "Late" || status === "Absent";
    });
    let completedTask: Record<string, unknown> | null = null;
    if (attendanceComplete) {
        const taskStore = await getGlobalStoreAdmin();
        if (!taskStore.error && taskStore.user) {
            const tasks = readTasks(taskStore.user);
            const existingTask = tasks.find((task) => task.assignedToId === target.id && task.title === "Submit attendance" && task.dueDate === date);
            const taskRecord: Record<string, unknown> = {
                ...(existingTask ?? {
                    assignedToId: target.id,
                    assignedToName: target.user_metadata.full_name ?? target.user_metadata.username ?? "Staff",
                    createdAt: new Date().toISOString(),
                    description: "Complete and submit today’s student attendance.",
                    dueDate: date,
                    id: randomUUID(),
                    title: "Submit attendance",
                }),
                completedAt: new Date().toISOString(),
                status: "completed",
            };
            completedTask = taskRecord;
            const nextTasks = existingTask
                ? tasks.map((task) => task.id === existingTask.id ? taskRecord : task)
                : [...tasks, taskRecord];
            const taskSaved = await supabase.auth.admin.updateUserById(taskStore.user.id, {
                app_metadata: { ...taskStore.user.app_metadata, [tasksMetadataKey]: nextTasks },
            });
            if (taskSaved.error) completedTask = null;
        }
    }

    let sheetsSynced = false;
    const sheetsWebhookUrl = await getSheetsWebhookUrl();
    if (sheetsWebhookUrl) {
        try {
            const rows = Object.entries(statuses).filter(([, status]) => status !== "Unmarked").map(([studentId, status]) => ({
                date,
                staffId: target.id,
                staffName: target.user_metadata.full_name ?? target.user_metadata.username ?? "Staff",
                username: target.user_metadata.username,
                studentId,
                studentName: roster.find((student) => student.id === studentId)?.name ?? studentId,
                status,
            }));
            const webhookResponse = await fetchWithTimeout(sheetsWebhookUrl, {
                body: JSON.stringify({ event: "attendance.saved", rows }),
                headers: { "Content-Type": "application/json" },
                method: "POST",
            });
            sheetsSynced = webhookResponse.ok;
        } catch {
            sheetsSynced = false;
        }
    }

    const existingUpdatedAt = dashboardData.attendanceUpdatedAt && typeof dashboardData.attendanceUpdatedAt === "object" && !Array.isArray(dashboardData.attendanceUpdatedAt)
        ? dashboardData.attendanceUpdatedAt as Record<string, unknown>
        : {};
    response.json({
        completedTask,
        dashboardData: {
            ...nextDashboardData,
            attendanceUpdatedAt: { ...existingUpdatedAt, [date]: saved.updatedAt },
        },
        sheetsSynced,
    });
});
