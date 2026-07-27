import { Router } from "express";
import {
    findAssessmentForStudent,
    listStudentAssessments,
    listTeacherAssessments,
    toStudentAssessmentDetail,
    type AssessmentSection,
    type AssessmentStatus,
    updateAssessmentCompletedAccess,
    updateAssessmentForms,
    updateAssessmentSectionAccess,
    updateAssessmentStatus,
} from "../config/assessments";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole } from "../lib/auth";

type UpdateStatusBody = {
    status?: unknown;
};

type UpdateCompletedAccessBody = { allowCompletedAccess?: unknown };
type UpdateFormsBody = { assignments?: unknown; forms?: unknown };
type UpdateSectionAccessBody = { open?: unknown };

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

    response.json({ assessment: toStudentAssessmentDetail(assessment, user.id) });
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

assessmentsRouter.patch("/teacher/:assessmentId/completed-access", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    if (getUserRole(user) !== "teacher") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const { allowCompletedAccess } = request.body as UpdateCompletedAccessBody;
    if (typeof allowCompletedAccess !== "boolean") {
        response.status(400).json({ message: "Completed access must be true or false." });
        return;
    }
    const assessment = updateAssessmentCompletedAccess(
        request.params.assessmentId,
        allowCompletedAccess,
    );
    if (!assessment) {
        response.status(404).json({ message: "Assessment was not found." });
        return;
    }
    response.json({ assessment });
});

assessmentsRouter.patch("/teacher/:assessmentId/sections/:section", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    if (getUserRole(user) !== "teacher") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const section = request.params.section as AssessmentSection;
    if (section !== "english" && section !== "math") {
        response.status(400).json({ message: "Section must be English or Math." });
        return;
    }
    const { open } = request.body as UpdateSectionAccessBody;
    if (typeof open !== "boolean") {
        response.status(400).json({ message: "Section access must be true or false." });
        return;
    }
    const assessment = updateAssessmentSectionAccess(
        request.params.assessmentId,
        section,
        open,
    );
    if (!assessment) {
        response.status(404).json({ message: "Assessment was not found." });
        return;
    }
    response.json({ assessment });
});

assessmentsRouter.put("/teacher/:assessmentId/forms", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }
    if (getUserRole(user) !== "teacher") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const { assignments, forms } = request.body as UpdateFormsBody;
    const assessment = updateAssessmentForms(request.params.assessmentId, forms, assignments);
    if (!assessment) {
        response.status(400).json({
            message: "Forms must contain each Reading Comprehension passage exactly once, and every assignment must use a saved form.",
        });
        return;
    }
    response.json({ assessment });
});
