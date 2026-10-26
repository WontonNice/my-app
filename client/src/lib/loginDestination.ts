/** Keep only same-origin absolute paths; authentication destinations must never be external. */
export function loginDestination(search: string, fallback: string) {
  const next = new URLSearchParams(search).get('next');
  if (!next || !next.startsWith('/') || next.startsWith('//') || /[\\\r\n]/.test(next)) return fallback;
  try { const url = new URL(next, 'https://local.invalid'); return url.origin === 'https://local.invalid' ? url.pathname + url.search + url.hash : fallback; } catch { return fallback; }
}
