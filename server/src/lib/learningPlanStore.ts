import fs from "node:fs";
import path from "node:path";
import { supabase } from "./supabase";
import { listTeacherAssessments } from "../config/assessments";
import { getExamContent } from "./examContent";
import { readQuestionBank } from "./questionBank";
import { bankCatalog } from "../shared/questionBank";
import { activeStatuses, practiceAnswered, type AssignmentKind, type CompletionEvidence, type PlanAssignment, type PlanContent } from "../shared/learningPlan";

const fields: Record<string, string> = { studentId: "student_id", contentId: "content_id", assignedAt: "assigned_at", dueDate: "due_date", plannedDate: "planned_date", completedAt: "completed_at", estimatedMinutes: "estimated_minutes", questionTarget: "question_target", practiceBaseline: "practice_baseline", createdAt: "created_at", createdBy: "created_by", updatedAt: "updated_at" };
export const listColumns = "id,student_id,kind,content_id,title,instructions,url,status,assigned_at,due_date,planned_date,completed_at,estimated_minutes,question_target,practice_baseline,created_at,created_by,updated_at,revision,completion";
export const summaryColumns = listColumns.replace(",instructions,url", "");
export function fromAssignmentRow(value: unknown): PlanAssignment {
  const row = value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [Object.entries(fields).find(([, column]) => column === key)?.[0] ?? key, value])) as PlanAssignment;
}
export function toAssignmentRow(item: Partial<PlanAssignment>) { return Object.fromEntries(Object.entries(item).map(([key, value]) => [fields[key] ?? key, value])); }
export function checkStorage(error: { message: string } | null) {
  if (error) throw new Error("Learning-plan storage is unavailable. Apply migration 202610040001_personalized_learning_plans.sql, or check the database connection.");
}
/** Fetch compact metadata in bounded pages; Supabase otherwise silently caps results. */
export async function assignmentSummaries(studentId?: string, statuses?: PlanAssignment["status"][]) {
  const assignments: PlanAssignment[] = [];
  for (let offset = 0; ; offset += 1000) {
    let query = supabase.from("student_assignments").select(summaryColumns).order("id");
    if (studentId) query = query.eq("student_id", studentId);
    if (statuses) query = query.in("status", statuses);
    const result = await query.range(offset, offset + 999); checkStorage(result.error);
    assignments.push(...(result.data ?? []).map(fromAssignmentRow));
    if ((result.data?.length ?? 0) < 1000) return assignments;
  }
}
export function learningCatalog(): PlanContent[] {
  const base = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../data/learning-catalog.json"), "utf8")) as PlanContent[];
  const exams = listTeacherAssessments().map(exam => {
    const content = getExamContent(exam.id);
    const questions = [...(content?.passageSets.flatMap(set => set.questions) ?? []), ...(content?.standaloneSection?.questions ?? []), ...(content?.mathSection?.questions ?? [])];
    return { id: exam.id, kind: "exam" as const, title: exam.title, href: `/exam/${encodeURIComponent(exam.id)}`, subject: "English + Math", category: "Assessment", classId: exam.classId, skills: [...new Set(questions.map(question => question.topic))], questionCount: questions.length, aliases: [exam.id] };
  });
  return [...base, ...bankCatalog(readQuestionBank()), ...exams.filter(exam => exam.questionCount > 0)];
}
export async function assignmentDetail(studentId: string, id: string) {
  const result = await supabase.from("student_assignments").select("*").eq("student_id", studentId).eq("id", id).maybeSingle();
  checkStorage(result.error);
  return result.data ? fromAssignmentRow(result.data) : null;
}
export async function updateAssignment(old: PlanAssignment, changes: Partial<PlanAssignment>, actor: string, action: string) {
  const at = new Date().toISOString();
  const row = { ...changes, updatedAt: at, revision: old.revision + 1, events: [...(old.events ?? []), { at, actor, action, changes }] };
  const saved = await supabase.from("student_assignments").update(toAssignmentRow(row)).eq("student_id", old.studentId).eq("id", old.id).eq("revision", old.revision).select("*").maybeSingle();
  checkStorage(saved.error);
  if (!saved.data) throw Object.assign(new Error("This assignment changed in another window. Reload before saving."), { status: 409 });
  return fromAssignmentRow(saved.data);
}
/** Missing new storage must not break pre-existing content access or progress saves. */
export async function assignedContentIds(studentId: string, kind: AssignmentKind, includeCompleted = false): Promise<Set<string>> {
  try {
    const result = await supabase.from("student_assignments").select("content_id").eq("student_id", studentId).eq("kind", kind).in("status", includeCompleted ? [...activeStatuses, "completed"] : activeStatuses);
    return new Set(result.error ? [] : (result.data ?? []).map(row => String(row.content_id)));
  } catch { return new Set(); }
}
export async function hasAssignedContent(studentId: string, kind: AssignmentKind, contentId: string, includeCompleted = false) { return (await assignedContentIds(studentId, kind, includeCompleted)).has(contentId); }
/** Record actual completed attempts in the plan without changing their grading. */
export async function recordPlanCompletion(studentId: string, kind: AssignmentKind, contentId: string, evidence: CompletionEvidence, answered?: number) {
  try {
    const query = await supabase.from("student_assignments").select("*").eq("student_id", studentId).eq("kind", kind).eq("content_id", contentId).in("status", activeStatuses);
    if (query.error) return;
    for (const row of query.data ?? []) {
      const item = fromAssignmentRow(row);
      if (!item.assignedAt || !Number.isFinite(Date.parse(evidence.at)) || Date.parse(evidence.at) < Date.parse(item.assignedAt)) continue;
      if (kind === "practice" && !(evidence.source === "library" && readQuestionBank().sets.some(set => set.id === contentId)) && (item.questionTarget === null || item.practiceBaseline === null || answered === undefined || answered - item.practiceBaseline < item.questionTarget)) continue;
      await updateAssignment(item, { status: "completed", completedAt: evidence.at, completion: evidence }, "system", "Completed from saved platform work");
    }
  } catch (error) { console.warn("Learning plan completion sync deferred:", error instanceof Error ? error.message : "Storage unavailable"); }
}
export async function recordPracticePlanCompletion(studentId: string, topicId: string, progress: unknown) {
  await recordPlanCompletion(studentId, "practice", topicId, { source: "practice", at: new Date().toISOString(), reference: topicId }, practiceAnswered(progress));
}

export async function reconcileCompletions(studentId: string, evidence: { kind: AssignmentKind; contentId: string; completion: CompletionEvidence; answered?: number }[]) {
  if (!evidence.length) return false;
  const query = await supabase.from("student_assignments").select("*").eq("student_id", studentId).in("status", activeStatuses);
  checkStorage(query.error);
  let changed = false;
  for (const row of query.data ?? []) {
    const item = fromAssignmentRow(row);
    const match = evidence.filter(value => value.kind === item.kind && value.contentId === item.contentId && item.assignedAt && Date.parse(value.completion.at) >= Date.parse(item.assignedAt)).sort((a, b) => a.completion.at.localeCompare(b.completion.at))[0];
    if (!match) continue;
    if (item.kind === "practice" && !(match.completion.source === "library" && readQuestionBank().sets.some(set => set.id === item.contentId)) && (item.questionTarget === null || item.practiceBaseline === null || match.answered === undefined || match.answered - item.practiceBaseline < item.questionTarget)) continue;
    try { await updateAssignment(item, { status: "completed", completedAt: match.completion.at, completion: match.completion }, "system", "Reconciled from saved platform work"); changed = true; } catch (error) { if ((error as { status?: number }).status !== 409) throw error; }
  }
  return changed;
}
