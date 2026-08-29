import { randomInt, randomUUID } from "node:crypto";
import { Router } from "express";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole } from "../lib/auth";
import { supabase } from "../lib/supabase";

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

type LibraryBookRow = {
    access_code: string;
    book_id: string;
    created_at: string;
    created_by: string;
    title: string;
    updated_at: string;
};

type FallbackLibraryProgress = {
    attempts: LibraryAttemptRow[];
    correction: LibraryCorrectionRow | null;
};

const accessCodeAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const bookIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,199}$/;
const fallbackProgressPrefix = "english-library:";

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMissingLibraryTable(error: { code?: string; message?: string } | null | undefined) {
    return error?.code === "PGRST205" || Boolean(error?.message?.includes("schema cache") && error.message.includes("library_"));
}

function normalizeAccessCode(value: unknown) {
    return typeof value === "string" ? value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() : "";
}

function createAccessCode() {
    return Array.from({ length: 6 }, () => accessCodeAlphabet[randomInt(0, accessCodeAlphabet.length)]).join("");
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
        if (!missedIds.has(questionId) || seenIds.has(questionId) || !whyChosenIncorrect || !whyCorrectAnswerCorrect) return [];
        seenIds.add(questionId);
        return [{ questionId, whyChosenIncorrect, whyCorrectAnswerCorrect }];
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
    const role = getUserRole(authenticated.user);
    if (role !== "teacher" && role !== "admin") return { error: "Teacher access is required.", user: null };
    return { error: null, user: authenticated.user };
}

function readFallbackBookRows(value: unknown): LibraryBookRow[] {
    if (!isRecord(value) || !isRecord(value.englishLibraryBooks)) return [];
    return Object.values(value.englishLibraryBooks).flatMap((entry) => {
        if (!isRecord(entry)) return [];
        const bookId = typeof entry.bookId === "string" ? entry.bookId : "";
        const accessCode = typeof entry.accessCode === "string" ? entry.accessCode : "";
        const title = typeof entry.title === "string" ? entry.title : "";
        const createdBy = typeof entry.createdBy === "string" ? entry.createdBy : "";
        const createdAt = typeof entry.createdAt === "string" ? entry.createdAt : new Date(0).toISOString();
        const updatedAt = typeof entry.updatedAt === "string" ? entry.updatedAt : createdAt;
        if (!bookId || !accessCode || !title || !createdBy) return [];
        return [{ access_code: accessCode, book_id: bookId, created_at: createdAt, created_by: createdBy, title, updated_at: updatedAt }];
    });
}

async function getFallbackBooks() {
    const result = await supabase.from("staff_dashboard_data").select("staff_user_id,dashboard_data");
    if (result.error) return { data: [] as LibraryBookRow[], error: result.error };
    const latestByBook = new Map<string, LibraryBookRow>();
    (result.data ?? []).forEach((row) => {
        readFallbackBookRows(row.dashboard_data).forEach((book) => {
            const current = latestByBook.get(book.book_id);
            if (!current || Date.parse(book.updated_at) > Date.parse(current.updated_at)) latestByBook.set(book.book_id, book);
        });
    });
    return { data: [...latestByBook.values()], error: null };
}

async function saveFallbackBook(user: { id: string; user_metadata: Record<string, unknown> }, book: LibraryBookRow) {
    const stored = await supabase.from("staff_dashboard_data").select("dashboard_data").eq("staff_user_id", user.id).maybeSingle();
    if (stored.error) return { error: stored.error };
    const legacy = isRecord(user.user_metadata.dashboard_data) ? user.user_metadata.dashboard_data : {};
    const dashboardData = isRecord(stored.data?.dashboard_data) ? stored.data.dashboard_data : legacy;
    const currentBooks = isRecord(dashboardData.englishLibraryBooks) ? dashboardData.englishLibraryBooks : {};
    const saved = await supabase.from("staff_dashboard_data").upsert({
        dashboard_data: {
            ...dashboardData,
            englishLibraryBooks: {
                ...currentBooks,
                [book.book_id]: {
                    accessCode: book.access_code,
                    bookId: book.book_id,
                    createdAt: book.created_at,
                    createdBy: book.created_by,
                    title: book.title,
                    updatedAt: book.updated_at,
                },
            },
        },
        staff_user_id: user.id,
        updated_at: book.updated_at,
    }, { onConflict: "staff_user_id" });
    return { error: saved.error };
}

function fallbackTopicSlug(bookId: string) {
    return `${fallbackProgressPrefix}${bookId}`;
}

function readFallbackProgress(value: unknown): FallbackLibraryProgress {
    if (!isRecord(value)) return { attempts: [], correction: null };
    return {
        attempts: Array.isArray(value.attempts) ? value.attempts as LibraryAttemptRow[] : [],
        correction: isRecord(value.correction) ? value.correction as LibraryCorrectionRow : null,
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

async function getFallbackAttemptsForBook(bookId: string) {
    const result = await supabase
        .from("student_practice_progress")
        .select("user_id,progress")
        .eq("topic_slug", fallbackTopicSlug(bookId));
    if (result.error) return { attempts: [] as LibraryAttemptRow[], corrections: [] as LibraryCorrectionRow[], error: result.error };
    const progressRows = (result.data ?? []).map((row) => ({ userId: row.user_id as string, progress: readFallbackProgress(row.progress) }));
    return {
        attempts: progressRows.flatMap((row) => row.progress.attempts.map((attempt) => ({ ...attempt, user_id: row.userId }))),
        corrections: progressRows.flatMap((row) => row.progress.correction ? [{ ...row.progress.correction, user_id: row.userId }] : []),
        error: null,
    };
}

async function getBook(bookId: string): Promise<{ data: LibraryBookRow | null; error: { code?: string; message: string } | null }> {
    const result = await supabase
        .from("teacher_library_books")
        .select("book_id,title,access_code,created_by,created_at,updated_at")
        .eq("book_id", bookId)
        .maybeSingle();
    if (!isMissingLibraryTable(result.error)) return result as typeof result & { data: LibraryBookRow | null };
    const fallback = await getFallbackBooks();
    return { data: fallback.data.find((book) => book.book_id === bookId) ?? null, error: fallback.error };
}

async function accessCodeExists(accessCode: string) {
    const result = await supabase
        .from("teacher_library_books")
        .select("book_id")
        .eq("access_code", accessCode)
        .limit(1);
    if (isMissingLibraryTable(result.error)) {
        const fallback = await getFallbackBooks();
        return fallback.data.some((book) => book.access_code === accessCode);
    }
    return Boolean(result.data?.length);
}

export const libraryRouter = Router();

libraryRouter.get("/teacher/books", async (request, response) => {
    const authenticated = await requireTeacher(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(authenticated.user ? 403 : 401).json({ message: authenticated.error });
        return;
    }
    const books = await supabase
        .from("teacher_library_books")
        .select("book_id,title,access_code,updated_at")
        .order("title");
    if (books.error && !isMissingLibraryTable(books.error)) {
        response.status(400).json({ message: books.error.message });
        return;
    }
    const fallback = books.error ? await getFallbackBooks() : null;
    if (fallback?.error) {
        response.status(400).json({ message: fallback.error.message });
        return;
    }
    response.json({
        books: ((books.data ?? fallback?.data ?? []) as Array<{ access_code: string; book_id: string; title: string; updated_at: string }>).map((book) => ({
            accessCode: book.access_code,
            bookId: book.book_id,
            title: book.title,
            updatedAt: book.updated_at,
        })),
    });
});

libraryRouter.post("/teacher/books/:bookId/code", async (request, response) => {
    const authenticated = await requireTeacher(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(authenticated.user ? 403 : 401).json({ message: authenticated.error });
        return;
    }
    const bookId = request.params.bookId;
    const title = typeof request.body?.title === "string" ? request.body.title.trim().slice(0, 300) : "";
    if (!bookIdPattern.test(bookId) || !title) {
        response.status(400).json({ message: "A valid library book and title are required." });
        return;
    }

    let accessCode = createAccessCode();
    for (let attempt = 0; attempt < 12 && await accessCodeExists(accessCode); attempt += 1) {
        accessCode = createAccessCode();
    }
    const updatedAt = new Date().toISOString();
    const bookRow: LibraryBookRow = {
        access_code: accessCode,
        book_id: bookId,
        created_at: updatedAt,
        created_by: authenticated.user.id,
        title,
        updated_at: updatedAt,
    };
    const saved = await supabase.from("teacher_library_books").upsert(bookRow, { onConflict: "book_id" }).select("book_id,title,access_code,updated_at").single();
    if (isMissingLibraryTable(saved.error)) {
        const fallback = await saveFallbackBook(authenticated.user, bookRow);
        if (fallback.error) {
            response.status(400).json({ message: fallback.error.message });
            return;
        }
        response.json({
            book: { accessCode, bookId, title, updatedAt },
            storage: "compatibility",
        });
        return;
    }
    if (saved.error || !saved.data) {
        response.status(400).json({ message: saved.error?.message ?? "Could not generate the book code." });
        return;
    }
    response.json({
        book: {
            accessCode: saved.data.access_code,
            bookId: saved.data.book_id,
            title: saved.data.title,
            updatedAt: saved.data.updated_at,
        },
    });
});

libraryRouter.get("/teacher/books/:bookId", async (request, response) => {
    const authenticated = await requireTeacher(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(authenticated.user ? 403 : 401).json({ message: authenticated.error });
        return;
    }
    if (!bookIdPattern.test(request.params.bookId)) {
        response.status(400).json({ message: "That library book is not valid." });
        return;
    }
    const [book, attempts, corrections, listed] = await Promise.all([
        getBook(request.params.bookId),
        supabase
            .from("student_library_attempts")
            .select("id,user_id,book_id,attempt_number,score,total_questions,total_time_seconds,question_stats,started_at,completed_at")
            .eq("book_id", request.params.bookId)
            .order("completed_at", { ascending: false }),
        supabase
            .from("student_library_corrections")
            .select("id,user_id,book_id,attempt_id,responses,submitted_at,updated_at")
            .eq("book_id", request.params.bookId),
        supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);
    const attemptsMissing = isMissingLibraryTable(attempts.error);
    const correctionsMissing = isMissingLibraryTable(corrections.error);
    if (book.error || (attempts.error && !attemptsMissing) || (corrections.error && !correctionsMissing) || listed.error) {
        response.status(400).json({ message: book.error?.message ?? attempts.error?.message ?? corrections.error?.message ?? listed.error?.message });
        return;
    }
    const fallbackProgress = attemptsMissing || correctionsMissing ? await getFallbackAttemptsForBook(request.params.bookId) : null;
    if (fallbackProgress?.error) {
        response.status(400).json({ message: fallbackProgress.error.message });
        return;
    }
    const rows = (attemptsMissing ? fallbackProgress?.attempts ?? [] : attempts.data ?? []) as LibraryAttemptRow[];
    const correctionsByAttempt = new Map(
        ((correctionsMissing ? fallbackProgress?.corrections ?? [] : corrections.data ?? []) as LibraryCorrectionRow[]).map((correction) => [correction.attempt_id, correction]),
    );
    const rowsByStudent = new Map<string, LibraryAttemptRow[]>();
    rows.forEach((row) => rowsByStudent.set(row.user_id, [...(rowsByStudent.get(row.user_id) ?? []), row]));
    const students = listed.data.users
        .filter((user) => getUserRole(user) === "student" && getEnrolledClassIds(user.app_metadata).includes("shsat"))
        .map((user) => ({
            attempts: (rowsByStudent.get(user.id) ?? []).map((attempt) => teacherAttempt(attempt, correctionsByAttempt.get(attempt.id))),
            email: user.email ?? "",
            id: user.id,
            name: typeof user.user_metadata.full_name === "string"
                ? user.user_metadata.full_name
                : user.email?.split("@")[0] ?? "Student",
            username: typeof user.user_metadata.username === "string"
                ? user.user_metadata.username
                : user.email?.split("@")[0] ?? "student",
        }))
        .sort((left, right) => left.name.localeCompare(right.name));
    response.json({
        book: book.data ? {
            accessCode: book.data.access_code,
            bookId: book.data.book_id,
            title: book.data.title,
            updatedAt: book.data.updated_at,
        } : null,
        students,
    });
});

libraryRouter.post("/books/:bookId/unlock", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const book = await getBook(request.params.bookId);
    if (book.error) {
        response.status(400).json({ message: book.error.message });
        return;
    }
    if (!book.data || normalizeAccessCode(request.body?.code) !== normalizeAccessCode(book.data.access_code)) {
        response.status(403).json({ message: "That code does not unlock this book. Check the code and try again." });
        return;
    }
    response.json({ bookId: book.data.book_id, title: book.data.title, unlocked: true });
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
    if (getUserRole(authenticated.user) !== "student") {
        response.status(403).json({ message: "Only a student can open library corrections." });
        return;
    }
    if (!bookIdPattern.test(request.params.bookId)) {
        response.status(400).json({ message: "That library book is not valid." });
        return;
    }
    const firstAttempt = await supabase
        .from("student_library_attempts")
        .select("id,user_id,book_id,attempt_number,score,total_questions,total_time_seconds,question_stats,started_at,completed_at")
        .eq("user_id", authenticated.user.id)
        .eq("book_id", request.params.bookId)
        .order("attempt_number", { ascending: true })
        .limit(1)
        .maybeSingle();
    if (firstAttempt.error && !isMissingLibraryTable(firstAttempt.error)) {
        response.status(400).json({ message: firstAttempt.error.message });
        return;
    }
    const fallbackProgress = isMissingLibraryTable(firstAttempt.error)
        ? await getFallbackProgress(authenticated.user.id, request.params.bookId)
        : null;
    if (fallbackProgress?.error) {
        response.status(400).json({ message: fallbackProgress.error.message });
        return;
    }
    const attempt = isMissingLibraryTable(firstAttempt.error)
        ? [...(fallbackProgress?.data.attempts ?? [])].sort((left, right) => left.attempt_number - right.attempt_number)[0]
        : firstAttempt.data as LibraryAttemptRow | null;
    if (!attempt) {
        response.status(404).json({ message: "Finish your first attempt before opening corrections." });
        return;
    }
    if (attempt.score >= attempt.total_questions) {
        response.status(409).json({ message: "Your first attempt was already perfect, so no corrections are needed." });
        return;
    }
    const correction = fallbackProgress ? { data: fallbackProgress.data.correction, error: null } : await supabase
            .from("student_library_corrections")
            .select("id,user_id,book_id,attempt_id,responses,submitted_at,updated_at")
            .eq("user_id", authenticated.user.id)
            .eq("book_id", request.params.bookId)
            .eq("attempt_id", attempt.id)
            .maybeSingle();
    if (correction.error) {
        response.status(400).json({ message: correction.error.message });
        return;
    }
    response.json({
        attempt: teacherAttempt(attempt),
        correction: correction.data ? correctionSubmission(correction.data as LibraryCorrectionRow) : null,
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
    const firstAttempt = await supabase
        .from("student_library_attempts")
        .select("id,user_id,book_id,attempt_number,score,total_questions,total_time_seconds,question_stats,started_at,completed_at")
        .eq("user_id", authenticated.user.id)
        .eq("book_id", request.params.bookId)
        .order("attempt_number", { ascending: true })
        .limit(1)
        .maybeSingle();
    if (firstAttempt.error && !isMissingLibraryTable(firstAttempt.error)) {
        response.status(400).json({ message: firstAttempt.error.message });
        return;
    }
    const fallbackProgress = isMissingLibraryTable(firstAttempt.error)
        ? await getFallbackProgress(authenticated.user.id, request.params.bookId)
        : null;
    if (fallbackProgress?.error) {
        response.status(400).json({ message: fallbackProgress.error.message });
        return;
    }
    const attempt = isMissingLibraryTable(firstAttempt.error)
        ? [...(fallbackProgress?.data.attempts ?? [])].sort((left, right) => left.attempt_number - right.attempt_number)[0]
        : firstAttempt.data as LibraryAttemptRow | null;
    if (!attempt) {
        response.status(404).json({ message: "Finish your first attempt before submitting corrections." });
        return;
    }
    const missedQuestionIds = attempt.question_stats.filter((question) => !question.isCorrect).map((question) => question.questionId);
    if (!missedQuestionIds.length) {
        response.status(409).json({ message: "Your first attempt was already perfect, so no corrections are needed." });
        return;
    }
    const responses = normalizeCorrectionResponses(request.body?.responses, missedQuestionIds);
    if (!responses) {
        response.status(400).json({ message: "Explain both why your choice was incorrect and why the correct answer is correct for every missed question." });
        return;
    }
    const alreadySubmitted = fallbackProgress ? fallbackProgress.data.correction : (await supabase
            .from("student_library_corrections")
            .select("id")
            .eq("user_id", authenticated.user.id)
            .eq("book_id", request.params.bookId)
            .eq("attempt_id", attempt.id)
            .maybeSingle()).data;
    if (alreadySubmitted) {
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
    if (fallbackProgress) {
        const fallbackSaved = await saveFallbackProgress(authenticated.user.id, request.params.bookId, {
            ...fallbackProgress.data,
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
    const book = await getBook(request.params.bookId);
    if (book.error) {
        response.status(400).json({ message: book.error.message });
        return;
    }
    if (!book.data || normalizeAccessCode(request.body?.code) !== normalizeAccessCode(book.data.access_code)) {
        response.status(403).json({ message: "Your book code is no longer valid. Enter the current code and try again." });
        return;
    }
    const questionStats = normalizeQuestionStats(request.body?.questions);
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
        ? await getFallbackProgress(authenticated.user.id, request.params.bookId)
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
        response.status(201).json({ attempt: studentAttempt(attemptRow), storage: "compatibility" });
        return;
    }
    const saved = await supabase.from("student_library_attempts").insert(attemptRow).select("id,user_id,book_id,attempt_number,score,total_questions,total_time_seconds,question_stats,started_at,completed_at").single();
    if (saved.error || !saved.data) {
        response.status(400).json({ message: saved.error?.message ?? "Could not save this attempt." });
        return;
    }
    response.status(201).json({ attempt: studentAttempt(saved.data as LibraryAttemptRow) });
});
