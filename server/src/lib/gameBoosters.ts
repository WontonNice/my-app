import { randomUUID } from "node:crypto";
import { GAME_BOOSTERS, GAME_COIN_STREAK, INK_SPLATS, gameUnit, hasActiveInk, type GameRoom, type GameTeam } from "../shared/gameRooms";

const fail = (message: string, status = 400): never => { throw Object.assign(new Error(message), { status }); };

// Existing rooms keep the value of their unused blackout rewards as shop coins.
export function teamCoins(team: GameTeam) {
  return team.coins ?? Math.max(0, team.inventory?.blackout ?? team.boosters ?? 0);
}
export function grantCoins(team: GameTeam, count = 1) { team.coins = teamCoins(team) + count; team.boosters = 0; team.inventory = {}; }
export function earnCoins(team: GameTeam) {
  if (team.streak > 0 && team.streak % GAME_COIN_STREAK === 0) grantCoins(team);
}
export function buySabotage(room: GameRoom, team: GameTeam, id: string, targetId: unknown, now: number) {
  const definition = GAME_BOOSTERS.find(item => item.id === id);
  if (!room.party || !definition || team.index >= room.questions.length) return fail("Choose a sabotage from the shop during an active Party mode race.");
  if (teamCoins(team) < definition.cost) return fail("Your team needs more coins. Earn 1 coin for every 3 correct answers in a row.");
  const target = room.teams.find(item => item.id === targetId && item.id !== team.id && item.index < room.questions.length);
  if (!target) return fail("Choose an active opposing team.");
  if (target.blockedUntil > now || hasActiveInk(target, now) || target.landmine) return fail("That team already has a sabotage active or waiting. Choose another team.");
  const source = { teamId: team.id, teamName: team.name, boosterId: id };
  if (id === "landmine") {
    const unit = gameUnit(room.questions, target.index);
    const questionIndex = target.index + Math.min((target.step ?? 0) + 1, unit.length);
    if (questionIndex >= room.questions.length) return fail("That team has no next question to trap. Choose another team or Ink Bomb.");
    target.landmine = { questionIndex, source };
  } else {
    target.inkBomb = { id: randomUUID(), expiresAt: now + definition.durationSeconds * 1000, clearedSplats: [], source };
    target.sabotagedBy = source;
  }
  team.coins = teamCoins(team) - definition.cost; team.boosters = 0; team.inventory = {};
}

export function clearInk(team: GameTeam, body: Record<string, unknown>, now: number) {
  const ink = team.inkBomb;
  if (!ink || body.inkId !== ink.id) return fail("That ink bomb has changed. The room will refresh.", 409);
  const splat = body.splat;
  if (typeof splat !== "number" || !Number.isInteger(splat) || splat < 0 || splat >= INK_SPLATS) return fail("Choose one of the five ink splats.");
  if (!hasActiveInk(team, now)) return;
  ink.clearedSplats = [...new Set([...ink.clearedSplats, splat])];
}

export function resolveLandmine(team: GameTeam, questionIndex: number, correct: boolean, now: number) {
  const mine = team.landmine;
  if (!mine || mine.questionIndex !== questionIndex) return;
  team.landmineResult = { outcome: correct ? "disarmed" : "triggered", at: now, source: mine.source };
  if (!correct) { team.blockedUntil = now + 5000; team.sabotagedBy = mine.source; }
  delete team.landmine;
}
