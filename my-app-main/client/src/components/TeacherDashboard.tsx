import { useEffect, useState } from "react";
import type { AuthUser } from "../authStorage";

type TeacherDashboardProps = {
    authUser: AuthUser;
    onLogout: () => void;
};

type Student = {
    id: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    enrolled_courses: string[];
};

const API_BASE =
    import.meta.env.VITE_API_BASE_URL?.trim() || "";

const COURSES = ["precalc", "b", "c"] as const;

function TeacherDashboard({ authUser, onLogout }: TeacherDashboardProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    async function loadStudents() {
        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${API_BASE}/students`);
            const result = (await response.json()) as { data?: Student[]; error?: string };

            if (!response.ok) {
                setMessage(result.error || "Could not load students");
                return;
            }

            setStudents(Array.isArray(result.data) ? result.data : []);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setMessage(`Could not reach backend at ${API_BASE}. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadStudents();
    }, []);

    async function assignCourse(studentId: string, course: string) {
        setMessage("");

        try {
            const response = await fetch(`${API_BASE}/students/${studentId}/assign-course`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course }),
            });

            const result = (await response.json()) as { data?: Student; error?: string };

            if (!response.ok || !result.data) {
                setMessage(result.error || "Could not assign course");
                return;
            }

            setStudents((previousStudents) =>
                previousStudents.map((student) =>
                    student.id === studentId && result.data ? result.data : student
                )
            );

            setMessage(`Assigned course ${course} to ${result.data.username}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setMessage(`Could not reach backend at ${API_BASE}. ${errorMessage}`);
        }
    }

    return (
        <>
            <h1>Teacher Dashboard</h1>
            <p>Welcome, {authUser.firstName || authUser.username}</p>

            <h2>Assign Courses</h2>

            {isLoading ? (
                <p>Loading students...</p>
            ) : (
                <table style={{ borderCollapse: "collapse", marginBottom: 16, width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Student</th>
                            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Enrolled Courses</th>
                            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Assign</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => {
                            const fullName = [student.first_name, student.last_name]
                                .filter((value): value is string => Boolean(value && value.trim()))
                                .join(" ");

                            return (
                                <tr key={student.id}>
                                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                                        {fullName || student.username}
                                    </td>
                                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                                        {student.enrolled_courses.length === 0
                                            ? "please enroll in a course"
                                            : student.enrolled_courses.join(", ")}
                                    </td>
                                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            {COURSES.map((course) => (
                                                <button
                                                    key={`${student.id}-${course}`}
                                                    type="button"
                                                    onClick={() => {
                                                        void assignCourse(student.id, course);
                                                    }}
                                                >
                                                    {course}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {message && <p aria-live="polite">{message}</p>}

            <button onClick={onLogout}>Logout</button>
        </>
    );
}

export default TeacherDashboard;