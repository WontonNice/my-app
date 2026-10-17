const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { handleNumericBeforeInput, insertNumericNegative } = require('../../client/src/lib/mathEntryInput.ts');

// Model the public MathLive editing contract, including separate fraction groups.
function numericField(groups, activeGroup = 0, position = groups[activeGroup].length, range) {
  let group = groups[activeGroup];
  const groupStart = groups.slice(0, activeGroup).reduce((sum, value) => sum + value.length + 1, 0);
  let selection = { ranges: [range || [groupStart + position, groupStart + position]], direction: 'forward' };
  let inserts = 0;
  return {
    get selection() { return selection; },
    set selection(value) { selection = value; },
    get position() { return selection.ranges[0][1]; },
    set position(value) { selection = { ranges: [[value, value]], direction: 'forward' }; },
    executeCommand(command) {
      assert.equal(command, 'moveToGroupStart');
      if (this.position === groupStart) return;
      selection = { ranges: [[groupStart, groupStart]], direction: 'forward' };
    },
    getValue(from, to, format) {
      assert.equal(format, 'latex');
      return group.slice(from - groupStart, to - groupStart);
    },
    insert(text) {
      inserts++;
      const [from, to] = selection.ranges[0];
      group = group.slice(0, Math.min(from, to) - groupStart) + text + group.slice(Math.max(from, to) - groupStart);
      groups[activeGroup] = group;
    },
    get groups() { return groups; },
    get inserts() { return inserts; },
  };
}

test('negative after digits prefixes the number and retains the caret', () => {
  const field = numericField(['77']);
  insertNumericNegative(field);
  assert.deepEqual(field.groups, ['-77']);
  assert.deepEqual(field.selection.ranges, [[3, 3]]);
});

test('negative in the middle prefixes the number without deleting selected digits', () => {
  const field = numericField(['123'], 0, 1, [1, 2]);
  insertNumericNegative(field);
  assert.deepEqual(field.groups, ['-123']);
  assert.deepEqual(field.selection.ranges, [[2, 3]]);
});

test('a backwards selection ending at group start retains all selected digits', () => {
  const field = numericField(['123'], 0, 0, [3, 0]);
  insertNumericNegative(field);
  assert.deepEqual(field.groups, ['-123']);
  assert.deepEqual(field.selection.ranges, [[4, 1]]);
});

test('repeated negative is a no-op and preserves selection', () => {
  const field = numericField(['-77']);
  const selection = field.selection;
  insertNumericNegative(field);
  assert.deepEqual(field.groups, ['-77']);
  assert.equal(field.selection, selection);
  assert.equal(field.inserts, 0);
});

test('negative applies only to the active fraction slot', () => {
  const denominator = numericField(['13', '3'], 1);
  insertNumericNegative(denominator);
  assert.deepEqual(denominator.groups, ['13', '-3']);
  assert.deepEqual(denominator.selection.ranges, [[5, 5]]);
  const numerator = numericField(['13', '3']);
  insertNumericNegative(numerator);
  assert.deepEqual(numerator.groups, ['-13', '3']);
});

test('empty entries and mixed-number roots permit one leading negative', () => {
  const blank = numericField(['']);
  insertNumericNegative(blank);
  insertNumericNegative(blank);
  assert.deepEqual(blank.groups, ['-']);
  assert.equal(blank.inserts, 1);
  const mixed = numericField(['4fraction']);
  insertNumericNegative(mixed);
  assert.deepEqual(mixed.groups, ['-4fraction']);
});

test('single minus input events share the same leading-sign operation', () => {
  const field = numericField(['77']);
  let prevented = false;
  handleNumericBeforeInput(field, { data: '−', preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.deepEqual(field.groups, ['-77']);
});
