const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

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
  status: AssessmentStatus;
  title: string;
  updatedAt: string;
};

export type StaffAccount = {
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
  roster: {
    assignment: string;
    cohort: string;
    grade: string;
    id: string;
    name: string;
    status: "Active" | "Waitlist";
  }[];
};

export async function saveStaffAttendance(
  accessToken: string,
  input: {
    accountId?: string;
    date: string;
    statuses: Record<string, "Absent" | "Late" | "Present" | "Unmarked">;
  },
) {
  const data = await requestApi<{ dashboardData: StaffDashboardData }>("/api/staff/attendance", {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "PUT",
  });
  return data.dashboardData;
}

export type LearningProgressSnapshot = {
  examResults: Record<string, unknown>[];
  practice: Record<string, unknown>;
};

type RegisterStudentInput = {
  email: string;
  fullName: string;
  password: string;
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
  const response = await fetch(`${apiBaseUrl}${path}`, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
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
  await requestApi("/api/auth/register", {
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
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

export async function saveCloudExamResult(
  accessToken: string,
  assessmentId: string,
  result: Record<string, unknown>,
) {
  await requestApi(`/api/progress/exam-results/${encodeURIComponent(assessmentId)}`, {
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
