const {chromium} = require('C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:1100}});
  await page.goto('http://127.0.0.1:4319/?assessmentId=2026-2027-form-c&questionId=official-shsat-2026-c-85');
  const variable = page.locator('#math-entry-variable'), prefix = page.locator('#math-entry-prefix-variable');
  await variable.waitFor({timeout:60000});
  assert.equal(await variable.inputValue(), 'b'); assert.equal(await prefix.inputValue(), 'a');
  const frame = page.frameLocator('#math-live-preview iframe');
  await frame.getByRole('button',{name:'Variable b',exact:true}).waitFor({timeout:60000});
  assert.match(await frame.locator('.exam-math-entry-prefix').innerText(), /a/);
  await variable.fill('w');
  await frame.getByRole('button',{name:'Variable w',exact:true}).waitFor();
  assert.equal(await prefix.inputValue(), 'a');
  await prefix.fill('z');
  await page.waitForFunction(() => document.querySelector('#math-live-preview iframe')?.contentDocument?.querySelector('.exam-math-entry-prefix')?.textContent.includes('z'));
  await variable.fill('');
  await page.waitForFunction(() => !document.querySelector('#math-live-preview iframe')?.contentDocument?.querySelector('button[aria-label^="Variable "]'));
  await page.locator('#math-entry-layout').selectOption('plain');
  assert.equal(await variable.isVisible(), true); assert.equal(await prefix.isVisible(), false);
  await variable.fill('n');
  await frame.getByRole('button',{name:'Variable n',exact:true}).waitFor();
  await page.locator('#math-entry-layout').selectOption('x_equals');
  assert.equal(await prefix.inputValue(),'z');
  await variable.fill('ab'); assert.equal(await variable.evaluate(el=>el.validity.valid),false);
  await variable.fill('b'); await prefix.fill('a');
  await frame.getByRole('button',{name:'Variable b',exact:true}).click();
  assert.match(await frame.locator('math-field').evaluate(el=>el.value),/b/);
  let captured;
  await page.route('**/api/math', async route => {
   if(route.request().method()!=='POST') return route.continue();
   captured=route.request().postDataJSON();
   await route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({error:'QA save intercepted; no files written.'})});
  });
  await page.locator('#save-math').click();
  await page.waitForResponse(response=>response.url().endsWith('/api/math') && response.request().method()==='POST');
  const saved = captured.questions.find(q=>q.id==='official-shsat-2026-c-85');
  assert.equal(saved.entryVariable,'b'); assert.equal(saved.entryPrefixVariable,'a');
  assert.equal(await variable.inputValue(),'b'); assert.equal(await prefix.inputValue(),'a');
  await variable.scrollIntoViewIfNeeded();
  await page.screenshot({path:'artifacts/testnav-c-q5/variable-editor.png'});
  console.log('PASS: Q35 b keypad / a= label; independent live edits; blank removes key; plain layout field; invalid input; save payload and draft preservation.');
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
