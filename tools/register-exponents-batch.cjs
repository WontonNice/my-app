// Dry-run by default. Uses the same revision and review gates as Content Studio.
const assert = require('node:assert/strict');
const {addBuiltinPractice} = require('./register-practice-generator.cjs');
const {exponentsPractice: templates} = require('../server/src/shared/exponentsPractice.ts');
const {handlePracticeCatalogRequest} = require('./practice-catalog-service.cjs');

function registerExponents(catalog) {
  let next = catalog;
  for (const template of templates) {
    const exists = next.generators.some(g => g.id === template.id);
    next = addBuiltinPractice(next, template);
    if (!exists) next.generators = next.generators.map(g => g.id === template.id ? {...g, skills: [], reviewRequired: true} : g);
  }
  assert.deepEqual(next.videos, catalog.videos, 'Existing videos must be preserved.');
  for (const g of catalog.generators) assert.deepEqual(next.generators.find(row => row.id === g.id), g, 'Existing generators must be preserved.');
  for (const m of catalog.modules) {
    const expected = m.id === templates[0].moduleId ? {...m, generatorIds: [...new Set([...m.generatorIds, ...templates.map(t => t.id)])]} : m;
    assert.deepEqual(next.modules.find(row => row.id === m.id), expected, 'Existing module settings must be preserved.');
  }
  return next;
}
async function main() {
  if (process.argv.includes('--enable') || process.argv.includes('--publish-validated')) throw Error('Register disabled first, then preview and approve in Practice Studio.');
  const root = require('node:path').resolve(__dirname, '..');
  const current = await handlePracticeCatalogRequest({method: 'GET', root});
  const catalog = registerExponents(current.catalog);
  const changed = !require('node:util').isDeepStrictEqual(catalog, current.catalog), apply = process.argv.includes('--apply');
  const result = apply && changed ? await handlePracticeCatalogRequest({method: 'PUT', root, body: {catalog, revision: current.revision}}) : {...current, catalog};
  console.log(JSON.stringify({mode: apply ? 'apply' : 'read-only-preview', changed, saved: apply && changed, revision: result.revision,
    module: result.catalog.modules.find(m => m.id === templates[0].moduleId),
    generators: result.catalog.generators.filter(g => templates.some(t => t.id === g.id))}, null, 2));
}
if (require.main === module) main().catch(error => {console.error(error.message); process.exitCode = 1;});
module.exports = {registerExponents, templates};
