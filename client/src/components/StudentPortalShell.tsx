import {
  BarChart3,
  BookMarked,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  Home,
  Library,
  LogOut,
  Menu,
  PanelLeftClose,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { navigateTo } from "../lib/navigation";
import { appendStudentPreview, type StudentPreviewContext } from "../lib/studentPreview";
import { AppLink } from "./AppLink";

type StudentPortalShellProps = {
  activeId: "assessments" | "assignments" | "home" | "materials" | "results";
  children: ReactNode;
  onSignOut: () => void;
  previewContext: StudentPreviewContext;
  studentName: string;
};

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST"
  );
}

export function StudentPortalShell({
  activeId,
  children,
  onSignOut,
  previewContext,
  studentName,
}: StudentPortalShellProps) {
  const profileRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(
    () => window.localStorage.getItem("student-portal-nav-collapsed") === "1",
  );
  const [isMaterialsExpanded, setIsMaterialsExpanded] = useState(activeId === "materials");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isProfileOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!profileRef.current?.contains(event.target as Node)) setIsProfileOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsProfileOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  function toggleCollapsed() {
    setIsCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("student-portal-nav-collapsed", next ? "1" : "0");
      return next;
    });
  }

  function closeMobileNavigation() {
    setIsMobileOpen(false);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    const href = appendStudentPreview(
      `/study-hall/shsat/materials${query ? `?q=${encodeURIComponent(query)}` : ""}`,
      previewContext,
    );
    navigateTo(href);
  }

  const homeHref = appendStudentPreview("/study-hall/shsat", previewContext);
  const materialsHref = appendStudentPreview("/study-hall/shsat/materials", previewContext);
  const englishHref = appendStudentPreview("/study-hall/shsat/materials?subject=english", previewContext);
  const mathHref = appendStudentPreview("/study-hall/shsat/materials?subject=math", previewContext);
  const assignmentsHref = appendStudentPreview("/study-hall/shsat/assignments", previewContext);
  const assessmentsHref = appendStudentPreview("/study-hall/shsat/assessments", previewContext);
  const resultsHref = appendStudentPreview("/study-hall/shsat/results", previewContext);
  const calendarHref = appendStudentPreview("/study-hall/shsat#coming-up", previewContext);

  return (
    <main className={`student-portal-shell ${isCollapsed ? "is-collapsed" : ""}`}>
      <header className="student-portal-topbar">
        <button
          aria-label="Open navigation"
          className="student-portal-mobile-menu"
          onClick={() => setIsMobileOpen(true)}
          type="button"
        >
          <Menu size={20} />
        </button>
        <AppLink className="student-portal-brand" href={homeHref}>
          <strong>The Learning Room</strong>
          <small>Student portal</small>
        </AppLink>
        <form className="student-portal-global-search" onSubmit={handleSearch}>
          <Search aria-hidden="true" size={17} />
          <label className="sr-only" htmlFor="student-portal-search">Search assignments and Study Hall</label>
          <input
            id="student-portal-search"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search assignments and Study Hall"
            type="search"
            value={searchQuery}
          />
        </form>
        <div className="student-portal-profile-menu" ref={profileRef}>
          <button
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            className="student-portal-profile-trigger"
            onClick={() => setIsProfileOpen((current) => !current)}
            type="button"
          >
            <span>{getInitials(studentName)}</span>
            <strong>{studentName}</strong>
            <ChevronDown size={15} />
          </button>
          {isProfileOpen ? (
            <div className="student-portal-profile-popover" role="menu">
              <div><UserRound size={17} /><span><strong>{studentName}</strong><small>{previewContext.isPreview ? "Student preview" : "Student account"}</small></span></div>
              {previewContext.isPreview ? (
                <AppLink href={previewContext.returnHref} role="menuitem"><LogOut size={16} /> Return to teacher dashboard</AppLink>
              ) : (
                <button onClick={onSignOut} role="menuitem" type="button"><LogOut size={16} /> Sign out</button>
              )}
            </div>
          ) : null}
        </div>
      </header>

      <aside className={`student-portal-sidebar ${isMobileOpen ? "is-mobile-open" : ""}`}>
        <button aria-label="Close navigation" className="student-portal-mobile-close" onClick={closeMobileNavigation} type="button"><X size={18} /></button>
        <div className="student-portal-course-context">
          <small>Current course</small>
          <strong>SHSAT Prep</strong>
          <span>Fall intensive</span>
        </div>
        <nav aria-label="Student portal navigation">
          <AppLink className={activeId === "home" ? "is-active" : undefined} href={homeHref} onClick={closeMobileNavigation}><Home size={18} /><span>Home</span></AppLink>
          <AppLink className={activeId === "assignments" ? "is-active" : undefined} href={assignmentsHref} onClick={closeMobileNavigation}><ClipboardList size={18} /><span>Assignments</span><em>3</em></AppLink>
          <AppLink href={calendarHref} onClick={closeMobileNavigation}><CalendarDays size={18} /><span>Calendar</span></AppLink>
          <button
            aria-expanded={isMaterialsExpanded}
            className={activeId === "materials" ? "is-active" : undefined}
            onClick={() => setIsMaterialsExpanded((current) => !current)}
            type="button"
          >
            <BookMarked size={18} /><span>Study Hall</span>{isMaterialsExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {isMaterialsExpanded ? (
            <div className="student-portal-subnav">
              <AppLink href={englishHref} onClick={closeMobileNavigation}>English</AppLink>
              <AppLink href={mathHref} onClick={closeMobileNavigation}>Math</AppLink>
            </div>
          ) : null}
          <AppLink className={activeId === "assessments" ? "is-active" : undefined} href={assessmentsHref} onClick={closeMobileNavigation}><Library size={18} /><span>Assessments</span></AppLink>
          <AppLink className={activeId === "results" ? "is-active" : undefined} href={resultsHref} onClick={closeMobileNavigation}><BarChart3 size={18} /><span>Results</span></AppLink>
        </nav>
        <div className="student-portal-personal-links">
          <small>Quick access</small>
          <AppLink href={`${materialsHref}#recent`} onClick={closeMobileNavigation}><Clock3 size={16} /><span>Recently viewed</span></AppLink>
          <AppLink href={`${materialsHref}#saved`} onClick={closeMobileNavigation}><BookMarked size={16} /><span>Saved items</span></AppLink>
        </div>
        <button className="student-portal-collapse" onClick={toggleCollapsed} type="button"><PanelLeftClose size={17} /><span>Collapse navigation</span></button>
      </aside>

      {isMobileOpen ? <button aria-label="Close navigation overlay" className="student-portal-backdrop" onClick={closeMobileNavigation} type="button" /> : null}
      <section className="student-portal-main">{children}</section>
    </main>
  );
}
