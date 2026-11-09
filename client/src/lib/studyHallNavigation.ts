import { revisingEditingTopics } from '../content/practice';
import { worksheetCategoryMatches, worksheetTopicMatches, type StudyHallWorksheet } from '../../../server/src/shared/studyHallWorksheets';

export const studyHallEntries = [
  { id: 'reading', title: 'Reading Comprehension', description: 'Explore passages, build reading skills, and work through challenging texts.' },
  { id: 'editing', title: 'Revising/Editing A', description: 'Practice grammar and organization in passages, with focused worksheets and mixed review.' },
  { id: 'standalone', title: 'Stand Alone Items', description: 'Practice individual grammar and editing questions by category or in mixed review.' },
  { id: 'math', title: 'Math', description: 'Choose a category, then find infinite practice, worksheets, and videos for your topic.' },
] as const;
export type StudyHallEntry = typeof studyHallEntries[number]['id'];
export const studyHallDirectories = [
  { id: 'reading', title: 'Reading Comprehension' },
  { id: 'editing', title: 'Revising/Editing' },
  { id: 'math', title: 'Math' },
] as const;
export const studyHallSections = {
  reading: [{ id: 'library', title: 'Library' }, { id: 'categories', title: 'Reading Categories' }, { id: 'worksheets', title: 'Worksheets' }, { id: 'advanced', title: 'Advanced Readings' }],
  editing: [{ id: 'categories', title: 'Categories' }, { id: 'worksheets', title: 'Worksheets' }],
  standalone: [{ id: 'categories', title: 'Categories' }, { id: 'worksheets', title: 'Worksheets' }],
  math: [{ id: 'categories', title: 'Categories' }, { id: 'recommended', title: "Nathan Teacher's Recommended" }],
};
export function studyHallLocation(search: string) {
  const params = new URLSearchParams(search);
  const entry: StudyHallEntry = params.get('subject') === 'math' ? 'math' : params.get('entry') === 'editing' ? 'editing' : params.get('entry') === 'standalone' ? 'standalone' : 'reading';
  const sections = studyHallSections[entry];
  const section = sections.find(item => item.id === params.get('section'))?.id || sections[0].id;
  return { entry, section };
}
export function studyHallHref(entry: StudyHallEntry, section?: string) {
  const params = new URLSearchParams({ subject: entry === 'math' ? 'math' : 'english' });
  if (entry !== 'math') params.set('entry', entry);
  if (section) params.set('section', section);
  return '/study-hall/shsat/materials?' + params.toString();
}
export function normalizeStudyHallText(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
// Older worksheets already store category/topic strings; keep their placement intact.
export function worksheetArea(placement: StudyHallWorksheet): StudyHallEntry | 'advanced' {
  if (placement.subject === 'math') return 'math';
  if (placement.area === 'revising_editing_b') return 'standalone';
  if (placement.area === 'revising_editing_a') return 'editing';
  if (placement.area === 'reading') return 'reading';
  const category = normalizeStudyHallText(placement.category);
  if (/advanced|sat reading/.test(category) || /advanced reading/.test(normalizeStudyHallText(placement.collection ?? ''))) return 'advanced';
  if (/revis|editing|grammar/.test(category) || revisingEditingTopics.some(topic => [topic.key, topic.title, topic.slug].some(value => [category, normalizeStudyHallText(placement.topic ?? '')].includes(normalizeStudyHallText(value))))) return 'editing';
  return 'reading';
}
export function worksheetMatchesTopic(placement: StudyHallWorksheet, aliases: string[]) {
  return aliases.some(alias => worksheetCategoryMatches(placement,alias)||worksheetTopicMatches(placement,alias)||[placement.category, placement.topic].some(value => value && normalizeStudyHallText(value) === normalizeStudyHallText(alias)));
}
