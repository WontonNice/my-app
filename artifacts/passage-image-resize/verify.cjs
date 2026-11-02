const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const base='http://127.0.0.1:4320',id='letter-from-brooklyn-2023-2024-form-a';
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof app!=='undefined'&&app.state);
  await page.evaluate(id=>{selectPassage(id);studioUI.showSupportPanel('media');},id);
  const bytes=fs.readFileSync('client/public/exam-images/pdf-2023-2024-a-q061-figure-1.png').toString('base64');
  await page.evaluate(bytes=>{studioImages.clipboard=async()=>new File([Uint8Array.from(atob(bytes),c=>c.charCodeAt(0))],'resize-test.png',{type:'image/png'});},bytes);
  const upload=page.waitForResponse(r=>r.url().endsWith('/api/images')&&r.request().method()==='POST');
  await page.locator('#paste-passage-image').click();assert.equal((await upload).status(),201);
  await page.waitForFunction(()=>!!app.passageDraft.image);
  await page.evaluate(()=>studioUI.showSupportPanel('media'));
  const number=page.getByRole('spinbutton',{name:'Passage image width'});
  await number.fill('180');assert.equal(await page.evaluate(()=>app.passageDraft.image.width),180);
  await page.waitForFunction(()=>document.querySelector('#studio-exam-canvas')?.contentDocument?.querySelector('.exam-passage-image img')?.getAttribute('width')==='180');
  const preview=await page.evaluate(()=>{
   const image=document.querySelector('#studio-exam-canvas').contentDocument.querySelector('.exam-passage-image img');
   const thumbnail=document.querySelector('.image-editor-preview.is-passage-image');
   return {width:image.getBoundingClientRect().width,border:getComputedStyle(image).borderWidth,previewBorder:getComputedStyle(thumbnail).borderWidth};
  });
  assert.equal(preview.width,180);assert.equal(preview.border,'0px');assert.equal(preview.previewBorder,'0px');
  await page.getByRole('slider',{name:'Resize passage image'}).evaluate(input=>{input.value='300';input.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await number.inputValue(),'300');assert.equal(await page.evaluate(()=>app.passageDraft.image.width),300);
  await page.getByRole('button',{name:'Original size',exact:true}).click();
  assert.equal(await number.inputValue(),'');assert.equal(await page.evaluate(()=>app.passageDraft.image.width),undefined);
  await number.fill('240');
  const save=page.waitForResponse(r=>r.url().endsWith('/api/passages')&&r.request().method()==='POST');
  await page.locator('#save-passage').click();const response=await save,result=await response.json();
  assert.equal(response.ok(),true,result.message||`Save failed: ${response.status()}`);assert.equal(result.passage.image.width,240);
  await page.waitForFunction(()=>!app.saving&&!app.passageDirty);
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof app!=='undefined'&&app.state);
  await page.evaluate(id=>{selectPassage(id);studioUI.showSupportPanel('media');},id);
  assert.equal(await number.inputValue(),'240');
  await page.waitForFunction(()=>document.querySelector('#studio-exam-canvas')?.contentDocument?.querySelector('.exam-passage-image img')?.getAttribute('width')==='240');
  await number.scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(__dirname,'passage-image-resize.png'),fullPage:true});
  await page.setViewportSize({width:1024,height:800});
  await number.scrollIntoViewIfNeeded();
  assert.equal(await number.isVisible(),true);assert.equal(await page.getByRole('slider',{name:'Resize passage image'}).isVisible(),true);
  const state=await fetch(base+'/api/state').then(r=>r.json()),passage=state.passages.find(p=>p.id===id);
  const bad=await fetch(base+'/api/passages',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...passage,image:{...passage.image,width:0}})});
  assert.equal(bad.status,400);
  fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify({paste:true,numericResize:true,sliderResize:true,reset:true,savedWidth:240,reload:true,preview,invalidWidthRejected:true,narrowControlsVisible:true},null,2));
  console.log('Verified actual image paste, border removal, number/slider resizing, original-size reset, save/reload, responsive controls and invalid-size rejection in the disposable studio.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
