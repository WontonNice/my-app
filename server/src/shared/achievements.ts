import { submittedExamSections } from "./examCompletion";

export type AchievementDesign = {
  title: string;
  description: string;
  accent: string;
  icon: "trophy" | "star" | "medal" | "sparkles";
  frame: "classic" | "spotlight" | "minimal";
  image: string;
};
export type AchievementProgress = {
  id: "perfect-math";
  percentage: number;
  correct: number;
  total: number;
  earnedAt: string | null;
  examTitle: string | null;
  attempts: number;
};
export type AchievementResponse = { design: AchievementDesign; revision: number; progress?: AchievementProgress };
export const defaultAchievementDesign: AchievementDesign = {
  title: "Perfect on a math test",
  description: "Score 100% on a submitted math test or the complete Math section of an assessment.",
  accent: "#247565", icon: "trophy", frame: "classic", image: "",
};

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
