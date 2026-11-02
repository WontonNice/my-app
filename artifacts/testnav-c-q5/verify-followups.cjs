const {chromium}=require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base='http://127.0.0.1:4333',exam='2026-2027-form-c',key='nathan-tutors:exam-session-progress:v1:exam-player-qa:'+exam;
const pepper='excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-'+exam;
const brick='new-york-city-and-the-hudson-valley-brickmaking-industry-'+exam;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report=[];
 try{
  async function open(n,passage){
   const context=await browser.newContext({viewport:{width:1280,height:950}}),page=await context.newPage();
   const id=(passage?passage+'-':'')+'official-shsat-2026-c-'+n,subject=passage?'english':'math';
   await page.addInitScript(({id,subject,passage,key})=>localStorage.setItem(key,JSON.stringify({answers:{},completedSections:[],status:'in_progress',updatedAt:new Date().toISOString(),navigation:{subject,[subject]:{screen:passage?'passage':'mathQuestion',questionId:id,...(passage?{passageSetId:'ela-'+passage}:{})}}})),{id,subject,passage,key});
   await page.goto(base+'/exams/'+exam+'?subject='+subject);
   await page.locator(passage?'#question-title-'+id:'#math-title-'+id).waitFor();
   return page;
  }
  let page=await open(40,pepper);
  const slots=page.locator('[data-answer-slot]');assert.equal(await slots.count(),2);
  for(const dimensions of await slots.evaluateAll(nodes=>nodes.map(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})))){assert.equal(dimensions.width,302);assert.equal(dimensions.height,28);}
  await page.locator('[data-item-id="item-4"]').click();await slots.nth(0).click();
  assert.match(await slots.nth(0).innerText(),/developing the materials/);
  await slots.nth(0).focus();await page.keyboard.press('Delete');assert.equal(await page.locator('[data-item-id="item-4"]').count(),1);
  await page.screenshot({path:'artifacts/testnav-c-q5/fixed-ela-40.png'});report.push('ELA 40: 302×28 boxes, placement and return');await page.context().close();
  page=await open(45,brick);
  const bank=page.locator('.exam-category-bank'),target=page.locator('.exam-category-target');
  assert.ok((await bank.boundingBox()).y<(await target.boundingBox()).y);
  const first=bank.locator('button').nth(0);await first.click();await target.locator('h2').click();
  await bank.locator('button').nth(0).focus();await page.keyboard.press('Enter');await target.focus();await page.keyboard.press('Enter');
  assert.equal(await target.locator('.exam-category-card').count(),2);
  await bank.locator('button').nth(0).click();await target.locator('h2').click();
  assert.equal(await target.locator('.exam-category-card').count(),2);await page.getByLabel('Choice limit warnings').waitFor();
  await page.getByRole('button',{name:'Close warning',exact:true}).click();
  await target.locator('button').nth(0).click();await bank.click({position:{x:2,y:2}});
  assert.equal(await target.locator('.exam-category-card').count(),1);
  await bank.locator('button').last().dragTo(target);assert.equal(await target.locator('.exam-category-card').count(),2);
  await bank.locator('button').first().dragTo(target);assert.equal(await target.locator('.exam-category-card').count(),2);
  await page.screenshot({path:'artifacts/testnav-c-q5/fixed-ela-45.png',fullPage:true});report.push('ELA 45: bank before target, max two by click/keyboard/drag, removal and replacement');await page.context().close();
  for(const [n,variable,prefix] of [[55,'n',null],[78,'w','z']]){
   page=await open(n);await page.getByRole('button',{name:'Variable '+variable,exact:true}).click();
   assert.ok((await page.locator('math-field').evaluate(el=>el.value)).includes(variable));
   await page.getByRole('button',{name:'Clear answer',exact:true}).click();await page.locator('math-field').focus();await page.keyboard.type(variable);
   assert.ok((await page.locator('math-field').evaluate(el=>el.value)).includes(variable));
   if(prefix){assert.equal(await page.getByRole('button',{name:'Variable z',exact:true}).count(),0);assert.match(await page.locator('.exam-math-entry-prefix').innerText(),/z/);}
   await page.screenshot({path:`artifacts/testnav-c-q5/fixed-math-${n-50}.png`});report.push(`Math ${n-50}: ${variable} keypad and physical typing${prefix?', z= label retained':''}`);await page.context().close();
  }
  page=await open(58);const choices=page.locator('.is-two-column .exam-choice');assert.equal(await choices.count(),6);
  const positions=await choices.evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y})));
  for(let i=0;i<6;i+=2){assert.equal(positions[i].y,positions[i+1].y);assert.ok(positions[i].x<positions[i+1].x);}
  for(let i=0;i<5;i++)await choices.nth(i).locator('input').click();assert.equal(await page.locator('input:checked').count(),4);
  await page.screenshot({path:'artifacts/testnav-c-q5/fixed-math-8.png'});report.push('Math 8: two columns in source order, max four');await page.context().close();
  page=await open(62);const points=page.locator('.exam-source-hotspot');assert.equal(await points.count(),9);
  assert.notEqual(await points.first().evaluate(el=>getComputedStyle(el).borderColor),'rgba(0, 0, 0, 0)');
  await points.nth(0).click();await points.nth(4).click();assert.equal(await page.locator('.exam-source-hotspot.is-selected').count(),1);
  await points.nth(1).focus();await page.keyboard.press('Space');assert.equal(await points.nth(1).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.exam-source-hotspot.is-selected').count(),1);
  await page.screenshot({path:'artifacts/testnav-c-q5/fixed-math-12.png'});report.push('Math 12: nine visible points; click/keyboard changes replace selection');await page.context().close();
  page=await open(79);const table=page.locator('table[data-table-style="compact"]');await table.waitFor();
  assert.equal(await table.locator('caption').evaluate(el=>getComputedStyle(el).fontWeight),'400');
  assert.equal(await table.locator('td').first().evaluate(el=>getComputedStyle(el).padding),'1px');
  assert.equal(await page.getByRole('button',{name:/Variable /}).count(),0);
  await page.screenshot({path:'artifacts/testnav-c-q5/fixed-math-29.png'});report.push('Math 29: compact table, regular centered title and text entry');
  fs.writeFileSync('artifacts/testnav-c-q5/followups-verification.json',JSON.stringify(report,null,2));console.log(report.join('\n'));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});


