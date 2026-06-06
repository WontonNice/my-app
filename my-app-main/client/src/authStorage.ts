export type UserRole = "student" | "teacher";

export type AuthUser = {
    role: UserRole;
    username: string;
    firstName: string | null;
    lastName: string | null;
    enrolledCourses: string[];
};

const AUTH_USER_STORAGE_KEY = "tutorsite_auth_user";

export function getStoredAuthUser(): AuthUser | null {
    if (typeof window === "undefined") return null;

    const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!storedUser) return null;

    try {
        const parsed = JSON.parse(storedUser) as Partial<AuthUser>;
        const role = parsed.role === "teacher" ? "teacher" : "student";
        const username = typeof parsed.username === "string" ? parsed.username : "";
        const firstName = typeof parsed.firstName === "string" ? parsed.firstName : null;
        const lastName = typeof parsed.lastName === "string" ? parsed.lastName : null;
        const enrolledCourses = Array.isArray(parsed.enrolledCourses)
            ? parsed.enrolledCourses.filter(
                (course): course is string => typeof course === "string" && course.trim().length > 0
            )
            : [];

        if (!username) return null;

        return { role, username, firstName, lastName, enrolledCourses };
    } catch {
        return null;
    }
}

export function setStoredAuthUser(user: AuthUser | null): void {
    if (typeof window === "undefined") return;

    if (user) {
        window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
        return;
    }

    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}