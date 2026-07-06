import { Router } from "express";
import { randomUUID } from "node:crypto";
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

const sheetsWebhookMetadataKey = "google_sheets_attendance_webhook_url";
const bookingMetadataKey = "room_booking_requests";
const roomsMetadataKey = "campus_rooms";
const tasksMetadataKey = "staff_tasks";

const basementCampusRooms = [
    { capacity: 20, floor: 0, id: "ll-1", name: "Room LL1" }, { capacity: 20, floor: 0, id: "ll-2", name: "Room LL2" }, { capacity: 48, floor: 0, id: "ll-multipurpose", name: "Lower Level Multipurpose" }, { capacity: 36, floor: 0, id: "ll-commons", name: "Lower Level Commons" },
];

const defaultCampusRooms = [
    ...basementCampusRooms,
    { capacity: 24, floor: 1, id: "101", name: "Room 101" }, { capacity: 24, floor: 1, id: "102", name: "Room 102" }, { capacity: 80, floor: 1, id: "commons", name: "Student Commons" }, { capacity: 16, floor: 1, id: "conf-a", name: "Conference A" },
    { capacity: 28, floor: 2, id: "201", name: "Room 201" }, { capacity: 28, floor: 2, id: "202", name: "Room 202" }, { capacity: 28, floor: 2, id: "203", name: "Room 203" }, { capacity: 30, floor: 2, id: "lab", name: "Testing Lab" },
    { capacity: 22, floor: 3, id: "301", name: "Room 301" }, { capacity: 22, floor: 3, id: "302", name: "Room 302" }, { capacity: 40, floor: 3, id: "studio", name: "Activity Studio" }, { capacity: 36, floor: 3, id: "library", name: "Library" },
];

const defaultWeekdaySchedule = [
    { endTime: "09:15", id: "morning-arrival", place: "Student Commons", startTime: "08:30", studentIds: [], title: "Arrival and breakfast", weekdays: [1, 2, 3, 4, 5] },
    { endTime: "11:30", id: "academic-block", place: "Assigned classroom", startTime: "09:30", studentIds: [], title: "Student learning block", weekdays: [1, 2, 3, 4, 5] },
    { endTime: "13:00", id: "lunch-recreation", place: "Commons and activity areas", startTime: "11:45", studentIds: [], title: "Lunch and recreation", weekdays: [1, 2, 3, 4, 5] },
    { endTime: "15:15", id: "afternoon-program", place: "Assigned classroom", startTime: "13:15", studentIds: [], title: "Afternoon student program", weekdays: [1, 2, 3, 4, 5] },
];

function readDashboardData(user: { user_metadata: Record<string, unknown> }) {
    const value = user.user_metadata.dashboard_data;
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function readSchedule(user: { user_metadata: Record<string, unknown> }) {
    const schedule = readDashboardData(user).schedule;
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

async function getBookingStoreAdmin() {
    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) return { error: listed.error.message, user: null };
    const user = listed.data.users.find((candidate) => getUserRole(candidate) === "admin") ?? null;
    return { error: user ? null : "No administrator account is available.", user };
}

function readBookings(user: { app_metadata: Record<string, unknown> }) {
    const bookings = user.app_metadata[bookingMetadataKey];
    return Array.isArray(bookings) ? bookings as Record<string, unknown>[] : [];
}

function readRooms(user: { app_metadata: Record<string, unknown> }) {
    const rooms = user.app_metadata[roomsMetadataKey];
    if (!Array.isArray(rooms)) return defaultCampusRooms;
    return rooms.some((room) => Number(room?.floor) === 0) ? rooms as Record<string, unknown>[] : [...basementCampusRooms, ...rooms];
}

function readTasks(user: { app_metadata: Record<string, unknown> }) {
    const tasks = user.app_metadata[tasksMetadataKey];
    return Array.isArray(tasks) ? tasks as Record<string, unknown>[] : [];
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
    const store = await getBookingStoreAdmin();
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
    const targetResult = await supabase.auth.admin.getUserById(assignedToId);
    const target = targetResult.data.user;
    if (!title || !description || !isDate(dueDate) || targetResult.error || !target || getUserRole(target) !== "staff") {
        response.status(400).json({ message: "Choose a staff member and provide a title, description, and due date." });
        return;
    }
    const store = await getBookingStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const task = {
        assignedToId,
        assignedToName: target.user_metadata.full_name ?? target.user_metadata.username ?? "Staff",
        createdAt: new Date().toISOString(), description, dueDate, id: randomUUID(), status: "open", title,
    };
    const tasks = [...readTasks(store.user), task];
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [tasksMetadataKey]: tasks },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.status(201).json({ task });
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
    const store = await getBookingStoreAdmin();
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
    const store = await getBookingStoreAdmin();
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

staffRouter.get("/rooms", async (request, response) => {
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
    const store = await getBookingStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    response.json({ rooms: readRooms(store.user) });
});

staffRouter.put("/rooms", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const rawRooms = request.body?.rooms;
    if (!Array.isArray(rawRooms) || !rawRooms.length || rawRooms.length > 60) {
        response.status(400).json({ message: "Provide at least one valid room." });
        return;
    }
    const rooms = rawRooms.map((room) => ({
        capacity: Number(room?.capacity),
        floor: Number(room?.floor),
        id: typeof room?.id === "string" ? room.id.trim() : "",
        name: typeof room?.name === "string" ? room.name.trim() : "",
    }));
    if (rooms.some((room) => !room.id || !room.name || !Number.isInteger(room.floor) || room.floor < 0 || room.floor > 20 || !Number.isInteger(room.capacity) || room.capacity < 1 || room.capacity > 1000) || new Set(rooms.map((room) => room.id)).size !== rooms.length) {
        response.status(400).json({ message: "Every room needs a unique ID, name, floor, and valid seat count." });
        return;
    }
    const store = await getBookingStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const roomById = new Map(rooms.map((room) => [room.id, room]));
    const bookings = readBookings(store.user).map((booking) => {
        const room = roomById.get(String(booking.roomId));
        return room ? { ...booking, floor: room.floor, roomName: room.name } : booking;
    });
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [bookingMetadataKey]: bookings, [roomsMetadataKey]: rooms },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.json({ rooms });
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
    const schedules = listed.data.users.filter((user) => getUserRole(user) === "staff").map((user) => ({
        accountId: user.id,
        fullName: user.user_metadata.full_name ?? user.user_metadata.username ?? "Staff",
        schedule: readSchedule(user),
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
    const dashboardData = readDashboardData(target);
    const saved = await supabase.auth.admin.updateUserById(target.id, {
        user_metadata: { ...target.user_metadata, dashboard_data: { ...dashboardData, schedule } },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
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
    const dashboardData = readDashboardData(target);
    const nextDashboardData = { ...dashboardData, classes };
    const saved = await supabase.auth.admin.updateUserById(target.id, {
        user_metadata: { ...target.user_metadata, dashboard_data: nextDashboardData },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.json({ classes, dashboardData: nextDashboardData });
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

    const rawDashboardData = target.user_metadata.dashboard_data;
    const dashboardData = rawDashboardData && typeof rawDashboardData === "object" && !Array.isArray(rawDashboardData)
        ? rawDashboardData as Record<string, unknown>
        : {};
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
    const saved = await supabase.auth.admin.updateUserById(target.id, {
        user_metadata: { ...target.user_metadata, dashboard_data: nextDashboardData },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.json({ dashboardData: nextDashboardData, student });
});

staffRouter.get("/bookings", async (request, response) => {
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
    const store = await getBookingStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    response.json({ bookings: readBookings(store.user) });
});

staffRouter.post("/bookings", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "staff" && role !== "admin") {
        response.status(403).json({ message: "Staff or administrator access is required to book a room." });
        return;
    }
    const eventName = typeof request.body?.eventName === "string" ? request.body.eventName.trim() : "";
    const description = typeof request.body?.description === "string" ? request.body.description.trim() : "";
    const time = typeof request.body?.time === "string" ? request.body.time.trim() : "";
    const endTime = typeof request.body?.endTime === "string" ? request.body.endTime.trim() : "";
    const date = typeof request.body?.date === "string" ? request.body.date.trim() : "";
    const roomId = typeof request.body?.roomId === "string" ? request.body.roomId.trim() : "";
    const roomName = typeof request.body?.roomName === "string" ? request.body.roomName.trim() : "";
    const floor = Number(request.body?.floor);
    const weeklyRepeat = request.body?.weeklyRepeat === true;
    const repeatUntil = typeof request.body?.repeatUntil === "string" ? request.body.repeatUntil.trim() : "";
    if (!eventName || !description || !roomId || !roomName || !isDate(date) || !isTime(time) || !isTime(endTime) || time >= endTime || !Number.isInteger(floor) || floor < 0 || floor > 20) {
        response.status(400).json({ message: "Event name, date, valid time range, room, and description are required." });
        return;
    }
    if (weeklyRepeat && (role !== "admin" || !isDate(repeatUntil) || repeatUntil < date)) {
        response.status(400).json({ message: "Administrators must choose a valid ending date for weekly repeats." });
        return;
    }
    const store = await getBookingStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const existingBookings = readBookings(store.user);
    const requestedDates = weeklyRepeat ? weeklyDates(date, repeatUntil) : [date];
    const conflictingDate = requestedDates.find((requestedDate) => existingBookings.some((booking) => booking.status === "approved" && booking.roomId === roomId && booking.date === requestedDate && String(booking.time) < endTime && String(booking.endTime ?? booking.time) > time));
    if (conflictingDate) {
        response.status(409).json({ message: `That room is already booked during the selected time on ${conflictingDate}.` });
        return;
    }
    const recurrenceGroupId = weeklyRepeat ? randomUUID() : undefined;
    const createdBookings = requestedDates.map((bookingDate) => ({
        createdAt: new Date().toISOString(), date: bookingDate, description, endTime, eventName, floor, id: randomUUID(),
        recurrenceGroupId,
        requestedById: authenticated.user.id,
        requestedByName: authenticated.user.user_metadata.full_name ?? authenticated.user.user_metadata.username ?? "Staff",
        roomId, roomName, status: role === "admin" ? "approved" : "pending", time,
    }));
    const bookings = [...existingBookings, ...createdBookings];
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [bookingMetadataKey]: bookings },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.status(201).json({ booking: createdBookings[0], bookings: createdBookings });
});

staffRouter.patch("/bookings/:bookingId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const status = request.body?.status;
    if (status !== "approved" && status !== "rejected") {
        response.status(400).json({ message: "Choose approved or rejected." });
        return;
    }
    const store = await getBookingStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const bookings = readBookings(store.user);
    const current = bookings.find((booking) => booking.id === request.params.bookingId);
    if (!current) {
        response.status(404).json({ message: "Booking request was not found." });
        return;
    }
    if (status === "approved" && bookings.some((booking) => booking.id !== current.id && booking.status === "approved" && booking.roomId === current.roomId && booking.date === current.date && String(booking.time) < String(current.endTime ?? current.time) && String(booking.endTime ?? booking.time) > String(current.time))) {
        response.status(409).json({ message: "That room is already approved for the selected time." });
        return;
    }
    const booking = { ...current, status };
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [bookingMetadataKey]: bookings.map((item) => item.id === request.params.bookingId ? booking : item) },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.json({ booking });
});

staffRouter.put("/bookings/:bookingId", async (request, response) => {
    const admin = await requireAdmin(request.headers.authorization);
    if (admin.error || !admin.user) {
        response.status(admin.error === "Administrator access is required." ? 403 : 401).json({ message: admin.error });
        return;
    }
    const eventName = typeof request.body?.eventName === "string" ? request.body.eventName.trim() : "";
    const description = typeof request.body?.description === "string" ? request.body.description.trim() : "";
    const date = typeof request.body?.date === "string" ? request.body.date.trim() : "";
    const time = typeof request.body?.time === "string" ? request.body.time.trim() : "";
    const endTime = typeof request.body?.endTime === "string" ? request.body.endTime.trim() : "";
    const roomId = typeof request.body?.roomId === "string" ? request.body.roomId.trim() : "";
    const roomName = typeof request.body?.roomName === "string" ? request.body.roomName.trim() : "";
    const floor = Number(request.body?.floor);
    if (!eventName || !description || !roomId || !roomName || !isDate(date) || !isTime(time) || !isTime(endTime) || time >= endTime || !Number.isInteger(floor)) {
        response.status(400).json({ message: "Event, room, date, and a valid time range are required." });
        return;
    }
    const store = await getBookingStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const bookings = readBookings(store.user);
    const current = bookings.find((booking) => booking.id === request.params.bookingId);
    if (!current) {
        response.status(404).json({ message: "Booking was not found." });
        return;
    }
    if (bookings.some((booking) => booking.id !== current.id && booking.status === "approved" && booking.roomId === roomId && booking.date === date && String(booking.time) < endTime && String(booking.endTime ?? booking.time) > time)) {
        response.status(409).json({ message: "That room is already booked during the selected time." });
        return;
    }
    const booking = { ...current, date, description, endTime, eventName, floor, roomId, roomName, time };
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [bookingMetadataKey]: bookings.map((item) => item.id === current.id ? booking : item) },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.json({ booking });
});

staffRouter.delete("/bookings/:bookingId", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const store = await getBookingStoreAdmin();
    if (store.error || !store.user) {
        response.status(400).json({ message: store.error });
        return;
    }
    const bookings = readBookings(store.user);
    const booking = bookings.find((item) => item.id === request.params.bookingId);
    if (!booking) {
        response.status(404).json({ message: "Booking was not found." });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "admin" && booking.requestedById !== authenticated.user.id) {
        response.status(403).json({ message: "You can only remove your own room bookings." });
        return;
    }
    const saved = await supabase.auth.admin.updateUserById(store.user.id, {
        app_metadata: { ...store.user.app_metadata, [bookingMetadataKey]: bookings.filter((booking) => booking.id !== request.params.bookingId) },
    });
    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }
    response.status(204).send();
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
    for (const account of listed.data.users.filter((candidate) => getUserRole(candidate) === "staff")) {
        const data = account.user_metadata.dashboard_data;
        if (!data || typeof data !== "object" || Array.isArray(data)) continue;
        const dashboardData = data as Record<string, unknown>;
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
        const synced = await fetch(webhookUrl, {
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

    const roster = Array.isArray(nextDashboardData.roster) ? nextDashboardData.roster as Record<string, unknown>[] : [];
    const attendanceComplete = roster.length > 0 && roster.every((student) => {
        const studentId = typeof student.id === "string" ? student.id : "";
        const status = statuses[studentId];
        return status === "Present" || status === "Late" || status === "Absent";
    });
    let completedTask: Record<string, unknown> | null = null;
    if (attendanceComplete) {
        const taskStore = await getBookingStoreAdmin();
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
            const webhookResponse = await fetch(sheetsWebhookUrl, {
                body: JSON.stringify({ event: "attendance.saved", rows }),
                headers: { "Content-Type": "application/json" },
                method: "POST",
            });
            sheetsSynced = webhookResponse.ok;
        } catch {
            sheetsSynced = false;
        }
    }

    response.json({ completedTask, dashboardData: nextDashboardData, sheetsSynced });
});
