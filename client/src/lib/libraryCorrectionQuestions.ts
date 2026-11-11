import type { ExamPassage, ExamPassageSet } from '../content/exams/types';
import type { StudentLibraryCorrectionView } from './api';
import type { ReviewQuestion } from '../../../server/src/shared/examCorrections';
import { libraryAnswer } from '../../../server/src/shared/libraryBooks';

/** Review submitted membership and order, even after a teacher changes the book. */
export function libraryCorrectionQuestions(
  attempt: StudentLibraryCorrectionView['attempt'],
  passageSet: ExamPassageSet,
  questionPassages: Record<string, ExamPassage> = {},
): (ReviewQuestion & { responseQuestionId: string })[] {
  return attempt.questions.flatMap(result => {
    const question = result.questionSnapshot ?? passageSet.questions.find(item => item.id === result.questionId);
    if (!question) return [];
    return [{
      question, responseQuestionId: result.questionId,
      passage: result.passageSnapshot ?? questionPassages[question.id] ?? passageSet.passage,
      number: result.questionNumber, section: 'english' as const,
      passageSection: passageSet.section ?? 'reading',
      submittedAnswer: libraryAnswer(result.selectedAnswerId), isCorrect: result.isCorrect,
    }];
  });
}
