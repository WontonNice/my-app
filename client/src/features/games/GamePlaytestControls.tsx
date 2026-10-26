import { useState } from "react";
import { FlaskConical, RotateCcw, Users, Zap, Coins, Eye, Pause, Play, Eraser, Check, X, ArrowRight, Package, Settings2 } from "lucide-react";
import { GAME_BOOSTERS, activeLandmines, hasActiveInk, type GameView } from "../../../../server/src/shared/gameRooms";
import { TeamParticipation } from "./TeamParticipation";
import "./playtest.css";

type Props = { room: GameView; busy: boolean; act: (action: string, body?: Record<string, unknown>) => Promise<boolean>; currentQuestionId?: string | null; onReturnToExam?: () => void };
const sections = [{ id: "question", label: "Question", icon: Check }, { id: "items", label: "Items & effects", icon: Package }, { id: "session", label: "Session", icon: Settings2 }] as const;

export function GamePlaytestControls({ room, busy, act, currentQuestionId, onReturnToExam }: Props) {
  const [section, setSection] = useState<"question" | "items" | "session">("question");
  const [question, setQuestion] = useState("");
  if (!room.canPlaytest || !room.playtest) return null;
  const playing = room.phase === "question", hasPlayer = Boolean(room.me);
  const team = room.teams.find(item => item.id === room.me?.teamId);
  const step = team?.step ?? 0;
  const reviewing = Boolean(team && step >= room.unit.length && playing);
  const current = team ? room.unit[step] : currentQuestionId === null ? undefined : room.unit.find(item => item.question.id === currentQuestionId) ?? room.unit[0];
  const answerKey = room.playtestKeys?.find(item => item.questionId === current?.question.id);
  const selected = current ? room.myAnswers[current.question.id] : undefined;
  const selectedText = selected === undefined ? "None" : typeof selected === "string" ? selected : Array.isArray(selected) ? selected.join(", ") : Object.values(selected).join(", ");
  const locked = room.mode === "survival" && room.myAnswer !== undefined || Boolean(team?.pendingFeedback?.some(item => item.questionId === current?.question.id));
  const affected = Boolean(team && (team.blockedUntil > room.serverNow || hasActiveInk(team, room.serverNow)));
  const paused = room.playtest.clockRemainingMs !== undefined;
  const canSelect = playing && hasPlayer && current && !locked && !affected && !room.me?.excusedAt;
  const navigation = { questionId: current?.question.id ?? room.unit[0]?.question.id, index: team?.index ?? room.round, step, draftVersion: team?.draftVersion ?? 0, playtestPlayerId: room.me?.id };
  const canSubmit = playing && hasPlayer && !affected && !room.me?.excusedAt && (reviewing || selected !== undefined);
  const choose = (correct: boolean) => { void act("test-select", { ...navigation, correct }); };
  const submit = () => { void act("test-next", navigation); };
  const mines = team ? activeLandmines(team) : [];
  return <section className="playtest-console" aria-label="Teacher playtest controls">
    <header className="playtest-heading"><FlaskConical size={21} /><div><h3>Sandbox</h3><p>Private playtest</p></div><span className="playtest-phase">{room.phase === "lobby" ? "Lobby" : playing ? paused ? "Timer paused" : "In progress" : "Round ended"}</span></header>
    <label className="playtest-pov"><span>Viewpoint</span><select aria-label="Play as" value={room.playtest.controlledPlayerId ?? "host"} disabled={busy} onChange={event => { void act("test-control", { playerId: event.target.value === "host" ? null : event.target.value }); }}><option value="host">Teacher · host view</option>{room.players.map(player => <option key={player.id} value={player.id}>{player.name}{player.teamId ? " · " + room.teams.find(item => item.id === player.teamId)?.name : !player.alive ? " · Audience" : ""}</option>)}</select></label>
    <nav className="playtest-nav" aria-label="Sandbox sections">{sections.filter(item => item.id !== "items" || room.mode === "teams").map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={section === id} onClick={() => setSection(id)}><Icon size={15} />{label}</button>)}</nav>
    {section === "question" && <div className="playtest-section">
      <section className="playtest-question-card" aria-label="Current sandbox question">
        <div className="playtest-question-title"><span>{reviewing ? "PASSAGE REVIEW" : answerKey ? "QUESTION " + answerKey.number + " OF " + room.totalQuestions : "CURRENT QUESTION"}</span>{team && room.unit.length > 1 && <small>{reviewing ? room.unit.length + " answers saved" : "Passage · " + (step + 1) + " / " + room.unit.length}</small>}</div>
        <h4>{!hasPlayer ? "Choose a student viewpoint" : !playing ? room.phase === "lobby" ? "Start the game to test answers" : "This round has ended" : reviewing ? "Review and submit the passage" : current?.question.prompt || "Return to the exam to continue"}</h4>
        {hasPlayer && playing && !reviewing && current && <div className="playtest-answer-values"><div><small>Answer key</small><strong>{answerKey?.answer ?? "Unavailable"}</strong></div><div><small>Saved selection</small><strong>{selectedText}</strong></div>{locked && <span className="playtest-locked"><Check size={13} />Locked</span>}</div>}
        {reviewing ? <p>All questions stay locked. Submit the saved passage to post its points and coins.</p> : <p>{locked ? "This answer has been revealed. Continue to the next question or use Jump to reopen it." : "Select fills only this question. It does not submit or move you forward."}</p>}
        <div className="playtest-answer-actions"><button className="playtest-correct" disabled={busy || !canSelect} onClick={() => choose(true)}><Check size={16} />Select correct</button><button className="playtest-incorrect" disabled={busy || !canSelect} onClick={() => choose(false)}><X size={16} />Select incorrect</button></div>
        {team || room.unit.length === 1 ? <button className="playtest-submit" disabled={busy || !canSubmit || room.mode === "survival" && locked} onClick={submit}>{reviewing ? "Submit passage" : locked ? "Continue to next question" : "Submit this question"}<ArrowRight size={16} /></button> : <button className="playtest-submit" disabled={!onReturnToExam} onClick={onReturnToExam}>Continue in exam<ArrowRight size={16} /></button>}
        {team && playing && <small className="playtest-help">Submit casts this team's votes for one step only.</small>}
      </section>
      {affected && <div className="playtest-recovery"><span>A sabotage is active on this team.</span><button disabled={busy} onClick={() => { void act("test-clear-effects"); }}><Eraser size={14} />Clear my effects</button></div>}
      {room.me?.excusedAt && <p className="playtest-help">This player has left class. Restore them in Session → Class participation.</p>}
      {team && <><label className="playtest-toggle"><span><strong>Teammates follow my vote</strong><small>Also applies when you use Ready in the exam.</small></span><input type="checkbox" checked={Boolean(room.playtest.autoReady)} disabled={busy} onChange={event => { void act("test-auto-ready", { enabled: event.target.checked }); }} /></label>
      <details className="playtest-details"><summary>Test teammate actions</summary><div className="playtest-actions"><button disabled={busy || !canSelect} onClick={() => { void act("test-teammate", navigation); }}><Users size={15} />Teammate selects correct</button><button disabled={busy || !canSubmit} onClick={() => { void act("test-team-ready", navigation); }}>Teammates vote ready</button></div><p>The first button selects only the current question. The second leaves your own vote to you.</p></details>
      <form className="playtest-jump" onSubmit={event => { event.preventDefault(); void act("test-jump", { question: Number(question || answerKey?.number || 1) }); }}><label>Jump to question<input aria-label="Jump to question" type="number" min={1} max={room.totalQuestions} value={question || answerKey?.number || 1} onChange={event => setQuestion(event.target.value)} required /></label><button disabled={busy || !team}>Jump</button><small>Reopens that question. Clears its passage and later answers; keeps coins and items.</small></form></>}
    </div>}
    {section === "items" && <div className="playtest-section">
      <div className="playtest-wallet"><Coins size={22} /><div><small>{team?.name ?? "Select a student"} wallet</small><strong>{team?.coins?.toLocaleString() ?? 0}<span> coins</span></strong></div><span>{room.playtest.unlimitedCoins ? "Unlimited spending" : "Normal spending"}</span></div>
      <label className="playtest-toggle"><span><strong>Unlimited coins</strong><small>Buy freely without draining the wallet.</small></span><input type="checkbox" checked={Boolean(room.playtest.unlimitedCoins)} disabled={busy} onChange={event => { void act("test-unlimited", { enabled: event.target.checked }); }} /></label>
      <label className="playtest-toggle"><span><strong>Party mode / shop</strong><small>Enable or disable shop items.</small></span><input type="checkbox" checked={room.party} disabled={busy} onChange={event => { void act("test-party", { enabled: event.target.checked }); }} /></label>
      <div className="playtest-actions"><button disabled={busy || !room.party || !team} onClick={() => { void act("test-coins", { amount: 100 }); }}>+100 coins</button><button disabled={busy || !room.party || !team} onClick={() => { void act("test-coins", { amount: 1000 }); }}>+1,000 coins</button><button disabled={busy || !room.party || !team} onClick={() => { void act("test-wallet", { amount: 0 }); }}>Empty wallet</button></div>
      <h4 className="playtest-section-title">Inventory</h4><div className="playtest-inventory">{GAME_BOOSTERS.map(item => <div key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><small>{team?.inventory?.[item.id] ?? 0} owned</small></div><button disabled={busy || !team} aria-label={"Add one " + item.name} onClick={() => { void act("test-inventory", { boosterId: item.id, amount: 1 }); }}>+1</button><button disabled={busy || !team} aria-label={"Add ten " + item.name} onClick={() => { void act("test-inventory", { boosterId: item.id, amount: 10 }); }}>+10</button></div>)}</div>
      <h4 className="playtest-section-title">Preview the receiving side</h4><p className="playtest-help">Apply an effect to the student you are viewing.</p>
      <div className="playtest-actions">{GAME_BOOSTERS.map(item => <button key={item.id} disabled={busy || !playing || !team} onClick={() => { void act("test-sabotage", { boosterId: item.id }); }}><Zap size={14} />{item.id === "landmine" ? "Arm Landmine here" : "Test " + item.name}</button>)}<button disabled={busy || !playing || !team} onClick={() => { void act("test-landmine-result", { outcome: "triggered" }); }}>Trigger Landmine</button><button disabled={busy || !playing || !team} onClick={() => { void act("test-landmine-result", { outcome: "defused" }); }}>Defuse Landmine</button></div>
      <div className="playtest-actions"><button disabled={busy || !room.playtest.lastTargetTeamId} onClick={() => { void act("test-view-target"); }}><Eye size={15} />Play as last target</button><button disabled={busy || !room.playtest.returnPlayerId || room.me?.id === room.playtest.returnPlayerId} onClick={() => { void act("test-return"); }}>Return to sender</button></div>
      <div className="playtest-actions"><button disabled={busy || !team} onClick={() => { void act("test-clear-effects"); }}><Eraser size={15} />Clear my effects</button><button disabled={busy || !team} onClick={() => { void act("test-clear-effects", { all: true }); }}>Clear all effects</button></div>
      {mines.length > 0 && <details className="playtest-details playtest-intel"><summary>{mines.length} armed {mines.length === 1 ? "landmine" : "landmines"} · Sandbox intel</summary><ul>{mines.map((mine, index) => <li key={mine.id ?? index}>{mine.source.teamName} · Q{mine.questionIndex + 1} · Choice {mine.choiceId ?? "any wrong answer"}</li>)}</ul></details>}
    </div>}
    {section === "session" && <div className="playtest-section">
      <div className="playtest-timer"><div><strong>{paused ? "Timer paused" : playing ? "Timer running" : "Timer inactive"}</strong><small>Pause while you inspect a scenario.</small></div><button disabled={busy || !playing} onClick={() => { void act("test-clock", { paused: !paused }); }}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? "Resume timer" : "Pause timer"}</button></div>
      <label className="playtest-toggle"><span><strong>Automatic opponents</strong><small>Let other teams play on their own.</small></span><input type="checkbox" checked={room.playtest.autoPlay} disabled={busy} onChange={event => { void act("test-auto", { enabled: event.target.checked }); }} /></label>
      <div className="playtest-actions"><button disabled={busy || !playing} onClick={() => { void act("test-step"); }}><Users size={15} />Advance opponents</button></div><p className="playtest-help">Advances opponents one question or complete passage.</p>
      {room.mode === "teams" && playing && <details className="playtest-details"><summary>Class participation</summary><TeamParticipation room={room} busy={busy} act={act} /></details>}
      <section className="playtest-reset"><h4>End or restart the simulation</h4><p>Expire the timer to test results. Restart clears all simulated answers, teams' wallets, and effects.</p><div className="playtest-actions"><button disabled={busy || !playing} onClick={() => { void act("test-expire"); }}>Expire timer</button><button disabled={busy} onClick={() => { void act("test-reset"); }}><RotateCcw size={15} />Restart playtest</button></div></section>
    </div>}
  </section>;
}
