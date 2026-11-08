import { appendStudentPreview } from '../lib/studentPreview';
import { useCallback, useRef, useState } from 'react';
import { ExamSessionPage } from '../pages/ExamSessionPage';
import { saveStudentLibraryAttempt, type StudentLibraryAttempt, type TeacherAssessment } from '../lib/api';
import type { SelectedAnswers } from '../lib/examResults';
import type { PassageBook } from '../../../server/src/shared/libraryBooks';
import type { ExamContent } from '../content/exams/types';

/** Library persistence adapter; all questions, passages and tools use the exam player. */
export function LibraryBookSession({ book, revision, accessToken, studentName, preview, teacher, backHref, onComplete }: {
  book: PassageBook; revision: string; accessToken: string; studentName: string; preview: boolean; teacher: boolean; backHref: string; onComplete: (attempt?: StudentLibraryAttempt) => void;
}) {
  const [answers, setAnswers] = useState<SelectedAnswers>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [initialTiming] = useState(() => ({ startedAt: new Date().toISOString(), questionId: '', since: Date.now(), seconds: {} as Record<string, number> }));
  const timing = useRef(initialTiming);
  const recordQuestion = useCallback((id: string | null) => {
    const time = timing.current;
    if (time.questionId) time.seconds[time.questionId] = (time.seconds[time.questionId] ?? 0) + Math.max(0, (Date.now() - time.since) / 1000);
    time.questionId = id ?? ''; time.since = Date.now();
  }, []);
  const assessment: TeacherAssessment = { id: book.id, title: book.passageSet.passage.title, allowCompletedAccess: true, classId: 'shsat', createdAt: '', updatedAt: '', description: '', durationMinutes: 0, passages: [], questions: [], sectionAccess: { english: true, math: false }, split: false, status: 'open' };
  const content: ExamContent = { assessmentId: book.id, title: book.passageSet.passage.title, passageSets: [book.passageSet] };
  async function submit(next: SelectedAnswers) {
    if (busy.current) return false;
    if (preview) { onComplete(); return true; }
    busy.current = true; setSaving(true); setError(''); recordQuestion(null);
    try {
      const attempt = await saveStudentLibraryAttempt(accessToken, book.id, {
        bookRevision: revision, startedAt: timing.current.startedAt,
        totalTimeSeconds: Math.max(1, Math.round((Date.now() - Date.parse(timing.current.startedAt)) / 1000)),
        questions: book.passageSet.questions.map(question => ({ questionId: question.id, correctAnswerId: '', selectedAnswerId: typeof next[question.id] === 'string' ? next[question.id] as string : JSON.stringify(next[question.id] ?? ''), timeSpentSeconds: Math.round(timing.current.seconds[question.id] ?? 0) })),
      });
      onComplete(attempt); return true;
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Your library attempt could not be saved. Try again.'); return false; }
    finally { busy.current = false; setSaving(false); }
  }
  return <>
    <nav className="library-session-links" aria-label="Library book navigation"><a href={backHref}>← Library</a><span>Library practice · Scores saved separately from assessments</span>{book.versions.length > 1 && <details><summary>Earlier version work</summary>{book.versions.map(version => <a key={version.id} href={appendStudentPreview(`/study-hall/shsat/library/${encodeURIComponent(version.id)}`)}>{version.label} · original version</a>)}</details>}{teacher && <a href={`/teacher/library/${encodeURIComponent(book.id)}#book-settings`}>Book settings</a>}</nav>
    {(error || saving) && <div className="library-session-status" role={error ? 'alert' : 'status'}>{saving ? 'Saving library attempt…' : <>{error} <button onClick={() => void submit(answers)} type="button">Retry saving</button></>}</div>}
    <ExamSessionPage librarySession={{ assessment, content, studentName, screen: 'passage', answers, onAnswersChange: setAnswers, onSubmit: submit, timerText: '', hideTimer: true, subjectPosition: { current: 1, total: book.passageSet.questions.length }, passageByQuestion: book.questionPassages, onCurrentQuestionChange: recordQuestion, onExit: () => window.location.assign(backHref) }} />
  </>;
}
