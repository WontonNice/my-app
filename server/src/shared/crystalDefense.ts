import type { GameQuestion } from "./gameRooms";

export type CrystalSource = { kind: "exam-math" | "lab-reading" | "infinite-math"; assessmentId?: string; moduleId?: string; topic?: string; subtopic?: string };
export type CrystalTopic = { topic: string; count: number; subtopics: { name: string; count: number }[] };
export type CrystalCatalog = { assessments: { id: string; title: string; mathCount: number; topics: CrystalTopic[] }[]; readingTopics: { topic: string; count: number }[]; infiniteAvailable: boolean; infiniteModules: { id: string; title: string; description: string; topics: CrystalTopic[] }[] };
export type CrystalConfig = { source: CrystalSource; /** Legacy saved games only; endless games ignore this value. */ waves?: number };
export type CrystalPhase = "lobby" | "battle" | "intermission" | "victory" | "defeat";
export type CrystalItem = { id: string; ownerId: string; kind: "speed" | "retry"; x: number; z: number; pickedUpAt?: number };
export type CrystalParticipant = { id: string; name: string; ready: boolean; score: number; lastSeen: number; left?: boolean; spectating?: boolean; pendingMonsterId?: string; speedStacks?: number; retryReady?: boolean; pickedItemWave?: number; lastPickup?: { itemId: string; kind: CrystalItem["kind"]; at: number }; lastResult?: { monsterId: string; correct: boolean; at: number; points: number; retry?: boolean } };
export type CrystalMonster = { id: string; questionIndex: number; lane: number; stage: number; maxStrikes: number; status: "queued" | "active" | "challenged" | "defeated" | "breached"; claimedBy?: string; attemptId?: string; retryAvailableFor?: string; failedIds: string[]; changedAt: number; progress?: number; lastMovedAt?: number; travelMs?: number; moving?: boolean };
export type CrystalTeacherMode = "play" | "spectate" | "playtest";
export type CrystalState = { runId: string; teacherMode?: CrystalTeacherMode; config: CrystalConfig; sourceTitle: string; phase: CrystalPhase; participants: CrystalParticipant[]; questions: GameQuestion[]; monsters: CrystalMonster[]; items?: CrystalItem[]; wave: number; waveSize: number; wavePlayers?: number; nextQuestion: number; questionDeck?: number[]; deckPosition?: number; lastQuestionIndex?: number; nextMonsterId?: number; idleSince?: Record<string, number>; hearts: number; nextWaveAt: number | null; notice: string; defeated: number; breached: number; retreated: number };
export type CrystalMonsterView = Omit<CrystalMonster, "questionIndex" | "attemptId">;
export type CrystalView = Omit<CrystalState, "questions" | "monsters" | "items" | "participants" | "nextQuestion" | "questionDeck" | "deckPosition" | "lastQuestionIndex" | "nextMonsterId" | "idleSince"> & { hostId: string | null; isHost: boolean; canAdmin: boolean; teamShieldActive: boolean; serverNow: number; movementPaused: boolean; items: CrystalItem[]; participants: (CrystalParticipant & { online: boolean })[]; monsters: CrystalMonsterView[]; questionCount: number; questionsRemaining: number; totalPoints: number; activePlayers: number; challenges: { playerId: string; monsterId: string; attemptId: string; question: GameQuestion }[] };

export const CRYSTAL_MAX_HEARTS = 5;
export const CRYSTAL_CORRECT_POINTS = 100;
export const CRYSTAL_OFFLINE_MS = 60000;
export const CRYSTAL_INTERMISSION_MS = 5000;
export const CRYSTAL_REINFORCEMENT_MS = 12000;
export const CRYSTAL_ANIMATION_RETENTION_MS = 5000;
export const CRYSTAL_PICKUP_DISTANCE = 1.5;
export const crystalSpeedMultiplier = (stacks = 0) => 1 + Math.min(3, Math.max(0, Number.isFinite(stacks) ? Math.floor(stacks) : 0)) * .1;
/** Pressure grows every wave up to the scene's initial-monster budget. */
export const crystalWaveSize = (players: number, wave: number) => players ? Math.min(160, players + Math.ceil(.25 * players) + Math.max(0, wave - 1) * Math.max(1, Math.ceil(.2 * players))) : 0;
export const crystalTravelMs = (wave: number) => Math.max(100000, 150000 - Math.max(0, wave - 1) * 10000);
export const crystalMaxStrikes = (wave: number) => wave <= 2 ? 3 : 2;
export function crystalMonsterPosition(monster: Pick<CrystalMonsterView, "lane" | "stage" | "maxStrikes" | "status" | "progress" | "lastMovedAt" | "travelMs" | "moving">, now = monster.lastMovedAt ?? 0, wave = 1) {
  const elapsed = monster.status === "active" && monster.moving !== false ? Math.max(0, now - (monster.lastMovedAt ?? now)) : 0;
  const progress = Math.min(1, Math.max(0, (monster.progress ?? 0) + elapsed / (monster.travelMs ?? crystalTravelMs(wave))));
  const radius = monster.status === "breached" ? 1 : 17 - 16 * progress;
  return { x: Math.sin(monster.lane) * radius, z: Math.cos(monster.lane) * radius };
}
