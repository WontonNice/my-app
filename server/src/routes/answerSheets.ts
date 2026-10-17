import { createHash, randomUUID } from "node:crypto";
import { Router, type ErrorRequestHandler } from "express";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser, getEnrolledClassIds, isStudentArchived } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { changeSheetRecord, insertSheetRecord, sheetRecord, sheetRecords } from "../lib/answerSheetStore";
import { fromAssignmentRow, toAssignmentRow } from "../lib/learningPlanStore";
import { getExamContent } from "../lib/examContent";
import { listTeacherAssessments } from "../config/assessments";
import { validDate, type PlanAssignment } from "../shared/learningPlan";
import type { ExamContent, ExamQuestion } from "../shared/examTypes";
import { getAllExamQuestions, type SelectedAnswers, type ExamResult } from "../shared/examGrading";
import { gradeSheet, publicSheet, responseState, sheetCounts, sheetError, sheetItems, validateKeys, validateResponse, validateSheet, type AnswerSheet, type SheetAttempt, type SheetGrade, type SheetMapping } from "../shared/answerSheets";

export const answerSheetsRouter = Router();
const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
const teacher = (user: User) => ["teacher", "admin"].includes(user.app_metadata.role);
const student = (user: User) => user.app_metadata.role !== "teacher" && user.app_metadata.role !== "admin" && user.app_metadata.role !== "staff" && !isStudentArchived(user) && getEnrolledClassIds(user.app_metadata).includes("shsat");
const now = () => new Date().toISOString();
const slug = (assignmentId: string) => `attempt:${assignmentId}`;
const lease = (sessionId: string) => ({ sessionId, expiresAt: new Date(Date.now() + 120000).toISOString() });
type PrivateGrade = { revision: number; current: SheetGrade; history: SheetGrade[] };
function safeAttempt(value: SheetAttempt) { const { lease: _lease, mutations: _mutations, ...attempt } = value; return attempt; }
answerSheetsRouter.use(async (request, response, next) => {
  const auth = await getAuthenticatedUser(request.headers.authorization);
  if (!auth.user || auth.error) throw sheetError("Sign in to continue.", 401);
  response.locals.user = auth.user;
  if (request.path.startsWith("/teacher") && !teacher(auth.user)) throw sheetError("Teacher access is required.", 403);
  next();
});
async function definition(id: string, actor?: User) {
  const row = await sheetRecord<AnswerSheet>(`def:${id}`);
  if (!row || row.owner !== row.value.ownerId) throw sheetError("Answer sheet not found.", 404);
  if (actor && row.owner !== actor.id && actor.app_metadata.role !== "admin") throw sheetError("This answer sheet belongs to another teacher.", 403);
  return row.value;
}
async function enrolled(id: string) {
  const target = await supabase.auth.admin.getUserById(id);
  if (target.error || !target.data.user || !student(target.data.user)) throw sheetError("Active SHSAT student not found.", 404);
  return target.data.user;
}
async function assignments(sheetId?: string, studentId?: string) {
  const rows: PlanAssignment[] = [];
  for (let offset = 0; ; offset += 500) {
    let query = supabase.from("student_assignments").select("*").order("id").range(offset, offset + 499);
    if (sheetId) query = query.eq("content_id", sheetId); else query = query.like("content_id", "answer-sheet-%");
    if (studentId) query = query.eq("student_id", studentId);
    const result = await query;
    if (result.error) throw sheetError("Assignment storage is unavailable. Please retry.", 503);
    rows.push(...(result.data ?? []).map(fromAssignmentRow));
    if ((result.data?.length ?? 0) < 500) return rows;
  }
}
async function assignment(id: string, actor: User) {
  if (!uuid.test(id)) throw sheetError("Invalid assignment.");
  const result = await supabase.from("student_assignments").select("*").eq("id", id).maybeSingle();
  if (result.error) throw sheetError("Assignment storage is unavailable.", 503);
  if (!result.data) throw sheetError("Assignment not found.", 404);
  const task = fromAssignmentRow(result.data);
  if (!task.contentId?.startsWith("answer-sheet-") || task.kind !== "offline") throw sheetError("This is not an answer-sheet assignment.", 404);
  const sheet = await definition(task.contentId, teacher(actor) ? actor : undefined);
  if (!teacher(actor) && (!student(actor) || task.studentId !== actor.id || !task.assignedAt || ["planned", "cancelled", "skipped"].includes(task.status))) throw sheetError("This assignment is not available for your account.", 403);
  if (task.createdBy !== sheet.ownerId) { const creator = await supabase.auth.admin.getUserById(task.createdBy); if (creator.data.user?.app_metadata.role !== "admin") throw sheetError("The assignment's teacher is not authorized for this sheet.", 403); }
  return { task, sheet };
}
async function savedAttempt(task: PlanAssignment) {
  return (await sheetRecord<SheetAttempt>(slug(task.id), task.studentId))?.value ?? null;
}
async function syncTask(task: PlanAssignment, status: "in_progress" | "review" | "completed") {
  if (task.status === status || ["cancelled", "skipped"].includes(task.status)) return;
  const saved = await supabase.from("student_assignments").update({ status, updated_at: now(), revision: task.revision + 1, ...(status === "completed" ? { completed_at: now(), completion: { source: "answer_sheet", at: now(), reference: task.id } } : {}) }).eq("id", task.id).eq("revision", task.revision).select("id").maybeSingle();
  if (saved.error || !saved.data) throw sheetError("Responses are stored, but the assignment status could not be updated. Retry to finish syncing.", 503);
}
function requireLease(attempt: SheetAttempt, body: Record<string, unknown>) {
  if (attempt.status !== "in_progress") throw sheetError("This attempt has already been submitted.", 409);
  if (attempt.lease.sessionId !== body.sessionId || Date.parse(attempt.lease.expiresAt) <= Date.now()) throw sheetError("Another session owns this attempt, or this session expired. Reopen it and explicitly take over to continue.", 423);
}
async function released(attempt: SheetAttempt) {
  const latest = attempt.submissions.at(-1);
  if (!latest) return null;
  const result = await supabase.from("student_exam_results").select("result").eq("user_id", attempt.studentId).eq("assessment_id", `answer-sheet:${attempt.id}:${latest.id}`).maybeSingle();
  if (result.error) throw sheetError("Released results could not be loaded.", 503);
  return result.data?.result ?? null;
}
answerSheetsRouter.get("/teacher", async (_request, response) => {
  const user = response.locals.user as User;
  const sheets = await sheetRecords<AnswerSheet>("def:%", user.app_metadata.role === "admin" ? undefined : user.id);
  const roster: { id: string; name: string }[] = [];
  for (let page = 1; ; page++) { const listed = await supabase.auth.admin.listUsers({ page, perPage: 500 }); if (listed.error) throw sheetError("Student roster is unavailable.", 503); roster.push(...listed.data.users.filter(student).map(user => ({ id: user.id, name: String(user.user_metadata?.full_name || user.email?.split("@")[0] || "Student") }))); if (listed.data.users.length < 500) break; }
  response.json({ sheets: sheets.map(row => row.value), students: roster, assessments: listTeacherAssessments().map(exam => ({ id: exam.id, title: exam.title })) });
});
answerSheetsRouter.post("/teacher", async (request, response) => {
  const user = response.locals.user as User;
  const structure = validateSheet(request.body);
  const sheet: AnswerSheet = { ...structure, id: `answer-sheet-${randomUUID()}`, ownerId: user.id, revision: 1, issued: false, createdAt: now(), keys: {}, keyVersion: 0, keyHistory: [] };
  await insertSheetRecord(user.id, `def:${sheet.id}`, sheet);
  response.status(201).json({ sheet });
});
answerSheetsRouter.put("/teacher/:id", async (request, response) => {
  const user = response.locals.user as User, old = await definition(request.params.id, user);
  if (old.issued) throw sheetError("This sheet has been issued. Create a revised copy to change its structure; existing responses stay tied to this version.", 409);
  if (request.body.revision !== old.revision) throw sheetError("This sheet changed. Reload it before saving.", 409);
  const structure = validateSheet(request.body);
  validateKeys(structure, old.keys);
  response.json({ sheet: await changeSheetRecord(old.ownerId, `def:${old.id}`, old, { ...old, ...structure, id: old.id }) });
});
answerSheetsRouter.get("/teacher/:id", async (request, response) => {
  const sheet = await definition(request.params.id, response.locals.user), tasks = await assignments(sheet.id);
  const attempts = await Promise.all(tasks.map(savedAttempt));
  response.json({ sheet, assignments: tasks.map((task, index) => ({ ...task, attempt: attempts[index] ? safeAttempt(attempts[index]!) : null })) });
});
answerSheetsRouter.post("/teacher/:id/assign", async (request, response) => {
  const user = response.locals.user as User;
  let sheet = await definition(request.params.id, user);
  const { studentIds, batchId, dueDate, allowRepeat } = request.body;
  if (!Array.isArray(studentIds) || !studentIds.length || studentIds.length > 100 || new Set(studentIds).size !== studentIds.length || !studentIds.every(id => typeof id === "string" && uuid.test(id)) || !uuid.test(batchId) || dueDate && !validDate(dueDate)) throw sheetError("Select students, a valid due date, and a submission ID.");
  await Promise.all(studentIds.map(enrolled));
  const oldTasks = await assignments(sheet.id);
  const taskId = (id: string) => { const hash = createHash("sha256").update(`${sheet.id}:${batchId}:${id}`).digest("hex").slice(0, 32); return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`; };
  if (!allowRepeat && oldTasks.some(task => studentIds.includes(task.studentId) && task.id !== taskId(task.studentId) && !["cancelled", "skipped"].includes(task.status))) throw sheetError("This sheet is already assigned to a selected student. Explicitly choose Assign again to create a separate attempt.", 409);
  if (!sheet.issued) sheet = await changeSheetRecord(sheet.ownerId, `def:${sheet.id}`, sheet, { ...sheet, issued: true });
  const at = now();
  const tasks: PlanAssignment[] = studentIds.map(id => ({ id: taskId(id), studentId: id, kind: "offline", contentId: sheet.id, title: sheet.title, instructions: `Digital answer sheet · ${sheet.sourceVersion}`, url: `/answer-sheets/${taskId(id)}`, status: "assigned", assignedAt: at, dueDate: dueDate || null, plannedDate: null, completedAt: null, estimatedMinutes: null, questionTarget: null, practiceBaseline: null, createdAt: at, createdBy: user.id, updatedAt: at, revision: 1, completion: null, events: [{ at, actor: user.id, action: "Answer sheet assigned", changes: { sheetId: sheet.id } }] }));
  const saved = await supabase.from("student_assignments").upsert(tasks.map(toAssignmentRow), { onConflict: "id", ignoreDuplicates: true });
  if (saved.error) throw sheetError("The assignments could not be saved. Retry with the same selection.", 503);
  response.status(201).json({ assignments: tasks, sheet });
});
answerSheetsRouter.get("/student", async (_request, response) => {
  const user = response.locals.user as User;
  if (!student(user)) throw sheetError("Student access is required.", 403);
  const tasks = (await assignments(undefined, user.id)).filter(task => task.assignedAt && !["planned", "cancelled", "skipped"].includes(task.status));
  response.json({ assignments: await Promise.all(tasks.map(async task => ({ ...task, attempt: await savedAttempt(task).then(value => value ? safeAttempt(value) : null) }))) });
});
answerSheetsRouter.get("/teacher/student/:studentId/summary", async (request, response) => {
  await enrolled(request.params.studentId);
  const user = response.locals.user as User, tasks = await assignments(undefined, request.params.studentId);
  const allowed = tasks.filter(task => task.createdBy === user.id || user.app_metadata.role === "admin");
  response.json({ assignments: await Promise.all(allowed.map(async task => ({ ...task, attempt: await savedAttempt(task).then(value => value ? safeAttempt(value) : null) }))) });
});
answerSheetsRouter.post("/student/:assignmentId/open", async (request, response) => {
  const user = response.locals.user as User;
  if (teacher(user)) throw sheetError("Use teacher preview to inspect the sheet.", 403);
  const { task, sheet } = await assignment(request.params.assignmentId, user);
  if (!uuid.test(request.body.sessionId)) throw sheetError("A valid editing session is required.");
  let attempt = await savedAttempt(task);
  if (!attempt) {
    if (!["assigned", "in_progress"].includes(task.status)) throw sheetError("This assignment is not open for a new attempt.", 403);
    const at = now();
    attempt = { id: randomUUID(), assignmentId: task.id, studentId: user.id, sheet: publicSheet(sheet), revision: 1, answers: {}, responseRevisions: {}, flags: [], sectionId: sheet.sections[0].id, savedAt: at, startedAt: at, status: "in_progress", submissions: [], events: [], lease: lease(request.body.sessionId), mutations: [] };
    await insertSheetRecord(user.id, slug(task.id), attempt);
  } else if (attempt.status === "in_progress") {
    if (attempt.lease.sessionId !== request.body.sessionId && Date.parse(attempt.lease.expiresAt) > Date.now() && request.body.takeover !== true) { response.status(423).json({ message: "This attempt is open in another tab or device. Take over explicitly to continue here.", attempt: safeAttempt(attempt) }); return; }
    attempt = await changeSheetRecord(user.id, slug(task.id), attempt, { ...attempt, lease: lease(request.body.sessionId) });
  }
  await syncTask(task, attempt.status === "submitted" ? task.status === "completed" ? "completed" : "review" : "in_progress");
  response.json({ attempt: safeAttempt(attempt), result: await released(attempt) });
});
answerSheetsRouter.patch("/student/:assignmentId/responses", async (request, response) => {
  const user = response.locals.user as User, { task } = await assignment(request.params.assignmentId, user);
  if (teacher(user)) throw sheetError("Only the assigned student can edit responses.", 403);
  const old = await savedAttempt(task); if (!old) throw sheetError("Open the assignment first.", 404);
  requireLease(old, request.body);
  if (!uuid.test(request.body.mutationId)) throw sheetError("A valid save identifier is required.");
  if (old.mutations.includes(request.body.mutationId)) { response.json({ attempt: safeAttempt(old) }); return; }
  if (old.revision !== request.body.revision) throw sheetError("The saved revision changed. Reopen this attempt; your pending answers remain on this device.", 409);
  if (!Array.isArray(request.body.changes) || request.body.changes.length > 500) throw sheetError("Send only changed responses.");
  const next = structuredClone(old), seen = new Set<string>();
  for (const change of request.body.changes) {
    const item = sheetItems(old.sheet).find(item => item.id === change.itemId);
    if (!item || seen.has(item.id)) throw sheetError("Unknown or duplicate response item."); seen.add(item.id);
    if (Object.hasOwn(change, "answer")) next.answers[item.id] = validateResponse(item, change.answer);
    if (Object.hasOwn(change, "flagged")) { if (typeof change.flagged !== "boolean") throw sheetError("Invalid review flag."); next.flags = next.flags.filter(id => id !== item.id); if (change.flagged) next.flags.push(item.id); }
    next.responseRevisions[item.id] = old.revision + 1;
  }
  if (request.body.sectionId !== undefined) { if (!old.sheet.sections.some(section => section.id === request.body.sectionId)) throw sheetError("Unknown section."); next.sectionId = request.body.sectionId; }
  next.savedAt = now(); next.lease = lease(request.body.sessionId); next.mutations = [...old.mutations.slice(-99), request.body.mutationId];
  response.json({ attempt: safeAttempt(await changeSheetRecord(user.id, slug(task.id), old, next)) });
});
answerSheetsRouter.post("/student/:assignmentId/submit", async (request, response) => {
  const user = response.locals.user as User, { task } = await assignment(request.params.assignmentId, user);
  if (teacher(user)) throw sheetError("Only the assigned student can submit.", 403);
  let attempt = await savedAttempt(task); if (!attempt) throw sheetError("Open this attempt first.", 404);
  if (!uuid.test(request.body.submissionId)) throw sheetError("A valid submission identifier is required.");
  if (attempt.status === "submitted") {
    if (attempt.submissions.at(-1)?.id !== request.body.submissionId) throw sheetError("This attempt has already been submitted. Reopen it to view confirmation.", 409);
  } else {
    requireLease(attempt, request.body);
    if (attempt.revision !== request.body.revision) throw sheetError("Finish saving the latest changes before submitting.", 409);
    const counts = sheetCounts(attempt.sheet, attempt.answers, attempt.flags);
    if (counts.attention || counts.unanswered && (!attempt.sheet.allowUnanswered || request.body.confirmUnanswered !== true)) throw sheetError("Review unanswered questions and incomplete selection requirements before submitting.", 422);
    const at = now();
    attempt = await changeSheetRecord<SheetAttempt>(user.id, slug(task.id), attempt, { ...attempt, status: "submitted", submissions: [...attempt.submissions, { id: request.body.submissionId, at, answers: structuredClone(attempt.answers), flags: [...attempt.flags] }], events: [...attempt.events, { at, action: "Submitted from paper/PDF answer sheet", actor: user.id }] });
  }
  await syncTask(task, task.status === "completed" ? "completed" : "review");
  response.json({ attempt: safeAttempt(attempt), result: await released(attempt) });
});
answerSheetsRouter.put("/teacher/:id/key", async (request, response) => {
  const user = response.locals.user as User, sheet = await definition(request.params.id, user);
  if (request.body.revision !== sheet.revision) throw sheetError("The key changed in another window. Reload before saving.", 409);
  const keys = validateKeys(sheet, request.body.keys), version = sheet.keyVersion + 1;
  const updated = await changeSheetRecord(sheet.ownerId, `def:${sheet.id}`, sheet, { ...sheet, keys, keyVersion: version, keyHistory: [...sheet.keyHistory, { version, at: now(), actor: user.id, keys }] });
  response.json({ sheet: updated });
});
answerSheetsRouter.get("/teacher/attempt/:assignmentId/review", async (request, response) => {
  const { task, sheet } = await assignment(request.params.assignmentId, response.locals.user), attempt = await savedAttempt(task);
  response.json({ sheet, assignment: task, attempt: attempt ? safeAttempt(attempt) : null, grade: attempt ? (await sheetRecord<PrivateGrade>(`grade:${attempt.id}`, sheet.ownerId))?.value ?? null : null, result: attempt ? await released(attempt) : null });
});
answerSheetsRouter.post("/teacher/attempt/:assignmentId/reopen", async (request, response) => {
  const user = response.locals.user as User, { task } = await assignment(request.params.assignmentId, user), old = await savedAttempt(task);
  if (!old || old.status !== "submitted") throw sheetError("Only a submitted attempt can be reopened.");
  const attempt = await changeSheetRecord<SheetAttempt>(task.studentId, slug(task.id), old, { ...old, status: "in_progress", lease: { sessionId: "", expiresAt: now() }, events: [...old.events, { at: now(), action: "Teacher reopened submitted attempt; previous snapshot retained", actor: user.id }] });
  await syncTask(task, "in_progress"); response.json({ attempt: safeAttempt(attempt) });
});
answerSheetsRouter.post("/teacher/attempt/:assignmentId/grade", async (request, response) => {
  const user = response.locals.user as User, { task, sheet } = await assignment(request.params.assignmentId, user), attempt = await savedAttempt(task);
  if (!attempt || attempt.status !== "submitted") throw sheetError("Submit the attempt before grading.");
  const old = (await sheetRecord<PrivateGrade>(`grade:${attempt.id}`, sheet.ownerId))?.value;
  const supplied = request.body.manual ?? {};
  if (!supplied || typeof supplied !== "object" || Array.isArray(supplied)) throw sheetError("Invalid manual grades.");
  const manual = { ...supplied };
  if (old && old.current.submissionId === attempt.submissions.at(-1)?.id) for (const item of old.current.items) { if (manual[item.itemId] === undefined && item.key?.mode === "manual" && sheet.keys[item.itemId]?.mode === "manual" && item.possible === sheet.keys[item.itemId].points && item.earned !== null) manual[item.itemId] = item.earned; }
  if (!manual || typeof manual !== "object" || Array.isArray(manual)) throw sheetError("Invalid manual grades.");
  const grade = gradeSheet(sheet, attempt.submissions.at(-1)!, manual, user.id, now());
  const value: PrivateGrade = { revision: old?.revision ?? 1, current: grade, history: [...old?.history ?? [], grade] };
  if (old) await changeSheetRecord(sheet.ownerId, `grade:${attempt.id}`, old, value); else await insertSheetRecord(sheet.ownerId, `grade:${attempt.id}`, value);
  response.json({ grade: value });
});
function filteredContent(content: ExamContent, questions: Map<string, ExamQuestion>): ExamContent {
  const selected = (items: ExamQuestion[]) => items.flatMap(item => questions.has(item.id) ? [questions.get(item.id)!] : []);
  const passageSets = content.passageSets.map(set => ({ ...set, questions: selected(set.questions), questionCount: selected(set.questions).length })).filter(set => set.questions.length);
  const standaloneSection = content.standaloneSection ? { ...content.standaloneSection, questions: selected(content.standaloneSection.questions), questionCount: selected(content.standaloneSection.questions).length } : undefined;
  const mathSection = content.mathSection ? { ...content.mathSection, questions: selected(content.mathSection.questions), questionCount: selected(content.mathSection.questions).length } : undefined;
  return { ...content, passageSets, standaloneSection, mathSection };
}
function linkedAnalysis(sheet: AnswerSheet, attempt: SheetAttempt): { answers: SelectedAnswers; analysisContent?: ExamContent } {
  const snapshot = sheet.mapping?.contentSnapshot;
  if (!snapshot || !sheet.mapping) return { answers: {} };
  const answers: SelectedAnswers = {}, questions = new Map<string, ExamQuestion>();
  for (const mapping of sheet.mapping.items) {
    const key = sheet.keys[mapping.itemId], question = getAllExamQuestions(snapshot).find(question => question.id === mapping.questionId), item = sheetItems(sheet).find(item => item.id === mapping.itemId);
    if (!key || key.mode === "manual" || !question || !item) continue;
    const raw = attempt.submissions.at(-1)!.answers[item.id];
    const mapAnswer = (value: unknown) => typeof value === "string" ? item.type === "short_response" ? value : value === "" ? "" : mapping.optionMap[value] ?? "" : Array.isArray(value) ? value.map(id => mapping.optionMap[id]).filter(Boolean) : "";
    answers[question.id] = mapAnswer(raw);
    questions.set(question.id, { ...question, type: item.type, correctChoiceId: typeof key.answer === "string" ? String(mapAnswer(key.answer)) : undefined, correctChoiceIds: Array.isArray(key.answer) ? key.answer.map(id => mapping.optionMap[id]) : undefined, correctTextAnswers: key.accepted, textMatchMode: item.type === "short_response" ? key.mode as "exact" | "normalized" : undefined });
  }
  return { answers, analysisContent: filteredContent(snapshot, questions) };
}
answerSheetsRouter.post("/teacher/attempt/:assignmentId/release", async (request, response) => {
  const { task, sheet } = await assignment(request.params.assignmentId, response.locals.user), attempt = await savedAttempt(task);
  const grade = attempt ? (await sheetRecord<PrivateGrade>(`grade:${attempt.id}`, sheet.ownerId))?.value.current : null;
  if (!attempt || attempt.status !== "submitted" || !grade || grade.pending || grade.keyVersion !== sheet.keyVersion || grade.submissionId !== attempt.submissions.at(-1)?.id) throw sheetError("Grade the current submission completely with the latest key before releasing.", 409);
  const id = `answer-sheet:${attempt.id}:${grade.submissionId}`;
  const analysis = linkedAnalysis(sheet, attempt);
  const result: ExamResult & { answerSheet: unknown } = { assessmentId: id, title: `${sheet.title}${sheet.sourceVersion ? ` · ${sheet.sourceVersion}` : ""}`, source: "answer_sheet", answers: analysis.answers, completedSections: ["english", "math"], completionStatus: "complete", completedAt: attempt.submissions.at(-1)!.at, correct: grade.items.filter(item => item.status === "correct").length, total: grade.items.length, percentage: Math.round(100 * grade.earned! / grade.possible), topics: [], mathTopics: [], passages: [], questionTypes: [], subjects: ["english", "math"].flatMap(subject => { const items = sheet.sections.filter(section => section.subject === subject).flatMap(section => section.items); if (!items.length) return []; const ids = new Set(items.map(item => item.id)); const scores = grade.items.filter(item => ids.has(item.itemId)); return [{ subject: subject === "math" ? "Mathematics" as const : "English Language Arts" as const, total: scores.length, correct: scores.filter(item => item.status === "correct").length, topics: [] }]; }), answerSheet: { sheetId: sheet.id, assignmentId: task.id, attemptId: attempt.id, sourceVersion: sheet.sourceVersion, keyVersion: grade.keyVersion, grade, analysisContent: analysis.analysisContent, provenance: "Paper/PDF test; responses captured digitally", mapping: sheet.mapping ?? null } };
  const saved = await supabase.from("student_exam_results").upsert({ user_id: task.studentId, assessment_id: id, result, completed_at: result.completedAt, updated_at: now() }, { onConflict: "user_id,assessment_id" });
  if (saved.error) throw sheetError("Results could not be released. Retry; saved responses and grades are preserved.", 503);
  await syncTask(task, "completed"); response.json({ result });
});
answerSheetsRouter.get("/teacher/:id/export", async (request, response) => {
  const sheet = await definition(request.params.id, response.locals.user), tasks = await assignments(sheet.id);
  const rows = await Promise.all(tasks.map(async task => { const attempt = await savedAttempt(task), grading = attempt ? (await sheetRecord<PrivateGrade>(`grade:${attempt.id}`, sheet.ownerId))?.value : null; return { studentId: task.studentId, assignmentId: task.id, attemptId: attempt?.id ?? null, title: sheet.title, sourceVersion: sheet.sourceVersion, status: attempt?.status ?? "not_started", savedAt: attempt?.savedAt ?? null, submissions: attempt?.submissions ?? [], gradingHistory: grading?.history ?? [], responses: sheet.sections.flatMap(section => section.items.map(item => ({ section: section.title, sectionId: section.id, number: item.number, itemId: item.id, type: item.type, options: item.options, response: attempt?.answers[item.id] ?? null, grading: attempt?.status === "submitted" && grading?.current.submissionId === attempt.submissions.at(-1)?.id ? grading?.current.items.find(row => row.itemId === item.id) ?? null : null }))) }; }));
  response.setHeader("Content-Disposition", `attachment; filename="${sheet.id}-responses.json"`); response.json({ format: "nathan-tutors-answer-sheet-v1", sheet, rows });
});
answerSheetsRouter.get("/teacher/targets/:assessmentId", async (request, response) => {
  const content = getExamContent(request.params.assessmentId);
  if (!content) throw sheetError("Digitized assessment not found.", 404);
  const mathIds = new Set(content.mathSection?.questions.map(item => item.id));
  response.json({ questions: getAllExamQuestions(content).map(question => ({ id: question.id, type: question.type, subject: mathIds.has(question.id) ? "math" : "english", prompt: question.prompt, options: question.choices?.map(option => ({ id: option.id, label: option.id })) ?? [] })) });
});
function inspectMapping(sheet: AnswerSheet, body: { assessmentId: string; sourceVersion: string; items: SheetMapping[] }) {
  const content = getExamContent(body.assessmentId), problems: string[] = [], warnings: string[] = [];
  if (!content) return { problems: ["Digitized assessment not found."], warnings };
  if (sheet.sourceVersion && !`${content.title} ${body.assessmentId}`.toLowerCase().replace(/[^a-z0-9]/g, "").includes(sheet.sourceVersion.toLowerCase().replace(/[^a-z0-9]/g, ""))) warnings.push("The selected digitized title does not confirm the source form/version. Check this explicitly before applying.");
  if (body.sourceVersion !== sheet.sourceVersion) problems.push("Source form/version does not match this sheet.");
  if (!Array.isArray(body.items)) return { problems: ["Provide explicit item mappings."], warnings };
  const questions = getAllExamQuestions(content), seen = new Set<string>(), targets = new Set<string>();
  const math = new Set(content.mathSection?.questions.map(question => question.id));
  for (const mapping of body.items) {
    if (!mapping || typeof mapping.itemId !== "string" || typeof mapping.questionId !== "string" || !mapping.optionMap || typeof mapping.optionMap !== "object" || Array.isArray(mapping.optionMap)) { problems.push("Each mapping needs source/target IDs and an explicit option map."); continue; }
    const item = sheetItems(sheet).find(item => item.id === mapping.itemId), question = questions.find(question => question.id === mapping.questionId);
    if (!item || !question || seen.has(mapping.itemId) || targets.has(mapping.questionId)) { problems.push("Missing or duplicate source/target question."); continue; }
    seen.add(item.id); targets.add(question.id);
    const section = sheet.sections.find(section => section.items.some(row => row.id === item.id))!;
    if (section.subject !== "other" && (math.has(question.id) ? "math" : "english") !== section.subject) problems.push(`Wrong section for question ${item.number}.`);
    if (question.type !== item.type && !(item.type === "short_response" && ["numeric_entry", "grid_in", "essay"].includes(question.type))) problems.push(`Response type differs for question ${item.number}.`);
    if (item.type !== "short_response") {
      const mapped = item.options.map(option => mapping.optionMap?.[option.id]);
      if (mapped.length !== question.choices?.length || new Set(mapped).size !== mapped.length || mapped.some(id => !question.choices?.some(option => option.id === id))) problems.push(`Incomplete or incompatible option mapping for question ${item.number}.`);
      if (item.options.some((option, index) => mapping.optionMap?.[option.id] !== question.choices?.[index]?.id || option.label !== mapping.optionMap?.[option.id])) warnings.push(`Question ${item.number}: option identities, labels, or order differ; review every explicit mapping.`);
    }
  }
  if (seen.size !== sheetItems(sheet).length) problems.push("Every stable answer-sheet item must be mapped exactly once.");
  return { problems, warnings };
}
answerSheetsRouter.post("/teacher/:id/mapping/preview", async (request, response) => { const sheet = await definition(request.params.id, response.locals.user); response.json(inspectMapping(sheet, request.body)); });
answerSheetsRouter.post("/teacher/:id/mapping/apply", async (request, response) => {
  const user = response.locals.user as User, sheet = await definition(request.params.id, user), report = inspectMapping(sheet, request.body);
  if (report.problems.length || report.warnings.length && request.body.acknowledgeChanges !== true) { response.status(422).json({ message: "Resolve mapping problems and explicitly acknowledge option changes.", ...report }); return; }
  if (request.body.revision !== sheet.revision) throw sheetError("The sheet changed. Preview the mapping again.", 409);
  const content = getExamContent(request.body.assessmentId)!;
  const targetIds = new Set(request.body.items.map((item: SheetMapping) => item.questionId));
  const snapshot = filteredContent(content, new Map(getAllExamQuestions(content).filter(question => targetIds.has(question.id)).map(question => [question.id, question])));
  const updated = await changeSheetRecord(sheet.ownerId, `def:${sheet.id}`, sheet, { ...sheet, mappingHistory: [...sheet.mappingHistory ?? [], { assessmentId: request.body.assessmentId, at: now(), actor: user.id, items: request.body.items }], mapping: { assessmentId: request.body.assessmentId, sourceVersion: request.body.sourceVersion, items: request.body.items, at: now(), actor: user.id, contentSnapshot: snapshot } });
  response.json({ sheet: updated, ...report });
});
const handleError: ErrorRequestHandler = (error, _request, response, next) => { if (response.headersSent) { next(error); return; } response.status(error.status ?? 500).json({ message: error.status ? error.message : "The answer-sheet request failed. Keep pending work and retry." }); };
answerSheetsRouter.use(handleError);
