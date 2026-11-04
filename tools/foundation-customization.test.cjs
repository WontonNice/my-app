const {test}=require('node:test'),assert=require('node:assert/strict');
require('./register-practice-generator.cjs');
const {managedGeneratorIds,studentPracticeCatalog,defaultGeneratorSettings}=require('../server/src/shared/practiceCatalog.ts');
const {foundationOptions,foundationSelection,readFoundationPreferences,saveFoundationPreferences}=require('../client/src/features/math-command/foundationPreferences.ts');
const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
const {checkPracticeAnswer,nextPracticeQuestion,currentPracticeGeneratorId,withPracticeModuleTracking,hidePracticeGenerator}=require('../client/src/features/math-command/inequalitySession.ts');
const {savePractice,readSavedPractice,readPracticeProgress}=require('../client/src/features/math-command/practiceSessionStorage.ts');
const {practiceQuestion}=require('../client/src/features/math-command/practicePreview.ts');
const location={category:'Algebra',topic:'Inequalities'};
function fixture(){
 const group=(id,kind)=>({id,title:kind,description:'',...location,defaultType:kind,parentId:null,published:true,includeAll:false,generatorIds:[]});
 const child=(id,parentId,generatorIds,published=true)=>({id,title:id,description:'',...location,parentId,published,includeAll:false,generatorIds});
 return {modules:[group('f','foundation'),group('g','general'),child('module-a','f',['a','shared']),child('module-b','g',['b','shared']),child('hidden','g',['hidden'])].map(m=>m.id==='hidden'?{...m,published:false}:m),generators:['a','b','shared','other','hidden','disabled','foreign'].map(id=>({id,title:id,description:'',...location,...(id==='foreign'?{topic:'Algebraic Expressions'}:{}),kind:'one-step',enabled:id!=='disabled',settings:defaultGeneratorSettings})),videos:[]};
}
const storage=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value))};};
test('both modes share the full topic library regardless of legacy placement; only Foundation customizes modules',()=>{
 const c=fixture(),[f,g]=c.modules,full=['a','b','shared','other'];assert.deepEqual(managedGeneratorIds(f,c),full);assert.deepEqual(managedGeneratorIds(g,c),full);
 assert.deepEqual(foundationOptions(f,c).modules.map(m=>m.id),['module-a','module-b']);assert.deepEqual(foundationOptions(f,c).unassigned,['other']);
 assert.deepEqual(managedGeneratorIds(f,c,{childModuleIds:['module-b'],includeUnassigned:false}),['b','shared']);
 assert.deepEqual(managedGeneratorIds(f,c,{childModuleIds:[],includeUnassigned:false}),[]);
 assert.deepEqual(managedGeneratorIds(f,c,{childModuleIds:[]}),['other']);
 assert.deepEqual(managedGeneratorIds(g,c,{childModuleIds:[],includeUnassigned:false}),full);
 // Choosing a shared family in one module keeps it even when another module is unchecked.
 assert.deepEqual(managedGeneratorIds(f,c,{childModuleIds:['module-a'],includeUnassigned:false}),['a','shared']);
});
test('hidden/disabled content stays hidden after student filtering; enabling or publishing updates both modes',()=>{
 const c=fixture(),student=studentPracticeCatalog(c);assert.ok(!student.modules.some(m=>m.id==='hidden'));assert.ok(!student.generators.some(g=>g.id==='hidden'||g.id==='disabled'));
 for(const m of student.modules.slice(0,2))assert.deepEqual(managedGeneratorIds(m,student),managedGeneratorIds(m,c));
 c.modules.find(m=>m.id==='module-a').published=false;for(const m of c.modules.slice(0,2))assert.deepEqual(managedGeneratorIds(m,c),['b','shared','other']);
 c.modules.find(m=>m.id==='hidden').published=true;for(const m of c.modules.slice(0,2))assert.ok(managedGeneratorIds(m,c).includes('hidden'));
});
test('preferences persist per student and topic, exclude chosen modules, and include future modules by default',()=>{
 const s=storage(),c=fixture(),f=c.modules[0],prefs={excludedModuleIds:['module-a'],includeUnassigned:false};
 saveFoundationPreferences(s,'student-one',f.id,prefs);assert.deepEqual(readFoundationPreferences(s,'student-one',f.id),prefs);
 assert.deepEqual(readFoundationPreferences(s,'student-two',f.id),{excludedModuleIds:[],includeUnassigned:true});assert.deepEqual(readFoundationPreferences(s,'student-one','other-topic'),{excludedModuleIds:[],includeUnassigned:true});
 const saved=readFoundationPreferences(s,'student-one',f.id);assert.deepEqual(managedGeneratorIds(f,c,foundationSelection(f,c,saved)),['b','shared']);
 c.modules.push({...c.modules[3],id:'new-module',generatorIds:['other']});assert.deepEqual(managedGeneratorIds(f,c,foundationSelection(f,c,saved)),['b','shared','other']);
 c.modules=c.modules.filter(m=>m.id!=='module-a');assert.ok(!foundationSelection(f,c,saved).childModuleIds.includes('module-a'));
 assert.throws(()=>saveFoundationPreferences({setItem(){throw Error('Quota exceeded');}},'student-one',f.id,{excludedModuleIds:[],includeUnassigned:true}),/Quota/);assert.deepEqual(readFoundationPreferences(s,'student-one',f.id),prefs);
 assert.deepEqual(readFoundationPreferences({getItem:()=>'{broken'},'x','f'),{excludedModuleIds:[],includeUnassigned:true});
});
test('new custom sessions honor selections; resuming preserves questions and restarting preserves personal best',()=>{
 const s=storage(),c=fixture(),f=c.modules[0],state=createPracticeState(f.id,'old',c);state.longestStreak=8;state.checked=8;state.correct=8;state.index=8;savePractice(s,'student',state);const q=practiceQuestion(state);
 const selection={childModuleIds:['module-b'],includeUnassigned:false};saveFoundationPreferences(s,'student',f.id,{excludedModuleIds:['module-a'],includeUnassigned:false});assert.deepEqual(practiceQuestion(readSavedPractice(s,'student',f.id)),q);
 const fresh=createPracticeState(f.id,'new',c,selection);assert.deepEqual(fresh.generatorIds,['b','shared']);assert.deepEqual(parsePracticeState(JSON.stringify(fresh)),fresh);savePractice(s,'student',fresh);assert.equal(readPracticeProgress(s,'student',f.id).longestStreak,8);
 assert.throws(()=>createPracticeState(f.id,'empty',c,{childModuleIds:[],includeUnassigned:false}),/enabled/);
 assert.equal(parsePracticeState(JSON.stringify({...fresh,moduleSelection:{includeUnassigned:'no'}})),null);
});
test('module streaks earn five separate milestones, survive mistakes and reloads, and remain account-scoped',()=>{
 const c=fixture();c.generators=c.generators.filter(g=>['a','b'].includes(g.id));c.modules=c.modules.filter(m=>['f','g','module-a','module-b'].includes(m.id));c.modules.find(m=>m.id==='module-a').generatorIds=['a'];c.modules.find(m=>m.id==='module-b').generatorIds=['b'];
 const s=storage();let state=createPracticeState('f','module-stars',c);assert.equal(state.practiceMode,'foundation');
 for(let n=1;n<=50;n++){
  const id=currentPracticeGeneratorId(state),moduleId=id==='a'?'module-a':'module-b';
  state=checkPracticeAnswer({...state,answer:'A'},true);assert.deepEqual(checkPracticeAnswer(state,true),state);
  const count=Math.ceil(n/2);assert.equal(state.moduleStreaks[moduleId],count);savePractice(s,'alice',state);
  if(n%10===0){const expected=n/10;for(const m of ['module-a','module-b'])assert.equal([5,10,15,20,25].filter(target=>readPracticeProgress(s,'alice',m).longestStreak>=target).length,expected);}
  state=nextPracticeQuestion(state);
 }
 const id=currentPracticeGeneratorId(state),missed=id==='a'?'module-a':'module-b',other=id==='a'?'module-b':'module-a';state=checkPracticeAnswer({...state,answer:'A'},false);
 assert.equal(state.moduleStreaks[missed],0);assert.equal(state.moduleStreaks[other],25);assert.equal(state.moduleLongestStreaks[missed],25);
 savePractice(s,'alice',state);assert.deepEqual(readSavedPractice(s,'alice','f'),state);assert.equal(readPracticeProgress(s,'bob',missed).longestStreak,0);
 savePractice(s,'alice',createPracticeState('f','restart',c,{childModuleIds:['module-b'],includeUnassigned:false}));assert.equal(readPracticeProgress(s,'alice',missed).longestStreak,25);
 const legacy=createPracticeState('f','legacy',c);delete legacy.moduleGeneratorIds;delete legacy.moduleTitles;delete legacy.moduleStreaks;delete legacy.moduleLongestStreaks;const q=practiceQuestion(legacy);const migrated=withPracticeModuleTracking(legacy,c);assert.deepEqual(practiceQuestion(migrated),q);assert.deepEqual(migrated.moduleStreaks,{});
 const invalid=structuredClone(state);invalid.moduleStreaks[missed]=26;assert.equal(parsePracticeState(JSON.stringify(invalid)),null);
});
test('shared generator answers count only toward selected modules; hiding no longer requires ten correct',()=>{
 const c=fixture();let state=createPracticeState('f','shared',c,{childModuleIds:['module-b'],includeUnassigned:false});
 while(currentPracticeGeneratorId(state)!=='shared')state=nextPracticeQuestion(checkPracticeAnswer({...state,answer:'A'},true));
 state=checkPracticeAnswer({...state,answer:'A'},true);assert.equal(state.moduleStreaks['module-a'],undefined);assert.ok(state.moduleStreaks['module-b']>0);
 assert.ok(hidePracticeGenerator(state,'shared').hiddenGeneratorIds.includes('shared'));
 const general=createPracticeState('g','all',c);assert.deepEqual(Object.keys(general.moduleGeneratorIds),['module-a','module-b']);
});
