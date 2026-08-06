import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const classIdsKey = "class_ids";
export const classJoinRequestsKey = "class_join_requests";

export type ClassJoinRequest = {
    classId: string;
    requestedAt: string;
};

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
    // Development must run one client/server pair so both use the same project.
    // JWKS fetches and Web Crypto operations can throw non-Auth errors. Keep
    // those failures inside this fast path so they do not incorrectly turn a
    // valid, newly refreshed session into "Your session expired."
    try {
        const claimsResult = await supabase.auth.getClaims(token);
        if (claimsResult.data?.claims) {
            const claims = claimsResult.data.claims;
            const issuedAt = Number.isFinite(claims.iat)
                ? new Date(claims.iat * 1000).toISOString()
                : new Date(0).toISOString();
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
    } catch {
        // Fall through to Supabase Auth's authoritative user lookup.
    }

    try {
        const { data, error } = await supabase.auth.getUser(token);
        return error ? null : data.user;
    } catch {
        return null;
    }
}

export function getEnrolledClassIds(appMetadata: Record<string, unknown> | undefined) {
    const classIds = appMetadata?.[classIdsKey];

    if (!Array.isArray(classIds)) {
        return [];
    }

    return classIds.filter((classId): classId is string => typeof classId === "string");
}

export function getClassJoinRequests(appMetadata: Record<string, unknown> | undefined): ClassJoinRequest[] {
    const requests = appMetadata?.[classJoinRequestsKey];

    if (!Array.isArray(requests)) {
        return [];
    }

    return requests.flatMap((request) => {
        if (!request || typeof request !== "object" || Array.isArray(request)) return [];
        const candidate = request as Record<string, unknown>;
        if (typeof candidate.classId !== "string" || !candidate.classId) return [];
        return [{
            classId: candidate.classId,
            requestedAt: typeof candidate.requestedAt === "string" ? candidate.requestedAt : new Date(0).toISOString(),
        }];
    });
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
