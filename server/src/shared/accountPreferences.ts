export const ACCOUNT_COLORS = [
  { id: "forest", name: "Forest", accent: "#1f4a3a", secondary: "#2e7257", tint: "#e8efea" },
  { id: "navy", name: "Midnight blue", accent: "#283e61", secondary: "#435f87", tint: "#e9edf4" },
  { id: "plum", name: "Plum", accent: "#583c60", secondary: "#795282", tint: "#f0eaf2" },
  { id: "teal", name: "Deep teal", accent: "#235459", secondary: "#30767d", tint: "#e5eff0" },
  { id: "clay", name: "Terracotta", accent: "#783f32", secondary: "#995442", tint: "#f4eae5" },
  { id: "slate", name: "Slate", accent: "#3f4b59", secondary: "#596a7d", tint: "#e9edf1" },
] as const;
export type AccountColor = typeof ACCOUNT_COLORS[number]["id"];
export const accountColor = (id: unknown) => ACCOUNT_COLORS.find(color => color.id === id) ?? ACCOUNT_COLORS[0];
export const accountDay = (now = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
export function previousAccountDay(day: string) {
  return new Date(Date.parse(`${day}T12:00:00Z`) - 86400000).toISOString().slice(0, 10);
}
export type LoginStreak = { current: number; best: number; lastDay: string | null; days: string[]; today: string; timeZone: "America/New_York" };
export function loginStreak(profile: { login_streak?: number; login_best?: number; login_last_day?: string | null; login_days?: string[] } | null, now = new Date()): LoginStreak {
  const today = accountDay(now), lastDay = profile?.login_last_day ?? null;
  const current = lastDay === today || lastDay === previousAccountDay(today) ? profile?.login_streak ?? 0 : 0;
  return { current, best: profile?.login_best ?? 0, lastDay, days: profile?.login_days ?? [], today, timeZone: "America/New_York" };
}
