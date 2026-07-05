import { useMemo, useState, type ReactNode } from "react";
import { ChevronRight, CircleHelp, LogOut, Menu, type LucideIcon } from "lucide-react";

export type DashboardNavItem = {
  href: string;
  icon: LucideIcon;
  id: string;
  label: string;
};

type CorporateDashboardShellProps = {
  activeId: string;
  children: ReactNode;
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

export function CorporateDashboardShell({
  activeId,
  children,
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

  return (
    <main className="staff-shell corporate-dashboard-shell">
      <aside className={`staff-sidebar ${isNavigationOpen ? "is-open" : ""}`}>
        <a className="staff-brand" href={navItems[0]?.href ?? "/dashboard"}>
          <span>PSS</span>
          <div><strong>Promise Summer School</strong><small>Learning Operations</small></div>
        </a>
        <nav aria-label="Dashboard navigation">
          <p>Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a className={activeId === item.id ? "is-active" : ""} href={item.href} key={item.id}>
                <Icon size={18} /><span>{item.label}</span><ChevronRight size={15} />
              </a>
            );
          })}
        </nav>
        <div className="staff-sidebar-support">
          <CircleHelp size={18} />
          <div><strong>Need assistance?</strong><span>Program support · Ext. 204</span></div>
        </div>
        {returnHref ? (
          <a className="staff-signout" href={returnHref}><LogOut size={17} /> {returnLabel ?? "Return"}</a>
        ) : (
          <button className="staff-signout" onClick={onSignOut} type="button"><LogOut size={17} /> Sign out</button>
        )}
      </aside>

      <section className="staff-main">
        <header className="staff-topbar">
          <button aria-label="Open navigation" className="staff-menu-button" onClick={() => setIsNavigationOpen((value) => !value)} type="button"><Menu size={20} /></button>
          <div><span>{today}</span><small>Promise Summer School portal</small></div>
          <div className="staff-profile"><span>{getInitials(profileName)}</span><div><strong>{profileName}</strong><small>{profileRole}</small></div></div>
        </header>
        <div className="staff-content corporate-dashboard-content">{children}</div>
      </section>
    </main>
  );
}
