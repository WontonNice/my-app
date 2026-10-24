import { useEffect, useMemo, useState } from "react";
import type { GameView } from "../../../../server/src/shared/gameRooms";
import { gameApi } from "./api";
import { GameExamPlayer } from "./GameExamPlayer";

export function TeamObserver({ room, teamId, token, onClose, onTeamChange, now }: { room: GameView; teamId: string; token: string; onClose: () => void; onTeamChange: (id: string) => void; now: number }) {
  const api = useMemo(() => gameApi(token), [token]);
  const [view, setView] = useState<GameView | null>(null), [error, setError] = useState("");
  useEffect(() => {
    let active = true, timer: number;
    async function poll() {
      try { const next = await api.get(room.id, teamId); if (active) { setView(current => current && current.revision > next.revision ? current : next); setError(""); } }
      catch (reason) { if (active) setError(reason instanceof Error ? reason.message : "Team view reconnecting…"); }
      finally { if (active) timer = window.setTimeout(() => { void poll(); }, 1000); }
    }
    void poll(); return () => { active = false; window.clearTimeout(timer); };
  }, [api, room.id, teamId]);
  const watchControls = <><label>Watching <select aria-label="Watch team" value={teamId} onChange={event => onTeamChange(event.target.value)}>{room.teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}</select></label><button onClick={onClose}>Back to host overview</button></>;
  if (!view?.current || !view.unit.length || view.phase !== "question") return <div className="game-observer-status game-rooms" role="dialog" aria-label="Team view"><h3>{room.teams.find(team => team.id === teamId)?.name}</h3><p>{error || (view ? "This team has finished." : "Connecting to the team…")}</p>{watchControls}</div>;
  const seconds = Math.max(0, Math.ceil(((view.deadline ?? now) - now) / 1000));
  return <GameExamPlayer key={teamId + ':' + view.teams.find(team => team.id === teamId)?.index} room={view} accessToken={token} act={async () => false} busy={false} now={now} timerText={`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`} error={error} watchControls={watchControls} />;
}
