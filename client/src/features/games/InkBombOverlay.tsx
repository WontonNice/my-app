import { useState } from "react";
import { Droplets } from "lucide-react";
import { INK_SPLATS, type GameTeam } from "../../../../server/src/shared/gameRooms";

type Ink = NonNullable<GameTeam["inkBomb"]>;
export function InkBombOverlay({ ink, now, observing, act }: { ink: Ink; now: number; observing: boolean; act: (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean> }) {
  const [pending, setPending] = useState<number[]>([]);
  const remaining = Math.max(0, Math.ceil((ink.expiresAt - now) / 1000));
  return <section className="game-ink-overlay" aria-label="Ink Bomb sabotage">
    <div className="game-ink-notice" role="status"><Droplets size={25} /><div><h2>Ink Bomb from {ink.source.teamName}!</h2><p>{observing ? "Watching the team clear the ink" : "Click the 5 splats. Your whole team can help!"}</p><strong>{ink.clearedSplats.length} / {INK_SPLATS} cleared · Fades in {remaining}s</strong></div></div>
    <div className="game-ink-splats">{Array.from({ length: INK_SPLATS }, (_, splat) => !ink.clearedSplats.includes(splat) && <button key={splat} className={`game-ink-splat splat-${splat}`} disabled={observing || pending.includes(splat)} aria-label={`Clear ink splat ${splat + 1}`} onClick={() => {
      setPending(current => [...current, splat]);
      void act("clear-ink", { inkId: ink.id, splat }, true).finally(() => setPending(current => current.filter(item => item !== splat)));
    }}><Droplets aria-hidden="true" /><span>{pending.includes(splat) ? "Clearing…" : "Clear ink"}</span></button>)}</div>
  </section>;
}
