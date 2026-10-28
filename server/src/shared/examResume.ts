import type { ExamContent, ExamQuestion } from './examTypes';

/** Keep saved question wording/keys while admitting newly published question IDs. */
export function resumeExamContent(current: ExamContent, saved?: ExamContent | null): ExamContent {
  if (!saved || saved.assessmentId !== current.assessmentId) return current;
  const frozen = new Map<string, ExamQuestion>([
    ...saved.passageSets.flatMap(set => set.questions),
    ...(saved.standaloneSection?.questions ?? []),
    ...(saved.mathSection?.questions ?? []),
  ].map(question => [question.id, question]));
  const questions = (items: ExamQuestion[]) => items.map(question => frozen.get(question.id) ?? question);
  return {
    ...current,
    passageSets: current.passageSets.map(set => ({ ...set,
      passage: saved.passageSets.find(old => old.id === set.id)?.passage ?? set.passage,
      questions: questions(set.questions), questionCount: set.questions.length,
    })),
    ...(current.standaloneSection ? { standaloneSection: { ...current.standaloneSection, questions: questions(current.standaloneSection.questions) } } : {}),
    ...(current.mathSection ? { mathSection: { ...current.mathSection, questions: questions(current.mathSection.questions) } } : {}),
  };
}

/** Revising one section must not silently regrade the other submitted section. */
export function preserveSubmittedSections(current: ExamContent, saved: ExamContent | undefined, sections: ('english' | 'math')[]): ExamContent {
  if (!saved || saved.assessmentId !== current.assessmentId) return current;
  return { ...current,
    ...(sections.includes('english') ? { passageSets: saved.passageSets, standaloneSection: saved.standaloneSection } : {}),
    ...(sections.includes('math') ? { mathSection: saved.mathSection } : {}),
  };
}
