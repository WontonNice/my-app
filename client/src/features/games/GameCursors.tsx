import { useEffect, useRef, useState, type RefObject } from "react";
import type { GameCursor, GamePresence, GameView } from "../../../../server/src/shared/gameRooms";

const panels: Record<string, string> = { passage: ".exam-question-passage", question: ".exam-question-panel", math: ".exam-math-panel", standalone: ".exam-standalone-panel", review: ".exam-passage-end-page" };
function anchorElement(root: HTMLElement, anchor: string) {
  if (anchor.startsWith("id:")) { const node = document.getElementById(anchor.slice(3)); return node && root.contains(node) ? node : null; }
  return panels[anchor] ? root.querySelector(panels[anchor]) : root;
}

export function GameCursors({ room, token, surface, hidden = false }: { room: GameView; token: string; surface: RefObject<HTMLFieldSetElement | null>; hidden?: boolean }) {
  const [peers, setPeers] = useState<GamePresence[]>([]), [connected, setConnected] = useState(false);
  const [points, setPoints] = useState<(GamePresence & { left: number; top: number })[]>([]);
  const socketRef = useRef<WebSocket | null>(null), cursorRef = useRef<GameCursor | null>(null);
  const team = room.teams.find(item => item.id === (room.observingTeamId ?? room.me?.teamId));
  const teamId = team?.id, index = team?.index, step = team?.step ?? 0, observer = room.observingTeamId, playerId = room.me?.id;
  useEffect(() => {
    if (!teamId) return;
    let active = true, retry: number, socket: WebSocket, ready = false;
    function connect() {
      const base = import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL) : new URL(window.location.origin);
      base.protocol = base.protocol === "https:" ? "wss:" : "ws:"; base.pathname = "/api/game-rooms/live"; base.search = "";
      socket = new WebSocket(base); socketRef.current = socket;
      socket.onopen = () => socket.send(JSON.stringify({ type: "join", token, roomId: room.id, ...(observer ? { teamId: observer } : {}), playtestPlayerId: playerId }));
      socket.onmessage = event => {
        if (!active) return;
        try {
          const message = JSON.parse(event.data);
          if (message.type === "ready") { ready = true; setConnected(true); }
          if (message.type === "presence" && Array.isArray(message.peers)) setPeers(message.peers);
        } catch { socket.close(); }
      };
      socket.onclose = () => { ready = false; if (active) { setConnected(false); setPeers([]); retry = window.setTimeout(connect, 2000); } };
      socket.onerror = () => socket.close();
    }
    connect();
    const heartbeat = window.setInterval(() => {
      if (ready && !observer && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "cursor", cursor: cursorRef.current }));
    }, 3000);
    return () => { active = false; window.clearTimeout(retry); window.clearInterval(heartbeat); socket.close(); socketRef.current = null; cursorRef.current = null; };
  }, [room.id, token, teamId, observer, playerId]);
  useEffect(() => {
    const root = surface.current;
    if (!root || observer || index === undefined) return;
    let last = 0;
    const publish = (cursor: GameCursor | null) => {
      cursorRef.current = cursor;
      if (socketRef.current?.readyState === WebSocket.OPEN && connected) socketRef.current.send(JSON.stringify({ type: "cursor", cursor }));
    };
    const leave = () => publish(null);
    const move = (event: PointerEvent) => {
      if (hidden || Date.now() - last < 100) return;
      last = Date.now();
      const target = event.target instanceof Element ? event.target : root;
      let anchor = "surface", node: Element = root;
      const identified = target.closest("[id]");
      if (identified && root.contains(identified) && identified.id.length <= 150) { anchor = `id:${identified.id}`; node = identified; }
      else for (const [name, selector] of Object.entries(panels)) { const panel = target.closest(selector); if (panel && root.contains(panel)) { anchor = name; node = panel; break; } }
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      publish({ anchor, x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), index, step });
    };
    root.addEventListener("pointermove", move); root.addEventListener("pointerleave", leave); window.addEventListener("blur", leave);
    const visibility = () => { if (document.hidden) leave(); }; document.addEventListener("visibilitychange", visibility);
    return () => { leave(); root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); window.removeEventListener("blur", leave); document.removeEventListener("visibilitychange", visibility); };
  }, [surface, index, step, observer, hidden, connected]);
  useEffect(() => {
    const update = () => {
      const root = surface.current;
      setPoints(!root || hidden ? [] : peers.filter(peer => peer.teamId === teamId && peer.playerId !== playerId && peer.cursor !== null && peer.cursor.index === index && peer.cursor.step === step).flatMap(peer => {
        const element = anchorElement(root, peer.cursor!.anchor); if (!element) return [];
        const rect = element.getBoundingClientRect(), left = rect.left + peer.cursor!.x * rect.width, top = rect.top + peer.cursor!.y * rect.height;
        return top < 0 || top > window.innerHeight || left < 0 || left > window.innerWidth ? [] : [{ ...peer, left, top }];
      }));
    };
    const timer = window.setInterval(update, 100);
    window.addEventListener("scroll", update, true); window.addEventListener("resize", update);
    return () => { window.clearInterval(timer); window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [surface, peers, index, step, playerId, teamId, hidden]);
  if (!teamId) return null;
  return <><span className="game-cursor-status" role="status">{connected ? "Live team cursors" : "Team cursors reconnecting…"}</span>
    <div className="game-cursors" aria-hidden="true">{points.map(peer => <div className="game-cursor" key={peer.peerId} style={{ left: peer.left, top: peer.top, color: peer.color }}><svg width="19" height="23" viewBox="0 0 19 23"><path d="M1 1v18l5-5 4 8 4-2-4-7h8Z" fill="currentColor" stroke="white" strokeWidth="1.5" /></svg><span style={{ background: peer.color }}>{peer.name}</span></div>)}</div></>;
}
