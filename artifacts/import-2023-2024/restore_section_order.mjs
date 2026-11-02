import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const state=await fetch(url+'/api/state').then(r=>r.json());
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const contentBefore=digest([state.passages,state.standaloneItems,state.mathSections]);
const expected=new Map();
for(const form of ['a','b']){
 const id=`2023-2024-form-${form}`,test=state.tests.find(t=>t.assessmentId===id);
 const passageQuestions=ids=>ids.flatMap(id=>state.passages.find(p=>p.id===id).questions.map(q=>q.id));
 const math=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
 const groups=[passageQuestions(test.readingPassageIds),passageQuestions(test.revisingEditingPartAPassageIds),test.standaloneItemIds,math.questions.map(q=>q.id)];
 const order=groups.flat();assert.equal(order.length,114);assert.equal(new Set(order).size,114);
 assert.deepEqual([...order].sort(),[...test.questionOrder].sort());
 const response=await fetch(url+'/api/tests',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...test,questionOrder:order})});
 const result=await response.json();if(!response.ok)throw Error(result.message);
 expected.set(id,{order,groups,presentationOverrides:test.presentationOverrides});
 console.log(form.toUpperCase(),`Reading ${groups[0].length} -> Revising/Editing A ${groups[1].length} -> standalone ${groups[2].length}; Math ${groups[3].length}`);
}
const after=await fetch(url+'/api/state').then(r=>r.json());
assert.equal(digest([after.passages,after.standaloneItems,after.mathSections]),contentBefore,'Content or formatting changed');
const exported=JSON.parse(await fs.readFile(new URL('../../server/data/exam-content.json',base),'utf8'));
for(const [id,{order,presentationOverrides}] of expected){
 const test=after.tests.find(t=>t.assessmentId===id);
 assert.deepEqual(test.questionOrder,order);
 assert.deepEqual(test.presentationOverrides,presentationOverrides);
 assert.deepEqual(exported[id].questionOrder,order);
}
const reports=JSON.parse(await fs.readFile(new URL('saved-verification.json',base),'utf8'));
for(const report of reports){
 const {order}=expected.get(`2023-2024-form-${report.form.toLowerCase()}`);
 delete report.sourceOrder;report.displaySectionOrder=['reading','revising_editing_a','standalone','math'];report.displayOrder=order;report.formattingUnchanged=true;
}
await fs.writeFile(new URL('saved-verification.json',base),JSON.stringify(reports,null,2));
delete after.editToken;await fs.writeFile(new URL('editor-after.json',base),JSON.stringify(after));
console.log('Verified both saved exams and student exports. Passage, question, Math formatting and presentation settings are unchanged.');
