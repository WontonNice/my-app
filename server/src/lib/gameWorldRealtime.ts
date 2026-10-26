import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { WebSocket, WebSocketServer } from "ws";
import { supabase } from "./supabase";
import { fetchGame, gameUser } from "./gameStore";
import { gameError, gameMember, type GameActor } from "./gameEngine";
import { boardOriginAllowed } from "./boardRealtime";
import { worldRoomEvents } from "./gameWorldEvents";
import type { GameRoom } from "../shared/gameRooms";
import { WORLD_BOUNDARY, WORLD_CHARACTERS, WORLD_EMOTES, WORLD_SPAWN, type WorldCharacterId, type WorldEmote, type WorldPose, type WorldPresence } from "../shared/gameWorld";

type WirePresence = { peerId: string; startedAt: number; presence: WorldPresence };
type Peer = WirePresence & { ws: WebSocket; token: string; alive: boolean; dirty: boolean; lastMove: number; lastEmote: number };
type Hub = { id: string; revision: number; channel: RealtimeChannel; peers: Set<Peer>; remote: Map<string, WirePresence & { at: number }>; dirty: boolean; pendingLifecycle: number; ready: Promise<void> };
const networkErrors = new Set(["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EPIPE", "EAI_AGAIN", "ENOTFOUND", "ENETUNREACH", "EHOSTUNREACH", "UND_ERR_CONNECT_TIMEOUT", "UND_ERR_HEADERS_TIMEOUT", "UND_ERR_SOCKET"]);
const retryable = (error: unknown): boolean => {
  const seen = new Set<unknown>();
  while (error && typeof error === "object" && !seen.has(error)) {
    seen.add(error);
    const current = error as { status?: number; name?: string; code?: string; message?: string; cause?: unknown };
    if (Number(current.status) >= 500 || current.status === 429 || networkErrors.has(current.code ?? "")
      || ["AuthRetryableFetchError", "AbortError", "TimeoutError"].includes(current.name ?? "")
      || current.name === "TypeError" && current.message === "fetch failed") return true;
    error = current.cause;
  }
  return false;
};
const send = (ws: WebSocket, message: unknown) => {
  if (ws.readyState !== WebSocket.OPEN) return;
  if (ws.bufferedAmount > 256 * 1024) { ws.close(1013, "World connection is too slow"); return; }
  ws.send(JSON.stringify(message));
};
export function parseWorldCharacter(value: unknown): WorldCharacterId {
  if (!WORLD_CHARACTERS.some(character => character.id === value)) throw new Error("Choose an available character");
  return value as WorldCharacterId;
}
export function parseWorldEmote(value: unknown): WorldEmote {
  if (!WORLD_EMOTES.some(emote => emote.id === value)) throw new Error("Choose an available interaction");
  return value as WorldEmote;
}
export function parseWorldPose(value: unknown): WorldPose {
  const pose = value as Partial<WorldPose> | undefined;
  const finite = (number: unknown, min: number, max: number) => typeof number === "number" && Number.isFinite(number) && number >= min && number <= max;
  if (!pose || !finite(pose.x, -WORLD_BOUNDARY, WORLD_BOUNDARY) || !finite(pose.z, -WORLD_BOUNDARY, WORLD_BOUNDARY)
    || !finite(pose.y, 0, 5) || !finite(pose.rotation, -Math.PI * 100, Math.PI * 100) || typeof pose.moving !== "boolean") throw new Error("Invalid world position");
  return { x: pose.x!, y: pose.y!, z: pose.z!, rotation: pose.rotation!, moving: pose.moving };
}
function access(room: GameRoom, actor: GameActor, testCharacter = false) {
  gameMember(room, actor);
  if (room.closedAt || room.mode !== "world" || room.phase !== "question" || room.worldBlockedIds?.includes(actor.id)) throw new Error("This world is not available");
  if (testCharacter && room.hostId !== actor.id) throw new Error("Only the teacher can add a test character");
}
function clearEmote(presence: WorldPresence) { delete presence.emote; delete presence.emoteAt; }
const wire = (peer: Peer): WirePresence => ({ peerId: peer.peerId, startedAt: peer.startedAt, presence: peer.presence });

/** Movement is temporary; room membership stays in the existing durable game store.
 * Batch at 10 Hz, so a whole class does not send one full roster per movement. */
export function attachGameWorldRealtime(server: Server, allowedOrigins: string[]) {
  const hubs = new Map<string, Hub>();
  const wss = new WebSocketServer({ noServer: true, maxPayload: 24576, perMessageDeflate: false });
  const signal = (hub: Hub, payload: unknown) => hub.channel.send({ type: "broadcast", event: "world", payload }, { timeout: 5000 });
  const snapshot = (hub: Hub): WorldPresence[] => {
    const unique = new Map<string, WorldPresence>();
    for (const remote of hub.remote.values()) unique.set(remote.presence.id, remote.presence);
    for (const peer of hub.peers) if (peer.ws.readyState === WebSocket.OPEN) unique.set(peer.presence.id, peer.presence);
    return [...unique.values()];
  };
  function reconcile(hub: Hub, revision: number, allowedIds: string[], closed: boolean) {
    if (revision < hub.revision) return;
    hub.revision = revision;
    const allowed = new Set(allowedIds);
    for (const peer of hub.peers) if (closed || !allowed.has(peer.presence.testOwnerId ?? peer.presence.id)) peer.ws.close(4003, closed ? "The teacher ended this world" : "Your teacher removed you from this world");
    for (const [id, peer] of hub.remote) if (closed || !allowed.has(peer.presence.testOwnerId ?? peer.presence.id)) hub.remote.delete(id);
    hub.dirty = true;
  }
  function release(hub: Hub) {
    if (hub.peers.size || hub.pendingLifecycle || hubs.get(hub.id) !== hub) return;
    hubs.delete(hub.id); void supabase.removeChannel(hub.channel);
  }
  function hubFor(room: GameRoom): Hub {
    const found = hubs.get(room.id); if (found) return found;
    const channel = supabase.channel(`game-world:${room.id}`, { config: { private: true, broadcast: { self: false, ack: true } } });
    const hub: Hub = { id: room.id, revision: room.revision, channel, peers: new Set(), remote: new Map(), dirty: true, pendingLifecycle: 0, ready: Promise.resolve() };
    hubs.set(room.id, hub);
    channel.on("broadcast", { event: "world" }, ({ payload }) => {
      if (payload?.kind === "poses" && Array.isArray(payload.peers)) {
        for (const remote of payload.peers as WirePresence[]) {
          if (!remote?.presence?.id || typeof remote.peerId !== "string") continue;
          const newer = (other: WirePresence) => other.presence.id === remote.presence.id && (other.startedAt > remote.startedAt || other.startedAt === remote.startedAt && other.peerId > remote.peerId);
          if ([...hub.peers].some(newer) || [...hub.remote.values()].some(newer)) continue;
          // A second tab takes over this player's avatar, including across servers.
          for (const local of hub.peers) if (local.presence.id === remote.presence.id && (remote.startedAt > local.startedAt || remote.startedAt === local.startedAt && remote.peerId > local.peerId)) local.ws.close(4009, "This world was opened in another tab");
          for (const [id, previous] of hub.remote) if (previous.presence.id === remote.presence.id && id !== remote.peerId && previous.startedAt <= remote.startedAt) hub.remote.delete(id);
          hub.remote.set(remote.peerId, { ...remote, at: Date.now() });
        }
        hub.dirty = true;
      } else if (payload?.kind === "leave") { hub.remote.delete(payload.peerId); hub.dirty = true; }
      else if (payload?.kind === "sync") { for (const peer of hub.peers) peer.dirty = true; }
      else if (payload?.kind === "room" && Number.isInteger(payload.revision) && Array.isArray(payload.allowedIds)) reconcile(hub, payload.revision, payload.allowedIds, Boolean(payload.closed));
    });
    hub.ready = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(gameError("World service unavailable", 503)), 12000);
      channel.subscribe(status => {
        if (status === "SUBSCRIBED") { clearTimeout(timeout); resolve(); void signal(hub, { kind: "sync" }); }
        else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
          clearTimeout(timeout); reject(gameError("World service reconnecting", 503));
          for (const peer of hub.peers) peer.ws.close(1013, "World service reconnecting");
        }
      });
    });
    return hub;
  }
  const changed = (room: GameRoom) => {
    // An HTTP-only process still needs to publish to the socket-owning process.
    // Reuse a temporary hub so concurrent actions (or a joining socket) share
    // one subscription instead of subscribing/unsubscribing the same topic twice.
    const hub = hubFor(room);
    const allowedIds = [room.hostId, ...room.players.map(player => player.id)], closed = Boolean(room.closedAt || room.phase !== "question");
    const payload = { kind: "room", revision: room.revision, allowedIds, closed };
    reconcile(hub, room.revision, allowedIds, closed);
    hub.pendingLifecycle++;
    void hub.ready.then(() => signal(hub, payload)).then(status => {
      if (status !== "ok") throw gameError("World lifecycle broadcast failed", 503);
    }).catch(() => {
      // The committed membership state remains authoritative during an outage.
      console.warn("World lifecycle notification unavailable; membership checks will reconcile.");
    }).finally(() => { hub.pendingLifecycle--; release(hub); });
  };
  worldRoomEvents.on("room", changed);
  server.on("upgrade", (request, socket, head) => {
    if (request.url?.split("?", 1)[0] !== "/api/game-rooms/world") return;
    if (!boardOriginAllowed(request.headers.origin, request.headers.host, allowedOrigins) || wss.clients.size >= 1024) { socket.destroy(); return; }
    wss.handleUpgrade(request, socket, head, ws => wss.emit("connection", ws));
  });
  wss.on("connection", ws => {
    let peer: Peer | undefined, hub: Hub | undefined, joining = false, count = 0, windowAt = Date.now();
    let timeout = setTimeout(() => ws.close(4001, "Sign in required"), 15000);
    ws.on("pong", () => { if (peer) peer.alive = true; });
    ws.on("message", raw => {
      const now = Date.now();
      if (now - windowAt >= 1000) { windowAt = now; count = 0; }
      if (++count > 40) { ws.close(1008, "Too many world updates"); return; }
      let message: Record<string, unknown>;
      try { message = JSON.parse(raw.toString()); if (!message || typeof message !== "object" || Array.isArray(message)) throw new Error(); } catch { ws.close(1008, "Invalid world message"); return; }
      if (!peer) {
        if (joining || message.type !== "join" || typeof message.token !== "string" || message.token.length > 20000 || typeof message.roomId !== "string") { ws.close(4001, "Sign in required"); return; }
        joining = true;
        clearTimeout(timeout);
        // Credentials have arrived. A slow upstream check is a temporary service
        // failure, not a missing sign-in that would permanently stop client retries.
        timeout = setTimeout(() => ws.close(1013, "World verification timed out. Reconnecting"), 30000);
        void (async () => {
          const character = parseWorldCharacter(message.character), token = String(message.token), actor = await gameUser(`Bearer ${token}`), room = await fetchGame(String(message.roomId));
          const testCharacter = message.testCharacter === true;
          access(room, actor, testCharacter);
          if (ws.readyState !== WebSocket.OPEN) return;
          hub = hubFor(room);
          const id = testCharacter ? `test:${actor.id}` : actor.id;
          const previous = snapshot(hub).find(item => item.id === id);
          peer = { ws, token, peerId: randomUUID(), startedAt: Date.now(), alive: true, dirty: true, lastMove: 0, lastEmote: 0, presence: { id, name: testCharacter ? "Test buddy" : actor.name, character, pose: previous?.pose ?? { ...WORLD_SPAWN, ...(testCharacter ? { x: 3 } : {}) }, ...(testCharacter ? { testOwnerId: actor.id } : {}) } };
          for (const existing of hub.peers) if (existing.presence.id === id) existing.ws.close(4009, "This world was opened in another tab");
          hub.peers.add(peer);
          await hub.ready;
          if (ws.readyState !== WebSocket.OPEN) { hub.peers.delete(peer); release(hub); return; }
          // Recheck after subscribing so a concurrent teacher removal cannot race the join.
          access(await fetchGame(room.id), actor, testCharacter);
          if (ws.readyState !== WebSocket.OPEN) return;
          clearTimeout(timeout);
          send(ws, { type: "ready", selfId: id, peers: snapshot(hub) });
          hub.dirty = true; void signal(hub, { kind: "poses", peers: [wire(peer)] });
        })().catch(error => ws.close(retryable(error) ? 1013 : 4003, retryable(error) ? "World service unavailable. Reconnecting" : "Cannot connect to this world"));
        return;
      }
      if (!hub) return;
      try {
        if (message.type === "move") {
          const pose = parseWorldPose(message.pose);
          if (now - peer.lastMove < 65 && !(peer.presence.pose.moving && !pose.moving)) return;
          if (pose.moving || Math.abs(pose.y - peer.presence.pose.y) > .001) clearEmote(peer.presence);
          peer.lastMove = now; peer.presence.pose = pose;
        } else if (message.type === "character") peer.presence.character = parseWorldCharacter(message.character);
        else if (message.type === "emote") {
          if (message.emote === null) clearEmote(peer.presence);
          else {
            const emote = parseWorldEmote(message.emote);
            if (now - peer.lastEmote < 700) return;
            peer.lastEmote = now; peer.presence.emote = emote; peer.presence.emoteAt = now;
          }
        } else throw new Error("Invalid world action");
        peer.dirty = true; hub.dirty = true;
      } catch { ws.close(1008, "Invalid world update"); }
    });
    ws.on("close", () => {
      clearTimeout(timeout);
      if (peer && hub) {
        hub.peers.delete(peer); hub.dirty = true;
        void signal(hub, { kind: "leave", peerId: peer.peerId }); release(hub);
      }
    });
    ws.on("error", () => ws.close());
  });
  const updates = setInterval(() => {
    for (const hub of hubs.values()) {
      const changedPeers = [...hub.peers].filter(peer => peer.dirty && peer.ws.readyState === WebSocket.OPEN);
      if (changedPeers.length) {
        for (const peer of changedPeers) peer.dirty = false;
        void signal(hub, { kind: "poses", peers: changedPeers.map(wire) });
      }
      if (!hub.dirty) continue;
      hub.dirty = false;
      const peers = snapshot(hub);
      for (const peer of hub.peers) send(peer.ws, { type: "presence", peers });
    }
  }, 100);
  const heartbeat = setInterval(() => {
    for (const hub of hubs.values()) {
      for (const [id, remote] of hub.remote) if (Date.now() - remote.at > 35000) { hub.remote.delete(id); hub.dirty = true; }
      for (const peer of hub.peers) {
        if (!peer.alive) { peer.ws.terminate(); continue; }
        peer.alive = false; peer.ws.ping();
        void (async () => {
          const actor = await gameUser(`Bearer ${peer.token}`), room = await fetchGame(hub.id);
          access(room, actor, Boolean(peer.presence.testOwnerId)); peer.presence.name = peer.presence.testOwnerId ? "Test buddy" : actor.name; peer.dirty = true; changed(room);
        })().catch(error => peer.ws.close(retryable(error) ? 1013 : 4003, retryable(error) ? "World service unavailable. Reconnecting" : "World access changed"));
      }
    }
  }, 15000);
  updates.unref(); heartbeat.unref();
  server.on("close", () => {
    clearInterval(updates); clearInterval(heartbeat); worldRoomEvents.off("room", changed);
    for (const ws of wss.clients) ws.terminate(); wss.close();
    for (const hub of hubs.values()) void supabase.removeChannel(hub.channel);
    hubs.clear();
  });
  return wss;
}
