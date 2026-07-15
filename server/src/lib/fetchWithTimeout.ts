export async function fetchWithTimeout(
    input: string | URL | globalThis.Request,
    init: RequestInit = {},
    timeoutMs = 5_000,
) {
    const controller = new AbortController();
    const abortFromCaller = () => controller.abort(init.signal?.reason);

    if (init.signal?.aborted) {
        abortFromCaller();
    } else {
        init.signal?.addEventListener("abort", abortFromCaller, { once: true });
    }

    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(input, { ...init, signal: controller.signal });
    } finally {
        clearTimeout(timeout);
        init.signal?.removeEventListener("abort", abortFromCaller);
    }
}
