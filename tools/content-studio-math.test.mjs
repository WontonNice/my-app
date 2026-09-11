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
