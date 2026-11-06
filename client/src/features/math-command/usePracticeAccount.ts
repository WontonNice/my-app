import { useEffect, useState } from 'react';
import { createAuthHeaders, requestApi } from '../../lib/api';
import { getActiveSession } from '../../lib/sessionCache';
import { comparePracticeSessions, type PracticeCheckpoint } from '../../../../server/src/shared/practiceCheckpoint';
import { localCheckpoint, localPracticeModules, practiceCheckpointEvent, practiceProgressEvent, restoreCheckpoint } from './practiceSessionStorage';

type SyncStatus = 'loading' | 'saving' | 'saved' | 'offline' | 'unavailable';
const active = new Map<string, ReturnType<typeof connect>>();
const path = '/api/infinite-practice/progress';

function connect(owner: string) {
  const listeners = new Set<(status: SyncStatus) => void>();
  const pending = new Set<string>();
  let hydrated = false;
  let status: SyncStatus = 'loading';
  let download = true, running = false, closed = false;
  const waiting = new Set<() => void>();
  function report(next: SyncStatus) {
    status = next;
    listeners.forEach(listener => listener(next));
  }
  async function sync() {
    if (running || closed) return;
    running = true;
    try {
      const auth = await getActiveSession();
      if (auth?.user.id !== owner) throw new Error('Account changed');
      const headers = { ...createAuthHeaders(auth.access_token), 'X-Practice-Owner': owner };
      do {
        if (download) {
          download = false;
          const remaining = localPracticeModules(localStorage, owner);
          for (let page = 0; !closed; page++) {
            const rows = await requestApi<PracticeCheckpoint[]>(path+'?page='+page, { headers });
            if (closed) return;
            for (const row of rows) {
              const next = restoreCheckpoint(localStorage, owner, row);
              if (next.best > row.best || comparePracticeSessions(next.session, row.session) > 0) pending.add(row.moduleId);
              remaining.delete(row.moduleId);
            }
            if (rows.length < 50) break;
          }
          hydrated = true;
          remaining.forEach(id => pending.add(id));
          window.dispatchEvent(new Event(practiceProgressEvent));
        }
        if (pending.size) report('saving');
        for (const id of pending) {
          if (closed) return;
          pending.delete(id);
          const record = localCheckpoint(localStorage, owner, id);
          if (!record.session && !record.best) continue;
          const saved = await requestApi<PracticeCheckpoint>(path, { method: 'PUT', headers, body: JSON.stringify(record) });
          if (closed) return;
          restoreCheckpoint(localStorage, owner, saved);
        }
      } while (!closed && (download || pending.size));
      if (!closed) {
        window.dispatchEvent(new Event(practiceProgressEvent));
        report('saved');
      }
    } catch {
      download = true;
      if (!closed) report(hydrated ? 'offline' : 'unavailable');
    } finally {
      running = false;
      waiting.forEach(resolve => resolve());
      waiting.clear();
    }
  }
  const refresh = () => { download = true; void sync(); };
  const changed = (event: Event) => {
    const {owner: changedOwner, ids} = (event as CustomEvent<{owner:string;ids:string[]}>).detail;
    if (owner !== changedOwner) return;
    ids.forEach(id => pending.add(id));
    void sync();
  };
  window.addEventListener(practiceCheckpointEvent, changed);
  window.addEventListener('online', refresh);
  window.addEventListener('focus', refresh);
  const retry = window.setInterval(() => { if (status === 'offline' || status === 'unavailable') void sync(); }, 30000);
  void sync();
  return {
    flush(moduleId: string) {
      pending.add(moduleId);
      const flushed = new Promise<void>(resolve => waiting.add(resolve));
      void sync();
      return flushed;
    },
    subscribe(listener: (status: SyncStatus) => void) {
      listeners.add(listener);
      listener(status);
      return () => {
        listeners.delete(listener);
        if (listeners.size) return;
        closed = true;
        window.clearInterval(retry);
        window.removeEventListener(practiceCheckpointEvent, changed);
        window.removeEventListener('online', refresh);
        window.removeEventListener('focus', refresh);
        active.delete(owner);
      };
    },
  };
}

export function usePracticeAccount(owner?: string): SyncStatus {
  const [state, setState] = useState<{owner: string; status: SyncStatus}>();
  useEffect(() => {
    if (!owner) return;
    const sync = active.get(owner) ?? connect(owner);
    active.set(owner, sync);
    return sync.subscribe(status => setState({ owner, status }));
  }, [owner]);
  return owner && state?.owner === owner ? state.status : 'loading';
}

export function flushPracticeAccount(owner: string, moduleId: string) {
  return active.get(owner)?.flush(moduleId);
}
