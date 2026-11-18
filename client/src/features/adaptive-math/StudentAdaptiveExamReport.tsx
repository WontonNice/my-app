import { useEffect, useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { adaptiveSummary, type AdaptiveState } from '../../../../server/src/shared/adaptiveMath/engine';
import { loadStudentAdaptiveExam } from './adaptiveExamResults';
import { AdaptiveReport, AdaptiveStats } from './AdaptiveReport';

// A teacher's read-only view of one student's Adaptive Math Exam. There is no Start, Continue or
// Start over here, and nothing is saved to the student's exam (see adaptiveExamResults.ts).

export type StudentAdaptiveExamLoad = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; state: AdaptiveState | null };
const day = (ms: number) => new Date(ms).toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric' });

export function StudentAdaptiveExamReportView({ studentName, load, onReload }: { studentName: string; load: StudentAdaptiveExamLoad; onReload?: () => void }) {
  const state = load.status === 'ready' ? load.state : null, summary = state ? adaptiveSummary(state) : null;
  const answered = Boolean(summary && summary.asked > 0);
  return <section className="am-page am-teacher" aria-labelledby="am-teacher-title">
    <header className="am-teacher-heading">
      <div><h2 id="am-teacher-title">Adaptive Math Exam</h2>
        <p>{state && answered
          ? <>Started {day(state.startedAt)} · Last activity {day(state.updatedAt)} · {state.mode === 'practice' ? 'Practice mode: the student sees each answer and solution before moving on' : 'Exam mode: no feedback until the report'}</>
          : 'A self-paced exam that tracks each SHSAT math topic. Students open it from Assessments; it does not need to be assigned.'}</p></div>
      {onReload && load.status === 'ready' && <button type="button" onClick={onReload}>Refresh</button>}
    </header>
    {load.status === 'loading' && <p className="am-note" role="status">Loading {studentName}’s exam…</p>}
    {load.status === 'error' && <div className="am-alert" role="alert"><p>{load.message}</p>{onReload && <button type="button" onClick={onReload}>Try again</button>}</div>}
    {load.status === 'ready' && !state && <p className="am-teacher-empty">{studentName} has not started the Adaptive Math Exam.</p>}
    {state && !answered && <p className="am-teacher-empty">{studentName} opened the Adaptive Math Exam on {day(state.startedAt)} but has not answered a question yet.</p>}
    {state && summary && answered && <>
      {summary.complete && <p className="am-banner"><CircleCheck size={18} aria-hidden="true" />{studentName} has mastered every topic. The exam now gives only spot checks.</p>}
      <AdaptiveStats state={state} summary={summary} />
      <AdaptiveReport state={state} summary={summary} reader="teacher" />
    </>}
  </section>;
}

export function StudentAdaptiveExamReport({ accessToken, studentId, studentName }: { accessToken: string; studentId: string; studentName: string }) {
  const [load, setLoad] = useState<StudentAdaptiveExamLoad>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    loadStudentAdaptiveExam(accessToken, studentId)
      .then(state => { if (active) setLoad({ status: 'ready', state }); })
      .catch(reason => { if (active) setLoad({ status: 'error', message: reason instanceof Error ? reason.message : 'This exam could not be loaded.' }); });
    return () => { active = false; };
  }, [accessToken, studentId, attempt]);
  if (!accessToken) return <section className="am-page am-teacher"><p className="am-teacher-empty">Sign in to load this exam.</p></section>;
  return <StudentAdaptiveExamReportView studentName={studentName} load={load} onReload={() => { setLoad({ status: 'loading' }); setAttempt(value => value + 1); }} />;
}
