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
  return result.completionStatus !== "english_complete" && result.completionStatus !== "math_complete" && sections.includes("english") && sections.includes("math");
}

export function examScopeLabel(result: Record<string, unknown>): string {
  if (isFullExamResult(result)) return "Full exam";
  const sections = submittedExamSections(result);
  return sections.length === 1 ? `${sections[0] === "math" ? "Math" : "English"} only` : "Scope unknown";
}
