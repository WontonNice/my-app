import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronRight, Crown, FlaskConical, Gem, Heart, RotateCcw, Shield, Swords, Trophy, Users, X, Zap } from "lucide-react";
import type { GameView } from "../../../../../server/src/shared/gameRooms";
import { CRYSTAL_REINFORCEMENT_MS, crystalSpeedMultiplier, crystalTravelMs, crystalWaveSize, type CrystalCatalog, type CrystalSource, type CrystalView } from "../../../../../server/src/shared/crystalDefense";
import type { SelectedAnswers } from "../../../../../server/src/shared/examGrading";
import { createAuthHeaders, requestApi } from "../../../lib/api";
import { ExamSessionPage, type ExamGameSession } from "../../../pages/ExamSessionPage";
import { gameExamContent } from "../gameExamContent";
import "./crystal-defense.css";
import "./crystal-exam-player.css";

type Action = (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;
type PlaytestControl = { controlTest: boolean; switchControl: (test: boolean) => void };
type Props = { room: GameView; accessToken: string; actorId: string; act: Action; busy: boolean; error: string; open: boolean; setOpen: (open: boolean) => void; arena: boolean; onMonster: (id: string) => void; focusWorld: () => void; playtest?: PlaytestControl };

function crossingTime(wave: number) {
  const seconds = Math.ceil(crystalTravelMs(Math.max(1, wave)) / 1000);
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function CrystalAdminControls({ crystal, act, busy, onJump, compact = false }: { crystal: CrystalView; act: Action; busy: boolean; onJump: () => void; compact?: boolean }) {
  const waveInputId = useId();
  const [wave, setWave] = useState(String(Math.max(1, crystal.wave)));
  if (!crystal.canAdmin) return null;
  const targetWave = Number(wave);
  const validWave = wave.trim() !== "" && Number.isInteger(targetWave) && targetWave >= 1 && targetWave <= 9999;
  const configured = crystal.questionCount > 0;
  const canSetHearts = crystal.phase === "lobby" || crystal.phase === "battle" || crystal.phase === "intermission";
  const command = async (body: Record<string, unknown>) => {
    if (busy) return;
    const ok = await act("crystal-admin", body);
    if (ok && (body.operation === "jump-wave" || body.operation === "next-wave")) onJump();
  };
  const contents = <div className="crystal-admin-content">
    <p>Changes affect everyone in this game. Jumping replaces the monsters and keeps all points.</p>
    <form className="crystal-admin-wave" onSubmit={event => { event.preventDefault(); if (configured && validWave) void command({ operation: "jump-wave", wave: targetWave }); }}>
      <label htmlFor={waveInputId}>Jump to wave</label>
      <div><input id={waveInputId} type="number" inputMode="numeric" min={1} max={9999} step={1} required value={wave} onChange={event => setWave(event.target.value)} disabled={busy || !configured} /><button type="submit" disabled={busy || !configured || !validWave}>Jump</button><button type="button" disabled={busy || !configured || crystal.wave >= 9999} onClick={() => { void command({ operation: "next-wave" }); }}>Next wave</button></div>
    </form>
    <div className="crystal-admin-presets" aria-label="Wave shortcuts"><span>Try a wave</span>{[1, 5, 10].map(value => <button type="button" key={value} aria-label={`Jump to wave ${value}`} disabled={busy || !configured} onClick={() => { setWave(String(value)); void command({ operation: "jump-wave", wave: value }); }}>{value}</button>)}</div>
    <div className="crystal-admin-hearts"><button type="button" disabled={busy || !canSetHearts || crystal.hearts === 5} onClick={() => { void command({ operation: "set-hearts", hearts: 5 }); }}><Heart size={13} />Restore 5 hearts</button><button type="button" className="crystal-admin-destroy" disabled={busy || !canSetHearts || crystal.hearts === 0} onClick={() => { void command({ operation: "set-hearts", hearts: 0 }); }}>Destroy crystal</button></div>
    {!configured ? <small>Choose questions before jumping to a wave.</small> : !canSetHearts ? <small>Jump to any wave to restart with five hearts.</small> : <small>Destroy crystal ends the expedition immediately.</small>}
  </div>;
  return compact ? <details className="crystal-admin is-compact"><summary><Crown size={14} />Teacher controls</summary>{contents}</details> : <section className="crystal-admin" aria-label="Teacher controls"><h4><Crown size={14} />Teacher controls</h4>{contents}</section>;
}

function CrystalSetup({ token, roomId, crystal, act, busy }: { token: string; roomId: string; crystal?: CrystalView; act: Action; busy: boolean }) {
  const [catalog, setCatalog] = useState<CrystalCatalog>();
  const [error, setError] = useState(""), [reload, setReload] = useState(0);
  const [source, setSource] = useState<CrystalSource>(crystal?.config.source ?? { kind: "exam-math", assessmentId: "all" });
  useEffect(() => {
    let active = true;
    void requestApi<CrystalCatalog>(`/api/game-rooms/crystal-catalog?roomId=${encodeURIComponent(roomId)}`, { headers: createAuthHeaders(token) }).then(value => { if (active) { setCatalog(value); setError(""); } }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Could not load questions."); });
    return () => { active = false; };
  }, [token, roomId, reload]);
  const assessment = catalog?.assessments.find(item => item.id === (source.assessmentId ?? "all"));
  const infinite = source.kind === "infinite-math";
  const practiceModule = catalog?.infiniteModules?.find(item => item.id === (source.moduleId ?? "all"));
  const mathTopics = infinite ? practiceModule?.topics : assessment?.topics;
  const topic = mathTopics?.find(item => item.topic === source.topic);
  const available = infinite ? (source.subtopic ? topic?.subtopics.find(item => item.name === source.subtopic)?.count : source.topic ? topic?.count : practiceModule?.topics.reduce((sum, item) => sum + item.count, 0)) ?? 0 : source.kind === "lab-reading" ? (source.topic ? catalog?.readingTopics.find(item => item.topic === source.topic)?.count : catalog?.readingTopics.reduce((sum, item) => sum + item.count, 0)) ?? 0 : source.subtopic ? topic?.subtopics.find(item => item.name === source.subtopic)?.count ?? 0 : topic?.count ?? assessment?.mathCount ?? 0;
  const submit = (event: FormEvent) => { event.preventDefault(); void act("crystal-configure", { source }); };
  return <form className="crystal-setup" onSubmit={submit}>
    <h4>Choose your challenge</h4>
    <label>Question source<select value={source.kind} onChange={event => setSource(event.target.value === "lab-reading" ? { kind: "lab-reading" } : event.target.value === "infinite-math" ? { kind: "infinite-math", moduleId: "all" } : { kind: "exam-math", assessmentId: "all" })}><option value="exam-math">Math · Exam questions</option><option value="lab-reading">Reading · SHSAT Lab</option><option value="infinite-math" disabled={!catalog?.infiniteAvailable}>Math · Infinite practice</option></select></label>
    {source.kind === "exam-math" && <label>Exam<select value={source.assessmentId ?? "all"} onChange={event => setSource({ kind: "exam-math", assessmentId: event.target.value })}>{catalog?.assessments.map(item => <option key={item.id} value={item.id}>{item.title} · {item.mathCount}</option>)}</select></label>}
    {infinite && <label>Practice module<select value={source.moduleId ?? "all"} onChange={event => setSource({ kind: "infinite-math", moduleId: event.target.value })}>{catalog?.infiniteModules?.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}</select><small>{practiceModule?.description}</small></label>}
    <div className="crystal-form-row"><label>{source.kind !== "lab-reading" ? "Math category" : "Reading skill"}<select value={source.topic ?? ""} onChange={event => setSource({ ...source, topic: event.target.value || undefined, subtopic: undefined })}><option value="">All {source.kind !== "lab-reading" ? "categories" : "skills"}</option>{(source.kind !== "lab-reading" ? mathTopics : catalog?.readingTopics)?.map(item => <option key={item.topic} value={item.topic}>{item.topic} · {item.count}</option>)}</select></label>{source.kind !== "lab-reading" && <label>Subcategory<select value={source.subtopic ?? ""} disabled={!source.topic} onChange={event => setSource({ ...source, subtopic: event.target.value || undefined })}><option value="">All subcategories</option>{topic?.subtopics.map(item => <option key={item.name} value={item.name}>{item.name} · {item.count}</option>)}</select></label>}</div>
    <div className="crystal-source-note"><strong>{infinite ? `${available} question ${available === 1 ? "type" : "types"} · Unlimited practice` : `${available} questions · Endless waves`}</strong><span>{infinite ? "Generate a variation for each monster from your selected practice types. Variations can repeat across long sessions." : "The selected questions reshuffle and repeat after each pass. Survive until the crystal falls."}</span></div>
    <button className="crystal-primary" disabled={busy || !catalog || available === 0}>{crystal ? "Update challenge" : "Open defense lobby"}<ChevronRight size={16} /></button>
    {error && <p role="alert">{error} <button type="button" onClick={() => setReload(value => value + 1)}>Retry</button></p>}
  </form>;
}

function CrystalAdminDialog({ crystal, act, busy, error, onClose, onJump }: { crystal: CrystalView; act: Action; busy: boolean; error: string; onClose: () => void; onJump: () => void }) {
  const surface = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => { surface.current?.querySelector<HTMLButtonElement>("button")?.focus(); }, []);
  return <div className="crystal-admin-backdrop"><div className="crystal-admin-dialog" ref={surface} role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={event => {
    if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
    if (event.key !== "Tab") return;
    const nodes = Array.from(surface.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]') ?? []).filter(node => node.getClientRects().length > 0);
    if (!nodes.length) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes.at(-1)?.focus(); }
    else if (!event.shiftKey && document.activeElement === nodes.at(-1)) { event.preventDefault(); nodes[0].focus(); }
  }}>
    <header><h3 id={titleId}><Crown size={18} />Teacher controls</h3><button type="button" onClick={onClose} aria-label="Close teacher controls"><X size={20} /></button></header>
    <CrystalAdminControls crystal={crystal} act={act} busy={busy} onJump={onJump} />
    {error && <p className="crystal-admin-error" role="alert">{error}</p>}
  </div></div>;
}

function CrystalQuestion({ challenge, crystal, act, busy, error, focusWorld, onJump, playtest }: { challenge: CrystalView["challenges"][number]; crystal: CrystalView; act: Action; busy: boolean; error: string; focusWorld: () => void; onJump: () => void; playtest?: PlaytestControl }) {
  const [answers, setAnswers] = useState<SelectedAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const inFlight = useRef(false);
  const surface = useRef<HTMLDialogElement>(null);
  const { question } = challenge.question;
  const retryAvailable = crystal.monsters.find(monster => monster.id === challenge.monsterId)?.retryAvailableFor === challenge.playerId;
  const lastResult = crystal.participants.find(player => player.id === challenge.playerId)?.lastResult;
  const retryUsed = lastResult?.monsterId === challenge.monsterId && lastResult.retry;
  useEffect(() => {
    const dialog = surface.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; focusWorld(); };
  }, [focusWorld]);
  const submit = async (values: SelectedAnswers) => {
    const answer = values[question.id];
    if (busy || inFlight.current || answer === undefined) return false;
    inFlight.current = true;
    setSubmitting(true);
    setSubmitError("");
    try {
      const ok = await act("crystal-answer", { monsterId: challenge.monsterId, attemptId: challenge.attemptId, answer });
      if (!ok) { inFlight.current = false; setSubmitting(false); }
      return ok;
    } catch {
      inFlight.current = false;
      setSubmitting(false);
      setSubmitError("Could not check your answer. Please try again.");
      return false;
    }
  };
  const id = `crystal:${crystal.runId}:${challenge.attemptId}`;
  const session: ExamGameSession = {
    ...gameExamContent(id, crystal.sourceTitle, [challenge.question]),
    assessment: { id, title: crystal.sourceTitle, classId: "shsat", createdAt: "", updatedAt: "", description: "Crystal Defense challenge", durationMinutes: 0, allowCompletedAccess: false, passages: [], questions: [], sectionAccess: { english: true, math: true }, split: false, status: "open" },
    answers,
    onAnswersChange: next => { if (!busy && !inFlight.current) setAnswers(next); },
    onSubmit: submit,
    studentName: crystal.participants.find(player => player.id === challenge.playerId)?.name ?? "Student",
    subjectPosition: { current: 1, total: 1 },
    timerText: "", hideTimer: true,
    lockedQuestionIds: busy || submitting ? [question.id] : [],
  };
  const content = <dialog className="crystal-exam-dialog" ref={surface} open={typeof document === "undefined" ? true : undefined} aria-labelledby="crystal-question-title" onCancel={event => event.preventDefault()}>
    <div className="crystal-exam-layout">
      <div className="crystal-exam-chrome game-rooms">
        <header className="crystal-exam-header"><Shield size={23} /><div><h3 id="crystal-question-title">Crystal Defense · Wave {crystal.wave}</h3><p>Your shield is holding. {crystal.teamShieldActive ? "Everyone is solving. Your monster is frozen; the others walk at half speed." : "This monster is frozen. The others keep walking."}</p></div><strong aria-label={`${crystal.hearts} of 5 crystal hearts`}><Heart size={17} fill="currentColor" />{crystal.hearts}/5</strong></header>
        {crystal.canAdmin && playtest && <div className="crystal-question-playtest"><span>Your challenge stays open while you switch.</span><button type="button" disabled={busy || submitting} onClick={() => playtest.switchControl(!playtest.controlTest)}>{playtest.controlTest ? "Control my character" : "Control test buddy"}</button></div>}
        <CrystalAdminControls crystal={crystal} act={act} busy={busy || submitting} onJump={onJump} compact />
        {(retryAvailable || retryUsed) && <div className={`crystal-retry-message${retryUsed ? " is-used" : ""}`} role="status"><RotateCcw size={17} /><span>{retryUsed ? "Not quite — your retry token kept this monster frozen. Try again using Next." : "Retry token active: you get one extra attempt on this question."}</span></div>}
      </div>
      <div className="crystal-exam-body"><fieldset disabled={busy || submitting} className="crystal-exam-surface"><ExamSessionPage gameSession={session} /></fieldset></div>
      <footer className="crystal-exam-footer">Answer this question before choosing another monster. <strong>Correct: +100 points.</strong> {retryAvailable ? "Your first wrong answer uses the retry token. You then answer this same question once more." : "A wrong answer releases this monster to keep walking. A teammate must rescue it."}</footer>
      {(error || submitError) && <div className="crystal-exam-error" role="alert">{error || submitError}</div>}
    </div>
  </dialog>;
  return typeof document === "undefined" ? content : createPortal(content, document.body);
}

export function CrystalDefensePanel({ room, accessToken, actorId, act, busy, error, open, setOpen, arena, onMonster, focusWorld, playtest }: Props) {
  const crystal = room.crystal;
  const canManage = Boolean(crystal?.isHost);
  const hostPlayer = crystal?.participants.find(player => player.id === crystal.hostId);
  const [settings, setSettings] = useState(false), [showTargets, setShowTargets] = useState(false), [adminOpen, setAdminOpen] = useState(false);
  const me = crystal?.participants.find(item => item.id === actorId && !item.left);
  const participants = crystal?.participants.filter(item => !item.left) ?? [];
  const online = participants.filter(item => item.online && !item.spectating);
  const allReady = Boolean(crystal?.questionCount && online.length > 0 && online.every(item => item.ready));
  const challenge = crystal?.phase === "battle" ? crystal.challenges.find(item => item.playerId === actorId) : undefined;
  const adminGame = useRef({ phase: crystal?.phase, runId: crystal?.runId });
  useEffect(() => {
    const changed = adminGame.current.phase !== crystal?.phase || adminGame.current.runId !== crystal?.runId;
    adminGame.current = { phase: crystal?.phase, runId: crystal?.runId };
    if (adminOpen && (changed || challenge || !crystal?.canAdmin)) { setAdminOpen(false); setOpen(false); focusWorld(); }
  }, [adminOpen, crystal?.phase, crystal?.runId, crystal?.canAdmin, challenge, setOpen, focusWorld]);
  const pendingMonster = crystal?.phase === "battle" ? crystal.monsters.find(monster => monster.id === me?.pendingMonsterId && (monster.status === "active" || monster.status === "challenged")) : undefined;
  const finished = crystal?.phase === "victory" || crystal?.phase === "defeat";
  const active = crystal?.monsters.filter(item => item.status === "active" || item.status === "challenged").length ?? 0;
  const shielded = crystal?.monsters.filter(item => item.status === "challenged").length ?? 0;
  const hasEligibleTarget = crystal?.monsters.some(monster => monster.status === "active" && !monster.failedIds.includes(actorId));
  const waitingForTarget = crystal?.phase === "battle" && me && !me.spectating && !challenge && !pendingMonster && !hasEligibleTarget;
  const scores = [...(crystal?.participants ?? [])].filter(player => !player.spectating).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const lastResult = me?.lastResult;
  const resultVisible = lastResult && room.serverNow - lastResult.at < 6000;
  const speedBonus = Math.round((crystalSpeedMultiplier(me?.speedStacks) - 1) * 100);
  const myItem = crystal?.items?.find(item => item.ownerId === actorId && item.pickedUpAt === undefined);
  const lastPickup = me?.lastPickup;
  const pickupVisible = lastPickup && room.serverNow - lastPickup.at < 6000 && !challenge && !finished;
  const call = async (action: string, body?: Record<string, unknown>) => { const ok = await act(action, body); if (ok) focusWorld(); return ok; };
  const closeAdmin = () => { setAdminOpen(false); setOpen(false); focusWorld(); };
  const finishAdminJump = () => { setAdminOpen(false); setOpen(false); focusWorld(); };
  return <>
    {!arena && <button className="crystal-launcher" onClick={() => setOpen(true)}><Gem size={19} /><span><strong>Crystal Defense</strong><small>{me ? me.ready ? "Ready for the expedition" : "You're in the defense lobby" : "Enter the glowing gate to join"}</small></span><ChevronRight size={15} /></button>}
    {arena && crystal && <>
      <div className="crystal-hud"><div className="crystal-hearts" aria-label={`${crystal.hearts} of 5 crystal hearts`}>{Array.from({ length: 5 }, (_, index) => <Heart key={index} size={21} fill={index < crystal.hearts ? "currentColor" : "none"} className={index < crystal.hearts ? "" : "is-empty"} />)}</div><strong>Wave {crystal.wave} · Endless</strong><span>{active - shielded} walking · {shielded} shielded</span><span>Base crossing: {crossingTime(crystal.wave)}</span>{crystal.teamShieldActive && <span className="crystal-team-shield"><Shield size={12} />Team shield · Half speed</span>}<div className="crystal-team-score"><Gem size={16} />{crystal.totalPoints.toLocaleString()} <small>TEAM POINTS</small></div><button onClick={() => setOpen(true)}>Game details</button>{crystal.canAdmin && !challenge && !finished && <button type="button" className="crystal-admin-launcher" aria-haspopup="dialog" aria-expanded={adminOpen} onClick={() => { setOpen(true); setShowTargets(false); setAdminOpen(true); }}><Crown size={13} />Teacher controls</button>}</div>
      {me && !me.spectating && <aside className="crystal-inventory" aria-label="Your wave items"><span><Zap size={14} />Speed +{speedBonus}%{speedBonus === 30 ? " · MAX" : ""}</span><span><RotateCcw size={14} />{me.retryReady ? "Retry ready for next question" : challenge && crystal.monsters.some(monster => monster.id === challenge.monsterId && monster.retryAvailableFor === actorId) ? "Retry active on this question" : "No retry token"}</span><small><FlaskConical size={13} />{myItem ? `Your ${myItem.kind === "speed" ? "speed potion" : "retry token"} is on the field. Walk over it!` : me.pickedItemWave === crystal.wave ? "Wave item collected · One per player" : "Your next drop arrives next wave."}</small></aside>}
      <aside className="crystal-leaderboard" aria-label="Point leaderboard"><h4><Trophy size={15} />Crystal defenders</h4><ol>{scores.slice(0, 8).map(player => <li key={player.id} className={player.id === actorId ? "is-you" : ""}><span>{player.id === crystal?.hostId && <Crown className="world-host-crown" size={12} aria-label="Game host" />}{player.name}{player.id === actorId ? " (you)" : ""}</span><strong>{player.score}</strong></li>)}</ol>{scores.length > 8 && <button onClick={() => setOpen(true)}>All {scores.length} players</button>}</aside>
      {!challenge && !finished && <div className="crystal-battle-hint"><Shield size={17} /><span>{crystal.phase === "intermission" ? "Wave cleared! Regroup at the crystal for the next wave." : me?.spectating ? "Spectating your class. Pan the camera or follow a student below." : pendingMonster ? pendingMonster.claimedBy ? "A teammate is solving your current monster. You can continue when it is free, or choose another after it is resolved." : "Return to your current monster to finish its question before choosing another." : waitingForTarget ? `No monster you can answer? Reinforcements arrive after ${CRYSTAL_REINFORCEMENT_MS / 1000} seconds without an available target.` : "Walk to a monster, then click it or press E to challenge."}</span>{!me?.spectating && <button onClick={() => setShowTargets(value => !value)} aria-expanded={showTargets}>Monsters</button>}</div>}
      {showTargets && !me?.spectating && !challenge && !finished && <aside className="crystal-targets"><div><strong>Nearby challenges</strong><button onClick={() => setShowTargets(false)} aria-label="Close monster list"><X size={15} /></button></div>{crystal.monsters.filter(monster => monster.status === "active" || monster.status === "challenged").map((monster, index) => <button key={monster.id} disabled={busy || monster.status === "challenged" || monster.failedIds.includes(actorId) || Boolean(pendingMonster && monster.id !== pendingMonster.id)} onClick={() => { onMonster(monster.id); setShowTargets(false); }}><span>Monster {index + 1}{monster.stage ? " · Needs rescue" : ""}</span><small>{pendingMonster && monster.id !== pendingMonster.id ? "Finish your current monster first" : monster.failedIds.includes(actorId) ? "A teammate must try" : monster.claimedBy ? "Being challenged" : "Approach, then challenge"}</small></button>)}{!active && <p>Waiting for the next wave.</p>}</aside>}
      {resultVisible && !lastResult.retry && <div className={`crystal-result ${lastResult.correct ? "is-correct" : "is-wrong"}`} role="status">{lastResult.correct ? <><SparkleMark />Monster defeated! +100 points</> : <><Shield size={18} />Monster is walking again. A teammate can rescue it.</>}</div>}
      {pickupVisible && <div className="crystal-pickup-notice" role="status">{lastPickup.kind === "speed" ? <><Zap size={18} />Speed potion! Movement +{speedBonus}% · Maximum +30%</> : <><RotateCcw size={18} />Retry token ready for your next question.</>}</div>}
      {finished && <div className={`crystal-finish${crystal.canAdmin ? " has-admin" : ""}`}><Gem size={42} /><span>EXPEDITION COMPLETE</span><h3>{crystal.phase === "victory" ? "Crystal protected!" : "The crystal needs another chance."}</h3><p>{crystal.notice}</p><strong>{crystal.totalPoints.toLocaleString()} team points</strong><small>Reached wave {crystal.wave} · {crystal.defeated} monsters defeated</small><button className="crystal-primary" disabled={busy} onClick={() => { void call(canManage ? "crystal-reset" : "crystal-leave"); }}>{canManage ? "Return everyone to lobby" : "Return to lobby"}</button><CrystalAdminControls crystal={crystal} act={act} busy={busy} onJump={finishAdminJump} />{error && <div className="crystal-finish-error" role="alert">{error}</div>}</div>}
    </>}
    {open && !challenge && !adminOpen && <aside className="crystal-panel" aria-label="Crystal Defense lobby"><div className="crystal-panel-title"><span><Gem size={20} />Crystal Defense</span><button onClick={() => { setOpen(false); focusWorld(); }} aria-label="Close Crystal Defense details"><X size={18} /></button></div>
      <p className="crystal-tagline">Stand together. Think it through. Protect the crystal.</p>
      {crystal && <div className="crystal-host-status"><Crown size={16} /><span>{hostPlayer ? `${hostPlayer.name}${canManage ? " (you)" : ""} is hosting` : "Waiting for a host to enter"}</span></div>}
      {canManage && crystal && (!crystal.questionCount || settings && (crystal.phase === "lobby" || finished)) ? <><CrystalSetup key={crystal?.runId ?? "new"} token={accessToken} roomId={room.id} crystal={crystal} act={async (action, body, quiet) => { const ok = await act(action, body, quiet); if (ok) setSettings(false); return ok; }} busy={busy} />{crystal && <button onClick={() => setSettings(false)}>Back to lobby</button>}</> : !crystal ? <div className="crystal-empty"><Shield size={30} /><h4>Enter the defense lobby.</h4><p>The first student becomes host. The teacher takes over whenever they enter.</p><button className="crystal-primary" disabled={busy} onClick={() => { void call("crystal-join"); }}>Join defense lobby</button></div> : <>
        <div className="crystal-config-summary"><span>{crystal.sourceTitle}</span><strong>{crystal.config.source.kind === "infinite-math" ? "Unlimited generated practice" : `${crystal.questionCount} questions · Endless waves`}</strong>{canManage && (crystal.phase === "lobby" || finished) && <button onClick={() => setSettings(true)}>Change topics</button>}</div>
        <div className="crystal-rules"><span><Shield size={16} />Monsters freeze while you solve.</span><span><Heart size={16} />Five hearts. Lose one only when a monster reaches the crystal.</span><span><Users size={16} />Later waves bring bigger, faster crowds.</span></div>
        <div className="crystal-item-rules"><h4><FlaskConical size={15} />One item for each defender, every wave</h4><p>Find your glowing drop and walk over it. Your drop is reserved for you; you cannot collect another player's.</p><p><strong>Speed potion:</strong> +10% movement speed for this expedition, up to +30% total.</p><p><strong>Retry token:</strong> one extra attempt on the next question you open. Hold up to one token. It keeps the monster frozen after your first mistake.</p></div>
        <div className="crystal-tempo"><strong>Wave {Math.max(1, crystal.wave)} · Base crossing: {crossingTime(crystal.wave)}</strong><span>Crossing starts at {crossingTime(1)} and gets 10 seconds faster each wave, down to {crossingTime(9999)}.</span><span className={crystal.teamShieldActive ? "is-shield-active" : ""}><Shield size={13} />{crystal.teamShieldActive ? "Team shield active: other monsters walk at half speed." : "When everyone is solving, a team shield slows other monsters to half speed."}</span><span>If a defender has no monster they can answer, reinforcements arrive after {CRYSTAL_REINFORCEMENT_MS / 1000} seconds. Existing monsters keep walking.</span></div>
        <div className="crystal-roster-title"><h4>{crystal.phase === "lobby" ? "Ready at the gate" : "Your defenders"}</h4><span>{online.length} online</span></div>
        <ul className="crystal-roster">{participants.map(player => <li key={player.id}><span className={player.ready ? "is-ready" : ""}>{player.ready ? <Check size={13} /> : <Users size={13} />}</span><strong>{player.id === crystal?.hostId && <Crown className="world-host-crown" size={13} aria-label="Game host" />}{player.name}{player.id === actorId ? " (you)" : ""}</strong><small>{player.spectating ? "Spectating" : crystal.phase !== "lobby" ? `${player.score} pts` : !player.online ? "Offline" : player.ready ? "Ready" : "Getting ready"}</small></li>)}</ul>
        {!participants.length && <p className="crystal-empty-note">Walk into the crystal gate to join, or use Join defense below.</p>}
        {crystal.phase === "lobby" && <><p className="crystal-pacing">{online.length} active {online.length === 1 ? "defender" : "defenders"}: the first wave brings {crystalWaveSize(online.length || 1, 1)} monsters. All are on the field. Challenge one to freeze it while you solve; rescue other monsters before they reach the crystal.</p><div className="crystal-lobby-actions">{!me ? <button className="crystal-primary" disabled={busy} onClick={() => { void call("crystal-join"); }}>Join defense</button> : me.spectating ? <p>You are spectating. Ready students can start without you.</p> : <><button className={me.ready ? "crystal-ready" : "crystal-primary"} disabled={busy || !crystal.questionCount} onClick={() => { void call("crystal-ready", { ready: !me.ready }); }}>{me.ready ? "Ready ✓ · Undo" : "I'm ready"}</button><button disabled={busy} onClick={() => { void call("crystal-leave"); }}>Leave queue</button></>}{canManage && <button className="crystal-primary" disabled={busy || !allReady} onClick={() => { void call("crystal-start").then(ok => { if (ok) setOpen(false); }); }}><Swords size={17} />Start expedition</button>}</div>{canManage && !allReady && <p className="crystal-empty-note">Choose questions, then start when everyone online is ready.</p>}</>}
        {crystal.phase !== "lobby" && !finished && <div className="crystal-lobby-actions">{me && <button disabled={busy} onClick={() => { void call("crystal-leave").then(ok => { if (ok) setOpen(false); }); }}>Return to island</button>}{canManage && <button disabled={busy} onClick={() => { void call("crystal-end"); }}>End expedition · Keep room open</button>}{!me && <p>The expedition is in progress. You can join the next one.</p>}</div>}
        <p className="crystal-empty-note">{crystal.notice}</p>
      </>}
      {crystal && <CrystalAdminControls crystal={crystal} act={act} busy={busy} onJump={finishAdminJump} />}
      {error && <p className="crystal-panel-error" role="alert">{error}</p>}
    </aside>}
    {adminOpen && crystal?.canAdmin && !challenge && <CrystalAdminDialog crystal={crystal} act={act} busy={busy} error={error} onClose={closeAdmin} onJump={finishAdminJump} />}
    {challenge && crystal && <CrystalQuestion key={`${crystal.runId}:${actorId}:${challenge.monsterId}:${challenge.attemptId}`} challenge={challenge} crystal={crystal} act={act} busy={busy} error={error} focusWorld={focusWorld} onJump={finishAdminJump} playtest={playtest} />}
  </>;
}

function SparkleMark() { return <Swords size={18} />; }
