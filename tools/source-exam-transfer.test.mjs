import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {hasSuppliedKey,inspectTransfer,remapPresentationQuestion,auditQuestionFingerprint,rewriteServiceImports,typecheckAuthoredContent} from './source-exam-transfer.mjs';

test('bounded service loader rewrites real imports without changing generated source imports',()=>{
  const source='import helpers from "./document-import.cjs";\nimport ts from "typescript";\nfunction generated(){return `import type { ExamQuestion } from "./types";\\nexport const items=[];`;}\nconst example="from \\\"./another-file\\\"";';
  const rewritten=rewriteServiceImports(source);
  assert.match(rewritten,/import helpers from "file:\/\//);assert.match(rewritten,/import ts from "file:\/\//);
  assert.ok(rewritten.includes('return `import type { ExamQuestion } from "./types";'));
  assert.ok(rewritten.includes('const example="from \\\"./another-file\\\"";'));
});

test('presentation remaps response identities to the existing question',()=>{
  const base={id:'old',type:'math_drag_drop',items:[{id:'old-one',text:'1'}],dragDropSlots:[{id:'old-slot',correctItemId:'old-one'}]};
  const incoming={id:'source',type:'math_drag_drop',items:[{id:'item-1',text:'1',html:'<strong>1</strong>'}],dragDropSlots:[{id:'slot-1',correctItemId:'item-1'}],dragDropContentHtml:'<p>{{slot-1}}</p>'};
  const next=remapPresentationQuestion(incoming,base);
  assert.equal(next.id,'old');assert.equal(next.items[0].id,'old-one');assert.equal(next.dragDropSlots[0].correctItemId,'old-one');assert.equal(next.dragDropContentHtml,'<p>{{old-slot}}</p>');
  assert.equal(next.items[0].html,'<strong>1</strong>');assert.equal(incoming.id,'source');
});
test('reuse audit fingerprint excludes teacher classification but binds all source content',()=>{
  const q={id:'q',type:'multiple_choice',prompt:'Question',choices:[{id:'A',text:'Original'}],correctChoiceId:'A'};
  assert.equal(auditQuestionFingerprint(q),auditQuestionFingerprint({...q,topic:'Teacher topic',commandMetadata:{difficulty:'hard'}}));
  assert.notEqual(auditQuestionFingerprint(q),auditQuestionFingerprint({...q,choices:[{id:'A',text:'Changed'}]}));
});
test('source graph retains canonical point IDs and number line grading',()=>{
  const base={id:'old-graph',graph:{points:[{id:'original-2',x:2,y:5},{id:'original-1',x:1,y:3}]},correctPointIds:['original-1']};
  const incoming={id:'source',graph:{points:[{id:'point-1',x:1,y:3,sourceX:67,sourceY:321},{id:'point-2',x:2,y:5}],sourceImage:{src:'/exam-images/source.svg'}},correctPointIds:['point-1']};
  const next=remapPresentationQuestion(incoming,base);
  assert.deepEqual(next.graph.points.map(p=>p.id),['original-1','original-2']);assert.deepEqual(next.correctPointIds,['original-1']);assert.equal(next.graph.points[0].sourceY,321);
  assert.throws(()=>remapPresentationQuestion({...incoming,graph:{points:[{id:'other',x:8,y:8}]}},base),/no canonical response identity/);
  const numberLine=remapPresentationQuestion({id:'n',numberLineResponse:{min:-10,max:10,correctValue:2,correctEndpoint:'open',correctDirection:'left'}},{id:'old',numberLineResponse:{correctValue:1,correctEndpoint:'closed',correctDirection:'right'}});
  assert.deepEqual(numberLine.numberLineResponse,{min:-10,max:10,correctValue:1,correctEndpoint:'closed',correctDirection:'right'});
});

test('structured source keys are recognized without computing answers',()=>{
  assert.equal(hasSuppliedKey({type:'inline_dropdown',dropdowns:[{correctChoiceId:'B',options:[{id:'A'},{id:'B'}]}]}),true);
  assert.equal(hasSuppliedKey({type:'inline_dropdown',dropdowns:[{correctChoiceId:'C',options:[{id:'A'},{id:'B'}]}]}),false);
  assert.equal(hasSuppliedKey({type:'math_drag_drop',dragDropSlots:[{correctItemId:'one'}],items:[{id:'one'}]}),true);
  assert.equal(hasSuppliedKey({type:'math_drag_drop',dragDropSlots:[{}],items:[{id:'one'}]}),false);
  assert.equal(hasSuppliedKey({type:'transition_drop',dragDropSlots:[{correctItemId:'one'}],items:[{id:'one'}]}),true);
  assert.equal(hasSuppliedKey({type:'transition_drop',dragDropSlots:[{correctItemId:'one'}],choices:[{id:'one'}]}),true);
  assert.equal(hasSuppliedKey({type:'transition_drop',dragDropSlots:[{correctItemId:'missing'}],items:[{id:'one'}]}),false);
  assert.equal(hasSuppliedKey({type:'matrix_choice',correctPlacements:{row:'column'}}),true);
  assert.equal(hasSuppliedKey({type:'graph_point_select',correctPointIds:['p1']}),true);
  assert.equal(hasSuppliedKey({type:'number_line_response',numberLineResponse:{correctValue:0}}),true);
  assert.equal(hasSuppliedKey({type:'number_line_response',numberLineResponse:{}}),false);
});

async function fixture(t,change=()=>{}) {
  const parent=join(tmpdir(),'source-transfer-tests');await mkdir(parent,{recursive:true});
  const root=await mkdtemp(join(parent,'fixture-'));
  t.after(async()=>{assert.equal(dirname(resolve(root)),resolve(parent));await rm(root,{recursive:true,force:true});});
  const payload={format:'nathan-tutors-official-passage-v1',source:{sourceFamily:'official_shsat',sourceFormat:'pdf',title:'Transfer verification',expectedQuestionCount:1,sectionOrder:[{title:'Math',questions:['q1']}]},mathQuestions:[{id:'q1',type:'multiple_choice',prompt:'Source question',choices:[{id:'A',text:'One'},{id:'B',text:'Two'},{id:'C',text:'Three'},{id:'D',text:'Four'}],correctChoiceId:'B'}]};
  change(payload);const file=join(root,'import.json');await writeFile(file,JSON.stringify(payload));return file;
}

test('preflight accepts complete source inventory and prefers exam-wide source count',async t=>{
  const file=await fixture(t,p=>{p.review={expectedQuestionCount:0};p.source.examId='original-exam';p.source.sourceUrl='https://example.test/source';});
  const result=await inspectTransfer(file);assert.equal(result.expectedCount,1);assert.deepEqual(result.errors,[]);
  assert.equal(result.source.sourceId,'original-exam');assert.equal(result.source.url,'https://example.test/source');
  assert.equal(result.entries[0].content.questions[0].source.sourceId,'original-exam');
  assert.equal(result.payload.source.sourceId,undefined); // Retain the actual original JSON, not the normalized projection.
});
test('preflight rejects missing keys instead of inventing answers',async t=>{
  const file=await fixture(t,p=>delete p.mathQuestions[0].correctChoiceId);
  assert.ok((await inspectTransfer(file)).errors.some(message=>message.includes('No supplied grading key')));
});
test('preflight rejects duplicate or missing source-order IDs',async t=>{
  const file=await fixture(t,p=>p.source.sectionOrder[0].questions=['missing']);
  assert.ok((await inspectTransfer(file)).errors.some(message=>message.includes('Source order')));
});
test('standalone English is included in the complete mixed exam and root source order',async t=>{
  const file=await fixture(t,p=>{
    p.englishQuestions=[{...p.mathQuestions[0],id:'ela-1',prompt:'Independent English item'}];
    p.source.expectedQuestionCount=2;delete p.source.sectionOrder;p.questionOrder=['ela-1','q1'];
  });
  const result=await inspectTransfer(file);assert.deepEqual(result.errors,[]);assert.equal(result.questions.length,2);
  assert.equal(result.standalone.length,1);assert.equal(result.standalone[0].content.questions[0].id,'ela-1');assert.deepEqual(result.sourceOrder,['ela-1','q1']);
});
test('preflight rejects image paths that would escape public assets',async t=>{
  const file=await fixture(t,p=>p.source.assets=[{destination:'/exam-images/../bad.png',localPath:'missing.png'}]);
  assert.ok((await inspectTransfer(file)).errors.some(message=>message.includes('Invalid local asset')));
});
test('authored-content compiler gate catches invalid generated source',async t=>{
  const parent=join(tmpdir(),'source-transfer-compile-tests');await mkdir(parent,{recursive:true});
  const root=await mkdtemp(join(parent,'fixture-'));
  t.after(async()=>{assert.equal(dirname(resolve(root)),resolve(parent));await rm(root,{recursive:true,force:true});});
  const directory=join(root,'client/src/content/exams');await mkdir(directory,{recursive:true});
  await writeFile(join(directory,'index.ts'),'export const answer: number = "wrong";\n');
  const result=typecheckAuthoredContent(root);
  assert.equal(result.passed,false);assert.ok(result.errors.some(e=>e.code===2322));
});
