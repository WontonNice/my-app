import type { Session } from "@supabase/supabase-js";
import type {
  ExamSessionProgress,
  StudentAssessment,
  StudentClass,
  StudentProgressSnapshot,
  TeacherAssessment,
} from "./api";
import type { ExamResult } from "./examResults";
import { getSupabaseClient } from "./supabase";

let activeSession: Session | null | undefined;
const studentClassesByUser = new Map<string, StudentClass[]>();
const studentDashboardStoragePrefix = "nathan-tutors:student-dashboard:v2";
const teacherDashboardStoragePrefix = "nathan-tutors:teacher-dashboard:v2";
const dashboardCacheTtlMs = 15 * 60 * 1000;

export type StudentDashboardCache = {
  assessments: StudentAssessment[];
  cachedAt: number;
  examResults: ExamResult[];
  examSessions: Record<string, ExamSessionProgress>;
};

export type TeacherDashboardCache = {
  assessments: TeacherAssessment[];
  cachedAt: number;
  students: StudentProgressSnapshot[];
};

export function cacheActiveSession(session: Session | null) {
  activeSession = session;
}

export function peekActiveSession() {
  return activeSession;
}

export async function getActiveSession() {
  if (activeSession !== undefined) return activeSession;
  const { data } = await getSupabaseClient().auth.getSession();
  activeSession = data.session;
  return activeSession;
}

export function cacheStudentClasses(userId: string, classes: StudentClass[]) {
  studentClassesByUser.set(userId, classes);
}

export function getCachedStudentClasses(userId: string) {
  return studentClassesByUser.get(userId);
}

function studentDashboardStorageKey(userId: string) {
  return `${studentDashboardStoragePrefix}:${userId}`;
}

function teacherDashboardStorageKey(userId: string) {
  return `${teacherDashboardStoragePrefix}:${userId}`;
}

export function cacheStudentDashboard(
  userId: string,
  assessments: StudentAssessment[],
  examResults: ExamResult[],
  examSessions: Record<string, ExamSessionProgress>,
) {
  if (typeof window === "undefined") return;
  const snapshot: StudentDashboardCache = {
    assessments,
    cachedAt: Date.now(),
    examResults,
    examSessions,
  };
  try {
    window.sessionStorage.setItem(studentDashboardStorageKey(userId), JSON.stringify(snapshot));
  } catch {
    // A full browser storage quota should never prevent the live dashboard from loading.
  }
}

export function getCachedStudentDashboard(userId: string) {
  if (typeof window === "undefined") return null;
  try {
    const snapshot = JSON.parse(
      window.sessionStorage.getItem(studentDashboardStorageKey(userId)) ?? "null",
    ) as StudentDashboardCache | null;
    if (
      !snapshot ||
      !Array.isArray(snapshot.assessments) ||
      !Array.isArray(snapshot.examResults) ||
      !snapshot.examSessions ||
      typeof snapshot.examSessions !== "object" ||
      typeof snapshot.cachedAt !== "number" ||
      Date.now() - snapshot.cachedAt > dashboardCacheTtlMs
    ) {
      window.sessionStorage.removeItem(studentDashboardStorageKey(userId));
      return null;
    }
    return snapshot;
  } catch {
    window.sessionStorage.removeItem(studentDashboardStorageKey(userId));
    return null;
  }
}

export function cacheTeacherDashboard(
  userId: string,
  assessments: TeacherAssessment[],
  students: StudentProgressSnapshot[],
) {
  if (typeof window === "undefined") return;
  const snapshot: TeacherDashboardCache = {
    assessments,
    cachedAt: Date.now(),
    students,
  };
  try {
    window.sessionStorage.setItem(teacherDashboardStorageKey(userId), JSON.stringify(snapshot));
  } catch {
    // A full browser storage quota should never prevent the live dashboard from loading.
  }
}

export function getCachedTeacherDashboard(userId: string) {
  if (typeof window === "undefined") return null;
  try {
    const snapshot = JSON.parse(
      window.sessionStorage.getItem(teacherDashboardStorageKey(userId)) ?? "null",
    ) as TeacherDashboardCache | null;
    if (
      !snapshot ||
      !Array.isArray(snapshot.assessments) ||
      !Array.isArray(snapshot.students) ||
      typeof snapshot.cachedAt !== "number" ||
      Date.now() - snapshot.cachedAt > dashboardCacheTtlMs
    ) {
      window.sessionStorage.removeItem(teacherDashboardStorageKey(userId));
      return null;
    }
    return snapshot;
  } catch {
    window.sessionStorage.removeItem(teacherDashboardStorageKey(userId));
    return null;
  }
}
