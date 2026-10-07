// Subscribe to a temporary internal channel without reading or writing boards.
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const root = path.resolve(__dirname, '../server');
require(require.resolve('dotenv', { paths: [root] })).config({ path: path.join(root, '.env'), quiet: true });
const { createClient } = require(require.resolve('@supabase/supabase-js', { paths: [root] }));
async function check(explicitAuth) {
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const db = createClient(process.env.SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
  if (explicitAuth) await db.realtime.setAuth(key);
  const channel = db.channel(`board-internal:readiness-${randomUUID()}`, { config: { private: true, broadcast: { self: false, ack: true } } });
  channel.on('broadcast', { event: 'signal' }, () => {});
  const outcome = await new Promise(resolve => {
    const timeout = setTimeout(() => resolve({ status: 'PROBE_TIMEOUT' }), 15000);
    channel.subscribe((status, error) => {
      if (['SUBSCRIBED', 'CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) {
        clearTimeout(timeout);
        resolve({ status, error: error?.message?.split(key).join('[redacted]').replace(/eyJ[A-Za-z0-9_.-]+/g, '[redacted]') });
      }
    });
  });
  await db.removeChannel(channel);
  db.realtime.disconnect();
  return { explicitAuth, ...outcome };
}
(async () => {
  const checks = await Promise.all([check(false), check(true)]);
  const ready = checks.every(check => check.status === 'SUBSCRIBED');
  console.log(JSON.stringify({ node: process.version, ready, checks }, null, 2));
  if (!ready) process.exitCode = 1;
})().catch(() => { console.error('Realtime readiness check failed.'); process.exitCode = 1; });
