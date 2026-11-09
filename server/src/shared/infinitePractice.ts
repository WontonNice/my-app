import { probabilityBatchPractice } from './probabilityBatchPractice';
import { geometryReviewPractice } from './geometryReviewPractice';
import { prob2Practice } from './prob2Practice';
import { algebraPlannerPractice } from './algebraPlannerPractice';
import { exponentsPractice } from './exponentsPractice';
import type { ExamQuestion } from './examTypes';
import { generateInequality, generateVariablesBothSidesInequality, variablesBothSidesTemplate } from './inequalityPractice';
import { generateWritingInequality, writingInequalitiesTemplate } from './writingInequalities';
import { generateOverlappingGroups, overlappingGroupsTemplate } from './overlappingGroups';
import { wordProblemPractice, surveyTotalsTemplate } from './practiceWordProblems';
import { probabilityPractice, probabilityModule } from './probabilityPractice';
import { generateSymbolicFractionDivision, symbolicFractionDivisionTemplate } from './symbolicFractionDivision';
import { generateRepeatingDecimalDigit, repeatingDecimalDigitsTemplate } from './repeatingDecimalDigits';
import { generateRectangleAreaPercent, rectangleAreaPercentTemplate } from './rectangleAreaPercent';

type Generator = { id: string; title: string; description?: string; category?: string; topic?: string; enabled?: boolean; foundation: boolean; generate: (index: number, seed: string) => ExamQuestion };
export type PracticeModule = { id: string; title: string; description: string; category?: string; topic?: string; placement?:'foundation'|'general'; selection: 'foundation' | 'all' | string[] };
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
  ...probabilityPractice.map(template=>({id:template.id,title:template.title,description:template.description,category:template.category,topic:template.topic,foundation:true,generate:(index:number,seed:string)=>template.generate(index,seed).question})),
  { ...symbolicFractionDivisionTemplate, foundation: false, generate: (index, seed) => generateSymbolicFractionDivision(index, seed).question },
  { ...repeatingDecimalDigitsTemplate, foundation: true, generate: (index, seed) => generateRepeatingDecimalDigit(index, seed, 1).question },
  { ...rectangleAreaPercentTemplate, foundation: false, generate: (index, seed) => generateRectangleAreaPercent(index, seed).question },
  ...probabilityBatchPractice.map(template=>({...template,foundation:template.destination.groupType==='foundation',generate:(index:number,seed:string)=>template.generate(index,seed).question})),
  ...prob2Practice.map(template=>({...template,foundation:template.destination.groupType==='foundation',generate:(index:number,seed:string)=>template.generate(index,seed).question})),
  ...algebraPlannerPractice.map(template=>({...template,foundation:true,generate:(index:number,seed:string)=>template.generate(index,seed).question})),
  ...exponentsPractice.map(template=>({...template,foundation:true,generate:(index:number,seed:string)=>template.generate(index,seed).question})),
  ...geometryReviewPractice.map(template=>({id:template.id,title:template.title,description:template.description,category:template.category,topic:template.topic,foundation:false,generate:(index:number,seed:string)=>template.generate(index,seed).question})),
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
  {...probabilityModule,selection:probabilityPractice.map(template=>template.id)},
  ...geometryReviewPractice.filter((template,index,all)=>all.findIndex(item=>item.moduleId===template.moduleId)===index).map(template=>({id:template.moduleId,title:template.moduleId==='geometry-cube-edges'?'Cube Edges and Volume':template.moduleId==='geometry-angle-relationships'?'Angle Relationships':template.title,description:template.description,category:template.category,topic:template.topic,selection:geometryReviewPractice.filter(item=>item.moduleId===template.moduleId).map(item=>item.id)})),
];

export function moduleGeneratorIds(module: PracticeModule): string[] {
  return practiceGenerators.filter(generator => generator.enabled !== false && (module.selection === 'all' || (module.selection === 'foundation' ? generator.foundation&&(generator.category??'Algebra')===(module.category??'Algebra')&&(generator.topic??'Inequalities')===(module.topic??'Inequalities') : module.selection.includes(generator.id)))).map(generator => generator.id);
}

export function generatePracticeQuestion(generatorIds: string[], index: number, seed: string, generationVersion:1|2|3=3): ExamQuestion {
  if (!generatorIds.length || !Number.isSafeInteger(index) || index < 0) throw new Error('Invalid practice sequence.');
  const generator = practiceGenerators.find(item => item.id === generatorIds[(index + hash(seed)) % generatorIds.length]);
  if (!generator) throw new Error('This practice type is no longer available.');
  const probability=probabilityPractice.find(item=>item.id===generator.id);
  if(probability)return probability.generate(Math.floor(index / generatorIds.length),seed,generationVersion>=3).question;
  return generator.generate(Math.floor(index / generatorIds.length), seed);
}
