import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMathTopicConfiguration, saveMathTopicConfiguration, validateMathClassification } from './math-topic-editor.mjs';

const fixtureRoot = join(dirname(fileURLToPath(import.meta.url)), '.content-drafts');
const source = `// Keep this source comment and formatting.\nexport const math = { questions: [
  { id: 'one', topic: 'Algebra', subtopic: 'Linear equations', prompt: 'Solve \\u005c\\u005c(x+1=3\\u005c\\u005c)', correctTextAnswers: ['2'], type: 'short_response' },
  { id: 'two', topic: 'Geometry', subtopic: 'Area', prompt: 'Area?', choices: [{id:'A',text:'2'}], correctChoiceId:'A', type:'multiple_choice' },
  { id: 'legacy', topic: 'Algebra', prompt: 'Older question', type: 'short_response', correctTextAnswers: ['1'] }
] };\n`;
const draft = config => ({ revision: config.revision, categories: config.categories.map(category => ({ label: category.label, original: category.label, topics: category.topics.map(topic => ({ label: topic.label, original: topic.label })) })) });
async function fixture(run) {
  await mkdir(fixtureRoot, { recursive: true }); const root = await mkdtemp(join(fixtureRoot, 'math-topics-test-'));
  try {
    await mkdir(join(root, 'tools'), { recursive: true }); await mkdir(join(root, 'client/src/content/exams/mathSets'), { recursive: true }); await mkdir(join(root, 'server/data'), { recursive: true });
    await writeFile(join(root, 'tools/math-topics.json'), JSON.stringify({ categories: [{ label: 'Algebra', topics: ['Linear equations', 'Unused'] }, { label: 'Geometry', topics: ['Area'] }] }));
    await writeFile(join(root, 'client/src/content/exams/mathSets/math.ts'), source);
    await writeFile(join(root, 'server/data/assessments.json'), JSON.stringify([{ questions: [{ id: 'one', topic: 'Algebra', subtopic: 'Linear equations' }, { id: 'english', topic: 'Algebra', prompt: 'Do not rename non-math content' }] }]));
    await run(root);
  } finally { if (dirname(resolve(root)) !== resolve(fixtureRoot) || !root.startsWith(join(fixtureRoot, 'math-topics-test-'))) throw Error('Unexpected fixture target'); await rm(root, { recursive: true, force: true }); }
}

test('two math categories are required for new questions; legacy gaps remain explicit and cross-category skills are rejected', () => {
  const configuration = { categories: [{ label: 'Algebra', topics: [{ label: 'Linear equations' }] }, { label: 'Geometry', topics: [{ label: 'Area' }] }] };
  assert.deepEqual(validateMathClassification({ topic: 'Algebra', subtopic: 'Linear equations' }, configuration), { topic: 'Algebra', subtopic: 'Linear equations' });
  assert.throws(() => validateMathClassification({ topic: 'Algebra' }, configuration), /Specific topic/);
  assert.throws(() => validateMathClassification({ topic: '', subtopic: 'Area' }, configuration), /Main category/);
  assert.throws(() => validateMathClassification({ topic: 'Algebra', subtopic: 'Area' }, configuration), /under Algebra/);
  assert.deepEqual(validateMathClassification({ topic: 'Algebra' }, configuration, { topic: 'Algebra' }), { topic: 'Algebra', subtopic: 'Unclassified' });
  assert.throws(() => validateMathClassification({ topic: 'Geometry' }, configuration, { topic: 'Algebra' }), /Specific topic/);
  assert.throws(() => validateMathClassification({ topic: 'Algebra', subtopic: {} }, configuration), /must be text/);
});

test('renaming categories and specific topics patches only source labels and the matching math registry entries', async () => fixture(async root => {
  await writeFile(join(root, 'tools/content-topics.json'), JSON.stringify(['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']));
  await writeFile(join(root, 'tools/DOCUMENT_EXTRACTION_PROMPT.txt'), 'outdated');
  await writeFile(join(root, 'tools/document-import-contract.json'), '{}');
  const config = await readMathTopicConfiguration(root);
  assert.equal(config.categories[0].questionCount, 2); assert.equal(config.categories[0].unclassifiedCount, 1);
  const input = draft(config); input.categories[0].label = 'Algebraic reasoning'; input.categories[0].topics[0].label = 'One-variable equations';
  const updated = await saveMathTopicConfiguration(root, input);
  assert.equal(updated.categories[0].label, 'Algebraic reasoning'); assert.equal(updated.categories[0].topics[0].questionCount, 1);
  const changed = await readFile(join(root, 'client/src/content/exams/mathSets/math.ts'), 'utf8');
  assert.equal(changed, source.replaceAll("'Algebra'", '"Algebraic reasoning"').replaceAll("'Linear equations'", '"One-variable equations"'));
  const registry = JSON.parse(await readFile(join(root, 'server/data/assessments.json'), 'utf8'))[0].questions;
  assert.equal(registry[0].subtopic, 'One-variable equations'); assert.equal(registry[1].topic, 'Algebra');
  const contract = JSON.parse(await readFile(join(root, 'tools/document-import-contract.json'), 'utf8'));
  assert.equal(contract.taxonomy.mathSpecificTopics['Algebraic reasoning'][0], 'One-variable equations');
  assert.match(await readFile(join(root, 'tools/DOCUMENT_EXTRACTION_PROMPT.txt'), 'utf8'), /One-variable equations/);
}));

test('stale category editors and concurrent question edits cannot overwrite newer files', async () => fixture(async root => {
  const input = draft(await readMathTopicConfiguration(root)), path = join(root, 'client/src/content/exams/mathSets/math.ts');
  await writeFile(path, source + '// concurrent edit\n');
  await assert.rejects(saveMathTopicConfiguration(root, input), error => error.status === 409);
  assert.equal(await readFile(path, 'utf8'), source + '// concurrent edit\n');
}));

test('used categories/topics cannot be deleted; empty and duplicate labels are rejected before writing', async () => fixture(async root => {
  const config = await readMathTopicConfiguration(root);
  let input = draft(config); input.categories.splice(0, 1); await assert.rejects(saveMathTopicConfiguration(root, input), /in use/);
  input = draft(config); input.categories[0].topics.splice(0, 1); await assert.rejects(saveMathTopicConfiguration(root, input), /in use/);
  input = draft(config); input.categories[1].label = 'algebra'; await assert.rejects(saveMathTopicConfiguration(root, input), /unique/);
  input = draft(config); input.categories[0].topics[0].label = ' '; await assert.rejects(saveMathTopicConfiguration(root, input), /1–80/);
  assert.equal(await readFile(join(root, 'client/src/content/exams/mathSets/math.ts'), 'utf8'), source);
  input = draft(config); input.categories[0].topics.splice(1, 1); input.categories.push({ label: 'Data', original: '', topics: [{ label: 'Charts', original: '' }] });
  assert.equal((await saveMathTopicConfiguration(root, input)).categories.at(-1).label, 'Data');
}));

test('category name swaps are simultaneous and never cascade into the other category', async () => fixture(async root => {
  const input = draft(await readMathTopicConfiguration(root)); input.categories[0].label = 'Geometry'; input.categories[1].label = 'Algebra';
  await saveMathTopicConfiguration(root, input);
  const updated = await readMathTopicConfiguration(root);
  assert.equal(updated.categories.find(category => category.label === 'Geometry').questionCount, 2);
  assert.equal(updated.categories.find(category => category.label === 'Algebra').questionCount, 1);
}));

test('removing a used main category reassigns its questions, including missing legacy detail, without losing content', async () => fixture(async root => {
  const input = draft(await readMathTopicConfiguration(root));
  input.categories = input.categories.filter(category => category.original !== 'Algebra');
  input.reassignments = [{ category: 'Algebra', targetCategory: 'Geometry', targetSubtopic: 'Area' }];
  const result = await saveMathTopicConfiguration(root, input);
  assert.deepEqual(result.categories.map(category => category.label), ['Geometry']);
  assert.equal(result.categories[0].questionCount, 3);
  assert.equal(result.categories[0].topics[0].questionCount, 3);
  const changed = await readFile(join(root, 'client/src/content/exams/mathSets/math.ts'), 'utf8');
  assert.match(changed, /id: 'legacy', topic: "Geometry", subtopic: "Area", prompt: 'Older question'/);
  assert.match(changed, /correctTextAnswers: \['2'\]/);
  const registry = JSON.parse(await readFile(join(root, 'server/data/assessments.json'), 'utf8'))[0].questions;
  assert.equal(registry[0].topic, 'Geometry'); assert.equal(registry[1].topic, 'Algebra');
}));

test('removing a used specific topic requires a valid explicit destination and updates only that topic', async () => fixture(async root => {
  const input = draft(await readMathTopicConfiguration(root));
  input.categories[0].topics = input.categories[0].topics.filter(topic => topic.original !== 'Linear equations');
  input.reassignments = [{ category: 'Algebra', subtopic: 'Linear equations', targetCategory: 'Algebra', targetSubtopic: 'Missing' }];
  await assert.rejects(saveMathTopicConfiguration(root, input), /Choose a main category and specific topic/);
  input.reassignments[0].targetSubtopic = 'Unused';
  const result = await saveMathTopicConfiguration(root, input);
  assert.equal(result.categories[0].topics[0].questionCount, 1);
  assert.equal(result.categories[0].unclassifiedCount, 1);
}));
