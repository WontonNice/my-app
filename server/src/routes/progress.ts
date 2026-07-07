import { Router } from "express";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole } from "../lib/auth";
import { supabase } from "../lib/supabase";

type JsonRecord = Record<string, unknown>;
type LearningProgress = {
    examResults: JsonRecord[];
    practice: Record<string, JsonRecord>;
};
type ExamSessionProgress = {
    answers: JsonRecord;
    completedSections: ("english" | "math")[];
    updatedAt: string;
};
type VanRide = "none" | "2pm" | "5pm";

function getDismissal(user: User) {
    const stored = user.user_metadata.dismissal;
    const candidate = stored && typeof stored === "object" && !Array.isArray(stored)
        ? stored as Record<string, unknown>
        : {};
    const vanRide: VanRide = candidate.vanRide === "2pm" || candidate.vanRide === "5pm" ? candidate.vanRide : "none";
    const earlyPickupDates = Array.isArray(candidate.earlyPickupDates)
        ? candidate.earlyPickupDates.filter((value): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value))
        : [];
    return { earlyPickupDates: [...new Set(earlyPickupDates)].sort(), vanRide };
}

function getExamSessions(user: User) {
    const stored = user.user_metadata.exam_sessions;
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
    return stored as Record<string, ExamSessionProgress>;
}

function getMetadataProgress(user: User): LearningProgress {
    const stored = user.user_metadata.learning_progress;
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return { examResults: [], practice: {} };
    const candidate = stored as Partial<LearningProgress>;
    return {
        examResults: Array.isArray(candidate.examResults) ? candidate.examResults : [],
        practice: candidate.practice && typeof candidate.practice === "object" && !Array.isArray(candidate.practice)
            ? candidate.practice as Record<string, JsonRecord>
            : {},
    };
}

async function getDatabaseProgress(user: User): Promise<LearningProgress> {
    const [examQuery, practiceQuery] = await Promise.all([
        supabase.from("student_exam_results").select("assessment_id,result").eq("user_id", user.id),
        supabase.from("student_practice_progress").select("topic_slug,progress").eq("user_id", user.id),
    ]);

    if (examQuery.error || practiceQuery.error) return getMetadataProgress(user);

    const examResults = (examQuery.data ?? []).map((row) => {
        const result = row.result && typeof row.result === "object" && !Array.isArray(row.result) ? row.result as JsonRecord : {};
        return { ...result, assessmentId: result.assessmentId ?? row.assessment_id };
    });
    const practice = Object.fromEntries((practiceQuery.data ?? []).map((row) => [row.topic_slug, row.progress as JsonRecord]));
    return { examResults, practice };
}

async function saveMetadataProgress(user: User, progress: LearningProgress) {
    return supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, learning_progress: progress },
    });
}

function numberValue(value: unknown) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function practiceTotals(item: JsonRecord) {
    const nested = Object.values(item).filter((value): value is JsonRecord => Boolean(value) && typeof value === "object" && !Array.isArray(value));
    if (nested.length) {
        return nested.reduce<{ correct: number; questions: number }>((totals, value) => ({
            correct: totals.correct + numberValue(value.correct),
            questions: totals.questions + numberValue(value.answered ?? value.total ?? value.questionsAnswered),
        }), { correct: 0, questions: 0 });
    }
    return { correct: numberValue(item.correct), questions: numberValue(item.answered ?? item.total ?? item.questionsAnswered) };
}

function createInsights(progress: LearningProgress) {
    const completedResults = progress.examResults.filter((result) => result.completionStatus !== "english_complete");
    const scores = completedResults.map((result) => numberValue(result.percentage));
    const topicTotals = Object.values(progress.practice).map(practiceTotals);
    const questions = topicTotals.reduce((total, item) => total + item.questions, 0);
    const correct = topicTotals.reduce((total, item) => total + item.correct, 0);
    return {
        averageTestScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null,
        bestTestScore: scores.length ? Math.max(...scores) : null,
        practiceAccuracy: questions ? Math.round((correct / questions) * 100) : null,
        practiceAttempts: topicTotals.filter((item) => item.questions > 0).length,
        testsCompleted: scores.length,
    };
}

export const progressRouter = Router();

progressRouter.get("/", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    response.json({ progress: await getDatabaseProgress(user) });
});

progressRouter.get("/students", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "teacher" && role !== "admin") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) {
        response.status(400).json({ message: listed.error.message });
        return;
    }
    const students = listed.data.users.filter((candidate) => getUserRole(candidate) === "student");
    const snapshots = await Promise.all(students.map(async (student) => {
        const progress = await getDatabaseProgress(student);
        return {
            classes: getEnrolledClassIds(student.app_metadata),
            dismissal: getDismissal(student),
            email: student.email ?? "",
            fullName: typeof student.user_metadata.full_name === "string" ? student.user_metadata.full_name : student.email?.split("@")[0] ?? "Student",
            id: student.id,
            insights: createInsights(progress),
            lastLoginAt: student.last_sign_in_at ?? null,
            progress,
        };
    }));

    response.json({ students: snapshots.sort((left, right) => left.fullName.localeCompare(right.fullName)) });
});

progressRouter.get("/exam-sessions", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    response.json({ sessions: getExamSessions(user) });
});

progressRouter.put("/exam-sessions/:assessmentId", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    const answers = request.body?.answers;
    const completedSections = request.body?.completedSections;
    if (!answers || typeof answers !== "object" || Array.isArray(answers) || !Array.isArray(completedSections)) {
        response.status(400).json({ message: "Valid exam session progress is required." });
        return;
    }
    const normalizedSections = completedSections.filter(
        (section: unknown): section is "english" | "math" => section === "english" || section === "math",
    );
    const sessions = getExamSessions(user);
    const session: ExamSessionProgress = {
        answers: answers as JsonRecord,
        completedSections: [...new Set(normalizedSections)],
        updatedAt: new Date().toISOString(),
    };
    const nextSessions = normalizedSections.length
        ? { ...sessions, [request.params.assessmentId]: session }
        : Object.fromEntries(Object.entries(sessions).filter(([id]) => id !== request.params.assessmentId));
    const updated = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, exam_sessions: nextSessions },
    });
    if (updated.error) {
        response.status(400).json({ message: updated.error.message });
        return;
    }
    response.json({ session: normalizedSections.length ? session : null });
});

progressRouter.patch("/students/:studentId/dismissal", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "teacher" && role !== "admin") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const result = await supabase.auth.admin.getUserById(request.params.studentId);
    const student = result.data.user;
    if (result.error || !student || getUserRole(student) !== "student") {
        response.status(404).json({ message: "Student not found." });
        return;
    }

    const current = getDismissal(student);
    const vanRide = request.body?.vanRide;
    if (vanRide !== undefined && vanRide !== "none" && vanRide !== "2pm" && vanRide !== "5pm") {
        response.status(400).json({ message: "Van ride must be none, 2pm, or 5pm." });
        return;
    }
    const date = request.body?.date;
    const pickedUpEarly = request.body?.pickedUpEarly;
    if (pickedUpEarly !== undefined && (typeof pickedUpEarly !== "boolean" || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
        response.status(400).json({ message: "A valid date is required when updating early pickup." });
        return;
    }

    const dates = new Set(current.earlyPickupDates);
    if (pickedUpEarly === true) dates.add(date as string);
    if (pickedUpEarly === false) dates.delete(date as string);
    const dismissal = {
        earlyPickupDates: [...dates].sort(),
        vanRide: (vanRide ?? current.vanRide) as VanRide,
    };
    const updated = await supabase.auth.admin.updateUserById(student.id, {
        user_metadata: { ...student.user_metadata, dismissal },
    });
    if (updated.error) {
        response.status(400).json({ message: updated.error.message });
        return;
    }
    response.json({ dismissal });
});

progressRouter.put("/exam-results/:assessmentId", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    const result = request.body?.result;
    if (!result || typeof result !== "object" || Array.isArray(result)) {
        response.status(400).json({ message: "A valid exam result is required." });
        return;
    }
    const assessmentId = request.params.assessmentId;
    const saved = await supabase.from("student_exam_results").upsert({
        assessment_id: assessmentId,
        completed_at: typeof result.completedAt === "string" ? result.completedAt : new Date().toISOString(),
        result,
        updated_at: new Date().toISOString(),
        user_id: user.id,
    }, { onConflict: "user_id,assessment_id" });
    if (saved.error) {
        const progress = getMetadataProgress(user);
        const nextProgress = {
            ...progress,
            examResults: [result as JsonRecord, ...progress.examResults.filter((item) => item.assessmentId !== assessmentId)],
        };
        const fallback = await saveMetadataProgress(user, nextProgress);
        if (fallback.error) {
            response.status(400).json({ message: saved.error.message });
            return;
        }
        response.status(503).json({ message: "Your result was backed up, but the results database did not confirm the save. Please submit again." });
        return;
    }
    response.json({ progress: await getDatabaseProgress(user), storage: "database" });
});

progressRouter.put("/practice/:topicSlug", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    const topicProgress = request.body?.progress;
    if (!topicProgress || typeof topicProgress !== "object" || Array.isArray(topicProgress)) {
        response.status(400).json({ message: "Valid practice progress is required." });
        return;
    }
    const saved = await supabase.from("student_practice_progress").upsert({
        progress: topicProgress,
        topic_slug: request.params.topicSlug,
        updated_at: new Date().toISOString(),
        user_id: user.id,
    }, { onConflict: "user_id,topic_slug" });
    if (saved.error) {
        const progress = getMetadataProgress(user);
        const nextProgress = { ...progress, practice: { ...progress.practice, [request.params.topicSlug]: topicProgress as JsonRecord } };
        const fallback = await saveMetadataProgress(user, nextProgress);
        if (fallback.error) {
            response.status(400).json({ message: saved.error.message });
            return;
        }
        response.json({ progress: nextProgress });
        return;
    }
    response.json({ progress: await getDatabaseProgress(user) });
});
