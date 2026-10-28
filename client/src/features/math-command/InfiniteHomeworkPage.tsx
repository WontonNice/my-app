import { useEffect, useRef, useState } from 'react';
import type { HomeworkView } from '../../../../server/src/shared/infiniteHomework';
import type { SelectedAnswer } from '../../lib/examResults';
import { requestApi, createAuthHeaders } from '../../lib/api';
import { useStudentPortalAccess } from '../../hooks/useStudentPortalAccess';
import { ExamSessionPage, type ExamGameSession } from '../../pages/ExamSessionPage';
import { PracticeFeedback } from './PracticeFeedback';
import { AppLink } from '../../components/AppLink';
import './math-player.css';

export function InfiniteHomeworkPage() {
  const { accessToken, previewContext } = useStudentPortalAccess();
  const id = window.location.pathname.split('/').filter(Boolean).at(-1)!;
  const [view, setView] = useState<HomeworkView | null>(null);
  const [answer, setAnswer] = useState<SelectedAnswer>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const busy = useRef(false);
  useEffect(() => {
    if (!accessToken || previewContext.isPreview) return;
    let active = true;
    requestApi<HomeworkView>(`/api/infinite-homework/${encodeURIComponent(id)}`, { headers: createAuthHeaders(accessToken) })
      .then(data => { if (active) { setView(data); setAnswer(''); setShowFeedback(false); setError(''); } })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Could not load homework.'); });
    return () => { active = false; };
  }, [accessToken, id, reload, previewContext.isPreview]);
  const exit = () => window.location.assign('/study-hall/shsat/assignments');
  if (previewContext.isPreview) return <main className="mc-practice-hub"><h1>Infinite homework</h1><p>Open this assignment from the student's account to complete its streak.</p><AppLink href="/teacher/students">Back to students</AppLink></main>;
  if (!view) return <main className="mc-practice-hub"><h1>Infinite homework</h1><p role={error ? 'alert' : 'status'}>{error || 'Loading your saved streak…'}</p>{error && <button onClick={() => setReload(value => value + 1)}>Retry</button>}<button onClick={exit}>Back to assignments</button></main>;
  if (view.assignment.status === 'completed') return <main className="mc-practice-hub mc-practice-summary"><h1>Homework complete</h1><h2>{view.assignment.title}</h2><p>You reached the required streak of {view.assignment.streakTarget} correct answers. Your teacher can see that this assignment is complete.</p><p>{view.correct} correct out of {view.answered} checked · Best streak: {view.bestStreak}</p><button onClick={exit}>Back to assignments</button></main>;
  const feedback = showFeedback ? view.feedback : null;
  const question = feedback?.question ?? view.question!;
  const displayedAnswer = feedback?.answer ?? answer;
  const exam: ExamGameSession = {
    assessment: { id, title: view.assignment.title, classId: 'shsat', createdAt: '', updatedAt: '', description: '', durationMinutes: 0, allowCompletedAccess: false, passages: [], questions: [], sectionAccess: { english: false, math: true }, split: false, status: 'open' },
    content: { assessmentId: id, title: view.assignment.title, passageSets: [], mathSection: { id: 'homework', label: 'Math', questionCount: 1, questions: [question], directions: { subject: 'Mathematics', title: '', body: '', notes: [] } } },
    screen: 'mathQuestion', studentName: '', timerText: '', subjectPosition: { current: view.answered + (feedback ? 0 : 1), total: 0 },
    answers: { [question.id]: displayedAnswer }, lockedQuestionIds: feedback ? [question.id] : [],
    onAnswersChange: answers => { if (!busy.current && !feedback) setAnswer(answers[question.id] ?? ''); },
    onSubmit: async () => {
      if (busy.current) return false;
      if (feedback) { setShowFeedback(false); setAnswer(''); return true; }
      busy.current = true; setError('');
      try {
        const data = await requestApi<HomeworkView>(`/api/infinite-homework/${encodeURIComponent(id)}/answers`, { method: 'POST', headers: createAuthHeaders(accessToken), body: JSON.stringify({ revision: view.revision, questionId: question.id, answer }) });
        setView(data); setShowFeedback(true); return true;
      } catch (reason) { setError(reason instanceof Error ? reason.message : 'Answer was not saved. Try again.'); return false; }
      finally { busy.current = false; }
    },
    practice: { onExit: exit, exitLabel: 'Save & exit', result: feedback ? feedback.correct ? 'correct' : 'incorrect' : undefined,
      stats: <div className="mc-homework-streak"><strong>Streak {view.streak} / {view.assignment.streakTarget}</strong><span>Best: {view.bestStreak} · Progress saved</span></div>,
      feedback: <>{error && <p role="alert">{error} <button type="button" onClick={() => setReload(value => value + 1)}>Reload saved progress</button></p>}{feedback && <PracticeFeedback question={feedback.question} correct={feedback.correct} />}</>,
    },
  };
  return <div className="mc-infinite-page"><ExamSessionPage key={id} gameSession={exam} /></div>;
}
