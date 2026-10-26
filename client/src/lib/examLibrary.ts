export type ExamLibraryItem = { id: string; title: string };
export type ExamLibraryFilter = { year: string; form: string; category: string };
export const emptyExamLibraryFilter: ExamLibraryFilter = { year: "", form: "", category: "" };
const names = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
export function examLibraryMetadata(exam: ExamLibraryItem) {
  const title = exam.title.replace(/[–—−]/g, "-");
  const source = title + " " + exam.id.replace(/-/g, " ");
  const year = title.match(/\b((?:19|20)\d{2})(?:\s*-\s*((?:19|20)\d{2}))?\b/) ?? exam.id.match(/\b((?:19|20)\d{2})(?:-((?:19|20)\d{2}))?\b/);
  const form = source.match(/\bform\s+([a-z0-9]+)\b/i)?.[1].toUpperCase() ?? "";
  const category = /\badaptive\b/i.test(source) ? "Adaptive practice" : /\bdigital\b/i.test(source) && /\bpractice\b/i.test(source) ? "Digital practice" : year && form ? "Yearly forms" : "Other exams";
  return { year: year ? year[1] + (year[2] ? "–" + year[2] : "") : "", yearNumber: Number(year?.[1] ?? 0), form, category };
}
export function matchesExamLibrary(exam: ExamLibraryItem, query: string, filter: ExamLibraryFilter) {
  const metadata = examLibraryMetadata(exam);
  const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replace(/[–—−-]/g, " ");
  const text = normalize(exam.title + " " + metadata.category);
  return normalize(query).trim().split(/\s+/).filter(Boolean).every(term => text.includes(term))
    && (!filter.year || metadata.year === filter.year)
    && (!filter.form || metadata.form === filter.form)
    && (!filter.category || metadata.category === filter.category);
}
export function compareExamLibrary(a: ExamLibraryItem, b: ExamLibraryItem, sort: string) {
  const left = examLibraryMetadata(a), right = examLibraryMetadata(b);
  const year = right.yearNumber - left.yearNumber || names.compare(right.year, left.year);
  const form = Number(!left.form) - Number(!right.form) || names.compare(left.form, right.form);
  const category = names.compare(left.category, right.category);
  const name = names.compare(a.title, b.title);
  return sort === "name" ? name : sort === "category" ? category || year || form || name : sort === "form" ? form || year || category || name : year || form || category || name;
}

