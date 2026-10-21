import type { BoardStroke } from "../../../../server/src/shared/boards";

export function boardStrokePath(stroke: BoardStroke): string {
  const [first, ...rest] = stroke.points;
  if (!first) return "";
  return `M ${first.x} ${first.y}${rest.length ? rest.map(point => ` L ${point.x} ${point.y}`).join("") : " l 0.01 0"}`;
}

export function boardStrokeHit(stroke: BoardStroke, point: { x: number; y: number }, radius: number): boolean {
  const distance = radius + stroke.width / 2;
  return stroke.points.some((end, index) => {
    const start = stroke.points[Math.max(0, index - 1)], dx = end.x - start.x, dy = end.y - start.y;
    const length = dx * dx + dy * dy;
    const fraction = length ? Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / length)) : 0;
    return Math.hypot(point.x - start.x - fraction * dx, point.y - start.y - fraction * dy) <= distance;
  });
}
