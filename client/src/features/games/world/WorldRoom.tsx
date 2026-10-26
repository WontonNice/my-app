import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, Copy, Crown, Expand, FlaskConical, Globe2, HelpCircle, LogOut, Radio, Shirt, Sparkles, Users, X } from "lucide-react";
import type { GameView } from "../../../../../server/src/shared/gameRooms";
import { WORLD_CHARACTERS, WORLD_EMOTES, WORLD_MAX_PLAYERS, type WorldCharacterId, type WorldEmote } from "../../../../../server/src/shared/gameWorld";
import { AvatarPreview, WorldScene, type WorldSceneHandle } from "./WorldScene";
import { useWorldConnection } from "./useWorldConnection";
import { CrystalDefensePanel } from "./CrystalDefensePanel";
import { TeacherWorldControls, SpectatorCameraControls } from "./TeacherWorldControls";
import type { CrystalTeacherMode } from "../../../../../server/src/shared/crystalDefense";
import "./world.css";

type Props = { room: GameView; accessToken: string; act: (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>; busy: boolean; back: () => void; error: string };
function savedCharacter(): WorldCharacterId {
  try { const saved = localStorage.getItem("game-world-character"); return WORLD_CHARACTERS.find(item => item.id === saved)?.id ?? "astronaut"; } catch { return "astronaut"; }
}

export function WorldRoom({ room, accessToken, act, busy, back, error }: Props) {
  const teacherMode = room.crystal?.teacherMode ?? "play";
  const playtesting = room.isHost && teacherMode === "playtest";
  const spectating = room.isHost && teacherMode === "spectate";
  const [followId, setFollowId] = useState("");
  const [character, setCharacter] = useState<WorldCharacterId>(savedCharacter);
  const [testCharacter, setTestCharacter] = useState<WorldCharacterId>("frog");
  const [testSpawned, setTestSpawned] = useState(false), [controlTest, setControlTest] = useState(false);
  const [entered, setEntered] = useState(spectating), [wardrobe, setWardrobe] = useState(!spectating);
  const [showPlayers, setShowPlayers] = useState(false), [showHelp, setShowHelp] = useState(false), [confirmEnd, setConfirmEnd] = useState(false);
  const [emote, setEmote] = useState<{ id: WorldEmote; at: number }>();
  const [notice, setNotice] = useState("");
  const [worldHint, setWorldHint] = useState("");
  const [crystalPanelOpen, setCrystalPanelOpen] = useState(false);
  const viewport = useRef<HTMLDivElement>(null), lastEmote = useRef(0);
  const sceneControls = useRef<WorldSceneHandle>(null);
  const enabled = Boolean(entered && !room.closedAt && room.phase !== "finished");
  const network = useWorldConnection(room.id, accessToken, character, enabled);
  const testNetwork = useWorldConnection(room.id, accessToken, testCharacter, enabled && playtesting && testSpawned, true);
  const activeNetwork = controlTest ? testNetwork : network;
  const activeCharacter = controlTest ? testCharacter : character;
  const connected = activeNetwork.status === "connected";
  const ownId = network.selfId || room.me?.id || room.hostId;
  const selfId = controlTest ? testNetwork.selfId || `test:${room.hostId}` : ownId;
  const peers = [...(network.status === "connected" ? network.peers : testNetwork.peers)];
  const testPeer = testNetwork.peers.find(peer => peer.id === testNetwork.selfId);
  if (testPeer && !peers.some(peer => peer.id === testPeer.id)) peers.push(testPeer);
  const peopleCount = peers.filter(peer => !peer.testOwnerId).length;
  const selfName = peers.find(peer => peer.id === selfId)?.name || (controlTest ? "Test buddy" : room.me?.name || "Teacher");
  const crystal = room.crystal;
  const crystalMe = crystal?.participants.find(player => player.id === selfId && !player.left);
  const inArena = Boolean(crystalMe && crystal?.phase !== "lobby");
  const arenaIds = new Set(crystal && crystal.phase !== "lobby" ? crystal.participants.filter(player => !player.left).map(player => player.id) : []);
  const scenePeers = peers.filter(peer => !crystal?.participants.some(player => player.id === peer.id && player.spectating) && arenaIds.has(peer.id) === inArena);
  const challenge = crystal?.phase === "battle" ? crystal.challenges.find(item => item.playerId === selfId) : undefined;
  const heartbeatOwn = Boolean(crystal?.participants.some(player => player.id === ownId && !player.left));
  const heartbeatTest = Boolean(testSpawned && crystal?.participants.some(player => player.id === `test:${room.hostId}` && !player.left));
  const runId = crystal?.runId;
  useEffect(() => {
    if (!playtesting) { setControlTest(false); setTestSpawned(false); }
  }, [playtesting]);
  useEffect(() => {
    if (crystal?.phase === "battle" || crystal?.phase === "victory" || crystal?.phase === "defeat") setCrystalPanelOpen(false);
  }, [crystal?.phase]);
  useEffect(() => {
    if (!enabled || !runId || !heartbeatOwn && !heartbeatTest) return;
    const heartbeat = () => {
      if (heartbeatOwn) void act("crystal-heartbeat", { runId }, true);
      if (heartbeatTest) void act("crystal-heartbeat", { runId, asTestBuddy: true }, true);
    };
    heartbeat();
    const timer = window.setInterval(heartbeat, 15000);
    return () => window.clearInterval(timer);
  }, [act, enabled, runId, heartbeatOwn, heartbeatTest]);
  const selected = WORLD_CHARACTERS.find(item => item.id === activeCharacter)!;
  const choose = (id: WorldCharacterId) => {
    if (controlTest) { setTestCharacter(id); return; }
    setCharacter(id); try { localStorage.setItem("game-world-character", id); } catch { /* Optional preference. */ }
  };
  const focusWorld = useCallback(() => viewport.current?.querySelector<HTMLElement>(".world-scene-canvas")?.focus({ preventScroll: true }), []);
  const cancelEmote = useCallback(() => {
    setEmote(undefined); activeNetwork.send({ type: "emote", emote: null });
  }, [activeNetwork.send]);
  const express = useCallback((id: WorldEmote) => {
    focusWorld();
    if (emote?.id === id) { cancelEmote(); return; }
    const at = Date.now();
    if (at - lastEmote.current < 1100 || !activeNetwork.send({ type: "emote", emote: id })) return;
    lastEmote.current = at; setEmote({ id, at });
  }, [activeNetwork.send, cancelEmote, emote, focusWorld]);
  useEffect(() => {
    if (!emote) return;
    const timeout = window.setTimeout(() => setEmote(undefined), Math.max(0, 4000 - (Date.now() - emote.at)));
    return () => window.clearTimeout(timeout);
  }, [emote]);
  useEffect(() => {
    if (!worldHint) return;
    const timer = window.setTimeout(() => setWorldHint(""), 5000);
    return () => window.clearTimeout(timer);
  }, [worldHint]);
  const switchControl = (test: boolean) => {
    sceneControls.current?.stop(); activeNetwork.stop(); cancelEmote(); lastEmote.current = 0; setControlTest(test); focusWorld();
  };
  const removeTest = () => {
    if (controlTest) switchControl(false);
    if (runId && heartbeatTest) void act("crystal-leave", { runId, asTestBuddy: true }, true);
    setTestSpawned(false); focusWorld();
  };
  const crystalAct = useCallback(async (action: string, body?: Record<string, unknown>, quiet?: boolean) => act(action, { ...body, runId, asTestBuddy: controlTest }, quiet), [act, runId, controlTest]);
  const chooseTeacherMode = async (mode: CrystalTeacherMode) => {
    if (mode === teacherMode) return;
    sceneControls.current?.stop(); activeNetwork.stop(); cancelEmote();
    if (!await act("crystal-teacher-mode", { runId, mode })) return;
    setControlTest(false); setFollowId(""); setCrystalPanelOpen(false);
    if (mode !== "playtest") setTestSpawned(false);
    if (mode === "spectate") { setEntered(true); setWardrobe(false); }
    focusWorld();
  };
  const openCrystalPanel = (open: boolean) => {
    setCrystalPanelOpen(open);
    if (open && !crystalMe && (!crystal || crystal.phase === "lobby" || room.isHost)) void crystalAct("crystal-join");
  };
  const portalEnter = () => openCrystalPanel(true);
  const challengeMonster = (monsterId: string) => {
    sceneControls.current?.stop(); cancelEmote();
    void crystalAct("crystal-claim", { monsterId });
  };
  const leaveWorld = () => {
    if (runId && heartbeatOwn) void act("crystal-leave", { runId }, true);
    if (runId && heartbeatTest) void act("crystal-leave", { runId, asTestBuddy: true }, true);
    back();
  };
  const wave = useCallback(() => express("wave"), [express]);
  async function copyCode() {
    try { await navigator.clipboard.writeText(room.code); setNotice("Room code copied. Students enter it in Game rooms."); }
    catch { setNotice(`Your room code is ${room.code}. Students enter it in Game rooms.`); }
  }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await viewport.current?.requestFullscreen(); }
    catch { setNotice("Fullscreen is unavailable in this browser. You can still play here."); }
  }

  return <section className="world-room" aria-label="3D classroom world">
    <div className="world-heading">
      <div><button className="game-back" disabled={busy} onClick={leaveWorld}><ArrowLeft size={16} />All game rooms</button><div className="world-title"><span className="world-brand"><Globe2 size={25} /></span><div><span className="game-eyebrow">A world for your class</span><h2>{room.title}</h2></div><span className="world-beta">3D WORLD</span></div></div>
      <div className="world-heading-actions"><button className="world-code" onClick={() => { void copyCode(); }} title="Copy room code"><span>ROOM CODE<strong>{room.code}</strong></span><Copy size={15} /></button>{room.isHost && <button className="world-end" disabled={busy} onClick={() => setConfirmEnd(true)}><LogOut size={15} />End room</button>}</div>
    </div>
    {room.isHost && <TeacherWorldControls mode={teacherMode} busy={busy} onMode={mode => { void chooseTeacherMode(mode); }} />}
    {confirmEnd && <div className="game-confirm" role="alert"><span>End this world for everyone in your class?</span><button disabled={busy} onClick={() => { void act("finish"); }}>End world</button><button onClick={() => setConfirmEnd(false)}>Keep exploring</button></div>}
    <div className="world-viewport" ref={viewport}>
      <WorldScene spectating={spectating} followId={scenePeers.some(peer => peer.id === followId) ? followId : undefined} controlsRef={sceneControls} selfId={selfId} name={selfName} character={activeCharacter} players={scenePeers} arena={inArena ? "crystal" : "lobby"} crystal={crystal} gameHostId={crystal?.hostId} onPortalEnter={portalEnter} onMonsterClick={challengeMonster} onItemPickup={(itemId, position) => crystalAct("crystal-pickup", { itemId, ...position })} onHint={setWorldHint} initialPose={activeNetwork.pose} emote={emote} onMove={activeNetwork.move} onInteract={wave} onCancelEmote={cancelEmote} disabled={!connected || wardrobe || showHelp || confirmEnd || crystalPanelOpen || Boolean(challenge)} />
      <div className="world-topbar"><div className="world-location"><span className="world-location-icon"><Sparkles size={19} /></span><div><strong>{inArena ? "Crystal Defense" : "Classroom island"}</strong><small>{inArena ? "Stand together. Protect the crystal." : "Find your people. Make a little magic."}</small></div></div><div className="world-top-actions"><button onClick={() => { setShowPlayers(value => !value); setShowHelp(false); }} aria-expanded={showPlayers} title="Players in this world"><Users size={17} /><span>{peopleCount}/{WORLD_MAX_PLAYERS}</span></button><button onClick={() => { setShowHelp(value => !value); setShowPlayers(false); }} aria-expanded={showHelp} aria-label="How to play"><HelpCircle size={18} /></button><button onClick={() => { void fullscreen(); }} aria-label="Toggle fullscreen"><Expand size={18} /></button></div></div>
      {playtesting && entered && !wardrobe && <aside className={`world-playtest ${testSpawned ? "is-open" : ""} ${inArena ? "in-crystal-arena" : ""}`} aria-label="Teacher playtest">
        {!testSpawned ? <button className="world-add-test" disabled={network.status !== "connected"} onClick={() => { setTestSpawned(true); focusWorld(); }}><FlaskConical size={16} />Add test buddy</button> : <>
          <div className="world-playtest-heading"><strong><FlaskConical size={14} />Teacher playtest</strong><button onClick={removeTest} aria-label="Remove test buddy" title="Remove test buddy"><X size={15} /></button></div>
          <p>{testNetwork.status === "connected" ? `Controlling ${controlTest ? "Test buddy" : "your character"}. Switch to try both.` : testNetwork.message || "Adding your test buddy…"}</p>
          <div className="world-playtest-controls"><button aria-pressed={!controlTest} disabled={network.status !== "connected"} onClick={() => switchControl(false)}>My character</button><button aria-pressed={controlTest} disabled={testNetwork.status !== "connected"} onClick={() => switchControl(true)}>Test buddy</button></div>
          {testNetwork.status === "unavailable" && <button className="world-test-retry" onClick={testNetwork.retry}>Retry test buddy</button>}
        </>}
      </aside>}
      {showPlayers && <aside className="world-popover world-people"><div className="world-popover-title"><strong>On the island</strong><button onClick={() => setShowPlayers(false)} aria-label="Close player list"><X size={16} /></button></div><p>{peopleCount} connected · {room.players.length} students joined{peers.some(peer => peer.testOwnerId) ? " · 1 test buddy" : ""}</p>{peers.map(peer => <div className="world-person" key={peer.id}><span style={{ background: WORLD_CHARACTERS.find(item => item.id === peer.character)?.color }} /><strong>{peer.id === crystal?.hostId && <Crown className="world-host-crown" size={14} aria-label="Game host" />}{peer.name}{peer.id === selfId ? " (you)" : ""}</strong><small>{peer.testOwnerId ? "Test" : peer.id === crystal?.hostId ? "Game host" : peer.id === room.hostId ? "Teacher" : WORLD_CHARACTERS.find(item => item.id === peer.character)?.name}</small>{room.isHost && peer.id !== room.hostId && <button disabled={busy || Boolean(peer.testOwnerId && !testSpawned)} onClick={() => { if (peer.testOwnerId) removeTest(); else void act("remove", { playerId: peer.id }); }}>Remove</button>}</div>)}{room.isHost && room.players.filter(player => !peers.some(peer => peer.id === player.id)).map(player => <div className="world-person" key={player.id}><span className="world-offline-dot" /><strong>{player.name}</strong><small>Offline</small><button disabled={busy} onClick={() => { void act("remove", { playerId: player.id }); }}>Remove</button></div>)}{!entered && <p>Enter the world to see who is here.</p>}</aside>}
      {showHelp && <aside className="world-popover world-help"><div className="world-popover-title"><strong>A few little pointers</strong><button onClick={() => setShowHelp(false)} aria-label="Close controls"><X size={16} /></button></div><dl><div><dt>W A S D / arrows</dt><dd>Walk around</dd></div><div><dt>Space</dt><dd>Jump</dd></div><div><dt>Drag the world</dt><dd>Look around</dd></div><div><dt>Scroll</dt><dd>Zoom in or out</dd></div><div><dt>E near a gate / monster</dt><dd>Join / challenge</dd></div><div><dt>Emote buttons</dt><dd>Say hello to your class</dd></div><div><dt>Move / jump / Esc</dt><dd>Cancel an emote</dd></div></dl><p>On a touchscreen, use the movement and jump buttons. Press an active emote again to stop it. Keyboard movement works immediately after choosing an emote.</p></aside>}
      {wardrobe && <div className="world-dressing"><div className="world-chooser"><div className="world-chooser-heading"><span className="world-little-label">{entered ? "A fresh look" : "Your next adventure starts here"}</span>{entered && <button onClick={() => setWardrobe(false)} aria-label="Close character selection"><X size={18} /></button>}</div><h3>Who will you be?</h3><p>Pick a little character with a lot of personality.</p><div className="world-characters" role="group" aria-label="Choose your character">{WORLD_CHARACTERS.map(item => <button key={item.id} className={`world-character ${activeCharacter === item.id ? "is-selected" : ""}`} style={{ "--avatar-color": item.color } as CSSProperties} aria-pressed={activeCharacter === item.id} onClick={() => choose(item.id)}><span className="world-character-picture"><AvatarPreview character={item.id} />{activeCharacter === item.id && <span className="world-selected-check"><Check size={11} /></span>}</span><strong>{item.name}</strong></button>)}</div><div className="world-character-description"><Sparkles size={15} /><span>{selected.description}</span></div><button className="world-enter" onClick={() => { setEntered(true); setWardrobe(false); }}>{entered ? "Back to exploring" : "Enter the world"}<ArrowLeft size={18} style={{ transform: "rotate(180deg)" }} /></button><span className="world-chooser-note"><Users size={13} />Your classroom. Your shared adventure.</span></div></div>}
      {entered && !wardrobe && !spectating && <div className="world-bottom"><button className="world-outfit" aria-label={controlTest ? "Change test buddy character" : "Change character"} onClick={() => setWardrobe(true)}><Shirt size={17} /><span>{controlTest ? "Buddy outfit" : "Change character"}</span></button><div className="world-emotes" aria-label="Interact with classmates">{WORLD_EMOTES.map(item => <button key={item.id} onClick={() => express(item.id)} aria-pressed={emote?.id === item.id} disabled={!connected} title={emote?.id === item.id ? `Stop ${item.label.toLowerCase()}` : item.label}><span aria-hidden="true">{item.emoji}</span><small>{item.label}</small></button>)}</div><span className="world-movement-hint"><kbd>W A S D</kbd> move <kbd>SPACE</kbd> jump</span></div>}
      {entered && !connected && <div className="world-connection" role="status"><Radio size={18} /><span>{activeNetwork.message || "Joining your classroom island…"}</span>{activeNetwork.status === "unavailable" && <button onClick={activeNetwork.retry}>Try again</button>}</div>}
      {entered && !wardrobe && <CrystalDefensePanel room={room} accessToken={accessToken} actorId={selfId} act={crystalAct} busy={busy} error={error} open={crystalPanelOpen} setOpen={openCrystalPanel} arena={inArena} onMonster={id => { sceneControls.current?.interactMonster(id); focusWorld(); }} focusWorld={focusWorld} playtest={playtesting && testSpawned && network.status === "connected" && testNetwork.status === "connected" ? { controlTest, switchControl } : undefined} />}
      {spectating && entered && !wardrobe && <SpectatorCameraControls players={scenePeers.filter(peer => peer.id !== ownId)} followId={followId} onFollow={id => { setFollowId(id); focusWorld(); }} />}
      {worldHint && !challenge && <div className="world-scene-hint" role="status">{worldHint}</div>}
    </div>
    <footer className="world-footer"><span><i className={connected ? "is-live" : ""} />{connected ? "Live with your class" : activeNetwork.status === "unavailable" ? "World connection unavailable" : entered ? "Connecting to the world" : "Choose a character to get started"}</span><span>Walk, jump, wave & explore together</span><span>Classroom characters · Your shared island</span></footer>
    {(notice || error) && <div className="world-notice" role="status"><span>{error || notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss notice"><X size={14} /></button></div>}
  </section>;
}
