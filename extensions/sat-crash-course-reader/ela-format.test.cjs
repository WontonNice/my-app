const {test} = require('node:test');
const assert = require('node:assert/strict');
const importer = require('../../tools/sat-crash-course-import.cjs');
const block = html => ({html, text:importer.plain(html)});
const tex = value => `\\(\\text{${value}}\\)`;
const question = (number, passage) => ({number,total:50,passage,promptHtml:`Select the ${tex('best')} answer.`,choices:[{label:'A',html:tex('First'),isCorrect:true},{label:'B',html:'Second'}],correctAnswer:{label:'A'},explanationHtml:tex('Source explanation')});
const data = questions => ({source:{url:'https://tutor.thesatcrashcourse.com/tests/fixture'},testPreview:{module:'English Language Arts',testTitle:'Fixture',questions}});

test('legacy English export retains paragraph boundaries, metadata, trailing image, and source keys', async()=>{
  const blocks = [tex('Introduction.'),tex('Excerpt from &quot;A Title&quot;'),tex('by An Author'),`${tex('1')} First paragraph.`,`${tex('2')} Second paragraph.`].map(block);
  const passage = {id:'prose',formattedBlocks:blocks,html:`<p>${blocks.map(b=>b.html).join('\n')}<br><img src="https://example.com/figure.png" alt="Source figure"></p>`};
  const input = data([question(1,passage)]), original = structuredClone(input);
  const result = await importer.ela(input, async()=>({src:'/exam-images/figure.png'}));
  const p = result.passages[0];
  assert.equal(p.title,'Excerpt from "A Title"');
  assert.equal(p.byline,'by An Author');
  assert.equal(p.blurb,'Introduction.');
  assert.match(p.richText,/^<p>First paragraph\.<\/p><p>Second paragraph\.<\/p>/);
  assert.match(p.richText, /<p data-numbered="false"><img src="\/exam-images\/figure.png"/);
  assert.equal(p.questions[0].prompt,'Select the best answer.');
  assert.equal(p.questions[0].choices[0].html,'First');
  assert.equal(p.questions[0].correctChoiceId,'A');
  assert.equal(p.questions[0].explanationHtml,'Source explanation');
  assert.deepEqual(input,original,'conversion does not mutate the raw capture');
  assert.deepEqual(p.sourceRecord,passage);
});

test('legacy poem removes only the duplicated array and preserves stanzas and intentional repeated lines',async()=>{
  const array = '\\(\\begin{array}{cc} & \\text{First line} \\\\ & \\text{Last line} \\\\ & \\text{Last line}\\end{array}\\)';
  const blocks = [tex('Excerpt from &quot;A Poem&quot;'),tex('by Poet'),array,'First line','<br>','Last line','Last line'].map(block);
  const result=await importer.ela(data([question(1,{id:'poem',format:'poem',formattedBlocks:blocks,html:blocks.map(b=>`<p>${b.html}</p>`).join('')})]));
  assert.equal(result.passages[0].richText,'<p>First line</p><p><br></p><p>Last line</p><p>Last line</p>');
  assert.equal(result.passages[0].text,'First line\n\nLast line\nLast line');
  const fs=require('node:fs'),vm=require('node:vm');
  const layout=fs.readFileSync(require.resolve('../../tools/poem-layout.js'),'utf8').replace('export function poemRichBlocks','function poemRichBlocks');
  const render=vm.runInNewContext(`${layout}\npoemRichBlocks;`);
  const poem=result.passages[0];
  const rendered=render([...poem.richText.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match=>({html:match[1]})),poem.text);
  assert.deepEqual(Array.from(rendered,line=>line.text),['First line','','Last line','Last line'],'student/editor renderer receives exactly one stanza spacer');
  blocks[2]=block(array.replace('First line','Different line'));
  const different=await importer.ela(data([question(1,{id:'poem',format:'poem',formattedBlocks:blocks})]));
  assert.match(different.passages[0].richText,/\\begin\{array\}/,'never drop a table unless its verse matches');
});

test('structured passages retain tables, inline image position, links, and real math',async()=>{
  const html='<p>Before <img src="https://example.com/a.png"> after \\(x^2\\).</p><table><tr><td><a href="https://example.com">Data</a></td></tr></table>';
  const result=await importer.ela(data([question(1,{id:'table',html,formattedBlocks:[block('Before after')]})]),async()=>({src:'/exam-images/a.png'}));
  assert.equal(result.passages[0].richText,html.replace('https://example.com/a.png','/exam-images/a.png'));
});
