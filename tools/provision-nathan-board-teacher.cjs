// Targeted, manual repair for the existing Nathan Im teacher account.
// Dry run by default. --apply requires explicit authorization from the owner.
const path = require('node:path');
const serverRoot = path.resolve(__dirname, '../server');
require(require.resolve('dotenv', { paths: [serverRoot] })).config({ path: path.join(serverRoot, '.env'), quiet: true });
const { createClient } = require(require.resolve('@supabase/supabase-js', { paths: [serverRoot] }));
const accountId = 'b76fdb28-cb6c-4573-ba51-1ff3d50c855c';
async function run() {
  const url = process.env.SUPABASE_URL;
  if (!url || new URL(url).hostname !== 'juxcuposhxsmokqrszbh.supabase.co') throw new Error('Unexpected project.');
  const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const result = await db.auth.admin.getUserById(accountId);
  const user = result.data.user;
  if (result.error || !user || (user.user_metadata.full_name || user.user_metadata.name) !== 'Nathan Im' || user.user_metadata.role !== 'teacher') throw new Error('The verified legacy teacher account does not match.');
  if (user.app_metadata.role === 'teacher') { console.log('Nathan Im already has the trusted teacher role.'); return; }
  if (user.app_metadata.role) throw new Error('A different trusted role exists; manual review required.');
  console.log('Proposed repair: Nathan Im -> app_metadata.role = teacher; preserve all other metadata.');
  if (!process.argv.includes('--apply')) { console.log('Dry run only.'); return; }
  const updated = await db.auth.admin.updateUserById(accountId, { app_metadata: { ...user.app_metadata, role: 'teacher' } });
  if (updated.error || updated.data.user?.app_metadata.role !== 'teacher') throw new Error('Role update failed.');
  console.log('Trusted teacher role saved for Nathan Im.');
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
