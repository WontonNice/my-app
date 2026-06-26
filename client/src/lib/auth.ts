import type { User } from "@supabase/supabase-js";

export type UserRole = "student" | "teacher";

export function getUserRole(user: User | null): UserRole {
  const role = user?.user_metadata.role;

  if (role === "teacher" || role === "admin") {
    return "teacher";
  }

  return "student";
}

export function getDashboardPath(role: UserRole) {
  return role === "teacher" ? "/teacher" : "/dashboard";
}
