import { Router } from "express";
import supabase from "../util/supabase";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body ?? {};
        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Missing username or password" });
        }

        const { data, error } = await supabase
            .from("users")
            .select("id, username, password, role, first_name, last_name, last_login_at")
            .eq("username", username.trim())
            .single();

        if (error || !data) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // NOTE: This is plaintext compare; replace with bcrypt.compare once you hash passwords
        if (data.password !== password.trim()) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const { data: updated, error: upErr } = await supabase
            .from("users")
            .update({ last_login_at: new Date().toISOString() })
            .eq("id", data.id)
            .select("id, username, role, first_name, last_name")
            .single();

        if (upErr || !updated) {
            return res.status(500).json({ error: "Failed to update login stats" });
        }

        const user = {
            ...updated,
            role: updated.role === "teacher" ? "teacher" : "student",
        };

        return res.status(200).json({ data: user });
    } catch (err) {
        console.error("LOGIN_ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
