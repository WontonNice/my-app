const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const source=fs.readFileSync('tools/content-studio.html','utf8');
 const escape=source.slice(source.indexOf('const escapeHtml ='),source.indexOf('const slugFromTitle ='));
 const renderer=source.slice(source.indexOf('function richBlocksFromPassage('),source.indexOf('function studentQuestionMarkup('));
 const poem=fs.readFileSync('tools/poem-layout.js','utf8').replace('export function poemRichBlocks','function poemRichBlocks');
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());
 const passage=state.passages.find(p=>p.id==='letter-from-brooklyn-2023-2024-form-a');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:616,height:1010},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4319');
  await page.addStyleTag({content:fs.readFileSync('client/src/styles/global.css','utf8')});
  await page.addStyleTag({content:fs.readFileSync('client/src/styles/passage-glossary.css','utf8')});
  for(const authoring of [false,true]){
   const report=await page.evaluate(({code,passage,authoring})=>{
    const render=new Function(code+';return studentPassageMarkup;')();
    document.body.innerHTML='<main style="max-width:570px;margin:24px auto;background:white;padding:20px;border:1px solid #ddd"><article class="exam-question-passage-scroll is-poem" style="height:auto;max-height:none;overflow:visible">'+render(passage,authoring)+'</article></main>';
    document.body.style.background='white';document.body.style.margin='0';
    const rows=[...document.querySelectorAll('p.exam-poem-line')].filter(row=>row.children.length===2&&row.children[1].textContent.trim());
    return rows.map(row=>({number:row.children[0].textContent,text:row.children[1].textContent,context:row.classList.contains('is-context'),nested:!!row.children[1].querySelector('div,p'),x:row.children[1].getBoundingClientRect().x}));
   },{code:poem+'\nconst app={poemRichBlocks};\n'+escape+'\n'+renderer,passage,authoring});
   assert.deepEqual(report.map(r=>r.text),passage.text.split('\n'));
   assert.equal(report.every(r=>!r.context&&!r.nested),true);
   if(!authoring)await page.screenshot({path:path.join(__dirname,'brooklyn-fixed-preview.png'),fullPage:true});
   assert.equal(new Set(report.map(r=>r.x)).size,1,'All verse lines must start at the same left edge');
   assert.deepEqual(report.filter(r=>r.number).map(r=>r.number),['5','10','15','20','25']);
   if(!authoring)await page.screenshot({path:path.join(__dirname,'brooklyn-fixed-preview.png'),fullPage:true});
   console.log(authoring?'Editor canvas':'Student preview',': 26 aligned verse lines; correct 5/10/15/20/25 labels.');
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
