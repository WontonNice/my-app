import type { Session } from "@supabase/supabase-js";
import { getDashboardPath, getStaffLoginEmail, getStudentLoginEmail, getUserRole, type UserRole } from "./auth";
import { getSupabaseClient } from "./supabase";

const savedAccountsKey = "pss:signed-in-accounts:v1";
const legacyAdminReturnSessionKey = "pss:account-switch:admin-session";

type StoredAccount = {
  accessToken: string;
  email: string;
  fullName: string;
  id: string;
  refreshToken: string;
  role: UserRole;
  username: string;
};

export type SavedAccount = Omit<StoredAccount, "accessToken" | "refreshToken"> & {
  isCurrent: boolean;
};

function readStoredAccounts() {
  window.sessionStorage.removeItem(legacyAdminReturnSessionKey);

  try {
    const value = JSON.parse(window.localStorage.getItem(savedAccountsKey) ?? "[]") as unknown;
    if (!Array.isArray(value)) return [];

    return value.filter((account): account is StoredAccount => {
      if (!account || typeof account !== "object" || Array.isArray(account)) return false;
      const candidate = account as Partial<StoredAccount>;
      const hasValidRole = candidate.role === "admin" || candidate.role === "staff" || candidate.role === "student" || candidate.role === "teacher";
      return typeof candidate.id === "string"
        && typeof candidate.email === "string"
        && typeof candidate.fullName === "string"
        && typeof candidate.username === "string"
        && hasValidRole
        && typeof candidate.accessToken === "string"
        && typeof candidate.refreshToken === "string";
    });
  } catch {
    window.localStorage.removeItem(savedAccountsKey);
    return [];
  }
}

function writeStoredAccounts(accounts: StoredAccount[]) {
  window.localStorage.setItem(savedAccountsKey, JSON.stringify(accounts));
}

export function rememberAccountSession(session: Session) {
  const metadata = session.user.user_metadata as { full_name?: string; name?: string; username?: string };
  const email = session.user.email ?? "";
  const account: StoredAccount = {
    accessToken: session.access_token,
    email,
    fullName: metadata.full_name ?? metadata.name ?? email.split("@")[0] ?? "Account",
    id: session.user.id,
    refreshToken: session.refresh_token,
    role: getUserRole(session.user),
    username: metadata.username ?? email.split("@")[0] ?? email,
  };
  const accounts = readStoredAccounts();
  writeStoredAccounts([account, ...accounts.filter((saved) => saved.id !== account.id)]);
  return account;
}

export async function rememberCurrentAccount() {
  const { data } = await getSupabaseClient().auth.getSession();
  return data.session ? rememberAccountSession(data.session) : null;
}

export function getSavedAccounts(currentUserId?: string) {
  return readStoredAccounts().map<SavedAccount>((account) => ({
    email: account.email,
    fullName: account.fullName,
    id: account.id,
    isCurrent: account.id === currentUserId,
    role: account.role,
    username: account.username,
  }));
}

export function removeSavedAccount(accountId: string) {
  writeStoredAccounts(readStoredAccounts().filter((account) => account.id !== accountId));
}

export async function signInAndSaveAccount(identifierValue: string, password: string) {
  await rememberCurrentAccount();

  const supabase = getSupabaseClient();
  const identifier = identifierValue.trim().toLowerCase();
  let login = await supabase.auth.signInWithPassword({
    email: identifier.includes("@") ? identifier : getStudentLoginEmail(identifier),
    password,
  });
  if (login.error && !identifier.includes("@")) {
    login = await supabase.auth.signInWithPassword({ email: getStaffLoginEmail(identifier), password });
  }
  if (login.error || !login.data.session) throw login.error ?? new Error("Could not sign in to that account.");

  const account = rememberAccountSession(login.data.session);
  return getDashboardPath(account.role);
}

export async function switchToSavedAccount(accountId: string) {
  await rememberCurrentAccount();
  const account = readStoredAccounts().find((candidate) => candidate.id === accountId);
  if (!account) throw new Error("That saved account is no longer available.");

  const { data, error } = await getSupabaseClient().auth.setSession({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });
  if (error || !data.session) {
    removeSavedAccount(accountId);
    throw new Error("That account's saved session expired. Add it again with its password.");
  }

  const activeAccount = rememberAccountSession(data.session);
  return getDashboardPath(activeAccount.role);
}

export async function signOutCurrentAccount() {
  const { data } = await getSupabaseClient().auth.getSession();
  if (data.session) removeSavedAccount(data.session.user.id);

  const { error } = await getSupabaseClient().auth.signOut({ scope: "local" });
  if (error) throw error;
}
