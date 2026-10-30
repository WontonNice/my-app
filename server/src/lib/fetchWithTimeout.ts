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
        const response = await fetch(input, { ...init, signal: controller.signal });
        // Keep the deadline active while reading the body as well as headers.
        // These server integrations return JSON; none stream to the caller.
        const body = response.body ? await response.arrayBuffer() : null;
        return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
    } finally {
        clearTimeout(timeout);
        init.signal?.removeEventListener("abort", abortFromCaller);
    }
}
