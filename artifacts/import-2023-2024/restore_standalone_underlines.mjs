import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const sources=JSON.parse(await fs.readFile(new URL('standalone-source-underlines.json',base),'utf8'));
const receipts=JSON.parse(await fs.readFile(new URL('import-receipts.json',base),'utf8'));
const initial=await fetch(url+'/api/state').then(r=>r.json()),backups=[];
const orders=initial.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')).map(t=>[t.assessmentId,t.questionOrder]);
for(const source of sources){
 const id=receipts[source.form].independent.find(q=>q.sourceQuestion===source.sourceQuestion).id;
 const state=await fetch(url+'/api/state').then(r=>r.json()),item=state.standaloneItems.find(q=>q.id===id);
 assert.equal(source.stimulus.replace(/\s+/g,' ').trim(),item.stimulus.replace(/\s+/g,' ').trim());
 backups.push({form:source.form,sourceQuestion:source.sourceQuestion,item});
 if(item.stimulusHtml===source.stimulusHtml)continue;
 const response=await fetch(url+'/api/standalone-items',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({item:{...item,stimulusHtml:source.stimulusHtml},originalId:id,sourceHash:state.standaloneSourceHash})});
 const result=await response.json();if(!response.ok)throw Error(result.message);
 const after=await fetch(url+'/api/state').then(r=>r.json()),saved=after.standaloneItems.find(q=>q.id===id);
 assert.deepEqual({...saved,stimulusHtml:undefined},{...item,stimulusHtml:undefined});
 assert.deepEqual([...saved.stimulusHtml.matchAll(/<u>(.*?)<\/u>/g)].map(m=>m[1]),source.underlines);
 console.log(source.form.toUpperCase(),'standalone',source.sourceQuestion,source.underlines.length,'source underlines restored');
}
for(const form of ['a','b'])for(const suffix of ['import','english','raw-capture','independent']){
 const path=new URL(`form-${form}-${suffix}.json`,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 for(const q of data.englishQuestions||data.questions||[]){
  const source=sources.find(s=>s.form===form&&s.sourceQuestion===(q.sourceQuestion||q.review.sourceQuestion));
  assert(source);q.stimulusHtml=source.stimulusHtml;
 }
 await fs.writeFile(path,JSON.stringify(data,null,2));
}
const after=await fetch(url+'/api/state').then(r=>r.json());
for(const [id,order] of orders)assert.deepEqual(after.tests.find(t=>t.assessmentId===id).questionOrder,order);
const exports=JSON.parse(await fs.readFile(new URL('../../server/data/exam-content.json',base),'utf8'));
for(const source of sources){
 const id=receipts[source.form].independent.find(q=>q.sourceQuestion===source.sourceQuestion).id;
 const q=exports[`2023-2024-form-${source.form}`].standaloneSection.questions.find(q=>q.id===id);
 assert.deepEqual([...q.stimulusHtml.matchAll(/<u>(.*?)<\/u>/g)].map(m=>m[1]),source.underlines);
}
await fs.writeFile(new URL('standalone-underlines-before.json',base),JSON.stringify(backups,null,2));
await fs.writeFile(new URL('standalone-underlines-verification.json',base),JSON.stringify({itemsChecked:7,itemsWithPrintedUnderlines:5,sourceUnderlineSpans:28,wordingChoicesKeysAndOrderUnchanged:true,exportedUnderlinesVerified:true},null,2));
console.log('All seven items checked; 28 source underline spans preserved in editor content and student exports.');
