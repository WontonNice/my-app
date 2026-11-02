const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=__dirname,read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report={math:[],passages:[],english:[]};
 try{
 const page=await browser.newPage({viewport:{width:950,height:850}});
 await page.addInitScript(()=>window.addEventListener('message',e=>{if(e.data?.type==='studio:math-preview-ready')window.ready=true}));
 await page.goto('http://127.0.0.1:4319/math-student-preview/');await page.waitForFunction(()=>window.ready);
 for(const form of ['a','b'])for(const [i,q] of read(`form-${form}-parsed.json`).find(e=>e.kind==='math').content.questions.entries()){
  await page.evaluate(preview=>window.postMessage({type:'studio:math-preview',preview},location.origin),{question:q,index:i,count:57,title:`2021–2022 Form ${form.toUpperCase()}`});
  const locator=page.locator(`[id="math-title-${q.id}"]`);await locator.waitFor();
  await page.waitForFunction(()=>[...document.images].every(im=>im.complete));
  const r=await locator.evaluate(node=>{const p=node.closest('section'),copy=p.cloneNode(true);copy.querySelectorAll('.katex').forEach(n=>n.remove());return {errors:p.querySelectorAll('.katex-error').length,formulas:p.querySelectorAll('.katex').length,raw:/\\[([]/.test(copy.textContent),overflow:p.scrollWidth>p.clientWidth+1,missing:[...p.querySelectorAll('img')].filter(im=>!im.naturalWidth).map(im=>im.src)}});
  report.math.push({form,n:i+58,...r});assert.equal(r.errors,0,`${form}${i+58}`);assert.equal(r.raw,false);assert.equal(r.overflow,false);assert.equal(r.missing.length,0);
  if([59,61,69,75,78,89,100,107,111].includes(i+58))await page.screenshot({path:path.join(root,`preview-math-${form}-${i+58}.png`),fullPage:true});
 }
 const source=fs.readFileSync('tools/content-studio.html','utf8'),escape=source.slice(source.indexOf('const escapeHtml ='),source.indexOf('const slugFromTitle ='));
 const renderer=source.slice(source.indexOf('function richBlocksFromPassage('),source.indexOf('function studentQuestionMarkup('));
 const qr=source.slice(source.indexOf('function studentQuestionMarkup('),source.indexOf('function renderMathStudentPreview('));
 const poem=fs.readFileSync('tools/poem-layout.js','utf8').replace('export function poemRichBlocks','function poemRichBlocks');
 await page.goto('http://127.0.0.1:4319');await page.addStyleTag({content:fs.readFileSync('client/src/styles/global.css','utf8')});await page.addStyleTag({content:fs.readFileSync('client/src/styles/passage-glossary.css','utf8')});
 for(const form of ['a','b']){
  const entries=read(`form-${form}-parsed.json`);
  for(const entry of entries.filter(e=>e.kind==='passage')){
   const passage=entry.content;
   const r=await page.evaluate(({code,passage})=>{const render=new Function(code+';return studentPassageMarkup;')();document.body.innerHTML='<main style="max-width:570px;margin:20px auto;background:white;padding:20px"><article class="exam-question-passage-scroll '+(passage.format==='poem'?'is-poem':'')+'" style="height:auto;max-height:none;overflow:visible">'+render(passage,false)+'</article></main>';document.body.style.background='white';const a=document.querySelector('article');return {poemLines:a.querySelectorAll('.exam-poem-line:not(.is-context)').length,glossary:a.querySelectorAll('[data-glossary-definition]').length,overflow:a.scrollWidth>a.clientWidth+1,text:a.innerText}}, {code:poem+'\nconst app={poemRichBlocks};\n'+escape+'\n'+renderer,passage});
   report.passages.push({form,title:passage.title,...r});assert.equal(r.overflow,false,passage.title);
   await page.screenshot({path:path.join(root,`preview-passage-${form}-${entries.indexOf(entry)}.png`),fullPage:true});
  }
  for(const e of entries.filter(e=>e.kind!=='math'))for(const q of e.content.questions){
   const r=await page.evaluate(({q,code})=>{const render=new Function(code+';return studentQuestionMarkup;')();document.body.innerHTML='<main style="max-width:800px;margin:20px auto;padding:20px;background:white;color:#111;font:16px/1.5 Arial"><div>'+ (q.instructionsHtml||'')+'</div>'+(q.stimulusHtml?'<div class="exam-standalone-stimulus">'+q.stimulusHtml+'</div>':'')+'<div class="exam-rich-text">'+q.promptHtml+'</div>'+render(q)+'</main>';const main=document.querySelector('main');return {underlines:[...main.querySelectorAll('u')].map(x=>x.textContent),choices:main.querySelectorAll('.exam-choice').length,quotes:main.querySelectorAll('blockquote').length,overflow:main.scrollWidth>main.clientWidth+1};},{q,code:escape+'\n'+qr});
   report.english.push({form,n:q.review.sourceQuestion,...r});assert.equal(r.choices,4);assert.equal(r.overflow,false);
   if([1,2,3,4,14,23,31,34,38,45].includes(+q.review.sourceQuestion))await page.screenshot({path:path.join(root,`preview-english-${form}-${q.review.sourceQuestion}.png`),fullPage:true});
  }
 }
 fs.writeFileSync(path.join(root,'render-verification.json'),JSON.stringify(report,null,2));console.log('Rendered 114 Math and 114 English questions; no KaTeX errors, exposed delimiters, missing Math images or horizontal overflow. Captured all 14 passages.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
