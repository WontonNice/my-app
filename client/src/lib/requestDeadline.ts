export class RequestTimeoutError extends Error {
  constructor() {
    super("The server took too long to respond. Please try again.");
    this.name = "RequestTimeoutError";
  }
}

// A request gets one budget, including session lookup, retries and response bodies.
export async function withRequestDeadline<T>(
  signal: AbortSignal | null | undefined,
  run: (signal: AbortSignal) => Promise<T>,
  timeoutMs = 15_000,
): Promise<T> {
  const controller = new AbortController();
  const abortFromCaller = () => controller.abort(signal?.reason);
  if (signal?.aborted) abortFromCaller();
  else signal?.addEventListener("abort", abortFromCaller, { once: true });
  const timeout = globalThis.setTimeout(() => controller.abort(new RequestTimeoutError()), timeoutMs);
  let onAbort: () => void = () => {};
  try {
    return await Promise.race([
      new Promise<never>((_resolve, reject) => {
        onAbort = () => reject(controller.signal.reason);
        if (controller.signal.aborted) onAbort();
        else controller.signal.addEventListener("abort", onAbort, { once: true });
      }),
      Promise.resolve().then(() => {
        controller.signal.throwIfAborted();
        return run(controller.signal);
      }),
    ]);
  } finally {
    globalThis.clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromCaller);
    controller.signal.removeEventListener("abort", onAbort);
  }
}
