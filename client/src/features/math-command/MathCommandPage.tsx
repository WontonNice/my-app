import { useEffect, useState } from "react";
import { teacherNavItems } from '../../lib/teacherNavigation';
import { CorporateDashboardShell } from "../../components/CorporateDashboardShell";
import { getDashboardPath, getUserRole } from "../../lib/auth";
import { getActiveSession, peekActiveSession } from "../../lib/sessionCache";
import { isSupabaseConfigured } from "../../lib/supabase";
import { signOutCurrentAccount } from "../../lib/accountSwitching";
import { MathCommandWorkspace } from "./MathCommandWorkspace";

export function MathCommandPage() {
  const initial = peekActiveSession();
  const [session, setSession] = useState(initial);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getActiveSession().then(value => {
      if (!value) { if (isSupabaseConfigured) window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`); else setError("Sign in to a configured teacher account to open Math Command Center."); return; }
      const role = getUserRole(value.user);
      if (role !== "teacher" && role !== "admin") { window.location.assign(getDashboardPath(role)); return; }
      if (active) setSession(value);
    }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Could not verify your account."); });
    return () => { active = false; };
  }, []);
  if (error) return <main className="loading-shell" role="alert">{error}</main>;
  if (!session || !["teacher", "admin"].includes(getUserRole(session.user))) return <main className="loading-shell">Opening Math Command Center…</main>;
  const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "Teacher";
  return <CorporateDashboardShell activeId="math" enableAccountSwitcher learningRoom navItems={teacherNavItems} profileName={name} profileRole="Teacher account" onSignOut={() => { void signOutCurrentAccount().then(() => window.location.assign("/login")); }}><MathCommandWorkspace accessToken={session.access_token}/></CorporateDashboardShell>;
}
