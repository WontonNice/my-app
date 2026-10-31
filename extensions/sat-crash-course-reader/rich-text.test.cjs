const { test } = require('node:test');
const assert = require('node:assert/strict');
const rich = require('./rich-text.js');
function el(tag, children = [], classes = [], style = {}) {
  const node = { nodeType: 1, tagName: tag.toUpperCase(), childNodes: children.map(value => typeof value === 'string' ? { nodeType: 3, textContent: value } : value), classList: { contains: name => classes.includes(name) }, style, querySelector: () => null };
  Object.defineProperty(node, 'children', { get: () => node.childNodes.filter(child => child.nodeType === 1) });
  Object.defineProperty(node, 'textContent', { get: () => node.childNodes.map(child => child.textContent).join('') });
  node.querySelectorAll = selector => node.children.flatMap(child => [...(child.classList.contains(selector.slice(1)) ? [child] : []), ...child.querySelectorAll(selector)]);
  node.querySelector = selector => node.querySelectorAll(selector)[0] || null;
  node.childNodes.forEach(child => { child.parentElement = node; }); return node;
}
const style = node => node.style || {};
test('real KaTeX prose preserves emphasis without exposing math markup', () => {
  const { parse } = require('./dom-fixture.cjs');
  const katex = require('katex');
  const source = parse(`<p>${katex.renderToString('\\textbf{A title}', {output:'html'})} ${katex.renderToString('\\textit{by An Author}', {output:'html'})}</p>`);
  const html = rich.fromElement(source, style);
  assert.match(html, /<strong>A title<\/strong>/);
  assert.match(html, /<em>by An Author<\/em>/);
  assert.doesNotMatch(html, /\\\(|\\text/);
  assert.equal(rich.proseHtml('Before \\(\\text{some prose}\\) after'), 'Before some prose after');
  assert.equal(rich.proseHtml('\\(x + \\text{units}\\)'), '\\(x + \\text{units}\\)');
});

test('real KaTeX poem table is omitted from metadata and each verse is captured once', () => {
  const { parse } = require('./dom-fixture.cjs');
  const katex = require('katex');
  const verse = ['First verse', 'Second verse', 'Third verse', 'Fourth verse', 'Fifth verse', 'Sixth verse'];
  const tex = `\\begin{array}{rl}${verse.map((line,i) => `${i === 2 ? 3 : i === 5 ? 6 : ''} & \\text{${line}}`).join(' \\\\ ')}\\end{array}`;
  const source = parse(`<p>Title<br>by Author<br>${katex.renderToString(tex,{output:'html'})}</p>`);
  const result = rich.passage(source, style);
  assert.equal(result.format, 'poem');
  assert.deepEqual(result.formattedBlocks.map(b=>b.text), ['Title','by Author',...verse]);
  assert.doesNotMatch(result.text, /\\begin|\\text/);
});
test('HTML-only source math preserves fractions and exponents in helper prompts', () => {
  const {parse} = require('./dom-fixture.cjs');
  const katex = require('katex');
  const node = parse(`<p>Evaluate ${katex.renderToString('\\frac{2}{3}+x^2',{output:'html'})}.</p>`);
  const html = rich.fromElement(node, style);
  assert.match(html,/\\frac\{2\}\{3\}/);
  assert.match(html,/x\^\{2\}/);
  assert.doesNotMatch(html,/32|<input/);
});
test('preserves semantic and computed emphasis while dropping attributes and executable content', () => {
  const node = el('div', ['A ', el('strong', ['bold']), ' and ', el('em', ['italic']), ' plus ', el('span', ['styled'], [], { fontWeight: '700', fontStyle: 'italic' }), el('script', ['alert(1)']), ' <&>']);
  assert.equal(rich.fromElement(node, style), '<p>A <strong>bold</strong> and <em>italic</em> plus <em><strong>styled</strong></em> &lt;&amp;&gt;</p>');
});
test('source KaTeX text styling and paragraph markers become ordinary editable HTML', () => {
  const node = el('div', [el('span', ['Title'], ['textbf']), el('span', [], ['newline']), el('span', ['by Author']), el('span', ['1'], ['shsat-paragraph']), 'First ', el('span', ['emphasis'], ['textit']), el('span', ['2'], ['shsat-paragraph']), 'Second paragraph.']);
  const blocks = rich.blocks(node, style);
  assert.deepEqual(blocks.map(block => block.text), ['Title', 'by Author', 'First emphasis', 'Second paragraph.']);
  assert.equal(blocks[0].html, '<strong>Title</strong>'); assert.equal(blocks[2].html, 'First <em>emphasis</em>');
});
test('math annotations keep LaTeX without duplicate rendered or MathML text', () => {
  const node = el('span', ['duplicate rendered math'], ['katex']);
  node.querySelector = () => ({ textContent: '\\frac{1}{2}' });
  assert.equal(rich.fromElement(node, style), '\\(\\frac{1}{2}\\)');
});

test('column-based KaTeX poems keep verse rows and stanza spacing without copying the number column', () => {
  const verse = ['First line', 'Second line', 'Third line', 'Fourth line', 'Fifth line', 'Sixth line'];
  const table = el('span', [
    el('span', [el('span', [el('span', ['3']), el('span', ['6'])], ['vlist'])], ['col-align-r']),
    el('span', [el('span', verse.map((line, i) => el('span', [i === 4 ? el('em', [line]) : line], [], { top: `${i * 1.2 + (i >= 3 ? 1.2 : 0)}em` })), ['vlist'])], ['col-align-l']),
  ], ['mtable']);
  const source = el('p', ['Poem title', el('span', [], ['newline']), 'by Author', table]);
  const result = rich.passage(source, style);
  assert.equal(result.format, 'poem');
  assert.deepEqual(result.formattedBlocks.map(block => block.text), ['Poem title', 'by Author', ...verse.slice(0, 3), '', ...verse.slice(3)]);
  assert.equal(result.formattedBlocks[7].html, '<em>Fifth line</em>');
  assert.equal(result.text, `Poem title\nby Author\n${verse.slice(0, 3).join('\n')}\n\n${verse.slice(3).join('\n')}`);
  assert.doesNotMatch(result.text, /^3$|^6$/m);
  table.children[0].children[0].childNodes = [el('span', ['x']), el('span', ['y'])];
  assert.equal(rich.passage(source, style).format, undefined, 'ordinary math tables are not treated as poetry');
});
