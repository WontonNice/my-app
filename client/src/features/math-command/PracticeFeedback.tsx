import { CircleCheck, CircleX } from 'lucide-react';
import type { ExamQuestion } from '../../../../server/src/shared/examTypes';
import { mathCorrectAnswer } from '../../../../server/src/shared/mathCommandAnalytics';
import { ExamAnswer, ExamText } from '../../components/ExamReviewQuestion';
import { practiceAccuracy, type PracticeState } from './inequalitySession';

function ResultIndicator({ correct }: { correct: boolean }) {
  const Icon = correct ? CircleCheck : CircleX;
  return <><Icon size={18} aria-hidden="true"/>{correct ? 'Correct' : 'Incorrect'}</>;
}

export function PracticeStats({ state, correct }: { state: PracticeState; correct?: boolean }) {
  return <div className="mc-practice-stats" role="status" aria-label="Session statistics">
    <span>Streak <strong>{state.streak}</strong></span>
    <span>Best streak <strong>{state.longestStreak}</strong></span>
    <span>Accuracy <strong>{practiceAccuracy(state)}</strong> <small>({state.correct}/{state.checked})</small></span>
    {correct !== undefined && <span className={`mc-practice-result ${correct ? 'is-correct' : 'is-incorrect'}`}><ResultIndicator correct={correct}/></span>}
  </div>;
}

export function PracticeFeedback({ question, correct }: { question: ExamQuestion; correct: boolean }) {
  return <section className={`mc-player-answer mc-practice-feedback ${correct ? 'is-correct' : 'is-incorrect'}`} role="status" aria-label="Answer feedback">
    <h2><ResultIndicator correct={correct}/>{question.correctChoiceId ? ` · Answer ${question.correctChoiceId}` : ''}</h2>
    {!question.correctChoiceId && <ExamAnswer question={question} answer={question.correctTextAnswers?.[0] ?? mathCorrectAnswer(question) ?? undefined}/>}
    <div><ExamText text={question.explanation || ''}/></div>
    <p>Select the Next arrow to continue.</p>
  </section>;
}
