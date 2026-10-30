import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import katex from 'katex';
import contract from './document-import.cjs';
import batches from './math-import-batch.cjs';

const question = {
  id: 'fraction-choice-import', type: 'multiple_choice', prompt: 'What does the score mean?',
  choices: [
    { id: 'E', text: 'The test will last 1 1/4 hours.' },
    { id: 'F', text: 'Each test question is worth 1 1/4 points.', html: '<strong>Each test question</strong> is worth 1 1/4 points.' },
    { id: 'G', text: 'An average student can answer 5 questions in 4 minutes.' },
    { id: 'H', text: 'A student earns 4 points.' },
  ], correctChoiceId: 'F',
};

test('single and batch Math imports format prose fractions and preserve source wording and answer mapping', () => {
  for (const payload of [{ question }, { mathQuestions: [question] }]) {
    for (const parse of [contract.parse, batches.parse]) {
      const imported = parse(payload)[0].content.questions[0];
      assert.deepEqual(imported.choices.map(c => c.text), question.choices.map(c => c.text));
      assert.equal(imported.choices[0].html, String.raw`The test will last \(1\frac{1}{4}\) hours.`);
      assert.equal(imported.choices[1].html, String.raw`<strong>Each test question</strong> is worth \(1\frac{1}{4}\) points.`);
      assert.equal(imported.choices[2].html, undefined);
      assert.equal(imported.correctChoiceId, 'B');
      assert.deepEqual(contract.formatImportedMathChoices(imported), imported, 'reimport must not nest delimiters');
    }
  }
  assert.equal(question.choices[0].html, undefined, 'input is not mutated');
  assert.equal(contract.parse({ passage: { text: 'A passage.', questions: [question] } })[0].content.questions[0].choices[0].html, undefined, 'English imports are not reformatted');
});

test('negative, unicode, and spaced fractions produce valid inline KaTeX while escaping prose', () => {
  for (const [text, expected] of [
    ['-2 3/4', String.raw`\(-2\frac{3}{4}\)`],
    ['−1 / 2', String.raw`\(-\frac{1}{2}\)`],
    ['1¼ hours', String.raw`\(1\frac{1}{4}\) hours`],
    ['⅔', String.raw`\(\frac{2}{3}\)`],
    ['1⁄8', String.raw`\(\frac{1}{8}\)`],
    ['The probability is 1/4.', String.raw`The probability is \(\frac{1}{4}\).`],
    ['< 1/2 & > 1/4', String.raw`&lt; \(\frac{1}{2}\) &amp; &gt; \(\frac{1}{4}\)`],
  ]) {
    const choice = contract.formatImportedMathChoices({ choices: [{ id: 'A', text }] }).choices[0];
    assert.equal(choice.html, expected);
    assert.equal(choice.text, text);
    for (const [, math] of choice.html.matchAll(/\\\((.*?)\\\)/g)) {
      assert.match(katex.renderToString(math, { throwOnError: true }), /mfrac/);
    }
  }
});

test('authored formulas, visuals, markup attributes, dates, URLs and non-fractions survive import', () => {
  const choices = [
    { text: '1/2', math: String.raw`\frac{1}{2}` },
    { text: '1/2', image: { src: '/exam-images/half.png', alt: '1/2' } },
    { text: '1/2', numberLine: { min: 0, max: 1 } },
    { text: String.raw`Already \(1\frac{1}{4}\), \[1/2\], $1/2$ and $$1/2$$.` },
    { text: '10/29/2026; https://example.com/1/2; 12.5; km/h; 1/0; 1/2/3; 1.5/2.5' },
    { text: '', html: '<img src="/exam-images/half.png" alt="1/2 > 1/4">' },
  ];
  assert.deepEqual(contract.formatImportedMathChoices({ choices }), { choices });
  const rich = contract.formatImportedMathChoices({ choices: [{ text: '1/2', html: '<span title="1/2">1/2</span><img src="/exam-images/half.png" alt="1/4">' }] });
  assert.equal(rich.choices[0].html, String.raw`<span title="1/2">\(\frac{1}{2}\)</span><img src="/exam-images/half.png" alt="1/4">`);
});

test('legacy Import Math JSON preview uses the same formatting before normalization', async () => {
  const source = await readFile(new URL('./content-studio.mjs', import.meta.url), 'utf8');
  const start = source.indexOf('async function previewMathImport(');
  const stop = source.indexOf('  const test = state.tests.find', start);
  const preview = vm.runInNewContext(source.slice(start, stop) + 'return question; } previewMathImport;', {
    documentImport: contract, requiredText: x => x, getState: async () => ({ assessments: [{ id: 'test' }] }),
    parseMathImportSource: JSON.parse, normalizeMathQuestion: x => x,
  });
  const result = await preview({ assessmentId: 'test', source: JSON.stringify({ question }) });
  assert.equal(result.choices[0].html, String.raw`The test will last \(1\frac{1}{4}\) hours.`);
});
