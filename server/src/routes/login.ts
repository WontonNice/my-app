import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

router.post("/login", async (req, res) => {
    try {
        let { username, password } = req.body ?? {};

        const { data, error } = await supabase
            .from("users")
            .select(
                "id, username, password, role, first_name, last_name, created_at, last_login_at, streak_count, best_streak"
            )
            .eq("username", username)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        if (data.password !== password) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        //Streak
        const now = new Date();
        const last = data.last_login_at ? new Date(data.last_login_at) : null;
        const prev = Number.isFinite(data.streak_count) ? data.streak_count : 0;

        let newStreak = prev;
        if (!last) {
            newStreak = 1;
        } else {
            const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
            if (diffHours >= 48) newStreak = 1;
            else if (diffHours >= 24) newStreak++;
            else newStreak = prev;
        }

        const BestStreak = Math.max(data.best_streak ?? 0, newStreak);

        const { data: updated } = await supabase
            .from("users")
            .update({
                last_login_at: now.toISOString(),
                streak_count: newStreak,
                best_streak: BestStreak,
            })
            .eq("id", data.id)
            .select(
                "id, username, password, role, first_name, last_name, created_at, last_login_at, streak_count, best_streak"
            )
            .single();

        const user = {
            ...updated,
            role: "student"
        }

        res.status(200).json({ data });
    } catch (err: any) {
        console.error("LOGIN_ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;