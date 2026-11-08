import {categoryFor} from './learningTaxonomy';
/** Placement changes organization only; worksheet IDs, questions and attempts stay intact. */
export type StudyHallWorksheet = {
  subject: 'math' | 'english';
  area?: 'reading' | 'revising_editing_a' | 'revising_editing_b' | 'math';
  scope?: 'focused' | 'mixed';
  categoryId?: string;
  topicId?: string;
  category: string;
  topic?: string;
  collection?: string;
  source?: import('./examTypes').ExamSource;
};
type CatalogItem = { id: string; examLabel?: string; studyHallWorksheet?: StudyHallWorksheet | null };
export const grade9WorksheetCollection = 'Grade 9 Mathematics Sample Questions';
export function canonicalWorksheetCollection(value?: string) {
  return /^(?:Grade 9 Mathematics Sample Questions|SHSAT 9\s*[·-]\s*Official Handbook)$/i.test((value || '').trim()) ? grade9WorksheetCollection : (value || '').trim();
}
export const recommendedWorksheetCategory = "Nathan Teacher's Recommended";
export function worksheetPlacement(item: CatalogItem): StudyHallWorksheet | undefined {
  if (item.studyHallWorksheet) {
    const placement={...item.studyHallWorksheet,collection:canonicalWorksheetCollection(item.studyHallWorksheet.collection)};
    const category=categoryFor(worksheetEducationalArea(placement),placement.categoryId||placement.category);
    const topic=category?.topics.find(item=>[item.id,item.label,...item.aliases].includes(placement.topicId||placement.topic||''));
    return category?.active?{...placement,category:category.label,categoryId:category.id,...(topic?.active?{topic:topic.label,topicId:topic.id}:{})}:placement;
  }
  // Retain the original collection while older saved catalogs roll forward.
  if (item.studyHallWorksheet !== null && item.examLabel === grade9WorksheetCollection) {
    return { subject: 'math', category: recommendedWorksheetCategory, collection: grade9WorksheetCollection };
  }
  return undefined;
}
export function isStudyHallWorksheet(item: CatalogItem) { return Boolean(worksheetPlacement(item)); }
export function worksheetScope(placement: StudyHallWorksheet): 'focused' | 'mixed' {
  return placement.scope ?? (placement.topic ? 'focused' : 'mixed');
}
export function worksheetEducationalArea(placement: StudyHallWorksheet): NonNullable<StudyHallWorksheet['area']> {
  if (placement.area) return placement.area;
  if (placement.subject === 'math') return 'math';
  if (/stand.?alone|part.?b/i.test(placement.category)) return 'revising_editing_b';
  if (/revis|editing|grammar|modifier|pronoun|punctuation|sentence|verb/i.test(placement.category)) return 'revising_editing_a';
  return 'reading';
}
export function worksheetIds(items: CatalogItem[]) { return new Set(items.filter(isStudyHallWorksheet).map(item => item.id)); }
export function worksheetCategoryMatches(placement: StudyHallWorksheet, value?: string | null) {
  return !value||placement.category===value||placement.categoryId===value||categoryFor(worksheetEducationalArea(placement),value)?.id===categoryFor(worksheetEducationalArea(placement),placement.categoryId||placement.category)?.id&&Boolean(categoryFor(worksheetEducationalArea(placement),value));
}
export function worksheetTopicMatches(placement: StudyHallWorksheet,value?: string | null) {
  if(!value||placement.topic===value||placement.topicId===value)return true;
  const category=categoryFor(worksheetEducationalArea(placement),placement.categoryId||placement.category);
  return Boolean(category?.topics.some(topic=>[topic.id,topic.label,...topic.aliases].includes(value)&&[topic.id,topic.label,...topic.aliases].includes(placement.topicId||placement.topic||'')));
}
export function worksheetLibraryHref(placement: StudyHallWorksheet) {
  // A collection can contain several categories and focused/mixed worksheets.
  if (placement.collection) return '/study-hall/shsat/worksheets?' + new URLSearchParams({subject:placement.subject,collection:canonicalWorksheetCollection(placement.collection)});
  const query = new URLSearchParams({ subject: placement.subject, category: placement.category });
  if (placement.topic) query.set('topic', placement.topic);
  if (placement.collection) query.set('collection', placement.collection);
  if (placement.area) query.set('area', placement.area);
  if (placement.scope) query.set('scope', placement.scope);
  if (placement.categoryId) query.set('categoryId',placement.categoryId);
  if (placement.topicId) query.set('topicId',placement.topicId);
  return '/study-hall/shsat/worksheets?' + query.toString();
}
