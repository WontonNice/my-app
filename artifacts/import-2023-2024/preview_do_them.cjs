const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const passage=state.passages.find(p=>p.id==='excerpt-from-do-them-no-harm-2023-2024-form-a');
 const source=fs.readFileSync('tools/content-studio.html','utf8');
 const escape=source.slice(source.indexOf('const escapeHtml ='),source.indexOf('const slugFromTitle ='));
 const renderer=source.slice(source.indexOf('function richBlocksFromPassage('),source.indexOf('function studentQuestionMarkup('));
 const poem=fs.readFileSync('tools/poem-layout.js','utf8').replace('export function poemRichBlocks','function poemRichBlocks');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:616,height:680},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4319');
  await page.addStyleTag({content:fs.readFileSync('client/src/styles/global.css','utf8')+'\n'+fs.readFileSync('client/src/styles/passage-glossary.css','utf8')});
  for(const authoring of [false,true]){
   const result=await page.evaluate(({code,passage,authoring})=>{
    const render=new Function(code+';return studentPassageMarkup;')();
    document.body.innerHTML='<main style="margin:18px;padding:20px;max-width:550px;background:white;color:#111;border:1px solid #aaa;font:16px/1.5 Arial,sans-serif"><article class="exam-question-passage-scroll" style="height:580px;overflow:auto">'+render(passage,authoring)+'</article></main>';
    document.body.style.background='white';
    const numbered=[...document.querySelectorAll('.exam-prose-line')].filter(p=>p.querySelector('.exam-paragraph-number'));
    return {numbers:numbered.map(p=>p.querySelector('.exam-paragraph-number').textContent),bodies:numbered.map(p=>p.lastElementChild.textContent),glossary:document.querySelectorAll('[data-glossary-definition]').length};
   },{code:poem+'\nconst app={poemRichBlocks};\n'+escape+'\n'+renderer,passage,authoring});
   assert.deepEqual(result.numbers,Array.from({length:26},(_,i)=>String(i+1)));
   assert.match(result.bodies[0],/^In the moon.*little streams and huckleberries/);
   assert.equal(result.bodies.every(t=>!/^\d+\s/.test(t)),true);
   assert.equal(result.glossary,1);
   if(!authoring)await page.screenshot({path:path.join(__dirname,'do-them-fixed-preview.png'),fullPage:true});
   console.log(authoring?'Editor canvas':'Student preview',': 26 complete paragraphs, no duplicate numbers, source glossary preserved.');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
