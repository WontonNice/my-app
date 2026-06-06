import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
);

// Validators
function isValidUsername(u: unknown): u is string {
    return typeof u === "string" && /^[a-zA-Z0-9_]{3,32}$/.test(u);
}

function isValidPassword(p: unknown): p is string {
    return typeof p === "string" && p.length >= 1 && p.length <= 128;
}

function normalizeName(x: unknown): string | null {
    if (typeof x !== "string") return null;
    const s = x.trim();
    if (!s) return null;
    // allow letters, spaces, hyphens, apostrophes; 1–64 chars
    if (!/^[A-Za-z][A-Za-z' -]{0,63}$/.test(s)) return null;
    return s;
}

router.post("/", async (req, res) => {
    try {
        const {
            username,
            password,
            firstName,
            lastName,
            first_name,
            last_name,
        } = req.body ?? {};

        if (!username || !password || !firstName || !lastName) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const normalizedUsername =
            typeof username === "string" ? username.trim() : username;
        const FirstName = normalizeName(firstName ?? first_name);
        const LastName = normalizeName(lastName ?? last_name);

        if (!isValidUsername(normalizedUsername)) {
            res.status(400).json({ error: "Invalid username" });
            return;
        }
        if (!isValidPassword(password)) {
            res.status(400).json({ error: "Invalid password" });
            return;
        }

        const toInsert = {
            username: normalizedUsername,
            password,
            first_name: FirstName,
            last_name: LastName,
            role: "student",
        };

        const { data, error } = await supabase
            .from("users")
            .insert([toInsert])
            .select(
                "id, username, password, role, first_name, last_name, created_at, last_login_at, streak_count, best_streak, enrolled_courses"
            )
            .single();

        if (error) {
            if (error.message.toLowerCase().includes("duplicate")) {
                res.status(409).json({ error: "This username is taken" });
                return;
            }
            res.status(400).json({ error: error.message });
            return;
        } res.status(201).json({ data });

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

export default router;