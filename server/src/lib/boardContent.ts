import type { User } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { getEnrolledClassIds } from "./auth";
import { supabase } from "./supabase";
import { assignedContentIds, learningCatalog } from "./learningPlanStore";
import { readQuestionBank } from "./questionBank";
import { listTeacherAssessments, findAssessmentForStudent } from "../config/assessments";
import { getExamContent } from "./examContent";
import type { BoardReference } from "../shared/boards";
import { boardQuestion, type BoardContent } from "../shared/boardContent";
import { boardFail } from "./boardStore";
import type { ExamResult } from "../shared/examGrading";
export type { BoardContent } from "../shared/boardContent";

export const referenceKey = (ref: BoardReference) => `${ref.kind}:${ref.sourceId ?? ""}:${ref.id}:${ref.questionId ?? ""}`;
type LibraryAttempt = { book_id: string; completed_at: string; total_questions: number };
type SavedExam = { assessment_id: string; completed_at: string; result: Partial<ExamResult> & { status?: string } };
type CompletedAssignment = { content_id: string; completed_at: string };
const completedDate = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value));
async function completionHistory<T>(table: "student_library_attempts" | "student_exam_results" | "student_assignments", columns: string, studentId: string): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; offset += 1000) {
    let query = supabase.from(table).select(columns).eq(table === "student_assignments" ? "student_id" : "user_id", studentId);
    if (table === "student_assignments") query = query.eq("kind", "passage").eq("status", "completed").not("assigned_at", "is", null);
    const result = await query.order(table === "student_exam_results" ? "assessment_id" : "id").range(offset, offset + 999);
    if (result.error) {
      // Older installations store library attempts in practice progress.
      if (table === "student_library_attempts" && ["PGRST205", "42P01"].includes(result.error.code)) return [];
      throw boardFail("Completed passage history is unavailable. Check the database connection and retry.", 503);
    }
    rows.push(...(result.data ?? []) as unknown as T[]);
    if ((result.data?.length ?? 0) < 1000) return rows;
  }
}
// Resolve from canonical sources using the board student's access, even when a
// teacher opens the board. Answer keys, draft assignments and explanations are
// never returned into a shared notebook.
export async function boardContentCatalog(student: User, completedPassagesOnly = false): Promise<BoardContent[]> {
  const [passages, practices, exams, unlocks, assignments, libraryAttempts, examResults, completedAssignments] = await Promise.all([
    assignedContentIds(student.id, "passage", true), assignedContentIds(student.id, "practice", true),
    assignedContentIds(student.id, "exam", true),
    supabase.from("student_practice_progress").select("topic_slug,progress").eq("user_id", student.id).like("topic_slug", "english-library:%"),
    supabase.from("student_assignments").select("id,title,instructions,assigned_at,status").eq("student_id", student.id).not("assigned_at", "is", null).neq("status", "planned").limit(1000),
    completionHistory<LibraryAttempt>("student_library_attempts", "book_id,completed_at,total_questions", student.id),
    completionHistory<SavedExam>("student_exam_results", "assessment_id,result,completed_at", student.id),
    completionHistory<CompletedAssignment>("student_assignments", "content_id,completed_at", student.id),
  ]);
  if (unlocks.error) throw boardFail("Completed passage history is unavailable. Check the database connection and retry.", 503);
  const unlocked = new Set<string>((unlocks.data ?? []).filter(row => row.progress?.unlockedAt || row.progress?.attempts?.length).map(row => String(row.topic_slug).slice("english-library:".length)));
  const completedBooks = new Set(libraryAttempts.filter(row => row.total_questions > 0 && completedDate(row.completed_at)).map(row => row.book_id));
  for (const row of completedAssignments) if (completedDate(row.completed_at)) completedBooks.add(row.content_id);
  for (const row of unlocks.data ?? []) if (Array.isArray(row.progress?.attempts) && row.progress.attempts.some((attempt: LibraryAttempt) => attempt?.total_questions > 0 && completedDate(attempt?.completed_at))) completedBooks.add(String(row.topic_slug).slice("english-library:".length));
  const completedExams = new Map<string, Set<string>>();
  for (const row of examResults) {
    const result = row.result;
    if (row.assessment_id.startsWith("__") || !result || !completedDate(result.completedAt || row.completed_at) || result.status === "in_progress" || result.completionStatus && !["complete", "english_complete"].includes(result.completionStatus) || result.completedSections && (!Array.isArray(result.completedSections) || !result.completedSections.includes("english"))) continue;
    const ids = new Set((Array.isArray(result.passages) ? result.passages : []).filter(passage => passage?.total > 0).map(passage => passage.id));
    completedExams.set(row.assessment_id, ids);
  }
  const allPassages = learningCatalog().filter(item => item.kind === "passage");
  const assessmentSources = listTeacherAssessments().map(assessment => ({ assessment, source: getExamContent(assessment.id) }));
  const completed = new Set(allPassages.filter(item => [item.id, ...item.aliases].some(id => completedBooks.has(id))).map(item => item.id));
  for (const { assessment, source } of assessmentSources) for (const set of source?.passageSets ?? []) {
    const ids = completedExams.get(assessment.id);
    if (!ids?.has(set.id) && !ids?.has(set.passage.id)) continue;
    const library = allPassages.find(item => [item.id, ...item.aliases].some(id => id === set.id || id === set.passage.id));
    if (library) completed.add(library.id);
  }
  const result: BoardContent[] = (assignments.data ?? []).map(row => ({ reference: { kind: "assignment", id: row.id }, title: row.title, prompt: row.instructions, href: "/study-hall/shsat/assignments" }));
  const bank = readQuestionBank();
  const bankIds = new Set(bank.sets.filter(set => set.subject === "English" && (practices.has(set.id) || unlocked.has(set.id))).flatMap(set => set.questionIds));
  for (const question of bank.questions) if (question.subject === "English" && question.status === "published" && bankIds.has(question.id)) result.push({ reference: { kind: "question", id: question.id }, title: `${question.source} · ${question.topic}`, prompt: question.prompt, choices: question.choices.map(choice => ({ id: choice.id, text: choice.text })), passage: question.passage?.text, skill: question.topic, href: `/study-hall/shsat/library/${bank.sets.find(set => set.questionIds.includes(question.id))?.id ?? ""}` });
  const catalog = allPassages.filter(item => completedPassagesOnly ? completed.has(item.id) : completed.has(item.id) || passages.has(item.id) || unlocked.has(item.id));
  const seen = new Set<string>();
  const canonicalPath = path.resolve(__dirname, "../../data/board-content.json");
  const canonical = fs.existsSync(canonicalPath) ? JSON.parse(fs.readFileSync(canonicalPath, "utf8")) as { id: string; title: string; text: string; viewer?: BoardContent["viewer"] }[] : [];
  for (const item of catalog) {
    const source = canonical.find(source => source.id === item.id);
    if (source) { seen.add(item.id); result.push({ reference: { kind: "passage", id: item.id }, title: source.title, passage: source.text, viewer: source.viewer, href: item.href }); }
  }
  for (const { assessment, source } of assessmentSources) {
    if (!source) continue;
    const access = findAssessmentForStudent(assessment.id, getEnrolledClassIds(student.app_metadata));
    const englishOpen = Boolean(access && (exams.has(assessment.id) || access.status === "open" && access.sectionAccess.english));
    const mathOpen = Boolean(access && (exams.has(assessment.id) || access.status === "open" && access.sectionAccess.math));
    for (const set of source.passageSets) {
      const library = catalog.find(item => item.id === set.id || item.aliases.includes(set.id) || item.aliases.includes(set.passage.id));
      if (library && !seen.has(library.id)) { seen.add(library.id); result.push({ reference: { kind: "passage", id: library.id, sourceId: assessment.id }, title: set.passage.title, passage: set.passage.lines.map(line => line.text).join("\n\n"), viewer: { passage: set.passage, directions: set.directions, questions: set.questions.map(boardQuestion) }, href: library.href }); }
      const completedIds = completedExams.get(assessment.id);
      if (!library && (completedIds?.has(set.id) || completedIds?.has(set.passage.id))) result.push({ reference: { kind: "passage", id: set.id, sourceId: assessment.id }, title: set.passage.title, passage: set.passage.lines.map(line => line.text).join("\n\n"), viewer: { passage: set.passage, directions: set.directions, questions: set.questions.map(boardQuestion) }, href: `/exam/${assessment.id}` });
      if (englishOpen) for (const question of set.questions) result.push({ reference: { kind: "exam-question", id: question.id, sourceId: assessment.id }, title: `${assessment.title} · ${question.topic}`, prompt: question.prompt, choices: question.choices?.map(choice => ({ id: choice.id, text: choice.text, html: choice.html })), skill: question.topic, href: `/exam/${assessment.id}` });
    }
    const questions = [...(englishOpen ? source.standaloneSection?.questions ?? [] : []), ...(mathOpen ? source.mathSection?.questions ?? [] : [])];
    for (const question of questions) result.push({ reference: { kind: "exam-question", id: question.id, sourceId: assessment.id }, title: `${assessment.title} · ${question.topic}`, prompt: question.prompt, choices: question.choices?.map(choice => ({ id: choice.id, text: choice.text, html: choice.html })), skill: question.topic, href: `/exam/${assessment.id}` });
  }
  return result;
}
