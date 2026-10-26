import type { ExamPointGraph } from '../../../server/src/shared/examTypes';

/** Equal tick spacing preserves the source graph's proportions instead of stretching it square. */
export function pointGraphLayout(graph: ExamPointGraph) {
  if (!['xMin', 'xMax', 'xStep', 'yMin', 'yMax', 'yStep'].every(key => Number.isFinite(graph[key as 'xMin']))
    || graph.xMax <= graph.xMin || graph.yMax <= graph.yMin || graph.xStep <= 0 || graph.yStep <= 0) return null;
  const columns = (graph.xMax - graph.xMin) / graph.xStep;
  const rows = (graph.yMax - graph.yMin) / graph.yStep;
  if (columns > 1000 || rows > 1000) return null;
  const cell = Math.min(20, 340 / Math.max(columns, rows));
  const left = 47, top = 61;
  const right = left + (columns + 1) * cell;
  const bottom = top + (rows + 1) * cell;
  const ticks = (min: number, step: number, count: number) => Array.from({length: Math.floor(count + 1e-9) + 1}, (_, i) => Number((min + i * step).toFixed(10)));
  return {
    left, top, right, bottom, width: right + 35, height: bottom + 53,
    xTicks: ticks(graph.xMin, graph.xStep, columns), yTicks: ticks(graph.yMin, graph.yStep, rows),
    xFor: (x: number) => left + (x - graph.xMin) / graph.xStep * cell,
    yFor: (y: number) => bottom - (y - graph.yMin) / graph.yStep * cell,
  };
}
