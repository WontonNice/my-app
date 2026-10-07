const { test } = require('node:test');
const assert = require('node:assert/strict');
const { read, unitForUrl, topics } = require('./reader.js');
const fs = require('node:fs');

// Synthetic fixtures mirror observed visible DOM. No account state, network calls, or source-site progress.
function fixture({ revealed = true, selected = 'C', conflict = false, passageHidden = false } = {}) {
  class Element {
    constructor(text = '', children = {}, tagName = 'DIV') { this.innerText = text; this.children = []; this.selectors = children; this.tagName = tagName; }
    querySelector(selector) { return this.selectors[selector] ?? null; }
    querySelectorAll(selector) { return this.selectors[selector] ?? []; }
    getClientRects() { return this.hidden ? [] : [{}]; }
    closest(selector) { return selector.includes('rounded-2xl') ? this.card : null; }
    getAttribute() { return null; }
  }
  const prompt = new Element('What is the theme?');
  const buttons = ['A','B','C','D'].map(id => new Element(`${id}\nChoice ${id}${revealed && id === 'A' ? '\n✓ Correct answer' : id === selected ? '\n✗ Your answer' : ''}`, { '.math-text': new Element(`Choice ${id}`) }, 'BUTTON'));
  const group = new Element(); group.children = buttons; group.previousElementSibling = new Element('', { 'p .math-text': prompt });
  const passage = new Element(); passage.children = [new Element('First paragraph.'), new Element('Second paragraph.')]; passage.hidden = passageHidden;
  const heading = new Element('Step-by-step solution'); heading.card = new Element('Step-by-step solution\n1\nA fits the theme.');
  const main = new Element('', { 'div[class*="space-y-2"]': [group], '.prose': [passage] });
  const doc = { querySelector: () => main, querySelectorAll: selector => selector === 'header p' ? [new Element('Central Idea & Theme')] : selector === 'p' && revealed ? [new Element(`Correct Answer: ${conflict ? 'B' : 'A'}) Choice`)] : selector === 'h3' && revealed ? [heading] : selector === 'header button' ? [new Element('hard')] : [] };
  return doc;
}
test('wrong selected answer C never replaces explicitly revealed correct A', () => {
  const q = read(fixture(), 'https://www.shsatlab.com/units/unit-1/practice?src=topics');
  assert.equal(q.correctChoiceId, 'A'); assert.equal(q.choices[2].id, 'C'); assert.equal(q.difficulty, 'hard'); assert.equal(q.passage.text, 'First paragraph.\n\nSecond paragraph.'); assert.match(q.explanation, /A fits/);
});
test('unanswered source remains unkeyed; no solution or answer invented', () => {
  const q = read(fixture({ revealed: false }), 'https://www.shsatlab.com/units/unit-1/practice'); assert.equal(q.correctChoiceId, ''); assert.equal(q.explanation, ''); assert.ok(q.reviewNotes.length >= 2);
});
test('Math and unknown pages rejected before any DOM inspection', () => {
  const doc = { querySelector() { throw new Error('Must not read Math DOM'); } };
  for (const url of ['https://www.shsatlab.com/units/unit-17/practice', 'https://www.shsatlab.com/math', 'https://other.com/units/unit-1/practice']) { assert.equal(unitForUrl(url), null); assert.throws(() => read(doc, url), /ELA practice/); }
  assert.equal(topics.length, 16);
});
test('conflicting visible key, collapsed reading passage fail safely', () => {
  assert.throws(() => read(fixture({ conflict: true }), 'https://www.shsatlab.com/units/unit-1/practice'), /disagree/);
  assert.throws(() => read(fixture({ passageHidden: true }), 'https://www.shsatlab.com/units/unit-1/practice'), /collapsed/);
});
test('conflicting multiple visible summary keys cannot bypass the explicit-marker check', () => {
  const doc = fixture(); const original = doc.querySelectorAll;
  const summary = value => ({ innerText: value, getClientRects: () => [{}], closest: () => null });
  doc.querySelectorAll = selector => selector === 'p' ? [summary('Correct Answer: A) Choice A'), summary('Correct Answer: B) Choice B')] : original(selector);
  assert.throws(() => read(doc, 'https://www.shsatlab.com/units/unit-1/practice'), /disagree/);
});
test('reader stays read-only and extension retains minimal permissions with no private-state access', () => {
  const manifest = JSON.parse(fs.readFileSync(`${__dirname}/manifest.json`)); assert.deepEqual(manifest.permissions, ['activeTab', 'storage']);
  const reader = fs.readFileSync(`${__dirname}/reader.js`, 'utf8');
  assert.doesNotMatch(reader, /\.click\(/);
  const code = ['content.js', 'reader.js', 'automation.js', 'queue.js'].map(file => fs.readFileSync(`${__dirname}/${file}`, 'utf8')).join('\n');
  assert.doesNotMatch(code, /fetch\(|localStorage|document\.cookie|__NEXT_DATA__|reactFiber|history\.(?:pushState|replaceState)|location\.(?:assign|replace)/);
  assert.deepEqual(manifest.content_scripts[0].js, ['reader.js', 'queue.js', 'automation.js', 'content.js']);
});
