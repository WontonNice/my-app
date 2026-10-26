import { useCallback, useEffect, useRef, useState } from "react";
import { WORLD_SPAWN, type WorldCharacterId, type WorldPose, type WorldPresence } from "../../../../../server/src/shared/gameWorld";
import { getSupabaseClient, isSupabaseConfigured } from "../../../lib/supabase";

export function useWorldConnection(roomId: string, token: string, character: WorldCharacterId, enabled: boolean, testCharacter = false) {
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "reconnecting" | "unavailable">("idle");
  const [peers, setPeers] = useState<WorldPresence[]>([]);
  const [selfId, setSelfId] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [message, setMessage] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(isSupabaseConfigured ? null : token);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const socketRef = useRef<WebSocket | null>(null), ready = useRef(false);
  const characterRef = useRef(character), poseRef = useRef<WorldPose>({ ...WORLD_SPAWN });
  const hasPose = useRef(false);
  characterRef.current = character;

  useEffect(() => {
    if (!isSupabaseConfigured) { setSessionToken(token); setAuthReady(true); return; }
    let active = true;
    const auth = getSupabaseClient().auth;
    const { data } = auth.onAuthStateChange((_event, session) => {
      if (active) { setSessionToken(session?.access_token ?? null); setAuthReady(true); }
    });
    void auth.getSession().then(({ data: current }) => {
      if (active) { setSessionToken(current.session?.access_token ?? null); setAuthReady(true); }
    }).catch(() => { if (active) { setSessionToken(null); setAuthReady(true); } });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [token]);

  const send = useCallback((value: Record<string, unknown>) => {
    const socket = socketRef.current;
    if (!ready.current || socket?.readyState !== WebSocket.OPEN || socket.bufferedAmount > 32768) return false;
    socket.send(JSON.stringify(value));
    return true;
  }, []);
  const move = useCallback((pose: WorldPose) => { poseRef.current = pose; hasPose.current = true; send({ type: "move", pose }); }, [send]);
  const stop = useCallback(() => { move({ ...poseRef.current, moving: false }); }, [move]);

  useEffect(() => {
    if (!enabled) { setStatus("idle"); setPeers([]); if (testCharacter) hasPose.current = false; return; }
    if (!authReady) { setStatus("connecting"); return; }
    if (!sessionToken) { setStatus("unavailable"); setMessage("Sign in again to rejoin your classroom world."); setPeers([]); return; }
    let active = true, retry: number | undefined, handshake: number | undefined, socket: WebSocket | undefined, attempts = 0;
    const connect = () => {
      if (!active) return;
      ready.current = false;
      setStatus(attempts ? "reconnecting" : "connecting");
      try {
        const base = import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL) : new URL(window.location.origin);
        base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
        base.pathname = "/api/game-rooms/world"; base.search = ""; base.hash = "";
        const current = new WebSocket(base);
        socket = current; socketRef.current = current;
        handshake = window.setTimeout(() => {
          if (active && current === socketRef.current && !ready.current) current.close();
        }, 35000);
        current.onopen = () => { if (active) current.send(JSON.stringify({ type: "join", token: sessionToken, roomId, character: characterRef.current, ...(testCharacter ? { testCharacter: true } : {}) })); };
        current.onmessage = event => {
          if (!active || current !== socketRef.current) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === "ready" && typeof data.selfId === "string") {
              window.clearTimeout(handshake);
              ready.current = true; attempts = 0; setSelfId(data.selfId); setStatus("connected"); setMessage("");
              const ownPresence = Array.isArray(data.peers) ? data.peers.find((peer: WorldPresence) => peer.id === data.selfId) as WorldPresence | undefined : undefined;
              if (!hasPose.current && ownPresence) poseRef.current = ownPresence.pose;
              hasPose.current = true;
              current.send(JSON.stringify({ type: "move", pose: poseRef.current }));
              current.send(JSON.stringify({ type: "character", character: characterRef.current }));
            }
            if ((data.type === "presence" || data.type === "ready") && Array.isArray(data.peers)) setPeers(data.peers);
          } catch { current.close(); }
        };
        current.onclose = event => {
          if (!active || current !== socketRef.current) return;
          window.clearTimeout(handshake);
          ready.current = false; setPeers([]);
          if ([4001, 4003, 4009, 1008].includes(event.code)) {
            setStatus("unavailable"); setMessage(event.reason || "This world is unavailable. Return to game rooms and try again.");
            return;
          }
          setStatus("reconnecting"); setMessage("Connection interrupted. Rejoining your class…");
          retry = window.setTimeout(connect, Math.min(1000 * 2 ** attempts++, 8000));
        };
        current.onerror = () => current.close();
      } catch {
        setStatus("unavailable"); setMessage("Could not connect to the world. Please try again.");
      }
    };
    connect();
    return () => { active = false; ready.current = false; window.clearTimeout(retry); window.clearTimeout(handshake); socket?.close(); socketRef.current = null; };
  }, [roomId, sessionToken, authReady, enabled, retryKey, testCharacter]);
  useEffect(() => { send({ type: "character", character }); }, [character, send]);
  return { status, peers, selfId, message, send, move, stop, pose: poseRef.current, retry: () => setRetryKey(value => value + 1) };
}
