import { useEffect, useState } from 'react';
import { getLibraryProgress } from '../lib/api';
import { getEnglishLibraryMaterial } from '../lib/studentMaterials';
import '../styles/library-book-settings.css';

export function LibraryProgress({ accessToken, studentId, teacher = false, preview = false }: { accessToken: string; studentId?: string; teacher?: boolean; preview?: boolean }) {
  const [attempts, setAttempts] = useState<Awaited<ReturnType<typeof getLibraryProgress>>['attempts']>([]);
  const [status, setStatus] = useState('Loading library scores…');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset request status when the account or requested student changes.
    if (!accessToken || preview && !studentId) { setStatus('Select a student to see library scores.'); return; }
    let current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Expose pending state while the new external request is in flight.
    setStatus('Loading library scores…');
    getLibraryProgress(accessToken, studentId).then(result => { if (current) { setAttempts(result.attempts); setStatus(''); } }).catch(reason => { if (current) setStatus(reason instanceof Error ? reason.message : 'Library scores could not be loaded.'); });
    return () => { current = false; };
  }, [accessToken, studentId, preview, retry]);
  return <section className="library-progress" aria-labelledby="library-progress-title"><h2 id="library-progress-title">Library practice</h2><p>Book attempts are separate from assessment passage scores and are not included in your assessment average.</p>{status ? <p role="status">{status} {!status.startsWith('Loading') && !status.startsWith('Select') && <button type="button" onClick={() => setRetry(value => value + 1)}>Retry</button>}</p> : !attempts.length ? <p>No completed library attempts yet.</p> : <div className="library-progress-scroll"><table><thead><tr><th>Book</th><th>Attempt</th><th>Score</th><th>Completed</th></tr></thead><tbody>{attempts.map(attempt => <tr key={attempt.id}><td><a href={teacher ? `/teacher/library/${encodeURIComponent(attempt.bookId)}` : getEnglishLibraryMaterial(attempt.bookId)?.href ?? `/study-hall/shsat/library/${encodeURIComponent(attempt.bookId)}`}>{attempt.title}</a></td><td>{attempt.attemptNumber}</td><td>{attempt.score}/{attempt.totalQuestions} · {Math.round(100 * attempt.score / Math.max(1, attempt.totalQuestions))}%</td><td>{new Date(attempt.completedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}</section>;
}
