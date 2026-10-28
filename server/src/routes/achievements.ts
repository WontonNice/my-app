import { Router } from "express";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { getDatabaseProgress } from "./progress";
import { defaultAchievementDesign, defaultEnglishAchievementDesign, defaultLoginAchievementDesign, officialPracticeTestIds, perfectEnglishProgress, perfectMathProgress, weeklyLoginProgress, validateAchievementDesign, type AchievementEntry } from "../shared/achievements";
import { getExamContent } from "../lib/examContent";

export const achievementsRouter = Router();
const storageMessage = "Achievements storage is unavailable. Apply the achievement migrations through 202610280002_login_week_achievement.sql and check the database connection.";

achievementsRouter.get("/", async (request, response) => {
  const { user, error } = await getAuthenticatedUser(request.headers.authorization);
  if (!user) { response.status(401).json({ message: error }); return; }
  const teacher = getUserRole(user) === "teacher";
  if (!teacher && !getEnrolledClassIds(user.app_metadata).includes("shsat")) { response.status(403).json({ message: "Active SHSAT enrollment is required." }); return; }
  const definitions = [{ id: "perfect-math", design: defaultAchievementDesign }, { id: "perfect-english", design: defaultEnglishAchievementDesign }, { id: "login-week", design: defaultLoginAchievementDesign }] as const;
  const stored = await Promise.all(definitions.map(item => supabase.from("achievement_designs").select("design,revision").eq("id", item.id).maybeSingle()));
  if (stored.some(item => item.error)) { response.status(503).json({ message: storageMessage }); return; }
  const achievements: AchievementEntry[] = definitions.map((item, index) => ({ id: item.id, design: stored[index].data?.design ?? item.design, revision: stored[index].data?.revision ?? 0 }));
  const data = { design: achievements[0].design, revision: achievements[0].revision, achievements };
  if (teacher) { response.json(data); return; }
  // Sync today's check-in before reading progress. This shares the atomic daily
  // update with the account shell, so simultaneous tabs still count only once.
  const login = await supabase.rpc("record_account_login", { p_user_id: user.id });
  if (login.error || !login.data) { response.status(503).json({ message: "Your login streak could not be loaded. Apply migration 202610280002_login_week_achievement.sql and try again." }); return; }
  const history = await getDatabaseProgress(user);
  const results = [...history.examResults, ...(history.examHistory ?? [])];
  const totals = new Map<string, number>();
  for (const id of new Set(results.map(result => result.assessmentId))) {
    if (typeof id !== "string" || !officialPracticeTestIds.has(id)) continue;
    const content = getExamContent(id);
    if (content) totals.set(id, content.passageSets.reduce((sum, set) => sum + set.questions.length, 0) + (content.standaloneSection?.questions.length ?? 0));
  }
  achievements[0].progress = perfectMathProgress(results);
  achievements[1].progress = perfectEnglishProgress(results, totals);
  achievements[2].progress = weeklyLoginProgress(login.data);
  response.json({ ...data, progress: achievements[0].progress });
});

achievementsRouter.put("/:achievementId/design", async (request, response) => {
  const { user, error } = await getAuthenticatedUser(request.headers.authorization);
  if (!user) { response.status(401).json({ message: error }); return; }
  if (getUserRole(user) !== "teacher") { response.status(403).json({ message: "Teacher access is required." }); return; }
  const id = request.params.achievementId;
  if (id !== "perfect-math" && id !== "perfect-english" && id !== "login-week") { response.status(404).json({ message: "Achievement not found." }); return; }
  let design;
  try { design = validateAchievementDesign(request.body?.design); }
  catch (reason) { response.status(400).json({ message: (reason as Error).message }); return; }
  const revision = request.body?.revision;
  if (!Number.isSafeInteger(revision) || revision < 0) { response.status(400).json({ message: "Reload the current achievement before saving." }); return; }
  const row = { id, design, revision: revision + 1, updated_by: user.id, updated_at: new Date().toISOString() };
  const saved = revision === 0
    ? await supabase.from("achievement_designs").insert(row).select("revision").maybeSingle()
    : await supabase.from("achievement_designs").update(row).eq("id", id).eq("revision", revision).select("revision").maybeSingle();
  if (saved.error?.code === "23505" || !saved.error && !saved.data) { response.status(409).json({ message: "Another teacher updated this design. Reload it before saving your changes." }); return; }
  if (saved.error) { response.status(503).json({ message: storageMessage }); return; }
  response.json({ design, revision: revision + 1 });
});
