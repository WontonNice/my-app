import { appendStudentPreview, type StudentPreviewContext } from "./studentPreview";
export function examCorrectionsHref(id: string, context?: StudentPreviewContext) { return appendStudentPreview(`/study-hall/shsat/corrections/${encodeURIComponent(id)}`, context); }
export function studentCorrectionRoute(path: string): "exam" | "library" | null {
  if (/^\/(?:study-hall\/shsat\/corrections\/[^/]+|results\/[^/]+\/corrections)\/?$/.test(path)) return "exam";
  if (/^\/(?:study-hall\/shsat\/library|advanced-practice)\/[^/]+\/corrections\/?$/.test(path)) return "library";
  return null;
}
export function examCorrectionId(path: string) {
  const match = path.match(/^\/study-hall\/shsat\/corrections\/([^/]+)\/?$/) || path.match(/^\/results\/([^/]+)\/corrections\/?$/);
  try { return match ? decodeURIComponent(match[1]) : ""; } catch { return ""; }
}
export function libraryCorrectionsHref(path: string, context?: StudentPreviewContext) { return appendStudentPreview(`${path.replace(/\/$/, "")}/corrections`, context); }
export function libraryCorrectionLocation(path: string) {
  const match = path.match(/^(\/study-hall\/shsat\/library\/|\/advanced-practice\/)([^/]+)\/corrections\/?$/);
  try { return match ? { bookId: decodeURIComponent(match[2]), backPath: `${match[1]}${match[2]}` } : { bookId: "", backPath: "/study-hall/shsat/materials?subject=english" }; } catch { return { bookId: "", backPath: "/study-hall/shsat/materials?subject=english" }; }
}
