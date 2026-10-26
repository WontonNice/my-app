import { randomInt, randomUUID } from "node:crypto";
import { isExamQuestionCorrect, type SelectedAnswer } from "../shared/examGrading";
import { CRYSTAL_ANIMATION_RETENTION_MS, CRYSTAL_CORRECT_POINTS, CRYSTAL_INTERMISSION_MS, CRYSTAL_MAX_HEARTS, CRYSTAL_OFFLINE_MS, CRYSTAL_PICKUP_DISTANCE, CRYSTAL_REINFORCEMENT_MS, crystalMaxStrikes, crystalTravelMs, crystalWaveSize, type CrystalConfig, type CrystalItem, type CrystalMonster, type CrystalParticipant, type CrystalState, type CrystalTeacherMode, type CrystalView } from "../shared/crystalDefense";
import type { GameQuestion, GameRoom } from "../shared/gameRooms";
import type { GameActor } from "./gameEngine";
import { generateCrystalPractice, loadCrystalQuestions } from "./crystalSources";

const fail = (message: string, status = 400): never => { throw Object.assign(new Error(message), { status }); };
const online = (player: CrystalParticipant, now: number) => !player.left && now - player.lastSeen < CRYSTAL_OFFLINE_MS;
const active = (state: CrystalState, now: number) => state.participants.filter(player => online(player, now) && !player.spectating);
const alive = (monster: CrystalMonster) => !["defeated", "breached"].includes(monster.status);
const solving = (state: CrystalState, player: CrystalParticipant) => state.monsters.some(monster => monster.status === "challenged" && monster.claimedBy === player.id);
const teamShield = (state: CrystalState, players: CrystalParticipant[]) => state.phase === "battle" && players.length > 0 && players.every(player => solving(state, player));
const speedStacks = (player: CrystalParticipant) => Math.min(3, Math.max(0, Number.isFinite(player.speedStacks) ? Math.floor(player.speedStacks!) : 0));
/** Participant order is lobby-entry order. A returning student rejoins at the back. */
export function crystalHostId(room: GameRoom, now: number): string | null {
  const players = room.crystal?.participants.filter(player => online(player, now)
    && (player.id === room.hostId || room.players.some(member => member.id === player.id))) ?? [];
  return players.find(player => player.id === room.hostId)?.id ?? players[0]?.id ?? null;
}
const host = (room: GameRoom, actor: GameActor, now: number) => { if (crystalHostId(room, now) !== actor.id) fail("Only the current game host can manage Crystal Defense. Join its lobby first.", 403); };
function identity(room: GameRoom, actor: GameActor, body: Record<string, unknown>) {
  if (body.asTestBuddy === true) {
    if (!actor.teacher || actor.id !== room.hostId) fail("Only the teacher can control a test buddy.", 403);
    return { id: `test:${actor.id}`, name: "Test buddy" };
  }
  return { id: actor.id, name: actor.name };
}
function answerValue(value: unknown): SelectedAnswer {
  if (typeof value === "string" && value.trim() && value.length <= 4000) return value;
  if (Array.isArray(value) && value.length > 0 && value.length <= 100 && value.every(item => typeof item === "string" && item.length <= 200)) return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    if (entries.length > 0 && entries.length <= 100 && entries.every(([key, item]) => !["__proto__", "constructor", "prototype"].includes(key) && typeof item === "string" && item.length <= 4000)) return Object.fromEntries(entries) as SelectedAnswer;
  }
  return fail("Choose an answer before submitting.");
}
function shuffledDeck(length: number, last?: number) {
  const deck = Array.from({ length }, (_, index) => index);
  for (let index = deck.length - 1; index > 0; index--) { const other = randomInt(index + 1); [deck[index], deck[other]] = [deck[other], deck[index]]; }
  if (deck.length > 1 && deck[0] === last) { const other = 1 + randomInt(deck.length - 1); [deck[0], deck[other]] = [deck[other], deck[0]]; }
  return deck;
}
function nextQuestionIndex(state: CrystalState) {
  if (state.config.source.kind === "infinite-math") {
    // Reuse only unreferenced slots so long sessions do not accumulate questions,
    // and a rescue always retains the original encounter's question and key.
    const used = new Set(state.monsters.map(monster => monster.questionIndex));
    const free = state.questions.findIndex((_question, index) => !used.has(index));
    const index = free < 0 ? state.questions.length : free;
    state.questions[index] = generateCrystalPractice(state.config.source, state.nextQuestion++, state.runId);
    return index;
  }
  // Legacy finite runs dealt directly from the questions array. Preserve their
  // unused tail before switching to shuffled cycles. The array itself stays
  // stable because live monsters retain questionIndex references into it.
  if (!state.questionDeck) {
    state.questionDeck = Array.from({ length: state.questions.length }, (_, index) => index).slice(state.nextQuestion);
    state.deckPosition = 0;
    state.lastQuestionIndex = state.nextQuestion ? Math.min(state.nextQuestion, state.questions.length) - 1 : undefined;
  }
  if ((state.deckPosition ?? 0) >= state.questionDeck.length) { state.questionDeck = shuffledDeck(state.questions.length, state.lastQuestionIndex); state.deckPosition = 0; }
  const index = state.questionDeck[state.deckPosition ?? 0];
  state.deckPosition = (state.deckPosition ?? 0) + 1; state.lastQuestionIndex = index; state.nextQuestion++;
  return index;
}
function newState(config: CrystalConfig, sourceTitle: string, questions: GameQuestion[], participants: CrystalParticipant[] = [], teacherMode: CrystalTeacherMode = "play"): CrystalState {
  return { runId: randomUUID(), teacherMode, config: { source: config.source }, sourceTitle, phase: "lobby", participants: participants.filter(player => !player.left).map(player => ({ id: player.id, name: player.name, ready: false, score: 0, lastSeen: player.lastSeen, spectating: player.spectating, speedStacks: 0, retryReady: false })), questions: [...questions], monsters: [], items: [], wave: 0, waveSize: 0, nextQuestion: 0, questionDeck: shuffledDeck(questions.length), deckPosition: 0, nextMonsterId: 0, idleSince: {}, hearts: CRYSTAL_MAX_HEARTS, nextWaveAt: null, notice: questions.length ? "Walk into the Crystal Defense portal, then mark yourself ready." : "The game host can choose questions for this endless defense.", defeated: 0, breached: 0, retreated: 0 };
}
function spawnItems(state: CrystalState, players: CrystalParticipant[]): CrystalItem[] {
  // A rotated, shuffled grid provides random reachable spots without overlapping
  // pickups. The normal 32-person room has at least 2.4 units between items.
  const spacing = Math.min(2.4, Math.sqrt(300 / Math.max(1, players.length))), extent = Math.ceil(14 / spacing);
  const positions: { x: number; z: number }[] = [];
  for (let x = -extent; x <= extent; x++) for (let z = -extent; z <= extent; z++) {
    const point = { x: x * spacing, z: z * spacing }, radius = Math.hypot(point.x, point.z);
    if (radius >= 8 && radius <= 14) positions.push(point);
  }
  const order = shuffledDeck(positions.length), angle = randomInt(1000000) / 1000000 * Math.PI * 2;
  return players.map((player, index) => {
    const point = positions[order[index]], capped = speedStacks(player) >= 3;
    const kind = capped || !player.retryReady && randomInt(2) === 0 ? "retry" : "speed";
    return { id: `${state.runId}:item:${state.wave}:${index}`, ownerId: player.id, kind, x: point.x * Math.cos(angle) - point.z * Math.sin(angle), z: point.x * Math.sin(angle) + point.z * Math.cos(angle) };
  });
}
function clearClaim(monster: CrystalMonster) { delete monster.claimedBy; delete monster.attemptId; delete monster.retryAvailableFor; }
function spawnMonster(state: CrystalState, now: number, travelMs: number): CrystalMonster {
  // Saved runs may lack a serial. The number of dealt questions is already at
  // least as large as their old per-wave indices, so pruning cannot reuse IDs.
  const serial = state.nextMonsterId ?? state.nextQuestion;
  state.nextMonsterId = serial + 1;
  return { id: `${state.runId}:${state.wave}:${serial}`, questionIndex: nextQuestionIndex(state), lane: (serial * 2.399963229728653 + state.wave * .37) % (Math.PI * 2), stage: 0, maxStrikes: crystalMaxStrikes(state.wave), status: "active", failedIds: [], changedAt: now, progress: 0, lastMovedAt: now, travelMs, moving: true };
}
/** Find a distinct eligible target for each free defender, including when their
 * failed encounters overlap. Stable lobby order prevents virtual assignments
 * rotating every poll and continually resetting somebody's waiting timer. */
function idleDefenders(state: CrystalState, players: CrystalParticipant[]) {
  const free = players.filter(player => !player.pendingMonsterId && !solving(state, player));
  const targets = state.monsters.filter(monster => monster.status === "active").sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
  const matches = new Map<string, CrystalParticipant>();
  const assign = (player: CrystalParticipant, seen: Set<string>): boolean => {
    for (const monster of targets) {
      if (seen.has(monster.id) || monster.failedIds.includes(player.id)) continue;
      seen.add(monster.id);
      const previous = matches.get(monster.id);
      if (!previous || assign(previous, seen)) { matches.set(monster.id, player); return true; }
    }
    return false;
  };
  for (const player of free) assign(player, new Set());
  const matched = new Set([...matches.values()].map(player => player.id));
  return free.filter(player => !matched.has(player.id));
}
function replenish(state: CrystalState, players: CrystalParticipant[], now: number, travelMs: number) {
  const missing = idleDefenders(state, players), missingIds = new Set(missing.map(player => player.id));
  const timers = state.idleSince ?? {}; let changed = false;
  for (const id of Object.keys(timers)) if (!missingIds.has(id)) { delete timers[id]; changed = true; }
  for (const player of missing) if (timers[player.id] === undefined) { timers[player.id] = now; changed = true; }
  const needed = missing.filter(player => now - timers[player.id] >= CRYSTAL_REINFORCEMENT_MS).length;
  if (needed && state.questions.length) {
    for (let index = 0; index < needed; index++) state.monsters.push(spawnMonster(state, now, travelMs));
    state.waveSize += needed;
    const stillMissing = new Set(idleDefenders(state, players).map(player => player.id));
    for (const id of Object.keys(timers)) if (!stillMissing.has(id)) delete timers[id];
    state.notice = `${needed === 1 ? "A fresh monster has" : `${needed} fresh monsters have`} entered the field. Keep the defense moving!`;
    changed = true;
  }
  if (changed) state.idleSince = timers;
  return changed;
}
function defeat(state: CrystalState) {
  state.hearts = 0; state.phase = "defeat"; state.nextWaveAt = null; state.idleSince = {};
  for (const player of state.participants) delete player.pendingMonsterId;
  state.notice = "The crystal fell. Your team can regroup and try again.";
  for (const monster of state.monsters) { monster.moving = false; delete monster.retryAvailableFor; }
}
function breach(state: CrystalState, monster: CrystalMonster, now: number) {
  monster.status = "breached"; monster.progress = 1; monster.moving = false; monster.changedAt = now; clearClaim(monster);
  state.hearts = Math.max(0, state.hearts - 1); state.breached++;
  state.notice = "A monster reached the crystal. Rescue the remaining monsters together!";
  if (!state.hearts) defeat(state);
}
/** Server-authoritative movement. A challenge freezes its target indefinitely;
 * every other living monster keeps walking, including monsters nobody can retry. */
function balance(state: CrystalState, now: number) {
  if (state.phase !== "battle") return false;
  let changed = false;
  const players = active(state, now), onlineIds = new Set(players.map(player => player.id));
  // Keep the question assignment independently of the temporary shield. A
  // disconnect must let the monster walk without letting its solver reroll.
  for (const player of state.participants) {
    const claim = state.monsters.find(monster => monster.status === "challenged" && monster.claimedBy === player.id);
    if (claim && player.pendingMonsterId !== claim.id) { player.pendingMonsterId = claim.id; changed = true; }
    const pending = state.monsters.find(monster => monster.id === player.pendingMonsterId);
    if (player.pendingMonsterId && (!pending || !alive(pending) || pending.failedIds.includes(player.id))) { delete player.pendingMonsterId; changed = true; }
  }
  const travelMs = crystalTravelMs(state.wave) * Math.max(1, (state.wavePlayers ?? players.length) / Math.max(1, players.length)) * (teamShield(state, players) ? 2 : 1);
  // A polling gap must not advance monsters through time when the whole class
  // was offline. Explicit leaves are integrated before marking the player left.
  const lastOnlineAt = Math.max(0, ...state.participants.filter(player => !player.left && !player.spectating).map(player => player.lastSeen + CRYSTAL_OFFLINE_MS));
  const advanceUntil = players.length ? now : Math.min(now, lastOnlineAt);
  for (const monster of state.monsters) {
    if (!alive(monster)) continue;
    if (monster.progress === undefined) { monster.progress = Math.min(.9, monster.stage / Math.max(1, monster.maxStrikes) * .75); monster.lastMovedAt = now; changed = true; }
    if (monster.status === "queued") { monster.status = "active"; monster.changedAt = now; changed = true; }
    if (monster.status === "active" && monster.moving !== false) {
      const elapsed = Math.max(0, advanceUntil - (monster.lastMovedAt ?? now));
      if (elapsed) monster.progress = Math.min(1, monster.progress + elapsed / (monster.travelMs ?? travelMs));
    }
    if (monster.status === "challenged" && !onlineIds.has(monster.claimedBy ?? "")) {
      monster.status = "active"; clearClaim(monster); monster.changedAt = now; changed = true;
    }
    if (monster.status === "challenged" && !monster.attemptId) { monster.attemptId = randomUUID(); changed = true; }
    const moving = monster.status === "active" && players.length > 0;
    // Pure walking is an analytical read projection: polling must not write a
    // room revision. Actions persist this new baseline; only rate/phase changes
    // and arrivals require a write from an otherwise read-only poll.
    if (monster.travelMs !== travelMs || monster.moving !== moving) changed = true;
    monster.lastMovedAt = now; monster.travelMs = travelMs; monster.moving = moving;
    if (monster.progress >= 1 && monster.status === "active") { breach(state, monster, now); changed = true; }
    if (!state.hearts) return true;
  }
  for (const player of state.participants) {
    if (!player.pendingMonsterId) continue;
    const monster = state.monsters.find(monster => monster.id === player.pendingMonsterId);
    if (!monster || !alive(monster)) { delete player.pendingMonsterId; changed = true; continue; }
    if (onlineIds.has(player.id) && monster.status === "active" && !monster.failedIds.includes(player.id)) {
      monster.status = "challenged"; monster.claimedBy = player.id; monster.attemptId = randomUUID(); monster.changedAt = now; monster.moving = false;
      changed = true;
    }
  }
  // Reconnecting may restore the final solver and activate the team shield.
  // Movement above used the previous rate up to this exact instant.
  const resumedTravelMs = crystalTravelMs(state.wave) * Math.max(1, (state.wavePlayers ?? players.length) / Math.max(1, players.length)) * (teamShield(state, players) ? 2 : 1);
  if (resumedTravelMs !== travelMs) for (const monster of state.monsters) if (alive(monster)) { monster.travelMs = resumedTravelMs; changed = true; }
  const retained = state.monsters.filter(monster => alive(monster) || now - monster.changedAt < CRYSTAL_ANIMATION_RETENTION_MS);
  if (retained.length !== state.monsters.length) { state.monsters = retained; changed = true; }
  if (!state.monsters.some(alive)) {
    state.phase = "intermission"; state.nextWaveAt = now + CRYSTAL_INTERMISSION_MS; state.idleSince = {};
    state.notice = "Wave cleared! Regroup at the crystal. The defense continues until the crystal falls.";
    changed = true;
  } else changed = replenish(state, players, now, resumedTravelMs) || changed;
  return changed;
}
function startWave(state: CrystalState, now: number) {
  const players = active(state, now);
  if (!players.length || !state.questions.length) return false;
  state.wave++;
  state.waveSize = crystalWaveSize(players.length, state.wave);
  state.wavePlayers = players.length;
  state.phase = "battle"; state.nextWaveAt = null; state.idleSince = {};
  for (const player of state.participants) { delete player.pickedItemWave; delete player.lastPickup; delete player.pendingMonsterId; }
  state.items = spawnItems(state, players);
  state.monsters = [];
  for (let index = 0; index < state.waveSize; index++) state.monsters.push(spawnMonster(state, now, crystalTravelMs(state.wave)));
  state.notice = `Wave ${state.wave}: ${state.waveSize} monsters. Challenging a monster freezes it while you solve.`;
  balance(state, now); return true;
}
function administer(room: GameRoom, actor: GameActor, state: CrystalState, body: Record<string, unknown>, now: number) {
  if (!actor.teacher || actor.id !== room.hostId) fail("Only the teacher who owns this room can use Crystal Defense admin controls.", 403);
  if (state.teacherMode !== "playtest") fail("Select Playtest to use admin controls.", 403);
  if (body.operation === "set-hearts") {
    const hearts = body.hearts;
    if (typeof hearts !== "number" || !Number.isInteger(hearts) || hearts < 0 || hearts > CRYSTAL_MAX_HEARTS) return fail("Choose a whole number of hearts from 0 to 5.");
    if (hearts > 0 && state.phase === "defeat") fail("Jump to a wave or restart the game to restore a destroyed crystal.", 409);
    if (hearts === 0) defeat(state);
    else { state.hearts = hearts; state.notice = `The teacher set the crystal to ${hearts} ${hearts === 1 ? "heart" : "hearts"}.`; }
    return;
  }
  if (body.operation !== "jump-wave" && body.operation !== "next-wave") fail("Choose a valid Crystal Defense admin operation.");
  const wave = body.operation === "next-wave" ? state.wave + 1 : body.wave;
  if (typeof wave !== "number" || !Number.isInteger(wave) || wave < 1 || wave > 9999) return fail("Choose a whole wave number from 1 to 9999.");
  if (!state.questions.length) fail("Choose a question source before jumping to a wave.", 409);
  if (!active(state, now).length) fail("At least one defender must join the portal before jumping to a wave.", 409);
  state.runId = randomUUID(); state.wave = wave - 1;
  if (state.hearts === 0 || state.phase === "defeat") state.hearts = CRYSTAL_MAX_HEARTS;
  for (const player of state.participants) delete player.lastResult;
  startWave(state, now);
  state.notice = `The teacher jumped to wave ${wave}. Defend the crystal!`;
}
export function tickCrystal(room: GameRoom, now: number) {
  const state = room.crystal;
  if (!state || room.phase !== "question" || room.closedAt) return false;
  let changed = false;
  if (state.phase === "victory" && state.questions.length && state.hearts > 0) {
    state.phase = "intermission"; state.nextWaveAt = now + CRYSTAL_INTERMISSION_MS;
    state.notice = "Endless defense is active. Regroup for the next wave."; changed = true;
  }
  const members = new Set([room.hostId, `test:${room.hostId}`, ...room.players.map(player => player.id)]);
  for (const player of state.participants) if (!members.has(player.id) && !player.left) { player.left = true; player.ready = false; changed = true; }
  if (state.phase === "intermission" && state.nextWaveAt !== null && now >= state.nextWaveAt) changed = startWave(state, now) || changed;
  return balance(state, now) || changed;
}
export function mutateCrystal(room: GameRoom, actor: GameActor, action: string, body: Record<string, unknown>, now: number) {
  if (room.mode !== "world" || room.phase !== "question") fail("Open a 3D world to play Crystal Defense.", 409);
  tickCrystal(room, now);
  if (action === "crystal-teacher-mode" && (!actor.teacher || actor.id !== room.hostId)) fail("Only this room's teacher can choose a teacher mode.", 403);
  if (!room.crystal && ["crystal-join", "crystal-teacher-mode"].includes(action)) room.crystal = newState({ source: { kind: "exam-math", assessmentId: "all" } }, "Choose a question source", []);
  if (action === "crystal-configure") {
    host(room, actor, now);
    if (room.crystal && ["battle", "intermission"].includes(room.crystal.phase)) fail("Return the game to its lobby before changing questions.", 409);
    if (body.runId !== room.crystal?.runId) fail("This Crystal Defense game has changed. Try again.", 409);
    const source = body.source as CrystalConfig["source"];
    const loaded = loadCrystalQuestions(source);
    room.crystal = newState({ source: { ...source } }, loaded.sourceTitle, loaded.questions, room.crystal?.participants, room.crystal?.teacherMode);
    return;
  }
  const state = room.crystal;
  if (!state) return fail("Join Crystal Defense through the portal first.", 409);
  // Simultaneous first entrants can both join the newly created empty lobby.
  if (body.runId !== state.runId && !(["crystal-join", "crystal-teacher-mode"].includes(action) && body.runId === undefined && state.phase === "lobby")) fail("This Crystal Defense game has changed. Try again.", 409);
  if (action === "crystal-teacher-mode") {
    if (typeof body.mode !== "string" || !["play", "spectate", "playtest"].includes(body.mode)) fail("Choose Play, Spectate, or Playtest.");
    state.teacherMode = body.mode as CrystalTeacherMode;
    let teacher = state.participants.find(player => player.id === room.hostId);
    if (!teacher && state.teacherMode === "spectate") {
      teacher = { id: actor.id, name: actor.name, score: 0, ready: false, lastSeen: now, speedStacks: 0, retryReady: false };
      state.participants.push(teacher);
    }
    if (teacher) {
      teacher.spectating = state.teacherMode === "spectate";
      teacher.left = false; teacher.ready = false; teacher.lastSeen = now;
    }
    if (state.teacherMode !== "playtest") {
      const buddy = state.participants.find(player => player.id === `test:${room.hostId}`);
      if (buddy) { buddy.left = true; buddy.ready = false; }
    }
    balance(state, now); return;
  }
  if (action === "crystal-admin") { administer(room, actor, state, body, now); return; }
  if (["crystal-reset", "crystal-end"].includes(action)) {
    host(room, actor, now); room.crystal = newState(state.config, state.sourceTitle, state.questions, state.participants, state.teacherMode); return;
  }
  if (action === "crystal-start") {
    host(room, actor, now);
    if (state.phase !== "lobby") fail("This Crystal Defense game has already started.", 409);
    if (!state.questions.length) fail("Choose a question source before starting.", 409);
    const players = active(state, now);
    if (!players.length) fail("At least one defender must join the portal first.");
    if (players.some(player => !player.ready)) fail("Wait until every connected defender is ready.", 409);
    for (const player of state.participants) if (!online(player, now)) player.left = true;
    startWave(state, now); return;
  }
  const who = identity(room, actor, body);
  let player = state.participants.find(item => item.id === who.id);
  if (action === "crystal-join") {
    if (state.phase !== "lobby" && (!player || player.left) && !(actor.teacher && who.id === room.hostId)) fail("This battle has started. Join the next game from the portal.", 409);
    if (!player) { player = { ...who, score: 0, ready: false, lastSeen: now, speedStacks: 0, retryReady: false, spectating: who.id === room.hostId && state.teacherMode === "spectate" }; state.participants.push(player); }
    else if (!online(player, now)) { state.participants = [...state.participants.filter(item => item !== player), player]; player.ready = false; }
    player.left = false; player.lastSeen = now; player.name = who.name; balance(state, now); return;
  }
  if (!player || player.left) return fail("Join Crystal Defense through the portal first.", 403);
  if (!online(player, now)) { state.participants = [...state.participants.filter(item => item !== player), player]; player.ready = false; }
  player.lastSeen = now; player.name = who.name;
  if (action === "crystal-heartbeat") { balance(state, now); return; }
  if (action === "crystal-leave") { player.left = true; player.ready = false; balance(state, now); return; }
  if (player.spectating) fail("You are spectating. Select Play to join as a defender.", 403);
  if (action === "crystal-ready") {
    if (state.phase !== "lobby" || typeof body.ready !== "boolean") fail("Ready up while waiting in the Crystal Defense lobby.", 409);
    if (body.ready && !state.questions.length) fail("Wait for the game host to choose questions first.", 409);
    player.ready = body.ready === true; return;
  }
  if (action === "crystal-pickup") {
    if (state.phase !== "battle" && state.phase !== "intermission") fail("Collect items while defending the crystal.", 409);
    const item = state.items?.find(item => item.id === body.itemId);
    if (!item) return fail("This item is no longer in the world.", 409);
    if (item.ownerId !== player.id) fail("This item belongs to another defender.", 403);
    if (item.pickedUpAt !== undefined || player.pickedItemWave === state.wave) fail("You already collected your item for this wave.", 409);
    if (typeof body.x !== "number" || !Number.isFinite(body.x) || typeof body.z !== "number" || !Number.isFinite(body.z)) fail("Send a valid position to collect an item.");
    if (Math.hypot(Number(body.x) - item.x, Number(body.z) - item.z) > CRYSTAL_PICKUP_DISTANCE) fail("Walk closer to your item to collect it.", 409);
    item.pickedUpAt = now; player.pickedItemWave = state.wave;
    player.speedStacks = speedStacks(player);
    if (item.kind === "speed") player.speedStacks = Math.min(3, player.speedStacks + 1);
    else player.retryReady = true;
    player.lastPickup = { itemId: item.id, kind: item.kind, at: now };
    return;
  }
  if (state.phase !== "battle") fail("Wait for the next wave.", 409);
  const monster = state.monsters.find(item => item.id === body.monsterId);
  if (!monster) return fail("This monster is no longer in the battle.", 409);
  if (action === "crystal-claim") {
    if (monster.status === "challenged" && monster.claimedBy === player.id) return;
    if (player.pendingMonsterId && player.pendingMonsterId !== monster.id) fail("Answer your current monster before choosing another one. If a teammate is rescuing it, wait for that encounter to finish.", 409);
    if (monster.status !== "active") fail("Another defender is already solving this monster, or it has left the field.", 409);
    if (monster.failedIds.includes(player.id)) fail("You already tried this monster. Let another defender rescue it.", 409);
    if (state.monsters.some(item => item.status === "challenged" && item.claimedBy === player.id)) fail("Answer your current monster before choosing another one.", 409);
    monster.status = "challenged"; monster.claimedBy = player.id; monster.attemptId = randomUUID(); monster.changedAt = now;
    player.pendingMonsterId = monster.id;
    if (player.retryReady) { player.retryReady = false; monster.retryAvailableFor = player.id; }
    else delete monster.retryAvailableFor;
    balance(state, now); return;
  }
  if (action !== "crystal-answer" && action !== "crystal-release") return fail("Choose a valid Crystal Defense action.");
  if (monster.status !== "challenged" || monster.claimedBy !== player.id) fail("Challenge this monster before answering it.", 409);
  if (!monster.attemptId || body.attemptId !== monster.attemptId) fail("This question attempt has changed. Review the current question and try again.", 409);
  if (action === "crystal-release") {
    fail("Answer this question before choosing another monster. Closing it cannot skip the encounter.", 409);
  }
  const answer = answerValue(body.answer), correct = isExamQuestionCorrect(state.questions[monster.questionIndex].question, answer);
  player.lastResult = { monsterId: monster.id, correct, at: now, points: correct ? CRYSTAL_CORRECT_POINTS : 0 };
  monster.changedAt = now;
  if (!correct && monster.retryAvailableFor === player.id) {
    delete monster.retryAvailableFor; monster.attemptId = randomUUID(); player.lastResult.retry = true;
    state.notice = `${player.name}'s retry item grants one more attempt. The monster stays frozen.`;
    balance(state, now); return;
  }
  delete player.pendingMonsterId; clearClaim(monster);
  if (correct) {
    monster.status = "defeated"; monster.moving = false; player.score += CRYSTAL_CORRECT_POINTS; state.defeated++;
    state.notice = `${player.name} defeated a monster! +${CRYSTAL_CORRECT_POINTS} points.`;
  } else {
    monster.failedIds.push(player.id); monster.stage++; monster.status = "active";
    state.notice = `${player.name}'s monster is walking again. Another defender can rescue it before it reaches the crystal.`;
  }
  balance(state, now);
}
export function crystalView(room: GameRoom, actor: GameActor, now: number, sanitize: (question: GameQuestion) => GameQuestion): CrystalView | undefined {
  const state = room.crystal;
  if (!state) return;
  const { questions, monsters, items, participants, nextQuestion: _nextQuestion, questionDeck, deckPosition, lastQuestionIndex: _lastQuestionIndex, nextMonsterId: _nextMonsterId, idleSince: _idleSince, ...visible } = state;
  const identities = new Set([actor.id, ...(actor.teacher && actor.id === room.hostId ? [`test:${actor.id}`] : [])]);
  const hostId = crystalHostId(room, now), players = active(state, now), activePlayers = players.length;
  return { ...visible, hostId, isHost: hostId === actor.id, canAdmin: actor.teacher && actor.id === room.hostId && state.teacherMode === "playtest", teamShieldActive: teamShield(state, players), serverNow: now, movementPaused: state.phase !== "battle" || !activePlayers, items: items ?? [], participants: participants.map(player => ({ ...player, speedStacks: speedStacks(player), retryReady: player.retryReady === true, online: online(player, now) })), monsters: monsters.map(({ questionIndex: _questionIndex, attemptId: _attemptId, ...monster }) => monster), questionCount: questions.length, questionsRemaining: Math.max(0, (questionDeck?.length ?? questions.length) - (deckPosition ?? 0)), totalPoints: participants.reduce((sum, player) => sum + player.score, 0), activePlayers, challenges: state.phase === "battle" ? monsters.filter(monster => monster.status === "challenged" && identities.has(monster.claimedBy ?? "")).map(monster => ({ playerId: monster.claimedBy!, monsterId: monster.id, attemptId: monster.attemptId ?? "", question: sanitize(questions[monster.questionIndex]) })) : [] };
}
