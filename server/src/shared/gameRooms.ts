import type { GameToolState } from "./gameTools";
import type { ExamQuestion, ExamPassage } from "./examTypes";
import type { SelectedAnswer } from "./examGrading";
import type { CrystalState, CrystalView } from "./crystalDefense";

export type GameMode = "survival" | "teams" | "world";
export type GamePhase = "lobby" | "question" | "reveal" | "finished";
export type GameQuestion = { question: ExamQuestion; passage?: ExamPassage; subject: string };
export type GamePlayer = { id: string; name: string; joinedAt: string; teamId: string | null; alive: boolean; score: number; excusedAt?: string };
export type SabotageSource = { teamId: string; teamName: string; boosterId: string };
export type GameChatMessage = { id: string; playerId: string; name: string; text: string; at: number };
export type Landmine = { id?: string; questionIndex: number; choiceId?: string; source: SabotageSource };
export type LandmineResolution = { outcome: "disarmed" | "defused" | "triggered" | "avoided"; source: SabotageSource; coinsLost?: number; questionIndex?: number };
export type LandmineResult = LandmineResolution & { at: number; traps?: LandmineResolution[] };
export type GameAnswerFeedback = { questionId: string; questionIndex: number; correct: boolean; streak: number };
export type GameTeam = { id: string; name: string; index: number; score: number; streak: number; boosters: number; inventory?: Record<string, number>; coins?: number; blockedUntil: number; sabotagedBy?: SabotageSource; landmine?: Landmine; landmines?: Landmine[]; landmineResult?: LandmineResult; pendingFeedback?: GameAnswerFeedback[]; answerFeedback?: GameAnswerFeedback; tools?: Record<string, GameToolState>; messages?: GameChatMessage[]; coinReceipt?: { at: number; base: number; bonus: number; penalty: number }; inkBomb?: { id: string; expiresAt: number; clearedSplats: number[]; source: SabotageSource }; step?: number; draftVersion?: number; readyIds?: string[]; draft?: SelectedAnswer; drafts?: Record<string, SelectedAnswer>; answers: { questionId: string; answer: SelectedAnswer; correct: boolean; by: string }[] };
export type GameCursor = { anchor: string; x: number; y: number; index: number; step: number };
export type GamePresence = { peerId: string; playerId: string; teamId: string; name: string; color: string; cursor: GameCursor | null };
export type GameRoom = {
  id: string; code: string; hostId: string; title: string; mode: GameMode; phase: GamePhase;
  createdAt: string; updatedAt: string; revision: number; party: boolean; secondsPerQuestion: number;
  testMinutes: number; sourceTitle: string; players: GamePlayer[]; teams: GameTeam[]; questions: GameQuestion[];
  round: number; finalRound: boolean; deadline: number | null; roundAnswers: Record<string, SelectedAnswer>;
  winners: string[]; notice: string;
  closedAt?: string;
  worldBlockedIds?: string[];
  crystal?: CrystalState;
  unitAnswers?: Record<string, Record<string, SelectedAnswer>>;
  playtest?: { controlledPlayerId: string | null; autoPlay: boolean; nextBotAt: number; unlimitedCoins?: boolean; autoReady?: boolean; clockRemainingMs?: number; lastTargetTeamId?: string; returnPlayerId?: string };
};
export type GameSummary = Pick<GameRoom, "id" | "code" | "title" | "mode" | "phase" | "sourceTitle" | "updatedAt"> & { players: number; playtest?: boolean };
export type GameView = Omit<GameRoom, "questions" | "roundAnswers" | "unitAnswers" | "teams" | "crystal"> & {
  crystal?: CrystalView;
  serverNow: number; isHost: boolean; canPlaytest?: boolean; me: GamePlayer | null; totalQuestions: number; current: GameQuestion | null;
  answeredIds: string[]; myAnswer?: SelectedAnswer; reveal: { correctChoiceId?: string; explanation?: string; correctIds: string[] } | null;
  unit: GameQuestion[]; myAnswers: Record<string, SelectedAnswer>;
  subjectPosition: { current: number; total: number };
  teamChat: GameChatMessage[];
  teamTools: { playerId: string; name: string; state: GameToolState }[];
  playtestKeys?: { questionId: string; number: number; answer: string }[];
  mineTargets: { teamId: string; questions: { questionIndex: number; label: string; choices: string[] }[] }[];
  observingTeamId?: string;
  teams: (Omit<GameTeam, "answers" | "messages" | "tools"> & { answers: GameTeam["answers"]; lastCorrect?: boolean })[];
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
export const GAME_CORRECT_COINS = 100;
export const LANDMINE_PENALTY = 100;
export const streakBonus = (streak: number) => streak > 0 && streak % GAME_COIN_STREAK === 0 ? streak / GAME_COIN_STREAK * GAME_CORRECT_COINS : 0;
export const INK_SPLATS = 7;
/** Purchases enter shared inventory; using one requires a separate target selection. */
export const GAME_BOOSTERS = [
  { id: "landmine", name: "Landmine", description: "Choose an unsubmitted question and one answer choice. Plant multiple traps, even on the same team. Choosing a mined correct answer defuses it; a mined wrong answer costs 100 coins per trap.", kind: "Hidden trap", stat: "PICK A QUESTION + CHOICE", counter: "Answer correctly to disarm it.", image: "/game-items/landmine.png", cost: 300, durationSeconds: 0 },
  { id: "ink-bomb", name: "Ink Bomb", description: "Cover another team's screens with 7 ink splats. They must click them all to clear the ink, or wait 30 seconds.", kind: "Instant disruption", stat: "7 SPLATS · 30s MAX", counter: "Clear all 7 splats together, or wait it out.", image: "/game-items/ink-bomb.png", cost: 300, durationSeconds: 30 },
] as const;

/** Read saved single traps as well as the current collection; writes migrate them together. */
export function activeLandmines(team: Pick<GameTeam, "landmine" | "landmines">): Landmine[] {
  return [...(team.landmine ? [team.landmine] : []), ...(team.landmines ?? [])];
}

export function hasActiveInk(team: Pick<GameTeam, "inkBomb">, now: number) {
  return Boolean(team.inkBomb && team.inkBomb.expiresAt > now && team.inkBomb.clearedSplats.length < INK_SPLATS);
}

export function activeTeamPlayers(room: Pick<GameRoom, "players">, teamId: string) {
  return room.players.filter(player => player.teamId === teamId && !player.excusedAt);
}
