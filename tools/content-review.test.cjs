const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ranges = require('./review-ranges.js');
const review = require('./english-review.cjs');

test('math ranges use original one-based question numbers and reject invalid entire selections', () => {
  assert.deepEqual(ranges.parse('1–3, 2, 5, 7-8', 8), [0,1,2,4,6,7]);
  for(const bad of ['', '0', '9', '3-1', '2.5', '1,,3', '1-3, bad', '-1']) assert.throws(()=>ranges.parse(bad,8));
});

function mathHarness(save) {
  const app={saving:false,mathDirty:false,mathDraft:{questions:[{id:'a',importNeedsEditing:true,prompt:'Unsaved edit'}, {id:'b',importNeedsEditing:true}, {id:'c',importNeedsEditing:false}]}};
  let saves=0;
  const context=vm.createContext({app,markMathDirty:()=>app.mathDirty=true,saveMath:async()=>{saves++;await save(app);},renderMathBuilder:()=>{},setStatus:()=>{}});
  vm.runInContext(fs.readFileSync(__dirname+'/content-studio-batches.js','utf8')+'\nthis.batch=MathBatchStudio;',context);
  return {app,finish:indices=>context.batch.finishQuestions(indices),saves:()=>saves};
}
test('bulk math finishing saves once and leaves unselected review flags and edits intact',async()=>{
  const h=mathHarness(async app=>{app.mathDirty=false;});await h.finish([0,2]);
  assert.equal(h.saves(),1);assert.equal(h.app.mathDraft.questions[0].importNeedsEditing,false);
  assert.equal(h.app.mathDraft.questions[1].importNeedsEditing,true);assert.equal(h.app.mathDraft.questions[0].prompt,'Unsaved edit');
  await h.finish([0,2]);assert.equal(h.saves(),1);
});
test('validation failure or rejected save restores all selected math review flags',async()=>{
  for(const throws of [false,true]){
    const h=mathHarness(async()=>{if(throws)throw Error('stale source');});
    if(throws)await assert.rejects(h.finish([0,1]),/stale/);else await h.finish([0,1]);
    assert.equal(h.app.mathDraft.questions[0].importNeedsEditing,true);assert.equal(h.app.mathDraft.questions[1].importNeedsEditing,true);
    assert.equal(h.app.mathDraft.questions[2].importNeedsEditing,false);assert.equal(h.app.mathDraft.questions[0].prompt,'Unsaved edit');
  }
});

const question=id=>({id,type:'multiple_choice',prompt:'Which edit?',stimulus:'Specific sentence.',topic:'Punctuation',choices:[{id:'A',text:'First'},{id:'B',text:'Second'}],correctChoiceId:'A'});
function fixture(){const q=question('q');return {passages:[{id:'p',section:'revising_editing_a',title:'Passage',text:'The source paragraph.',richText:'<p>The source paragraph.</p>',questions:[question('pq')]}],standaloneItems:[q,{...q,id:'version',duplicateOf:'q'}],tests:[{assessmentId:'exam',title:'Exam',passageIds:['p'],standaloneItemIds:['version']}]};}
test('English center groups retained versions, reports usage, and keeps drafts separate',()=>{
  const inventory=fixture();const drafts=[{id:'d',question:question('draft')}];
  const rows=review.buildRows(inventory,drafts,{entries:[]});
  assert.equal(rows.length,3);assert.equal(rows[1].exams[0].id,'exam');assert.equal(rows[2].status,'draft');
  assert.ok(rows[1].duplicates.includes('import:d'));
  assert.throws(()=>review.applyReview(rows,{}, {items:[{key:rows[2].key,hash:rows[2].hash}],finished:true}),/draft/);
});
test('review completion invalidates on content, answer, or passage-format changes',()=>{
  const inventory=fixture();let rows=review.buildRows(inventory,[],{entries:[]});
  const records=review.applyReview(rows,{}, {items:rows.map(({key,hash})=>({key,hash})),finished:true});
  assert.ok(review.buildRows(inventory,[],{entries:[]},records).every(r=>r.status==='finished'));
  inventory.passages[0].richText='<p><u>The</u> source paragraph.</p>';
  inventory.standaloneItems[0].correctChoiceId='B';
  rows=review.buildRows(inventory,[],{entries:[]},records);assert.ok(rows.every(r=>r.status==='needs-review'));
});
test('stale, duplicate, and incomplete selections cannot partially mark English questions finished',()=>{
  const inventory=fixture();const rows=review.buildRows(inventory,[],{entries:[]});const items=rows.map(({key,hash})=>({key,hash}));const records={};
  assert.throws(()=>review.applyReview(rows,records,{items:[items[0],{...items[1],hash:'old'}],finished:true}),/changed/);
  assert.throws(()=>review.applyReview(rows,records,{items:[items[0],items[0]],finished:true}),/duplicate/);
  rows[1].blocked='Missing answer key';assert.throws(()=>review.applyReview(rows,records,{items,finished:true}),/Missing answer key/);
  assert.deepEqual(records,{});
});
test('possible repeats recognize embedded paragraphs without confusing different source contexts',()=>{
  const inventory=fixture();inventory.standaloneItems.push({...question('embedded'),prompt:'Which edit? Specific sentence.',stimulus:''});
  inventory.passages.push({...inventory.passages[0],id:'other',text:'A different paragraph.',richText:'',questions:[question('other-q')]});
  const rows=review.buildRows(inventory,[],{entries:[]});
  assert.ok(rows.find(r=>r.key==='standalone:q').duplicates.includes('standalone:embedded'));
  assert.equal(rows.find(r=>r.key==='passage:p:pq').duplicates.length,0);
});

test('English filters search separated stimuli and passage context, and scope selection to visible rows',()=>{
  const context=vm.createContext({});
  vm.runInContext(fs.readFileSync(__dirname+'/content-studio-english-review.js','utf8')+'\nthis.center=EnglishReviewStudio;',context);
  const center=context.center;center.rows=review.buildRows(fixture(),[],{entries:[]});
  center.filters={search:'Specific sentence'};assert.equal(center.visible().length,2);
  center.filters={section:'part-a',search:'source paragraph'};assert.equal(center.visible().length,1);
  center.filters={exam:'unassigned'};assert.equal(center.visible().length,0);
  center.filters={status:'finished'};assert.equal(center.visible().length,0);
});
