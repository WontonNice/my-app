import type { ExamSessionProgress } from "./api";
import type { SelectedAnswers } from "./examResults";

const storagePrefix = "nathan-tutors:exam-session-progress:v1";

function storageKey(userId: string, assessmentId: string) {
  return `${storagePrefix}:${userId}:${assessmentId}`;
}

export function loadLocalExamSession(userId: string, assessmentId: string): ExamSessionProgress | null {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey(userId, assessmentId)) ?? "null") as ExamSessionProgress | null;
    return value && Array.isArray(value.completedSections) && value.answers && typeof value.answers === "object" ? value : null;
  } catch {
    return null;
  }
}

export function saveLocalExamSession(
  userId: string,
  assessmentId: string,
  answers: SelectedAnswers,
  completedSections: ("english" | "math")[],
) {
  const progress: ExamSessionProgress = { answers, completedSections, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(storageKey(userId, assessmentId), JSON.stringify(progress));
  return progress;
}

export function clearLocalExamSession(userId: string, assessmentId: string) {
  window.localStorage.removeItem(storageKey(userId, assessmentId));
}
