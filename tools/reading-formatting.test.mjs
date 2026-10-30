import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { poemRichBlocks } from './poem-layout.js';
import contract from './document-import.cjs';
const require = createRequire(import.meta.url);
require(require.resolve('ts-node', { paths: [fileURLToPath(new URL('../server', import.meta.url))] })).register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { createPlainTextPassage, createSourcePassage } = require('../client/src/content/exams/formatters.ts');

test('imports preserve source emphasis in passages, ordinary questions, directions, stimuli and choices', () => {
  const source = { passage: { title: 'Styled', text: 'A styled paragraph.', richText: '<p>A <span style="font-weight:700;font-style:italic;text-decoration:underline line-through">styled</span> paragraph.</p>', questions: [{
    id:'styled-1', type:'multiple_choice', prompt:'Which best describes it?', promptHtml:'Which <span style="font-weight: bold">best</span> describes it?',
    instructions:'Select one.', instructionsHtml:'Select <em>one</em>.', stimulus:'H2O', stimulusHtml:'H<span style="vertical-align:sub">2</span>O',
    choices:[{id:'E',text:'First answer',html:'<strong>First <em><u>answer</u></em></strong>'},{id:'F',text:'Second answer',html:'<span style="font-style:italic">Second</span> answer'}],correctChoiceId:'F',
  }] } };
  const imported = contract.parse(source)[0].content;
  assert.match(imported.richText, /<strong><em><u><s>styled<\/s><\/u><\/em><\/strong>/);
  const q = imported.questions[0];
  assert.match(q.promptHtml, /<strong>best<\/strong>/);
  assert.equal(q.instructionsHtml, 'Select <em>one</em>.');
  assert.match(q.stimulusHtml, /<sub>2<\/sub>/);
  assert.equal(q.choices[0].html, source.passage.questions[0].choices[0].html);
  assert.match(q.choices[1].html, /<em>Second<\/em>/);
  assert.equal(q.correctChoiceId, 'B');
  assert.deepEqual(contract.normalizeTextFormatting(imported), JSON.parse(JSON.stringify(imported)), 'Reloading never duplicates style wrappers; absent optional fields follow JSON serialization');
  assert.match(createSourcePassage({...imported,id:'styled'}).lines.find(line=>line.text.includes('styled')).html, /<strong>/);
  assert.equal(source.passage.questions[0].promptHtml.includes('style='), true, 'Input is not mutated');
  const plain = contract.parse({ passage:{title:'Plain',text:'Plain source.',questions:[{id:'plain-1',prompt:'Which best describes it?',type:'short_response'}]} })[0].content;
  assert.equal(plain.questions[0].promptHtml, undefined, 'Plain wording never invents emphasis');
  const marked = contract.normalizeTextFormatting({questions:[{prompt:'Which **best** describes *this*?',choices:[{text:'**Bold** answer'}]}]});
  assert.equal(marked.questions[0].prompt, 'Which best describes this?');
  assert.match(marked.questions[0].promptHtml, /<strong>best<\/strong>/);
  assert.match(marked.questions[0].choices[0].html, /<strong>Bold<\/strong>/);
  assert.equal(contract.normalizeTextFormatting({questions:[{prompt:'2 * 3 * 4'}]}).questions[0].promptHtml, undefined);
});

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

test('sentence-insertion imports retain separately supplied instructions and stimulus in source order', () => {
  const sentence = 'Some note that several states have made their community or state colleges low-cost or free for students with limited resources.';
  const followUp = 'Where should the sentence be added to best support the ideas in the second paragraph (sentences 4–7)?';
  const question = { id: 'college-6', type: 'multiple_choice', instructions: 'Read this sentence.', instructionsHtml: 'Read this sentence.', stimulus: sentence, prompt: followUp, promptHtml: `<p>${followUp}</p>`, choices: [{ id: 'E', text: 'before sentence 4' }, { id: 'F', text: 'between sentences 4 and 5' }], correctChoiceId: 'F' };
  const normalized = contract.normalizeQuestionExcerpt(question);
  assert.equal(normalized.prompt, `Read this sentence.\n\n${sentence}\n\n${followUp}`);
  assert.equal(normalized.promptHtml, `<p>Read this sentence.</p><blockquote>${sentence}</blockquote><p>${followUp}</p>`);
  for (const field of ['instructions', 'instructionsHtml', 'stimulus', 'stimulusHtml']) assert.equal(normalized[field], undefined);
  assert.deepEqual(contract.normalizeQuestionExcerpt(normalized), normalized);
  const imported = contract.parse({ passage: { title: 'College', text: 'Source passage.', questions: [question] } })[0].content.questions[0];
  assert.equal(imported.promptHtml, normalized.promptHtml);
  assert.equal(imported.correctChoiceId, 'B');
  assert.equal(question.stimulus, sentence, 'the original input is not mutated');
  const incomplete = { ...question, stimulus: '' };
  assert.deepEqual(contract.normalizeQuestionExcerpt(incomplete), incomplete);
  const unrelated = { ...question, instructions: 'Select one answer.', instructionsHtml: 'Select one answer.' };
  assert.deepEqual(contract.normalizeQuestionExcerpt(unrelated), unrelated);
});

test('split rich excerpts keep their markup and explicitly boxed source excerpts survive round trips', () => {
  const normalized = contract.normalizeQuestionExcerpt({ instructionsHtml: '<p>Read this sentence.</p>', stimulusHtml: '<p>Keep <u>this</u> <em>exact</em> wording.</p>', promptHtml: '<p>Where should it go to <strong>best</strong> support the paragraph?</p>' });
  assert.match(normalized.promptHtml, /<blockquote><p>Keep <u>this<\/u> <em>exact<\/em> wording\.<\/p><\/blockquote>/);
  const parts = { introduction: 'Read this sentence.', excerpt: 'The new sentence.', followUp: 'Where should it go?', bold: false, boxed: true };
  const boxed = contract.formatQuestionExcerpt(parts);
  assert.match(boxed.promptHtml, /<blockquote data-boxed="true">The new sentence\.<\/blockquote>/);
  assert.deepEqual(contract.readQuestionExcerpt(boxed), parts);
  assert.deepEqual(contract.normalizeQuestionExcerpt(boxed), boxed);
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
