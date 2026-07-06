import { Router } from "express";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole } from "../lib/auth";
import { supabase } from "../lib/supabase";

type JsonRecord = Record<string, unknown>;
type LearningProgress = {
    examResults: JsonRecord[];
    practice: Record<string, JsonRecord>;
};

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
    const scores = progress.examResults.map((result) => numberValue(result.percentage));
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
        response.json({ progress: nextProgress });
        return;
    }
    response.json({ progress: await getDatabaseProgress(user) });
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
