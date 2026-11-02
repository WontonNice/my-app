import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import katex from 'katex';
import contract from '../../tools/document-import.cjs';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const initial=await fetch(url+'/api/state').then(r=>r.json());
const orders=initial.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')).map(t=>[t.assessmentId,t.questionOrder]);
const changes=[];
const unformatted=q=>{
 const next={...q};for(const field of ['promptHtml','instructionsHtml','stimulusHtml','explanationHtml'])delete next[field];
 if(next.choices)next.choices=next.choices.map(({html,...choice})=>choice);
 return next;
};
for(const form of ['a','b']){
 const state=await fetch(url+'/api/state').then(r=>r.json()),assessmentId=`2023-2024-form-${form}`;
 const test=state.tests.find(t=>t.assessmentId===assessmentId),section=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
 const questions=section.questions.map(q=>{
  const next=contract.formatImportedMathChoices(q);
  assert.deepEqual(unformatted(next),unformatted(q),'source wording, grading and metadata are unchanged');
  assert.deepEqual(contract.formatImportedMathChoices(next),next,'idempotent');
  const htmls=x=>[x.promptHtml,x.instructionsHtml,x.stimulusHtml,x.explanationHtml,...(x.choices||[]).map(c=>c.html)].filter(Boolean);
  const originalMath=new Set(htmls(q).flatMap(html=>Array.from(html.matchAll(/\\\((.*?)\\\)/g),m=>m[1])));
  for(const html of htmls(next))for(const [,math] of html.matchAll(/\\\((.*?)\\\)/g))if(!originalMath.has(math))katex.renderToString(math,{throwOnError:true});
  const images=x=>htmls(x).flatMap(html=>html.match(/<img\b[^>]*>/g)||[]);
  assert.deepEqual(images(next),images(q),'all image attributes and placement remain');
  if(JSON.stringify(next)!==JSON.stringify(q))changes.push({form,sourceQuestion:q.source.sourceQuestion,questionId:q.id,before:q,after:next});
  return next;
 });
 await fs.writeFile(new URL('numeric-notation-repairs.json',base),JSON.stringify(changes,null,2));
 const response=await fetch(url+'/api/math',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...section,assessmentId,questions})});
 const result=await response.json();if(!response.ok)throw Error(result.message);
 const after=await fetch(url+'/api/state').then(r=>r.json()),saved=after.mathSections.find(m=>m.fileName===section.fileName);
 assert.deepEqual(saved.questions,questions);
 console.log(form.toUpperCase(),changes.filter(c=>c.form===form).length,'questions updated with shared numeric LaTeX.');
}
for(const form of ['a','b'])for(const suffix of ['import','math','raw-capture']){
 const path=new URL(`form-${form}-${suffix}.json`,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 data.mathQuestions=data.mathQuestions.map(contract.formatImportedMathChoices);
 await fs.writeFile(path,JSON.stringify(data,null,2));
}
const after=await fetch(url+'/api/state').then(r=>r.json());
for(const [id,order] of orders)assert.deepEqual(after.tests.find(t=>t.assessmentId===id).questionOrder,order);
console.log('Verified both saved sections, source wording, keys, figures and exam order.');
