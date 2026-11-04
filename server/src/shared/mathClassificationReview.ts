import type { MathClassification, MathQuestionMetadata } from "./mathCommandTypes";

// An approval describes an exact category/topic pair, never a question forever.
export function currentMathClassification(metadata: MathQuestionMetadata | undefined, category: string | undefined, subcategory: string | undefined): MathClassification | undefined {
  const value = metadata?.classification;
  return category && subcategory && value?.category === category && value.subcategory === subcategory ? value : undefined;
}

export function teacherMathClassification(metadata: MathQuestionMetadata | undefined, previous: { category?: string; subcategory?: string }, next: { category: string; subcategory: string }, actor: string): MathClassification {
  const at = new Date().toISOString();
  const changed = previous.category !== next.category || previous.subcategory !== next.subcategory;
  const existing = currentMathClassification(metadata, next.category, next.subcategory);
  return changed
    ? { ...next, source: "teacher", status: "approved", at, actor, approvedAt: at, approvedBy: actor }
    : { ...next, source: "unknown", at, ...existing, status: "approved", approvedAt: at, approvedBy: actor };
}

export function mathClassificationLabel(value?: MathClassification): string {
  if (value?.source === "teacher" && value.status === "approved") return "Teacher categorized";
  if (value?.status === "approved") return value.source === "ai" ? "Teacher approved · AI" : "Teacher approved";
  if (value?.source === "ai") return "AI · needs approval";
  return "Unverified";
}
