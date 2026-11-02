const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto('http://127.0.0.1:4327');
  await page.waitForFunction(()=>typeof app!=='undefined'&&app.state?.assessments?.length,null,{timeout:30000});
  await page.evaluate(()=>{switchTab('tests');selectAssessment('2018-2019-form-a');});
  const box=page.getByRole('checkbox',{name:'Verified',exact:true});
  assert.equal(await box.isChecked(),false);
  await page.evaluate(()=>{app.testDirty=true;app.testDraft.description='Unsaved QA description';});
  await box.check();
  await page.waitForFunction(()=>app.state.examVerification['2018-2019-form-a']?.verified===true);
  assert.equal(await page.locator('[data-assessment-id="2018-2019-form-a"] .studio-verified-badge').count(),1);
  assert.deepEqual(await page.evaluate(()=>({dirty:app.testDirty,description:app.testDraft.description})),{dirty:true,description:'Unsaved QA description'});
  await page.evaluate(()=>{app.testDirty=false;});
  await page.reload();
  await page.waitForFunction(()=>app.state?.assessments?.length,null,{timeout:30000});
  await page.evaluate(()=>{switchTab('tests');selectAssessment('2018-2019-form-a');});
  assert.equal(await box.isChecked(),true);
  await page.screenshot({path:'artifacts/exam-verification/verified.png'});
  await page.route('**/api/exams/*/verification',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'Simulated save failure'})}));
  await box.uncheck();
  await page.locator('.studio-exam-verification [role="status"]').filter({hasText:'Not saved:'}).waitFor();
  assert.equal(await box.isChecked(),true);
  await page.unroute('**/api/exams/*/verification');
  await box.uncheck();
  await page.waitForFunction(()=>app.state.examVerification['2018-2019-form-a']?.verified===false);
  const statuses=await page.evaluate(async()=>{
    const send=(id,value)=>fetch(`/api/exams/${id}/verification`,{method:'PUT',headers:{'Content-Type':'application/json','x-editor-token':app.token},body:JSON.stringify(value)}).then(r=>r.status);
    return [await send('2018-2019-form-a',{verified:'yes'}),await send('not-an-exam',{verified:true})];
  });
  assert.deepEqual(statuses,[400,404]);
  console.log('PASS: default unchecked, save/reload, badge, drafts preserved, failure rollback, uncheck, invalid input and unknown exam.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
