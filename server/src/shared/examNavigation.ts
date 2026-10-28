export type ExamSubject = 'english' | 'math';
export type ExamPosition = {
  screen: 'directions' | 'passageIntro' | 'readingDirections' | 'passage' | 'passageEnd'
    | 'standaloneIntro' | 'standaloneDirections' | 'standaloneQuestion' | 'endSection'
    | 'mathIntro' | 'mathDirections' | 'mathQuestion';
  questionId?: string;
  passageSetId?: string;
};
export type ExamNavigation = { subject: ExamSubject; english?: ExamPosition; math?: ExamPosition };

/** Shared by device storage and the API. Never restore arbitrary screens or indices. */
export function normalizeExamNavigation(value: unknown): ExamNavigation | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  const candidate = value as Record<string, unknown>;
  if (candidate.subject !== 'english' && candidate.subject !== 'math') return;
  const result: ExamNavigation = { subject: candidate.subject };
  for (const subject of ['english', 'math'] as const) {
    const position = candidate[subject];
    if (!position || typeof position !== 'object' || Array.isArray(position)) continue;
    const p = position as Record<string, unknown>;
    const screens = subject === 'math' ? ['mathIntro', 'mathDirections', 'mathQuestion']
      : ['directions', 'passageIntro', 'readingDirections', 'passage', 'passageEnd', 'standaloneIntro', 'standaloneDirections', 'standaloneQuestion', 'endSection'];
    if (typeof p.screen !== 'string' || !screens.includes(p.screen)) continue;
    const id = (value: unknown) => typeof value === 'string' && value.length > 0 && value.length <= 300;
    if ((p.screen === 'passage' || p.screen.endsWith('Question')) && !id(p.questionId)) continue;
    if (['passageIntro', 'readingDirections', 'passage', 'passageEnd'].includes(p.screen) && !id(p.passageSetId)) continue;
    result[subject] = { screen: p.screen as ExamPosition['screen'],
      ...(id(p.questionId) ? { questionId: p.questionId as string } : {}),
      ...(id(p.passageSetId) ? { passageSetId: p.passageSetId as string } : {}),
    };
  }
  return result;
}
