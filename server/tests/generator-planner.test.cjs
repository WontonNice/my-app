const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'generator-planner-test-'));
const fixture=require('../../tools/math-command-fixture.cjs').install(root);
const {mathCommandRouter}=require('../src/routes/mathCommand.ts');
const {handleMathCatalogRequest}=require('../src/lib/mathCommandCatalogService.ts');
const store=require('../src/lib/mathCommandCatalogStore.ts');
const {generatorBatchExport}=require('../../client/src/features/math-command/generatorBatchExport.ts');
const {plannerModuleChoices}=require('../../client/src/features/math-command/plannerModuleChoices.ts');
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
  assert.equal(own.batches[0].entries.length,3);assert.ok(own.batches[0].entries.every(entry=>entry.destination.group==='foundation'));
  assert.ok(own.batches[0].entries.every(entry=>entry.status==='draft' && entry.publishAfterValidation===false));
  own=mutate('planner-one',own,{action:'export',batchId,entryIds:own.batches[0].entries.map(entry=>entry.id)});
  assert.ok(own.batches[0].entries.every(entry=>entry.status==='exported' && entry.publishAfterValidation===false),'export advances workflow without changing publication intent');
  own=mutate('planner-one',own,{action:'add',batchId,questionIds:ids});
  assert.equal(own.batches[0].entries.length,3);assert.ok(own.batches[0].entries.every(entry=>entry.destination.group==='foundation'));
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

test('saved new modules can be reused by later questions and export to the same destination',()=>{
  const actor='planner-reuse';
  let state=mutate(actor,call(actor),{action:'create',name:'Reusable modules'});
  const batchId=state.activeBatchId,ids=fixture.data.questions.slice(0,2).map(question=>question.id);
  state=mutate(actor,state,{action:'add',batchId,questionIds:[ids[0]]});
  let batch=state.batches[0];
  batch.entries[0].destination.moduleTitle='Factors & Multiples';
  batch.entries[0].destination.group='foundation';
  state=mutate(actor,state,{action:'update',batchId,name:batch.name,notes:batch.notes,entries:batch.entries});
  state=mutate(actor,call(actor),{action:'add',batchId,questionIds:[ids[1]]});
  batch=state.batches[0];
  const choices=plannerModuleChoices(batch.entries);
  assert.equal(choices.length,1);
  assert.equal(choices[0].destination.moduleTitle,'Factors & Multiples');
  batch.entries[1].destination={...choices[0].destination};
  mutate(actor,state,{action:'update',batchId,name:batch.name,notes:batch.notes,entries:batch.entries});
  batch=call(actor).batches[0];
  assert.equal(plannerModuleChoices(batch.entries).length,1,'shared destinations appear once after reloading');
  assert.deepEqual(batch.entries[0].destination,batch.entries[1].destination);
  const taxonomy=store.readMathCommandTaxonomy(root),catalog=defaultPracticeCatalog(taxonomy);
  const {requests}=generatorBatchExport(batch,batch.entries,catalog,taxonomy.categories).manifest;
  for(const request of requests){
    assert.equal(request.destination.moduleId,null);
    assert.equal(request.destination.moduleTitle,'Factors & Multiples');
    assert.equal(request.destination.groupType,'foundation');
    assert.equal(request.destination.parentId,requests[0].destination.parentId);
  }
  const first=batch.entries[0];
  assert.equal(plannerModuleChoices([
    first,{...first,destination:{...first.destination,moduleTitle:' Factors & Multiples '}},
    {...first,destination:{...first.destination,group:'general'}},
    {...first,destination:{...first.destination,topic:'Another topic'}},
    {...first,destination:{...first.destination,moduleId:'existing-module'}},
    {...first,destination:{...first.destination,moduleTitle:'  '}},
  ]).length,3,'same names in different topics/groups remain distinct; blank/existing destinations are excluded');
  assert.deepEqual(plannerModuleChoices([]),[],'choices stay scoped to the current batch');
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
  assert.match(result.prompt,/disabled and unreviewed/);
  assert.match(result.prompt,/--enable/);
  assert.match(result.prompt,/matching review approval/);
  assert.match(result.prompt,/Never use --enable to bypass/);
  assert.ok(result.manifest.requests.every(request=>request.publishAfterValidation===false));
  const available=generatorBatchExport(batch,batch.entries.map(entry=>({...entry,publishAfterValidation:true})),catalog,taxonomy.categories);
  assert.ok(available.manifest.requests.every(request=>request.publishAfterValidation===true));
  assert.match(available.prompt,/every newly requested family in that module has passed validation and review/);
  assert.match(available.prompt,/false keeps new modules hidden for review/);
  assert.throws(()=>generatorBatchExport(batch,batch.entries,{...catalog,modules:catalog.modules.filter(m=>m.id!==target.id)},taxonomy.categories),/destination module changed/);
  assert.throws(()=>generatorBatchExport(batch,[],catalog,taxonomy.categories),/Select at least/);
  const incomplete=structuredClone(batch.entries[1]);incomplete.destination.moduleTitle='';
  assert.throws(()=>generatorBatchExport(batch,[incomplete],catalog,taxonomy.categories),/name the new module/);
});

test('selecting a skill replaces the draft name and persists the skill name and Foundation placement',()=>{
  const taxonomy=require('../../tools/math-topics.json'),catalog=defaultPracticeCatalog(taxonomy);
  const module=catalog.modules.find(m=>!m.defaultType);
  module.title='My custom practice name';module.titleMode='custom';
  const skill={id:'qa-custom-skill',label:'Different skill title',category:module.category,subcategory:module.topic};
  const assigned=assignPracticeModuleSkill(catalog,module.id,skill);
  const validated=validatePracticeCatalog(reconcilePracticeSkilled(assigned,[skill]),{...taxonomy,classificationSkills:[skill]});
  const saved=validated.modules.find(m=>m.id===module.id);
  assert.equal(saved.title,skill.label);assert.equal(saved.titleMode,'skill');assert.equal(validated.modules.find(m=>m.id===saved.parentId).defaultType,'foundation');assert.equal(saved.skilled,skill.id);assert.deepEqual(saved.generatorIds,module.generatorIds);
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
  await assert.rejects(()=>save('Must not be acknowledged'),/could not be confirmed saved/);
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

test('destination labels include every module in the category and saved skills without duplicate labels',()=>{
  const {plannerExistingModuleGroups,plannerModuleDestination,plannerSkillDestination}=require('../../client/src/features/math-command/plannerModuleChoices.ts');
  const catalog=defaultPracticeCatalog(require('../../tools/math-topics.json'));
  const module=catalog.modules.find(m=>m.id==='inequalities');module.published=false;
  const skills=[{id:'existing-label',label:module.title,category:'Algebra',subcategory:'Inequalities'},{id:'new-label',label:'Simplifying Expressions',category:'Algebra',subcategory:'Algebraic Expressions'},{id:'other-category',label:'Triangles',category:'Geometry',subcategory:'Shapes & Angles'}];
  const groups=plannerExistingModuleGroups(catalog,'Algebra','Algebraic Expressions',skills);
  assert.equal(groups[0].label,'Algebraic Expressions');
  assert.ok(groups.find(g=>g.label==='Inequalities').modules.some(m=>m.id===module.id),'draft modules from another subcategory remain selectable');
  assert.deepEqual(groups.flatMap(g=>g.skills).map(s=>s.id),['new-label']);
  assert.ok(groups.flatMap(g=>g.modules).every(m=>m.category==='Algebra'));
  const destination=plannerModuleDestination(module);
  assert.equal(destination.topic,'Inequalities');assert.equal(destination.group,'foundation');assert.equal(destination.moduleId,module.id);
  const newDestination=plannerSkillDestination(skills[1]);
  assert.equal(newDestination.moduleTitle,skills[1].label);assert.equal(newDestination.skilled,skills[1].id);assert.equal(newDestination.moduleId,'');
  let own=mutate('skill-label-plan',call('skill-label-plan'),{action:'create',name:'Saved skill labels'});
  own=mutate('skill-label-plan',own,{action:'add',batchId:own.activeBatchId,questionIds:[fixture.data.questions[0].id]});
  const batch=own.batches[0];batch.entries[0].destination=newDestination;
  own=mutate('skill-label-plan',own,{action:'update',batchId:batch.id,name:batch.name,notes:batch.notes,entries:batch.entries});
  const reloaded=call('skill-label-plan').batches[0];assert.deepEqual(reloaded.entries[0].destination,newDestination);
  const exported=generatorBatchExport(reloaded,reloaded.entries,catalog,require('../../tools/math-topics.json').categories);
  assert.equal(exported.manifest.requests[0].destination.skilled,skills[1].id);
  assert.equal(exported.manifest.requests[0].destination.moduleTitle,skills[1].label);
  const renamed={...skills[1],label:'Combining Like Terms'};
  assert.equal(generatorBatchExport(reloaded,reloaded.entries,catalog,require('../../tools/math-topics.json').categories,[renamed]).manifest.requests[0].destination.moduleTitle,renamed.label);
  assert.throws(()=>generatorBatchExport(reloaded,reloaded.entries,catalog,require('../../tools/math-topics.json').categories,[]),/skill label changed or was removed/);
  catalog.modules.push({...module,id:'built-from-label',title:renamed.label,skilled:renamed.id,category:renamed.category,topic:renamed.subcategory,parentId:catalog.modules.find(m=>m.defaultType==='foundation'&&m.topic===renamed.subcategory).id});
  assert.equal(generatorBatchExport(reloaded,reloaded.entries,catalog,require('../../tools/math-topics.json').categories,[renamed]).manifest.requests[0].destination.moduleId,'built-from-label','reuse the module once the saved label has been built');
});

test('catalog refresh survives failures, queues in-flight changes and ignores an old account after disposal',async()=>{
  const {watchPlannerCatalog}=require('../../client/src/features/math-command/plannerCatalogSync.ts');
  const pending=[],received=[],errors=[];let notify,disposed=false;
  const request=path=>{assert.equal(path,'/catalog?manage=1');return new Promise((resolve,reject)=>pending.push({resolve,reject}));};
  const sync=watchPlannerCatalog(request,data=>received.push(data),message=>errors.push(message),refresh=>{notify=refresh;return()=>{disposed=true;};});
  const tick=()=>new Promise(resolve=>setImmediate(resolve));
  assert.equal(pending.length,1);notify();notify();assert.equal(pending.length,1);
  pending[0].resolve({catalog:{modules:[{title:'Earlier name'}]}});await tick();assert.equal(pending.length,2);
  pending[1].resolve({catalog:{modules:[{title:'Updated skill name'}]}});await tick();assert.equal(received.at(-1).catalog.modules[0].title,'Updated skill name');
  notify();pending[2].reject(Error('Offline'));await tick();assert.deepEqual(errors,['Offline']);assert.equal(received.length,2);
  notify();pending[3].resolve({catalog:{modules:[{title:'New module'}]}});await tick();assert.equal(received.at(-1).catalog.modules[0].title,'New module');
  notify();sync.dispose();pending[4].resolve({catalog:{modules:[{title:'Old account data'}]}});await tick();
  assert.equal(received.length,3);assert.equal(disposed,true);notify();assert.equal(pending.length,5);
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


test('compact plans preserve exact question data and omit private context while deduplicating destinations',()=>{
  const batch=structuredClone(call('planner-reuse').batches[0]),taxonomy=store.readMathCommandTaxonomy(root),catalog=defaultPracticeCatalog(taxonomy);
  batch.entries.forEach(entry=>{entry.context={rationale:'PRIVATE student details',studentId:'secret-id'};entry.source.skilled='TBD';});
  const compact=generatorBatchExport(batch,batch.entries,catalog,taxonomy.categories);
  const full=generatorBatchExport(batch,batch.entries,catalog,taxonomy.categories,undefined,'full');
  const plan=JSON.parse(compact.prompt.split('BATCH PLAN:\n')[1]);
  assert.equal(plan.destinations.length,1);
  for(const [index,request] of plan.requests.entries()){
    assert.deepEqual(request.source.question,batch.entries[index].source.question);
    assert.equal(request.sourceQuestionId,batch.entries[index].source.id);
    assert.equal(plan.destinations[request.destinationIndex].skilled,'TBD');
  }
  assert.doesNotMatch(compact.prompt,/PRIVATE|secret-id/);
  assert.ok(compact.prompt.length<full.prompt.length);
  assert.deepEqual(compact.manifest,full.manifest);
});

test('legacy available intent migrates to a draft request without claiming live publication',()=>{
  const actor='legacy-intent';let own=mutate(actor,call(actor),{action:'create',name:'Legacy'});
  own=mutate(actor,own,{action:'add',batchId:own.activeBatchId,questionIds:[fixture.data.questions[0].id]});
  const saved=store.readMathCommandState(root),entry=saved.generatorPlanners[actor].batches[0].entries[0];
  entry.status='available';delete entry.publishAfterValidation;
  store.commitMathCommandState(root,saved.revision,saved);
  own=call(actor);assert.equal(own.batches[0].entries[0].status,'draft');assert.equal(own.batches[0].entries[0].publishAfterValidation,true);
  const batch=own.batches[0];batch.entries[0].publishAfterValidation=false;
  own=mutate(actor,own,{action:'update',batchId:batch.id,name:batch.name,notes:batch.notes,entries:batch.entries});
  assert.equal(call(actor).batches[0].entries[0].publishAfterValidation,false);
});
