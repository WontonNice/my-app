import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { poemRichBlocks } from './poem-layout.js';
import contract from './document-import.cjs';
const require = createRequire(import.meta.url);
require(require.resolve('ts-node', { paths: [fileURLToPath(new URL('../server', import.meta.url))] })).register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { createPlainTextPassage, createSourcePassage } = require('../client/src/content/exams/formatters.ts');

test('JSON excerpt parts produce separate, escaped blocks and retain source lines and emphasis', () => {
  const parts = { introduction: 'Read these lines from the poem.', excerpt: 'First *source* line\nSecond source line\n\nA different stanza <script>alert(1)</script>', followUp: 'What do the lines convey?', bold: true };
  const formatted = contract.normalizeQuestionExcerpt({ id: 'q', promptParts: parts, correctChoiceId: 'C' });
  assert.match(formatted.promptHtml, /<blockquote><strong>First <em>source<\/em> line<br>Second source line<br><br>/);
  assert.match(formatted.promptHtml, /&lt;script&gt;/);
  assert.doesNotMatch(formatted.promptHtml, /<script>/);
  assert.equal(formatted.correctChoiceId, 'C');
  assert.equal(formatted.promptParts, undefined);
  assert.equal(contract.formatQuestionExcerpt({ ...parts, excerpt: '' }), null);
  assert.deepEqual(contract.normalizeQuestionExcerpt(formatted), formatted);
});

test('legacy Read prompts recover excerpt blocks without swallowing the question or inline emphasis', () => {
  const question = { prompt: 'Read lines 21–22 from the poem.\n**First quoted line**\n**Second quoted line**\nHow do these lines convey the point of view?' };
  const formatted = contract.normalizeQuestionExcerpt(question);
  assert.match(formatted.promptHtml, /<p>Read lines 21–22 from the poem\.<\/p><blockquote>/);
  assert.match(formatted.promptHtml, /First quoted line<\/strong><br><strong>Second quoted line/);
  assert.match(formatted.promptHtml, /<\/blockquote><p>How do these lines convey the point of view\?<\/p>$/);
  const rich = contract.normalizeQuestionExcerpt({promptHtml:'Read these sentences from paragraph 1.<br><strong>Source <em>italics</em> here.</strong><br>What do they suggest?'});
  assert.match(rich.promptHtml, /<em>italics<\/em>/);
  assert.match(rich.promptHtml, /<\/blockquote><p>What do they suggest/);
});

test('flattened excerpts require source evidence and restore actual poem line breaks', () => {
  const prompt = 'Read lines 5–8 from the poem. First quoted line, and the next line. The lines reveal the speaker’s curiosity.';
  assert.equal(contract.normalizeQuestionExcerpt({prompt}).promptHtml, undefined);
  const formatted = contract.normalizeQuestionExcerpt({prompt}, {format:'poem',text:'Other text.\n\nFirst quoted line,\nand the next line.\n\nMore text.'});
  assert.match(formatted.promptHtml, /First quoted line,<br>and the next line\./);
  assert.match(formatted.promptHtml, /<\/blockquote><p>The lines reveal/);
  const ordinary = {prompt:'What does “Read these sentences” suggest in the passage?'};
  assert.deepEqual(contract.normalizeQuestionExcerpt(ordinary), ordinary);
  const ambiguous = {prompt:'Read this sentence from paragraph 1. What is here? What is next?'};
  assert.deepEqual(contract.normalizeQuestionExcerpt(ambiguous, {text:'What is here? What is next?'}), ambiguous);
});

test('multi-line stanza blocks retain gaps and balanced emphasis in the player and editor', () => {
  const blocks = [{html:'<em>First line<br>Second line</em>'},{html:'Third line<br>Fourth line'}];
  const lines = poemRichBlocks(blocks);
  assert.deepEqual(lines.map(line=>line.text), ['First line','Second line','','Third line','Fourth line']);
  assert.equal(lines[0].html, '<em>First line</em>');
  assert.equal(lines[1].html, '<em>Second line</em>');
  assert.deepEqual(poemRichBlocks(lines), lines);
  const text='First line\nSecond line\n\nThird line\nFourth line';
  const richText='<div><em>First line<br>Second line</em></div><div>Third line<br>Fourth line</div>';
  for (const passage of [createPlainTextPassage({id:'poem', title:'Poem',text,richText}), createSourcePassage({id:'source-poem', title:'Poem',format:'poem',text,richText})]) {
    const body = passage.lines.filter(line=>!line.kind);
    assert.equal(body.filter(line=>line.text==='').length >= 1, true);
    assert.equal(body.findIndex(line=>line.text==='Third line')-body.findIndex(line=>line.text==='Second line'),2);
  }
});

test('one-div-per-line imports stay consecutive and source blank lines restore omitted spacer divs', () => {
  const blocks=['One','Two','Three','Four'].map(text=>({html:text}));
  assert.deepEqual(poemRichBlocks(blocks).map(line=>line.text), ['One','Two','Three','Four']);
  assert.deepEqual(poemRichBlocks(blocks,'One\nTwo\n\nThree\nFour').map(line=>line.text), ['One','Two','','Three','Four']);
  assert.deepEqual(poemRichBlocks([{html:'One<br><br>Two'}]).map(line=>line.text), ['One','','Two']);
});

test('pretty-printed poem HTML does not add rows or shift line numbers beside br tags', () => {
  const text='First line\nSecond line\n\nThird line\n    Indented last line';
  const richText='<div>First line<br>\nSecond <em>line</em>\n<br>\n<br>\nThird line<br>\n    Indented last line<br></div>';
  const expected=['First line','Second line','','Third line','    Indented last line'];
  const lines=poemRichBlocks([{html:richText.slice(5,-6)}],text);
  assert.deepEqual(lines.map(line=>line.text),expected);
  assert.equal(lines[1].html,'Second <em>line</em>');
  assert.equal(lines[4].html,'    Indented last line');
  assert.deepEqual(poemRichBlocks(lines,text),lines);
  for(const create of [createPlainTextPassage,createSourcePassage]){
    const passage=create({id:'pretty-printed-poem',title:'Poem',format:'poem',text,richText});
    const body=passage.lines.filter(line=>!line.kind);
    assert.deepEqual(body.filter(line=>line.text.trim()).map(line=>line.text),expected.filter(line=>line.trim()));
    assert.ok(body.every(line=>!/[\r\n]/.test(line.text)));
  }
});
