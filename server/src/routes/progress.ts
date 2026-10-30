import { assessmentAccessErrorHandler, resolveAssessmentAccess, resolveAssessmentAccessList } from '../lib/assessmentAccess';
import { contentForExamAttempt } from "../lib/examResume";
import { preserveSubmittedSections } from "../shared/examResume";
import { isFullExamResult, submittedExamSections } from "../shared/examCompletion";
import { createExamResult, type SelectedAnswers } from "../shared/examGrading";
import type { ExamContent } from "../shared/examTypes";
import { Router } from "express";
import { randomUUID } from "node:crypto";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole, isStudentArchived } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { loadStudentProgressRows, type ProgressRows } from "../lib/studentProgressRows";
import { recordPlanCompletion, recordPracticePlanCompletion } from "../lib/learningPlanStore";
import { readExamReentries, withExamWriteLock } from "../lib/examReentry";
import { examAttemptId } from "../shared/examReentry";
import { normalizeExamNavigation, type ExamNavigation } from "../shared/examNavigation";
import { findAssessmentForStudent as configuredFindAssessmentForStudent, listTeacherAssessments as configuredListTeacherAssessments } from "../config/assessments";
import { hasAssignedContent } from "../lib/learningPlanStore";
import { getExamContent } from "../lib/examContent";
const findAssessmentForStudent = (id: string, classes: string[]) => resolveAssessmentAccess(configuredFindAssessmentForStudent(id, classes));
const listTeacherAssessments = () => resolveAssessmentAccessList(configuredListTeacherAssessments());


type JsonRecord = Record<string, unknown>;
type LearningProgress = {
    examHistory?: JsonRecord[];
    examResults: JsonRecord[];
    practice: Record<string, JsonRecord>;
};
type ExamSessionProgress = {
    navigation?: ExamNavigation;
    answers: JsonRecord;
    completedSections: ("english" | "math")[];
    status: "in_progress" | "submitted";
    submittedAt?: string;
    updatedAt: string;
};
type VanRide = "none" | "5pm";
const examSessionResultPrefix = "__exam_session__:";
const libraryProgressPrefix = "english-library:";

function isReservedExamId(assessmentId: string) {
    return assessmentId.startsWith("__") || assessmentId.startsWith("answer-sheet:");
}

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
        navigation: normalizeExamNavigation(candidate.navigation),
        status: candidate.status === "submitted" ? "submitted" : "in_progress",
        ...(typeof candidate.submittedAt === "string" ? { submittedAt: candidate.submittedAt } : {}),
        updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : new Date().toISOString(),
    };
}

async function getExamSessions(user: User): Promise<Record<string, ExamSessionProgress>> {
    const [query, resultFallback] = await Promise.all([
        supabase
            .from("student_exam_sessions")
            .select("assessment_id,answers,completed_sections,status,updated_at,submitted_at,navigation")
            .eq("user_id", user.id),
        supabase
            .from("student_exam_results")
            .select("assessment_id,result")
            .eq("user_id", user.id)
            .like("assessment_id", `${examSessionResultPrefix}%`),
    ]);
    return mergeExamSessions(user, query, resultFallback);
}

function mergeExamSessions(user: User, query: ProgressRows, resultFallback: ProgressRows): Record<string, ExamSessionProgress> {
    if (query.error && resultFallback.error) return getMetadataExamSessions(user);

    const fallbackSessions = resultFallback.error
        ? {}
        : Object.fromEntries((resultFallback.data ?? []).flatMap((row) => {
            const session = normalizeExamSession(row.result);
            return session
                ? [[String(row.assessment_id).slice(examSessionResultPrefix.length), session]]
                : [];
        }));

    const dedicatedSessions: Record<string, ExamSessionProgress> = query.error ? {} : Object.fromEntries((query.data ?? []).map((row) => [
        String(row.assessment_id),
        {
            navigation: normalizeExamNavigation(row.navigation),
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
    const sessions: Record<string, ExamSessionProgress> = { ...getMetadataExamSessions(user), ...fallbackSessions };
    for (const [id, session] of Object.entries(dedicatedSessions)) {
        if (!sessions[id] || Date.parse(session.updatedAt) >= Date.parse(sessions[id].updatedAt)) sessions[id] = session;
    }
    return sessions;
}

function getMetadataProgress(user: User): LearningProgress {
    const stored = user.user_metadata.learning_progress;
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return { examResults: [], practice: {} };
    const candidate = stored as Partial<LearningProgress>;
    return {
        examResults: Array.isArray(candidate.examResults) ? candidate.examResults.filter(result => result && typeof result === "object" && !Array.isArray(result) && result.source !== "answer_sheet" && !String(result.assessmentId ?? "").startsWith("answer-sheet:")) : [],
        practice: candidate.practice && typeof candidate.practice === "object" && !Array.isArray(candidate.practice)
            ? Object.fromEntries(Object.entries(candidate.practice).filter(([key]) => !key.startsWith("answer-sheet:"))) as Record<string, JsonRecord>
            : {},
    };
}

export async function getDatabaseProgress(user: User): Promise<LearningProgress> {
    const [examQuery, practiceQuery] = await Promise.all([
        supabase.from("student_exam_results").select("assessment_id,result").eq("user_id", user.id),
        supabase.from("student_practice_progress").select("topic_slug,progress").eq("user_id", user.id),
    ]);

    return mergeDatabaseProgress(user, examQuery, practiceQuery);
}

function mergeDatabaseProgress(user: User, examQuery: ProgressRows, practiceQuery: ProgressRows): LearningProgress {
    const metadataProgress = getMetadataProgress(user);
    if (examQuery.error || practiceQuery.error) return metadataProgress;

    const examResults = (examQuery.data ?? []).filter(
        (row) => !String(row.assessment_id).startsWith("__"),
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
        ...Object.fromEntries((practiceQuery.data ?? [])
            .filter((row) => !String(row.topic_slug).startsWith(libraryProgressPrefix) && !String(row.topic_slug).startsWith("answer-sheet:"))
            .map((row) => [row.topic_slug, row.progress as JsonRecord])),
    };
    const examHistory = (examQuery.data ?? []).filter(row => String(row.assessment_id).startsWith("__exam_history__:")).map(row => {
        const result = row.result as JsonRecord;
        return Object.fromEntries(Object.entries(result).filter(([key]) => !["answers", "analysisContent", "questionTimes"].includes(key)));
    });
    return { examResults: [...examResults, ...fallbackExamResults], examHistory, practice };
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
    const completedResults = [...progress.examResults, ...(progress.examHistory ?? [])].filter((result) =>
        isFullExamResult(result)
    );
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
    const students = listed.data.users.filter(
        (candidate) => getUserRole(candidate) === "student" && !isStudentArchived(candidate),
    );
    let rows: Awaited<ReturnType<typeof loadStudentProgressRows>>;
    try {
        rows = await loadStudentProgressRows(students.map(student => student.id));
    } catch {
        response.status(503).json({ message: "Student progress is temporarily unavailable. Please try again." });
        return;
    }
    const snapshots = students.map((student) => {
        const exams = rows.exams(student.id);
        const progress = mergeDatabaseProgress(student, exams, rows.practice(student.id));
        const examSessions = mergeExamSessions(student, rows.sessions(student.id), {
            ...exams,
            data: exams.data?.filter(row => String(row.assessment_id).startsWith(examSessionResultPrefix)) ?? null,
        });
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
    });

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
    const assessmentId = request.params.assessmentId;
    if (isReservedExamId(assessmentId) || (request.body?.assessmentId !== undefined && request.body.assessmentId !== assessmentId)) {
        response.status(400).json({ message: "The exam session must match the requested assessment." }); return;
    }
    const configuredAssessment = (await listTeacherAssessments()).find(assessment => assessment.id === assessmentId);
    if (!configuredAssessment) { response.status(404).json({ message: "Assessment was not found." }); return; }
    if (getUserRole(user) === "student" && !getEnrolledClassIds(user.app_metadata).includes(configuredAssessment.classId)) {
        response.status(403).json({ message: "You are not enrolled for this assessment." }); return;
    }
    if (!answers || typeof answers !== "object" || Array.isArray(answers) || !Array.isArray(completedSections)) {
        response.status(400).json({ message: "Valid exam session progress is required." });
        return;
    }
    return withExamWriteLock(user.id, request.params.assessmentId, async () => {
    const normalizedSections = completedSections.filter(
        (section: unknown): section is "english" | "math" => section === "english" || section === "math",
    );
    const status: "in_progress" | "submitted" =
        request.body?.status === "submitted" ? "submitted" : "in_progress";
    const { grants, records } = await readExamReentries(user.id);
    const openExam = configuredAssessment.status === "open";
    const reentry = openExam ? undefined : grants[request.params.assessmentId];
    const suppliedGrantId = openExam ? undefined : request.body?.reentryGrantId;
    if (suppliedGrantId && (!reentry || reentry.id !== suppliedGrantId || reentry.revokedAt)) {
        response.status(403).json({ message: "Your teacher revoked or replaced this re-entry permission. Return to assessments." }); return;
    }
    if (reentry?.remainingSections.length && suppliedGrantId !== reentry.id) {
        response.status(409).json({ message: "Your teacher reopened this exam. Reload it to use the updated permission." }); return;
    }
    if (!openExam && getUserRole(user) === "student" && !reentry?.remainingSections.length && !(await hasAssignedContent(user.id, "exam", assessmentId, true))) {
        response.status(403).json({ message: "Your teacher has locked this exam." }); return;
    }
    const existingSession = (await getExamSessions(user))[request.params.assessmentId];
    const navigation = normalizeExamNavigation(request.body?.navigation);
    if (request.body?.navigation !== undefined && (!navigation ||
        (request.body.navigation.english !== undefined && !navigation.english) ||
        (request.body.navigation.math !== undefined && !navigation.math))) {
        response.status(400).json({ message: "Valid exam resume positions are required." }); return;
    }
    const submitted = records.get(request.params.assessmentId);
    const globalRetake = !suppliedGrantId && submitted && isFullExamResult(submitted) && configuredAssessment?.status === "open" && configuredAssessment.allowCompletedAccess;
    const protectedSections = submitted && !globalRetake ? submittedExamSections(submitted).filter(section => !reentry?.remainingSections.includes(section) && (!openExam || !configuredAssessment.sectionAccess[section])) : [];
    const snapshot = contentForExamAttempt(assessmentId, submitted?.analysisContent as ExamContent | undefined, openExam);
    const editableIds = (suppliedGrantId || openExam) && snapshot ? new Set([
        ...((openExam ? configuredAssessment.sectionAccess.english : reentry?.remainingSections.includes("english")) ? [...snapshot.passageSets.flatMap(set => set.questions), ...(snapshot.standaloneSection?.questions ?? [])].map(question => question.id) : []),
        ...((openExam ? configuredAssessment.sectionAccess.math : reentry?.remainingSections.includes("math")) ? (snapshot.mathSection?.questions ?? []).map(question => question.id) : []),
    ]) : null;
    const protectedIds = snapshot ? [
        ...(protectedSections.includes("english") ? [...snapshot.passageSets.flatMap(set => set.questions), ...(snapshot.standaloneSection?.questions ?? [])].map(question => question.id) : []),
        ...(protectedSections.includes("math") ? (snapshot.mathSection?.questions ?? []).map(question => question.id) : []),
    ] : [];
    const mergedAnswers = {
        ...(submitted?.answers as JsonRecord ?? {}),
        ...(existingSession?.answers ?? {}),
        ...(editableIds ? Object.fromEntries(Object.entries(answers as JsonRecord).filter(([id]) => editableIds.has(id))) : answers as JsonRecord),
        ...Object.fromEntries(protectedIds.filter(id => submitted?.answers && Object.hasOwn(submitted.answers as object, id)).map(id => [id, (submitted!.answers as JsonRecord)[id]])),
    };
    const updatedAt = new Date().toISOString();
    const nextNavigation = navigation ? { ...existingSession?.navigation, ...navigation } : existingSession?.navigation;
    const session: ExamSessionProgress = {
        ...(nextNavigation ? { navigation: nextNavigation } : {}),
        answers: mergedAnswers,
        completedSections: [...new Set([...normalizedSections, ...protectedSections])],
        status,
        ...(status === "submitted" ? { submittedAt: updatedAt } : {}),
        updatedAt,
    };
    const saved = await supabase.from("student_exam_sessions").upsert({
        ...(session.navigation ? { navigation: session.navigation } : {}),
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
    if (result.error || !student || getUserRole(student) !== "student" || isStudentArchived(student)) {
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
    if (studentResult.error || !student || getUserRole(student) !== "student" || isStudentArchived(student)) {
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
    let result = request.body?.result;
    if (!result || typeof result !== "object" || Array.isArray(result)) {
        response.status(400).json({ message: "A valid exam result is required." });
        return;
    }
    const assessmentId = request.params.assessmentId;
    if (isReservedExamId(assessmentId) || result.assessmentId !== assessmentId || result.source === "answer_sheet" || (result.analysisContent !== undefined && result.analysisContent?.assessmentId !== assessmentId)) {
        response.status(400).json({ message: "The exam result and its content must match the requested assessment." });
        return;
    }
    if (getUserRole(user) === "student" && result.source !== undefined && result.source !== "digital") {
        response.status(403).json({ message: "Teacher-recorded scores must be entered by your teacher." }); return;
    }
    if (!(await listTeacherAssessments()).some(assessment => assessment.id === assessmentId)) {
        response.status(404).json({ message: "Assessment was not found." }); return;
    }
    return withExamWriteLock(user.id, assessmentId, async () => {
    const { grants, records } = await readExamReentries(user.id);
    const configuredAssessment = (await listTeacherAssessments()).find(item => item.id === assessmentId)!;
    const openExam = configuredAssessment.status === "open";
    const grant = openExam ? undefined : grants[assessmentId];
    const existing = records.get(assessmentId);
    const suppliedGrantId = openExam ? undefined : result.reentryGrantId;
    // A lost response must be safe to retry without consuming another permission.
    if (suppliedGrantId && grant && grant.id === suppliedGrantId && !grant.revokedAt && existing?.reentryGrantId === grant.id && result.attemptId === grant.attemptId) {
        const requested = submittedExamSections(result).filter(section => grant.sections.includes(section));
        const completed = Array.isArray(existing.reentrySubmittedSections) ? existing.reentrySubmittedSections : [];
        const content = existing.analysisContent as ExamContent | undefined;
        const ids = content ? [
            ...(requested.includes("english") ? [...content.passageSets.flatMap(set => set.questions), ...(content.standaloneSection?.questions ?? [])].map(question => question.id) : []),
            ...(requested.includes("math") ? (content.mathSection?.questions ?? []).map(question => question.id) : []),
        ] : [];
        if (requested.length && ids.length && requested.every(section => completed.includes(section)) && ids.every(id => JSON.stringify(result.answers?.[id]) === JSON.stringify((existing.answers as SelectedAnswers)?.[id]))) {
            response.json({ progress: await getDatabaseProgress(user), storage: "database" }); return;
        }
    }
    if (suppliedGrantId && (!grant || grant.id !== suppliedGrantId || grant.revokedAt || !grant.remainingSections.length || result.attemptId !== grant.attemptId)) {
        response.status(403).json({ message: "This re-entry permission is no longer active. Return to assessments or ask your teacher to reopen it." }); return;
    }
    if (grant?.remainingSections.length && suppliedGrantId !== grant.id) {
        response.status(409).json({ message: "Your teacher reopened this exam. Reload it before submitting." }); return;
    }
    const assessment = await findAssessmentForStudent(assessmentId, getEnrolledClassIds(user.app_metadata));
    if (getUserRole(user) === "student") {
        const personal = await hasAssignedContent(user.id, "exam", assessmentId, true);
        if (!assessment || (assessment.status !== "open" && !suppliedGrantId && !personal)) {
            response.status(403).json({ message: "Your teacher has locked this exam." }); return;
        }
        if (existing && examAttemptId(existing, assessmentId) !== result.attemptId && !suppliedGrantId && !assessment.allowCompletedAccess && !personal) {
            response.status(403).json({ message: "Ask your teacher to reopen this submitted exam." }); return;
        }
        const previouslyCompleted = existing ? submittedExamSections(existing) : [];
        const newlySubmitted = submittedExamSections(result).filter(section => !previouslyCompleted.includes(section));
        if (!personal && !suppliedGrantId && newlySubmitted.some(section => !assessment.sectionAccess[section])) {
            response.status(403).json({ message: "Your teacher has locked this section." }); return;
        }
    }
    if (suppliedGrantId && grant && existing) {
        const content = (existing.analysisContent as ExamContent | undefined) ?? getExamContent(assessmentId);
        if (!content || content.assessmentId !== assessmentId) { response.status(409).json({ message: "The original exam content is unavailable. Ask your teacher for help." }); return; }
        const previouslyRevised = existing.reentryGrantId === grant.id && Array.isArray(existing.reentrySubmittedSections) ? existing.reentrySubmittedSections as ("english" | "math")[] : [];
        const submittedNow = submittedExamSections(result).filter(section => grant.remainingSections.includes(section));
        if (!submittedNow.length) { response.status(400).json({ message: "Submit one of the sections your teacher reopened." }); return; }
        const completed = [...new Set([...submittedExamSections(existing).filter(section => !grant.remainingSections.includes(section)), ...submittedNow])];
        const editableIds = new Set([
            ...(grant.remainingSections.includes("english") ? [...content.passageSets.flatMap(set => set.questions), ...(content.standaloneSection?.questions ?? [])].map(question => question.id) : []),
            ...(grant.remainingSections.includes("math") ? (content.mathSection?.questions ?? []).map(question => question.id) : []),
        ]);
        const revisedAnswers = { ...(existing.answers as SelectedAnswers), ...Object.fromEntries(Object.entries(result.answers ?? {}).filter(([id]) => editableIds.has(id))) } as SelectedAnswers;
        const revised = createExamResult(content, revisedAnswers, completed, result.questionTimes ?? existing.questionTimes ?? {});
        result = { ...revised, attemptId: grant.attemptId, reentryGrantId: grant.id, reentrySubmittedSections: [...new Set([...previouslyRevised, ...submittedNow])], sectionCompletedAt: { ...(existing.sectionCompletedAt as object ?? {}), ...Object.fromEntries(submittedNow.map(section => [section, revised.completedAt])) }, timerState: result.timerState ?? grant.timerState };
    }
    // Preserve a previous genuine attempt before a new attempt replaces the current result.
    // Section submissions within the same attempt update one record, not separate tests.
    if (!suppliedGrantId && typeof result.attemptId === "string" && result.attemptId.length <= 200) {
        const previous = await supabase.from("student_exam_results").select("result").eq("user_id", user.id).eq("assessment_id", assessmentId).maybeSingle();
        if (previous.error) { response.status(503).json({ message: "Could not verify the previous attempt. Please retry." }); return; }
        const old = previous.data?.result as JsonRecord | undefined;
        if (old) {
            const oldId = String(old.attemptId ?? `legacy:${assessmentId}:${old.completedAt}`);
            if (oldId === result.attemptId && old.answers && result.answers) {
                const requested = submittedExamSections(result);
                const completed = submittedExamSections(old);
                const protectedSections = completed.filter(section => !openExam || !configuredAssessment.sectionAccess[section] || !requested.includes(section));
                const content = preserveSubmittedSections(contentForExamAttempt(assessmentId, old.analysisContent as ExamContent | undefined, openExam)!, old.analysisContent as ExamContent | undefined, protectedSections);
                if (!content || content.assessmentId !== assessmentId) { response.status(409).json({ message: "The original exam content is unavailable. Ask your teacher for help." }); return; }
                const protectedIds = [
                    ...(protectedSections.includes("english") ? [...content.passageSets.flatMap(set=>set.questions), ...(content.standaloneSection?.questions??[])].map(question=>question.id) : []),
                    ...(protectedSections.includes("math") ? (content.mathSection?.questions??[]).map(question=>question.id) : []),
                ];
                const protectedAnswers = Object.fromEntries(protectedIds.filter(id=>Object.hasOwn(old.answers as object,id)).map(id=>[id,(old.answers as SelectedAnswers)[id]]));
                const sections = [...new Set([...completed,...submittedExamSections(result)])];
                const preserved = createExamResult(content,{...result.answers,...protectedAnswers},sections,{...(result.questionTimes??{}),...(old.questionTimes as Record<string,number>??{})});
                result = {...result,...preserved,completedAt:result.completedAt,attemptId:oldId,sectionCompletedAt:{...(old.sectionCompletedAt as object??{}),...(result.sectionCompletedAt??{})},timerState:result.timerState??old.timerState,...(old.reentryGrantId ? { reentryGrantId: old.reentryGrantId, reentrySubmittedSections: old.reentrySubmittedSections } : {})};
            }
            if (oldId !== result.attemptId) {
                const historyId = `__exam_history__:${assessmentId}:${Buffer.from(oldId).toString("base64url")}`;
                const archived = await supabase.from("student_exam_results").upsert({ user_id: user.id, assessment_id: historyId, completed_at: old.completedAt, updated_at: new Date().toISOString(), result: { ...old, attemptId: oldId } }, { onConflict: "user_id,assessment_id" });
                if (archived.error) { response.status(503).json({ message: "Could not preserve the previous attempt. Please retry." }); return; }
            }
        }
    }
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
    if (isFullExamResult(result) && typeof result.completedAt === "string") await recordPlanCompletion(user.id, "exam", assessmentId, { source: "exam", at: result.completedAt, reference: assessmentId, correct: typeof result.correct === "number" ? result.correct : undefined, total: typeof result.total === "number" ? result.total : undefined });
    response.json({ progress: await getDatabaseProgress(user), storage: "database" });
    });
});

progressRouter.put("/practice/:topicSlug", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    if ((request.params.topicSlug.startsWith(libraryProgressPrefix) || request.params.topicSlug.startsWith("answer-sheet:"))) {
        response.status(403).json({ message: "Protected library and answer-sheet records must be managed through their own workflows." }); return;
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
        await recordPracticePlanCompletion(user.id, request.params.topicSlug, topicProgress);
        response.json({ progress: nextProgress });
        return;
    }
    await recordPracticePlanCompletion(user.id, request.params.topicSlug, topicProgress);
    response.json({ progress: await getDatabaseProgress(user) });
});


progressRouter.use(assessmentAccessErrorHandler);
