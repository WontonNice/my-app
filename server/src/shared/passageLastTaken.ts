import type { ExamContent } from './examTypes';
import type { ExamResult } from './examGrading';
import { submittedExamSections } from './examCompletion';

export type PassageLastTaken = { completedAt: string; source: 'exam' | 'library'; title?: string };

export function newerPassageAttempt(current: PassageLastTaken | null, candidate: PassageLastTaken): PassageLastTaken | null {
  const date = Date.parse(candidate.completedAt);
  return Number.isFinite(date) && (!current || date > Date.parse(current.completedAt)) ? candidate : current;
}

/** Match source passage identities, never titles shared by unrelated passages. */
export function passageExamAttempt(ids: readonly string[], result: Partial<ExamResult>, content?: ExamContent | null): PassageLastTaken | null {
  if (!submittedExamSections(result).includes('english')) return null;
  const snapshot = result.analysisContent ?? content;
  const passages = result.passages ?? [];
  const matches = passages.some(passage => passage.total > 0 && (ids.includes(passage.id) || snapshot?.passageSets.some(set => set.id === passage.id && ids.includes(set.passage.id))))
    || (!passages.length && snapshot?.passageSets.some(set => set.questions.length > 0 && ids.includes(set.passage.id)));
  if (!matches) return null;
  // Later math submissions must not move the English completion date forward.
  const completedAt = result.sectionCompletedAt?.english ?? result.completedAt;
  return completedAt && Number.isFinite(Date.parse(completedAt)) ? { completedAt, source: 'exam', title: result.title ?? snapshot?.title } : null;
}
