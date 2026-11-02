import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cleanHtml,convertItem} from './testnav-adapter.mjs';
import {validateMathClassification} from './math-topic-editor.mjs';
const item={number:1,itemId:1,id:'fixture',section:'Math'};
const context={assets:new Map(),source:{form:'C'},key:{}};
const convert=(type,html,script='')=>convertItem({item_id:1,itemBodyHtml:html,itemBodyExtraScript:`var responseSchema=${JSON.stringify([{identifier:'RESPONSE',interactionType:type,subType:type==='CUSTOMINTERACTION'?'tei-ee':'',cardinality:'single'}])};${script}`},item,context);
test('source gap widths and two-column choice order survive conversion',()=>{
 const gap=convert('GAPMATCHINTERACTION','<div class="row"><div><ul class="gap-choiceList"><li data-identifier="a" data-maxlimit="1">First</li></ul><div class="gapmatch-content"><p>Answer <span class="gap" style="width:300px;"></span></p></div></div></div>');
 assert.equal(gap.dragDropSlots[0].width,300);
 const choices=convert('CHOICEINTERACTION','<div class="row"><div><p>Select.</p><ul class="int-choice-list two-up"><li><div class="int-choice-desc">First</div></li><li><div class="int-choice-desc">Second</div></li></ul></div></div>');
 assert.equal(choices.choiceColumns,2);assert.deepEqual(choices.choices.map(c=>c.text),['First','Second']);
});
test('expression palette variable stays separate from the equation label',()=>{
 const config={models:[{math:'<math><mi>z</mi><mo>=</mo></math>',variableButtons:[{id:'w'}]}]};
 const q=convert('CUSTOMINTERACTION','<div class="row"><div><p>Write z in terms of w.</p></div></div>',`var interaction_RESPONSE_options = ${JSON.stringify(config)};`);
 assert.equal(q.entryVariable,'w');assert.equal(q.entryPrefixVariable,'z');assert.equal(q.entryLayout,'x_equals');
 const numeric=convert('CUSTOMINTERACTION','<div class="row"><div><p>Calculate.</p></div></div>',`var interaction_RESPONSE_options = {"models":[{}]};`);
 assert.equal(numeric.entryVariable,undefined);
});
test('compact table styling survives source conversion and editor sanitization',async()=>{
 const {default:documentImport}=await import('./document-import.cjs');
 assert.match(documentImport.sanitizeRichText(cleanHtml('<table border="1"><caption>Title</caption><tr><td>1</td></tr></table>')),/data-table-style="compact"/);
});
test('unchanged legacy blank categories no longer block another question edit',()=>{
 const config={categories:[{label:'Uncategorized',topics:[]}],classificationSkills:[]};
 const q={id:'legacy',topic:''};
 assert.equal(validateMathClassification(q,config,q).topic,'Uncategorized');
 assert.throws(()=>validateMathClassification(q,config),/Main category/);
 assert.throws(()=>validateMathClassification(q,config,{...q,topic:'Algebra'}),/Main category/);
});
