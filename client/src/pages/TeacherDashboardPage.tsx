import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Activity, ArrowLeft, ArrowUpRight, BarChart3, BookOpen, CheckCircle2, ChevronDown, ClipboardList, Clock3, Eye, LayoutDashboard, Pencil, PlusCircle, RotateCcw, Shuffle, Trash2, UserRoundCheck, UserRoundPlus, Users, X } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { resolveExamContent, type ExamQuestion } from "../content/exams";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import {
  getTeacherAssessments,
  getTeacherClassJoinRequests,
  getTeacherStudentProgress,
  createTeacherManualExamResult,
  deleteStudentAccount,
  reviewTeacherClassJoinRequest,
  updateStudentAccount,
  updateTeacherAssessmentCompletedAccess,
  updateTeacherAssessmentSectionAccess,
  updateTeacherAssessmentStatus,
  updateTeacherAssessmentForms,
  type AssessmentSection,
  type AssessmentStatus,
  type ManualExamScoreInput,
  type StudentProgressSnapshot,
  type TeacherClassJoinRequest,
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
import { resetExamTimer } from "../lib/examTimer";
import {
  cacheTeacherDashboard,
  getCachedTeacherDashboard,
  peekActiveSession,
} from "../lib/sessionCache";
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

function studentExamResultsForAssessments(
  student: StudentProgressSnapshot,
  assessments: TeacherAssessment[],
) {
  const assessmentIds = new Set(assessments.map((assessment) => assessment.id));
  return student.progress.examResults.filter(
    (result) =>
      result.source === "manual" ||
      (typeof result.assessmentId === "string" && assessmentIds.has(result.assessmentId)),
  );
}

function isCompleteExamResult(result: Record<string, unknown>) {
  return result.completionStatus !== "english_complete" && result.completionStatus !== "math_complete";
}

function examResultStatusLabel(result: Record<string, unknown>) {
  if (result.completionStatus === "english_complete") return "English submitted · Math pending";
  if (result.completionStatus === "math_complete") return "Math submitted · English pending";
  return "Complete";
}

function studentAssessmentAverage(
  student: StudentProgressSnapshot,
  assessments: TeacherAssessment[],
) {
  const percentages = studentExamResultsForAssessments(student, assessments).flatMap((result) =>
    isCompleteExamResult(result) && typeof result.percentage === "number" ? [result.percentage] : [],
  );
  return percentages.length
    ? Math.round(percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length)
    : null;
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

function resolveOriginalExamContent(assessment: TeacherAssessment) {
  return resolveExamContent({ ...assessment, passageOrder: undefined });
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
  const originalPassageOrder = assessment
    ? new Map(
      resolveOriginalExamContent(assessment).passageSets.flatMap((passageSet, index) => [
        [passageSet.id, index] as const,
        [passageSet.passage.id, index] as const,
      ]),
    )
    : null;
  const normalizePassageOrder = (passages: ExamPassageResult[]) =>
    originalPassageOrder
      ? [...passages].sort(
        (left, right) =>
          (originalPassageOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
          (originalPassageOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER),
      )
      : passages;
  const answers = selectedAnswersFromResult(result);
  if ((!storedSubjects.length || !storedPassages.length) && assessment && answers) {
    const completedSections = Array.isArray(result.completedSections)
      ? result.completedSections.filter(
        (section): section is "english" | "math" => section === "english" || section === "math",
      )
      : result.completionStatus === "english_complete"
        ? ["english" as const]
        : result.completionStatus === "math_complete"
          ? ["math" as const]
        : ["english" as const, "math" as const];
    const recalculated = createExamResult(resolveOriginalExamContent(assessment), answers, completedSections);
    return {
      passages: normalizePassageOrder(storedPassages.length ? storedPassages : recalculated.passages),
      subjects: storedSubjects.length ? storedSubjects : recalculated.subjects,
    };
  }
  return { passages: normalizePassageOrder(storedPassages), subjects: storedSubjects };
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
  if ((kind === "english" || kind === "passage") && result.completionStatus === "math_complete") {
    return "English pending";
  }
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
  if (question.type === "graph_point_select") {
    return (question.correctPointIds ?? []).map((pointId) => {
      const point = question.graph?.points.find((candidate) => candidate.id === pointId);
      return point ? `(${point.x}, ${point.y})` : pointId;
    }).join("; ") || "—";
  }
  if (question.type === "math_drag_drop") {
    return (question.dragDropSlots ?? []).map((slot) => {
      const item = question.items?.find((candidate) => candidate.id === slot.correctItemId);
      return `${slot.id}: ${item?.text ?? slot.correctItemId}`;
    }).join("; ") || "—";
  }
  if (question.type === "number_line_response") {
    const response = question.numberLineResponse;
    return response ? `${response.correctDirection} ray, ${response.correctEndpoint} at ${response.correctValue}` : "—";
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
    if (question.type === "graph_point_select") {
      return answer.map((pointId) => {
        const point = question.graph?.points.find((candidate) => candidate.id === String(pointId));
        return point ? `(${point.x}, ${point.y})` : String(pointId);
      }).join("; ") || "Blank";
    }
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
    if (question.type === "math_drag_drop") {
      return Object.entries(values).map(([slotId, itemId]) => {
        const item = question.items?.find((candidate) => candidate.id === itemId);
        return `${slotId}: ${item?.text ?? itemId}`;
      }).join("; ") || "Blank";
    }
    if (question.type === "number_line_response") {
      return values.direction && values.endpoint && values.value !== undefined
        ? `${values.direction} ray, ${values.endpoint} at ${values.value}`
        : "Blank";
    }
  }
  return "Blank";
}

function ExamAnswerKey({ assessment }: { assessment: TeacherAssessment }) {
  const examContent = resolveOriginalExamContent(assessment);
  const englishQuestions = [
    ...examContent.passageSets.flatMap((passageSet) => passageSet.questions),
    ...(examContent.standaloneSection?.questions ?? []),
  ];
  const mathQuestions = examContent.mathSection?.questions ?? [];
  const sections = [
    { label: "English", questions: englishQuestions },
    { label: "Math", questions: mathQuestions },
  ];

  return (
    <section className="teacher-answer-key-sheet" aria-label={`${assessment.title} answer key`}>
      {sections.map((section) => (
        <section className="teacher-answer-key-section" key={section.label}>
          <header><h4>{section.label}</h4><span>{section.questions.length} questions</span></header>
          <div className="teacher-answer-key-grid">
            {section.questions.map((question, index) => (
              <div className="teacher-answer-key-item" key={question.id}>
                <strong>{index + 1}</strong>
                <b>{correctAnswerLabel(question)}</b>
              </div>
            ))}
          </div>
          {!section.questions.length && <p className="teacher-empty-state">No {section.label.toLowerCase()} questions.</p>}
        </section>
      ))}
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

type TeacherWorkspace = "overview" | "students" | "accounts" | "assessments" | "enrollment";

function getTeacherWorkspace(pathname: string): TeacherWorkspace {
  if (pathname.startsWith("/teacher/students")) return "students";
  if (pathname.startsWith("/teacher/accounts")) return "accounts";
  if (pathname.startsWith("/teacher/enrollment")) return "enrollment";
  if (pathname.startsWith("/teacher/insights")) return "assessments";
  if (pathname.startsWith("/teacher/assessments")) return "assessments";
  return "overview";
}

function getInsightAssessmentId(pathname: string) {
  const encodedId = pathname.split("/").filter(Boolean)[2];
  if (!encodedId) return "";
  try {
    return decodeURIComponent(encodedId);
  } catch {
    return encodedId;
  }
}

function getStudentPreviewHref(student: StudentProgressSnapshot) {
  const params = new URLSearchParams({
    preview: "student",
    returnTo: "/teacher/accounts",
    studentId: student.id,
    studentName: student.fullName,
    teacherTools: "1",
  });
  return `/dashboard?${params.toString()}`;
}

function getTeacherExamPreviewHref(assessmentId: string) {
  const params = new URLSearchParams({
    preview: "teacher",
    returnTo: "/teacher/assessments",
    studentName: "Teacher Preview",
    teacherTools: "1",
  });
  return `/exam/${encodeURIComponent(assessmentId)}/session?${params.toString()}`;
}

type PaperScoreDraft = Record<
  "englishCorrect" | "englishTotal" | "mathCorrect" | "mathTotal" | "title",
  string
> & { completedDate: string };

function createPaperScoreDraft(): PaperScoreDraft {
  return {
    completedDate: new Date().toISOString().slice(0, 10),
    englishCorrect: "",
    englishTotal: "",
    mathCorrect: "",
    mathTotal: "",
    title: "",
  };
}

function StudentDetail({
  assessments,
  onAddPaperScore,
  student,
}: {
  assessments: TeacherAssessment[];
  onAddPaperScore: (studentId: string, input: ManualExamScoreInput) => Promise<void>;
  student: StudentProgressSnapshot;
}) {
  const [paperScoreDraft, setPaperScoreDraft] = useState<PaperScoreDraft>(createPaperScoreDraft);
  const [paperScoreMessage, setPaperScoreMessage] = useState("");
  const [isSavingPaperScore, setIsSavingPaperScore] = useState(false);
  const assessmentIds = new Set(assessments.map((assessment) => assessment.id));
  const examResults = studentExamResultsForAssessments(student, assessments);
  const resultPercentages = examResults.flatMap((result) =>
    isCompleteExamResult(result) && typeof result.percentage === "number" ? [result.percentage] : [],
  );
  const averageTestScore = resultPercentages.length
    ? Math.round(resultPercentages.reduce((sum, percentage) => sum + percentage, 0) / resultPercentages.length)
    : null;
  const bestTestScore = resultPercentages.length ? Math.max(...resultPercentages) : null;
  const responseRecords = new Map<string, {
    answers: Record<string, unknown>;
    status: string;
    updatedAt: string | null;
  }>();
  examResults.forEach((result) => {
    if (typeof result.assessmentId !== "string") return;
    if (result.source === "manual") return;
    const answers =
      result.answers && typeof result.answers === "object" && !Array.isArray(result.answers)
        ? result.answers as Record<string, unknown>
        : {};
    responseRecords.set(result.assessmentId, {
      answers,
      status: examResultStatusLabel(result),
      updatedAt: typeof result.completedAt === "string" ? result.completedAt : null,
    });
  });

  async function handleAddPaperScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingPaperScore(true);
    setPaperScoreMessage("");
    try {
      await onAddPaperScore(student.id, {
        completedDate: paperScoreDraft.completedDate,
        englishCorrect: Number(paperScoreDraft.englishCorrect),
        englishTotal: Number(paperScoreDraft.englishTotal),
        mathCorrect: Number(paperScoreDraft.mathCorrect),
        mathTotal: Number(paperScoreDraft.mathTotal),
        title: paperScoreDraft.title.trim(),
      });
      setPaperScoreDraft(createPaperScoreDraft());
      setPaperScoreMessage("Paper exam score added to this student's results.");
    } catch (error) {
      setPaperScoreMessage(error instanceof Error ? error.message : "Could not save the paper exam score.");
    } finally {
      setIsSavingPaperScore(false);
    }
  }
  Object.entries(student.examSessions ?? {}).forEach(([assessmentId, session]) => {
    if (!assessmentIds.has(assessmentId)) return;
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
        <article><span>Test average</span><strong>{averageTestScore === null ? "—" : `${averageTestScore}%`}</strong></article>
        <article><span>Best score</span><strong>{bestTestScore === null ? "—" : `${bestTestScore}%`}</strong></article>
        <article><span>Tests completed</span><strong>{examResults.filter(isCompleteExamResult).length}</strong></article>
        <article><span>Practice accuracy</span><strong>{student.insights.practiceAccuracy === null ? "—" : `${student.insights.practiceAccuracy}%`}</strong></article>
      </div>
      <details className="teacher-paper-score-entry">
        <summary>
          <span><PlusCircle size={17} /><span><strong>Add paper exam score</strong><small>Record English and Math points for an offline test.</small></span></span>
        </summary>
        <form onSubmit={handleAddPaperScore}>
          <label>Exam title<input required value={paperScoreDraft.title} onChange={(event) => setPaperScoreDraft((current) => ({ ...current, title: event.target.value }))} /></label>
          <label>Test date<input required type="date" value={paperScoreDraft.completedDate} onChange={(event) => setPaperScoreDraft((current) => ({ ...current, completedDate: event.target.value }))} /></label>
          <fieldset>
            <legend>English</legend>
            <label>Correct<input min="0" required step="1" type="number" value={paperScoreDraft.englishCorrect} onChange={(event) => setPaperScoreDraft((current) => ({ ...current, englishCorrect: event.target.value }))} /></label>
            <label>Out of<input min="1" required step="1" type="number" value={paperScoreDraft.englishTotal} onChange={(event) => setPaperScoreDraft((current) => ({ ...current, englishTotal: event.target.value }))} /></label>
          </fieldset>
          <fieldset>
            <legend>Math</legend>
            <label>Correct<input min="0" required step="1" type="number" value={paperScoreDraft.mathCorrect} onChange={(event) => setPaperScoreDraft((current) => ({ ...current, mathCorrect: event.target.value }))} /></label>
            <label>Out of<input min="1" required step="1" type="number" value={paperScoreDraft.mathTotal} onChange={(event) => setPaperScoreDraft((current) => ({ ...current, mathTotal: event.target.value }))} /></label>
          </fieldset>
          <button disabled={isSavingPaperScore} type="submit">{isSavingPaperScore ? "Saving score…" : "Add to student results"}</button>
          {paperScoreMessage ? <p>{paperScoreMessage}</p> : null}
        </form>
      </details>
      <h3 className="teacher-detail-heading">Test history</h3>
      <div className="teacher-results-table" role="table" aria-label={`${student.fullName} test history`}>
        <div className="teacher-results-row teacher-results-head" role="row"><span>Assessment</span><span>Date</span><span>Score</span><span>Correct</span></div>
        {examResults.map((result, index) => {
          const assessmentId = examValue(result, "assessmentId", "");
          const assessment = assessments.find((candidate) => candidate.id === assessmentId);
          return (
            <article className="teacher-result-entry" key={`${assessmentId}-${index}`}>
              <div className="teacher-results-row" role="row">
                <strong>{examValue(result, "title", assessment?.title ?? (assessmentId || "Assessment"))}<small>{result.source === "manual" ? "Paper score · Teacher entered" : examResultStatusLabel(result)}</small></strong>
                <span>{typeof result.completedAt === "string" ? formatDate(result.completedAt) : "—"}</span>
                <strong>{examValue(result, "percentage")}%</strong>
                <span>{examValue(result, "correct")} / {examValue(result, "total")}{questionTypeSummary(result).map((item) => <small key={item.label}>{item.label}: {item.correct}/{item.total}</small>)}</span>
              </div>
              <SectionScoreBreakdown assessment={assessment} result={result} />
            </article>
          );
        })}
        {!examResults.length && <p className="teacher-empty-state">No test results recorded yet.</p>}
      </div>
      <h3 className="teacher-detail-heading">Saved student answers</h3>
      <div className="teacher-response-list">
        {Array.from(responseRecords, ([assessmentId, record]) => {
          const assessment = assessments.find((candidate) => candidate.id === assessmentId);
          const questions = assessment ? getAllExamQuestions(resolveOriginalExamContent(assessment)) : [];
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
  const initialSession = peekActiveSession();
  const initialDashboardCache = initialSession
    ? getCachedTeacherDashboard(initialSession.user.id)
    : null;
  const [accessToken, setAccessToken] = useState("");
  const [assessments, setAssessments] = useState<TeacherAssessment[]>(
    initialDashboardCache?.assessments ?? [],
  );
  const [students, setStudents] = useState<StudentProgressSnapshot[]>(
    initialDashboardCache?.students ?? [],
  );
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(
    isSupabaseConfigured && !initialDashboardCache,
  );
  const [message, setMessage] = useState("");
  const [classJoinRequests, setClassJoinRequests] = useState<TeacherClassJoinRequest[]>([]);
  const [savingClassRequestKey, setSavingClassRequestKey] = useState("");
  const [savingStatusId, setSavingStatusId] = useState("");
  const [savingCompletedAccessId, setSavingCompletedAccessId] = useState("");
  const [savingSectionAccessKey, setSavingSectionAccessKey] = useState("");
  const [savingAccountId, setSavingAccountId] = useState("");
  const [savingFormsId, setSavingFormsId] = useState("");
  const [openFormEditorId, setOpenFormEditorId] = useState("");
  const [openAnswerKeyId, setOpenAnswerKeyId] = useState("");
  const [formDrafts, setFormDrafts] = useState<Record<string, FormDraft>>({});
  const [editingStudentAccountId, setEditingStudentAccountId] = useState("");
  const [studentAccountDraft, setStudentAccountDraft] = useState({ fullName: "", password: "", username: "" });
  const [teacherName, setTeacherName] = useState("Teacher");
  const [teacherUserId, setTeacherUserId] = useState(initialSession?.user.id ?? "");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    async function loadTeacherDashboard() {
      const { data } = await getSupabaseClient().auth.getSession();
      if (!data.session) { window.location.assign("/login"); return; }
      const userRole = getUserRole(data.session.user);
      const metadata = data.session.user.user_metadata as { full_name?: string; name?: string };
      setTeacherName(metadata.full_name ?? metadata.name ?? "Teacher");
      if (userRole !== "teacher") { window.location.assign(getDashboardPath(userRole)); return; }
      setTeacherUserId(data.session.user.id);
      setAccessToken(data.session.access_token);
      const cachedDashboard = getCachedTeacherDashboard(data.session.user.id);
      if (cachedDashboard) {
        setAssessments(cachedDashboard.assessments);
        setStudents(cachedDashboard.students);
        setIsCheckingSession(false);
      }
      try {
        const [nextAssessments, nextStudents, nextClassJoinRequests] = await Promise.all([
          getTeacherAssessments(data.session.access_token),
          getTeacherStudentProgress(data.session.access_token),
          getTeacherClassJoinRequests(data.session.access_token),
        ]);
        setAssessments(nextAssessments);
        setStudents(nextStudents);
        setClassJoinRequests(nextClassJoinRequests);
        cacheTeacherDashboard(data.session.user.id, nextAssessments, nextStudents);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load the teacher dashboard.");
      } finally { setIsCheckingSession(false); }
    }
    loadTeacherDashboard();
  }, []);

  useEffect(() => {
    if (!teacherUserId || isCheckingSession) return;
    cacheTeacherDashboard(teacherUserId, assessments, students);
  }, [assessments, isCheckingSession, students, teacherUserId]);

  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const shsatStudents = useMemo(() => students.filter((student) => student.classes.includes("shsat")), [students]);
  const classAverage = useMemo(() => {
    const assessmentIds = new Set(assessments.map((assessment) => assessment.id));
    const values = students.flatMap((student) =>
      student.progress.examResults.flatMap((result) =>
        typeof result.assessmentId === "string" &&
        (assessmentIds.has(result.assessmentId) || result.source === "manual") &&
        isCompleteExamResult(result) &&
        typeof result.percentage === "number"
          ? [result.percentage]
          : [],
      ),
    );
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
  }, [assessments, students]);
  const assessmentAverages = useMemo(() => {
    const grouped = new Map<string, { scores: number[]; title: string }>();
    shsatStudents.forEach((student) => {
      student.progress.examResults.forEach((result) => {
        const assessmentId = examValue(result, "assessmentId", "unknown");
        const percentage = typeof result.percentage === "number" ? result.percentage : null;
        if (percentage === null || !isCompleteExamResult(result)) return;
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
    return currentAssessmentIds.map((assessmentId) => {
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
        resolveOriginalExamContent(assessment).passageSets.forEach((passageSet, index) => {
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

  async function handleAddPaperScore(studentId: string, input: ManualExamScoreInput) {
    if (!accessToken) throw new Error("Teacher access is unavailable. Refresh and try again.");
    const result = await createTeacherManualExamResult(accessToken, studentId, input);
    setStudents((current) => current.map((student) => student.id === studentId
      ? {
          ...student,
          progress: {
            ...student.progress,
            examResults: [
              result,
              ...student.progress.examResults.filter(
                (candidate) => candidate.assessmentId !== result.assessmentId,
              ),
            ],
          },
        }
      : student));
  }

  async function handleToggleAssessment(assessment: TeacherAssessment) {
    if (!accessToken) return;
    const allSectionsOpen = assessment.sectionAccess.english && assessment.sectionAccess.math;
    const nextStatus: AssessmentStatus = allSectionsOpen ? "locked" : "open";
    setSavingStatusId(assessment.id); setMessage("");
    try {
      const updated = await updateTeacherAssessmentStatus(accessToken, assessment.id, nextStatus);
      setAssessments((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMessage(`${updated.title} is now ${updated.status}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update the assessment."); }
    finally { setSavingStatusId(""); }
  }

  async function handleToggleSectionAccess(
    assessment: TeacherAssessment,
    section: AssessmentSection,
  ) {
    if (!accessToken) return;
    const savingKey = `${assessment.id}:${section}`;
    setSavingSectionAccessKey(savingKey);
    setMessage("");
    try {
      const updated = await updateTeacherAssessmentSectionAccess(
        accessToken,
        assessment.id,
        section,
        !assessment.sectionAccess[section],
      );
      setAssessments((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMessage(
        `${section === "english" ? "English" : "Math"} is now ${updated.sectionAccess[section] ? "open" : "locked"} for ${updated.title}.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update section access.");
    } finally {
      setSavingSectionAccessKey("");
    }
  }

  async function handleToggleCompletedAccess(assessment: TeacherAssessment) {
    if (!accessToken) return;
    setSavingCompletedAccessId(assessment.id); setMessage("");
    try {
      const updated = await updateTeacherAssessmentCompletedAccess(
        accessToken,
        assessment.id,
        !assessment.allowCompletedAccess,
      );
      setAssessments((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMessage(
        updated.allowCompletedAccess
          ? `Completed students can now reopen ${updated.title} while it is open.`
          : `Completed access is off for ${updated.title}.`,
      );
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update completed access."); }
    finally { setSavingCompletedAccessId(""); }
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

  async function handleClassJoinRequest(request: TeacherClassJoinRequest, action: "approve" | "reject") {
    if (!accessToken) return;
    const requestKey = `${request.studentId}:${request.classroom.id}`;
    setSavingClassRequestKey(requestKey);
    setMessage("");
    try {
      await reviewTeacherClassJoinRequest(accessToken, request.studentId, request.classroom.id, action);
      setClassJoinRequests((current) => current.filter((item) => `${item.studentId}:${item.classroom.id}` !== requestKey));
      if (action === "approve") {
        const nextStudents = await getTeacherStudentProgress(accessToken);
        setStudents(nextStudents);
      }
      setMessage(action === "approve"
        ? `${request.studentName} can now access ${request.classroom.name}.`
        : `${request.studentName}'s ${request.classroom.name} request was declined.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not review the class request.");
    } finally {
      setSavingClassRequestKey("");
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
    { icon: CheckCircle2, label: "Tests completed", value: String(students.reduce((sum, student) => sum + studentExamResultsForAssessments(student, assessments).filter(isCompleteExamResult).length, 0)) },
    { icon: BookOpen, label: "Open exams", value: String(assessments.filter((assessment) => assessment.status === "open").length) },
  ];
  const activeWorkspace = getTeacherWorkspace(window.location.pathname);
  const insightAssessmentId = getInsightAssessmentId(window.location.pathname);
  const selectedClassInsight = classAssessmentInsights.find((insight) => insight.assessmentId === insightAssessmentId);
  const navItems = [
    { id: "overview", label: "Overview", href: "/teacher", icon: LayoutDashboard },
    { id: "students", label: "Student progress", href: "/teacher/students", icon: Activity },
    { id: "enrollment", label: "Class requests", href: "/teacher/enrollment", icon: UserRoundCheck },
    { id: "accounts", label: "Student accounts", href: "/teacher/accounts", icon: UserRoundPlus },
    { id: "assessments", label: "Assessments & insights", href: "/teacher/assessments", icon: ClipboardList },
  ];
  const workspaceCopy = {
    overview: {
      description: "A focused snapshot of SHSAT enrollment, activity, scores, and open exams.",
      eyebrow: "Teacher dashboard",
      icon: LayoutDashboard,
      title: "Workspace overview",
    },
    students: {
      description: "Open any student record to review test history, saved answers, and practice progress.",
      eyebrow: "Student progress",
      icon: Activity,
      title: "SHSAT student progress",
    },
    accounts: {
      description: "Manage student credentials and open the exact student experience for any account.",
      eyebrow: "Account access",
      icon: UserRoundPlus,
      title: "Student accounts",
    },
    enrollment: {
      description: "Review classroom-code requests before students receive access.",
      eyebrow: "Enrollment approval",
      icon: UserRoundCheck,
      title: "Class requests",
    },
    assessments: {
      description: selectedClassInsight
        ? "Section performance, passage rankings, and the complete class roster for this exam."
        : "Control exam access, forms, answer keys, class averages, and performance from one place.",
      eyebrow: selectedClassInsight ? "Assessment performance" : "Assessment command center",
      icon: ClipboardList,
      title: selectedClassInsight?.title ?? "Assessments & insights",
    },
  }[activeWorkspace];
  const WorkspaceIcon = workspaceCopy.icon;

  return (
    <CorporateDashboardShell activeId={activeWorkspace} enableAccountSwitcher navItems={navItems} onSignOut={handleSignOut} profileName={teacherName} profileRole="Teacher account">
      <header className="staff-page-heading corporate-page-heading">
        <div><p><WorkspaceIcon size={15} /> {workspaceCopy.eyebrow}</p><h1>{workspaceCopy.title}</h1><span>{workspaceCopy.description}</span></div>
        {selectedClassInsight ? (
          <AppLink className="corporate-heading-action" href="/teacher/assessments"><ArrowLeft size={15} /> All assessments</AppLink>
        ) : activeWorkspace === "overview" ? (
          <AppLink className="corporate-heading-action" href="/teacher/accounts">Open student views <ArrowUpRight size={15} /></AppLink>
        ) : null}
      </header>

      {message && <p className="teacher-message corporate-message">{message}</p>}

      {activeWorkspace === "overview" ? (
        <>
          <section className="staff-kpi-grid" aria-label="Analytics summary">
            {teacherStats.map(({ icon: Icon, label, value }) => <article key={label}><span><Icon size={19} /></span><div><p>{label}</p><strong>{value}</strong></div><em>Live student data</em></article>)}
          </section>
          <section className="teacher-panel teacher-workspace-panel">
            <div className="teacher-panel-header"><div><span>Workspaces</span><h2>Choose where to work</h2></div><p>Each area now opens as its own page.</p></div>
            <div className="teacher-workspace-grid">
              <AppLink href="/teacher/students"><Activity size={20} /><span><strong>Student progress</strong><small>{shsatStudents.length} SHSAT student{shsatStudents.length === 1 ? "" : "s"}</small></span><ArrowUpRight size={17} /></AppLink>
              <AppLink href="/teacher/enrollment"><UserRoundCheck size={20} /><span><strong>Class requests</strong><small>{classJoinRequests.length} awaiting approval</small></span><ArrowUpRight size={17} /></AppLink>
              <AppLink href="/teacher/accounts"><UserRoundPlus size={20} /><span><strong>Student accounts</strong><small>Edit access or preview an account</small></span><ArrowUpRight size={17} /></AppLink>
              <AppLink href="/teacher/assessments"><ClipboardList size={20} /><span><strong>Assessments & insights</strong><small>{assessments.length} exam{assessments.length === 1 ? "" : "s"} · {classAssessmentInsights.length} performance dashboard{classAssessmentInsights.length === 1 ? "" : "s"}</small></span><ArrowUpRight size={17} /></AppLink>
            </div>
          </section>
        </>
      ) : null}

      {activeWorkspace === "students" ? (
      <section className="teacher-panel teacher-roster-panel" id="students">
          <div className="teacher-panel-header"><div><span>Roster</span><h2>SHSAT student progress</h2></div><p>Tap a student to open their record here.</p></div>
          <div className="teacher-student-list">
            {shsatStudents.map((student) => {
              const isOpen = student.id === selectedStudent?.id;
              const studentAverage = studentAssessmentAverage(student, assessments);
              return <div className={`teacher-student-entry${isOpen ? " is-open" : ""}`} key={student.id}>
              <button aria-expanded={isOpen} onClick={() => setSelectedStudentId(isOpen ? "" : student.id)} type="button">
                <span className="teacher-student-avatar">{student.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                <span><strong>{student.fullName}</strong><small>{student.email}</small><small>Last login: {formatDate(student.lastLoginAt)}</small></span>
                <span className="teacher-score-badge">{studentAverage === null ? "—" : `${studentAverage}%`}<small>avg.</small></span>
                <ChevronDown className="teacher-roster-chevron" size={18} />
              </button>
              {isOpen && <StudentDetail assessments={assessments} onAddPaperScore={handleAddPaperScore} student={student} />}
              </div>;
            })}
            {!shsatStudents.length && <p className="teacher-empty-state">No students are enrolled in SHSAT yet.</p>}
          </div>

      </section>
      ) : null}

      {activeWorkspace === "enrollment" ? (
        <section className="teacher-panel teacher-enrollment-panel" id="class-requests">
          <div className="teacher-panel-header"><div><span>Teacher approval</span><h2>Pending class requests</h2></div><p>Students stay outside the class until you approve their request.</p></div>
          <div className="teacher-enrollment-list">
            {classJoinRequests.map((request) => {
              const requestKey = `${request.studentId}:${request.classroom.id}`;
              const isSaving = savingClassRequestKey === requestKey;
              return <article key={requestKey}>
                <span className="teacher-student-avatar">{request.studentName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                <div><strong>{request.studentName}</strong><small>@{request.studentUsername} · {request.studentEmail}</small><span><Clock3 size={13} /> Requested {formatDate(request.requestedAt)}</span></div>
                <b>{request.classroom.name}</b>
                <div className="teacher-enrollment-actions"><button className="is-approve" disabled={isSaving} onClick={() => handleClassJoinRequest(request, "approve")} type="button"><CheckCircle2 size={15} /> {isSaving ? "Saving…" : "Approve"}</button><button className="is-reject" disabled={isSaving} onClick={() => handleClassJoinRequest(request, "reject")} type="button"><X size={15} /> Decline</button></div>
              </article>;
            })}
            {!classJoinRequests.length ? <div className="teacher-enrollment-empty"><CheckCircle2 size={24} /><strong>No requests waiting</strong><p>New classroom-code requests will appear here.</p></div> : null}
          </div>
        </section>
      ) : null}

      {activeWorkspace === "accounts" ? (
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
            {shsatStudents.length ? shsatStudents.map((student) => <article key={student.id}><span>{student.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span><div><strong>{student.fullName}</strong><small>Username: {student.username}</small><small>Email: {student.email}</small></div><div className="admin-account-actions"><AppLink className="teacher-student-view-link" href={getStudentPreviewHref(student)}><Eye size={14} /> View as student</AppLink><button disabled={savingAccountId === student.id} onClick={() => beginEditingStudentAccount(student)} type="button"><Pencil size={14} /> Edit</button><button className="is-danger" disabled={savingAccountId === student.id} onClick={() => handleDeleteStudentAccount(student)} type="button"><Trash2 size={14} /> Delete</button></div></article>) : <p>No SHSAT student accounts found.</p>}
          </div>
        </div>
      </section>
      ) : null}

      {activeWorkspace === "assessments" && insightAssessmentId ? (
        selectedClassInsight ? (
          <section className="teacher-insight-studio" aria-label={`${selectedClassInsight.title} Insight Studio`}>
            <div className="teacher-insight-studio-hero">
              <div><span>Live class performance</span><h2>{selectedClassInsight.title}</h2><p>Every SHSAT student is shown. Rankings use percent accuracy, and tied scores share a rank.</p></div>
              <div className="teacher-insight-studio-metrics">
                <span><small>Submissions</small><strong>{selectedClassInsight.submissions}</strong></span>
                <span><small>Overall</small><strong>{selectedClassInsight.overallAverage === null ? "—" : `${selectedClassInsight.overallAverage}%`}</strong></span>
                <span><small>English</small><strong>{selectedClassInsight.english.average === null ? "—" : `${selectedClassInsight.english.average}%`}</strong></span>
                <span><small>Math</small><strong>{selectedClassInsight.math.average === null ? "—" : `${selectedClassInsight.math.average}%`}</strong></span>
              </div>
            </div>
            <div className="teacher-leaderboard-grid teacher-section-leaderboards">
              <ClassScoreLeaderboardCard leaderboard={selectedClassInsight.english} subtitle="Section ranking" />
              <ClassScoreLeaderboardCard leaderboard={selectedClassInsight.math} subtitle="Section ranking" />
            </div>
            {selectedClassInsight.passages.length ? (
              <section className="teacher-passage-leaderboards" aria-label={`${selectedClassInsight.title} passage rankings`}>
                <header><div><span>English detail</span><h3>Passage leaderboards</h3></div><p>Class average and complete roster for each passage.</p></header>
                <div className="teacher-leaderboard-grid">
                  {selectedClassInsight.passages.map((leaderboard, passageIndex) => (
                    <ClassScoreLeaderboardCard key={leaderboard.id} leaderboard={leaderboard} subtitle={`Passage ${passageIndex + 1}`} />
                  ))}
                </div>
              </section>
            ) : (
              <p className="teacher-leaderboard-note">Passage-level scoring is unavailable for this assessment.</p>
            )}
            <p className="teacher-leaderboard-note">Averages include students with detailed section scores. Older summary-only results remain visible as data unavailable.</p>
          </section>
        ) : (
          <section className="teacher-panel teacher-insight-not-found"><h2>Performance dashboard not found</h2><p>This exam may not have any completed submissions yet.</p><AppLink href="/teacher/assessments"><ArrowLeft size={15} /> Return to assessments</AppLink></section>
        )
      ) : null}

      {activeWorkspace === "assessments" && !insightAssessmentId ? (
      <section className="teacher-assessments-hub" id="assessments">
        <div className="teacher-assessment-command-bar">
          <div><span>Live assessment operations</span><h2>One exam. One control center.</h2><p>Manage student access and see class performance without switching workspaces.</p></div>
          <div>
            <span><small>Exams</small><strong>{assessments.length}</strong></span>
            <span><small>Open now</small><strong>{assessments.filter((assessment) => assessment.status === "open").length}</strong></span>
            <span><small>Submissions</small><strong>{classAssessmentInsights.reduce((sum, insight) => sum + insight.submissions, 0)}</strong></span>
            <span><small>Class avg.</small><strong>{classAverage === null ? "—" : `${classAverage}%`}</strong></span>
          </div>
        </div>
        <div className="teacher-panel teacher-assessment-management-panel">
        <div className="teacher-panel-header"><div><span>Exam management</span><h2>Assessment library</h2></div><p>Open or lock each one-session exam, manage completed access, forms, answer keys, and performance.</p></div>
        <div className="teacher-assessment-list">
          {assessments.map((assessment) => {
            const classResult = assessmentAverages.get(assessment.id);
            const assessmentInsight = classAssessmentInsights.find((insight) => insight.assessmentId === assessment.id);
            const formDraft = formDrafts[assessment.id];
            const isFormEditorOpen = openFormEditorId === assessment.id;
            const passageTitleById = new Map(assessment.passages.map((passage) => [passage.id, passage.title]));
            const allSectionsOpen = assessment.sectionAccess.english && assessment.sectionAccess.math;
            const sectionAccessLabel = allSectionsOpen
              ? "English + Math open"
              : assessment.sectionAccess.english
                ? "English only"
                : assessment.sectionAccess.math
                  ? "Math only"
                  : "All sections locked";
            return <article className="teacher-assessment-card" key={assessment.id}>
              <div className="teacher-assessment-card-heading">
                <div><span className={`status-pill status-pill-${assessment.status}`}>{assessment.status}</span><small>{sectionAccessLabel}</small><small>{assessment.durationMinutes} min</small></div>
                <div><span>SHSAT assessment</span><h3>{assessment.title}</h3><p>{assessment.description || "No description yet."}</p></div>
              </div>
              <div className="teacher-assessment-card-dashboard">
                <dl><div><dt>Passages</dt><dd>{assessment.passages.length}</dd></div><div><dt>Questions</dt><dd>{assessment.questions.length}</dd></div><div><dt>Session</dt><dd>One</dd></div><div><dt>Duration</dt><dd>{assessment.durationMinutes}m</dd></div></dl>
                <div className="teacher-assessment-performance-snapshot">
                  <span><small>Overall</small><strong>{assessmentInsight?.overallAverage === null || !assessmentInsight ? "—" : `${assessmentInsight.overallAverage}%`}</strong></span>
                  <span><small>English</small><strong>{assessmentInsight?.english.average === null || !assessmentInsight ? "—" : `${assessmentInsight.english.average}%`}</strong></span>
                  <span><small>Math</small><strong>{assessmentInsight?.math.average === null || !assessmentInsight ? "—" : `${assessmentInsight.math.average}%`}</strong></span>
                  <span><small>Submitted</small><strong>{classResult?.submissions ?? 0}</strong></span>
                </div>
              </div>
              <div className="teacher-section-access">
                <span><strong>Student section access</strong><small>Open either section independently. Saved work resumes when that section is reopened.</small></span>
                {(["english", "math"] as const).map((section) => (
                  <button
                    className={assessment.sectionAccess[section] ? "is-open" : "is-locked"}
                    disabled={savingSectionAccessKey === `${assessment.id}:${section}`}
                    key={section}
                    onClick={() => handleToggleSectionAccess(assessment, section)}
                    type="button"
                  >
                    {section === "english" ? "English" : "Math"}
                    <b>{assessment.sectionAccess[section] ? "Open" : "Locked"}</b>
                  </button>
                ))}
              </div>
              <div className="teacher-assessment-actions">
                <a
                  className="teacher-assessment-test-link"
                  href={getTeacherExamPreviewHref(assessment.id)}
                  onClick={() => resetExamTimer(assessment.id)}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Eye size={15} /> View test <ArrowUpRight size={14} />
                </a>
                {assessmentInsight ? <AppLink className="teacher-assessment-insight-link" href={`/teacher/assessments/${encodeURIComponent(assessment.id)}`}><BarChart3 size={15} /> View performance dashboard <ArrowUpRight size={14} /></AppLink> : null}
                <button disabled={savingStatusId === assessment.id} type="button" onClick={() => handleToggleAssessment(assessment)}>{allSectionsOpen ? "Lock both sections" : "Open both sections"}</button>
                <button
                  className={assessment.allowCompletedAccess ? "is-completed-access-active" : "is-secondary"}
                  disabled={savingCompletedAccessId === assessment.id}
                  type="button"
                  onClick={() => handleToggleCompletedAccess(assessment)}
                >
                  <RotateCcw size={14} />
                  {assessment.allowCompletedAccess ? "Revoke completed access" : "Allow completed access"}
                </button>
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
        </div>
      </section>
      ) : null}
    </CorporateDashboardShell>
  );
}
