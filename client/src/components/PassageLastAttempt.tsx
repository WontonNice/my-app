import { latestPassageAttempt } from '../lib/bookReview';
import { newerPassageAttempt, type PassageLastTaken } from '../../../server/src/shared/passageLastTaken';

export function PassageLastAttempt({attempts, lastTaken}: {attempts: {completedAt: string}[]; lastTaken?: PassageLastTaken | null}) {
  const libraryDate = latestPassageAttempt(attempts);
  const latest = libraryDate ? newerPassageAttempt(lastTaken ?? null, {completedAt:libraryDate,source:'library'}) : lastTaken;
  return <small className="teacher-passage-last-attempt">{latest && Number.isFinite(Date.parse(latest.completedAt)) ? <>Last taken: <time dateTime={latest.completedAt}>{new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/New_York',timeZoneName:'short'}).format(new Date(latest.completedAt))}</time><span>{latest.source==='exam' ? `Exam${latest.title ? ' · '+latest.title : ''}` : 'Library practice'}</span></> : attempts.length ? 'Last taken: date unavailable' : 'Not taken yet'}</small>;
}
