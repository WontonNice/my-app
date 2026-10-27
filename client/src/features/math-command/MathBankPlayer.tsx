import { TeacherTags } from "./TeacherLabels";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExamMathQuestion } from '../../components/ExamMathQuestion';
import { ExamAnswer, ExamText } from '../../components/ExamReviewQuestion';
import { mathCorrectAnswer } from '../../../../server/src/shared/mathCommandAnalytics';
import type { SelectedAnswers } from '../../lib/examResults';
import type { MathCommandRequest, MathQuestionDetail } from './client';
import './math-player.css';

export function MathBankPlayer({ ids, initialId, request, onClose }: { ids: string[]; initialId?: string; request: MathCommandRequest; onClose: () => void }) {
  const [index, setIndex] = useState(Math.max(0, ids.indexOf(initialId || '')));
  const [detail, setDetail] = useState<MathQuestionDetail>();
  const [answers, setAnswers] = useState<SelectedAnswers>({});
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [jump, setJump] = useState('');
  const id = ids[index];
  const current = detail?.record.id === id ? detail : undefined;
  useEffect(() => {
    let active = true;
    request<MathQuestionDetail>(`/catalog/${encodeURIComponent(id)}`).then(value => { if (active) { setDetail(value); setError(''); } }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Could not open this question.'); });
    return () => { active = false; };
  }, [request, id, retry]);
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; };
  }, []);
  function go(next: number) { setIndex(Math.max(0, Math.min(ids.length - 1, next))); setRevealed(false); setError(''); }
  const start = Math.floor(index / 20) * 20;
  return createPortal(<section className="mc-exam-viewer exam-session-shell is-math-session" role="dialog" aria-modal="true" aria-label="Question bank exam player" onKeyDown={event => {
    if (event.key === 'Escape') onClose();
    if (event.altKey && event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
    if (event.altKey && event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
  }}>
    <header className="mc-player-toolbar"><button autoFocus onClick={onClose}>← Back to question bank</button><strong>Math · {index + 1} of {ids.length}</strong><TeacherTags key={id} ids={[id]}/><button disabled={index === 0} onClick={() => go(index - 1)}>← Previous</button><button disabled={index === ids.length - 1} onClick={() => go(index + 1)}>Next →</button></header>
    <nav className="mc-player-nav" aria-label="Filtered bank questions"><button disabled={start === 0} onClick={() => go(start - 20)}>Previous 20</button>{ids.slice(start, start + 20).map((key, at) => <button key={key} aria-current={index === start + at ? 'step' : undefined} title={key} onClick={() => go(start + at)}>{start + at + 1}</button>)}<button disabled={start + 20 >= ids.length} onClick={() => go(start + 20)}>Next 20</button><form onSubmit={event => { event.preventDefault(); const value = Number(jump); if (Number.isInteger(value) && value >= 1 && value <= ids.length) go(value - 1); }}><label>Go to <input aria-label="Go to question number" type="number" min={1} max={ids.length} value={jump} onChange={event => setJump(event.target.value)} /></label><button>Go</button></form></nav>
    <p className="mc-player-source">{current?.record.sources.map(source => `${source.title} · Math question ${source.number}`).join(' / ')} · {id} · Preview answers stay in this viewer. Alt + ← / → to navigate.</p>
    {error ? <p role="alert" className="mc-player-feedback">{error} <button onClick={() => setRetry(value => value + 1)}>Retry</button></p> : current ? <><ExamMathQuestion key={id} question={current.record.question} answer={answers[id]} onChange={value => setAnswers(previous => ({ ...previous, [id]: value }))}/><div className="mc-player-answer"><button onClick={() => setRevealed(value => !value)}>{revealed ? 'Hide answer' : 'Show answer & explanation'}</button>{revealed && <div><ExamAnswer question={current.record.question} answer={mathCorrectAnswer(current.record.question) ?? undefined}/><ExamText text={current.record.question.explanation || 'No explanation saved.'}/></div>}</div></> : <p role="status" className="mc-player-feedback">Loading question…</p>}
  </section>, document.body);
}
