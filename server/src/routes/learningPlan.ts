import { Router } from "express";
import { createHash } from "node:crypto";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole, isStudentArchived } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { getDatabaseProgress } from "./progress";
import { assignmentDetail, assignmentSummaries, checkStorage, fromAssignmentRow, learningCatalog, listColumns, reconcileCompletions, toAssignmentRow, updateAssignment } from "../lib/learningPlanStore";
import { activeStatuses, assignmentStatuses, inventory, planSummary, practiceAnswered, todayInNewYork, validDate, validateDraft, weekDays, type PlanAssignment, type PlanContent, type PlanSettings, type PriorContentActivity } from "../shared/learningPlan";

export const learningPlanRouter = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const teacher = (user: User) => ["teacher", "admin"].includes(getUserRole(user));
const fail = (message: string, status = 400) => Object.assign(new Error(message), { status });
const defaultSettings = (studentId: string): PlanSettings => ({ studentId, passagePace: null, targetDate: null, teacherNotes: "", updatedAt: null, revision: 0 });
const settingsFromRow = (studentId: string, row: Record<string, unknown> | null): PlanSettings => row ? ({ studentId, passagePace: row.passage_pace === null ? null : Number(row.passage_pace), targetDate: row.target_date as string | null, teacherNotes: String(row.teacher_notes ?? ""), updatedAt: String(row.updated_at), revision: Number(row.revision) }) : defaultSettings(studentId);

learningPlanRouter.use(async (request, response, next) => {
  const auth = await getAuthenticatedUser(request.headers.authorization);
  if (!auth.user) { response.status(401).json({ message: auth.error }); return; }
  response.locals.user = auth.user; next();
});
learningPlanRouter.get("/roster", async (_request, response) => {
  if (!teacher(response.locals.user)) throw fail("Teacher access is required.", 403);
  const groups = new Map<string, PlanAssignment[]>();
  for (const item of await assignmentSummaries(undefined, [...activeStatuses, "planned"])) { const rows = groups.get(item.studentId) ?? []; rows.push(item); groups.set(item.studentId, rows); }
  response.json({ students: Object.fromEntries([...groups].map(([id, rows]) => [id, planSummary(rows)])) });
});
// Do not allow path/query parameters to switch a student's identity.
learningPlanRouter.use("/teacher/:studentId", async (request, response, next) => {
  if (!teacher(response.locals.user)) { response.status(403).json({ message: "Teacher access is required." }); return; }
  if (!uuid.test(request.params.studentId)) { response.status(400).json({ message: "Choose a valid student." }); return; }
  const lookup = await supabase.auth.admin.getUserById(request.params.studentId);
  const student = lookup.data.user;
  if (lookup.error || !student || getUserRole(student) !== "student" || isStudentArchived(student) || !getEnrolledClassIds(student.app_metadata).includes("shsat")) { response.status(404).json({ message: "Choose an active SHSAT student." }); return; }
  response.locals.student = student; next();
});
learningPlanRouter.use("/student", (_request, response, next) => {
  const user = response.locals.user as User;
  if (getUserRole(user) !== "student" || isStudentArchived(user) || !getEnrolledClassIds(user.app_metadata).includes("shsat")) { response.status(403).json({ message: "SHSAT student access is required." }); return; }
  response.locals.student = user; next();
});

async function priorActivity(student: User, catalog: PlanContent[]): Promise<PriorContentActivity[]> {
  const progress = await getDatabaseProgress(student);
  const passages = catalog.filter(item => item.kind === "passage");
  const alias = new Map(passages.flatMap(item => item.aliases.map(id => [id, item.id] as const)));
  const result: PriorContentActivity[] = [];
  for (const exam of progress.examResults) {
    if (exam.completionStatus === "in_progress") continue;
    const at = typeof exam.completedAt === "string" && Number.isFinite(Date.parse(exam.completedAt)) ? exam.completedAt : null;
    if (exam.completionStatus !== "english_complete" && exam.completionStatus !== "math_complete" && catalog.some(item => item.kind === "exam" && item.id === exam.assessmentId)) result.push({ contentId: String(exam.assessmentId), at, source: "Existing exam result", correct: typeof exam.correct === "number" ? exam.correct : undefined, total: typeof exam.total === "number" ? exam.total : undefined });
    for (const value of Array.isArray(exam.passages) ? exam.passages : []) {
      const contentId = alias.get(value.id);
      if (contentId && value.total > 0 && exam.completionStatus !== "math_complete") result.push({ contentId, at, correct: value.correct, total: value.total, source: "Existing exam passage result", reference: String(exam.assessmentId) });
    }
  }
  const [attempts, fallback] = await Promise.all([
    priorLibraryAttempts(student.id),
    supabase.from("student_practice_progress").select("topic_slug,progress").eq("user_id", student.id).like("topic_slug", "english-library:%"),
  ]);
  const rows = [...(attempts.error ? [] : attempts.data ?? []), ...(fallback.error ? [] : (fallback.data ?? []).flatMap(row => Array.isArray(row.progress?.attempts) ? row.progress.attempts : []))];
  const seen = new Set<string>();
  for (const row of rows) {
    const contentIds = passages.filter(item => item.id === row.book_id || item.aliases.includes(row.book_id)).map(item => item.id);
    for (const contentId of contentIds) {
      const key = `${row.id}:${contentId}`;
      if (seen.has(key) || !(row.total_questions > 0)) continue;
      seen.add(key); result.push({ contentId, at: typeof row.completed_at === "string" && Number.isFinite(Date.parse(row.completed_at)) ? row.completed_at : null, correct: row.score, total: row.total_questions, source: "Saved library attempt", reference: row.id });
    }
  }
  return result;
}
async function priorLibraryAttempts(studentId: string) {
  const rows: { id: string; book_id: string; score: number; total_questions: number; completed_at: string }[] = [];
  for (let offset = 0; ; offset += 1000) {
    const result = await supabase.from("student_library_attempts").select("id,book_id,score,total_questions,completed_at").eq("user_id", studentId).order("id").range(offset, offset + 999);
    if (result.error) return { data: rows, error: result.error };
    rows.push(...(result.data ?? []));
    if ((result.data?.length ?? 0) < 1000) return { data: rows, error: null };
  }
}
async function getOverview(student: User, isTeacher: boolean) {
  const catalog = learningCatalog().filter(item => !item.classId || getEnrolledClassIds(student.app_metadata).includes(item.classId));
  let assignments = await assignmentSummaries(student.id);
  // Repair completion tracking from canonical saves if a write hook was deferred.
  // Passage evidence from an exam is historical usage, not completion of a separately assigned passage task.
  const prior = isTeacher || assignments.some(item => activeStatuses.includes(item.status)) ? await priorActivity(student, catalog) : [];
  const active = assignments.filter(item => activeStatuses.includes(item.status));
  const candidates = prior.filter(item => item.at && ["Saved library attempt", "Existing exam result"].includes(item.source) && active.some(task => task.contentId === item.contentId)).map(activity => ({
    kind: catalog.find(item => item.id === activity.contentId)!.kind, contentId: activity.contentId,
    completion: { source: activity.source === "Existing exam result" ? "exam" as const : "library" as const, at: activity.at!, reference: activity.reference, correct: activity.correct, total: activity.total },
  }));
  const activePractice = active.filter(item => item.kind === "practice" && item.contentId);
  const practice = activePractice.length ? await supabase.from("student_practice_progress").select("topic_slug,progress,updated_at").eq("user_id", student.id).in("topic_slug", activePractice.map(item => item.contentId!)) : null;
  const practiceEvidence = (practice?.error ? [] : practice?.data ?? []).map(row => ({ kind: "practice" as const, contentId: String(row.topic_slug), answered: practiceAnswered(row.progress), completion: { source: "practice" as const, at: String(row.updated_at), reference: String(row.topic_slug) } }));
  const changed = await reconcileCompletions(student.id, [...candidates, ...practiceEvidence]);
  if (changed) {
    assignments = await assignmentSummaries(student.id);
  }
  const visible = isTeacher ? assignments : assignments.filter(item => item.assignedAt && item.status !== "planned");
  const summary = planSummary(visible);
  const days = weekDays();
  const schedule = visible.filter(item => days.includes(item.status === "planned" ? item.plannedDate ?? "" : item.dueDate ?? ""));
  if (!isTeacher) return { summary, schedule, catalog: catalog.filter(item => visible.some(task => task.kind === item.kind && task.contentId === item.id)) };
  const settingsQuery = await supabase.from("student_learning_plans").select("*").eq("student_id", student.id).maybeSingle(); checkStorage(settingsQuery.error);
  const content = inventory(catalog, assignments, prior).map(row => ({ content: row.content, status: row.status, hasBeenAssigned: row.hasBeenAssigned, hasCompleted: row.hasCompleted, lastActivity: row.lastActivity, lastCompletedAt: row.lastCompletedAt, dueDate: row.active?.dueDate ?? null, plannedDate: row.planned?.plannedDate ?? null, assignmentCount: row.history.length, priorCount: row.evidence.length }));
  return { summary, schedule, catalog, inventory: content, settings: settingsFromRow(student.id, settingsQuery.data) };
}
learningPlanRouter.get("/teacher/:studentId", async (_request, response) => { response.json(await getOverview(response.locals.student, true)); });
learningPlanRouter.get("/teacher/:studentId/published", async (_request, response) => { response.json(await getOverview(response.locals.student, false)); });
learningPlanRouter.get("/student", async (_request, response) => { response.json(await getOverview(response.locals.student, false)); });

async function listAssignments(student: User, query: Record<string, unknown>, isTeacher: boolean) {
  const page = Math.max(0, Math.min(100000, Math.floor(Number(query.page) || 0)));
  let request = supabase.from("student_assignments").select(listColumns, { count: "exact" }).eq("student_id", student.id);
  if (!isTeacher || query.published === "1") request = request.not("assigned_at", "is", null).neq("status", "planned");
  const status = String(query.status ?? "active");
  if (status === "schedule") {
    const offset = Math.max(-520, Math.min(520, Math.floor(Number(query.page) || 0)));
    const days = weekDays(todayInNewYork(), offset);
    const result = await request.not("status", "in", "(cancelled,skipped)").or(`and(status.eq.planned,planned_date.gte.${days[0]},planned_date.lte.${days[6]}),and(status.neq.planned,due_date.gte.${days[0]},due_date.lte.${days[6]})`).order("due_date").limit(500);
    checkStorage(result.error); return { assignments: (result.data ?? []).map(fromAssignmentRow), total: result.count ?? 0, page: offset };
  }
  if (status === "active" || status === "overdue" || status === "week") request = request.in("status", activeStatuses);
  else if (assignmentStatuses.includes(status as PlanAssignment["status"])) request = request.eq("status", status);
  if (status === "overdue") request = request.lt("due_date", todayInNewYork());
  if (status === "week") { const days = weekDays(); request = request.gte("due_date", days[0]).lte("due_date", days[6]); }
  if (typeof query.contentId === "string") request = request.eq("content_id", query.contentId);
  if (typeof query.kind === "string") request = request.eq("kind", query.kind);
  if (typeof query.search === "string" && query.search.trim()) request = request.ilike("title", `%${query.search.trim().replace(/[%_]/g, "").slice(0, 150)}%`);
  const result = await request.order(status === "completed" || status === "all" ? "created_at" : "due_date", { ascending: status !== "completed" && status !== "all", nullsFirst: false }).order("id").range(page * 50, page * 50 + 49);
  checkStorage(result.error); return { assignments: (result.data ?? []).map(fromAssignmentRow), total: result.count ?? 0, page };
}
learningPlanRouter.get("/teacher/:studentId/assignments", async (request, response) => { response.json(await listAssignments(response.locals.student, request.query, true)); });
learningPlanRouter.get("/student/assignments", async (request, response) => { response.json(await listAssignments(response.locals.student, request.query, false)); });
learningPlanRouter.get("/teacher/:studentId/content/:kind/:contentId", async (request, response) => {
  const student = response.locals.student as User;
  const catalog = learningCatalog();
  const history = await listAssignments(student, { ...request.query, kind: request.params.kind, contentId: request.params.contentId, status: "all" }, true);
  const prior = (await priorActivity(student, catalog)).filter(item => item.contentId === request.params.contentId);
  response.json({ ...history, prior });
});
learningPlanRouter.get("/teacher/:studentId/assignments/:id", async (request, response) => {
  if (!uuid.test(request.params.id)) throw fail("Invalid assignment ID.");
  const item = await assignmentDetail(response.locals.student.id, request.params.id); if (!item) throw fail("Assignment not found.", 404); response.json({ assignment: item });
});

learningPlanRouter.post("/teacher/:studentId/assignments", async (request, response) => {
  const student = response.locals.student as User; const actor = response.locals.user as User;
  const catalog = learningCatalog().filter(item => !item.classId || getEnrolledClassIds(student.app_metadata).includes(item.classId));
  const { items, allowRepeat, batchId } = request.body ?? {};
  if (!Array.isArray(items) || !items.length || items.length > 30 || typeof batchId !== "string" || !uuid.test(batchId)) throw fail("Choose 1–30 tasks and a valid submission ID.");
  const drafts = items.map(item => validateDraft(item, catalog));
  const refs = drafts.filter(item => item.contentId).map(item => `${item.kind}:${item.contentId}`);
  if (new Set(refs).size !== refs.length) throw fail("The same content appears twice in this batch.");
  const ids = drafts.map((_, index) => { const hash = createHash("sha256").update(`${student.id}:${batchId}:${index}`).digest("hex").slice(0, 32); return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`; });
  const tasks = await assignmentSummaries(student.id);
  if (ids.every(id => tasks.some(item => item.id === id))) { response.json({ assignments: tasks.filter(item => ids.includes(item.id)) }); return; }
  const prior = await priorActivity(student, catalog);
  const duplicates = drafts.flatMap(item => {
    if (!item.contentId) return [];
    const previous = tasks.filter(task => task.kind === item.kind && task.contentId === item.contentId && !ids.includes(task.id) && (task.assignedAt || task.status === "planned"));
    const activity = prior.filter(record => record.contentId === item.contentId);
    return previous.length || activity.length ? [{ title: item.title, contentId: item.contentId, previous: previous.map(task => ({ status: task.status, assignedAt: task.assignedAt, completedAt: task.completedAt })), prior: activity }] : [];
  });
  if (duplicates.length && allowRepeat !== true) { response.status(409).json({ message: "This student already received, completed, or has planned content in this selection. Review their history, then explicitly choose Assign again / Plan again.", duplicates }); return; }
  const progress = drafts.some(item => item.kind === "practice" && item.status === "assigned") ? await getDatabaseProgress(student) : null;
  const now = new Date().toISOString();
  const assignments: PlanAssignment[] = drafts.map((draft, index) => ({ ...draft, id: ids[index], studentId: student.id, assignedAt: draft.status === "assigned" ? now : null, completedAt: null,
    practiceBaseline: draft.kind === "practice" && draft.status === "assigned" ? practiceAnswered(progress?.practice[draft.contentId!]) : null,
    createdAt: now, createdBy: actor.id, updatedAt: now, revision: 1, completion: null, events: [{ at: now, actor: actor.id, action: draft.status === "planned" ? "Planned" : "Assigned", changes: draft }] }));
  const saved = await supabase.from("student_assignments").upsert(assignments.map(toAssignmentRow), { onConflict: "id", ignoreDuplicates: true }); checkStorage(saved.error);
  response.status(201).json({ assignments });
});

learningPlanRouter.patch("/teacher/:studentId/assignments/:id", async (request, response) => {
  if (!uuid.test(request.params.id)) throw fail("Invalid assignment ID.");
  const old = await assignmentDetail(response.locals.student.id, request.params.id); if (!old) throw fail("Assignment not found.", 404);
  const body = request.body ?? {};
  if (body.revision !== old.revision) throw fail("This assignment changed. Reload before saving.", 409);
  const status = body.status ?? old.status;
  if (!assignmentStatuses.includes(status)) throw fail("Choose a valid assignment status.");
  if (old.status === "planned" && !["planned", "assigned", "cancelled", "skipped"].includes(status)) throw fail("Assign planned work before marking it started or complete.");
  if (["completed", "cancelled", "skipped"].includes(old.status) && status !== old.status) throw fail("Keep this history intact; create a new assignment to repeat the work.");
  if (old.assignedAt && status === "planned") throw fail("An issued task cannot become an unpublished draft. Cancel it and plan a new task.");
  const validated = validateDraft({ ...old, ...body, kind: old.kind, contentId: old.contentId, status: status === "planned" ? "planned" : "assigned" }, learningCatalog());
  const changes: Partial<PlanAssignment> = { title: validated.title, instructions: validated.instructions, url: validated.url, dueDate: validated.dueDate, plannedDate: validated.plannedDate, estimatedMinutes: validated.estimatedMinutes, status };
  if (!old.assignedAt) changes.questionTarget = validated.questionTarget;
  if (status !== "planned" && !old.assignedAt && !["cancelled", "skipped"].includes(status)) {
    changes.assignedAt = new Date().toISOString();
    if (old.kind === "practice") changes.practiceBaseline = practiceAnswered((await getDatabaseProgress(response.locals.student)).practice[old.contentId!]);
  }
  if (status === "completed" && old.status !== "completed") { changes.completedAt = new Date().toISOString(); changes.completion = { source: "teacher", at: changes.completedAt }; }
  response.json({ assignment: await updateAssignment(old, changes, response.locals.user.id, status === old.status ? "Details updated" : `Status: ${status}`) });
});
learningPlanRouter.patch("/student/assignments/:id", async (request, response) => {
  if (!uuid.test(request.params.id)) throw fail("Invalid assignment ID.");
  const old = await assignmentDetail(response.locals.student.id, request.params.id);
  if (!old || !old.assignedAt || !activeStatuses.includes(old.status)) throw fail("Active assignment not found.", 404);
  if (request.body?.revision !== old.revision) throw fail("This assignment changed. Reload before updating.", 409);
  const action = request.body?.action;
  if (action !== "start" && action !== "submit") throw fail("Choose Start or Submit for teacher review.");
  if (old.status === "review") throw fail("Your teacher is reviewing this task.");
  if (action === "start" && old.status === "in_progress") { delete old.events; response.json({ assignment: old }); return; }
  const updated = await updateAssignment(old, { status: action === "start" ? "in_progress" : "review" }, response.locals.user.id, action === "start" ? "Student started" : "Student reported completion; awaiting teacher verification");
  delete updated.events; response.json({ assignment: updated });
});
learningPlanRouter.patch("/teacher/:studentId/settings", async (request, response) => {
  const studentId = response.locals.student.id;
  const body = request.body ?? {};
  if (body.passagePace !== null && (typeof body.passagePace !== "number" || !Number.isFinite(body.passagePace) || body.passagePace <= 0 || body.passagePace > 100)) throw fail("Set a passage pace greater than zero and no more than 100, or leave it blank.");
  if (body.targetDate !== null && !validDate(body.targetDate)) throw fail("Choose a valid target date, or leave it blank.");
  if (typeof body.teacherNotes !== "string" || body.teacherNotes.length > 20000) throw fail("Keep teacher notes under 20,000 characters.");
  const old = await supabase.from("student_learning_plans").select("*").eq("student_id", studentId).maybeSingle(); checkStorage(old.error);
  const settings = settingsFromRow(studentId, old.data);
  if (body.revision !== settings.revision) throw fail("The plan settings changed. Reload before saving.", 409);
  const row = { student_id: studentId, passage_pace: body.passagePace, target_date: body.targetDate, teacher_notes: body.teacherNotes.trim(), revision: settings.revision + 1, updated_at: new Date().toISOString() };
  const saved = old.data ? await supabase.from("student_learning_plans").update(row).eq("student_id", studentId).eq("revision", settings.revision).select("*").maybeSingle() : await supabase.from("student_learning_plans").insert(row).select("*").single();
  if (saved.error?.code === "23505" || !saved.error && !saved.data) throw fail("Plan settings changed in another window. Reload before saving.", 409);
  checkStorage(saved.error); response.json({ settings: settingsFromRow(studentId, saved.data) });
});
learningPlanRouter.use((error: Error & { status?: number }, _request: import("express").Request, response: import("express").Response, _next: import("express").NextFunction) => {
  response.status(error.status ?? (error.message.startsWith("Learning-plan storage") ? 503 : 400)).json({ message: error.message });
});
