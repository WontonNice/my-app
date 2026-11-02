import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import imp from '../../tools/document-import.cjs';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const source=JSON.parse(await fs.readFile(new URL('quoted-prompts-audit-results.json',base),'utf8'));
assert.equal(source.length,26);assert(source.every(q=>q.wordingSame));
const targets=source.filter(q=>q.changed),backups=[];
const initial=await fetch(url+'/api/state').then(r=>r.json());
const orders=initial.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')).map(t=>[t.assessmentId,t.questionOrder]);
for(const passageId of new Set(targets.map(q=>q.passageId))){
 const state=await fetch(url+'/api/state').then(r=>r.json());
 const passage=state.passages.find(p=>p.id===passageId),edits=targets.filter(q=>q.passageId===passageId);
 const questions=passage.questions.map(q=>{
  const edit=edits.find(e=>e.questionId===q.id);if(!edit)return q;
  assert.equal(q.prompt.replace(/\s+/g,' ').trim(),edit.prompt.replace(/\s+/g,' ').trim());
  backups.push({passageId,question:q});return {...q,prompt:edit.prompt,promptHtml:edit.promptHtml};
 });
 const response=await fetch(url+'/api/passages',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...passage,questions,preserveSourceLayout:true,publishNow:true})});
 const result=await response.json();if(!response.ok)throw Error(result.message);
 const after=await fetch(url+'/api/state').then(r=>r.json()),saved=after.passages.find(p=>p.id===passageId);
 assert.deepEqual({...saved,questions:undefined,sourceHash:undefined},{...passage,questions:undefined,sourceHash:undefined});
 assert.deepEqual(saved.questions,questions);
 console.log('Corrected',passage.title,'source question',edits.map(e=>e.sourceQuestion).join(', '));
}
for(const form of ['a','b'])for(const suffix of ['import','english','raw-capture']){
 const path=new URL(`form-${form}-${suffix}.json`,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 for(const p of data.passages)for(const q of p.questions){
  const edit=targets.find(e=>e.form===form&&e.sourceQuestion===q.review.sourceQuestion);
  if(edit){q.prompt=edit.prompt;q.promptHtml=edit.promptHtml;}
 }
 await fs.writeFile(path,JSON.stringify(data,null,2));
}
const after=await fetch(url+'/api/state').then(r=>r.json());
const readQuote=html=>(imp.readQuestionExcerpt({promptHtml:html,prompt:''})?.excerpt||'').replace(/\*/g,'').trim();
for(const item of source){
 const q=after.passages.find(p=>p.id===item.passageId).questions.find(q=>q.id===item.questionId);
 assert.equal(readQuote(q.promptHtml).replace(/\s+/g,' '),item.newExcerpt.replace(/\s+/g,' '));
 assert.equal(readQuote(q.promptHtml).split(/\n\s*\n/).length,item.newExcerpt.split(/\n\s*\n/).length);
}
for(const [id,order] of orders)assert.deepEqual(after.tests.find(t=>t.assessmentId===id).questionOrder,order);
await fs.writeFile(new URL('quoted-prompts-repair-backup.json',base),JSON.stringify(backups,null,2));
await fs.writeFile(new URL('quoted-prompts-verification.json',base),JSON.stringify({checked:26,corrected:targets.map(t=>({form:t.form,sourceQuestion:t.sourceQuestion,passageId:t.passageId})),allExcerptTextAndParagraphGapsMatchSource:true,englishDisplayOrderUnchanged:true},null,2));
console.log('All 26 saved quoted prompts now retain the complete source excerpts and paragraph gaps.');
