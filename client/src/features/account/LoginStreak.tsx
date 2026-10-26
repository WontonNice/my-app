import { Flame, Check } from "lucide-react";
import { useAccountProfile } from "./account";
import { previousAccountDay } from "../../../../server/src/shared/accountPreferences";

export function LoginStreak({ compact = false }: { compact?: boolean }) {
  const { profile } = useAccountProfile();
  const streak = profile?.streak;
  if (!streak) return null;
  if (compact) return <a className="account-streak-badge" href="/profile" title={`Daily login streak · Best: ${streak.best} days`} aria-label={`${streak.current} day login streak. View in profile settings.`}><Flame size={17} aria-hidden="true" /><strong>{streak.current}</strong><span>day{streak.current === 1 ? "" : "s"}</span></a>;
  const dates = [streak.today];
  while (dates.length < 7) dates.unshift(previousAccountDay(dates[0]));
  return <section className="account-streak-card" aria-label="Daily login streak">
    <div className="account-streak-heading"><span className="account-streak-flame"><Flame size={28} aria-hidden="true" /></span><div><p>DAILY LOGIN STREAK</p><h2>{streak.current} <span>day{streak.current === 1 ? "" : "s"} in a row</span></h2></div><strong className="account-streak-best">Best <span>{streak.best} days</span></strong></div>
    <ol className="account-streak-week">{dates.map(day => {
      const checked = streak.days.includes(day), date = new Date(`${day}T12:00:00Z`);
      const label = date.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short" });
      return <li key={day} className={`${checked ? "is-checked" : ""} ${day === streak.today ? "is-today" : ""}`} aria-label={`${day}: ${checked ? "checked in" : "no check-in"}${day === streak.today ? ", today" : ""}`}><span>{label}</span><i>{checked ? <Check size={17} aria-hidden="true" /> : date.getUTCDate()}</i><small>{day === streak.today ? "Today" : "\u00a0"}</small></li>;
    })}</ol>
    <p className="account-streak-note">{streak.lastDay === streak.today ? "You're checked in today. Come back tomorrow to keep it going." : "Visit while signed in each day to build your streak."} A new day starts at midnight New York time.</p>
  </section>;
}
