import type { MathQuestionRecord } from './mathCommandTypes';
import { sourceFacets } from './sourceFacets';
import { questionOrganization } from './learningTaxonomy';
import { studentPracticeCatalog, type PracticeCatalog, type PracticeGeneratorDefinition } from './practiceCatalog';

export const unspecifiedPracticeSource = 'Unspecified';
export function practicePublisher(value: string) {
  const name = value.trim();
  if (/^(official|official handbook|official shsat|nyc doe)$/i.test(name)) return 'Official Handbook';
  if (/^prestige(?: prep)?$/i.test(name)) return 'Prestige';
  return name;
}
export function generatorPublishers(generator: PracticeGeneratorDefinition) {
  return generator.sourcePublishers?.length ? generator.sourcePublishers : [unspecifiedPracticeSource];
}

/** Source IDs are the durable relationship; refresh publisher labels from those records. */
export function withPracticeSources(catalog: PracticeCatalog, records: MathQuestionRecord[]): PracticeCatalog {
  const index = new Map(records.map(record => [record.id, record]));
  return { ...catalog, generators: catalog.generators.map(generator => ({ ...generator,
    sourcePublishers: [...new Set((generator.sourceQuestionIds ?? []).map(id => {
      const record = index.get(id);
      // A legacy explicit publisher is usable; exam titles and question IDs are not publishers.
      const organizedPublisher = record ? questionOrganization(record.question)?.publisher : '';
      const explicit = record ? (organizedPublisher && organizedPublisher !== unspecifiedPracticeSource ? organizedPublisher : '') || sourceFacets(record.question.source).publisher || (/^(official(?: handbook| shsat)?|prestige(?: prep)?|kaplan|shsat lab)$/i.test(record.metadata?.source ?? '') ? record.metadata!.source! : '') : '';
      return practicePublisher(explicit) || unspecifiedPracticeSource;
    }))].sort(),
  })) };
}

export type PracticeMixScope = { category?: string; topic?: string; publishers?: string[] };
export function practiceMix(catalog: PracticeCatalog, taxonomy: {label: string; topics: string[]}[], scope: PracticeMixScope = {}) {
  const allGenerators = [...new Map([...catalog.generators, ...(catalog.recommendedGenerators ?? [])].map(generator => [generator.id, generator])).values()];
  const published = studentPracticeCatalog({...catalog, generators:allGenerators});
  const pool = [...published.generators, ...(published.recommendedGenerators ?? [])];
  const available = [...new Map(pool.map(generator => [generator.id, generator])).values()];
  const scoped = available.filter(generator => (!scope.category || generator.category === scope.category) && (!scope.topic || generator.topic === scope.topic));
  const generators = scoped.filter(generator => !scope.publishers || generatorPublishers(generator).some(source => scope.publishers!.includes(source)));
  const coverage = taxonomy.filter(category => !scope.category || category.label === scope.category).flatMap(category => category.topics.filter(topic => !scope.topic || topic === scope.topic).map(topic => ({category:category.label, topic, count:generators.filter(generator => generator.category === category.label && generator.topic === topic).length})));
  const selectedSources = scope.publishers ? [...scope.publishers].sort() : null;
  let hash = 2166136261;
  for (const character of JSON.stringify([scope.category ?? '', scope.topic ?? '', selectedSources])) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
  const id = `mixed-math-${hash.toString(36)}`;
  const title = scope.topic || scope.category || 'All Math';
  const module = { id, title: `${title} · Mixed practice`.slice(0,120), description: 'Practice across the selected published question generators.', category: scope.category || 'All Math', topic: scope.topic || 'All topics', published: true, includeAll: false, generatorIds: generators.map(generator => generator.id) };
  return { id, title, generators, coverage, sources: [...new Set(scoped.flatMap(generatorPublishers))].sort(), catalog: { modules: [module], generators, videos: [] } satisfies PracticeCatalog };
}
