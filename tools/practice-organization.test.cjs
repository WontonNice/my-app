const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require(require.resolve('ts-node',{paths:[path.resolve(__dirname,'../server')]})).register({transpileOnly:true,project:path.resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {defaultPracticeCatalog,validatePracticeCatalog,validateGenerator,managedGeneratorIds,practiceModuleKind}=require('../server/src/shared/practiceCatalog.ts');
const {organizePracticeCatalog,probabilitySkillGroups}=require('../server/src/shared/practiceOrganization.ts');
const {probabilityPractice}=require('../server/src/shared/probabilityPractice.ts');
const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
const {filterStudioGenerators,generatorModuleUsage,studioMatches,updateStudioGenerators}=require('../client/src/features/math-command/studioOrganization.ts');
const {practiceChildIsHidden,changePracticeChild}=require('../client/src/features/math-command/practiceChoices.ts');
const {generationSetEntries}=require('../client/src/features/math-command/generationSet.ts');
const {modulePreviewCatalog}=require('../client/src/features/math-command/generatorPreview.ts');
// This suite exercises the earlier Probability collection migration.
const taxonomy={categories:[{label:'Algebra',topics:['Inequalities']},{label:'Statistics and Probability',topics:['Probability','Overlapping Groups']},{label:'Ratios and Proportional Relationships',topics:['Rates & Unit Rates','Ratios & Proportions']}]};
const filters={status:'',difficulty:'',program:'',subject:''};
function legacy(){
  const catalog=defaultPracticeCatalog(taxonomy),ids=probabilityPractice.map(item=>item.id);
  const broad=catalog.modules.find(item=>item.id==='probability-foundation');
  catalog.modules=catalog.modules.filter(item=>!probabilitySkillGroups.some(group=>group.id===item.id));
  Object.assign(broad,{title:'Probability',generatorIds:ids});
  for(const generator of catalog.generators){delete generator.skills;delete generator.programs;delete generator.sourceQuestionIds;delete generator.difficulty;delete generator.reviewStatus;}
  return catalog;
}

test('organization reuses an existing skill module, splits the mixed collection, and preserves snapshots and teacher data',()=>{
  const catalog=legacy(),broad=catalog.modules.find(item=>item.id==='probability-foundation');
  const listing={...broad,id:'teacher-listing-outcomes',title:'Probability: Listing Outcomes',generatorIds:[...probabilitySkillGroups[0].ids]};
  catalog.modules.push(listing);catalog.videos.push({id:'keep',title:'Keep lesson',description:'',url:'',category:'Algebra',topic:'Inequalities',published:false});
  const snapshot=createPracticeState(broad.parentId,'before-organization',catalog),before=structuredClone(catalog);
  const next=validatePracticeCatalog(organizePracticeCatalog(catalog),taxonomy);
  assert.deepEqual(catalog,before);assert.deepEqual(next.videos,before.videos);
  assert.equal(next.modules.find(item=>item.id===listing.id).title,'Listing Outcomes');
  assert.equal(next.modules.filter(item=>item.topic==='Probability'&&!practiceModuleKind(item)).length,5);
  const focused=next.modules.filter(item=>item.topic==='Probability'&&!practiceModuleKind(item));
  assert.equal(focused.flatMap(item=>item.generatorIds).length,8);assert.equal(new Set(focused.flatMap(item=>item.generatorIds)).size,8);
  assert.deepEqual(new Set(managedGeneratorIds(next.modules.find(item=>item.id===broad.parentId),next)),new Set(probabilityPractice.map(item=>item.id)));
  const withoutListing=managedGeneratorIds(next.modules.find(item=>item.id===broad.parentId),next,{childModuleIds:focused.filter(item=>item.id!==listing.id).map(item=>item.id)});
  assert.ok(listing.generatorIds.every(id=>!withoutListing.includes(id)));
  assert.deepEqual(parsePracticeState(JSON.stringify(snapshot)),snapshot);
  const oldChoices={hiddenChildren:[broad.id]};
  assert.ok(focused.filter(item=>item.id!==listing.id).every(item=>practiceChildIsHidden(item,oldChoices)));
  assert.equal(practiceChildIsHidden(focused.find(item=>item.id===listing.id),oldChoices),false);
  const restored=changePracticeChild(focused,oldChoices,focused.find(item=>item.title==='Conditional Probability').id,true);
  assert.equal(practiceChildIsHidden(focused.find(item=>item.title==='Conditional Probability'),restored),false);
  assert.equal(practiceChildIsHidden(focused.find(item=>item.title==='Draws Without Replacement'),restored),true);
  const independent=changePracticeChild(focused,{},broad.id,false);
  assert.equal(focused.filter(item=>practiceChildIsHidden(item,independent)).length,1,'New skill toggles remain independent');
  assert.deepEqual(organizePracticeCatalog(next),next);
});

test('customized broad modules, hidden state, disabled generators, and reviewed metadata survive migration',()=>{
  const catalog=legacy(),broad=catalog.modules.find(item=>item.id==='probability-foundation');
  broad.published=false;catalog.generators[0].enabled=false;
  const custom=catalog.generators.find(item=>item.id==='probability-same-color-no-replacement-v1');
  Object.assign(custom,{title:'Teacher title',skills:['My skill'],prerequisites:['Fractions'],programs:['SAT','PSAT'],difficulty:'advanced',reviewStatus:'approved'});
  const next=organizePracticeCatalog(catalog);
  assert.ok(next.modules.filter(item=>item.topic==='Probability'&&!practiceModuleKind(item)).every(item=>!item.published));
  assert.deepEqual(next.generators.find(item=>item.id===custom.id),{...custom,sourceQuestionIds:['2021-2022-form-a-q78'],subject:'Math'});
  assert.equal(next.generators[0].enabled,false);
  broad.title='My curated probability';assert.deepEqual(organizePracticeCatalog(catalog).modules,catalog.modules);
});

test('registration restores a generator to its skill even when migration reused legacy module IDs',()=>{
  const {addBuiltinPractice}=require('./register-practice-generator.cjs');
  const {removePracticeGenerator}=require('../server/src/shared/practiceCatalog.ts');
  const old=legacy(),broad=old.modules.find(item=>item.id==='probability-foundation');
  old.modules.push({...broad,id:'teacher-listing',title:'Probability: Listing Outcomes',generatorIds:[...probabilitySkillGroups[0].ids]});
  const catalog=validatePracticeCatalog(organizePracticeCatalog(old),taxonomy),template=probabilityPractice.find(item=>item.id==='probability-cube-sum-counts-v1');
  const removed=removePracticeGenerator(catalog,template.id),restored=addBuiltinPractice(removed,template);
  assert.ok(restored.modules.find(item=>item.id==='teacher-listing').generatorIds.includes(template.id));
  assert.ok(!restored.modules.find(item=>item.id==='probability-foundation').generatorIds.includes(template.id));
});

test('metadata is validated and survives saves and session snapshots without changing the generated questions',()=>{
  const catalog=defaultPracticeCatalog(taxonomy),generator=catalog.generators.find(item=>item.id==='one-step-inequalities-v1');
  Object.assign(generator,{skills:['Sign flips'],prerequisites:['Integer arithmetic'],sourceQuestionIds:['2022-2023-form-a-q71'],programs:['SHSAT','SAT'],subject:'Math',difficulty:'standard',reviewStatus:'in-review'});
  const saved=validatePracticeCatalog(catalog,taxonomy),state=createPracticeState('inequalities','metadata',saved);
  assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);assert.deepEqual(saved.generators.find(item=>item.id===generator.id),generator);
  for(const patch of [{skills:['a','A']},{skills:'bad'},{prerequisites:[null]},{sourceQuestionIds:['not an id']},{programs:[]},{programs:['other']},{subject:''},{difficulty:'easy'},{reviewStatus:'ready'},{skills:Array(21).fill('x')}])assert.throws(()=>validateGenerator({...generator,...patch}),JSON.stringify(patch));
});

test('search, facets, focused usage, and bulk changes work across a 1000-generator library',()=>{
  const catalog=defaultPracticeCatalog(taxonomy),base=catalog.generators[0];
  catalog.generators=Array.from({length:1000},(_,index)=>({...base,id:`g-${index}`,skills:[index%2?'Fractions':'Ordered outcomes'],sourceQuestionIds:[`source-${index}`],programs:index%2?['SAT']:['SHSAT'],difficulty:index%2?'advanced':'foundation',reviewStatus:index%2?'approved':'unreviewed',enabled:index%2===0}));
  catalog.modules=catalog.modules.map(item=>({...item,generatorIds:[]}));
  assert.equal(filterStudioGenerators(catalog,'Ordered outcomes','','',filters).length,500);
  assert.equal(filterStudioGenerators(catalog,'source-999','','',filters)[0].id,'g-999');
  assert.equal(filterStudioGenerators(catalog,'','','',{...filters,program:'SAT',difficulty:'advanced',status:'approved'}).length,500);
  const module=catalog.modules.find(item=>item.id==='inequalities');module.generatorIds=['g-0'];
  assert.equal(filterStudioGenerators(catalog,'','','',{...filters,status:'unused'}).length,999);
  assert.equal(generatorModuleUsage(catalog.generators[0],catalog).some(usage=>usage.module.id===module.id&&usage.focused),true);
  const next=updateStudioGenerators(catalog,['g-0','g-2'],{enabled:false,reviewStatus:'approved'});
  assert.equal(next.generators[0].enabled,false);assert.equal(catalog.generators[0].enabled,true);assert.deepEqual(next.generators[1],catalog.generators[1]);
  assert.equal(studioMatches({...base,prerequisites:['Fractions']},'fractions'),true);
});

test('bulk disabling the last generators hides empty focused modules and remains saveable',()=>{
  const catalog=defaultPracticeCatalog(taxonomy),next=updateStudioGenerators(catalog,catalog.generators.map(item=>item.id),{enabled:false});
  assert.doesNotThrow(()=>validatePracticeCatalog(next,taxonomy));
  assert.ok(next.modules.filter(item=>!practiceModuleKind(item)).every(item=>!item.published));
  assert.ok(next.modules.filter(item=>practiceModuleKind(item)).every(item=>item.published));
  assert.ok(catalog.modules.filter(item=>!practiceModuleKind(item)).every(item=>item.published));
});

test('generation set filters combine inclusion, category, subcategory, and search without changing selections',()=>{
  const catalog=defaultPracticeCatalog(taxonomy),module={...catalog.modules.find(item=>item.id==='inequalities'),generatorIds:['one-step-inequalities-v1','probability-cube-sum-counts-v1']};
  const filters={included:'all',category:'',topic:'',search:''},before=structuredClone(catalog);
  assert.equal(generationSetEntries(module,catalog,filters).length,catalog.generators.length);
  const included=generationSetEntries(module,catalog,{...filters,included:'included'});
  assert.deepEqual(new Set(included.map(entry=>entry.generator.id)),new Set(module.generatorIds));
  assert.deepEqual(generationSetEntries(module,catalog,{...filters,included:'included',category:'Statistics and Probability',topic:'Probability',search:'2020-2021-form-b-math-2'}).map(entry=>entry.generator.id),['probability-cube-sum-counts-v1']);
  assert.equal(generationSetEntries(module,catalog,{...filters,included:'included',topic:'Missing'}).length,0);
  assert.deepEqual(catalog,before);
});

test('included-only respects automatic groups, inherited selections, hidden children, and disabled generators',()=>{
  const catalog=defaultPracticeCatalog(taxonomy),foundation=catalog.modules.find(item=>item.defaultType==='foundation'&&item.topic==='Probability');
  const filters={included:'included',category:'',topic:'',search:''};
  assert.equal(generationSetEntries(foundation,catalog,filters).length,8);
  catalog.modules.find(item=>item.parentId===foundation.id).published=false;
  const active=managedGeneratorIds(foundation,catalog);
  assert.deepEqual(new Set(generationSetEntries(foundation,catalog,filters).map(entry=>entry.generator.id)),new Set(active));
  const general=catalog.modules.find(item=>item.defaultType==='general'&&item.topic==='Probability');
  const generator=catalog.generators.find(item=>item.topic==='Probability');generator.enabled=false;
  assert.ok(generationSetEntries(general,catalog,filters).every(entry=>entry.generator.topic==='Probability'&&entry.generator.enabled&&entry.locked));
  assert.deepEqual(generationSetEntries(general,catalog,filters).map(entry=>entry.generator.id),managedGeneratorIds(general,catalog));
  const automatic={...catalog.modules.find(item=>item.id==='inequalities'),includeAll:true};
  assert.equal(generationSetEntries(automatic,catalog,filters).length,catalog.generators.filter(item=>item.enabled).length);
});

test('module preview snapshots the complete effective draft mix and allows unpublished modules without publishing edits',()=>{
  const catalog=defaultPracticeCatalog(taxonomy),module=catalog.modules.find(item=>item.defaultType==='foundation'&&item.topic==='Probability');
  module.published=false;module.title='Unsaved module preview';
  catalog.generators.find(item=>item.topic==='Probability').enabled=false;
  const before=structuredClone(catalog),ids=managedGeneratorIds(module,catalog),preview=modulePreviewCatalog(module,catalog);
  assert.deepEqual(preview.generators.map(item=>item.id),ids);
  assert.equal(preview.modules[0].title,'Unsaved module preview');assert.equal(preview.modules[0].published,true);
  const state=createPracticeState('generator-preview','draft-module',preview);
  assert.deepEqual(state.generatorIds,ids);assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);assert.deepEqual(catalog,before);
  catalog.generators[0].title='Changed after opening';assert.notEqual(preview.generators[0].title,'Changed after opening');
  assert.throws(()=>modulePreviewCatalog({...module,id:'empty-preview',defaultType:undefined,includeAll:false,generatorIds:[]},catalog),/Include at least one enabled/);
});

test('Skill is the module name; legacy classifications never replace it on reads or saves',()=>{
  const {reconcilePracticeSkilled,studentPracticeCatalog}=require('../server/src/shared/practiceCatalog.ts');
  const catalog=defaultPracticeCatalog(taxonomy),module=catalog.modules.find(item=>item.skillId==='probability-after-removal');
  Object.assign(module,{title:'Probability After Removal',titleMode:'custom',skilled:'legacy-registry-skill'});
  const before=structuredClone(module),snapshot=createPracticeState(module.id,'before-rename',catalog);
  for(const skills of [[],[{id:module.skilled,label:'Different registry label',category:module.category,subcategory:module.topic}]]){
    const result=validatePracticeCatalog(reconcilePracticeSkilled(catalog,skills),{...taxonomy,classificationSkills:skills});
    const saved=result.modules.find(item=>item.id===module.id);
    assert.equal(saved.title,before.title);assert.deepEqual(saved.generatorIds,before.generatorIds);assert.equal(saved.parentId,before.parentId);
  }
  module.title='Removal Probability';
  const result=validatePracticeCatalog(catalog,{...taxonomy,classificationSkills:[]});
  assert.equal(studentPracticeCatalog(result).modules.find(item=>item.id===module.id).title,'Removal Probability');
  assert.deepEqual(managedGeneratorIds(result.modules.find(item=>item.id===module.id),result),before.generatorIds);
  assert.deepEqual(parsePracticeState(JSON.stringify(snapshot)),snapshot);
});

test('library Skill filtering uses module membership, including hidden modules and disabled generators',()=>{
  const catalog=defaultPracticeCatalog(taxonomy),module=catalog.modules.find(item=>item.skillId==='probability-listing-outcomes');
  module.published=false;
  catalog.generators.find(item=>item.id===module.generatorIds[0]).enabled=false;
  const expected=[...module.generatorIds].sort();
  for(const generator of catalog.generators)generator.skilled='unrelated-registry-skill';
  assert.deepEqual(filterStudioGenerators(catalog,'','','',{...filters,moduleId:module.id}).map(item=>item.id).sort(),expected);
  module.title='Listing Possible Outcomes';
  assert.deepEqual(filterStudioGenerators(catalog,'','','',{...filters,moduleId:module.id}).map(item=>item.id).sort(),expected);
  assert.equal(filterStudioGenerators(catalog,'','','',{...filters,moduleId:'missing'}).length,0);
});

test('choosing a shared skill binds its name while keeping module IDs, generators, placement and running sessions',()=>{
  const {assignPracticeModuleSkill,reconcilePracticeSkilled}=require('../server/src/shared/practiceCatalog.ts');
  const catalog=defaultPracticeCatalog(taxonomy),module=catalog.modules.find(item=>item.skillId==='probability-after-removal');
  const snapshot=createPracticeState(module.id,'before-skill-choice',catalog);
  const skill={id:'removal-skill',label:'Probability After Removing Items',category:module.category,subcategory:module.topic};
  const assigned=assignPracticeModuleSkill(catalog,module.id,skill),linked=assigned.modules.find(item=>item.id===module.id);
  assert.equal(linked.skilled,skill.id);assert.equal(linked.title,skill.label);assert.equal(linked.titleMode,'skill');
  assert.deepEqual(linked.generatorIds,module.generatorIds);assert.equal(linked.parentId,module.parentId);
  const renamed={...skill,label:'Removal Probability'};
  assert.equal(reconcilePracticeSkilled(assigned,[renamed]).modules.find(item=>item.id===module.id).title,renamed.label);
  assert.equal(validatePracticeCatalog(assigned,{...taxonomy,classificationSkills:[renamed]}).modules.find(item=>item.id===module.id).title,renamed.label);
  const deleted=reconcilePracticeSkilled(assigned,[]).modules.find(item=>item.id===module.id);
  assert.equal(deleted.skilled,'TBD');assert.equal(deleted.title,skill.label);assert.deepEqual(deleted.generatorIds,module.generatorIds);
  assert.deepEqual(parsePracticeState(JSON.stringify(snapshot)),snapshot);
  assert.throws(()=>assignPracticeModuleSkill(catalog,module.id,{...skill,category:'Geometry',subcategory:'Shapes & Angles'}),/Category and Subcategory/);
  const empty={...module,id:'empty-module',generatorIds:[],published:false};
  const other={...skill,category:'Geometry',subcategory:'Shapes & Angles'};
  const moved=assignPracticeModuleSkill({...catalog,modules:[...catalog.modules,empty]},empty.id,other);
  const destination=moved.modules.find(item=>item.id===empty.id);
  assert.equal(destination.category,other.category);assert.equal(destination.topic,other.subcategory);
  assert.equal(practiceModuleKind(moved.modules.find(item=>item.id===destination.parentId)),'foundation');
});
