// Register one built-in generator without replacing teacher resources.
const path = require('node:path');
const serverRequire = require('node:module').createRequire(path.resolve(__dirname, '../server/package.json'));
serverRequire('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { defaultPracticeCatalog, validatePracticeCatalog } = require('../server/src/shared/practiceCatalog.ts');

function addBuiltinPractice(catalog, template) {
  const defaults = defaultPracticeCatalog(), next = structuredClone(catalog);
  const generator = defaults.generators.find(item => item.id === template.id);
  const module = defaults.modules.find(item => item.id === template.sourceId);
  if (!generator || !module) throw new Error('This built-in generator needs a registered practice module.');
  if (!next.generators.some(item => item.id === generator.id)) next.generators.push(generator);
  if (!next.modules.some(item => item.id === module.id)) next.modules.push(module);
  validatePracticeCatalog(next);
  return next;
}

async function registerBuiltinPractice(template) {
  serverRequire('dotenv').config({ path: [path.resolve(__dirname, '../server/.env'), path.resolve(__dirname, '../.env')], quiet: true });
  const { supabase } = require('../server/src/lib/supabase.ts');
  const stored = await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id', 'main').maybeSingle();
  if (stored.error) throw new Error(`Cannot read the practice catalog: ${stored.error.message}`);
  const previous = stored.data?.catalog;
  const catalog = previous ? addBuiltinPractice(previous, template) : defaultPracticeCatalog();
  const changed = !previous || JSON.stringify(previous) !== JSON.stringify(catalog);
  const apply = process.argv.includes('--apply');
  const revision = stored.data?.revision ?? 0;
  if (apply && changed) {
    const row = { id: 'main', catalog, revision: revision + 1, updated_at: new Date().toISOString() };
    const saved = revision === 0
      ? await supabase.from('infinite_practice_catalog').insert(row).select('revision').maybeSingle()
      : await supabase.from('infinite_practice_catalog').update(row).eq('id', 'main').eq('revision', revision).select('revision').maybeSingle();
    if (saved.error || !saved.data) throw new Error(saved.error?.message ?? 'Another window saved changes. Run this command again to use the latest revision.');
  }
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'read-only-preview', changed, saved: apply && changed, revision: revision + Number(apply && changed), generator: template.id, module: template.sourceId, category: 'Algebra', topic: 'Inequalities' }, null, 2));
}

module.exports = { addBuiltinPractice, registerBuiltinPractice };
