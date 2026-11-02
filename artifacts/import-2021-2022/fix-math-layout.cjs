const fs=require('fs'),path=require('path'),assert=require('assert/strict'),ts=require('typescript');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const ids=[68,84,100,103,105,113].map(n=>'2021-2022-form-a-q'+n),root=__dirname;
function fix(q){
 if(!ids.includes(q.id))return q;
 let html=q.promptHtml;
 if([68,84,103,113].some(n=>q.id.endsWith('-q'+n)))html=html.replace(/^<p>([^<]+)<\/p><table>/,'<table><caption data-align="center">$1</caption>');
 else html=html.replace(/^<p>\\\[([\s\S]*?)\\\]<\/p>/,(_,tex)=>'<p data-align="center">\\(\\displaystyle '+tex+'\\)</p>');
 html=html.replace(/^<div data-align="center">([\s\S]*?)<\/div>/, '<p data-align="center">$1</p>');
 return {...q,promptHtml:html};
}
(async()=>{
 let state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());const token=state.editToken;
 const api=async(p,b)=>{const r=await fetch('http://127.0.0.1:4319'+p,{method:b?'POST':'GET',headers:{'Content-Type':'application/json','X-Editor-Token':token},...(b?{body:JSON.stringify(b)}:{})});const d=await r.json();if(!r.ok)throw Error(d.message);return d;};
 const section=state.mathSections.find(m=>m.fileName==='2021-2022-form-aMath.ts');
 fs.writeFileSync(path.join(root,'math-layout-before.json'),JSON.stringify({section,test:state.tests.find(t=>t.assessmentId==='2021-2022-form-a')},null,2));
 const questions=section.questions.map(fix),report=[];
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1200,height:800}});
 await page.addInitScript(()=>window.addEventListener('message',e=>{if(e.data?.type==='studio:math-preview-ready')window.ready=true}));
 await page.goto('http://127.0.0.1:4319/math-student-preview/');await page.waitForFunction(()=>window.ready);
 for(const width of [1200,700]){
  await page.setViewportSize({width,height:800});
  for(const q of questions.filter(q=>ids.includes(q.id))){
   const index=questions.indexOf(q);await page.evaluate(preview=>window.postMessage({type:'studio:math-preview',preview},location.origin),{question:q,index,count:57,title:'2021–2022 Form A'});
   const locator=page.locator(`[id="math-title-${q.id}"]`);await locator.waitFor();
   const result=await locator.evaluate(root=>{const t=root.querySelector('table'),c=root.querySelector('caption'),tr=t?.getBoundingClientRect(),cr=c?.getBoundingClientRect();return {errors:root.querySelectorAll('.katex-error').length,captionCentered:c?getComputedStyle(c).textAlign==='center'&&Math.abs((tr.left+tr.right-cr.left-cr.right)/2)<1:null,scrollbars:[...root.querySelectorAll('*')].filter(n=>{const s=getComputedStyle(n);return /(auto|scroll)/.test(s.overflowY)&&n.scrollHeight>n.clientHeight+1||/(auto|scroll)/.test(s.overflowX)&&n.scrollWidth>n.clientWidth+1}).map(n=>n.className),formula:root.querySelector('annotation')?.textContent};});
   assert.equal(result.errors,0);assert.equal(result.scrollbars.length,0,q.id);if(result.captionCentered!==null)assert(result.captionCentered,q.id);
   report.push({question:index+1,width,...result});if(width===1200)await page.screenshot({path:path.join(root,`math-layout-q${index+1}.png`),fullPage:true});
  }
 }
 }finally{await browser.close();}
 await api('/api/math',{...section,assessmentId:'2021-2022-form-a',questions});
 state=await api('/api/state');const test=state.tests.find(t=>t.assessmentId==='2021-2022-form-a');
 require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
 const raw=Object.values(require('../../client/src/content/exams/mathSets/2021-2022-form-aMath.ts')).find(x=>x?.questions);
 for(const id of ids){const o=test.presentationOverrides?.questions?.[id];if(o){o.base=raw.questions.find(q=>q.id===id);o.question=fix(o.question);}}
 await api('/api/tests',test);
 for(const name of ['form-a-import.json','form-a-math.json','math-a-working.json','form-a-parsed.json']){
  const p=path.join(root,name),data=JSON.parse(fs.readFileSync(p,'utf8'));
  if(name==='form-a-parsed.json')data.find(e=>e.kind==='math').content.questions=data.find(e=>e.kind==='math').content.questions.map(fix);
  else if(Array.isArray(data)){for(let i=0;i<data.length;i++)data[i]=fix(data[i]);}
  else data.mathQuestions=data.mathQuestions.map(fix);
  fs.writeFileSync(p,JSON.stringify(data,null,2));
 }
 require('../../tools/export-exam-content.cjs').exportExamContent();
 const saved=JSON.parse(fs.readFileSync('server/data/exam-content.json','utf8'))['2021-2022-form-a'];
 for(const id of ids)assert.equal(saved.mathSection.questions.find(q=>q.id===id).promptHtml,questions.find(q=>q.id===id).promptHtml);
 fs.writeFileSync(path.join(root,'math-layout-verification.json'),JSON.stringify(report,null,2));
 console.log('Saved six corrections; centered captions and no nested scrollbars at 1200px and 700px; exported content verified.');
})().catch(e=>{console.error(e);process.exitCode=1});
