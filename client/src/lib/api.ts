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

type RegisterStudentInput = {
  email: string;
  fullName: string;
  password: string;
};

export type CreateAssessmentInput = {
  classId: string;
  description: string;
  durationMinutes: number;
  imageUrl: string;
  passageText: string;
  passageTitle: string;
  questionAnswer: string;
  questionChoices: string;
  questionPrompt: string;
  questionTopic: string;
  questionType: QuestionType;
  title: string;
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

export async function createTeacherAssessment(accessToken: string, input: CreateAssessmentInput) {
  const data = await requestApi<{ assessment: TeacherAssessment }>("/api/assessments/teacher", {
    body: JSON.stringify(input),
    headers: createAuthHeaders(accessToken),
    method: "POST",
  });

  return data.assessment;
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
