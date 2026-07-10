import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Cloud,
  DoorOpen,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MapPin,
  Menu,
  Search,
  Send,
  Save,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { deleteRoomBooking, getCampusRooms, getRoomBookings, getStaffAccounts, getStaffSchedules, getStaffTasks, requestRoomBooking, saveStaffAttendance, saveStaffDismissal, updateStaffTask, type CampusRoom, type RoomBooking, type StaffDashboardData, type StaffSchedule, type StaffTask } from "../lib/api";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { getFloorName } from "../lib/rooms";

type StaffTab = "attendance" | "schedule" | "25live" | "roster" | "dismissal" | "tasks";

const staffTabs = [
  { id: "attendance", label: "Attendance", icon: UserCheck },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "25live", label: "25Live", icon: Building2 },
  { id: "roster", label: "Roster", icon: Users },
  { id: "dismissal", label: "Dismissal", icon: Bus },
  { id: "tasks", label: "Tasks", icon: ListTodo },
] as const;

const defaultAttendanceRows: StaffDashboardData["attendance"] = [
  { name: "Aaliyah Johnson", group: "Grade 7 · Cohort A", time: "7:48 AM", status: "Present" },
  { name: "Ethan Williams", group: "Grade 8 · Cohort B", time: "8:02 AM", status: "Present" },
  { name: "Sofia Martinez", group: "Grade 6 · Cohort A", time: "8:11 AM", status: "Late" },
  { name: "Noah Thompson", group: "Grade 7 · Cohort C", time: "—", status: "Absent" },
];

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

function getDefaultAttendanceDate() {
  const today = new Date().toLocaleDateString("en-CA");
  return attendanceDates.includes(today) ? today : attendanceDates[0];
}

function isSessionExpiredError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes("session expired") || message.includes("log in to continue") || message.includes("jwt");
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
  statuses,
}: {
  data: StaffDashboardData;
  date: string;
  isSaving: boolean;
  isFutureLocked: boolean;
  onChangeDate: (date: string) => void;
  onChangeStatus: (studentId: string, status: "Absent" | "Late" | "Present" | "Unmarked") => void;
  onSave: () => void;
  statuses: Record<string, "Absent" | "Late" | "Present" | "Unmarked">;
}) {
  const [sortMode, setSortMode] = useState<"first" | "last">("first");
  const dateIndex = attendanceDates.indexOf(date);
  const values = Object.values(statuses);
  const present = values.filter((status) => status === "Present").length;
  const late = values.filter((status) => status === "Late").length;
  const absent = values.filter((status) => status === "Absent").length;
  const marked = present + late + absent;
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
        <footer className="staff-attendance-savebar"><div><Cloud size={17} /><span><strong>Permanent record</strong><small>{isFutureLocked ? "Future dates are locked" : "Saved securely to Supabase"}</small></span></div><button disabled={isSaving || marked === 0 || isFutureLocked} onClick={onSave} type="button"><Save size={16} /> {isSaving ? "Saving…" : "Save attendance"}</button></footer>
      </article>
      <aside className="staff-attendance-mini-summary"><div><strong>{marked}/{data.roster.length}</strong><span>Marked</span></div><div className="is-present"><strong>{present}</strong><span>Present</span></div><div className="is-late"><strong>{late}</strong><span>Late</span></div><div className="is-absent"><strong>{absent}</strong><span>Absent</span></div></aside>
    </section>
  );
}

const weekdays = [{ id: 1, label: "Monday" }, { id: 2, label: "Tuesday" }, { id: 3, label: "Wednesday" }, { id: 4, label: "Thursday" }, { id: 5, label: "Friday" }];

function SchedulePanel({ schedules, selectedId, onSelect }: { schedules: StaffSchedule[]; selectedId: string; onSelect: (id: string) => void }) {
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
        {view === "daily" ? <><div className="staff-day-tabs">{weekdays.map((day) => <button className={selectedDay === day.id ? "is-active" : ""} key={day.id} onClick={() => setSelectedDay(day.id)} type="button">{day.label}</button>)}</div><div className="staff-schedule-list">{dailyItems.length ? dailyItems.map((item, index) => <article className={`staff-schedule-item is-${["navy", "teal", "gold", "slate"][index % 4]}`} key={item.id}><div><strong>{displayTime(item.startTime)}</strong><span>{displayTime(item.endTime)}</span></div><div><h3>{item.title}</h3><p><MapPin size={14} /> {item.place}</p></div><ChevronRight aria-hidden="true" size={18} /></article>) : <p className="staff-empty-state">No activities scheduled for {weekdays[selectedDay - 1].label}.</p>}</div></> : <div className="staff-week-grid">
          {weekdays.map((day) => <section key={day.id}><header><strong>{day.label}</strong><span>Weekly</span></header><div>{selected?.schedule.filter((item) => item.weekdays.includes(day.id)).sort((a, b) => a.startTime.localeCompare(b.startTime)).map((item, index) => <article className={`staff-week-event is-tone-${index % 4}`} key={`${day.id}-${item.id}`}><time>{displayTime(item.startTime)} – {displayTime(item.endTime)}</time><h3>{item.title}</h3><p><MapPin size={12} /> {item.place}</p></article>)}</div></section>)}
        </div>}
    </section>
  );
}

function minutesToTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function displayTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 1, hours, minutes)));
}

function roomImagePath(roomId: string) {
  return `/images/rooms/${encodeURIComponent(roomId)}.jpg`;
}

function InteractiveTwentyFiveLivePanel({ accessToken, bookings, canBook, currentUserId, onBookingCreated, onBookingRemoved, rooms }: { accessToken: string; bookings: RoomBooking[]; canBook: boolean; currentUserId: string; onBookingCreated: (bookings: RoomBooking[]) => void; onBookingRemoved: (bookingId: string) => void; rooms: CampusRoom[] }) {
  const [selectedMinutes, setSelectedMinutes] = useState(8 * 60);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<{ floor: number; id: string; name: string } | null>(null);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<CampusRoom | null>(null);
  const [roomImageFailed, setRoomImageFailed] = useState(false);
  const [requestDraft, setRequestDraft] = useState({ description: "", eventName: "" });
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingBookingId, setRemovingBookingId] = useState("");
  const selectedTime = minutesToTime(selectedMinutes);
  const selectedEndTime = minutesToTime(Math.min(selectedMinutes + 60, 23 * 60 + 50));
  const floors = Array.from(new Set(rooms.map((room) => room.floor))).sort((a, b) => a - b);
  const activeFloor = floors.includes(selectedFloor) ? selectedFloor : floors[0] ?? 1;
  const floorRooms = rooms.filter((room) => room.floor === activeFloor);

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRoom) return;
    setIsSubmitting(true);
    setRequestMessage("");
    try {
      const createdBookings = await requestRoomBooking(accessToken, { ...requestDraft, date: selectedDate, endTime: selectedEndTime, floor: selectedRoom.floor, roomId: selectedRoom.id, roomName: selectedRoom.name, time: selectedTime });
      onBookingCreated(createdBookings);
      setSelectedRoom(null);
      setRequestDraft({ description: "", eventName: "" });
      setRequestMessage("Room request sent for administrator approval.");
    } catch (error) {
      setRequestMessage(error instanceof Error ? error.message : "Could not submit the room request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeBooking(bookingId: string) {
    if (!window.confirm("Remove this room booking? This action cannot be undone.")) return;
    setRemovingBookingId(bookingId);
    setRequestMessage("");
    try {
      await deleteRoomBooking(accessToken, bookingId);
      onBookingRemoved(bookingId);
      setRequestMessage("Room booking removed.");
    } catch (error) {
      setRequestMessage(error instanceof Error ? error.message : "Could not remove the room booking.");
    } finally {
      setRemovingBookingId("");
    }
  }

  return (
    <section className="staff-panel staff-25live-panel staff-floor-workspace">
      <header className="staff-panel-header"><div><p>Space management</p><h2>Live room availability</h2><small>Choose an available room below to submit a booking request.</small></div><span className="staff-live-time">{displayTime(selectedTime)}</span></header>
      <div className="staff-time-control"><div><span>8:00 AM</span><input aria-label="Room availability time" min={480} max={1080} step={10} type="range" value={selectedMinutes} onChange={(event) => setSelectedMinutes(Number(event.target.value))} /><span>6:00 PM</span></div><label>Date<input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label><label>Start time<input step={600} type="time" value={selectedTime} onChange={(event) => { const [hours, minutes] = event.target.value.split(":").map(Number); if (Number.isFinite(hours) && Number.isFinite(minutes)) setSelectedMinutes(Math.min(1080, Math.max(480, hours * 60 + Math.round(minutes / 10) * 10))); }} /></label></div>
      <div className="staff-floor-tabs">{floors.map((floorNumber) => <button className={activeFloor === floorNumber ? "is-active" : ""} key={floorNumber} onClick={() => setSelectedFloor(floorNumber)} type="button">{getFloorName(floorNumber)}</button>)}</div>
      <div className={`staff-floor-plan is-floor-${activeFloor} ${floorRooms.length > 4 ? "is-expanded" : ""}`}>
        {floorRooms.length <= 4 ? <div className="staff-floor-corridor"><span>{getFloorName(activeFloor)} corridor</span></div> : null}
        {floorRooms.map((room, index) => {
          const approved = bookings.find((booking) => booking.roomId === room.id && booking.date === selectedDate && booking.time <= selectedTime && (booking.endTime ?? booking.time) > selectedTime && booking.status === "approved");
          const pending = bookings.find((booking) => booking.roomId === room.id && booking.date === selectedDate && booking.time <= selectedTime && (booking.endTime ?? booking.time) > selectedTime && booking.status === "pending");
          const availability = approved ? "booked" : pending ? "pending" : "available";
          return <article className={`staff-floor-room room-${index + 1} is-${availability}`} key={room.id}><span>{availability === "booked" ? "Booked" : availability === "pending" ? "Pending" : "Available"}</span><strong>{room.name}</strong>{approved ? <em>{approved.eventName}</em> : null}<button onClick={() => { setSelectedRoomDetails(room); setRoomImageFailed(false); }} type="button">View details</button></article>;
        })}
      </div>
      <section className="staff-my-bookings" aria-labelledby="my-room-bookings-title">
        <header><div><span>My reservations</span><h3 id="my-room-bookings-title">Room bookings</h3></div><small>{bookings.filter((booking) => booking.requestedById === currentUserId).length} total</small></header>
        <div>{bookings.filter((booking) => booking.requestedById === currentUserId).sort((left, right) => left.date.localeCompare(right.date) || left.time.localeCompare(right.time)).map((booking) => <article key={booking.id}><div><strong>{booking.eventName}</strong><span>{booking.roomName} · {booking.date} · {displayTime(booking.time)}–{displayTime(booking.endTime)}</span></div><em className={`is-${booking.status}`}>{booking.status}</em><button disabled={removingBookingId === booking.id} onClick={() => removeBooking(booking.id)} type="button"><Trash2 size={14} /> {removingBookingId === booking.id ? "Removing…" : "Remove"}</button></article>)}</div>
        {!bookings.some((booking) => booking.requestedById === currentUserId) ? <p>No room bookings yet.</p> : null}
      </section>
      {selectedRoomDetails ? <article className="staff-room-detail"><div className="staff-room-photo">{!roomImageFailed ? <img alt={`${selectedRoomDetails.name} room`} onError={() => setRoomImageFailed(true)} src={roomImagePath(selectedRoomDetails.id)} /> : <div><Building2 size={28} /><strong>Room photo</strong><small>Add <code>client/public/images/rooms/{selectedRoomDetails.id}.jpg</code></small></div>}</div><div className="staff-room-detail-copy"><header><div><span>{getFloorName(selectedRoomDetails.floor)}</span><h3>{selectedRoomDetails.name}</h3></div><button aria-label="Close room details" onClick={() => setSelectedRoomDetails(null)} type="button"><X size={17} /></button></header><p><Users size={15} /> {selectedRoomDetails.capacity} seats</p><small>Photos are loaded directly from the application code and are not stored in Supabase.</small><div className="staff-room-booking-details">{bookings.filter((booking) => booking.roomId === selectedRoomDetails.id && booking.date === selectedDate && booking.time <= selectedTime && (booking.endTime ?? booking.time) > selectedTime && booking.status !== "rejected").map((booking) => <article className={`is-${booking.status}`} key={booking.id}><span>{booking.status === "approved" ? "Booked" : "Request pending"}</span><strong>{booking.eventName}</strong><small>{displayTime(booking.time)}–{displayTime(booking.endTime)} · {booking.requestedByName}</small><p>{booking.description}</p></article>)}</div><button disabled={!canBook || Boolean(bookings.find((booking) => booking.roomId === selectedRoomDetails.id && booking.date === selectedDate && booking.time <= selectedTime && (booking.endTime ?? booking.time) > selectedTime && booking.status === "approved"))} onClick={() => { setSelectedRoom({ floor: selectedRoomDetails.floor, id: selectedRoomDetails.id, name: selectedRoomDetails.name }); setSelectedRoomDetails(null); }} type="button"><DoorOpen size={15} /> {bookings.some((booking) => booking.roomId === selectedRoomDetails.id && booking.date === selectedDate && booking.status === "pending") ? "Submit another request" : "Book this room"}</button></div></article> : null}
      {requestMessage ? <p className="staff-attendance-message">{requestMessage}</p> : null}
      {selectedRoom ? <form className="staff-booking-form" onSubmit={submitRequest}><header><div><DoorOpen size={18} /><span><strong>{selectedRoom.name}</strong><small>{getFloorName(selectedRoom.floor)} · {selectedDate} · {displayTime(selectedTime)}</small></span></div><button aria-label="Close booking request" onClick={() => setSelectedRoom(null)} type="button">×</button></header><label>Name of event<input required value={requestDraft.eventName} onChange={(event) => setRequestDraft({ ...requestDraft, eventName: event.target.value })} /></label><label>Booking time<input readOnly value={`${displayTime(selectedTime)} – ${displayTime(selectedEndTime)}`} /></label><label>Event description<textarea required rows={3} value={requestDraft.description} onChange={(event) => setRequestDraft({ ...requestDraft, description: event.target.value })} /></label><button disabled={isSubmitting} type="submit"><Send size={15} /> {isSubmitting ? "Sending…" : "Request room"}</button></form> : null}
    </section>
  );
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

function DismissalPanel({ date, isSaving, onChangeDate, onUpdate, rows }: { date: string; isSaving: string; onChangeDate: (date: string) => void; onUpdate: (student: StaffDashboardData["roster"][number], update: { date?: string; pickedUpEarly?: boolean; pickupTime?: string; vanRide?: "none" | "2pm" | "5pm" }) => void; rows: StaffDashboardData["roster"] }) {
  const [pickupTimeDrafts, setPickupTimeDrafts] = useState<Record<string, string>>({});
  const earlyCount = rows.filter((student) => student.earlyPickupDates?.includes(date)).length;
  const van2Count = rows.filter((student) => student.vanRide === "2pm").length;
  const van5Count = rows.filter((student) => student.vanRide === "5pm").length;
  const isFuture = date > new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    setPickupTimeDrafts(Object.fromEntries(rows.map((student) => [student.id, student.earlyPickupTimes?.[date] ?? ""])));
  }, [date, rows]);

  return (
    <section className="staff-panel staff-dismissal-panel">
      <header className="staff-panel-header"><div><p>Daily departure</p><h2>Pickup and van roster</h2></div><label className="staff-dismissal-date">Roster date<input type="date" value={date} onChange={(event) => onChangeDate(event.target.value)} /></label></header>
      <div className="staff-dismissal-summary"><span><CheckCircle2 size={15} /><strong>{earlyCount}</strong> early pickup</span><span><Bus size={15} /><strong>{van2Count}</strong> van at 2 PM</span><span><Bus size={15} /><strong>{van5Count}</strong> van at 5 PM</span></div>
      {isFuture ? <p className="staff-attendance-future-notice"><CircleAlert size={15} /> Future dates are view-only.</p> : null}
      <div className="staff-dismissal-list">
        {rows.map((student) => {
          const pickedUpEarly = Boolean(student.earlyPickupDates?.includes(date));
          const pickupTime = pickupTimeDrafts[student.id] ?? "";
          const vanRide = student.vanRide ?? "none";
          const saving = isSaving === student.id;
          const pickupLabel = pickedUpEarly && student.earlyPickupTimes?.[date]
            ? `Picked up ${displayTime(student.earlyPickupTimes[date])}`
            : vanRide === "2pm" ? "Van - 2 PM" : vanRide === "5pm" ? "Van - 5 PM" : "No van";
          return (
            <article key={student.id}>
              <span className="staff-avatar">{getInitials(student.name)}</span>
              <div><strong>{student.name}</strong><small className={`is-${vanRide}`}>{pickupLabel}</small></div>
              <label>Ride home<select disabled={saving} value={vanRide} onChange={(event) => onUpdate(student, { vanRide: event.target.value as "none" | "2pm" | "5pm" })}><option value="none">No van</option><option value="2pm">Van at 2 PM</option><option value="5pm">Van at 5 PM</option></select></label>
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
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [campusRooms, setCampusRooms] = useState<CampusRoom[]>([]);
  const [staffSchedules, setStaffSchedules] = useState<StaffSchedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [staffTasks, setStaffTasks] = useState<StaffTask[]>([]);
  const [staffAccountId, setStaffAccountId] = useState("");
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState("");

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

      const freshUserResult = await supabase.auth.getUser();
      if (freshUserResult.error) {
        showSessionExpiredOverlay();
        return;
      }
      const currentUser = freshUserResult.data.user ?? data.session.user;
      const role = getUserRole(currentUser);
      setAccessToken(data.session.access_token);
      setStaffAccountId(previewAccountId ?? currentUser.id);
      if (role === "admin") setPreviewReturnPath("/admin");
      if (role !== "staff" && !((role === "teacher" || role === "admin") && isStaffPreview)) {
        window.location.assign(getDashboardPath(role));
        return;
      }

      try {
        const [loadedBookings, loadedSchedules, loadedRooms, loadedTasks] = await Promise.all([getRoomBookings(data.session.access_token), getStaffSchedules(data.session.access_token), getCampusRooms(data.session.access_token), getStaffTasks(data.session.access_token)]);
        setRoomBookings(loadedBookings);
        setStaffSchedules(loadedSchedules);
        setCampusRooms(loadedRooms);
        setStaffTasks(previewAccountId ? loadedTasks.filter((task) => task.assignedToId === previewAccountId) : loadedTasks);
        setSelectedScheduleId(previewAccountId ?? currentUser.id);
      } catch (error) {
        if (isSessionExpiredError(error)) {
          showSessionExpiredOverlay();
          return;
        }
        setRoomBookings([]);
      }

      const metadata = currentUser.user_metadata as { full_name?: string; name?: string };
      if (role === "admin" && isStaffPreview && previewAccountId) {
        try {
          const accounts = await getStaffAccounts(data.session.access_token);
          const selectedAccount = accounts.find((account) => account.id === previewAccountId);
          setStaffName(selectedAccount?.fullName ?? "Staff account preview");
          setDashboardData(selectedAccount?.dashboardData ?? { attendance: [], roster: [] });
        } catch (error) {
          if (isSessionExpiredError(error)) {
            showSessionExpiredOverlay();
            return;
          }
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
  }, [showSessionExpiredOverlay]);

  useEffect(() => {
    const stored = dashboardData.attendanceRecords?.[selectedAttendanceDate] ?? {};
    // Hydrate the editable attendance draft when the staff account or school day changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  async function handleDismissalUpdate(student: StaffDashboardData["roster"][number], update: { date?: string; pickedUpEarly?: boolean; pickupTime?: string; vanRide?: "none" | "2pm" | "5pm" }) {
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

  if (isCheckingSession) return <main className="loading-shell">Loading staff workspace...</main>;

  const activeLabel = staffTabs.find((tab) => tab.id === activeTab)?.label ?? "Attendance";
  const presentCount = Object.values(attendanceStatuses).filter((status) => status === "Present" || status === "Late").length;
  const todayKey = new Date().toLocaleDateString("en-CA");
  const visibleStaffTasks = staffTasks.filter((task) => task.dueDate <= todayKey && (task.status === "open" || task.dueDate === todayKey));
  const openTaskCount = visibleStaffTasks.filter((task) => task.status === "open").length;
  const currentTimeKey = `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;
  const roomsInUse = new Set(roomBookings.filter((booking) => booking.status === "approved" && booking.date === todayKey && booking.time <= currentTimeKey && booking.endTime > currentTimeKey).map((booking) => booking.roomId)).size;
  const staffSchedule = staffSchedules.find((schedule) => schedule.accountId === staffAccountId);
  const currentDay = new Date().getDay();
  const currentActivity = staffSchedule?.schedule.find((item) => item.weekdays.includes(currentDay) && item.startTime <= currentTimeKey && item.endTime > currentTimeKey);
  const pendingRoomRequests = roomBookings.filter((booking) => booking.requestedById === staffAccountId && booking.status === "pending").length;
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
          <div className="staff-profile"><span>{getInitials(staffName)}</span><div><strong>{staffName}</strong><small>{isStaffPreview ? "Teacher preview" : "Staff account"}</small></div></div>
        </header>

        <div className="staff-content">
          <header className="staff-page-heading"><div><p><LayoutDashboard size={15} /> Student operations dashboard</p><h1>{activeLabel}</h1><span>Manage today&apos;s students, spaces, and program schedule.</span></div><button type="button"><Clock3 size={16} /> Last synced 8:14 AM</button></header>

          {activeTab === "attendance" ? <section className="staff-kpi-grid" aria-label="Operations summary">
            <article><span><UserCheck size={19} /></span><div><p>Students present</p><strong>{presentCount} <small>/ {dashboardData.roster.length}</small></strong></div><em>Live attendance</em></article>
            <article><span><CalendarDays size={19} /></span><div><p>Current activity</p><strong className="is-activity">{currentActivity?.title ?? "None"}</strong></div><em>{currentActivity ? `${displayTime(currentActivity.startTime)}–${displayTime(currentActivity.endTime)} · ${currentActivity.place}` : "No active schedule block"}</em></article>
            <article><span><Building2 size={19} /></span><div><p>Pending room requests</p><strong>{pendingRoomRequests}</strong></div><em>{pendingRoomRequests ? "Awaiting administrator review" : `${roomsInUse} rooms currently in use`}</em></article>
            <article className="is-clickable"><button onClick={() => setActiveTab("tasks")} type="button"><span><CircleAlert size={19} /></span><div><p>Open tasks</p><strong>{openTaskCount}</strong></div><em className={openTaskCount ? "is-warning" : ""}>{openTaskCount ? "Needs attention" : "All complete"}</em></button></article>
          </section> : null}

          {attendanceSaveMessage && (activeTab === "attendance" || activeTab === "dismissal") ? <p className="staff-attendance-message" role="status">{attendanceSaveMessage}</p> : null}
          {activeTab === "attendance" ? <AttendancePanel data={dashboardData} date={selectedAttendanceDate} isFutureLocked={isFutureAttendance} isSaving={isSavingAttendance} onChangeDate={setSelectedAttendanceDate} onChangeStatus={(studentId, status) => setAttendanceStatuses((current) => ({ ...current, [studentId]: status }))} onSave={handleSaveAttendance} statuses={attendanceStatuses} /> : null}
          {activeTab === "schedule" ? <SchedulePanel schedules={staffSchedules} selectedId={selectedScheduleId} onSelect={setSelectedScheduleId} /> : null}
          {activeTab === "25live" ? <InteractiveTwentyFiveLivePanel accessToken={accessToken} bookings={roomBookings} canBook={Boolean(accessToken)} currentUserId={staffAccountId} onBookingCreated={(createdBookings) => setRoomBookings((current) => [...current, ...createdBookings])} onBookingRemoved={(bookingId) => setRoomBookings((current) => current.filter((booking) => booking.id !== bookingId))} rooms={campusRooms} /> : null}
          {activeTab === "roster" ? <StudentRosterPanel rows={dashboardData.roster} /> : null}
          {activeTab === "dismissal" ? <DismissalPanel date={dismissalDate} isSaving={savingDismissalId} onChangeDate={setDismissalDate} onUpdate={handleDismissalUpdate} rows={dashboardData.roster} /> : null}
          {activeTab === "tasks" ? <StaffTasksPanel onToggle={handleToggleTask} tasks={visibleStaffTasks} /> : null}
        </div>
      </section>
    </main>
  );
}
