export const EXAM_DURATION_MS = 3 * 60 * 60 * 1000;

export type ExamTimerState = {
  pausedAt: number | null;
  startedAt: number;
  totalPausedMs: number;
};

function getExamTimerStorageKey(assessmentId: string) {
  return `exam-timer:${assessmentId}`;
}

function isValidTimerState(value: unknown): value is ExamTimerState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const timer = value as Partial<ExamTimerState>;
  return (
    Number.isFinite(timer.startedAt) &&
    Number.isFinite(timer.totalPausedMs) &&
    (timer.pausedAt === null || Number.isFinite(timer.pausedAt))
  );
}

export function createExamTimerState(now = Date.now()): ExamTimerState {
  return {
    pausedAt: null,
    startedAt: now,
    totalPausedMs: 0,
  };
}

export function saveExamTimerState(assessmentId: string, timer: ExamTimerState) {
  try { window.localStorage.setItem(getExamTimerStorageKey(assessmentId), JSON.stringify(timer)); } catch { /* Continue with the in-memory timer. */ }
}

export function resetExamTimer(assessmentId: string, now = Date.now()) {
  const timer = createExamTimerState(now);
  saveExamTimerState(assessmentId, timer);
  return timer;
}

export function loadExamTimer(assessmentId: string) {
  let storedTimer: string | null = null;
  try { storedTimer = window.localStorage.getItem(getExamTimerStorageKey(assessmentId)); } catch { /* Device storage is optional. */ }

  if (storedTimer) {
    try {
      const parsedTimer: unknown = JSON.parse(storedTimer);

      if (isValidTimerState(parsedTimer)) {
        return parsedTimer;
      }
    } catch {
      // Replace malformed local data with a clean attempt timer.
    }
  }

  return resetExamTimer(assessmentId);
}

export function pauseExamTimer(timer: ExamTimerState, now = Date.now()): ExamTimerState {
  if (timer.pausedAt !== null) {
    return timer;
  }

  return {
    ...timer,
    pausedAt: now,
  };
}

export function resumeExamTimer(timer: ExamTimerState, now = Date.now()): ExamTimerState {
  if (timer.pausedAt === null) {
    return timer;
  }

  return {
    ...timer,
    pausedAt: null,
    totalPausedMs: timer.totalPausedMs + Math.max(0, now - timer.pausedAt),
  };
}

export function getExamElapsedMs(timer: ExamTimerState, now = Date.now()) {
  const effectiveNow = timer.pausedAt ?? now;
  return Math.max(0, effectiveNow - timer.startedAt - timer.totalPausedMs);
}

export function getExamTimerDisplay(timer: ExamTimerState, now = Date.now()) {
  const remainingMs = EXAM_DURATION_MS - getExamElapsedMs(timer, now);
  const isOvertime = remainingMs < 0;
  const totalSeconds = Math.floor(Math.abs(remainingMs) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    isOvertime,
    text: `${isOvertime ? "+" : ""}${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`,
  };
}

export function isExamTimeExpired(timer: ExamTimerState, now = Date.now()) {
  return getExamElapsedMs(timer, now) >= EXAM_DURATION_MS;
}
