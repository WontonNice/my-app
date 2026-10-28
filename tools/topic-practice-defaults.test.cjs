const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require(require.resolve('ts-node',{paths:[path.resolve(__dirname,'../server')]})).register({transpileOnly:true,project:path.resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {defaultPracticeCatalog,ensureTopicPracticeModules,validatePracticeCatalog,practiceModuleKind,topicPracticeModuleId,managedGeneratorIds,movePracticeModule,removePracticeGenerator}=require('../server/src/shared/practiceCatalog.ts');
const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
const {studioResourceGroups,studioMatches}=require('../client/src/features/math-command/studioOrganization.ts');
const taxonomy=require('./math-topics.json');

test('every topic receives exactly one Foundation Building and General Practice, including empty topics',()=>{
 const catalog=validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy);
 for(const category of taxonomy.categories)for(const topic of category.topics){
  const modules=catalog.modules.filter(module=>module.category===category.label&&module.topic===topic);
  for(const kind of ['foundation','general'])assert.equal(modules.filter(module=>practiceModuleKind(module)===kind).length,1,category.label+' / '+topic+' / '+kind);
 }
 assert.deepEqual(ensureTopicPracticeModules(catalog,taxonomy),catalog);
 const empty=catalog.modules.find(module=>module.topic==='Fractions & Decimals'&&practiceModuleKind(module)==='general');
 assert.equal(empty.published,true);assert.deepEqual(managedGeneratorIds(empty,catalog),[]);
 assert.throws(()=>createPracticeState(empty.id,'empty',catalog));
 assert.equal(catalog.modules.find(module=>module.id==='all').title,'General Practice');
});

test('migration retains legacy IDs, nested modules, curated selections, hidden state and resources',()=>{
 const original=defaultPracticeCatalog();original.modules=original.modules.filter(module=>!module.id.startsWith('foundation-')&&!module.id.startsWith('general-'));
 delete original.modules[0].defaultType;delete original.modules[1].defaultType;original.modules[1].title='All Question Types';
 const nested=movePracticeModule(original,'inequalities','foundation');nested.modules.find(module=>module.id==='all').published=false;
 const before=structuredClone(nested),next=ensureTopicPracticeModules(nested,taxonomy);
 assert.deepEqual(nested,before);assert.deepEqual(next.generators,nested.generators);assert.deepEqual(next.videos,nested.videos);
 assert.deepEqual(next.modules.find(module=>module.id==='foundation').generatorIds,nested.modules.find(module=>module.id==='foundation').generatorIds);
 assert.equal(next.modules.find(module=>module.id==='inequalities').parentId,'foundation');
 assert.equal(next.modules.find(module=>module.id==='all').published,false);
 assert.deepEqual(ensureTopicPracticeModules(next,taxonomy),next);
});

test('General Practice automatically follows enabled generators only in its own topic',()=>{
 const catalog=defaultPracticeCatalog(taxonomy),general=catalog.modules.find(module=>module.topic==='Overlapping Groups'&&practiceModuleKind(module)==='general');
 const startingIds=catalog.generators.filter(generator=>generator.category===general.category&&generator.topic===general.topic&&generator.enabled).map(generator=>generator.id);
 assert.deepEqual(managedGeneratorIds(general,catalog),startingIds);
 catalog.generators.push({...catalog.generators.find(generator=>generator.id==='overlapping-groups-v1'),id:'extra-overlap'});
 assert.deepEqual(managedGeneratorIds(general,catalog),[...startingIds,'extra-overlap']);
 catalog.generators.at(-1).enabled=false;
 assert.deepEqual(managedGeneratorIds(general,catalog),startingIds);
 const state=createPracticeState(general.id,'snapshot',catalog);
 assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);
 assert.equal(state.moduleTitle,'General Practice');
 assert.deepEqual(managedGeneratorIds(catalog.modules.find(module=>module.id==='all'),catalog).includes('overlapping-groups-v1'),false);
});

test('each foundation accepts only its own topic modules and empty defaults remain available',()=>{
 const catalog=defaultPracticeCatalog(taxonomy),foundation=catalog.modules.find(module=>module.topic==='Overlapping Groups'&&practiceModuleKind(module)==='foundation');
 const moved=movePracticeModule(catalog,'2021-2022-form-a-q76',foundation.id);
 assert.equal(moved.modules.find(module=>module.id==='2021-2022-form-a-q76').parentId,foundation.id);
 const groupedIds=catalog.modules.find(module=>module.id==='2021-2022-form-a-q76').generatorIds;
 const directIds=managedGeneratorIds(foundation,catalog).filter(id=>!groupedIds.includes(id));
 assert.deepEqual(managedGeneratorIds(moved.modules.find(module=>module.id===foundation.id),moved,{childModuleIds:[]}),directIds);
 assert.deepEqual(new Set(managedGeneratorIds(moved.modules.find(module=>module.id===foundation.id),moved)),new Set([...directIds,...groupedIds]));
 assert.throws(()=>movePracticeModule(catalog,'inequalities',foundation.id));
 assert.throws(()=>movePracticeModule(catalog,foundation.id,'foundation'));
 const removed=removePracticeGenerator(catalog,'overlapping-groups-v1');
 assert.equal(removed.modules.find(module=>module.id===foundation.id).published,true);
 assert.doesNotThrow(()=>validatePracticeCatalog(removed,taxonomy));
});

test('studio grouping and filters remain usable with hundreds of resources',()=>{
 const catalog=defaultPracticeCatalog(taxonomy),base=catalog.generators[0];
 const resources=Array.from({length:400},(_,index)=>({...base,id:'resource-'+index,title:'Generator '+index,description:'Practice',category:index%2?'Algebra':'Statistics and Probability',topic:index%2?'Inequalities':'Overlapping Groups'}));
 const groups=studioResourceGroups(resources,'','Statistics and Probability','Overlapping Groups');
 assert.equal(groups.length,1);assert.equal(groups[0].count,200);
 assert.equal(studioResourceGroups(resources,'resource-399')[0].count,1);
 assert.equal(studioResourceGroups(resources,'missing').length,0);
 assert.equal(studioMatches(resources[0],'GENERATOR 0'),true);
 const ids=new Set(taxonomy.categories.flatMap(category=>category.topics.flatMap(topic=>['foundation','general'].map(kind=>topicPracticeModuleId(category.label,topic,kind)))));
 assert.equal(ids.size,taxonomy.categories.reduce((sum,category)=>sum+category.topics.length*2,0));
 assert.ok([...ids].every(id=>/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(id)));
});

test('individual modules default to their own General Practice and keep explicit Foundation placement',()=>{
 const catalog=defaultPracticeCatalog(taxonomy);
 for(const module of catalog.modules.filter(module=>!practiceModuleKind(module))){
  const parent=catalog.modules.find(item=>item.id===module.parentId);
  assert.equal(practiceModuleKind(parent),module.topic==='Probability'?'foundation':'general');assert.equal(parent.category,module.category);assert.equal(parent.topic,module.topic);
 }
 const legacy=structuredClone(catalog);legacy.modules.find(item=>item.id==='2021-2022-form-a-q76').parentId=null;
 legacy.modules.push({...legacy.modules.find(item=>item.id==='2021-2022-form-a-q76'),id:'2025-2026-form-a-math-5',generatorIds:['overlapping-survey-totals-v1']});
 const foundation=legacy.modules.find(module=>module.topic==='Overlapping Groups'&&practiceModuleKind(module)==='foundation');
 const assigned=ensureTopicPracticeModules(movePracticeModule(legacy,'2025-2026-form-a-math-5',foundation.id),taxonomy);
 assert.equal(assigned.modules.find(item=>item.id==='2025-2026-form-a-math-5').parentId,foundation.id);
 assert.equal(practiceModuleKind(assigned.modules.find(item=>item.id===assigned.modules.find(module=>module.id==='2021-2022-form-a-q76').parentId)),'general');
 assert.deepEqual(ensureTopicPracticeModules(assigned,taxonomy),assigned);
 assert.equal(practiceModuleKind(assigned.modules.find(item=>item.id===movePracticeModule(assigned,'2025-2026-form-a-math-5',null).modules.find(module=>module.id==='2025-2026-form-a-math-5').parentId)),'general');
 assert.doesNotThrow(()=>validatePracticeCatalog(assigned,taxonomy));
});

test('General Practice settings honor selected and unpublished nested modules',()=>{
 const catalog=defaultPracticeCatalog(taxonomy),general=catalog.modules.find(module=>module.topic==='Overlapping Groups'&&practiceModuleKind(module)==='general');
 const child=catalog.modules.find(module=>module.id==='2021-2022-form-a-q76');
 assert.deepEqual(managedGeneratorIds(general,catalog,{childModuleIds:[child.id]}),child.generatorIds);
 assert.deepEqual(managedGeneratorIds(general,catalog,{childModuleIds:[]}),[]);
 child.published=false;
 assert.deepEqual(managedGeneratorIds(general,catalog),[]);
});
