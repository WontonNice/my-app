import { randomUUID } from "node:crypto";
import { gameError, mutateGame, tickGame, type GameActor } from "./gameEngine";
import { isExamQuestionCorrect, type SelectedAnswer } from "../shared/examGrading";
import { playtestAnswer } from "./gameAnswerKey";
import { GAME_BOOSTERS, activeTeamPlayers, gameUnit, hasActiveInk, type GamePlayer, type GameRoom, type GameTeam } from "../shared/gameRooms";
import { grantCoins, resolveLandmine, teamCoins, useSabotage, landmineChoices } from "./gameBoosters";

const interval = 12000;
export function initializePlaytest(room: GameRoom, now: number) {
  const count = room.mode === "teams" ? room.teams.length * 2 : 4;
  const names = ["You · Pilot", "Nova", "Atlas", "Pixel", "Comet", "Echo"];
  room.players = Array.from({ length: count }, (_, index) => ({
    id: randomUUID(), name: names[index] ?? `Bot ${index + 1}`, joinedAt: new Date(now).toISOString(),
    teamId: room.mode === "teams" ? room.teams[index % room.teams.length].id : null, alive: true, score: 0,
  }));
  room.playtest = { controlledPlayerId: room.players[0].id, autoPlay: false, nextBotAt: now + interval };
  room.notice = "Private playtest ready. Switch players to try every perspective, then start the game.";
}

export { playtestAnswer } from "./gameAnswerKey";

function controlled(room: GameRoom) {
  const player = room.players.find(item => item.id === room.playtest?.controlledPlayerId);
  if (!player) throw gameError("Choose a player in the playtest controls first.");
  return player;
}

// Only the authenticated host reaches this helper. Simulated identities are never
// accepted from requests, and the actual private room is never made joinable.
function asPlayer(room: GameRoom, player: GamePlayer, action: string, body: Record<string, unknown>, now: number) {
  const actor: GameActor = { id: player.id, name: player.name, teacher: false };
  // Top up only this simulated purchase. Ordinary games never bypass the wallet.
  if (action === "buy-sabotage" && room.playtest?.unlimitedCoins) {
    const team = room.teams.find(item => item.id === player.teamId), item = GAME_BOOSTERS.find(item => item.id === body.boosterId);
    if (team && item) grantCoins(team, item.cost);
  }
  const simulation = { ...room, playtest: undefined };
  mutateGame(simulation, actor, action, body, now);
  Object.assign(room, simulation, { playtest: room.playtest });
  if (room.phase !== "question" && room.playtest) delete room.playtest.clockRemainingMs;
}
function clearEffects(team: GameTeam) {
  team.blockedUntil = 0;
  delete team.sabotagedBy; delete team.landmine; delete team.landmines; delete team.landmineResult; delete team.inkBomb;
}
function wholeNumber(value: unknown, fallback: number, maximum = 999999) {
  const number = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(number) || number < 0 || number > maximum) throw gameError(`Choose a whole number from 0 to ${maximum}.`);
  return number;
}
function answerFor(room: GameRoom, player: GamePlayer, correct: boolean, now: number, action = "answer", allowMissingKey = false) {
  const team = room.teams.find(item => item.id === player.teamId);
  const question = room.questions[room.mode === "teams" ? team?.index ?? room.questions.length : room.round]?.question;
  if (!question) throw gameError("This team has already finished.", 409);
  const unit = gameUnit(room.questions, room.mode === "teams" ? team!.index : room.round);
  const answers = Object.fromEntries(unit.map(({ question: item }) => {
    try { return [item.id, playtestAnswer(item, correct)]; }
    catch (error) { if (!allowMissingKey) throw error; return [item.id, playtestAnswer(item, false)]; }
  }));
  if (room.mode !== "teams" || action === "draft") {
    asPlayer(room, player, action, { questionId: question.id, index: team?.index, round: room.round, answer: answers[question.id], answers }, now); return;
  }
  const start = team!.index;
  for (const item of unit.filter(item => !team!.pendingFeedback?.some(feedback => feedback.questionId === item.question.id))) asPlayer(room, player, "draft", { questionId: item.question.id, index: start, answer: answers[item.question.id] }, now);
  while (team!.index === start && room.phase === "question") {
    const body = { questionId: question.id, index: start, step: team!.step ?? 0, draftVersion: team!.draftVersion ?? 0 };
    for (const member of activeTeamPlayers(room, team!.id)) asPlayer(room, member, "vote", body, now);
  }
}

function sandboxPosition(room: GameRoom, player: GamePlayer, body: Record<string, unknown>) {
  const team = room.teams.find(item => item.id === player.teamId);
  const index = team?.index ?? room.round, step = team?.step ?? 0;
  const unit = gameUnit(room.questions, index);
  const current = team ? unit[step] : unit.find(item => item.question.id === body.questionId) ?? (body.questionId === undefined ? unit[0] : undefined);
  if (body.playtestPlayerId !== undefined && body.playtestPlayerId !== player.id
    || body.index !== undefined && body.index !== index
    || body.step !== undefined && body.step !== step
    || body.draftVersion !== undefined && body.draftVersion !== (team?.draftVersion ?? 0)
    || body.questionId !== undefined && body.questionId !== (current ?? unit[0])?.question.id) {
    throw gameError("The playtest question or player changed. Try again from the current screen.", 409);
  }
  return { team, index, step, unit, current };
}

function selectSandboxAnswer(room: GameRoom, player: GamePlayer, correct: boolean, now: number, body: Record<string, unknown>) {
  const { team, index, current } = sandboxPosition(room, player, body);
  if (!current) throw gameError("This is the passage review. Submit the saved passage or return to a question.", 409);
  if (team) asPlayer(room, player, "draft", { questionId: current.question.id, index, answer: playtestAnswer(current.question, correct) }, now);
  else {
    if (room.roundAnswers[player.id] !== undefined) throw gameError("Your round is already submitted.", 409);
    room.unitAnswers ??= {}; room.unitAnswers[player.id] ??= {};
    room.unitAnswers[player.id][current.question.id] = playtestAnswer(current.question, correct);
  }
  return { team, current };
}

function submitSandboxQuestion(room: GameRoom, player: GamePlayer, now: number, body: Record<string, unknown>) {
  const { team, index, step, unit } = sandboxPosition(room, player, body);
  if (!unit.length) throw gameError("This player has finished. Jump to a question to continue testing.", 409);
  if (!team) {
    asPlayer(room, player, "answer", { questionId: unit[0].question.id, round: room.round, answers: room.unitAnswers?.[player.id] ?? {} }, now);
    return;
  }
  const vote = { questionId: unit[0].question.id, index, step, draftVersion: team.draftVersion ?? 0 };
  // Approve exactly one navigation step. Never loop over the rest of a passage.
  for (const teammate of activeTeamPlayers(room, team.id)) {
    if (team.index !== index || (team.step ?? 0) !== step || room.phase !== "question") break;
    asPlayer(room, teammate, "vote", vote, now);
  }
}

export function mutatePlaytest(room: GameRoom, actor: GameActor, action: string, body: Record<string, unknown>, now: number) {
  if (!room.playtest || !actor.teacher || actor.id !== room.hostId) throw gameError("Only the host of a private playtest can use test controls.", 403);
  if (action === "test-control") {
    if (body.playerId !== null && !room.players.some(player => player.id === body.playerId)) throw gameError("Choose a simulated player.");
    room.playtest.controlledPlayerId = body.playerId as string | null;
    room.playtest.nextBotAt = now + interval; return;
  }
  if (action === "test-view-target" || action === "test-return") {
    const target = action === "test-return" ? room.players.find(item => item.id === room.playtest!.returnPlayerId) : room.players.find(item => item.teamId === room.playtest!.lastTargetTeamId && !item.excusedAt);
    if (!target) throw gameError("Send an item to a team first, or select a player above.");
    room.playtest.controlledPlayerId = target.id; room.playtest.autoPlay = false; return;
  }
  if (action === "test-unlimited" || action === "test-auto-ready") {
    if (typeof body.enabled !== "boolean") throw gameError("Choose whether to enable this sandbox option.");
    if (action === "test-unlimited") room.playtest.unlimitedCoins = body.enabled;
    else room.playtest.autoReady = body.enabled;
    return;
  }
  if (action === "test-auto") {
    if (typeof body.enabled !== "boolean") throw gameError("Choose whether bots play automatically.");
    room.playtest.autoPlay = body.enabled; room.playtest.nextBotAt = now + interval; return;
  }
  if (action === "test-reset") {
    room.phase = "lobby"; room.round = 0; room.finalRound = false; room.deadline = null; room.winners = []; room.roundAnswers = {}; room.unitAnswers = {};
    room.teams.forEach(team => { team.index = 0; team.step = 0; team.readyIds = []; team.draftVersion = 0; team.score = 0; team.streak = 0; team.coins = 0; team.boosters = 0; team.inventory = {}; team.blockedUntil = 0; team.answers = []; delete team.sabotagedBy; delete team.landmine; delete team.landmines; delete team.landmineResult; delete team.inkBomb; delete team.messages; delete team.coinReceipt; delete team.pendingFeedback; delete team.answerFeedback; delete team.tools; delete team.draft; delete team.drafts; });
    const { autoPlay, unlimitedCoins, autoReady } = room.playtest;
    initializePlaytest(room, now); Object.assign(room.playtest, { autoPlay, unlimitedCoins, autoReady });
    room.notice = "Playtest restarted with fresh simulated players and balanced teams."; return;
  }
  if (action === "test-party" && room.mode === "teams") { room.party = body.enabled === true; return; }
  if (["test-coins", "test-wallet", "test-inventory", "test-clear-effects", "test-jump", "test-landmine-result"].includes(action)) {
    const player = controlled(room), team = room.teams.find(item => item.id === player.teamId);
    if (room.mode !== "teams" || !team) throw gameError("Choose a team player for this sandbox tool.");
    if (action === "test-coins" || action === "test-wallet") {
      if (!room.party) throw gameError("Turn on Party mode to test the shop.");
      const amount = wholeNumber(body.amount, action === "test-coins" ? 300 : 0);
      grantCoins(team, 0); team.coins = action === "test-coins" ? Math.min(999999, teamCoins(team) + amount) : amount; return;
    }
    if (action === "test-inventory") {
      const definition = GAME_BOOSTERS.find(item => item.id === body.boosterId);
      if (!definition) throw gameError("Choose an item from the shop.");
      team.inventory ??= {}; team.inventory[definition.id] = Math.min(999999, (team.inventory[definition.id] ?? 0) + wholeNumber(body.amount, 10, 1000)); return;
    }
    if (action === "test-clear-effects") { (body.all === true ? room.teams : [team]).forEach(clearEffects); return; }
    if (action === "test-jump") {
      const requested = wholeNumber(body.question, 1, room.questions.length) - 1;
      if (requested < 0) throw gameError("Question numbers start at 1.");
      let start = 0;
      while (start + gameUnit(room.questions, start).length <= requested) start += gameUnit(room.questions, start).length;
      const earlier = new Set(room.questions.slice(0, start).map(item => item.question.id));
      team.answers = team.answers.filter(item => earlier.has(item.questionId));
      team.score = team.answers.filter(item => item.correct).length; team.streak = 0;
      for (const answer of [...team.answers].reverse()) { if (!answer.correct) break; team.streak++; }
      team.index = start; team.step = requested - start; team.readyIds = []; team.draftVersion = (team.draftVersion ?? 0) + 1;
      delete team.draft; delete team.drafts; delete team.coinReceipt; delete team.pendingFeedback; delete team.answerFeedback; delete team.tools; clearEffects(team); delete player.excusedAt;
      room.phase = "question"; room.winners = [];
      room.deadline = room.playtest.clockRemainingMs !== undefined ? null : (room.deadline && room.deadline > now ? room.deadline : now + room.testMinutes * 60000);
      room.playtest.autoPlay = false;
      room.notice = `${team.name} moved to question ${requested + 1}. Later answers and effects were cleared; its wallet and inventory were kept.`; return;
    }
    if (room.phase !== "question" || team.index >= room.questions.length) throw gameError("Jump to a question to preview the trap.");
    if (!["triggered", "disarmed", "defused"].includes(String(body.outcome))) throw gameError("Choose trigger or disarm.");
    const source = room.teams.find(item => item.id !== team.id)!;
    clearEffects(team); room.party = true;
    const questionIndex = team.index + Math.min(team.step ?? 0, gameUnit(room.questions, team.index).length - 1);
    team.landmine = { questionIndex, ...(body.outcome === "defused" ? { choiceId: "A" } : {}), source: { teamId: source.id, teamName: source.name, boosterId: "landmine" } };
    resolveLandmine(team, questionIndex, body.outcome !== "triggered", now, body.outcome === "defused" ? "A" : undefined);
    room.notice = "Previewing the real landmine outcome. Answers and scores were not changed; an explosion deducts up to 100 coins.";
    room.playtest.autoPlay = false;
    return;
  }
  if (room.phase !== "question" && action !== "chat") throw gameError("Start a question to try this scenario.", 409);
  if (action === "test-clock") {
    if (typeof body.paused !== "boolean") throw gameError("Choose whether to pause the timer.");
    if (body.paused && room.playtest.clockRemainingMs === undefined) { room.playtest.clockRemainingMs = Math.max(0, (room.deadline ?? now) - now); room.deadline = null; }
    if (!body.paused && room.playtest.clockRemainingMs !== undefined) { room.deadline = now + room.playtest.clockRemainingMs; delete room.playtest.clockRemainingMs; }
    return;
  }
  if (action === "test-step") { runBots(room, now); return; }
  if (action === "test-expire") { delete room.playtest.clockRemainingMs; room.deadline = now; tickGame(room, now); return; }
  if (["answer", "draft", "vote", "unvote", "review", "sabotage", "booster", "buy-sabotage", "use-sabotage", "clear-ink", "chat", "tools"].includes(action)) {
    if (body.playtestPlayerId !== room.playtest.controlledPlayerId) throw gameError("Your playtest perspective changed. Try again from the current player.", 409);
    const player = controlled(room);
    asPlayer(room, player, action, body, now);
    if (["use-sabotage", "sabotage", "booster"].includes(action)) { room.playtest.lastTargetTeamId = String(body.teamId); room.playtest.returnPlayerId = player.id; }
    if (action === "vote" && room.playtest.autoReady) {
      const team = room.teams.find(item => item.id === player.teamId);
      for (const member of activeTeamPlayers(room, player.teamId!)) {
        if (team?.index !== Number(body.index) || (team.step ?? 0) !== Number(body.step) || room.phase !== "question") break;
        if (member.id !== player.id) asPlayer(room, member, "vote", body, now);
      }
    }
    return;
  }
  if (action === "test-answer" || action === "test-select") {
    if (typeof body.correct !== "boolean") throw gameError("Choose a correct or incorrect answer.");
    const player = controlled(room);
    const { team } = selectSandboxAnswer(room, player, body.correct, now, body);
    // Legacy one-click actions also act on only this question. Passage review is separate.
    if (action === "test-answer" && (team || gameUnit(room.questions, room.round).length === 1)) submitSandboxQuestion(room, player, now, {});
    return;
  }
  if (action === "test-next") {
    submitSandboxQuestion(room, controlled(room), now, body); return;
  }
  const player = controlled(room), team = room.teams.find(item => item.id === player.teamId);
  if (room.mode !== "teams" || !team) throw gameError("This scenario is available in a team race.");
  if (action === "test-team-ready") {
    sandboxPosition(room, player, body);
    const voteBody = { questionId: room.questions[team.index]?.question.id, index: team.index, step: team.step ?? 0, draftVersion: team.draftVersion ?? 0 };
    for (const teammate of activeTeamPlayers(room, team.id).filter(item => item.id !== player.id)) asPlayer(room, teammate, "vote", voteBody, now);
    return;
  }
  if (action === "test-teammate") {
    const teammate = activeTeamPlayers(room, team.id).find(item => item.id !== player.id);
    if (!teammate) throw gameError("Assign a second simulated player to your team first.");
    sandboxPosition(room, player, body);
    selectSandboxAnswer(room, teammate, true, now, {}); return;
  }
  if (action === "test-sabotage") {
    const opponent = room.teams.find(item => item.id !== team.id);
    if (!opponent) throw gameError("Add an opposing team to preview its attack.");
    const boosterId = String(body.boosterId ?? "ink-bomb");
    const definition = GAME_BOOSTERS.find(item => item.id === boosterId);
    if (!definition) throw gameError("Choose an available sabotage.");
    // Preview the real effect even if opponents are blocked, broke or finished.
    // A temporary inventory prevents the scenario from spending their items.
    room.party = true; room.playtest.autoPlay = false;
    if (boosterId !== "landmine") { team.blockedUntil = 0; delete team.inkBomb; }
    const questionIndex = room.questions.findIndex((item, index) => index >= team.index + (team.step ?? 0) && landmineChoices(item).length > 0);
    const choiceId = room.questions[questionIndex]?.question.choices?.find(choice => choice.id !== room.questions[questionIndex].question.correctChoiceId)?.id;
    useSabotage(room, { ...opponent, index: 0, inventory: { [boosterId]: 1 } }, boosterId, team.id, now, { questionIndex, choiceId }); return;
  }
  throw gameError("Choose a valid playtest scenario.");
}

function runBots(room: GameRoom, now: number) {
  if (!room.playtest || room.phase !== "question") return;
  room.playtest.nextBotAt = now + interval;
  const player = room.players.find(item => item.id === room.playtest!.controlledPlayerId);
  if (room.mode === "survival") {
    room.players.forEach((bot, index) => {
      if (bot.id !== player?.id && room.phase === "question" && room.roundAnswers[bot.id] === undefined) answerFor(room, bot, (index + room.round) % 3 !== 0, now, "answer", true);
    });
  } else {
    for (const [index, team] of room.teams.entries()) {
      if (team.id === player?.teamId || team.index >= room.questions.length || team.blockedUntil > now || hasActiveInk(team, now) || room.phase !== "question") continue;
      const bot = activeTeamPlayers(room, team.id)[0];
      if (!bot) continue;
      answerFor(room, bot, (team.index + index) % 5 !== 4, now, "answer", true);
      const target = room.teams.find(item => item.id === player?.teamId && item.index < room.questions.length && item.blockedUntil <= now && !hasActiveInk(item, now) && activeTeamPlayers(room, item.id).length > 0);
      if (room.phase === "question" && room.party && team.index < room.questions.length && team.blockedUntil <= now && target) {
        if (!((team.inventory?.["ink-bomb"] ?? 0) > 0) && teamCoins(team) >= GAME_BOOSTERS.find(item => item.id === "ink-bomb")!.cost) asPlayer(room, bot, "buy-sabotage", { boosterId: "ink-bomb" }, now);
        if ((team.inventory?.["ink-bomb"] ?? 0) > 0) asPlayer(room, bot, "use-sabotage", { boosterId: "ink-bomb", teamId: target.id }, now);
      }
    }
  }
}
export function tickPlaytest(room: GameRoom, now: number) {
  if (!room.playtest?.autoPlay || room.phase !== "question" || now < room.playtest.nextBotAt) return false;
  runBots(room, now); return true;
}
