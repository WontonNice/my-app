import { useEffect, useState, type ReactNode } from "react";
import { getStudentClasses } from "../lib/api";
import { getUserRole } from "../lib/auth";
import { cacheStudentClasses, getActiveSession } from "../lib/sessionCache";
import { isSupabaseConfigured } from "../lib/supabase";
import { ClassAccessError } from "./ClassAccessError";
import { withRequestDeadline } from "../lib/requestDeadline";

export function ClassAccessGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"checking" | "ready" | "error">(isSupabaseConfigured ? "checking" : "ready");
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    async function checkAccess() {
      try {
        const session = await withRequestDeadline(undefined, () => getActiveSession());
        if (!active) return;
        if (!session) {
          window.location.assign("/login");
          return;
        }
        if (getUserRole(session.user) !== "student") {
          setStatus("ready");
          return;
        }
        const classes = await getStudentClasses(session.access_token);
        if (!active) return;
        cacheStudentClasses(session.user.id, classes);
        if (!classes.some((studentClass) => studentClass.id === "shsat")) {
          window.location.assign("/study-hall/classroom");
          return;
        }
        setStatus("ready");
      } catch (reason) {
        // A failed request says nothing about enrollment. Keep the current
        // route and cache, and require a successful check before opening it.
        if (active) {
          setError(reason instanceof Error ? reason.message : "Classroom access is temporarily unavailable. Please try again.");
          setStatus("error");
        }
      }
    }
    void checkAccess();
    return () => { active = false; };
  }, [attempt]);

  if (status === "error") return <ClassAccessError message={error} onRetry={() => { setError(""); setStatus("checking"); setAttempt(value => value + 1); }} />;
  return status === "checking" ? <main className="loading-shell">Checking class access...</main> : children;
}
