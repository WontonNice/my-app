const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { mathAnswerToLatex, mathAnswerFromLatex, normalizeMathAnswer, isMathAnswerComplete } = require('../src/shared/mathAnswer.ts');
const { isExamQuestionCorrect, createExamResult, getAllExamQuestions } = require('../src/shared/examGrading.ts');
const { createProsePassage, createPlainTextPassage } = require('../../client/src/content/exams/formatters.ts');

test('structured math preserves legacy numbers, fractions, mixed numbers, and percentages', () => {
  for (const answer of ['12', '-3.5', '0.25', '1/2', '-13/3', '1 1/2', '25%']) {
    assert.equal(mathAnswerFromLatex(mathAnswerToLatex(answer)), answer);
  }
  for (const latex of ['\\sqrt{3}', '\\sqrt[3]{8}', 'x^{12}', '\\frac{1}{\\frac{2}{3}}', 'x\\le5', '\\left|x\\right|', '2\\pi']) {
    assert.equal(mathAnswerToLatex(mathAnswerFromLatex(latex)), latex);
  }
  assert.equal(mathAnswerFromLatex('\\frac{\\placeholder{}}{\\placeholder{}}'), '');
  assert.equal(isMathAnswerComplete(mathAnswerFromLatex('\\frac{1}{\\placeholder{}}')), false);
  assert.equal(isMathAnswerComplete(''), false);
  assert.equal(isMathAnswerComplete('1/2'), true);
  assert.equal(isMathAnswerComplete('\\(\\frac{12}{}\\)'), false);
  assert.equal(isMathAnswerComplete('\\(x^{}\\)'), false);
  assert.equal(isMathAnswerComplete('\\(\\sqrt[]{}\\)'), false);
});

test('math grades formatting variants without accepting new numerical equivalents', () => {
  const fraction = { type: 'numeric_entry', correctTextAnswers: ['1/2'] };
  assert.equal(isExamQuestionCorrect(fraction, '\\(\\frac{1}{2}\\)'), true);
  assert.equal(isExamQuestionCorrect(fraction, '2/4'), false);
  assert.equal(isExamQuestionCorrect(fraction, '0.5'), false);
  assert.equal(isExamQuestionCorrect(fraction, '\\(\\frac{1}{\\placeholder{}}\\)'), false);
  assert.equal(normalizeMathAnswer('x^2'), normalizeMathAnswer('\\(x^{2}\\)'));
  assert.equal(normalizeMathAnswer('\\left|x\\right|'), normalizeMathAnswer('|x|'));
  assert.equal(isExamQuestionCorrect({ type: 'short_response', correctTextAnswers: ['1/2'] }, '\\(\\frac{1}{2}\\)'), false);
});

test('prose headings, blank blocks, and lists do not consume paragraph numbers', () => {
  const passage = createProsePassage({ id: 'original-prose', title: 'A garden experiment', author: 'A. Writer', text: 'A first observation. A second observation.', richText: '<p>A first <em>observation</em>.</p><p><br></p><h2>What changed</h2><p>A second observation.</p><p><strong>Next steps</strong></p><ul><li>Measure.</li><li>Compare.</li></ul><p>One final observation.</p>' });
  assert.deepEqual(passage.lines.filter(line => line.lineNumber).map(line => line.lineNumber), ['1', '2', '3']);
  assert.equal(passage.lines.filter(line => line.kind === 'heading').length, 2);
  assert.match(passage.lines.find(line => line.kind === 'list').html, /<ul><li>/);
  assert.match(passage.lines.find(line => line.lineNumber === '1').html, /<em>observation<\/em>/);
  const prefix = createProsePassage({ id: 'prefix', title: 'Notes', text: 'Before. After.', richText: 'Before.<p>After.</p>' });
  assert.deepEqual(prefix.lines.filter(line => line.lineNumber).map(line => line.text), ['Before.', 'After.']);
});

test('poetry preserves indentation, stanza gaps, italics, and line-number intervals', () => {
  const passage = createPlainTextPassage({ id: 'original-poem', title: 'Morning', author: 'A. Writer', text: '  One\nTwo\n\nThree\nFour\nFive\nSix' });
  const body = passage.lines.slice(3);
  assert.equal(body[0].text, '  One');
  assert.equal(body[2].text, '');
  assert.deepEqual(body.filter(line => line.lineNumber).map(line => [line.lineNumber, line.text]), [['5', 'Five']]);
  const rich = createPlainTextPassage({ id: 'rich-poem', title: 'Morning', text: 'One\nTwo', richText: '<div>  <em>One</em><br>Two</div>' });
  assert.equal(rich.lines[2].text, '  One');
  assert.match(rich.lines[2].html, /<em>One<\/em>/);
});

test('registered exams still resolve, retain unique question IDs, and grade every authored key', () => {
  const { formA2025_2026Content } = require('../../client/src/content/exams/tests/formA2025_2026.ts');
  const { content20252026FormBContent } = require('../../client/src/content/exams/tests/2025-2026-form-b.ts');
  for (const content of [formA2025_2026Content, content20252026FormBContent]) {
    const questions = getAllExamQuestions(content);
    assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
    for (const question of questions.filter(q => q.correctTextAnswers)) {
      for (const key of question.correctTextAnswers) {
        assert.equal(isExamQuestionCorrect(question, key), true, question.id);
        if (['numeric_entry', 'grid_in'].includes(question.type)) {
          assert.equal(isExamQuestionCorrect(question, mathAnswerFromLatex(mathAnswerToLatex(key))), true, question.id);
        }
      }
    }
    assert.equal(createExamResult(content, {}).total, questions.length);
  }
});
