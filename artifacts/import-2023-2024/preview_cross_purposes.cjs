const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const source=fs.readFileSync('tools/content-studio.html','utf8');
 const escape=source.slice(source.indexOf('const escapeHtml ='),source.indexOf('const slugFromTitle ='));
 const renderer=source.slice(source.indexOf('function richBlocksFromPassage('),source.indexOf('function studentQuestionMarkup('));
 const poem=fs.readFileSync('tools/poem-layout.js','utf8').replace('export function poemRichBlocks','function poemRichBlocks');
 const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json()),passage=state.passages.find(p=>p.id==='cross-purposes-2023-2024-form-b');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),reports=[];
 try{
  const page=await browser.newPage({viewport:{width:800,height:1400},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4319');
  await page.addStyleTag({content:fs.readFileSync('client/src/styles/global.css','utf8')});
  await page.addStyleTag({content:fs.readFileSync('client/src/styles/passage-glossary.css','utf8')});
  for(const authoring of [false,true]){
   const report=await page.evaluate(({code,passage,authoring})=>{
    const render=new Function(code+';return studentPassageMarkup;')();
    document.body.innerHTML='<main class="exam-session-shell" data-player-profile="testnav" style="margin:20px;background:white;padding:20px;border:1px solid #ddd;display:block;height:auto"><article class="exam-question-passage-scroll is-poem" style="height:auto;max-height:none;overflow:visible">'+render(passage,authoring)+'</article></main>';
    document.body.style.background='white';document.body.style.margin='0';
    const all=[...document.querySelectorAll('p.exam-poem-line')],rows=all.filter(row=>row.children.length===2&&row.children[1].textContent.trim());
    return {rows:rows.map(row=>{
     const span=row.children[1],range=document.createRange(),walker=document.createTreeWalker(span,NodeFilter.SHOW_TEXT);let node;
     while(node=walker.nextNode()){const offset=node.textContent.search(/\S/);if(offset>=0){range.setStart(node,offset);range.setEnd(node,offset+1);break;}}
     const rect=range.getBoundingClientRect();
     return {number:row.children[0].textContent,text:span.textContent,context:row.classList.contains('is-context'),nested:!!span.querySelector('div,p'),indented:/^\s{18}\S/.test(span.textContent),x:rect.x,height:row.getBoundingClientRect().height,numberX:row.children[0].getBoundingClientRect().right,em:Array.from(span.querySelectorAll('em')).map(el=>el.textContent)};
    }),spacers:all.filter(row=>row.classList.contains('is-spacer')).length,glossary:document.querySelectorAll('[data-glossary-definition="large birds"]').length};
   },{code:poem+'\nconst app={poemRichBlocks};\n'+escape+'\n'+renderer,passage,authoring});
   assert.equal(report.rows.length,42);assert.equal(report.spacers,6,'header spacer plus five stanza breaks');
   assert.equal(report.rows.every(r=>!r.context&&!r.nested),true);assert.equal(report.glossary,1);
   assert.deepEqual(report.rows.map(r=>r.text.trimStart()),passage.text.split('\n').filter(line=>line.trim()).map(line=>line.trimStart()));
   assert.deepEqual(report.rows.filter(r=>r.number).map(r=>r.number),['5','10','15','20','25','30','35','40']);
   for(const [i,row] of report.rows.entries())assert.equal(row.indented,Math.floor(i/7)%2===1);
   assert.equal(new Set(report.rows.map(r=>r.numberX)).size,1,'all line numbers share one gutter');
   assert.equal(new Set(report.rows.map(r=>r.height)).size,1,'no source verse wraps onto an extra row');
   assert.equal(report.rows[7].x-report.rows[0].x>70,true,'second speaker retains the source offset');
   reports.push({authoring,...report});
   if(!authoring)await page.screenshot({path:path.join(__dirname,'cross-purposes-fixed-preview.png'),fullPage:true});
   console.log(authoring?'Editor canvas':'Student preview',JSON.stringify({lines:report.rows.length,spacers:report.spacers,leftStarts:[...new Set(report.rows.filter(r=>!r.indented).map(r=>r.x))],indentedStarts:[...new Set(report.rows.filter(r=>r.indented).map(r=>r.x))]}));
  }
  fs.writeFileSync(path.join(__dirname,'cross-purposes-render-verification.json'),JSON.stringify(reports,null,2));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
