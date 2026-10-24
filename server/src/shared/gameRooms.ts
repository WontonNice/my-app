import type { ExamQuestion, ExamPassage } from "./examTypes";
import type { SelectedAnswer } from "./examGrading";

export type GameMode = "survival" | "teams";
export type GamePhase = "lobby" | "question" | "reveal" | "finished";
export type GameQuestion = { question: ExamQuestion; passage?: ExamPassage; subject: string };
export type GamePlayer = { id: string; name: string; joinedAt: string; teamId: string | null; alive: boolean; score: number };
export type GameTeam = { id: string; name: string; index: number; score: number; streak: number; boosters: number; inventory?: Record<string, number>; blockedUntil: number; draft?: SelectedAnswer; drafts?: Record<string, SelectedAnswer>; answers: { questionId: string; answer: SelectedAnswer; correct: boolean; by: string }[] };
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

/** Add new booster definitions here and a server effect handler in gameBoosters.ts. */
export const GAME_BOOSTERS = [
  { id: "blackout", name: "Blackout", description: "Blank an opposing team's exam for 10 seconds.", target: "opponent", durationSeconds: 10, maxStored: 3, earnedEvery: 3 },
] as const;
