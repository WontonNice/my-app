import { getExamContent } from './examContent';
import { resumeExamContent } from '../shared/examResume';
import type { ExamContent } from '../shared/examTypes';

export function contentForExamAttempt(id: string, saved: ExamContent | undefined, open: boolean): ExamContent | null {
  const current = getExamContent(id);
  return open && current ? resumeExamContent(current, saved) : saved ?? current;
}
