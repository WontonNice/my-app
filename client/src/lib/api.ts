// Production serves the client and API from the same Render service. Only use
// the configurable base URL during local Vite development so a checked-in or
// machine-local localhost value can never leak into the production bundle.
const apiBaseUrl = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "")
  : "";

export type StudentClass = {
  description: string;
  id: string;
  level: string;
  name: string;
  schedule: string;
};

export type AssessmentStatus = "locked" | "open";
export type QuestionType =
  | "multiple_choice"
  | "multi_select"
  | "category_sort"
  | "inline_dropdown"
  | "numeric_entry"
  | "short_response"
  | "grid_in"
  | "essay";

export type StudentAssessment = {
  classId: string;
  description: string;
  durationMinutes: number;
  id: string;
  passageCount: number;
  questionCount: number;
  questionTypes: QuestionType[];
  split: boolean;
  status: AssessmentStatus;
  title: string;
};

export type TeacherAssessment = {
  classId: string;
  createdAt: string;
  description: string;
  durationMinutes: number;
  id: string;
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
  split: boolean;
  status: AssessmentStatus;
  title: string;
  updatedAt: string;
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
  classes?: string[];
  schedule?: ScheduleItem[];
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
    specialNotes?: string;
    status: "Active" | "Waitlist";
    earlyPickupDates?: string[];
    vanRide?: "none" | "2pm" | "5pm";
  }[];
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

export type RoomBooking = {
  createdAt: string;
  description: string;
  date: string;
  endTime: string;
  eventName: string;
  floor: number;
  id: string;
  requestedById: string;
  requestedByName: string;
  recurrenceGroupId?: string;
  roomId: string;
  roomName: string;
  status: "approved" | "pending" | "rejected";
  time: string;
};

export type CampusRoom = {
  capacity: number;
  floor: number;
  id: string;
  name: string;
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

export async function getStaffTasks(accessToken: string) {
  const data = await requestApi<{ tasks: StaffTask[] }>("/api/staff/tasks", { headers: createAuthHeaders(accessToken) });
  return data.tasks;
}

export async function createStaffTask(accessToken: string, input: { assignedToId: string; description: string; dueDate: string; title: string }) {
  const data = await requestApi<{ task: StaffTask }>("/api/staff/tasks", {
    body: JSON.stringify(input), headers: createAuthHeaders(accessToken), method: "POST",
  });
  return data.task;
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

export async function getCampusRooms(accessToken: string) {
  const data = await requestApi<{ rooms: CampusRoom[] }>("/api/staff/rooms", { headers: createAuthHeaders(accessToken) });
  return data.rooms;
}

export async function saveCampusRooms(accessToken: string, rooms: CampusRoom[]) {
  const data = await requestApi<{ rooms: CampusRoom[] }>("/api/staff/rooms", {
    body: JSON.stringify({ rooms }), headers: createAuthHeaders(accessToken), method: "PUT",
  });
  return data.rooms;
}

export async function saveStaffClasses(accessToken: string, accountId: string, classes: string[]) {
  const data = await requestApi<{ classes: string[]; dashboardData: StaffDashboardData }>(`/api/staff/classes/${encodeURIComponent(accountId)}`, {
    body: JSON.stringify({ classes }), headers: createAuthHeaders(accessToken), method: "PUT",
  });
  return data;
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

export async function getRoomBookings(accessToken: string) {
  const data = await requestApi<{ bookings: RoomBooking[] }>("/api/staff/bookings", { headers: createAuthHeaders(accessToken) });
  return data.bookings;
}

export async function requestRoomBooking(accessToken: string, input: { date: string; description: string; endTime: string; eventName: string; floor: number; repeatUntil?: string; roomId: string; roomName: string; time: string; weeklyRepeat?: boolean }) {
  const data = await requestApi<{ booking: RoomBooking; bookings?: RoomBooking[] }>("/api/staff/bookings", {
    body: JSON.stringify(input), headers: createAuthHeaders(accessToken), method: "POST",
  });
  return data.bookings ?? [data.booking];
}

export async function deleteRoomBooking(accessToken: string, bookingId: string) {
  await requestApi(`/api/staff/bookings/${encodeURIComponent(bookingId)}`, { headers: createAuthHeaders(accessToken), method: "DELETE" });
}

export async function updateRoomBooking(accessToken: string, bookingId: string, input: { date: string; description: string; endTime: string; eventName: string; floor: number; roomId: string; roomName: string; time: string }) {
  const data = await requestApi<{ booking: RoomBooking }>(`/api/staff/bookings/${encodeURIComponent(bookingId)}`, {
    body: JSON.stringify(input), headers: createAuthHeaders(accessToken), method: "PUT",
  });
  return data.booking;
}

export async function reviewRoomBooking(accessToken: string, bookingId: string, status: "approved" | "rejected") {
  const data = await requestApi<{ booking: RoomBooking }>(`/api/staff/bookings/${encodeURIComponent(bookingId)}`, {
    body: JSON.stringify({ status }), headers: createAuthHeaders(accessToken), method: "PATCH",
  });
  return data.booking;
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
    studentId: string;
    vanRide?: "none" | "2pm" | "5pm";
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

export type StudentProgressSnapshot = {
  classes: string[];
  dismissal: {
    earlyPickupDates: string[];
    vanRide: "none" | "2pm" | "5pm";
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
  progress: LearningProgressSnapshot;
};

export type SwitchableAccount = {
  fullName: string;
  id: string;
  role: "teacher";
};

type RegisterStudentInput = {
  fullName: string;
  password: string;
  username: string;
};

type ApiErrorBody = {
  message?: string;
};

async function readErrorMessage(response: Response) {
  const fallback = "Something went wrong. Please try again.";

  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
}

async function requestApi<TResponse>(path: string, init: RequestInit = {}) {
  const url = `${apiBaseUrl}${path}`;
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    // Render can briefly reset a connection while a free instance wakes or
    // restarts. Retrying read-only requests prevents a transient failure from
    // emptying an entire dashboard.
    if ((init.method ?? "GET").toUpperCase() !== "GET") {
      throw new Error(`Could not reach the server for ${path}. Please try again.`);
    }

    await new Promise((resolve) => window.setTimeout(resolve, 500));

    try {
      response = await fetch(url, init);
    } catch {
      throw new Error(`Could not reach the server for ${path}. Please refresh and try again.`);
    }
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

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
  input: Pick<ExamSessionProgress, "answers" | "completedSections">,
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

export async function getSwitchableAccounts(accessToken: string) {
  const data = await requestApi<{ accounts: SwitchableAccount[] }>("/api/auth/switchable-accounts", {
    headers: createAuthHeaders(accessToken),
  });
  return data.accounts;
}

export async function createAccountSwitchToken(accessToken: string, targetId: string) {
  return requestApi<{ tokenHash: string }>("/api/auth/switch-account", {
    body: JSON.stringify({ targetId }),
    headers: createAuthHeaders(accessToken),
    method: "POST",
  });
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

export async function getTeacherStudentProgress(accessToken: string) {
  const data = await requestApi<{ students: StudentProgressSnapshot[] }>("/api/progress/students", {
    headers: createAuthHeaders(accessToken),
  });
  return data.students;
}

export async function updateStudentDismissal(
  accessToken: string,
  studentId: string,
  input: { date?: string; pickedUpEarly?: boolean; vanRide?: "none" | "2pm" | "5pm" },
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
  const data = await requestApi<{ classes: StudentClass[] }>("/api/classes/mine", {
    headers: createAuthHeaders(accessToken),
  });

  return data.classes;
}

export async function joinStudentClass(accessToken: string, code: string) {
  return requestApi<{ classes: StudentClass[]; joinedClass: StudentClass }>("/api/classes/join", {
    body: JSON.stringify({ code }),
    headers: createAuthHeaders(accessToken),
    method: "POST",
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

export async function updateTeacherAssessmentSplit(
  accessToken: string,
  assessmentId: string,
  split: boolean,
) {
  const data = await requestApi<{ assessment: TeacherAssessment }>(
    `/api/assessments/teacher/${assessmentId}/split`,
    { body: JSON.stringify({ split }), headers: createAuthHeaders(accessToken), method: "PATCH" },
  );
  return data.assessment;
}
