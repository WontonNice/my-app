import {parsePracticeState,type PracticeState} from './inequalitySession';
const prefix=(owner:string)=>`infinite-practice:session:v3:${encodeURIComponent(owner)}:`;
export function readSavedPractice(storage:Storage,owner:string,moduleId?:string) {
  const id=moduleId??storage.getItem(prefix(owner)+'recent');
  if(!id)return null;
  const state=parsePracticeState(storage.getItem(prefix(owner)+encodeURIComponent(id)));
  return state?.moduleId===id&&!state.finished?state:null;
}
export function savePractice(storage:Storage,owner:string,state:PracticeState) {
  storage.setItem(prefix(owner)+encodeURIComponent(state.moduleId),JSON.stringify(state));
  storage.setItem(prefix(owner)+'recent',state.moduleId);
}
