type PollOptions = {
  intervalMs: number;
  immediate?: boolean;
  minIntervalMs?: number;
  maxRetryMs?: number;
};

/** One request at a time, suspended while hidden, with bounded failure backoff.
 * Stop waits for the outstanding request so lease cleanup cannot race its write.
 */
export function startVisiblePolling(task: () => Promise<unknown>, options: PollOptions): () => Promise<void> {
  let active = true, pageHidden = false, failures = 0, lastStarted = -Infinity;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: Promise<void> | undefined;
  const visible = () => active && !pageHidden && document.visibilityState === "visible";
  const clear = () => { clearTimeout(timer); timer = undefined; };
  const schedule = (delay: number) => {
    clear();
    if (visible()) timer = setTimeout(run, delay);
  };
  function run() {
    clear();
    if (!visible() || pending) return;
    const remaining = (options.minIntervalMs ?? 0) - (Date.now() - lastStarted);
    if (remaining > 0) { schedule(remaining); return; }
    lastStarted = Date.now();
    pending = Promise.resolve().then(() => { if (visible()) return task(); }).then(
      () => { failures = 0; },
      () => { failures = Math.min(failures + 1, 6); },
    ).finally(() => {
      pending = undefined;
      schedule(Math.min(options.intervalMs * 2 ** failures, Math.max(options.intervalMs, options.maxRetryMs ?? 30_000)));
    });
  }
  const visibilityChanged = () => { if (visible()) run(); else clear(); };
  const pageHide = () => { pageHidden = true; clear(); };
  const pageShow = () => { pageHidden = false; visibilityChanged(); };
  document.addEventListener("visibilitychange", visibilityChanged);
  window.addEventListener("pagehide", pageHide);
  window.addEventListener("pageshow", pageShow);
  if (options.immediate !== false) run(); else schedule(options.intervalMs);
  return () => {
    active = false;
    clear();
    document.removeEventListener("visibilitychange", visibilityChanged);
    window.removeEventListener("pagehide", pageHide);
    window.removeEventListener("pageshow", pageShow);
    return pending ?? Promise.resolve();
  };
}
