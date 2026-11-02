const {test}=require('node:test'),assert=require('node:assert/strict');
require('./register-practice-generator.cjs');
const {createPracticeState,checkPracticeAnswer,nextPracticeQuestion,currentPracticeGeneratorId,hidePracticeGenerator,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
const {readSavedPractice,savePractice}=require('../client/src/features/math-command/practiceSessionStorage.ts');
const {defaultPracticeCatalog,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
const {inventory}=require('../server/src/shared/learningPlan.ts');
const {filterContentInventory}=require('../client/src/lib/passageOrganization.ts');
const {resolveMathQuestionLink}=require('./content-studio-question-link.js');
function session(){const catalog=defaultPracticeCatalog();const module=catalog.modules.find(m=>m.id==='all');module.includeAll=false;const state=createPracticeState(module.id,'test',catalog);state.generatorIds=state.generatorIds.slice(0,2);state.generatorDefinitions=state.generatorDefinitions.filter(g=>state.generatorIds.includes(g.id));return state;}
const answer=(state,correct)=>checkPracticeAnswer({...state,answer:'A'},correct);
test('ten correct per generator unlocks independently, wrong answers reset only that type, checking twice is inert',()=>{
 let state=session(),[a,b]=state.generatorIds;
 for(let i=0;i<19;i++){const id=currentPracticeGeneratorId(state);state=answer(state,id===a);assert.deepEqual(checkPracticeAnswer(state,true),state);if(i<18)state=nextPracticeQuestion(state);}
 assert.equal(state.generatorStreaks[a],10);assert.equal(state.generatorStreaks[b],0);assert.deepEqual(state.unlockedGeneratorIds,[a]);assert.equal(hidePracticeGenerator(state,b),state);
 const saved=parsePracticeState(JSON.stringify(state));assert.deepEqual(saved,state);
 state=hidePracticeGenerator(state,a);assert.deepEqual(state.hiddenGeneratorIds,[a]);
 for(let i=0;i<10;i++){state=nextPracticeQuestion(state);assert.equal(currentPracticeGeneratorId(state),b);const q=generateCatalogQuestion(state.generatorDefinitions.find(g=>g.id===b),Math.floor(state.sequenceIndex/state.generatorIds.length),state.seed);assert.ok(q.id.endsWith(':'+Math.floor(state.sequenceIndex/2)));state=answer(state,true);}
 assert.equal(state.generatorStreaks[b],10);assert.equal(state.checked,29);assert.equal(state.index,28);
 state=hidePracticeGenerator(state,b);assert.equal(state.finished,true);assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);assert.equal(nextPracticeQuestion(state),state);
});
test('unlock persists after a later miss; unfinished current questions cannot be hidden',()=>{
 let state=createPracticeState('inequalities','one');for(let i=0;i<10;i++)state=nextPracticeQuestion(answer(state,true));const id=currentPracticeGeneratorId(state);
 assert.equal(hidePracticeGenerator(state,id),state);state=answer(state,false);assert.equal(state.generatorStreaks[id],0);assert.ok(state.unlockedGeneratorIds.includes(id));
 assert.equal(hidePracticeGenerator(state,id).finished,true);
 assert.equal(parsePracticeState(JSON.stringify({...state,hiddenGeneratorIds:['not-a-generator']})),null);
 assert.equal(parsePracticeState(JSON.stringify({...state,sequenceIndex:-1})),null);
});
test('saved sessions survive reopening with answers, streaks and snapshots; accounts and modules are isolated',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 let state=session();state=answer(state,true);savePractice(storage,'alice',state);
 assert.deepEqual(readSavedPractice(storage,'alice',state.moduleId),state);assert.deepEqual(readSavedPractice(storage,'alice'),state);
 assert.equal(readSavedPractice(storage,'bob',state.moduleId),null);assert.equal(readSavedPractice(storage,'alice','other-module'),null);
 const old=createPracticeState('inequalities','legacy');assert.deepEqual(parsePracticeState(JSON.stringify(old)),old);
 savePractice(storage,'alice',{...state,finished:true});assert.equal(readSavedPractice(storage,'alice'),null);
 assert.throws(()=>savePractice({setItem(){throw Error('quota');}},'alice',state),/quota/);
});
test('passage scores retain zero, ignore invalid/missing scores, and choose latest scored evidence',()=>{
 const content={id:'p',kind:'passage',title:'Passage',subject:'English',skills:[],aliases:['p'],passageCategory:'official_handbook'};
 const rows=inventory([content],[],[{contentId:'p',at:'2026-01-01',correct:4,total:5,source:'library'},{contentId:'p',at:'2026-02-01',correct:0,total:5,source:'exam'},{contentId:'p',at:'2026-03-01',source:'teacher'},{contentId:'p',at:'2026-04-01',correct:1,total:0,source:'library'}]);
 assert.deepEqual(rows[0].latestScore,{correct:0,total:5,at:'2026-02-01'});assert.equal(rows[0].lastCompletedAt,'2026-04-01');
 const other={...rows[0],content:{...content,id:'prestige',title:'Other',passageCategory:'prestige'},latestScore:{correct:4,total:5,at:'2026-05-01'},lastCompletedAt:'2026-05-01'};
 const missing={...other,content:{...content,id:'unscored'},latestScore:null,lastCompletedAt:null};
 const filters={kind:'passage',subject:'English',status:'',category:'',genre:'',skill:'',search:'',sort:'score',direction:'asc'};
 assert.deepEqual(filterContentInventory([...rows,other,missing],filters).map(r=>r.content.id),['p','prestige','unscored']);
 assert.deepEqual(filterContentInventory([...rows,other],{...filters,category:'prestige',score:'atleast70'}).map(r=>r.content.id),['prestige']);
 assert.equal(filterContentInventory([...rows,other],{...filters,score:'below70'})[0].latestScore.correct,0);
 assert.equal(filterContentInventory([...rows,other,missing],{...filters,score:'unscored'}).length,1);
 assert.deepEqual(filterContentInventory([...rows,other,missing],{...filters,sort:'completed',direction:'desc'}).map(r=>r.content.id),['prestige','p','unscored']);
 const earlier={...rows[0],lastCompletedAt:'2026-05-01T01:00:00+02:00'},later={...other,lastCompletedAt:'2026-04-30T23:30:00Z'};
 assert.deepEqual(filterContentInventory([earlier,later],{...filters,sort:'completed',direction:'desc'}).map(r=>r.content.id),['prestige','p']);
 const assignments=[{kind:'passage',contentId:'p',createdAt:'2026-05-01',status:'completed',completedAt:'2026-06-01',completion:{at:'2026-05-31',correct:3,total:5}},{kind:'passage',contentId:'p',createdAt:'2026-06-01',status:'in_progress',completion:{at:'2026-07-01',correct:5,total:5}}];
 assert.deepEqual(inventory([content],assignments,rows[0].evidence)[0].latestScore,{correct:3,total:5,at:'2026-06-01'});
});
test('editor links resolve exact stable question IDs, prefer assessment context, and do not guess missing questions',()=>{
 const exams=[{id:'a'},{id:'b'}],section=id=>({questions:[{id:id==='a'?'first':'second'},{id:'shared'}]});
 assert.deepEqual(resolveMathQuestionLink(exams,section,'second','a'),{assessmentId:'b',questionId:'second'});
 assert.deepEqual(resolveMathQuestionLink(exams,section,'shared','b'),{assessmentId:'b',questionId:'shared'});
 assert.equal(resolveMathQuestionLink(exams,section,'missing','a'),null);
});
