import { createAccountSwitchToken } from "./api";
import { getSupabaseClient } from "./supabase";

const adminReturnSessionKey = "pss:account-switch:admin-session";

type StoredSession = {
  accessToken: string;
  refreshToken: string;
};

export function hasSavedAdminSession() {
  return Boolean(window.sessionStorage.getItem(adminReturnSessionKey));
}

export async function switchFromAdminToTeacher(accessToken: string, teacherId: string) {
  const supabase = getSupabaseClient();
  const current = await supabase.auth.getSession();
  if (!current.data.session) throw new Error("Your administrator session expired. Log in again.");

  const { tokenHash } = await createAccountSwitchToken(accessToken, teacherId);
  const stored: StoredSession = {
    accessToken: current.data.session.access_token,
    refreshToken: current.data.session.refresh_token,
  };
  window.sessionStorage.setItem(adminReturnSessionKey, JSON.stringify(stored));

  const switched = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "magiclink" });
  if (switched.error) {
    window.sessionStorage.removeItem(adminReturnSessionKey);
    throw switched.error;
  }
}

export async function returnToSavedAdminSession() {
  const raw = window.sessionStorage.getItem(adminReturnSessionKey);
  if (!raw) throw new Error("The saved administrator session is no longer available.");

  let stored: StoredSession;
  try {
    stored = JSON.parse(raw) as StoredSession;
  } catch {
    window.sessionStorage.removeItem(adminReturnSessionKey);
    throw new Error("The saved administrator session is invalid.");
  }

  const restored = await getSupabaseClient().auth.setSession({
    access_token: stored.accessToken,
    refresh_token: stored.refreshToken,
  });
  if (restored.error) throw restored.error;
  window.sessionStorage.removeItem(adminReturnSessionKey);
}
