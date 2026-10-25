import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { WebSocket, WebSocketServer } from "ws";
import { supabase } from "./supabase";
import { fetchGame, gameUser } from "./gameStore";
import { gameView } from "./gameEngine";
import { boardOriginAllowed } from "./boardRealtime";
import type { GameCursor, GamePresence } from "../shared/gameRooms";

type Peer = { ws: WebSocket; token: string; teamId: string; observer?: string; playerId: string | null; presence: GamePresence | null; alive: boolean };
type Hub = { id: string; channel: RealtimeChannel; peers: Set<Peer>; remote: Map<string, { value: GamePresence; at: number }>; ready: Promise<void> };
const colors = ["#2563eb", "#b45309", "#9333ea", "#047857", "#be185d", "#0e7490"];
const send = (ws: WebSocket, value: unknown) => {
  if (ws.readyState !== WebSocket.OPEN) return;
  if (ws.bufferedAmount > 256 * 1024) { ws.close(1013, "Reconnecting cursors"); return; }
  ws.send(JSON.stringify(value));
};
export function parseGameCursor(value: unknown): GameCursor | null {
  if (value === null) return null;
  const cursor = value as Partial<GameCursor> | undefined;
  const unit = (number: unknown) => typeof number === "number" && Number.isFinite(number) && number >= 0 && number <= 1;
  if (!cursor || typeof cursor.anchor !== "string" || cursor.anchor.length > 160 || !unit(cursor.x) || !unit(cursor.y)
    || !Number.isInteger(cursor.index) || cursor.index! < 0 || !Number.isInteger(cursor.step) || cursor.step! < 0) throw new Error("Invalid cursor");
  return cursor as GameCursor;
}

/** Ephemeral cursor traffic uses the existing private server-to-server broadcast
 * transport. Scores and votes continue through the durable compare-and-swap API. */
export function attachGameRealtime(server: Server, allowedOrigins: string[]) {
  const hubs = new Map<string, Hub>();
  const wss = new WebSocketServer({ noServer: true, maxPayload: 32768, perMessageDeflate: false });
  const signal = (hub: Hub, payload: unknown) => hub.channel.send({ type: "broadcast", event: "cursor", payload });
  const tell = (hub: Hub) => {
    const peers = [...hub.peers].flatMap(peer => peer.presence ? [peer.presence] : []).concat([...hub.remote.values()].map(item => item.value));
    for (const peer of hub.peers) send(peer.ws, { type: "presence", peers: peers.filter(item => item.teamId === peer.teamId && item.cursor) });
  };
  function release(hub: Hub) {
    if (hub.peers.size || hubs.get(hub.id) !== hub) return;
    hubs.delete(hub.id); void supabase.removeChannel(hub.channel);
  }
  function hubFor(id: string): Hub {
    const existing = hubs.get(id); if (existing) return existing;
    const channel = supabase.channel(`game-cursors:${id}`, { config: { private: true, broadcast: { self: false } } });
    const hub: Hub = { id, channel, peers: new Set(), remote: new Map(), ready: Promise.resolve() };
    hubs.set(id, hub);
    channel.on("broadcast", { event: "cursor" }, ({ payload }) => {
      if (payload?.kind === "presence" && payload.presence) hub.remote.set(payload.presence.peerId, { value: payload.presence, at: Date.now() });
      else if (payload?.kind === "leave") hub.remote.delete(payload.peerId);
      tell(hub);
    });
    hub.ready = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Cursor service unavailable")), 12000);
      channel.subscribe(status => {
        if (status === "SUBSCRIBED") { clearTimeout(timeout); resolve(); }
        else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
          clearTimeout(timeout); reject(new Error("Cursor service reconnecting"));
          for (const peer of hub.peers) peer.ws.close(1013, "Cursor service reconnecting");
        }
      });
    });
    return hub;
  }
  server.on("upgrade", (request, socket, head) => {
    if (request.url?.split("?", 1)[0] !== "/api/game-rooms/live") return;
    if (!boardOriginAllowed(request.headers.origin, request.headers.host, allowedOrigins)) { socket.destroy(); return; }
    wss.handleUpgrade(request, socket, head, ws => wss.emit("connection", ws));
  });
  wss.on("connection", ws => {
    let peer: Peer | undefined, hub: Hub | undefined, joining = false, count = 0, windowAt = Date.now();
    const timeout = setTimeout(() => ws.close(4001, "Sign in required"), 15000);
    ws.on("pong", () => { if (peer) peer.alive = true; });
    ws.on("message", raw => {
      if (Date.now() - windowAt > 1000) { windowAt = Date.now(); count = 0; }
      if (++count > 25) { ws.close(1008, "Too many cursor updates"); return; }
      let message: Record<string, unknown>;
      try { message = JSON.parse(raw.toString()); if (!message || typeof message !== "object") throw new Error(); } catch { ws.close(1008); return; }
      if (!peer) {
        if (joining || message.type !== "join" || typeof message.token !== "string" || message.token.length > 20000 || typeof message.roomId !== "string") { ws.close(4001); return; }
        joining = true;
        void (async () => {
          const token = String(message.token), actor = await gameUser(`Bearer ${token}`), room = await fetchGame(String(message.roomId));
          const observer = typeof message.teamId === "string" ? message.teamId : undefined;
          const view = gameView(room, actor, Date.now(), observer), teamId = observer ?? view.me?.teamId;
          if (room.mode !== "teams" || room.phase !== "question" || !teamId || view.me?.excusedAt || room.playtest && !observer && message.playtestPlayerId !== view.me?.id) throw new Error("No active team to watch");
          if (ws.readyState !== WebSocket.OPEN) return;
          const player = view.me, colorIndex = room.players.findIndex(item => item.id === player?.id);
          peer = { ws, token, teamId, observer, playerId: player?.id ?? null, alive: true, presence: player ? { peerId: randomUUID(), playerId: player.id, teamId, name: player.name, color: colors[Math.max(0, colorIndex) % colors.length], cursor: null } : null };
          hub = hubFor(room.id); hub.peers.add(peer); clearTimeout(timeout);
          await hub.ready;
          send(ws, { type: "ready" }); tell(hub);
        })().catch(() => ws.close(4003, "Cannot connect to this team"));
        return;
      }
      if (!hub || message.type !== "cursor" || !peer.presence) return;
      try {
        peer.presence.cursor = parseGameCursor(message.cursor);
        tell(hub); void signal(hub, { kind: "presence", presence: peer.presence });
      } catch { ws.close(1008, "Invalid cursor"); }
    });
    ws.on("close", () => {
      clearTimeout(timeout);
      if (peer && hub) {
        hub.peers.delete(peer); tell(hub);
        if (peer.presence) void signal(hub, { kind: "leave", peerId: peer.presence.peerId });
        release(hub);
      }
    });
    ws.on("error", () => ws.close());
  });
  const timer = setInterval(() => {
    for (const hub of hubs.values()) {
      for (const [id, remote] of hub.remote) if (Date.now() - remote.at > 30000) hub.remote.delete(id);
      for (const peer of hub.peers) {
        if (!peer.alive) { peer.ws.terminate(); continue; }
        peer.alive = false; peer.ws.ping();
        void (async () => {
          const actor = await gameUser(`Bearer ${peer.token}`), room = await fetchGame(hub.id), view = gameView(room, actor, Date.now(), peer.observer);
          if (room.phase !== "question" || view.me?.excusedAt || !peer.observer && (view.me?.id !== peer.playerId || view.me?.teamId !== peer.teamId)) throw new Error("Team access changed");
          if (peer.presence) await signal(hub, { kind: "presence", presence: peer.presence });
        })().catch(() => peer.ws.close(4003, "Team access changed"));
      }
      tell(hub);
    }
  }, 15000);
  timer.unref();
  server.on("close", () => { clearInterval(timer); for (const ws of wss.clients) ws.terminate(); wss.close(); for (const hub of hubs.values()) void supabase.removeChannel(hub.channel); hubs.clear(); });
  return wss;
}
