import { Router } from "express";
import { getAuthenticatedUser, getUserRole } from "../lib/auth";
import { supabase } from "../lib/supabase";

type RegisterStudentBody = {
    email?: unknown;
    fullName?: unknown;
    password?: unknown;
};

type AssignStaffBody = {
    fullName?: unknown;
    password?: unknown;
    username?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const staffUsernamePattern = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const staffEmailDomain = "staff.nathantutors.local";

function normalizeRegisterBody(body: RegisterStudentBody) {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    return { email, fullName, password };
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
    created_at: string;
    email?: string;
    id: string;
    user_metadata: Record<string, unknown>;
}) {
    const fallbackUsername = user.email?.split("@")[0] ?? "staff";
    const dashboardData = user.user_metadata.dashboard_data;

    return {
        createdAt: user.created_at,
        dashboardData: dashboardData && typeof dashboardData === "object" && !Array.isArray(dashboardData)
            ? dashboardData
            : { attendance: [], roster: [] },
        fullName: typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : fallbackUsername,
        id: user.id,
        username: typeof user.user_metadata.username === "string" ? user.user_metadata.username : fallbackUsername,
    };
}

authRouter.post("/register", async (request, response) => {
    const { email, fullName, password } = normalizeRegisterBody(request.body);

    if (!fullName) {
        response.status(400).json({ message: "Full name is required." });
        return;
    }

    if (!emailPattern.test(email)) {
        response.status(400).json({ message: "Enter a valid email address." });
        return;
    }

    if (password.length < 6) {
        response.status(400).json({ message: "Password must be at least 6 characters." });
        return;
    }

    const { error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: fullName,
            role: "student",
        },
    });

    if (error) {
        const isDuplicateUser = error.message.toLowerCase().includes("already");

        response.status(isDuplicateUser ? 409 : 400).json({
            message: isDuplicateUser
                ? "An account with this email already exists. Try logging in instead."
                : error.message,
        });
        return;
    }

    response.status(201).json({ message: "Student account created." });
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
        app_metadata: { role: "staff" },
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
