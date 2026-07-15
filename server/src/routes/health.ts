import { Router } from "express";
import { supabase } from "../lib/supabase";

export const healthRouter = Router();

type ReadinessResult = {
    checkedAt: string;
    database: "down" | "up";
    ok: boolean;
};

let cachedReadiness: { expiresAt: number; result: ReadinessResult } | null = null;
let readinessPromise: Promise<ReadinessResult> | null = null;

async function checkReadiness() {
    const now = Date.now();
    if (cachedReadiness && cachedReadiness.expiresAt > now) return cachedReadiness.result;
    if (readinessPromise) return readinessPromise;

    readinessPromise = (async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4_000);
        try {
            const { error } = await supabase
                .from("staff_dashboard_data")
                .select("staff_user_id")
                .limit(1)
                .abortSignal(controller.signal);
            const result: ReadinessResult = {
                checkedAt: new Date().toISOString(),
                database: error ? "down" : "up",
                ok: !error,
            };
            cachedReadiness = { expiresAt: now + 15_000, result };
            return result;
        } catch {
            const result: ReadinessResult = {
                checkedAt: new Date().toISOString(),
                database: "down",
                ok: false,
            };
            cachedReadiness = { expiresAt: now + 5_000, result };
            return result;
        } finally {
            clearTimeout(timeout);
            readinessPromise = null;
        }
    })();

    return readinessPromise;
}

healthRouter.get("/", (_request, response) => {
    response.status(200).json({ ok: true, status: "up", timestamp: new Date().toISOString() });
});

healthRouter.get("/ready", async (_request, response) => {
    const readiness = await checkReadiness();
    response.status(readiness.ok ? 200 : 503).json(readiness);
});
