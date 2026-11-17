import { isExamQuestionCorrect, type SelectedAnswer } from '../examGrading';
import type { ExamQuestion } from '../examTypes';
import { createRng, hash, type Level } from './kit';
import { adaptiveFamily, adaptiveTopicById, adaptiveTopics } from './topics';

// Adaptive math exam engine. It keeps a running estimate of how well a student
// knows each SHSAT math topic, moves on once it is confident a topic is
// understood, and keeps returning to topics the student misses.

export type AdaptiveMode = 'exam' | 'practice';
export type TopicStatus = 'new' | 'learning' | 'weak' | 'mastered';
export type TopicProgress = {
  attempts: number; correct: number;
  /** Estimated probability (0 to 1) that the student has mastered the topic. */
  mastery: number;
  /** Difficulty of the next question on this topic: 1 foundation, 2 standard, 3 challenge. */
  level: Level;
  streak: number; missStreak: number;
  /** Value of `asked` when the topic was last used, or -1. */
  lastAsked: number;
  status: TopicStatus;
  /** How many variants of each question family have been used. */
  used: Record<string, number>;
};
export type AdaptiveReason = 'survey' | 'follow-up' | 'weak' | 'building' | 'review';
export type AdaptivePick = { topicId: string; familyId: string; index: number; level: Level; reason: AdaptiveReason };
export type AdaptiveResponse = AdaptivePick & { n: number; answer: SelectedAnswer; correct: boolean; skipped?: boolean; ms: number; at: number; mode: AdaptiveMode };
export type AdaptiveState = {
  version: 1; seed: string; startedAt: number; updatedAt: number; mode: AdaptiveMode;
  /** Questions answered (or skipped) so far. */
  asked: number; correct: number;
  topics: Record<string, TopicProgress>;
  current: AdaptivePick | null;
  answer: SelectedAnswer;
  /** Practice mode only: the current question has been checked and its feedback is showing. */
  submitted: boolean; lastCorrect: boolean | null;
  /** The student is looking at the report; the exam can always be continued. */
  finished: boolean;
  totalMs: number; questionMs: number;
  responses: AdaptiveResponse[];
  /** Fingerprints of recently shown questions, to avoid immediate repeats. */
  recent: number[];
};

export const adaptivePrior = 0.35, masteredAt = 0.88, weakBelow = 0.3;
const responseLimit = 300, recentLimit = 60;
const guessByLevel = [0.4, 0.25, 0.2], slipByLevel = [0.05, 0.1, 0.2];

const newProgress = (): TopicProgress => ({ attempts: 0, correct: 0, mastery: adaptivePrior, level: 2, streak: 0, missStreak: 0, lastAsked: -1, status: 'new', used: {} });

function fingerprint(question: ExamQuestion) { return hash(question.prompt + '|' + (question.choices ?? []).map(choice => choice.text).join('|') + '|' + (question.image?.src.length ?? 0) + (question.image?.alt ?? '')); }

/** The generated question for a pick. Deterministic, so a saved exam can rebuild it. */
export function adaptiveQuestionFor(seed: string, pick: Pick<AdaptivePick, 'topicId' | 'familyId' | 'index'>): ExamQuestion {
  const family = adaptiveFamily(pick.topicId, pick.familyId);
  if (!family) throw new Error('This question type is no longer available.');
  return family.generate(pick.index, seed);
}
export function adaptiveQuestion(state: AdaptiveState): ExamQuestion | null { return state.current ? adaptiveQuestionFor(state.seed, state.current) : null; }

function consecutiveOnTopic(state: AdaptiveState, topicId: string) { let count = 0; for (let i = state.responses.length - 1; i >= 0 && state.responses[i].topicId === topicId; i--) count++; return count; }

function chooseTopic(state: AdaptiveState, rng: ReturnType<typeof createRng>): { topicId: string; reason: AdaptiveReason } {
  const last = state.responses[state.responses.length - 1], since = (id: string) => state.asked - state.topics[id].lastAsked;
  // A missed question is followed by one more on the same topic, a step easier.
  if (last && !last.correct && state.topics[last.topicId].status !== 'mastered' && consecutiveOnTopic(state, last.topicId) < 2) return { topicId: last.topicId, reason: 'follow-up' };
  const others = adaptiveTopics.filter(topic => topic.id !== last?.topicId), status = (id: string) => state.topics[id].status;
  const oldest = (ids: string[]) => [...ids].sort((a, b) => since(b) - since(a) || state.topics[a].mastery - state.topics[b].mastery)[0];
  const weak = others.filter(topic => status(topic.id) === 'weak' && since(topic.id) >= 2).map(topic => topic.id);
  const open = others.filter(topic => status(topic.id) === 'learning').map(topic => topic.id);
  const fresh = others.filter(topic => status(topic.id) === 'new');
  const review = others.filter(topic => status(topic.id) === 'mastered' && since(topic.id) >= 15).map(topic => topic.id);
  // First pass: keep surveying untested topics so every weak area is found early, while already
  // returning to missed topics. Once everything has been tried, all attention goes to topics that
  // are not yet mastered, with an occasional spot check of a mastered one.
  const surveying = adaptiveTopics.some(topic => status(topic.id) === 'new');
  const weights = surveying ? { weak: weak.length ? 20 : 0, open: open.length ? 30 : 0, fresh: fresh.length ? 50 : 0, review: 0 }
    : { weak: weak.length ? 60 : 0, open: open.length ? 40 : 0, fresh: 0, review: review.length ? 5 : 0 };
  const total = weights.weak + weights.open + weights.fresh + weights.review;
  if (!total) {
    // Nothing else is due: stay with unfinished topics, or spot-check the topic seen longest ago.
    const unfinished = adaptiveTopics.filter(topic => status(topic.id) !== 'mastered').map(topic => topic.id);
    if (unfinished.length) return { topicId: oldest(unfinished), reason: status(oldest(unfinished)) === 'weak' ? 'weak' : 'building' };
    return { topicId: oldest((others.length ? others : adaptiveTopics).map(topic => topic.id)), reason: 'review' };
  }
  let roll = rng.int(1, total);
  if ((roll -= weights.weak) <= 0) return { topicId: oldest(weak), reason: 'weak' };
  if ((roll -= weights.open) <= 0) return { topicId: oldest(open), reason: 'building' };
  if ((roll -= weights.fresh) <= 0) {
    // Vary the category like a real test, and favor the topics the SHSAT asks most.
    const lastCategory = last ? adaptiveTopicById.get(last.topicId)?.category : undefined;
    const scored = fresh.map(topic => ({ id: topic.id, weight: topic.weight * (topic.category === lastCategory ? 1 : 3) }));
    let pick = rng.int(1, scored.reduce((sum, item) => sum + item.weight, 0));
    for (const item of scored) if ((pick -= item.weight) <= 0) return { topicId: item.id, reason: 'survey' };
    return { topicId: scored[0].id, reason: 'survey' };
  }
  return { topicId: oldest(review), reason: 'review' };
}

function buildPick(state: AdaptiveState, topicId: string, reason: AdaptiveReason, rng: ReturnType<typeof createRng>): { pick: AdaptivePick; used: Record<string, number>; mark: number } {
  const topic = adaptiveTopicById.get(topicId)!, progress = state.topics[topicId];
  const target: Level = reason === 'review' ? (Math.max(2, progress.level) as Level) : progress.level;
  const distance = Math.min(...topic.families.map(family => Math.abs(family.level - target)));
  let candidates = topic.families.filter(family => Math.abs(family.level - target) === distance);
  const lowest = Math.min(...candidates.map(family => family.level)); candidates = candidates.filter(family => family.level === lowest);
  // Rotate through the families at this level so the same question type does not repeat back to back.
  const fewest = Math.min(...candidates.map(family => progress.used[family.id] ?? 0));
  const atLevel = [...rng.shuffle(candidates.filter(family => (progress.used[family.id] ?? 0) === fewest)), ...rng.shuffle(candidates.filter(family => (progress.used[family.id] ?? 0) !== fewest))];
  // Other levels are only a safety net in case every variant at this level fails to build.
  for (const group of [atLevel, rng.shuffle(topic.families.filter(family => !candidates.includes(family)))]) {
    let repeat: { pick: AdaptivePick; used: Record<string, number>; mark: number } | undefined;
    for (const family of group) {
      const start = progress.used[family.id] ?? 0;
      for (let index = start; index < start + 8; index++) {
        try {
          const mark = fingerprint(family.generate(index, state.seed)), result = { pick: { topicId, familyId: family.id, index, level: family.level, reason }, used: { ...progress.used, [family.id]: index + 1 }, mark };
          if (!state.recent.includes(mark)) return result;
          repeat ??= result;
        } catch { /* Try the next variant; a bad variant must never stop the exam. */ }
      }
    }
    // Every fresh variant at this level was shown recently, so a repeat is better than changing the difficulty.
    if (repeat) return repeat;
  }
  throw new Error('No question could be prepared for this topic.');
}

function nextPick(state: AdaptiveState): AdaptiveState {
  const rng = createRng(`${state.seed}:pick:${state.asked}:${state.responses.length}`), { topicId, reason } = chooseTopic(state, rng), built = buildPick(state, topicId, reason, rng);
  return { ...state, current: built.pick, answer: '', submitted: false, lastCorrect: null, questionMs: 0, recent: [...state.recent, built.mark].slice(-recentLimit),
    topics: { ...state.topics, [topicId]: { ...state.topics[topicId], used: built.used } } };
}

export function createAdaptiveState(seed: string, now: number, mode: AdaptiveMode = 'exam'): AdaptiveState {
  const state: AdaptiveState = { version: 1, seed, startedAt: now, updatedAt: now, mode, asked: 0, correct: 0, topics: Object.fromEntries(adaptiveTopics.map(topic => [topic.id, newProgress()])), current: null, answer: '', submitted: false, lastCorrect: null, finished: false, totalMs: 0, questionMs: 0, responses: [], recent: [] };
  return nextPick(state);
}

/** Bayesian knowledge tracing: harder questions count for more, and a lucky guess counts for less. */
export function updatedProgress(progress: TopicProgress, level: Level, correct: boolean, multipleChoice: boolean, mode: AdaptiveMode, asked: number): TopicProgress {
  const guess = multipleChoice ? guessByLevel[level - 1] : 0.05, slip = slipByLevel[level - 1], prior = progress.mastery;
  const posterior = correct ? prior * (1 - slip) / (prior * (1 - slip) + (1 - prior) * guess) : prior * slip / (prior * slip + (1 - prior) * (1 - guess));
  // A little learning happens with every question, more when feedback is shown.
  const mastery = Math.min(0.99, Math.max(0.01, posterior + (1 - posterior) * (mode === 'practice' ? 0.08 : 0.03)));
  const streak = correct ? progress.streak + 1 : 0, missStreak = correct ? 0 : progress.missStreak + 1, attempts = progress.attempts + 1;
  const mastered = attempts >= 2 && (mastery >= masteredAt && streak >= 2 || streak >= 3 && level >= 2);
  const status: TopicStatus = mastered ? 'mastered' : mastery < weakBelow || missStreak >= 2 ? 'weak' : 'learning';
  return { ...progress, attempts, correct: progress.correct + Number(correct), mastery: Math.round(mastery * 1000) / 1000, streak, missStreak, lastAsked: asked, status,
    level: (correct ? Math.min(3, level + 1) : Math.max(1, level - 1)) as Level };
}

export function selectAdaptiveAnswer(state: AdaptiveState, answer: SelectedAnswer): AdaptiveState { return state.submitted || state.finished ? state : { ...state, answer }; }

/** Grade the current question. Exam mode moves straight on; practice mode waits so feedback can be shown. */
export function submitAdaptiveAnswer(state: AdaptiveState, now: number, skipped = false): AdaptiveState {
  if (!state.current || state.submitted || state.finished) return state;
  // Nothing is graded until an answer is chosen; "I don't know" is the explicit way to move on without one.
  if (!skipped && (typeof state.answer === 'string' ? !state.answer.trim() : !Object.keys(state.answer).length)) return state;
  const question = adaptiveQuestion(state)!, answer = skipped ? '' : state.answer, correct = !skipped && isExamQuestionCorrect(question, answer), pick = state.current;
  const response: AdaptiveResponse = { ...pick, n: state.asked, answer, correct, ...(skipped ? { skipped: true } : {}), ms: state.questionMs, at: now, mode: state.mode };
  const graded: AdaptiveState = { ...state, asked: state.asked + 1, correct: state.correct + Number(correct), updatedAt: now, answer, lastCorrect: correct, responses: [...state.responses, response].slice(-responseLimit),
    topics: { ...state.topics, [pick.topicId]: updatedProgress(state.topics[pick.topicId], pick.level, correct, question.type === 'multiple_choice', state.mode, state.asked) } };
  return state.mode === 'practice' ? { ...graded, submitted: true } : nextPick(graded);
}
/** Practice mode: leave the feedback and go to the next question. */
export function advanceAdaptive(state: AdaptiveState): AdaptiveState { return state.submitted && !state.finished ? nextPick(state) : state; }
export function setAdaptiveMode(state: AdaptiveState, mode: AdaptiveMode): AdaptiveState { return state.mode === mode ? state : { ...state, mode }; }
export function finishAdaptive(state: AdaptiveState, now: number): AdaptiveState { return state.finished ? state : { ...state, finished: true, updatedAt: now }; }
export function continueAdaptive(state: AdaptiveState, now: number): AdaptiveState {
  if (!state.finished) return state;
  const open = { ...state, finished: false, updatedAt: now };
  return open.submitted || !open.current ? nextPick(open) : open;
}
export function addAdaptiveTime(state: AdaptiveState, elapsedMs: number): AdaptiveState {
  if (state.finished || !Number.isFinite(elapsedMs) || elapsedMs <= 0) return state;
  const ms = Math.min(Math.round(elapsedMs), 5 * 60 * 1000);
  return { ...state, totalMs: state.totalMs + ms, questionMs: state.questionMs + (state.submitted ? 0 : ms) };
}

export type AdaptiveTopicSummary = { id: string; category: string; label: string; status: TopicStatus; attempts: number; correct: number; mastery: number };
export function adaptiveSummary(state: AdaptiveState) {
  const topics: AdaptiveTopicSummary[] = adaptiveTopics.map(topic => { const progress = state.topics[topic.id]; return { id: topic.id, category: topic.category, label: topic.label, status: progress.status, attempts: progress.attempts, correct: progress.correct, mastery: progress.mastery }; });
  const count = (status: TopicStatus) => topics.filter(topic => topic.status === status).length;
  return { topics, total: topics.length, mastered: count('mastered'), weak: count('weak'), learning: count('learning'), untested: count('new'), asked: state.asked, correct: state.correct, complete: count('mastered') === topics.length };
}

const isLevel = (value: unknown): value is Level => value === 1 || value === 2 || value === 3;
const wholeNumber = (value: unknown, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= max;
function validAnswer(answer: unknown): answer is SelectedAnswer {
  if (JSON.stringify(answer ?? null).length > 2000) return false;
  return typeof answer === 'string' || (Array.isArray(answer) ? answer.every(value => typeof value === 'string') : Boolean(answer && typeof answer === 'object' && Object.values(answer).every(value => typeof value === 'string')));
}
function validPick(pick: unknown): pick is AdaptivePick {
  const value = pick as AdaptivePick;
  return Boolean(value && typeof value === 'object' && adaptiveFamily(value.topicId, value.familyId) && wholeNumber(value.index, 1e7) && isLevel(value.level) && ['survey', 'follow-up', 'weak', 'building', 'review'].includes(value.reason));
}
/** Accept only a well-formed saved exam; topics added later are filled in as untested. */
export function parseAdaptiveState(raw: unknown): AdaptiveState | null {
  try {
    const value = (typeof raw === 'string' ? JSON.parse(raw) : raw) as AdaptiveState | null;
    if (!value || typeof value !== 'object' || value.version !== 1 || typeof value.seed !== 'string' || !/^[a-zA-Z0-9-]{4,64}$/.test(value.seed)) return null;
    if (!['startedAt', 'updatedAt', 'asked', 'correct', 'totalMs', 'questionMs'].every(key => wholeNumber((value as unknown as Record<string, unknown>)[key]))) return null;
    if (value.correct > value.asked || value.asked > 1e6 || value.mode !== 'exam' && value.mode !== 'practice' || typeof value.submitted !== 'boolean' || typeof value.finished !== 'boolean') return null;
    if (value.lastCorrect !== null && typeof value.lastCorrect !== 'boolean' || !validAnswer(value.answer)) return null;
    if (value.current !== null && (typeof value.current !== 'object' || typeof value.current.topicId !== 'string' || typeof value.current.familyId !== 'string') || value.submitted && !value.current) return null;
    // If the question type on screen was retired in a later release, keep the progress and pick a new question.
    const current = value.current && validPick(value.current) ? value.current : null, replaced = Boolean(value.current) && !current;
    if (!value.topics || typeof value.topics !== 'object' || Array.isArray(value.topics)) return null;
    const topics: Record<string, TopicProgress> = {};
    for (const topic of adaptiveTopics) {
      const saved = value.topics[topic.id];
      if (saved === undefined) { topics[topic.id] = newProgress(); continue; }
      if (!saved || typeof saved !== 'object' || !wholeNumber(saved.attempts) || !wholeNumber(saved.correct) || saved.correct > saved.attempts || typeof saved.mastery !== 'number' || !(saved.mastery >= 0 && saved.mastery <= 1) || !isLevel(saved.level)
        || !wholeNumber(saved.streak) || !wholeNumber(saved.missStreak) || !Number.isSafeInteger(saved.lastAsked) || saved.lastAsked < -1 || !['new', 'learning', 'weak', 'mastered'].includes(saved.status) || !saved.used || typeof saved.used !== 'object' || Array.isArray(saved.used)) return null;
      const used: Record<string, number> = {};
      for (const family of topic.families) { const count = saved.used[family.id]; if (count !== undefined) { if (!wholeNumber(count, 1e7)) return null; used[family.id] = count; } }
      topics[topic.id] = { attempts: saved.attempts, correct: saved.correct, mastery: saved.mastery, level: saved.level, streak: saved.streak, missStreak: saved.missStreak, lastAsked: saved.lastAsked, status: saved.status, used };
    }
    if (!Array.isArray(value.responses) || value.responses.length > responseLimit || !Array.isArray(value.recent) || value.recent.length > recentLimit || !value.recent.every(item => wholeNumber(item, 0xffffffff))) return null;
    const responses: AdaptiveResponse[] = [];
    for (const row of value.responses) {
      if (!row || typeof row !== 'object' || !wholeNumber(row.n) || typeof row.correct !== 'boolean' || !wholeNumber(row.ms) || !wholeNumber(row.at) || row.mode !== 'exam' && row.mode !== 'practice' || !validAnswer(row.answer) || !isLevel(row.level) || !wholeNumber(row.index, 1e7)) return null;
      // A question type retired after the answer was saved is dropped from review rather than failing the whole exam.
      if (validPick(row)) responses.push({ topicId: row.topicId, familyId: row.familyId, index: row.index, level: row.level, reason: row.reason, n: row.n, answer: row.answer, correct: row.correct, ...(row.skipped ? { skipped: true } : {}), ms: row.ms, at: row.at, mode: row.mode });
    }
    const state: AdaptiveState = { version: 1, seed: value.seed, startedAt: value.startedAt, updatedAt: value.updatedAt, mode: value.mode, asked: value.asked, correct: value.correct, topics, current: current && { topicId: current.topicId, familyId: current.familyId, index: current.index, level: current.level, reason: current.reason }, answer: replaced ? '' : value.answer, submitted: replaced ? false : value.submitted, lastCorrect: replaced ? null : value.lastCorrect, finished: value.finished, totalMs: value.totalMs, questionMs: value.questionMs, responses, recent: value.recent };
    return state.current || state.finished ? state : nextPick(state);
  } catch { return null; }
}
/** Positive when `left` is the copy to keep: a restarted exam replaces the old one, otherwise the copy with more answers wins. */
export function compareAdaptiveStates(left: AdaptiveState | null, right: AdaptiveState | null): number {
  if (!left || !right) return Number(Boolean(left)) - Number(Boolean(right));
  // With the same number of answers, a copy still showing practice feedback is the earlier one:
  // the student has since pressed Next in the other copy.
  return left.startedAt - right.startedAt || left.asked - right.asked || Number(right.submitted) - Number(left.submitted) || left.updatedAt - right.updatedAt || left.totalMs - right.totalMs;
}
