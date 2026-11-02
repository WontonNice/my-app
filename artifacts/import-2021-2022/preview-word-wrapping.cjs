const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json()),section=state.mathSections.find(m=>m.fileName==='2021-2022-form-aMath.ts');
 const question=section.questions.find(q=>q.id==='2021-2022-form-a-q105');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report=[];
 try{
  const page=await browser.newPage({viewport:{width:828,height:650}});
  await page.addInitScript(()=>window.addEventListener('message',e=>{if(e.data?.type==='studio:math-preview-ready')window.ready=true}));
  await page.goto('http://127.0.0.1:4319/math-student-preview/');await page.waitForFunction(()=>window.ready);
  const samples=[question,{...question,id:'wrapping-rich',promptHtml:'<p>The \\(391\\)st item is a \\(5\\)-digit number. Solve (\\(x\\))? Then use \\(12\\) more items. This sentence can still wrap normally.</p>'},{...question,id:'wrapping-plain',promptHtml:undefined,prompt:'The \\(391\\)st item is a \\(5\\)-digit number. Solve (\\(x\\))? Then use \\(12\\) more items. This sentence can still wrap normally.'}];
  for(const width of [360,500,700,828,1200]){
   await page.setViewportSize({width,height:650});
   for(const q of samples){
    await page.evaluate(preview=>window.postMessage({type:'studio:math-preview',preview},location.origin),{question:q,index:47,count:57,title:'2021–2022 Form A'});
    const root=page.locator(`[id="math-title-${q.id}"]`);await root.waitFor();
    const result=await root.evaluate(root=>({errors:root.querySelectorAll('.katex-error').length,overflow:root.scrollWidth>root.clientWidth+1,words:[...root.querySelectorAll('.exam-math-word')].map(word=>{const r=document.createRange();r.selectNodeContents(word);const visible=word.cloneNode(true);visible.querySelectorAll('.katex-mathml').forEach(n=>n.remove());const boxes=[...r.getClientRects()].filter(b=>b.width>0&&b.height>0);const math=word.querySelector('.katex-html')?.getBoundingClientRect();return {text:visible.textContent,nowrap:getComputedStyle(word).whiteSpace==='nowrap',height:word.getBoundingClientRect().height,mathHeight:math?.height,spread:Math.max(...boxes.map(b=>b.bottom))-Math.min(...boxes.map(b=>b.top))};})}));
    assert.equal(result.errors,0);assert.equal(result.overflow,false);assert(result.words.some(w=>w.text==='391st'));
    for(const w of result.words){assert(w.nowrap);assert(w.spread<40,`${width} ${w.text} split onto another line`);}
    report.push({width,id:q.id,...result});
    if(width===828&&q.id===question.id)await page.screenshot({path:path.join(__dirname,'word-wrapping-q48.png'),fullPage:true});
   }
  }
  fs.writeFileSync(path.join(__dirname,'word-wrapping-verification.json'),JSON.stringify(report,null,2));console.log('Passed 15 browser cases: rich/plain text and Q48 at five viewport widths; words intact, no horizontal overflow or KaTeX errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
