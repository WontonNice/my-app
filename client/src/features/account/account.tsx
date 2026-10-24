import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createAuthHeaders, requestApi } from "../../lib/api";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase";
import type { Session } from "@supabase/supabase-js";

export type AccountProfile = { id: string; name: string; username: string; avatar: string | null; email: string | null; verifiedAt: string | null; pendingEmail: string | null; lastLoginAt: string | null; emailDeliveryReady: boolean };
// eslint-disable-next-line react-refresh/only-export-components
export const accountCall = <T,>(path: string, token = "", method = "GET", body?: unknown) => requestApi<T>(`/api/account${path}`, { method, headers: createAuthHeaders(token), ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
const AccountContext = createContext<{ profile: AccountProfile | null; signedIn: boolean; loading: boolean; error: string; refresh: () => Promise<void> }>({ profile: null, signedIn: false, loading: true, error: "", refresh: async () => {} });
// A separate lease per tab keeps another open tab online when one tab closes.
export function AccountProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null), [profile, setProfile] = useState<AccountProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured), [error, setError] = useState("");
  const [clientId] = useState(() => crypto.randomUUID());
  const currentId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const client = getSupabaseClient(); let active = true;
    void client.auth.getSession().then(({ data }) => { if (active) { currentId.current = data.session?.user.id; setSession(data.session); setAuthLoading(false); } }).catch(() => { if (active) setAuthLoading(false); });
    const { data } = client.auth.onAuthStateChange((_event, next) => { currentId.current = next?.user.id; setSession(next); setAuthLoading(false); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    if (!session) return;
    let active = true;
    const token = session.access_token, id = session.user.id;
    void accountCall<AccountProfile>("/profile", token).then(next => { if (active && currentId.current === id) { setProfile(next); setError(""); } }).catch((failure: unknown) => { if (active) setError(failure instanceof Error ? failure.message : "Your profile could not be loaded."); });
    const beat = () => { void accountCall("/presence", token, "POST", { clientId }).catch(() => {}); };
    const leave = () => { void accountCall(`/presence/${clientId}`, token, "DELETE").catch(() => {}); };
    beat(); const timer = window.setInterval(beat, 30000);
    window.addEventListener("pagehide", leave);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener("pagehide", leave); leave(); };
  }, [session, clientId]);
  const refresh = async () => { if (!session) return; const next = await accountCall<AccountProfile>("/profile", session.access_token); if (currentId.current === next.id) { setProfile(next); setError(""); } };
  const ownProfile = session?.user.id === profile?.id ? profile : null;
  return <AccountContext.Provider value={{ profile: ownProfile, signedIn: Boolean(session), loading: authLoading || Boolean(session && !ownProfile && !error), error, refresh }}>{children}</AccountContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAccountProfile() { return useContext(AccountContext); }
export function ProfileAvatar({ fallback }: { fallback: string }) {
  const { profile } = useAccountProfile();
  return profile?.avatar ? <img src={profile.avatar} alt="" className="account-avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} /> : <>{fallback}</>;
}
