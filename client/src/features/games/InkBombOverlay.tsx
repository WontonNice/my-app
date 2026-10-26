import { useState } from "react";
import { Droplets } from "lucide-react";
import { INK_SPLATS, type GameTeam } from "../../../../server/src/shared/gameRooms";

type Ink = NonNullable<GameTeam["inkBomb"]>;
export function InkBombOverlay({ ink, now, observing, act }: { ink: Ink; now: number; observing: boolean; act: (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean> }) {
  // Keep local clears until this bomb unmounts so a slow or older poll cannot flash ink back.
  const [clicked, setClicked] = useState<number[]>([]);
  const cleared = new Set([...ink.clearedSplats, ...clicked]);
  const complete = cleared.size === INK_SPLATS;
  const remaining = Math.max(0, Math.ceil((ink.expiresAt - now) / 1000));
  return <section className={`game-ink-overlay${complete ? " is-cleared" : ""}`} aria-label="Ink Bomb sabotage">
    <div className="game-ink-notice" role="status"><Droplets size={25} /><div><h2>{complete ? "Ink cleared!" : `Ink Bomb from ${ink.source.teamName}!`}</h2><p>{complete ? "Syncing with your team…" : observing ? "Watching the team clear the ink" : `Click the ${INK_SPLATS} splats. Your whole team can help!`}</p><strong>{cleared.size} / {INK_SPLATS} cleared{!complete && ` · Fades in ${remaining}s`}</strong></div></div>
    <div className="game-ink-splats">{Array.from({ length: INK_SPLATS }, (_, splat) => <button key={splat} className={`game-ink-splat splat-${splat}`} style={{ visibility: cleared.has(splat) ? "hidden" : undefined }} disabled={observing || cleared.has(splat)} aria-hidden={cleared.has(splat)} aria-label={`Clear ink splat ${splat + 1}`} onClick={() => {
      setClicked(current => [...current, splat]);
      void act("clear-ink", { inkId: ink.id, splat }, true).then(ok => {
        if (!ok) setClicked(current => current.filter(item => item !== splat));
      }).catch(() => setClicked(current => current.filter(item => item !== splat)));
    }}><Droplets aria-hidden="true" /><span>Clear ink</span></button>)}</div>
  </section>;
}
