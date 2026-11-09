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
    const destination = template.destination || template.existingModuleOnly
      ? next.modules.find(module => module.id === template.moduleId)
      : next.modules.find(module => !practiceModuleKind(module) && module.generatorIds.includes(template.id));
    if (!destination || !managedGeneratorIds(destination, next).includes(template.id)) throw new Error(`The destination does not include ${template.id}. Review its placement without replacing existing selections.`);
  }
  return next;
}

function addBuiltinPractice(catalog, template, resolveCatalog) {
  const defaults = typeof resolveCatalog==='function'?resolveCatalog(defaultPracticeCatalog()):defaultPracticeCatalog(), next = structuredClone(catalog);
  const generator = defaults.generators.find(item => item.id === template.id);
  if (template.destination) {
    const target = template.destination;
    const parent = next.modules.find(module => module.id === target.parentId);
    const isTopicGroup = target.parentId === null;
    if (!generator || (!isTopicGroup && (!parent || practiceModuleKind(parent) !== target.groupType || parent.category !== template.category || parent.topic !== template.topic))) throw new Error(`Stale destination parent for ${template.requestId}: reload the plan.`);
    let destination = next.modules.find(module => module.id === target.moduleId);
    if (!destination) {
      if (!target.create || isTopicGroup) throw new Error(`Missing exact destination ${target.moduleId}; no replacement was created.`);
      // A stable batch ID is used for new modules. Never reuse a teacher's similarly named module by inference.
      if (next.modules.some(module => module.parentId === parent.id && module.title === target.moduleTitle)) throw new Error(`A module named ${target.moduleTitle} already exists under this parent. Resolve its exact ID before registration.`);
      destination = {id:target.moduleId,title:target.moduleTitle,titleMode:'custom',description:target.moduleTitle,category:template.category,topic:template.topic,skilled:template.skilled??'TBD',parentId:parent.id,published:false,includeAll:false,generatorIds:[]};
      next.modules.push(destination);
    }
    if ((isTopicGroup ? practiceModuleKind(destination) !== target.groupType || destination.parentId != null : practiceModuleKind(destination) || destination.parentId !== parent.id) || destination.category !== template.category || destination.topic !== template.topic) throw new Error(`Stale exact destination ${target.moduleId}; its classification or parent changed.`);
    const existing = next.generators.find(item => item.id === generator.id);
    if (existing && (existing.builtinId !== generator.id || existing.category !== template.category || existing.topic !== template.topic)) throw new Error(`Generator ID ${generator.id} is already used by a different definition.`);
    if (!existing) next.generators.push({...generator,category:template.category,topic:template.topic,enabled:false,reviewStatus:'unreviewed',difficulty:template.difficulty??'unassigned',skilled:template.skilled??'TBD',sourceQuestionIds:[template.sourceId]});
    if (!destination.generatorIds.includes(generator.id)) destination.generatorIds.push(generator.id);
    validatePracticeCatalog(next);
    return next;
  }
  // Exact existing destinations must never create a replacement or edit curated selections.
  // Automatic topic groups include enabled generators without editing selections.
  if (template.existingModuleOnly) {
    const destination = next.modules.find(item => item.id === template.moduleId);
    if (!generator || !destination) throw new Error(`Missing generator or exact existing module ${template.moduleId}. Reload the destination; no replacement was created.`);
    if (destination.category !== generator.category || destination.topic !== generator.topic || practiceModuleKind(destination) !== template.groupType || !['general','foundation'].includes(template.groupType)) throw new Error('The exact destination must match the requested practice group in the generator’s current category and topic.');
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
// Only explicit, validated batch requests authorize module publication.
function publishBuiltinDestinations(catalog, templates) {
  const next=structuredClone(catalog);
  for (const template of templates.filter(item=>item.publishAfterValidation)) {
    const destination=next.modules.find(module=>module.id===template.moduleId);
    const generator=next.generators.find(item=>item.id===template.id);
    if (!template.destination || !destination || !generator?.enabled || !managedGeneratorIds(destination,next).includes(template.id)) throw new Error(`Cannot publish an unavailable requested generator ${template.id}.`);
    const parent=next.modules.find(module=>module.id===destination.parentId);
    if (!parent && !(template.destination.parentId === null && practiceModuleKind(destination) === template.destination.groupType && destination.parentId == null)) throw new Error(`Missing discovery parent for ${destination.id}.`);
    destination.published=true;if(parent)parent.published=true;
  }
  return next;
}
// Optional mixed review uses existing recommendation support without changing topic membership.
function addRecommendedPractice(catalog, request) {
  if (!request) return catalog;
  if (request.module.generatorIds.some(id=>!catalog.generators.some(generator=>generator.id===id))) throw new Error('A mixed review references an unregistered generator.');
  const next=structuredClone(catalog);
  next.recommended??=[];
  let category=next.recommended.find(item=>item.id===request.id);
  if (!category) {category={id:request.id,title:request.title,modules:[]};next.recommended.push(category);}
  if (category.title!==request.title) throw new Error('The mixed-review category already has different saved details.');
  const existing=category.modules.find(item=>item.id===request.module.id);
  if (existing&&!isDeepStrictEqual(existing,request.module)) throw new Error('The mixed-review module already has different saved selections.');
  if (!existing) category.modules.push(structuredClone(request.module));
  return next;
}
async function registerBuiltinPractices(templates, recommended) {
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
  const enabled = enable ? enableBuiltinPractices(registered,templates) : registered;
  if (recommended?.module.generatorIds.some(id=>!templates.some(template=>template.id===id))) throw new Error('A new mixed review may include only generators from this batch.');
  const catalog = validatePracticeCatalog(addRecommendedPractice(process.argv.includes('--publish-validated') ? publishBuiltinDestinations(enabled,templates) : enabled,recommended),taxonomy);
  if (templates.some(template=>template.destination)) {
    if (!previous) throw new Error('Exact batch destinations require a saved catalog.');
    const requested=new Set(templates.map(template=>template.id));
    const published=new Set(process.argv.includes('--publish-validated')?templates.filter(t=>t.publishAfterValidation).flatMap(t=>[t.moduleId,t.destination.parentId]):[]);
    const expectedModules=previous.modules.map(module=>{
      const additions=templates.filter(t=>t.moduleId===module.id).map(t=>t.id);
      return {...module,...(published.has(module.id)?{published:true}:{}),generatorIds:[...new Set([...module.generatorIds,...additions])]};
    });
    const expectedGenerators=previous.generators.map(generator=>enable&&requested.has(generator.id)?{...generator,enabled:true}:generator);
    if (!isDeepStrictEqual(expectedModules,catalog.modules.filter(module=>previous.modules.some(old=>old.id===module.id))) || !isDeepStrictEqual(expectedGenerators,catalog.generators.filter(generator=>previous.generators.some(old=>old.id===generator.id))) || !isDeepStrictEqual(previous.videos,catalog.videos)) throw new Error('Batch registration would change unrelated saved resources. Inspect the catalog before applying.');
  }
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
  const resources=templates.map(template=>{const module=template.destination||template.existingModuleOnly?catalog.modules.find(module=>module.id===template.moduleId):catalog.modules.find(module=>!practiceModuleKind(module)&&module.generatorIds.includes(template.id));const generator=catalog.generators.find(item=>item.id===template.id);return{requestId:template.requestId,generator:template.id,module:module?.id,category:module?.category,topic:module?.topic,enabled:generator?.enabled,published:module?.published,parentPublished:catalog.modules.find(item=>item.id===module?.parentId)?.published,reviewStatus:generator?.reviewStatus,...(template.destination||template.existingModuleOnly?{destination:module,definition:generator}:{})};});
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'read-only-preview', changed, saved: apply && changed, revision: revision + Number(apply && changed), ...(recommended?{recommended}:{}), ...(resources.length===1?resources[0]:{resources}) }, null, 2));
  });
}

module.exports = { addBuiltinPractice, addRecommendedPractice, enableBuiltinPractices, publishBuiltinDestinations, registerBuiltinPractice, registerBuiltinPractices };
