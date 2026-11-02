import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import imp from '../../tools/document-import.cjs';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const load=async file=>JSON.parse(await fs.readFile(new URL(file,base),'utf8'));
let state=await fetch(url+'/api/state').then(r=>r.json());
const token=state.editToken;
const api=async(path,body)=>{const r=await fetch(url+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Editor-Token':token},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok)throw Error(path+' '+d.message);return d};
const receipts=await load('import-receipts.json'),reports=[];
const normalized=t=>String(t??'').replace(/\s+/g,' ').trim();
for(const form of ['a','b']){
 const source=await load(`form-${form}-import.json`),receipt=receipts[form];
 const test=state.tests.find(t=>t.assessmentId===receipt.assessmentId);
 const selected=receipt.passages.map(r=>state.passages.find(p=>p.id===r.id));
 const math=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
 const independent=receipt.independent.map(r=>state.standaloneItems.find(q=>q.id===r.id));
 assert.equal(selected.length,7);assert.equal(independent.length,source.englishQuestions.length);assert.equal(math.questions.length,57);
 const questionsForPassages=ids=>ids.flatMap(id=>state.passages.find(p=>p.id===id).questions.map(q=>q.id));
 const order=[...questionsForPassages(test.readingPassageIds),...questionsForPassages(test.revisingEditingPartAPassageIds),...test.standaloneItemIds,...math.questions.map(q=>q.id)];
 assert.equal(new Set(order).size,114);
 // Display English in the platform's established section order. Printed
 // source question numbers remain provenance, not display-order instructions.
 const original=imp.parse(source),sourceQuestions=[...original.find(e=>e.kind==='standalone').content.questions,...original.filter(e=>e.kind==='passage').flatMap(e=>e.content.questions),...original.find(e=>e.kind==='math').content.questions];
 const canonical=[...independent,...selected.flatMap(p=>p.questions),...math.questions];
 const overrides=structuredClone(test.presentationOverrides||{questions:{}});overrides.questions||={};
 const sourcePresentationCorrections=[];
 for(let i=0;i<canonical.length;i++){
  const current=canonical[i],captured=sourceQuestions[i];
  if(normalized(current.explanation)!==normalized(captured.explanation)&&normalized(current.explanation.replace(/^\d+\.\s*/,''))===normalized(captured.explanation)){
   // A shared bank passage may retain numbering from an earlier edition.
   // Its existing per-exam presentation layer preserves this supplied form's
   // explanation/source reference while retaining canonical grading and IDs.
   overrides.questions[current.id]={base:current,question:{...current,source:captured.source,explanation:captured.explanation,explanationHtml:captured.explanationHtml}};
   sourcePresentationCorrections.push({sourceQuestion:i+1,questionId:current.id,reason:'Shared passage explanation retained another edition’s question-number prefix.'});
  }
 }
 await api('/api/tests',{...test,questionOrder:order,source:source.source,...(Object.keys(overrides.questions).length?{presentationOverrides:overrides}:{})});
 const saved=canonical.map(q=>overrides.questions[q.id]?.question||q);
 const differences=[];
 for(let i=0;i<114;i++){
  const a=sourceQuestions[i],b=saved[i];
  for(const field of ['prompt','stimulus','correctChoiceId','explanation'])if(normalized(a[field])!==normalized(b[field]))differences.push({question:i+1,field,expected:a[field],actual:b[field]});
  assert.deepEqual(a.correctTextAnswers||[],b.correctTextAnswers||[],form+' key '+(i+1));
  assert.equal(a.choices?.length||0,b.choices?.length||0);
  for(let c=0;c<(a.choices?.length||0);c++)if(normalized(a.choices[c].text)!==normalized(b.choices[c].text))differences.push({question:i+1,field:'choice '+c,expected:a.choices[c].text,actual:b.choices[c].text});
 }
 const passageDifferences=[];
 for(let i=0;i<selected.length;i++){
  const a=source.passages[i],b=selected[i];
  for(const field of ['text','blurb','author','byline','sourceNote'])if(normalized(a[field])!==normalized(b[field]))passageDifferences.push({title:a.title,field,expected:a[field],actual:b[field]});
  assert.equal((a.richText.match(/data-glossary-definition/g)||[]).length,(b.richText.match(/data-glossary-definition/g)||[]).length);
 }
 const missingAssets=[];const paths=[...new Set(JSON.stringify(saved).concat(JSON.stringify(selected)).match(/\/exam-images\/[\w.-]+/g)||[])];
 for(const path of paths)try{await fs.access(new URL('../../client/public'+path,base))}catch{missingAssets.push(path)}
 assert.equal(missingAssets.length,0);
 const mathStatus=JSON.parse(await fs.readFile(new URL('../../tools/.content-drafts/math-import-status.json',base),'utf8'));
 reports.push({form:form.toUpperCase(),questions:114,english:57,math:57,passages:7,independentEnglish:independent.length,displaySectionOrder:['reading','revising_editing_a','standalone','math'],displayOrder:order,sourcePresentationCorrections,transcriptionDifferences:differences,passageDifferences,referencedAssets:paths.length,missingAssets,mathStatusKeys:Object.keys(mathStatus).filter(k=>k.includes(receipt.assessmentId)).length});
 console.log(form,'114 saved questions;',differences.length,'question differences;',passageDifferences.length,'passage differences;',paths.length,'assets verified');
}
state=await api('/api/state');delete state.editToken;
await fs.writeFile(new URL('editor-after.json',base),JSON.stringify(state));
await fs.writeFile(new URL('saved-verification.json',base),JSON.stringify(reports,null,2));
if(reports.some(r=>r.transcriptionDifferences.length||r.passageDifferences.length))process.exitCode=1;
