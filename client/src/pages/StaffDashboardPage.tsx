import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Cloud,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Search,
  Save,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getStaffAccounts, saveStaffAttendance, type StaffDashboardData } from "../lib/api";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type StaffTab = "attendance" | "schedule" | "25live" | "roster";

const staffTabs = [
  { id: "attendance", label: "Attendance", icon: UserCheck },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "25live", label: "25Live", icon: Building2 },
  { id: "roster", label: "Roster", icon: Users },
] as const;

const defaultAttendanceRows: StaffDashboardData["attendance"] = [
  { name: "Aaliyah Johnson", group: "Grade 7 · Cohort A", time: "7:48 AM", status: "Present" },
  { name: "Ethan Williams", group: "Grade 8 · Cohort B", time: "8:02 AM", status: "Present" },
  { name: "Sofia Martinez", group: "Grade 6 · Cohort A", time: "8:11 AM", status: "Late" },
  { name: "Noah Thompson", group: "Grade 7 · Cohort C", time: "—", status: "Absent" },
];

const scheduleItems = [
  { time: "8:00 AM", end: "8:30 AM", title: "Student arrival and breakfast", place: "Student Commons", tone: "navy" },
  { time: "10:00 AM", end: "11:30 AM", title: "SHSAT Saturday session", place: "Rooms 201–204", tone: "teal" },
  { time: "12:15 PM", end: "1:00 PM", title: "Lunch and student activities", place: "Student Commons", tone: "gold" },
  { time: "2:30 PM", end: "3:15 PM", title: "Student dismissal", place: "Main Entrance", tone: "slate" },
] as const;

const defaultRosterRows: StaffDashboardData["roster"] = [
  { name: "Aaliyah Johnson", id: "PSS-2048", grade: "7", cohort: "Cohort A", assignment: "SHSAT Foundations", status: "Active" },
  { name: "Ethan Williams", id: "PSS-2062", grade: "8", cohort: "Cohort B", assignment: "Advanced SHSAT", status: "Active" },
  { name: "Sofia Martinez", id: "PSS-2071", grade: "6", cohort: "Cohort A", assignment: "Math Foundations", status: "Active" },
  { name: "Noah Thompson", id: "PSS-2084", grade: "7", cohort: "Cohort C", assignment: "ELA Foundations", status: "Active" },
  { name: "Isabella Brooks", id: "PSS-2093", grade: "8", cohort: "Cohort B", assignment: "Advanced SHSAT", status: "Waitlist" },
];

const defaultDashboardData: StaffDashboardData = {
  attendance: defaultAttendanceRows,
  roster: defaultRosterRows,
};

const boazRoster: StaffDashboardData["roster"] = [
  "Chloe Tong", "Harrison Cheng", "Kaitlyn Lim", "Dylan Cui", "Anabelle Liang", "Joanna Zhao", "Jun Kang",
].map((name, index) => ({
  assignment: "Promise Summer School",
  cohort: "Boaz Lim",
  grade: String(6 + (index % 3)),
  id: `PSS-5${String(index + 1).padStart(2, "0")}`,
  name,
  status: "Active",
}));

const isStaffPreview = new URLSearchParams(window.location.search).get("preview") === "staff";
const previewAccountId = new URLSearchParams(window.location.search).get("accountId");

const attendanceDates = (() => {
  const dates: string[] = [];
  const cursor = new Date(Date.UTC(2026, 6, 6));
  const end = new Date(Date.UTC(2026, 7, 21));
  while (cursor <= end) {
    const day = cursor.getUTCDay();
    if (day >= 1 && day <= 5) dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
})();

function formatAttendanceDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AttendancePanel({
  data,
  date,
  isSaving,
  onChangeDate,
  onChangeStatus,
  onSave,
  statuses,
}: {
  data: StaffDashboardData;
  date: string;
  isSaving: boolean;
  onChangeDate: (date: string) => void;
  onChangeStatus: (studentId: string, status: "Absent" | "Late" | "Present" | "Unmarked") => void;
  onSave: () => void;
  statuses: Record<string, "Absent" | "Late" | "Present" | "Unmarked">;
}) {
  const dateIndex = attendanceDates.indexOf(date);
  const values = Object.values(statuses);
  const present = values.filter((status) => status === "Present").length;
  const late = values.filter((status) => status === "Late").length;
  const absent = values.filter((status) => status === "Absent").length;
  const marked = present + late + absent;

  return (
    <section className="staff-attendance-register">
      <article className="staff-panel staff-attendance-main">
        <header className="staff-attendance-datebar">
          <button aria-label="Previous school day" disabled={dateIndex <= 0} onClick={() => onChangeDate(attendanceDates[dateIndex - 1])} type="button"><ChevronLeft size={19} /></button>
          <div><small>Summer session · Day {dateIndex + 1} of {attendanceDates.length}</small><h2>{formatAttendanceDate(date)}</h2></div>
          <button aria-label="Next school day" disabled={dateIndex >= attendanceDates.length - 1} onClick={() => onChangeDate(attendanceDates[dateIndex + 1])} type="button"><ChevronRight size={19} /></button>
        </header>
        <div className="staff-attendance-progress"><span style={{ width: `${data.roster.length ? (marked / data.roster.length) * 100 : 0}%` }} /></div>
        <div className="staff-attendance-students">
          {data.roster.map((student) => {
            const currentStatus = statuses[student.id] ?? "Unmarked";
            return (
              <article className={`staff-attendance-student is-${currentStatus.toLowerCase()}`} key={student.id}>
                <div className="staff-attendance-student-name"><span className="staff-avatar">{getInitials(student.name)}</span><div><strong>{student.name}</strong><small>Grade {student.grade} · {student.cohort}</small></div></div>
                <div className="staff-attendance-options" aria-label={`Attendance for ${student.name}`}>
                  {(["Present", "Late", "Absent"] as const).map((status) => <button aria-pressed={currentStatus === status} className={currentStatus === status ? "is-selected" : ""} key={status} onClick={() => onChangeStatus(student.id, status)} type="button">{status}</button>)}
                </div>
              </article>
            );
          })}
        </div>
        <footer className="staff-attendance-savebar"><div><Cloud size={17} /><span><strong>Permanent record</strong><small>Saved securely to Supabase</small></span></div><button disabled={isSaving || marked === 0} onClick={onSave} type="button"><Save size={16} /> {isSaving ? "Saving…" : "Save attendance"}</button></footer>
      </article>
      <aside className="staff-attendance-mini-summary"><div><strong>{marked}/{data.roster.length}</strong><span>Marked</span></div><div className="is-present"><strong>{present}</strong><span>Present</span></div><div className="is-late"><strong>{late}</strong><span>Late</span></div><div className="is-absent"><strong>{absent}</strong><span>Absent</span></div></aside>
    </section>
  );
}

function SchedulePanel() {
  return (
    <section className="staff-workspace-grid">
      <article className="staff-panel staff-panel-wide">
        <header className="staff-panel-header">
          <div><p>Today&apos;s agenda</p><h2>Daily schedule</h2></div>
          <button type="button"><CalendarDays size={16} /> View full calendar</button>
        </header>
        <div className="staff-schedule-list">
          {scheduleItems.map((item) => (
            <article className={`staff-schedule-item is-${item.tone}`} key={item.title}>
              <div><strong>{item.time}</strong><span>{item.end}</span></div>
              <div><h3>{item.title}</h3><p><MapPin size={14} /> {item.place}</p></div>
              <ChevronRight aria-hidden="true" size={18} />
            </article>
          ))}
        </div>
      </article>
      <aside className="staff-panel staff-coverage-card">
        <span><ShieldCheck size={20} /></span>
        <p>Coverage status</p>
        <h2>All areas covered</h2>
        <small>Last reviewed at 8:14 AM</small>
        <button type="button">Review assignments</button>
      </aside>
    </section>
  );
}

function TwentyFiveLivePanel() {
  return (
    <section className="staff-workspace-grid">
      <article className="staff-panel staff-panel-wide staff-25live-panel">
        <header className="staff-panel-header">
          <div><p>Space management</p><h2>25Live room overview</h2></div>
          <button type="button"><ExternalLink size={16} /> Open 25Live</button>
        </header>
        <div className="staff-room-grid">
          <article><span className="is-available">Available</span><h3>Conference Room A</h3><p><Users size={15} /> Capacity 16</p><small>Available until 10:00 AM</small></article>
          <article><span className="is-reserved">Reserved</span><h3>Student Commons</h3><p><Users size={15} /> Capacity 80</p><small>Staff coverage rotation · 12:15 PM</small></article>
          <article><span className="is-reserved">Reserved</span><h3>Rooms 201–204</h3><p><Users size={15} /> Capacity 96</p><small>SHSAT Saturday session · 10:00 AM</small></article>
          <article><span className="is-available">Available</span><h3>Testing Lab</h3><p><Users size={15} /> Capacity 30</p><small>Available all day</small></article>
        </div>
      </article>
      <aside className="staff-panel staff-utilization-card">
        <p>Space utilization</p><strong>68%</strong><span>9 of 13 spaces in use</span>
        <div className="staff-progress"><span /></div>
        <small>Peak demand: 10:00 AM–1:00 PM</small>
      </aside>
    </section>
  );
}

function RosterPanel({ rows }: { rows: StaffDashboardData["roster"] }) {
  return (
    <section className="staff-panel">
      <header className="staff-panel-header">
        <div><p>Enrollment directory</p><h2>Student roster</h2></div>
        <label className="staff-roster-search"><Search size={16} /><input aria-label="Search student roster" placeholder="Search students" /></label>
      </header>
      <div className="staff-table-wrap">
        <table className="staff-table staff-roster-table">
          <thead><tr><th>Student</th><th>Student ID</th><th>Grade</th><th>Cohort</th><th>Program</th><th>Enrollment</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td><span className="staff-avatar">{getInitials(row.name)}</span><strong>{row.name}</strong></td>
                <td>{row.id}</td><td>{row.grade}</td><td>{row.cohort}</td><td>{row.assignment}</td>
                <td><span className={`staff-status ${row.status === "Waitlist" ? "is-leave" : ""}`}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function StaffDashboardPage() {
  const [accessToken, setAccessToken] = useState("");
  const [activeTab, setActiveTab] = useState<StaffTab>("attendance");
  const [attendanceSaveMessage, setAttendanceSaveMessage] = useState("");
  const [attendanceStatuses, setAttendanceStatuses] = useState<Record<string, "Absent" | "Late" | "Present" | "Unmarked">>({});
  const [dashboardData, setDashboardData] = useState<StaffDashboardData>(defaultDashboardData);
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [previewReturnPath, setPreviewReturnPath] = useState("/teacher");
  const [staffName, setStaffName] = useState("Operations Staff");
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(attendanceDates[0]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const freshUserResult = await supabase.auth.getUser();
      const currentUser = freshUserResult.data.user ?? data.session.user;
      const role = getUserRole(currentUser);
      setAccessToken(data.session.access_token);
      if (role === "admin") setPreviewReturnPath("/admin");
      if (role !== "staff" && !((role === "teacher" || role === "admin") && isStaffPreview)) {
        window.location.assign(getDashboardPath(role));
        return;
      }

      const metadata = currentUser.user_metadata as { full_name?: string; name?: string };
      if (role === "admin" && isStaffPreview && previewAccountId) {
        try {
          const accounts = await getStaffAccounts(data.session.access_token);
          const selectedAccount = accounts.find((account) => account.id === previewAccountId);
          setStaffName(selectedAccount?.fullName ?? "Staff account preview");
          setDashboardData(selectedAccount?.dashboardData ?? { attendance: [], roster: [] });
        } catch {
          setStaffName("Staff account preview");
        }
      } else {
        setStaffName(metadata.full_name ?? metadata.name ?? "Operations Staff");
        const storedDashboardData = currentUser.user_metadata.dashboard_data as StaffDashboardData | undefined;
        const username = currentUser.user_metadata.username;
        setDashboardData(
          username === "pss5" && !(storedDashboardData?.roster?.length)
            ? { ...(storedDashboardData ?? { attendance: [] }), roster: boazRoster }
            : storedDashboardData ?? { attendance: [], roster: [] },
        );
      }
      setIsCheckingSession(false);
    });
  }, []);

  useEffect(() => {
    const stored = dashboardData.attendanceRecords?.[selectedAttendanceDate] ?? {};
    setAttendanceStatuses(Object.fromEntries(dashboardData.roster.map((student) => [student.id, stored[student.id] ?? "Unmarked"])));
    setAttendanceSaveMessage(stored && Object.keys(stored).length ? "Saved record loaded" : "");
  }, [dashboardData, selectedAttendanceDate]);

  const today = useMemo(
    () => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()),
    [],
  );

  async function handleSignOut() {
    if (isSupabaseConfigured) await getSupabaseClient().auth.signOut();
    window.location.assign("/");
  }

  async function handleSaveAttendance() {
    if (!accessToken) return;
    setIsSavingAttendance(true);
    setAttendanceSaveMessage("");
    try {
      const savedData = await saveStaffAttendance(accessToken, {
        accountId: previewAccountId ?? undefined,
        date: selectedAttendanceDate,
        statuses: attendanceStatuses,
      });
      setDashboardData({ ...savedData, roster: savedData.roster?.length ? savedData.roster : dashboardData.roster });
      setAttendanceSaveMessage("Attendance saved permanently");
    } catch (error) {
      setAttendanceSaveMessage(error instanceof Error ? error.message : "Attendance could not be saved.");
    } finally {
      setIsSavingAttendance(false);
    }
  }

  if (isCheckingSession) return <main className="loading-shell">Loading staff workspace...</main>;

  const activeLabel = staffTabs.find((tab) => tab.id === activeTab)?.label ?? "Attendance";
  const presentCount = Object.values(attendanceStatuses).filter((status) => status === "Present").length;

  return (
    <main className="staff-shell">
      <aside className={`staff-sidebar ${isNavigationOpen ? "is-open" : ""}`}>
        <a className="staff-brand" href="/staff"><span>PSS</span><div><strong>Promise Summer School</strong><small>Student Operations</small></div></a>
        <nav aria-label="Staff tools">
          <p>Workspace</p>
          {staffTabs.map((tab) => {
            const Icon = tab.icon;
            return <button className={activeTab === tab.id ? "is-active" : ""} key={tab.id} onClick={() => { setActiveTab(tab.id); setIsNavigationOpen(false); }} type="button"><Icon size={18} /><span>{tab.label}</span><ChevronRight size={15} /></button>;
          })}
        </nav>
        <div className="staff-sidebar-support"><CircleAlert size={18} /><div><strong>Program support</strong><span>Ext. 204 · Available</span></div></div>
        {isStaffPreview ? <a className="staff-signout" href={previewReturnPath}><LogOut size={17} /> Return to dashboard</a> : <button className="staff-signout" onClick={handleSignOut} type="button"><LogOut size={17} /> Sign out</button>}
      </aside>

      <section className="staff-main">
        <header className="staff-topbar">
          <button aria-label="Open navigation" className="staff-menu-button" onClick={() => setIsNavigationOpen((value) => !value)} type="button"><Menu size={20} /></button>
          <div><span>{today}</span><small>Campus operations are running normally</small></div>
          <div className="staff-profile"><span>{getInitials(staffName)}</span><div><strong>{staffName}</strong><small>{isStaffPreview ? "Teacher preview" : "Staff account"}</small></div></div>
        </header>

        <div className="staff-content">
          <header className="staff-page-heading"><div><p><LayoutDashboard size={15} /> Student operations dashboard</p><h1>{activeLabel}</h1><span>Manage today&apos;s students, spaces, and program schedule.</span></div><button type="button"><Clock3 size={16} /> Last synced 8:14 AM</button></header>

          <section className="staff-kpi-grid" aria-label="Operations summary">
            <article><span><UserCheck size={19} /></span><div><p>Students present</p><strong>{presentCount} <small>/ {dashboardData.roster.length}</small></strong></div><em>Live attendance</em></article>
            <article><span><CalendarDays size={19} /></span><div><p>Events today</p><strong>12</strong></div><em>Next at 8:30 AM</em></article>
            <article><span><Building2 size={19} /></span><div><p>Rooms in use</p><strong>9 <small>/ 13</small></strong></div><em>68% utilization</em></article>
            <article><span><CircleAlert size={19} /></span><div><p>Open tasks</p><strong>3</strong></div><em className="is-warning">1 needs attention</em></article>
          </section>

          {attendanceSaveMessage && activeTab === "attendance" ? <p className="staff-attendance-message" role="status">{attendanceSaveMessage}</p> : null}
          {activeTab === "attendance" ? <AttendancePanel data={dashboardData} date={selectedAttendanceDate} isSaving={isSavingAttendance} onChangeDate={setSelectedAttendanceDate} onChangeStatus={(studentId, status) => setAttendanceStatuses((current) => ({ ...current, [studentId]: status }))} onSave={handleSaveAttendance} statuses={attendanceStatuses} /> : null}
          {activeTab === "schedule" ? <SchedulePanel /> : null}
          {activeTab === "25live" ? <TwentyFiveLivePanel /> : null}
          {activeTab === "roster" ? <RosterPanel rows={dashboardData.roster} /> : null}
        </div>
      </section>
    </main>
  );
}
