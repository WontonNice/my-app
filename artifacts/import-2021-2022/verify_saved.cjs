const fs=require('fs'),path=require('path'),assert=require('assert/strict'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {createSourcePassage}=require('../../client/src/content/exams/formatters.ts');
const root=__dirname,read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
(async()=>{
 let state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());const token=state.editToken;
 async function api(p,b){const r=await fetch('http://127.0.0.1:4319'+p,{method:b?'POST':'GET',headers:{'Content-Type':'application/json','X-Editor-Token':token},...(b?{body:JSON.stringify(b)}:{})});const v=await r.json();if(!r.ok)throw Error(p+' '+v.message);return v}
 const receipts=read('import-receipts.json'),report=[];
 for(const form of ['a','b']){
  state=await api('/api/state');const receipt=receipts[form],source=read(`form-${form}-import.json`),entries=read(`form-${form}-parsed.json`),test=state.tests.find(t=>t.assessmentId===receipt.assessmentId);
  const passages=receipt.passages.map(r=>state.passages.find(p=>p.id===r.id)),math=state.mathSections.find(m=>m.fileName===test.mathSectionFileName),ind=receipt.independent.map(r=>state.standaloneItems.find(q=>q.id===r.id));
  const rawTest=Object.values(require(path.resolve('client/src/content/exams/tests',test.fileName))).find(x=>x?.assessmentId===receipt.assessmentId);
  assert.equal(passages.length,7);assert.equal(math.questions.length,57);assert.equal(ind.length,4);
  const overrides={questions:{},passages:{}};
  const actualSet={};
  for(const p of passages){const mod=require(path.resolve('client/src/content/exams/passageSets',p.fileName));actualSet[p.id]=Object.values(mod).find(x=>x?.passage?.id===p.id);}
  for(let i=0;i<passages.length;i++){
   const p=passages[i],capture=entries.filter(e=>e.kind==='passage')[i].content;
   assert.equal(p.questions.length,capture.questions.length);
   const target=createSourcePassage({...capture,id:p.id});
   overrides.passages[p.id]={baseLines:actualSet[p.id].passage.lines,passage:target};
   for(let j=0;j<p.questions.length;j++){
    const q=p.questions[j],s=capture.questions[j];assert.equal(q.correctChoiceId,s.correctChoiceId,`${form} source ${s.review.sourceQuestion} key`);
    const {review,visuals,...clean}=s;overrides.questions[q.id]={base:actualSet[p.id].questions[j],question:{...q,...clean,id:q.id}};
   }
  }
  // Standalone import retains the editor's stimulus/instructions structure.
  for(let i=0;i<ind.length;i++){
   const q=ind[i],s=source.englishQuestions[i];assert.equal(q.correctChoiceId,s.correctChoiceId);
   overrides.questions[q.id]={base:rawTest.standaloneSection.questions.find(x=>x.id===q.id),question:{...q,explanation:s.explanation,explanationHtml:s.explanationHtml,source:{...source.source,sourceQuestion:s.review.sourceQuestion,pages:s.review.sourcePages}}};
  }
  const capturedMath=entries.find(e=>e.kind==='math').content.questions;
  for(let i=0;i<57;i++){
   const q=math.questions[i],s=capturedMath[i];assert.equal(q.correctChoiceId,s.correctChoiceId);assert.deepEqual(q.correctTextAnswers||[],s.correctTextAnswers||[]);
   overrides.questions[q.id]={base:rawTest.mathSection.questions.find(x=>x.id===q.id),question:{...q,explanation:s.explanation,explanationHtml:s.explanationHtml}};
  }
  const reading=passages.filter(p=>p.section==='reading'),editing=passages.filter(p=>p.section==='revising_editing_a');
  const order=[...reading.flatMap(p=>p.questions.map(q=>q.id)),...editing.flatMap(p=>p.questions.map(q=>q.id)),...ind.map(q=>q.id),...math.questions.map(q=>q.id)];assert.equal(new Set(order).size,114);
  await api('/api/tests',{...test,readingPassageIds:reading.map(p=>p.id),revisingEditingPartAPassageIds:editing.map(p=>p.id),standaloneItemIds:ind.map(q=>q.id),questionOrder:order,source:source.source,presentationOverrides:overrides});
  report.push({form,questions:114,english:57,math:57,passages:7,standalone:4,order:['reading','revising_editing_a','standalone','math'],keysVerified:114,passageSnapshots:7,questionSnapshots:114});console.log(form,'114 saved questions; all supplied keys verified; required order saved');
 }
 // Refresh obsolete notes on existing A records without changing teacher review states.
 const statusFile='tools/.content-drafts/math-import-status.json',status=JSON.parse(fs.readFileSync(statusFile,'utf8')),source=read('form-a-import.json');
 for(const q of source.mathQuestions){const k=JSON.stringify(['2021-2022-form-a',q.id]);if(status[k])status[k]={...status[k],source:`2021-2022 Form A · Question ${q.review.sourceQuestion} · PDF pages ${q.review.sourcePages.join(', ')}`,notes:['Answer and explanation supplied in 20212022_form_a_-_answers.pdf. Source figure and notation retained using the Content Studio import format.','Editable explanation OCR should be checked against the preserved official explanation image.']};}
 fs.writeFileSync(statusFile,JSON.stringify(status,null,2)+'\n');
 require('../../tools/export-exam-content.cjs').exportExamContent();
 state=await api('/api/state');delete state.editToken;fs.writeFileSync(path.join(root,'editor-after.json'),JSON.stringify(state));fs.writeFileSync(path.join(root,'saved-verification.json'),JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
