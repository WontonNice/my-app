import type { AuthUser } from "../authStorage";

type StudentDashboardProps = {
    authUser: AuthUser;
    onLogout: () => void;
    onOpenCoursePage: (course: string) => void;
};

function StudentDashboard({ authUser, onLogout, onOpenCoursePage }: StudentDashboardProps) {
    const enrolledCourses = Array.isArray(authUser.enrolledCourses)
        ? authUser.enrolledCourses.filter((course): course is string => typeof course === "string" && course.trim().length > 0)
        : [];

    return (
        <>
            <h1>Student Dashboard</h1>
            <p>Welcome, {authUser.firstName || authUser.username}</p>

            <table style={{ borderCollapse: "collapse", marginBottom: 16 }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: 8 }}>Enrolled Courses</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>
                            {enrolledCourses.length === 0 ? (
                                <span>please enroll in a course</span>
                            ) : (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {enrolledCourses.map((course) => (
                                        <button
                                            type="button"
                                            key={course}
                                            onClick={() => {
                                                onOpenCoursePage(course);
                                            }}
                                        >
                                            {course}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <button onClick={onLogout}>Logout</button>
        </>
    );
}

export default StudentDashboard;