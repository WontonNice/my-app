const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'generator-planner-test-'));
const fixture=require('../../tools/math-command-fixture.cjs').install(root);
const {mathCommandRouter}=require('../src/routes/mathCommand.ts');
const {handleMathCatalogRequest}=require('../src/lib/mathCommandCatalogService.ts');
const store=require('../src/lib/mathCommandCatalogStore.ts');
const {generatorBatchExport}=require('../../client/src/features/math-command/generatorBatchExport.ts');
const {defaultPracticeCatalog,assignPracticeModuleSkill,validatePracticeCatalog,reconcilePracticeSkilled}=require('../src/shared/practiceCatalog.ts');
const express=require('express');
const app=express();app.use(express.json());app.use('/api/math-command',mathCommandRouter);app.use((error,req,res,next)=>res.status(error.status||500).json({message:error.message}));
let server,url;
before(async()=>{server=await new Promise(resolve=>{const instance=app.listen(0,'127.0.0.1',()=>resolve(instance));});url=`http://127.0.0.1:${server.address().port}/api/math-command/generator-planner`;});
after(()=>{server.close();fs.rmSync(root,{recursive:true,force:true});});
const call=(actor,body)=>handleMathCatalogRequest({root,actor,method:body?'POST':'GET',pathname:'/generator-planner',body});
const mutate=(actor,state,action)=>call(actor,{...action,revision:state.revision});

test('personal batches retain source snapshots, deduplicate additions and protect ownership/revisions',()=>{
  const content=fs.readFileSync(path.join(root,'server/data/exam-content.json'),'utf8'),classification=store.mathClassificationRevision(root);
  let own=call('planner-one');
  own=mutate('planner-one',own,{action:'create',name:'Mixed topic builds'});
  const batchId=own.activeBatchId,ids=fixture.data.questions.slice(0,3).map(q=>q.id);
  own=mutate('planner-one',own,{action:'add',batchId,questionIds:ids});
  assert.equal(own.batches[0].entries.length,3);
  assert.ok(own.batches[0].entries.every(entry=>entry.status==='available'));
  own=mutate('planner-one',own,{action:'export',batchId,entryIds:own.batches[0].entries.map(entry=>entry.id)});
  assert.ok(own.batches[0].entries.every(entry=>entry.status==='available'),'export keeps the requested student availability');
  own=mutate('planner-one',own,{action:'add',batchId,questionIds:ids});
  assert.equal(own.batches[0].entries.length,3);
  assert.deepEqual(own.batches[0].entries[0].source.question,store.readMathCommandCatalog(root).find(q=>q.id===ids[0]).question);
  assert.deepEqual(call('planner-two').batches,[]);
  assert.throws(()=>mutate('planner-two',call('planner-two'),{action:'activate',batchId}),/not in your planner/);
  assert.throws(()=>call('planner-one',{revision:'new',action:'delete',batchId}),/another window/);
  const before=call('planner-one');
  assert.throws(()=>mutate('planner-one',before,{action:'add',batchId,questionIds:['missing-question']}),/unavailable/);
  assert.deepEqual(call('planner-one'),before,'failed additions are atomic');
  const entries=own.batches[0].entries.toReversed().map(entry=>({...entry,source:{question:{prompt:'forged'}},notes:'Include negative coefficients.',destination:{...entry.destination,moduleTitle:'Equations'},status:'draft'}));
  own=mutate('planner-one',own,{action:'update',batchId,name:'Saved batch',notes:'Shared instructions',entries});
  assert.equal(own.batches[0].entries[0].source.id,ids[2]);
  assert.notEqual(own.batches[0].entries[0].source.question.prompt,'forged');
  assert.equal(own.batches[0].entries[0].notes,'Include negative coefficients.');
  own=mutate('planner-one',own,{action:'export',batchId,entryIds:[entries[0].id]});
  assert.equal(own.batches[0].entries[0].status,'exported');
  assert.equal(own.batches[0].entries[1].status,'draft');
  const duplicated=mutate('planner-one',own,{action:'duplicate',batchId,name:'Next session'});
  assert.equal(duplicated.batches[1].entries[0].status,'draft');
  assert.notEqual(duplicated.batches[1].entries[0].id,duplicated.batches[0].entries[0].id);
  assert.equal(store.mathClassificationRevision(root),classification);
  assert.equal(fs.readFileSync(path.join(root,'server/data/exam-content.json'),'utf8'),content);
});

test('batch export carries all sources, exact module IDs, instructions and refuses stale destinations',()=>{
  const batch=call('planner-one').batches[0],taxonomy=store.readMathCommandTaxonomy(root),catalog=defaultPracticeCatalog(taxonomy);
  const target=catalog.modules.find(m=>m.category===batch.entries[0].destination.category&&m.topic===batch.entries[0].destination.topic&&m.defaultType==='general');
  assert.ok(target);
  batch.entries[0].destination.moduleId=target.id;
  batch.entries[0].destination.moduleTitle='Stale display name';
  const result=generatorBatchExport(batch,batch.entries,catalog,taxonomy.categories);
  assert.equal(result.manifest.requests.length,3);
  assert.equal(result.manifest.requests[0].destination.moduleId,target.id);
  assert.equal(result.manifest.requests[0].destination.moduleTitle,target.title);
  assert.equal(result.manifest.requests[0].requestId,batch.entries[0].id);
  assert.deepEqual(result.manifest.requests[0].source.question,batch.entries[0].source.question);
  assert.match(result.prompt,/Shared instructions/);assert.match(result.prompt,/Include negative coefficients/);
  assert.match(result.prompt,/automatically enable them for practice modules/);
  assert.match(result.prompt,/--enable/);
  assert.match(result.prompt,/Keep new generators unreviewed/);
  assert.match(result.prompt,/preserve existing review statuses/);
  assert.ok(result.manifest.requests.every(request=>request.publishAfterValidation===false));
  const available=generatorBatchExport(batch,batch.entries.map(entry=>({...entry,status:'available'})),catalog,taxonomy.categories);
  assert.ok(available.manifest.requests.every(request=>request.publishAfterValidation===true));
  assert.match(available.prompt,/publish its destination module and any parent needed for student discovery/);
  assert.doesNotMatch(available.prompt,/keep any newly created modules hidden until review/);
  assert.throws(()=>generatorBatchExport(batch,batch.entries,{...catalog,modules:catalog.modules.filter(m=>m.id!==target.id)},taxonomy.categories),/destination module changed/);
  assert.throws(()=>generatorBatchExport(batch,[],catalog,taxonomy.categories),/Select at least/);
  const incomplete=structuredClone(batch.entries[1]);incomplete.destination.moduleTitle='';
  assert.throws(()=>generatorBatchExport(batch,[incomplete],catalog,taxonomy.categories),/name the new module/);
});

test('renaming remains independent of skill assignment, reconciliation and validation',()=>{
  const taxonomy=require('../../tools/math-topics.json'),catalog=defaultPracticeCatalog(taxonomy);
  const module=catalog.modules.find(m=>!m.defaultType);
  module.title='My custom practice name';module.titleMode='custom';
  const skill={id:'qa-custom-skill',label:'Different skill title',category:module.category,subcategory:module.topic};
  const assigned=assignPracticeModuleSkill(catalog,module.id,skill);
  const validated=validatePracticeCatalog(reconcilePracticeSkilled(assigned,[skill]),{...taxonomy,classificationSkills:[skill]});
  const saved=validated.modules.find(m=>m.id===module.id);
  assert.equal(saved.title,'My custom practice name');assert.equal(saved.skilled,skill.id);assert.deepEqual(saved.generatorIds,module.generatorIds);
});

test('authenticated endpoints reject students and save teacher changes durably without assignments',async()=>{
  async function request(token,body){const res=await fetch(url,{method:body?'POST':'GET',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:res.status,body:await res.json()};}
  assert.equal((await request('student')).status,403);
  assert.equal((await request('student',{revision:'new',action:'create',name:'denied'})).status,403);
  let own=(await request('teacher')).body;
  let saved=await request('teacher',{revision:own.revision,action:'create',name:'API batch'});
  assert.equal(saved.status,200);own=saved.body;
  assert.deepEqual((await request('teacher')).body,own);
  const stale=await request('teacher',{revision:'new',action:'delete',batchId:own.activeBatchId});assert.equal(stale.status,409);
  assert.deepEqual(fixture.db.tables.student_assignments,[]);
  const invalid=await request('teacher',{revision:own.revision,action:'add',batchId:own.activeBatchId,questionIds:Array(101).fill('q')});assert.equal(invalid.status,400);
});

test('remote persistence rejects failed writes and simultaneous stale saves',async()=>{
  const {createMathCommandPersistence}=require('../src/lib/mathCommandPersistence.ts');
  const persistence=createMathCommandPersistence(fixture.db);
  const read=()=>persistence.run(root,()=>call('remote-planner'));
  async function save(name){return persistence.run(root,async()=>{
    const own=call('remote-planner'),next=mutate('remote-planner',own,{action:'create',name});
    await persistence.persist(root);return next;
  });}
  const first=await save('Remote batch');
  assert.deepEqual(await read(),first);
  fixture.db.failNextMutation('math_command_metadata');
  await assert.rejects(()=>save('Must not be acknowledged'),/could not be loaded or saved/);
  assert.deepEqual(await read(),first);
  const parallel=await Promise.allSettled([save('Window A'),save('Window B')]);
  assert.equal(parallel.filter(item=>item.status==='fulfilled').length,1);
  assert.equal(parallel.filter(item=>item.status==='rejected').length,1);
  assert.equal((await read()).batches.length,2);
});

test('studio handoff opens the account planner and carries only the source selection',async()=>{
  const {generatorPlannerQuery,plannerQuestionIds}=require('../../client/src/features/math-command/generatorPlannerNavigation.ts');
  const {teacherDestination}=await import('../../tools/teacher-workspace.mjs');
  const ids=['question & one','question/two','question & one'];
  const url=new URL(teacherDestination('http://localhost:5173',generatorPlannerQuery(ids)));
  assert.equal(url.pathname,'/teacher/math-command');
  assert.equal(url.searchParams.get('tab'),'planner');
  assert.deepEqual(plannerQuestionIds(url.search),ids.slice(0,2));
  assert.deepEqual([...new Set(url.searchParams.keys())],['tab','plannerQuestionId']);
  assert.equal(plannerQuestionIds('?plannerQuestionId=&plannerQuestionId='+ 'x'.repeat(501)).length,0);
  assert.throws(()=>generatorPlannerQuery(Array.from({length:110},(_,i)=>String(i))),/at most 100/);
  assert.throws(()=>generatorPlannerQuery(Array.from({length:100},(_,i)=>String(i)+'x'.repeat(500))),/too large/);
});

test('planner notifications refresh visible tabs without sharing data and clean up subscriptions',()=>{
  const {notifyPlannerChanged,subscribePlannerChanges}=require('../../client/src/features/math-command/generatorPlannerSync.ts');
  const originals=Object.fromEntries(['window','document','BroadcastChannel'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  const channels=new Set(),messages=[],timers=new Map();let refreshes=0;
  class Channel extends EventTarget {
    constructor(){super();channels.add(this);}
    postMessage(data){messages.push(data);for(const peer of channels)if(peer!==this)peer.dispatchEvent(new Event('message'));}
    close(){channels.delete(this);}
  }
  try {
    globalThis.window=Object.assign(new EventTarget(),{setInterval:fn=>{timers.set(1,fn);return 1;},clearInterval:id=>timers.delete(id)});
    globalThis.document=Object.assign(new EventTarget(),{visibilityState:'visible'});
    globalThis.BroadcastChannel=Channel;
    const unsubscribe=subscribePlannerChanges(()=>refreshes++);
    notifyPlannerChanged();assert.ok(refreshes>0);assert.deepEqual(messages,['changed']);
    let before=refreshes;window.dispatchEvent(new Event('focus'));assert.equal(refreshes,before+1);
    document.visibilityState='hidden';before=refreshes;notifyPlannerChanged();timers.get(1)();assert.equal(refreshes,before);
    document.visibilityState='visible';document.dispatchEvent(new Event('visibilitychange'));assert.equal(refreshes,before+1);
    before=refreshes;timers.get(1)();assert.equal(refreshes,before+1);
    unsubscribe();before=refreshes;window.dispatchEvent(new Event('focus'));notifyPlannerChanged();assert.equal(refreshes,before);assert.equal(channels.size,0);assert.equal(timers.size,0);
    globalThis.BroadcastChannel=class {constructor(){throw new Error('Storage blocked');}};
    assert.doesNotThrow(notifyPlannerChanged,'a saved change remains successful if cross-tab notifications are blocked');
    const fallback=subscribePlannerChanges(()=>refreshes++);before=refreshes;window.dispatchEvent(new Event('focus'));assert.equal(refreshes,before+1);fallback();
  } finally {
    for(const [key,descriptor]of Object.entries(originals))if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];
  }
});
