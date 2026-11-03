import type { CoordinatePoint, ExamCoordinateResponse, ExamQuestion } from './examTypes';

type Response = string | string[] | Record<string, string> | undefined;
export function coordinatePlacements(answer: Response): Record<string, string> {
  return answer && typeof answer === 'object' && !Array.isArray(answer) ? answer : {};
}
export function coordinatePoints(answer: Response, id: string): CoordinatePoint[] {
  const raw = coordinatePlacements(answer)[id];
  if (!raw) return [];
  try {
    const points: unknown = JSON.parse(raw);
    return Array.isArray(points) && points.length <= 2 && points.every(p => p && typeof p === 'object' &&
      typeof p.x === 'number' && Number.isFinite(p.x) && typeof p.y === 'number' && Number.isFinite(p.y)) ? points : [];
  } catch { return []; }
}
const near = (a: number, b: number) => Math.abs(a - b) < 1e-7;
export function coordinateInBounds(c: ExamCoordinateResponse, p: CoordinatePoint) {
  return p.x >= c.xMin - 1e-7 && p.x <= c.xMax + 1e-7 && p.y >= c.yMin - 1e-7 && p.y <= c.yMax + 1e-7;
}
export function coordinateAnswerComplete(question: ExamQuestion, answer: Response): boolean {
  const c = question.coordinateResponse;
  if (!c) return false;
  const value = coordinatePlacements(answer);
  if (c.shapes?.length) {
    const shape = c.shapes.find(s => s.id === value.shape), anchor = coordinatePoints(answer, 'anchor');
    return Boolean(shape && anchor.length === 1 && shape.vertices.every(p => coordinateInBounds(c, { x: p.x + anchor[0].x, y: p.y + anchor[0].y })));
  }
  return c.tools.length > 0 && c.tools.every(tool => {
    const points = coordinatePoints(answer, tool.id);
    return points.length === (tool.kind === 'line' ? 2 : 1) && points.every(p => coordinateInBounds(c, p)) &&
      (tool.kind === 'point' || !near(points[0].x, points[1].x) || !near(points[0].y, points[1].y));
  });
}
export function coordinateAnswerCorrect(question: ExamQuestion, answer: Response): boolean {
  if (!coordinateAnswerComplete(question, answer)) return false;
  const c = question.coordinateResponse!, value = coordinatePlacements(answer);
  if (c.shapes?.length) {
    const p = coordinatePoints(answer, 'anchor')[0];
    return Boolean(c.correctAnchor && value.shape === c.correctShapeId && near(p.x, c.correctAnchor.x) && near(p.y, c.correctAnchor.y));
  }
  return c.tools.every(tool => {
    const key = tool.correctPoints ?? [], points = coordinatePoints(answer, tool.id);
    if (tool.kind === 'point') return key.length === 1 && near(points[0].x, key[0].x) && near(points[0].y, key[0].y);
    if (key.length !== 2) return false;
    const dx = key[1].x - key[0].x, dy = key[1].y - key[0].y;
    return Math.hypot(dx, dy) > 1e-7 && points.every(p => Math.abs(dx * (p.y - key[0].y) - dy * (p.x - key[0].x)) / Math.hypot(dx, dy) < 1e-7);
  });
}
export function correctCoordinateAnswer(question: ExamQuestion): Record<string, string> {
  const c = question.coordinateResponse;
  if (!c) return {};
  return c.shapes?.length ? c.correctAnchor && c.correctShapeId ? { shape: c.correctShapeId, anchor: JSON.stringify([c.correctAnchor]) } : {} :
    Object.fromEntries(c.tools.filter(t => t.correctPoints?.length).map(t => [t.id, JSON.stringify(t.correctPoints)]));
}

/** Intersections of an infinite line with the authored plot rectangle. */
export function clippedCoordinateLine(c: ExamCoordinateResponse, points: CoordinatePoint[]): CoordinatePoint[] {
  if (points.length !== 2) return [];
  const [a,b] = points, dx = b.x-a.x, dy = b.y-a.y, result: CoordinatePoint[] = [];
  const add = (p: CoordinatePoint) => { if (coordinateInBounds(c,p) && !result.some(r=>near(r.x,p.x)&&near(r.y,p.y))) result.push(p); };
  if (Math.abs(dx)>1e-10) for (const x of [c.xMin,c.xMax]) add({x,y:a.y+(x-a.x)*dy/dx});
  if (Math.abs(dy)>1e-10) for (const y of [c.yMin,c.yMax]) add({x:a.x+(y-a.y)*dx/dy,y});
  return result.slice(0,2);
}
