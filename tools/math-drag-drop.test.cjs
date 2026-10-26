const { test } = require('node:test');
const assert = require('node:assert/strict');
const { moveMathDragAnswer } = require('../client/src/lib/mathDragDrop.ts');
const question = { items: [{ id: '2' }, { id: '3' }], dragDropSlots: [{ id: 'first' }, { id: 'second' }, { id: 'third' }] };

test('tiles move between empty boxes and return to the bank without changing other answers', () => {
  const original = { first: '2', second: '3' };
  const moved = moveMathDragAnswer(question, original, { itemId: '2', slotId: 'first' }, 'third');
  assert.deepEqual(moved, { second: '3', third: '2' });
  assert.deepEqual(moveMathDragAnswer(question, moved, { itemId: '2', slotId: 'third' }), { second: '3' });
  assert.deepEqual(original, { first: '2', second: '3' });
});

test('occupied boxes, stale drags, and unknown items or targets cannot overwrite answers', () => {
  const original = { first: '2', second: '3' };
  for (const [selection, target] of [[{ itemId: '2', slotId: 'first' }, 'second'], [{ itemId: '3', slotId: 'first' }, 'third'], [{ itemId: 'foreign' }, 'third'], [{ itemId: '2' }, 'missing'], [{ itemId: '2' }, undefined]]) {
    assert.equal(moveMathDragAnswer(question, original, selection, target), original);
  }
});

test('reusable answers move and return only the chosen copy; single-use tiles cannot duplicate', () => {
  const original = { first: '2', second: '2' };
  assert.deepEqual(moveMathDragAnswer({ ...question, allowReuse: true }, original, { itemId: '2', slotId: 'first' }, 'third'), { second: '2', third: '2' });
  assert.deepEqual(moveMathDragAnswer({ ...question, allowReuse: true }, original, { itemId: '2', slotId: 'first' }), { second: '2' });
  assert.deepEqual(moveMathDragAnswer({ ...question, allowReuse: true }, { first: '2' }, { itemId: '2' }, 'second'), original);
  assert.deepEqual(moveMathDragAnswer(question, { first: '2' }, { itemId: '2' }, 'second'), { second: '2' });
});
