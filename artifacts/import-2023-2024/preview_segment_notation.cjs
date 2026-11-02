const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const repairs=JSON.parse(fs.readFileSync(path.join(__dirname,'segment-notation-repairs.json'),'utf8'));
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:825,height:600},deviceScaleFactor:1});
  await page.addInitScript(()=>window.addEventListener('message',e=>{if(e.data?.type==='studio:math-preview-ready')window.mathPreviewReady=true}));
  await page.goto('http://127.0.0.1:4319/math-student-preview/');
  await page.waitForFunction(()=>window.mathPreviewReady,{timeout:30000});
  for(const repair of repairs){
   const test=state.tests.find(t=>t.assessmentId===`2023-2024-form-${repair.form}`),section=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
   const index=section.questions.findIndex(q=>q.id===repair.questionId),question=section.questions[index];
   await page.evaluate(preview=>window.postMessage({type:'studio:math-preview',preview},location.origin),{question,index,count:57,title:test.title});
   await page.waitForSelector(`[id="math-title-${question.id}"]`);
   const result=await page.locator(`[id="math-title-${question.id}"]`).evaluate(root=>{
    const prose=root.cloneNode(true);prose.querySelectorAll('.katex').forEach(node=>node.remove());
    return {bars:root.querySelectorAll('.katex-html .overline-line').length,errors:root.querySelectorAll('.katex-error').length,text:prose.textContent,html:root.innerHTML};
   });
   fs.writeFileSync(path.join(__dirname,`segment-${repair.form}-rendered.html`),result.html);
   await page.screenshot({path:path.join(__dirname,`segment-${repair.form}-fixed.png`),fullPage:true});
   assert.equal(result.bars,2);assert.equal(result.errors,0);assert(!result.text.includes('‾'));
   await page.screenshot({path:path.join(__dirname,`segment-${repair.form}-fixed.png`),fullPage:true});
  }
  console.log('Both questions verified in the shared React/KaTeX player: two proper overbars each, no detached macrons or rendering errors.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
