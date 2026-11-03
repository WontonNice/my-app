/** Shared by teacher summaries, analytics and progress completion checks. */
export function submittedExamSections(result: Record<string, unknown>): ("english" | "math")[] {
  if (Array.isArray(result.completedSections)) return [...new Set(result.completedSections.filter((value): value is "english" | "math" => value === "english" || value === "math"))];
  if (result.completionStatus === "english_complete") return ["english"];
  if (result.completionStatus === "math_complete") return ["math"];
  if (Array.isArray(result.subjects) && result.subjects.length) return result.subjects.flatMap(value => {
    const subject = value as { subject?: string; total?: number };
    return subject.total && subject.total > 0 ? subject.subject === "Mathematics" ? ["math" as const] : subject.subject === "English Language Arts" ? ["english" as const] : [] : [];
  });
  return result.completionStatus === "complete" ? ["english", "math"] : [];
}

export function isFullExamResult(result: Record<string, unknown>): boolean {
  const sections = submittedExamSections(result);
  if (result.completionStatus === "english_complete" || result.completionStatus === "math_complete" || result.completionStatus === "in_progress") return false;
  // Submission flags describe navigation, not proof that both subjects were scored.
  const subjects = Array.isArray(result.subjects) ? result.subjects as { subject?: string; total?: number }[] : [];
  if (result.source === "answer_sheet" && result.assessmentPurpose !== "full_exam") return false;
  const snapshot = result.analysisContent as { passageSets?: { questions?: unknown[] }[]; standaloneSection?: { questions?: unknown[] }; mathSection?: { questions?: unknown[] } } | undefined;
  if (snapshot) {
    const englishTotal = (snapshot.passageSets ?? []).reduce((sum, set) => sum + (set.questions?.length ?? 0), 0) + (snapshot.standaloneSection?.questions?.length ?? 0);
    const mathTotal = snapshot.mathSection?.questions?.length ?? 0;
    if (!englishTotal || !mathTotal || subjects.find(subject => subject.subject === "English Language Arts")?.total !== englishTotal || subjects.find(subject => subject.subject === "Mathematics")?.total !== mathTotal) return false;
  }
  return sections.includes("english") && sections.includes("math") && ["English Language Arts", "Mathematics"].every(name => subjects.some(subject => subject.subject === name && typeof subject.total === "number" && subject.total > 0));
}

export function examScopeLabel(result: Record<string, unknown>): string {
  if (isFullExamResult(result)) return "Full exam";
  const subjects = Array.isArray(result.subjects) ? result.subjects as { subject?: string; total?: number }[] : [];
  const submitted = submittedExamSections(result);
  const scored = subjects.filter(subject => typeof subject.total === "number" && subject.total > 0 && (!submitted.length || submitted.includes(subject.subject === "Mathematics" ? "math" : "english")));
  if (scored.some(subject => subject.subject === "English Language Arts") && scored.some(subject => subject.subject === "Mathematics")) return "Both subjects · scope unverified";
  if (scored.length === 1) return `${scored[0].subject === "Mathematics" ? "Math" : "English"} only`;
  const sections = submittedExamSections(result);
  return sections.length === 1 ? `${sections[0] === "math" ? "Math" : "English"} only` : "Scope unknown";
}
