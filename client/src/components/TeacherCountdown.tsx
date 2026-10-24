import { useEffect, useState } from "react";
import { Maximize2, Minimize2, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { classroomRemaining, defaultClassroomTimer, formatClassroomTime, readClassroomTimer, type ClassroomTimerState } from "../lib/classroomTimer";
import "../styles/teacher-countdown.css";

export function TeacherCountdown({ teacherId }: { teacherId: string }) {
  const key = `teacher-classroom-timer:${teacherId}`;
  const [state, setState] = useState<ClassroomTimerState>(() => { try { return readClassroomTimer(localStorage.getItem(key)); } catch { return defaultClassroomTimer; } });
  const [now, setNow] = useState(Date.now);
  const [minutes, setMinutes] = useState(String(state.durationMs / 60000));
  const [expanded, setExpanded] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 250);
    const sync = (event: StorageEvent) => { if (event.key === key) { const next = readClassroomTimer(event.newValue); setState(next); setMinutes(String(next.durationMs / 60000)); setNow(Date.now()); } };
    window.addEventListener("storage", sync);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", escape);
    return () => { window.clearInterval(tick); window.removeEventListener("storage", sync); window.removeEventListener("keydown", escape); };
  }, [key]);
  const remaining = classroomRemaining(state, now);
  const running = state.endsAt !== null && remaining > 0;
  function update(next: ClassroomTimerState) {
    setState(next); setNow(Date.now());
    try { localStorage.setItem(key, JSON.stringify(next)); setStorageMessage(""); } catch { setStorageMessage("Browser storage is unavailable. Keep this page open to retain the timer."); }
  }
  function applyDuration() {
    const value = Number(minutes);
    if (!Number.isInteger(value) || value < 1 || value > 720) return;
    update({ durationMs: value * 60000, remainingMs: value * 60000, endsAt: null });
  }
  return <section className={`teacher-countdown ${expanded ? "is-expanded" : ""} ${remaining === 0 ? "is-finished" : ""}`} aria-label="Teacher classroom countdown">
    <div className="teacher-countdown-title"><Timer size={18} /><div><strong>Class timer</strong><span>{remaining === 0 ? "Time is up" : running ? "Counting down" : remaining < state.durationMs ? "Paused" : "Ready when you are"}</span></div></div>
    <output role="timer" aria-live="off" aria-label={`${formatClassroomTime(remaining)} remaining`}>{formatClassroomTime(remaining)}</output>
    <div className="teacher-countdown-controls"><button className="countdown-primary" type="button" onClick={() => update(running ? { ...state, remainingMs: classroomRemaining(state, Date.now()), endsAt: null } : { ...state, remainingMs: remaining || state.durationMs, endsAt: Date.now() + (remaining || state.durationMs) })}>{running ? <Pause size={15} /> : <Play size={15} />}{running ? "Pause" : remaining === 0 ? "Restart" : "Start"}</button><button type="button" title="Reset countdown" aria-label="Reset countdown" onClick={() => update({ ...state, remainingMs: state.durationMs, endsAt: null })}><RotateCcw size={15} /></button><button type="button" aria-label={expanded ? "Shrink timer" : "Enlarge timer"} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button></div>
    <form onSubmit={event => { event.preventDefault(); applyDuration(); }}><label>Minutes<input type="number" min={1} max={720} step={1} required disabled={running} value={minutes} onChange={event => setMinutes(event.target.value)} /></label><button type="submit" disabled={running}>Set</button></form>
    <span className="teacher-countdown-note">Teacher display · student exam clocks run separately</span>
    <span className="countdown-announcement" role="status">{remaining === 0 ? "Class timer finished." : ""}</span>
    {storageMessage && <p role="status">{storageMessage}</p>}
  </section>;
}
