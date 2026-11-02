const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 await page.goto('https://nycshsat.myassessmentsupport.com/practice-tests/',{waitUntil:'domcontentloaded'});
 const links=await page.locator('a').evaluateAll(nodes=>nodes.filter(n=>n.textContent.trim()==='ELA First').map(n=>({href:n.href,section:n.parentElement.parentElement.textContent.trim().slice(0,180)})));
 fs.writeFileSync('artifacts/testnav-c-q5/practice-links.json',JSON.stringify(links,null,2));
 const link=links.find(n=>n.section.includes('Practice Test C without Timer'));
 if(!link)throw Error('Test C link not found');
 await page.goto(link.href,{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(5000);
 await page.getByText('Start »',{exact:true}).click();
 await page.waitForTimeout(1500);
 for(let i=0;i<65;i++) {
   const body=await page.locator('body').innerText();
   if(body.includes('Which two sentences in paragraphs 5–9')) break;
   let acted=false;
   for(const label of ['Start','Continue','Next']) {
     const button=page.getByLabel(label,{exact:true});
     if(await button.isVisible() && await button.isEnabled()) {try {await button.click({timeout:1500});acted=true;} catch {} break;}
   }
   if(!acted)break;
   await page.waitForTimeout(350);
 }
 // Inspect the supplied official item in the loaded TestNav stylesheet, without
 // answering/submitting preceding practice items or changing the user's session.
 const source=JSON.parse(fs.readFileSync('artifacts/testnav-c-q5/source.json','utf8'));
 if(await page.getByLabel('OK',{exact:true}).isVisible()) await page.getByLabel('OK',{exact:true}).click();
 await page.locator('#itemCanvasBody').evaluate((el,html)=>{el.innerHTML=html;},source.itemBodyHtml);
 await page.addScriptTag({content:fs.readFileSync('artifacts/testnav-c-q5/texthighlighter.js','utf8')});
 await page.evaluate(()=>{
   const ids=[...document.querySelectorAll('#interaction_RESPONSE [data-identifier]')].map(el=>el.getAttribute('data-identifier'));
   window.referenceInteraction=TextHighlighterAPI.createTextHighlighter({contentDiv:'interaction_RESPONSE',maxChoices:2,minChoices:2,selectable:ids});
   window.referenceInteraction.initialize();
   document.querySelector('.passage-scrolling').classList.add('scrollbar-new');
 });
 const measurements=await page.locator('.passage-scrolling').evaluate(el=>{
   const styles=getComputedStyle(el),inner=el.querySelector('#interaction_RESPONSE');
   return {width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,padding:styles.padding,font:getComputedStyle(inner).font,innerWidth:inner.getBoundingClientRect().width,paragraph:getComputedStyle(inner.querySelector('p')).font};
 });
 console.log(JSON.stringify(measurements));
 fs.writeFileSync('artifacts/testnav-c-q5/reference-measurements.json',JSON.stringify(measurements,null,2));
 await page.screenshot({path:'artifacts/testnav-c-q5/reference-source-render.png'});
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
