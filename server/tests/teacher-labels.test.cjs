const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'teacher-labels-test-'));
const fixture=require('../../tools/math-command-fixture.cjs').install(root);
const {mathCommandRouter}=require('../src/routes/mathCommand.ts');
const store=require('../src/lib/mathCommandCatalogStore.ts');
const {handleMathCatalogRequest}=require('../src/lib/mathCommandCatalogService.ts');
const express=require('express');const app=express();app.use(express.json());app.use('/api/math-command',mathCommandRouter);app.use((error,req,res,next)=>res.status(error.status||500).json({message:error.message}));
let server,url;
before(async()=>{server=await new Promise(resolve=>{const value=app.listen(0,'127.0.0.1',()=>resolve(value));});url=`http://127.0.0.1:${server.address().port}/api/math-command`;});
after(()=>{server.close();fs.rmSync(root,{recursive:true,force:true});});
async function request(route,token='teacher',body){const response=await fetch(url+route,{method:body?'POST':'GET',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,body:await response.json()};}

test('private labels persist, isolate owners, filter and survive rename/delete without touching content', async()=>{
  const file=path.join(root,'server/data/exam-content.json'),before=fs.readFileSync(file,'utf8');
  const call=(actor,method,pathname,body,query)=>handleMathCatalogRequest({root,actor,method,pathname,body,query});
  const classificationBefore=store.mathClassificationRevision(root);
  let own=call('one','GET','/teacher-labels');
  own=call('one','POST','/teacher-labels',{revision:own.revision,action:'create',name:'Great for Teaching',description:'Useful discussion'});
  const label=own.labels[0].id,questionId=fixture.data.questions[0].id;
  own=call('one','POST','/teacher-labels',{revision:own.revision,action:'questions',questionIds:[questionId],add:[label],favorite:true,note:'Explain why choice C is tempting.'});
  assert.equal(call('one','GET','/teacher-labels').questions[questionId].note,'Explain why choice C is tempting.');
  assert.deepEqual(call('two','GET','/teacher-labels').labels,[]);
  assert.throws(()=>call('two','POST','/teacher-labels',{revision:'new',action:'questions',questionIds:[questionId],add:[label]}),/own account/);
  const filters={teacherLabelIds:[label],favoritesOnly:true,category:['Algebra'],search:'tempting',sort:'favorite'};
  assert.equal(call('one','GET','/catalog',undefined,{filters}).total,1);
  assert.equal(call('two','GET','/catalog',undefined,{filters}).total,0);
  const stale=own.revision;
  own=call('one','POST','/teacher-labels',{revision:own.revision,action:'edit',id:label,name:'Homework',description:'Quick warmup'});
  assert.equal(own.questions[questionId].labelIds[0],label);
  assert.throws(()=>call('one','POST','/teacher-labels',{revision:stale,action:'delete',id:label}),/another window/);
  own=call('one','POST','/teacher-labels',{revision:own.revision,action:'delete',id:label});
  assert.deepEqual(own.questions[questionId].labelIds,[]);assert.equal(own.questions[questionId].favorite,true);assert.match(own.questions[questionId].note,/tempting/);
  assert.equal(fs.readFileSync(file,'utf8'),before);
  assert.equal(store.mathClassificationRevision(root),classificationBefore,'personal edits do not invalidate a math content draft');
});

test('student endpoints deny labels and taxonomy, bulk labels constrain assignment preview without entering student payloads',async()=>{
  for(const route of ['/teacher-labels','/taxonomy']) {
    assert.equal((await request(route,'student')).status,403);
    assert.equal((await request(route,'student',{action:'create'})).status,403);
  }
  let data=(await request('/teacher-labels')).body;
  data=(await request('/teacher-labels','teacher',{revision:data.revision,action:'create',name:'PRIVATE LESSON LABEL'})).body;
  const label=data.labels[0].id,ids=fixture.data.questions.slice(6,9).map(q=>q.id);
  data=(await request('/teacher-labels','teacher',{revision:data.revision,action:'questions',questionIds:ids,add:[label]})).body;
  assert.ok(ids.every(id=>data.questions[id].labelIds.includes(label)));
  const studentId=fixture.studentId;
  const preview=await request(`/students/${studentId}/assignment-preview`,'teacher',{count:2,excludeSeen:false,catalogFilters:{teacherLabelIds:[label]}});
  assert.equal(preview.status,200);assert.equal(preview.body.questionIds.length,2);assert.ok(preview.body.questionIds.every(id=>ids.includes(id)));
  const assigned=await request(`/students/${studentId}/assignments`,'teacher',{previewToken:preview.body.previewToken,questionIds:preview.body.questionIds,batchId:require('node:crypto').randomUUID(),title:'Private filter test'});
  assert.equal(assigned.status,201);
  assert.ok(!JSON.stringify(assigned.body).includes(label));assert.ok(!JSON.stringify(assigned.body).includes('PRIVATE LESSON LABEL'));
});

test('create and rename subcategories preserves keys and updates used classifications',()=>{
  const request=(body)=>handleMathCatalogRequest({root,actor:'one',method:'POST',pathname:'/taxonomy',body:{revision:store.readMathCommandState(root).revision,...body}});
  request({action:'add-subcategory',category:'Algebra',name:'New teaching category'});
  const id=fixture.data.questions[0].id;
  const preview=store.previewMathMetadata(root,{revision:store.readMathCommandState(root).revision,questionIds:[id],patch:{category:'Algebra',subcategory:'New teaching category',diagnosticSkill:''}},'one');store.applyMathMetadata(root,preview.token,'one');
  request({action:'rename-subcategory',category:'Algebra',original:'New teaching category',name:'Renamed subcategory'});
  const record=store.readMathCommandCatalog(root).find(q=>q.id===id);
  assert.equal(record.question.subtopic,'Renamed subcategory');assert.equal(record.question.correctChoiceId,fixture.data.questions[0].correctChoiceId);
  assert.ok(store.readMathCommandTaxonomy(root).categories.find(c=>c.label==='Algebra').topics.includes('Renamed subcategory'));
  assert.deepEqual(store.readMathCommandState(root).taxonomyTopicRenames.at(-1),{category:'Algebra',from:'New teaching category',to:'Renamed subcategory'});
});


test('Content Studio sees managed subcategories and source category saves preserve private labels',async()=>{
  const sourceDir=path.join(root,'client/src/content/exams/mathSets');fs.mkdirSync(sourceDir,{recursive:true});
  fs.writeFileSync(path.join(sourceDir,'fixture.ts'),'export const questions = '+JSON.stringify(fixture.data.questions)+';');
  fs.writeFileSync(path.join(root,'server/data/assessments.json'),JSON.stringify([{id:'fixture',questions:fixture.data.questions}]));
  const {readMathTopicConfiguration,saveMathTopicConfiguration,validateMathClassification}=await import('../../tools/math-topic-editor.mjs');
  const configuration=await readMathTopicConfiguration(root);
  assert.ok(configuration.categories.find(c=>c.label==='Algebra').topics.some(topic=>topic.label==='Renamed subcategory'));
  assert.doesNotThrow(()=>validateMathClassification({id:'draft',topic:'Algebra',subtopic:'Renamed subcategory'},configuration));
  const privateBefore=JSON.stringify(store.readMathCommandState(root).teacherLabels);
  await saveMathTopicConfiguration(root,{revision:configuration.revision,categories:configuration.categories.map(category=>({label:category.label,original:category.label,topics:category.topics.map(topic=>({original:topic.label,label:topic.label==='Renamed subcategory'?'Final subcategory':topic.label}))}))});
  assert.equal(JSON.stringify(store.readMathCommandState(root).teacherLabels),privateBefore);
  assert.match(fs.readFileSync(path.join(sourceDir,'fixture.ts'),'utf8'),/Final subcategory/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root,'server/data/assessments.json'),'utf8'))[0].questions[0].subtopic,'Final subcategory');
  assert.ok(store.readMathCommandTaxonomy(root).categories.find(c=>c.label==='Algebra').topics.includes('Final subcategory'));
  assert.deepEqual(store.readMathCommandState(root).taxonomyTopicRenames.at(-1),{category:'Algebra',from:'Renamed subcategory',to:'Final subcategory'});
});
