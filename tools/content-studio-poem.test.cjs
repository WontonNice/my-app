const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { load } = require('cheerio');

// DOM operations only; the parsing, numbering, indentation, and markup below
// execute the actual editor functions used by both its canvas and iframe.
function wrap($, node) {
  return {
    get nodeType() { return node.type === 'text' ? 3 : 1; },
    get tagName() { return node.name?.toUpperCase(); },
    get childNodes() { return (node.children || []).map(child => wrap($, child)); },
    get innerHTML() { return $(node).html() || ''; },
    set innerHTML(value) { $(node).html(value); },
    get outerHTML() { return $.html(node); },
    get textContent() { return $(node).text(); },
    get dataset() { return Object.fromEntries(Object.entries(node.attribs || {}).filter(([key])=>key.startsWith('data-')).map(([key,value])=>[key.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase()),value])); },
    classList: { contains: name => (node.attribs?.class || '').split(/\s+/).includes(name) },
  };
}
const document = { createElement() { const $ = load('<div></div>', null, false); return wrap($, $('div')[0]); } };
const html = fs.readFileSync(path.join(__dirname, 'content-studio.html'), 'utf8');
const escape = html.slice(html.indexOf('const escapeHtml ='), html.indexOf('const slugFromTitle ='));
const renderer = html.slice(html.indexOf('function richBlocksFromPassage('), html.indexOf('function studentQuestionMarkup('));
const poem = fs.readFileSync(path.join(__dirname, 'poem-layout.js'), 'utf8').replace('export function poemRichBlocks', 'function poemRichBlocks');
const context = { document, Node: { ELEMENT_NODE: 1, TEXT_NODE: 3 }, location: { origin: 'http://fixture.invalid' } };
vm.runInNewContext(`${poem}\nconst app={poemRichBlocks};\n${escape}\n${renderer}\nthis.render=studentPassageMarkup;`, context);

function rows(passage, authoring) {
  const $ = load(context.render(passage, authoring), null, false);
  return $('p.exam-poem-line').toArray().filter(node=>$(node).children('span').length === 2).map(node=>({
    number: $(node).children('span').first().text(),
    text: $(node).children('span').last().text(),
    contentHtml: $(node).children('span').last().html(),
    indented: $(node).hasClass('is-indented'),
    context: $(node).hasClass('is-context'),
    authorBlock: $(node).attr('data-author-block'),
  }));
}

test('editor canvas and Student preview number only explicit Serpent Mound verse and preserve source indentation', () => {
  const verse = [
    'Brush Creek stood low when the museum men came',
    'with their measuring tapes and sketchbooks.',
    '&nbsp; &nbsp; It was winter. Fringed with ice,',
    '&nbsp; &nbsp; the creek doubled back on itself',
    'as if it had forgotten something.',
    '&nbsp; &nbsp; Pa was in Cincinnati, or else on his way home,',
    '&nbsp; &nbsp; &nbsp; &nbsp; so Ma told me to lead the men',
    '&nbsp; &nbsp; &nbsp; &nbsp; into the marshy low grounds. It being winter,',
    '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; there was little underbrush to speak of—',
    '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; in the summer there would have been',
  ];
  const richText = '<p><em>The Great Serpent Mound, located in Adams County, Ohio, is a human-made mound of earth.</em></p><p>Ohio, 1846</p>' + verse.map(line=>`<div data-poetry-line="true">${line}</div>`).join(' ');
  const passage = { title: 'Serpent Mound', format: 'poem', text: '', richText, lineNumberInterval: 5 };
  for (const authoring of [false, true]) {
    const result = rows(passage, authoring);
    assert.deepEqual(result.filter(row=>row.number).map(({number,text})=>[number,text.trim()]), [['5','as if it had forgotten something.'],['10','in the summer there would have been']]);
    for (const text of ['The Great Serpent Mound', 'Ohio, 1846']) {
      const row = result.find(row=>row.text.includes(text));
      assert.equal(row.number, ''); assert.equal(row.indented, false);
      assert.equal(row.context, true, 'Non-verse notes must wrap as prose, not use the verse grid');
    }
    const eight = result.find(row=>row.text.includes('into the marshy low grounds'));
    const ten = result.find(row=>row.text.includes('in the summer there would have been'));
    assert.equal(eight.text.match(/^\s*/)[0].length, 8);
    assert.equal(ten.text.match(/^\s*/)[0].length, 14);
    assert.equal(eight.indented, false, 'source spaces must not collapse into a generic indent class');
    assert.equal(authoring ? Boolean(eight.authorBlock) : eight.authorBlock === undefined, true);
  }
});

test('legacy poems still count verse, while explicit non-numbered notes and headings do not shift labels', () => {
  const passage = { title: 'Fixture', format: 'poem', text: '', lineNumberInterval: 2, richText: '<p data-numbered="false"><em>Unnumbered note.</em></p><h2>Section</h2><div>One</div><div>Two</div><div>Three</div><div>Four</div>' };
  for (const authoring of [false, true]) assert.deepEqual(rows(passage, authoring).filter(row=>row.number).map(({number,text})=>[number,text]), [['2','Two'],['4','Four']]);
});

test('TestNav Snowy Mountains keeps 26 consecutive verse lines and exactly two stanza gaps', () => {
  const source = fs.readFileSync(path.join(__dirname, '../client/src/content/exams/passageSets/snowy-mountains-2026-2027-form-a.ts'), 'utf8');
  const richText = JSON.parse(source.match(/richText: ("(?:[^"\\]|\\.)*")/)[1]);
  const text = JSON.parse(source.match(/PassageText = ("(?:[^"\\]|\\.)*")/)[1]);
  for (const authoring of [false, true]) {
    const result = rows({ title: 'Snowy Mountains', format: 'poem', text, richText }, authoring);
    // The renderer's hidden header spacer is not part of the poem body.
    while (result[0] && !result[0].text) result.shift();
    assert.deepEqual(result.map(row => row.text), text.split('\n'));
    assert.equal(result.filter(row => !row.text).length, 2);
    assert.deepEqual(result.filter(row => row.number).map(row => row.number), ['5','10','15','20','25']);
  }
});

test('Smallest Spark editor and preview place the complete blurb before the title', () => {
 const source=fs.readFileSync(path.join(__dirname,'../client/src/content/exams/passageSets/looking-for-the-smallest-spark-of-everything-2026-2027-form-b.ts'),'utf8');
 const field=name=>JSON.parse(source.match(new RegExp(name+': ("(?:[^"\\\\]|\\\\.)*")'))[1]);
 const passage={title:'Looking for the Smallest Spark of Everything',format:'poem',blurb:field('blurb'),blurbHtml:field('blurbHtml'),richText:field('richText'),text:''};
 for(const authoring of [false,true]) {
  const $=load(context.render(passage,authoring),null,false),lines=$('.exam-poem-line');
  assert.equal(lines.first().hasClass('is-intro'),true);
  assert.match(lines.first().text(),/Located underground near Geneva/);
  assert.equal(lines.eq(1).hasClass('is-title'),true);
  assert.equal($.root().text().split('Located underground near Geneva').length-1,1,'No duplicate blurb in verse body');
 }
});
