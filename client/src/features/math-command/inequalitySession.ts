import { moduleGeneratorIds, practiceGenerators, practiceModules } from '../../../../server/src/shared/infinitePractice';
import type { SelectedAnswer } from '../../../../server/src/shared/examGrading';
import { managedGeneratorIds, validateGenerator, type PracticeCatalog, type PracticeGeneratorDefinition, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';

export type PracticeState = {
  version: 2; moduleId: string; generatorIds: string[]; seed: string; index: number;
  checked: number; correct: number; streak: number; longestStreak: number;
  answer: SelectedAnswer; submitted: boolean; finished: boolean;
  totalMs: number; questionMs: number; answeredMs: number;
  moduleTitle?:string; generatorDefinitions?:PracticeGeneratorDefinition[]; moduleSelection?:PracticeSelection;
};
export function createPracticeState(moduleId: string, seed: string, catalog?:PracticeCatalog,selection:PracticeSelection={}): PracticeState {
  const managed=catalog?.modules.find(item=>item.id===moduleId&&item.published);
  if(catalog&&!managed)throw new Error('This practice module is no longer available.');
  const module = managed??practiceModules.find(item => item.id === moduleId);
  if (!module) throw new Error('Unknown practice module.');
  const generatorIds=managed&&catalog?managedGeneratorIds(managed,catalog,selection):moduleGeneratorIds(module as typeof practiceModules[number]);
  if(!generatorIds.length)throw new Error('This module needs an enabled question generator.');
  return { version: 2, moduleId, generatorIds, ...(managed&&catalog?{moduleTitle:managed.title,moduleSelection:structuredClone(selection),generatorDefinitions:catalog.generators.filter(generator=>generatorIds.includes(generator.id)).map(generator=>structuredClone(generator))}:{}),seed, index: 0, checked: 0, correct: 0, streak: 0, longestStreak: 0, answer: '', submitted: false, finished: false, totalMs: 0, questionMs: 0, answeredMs: 0 };
}
export function parsePracticeState(raw: string | null): PracticeState | null {
  try {
    const state = JSON.parse(raw || 'null');
    if(state?.moduleSelection!==undefined&&(!state.moduleSelection||typeof state.moduleSelection!=='object'||Array.isArray(state.moduleSelection)||['childModuleIds','topics'].some(key=>state.moduleSelection[key]!==undefined&&(!Array.isArray(state.moduleSelection[key])||state.moduleSelection[key].length>1000||!state.moduleSelection[key].every((value:unknown)=>typeof value==='string'&&value.length<250)))))return null;
    const definitions=state?.generatorDefinitions===undefined?undefined:Array.isArray(state.generatorDefinitions)&&state.generatorDefinitions.length<=1000?state.generatorDefinitions.map(validateGenerator):null;
    if (state?.version !== 2 || typeof state.seed !== 'string' || state.seed.length > 100 || (definitions?typeof state.moduleId!=='string'||typeof state.moduleTitle!=='string'||state.moduleTitle.length>120:!practiceModules.some(item => item.id === state.moduleId)) || definitions===null ||
      !Array.isArray(state.generatorIds) || !state.generatorIds.length || new Set(state.generatorIds).size !== state.generatorIds.length || !state.generatorIds.every((id: unknown) => definitions?definitions.some((item:PracticeGeneratorDefinition)=>item.id===id):practiceGenerators.some(item => item.id === id)) ||
      !['index','checked','correct','streak','longestStreak','totalMs','questionMs','answeredMs'].every(key => Number.isSafeInteger(state[key]) && state[key] >= 0) ||
      state.correct > state.checked || state.streak > state.longestStreak || state.longestStreak > state.correct || state.answeredMs > state.totalMs || state.questionMs > state.totalMs ||
      !validAnswer(state.answer) || typeof state.submitted !== 'boolean' || typeof state.finished !== 'boolean' || (state.submitted && !state.answer) || state.checked !== state.index + Number(state.submitted)) return null;
    return state;
  } catch { return null; }
}
function validAnswer(answer: unknown): answer is SelectedAnswer {
  return typeof answer === 'string' || (Array.isArray(answer) ? answer.every(value => typeof value === 'string') : Boolean(answer && typeof answer === 'object' && Object.values(answer).every(value => typeof value === 'string')));
}
export function addPracticeTime(state: PracticeState, elapsedMs: number): PracticeState {
  if (state.finished || !Number.isFinite(elapsedMs) || elapsedMs <= 0) return state;
  const ms = Math.round(elapsedMs);
  return { ...state, totalMs: state.totalMs + ms, questionMs: state.questionMs + (state.submitted ? 0 : ms) };
}
export function checkPracticeAnswer(state: PracticeState, correctChoice: string | boolean): PracticeState {
  if (state.finished || state.submitted || !state.answer) return state;
  const correct = typeof correctChoice === 'boolean' ? correctChoice : state.answer === correctChoice, streak = correct ? state.streak + 1 : 0;
  return { ...state, submitted: true, checked: state.checked + 1, correct: state.correct + Number(correct), streak, longestStreak: Math.max(state.longestStreak, streak), answeredMs: state.answeredMs + state.questionMs };
}
export function nextPracticeQuestion(state: PracticeState): PracticeState {
  return state.submitted && !state.finished ? { ...state, index: state.index + 1, answer: '', submitted: false, questionMs: 0 } : state;
}
export function practiceAccuracy(state: PracticeState): string { return state.checked ? `${Math.round(100 * state.correct / state.checked)}%` : '—'; }
export function practiceSummary(state: PracticeState) {
  return { accuracy: practiceAccuracy(state), longestStreak: state.longestStreak, averageMs: state.checked ? state.answeredMs / state.checked : null, totalMs: state.totalMs };
}
export function formatPracticeTime(ms: number): string {
  const seconds = Math.round(ms / 1000), minutes = Math.floor(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m ${seconds % 60}s` : minutes ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}
