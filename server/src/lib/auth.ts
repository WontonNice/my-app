import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const classIdsKey = "class_ids";

type AuthenticatedUserResult =
    | {
          error: string;
          user: null;
      }
    | {
          error: null;
          user: User;
      };

function getBearerToken(authorizationHeader: string | undefined) {
    const [scheme, token] = authorizationHeader?.split(" ") ?? [];

    if (scheme?.toLowerCase() !== "bearer" || !token) {
        return null;
    }

    return token;
}

export function getEnrolledClassIds(appMetadata: Record<string, unknown> | undefined) {
    const classIds = appMetadata?.[classIdsKey];

    if (!Array.isArray(classIds)) {
        return [];
    }

    return classIds.filter((classId): classId is string => typeof classId === "string");
}

export function getUserRole(user: User) {
    const role = user.user_metadata.role;

    return role === "teacher" || role === "admin" ? "teacher" : "student";
}

export async function getAuthenticatedUser(
    authorizationHeader: string | undefined,
): Promise<AuthenticatedUserResult> {
    const token = getBearerToken(authorizationHeader);

    if (!token) {
        return { error: "Log in to continue.", user: null };
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return { error: "Your session expired. Log in again.", user: null };
    }

    return { error: null, user: data.user };
}
