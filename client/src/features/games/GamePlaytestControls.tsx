import { FlaskConical, RotateCcw, Users, Zap } from "lucide-react";
import { GAME_BOOSTERS, type GameView } from "../../../../server/src/shared/gameRooms";

import { TeamParticipation } from "./TeamParticipation";

type Props = { room: GameView; busy: boolean; act: (action: string, body?: Record<string, unknown>) => Promise<boolean> };
export function GamePlaytestControls({ room, busy, act }: Props) {
  if (!room.canPlaytest || !room.playtest) return null;
  const playing = room.phase === "question", hasPlayer = Boolean(room.me);
  const team = room.teams.find(item => item.id === room.me?.teamId);
  const locked = room.mode === "survival" && room.myAnswer !== undefined;
  return <section className="game-playtest" aria-label="Teacher playtest controls">
    <div className="game-playtest-heading"><span><FlaskConical size={20} /><strong>Solo playtest</strong><small>Private · Simulated players</small></span><p>Try every side of the game. Student records and achievements stay untouched.</p></div>
    <div className="game-playtest-controls">
      <label>Play as<select aria-label="Play as" value={room.playtest.controlledPlayerId ?? "host"} disabled={busy} onChange={event => { void act("test-control", { playerId: event.target.value === "host" ? null : event.target.value }); }}><option value="host">Teacher · host view</option>{room.players.map(player => <option key={player.id} value={player.id}>{player.name}{player.teamId ? ` · ${room.teams.find(item => item.id === player.teamId)?.name}` : !player.alive ? " · Audience" : ""}</option>)}</select></label>
      <label className="game-check"><input type="checkbox" checked={room.playtest.autoPlay} disabled={busy} onChange={event => { void act("test-auto", { enabled: event.target.checked }); }} /><span><strong>Automatic opponents</strong>One move about every 12 seconds</span></label>
      <button disabled={busy || !playing} onClick={() => { void act("test-step"); }}><Users size={15} />Other players answer</button>
      <button disabled={busy} onClick={() => { void act("test-reset"); }}><RotateCcw size={15} />Restart playtest</button>
      {room.mode === "teams" && <label className="game-check"><input type="checkbox" checked={room.party} disabled={busy} onChange={event => { void act("test-party", { enabled: event.target.checked }); }} /><span><strong>Party mode / sabotage shop</strong>Enable anytime in this private playtest</span></label>}
    </div>
    <details className="game-playtest-scenarios"><summary>Try a scenario <span>Answers, teammates, shop & timers</span></summary><div>
      <button disabled={busy || !playing || !hasPlayer || locked} onClick={() => { void act("test-answer", { correct: true }); }}>Submit correct answer</button>
      <button disabled={busy || !playing || !hasPlayer || locked} onClick={() => { void act("test-answer", { correct: false }); }}>Submit wrong answer</button>
      {room.mode === "teams" && <button disabled={busy || !playing || !team} onClick={() => { void act("test-teammate"); }}>Teammate picks an answer</button>}
      {room.mode === "teams" && <button disabled={busy || !playing || !team} onClick={() => { void act("test-team-ready"); }}>Teammates vote ready</button>}
      <button disabled={busy || !playing} onClick={() => { void act("test-expire"); }}>Run out the timer</button>
    </div><p>Switch to a teammate to see shared selections. Switch to an opponent to see the other side of a sabotage. Restart returns everyone to the lobby.</p></details>
    {room.mode === "teams" && <div className="game-booster-lab"><h4><Zap size={16} />Sabotage test bench</h4><button disabled={busy || !room.party || !playing || !team} onClick={() => { void act("test-coins"); }}>Give my team 1 coin</button>{!room.party && <p>Turn on Party mode above to test the shop.</p>}{GAME_BOOSTERS.map(item => <div key={item.id}><strong>{item.name}</strong><span>{item.description}</span><button disabled={busy || !room.party || !playing || !team} onClick={() => { void act("test-sabotage", { boosterId: item.id }); }}>Test {item.name} on me</button></div>)}<small>Grant a coin, buy a sabotage, then choose Use in the inventory and select a team. Test Landmine on yourself, answer the current question, then answer the next one incorrectly to trigger its blackout.</small></div>}
    <TeamParticipation room={room} busy={busy} act={act} />
  </section>;
}
