import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import documentImport from './document-import.cjs';
import { readMathTopicConfiguration, validateMathClassification } from './math-topic-editor.mjs';

const source = await readFile(new URL('./content-studio.mjs', import.meta.url), 'utf8');
const ast = ts.createSourceFile('content-studio.mjs', source, ts.ScriptTarget.Latest, true);
// Exercise the production normalizers without starting a server or writing content.
const declarations = ast.statements.filter(node => ts.isFunctionDeclaration(node)).map(node => node.getText(ast)).join('\n');
const { normalizeMathQuestion, normalizeMathSection } = vm.runInNewContext(`${declarations}\n({normalizeMathQuestion, normalizeMathSection});`, {
  documentImport, extname,
  EditorError: class extends Error { constructor(status, message) { super(message); this.status = status; } },
});
const fixtureSource = await readFile(new URL('../client/src/content/exams/mathSets/2026-2027-form-cMath.ts', import.meta.url), 'utf8');
const fixtureExports = {};
vm.runInNewContext(ts.transpileModule(fixtureSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: fixtureExports });
const section = JSON.parse(JSON.stringify(Object.values(fixtureExports)[0]));
const dropdownQuestion = section.questions[43];

test('Form C Q44 saves its complete dropdown stem without adding duplicate prompt text', () => {
  assert.equal(dropdownQuestion.id, 'official-shsat-2026-c-94');
  assert.equal(dropdownQuestion.prompt, '');
  const result = normalizeMathQuestion(dropdownQuestion, '2026-2027-form-c', 43);
  assert.equal(result.prompt, '');
  assert.equal(result.dropdownContentHtml, documentImport.sanitizeRichText(dropdownQuestion.dropdownContentHtml));
  assert.deepEqual(JSON.parse(JSON.stringify(result.dropdownContent)), dropdownQuestion.dropdownContent);
  assert.deepEqual(JSON.parse(JSON.stringify(result.dropdowns)), dropdownQuestion.dropdowns);
});

test('dropdown saves still require content, menus, valid answers and referenced slots', () => {
  const normalize = changes => normalizeMathQuestion({ ...dropdownQuestion, ...changes }, 'exam', 43);
  assert.throws(() => normalize({ dropdownContent: [] }), /needs at least one dropdown sentence/);
  assert.throws(() => normalize({ dropdownContent: ['  '] }), /dropdown sentence 1 is required/);
  assert.throws(() => normalize({ dropdowns: [] }), /needs at least one dropdown menu/);
  assert.throws(() => normalize({ dropdowns: dropdownQuestion.dropdowns.map(menu => ({ ...menu, correctChoiceId: 'Z' })) }), /valid correct answer/);
  assert.throws(() => normalize({ dropdownContent: ['Choose {{unknown}}.'] }), /no longer available/);
  assert.throws(() => normalize({ dropdownContent: ['Choose a width.'] }), /missing from its sentence/);
  assert.throws(() => normalize({ type: 'short_response', correctTextAnswers: ['1'] }), /Math question 44 is required/);
});

test('all 50 current Form C questions pass classification and strict section-save validation', async () => {
  const configuration = await readMathTopicConfiguration(fileURLToPath(new URL('..', import.meta.url)));
  const questions = section.questions.map(question => ({ ...question, ...validateMathClassification(question, configuration, question) }));
  const result = normalizeMathSection({ ...section, questions }, { id: '2026-2027-form-c' });
  assert.equal(result.questions.length, 50);
  assert.deepEqual(Array.from(result.questions, question => question.id), Array.from(section.questions, question => question.id));
});

test('calculator variables save independently of answer labels, including no variable key', () => {
  const question = section.questions.find(question => question.id === 'official-shsat-2026-c-85');
  assert.equal(question.entryVariable, 'b');
  assert.equal(question.entryPrefixVariable, 'a');
  for (const variable of ['b', 'w', '', 'x, y', 'a,b,c']) {
    const result = normalizeMathQuestion({ ...question, entryVariable: variable }, 'exam', 34);
    assert.equal(result.entryVariable, variable || undefined);
    assert.equal(result.entryPrefixVariable, 'a');
    assert.equal(result.entryLayout, 'x_equals');
  }
  assert.throws(() => normalizeMathQuestion({ ...question, entryVariable: 'ab' }, 'exam', 34), /Calculator variable must be one letter/);
  assert.throws(() => normalizeMathQuestion({ ...question, entryVariable: '2' }, 'exam', 34), /Calculator variable must be one letter/);
  assert.throws(() => normalizeMathQuestion({ ...question, entryVariable: 'a,b,c,d' }, 'exam', 34), /Calculator variable must be one letter/);
  assert.throws(() => normalizeMathQuestion({ ...question, entryPrefixVariable: 'ab' }, 'exam', 34), /equation label must be one letter/);
});
