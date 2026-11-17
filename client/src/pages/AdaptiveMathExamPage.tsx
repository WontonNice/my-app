import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CircleCheck, CircleDashed, CircleX, RotateCcw, Target, TrendingUp } from 'lucide-react';
import { AppLink } from '../components/AppLink';
import { ExamAnswer, ExamText } from '../components/ExamReviewQuestion';
import { StudentPortalShell } from '../components/StudentPortalShell';
import { useAccountProfile } from '../features/account/account';
import { useAdaptiveExam, type AdaptiveSync } from '../features/adaptive-math/useAdaptiveExam';
import { formatPracticeTime } from '../features/math-command/inequalitySession';
import { useStudentPortalAccess } from '../hooks/useStudentPortalAccess';
import { signOutCurrentAccount } from '../lib/accountSwitching';
import { navigateTo } from '../lib/navigation';
import { appendStudentPreview, type StudentPreviewContext } from '../lib/studentPreview';
import { ExamSessionPage, type ExamGameSession } from './ExamSessionPage';
import { adaptiveQuestion, adaptiveQuestionFor, adaptiveSummary, advanceAdaptive, continueAdaptive, createAdaptiveState, finishAdaptive, selectAdaptiveAnswer, setAdaptiveMode, submitAdaptiveAnswer, type AdaptiveMode, type AdaptiveState, type AdaptiveTopicSummary, type TopicStatus } from '../../../server/src/shared/adaptiveMath/engine';
import { adaptiveCategories } from '../../../server/src/shared/adaptiveMath/topics';
import type { ExamQuestion } from '../../../server/src/shared/examTypes';
import { mathCorrectAnswer } from '../../../server/src/shared/mathCommandAnalytics';
import '../features/math-command/math-player.css';
import '../features/adaptive-math/adaptive-math.css';

const assessmentsHref = '/study-hall/shsat/assessments';
const statusLabels: Record<TopicStatus, string> = { mastered: 'Mastered', learning: 'Building', weak: 'Needs practice', new: 'Not tested yet' };
const syncLabels: Record<AdaptiveSync, string> = { device: 'Preview: progress stays on this device', loading: 'Loading your saved exam…', saving: 'Saving to your account…', saved: 'Saved to your account', offline: 'Saved on this device. Account sync will retry.', unavailable: 'Saved progress could not be loaded.' };
const newSeed = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12);

function ModePicker({ mode, onChange, name }: { mode: AdaptiveMode; onChange: (mode: AdaptiveMode) => void; name: string }) {
  const options: { id: AdaptiveMode; title: string; text: string }[] = [
    { id: 'exam', title: 'Exam mode', text: 'No feedback while you work, like the real SHSAT. See how you did when you finish.' },
    { id: 'practice', title: 'Practice mode', text: 'After each answer, find out if you were right and see how to solve it before moving on.' },
  ];
  return <fieldset className="am-modes"><legend>How do you want to work?</legend>{options.map(option => <label key={option.id} className={mode === option.id ? 'is-selected' : ''}>
    <input type="radio" name={name} value={option.id} checked={mode === option.id} onChange={() => onChange(option.id)} /><span><strong>{option.title}</strong>{option.text}</span></label>)}</fieldset>;
}

/** Practice-mode feedback shown under a checked question. */
function Feedback({ question, correct, skipped }: { question: ExamQuestion; correct: boolean; skipped: boolean }) {
  const Icon = correct ? CircleCheck : CircleX;
  return <section className={`mc-player-answer mc-practice-feedback ${correct ? 'is-correct' : 'is-incorrect'}`} role="status" aria-label="Answer feedback">
    <h2><Icon size={18} aria-hidden="true" />{correct ? 'Correct' : skipped ? 'Skipped' : 'Incorrect'}{question.correctChoiceId ? ` · Answer ${question.correctChoiceId}` : ''}</h2>
    {!question.correctChoiceId && <div className="am-feedback-answer"><strong>Correct answer</strong><ExamAnswer question={question} answer={question.correctTextAnswers?.[0] ?? mathCorrectAnswer(question) ?? undefined} /></div>}
    <div><ExamText text={question.explanation || ''} /></div>
    <p>Select the Next arrow to continue.</p>
  </section>;
}

function TopicRow({ topic }: { topic: AdaptiveTopicSummary }) {
  const percent = Math.round(topic.mastery * 100);
  return <tr className={`is-${topic.status}`}>
    <th scope="row">{topic.label}</th>
    <td><span className={`am-status is-${topic.status}`}>{topic.status === 'mastered' ? <CircleCheck size={13} aria-hidden="true" /> : topic.status === 'new' ? <CircleDashed size={13} aria-hidden="true" /> : topic.status === 'weak' ? <Target size={13} aria-hidden="true" /> : <TrendingUp size={13} aria-hidden="true" />}{statusLabels[topic.status]}</span></td>
    <td className="am-score">{topic.attempts ? <>{topic.correct} of {topic.attempts}<span className="sr-only"> correct</span></> : '—'}</td>
    <td>{topic.attempts ? <span className="am-meter" role="img" aria-label={`Estimated mastery ${percent}%`}><span style={{ width: `${percent}%` }} /></span> : <span className="am-meter is-empty" aria-hidden="true" />}</td>
  </tr>;
}

function MissedQuestions({ state }: { state: AdaptiveState }) {
  const missed = useMemo(() => state.responses.filter(row => !row.correct).slice(-20).reverse().flatMap(row => {
    try { return [{ row, question: adaptiveQuestionFor(state.seed, row) }]; } catch { return []; }
  }), [state.responses, state.seed]);
  if (!missed.length) return null;
  return <section className="am-panel" aria-labelledby="am-missed-title"><h2 id="am-missed-title">Questions to review</h2><p>Your {missed.length === 1 ? 'most recent missed question' : `${missed.length} most recent missed questions`}, newest first. Open one to see the solution.</p>
    <div className="am-missed">{missed.map(({ row, question }) => <details key={`${row.n}:${question.id}`}>
      <summary><span>Question {row.n + 1}</span>{question.subtopic}{row.skipped ? ' · skipped' : ''}</summary>
      <div className="am-missed-body">
        <div className="am-missed-prompt"><ExamText text={question.prompt} />{question.image && <img src={question.image.src} alt={question.image.alt} width={question.image.width} />}</div>
        <dl><div><dt>Your answer</dt><dd>{row.skipped ? 'Skipped' : <ExamAnswer question={question} answer={row.answer} />}</dd></div>
          <div><dt>Correct answer</dt><dd><ExamAnswer question={question} answer={question.correctTextAnswers?.[0] ?? mathCorrectAnswer(question) ?? undefined} /></dd></div></dl>
        <div className="am-missed-why"><h3>How to solve it</h3><ExamText text={question.explanation || ''} /></div>
      </div>
    </details>)}</div></section>;
}

function Overview({ state, sync, storageError, mode, onMode, onStart, onRestart, onRetry, previewContext }: { state: AdaptiveState | null; sync: AdaptiveSync; storageError: string; mode: AdaptiveMode; onMode: (mode: AdaptiveMode) => void; onStart: () => void; onRestart: () => void; onRetry: () => void; previewContext: StudentPreviewContext }) {
  const [confirmRestart, setConfirmRestart] = useState(false);
  const summary = state ? adaptiveSummary(state) : null, started = Boolean(state && (state.asked > 0 || state.totalMs > 0));
  const focus = summary ? summary.topics.filter(topic => topic.status === 'weak').sort((a, b) => a.mastery - b.mastery) : [];
  return <div className="student-section-page am-page">
    <AppLink className="am-back" href={appendStudentPreview(assessmentsHref, previewContext)}>← Back to Assessments</AppLink>
    <header className="student-section-heading"><div><p>Math · No calculator</p><h1>Adaptive Math Exam</h1>
      <span>An SHSAT-style math exam that changes with every answer. It moves on from topics you know and keeps working on the ones you miss.</span></div>
      {summary && started && <strong>{summary.mastered} of {summary.total} topics mastered</strong>}</header>
    {storageError && <p className="am-alert" role="alert">{storageError}</p>}
    {sync === 'loading' ? <p className="am-note" role="status">Loading your saved exam…</p>
      : sync === 'unavailable' ? <div className="am-alert" role="alert"><p>Your saved exam could not be loaded, so a new one cannot be started yet. Check your connection and try again.</p><button type="button" onClick={onRetry}>Try again</button></div>
        : <>
          {summary?.complete && <p className="am-banner"><CircleCheck size={18} aria-hidden="true" />You have mastered every topic on this exam. Keep going to stay sharp with spot checks.</p>}
          <section className="am-panel am-start" aria-label={started ? 'Continue your exam' : 'Start the exam'}>
            {!started && <ul className="am-how"><li><strong>Every topic gets a turn.</strong>The exam samples each area of SHSAT math, with multiple-choice and type-in questions.</li><li><strong>It adapts as you answer.</strong>Get a topic right and the questions get harder, then the exam moves on. Miss one and it comes back with more.</li><li><strong>There is no time limit.</strong>Stop whenever you like. Your progress is saved, and you can pick up where you left off.</li></ul>}
            {started && summary && <dl className="am-stats"><div><dt>Questions answered</dt><dd>{summary.asked}</dd></div><div><dt>Correct</dt><dd>{summary.asked ? `${Math.round(100 * summary.correct / summary.asked)}%` : '—'}<small>{summary.correct} of {summary.asked}</small></dd></div><div><dt>Topics mastered</dt><dd>{summary.mastered}<small>of {summary.total}</small></dd></div><div><dt>Time spent</dt><dd>{formatPracticeTime(state!.totalMs)}</dd></div></dl>}
            <ModePicker mode={mode} onChange={onMode} name="adaptive-mode" />
            <div className="am-actions"><button className="am-primary" type="button" onClick={onStart}>{started ? summary?.complete ? 'Keep practicing' : 'Continue exam' : 'Start exam'}<ArrowRight size={16} aria-hidden="true" /></button>
              {started && !confirmRestart && <button type="button" onClick={() => setConfirmRestart(true)}><RotateCcw size={14} aria-hidden="true" />Start over</button>}</div>
            {confirmRestart && <div className="am-confirm" role="alertdialog" aria-labelledby="am-restart-title"><p id="am-restart-title"><strong>Start a new exam?</strong> This clears your topic progress and missed-question review for this exam. It cannot be undone.</p><button type="button" onClick={() => { setConfirmRestart(false); onRestart(); }}>Yes, start over</button><button type="button" autoFocus onClick={() => setConfirmRestart(false)}>Keep my progress</button></div>}
            <p className="am-note" role="status">{state ? syncLabels[sync] : 'You can switch between exam mode and practice mode at any time.'}</p>
          </section>
          {started && summary && <>
            {focus.length > 0 && <section className="am-panel" aria-labelledby="am-focus-title"><h2 id="am-focus-title">Focus on these next</h2><p>The exam will keep returning to these topics until you answer them correctly several times in a row.</p><ul className="am-focus">{focus.map(topic => <li key={topic.id}><Target size={14} aria-hidden="true" />{topic.label}<small>{topic.correct} of {topic.attempts} correct</small></li>)}</ul></section>}
            <section className="am-panel" aria-labelledby="am-topics-title"><h2 id="am-topics-title">Topic report</h2><p>Mastered means you answered correctly on harder questions more than once. Topics marked Building need another correct answer or two.</p>
              {adaptiveCategories.map(category => <table className="am-topics" key={category}><caption>{category}</caption><thead><tr><th scope="col">Topic</th><th scope="col">Status</th><th scope="col">Correct</th><th scope="col">Estimated mastery</th></tr></thead><tbody>{summary.topics.filter(topic => topic.category === category).map(topic => <TopicRow key={topic.id} topic={topic} />)}</tbody></table>)}
            </section>
            <MissedQuestions state={state!} />
          </>}
        </>}
  </div>;
}

function AdaptiveExam({ owner, account, previewContext, studentName }: { owner: string; account: boolean; previewContext: StudentPreviewContext; studentName: string }) {
  const { state, update, sync, storageError, flush, retry, setClock } = useAdaptiveExam(owner, account);
  const [playing, setPlaying] = useState(false);
  const [preferredMode, setPreferredMode] = useState<AdaptiveMode>('exam');
  const mode = state?.mode ?? preferredMode;
  const inExam = playing && Boolean(state) && !state!.finished;
  useEffect(() => { if (!inExam) return; const before = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = before; }; }, [inExam]);
  const changeMode = (next: AdaptiveMode) => { setPreferredMode(next); update(value => value ? setAdaptiveMode(value, next) : value); };
  const start = () => { update(value => value ? continueAdaptive(setAdaptiveMode(value, mode), Date.now()) : createAdaptiveState(newSeed(), Date.now(), mode)); setPlaying(true); setClock(true); };
  const restart = () => { update(() => createAdaptiveState(newSeed(), Date.now(), mode)); setPlaying(true); setClock(true); };
  const finish = () => { update(value => value ? finishAdaptive(value, Date.now()) : value); setPlaying(false); void flush(); window.scrollTo(0, 0); };
  const saveAndExit = async () => { setClock(false); await flush(); navigateTo(appendStudentPreview(assessmentsHref, previewContext)); };

  if (!inExam || !state) return <StudentPortalShell activeId="assessments" studentName={studentName} previewContext={previewContext} onSignOut={() => { void signOutCurrentAccount().then(() => window.location.assign('/login')); }}>
    <Overview state={state} sync={sync} storageError={storageError} mode={mode} onMode={changeMode} onStart={start} onRestart={restart} onRetry={retry} previewContext={previewContext} />
  </StudentPortalShell>;

  const question = adaptiveQuestion(state)!, summary = adaptiveSummary(state), skippedAnswer = state.submitted && !state.answer;
  const result = state.submitted && state.lastCorrect !== null ? state.lastCorrect ? 'correct' as const : 'incorrect' as const : undefined;
  const title = 'Adaptive Math Exam';
  const exam: ExamGameSession = {
    assessment: { id: 'adaptive-math-exam', title, classId: 'shsat', createdAt: '', updatedAt: '', description: '', durationMinutes: 0, allowCompletedAccess: false, passages: [], questions: [], sectionAccess: { english: false, math: true }, split: false, status: 'open' },
    content: { assessmentId: 'adaptive-math-exam', title, passageSets: [], mathSection: { id: 'adaptive-math', label: 'Math', questionCount: 1, questions: [question], directions: { subject: 'Mathematics', title: '', body: '', notes: [] } } },
    screen: 'mathQuestion', studentName: '', timerText: '', subjectPosition: { current: state.asked + (state.submitted ? 0 : 1), total: 0 },
    // A skipped question shows a dash so the Next arrow is not blocked by the "unanswered" reminder.
    answers: skippedAnswer ? { [question.id]: '—' } : state.answer ? { [question.id]: state.answer } : {}, lockedQuestionIds: state.submitted ? [question.id] : [],
    onAnswersChange: answers => { const answer = answers[question.id] ?? ''; update(value => value ? selectAdaptiveAnswer(value, answer) : value); },
    onSubmit: async () => { update(value => value ? value.submitted ? advanceAdaptive(value) : submitAdaptiveAnswer(value, Date.now()) : value); return true; },
    practice: {
      onExit: () => { void saveAndExit(); }, exitLabel: 'Save and exit', result,
      stats: <div className="mc-practice-stats am-exam-stats"><span role="status">Topics mastered <strong>{summary.mastered}/{summary.total}</strong></span>
        <label className="am-switch"><input type="checkbox" role="switch" checked={state.mode === 'practice'} onChange={event => changeMode(event.target.checked ? 'practice' : 'exam')} /><span aria-hidden="true" />Practice mode</label></div>,
      feedback: result === undefined ? null : <Feedback question={question} correct={result === 'correct'} skipped={skippedAnswer} />,
      controls: <section className="mc-session-options am-exam-controls" aria-label="Exam options">
        <p>{state.mode === 'practice' ? 'Practice mode: you will see the answer after each question.' : 'Exam mode: answers are shown in your report when you finish.'}</p>
        {!state.submitted && <button type="button" onClick={() => update(value => value ? submitAdaptiveAnswer(value, Date.now(), true) : value)}>I don’t know — skip</button>}
        <button className="mc-session-finish" type="button" onClick={finish}>Finish and see report</button>
        <p role="status">{syncLabels[sync]}</p>
        {storageError && <p role="alert">{storageError}</p>}
      </section>,
    },
  };
  return <section className="mc-exam-viewer mc-infinite-page am-exam" role="dialog" aria-modal="true" aria-label="Adaptive math exam"><ExamSessionPage key={state.seed} gameSession={exam} /></section>;
}

export function AdaptiveMathExamPage() {
  const { isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const { profile, error } = useAccountProfile();
  if (isCheckingSession) return <main className="loading-shell">Loading the adaptive exam…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Sign in to open the adaptive exam.</main>;
  // A teacher previewing the student portal gets a device-only copy that never touches a student's record.
  const owner = previewContext.isPreview ? `preview:${previewContext.mode}:${previewContext.studentId || 'teacher'}` : profile?.id;
  if (!owner) return <main className="loading-shell" role={error ? 'alert' : 'status'}>{error || 'Loading the adaptive exam…'}</main>;
  return <AdaptiveExam key={owner} owner={owner} account={!previewContext.isPreview} previewContext={previewContext} studentName={studentName} />;
}
