const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const sources=JSON.parse(fs.readFileSync(path.join(__dirname,'standalone-source-underlines.json'),'utf8'));
 const receipts=JSON.parse(fs.readFileSync(path.join(__dirname,'import-receipts.json'),'utf8'));
 const html=fs.readFileSync('tools/content-studio.html','utf8');
 const escape=html.slice(html.indexOf('const escapeHtml ='),html.indexOf('const slugFromTitle ='));
 const render=html.slice(html.indexOf('function studentQuestionMarkup('),html.indexOf('function renderMathStudentPreview('));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:900,height:720},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4319');
  await page.addStyleTag({content:fs.readFileSync('client/src/styles/global.css','utf8')});
  for(const source of sources){
   const id=receipts[source.form].independent.find(q=>q.sourceQuestion===source.sourceQuestion).id;
   const question=state.standaloneItems.find(q=>q.id===id);
   for(const authoring of [false,true]){
    const result=await page.evaluate(({question,code,authoring})=>{
     const renderer=new Function(code+';return studentQuestionMarkup;')();
     const stimulus=authoring?'<div class="rich-editor-content" contenteditable="true">'+question.stimulusHtml+'</div>':'<div class="exam-standalone-stimulus">'+question.stimulusHtml+'</div>';
     document.body.innerHTML='<main style="margin:24px auto;padding:24px;max-width:800px;background:white;color:#111;font:16px/1.5 Arial,sans-serif"><div class="exam-rich-text">'+question.promptHtml+'</div>'+stimulus+(authoring?'':renderer(question,true))+'</main>';
     document.body.style.background='white';
     const root=document.querySelector(authoring?'.rich-editor-content':'.exam-standalone-stimulus');
     return {text:root.textContent,underlines:[...root.querySelectorAll('u')].map(u=>({text:u.textContent,decoration:getComputedStyle(u).textDecorationLine}))};
    },{question,code:escape+'\n'+render,authoring});
    assert.equal(result.text.replace(/\s+/g,' ').trim(),source.stimulus.replace(/\s+/g,' ').trim());
    assert.deepEqual(result.underlines.map(u=>u.text),source.underlines);
    assert(result.underlines.every(u=>u.decoration.includes('underline')));
    if(!authoring&&source.underlines.length)await page.screenshot({path:path.join(__dirname,`standalone-${source.form}-${source.sourceQuestion}-underlines-fixed.png`),fullPage:true});
   }
  }
  console.log('Browser verified all 7 items in editor and student layouts: all 28 exact source spans visibly underlined; items without printed underlines remain unmarked.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
