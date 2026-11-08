import type { ExamSource } from './examTypes';

/** Read only explicit source metadata; a word such as “grade” in a prompt is not provenance. */
export function sourceFacets(source?: ExamSource) {
  const shsatLevel = source?.shsatLevel || (/^(?:Grade|SHSAT)\s*9$/i.test(source?.form || '') ? '9' : /^(?:Grade|SHSAT)\s*8$/i.test(source?.form || '') ? '8' : '');
  const publisher = source?.publisher || (source?.sourceFamily === 'official_shsat' ? 'Official Handbook' : '');
  return { publisher, sourceFamily: source?.sourceFamily || '', shsatLevel, year: source?.year || '', collection: source?.collection || '' };
}
