import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const targets={a:[64,67,69,71,73,79,89,91,92,93,94,96,101,113,114],b:[64,69,75,88,89,95,105,114]};
const initial=await fetch(url+'/api/state').then(r=>r.json());
const orders=initial.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')).map(t=>[t.assessmentId,t.questionOrder]);
const repairs=[],backup=[];
function flow(html){
 let result='',cursor=0,group=[];
 const flush=()=>{if(group.length){result+='<p>'+group.join(' ')+'</p>';group=[];}};
 for(const match of html.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)){
  const between=html.slice(cursor,match.index);
  if(between.trim()){flush();result+=between;}
  if(/<img\b|<table\b/.test(match[2])||match[1].trim()){flush();result+=match[0];}
  else group.push(match[2].trim());
  cursor=match.index+match[0].length;
 }
 flush();return result+html.slice(cursor);
}
for(const form of ['a','b']){
 const state=await fetch(url+'/api/state').then(r=>r.json()),assessmentId=`2023-2024-form-${form}`;
 const test=state.tests.find(t=>t.assessmentId===assessmentId),section=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
 const questions=section.questions.map(q=>{
  if(!targets[form].includes(Number(q.source.sourceQuestion)))return q;
  const prompt=q.prompt.replace(/\s*\n\s*\n\s*/g,' '),promptHtml=flow(q.promptHtml);
  assert.equal(prompt.replace(/\s+/g,' ').trim(),q.prompt.replace(/\s+/g,' ').trim());
  assert.deepEqual([...promptHtml.matchAll(/<img[^>]+>/g)].map(m=>m[0]),[...q.promptHtml.matchAll(/<img[^>]+>/g)].map(m=>m[0]));
  assert.notEqual(promptHtml,q.promptHtml);
  backup.push({form,question:q});repairs.push({form,questionId:q.id,sourceQuestion:q.source.sourceQuestion,prompt,promptHtml});
  return {...q,prompt,promptHtml};
 });
 await fs.writeFile(new URL('math-text-flow-before.json',base),JSON.stringify(backup,null,2));
 const response=await fetch(url+'/api/math',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...section,assessmentId,questions,managementRevision:section.managementRevision})});
 const result=await response.json();if(!response.ok)throw Error(result.message);
 const after=await fetch(url+'/api/state').then(r=>r.json()),saved=after.mathSections.find(m=>m.fileName===section.fileName);
 assert.equal(saved.questions.length,57);
 assert.deepEqual(saved.questions,questions);
 console.log(form.toUpperCase(),targets[form].length,'continuous Math prompts repaired.');
}
for(const form of ['a','b'])for(const suffix of ['import','math','raw-capture']){
 const path=new URL(`form-${form}-${suffix}.json`,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 for(const q of data.mathQuestions){
  const edit=repairs.find(r=>r.form===form&&r.sourceQuestion===q.review.sourceQuestion);
  if(edit){q.prompt=edit.prompt;q.promptHtml=edit.promptHtml;}
 }
 await fs.writeFile(path,JSON.stringify(data,null,2));
}
const after=await fetch(url+'/api/state').then(r=>r.json());
for(const [id,order] of orders)assert.deepEqual(after.tests.find(t=>t.assessmentId===id).questionOrder,order);
await fs.writeFile(new URL('math-text-flow-before.json',base),JSON.stringify(backup,null,2));
await fs.writeFile(new URL('math-text-flow-repairs.json',base),JSON.stringify(repairs,null,2));
console.log('23 prompts corrected. All choices, keys, source figures, review labels and exam question orders are unchanged.');
