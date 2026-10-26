const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const store = require('../src/lib/mathCommandCatalogStore.ts');
const {handleMathCatalogRequest,mathCatalogSnapshot} = require('../src/lib/mathCommandCatalogService.ts');

function fixture(t,count=35){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'math-command-management-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'server/data'),{recursive:true});fs.mkdirSync(path.join(root,'tools/.content-drafts'),{recursive:true});
  fs.copyFileSync(path.resolve(__dirname,'../../tools/math-topics.json'),path.join(root,'tools/math-topics.json'));
  const questions=Array.from({length:count},(_,i)=>({id:`q-${i+1}`,type:'multiple_choice',topic:'Algebra',subtopic:'Equations & Systems',prompt:`Find the unknown number in x + ${i+1} = ${i+6}.`,choices:[{id:'A',text:'5'},{id:'B',text:'6'}],correctChoiceId:'A',explanation:'Subtract the same amount from both sides.'}));
  const content={'fixture-exam':{assessmentId:'fixture-exam',title:'2026-2027 Form D',passageSets:[],mathSection:{id:'fixture-math',title:'Math',questionCount:count,questions}}};
  const contentPath=path.join(root,'server/data/exam-content.json');fs.writeFileSync(contentPath,JSON.stringify(content));
  fs.writeFileSync(path.join(root,'server/data/question-bank.json'),JSON.stringify({revision:0,questions:[],sets:[]}));
  fs.mkdirSync(path.join(root,'client/src/content/exams/mathSets'),{recursive:true});
  const sourcePath=path.join(root,'client/src/content/exams/mathSets/fixture.ts');fs.writeFileSync(sourcePath,`export const math = ${JSON.stringify(questions)};\n`);
  return {root,content,questions,contentPath,sourcePath};
}
const actor='teacher-a';
function preview(root,ids,patch,who=actor){return store.previewMathMetadata(root,{questionIds:ids,patch,revision:store.readMathCommandState(root).revision},who);}
const request=(root,method,pathname,body,query)=>handleMathCatalogRequest({root,method,pathname,body,query,actor});

test('exam player queue covers filtered questions across pages in bank order without copying content',t=>{
  const {root}=fixture(t,241);
  const filters={category:['Algebra'],sort:'id',direction:'desc',page:3,pageSize:20,excludeQuestionIds:['q-2']};
  const queue=request(root,'GET','/player-queue',undefined,{filters:JSON.stringify(filters)});
  assert.equal(queue.total,240);assert.equal(new Set(queue.ids).size,240);assert.ok(!queue.ids.includes('q-2'));
  const first=request(root,'GET','/catalog',undefined,{filters:JSON.stringify({...filters,page:1})});
  assert.deepEqual(queue.ids.slice(0,20),first.items.map(row=>row.id));
  assert.deepEqual(Object.keys(queue).sort(),['ids','total']);
});

test('preview/apply 30 existing questions modifies only explicit metadata and can be undone',t=>{
  const f=fixture(t),before=fs.readFileSync(f.contentPath),sourceBefore=fs.readFileSync(f.sourcePath),ids=f.questions.slice(0,30).map(q=>q.id);
  const p=preview(f.root,ids,{category:'Geometry',subcategory:'Area & Perimeter',diagnosticSkill:'area-perimeter',difficulty:'hard'});
  assert.equal(p.count,30);assert.equal(p.changes.length,30);assert.deepEqual(p.changes[0].fields.map(f=>f.field),['category','subcategory','diagnosticSkill','difficulty']);
  assert.equal(fs.existsSync(path.join(f.root,'server/data/math-command.json')),false);
  const applied=store.applyMathMetadata(f.root,p.token,actor);assert.equal(applied.changed,30);
  assert.deepEqual(fs.readFileSync(f.contentPath),before);assert.deepEqual(fs.readFileSync(f.sourcePath),sourceBefore);
  const records=store.readMathCommandCatalog(f.root);assert.equal(records.filter(r=>r.question.topic==='Geometry').length,30);
  assert.equal(records[0].question.prompt,f.questions[0].prompt);assert.equal(records[0].question.correctChoiceId,'A');
  assert.deepEqual(records[0].question.choices,f.questions[0].choices);assert.equal(records[0].sources[0].assessmentId,'fixture-exam');
  const undo=store.undoMathMetadata(f.root,applied.undoToken,actor);assert.equal(undo.changed,30);
  assert.equal(store.readMathCommandCatalog(f.root)[0].question.topic,'Algebra');
  assert.deepEqual(fs.readFileSync(f.contentPath),before);assert.deepEqual(fs.readFileSync(f.sourcePath),sourceBefore);
});

test('metadata validation rejects content edits, invalid classifications and unverified mapping claims',t=>{
  const {root}=fixture(t);
  for(const patch of [{prompt:'Replace text'},{correctChoiceId:'B'},{category:'Fake'},{category:'Geometry',subcategory:'Equations & Systems'},{category:'Geometry',subcategory:'Area & Perimeter',diagnosticSkill:'linear-equations'},{difficulty:'elite'},{standards:[{code:'NY-8.EE.7',verified:true}]}])assert.throws(()=>preview(root,['q-1'],patch));
  assert.doesNotThrow(()=>preview(root,['q-1'],{category:'Geometry',subcategory:'Area & Perimeter',diagnosticSkill:'',difficulty:''}));
  const p=preview(root,['q-1'],{standards:[{code:'NY-8.EE.7',verified:true,referenceUrl:'https://www.nysed.gov/standards-instruction/mathematics'}]});
  assert.equal(p.changes[0].fields[0].after[0].verified,true);
});

test('native saves retire only known overlays and preserve concurrent classification edits',t=>{
  const {root,questions}=fixture(t);
  store.applyMathMetadata(root,preview(root,['q-1'],{category:'Geometry',subcategory:'Area & Perimeter'}).token,actor);
  const savedRevision=store.readMathCommandState(root).revision;
  store.syncMathNativeClassifications(root,[questions[0]]);
  assert.equal(store.readMathCommandState(root).metadata['q-1'].category,'Geometry','legacy save cannot clear divergent metadata');
  store.applyMathMetadata(root,preview(root,['q-1'],{category:'Algebra',subcategory:'Inequalities'}).token,actor);
  store.syncMathNativeClassifications(root,[{...questions[0],topic:'Geometry',subtopic:'Area & Perimeter'}],savedRevision);
  assert.equal(store.readMathCommandState(root).metadata['q-1'].subcategory,'Inequalities','in-flight save cannot clear newer classification');
  const currentRevision=store.readMathCommandState(root).revision;
  store.syncMathNativeClassifications(root,[questions[0]],currentRevision);
  assert.equal(store.readMathCommandState(root).metadata['q-1'].category,undefined,'current editor may change its native classification');
  assert.equal(store.readMathCommandState(root).metadata['q-1'].subcategory,undefined);
});

test('draft bank questions and any red import source stay in review despite acknowledgement',t=>{
  const f=fixture(t,2),draft={id:'bank-draft',subject:'Math',topic:'Algebra',source:'SAT Lab',difficulty:'medium',status:'draft',capturedAt:'2026-10-26T12:00:00Z',prompt:'Evaluate 2 + 2.',choices:[{id:'A',text:'4'},{id:'B',text:'5'}],correctChoiceId:'A',explanation:'Add two and two.'};
  fs.writeFileSync(path.join(f.root,'server/data/question-bank.json'),JSON.stringify({revision:1,questions:[draft],sets:[]}));
  f.content['second-exam']={...f.content['fixture-exam'],assessmentId:'second-exam',title:'2025-2026 Form A',mathSection:{...f.content['fixture-exam'].mathSection,questions:[f.questions[0]]}};
  fs.writeFileSync(f.contentPath,JSON.stringify(f.content));
  fs.writeFileSync(path.join(f.root,'tools/.content-drafts/math-import-status.json'),JSON.stringify({[JSON.stringify(['second-exam','q-1'])]:{needsEditing:true}}));
  store.applyMathMetadata(f.root,preview(f.root,['q-1','bank-draft'],{reviewStatus:'reviewed',subcategory:'Equations & Systems',difficulty:'medium'}).token,actor);
  const snapshot=mathCatalogSnapshot(f.root),q=snapshot.catalog.rows.find(r=>r.id==='q-1'),bank=snapshot.catalog.rows.find(r=>r.id==='bank-draft');
  assert.equal(q.sources.length,2);assert.equal(q.ready,false);assert.ok(q.issues.includes('teacher_review'));
  assert.equal(bank.ready,false);assert.ok(bank.issues.includes('teacher_review'));
});

test('preview tokens are actor, workspace, expiration, revision and content bound',t=>{
  const a=fixture(t),b=fixture(t);
  let p=preview(a.root,['q-1'],{difficulty:'medium'});
  assert.throws(()=>store.applyMathMetadata(a.root,p.token,'teacher-b'),/Preview/);
  assert.throws(()=>store.applyMathMetadata(b.root,p.token,actor),/Preview/);
  const now=Date.now;try{Date.now=()=>now()+16*60_000;assert.throws(()=>store.applyMathMetadata(a.root,p.token,actor),/Preview/);}finally{Date.now=now;}
  p=preview(a.root,['q-1'],{difficulty:'medium'});
  store.saveMathCommandPreferences(a.root,{revision:store.readMathCommandState(a.root).revision,pacePerWeek:15});
  assert.throws(()=>store.applyMathMetadata(a.root,p.token,actor),/Metadata changed/);
  p=preview(a.root,['q-1'],{difficulty:'medium'});
  a.content['fixture-exam'].mathSection.questions[0].prompt+=' Updated.';fs.writeFileSync(a.contentPath,JSON.stringify(a.content));
  assert.throws(()=>store.applyMathMetadata(a.root,p.token,actor),/Question content changed/);
  assert.equal(store.readMathCommandState(a.root).metadata['q-1'],undefined);
});

test('undo rejects another actor or newer changes but permits unrelated edits',t=>{
  const {root}=fixture(t);
  const first=store.applyMathMetadata(root,preview(root,['q-1'],{difficulty:'medium'}).token,actor);
  assert.throws(()=>store.undoMathMetadata(root,first.undoToken,'teacher-b'),/not available/);
  store.applyMathMetadata(root,preview(root,['q-2'],{difficulty:'hard'}).token,actor);
  assert.doesNotThrow(()=>store.undoMathMetadata(root,first.undoToken,actor));
  const next=store.applyMathMetadata(root,preview(root,['q-1'],{difficulty:'medium'}).token,actor);
  store.applyMathMetadata(root,preview(root,['q-1'],{difficulty:'expert'}).token,actor);
  assert.throws(()=>store.undoMathMetadata(root,next.undoToken,actor),/newer work/);
  assert.equal(store.readMathCommandState(root).metadata['q-1'].difficulty,'expert');
});

test('file lock rejects overlapping writers without changing state or source files',t=>{
  const {root,contentPath}=fixture(t),p=preview(root,['q-1'],{difficulty:'hard'}),before=fs.readFileSync(contentPath);
  const lock=path.join(root,'server/data/math-command.json.lock');fs.writeFileSync(lock,'external-writer');
  assert.throws(()=>store.applyMathMetadata(root,p.token,actor),error=>error.status===409&&/in progress/.test(error.message));
  assert.deepEqual(fs.readFileSync(contentPath),before);assert.equal(fs.existsSync(path.join(root,'server/data/math-command.json')),false);
  fs.unlinkSync(lock);assert.equal(store.applyMathMetadata(root,p.token,actor).changed,1);assert.equal(fs.existsSync(lock),false);
});

test('saved views, targets, rules and reference-only collections persist and validate',t=>{
  const {root}=fixture(t);
  const save=changes=>store.saveMathCommandPreferences(root,{revision:store.readMathCommandState(root).revision,...changes});
  const filters={category:['Algebra'],difficulty:['medium','hard'],sort:'difficulty',direction:'desc'};
  save({savedViews:[{id:'v1',name:'Medium and hard algebra',filters}],collections:[{id:'c1',name:'Review set',questionIds:['q-1','q-2']}],targets:{defaultPerDifficulty:12,overrides:[{category:'Geometry',subcategory:'Area & Perimeter',difficulty:'hard',minimum:20}]},rules:{minAttempts:10,targetAccuracy:75},pacePerWeek:15});
  const state=store.readMathCommandState(root);assert.deepEqual(state.savedViews[0].filters,filters);assert.deepEqual(state.collections[0],{id:'c1',name:'Review set',questionIds:['q-1','q-2']});assert.equal(state.targets.defaultPerDifficulty,12);assert.equal(state.rules.minAttempts,10);
  for(const bad of [{savedViews:[{id:'',name:'Empty',filters:{}}]},{savedViews:[{id:'a',name:'A',filters:{sort:'anything'}}]},{savedViews:[{id:'a',name:'A',filters:{category:'Algebra'}}]},{collections:[{id:'c',name:'C',questionIds:['missing']}]},{collections:[{id:'c',name:'C',questionIds:[]},{id:'c',name:'D',questionIds:[]}]},{targets:{defaultPerDifficulty:10,overrides:[{category:'Fake',subcategory:'Fake',difficulty:'hard',minimum:5}]}},{rules:{minAttempts:0}},{rules:{minAttempts:2.5}},{rules:{targetAccuracy:101}}])assert.throws(()=>save(bad));
  assert.deepEqual(store.readMathCommandState(root).savedViews[0].filters,filters);
});

test('management endpoints return paginated catalog/detail/CSV and invalidate cached import review status',t=>{
  const {root}=fixture(t,120);
  const catalog=request(root,'GET','/catalog',undefined,{filters:JSON.stringify({page:2,pageSize:25,sort:'id'})});assert.equal(catalog.total,120);assert.equal(catalog.items.length,25);assert.equal(catalog.page,2);
  const detail=request(root,'GET','/catalog/q-1');assert.equal(detail.record.question.id,'q-1');
  assert.equal(request(root,'GET','/export',undefined,{filters:{category:['Algebra']}}).count,120);
  assert.throws(()=>request(root,'GET','/catalog',undefined,{filters:{sort:'no-such-field'}}),/sort/);
  const status=path.join(root,'tools/.content-drafts/math-import-status.json');
  assert.ok(!mathCatalogSnapshot(root).catalog.rows[0].issues.includes('teacher_review'));
  fs.writeFileSync(status,JSON.stringify({[JSON.stringify(['fixture-exam','q-1'])]:{needsEditing:true}}));
  assert.ok(mathCatalogSnapshot(root).catalog.rows.find(r=>r.id==='q-1').issues.includes('teacher_review'));
});

test('ordinary management operations perform no network or AI requests and require no API key',t=>{
  const {root}=fixture(t);const fetch=global.fetch;let calls=0;
  global.fetch=async()=>{calls++;throw new Error('Network disabled for deterministic management test');};
  try{
    const p=preview(root,['q-1'],{difficulty:'hard'});store.applyMathMetadata(root,p.token,actor);
    request(root,'GET','/overview');request(root,'GET','/catalog');request(root,'GET','/duplicates');request(root,'GET','/export');
    assert.equal(calls,0);
  }finally{global.fetch=fetch;}
});
