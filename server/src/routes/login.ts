import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE! // or SUPABASE_SECRET_KEY
);

function normalizeCourses(courses: unknown): string[] {
    if (Array.isArray(courses)) {
        return courses
            .filter((course): course is string => typeof course === "string")
            .map((course) => course.trim())
            .filter(Boolean);
    }

    if (typeof courses === "string") {
        const trimmedCourses = courses.trim();
        if (!trimmedCourses) return [];

        if (
            (trimmedCourses.startsWith("[") && trimmedCourses.endsWith("]")) ||
            (trimmedCourses.startsWith("{") && trimmedCourses.endsWith("}"))
        ) {
            try {
                const parsedCourses = JSON.parse(trimmedCourses) as unknown;
                return normalizeCourses(parsedCourses);
            } catch {
                // Fall back to comma-delimited parsing below.
            }
        }

        return trimmedCourses
            .split(",")
            .map((course) => course.trim())
            .filter(Boolean);
    }

    return [];
}

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body ?? {};
        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Missing username or password" });
        }

        const { data, error } = await supabase
            .from("users")
            .select("id, username, password, role, first_name, last_name, created_at, last_login_at, streak_count, best_streak, enrolled_courses")
            .eq("username", username.trim())
            .single();

        if (error || !data) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // NOTE: This is plaintext compare; replace with bcrypt.compare once you hash passwords
        if (data.password !== password.trim()) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // streak calc
        const now = new Date();
        const last = data.last_login_at ? new Date(data.last_login_at) : null;
        const prev = Number.isFinite(data.streak_count) ? data.streak_count : 0;

        let newStreak = prev;
        if (!last) newStreak = 1;
        else {
            const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
            if (diffHours >= 48) newStreak = 1;
            else if (diffHours >= 24) newStreak = prev + 1;
        }

        const bestStreak = Math.max(data.best_streak ?? 0, newStreak);

        const { data: updated, error: upErr } = await supabase
            .from("users")
            .update({
                last_login_at: now.toISOString(),
                streak_count: newStreak,
                best_streak: bestStreak,
            })
            .eq("id", data.id)
            .select("id, username, role, first_name, last_name, created_at, last_login_at, streak_count, best_streak, enrolled_courses")
            .single();

        if (upErr || !updated) {
            return res.status(500).json({ error: "Failed to update login stats" });
        }

        const user = {
            ...updated,
            role: updated.role === "teacher" ? "teacher" : "student",
            enrolled_courses: normalizeCourses(updated.enrolled_courses),
        };

        return res.status(200).json({ data: user });
    } catch (err) {
        console.error("LOGIN_ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
