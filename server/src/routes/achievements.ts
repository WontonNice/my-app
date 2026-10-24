import { Router } from "express";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { getDatabaseProgress } from "./progress";
import { defaultAchievementDesign, perfectMathProgress, validateAchievementDesign } from "../shared/achievements";

export const achievementsRouter = Router();
const storageMessage = "Achievements storage is unavailable. Apply migration 202610240003_achievements.sql and check the database connection.";

achievementsRouter.get("/", async (request, response) => {
  const { user, error } = await getAuthenticatedUser(request.headers.authorization);
  if (!user) { response.status(401).json({ message: error }); return; }
  const teacher = getUserRole(user) === "teacher";
  if (!teacher && !getEnrolledClassIds(user.app_metadata).includes("shsat")) { response.status(403).json({ message: "Active SHSAT enrollment is required." }); return; }
  const stored = await supabase.from("achievement_designs").select("design,revision").eq("id", "perfect-math").maybeSingle();
  if (stored.error) { response.status(503).json({ message: storageMessage }); return; }
  const data = { design: stored.data?.design ?? defaultAchievementDesign, revision: stored.data?.revision ?? 0 };
  if (teacher) { response.json(data); return; }
  const history = await getDatabaseProgress(user);
  response.json({ ...data, progress: perfectMathProgress([...history.examResults, ...(history.examHistory ?? [])]) });
});

achievementsRouter.put("/perfect-math/design", async (request, response) => {
  const { user, error } = await getAuthenticatedUser(request.headers.authorization);
  if (!user) { response.status(401).json({ message: error }); return; }
  if (getUserRole(user) !== "teacher") { response.status(403).json({ message: "Teacher access is required." }); return; }
  let design;
  try { design = validateAchievementDesign(request.body?.design); }
  catch (reason) { response.status(400).json({ message: (reason as Error).message }); return; }
  const revision = request.body?.revision;
  if (!Number.isSafeInteger(revision) || revision < 0) { response.status(400).json({ message: "Reload the current achievement before saving." }); return; }
  const row = { id: "perfect-math", design, revision: revision + 1, updated_by: user.id, updated_at: new Date().toISOString() };
  const saved = revision === 0
    ? await supabase.from("achievement_designs").insert(row).select("revision").maybeSingle()
    : await supabase.from("achievement_designs").update(row).eq("id", "perfect-math").eq("revision", revision).select("revision").maybeSingle();
  if (saved.error?.code === "23505" || !saved.error && !saved.data) { response.status(409).json({ message: "Another teacher updated this design. Reload it before saving your changes." }); return; }
  if (saved.error) { response.status(503).json({ message: storageMessage }); return; }
  response.json({ design, revision: revision + 1 });
});
