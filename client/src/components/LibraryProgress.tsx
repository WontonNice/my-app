import { useEffect, useState } from 'react';
import { getLibraryProgress } from '../lib/api';
import { advancedPassageMaterials, getEnglishLibraryMaterial } from '../lib/studentMaterials';
import { libraryCorrectionsHref } from '../lib/correctionNavigation';
import { appendStudentPreview } from '../lib/studentPreview';
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
  const firstAttempts = new Map<string, (typeof attempts)[number]>();
  for (const attempt of attempts) {
    const first = firstAttempts.get(attempt.bookId);
    if (!first || attempt.attemptNumber < first.attemptNumber) firstAttempts.set(attempt.bookId, attempt);
  }

  return <section className="library-progress" aria-labelledby="library-progress-title">
    <h2 id="library-progress-title">Library practice</h2>
    <p>Book attempts are separate from assessment passage scores and are not included in your assessment average.</p>
    {!teacher && <p>Open Corrections to review missed answers from your first attempt. You do not need to redo the passage.</p>}
    {status ? <p role="status">{status} {!status.startsWith('Loading') && !status.startsWith('Select') && <button type="button" onClick={() => setRetry(value => value + 1)}>Retry</button>}</p> : !attempts.length ? <p>No completed library attempts yet.</p> : <div className="library-progress-scroll">
      <table><thead><tr><th scope="col">Book</th><th scope="col">Attempt</th><th scope="col">Score</th><th scope="col">Completed</th>{!teacher && <th scope="col">Review</th>}</tr></thead>
        <tbody>{attempts.map(attempt => {
          const material = getEnglishLibraryMaterial(attempt.bookId) ?? advancedPassageMaterials.find(item => item.id === `passage-${attempt.bookId}`);
          const passageHref = material?.href ?? `/study-hall/shsat/library/${encodeURIComponent(attempt.bookId)}`;
          // Keep the submitted ID: older version attempts are stored separately from combined books.
          const correctionPath = `${passageHref.startsWith('/advanced-practice/') ? '/advanced-practice/' : '/study-hall/shsat/library/'}${encodeURIComponent(attempt.bookId)}`;
          const first = firstAttempts.get(attempt.bookId)!;
          return <tr key={attempt.id}>
            <td><a href={teacher ? `/teacher/library/${encodeURIComponent(attempt.bookId)}` : appendStudentPreview(passageHref)}>{attempt.title}</a></td>
            <td>{attempt.attemptNumber}</td>
            <td>{attempt.score}/{attempt.totalQuestions} · {Math.round(100 * attempt.score / Math.max(1, attempt.totalQuestions))}%</td>
            <td>{new Date(attempt.completedAt).toLocaleDateString()}</td>
            {!teacher && <td>{first.score < first.totalQuestions ? <a href={libraryCorrectionsHref(correctionPath)} aria-label={`Corrections for ${attempt.title}, first attempt`}>Corrections</a> : 'No corrections needed'}</td>}
          </tr>;
        })}</tbody>
      </table>
    </div>}
  </section>;
}
