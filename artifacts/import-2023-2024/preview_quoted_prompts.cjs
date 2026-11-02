const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const audit=JSON.parse(fs.readFileSync(path.join(__dirname,'quoted-prompts-audit-results.json'),'utf8'));
 const source=fs.readFileSync('tools/content-studio.html','utf8');
 const escape=source.slice(source.indexOf('const escapeHtml ='),source.indexOf('const slugFromTitle ='));
 const renderer=source.slice(source.indexOf('function studentQuestionMarkup('),source.indexOf('function renderMathStudentPreview('));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:616,height:600},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4319');
  await page.addStyleTag({content:fs.readFileSync('client/src/styles/global.css','utf8')});
  for(const item of audit){
   const question=state.passages.find(p=>p.id===item.passageId).questions.find(q=>q.id===item.questionId);
   const result=await page.evaluate(({question,code})=>{
    const render=new Function(code+';return studentQuestionMarkup;')();
    document.body.innerHTML='<main style="margin:10px 18px;padding:18px 10px;background:white;color:#111;font:16px/1.5 Arial,sans-serif"><div class="exam-rich-text">'+question.promptHtml+'</div>'+render(question)+'</main>';
    document.body.style.background='white';
    const block=document.querySelector('blockquote');
    return {quote:block?.innerText||'',choices:document.querySelectorAll('.exam-choice').length,outsideParagraphs:[...document.querySelector('.exam-rich-text').children].filter(n=>n.tagName==='P').length};
   },{question,code:escape+'\n'+renderer});
   assert.equal(result.quote.replace(/\s+/g,' ').trim(),item.newExcerpt.replace(/\s+/g,' ').trim(),item.questionId);
   assert.equal(result.quote.split(/\n\s*\n/).length,item.newExcerpt.split(/\n\s*\n/).length,item.questionId+' quote groups');
   assert.equal(result.choices,4);
   assert.equal(result.outsideParagraphs,2,item.questionId+' intro and follow-up only');
   if(item.changed)await page.screenshot({path:path.join(__dirname,`quoted-${item.form}-${item.sourceQuestion}-fixed.png`),fullPage:true});
  }
  console.log('Browser verification passed for all 26 source excerpts: complete quotations, correct group spacing, separate follow-ups and four choices.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
