export type AssignmentKind = "passage" | "practice" | "exam" | "external" | "offline";
export type AssignmentStatus = "planned" | "assigned" | "in_progress" | "review" | "completed" | "skipped" | "cancelled";
export type PlanEvent = { at: string; actor: string; action: string; changes: Record<string, unknown> };
export type CompletionEvidence = { source: "library" | "exam" | "practice" | "teacher"; at: string; reference?: string; correct?: number; total?: number };
export type PlanAssignment = {
  id: string; studentId: string; kind: AssignmentKind; contentId: string | null;
  title: string; instructions: string; url: string | null; status: AssignmentStatus;
  assignedAt: string | null; dueDate: string | null; plannedDate: string | null;
  completedAt: string | null; estimatedMinutes: number | null;
  questionTarget: number | null; practiceBaseline: number | null;
  createdAt: string; createdBy: string; updatedAt: string; revision: number;
  completion: CompletionEvidence | null; events?: PlanEvent[];
};
export type PlanSettings = { studentId: string; passagePace: number | null; targetDate: string | null; teacherNotes: string; updatedAt: string | null; revision: number };
export type PlanContent = { id: string; kind: "passage" | "practice" | "exam"; title: string; href: string; subject: string; category: string; contentSource?: string; practiceMode?: "bank_set"; passageCategory?: import("./passageCategories").PassageCategory; skills: string[]; questionCount: number; aliases: string[]; classId?: string; versionLabel?: string };
export type PriorContentActivity = { contentId: string; at: string | null; correct?: number; total?: number; source: string; reference?: string };
export type InventoryStatus = "Never assigned" | "Planned" | "Assigned" | "In progress" | "Awaiting review" | "Completed" | "Previously assigned";
export const assignmentKinds: AssignmentKind[] = ["passage", "practice", "exam", "external", "offline"];
export const assignmentStatuses: AssignmentStatus[] = ["planned", "assigned", "in_progress", "review", "completed", "skipped", "cancelled"];
export const statusLabels: Record<AssignmentStatus, string> = { planned: "Planned", assigned: "Assigned", in_progress: "In progress", review: "Awaiting review", completed: "Completed", skipped: "Skipped", cancelled: "Cancelled" };
export const activeStatuses: AssignmentStatus[] = ["assigned", "in_progress", "review"];
export const todayInNewYork = (now = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
export function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}
export function isOverdue(item: PlanAssignment, today = todayInNewYork()) { return activeStatuses.includes(item.status) && item.dueDate !== null && item.dueDate < today; }
export function assignmentDay(item: PlanAssignment) { return item.status === "planned" ? item.plannedDate : item.dueDate; }
export function practiceAnswered(value: unknown): number {
  if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
  const row = value as Record<string, unknown>;
  const count = row.answered ?? row.total ?? row.questionsAnswered;
  if (typeof count === "number" && Number.isFinite(count)) return Math.max(0, count);
  return Object.values(row).reduce<number>((sum, item) => sum + practiceAnswered(item), 0);
}
export function inventory(catalog: PlanContent[], assignments: PlanAssignment[], prior: PriorContentActivity[]) {
  const byContent = new Map<string, PlanAssignment[]>();
  const byPrior = new Map<string, PriorContentActivity[]>();
  for (const item of assignments) if (item.contentId) byContent.set(`${item.kind}:${item.contentId}`, [...(byContent.get(`${item.kind}:${item.contentId}`) ?? []), item]);
  for (const activity of prior) byPrior.set(activity.contentId, [...(byPrior.get(activity.contentId) ?? []), activity]);
  return catalog.map(content => {
    const history = (byContent.get(`${content.kind}:${content.id}`) ?? []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const evidence = byPrior.get(content.id) ?? [];
    const active = history.find(item => activeStatuses.includes(item.status));
    const planned = history.find(item => item.status === "planned");
    const completed = history.find(item => item.status === "completed");
    const issued = history.find(item => item.assignedAt);
    const status: InventoryStatus = active ? statusLabels[active.status] as InventoryStatus : planned ? "Planned" : completed || evidence.length ? "Completed" : issued ? "Previously assigned" : "Never assigned";
    const dates = [...history.flatMap(item => [item.completedAt, item.assignedAt, item.updatedAt].filter((date): date is string => Boolean(date))), ...evidence.flatMap(item => item.at ? [item.at] : [])];
    return { content, status, history, evidence, active, planned, hasBeenAssigned: Boolean(issued || completed || evidence.length), hasCompleted: Boolean(completed || evidence.length), lastActivity: dates.sort().at(-1) ?? null };
  });
}
export function forecast(remaining: number, pace: number | null, targetDate: string | null, today = todayInNewYork()) {
  const weeksAvailable = targetDate && validDate(targetDate) ? Math.max(0, (Date.parse(targetDate) - Date.parse(today)) / (7 * 86400000)) : null;
  const weeksSupply = pace && pace > 0 ? Math.round(remaining / pace * 10) / 10 : null;
  const needed = weeksAvailable !== null && pace && pace > 0 ? Math.ceil(weeksAvailable * pace) : null;
  return { weeksAvailable, weeksSupply, needed, difference: needed !== null ? remaining - needed : null };
}
export function weekDays(today = todayInNewYork(), offset = 0) {
  const date = new Date(`${today}T12:00:00Z`);
  const mondayOffset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - mondayOffset + offset * 7);
  return Array.from({ length: 7 }, (_, index) => { const day = new Date(date); day.setUTCDate(day.getUTCDate() + index); return day.toISOString().slice(0, 10); });
}
export function planSummary(assignments: PlanAssignment[], today = todayInNewYork()) {
  const days = weekDays(today);
  const weekly = assignments.filter(item => { const day = assignmentDay(item); return day && days.includes(day) && !["cancelled", "skipped"].includes(item.status); });
  const timed = weekly.filter(item => item.estimatedMinutes !== null);
  return { assigned: assignments.filter(item => activeStatuses.includes(item.status)).length, planned: assignments.filter(item => item.status === "planned").length,
    overdue: assignments.filter(item => isOverdue(item, today)).length, completed: assignments.filter(item => item.status === "completed").length,
    dueThisWeek: weekly.filter(item => activeStatuses.includes(item.status)).length,
    completedThisWeek: assignments.filter(item => item.status === "completed" && item.completedAt && days.includes(todayInNewYork(new Date(item.completedAt)))).length,
    weekly: weekly.length, knownMinutes: timed.reduce((sum, item) => sum + item.estimatedMinutes!, 0), timed: timed.length,
    upcoming: assignments.filter(item => activeStatuses.includes(item.status) || item.status === "planned").sort((a, b) => (assignmentDay(a) ?? "9999").localeCompare(assignmentDay(b) ?? "9999")).slice(0, 4) };
}
export type AssignmentDraft = { kind: AssignmentKind; contentId?: string | null; title?: string; instructions?: string; url?: string | null; status: "planned" | "assigned"; dueDate?: string | null; plannedDate?: string | null; estimatedMinutes?: number | null; questionTarget?: number | null };
export function validateDraft(input: unknown, catalog: PlanContent[]): AssignmentDraft & { title: string; contentId: string | null; instructions: string; url: string | null; dueDate: string | null; plannedDate: string | null; estimatedMinutes: number | null; questionTarget: number | null } {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Enter assignment details.");
  const row = input as Record<string, unknown>;
  if (!assignmentKinds.includes(row.kind as AssignmentKind) || !["planned", "assigned"].includes(String(row.status))) throw new Error("Choose an assignment type and Planned or Assigned.");
  const kind = row.kind as AssignmentKind;
  const content = catalog.find(item => item.kind === kind && item.id === row.contentId);
  if (["passage", "practice", "exam"].includes(kind) && !content) throw new Error("Choose existing platform content.");
  const title = content?.title ?? (typeof row.title === "string" ? row.title.trim() : "");
  if (!title || title.length > 300) throw new Error("Enter a title of at most 300 characters.");
  const instructions = typeof row.instructions === "string" ? row.instructions.trim() : "";
  if (instructions.length > 10000) throw new Error("Keep instructions under 10,000 characters.");
  const date = (value: unknown) => { if (value === null || value === undefined || value === "") return null; if (!validDate(value)) throw new Error("Enter valid calendar dates."); return value; };
  const dueDate = date(row.dueDate); const plannedDate = date(row.plannedDate);
  if (plannedDate && dueDate && dueDate < plannedDate) throw new Error("Due date cannot precede the planned date.");
  const optionalNumber = (value: unknown, max: number) => { if (value == null || value === "") return null; if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > max) throw new Error(`Enter a whole number from 1 to ${max}.`); return value; };
  const estimatedMinutes = optionalNumber(row.estimatedMinutes, 10080);
  if (content?.practiceMode === "bank_set" && row.questionTarget != null && row.questionTarget !== "") throw new Error("Saved question-bank sets require all their questions; do not set an aggregate practice target.");
  const questionTarget = kind === "practice" && content?.practiceMode !== "bank_set" ? optionalNumber(row.questionTarget, 10000) : null;
  let url: string | null = null;
  if (row.url) {
    if (!["external", "offline"].includes(kind) || typeof row.url !== "string" || row.url.length > 2000) throw new Error("Use a valid external URL.");
    try { const parsed = new URL(row.url); if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error(); url = parsed.href; } catch { throw new Error("External links must use http or https without embedded credentials."); }
  }
  return { kind, status: row.status as "planned" | "assigned", contentId: content?.id ?? null, title, instructions, url, dueDate, plannedDate, estimatedMinutes, questionTarget };
}
