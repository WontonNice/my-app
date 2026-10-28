import type { ExamSessionProgress } from "./api";
import type { ExamContent } from "../content/exams";
import type { ExamResult, SelectedAnswers } from "./examResults";
import { normalizeExamNavigation, type ExamNavigation, type ExamPosition } from "../../../server/src/shared/examNavigation";

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
      ? { ...value, navigation: normalizeExamNavigation(value.navigation), status: value.status === "submitted" ? "submitted" : "in_progress" }
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
  navigation?: ExamNavigation,
) {
  const savedAt = new Date().toISOString();
  const existing = loadLocalExamSession(userId, assessmentId);
  const progress: ExamSessionProgress = {
    ...((navigation ?? existing?.navigation) ? { navigation: navigation ?? existing?.navigation } : {}),
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

/** IDs survive reordering; removed questions fall back to an unfinished question. */
export function getExamResumePosition(content: ExamContent, subject: ExamSection, progress: ExamSessionProgress | null | undefined) {
  const saved = normalizeExamNavigation(progress?.navigation)?.[subject];
  const position = (screen: ExamPosition['screen'], passageIndex = 0, questionIndex = 0) => ({ screen, passageIndex, questionIndex });
  const math = content.mathSection?.questions ?? [];
  const standalone = content.standaloneSection?.questions ?? [];
  if (saved) {
    if (saved.screen === 'mathQuestion') {
      const index = math.findIndex(q => q.id === saved.questionId);
      if (index >= 0) return position(saved.screen, 0, index);
    } else if (saved.screen === 'standaloneQuestion') {
      const index = standalone.findIndex(q => q.id === saved.questionId);
      if (index >= 0) return position(saved.screen, 0, index);
    } else if (saved.passageSetId) {
      const passageIndex = content.passageSets.findIndex(set => set.id === saved.passageSetId);
      const questionIndex = content.passageSets[passageIndex]?.questions.findIndex(q => q.id === saved.questionId) ?? -1;
      if (passageIndex >= 0 && (saved.screen !== 'passage' || questionIndex >= 0)) return position(saved.screen, passageIndex, Math.max(0, questionIndex));
    } else if (!saved.screen.startsWith('standalone') || standalone.length) return position(saved.screen);
  }
  const answers = progress?.answers ?? {};
  const hasAnswer = (id: string) => {
    const answer = answers[id];
    return answer !== undefined && answer !== null && answer !== '' &&
      (typeof answer !== 'object' || Object.keys(answer).length > 0);
  };
  // A brand-new attempt still gets its directions. Legacy drafts skip to the first blank.
  const ids = getExamSectionQuestionIds(content)[subject];
  if (!ids.some(hasAnswer)) return position(subject === 'math' ? 'mathIntro' : 'directions');
  if (subject === 'math') {
    const index = math.findIndex(q => !hasAnswer(q.id));
    return position('mathQuestion', 0, index >= 0 ? index : Math.max(0, math.length - 1));
  }
  for (const [index, set] of content.passageSets.entries()) {
    const questionIndex = set.questions.findIndex(q => !hasAnswer(q.id));
    if (questionIndex >= 0) return position('passage', index, questionIndex);
  }
  const standaloneIndex = standalone.findIndex(q => !hasAnswer(q.id));
  if (standaloneIndex >= 0) return position('standaloneQuestion', 0, standaloneIndex);
  return position('endSection');
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
