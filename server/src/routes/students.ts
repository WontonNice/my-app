import { Router } from "express";
import { normalizeCourses } from "../util/courses";
import supabase from "../util/supabase";

const router = Router();

type StudentRecord = {
    id: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    enrolled_courses: unknown;
};

router.get("/", async (_req, res) => {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, first_name, last_name, enrolled_courses")
        .eq("role", "student")
        .order("created_at", { ascending: true });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    const students = (data ?? []).map((student) => {
        const typedStudent = student as StudentRecord;

        return {
            id: typedStudent.id,
            username: typedStudent.username,
            first_name: typedStudent.first_name,
            last_name: typedStudent.last_name,
            enrolled_courses: normalizeCourses(typedStudent.enrolled_courses),
        };
    });

    res.status(200).json({ data: students });
});

router.post("/:studentId/assign-course", async (req, res) => {
    const { studentId } = req.params;
    const { course } = req.body ?? {};

    if (typeof studentId !== "string" || !studentId.trim()) {
        res.status(400).json({ error: "Missing student id" });
        return;
    }

    if (typeof course !== "string" || !course.trim()) {
        res.status(400).json({ error: "Missing course" });
        return;
    }

    const normalizedCourse = course.trim();

    const { data: student, error: readError } = await supabase
        .from("users")
        .select("id, username, first_name, last_name, enrolled_courses")
        .eq("id", studentId)
        .eq("role", "student")
        .single();

    if (readError || !student) {
        res.status(404).json({ error: "Student not found" });
        return;
    }

    const studentRecord = student as StudentRecord;
    const existingCourses = normalizeCourses(studentRecord.enrolled_courses);
    const updatedCourses = existingCourses.includes(normalizedCourse)
        ? existingCourses
        : [...existingCourses, normalizedCourse];

    const { data: updatedStudent, error: updateError } = await supabase
        .from("users")
        .update({ enrolled_courses: updatedCourses })
        .eq("id", studentId)
        .select("id, username, first_name, last_name, enrolled_courses")
        .single();

    if (updateError || !updatedStudent) {
        res.status(500).json({ error: "Failed to update enrolled courses" });
        return;
    }

    const typedUpdatedStudent = updatedStudent as StudentRecord;

    res.status(200).json({
        data: {
            id: typedUpdatedStudent.id,
            username: typedUpdatedStudent.username,
            first_name: typedUpdatedStudent.first_name,
            last_name: typedUpdatedStudent.last_name,
            enrolled_courses: normalizeCourses(typedUpdatedStudent.enrolled_courses),
        },
    });
});

export default router;
