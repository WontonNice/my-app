import { practiceGenerators, practiceModules } from './infinitePractice';
import type { SelectedAnswer } from './examGrading';
import { validateGenerator, type PracticeGeneratorDefinition, type PracticeSelection } from './practiceCatalog';

export type PracticeState = {
  // v3 varies probability event colors; older in-progress questions keep their version.
  generationVersion?:1|2|3;
  startedAt?: number;
  version: 2; moduleId: string; generatorIds: string[]; seed: string; index: number;
  checked: number; correct: number; streak: number; longestStreak: number;
  answer: SelectedAnswer; submitted: boolean; finished: boolean;
  totalMs: number; questionMs: number; answeredMs: number;
  moduleTitle?:string; generatorDefinitions?:PracticeGeneratorDefinition[]; moduleSelection?:PracticeSelection;
  sequenceIndex?:number; generatorStreaks?:Record<string,number>; unlockedGeneratorIds?:string[]; hiddenGeneratorIds?:string[];
  practiceMode?:'foundation'|'general'|'focused';
  moduleGeneratorIds?:Record<string,string[]>; moduleTitles?:Record<string,string>;
  moduleStreaks?:Record<string,number>; moduleLongestStreaks?:Record<string,number>;
};
export function parsePracticeState(raw: string | null): PracticeState | null {
  try {
    const state = JSON.parse(raw || 'null');
    if(state?.startedAt !== undefined && (!Number.isSafeInteger(state.startedAt) || state.startedAt < 0))return null;
    if(state?.generationVersion!==undefined&&state.generationVersion!==1&&state.generationVersion!==2&&state.generationVersion!==3)return null;
    if(state?.moduleSelection!==undefined&&(!state.moduleSelection||typeof state.moduleSelection!=='object'||Array.isArray(state.moduleSelection)||(state.moduleSelection.includeUnassigned!==undefined&&typeof state.moduleSelection.includeUnassigned!=='boolean')||['childModuleIds','topics'].some(key=>state.moduleSelection[key]!==undefined&&(!Array.isArray(state.moduleSelection[key])||state.moduleSelection[key].length>1000||!state.moduleSelection[key].every((value:unknown)=>typeof value==='string'&&value.length<250)))))return null;
    const definitions=state?.generatorDefinitions===undefined?undefined:Array.isArray(state.generatorDefinitions)&&state.generatorDefinitions.length<=1000?state.generatorDefinitions.map(validateGenerator):null;
    if (state?.version !== 2 || typeof state.seed !== 'string' || state.seed.length > 100 || (definitions?typeof state.moduleId!=='string'||typeof state.moduleTitle!=='string'||state.moduleTitle.length>120:!practiceModules.some(item => item.id === state.moduleId)) || definitions===null ||
      !Array.isArray(state.generatorIds) || !state.generatorIds.length || new Set(state.generatorIds).size !== state.generatorIds.length || !state.generatorIds.every((id: unknown) => definitions?definitions.some((item:PracticeGeneratorDefinition)=>item.id===id):practiceGenerators.some(item => item.id === id)) ||
      !['index','checked','correct','streak','longestStreak','totalMs','questionMs','answeredMs'].every(key => Number.isSafeInteger(state[key]) && state[key] >= 0) ||
      state.correct > state.checked || state.streak > state.longestStreak || state.longestStreak > state.correct || state.answeredMs > state.totalMs || state.questionMs > state.totalMs ||
      !validAnswer(state.answer) || typeof state.submitted !== 'boolean' || typeof state.finished !== 'boolean' || (state.submitted && !state.answer) || state.checked !== state.index + Number(state.submitted)) return null;
    if(state.sequenceIndex!==undefined&&(!Number.isSafeInteger(state.sequenceIndex)||state.sequenceIndex<state.index))return null;
    if(state.generatorStreaks!==undefined&&(!state.generatorStreaks||typeof state.generatorStreaks!=='object'||Array.isArray(state.generatorStreaks)||Object.entries(state.generatorStreaks).some(([id,value])=>!state.generatorIds.includes(id)||!Number.isSafeInteger(value)||(value as number)<0||(value as number)>state.correct)))return null;
    for(const key of ['unlockedGeneratorIds','hiddenGeneratorIds'])if(state[key]!==undefined&&(!Array.isArray(state[key])||new Set(state[key]).size!==state[key].length||state[key].some((id:unknown)=>!state.generatorIds.includes(id))))return null;
    if(state.practiceMode!==undefined&&!['foundation','general','focused'].includes(state.practiceMode))return null;
    if(state.moduleGeneratorIds!==undefined&&(!state.moduleGeneratorIds||typeof state.moduleGeneratorIds!=='object'||Array.isArray(state.moduleGeneratorIds)||Object.entries(state.moduleGeneratorIds).some(([id,ids])=>id.length>250||!Array.isArray(ids)||!ids.length||!ids.every(value=>state.generatorIds.includes(value)))))return null;
    if(state.moduleTitles!==undefined&&(!state.moduleTitles||typeof state.moduleTitles!=='object'||Array.isArray(state.moduleTitles)||Object.values(state.moduleTitles).some(value=>typeof value!=='string'||value.length>120)))return null;
    for(const key of ['moduleStreaks','moduleLongestStreaks'])if(state[key]!==undefined&&(!state[key]||typeof state[key]!=='object'||Array.isArray(state[key])||Object.entries(state[key]).some(([id,value])=>!Object.hasOwn(state.moduleGeneratorIds??{},id)||!Number.isSafeInteger(value)||(value as number)<0||(value as number)>state.correct)))return null;
    if(Object.entries(state.moduleStreaks??{}).some(([id,value])=>(value as number)>(state.moduleLongestStreaks?.[id]??0)))return null;
    if(!state.finished&&state.hiddenGeneratorIds?.length===state.generatorIds.length)return null;
    return state;
  } catch { return null; }
}
function validAnswer(answer: unknown): answer is SelectedAnswer {
  return typeof answer === 'string' || (Array.isArray(answer) ? answer.every(value => typeof value === 'string') : Boolean(answer && typeof answer === 'object' && Object.values(answer).every(value => typeof value === 'string')));
}

export type PracticeCheckpoint = { moduleId: string; best: number; session: PracticeState | null };

/** A delayed retry may improve a record, but cannot rewind a newer run or answer. */
export function comparePracticeSessions(left: PracticeState | null, right: PracticeState | null): number {
  if (!left || !right) return Number(Boolean(left)) - Number(Boolean(right));
  const start = (left.startedAt ?? 0) - (right.startedAt ?? 0);
  if (start) return start;
  const progress = left.checked - right.checked || left.index - right.index;
  return progress || Number(left.finished) - Number(right.finished)
    || (left.hiddenGeneratorIds?.length ?? 0) - (right.hiddenGeneratorIds?.length ?? 0)
    || left.totalMs - right.totalMs || left.seed.localeCompare(right.seed);
}

export function mergePracticeCheckpoint(current: PracticeCheckpoint, incoming: PracticeCheckpoint): PracticeCheckpoint {
  return {
    moduleId: current.moduleId,
    best: Math.max(current.best, incoming.best, incoming.session?.longestStreak ?? 0),
    session: comparePracticeSessions(incoming.session, current.session) > 0 ? incoming.session : current.session,
  };
}
