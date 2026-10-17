import { createAuthHeaders, requestApi } from "../../lib/api";
import type { AnswerSheet, SheetAttempt, SheetGrade, SheetMapping, SheetStructure } from "../../../../server/src/shared/answerSheets";
import type { SelectedAnswer, ExamResult } from "../../../../server/src/shared/examGrading";
import type { PlanAssignment } from "../../../../server/src/shared/learningPlan";
export type { AnswerSheet, SheetGrade, SheetStructure, SheetMapping };
export type Attempt = Omit<SheetAttempt, "lease" | "mutations">;
export type Task = PlanAssignment & { attempt: Attempt | null };
export type Change = { itemId: string; answer?: SelectedAnswer; flagged?: boolean };
export type Save = { sessionId: string; revision: number; mutationId: string; changes: Change[]; sectionId: string };
export type Submission = { sessionId: string; revision: number; submissionId: string; confirmUnanswered: boolean };
export type ReleasedResult = ExamResult & { answerSheet: { grade: SheetGrade } };
export function answerSheetApi(token: string) {
  const call = <T>(path: string, method = "GET", body?: unknown) => requestApi<T>(`/api/answer-sheets${path}`, { method, headers: createAuthHeaders(token), ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return {
    teacher: () => call<{ sheets: AnswerSheet[]; students: { id: string; name: string }[]; assessments: { id: string; title: string }[] }>("/teacher"),
    create: (sheet: SheetStructure) => call<{ sheet: AnswerSheet }>("/teacher", "POST", sheet),
    update: (sheet: AnswerSheet) => call<{ sheet: AnswerSheet }>(`/teacher/${sheet.id}`, "PUT", sheet),
    detail: (id: string) => call<{ sheet: AnswerSheet; assignments: Task[] }>(`/teacher/${id}`),
    assign: (id: string, studentIds: string[], batchId: string, dueDate: string, allowRepeat: boolean) => call<{ sheet: AnswerSheet }>(`/teacher/${id}/assign`, "POST", { studentIds, batchId, dueDate, allowRepeat }),
    key: (sheet: AnswerSheet) => call<{ sheet: AnswerSheet }>(`/teacher/${sheet.id}/key`, "PUT", { revision: sheet.revision, keys: sheet.keys }),
    student: () => call<{ assignments: Task[] }>("/student"),
    summary: (id: string) => call<{ assignments: Task[] }>(`/teacher/student/${id}/summary`),
    open: (id: string, sessionId: string, takeover = false) => call<{ attempt: Attempt; result: ReleasedResult | null }>(`/student/${id}/open`, "POST", { sessionId, takeover }),
    save: (id: string, input: Save) => call<{ attempt: Attempt }>(`/student/${id}/responses`, "PATCH", input),
    submit: (id: string, input: Submission) => call<{ attempt: Attempt; result: ReleasedResult | null }>(`/student/${id}/submit`, "POST", input),
    review: (id: string) => call<{ sheet: AnswerSheet; assignment: PlanAssignment; attempt: Attempt | null; grade: { current: SheetGrade; history: SheetGrade[] } | null; result: ReleasedResult | null }>(`/teacher/attempt/${id}/review`),
    grade: (id: string, manual: Record<string, number>) => call(`/teacher/attempt/${id}/grade`, "POST", { manual }),
    release: (id: string) => call(`/teacher/attempt/${id}/release`, "POST", {}),
    reopen: (id: string) => call(`/teacher/attempt/${id}/reopen`, "POST", {}),
    export: (id: string) => call<unknown>(`/teacher/${id}/export`),
    targets: (id: string) => call<{ questions: { id: string; type: string; subject: string; prompt: string; options: { id: string; label: string }[] }[] }>(`/teacher/targets/${id}`),
    mapping: (sheet: AnswerSheet, assessmentId: string, items: SheetMapping[], apply = false) => call<{ problems: string[]; warnings: string[]; sheet?: AnswerSheet }>(`/teacher/${sheet.id}/mapping/${apply ? "apply" : "preview"}`, "POST", { assessmentId, sourceVersion: sheet.sourceVersion, items, revision: sheet.revision, acknowledgeChanges: apply }),
  };
}
