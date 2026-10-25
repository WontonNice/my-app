import type { GameView } from "../../../../server/src/shared/gameRooms";

export function TeamParticipation({ room, busy, act }: { room: GameView; busy: boolean; act: (action: string, body?: Record<string, unknown>) => Promise<boolean> }) {
  if (!(room.isHost || room.canPlaytest) || room.mode !== "teams" || room.phase !== "question") return null;
  return <section className="game-participation game-card" aria-label="Class participation">
    <h3>Someone leaving early?</h3><p>Mark them as left class so only the remaining teammates need to vote. Restore them if they return. Team scores and saved answers are kept; active teammates vote again after a change.</p>
    {room.teams.map(team => <div key={team.id}><h4>{team.name}</h4>{room.players.filter(player => player.teamId === team.id).map(player => <div className="game-attendance-row" key={player.id}>
      <span><strong>{player.name}</strong><small>{player.excusedAt ? "Left class · Not required to vote" : "Playing · Vote required"}</small></span>
      <button disabled={busy} aria-label={`${player.excusedAt ? "Restore" : "Mark left class:"} ${player.name}`} onClick={() => { void act("set-participation", { playerId: player.id, active: Boolean(player.excusedAt) }); }}>{player.excusedAt ? "Restore player" : "Mark left class"}</button>
    </div>)}</div>)}
  </section>;
}
