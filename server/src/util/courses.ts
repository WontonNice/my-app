export function normalizeCourses(courses: unknown): string[] {
    if (Array.isArray(courses)) {
        return courses
            .filter((course): course is string => typeof course === "string")
            .map((course) => course.trim())
            .filter(Boolean);
    }

    if (typeof courses !== "string") {
        return [];
    }

    const trimmedCourses = courses.trim();
    if (!trimmedCourses) {
        return [];
    }

    if (
        (trimmedCourses.startsWith("[") && trimmedCourses.endsWith("]")) ||
        (trimmedCourses.startsWith("{") && trimmedCourses.endsWith("}"))
    ) {
        try {
            return normalizeCourses(JSON.parse(trimmedCourses) as unknown);
        } catch {
            // Fall back to comma-delimited parsing below.
        }
    }

    return trimmedCourses
        .split(",")
        .map((course) => course.trim())
        .filter(Boolean);
}
