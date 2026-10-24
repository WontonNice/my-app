import { createAuthHeaders, requestApi } from "../../lib/api";
import type { GameCatalog, GameSummary, GameView } from "../../../../server/src/shared/gameRooms";
export function gameApi(token: string) {
  const call = <T>(path: string, method = "GET", body?: unknown) => requestApi<T>(`/api/game-rooms${path}`, { method, headers: createAuthHeaders(token), ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return {
    list: async () => (await call<{ rooms: GameSummary[] }>("/")).rooms,
    remove: (id: string) => call(`/${id}`, "DELETE"),
    catalog: () => call<GameCatalog>("/catalog"),
    create: async (body: Record<string, unknown>) => (await call<{ room: GameView }>("/", "POST", body)).room,
    join: async (code: string) => (await call<{ room: GameView }>("/join", "POST", { code })).room,
    get: async (id: string, teamId?: string) => (await call<{ room: GameView }>(`/${id}${teamId ? `?teamId=${encodeURIComponent(teamId)}` : ""}`)).room,
    action: async (id: string, action: string, body: Record<string, unknown> = {}) => (await call<{ room: GameView }>(`/${id}/action`, "POST", { ...body, action })).room,
  };
}
