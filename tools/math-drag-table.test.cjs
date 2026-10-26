const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseMathDragTable } = require('../client/src/lib/mathDragTable.ts');

test('shipping cost table keeps its caption, columns, and original answer slots', () => {
  const table = parseMathDragTable(['SHIPPING COSTS', 'Total Weight (pounds) | Total Cost to Ship (dollars)', '2 | {{slot-1}}', '{{slot-2}} | 2.50', '6 | {{slot-3}}', '{{slot-4}} | 5.50']);
  assert.equal(table.caption, 'SHIPPING COSTS');
  assert.equal(table.headers.length, 2);
  assert.deepEqual(table.rows, [['2', '{{slot-1}}'], ['{{slot-2}}', '2.50'], ['6', '{{slot-3}}'], ['{{slot-4}}', '5.50']]);
});

test('tables can omit captions; ordinary expressions and inconsistent rows stay unchanged', () => {
  assert.equal(parseMathDragTable(['Weight | Cost', '2 | {{slot-1}}']).caption, undefined);
  for (const lines of [undefined, [], ['x + {{slot-1}} = 3'], ['|x| = {{slot-1}}'], ['Title', 'A | B', '{{slot-1}}'], ['Title', 'A | B', '1 | 2']]) {
    assert.equal(parseMathDragTable(lines), null);
  }
});
