import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";
import katex from "katex";
import { convertLatexToMarkup } from "mathlive/ssr";
import ts from "typescript";

const source = await readFile(new URL("./content-studio-math.js", import.meta.url), "utf8");
const math = vm.runInNewContext(`${source}\nstudioMath;`, { window: { katex } });

test('native math saves and assessment registration preserve Skilled IDs and default unassigned math to TBD',async()=>{
  const server=await readFile(new URL('./content-studio.mjs',import.meta.url),'utf8');
  const normalize=vm.runInNewContext(server.slice(server.indexOf('function normalizeMathQuestion('),server.indexOf('function normalizeMathSection('))+'\nnormalizeMathQuestion;',{
    documentImport:{normalizeChoiceLabels:value=>value},EditorError:class extends Error{},requiredText:value=>value,slugify:value=>value,sanitizeRichText:()=>'',normalizeMathImage:()=>undefined,
  });
  const input={id:'manual-question',type:'short_response',topic:'Algebra',subtopic:'Inequalities',skilled:'teacher-skill-id',prompt:'Find x.',correctTextAnswers:['2']};
  const normalized=normalize(input,'exam',0);assert.equal(normalized.skilled,input.skilled);assert.equal(normalized.prompt,input.prompt);assert.deepEqual(Array.from(normalized.correctTextAnswers),input.correctTextAnswers);
  assert.equal(normalize({...input,skilled:undefined},'exam',0).skilled,'TBD');
  const registry=vm.runInNewContext(server.slice(server.indexOf('function assessmentQuestionFrom('),server.indexOf('async function saveTest('))+'\nassessmentQuestionFrom;');
  assert.equal(registry(normalized).skilled,input.skilled);
  assert.equal(registry({id:'english',topic:'Reading',prompt:'A passage question',type:'short_response'}).skilled,undefined);
});

test('captioned math images preserve their position and safe metadata when saved', async () => {
  const server = await readFile(new URL('./content-studio.mjs', import.meta.url), 'utf8');
  const sanitize = vm.runInNewContext(server.slice(server.indexOf('const allowedRichTags ='), server.indexOf('function sanitizeInlineRichText(')) + '\nsanitizeRichText;');
  assert.equal(sanitize('<p>Before the diagram.</p><figure onclick="unsafe()"><img src="/exam-images/diagram.png" alt="Triangle" width="360" onerror="unsafe()"><figcaption>A measured triangle.</figcaption></figure><p>After the diagram.</p>'), '<p>Before the diagram.</p><figure><img src="/exam-images/diagram.png" alt="Triangle" width="360"><figcaption>A measured triangle.</figcaption></figure><p>After the diagram.</p>');
  assert.doesNotMatch(sanitize('<figure><img src="javascript:unsafe()"><figcaption><script>unsafe()</script>Caption</figcaption></figure>'), /javascript|script|unsafe/);
});

test('image-only rich math choices satisfy strict validation without adding placeholder text', async () => {
  const server = await readFile(new URL('./content-studio.mjs', import.meta.url), 'utf8');
  const normalize = vm.runInNewContext(`class EditorError extends Error { constructor(status, message) { super(message); this.status = status; } }
    ${server.slice(server.indexOf('function requiredText('), server.indexOf('function propertyName('))}
    ${server.slice(server.indexOf('function normalizeMathChoiceImage('), server.indexOf('function normalizeMathDropdownOption('))}
    normalizeMathChoice;`);
  const html = '<img src="/exam-images/number-line.png" alt="Number line" width="200">';
  for (const allowIncomplete of [false, true]) {
    const choice = normalize({ id: 'A', text: '', html: `<p>${html}</p>` }, 0, 24, { allowIncomplete });
    assert.equal(choice.html, html);
    assert.equal(choice.text, '');
    assert.equal(choice.image, undefined, 'inline images stay in their original rich content');
  }
  for (const emptyHtml of ['', '<p><br></p>', '<!-- image -->', '<img', '<img src="javascript:unsafe()">', '<img src="https://example.com/image.png">']) {
    assert.throws(() => normalize({ id: 'A', text: '', html: emptyHtml }, 0, 24), /Math question 24 answer A is required/);
  }
});

async function previewBootHarness(fetch) {
  const html = await readFile(new URL('./content-studio.html', import.meta.url), 'utf8');
  const start = html.indexOf('async function bootMathPreviewFrame(');
  const end = html.indexOf('function startMathPreviewFrames(', start);
  const statuses = [];
  const boot = vm.runInNewContext(`let mathPreviewDocumentPromise; let mathPreviewBootSequence = 0; ${html.slice(start,end)}; bootMathPreviewFrame;`, {
    fetch, sendMathPreview: () => {}, escapeHtml: value => String(value).replaceAll('<','&lt;'), setStatus: (...args) => statuses.push(args),
  });
  const frame = () => ({dataset: {}, isConnected: true, removeAttribute() {}, srcdoc: ''});
  return {boot, frame, statuses};
}

test('preview boot ignores detached and superseded frames while sharing the player document request', async () => {
  let resolveDocument;
  let requests = 0;
  const harness = await previewBootHarness(() => { requests++; return new Promise(resolve => { resolveDocument = resolve; }); });
  const detached = harness.frame(), active = harness.frame();
  const pending = [harness.boot(detached), harness.boot(active), harness.boot(active)];
  detached.isConnected = false;
  const documentHtml = '<!doctype html><html><body>Shared student player</body></html>';
  resolveDocument({ok:true,text:async()=>documentHtml});
  await Promise.all(pending);
  assert.equal(requests,1);
  assert.match(detached.srcdoc,/Loading student player/);
  assert.equal(active.srcdoc,documentHtml);
  assert.equal(active.dataset.mathPreviewBoot,'3');
  assert.deepEqual(harness.statuses,[]);
});

test('a failed preview load is visible and can be retried', async () => {
  let requests = 0;
  const harness = await previewBootHarness(async () => ++requests === 1 ? {ok:false} : {ok:true,text:async()=>'<html>Shared player</html>'});
  const frame = harness.frame();
  await harness.boot(frame);
  assert.match(frame.srcdoc,/could not be loaded/);
  assert.equal(frame.dataset.mathPreviewBoot,undefined);
  assert.equal(harness.statuses[0][1],'error');
  await harness.boot(frame);
  assert.equal(requests,2);
  assert.equal(frame.srcdoc,'<html>Shared player</html>');
});

test("every symbol and template renders in both the equation editor and the student renderer", () => {
  const ids = new Set();
  for (const [id] of math.entries()) {
    assert.ok(!ids.has(id), `Duplicate palette command: ${id}`);
    ids.add(id);
    const latex = math.template(id);
    assert.ok(!latex.includes("#0"), `Unresolved insertion marker: ${id}`);
    assert.ok(convertLatexToMarkup(latex).length > 0, id);
    assert.doesNotThrow(() => katex.renderToString(math.previewLatex(latex), { throwOnError: true, strict: "ignore" }), id);
  }
});

test("selected expressions become the requested part of a new structure", () => {
  assert.equal(math.template("frac", "x+2"), String.raw`\frac{x+2}{\placeholder{}}`);
  assert.equal(math.template("sqrt", "x+4"), String.raw`\sqrt{x+4}`);
  assert.equal(math.template("exp", "2"), String.raw`\placeholder{}^{2}`);
  assert.equal(math.template("exp", "", true), String.raw`^{\placeholder{}}`);
  assert.equal(math.template("paren", String.raw`\frac{x}{2}`), String.raw`\left(\frac{x}{2}\right)`);
});

test("search supports slash commands, LaTeX commands, names and synonyms", () => {
  assert.equal(math.search("/frac")[0][0], "frac");
  assert.equal(math.search(String.raw`\theta`)[0][0], "theta");
  assert.equal(math.search("greater than or equal")[0][0], "ge");
  assert.equal(math.search("numerator")[0][0], "frac");
  assert.ok(math.search("", "Templates").every((entry) => entry[2] === "Templates"));
  assert.equal(math.search("nonexistent notation").length, 0);
});

test("validation distinguishes unfinished structures from invalid LaTeX without rewriting source", () => {
  const valid = String.raw`\frac{\sqrt{x^2+4}}{2x^3}`;
  assert.equal(math.validate(valid), "");
  assert.match(math.validate(String.raw`\frac{1}{`), /Expected|end of input/);
  assert.match(math.validate(String.raw`\unknowncommand{x}`), /Undefined control sequence/);
  assert.match(math.validate(math.template("frac")), /placeholders/);
  assert.equal(math.validate(""), "");
  assert.equal(valid, String.raw`\frac{\sqrt{x^2+4}}{2x^3}`);
});

test("preview placeholder conversion preserves nested expressions and ordinary square notation", () => {
  assert.equal(math.previewLatex(String.raw`\sqrt{\placeholder{}}+\square+\frac{x}{\placeholder{}}`), String.raw`\sqrt{\square{}}+\square+\frac{x}{\square{}}`);
});

test("the virtual keyboard has a visible close control that hides it without editing math", () => {
  const buttonListeners = {};
  const keyboardListeners = {};
  const keyboard = {
    boundingRect: { top: 200 },
    hideOptions: null,
    visible: true,
    addEventListener(type, listener) { keyboardListeners[type] = listener; },
    hide(options) { this.hideOptions = options; this.visible = false; },
  };
  const button = {
    addEventListener(type, listener) { buttonListeners[type] = listener; },
    setAttribute() {},
    style: {},
  };
  const document = {
    appended: null,
    body: { append(node) { document.appended = node; } },
    createElement() { return button; },
    querySelector() { return null; },
  };
  const window = {
    addEventListener() {},
    innerHeight: 800,
    katex,
    mathVirtualKeyboard: keyboard,
    requestAnimationFrame(callback) { callback(); },
  };
  const isolatedMath = vm.runInNewContext(`${source}\nstudioMath;`, { document, window });

  isolatedMath.mountKeyboardExit();

  assert.equal(document.appended, button);
  assert.equal(button.hidden, false);
  assert.equal(button.style.top, "208px");
  assert.match(button.innerHTML, /Close keyboard/);
  buttonListeners.click();
  assert.equal(keyboard.hideOptions.animate, true);
  keyboardListeners["virtual-keyboard-toggle"]();
  assert.equal(button.hidden, true);
});

test("student dropdown sentences render display math while preserving answer values and plain menu labels", async () => {
  const templateSource = await readFile(new URL('../client/src/lib/inlineDropdownTemplate.ts', import.meta.url), 'utf8');
  const templateJs = ts.transpileModule(templateSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const templateExports = {};
  vm.runInNewContext(templateJs, { exports: templateExports });
  const page = await readFile(new URL("../client/src/components/ExamMathQuestion.tsx", import.meta.url), "utf8");
  const start = page.indexOf("function renderInlineDropdownText(");
  const finish = page.indexOf("type Props =", start);
  const js = ts.transpileModule(page.slice(start, finish), { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
  const render = vm.runInNewContext(`${js}\nrenderInlineDropdownText;`, {
    parseInlineDropdownTemplate: templateExports.parseInlineDropdownTemplate,
    React: { createElement: (tag, props, ...children) => ({ tag, props, children }) },
    selectedAnswers: { q1: { answer: "b" } },
    placements: (value) => value,
    handleChangeInlineDropdownAnswer: () => {},
    renderKatexExpression: (value, displayMode) => ({ value, displayMode, markup: katex.renderToString(value, { displayMode }) }),
    renderInlineMathText: (value) => ({ value, displayMode: false }),
  });
  const result = render({ id: "q1", dropdowns: [{ id: "answer", options: [{ id: "a", text: "2" }, { id: "b", text: "4" }] }] }, String.raw`Given \[f(x)=\frac{x^2-4}{x-2}\], the limit \(x\to2\) is {{answer}}.`, 0, { answer: "b" }, () => {});
  const display = result.find((item) => item.tag === "span" && item.props.className === "exam-katex-template-display");
  assert.equal(display.children[0].displayMode, true);
  assert.equal(display.children[0].value, String.raw`f(x)=\frac{x^2-4}{x-2}`);
  const menu = result.find((item) => item.tag === "select");
  assert.equal(menu.props.value, "b");
  assert.equal(menu.children[1][1].props.value, "b");
  assert.equal(menu.children[1][1].children[0], "4");
});

test("Math copy action uses the shared universal prompt and keeps legacy JSON import available", async () => {
  const studio = await readFile(new URL("./content-studio.html", import.meta.url), "utf8");
  assert.match(studio, /return studioUI.buildOfficialPassagePrompt/);
  assert.match(studio, /payload.format === DocumentImport.format/);
  assert.match(studio, /api\/math\/import-preview/);
});

test('math workspace adapters retain legacy topics and use the existing visual toolbar and KaTeX', async () => {
  const html = await readFile(new URL('./content-studio.html', import.meta.url), 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).sort((a, b) => b.length - a.length)[0];
  const tree = ts.createSourceFile('studio.js', script, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const names = ['mathTopicOptions', 'mathFormulaToolbarHtml', 'renderKatexExpression'];
  const functions = tree.statements.filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text));
  assert.equal(functions.length, names.length);
  const adapters = vm.runInNewContext(functions.map(node => node.getText(tree)).join('\n') + '\n({mathTopicOptions, mathFormulaToolbarHtml, renderKatexExpression});', {
    window: { katex }, studioMath: math, app: { state: { mathTopics: ['Algebra', 'Geometry'] } }, escapeHtml: value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;'),
  });
  assert.match(adapters.mathTopicOptions('Legacy topic'), /value="Legacy topic" selected/);
  assert.match(adapters.mathFormulaToolbarHtml('prompt'), /data-equation-target="prompt"/);
  const fraction = adapters.renderKatexExpression(String.raw`\frac{1}{2}`, true);
  assert.match(fraction, /katex-display/); assert.match(fraction, /mfrac/);
  assert.doesNotThrow(() => adapters.renderKatexExpression(String.raw`\placeholder{}`));
});
