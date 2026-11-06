import { comparePracticeSessions, mergePracticeCheckpoint, type PracticeCheckpoint } from '../../../../server/src/shared/practiceCheckpoint';
import {parsePracticeState,type PracticeState} from './inequalitySession';
const prefix=(owner:string)=>`infinite-practice:session:v3:${encodeURIComponent(owner)}:`;
export const practiceProgressEvent = 'infinite-practice:progress';
const bestPrefix=(owner:string)=>`infinite-practice:best:v1:${encodeURIComponent(owner)}:`;
const bestKey = (owner:string,moduleId:string) => bestPrefix(owner)+encodeURIComponent(moduleId);
function storedSession(storage:Storage,owner:string,moduleId:string) {
  const state=parsePracticeState(storage.getItem(prefix(owner)+encodeURIComponent(moduleId)));
  return state?.moduleId===moduleId?state:null;
}
/** The last session supplies recent stats; the personal best survives starting over. */
export function readPracticeProgress(storage:Storage,owner:string,moduleId:string) {
  const {session,best:longestStreak}=localCheckpoint(storage,owner,moduleId);
  return {longestStreak,checked:session?.checked??0,correct:session?.correct??0,streak:session?.streak??0,resumable:Boolean(session&&!session.finished)};
}
export function readSavedPractice(storage:Storage,owner:string,moduleId?:string) {
  const id=moduleId??storage.getItem(prefix(owner)+'recent');
  if(!id)return null;
  const state=storedSession(storage,owner,id);
  return state&&!state.finished?state:null;
}
export function savePractice(storage:Storage,owner:string,state:PracticeState) {
  const {session:priorSession,best:priorBest}=localCheckpoint(storage,owner,state.moduleId);
  const changedIds: string[] = [];
  // Save the record before replacing the last session, including legacy sessions.
  storage.setItem(bestKey(owner,state.moduleId),String(Math.max(priorBest,state.longestStreak)));
  for(const [moduleId,best] of Object.entries(state.moduleLongestStreaks??{})){
    const previousBest=readPracticeProgress(storage,owner,moduleId).longestStreak;
    if (best > previousBest) {
      storage.setItem(bestKey(owner,moduleId),String(best));
      changedIds.push(moduleId);
    }
  }
  if(comparePracticeSessions(state,priorSession)>=0){
    storage.setItem(prefix(owner)+encodeURIComponent(state.moduleId),JSON.stringify(state));
    storage.setItem(prefix(owner)+'recent',state.moduleId);
  }
  const changed = !priorSession || state.seed!==priorSession.seed ||
      state.checked!==priorSession.checked || state.index!==priorSession.index || state.finished!==priorSession.finished ||
      state.hiddenGeneratorIds?.length!==priorSession.hiddenGeneratorIds?.length;
  if(typeof window!=='undefined' && (changed || changedIds.length)) {
    window.dispatchEvent(new CustomEvent(practiceCheckpointEvent,{detail:{owner,ids:[state.moduleId,...changedIds]}}));
    window.dispatchEvent(new Event(practiceProgressEvent));
  }
}

export const practiceRestoreEvent = 'infinite-practice:restore';
export const practiceCheckpointEvent = 'infinite-practice:checkpoint';

export function localCheckpoint(storage: Storage, owner: string, moduleId: string): PracticeCheckpoint {
  const session = storedSession(storage, owner, moduleId);
  const saved = Number(storage.getItem(bestKey(owner, moduleId)));
  return { moduleId, session, best: Math.max(Number.isSafeInteger(saved) ? saved : 0, session?.longestStreak ?? 0) };
}

export function localPracticeModules(storage: Storage, owner: string) {
  const ids = new Set<string>();
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    for (const start of [prefix(owner), bestPrefix(owner)]) {
      if (key?.startsWith(start) && key !== prefix(owner)+'recent') {
        ids.add(decodeURIComponent(key.slice(start.length)));
      }
    }
  }
  return ids;
}

export function restoreCheckpoint(storage: Storage, owner: string, remote: PracticeCheckpoint) {
  const local = localCheckpoint(storage, owner, remote.moduleId);
  const next = mergePracticeCheckpoint(local, remote);
  if (next.best > local.best) storage.setItem(bestKey(owner, next.moduleId), String(next.best));
  if (next.session && next.session !== local.session) {
    storage.setItem(prefix(owner)+encodeURIComponent(next.moduleId), JSON.stringify(next.session));
    if (!storage.getItem(prefix(owner)+'recent')) storage.setItem(prefix(owner)+'recent', next.moduleId);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(practiceRestoreEvent, { detail: { owner, session: next.session } }));
  }
  return next;
}
