const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const question=state.passages.find(p=>p.id==='letter-from-brooklyn-2023-2024-form-a').questions[6];
 const source=fs.readFileSync('tools/content-studio.html','utf8');
 const escape=source.slice(source.indexOf('const escapeHtml ='),source.indexOf('const slugFromTitle ='));
 const render=source.slice(source.indexOf('function studentQuestionMarkup('),source.indexOf('function renderMathStudentPreview('));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:616,height:610},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4319');
  await page.addStyleTag({content:fs.readFileSync('client/src/styles/global.css','utf8')});
  const result=await page.evaluate(({question,code})=>{
   const renderer=new Function(code+';return studentQuestionMarkup;')();
   document.body.innerHTML='<main style="margin:10px 18px;padding:18px 10px;background:white;color:#111;font:16px/1.5 Arial,sans-serif"><div class="exam-rich-text">'+question.promptHtml+'</div>'+renderer(question)+'</main>';
   document.body.style.background='white';
   const block=document.querySelector('blockquote');
   const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
   const positions=['I can already','How Brooklyn','for the moment'].map(prefix=>{
    const node=nodes.find(n=>n.textContent.startsWith(prefix)),range=document.createRange();range.setStart(node,0);range.setEnd(node,1);const rect=range.getBoundingClientRect();return {x:rect.x,y:rect.y};
   });
   return {blocks:document.querySelectorAll('blockquote').length,excerpt:block.innerText,positions,choices:document.querySelectorAll('.exam-choice').length,followUp:document.querySelector('blockquote + p').textContent};
  },{question,code:escape+'\n'+render});
  assert.equal(result.blocks,1);assert.equal(result.choices,4);
  assert.match(result.excerpt,/I can already see how this will end\. \(line 1\)\n\nHow Brooklyn makes me nostalgic\nfor the moment I am walking inside of\. \(lines 21–22\)/);
  assert.equal(new Set(result.positions.map(p=>p.x)).size,1);
  assert(result.positions[1].y-result.positions[0].y>1.5*(result.positions[2].y-result.positions[1].y));
  assert.equal(result.followUp,'The lines develop a central idea of the poem by');
  await page.screenshot({path:path.join(__dirname,'brooklyn-question-7-fixed.png'),fullPage:true});
  console.log('Rendered question 7: all three excerpt lines share one indentation; source gap, bold verse, regular line references, follow-up and four choices verified.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
