const { setTimeout: delay } = require('node:timers/promises');

const DEFAULT_URL = 'http://127.0.0.1:8080/health';

/** Gate the combined dev command on the API listening, without waiting on its database. */
async function waitForApi({ url = DEFAULT_URL, timeoutMs = 60000, pollMs = 200, requestTimeoutMs = 1000 } = {}) {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    const controller = new AbortController();
    const remaining = Math.max(1, Math.ceil(deadline - performance.now()));
    const timer = setTimeout(() => controller.abort(), Math.min(requestTimeoutMs, remaining));
    try {
      const response = await fetch(url, { signal: controller.signal, redirect: 'error' });
      const body = response.ok ? await response.json() : null;
      if (!response.ok) await response.body?.cancel();
      if (body?.ok === true && body.status === 'up') return;
    } catch {
      // Refused connections and incomplete responses are normal while ts-node starts.
    } finally {
      clearTimeout(timer);
    }
    const pause = Math.min(pollMs, deadline - performance.now());
    if (pause > 0) await delay(pause);
  }
  throw new Error(`The API did not become available at ${url} within ${Math.ceil(timeoutMs / 1000)} seconds. Check the server output above; the frontend was not started.`);
}

module.exports = { waitForApi };

if (require.main === module) {
  const url = process.argv[2] || DEFAULT_URL;
  console.log('Waiting for the API to start before launching the frontend…');
  waitForApi({ url }).then(() => {
    console.log('API is ready. Starting the frontend.');
  }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
