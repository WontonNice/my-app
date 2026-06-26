import { Router } from "express";
import { supabase } from "../lib/supabase";

type RegisterStudentBody = {
    email?: unknown;
    fullName?: unknown;
    password?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeRegisterBody(body: RegisterStudentBody) {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    return { email, fullName, password };
}

export const authRouter = Router();

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
