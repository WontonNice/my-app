/**
 * Callers that overlap in time share one run of `work`; a call made after it settles starts a
 * new run. Nothing is cached once the run finishes, so results are never stale.
 */
export function shareInFlight<T>(work: () => Promise<T>): () => Promise<T> {
    let running: Promise<T> | null = null;
    return () => {
        if (!running) {
            const run = work();
            running = run;
            const release = () => { if (running === run) running = null; };
            run.then(release, release);
        }
        return running;
    };
}
