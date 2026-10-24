import { randomUUID } from "node:crypto";
import { createHash } from "node:crypto";
import { getExamContent } from "../lib/examContent";
import { reviewQuestions, type CorrectionResponse as ExamCorrectionResponse } from "../shared/examCorrections";
import type { ExamResult } from "../shared/examGrading";
import { Router, type ErrorRequestHandler } from "express";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole, isStudentArchived } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { hasAssignedContent, learningCatalog, recordPlanCompletion } from "../lib/learningPlanStore";
import { libraryContentKind, readQuestionBank } from "../lib/questionBank";
import { gradeBankSet, bankPassageSet, bankPassage } from "../shared/questionBank";
import type { ExamContent, ExamQuestion } from "../shared/examTypes";
import { canonicalLibraryBookId, getMergedLibraryBook, libraryBookAccessIds } from "../lib/libraryBooks";
import { gradeLibraryBook } from "../shared/libraryBooks";

type QuestionStat = {
    correctAnswerId: string;
    isCorrect: boolean;
    questionId: string;
    questionNumber: number;
    selectedAnswerId: string;
    timeSpentSeconds: number;
};

type LibraryAttemptRow = {
    attempt_number: number;
    book_id: string;
    completed_at: string;
    id: string;
    question_stats: QuestionStat[];
    score: number;
    started_at: string;
    total_questions: number;
    total_time_seconds: number;
    user_id: string;
};

type CorrectionResponse = {
    questionId: string;
    whyChosenIncorrect: string;
    whyCorrectAnswerCorrect: string;
    questionType?: string;
};

type LibraryCorrectionRow = {
    attempt_id: string;
    book_id: string;
    id: string;
    responses: CorrectionResponse[];
    submitted_at: string;
    updated_at: string;
    user_id: string;
};

type FallbackLibraryProgress = {
    attempts: LibraryAttemptRow[];
    correction: LibraryCorrectionRow | null;
    unlockedAt: string | null;
};

const bookIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,199}$/;
const fallbackProgressPrefix = "english-library:";

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMissingLibraryTable(error: { code?: string; message?: string } | null | undefined) {
    return error?.code === "PGRST205" || Boolean(error?.message?.includes("schema cache") && error.message.includes("library_"));
}

function isIsoDate(value: unknown): value is string {
    return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function normalizeQuestionStats(value: unknown): QuestionStat[] | null {
    if (!Array.isArray(value) || value.length < 1 || value.length > 200) return null;
    const stats = value.flatMap((entry, index) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
        const record = entry as Record<string, unknown>;
        const questionId = typeof record.questionId === "string" ? record.questionId.trim().slice(0, 200) : "";
        const selectedAnswerId = typeof record.selectedAnswerId === "string" ? record.selectedAnswerId.slice(0, 200) : "";
        const correctAnswerId = typeof record.correctAnswerId === "string" ? record.correctAnswerId.slice(0, 200) : "";
        const rawSeconds = typeof record.timeSpentSeconds === "number" && Number.isFinite(record.timeSpentSeconds)
            ? record.timeSpentSeconds
            : 0;
        if (!questionId || !selectedAnswerId || !correctAnswerId) return [];
        return [{
            correctAnswerId,
            isCorrect: selectedAnswerId === correctAnswerId,
            questionId,
            questionNumber: index + 1,
            selectedAnswerId,
            timeSpentSeconds: Math.max(0, Math.min(86_400, Math.round(rawSeconds))),
        }];
    });
    return stats.length === value.length ? stats : null;
}

function normalizeCorrectionResponses(value: unknown, missedQuestionIds: string[]): CorrectionResponse[] | null {
    if (!Array.isArray(value) || value.length !== missedQuestionIds.length) return null;
    const missedIds = new Set(missedQuestionIds);
    const seenIds = new Set<string>();
    const responses = value.flatMap((entry) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
        const record = entry as Record<string, unknown>;
        const questionId = typeof record.questionId === "string" ? record.questionId.trim().slice(0, 200) : "";
        const whyChosenIncorrect = typeof record.whyChosenIncorrect === "string"
            ? record.whyChosenIncorrect.trim().slice(0, 4_000)
            : "";
        const whyCorrectAnswerCorrect = typeof record.whyCorrectAnswerCorrect === "string"
            ? record.whyCorrectAnswerCorrect.trim().slice(0, 4_000)
            : "";
        const questionType = typeof record.questionType === "string" ? record.questionType.trim() : "";
        if (!missedIds.has(questionId) || seenIds.has(questionId) || !whyChosenIncorrect || !whyCorrectAnswerCorrect || !questionType || questionType.length > 120) return [];
        seenIds.add(questionId);
        return [{ questionId, whyChosenIncorrect, whyCorrectAnswerCorrect, questionType }];
    });
    return responses.length === missedQuestionIds.length ? responses : null;
}

function correctionSubmission(row: LibraryCorrectionRow) {
    return {
        attemptId: row.attempt_id,
        bookId: row.book_id,
        id: row.id,
        responses: row.responses,
        submittedAt: row.submitted_at,
        updatedAt: row.updated_at,
    };
}

function studentAttempt(row: LibraryAttemptRow) {
    return {
        attemptNumber: row.attempt_number,
        bookId: row.book_id,
        completedAt: row.completed_at,
        id: row.id,
        questions: row.question_stats.map((question) => ({
            questionId: question.questionId,
            questionNumber: question.questionNumber,
            timeSpentSeconds: question.timeSpentSeconds,
        })),
        score: row.score,
        startedAt: row.started_at,
        totalQuestions: row.total_questions,
        totalTimeSeconds: row.total_time_seconds,
    };
}

function teacherAttempt(row: LibraryAttemptRow, correction?: LibraryCorrectionRow) {
    return {
        ...studentAttempt(row),
        correction: correction ? correctionSubmission(correction) : null,
        questions: row.question_stats.map((question) => ({
            correctAnswerId: question.correctAnswerId,
            isCorrect: question.isCorrect,
            questionId: question.questionId,
            questionNumber: question.questionNumber,
            selectedAnswerId: question.selectedAnswerId,
            timeSpentSeconds: question.timeSpentSeconds,
        })),
    };
}

async function requireTeacher(authorizationHeader: string | undefined) {
    const authenticated = await getAuthenticatedUser(authorizationHeader);
    if (authenticated.error || !authenticated.user) return { error: authenticated.error, user: null };
    const role = authenticated.user.app_metadata.role;
    if (role !== "teacher" && role !== "admin") return { error: "Teacher access is required.", user: null };
    return { error: null, user: authenticated.user };
}

function fallbackTopicSlug(bookId: string) {
    return `${fallbackProgressPrefix}${bookId}`;
}

function readFallbackProgress(value: unknown): FallbackLibraryProgress {
    if (!isRecord(value)) return { attempts: [], correction: null, unlockedAt: null };
    return {
        attempts: Array.isArray(value.attempts) ? value.attempts as LibraryAttemptRow[] : [],
        correction: isRecord(value.correction) ? value.correction as LibraryCorrectionRow : null,
        unlockedAt: typeof value.unlockedAt === "string" ? value.unlockedAt : null,
    };
}

async function getFallbackProgress(userId: string, bookId: string) {
    const result = await supabase
        .from("student_practice_progress")
        .select("progress")
        .eq("user_id", userId)
        .eq("topic_slug", fallbackTopicSlug(bookId))
        .maybeSingle();
    return { data: readFallbackProgress(result.data?.progress), error: result.error };
}

async function saveFallbackProgress(userId: string, bookId: string, progress: FallbackLibraryProgress) {
    return supabase.from("student_practice_progress").upsert({
        progress,
        topic_slug: fallbackTopicSlug(bookId),
        updated_at: new Date().toISOString(),
        user_id: userId,
    }, { onConflict: "user_id,topic_slug" });
}

async function libraryRows<T>(query: (offset: number) => PromiseLike<{ data: T[] | null; error: { code?: string; message: string } | null }>, optional = false): Promise<T[]> {
    const rows: T[] = [];
    for (let offset = 0; ; offset += 1000) {
        const result = await query(offset);
        if (result.error) {
            if (optional && isMissingLibraryTable(result.error)) return [];
            throw Object.assign(new Error("Library storage is unavailable. Please try again."), { status: 503 });
        }
        rows.push(...result.data ?? []);
        if ((result.data?.length ?? 0) < 1000) return rows;
    }
}
async function getFallbackAttemptsForBook(bookId: string) {
    const rows = await libraryRows<{ user_id: string; progress: unknown }>(offset => supabase.from("student_practice_progress").select("user_id,progress").eq("topic_slug", fallbackTopicSlug(bookId)).order("user_id").range(offset, offset + 999));
    const progressRows = rows.map(row => ({ userId: row.user_id, progress: readFallbackProgress(row.progress) }));
    return {
        attempts: progressRows.flatMap(row => row.progress.attempts.map(attempt => ({ ...attempt, user_id: row.userId }))),
        corrections: progressRows.flatMap(row => row.progress.correction ? [{ ...row.progress.correction, user_id: row.userId }] : []),
        unlocked: progressRows.flatMap(row => row.progress.unlockedAt ? [{ userId: row.userId, at: row.progress.unlockedAt }] : []),
    };
}

async function getStudentLibraryAttemptRows(userId: string, bookId: string) {
    const result = await supabase
        .from("student_library_attempts")
        .select("id,user_id,book_id,attempt_number,score,total_questions,total_time_seconds,question_stats,started_at,completed_at")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .order("attempt_number", { ascending: true });
    if (result.error && !isMissingLibraryTable(result.error)) {
        return { attempts: [] as LibraryAttemptRow[], error: result.error, fallbackProgress: null as Awaited<ReturnType<typeof getFallbackProgress>> | null };
    }
    if (isMissingLibraryTable(result.error)) {
        const fallbackProgress = await getFallbackProgress(userId, bookId);
        return {
            attempts: [...fallbackProgress.data.attempts].sort((left, right) => left.attempt_number - right.attempt_number),
            error: fallbackProgress.error,
            fallbackProgress,
        };
    }
    return { attempts: (result.data ?? []) as LibraryAttemptRow[], error: null, fallbackProgress: null };
}

function accessTopicSlug(bookId: string) { return `${fallbackProgressPrefix}access:${canonicalLibraryBookId(bookId)}`; }
function libraryMaterial(bookId: string) {
    const canonical = canonicalLibraryBookId(bookId);
    const merged = getMergedLibraryBook(canonical);
    if (merged) return { id: canonical, title: merged.passageSet.passage.title };
    return learningCatalog().find(item => item.id === canonical && item.subject === "English" && (item.href.includes("/library/") || item.href.startsWith("/advanced-practice/")));
}
function activeLibraryStudent(user: Parameters<typeof getUserRole>[0]) {
    return getUserRole(user) === "student" && !isStudentArchived(user) && getEnrolledClassIds(user.app_metadata).includes("shsat");
}

export const libraryRouter = Router();

// One student-scoped batch, including compatibility storage; no per-question requests.
libraryRouter.get("/teacher/analytics/:studentId", async (request, response) => {
    const auth = await requireTeacher(request.headers.authorization);
    if (!auth.user) { response.status(403).json({ message: "Teacher access is required." }); return; }
    const id = request.params.studentId;
    if (!/^[\da-f-]{36}$/i.test(id)) { response.status(400).json({ message: "Invalid student ID." }); return; }
    const target = await supabase.auth.admin.getUserById(id);
    if (target.error || !target.data.user || !activeLibraryStudent(target.data.user)) { response.status(404).json({ message: "Active SHSAT student not found." }); return; }
    const [rows, corrections, fallback, examRows] = await Promise.all([
        libraryRows<LibraryAttemptRow>(offset => supabase.from("student_library_attempts").select("*").eq("user_id", id).order("id").range(offset, offset + 999), true),
        libraryRows<LibraryCorrectionRow>(offset => supabase.from("student_library_corrections").select("*").eq("user_id", id).order("id").range(offset, offset + 999), true),
        libraryRows<{ topic_slug: string; progress: unknown }>(offset => supabase.from("student_practice_progress").select("topic_slug,progress").eq("user_id", id).like("topic_slug", "english-library:%").order("topic_slug").range(offset, offset + 999)),
        libraryRows<{ assessment_id:string; result: ExamResult & { resultVersion?:string; responses?:ExamCorrectionResponse[] } }>(offset => supabase.from("student_exam_results").select("assessment_id,result").eq("user_id", id).order("assessment_id").range(offset, offset+999)),
    ]);
    for (const row of fallback) {
        const progress = readFallbackProgress(row.progress), bookId = row.topic_slug.slice(fallbackProgressPrefix.length);
        rows.push(...progress.attempts.map(attempt => ({ ...attempt, book_id: bookId, user_id: id })));
        if (progress.correction) corrections.push(progress.correction);
    }
    const bank = readQuestionBank(), seen = new Set<string>();
    const inputs: unknown[] = rows.filter(row => { if (!row.id || seen.has(row.id) || row.user_id !== id) return false; seen.add(row.id); return true; }).map(row => {
        const bankSet = bankPassageSet(bank, row.book_id), book = getMergedLibraryBook(canonicalLibraryBookId(row.book_id));
        const original = bankSet ?? book?.passageSet;
        const stats = Array.isArray(row.question_stats) ? row.question_stats : [];
        const questions: ExamQuestion[] = stats.map(stat => original?.questions.find(question => question.id === stat.questionId) ?? { id: stat.questionId, type: "multiple_choice", topic: "Unclassified", prompt: "Original question content unavailable. The recorded answer and grade are preserved.", choices: [] });
        const passageSets = bankSet ? questions.map(question => ({ ...bankSet, id: question.id, passage: bankPassage(bank.questions.find(item => item.id === question.id) ?? { id: question.id, source: "Unknown", passage: null } as Parameters<typeof bankPassage>[0]), questions: [question] })) : [{ ...(original ?? { id: row.book_id, directions: { title: "Content unavailable", subject: "English", body: "" }, questionCount: questions.length, passage: { id: row.book_id, title: row.book_id, lines: [] } }), questions }];
        const content: ExamContent = { assessmentId: `library:${row.book_id}`, title: bankSet?.directions.title ?? original?.passage.title ?? row.book_id, passageSets };
        const topics = [...new Set(questions.map(question => question.topic))].map(topic => ({ topic, correct: stats.filter(stat => questions.find(q => q.id === stat.questionId)?.topic === topic && stat.isCorrect).length, total: questions.filter(question => question.topic === topic).length }));
        const subjects = [{ subject: "English Language Arts", correct: row.score, total: row.total_questions, topics }];
        const correction = corrections.find(item => item.attempt_id === row.id);
        return { kind: bankSet ? "practice" : "passage", sourceLabel: bankSet ? "Question-bank practice" : "Library passage", content, subjects, passages: [], responses: stats,
            corrections: correction?.responses ?? [], result: { assessmentId: content.assessmentId, attemptId: row.id, title: content.title, source: "library", completedAt: row.completed_at, completedSections: ["english"], completionStatus: "english_complete", correct: row.score, total: row.total_questions, subjects, percentage: row.total_questions ? Math.round(100 * row.score / row.total_questions) : null, answers: Object.fromEntries(stats.map(stat => [stat.questionId, stat.selectedAnswerId])) } };
    });
    const examCorrections: { assessmentId:string; completedAt:string; responses:ExamCorrectionResponse[] }[] = [];
    for (const row of examRows.filter(row => !row.assessment_id.startsWith("__") || row.assessment_id.startsWith("__exam_history__:"))) {
        const result = row.result, content = result.analysisContent ?? getExamContent(result.assessmentId);
        if (content) {
            const questions = reviewQuestions(content,result), version=createHash("sha256").update(JSON.stringify({result,questions})).digest("hex");
            const correction=examRows.find(item=>item.result.resultVersion===version&&Array.isArray(item.result.responses));
            if (correction) examCorrections.push({ assessmentId:result.assessmentId, completedAt:result.completedAt, responses:correction.result.responses! });
        }
        if (row.assessment_id.startsWith("__exam_history__:")) inputs.push({ kind:"exam",result,content:content??undefined,subjects:result.subjects??[],passages:result.passages??[],corrections:examCorrections.find(item=>item.assessmentId===result.assessmentId&&item.completedAt===result.completedAt)?.responses });
    }
    response.json({ inputs, examCorrections, limitations: ["Historical library grades are the original recorded outcomes. Question text and skill metadata use current matching content when no frozen snapshot exists.", "Legacy practice totals without saved question responses remain in Practice progress and cannot supply question-level evidence. Earlier exam attempts overwritten before attempt history was introduced cannot be reconstructed."] });
});

libraryRouter.get("/teacher/bank-attempts/:studentId", async (request, response) => {
    const authenticated = await requireTeacher(request.headers.authorization);
    if (!authenticated.user) { response.status(403).json({ message: "Teacher access is required." }); return; }
    if (!/^[\da-f-]{36}$/i.test(request.params.studentId)) { response.status(400).json({ message: "Invalid student ID." }); return; }
    const student = await supabase.auth.admin.getUserById(request.params.studentId);
    if (student.error || !student.data.user || getUserRole(student.data.user) !== "student" || !getEnrolledClassIds(student.data.user.app_metadata).includes("shsat")) { response.status(404).json({ message: "SHSAT student not found." }); return; }
    const bank = readQuestionBank();
    if (!bank.sets.length) { response.json({ attempts: [] }); return; }
    const rows: LibraryAttemptRow[] = [];
    for (let offset = 0; ; offset += 1000) {
        const result = await supabase.from("student_library_attempts").select("*").eq("user_id", request.params.studentId).like("book_id", "lab-set-%").order("id").range(offset, offset + 999);
        if (result.error) { if (isMissingLibraryTable(result.error)) break; response.status(400).json({ message: result.error.message }); return; }
        rows.push(...(result.data ?? []) as LibraryAttemptRow[]); if ((result.data?.length ?? 0) < 1000) break;
    }
    for (let offset = 0; ; offset += 1000) {
        const result = await supabase.from("student_practice_progress").select("topic_slug,progress").eq("user_id", request.params.studentId).like("topic_slug", "english-library:lab-set-%").order("topic_slug").range(offset, offset + 999);
        if (result.error) { response.status(400).json({ message: result.error.message }); return; }
        for (const row of result.data ?? []) { const bookId = String(row.topic_slug).slice(fallbackProgressPrefix.length); rows.push(...readFallbackProgress(row.progress).attempts.map(attempt => ({ ...attempt, book_id: bookId, user_id: request.params.studentId }))); }
        if ((result.data?.length ?? 0) < 1000) break;
    }
    const seen = new Set<string>(); let unverified = 0;
    const attempts = rows.flatMap(row => {
        const set = bank.sets.find(set => set.id === row.book_id);
        if (!set || seen.has(row.id)) return []; seen.add(row.id);
        try {
            const stats = gradeBankSet(bank, row.book_id, row.question_stats);
            return [{ id: row.id, bookId: set.id, title: set.title, completedAt: row.completed_at, score: stats.filter(q => q.isCorrect).length,
                totalQuestions: stats.length, questions: stats.map(stat => { const q = bank.questions.find(q => q.id === stat.questionId)!; return { ...stat, topic: q.topic, difficulty: q.difficulty }; }) }];
        } catch { unverified++; return []; }
    }).sort((a, b) => b.completedAt.localeCompare(a.completedAt));
    response.json({ attempts, unverified });
});

// Codes are retired, including requests from old clients.
libraryRouter.post("/teacher/books/:bookId/code", async (request, response) => {
    const authenticated = await requireTeacher(request.headers.authorization);
    if (!authenticated.user) { response.status(403).json({ message: "Teacher access is required." }); return; }
    response.status(410).json({ message: "Book codes have been replaced by individual student access in the English library dashboard." });
});

libraryRouter.put("/teacher/books/:bookId/students/:studentId/access", async (request, response) => {
    const authenticated = await requireTeacher(request.headers.authorization);
    if (!authenticated.user) { response.status(403).json({ message: "Teacher access is required." }); return; }
    if (!bookIdPattern.test(request.params.bookId) || !/^[\da-f-]{36}$/i.test(request.params.studentId) || typeof request.body?.granted !== "boolean") {
        response.status(400).json({ message: "A valid book, student, and access setting are required." }); return;
    }
    const material = libraryMaterial(request.params.bookId);
    if (!material) { response.status(404).json({ message: "English library book not found." }); return; }
    const target = await supabase.auth.admin.getUserById(request.params.studentId);
    if (target.error || !target.data.user || !activeLibraryStudent(target.data.user)) { response.status(404).json({ message: "Active SHSAT student not found." }); return; }
    const updatedAt = new Date().toISOString();
    // Maintain the existing attempt foreign key. This opaque value cannot unlock books.
    const catalog = await supabase.from("teacher_library_books").upsert({ book_id: material.id, title: material.title, access_code: randomUUID(), created_by: authenticated.user.id }, { onConflict: "book_id", ignoreDuplicates: true });
    if (catalog.error && !isMissingLibraryTable(catalog.error)) { response.status(503).json({ message: "Could not save book access. Please try again." }); return; }
    const saved = await supabase.from("student_practice_progress").upsert({ user_id: target.data.user.id, topic_slug: accessTopicSlug(material.id), progress: { granted: request.body.granted, updatedAt, updatedBy: authenticated.user.id }, updated_at: updatedAt }, { onConflict: "user_id,topic_slug" });
    if (saved.error) { response.status(503).json({ message: "Could not save student access. Please try again." }); return; }
    response.json({ bookId: material.id, studentId: target.data.user.id, access: { unlocked: request.body.granted, unlockedAt: request.body.granted ? updatedAt : null } });
});

async function bookHistory(bookId: string) {
    const [attempts, corrections, fallback] = await Promise.all([
        libraryRows<LibraryAttemptRow>(offset => supabase.from("student_library_attempts").select("*").eq("book_id", bookId).order("id").range(offset, offset + 999), true),
        libraryRows<LibraryCorrectionRow>(offset => supabase.from("student_library_corrections").select("*").eq("book_id", bookId).order("id").range(offset, offset + 999), true),
        getFallbackAttemptsForBook(bookId),
    ]);
    return { attempts: [...attempts, ...fallback.attempts], corrections: [...corrections, ...fallback.corrections], unlocked: fallback.unlocked };
}
libraryRouter.get("/teacher/books/:bookId", async (request, response) => {
    const authenticated = await requireTeacher(request.headers.authorization);
    if (!authenticated.user) { response.status(403).json({ message: "Teacher access is required." }); return; }
    const material = libraryMaterial(request.params.bookId);
    if (!bookIdPattern.test(request.params.bookId) || !material) { response.status(404).json({ message: "English library book not found." }); return; }
    const ids = libraryBookAccessIds(material.id);
    const [histories, grants, assignments] = await Promise.all([
        Promise.all(ids.map(bookHistory)),
        libraryRows<{ user_id: string; progress: unknown }>(offset => supabase.from("student_practice_progress").select("user_id,progress").eq("topic_slug", accessTopicSlug(material.id)).order("user_id").range(offset, offset + 999)),
        libraryRows<{ student_id: string; content_id: string; kind: string }>(offset => supabase.from("student_assignments").select("student_id,content_id,kind").in("content_id", ids).in("status", ["assigned", "in_progress", "review", "completed"]).order("id").range(offset, offset + 999), true),
    ]);
    const listedUsers: User[] = [];
    for (let page = 1; ; page++) {
        const listed = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
        if (listed.error) { response.status(503).json({ message: "Could not load students." }); return; }
        listedUsers.push(...listed.data.users);
        if (listed.data.users.length < 1000) break;
    }
    const rows = [...new Map(histories.flatMap(history => history.attempts).map(row => [row.id, row])).values()].sort((a,b) => b.completed_at.localeCompare(a.completed_at));
    const corrections = new Map(histories.flatMap(history => history.corrections).map(row => [row.attempt_id, row]));
    const grantsByStudent = new Map(grants.map(row => [row.user_id, row.progress]));
    const assignedStudents = new Set(assignments.filter(row => row.kind === libraryContentKind(row.content_id)).map(row => row.student_id));
    const legacyUnlocks = new Map([...histories.flatMap(history => history.unlocked).map(row => [row.userId, row.at] as const), ...rows.map(row => [row.user_id, row.completed_at] as const)]);
    const students = listedUsers.filter(activeLibraryStudent).map(user => {
        const grant = grantsByStudent.get(user.id);
        const access = isRecord(grant) && typeof grant.granted === "boolean"
            ? { unlocked: grant.granted, unlockedAt: grant.granted && typeof grant.updatedAt === "string" ? grant.updatedAt : null }
            : { unlocked: legacyUnlocks.has(user.id) || assignedStudents.has(user.id), unlockedAt: legacyUnlocks.get(user.id) ?? null };
        return { access, attempts: rows.filter(row => row.user_id === user.id).map(row => teacherAttempt(row, corrections.get(row.id))),
            email: user.email ?? "", id: user.id,
            name: typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : user.email?.split("@")[0] ?? "Student",
            username: typeof user.user_metadata?.username === "string" ? user.user_metadata.username : user.email?.split("@")[0] ?? "student",
        };
    });
    response.json({ book: { bookId: material.id, title: material.title }, students: students.sort((a,b) => a.name.localeCompare(b.name)) });
});

async function completedBookAccess(userId: string, bookId: string) {
    const access = await supabase.from("student_practice_progress").select("progress").eq("user_id", userId).eq("topic_slug", accessTopicSlug(bookId)).maybeSingle();
    if (access.error) throw Object.assign(new Error("Could not load book access."), { status: 503 });
    if (isRecord(access.data?.progress) && typeof access.data.progress.granted === "boolean") {
        return { unlocked: access.data.progress.granted, unlockedAt: access.data.progress.granted && typeof access.data.progress.updatedAt === "string" ? access.data.progress.updatedAt : null };
    }
    const values = await Promise.all(libraryBookAccessIds(bookId).map(async id => {
        const [progress, attempts] = await Promise.all([getFallbackProgress(userId, id), getStudentLibraryAttemptRows(userId, id)]);
        if (progress.error || attempts.error) throw Object.assign(new Error("Could not load book access."), { status: 503 });
        return { unlockedAt: progress.data.unlockedAt ?? progress.data.attempts[0]?.completed_at ?? attempts.attempts[0]?.completed_at ?? null, assigned: await hasAssignedContent(userId, libraryContentKind(id), id, true) };
    }));
    return { unlockedAt: values.find(value => value.unlockedAt)?.unlockedAt ?? null, unlocked: values.some(value => value.unlockedAt || value.assigned) };
}
async function recordBookCompletion(userId: string, bookId: string, at: string, reference: string, correct: number, total: number) {
    for (const id of libraryBookAccessIds(bookId)) await recordPlanCompletion(userId, libraryContentKind(id), id, { source: "library", at, reference, correct, total });
}
libraryRouter.get("/books/:bookId/access", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    if (!activeLibraryStudent(authenticated.user)) {
        response.json({ unlocked: false, unlockedAt: null });
        return;
    }
    response.json(await completedBookAccess(authenticated.user.id, request.params.bookId));
});

libraryRouter.post("/books/:bookId/unlock", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    response.status(410).json({ message: "Book codes have been replaced by individual access. Ask your teacher to enable this book for your account." });
});

libraryRouter.get("/books/:bookId/attempts", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    if (getUserRole(authenticated.user) !== "student") {
        response.json({ attempts: [] });
        return;
    }
    const attempts = await supabase
        .from("student_library_attempts")
        .select("id,user_id,book_id,attempt_number,score,total_questions,total_time_seconds,question_stats,started_at,completed_at")
        .eq("user_id", authenticated.user.id)
        .eq("book_id", request.params.bookId)
        .order("attempt_number", { ascending: false });
    if (attempts.error && !isMissingLibraryTable(attempts.error)) {
        response.status(400).json({ message: attempts.error.message });
        return;
    }
    if (isMissingLibraryTable(attempts.error)) {
        const fallback = await getFallbackProgress(authenticated.user.id, request.params.bookId);
        if (fallback.error) {
            response.status(400).json({ message: fallback.error.message });
            return;
        }
        response.json({ attempts: [...fallback.data.attempts].sort((left, right) => right.attempt_number - left.attempt_number).map(studentAttempt) });
        return;
    }
    response.json({ attempts: ((attempts.data ?? []) as LibraryAttemptRow[]).map(studentAttempt) });
});

libraryRouter.get("/books/:bookId/corrections", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    let student = authenticated.user;
    const previewId = typeof request.query.studentId === "string" ? request.query.studentId : "";
    if (previewId) {
        if (!["teacher", "admin"].includes(String(authenticated.user.app_metadata.role))) { response.status(403).json({ message: "Teacher access is required." }); return; }
        const lookup = await supabase.auth.admin.getUserById(previewId), target = lookup.data.user;
        if (lookup.error || !target || getUserRole(target) !== "student" || isStudentArchived(target) || !getEnrolledClassIds(target.app_metadata).includes("shsat")) { response.status(404).json({ message: "Choose an active enrolled student." }); return; }
        student = target;
    }
    if (getUserRole(student) !== "student") {
        response.status(403).json({ message: "Only a student can open library corrections." });
        return;
    }
    if (!bookIdPattern.test(request.params.bookId)) {
        response.status(400).json({ message: "That library book is not valid." });
        return;
    }
    const attemptResult = await getStudentLibraryAttemptRows(student.id, request.params.bookId);
    if (attemptResult.error) {
        response.status(400).json({ message: attemptResult.error.message });
        return;
    }
    const attempt = attemptResult.attempts[0];
    if (!attempt) {
        response.status(404).json({ message: "Finish your first attempt before opening corrections." });
        return;
    }
    if (attempt.score >= attempt.total_questions) {
        response.status(409).json({ message: "Your first attempt was already perfect, so no corrections are needed." });
        return;
    }
    if (!attemptResult.attempts.some((candidate) => candidate.score >= candidate.total_questions)) {
        response.status(403).json({ message: "Earn a perfect score on a new attempt before opening Corrections." });
        return;
    }
    let correctionData = attemptResult.fallbackProgress?.data.correction ?? null;
    if (!attemptResult.fallbackProgress) {
        const correction = await supabase
            .from("student_library_corrections")
            .select("id,user_id,book_id,attempt_id,responses,submitted_at,updated_at")
            .eq("user_id", student.id)
            .eq("book_id", request.params.bookId)
            .eq("attempt_id", attempt.id)
            .maybeSingle();
        if (correction.error && !isMissingLibraryTable(correction.error)) {
            response.status(400).json({ message: correction.error.message });
            return;
        }
        if (isMissingLibraryTable(correction.error)) {
            const fallback = await getFallbackProgress(student.id, request.params.bookId);
            if (fallback.error) {
                response.status(400).json({ message: fallback.error.message });
                return;
            }
            correctionData = fallback.data.correction;
        } else {
            correctionData = correction.data as LibraryCorrectionRow | null;
        }
    }
    response.json({
        attempt: teacherAttempt(attempt),
        correction: correctionData ? correctionSubmission(correctionData) : null,
        readOnly: Boolean(previewId),
    });
});

libraryRouter.post("/books/:bookId/corrections", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    if (getUserRole(authenticated.user) !== "student") {
        response.status(403).json({ message: "Only a student can submit library corrections." });
        return;
    }
    if (!bookIdPattern.test(request.params.bookId)) {
        response.status(400).json({ message: "That library book is not valid." });
        return;
    }
    const attemptResult = await getStudentLibraryAttemptRows(authenticated.user.id, request.params.bookId);
    if (attemptResult.error) {
        response.status(400).json({ message: attemptResult.error.message });
        return;
    }
    const attempt = attemptResult.attempts[0];
    if (!attempt) {
        response.status(404).json({ message: "Finish your first attempt before submitting corrections." });
        return;
    }
    const missedQuestionIds = attempt.question_stats.filter((question) => !question.isCorrect).map((question) => question.questionId);
    if (!missedQuestionIds.length) {
        response.status(409).json({ message: "Your first attempt was already perfect, so no corrections are needed." });
        return;
    }
    if (!attemptResult.attempts.some((candidate) => candidate.score >= candidate.total_questions)) {
        response.status(403).json({ message: "Earn a perfect score on a new attempt before submitting Corrections." });
        return;
    }
    const responses = normalizeCorrectionResponses(request.body?.responses, missedQuestionIds);
    if (!responses) {
        response.status(400).json({ message: "Explain both why your choice was incorrect and why the correct answer is correct for every missed question." });
        return;
    }
    let correctionFallback = attemptResult.fallbackProgress;
    let existingCorrection = correctionFallback?.data.correction ?? null;
    if (!correctionFallback) {
        const existing = await supabase
            .from("student_library_corrections")
            .select("id")
            .eq("user_id", authenticated.user.id)
            .eq("book_id", request.params.bookId)
            .eq("attempt_id", attempt.id)
            .maybeSingle();
        if (existing.error && !isMissingLibraryTable(existing.error)) {
            response.status(400).json({ message: existing.error.message });
            return;
        }
        if (isMissingLibraryTable(existing.error)) {
            correctionFallback = await getFallbackProgress(authenticated.user.id, request.params.bookId);
            if (correctionFallback.error) {
                response.status(400).json({ message: correctionFallback.error.message });
                return;
            }
            existingCorrection = correctionFallback.data.correction;
        } else {
            existingCorrection = existing.data ? ({ id: existing.data.id } as LibraryCorrectionRow) : null;
        }
    }
    if (existingCorrection) {
        response.status(409).json({ message: "These corrections have already been submitted to your teacher." });
        return;
    }
    const submittedAt = new Date().toISOString();
    const correctionRow: LibraryCorrectionRow = {
        attempt_id: attempt.id,
        book_id: request.params.bookId,
        id: randomUUID(),
        responses,
        submitted_at: submittedAt,
        updated_at: submittedAt,
        user_id: authenticated.user.id,
    };
    if (correctionFallback) {
        const fallbackSaved = await saveFallbackProgress(authenticated.user.id, request.params.bookId, {
            ...correctionFallback.data,
            correction: correctionRow,
        });
        if (fallbackSaved.error) {
            response.status(400).json({ message: fallbackSaved.error.message });
            return;
        }
        response.status(201).json({ correction: correctionSubmission(correctionRow), storage: "compatibility" });
        return;
    }
    const saved = await supabase.from("student_library_corrections").insert(correctionRow).select("id,user_id,book_id,attempt_id,responses,submitted_at,updated_at").single();
    if (saved.error || !saved.data) {
        response.status(400).json({ message: saved.error?.message ?? "Could not submit these corrections." });
        return;
    }
    response.status(201).json({ correction: correctionSubmission(saved.data as LibraryCorrectionRow) });
});

libraryRouter.post("/books/:bookId/attempts", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    if (getUserRole(authenticated.user) !== "student") {
        response.status(403).json({ message: "Only a student can submit a library attempt." });
        return;
    }
    const accessProgress = await getFallbackProgress(authenticated.user.id, request.params.bookId);
    if (accessProgress.error) {
        response.status(400).json({ message: accessProgress.error.message });
        return;
    }
    const mergedBook = getMergedLibraryBook(request.params.bookId);
    if (!activeLibraryStudent(authenticated.user) || !(await completedBookAccess(authenticated.user.id, request.params.bookId)).unlocked) {
        response.status(403).json({ message: "Your teacher needs to enable this book for your account." }); return;
    }
    let questionStats: QuestionStat[] | null;
    if (mergedBook) {
        try { questionStats = gradeLibraryBook(mergedBook, request.body?.questions); }
        catch (error) { response.status(400).json({ message: error instanceof Error ? error.message : "Invalid book responses." }); return; }
    } else if (request.params.bookId.startsWith("lab-set-")) {
        try { questionStats = gradeBankSet(readQuestionBank(), request.params.bookId, request.body?.questions); }
        catch (error) { response.status(400).json({ message: error instanceof Error ? error.message : "Invalid bank responses." }); return; }
    } else questionStats = normalizeQuestionStats(request.body?.questions);
    const startedAt = request.body?.startedAt;
    const completedAt = new Date().toISOString();
    if (!questionStats || !isIsoDate(startedAt)) {
        response.status(400).json({ message: "Complete every question before submitting this attempt." });
        return;
    }
    const rawTotalTime = typeof request.body?.totalTimeSeconds === "number" && Number.isFinite(request.body.totalTimeSeconds)
        ? request.body.totalTimeSeconds
        : questionStats.reduce((sum, question) => sum + question.timeSpentSeconds, 0);
    const totalTimeSeconds = Math.max(0, Math.min(86_400, Math.round(rawTotalTime)));
    const latest = await supabase
        .from("student_library_attempts")
        .select("attempt_number")
        .eq("user_id", authenticated.user.id)
        .eq("book_id", request.params.bookId)
        .order("attempt_number", { ascending: false })
        .limit(1);
    if (latest.error && !isMissingLibraryTable(latest.error)) {
        response.status(400).json({ message: latest.error.message });
        return;
    }
    const fallbackProgress = isMissingLibraryTable(latest.error)
        ? accessProgress
        : null;
    if (fallbackProgress?.error) {
        response.status(400).json({ message: fallbackProgress.error.message });
        return;
    }
    const attemptNumber = isMissingLibraryTable(latest.error)
        ? Math.max(0, ...(fallbackProgress?.data.attempts.map((attempt) => attempt.attempt_number) ?? [])) + 1
        : Number(latest.data?.[0]?.attempt_number ?? 0) + 1;
    const score = questionStats.filter((question) => question.isCorrect).length;
    const attemptRow: LibraryAttemptRow = {
        attempt_number: attemptNumber,
        book_id: request.params.bookId,
        completed_at: completedAt,
        id: randomUUID(),
        question_stats: questionStats,
        score,
        started_at: startedAt,
        total_questions: questionStats.length,
        total_time_seconds: totalTimeSeconds,
        user_id: authenticated.user.id,
    };
    if (fallbackProgress) {
        const fallbackSaved = await saveFallbackProgress(authenticated.user.id, request.params.bookId, {
            ...fallbackProgress.data,
            attempts: [...fallbackProgress.data.attempts, attemptRow],
        });
        if (fallbackSaved.error) {
            response.status(400).json({ message: fallbackSaved.error.message });
            return;
        }
        await recordBookCompletion(authenticated.user.id, request.params.bookId, completedAt, attemptRow.id, score, questionStats.length);
        response.status(201).json({ attempt: studentAttempt(attemptRow), storage: "compatibility" });
        return;
    }
    const saved = await supabase.from("student_library_attempts").insert(attemptRow).select("id,user_id,book_id,attempt_number,score,total_questions,total_time_seconds,question_stats,started_at,completed_at").single();
    if (saved.error || !saved.data) {
        response.status(400).json({ message: saved.error?.message ?? "Could not save this attempt." });
        return;
    }
    await recordBookCompletion(authenticated.user.id, request.params.bookId, completedAt, attemptRow.id, score, questionStats.length);
    response.status(201).json({ attempt: studentAttempt(saved.data as LibraryAttemptRow) });
});

const handleLibraryError: ErrorRequestHandler = (error, _request, response, next) => {
    if (response.headersSent) { next(error); return; }
    response.status(error?.status === 503 ? 503 : 500).json({ message: error?.status === 503 ? error.message : "The library could not complete this request. Please try again." });
};
libraryRouter.use(handleLibraryError);
