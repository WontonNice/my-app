const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const report=[];
 try{
  const page=await browser.newPage({viewport:{width:950,height:750},deviceScaleFactor:1});
  await page.addInitScript(()=>window.addEventListener('message',e=>{if(e.data?.type==='studio:math-preview-ready')window.mathPreviewReady=true}));
  await page.goto('http://127.0.0.1:4319/math-student-preview/');
  await page.waitForFunction(()=>window.mathPreviewReady,{timeout:30000});
  for(const form of ['a','b']){
   const test=state.tests.find(t=>t.assessmentId===`2023-2024-form-${form}`),section=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
   for(const [index,question] of section.questions.entries()){
    await page.evaluate(preview=>window.postMessage({type:'studio:math-preview',preview},location.origin),{question,index,count:57,title:test.title});
    await page.waitForSelector(`[id="math-title-${question.id}"]`);
    const result=await page.locator(`[id="math-title-${question.id}"]`).evaluate(root=>{
     const panel=root.closest('section');
     return {errors:panel.querySelectorAll('.katex-error').length,formulas:panel.querySelectorAll('.katex').length,rawDelimiters:panel.innerText.includes('\\('),overflow:panel.scrollWidth>panel.clientWidth+1};
    });
    report.push({form,sourceQuestion:question.source.sourceQuestion,...result});
    assert.equal(result.errors,0,`${form} ${question.source.sourceQuestion}: KaTeX errors`);
    assert.equal(result.rawDelimiters,false,`${form} ${question.source.sourceQuestion}: raw math`);
    if((form==='a'&&['64','67','91'].includes(question.source.sourceQuestion))||(form==='b'&&['64','88','112'].includes(question.source.sourceQuestion)))await page.screenshot({path:path.join(__dirname,`numbers-${form}-${question.source.sourceQuestion}.png`),fullPage:true});
   }
  }
  fs.writeFileSync(path.join(__dirname,'numeric-render-verification.json'),JSON.stringify(report,null,2));
  console.log('All 114 Math questions rendered without KaTeX errors or raw delimiters; representative screenshots saved.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
