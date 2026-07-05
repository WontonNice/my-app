import { useEffect, useState, type FormEvent } from "react";
import { Eye, LayoutDashboard, Pencil, ShieldCheck, UserCog, Users, X } from "lucide-react";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { assignStaffAccount, getStaffAccounts, updateStaffAccount, type StaffAccount } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

export function AdminDashboardPage() {
  const [accessToken, setAccessToken] = useState("");
  const [adminName, setAdminName] = useState("Administrator");
  const [draft, setDraft] = useState({ fullName: "", password: "", username: "" });
  const [editingAccountId, setEditingAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    getSupabaseClient().auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const role = getUserRole(data.session.user);
      if (role !== "admin") {
        window.location.assign(getDashboardPath(role));
        return;
      }

      const metadata = data.session.user.user_metadata as { full_name?: string; name?: string };
      setAdminName(metadata.full_name ?? metadata.name ?? "Administrator");
      setAccessToken(data.session.access_token);

      try {
        setStaffAccounts(await getStaffAccounts(data.session.access_token));
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load staff accounts.");
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  async function handleAssignStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;

    setIsSaving(true);
    setMessage("");
    try {
      const account = editingAccountId
        ? await updateStaffAccount(accessToken, editingAccountId, draft)
        : await assignStaffAccount(accessToken, draft);
      setStaffAccounts((current) => [...current.filter((item) => item.id !== account.id), account].sort((a, b) => a.fullName.localeCompare(b.fullName)));
      setDraft({ fullName: "", password: "", username: "" });
      setEditingAccountId("");
      setMessage(editingAccountId ? `${account.fullName}'s account was updated.` : `${account.fullName} now has permanent staff access.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the account.");
    } finally {
      setIsSaving(false);
    }
  }

  function beginEditing(account: StaffAccount) {
    setEditingAccountId(account.id);
    setDraft({ fullName: account.fullName, password: "", username: account.username });
    setMessage("");
  }

  function cancelEditing() {
    setEditingAccountId("");
    setDraft({ fullName: "", password: "", username: "" });
  }

  async function handleSignOut() {
    if (isSupabaseConfigured) await getSupabaseClient().auth.signOut();
    window.location.assign("/");
  }

  if (isLoading) return <main className="loading-shell">Loading administration...</main>;

  const navItems = [
    { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
    { id: "accounts", label: "Account access", href: "#account-access", icon: UserCog },
    { id: "staff", label: "Staff dashboard", href: "/staff?preview=staff&adminTools=1", icon: Users },
  ];

  return (
    <CorporateDashboardShell activeId="overview" navItems={navItems} onSignOut={handleSignOut} profileName={adminName} profileRole="Administrator account">
      <header className="staff-page-heading corporate-page-heading"><div><p><ShieldCheck size={15} /> Administration</p><h1>System administration</h1><span>Manage staff access separately from SHSAT instruction and student work.</span></div></header>
      <section className="staff-kpi-grid" aria-label="Administration summary">
        <article><span><Users size={19} /></span><div><p>Staff accounts</p><strong>{staffAccounts.length}</strong></div><em>Active in Supabase</em></article>
        <article><span><UserCog size={19} /></span><div><p>Account system</p><strong>Live</strong></div><em>Permanent cloud access</em></article>
        <article><span><ShieldCheck size={19} /></span><div><p>Role security</p><strong>On</strong></div><em>Admin-only controls</em></article>
      </section>
      {message ? <p className="teacher-message corporate-message">{message}</p> : null}
      <section className="teacher-panel teacher-staff-panel" id="account-access">
        <div className="teacher-panel-header"><div><span>Account access</span><h2>{editingAccountId ? "Edit staff account" : "Assign staff"}</h2></div><p>Change a staff member&apos;s name or login username permanently.</p></div>
        <div className="teacher-staff-layout">
          <form className="teacher-assessment-form teacher-staff-form" onSubmit={handleAssignStaff}>
            <label>Full name<input required value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} /></label>
            <label>Username<input autoCapitalize="none" minLength={3} pattern="[a-zA-Z0-9._-]+" required value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value.toLowerCase() })} /></label>
            <label>{editingAccountId ? "New password (optional)" : "Temporary password"}<input autoComplete="new-password" minLength={6} required={!editingAccountId} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} /></label>
            <div className="admin-account-form-actions">
              <button disabled={isSaving} type="submit">{isSaving ? "Saving account" : editingAccountId ? "Save account changes" : "Assign staff access"}</button>
              {editingAccountId ? <button className="is-secondary" onClick={cancelEditing} type="button"><X size={15} /> Cancel</button> : null}
            </div>
          </form>
          <div className="teacher-staff-list" aria-label="Staff accounts">
            {staffAccounts.length ? staffAccounts.map((account) => <article key={account.id}><span>{account.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span><div><strong>{account.fullName}</strong><small>@{account.username}</small></div><div className="admin-account-actions"><button onClick={() => beginEditing(account)} type="button"><Pencil size={14} /> Edit</button><a className="admin-account-preview" href={`/staff?preview=staff&adminTools=1&accountId=${encodeURIComponent(account.id)}`}><Eye size={14} /> View</a></div></article>) : <p>No staff accounts assigned yet.</p>}
          </div>
        </div>
      </section>
    </CorporateDashboardShell>
  );
}
