import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { ArrowLeftRight, Check, ChevronRight, LogOut, Menu, Plus, Trash2, UserRound, X, type LucideIcon } from "lucide-react";
import { getSavedAccounts, rememberCurrentAccount, removeSavedAccount, signInAndSaveAccount, switchToSavedAccount, type SavedAccount } from "../lib/accountSwitching";
import { navigateTo } from "../lib/navigation";

export type DashboardNavItem = {
  href: string;
  icon: LucideIcon;
  id: string;
  label: string;
};

type CorporateDashboardShellProps = {
  activeId: string;
  children: ReactNode;
  enableAccountSwitcher?: boolean;
  navItems: DashboardNavItem[];
  onSignOut?: () => void;
  profileName: string;
  profileRole: string;
  returnHref?: string;
  returnLabel?: string;
};

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PS";
}

function getRoleLabel(role: SavedAccount["role"]) {
  if (role === "admin") return "Administrator";
  if (role === "teacher") return "Teacher";
  if (role === "staff") return "Staff";
  return "Student";
}

function AccountSwitcher() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [busyAccountId, setBusyAccountId] = useState("");

  useEffect(() => {
    rememberCurrentAccount().then((current) => setAccounts(getSavedAccounts(current?.id))).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  async function handleSwitch(account: SavedAccount) {
    if (account.isCurrent) {
      setIsOpen(false);
      return;
    }
    setBusyAccountId(account.id);
    setMessage("");
    try {
      const path = await switchToSavedAccount(account.id);
      window.location.assign(path);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not switch accounts.");
      const current = await rememberCurrentAccount().catch(() => null);
      setAccounts(getSavedAccounts(current?.id));
      setBusyAccountId("");
    }
  }

  async function handleAddAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAccountId("new");
    setMessage("");
    try {
      const path = await signInAndSaveAccount(identifier, password);
      window.location.assign(path);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign in to that account.");
      setBusyAccountId("");
    }
  }

  function handleRemoveAccount(accountId: string) {
    removeSavedAccount(accountId);
    setAccounts((current) => current.filter((account) => account.id !== accountId));
    setMessage("");
  }

  return (
    <div className="staff-account-switcher" ref={containerRef}>
      <button aria-expanded={isOpen} aria-haspopup="dialog" className="staff-account-switch" onClick={() => setIsOpen((value) => !value)} type="button">
        <ArrowLeftRight size={15} /> Switch account
      </button>
      {isOpen ? (
        <section aria-label="Switch account" className="staff-account-menu" role="dialog">
          <header><div><strong>Switch account</strong><span>Signed in on this browser</span></div><button aria-label="Close account menu" onClick={() => setIsOpen(false)} type="button"><X size={16} /></button></header>
          <div className="staff-account-list">
            {accounts.map((account) => (
              <div className={account.isCurrent ? "is-current" : ""} key={account.id}>
                <button disabled={Boolean(busyAccountId)} onClick={() => handleSwitch(account)} type="button">
                  <span>{getInitials(account.fullName)}</span>
                  <span><strong>{account.fullName}</strong><small>{account.username} · {getRoleLabel(account.role)}</small></span>
                  {account.isCurrent ? <Check size={16} /> : busyAccountId === account.id ? <span className="staff-account-spinner" /> : null}
                </button>
                {!account.isCurrent ? <button aria-label={`Remove ${account.fullName} from this browser`} className="staff-account-remove" disabled={Boolean(busyAccountId)} onClick={() => handleRemoveAccount(account.id)} title="Remove saved account" type="button"><Trash2 size={14} /></button> : null}
              </div>
            ))}
          </div>
          {message ? <p className="staff-account-menu-message" role="alert">{message}</p> : null}
          {isAdding ? (
            <form className="staff-add-account-form" onSubmit={handleAddAccount}>
              <label>Username or email<input autoCapitalize="none" autoComplete="username" autoFocus required value={identifier} onChange={(event) => setIdentifier(event.target.value)} /></label>
              <label>Password<input autoComplete="current-password" minLength={6} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
              <div><button disabled={busyAccountId === "new"} type="submit">{busyAccountId === "new" ? "Signing in…" : "Sign in and add"}</button><button disabled={Boolean(busyAccountId)} onClick={() => { setIsAdding(false); setMessage(""); }} type="button">Cancel</button></div>
            </form>
          ) : <button className="staff-add-account" onClick={() => { setIsAdding(true); setMessage(""); }} type="button"><Plus size={15} /> Add another account</button>}
        </section>
      ) : null}
    </div>
  );
}

export function CorporateDashboardShell({
  activeId,
  children,
  enableAccountSwitcher,
  navItems,
  onSignOut,
  profileName,
  profileRole,
  returnHref,
  returnLabel,
}: CorporateDashboardShellProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const today = useMemo(
    () => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()),
    [],
  );

  function handleInternalNavigation(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setIsNavigationOpen(false);
    if (href.startsWith("#") || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateTo(href);
  }

  return (
    <main className="staff-shell corporate-dashboard-shell">
      <aside className={`staff-sidebar ${isNavigationOpen ? "is-open" : ""}`}>
        <button aria-label="Close navigation" className="staff-sidebar-close" onClick={() => setIsNavigationOpen(false)} type="button"><X size={18} /></button>
        <a className="staff-brand" href={navItems[0]?.href ?? "/dashboard"} onClick={(event) => handleInternalNavigation(event, navItems[0]?.href ?? "/dashboard")}>
          <span>PSS</span>
          <div><strong>Promise Summer School</strong><small>Learning Operations</small></div>
        </a>
        <nav aria-label="Dashboard navigation">
          <p>Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a className={activeId === item.id ? "is-active" : ""} href={item.href} key={item.id} onClick={(event) => handleInternalNavigation(event, item.href)}>
                <Icon size={18} /><span>{item.label}</span><ChevronRight size={15} />
              </a>
            );
          })}
        </nav>
        <div className="staff-sidebar-support">
          <UserRound size={18} />
          <div><strong>Teacher name</strong><span>{profileName}</span></div>
        </div>
        {returnHref ? (
          <a className="staff-signout" href={returnHref} onClick={(event) => handleInternalNavigation(event, returnHref)}><LogOut size={17} /> {returnLabel ?? "Return"}</a>
        ) : (
          <button className="staff-signout" onClick={onSignOut} type="button"><LogOut size={17} /> Sign out</button>
        )}
      </aside>

      <section className="staff-main">
        <header className="staff-topbar">
          <button aria-label="Open navigation" className="staff-menu-button" onClick={() => setIsNavigationOpen((value) => !value)} type="button"><Menu size={20} /></button>
          <div><span>{today}</span><small>Promise Summer School portal</small></div>
          {enableAccountSwitcher ? <AccountSwitcher /> : null}
          <div className="staff-profile"><span>{getInitials(profileName)}</span><div><strong>{profileName}</strong><small>{profileRole}</small></div></div>
        </header>
        <div className="staff-content corporate-dashboard-content">{children}</div>
      </section>
    </main>
  );
}
