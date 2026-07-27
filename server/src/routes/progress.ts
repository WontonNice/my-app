import { Router } from "express";
import { randomUUID } from "node:crypto";
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
    status: "in_progress" | "submitted";
    submittedAt?: string;
    updatedAt: string;
};
type VanRide = "none" | "5pm";
const examSessionResultPrefix = "__exam_session__:";

function isDate(value: unknown): value is string {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTime(value: unknown): value is string {
    return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function getDismissal(user: User) {
    const stored = user.user_metadata.dismissal;
    const candidate = stored && typeof stored === "object" && !Array.isArray(stored)
        ? stored as Record<string, unknown>
        : {};
    const vanRide: VanRide = candidate.vanRide === "5pm" ? candidate.vanRide : "none";
    const earlyPickupDates = Array.isArray(candidate.earlyPickupDates)
        ? candidate.earlyPickupDates.filter(isDate)
        : [];
    const earlyPickupTimes = candidate.earlyPickupTimes && typeof candidate.earlyPickupTimes === "object" && !Array.isArray(candidate.earlyPickupTimes)
        ? Object.fromEntries(Object.entries(candidate.earlyPickupTimes as Record<string, unknown>).filter(([date, time]) => isDate(date) && isTime(time)))
        : {};
    return { earlyPickupDates: [...new Set(earlyPickupDates)].sort(), earlyPickupTimes, vanRide };
}

function getMetadataExamSessions(user: User) {
    const stored = user.user_metadata.exam_sessions;
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
    return stored as Record<string, ExamSessionProgress>;
}

function normalizeExamSession(value: unknown): ExamSessionProgress | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const candidate = value as Record<string, unknown>;
    const answers =
        candidate.answers && typeof candidate.answers === "object" && !Array.isArray(candidate.answers)
            ? candidate.answers as JsonRecord
            : {};
    const completedSections = Array.isArray(candidate.completedSections)
        ? candidate.completedSections.filter(
            (section): section is "english" | "math" => section === "english" || section === "math",
        )
        : [];
    return {
        answers,
        completedSections,
        status: candidate.status === "submitted" ? "submitted" : "in_progress",
        ...(typeof candidate.submittedAt === "string" ? { submittedAt: candidate.submittedAt } : {}),
        updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : new Date().toISOString(),
    };
}

async function getExamSessions(user: User): Promise<Record<string, ExamSessionProgress>> {
    const [query, resultFallback] = await Promise.all([
        supabase
            .from("student_exam_sessions")
            .select("assessment_id,answers,completed_sections,status,updated_at,submitted_at")
            .eq("user_id", user.id),
        supabase
            .from("student_exam_results")
            .select("assessment_id,result")
            .eq("user_id", user.id)
            .like("assessment_id", `${examSessionResultPrefix}%`),
    ]);
    if (query.error && resultFallback.error) return getMetadataExamSessions(user);

    const fallbackSessions = resultFallback.error
        ? {}
        : Object.fromEntries((resultFallback.data ?? []).flatMap((row) => {
            const session = normalizeExamSession(row.result);
            return session
                ? [[String(row.assessment_id).slice(examSessionResultPrefix.length), session]]
                : [];
        }));

    const dedicatedSessions = query.error ? {} : Object.fromEntries((query.data ?? []).map((row) => [
        row.assessment_id,
        {
            answers:
                row.answers && typeof row.answers === "object" && !Array.isArray(row.answers)
                    ? row.answers as JsonRecord
                    : {},
            completedSections: Array.isArray(row.completed_sections)
                ? row.completed_sections.filter(
                    (section): section is "english" | "math" => section === "english" || section === "math",
                )
                : [],
            status: row.status === "submitted" ? "submitted" : "in_progress",
            ...(typeof row.submitted_at === "string" ? { submittedAt: row.submitted_at } : {}),
            updatedAt: typeof row.updated_at === "string" ? row.updated_at : new Date().toISOString(),
        },
    ]));
    return { ...fallbackSessions, ...dedicatedSessions };
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

    const metadataProgress = getMetadataProgress(user);
    if (examQuery.error || practiceQuery.error) return metadataProgress;

    const examResults = (examQuery.data ?? []).filter(
        (row) => !String(row.assessment_id).startsWith(examSessionResultPrefix),
    ).map((row) => {
        const result = row.result && typeof row.result === "object" && !Array.isArray(row.result) ? row.result as JsonRecord : {};
        return { ...result, assessmentId: result.assessmentId ?? row.assessment_id };
    });
    const databaseAssessmentIds = new Set(examResults.map((result) => result.assessmentId));
    const fallbackExamResults = metadataProgress.examResults.filter(
        (result) => !databaseAssessmentIds.has(result.assessmentId),
    );
    const practice = {
        ...metadataProgress.practice,
        ...Object.fromEntries((practiceQuery.data ?? []).map((row) => [row.topic_slug, row.progress as JsonRecord])),
    };
    return { examResults: [...examResults, ...fallbackExamResults], practice };
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
        const [progress, examSessions] = await Promise.all([
            getDatabaseProgress(student),
            getExamSessions(student),
        ]);
        return {
            classes: getEnrolledClassIds(student.app_metadata),
            dismissal: getDismissal(student),
            email: student.email ?? "",
            fullName: typeof student.user_metadata.full_name === "string" ? student.user_metadata.full_name : student.email?.split("@")[0] ?? "Student",
            id: student.id,
            insights: createInsights(progress),
            lastLoginAt: student.last_sign_in_at ?? null,
            examSessions,
            progress,
            username: typeof student.user_metadata.username === "string" ? student.user_metadata.username : student.email?.split("@")[0] ?? "student",
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
    response.json({ sessions: await getExamSessions(user) });
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
    const status: "in_progress" | "submitted" =
        request.body?.status === "submitted" ? "submitted" : "in_progress";
    const existingSession = (await getExamSessions(user))[request.params.assessmentId];
    const mergedAnswers = {
        ...(existingSession?.answers ?? {}),
        ...(answers as JsonRecord),
    };
    const updatedAt = new Date().toISOString();
    const session: ExamSessionProgress = {
        answers: mergedAnswers,
        completedSections: [...new Set(normalizedSections)],
        status,
        ...(status === "submitted" ? { submittedAt: updatedAt } : {}),
        updatedAt,
    };
    const saved = await supabase.from("student_exam_sessions").upsert({
        answers: mergedAnswers,
        assessment_id: request.params.assessmentId,
        completed_sections: session.completedSections,
        status,
        submitted_at: status === "submitted" ? updatedAt : null,
        updated_at: updatedAt,
        user_id: user.id,
    }, { onConflict: "user_id,assessment_id" });
    if (saved.error) {
        const resultFallback = await supabase.from("student_exam_results").upsert({
            assessment_id: `${examSessionResultPrefix}${request.params.assessmentId}`,
            completed_at: session.submittedAt ?? updatedAt,
            result: session,
            updated_at: updatedAt,
            user_id: user.id,
        }, { onConflict: "user_id,assessment_id" });
        if (!resultFallback.error) {
            response.json({ session, storage: "results-database-fallback" });
            return;
        }
        const sessions = getMetadataExamSessions(user);
        const updated = await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
                ...user.user_metadata,
                exam_sessions: { ...sessions, [request.params.assessmentId]: session },
            },
        });
        if (updated.error) {
            response.status(400).json({ message: resultFallback.error.message });
            return;
        }
        response.json({ session, storage: "metadata-fallback" });
        return;
    }
    response.json({ session, storage: "database" });
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
    if (vanRide !== undefined && vanRide !== "none" && vanRide !== "5pm") {
        response.status(400).json({ message: "Van ride must be none or 5pm." });
        return;
    }
    const date = request.body?.date;
    const pickedUpEarly = request.body?.pickedUpEarly;
    const pickupTime = request.body?.pickupTime;
    if (pickedUpEarly !== undefined && (typeof pickedUpEarly !== "boolean" || !isDate(date))) {
        response.status(400).json({ message: "A valid date is required when updating early pickup." });
        return;
    }
    if (pickedUpEarly === true && !isTime(pickupTime)) {
        response.status(400).json({ message: "Enter a valid pickup time before marking early pickup." });
        return;
    }

    const dates = new Set(current.earlyPickupDates);
    const earlyPickupTimes = { ...current.earlyPickupTimes };
    if (pickedUpEarly === true) dates.add(date as string);
    if (pickedUpEarly === true) earlyPickupTimes[date as string] = pickupTime as string;
    if (pickedUpEarly === false) {
        dates.delete(date as string);
        delete earlyPickupTimes[date as string];
    }
    const dismissal = {
        earlyPickupDates: [...dates].sort(),
        earlyPickupTimes,
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

progressRouter.post("/students/:studentId/manual-exam-results", async (request, response) => {
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

    const studentResult = await supabase.auth.admin.getUserById(request.params.studentId);
    const student = studentResult.data.user;
    if (studentResult.error || !student || getUserRole(student) !== "student") {
        response.status(404).json({ message: "Student not found." });
        return;
    }

    const title = typeof request.body?.title === "string" ? request.body.title.trim() : "";
    const completedDate = request.body?.completedDate;
    const englishCorrect = request.body?.englishCorrect;
    const englishTotal = request.body?.englishTotal;
    const mathCorrect = request.body?.mathCorrect;
    const mathTotal = request.body?.mathTotal;
    const scores = [englishCorrect, englishTotal, mathCorrect, mathTotal];
    if (!title || !isDate(completedDate)) {
        response.status(400).json({ message: "Enter an exam title and valid test date." });
        return;
    }
    if (
        scores.some((score) => typeof score !== "number" || !Number.isFinite(score) || score < 0) ||
        englishTotal <= 0 ||
        mathTotal <= 0 ||
        englishCorrect > englishTotal ||
        mathCorrect > mathTotal
    ) {
        response.status(400).json({ message: "Enter valid English and Math scores with earned points no greater than possible points." });
        return;
    }

    const assessmentId = `manual-${randomUUID()}`;
    const completedAt = new Date(`${completedDate}T12:00:00.000Z`).toISOString();
    const correct = englishCorrect + mathCorrect;
    const total = englishTotal + mathTotal;
    const result: JsonRecord = {
        answers: {},
        assessmentId,
        completedAt,
        completedSections: ["english", "math"],
        completionStatus: "complete",
        correct,
        passages: [],
        percentage: Math.round((correct / total) * 100),
        questionTypes: [],
        recordedByTeacherId: authenticated.user.id,
        source: "manual",
        subjects: [
            {
                correct: englishCorrect,
                subject: "English Language Arts",
                topics: [],
                total: englishTotal,
            },
            {
                correct: mathCorrect,
                subject: "Mathematics",
                topics: [],
                total: mathTotal,
            },
        ],
        title,
        topics: [],
        total,
    };

    const saved = await supabase.from("student_exam_results").upsert({
        assessment_id: assessmentId,
        completed_at: completedAt,
        result,
        updated_at: new Date().toISOString(),
        user_id: student.id,
    }, { onConflict: "user_id,assessment_id" });
    if (saved.error) {
        const progress = getMetadataProgress(student);
        const fallback = await saveMetadataProgress(student, {
            ...progress,
            examResults: [result, ...progress.examResults],
        });
        if (fallback.error) {
            response.status(400).json({ message: saved.error.message });
            return;
        }
    }

    response.status(201).json({ result });
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
