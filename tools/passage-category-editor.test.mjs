import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizePassageCategory, patchPassageCategory } from './passage-category-editor.mjs';

test('category defaults and validation are source-only, never guessed from genre', () => {
  assert.equal(normalizePassageCategory(undefined), 'miscellaneous');
  assert.throws(() => normalizePassageCategory('poem'), /valid Passage Category/);
});
test('bulk metadata patch retains poems, quotations, questions, comments and whitespace', () => {
  const original = '// keep this\r\nconst text = "Line one\\n    Line two";\r\nexport const poem = createPlainTextPassage({\r\n  id: "poem", text, title: "A poem",\r\n});\r\nconst answers = ["A", "B"];\r\n';
  const patched = patchPassageCategory(original, 'official_handbook');
  assert.equal(patched.replace('  passageCategory: "official_handbook",\r\n', ''), original);
  const edited = patchPassageCategory(patched, 'prestige');
  assert.equal(edited.replace('"prestige"', '"official_handbook"'), patched);
  assert.throws(() => patchPassageCategory('const input = {};', 'prestige'), /single passage/);
  assert.throws(() => patchPassageCategory(original + original, 'prestige'), /single passage/);
});
