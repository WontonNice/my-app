const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { advancedMathKeypad, advancedMathKeypadForVariable, isAdvancedMathCharacter } = require('../../client/src/lib/advancedMathEntry.ts');
const { MathEntryHistory } = require('../../client/src/lib/mathEntryHistory.ts');
const { mathAnswerToLatex, mathAnswerFromLatex, isMathAnswerComplete } = require('../src/shared/mathAnswer.ts');
const { isExamQuestionCorrect, createExamResult } = require('../src/shared/examGrading.ts');
const { content20262027FormDMathSection } = require('../../client/src/content/exams/mathSets/2026-2027-form-dMath.ts');
const documentImport = require('../../tools/document-import.cjs');
const q5 = content20262027FormDMathSection.questions[4];

test('Form D question 5 accepts its authored expression and retains every teacher-approved alternative', () => {
  assert.equal(q5.type, 'expression_entry');
  const answer = mathAnswerFromLatex(String.raw`\frac{1}{25}\cdot\frac{1}{100}`);
  assert.equal(isExamQuestionCorrect(q5, answer), true);
  assert.equal(mathAnswerToLatex(answer), String.raw`\frac{1}{25}\cdot\frac{1}{100}`);
  for (const key of q5.correctTextAnswers) assert.equal(isExamQuestionCorrect(q5, key), true, key);
  for (const wrong of ['', '0', '1/25', String.raw`\(\frac{1}{25}+\frac{1}{100}\)`, String.raw`\(\frac{1}{25}\cdot\frac{1}{\placeholder{}}\)`]) {
    assert.equal(isExamQuestionCorrect(q5, wrong), false, wrong);
  }
  const result = createExamResult({ assessmentId:'test', title:'Test', passageSets:[], mathSection: { ...content20262027FormDMathSection, questions:[q5] } }, {[q5.id]:answer}, ['math']);
  assert.equal(result.correct, 1);
  assert.equal(result.questionTypes[0].questionType, 'expression_entry');
  assert.equal(result.answers[q5.id], answer);
});

test('all advanced templates round-trip through stored responses and render for review', () => {
  const katex = require('katex');
  for (const value of [String.raw`\sqrt{9}`, String.raw`\sqrt[3]{8}`, '2^{10}', String.raw`\left(2+3\right)`, String.raw`\left|-5\right|`, String.raw`2\pi`, String.raw`3\le4`, String.raw`8\div2`, String.raw`2\frac{1}{3}`]) {
    const answer = mathAnswerFromLatex(value);
    assert.equal(isMathAnswerComplete(answer), true, value);
    assert.equal(isExamQuestionCorrect({type:'expression_entry', correctTextAnswers:[value]}, answer), true, value);
    assert.doesNotThrow(()=>katex.renderToString(mathAnswerToLatex(answer), {throwOnError:true}));
  }
  for (const key of advancedMathKeypad.flat().filter(Boolean)) {
    const latex = key.latex.replace('#@', String.raw`\placeholder{}`);
    if (latex.includes('placeholder')) assert.equal(isMathAnswerComplete(mathAnswerFromLatex(latex)), false, key.label);
  }
});

test('the advanced keypad and keyboard allow expressions without changing the numeric response type', () => {
  assert.deepEqual(advancedMathKeypad.map(row=>row.length), [8,8,8,8,8]);
  const keys = advancedMathKeypad.flat().filter(Boolean);
  assert.equal(keys.length, 30);
  assert.equal(new Set(keys.map(key=>key.label)).size, keys.length);
  for (const key of '0123456789+-*/().%^=<>|π≤≥') assert.equal(isAdvancedMathCharacter(key), true, key);
  for (const key of ['a','x','\\','{','Enter']) assert.equal(isAdvancedMathCharacter(key), false, key);
  const numeric = {type:'numeric_entry',correctTextAnswers:['1/2']};
  assert.equal(isExamQuestionCorrect(numeric, String.raw`\(\frac{1}{2}\)`), true);
  assert.equal(isExamQuestionCorrect(numeric, '0.5'), false);
});

test('document imports preserve the advanced interaction and its expression key', () => {
  assert.ok(documentImport.schema.question.type.includes('expression_entry'));
  assert.match(documentImport.prompt({}), /Calculator Input \(Advanced\)/);
});

test('expression generators can opt into a variable key and keyboard entry', () => {
  const keys = advancedMathKeypadForVariable('x').flat().filter(Boolean);
  assert.equal(keys.find(key => key.label === 'Variable x').latex, 'x');
  assert.equal(isAdvancedMathCharacter('x', 'x'), true);
  assert.equal(isAdvancedMathCharacter('y', 'x'), false);
  assert.equal(isAdvancedMathCharacter('x'), false);
  assert.equal(advancedMathKeypadForVariable(), advancedMathKeypad);
  assert.equal(advancedMathKeypadForVariable('xy'), advancedMathKeypad);
  assert.equal(advancedMathKeypad.flat().filter(Boolean).length, 30);
});

test('undo and redo restore a deleted fraction digit and its denominator caret', () => {
  const field = { value: String.raw`\frac{1}{100}`, selection: {ranges:[[5,5]]}, setValue(value) { this.value=value; this.selection={ranges:[[99,99]]}; } };
  const history = new MathEntryHistory(field);
  field.value = String.raw`\frac{1}{10}`;
  field.selection = {ranges:[[4,4]]};
  // Undo must also work before MathLive's deferred input event is delivered.
  assert.equal(history.undo(), true);
  assert.equal(field.value, String.raw`\frac{1}{100}`);
  assert.deepEqual(field.selection.ranges, [[5,5]]);
  assert.equal(history.redo(), true);
  assert.equal(field.value, String.raw`\frac{1}{10}`);
  assert.deepEqual(field.selection.ranges, [[4,4]]);
  // A subsequent digit belongs in the denominator, and starts a new edit.
  field.value = String.raw`\frac{1}{102}`;
  field.selection = {ranges:[[5,5]]};
  history.record();
  history.undo();
  assert.equal(field.value, String.raw`\frac{1}{10}`);
  history.undo();
  field.value = '7'; history.record();
  assert.equal(history.redo(), false);
  assert.equal(field.value, '7');
});

test('clear and selection replacements remain reversible without mutating stored selections', () => {
  const field = {value:'123',selection:{ranges:[[1,2]]},setValue(value) {this.value=value;} };
  const history = new MathEntryHistory(field);
  field.value='193'; field.selection.ranges[0]=[2,2]; history.record();
  history.undo();
  assert.equal(field.value,'123');
  assert.deepEqual(field.selection.ranges,[[1,2]]);
  history.redo();
  field.value=''; field.selection={ranges:[[0,0]]}; history.record();
  history.undo(); assert.equal(field.value,'193');
  history.redo(); assert.equal(field.value,'');
  assert.deepEqual(field.selection.ranges,[[0,0]]);
});
