import { Trophy } from "lucide-react";
import { hasActiveInk, type GameView } from "../../../../server/src/shared/gameRooms";

export function GameStandings({ room, now, onWatch }: { room: GameView; now: number; onWatch?: (teamId: string) => void }) {
  const standings = room.mode === "teams" ? [...room.teams].sort((a, b) => b.score - a.score || b.index - a.index) : [...room.players].sort((a, b) => Number(b.alive) - Number(a.alive) || b.score - a.score);
  return <section className="game-standings" aria-label="Live standings"><h3><Trophy size={18} />Live standings</h3>
    {room.mode === "survival" && <p>{room.players.filter(player => player.alive).length} standing · {room.answeredIds.length} / {room.players.length} answers locked</p>}
    {standings.map((item, rank) => <div key={item.id} className={`game-ranking ${room.winners.includes(item.id) ? "is-winner" : ""}`}>
      <span>{rank + 1}</span><div><strong>{item.name}</strong>
        {"index" in item && <span className="game-team-members">{room.players.filter(player => player.teamId === item.id).map(player => `${player.name}${player.excusedAt ? " (left class)" : ""}`).join(", ") || "No students assigned"}</span>}
        <small>{"index" in item ? item.index >= room.totalQuestions ? "Finished" : room.phase === "finished" ? `${item.index} of ${room.totalQuestions} answered` : `Question ${Math.min(item.index + (item.step ?? 0) + 1, room.totalQuestions)} of ${room.totalQuestions}${item.blockedUntil > now || hasActiveInk(item, now) ? " · Sabotaged" : ""}` : item.alive ? "Still standing" : "Audience"}</small>
        {"index" in item && room.party && <small>{item.coins ?? 0} {(item.coins ?? 0) === 1 ? "coin" : "coins"} · {item.streak} correct in a row</small>}
        {"index" in item && <progress value={item.index} max={room.totalQuestions} />}
        {"index" in item && onWatch && room.phase === "question" && <button onClick={() => onWatch(item.id)}>Watch {item.name}</button>}
      </div><b>{item.score}<small>pts</small></b>
    </div>)}
  </section>;
}
