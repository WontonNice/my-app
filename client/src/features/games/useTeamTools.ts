import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { emptyGameTools, type GameToolState } from "../../../../server/src/shared/gameTools";
import type { GameView } from "../../../../server/src/shared/gameRooms";

export type SharedExamTools = {
  own: GameToolState;
  peers: GameView["teamTools"];
  update: <K extends keyof GameToolState>(kind: K, change: SetStateAction<GameToolState[K]>) => void;
};
type Action = (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;

export function useTeamTools(room: GameView, act: Action) {
  const team = room.teams.find(item => item.id === (room.observingTeamId ?? room.me?.teamId));
  const teamId = team?.id, index = team?.index;
  const incoming = room.teamTools.find(layer => layer.playerId === room.me?.id)?.state;
  const [local, setLocal] = useState<GameToolState | null>(null);
  const [saving, setSaving] = useState(false);
  const current = useRef(incoming ?? emptyGameTools()), version = useRef(0), saved = useRef(0);
  const actionRef = useRef(act);
  useEffect(() => { actionRef.current = act; }, [act]);
  useEffect(() => { if (version.current === saved.current) current.current = incoming ?? emptyGameTools(); }, [incoming]);
  useEffect(() => {
    if (!teamId || index === undefined || room.observingTeamId) return;
    let active = true, inFlight = false, retryAt = 0;
    const timer = window.setInterval(() => {
      if (inFlight || version.current === saved.current || Date.now() < retryAt) return;
      inFlight = true;
      const sent = version.current;
      void actionRef.current("tools", { index, state: current.current }, true).then(ok => {
        if (!active) return;
        if (ok) { saved.current = sent; if (sent === version.current) { setLocal(null); setSaving(false); } }
        else retryAt = Date.now() + 2500;
      }).finally(() => { inFlight = false; });
    }, 250);
    return () => { active = false; window.clearInterval(timer); };
  }, [teamId, index, room.observingTeamId]);
  const update: SharedExamTools["update"] = (kind, change) => {
    if (room.observingTeamId || !team || room.me?.excusedAt) return;
    const next = typeof change === "function" ? (change as (state: GameToolState[typeof kind]) => GameToolState[typeof kind])(current.current[kind]) : change;
    current.current = { ...current.current, [kind]: next };
    version.current++; setLocal(current.current); setSaving(true);
  };
  return { saving, tools: team ? { own: local ?? incoming ?? emptyGameTools(), peers: room.teamTools.filter(layer => layer.playerId !== room.me?.id), update } : undefined };
}

export function toolSetter<K extends keyof GameToolState>(tools: SharedExamTools | undefined, key: K, fallback: Dispatch<SetStateAction<GameToolState[K]>>): Dispatch<SetStateAction<GameToolState[K]>> {
  return value => tools ? tools.update(key, value) : fallback(value);
}

export function mergeToolLists<T>(own: Record<string, T[]>, others: Record<string, T[]>[]): Record<string, T[]> {
  const combined = { ...own };
  for (const other of others) for (const [key, values] of Object.entries(other)) combined[key] = [...(combined[key] ?? []), ...values];
  return combined;
}
