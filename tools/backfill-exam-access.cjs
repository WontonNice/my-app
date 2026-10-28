// Run against a snapshot of the CURRENT running server's assessments.json before replacing it.
// Defaults to validation/dry-run. Existing durable settings are never overwritten.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const serverRequire = createRequire(path.resolve(__dirname, '../server/package.json'));
async function main() {
  const source = process.argv.find(value => value.startsWith('--file='))?.slice(7);
  if (!source) throw new Error('Use --file=/path/to/current-assessments.json [--apply]. The snapshot must come from the currently running environment whose settings you want to preserve.');
  const input = JSON.parse(fs.readFileSync(path.resolve(source), 'utf8'));
  const catalog = Array.isArray(input) ? input : input.assessments;
  if (!Array.isArray(catalog)) throw new Error('Expected an assessment array or teacher API response.');
  const rows = catalog.map(item => {
    if (!item || typeof item.id !== 'string' || !item.id || item.id.length > 300 || !['open', 'locked'].includes(item.status)) throw new Error('Invalid assessment snapshot.');
    const fallback = item.status === 'open';
    return { assessment_id: item.id, english_open: typeof item.sectionAccess?.english === 'boolean' ? item.sectionAccess.english : fallback, math_open: typeof item.sectionAccess?.math === 'boolean' ? item.sectionAccess.math : fallback, allow_completed_access: item.allowCompletedAccess === true, corrections_open: item.correctionsOpen === true };
  });
  if (new Set(rows.map(row => row.assessment_id)).size !== rows.length) throw new Error('Duplicate exam IDs in snapshot.');
  if (!process.argv.includes('--apply')) { console.log(`Dry run: ${rows.length} exam settings; ${rows.filter(row => row.english_open || row.math_open).length} open. No database changes.`); return; }
  serverRequire('dotenv').config({ path: path.resolve(__dirname, '../server/.env'), quiet: true });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Set the intended environment’s Supabase server credentials.');
  const db = serverRequire('@supabase/supabase-js').createClient(url, key);
  for (let offset = 0; offset < rows.length; offset += 100) {
    const result = await db.from('assessment_access').upsert(rows.slice(offset, offset + 100), { onConflict: 'assessment_id', ignoreDuplicates: true });
    if (result.error) throw new Error('Could not import settings. Apply the migration first and check the intended database connection.');
  }
  console.log(`Imported missing settings for ${rows.length} exams. Existing durable settings were preserved.`);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
