import { Check, ChevronDown, Circle } from "lucide-react";
import type { GamePlayer } from "../../../../server/src/shared/gameRooms";
import "./team-ready.css";

type Props = {
  players: GamePlayer[]; readyIds: string[]; myId?: string; saving: boolean;
  disabled: boolean; observing: boolean; passageReview: boolean; onToggle: () => void;
};

export function TeamReadyControl({ players, readyIds, myId, saving, disabled, observing, passageReview, onToggle }: Props) {
  const active = players.filter(player => !player.excusedAt);
  const ready = active.filter(player => readyIds.includes(player.id));
  const voted = readyIds.includes(myId ?? "");
  const othersReady = ready.filter(player => player.id !== myId);
  const waiting = active.filter(player => !readyIds.includes(player.id));
  const hint = saving ? "Saving team work…" : voted ? waiting.length === 1 ? `Waiting for ${waiting[0].name}` : "Waiting for team" : othersReady.length === 1 ? `${othersReady[0].name} is ready` : othersReady.length ? "Your teammates are ready" : passageReview ? "Submit passage together" : "Move on together";
  return <div className={`game-ready-control${othersReady.length && !voted ? " partner-ready" : ""}${voted ? " voted" : ""}`} role="group" aria-label="Team readiness">
    <details className="game-ready-details">
      <summary aria-label={`Team readiness: ${ready.length} of ${active.length} ready`}>
        <span className="game-ready-count" aria-live="polite"><Check size={14} />{ready.length}/{active.length} ready</span>
        <ChevronDown size={12} aria-hidden="true" />
        <span className="game-ready-hint" role="status">{hint}</span>
      </summary>
      <div className="game-ready-popover">
        <strong>{passageReview ? "Passage submission" : "Next question"}</strong>
        <ul>{players.map(player => <li key={player.id} className={player.excusedAt ? "is-away" : readyIds.includes(player.id) ? "is-ready" : ""}>
          {readyIds.includes(player.id) && !player.excusedAt ? <Check size={15} /> : <Circle size={12} />}
          <span>{player.name}{player.id === myId ? " (you)" : ""}</span><small>{player.excusedAt ? "Left class" : readyIds.includes(player.id) ? "Ready" : "Waiting"}</small>
        </li>)}</ul>
        <p>Everyone still in class must be ready. Changing an answer clears the votes.</p>
      </div>
    </details>
    {!observing && <button className="game-ready-vote" aria-pressed={voted} aria-label={voted ? "Undo my ready vote" : passageReview ? "Ready to submit passage" : "Ready for next question"} disabled={disabled} onClick={onToggle}>
      {voted && <Check size={14} />}{voted ? "Ready · undo" : passageReview ? "Submit" : "Ready"}
    </button>}
  </div>;
}
