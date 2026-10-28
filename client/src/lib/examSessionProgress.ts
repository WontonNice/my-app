import type { ExamSessionProgress } from "./api";
import type { ExamContent } from "../content/exams";
import type { ExamResult, SelectedAnswers } from "./examResults";

const storagePrefix = "nathan-tutors:exam-session-progress:v1";
export type ExamSection = "english" | "math";

export function getStoredStartingSubject(assessmentId: string): ExamSection {
  const requested = new URLSearchParams(window.location.search).get("subject");
  if (requested === "english" || requested === "math") return requested;
  try { return window.sessionStorage.getItem(`exam-start-subject:${assessmentId}`) === "math" ? "math" : "english"; }
  catch { return "english"; }
}

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
  questionTimes?: Record<string, number>,
) {
  const savedAt = new Date().toISOString();
  const existing = loadLocalExamSession(userId, assessmentId);
  const progress: ExamSessionProgress = {
    answers: { ...(existing?.answers ?? {}), ...answers },
    completedSections: [...new Set(completedSections)],
    ...((questionTimes && Object.keys(questionTimes).length) || existing?.questionTimes
      ? { questionTimes: { ...(existing?.questionTimes ?? {}), ...(questionTimes ?? {}) } }
      : {}),
    status,
    ...(status === "submitted" ? { submittedAt: savedAt } : {}),
    updatedAt: savedAt,
  };
  try { window.localStorage.setItem(storageKey(userId, assessmentId), JSON.stringify(progress)); }
  catch { /* Cloud autosave remains available when device storage is full or blocked. */ }
  return progress;
}

export function clearLocalExamSession(userId: string, assessmentId: string) {
  try { window.localStorage.removeItem(storageKey(userId, assessmentId)); } catch { /* Device storage is optional. */ }
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

/** Only explicitly submitted questions become graded blanks. Pending sections keep their drafts. */
export function prepareSectionSubmission(content: ExamContent, answers: SelectedAnswers, completed: ExamSection[], section: ExamSection) {
  const nextAnswers = { ...answers };
  for (const id of getExamSectionQuestionIds(content)[section]) if (!Object.hasOwn(nextAnswers, id)) nextAnswers[id] = "";
  return { answers: nextAnswers, completedSections: [...new Set([...completed, section])] };
}

export function getCurrentCompletedSections(
  examContent: ExamContent,
  progress: Pick<ExamSessionProgress, "answers" | "completedSections"> | null | undefined,
): ExamSection[] {
  if (!progress) return [];
  const questionIds = getExamSectionQuestionIds(examContent);

  return (progress.completedSections ?? []).filter((section) => (section === "english" || section === "math") &&
    questionIds[section].every((questionId) => hasSavedAnswer(progress.answers, questionId)),
  );
}

/** Counts alone cannot detect a replaced question or a newly published section. */
export function isExamResultCompleteForContent(result: ExamResult | null | undefined, content: ExamContent) {
  return Boolean(result?.completionStatus === "complete" && isExamSessionCompleteForContent(content, {
    answers: result.answers ?? {}, completedSections: result.completedSections ?? ["english", "math"], status: "submitted", updatedAt: result.completedAt,
  }));
}

export function isExamSessionCompleteForContent(
  examContent: ExamContent,
  progress: ExamSessionProgress | null | undefined,
) {
  if (progress?.status !== "submitted") return false;
  const completedSections = getCurrentCompletedSections(examContent, progress);
  const ids = getExamSectionQuestionIds(examContent);
  const sections = (["english", "math"] as const).filter(section => ids[section].length > 0);
  return sections.length > 0 && sections.every(section => completedSections.includes(section));
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

export function getExamSectionAccess(
  content: ExamContent,
  sectionAccess: Record<ExamSection, boolean>,
): Record<ExamSection, boolean> {
  const questions = getExamSectionQuestionIds(content);
  return {
    english: sectionAccess.english && questions.english.length > 0,
    math: sectionAccess.math && questions.math.length > 0,
  };
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
