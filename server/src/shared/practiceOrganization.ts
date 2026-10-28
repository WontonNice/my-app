import type { PracticeCatalog, PracticeGeneratorDefinition } from './practiceCatalog';
import { inequalityTemplate, variablesBothSidesTemplate } from './inequalityPractice';
import { writingInequalitiesTemplate } from './writingInequalities';
import { overlappingGroupsTemplate } from './overlappingGroups';
import { wordProblemPractice } from './practiceWordProblems';
import { probabilityPractice } from './probabilityPractice';

export const practicePrograms = ['SHSAT', 'SAT', 'PSAT', 'AP'] as const;
export const practiceDifficulties = ['unassigned', 'foundation', 'standard', 'advanced'] as const;
export const practiceReviewStatuses = ['unreviewed', 'in-review', 'approved'] as const;
export type GeneratorOrganization = {
  skills?: string[];
  prerequisites?: string[];
  sourceQuestionIds?: string[];
  programs?: string[];
  subject?: string;
  difficulty?: typeof practiceDifficulties[number];
  reviewStatus?: typeof practiceReviewStatuses[number];
};

const definitions = [inequalityTemplate, variablesBothSidesTemplate, writingInequalitiesTemplate, overlappingGroupsTemplate, ...wordProblemPractice, ...probabilityPractice];
const titleAliases: Record<string, string[]> = {
  'one-step-inequalities-v1': ['One-step inequalities and sign flips', 'One-step inequalities', 'One-Step Inequalities'],
  'variables-both-sides-inequalities-v1': ['Inequalities: Variables on Both Sides'],
  'probability-same-color-no-replacement-v1': ['Probability: Both Not Blue'],
};
const skillTitles: Record<string, string> = {
  'one-step-inequalities-v1': 'One-step Inequalities and Sign Flips',
  'variables-both-sides-inequalities-v1': 'Inequalities with Variables on Both Sides',
};

export function organizeGenerator(generator: PracticeGeneratorDefinition): PracticeGeneratorDefinition {
  const definition = definitions.find(item => item.id === (generator.builtinId ?? generator.id));
  const originalTitle = definition?.title;
  const title = skillTitles[generator.builtinId ?? generator.id]
    ?? (originalTitle?.replace(/^Probability: /, '').replace('Both Not Blue', 'Same-color Draws Without Replacement').replace('One Specific Conditional Outcome', 'Conditional Probability'));
  const aliases = [...(titleAliases[generator.builtinId ?? generator.id] ?? []), ...(originalTitle ? [originalTitle] : [])];
  return {
    ...generator,
    ...(title && aliases.includes(generator.title) ? { title } : {}),
    skills: generator.skills ?? [title ?? generator.title],
    prerequisites: generator.prerequisites ?? [],
    sourceQuestionIds: generator.sourceQuestionIds ?? (definition ? [definition.sourceId] : []),
    programs: generator.programs ?? ['SHSAT'], subject: generator.subject ?? 'Math',
    difficulty: generator.difficulty ?? 'unassigned', reviewStatus: generator.reviewStatus ?? 'unreviewed',
  };
}

/** These are skill collections, not an inferred difficulty order. */
export const probabilitySkillGroups = [
  { id: 'probability-listing-outcomes', title: 'Listing Outcomes', ids: ['probability-cube-sum-counts-v1', 'probability-spinner-products-v1', 'probability-unordered-sample-spaces-v1'] },
  { id: 'probability-after-removal', title: 'Probability After Removal', ids: ['probability-ratio-removal-v1'] },
  { id: 'probability-without-replacement', title: 'Draws Without Replacement', ids: ['probability-ordered-draws-v1', 'probability-same-color-no-replacement-v1'] },
  { id: 'probability-with-replacement', title: 'Draws With Replacement', ids: ['probability-with-replacement-v1'] },
  { id: 'probability-conditional', title: 'Conditional Probability', ids: ['probability-specific-conditional-outcome-v1'] },
];
const sameIds = (first: string[], second: string[]) => first.length === second.length && first.every(id => second.includes(id));

/** Explicit, idempotent migration; never resets a teacher's custom collection. */
export function organizePracticeCatalog(catalog: PracticeCatalog): PracticeCatalog {
  const next:PracticeCatalog = {...catalog, generators:catalog.generators.map(organizeGenerator),
    modules:catalog.modules.map(module=>({...module,generatorIds:[...module.generatorIds]})), videos:catalog.videos.map(video=>({...video}))};
  for(const module of next.modules){
    if(module.topic!=='Probability'||module.includeAll||module.defaultType||module.skillId)continue;
    const group=probabilitySkillGroups.find(group=>sameIds(module.generatorIds,group.ids));
    if(group)module.skillId=group.id;
  }
  const broad = next.modules.find(module => module.id === 'probability-foundation');
  if (!broad || broad.title !== 'Probability' || broad.includeAll || !sameIds(broad.generatorIds, probabilityPractice.map(item => item.id))) return next;
  const reusable = probabilitySkillGroups.map(group => next.modules.find(module => module.id !== broad.id && module.category === broad.category && module.topic === broad.topic && !module.includeAll && sameIds(module.generatorIds, group.ids)));
  let retained = false;
  probabilitySkillGroups.forEach((group, index) => {
    const existing = reusable[index];
    if (existing) {
      existing.skillId=group.id;
      if (existing.title === `Probability: ${group.title}`) existing.title = group.title;
      return;
    }
    const module = { ...broad, id: retained ? group.id : broad.id, skillId:group.id, ...(retained?{selectionAliases:[broad.id]}:{}), title: group.title,
      description: `Focused practice in ${group.title.toLowerCase()}.`, generatorIds: [...group.ids] };
    if (!retained) { Object.assign(broad, module); retained = true; }
    else if (!next.modules.some(item => item.id === module.id)) next.modules.push(module);
    else throw new Error(`The module ID ${module.id} is already used. Rename that custom module ID before organizing Probability.`);
  });
  // If every skill already exists, retain the legacy ID as a hidden archive rather than deleting it.
  if (!retained) { broad.title = 'Probability (legacy collection)'; broad.published = false; }
  return next;
}
