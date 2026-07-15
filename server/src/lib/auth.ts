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

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function verifyToken(token: string): Promise<User | null> {
    // getClaims verifies asymmetric Supabase tokens locally after caching the
    // project's public key. This removes an Auth network round trip from every
    // dashboard request while retaining getUser as a compatibility fallback.
    const claimsResult = await supabase.auth.getClaims(token);
    if (claimsResult.data?.claims) {
        const claims = claimsResult.data.claims;
        const issuedAt = new Date(claims.iat * 1000).toISOString();
        return {
            app_metadata: isRecord(claims.app_metadata) ? claims.app_metadata : {},
            aud: Array.isArray(claims.aud) ? claims.aud[0] ?? "authenticated" : claims.aud,
            created_at: issuedAt,
            email: typeof claims.email === "string" ? claims.email : undefined,
            id: claims.sub,
            is_anonymous: claims.is_anonymous === true,
            phone: typeof claims.phone === "string" ? claims.phone : undefined,
            role: claims.role,
            updated_at: issuedAt,
            user_metadata: isRecord(claims.user_metadata) ? claims.user_metadata : {},
        };
    }

    const { data, error } = await supabase.auth.getUser(token);
    return error ? null : data.user;
}

export function getEnrolledClassIds(appMetadata: Record<string, unknown> | undefined) {
    const classIds = appMetadata?.[classIdsKey];

    if (!Array.isArray(classIds)) {
        return [];
    }

    return classIds.filter((classId): classId is string => typeof classId === "string");
}

export function getUserRole(user: User) {
    const role = user.app_metadata.role ?? user.user_metadata.role;

    if (role === "admin") {
        return "admin";
    }

    if (role === "staff") {
        return "staff";
    }

    return role === "teacher" ? "teacher" : "student";
}

export async function getAuthenticatedUser(
    authorizationHeader: string | undefined,
): Promise<AuthenticatedUserResult> {
    const token = getBearerToken(authorizationHeader);

    if (!token) {
        return { error: "Log in to continue.", user: null };
    }

    const user = await verifyToken(token).catch(() => null);
    if (!user) {
        return { error: "Your session expired. Log in again.", user: null };
    }

    return { error: null, user };
}
