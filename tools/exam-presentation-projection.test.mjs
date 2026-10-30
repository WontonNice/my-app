import test from 'node:test';
import assert from 'node:assert/strict';
import { createExamPresentationProjector } from './exam-presentation-projection.mjs';

const projector = createExamPresentationProjector();
test('projection removes capture metadata without changing baselines or rich response contracts', () => {
  const base = { id: 'q1', type: 'graph_point_select', prompt: 'Original', topic: 'Geometry', correctPointIds: ['P'], captureEvidence: { untouched: true } };
  const baseLines = [{ text: 'Original line', legacyLayout: { untouched: true } }];
  const input = { questions: { q1: { base, question: {
    ...base, sourceQuestion: '62', review: { approved: true },
    source: { sourceFamily: 'official_shsat', sourceFormat: 'testnav', year: '2026', pages: [1, 2], items: [{ raw: true }], yearEvidence: 'Landing page', examId: 'official-2026-a', sourceUrl: 'https://example.org/source', title: 'Source title' },
    promptHtml: '<p>Select <strong>one</strong>.</p>', selectionHtml: '<span data-choice-id="P">Point</span>',
    graph: { sourceImage: { src: '/exam-images/graph.svg', alt: 'Grid', width: 620, height: 480, assetHash: 'archive-only' }, points: [{ id: 'P', x: 1, y: 2, sourceX: 123, sourceY: 234 }], xLabel: 'x', yLabel: 'y', xMin: -5, xMax: 5, yMin: -5, yMax: 5, xStep: 1, yStep: 1 },
    correctPlacements: { 'card-one': 'target-one' },
    dropdowns: [{ id: 'slot', correctChoiceId: 'B', options: [{ id: 'B', text: 'two', math: '2' }] }],
    dragDropSlots: [{ id: 'target-one', correctItemId: 'card-one' }],
    dragDropContentHtml: '<table><tr><td>{target-one}</td></tr></table>',
  } } }, passages: { p1: { baseLines, passage: {
    id: 'p1', title: 'Poem', format: 'poem', sourceNoteHtml: '<em>Source</em>',
    lines: [{ text: '        verse', html: '        <em>verse</em>', numbered: false, poetryLine: true, lineNumber: '5', align: 'indent', importedIndex: 6 }],
    review: { approved: true },
  } } } };
  const before = JSON.stringify(input);
  const dropped = [];
  const result = projector.overrides(input, entry => dropped.push(entry.path));
  assert.equal(JSON.stringify(input), before, 'projection must not mutate input');
  assert.equal(result.questions.q1.base, base, 'baseline must remain the original object');
  assert.equal(result.passages.p1.baseLines, baseLines, 'baseline lines must remain the original object');
  const q = result.questions.q1.question;
  assert.equal(q.sourceQuestion, undefined);
  assert.equal(q.review, undefined);
  assert.deepEqual(q.source, { sourceFamily: 'official_shsat', sourceFormat: 'testnav', year: '2026', pages: [1, 2], sourceId: 'official-2026-a', url: 'https://example.org/source', label: 'Source title' });
  assert.equal(q.graph.sourceImage.width, 620);
  assert.equal(q.graph.sourceImage.height, 480);
  assert.equal(q.graph.sourceImage.assetHash, undefined);
  assert.deepEqual(q.graph.points, input.questions.q1.question.graph.points);
  for (const key of ['correctPlacements', 'dropdowns', 'dragDropSlots', 'dragDropContentHtml', 'promptHtml', 'selectionHtml']) assert.deepEqual(q[key], input.questions.q1.question[key]);
  assert.deepEqual(result.passages.p1.passage.lines[0], { text: '        verse', html: '        <em>verse</em>', numbered: false, poetryLine: true, lineNumber: '5', align: 'indent' });
  assert.ok(dropped.includes('questions.q1.question.sourceQuestion'));
  assert.ok(dropped.includes('questions.q1.question.source.yearEvidence'));
  assert.deepEqual(projector.overrides(result), result, 'projection must be idempotent');
});

test('projection handles optional snapshots and rejects malformed structured display fields', () => {
  assert.equal(projector.overrides(undefined), undefined);
  assert.deepEqual(projector.overrides({}), {});
  assert.deepEqual(projector.question({ id: 'q', topic: '', prompt: 'Text', type: 'multiple_choice', choices: undefined }), { id: 'q', topic: '', prompt: 'Text', type: 'multiple_choice', choices: undefined });
  assert.throws(() => projector.question({ id: 'q', prompt: ['not a string'] }), /must not be an array/);
  assert.throws(() => projector.passage({ id: 'p', title: { unsafe: true } }), /must not be an object/);
});

test('source graph images supply their own axis labels without invented text', () => {
  const graph = { sourceImage: { src: '/exam-images/grid.svg', alt: 'Grid', width: 480, height: 360 }, points: [{ id: 'P', x: 2, y: 3, sourceX: 120, sourceY: 160 }], xMin: -5, xMax: 5, yMin: -5, yMax: 5, xStep: 1, yStep: 1 };
  const projected = projector.question({ id: 'q', topic: '', prompt: 'Select the point.', type: 'graph_point_select', graph });
  assert.deepEqual(projected.graph, { ...graph, xLabel: '', yLabel: '' });
  assert.equal(graph.xLabel, undefined);
  assert.equal(projector.question({ graph: { ...graph, xLabel: 'Time', yLabel: 'Distance' } }).graph.xLabel, 'Time');
});
