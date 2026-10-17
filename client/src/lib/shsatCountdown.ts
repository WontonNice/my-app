// November 18 at the start of the day in New York (EST after the DST change).
export const SHSAT_TEST_DAY = "2026-11-18T00:00:00-05:00";
export const SHSAT_TEST_DAY_MS = Date.parse(SHSAT_TEST_DAY);

export function getShsatCountdown(now = Date.now()) {
  const remaining = Math.max(0, SHSAT_TEST_DAY_MS - now);
  const hours = Math.floor(remaining / 3_600_000);
  return { days: Math.floor(hours / 24), hours: hours % 24, finished: remaining === 0, underHour: remaining > 0 && hours === 0 };
}
