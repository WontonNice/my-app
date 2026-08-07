import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Cloud,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  Save,
  Trophy,
  UserCheck,
  Users,
  Waves,
  X,
} from "lucide-react";
import { AccountSwitcher } from "../components/CorporateDashboardShell";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSquidGames, getStaffDashboard, getStaffSchedules, getStaffTasks, saveSquidGamesPoints, saveStaffAttendance, saveStaffDismissal, updateStaffTask, type SquidGamesData, type SquidGamesStudent, type StaffDashboardData, type StaffSchedule, type StaffTask } from "../lib/api";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type StaffTab = "attendance" | "schedule" | "roster" | "swimming" | "dismissal" | "tasks" | "squid-games";

const staffTabs = [
  { id: "attendance", label: "Attendance", icon: UserCheck },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "roster", label: "Roster", icon: Users },
  { id: "swimming", label: "Swimming", icon: Waves },
  { id: "dismissal", label: "Dismissal", icon: Bus },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "squid-games", label: "Squid Games", icon: Trophy },
] as const;

const defaultAttendanceRows: StaffDashboardData["attendance"] = [
  { name: "Aaliyah Johnson", group: "Grade 7 · Cohort A", time: "7:48 AM", status: "Present" },
  { name: "Ethan Williams", group: "Grade 8 · Cohort B", time: "8:02 AM", status: "Present" },
  { name: "Sofia Martinez", group: "Grade 6 · Cohort A", time: "8:11 AM", status: "Late" },
  { name: "Noah Thompson", group: "Grade 7 · Cohort C", time: "—", status: "Absent" },
];

const defaultRosterRows: StaffDashboardData["roster"] = [
  { name: "Aaliyah Johnson", id: "PSS-2048", grade: "7", cohort: "Cohort A", assignment: "SHSAT Foundations", points: 0, status: "Active" },
  { name: "Ethan Williams", id: "PSS-2062", grade: "8", cohort: "Cohort B", assignment: "Advanced SHSAT", points: 0, status: "Active" },
  { name: "Sofia Martinez", id: "PSS-2071", grade: "6", cohort: "Cohort A", assignment: "Math Foundations", points: 0, status: "Active" },
  { name: "Noah Thompson", id: "PSS-2084", grade: "7", cohort: "Cohort C", assignment: "ELA Foundations", points: 0, status: "Active" },
  { name: "Isabella Brooks", id: "PSS-2093", grade: "8", cohort: "Cohort B", assignment: "Advanced SHSAT", points: 0, status: "Waitlist" },
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
  points: 0,
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

function getDefaultAttendanceDate() {
  const today = new Date().toLocaleDateString("en-CA");
  return attendanceDates.includes(today) ? today : attendanceDates[0];
}

function isSessionExpiredError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes("session expired") || message.includes("log in to continue") || message.includes("jwt") || message.includes("sign-in token");
}

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

function getStudentClass(student: StaffDashboardData["roster"][number]) {
  if (student.className) return student.className;
  const grade = Number(student.grade);
  if (!Number.isInteger(grade)) return student.cohort;
  const suffix = grade % 10 === 1 && grade !== 11 ? "st" : grade % 10 === 2 && grade !== 12 ? "nd" : grade % 10 === 3 && grade !== 13 ? "rd" : "th";
  return `${grade}${suffix} Grade`;
}

function hasAllergyAlert(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return Boolean(normalized && !["none", "no", "n/a", "na", "none known", "no allergies"].includes(normalized));
}

function AttendancePanel({
  data,
  date,
  isSaving,
  isFutureLocked,
  onChangeDate,
  onChangeStatus,
  onSave,
  saveMessage,
  statuses,
}: {
  data: StaffDashboardData;
  date: string;
  isSaving: boolean;
  isFutureLocked: boolean;
  onChangeDate: (date: string) => void;
  onChangeStatus: (studentId: string, status: "Absent" | "Late" | "Present" | "Unmarked") => void;
  onSave: () => void;
  saveMessage: string;
  statuses: Record<string, "Absent" | "Late" | "Present" | "Unmarked">;
}) {
  const [sortMode, setSortMode] = useState<"first" | "last">("first");
  const dateIndex = attendanceDates.indexOf(date);
  const values = Object.values(statuses);
  const present = values.filter((status) => status === "Present").length;
  const late = values.filter((status) => status === "Late").length;
  const absent = values.filter((status) => status === "Absent").length;
  const marked = present + late + absent;
  const saveSucceeded = saveMessage === "Attendance saved permanently";
  const sortedRoster = [...data.roster].sort((first, second) => {
    const firstParts = first.name.trim().split(/\s+/);
    const secondParts = second.name.trim().split(/\s+/);
    const firstKey = sortMode === "first" ? (first.firstName ?? firstParts[0] ?? "") : (first.lastName ?? firstParts.at(-1) ?? "");
    const secondKey = sortMode === "first" ? (second.firstName ?? secondParts[0] ?? "") : (second.lastName ?? secondParts.at(-1) ?? "");
    return firstKey.localeCompare(secondKey) || first.name.localeCompare(second.name);
  });

  return (
    <section className="staff-attendance-register">
      <article className="staff-panel staff-attendance-main">
        <header className="staff-attendance-datebar">
          <button aria-label="Previous school day" disabled={dateIndex <= 0} onClick={() => onChangeDate(attendanceDates[dateIndex - 1])} type="button"><ChevronLeft size={19} /></button>
          <div><small>Summer session · Day {dateIndex + 1} of {attendanceDates.length}</small><h2>{formatAttendanceDate(date)}</h2></div>
          <button aria-label="Next school day" disabled={dateIndex >= attendanceDates.length - 1} onClick={() => onChangeDate(attendanceDates[dateIndex + 1])} type="button"><ChevronRight size={19} /></button>
        </header>
        {isFutureLocked ? <p className="staff-attendance-future-notice"><CircleAlert size={15} /> Future attendance is view-only. Return on or after this date to make changes.</p> : null}
        <div className="staff-attendance-sort"><span>Sort by</span><button className={sortMode === "first" ? "is-active" : ""} onClick={() => setSortMode("first")} type="button">First Name A–Z</button><button className={sortMode === "last" ? "is-active" : ""} onClick={() => setSortMode("last")} type="button">Last Name A–Z</button></div>
        <div className="staff-attendance-progress"><span style={{ width: `${data.roster.length ? (marked / data.roster.length) * 100 : 0}%` }} /></div>
        <div className="staff-attendance-students">
          {sortedRoster.map((student) => {
            const currentStatus = statuses[student.id] ?? "Unmarked";
            return (
              <article className={`staff-attendance-student is-${currentStatus.toLowerCase()}`} key={student.id}>
                <div className="staff-attendance-student-name"><span className="staff-avatar">{getInitials(student.name)}</span><div><strong>{student.name}</strong><small>{getStudentClass(student)}</small></div></div>
                <div className="staff-attendance-options" aria-label={`Attendance for ${student.name}`}>
                  {(["Present", "Late", "Absent"] as const).map((status) => <button aria-pressed={currentStatus === status} className={currentStatus === status ? "is-selected" : ""} disabled={isFutureLocked} key={status} onClick={() => onChangeStatus(student.id, status)} type="button">{status}</button>)}
                </div>
              </article>
            );
          })}
        </div>
        <footer className="staff-attendance-savebar"><div><Cloud size={17} /><span><strong>Permanent record</strong><small className={saveMessage && !saveSucceeded ? "is-error" : ""} role={saveMessage && !saveSucceeded ? "alert" : undefined}>{isFutureLocked ? "Future dates are locked" : saveMessage && !saveSucceeded ? saveMessage : "Saved securely to Supabase"}</small></span></div><button className={saveSucceeded ? "is-saved" : ""} disabled={isSaving || marked === 0 || isFutureLocked || saveSucceeded} onClick={onSave} type="button">{saveSucceeded ? <CheckCircle2 size={16} /> : <Save size={16} />} {isSaving ? "Saving…" : saveSucceeded ? "Attendance saved" : "Save attendance"}</button></footer>
      </article>
      <aside className="staff-attendance-mini-summary"><div><strong>{marked}/{data.roster.length}</strong><span>Marked</span></div><div className="is-present"><strong>{present}</strong><span>Present</span></div><div className="is-late"><strong>{late}</strong><span>Late</span></div><div className="is-absent"><strong>{absent}</strong><span>Absent</span></div></aside>
    </section>
  );
}

const weekdays = [{ id: 1, label: "Monday" }, { id: 2, label: "Tuesday" }, { id: 3, label: "Wednesday" }, { id: 4, label: "Thursday" }, { id: 5, label: "Friday" }];

function SchedulePanel({ errorMessage, schedules, selectedId, onSelect }: { errorMessage: string; schedules: StaffSchedule[]; selectedId: string; onSelect: (id: string) => void }) {
  const selected = schedules.find((schedule) => schedule.accountId === selectedId) ?? schedules[0];
  const currentWeekday = new Date().getDay();
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [selectedDay, setSelectedDay] = useState(currentWeekday >= 1 && currentWeekday <= 5 ? currentWeekday : 1);
  const dailyItems = selected?.schedule.filter((item) => item.weekdays.includes(selectedDay)).sort((a, b) => a.startTime.localeCompare(b.startTime)) ?? [];
  return (
    <section className="staff-panel staff-weekly-schedule">
        <header className="staff-panel-header">
          <div><p>{view === "daily" ? "Daily agenda" : "Repeats every week"}</p><h2>{selected?.fullName ?? "Staff"}&apos;s schedule</h2></div>
          <div className="staff-schedule-controls"><div className="staff-view-toggle"><button className={view === "daily" ? "is-active" : ""} onClick={() => setView("daily")} type="button">Daily</button><button className={view === "weekly" ? "is-active" : ""} onClick={() => setView("weekly")} type="button">Weekly</button></div><label className="staff-schedule-picker"><span>View staff schedule</span><select value={selected?.accountId ?? ""} onChange={(event) => onSelect(event.target.value)}>{schedules.map((schedule) => <option key={schedule.accountId} value={schedule.accountId}>{schedule.fullName}</option>)}</select></label></div>
        </header>
        {errorMessage ? <p className="staff-attendance-message" role="alert">{errorMessage}</p> : view === "daily" ? <><div className="staff-day-tabs">{weekdays.map((day) => <button className={selectedDay === day.id ? "is-active" : ""} key={day.id} onClick={() => setSelectedDay(day.id)} type="button">{day.label}</button>)}</div><div className="staff-schedule-list">{dailyItems.length ? dailyItems.map((item, index) => <article className={`staff-schedule-item is-${["navy", "teal", "gold", "slate"][index % 4]}`} key={item.id}><div><strong>{displayTime(item.startTime)}</strong><span>{displayTime(item.endTime)}</span></div><div><h3>{item.title}</h3><p><MapPin size={14} /> {item.place}</p></div><ChevronRight aria-hidden="true" size={18} /></article>) : <p className="staff-empty-state">No activities scheduled for {weekdays[selectedDay - 1].label}.</p>}</div></> : <div className="staff-week-grid">
          {weekdays.map((day) => <section key={day.id}><header><strong>{day.label}</strong><span>Weekly</span></header><div>{selected?.schedule.filter((item) => item.weekdays.includes(day.id)).sort((a, b) => a.startTime.localeCompare(b.startTime)).map((item, index) => <article className={`staff-week-event is-tone-${index % 4}`} key={`${day.id}-${item.id}`}><time>{displayTime(item.startTime)} – {displayTime(item.endTime)}</time><h3>{item.title}</h3><p><MapPin size={12} /> {item.place}</p></article>)}</div></section>)}
        </div>}
    </section>
  );
}

function displayTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 1, hours, minutes)));
}

function StudentRosterPanel({ rows }: { rows: StaffDashboardData["roster"] }) {
  const [query, setQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [sortMode, setSortMode] = useState<"az" | "za">("az");
  const visibleRows = rows
    .filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))
    .sort((first, second) => sortMode === "az" ? first.name.localeCompare(second.name) : second.name.localeCompare(first.name));
  return (
    <section className="staff-panel">
      <header className="staff-panel-header"><div><p>Enrollment directory</p><h2>Student care roster</h2></div><div className="staff-roster-tools"><div className="staff-attendance-sort"><span>Sort</span><button className={sortMode === "az" ? "is-active" : ""} onClick={() => setSortMode("az")} type="button">A–Z</button><button className={sortMode === "za" ? "is-active" : ""} onClick={() => setSortMode("za")} type="button">Z–A</button></div><label className="staff-roster-search"><Search size={16} /><input aria-label="Search student roster" placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div></header>
      <div className="staff-roster-name-cards">
        {visibleRows.map((row) => {
          const isOpen = selectedStudentId === row.id;
          const hasAllergies = hasAllergyAlert(row.allergies);
          return <article className={isOpen ? "is-open" : ""} key={row.id}>
            {(hasAllergies || row.specialNotes) ? <div className="staff-roster-alert-icons" aria-label="Student alerts">{hasAllergies ? <span className="is-allergy" title={`Allergies: ${row.allergies}`}>A</span> : null}{row.specialNotes ? <span className="is-note" title={`Special notes: ${row.specialNotes}`}>!</span> : null}</div> : null}
            <button aria-expanded={isOpen} onClick={() => setSelectedStudentId(isOpen ? "" : row.id)} type="button"><span className="staff-avatar">{getInitials(row.name)}</span><span><strong>{row.name}</strong><small>{getStudentClass(row)}</small></span><ChevronRight size={15} /></button>
            {isOpen ? <div className="staff-student-detail"><header><div><span className="staff-avatar">{getInitials(row.name)}</span><div><strong>{row.name}</strong><small>{row.id} · {getStudentClass(row)}</small></div></div><button aria-label="Close student details" onClick={() => setSelectedStudentId("")} type="button"><X size={17} /></button></header><dl><div><dt>Date of birth</dt><dd>{row.dob || "Not entered"}</dd></div>{hasAllergies ? <div><dt>Allergies</dt><dd className="is-alert">{row.allergies}</dd></div> : null}<div><dt>Class</dt><dd>{getStudentClass(row)}</dd></div><div className="is-wide"><dt>Special notes</dt><dd>{row.specialNotes || "No special notes"}</dd></div></dl></div> : null}
          </article>;
        })}
      </div>
      {!visibleRows.length ? <p className="staff-roster-hint">No students match that search.</p> : null}
    </section>
  );
}

function SwimmingPanel({ data }: { data: StaffDashboardData }) {
  const [showOnlyPaidFees, setShowOnlyPaidFees] = useState(false);
  const [showOnlyWaiverComplete, setShowOnlyWaiverComplete] = useState(false);
  const rows = [...data.roster].sort((first, second) => first.name.localeCompare(second.name));
  const waiverCount = rows.filter((student) => data.swimmingRecords?.[student.id]?.waiverComplete).length;
  const paidCount = rows.filter((student) => data.swimmingRecords?.[student.id]?.paidFee).length;
  const visibleRows = rows.filter((student) => {
    const status = data.swimmingRecords?.[student.id];
    return (!showOnlyWaiverComplete || status?.waiverComplete) && (!showOnlyPaidFees || status?.paidFee);
  });
  const isFiltered = showOnlyPaidFees || showOnlyWaiverComplete;

  return (
    <section className="staff-panel staff-swimming-panel">
      <header className="staff-panel-header"><div><p>Swimming</p><h2>Class swimming roster</h2><small>Waiver and fee records are managed by an administrator.</small></div><span className="staff-swimming-total">{rows.length} students</span></header>
      <div className="staff-swimming-progress" aria-label="Swimming readiness summary"><span><CheckCircle2 size={16} /><strong>{waiverCount}</strong> waivers complete</span><span><CheckCircle2 size={16} /><strong>{paidCount}</strong> fees paid</span></div>
      <div className="staff-swimming-filters" aria-label="Filter swimming roster"><span>Show only</span><button aria-pressed={showOnlyWaiverComplete} className={showOnlyWaiverComplete ? "is-active" : ""} onClick={() => setShowOnlyWaiverComplete((current) => !current)} type="button"><CheckCircle2 size={15} /> Complete waivers</button><button aria-pressed={showOnlyPaidFees} className={showOnlyPaidFees ? "is-active" : ""} onClick={() => setShowOnlyPaidFees((current) => !current)} type="button"><CheckCircle2 size={15} /> Paid fees</button><em>{visibleRows.length} shown</em></div>
      <div className="staff-swimming-table-wrap">
        <table className="staff-swimming-table">
          <thead><tr><th scope="col">Student</th><th scope="col">Class</th><th scope="col">Waiver complete</th><th scope="col">Paid fee</th></tr></thead>
          <tbody>{visibleRows.map((student) => {
            const status = data.swimmingRecords?.[student.id];
            return <tr key={student.id}><th scope="row"><span className="staff-avatar">{getInitials(student.name)}</span><strong>{student.name}</strong></th><td>{getStudentClass(student)}</td><td><span aria-label={status?.waiverComplete ? "Waiver complete" : "Waiver incomplete"} className={`staff-swimming-check${status?.waiverComplete ? " is-checked" : ""}`}>{status?.waiverComplete ? <CheckCircle2 size={18} /> : null}</span></td><td><span aria-label={status?.paidFee ? "Fee paid" : "Fee unpaid"} className={`staff-swimming-check${status?.paidFee ? " is-checked" : ""}`}>{status?.paidFee ? <CheckCircle2 size={18} /> : null}</span></td></tr>;
          })}</tbody>
        </table>
        {!visibleRows.length ? <p className="staff-empty-state">{isFiltered ? "No students match the selected swimming filters." : "No students are assigned to this class roster."}</p> : null}
      </div>
    </section>
  );
}

function DismissalPanel({ date, isSaving, onChangeDate, onUpdate, rows }: { date: string; isSaving: string; onChangeDate: (date: string) => void; onUpdate: (student: StaffDashboardData["roster"][number], update: { date?: string; pickedUpEarly?: boolean; pickupTime?: string; vanRide?: "none" | "5pm" }) => void; rows: StaffDashboardData["roster"] }) {
  const [pickupTimeDrafts, setPickupTimeDrafts] = useState<Record<string, string>>({});
  const earlyCount = rows.filter((student) => student.earlyPickupDates?.includes(date)).length;
  const van5Count = rows.filter((student) => student.vanRide === "5pm").length;
  const isFuture = date > new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    // Hydrate the editable pickup-time draft when the roster date changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPickupTimeDrafts(Object.fromEntries(rows.map((student) => [student.id, student.earlyPickupTimes?.[date] ?? ""])));
  }, [date, rows]);

  return (
    <section className="staff-panel staff-dismissal-panel">
      <header className="staff-panel-header"><div><p>Daily departure</p><h2>Pickup and van roster</h2></div><label className="staff-dismissal-date">Roster date<input type="date" value={date} onChange={(event) => onChangeDate(event.target.value)} /></label></header>
      <div className="staff-dismissal-summary"><span><CheckCircle2 size={15} /><strong>{earlyCount}</strong> early pickup</span><span><Bus size={15} /><strong>{van5Count}</strong> van at 5 PM</span></div>
      {isFuture ? <p className="staff-attendance-future-notice"><CircleAlert size={15} /> Future dates are view-only.</p> : null}
      <div className="staff-dismissal-list">
        {rows.map((student) => {
          const pickedUpEarly = Boolean(student.earlyPickupDates?.includes(date));
          const pickupTime = pickupTimeDrafts[student.id] ?? "";
          const vanRide = student.vanRide ?? "none";
          const saving = isSaving === student.id;
          const pickupLabel = pickedUpEarly && student.earlyPickupTimes?.[date]
            ? `Picked up ${displayTime(student.earlyPickupTimes[date])}`
            : vanRide === "5pm" ? "Van - 5 PM" : "No van";
          return (
            <article key={student.id}>
              <span className="staff-avatar">{getInitials(student.name)}</span>
              <div><strong>{student.name}</strong><small className={`is-${vanRide}`}>{pickupLabel}</small></div>
              <label>Ride home<select disabled={saving} value={vanRide} onChange={(event) => onUpdate(student, { vanRide: event.target.value as "none" | "5pm" })}><option value="none">No van</option><option value="5pm">Van at 5 PM</option></select></label>
              <label>Time picked up<input disabled={saving || isFuture} type="time" value={pickupTime} onChange={(event) => setPickupTimeDrafts((current) => ({ ...current, [student.id]: event.target.value }))} /></label>
              <div className="staff-dismissal-actions">
                <button className={pickedUpEarly ? "is-early" : ""} disabled={saving || isFuture || !pickupTime} onClick={() => onUpdate(student, { date, pickedUpEarly: true, pickupTime })} type="button"><CheckCircle2 size={15} /> {pickedUpEarly ? "Save pickup time" : "Mark early pickup"}</button>
                {pickedUpEarly ? <button className="is-clear" disabled={saving || isFuture} onClick={() => onUpdate(student, { date, pickedUpEarly: false })} type="button">Clear</button> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StaffTasksPanel({ onToggle, tasks }: { onToggle: (task: StaffTask) => void; tasks: StaffTask[] }) {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const openTasks = tasks.filter((task) => task.status === "open");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  return <section className="staff-panel staff-tasks-panel"><header className="staff-panel-header"><div><p>Assigned work</p><h2>Today&apos;s tasks</h2><small>Weekly tasks appear here on their due day. Open overdue tasks stay visible.</small></div><span className="staff-task-count">{openTasks.length} open</span></header><div className="staff-task-list">{[...openTasks, ...completedTasks].length ? [...openTasks, ...completedTasks].map((task) => <article className={`${task.status === "completed" ? "is-completed" : ""} ${selectedTaskId === task.id ? "is-open" : ""}`} key={task.id}><button aria-label={`${task.status === "completed" ? "Reopen" : "Complete"} ${task.title}`} className="staff-task-check" onClick={() => onToggle(task)} type="button">{task.status === "completed" ? <CheckCircle2 size={16} /> : null}</button><button className="staff-task-summary" onClick={() => setSelectedTaskId(selectedTaskId === task.id ? "" : task.id)} type="button"><span><strong>{task.title}</strong><small>Due {task.dueDate}</small></span><ChevronRight size={16} /></button>{selectedTaskId === task.id ? <div className="staff-task-detail"><p>{task.description}</p><button onClick={() => onToggle(task)} type="button">{task.status === "completed" ? "Mark as open" : "Check off as complete"}</button></div> : null}</article>) : <p className="staff-empty-state">No tasks are due today.</p>}</div></section>;
}

function squidGradeLabel(grade: string) {
  return grade === "Unassigned" ? grade : `Grade ${grade}`;
}

function squidPlayerNumber(playerNumber: number) {
  return `Player ${String(playerNumber).padStart(3, "0")}`;
}

function SquidGamesPanel({
  data,
  message,
  onUpdatePoints,
  savingKey,
  staffAccountId,
}: {
  data: SquidGamesData;
  message: string;
  onUpdatePoints: (student: SquidGamesStudent, points: number) => void;
  savingKey: string;
  staffAccountId: string;
}) {
  const staffStudents = data.students
    .filter((student) => student.accountId === staffAccountId)
    .sort((first, second) => first.name.localeCompare(second.name, undefined, { sensitivity: "base" }));
  const groupedStudents = Array.from(staffStudents.reduce((groups, student) => {
    groups.set(student.grade, [...(groups.get(student.grade) ?? []), student]);
    return groups;
  }, new Map<string, SquidGamesStudent[]>())).sort(([first], [second]) => first.localeCompare(second, undefined, { numeric: true }));
  const enabledGrades = new Set(data.leaderboardGrades);
  const leaderboard = data.students
    .filter((student) => enabledGrades.has(student.grade))
    .sort((first, second) => second.points - first.points || first.name.localeCompare(second.name));

  return <section className="squid-games-workspace">
    <section className="staff-panel squid-games-rosters">
      <header className="staff-panel-header"><div><p>Score desk</p><h2>Students by grade</h2><small>Award points to students on your assigned roster.</small></div><span className="squid-games-total">{staffStudents.length} students</span></header>
      {message ? <p className="staff-attendance-message" role="status">{message}</p> : null}
      <div className="squid-games-grade-grid">
        {groupedStudents.map(([grade, students]) => <section key={grade}>
          <header><span>{squidGradeLabel(grade)}</span><strong>{students.length} · A–Z</strong></header>
          <div>{students.map((student) => {
            const key = `${student.accountId}:${student.studentId}`;
            const isSaving = savingKey === key;
            return <article key={key}><span className="staff-avatar">{getInitials(student.name)}</span><div><strong>{student.name}</strong><small><span className="squid-player-number">{squidPlayerNumber(student.playerNumber)}</span> · {student.className ?? squidGradeLabel(student.grade)}</small></div><div className="squid-games-point-actions" role="group" aria-label={`Points for ${student.name}`}><button aria-label={`Remove 50 points from ${student.name}`} disabled={isSaving || student.points === 0} onClick={() => onUpdatePoints(student, Math.max(0, student.points - 50))} type="button"><Minus size={15} /></button><output aria-live="polite">{student.points}<small> pts</small></output><button aria-label={`Add 50 points to ${student.name}`} disabled={isSaving} onClick={() => onUpdatePoints(student, student.points + 50)} type="button"><Plus size={15} /></button></div></article>;
          })}</div>
        </section>)}
        {!groupedStudents.length ? <p className="staff-empty-state">No students are assigned to this staff roster.</p> : null}
      </div>
    </section>
    <aside className="staff-panel squid-games-leaderboard">
      <header><span><Trophy size={18} /></span><div><p>School-wide</p><h2>Global leaderboard</h2></div></header>
      <small>{data.leaderboardGrades.length ? data.leaderboardGrades.map(squidGradeLabel).join(" · ") : "No grades selected by the administrator"}</small>
      <ol>{leaderboard.map((student, index) => <li key={`${student.accountId}:${student.studentId}`}><b>{index + 1}</b><span className="staff-avatar">{getInitials(student.name)}</span><div><strong>{student.name}</strong><small>{squidPlayerNumber(student.playerNumber)} · {squidGradeLabel(student.grade)} · {student.staffName}</small></div><em>{student.points} pts</em></li>)}</ol>
      {!leaderboard.length ? <p className="staff-empty-state">The leaderboard will appear after an administrator selects grades.</p> : null}
    </aside>
  </section>;
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
  const [savingDismissalId, setSavingDismissalId] = useState("");
  const [dismissalDate, setDismissalDate] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [previewReturnPath, setPreviewReturnPath] = useState("/teacher");
  const [staffName, setStaffName] = useState("Operations Staff");
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(getDefaultAttendanceDate);
  const [staffSchedules, setStaffSchedules] = useState<StaffSchedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [scheduleLoadMessage, setScheduleLoadMessage] = useState("");
  const [staffTasks, setStaffTasks] = useState<StaffTask[]>([]);
  const [staffAccountId, setStaffAccountId] = useState("");
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState("");
  const [squidGames, setSquidGames] = useState<SquidGamesData>({ availableGrades: [], leaderboardGrades: [], students: [] });
  const [squidGamesMessage, setSquidGamesMessage] = useState("");
  const [savingSquidGamesKey, setSavingSquidGamesKey] = useState("");

  const showSessionExpiredOverlay = useCallback((message = "Your session expired. Reload the staff dashboard before taking attendance or making changes.") => {
    setSessionExpiredMessage(message);
    setIsCheckingSession(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        showSessionExpiredOverlay("Your staff session is no longer active. Reload the page to reconnect before continuing.");
        return;
      }

      // The API validates every request. Using the locally verified session to
      // render immediately avoids blocking the whole dashboard on a second
      // Auth network request; requestApi refreshes a stale token once if needed.
      const currentUser = data.session.user;
      const role = getUserRole(currentUser);
      setAccessToken(data.session.access_token);
      setStaffAccountId(previewAccountId ?? currentUser.id);
      if (role === "admin") setPreviewReturnPath("/admin");
      if (role !== "staff" && !((role === "teacher" || role === "admin") && isStaffPreview)) {
        window.location.assign(getDashboardPath(role));
        return;
      }

      const [schedulesResult, tasksResult, dashboardResult, squidGamesResult] = await Promise.allSettled([
        getStaffSchedules(data.session.access_token),
        getStaffTasks(data.session.access_token),
        getStaffDashboard(data.session.access_token, previewAccountId ?? undefined),
        getSquidGames(data.session.access_token),
      ]);
      const expiredResult = [schedulesResult, tasksResult, dashboardResult, squidGamesResult]
        .find((result) => result.status === "rejected" && isSessionExpiredError(result.reason));
      if (expiredResult) {
        showSessionExpiredOverlay(expiredResult.status === "rejected" && expiredResult.reason instanceof Error ? expiredResult.reason.message : undefined);
        return;
      }
      if (schedulesResult.status === "fulfilled") {
        setStaffSchedules(schedulesResult.value);
        setScheduleLoadMessage("");
      } else {
        setScheduleLoadMessage(schedulesResult.reason instanceof Error ? schedulesResult.reason.message : "Schedules could not be loaded.");
      }
      if (tasksResult.status === "fulfilled") {
        setStaffTasks(previewAccountId ? tasksResult.value.filter((task) => task.assignedToId === previewAccountId) : tasksResult.value);
      }
      if (squidGamesResult.status === "fulfilled") setSquidGames(squidGamesResult.value);
      else setSquidGamesMessage(squidGamesResult.reason instanceof Error ? squidGamesResult.reason.message : "Squid Games could not be loaded.");
      setSelectedScheduleId(previewAccountId ?? currentUser.id);

      const metadata = currentUser.user_metadata as { dashboard_data?: StaffDashboardData; full_name?: string; name?: string; username?: string };
      const legacyDashboardData = metadata.dashboard_data;
      const loadedDashboardData = dashboardResult.status === "fulfilled" ? dashboardResult.value : legacyDashboardData;
      const normalizedDashboardData = metadata.username === "pss5" && !(loadedDashboardData?.roster?.length)
        ? { ...(loadedDashboardData ?? { attendance: [] }), roster: boazRoster }
        : loadedDashboardData ?? { attendance: [], roster: [] };
      setDashboardData(normalizedDashboardData);

      if (role === "admin" && isStaffPreview && previewAccountId) {
        const previewSchedule = schedulesResult.status === "fulfilled"
          ? schedulesResult.value.find((schedule) => schedule.accountId === previewAccountId)
          : undefined;
        setStaffName(previewSchedule?.fullName ?? "Staff account preview");
      } else {
        setStaffName(metadata.full_name ?? metadata.name ?? "Operations Staff");
      }
      setIsCheckingSession(false);
    }).catch(() => {
      showSessionExpiredOverlay("We could not reconnect to your staff session. Reload the page to try again.");
    });
  }, [showSessionExpiredOverlay]);

  useEffect(() => {
    const stored = dashboardData.attendanceRecords?.[selectedAttendanceDate] ?? {};
    // Hydrate the editable attendance draft when the staff account or school day changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttendanceStatuses(Object.fromEntries(dashboardData.roster.map((student) => [student.id, stored[student.id] ?? "Unmarked"])));
    setAttendanceSaveMessage((current) => current === "Attendance saved permanently" ? current : "");
  }, [dashboardData, selectedAttendanceDate]);

  const today = useMemo(
    () => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()),
    [],
  );

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  async function handleSaveAttendance() {
    if (!accessToken) return;
    if (!isStaffPreview && selectedAttendanceDate > new Date().toLocaleDateString("en-CA")) {
      setAttendanceSaveMessage("Staff cannot edit attendance for a future date.");
      return;
    }
    setIsSavingAttendance(true);
    setAttendanceSaveMessage("");
    try {
      const result = await saveStaffAttendance(accessToken, {
        accountId: previewAccountId ?? undefined,
        date: selectedAttendanceDate,
        statuses: attendanceStatuses,
      });
      const savedData = result.dashboardData;
      setDashboardData({ ...savedData, roster: savedData.roster?.length ? savedData.roster : dashboardData.roster });
      if (result.completedTask) {
        setStaffTasks((current) => [...current.filter((task) => task.id !== result.completedTask?.id), result.completedTask as StaffTask]);
      }
      setAttendanceSaveMessage("Attendance saved permanently");
    } catch (error) {
      if (isSessionExpiredError(error)) {
        showSessionExpiredOverlay();
        return;
      }
      setAttendanceSaveMessage(error instanceof Error ? error.message : "Attendance could not be saved.");
    } finally {
      setIsSavingAttendance(false);
    }
  }

  async function handleToggleTask(task: StaffTask) {
    if (!accessToken) return;
    try {
      const updated = await updateStaffTask(accessToken, task.id, task.status !== "completed");
      setStaffTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (error) {
      if (isSessionExpiredError(error)) {
        showSessionExpiredOverlay();
        return;
      }
      setAttendanceSaveMessage(error instanceof Error ? error.message : "Could not update the task.");
    }
  }

  async function handleDismissalUpdate(student: StaffDashboardData["roster"][number], update: { date?: string; pickedUpEarly?: boolean; pickupTime?: string; vanRide?: "none" | "5pm" }) {
    if (!accessToken) return;
    setSavingDismissalId(student.id);
    setAttendanceSaveMessage("");
    try {
      const result = await saveStaffDismissal(accessToken, { accountId: previewAccountId ?? undefined, studentId: student.id, ...update });
      setDashboardData(result.dashboardData);
      setAttendanceSaveMessage(`${student.name}'s dismissal information was saved.`);
    } catch (error) {
      if (isSessionExpiredError(error)) {
        showSessionExpiredOverlay();
        return;
      }
      setAttendanceSaveMessage(error instanceof Error ? error.message : "Could not update dismissal information.");
    } finally {
      setSavingDismissalId("");
    }
  }

  async function handleSquidGamesPoints(student: SquidGamesStudent, points: number) {
    if (!accessToken) return;
    const key = `${student.accountId}:${student.studentId}`;
    setSavingSquidGamesKey(key);
    setSquidGamesMessage("");
    try {
      const result = await saveSquidGamesPoints(accessToken, student.accountId, student.studentId, points);
      setSquidGames((current) => ({
        ...current,
        students: current.students.map((item) => item.accountId === result.accountId && item.studentId === result.studentId ? { ...item, points: result.points } : item),
      }));
      setDashboardData((current) => student.accountId === staffAccountId ? { ...current, roster: current.roster.map((item) => item.id === student.studentId ? { ...item, points: result.points } : item) } : current);
      setSquidGamesMessage(`${student.name} now has ${result.points} points.`);
    } catch (error) {
      if (isSessionExpiredError(error)) {
        showSessionExpiredOverlay();
        return;
      }
      setSquidGamesMessage(error instanceof Error ? error.message : "Could not update points.");
    } finally {
      setSavingSquidGamesKey("");
    }
  }

  if (isCheckingSession) return <main className="loading-shell">Loading staff workspace...</main>;

  const activeLabel = staffTabs.find((tab) => tab.id === activeTab)?.label ?? "Attendance";
  const presentCount = Object.values(attendanceStatuses).filter((status) => status === "Present" || status === "Late").length;
  const todayKey = new Date().toLocaleDateString("en-CA");
  const visibleStaffTasks = staffTasks.filter((task) => task.dueDate <= todayKey && (task.status === "open" || task.dueDate === todayKey));
  const openTaskCount = visibleStaffTasks.filter((task) => task.status === "open").length;
  const currentTimeKey = `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;
  const staffSchedule = staffSchedules.find((schedule) => schedule.accountId === staffAccountId);
  const currentDay = new Date().getDay();
  const currentActivity = staffSchedule?.schedule.find((item) => item.weekdays.includes(currentDay) && item.startTime <= currentTimeKey && item.endTime > currentTimeKey);
  const isFutureAttendance = !isStaffPreview && selectedAttendanceDate > new Date().toLocaleDateString("en-CA");

  return (
    <main className="staff-shell">
      {sessionExpiredMessage ? <div className="staff-session-expired" role="alertdialog" aria-modal="true" aria-labelledby="staff-session-expired-title"><div><CircleAlert size={34} /><h2 id="staff-session-expired-title">Session expired</h2><p>{sessionExpiredMessage}</p><button onClick={() => window.location.reload()} type="button">Reload dashboard</button></div></div> : null}
      <aside className={`staff-sidebar ${isNavigationOpen ? "is-open" : ""}`}>
        <button aria-label="Close navigation" className="staff-sidebar-close" onClick={() => setIsNavigationOpen(false)} type="button"><X size={18} /></button>
        <a className="staff-brand" href="/staff"><span>PSS</span><div><strong>Promise Summer School</strong><small>Student Operations</small></div></a>
        <nav aria-label="Staff tools">
          <p>Workspace</p>
          {staffTabs.map((tab) => {
            const Icon = tab.icon;
            return <button className={activeTab === tab.id ? "is-active" : ""} key={tab.id} onClick={() => { setActiveTab(tab.id); setIsNavigationOpen(false); }} type="button"><Icon size={18} /><span>{tab.label}</span><ChevronRight size={15} /></button>;
          })}
        </nav>
        <div className="staff-sidebar-support"><UserCheck size={18} /><div><strong>Teacher</strong><span>{staffName}</span></div></div>
        {isStaffPreview ? <a className="staff-signout" href={previewReturnPath}><LogOut size={17} /> Return to dashboard</a> : <button className="staff-signout" onClick={handleSignOut} type="button"><LogOut size={17} /> Sign out</button>}
      </aside>

      <section className="staff-main">
        <header className="staff-topbar">
          <button aria-label="Open navigation" className="staff-menu-button" onClick={() => setIsNavigationOpen((value) => !value)} type="button"><Menu size={20} /></button>
          <div><span>{today}</span><small>Campus operations are running normally</small></div>
          {!isStaffPreview ? <AccountSwitcher /> : null}
          <div className="staff-profile"><span>{getInitials(staffName)}</span><div><strong>{staffName}</strong><small>{isStaffPreview ? "Teacher preview" : "Staff account"}</small></div></div>
        </header>

        <div className="staff-content">
          <header className="staff-page-heading"><div><p><LayoutDashboard size={15} /> Student operations dashboard</p><h1>{activeLabel}</h1><span>Manage today&apos;s students, attendance, and program schedule.</span></div><button type="button"><Clock3 size={16} /> Last synced 8:14 AM</button></header>

          {activeTab === "attendance" ? <section className="staff-kpi-grid" aria-label="Operations summary">
            <article><span><UserCheck size={19} /></span><div><p>Students present</p><strong>{presentCount} <small>/ {dashboardData.roster.length}</small></strong></div><em>Live attendance</em></article>
            <article><span><CalendarDays size={19} /></span><div><p>Current activity</p><strong className="is-activity">{currentActivity?.title ?? "None"}</strong></div><em>{currentActivity ? `${displayTime(currentActivity.startTime)}–${displayTime(currentActivity.endTime)} · ${currentActivity.place}` : "No active schedule block"}</em></article>
            <article className="is-clickable"><button onClick={() => setActiveTab("tasks")} type="button"><span><CircleAlert size={19} /></span><div><p>Open tasks</p><strong>{openTaskCount}</strong></div><em className={openTaskCount ? "is-warning" : ""}>{openTaskCount ? "Needs attention" : "All complete"}</em></button></article>
          </section> : null}

          {attendanceSaveMessage && activeTab === "dismissal" ? <p className="staff-attendance-message" role="status">{attendanceSaveMessage}</p> : null}
          {activeTab === "attendance" ? <AttendancePanel data={dashboardData} date={selectedAttendanceDate} isFutureLocked={isFutureAttendance} isSaving={isSavingAttendance} onChangeDate={(date) => { setAttendanceSaveMessage(""); setSelectedAttendanceDate(date); }} onChangeStatus={(studentId, status) => { setAttendanceSaveMessage(""); setAttendanceStatuses((current) => ({ ...current, [studentId]: status })); }} onSave={handleSaveAttendance} saveMessage={attendanceSaveMessage} statuses={attendanceStatuses} /> : null}
          {activeTab === "schedule" ? <SchedulePanel errorMessage={scheduleLoadMessage} schedules={staffSchedules} selectedId={selectedScheduleId} onSelect={setSelectedScheduleId} /> : null}
          {activeTab === "roster" ? <StudentRosterPanel rows={dashboardData.roster} /> : null}
          {activeTab === "swimming" ? <SwimmingPanel data={dashboardData} /> : null}
          {activeTab === "dismissal" ? <DismissalPanel date={dismissalDate} isSaving={savingDismissalId} onChangeDate={setDismissalDate} onUpdate={handleDismissalUpdate} rows={dashboardData.roster} /> : null}
          {activeTab === "tasks" ? <StaffTasksPanel onToggle={handleToggleTask} tasks={visibleStaffTasks} /> : null}
          {activeTab === "squid-games" ? <SquidGamesPanel data={squidGames} message={squidGamesMessage} onUpdatePoints={handleSquidGamesPoints} savingKey={savingSquidGamesKey} staffAccountId={staffAccountId} /> : null}
        </div>
      </section>
    </main>
  );
}
