import { useCallback, useEffect, useRef, useState } from 'react';
import { addPracticeTime, createPracticeState, parsePracticeState, type PracticeState } from './inequalitySession';
import type { PracticeCatalog, PracticeSelection } from '../../../../server/src/shared/practiceCatalog';

const storageKey = 'infinite-practice:session:v2';
function restore() { try { return parsePracticeState(sessionStorage.getItem(storageKey)); } catch { return null; } }
function persist(state: PracticeState | null) { try { if (state) sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Storage is optional. */ } }

export function useInfinitePracticeSession(initialModuleId?: string,catalog?:PracticeCatalog,selection:PracticeSelection={},persistSession=true) {
  const [session, setSession] = useState(() => initialModuleId ? createPracticeState(initialModuleId, crypto.randomUUID().slice(0, 8),catalog,selection) : persistSession ? restore() : null);
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
  }, [persistSession]);
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
  }, [update, persistSession]);
  return { session, update };
}
