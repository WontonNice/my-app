import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import contract from '../../tools/document-import.cjs';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const initial=await fetch(url+'/api/state').then(r=>r.json());
const orders=initial.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')).map(t=>[t.assessmentId,t.questionOrder]);
const changes=[];
for(const form of ['a','b']){
 const state=await fetch(url+'/api/state').then(r=>r.json()),assessmentId=`2023-2024-form-${form}`;
 const test=state.tests.find(t=>t.assessmentId===assessmentId),section=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
 const questions=section.questions.map(q=>{
  const next=contract.formatMathGeometryNotation(q);
  if(JSON.stringify(next)!==JSON.stringify(q)){
   changes.push({form,sourceQuestion:q.source.sourceQuestion,questionId:q.id,before:q,after:next});
   assert.deepEqual(next.choices,q.choices);assert.equal(next.correctChoiceId,q.correctChoiceId);
  }
  return next;
 });
 await fs.writeFile(new URL('segment-notation-repairs.json',base),JSON.stringify(changes,null,2));
 const response=await fetch(url+'/api/math',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...section,assessmentId,questions})});
 const result=await response.json();if(!response.ok)throw Error(result.message);
 const after=await fetch(url+'/api/state').then(r=>r.json()),saved=after.mathSections.find(m=>m.fileName===section.fileName);
 assert.deepEqual(saved.questions,questions);
 console.log(form.toUpperCase(),'saved with existing MathLive/KaTeX segment notation.');
}
for(const form of ['a','b'])for(const suffix of ['import','math','raw-capture']){
 const path=new URL(`form-${form}-${suffix}.json`,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 data.mathQuestions=data.mathQuestions.map(contract.formatMathGeometryNotation);
 await fs.writeFile(path,JSON.stringify(data,null,2));
}
const after=await fetch(url+'/api/state').then(r=>r.json());
for(const [id,order] of orders)assert.deepEqual(after.tests.find(t=>t.assessmentId===id).questionOrder,order);
assert.equal(changes.length,2);
console.log('Both affected questions repaired; grading, figures, review labels and exam order are preserved.');
