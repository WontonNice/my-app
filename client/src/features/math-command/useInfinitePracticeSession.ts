import { useCallback, useEffect, useRef, useState } from 'react';
import { addPracticeTime, createPracticeState, withPracticeModuleTracking, type PracticeState } from './inequalitySession';
import type { PracticeCatalog, PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import { mergePracticeCheckpoint } from '../../../../server/src/shared/practiceCheckpoint';
import {practiceRestoreEvent,readSavedPractice,savePractice,readPracticeProgress} from './practiceSessionStorage';

function restore(owner:string,moduleId?:string,catalog?:PracticeCatalog) { try { const state=readSavedPractice(localStorage,owner,moduleId);return state?withPracticeModuleTracking(state,catalog):null; } catch { return null; } }

export function useInfinitePracticeSession(initialModuleId?: string,catalog?:PracticeCatalog,selection:PracticeSelection={},persistSession=true,owner='preview',startNew=false) {
  const [session, setSession] = useState(() => (persistSession&&!startNew?restore(owner,initialModuleId,catalog):null) ?? (initialModuleId ? createPracticeState(initialModuleId, crypto.randomUUID().slice(0, 8),catalog,selection) : null));
  const [saveError,setSaveError]=useState('');
  const persist=useCallback((state:PracticeState|null)=>{try{if(state&&persistSession)savePractice(localStorage,owner,state);setSaveError('');return true;}catch{setSaveError('This browser could not save your session. Keep this page open and try Save and exit again.');return false;}},[owner,persistSession]);
  const current = useRef(session);
  const lastTick = useRef<number | null>(null);
  const update = useCallback((change: (state: PracticeState | null) => PracticeState | null) => {
    const now = Date.now();
    const previous = current.current;
    const timed = previous && lastTick.current !== null ? addPracticeTime(previous, Math.max(0, now - lastTick.current)) : previous;
    const next = change(timed);
    current.current = next;
    lastTick.current = next && !next.finished && document.visibilityState === 'visible' ? now : null;
    if (persistSession) persist(next);
    setSession(next);
  }, [persistSession,persist]);
  useEffect(() => {
    lastTick.current = current.current && !current.current.finished && document.visibilityState === 'visible' ? Date.now() : null;
    const restored = (event: Event) => {
      const record = (event as CustomEvent<{owner:string;session:PracticeState}>).detail;
      const previous = current.current;
      if (!persistSession || record.owner !== owner || record.session.moduleId !== previous?.moduleId) return;
      const next=mergePracticeCheckpoint({moduleId:previous.moduleId,best:0,session:previous},{moduleId:record.session.moduleId,best:0,session:record.session}).session;
      if(!next||next===previous)return;
      current.current = next;
      lastTick.current = !next.finished && document.visibilityState === 'visible' ? Date.now() : null;
      setSession(next);
    };
    window.addEventListener(practiceRestoreEvent, restored);
    const tick = () => update(state => state);
    const hide = () => { tick(); lastTick.current = null; };
    const timer = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pagehide', hide);
    return () => {
      window.removeEventListener(practiceRestoreEvent, restored);
      window.clearInterval(timer); document.removeEventListener('visibilitychange', tick); window.removeEventListener('pagehide', hide);
      if (persistSession && current.current && lastTick.current !== null) persist(addPracticeTime(current.current, Math.max(0, Date.now() - lastTick.current)));
      lastTick.current = null;
    };
  }, [update, persistSession,persist,owner]);
  const save=()=>{const now=Date.now();const timed=current.current&&lastTick.current!==null?addPracticeTime(current.current,Math.max(0,now-lastTick.current)):current.current;current.current=timed;lastTick.current=now;return persist(timed);};
  const resume=(moduleId:string)=>restore(owner,moduleId,catalog);
  let personalBest=session?.longestStreak??0;
  try { if(session&&persistSession)personalBest=Math.max(personalBest,readPracticeProgress(localStorage,owner,session.moduleId).longestStreak); } catch { /* The save error handles unavailable storage. */ }
  return { session, update, save, saveError, resume, personalBest };
}
