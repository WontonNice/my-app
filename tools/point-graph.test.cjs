const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { pointGraphLayout } = require('../client/src/lib/pointGraphLayout.ts');
const { content20262027FormAMathSection } = require('../client/src/content/exams/mathSets/2026-2027-form-aMath.ts');
const { isExamQuestionCorrect } = require('../server/src/shared/examGrading.ts');
const question = content20262027FormAMathSection.questions.find(q => q.id === '2026-2027-form-a-math-item-37');

test('question 37 keeps the reference graph dimensions and all seven plotted positions', () => {
  const layout = pointGraphLayout(question.graph);
  assert.equal(question.graph.title, 'Buying Notebooks');
  assert.deepEqual([layout.width, layout.height], [222, 434]);
  assert.deepEqual(question.graph.points.map(p => [layout.xFor(p.x), layout.yFor(p.y)]), [[67,361],[67,321],[87,281],[107,241],[107,201],[127,141],[147,101]]);
  assert.equal(layout.xFor(2)-layout.xFor(1), layout.yFor(1)-layout.yFor(2));
});

test('select-all graph grading rejects missing and extra points without changing the key', () => {
  assert.equal(isExamQuestionCorrect(question, ['point-2','point-5','point-6']), true);
  assert.equal(isExamQuestionCorrect(question, ['point-2']), false);
  assert.equal(isExamQuestionCorrect(question, question.graph.points.map(p=>p.id)), false);
});

test('graph layout supports fractional ticks and rejects invalid or excessive grids', () => {
  const graph = {...question.graph, xMin: 0, xMax: 0.3, xStep: 0.1};
  assert.deepEqual(pointGraphLayout(graph).xTicks, [0,0.1,0.2,0.3]);
  for (const invalid of [{yStep:0}, {xMax:0}, {xMax:Infinity}, {yMax:1001}]) assert.equal(pointGraphLayout({...question.graph,...invalid}), null);
});
