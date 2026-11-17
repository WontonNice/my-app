// The teacher roster arrives with each distinct exam copy sent once: a result carries the hash
// of its copy in `analysisContentRef` and the copies arrive beside the roster. This gives
// every result its copy back, so the rest of the app sees results exactly as they are stored.
// Results that share an exam also share one object here; treat exam copies as read-only.
export function attachSharedExamSnapshots<T extends { progress: { examResults: unknown[] } }>(
  students: T[],
  examSnapshots: Record<string, unknown> | undefined,
): T[] {
  if (!examSnapshots) return students;
  for (const student of students) {
    for (const result of student.progress.examResults) {
      if (!result || typeof result !== "object") continue;
      const record = result as Record<string, unknown>;
      const hash = record.analysisContentRef;
      if (typeof hash !== "string") continue;
      if (Object.hasOwn(examSnapshots, hash)) record.analysisContent = examSnapshots[hash];
      delete record.analysisContentRef;
    }
  }
  return students;
}
