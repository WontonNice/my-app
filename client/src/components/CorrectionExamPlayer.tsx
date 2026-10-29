import { useState } from "react";
import { ExamSessionPage } from "../pages/ExamSessionPage";
import { gameExamContent } from "../features/games/gameExamContent";
import { ExamAnswer } from "./ExamReviewQuestion";
import { correctExamAnswer } from "../lib/examReviewAnswer";
import type { SelectedAnswers } from "../lib/examResults";
import type { ReviewQuestion } from "../../../server/src/shared/examCorrections";

type Props = {
  item: ReviewQuestion; title: string; studentName: string; showAnswers: boolean;
  readOnly: boolean; canPrevious: boolean; canNext: boolean;
  onPrevious: () => void; onNext: () => void;
};

/** The real exam player, scoped to the submitted snapshot. Trial answers never save to an exam. */
export function CorrectionExamPlayer({ item, title, studentName, showAnswers, readOnly, ...navigation }: Props) {
  const original: SelectedAnswers = item.submittedAnswer === undefined ? {} : { [item.question.id]: item.submittedAnswer };
  const [answers, setAnswers] = useState<SelectedAnswers>(original);
  const session = gameExamContent(`correction:${item.question.id}`, title, [{ question: item.question, passage: item.passage, subject: item.section }]);
  return <div className="correction-exam-player">
    <div className="correction-player-help">
      <span>{readOnly ? "Submitted question · Read-only preview" : "Try the question again using your exam tools. Your original answer and grade stay saved."}</span>
      {!readOnly && <button type="button" onClick={() => setAnswers(original)}>Restore submitted answer</button>}
    </div>
    <fieldset className="correction-player-surface" disabled={readOnly} aria-label="Exam question player">
      <ExamSessionPage gameSession={{ ...session,
        assessment: { id: session.content.assessmentId, title, classId: "shsat", createdAt: "", updatedAt: "", description: "Corrections", durationMinutes: 0, allowCompletedAccess: true, passages: [], questions: [], sectionAccess: { english: true, math: true }, split: false, status: "open" },
        studentName, answers, onAnswersChange: readOnly ? () => undefined : setAnswers,
        onSubmit: async () => false, timerText: "", hideTimer: true,
        subjectPosition: { current: item.number, total: item.number },
        correctionReview: { number: item.number, ...navigation },
      }} />
    </fieldset>
    <div className="exam-review-answer-comparison correction-player-answers">
      <section className={item.isCorrect ? "is-correct" : "is-incorrect"}><h3>Your submitted answer</h3><ExamAnswer question={item.question} answer={item.submittedAnswer} /></section>
      {showAnswers && <section className="is-correct"><h3>Correct answer</h3><ExamAnswer question={item.question} answer={correctExamAnswer(item.question)} /></section>}
    </div>
  </div>;
}
