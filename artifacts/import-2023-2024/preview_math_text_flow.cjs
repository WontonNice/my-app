const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const repairs=JSON.parse(fs.readFileSync(path.join(__dirname,'math-text-flow-repairs.json'),'utf8'));
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:674,height:620},deviceScaleFactor:1});
  await page.addInitScript(()=>window.addEventListener('message',e=>{if(e.data?.type==='studio:math-preview-ready')window.mathPreviewReady=true}));
  await page.goto('http://127.0.0.1:4319/math-student-preview/');
  await page.waitForFunction(()=>window.mathPreviewReady,{timeout:30000});
  for(const repair of repairs){
   const test=state.tests.find(t=>t.assessmentId===`2023-2024-form-${repair.form}`);
   const section=state.mathSections.find(s=>s.fileName===test.mathSectionFileName);
   const index=section.questions.findIndex(q=>q.id===repair.questionId),question=section.questions[index];
   await page.evaluate(preview=>window.postMessage({type:'studio:math-preview',preview},location.origin),{question,index,count:57,title:test.title});
   await page.waitForSelector(`[id="math-title-${question.id}"]`);
   const result=await page.locator(`[id="math-title-${question.id}"]`).evaluate(root=>({
    textParagraphs:[...root.querySelectorAll('p')].filter(p=>!p.querySelector('img')).length,
    errors:root.querySelectorAll('.katex-error').length,
    overflowing:[...root.querySelectorAll('.katex')].some(k=>k.getBoundingClientRect().right>innerWidth),
   }));
   assert.equal(result.textParagraphs,1,question.id+' continuous prompt');
   assert.equal(result.errors,0,question.id+' formula rendering');
   assert.equal(result.overflowing,false,question.id+' inline fractions');
   if(repair.form==='a'&&repair.sourceQuestion==='64')await page.screenshot({path:path.join(__dirname,'math-7-text-flow-fixed.png'),fullPage:true});
  }
  console.log('Actual React Math player verified all 23 corrected prompts: natural text flow, inline fractions, no KaTeX errors or horizontal overflow.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
