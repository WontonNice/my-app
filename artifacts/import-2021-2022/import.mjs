import fs from 'node:fs/promises';
import {publicationContent} from '../../tools/document-drafts.mjs';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const read=async f=>JSON.parse(await fs.readFile(new URL(f,base),'utf8'));
let state=await fetch(url+'/api/state').then(r=>r.json());const token=state.editToken;
async function api(path,body){const r=await fetch(url+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json','X-Editor-Token':token},...(body===undefined?{}:{body:JSON.stringify(body)})});const d=await r.json();if(!r.ok)throw Error(path+' '+r.status+' '+d.message);return d}
const receipts=await read('import-receipts.json').catch(()=>({}));const save=()=>fs.writeFile(new URL('import-receipts.json',base),JSON.stringify(receipts,null,2));
for(const form of ['a','b']){
 if(receipts[form]?.math)continue;
 const d=await read(`form-${form}-import.json`),assessmentId=`2021-2022-form-${form}`;state=await api('/api/state');
 const test=state.tests.find(t=>t.assessmentId===assessmentId);if(!receipts[form]&&(test.passageIds.length||test.standaloneItemIds.length))throw Error('Destination changed: inspect before retrying.');
 const receipt=receipts[form]||={assessmentId,passages:[],independent:[]};
 const drafts=await api('/api/document-drafts',{source:{format:d.format,source:d.source,passages:d.passages}});
 for(const id of drafts.lastImport.entryIds.slice(receipt.passages.length)){const entry=drafts.entries.find(e=>e.id===id);if(entry.kind!=='passage')continue;
  const result=await api('/api/passages',{...entry.content,publishNow:true,publishToExamId:assessmentId});if(result.examAssignment?.error)throw Error(result.examAssignment.error);
  receipt.passages.push({draftId:id,id:result.passage.id,fileName:result.passage.fileName,questions:result.passage.questions.length});await save();console.log(form,result.passage.title);
 }
 const independent={format:'nathan-tutors-part-b-v1',questions:d.englishQuestions.map(q=>({...q,sourceQuestion:q.review.sourceQuestion,sourceChoiceIds:q.review.sourceChoiceIds,versionLabels:[d.source.label],source:{...d.source,sourceQuestion:q.review.sourceQuestion,pages:q.review.sourcePages},notes:[`Supplied ${q.review.sourceFile}; PDF page ${q.review.sourcePages.join(', ')}; original question ${q.review.sourceQuestion}.`]}))};
 await fs.writeFile(new URL(`form-${form}-independent.json`,base),JSON.stringify(independent,null,2));
 const imp=await api('/api/standalone-import',{source:independent});
 for(const id of [...imp.added,...imp.existing]){const draft=imp.drafts.find(e=>e.id===id);state=await api('/api/state');const r=await api('/api/standalone-drafts/publish',{id,version:draft.version,sourceHash:state.standaloneSourceHash});receipt.independent.push({draftId:id,id:r.id,sourceQuestion:draft.question.sourceQuestion});await save()}
 for(const id of imp.published)receipt.independent.push({id,reused:true});await save();
 state=await api('/api/state');await api('/api/tests',{...state.tests.find(t=>t.assessmentId===assessmentId),questionOrder:undefined,standaloneItemIds:receipt.independent.map(q=>q.id)});
 if(form==='b'){
  receipt.math=await api('/api/math/import',{assessmentId,source:await read('form-b-math.json')});await save();if(receipt.math.errors.length||receipt.math.added.length+receipt.math.existing.length!==57)throw Error('Partial math import');
 }else{
  state=await api('/api/state');const current=state.mathSections.find(m=>m.fileName==='2021-2022-form-aMath.ts');
  const e=(await read('form-a-parsed.json')).find(e=>e.kind==='math');const captured=publicationContent(e,{allowUnresolved:true}).questions;
  const questions=current.questions.map(q=>{const update=captured.find(x=>x.id===q.id);if(!update)throw Error('Missing existing Math ID '+q.id);return {...q,...update,topic:q.topic,subtopic:q.subtopic,skilled:q.skilled,commandMetadata:q.commandMetadata,importNeedsEditing:q.importNeedsEditing}});
  receipt.math=await api('/api/math',{...current,assessmentId,questions});await save();
 }
 console.log(form,'57 English and 57 Math saved');
}
state=await api('/api/state');delete state.editToken;await fs.writeFile(new URL('editor-after-import.json',base),JSON.stringify(state));
