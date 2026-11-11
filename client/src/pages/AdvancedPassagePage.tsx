import { LibraryBookSession } from '../components/LibraryBookSession';
import { getLibraryBookContent } from '../lib/api';
import '../styles/library-book-settings.css';
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  KeyRound,
  MessageSquare,
  RotateCcw,
  Timer,
  Trophy,
} from "lucide-react";
import { getAdvancedPracticePassage } from "../content/advancedPractice";
import { getExamLibraryPassage } from "../content/exams/passageLibrary";
import { getBankPassage, getBankSet } from "../content/questionBank";
import {
  getStudentLibraryBookAccess,
  getStudentLibraryAttempts,
  type StudentLibraryAttempt,
} from "../lib/api";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { appendStudentPreview } from "../lib/studentPreview";
import { libraryCorrectionsHref } from "../lib/correctionNavigation";
import { navigateTo } from "../lib/navigation";

function getPassageIdFromPath() {
  return window.location.pathname.split("/").filter(Boolean).at(-1) ?? "";
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatAttemptDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function StudentAttemptSummary({ attempt, featured = false }: { attempt: StudentLibraryAttempt; featured?: boolean }) {
  const percentage = attempt.totalQuestions ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0;
  return (
    <article className={`library-attempt-summary${featured ? " is-featured" : ""}`}>
      <header>
        <div><small>Attempt {attempt.attemptNumber}</small><strong>{featured ? "Book complete" : formatAttemptDate(attempt.completedAt)}</strong></div>
        <span>{percentage}%</span>
      </header>
      <div className="library-attempt-totals">
        <span><Trophy size={18} /><small>Total score</small><strong>{attempt.score} / {attempt.totalQuestions}</strong></span>
        <span><Timer size={18} /><small>Total time</small><strong>{formatDuration(attempt.totalTimeSeconds)}</strong></span>
      </div>
      <div className="library-question-time-list" aria-label={`Question times for attempt ${attempt.attemptNumber}`}>
        <strong>Time by question</strong>
        <div>
          {attempt.questions.map((question) => (
            <span key={question.questionId}><small>Question {question.questionNumber}</small><b>{formatDuration(question.timeSpentSeconds)}</b></span>
          ))}
        </div>
      </div>
      <p className="library-student-privacy-note">Question results stay hidden in your score history. If corrections are needed, review them in the separate Corrections workspace.</p>
    </article>
  );
}

export function AdvancedPassagePage() {
  const { accessToken, isCheckingSession, previewContext, studentName } = useStudentPortalAccess();
  const isShsatLibraryPassage = window.location.pathname.includes("/study-hall/shsat/library/");
  const bookId = getPassageIdFromPath();
  const libraryBook = isShsatLibraryPassage ? getExamLibraryPassage(bookId) : undefined;
  const passageEntry = isShsatLibraryPassage
    ? libraryBook
    : getAdvancedPracticePassage(bookId);
  const passageSet = passageEntry?.passageSet;
  const [edition, setEdition] = useState<Awaited<ReturnType<typeof getLibraryBookContent>> | null>(null);
  const [editionError, setEditionError] = useState('');
  const [editionRetry, setEditionRetry] = useState(0);
  const [attempts, setAttempts] = useState<StudentLibraryAttempt[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(previewContext.isPreview);
  const [isUnlocking, setIsUnlocking] = useState(!previewContext.isPreview);
  const [resultAttempt, setResultAttempt] = useState<StudentLibraryAttempt | null>(null);
  const [unlockError, setUnlockError] = useState("");
  useEffect(() => {
    if (!accessToken || previewContext.isPreview || !passageSet) return;
    let isMounted = true;
    Promise.all([
      getStudentLibraryAttempts(accessToken, bookId),
      getStudentLibraryBookAccess(accessToken, bookId),
    ])
      .then(([nextAttempts, bookAccess]) => {
        if (!isMounted) return;
        setAttempts(nextAttempts);
        if (bookAccess.unlocked) {
          setIsUnlocked(true);
        }
      })
      .catch(error => { if (isMounted) setUnlockError(error instanceof Error ? error.message : "Book access could not be checked."); })
      .finally(() => { if (isMounted) setIsUnlocking(false); });
    return () => { isMounted = false; };
  }, [accessToken, bookId, passageSet, previewContext.isPreview]);

  useEffect(() => {
    if (!isShsatLibraryPassage || bookId.startsWith('lab-set-') || !accessToken || !isUnlocked) return;
    let current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Clear stale failure feedback before retrying the external edition request.
    setEditionError('');
    getLibraryBookContent(accessToken, bookId).then(value => { if (current) setEdition(value); }).catch(reason => { if (current) setEditionError(reason instanceof Error ? reason.message : 'Book could not be loaded.'); });
    return () => { current = false; };
  }, [bookId, accessToken, isUnlocked, isShsatLibraryPassage, editionRetry]);

  const questions = passageSet?.questions ?? [];
  const isBankSet = Boolean(getBankSet(bookId));
  const backHref = appendStudentPreview(isShsatLibraryPassage ? "/study-hall/shsat/materials?subject=english" : "/study-hall/shsat/materials?subject=english&section=advanced", previewContext);
  const collectionLabel = isBankSet ? "SHSAT Lab · ELA Practice" : isShsatLibraryPassage ? "SHSAT Library" : "Advanced Practice";
  const firstAttempt = attempts.reduce<StudentLibraryAttempt | null>((first, attempt) => (
    !first || attempt.attemptNumber < first.attemptNumber ? attempt : first
  ), null);
  const canRequestCorrections = Boolean(firstAttempt && firstAttempt.score < firstAttempt.totalQuestions);

  async function handleCheckAccess() {
    if (!accessToken) return;
    setIsUnlocking(true); setUnlockError("");
    try {
      const result = await getStudentLibraryBookAccess(accessToken, bookId);
      if (result.unlocked) {
        setIsUnlocked(true);
      } else setUnlockError("Your teacher hasn't enabled this book for your account yet.");
    } catch (error) { setUnlockError(error instanceof Error ? error.message : "Book access could not be checked."); }
    finally { setIsUnlocking(false); }
  }

  function openCorrections() { navigateTo(libraryCorrectionsHref(window.location.pathname, previewContext)); }

  function startAnotherAttempt() {
    setEdition(null);
    setEditionRetry(value => value + 1);
    setIsComplete(false);
    setResultAttempt(null);
  }

  if (isCheckingSession) {
    return <main className="loading-shell">Loading passage...</main>;
  }

  if (!passageEntry || !passageSet || !questions.length) {
    return (
      <main className="advanced-passage-page">
        <section className="advanced-passage-missing">
          <h1>Passage not found</h1>
          <a href={backHref}>Return to Study Hall</a>
        </section>
      </main>
    );
  }

  if (!isUnlocked) {
    return (
      <main className="library-access-page">
        <a className="library-access-back" href={backHref}><ArrowLeft size={16} /> English library</a>
        <section className="library-access-layout">
          <div className="library-access-card">
            <span className="library-access-icon"><KeyRound size={26} /></span>
            <p>{collectionLabel}</p>
            <h1>{passageSet.passage.title}</h1>
            <span>Your teacher manages access to this book for your account. Once enabled, all versions are included.</span>
            <div className="library-individual-access">
              {unlockError ? <p role="alert">{unlockError}</p> : <p>Ask your teacher to enable this book in their English library dashboard.</p>}
              <button disabled={isUnlocking} onClick={handleCheckAccess} type="button">{isUnlocking ? "Checking access..." : "Check access"}</button>
            </div>
            {libraryBook?.isCombined && <nav className="library-version-history" aria-label="Earlier version history"><h2>Earlier version work</h2>{libraryBook.versions.map(version => <a key={version.id} href={appendStudentPreview(`/study-hall/shsat/library/${version.id}`, previewContext)}>{version.label} · original version</a>)}</nav>}
          </div>
          <aside className="library-access-history">
            <header><BarChart3 size={18} /><div><small>Your history</small><h2>{attempts.length ? `${attempts.length} completed ${attempts.length === 1 ? "attempt" : "attempts"}` : "No attempts yet"}</h2></div></header>
            {attempts.length ? attempts.map((attempt) => (
              <details key={attempt.id}>
                <summary><span>Attempt {attempt.attemptNumber}<small>{formatAttemptDate(attempt.completedAt)}</small></span><strong>{attempt.score} / {attempt.totalQuestions}</strong><em>{formatDuration(attempt.totalTimeSeconds)}</em></summary>
                <StudentAttemptSummary attempt={attempt} />
              </details>
            )) : <p>Finish this book once and your score and timing history will appear here.</p>}
            {canRequestCorrections ? <button className="library-open-corrections" onClick={openCorrections} type="button"><MessageSquare size={16} /> Corrections</button> : null}
          </aside>
        </section>
      </main>
    );
  }

  if (!isComplete) {
    const needsEdition = isShsatLibraryPassage && !isBankSet;
    if (needsEdition && !edition) return <main className="advanced-passage-page"><a href={backHref}>← Library</a>{previewContext.mode === 'teacher' && <a href={`/teacher/library/${encodeURIComponent(bookId)}#book-settings`}>Book settings</a>}<p role={editionError ? 'alert' : 'status'}>{editionError || 'Loading book questions…'}</p>{editionError && <button type="button" onClick={() => setEditionRetry(value => value + 1)}>Retry</button>}</main>;
    const book = needsEdition && edition ? edition.book : {
      id: bookId,
      passageSet,
      versions: [],
      questionPassages: Object.fromEntries(questions.map(question => [question.id, (isBankSet ? getBankPassage(question.id) : undefined) ?? passageSet.passage])),
    };
    return <LibraryBookSession key={`${bookId}:${editionRetry}`} book={book} revision={needsEdition ? edition?.revision : undefined} accessToken={accessToken} studentName={studentName} preview={previewContext.isPreview} teacher={previewContext.mode === 'teacher'} backHref={backHref} onComplete={attempt => { if (attempt) { setResultAttempt(attempt); setAttempts(current => [attempt, ...current]); } setIsComplete(true); }} />;
  }
  if (previewContext.isPreview) return <main className="library-finish-page"><h1>Book preview complete</h1><p>Preview answers do not save student scores.</p><a href={backHref}>Return to library</a>{previewContext.mode === 'teacher' && isShsatLibraryPassage && !isBankSet && <> · <a href={`/teacher/library/${encodeURIComponent(bookId)}#book-settings`}>Book settings</a></>}<p><button type="button" onClick={startAnotherAttempt}>Preview again</button></p></main>;

  if (isComplete) {
    if (!previewContext.isPreview && resultAttempt) {
      return (
        <main className="library-finish-page">
          <header className="library-finish-header">
            <a href={backHref}><ArrowLeft size={16} /> English library</a>
            <span>{studentName}</span>
          </header>
          <section className="library-finish-hero">
            <span><Trophy size={26} /></span>
            <p>{passageSet.passage.title}</p>
            <h1>Attempt {resultAttempt.attemptNumber} complete</h1>
            <small>Your score and time have been saved.</small>
          </section>
          <div className="library-finish-layout">
            <div>
              <StudentAttemptSummary attempt={resultAttempt} featured />
              {isBankSet && <section className="bank-attempt-solutions"><h2>Answers & explanations</h2>{questions.map((q, index) => <details key={q.id}><summary>Question {index + 1} · Correct answer {q.correctChoiceId}</summary><h3>{q.prompt}</h3><p style={{ whiteSpace: "pre-wrap" }}>{getBankPassage(q.id)?.lines.map(line => line.text).join("\n\n")}</p><p style={{ whiteSpace: "pre-wrap" }}>{q.explanation}</p></details>)}</section>}
              <div className="library-finish-actions">
                <button onClick={startAnotherAttempt} type="button"><RotateCcw size={16} /> Attempt again</button>
                {canRequestCorrections ? <button className="is-corrections" onClick={openCorrections} type="button"><MessageSquare size={16} /> Corrections</button> : null}
                <a href={backHref}>Return to library</a>
              </div>
            </div>
            <aside className="library-attempt-history-panel">
              <header><BarChart3 size={18} /><div><small>Progress over time</small><h2>All attempts</h2></div></header>
              {attempts.map((attempt) => (
                <details key={attempt.id} open={attempt.id === resultAttempt.id}>
                  <summary><span>Attempt {attempt.attemptNumber}<small>{formatAttemptDate(attempt.completedAt)}</small></span><strong>{attempt.score} / {attempt.totalQuestions}</strong><em>{formatDuration(attempt.totalTimeSeconds)}</em></summary>
                  {attempt.id === resultAttempt.id ? null : <StudentAttemptSummary attempt={attempt} />}
                </details>
              ))}
            </aside>
          </div>
        </main>
      );
    }
  }
  return null;
}
