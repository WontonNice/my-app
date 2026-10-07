// Read-only feature readiness check. LIMIT 0 avoids reading student records.
// Use GET rather than HEAD: an empty HEAD error body can make the SDK's error
// property null even when the HTTP status is 404.
const path = require('node:path');
const serverRoot = path.resolve(__dirname, '../server');
require(require.resolve('dotenv', { paths: [serverRoot] })).config({ path: path.join(serverRoot, '.env'), quiet: true });
const { createClient } = require(require.resolve('@supabase/supabase-js', { paths: [serverRoot] }));
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
const tables = ['student_learning_plans', 'student_assignments', 'student_boards', 'board_participants', 'board_revisions', 'board_assets'];
async function check() {
  if (!url || !key) throw new Error('Configure the existing server Supabase URL and service-role key.');
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const checks = await Promise.all(tables.map(async table => {
    const result = await db.from(table).select('*').limit(0).abortSignal(AbortSignal.timeout(10000));
    return { table, status: result.status, ready: result.status >= 200 && result.status < 300 && !result.error, code: result.error?.code ?? null };
  }));
  console.log(JSON.stringify({ project: new URL(url).hostname, ready: checks.every(check => check.ready), checks }, null, 2));
  if (checks.some(check => !check.ready)) process.exitCode = 1;
}
check().catch(() => { console.error('The storage readiness check could not reach Supabase. Verify server configuration and network connectivity.'); process.exitCode = 1; });
