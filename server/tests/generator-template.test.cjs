const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {validateGeneratorTemplate,analyzeGeneratorTemplate}=require('../src/shared/generatorTemplate.ts');
const {templateExample,parseGeneratorImport,stageTemplate,generatorCreationPrompt}=require('../../client/src/features/math-command/generatorAuthoring.ts');
const {defaultPracticeCatalog,validatePracticeCatalog,reconcilePracticeSkilled,generateCatalogQuestion,managedGeneratorIds}=require('../src/shared/practiceCatalog.ts');
const {createPracticeState,parsePracticeState}=require('../../client/src/features/math-command/inequalitySession.ts');
const {handlePracticeCatalogRequest}=require('../../tools/practice-catalog-service.cjs');
const taxonomy={...require('../../tools/math-topics.json'),classificationSkills:[]};
const clone=()=>structuredClone(templateExample);
const pkg=template=>JSON.stringify({version:1,title:'Equal groups',description:'Source-based multiplication.',template});
const identity={id:'qa-template',category:'Algebra',topic:'Inequalities',sourceQuestionIds:['qa-source']};
const generator=()=>parseGeneratorImport(pkg(clone()),identity);
test('every variant has the independently computed answer and explanation, with a complete deterministic cycle',()=>{
 const g=generator(),stems=new Set();assert.deepEqual(analyzeGeneratorTemplate(g.template),{combinations:24,distinctStems:24,responseType:'multiple_choice'});
 for(let i=0;i<48;i++){
  const q=generateCatalogQuestion(g,i,'qa'),[boxes,perBox]=q.prompt.match(/\d+/g).map(Number),expected=boxes*perBox;
  assert.equal(Number(q.choices.find(c=>c.id===q.correctChoiceId).text),expected);
  assert.equal(new Set(q.choices.map(c=>c.text)).size,4);assert.ok(q.explanation.includes(`${boxes} × ${perBox} = ${expected}`));
  assert.deepEqual(q,generateCatalogQuestion(g,i,'qa'));if(i<24)stems.add(q.prompt);
 }
 assert.equal(stems.size,24);assert.throws(()=>generateCatalogQuestion(g,-1,'qa'),/sequence/);
 assert.equal(g.enabled,false);assert.equal(g.reviewStatus,'unreviewed');assert.deepEqual(g.sourceQuestionIds,['qa-source']);
});
test('constraints guard division before derived values and exact fractions work for short response',()=>{
 const t={version:1,variables:[{name:'n',values:[2,4,6]},{name:'d',values:[0,2]}],constraints:[{left:'d',relation:'ne',right:0}],derived:[{name:'quotient',expression:{op:'divide',args:['n','d']}}],prompt:'Divide {{n}} by {{d}}.',answer:'quotient',distractors:[],responseType:'short_response',explanation:'The quotient is {{quotient}}.'};
 assert.equal(analyzeGeneratorTemplate(t).distinctStems,3);
 const g=parseGeneratorImport(pkg(t),identity);for(let i=0;i<3;i++){const q=generateCatalogQuestion(g,i,'fraction');const [n,d]=q.prompt.match(/\d+/g).map(Number);assert.equal(Number(q.correctTextAnswers[0]),n/d);}
 t.constraints=[];assert.throws(()=>validateGeneratorTemplate(t),/division by zero/);
 t.variables=[{name:'n',values:[1,2]},{name:'d',values:[3]}];t.derived=[];t.explanation='The exact answer is {{n}}/{{d}}.';t.answer={text:'{{n}}/{{d}}'};
 assert.doesNotThrow(()=>validateGeneratorTemplate(t));t.answer={op:'divide',args:['n','d']};assert.throws(()=>validateGeneratorTemplate(t),/ten decimal places/);
});
test('invalid domains, code, unknown fields, placeholders, and inconsistent stems are rejected',()=>{
 const cases=[
  [t=>t.variables[0].values=[2,2],/unique/],
  [t=>{t.variables=Array.from({length:3},(_,i)=>({name:`x${i}`,values:Array.from({length:20},(_,j)=>j)}));},/5,000/],
  [t=>t.derived[0].expression={op:'eval',args:['boxes']},/unsupported math/],
  [t=>t.derived[0].expression='boxes * perBox',/unknown variable/],
  [t=>t.prompt='<script>alert(1)</script>',/HTML/],
  [t=>t.prompt='How many {{missing}}?',/unknown placeholder/],
  [t=>t.prompt='How many pencils?',/different correct answers/],
  [t=>t.constraints=[{left:'boxes',relation:'gt',right:100}],/two distinct/],
  [t=>t.javascript='while(true){}',/unsupported field/],
  [t=>t.variables[0].name='constructor',/variable name/],
 ];
 for(const [mutate,pattern]of cases){const t=clone();mutate(t);assert.throws(()=>validateGeneratorTemplate(t),pattern);}
 assert.throws(()=>parseGeneratorImport('{broken',identity),/valid JSON/);
 assert.throws(()=>parseGeneratorImport(JSON.stringify({version:1,title:'x',template:clone(),enabled:true}),identity),/only version/);
 assert.deepEqual(parseGeneratorImport('```json\n'+pkg(clone())+'\n```',identity),generator());
});
test('numeric-equivalent choices and undefined fractions cannot pass validation',()=>{
 const t=clone();t.distractors[0]={text:'{{total}}/1'};assert.throws(()=>validateGeneratorTemplate(t),/collide/);
 t.distractors[0]={text:'1/0'};assert.throws(()=>validateGeneratorTemplate(t),/zero denominator/);
 t.distractors[0]='total';assert.throws(()=>validateGeneratorTemplate(t),/collide/);
});
test('import adds source-linked drafts without changing existing resources; sessions retain their version',()=>{
 const before=validatePracticeCatalog(defaultPracticeCatalog(),taxonomy),snapshot=structuredClone(before),parent=before.modules.find(m=>m.category===identity.category&&m.topic===identity.topic&&m.defaultType==='general');
 const next=stageTemplate(before,generator(),{id:'qa-module',title:'My chosen module name',category:identity.category,topic:identity.topic,parentId:parent.id});
 assert.deepEqual(before,snapshot);assert.deepEqual(next.generators.slice(0,-1),before.generators);assert.equal(next.modules.at(-1).published,false);
 assert.equal(validatePracticeCatalog(next,taxonomy).modules.find(m=>m.id==='qa-module').title,'My chosen module name');
 next.generators.at(-1).enabled=true;next.modules.at(-1).published=true;
 const session=createPracticeState('qa-module','snapshot',next),question=generateCatalogQuestion(session.generatorDefinitions[0],0,session.seed);
 next.generators.at(-1).template.prompt='Changed {{boxes}} {{perBox}}';next.modules.at(-1).title='Later name';
 const restored=parsePracticeState(JSON.stringify(session));assert.deepEqual(generateCatalogQuestion(restored.generatorDefinitions[0],0,restored.seed),question);
 assert.throws(()=>stageTemplate(next,generator(),{id:'qa-module',title:'x',category:identity.category,topic:identity.topic}),/already exists/);
});
test('custom names survive classification reconciliation and topic group normalization',()=>{
 const catalog=validatePracticeCatalog(defaultPracticeCatalog(),taxonomy),module=catalog.modules.find(m=>!m.defaultType);
 for(const m of catalog.modules){m.title=`Custom ${m.id}`;m.titleMode='custom';}
 const skill={id:'qa-skill',label:'Renamed skill',category:module.category,subcategory:module.topic};module.skilled=skill.id;
 const result=validatePracticeCatalog(reconcilePracticeSkilled(catalog,[skill]),{...taxonomy,classificationSkills:[skill]});
 for(const m of catalog.modules)assert.equal(result.modules.find(row=>row.id===m.id).title,m.title);
});
test('adding a Foundation child preserves the group’s existing practice selection',()=>{
 const catalog=validatePracticeCatalog(defaultPracticeCatalog(),taxonomy),parent=catalog.modules.find(m=>m.id==='foundation');parent.includeAll=true;
 const previous=managedGeneratorIds(parent,catalog),g={...generator(),enabled:true};
 const staged=stageTemplate(catalog,g,{id:'qa-foundation-child',title:'Foundation skill',category:identity.category,topic:identity.topic,parentId:parent.id});
 staged.modules.find(m=>m.id==='qa-foundation-child').published=true;
 const saved=validatePracticeCatalog(staged,taxonomy),updated=saved.modules.find(m=>m.id===parent.id);
 assert.equal(updated.includeAll,false);assert.deepEqual(new Set(managedGeneratorIds(updated,saved)),new Set([...previous,g.id]));
 assert.deepEqual(managedGeneratorIds(updated,saved,{childModuleIds:[]}),previous);
});
test('creation prompt retains the full source and destination without asking for executable code',()=>{
 const prompt=generatorCreationPrompt({row:{category:'Algebra',subcategory:'Inequalities'},record:{id:'source-123',question:{prompt:'Solve 2x = 8.',correctTextAnswers:['4'],explanation:'Divide by 2.'},sources:[{title:'My source'}]}},'Solving equations');
 for(const text of ['source-123','Solving equations','Solve 2x = 8.','Divide by 2.','My source','do not return JavaScript','5000'])assert.ok(prompt.includes(text));
});
test('local Content Studio shares durable saves, rejects stale revisions and validates before writes',async()=>{
 let stored=null,writes=0,failed=false;
 const runtime={...require('../src/shared/practiceCatalog.ts'),withMathCommandPersistence:async(_root,fn)=>fn(),readMathCommandTaxonomy:()=>taxonomy,readMathCommandState:()=>({taxonomyTopicRenames:[]}),supabase:{from(table){assert.equal(table,'infinite_practice_catalog');let insert,update,filters=[];return{select(){return this;},eq(key,value){filters.push(row=>row[key]===value);return this;},insert(row){insert=row;return this;},update(row){update=row;return this;},async maybeSingle(){if(failed)return{error:{code:'PGRST205'}};if(insert){if(stored)return{error:{code:'23505'}};stored=structuredClone(insert);writes++;}if(update){if(!stored||!filters.every(f=>f(stored)))return{data:null};stored=structuredClone(update);writes++;}return{data:structuredClone(stored)};}}}}};
 const call=(method,body)=>handlePracticeCatalogRequest({root:'.',method,body},runtime);
 let result=await call('GET');assert.equal(result.revision,0);result.catalog.modules[0].title='My renamed module';result.catalog.modules[0].titleMode='custom';
 await call('PUT',result);result=await call('GET');assert.equal(result.revision,1);assert.equal(result.catalog.modules[0].title,'My renamed module');
 await assert.rejects(call('PUT',{...result,revision:0}),e=>e.status===409);
 await assert.rejects(call('PUT',{...result,revision:99}),e=>e.status===409);
 const invalid=structuredClone(result);invalid.catalog.generators.push({...generator(),template:{...clone(),answer:'unknown'}});await assert.rejects(call('PUT',invalid),e=>e.status===400);
 await assert.rejects(call('PUT',{revision:1}),e=>e.status===400);assert.equal(writes,1);
 failed=true;await assert.rejects(call('GET'),e=>e.status===503);assert.equal(writes,1);
});
