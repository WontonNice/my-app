import { randomUUID } from "node:crypto";
import { gameError, mutateGame, tickGame, type GameActor } from "./gameEngine";
import { isExamQuestionCorrect, type SelectedAnswer } from "../shared/examGrading";
import type { ExamQuestion } from "../shared/examTypes";
import { GAME_BOOSTERS, activeTeamPlayers, gameUnit, hasActiveInk, type GamePlayer, type GameRoom } from "../shared/gameRooms";
import { grantCoins, teamCoins } from "./gameBoosters";

const interval = 12000;
export function initializePlaytest(room: GameRoom, now: number) {
  const count = room.mode === "teams" ? room.teams.length * 2 : 4;
  const names = ["You · Pilot", "Nova", "Atlas", "Pixel", "Comet", "Echo"];
  room.players = Array.from({ length: count }, (_, index) => ({
    id: randomUUID(), name: names[index] ?? `Bot ${index + 1}`, joinedAt: new Date(now).toISOString(),
    teamId: room.mode === "teams" ? room.teams[index % room.teams.length].id : null, alive: true, score: 0,
  }));
  room.playtest = { controlledPlayerId: room.players[0].id, autoPlay: true, nextBotAt: now + interval };
  room.notice = "Private playtest ready. Switch players to try every perspective, then start the game.";
}

/** Test answers stay server-side and go through the normal grading rules. */
export function playtestAnswer(question: ExamQuestion, correct: boolean): SelectedAnswer {
  if (!correct) {
    const choice = question.choices?.find(item => !isExamQuestionCorrect(question, item.id));
    if (choice) return choice.id;
    let answer = "[playtest incorrect]";
    while (isExamQuestionCorrect(question, answer)) answer += "!";
    return answer;
  }
  let answer: SelectedAnswer | undefined;
  switch (question.type) {
    case "multiple_choice": case "transition_drop": answer = question.correctChoiceId; break;
    case "multi_select": answer = question.correctChoiceIds; break;
    case "graph_point_select": answer = question.correctPointIds; break;
    case "math_drag_drop": answer = Object.fromEntries((question.dragDropSlots ?? []).map(slot => [slot.id, slot.correctItemId ?? ""])); break;
    case "inline_dropdown": answer = Object.fromEntries((question.dropdowns ?? []).map(slot => [slot.id, slot.correctChoiceId ?? ""])); break;
    case "category_sort": case "matrix_choice": case "table_match": answer = question.correctPlacements; break;
    case "number_line_response": {
      const value = question.numberLineResponse;
      if (value) answer = { value: String(value.correctValue), direction: value.correctDirection, endpoint: value.correctEndpoint };
      break;
    }
    default: answer = question.correctTextAnswers?.[0];
  }
  if (!isExamQuestionCorrect(question, answer)) throw gameError("This question needs a valid answer key before a correct answer can be simulated.");
  return answer!;
}

function controlled(room: GameRoom) {
  const player = room.players.find(item => item.id === room.playtest?.controlledPlayerId);
  if (!player) throw gameError("Choose a player in the playtest controls first.");
  return player;
}

// Only the authenticated host reaches this helper. Simulated identities are never
// accepted from requests, and the actual private room is never made joinable.
function asPlayer(room: GameRoom, player: GamePlayer, action: string, body: Record<string, unknown>, now: number) {
  const actor: GameActor = { id: player.id, name: player.name, teacher: false };
  const simulation = { ...room, playtest: undefined };
  mutateGame(simulation, actor, action, body, now);
  Object.assign(room, simulation, { playtest: room.playtest });
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
  for (const item of unit) asPlayer(room, player, "draft", { questionId: item.question.id, index: start, answer: answers[item.question.id] }, now);
  while (team!.index === start && room.phase === "question") {
    const body = { questionId: question.id, index: start, step: team!.step ?? 0, draftVersion: team!.draftVersion ?? 0 };
    for (const member of activeTeamPlayers(room, team!.id)) asPlayer(room, member, "vote", body, now);
  }
}

export function mutatePlaytest(room: GameRoom, actor: GameActor, action: string, body: Record<string, unknown>, now: number) {
  if (!room.playtest || !actor.teacher || actor.id !== room.hostId) throw gameError("Only the host of a private playtest can use test controls.", 403);
  if (action === "test-control") {
    if (body.playerId !== null && !room.players.some(player => player.id === body.playerId)) throw gameError("Choose a simulated player.");
    room.playtest.controlledPlayerId = body.playerId as string | null;
    room.playtest.nextBotAt = now + interval; return;
  }
  if (action === "test-auto") {
    if (typeof body.enabled !== "boolean") throw gameError("Choose whether bots play automatically.");
    room.playtest.autoPlay = body.enabled; room.playtest.nextBotAt = now + interval; return;
  }
  if (action === "test-reset") {
    room.phase = "lobby"; room.round = 0; room.finalRound = false; room.deadline = null; room.winners = []; room.roundAnswers = {}; room.unitAnswers = {};
    room.teams.forEach(team => { team.index = 0; team.step = 0; team.readyIds = []; team.draftVersion = 0; team.score = 0; team.streak = 0; team.coins = 0; team.boosters = 0; team.inventory = {}; team.blockedUntil = 0; team.answers = []; delete team.sabotagedBy; delete team.landmine; delete team.landmineResult; delete team.inkBomb; delete team.draft; delete team.drafts; });
    const autoPlay = room.playtest.autoPlay;
    initializePlaytest(room, now); room.playtest.autoPlay = autoPlay;
    room.notice = "Playtest restarted with fresh simulated players and balanced teams."; return;
  }
  if (action === "test-party" && room.mode === "teams") { room.party = body.enabled === true; return; }
  if (room.phase !== "question") throw gameError("Start a question to try this scenario.", 409);
  if (action === "test-step") { runBots(room, now); return; }
  if (action === "test-expire") { room.deadline = now; tickGame(room, now); return; }
  if (["answer", "draft", "vote", "unvote", "review", "sabotage", "booster", "buy-sabotage", "use-sabotage", "clear-ink"].includes(action)) {
    if (body.playtestPlayerId !== room.playtest.controlledPlayerId) throw gameError("Your playtest perspective changed. Try again from the current player.", 409);
    asPlayer(room, controlled(room), action, body, now); return;
  }
  if (action === "test-answer") {
    if (typeof body.correct !== "boolean") throw gameError("Choose a correct or incorrect answer.");
    answerFor(room, controlled(room), body.correct, now); return;
  }
  const player = controlled(room), team = room.teams.find(item => item.id === player.teamId);
  if (room.mode !== "teams" || !team) throw gameError("This scenario is available in a team race.");
  if (action === "test-team-ready") {
    const body = { questionId: room.questions[team.index]?.question.id, index: team.index, step: team.step ?? 0, draftVersion: team.draftVersion ?? 0 };
    for (const teammate of activeTeamPlayers(room, team.id).filter(item => item.id !== player.id)) asPlayer(room, teammate, "vote", body, now);
    return;
  }
  if (action === "test-teammate") {
    const teammate = activeTeamPlayers(room, team.id).find(item => item.id !== player.id);
    if (!teammate) throw gameError("Assign a second simulated player to your team first.");
    answerFor(room, teammate, true, now, "draft"); return;
  }
  if (!room.party) throw gameError("Create a playtest with Party mode enabled to try the sabotage shop.");
  if (action === "test-coins") { grantCoins(team, 1); return; }
  if (action === "test-sabotage") {
    const opponent = room.teams.find(item => item.id !== team.id && item.index < room.questions.length && item.blockedUntil <= now && !hasActiveInk(item, now) && activeTeamPlayers(room, item.id).length > 0);
    const opponentPlayer = opponent && activeTeamPlayers(room, opponent.id)[0];
    if (!opponent || !opponentPlayer) throw gameError("An active opposing team is needed to simulate sabotage.");
    const boosterId = String(body.boosterId ?? "ink-bomb");
    const definition = GAME_BOOSTERS.find(item => item.id === boosterId);
    if (!definition) throw gameError("Choose an available sabotage.");
    grantCoins(opponent, definition.cost);
    asPlayer(room, opponentPlayer, "buy-sabotage", { boosterId }, now);
    asPlayer(room, opponentPlayer, "use-sabotage", { boosterId, teamId: team.id }, now); return;
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
      const target = room.teams.find(item => item.id === player?.teamId && item.index < room.questions.length && item.blockedUntil <= now && !hasActiveInk(item, now) && !item.landmine && activeTeamPlayers(room, item.id).length > 0);
      if (room.phase === "question" && room.party && team.index < room.questions.length && team.blockedUntil <= now && target) {
        if (!((team.inventory?.["ink-bomb"] ?? 0) > 0) && teamCoins(team) > 0) asPlayer(room, bot, "buy-sabotage", { boosterId: "ink-bomb" }, now);
        if ((team.inventory?.["ink-bomb"] ?? 0) > 0) asPlayer(room, bot, "use-sabotage", { boosterId: "ink-bomb", teamId: target.id }, now);
      }
    }
  }
}
export function tickPlaytest(room: GameRoom, now: number) {
  if (!room.playtest?.autoPlay || room.phase !== "question" || now < room.playtest.nextBotAt) return false;
  runBots(room, now); return true;
}
