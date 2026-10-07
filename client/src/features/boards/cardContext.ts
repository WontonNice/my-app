import { createContext } from "react";
import type { BoardSession } from "./session";
import type { BoardNode } from "../../../../server/src/shared/boards";
export type BoardCardContextValue = { session: BoardSession; token: string; edit: (id: string | null) => void; resize: (id: string, changes: { x: number; y: number; width: number; height: number }) => void; notice: (message: string) => void; extract: (source: BoardNode, questionId: string, title: string) => void };
export const BoardCardContext = createContext<BoardCardContextValue | null>(null);
