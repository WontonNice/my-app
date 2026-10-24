const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const model = require('./content-studio-bank.js');
const filters = { subject: 'English', source: 'SHSAT Lab', section: '', topic: '', difficulty: '', status: '', search: '' };
const q = (id, extra = {}) => ({ id, subject: 'English', source: 'SHSAT Lab', status: 'published', prompt: `Question ${id}`, section: 'reading', topic: 'Inference', difficulty: 'medium', correctChoiceId: 'A', explanation: 'Supported by the text.', visuals: [], ...extra });
test('bank view shows published items by default; hidden items have a clear filter recovery message', () => {
  const bank = { questions: [q('one'), q('two'), q('three')] };
  assert.equal(model.matching(bank, filters).length, 3);
  assert.equal(model.matching(bank, { ...filters, status: 'draft' }).length, 0);
  assert.match(model.emptyMessage(bank, 'English'), /3 questions are still stored/); assert.match(model.emptyMessage(bank, 'English'), /Show all questions/);
  assert.match(model.emptyMessage({ questions: [] }, 'English'), /No questions have been imported/);
  assert.match(model.emptyMessage(bank, 'Math'), /separate Math pipeline/);
});
test('bulk candidates compose every current filter and include items beyond 50 visible rows', () => {
  const bank = { questions: Array.from({ length: 120 }, (_, i) => q(`${i}`, { status: 'draft' })) };
  bank.questions.push(q('other-topic', { status: 'draft', topic: 'Evidence & Support' }), q('other-subject', { subject: 'Math', status: 'draft' }));
  const candidates = model.matching(bank, { ...filters, topic: 'Inference', status: 'draft', section: 'reading', difficulty: 'medium', search: 'Question' });
  assert.equal(candidates.length, 120); assert.equal(candidates[119].id, '119');
  assert.equal(model.matching(bank, { ...filters, source: 'Other' }).length, 0);
});
test('bulk preview identifies incomplete keys, explanations, levels and required visuals without inventing answers', () => {
  assert.equal(model.publishIssue(q('ready')), '');
  for (const extra of [{ correctChoiceId: '' }, { explanation: ' ' }, { difficulty: 'unknown' }]) assert.match(model.publishIssue(q('incomplete', extra)), /key, explanation, and difficulty/);
  assert.match(model.publishIssue(q('visual', { visuals: ['Figure'] })), /upload/);
  assert.equal(model.publishIssue(q('visual', { visuals: ['Figure'], visualImage: { src: '/exam-images/figure.png', alt: 'Figure' } })), '');
});
test('desktop bank has its own scroll area and imports stop silently hiding published questions', () => {
  const css = fs.readFileSync(`${__dirname}/content-studio-bank.css`, 'utf8');
  assert.match(css, /#question-bank-view\s*\{\s*overflow:auto/);
  const js = fs.readFileSync(`${__dirname}/content-studio-bank.js`, 'utf8');
  const importCode = js.slice(js.indexOf('$("bank-import").onclick'), js.indexOf('$("bank-publish-all").onclick'));
  assert.match(importCode, /showAll\(\)/); assert.match(importCode, /\.open = false/); assert.doesNotMatch(importCode, /value = "draft"/);
  assert.match(js, /I reviewed every listed draft against its source/); assert.match(js, /questionIds: \[\.\.\.publishIds\]/);
});

test('practice selection balances topics, excludes drafts and returns exactly the requested unique count', () => {
  const candidates = [...Array.from({ length: 8 }, (_, i) => q(`evidence-${i}`, { topic: 'Evidence & Support' })), ...Array.from({ length: 2 }, (_, i) => q(`inference-${i}`)), q('draft', { status: 'draft' })];
  const picked = model.selectQuestions(candidates, 6, true, () => .4);
  assert.equal(picked.length, 6); assert.equal(new Set(picked.map(q => q.id)).size, 6); assert.ok(picked.every(q => q.status === 'published')); assert.equal(picked.filter(q => q.topic === 'Inference').length, 2);
  assert.equal(model.selectQuestions(candidates, 5, false, () => .4).length, 5);
  assert.throws(() => model.selectQuestions(candidates, 11), /Only 10/); assert.throws(() => model.selectQuestions(candidates, 0), /1.100/);
  assert.equal(model.suggestedTitle(picked), 'Mixed ELA · 6-question practice'); assert.equal(model.suggestedTitle([q('one')]), 'Inference · 1-question practice');
});
