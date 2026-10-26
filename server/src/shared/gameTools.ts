export type GameToolState = {
  drawings: Record<string, { points: { x: number; y: number }[] }[]>;
  highlights: Record<string, { start: number; end: number; color: "blue" | "pink" }[]>;
  eliminated: Record<string, string[]>;
  notes: Record<string, string>;
};
export const emptyGameTools = (): GameToolState => ({ drawings: {}, highlights: {}, eliminated: {}, notes: {} });
