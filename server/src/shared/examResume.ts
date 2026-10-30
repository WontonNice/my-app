import type { ExamContent } from './examTypes';
import { orderedEnglishQuestions, orderByQuestionIds } from './examQuestionOrder';

/** An open section uses the published edition. Submitted sections are preserved separately. */
export function resumeExamContent(current: ExamContent, saved?: ExamContent | null): ExamContent {
  void saved;
  return current;
}

/** Revising one section must not silently regrade the other submitted section. */
export function preserveSubmittedSections(current: ExamContent, saved: ExamContent | undefined, sections: ('english' | 'math')[]): ExamContent {
  if (!saved || saved.assessmentId !== current.assessmentId) return current;
  const english = sections.includes('english') ? saved : current;
  const math = sections.includes('math') ? saved : current;
  return { ...current,
    ...(sections.includes('english') ? { passageSets: saved.passageSets, standaloneSection: saved.standaloneSection } : {}),
    ...(sections.includes('math') ? { mathSection: saved.mathSection } : {}),
    // The displayed order belongs to the section snapshot too. A later edition
    // may interleave or reorder the same IDs without changing their answers.
    ...((current.questionOrder || saved.questionOrder) && sections.length ? { questionOrder: [
      ...orderedEnglishQuestions(english).map(location => location.question.id),
      ...orderByQuestionIds(math.mathSection?.questions ?? [], math.questionOrder).map(question => question.id),
    ] } : {}),
  };
}
