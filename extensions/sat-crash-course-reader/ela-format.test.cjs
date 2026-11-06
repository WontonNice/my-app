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

test('a credited title needs no byline, and isolated currency imports as ordinary prose',async()=>{
  const blocks=['<em>Adapted from two collection histories</em>','From a Small Shelf to a Giant Collection: The Library of Congress',String.raw`Congress approved \(\$\)5,000; compare \(5x + 2\).`].map(block);
  const source={id:'library',formattedBlocks:blocks,html:blocks.map(b=>'<p>'+b.html+'</p>').join('')};
  const [p]=(await importer.ela(data([question(1,source)]))).passages;
  assert.equal(p.title,blocks[1].text);assert.equal(p.byline,'');assert.equal(p.blurb,blocks[0].text);
  assert.equal(p.richText,String.raw`<p>Congress approved $5,000; compare \(5x + 2\).</p>`);
});

test('a poem title without an Excerpt prefix is separated without losing its stanzas',async()=>{
  const blocks=['<em>A poet’s introduction.</em>','&quot;A Bird came down the Walk&quot;','by Emily Dickinson','Opening line','<br>','Second stanza'].map(block);
  const [p]=(await importer.ela(data([question(1,{id:'poem',format:'poem',formattedBlocks:blocks})]))).passages;
  assert.equal(p.title,'"A Bird came down the Walk"');assert.equal(p.author,'Emily Dickinson');assert.equal(p.text,'Opening line\n\nSecond stanza');
});

test('multiple source annotation layers target exact occurrences and import idempotently',async()=>{
  const rich=require('./rich-text.js');
  const p={id:'jazz',formattedBlocks:[block('a syncopated rhythm'),block('a second syncopated rhythm and <em>scat</em>')],html:'<p>a syncopated rhythm</p><p>a second syncopated rhythm and <em>scat</em></p>',glossaryTerms:['syncopated','scat']};
  const glossary=[{term:'syncopated',definition:'Rhythm definition',occurrence:1},{term:'scat',definition:'Singing definition',occurrence:0}];
  const enriched=rich.applyGlossary(p,glossary);
  const result=(await importer.ela(data([question(1,enriched)]))).passages[0];
  assert.ok(result.richText.startsWith('<p>a syncopated rhythm</p>'));
  assert.equal((result.richText.match(/data-glossary-definition=/g)||[]).length,2);
  assert.match(result.richText,/<em><span data-glossary-definition="Singing definition"/);
  assert.deepEqual(result.review.warnings,[]);
});
