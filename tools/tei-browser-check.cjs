// Browser regression against the actual editor; draft/attempt writes are blocked.
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const path = require('node:path');
const {homedir} = require('node:os');
const {mkdirSync} = require('node:fs');
const {fixtures, questions, sentence, commaSplice} = require('./tei-fixtures.cjs');
let playwright;
try {playwright=require('playwright');} catch {playwright=require(path.join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const server=spawn(process.execPath,['tools/content-studio.mjs','--no-open','--port=4398'],{windowsHide:true,stdio:['ignore','pipe','pipe']});
let logs=''; server.stdout.on('data',data=>logs+=data);server.stderr.on('data',data=>logs+=data);
(async()=>{
  let browser;
  try {
    for(let i=0;i<100;i++){try {if((await fetch('http://localhost:4398/')).ok)break;}catch{} await new Promise(resolve=>setTimeout(resolve,100));}
    browser=await playwright.chromium.launch({channel:'msedge',headless:true});
    const page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/api/**',route=>route.request().method()==='GET'?route.continue():route.abort());
    await page.goto('http://localhost:4398/');
    await page.waitForFunction(()=>typeof app!=='undefined'&&app.state&&typeof studioUI!=='undefined');
    await page.waitForSelector('#studio-exam-canvas');
    const mount=async(q)=>{
      await page.evaluate(q=>{
        app.passageDraft={...defaultPassage(),id:'tei-regression',title:'Approved response comparison',text:'Passage text.',questions:[q]};
        app.selectedPassageId='tei-regression';app.passageMode='exam';studioUI.selectedQuestionIndex=0;studioUI.selectedQuestionId=q.id;
        renderPassageEditor();
      },q);
      const frame=page.frameLocator('#studio-exam-canvas');
      await frame.locator('[data-response-ready="true"]').waitFor();
      return frame;
    };
    for(const q of fixtures){
      console.log('Checking',q.type,q.id);
      const frame=await mount(q);
      assert.equal(await frame.locator('[role="alert"]').count(),0,q.id);
      assert.ok(await frame.locator('[data-response-preview] button, [data-response-preview] input, [data-response-preview] select, [data-response-preview] [tabindex="0"]').count(),q.id);
      // Same response component in teacher canvas and reading Student view.
      const shape=await frame.locator('[data-response-preview]').evaluate(root=>[...root.querySelectorAll('button,input,select,svg')].map(e=>[e.tagName,e.getAttribute('class'),e.getAttribute('aria-label')]));
      await page.evaluate(()=>{app.previewMode='passage';document.querySelector('#student-preview-modal').hidden=false;renderStudentPreview();});
      const student=page.frameLocator('#student-preview-frame');await student.locator('[data-response-ready="true"]').waitFor();
      const studentShape=await student.locator('[data-response-preview]').evaluate(root=>[...root.querySelectorAll('button,input,select,svg')].map(e=>[e.tagName,e.getAttribute('class'),e.getAttribute('aria-label')]));
      // Ordinary choices gain teacher-only labels; TEIs stay unchanged.
      if(!['multiple_choice','multi_select'].includes(q.type)||q.selectionHtml||q.hotSpot)assert.deepEqual(shape,studentShape,q.id);
      await page.evaluate(()=>{document.querySelector('#student-preview-modal').hidden=true;});
    }
    const frame=await mount(sentence),bank=frame.locator('.exam-math-drag-bank');
    await bank.getByRole('button',{name:'First',exact:true}).click();await frame.locator('[data-answer-slot="blank-1"]').click();
    await bank.getByRole('button',{name:'Second',exact:true}).click();await frame.locator('[data-answer-slot="blank-2"]').click();
    assert.match(await frame.locator('[data-answer-slot="blank-1"]').innerText(),/First/);
    await frame.locator('[data-answer-slot="blank-1"]').press('Delete');
    await bank.getByRole('button',{name:'First',exact:true}).waitFor();
    await bank.getByRole('button',{name:'First',exact:true}).dragTo(frame.locator('[data-answer-slot="blank-1"]'));
    assert.match(await frame.locator('[data-answer-slot="blank-1"]').innerText(),/First/);
    await frame.locator('[data-answer-slot="blank-1"]').dragTo(bank);
    await bank.getByRole('button',{name:'First',exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>app.passageDraft.questions[0].dragDropSlots[0].correctItemId),'A');
    const indoor=questions.find(q=>q.id.includes('indoor-plants')&&q.type==='math_drag_drop');
    assert.ok(indoor,'Indoor Plants reference');await mount(indoor);
    mkdirSync('artifacts/tei-consolidation',{recursive:true});
    await page.locator('#studio-exam-canvas').screenshot({path:'artifacts/tei-consolidation/indoor-plants-authoring.png'});
    const referenceBox=await page.frameLocator('#studio-exam-canvas').locator('[data-answer-slot]').first().evaluate(node=>{const s=getComputedStyle(node);return [s.minWidth,s.borderRadius,s.borderWidth,s.height];});
    const comma=await mount(commaSplice);
    assert.deepEqual(await comma.locator('[data-answer-slot]').evaluate(node=>{const s=getComputedStyle(node);return [s.minWidth,s.borderRadius,s.borderWidth,s.height];}),referenceBox);
    await page.locator('#studio-exam-canvas').screenshot({path:'artifacts/tei-consolidation/comma-splice-authoring.png'});
    const choiceFrame=await mount(fixtures.find(q=>q.type==='multiple_choice'&&!q.selectionHtml&&!q.hotSpot));
    await choiceFrame.getByRole('textbox',{name:'Exam question prompt',exact:true}).fill('Teacher edit retained.');
    assert.equal(await page.evaluate(()=>app.passageDraft.questions[0].prompt),'Teacher edit retained.');
    const menuFrame=await mount(fixtures.find(q=>q.type==='inline_dropdown'));
    const menu=menuFrame.locator('select').first();const value=await menu.locator('option').nth(1).getAttribute('value');
    await menu.selectOption(value);assert.equal(await menu.inputValue(),value);
    const hot=await mount(fixtures.find(q=>q.selectionHtml));
    await hot.locator('[data-choice-id]').first().click();
    assert.equal(await hot.locator('[data-choice-id]').first().getAttribute('aria-checked'),'true');
    assert.deepEqual(errors,[]);
    console.log(`PASS: ${fixtures.length} response fixtures, editor/student structure parity, two-blank placement and keyboard return; no student or draft writes.`);
  } finally {await browser?.close();server.kill();}
})().catch(error=>{console.error(error);console.error(logs.slice(-2000));process.exitCode=1;});
