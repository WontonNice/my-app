import type { ExamContent } from './examTypes';

/** An open section uses the published edition. Submitted sections are preserved separately. */
export function resumeExamContent(current: ExamContent, saved?: ExamContent | null): ExamContent {
  void saved;
  return current;
}

/** Revising one section must not silently regrade the other submitted section. */
export function preserveSubmittedSections(current: ExamContent, saved: ExamContent | undefined, sections: ('english' | 'math')[]): ExamContent {
  if (!saved || saved.assessmentId !== current.assessmentId) return current;
  return { ...current,
    ...(sections.includes('english') ? { passageSets: saved.passageSets, standaloneSection: saved.standaloneSection } : {}),
    ...(sections.includes('math') ? { mathSection: saved.mathSection } : {}),
  };
}
