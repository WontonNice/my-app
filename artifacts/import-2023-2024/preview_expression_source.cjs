const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report=[];
 try{
  const page=await browser.newPage({viewport:{width:950,height:750},deviceScaleFactor:1});
  await page.addInitScript(()=>window.addEventListener('message',e=>{if(e.data?.type==='studio:math-preview-ready')window.mathPreviewReady=true}));
  await page.goto('http://127.0.0.1:4319/math-student-preview/');await page.waitForFunction(()=>window.mathPreviewReady,{timeout:30000});
  for(const form of ['a','b']){
   const test=state.tests.find(t=>t.assessmentId===`2023-2024-form-${form}`),section=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
   for(const [index,question] of section.questions.entries()){
    await page.evaluate(preview=>window.postMessage({type:'studio:math-preview',preview},location.origin),{question,index,count:57,title:test.title});
    const root=page.locator(`[id="math-title-${question.id}"]`);await root.waitFor();
    const result=await root.evaluate(root=>{
     const panel=root.closest('section'),text=panel.cloneNode(true);text.querySelectorAll('.katex').forEach(node=>node.remove());
     return {errors:panel.querySelectorAll('.katex-error').length,formulas:panel.querySelectorAll('.katex').length,rawDelimiters:/\\[([]/.test(text.textContent),unformattedItalics:panel.querySelectorAll('em,i').length,overflow:panel.scrollWidth>panel.clientWidth+1,expressions:Array.from(root.querySelectorAll('annotation[encoding="application/x-tex"]'),node=>node.textContent)};
    });
    report.push({form,sourceQuestion:question.source.sourceQuestion,...result});
    assert.equal(result.errors,0);assert.equal(result.rawDelimiters,false);assert.equal(result.unformattedItalics,0,`${form}${question.source.sourceQuestion}: raw italic variables`);
    if(form==='a'&&question.source.sourceQuestion==='60')assert.deepEqual(result.expressions,['x','7x + 3 - 2(2x + 1) = 13']);
    if((form==='a'&&['60','69','79','91','95','97','101'].includes(question.source.sourceQuestion))||(form==='b'&&['65','74','78','88','94','95'].includes(question.source.sourceQuestion)))await page.screenshot({path:path.join(__dirname,`expression-${form}-${question.source.sourceQuestion}.png`),fullPage:true});
   }
  }
  fs.writeFileSync(path.join(__dirname,'expression-render-verification.json'),JSON.stringify(report,null,2));
  console.log('All 114 Math questions rendered: no KaTeX errors, exposed delimiters or raw italic variables. Reported equation uses a single complete expression.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
