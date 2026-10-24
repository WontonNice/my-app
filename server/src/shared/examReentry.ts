export type ExamReentryGrant = {
  id: string;
  assessmentId: string;
  studentId: string;
  attemptId: string;
  sections: ("english" | "math")[];
  remainingSections: ("english" | "math")[];
  additionalMinutes: number;
  grantedAt: string;
  draftsFrom?: string;
  grantedBy: string;
  revokedAt?: string;
  timerState: { startedAt: number; pausedAt: number | null; totalPausedMs: number };
};

export function examAttemptId(result: Record<string, unknown>, assessmentId: string) {
  return typeof result.attemptId === "string" ? result.attemptId : `legacy:${assessmentId}:${result.completedAt}`;
}

export function remainingReentrySections(grant: ExamReentryGrant, result: Record<string, unknown> | undefined) {
  if (grant.revokedAt || !result || examAttemptId(result, grant.assessmentId) !== grant.attemptId) return [];
  const submitted = result.reentryGrantId === grant.id && Array.isArray(result.reentrySubmittedSections) ? result.reentrySubmittedSections : [];
  return grant.sections.filter(section => !submitted.includes(section));
}

/** A new device resumes the latest submitted section's timer, not the original grant allowance. */
export function restoredReentryTimer(grant: ExamReentryGrant, result: Record<string, unknown> | null | undefined): ExamReentryGrant["timerState"] {
  const timer = result?.reentryGrantId === grant.id ? result.timerState as ExamReentryGrant["timerState"] | undefined : undefined;
  return timer && Number.isFinite(timer.startedAt) && Number.isFinite(timer.totalPausedMs) && (timer.pausedAt === null || Number.isFinite(timer.pausedAt)) ? { ...timer } : { ...grant.timerState };
}
