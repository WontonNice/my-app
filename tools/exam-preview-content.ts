import { resolveExamContent } from '../client/src/content/exams';
import type { ExamContent } from '../server/src/shared/examTypes';
import type { ExamPreviewSession } from '../client/src/pages/ExamSessionPage';

export function createExamPreviewSession(content: ExamContent, startingSubject: 'english' | 'math', onExit: () => void): ExamPreviewSession {
  const assessment: ExamPreviewSession['assessment'] = {
    id: content.assessmentId, title: content.title, description: '',
    allowCompletedAccess: true, classId: '', createdAt: '', updatedAt: '',
    durationMinutes: 180, passages: [], questions: [],
    sectionAccess: { english: true, math: true }, split: false, status: 'open',
  };
  return { assessment, content: resolveExamContent(assessment, content), startingSubject, onExit };
}
