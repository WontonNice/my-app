import { useEffect, useState, type FormEvent } from "react";
import { Bus, CalendarDays, Check, CheckCircle2, ClipboardCheck, Cloud, Copy, Eye, FileSpreadsheet, LayoutDashboard, ListTodo, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, UserCog, UserRoundPlus, Users, Waves, X } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { assignStaffAccount, createStaffTask, deleteRosterStudent, deleteStaffAttendanceEntry, deleteStaffTask, getGoogleSheetsAttendanceSettings, getStaffAccounts, getStaffAttendanceEntries, getStaffSchedules, getStaffTasks, saveGoogleSheetsAttendanceSettings, saveRosterStudent, saveStaffAttendance, saveStaffAttendanceEntry, saveStaffClasses, saveStaffDismissal, saveStaffSchedule, saveSwimmingRoster, saveSwimmingStatus, syncGoogleSheetsAttendance, updateStaffAccount, updateStaffTask, type ScheduleItem, type StaffAccount, type StaffAttendanceEntry, type StaffSchedule, type StaffTask } from "../lib/api";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

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

const weekdayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
type AttendanceStatus = "Absent" | "Late" | "Present" | "Unmarked";
type AdminWorkspace = "accounts" | "attendance" | "dismissals" | "overview" | "roster" | "schedules" | "sheets" | "staff-attendance" | "swimming" | "tasks";

const adminWorkspaceIds = new Set<AdminWorkspace>(["accounts", "attendance", "dismissals", "overview", "roster", "schedules", "sheets", "staff-attendance", "swimming", "tasks"]);
const adminWorkspaceCopy: Record<AdminWorkspace, { eyebrow: string; title: string; description: string }> = {
  accounts: { eyebrow: "Staff access", title: "Staff accounts", description: "Create, update, and preview staff login accounts." },
  attendance: { eyebrow: "Program records", title: "Student attendance", description: "Review and update daily attendance across the summer program." },
  dismissals: { eyebrow: "Daily departure", title: "Student dismissals", description: "Manage early pickups and the 5 PM van roster across every class." },
  overview: { eyebrow: "Administration", title: "System administration", description: "Choose a workspace to manage Promise Summer School operations." },
  roster: { eyebrow: "Class enrollment", title: "Student rosters", description: "Manage staff classes and the students assigned to them." },
  schedules: { eyebrow: "Program calendar", title: "Staff schedules", description: "Coordinate recurring activities, locations, and student groups." },
  sheets: { eyebrow: "Cloud integration", title: "Google Sheets", description: "Configure attendance exports and synchronize saved records." },
  "staff-attendance": { eyebrow: "Staff records", title: "Staff attendance", description: "Record staff hours for payroll and coverage review." },
  swimming: { eyebrow: "Swimming program", title: "Daily swimming rosters", description: "Plan every weekday roster through August 14 and review student readiness." },
  tasks: { eyebrow: "Staff workflow", title: "Staff tasks", description: "Assign work and follow each task through completion." },
};

const swimmingProgramDates = (() => {
  const dates: string[] = [];
  const cursor = new Date("2026-07-20T12:00:00Z");
  const end = new Date("2026-08-14T12:00:00Z");
  while (cursor <= end) {
    const day = cursor.getUTCDay();
    if (day >= 1 && day <= 5) dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
})();

function initialSwimmingDate() {
  const today = todayDateInput();
  return swimmingProgramDates.find((date) => date >= today) ?? swimmingProgramDates.at(-1) ?? "2026-08-14";
}

function formatSwimmingDate(date: string, includeWeekday = true) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    ...(includeWeekday ? { weekday: "short" as const } : {}),
  }).format(new Date(`${date}T12:00:00Z`));
}

function todayDateInput() {
  return new Date().toLocaleDateString("en-CA");
}

function gradeClassName(grade: string) {
  const value = Number(grade);
  if (!Number.isInteger(value)) return "Unassigned class";
  const suffix = value % 10 === 1 && value !== 11 ? "st" : value % 10 === 2 && value !== 12 ? "nd" : value % 10 === 3 && value !== 13 ? "rd" : "th";
  return `${value}${suffix} Grade`;
}

function attendanceGradeLabel(student: StaffAccount["dashboardData"]["roster"][number]) {
  const storedGrade = student.grade.trim();
  const grade = storedGrade || student.className?.match(/\d+/)?.[0] || "";
  return grade ? `Grade ${grade}` : "Unassigned";
}

function formatAttendanceTimestamp(value: string | undefined) {
  if (!value) return "Not submitted";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Timestamp unavailable";
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(date);
  return `${formatted} ET`;
}

function attendanceOverrideKey(accountId: string, date: string, studentId: string) {
  return `${accountId}:${date}:${studentId}`;
}

function dismissalPickupKey(accountId: string, date: string, studentId: string) {
  return `${accountId}:${date}:${studentId}`;
}

export function AdminDashboardPage() {
  const [accessToken, setAccessToken] = useState("");
  const [adminName, setAdminName] = useState("Administrator");
  const [draft, setDraft] = useState({ fullName: "", password: "", username: "" });
  const [editingAccountId, setEditingAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [savingSwimmingStudentId, setSavingSwimmingStudentId] = useState("");
  const [savingSwimmingRosterStudentId, setSavingSwimmingRosterStudentId] = useState("");
  const [selectedSwimmingDate, setSelectedSwimmingDate] = useState(initialSwimmingDate);
  const [isSwimmingStudentPickerOpen, setIsSwimmingStudentPickerOpen] = useState(false);
  const [swimmingStudentSearch, setSwimmingStudentSearch] = useState("");
  const [swimmingGradeFilter, setSwimmingGradeFilter] = useState("all");
  const [selectedDismissalDate, setSelectedDismissalDate] = useState(todayDateInput);
  const [savingDismissalStudentId, setSavingDismissalStudentId] = useState("");
  const [dismissalPickupDrafts, setDismissalPickupDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(todayDateInput);
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState("");
  const [sheetsConfigured, setSheetsConfigured] = useState(false);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState("");
  const [studentDraft, setStudentDraft] = useState({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" });
  const [classDraft, setClassDraft] = useState("");
  const [staffSchedules, setStaffSchedules] = useState<StaffSchedule[]>([]);
  const [editingScheduleItemId, setEditingScheduleItemId] = useState("");
  const [scheduleDraft, setScheduleDraft] = useState({ endTime: "09:30", place: "", startTime: "08:30", studentIds: [] as string[], title: "", weekdays: [1, 2, 3, 4, 5] });
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [taskDraft, setTaskDraft] = useState({ assignedToId: "", description: "", dueDate: todayDateInput(), repeatUntil: "", repeatWeekly: false, title: "" });
  const [staffAttendanceEntries, setStaffAttendanceEntries] = useState<StaffAttendanceEntry[]>([]);
  const [staffAttendanceDraft, setStaffAttendanceDraft] = useState({ date: todayDateInput(), hours: "0", id: "", note: "", staffAccountId: "", staffName: "" });
  const [rosterSort, setRosterSort] = useState<"az" | "za">("az");
  const [masterScheduleDay, setMasterScheduleDay] = useState(() => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5 ? day : 1;
  });
  const [attendanceWorkspaceView, setAttendanceWorkspaceView] = useState<"staff" | "students">("students");
  const [attendanceOverrides, setAttendanceOverrides] = useState<Record<string, AttendanceStatus>>({});
  const [isSavingAdminAttendance, setIsSavingAdminAttendance] = useState(false);
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
        if (accounts[0]) {
          setTaskDraft((current) => ({ ...current, assignedToId: accounts[0].id }));
          setStaffAttendanceDraft((current) => ({ ...current, staffAccountId: accounts[0].id, staffName: accounts[0].fullName }));
        }
        const firstWithAttendance = accounts.find((account) => Object.keys(account.dashboardData.attendanceRecords ?? {}).length) ?? accounts[0];
        if (firstWithAttendance) {
          setSelectedStaffId(firstWithAttendance.id);
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
          getStaffSchedules(data.session.access_token),
          getStaffTasks(data.session.access_token),
          getStaffAttendanceEntries(data.session.access_token),
        ] as const);
      const [sheetsResult, schedulesResult, tasksResult, staffAttendanceResult] = results;
      if (sheetsResult.status === "fulfilled") {
        setSheetsWebhookUrl(sheetsResult.value.webhookUrl);
        setSheetsConfigured(sheetsResult.value.configured);
      }
      if (schedulesResult.status === "fulfilled") setStaffSchedules(schedulesResult.value);
      if (tasksResult.status === "fulfilled") setTasks(tasksResult.value);
      if (staffAttendanceResult.status === "fulfilled") setStaffAttendanceEntries(staffAttendanceResult.value);

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
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
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
    const proposedName = `${studentDraft.firstName} ${studentDraft.lastName}`.trim().replace(/\s+/g, " ");
    const duplicate = !editingStudentId && selectedAccount.dashboardData.roster.some(
      (student) => student.name.trim().replace(/\s+/g, " ").toLocaleLowerCase() === proposedName.toLocaleLowerCase(),
    );
    if (duplicate && !window.confirm(`${proposedName} is already on ${selectedAccount.fullName}'s roster. Do you still want to add another student with this name?`)) return;
    setIsSavingStudent(true);
    setMessage("");
    setActionFeedback({ text: editingStudentId ? "Saving student changes…" : "Adding student to roster…", tone: "loading" });
    try {
      const result = await saveRosterStudent(accessToken, selectedAccount.id, { ...studentDraft, id: editingStudentId || undefined });
      setStaffAccounts((current) => current.map((account) => account.id === selectedAccount.id ? { ...account, dashboardData: result.dashboardData } : account));
      setEditingStudentId("");
      setStudentDraft({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" });
      setMessage(`${result.student.name} was saved to ${selectedAccount.fullName}'s roster.`);
      setActionFeedback({ text: `${result.student.name} was saved.`, tone: "success" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not save the student.";
      setMessage(errorMessage);
      setActionFeedback({ text: errorMessage, tone: "error" });
    } finally {
      setIsSavingStudent(false);
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

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setIsSaving(true);
    setMessage("");
    try {
      const createdTasks = await createStaffTask(accessToken, taskDraft);
      setTasks((current) => [...current, ...createdTasks]);
      setTaskDraft((current) => ({ ...current, description: "", repeatUntil: "", repeatWeekly: false, title: "" }));
      setMessage(createdTasks.length > 1 ? `${createdTasks.length} weekly tasks assigned to ${createdTasks[0].assignedToName}.` : `Task assigned to ${createdTasks[0].assignedToName}.`);
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

  async function handleSaveStaffAttendance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    const selectedStaff = staffAccounts.find((account) => account.id === staffAttendanceDraft.staffAccountId);
    setIsSaving(true);
    setMessage("");
    try {
      const result = await saveStaffAttendanceEntry(accessToken, {
        date: staffAttendanceDraft.date,
        hours: Number(staffAttendanceDraft.hours),
        id: staffAttendanceDraft.id || undefined,
        note: staffAttendanceDraft.note,
        staffAccountId: staffAttendanceDraft.staffAccountId,
        staffName: selectedStaff?.fullName ?? staffAttendanceDraft.staffName,
      });
      setStaffAttendanceEntries(result.entries);
      setStaffAttendanceDraft({
        date: staffAttendanceDraft.date,
        hours: "0",
        id: "",
        note: "",
        staffAccountId: selectedStaff?.id ?? staffAccounts[0]?.id ?? "",
        staffName: selectedStaff?.fullName ?? staffAccounts[0]?.fullName ?? "",
      });
      setMessage(`${result.entry.staffName}'s staff attendance was saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save staff attendance.");
    } finally {
      setIsSaving(false);
    }
  }

  function beginEditingStaffAttendance(entry: StaffAttendanceEntry) {
    setStaffAttendanceDraft({
      date: entry.date,
      hours: String(entry.hours),
      id: entry.id,
      note: entry.note,
      staffAccountId: entry.staffAccountId,
      staffName: entry.staffName,
    });
    document.getElementById("staff-attendance")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDeleteStaffAttendance(entryId: string) {
    if (!accessToken) return;
    if (!window.confirm("Delete this staff attendance entry? This action cannot be undone.")) return;
    try {
      await deleteStaffAttendanceEntry(accessToken, entryId);
      setStaffAttendanceEntries((current) => current.filter((entry) => entry.id !== entryId));
      setMessage("Staff attendance entry removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not remove staff attendance.");
    }
  }

  async function handleApproveTask(task: StaffTask) {
    if (!accessToken) return;
    try {
      await deleteStaffTask(accessToken, task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setMessage(`${task.title} approved and removed.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not approve the task.");
    }
  }

  async function handleDeleteStudent(student: StaffAccount["dashboardData"]["roster"][number]) {
    if (!accessToken || !selectedAccount) return;
    if (!window.confirm(`Remove ${student.name} from ${selectedAccount.fullName}'s roster? This action cannot be undone.`)) return;
    setMessage("");
    try {
      const result = await deleteRosterStudent(accessToken, selectedAccount.id, student.id);
      setStaffAccounts((current) => current.map((account) => account.id === selectedAccount.id ? { ...account, dashboardData: result.dashboardData } : account));
      if (editingStudentId === student.id) {
        setEditingStudentId("");
        setStudentDraft({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" });
      }
      setMessage(`${student.name} was removed from the roster.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not remove the student.");
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

  function handleAdminAttendanceStatus(studentId: string, status: AttendanceStatus) {
    if (!selectedAccount) return;
    setAttendanceOverrides((current) => ({
      ...current,
      [attendanceOverrideKey(selectedAccount.id, selectedAttendanceDate, studentId)]: status,
    }));
  }

  async function handleSaveAdminAttendance() {
    if (!accessToken || !selectedAccount || isSavingAdminAttendance) return;
    const currentStatuses = selectedAccount.dashboardData.attendanceRecords?.[selectedAttendanceDate] ?? {};
    const statuses = Object.fromEntries(selectedAccount.dashboardData.roster.map((student) => [
      student.id,
      attendanceOverrides[attendanceOverrideKey(selectedAccount.id, selectedAttendanceDate, student.id)] ?? currentStatuses[student.id] ?? "Unmarked",
    ])) as Record<string, AttendanceStatus>;
    setIsSavingAdminAttendance(true);
    setActionFeedback({ text: `Saving ${selectedAccount.fullName}'s attendance...`, tone: "loading" });

    try {
      const result = await saveStaffAttendance(accessToken, {
        accountId: selectedAccount.id,
        date: selectedAttendanceDate,
        statuses: { ...currentStatuses, ...statuses },
      });
      setStaffAccounts((current) => current.map((account) => account.id === selectedAccount.id
        ? { ...account, dashboardData: result.dashboardData }
        : account));
      if (result.completedTask) {
        setTasks((current) => current.some((task) => task.id === result.completedTask?.id)
          ? current.map((task) => task.id === result.completedTask?.id ? result.completedTask as StaffTask : task)
          : [...current, result.completedTask as StaffTask]);
      }
      const savedPrefix = `${selectedAccount.id}:${selectedAttendanceDate}:`;
      setAttendanceOverrides((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(savedPrefix))));
      setActionFeedback({ text: `${selectedAccount.fullName}'s attendance was saved.`, tone: "success" });
    } catch (error) {
      setActionFeedback({ text: error instanceof Error ? error.message : "Could not save attendance.", tone: "error" });
    } finally {
      setIsSavingAdminAttendance(false);
    }
  }

  async function handleSwimmingToggle(accountId: string, studentId: string, field: "paidFee" | "waiverComplete") {
    if (!accessToken || savingSwimmingStudentId) return;
    const account = staffAccounts.find((item) => item.id === accountId);
    if (!account) return;
    const currentStatus = account.dashboardData.swimmingRecords?.[studentId] ?? { paidFee: false, waiverComplete: false };
    const nextStatus = { ...currentStatus, [field]: !currentStatus[field] };
    setSavingSwimmingStudentId(`${accountId}:${studentId}`);
    setMessage("");
    try {
      const result = await saveSwimmingStatus(accessToken, accountId, studentId, nextStatus);
      setStaffAccounts((current) => current.map((item) => item.id === accountId ? { ...item, dashboardData: result.dashboardData } : item));
      setMessage("Swimming record saved to the database.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the swimming record.");
    } finally {
      setSavingSwimmingStudentId("");
    }
  }

  async function handleSwimmingRosterToggle(accountId: string, studentId: string) {
    if (!accessToken || savingSwimmingRosterStudentId) return;
    const account = staffAccounts.find((item) => item.id === accountId);
    if (!account) return;
    const currentStudentIds = account.dashboardData.swimmingRosters?.[selectedSwimmingDate] ?? [];
    const nextStudentIds = currentStudentIds.includes(studentId)
      ? currentStudentIds.filter((id) => id !== studentId)
      : [...currentStudentIds, studentId];
    setSavingSwimmingRosterStudentId(`${accountId}:${studentId}`);
    setMessage("");
    try {
      const result = await saveSwimmingRoster(accessToken, accountId, selectedSwimmingDate, nextStudentIds);
      setStaffAccounts((current) => current.map((item) => item.id === accountId ? { ...item, dashboardData: result.dashboardData } : item));
      setMessage(`Swimming roster saved for ${formatSwimmingDate(selectedSwimmingDate)}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the daily swimming roster.");
    } finally {
      setSavingSwimmingRosterStudentId("");
    }
  }

  async function handleAdminDismissalUpdate(
    accountId: string,
    student: StaffAccount["dashboardData"]["roster"][number],
    update: { date?: string; pickedUpEarly?: boolean; pickupTime?: string; vanRide?: "none" | "5pm" },
  ) {
    if (!accessToken || savingDismissalStudentId) return;
    const savingKey = `${accountId}:${student.id}`;
    setSavingDismissalStudentId(savingKey);
    setMessage("");
    try {
      const result = await saveStaffDismissal(accessToken, { accountId, studentId: student.id, ...update });
      setStaffAccounts((current) => current.map((account) => account.id === accountId ? { ...account, dashboardData: result.dashboardData } : account));
      setMessage(`${student.name}'s dismissal information was saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update dismissal information.");
    } finally {
      setSavingDismissalStudentId("");
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

  const requestedWorkspace = window.location.pathname.split("/").filter(Boolean)[1] ?? "overview";
  const activeWorkspace = adminWorkspaceIds.has(requestedWorkspace as AdminWorkspace) ? requestedWorkspace as AdminWorkspace : "overview";
  const workspaceCopy = adminWorkspaceCopy[activeWorkspace];

  const navItems = [
    { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
    { id: "attendance", label: "Attendance", href: "/admin/attendance", icon: CalendarDays },
    { id: "staff-attendance", label: "Staff attendance", href: "/admin/staff-attendance", icon: ClipboardCheck },
    { id: "roster", label: "Student rosters", href: "/admin/roster", icon: Users },
    { id: "dismissals", label: "Dismissals", href: "/admin/dismissals", icon: Bus },
    { id: "swimming", label: "Swimming", href: "/admin/swimming", icon: Waves },
    { id: "schedules", label: "Staff schedules", href: "/admin/schedules", icon: CalendarDays },
    { id: "tasks", label: "Staff tasks", href: "/admin/tasks", icon: ListTodo },
    { id: "sheets", label: "Google Sheets", href: "/admin/sheets", icon: FileSpreadsheet },
    { id: "accounts", label: "Staff accounts", href: "/admin/accounts", icon: UserCog },
  ];

  const selectedAccount = staffAccounts.find((account) => account.id === selectedStaffId) ?? staffAccounts[0];
  const assignedClasses = selectedAccount?.dashboardData.classes?.length
    ? selectedAccount.dashboardData.classes
    : Array.from(new Set(selectedAccount?.dashboardData.roster.map((student) => student.className ?? gradeClassName(student.grade)) ?? []));
  const selectedSchedule = staffSchedules.find((schedule) => schedule.accountId === selectedAccount?.id);
  const attendanceForDate = selectedAccount?.dashboardData.attendanceRecords?.[selectedAttendanceDate] ?? {};
  const attendanceOverridePrefix = `${selectedAccount?.id ?? ""}:${selectedAttendanceDate}:`;
  const hasAttendanceDraftChanges = Object.keys(attendanceOverrides).some((key) => key.startsWith(attendanceOverridePrefix));
  const sortedRosterRows = [...(selectedAccount?.dashboardData.roster ?? [])].sort((first, second) => rosterSort === "az" ? first.name.localeCompare(second.name) : second.name.localeCompare(first.name));
  const swimmingRosterRows = staffAccounts.flatMap((account) => account.dashboardData.roster.map((student) => ({
    ...student,
    accountId: account.id,
    gradeLabel: attendanceGradeLabel(student),
    staffName: account.fullName,
    swimmingStatus: account.dashboardData.swimmingRecords?.[student.id] ?? { paidFee: false, waiverComplete: false },
    swimsOnSelectedDate: account.dashboardData.swimmingRosters?.[selectedSwimmingDate]?.includes(student.id) ?? false,
  }))).sort((first, second) => first.name.localeCompare(second.name) || first.staffName.localeCompare(second.staffName));
  const selectedSwimmingRows = swimmingRosterRows.filter((student) => student.swimsOnSelectedDate);
  const selectedSwimmingCount = selectedSwimmingRows.length;
  const selectedSwimmingWaiverCount = selectedSwimmingRows.filter((student) => student.swimmingStatus.waiverComplete).length;
  const selectedSwimmingPaidCount = selectedSwimmingRows.filter((student) => student.swimmingStatus.paidFee).length;
  const swimmingGradeOptions = Array.from(new Set(swimmingRosterRows.map((student) => student.gradeLabel))).sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));
  const swimmingSearchTerm = swimmingStudentSearch.trim().toLocaleLowerCase();
  const availableSwimmingRows = swimmingRosterRows.filter((student) => !student.swimsOnSelectedDate
    && (swimmingGradeFilter === "all" || student.gradeLabel === swimmingGradeFilter)
    && (!swimmingSearchTerm || `${student.name} ${student.className ?? ""} ${student.staffName}`.toLocaleLowerCase().includes(swimmingSearchTerm)));
  const dismissalRows = staffAccounts.flatMap((account) => account.dashboardData.roster.map((student) => ({
    ...student,
    accountId: account.id,
    staffName: account.fullName,
    vanRide: student.vanRide === "5pm" ? "5pm" as const : "none" as const,
  }))).sort((first, second) => first.name.localeCompare(second.name) || first.staffName.localeCompare(second.staffName));
  const dismissalEarlyCount = dismissalRows.filter((student) => student.earlyPickupDates?.includes(selectedDismissalDate)).length;
  const dismissalVanCount = dismissalRows.filter((student) => student.vanRide === "5pm").length;
  const attendanceRows = sortedRosterRows.map((student) => ({
    ...student,
    attendanceStatus: attendanceOverrides[attendanceOverrideKey(selectedAccount?.id ?? "", selectedAttendanceDate, student.id)] ?? attendanceForDate[student.id] ?? "Unmarked",
  }));
  const attendanceTotals = attendanceRows.reduce((totals, row) => ({ ...totals, [row.attendanceStatus]: totals[row.attendanceStatus] + 1 }), { Present: 0, Late: 0, Absent: 0, Unmarked: 0 });
  const accountedAttendanceTotal = attendanceTotals.Present + attendanceTotals.Late + attendanceTotals.Absent;
  const schoolAttendanceRows = staffAccounts.flatMap((account) => {
    const records = account.dashboardData.attendanceRecords?.[selectedAttendanceDate] ?? {};
    return account.dashboardData.roster.map((student) => ({ ...student, attendanceStatus: records[student.id] ?? "Unmarked" }));
  });
  const schoolAttendanceTotals = schoolAttendanceRows.reduce((totals, row) => ({ ...totals, [row.attendanceStatus]: totals[row.attendanceStatus] + 1 }), { Present: 0, Late: 0, Absent: 0, Unmarked: 0 });
  const schoolAccountedAttendanceTotal = schoolAttendanceTotals.Present + schoolAttendanceTotals.Late + schoolAttendanceTotals.Absent;
  const schoolAttendanceByGrade = Array.from(schoolAttendanceRows.reduce((summaries, student) => {
    const grade = attendanceGradeLabel(student);
    const current = summaries.get(grade) ?? { grade, present: 0, total: 0 };
    current.total += 1;
    if (student.attendanceStatus === "Present" || student.attendanceStatus === "Late") current.present += 1;
    summaries.set(grade, current);
    return summaries;
  }, new Map<string, { grade: string; present: number; total: number }>()).values()).sort((first, second) => first.grade.localeCompare(second.grade, undefined, { numeric: true }));
  const staffAttendanceSubmissionRows = staffAccounts.map((account) => {
    const statuses = account.dashboardData.attendanceRecords?.[selectedAttendanceDate] ?? {};
    const rosterCount = account.dashboardData.roster.length;
    const markedCount = account.dashboardData.roster.filter((student) => {
      const status = statuses[student.id] ?? "Unmarked";
      return status === "Present" || status === "Late" || status === "Absent";
    }).length;
    const submittedAt = account.dashboardData.attendanceUpdatedAt?.[selectedAttendanceDate];
    let submissionState: "incomplete" | "missing" | "no-roster" | "submitted" = "missing";
    if (!rosterCount) submissionState = "no-roster";
    else if (markedCount === rosterCount) submissionState = "submitted";
    else if (submittedAt) submissionState = "incomplete";
    return { ...account, markedCount, rosterCount, submissionState, submittedAt };
  });
  const submittedStaffCount = staffAttendanceSubmissionRows.filter((account) => account.submissionState === "submitted").length;
  const incompleteStaffCount = staffAttendanceSubmissionRows.filter((account) => account.submissionState === "incomplete").length;
  const missingStaffCount = staffAttendanceSubmissionRows.filter((account) => account.submissionState === "missing").length;
  const expectedStaffCount = staffAttendanceSubmissionRows.filter((account) => account.submissionState !== "no-roster").length;
  const selectedAttendanceTimestamp = selectedAccount?.dashboardData.attendanceUpdatedAt?.[selectedAttendanceDate];
  const earlyPickupRows = staffAccounts.flatMap((account) => account.dashboardData.roster
    .filter((student) => student.earlyPickupDates?.includes(selectedAttendanceDate))
    .map((student) => ({ ...student, pickupTime: student.earlyPickupTimes?.[selectedAttendanceDate] ?? "", staffName: account.fullName })));
  const regularTasks = tasks.filter((task) => task.title !== "Submit attendance");
  const staffAttendanceForDate = staffAttendanceEntries.filter((entry) => entry.date === staffAttendanceDraft.date);
  const staffAttendanceHoursForDate = staffAttendanceForDate.reduce((total, entry) => total + entry.hours, 0);
  const currentTimeKey = `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;
  const masterScheduleRows = staffSchedules.flatMap((schedule) => {
    const dayItems = schedule.schedule.filter((item) => item.weekdays.includes(masterScheduleDay));
    return dayItems.length
      ? dayItems.map((item) => ({ ...item, fullName: schedule.fullName, username: schedule.username }))
      : [{ endTime: "", fullName: schedule.fullName, id: `${schedule.accountId}-empty`, place: "No scheduled location", startTime: "", studentIds: [], title: "No blocks scheduled", username: schedule.username, weekdays: [masterScheduleDay] }];
  }).sort((first, second) => (first.startTime || "99:99").localeCompare(second.startTime || "99:99") || first.fullName.localeCompare(second.fullName));

  return (
    <CorporateDashboardShell activeId={activeWorkspace} enableAccountSwitcher navItems={navItems} onSignOut={handleSignOut} profileName={adminName} profileRole="Administrator account">
      <header className="staff-page-heading corporate-page-heading"><div><p><ShieldCheck size={15} /> {workspaceCopy.eyebrow}</p><h1>{workspaceCopy.title}</h1><span>{workspaceCopy.description}</span></div></header>
      {actionFeedback ? <div className={`admin-action-feedback is-${actionFeedback.tone}`} role="status"><span>{actionFeedback.tone === "loading" ? <RefreshCw className="is-spinning" size={17} /> : actionFeedback.tone === "success" ? <CheckCircle2 size={17} /> : <X size={17} />}</span><strong>{actionFeedback.text}</strong><button aria-label="Dismiss notification" onClick={() => setActionFeedback(null)} type="button"><X size={14} /></button></div> : null}
      <section className="staff-kpi-grid" aria-label="Administration summary" hidden={activeWorkspace !== "overview"}>
        <article><span><Users size={19} /></span><div><p>Staff accounts</p><strong>{staffAccounts.length}</strong></div><em>Active in Supabase</em></article>
        <article><span><UserCog size={19} /></span><div><p>Account system</p><strong>Live</strong></div><em>Permanent cloud access</em></article>
        <article><span><ShieldCheck size={19} /></span><div><p>Role security</p><strong>On</strong></div><em>Admin-only controls</em></article>
      </section>
      <section className="admin-workspace-grid" aria-label="Administration workspaces" hidden={activeWorkspace !== "overview"}>
        {navItems.slice(1).map((item) => { const Icon = item.icon; return <AppLink href={item.href} key={item.id}><span><Icon size={20} /></span><div><strong>{item.label}</strong><small>{adminWorkspaceCopy[item.id as AdminWorkspace].description}</small></div></AppLink>; })}
      </section>
      {message ? <p className="teacher-message corporate-message">{message}</p> : null}
      <section className="teacher-panel admin-attendance-panel" hidden={activeWorkspace !== "attendance"} id="attendance-overview">
        <div className="teacher-panel-header"><div><span>Program records</span><h2>Attendance overview</h2></div><p>Review every staff member&apos;s saved student attendance by school day.</p></div>
        <div className="admin-school-attendance-widget" aria-label="School-wide attendance totals">
          <header>
            <div><span>School-wide total</span><h3>{schoolAccountedAttendanceTotal} students marked</h3></div>
            <label>School day<input disabled={isSavingAdminAttendance} type="date" min="2026-07-06" max="2026-08-21" value={selectedAttendanceDate} onChange={(event) => setSelectedAttendanceDate(event.target.value)} /></label>
          </header>
          <div className="admin-attendance-totals admin-school-attendance-totals"><article><strong>{schoolAccountedAttendanceTotal}</strong><span>Marked</span></article><article><strong>{schoolAttendanceTotals.Present + schoolAttendanceTotals.Late}</strong><span>Present</span></article><article><strong>{schoolAttendanceTotals.Absent}</strong><span>Absent</span></article><article><strong>{schoolAttendanceTotals.Unmarked}</strong><span>Unmarked</span></article></div>
        </div>
        <div className="admin-attendance-view-switch" role="tablist" aria-label="Attendance workspace view">
          <button aria-selected={attendanceWorkspaceView === "students"} className={attendanceWorkspaceView === "students" ? "is-active" : ""} onClick={() => setAttendanceWorkspaceView("students")} role="tab" type="button"><Users size={15} /> Student view</button>
          <button aria-selected={attendanceWorkspaceView === "staff"} className={attendanceWorkspaceView === "staff" ? "is-active" : ""} onClick={() => setAttendanceWorkspaceView("staff")} role="tab" type="button"><ClipboardCheck size={15} /> Staff view</button>
        </div>
        {attendanceWorkspaceView === "students" ? <>
          <section className="admin-attendance-grade-summary" aria-labelledby="admin-attendance-grade-summary-title">
            <header><div><span>Attendance summary</span><h3 id="admin-attendance-grade-summary-title">Present by grade</h3></div><small>Late arrivals count as present.</small></header>
            <div className="admin-attendance-grade-table-wrap">
              <table>
                <thead><tr><th scope="col">Grade</th><th scope="col">Present</th><th scope="col">Students</th></tr></thead>
                <tbody>
                  <tr className="is-total"><th scope="row">All grades</th><td>{schoolAttendanceTotals.Present + schoolAttendanceTotals.Late}</td><td>{schoolAttendanceRows.length}</td></tr>
                  {schoolAttendanceByGrade.map((summary) => <tr key={summary.grade}><th scope="row">{summary.grade}</th><td>{summary.present}</td><td>{summary.total}</td></tr>)}
                </tbody>
              </table>
            </div>
          </section>
          <section className="admin-attendance-roster-summary" aria-labelledby="admin-attendance-roster-title">
            <header>
              <div><span>Student roster</span><h3 id="admin-attendance-roster-title">{selectedAccount?.fullName ?? "Choose staff"}</h3><small>{hasAttendanceDraftChanges ? "Unsaved attendance changes" : `Last saved: ${formatAttendanceTimestamp(selectedAttendanceTimestamp)}`}</small></div>
              <div className="admin-attendance-roster-controls"><label>Staff account<select disabled={isSavingAdminAttendance} value={selectedAccount?.id ?? ""} onChange={(event) => setSelectedStaffId(event.target.value)}>{staffAccounts.map((account) => <option key={account.id} value={account.id}>{account.fullName} (@{account.username})</option>)}</select></label><button disabled={!hasAttendanceDraftChanges || isSavingAdminAttendance} onClick={handleSaveAdminAttendance} type="button"><Check size={14} /> {isSavingAdminAttendance ? "Saving..." : "Save changes"}</button></div>
            </header>
            <div className="admin-attendance-totals" aria-label="Selected staff attendance totals"><article><strong>{accountedAttendanceTotal}</strong><span>Marked</span></article><article><strong>{attendanceTotals.Present + attendanceTotals.Late}</strong><span>Present</span></article><article><strong>{attendanceTotals.Absent}</strong><span>Absent</span></article><article><strong>{attendanceTotals.Unmarked}</strong><span>Unmarked</span></article></div>
            <div className="admin-attendance-list">
              {attendanceRows.length ? attendanceRows.map((student) => { const isChanged = attendanceOverrideKey(selectedAccount?.id ?? "", selectedAttendanceDate, student.id) in attendanceOverrides; return <article key={student.id}><span>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{student.name}</strong><small>{student.className ?? gradeClassName(student.grade)}{isChanged ? " - Unsaved" : ""}</small></div><select aria-label={`${student.name} attendance status`} className={`admin-attendance-status-select is-${student.attendanceStatus.toLowerCase()}`} disabled={isSavingAdminAttendance} onChange={(event) => handleAdminAttendanceStatus(student.id, event.target.value as AttendanceStatus)} value={student.attendanceStatus}><option value="Present">Present</option><option value="Late">Late</option><option value="Absent">Absent</option><option value="Unmarked">Unmarked</option></select></article>; }) : <p>No students are assigned to this staff account.</p>}
            </div>
          </section>
        </> : <section className="admin-attendance-staff-view" aria-labelledby="admin-attendance-staff-title">
          <header><div><span>Staff completion</span><h3 id="admin-attendance-staff-title">Who submitted attendance</h3></div><small>{submittedStaffCount}/{expectedStaffCount} staff with rosters completed</small></header>
          <div className="admin-attendance-staff-totals"><article className="is-submitted"><strong>{submittedStaffCount}</strong><span>Submitted</span></article><article className="is-incomplete"><strong>{incompleteStaffCount}</strong><span>Incomplete</span></article><article className="is-missing"><strong>{missingStaffCount}</strong><span>Not submitted</span></article></div>
          <div className="admin-attendance-staff-table-wrap">
            <table>
              <thead><tr><th scope="col">Staff member</th><th scope="col">Roster progress</th><th scope="col">Status</th><th scope="col">Last saved</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{staffAttendanceSubmissionRows.map((account) => {
                const statusLabel = account.submissionState === "submitted" ? "Submitted" : account.submissionState === "incomplete" ? "Incomplete" : account.submissionState === "no-roster" ? "No roster" : "Not submitted";
                return <tr key={account.id}><th scope="row"><span>{account.fullName}</span><small>@{account.username}</small></th><td><strong>{account.markedCount}/{account.rosterCount}</strong><small>students marked</small></td><td><span className={`admin-attendance-submission-status is-${account.submissionState}`}>{statusLabel}</span></td><td><time dateTime={account.submittedAt}>{formatAttendanceTimestamp(account.submittedAt)}</time></td><td><button onClick={() => { setSelectedStaffId(account.id); setAttendanceWorkspaceView("students"); }} type="button">View roster</button></td></tr>;
              })}</tbody>
            </table>
          </div>
        </section>}
        <div className="admin-early-pickup-list">
          <header><div><span>Dismissal watch</span><h3>Picked up early on {selectedAttendanceDate}</h3></div><strong>{earlyPickupRows.length}</strong></header>
          {earlyPickupRows.length ? earlyPickupRows.map((student) => <article key={`${student.staffName}-${student.id}`}><span>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{student.name}</strong><small>{student.className ?? gradeClassName(student.grade)} - {student.staffName}{student.pickupTime ? ` - ${student.pickupTime}` : ""}</small></div></article>) : <p>No early pickups are marked for this date.</p>}
        </div>
      </section>
      <section className="teacher-panel admin-staff-attendance-panel" hidden={activeWorkspace !== "staff-attendance"} id="staff-attendance">
        <div className="teacher-panel-header"><div><span>Staff records</span><h2>Staff attendance</h2></div><p>Add staff attendance and hours for payroll or daily coverage review.</p></div>
        <div className="admin-attendance-totals" aria-label="Staff attendance totals"><article><strong>{staffAttendanceForDate.length}</strong><span>Staff entries</span></article><article><strong>{staffAttendanceHoursForDate.toFixed(staffAttendanceHoursForDate % 1 ? 2 : 0)}</strong><span>Total hours</span></article><article><strong>{staffAttendanceDraft.date}</strong><span>Selected day</span></article></div>
        <div className="admin-staff-attendance-layout">
          <form className="admin-task-form" onSubmit={handleSaveStaffAttendance}>
            <label>Staff member<select value={staffAttendanceDraft.staffAccountId} onChange={(event) => { const account = staffAccounts.find((item) => item.id === event.target.value); setStaffAttendanceDraft({ ...staffAttendanceDraft, staffAccountId: event.target.value, staffName: account?.fullName ?? "" }); }}><option value="">Custom staff name</option>{staffAccounts.map((account) => <option key={account.id} value={account.id}>{account.fullName}</option>)}</select></label>
            {!staffAttendanceDraft.staffAccountId ? <label>Staff name<input required value={staffAttendanceDraft.staffName} onChange={(event) => setStaffAttendanceDraft({ ...staffAttendanceDraft, staffName: event.target.value })} /></label> : null}
            <label>Date<input required type="date" value={staffAttendanceDraft.date} onChange={(event) => setStaffAttendanceDraft({ ...staffAttendanceDraft, date: event.target.value })} /></label>
            <label>Hours<input max={24} min={0} required step="0.25" type="number" value={staffAttendanceDraft.hours} onChange={(event) => setStaffAttendanceDraft({ ...staffAttendanceDraft, hours: event.target.value })} /></label>
            <label>Note <small>Optional</small><textarea rows={3} value={staffAttendanceDraft.note} onChange={(event) => setStaffAttendanceDraft({ ...staffAttendanceDraft, note: event.target.value })} /></label>
            <div className="admin-sheets-actions"><button disabled={isSaving} type="submit"><Check size={15} /> {staffAttendanceDraft.id ? "Save hours" : "Add hours"}</button>{staffAttendanceDraft.id ? <button className="is-secondary" onClick={() => setStaffAttendanceDraft({ date: todayDateInput(), hours: "0", id: "", note: "", staffAccountId: staffAccounts[0]?.id ?? "", staffName: staffAccounts[0]?.fullName ?? "" })} type="button"><X size={15} /> Cancel</button> : null}</div>
          </form>
          <div className="admin-staff-attendance-list">{staffAttendanceEntries.length ? [...staffAttendanceEntries].sort((a, b) => b.date.localeCompare(a.date) || a.staffName.localeCompare(b.staffName)).map((entry) => <article key={entry.id}><div><strong>{entry.staffName}</strong><span>{entry.date} · {entry.hours} hours</span>{entry.note ? <p>{entry.note}</p> : null}</div><div className="admin-task-actions"><button onClick={() => beginEditingStaffAttendance(entry)} type="button"><Pencil size={13} /> Edit</button><button className="admin-task-remove" onClick={() => handleDeleteStaffAttendance(entry.id)} type="button"><Trash2 size={13} /></button></div></article>) : <p>No staff attendance has been entered yet.</p>}</div>
        </div>
      </section>
      <section className="teacher-panel admin-roster-panel" hidden={activeWorkspace !== "roster"} id="student-roster">
        <div className="teacher-panel-header"><div><span>Class enrollment</span><h2>Student rosters</h2></div><p>Assign one or more grade classes to each staff member, then place students in the right class.</p></div>
        <div className="admin-roster-toolbar">
          <label className="admin-roster-account">Staff member<select value={selectedAccount?.id ?? ""} onChange={(event) => { setSelectedStaffId(event.target.value); setEditingStudentId(""); setStudentDraft({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" }); }}>{staffAccounts.map((account) => <option key={account.id} value={account.id}>{account.fullName} (@{account.username})</option>)}</select></label>
          <div className="staff-attendance-sort admin-roster-sort"><span>Sort roster</span><button className={rosterSort === "az" ? "is-active" : ""} onClick={() => setRosterSort("az")} type="button">A–Z</button><button className={rosterSort === "za" ? "is-active" : ""} onClick={() => setRosterSort("za")} type="button">Z–A</button></div>
        </div>
        <div className="admin-class-assignment"><div><strong>Assigned classes</strong><small>A staff member may manage multiple grades.</small></div><div className="admin-class-tags">{assignedClasses.map((className) => <button aria-label={`Remove ${className}`} key={className} onClick={() => handleSaveClasses(assignedClasses.filter((value) => value !== className))} type="button">{className} <X size={12} /></button>)}</div><form onSubmit={(event) => { event.preventDefault(); const value = classDraft.trim(); if (value && !assignedClasses.includes(value)) handleSaveClasses([...assignedClasses, value]); }}><input aria-label="New class" placeholder="e.g. 5th Grade" value={classDraft} onChange={(event) => setClassDraft(event.target.value)} /><button disabled={isSaving || !classDraft.trim()} type="submit"><Plus size={14} /> Assign class</button></form></div>
        <div className="admin-roster-layout">
          <form className="admin-student-form" onSubmit={handleSaveStudent}>
            <div className="admin-student-form-title"><UserRoundPlus size={18} /><strong>{editingStudentId ? "Edit student" : "Add student"}</strong></div>
            <div className="admin-student-name-grid"><label>First name<input required value={studentDraft.firstName} onChange={(event) => setStudentDraft({ ...studentDraft, firstName: event.target.value })} /></label><label>Last name<input required value={studentDraft.lastName} onChange={(event) => setStudentDraft({ ...studentDraft, lastName: event.target.value })} /></label></div>
            <label>Class<select required value={studentDraft.className} onChange={(event) => setStudentDraft({ ...studentDraft, className: event.target.value })}><option value="">Choose a class</option>{assignedClasses.map((className) => <option key={className} value={className}>{className}</option>)}</select></label>
            <label>Date of birth <small>Optional</small><input type="date" value={studentDraft.dob} onChange={(event) => setStudentDraft({ ...studentDraft, dob: event.target.value })} /></label>
            <label>Allergies<input placeholder="None known" value={studentDraft.allergies} onChange={(event) => setStudentDraft({ ...studentDraft, allergies: event.target.value })} /></label>
            <label>Special notes<textarea rows={4} value={studentDraft.specialNotes} onChange={(event) => setStudentDraft({ ...studentDraft, specialNotes: event.target.value })} /></label>
            <div className="admin-sheets-actions"><button disabled={isSavingStudent || !assignedClasses.length} type="submit">{isSavingStudent ? <RefreshCw className="is-spinning" size={16} /> : <Check size={16} />} {isSavingStudent ? "Saving student…" : editingStudentId ? "Save changes" : "Add to roster"}</button>{editingStudentId ? <button className="is-secondary" onClick={() => { setEditingStudentId(""); setStudentDraft({ allergies: "", className: "", dob: "", firstName: "", lastName: "", specialNotes: "" }); }} type="button">Cancel</button> : null}</div>
          </form>
          <div className="admin-roster-list">{sortedRosterRows.length ? sortedRosterRows.map((student) => <article key={student.id}><span>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{student.name}</strong><small>{student.className ?? gradeClassName(student.grade)} · DOB {student.dob || "Not entered"}</small><p>{student.specialNotes || "No special notes"}</p></div><div className="admin-roster-actions"><button onClick={() => beginEditingStudent(student)} type="button"><Pencil size={14} /> Edit</button><button className="is-danger" onClick={() => handleDeleteStudent(student)} type="button"><Trash2 size={14} /> Remove</button></div></article>) : <p>No students are assigned to this staff member.</p>}</div>
        </div>
      </section>
      <section className="teacher-panel admin-dismissal-panel" hidden={activeWorkspace !== "dismissals"} id="student-dismissals">
        <div className="teacher-panel-header"><div><span>Daily departure</span><h2>Pickup and van roster</h2></div><label className="staff-dismissal-date">Roster date<input type="date" value={selectedDismissalDate} onChange={(event) => setSelectedDismissalDate(event.target.value)} /></label></div>
        <div className="staff-dismissal-summary"><span><CheckCircle2 size={15} /><strong>{dismissalEarlyCount}</strong> early pickup</span><span><Bus size={15} /><strong>{dismissalVanCount}</strong> van at 5 PM</span></div>
        <div className="staff-dismissal-list admin-dismissal-list">
          {dismissalRows.map((student) => {
            const savingKey = `${student.accountId}:${student.id}`;
            const pickupDraftKey = dismissalPickupKey(student.accountId, selectedDismissalDate, student.id);
            const pickedUpEarly = Boolean(student.earlyPickupDates?.includes(selectedDismissalDate));
            const pickupTime = dismissalPickupDrafts[pickupDraftKey] ?? student.earlyPickupTimes?.[selectedDismissalDate] ?? "";
            const isSavingDismissal = savingDismissalStudentId === savingKey;
            const pickupLabel = pickedUpEarly && student.earlyPickupTimes?.[selectedDismissalDate]
              ? `Picked up ${student.earlyPickupTimes[selectedDismissalDate]}`
              : student.vanRide === "5pm" ? "Van - 5 PM" : "No van";
            return <article key={savingKey}><span className="staff-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{student.name}</strong><small className={`is-${student.vanRide}`}>{pickupLabel}</small><em>{student.className ?? gradeClassName(student.grade)} · {student.staffName}</em></div><label>Ride home<select disabled={Boolean(savingDismissalStudentId)} value={student.vanRide} onChange={(event) => handleAdminDismissalUpdate(student.accountId, student, { vanRide: event.target.value as "none" | "5pm" })}><option value="none">No van</option><option value="5pm">Van at 5 PM</option></select></label><label>Time picked up<input disabled={Boolean(savingDismissalStudentId)} type="time" value={pickupTime} onChange={(event) => setDismissalPickupDrafts((current) => ({ ...current, [pickupDraftKey]: event.target.value }))} /></label><div className="staff-dismissal-actions"><button className={pickedUpEarly ? "is-early" : ""} disabled={Boolean(savingDismissalStudentId) || !pickupTime} onClick={() => handleAdminDismissalUpdate(student.accountId, student, { date: selectedDismissalDate, pickedUpEarly: true, pickupTime })} type="button"><CheckCircle2 size={15} /> {isSavingDismissal ? "Saving…" : pickedUpEarly ? "Save pickup time" : "Mark early pickup"}</button>{pickedUpEarly ? <button className="is-clear" disabled={Boolean(savingDismissalStudentId)} onClick={() => handleAdminDismissalUpdate(student.accountId, student, { date: selectedDismissalDate, pickedUpEarly: false })} type="button">Clear</button> : null}</div></article>;
          })}
          {!dismissalRows.length ? <p className="staff-empty-state">Add students to a class roster before managing dismissals.</p> : null}
        </div>
      </section>
      <section className="teacher-panel admin-swimming-panel" hidden={activeWorkspace !== "swimming"} id="swimming-management">
        <div className="teacher-panel-header"><div><span>Monday-Friday through August 14</span><h2>{formatSwimmingDate(selectedSwimmingDate, false)} swimming roster</h2></div><div className="admin-swimming-heading-actions"><p>Showing students going swimming on this day.</p><button onClick={() => setIsSwimmingStudentPickerOpen((current) => !current)} type="button">{isSwimmingStudentPickerOpen ? <X size={15} /> : <Plus size={15} />} {isSwimmingStudentPickerOpen ? "Close" : "Add student"}</button></div></div>
        <div className="admin-swimming-calendar" aria-label="Choose a swimming date">
          <div className="admin-swimming-weekdays" aria-hidden="true">{weekdayLabels.map((label) => <span key={label}>{label.slice(0, 3)}</span>)}</div>
          <div className="admin-swimming-dates">{swimmingProgramDates.map((date) => {
            const rosterCount = staffAccounts.reduce((count, account) => count + (account.dashboardData.swimmingRosters?.[date]?.length ?? 0), 0);
            return <button aria-pressed={selectedSwimmingDate === date} className={selectedSwimmingDate === date ? "is-active" : ""} key={date} onClick={() => setSelectedSwimmingDate(date)} type="button"><span>{formatSwimmingDate(date)}</span><strong>{rosterCount}</strong><small>{rosterCount === 1 ? "swimmer" : "swimmers"}</small></button>;
          })}</div>
        </div>
        <div className="admin-swimming-summary" aria-label={`Swimming readiness for ${selectedSwimmingDate}`}>
          <article><strong>{selectedSwimmingCount}</strong><span>Selected swimmers</span></article>
          <article><strong>{selectedSwimmingWaiverCount}/{selectedSwimmingCount}</strong><span>Waivers complete</span></article>
          <article><strong>{selectedSwimmingPaidCount}/{selectedSwimmingCount}</strong><span>Fees paid</span></article>
        </div>
        {isSwimmingStudentPickerOpen ? <section className="admin-swimming-picker" aria-label="Add a student to the swimming roster">
          <header><div><span>Add student</span><h3>Choose from existing students</h3></div><small>{availableSwimmingRows.length} available</small></header>
          <div className="admin-swimming-picker-filters"><label><Search size={15} /><input aria-label="Search students" placeholder="Search by student, class, or staff" type="search" value={swimmingStudentSearch} onChange={(event) => setSwimmingStudentSearch(event.target.value)} /></label><label>Grade<select aria-label="Filter students by grade" value={swimmingGradeFilter} onChange={(event) => setSwimmingGradeFilter(event.target.value)}><option value="all">All grades</option>{swimmingGradeOptions.map((grade) => <option key={grade} value={grade}>{grade}</option>)}</select></label></div>
          <div className="admin-swimming-picker-list">{availableSwimmingRows.map((student) => { const savingKey = `${student.accountId}:${student.id}`; return <article key={savingKey}><span>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{student.name}</strong><small>{student.gradeLabel} · {student.className ?? gradeClassName(student.grade)} · {student.staffName}</small></div><button disabled={Boolean(savingSwimmingRosterStudentId)} onClick={() => handleSwimmingRosterToggle(student.accountId, student.id)} type="button"><Plus size={14} /> {savingSwimmingRosterStudentId === savingKey ? "Adding…" : "Add"}</button></article>; })}{!availableSwimmingRows.length ? <p>{swimmingRosterRows.length === selectedSwimmingCount ? "Every matching student is already on this roster." : "No students match this search and grade."}</p> : null}</div>
        </section> : null}
        <div className="admin-swimming-table-wrap">
          <table className="admin-swimming-table">
            <thead><tr><th scope="col">Student</th><th scope="col">Class / staff</th><th scope="col">Waiver</th><th scope="col">Paid fee</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{selectedSwimmingRows.map((student) => {
              const savingKey = `${student.accountId}:${student.id}`;
              const isSavingStatus = savingSwimmingStudentId === savingKey;
              const isSavingRoster = savingSwimmingRosterStudentId === savingKey;
              return <tr className="is-selected" key={savingKey}><th scope="row"><span>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><strong>{student.name}</strong></th><td><strong>{student.className ?? gradeClassName(student.grade)}</strong><small>{student.staffName}</small></td><td><label className={`admin-swimming-checkbox${student.swimmingStatus.waiverComplete ? " is-checked" : ""}`}><input checked={student.swimmingStatus.waiverComplete} disabled={Boolean(savingSwimmingStudentId)} onChange={() => handleSwimmingToggle(student.accountId, student.id, "waiverComplete")} type="checkbox" /><span>{student.swimmingStatus.waiverComplete ? <Check size={15} /> : null}</span><em>{isSavingStatus ? "Saving…" : student.swimmingStatus.waiverComplete ? "Complete" : "Needed"}</em></label></td><td><label className={`admin-swimming-checkbox${student.swimmingStatus.paidFee ? " is-checked" : ""}`}><input checked={student.swimmingStatus.paidFee} disabled={Boolean(savingSwimmingStudentId)} onChange={() => handleSwimmingToggle(student.accountId, student.id, "paidFee")} type="checkbox" /><span>{student.swimmingStatus.paidFee ? <Check size={15} /> : null}</span><em>{isSavingStatus ? "Saving…" : student.swimmingStatus.paidFee ? "Paid" : "Unpaid"}</em></label></td><td><button className="admin-swimming-remove" disabled={Boolean(savingSwimmingRosterStudentId)} onClick={() => handleSwimmingRosterToggle(student.accountId, student.id)} type="button"><X size={14} /> {isSavingRoster ? "Removing…" : "Remove"}</button></td></tr>;
            })}</tbody>
          </table>
          {!selectedSwimmingRows.length ? <p>No students are going swimming on this day yet. Choose Add student to build the roster.</p> : null}
        </div>
      </section>
      <section className="teacher-panel admin-schedule-panel" hidden={activeWorkspace !== "schedules"} id="staff-schedules">
        <div className="teacher-panel-header"><div><span>Recurring program calendar</span><h2>Staff schedules</h2></div><p>Edit every staff member&apos;s student schedule. Staff can view all schedules, with their own shown first.</p></div>
        <section className="admin-master-schedule" aria-labelledby="admin-master-schedule-title">
          <header><div><span>Master schedule</span><h3 id="admin-master-schedule-title">Where everyone is</h3></div><label>Day<select value={masterScheduleDay} onChange={(event) => setMasterScheduleDay(Number(event.target.value))}>{weekdayLabels.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}</select></label></header>
          <div>{masterScheduleRows.length ? masterScheduleRows.map((item) => {
            const isCurrent = item.startTime && item.endTime && item.weekdays.includes(new Date().getDay()) && masterScheduleDay === new Date().getDay() && item.startTime <= currentTimeKey && item.endTime > currentTimeKey;
            return <article className={isCurrent ? "is-current" : ""} key={`${item.username}-${item.id}`}><time>{item.startTime ? `${item.startTime}–${item.endTime}` : "—"}</time><div><strong>{item.fullName}</strong><span>{item.title}</span></div><small>{item.place}</small>{isCurrent ? <em>Now</em> : null}</article>;
          }) : <p>No staff schedules are saved yet.</p>}</div>
        </section>
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
      <section className="teacher-panel admin-tasks-panel" hidden={activeWorkspace !== "tasks"} id="staff-tasks">
        <div className="teacher-panel-header"><div><span>Staff workflow</span><h2>Assigned tasks</h2></div><p>Assign work to a staff account and follow it through completion.</p></div>
        <div className="admin-task-layout"><form className="admin-task-form" onSubmit={handleCreateTask}><label>Assign to<select required value={taskDraft.assignedToId} onChange={(event) => setTaskDraft({ ...taskDraft, assignedToId: event.target.value })}><option value="">Choose staff</option>{staffAccounts.map((account) => <option key={account.id} value={account.id}>{account.fullName}</option>)}</select></label><label>Task title<input placeholder="e.g. Prepare classroom" required value={taskDraft.title} onChange={(event) => setTaskDraft({ ...taskDraft, title: event.target.value })} /></label><label>Due date<input required type="date" value={taskDraft.dueDate} onChange={(event) => setTaskDraft({ ...taskDraft, dueDate: event.target.value, repeatUntil: event.target.value > taskDraft.repeatUntil ? event.target.value : taskDraft.repeatUntil })} /></label><label className="admin-task-repeat"><input checked={taskDraft.repeatWeekly} type="checkbox" onChange={(event) => setTaskDraft({ ...taskDraft, repeatUntil: event.target.checked ? (taskDraft.repeatUntil || taskDraft.dueDate) : "", repeatWeekly: event.target.checked })} /><span>Repeat weekly</span></label>{taskDraft.repeatWeekly ? <label>Repeat until<input min={taskDraft.dueDate} required type="date" value={taskDraft.repeatUntil || taskDraft.dueDate} onChange={(event) => setTaskDraft({ ...taskDraft, repeatUntil: event.target.value })} /></label> : null}<label>Description<textarea required rows={3} value={taskDraft.description} onChange={(event) => setTaskDraft({ ...taskDraft, description: event.target.value })} /></label><button disabled={isSaving} type="submit"><Plus size={15} /> {taskDraft.repeatWeekly ? "Assign weekly task" : "Assign task"}</button></form><div className="admin-task-list">{regularTasks.length ? [...regularTasks].sort((a, b) => a.status.localeCompare(b.status) || a.dueDate.localeCompare(b.dueDate)).map((task) => <article className={task.status === "completed" ? "is-completed" : ""} key={task.id}><button aria-label={`${task.status === "completed" ? "Reopen" : "Complete"} ${task.title}`} className="admin-task-check" onClick={() => handleToggleTask(task)} type="button">{task.status === "completed" ? <Check size={14} /> : null}</button><div><strong>{task.title}</strong><span>{task.assignedToName} · Due {task.dueDate} · {task.status === "completed" ? `Completed ${task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ""}` : "Open"}</span><p>{task.description}</p></div><div className="admin-task-actions">{task.status === "completed" ? <button className="admin-task-approve" onClick={() => handleApproveTask(task)} type="button"><CheckCircle2 size={14} /> Approve</button> : null}<button aria-label={`Remove ${task.title}`} className="admin-task-remove" onClick={() => handleDeleteTask(task.id)} type="button"><Trash2 size={14} /></button></div></article>) : <p>No other tasks assigned.</p>}</div></div>
      </section>
      <section className="teacher-panel admin-sheets-panel" hidden={activeWorkspace !== "sheets"} id="google-sheets">
        <div className="teacher-panel-header"><div><span>Cloud integration</span><h2>Google Sheets</h2></div><p>Send saved attendance to a spreadsheet automatically and sync existing records.</p></div>
        <div className="admin-sheets-layout">
          <div className="admin-sheets-status"><span className={sheetsConfigured ? "is-connected" : ""}>{sheetsConfigured ? <CheckCircle2 size={22} /> : <Cloud size={22} />}</span><div><strong>{sheetsConfigured ? "Connected" : "Not connected"}</strong><small>{sheetsConfigured ? "New attendance syncs whenever staff save it." : "Deploy a Google Apps Script web app, then paste its URL."}</small></div></div>
          <label>Apps Script web app URL<input autoCapitalize="none" inputMode="url" placeholder="https://script.google.com/macros/s/…/exec" type="url" value={sheetsWebhookUrl} onChange={(event) => setSheetsWebhookUrl(event.target.value)} /></label>
          <div className="admin-sheets-actions"><button disabled={isSyncingSheets} onClick={handleSaveSheets} type="button"><Cloud size={16} /> Save connection</button><button className="is-secondary" disabled={isSyncingSheets || !sheetsConfigured} onClick={handleSyncSheets} type="button"><RefreshCw className={isSyncingSheets ? "is-spinning" : ""} size={16} /> Sync all attendance</button></div>
          <details><summary>Google Sheets setup</summary><ol><li>Open your spreadsheet and choose Extensions → Apps Script.</li><li>Copy the ready-made script below and paste it into the editor.</li><li>Choose Deploy → New deployment → Web app, then set access to anyone.</li><li>Paste the deployment URL above, save it, then choose Sync all attendance.</li></ol><button className="admin-copy-script" onClick={handleCopySheetsScript} type="button"><Copy size={15} /> Copy Apps Script</button><pre><code>{googleSheetsScript}</code></pre></details>
        </div>
      </section>
      <section className="teacher-panel teacher-staff-panel" hidden={activeWorkspace !== "accounts"} id="staff-management">
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
