import {parsePracticeState,type PracticeState} from './inequalitySession';
const prefix=(owner:string)=>`infinite-practice:session:v3:${encodeURIComponent(owner)}:`;
export const practiceProgressEvent = 'infinite-practice:progress';
const bestKey = (owner:string,moduleId:string) => `infinite-practice:best:v1:${encodeURIComponent(owner)}:${encodeURIComponent(moduleId)}`;
function storedSession(storage:Storage,owner:string,moduleId:string) {
  const state=parsePracticeState(storage.getItem(prefix(owner)+encodeURIComponent(moduleId)));
  return state?.moduleId===moduleId?state:null;
}
/** The last session supplies recent stats; the personal best survives starting over. */
export function readPracticeProgress(storage:Storage,owner:string,moduleId:string) {
  const session=storedSession(storage,owner,moduleId);
  const savedBest=Number(storage.getItem(bestKey(owner,moduleId)));
  const longestStreak=Math.max(Number.isSafeInteger(savedBest)&&savedBest>=0?savedBest:0,session?.longestStreak??0);
  return {longestStreak,checked:session?.checked??0,correct:session?.correct??0,streak:session?.streak??0,resumable:Boolean(session&&!session.finished)};
}
export function readSavedPractice(storage:Storage,owner:string,moduleId?:string) {
  const id=moduleId??storage.getItem(prefix(owner)+'recent');
  if(!id)return null;
  const state=storedSession(storage,owner,id);
  return state&&!state.finished?state:null;
}
export function savePractice(storage:Storage,owner:string,state:PracticeState) {
  const previous=readPracticeProgress(storage,owner,state.moduleId);
  // Save the record before replacing the last session, including legacy sessions.
  storage.setItem(bestKey(owner,state.moduleId),String(Math.max(previous.longestStreak,state.longestStreak)));
  for(const [moduleId,best] of Object.entries(state.moduleLongestStreaks??{})){
    const previousBest=readPracticeProgress(storage,owner,moduleId).longestStreak;
    storage.setItem(bestKey(owner,moduleId),String(Math.max(previousBest,best)));
  }
  storage.setItem(prefix(owner)+encodeURIComponent(state.moduleId),JSON.stringify(state));
  storage.setItem(prefix(owner)+'recent',state.moduleId);
  if(typeof window!=='undefined'&&(previous.checked!==state.checked||previous.streak!==state.streak||previous.resumable===state.finished))window.dispatchEvent(new Event(practiceProgressEvent));
}
