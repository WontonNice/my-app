import { moduleGeneratorIds, practiceModules } from '../../../../server/src/shared/infinitePractice';
import { managedGeneratorIds, practiceModuleKind, type PracticeCatalog, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';

import type { PracticeState } from '../../../../server/src/shared/practiceCheckpoint';
import {practiceResponseEvidence} from '../../../../server/src/shared/practiceEvidence';
export { parsePracticeState, type PracticeState } from '../../../../server/src/shared/practiceCheckpoint';
/** Add module records to old sessions without changing their question set or crediting past answers. */
export function withPracticeModuleTracking(state:PracticeState,catalog?:PracticeCatalog):PracticeState {
  if(state.moduleGeneratorIds||!catalog)return state;
  const current=catalog.modules.find(module=>module.id===state.moduleId);
  if(!current)return state;
  const kind=practiceModuleKind(current);
  const modules=kind?catalog.modules.filter(module=>module.published&&!practiceModuleKind(module)&&module.category===current.category&&module.topic===current.topic&&(kind!=='foundation'||!state.moduleSelection?.childModuleIds||state.moduleSelection.childModuleIds.includes(module.id))):[current];
  const entries=modules.map(module=>[module.id,managedGeneratorIds(module,catalog).filter(id=>state.generatorIds.includes(id))] as const).filter(([,ids])=>ids.length);
  return {...state,practiceMode:kind??'focused',moduleGeneratorIds:Object.fromEntries(entries),moduleTitles:Object.fromEntries(modules.map(module=>[module.id,module.title])),moduleStreaks:{},moduleLongestStreaks:{}};
}
export function createPracticeState(moduleId: string, seed: string, catalog?:PracticeCatalog,selection:PracticeSelection={}): PracticeState {
  const managed=catalog?.modules.find(item=>item.id===moduleId&&item.published);
  if(catalog&&!managed)throw new Error('This practice module is no longer available.');
  const module = managed??practiceModules.find(item => item.id === moduleId);
  if (!module) throw new Error('Unknown practice module.');
  const generatorIds=managed&&catalog?managedGeneratorIds(managed,catalog,selection):moduleGeneratorIds(module as typeof practiceModules[number]);
  if(!generatorIds.length)throw new Error('This module needs an enabled question generator.');
  return withPracticeModuleTracking({ version: 2, generationVersion:3, startedAt:Date.now(), moduleId, generatorIds, ...(managed&&catalog?{moduleTitle:managed.title,moduleSelection:structuredClone(selection),generatorDefinitions:catalog.generators.filter(generator=>generatorIds.includes(generator.id)).map(generator=>structuredClone(generator))}:{}),seed, index: 0, checked: 0, correct: 0, streak: 0, longestStreak: 0, answer: '', submitted: false, finished: false, totalMs: 0, questionMs: 0, answeredMs: 0 },catalog);
}
export function addPracticeTime(state: PracticeState, elapsedMs: number): PracticeState {
  if (state.finished || !Number.isFinite(elapsedMs) || elapsedMs <= 0) return state;
  const ms = Math.round(elapsedMs);
  return { ...state, totalMs: state.totalMs + ms, questionMs: state.questionMs + (state.submitted ? 0 : ms) };
}
export function checkPracticeAnswer(state: PracticeState, correctChoice: string | boolean): PracticeState {
  if (state.finished || state.submitted || !state.answer) return state;
  const correct = typeof correctChoice === 'boolean' ? correctChoice : state.answer === correctChoice, streak = correct ? state.streak + 1 : 0;
  const id=currentPracticeGeneratorId(state),typeStreak=correct?(state.generatorStreaks?.[id]??0)+1:0;
  const moduleStreaks={...state.moduleStreaks},moduleLongestStreaks={...state.moduleLongestStreaks};
  for(const [moduleId,ids] of Object.entries(state.moduleGeneratorIds??{}))if(ids.includes(id)){
    moduleStreaks[moduleId]=correct?(moduleStreaks[moduleId]??0)+1:0;
    moduleLongestStreaks[moduleId]=Math.max(moduleLongestStreaks[moduleId]??0,moduleStreaks[moduleId]);
  }
  return { ...state, responses:[...(state.responses??[]),practiceResponseEvidence(state)],...(state.moduleGeneratorIds?{moduleStreaks,moduleLongestStreaks}:{}),generatorStreaks:{...state.generatorStreaks,[id]:typeStreak}, submitted: true, checked: state.checked + 1, correct: state.correct + Number(correct), streak, longestStreak: Math.max(state.longestStreak, streak), answeredMs: state.answeredMs + state.questionMs };
}
export function currentPracticeGeneratorId(state:PracticeState) {
  let hash=0;if(!state.generatorDefinitions)for(const char of state.seed)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
  return state.generatorIds[((state.sequenceIndex??state.index)%state.generatorIds.length+hash%state.generatorIds.length)%state.generatorIds.length];
}
export function hidePracticeGenerator(state:PracticeState,id:string):PracticeState {
  if(state.finished||!state.generatorIds.includes(id)||state.hiddenGeneratorIds?.includes(id))return state;
  if(id===currentPracticeGeneratorId(state)&&!state.submitted)return state;
  const hiddenGeneratorIds=[...(state.hiddenGeneratorIds??[]),id];
  return {...state,hiddenGeneratorIds,finished:hiddenGeneratorIds.length===state.generatorIds.length};
}
export function nextPracticeQuestion(state: PracticeState): PracticeState {
  if(!state.submitted||state.finished)return state;
  let sequenceIndex=(state.sequenceIndex??state.index)+1;
  while(state.hiddenGeneratorIds?.includes(currentPracticeGeneratorId({...state,sequenceIndex})))sequenceIndex++;
  return { ...state, generationVersion:3, sequenceIndex, index: state.index + 1, answer: '', submitted: false, questionMs: 0 };
}
export function practiceAccuracy(state: PracticeState): string { return state.checked ? `${Math.round(100 * state.correct / state.checked)}%` : '—'; }
export function practiceSummary(state: PracticeState) {
  return { accuracy: practiceAccuracy(state), longestStreak: state.longestStreak, averageMs: state.checked ? state.answeredMs / state.checked : null, totalMs: state.totalMs };
}
export function formatPracticeTime(ms: number): string {
  const seconds = Math.round(ms / 1000), minutes = Math.floor(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m ${seconds % 60}s` : minutes ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}
