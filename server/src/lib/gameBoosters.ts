import { randomUUID } from "node:crypto";
import { GAME_BOOSTERS, GAME_CORRECT_COINS, LANDMINE_PENALTY, streakBonus, INK_SPLATS, activeTeamPlayers, activeLandmines, hasActiveInk, type GameRoom, type GameTeam, type GameQuestion, type LandmineResolution } from "../shared/gameRooms";
import type { SelectedAnswer } from "../shared/examGrading";

const fail = (message: string, status = 400): never => { throw Object.assign(new Error(message), { status }); };

// Existing rooms keep the value of their unused blackout rewards as shop coins.
export function teamCoins(team: GameTeam) {
  return team.coins ?? Math.max(0, team.inventory?.blackout ?? team.boosters ?? 0) * 300;
}
export function sabotageInventory(team: GameTeam): Record<string, number> {
  return Object.fromEntries(GAME_BOOSTERS.filter(item => (team.inventory?.[item.id] ?? 0) > 0).map(item => [item.id, team.inventory![item.id]]));
}
function normalizeWallet(team: GameTeam) { team.coins = teamCoins(team); team.boosters = 0; team.inventory = sabotageInventory(team); }
export function grantCoins(team: GameTeam, count = 1) { normalizeWallet(team); team.coins! += count; }
export function earnCoins(team: GameTeam) {
  const bonus = streakBonus(team.streak);
  grantCoins(team, GAME_CORRECT_COINS + bonus);
  return { base: GAME_CORRECT_COINS, bonus };
}
export function landmineChoices(item: GameQuestion) {
  return ["multiple_choice", "multi_select", "transition_drop"].includes(item.question.type) ? (item.question.choices ?? []).map(choice => choice.id) : [];
}
export function buySabotage(room: GameRoom, team: GameTeam, id: string) {
  const definition = GAME_BOOSTERS.find(item => item.id === id);
  if (!room.party || !definition || team.index >= room.questions.length) return fail("Choose a sabotage from the shop during an active Party mode race.");
  if (teamCoins(team) < definition.cost) return fail(`This item costs ${definition.cost} coins. Correct answers earn 100, with growing bonuses every 3 correct in a row.`);
  normalizeWallet(team);
  team.coins! -= definition.cost;
  team.inventory![id] = (team.inventory![id] ?? 0) + 1;
}
export function useSabotage(room: GameRoom, team: GameTeam, id: string, targetId: unknown, now: number, placement: Record<string, unknown> = {}) {
  const definition = GAME_BOOSTERS.find(item => item.id === id);
  if (!room.party || !definition || team.index >= room.questions.length || !(sabotageInventory(team)[id] > 0)) return fail("Buy this sabotage in the shop before using it from your inventory.");
  const target = room.teams.find(item => item.id === targetId && item.id !== team.id && item.index < room.questions.length && activeTeamPlayers(room, item.id).length > 0);
  if (!target) return fail("Choose an active opposing team.");
  if (id !== "landmine" && (target.blockedUntil > now || hasActiveInk(target, now))) return fail("That team already has a screen effect active. Choose another team.");
  const source = { teamId: team.id, teamName: team.name, boosterId: id };
  if (id === "landmine") {
    const questionIndex = placement.questionIndex;
    if (typeof questionIndex !== "number" || !Number.isInteger(questionIndex) || questionIndex < target.index || questionIndex >= room.questions.length) return fail("Choose an unsubmitted question for this team.");
    if (target.pendingFeedback?.some(item => item.questionIndex === questionIndex)) return fail("That question is already locked. Choose a question they have not answered.");
    if (typeof placement.choiceId !== "string" || !landmineChoices(room.questions[questionIndex]).includes(placement.choiceId)) return fail("Choose an answer choice on that question.");
    target.landmines = [...activeLandmines(target), { id: randomUUID(), questionIndex, choiceId: placement.choiceId, source }];
    delete target.landmine;
  } else {
    target.inkBomb = { id: randomUUID(), expiresAt: now + definition.durationSeconds * 1000, clearedSplats: [], source };
    target.sabotagedBy = source;
  }
  normalizeWallet(team);
  team.inventory![id]--;
  if (!team.inventory![id]) delete team.inventory![id];
}

export function clearInk(team: GameTeam, body: Record<string, unknown>, now: number) {
  const ink = team.inkBomb;
  if (!ink || body.inkId !== ink.id) return fail("That ink bomb has changed. The room will refresh.", 409);
  const splat = body.splat;
  if (typeof splat !== "number" || !Number.isInteger(splat) || splat < 0 || splat >= INK_SPLATS) return fail(`Choose one of the ${INK_SPLATS} ink splats.`);
  if (!hasActiveInk(team, now)) return;
  ink.clearedSplats = [...new Set([...ink.clearedSplats, splat])];
}

export function resolveLandmine(team: GameTeam, questionIndex: number, correct: boolean, now: number, answer?: SelectedAnswer) {
  const mines = activeLandmines(team), matching = mines.filter(mine => mine.questionIndex === questionIndex);
  if (!matching.length) return 0;
  const resolved: LandmineResolution[] = matching.map(mine => {
    const selected = mine.choiceId !== undefined && (Array.isArray(answer) ? answer.includes(mine.choiceId) : answer === mine.choiceId);
    // Legacy traps without a choice still trigger on an incorrect answer.
    const hit = !correct && (mine.choiceId === undefined || selected);
    const coinsLost = hit ? Math.min(LANDMINE_PENALTY, teamCoins(team)) : 0;
    if (hit) { grantCoins(team, -coinsLost); team.sabotagedBy = mine.source; }
    return { outcome: correct ? selected ? "defused" : "disarmed" : hit ? "triggered" : "avoided", source: mine.source, coinsLost, questionIndex };
  });
  // One checkpoint may resolve several questions. Preserve every outcome in its receipt.
  const previous = team.landmineResult?.at === now ? team.landmineResult.traps ?? [] : [];
  const traps = [...previous, ...resolved];
  const primary = traps.find(trap => trap.outcome === "triggered") ?? traps.find(trap => trap.outcome === "defused") ?? traps[0];
  team.landmineResult = { ...primary, at: now, coinsLost: traps.reduce((total, trap) => total + (trap.coinsLost ?? 0), 0), traps };
  team.landmines = mines.filter(mine => mine.questionIndex !== questionIndex);
  delete team.landmine;
  return resolved.reduce((total, trap) => total + (trap.coinsLost ?? 0), 0);
}
