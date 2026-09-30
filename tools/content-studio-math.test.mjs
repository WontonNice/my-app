import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";
import katex from "katex";
import { convertLatexToMarkup } from "mathlive/ssr";
import ts from "typescript";

const source = await readFile(new URL("./content-studio-math.js", import.meta.url), "utf8");
const math = vm.runInNewContext(`${source}\nstudioMath;`, { window: { katex } });

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
  const page = await readFile(new URL("../client/src/pages/ExamSessionPage.tsx", import.meta.url), "utf8");
  const start = page.indexOf("  function renderInlineDropdownText(");
  const finish = page.indexOf("  function handlePlaceCategoryItem(", start);
  const js = ts.transpileModule(page.slice(start, finish), { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
  const render = vm.runInNewContext(`${js}\nrenderInlineDropdownText;`, {
    React: { createElement: (tag, props, ...children) => ({ tag, props, children }) },
    selectedAnswers: { q1: { answer: "b" } },
    getCategoryPlacements: (value) => value,
    handleChangeInlineDropdownAnswer: () => {},
    renderKatexExpression: (value, displayMode) => ({ value, displayMode, markup: katex.renderToString(value, { displayMode }) }),
    renderInlineMathText: (value) => ({ value, displayMode: false }),
  });
  const result = render({ id: "q1", dropdowns: [{ id: "answer", options: [{ id: "a", text: "2" }, { id: "b", text: "4" }] }] }, String.raw`Given \[f(x)=\frac{x^2-4}{x-2}\], the limit \(x\to2\) is {{answer}}.`, 0);
  const display = result.find((item) => item.tag === "span" && item.props.className === "exam-katex-template-display");
  assert.equal(display.children[0].displayMode, true);
  assert.equal(display.children[0].value, String.raw`f(x)=\frac{x^2-4}{x-2}`);
  const menu = result.find((item) => item.tag === "select");
  assert.equal(menu.props.value, "b");
  assert.equal(menu.children[1][1].props.value, "b");
  assert.equal(menu.children[1][1].children[0], "4");
});

test("the official PDF importer prompt matches the real one-question math schema", async () => {
  const [studio, guide] = await Promise.all([
    readFile(new URL("./content-studio.html", import.meta.url), "utf8"),
    readFile(new URL("./MATH_QUESTION_IMPORT.md", import.meta.url), "utf8"),
  ]);

  for (const content of [studio, guide]) {
    assert.match(content, /nathan-tutors-math-question-v1/);
    assert.match(content, /Old paper grid-in becomes \"numeric_entry\"/);
    assert.match(content, /never \"grid_in\" and never \"short_response\"/);
    assert.match(content, /grader performs format normalization, not algebraic evaluation/);
    assert.match(content, /Do not misuse this continuous-range shape for two disjoint rays/);
    assert.match(content, /Do not use \"graph_point_select\" for a source graph that the student only reads/);
    assert.match(content, /Do not invent a source-metadata field/);
  }

  assert.match(studio, /Official Math Question Importer/);
  assert.match(studio, /id="math-import-target"/);
  assert.match(studio, /mathOfficialQuestionConversionPrompt\(assessment\?\.title, target\)/);
  assert.match(studio, /replaceStarterQuestion =/);
  assert.match(studio, /starterQuestion\?\.id === `\$\{app\.selectedMathAssessmentId\}-math-1`/);
  assert.match(guide, /Questions 58–62: `numeric_entry`/);
  assert.match(guide, /Questions 63–114: `multiple_choice`/);
});
