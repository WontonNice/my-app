import type { GameTeam } from "../shared/gameRooms";
import { emptyGameTools, type GameToolState } from "../shared/gameTools";

const invalid = (): never => { throw Object.assign(new Error("Tool changes are too large or invalid. Clear some of your marks and try again."), { status: 400 }); };
function entries(value: unknown, maximum: number): [string, unknown][] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();
  const result = Object.entries(value);
  if (result.length > maximum || result.some(([key]) => !key || key.length > 240 || ["__proto__", "constructor", "prototype"].includes(key))) return invalid();
  return result;
}
function list(value: unknown, maximum: number): unknown[] { if (!Array.isArray(value) || value.length > maximum) return invalid(); return value; }
export function parseGameTools(value: unknown): GameToolState {
  if (JSON.stringify(value)?.length > 250000) return invalid();
  const fields = Object.fromEntries(entries(value, 4));
  if (Object.keys(fields).some(key => !Object.keys(emptyGameTools()).includes(key))) return invalid();
  const result = emptyGameTools();
  for (const [key, raw] of entries(fields.drawings, 60)) result.drawings[key] = list(raw, 100).map(stroke => {
    const points = list((stroke as { points?: unknown })?.points, 2000).map(point => {
      const { x, y } = (point ?? {}) as { x?: number; y?: number };
      if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0 || x > 1 || y > 1) return invalid();
      return { x, y };
    }); return { points };
  });
  for (const [key, raw] of entries(fields.highlights, 100)) result.highlights[key] = list(raw, 100).map(range => {
    const { start, end, color } = (range ?? {}) as { start: number; end: number; color: "blue" | "pink" };
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end > 100000 || !["blue", "pink"].includes(color)) return invalid();
    return { start, end, color };
  });
  for (const [key, raw] of entries(fields.eliminated, 60)) result.eliminated[key] = list(raw, 100).map(choice => { if (typeof choice !== "string" || !choice || choice.length > 200) return invalid(); return choice; });
  for (const [key, raw] of entries(fields.notes, 60)) { if (typeof raw !== "string" || raw.length > 4000) return invalid(); result.notes[key] = raw; }
  return result;
}
export function updateTeamTools(team: GameTeam, playerId: string, body: Record<string, unknown>) {
  if (body.index !== team.index) throw Object.assign(new Error("Your team moved on. These tool changes belong to the previous question or passage."), { status: 409 });
  // Every member owns a layer. Concurrent teammates cannot overwrite each other's work.
  const state = parseGameTools(body.state);
  team.tools ??= {}; team.tools[playerId] = state;
}
