const {test,before,after}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {defaultPracticeCatalog,defaultGeneratorSettings,validatePracticeCatalog,validateGenerator,managedGeneratorIds,movePracticeModule,removePracticeGenerator,generatorTopicKey,generateCatalogQuestion,youtubeVideoId}=require('../src/shared/practiceCatalog.ts');
const {createPracticeState,parsePracticeState}=require('../../client/src/features/math-command/inequalitySession.ts');
const taxonomy={categories:[{label:'Algebra',topics:['Inequalities','Equations']}]};
const fresh=()=>structuredClone(defaultPracticeCatalog());
const custom=(changes={})=>({id:'custom-two-step',title:'Two-step inequalities',description:'Teacher template',kind:'two-step',enabled:true,settings:{...defaultGeneratorSettings},...changes});

test('Q70 is published under Inequalities, snapshots its generator, and registers safely in saved catalogs',()=>{
 const {variablesBothSidesTemplate}=require('../src/shared/inequalityPractice.ts');
 const {addQ70Practice}=require('../../tools/register-q70-practice.cjs');
 const catalog=fresh(),module=catalog.modules.find(item=>item.id===variablesBothSidesTemplate.sourceId);
 assert.equal(module.category,'Algebra');assert.equal(module.topic,'Inequalities');assert.equal(module.published,true);
 const state=createPracticeState(module.id,'q70-catalog',catalog);
 assert.deepEqual(state.generatorIds,[variablesBothSidesTemplate.id]);
 assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);
 assert.match(generateCatalogQuestion(state.generatorDefinitions[0],0,state.seed).prompt,/x.*[<>].*x/);
 const old=removePracticeGenerator(catalog,variablesBothSidesTemplate.id);
 old.modules=old.modules.filter(item=>item.id!==variablesBothSidesTemplate.sourceId);
 old.modules[0].title='Teacher collection';old.modules[1].published=false;old.generators[0].enabled=false;
 old.videos.push({id:'draft-video',title:'My lesson',description:'Keep this draft',url:'',category:'Algebra',topic:'Inequalities',published:false});
 const before=structuredClone(old),updated=addQ70Practice(old);
 assert.deepEqual(old,before);
 assert.deepEqual(updated.modules.slice(0,-1),old.modules);assert.deepEqual(updated.generators.slice(0,-1),old.generators);assert.deepEqual(updated.videos,old.videos);
 assert.deepEqual(addQ70Practice(updated),updated);
 updated.generators.at(-1).enabled=false;updated.modules.at(-1).published=false;
 assert.deepEqual(addQ70Practice(updated),updated,'Rerunning registration preserves later teacher changes');
});
test('moving a module makes it a Foundation child and settings exclude its generators from a session',()=>{
 const catalog=validatePracticeCatalog(movePracticeModule(fresh(),'inequalities','foundation'),taxonomy),foundation=catalog.modules.find(module=>module.id==='foundation');
 assert.equal(catalog.modules.find(module=>module.id==='inequalities').parentId,'foundation');
 assert.ok(!foundation.generatorIds.includes('one-step-inequalities-v1'));
 assert.ok(managedGeneratorIds(foundation,catalog).includes('one-step-inequalities-v1'));
 const filtered=createPracticeState('foundation','student-settings',catalog,{childModuleIds:[]});
 assert.deepEqual(filtered.generatorIds,foundation.generatorIds);assert.deepEqual(parsePracticeState(JSON.stringify(filtered)),filtered);
 assert.equal(movePracticeModule(catalog,'inequalities',null).modules.find(module=>module.id==='inequalities').parentId,null);
 assert.throws(()=>movePracticeModule(catalog,'foundation','foundation'));
});
test('deleting either built-in generator cleans references and preserves sessions already running',()=>{
 const original=fresh(),state=createPracticeState('foundation','before-delete',original),removed=removePracticeGenerator(original,'one-step-inequalities-v1');
 assert.ok(!removed.generators.some(generator=>generator.id==='one-step-inequalities-v1'));
 assert.ok(removed.modules.every(module=>!module.generatorIds.includes('one-step-inequalities-v1')));
 assert.equal(removed.modules.find(module=>module.id==='inequalities').published,false);
 assert.doesNotThrow(()=>validatePracticeCatalog(removed,taxonomy));assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);
});
test('All Question Types includes every enabled generator, while student topic choices filter the actual snapshot',()=>{
 const catalog=fresh();catalog.generators.push(custom({category:'Algebra',topic:'Equations'}));
 const all=catalog.modules.find(module=>module.id==='all');all.includeAll=false;all.generatorIds=[];
 const validated=validatePracticeCatalog(catalog,taxonomy);assert.equal(validated.modules.find(module=>module.id==='all').includeAll,true);
 assert.equal(managedGeneratorIds(all,catalog).length,catalog.generators.length);
 const state=createPracticeState('all','filtered',catalog,{topics:['Algebra / Equations']});assert.deepEqual(state.generatorIds,['custom-two-step']);
 assert.equal(generatorTopicKey(state.generatorDefinitions[0]),'Algebra / Equations');
 assert.throws(()=>createPracticeState('all','empty',catalog,{topics:[]}));
});
test('teachers can add a two-step generator, mix it into Foundation Building, and preserve order and placement',()=>{
 const catalog=fresh();assert.ok(managedGeneratorIds(catalog.modules[0],catalog).includes('one-step-inequalities-v1'));
 catalog.generators.push(custom());catalog.modules[0].generatorIds.push('custom-two-step');catalog.modules[0].topic='Equations';catalog.modules.reverse();
 const saved=validatePracticeCatalog(catalog,taxonomy),foundation=saved.modules.find(module=>module.id==='foundation');assert.equal(foundation.topic,'Equations');assert.ok(managedGeneratorIds(foundation,saved).includes('custom-two-step'));
 assert.ok(managedGeneratorIds(saved.modules.find(module=>module.id==='all'),saved).includes('custom-two-step'));
 const state=createPracticeState('foundation','teacher-test',saved),question=generateCatalogQuestion(state.generatorDefinitions.find(item=>item.id==='custom-two-step'),3,state.seed);
 saved.generators.find(item=>item.id==='custom-two-step').settings.maxBoundary=1;foundation.published=false;
 assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);assert.deepEqual(generateCatalogQuestion(state.generatorDefinitions.find(item=>item.id==='custom-two-step'),3,state.seed),question);
});
test('generated one-step and two-step keys solve the displayed inequality, including negative coefficients and inclusive endpoints',()=>{
 const evaluate=(x,rel,y)=>rel==='>'?x>y:rel==='<'?x<y:rel==='>='?x>=y:x<=y;
 for(const kind of ['one-step','two-step'])for(const inclusive of [false,true])for(let index=0;index<300;index++){
  const generator=validateGenerator(custom({kind,settings:{...defaultGeneratorSettings,minOffset:-8,maxOffset:8,inclusive}})),q=generateCatalogQuestion(generator,index,'deterministic');
  const stem=q.prompt.match(/\\\[([^]*?)\\\]/)[1].replace(/\\geq /g,'>=').replace(/\\leq /g,'<=');
  const [,a,offset='',relation,right]=stem.match(/^(-?\d*)x([+-]\d+)?(>=|<=|>|<)(-?\d+)$/),coefficient=a==='-'?-1:a===''?1:Number(a);
  const choices=q.choices.map(choice=>choice.math.replace(/\\geq /g,'>=').replace(/\\leq /g,'<='));assert.equal(new Set(choices).size,4);
  const key=q.choices.find(choice=>choice.id===q.correctChoiceId).math.replace(/\\geq /g,'>=').replace(/\\leq /g,'<='),[,solution,b]=key.match(/^x(>=|<=|>|<)(-?\d+)$/);
  for(const x of [Number(b)-1,Number(b)-.5,Number(b),Number(b)+.5,Number(b)+1])assert.equal(evaluate(coefficient*x+Number(offset),relation,Number(right)),evaluate(x,solution,Number(b)),stem+' => '+key);
  assert.deepEqual(generateCatalogQuestion(generator,index,'deterministic'),q);
 }
});
test('invalid generators and empty published modules cannot be saved',()=>{
 assert.throws(()=>validateGenerator(custom({settings:{...defaultGeneratorSettings,minCoefficient:0}})));
 assert.throws(()=>validateGenerator(custom({settings:{...defaultGeneratorSettings,minOffset:0,maxOffset:0}})));
 for(const mutate of [c=>c.modules[0].generatorIds=['missing'],c=>{c.modules[0].generatorIds=[];},c=>c.modules[0].topic='Unknown',c=>c.generators.push(c.generators[0])]){const catalog=fresh();mutate(catalog);assert.throws(()=>validatePracticeCatalog(catalog,taxonomy));}
});
test('YouTube references accept video links only and normalize safe hosts',()=>{
 for(const link of ['https://youtu.be/abcdefghijk?t=2','https://www.youtube.com/watch?v=abcdefghijk','https://www.youtube.com/shorts/abcdefghijk'])assert.equal(youtubeVideoId(link),'abcdefghijk');
 for(const link of ['javascript:alert(1)','https://www.youtube.com.evil.test/watch?v=abcdefghijk','https://user:secret@youtube.com/watch?v=abcdefghijk','https://youtube.com/playlist?list=foo'])assert.equal(youtubeVideoId(link),null);
 const catalog=fresh();catalog.videos.push({id:'video',title:'Lesson',description:'',url:'https://youtu.be/abcdefghijk',category:'Algebra',topic:'Inequalities',published:true});assert.equal(validatePracticeCatalog(catalog,taxonomy).videos[0].url,'https://www.youtube.com/watch?v=abcdefghijk');
});

test('optional video details persist and reject invalid durations, counts and dates',()=>{
 const catalog=fresh(),video={id:'video-details',title:'Solving inequalities',description:'',url:'https://youtu.be/abcdefghijk',category:'Algebra',topic:'Inequalities',published:true,channelTitle:'The Magic Of Math',duration:'14:02',viewCount:22000,publishedAt:'2022-10-26'};
 catalog.videos.push(video);
 assert.deepEqual(validatePracticeCatalog(catalog,taxonomy).videos[0],{...video,url:'https://www.youtube.com/watch?v=abcdefghijk'});
 for(const patch of [{duration:'1:14:02'},{duration:''},{channelTitle:''},{publishedAt:''},{viewCount:0}])assert.doesNotThrow(()=>validatePracticeCatalog({...catalog,videos:[{...video,...patch}]},taxonomy));
 for(const patch of [{duration:'14:90'},{duration:'1:99:05'},{viewCount:-1},{viewCount:1.5},{viewCount:'22K'},{publishedAt:'2022-02-30'},{publishedAt:'invalid'},{channelTitle:'x'.repeat(161)}])assert.throws(()=>validatePracticeCatalog({...catalog,videos:[{...video,...patch}]},taxonomy));
});
const users={teacher:{id:'teacher',app_metadata:{role:'teacher'}},admin:{id:'admin',app_metadata:{role:'admin'}},student:{id:'student',app_metadata:{role:'student',class_ids:['shsat']}},outsider:{id:'outsider',app_metadata:{role:'student'}}};
function stub(file,exports){const id=require.resolve(file);require.cache[id]={id,filename:id,loaded:true,exports};}
stub('../src/lib/auth.ts',{getAuthenticatedUser:async header=>({user:users[header?.replace('Bearer ','')],error:'Sign in required'}),getEnrolledClassIds:metadata=>metadata.class_ids??[]});
stub('../src/lib/mathCommandCatalogStore.ts',{readMathCommandTaxonomy:()=>taxonomy});
let stored=null,storageFails=false;
stub('../src/lib/supabase.ts',{supabase:{from(){let mutation,filters=[];return {select(){return this;},eq(key,value){filters.push(row=>row[key]===value);return this;},insert(row){mutation={insert:row};return this;},update(row){mutation={update:row};return this;},async maybeSingle(){if(storageFails)return{data:null,error:{code:'PGRST205'}};if(mutation?.insert){if(stored)return{data:null,error:{code:'23505'}};stored=structuredClone(mutation.insert);}if(mutation?.update){if(!stored||!filters.every(filter=>filter(stored)))return{data:null,error:null};stored=structuredClone(mutation.update);}return{data:structuredClone(stored),error:null};}};}}});
let server,url;
before(async()=>{const express=require('express'),app=express();app.use(express.json());app.use('/api/infinite-practice',require('../src/routes/infinitePractice.ts').infinitePracticeRouter);server=await new Promise(resolve=>{const instance=app.listen(0,'127.0.0.1',()=>resolve(instance));});url=`http://127.0.0.1:${server.address().port}/api/infinite-practice/catalog`;});
after(async()=>new Promise(resolve=>server.close(resolve)));
async function call(token,body,manage=false){const response=await fetch(url+(manage?'?manage=1':''),{method:body?'PUT':'GET',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return{status:response.status,data:await response.json()};}
test('catalog permissions, durable saves, conflicts and student publication filtering',async()=>{
 assert.equal((await call('missing')).status,401);assert.equal((await call('outsider')).status,403);assert.equal((await call('student',null,true)).status,403);assert.equal((await call('student',{catalog:fresh(),revision:0})).status,403);
 const catalog=fresh();catalog.modules[2].published=false;catalog.videos=[{id:'draft-video',title:'Draft',description:'',url:'https://youtu.be/abcdefghijk',category:'Algebra',topic:'Inequalities',published:false}];
 const saved=await call('teacher',{catalog,revision:0});assert.equal(saved.status,200);assert.equal(saved.data.revision,1);
 assert.equal((await call('teacher',{catalog,revision:0})).status,409);assert.equal((await call('teacher',{catalog,revision:1})).status,200);assert.equal(stored.updated_by,'teacher');
 const student=await call('student');assert.equal(student.data.catalog.modules.length,catalog.modules.filter(module=>module.published).length);assert.equal(student.data.catalog.videos.length,0);
 const teacher=await call('admin',null,true);assert.equal(teacher.data.catalog.videos.length,1);assert.equal(teacher.data.taxonomy.categories,undefined);assert.equal(teacher.data.taxonomy[0].label,'Algebra');
 storageFails=true;assert.equal((await call('teacher')).status,503);assert.equal((await call('teacher',{catalog,revision:2})).status,503);storageFails=false;
});
