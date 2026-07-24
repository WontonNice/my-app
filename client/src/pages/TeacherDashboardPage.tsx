import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Activity, BarChart3, BookOpen, CheckCircle2, ChevronDown, ClipboardList, LayoutDashboard, Pencil, Shuffle, Target, Trash2, UserRoundPlus, Users, X } from "lucide-react";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { resolveExamContent, type ExamQuestion } from "../content/exams";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import {
  getTeacherAssessments,
  getTeacherStudentProgress,
  deleteStudentAccount,
  updateStudentAccount,
  updateTeacherAssessmentSplit,
  updateTeacherAssessmentStatus,
  updateTeacherAssessmentForms,
  type AssessmentStatus,
  type StudentProgressSnapshot,
  type TeacherAssessment,
} from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import {
  createExamResult,
  getAllExamQuestions,
  type ExamPassageResult,
  type ExamSubjectResult,
  type SelectedAnswers,
} from "../lib/examResults";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function labelFromSlug(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function examValue(result: Record<string, unknown>, key: string, fallback = "—") {
  const value = result[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function practiceSummary(progress: Record<string, unknown>) {
  const levels = Object.values(progress).filter((value): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value));
  const values = levels.length ? levels : [progress];
  return values.reduce<{ answered: number; correct: number }>((total, value) => ({
    answered: total.answered + (typeof value.answered === "number" ? value.answered : typeof value.total === "number" ? value.total : typeof value.questionsAnswered === "number" ? value.questionsAnswered : 0),
    correct: total.correct + (typeof value.correct === "number" ? value.correct : 0),
  }), { answered: 0, correct: 0 });
}

function questionTypeSummary(result: Record<string, unknown>) {
  if (!Array.isArray(result.questionTypes)) return [];
  return result.questionTypes.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const value = item as Record<string, unknown>;
    if (typeof value.questionType !== "string" || typeof value.correct !== "number" || typeof value.total !== "number") return [];
    return [{
      correct: value.correct,
      label: value.questionType === "transition_drop" ? "Drag and Drop" : labelFromSlug(value.questionType),
      total: value.total,
    }];
  });
}

function scorePercentage(correct: number, total: number) {
  return total > 0 ? Math.max(0, Math.min(100, Math.round((correct / total) * 100))) : 0;
}

function selectedAnswersFromResult(result: Record<string, unknown>): SelectedAnswers | null {
  if (!result.answers || typeof result.answers !== "object" || Array.isArray(result.answers)) return null;

  const answers: SelectedAnswers = {};
  Object.entries(result.answers as Record<string, unknown>).forEach(([questionId, answer]) => {
    if (typeof answer === "string") {
      answers[questionId] = answer;
      return;
    }
    if (Array.isArray(answer) && answer.every((value) => typeof value === "string")) {
      answers[questionId] = answer;
      return;
    }
    if (answer && typeof answer === "object" && !Array.isArray(answer)) {
      const placements = answer as Record<string, unknown>;
      if (Object.values(placements).every((value) => typeof value === "string")) {
        answers[questionId] = placements as Record<string, string>;
      }
    }
  });

  return Object.keys(answers).length ? answers : null;
}

function subjectResultsFromRecord(result: Record<string, unknown>) {
  if (!Array.isArray(result.subjects)) return [];
  return result.subjects.flatMap((item): ExamSubjectResult[] => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const value = item as Record<string, unknown>;
    if (
      (value.subject !== "English Language Arts" && value.subject !== "Mathematics") ||
      typeof value.correct !== "number" ||
      typeof value.total !== "number"
    ) return [];
    return [{
      correct: value.correct,
      subject: value.subject,
      topics: Array.isArray(value.topics) ? value.topics as ExamSubjectResult["topics"] : [],
      total: value.total,
    }];
  });
}

function passageResultsFromRecord(result: Record<string, unknown>) {
  if (!Array.isArray(result.passages)) return [];
  return result.passages.flatMap((item): ExamPassageResult[] => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const value = item as Record<string, unknown>;
    if (
      typeof value.correct !== "number" ||
      typeof value.total !== "number" ||
      typeof value.id !== "string"
    ) return [];
    return [{
      correct: value.correct,
      id: value.id,
      label: typeof value.label === "string" ? value.label : "Passage",
      title: typeof value.title === "string" ? value.title : labelFromSlug(value.id),
      total: value.total,
    }];
  });
}

function scoreBreakdownForResult(
  result: Record<string, unknown>,
  assessment: TeacherAssessment | undefined,
) {
  const storedSubjects = subjectResultsFromRecord(result);
  const storedPassages = passageResultsFromRecord(result);
  const answers = selectedAnswersFromResult(result);
  if ((!storedSubjects.length || !storedPassages.length) && assessment && answers) {
    const completedSections = Array.isArray(result.completedSections)
      ? result.completedSections.filter(
        (section): section is "english" | "math" => section === "english" || section === "math",
      )
      : result.completionStatus === "english_complete"
        ? ["english" as const]
        : ["english" as const, "math" as const];
    const recalculated = createExamResult(resolveExamContent(assessment), answers, completedSections);
    return {
      passages: storedPassages.length ? storedPassages : recalculated.passages,
      subjects: storedSubjects.length ? storedSubjects : recalculated.subjects,
    };
  }
  return { passages: storedPassages, subjects: storedSubjects };
}

function SectionScoreBreakdown({
  assessment,
  result,
}: {
  assessment: TeacherAssessment | undefined;
  result: Record<string, unknown>;
}) {
  const { passages, subjects } = scoreBreakdownForResult(result, assessment);
  const english = subjects.find((subject) => subject.subject === "English Language Arts");
  const math = subjects.find((subject) => subject.subject === "Mathematics");
  const passageCorrect = passages.reduce((sum, passage) => sum + passage.correct, 0);
  const passageTotal = passages.reduce((sum, passage) => sum + passage.total, 0);
  const standalone = english && english.total > passageTotal
    ? {
      correct: Math.max(0, Math.min(english.total - passageTotal, english.correct - passageCorrect)),
      total: english.total - passageTotal,
    }
    : null;

  if (!english && !math) {
    return <p className="teacher-score-breakdown-empty">Section scoring is unavailable for this older result.</p>;
  }

  return (
    <section className="teacher-score-breakdown" aria-label="Section score breakdown">
      <div className="teacher-score-breakdown-heading">
        <strong>Section score breakdown</strong>
        <span>Correct answers and percent accuracy</span>
      </div>
      <div className="teacher-section-score-grid">
        {english ? (
          <article className="teacher-section-score">
            <header>
              <div><span>English total</span><strong>{english.correct} / {english.total}</strong></div>
              <b>{scorePercentage(english.correct, english.total)}%</b>
            </header>
            <div
              className="teacher-score-meter"
              role="progressbar"
              aria-label="English score"
              aria-valuemin={0}
              aria-valuemax={english.total}
              aria-valuenow={english.correct}
            >
              <span style={{ width: `${scorePercentage(english.correct, english.total)}%` }} />
            </div>
            {passages.length ? (
              <>
                <h4>Score by passage</h4>
                <div className="teacher-passage-score-grid">
                  {passages.map((passage) => (
                    <div key={passage.id}>
                      <span>{passage.label}</span>
                      <strong>{passage.title}</strong>
                      <p><b>{passage.correct} / {passage.total}</b><small>{scorePercentage(passage.correct, passage.total)}%</small></p>
                    </div>
                  ))}
                  {standalone ? (
                    <div>
                      <span>English section</span>
                      <strong>Stand-alone questions</strong>
                      <p><b>{standalone.correct} / {standalone.total}</b><small>{scorePercentage(standalone.correct, standalone.total)}%</small></p>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </article>
        ) : null}
        {math ? (
          <article className="teacher-section-score">
            <header>
              <div><span>Math total</span><strong>{math.correct} / {math.total}</strong></div>
              <b>{scorePercentage(math.correct, math.total)}%</b>
            </header>
            <div
              className="teacher-score-meter"
              role="progressbar"
              aria-label="Math score"
              aria-valuemin={0}
              aria-valuemax={math.total}
              aria-valuenow={math.correct}
            >
              <span style={{ width: `${scorePercentage(math.correct, math.total)}%` }} />
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}

type LeaderboardScore = {
  correct: number;
  total: number;
};

type LeaderboardEntry = {
  fullName: string;
  rank: number | null;
  score: LeaderboardScore | null;
  status: string;
  studentId: string;
  username: string;
};

type ClassLeaderboard = {
  average: number | null;
  entries: LeaderboardEntry[];
  id: string;
  scoredStudents: number;
  title: string;
};

type ClassAssessmentInsight = {
  assessmentId: string;
  english: ClassLeaderboard;
  math: ClassLeaderboard;
  overallAverage: number | null;
  passages: ClassLeaderboard[];
  submissions: number;
  title: string;
};

function validLeaderboardScore(score: LeaderboardScore | null | undefined) {
  return score &&
    Number.isFinite(score.correct) &&
    Number.isFinite(score.total) &&
    score.total > 0 &&
    score.correct >= 0 &&
    score.correct <= score.total
    ? score
    : null;
}

function buildLeaderboard(
  id: string,
  title: string,
  students: StudentProgressSnapshot[],
  getScore: (student: StudentProgressSnapshot) => LeaderboardScore | null | undefined,
  getStatus: (student: StudentProgressSnapshot) => string,
): ClassLeaderboard {
  const entries = students.map((student): LeaderboardEntry => ({
    fullName: student.fullName,
    rank: null,
    score: validLeaderboardScore(getScore(student)),
    status: getStatus(student),
    studentId: student.id,
    username: student.username,
  })).sort((left, right) => {
    if (left.score && right.score) {
      const ratioComparison =
        right.score.correct * left.score.total - left.score.correct * right.score.total;
      if (ratioComparison !== 0) return ratioComparison;
      if (right.score.correct !== left.score.correct) return right.score.correct - left.score.correct;
    } else if (left.score) return -1;
    else if (right.score) return 1;
    return left.fullName.localeCompare(right.fullName);
  });

  let previousScore: LeaderboardScore | null = null;
  let previousRank = 0;
  entries.forEach((entry, index) => {
    if (!entry.score) return;
    const isTie = previousScore !== null &&
      entry.score.correct * previousScore.total === previousScore.correct * entry.score.total;
    entry.rank = isTie ? previousRank : index + 1;
    previousScore = entry.score;
    previousRank = entry.rank;
  });

  const scoredEntries = entries.filter(
    (entry): entry is LeaderboardEntry & { score: LeaderboardScore } => entry.score !== null,
  );
  return {
    average: scoredEntries.length
      ? Math.round(
        scoredEntries.reduce((sum, entry) => sum + (entry.score.correct / entry.score.total) * 100, 0) /
        scoredEntries.length,
      )
      : null,
    entries,
    id,
    scoredStudents: scoredEntries.length,
    title,
  };
}

function leaderboardStatus(
  result: Record<string, unknown> | undefined,
  kind: "english" | "math" | "passage",
) {
  if (!result) return "Not submitted";
  if (kind === "math" && result.completionStatus === "english_complete") return "Math pending";
  return kind === "passage" ? "Passage data unavailable" : "Section data unavailable";
}

function initials(fullName: string) {
  return fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function ClassScoreLeaderboardCard({
  leaderboard,
  subtitle,
}: {
  leaderboard: ClassLeaderboard;
  subtitle: string;
}) {
  return (
    <article className="teacher-leaderboard-card">
      <header>
        <div><span>{subtitle}</span><h3>{leaderboard.title}</h3></div>
        <div><strong>{leaderboard.average === null ? "—" : `${leaderboard.average}%`}</strong><small>class avg.</small></div>
      </header>
      <div className="teacher-leaderboard-meta">
        <span>{leaderboard.scoredStudents} scored</span>
        <span>{leaderboard.entries.length} students shown</span>
      </div>
      <div className="teacher-leaderboard-list" role="list" aria-label={`${leaderboard.title} rankings`}>
        {leaderboard.entries.map((entry) => {
          const percentage = entry.score ? scorePercentage(entry.score.correct, entry.score.total) : null;
          return (
            <div className={`teacher-leaderboard-row${entry.score ? "" : " is-unscored"}`} key={entry.studentId} role="listitem">
              <span className={`teacher-leaderboard-rank${entry.rank && entry.rank <= 3 ? ` is-top-${entry.rank}` : ""}`}>
                {entry.rank === null ? "—" : entry.rank}
              </span>
              <span className="teacher-leaderboard-avatar">{initials(entry.fullName)}</span>
              <span className="teacher-leaderboard-student">
                <strong>{entry.fullName}</strong>
                <small>{entry.username}</small>
              </span>
              {entry.score ? (
                <>
                  <span className="teacher-leaderboard-meter" aria-hidden="true"><i style={{ width: `${percentage}%` }} /></span>
                  <span className="teacher-leaderboard-score"><strong>{percentage}%</strong><small>{entry.score.correct} / {entry.score.total}</small></span>
                </>
              ) : (
                <span className="teacher-leaderboard-status">{entry.status}</span>
              )}
            </div>
          );
        })}
        {!leaderboard.entries.length ? <p className="teacher-empty-state">No SHSAT students are enrolled.</p> : null}
      </div>
    </article>
  );
}

function choiceLabel(question: ExamQuestion, choiceId: string) {
  const choice = question.choices?.find((candidate) => candidate.id === choiceId);
  return choice ? `${choiceId} — ${choice.text}` : choiceId;
}

function placementLabel(question: ExamQuestion, placements: Record<string, string>) {
  return Object.entries(placements).map(([itemId, categoryId]) => {
    const item = question.items?.find((candidate) => candidate.id === itemId);
    const category = question.categories?.find((candidate) => candidate.id === categoryId);
    return `${item?.text ?? itemId} → ${category?.title ?? categoryId}`;
  }).join("; ");
}

function correctAnswerLabel(question: ExamQuestion) {
  if (question.type === "multiple_choice" || question.type === "transition_drop") {
    return choiceLabel(question, question.correctChoiceId ?? "—");
  }
  if (question.type === "multi_select") {
    return (question.correctChoiceIds ?? []).map((choiceId) => choiceLabel(question, choiceId)).join("; ") || "—";
  }
  if (question.type === "category_sort" || question.type === "table_match") {
    return placementLabel(question, question.correctPlacements ?? {}) || "—";
  }
  if (question.type === "inline_dropdown") {
    return (question.dropdowns ?? []).map((dropdown) => {
      const option = dropdown.options.find((candidate) => candidate.id === dropdown.correctChoiceId);
      return `${dropdown.id}: ${option?.text ?? dropdown.correctChoiceId ?? "—"}`;
    }).join("; ");
  }
  return question.correctTextAnswers?.join(" or ") || "Teacher scored";
}

function studentAnswerLabel(question: ExamQuestion, answer: unknown) {
  if (typeof answer === "string") {
    return question.choices?.length ? choiceLabel(question, answer) : answer || "Blank";
  }
  if (Array.isArray(answer)) {
    return answer.map((choiceId) => choiceLabel(question, String(choiceId))).join("; ") || "Blank";
  }
  if (answer && typeof answer === "object") {
    const values = answer as Record<string, string>;
    if (question.type === "category_sort" || question.type === "table_match") {
      return placementLabel(question, values) || "Blank";
    }
    if (question.type === "inline_dropdown") {
      return Object.entries(values).map(([dropdownId, optionId]) => {
        const dropdown = question.dropdowns?.find((candidate) => candidate.id === dropdownId);
        const option = dropdown?.options.find((candidate) => candidate.id === optionId);
        return `${dropdownId}: ${option?.text ?? optionId}`;
      }).join("; ") || "Blank";
    }
  }
  return "Blank";
}

function ExamAnswerKey({ assessment }: { assessment: TeacherAssessment }) {
  const questions = getAllExamQuestions(resolveExamContent(assessment));
  return (
    <section className="teacher-answer-key" aria-label={`${assessment.title} answer key`}>
      {questions.map((question, index) => (
        <div className="teacher-answer-row" key={question.id}>
          <strong>{index + 1}</strong>
          <span>{question.prompt}</span>
          <b>{correctAnswerLabel(question)}</b>
        </div>
      ))}
      {!questions.length && <p className="teacher-empty-state">No questions are in this exam yet.</p>}
    </section>
  );
}

type FormDraft = {
  assignments: Record<string, string>;
  forms: NonNullable<TeacherAssessment["forms"]>;
};

function shuffled<T>(values: T[]) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createPassageForms(assessment: TeacherAssessment): FormDraft["forms"] {
  const passageIds = assessment.passages.map((passage) => passage.id);
  if (!passageIds.length) return [];

  const maximumForms = passageIds.length === 1 ? 1 : passageIds.length === 2 ? 2 : 4;
  const orders = new Map<string, string[]>([[passageIds.join("\u0000"), passageIds]]);
  for (let attempt = 0; orders.size < maximumForms && attempt < 100; attempt += 1) {
    const order = shuffled(passageIds);
    orders.set(order.join("\u0000"), order);
  }
  for (let offset = 1; orders.size < maximumForms && offset < passageIds.length; offset += 1) {
    const order = [...passageIds.slice(offset), ...passageIds.slice(0, offset)];
    orders.set(order.join("\u0000"), order);
  }

  return Array.from(orders.values(), (passageOrder, index) => ({
    id: `form-${String.fromCharCode(97 + index)}`,
    label: `Form ${String.fromCharCode(65 + index)}`,
    passageOrder,
  }));
}

function StudentDetail({
  assessments,
  student,
}: {
  assessments: TeacherAssessment[];
  student: StudentProgressSnapshot;
}) {
  const responseRecords = new Map<string, {
    answers: Record<string, unknown>;
    status: string;
    updatedAt: string | null;
  }>();
  student.progress.examResults.forEach((result) => {
    if (typeof result.assessmentId !== "string") return;
    const answers =
      result.answers && typeof result.answers === "object" && !Array.isArray(result.answers)
        ? result.answers as Record<string, unknown>
        : {};
    responseRecords.set(result.assessmentId, {
      answers,
      status: result.completionStatus === "english_complete" ? "English submitted · Math pending" : "Submitted",
      updatedAt: typeof result.completedAt === "string" ? result.completedAt : null,
    });
  });
  Object.entries(student.examSessions ?? {}).forEach(([assessmentId, session]) => {
    const existing = responseRecords.get(assessmentId);
    if (session.status === "submitted" && existing && Object.keys(existing.answers).length) return;
    responseRecords.set(assessmentId, {
      answers: session.answers,
      status: session.status === "submitted" ? "Submitted" : "Autosaved · In progress",
      updatedAt: session.updatedAt,
    });
  });

  return (
    <section className="teacher-student-detail" aria-label={`${student.fullName} record`}>
      <div className="teacher-panel-header"><div><span>Student record</span><h2>{student.fullName}</h2></div><p>Last login: {formatDate(student.lastLoginAt)}</p></div>
      <div className="teacher-insight-grid">
        <article><span>Test average</span><strong>{student.insights.averageTestScore === null ? "—" : `${student.insights.averageTestScore}%`}</strong></article>
        <article><span>Best score</span><strong>{student.insights.bestTestScore === null ? "—" : `${student.insights.bestTestScore}%`}</strong></article>
        <article><span>Tests taken</span><strong>{student.insights.testsCompleted}</strong></article>
        <article><span>Practice accuracy</span><strong>{student.insights.practiceAccuracy === null ? "—" : `${student.insights.practiceAccuracy}%`}</strong></article>
      </div>
      <h3 className="teacher-detail-heading">Test history</h3>
      <div className="teacher-results-table" role="table" aria-label={`${student.fullName} test history`}>
        <div className="teacher-results-row teacher-results-head" role="row"><span>Assessment</span><span>Date</span><span>Score</span><span>Correct</span></div>
        {student.progress.examResults.map((result, index) => {
          const assessmentId = examValue(result, "assessmentId", "");
          const assessment = assessments.find((candidate) => candidate.id === assessmentId);
          return (
            <article className="teacher-result-entry" key={`${assessmentId}-${index}`}>
              <div className="teacher-results-row" role="row">
                <strong>{examValue(result, "title", assessment?.title ?? (assessmentId || "Assessment"))}<small>{result.completionStatus === "english_complete" ? "English submitted · Math pending" : "Complete"}</small></strong>
                <span>{typeof result.completedAt === "string" ? formatDate(result.completedAt) : "—"}</span>
                <strong>{examValue(result, "percentage")}%</strong>
                <span>{examValue(result, "correct")} / {examValue(result, "total")}{questionTypeSummary(result).map((item) => <small key={item.label}>{item.label}: {item.correct}/{item.total}</small>)}</span>
              </div>
              <SectionScoreBreakdown assessment={assessment} result={result} />
            </article>
          );
        })}
        {!student.progress.examResults.length && <p className="teacher-empty-state">No test results recorded yet.</p>}
      </div>
      <h3 className="teacher-detail-heading">Saved student answers</h3>
      <div className="teacher-response-list">
        {Array.from(responseRecords, ([assessmentId, record]) => {
          const assessment = assessments.find((candidate) => candidate.id === assessmentId);
          const questions = assessment ? getAllExamQuestions(resolveExamContent(assessment)) : [];
          return (
            <details className="teacher-response-details" key={assessmentId}>
              <summary>
                <span><strong>{assessment?.title ?? labelFromSlug(assessmentId)}</strong><small>{record.status} · {formatDate(record.updatedAt)}</small></span>
                <b>{Object.keys(record.answers).length} saved</b>
              </summary>
              <div className="teacher-answer-key">
                {questions.map((question, index) => (
                  <div className="teacher-answer-row" key={question.id}>
                    <strong>{index + 1}</strong>
                    <span>{question.prompt}</span>
                    <b>{studentAnswerLabel(question, record.answers[question.id])}</b>
                  </div>
                ))}
                {!questions.length && Object.entries(record.answers).map(([questionId, answer]) => (
                  <div className="teacher-answer-row" key={questionId}>
                    <strong>•</strong><span>{questionId}</span><b>{typeof answer === "string" ? answer : JSON.stringify(answer)}</b>
                  </div>
                ))}
                {!Object.keys(record.answers).length && <p className="teacher-empty-state">No answers saved yet.</p>}
              </div>
            </details>
          );
        })}
        {!responseRecords.size && <p className="teacher-empty-state">No student answer records yet.</p>}
      </div>
      <h3 className="teacher-detail-heading">Practice progress</h3>
      <div className="teacher-practice-grid">
        {Object.entries(student.progress.practice).map(([topic, progress]) => {
          const summary = practiceSummary(progress);
          return <article key={topic}><strong>{labelFromSlug(topic)}</strong><span>{summary.correct} correct</span><span>{summary.answered} questions</span></article>;
        })}
        {!Object.keys(student.progress.practice).length && <p className="teacher-empty-state">No practice activity recorded yet.</p>}
      </div>
    </section>
  );
}

export function TeacherDashboardPage() {
  const [accessToken, setAccessToken] = useState("");
  const [assessments, setAssessments] = useState<TeacherAssessment[]>([]);
  const [students, setStudents] = useState<StudentProgressSnapshot[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [message, setMessage] = useState("");
  const [savingStatusId, setSavingStatusId] = useState("");
  const [savingAccountId, setSavingAccountId] = useState("");
  const [savingFormsId, setSavingFormsId] = useState("");
  const [openFormEditorId, setOpenFormEditorId] = useState("");
  const [openAnswerKeyId, setOpenAnswerKeyId] = useState("");
  const [formDrafts, setFormDrafts] = useState<Record<string, FormDraft>>({});
  const [editingStudentAccountId, setEditingStudentAccountId] = useState("");
  const [studentAccountDraft, setStudentAccountDraft] = useState({ fullName: "", password: "", username: "" });
  const [teacherName, setTeacherName] = useState("Teacher");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    async function loadTeacherDashboard() {
      const { data } = await getSupabaseClient().auth.getSession();
      if (!data.session) { window.location.assign("/login"); return; }
      const userRole = getUserRole(data.session.user);
      const metadata = data.session.user.user_metadata as { full_name?: string; name?: string };
      setTeacherName(metadata.full_name ?? metadata.name ?? "Teacher");
      if (userRole !== "teacher") { window.location.assign(getDashboardPath(userRole)); return; }
      setAccessToken(data.session.access_token);
      try {
        const [nextAssessments, nextStudents] = await Promise.all([
          getTeacherAssessments(data.session.access_token),
          getTeacherStudentProgress(data.session.access_token),
        ]);
        setAssessments(nextAssessments);
        setStudents(nextStudents);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load the teacher dashboard.");
      } finally { setIsCheckingSession(false); }
    }
    loadTeacherDashboard();
  }, []);

  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const shsatStudents = useMemo(() => students.filter((student) => student.classes.includes("shsat")), [students]);
  const classAverage = useMemo(() => {
    const values = students.map((student) => student.insights.averageTestScore).filter((value): value is number => value !== null);
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
  }, [students]);
  const assessmentAverages = useMemo(() => {
    const grouped = new Map<string, { scores: number[]; title: string }>();
    shsatStudents.forEach((student) => {
      student.progress.examResults.forEach((result) => {
        const assessmentId = examValue(result, "assessmentId", "unknown");
        const percentage = typeof result.percentage === "number" ? result.percentage : null;
        if (percentage === null) return;
        const current = grouped.get(assessmentId) ?? { scores: [], title: examValue(result, "title", assessmentId) };
        current.scores.push(percentage);
        grouped.set(assessmentId, current);
      });
    });
    return new Map(Array.from(grouped, ([assessmentId, value]) => [assessmentId, {
      average: Math.round(value.scores.reduce((sum, score) => sum + score, 0) / value.scores.length),
      submissions: value.scores.length,
      title: value.title,
    }]));
  }, [shsatStudents]);
  const classAssessmentInsights = useMemo<ClassAssessmentInsight[]>(() => {
    const resultsByAssessment = new Map<string, Map<string, Record<string, unknown>>>();
    shsatStudents.forEach((student) => {
      student.progress.examResults.forEach((result) => {
        if (typeof result.assessmentId !== "string" || !result.assessmentId) return;
        const assessmentResults = resultsByAssessment.get(result.assessmentId) ?? new Map();
        assessmentResults.set(student.id, result);
        resultsByAssessment.set(result.assessmentId, assessmentResults);
      });
    });

    const assessmentById = new Map(assessments.map((assessment) => [assessment.id, assessment]));
    const currentAssessmentIds = assessments
      .map((assessment) => assessment.id)
      .filter((assessmentId) => resultsByAssessment.has(assessmentId));
    const historicalAssessmentIds = Array.from(resultsByAssessment.keys())
      .filter((assessmentId) => !assessmentById.has(assessmentId));

    return [...currentAssessmentIds, ...historicalAssessmentIds].map((assessmentId) => {
      const assessment = assessmentById.get(assessmentId);
      const resultByStudent = resultsByAssessment.get(assessmentId) ?? new Map();
      const breakdownByStudent = new Map<string, ReturnType<typeof scoreBreakdownForResult>>();
      resultByStudent.forEach((result, studentId) => {
        breakdownByStudent.set(studentId, scoreBreakdownForResult(result, assessment));
      });

      const english = buildLeaderboard(
        "english",
        "English",
        shsatStudents,
        (student) => {
          const subject = breakdownByStudent.get(student.id)?.subjects.find(
            (item) => item.subject === "English Language Arts",
          );
          return subject ? { correct: subject.correct, total: subject.total } : null;
        },
        (student) => leaderboardStatus(resultByStudent.get(student.id), "english"),
      );
      const math = buildLeaderboard(
        "math",
        "Math",
        shsatStudents,
        (student) => {
          const subject = breakdownByStudent.get(student.id)?.subjects.find(
            (item) => item.subject === "Mathematics",
          );
          return subject ? { correct: subject.correct, total: subject.total } : null;
        },
        (student) => leaderboardStatus(resultByStudent.get(student.id), "math"),
      );

      const passageDetails = new Map<string, { label: string; title: string }>();
      if (assessment) {
        resolveExamContent(assessment).passageSets.forEach((passageSet, index) => {
          passageDetails.set(passageSet.id, {
            label: passageSet.label || `Passage ${index + 1}`,
            title: passageSet.passage.title,
          });
        });
      }
      breakdownByStudent.forEach((breakdown) => {
        breakdown.passages.forEach((passage) => {
          if (!passageDetails.has(passage.id)) {
            passageDetails.set(passage.id, { label: passage.label, title: passage.title });
          }
        });
      });
      const passages = Array.from(passageDetails, ([passageId, passage]) => buildLeaderboard(
        passageId,
        passage.title,
        shsatStudents,
        (student) => {
          const score = breakdownByStudent.get(student.id)?.passages.find((item) => item.id === passageId);
          return score ? { correct: score.correct, total: score.total } : null;
        },
        (student) => leaderboardStatus(resultByStudent.get(student.id), "passage"),
      ));

      const average = assessmentAverages.get(assessmentId);
      const firstResult = resultByStudent.values().next().value as Record<string, unknown> | undefined;
      return {
        assessmentId,
        english,
        math,
        overallAverage: average?.average ?? null,
        passages,
        submissions: resultByStudent.size,
        title: assessment?.title ?? average?.title ?? (firstResult ? examValue(firstResult, "title", assessmentId) : assessmentId),
      };
    });
  }, [assessmentAverages, assessments, shsatStudents]);

  async function handleToggleAssessment(assessment: TeacherAssessment) {
    if (!accessToken) return;
    const nextStatus: AssessmentStatus = assessment.status === "open" ? "locked" : "open";
    setSavingStatusId(assessment.id); setMessage("");
    try {
      const updated = await updateTeacherAssessmentStatus(accessToken, assessment.id, nextStatus);
      setAssessments((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMessage(`${updated.title} is now ${updated.status}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update the assessment."); }
    finally { setSavingStatusId(""); }
  }

  async function handleToggleSplit(assessment: TeacherAssessment) {
    if (!accessToken) return;
    setSavingStatusId(assessment.id); setMessage("");
    try {
      const updated = await updateTeacherAssessmentSplit(accessToken, assessment.id, !assessment.split);
      setAssessments((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMessage(`${updated.title} will ${updated.split ? "run in two sessions" : "run as one continuous session"}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update the exam format."); }
    finally { setSavingStatusId(""); }
  }

  function openFormEditor(assessment: TeacherAssessment) {
    setOpenFormEditorId((current) => current === assessment.id ? "" : assessment.id);
    setFormDrafts((current) => current[assessment.id] ? current : {
      ...current,
      [assessment.id]: {
        assignments: { ...(assessment.formAssignments ?? {}) },
        forms: assessment.forms?.length ? assessment.forms : createPassageForms(assessment),
      },
    });
  }

  function regenerateForms(assessment: TeacherAssessment) {
    setFormDrafts((current) => ({
      ...current,
      [assessment.id]: {
        assignments: {},
        forms: createPassageForms(assessment),
      },
    }));
  }

  function assignStudentForm(assessmentId: string, studentId: string, formId: string) {
    setFormDrafts((current) => {
      const draft = current[assessmentId];
      if (!draft) return current;
      const assignments = { ...draft.assignments };
      if (formId) assignments[studentId] = formId;
      else delete assignments[studentId];
      return { ...current, [assessmentId]: { ...draft, assignments } };
    });
  }

  async function handleSaveForms(assessment: TeacherAssessment) {
    const draft = formDrafts[assessment.id];
    if (!accessToken || !draft) return;
    setSavingFormsId(assessment.id);
    setMessage("");
    try {
      const updated = await updateTeacherAssessmentForms(
        accessToken,
        assessment.id,
        draft.forms,
        draft.assignments,
      );
      setAssessments((current) => current.map((item) => item.id === updated.id ? updated : item));
      setFormDrafts((current) => ({
        ...current,
        [assessment.id]: {
          assignments: { ...(updated.formAssignments ?? {}) },
          forms: updated.forms ?? [],
        },
      }));
      setMessage(`${updated.title} forms and student assignments are live.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the exam forms.");
    } finally {
      setSavingFormsId("");
    }
  }

  function beginEditingStudentAccount(student: StudentProgressSnapshot) {
    setEditingStudentAccountId(student.id);
    setStudentAccountDraft({ fullName: student.fullName, password: "", username: student.username || student.email.split("@")[0] || "" });
    setMessage("");
    document.getElementById("student-accounts")?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEditingStudentAccount() {
    setEditingStudentAccountId("");
    setStudentAccountDraft({ fullName: "", password: "", username: "" });
  }

  async function handleSaveStudentAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !editingStudentAccountId) return;
    setSavingAccountId(editingStudentAccountId);
    setMessage("");
    try {
      const updated = await updateStudentAccount(accessToken, editingStudentAccountId, studentAccountDraft);
      setStudents((current) => current.map((student) => student.id === updated.id ? { ...student, email: updated.email, fullName: updated.fullName, username: updated.username } : student));
      setMessage(`${updated.fullName}'s account was updated.`);
      cancelEditingStudentAccount();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update the student account.");
    } finally {
      setSavingAccountId("");
    }
  }

  async function handleDeleteStudentAccount(student: StudentProgressSnapshot) {
    if (!accessToken || !window.confirm(`Delete ${student.fullName}'s student account? This removes their login and saved progress.`)) return;
    setSavingAccountId(student.id);
    setMessage("");
    try {
      await deleteStudentAccount(accessToken, student.id);
      setStudents((current) => current.filter((item) => item.id !== student.id));
      if (selectedStudentId === student.id) setSelectedStudentId("");
      if (editingStudentAccountId === student.id) cancelEditingStudentAccount();
      setMessage(`${student.fullName}'s account was deleted.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete the student account.");
    } finally {
      setSavingAccountId("");
    }
  }

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading teacher dashboard...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  const teacherStats = [
    { icon: Users, label: "SHSAT students", value: String(shsatStudents.length) },
    { icon: BarChart3, label: "Average test score", value: classAverage === null ? "—" : `${classAverage}%` },
    { icon: CheckCircle2, label: "Tests completed", value: String(students.reduce((sum, student) => sum + student.insights.testsCompleted, 0)) },
    { icon: BookOpen, label: "Open exams", value: String(assessments.filter((assessment) => assessment.status === "open").length) },
  ];
  const navItems = [
    { id: "overview", label: "Overview", href: "/teacher", icon: LayoutDashboard },
    { id: "students", label: "Student progress", href: "#students", icon: Activity },
    { id: "accounts", label: "Student accounts", href: "#student-accounts", icon: UserRoundPlus },
    { id: "assessments", label: "Assessments", href: "#assessments", icon: ClipboardList },
    { id: "student", label: "Student view", href: "/dashboard?preview=student&teacherTools=1", icon: Target },
  ];

  return (
    <CorporateDashboardShell activeId="overview" enableAccountSwitcher navItems={navItems} onSignOut={handleSignOut} profileName={teacherName} profileRole="Teacher account">
      <header className="staff-page-heading corporate-page-heading">
        <div><p><LayoutDashboard size={15} /> Teacher dashboard</p><h1>Student performance</h1><span>SHSAT enrollment, recent activity, test scores, and practice progress in one view.</span></div>
        <a className="corporate-heading-action" href="/dashboard?preview=student&teacherTools=1">Preview student view</a>
      </header>

      <section className="staff-kpi-grid" aria-label="Analytics summary">
        {teacherStats.map(({ icon: Icon, label, value }) => <article key={label}><span><Icon size={19} /></span><div><p>{label}</p><strong>{value}</strong></div><em>Live student data</em></article>)}
      </section>
      {message && <p className="teacher-message corporate-message">{message}</p>}

      <section className="teacher-panel teacher-roster-panel" id="students">
          <div className="teacher-panel-header"><div><span>Roster</span><h2>SHSAT student progress</h2></div><p>Tap a student to open their record here.</p></div>
          <div className="teacher-student-list">
            {shsatStudents.map((student) => {
              const isOpen = student.id === selectedStudent?.id;
              return <div className={`teacher-student-entry${isOpen ? " is-open" : ""}`} key={student.id}>
              <button aria-expanded={isOpen} onClick={() => setSelectedStudentId(isOpen ? "" : student.id)} type="button">
                <span className="teacher-student-avatar">{student.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                <span><strong>{student.fullName}</strong><small>{student.email}</small><small>Last login: {formatDate(student.lastLoginAt)}</small></span>
                <span className="teacher-score-badge">{student.insights.averageTestScore === null ? "—" : `${student.insights.averageTestScore}%`}<small>avg.</small></span>
                <ChevronDown className="teacher-roster-chevron" size={18} />
              </button>
              {isOpen && <StudentDetail assessments={assessments} student={student} />}
              </div>;
            })}
            {!shsatStudents.length && <p className="teacher-empty-state">No students are enrolled in SHSAT yet.</p>}
          </div>

      </section>

      <section className="teacher-panel teacher-staff-panel teacher-student-accounts-panel" id="student-accounts">
        <div className="teacher-panel-header"><div><span>Account access</span><h2>SHSAT student accounts</h2></div><p>Edit student names, usernames, and passwords or delete accounts that should no longer have access.</p></div>
        <div className="teacher-staff-layout">
          <form className="teacher-assessment-form teacher-staff-form" onSubmit={handleSaveStudentAccount}>
            <div className="admin-student-form-title"><UserRoundPlus size={18} /><strong>{editingStudentAccountId ? "Edit student account" : "Choose a student"}</strong></div>
            <label>Student name<input disabled={!editingStudentAccountId} required value={studentAccountDraft.fullName} onChange={(event) => setStudentAccountDraft({ ...studentAccountDraft, fullName: event.target.value })} /></label>
            <label>Username<input autoCapitalize="none" disabled={!editingStudentAccountId} minLength={3} pattern="[a-zA-Z0-9._-]+" required value={studentAccountDraft.username} onChange={(event) => setStudentAccountDraft({ ...studentAccountDraft, username: event.target.value.toLowerCase() })} /></label>
            <label>New password <small>Optional</small><input autoComplete="new-password" disabled={!editingStudentAccountId} minLength={6} type="password" value={studentAccountDraft.password} onChange={(event) => setStudentAccountDraft({ ...studentAccountDraft, password: event.target.value })} /></label>
            <div className="admin-account-form-actions">
              <button disabled={!editingStudentAccountId || savingAccountId === editingStudentAccountId} type="submit">{savingAccountId === editingStudentAccountId ? "Saving account" : "Save account"}</button>
              {editingStudentAccountId ? <button className="is-secondary" onClick={cancelEditingStudentAccount} type="button"><X size={15} /> Cancel</button> : null}
            </div>
          </form>
          <div className="teacher-staff-list" aria-label="SHSAT student accounts">
            {shsatStudents.length ? shsatStudents.map((student) => <article key={student.id}><span>{student.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span><div><strong>{student.fullName}</strong><small>Username: {student.username}</small><small>Email: {student.email}</small></div><div className="admin-account-actions"><button disabled={savingAccountId === student.id} onClick={() => beginEditingStudentAccount(student)} type="button"><Pencil size={14} /> Edit</button><button className="is-danger" disabled={savingAccountId === student.id} onClick={() => handleDeleteStudentAccount(student)} type="button"><Trash2 size={14} /> Delete</button></div></article>) : <p>No SHSAT student accounts found.</p>}
          </div>
        </div>
      </section>

      <section className="teacher-panel teacher-class-averages" aria-labelledby="class-averages-title">
        <div className="teacher-panel-header"><div><span>Class insights</span><h2 id="class-averages-title">Section averages and leaderboards</h2></div><p>Every SHSAT student is shown. Rankings use percent accuracy, and tied scores share a rank.</p></div>
        <div className="teacher-assessment-insights">
          {classAssessmentInsights.map((insight, index) => (
            <details className="teacher-assessment-insight" key={insight.assessmentId} open={index === 0}>
              <summary>
                <span><strong>{insight.title}</strong><small>{insight.submissions} submission{insight.submissions === 1 ? "" : "s"}</small></span>
                <span className="teacher-assessment-average"><small>Overall</small><strong>{insight.overallAverage === null ? "—" : `${insight.overallAverage}%`}</strong></span>
                <span className="teacher-assessment-average"><small>English</small><strong>{insight.english.average === null ? "—" : `${insight.english.average}%`}</strong></span>
                <span className="teacher-assessment-average"><small>Math</small><strong>{insight.math.average === null ? "—" : `${insight.math.average}%`}</strong></span>
                <ChevronDown className="teacher-assessment-insight-chevron" size={19} />
              </summary>
              <div className="teacher-assessment-insight-body">
                <div className="teacher-leaderboard-grid teacher-section-leaderboards">
                  <ClassScoreLeaderboardCard leaderboard={insight.english} subtitle="Section ranking" />
                  <ClassScoreLeaderboardCard leaderboard={insight.math} subtitle="Section ranking" />
                </div>
                {insight.passages.length ? (
                  <section className="teacher-passage-leaderboards" aria-label={`${insight.title} passage rankings`}>
                    <header><div><span>English detail</span><h3>Passage leaderboards</h3></div><p>Class average and complete roster for each passage.</p></header>
                    <div className="teacher-leaderboard-grid">
                      {insight.passages.map((leaderboard, passageIndex) => (
                        <ClassScoreLeaderboardCard
                          key={leaderboard.id}
                          leaderboard={leaderboard}
                          subtitle={`Passage ${passageIndex + 1}`}
                        />
                      ))}
                    </div>
                  </section>
                ) : (
                  <p className="teacher-leaderboard-note">Passage-level scoring is unavailable for this assessment.</p>
                )}
                <p className="teacher-leaderboard-note">Averages include students with detailed section scores. Older summary-only results remain visible as data unavailable.</p>
              </div>
            </details>
          ))}
          {!classAssessmentInsights.length && <p className="teacher-empty-state">No completed tests yet.</p>}
        </div>
      </section>

      <section className="teacher-panel" id="assessments">
        <div className="teacher-panel-header"><div><span>Assignments</span><h2>Exam access, sessions, and forms</h2></div><p>Open or lock each exam, split sections, and assign Reading Comprehension passage forms in real time.</p></div>
        <div className="teacher-assessment-list">
          {assessments.map((assessment) => {
            const classResult = assessmentAverages.get(assessment.id);
            const formDraft = formDrafts[assessment.id];
            const isFormEditorOpen = openFormEditorId === assessment.id;
            const passageTitleById = new Map(assessment.passages.map((passage) => [passage.id, passage.title]));
            return <article className="teacher-assessment-card" key={assessment.id}>
              <div><span className={`status-pill status-pill-${assessment.status}`}>{assessment.status}</span><small>{assessment.split ? "Split · 2 sessions" : "Continuous · 1 session"}</small><small>{assessment.durationMinutes} min</small></div>
              <h3>{assessment.title}</h3><p>{assessment.description || "No description yet."}</p>
              <dl><div><dt>Passages</dt><dd>{assessment.passages.length}</dd></div><div><dt>Questions</dt><dd>{assessment.questions.length}</dd></div><div><dt>Class average</dt><dd>{classResult ? `${classResult.average}%` : "—"}</dd></div><div><dt>Submissions</dt><dd>{classResult?.submissions ?? 0}</dd></div></dl>
              <div className="teacher-assessment-actions">
                <button disabled={savingStatusId === assessment.id} type="button" onClick={() => handleToggleAssessment(assessment)}>{assessment.status === "open" ? "Lock exam" : "Open exam"}</button>
                <button className="is-secondary" disabled={savingStatusId === assessment.id} type="button" onClick={() => handleToggleSplit(assessment)}>{assessment.split ? "Make one session" : "Split English / Math"}</button>
                <button className="is-secondary teacher-form-toggle" disabled={!assessment.passages.length} type="button" onClick={() => openFormEditor(assessment)}><Shuffle size={15} /> {isFormEditorOpen ? "Close form assignments" : "Assign passage forms"}</button>
                <button className="is-secondary teacher-answer-key-toggle" type="button" onClick={() => setOpenAnswerKeyId((current) => current === assessment.id ? "" : assessment.id)}>{openAnswerKeyId === assessment.id ? "Close answer key" : "View answer key"}</button>
              </div>
              {openAnswerKeyId === assessment.id && <ExamAnswerKey assessment={assessment} />}
              {isFormEditorOpen && formDraft ? <section className="teacher-form-editor" aria-label={`${assessment.title} passage forms`}>
                <header>
                  <div><strong>Reading passage-order forms</strong><small>Only Reading Comprehension passages move. Passage-based Part A, stand-alone Part B, and Math remain fixed.</small></div>
                  <button className="is-secondary" onClick={() => regenerateForms(assessment)} type="button"><Shuffle size={14} /> Regenerate</button>
                </header>
                <div className="teacher-form-order-list">
                  {formDraft.forms.map((form) => <article key={form.id}>
                    <strong>{form.label}</strong>
                    <ol>{form.passageOrder.map((passageId) => <li key={passageId}>{passageTitleById.get(passageId) ?? labelFromSlug(passageId)}</li>)}</ol>
                  </article>)}
                </div>
                <div className="teacher-form-roster">
                  <div className="teacher-form-roster-head"><strong>Student</strong><strong>Assigned form</strong></div>
                  {shsatStudents.map((student) => <label key={student.id}>
                    <span><strong>{student.fullName}</strong><small>{student.username}</small></span>
                    <select aria-label={`Form for ${student.fullName}`} onChange={(event) => assignStudentForm(assessment.id, student.id, event.target.value)} value={formDraft.assignments[student.id] ?? ""}>
                      <option value="">Default passage order</option>
                      {formDraft.forms.map((form) => <option key={form.id} value={form.id}>{form.label}</option>)}
                    </select>
                  </label>)}
                  {!shsatStudents.length ? <p className="teacher-empty-state">No SHSAT students are available to assign.</p> : null}
                </div>
                <button className="teacher-form-save" disabled={savingFormsId === assessment.id || !formDraft.forms.length} onClick={() => handleSaveForms(assessment)} type="button">{savingFormsId === assessment.id ? "Saving forms…" : "Save live assignments"}</button>
              </section> : null}
            </article>;
          })}
        </div>
      </section>
    </CorporateDashboardShell>
  );
}
