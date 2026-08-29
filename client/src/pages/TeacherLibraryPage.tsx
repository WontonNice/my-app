import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ClipboardList,
  Clock3,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { AppLink } from "../components/AppLink";
import { CorporateDashboardShell, type DashboardNavItem } from "../components/CorporateDashboardShell";
import { getAdvancedPracticePassage } from "../content/advancedPractice";
import { getExamLibraryPassage } from "../content/exams/passageLibrary";
import type { ExamPassageSet } from "../content/exams/types";
import {
  generateTeacherLibraryBookCode,
  getTeacherLibraryBook,
  getTeacherLibraryBooks,
  type LibraryBookAccess,
  type TeacherLibraryAttempt,
  type TeacherLibraryStudent,
} from "../lib/api";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getDashboardPath, getUserRole } from "../lib/auth";
import {
  englishLibraryMaterials,
  getEnglishLibraryMaterial,
  getLibraryBookId,
  type StudentMaterial,
} from "../lib/studentMaterials";
import { getActiveSession, peekActiveSession } from "../lib/sessionCache";
import { isSupabaseConfigured } from "../lib/supabase";

const teacherNavItems: DashboardNavItem[] = [
  { id: "overview", label: "Overview", href: "/teacher", icon: LayoutDashboard },
  { id: "students", label: "Student progress", href: "/teacher/students", icon: Activity },
  { id: "enrollment", label: "Class requests", href: "/teacher/enrollment", icon: UserRoundCheck },
  { id: "accounts", label: "Student accounts", href: "/teacher/accounts", icon: UserRoundPlus },
  { id: "library", label: "English library", href: "/teacher/library", icon: BookOpen },
  { id: "assessments", label: "Assessments & insights", href: "/teacher/assessments", icon: ClipboardList },
];

function getBookIdFromPath() {
  const encoded = window.location.pathname.split("/").filter(Boolean)[2] ?? "";
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
}

function getPassageSet(bookId: string): ExamPassageSet | undefined {
  return getExamLibraryPassage(bookId)?.passageSet ?? getAdvancedPracticePassage(bookId)?.passageSet;
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function percentage(score: number, total: number) {
  return total ? Math.round((score / total) * 100) : 0;
}

function bestScore(student: TeacherLibraryStudent) {
  if (!student.attempts.length) return null;
  return Math.max(...student.attempts.map((attempt) => percentage(attempt.score, attempt.totalQuestions)));
}

function getChoiceText(passageSet: ExamPassageSet, questionId: string, choiceId: string) {
  return passageSet.questions.find((question) => question.id === questionId)?.choices?.find((choice) => choice.id === choiceId)?.text ?? choiceId;
}

export function TeacherLibraryPage() {
  const initialSession = peekActiveSession();
  const initialMetadata = initialSession?.user.user_metadata as { full_name?: string; name?: string } | undefined;
  const bookId = getBookIdFromPath();
  const selectedMaterial = bookId ? getEnglishLibraryMaterial(bookId) : undefined;
  const passageSet = bookId ? getPassageSet(bookId) : undefined;
  const [accessToken, setAccessToken] = useState(initialSession?.access_token ?? "");
  const [bookAccess, setBookAccess] = useState<LibraryBookAccess[]>([]);
  const [detailBook, setDetailBook] = useState<LibraryBookAccess | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured && !initialSession);
  const [isLoadingDetail, setIsLoadingDetail] = useState(Boolean(bookId));
  const [message, setMessage] = useState("");
  const [savingBookId, setSavingBookId] = useState("");
  const [selectedAttemptId, setSelectedAttemptId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [students, setStudents] = useState<TeacherLibraryStudent[]>([]);
  const [teacherName, setTeacherName] = useState(
    initialMetadata?.full_name ?? initialMetadata?.name ?? initialSession?.user.email?.split("@")[0] ?? "Teacher",
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let isMounted = true;
    async function load() {
      const session = await getActiveSession();
      if (!session) {
        window.location.assign("/login");
        return;
      }
      const role = getUserRole(session.user);
      if (role !== "teacher" && role !== "admin") {
        window.location.assign(getDashboardPath(role));
        return;
      }
      const metadata = session.user.user_metadata as { full_name?: string; name?: string };
      if (!isMounted) return;
      setAccessToken(session.access_token);
      setTeacherName(metadata.full_name ?? metadata.name ?? session.user.email?.split("@")[0] ?? "Teacher");
      try {
        if (bookId) {
          const detail = await getTeacherLibraryBook(session.access_token, bookId);
          if (!isMounted) return;
          setDetailBook(detail.book);
          setStudents(detail.students);
          const firstStudent = detail.students.find((student) => student.attempts.length) ?? detail.students[0];
          setSelectedStudentId(firstStudent?.id ?? "");
          setSelectedAttemptId(firstStudent?.attempts[0]?.id ?? "");
        } else {
          const books = await getTeacherLibraryBooks(session.access_token);
          if (isMounted) setBookAccess(books);
        }
      } catch (error) {
        if (isMounted) setMessage(error instanceof Error ? error.message : "The English library could not be loaded.");
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
          setIsLoadingDetail(false);
        }
      }
    }
    load();
    return () => { isMounted = false; };
  }, [bookId]);

  const accessByBookId = useMemo(() => new Map(bookAccess.map((book) => [book.bookId, book])), [bookAccess]);
  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const selectedAttempt = selectedStudent?.attempts.find((attempt) => attempt.id === selectedAttemptId) ?? selectedStudent?.attempts[0];
  async function handleGenerateCode(material: StudentMaterial) {
    if (!accessToken) return;
    const nextBookId = getLibraryBookId(material);
    setSavingBookId(nextBookId);
    setMessage("");
    try {
      const updated = await generateTeacherLibraryBookCode(accessToken, nextBookId, material.title);
      if (bookId === nextBookId) setDetailBook(updated);
      else setBookAccess((current) => [updated, ...current.filter((book) => book.bookId !== updated.bookId)]);
      setMessage(`A new access code is ready for ${material.title}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The access code could not be generated.");
    } finally {
      setSavingBookId("");
    }
  }

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading teacher library...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  return (
    <CorporateDashboardShell
      activeId="library"
      enableAccountSwitcher
      learningRoom
      navItems={teacherNavItems}
      onSignOut={handleSignOut}
      profileName={teacherName}
      profileRole="Teacher account"
    >
      {bookId ? (
        <TeacherLibraryBookDetail
          access={detailBook}
          attempt={selectedAttempt}
          isLoading={isLoadingDetail}
          material={selectedMaterial}
          message={message}
          onGenerateCode={handleGenerateCode}
          onSelectAttempt={setSelectedAttemptId}
          onSelectStudent={(student) => {
            setSelectedStudentId(student.id);
            setSelectedAttemptId(student.attempts[0]?.id ?? "");
          }}
          passageSet={passageSet}
          savingBookId={savingBookId}
          selectedStudent={selectedStudent}
          showAnswers={showAnswers}
          students={students}
          toggleAnswers={() => setShowAnswers((current) => !current)}
        />
      ) : (
        <>
          <header className="teacher-library-heading">
            <div><p><BookOpen size={15} /> English library</p><h1>Books & reading</h1><span>Generate a unique student code for every book, preview the experience, and open attempt-level results.</span></div>
            <div><span><small>Books</small><strong>{englishLibraryMaterials.length}</strong></span><span><small>Codes live</small><strong>{bookAccess.length}</strong></span></div>
          </header>
          {message ? <p className="teacher-message corporate-message">{message}</p> : null}
          <section className="teacher-library-grid" aria-label="English library books">
            {englishLibraryMaterials.map((material) => {
              const nextBookId = getLibraryBookId(material);
              const access = accessByBookId.get(nextBookId);
              return (
                <article key={material.id}>
                  <AppLink className="teacher-library-cover-link" href={`/teacher/library/${encodeURIComponent(nextBookId)}`}>
                    <span aria-label={material.coverAlt || `${material.title} cover`} className={`study-hall-book-cover is-${material.tone ?? "emerald"}`} role="img">
                      {material.coverImage ? <img alt="" aria-hidden="true" src={material.coverImage} /> : null}
                      <span className="study-hall-generated-cover"><small>The Learning Room</small><strong>{material.title}</strong><em>{material.author || "Teacher selection"}</em></span>
                      <span className="study-hall-cover-shadow" />
                    </span>
                  </AppLink>
                  <div className="teacher-library-card-body">
                    <span><small>{material.libraryCollection}</small><small>{material.readingFormat}</small></span>
                    <AppLink href={`/teacher/library/${encodeURIComponent(nextBookId)}`}><strong>{material.title}</strong><ArrowRight size={15} /></AppLink>
                    <p>{material.questionCount} questions</p>
                    <div className={access ? "is-code-ready" : ""}>
                      <span><KeyRound size={15} /><small>{access ? "Student code" : "No code generated"}</small><strong>{access?.accessCode ?? "—— ——"}</strong></span>
                      <button disabled={savingBookId === nextBookId} onClick={() => handleGenerateCode(material)} type="button">
                        <RefreshCw size={14} /> {access ? "Regenerate" : "Generate code"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </CorporateDashboardShell>
  );
}

type TeacherLibraryBookDetailProps = {
  access: LibraryBookAccess | null;
  attempt?: TeacherLibraryAttempt;
  isLoading: boolean;
  material?: StudentMaterial;
  message: string;
  onGenerateCode: (material: StudentMaterial) => void;
  onSelectAttempt: (attemptId: string) => void;
  onSelectStudent: (student: TeacherLibraryStudent) => void;
  passageSet?: ExamPassageSet;
  savingBookId: string;
  selectedStudent?: TeacherLibraryStudent;
  showAnswers: boolean;
  students: TeacherLibraryStudent[];
  toggleAnswers: () => void;
};

function TeacherLibraryBookDetail({ access, attempt, isLoading, material, message, onGenerateCode, onSelectAttempt, onSelectStudent, passageSet, savingBookId, selectedStudent, showAnswers, students, toggleAnswers }: TeacherLibraryBookDetailProps) {
  if (isLoading) return <section className="teacher-library-loading">Loading book dashboard…</section>;
  if (!material || !passageSet) return <section className="teacher-panel"><h1>Book not found</h1><AppLink href="/teacher/library"><ArrowLeft size={15} /> Return to English library</AppLink></section>;

  return (
    <>
      <header className="teacher-library-detail-heading">
        <div><AppLink href="/teacher/library"><ArrowLeft size={15} /> English library</AppLink><p>{material.libraryCollection} · {material.readingFormat}</p><h1>{material.title}</h1><span>{material.author || "Teacher selection"} · {material.questionCount} questions</span></div>
        <div className={access ? "is-code-ready" : ""}>
          <span><KeyRound size={17} /><small>Student access code</small><strong>{access?.accessCode ?? "Not generated"}</strong></span>
          {access ? <button aria-label="Copy student access code" onClick={() => navigator.clipboard.writeText(access.accessCode)} type="button"><Copy size={14} /> Copy</button> : null}
          <button disabled={savingBookId === getLibraryBookId(material)} onClick={() => onGenerateCode(material)} type="button"><RefreshCw size={14} /> {access ? "New code" : "Generate code"}</button>
        </div>
      </header>
      {message ? <p className="teacher-message corporate-message">{message}</p> : null}
      <div className="teacher-library-detail-layout">
        <section className="teacher-book-preview" aria-label="Student book preview">
          <header><div><Eye size={18} /><span><small>Student preview</small><h2>Reading experience</h2></span></div><button aria-pressed={showAnswers} onClick={toggleAnswers} type="button">{showAnswers ? <EyeOff size={15} /> : <Eye size={15} />}{showAnswers ? "Hide answers" : "Show answers"}</button></header>
          <article className="teacher-book-preview-passage">
            {passageSet.passage.lines.filter((line) => line.kind !== "image").map((line, index) => line.text ? <p className={line.kind ? `is-${line.kind}` : ""} key={`${line.lineNumber}-${index}`}>{line.text}</p> : null)}
          </article>
          <div className="teacher-book-preview-questions">
            {passageSet.questions.map((question, index) => (
              <article key={question.id}>
                <span>Question {index + 1}</span><h3>{question.prompt}</h3>
                <div>{question.choices?.map((choice) => <p className={showAnswers && choice.id === question.correctChoiceId ? "is-answer" : ""} key={choice.id}><b>{choice.id}</b>{choice.text}{showAnswers && choice.id === question.correctChoiceId ? <Check size={15} /> : null}</p>)}</div>
              </article>
            ))}
          </div>
        </section>

        <aside className="teacher-book-results">
          <header><div><Users size={18} /><span><small>Student results</small><h2>{students.length} students</h2></span></div><strong>{students.reduce((sum, student) => sum + student.attempts.length, 0)} attempts</strong></header>
          <div className="teacher-book-student-list">
            {students.map((student) => {
              const best = bestScore(student);
              return <button className={student.id === selectedStudent?.id ? "is-active" : ""} key={student.id} onClick={() => onSelectStudent(student)} type="button"><span>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span><strong>{student.name}</strong><small>{student.attempts.length ? `${student.attempts.length} ${student.attempts.length === 1 ? "attempt" : "attempts"}` : "Not attempted"}</small></span><em>{best === null ? "—" : `${best}%`}<small>best</small></em></button>;
            })}
          </div>
          {selectedStudent ? (
            <section className="teacher-book-attempt-panel">
              <header><div><small>Attempt history</small><h3>{selectedStudent.name}</h3></div>{selectedStudent.attempts.length ? <select aria-label={`Attempt for ${selectedStudent.name}`} onChange={(event) => onSelectAttempt(event.target.value)} value={attempt?.id ?? ""}>{selectedStudent.attempts.map((item) => <option key={item.id} value={item.id}>Attempt {item.attemptNumber} · {formatDate(item.completedAt)}</option>)}</select> : null}</header>
              {attempt ? <TeacherAttemptDetail attempt={attempt} passageSet={passageSet} /> : <div className="teacher-book-no-attempt"><Clock3 size={23} /><strong>No attempts yet</strong><p>This student&apos;s score, total time, and question-level details will appear after they finish the book.</p></div>}
            </section>
          ) : null}
        </aside>
      </div>
    </>
  );
}

function TeacherAttemptDetail({ attempt, passageSet }: { attempt: TeacherLibraryAttempt; passageSet: ExamPassageSet }) {
  const isCorrectionAttempt = attempt.attemptNumber === 1 && attempt.score < attempt.totalQuestions;
  return (
    <div className="teacher-attempt-detail">
      <div className="teacher-attempt-metrics"><span><BarChart3 size={17} /><small>Total score</small><strong>{attempt.score} / {attempt.totalQuestions}</strong><em>{percentage(attempt.score, attempt.totalQuestions)}%</em></span><span><Clock3 size={17} /><small>Total time</small><strong>{formatDuration(attempt.totalTimeSeconds)}</strong><em>Attempt {attempt.attemptNumber}</em></span></div>
      <div className="teacher-question-result-list">
        {attempt.questions.map((question) => (
          <article className={question.isCorrect ? "is-correct" : "is-wrong"} key={question.questionId}>
            <header><span>{question.isCorrect ? <ShieldCheck size={15} /> : <Activity size={15} />} Question {question.questionNumber}</span><strong>{question.isCorrect ? "Correct" : "Incorrect"}</strong><em>{formatDuration(question.timeSpentSeconds)}</em></header>
            {!question.isCorrect ? <div><p><small>Student selected</small><span>{question.selectedAnswerId}. {getChoiceText(passageSet, question.questionId, question.selectedAnswerId)}</span></p><p><small>Correct answer</small><span>{question.correctAnswerId}. {getChoiceText(passageSet, question.questionId, question.correctAnswerId)}</span></p></div> : null}
          </article>
        ))}
      </div>
      {isCorrectionAttempt ? (
        <section className={`teacher-correction-review${attempt.correction ? " is-submitted" : " is-pending"}`}>
          <header>
            <MessageSquareText size={18} />
            <span><small>First-attempt corrections</small><strong>{attempt.correction ? "Submitted" : "Not submitted yet"}</strong></span>
            {attempt.correction ? <time dateTime={attempt.correction.submittedAt}>{formatDate(attempt.correction.submittedAt)}</time> : null}
          </header>
          {attempt.correction ? (
            <div>
              {attempt.correction.responses.map((response) => {
                const question = attempt.questions.find((item) => item.questionId === response.questionId);
                return (
                  <article key={response.questionId}>
                    <h4>Question {question?.questionNumber ?? response.questionId}</h4>
                    <p><small>Why the chosen answer is incorrect</small><span>{response.whyChosenIncorrect}</span></p>
                    <p><small>Why the correct answer is correct</small><span>{response.whyCorrectAnswerCorrect}</span></p>
                  </article>
                );
              })}
            </div>
          ) : <p>The student can submit written explanations for every question missed on this attempt. Their answers will appear here once submitted.</p>}
        </section>
      ) : null}
    </div>
  );
}
