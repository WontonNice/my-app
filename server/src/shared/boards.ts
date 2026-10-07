import * as Y from "yjs";

export type BoardRole = "owner" | "editor" | "viewer";
export type BoardKind = "note" | "math" | "image" | "file" | "link" | "group" | "passage" | "question" | "assignment" | "exam-question";
export type BoardReference = { kind: "passage" | "question" | "assignment" | "exam-question"; id: string; sourceId?: string; questionId?: string };
export type BoardHighlight = { key: string; start: number; end: number; quote: string; color: "yellow" | "green" | "blue" | "pink" };
export type BoardNode = {
  id: string; type: BoardKind; x: number; y: number; width: number; height: number;
  text: string; color: string; locked: boolean; z: number; url?: string; assetId?: string;
  reference?: BoardReference; highlights?: Record<string, BoardHighlight>; createdBy?: string; updatedBy?: string;
};
export type BoardEdge = { id: string; source: string; target: string; sourceHandle: string; targetHandle: string; label: string; color: string };
export type BoardData = { nodes: BoardNode[]; edges: BoardEdge[] };
export type BoardSummary = { id: string; title: string; studentId: string; studentName: string; ownerId: string; role: BoardRole; archivedAt: string | null; updatedAt: string; revision: number; epoch: string; participants: { id: string; name: string; role: BoardRole }[] };
export type BoardPresence = { peerId: string; userId: string; name: string; color: string; selection: string[]; editing: string | null; cursor: { x: number; y: number } | null; drag?: { id: string; x: number; y: number }[] };
export const boardColors = ["", "#b74c4c", "#bb8425", "#438b61", "#4383b0", "#8262b5", "#ae5b91"];
export const boardKinds: BoardKind[] = ["note", "math", "image", "file", "link", "group", "passage", "question", "assignment", "exam-question"];
export const LOCAL_BOARD_ORIGIN = "board-local";
export const REMOTE_BOARD_ORIGIN = "board-remote";

export function readBoard(doc: Y.Doc): BoardData {
  return {
    nodes: [...doc.getMap<Y.Map<unknown>>("nodes").entries()].map(([id, node]) => ({ ...node.toJSON(), id }) as BoardNode),
    edges: [...doc.getMap<Y.Map<unknown>>("edges").entries()].map(([id, edge]) => ({ ...edge.toJSON(), id }) as BoardEdge),
  };
}
export function addBoardNode(doc: Y.Doc, node: BoardNode) {
  const map = new Y.Map<unknown>();
  for (const [key, value] of Object.entries(node)) {
    if (key === "text") { const text = new Y.Text(); text.insert(0, String(value)); map.set(key, text); }
    else if (key === "highlights" && value) { const highlights = new Y.Map<BoardHighlight>(); for (const [id, highlight] of Object.entries(value)) highlights.set(id, highlight as BoardHighlight); map.set(key, highlights); }
    else if (value !== undefined) map.set(key, value);
  }
  doc.getMap<Y.Map<unknown>>("nodes").set(node.id, map);
}
export function addBoardEdge(doc: Y.Doc, edge: BoardEdge) {
  const map = new Y.Map<unknown>();
  for (const [key, value] of Object.entries(edge)) map.set(key, value);
  doc.getMap<Y.Map<unknown>>("edges").set(edge.id, map);
}
export function makeBoardNode(id: string, type: BoardKind, x: number, y: number, text = ""): BoardNode {
  return { id, type, x, y, text, width: type === "group" ? 640 : 300, height: type === "group" ? 420 : 220, color: "", locked: false, z: type === "group" ? -1 : 0, highlights: {} };
}
export function boardContains(group: BoardNode, node: BoardNode) {
  return node.id !== group.id && node.x >= group.x && node.y >= group.y && node.x + node.width <= group.x + group.width && node.y + node.height <= group.y + group.height;
}
export type BoardLayerAction = "front" | "back" | "forward" | "backward";
export function boardLayerChanges(nodes: BoardNode[], ids: Set<string>, action: BoardLayerAction) {
  const cards = nodes.filter(node => node.type !== "group"), selected = cards.filter(node => ids.has(node.id)).sort((a, b) => a.z - b.z || a.id.localeCompare(b.id));
  if (!selected.length) return {} as Record<string, number>;
  const others = cards.filter(node => !ids.has(node.id)), ranks = cards.map(node => node.z);
  let low: number, high: number;
  if (action === "front") { low = Math.max(0, ...ranks); high = low + selected.length + 1; }
  else if (action === "back") { high = Math.min(0, ...ranks); low = high - selected.length - 1; }
  else if (action === "forward") {
    const next = others.filter(node => node.z >= selected.at(-1)!.z).sort((a, b) => a.z - b.z)[0];
    if (!next) return {};
    low = next.z; high = Math.min(...others.filter(node => node.z > low).map(node => node.z), low + selected.length + 1);
  } else {
    const previous = others.filter(node => node.z <= selected[0].z).sort((a, b) => b.z - a.z)[0];
    if (!previous) return {};
    high = previous.z; low = Math.max(...others.filter(node => node.z < high).map(node => node.z), high - selected.length - 1);
  }
  return Object.fromEntries(selected.map((node, i) => [node.id, low + (high - low) * (i + 1) / (selected.length + 1)]));
}
export function safeBoardUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 4000) return false;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}
const textValue = (value: unknown, max = 100000) => typeof value === "string" && value.length <= max;
const scalar = (value: unknown) => typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= 1e12;
const validColor = (value: unknown) => value === "" || typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
const validId = (value: unknown) => typeof value === "string" && /^[a-zA-Z0-9._:-]{1,200}$/.test(value);
export function validateBoard(doc: Y.Doc) {
  for (const name of doc.share.keys()) if (!["nodes", "edges"].includes(name)) throw new Error("Unknown board document field.");
  const nodes = doc.getMap<Y.Map<unknown>>("nodes"), edges = doc.getMap<Y.Map<unknown>>("edges");
  if (nodes.size > 2000 || edges.size > 8000) throw new Error("This board exceeds the item limit.");
  const nodeFields = new Set(["id", "type", "x", "y", "width", "height", "text", "color", "locked", "z", "url", "assetId", "reference", "highlights", "createdBy", "updatedBy"]);
  for (const [id, item] of nodes) {
    if (!(item instanceof Y.Map) || !validId(id) || [...item.keys()].some(key => !nodeFields.has(key))) throw new Error("Invalid card structure.");
    const node = item.toJSON() as BoardNode;
    if (node.id !== id || !boardKinds.includes(node.type) || ![node.x, node.y, node.width, node.height, node.z].every(scalar) || node.width < 80 || node.height < 40 || node.width > 10000 || node.height > 10000 || !(item.get("text") instanceof Y.Text) || !textValue(node.text) || !validColor(node.color) || typeof node.locked !== "boolean") throw new Error("Invalid card fields.");
    if (node.url !== undefined && !safeBoardUrl(node.url)) throw new Error("Use an http or https link.");
    if (node.assetId !== undefined && !validId(node.assetId)) throw new Error("Invalid attachment reference.");
    if (node.reference !== undefined && (!node.reference || !["passage", "question", "assignment", "exam-question"].includes(node.reference.kind) || !validId(node.reference.id) || (node.reference.sourceId !== undefined && !validId(node.reference.sourceId)) || (node.reference.questionId !== undefined && (node.reference.kind !== "passage" || !validId(node.reference.questionId))) || Object.keys(node.reference).some(key => !["kind", "id", "sourceId", "questionId"].includes(key)))) throw new Error("Invalid content reference.");
    if (node.highlights !== undefined) {
      const highlights = item.get("highlights");
      if (!(highlights instanceof Y.Map) || highlights.size > 500) throw new Error("Invalid text highlights.");
      for (const [id, mark] of highlights as Y.Map<BoardHighlight>) {
        if (!validId(id) || !mark || Object.keys(mark).some(key => !["key", "start", "end", "quote", "color"].includes(key)) || !textValue(mark.key, 250) || !Number.isSafeInteger(mark.start) || !Number.isSafeInteger(mark.end) || mark.start < 0 || mark.end <= mark.start || mark.end > 1000000 || !textValue(mark.quote, 10000) || mark.quote.length !== mark.end - mark.start || !["yellow", "green", "blue", "pink"].includes(mark.color)) throw new Error("Invalid text highlight range.");
      }
    }
  }
  for (const [id, item] of edges) {
    if (!(item instanceof Y.Map) || !validId(id) || [...item.keys()].some(key => !["id", "source", "target", "sourceHandle", "targetHandle", "label", "color"].includes(key))) throw new Error("Invalid connection structure.");
    const edge = item.toJSON() as BoardEdge;
    if (edge.id !== id || !validId(edge.source) || !validId(edge.target) || edge.source === edge.target || ![edge.sourceHandle, edge.targetHandle].every(side => ["top", "right", "bottom", "left"].includes(side)) || !textValue(edge.label, 500) || !validColor(edge.color)) throw new Error("Invalid connection fields.");
  }
  if (Y.encodeStateAsUpdate(doc).byteLength > 8 * 1024 * 1024) throw new Error("This board exceeds the document size limit.");
}
export function checkBoardMutation(before: BoardData, after: BoardData, role: BoardRole, canManage: boolean) {
  if (role === "viewer") throw new Error("This board is view only.");
  const old = new Map(before.nodes.map(node => [node.id, node]));
  const next = new Map(after.nodes.map(node => [node.id, node]));
  if (!canManage) {
    for (const node of before.nodes) if (node.locked && JSON.stringify(node) !== JSON.stringify(next.get(node.id))) throw new Error("A teacher or owner has locked this source card.");
    for (const node of after.nodes) if (node.locked !== (old.get(node.id)?.locked ?? false)) throw new Error("Only a teacher or owner can change source locks.");
  }
}
export function seedBoard(data: BoardData): Y.Doc {
  const doc = new Y.Doc();
  doc.transact(() => { data.nodes.forEach(node => addBoardNode(doc, node)); data.edges.forEach(edge => addBoardEdge(doc, edge)); });
  return doc;
}
