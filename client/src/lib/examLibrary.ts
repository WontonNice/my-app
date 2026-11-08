import { worksheetPlacement, worksheetLibraryHref, grade9WorksheetCollection, recommendedWorksheetCategory, type StudyHallWorksheet } from '../../../server/src/shared/studyHallWorksheets';
import { sourceFacets } from '../../../server/src/shared/sourceFacets';
import type { ExamSource } from '../../../server/src/shared/examTypes';
export { isStudyHallWorksheet, worksheetPlacement, worksheetIds, worksheetLibraryHref } from '../../../server/src/shared/studyHallWorksheets';
export type ExamLibraryItem = { id: string; title: string; examLabel?: string; source?: ExamSource; studyHallWorksheet?: StudyHallWorksheet | null };
export const grade9MathCollectionLabel = 'Grade 9 Mathematics Sample Questions';
export const grade9MathLibraryHref = worksheetLibraryHref({subject:'math',category:recommendedWorksheetCategory,collection:grade9WorksheetCollection});
export function isGrade9MathSample(exam: ExamLibraryItem) {
  return worksheetPlacement(exam)?.collection === grade9MathCollectionLabel;
}
export type ExamLibraryFilter = { year: string; form: string; category: string; publisher?:string; shsatLevel?:string; collection?:string };
export const emptyExamLibraryFilter: ExamLibraryFilter = { year: "", form: "", category: "" };
const names = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
export function examLibraryMetadata(exam: ExamLibraryItem) {
  const title = exam.title.replace(/[–—−]/g, "-");
  const source = title + " " + exam.id.replace(/-/g, " ");
  const year = title.match(/\b((?:19|20)\d{2})(?:\s*-\s*((?:19|20)\d{2}))?\b/) ?? exam.id.match(/\b((?:19|20)\d{2})(?:-((?:19|20)\d{2}))?\b/);
  const form = source.match(/\bform\s+([a-z0-9]+)\b/i)?.[1].toUpperCase() ?? "";
  const category = isGrade9MathSample(exam) ? 'Grade 9 math samples' : /\badaptive\b/i.test(source) ? "Adaptive practice" : /\bdigital\b/i.test(source) && /\bpractice\b/i.test(source) ? "Digital practice" : year && form ? "Yearly forms" : "Other exams";
  const placement=worksheetPlacement(exam),facets=sourceFacets(placement?.source || exam.source);
  return { ...facets,publisher:facets.publisher||(isGrade9MathSample(exam)?'Official Handbook':''),shsatLevel:facets.shsatLevel||(isGrade9MathSample(exam)?'9':''),collection:placement?.collection||facets.collection,year: facets.year.replace(/[-—−]/g,'–') || (year ? year[1] + (year[2] ? "–" + year[2] : "") : ""), yearNumber: Number(facets.year.slice(0,4)||year?.[1]||0), form, category };
}
export function matchesExamLibrary(exam: ExamLibraryItem, query: string, filter: ExamLibraryFilter) {
  const metadata = examLibraryMetadata(exam);
  const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replace(/[–—−-]/g, " ");
  const text = normalize(exam.title + " " + metadata.category);
  return normalize(query).trim().split(/\s+/).filter(Boolean).every(term => text.includes(term))
    && (!filter.year || metadata.year === filter.year)
    && (!filter.form || metadata.form === filter.form)
    && (!filter.publisher || metadata.publisher === filter.publisher)
    && (!filter.shsatLevel || metadata.shsatLevel === filter.shsatLevel)
    && (!filter.collection || metadata.collection === filter.collection)
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

