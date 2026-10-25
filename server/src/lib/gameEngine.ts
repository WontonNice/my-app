import { isExamQuestionCorrect, type SelectedAnswer } from "../shared/examGrading";
import { INK_SPLATS, activeTeamPlayers, gameUnit, hasActiveInk, type GameRoom, type GameView, type GameQuestion, type GamePlayer } from "../shared/gameRooms";
import { teamCoins, sabotageInventory, earnCoins, buySabotage, useSabotage, clearInk, resolveLandmine } from "./gameBoosters";

export const gameError = (message: string, status = 400) => Object.assign(new Error(message), { status });
export type GameActor = { id: string; name: string; teacher: boolean };
const host = (room: GameRoom, actor: GameActor) => { if (room.hostId !== actor.id || !actor.teacher) throw gameError("Only the teacher who hosts this room can do that.", 403); };
export function gameMember(room: GameRoom, actor: GameActor) {
  if (room.hostId === actor.id && actor.teacher) return;
  if (room.playtest) throw gameError("This is a private teacher playtest.", 403);
  if (!room.players.some(player => player.id === actor.id)) throw gameError("Join this room with its code first.", 403);
}
function finishTeams(room: GameRoom) {
  const maximum = Math.max(...room.teams.map(team => team.score));
  room.winners = room.teams.filter(team => team.score === maximum).map(team => team.id);
  room.phase = "finished"; room.deadline = null; room.notice = "The team race is complete. Tied scores share the win.";
}
function teamsDone(room: GameRoom) {
  return room.teams.every(team => team.index >= room.questions.length || activeTeamPlayers(room, team.id).length === 0);
}
function revealRound(room: GameRoom) {
  const unit = gameUnit(room.questions, room.round);
  const answers = (id: string) => room.unitAnswers?.[id] ?? { [unit[0].question.id]: room.roundAnswers[id] };
  const correct = room.players.filter(player => unit.every(item => isExamQuestionCorrect(item.question, answers(player.id)[item.question.id])));
  const standing = room.players.filter(player => player.alive);
  for (const player of room.players) { player.score += unit.filter(item => isExamQuestionCorrect(item.question, answers(player.id)[item.question.id])).length; if (!correct.some(item => item.id === player.id)) player.alive = false; }
  room.deadline = null;
  if (room.finalRound) {
    const finalists = correct.filter(player => standing.some(item => item.id === player.id));
    const candidates = finalists.length ? finalists : correct;
    const best = Math.max(...candidates.map(player => player.score));
    room.winners = candidates.filter(player => player.score === best).map(player => player.id);
    room.phase = "finished"; room.notice = room.winners.length ? "Final round complete! Correct finalists take priority; the audience can steal the win if they miss." : "The final question stumped everyone. No champion this time.";
  } else { room.phase = "reveal"; room.notice = `${room.players.filter(player => player.alive).length} still standing. Eliminated players keep answering for the audience.`; }
}
export function tickGame(room: GameRoom, now: number) {
  if (room.phase === "question" && room.deadline !== null && now >= room.deadline) {
    if (room.mode === "teams") finishTeams(room); else revealRound(room);
    return true;
  }
  return false;
}
function parseAnswer(value: unknown): SelectedAnswer {
  if (typeof value === "string" && value.trim() && value.length <= 4000) return value;
  if (Array.isArray(value) && value.length > 0 && value.length <= 100 && value.every(item => typeof item === "string" && item.length <= 200)) return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    if (entries.length > 0 && entries.length <= 100 && entries.every(([key, item]) => !["__proto__", "constructor", "prototype"].includes(key) && typeof item === "string" && item.length <= 4000)) return Object.fromEntries(entries) as SelectedAnswer;
  }
  throw gameError("Choose an answer before submitting.");
}
export function mutateGame(room: GameRoom, actor: GameActor, action: string, body: Record<string, unknown>, now: number) {
  if (room.closedAt) throw gameError("This room has ended.", 410);
  if (action === "join") {
    if (room.playtest) throw gameError("This is a private teacher playtest. Join a class lobby instead.", 403);
    if (actor.teacher) throw gameError("Teachers host rooms. Students join as players.");
    if (room.players.some(player => player.id === actor.id)) return;
    if (room.phase !== "lobby") throw gameError("This game has started. Ask your teacher to create the next lobby.", 409);
    if (room.players.length >= 100) throw gameError("This lobby is full.");
    room.players.push({ id: actor.id, name: actor.name, joinedAt: new Date(now).toISOString(), teamId: null, alive: true, score: 0 }); return;
  }
  gameMember(room, actor);
  if (["assign", "balance", "start", "next", "finish", "delete", "remove", "set-participation"].includes(action)) host(room, actor);
  if (action === "set-participation") {
    if (room.mode !== "teams" || room.phase !== "question") throw gameError("Manage class departures during an active team race.", 409);
    const member = room.players.find(item => item.id === body.playerId);
    const team = room.teams.find(item => item.id === member?.teamId);
    if (!member || !team || typeof body.active !== "boolean") throw gameError("Choose a student and their participation status.");
    if (Boolean(member.excusedAt) === !body.active) return;
    if (body.active) delete member.excusedAt; else member.excusedAt = new Date(now).toISOString();
    // A changed voting roster needs fresh approval; stale tabs cannot submit it.
    team.readyIds = []; team.draftVersion = (team.draftVersion ?? 0) + 1;
    room.notice = `${member.name} ${body.active ? "is back in the race" : "has left class"}. ${team.name}'s active teammates should vote ready again.`;
    if (teamsDone(room)) finishTeams(room);
    return;
  }
  if (action === "assign" || action === "balance" || action === "remove") {
    if (room.phase !== "lobby") throw gameError("Manage teams and players before starting.", 409);
    if (action === "remove") {
      room.players = room.players.filter(player => player.id !== body.playerId);
      if (room.playtest && room.playtest.controlledPlayerId === body.playerId) room.playtest.controlledPlayerId = null;
      return;
    }
    if (room.mode !== "teams") throw gameError("This room uses individual players.");
    if (action === "balance") { room.players.forEach((player, index) => player.teamId = room.teams[index % room.teams.length].id); return; }
    const player = room.players.find(player => player.id === body.playerId), team = room.teams.find(team => team.id === body.teamId);
    if (!player || !team) throw gameError("Choose a player and team."); player.teamId = team.id; return;
  }
  if (action === "start") {
    if (room.phase !== "lobby") throw gameError("This game has already started.", 409);
    if (room.players.length < 2) throw gameError("At least two students must join first.");
    if (room.mode === "teams") {
      if (room.players.some(player => !player.teamId)) throw gameError("Assign every student to a team first.");
      room.teams = room.teams.filter(team => room.players.some(player => player.teamId === team.id));
      if (room.teams.length < 2) throw gameError("Assign students to at least two teams.");
    }
    room.phase = "question"; room.round = 0; room.finalRound = room.mode === "survival" && gameUnit(room.questions, 0).length === room.questions.length; room.deadline = now + (room.mode === "teams" ? room.testMinutes * 60 : room.secondsPerQuestion * gameUnit(room.questions, 0).length) * 1000;
    room.notice = room.mode === "survival" ? "One wrong answer sends you to the audience. Everyone keeps playing." : "Work together. Every teammate must vote ready before moving on. Changing an answer clears the votes."; return;
  }
  if (action === "next") {
    if (room.mode !== "survival" || room.phase !== "reveal" || Number(body.round) !== room.round) throw gameError("This round has changed. Refresh the room.", 409);
    room.round += gameUnit(room.questions, room.round).length; room.roundAnswers = {}; room.unitAnswers = {}; room.finalRound = room.players.filter(player => player.alive).length <= 1 || room.round + gameUnit(room.questions, room.round).length >= room.questions.length;
    room.phase = "question"; room.deadline = now + room.secondsPerQuestion * gameUnit(room.questions, room.round).length * 1000;
    room.notice = room.finalRound ? "Final round: standing players can seal the win. The audience can steal it if they miss!" : "Choose carefully. The audience is still in the game."; return;
  }
  if (action === "finish" || action === "delete") {
    room.closedAt = new Date(now).toISOString();
    if (room.phase === "finished") return;
    if (room.mode === "teams" && room.phase !== "lobby") finishTeams(room);
    else { room.phase = "finished"; room.deadline = null; room.winners = []; room.notice = "The teacher ended this room."; } return;
  }
  if (room.phase !== "question") throw gameError("Wait for the next question.", 409);
  const player = room.players.find(player => player.id === actor.id);
  if (!player) throw gameError("Only students can answer or use boosters.", 403);
  if (player.excusedAt) throw gameError("Your teacher marked you as left class. Ask them to restore you before playing again.", 403);
  if (room.mode === "survival") {
    if (action !== "answer") throw gameError("Choose an answer.");
    if (body.questionId !== room.questions[room.round].question.id || Number(body.round) !== room.round) throw gameError("That question has ended.", 409);
    if (room.roundAnswers[player.id] !== undefined) throw gameError("Your answer is already locked.", 409);
    const unit = gameUnit(room.questions, room.round), answers = parseUnitAnswers(unit, body);
    (room.unitAnswers ??= {})[player.id] = answers;
    room.roundAnswers[player.id] = answers[unit[0].question.id];
    if (room.players.every(item => room.roundAnswers[item.id] !== undefined)) revealRound(room);
    return;
  }
  const team = room.teams.find(team => team.id === player.teamId);
  if (!team) throw gameError("Your teacher needs to assign your team.", 409);
  if (action === "clear-ink") { clearInk(team, body, now); return; }
  if (team.blockedUntil > now) throw gameError("Your team was sabotaged. Wait for the countdown.", 409);
  if (hasActiveInk(team, now)) throw gameError(`Clear all ${INK_SPLATS} ink splats with your team, or wait for the ink to fade.`, 409);
  if (action === "buy-sabotage") { buySabotage(room, team, String(body.boosterId ?? "")); return; }
  if (action === "use-sabotage" || action === "sabotage" || action === "booster") {
    useSabotage(room, team, String(body.boosterId ?? ""), body.teamId, now); return;
  }
  if (!["draft", "answer", "vote", "unvote", "review"].includes(action)) throw gameError("Choose a valid game action.");
  const unit = gameUnit(room.questions, team.index);
  if (!unit.length || Number(body.index) !== team.index || !unit.some(item => item.question.id === body.questionId)) throw gameError("Your team already moved on. The room will refresh.", 409);
  if (action === "draft") {
    const id = String(body.questionId); team.drafts ??= {};
    const value = body.answer === null ? undefined : parseAnswer(body.answer);
    if (sameAnswer(team.drafts[id], value)) return;
    if (value === undefined) delete team.drafts[id]; else team.drafts[id] = value;
    team.readyIds = []; team.draftVersion = (team.draftVersion ?? 0) + 1;
    team.draft = team.drafts[unit[0].question.id]; return;
  }
  const step = team.step ?? 0;
  if (Number(body.step) !== step || Number(body.draftVersion) !== (team.draftVersion ?? 0)) throw gameError("Your team's answer or position changed. Review it and vote again.", 409);
  if (action === "review") {
    const target = Number(body.targetStep);
    if (!Number.isInteger(target) || target < 0 || target > step) throw gameError("Everyone must vote ready to move forward.", 409);
    if (target !== step) { team.step = target; team.readyIds = []; team.draftVersion = (team.draftVersion ?? 0) + 1; }
    return;
  }
  if (action === "unvote") { team.readyIds = (team.readyIds ?? []).filter(id => id !== actor.id); return; }
  const drafts = team.drafts ?? (team.draft === undefined ? {} : { [unit[0].question.id]: team.draft });
  // Votes apply to the saved shared answer, never to an answer supplied by a stale tab.
  if (step < unit.length) parseAnswer(drafts[unit[step].question.id]);
  else parseUnitAnswers(unit, { answers: drafts });
  team.readyIds = [...new Set([...(team.readyIds ?? []), actor.id])];
  if (!activeTeamPlayers(room, team.id).every(member => team.readyIds!.includes(member.id))) return;
  team.readyIds = []; team.draftVersion = (team.draftVersion ?? 0) + 1;
  // English passages remain ungraded until everyone approves the passage review.
  if (unit[0].passage && unit[0].subject.toLowerCase() !== "math" && step < unit.length) { team.step = step + 1; return; }
  const answers = parseUnitAnswers(unit, { answers: drafts });
  for (const [offset, { question }] of unit.entries()) {
    const answer = answers[question.id], correct = isExamQuestionCorrect(question, answer);
    team.answers.push({ questionId: question.id, answer, correct, by: actor.id });
    team.score += correct ? 1 : 0; team.streak = correct ? team.streak + 1 : 0;
    if (room.party && correct) earnCoins(team);
    resolveLandmine(team, team.index + offset, correct, now);
  }
  team.index += unit.length; team.step = 0; delete team.draft; delete team.drafts;
  if (teamsDone(room)) finishTeams(room);
}

function sameAnswer(left: SelectedAnswer | undefined, right: SelectedAnswer | undefined) {
  const canonical = (value: SelectedAnswer | undefined) => value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b))) : value;
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
}

function parseUnitAnswers(unit: GameQuestion[], body: Record<string, unknown>) {
  const submitted = body.answers && typeof body.answers === "object" && !Array.isArray(body.answers) ? body.answers as Record<string, unknown> : unit.length === 1 ? { [unit[0].question.id]: body.answer } : {};
  // Validate the entire passage before applying any scores, streaks or movement.
  return Object.fromEntries(unit.map(({ question }) => [question.id, parseAnswer(submitted[question.id])]));
}

// The browser receives only the current question and never future answer keys.
// Strip nested keys as well as top-level keys (dropdowns, drag slots, number lines).
export function publicGameQuestion(item: GameQuestion): GameQuestion {
  const scrub = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(scrub);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).filter(([key]) => !key.startsWith("correct") && !key.startsWith("explanation")).map(([key, child]) => [key, scrub(child)]));
  };
  const clean = scrub(item) as GameQuestion;
  clean.question.requiredSelections ??= item.question.correctChoiceIds?.length ?? item.question.correctPointIds?.length;
  clean.question.requiredPlacements ??= Object.keys(item.question.correctPlacements ?? {}).length || undefined;
  return clean;
}
export function gameView(room: GameRoom, actor: GameActor, now: number, observingTeamId?: string): GameView {
  gameMember(room, actor);
  if (observingTeamId) {
    host(room, actor);
    if (room.mode !== "teams" || !room.teams.some(team => team.id === observingTeamId)) throw gameError("Choose a team in this race.", 404);
  }
  const { questions, roundAnswers, unitAnswers, teams, ...visible } = room;
  const canPlaytest = Boolean(room.playtest && actor.teacher && room.hostId === actor.id);
  const playerId = canPlaytest ? room.playtest!.controlledPlayerId : actor.id;
  const me: GamePlayer | null = observingTeamId ? null : room.players.find(player => player.id === playerId) ?? null;
  const myTeam = teams.find(team => team.id === (observingTeamId ?? me?.teamId));
  const item = room.mode === "survival" ? questions[room.round] : myTeam ? questions[myTeam.index] : undefined;
  const revealed = room.mode === "survival" && (room.phase === "reveal" || room.phase === "finished" && room.finalRound);
  const unit = gameUnit(questions, room.mode === "survival" ? room.round : myTeam?.index ?? questions.length);
  const position = room.mode === "survival" ? room.round : myTeam?.index ?? 0;
  return { ...visible, serverNow: now, isHost: room.hostId === actor.id && actor.teacher && !me, canPlaytest, me, totalQuestions: questions.length,
    ...(observingTeamId ? { observingTeamId } : {}),
    subjectPosition: { current: questions.slice(0, position).filter(question => question.subject === item?.subject).length + 1, total: questions.filter(question => question.subject === item?.subject).length },
    current: room.phase !== "lobby" && item && !(room.mode === "teams" && room.phase === "finished") ? publicGameQuestion(item) : null,
    answeredIds: Object.keys(roundAnswers), myAnswer: playerId ? roundAnswers[playerId] : undefined,
    unit: room.phase === "lobby" ? [] : unit.map(publicGameQuestion), myAnswers: room.mode === "teams" ? myTeam?.drafts ?? (myTeam?.draft !== undefined && item ? { [item.question.id]: myTeam.draft } : {}) : playerId ? unitAnswers?.[playerId] ?? (roundAnswers[playerId] !== undefined && item ? { [item.question.id]: roundAnswers[playerId] } : {}) : {},
    reveal: revealed ? { correctChoiceId: unit.length === 1 ? questions[room.round].question.correctChoiceId : undefined, explanation: unit.length === 1 ? questions[room.round].question.explanation : undefined, correctIds: room.players.filter(player => unit.every(({ question }) => isExamQuestionCorrect(question, unitAnswers?.[player.id]?.[question.id] ?? (unit.length === 1 ? roundAnswers[player.id] : undefined)))).map(player => player.id) } : null,
    teams: teams.map(team => ({ ...team, coins: teamCoins(team), boosters: 0, inventory: sabotageInventory(team), landmine: room.hostId === actor.id && actor.teacher ? team.landmine : undefined, readyIds: team.id === myTeam?.id || room.hostId === actor.id ? team.readyIds ?? [] : undefined, draft: team.id === myTeam?.id ? team.draft : undefined, drafts: team.id === myTeam?.id ? team.drafts : undefined, answers: room.phase === "finished" || room.hostId === actor.id || team.id === myTeam?.id ? team.answers : [], lastCorrect: team.id === myTeam?.id ? team.answers.at(-1)?.correct : undefined })),
  };
}
