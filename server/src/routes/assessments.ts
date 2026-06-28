import { Router } from "express";
import {
    createAssessment,
    findAssessmentForStudent,
    listStudentAssessments,
    listTeacherAssessments,
    type AssessmentStatus,
    type QuestionType,
    updateAssessmentStatus,
} from "../config/assessments";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole } from "../lib/auth";

type CreateAssessmentBody = {
    classId?: unknown;
    description?: unknown;
    durationMinutes?: unknown;
    imageUrl?: unknown;
    passageText?: unknown;
    passageTitle?: unknown;
    questionAnswer?: unknown;
    questionChoices?: unknown;
    questionPrompt?: unknown;
    questionTopic?: unknown;
    questionType?: unknown;
    title?: unknown;
};

type UpdateStatusBody = {
    status?: unknown;
};

const questionTypes = [
    "multiple_choice",
    "multi_select",
    "category_sort",
    "inline_dropdown",
    "numeric_entry",
    "short_response",
    "grid_in",
    "essay",
] as const;

function getString(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function parseDuration(value: unknown) {
    const duration = typeof value === "number" ? value : Number(value);

    if (!Number.isFinite(duration) || duration <= 0) {
        return 45;
    }

    return Math.round(duration);
}

function parseQuestionType(value: unknown): QuestionType {
    return questionTypes.find((questionType) => questionType === value) ?? "multiple_choice";
}

function parseChoices(value: unknown) {
    if (Array.isArray(value)) {
        return value.filter((choice): choice is string => typeof choice === "string").map((choice) => choice.trim());
    }

    if (typeof value !== "string") {
        return [];
    }

    return value
        .split("\n")
        .map((choice) => choice.trim())
        .filter(Boolean);
}

function parseStatus(value: unknown): AssessmentStatus | null {
    return value === "locked" || value === "open" ? value : null;
}

export const assessmentsRouter = Router();

assessmentsRouter.get("/student", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const classIds = getUserRole(user) === "teacher" ? ["shsat"] : getEnrolledClassIds(user.app_metadata);

    response.json({ assessments: listStudentAssessments(classIds) });
});

assessmentsRouter.get("/student/:assessmentId", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const isTeacher = getUserRole(user) === "teacher";
    const classIds = isTeacher ? ["shsat"] : getEnrolledClassIds(user.app_metadata);
    const assessment = findAssessmentForStudent(request.params.assessmentId, classIds);

    if (!assessment) {
        response.status(404).json({ message: "Assessment was not found." });
        return;
    }

    if (assessment.status !== "open" && !isTeacher) {
        response.status(403).json({ message: "This exam is still locked by your teacher." });
        return;
    }

    response.json({ assessment });
});

assessmentsRouter.get("/teacher", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    if (getUserRole(user) !== "teacher") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    response.json({ assessments: listTeacherAssessments() });
});

assessmentsRouter.post("/teacher", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    if (getUserRole(user) !== "teacher") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const body = request.body as CreateAssessmentBody;
    const title = getString(body.title);

    if (!title) {
        response.status(400).json({ message: "Assessment title is required." });
        return;
    }

    const assessment = createAssessment({
        classId: getString(body.classId) || "shsat",
        description: getString(body.description),
        durationMinutes: parseDuration(body.durationMinutes),
        imageUrl: getString(body.imageUrl),
        passageText: getString(body.passageText),
        passageTitle: getString(body.passageTitle),
        questionAnswer: getString(body.questionAnswer),
        questionChoices: parseChoices(body.questionChoices),
        questionPrompt: getString(body.questionPrompt),
        questionTopic: getString(body.questionTopic),
        questionType: parseQuestionType(body.questionType),
        title,
    });

    response.status(201).json({ assessment });
});

assessmentsRouter.patch("/teacher/:assessmentId/status", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    if (getUserRole(user) !== "teacher") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const body = request.body as UpdateStatusBody;
    const status = parseStatus(body.status);

    if (!status) {
        response.status(400).json({ message: "Status must be open or locked." });
        return;
    }

    const assessment = updateAssessmentStatus(request.params.assessmentId, status);

    if (!assessment) {
        response.status(404).json({ message: "Assessment was not found." });
        return;
    }

    response.json({ assessment });
});
