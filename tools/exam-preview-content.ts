import { resolveExamContent } from '../client/src/content/exams';
import type { ExamContent } from '../server/src/shared/examTypes';
import type { ExamPreviewSession } from '../client/src/pages/ExamSessionPage';

export function createExamPreviewSession(content: ExamContent & {previewMetadata?:Pick<ExamPreviewSession['assessment'],'durationMinutes'|'studyHallWorksheet'>}, startingSubject: 'english' | 'math', onExit: () => void): ExamPreviewSession {
  const assessment: ExamPreviewSession['assessment'] = {
    id: content.assessmentId, title: content.title, description: '',
    allowCompletedAccess: true, classId: '', createdAt: '', updatedAt: '',
    durationMinutes: content.previewMetadata?.durationMinutes || 180, studyHallWorksheet:content.previewMetadata?.studyHallWorksheet, passages: [], questions: [],
    sectionAccess: { english: true, math: true }, split: false, status: 'open',
  };
  return { assessment, content: resolveExamContent(assessment, content), startingSubject, onExit };
}
