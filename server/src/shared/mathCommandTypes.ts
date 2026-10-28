import type { ExamQuestion } from "./examTypes";

export const mathDifficulties = ["easy", "medium", "hard", "expert"] as const;
export type MathDifficulty = typeof mathDifficulties[number];
export type MathRepresentation = "diagram" | "graph" | "table";
export type MathReviewIssue = "missing_category" | "missing_subcategory" | "missing_difficulty" | "missing_source" | "missing_answer" | "missing_explanation" | "missing_diagram" | "invalid_formatting" | "invalid_answer" | "invalid_classification" | "possible_duplicate" | "teacher_review";
export type MathStandardMapping = { code: string; verified: boolean; referenceUrl?: string; note?: string };
export type MathQuestionMetadata = {
  skilled?: string;
  category?: string;
  subcategory?: string;
  diagnosticSkill?: string;
  secondarySkills?: string[];
  difficulty?: MathDifficulty;
  source?: string;
  sourceQuestionId?: string;
  standards?: MathStandardMapping[];
  representations?: MathRepresentation[];
  requiresDiagram?: boolean;
  reviewStatus?: "needs_review" | "reviewed";
  importedAt?: string;
  context?: string;
  notes?: string;
};
export type MathQuestionSource = { assessmentId: string; title: string; number: number; year?: string; form?: string; source?: string };
export type MathQuestionRecord = { id: string; question: ExamQuestion; sources: MathQuestionSource[]; metadata?: MathQuestionMetadata };
export type MathTaxonomy = { categories: { label: string; topics: string[] }[]; skills?: MathDiagnosticSkill[]; classificationSkills?: import('./mathClassificationSkills').MathClassificationSkill[] };
export type MathDiagnosticSkill = { id: string; label: string; category: string; subcategory: string; prerequisiteIds?: string[]; standardReferences?: string[] };
export type MathQuestionPerformance = {
  attempts: number; uniqueStudents: number; correct: number; incorrect: number; unanswered: number;
  /** Percentages on a 0–100 scale; null means unavailable. */
  accuracy: number | null; firstAttemptAccuracy: number | null;
  lastAttemptedAt?: string; assignmentCount?: number; lastAssignedAt?: string;
};
export type MathDuplicateKind = "exact" | "possible" | "template";
export type MathDuplicateGroup = { id: string; kind: MathDuplicateKind; questionIds: string[]; score: number; reason: string };
export type MathCatalogRow = {
  personal?: import("./teacherLabels").TeacherQuestionNote;
  teacherLabelNames?: string[];
  id: string; prompt: string; type: string; category: string; subcategory: string;
  skilled?: string; skilledLabel?: string;
  diagnosticSkill: string; secondarySkills: string[]; difficulty: MathDifficulty | "";
  source: string; sourceQuestionId: string; sources: MathQuestionSource[]; years: string[]; forms: string[];
  standards: MathStandardMapping[]; representations: MathRepresentation[]; context: string;
  importedAt: string | null; issues: MathReviewIssue[]; ready: boolean; hasAnswer: boolean; hasExplanation: boolean;
  duplicateKinds: MathDuplicateKind[]; performance: MathQuestionPerformance | null;
};
export type MathCatalogFilters = {
  skilled?: string[];
  search?: string;
  teacherLabelIds?: string[]; favoritesOnly?: boolean;
  category?: string[]; subcategory?: string[]; diagnosticSkill?: string[]; secondarySkill?: string[];
  standard?: string[]; difficulty?: (MathDifficulty | "unclassified")[]; responseType?: string[];
  source?: string[]; year?: string[]; form?: string[]; assessmentId?: string[]; context?: string;
  diagram?: boolean; graph?: boolean; table?: boolean;
  issue?: MathReviewIssue[]; status?: "ready" | "needs_review" | "never_assigned" | "previously_assigned" | "possible_duplicate";
  collectionQuestionIds?: string[]; excludeQuestionIds?: string[];
  sort?: "favorite" | "taggedAt" | "category" | "subcategory" | "difficulty" | "importedAt" | "attempts" | "accuracy" | "incorrect" | "unanswered" | "lastAssignedAt" | "source" | "id";
  direction?: "asc" | "desc"; page?: number; pageSize?: number;
};
export type MathCatalogPage = { items: MathCatalogRow[]; total: number; page: number; pageSize: number; pages: number };
export type MathInventoryTargets = { defaultPerDifficulty?: number; overrides?: { category: string; subcategory: string; difficulty: MathDifficulty; minimum: number }[] };
export type MathCoverageRow = {
  category: string; subcategory: string; total: number; ready: number; needsReview: number; missingExplanation: number;
  difficulties: Record<MathDifficulty | "unclassified", number>;
  readyDifficulties: Record<MathDifficulty | "unclassified", number>;
  gaps: { difficulty: MathDifficulty; available: number; target: number; shortage: number }[];
};
export type MathCatalogSummary = {
  total: number; ready: number; needsReview: number; categories: number; subcategories: number;
  reviewCounts: Record<MathReviewIssue, number>; coverage: MathCoverageRow[];
  duplicateGroups: Record<MathDuplicateKind, number>;
};
export type MathCatalog = { rows: MathCatalogRow[]; duplicates: MathDuplicateGroup[]; duplicateSearch: { comparedPairs: number; blockedLargeGroups: number; description: string } };
