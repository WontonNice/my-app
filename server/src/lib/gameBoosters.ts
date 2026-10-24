import { GAME_BOOSTERS, type GameRoom, type GameTeam } from "../shared/gameRooms";

// Definitions drive the UI, inventory, earning rules, and playtest controls.
// Effects remain authoritative on the server.
const effects: Record<string, (target: GameTeam, now: number, duration: number) => void> = {
  blackout: (target, now, duration) => { target.blockedUntil = now + duration * 1000; },
};
const fail = (message: string) => { throw Object.assign(new Error(message), { status: 400 }); };
export function boosterInventory(team: GameTeam) {
  return team.inventory ??= { blackout: team.boosters || 0 };
}
export function grantBooster(team: GameTeam, id: string) {
  const definition = GAME_BOOSTERS.find(item => item.id === id);
  if (!definition) return fail("Choose an available booster.");
  const inventory = boosterInventory(team);
  inventory[id] = Math.min(definition.maxStored, (inventory[id] ?? 0) + 1);
  team.boosters = Object.values(inventory).reduce((sum, count) => sum + count, 0);
}
export function earnBoosters(team: GameTeam) {
  for (const definition of GAME_BOOSTERS) if (team.streak > 0 && team.streak % definition.earnedEvery === 0) grantBooster(team, definition.id);
}
export function useBooster(room: GameRoom, team: GameTeam, id: string, targetId: unknown, now: number) {
  const definition = GAME_BOOSTERS.find(item => item.id === id);
  if (!room.party || !definition || !effects[id] || !(boosterInventory(team)[id] > 0) || team.index >= room.questions.length) return fail("You do not have that booster available.");
  const target = room.teams.find(item => item.id === targetId && item.id !== team.id && item.index < room.questions.length);
  if (!target || target.blockedUntil > now) return fail("Choose an active opposing team without an active blackout.");
  effects[id](target, now, definition.durationSeconds);
  team.inventory![id]--;
  team.boosters = Object.values(team.inventory!).reduce((sum, count) => sum + count, 0);
}
