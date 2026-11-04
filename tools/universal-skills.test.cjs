const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
require('./register-practice-generator.cjs');
const {universalClassificationSkills,validateClassificationSkills}=require('../server/src/shared/mathClassificationSkills.ts');
const {withPracticeSkillSnapshot}=require('../server/src/lib/practiceSkillContext.ts');
const store=require('../server/src/lib/mathCommandCatalogStore.ts');
const {handleMathCatalogRequest,mathCatalogSnapshot}=require('../server/src/lib/mathCommandCatalogService.ts');
const {reconcilePracticeSkilled}=require('../server/src/shared/practiceCatalog.ts');
const {plannerExistingModuleGroups}=require('../client/src/features/math-command/plannerModuleChoices.ts');
const modules=['One-step Inequalities','Inequalities: Variables on Both Sides','Graphing Inequalities','Writing Inequalities'].map((title,i)=>({id:`module${i}`,title,category:'Algebra',topic:'Inequalities',published:false,generatorIds:[],includeAll:false,skilled:'TBD'}));
const definitions=[{id:'graphing',label:'Graphing Inequalities',category:'Algebra',subcategory:'Inequalities'}];
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'universal-skills-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));fs.mkdirSync(path.join(root,'tools'),{recursive:true});fs.mkdirSync(path.join(root,'server/data'),{recursive:true});const taxonomy={categories:[{label:'Algebra',topics:['Inequalities','Equations']}]};fs.writeFileSync(path.join(root,'tools/math-topics.json'),JSON.stringify(taxonomy));fs.writeFileSync(path.join(root,'server/data/math-command.json'),JSON.stringify({revision:'initial',classificationSkills:definitions,metadata:{}}));fs.writeFileSync(path.join(root,'server/data/exam-content.json'),JSON.stringify({exam:{assessmentId:'exam',title:'Fixture',passageSets:[],mathSection:{questions:[{id:'q1',type:'short_response',topic:'Algebra',subtopic:'Inequalities',prompt:'Solve x > 2.',correctTextAnswers:['2'],explanation:'Fixture.'}]}}}));return {root,taxonomy,request:(method,pathname,body)=>handleMathCatalogRequest({root,method,pathname,body,actor:'teacher'})};}
test('all module labels enter one shared list including empty/unpublished modules; groups and duplicates do not',()=>{
 const input=[...modules,{...modules[0],id:'duplicate'},{...modules[0],id:'foundation',title:'Foundation Building',defaultType:'foundation'},{...modules[0],id:'all',title:'General Practice',defaultType:'general'}];
 const skills=universalClassificationSkills(definitions,input);assert.equal(skills.length,4);assert.deepEqual(skills.map(s=>s.label).sort(),modules.map(m=>m.title).sort());assert.equal(skills.find(s=>s.label==='Graphing Inequalities').id,'graphing');assert.deepEqual(universalClassificationSkills(definitions,input.slice().reverse()),skills);assert.deepEqual(definitions,[{id:'graphing',label:'Graphing Inequalities',category:'Algebra',subcategory:'Inequalities'}]);
});
test('Content Editor service, catalog, planner and Practice Studio share names without assigning questions',t=>{
 const f=fixture(t);withPracticeSkillSnapshot(f.root,modules,1,()=>{
  const skills=f.request('GET','/classification-skills').skills;assert.equal(skills.length,4);assert.deepEqual(store.readMathCommandTaxonomy(f.root).classificationSkills,skills);
  assert.equal(store.readMathCommandCatalog(f.root)[0].question.skilled,'TBD');
  const catalog=reconcilePracticeSkilled({modules,generators:[],videos:[]},skills);assert.ok(catalog.modules.every(m=>skills.some(s=>s.id===m.skilled&&s.label===m.title)));
  const groups=plannerExistingModuleGroups(catalog,'Algebra','Inequalities',skills);assert.equal(groups.flatMap(g=>g.skills).length,0);assert.equal(groups.flatMap(g=>g.modules).length,4);
 });
});
test('a rename keeps IDs and question assignments and updates every linked module, including after reload',t=>{
 const f=fixture(t);withPracticeSkillSnapshot(f.root,modules,1,()=>{
  const before=f.request('GET','/classification-skills'),skill=before.skills.find(s=>s.label==='One-step Inequalities');
  const preview=store.previewMathMetadata(f.root,{revision:store.readMathCommandState(f.root).revision,questionIds:['q1'],patch:{skilled:skill.id}},'teacher');store.applyMathMetadata(f.root,preview.token,'teacher');
  const current=f.request('GET','/classification-skills');f.request('POST','/classification-skills',{revision:current.revision,skills:current.skills.map(s=>s.id===skill.id?{...s,label:'Solving One-step Inequalities'}:s)});
  const after=f.request('GET','/classification-skills');assert.equal(after.skills.length,4);assert.equal(after.skills.find(s=>s.id===skill.id).label,'Solving One-step Inequalities');
  assert.equal(store.readMathCommandCatalog(f.root)[0].question.skilled,skill.id);assert.equal(reconcilePracticeSkilled({modules,generators:[],videos:[]},after.skills).modules[0].title,'Solving One-step Inequalities');
  assert.throws(()=>f.request('POST','/classification-skills',{revision:after.revision,skills:after.skills.filter(s=>s.id!==skill.id)}),/Delete the module/);
 });
 withPracticeSkillSnapshot(f.root,modules,1,()=>assert.ok(f.request('GET','/classification-skills').skills.some(s=>s.label==='Solving One-step Inequalities')));
});
test('new modules invalidate skill snapshots and catalog caches; stale saves cannot drop new labels',t=>{
 const f=fixture(t);let before;
 withPracticeSkillSnapshot(f.root,modules,1,()=>{before=f.request('GET','/classification-skills');assert.equal(mathCatalogSnapshot(f.root).taxonomy.classificationSkills.length,4);});
 withPracticeSkillSnapshot(f.root,[...modules,{...modules[0],id:'new',title:'Another skill'}],2,()=>{
  assert.equal(mathCatalogSnapshot(f.root).taxonomy.classificationSkills.length,5);
  assert.throws(()=>f.request('POST','/classification-skills',{revision:before.revision,skills:before.skills}),/another window/);
 });
});
test('module moves, deletion and choosing another skill do not leave duplicate or orphan organization labels',()=>{
 const saved=universalClassificationSkills(definitions,modules);
 const moved=modules.map(m=>m.id==='module0'?{...m,topic:'Equations'}:m);const skills=universalClassificationSkills(saved,moved);
 assert.equal(skills.length,4);assert.equal(skills.find(s=>s.moduleIds.includes('module0')).subcategory,'Equations');assert.doesNotThrow(()=>validateClassificationSkills(skills,{categories:[{label:'Algebra',topics:['Inequalities','Equations']}]}));
 assert.equal(universalClassificationSkills(saved,modules.filter(m=>m.id!=='module0')).length,3);
 const reassigned=universalClassificationSkills(saved,modules.map(m=>m.id==='module0'?{...m,skilled:'graphing'}:m));assert.equal(reassigned.length,3);assert.ok(reassigned.find(s=>s.id==='graphing').moduleIds.includes('module0'));
});

test('a retained module with the same label preserves an assigned skill ID when the original module is removed',()=>{
 const saved=universalClassificationSkills([],modules.slice(0,1));
 const remaining={...modules[0],id:'replacement'};
 const next=universalClassificationSkills(saved,[remaining]);
 assert.equal(next.length,1);assert.equal(next[0].id,saved[0].id);assert.deepEqual(next[0].moduleIds,['replacement']);
});
test('taxonomy renames update projected module skills in the same request',t=>{
 const f=fixture(t);
 withPracticeSkillSnapshot(f.root,modules,1,()=>{
  const before=store.readMathCommandState(f.root);
  const state={...before,taxonomy:{categories:[{label:'Algebra',topics:['Solving Inequalities','Equations']}]},taxonomyTopicRenames:[{category:'Algebra',from:'Inequalities',to:'Solving Inequalities'}],classificationSkills:before.classificationSkills.map(s=>({...s,subcategory:'Solving Inequalities'}))};
  store.runMathCommandStateContext({root:f.root,state,originalRevision:state.revision,dirty:true},()=>{
   const skills=store.readMathCommandTaxonomy(f.root).classificationSkills;
   assert.equal(skills.length,4);assert.ok(skills.every(s=>s.subcategory==='Solving Inequalities'));
   assert.deepEqual(skills.map(s=>s.id),before.classificationSkills.map(s=>s.id));
  });
 });
});
