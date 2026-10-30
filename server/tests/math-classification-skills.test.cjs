const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const store=require('../src/lib/mathCommandCatalogStore.ts');
const {handleMathCatalogRequest}=require('../src/lib/mathCommandCatalogService.ts');
const {validateClassificationSkills}=require('../src/shared/mathClassificationSkills.ts');
const {defaultPracticeCatalog,validatePracticeCatalog,reconcilePracticeSkilled,generateCatalogQuestion}=require('../src/shared/practiceCatalog.ts');
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'skilled-classification-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'server/data'),{recursive:true});fs.mkdirSync(path.join(root,'tools'),{recursive:true});
  const taxonomy={categories:[{label:'Algebra',topics:['Inequalities','Equations']},{label:'Statistics and Probability',topics:['Probability','Overlapping Groups']},{label:'Ratios and Proportional Relationships',topics:['Rates & Unit Rates','Ratios & Proportions']}]};
  fs.writeFileSync(path.join(root,'tools/math-topics.json'),JSON.stringify(taxonomy));
  const question={id:'q-1',type:'short_response',topic:'Algebra',subtopic:'Inequalities',prompt:'Solve x + 1 = 3.',correctTextAnswers:['2'],explanation:'Subtract 1.'};
  const content={exam:{assessmentId:'exam',title:'Fixture',passageSets:[],mathSection:{questions:[question,{...question,id:'q-2',skilled:'manual-skill'}]}}};
  const contentPath=path.join(root,'server/data/exam-content.json');fs.writeFileSync(contentPath,JSON.stringify(content));
  const request=(method,pathname,body,query)=>handleMathCatalogRequest({root,method,pathname,body,query,actor:'teacher'});
  const read=()=>request('GET','/classification-skills'),save=skills=>request('POST','/classification-skills',{revision:read().revision,skills});
  return {root,taxonomy,question,request,read,save,contentPath};
}
const definition={id:'manual-skill',label:'Isolating Variables',category:'Algebra',subcategory:'Inequalities'};
test('the shared Skilled registry starts empty and existing questions are TBD without inferred assignments',t=>{
  const f=fixture(t);assert.deepEqual(f.read().skills,[]);
  const page=f.request('GET','/catalog',undefined,{filters:{skilled:['TBD']}});
  assert.equal(page.total,2);assert.ok(page.items.every(row=>row.skilled==='TBD'&&row.skilledLabel==='TBD'));
});
test('question classifications can change without renaming teacher-assigned module skills',t=>{
  const f=fixture(t),bytes=fs.readFileSync(f.contentPath);f.save([definition]);
  const preview=store.previewMathMetadata(f.root,{questionIds:['q-1'],patch:{skilled:definition.id},revision:f.read().revision},'teacher');store.applyMathMetadata(f.root,preview.token,'teacher');
  assert.equal(f.request('GET','/catalog',undefined,{filters:{skilled:[definition.id]}}).total,2);
  const catalog=defaultPracticeCatalog(f.taxonomy),module=catalog.modules.find(item=>item.id==='inequalities');module.skilled=definition.id;
  const generator=catalog.generators.find(item=>item.id==='one-step-inequalities-v1');generator.skilled=definition.id;
  assert.equal(generateCatalogQuestion(generator,0,'manual-skill').skilled,definition.id);
  assert.equal(validatePracticeCatalog(catalog,{...f.taxonomy,classificationSkills:[definition]}).modules.find(item=>item.id===module.id).title,module.title);
  const renamed={...definition,label:'Isolating a Variable'};f.save([renamed]);
  assert.equal(f.request('GET','/catalog/q-1').row.skilledLabel,renamed.label);
  assert.equal(reconcilePracticeSkilled(catalog,[renamed]).modules.find(item=>item.id===module.id).title,module.title);
  assert.deepEqual(fs.readFileSync(f.contentPath),bytes);
});
test('delete resets native and metadata assignments to TBD and cannot silently reattach a reused ID',t=>{
  const f=fixture(t);f.save([definition]);
  const p=store.previewMathMetadata(f.root,{questionIds:['q-1'],patch:{skilled:definition.id},revision:f.read().revision},'teacher');store.applyMathMetadata(f.root,p.token,'teacher');
  f.save([]);assert.ok(store.readMathCommandCatalog(f.root).every(record=>record.question.skilled==='TBD'));
  assert.equal(store.readMathCommandState(f.root).metadata['q-2'].skilled,'TBD');
  assert.throws(()=>f.save([definition]),/cannot be reused/);
  const catalog=defaultPracticeCatalog(f.taxonomy),module=catalog.modules.find(item=>item.id==='inequalities');module.skilled=definition.id;module.title=definition.label;
  const next=reconcilePracticeSkilled(catalog,[]);assert.equal(next.modules.find(item=>item.id===module.id).title,definition.label);assert.equal(next.modules.find(item=>item.id===module.id).skilled,'TBD');
  assert.equal(next.generators.length,catalog.generators.length);
});
test('scopes, reserved names, duplicates, malformed definitions, and stale saves are rejected',t=>{
  const f=fixture(t),revision=f.read().revision;f.save([definition]);
  assert.throws(()=>f.request('POST','/classification-skills',{revision,skills:[]}),/another window/);
  for(const list of [[definition,{...definition,id:'other',label:definition.label.toUpperCase()}],[{...definition,label:'TBD'}],[{...definition,id:'TBD'}],[{...definition,subcategory:'Missing'}],[{...definition,label:''}],[{...definition,label:'x'.repeat(121)}]])assert.throws(()=>validateClassificationSkills(list,f.taxonomy));
  assert.doesNotThrow(()=>validateClassificationSkills([definition,{...definition,id:'another',subcategory:'Equations'}],f.taxonomy));
  assert.throws(()=>store.previewMathMetadata(f.root,{questionIds:['q-1'],patch:{category:'Algebra',subcategory:'Equations',skilled:definition.id},revision:f.read().revision},'teacher'),/under/);
});
test('subcategory renames move Skilled definitions while preserving their IDs and question assignments',t=>{
  const f=fixture(t);f.save([definition]);
  f.request('POST','/taxonomy',{revision:f.read().revision,action:'rename-subcategory',category:'Algebra',original:'Inequalities',name:'Linear Inequalities'});
  assert.deepEqual(f.read().skills,[{...definition,subcategory:'Linear Inequalities'}]);
  assert.equal(store.readMathCommandCatalog(f.root).find(item=>item.id==='q-2').question.skilled,definition.id);
});
