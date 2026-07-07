import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Check, CheckCircle2, ClipboardCheck, Cloud, Copy, Eye, FileSpreadsheet, LayoutDashboard, ListTodo, Pencil, Plus, RefreshCw, ShieldCheck, Trash2, UserCog, UserRoundPlus, Users, X } from "lucide-react";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { assignStaffAccount, createStaffTask, deleteRoomBooking, deleteStaffTask, getCampusRooms, getGoogleSheetsAttendanceSettings, getRoomBookings, getStaffAccounts, getStaffSchedules, getStaffTasks, getSwitchableAccounts, requestRoomBooking, reviewRoomBooking, saveCampusRooms, saveGoogleSheetsAttendanceSettings, saveRosterStudent, saveStaffClasses, saveStaffSchedule, syncGoogleSheetsAttendance, updateRoomBooking, updateStaffAccount, updateStaffTask, type CampusRoom, type RoomBooking, type ScheduleItem, type StaffAccount, type StaffSchedule, type StaffTask, type SwitchableAccount } from "../lib/api";
import { switchFromAdminToTeacher } from "../lib/accountSwitching";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { getFloorName } from "../lib/rooms";

const googleSheetsScript = `const HEADERS = ["Date", "Staff", "Username", "Student ID", "Student", "Status"];

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  const rows = payload.rows || [];
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName("Attendance") || book.insertSheet("Attendance");

  if (payload.event === "attendance.bulk_sync") sheet.clearContents();
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

  const existing = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues()
    : [];
  const rowByKey = {};
  existing.forEach((row, index) => rowByKey[[row[0], row[2], row[3]].join("|")] = index + 2);

  rows.forEach((item) => {
    const values = [item.date, item.staffName, item.username, item.studentId, item.studentName, item.status];
    const key = [item.date, item.username, item.studentId].join("|");
    if (rowByKey[key]) sheet.getRange(rowByKey[key], 1, 1, values.length).setValues([values]);
    else {
      sheet.appendRow(values);
      rowByKey[key] = sheet.getLastRow();
    }
  });

  return ContentService.createTextOutput(JSON.stringify({ ok: true, rows: rows.length }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

const defaultAdminRooms: CampusRoom[] = [
  { capacity: 20, floor: 0, id: "ll-1", name: "Room LL1" }, { capacity: 20, floor: 0, id: "ll-2", name: "Room LL2" }, { capacity: 48, floor: 0, id: "ll-multipurpose", name: "Lower Level Multipurpose" }, { capacity: 36, floor: 0, id: "ll-commons", name: "Lower Level Commons" },
  { capacity: 24, floor: 1, id: "101", name: "Room 101" }, { capacity: 24, floor: 1, id: "102", name: "Room 102" }, { capacity: 80, floor: 1, id: "commons", name: "Student Commons" }, { capacity: 16, floor: 1, id: "conf-a", name: "Conference A" },
  { capacity: 28, floor: 2, id: "201", name: "Room 201" }, { capacity: 28, floor: 2, id: "202", name: "Room 202" }, { capacity: 28, floor: 2, id: "203", name: "Room 203" }, { capacity: 30, floor: 2, id: "lab", name: "Testing Lab" },
  { capacity: 22, floor: 3, id: "301", name: "Room 301" }, { capacity: 22, floor: 3, id: "302", name: "Room 302" }, { capacity: 40, floor: 3, id: "studio", name: "Activity Studio" }, { capacity: 36, floor: 3, id: "library", name: "Library" },
];

const weekdayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function gradeClassName(grade: string) {
  const value = Number(grade);
  if (!Number.isInteger(value)) return "Unassigned class";
  const suffix = value % 10 === 1 && value !== 11 ? "st" : value % 10 === 2 && value !== 12 ? "nd" : value % 10 === 3 && value !== 13 ? "rd" : "th";
  return `${value}${suffix} Grade`;
}

export function AdminDashboardPage() {
  const [accessToken, setAccessToken] = useState("");
  const [adminName, setAdminName] = useState("Administrator");
  const [draft, setDraft] = useState({ fullName: "", password: "", username: "" });
  const [editingAccountId, setEditingAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState("2026-07-06");
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState("");
  const [sheetsConfigured, setSheetsConfigured] = useState(false);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [adminRooms, setAdminRooms] = useState<CampusRoom[]>(defaultAdminRooms);
  const [newRoomDraft, setNewRoomDraft] = useState({ capacity: 20, floor: 1, name: "" });
  const [editingBookingId, setEditingBookingId] = useState("");
  const [editingStudentId, setEditingStudentId] = useState("");
  const [studentDraft, setStudentDraft] = useState({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" });
  const [classDraft, setClassDraft] = useState("");
  const [staffSchedules, setStaffSchedules] = useState<StaffSchedule[]>([]);
  const [editingScheduleItemId, setEditingScheduleItemId] = useState("");
  const [scheduleDraft, setScheduleDraft] = useState({ endTime: "09:30", place: "", startTime: "08:30", studentIds: [] as string[], title: "", weekdays: [1, 2, 3, 4, 5] });
  const [bookingDraft, setBookingDraft] = useState({ date: new Date().toLocaleDateString("en-CA"), description: "", endTime: "10:00", eventName: "", floor: 1, repeatUntil: "", roomId: "101", roomName: "Room 101", time: "09:00", weeklyRepeat: false });
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [taskDraft, setTaskDraft] = useState({ assignedToId: "", description: "", dueDate: new Date().toLocaleDateString("en-CA"), title: "" });
  const [switchableAccounts, setSwitchableAccounts] = useState<SwitchableAccount[]>([]);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);
  const [isAttendanceTrackerOpen, setIsAttendanceTrackerOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ text: string; tone: "error" | "loading" | "success" } | null>(null);

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

      const accountsResult = await Promise.allSettled([getStaffAccounts(data.session.access_token)]).then(([result]) => result);

      if (accountsResult.status === "fulfilled") {
        const accounts = accountsResult.value;
        setStaffAccounts(accounts);
        if (accounts[0]) setTaskDraft((current) => ({ ...current, assignedToId: accounts[0].id }));
        const firstWithAttendance = accounts.find((account) => Object.keys(account.dashboardData.attendanceRecords ?? {}).length) ?? accounts[0];
        if (firstWithAttendance) {
          setSelectedStaffId(firstWithAttendance.id);
          const dates = Object.keys(firstWithAttendance.dashboardData.attendanceRecords ?? {}).sort();
          if (dates.length) setSelectedAttendanceDate(dates[dates.length - 1]);
        }
      } else {
        const reason = accountsResult.reason;
        setMessage(reason instanceof Error ? reason.message : "Could not load staff accounts.");
      }
      // Staff, rosters, and attendance are the primary admin records. Render
      // them as soon as they arrive instead of waiting for every optional tool.
      setIsLoading(false);

      const results = await Promise.allSettled([
          getGoogleSheetsAttendanceSettings(data.session.access_token),
          getRoomBookings(data.session.access_token),
          getStaffSchedules(data.session.access_token),
          getCampusRooms(data.session.access_token),
          getStaffTasks(data.session.access_token),
          getSwitchableAccounts(data.session.access_token),
        ] as const);
      const [sheetsResult, bookingsResult, schedulesResult, roomsResult, tasksResult, choicesResult] = results;
      if (sheetsResult.status === "fulfilled") {
        setSheetsWebhookUrl(sheetsResult.value.webhookUrl);
        setSheetsConfigured(sheetsResult.value.configured);
      }
      if (bookingsResult.status === "fulfilled") setBookings(bookingsResult.value);
      if (schedulesResult.status === "fulfilled") setStaffSchedules(schedulesResult.value);
      if (roomsResult.status === "fulfilled") setAdminRooms(roomsResult.value);
      if (tasksResult.status === "fulfilled") setTasks(tasksResult.value);
      if (choicesResult.status === "fulfilled") setSwitchableAccounts(choicesResult.value);

      const failures = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
      if (failures.length) {
        const firstFailure = failures[0].reason;
        const detail = firstFailure instanceof Error ? firstFailure.message : "A dashboard request failed.";
        setMessage((current) => current || `Some dashboard tools could not load. ${detail}`);
      }
    });
  }, []);

  async function handleAssignStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;

    setIsSaving(true);
    setMessage("");
    setActionFeedback({ text: editingAccountId ? "Updating staff access…" : "Assigning staff access…", tone: "loading" });
    try {
      const account = editingAccountId
        ? await updateStaffAccount(accessToken, editingAccountId, draft)
        : await assignStaffAccount(accessToken, draft);
      setStaffAccounts((current) => [...current.filter((item) => item.id !== account.id), account].sort((a, b) => a.fullName.localeCompare(b.fullName)));
      setTasks((current) => current.map((task) => task.assignedToId === account.id ? { ...task, assignedToName: account.fullName } : task));
      setDraft({ fullName: "", password: "", username: "" });
      setEditingAccountId("");
      const successMessage = editingAccountId ? `${account.fullName}'s account was updated.` : `${account.fullName} now has permanent staff access.`;
      setMessage(successMessage);
      setActionFeedback({ text: successMessage, tone: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not save the account.";
      setMessage(errorMessage);
      setActionFeedback({ text: errorMessage, tone: "error" });
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

  async function handleSwitchAccount() {
    const teacherAccount = switchableAccounts[0];
    if (!accessToken || !teacherAccount) {
      setMessage("No teacher account is available to switch to.");
      return;
    }
    setIsSwitchingAccount(true);
    setMessage("");
    try {
      await switchFromAdminToTeacher(accessToken, teacherAccount.id);
      window.location.assign("/teacher");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not switch accounts.");
      setIsSwitchingAccount(false);
    }
  }

  async function handleSaveSheets() {
    if (!accessToken) return;
    setIsSyncingSheets(true);
    setMessage("");
    try {
      const settings = await saveGoogleSheetsAttendanceSettings(accessToken, sheetsWebhookUrl);
      setSheetsConfigured(settings.configured);
      setSheetsWebhookUrl(settings.webhookUrl);
      setMessage(settings.configured ? "Google Sheets connection saved. New attendance will sync automatically." : "Google Sheets connection removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the Google Sheets connection.");
    } finally {
      setIsSyncingSheets(false);
    }
  }

  async function handleSyncSheets() {
    if (!accessToken) return;
    setIsSyncingSheets(true);
    setMessage("");
    try {
      const result = await syncGoogleSheetsAttendance(accessToken);
      setMessage(`${result.rowCount} attendance records synced to Google Sheets.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sync attendance.");
    } finally {
      setIsSyncingSheets(false);
    }
  }

  async function handleCopySheetsScript() {
    await navigator.clipboard.writeText(googleSheetsScript);
    setMessage("Apps Script copied. Paste it into your spreadsheet's Apps Script editor.");
  }

  async function handleSaveStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !selectedAccount) return;
    setIsSaving(true);
    setMessage("");
    setActionFeedback({ text: editingBookingId ? "Updating room booking…" : "Booking room…", tone: "loading" });
    try {
      const result = await saveRosterStudent(accessToken, selectedAccount.id, { ...studentDraft, id: editingStudentId || undefined });
      setStaffAccounts((current) => current.map((account) => account.id === selectedAccount.id ? { ...account, dashboardData: result.dashboardData } : account));
      setEditingStudentId("");
      setStudentDraft({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" });
      setMessage(`${result.student.name} was saved to ${selectedAccount.fullName}'s roster.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the student.");
    } finally {
      setIsSaving(false);
    }
  }

  function beginEditingStudent(student: StaffAccount["dashboardData"]["roster"][number]) {
    const nameParts = student.name.trim().split(/\s+/);
    setEditingStudentId(student.id);
    setStudentDraft({
      allergies: student.allergies ?? "",
      className: student.className ?? gradeClassName(student.grade),
      dob: student.dob ?? "",
      firstName: student.firstName ?? nameParts[0] ?? "",
      lastName: student.lastName ?? nameParts.slice(1).join(" "),
      specialNotes: student.specialNotes ?? "",
    });
    document.getElementById("student-roster")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleReviewBooking(bookingId: string, status: "approved" | "rejected") {
    if (!accessToken) return;
    setMessage("");
    try {
      const updated = await reviewRoomBooking(accessToken, bookingId, status);
      setBookings((current) => current.map((booking) => booking.id === updated.id ? updated : booking));
      setMessage(`Room request ${status}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not review the request.");
    }
  }

  async function handleCreateBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setIsSaving(true);
    setMessage("");
    try {
      if (editingBookingId) {
        const updated = await updateRoomBooking(accessToken, editingBookingId, bookingDraft);
        setBookings((current) => current.map((booking) => booking.id === updated.id ? updated : booking));
        setEditingBookingId("");
        setBookingDraft((current) => ({ ...current, description: "", eventName: "", repeatUntil: "", weeklyRepeat: false }));
        setMessage("Room booking updated.");
        setActionFeedback({ text: "Room booking updated.", tone: "success" });
        return;
      }
      const createdBookings = await requestRoomBooking(accessToken, bookingDraft);
      setBookings((current) => [...current, ...createdBookings]);
      setBookingDraft((current) => ({ ...current, description: "", eventName: "" }));
      const successMessage = createdBookings.length > 1 ? `${createdBookings.length} weekly room bookings confirmed in 25Live.` : "Room booking confirmed in 25Live.";
      setMessage(successMessage);
      setActionFeedback({ text: successMessage, tone: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not create the room booking.";
      setMessage(errorMessage);
      setActionFeedback({ text: errorMessage, tone: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  function beginEditingBooking(booking: RoomBooking) {
    setEditingBookingId(booking.id);
    setBookingDraft({ date: booking.date, description: booking.description, endTime: booking.endTime, eventName: booking.eventName, floor: booking.floor, repeatUntil: "", roomId: booking.roomId, roomName: booking.roomName, time: booking.time, weeklyRepeat: false });
    document.getElementById("room-approvals")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSaveRooms() {
    if (!accessToken) return;
    setIsSaving(true);
    setMessage("");
    try {
      const saved = await saveCampusRooms(accessToken, adminRooms);
      setAdminRooms(saved);
      setBookings((current) => current.map((booking) => {
        const room = saved.find((item) => item.id === booking.roomId);
        return room ? { ...booking, floor: room.floor, roomName: room.name } : booking;
      }));
      setMessage("Room names and seat counts saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save room details.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleAddRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newRoomDraft.name.trim();
    if (!name) return;
    setAdminRooms((current) => [...current, { ...newRoomDraft, id: `room-${crypto.randomUUID().slice(0, 8)}`, name }].sort((a, b) => a.floor - b.floor || a.name.localeCompare(b.name)));
    setNewRoomDraft((current) => ({ ...current, name: "" }));
    setMessage("Room added locally. Choose Save room details to publish it.");
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setIsSaving(true);
    setMessage("");
    try {
      const task = await createStaffTask(accessToken, taskDraft);
      setTasks((current) => [...current, task]);
      setTaskDraft((current) => ({ ...current, description: "", title: "" }));
      setMessage(`Task assigned to ${task.assignedToName}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not assign the task.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleTask(task: StaffTask) {
    if (!accessToken) return;
    try {
      const updated = await updateStaffTask(accessToken, task.id, task.status !== "completed");
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update the task.");
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!accessToken) return;
    if (!window.confirm("Delete this assigned task? This action cannot be undone.")) return;
    try {
      await deleteStaffTask(accessToken, taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      setMessage("Task removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not remove the task.");
    }
  }

  async function handleSaveClasses(classes: string[]) {
    if (!accessToken || !selectedAccount) return;
    setIsSaving(true);
    setMessage("");
    try {
      const result = await saveStaffClasses(accessToken, selectedAccount.id, classes);
      setStaffAccounts((current) => current.map((account) => account.id === selectedAccount.id ? { ...account, dashboardData: result.dashboardData } : account));
      setClassDraft("");
      setMessage(`${selectedAccount.fullName}'s classes were updated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save staff classes.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteBooking(bookingId: string) {
    if (!accessToken) return;
    if (!window.confirm("Delete this room booking? This action cannot be undone.")) return;
    setMessage("");
    try {
      await deleteRoomBooking(accessToken, bookingId);
      setBookings((current) => current.filter((booking) => booking.id !== bookingId));
      setMessage("Room booking removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not remove the booking.");
    }
  }

  async function handleSaveSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !selectedAccount) return;
    const current = staffSchedules.find((item) => item.accountId === selectedAccount.id);
    const item: ScheduleItem = { ...scheduleDraft, id: editingScheduleItemId || crypto.randomUUID() };
    const nextSchedule = editingScheduleItemId ? (current?.schedule ?? []).map((entry) => entry.id === editingScheduleItemId ? item : entry) : [...(current?.schedule ?? []), item];
    setIsSaving(true);
    setMessage("");
    try {
      const saved = await saveStaffSchedule(accessToken, selectedAccount.id, nextSchedule);
      setStaffSchedules((all) => all.map((entry) => entry.accountId === selectedAccount.id ? { ...entry, schedule: saved } : entry));
      setEditingScheduleItemId("");
      setScheduleDraft({ endTime: "09:30", place: "", startTime: "08:30", studentIds: [], title: "", weekdays: [1, 2, 3, 4, 5] });
      setMessage(`${selectedAccount.fullName}'s weekly schedule was saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the schedule.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteScheduleItem(itemId: string) {
    if (!accessToken || !selectedAccount) return;
    if (!window.confirm("Delete this schedule item? This action cannot be undone.")) return;
    const current = staffSchedules.find((item) => item.accountId === selectedAccount.id);
    try {
      const saved = await saveStaffSchedule(accessToken, selectedAccount.id, (current?.schedule ?? []).filter((item) => item.id !== itemId));
      setStaffSchedules((all) => all.map((entry) => entry.accountId === selectedAccount.id ? { ...entry, schedule: saved } : entry));
      setMessage("Schedule item removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update the schedule.");
    }
  }

  if (isLoading) return <main className="loading-shell">Loading administration...</main>;

  const navItems = [
    { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
    { id: "attendance", label: "Attendance", href: "#attendance-overview", icon: CalendarDays },
    { id: "roster", label: "Student rosters", href: "#student-roster", icon: Users },
    { id: "schedules", label: "Staff schedules", href: "#staff-schedules", icon: CalendarDays },
    { id: "bookings", label: "Room approvals", href: "#room-approvals", icon: ClipboardCheck },
    { id: "tasks", label: "Staff tasks", href: "#staff-tasks", icon: ListTodo },
    { id: "sheets", label: "Google Sheets", href: "#google-sheets", icon: FileSpreadsheet },
  ];

  const selectedAccount = staffAccounts.find((account) => account.id === selectedStaffId) ?? staffAccounts[0];
  const assignedClasses = selectedAccount?.dashboardData.classes?.length
    ? selectedAccount.dashboardData.classes
    : Array.from(new Set(selectedAccount?.dashboardData.roster.map((student) => student.className ?? gradeClassName(student.grade)) ?? []));
  const selectedSchedule = staffSchedules.find((schedule) => schedule.accountId === selectedAccount?.id);
  const attendanceForDate = selectedAccount?.dashboardData.attendanceRecords?.[selectedAttendanceDate] ?? {};
  const attendanceRows = selectedAccount?.dashboardData.roster.map((student) => ({ ...student, attendanceStatus: attendanceForDate[student.id] ?? "Unmarked" })) ?? [];
  const attendanceTotals = attendanceRows.reduce((totals, row) => ({ ...totals, [row.attendanceStatus]: totals[row.attendanceStatus] + 1 }), { Present: 0, Late: 0, Absent: 0, Unmarked: 0 });
  const today = new Date().toLocaleDateString("en-CA");
  const attendanceTasks = tasks.filter((task) => task.title === "Submit attendance" && task.dueDate === today);
  const submittedAttendanceTasks = attendanceTasks.filter((task) => task.status === "completed");
  const pendingAttendanceTasks = attendanceTasks.filter((task) => task.status !== "completed");
  const regularTasks = tasks.filter((task) => task.title !== "Submit attendance");

  return (
    <CorporateDashboardShell activeId="overview" isSwitchingAccount={isSwitchingAccount} navItems={navItems} onSignOut={handleSignOut} onSwitchAccount={switchableAccounts.length ? handleSwitchAccount : undefined} profileName={adminName} profileRole="Administrator account" switchAccountLabel="Switch to teacher">
      <header className="staff-page-heading corporate-page-heading"><div><p><ShieldCheck size={15} /> Administration</p><h1>System administration</h1><span>Manage staff access separately from SHSAT instruction and student work.</span></div></header>
      {actionFeedback ? <div className={`admin-action-feedback is-${actionFeedback.tone}`} role="status"><span>{actionFeedback.tone === "loading" ? <RefreshCw className="is-spinning" size={17} /> : actionFeedback.tone === "success" ? <CheckCircle2 size={17} /> : <X size={17} />}</span><strong>{actionFeedback.text}</strong><button aria-label="Dismiss notification" onClick={() => setActionFeedback(null)} type="button"><X size={14} /></button></div> : null}
      <section className="staff-kpi-grid" aria-label="Administration summary">
        <article><span><Users size={19} /></span><div><p>Staff accounts</p><strong>{staffAccounts.length}</strong></div><em>Active in Supabase</em></article>
        <article><span><UserCog size={19} /></span><div><p>Account system</p><strong>Live</strong></div><em>Permanent cloud access</em></article>
        <article><span><ShieldCheck size={19} /></span><div><p>Role security</p><strong>On</strong></div><em>Admin-only controls</em></article>
      </section>
      {message ? <p className="teacher-message corporate-message">{message}</p> : null}
      <section className="teacher-panel admin-attendance-panel" id="attendance-overview">
        <div className="teacher-panel-header"><div><span>Program records</span><h2>Attendance overview</h2></div><p>Review every staff member&apos;s saved student attendance by school day.</p></div>
        <div className="admin-attendance-filters">
          <label>Staff account<select value={selectedAccount?.id ?? ""} onChange={(event) => { const account = staffAccounts.find((item) => item.id === event.target.value); setSelectedStaffId(event.target.value); const dates = Object.keys(account?.dashboardData.attendanceRecords ?? {}).sort(); if (dates.length) setSelectedAttendanceDate(dates[dates.length - 1]); }}>{staffAccounts.map((account) => <option key={account.id} value={account.id}>{account.fullName} (@{account.username})</option>)}</select></label>
          <label>School day<input type="date" min="2026-07-06" max="2026-08-21" value={selectedAttendanceDate} onChange={(event) => setSelectedAttendanceDate(event.target.value)} /></label>
        </div>
        <div className="admin-attendance-totals" aria-label="Attendance totals"><article><strong>{attendanceTotals.Present}</strong><span>Present</span></article><article><strong>{attendanceTotals.Late}</strong><span>Late</span></article><article><strong>{attendanceTotals.Absent}</strong><span>Absent</span></article><article><strong>{attendanceTotals.Unmarked}</strong><span>Unmarked</span></article></div>
        <div className="admin-attendance-list">
          {attendanceRows.length ? attendanceRows.map((student) => <article key={student.id}><span>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{student.name}</strong><small>{student.className ?? gradeClassName(student.grade)}</small></div><em className={`is-${student.attendanceStatus.toLowerCase()}`}>{student.attendanceStatus}</em></article>) : <p>No students are assigned to this staff account.</p>}
        </div>
      </section>
      <section className="teacher-panel admin-roster-panel" id="student-roster">
        <div className="teacher-panel-header"><div><span>Class enrollment</span><h2>Student rosters</h2></div><p>Assign one or more grade classes to each staff member, then place students in the right class.</p></div>
        <label className="admin-roster-account">Staff member<select value={selectedAccount?.id ?? ""} onChange={(event) => { setSelectedStaffId(event.target.value); setEditingStudentId(""); setStudentDraft({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" }); }}>{staffAccounts.map((account) => <option key={account.id} value={account.id}>{account.fullName} (@{account.username})</option>)}</select></label>
        <div className="admin-class-assignment"><div><strong>Assigned classes</strong><small>A staff member may manage multiple grades.</small></div><div className="admin-class-tags">{assignedClasses.map((className) => <button aria-label={`Remove ${className}`} key={className} onClick={() => handleSaveClasses(assignedClasses.filter((value) => value !== className))} type="button">{className} <X size={12} /></button>)}</div><form onSubmit={(event) => { event.preventDefault(); const value = classDraft.trim(); if (value && !assignedClasses.includes(value)) handleSaveClasses([...assignedClasses, value]); }}><input aria-label="New class" placeholder="e.g. 5th Grade" value={classDraft} onChange={(event) => setClassDraft(event.target.value)} /><button disabled={isSaving || !classDraft.trim()} type="submit"><Plus size={14} /> Assign class</button></form></div>
        <div className="admin-roster-layout">
          <form className="admin-student-form" onSubmit={handleSaveStudent}>
            <div className="admin-student-form-title"><UserRoundPlus size={18} /><strong>{editingStudentId ? "Edit student" : "Add student"}</strong></div>
            <div className="admin-student-name-grid"><label>First name<input required value={studentDraft.firstName} onChange={(event) => setStudentDraft({ ...studentDraft, firstName: event.target.value })} /></label><label>Last name<input required value={studentDraft.lastName} onChange={(event) => setStudentDraft({ ...studentDraft, lastName: event.target.value })} /></label></div>
            <label>Class<select required value={studentDraft.className} onChange={(event) => setStudentDraft({ ...studentDraft, className: event.target.value })}><option value="">Choose a class</option>{assignedClasses.map((className) => <option key={className} value={className}>{className}</option>)}</select></label>
            <label>Date of birth <small>Optional</small><input type="date" value={studentDraft.dob} onChange={(event) => setStudentDraft({ ...studentDraft, dob: event.target.value })} /></label>
            <label>Allergies<input placeholder="None known" value={studentDraft.allergies} onChange={(event) => setStudentDraft({ ...studentDraft, allergies: event.target.value })} /></label>
            <label>Special notes<textarea rows={4} value={studentDraft.specialNotes} onChange={(event) => setStudentDraft({ ...studentDraft, specialNotes: event.target.value })} /></label>
            <div className="admin-sheets-actions"><button disabled={isSaving || !assignedClasses.length} type="submit"><Check size={16} /> {editingStudentId ? "Save changes" : "Add to roster"}</button>{editingStudentId ? <button className="is-secondary" onClick={() => { setEditingStudentId(""); setStudentDraft({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" }); }} type="button">Cancel</button> : null}</div>
          </form>
          <div className="admin-roster-list">{selectedAccount?.dashboardData.roster.length ? selectedAccount.dashboardData.roster.map((student) => <article key={student.id}><span>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{student.name}</strong><small>{student.className ?? gradeClassName(student.grade)} · DOB {student.dob || "Not entered"}</small><p>{student.specialNotes || "No special notes"}</p></div><button onClick={() => beginEditingStudent(student)} type="button"><Pencil size={14} /> Edit</button></article>) : <p>No students are assigned to this staff member.</p>}</div>
        </div>
      </section>
      <section className="teacher-panel admin-schedule-panel" id="staff-schedules">
        <div className="teacher-panel-header"><div><span>Recurring program calendar</span><h2>Staff schedules</h2></div><p>Edit every staff member&apos;s student schedule. Staff can view all schedules, with their own shown first.</p></div>
        <label className="admin-roster-account">Staff schedule<select value={selectedAccount?.id ?? ""} onChange={(event) => { setSelectedStaffId(event.target.value); setEditingScheduleItemId(""); }}>{staffAccounts.map((account) => <option key={account.id} value={account.id}>{account.fullName} (@{account.username})</option>)}</select></label>
        <div className="admin-schedule-layout">
          <form className="admin-student-form admin-schedule-form" onSubmit={handleSaveSchedule}>
            <div className="admin-student-form-title"><CalendarDays size={18} /><strong>{editingScheduleItemId ? "Edit recurring block" : "Add recurring block"}</strong></div>
            <label>Activity / class<input required value={scheduleDraft.title} onChange={(event) => setScheduleDraft({ ...scheduleDraft, title: event.target.value })} /></label>
            <label>Location<input required value={scheduleDraft.place} onChange={(event) => setScheduleDraft({ ...scheduleDraft, place: event.target.value })} /></label>
            <div className="admin-student-name-grid"><label>Starts<input required type="time" value={scheduleDraft.startTime} onChange={(event) => setScheduleDraft({ ...scheduleDraft, startTime: event.target.value })} /></label><label>Ends<input required type="time" value={scheduleDraft.endTime} onChange={(event) => setScheduleDraft({ ...scheduleDraft, endTime: event.target.value })} /></label></div>
            <fieldset><legend>Repeats on</legend><div className="admin-weekday-options">{weekdayLabels.map((label, index) => { const day = index + 1; return <label key={label}><input checked={scheduleDraft.weekdays.includes(day)} type="checkbox" onChange={() => setScheduleDraft({ ...scheduleDraft, weekdays: scheduleDraft.weekdays.includes(day) ? scheduleDraft.weekdays.filter((value) => value !== day) : [...scheduleDraft.weekdays, day].sort() })} /><span>{label.slice(0, 3)}</span></label>; })}</div></fieldset>
            <div className="admin-sheets-actions"><button disabled={isSaving} type="submit"><Plus size={15} /> {editingScheduleItemId ? "Save block" : "Add block"}</button>{editingScheduleItemId ? <button className="is-secondary" onClick={() => { setEditingScheduleItemId(""); setScheduleDraft({ endTime: "09:30", place: "", startTime: "08:30", studentIds: [], title: "", weekdays: [1, 2, 3, 4, 5] }); }} type="button">Cancel</button> : null}</div>
          </form>
          <div className="admin-schedule-list">{selectedSchedule?.schedule.length ? [...selectedSchedule.schedule].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((item) => <article key={item.id}><time>{item.startTime}–{item.endTime}</time><div><strong>{item.title}</strong><span>{item.weekdays.map((day) => weekdayLabels[day - 1].slice(0, 3)).join(" · ")}</span><small>{item.place}</small></div><div><button onClick={() => { setEditingScheduleItemId(item.id); setScheduleDraft({ endTime: item.endTime, place: item.place, startTime: item.startTime, studentIds: [], title: item.title, weekdays: item.weekdays }); }} type="button"><Pencil size={13} /> Edit</button><button className="is-danger" onClick={() => handleDeleteScheduleItem(item.id)} type="button"><Trash2 size={13} /> Remove</button></div></article>) : <p>No recurring blocks yet.</p>}</div>
        </div>
      </section>
      <section className="teacher-panel admin-tasks-panel" id="staff-tasks">
        <div className="teacher-panel-header"><div><span>Staff workflow</span><h2>Assigned tasks</h2></div><p>Assign work to a staff account and follow it through completion.</p></div>
        <div className="admin-attendance-task-tracker"><button aria-expanded={isAttendanceTrackerOpen} onClick={() => setIsAttendanceTrackerOpen((open) => !open)} type="button"><span><ClipboardCheck size={19} /></span><div><strong>Today&apos;s attendance</strong><small>Click to see who still needs to submit</small></div><em>{submittedAttendanceTasks.length}/{attendanceTasks.length} submitted</em></button>{isAttendanceTrackerOpen ? <div className="admin-attendance-task-details">{pendingAttendanceTasks.length ? <><strong>Still waiting on</strong><ul>{pendingAttendanceTasks.map((task) => <li key={task.id}>{task.assignedToName}</li>)}</ul></> : <p><CheckCircle2 size={16} /> Everyone has submitted attendance.</p>}</div> : null}</div>
        <div className="admin-task-layout"><form className="admin-task-form" onSubmit={handleCreateTask}><label>Assign to<select required value={taskDraft.assignedToId} onChange={(event) => setTaskDraft({ ...taskDraft, assignedToId: event.target.value })}><option value="">Choose staff</option>{staffAccounts.map((account) => <option key={account.id} value={account.id}>{account.fullName}</option>)}</select></label><label>Task title<input placeholder="e.g. Prepare classroom" required value={taskDraft.title} onChange={(event) => setTaskDraft({ ...taskDraft, title: event.target.value })} /></label><label>Due date<input required type="date" value={taskDraft.dueDate} onChange={(event) => setTaskDraft({ ...taskDraft, dueDate: event.target.value })} /></label><label>Description<textarea required rows={3} value={taskDraft.description} onChange={(event) => setTaskDraft({ ...taskDraft, description: event.target.value })} /></label><button disabled={isSaving} type="submit"><Plus size={15} /> Assign task</button></form><div className="admin-task-list">{regularTasks.length ? [...regularTasks].sort((a, b) => a.status.localeCompare(b.status) || a.dueDate.localeCompare(b.dueDate)).map((task) => <article className={task.status === "completed" ? "is-completed" : ""} key={task.id}><button aria-label={`${task.status === "completed" ? "Reopen" : "Complete"} ${task.title}`} className="admin-task-check" onClick={() => handleToggleTask(task)} type="button">{task.status === "completed" ? <Check size={14} /> : null}</button><div><strong>{task.title}</strong><span>{task.assignedToName} · Due {task.dueDate}</span><p>{task.description}</p></div><button aria-label={`Remove ${task.title}`} className="admin-task-remove" onClick={() => handleDeleteTask(task.id)} type="button"><Trash2 size={14} /></button></article>) : <p>No other tasks assigned.</p>}</div></div>
      </section>
      <section className="teacher-panel admin-bookings-panel" id="room-approvals">
        <div className="teacher-panel-header"><div><span>25Live management</span><h2>Room bookings</h2></div><p>Create confirmed reservations, review staff requests, and remove bookings.</p></div>
        <details className="admin-room-directory"><summary>Manage rooms, floors, and seats</summary><form className="admin-add-room-form" onSubmit={handleAddRoom}><label>Room name<input placeholder="e.g. Art Room" required value={newRoomDraft.name} onChange={(event) => setNewRoomDraft({ ...newRoomDraft, name: event.target.value })} /></label><label>Floor <small>0 = LL, 1 = L</small><input min={0} type="number" value={newRoomDraft.floor} onChange={(event) => setNewRoomDraft({ ...newRoomDraft, floor: Number(event.target.value) })} /></label><label>Seats<input min={1} type="number" value={newRoomDraft.capacity} onChange={(event) => setNewRoomDraft({ ...newRoomDraft, capacity: Number(event.target.value) })} /></label><button type="submit"><Plus size={14} /> Add room</button></form><div>{adminRooms.map((room) => <article key={room.id}><label>Floor <small>{getFloorName(room.floor)}</small><input min={0} type="number" value={room.floor} onChange={(event) => setAdminRooms((current) => current.map((item) => item.id === room.id ? { ...item, floor: Number(event.target.value) } : item))} /></label><label>Room name<input value={room.name} onChange={(event) => setAdminRooms((current) => current.map((item) => item.id === room.id ? { ...item, name: event.target.value } : item))} /></label><label>Seats<input min={1} type="number" value={room.capacity} onChange={(event) => setAdminRooms((current) => current.map((item) => item.id === room.id ? { ...item, capacity: Number(event.target.value) } : item))} /></label><button aria-label={`Remove ${room.name}`} className="is-remove" onClick={() => { if (window.confirm(`Delete ${room.name}? This action cannot be undone.`)) setAdminRooms((current) => current.filter((item) => item.id !== room.id)); }} type="button"><Trash2 size={14} /></button></article>)}</div><footer><button disabled={isSaving || !adminRooms.length} onClick={handleSaveRooms} type="button"><Check size={15} /> Save room details</button><small>Room photos stay in <code>client/public/images/rooms</code>, never Supabase.</small></footer></details>
        <form className="admin-booking-form" onSubmit={handleCreateBooking}><label>Event<input required value={bookingDraft.eventName} onChange={(event) => setBookingDraft({ ...bookingDraft, eventName: event.target.value })} /></label><label>Room<select value={bookingDraft.roomId} onChange={(event) => { const room = adminRooms.find((item) => item.id === event.target.value) ?? adminRooms[0]; setBookingDraft({ ...bookingDraft, floor: room.floor, roomId: room.id, roomName: room.name }); }}>{adminRooms.map((room) => <option key={room.id} value={room.id}>{getFloorName(room.floor)} · {room.name}</option>)}</select></label><label>Date<input required type="date" value={bookingDraft.date} onChange={(event) => setBookingDraft({ ...bookingDraft, date: event.target.value })} /></label><label>Starts<input required type="time" value={bookingDraft.time} onChange={(event) => setBookingDraft({ ...bookingDraft, time: event.target.value })} /></label><label>Ends<input required type="time" value={bookingDraft.endTime} onChange={(event) => setBookingDraft({ ...bookingDraft, endTime: event.target.value })} /></label>{!editingBookingId ? <label className="admin-booking-repeat"><input checked={bookingDraft.weeklyRepeat} type="checkbox" onChange={(event) => setBookingDraft({ ...bookingDraft, repeatUntil: event.target.checked ? (bookingDraft.repeatUntil || bookingDraft.date) : "", weeklyRepeat: event.target.checked })} /><span>Repeat weekly</span></label> : null}{bookingDraft.weeklyRepeat && !editingBookingId ? <label>Repeat until<input min={bookingDraft.date} required type="date" value={bookingDraft.repeatUntil} onChange={(event) => setBookingDraft({ ...bookingDraft, repeatUntil: event.target.value })} /></label> : null}<label className="is-wide">Description<input required value={bookingDraft.description} onChange={(event) => setBookingDraft({ ...bookingDraft, description: event.target.value })} /></label><button disabled={isSaving} type="submit">{isSaving ? <RefreshCw className="is-spinning" size={15} /> : editingBookingId ? <Pencil size={15} /> : <Plus size={15} />} {isSaving ? "Saving booking…" : editingBookingId ? "Save booking" : bookingDraft.weeklyRepeat ? "Confirm series" : "Confirm booking"}</button>{editingBookingId ? <button className="is-cancel" onClick={() => { setEditingBookingId(""); setBookingDraft((current) => ({ ...current, description: "", eventName: "", weeklyRepeat: false })); }} type="button">Cancel edit</button> : null}</form>
        <div className="admin-booking-list">{bookings.length ? [...bookings].reverse().map((booking) => <article key={booking.id}><div className="admin-booking-room"><span>{getFloorName(booking.floor)}</span><strong>{booking.roomName}</strong><small>{booking.date || "Date not set"} · {booking.time}{booking.endTime ? `–${booking.endTime}` : ""}</small></div><div><strong>{booking.eventName}</strong><small>Requested by {booking.requestedByName}</small><p>{booking.description}</p></div><div className="admin-booking-review"><em className={`is-${booking.status}`}>{booking.status}</em><button onClick={() => beginEditingBooking(booking)} type="button"><Pencil size={13} /> Edit</button>{booking.status === "pending" ? <><button onClick={() => handleReviewBooking(booking.id, "approved")} type="button"><Check size={14} /> Approve</button><button className="is-reject" onClick={() => handleReviewBooking(booking.id, "rejected")} type="button"><X size={14} /> Decline</button></> : null}<button className="is-reject" onClick={() => handleDeleteBooking(booking.id)} type="button"><Trash2 size={13} /> Remove</button></div></article>) : <p>No room requests have been submitted.</p>}</div>
      </section>
      <section className="teacher-panel admin-sheets-panel" id="google-sheets">
        <div className="teacher-panel-header"><div><span>Cloud integration</span><h2>Google Sheets</h2></div><p>Send saved attendance to a spreadsheet automatically and sync existing records.</p></div>
        <div className="admin-sheets-layout">
          <div className="admin-sheets-status"><span className={sheetsConfigured ? "is-connected" : ""}>{sheetsConfigured ? <CheckCircle2 size={22} /> : <Cloud size={22} />}</span><div><strong>{sheetsConfigured ? "Connected" : "Not connected"}</strong><small>{sheetsConfigured ? "New attendance syncs whenever staff save it." : "Deploy a Google Apps Script web app, then paste its URL."}</small></div></div>
          <label>Apps Script web app URL<input autoCapitalize="none" inputMode="url" placeholder="https://script.google.com/macros/s/…/exec" type="url" value={sheetsWebhookUrl} onChange={(event) => setSheetsWebhookUrl(event.target.value)} /></label>
          <div className="admin-sheets-actions"><button disabled={isSyncingSheets} onClick={handleSaveSheets} type="button"><Cloud size={16} /> Save connection</button><button className="is-secondary" disabled={isSyncingSheets || !sheetsConfigured} onClick={handleSyncSheets} type="button"><RefreshCw className={isSyncingSheets ? "is-spinning" : ""} size={16} /> Sync all attendance</button></div>
          <details><summary>Google Sheets setup</summary><ol><li>Open your spreadsheet and choose Extensions → Apps Script.</li><li>Copy the ready-made script below and paste it into the editor.</li><li>Choose Deploy → New deployment → Web app, then set access to anyone.</li><li>Paste the deployment URL above, save it, then choose Sync all attendance.</li></ol><button className="admin-copy-script" onClick={handleCopySheetsScript} type="button"><Copy size={15} /> Copy Apps Script</button><pre><code>{googleSheetsScript}</code></pre></details>
        </div>
      </section>
      <section className="teacher-panel teacher-staff-panel" id="staff-management">
        <div className="teacher-panel-header"><div><span>Staff management</span><h2>{editingAccountId ? "Edit staff account" : "Assign staff"}</h2></div><p>Manage each login account name and the teacher name shown throughout the staff dashboard.</p></div>
        <div className="teacher-staff-layout">
          <form className="teacher-assessment-form teacher-staff-form" onSubmit={handleAssignStaff}>
            <label>Account Name<input autoCapitalize="none" minLength={3} pattern="[a-zA-Z0-9._-]+" required value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value.toLowerCase() })} /></label>
            <label>Teacher Name<input required value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} /></label>
            <label>{editingAccountId ? "New password (optional)" : "Temporary password"}<input autoComplete="new-password" minLength={6} required={!editingAccountId} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} /></label>
            <div className="admin-account-form-actions">
              <button disabled={isSaving} type="submit">{isSaving ? "Saving account" : editingAccountId ? "Save account changes" : "Assign staff access"}</button>
              {editingAccountId ? <button className="is-secondary" onClick={cancelEditing} type="button"><X size={15} /> Cancel</button> : null}
            </div>
          </form>
          <div className="teacher-staff-list" aria-label="Staff accounts">
            {staffAccounts.length ? staffAccounts.map((account) => <article key={account.id}><span>{account.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span><div><strong>Teacher: {account.fullName}</strong><small>Account: {account.username}</small><small>Password: <code>{account.accessPassword ?? "Unavailable — reset it to display"}</code></small></div><div className="admin-account-actions"><button onClick={() => beginEditing(account)} type="button"><Pencil size={14} /> Edit</button><a className="admin-account-preview" href={`/staff?preview=staff&adminTools=1&accountId=${encodeURIComponent(account.id)}`}><Eye size={14} /> View</a></div></article>) : <p>No staff accounts assigned yet.</p>}
          </div>
        </div>
      </section>
    </CorporateDashboardShell>
  );
}
