import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import type { User, RealtimeChannel } from "@supabase/supabase-js";
import { WebSocketServer, WebSocket } from "ws";
import * as Y from "yjs";
import { supabase } from "./supabase";
import { boardAccess, boardUser, boardName, boardSummary, boardTeacher, commitBoardUpdate, fetchBoard, boardFail, decodeBoard, type BoardRow } from "./boardStore";
import { readBoard, type BoardPresence, type BoardRole } from "../shared/boards";

type Peer = { ws: WebSocket; token: string; user: User; role: BoardRole; canManage: boolean; epoch: string; vector: Uint8Array; presence: BoardPresence; lastPresence: number; lastCheck: number; alive: boolean };
type Room = { id: string; channel: RealtimeChannel; peers: Set<Peer>; remote: Map<string, { presence: BoardPresence; at: number }>; rules: Map<string, { locked: boolean }>; editable: boolean; queue: Promise<void>; ready: Promise<void>; lastRevision: number };
const rooms = new Map<string, Room>();
const send = (ws: WebSocket, value: unknown) => { if (ws.readyState === WebSocket.OPEN) { if (ws.bufferedAmount > 8 * 1024 * 1024) ws.close(1013, "Connection too slow"); else ws.send(JSON.stringify(value)); } };
const colors = ["#4383b0", "#8262b5", "#438b61", "#ae5b91", "#bb8425"];
export function boardOriginAllowed(origin: string | undefined, host: string | undefined, allowedOrigins: string[]) {
  if (!origin) return true;
  try {
    const source = new URL(origin), target = new URL(`http://${host}`);
    if (!["http:", "https:"].includes(source.protocol) || source.origin !== origin) return false;
    if (allowedOrigins.includes(origin)) return true;
    if (allowedOrigins.length) return false;
    if (source.host === target.host) return true;
    const loopback = (name: string) => ["localhost", "127.0.0.1", "[::1]"].includes(name);
    return process.env.NODE_ENV !== "production" && loopback(source.hostname) && loopback(target.hostname);
  } catch { return false; }
}
function tellPresence(room: Room) { const peers = [...room.peers].map(peer => peer.presence).concat([...room.remote.values()].map(peer => peer.presence)); for (const peer of room.peers) send(peer.ws, { type: "presence", peers }); }
function signal(room: Room, payload: unknown) { return room.channel.send({ type: "broadcast", event: "signal", payload }); }
async function verifyPeer(peer: Peer, id: string) { peer.user = await boardUser(`Bearer ${peer.token}`); const access = await boardAccess(id, peer.user); peer.role = access.role; peer.canManage = access.canManage; peer.lastCheck = Date.now(); }
function cacheRules(room: Room, doc: Y.Doc, board: BoardRow) {
  if (Number(board.revision) < room.lastRevision) return;
  room.lastRevision = Number(board.revision); room.editable = !board.archived_at;
  room.rules = new Map(readBoard(doc).nodes.map(node => [node.id, { locked: node.locked }]));
}
function mayPreviewEdit(room: Room, peer: Peer, nodeId: string) { const node = room.rules.get(nodeId); return room.editable && peer.role !== "viewer" && Boolean(node) && (!node!.locked || peer.canManage); }
function prunePresence(room: Room, peer: Peer) { peer.presence.drag = (peer.presence.drag ?? []).filter(item => mayPreviewEdit(room, peer, item.id)); if (peer.presence.editing && !mayPreviewEdit(room, peer, peer.presence.editing)) peer.presence.editing = null; }
async function refreshRoom(room: Room) {
  const board = await fetchBoard(room.id);
  const doc = decodeBoard(board.state);
  cacheRules(room, doc, board);
  for (const peer of room.peers) {
    try {
      await verifyPeer(peer, room.id);
      prunePresence(room, peer);
      if (board.epoch !== peer.epoch) { send(peer.ws, { type: "recovery", message: "This board was restored. Download any unsaved work and reopen the board." }); peer.ws.close(4009); continue; }
      const summary = await boardSummary(board, peer.user);
      send(peer.ws, { type: "sync", state: Buffer.from(Y.encodeStateAsUpdate(doc, peer.vector)).toString("base64"), board: summary, canManage: summary.role === "owner" || summary.role === "editor" && boardTeacher(peer.user) });
      peer.vector = Y.encodeStateVector(doc);
      await signal(room, { kind: "presence", presence: peer.presence });
    } catch { peer.ws.close(4003, "Board access changed"); }
  }
  doc.destroy();
  tellPresence(room);
}
async function getRoom(id: string) {
  const existing = rooms.get(id); if (existing) { await existing.ready; return existing; }
  const channel = supabase.channel(`board-internal:${id}`, { config: { private: true, broadcast: { self: false, ack: true } } });
  const room: Room = { id, channel, peers: new Set(), remote: new Map(), rules: new Map(), editable: false, queue: Promise.resolve(), ready: Promise.resolve(), lastRevision: 0 };
  rooms.set(id, room);
  channel.on("broadcast", { event: "signal" }, ({ payload }) => {
    if (payload?.kind === "document") { room.queue = room.queue.then(() => refreshRoom(room)).catch(() => { for (const peer of room.peers) peer.ws.close(1013, "Board sync unavailable"); }); }
    else if (payload?.kind === "presence" && payload.presence) { room.remote.set(payload.presence.peerId, { presence: payload.presence, at: Date.now() }); tellPresence(room); }
    else if (payload?.kind === "leave") { room.remote.delete(payload.peerId); tellPresence(room); }
  });
  room.ready = new Promise<void>((resolve, reject) => {
    let subscribed = false, failed = false;
    const timeout = setTimeout(() => reject(boardFail("The collaboration service is unavailable. Check private Supabase Realtime channels.", 503)), 12000);
    channel.subscribe(status => {
      if (failed) return;
      if (status === "SUBSCRIBED") { subscribed = true; clearTimeout(timeout); resolve(); for (const peer of room.peers) void signal(room, { kind: "presence", presence: peer.presence }); }
      else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
        failed = true; clearTimeout(timeout);
        if (rooms.get(id) === room) rooms.delete(id);
        reject(boardFail("The collaboration service is unavailable.", 503));
        for (const peer of room.peers) peer.ws.close(1013, "Collaboration reconnecting");
        if (subscribed) void supabase.removeChannel(channel);
      }
    });
  });
  try { await room.ready; return room; } catch (error) { if (rooms.get(id) === room) rooms.delete(id); await supabase.removeChannel(channel); throw error; }
}
export async function notifyBoardChanged(board: BoardRow) {
  const room = rooms.get(board.id);
  if (board.deleted_at && room) {
    for (const peer of room.peers) { send(peer.ws, { type: "recovery", message: "The owner removed this board. Download any unsaved work before leaving." }); peer.ws.close(4003); }
    await signal(room, { kind: "document", revision: board.revision });
    return;
  }
  if (room) { await refreshRoom(room); await signal(room, { kind: "document", revision: board.revision }); }
  else {
    const temporary = await getRoom(board.id);
    await signal(temporary, { kind: "document", revision: board.revision });
    if (!temporary.peers.size) { rooms.delete(board.id); await supabase.removeChannel(temporary.channel); }
  }
}
export function attachBoardRealtime(server: Server, allowedOrigins: string[]) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 768 * 1024, perMessageDeflate: false });
  server.on("upgrade", (request, socket, head) => {
    if (request.url?.split("?", 1)[0] !== "/api/boards/live") { socket.destroy(); return; }
    const origin = request.headers.origin;
    if (!boardOriginAllowed(origin, request.headers.host, allowedOrigins)) { socket.destroy(); return; }
    wss.handleUpgrade(request, socket, head, ws => wss.emit("connection", ws, request));
  });
  wss.on("connection", ws => {
    let peer: Peer | undefined, room: Room | undefined, authenticating = false, count = 0, windowAt = Date.now();
    const authTimeout = setTimeout(() => ws.close(4001, "Sign in required"), 15000);
    ws.on("pong", () => { if (peer) peer.alive = true; });
    ws.on("message", raw => {
      if (Date.now() - windowAt > 1000) { windowAt = Date.now(); count = 0; }
      if (++count > 45) { ws.close(1008, "Too many updates"); return; }
      let message: Record<string, unknown>;
      try { message = JSON.parse(raw.toString()); } catch { ws.close(1008, "Invalid message"); return; }
      if (!peer) {
        if (authenticating || message.type !== "join" || typeof message.token !== "string" || typeof message.boardId !== "string" || message.token.length > 20000) { ws.close(4001, "Sign in required"); return; }
        authenticating = true;
        void (async () => {
          const user = await boardUser(`Bearer ${message.token}`);
          const access = await boardAccess(String(message.boardId), user);
          room = await getRoom(access.board.id);
          if (ws.readyState !== WebSocket.OPEN) return;
          const peerId = randomUUID();
          peer = { ws, user, role: access.role, canManage: access.canManage, token: String(message.token), epoch: access.board.epoch, vector: new Uint8Array([0]), lastPresence: 0, lastCheck: Date.now(), alive: true, presence: { peerId, userId: user.id, name: boardName(user), color: colors[user.id.charCodeAt(0) % colors.length], cursor: null, editing: null, selection: [] } };
          room.peers.add(peer); clearTimeout(authTimeout);
          const board = await fetchBoard(room.id);
          const doc = decodeBoard(board.state); peer.vector = Y.encodeStateVector(doc); cacheRules(room, doc, board); doc.destroy();
          const summary = await boardSummary(board, user);
          peer.epoch = board.epoch; peer.role = summary.role; peer.canManage = summary.role === "owner" || summary.role === "editor" && boardTeacher(user);
          send(ws, { type: "ready", peerId, state: board.state, board: summary, canManage: peer.canManage });
          tellPresence(room); await signal(room, { kind: "presence", presence: peer.presence });
        })().catch(error => {
          const retryable = error?.status === 503;
          send(ws, { type: retryable ? "retry" : "error", message: error instanceof Error ? error.message : "Cannot join board." });
          ws.close(retryable ? 1013 : 4003);
        });
        return;
      }
      if (!room) return;
      const current = peer, currentRoom = room;
      if (message.type === "presence") {
        current.lastPresence = Date.now();
        const data = message.data as Partial<BoardPresence>;
        if (!data || typeof data !== "object") return;
        const point = (value: unknown) => typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= 1e12;
        current.presence.cursor = data.cursor && point(data.cursor.x) && point(data.cursor.y) ? data.cursor : null;
        current.presence.selection = Array.isArray(data.selection) ? data.selection.filter(id => typeof id === "string" && id.length <= 200).slice(0, 2000) : [];
        current.presence.editing = typeof data.editing === "string" ? data.editing.slice(0, 200) : null;
        current.presence.drag = Array.isArray(data.drag) ? data.drag.filter(item => typeof item?.id === "string" && point(item.x) && point(item.y)).slice(0, 2000) : [];
        prunePresence(currentRoom, current);
        tellPresence(currentRoom); void signal(currentRoom, { kind: "presence", presence: current.presence });
      } else if (message.type === "update") {
        currentRoom.queue = currentRoom.queue.then(async () => {
          try {
            await verifyPeer(current, currentRoom.id);
            if (typeof message.state !== "string" || message.state.length > 710000 || typeof message.epoch !== "string" || typeof message.sequence !== "number") throw boardFail("Invalid board update.");
            if (message.epoch !== current.epoch) throw boardFail("Reopen the board before sending work from a different version.", 409);
            const result = await commitBoardUpdate(currentRoom.id, current.user, message.epoch, Buffer.from(message.state, "base64"));
            const doc = decodeBoard(result.board.state);
            cacheRules(currentRoom, doc, result.board);
            for (const other of currentRoom.peers) {
              send(other.ws, { type: "sync", state: Buffer.from(Y.encodeStateAsUpdate(doc, other.vector)).toString("base64"), revision: result.board.revision, updatedAt: result.board.updated_at });
              other.vector = Y.encodeStateVector(doc);
              prunePresence(currentRoom, other);
            }
            doc.destroy();
            tellPresence(currentRoom);
            send(current.ws, { type: "ack", sequence: message.sequence, revision: result.board.revision });
            const delivery = await signal(currentRoom, { kind: "document", revision: result.board.revision });
            if (delivery !== "ok") { for (const other of currentRoom.peers) other.ws.close(1013, "Collaboration reconnecting"); }
          } catch (error) { send(current.ws, { type: "recovery", message: error instanceof Error ? error.message : "This change could not be saved. Keep a recovery copy." }); }
        }).catch(() => { current.ws.close(1013); });
      } else if (message.type === "token" && typeof message.token === "string") {
        current.token = message.token;
        void verifyPeer(current, currentRoom.id).catch(() => current.ws.close(4003));
      }
    });
    ws.on("close", () => {
      clearTimeout(authTimeout);
      if (peer && room) {
        room.peers.delete(peer); tellPresence(room); void signal(room, { kind: "leave", peerId: peer.presence.peerId });
        if (!room.peers.size) { const unused = room; if (rooms.get(room.id) === room) rooms.delete(room.id); void unused.queue.finally(() => supabase.removeChannel(unused.channel)); }
      }
    });
    ws.on("error", () => ws.close());
  });
  const timer = setInterval(() => {
    for (const room of rooms.values()) {
      for (const [id, remote] of room.remote) if (Date.now() - remote.at > 45000) room.remote.delete(id);
      for (const peer of room.peers) {
        if (!peer.alive) { peer.ws.terminate(); continue; }
        peer.alive = false; peer.ws.ping();
        void verifyPeer(peer, room.id).then(() => signal(room, { kind: "presence", presence: peer.presence })).catch(() => peer.ws.close(4003));
      }
      tellPresence(room);
    }
  }, 20000);
  timer.unref();
  server.on("close", () => { clearInterval(timer); for (const ws of wss.clients) ws.terminate(); wss.close(); for (const room of rooms.values()) void supabase.removeChannel(room.channel); rooms.clear(); });
  return wss;
}
