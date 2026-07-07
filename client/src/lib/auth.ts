import type { User } from "@supabase/supabase-js";

export type UserRole = "admin" | "staff" | "student" | "teacher";

export function getStaffLoginEmail(username: string) {
  return `${username.trim().toLowerCase()}@staff.nathantutors.local`;
}

export function getStudentLoginEmail(username: string) {
  return `${username.trim().toLowerCase()}@students.nathantutors.local`;
}

export function getUserRole(user: User | null): UserRole {
  const role = user?.app_metadata.role ?? user?.user_metadata.role;

  if (role === "admin") {
    return "admin";
  }

  if (role === "staff") {
    return "staff";
  }

  if (role === "teacher" || role === "admin") {
    return "teacher";
  }

  return "student";
}

export function getDashboardPath(role: UserRole) {
  if (role === "admin") {
    return "/admin";
  }
  if (role === "staff") {
    return "/staff";
  }

  return role === "teacher" ? "/teacher" : "/dashboard";
}
