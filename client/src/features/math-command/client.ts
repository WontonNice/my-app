import { createAuthHeaders, requestApi } from "../../lib/api";
import type { MathCatalogFilters, MathCatalogRow, MathCatalogSummary, MathDiagnosticSkill, MathInventoryTargets, MathQuestionMetadata, MathQuestionRecord, MathTaxonomy } from "../../../../server/src/shared/mathCommandTypes";

export type MathCommandRequest = <T>(path: string, options?: RequestInit) => Promise<T>;
export type SavedMathView = { id: string; name: string; filters: MathCatalogFilters };
export type MathCollection = { id: string; name: string; questionIds: string[] };
export type MathCommandOverview = {
  revision: string;
  summary: MathCatalogSummary;
  taxonomy: MathTaxonomy;
  targets: MathInventoryTargets;
  savedViews: SavedMathView[];
  collections: MathCollection[];
  skills: MathDiagnosticSkill[];
  prerequisites?: Record<string, string[]>;
  rules?: Record<string, number>;
  pacePerWeek?: number;
};
export type MathQuestionDetail = { record: MathQuestionRecord; row: MathCatalogRow };
export type MathMetadataPatch = MathQuestionMetadata & { category?: string; subcategory?: string };
export type MathBulkPreview = { token: string; count: number; revision: string; changes: { id: string; fields: { field: string; before: unknown; after: unknown }[] }[] };
export function mathCommandRequest(accessToken: string): MathCommandRequest {
  return <T>(path: string, options: RequestInit = {}) => requestApi<T>(`/api/math-command${path}`, { ...options, headers: { ...createAuthHeaders(accessToken), ...options.headers } });
}
export function jsonRequest(method: string, body: unknown): RequestInit { return { method, body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }; }
export const mathLabel = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
export const mathPercent = (value: number | null | undefined) => value == null ? "—" : `${Math.round(value * 10) / 10}%`;
export const mathDate = (value: string | null | undefined) => value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleDateString() : "—";
export function downloadMathCsv(name: string, headers: string[], rows: unknown[][]) {
  const cell = (value: unknown) => {
    const text = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
    return `"${(/^[=+@-]/.test(text) ? "'" : "") + text.replace(/"/g, '""')}"`;
  };
  const url = URL.createObjectURL(new Blob(["\uFEFF", [headers, ...rows].map(row => row.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}
