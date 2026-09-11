import type { ExamResult } from "../../../server/src/shared/examGrading";
export * from "../../../server/src/shared/examGrading";
const storagePrefix = "nathan-tutors:exam-results:v1";
function getStorageKey(userId: string) {
  return `${storagePrefix}:${userId}`;
}

export function getExamResults(userId: string): ExamResult[] {
  try {
    const storedResults = JSON.parse(window.localStorage.getItem(getStorageKey(userId)) ?? "[]") as unknown;

    if (!Array.isArray(storedResults)) {
      return [];
    }

    return (storedResults as ExamResult[]).map((result) => {
      const completedSections: ExamResult["completedSections"] = Array.isArray(result.completedSections)
        ? result.completedSections
        : ["english", "math"];
      const completionStatus =
        result.completionStatus === "english_complete" || result.completionStatus === "math_complete"
          ? result.completionStatus
          : completedSections.includes("math") && !completedSections.includes("english")
            ? "math_complete"
            : "complete";

      return {
        ...result,
        answers: result.answers && typeof result.answers === "object" ? result.answers : {},
        completedSections,
        completionStatus,
        passages: Array.isArray(result.passages) ? result.passages : [],
        questionTypes: Array.isArray(result.questionTypes) ? result.questionTypes : [],
        subjects: Array.isArray(result.subjects) ? result.subjects : [],
      };
    });
  } catch {
    return [];
  }
}

export function getExamResult(userId: string, assessmentId: string) {
  return getExamResults(userId).find((result) => result.assessmentId === assessmentId) ?? null;
}

export function saveExamResult(userId: string, result: ExamResult) {
  const otherResults = getExamResults(userId).filter(
    (storedResult) => storedResult.assessmentId !== result.assessmentId,
  );

  window.localStorage.setItem(getStorageKey(userId), JSON.stringify([result, ...otherResults]));
}

export function replaceExamResults(userId: string, results: ExamResult[]) {
  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(results));
}
