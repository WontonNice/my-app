import { createHash, randomInt, randomUUID } from "node:crypto";
import { supabase } from "./supabase";
import { gameError, gameMember, mutateGame, tickGame, type GameActor } from "./gameEngine";
import { readQuestionBank } from "./questionBank";
import { getExamContent } from "./examContent";
import { listTeacherAssessments } from "../config/assessments";
import { getAllExamQuestions } from "../shared/examGrading";
import type { GameCatalog, GameQuestion, GameRoom, GameSummary } from "../shared/gameRooms";
import { getEnrolledClassIds, isStudentArchived } from "./auth";
import { initializePlaytest, mutatePlaytest, tickPlaytest } from "./gamePlaytest";
import { notifyWorldRoomChange } from "./gameWorldEvents";

const table = "live_game_rooms";
function storage(error: { message: string } | null) { if (error) throw gameError("Game room storage is unavailable. Apply migration 202610240001_live_game_rooms.sql and check the database connection.", 503); }
export async function gameUser(authorization: string | undefined): Promise<GameActor> {
  if (!authorization?.startsWith("Bearer ")) throw gameError("Sign in to open game rooms.", 401);
  const result = await supabase.auth.getUser(authorization.slice(7)).catch(() => { throw gameError("Sign-in verification is temporarily unavailable. Try again.", 503); }), user = result.data.user;
  if (result.error && ((result.error.status ?? 0) >= 500 || result.error.name === "AuthRetryableFetchError")) throw gameError("Sign-in verification is temporarily unavailable. Try again.", 503);
  if (result.error || !user || user.is_anonymous) throw gameError("Sign in again to open game rooms.", 401);
  const teacher = ["teacher", "admin"].includes(String(user.app_metadata.role));
  if (isStudentArchived(user) || !teacher && (user.app_metadata.role === "staff" || !getEnrolledClassIds(user.app_metadata).includes("shsat"))) throw gameError("An active SHSAT student or teacher account is required.", 403);
  return { id: user.id, name: String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Player").slice(0, 80), teacher };
}
const supported = (question: GameQuestion["question"]) => question.type !== "essay";
function assessmentQuestions(id: string): GameQuestion[] {
  const exam = getExamContent(id); if (!exam) throw gameError("Choose an available assessment.");
  return [
    ...exam.passageSets.flatMap(set => set.questions.map(question => ({ question, passage: set.passage, subject: "English" }))),
    ...(exam.standaloneSection?.questions ?? []).map(question => ({ question, subject: "English" })),
    ...(exam.mathSection?.questions ?? []).map(question => ({ question, subject: "Math" })),
  ];
}
export function gameCatalog(): GameCatalog {
  const lab = readQuestionBank().questions.filter(question => question.status === "published" && /shsat\s*lab/i.test(question.source));
  return { labQuestions: lab.length, assessments: listTeacherAssessments().map(assessment => {
    const content = getExamContent(assessment.id), questions = content ? getAllExamQuestions(content) : [];
    return { id: assessment.id, title: assessment.title, questions: questions.length, unsupported: questions.filter(question => !supported(question)).length };
  }).filter(item => item.questions > 0) };
}
const summary = (room: GameRoom): GameSummary => ({ id: room.id, code: room.code, title: room.title, mode: room.mode, phase: room.phase, sourceTitle: room.sourceTitle, players: room.players.length, updatedAt: room.updatedAt, playtest: Boolean(room.playtest) });
export async function listGames(actor: GameActor) {
  let query = supabase.from(table).select("payload");
  query = actor.teacher ? query.eq("host_id", actor.id) : query.contains("member_ids", [actor.id]);
  const result = await query.is("payload->>closedAt", null).neq("payload->>phase", "finished").order("updated_at", { ascending: false }).limit(30); storage(result.error);
  return (result.data ?? []).map(row => summary(row.payload as GameRoom));
}
export async function fetchGame(id: string, code = false): Promise<GameRoom> {
  if (!code && !/^[0-9a-f-]{36}$/i.test(id) || code && !/^[A-Z2-9]{6}$/.test(id)) throw gameError("Enter a valid room code.");
  const result = await supabase.from(table).select("payload").eq(code ? "code" : "id", id).maybeSingle(); storage(result.error);
  if (!result.data) throw gameError("Room not found. Check the code with your teacher.", 404);
  const room = result.data.payload as GameRoom;
  if (room.closedAt) throw gameError("This room has ended.", 410);
  return room;
}
function int(value: unknown, fallback: number, min: number, max: number) { const number = value === undefined ? fallback : Number(value); if (!Number.isInteger(number) || number < min || number > max) throw gameError(`Choose a whole number between ${min} and ${max}.`); return number; }
export async function createGame(actor: GameActor, body: Record<string, unknown>) {
  if (!actor.teacher) throw gameError("Only a teacher can create and start a game.", 403);
  if (body.mode !== "survival" && body.mode !== "teams" && body.mode !== "world") throw gameError("Choose a game mode.");
  if (body.mode === "world" && body.playtest === true) throw gameError("Open a 3D world to explore solo, then invite your students with its room code.");
  let questions: GameQuestion[], sourceTitle: string;
  if (body.mode === "world") {
    questions = []; sourceTitle = "Class world · Explore together";
  } else if (body.mode === "survival") {
    questions = readQuestionBank().questions.filter(question => question.status === "published" && /shsat\s*lab/i.test(question.source)).map(question => ({
      question: { id: question.id, type: "multiple_choice", prompt: question.prompt, topic: question.topic, choices: question.choices, correctChoiceId: question.correctChoiceId, explanation: question.explanation, image: question.visualImage }, subject: question.subject,
      ...(question.passage ? { passage: { id: createHash("sha256").update(JSON.stringify(question.passage)).digest("hex"), title: question.passage.title, format: question.passage.format, lines: question.passage.text.split("\n").map(text => ({ text })) } } : {}),
    }));
    if (questions.length < 3) throw gameError("Publish at least three SHSAT Lab questions in the bank first.");
    const grouped = new Map<string, GameQuestion[]>();
    for (const item of questions) { const key = item.subject.toLowerCase() !== "math" && item.passage ? item.passage.id : item.question.id; grouped.set(key, [...(grouped.get(key) ?? []), item]); }
    const units = [...grouped.values()];
    for (let index = units.length - 1; index > 0; index--) { const target = randomInt(index + 1); [units[index], units[target]] = [units[target], units[index]]; }
    const requested = int(body.questionCount, 10, 3, 50); questions = [];
    for (const unit of units) { if (questions.length >= requested) break; questions.push(...unit); }
    sourceTitle = "SHSAT Lab question bank";
  } else {
    if (typeof body.assessmentId !== "string") throw gameError("Choose a test for the team race.");
    const assessment = listTeacherAssessments().find(item => item.id === body.assessmentId);
    if (!assessment) throw gameError("Choose an available assessment.");
    questions = assessmentQuestions(assessment.id); sourceTitle = assessment.title;
    if (!questions.length || questions.some(item => !supported(item.question))) throw gameError("Choose a test with automatically graded questions. Essays are not supported in team races yet.");
  }
  const now = new Date().toISOString(), title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
  const teamCount = body.mode === "teams" ? int(body.teamCount, 2, 2, 10) : 0;
  for (let attempt = 0; attempt < 5; attempt++) {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", code = Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join("");
    const room: GameRoom = { id: randomUUID(), code, hostId: actor.id, title: title || (body.mode === "teams" ? "Team test race" : "Last one standing"), mode: body.mode, phase: "lobby", createdAt: now, updatedAt: now, revision: 1, party: body.mode === "teams" && body.party === true, secondsPerQuestion: int(body.secondsPerQuestion, 90, 15, 600), testMinutes: int(body.testMinutes, 180, 1, 240), sourceTitle, players: [], questions, teams: Array.from({ length: teamCount }, (_, index) => ({ id: `team-${index + 1}`, name: `Team ${index + 1}`, index: 0, score: 0, streak: 0, coins: 0, boosters: 0, blockedUntil: 0, answers: [] })), round: 0, finalRound: false, deadline: null, roundAnswers: {}, winners: [], notice: "Share the room code. Students can join until the teacher starts." };
    if (body.mode === "world") {
      room.title = title || "Class world";
      room.phase = "question";
      room.notice = "Your world is open. Share the room code so students can join and explore together.";
    }
    if (body.playtest === true) initializePlaytest(room, Date.parse(now));
    const result = await supabase.from(table).insert({ id: room.id, code, host_id: actor.id, member_ids: [], revision: 1, updated_at: now, payload: room });
    if (result.error?.code === "23505") continue; storage(result.error); return room;
  }
  throw gameError("Could not reserve a room code. Try again.", 503);
}
/** Compare-and-swap retries make student answers, shared drafts, purchases and ink cleanup atomic across server instances. */
export async function updateGame(id: string, actor: GameActor, action?: string, body: Record<string, unknown> = {}) {
  for (let attempt = 0; attempt < 12; attempt++) {
    const room = await fetchGame(id);
    if (action !== "join") gameMember(room, actor);
    const now = Date.now(), expired = tickGame(room, now);
    // Apply user actions before bots, so switching perspective and disabling
    // autoplay cannot race an automatic answer from the same simulated player.
    let simulated = false;
    if (action) {
      if (expired && ["answer", "draft", "vote", "unvote", "review", "sabotage", "booster", "buy-sabotage", "use-sabotage", "clear-ink", "test-answer", "test-select", "test-next", "test-step", "test-teammate", "test-team-ready", "test-sabotage"].includes(action)) {
        // Persist the deadline transition before returning the refreshed view.
      } else if (action.startsWith("test-") || room.playtest && ["answer", "draft", "vote", "unvote", "review", "sabotage", "booster", "buy-sabotage", "use-sabotage", "clear-ink", "chat", "tools"].includes(action)) mutatePlaytest(room, actor, action, body, now);
      else mutateGame(room, actor, action, body, now);
      if (room.playtest && action === "start") room.playtest.nextBotAt = now + 12000;
    }
    if (!action) simulated = tickPlaytest(room, now);
    if (!action && !expired && !simulated) return room;
    const previous = room.revision; room.revision++; room.updatedAt = new Date(now).toISOString();
    const result = await supabase.from(table).update({ revision: room.revision, updated_at: room.updatedAt, member_ids: room.playtest ? [] : room.players.map(player => player.id), payload: room }).eq("id", id).eq("revision", previous).select("id"); storage(result.error);
    if (result.data?.length) { if (room.mode === "world") notifyWorldRoomChange(room); return room; }
  }
  throw gameError("The room is busy updating. Try your action again.", 409);
}
