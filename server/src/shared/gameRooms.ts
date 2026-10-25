import type { ExamQuestion, ExamPassage } from "./examTypes";
import type { SelectedAnswer } from "./examGrading";

export type GameMode = "survival" | "teams";
export type GamePhase = "lobby" | "question" | "reveal" | "finished";
export type GameQuestion = { question: ExamQuestion; passage?: ExamPassage; subject: string };
export type GamePlayer = { id: string; name: string; joinedAt: string; teamId: string | null; alive: boolean; score: number; excusedAt?: string };
export type SabotageSource = { teamId: string; teamName: string; boosterId: string };
export type GameTeam = { id: string; name: string; index: number; score: number; streak: number; boosters: number; inventory?: Record<string, number>; coins?: number; blockedUntil: number; sabotagedBy?: SabotageSource; landmine?: { questionIndex: number; source: SabotageSource }; landmineResult?: { outcome: "disarmed" | "triggered"; at: number; source: SabotageSource }; inkBomb?: { id: string; expiresAt: number; clearedSplats: number[]; source: SabotageSource }; step?: number; draftVersion?: number; readyIds?: string[]; draft?: SelectedAnswer; drafts?: Record<string, SelectedAnswer>; answers: { questionId: string; answer: SelectedAnswer; correct: boolean; by: string }[] };
export type GameCursor = { anchor: string; x: number; y: number; index: number; step: number };
export type GamePresence = { peerId: string; playerId: string; teamId: string; name: string; color: string; cursor: GameCursor | null };
export type GameRoom = {
  id: string; code: string; hostId: string; title: string; mode: GameMode; phase: GamePhase;
  createdAt: string; updatedAt: string; revision: number; party: boolean; secondsPerQuestion: number;
  testMinutes: number; sourceTitle: string; players: GamePlayer[]; teams: GameTeam[]; questions: GameQuestion[];
  round: number; finalRound: boolean; deadline: number | null; roundAnswers: Record<string, SelectedAnswer>;
  winners: string[]; notice: string;
  closedAt?: string;
  unitAnswers?: Record<string, Record<string, SelectedAnswer>>;
  playtest?: { controlledPlayerId: string | null; autoPlay: boolean; nextBotAt: number };
};
export type GameSummary = Pick<GameRoom, "id" | "code" | "title" | "mode" | "phase" | "sourceTitle" | "updatedAt"> & { players: number; playtest?: boolean };
export type GameView = Omit<GameRoom, "questions" | "roundAnswers" | "unitAnswers" | "teams"> & {
  serverNow: number; isHost: boolean; canPlaytest?: boolean; me: GamePlayer | null; totalQuestions: number; current: GameQuestion | null;
  answeredIds: string[]; myAnswer?: SelectedAnswer; reveal: { correctChoiceId?: string; explanation?: string; correctIds: string[] } | null;
  unit: GameQuestion[]; myAnswers: Record<string, SelectedAnswer>;
  subjectPosition: { current: number; total: number };
  observingTeamId?: string;
  teams: (Omit<GameTeam, "answers"> & { answers: GameTeam["answers"]; lastCorrect?: boolean })[];
};
export type GameCatalog = { labQuestions: number; assessments: { id: string; title: string; questions: number; unsupported: number }[] };

/** A math question is a checkpoint; an English passage stays together. */
export function gameUnit(questions: GameQuestion[], start: number): GameQuestion[] {
  const first = questions[start];
  if (!first) return [];
  if (first.subject.toLowerCase() === "math" || !first.passage) return [first];
  const result = [first];
  for (let index = start + 1; index < questions.length; index++) {
    const item = questions[index];
    if (item.subject.toLowerCase() === "math" || item.passage?.id !== first.passage.id) break;
    result.push(item);
  }
  return result;
}

export const GAME_COIN_STREAK = 3;
export const INK_SPLATS = 7;
/** Purchases enter shared inventory; using one requires a separate target selection. */
export const GAME_BOOSTERS = [
  { id: "landmine", name: "Landmine", description: "Hide a trap on another team's next question. A correct answer disarms it; a wrong answer triggers a 5-second blackout.", cost: 1, durationSeconds: 5 },
  { id: "ink-bomb", name: "Ink Bomb", description: "Cover another team's screens with 7 ink splats. They must click them all to clear the ink, or wait 30 seconds.", cost: 1, durationSeconds: 30 },
] as const;

export function hasActiveInk(team: Pick<GameTeam, "inkBomb">, now: number) {
  return Boolean(team.inkBomb && team.inkBomb.expiresAt > now && team.inkBomb.clearedSplats.length < INK_SPLATS);
}

export function activeTeamPlayers(room: Pick<GameRoom, "players">, teamId: string) {
  return room.players.filter(player => player.teamId === teamId && !player.excusedAt);
}
