import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { getShsatCountdown, SHSAT_TEST_DAY } from "../lib/shsatCountdown";

export function ShsatCountdown() {
  const [countdown, setCountdown] = useState(() => getShsatCountdown());
  useEffect(() => {
    const update = () => {
      const next = getShsatCountdown();
      setCountdown(current => current.days === next.days && current.hours === next.hours && current.finished === next.finished && current.underHour === next.underHour ? current : next);
    };
    const interval = window.setInterval(update, 1000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(interval); window.removeEventListener("focus", update); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <section className="student-shsat-countdown" aria-labelledby="shsat-countdown-title">
    <div className="student-shsat-countdown-copy">
      <span className="student-shsat-countdown-icon"><CalendarDays size={23} aria-hidden="true" /></span>
      <div><p>YOUR NEXT MILESTONE</p><h2 id="shsat-countdown-title">{countdown.finished ? "The countdown is complete" : "SHSAT test day"}</h2>
        <time dateTime={SHSAT_TEST_DAY}>November 18, 2026 · 12:00 a.m. · New York time</time>
      </div>
    </div>
    <div className="student-shsat-countdown-clock" role="timer" aria-live="off" aria-label={`${countdown.days} days and ${countdown.hours} hours remaining until SHSAT test day`}>
      <div><strong>{String(countdown.days).padStart(2, "0")}</strong><span>days</span></div>
      <span className="student-shsat-countdown-divider" aria-hidden="true">:</span>
      <div><strong>{String(countdown.hours).padStart(2, "0")}</strong><span>hours</span></div>
      {countdown.underHour && <small>Less than an hour to go</small>}
    </div>
  </section>;
}
