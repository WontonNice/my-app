import { Router } from "express";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getAuthenticatedUser, getUserRole } from "../lib/auth";
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

const studentUsernamePattern = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const studentEmailDomain = "students.nathantutors.local";
const staffUsernamePattern = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const staffEmailDomain = "staff.nathantutors.local";
const staffPasswordMetadataKey = "staff_access_password_cipher";

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

function getStaffEmail(username: string) {
    return `${username}@${staffEmailDomain}`;
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

function toStaffAccount(user: {
    app_metadata: Record<string, unknown>;
    created_at: string;
    email?: string;
    id: string;
    user_metadata: Record<string, unknown>;
}) {
    const fallbackUsername = user.email?.split("@")[0] ?? "staff";
    const dashboardData = user.user_metadata.dashboard_data;
    const boazRoster = ["Chloe Tong", "Harrison Cheng", "Kaitlyn Lim", "Dylan Cui", "Anabelle Liang", "Joanna Zhao", "Jun Kang"].map(
        (name, index) => ({ assignment: "Promise Summer School", cohort: "Boaz Lim", grade: String(6 + (index % 3)), id: `PSS-5${String(index + 1).padStart(2, "0")}`, name, status: "Active" }),
    );
    const normalizedDashboardData = dashboardData && typeof dashboardData === "object" && !Array.isArray(dashboardData)
        ? dashboardData as Record<string, unknown>
        : { attendance: [], roster: [] };
    const roster = normalizedDashboardData.roster;

    return {
        accessPassword: decryptStaffPassword(user.app_metadata[staffPasswordMetadataKey]),
        createdAt: user.created_at,
        dashboardData: fallbackUsername === "pss5" && (!Array.isArray(roster) || roster.length === 0)
            ? { ...normalizedDashboardData, roster: boazRoster }
            : normalizedDashboardData,
        fullName: typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : fallbackUsername,
        id: user.id,
        username: typeof user.user_metadata.username === "string" ? user.user_metadata.username : fallbackUsername,
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

authRouter.get("/switchable-accounts", async (request, response) => {
    const administrator = await requireAdmin(request.headers.authorization);
    if (administrator.error) {
        response.status(administrator.error === "Administrator access is required." ? 403 : 401).json({ message: administrator.error });
        return;
    }

    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) {
        response.status(400).json({ message: listed.error.message });
        return;
    }

    const accounts = listed.data.users
        .filter((user) => getUserRole(user) === "teacher")
        .map((user) => ({
            fullName: typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : user.email?.split("@")[0] ?? "Teacher",
            id: user.id,
            role: "teacher" as const,
        }))
        .sort((first, second) => first.fullName.localeCompare(second.fullName));

    response.json({ accounts });
});

authRouter.post("/switch-account", async (request, response) => {
    const administrator = await requireAdmin(request.headers.authorization);
    if (administrator.error) {
        response.status(administrator.error === "Administrator access is required." ? 403 : 401).json({ message: administrator.error });
        return;
    }

    const targetId = typeof request.body?.targetId === "string" ? request.body.targetId : "";
    const targetResult = await supabase.auth.admin.getUserById(targetId);
    const target = targetResult.data.user;
    if (targetResult.error || !target || getUserRole(target) !== "teacher" || !target.email) {
        response.status(404).json({ message: "Teacher account was not found." });
        return;
    }

    const generated = await supabase.auth.admin.generateLink({ email: target.email, type: "magiclink" });
    const tokenHash = generated.data.properties?.hashed_token;
    if (generated.error || !tokenHash) {
        response.status(400).json({ message: generated.error?.message ?? "Could not prepare the teacher session." });
        return;
    }

    response.json({ tokenHash });
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

    const staff = data.users
        .filter((user) => (user.app_metadata.role ?? user.user_metadata.role) === "staff")
        .map(toStaffAccount)
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
    const attributes = {
        app_metadata: {
            ...(existingUser?.app_metadata ?? {}),
            role: "staff",
            [staffPasswordMetadataKey]: encryptStaffPassword(password),
        },
        email_confirm: true,
        password,
        user_metadata: {
            ...(existingUser?.user_metadata ?? {}),
            dashboard_data: existingUser?.user_metadata.dashboard_data ?? { attendance: [], roster: [] },
            full_name: fullName,
            role: "staff",
            username,
        },
    };

    const result = existingUser
        ? await supabase.auth.admin.updateUserById(existingUser.id, attributes)
        : await supabase.auth.admin.createUser({ email, ...attributes });

    if (result.error || !result.data.user) {
        response.status(400).json({ message: result.error?.message ?? "Could not save the staff account." });
        return;
    }

    response.status(existingUser ? 200 : 201).json({ staffAccount: toStaffAccount(result.data.user) });
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

    const updated = await supabase.auth.admin.updateUserById(target.id, {
        app_metadata: {
            ...target.app_metadata,
            role: "staff",
            ...(password ? { [staffPasswordMetadataKey]: encryptStaffPassword(password) } : {}),
        },
        email,
        email_confirm: true,
        ...(password ? { password } : {}),
        user_metadata: {
            ...target.user_metadata,
            full_name: fullName,
            role: "staff",
            username,
        },
    });

    if (updated.error || !updated.data.user) {
        response.status(400).json({ message: updated.error?.message ?? "Could not update the staff account." });
        return;
    }

    response.json({ staffAccount: toStaffAccount(updated.data.user) });
});
