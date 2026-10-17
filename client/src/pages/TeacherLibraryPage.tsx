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
  Eye,
  EyeOff,
  LayoutDashboard,
  MessageSquareText,
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
  setTeacherLibraryStudentAccess,
  getTeacherLibraryBook,
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
import { PASSAGE_CATEGORIES, passageCategory, passageCategoryLabel } from "../../../server/src/shared/passageCategories";
import "../styles/learning-plan.css";

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
  const routeBookId = getBookIdFromPath();
  const bookId = getEnglishLibraryMaterial(routeBookId) ? getLibraryBookId(getEnglishLibraryMaterial(routeBookId)!) : routeBookId;
  const selectedMaterial = bookId ? getEnglishLibraryMaterial(bookId) : undefined;
  const passageSet = bookId ? getPassageSet(bookId) : undefined;
  const [accessToken, setAccessToken] = useState(initialSession?.access_token ?? "");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured && !initialSession);
  const [isLoadingDetail, setIsLoadingDetail] = useState(Boolean(bookId));
  const [message, setMessage] = useState("");
  const [savingStudentId, setSavingStudentId] = useState("");
  const [selectedAttemptId, setSelectedAttemptId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [librarySort, setLibrarySort] = useState("title");
  const [libraryDirection, setLibraryDirection] = useState<"asc" | "desc">("asc");
  const [students, setStudents] = useState<TeacherLibraryStudent[]>([]);
  const [teacherName, setTeacherName] = useState(
    initialMetadata?.full_name ?? initialMetadata?.name ?? initialSession?.user.email?.split("@")[0] ?? "Teacher",
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let isMounted = true;
    async function load() {
      setIsLoadingDetail(Boolean(bookId));
      setStudents([]);
      setMessage("");
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
          setStudents(detail.students);
          const firstStudent = detail.students.find((student) => student.attempts.length) ?? detail.students[0];
          setSelectedStudentId(firstStudent?.id ?? "");
          setSelectedAttemptId(firstStudent?.attempts[0]?.id ?? "");
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

  const visibleMaterials = useMemo(() => englishLibraryMaterials.filter(material => (!sourceFilter || material.contentSource === sourceFilter) && (!categoryFilter || !material.contentSource && (material.passageCategories ?? [passageCategory(material.passageCategory)]).some(category => category === categoryFilter)) && (!genreFilter || material.readingFormat === genreFilter) && (!librarySearch.trim() || `${material.title} ${material.author ?? ""}`.toLowerCase().includes(librarySearch.trim().toLowerCase()))).sort((a, b) => ((librarySort === "category" ? passageCategoryLabel(a.passageCategory).localeCompare(passageCategoryLabel(b.passageCategory)) : librarySort === "questions" ? a.questionCount - b.questionCount : a.title.localeCompare(b.title)) * (libraryDirection === "asc" ? 1 : -1)) || a.id.localeCompare(b.id)), [sourceFilter, categoryFilter, genreFilter, librarySearch, librarySort, libraryDirection]);
  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const selectedAttempt = selectedStudent?.attempts.find((attempt) => attempt.id === selectedAttemptId) ?? selectedStudent?.attempts[0];
  async function handleSetAccess(student: TeacherLibraryStudent, granted: boolean) {
    if (!accessToken || savingStudentId) return;
    setSavingStudentId(student.id); setMessage("");
    try {
      const result = await setTeacherLibraryStudentAccess(accessToken, bookId, student.id, granted);
      setStudents(current => current.map(item => item.id === result.studentId ? { ...item, access: result.access } : item));
      setMessage(`${granted ? "Access granted to" : "Access removed for"} ${student.name} for this book and all its versions.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Student access could not be saved."); }
    finally { setSavingStudentId(""); }
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
          key={bookId}
          attempt={selectedAttempt}
          isLoading={isLoadingDetail}
          material={selectedMaterial}
          message={message}
          onSetAccess={handleSetAccess}
          onSelectAttempt={setSelectedAttemptId}
          onSelectStudent={(student) => {
            setSelectedStudentId(student.id);
            setSelectedAttemptId(student.attempts[0]?.id ?? "");
          }}
          passageSet={passageSet}
          savingStudentId={savingStudentId}
          selectedStudent={selectedStudent}
          showAnswers={showAnswers}
          students={students}
          toggleAnswers={() => setShowAnswers((current) => !current)}
        />
      ) : (
        <>
          <header className="teacher-library-heading">
            <div><p><BookOpen size={15} /> English library</p><h1>Books & reading</h1><span>All versions, one book. Manage individual student access and review their results.</span></div>
            <div><span><small>Books</small><strong>{englishLibraryMaterials.length}</strong></span><span><small>Combined books</small><strong>{englishLibraryMaterials.filter(material => (material.versionCount ?? 1) > 1).length}</strong></span></div>
          </header>
          {message ? <p role="status" className="teacher-message corporate-message">{message}</p> : null}
          <div className="lp-toolbar">
            <label>Content source<select value={sourceFilter} onChange={event => { setSourceFilter(event.target.value); setCategoryFilter(""); }}><option value="">All sources</option><option>SHSAT Lab</option></select></label>
            <label>Passage category<select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}><option value="">All categories</option>{PASSAGE_CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
            <label>Type / genre<select value={genreFilter} onChange={event => setGenreFilter(event.target.value)}><option value="">All types</option>{[...new Set(englishLibraryMaterials.map(material => material.readingFormat))].filter(Boolean).sort().map(genre => <option key={genre}>{genre}</option>)}</select></label>
            <label>Find passage<input value={librarySearch} onChange={event => setLibrarySearch(event.target.value)} placeholder="Title or author" /></label>
            <label>Sort by<select value={librarySort} onChange={event => setLibrarySort(event.target.value)}><option value="title">Title</option><option value="category">Passage category</option><option value="questions">Question count</option></select></label>
            <label>Direction<select value={libraryDirection} onChange={event => setLibraryDirection(event.target.value as "asc" | "desc")}><option value="asc">{librarySort === "questions" ? "Fewest first" : "A–Z"}</option><option value="desc">{librarySort === "questions" ? "Most first" : "Z–A"}</option></select></label>
            <button onClick={() => { setSourceFilter(""); setCategoryFilter(""); setGenreFilter(""); setLibrarySearch(""); }} type="button">Clear filters</button>
          </div>
          {!visibleMaterials.length && <p>No English passages match these filters. Clear filters or change the category.</p>}
          <section className="teacher-library-grid" aria-label="English library books">
            {visibleMaterials.map((material) => {
              const nextBookId = getLibraryBookId(material);
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
                    <span><small>English · {material.contentSource || passageCategoryLabel(material.passageCategory)}</small><small>{material.contentSource ? "ELA practice set" : material.readingFormat}</small></span>
                    <AppLink href={`/teacher/library/${encodeURIComponent(nextBookId)}`}><strong>{material.title}</strong><ArrowRight size={15} /></AppLink>
                    <p>{material.questionCount} questions{(material.versionCount ?? 1) > 1 ? ` · ${material.versionCount} versions combined` : ""}</p>
                    <AppLink className="teacher-library-manage-link" href={`/teacher/library/${encodeURIComponent(nextBookId)}`}><Users size={15} /> Manage student access</AppLink>
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
  attempt?: TeacherLibraryAttempt;
  isLoading: boolean;
  material?: StudentMaterial;
  message: string;
  onSetAccess: (student: TeacherLibraryStudent, granted: boolean) => void;
  onSelectAttempt: (attemptId: string) => void;
  onSelectStudent: (student: TeacherLibraryStudent) => void;
  passageSet?: ExamPassageSet;
  savingStudentId: string;
  selectedStudent?: TeacherLibraryStudent;
  showAnswers: boolean;
  students: TeacherLibraryStudent[];
  toggleAnswers: () => void;
};

function TeacherLibraryBookDetail({ attempt, isLoading, material, message, onSetAccess, onSelectAttempt, onSelectStudent, passageSet, savingStudentId, selectedStudent, showAnswers, students, toggleAnswers }: TeacherLibraryBookDetailProps) {
  const [studentSearch, setStudentSearch] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [previewVersion, setPreviewVersion] = useState("");
  const visibleStudents = students.filter(student => `${student.name} ${student.username} ${student.email}`.toLowerCase().includes(studentSearch.toLowerCase()) && (!accessFilter || student.access.unlocked === (accessFilter === "enabled")));
  if (isLoading) return <section className="teacher-library-loading">Loading book dashboard…</section>;
  if (!material || !passageSet) return <section className="teacher-panel"><h1>Book not found</h1><AppLink href="/teacher/library"><ArrowLeft size={15} /> Return to English library</AppLink></section>;

  const versions = getExamLibraryPassage(getLibraryBookId(material))?.versions ?? [];
  const previewPassage = getPassageSet(previewVersion)?.passage ?? passageSet.passage;
  return (
    <>
      <header className="teacher-library-detail-heading">
        <div><AppLink href="/teacher/library"><ArrowLeft size={15} /> English library</AppLink><p>English · {material.contentSource || passageCategoryLabel(material.passageCategory)} · {material.contentSource ? "ELA practice set" : material.readingFormat}</p><h1>{material.title}</h1><span>{material.author || "Teacher selection"} · {material.questionCount} questions{(material.versionCount ?? 1) > 1 ? ` · ${material.versionCount} versions combined` : ""}</span></div>
        <div className="teacher-library-access-summary"><Users size={21} /><span><small>Individual student access</small><strong>{students.filter(student => student.access.unlocked).length} of {students.length} enabled</strong></span></div>
      </header>
      {message ? <p role="status" className="teacher-message corporate-message">{message}</p> : null}
      <div className="teacher-library-detail-layout">
        <section className="teacher-book-preview" aria-label="Student book preview">
          <header><div><Eye size={18} /><span><small>Student preview</small><h2>Reading experience</h2></span></div><button aria-pressed={showAnswers} onClick={toggleAnswers} type="button">{showAnswers ? <EyeOff size={15} /> : <Eye size={15} />}{showAnswers ? "Hide answers" : "Show answers"}</button></header>
          {versions.length > 1 && <label className="teacher-book-version-picker">Passage version<select value={previewVersion || versions[0].id} onChange={event => setPreviewVersion(event.target.value)}>{versions.map(version => <option key={version.id} value={version.id}>{version.label}</option>)}</select></label>}
          <article className="teacher-book-preview-passage">
            {previewPassage.lines.filter((line) => line.kind !== "image").map((line, index) => line.text ? <p className={line.kind ? `is-${line.kind}` : ""} key={`${line.lineNumber}-${index}`}>{line.text}</p> : null)}
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
          <header><div><Users size={18} /><span><small>Access & results</small><h2>{students.length} students</h2></span></div><strong>{students.reduce((sum, student) => sum + student.attempts.length, 0)} attempts</strong></header>
          <div className="teacher-library-roster-tools">
            <label>Find student<input value={studentSearch} onChange={event => setStudentSearch(event.target.value)} placeholder="Name, username, or email" /></label>
            <label>Access<select value={accessFilter} onChange={event => setAccessFilter(event.target.value)}><option value="">All students</option><option value="enabled">Enabled</option><option value="disabled">Not enabled</option></select></label>
            <p>Enable this book once to include every version. Select a student to review their attempts.</p>
          </div>
          <div className="teacher-book-student-list">
            {!visibleStudents.length && <p className="teacher-library-roster-empty">{students.length ? "No students match these filters." : "No active SHSAT students are enrolled yet."}</p>}
            {visibleStudents.map(student => {
              const best = bestScore(student);
              return <div className={`teacher-library-student-row${student.id === selectedStudent?.id ? " is-active" : ""}`} key={student.id}>
                <button className="teacher-library-student-select" aria-pressed={student.id === selectedStudent?.id} onClick={() => onSelectStudent(student)} type="button"><span>{student.name.split(" ").map(part => part[0]).join("").slice(0, 2)}</span><span><strong>{student.name}</strong><small>{student.username} · {student.attempts.length} attempts{best === null ? "" : ` · ${best}% best`}</small></span></button>
                <button className={`teacher-library-access-toggle${student.access.unlocked ? " is-enabled" : ""}`} disabled={Boolean(savingStudentId)} aria-label={`${student.access.unlocked ? "Revoke access for" : "Grant access to"} ${student.name}`} onClick={() => onSetAccess(student, !student.access.unlocked)} type="button">{savingStudentId === student.id ? "Saving…" : student.access.unlocked ? <><Check size={14} /> Enabled · Revoke</> : <><UserRoundPlus size={14} /> Grant access</>}</button>
              </div>;
            })}
          </div>
          {selectedStudent ? (
            <section className="teacher-book-attempt-panel">
              <header><div><small>Attempt history</small><h3>{selectedStudent.name}</h3></div>{selectedStudent.attempts.length ? <select aria-label={`Attempt for ${selectedStudent.name}`} onChange={(event) => onSelectAttempt(event.target.value)} value={attempt?.id ?? ""}>{selectedStudent.attempts.map((item) => <option key={item.id} value={item.id}>{item.bookId === getLibraryBookId(material) ? "Combined book" : "Earlier version"} · Attempt {item.attemptNumber} · {formatDate(item.completedAt)}</option>)}</select> : null}</header>
              {attempt ? <TeacherAttemptDetail attempt={attempt} passageSet={getPassageSet(attempt.bookId) ?? passageSet} /> : <div className="teacher-book-no-attempt"><Clock3 size={23} /><strong>No attempts yet</strong><p>This student&apos;s score, total time, and question-level details will appear after they finish the book.</p></div>}
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
                    {response.questionType && <p><small>Student-selected question type</small><span>{response.questionType}</span></p>}
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
