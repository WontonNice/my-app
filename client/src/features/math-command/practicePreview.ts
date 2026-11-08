import { generatePracticeQuestion } from '../../../../server/src/shared/infinitePractice';
import { generateCatalogQuestion } from '../../../../server/src/shared/practiceCatalog';
import { libraryCorrectAnswer } from '../../../../server/src/shared/libraryBooks';
import type { ExamQuestion } from '../../../../server/src/shared/examTypes';
import { checkPracticeAnswer, currentPracticeGeneratorId, nextPracticeQuestion, type PracticeState } from './inequalitySession';

export function practiceQuestion(state: PracticeState) {
  const definition = state.generatorDefinitions?.find(generator => generator.id === currentPracticeGeneratorId(state));
  return definition ? generateCatalogQuestion(definition, Math.floor((state.sequenceIndex ?? state.index) / state.generatorIds.length), state.seed, state.generationVersion ?? 1) : generatePracticeQuestion(state.generatorIds, state.sequenceIndex ?? state.index, state.seed, state.generationVersion ?? 1);
}

export function previewCorrectAnswer(question: ExamQuestion) {
  return question.correctTextAnswers?.[0] ?? libraryCorrectAnswer(question);
}

export function browsePreviewGeneration(state: PracticeState, sequenceIndex: number): PracticeState {
  return { ...state, responses:[],sequenceIndex: Math.max(0, sequenceIndex), index: 0, answer: '', submitted: false, finished: false, checked: 0, correct: 0, streak: 0, longestStreak: 0, generatorStreaks: {}, moduleStreaks:{},moduleLongestStreaks:{}, unlockedGeneratorIds: [], hiddenGeneratorIds: [], totalMs: 0, questionMs: 0, answeredMs: 0 };
}

/** Exercise the same scoring, advancement, and unlock transitions as real practice. */
export function simulatePreviewAnswers(state: PracticeState, count: number, correct: boolean): PracticeState {
  let next = state;
  for (let index = 0; index < count && !next.finished; index++) {
    if (next.submitted) next = nextPracticeQuestion(next);
    const answer = correct ? previewCorrectAnswer(practiceQuestion(next)) : '__preview_incorrect__';
    next = checkPracticeAnswer({ ...next, answer }, correct);
  }
  return next;
}
