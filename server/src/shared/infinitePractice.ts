import type { ExamQuestion } from './examTypes';
import { generateInequality, generateVariablesBothSidesInequality, variablesBothSidesTemplate } from './inequalityPractice';
import { generateWritingInequality, writingInequalitiesTemplate } from './writingInequalities';
import { generateOverlappingGroups, overlappingGroupsTemplate } from './overlappingGroups';
import { wordProblemPractice, surveyTotalsTemplate } from './practiceWordProblems';

type Generator = { id: string; title: string; description?: string; category?: string; topic?: string; foundation: boolean; generate: (index: number, seed: string) => ExamQuestion };
export type PracticeModule = { id: string; title: string; description: string; category?: string; topic?: string; selection: 'foundation' | 'all' | string[] };
const foundationIndices = Array.from({ length: 1056 }, (_, index) => index).filter(index => {
  const item = generateInequality(index, 'foundation');
  return item.coefficient >= 2 && item.coefficient <= 5 && item.boundary >= 1 && item.boundary <= 8;
});
function hash(seed: string) { let result = 0; for (const char of seed) result = (Math.imul(result, 31) + char.charCodeAt(0)) >>> 0; return result; }

// Add a generator here once. General Practice includes it automatically;
// Foundation Building includes generators explicitly marked as foundational.
export const practiceGenerators: Generator[] = [
  { id: 'inequalities-foundation-v1', title: 'Inequalities: positive division', foundation: true, generate: (index, seed) => {
    const at = (index % foundationIndices.length * 13 + hash(seed) % foundationIndices.length) % foundationIndices.length;
    return { ...generateInequality(foundationIndices[at], 'foundation').question, id: `inequalities-foundation-v1:${seed}:${index}` };
  } },
  { id: 'one-step-inequalities-v1', title: 'One-step inequalities and sign flips', foundation: false, generate: (index, seed) => generateInequality(index, seed).question },
  { id: variablesBothSidesTemplate.id, title: variablesBothSidesTemplate.title, description: variablesBothSidesTemplate.description, foundation: false, generate: (index, seed) => generateVariablesBothSidesInequality(index, seed).question },
  { id: writingInequalitiesTemplate.id, title: writingInequalitiesTemplate.title, description: writingInequalitiesTemplate.description, foundation: false, generate: (index, seed) => generateWritingInequality(index, seed).question },
  { id: overlappingGroupsTemplate.id, title: overlappingGroupsTemplate.title, description: overlappingGroupsTemplate.description, category: overlappingGroupsTemplate.category, topic: overlappingGroupsTemplate.topic, foundation: false, generate: (index, seed) => generateOverlappingGroups(index, seed).question },
  ...wordProblemPractice.map(template=>({id:template.id,title:template.title,description:template.description,category:template.category,topic:template.topic,foundation:false,generate:(index:number,seed:string)=>template.generate(index,seed).question})),
];

// Targeted modules can combine any number of registered generators. Stable IDs
// let new modules be added without changing the player or existing sessions.
export const practiceModules: PracticeModule[] = [
  { id: 'foundation', title: 'Foundation Building', description: 'Build confidence with easy questions, small positive numbers, and exact division.', selection: 'foundation' },
  { id: 'all', title: 'General Practice', description: 'Mix every available practice type in one session.', selection: 'all' },
  { id: 'inequalities', title: 'One-step Inequalities', description: 'Practice positive and negative coefficients, strict inequalities, and sign flips.', selection: ['one-step-inequalities-v1'] },
  { id: variablesBothSidesTemplate.sourceId, title: variablesBothSidesTemplate.title, description: variablesBothSidesTemplate.description, selection: [variablesBothSidesTemplate.id] },
  { id: writingInequalitiesTemplate.sourceId, title: writingInequalitiesTemplate.title, description: writingInequalitiesTemplate.description, selection: [writingInequalitiesTemplate.id] },
  { id: overlappingGroupsTemplate.sourceId, title: overlappingGroupsTemplate.title, description: 'Practice overlapping group percentages and survey totals, including both groups and neither group.', category: overlappingGroupsTemplate.category, topic: overlappingGroupsTemplate.topic, selection: [overlappingGroupsTemplate.id,surveyTotalsTemplate.id] },
  ...wordProblemPractice.filter(template=>!('moduleId'in template)).map(template=>({id:template.sourceId,title:template.title,description:template.description,category:template.category,topic:template.topic,selection:[template.id]})),
];

export function moduleGeneratorIds(module: PracticeModule): string[] {
  return practiceGenerators.filter(generator => module.selection === 'all' || (module.selection === 'foundation' ? generator.foundation : module.selection.includes(generator.id))).map(generator => generator.id);
}

export function generatePracticeQuestion(generatorIds: string[], index: number, seed: string): ExamQuestion {
  if (!generatorIds.length || !Number.isSafeInteger(index) || index < 0) throw new Error('Invalid practice sequence.');
  const generator = practiceGenerators.find(item => item.id === generatorIds[(index + hash(seed)) % generatorIds.length]);
  if (!generator) throw new Error('This practice type is no longer available.');
  return generator.generate(Math.floor(index / generatorIds.length), seed);
}
