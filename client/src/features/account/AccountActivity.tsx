import { useEffect, useState } from "react";
import { accountCall } from "./account";
import "../../styles/profile-settings.css";
type Activity = { onlineIds: string[]; checkedAt: string; lastLogins: Record<string, string> };
// eslint-disable-next-line react-refresh/only-export-components
export function useAccountActivity(token: string, enabled: boolean) {
  const [activity, setActivity] = useState<Activity | null>(null), [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    if (!token || !enabled) return;
    let active = true, timer: number;
    const load = async () => {
      try { const next = await accountCall<Activity>("/activity", token); if (active) { setActivity(next); setUnavailable(false); } }
      catch { if (active) setUnavailable(true); }
      finally { if (active) timer = window.setTimeout(() => { void load(); }, 15000); }
    };
    void load(); return () => { active = false; window.clearTimeout(timer); };
  }, [token, enabled]);
  return unavailable ? null : activity;
}
export function AccountActivity({ id, lastLoginAt, archived, activity }: { id: string; lastLoginAt?: string | null; archived: boolean; activity: Activity | null }) {
  const online = !archived && Boolean(activity?.onlineIds.includes(id));
  const login = activity?.lastLogins[id] ?? lastLoginAt;
  return <><small className={`account-presence ${online ? "is-online" : ""}`} title="Online means an authenticated browser checked in during the last 90 seconds. Updates every 15 seconds.">{archived ? "Archived" : !activity ? "Status unavailable" : online ? "Online now" : "Offline"}</small><small>Last login: {login ? new Date(login).toLocaleString() : "Never signed in"}</small></>;
}
