import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

// Production serves the client and API from the same Render service. Only use
// the configurable base URL during local Vite development so a checked-in or
// machine-local localhost value can never leak into the production bundle.
const apiBaseUrl = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "")
  : "";

export type StudentClass = {
  description: string;
  id: string;
  level: string;
  name: string;
  schedule: string;
};

export type StudentClassJoinRequest = {
  classId: string;
  classroom: StudentClass;
  requestedAt: string;
  status: "pending";
};

export type TeacherClassJoinRequest = {
  classroom: StudentClass;
  requestedAt: string;
  studentEmail: string;
  studentId: string;
  studentName: string;
  studentUsername: string;
};

export type AssessmentStatus = "locked" | "open";
export type AssessmentSection = "english" | "math";
export type AssessmentSectionAccess = Record<AssessmentSection, boolean>;
export type QuestionType =
  | "multiple_choice"
  | "multi_select"
  | "category_sort"
  | "graph_point_select"
  | "table_match"
  | "inline_dropdown"
  | "math_drag_drop"
  | "number_line_response"
  | "transition_drop"
  | "short_response"
  | "numeric_entry"
  | "grid_in"
  | "essay";

export type StudentAssessment = {
  allowCompletedAccess: boolean;
  classId: string;
  description: string;
  durationMinutes: number;
  id: string;
  passageCount: number;
  questionCount: number;
  questionTypes: QuestionType[];
  sectionAccess: AssessmentSectionAccess;
  split: boolean;
  status: AssessmentStatus;
  title: string;
};

export type TeacherAssessment = {
  allowCompletedAccess: boolean;
  assignedFormId?: string;
  assignedFormLabel?: string;
  classId: string;
  createdAt: string;
  description: string;
  durationMinutes: number;
  formAssignments?: Record<string, string>;
  forms?: {
    id: string;
    label: string;
    passageOrder: string[];
  }[];
  id: string;
  passageOrder?: string[];
  passages: {
    id: string;
    imageUrl: string;
    text: string;
    title: string;
  }[];
  questions: {
    answer: string;
    choices: string[];
    id: string;
    imageUrl: string;
    points: number;
    prompt: string;
    topic: string;
    type: QuestionType;
  }[];
  sectionAccess: AssessmentSectionAccess;
  split: boolean;
  status: AssessmentStatus;
  title: string;
  updatedAt: string;
};

export type LibraryBookAccess = {
  accessCode: string;
  bookId: string;
  title: string;
  updatedAt: string;
};

export type StudentLibraryQuestionStat = {
  questionId: string;
  questionNumber: number;
  timeSpentSeconds: number;
};

export type TeacherLibraryQuestionStat = StudentLibraryQuestionStat & {
  correctAnswerId: string;
  isCorrect: boolean;
  selectedAnswerId: string;
};

export type StudentLibraryAttempt = {
  attemptNumber: number;
  bookId: string;
  completedAt: string;
  id: string;
  questions: StudentLibraryQuestionStat[];
  score: number;
  startedAt: string;
  totalQuestions: number;
  totalTimeSeconds: number;
};

export type LibraryCorrectionResponse = {
  questionId: string;
  whyChosenIncorrect: string;
  whyCorrectAnswerCorrect: string;
};

export type StudentLibraryCorrection = {
  attemptId: string;
  bookId: string;
  id: string;
  responses: LibraryCorrectionResponse[];
  submittedAt: string;
  updatedAt: string;
};

export type TeacherLibraryAttempt = Omit<StudentLibraryAttempt, "questions"> & {
  correction: StudentLibraryCorrection | null;
  questions: TeacherLibraryQuestionStat[];
};

export type StudentLibraryCorrectionView = {
  attempt: TeacherLibraryAttempt;
  correction: StudentLibraryCorrection | null;
};

export type TeacherLibraryStudent = {
  attempts: TeacherLibraryAttempt[];
  email: string;
  id: string;
  name: string;
  username: string;
};

export type StaffAccount = {
    accessPassword: string | null;
  createdAt: string;
  dashboardData: StaffDashboardData;
  fullName: string;
  id: string;
  username: string;
};

export type StaffDashboardData = {
  attendance: {
    group: string;
    name: string;
    status: "Absent" | "Late" | "Present";
    time: string;
  }[];
  attendanceRecords?: Record<string, Record<string, "Absent" | "Late" | "Present" | "Unmarked">>;
  attendanceUpdatedAt?: Record<string, string>;
  classes?: string[];
  schedule?: ScheduleItem[];
  swimmingRecords?: Record<string, SwimmingStatus>;
  swimmingRosters?: Record<string, string[]>;
  roster: {
    allergies?: string;
    assignment: string;
    cohort: string;
    className?: string;
    dob?: string;
    firstName?: string;
    grade: string;
    id: string;
    lastName?: string;
    name: string;
    points: number;
    specialNotes?: string;
    squidNumber?: number;
    status: "Active" | "Waitlist";
    earlyPickupDates?: string[];
    earlyPickupTimes?: Record<string, string>;
    vanRide?: "none" | "5pm";
  }[];
};

export type SquidGamesStudent = {
  accountId: string;
  className: string | null;
  grade: string;
  name: string;
  playerNumber: number;
  points: number;
  staffName: string;
  studentId: string;
};

export type SquidGamesData = {
  availableGrades: string[];
  leaderboardGrades: string[];
  students: SquidGamesStudent[];
};

export type SwimmingStatus = {
  paidFee: boolean;
  waiverComplete: boolean;
};

export type ScheduleItem = {
  endTime: string;
  id: string;
  place: string;
  startTime: string;
  studentIds: string[];
  title: string;
  weekdays: number[];
};

export type StaffSchedule = {
  accountId: string;
  fullName: string;
  schedule: ScheduleItem[];
  username: string;
};

export type RosterStudentInput = {
  allergies: string;
  dob: string;
  firstName: string;
  className: string;
  id?: string;
  lastName: string;
  specialNotes: string;
};

export type StaffTask = {
  assignedToId: string;
  assignedToName: string;
  completedAt?: string;
  createdAt: string;
  description: string;
  dueDate: string;
  id: string;
  status: "completed" | "open";
  title: string;
};

export type StaffAttendanceEntry = {
  date: string;
  hours: number;
  id: string;
  note: string;
  staffAccountId: string;
  staffName: string;
};

export async function getStaffTasks(accessToken: string) {
  const data = await requestApi<{ tasks: StaffTask[] }>("/api/staff/tasks", { headers: createAuthHeaders(accessToken) });
  return data.tasks;
}

export async function createStaffTask(accessToken: string, input: { assignedToId: string; description: string; dueDate: string; repeatUntil?: string; repeatWeekly?: boolean; title: string }) {
  const data = await requestApi<{ task: StaffTask; tasks?: StaffTask[] }>("/api/staff/tasks", {
    body: JSON.stringify(input), headers: createAuthHeaders(accessToken), method: "POST",
  });
  return data.tasks ?? [data.task];
}

export async function updateStaffTask(accessToken: string, taskId: string, completed: boolean) {
  const data = await requestApi<{ task: StaffTask }>(`/api/staff/tasks/${encodeURIComponent(taskId)}`, {
    body: JSON.stringify({ completed }), headers: createAuthHeaders(accessToken), method: "PATCH",
  });
  return data.task;
}

export async function deleteStaffTask(accessToken: string, taskId: string) {
  await requestApi(`/api/staff/tasks/${encodeURIComponent(taskId)}`, { headers: createAuthHeaders(accessToken), method: "DELETE" });
}

export async function getStaffAttendanceEntries(accessToken: string) {
  const data = await requestApi<{ entries: StaffAttendanceEntry[] }>("/api/staff/staff-attendance", { headers: createAuthHeaders(accessToken) });
  return data.entries;
}

export async function saveStaffAttendanceEntry(
  accessToken: string,
  input: { date: string; hours: number; id?: string; note: string; staffAccountId: string; staffName: string },
) {
  const data = await requestApi<{ entries: StaffAttendanceEntry[]; entry: StaffAttendanceEntry }>("/api/staff/staff-attendance", {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
  return data;
}

export async function deleteStaffAttendanceEntry(accessToken: string, entryId: string) {
  await requestApi(`/api/staff/staff-attendance/${encodeURIComponent(entryId)}`, { headers: createAuthHeaders(accessToken), method: "DELETE" });
}

export async function saveStaffClasses(accessToken: string, accountId: string, classes: string[]) {
  const data = await requestApi<{ classes: string[]; dashboardData: StaffDashboardData }>(`/api/staff/classes/${encodeURIComponent(accountId)}`, {
    body: JSON.stringify({ classes }), headers: createAuthHeaders(accessToken), method: "PUT",
  });
  return data;
}

export async function saveSwimmingStatus(accessToken: string, accountId: string, studentId: string, status: SwimmingStatus) {
  return requestApi<{ dashboardData: StaffDashboardData; status: SwimmingStatus }>(
    `/api/staff/swimming/${encodeURIComponent(accountId)}/${encodeURIComponent(studentId)}`,
    {
      body: JSON.stringify(status),
      headers: createAuthHeaders(accessToken),
      method: "PUT",
    },
  );
}

export async function saveSwimmingRoster(accessToken: string, accountId: string, date: string, studentIds: string[]) {
  return requestApi<{ dashboardData: StaffDashboardData; studentIds: string[] }>(
    `/api/staff/swimming-roster/${encodeURIComponent(accountId)}/${encodeURIComponent(date)}`,
    {
      body: JSON.stringify({ studentIds }),
      headers: createAuthHeaders(accessToken),
      method: "PUT",
    },
  );
}

export async function getStaffDashboard(accessToken: string, accountId?: string) {
  const query = accountId ? `?accountId=${encodeURIComponent(accountId)}` : "";
  const data = await requestApi<{ dashboardData: StaffDashboardData }>(`/api/staff/dashboard${query}`, {
    headers: createAuthHeaders(accessToken),
  });
  return data.dashboardData;
}

export async function getStaffSchedules(accessToken: string) {
  const data = await requestApi<{ schedules: StaffSchedule[] }>("/api/staff/schedules", { headers: createAuthHeaders(accessToken) });
  return data.schedules;
}

export async function saveStaffSchedule(accessToken: string, accountId: string, schedule: ScheduleItem[]) {
  const data = await requestApi<{ schedule: ScheduleItem[] }>(`/api/staff/schedules/${encodeURIComponent(accountId)}`, {
    body: JSON.stringify({ schedule }), headers: createAuthHeaders(accessToken), method: "PUT",
  });
  return data.schedule;
}

export async function saveRosterStudent(accessToken: string, accountId: string, input: RosterStudentInput) {
  const data = await requestApi<{ dashboardData: StaffDashboardData; student: StaffDashboardData["roster"][number] }>(`/api/staff/roster/${encodeURIComponent(accountId)}`, {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
  return data;
}

export async function deleteRosterStudent(accessToken: string, accountId: string, studentId: string) {
  const data = await requestApi<{ dashboardData: StaffDashboardData }>(`/api/staff/roster/${encodeURIComponent(accountId)}/${encodeURIComponent(studentId)}`, {
    headers: createAuthHeaders(accessToken),
    method: "DELETE",
  });
  return data;
}

export async function saveStaffAttendance(
  accessToken: string,
  input: {
    accountId?: string;
    date: string;
    statuses: Record<string, "Absent" | "Late" | "Present" | "Unmarked">;
  },
) {
  return requestApi<{ completedTask: StaffTask | null; dashboardData: StaffDashboardData; sheetsSynced: boolean }>("/api/staff/attendance", {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
}

export async function saveStaffDismissal(
  accessToken: string,
  input: {
    accountId?: string;
    date?: string;
    pickedUpEarly?: boolean;
    pickupTime?: string;
    studentId: string;
    vanRide?: "none" | "5pm";
  },
) {
  return requestApi<{ dashboardData: StaffDashboardData }>("/api/staff/dismissal", {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
}

export type GoogleSheetsAttendanceSettings = {
  configured: boolean;
  source: "admin" | "environment" | "none";
  webhookUrl: string;
};

export async function getGoogleSheetsAttendanceSettings(accessToken: string) {
  return requestApi<GoogleSheetsAttendanceSettings>("/api/staff/google-sheets", {
    headers: createAuthHeaders(accessToken),
  });
}

export async function saveGoogleSheetsAttendanceSettings(accessToken: string, webhookUrl: string) {
  return requestApi<GoogleSheetsAttendanceSettings>("/api/staff/google-sheets", {
    body: JSON.stringify({ webhookUrl }),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
}

export async function syncGoogleSheetsAttendance(accessToken: string) {
  return requestApi<{ rowCount: number; synced: boolean }>("/api/staff/google-sheets/sync", {
    headers: createAuthHeaders(accessToken),
    method: "POST",
  });
}

export type LearningProgressSnapshot = {
  examResults: Record<string, unknown>[];
  practice: Record<string, Record<string, unknown>>;
};

export type ManualExamScoreInput = {
  completedDate: string;
  englishCorrect: number;
  englishTotal: number;
  mathCorrect: number;
  mathTotal: number;
  title: string;
};

export type StudentProgressSnapshot = {
  classes: string[];
  dismissal: {
    earlyPickupDates: string[];
    earlyPickupTimes: Record<string, string>;
    vanRide: "none" | "5pm";
  };
  email: string;
  fullName: string;
  id: string;
  insights: {
    averageTestScore: number | null;
    bestTestScore: number | null;
    practiceAccuracy: number | null;
    practiceAttempts: number;
    testsCompleted: number;
  };
    lastLoginAt: string | null;
    examSessions: Record<string, ExamSessionProgress>;
    progress: LearningProgressSnapshot;
  username: string;
};

export type StudentAccountUpdate = {
  email: string;
  fullName: string;
  id: string;
  username: string;
};

type RegisterStudentInput = {
  fullName: string;
  password: string;
  username: string;
};

type ApiErrorBody = {
  message?: string;
  requestId?: string;
};

const requestTimeoutMs = 15_000;
const readRetryDelaysMs = [300, 900];
const retryableReadStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);
let sessionRefreshPromise: Promise<string | null> | null = null;

async function readErrorMessage(response: Response) {
  const fallback = "Something went wrong. Please try again.";
  if (response.status === 431) return "Your sign-in token is too large. Sign out, then log in again to refresh it.";

  try {
    const body = (await response.json()) as ApiErrorBody;
    const message = body.message ?? fallback;
    return body.requestId ? `${message} Reference: ${body.requestId}` : message;
  } catch {
    return fallback;
  }
}

function wait(delayMs: number) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, delayMs));
}

async function resolveRequestHeaders(headersInit: HeadersInit | undefined) {
  const headers = new Headers(headersInit);
  if (!headers.has("Authorization") || !isSupabaseConfigured) return headers;

  // Page components may hold the token they received at mount time. Supabase
  // refreshes sessions in the background, so always prefer its current local
  // session before making an authenticated API request.
  try {
    const { data } = await getSupabaseClient().auth.getSession();
    if (data.session?.access_token) {
      headers.set("Authorization", `Bearer ${data.session.access_token}`);
    }
  } catch {
    // The server still gets an opportunity to validate the caller-provided
    // token when local session storage is temporarily unavailable.
  }

  return headers;
}

async function refreshAccessToken() {
  if (!isSupabaseConfigured) return null;

  if (!sessionRefreshPromise) {
    sessionRefreshPromise = getSupabaseClient().auth.refreshSession()
      .then(({ data, error }) => error ? null : data.session?.access_token ?? null)
      .catch(() => null);
  }

  const activeRefresh = sessionRefreshPromise;
  try {
    return await activeRefresh;
  } finally {
    if (sessionRefreshPromise === activeRefresh) sessionRefreshPromise = null;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, headers: Headers) {
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort(init.signal?.reason);

  if (init.signal?.aborted) {
    abortFromCaller();
  } else {
    init.signal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  const timeout = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, requestTimeoutMs);

  try {
    return await fetch(url, { ...init, headers, signal: controller.signal });
  } catch (error) {
    if (timedOut) {
      throw new Error("The server took too long to respond.");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
    init.signal?.removeEventListener("abort", abortFromCaller);
  }
}

async function requestApi<TResponse>(path: string, init: RequestInit = {}) {
  const method = (init.method ?? "GET").toUpperCase();
  const isReadOnly = method === "GET" || method === "HEAD";
  let url = `${apiBaseUrl}${path}`;
  const headers = await resolveRequestHeaders(init.headers);
  let authRetryUsed = false;
  let readRetryIndex = 0;
  let response: Response | null = null;

  while (!response) {
    try {
      response = await fetchWithTimeout(url, init, headers);
    } catch (error) {
      if (init.signal?.aborted) throw error;

      if (isReadOnly && readRetryIndex < readRetryDelaysMs.length) {
        await wait(readRetryDelaysMs[readRetryIndex]);
        readRetryIndex += 1;
        continue;
      }

      // Local Vite has a same-origin proxy. It is a useful fallback if a
      // developer-specific API base URL is temporarily unreachable.
      if (isReadOnly && import.meta.env.DEV && apiBaseUrl && url !== path) {
        url = path;
        readRetryIndex = 0;
        continue;
      }

      const detail = error instanceof Error ? error.message : "The server could not be reached.";
      if (isReadOnly) {
        throw new Error(`${detail} Please refresh and try again.`);
      }
      throw new Error(`${detail} The change was not confirmed; refresh before trying it again.`);
    }

    if ((response.status === 401 || response.status === 431) && headers.has("Authorization") && !authRetryUsed) {
      authRetryUsed = true;
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        headers.set("Authorization", `Bearer ${refreshedToken}`);
        response = null;
        continue;
      }
    }

    if (isReadOnly && retryableReadStatuses.has(response.status) && readRetryIndex < readRetryDelaysMs.length) {
      response = null;
      await wait(readRetryDelaysMs[readRetryIndex]);
      readRetryIndex += 1;
    }
  }

  if (!response.ok) throw new Error(await readErrorMessage(response));

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

function createAuthHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

export async function registerStudent(input: RegisterStudentInput) {
  return requestApi<{ loginEmail: string; message: string }>("/api/auth/register", {
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export type ExamSessionProgress = {
    answers: Record<string, unknown>;
    completedSections: ("english" | "math")[];
    status: "in_progress" | "submitted";
    submittedAt?: string;
    updatedAt: string;
};

export async function getExamSessionProgress(accessToken: string) {
  const data = await requestApi<{ sessions: Record<string, ExamSessionProgress> }>("/api/progress/exam-sessions", {
    headers: createAuthHeaders(accessToken),
  });
  return data.sessions;
}

export async function saveExamSessionProgress(
  accessToken: string,
  assessmentId: string,
  input: Pick<ExamSessionProgress, "answers" | "completedSections"> & {
    status?: ExamSessionProgress["status"];
  },
) {
  const data = await requestApi<{ session: ExamSessionProgress | null }>(
    `/api/progress/exam-sessions/${encodeURIComponent(assessmentId)}`,
    { body: JSON.stringify(input), headers: createAuthHeaders(accessToken), method: "PUT" },
  );
  return data.session;
}

export async function getStaffAccounts(accessToken: string) {
  const data = await requestApi<{ staff: StaffAccount[] }>("/api/auth/staff", {
    headers: createAuthHeaders(accessToken),
  });

  return data.staff;
}

export async function assignStaffAccount(
  accessToken: string,
  input: { fullName: string; password: string; username: string },
) {
  const data = await requestApi<{ staffAccount: StaffAccount }>("/api/auth/staff", {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "POST",
  });

  return data.staffAccount;
}

export async function updateStaffAccount(
  accessToken: string,
  userId: string,
  input: { fullName: string; password?: string; username: string },
) {
  const data = await requestApi<{ staffAccount: StaffAccount }>(`/api/auth/staff/${encodeURIComponent(userId)}`, {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "PATCH",
  });

  return data.staffAccount;
}

export async function getLearningProgress(accessToken: string) {
  const data = await requestApi<{ progress: LearningProgressSnapshot }>("/api/progress", {
    headers: createAuthHeaders(accessToken),
  });
  return data.progress;
}

export async function getTeacherLibraryBooks(accessToken: string) {
  const data = await requestApi<{ books: LibraryBookAccess[] }>("/api/library/teacher/books", {
    headers: createAuthHeaders(accessToken),
  });
  return data.books;
}

export async function generateTeacherLibraryBookCode(accessToken: string, bookId: string, title: string) {
  const data = await requestApi<{ book: LibraryBookAccess }>(
    `/api/library/teacher/books/${encodeURIComponent(bookId)}/code`,
    {
      body: JSON.stringify({ title }),
      headers: createAuthHeaders(accessToken),
      method: "POST",
    },
  );
  return data.book;
}

export async function getTeacherLibraryBook(accessToken: string, bookId: string) {
  return requestApi<{ book: LibraryBookAccess | null; students: TeacherLibraryStudent[] }>(
    `/api/library/teacher/books/${encodeURIComponent(bookId)}`,
    { headers: createAuthHeaders(accessToken) },
  );
}

export async function unlockLibraryBook(accessToken: string, bookId: string, code: string) {
  return requestApi<{ bookId: string; title: string; unlocked: boolean; unlockedAt: string | null }>(
    `/api/library/books/${encodeURIComponent(bookId)}/unlock`,
    {
      body: JSON.stringify({ code }),
      headers: createAuthHeaders(accessToken),
      method: "POST",
    },
  );
}

export async function getStudentLibraryBookAccess(accessToken: string, bookId: string) {
  return requestApi<{ unlocked: boolean; unlockedAt: string | null }>(
    `/api/library/books/${encodeURIComponent(bookId)}/access`,
    { headers: createAuthHeaders(accessToken) },
  );
}

export async function getStudentLibraryAttempts(accessToken: string, bookId: string) {
  const data = await requestApi<{ attempts: StudentLibraryAttempt[] }>(
    `/api/library/books/${encodeURIComponent(bookId)}/attempts`,
    { headers: createAuthHeaders(accessToken) },
  );
  return data.attempts;
}

export async function getStudentLibraryCorrections(accessToken: string, bookId: string) {
  return requestApi<StudentLibraryCorrectionView>(
    `/api/library/books/${encodeURIComponent(bookId)}/corrections`,
    { headers: createAuthHeaders(accessToken) },
  );
}

export async function submitStudentLibraryCorrections(
  accessToken: string,
  bookId: string,
  responses: LibraryCorrectionResponse[],
) {
  const data = await requestApi<{ correction: StudentLibraryCorrection }>(
    `/api/library/books/${encodeURIComponent(bookId)}/corrections`,
    {
      body: JSON.stringify({ responses }),
      headers: createAuthHeaders(accessToken),
      method: "POST",
    },
  );
  return data.correction;
}

export async function saveStudentLibraryAttempt(
  accessToken: string,
  bookId: string,
  input: {
    code: string;
    questions: {
      correctAnswerId: string;
      questionId: string;
      selectedAnswerId: string;
      timeSpentSeconds: number;
    }[];
    startedAt: string;
    totalTimeSeconds: number;
  },
) {
  const data = await requestApi<{ attempt: StudentLibraryAttempt }>(
    `/api/library/books/${encodeURIComponent(bookId)}/attempts`,
    {
      body: JSON.stringify(input),
      headers: createAuthHeaders(accessToken),
      method: "POST",
    },
  );
  return data.attempt;
}

export async function getTeacherStudentProgress(accessToken: string) {
  const data = await requestApi<{ students: StudentProgressSnapshot[] }>("/api/progress/students", {
    headers: createAuthHeaders(accessToken),
  });
  return data.students;
}

export async function createTeacherManualExamResult(
  accessToken: string,
  studentId: string,
  input: ManualExamScoreInput,
) {
  const data = await requestApi<{ result: Record<string, unknown> }>(
    `/api/progress/students/${encodeURIComponent(studentId)}/manual-exam-results`,
    {
      body: JSON.stringify(input),
      headers: createAuthHeaders(accessToken),
      method: "POST",
    },
  );
  return data.result;
}

export async function updateStudentDismissal(
  accessToken: string,
  studentId: string,
  input: { date?: string; pickedUpEarly?: boolean; pickupTime?: string; vanRide?: "none" | "5pm" },
) {
  const data = await requestApi<{ dismissal: StudentProgressSnapshot["dismissal"] }>(
    `/api/progress/students/${encodeURIComponent(studentId)}/dismissal`,
    {
      body: JSON.stringify(input),
      headers: createAuthHeaders(accessToken),
      method: "PATCH",
    },
  );
  return data.dismissal;
}

export async function updateStudentAccount(
  accessToken: string,
  studentId: string,
  input: { fullName: string; password?: string; username: string },
) {
  const data = await requestApi<{ student: StudentAccountUpdate }>(`/api/auth/students/${encodeURIComponent(studentId)}`, {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "PATCH",
  });
  return data.student;
}

export async function deleteStudentAccount(accessToken: string, studentId: string) {
  await requestApi(`/api/auth/students/${encodeURIComponent(studentId)}`, {
    headers: createAuthHeaders(accessToken),
    method: "DELETE",
  });
}

export async function saveCloudExamResult(
  accessToken: string,
  assessmentId: string,
  result: Record<string, unknown>,
) {
  return requestApi<{ progress: LearningProgressSnapshot; storage: "database" }>(`/api/progress/exam-results/${encodeURIComponent(assessmentId)}`, {
    body: JSON.stringify({ result }),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
}

export async function saveCloudPracticeProgress(
  accessToken: string,
  topicSlug: string,
  progress: Record<string, unknown>,
) {
  await requestApi(`/api/progress/practice/${encodeURIComponent(topicSlug)}`, {
    body: JSON.stringify({ progress }),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
}

export async function getStudentClasses(accessToken: string) {
  const data = await getStudentClassAccess(accessToken);
  return data.classes;
}

export async function getStudentClassAccess(accessToken: string) {
  return requestApi<{ classes: StudentClass[]; pendingRequests: StudentClassJoinRequest[] }>("/api/classes/mine", {
    headers: createAuthHeaders(accessToken),
  });
}

export async function joinStudentClass(accessToken: string, code: string) {
  return requestApi<{
    classes: StudentClass[];
    joinedClass?: StudentClass;
    request?: StudentClassJoinRequest;
    status: "approved" | "pending";
  }>("/api/classes/join", {
    body: JSON.stringify({ code }),
    headers: createAuthHeaders(accessToken),
    method: "POST",
  });
}

export async function getTeacherClassJoinRequests(accessToken: string) {
  const data = await requestApi<{ requests: TeacherClassJoinRequest[] }>("/api/classes/requests", {
    headers: createAuthHeaders(accessToken),
  });
  return data.requests;
}

export async function reviewTeacherClassJoinRequest(
  accessToken: string,
  studentId: string,
  classId: string,
  action: "approve" | "reject",
) {
  return requestApi<{ action: "approve" | "reject"; classroom: StudentClass; studentId: string }>(
    `/api/classes/requests/${encodeURIComponent(studentId)}/${encodeURIComponent(classId)}`,
    {
      body: JSON.stringify({ action }),
      headers: createAuthHeaders(accessToken),
      method: "PATCH",
    },
  );
}

export async function getSquidGames(accessToken: string) {
  return requestApi<SquidGamesData>("/api/staff/squid-games", {
    headers: createAuthHeaders(accessToken),
  });
}

export async function saveSquidGamesPoints(accessToken: string, accountId: string, studentId: string, points: number) {
  return requestApi<{ accountId: string; points: number; studentId: string }>(
    `/api/staff/squid-games/${encodeURIComponent(studentId)}`,
    {
      body: JSON.stringify({ accountId, points }),
      headers: createAuthHeaders(accessToken),
      method: "PATCH",
    },
  );
}

export async function saveSquidGamesLeaderboardGrades(accessToken: string, grades: string[]) {
  return requestApi<{ leaderboardGrades: string[] }>("/api/staff/squid-games/leaderboard-grades", {
    body: JSON.stringify({ grades }),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
}

export async function getStudentAssessments(accessToken: string) {
  const data = await requestApi<{ assessments: StudentAssessment[] }>("/api/assessments/student", {
    headers: createAuthHeaders(accessToken),
  });

  return data.assessments;
}

export async function getStudentAssessment(accessToken: string, assessmentId: string) {
  const data = await requestApi<{ assessment: TeacherAssessment }>(
    `/api/assessments/student/${assessmentId}`,
    {
      headers: createAuthHeaders(accessToken),
    },
  );

  return data.assessment;
}

export async function getTeacherAssessments(accessToken: string) {
  const data = await requestApi<{ assessments: TeacherAssessment[] }>("/api/assessments/teacher", {
    headers: createAuthHeaders(accessToken),
  });

  return data.assessments;
}

export async function updateTeacherAssessmentStatus(
  accessToken: string,
  assessmentId: string,
  status: AssessmentStatus,
) {
  const data = await requestApi<{ assessment: TeacherAssessment }>(
    `/api/assessments/teacher/${assessmentId}/status`,
    {
      body: JSON.stringify({ status }),
      headers: createAuthHeaders(accessToken),
      method: "PATCH",
    },
  );

  return data.assessment;
}

export async function updateTeacherAssessmentCompletedAccess(
  accessToken: string,
  assessmentId: string,
  allowCompletedAccess: boolean,
) {
  const data = await requestApi<{ assessment: TeacherAssessment }>(
    `/api/assessments/teacher/${assessmentId}/completed-access`,
    {
      body: JSON.stringify({ allowCompletedAccess }),
      headers: createAuthHeaders(accessToken),
      method: "PATCH",
    },
  );
  return data.assessment;
}

export async function updateTeacherAssessmentSectionAccess(
  accessToken: string,
  assessmentId: string,
  section: AssessmentSection,
  open: boolean,
) {
  const data = await requestApi<{ assessment: TeacherAssessment }>(
    `/api/assessments/teacher/${assessmentId}/sections/${section}`,
    {
      body: JSON.stringify({ open }),
      headers: createAuthHeaders(accessToken),
      method: "PATCH",
    },
  );
  return data.assessment;
}

export async function updateTeacherAssessmentForms(
  accessToken: string,
  assessmentId: string,
  forms: NonNullable<TeacherAssessment["forms"]>,
  assignments: Record<string, string>,
) {
  const data = await requestApi<{ assessment: TeacherAssessment }>(
    `/api/assessments/teacher/${assessmentId}/forms`,
    {
      body: JSON.stringify({ assignments, forms }),
      headers: createAuthHeaders(accessToken),
      method: "PUT",
    },
  );
  return data.assessment;
}
