import { useCallback, useEffect, useRef, useState } from 'react';
import { addAdaptiveTime, compareAdaptiveStates, parseAdaptiveState, type AdaptiveState } from '../../../../server/src/shared/adaptiveMath/engine';
import { createAuthHeaders, requestApi } from '../../lib/api';
import { getActiveSession } from '../../lib/sessionCache';

/** Where the latest progress is known to be saved. */
export type AdaptiveSync = 'device' | 'loading' | 'saving' | 'saved' | 'offline' | 'unavailable';
const path = '/api/infinite-practice/adaptive-exam';
const storageKey = (owner: string) => `adaptive-math-exam:v1:${encodeURIComponent(owner)}`;

function readLocal(owner: string) { try { return parseAdaptiveState(localStorage.getItem(storageKey(owner))); } catch { return null; } }
async function accountHeaders(owner: string) {
  const session = await getActiveSession();
  if (session?.user.id !== owner) throw new Error('The signed-in account changed.');
  return { ...createAuthHeaders(session.access_token), 'X-Practice-Owner': owner };
}

/**
 * Keeps one adaptive exam per student. Every change is saved in this browser at once and,
 * for a signed-in student, copied to the account so the exam can continue on another device.
 */
export function useAdaptiveExam(owner: string, account: boolean) {
  const [state, setState] = useState<AdaptiveState | null>(() => readLocal(owner));
  const [sync, setSync] = useState<AdaptiveSync>(account ? 'loading' : 'device');
  const [storageError, setStorageError] = useState('');
  const [reload, setReload] = useState(0);
  const current = useRef(state), lastTick = useRef<number | null>(null), unsaved = useRef(false), saving = useRef<Promise<void> | null>(null), ready = useRef(!account), timer = useRef<number | undefined>(undefined), again = useRef<() => Promise<void>>(() => Promise.resolve());

  const keep = useCallback((next: AdaptiveState | null) => {
    current.current = next;
    try { if (next) localStorage.setItem(storageKey(owner), JSON.stringify(next)); else localStorage.removeItem(storageKey(owner)); setStorageError(''); }
    catch { setStorageError('This browser could not save your exam. Keep this page open so your progress is not lost.'); }
    setState(next);
  }, [owner]);

  const push = useCallback((): Promise<void> => {
    if (!account || !ready.current) return Promise.resolve();
    if (saving.current) { unsaved.current = true; return saving.current; }
    const snapshot = current.current;
    if (!snapshot) return Promise.resolve();
    unsaved.current = false; setSync('saving');
    const run = (async () => {
      try {
        const result = await requestApi<{ state: unknown }>(path, { method: 'PUT', headers: await accountHeaders(owner), body: JSON.stringify({ state: snapshot }) });
        const saved = parseAdaptiveState(result.state);
        // Another device may hold more answers; continue from that copy.
        if (saved && compareAdaptiveStates(saved, current.current) > 0) { lastTick.current = null; keep(saved); }
        setSync('saved');
      } catch (error) {
        console.warn('Adaptive exam account sync failed:', error instanceof Error ? error.message : 'Unknown error');
        unsaved.current = true; setSync('offline');
      } finally { saving.current = null; }
    })();
    saving.current = run;
    // An answer given while this save was in flight is sent right after it.
    return run.then(() => { if (unsaved.current && navigator.onLine !== false) { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => { void again.current(); }, 4000); } });
  }, [account, keep, owner]);
  useEffect(() => { again.current = push; }, [push]);

  const update = useCallback((change: (state: AdaptiveState | null) => AdaptiveState | null) => {
    const now = Date.now(), previous = current.current;
    const timed = previous && lastTick.current !== null ? addAdaptiveTime(previous, now - lastTick.current) : previous;
    const next = change(timed);
    lastTick.current = next && !next.finished && document.visibilityState === 'visible' ? now : null;
    keep(next);
    // Selecting a choice stays on this device; answers, mode changes and finishing go to the account.
    const progressed = !previous || !next || previous.seed !== next.seed || previous.asked !== next.asked || previous.finished !== next.finished || previous.mode !== next.mode || previous.submitted !== next.submitted;
    if (account && next && progressed) { unsaved.current = true; window.clearTimeout(timer.current); timer.current = window.setTimeout(() => { void push(); }, 1200); }
  }, [account, keep, push]);

  // Load the account copy before a new exam can be started, so a new device never replaces saved progress.
  useEffect(() => {
    if (!account) return;
    let active = true;
    (async () => {
      try {
        const result = await requestApi<{ state: unknown }>(path, { headers: await accountHeaders(owner) });
        if (!active) return;
        const remote = parseAdaptiveState(result.state);
        ready.current = true;
        if (remote && compareAdaptiveStates(remote, current.current) > 0) { lastTick.current = null; keep(remote); setSync('saved'); }
        else if (current.current && compareAdaptiveStates(current.current, remote) > 0) { unsaved.current = true; void push(); }
        else setSync('saved');
      } catch (error) {
        console.warn('Adaptive exam could not load account progress:', error instanceof Error ? error.message : 'Unknown error');
        if (active) setSync(current.current ? 'offline' : 'unavailable');
        // A copy already on this device can keep going and will be merged when the account is reachable.
        if (active && current.current) ready.current = true;
      }
    })();
    return () => { active = false; };
  }, [account, keep, owner, push, reload]);

  useEffect(() => {
    const pause = () => { if (document.visibilityState === 'visible') { lastTick.current = current.current && !current.current.finished ? Date.now() : null; return; } update(value => value); lastTick.current = null; };
    const hide = () => { update(value => value); lastTick.current = null; };
    const online = () => { if (unsaved.current) void push(); };
    document.addEventListener('visibilitychange', pause); window.addEventListener('pagehide', hide); window.addEventListener('online', online);
    const retry = window.setInterval(() => { if (unsaved.current && !saving.current) void push(); }, 30000);
    return () => { document.removeEventListener('visibilitychange', pause); window.removeEventListener('pagehide', hide); window.removeEventListener('online', online); window.clearInterval(retry); window.clearTimeout(timer.current); };
  }, [push, update]);

  /** Start or stop the question clock when the student enters or leaves the question screen. */
  const setClock = useCallback((running: boolean) => { if (!running) update(value => value); lastTick.current = running && current.current && !current.current.finished && document.visibilityState === 'visible' ? Date.now() : null; }, [update]);
  /** Send the latest progress to the account now (used before leaving the exam). */
  const flush = useCallback(async () => { window.clearTimeout(timer.current); update(value => value); if (account && current.current) { unsaved.current = true; await push(); } }, [account, push, update]);
  const retry = useCallback(() => { setSync('loading'); setReload(value => value + 1); }, []);
  return { state, update, sync, storageError, flush, retry, setClock };
}
