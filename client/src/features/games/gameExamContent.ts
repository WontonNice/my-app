import type { ExamContent } from '../../../../server/src/shared/examTypes';
import type { GameQuestion } from '../../../../server/src/shared/gameRooms';

/** Pass authored content to the normal exam player without rebuilding its markup. */
export function gameExamContent(id: string, title: string, unit: GameQuestion[]): { content: ExamContent; screen: 'mathQuestion' | 'passage' | 'standaloneQuestion' } {
  const first = unit[0];
  if (!first) throw new Error('A game challenge needs at least one question.');
  const questions = unit.map(item => item.question);
  const directions = { subject: 'English Language Arts', title: 'Reading Comprehension Directions', body: 'Read the passage and answer all questions. Review your answers before completing the passage.' };
  const content: ExamContent = { assessmentId: id, title, passageSets: [] };
  if (/^(math|mathematics)$/i.test(first.subject)) {
    content.mathSection = { id: 'game-math', label: 'Math', questionCount: questions.length, questions, directions: { subject: 'Mathematics', title: 'Math Directions', body: 'Answer the question, then select Next when ready.', notes: [] } };
    return { content, screen: 'mathQuestion' };
  }
  if (first.passage) {
    content.passageSets = [{ id: first.passage.id, directions, questionCount: questions.length, questions, passage: first.passage }];
    return { content, screen: 'passage' };
  }
  content.standaloneSection = { id: 'game-english', label: 'English', questionCount: questions.length, questions, directions };
  return { content, screen: 'standaloneQuestion' };
}
