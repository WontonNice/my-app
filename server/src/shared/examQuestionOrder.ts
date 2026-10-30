import type { ExamContent, ExamQuestion } from './examTypes';

export type EnglishQuestionLocation = {
  kind: 'passage' | 'standalone';
  passageIndex: number;
  questionIndex: number;
  question: ExamQuestion;
};
export type EnglishSegment = {
  kind: EnglishQuestionLocation['kind'];
  passageIndex: number;
  questions: EnglishQuestionLocation[];
};

/** Ignore stale/duplicate order IDs; newly added questions remain reachable. */
export function orderByQuestionIds<T extends { id: string }>(questions: T[], order?: string[]): T[] {
  if (!order?.length) return questions;
  const byId = new Map(questions.map(question => [question.id, question]));
  const result: T[] = [];
  for (const id of order) {
    const question = byId.get(id);
    if (question) { result.push(question); byId.delete(id); }
  }
  return [...result, ...questions.filter(question => byId.has(question.id))];
}

export function orderedEnglishQuestions(content: ExamContent): EnglishQuestionLocation[] {
  const locations: EnglishQuestionLocation[] = [
    ...content.passageSets.flatMap((set, passageIndex) => set.questions.map((question, questionIndex) => ({ kind: 'passage' as const, passageIndex, questionIndex, question }))),
    ...(content.standaloneSection?.questions ?? []).map((question, questionIndex) => ({ kind: 'standalone' as const, passageIndex: 0, questionIndex, question })),
  ];
  return orderByQuestionIds(locations.map(location => ({...location,id:location.question.id})),content.questionOrder);
}

/** Consecutive questions sharing one reading surface form a navigation segment. */
export function orderedEnglishSegments(content: ExamContent): EnglishSegment[] {
  const result: EnglishSegment[] = [];
  for (const location of orderedEnglishQuestions(content)) {
    const last = result.at(-1);
    if (last && last.kind === location.kind && last.passageIndex === location.passageIndex) last.questions.push(location);
    else result.push({ kind: location.kind, passageIndex: location.passageIndex, questions: [location] });
  }
  return result;
}
