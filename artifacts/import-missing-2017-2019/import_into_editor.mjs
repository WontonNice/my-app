import {readFile,writeFile} from 'node:fs/promises';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const read=async name=>JSON.parse(await readFile(new URL(name,base),'utf8'));
let state=await fetch(url+'/api/state').then(r=>r.json());
const token=state.editToken;
async function api(path,body){
 const response=await fetch(url+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json','X-Editor-Token':token},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const result=await response.json();if(!response.ok)throw new Error(path+' '+response.status+' '+result.message);return result;
}
const receipts={};
for(const form of ['20172018_form_a','20172018_form_b','20192020_form_b']){
 const d=await read(`${form}-import.json`),assessmentId=({'20172018_form_a':'2017-2018-form-a','20172018_form_b':'2017-2018-form-b','20192020_form_b':'2019-2020-form-b'})[form];
 state=await api('/api/state');
 const test=state.tests.find(t=>t.assessmentId===assessmentId);
 if(!test)throw new Error('Destination exam not found');
 if(test.passageIds.length || test.standaloneItemIds.length || test.mathSectionFileName)throw new Error('Destination is no longer empty. Inspect receipts before retrying.');
 const receipt={assessmentId,passages:[],independent:[],math:null};receipts[form]=receipt;
 const save=()=>writeFile(new URL('import-receipts.json',base),JSON.stringify(receipts,null,2));
 const drafts=await api('/api/document-drafts',{source:{format:d.format,source:d.source,passages:d.passages}});
 const entryIds=drafts.lastImport.entryIds;
 for(const id of entryIds){
  const entry=drafts.entries.find(e=>e.id===id);if(entry.kind!=='passage')continue;
  const result=await api('/api/passages',{...entry.content,publishNow:true,publishToExamId:assessmentId});
  if(result.examAssignment?.error)throw new Error(result.examAssignment.error);
  receipt.passages.push({draftId:id,id:result.passage.id,fileName:result.passage.fileName,questions:result.passage.questions.length});await save();
  console.log(form,'passage',result.passage.title,result.passage.questions.length);
 }
 const independent={format:'nathan-tutors-part-b-v1',questions:d.englishQuestions.map(q=>({...q,sourceQuestion:q.review.sourceQuestion,sourceChoiceIds:q.review.sourceChoiceIds,versionLabels:[d.source.label],source:{...d.source,sourceQuestion:q.review.sourceQuestion,pages:q.review.sourcePages},notes:[`Supplied ${q.review.sourceFile}; PDF page ${q.review.sourcePages.join(', ')}; original question ${q.review.sourceQuestion}.`,...(q.review.warnings||[]).map(w=>w.message)]}))};
 await writeFile(new URL(`${form}-independent.json`,base),JSON.stringify(independent,null,2));
 const imp=await api('/api/standalone-import',{source:independent});
 const ids=[...imp.added,...imp.existing];
 for(const id of ids){
  const draft=imp.drafts.find(e=>e.id===id);state=await api('/api/state');
  const result=await api('/api/standalone-drafts/publish',{id,version:draft.version,sourceHash:state.standaloneSourceHash});
  receipt.independent.push({draftId:id,id:result.id,sourceQuestion:draft.question.sourceQuestion});await save();
 }
 if(imp.published.length)throw new Error('Unexpected previously published import; inspect receipts before continuing.');
 receipt.independent.sort((a,b)=>Number(a.sourceQuestion)-Number(b.sourceQuestion));
 state=await api('/api/state');
 await api('/api/tests',{...state.tests.find(t=>t.assessmentId===assessmentId),questionOrder:undefined,standaloneItemIds:receipt.independent.map(q=>q.id)});
 console.log(form,'independent English',receipt.independent.length);
 const math=await api('/api/math/import',{assessmentId,source:{format:d.format,source:d.source,mathQuestions:d.mathQuestions,review:d.review,batch:d.batch}});
 receipt.math=math;await save();
 console.log(form,'Math',math.added.length,'added',math.existing.length,'existing',math.errors);
 if(math.errors.length||math.added.length+math.existing.length!==57)throw new Error('Partial Math import; see receipt before repairing.');
}
const after=await api('/api/state');delete after.editToken;
await writeFile(new URL('editor-after.json',base),JSON.stringify(after));
console.log('Import complete.');
