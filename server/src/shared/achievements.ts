import { submittedExamSections } from "./examCompletion";
import { loginStreak } from "./accountPreferences";

export type AchievementDesign = {
  title: string;
  description: string;
  accent: string;
  icon: "trophy" | "star" | "medal" | "sparkles";
  frame: "classic" | "spotlight" | "minimal";
  image: string;
};
export type AchievementId = "perfect-math" | "perfect-english" | "login-week";
export type AchievementProgress = {
  id: AchievementId;
  percentage: number;
  correct: number;
  total: number;
  earnedAt: string | null;
  examTitle: string | null;
  attempts: number;
  currentStreak?: number;
  bestStreak?: number;
};
export type AchievementResponse = { design: AchievementDesign; revision: number; progress?: AchievementProgress };
export type AchievementEntry = AchievementResponse & { id: AchievementId };
export type AchievementCollectionResponse = AchievementResponse & { achievements: AchievementEntry[] };
export const defaultAchievementDesign: AchievementDesign = {
  title: "Perfect on a math test",
  description: "Score 100% on a submitted math test or the complete Math section of an assessment.",
  accent: "#247565", icon: "trophy", frame: "classic", image: "",
};
export const defaultEnglishAchievementDesign: AchievementDesign = {
  title: "Perfect on an English test",
  description: "Score 100% on the complete English section of an official SHSAT practice test. Prestige tests do not count.",
  accent: "#655082", icon: "medal", frame: "classic", image: "",
};
export const defaultLoginAchievementDesign: AchievementDesign = {
  title: "Seven days in a row",
  description: "Log in on seven consecutive days. Each day counts once, using New York time. Once earned, this badge stays unlocked.",
  accent: "#995442", icon: "star", frame: "classic", image: "",
};
export type LoginAchievementProfile = {
  login_streak?: number;
  login_best?: number;
  login_last_day?: string | null;
  login_week_earned_at?: string | null;
};
export function weeklyLoginProgress(profile: LoginAchievementProfile | null, now = new Date()): AchievementProgress {
  const streak = loginStreak(profile, now);
  const best = Number.isSafeInteger(streak.best) && streak.best > 0 ? streak.best : 0;
  const correct = Math.min(best, 7);
  const earnedAt = best >= 7 && typeof profile?.login_week_earned_at === "string" && Number.isFinite(Date.parse(profile.login_week_earned_at)) ? profile.login_week_earned_at : null;
  return { id: "login-week", percentage: correct / 7 * 100, correct, total: 7, earnedAt, examTitle: null, attempts: 0, currentStreak: streak.current, bestStreak: best };
}

// Explicit official handbook forms. Digital SHSAT Practice Tests are Prestige;
// titles and passage categories cannot reliably identify an entire official test.
export const officialPracticeTestIds: ReadonlySet<string> = new Set([
  "2017-2018-form-a", "2017-2018-form-b", "2018-2019-form-a", "2018-2019-form-b",
  "2019-2020-form-a", "2019-2020-form-b", "2020-2021-form-a", "2020-2021-form-b",
  "2021-2022-form-a", "2021-2022-form-b", "2022-2023-form-a", "2022-2023-form-b",
  "2023-2024-form-a", "2023-2024-form-b", "2024-2025-form-a", "2024-2025-form-b",
  "2025-2026-form-a", "2025-2026-form-b", "2026-2027-form-a", "2026-2027-form-b",
  "2026-2027-form-c", "2026-2027-form-d",
]);

/** The caller supplies question totals from the server's official exam catalog. */
export function perfectEnglishProgress(results: Record<string, unknown>[], questionTotals: ReadonlyMap<string, number>): AchievementProgress {
  const progress: AchievementProgress = { id: "perfect-english", percentage: 0, correct: 0, total: 0, earnedAt: null, examTitle: null, attempts: 0 };
  const seen = new Set<string>();
  for (const result of results) {
    if (typeof result.assessmentId !== "string" || !officialPracticeTestIds.has(result.assessmentId) || result.source === "answer_sheet" || !submittedExamSections(result).includes("english")) continue;
    const english = Array.isArray(result.subjects) ? result.subjects.find(value => value && typeof value === "object" && value.subject === "English Language Arts") : null;
    if (!english || !Number.isInteger(english.total) || english.total <= 0 || !Number.isInteger(english.correct) || english.correct < 0 || english.correct > english.total) continue;
    if (english.total !== questionTotals.get(result.assessmentId)) continue;
    const snapshot = result.analysisContent as { passageSets?: { questions?: unknown[] }[]; standaloneSection?: { questions?: unknown[] } } | undefined;
    if (snapshot) {
      const total = (snapshot.passageSets ?? []).reduce((sum, set) => sum + (set.questions?.length ?? 0), 0) + (snapshot.standaloneSection?.questions?.length ?? 0);
      if (english.total !== total) continue;
    }
    const key = `${result.assessmentId}:${result.attemptId ?? result.completedAt}`;
    if (seen.has(key)) continue;
    seen.add(key);
    progress.attempts++;
    const percentage = english.correct / english.total * 100;
    const sectionDates = result.sectionCompletedAt && typeof result.sectionCompletedAt === "object" ? result.sectionCompletedAt as Record<string, unknown> : {};
    const completedAt = typeof sectionDates.english === "string" && Number.isFinite(Date.parse(sectionDates.english)) ? sectionDates.english : result.completedAt;
    const earnsFirst = english.correct === english.total && typeof completedAt === "string" && Number.isFinite(Date.parse(completedAt)) && (!progress.earnedAt || Date.parse(completedAt) < Date.parse(progress.earnedAt));
    if (!progress.total || percentage > progress.percentage || earnsFirst) {
      progress.percentage = percentage;
      progress.correct = english.correct;
      progress.total = english.total;
      progress.examTitle = typeof result.title === "string" ? result.title : "Official English practice test";
    }
    if (earnsFirst) progress.earnedAt = completedAt as string;
  }
  return progress;
}

/** Only submitted Math counts. A partial English result or unanswered Math never moves this bar. */
export function perfectMathProgress(results: Record<string, unknown>[]): AchievementProgress {
  const progress: AchievementProgress = { id: "perfect-math", percentage: 0, correct: 0, total: 0, earnedAt: null, examTitle: null, attempts: 0 };
  const seen = new Set<string>();
  for (const result of results) {
    if (result.source === "answer_sheet" || !submittedExamSections(result).includes("math")) continue;
    const key = `${result.assessmentId}:${result.attemptId ?? result.completedAt}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const math = Array.isArray(result.subjects) ? result.subjects.find(value => value && typeof value === "object" && value.subject === "Mathematics") : null;
    if (!math || !Number.isInteger(math.total) || math.total <= 0 || !Number.isInteger(math.correct) || math.correct < 0 || math.correct > math.total) continue;
    const snapshot = result.analysisContent as { mathSection?: { questions?: unknown[] } } | undefined;
    if (snapshot?.mathSection?.questions && math.total !== snapshot.mathSection.questions.length) continue;
    progress.attempts++;
    const percentage = math.correct / math.total * 100;
    const sectionDates = result.sectionCompletedAt && typeof result.sectionCompletedAt === "object" ? result.sectionCompletedAt as Record<string, unknown> : {};
    const mathCompletedAt = typeof sectionDates.math === "string" && Number.isFinite(Date.parse(sectionDates.math)) ? sectionDates.math : result.completedAt;
    const earnsFirst = math.correct === math.total && typeof mathCompletedAt === "string" && Number.isFinite(Date.parse(mathCompletedAt)) && (!progress.earnedAt || Date.parse(mathCompletedAt) < Date.parse(progress.earnedAt));
    if (!progress.total || percentage > progress.percentage || earnsFirst) {
      progress.percentage = percentage;
      progress.correct = math.correct;
      progress.total = math.total;
      progress.examTitle = typeof result.title === "string" ? result.title : "Math assessment";
    }
    if (earnsFirst) progress.earnedAt = mathCompletedAt as string;
  }
  return progress;
}

export function validateAchievementDesign(value: unknown): AchievementDesign {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Choose an achievement design.");
  const input = value as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  if (!title || title.length > 80 || !description || description.length > 240) throw new Error("Use a title of 1–80 characters and a description of 1–240 characters.");
  if (typeof input.accent !== "string" || !/^#[0-9a-f]{6}$/i.test(input.accent)) throw new Error("Choose a valid accent color.");
  if (!["trophy", "star", "medal", "sparkles"].includes(String(input.icon)) || !["classic", "spotlight", "minimal"].includes(String(input.frame))) throw new Error("Choose an available icon and card style.");
  if (typeof input.image !== "string" || input.image.length > 460000 || input.image && !/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/]+={0,2}$/i.test(input.image)) throw new Error("Use a PNG, JPEG, or WebP picture smaller than 340 KB.");
  return { title, description, accent: input.accent, icon: input.icon as AchievementDesign["icon"], frame: input.frame as AchievementDesign["frame"], image: input.image };
}
