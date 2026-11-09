import { LibraryBookSession } from '../components/LibraryBookSession';
import { getLibraryBookContent } from '../lib/api';
import '../styles/library-book-settings.css';
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  KeyRound,
  MessageSquare,
  RotateCcw,
  Send,
  Timer,
  Trophy,
} from "lucide-react";
import { getAdvancedPracticePassage } from "../content/advancedPractice";
import { getExamLibraryPassage } from "../content/exams/passageLibrary";
import { getBankPassage, getBankSet } from "../content/questionBank";
import type { ExamPassageSet } from "../content/exams/types";
import {
  getStudentLibraryBookAccess,
  getStudentLibraryAttempts,
  type StudentLibraryCorrectionView,
  type StudentLibraryAttempt,
} from "../lib/api";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { appendStudentPreview } from "../lib/studentPreview";
import { ExamAnswer } from "../components/ExamReviewQuestion";
import { libraryAnswer } from "../../../server/src/shared/libraryBooks";
import { libraryCorrectionsHref } from "../lib/correctionNavigation";
import { navigateTo } from "../lib/navigation";
import { correctionQuestionTypes } from "../../../server/src/shared/correctionTypes";

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

function renderFormattedText(text: string): ReactNode {
  return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
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

export type CorrectionDraft = Record<string, {
  whyChosenIncorrect: string;
  whyCorrectAnswerCorrect: string;
    questionType?: string;
}>;

export function LibraryCorrectionsWorkspace({
  collectionLabel,
  correctionDraft,
  correctionError,
  isLoading,
  isSubmitting,
  onBack,
  onDraftChange,
  onRetry,
  onSubmit,
  passageSet,
  studentName,
  view,
  readOnly = false,
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
  studentName: string;
  view: StudentLibraryCorrectionView | null;
  readOnly?: boolean;
}) {
  const [active, setActive] = useState(0);
  if (isLoading) {
    return <main className="library-corrections-page"><div className="library-corrections-loading" role="status">Loading your first attempt…</div></main>;
  }

  if (!view) {
    return (
      <main className="library-corrections-page">
        <header className="library-corrections-topbar"><button onClick={onBack} type="button"><ArrowLeft size={16} /> Back</button><span>{studentName}</span></header>
        <section className="library-corrections-error" role="alert"><MessageSquare size={24} /><h1>Corrections could not be opened</h1><p>{correctionError}</p><button onClick={onRetry} type="button">Try again</button></section>
      </main>
    );
  }

  const isSubmitted = Boolean(view.correction);
  const locked = isSubmitted || readOnly;
  const responsesByQuestion = new Map(view.correction?.responses.map((response) => [response.questionId, response]) ?? []);

  return (
    <main className="library-corrections-page">
      <header className="library-corrections-topbar"><button onClick={onBack} type="button"><ArrowLeft size={16} /> Back to passage</button><span>{studentName}</span></header>
      <section className="library-corrections-hero">
        <span><MessageSquare size={25} /></span>
        <p>{collectionLabel} · {passageSet.passage.title}</p>
        <h1>Corrections</h1>
        <small>Your first-attempt answers are locked. Explain both parts for every question you missed.</small>
        {readOnly && <p>Student preview · read only</p>}
      </section>
      <div className="library-corrections-layout">
        <aside>
          <StudentAttemptSummary attempt={view.attempt} featured />
          <div className={`library-correction-status${isSubmitted ? " is-submitted" : ""}`}>
            {isSubmitted ? <CheckCircle2 size={19} /> : <MessageSquare size={19} />}
            <span><strong>{isSubmitted ? "Submitted to your teacher" : "Ready to complete"}</strong><small>{isSubmitted && view.correction ? `Submitted ${formatAttemptDate(view.correction.submittedAt)}` : "Complete every explanation, then submit once."}</small></span>
          </div>
        </aside>
        <form className="library-correction-form" onSubmit={onSubmit}>
          <nav className="library-correction-pagination" aria-label="Correction question navigation"><button type="button" disabled={active === 0} onClick={() => setActive(value => value - 1)}>← Previous</button><label>Question<select aria-label="Correction question" value={active} onChange={event => setActive(Number(event.target.value))}>{passageSet.questions.map((question, index) => <option key={question.id} value={index}>{index + 1}</option>)}</select> of {passageSet.questions.length}</label><button type="button" disabled={active >= passageSet.questions.length - 1} onClick={() => setActive(value => value + 1)}>Next →</button></nav>
          {passageSet.questions.map((question, index) => ({ question, index })).filter(entry => entry.index === active).map(({ question, index }) => {
            const result =
              view.attempt.questions.find((item) => item.questionId === question.id) ??
              view.attempt.questions.find((item) => item.questionNumber === index + 1);
            if (!result) return null;
            const responseQuestionId = result.questionId;
            const savedResponse = responsesByQuestion.get(responseQuestionId);
            const draft = correctionDraft[responseQuestionId] ?? { whyChosenIncorrect: "", whyCorrectAnswerCorrect: "" };
            return (
              <article className={`library-correction-question${result.isCorrect ? " is-correct" : " is-missed"}`} key={question.id}>
                <header><span>Question {index + 1}</span><strong>{result.isCorrect ? "Correct on first attempt" : "Correction required"}</strong></header>
                <h2>{renderFormattedText(question.prompt)}</h2>
                <div className="library-correction-choices" aria-label={`Locked answers for question ${index + 1}`}>
                  {question.choices?.map((choice) => {
                    const isSelected = choice.id === result.selectedAnswerId;
                    const isCorrectAnswer = choice.id === result.correctAnswerId;
                    return <div className={`${isSelected ? " is-selected" : ""}${isCorrectAnswer ? " is-answer" : ""}`} key={choice.id}><b>{choice.id}</b><span>{renderFormattedText(choice.text)}</span>{isSelected ? <small>Your first answer</small> : null}{isCorrectAnswer ? <small>Correct answer</small> : null}</div>;
                  })}
                </div>
                {(!["multiple_choice", "transition_drop"].includes(question.type) || question.type === 'transition_drop' && Boolean(question.dragDropSlots?.length)) && <div><p>Your first answer</p><ExamAnswer question={question} answer={libraryAnswer(result.selectedAnswerId)} /><p>Correct answer</p><ExamAnswer question={question} answer={libraryAnswer(result.correctAnswerId)} /></div>}
                {result.isCorrect ? (
                  <div className="library-correction-congrats"><CheckCircle2 size={20} /><span><strong>Congratulations, you got it correct.</strong><small>No written correction is needed for this question.</small></span></div>
                ) : (
                  <div className="library-correction-explanations">
                    <label><span>Question type</span>{locked ? <strong>{savedResponse?.questionType || draft.questionType || "Not recorded for this question"}</strong> : <select required value={draft.questionType || ""} onChange={event => onDraftChange(responseQuestionId, "questionType", event.target.value)}><option value="">Choose a question type</option>{correctionQuestionTypes(passageSet.questions, "english", passageSet.section ?? "reading").map(type => <option key={type} value={type}>{type}</option>)}</select>}</label>
                    <label>
                      <span>Why is the answer I chose incorrect?</span>
                      <textarea
                        maxLength={4000}
                        onChange={(event) => onDraftChange(responseQuestionId, "whyChosenIncorrect", event.target.value)}
                        placeholder="Explain the mistake in your first answer…"
                        readOnly={locked}
                        required
                        rows={4}
                        value={savedResponse?.whyChosenIncorrect ?? draft.whyChosenIncorrect}
                      />
                    </label>
                    <label>
                      <span>Why is the correct answer correct?</span>
                      <textarea
                        maxLength={4000}
                        onChange={(event) => onDraftChange(responseQuestionId, "whyCorrectAnswerCorrect", event.target.value)}
                        placeholder="Use evidence or reasoning to explain the correct answer…"
                        readOnly={locked}
                        required
                        rows={4}
                        value={savedResponse?.whyCorrectAnswerCorrect ?? draft.whyCorrectAnswerCorrect}
                      />
                    </label>
                  </div>
                )}
              </article>
            );
          })}
          {correctionError ? <p className="library-correction-submit-error" role="alert">{correctionError}</p> : null}
          {!locked ? <div className="library-correction-submit"><p>Complete every missed question, then submit all corrections. Corrections cannot be edited after submission.</p><button disabled={isSubmitting} type="submit"><Send size={16} /> {isSubmitting ? "Submitting…" : "Submit all corrections"}</button></div> : null}
        </form>
      </div>
    </main>
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
