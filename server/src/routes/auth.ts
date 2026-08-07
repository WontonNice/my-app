import { Router } from "express";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getAuthenticatedUser, getUserRole } from "../lib/auth";
import { getStaffDashboardData, getStaffDashboardDataMap, saveStaffDashboardData, type StaffDashboardRecord } from "../lib/staffDashboardStore";
import { supabase } from "../lib/supabase";

type RegisterStudentBody = {
    fullName?: unknown;
    password?: unknown;
    username?: unknown;
};

type AssignStaffBody = {
    fullName?: unknown;
    password?: unknown;
    username?: unknown;
};

type UpdateStudentBody = {
    fullName?: unknown;
    password?: unknown;
    username?: unknown;
};

const studentUsernamePattern = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const studentEmailDomain = "students.nathantutors.local";
const staffUsernamePattern = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const staffEmailDomain = "staff.nathantutors.local";
const staffPasswordMetadataKey = "staff_access_password_cipher";
const allowedAttendanceStatuses = new Set(["Absent", "Late", "Present", "Unmarked"]);
const boazRoster: Record<string, unknown>[] = ["Chloe Tong", "Harrison Cheng", "Kaitlyn Lim", "Dylan Cui", "Anabelle Liang", "Joanna Zhao", "Jun Kang"].map(
    (name, index) => ({
        assignment: "Promise Summer School",
        cohort: "Boaz Lim",
        grade: String(6 + (index % 3)),
        id: `PSS-5${String(index + 1).padStart(2, "0")}`,
        name,
        points: 0,
        status: "Active",
    }),
);

function getStaffPasswordKey() {
    return createHash("sha256").update(process.env.SUPABASE_SERVICE_ROLE ?? "").digest();
}

function encryptStaffPassword(password: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", getStaffPasswordKey(), iv);
    const encrypted = Buffer.concat([cipher.update(password, "utf8"), cipher.final()]);
    return `v1:${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted.toString("hex")}`;
}

function decryptStaffPassword(value: unknown) {
    if (typeof value !== "string") return null;
    const [version, ivHex, tagHex, encryptedHex] = value.split(":");
    if (version !== "v1" || !ivHex || !tagHex || !encryptedHex) return null;
    try {
        const decipher = createDecipheriv("aes-256-gcm", getStaffPasswordKey(), Buffer.from(ivHex, "hex"));
        decipher.setAuthTag(Buffer.from(tagHex, "hex"));
        return Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]).toString("utf8");
    } catch {
        return null;
    }
}

function normalizeRegisterBody(body: RegisterStudentBody) {
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";

    return { fullName, password, username };
}

export const authRouter = Router();

function normalizeStaffBody(body: AssignStaffBody) {
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";

    return { fullName, password, username };
}

function normalizeStudentAccountBody(body: UpdateStudentBody) {
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";

    return { fullName, password, username };
}

function getStaffEmail(username: string) {
    return `${username}@${staffEmailDomain}`;
}

function getStudentEmail(username: string) {
    return username.includes("@") ? username : `${username}@${studentEmailDomain}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isDate(value: unknown): value is string {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTime(value: unknown): value is string {
    return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function readString(value: unknown, fallback = "") {
    return typeof value === "string" ? value : fallback;
}

function normalizeAttendance(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.filter(isRecord).map((item) => ({
        group: readString(item.group),
        name: readString(item.name, "Student"),
        status: item.status === "Absent" || item.status === "Late" || item.status === "Present" ? item.status : "Present",
        time: readString(item.time),
    }));
}

function normalizeAttendanceRecords(value: unknown) {
    if (!isRecord(value)) return {};

    return Object.fromEntries(
        Object.entries(value).filter(([date, record]) => isDate(date) && isRecord(record)).map(([date, record]) => [
            date,
            Object.fromEntries(
                Object.entries(record as Record<string, unknown>).filter(
                    ([studentId, status]) => typeof studentId === "string" && typeof status === "string" && allowedAttendanceStatuses.has(status),
                ),
            ),
        ]),
    );
}

function normalizeClasses(value: unknown) {
    return Array.isArray(value)
        ? Array.from(new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)))
        : [];
}

function normalizeSwimmingRecords(value: unknown) {
    if (!isRecord(value)) return {};

    return Object.fromEntries(
        Object.entries(value).filter(([, status]) => isRecord(status)).map(([studentId, value]) => {
            const status = value as Record<string, unknown>;
            return [
                studentId,
                {
                    paidFee: status.paidFee === true,
                    waiverComplete: status.waiverComplete === true,
                },
            ];
        }),
    );
}

function normalizeRoster(value: unknown, username: string) {
    const rawRoster = Array.isArray(value) ? value.filter(isRecord) : [];
    const roster = username === "pss5" && rawRoster.length === 0 ? boazRoster : rawRoster;

    return roster.map((student, index) => {
        const firstName = readString(student.firstName);
        const lastName = readString(student.lastName);
        const fallbackName = [firstName, lastName].filter(Boolean).join(" ");
        const className = readString(student.className);
        const grade = readString(student.grade, className.match(/\d+/)?.[0] ?? "");
        const earlyPickupDates = Array.isArray(student.earlyPickupDates)
            ? student.earlyPickupDates.filter(isDate)
            : [];
        const earlyPickupTimes = isRecord(student.earlyPickupTimes)
            ? Object.fromEntries(Object.entries(student.earlyPickupTimes).filter(([date, time]) => isDate(date) && isTime(time)))
            : {};
        const vanRide = student.vanRide === "5pm" ? student.vanRide : "none";

        return {
            allergies: readString(student.allergies),
            assignment: readString(student.assignment, "Promise Summer School"),
            className,
            cohort: readString(student.cohort, className || "Promise Summer School"),
            dob: isDate(student.dob) ? student.dob : "",
            earlyPickupDates,
            earlyPickupTimes,
            firstName,
            grade,
            id: readString(student.id, `student-${index + 1}`),
            lastName,
            name: readString(student.name, fallbackName || `Student ${index + 1}`),
            points: typeof student.points === "number" && Number.isFinite(student.points) ? Math.max(0, Math.round(student.points)) : 0,
            specialNotes: readString(student.specialNotes),
            status: student.status === "Waitlist" ? "Waitlist" : "Active",
            squidNumber: typeof student.squidNumber === "number" && Number.isInteger(student.squidNumber) && student.squidNumber >= 1 && student.squidNumber <= 456 ? student.squidNumber : undefined,
            vanRide,
        };
    });
}

function normalizeDashboardData(value: unknown, username: string) {
    const rawDashboardData = isRecord(value) ? value : {};

    return {
        ...rawDashboardData,
        attendance: normalizeAttendance(rawDashboardData.attendance),
        attendanceRecords: normalizeAttendanceRecords(rawDashboardData.attendanceRecords),
        classes: normalizeClasses(rawDashboardData.classes),
        roster: normalizeRoster(rawDashboardData.roster, username),
        swimmingRecords: normalizeSwimmingRecords(rawDashboardData.swimmingRecords),
    };
}

async function requireAdmin(authorizationHeader: string | undefined) {
    const authenticatedUser = await getAuthenticatedUser(authorizationHeader);

    if (authenticatedUser.error || !authenticatedUser.user) {
        return { error: authenticatedUser.error ?? "Log in to continue.", user: null };
    }

    if (getUserRole(authenticatedUser.user) !== "admin") {
        return { error: "Administrator access is required.", user: null };
    }

    return { error: null, user: authenticatedUser.user };
}

async function requireTeacherOrAdmin(authorizationHeader: string | undefined) {
    const authenticatedUser = await getAuthenticatedUser(authorizationHeader);

    if (authenticatedUser.error || !authenticatedUser.user) {
        return { error: authenticatedUser.error ?? "Log in to continue.", status: 401, user: null };
    }

    const role = getUserRole(authenticatedUser.user);
    if (role !== "teacher" && role !== "admin") {
        return { error: "Teacher access is required.", status: 403, user: null };
    }

    return { error: null, status: 200, user: authenticatedUser.user };
}

function toStaffAccount(user: {
    app_metadata: Record<string, unknown>;
    created_at: string;
    email?: string;
    id: string;
    user_metadata: Record<string, unknown>;
}, dashboardData: StaffDashboardRecord) {
    const fallbackUsername = user.email?.split("@")[0] ?? "staff";
    const username = typeof user.user_metadata.username === "string" ? user.user_metadata.username : fallbackUsername;

    return {
        accessPassword: decryptStaffPassword(user.app_metadata[staffPasswordMetadataKey]),
        createdAt: user.created_at,
        dashboardData: normalizeDashboardData(dashboardData, username),
        fullName: typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : fallbackUsername,
        id: user.id,
        username,
    };
}

function toStudentAccount(user: {
    email?: string;
    id: string;
    user_metadata: Record<string, unknown>;
}) {
    const fallbackUsername = user.email?.split("@")[0] ?? "student";
    const username = typeof user.user_metadata.username === "string" ? user.user_metadata.username : fallbackUsername;

    return {
        email: user.email ?? "",
        fullName: typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : fallbackUsername,
        id: user.id,
        username,
    };
}

authRouter.post("/register", async (request, response) => {
    const { fullName, password, username } = normalizeRegisterBody(request.body);

    if (!fullName) {
        response.status(400).json({ message: "Full name is required." });
        return;
    }

    const usesEmail = username.includes("@");
    if ((usesEmail && !emailPattern.test(username)) || (!usesEmail && !studentUsernamePattern.test(username))) {
        response.status(400).json({ message: "Enter a valid email or a 3–32 character username using letters, numbers, dots, dashes, or underscores." });
        return;
    }

    if (password.length < 6) {
        response.status(400).json({ message: "Password must be at least 6 characters." });
        return;
    }

    const email = usesEmail ? username : `${username}@${studentEmailDomain}`;
    const { error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: fullName,
            role: "student",
            username: usesEmail ? username.split("@")[0] : username,
        },
    });

    if (error) {
        const isDuplicateUser = error.message.toLowerCase().includes("already");

        response.status(isDuplicateUser ? 409 : 400).json({
            message: isDuplicateUser
                ? `That ${usesEmail ? "email" : "username"} is already registered. Try logging in instead.`
                : error.message,
        });
        return;
    }

    response.status(201).json({ loginEmail: email, message: "Student account created." });
});

authRouter.patch("/students/:userId", async (request, response) => {
    const teacher = await requireTeacherOrAdmin(request.headers.authorization);
    if (teacher.error) {
        response.status(teacher.status).json({ message: teacher.error });
        return;
    }

    const { fullName, password, username } = normalizeStudentAccountBody(request.body);
    const usesEmail = username.includes("@");
    if ((usesEmail && !emailPattern.test(username)) || (!usesEmail && !studentUsernamePattern.test(username))) {
        response.status(400).json({ message: "Enter a valid email or a 3-32 character username using letters, numbers, dots, dashes, or underscores." });
        return;
    }

    if (!fullName) {
        response.status(400).json({ message: "Full name is required." });
        return;
    }

    if (password && password.length < 6) {
        response.status(400).json({ message: "A new password must be at least 6 characters." });
        return;
    }

    const targetResult = await supabase.auth.admin.getUserById(request.params.userId);
    const target = targetResult.data.user;
    if (targetResult.error || !target || getUserRole(target) !== "student") {
        response.status(404).json({ message: "Student account was not found." });
        return;
    }

    const email = getStudentEmail(username);
    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) {
        response.status(400).json({ message: listed.error.message });
        return;
    }

    const conflict = listed.data.users.find((user) => user.id !== target.id && user.email?.toLowerCase() === email);
    if (conflict) {
        response.status(409).json({ message: "That student username is already in use." });
        return;
    }

    const updated = await supabase.auth.admin.updateUserById(target.id, {
        app_metadata: {
            ...target.app_metadata,
            role: "student",
        },
        email,
        email_confirm: true,
        ...(password ? { password } : {}),
        user_metadata: {
            ...target.user_metadata,
            full_name: fullName,
            role: "student",
            username: usesEmail ? username.split("@")[0] : username,
        },
    });

    if (updated.error || !updated.data.user) {
        response.status(400).json({ message: updated.error?.message ?? "Could not update the student account." });
        return;
    }

    response.json({ student: toStudentAccount(updated.data.user) });
});

authRouter.delete("/students/:userId", async (request, response) => {
    const teacher = await requireTeacherOrAdmin(request.headers.authorization);
    if (teacher.error) {
        response.status(teacher.status).json({ message: teacher.error });
        return;
    }

    const targetResult = await supabase.auth.admin.getUserById(request.params.userId);
    const target = targetResult.data.user;
    if (targetResult.error || !target || getUserRole(target) !== "student") {
        response.status(404).json({ message: "Student account was not found." });
        return;
    }

    const [examDelete, practiceDelete] = await Promise.all([
        supabase.from("student_exam_results").delete().eq("user_id", target.id),
        supabase.from("student_practice_progress").delete().eq("user_id", target.id),
    ]);

    if (examDelete.error || practiceDelete.error) {
        response.status(400).json({ message: examDelete.error?.message ?? practiceDelete.error?.message ?? "Could not remove student progress." });
        return;
    }

    const deleted = await supabase.auth.admin.deleteUser(target.id);
    if (deleted.error) {
        response.status(400).json({ message: deleted.error.message });
        return;
    }

    response.sendStatus(204);
});

authRouter.get("/staff", async (request, response) => {
    const teacher = await requireAdmin(request.headers.authorization);

    if (teacher.error) {
        response.status(teacher.error === "Administrator access is required." ? 403 : 401).json({ message: teacher.error });
        return;
    }

    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (error) {
        response.status(400).json({ message: error.message });
        return;
    }

    const staffUsers = data.users.filter((user) => (user.app_metadata.role ?? user.user_metadata.role) === "staff");
    const dashboardData = await getStaffDashboardDataMap(staffUsers);
    const staff = staffUsers
        .map((user) => toStaffAccount(user, dashboardData.get(user.id) ?? {}))
        .sort((first, second) => first.fullName.localeCompare(second.fullName));

    response.json({ staff });
});

authRouter.post("/staff", async (request, response) => {
    const teacher = await requireAdmin(request.headers.authorization);

    if (teacher.error) {
        response.status(teacher.error === "Administrator access is required." ? 403 : 401).json({ message: teacher.error });
        return;
    }

    const { fullName, password, username } = normalizeStaffBody(request.body);

    if (!staffUsernamePattern.test(username)) {
        response.status(400).json({ message: "Username must be 3–32 characters using lowercase letters, numbers, dots, dashes, or underscores." });
        return;
    }

    if (!fullName) {
        response.status(400).json({ message: "Full name is required." });
        return;
    }

    if (password.length < 6) {
        response.status(400).json({ message: "Password must be at least 6 characters." });
        return;
    }

    const email = getStaffEmail(username);
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (listError) {
        response.status(400).json({ message: listError.message });
        return;
    }

    const existingUser = usersData.users.find((user) => user.email?.toLowerCase() === email);
    const dashboardData = existingUser ? await getStaffDashboardData(existingUser) : { attendance: [], roster: [] };
    if (existingUser) {
        const migrated = await saveStaffDashboardData(existingUser.id, dashboardData);
        if (migrated.error) {
            response.status(400).json({ message: `Could not migrate the existing staff dashboard: ${migrated.error}` });
            return;
        }
    }
    const userMetadata: Record<string, unknown> = {
        ...(existingUser?.user_metadata ?? {}),
        full_name: fullName,
        role: "staff",
        username,
    };
    delete userMetadata.dashboard_data;
    const attributes = {
        app_metadata: {
            ...(existingUser?.app_metadata ?? {}),
            role: "staff",
            [staffPasswordMetadataKey]: encryptStaffPassword(password),
        },
        email_confirm: true,
        password,
        user_metadata: userMetadata,
    };

    const result = existingUser
        ? await supabase.auth.admin.updateUserById(existingUser.id, attributes)
        : await supabase.auth.admin.createUser({ email, ...attributes });

    if (result.error || !result.data.user) {
        response.status(400).json({ message: result.error?.message ?? "Could not save the staff account." });
        return;
    }

    if (!existingUser) {
        const initialized = await saveStaffDashboardData(result.data.user.id, dashboardData);
        if (initialized.error) {
            response.status(400).json({ message: `The staff account was created, but its dashboard could not be initialized: ${initialized.error}` });
            return;
        }
    }

    response.status(existingUser ? 200 : 201).json({ staffAccount: toStaffAccount(result.data.user, dashboardData) });
});

authRouter.patch("/staff/:userId", async (request, response) => {
    const administrator = await requireAdmin(request.headers.authorization);

    if (administrator.error) {
        response.status(administrator.error === "Administrator access is required." ? 403 : 401).json({ message: administrator.error });
        return;
    }

    const { fullName, password, username } = normalizeStaffBody(request.body);

    if (!staffUsernamePattern.test(username)) {
        response.status(400).json({ message: "Username must be 3–32 characters using lowercase letters, numbers, dots, dashes, or underscores." });
        return;
    }

    if (!fullName) {
        response.status(400).json({ message: "Full name is required." });
        return;
    }

    if (password && password.length < 6) {
        response.status(400).json({ message: "A new password must be at least 6 characters." });
        return;
    }

    const { data: targetData, error: targetError } = await supabase.auth.admin.getUserById(request.params.userId);
    if (targetError || !targetData.user) {
        response.status(404).json({ message: "Staff account was not found." });
        return;
    }

    const target = targetData.user;
    if ((target.app_metadata.role ?? target.user_metadata.role) !== "staff") {
        response.status(400).json({ message: "Only staff accounts can be edited here." });
        return;
    }

    const dashboardData = await getStaffDashboardData(target);
    const migrated = await saveStaffDashboardData(target.id, dashboardData);
    if (migrated.error) {
        response.status(400).json({ message: `Could not migrate the staff dashboard: ${migrated.error}` });
        return;
    }

    const email = getStaffEmail(username);
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) {
        response.status(400).json({ message: listError.message });
        return;
    }

    const conflict = usersData.users.find((user) => user.id !== target.id && user.email?.toLowerCase() === email);
    if (conflict) {
        response.status(409).json({ message: "That username is already in use." });
        return;
    }

    const userMetadata: Record<string, unknown> = {
        ...target.user_metadata,
        full_name: fullName,
        role: "staff",
        username,
    };
    delete userMetadata.dashboard_data;
    const updated = await supabase.auth.admin.updateUserById(target.id, {
        app_metadata: {
            ...target.app_metadata,
            role: "staff",
            ...(password ? { [staffPasswordMetadataKey]: encryptStaffPassword(password) } : {}),
        },
        email,
        email_confirm: true,
        ...(password ? { password } : {}),
        user_metadata: userMetadata,
    });

    if (updated.error || !updated.data.user) {
        response.status(400).json({ message: updated.error?.message ?? "Could not update the staff account." });
        return;
    }

    response.json({ staffAccount: toStaffAccount(updated.data.user, dashboardData) });
});
