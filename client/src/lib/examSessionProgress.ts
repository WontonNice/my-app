import type { ExamSessionProgress } from "./api";
import type { ExamContent } from "../content/exams";
import type { ExamResult, SelectedAnswers } from "./examResults";

const storagePrefix = "nathan-tutors:exam-session-progress:v1";
export type ExamSection = "english" | "math";

function storageKey(userId: string, assessmentId: string) {
  return `${storagePrefix}:${userId}:${assessmentId}`;
}

export function loadLocalExamSession(userId: string, assessmentId: string): ExamSessionProgress | null {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey(userId, assessmentId)) ?? "null") as ExamSessionProgress | null;
    return value && Array.isArray(value.completedSections) && value.answers && typeof value.answers === "object"
      ? { ...value, status: value.status === "submitted" ? "submitted" : "in_progress" }
      : null;
  } catch {
    return null;
  }
}

export function saveLocalExamSession(
  userId: string,
  assessmentId: string,
  answers: SelectedAnswers,
  completedSections: ExamSection[],
  status: ExamSessionProgress["status"] = "in_progress",
) {
  const savedAt = new Date().toISOString();
  const existing = loadLocalExamSession(userId, assessmentId);
  const progress: ExamSessionProgress = {
    answers: { ...(existing?.answers ?? {}), ...answers },
    completedSections: [...new Set(completedSections)],
    status,
    ...(status === "submitted" ? { submittedAt: savedAt } : {}),
    updatedAt: savedAt,
  };
  window.localStorage.setItem(storageKey(userId, assessmentId), JSON.stringify(progress));
  return progress;
}

export function clearLocalExamSession(userId: string, assessmentId: string) {
  window.localStorage.removeItem(storageKey(userId, assessmentId));
}

function hasSavedAnswer(answers: Record<string, unknown>, questionId: string) {
  return Object.prototype.hasOwnProperty.call(answers, questionId);
}

export function getExamSectionQuestionIds(examContent: ExamContent) {
  return {
    english: [
      ...examContent.passageSets.flatMap((passageSet) => passageSet.questions.map((question) => question.id)),
      ...(examContent.standaloneSection?.questions.map((question) => question.id) ?? []),
    ],
    math: examContent.mathSection?.questions.map((question) => question.id) ?? [],
  };
}

export function getCurrentCompletedSections(
  examContent: ExamContent,
  progress: Pick<ExamSessionProgress, "answers" | "completedSections"> | null | undefined,
): ExamSection[] {
  if (!progress) return [];
  const questionIds = getExamSectionQuestionIds(examContent);

  return progress.completedSections.filter((section) =>
    questionIds[section].every((questionId) => hasSavedAnswer(progress.answers, questionId)),
  );
}

export function isExamSessionCompleteForContent(
  examContent: ExamContent,
  progress: ExamSessionProgress | null | undefined,
) {
  if (progress?.status !== "submitted") return false;
  const completedSections = getCurrentCompletedSections(examContent, progress);
  return completedSections.includes("english") && completedSections.includes("math");
}

export function getNextExamSubject(defaultSubject: ExamSection, completedSections: ExamSection[]): ExamSection {
  if (completedSections.includes("english") && !completedSections.includes("math")) return "math";
  if (completedSections.includes("math") && !completedSections.includes("english")) return "english";
  return defaultSubject;
}

export function getOpenExamSubject(
  preferredSubject: ExamSection,
  sectionAccess: Record<ExamSection, boolean>,
): ExamSection | null {
  if (sectionAccess[preferredSubject]) return preferredSubject;
  const alternateSubject = preferredSubject === "english" ? "math" : "english";
  return sectionAccess[alternateSubject] ? alternateSubject : null;
}

export function isExamResultCompleteForQuestionCount(
  result: Pick<ExamResult, "completionStatus" | "total"> | null | undefined,
  currentQuestionCount: number,
) {
  return Boolean(
    result &&
      result.completionStatus === "complete" &&
      result.total >= currentQuestionCount,
  );
}
