import { useState, type FormEvent } from 'react';
import { CorrectionExamPlayer } from './CorrectionExamPlayer';
import type { ExamPassage, ExamPassageSet } from '../content/exams/types';
import type { StudentLibraryCorrectionView } from '../lib/api';
import { libraryCorrectionQuestions } from '../lib/libraryCorrectionQuestions';
import { correctionQuestionTypes } from '../../../server/src/shared/correctionTypes';
import '../styles/studentCorrections.css';

export type CorrectionDraft = Record<string, {
  whyChosenIncorrect: string;
  whyCorrectAnswerCorrect: string;
  questionType?: string;
}>;

export function LibraryCorrectionsWorkspace({
  collectionLabel, correctionDraft, correctionError, isLoading, isSubmitting,
  onBack, onDraftChange, onRetry, onSubmit, passageSet, questionPassages = {}, studentName, view, readOnly = false,
}: {
  collectionLabel: string;
  correctionDraft: CorrectionDraft;
  correctionError: string;
  isLoading: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onDraftChange: (questionId: string, field: keyof CorrectionDraft[string], value: string) => void;
  onRetry: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  passageSet: ExamPassageSet;
  questionPassages?: Record<string, ExamPassage>;
  studentName: string;
  view: StudentLibraryCorrectionView | null;
  readOnly?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [questionMenuOpen, setQuestionMenuOpen] = useState(true);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const questions = view ? libraryCorrectionQuestions(view.attempt, passageSet, questionPassages) : [];
  const item = questions[active];
  const locked = readOnly || Boolean(view?.correction);
  const saved = view?.correction?.responses.find(response => response.questionId === item?.responseQuestionId);
  const draft = saved ?? correctionDraft[item?.responseQuestionId ?? ''] ?? { whyChosenIncorrect: '', whyCorrectAnswerCorrect: '', questionType: '' };
  const missed = view?.attempt.questions.filter(question => !question.isCorrect).length ?? 0;
  const goToQuestion = (index: number) => setActive(Math.max(0, Math.min(questions.length - 1, index)));

  return <main className="exam-corrections-page">
    <header className="exam-corrections-toolbar"><div className="exam-corrections-toolbar-inner">
      <button type="button" onClick={onBack}>Back to passage</button>
      <div className="exam-corrections-toolbar-navigation" aria-label="Previous and next question">
        <button type="button" aria-label="Previous question" disabled={!item || active === 0} onClick={() => goToQuestion(active - 1)}>‹</button>
        <button type="button" aria-label="Next question" disabled={!item || active === questions.length - 1} onClick={() => goToQuestion(active + 1)}>›</button>
      </div>
      <button type="button" className="exam-corrections-question-toggle" aria-expanded={questionMenuOpen} onClick={() => setQuestionMenuOpen(value => !value)}>Questions</button>
      <strong>{collectionLabel} corrections</strong><span>{studentName}</span>
    </div></header>
    <nav className="exam-corrections-breadcrumb" aria-label="Correction location"><div><span>{passageSet.passage.title}</span>{item && <><span>/</span><span>Question {item.number}</span></>}</div></nav>
    <div className="exam-corrections-content">
      <header className="exam-corrections-intro"><div><h1>Passage corrections</h1><p>{passageSet.passage.title} · Read the passage, review your answer, then explain your thinking.</p></div>
        {view && <div className="correction-progress"><span>First attempt: <strong>{view.attempt.score} / {view.attempt.totalQuestions}</strong></span><span>{view.correction ? 'Submitted to your teacher' : `${missed} corrections to complete`}</span></div>}
      </header>
      {readOnly && <p className="exam-review-success">Student preview · read only</p>}
      {isLoading ? <p role="status" className="exam-corrections-loading">Loading your first attempt…</p> : !view ? <div role="alert" className="exam-review-error">{correctionError || 'Corrections could not be opened.'} <button type="button" onClick={onRetry}>Try again</button></div> : <div className="exam-corrections-layout">
        {questionMenuOpen && <nav className="exam-corrections-question-map" aria-label="Correction question navigation">
          <div className="exam-corrections-question-map-heading"><h2>Your questions</h2><p><span className="is-incorrect" /> Incorrect <span className="is-correct" /> Correct</p></div>
          <div className="exam-corrections-question-sections"><section><h3>English</h3><div className="exam-correction-nav">{questions.map((question, index) => <button key={question.responseQuestionId} type="button" className={`${question.isCorrect ? 'is-correct' : 'is-incorrect'}${index === active ? ' is-active' : ''}`} aria-current={index === active ? 'step' : undefined} aria-label={`English question ${question.number}, ${question.isCorrect ? 'correct' : 'incorrect'}`} onClick={() => goToQuestion(index)}>{question.number}</button>)}</div></section></div>
        </nav>}
        <section className="exam-correction-work">
          {questions.length !== view.attempt.questions.length && <p role="alert" className="exam-review-error">Some original questions are unavailable. Ask your teacher to check this passage before submitting corrections.</p>}
          {item && <>
            <article className="exam-correction-viewer">
              <div className="exam-correction-question-heading"><div><strong>English · Question {item.number}</strong><p className="correction-passage-label">{item.passage?.title}</p></div><div className="exam-correction-question-actions"><span className={item.isCorrect ? 'is-correct' : 'is-incorrect'}>{item.isCorrect ? 'Correct answer' : 'Incorrect answer'}</span><button type="button" aria-pressed={revealed.has(item.responseQuestionId)} onClick={() => setRevealed(current => { const next = new Set(current); if (next.has(item.responseQuestionId)) next.delete(item.responseQuestionId); else next.add(item.responseQuestionId); return next; })}>{revealed.has(item.responseQuestionId) ? 'Hide answer' : 'Show answer'}</button></div></div>
              <CorrectionExamPlayer key={`${view.attempt.id}:${item.responseQuestionId}`} item={item} title={passageSet.passage.title} studentName={studentName} showAnswers={revealed.has(item.responseQuestionId)} readOnly={readOnly} canPrevious={active > 0} canNext={active < questions.length - 1} onPrevious={() => goToQuestion(active - 1)} onNext={() => goToQuestion(active + 1)} />
            </article>
            <form onSubmit={onSubmit}>
              {!item.isCorrect ? <section className="exam-correction-response-panel" aria-labelledby="library-correction-thinking">
                <header><div><h2 id="library-correction-thinking">Explain your thinking</h2><p>Use evidence from the passage to explain both answers.</p></div><span>{view.correction ? 'Submitted' : 'Required'}</span></header>
                <fieldset disabled={isSubmitting}>
                  <label>Question type{locked ? <strong>{draft.questionType || 'Not recorded for this question'}</strong> : <select required value={draft.questionType || ''} onChange={event => onDraftChange(item.responseQuestionId, 'questionType', event.target.value)}><option value="">Choose a question type</option>{correctionQuestionTypes(questions.map(question => question.question), 'english', item.passageSection ?? 'reading').map(type => <option key={type} value={type}>{type}</option>)}</select>}</label>
                  <label>Why is the answer I chose incorrect?<textarea required readOnly={locked} maxLength={4000} rows={4} value={draft.whyChosenIncorrect} onChange={event => onDraftChange(item.responseQuestionId, 'whyChosenIncorrect', event.target.value)} /></label>
                  <label>Why is the correct answer correct?<textarea required readOnly={locked} maxLength={4000} rows={4} value={draft.whyCorrectAnswerCorrect} onChange={event => onDraftChange(item.responseQuestionId, 'whyCorrectAnswerCorrect', event.target.value)} /></label>
                </fieldset>
              </section> : <p className="exam-review-success">Correct on your first attempt. No written correction is needed for this question.</p>}
              {correctionError && <p className="exam-review-error" role="alert">{correctionError}</p>}
              {!locked && <div className="library-correction-submit"><p>Complete every missed question, then submit all corrections once. Your original score stays unchanged.</p><button type="submit" disabled={isSubmitting || questions.length !== view.attempt.questions.length}>{isSubmitting ? 'Submitting…' : 'Submit all corrections'}</button></div>}
            </form>
          </>}
        </section>
      </div>}
    </div>
  </main>;
}
