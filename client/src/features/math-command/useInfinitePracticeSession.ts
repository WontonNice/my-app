import { useCallback, useEffect, useRef, useState } from 'react';
import { addPracticeTime, createPracticeState, type PracticeState } from './inequalitySession';
import type { PracticeCatalog, PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import {readSavedPractice,savePractice} from './practiceSessionStorage';

function restore(owner:string,moduleId?:string) { try { return readSavedPractice(localStorage,owner,moduleId); } catch { return null; } }

export function useInfinitePracticeSession(initialModuleId?: string,catalog?:PracticeCatalog,selection:PracticeSelection={},persistSession=true,owner='preview') {
  const [session, setSession] = useState(() => (persistSession?restore(owner,initialModuleId):null) ?? (initialModuleId ? createPracticeState(initialModuleId, crypto.randomUUID().slice(0, 8),catalog,selection) : null));
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
    const tick = () => update(state => state);
    const hide = () => { tick(); lastTick.current = null; };
    const timer = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pagehide', hide);
    return () => {
      window.clearInterval(timer); document.removeEventListener('visibilitychange', tick); window.removeEventListener('pagehide', hide);
      if (persistSession && current.current && lastTick.current !== null) persist(addPracticeTime(current.current, Math.max(0, Date.now() - lastTick.current)));
      lastTick.current = null;
    };
  }, [update, persistSession,persist]);
  const save=()=>{const now=Date.now();const timed=current.current&&lastTick.current!==null?addPracticeTime(current.current,Math.max(0,now-lastTick.current)):current.current;current.current=timed;lastTick.current=now;return persist(timed);};
  const resume=(moduleId:string)=>restore(owner,moduleId);
  return { session, update, save, saveError, resume };
}
