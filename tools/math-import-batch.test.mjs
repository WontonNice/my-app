import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdir,mkdtemp,readFile,writeFile,rm,cp} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createServer} from 'node:http';
import vm from 'node:vm';
import batches from './math-import-batch.cjs';
import contract from './document-import.cjs';
import {documentDraftStore,publicationContent} from './document-drafts.mjs';

const toolsRoot=dirname(fileURLToPath(import.meta.url)),root=resolve(toolsRoot,'..'),fixtureRoot=join(toolsRoot,'.content-drafts');
const taxonomy={math:['Algebra'],mathSpecificTopics:{Algebra:['Equations & Systems']}};
const question=(n,extra={})=>({id:`batch-qa-${n}`,type:'short_response',topic:'Algebra',subtopic:'Equations & Systems',prompt:`Source question ${n}: evaluate \\(2^${n}\\).`,correctTextAnswers:[String(2**n)],explanation:'',review:{sourceFile:'synthetic.pdf',sourcePages:[1],sourceQuestion:String(n)},...extra});
const payload=(questions,extra={})=>({format:contract.format,batch:{sourceId:'synthetic-v1-form-a',jobId:'math',sourceLabel:'Synthetic full section',requestedScope:'Questions 1–4',expectedQuestions:['1','2','3','4'],expectedTotal:4,inventoryConfirmed:true,...extra},review:{expectedQuestionCount:questions.length},mathQuestions:questions});
async function isolated(run) {
  await mkdir(fixtureRoot,{recursive:true});const path=await mkdtemp(join(fixtureRoot,'math-batch-test-'));
  try{return await run(path);}finally{if(dirname(path)===fixtureRoot)await rm(path,{recursive:true,force:true});}
}

test('a complete Math chunk isolates malformed neighbors and never grants imported approvals',()=>{
  const q=question(1,{type:'multiple_choice',choices:['E','F','G','H'].map((id,i)=>({id,text:String(i)})),correctChoiceId:'G',review:{sourceQuestion:'1',sourceReviewed:true,completenessReviewed:true,classificationReviewed:true},visuals:[{choiceId:'H',description:'Original graphical choice',state:'resolved'}]});
  const [entry]=batches.parse(payload([q,{...question(2),choices:'not an array'},null]));
  assert.equal(entry.content.questions.length,1);assert.equal(entry.batch.items.length,3);
  assert.match(entry.batch.items[1].error,/choices/);assert.equal(entry.batch.items[1].raw.choices,'not an array');
  assert.deepEqual(entry.content.questions[0].choices.map(c=>c.id),['A','B','C','D']);
  assert.equal(entry.content.questions[0].correctChoiceId,'C');assert.equal(entry.content.questions[0].visuals[0].choiceId,'D');
  assert.equal(entry.content.questions[0].visuals[0].state,'unresolved');
  assert.equal(entry.content.questions[0].review.sourceReviewed,false);
  assert.equal(entry.content.questions[0].review.classificationReviewed,false);
  assert.equal(batches.report(entry,taxonomy).identified,4);
  assert.equal(batches.itemIssues(entry,entry.batch.items[0],taxonomy).some(i=>i.code==='COUNT_MISMATCH'),false);
});

test('ambiguous repeated source/record identities quarantine every affected item',()=>{
  const [entry]=batches.parse(payload([question(1),question(1),question(2)]));
  assert.equal(entry.content.questions.length,1);assert.equal(entry.batch.items.filter(i=>i.error).length,2);
  assert.match(entry.batch.items[0].error,/Ambiguous/);
});

test('single Math questions accept bare objects and optional-format envelopes without changing their content',()=>{
  const q=question(7,{correctTextAnswers:[],promptHtml:'<p>Preserve <em>this</em> source.</p>'});
  for(const source of [q,{question:q},{format:contract.format,question:q},{format:contract.mathFormat,question:q},'```json\n'+JSON.stringify(q)+'\n```']){
    const [entry]=batches.parse(source);
    assert.equal(entry.batch.items.length,1);assert.equal(entry.batch.items[0].error,undefined);
    const imported=entry.content.questions[0];
    for(const key of ['id','type','prompt','promptHtml','correctTextAnswers'])assert.deepEqual(imported[key],q[key]);
  }
  for(const format of [undefined,contract.format,contract.mathFormat])assert.equal(contract.parse({format,question:q})[0].content.questions[0].id,q.id);
  const [visual]=batches.parse({question:q,visuals:[{description:'Original diagram',sourcePage:3}]});
  assert.equal(visual.content.questions[0].visuals[0].questionId,q.id);
  assert.equal(visual.content.questions[0].visuals[0].state,'unresolved');
  const bad={question:q,mathQuestions:[question(8)]};
  assert.throws(()=>batches.parse(bad),/not both/);assert.throws(()=>contract.parse(bad),/not both/);
  assert.throws(()=>batches.parse({format:'unrelated-format',question:q}),/Expected/);
  assert.equal(batches.parse({question:null})[0].batch.items[0].error,'Question must be an object.');
});

test('single-question imports assign stable missing IDs and exact retries preserve teacher edits',()=>isolated(async path=>{
  const store=documentDraftStore(path),q=question(9);delete q.id;
  let state=await store.import(q);
  const entry=state.entries[0],id=entry.content.questions[0].id;
  assert.match(id,/^math-question-[a-f0-9]{16}$/);
  entry.content.questions[0].prompt='Teacher corrected this wording.';
  state=await store.save({revision:state.revision,entry});
  state=await store.import({format:contract.format,question:Object.fromEntries(Object.entries(q).reverse())},state.revision);
  assert.equal(state.entries.length,1);assert.equal(state.entries[0].content.questions.length,1);
  assert.equal(state.entries[0].content.questions[0].id,id);
  assert.equal(state.entries[0].content.questions[0].prompt,'Teacher corrected this wording.');
  const other={...q,prompt:'A different source question.'};
  state=await store.import(other,state.revision);
  assert.equal(state.entries.length,2);assert.notEqual(state.entries[1].content.questions[0].id,id);
}));

test('overlap and different chunk boundaries preserve edited work and record changed keys as conflicts',()=>isolated(async path=>{
  const store=documentDraftStore(path);
  let state=await store.import(payload([question(1),question(2)],{chunkId:'first'}));
  const entry=state.entries[0];entry.content.questions[0].prompt='Teacher corrected wording.';
  state=await store.save({revision:state.revision,entry});
  state=await store.import(payload([question(2),question(3)],{chunkId:'overlap'}),state.revision);
  state=await store.import(payload([question(1)],{chunkId:'retry-part'}),state.revision);
  assert.equal(state.entries.length,1);assert.equal(state.entries[0].content.questions.length,3);
  assert.equal(state.entries[0].content.questions[0].prompt,'Teacher corrected wording.');
  assert.equal(batches.report(state.entries[0],taxonomy).duplicates,2);
  state=await store.import(payload([question(1,{correctTextAnswers:['changed key']}),question(4)],{chunkId:'changed-key'}),state.revision);
  const current=state.entries[0],item=current.batch.items[0];
  assert.equal(current.content.questions.length,4);assert.equal(item.conflicts.length,1);
  assert.deepEqual(current.content.questions[0].correctTextAnswers,['2']);
  assert.deepEqual(item.conflicts[0].question.correctTextAnswers,['changed key']);
  state=await store.batchAction({revision:state.revision,entryId:current.id,itemIds:[item.id],operation:'use-incoming',conflictId:item.conflicts[0].id});
  assert.deepEqual(batches.question(state.entries[0],state.entries[0].batch.items[0]).correctTextAnswers,['changed key']);
  assert.equal(state.entries[0].batch.items[0].history.length,1);
  assert.equal(batches.report(state.entries[0],taxonomy).missing.length,0);
  assert.equal((await documentDraftStore(path).read()).entries[0].batch.items.length,4);
}));

test('missing keys/visuals and invalid math remain drafts; review confirmation cannot resolve them',()=>isolated(async path=>{
  const store=documentDraftStore(path);
  let state=await store.import(payload([question(1,{correctTextAnswers:[],visuals:[{description:'Source graph',sourcePage:2,state:'unresolved'}]}),question(2,{prompt:'Evaluate \\(\\badcommand{x}\\).'})]));
  const entry=state.entries[0];
  state=await store.batchAction({revision:state.revision,entryId:entry.id,itemIds:entry.batch.items.map(i=>i.id),operation:'confirm'});
  const codes=state.entries[0].batch.items.flatMap(i=>batches.itemIssues(state.entries[0],i,taxonomy)).map(i=>i.code);
  assert.ok(codes.includes('ANSWER_KEY_MISSING'));assert.ok(codes.includes('IMAGE_REQUIRED'));assert.ok(codes.includes('POSSIBLE_FORMATTING_LOSS'));
  assert.equal(batches.report(state.entries[0],taxonomy).ready,0);
}));

test('invalid raw input survives capture; item correction, stale-write protection and source isolation survive restart',()=>isolated(async path=>{
  const store=documentDraftStore(path);
  let state=await store.import('{"mathQuestions":[',undefined,[],'exam',{captureFailures:true});
  assert.ok(state.lastImport.error);assert.equal(state.rejectedInputs[0].source,'{"mathQuestions":[');
  state=await store.import(payload([{...question(1),correctTextAnswers:null},question(2)]),state.revision);
  const entry=state.entries[0],item=entry.batch.items[0];
  assert.equal(entry.content.questions.length,1);
  state=await store.batchAction({revision:state.revision,entryId:entry.id,itemIds:[item.id],operation:'correct',source:JSON.stringify(question(1))});
  assert.equal(state.entries[0].content.questions.length,2);
  await assert.rejects(store.batchAction({revision:state.revision-1,entryId:entry.id,itemIds:[item.id],operation:'skip'}),/changed/);
  state=await store.import(payload([question(1)],{sourceId:'another-source-version'}),state.revision);
  assert.equal(state.entries.length,2);assert.equal((await documentDraftStore(path).read()).rejectedInputs.length,1);
}));

test('structured interaction/key/explanation/HTML differences participate in content comparison',()=>{
  const base=question(1,{type:'inline_dropdown',dropdownContent:['{{a}}'],dropdowns:[{id:'a',options:[{id:'one',text:'1'},{id:'two',text:'2'}],correctChoiceId:'one'}]});
  for(const next of [{...base,explanation:'Supplied guide'}, {...base,promptHtml:'<p>Source emphasis</p>'},{...base,dropdowns:[{...base.dropdowns[0],correctChoiceId:'two'}]}])assert.notEqual(batches.fingerprint(base),batches.fingerprint(next));
  assert.throws(()=>batches.metadata({expectedQuestions:['1'],expectedTotal:4,inventoryConfirmed:true}),/confirmed inventory/);
});

test('source/job labels containing separators remain independent identities',()=>isolated(async path=>{
  const store=documentDraftStore(path);
  let state=await store.import(payload([question(1)],{sourceId:'source:math:form',jobId:'section'}));
  state=await store.import(payload([question(2)],{sourceId:'source',jobId:'form:math:section'}),state.revision);
  assert.equal(state.entries.length,2);assert.notEqual(state.entries[0].id,state.entries[1].id);
  state=await store.import(payload([question(3)],{sourceId:'source:math:form',jobId:'section'}),state.revision);
  assert.equal(state.entries[0].content.questions.length,2);assert.equal(state.entries[1].content.questions.length,1);
}));

test('batch UI scripts parse and the shared contract documents actual metadata',async()=>{
  new vm.Script(await readFile(join(toolsRoot,'content-studio-batches.js'),'utf8'));
  assert.equal(contract.schema.mathBatch.section,'math');
  assert.match(contract.prompt(taxonomy),/root review.expectedQuestionCount counts ONLY/);
});

test('resolved source assets appear in the actual question model, remain inline once, and become unresolved after removal',()=>isolated(async path=>{
  const store=documentDraftStore(path);let state=await store.import(payload([question(1,{visuals:[{description:'Source rectangle',state:'unresolved'}]})]));
  let entry=state.entries[0],q=entry.content.questions[0];
  q.visuals[0].image={src:'/exam-images/rectangle.svgz',alt:'Source rectangle'};q.visuals[0].state='resolved';
  state=await store.save({revision:state.revision,entry});entry=state.entries[0];
  let preview=batches.previewQuestion(entry.content.questions[0]);assert.equal(preview.image.src,'/exam-images/rectangle.svgz');
  preview.promptHtml='<p>Before.</p><img src="/exam-images/rectangle.svgz" alt="Source rectangle"><p>After.</p>';delete preview.image;
  entry.content.questions=[preview];state=await store.save({revision:state.revision,entry});entry=state.entries[0];
  assert.equal(entry.content.questions[0].visuals[0].state,'resolved');
  assert.equal(batches.previewQuestion(entry.content.questions[0]).image,undefined);
  const published=publicationContent(entry);assert.equal(published.questions[0].image,undefined);assert.equal((published.questions[0].promptHtml.match(/rectangle.svgz/g)||[]).length,1);
  delete entry.content.questions[0].promptHtml;state=await store.save({revision:state.revision,entry});
  assert.equal(state.entries[0].content.questions[0].visuals[0].state,'unresolved');
}));

test('the reusable example is accepted with blank explanations and an unresolved original figure',async()=>{
  const example=JSON.parse(await readFile(join(toolsRoot,'fixtures/math-batch/example.json'),'utf8'));
  const [entry]=batches.parse(example);assert.equal(entry.content.questions.length,2);
  assert.equal(entry.content.questions[1].correctTextAnswers[0],'12');assert.equal(entry.content.questions[1].visuals[0].state,'unresolved');
  assert.ok(entry.content.questions.every(q=>q.explanation===''));
});

test('HTTP selected publication preserves good neighbors, recovers a missing ledger, and rejects changed published content',()=>isolated(async path=>{
  for(const name of ['client/src/content','server/src/shared'])await cp(join(root,name),join(path,name),{recursive:true});
  await mkdir(join(path,'tools'),{recursive:true});await mkdir(join(path,'server/data'),{recursive:true});
  for(const name of ['client/src/lib/studentMaterials.ts','server/data/assessments.json','tools/content-topics.json','tools/math-topics.json','tools/practice-topics.json','tools/content-studio-glossary.js']){
    await mkdir(dirname(join(path,name)),{recursive:true});await cp(join(root,name),join(path,name));
  }
  await writeFile(join(path,'server/data/question-bank.json'),'{"revision":0,"questions":[],"sets":[]}');
  const modulePath=join(toolsRoot,`.math-batch-http-${Date.now()}.mjs`);
  const source=(await readFile(join(toolsRoot,'content-studio.mjs'),'utf8')).replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");',`const workspaceRoot = ${JSON.stringify(path)};`).split('if (process.argv.includes("--validate"))')[0]+'\nexport {handleRequest,getState};';
  await writeFile(modulePath,source);let server;
  try {
    const studio=await import(pathToFileURL(modulePath).href);server=createServer(studio.handleRequest);await new Promise(done=>server.listen(0,'127.0.0.1',done));
    const initial=await studio.getState(),assessmentId=initial.assessments[0].id;
    const category=initial.mathTopicConfiguration.categories[0],subtopic=category.topics[0].label;
    const base=`http://127.0.0.1:${server.address().port}`;
    const call=async(url,body)=>{const response=await fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':initial.editToken},body:JSON.stringify(body)});const data=await response.json();assert.ok(response.ok,JSON.stringify(data));return data;};
    let state=await call('/api/document-drafts',{source:JSON.stringify(payload([question(1,{topic:category.label,subtopic}),question(2,{topic:category.label,subtopic,correctTextAnswers:[]}),{...question(3),choices:'broken'}]))});
    let entry=state.entries[0],itemIds=entry.batch.items.map(i=>i.id);
    state=await call('/api/document-drafts',{revision:state.revision,entryId:entry.id,itemIds,operation:'confirm'});
    state=await call('/api/document-publish-math',{revision:state.revision,entryId:entry.id,itemIds,assessmentId});
    entry=state.entries[0];assert.ok(entry.batch.items[0].publications[assessmentId]);assert.match(entry.batch.items[1].publicationErrors[assessmentId],/verified accepted answer/);assert.match(entry.batch.items[2].publicationErrors[assessmentId],/array/);
    const id=entry.batch.items[0].publications[assessmentId].questionId;
    let section=(await studio.getState()).mathSections.find(s=>s.questions.some(q=>q.id===id));
    assert.equal(section.questions.filter(q=>q.id===id).length,1);assert.equal('review' in section.questions.find(q=>q.id===id),false);
    // Simulate interruption after the source write but before the ledger save.
    delete entry.batch.items[0].publications[assessmentId];
    await writeFile(join(path,'tools/.content-drafts/document-imports.json'),JSON.stringify(state));
    state=await call('/api/document-publish-math',{revision:state.revision,entryId:entry.id,itemIds:[itemIds[0]],assessmentId});
    assert.ok(state.entries[0].batch.items[0].publications[assessmentId]);
    section=(await studio.getState()).mathSections.find(s=>s.questions.some(q=>q.id===id));
    assert.equal(section.questions.filter(q=>q.id===id).length,1);
    section.questions.find(q=>q.id===id).prompt='Teacher revised the published question.';
    await call('/api/math',{...section,assessmentId});
    state=await call('/api/document-publish-math',{revision:state.revision,entryId:entry.id,itemIds:[itemIds[0]],assessmentId});
    assert.match(state.entries[0].batch.items[0].publicationErrors[assessmentId],/different content/);
    section=(await studio.getState()).mathSections.find(s=>s.questions.some(q=>q.id===id));assert.equal(section.questions.find(q=>q.id===id).prompt,'Teacher revised the published question.');
  } finally {if(server)await new Promise(done=>server.close(done));await rm(modulePath,{force:true});}
}));

test('direct Math import inserts incomplete red questions into the chosen test, preserves edits on retries and clears labels on finish',()=>isolated(async path=>{
  for(const name of ['client/src/content','server/src/shared'])await cp(join(root,name),join(path,name),{recursive:true});
  await mkdir(join(path,'tools'),{recursive:true});await mkdir(join(path,'server/data'),{recursive:true});
  for(const name of ['client/src/lib/studentMaterials.ts','server/data/assessments.json','tools/content-topics.json','tools/math-topics.json','tools/practice-topics.json','tools/content-studio-glossary.js']){
    await mkdir(dirname(join(path,name)),{recursive:true});await cp(join(root,name),join(path,name));
  }
  await writeFile(join(path,'server/data/question-bank.json'),'{"revision":0,"questions":[],"sets":[]}');
  const modulePath=join(toolsRoot,`.math-direct-http-${Date.now()}.mjs`);
  const source=(await readFile(join(toolsRoot,'content-studio.mjs'),'utf8')).replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");',`const workspaceRoot = ${JSON.stringify(path)};`).split('if (process.argv.includes("--validate"))')[0]+'\nexport {handleRequest,getState};';
  await writeFile(modulePath,source);let server;
  try {
    const studio=await import(pathToFileURL(modulePath).href);server=createServer(studio.handleRequest);await new Promise(done=>server.listen(0,'127.0.0.1',done));
    const initial=await studio.getState(),assessmentId=initial.assessments[1].id;
    const category=initial.mathTopicConfiguration.categories[0],subtopic=category.topics[0].label;
    const base=`http://127.0.0.1:${server.address().port}`;
    const call=async(url,body,status=201)=>{const response=await fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':initial.editToken},body:JSON.stringify(body)});const data=await response.json();assert.equal(response.status,status,JSON.stringify(data));return data;};
    const q=(n,extra)=>question(n,{topic:'',subtopic:'',correctTextAnswers:[],...extra});
    const choices=[{id:'A',text:'One'},{id:'B',text:'Two'}];
    const chunk=payload([
      q(81,{visuals:[{description:'Source rectangle',sourcePage:2,state:'unresolved'}]}),
      q(82,{type:'multiple_choice',choices,correctChoiceId:''}),
      q(83,{type:'multi_select',choices,correctChoiceIds:[],requiredSelections:2}),
      q(84,{type:'inline_dropdown',dropdownContent:['Choose {{menu}}.'],dropdowns:[{id:'menu',options:choices,correctChoiceId:''}]}),
      q(85,{type:'math_drag_drop',items:[{id:'one',text:'1'},{id:'two',text:'2'}],dragDropContent:['{{box}}'],dragDropSlots:[{id:'box',correctItemId:''}]}),
      q(86,{type:'graph_point_select',graph:{xMin:0,xMax:10,xStep:1,yMin:0,yMax:10,yStep:1,points:[{id:'p1',x:1,y:2},{id:'p2',x:2,y:1}]},correctPointIds:[]}),
      q(87,{type:'number_line_response',numberLineResponse:{min:-10,max:10,tickStep:1,labelStep:1,correctValue:null,correctDirection:'right',correctEndpoint:'closed'}}),
      {...q(88),choices:'invalid array'},
    ],{sourceId:'direct-red-workflow',expectedQuestions:[],expectedTotal:null,inventoryConfirmed:false});
    const result=await call('/api/math/import',{assessmentId,source:JSON.stringify(chunk)});
    assert.equal(result.added.length,7);assert.equal(result.errors.length,1);assert.match(result.errors[0],/choices/);
    const sectionNow=async()=>{const state=await studio.getState();const file=state.tests.find(t=>t.assessmentId===assessmentId).mathSectionFileName;return state.mathSections.find(s=>s.fileName===file);};
    let section=await sectionNow(),imported=section.questions.filter(q=>result.added.includes(q.id));
    assert.equal(imported.length,7);assert.ok(imported.every(q=>q.importNeedsEditing));
    assert.deepEqual(imported[0].correctTextAnswers,[]);assert.match(imported[0].importNotes.join('\n'),/Source rectangle/);
    assert.equal(imported[6].numberLineResponse.correctValue,null);
    const actualSource=await readFile(join(path,'client/src/content/exams/mathSets',section.fileName),'utf8');
    assert.doesNotMatch(actualSource,/importNeedsEditing|importNotes|importSource|sourceReviewed|sourcePages/);
    const exports=await readFile(join(path,'server/data/exam-content.json'),'utf8');assert.doesNotMatch(exports,/importNeedsEditing|Source rectangle|direct-red-workflow/);
    assert.ok(!(await studio.getState()).assessments[0].questions.some(q=>result.added.includes(q.id)));
    imported[0].prompt='Teacher corrected the original imported wording.';
    await call('/api/math',{...section,assessmentId});
    const retry=await call('/api/math/import',{assessmentId,source:JSON.stringify(chunk)});
    assert.equal(retry.added.length,0);assert.equal(retry.existing.length,7);
    section=await sectionNow();assert.equal(section.questions.find(q=>q.id===result.added[0]).prompt,'Teacher corrected the original imported wording.');
    assert.equal(section.questions.filter(q=>result.added.includes(q.id)).length,7);
    const finished=section.questions.find(q=>q.id===result.added[0]);
    finished.topic=category.label;finished.subtopic=subtopic;finished.correctTextAnswers=['12'];finished.importNeedsEditing=false;
    await call('/api/math',{...section,assessmentId});
    section=await sectionNow();assert.equal(section.questions.find(q=>q.id===finished.id).importNeedsEditing,false);
    assert.equal(section.questions.filter(q=>q.importNeedsEditing).length,6);
    const pending=section.questions.find(q=>q.id===result.added[1]);pending.importNeedsEditing=false;pending.topic=category.label;pending.subtopic=subtopic;
    await call('/api/math',{...section,assessmentId},400);
    section=await sectionNow();assert.equal(section.questions.find(q=>q.id===pending.id).importNeedsEditing,true);
    const imageQuestion=section.questions.find(q=>q.id===pending.id);
    imageQuestion.topic=category.label;imageQuestion.subtopic=subtopic;imageQuestion.correctChoiceId='B';
    imageQuestion.choices=imageQuestion.choices.map(choice=>({...choice,text:'',html:`<img src="/exam-images/number-line-${choice.id.toLowerCase()}.png" alt="Number line ${choice.id}" width="200">`}));
    await call('/api/math',{...section,assessmentId});
    section=await sectionNow();
    const savedImages=section.questions.find(q=>q.id===pending.id);
    assert.equal(savedImages.importNeedsEditing,true,'saving image choices preserves the red draft label');
    savedImages.importNeedsEditing=false;
    await call('/api/math',{...section,assessmentId});
    section=await sectionNow();
    const completedImages=section.questions.find(q=>q.id===pending.id);
    assert.equal(completedImages.importNeedsEditing,false,'image-only choices can be marked finished');
    assert.equal(completedImages.correctChoiceId,'B');
    for(const choice of completedImages.choices){
      assert.equal(choice.text,'');assert.equal(choice.image,undefined);
      assert.equal(choice.html,`<img src="/exam-images/number-line-${choice.id.toLowerCase()}.png" alt="Number line ${choice.id}" width="200">`);
    }
    await call('/api/math',{...section,assessmentId});
    assert.deepEqual((await sectionNow()).questions.find(q=>q.id===pending.id).choices,completedImages.choices,'completed image-only choices also survive ordinary saves');
    const malformed=await call('/api/math/import',{assessmentId,source:'{"mathQuestions":['});assert.equal(malformed.added.length,0);assert.equal(malformed.errors.length,1);
    const saved=await documentDraftStore(path).read();assert.equal(saved.rejectedInputs[0].source,'{"mathQuestions":[');
    const repaired=await call('/api/math/import',{assessmentId,source:JSON.stringify(payload([q(88)],{sourceId:'direct-red-workflow',expectedQuestions:[],expectedTotal:null,inventoryConfirmed:false}))});
    assert.equal(repaired.added.length,1);assert.deepEqual(repaired.errors,[]);
    const repeated=await call('/api/math/import',{assessmentId,source:JSON.stringify(payload([q(91,{prompt:finished.prompt})],{sourceId:'repeated-wording',expectedQuestions:[],expectedTotal:null,inventoryConfirmed:false}))});
    assert.equal(repeated.added.length,1,'distinct source questions may repeat their prompt');
    const other=initial.assessments[0].id;
    const second=await call('/api/math/import',{assessmentId:other,source:JSON.stringify(payload([question(90)],{sourceId:'another-test',expectedQuestions:[],expectedTotal:null,inventoryConfirmed:false}))});
    assert.equal(second.added.length,1);assert.ok(second.added[0].startsWith(other+'-'));
    const single=question(95,{correctTextAnswers:[]});delete single.id;
    const before=(await sectionNow()).questions.length;
    const one=await call('/api/math/import',{assessmentId,source:JSON.stringify(single)});
    assert.equal(one.added.length,1);assert.deepEqual(one.errors,[]);
    section=await sectionNow();assert.equal(section.questions.length,before+1);
    const importedSingle=section.questions.find(q=>q.id===one.added[0]);
    assert.equal(importedSingle.importNeedsEditing,true);assert.equal(importedSingle.prompt,single.prompt);
    assert.deepEqual(importedSingle.correctTextAnswers,[]);
    importedSingle.prompt='Teacher edited the single imported question.';
    await call('/api/math',{...section,assessmentId});
    const oneRetry=await call('/api/math/import',{assessmentId,source:JSON.stringify({question:single})});
    assert.equal(oneRetry.added.length,0);assert.deepEqual(oneRetry.existing,one.added);
    assert.equal((await sectionNow()).questions.find(q=>q.id===one.added[0]).prompt,'Teacher edited the single imported question.');
  } finally {if(server)await new Promise(done=>server.close(done));await rm(modulePath,{force:true});}
}));
