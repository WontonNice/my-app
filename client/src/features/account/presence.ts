import { startVisiblePolling } from "../../lib/visiblePolling";
import { ACCOUNT_PRESENCE_INTERVAL_MS } from "../../../../server/src/shared/accountPresence";

/** A fresh lease for each page lifecycle prevents delayed cleanup from
 * deleting a restored page's presence or another tab's heartbeat.
 */
export function startAccountPresence(beat: (clientId: string) => Promise<unknown>, leave: (clientId: string) => Promise<unknown>) {
  let stopped = false;
  let stopCycle: (() => Promise<void>) | undefined;
  function start() {
    if (stopped || stopCycle) return;
    const clientId = crypto.randomUUID();
    let attempted = false;
    const stopPoll = startVisiblePolling(async () => {
      attempted = true;
      await beat(clientId);
    }, { intervalMs: ACCOUNT_PRESENCE_INTERVAL_MS, minIntervalMs: ACCOUNT_PRESENCE_INTERVAL_MS });
    stopCycle = async () => {
      await stopPoll();
      if (attempted) await leave(clientId).catch(() => {});
    };
  }
  function suspend() {
    const stop = stopCycle;
    stopCycle = undefined;
    return stop?.() ?? Promise.resolve();
  }
  const pageHide = () => { void suspend(); };
  window.addEventListener("pagehide", pageHide);
  window.addEventListener("pageshow", start);
  start();
  return () => {
    stopped = true;
    window.removeEventListener("pagehide", pageHide);
    window.removeEventListener("pageshow", start);
    return suspend();
  };
}
