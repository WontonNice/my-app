const {chromium} = require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const passage = 'excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c';
const questionId = passage + '-official-shsat-2026-c-38';
const key = 'nathan-tutors:exam-session-progress:v1:exam-player-qa:2026-2027-form-c';
(async () => {
 const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', ignoreDefaultArgs: ['--hide-scrollbars']});
 try {
  const page = await browser.newPage({viewport: {width: 1280, height: 900}});
  page.on('pageerror', e => console.error(e.message));
  await page.addInitScript(({key, passage, questionId}) => {
   if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({answers:{}, completedSections:[], status:'in_progress', updatedAt:new Date().toISOString(), navigation:{subject:'english', english:{screen:'passage', passageSetId:'ela-'+passage, questionId}}}));
  }, {key,passage,questionId});
  await page.goto('http://127.0.0.1:4333/exams/2026-2027-form-c?subject=english');
  await page.locator('.is-passage-selection-layout').waitFor();
  assert.equal(await page.locator('.exam-question-passage').count(), 0);
  const region = page.getByRole('region', {name: 'Selectable passage excerpt'});
  assert.equal(await region.getByRole('checkbox').count(), 5);
  assert.deepEqual(await page.locator('.exam-selection-paragraph-number').allTextContents(), ['5','6','7','8','9']);
  assert.ok(await region.evaluate(el=>el.scrollHeight > el.clientHeight));
  assert.equal(await region.evaluate(el=>getComputedStyle(el).scrollbarGutter), 'stable', 'Reserve the source scrollbar width so selectable sentences wrap correctly');
  assert.ok(await region.evaluate(el => el.getBoundingClientRect().top - document.querySelector('.exam-question-panel h1').getBoundingClientRect().bottom < 20), 'No empty imported prompt blocks');
  await page.screenshot({path:'artifacts/testnav-c-q5/player-unselected.png',fullPage:true});
  const b=page.locator('[data-choice-id="B"]'), c=page.locator('[data-choice-id="C"]'), d=page.locator('[data-choice-id="D"]');
  await b.click(); await c.click();
  assert.equal(await region.locator('[aria-checked="true"]').count(),2);
  assert.deepEqual(await b.evaluate(el=>({color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor})),{color:'rgb(255, 255, 255)',background:'rgb(40, 115, 186)'});
  await d.click();
  await page.getByLabel('Choice limit warnings').waitFor();
  assert.equal(await d.getAttribute('aria-checked'),'false');
  await page.screenshot({path:'artifacts/testnav-c-q5/player-selected-warning.png',fullPage:true});
  await page.getByRole('button',{name:'Close warning',exact:true}).click();
  await b.focus(); await page.keyboard.press('Space');
  assert.equal(await b.getAttribute('aria-checked'),'false');
  assert.equal(await b.evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Enter');
  assert.equal(await b.getAttribute('aria-checked'),'true');
  await page.waitForFunction(({key,questionId})=>JSON.parse(localStorage.getItem(key)).answers[questionId]?.length===2,{key,questionId});
  await page.reload(); await region.waitFor();
  assert.equal(await region.locator('[aria-checked="true"]').count(),2);
  const widths=[];
  for (const width of [1280,1100,850,500]) {
   await page.setViewportSize({width,height:900});
   const dimensions=await page.locator('.is-passage-selection-layout').evaluate(el=>({width:el.clientWidth,overflow:el.scrollWidth>el.clientWidth+1,panelWidth:el.querySelector('.exam-question-panel').clientWidth}));
   assert.equal(dimensions.overflow,false); widths.push({viewportWidth:width,...dimensions});
  }
  await page.getByRole('button', {name:'Next item',exact:true}).click();
  await page.locator('.exam-question-passage').waitFor();
  assert.equal(await page.locator('.is-passage-selection-layout').count(),0);
  await page.getByRole('button', {name:'Previous item',exact:true}).click();
  await region.waitFor();
  assert.equal(await region.locator('[aria-checked="true"]').count(),2);
  fs.writeFileSync('artifacts/testnav-c-q5/verification.json',JSON.stringify({passed:true,choices:5,numbers:[5,6,7,8,9],selectionLimit:2,keyboard:true,savedAnswers:true,widths},null,2));
  console.log('Passed: actual player layout, 5 choices, paragraph badges, scrolling, selection limit warning, keyboard, saved answers, 4 viewport widths.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
