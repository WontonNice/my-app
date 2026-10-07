import { createAuthHeaders, requestApi } from "../../lib/api";
import type { BoardSummary } from "../../../../server/src/shared/boards";
export type { BoardContent } from "../../../../server/src/shared/boardContent";
import type { BoardContent } from "../../../../server/src/shared/boardContent";
export type BoardVersion = { id: string; title: string; label: string; createdAt: string; author: string };
export function boardApi(token: string) {
  const call = <T>(path: string, method = "GET", body?: unknown) => requestApi<T>(`/api/boards${path}`, { method, headers: createAuthHeaders(token), ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return {
    list: async (studentId?: string, teacher = false) => (await call<{ boards: BoardSummary[] }>(`/${studentId ? `?studentId=${encodeURIComponent(studentId)}` : teacher ? "?scope=teacher" : ""}`)).boards,
    create: async (title: string, studentId?: string) => (await call<{ board: BoardSummary }>("/", "POST", { title, studentId })).board,
    get: (id: string) => call<{ board: BoardSummary; canManage: boolean }>(`/${id}`),
    manage: async (board: BoardSummary, action: string, values: Record<string, unknown> = {}) => (await call<{ board: BoardSummary }>(`/${board.id}`, "PATCH", { action, revision: board.revision, ...values })).board,
    duplicate: async (id: string) => (await call<{ board: BoardSummary }>(`/${id}/duplicate`, "POST")).board,
    history: (id: string, page: number) => call<{ revisions: BoardVersion[]; total: number }>(`/${id}/history?page=${page}`),
    teachers: async (id: string) => (await call<{ teachers: { id: string; name: string }[] }>(`/${id}/teachers`)).teachers,
    participant: async (board: BoardSummary, id: string, role: string) => (await call<{ board: BoardSummary }>(`/${board.id}/participants/${id}`, "PUT", { role, revision: board.revision })).board,
    content: async (id: string, q: string) => (await call<{ items: BoardContent[] }>(`/${id}/content?${new URLSearchParams({ q })}`)).items,
    source: async (id: string, nodeId: string) => (await call<{ item: BoardContent }>(`/${id}/content/${nodeId}`)).item,
    asset: (id: string, assetId: string) => call<{ url: string; name: string; mime: string }>(`/${id}/assets/${assetId}`),
    upload: async (id: string, file: File) => {
      const headers = new Headers(createAuthHeaders(token)); headers.set("Content-Type", "application/octet-stream"); headers.set("x-file-name", encodeURIComponent(file.name)); headers.set("x-file-type", ["image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf", "text/plain"].includes(file.type) ? file.type : "application/octet-stream");
      return (await requestApi<{ asset: { id: string; name: string; mime: string } }>(`/api/boards/${id}/assets`, { method: "POST", headers, body: file })).asset;
    },
  };
}
