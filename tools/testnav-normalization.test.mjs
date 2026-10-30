import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

test('saving TestNav matching questions does not invent or duplicate source directions', async () => {
  const moduleUrl = new URL(`.testnav-normalization-${randomUUID()}.mjs`, import.meta.url);
  const source = (await readFile(new URL('content-studio.mjs', import.meta.url), 'utf8'))
    .split('if (process.argv.includes("--validate"))')[0];
  try {
    await writeFile(moduleUrl, source + '\nexport { normalizeQuestion };\n');
    const { normalizeQuestion } = await import(moduleUrl.href);
    const directions = 'Move each answer to the correct box.';
    const question = {
      id: 'source-question', type: 'category_sort', prompt: `Sort the quotations.\n${directions}`,
      source: { sourceFormat: 'testnav' }, instructions: directions,
      categories: [{id:'a',title:'First'},{id:'b',title:'Second'}],
      items: [{id:'one',text:'One'},{id:'two',text:'Two'}], correctPlacements: {one:'a',two:'b'},
    };
    const normalize = q => normalizeQuestion(q, 'source', 0, {allowIncomplete:true});
    assert.equal(normalize(question).instructions, '');
    assert.equal(normalize({...question,instructions:undefined}).instructions, '');
    assert.equal(normalize({...question,prompt:'Sort the quotations.'}).instructions, directions);
    assert.equal(normalize({...question,source:undefined,instructions:undefined}).instructions, directions);
    assert.deepEqual(normalize(question).correctPlacements, question.correctPlacements);
  } finally { await unlink(moduleUrl).catch(() => {}); }
});
