export type ClassroomTimerState = { durationMs: number; remainingMs: number; endsAt: number | null };
export const defaultClassroomTimer: ClassroomTimerState = { durationMs: 180 * 60000, remainingMs: 180 * 60000, endsAt: null };
export function readClassroomTimer(value: string | null): ClassroomTimerState {
  try {
    const item = JSON.parse(value ?? "null");
    if (item && Number.isFinite(item.durationMs) && item.durationMs >= 60000 && item.durationMs <= 12 * 3600000 && Number.isFinite(item.remainingMs) && item.remainingMs >= 0 && item.remainingMs <= item.durationMs && (item.endsAt === null || Number.isFinite(item.endsAt) && item.endsAt > 0)) return item;
  } catch { /* A corrupt browser preference should not prevent opening the dashboard. */ }
  return { ...defaultClassroomTimer };
}
export function classroomRemaining(state: ClassroomTimerState, now: number) { return Math.max(0, state.endsAt === null ? state.remainingMs : Math.min(state.durationMs, state.endsAt - now)); }
export function formatClassroomTime(ms: number) {
  const seconds = Math.ceil(Math.max(0, ms) / 1000);
  return `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
