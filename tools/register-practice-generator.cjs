// Register one built-in generator without replacing teacher resources.
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');
const serverRequire = require('node:module').createRequire(path.resolve(__dirname, '../server/package.json'));
serverRequire('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { defaultPracticeCatalog, validatePracticeCatalog, ensureTopicPracticeModules, reconcilePracticeTaxonomy, practiceModuleKind, managedGeneratorIds } = require('../server/src/shared/practiceCatalog.ts');

// Explicit activation changes only the requested generators, leaving review and publication alone.
function enableBuiltinPractices(catalog, templates) {
  const requested = new Set(templates.map(template => template.id));
  for (const id of requested) if (!catalog.generators.some(generator => generator.id === id)) throw new Error(`Cannot enable missing generator ${id}.`);
  const next = {...catalog, generators:catalog.generators.map(generator => requested.has(generator.id) ? {...generator, enabled:true} : generator)};
  for (const template of templates) {
    const destination = template.existingModuleOnly
      ? next.modules.find(module => module.id === template.moduleId)
      : next.modules.find(module => !practiceModuleKind(module) && module.generatorIds.includes(template.id));
    if (!destination || !managedGeneratorIds(destination, next).includes(template.id)) throw new Error(`The destination does not include ${template.id}. Review its placement without replacing existing selections.`);
  }
  return next;
}

function addBuiltinPractice(catalog, template, resolveCatalog) {
  const defaults = typeof resolveCatalog==='function'?resolveCatalog(defaultPracticeCatalog()):defaultPracticeCatalog(), next = structuredClone(catalog);
  const generator = defaults.generators.find(item => item.id === template.id);
  // Exact existing destinations must never create a replacement or edit curated selections.
  // Automatic topic groups include enabled generators without editing selections.
  if (template.existingModuleOnly) {
    const destination = next.modules.find(item => item.id === template.moduleId);
    if (!generator || !destination) throw new Error(`Missing generator or exact existing module ${template.moduleId}. Reload the destination; no replacement was created.`);
    if (destination.category !== generator.category || destination.topic !== generator.topic || practiceModuleKind(destination) !== template.groupType || !['general','foundation'].includes(template.groupType)) throw new Error('The exact destination must match the requested practice group in the generator’s current category and topic.');
    if (template.groupType === 'foundation' && !destination.includeAll) throw new Error('The exact Foundation Building destination now has a curated selection. Reload and review its placement before registration; no selections were changed.');
    if (!next.generators.some(item => item.id === generator.id)) next.generators.push({...generator, enabled:false, reviewStatus:'unreviewed', skilled:'TBD'});
    validatePracticeCatalog(next);
    return next;
  }
  const module = defaults.modules.find(item => !practiceModuleKind(item) && item.generatorIds.includes(template.id)) ?? defaults.modules.find(item => item.id === (template.moduleId??template.sourceId));
  if (!generator || !module) throw new Error('This built-in generator needs a registered practice module.');
  const added=!next.generators.some(item => item.id === generator.id);
  if (added) next.generators.push(generator);
  const existing=(module.skillId?next.modules.find(item=>item.skillId===module.skillId):undefined)??next.modules.find(item=>item.id===module.id&&(!module.skillId||!item.skillId||item.skillId===module.skillId));
  if (!existing&&added){
    const parentKind=practiceModuleKind(defaults.modules.find(parent=>parent.id===module.parentId)??{});
    const parent=next.modules.find(parent=>practiceModuleKind(parent)===parentKind&&parent.category===module.category&&parent.topic===module.topic);
    const moduleId=next.modules.some(item=>item.id===module.id)&&module.skillId?module.skillId:module.id;
    next.modules.push({...module,id:moduleId,parentId:parent?.id??module.parentId,generatorIds:module.generatorIds.filter(id=>next.generators.some(generator=>generator.id===id))});
  }
  else if(existing&&added&&!existing.generatorIds.includes(generator.id))existing.generatorIds.push(generator.id);
  validatePracticeCatalog(next);
  return ensureTopicPracticeModules(next);
}

async function registerBuiltinPractice(template) {
  return registerBuiltinPractices([template]);
}
async function registerBuiltinPractices(templates) {
  serverRequire('dotenv').config({ path: [path.resolve(__dirname, '../server/.env'), path.resolve(__dirname, '../.env')], quiet: true });
  const { supabase } = require('../server/src/lib/supabase.ts');
  const {mathCommandRoot,readMathCommandState,readMathCommandTaxonomy}=require('../server/src/lib/mathCommandCatalogStore.ts');
  const {withMathCommandPersistence}=require('../server/src/lib/mathCommandPersistence.ts');
  return withMathCommandPersistence(mathCommandRoot,async()=>{
  const stored = await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id', 'main').maybeSingle();
  if (stored.error) throw new Error(`Cannot read the practice catalog: ${stored.error.message}`);
  const previous = stored.data?.catalog;
  const taxonomy=readMathCommandTaxonomy(),renames=readMathCommandState().taxonomyTopicRenames;
  const resolveCatalog=catalog=>reconcilePracticeTaxonomy(catalog,taxonomy,renames);
  const enable = process.argv.includes('--enable');
  const registered = previous ? templates.reduce((current,template)=>addBuiltinPractice(current,template,resolveCatalog),resolveCatalog(previous)) : resolveCatalog(defaultPracticeCatalog());
  const catalog = validatePracticeCatalog(enable ? enableBuiltinPractices(registered,templates) : registered,taxonomy);
  if (templates.some(template=>template.existingModuleOnly)) {
    if (!previous) throw new Error('Exact existing-module registration requires a saved catalog.');
    const requested=new Set(templates.map(template=>template.id));
    const expectedExisting = previous.generators.map(generator=>enable&&requested.has(generator.id)?{...generator,enabled:true}:generator);
    if (!isDeepStrictEqual(previous.modules,catalog.modules) || !isDeepStrictEqual(previous.videos,catalog.videos) || !isDeepStrictEqual(expectedExisting,catalog.generators.filter(generator=>!requested.has(generator.id)||previous.generators.some(item=>item.id===generator.id)))) throw new Error('Registration would change existing resources. Resolve the catalog differences before registering.');
  }
  const changed = !previous || !isDeepStrictEqual(previous, catalog);
  const apply = process.argv.includes('--apply');
  const revision = stored.data?.revision ?? 0;
  if (apply && changed) {
    const row = { id: 'main', catalog, revision: revision + 1, updated_at: new Date().toISOString() };
    const saved = !stored.data
      ? await supabase.from('infinite_practice_catalog').insert(row).select('revision').maybeSingle()
      : await supabase.from('infinite_practice_catalog').update(row).eq('id', 'main').eq('revision', revision).select('revision').maybeSingle();
    if (saved.error || !saved.data) throw new Error(saved.error?.message ?? 'Another window saved changes. Run this command again to use the latest revision.');
  }
  const resources=templates.map(template=>{const module=template.existingModuleOnly?catalog.modules.find(module=>module.id===template.moduleId):catalog.modules.find(module=>!practiceModuleKind(module)&&module.generatorIds.includes(template.id));const generator=catalog.generators.find(item=>item.id===template.id);return{generator:template.id,module:module?.id,category:module?.category,topic:module?.topic,enabled:generator?.enabled,reviewStatus:generator?.reviewStatus,...(template.existingModuleOnly?{destination:module,definition:generator,existingResourcesUnchanged:true}:{})};});
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'read-only-preview', changed, saved: apply && changed, revision: revision + Number(apply && changed), ...(resources.length===1?resources[0]:{resources}) }, null, 2));
  });
}

module.exports = { addBuiltinPractice, enableBuiltinPractices, registerBuiltinPractice, registerBuiltinPractices };
