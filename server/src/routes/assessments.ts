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
import { assignedContentIds, hasAssignedContent } from "../lib/learningPlanStore";
import { randomUUID } from "node:crypto";
import { supabase } from "../lib/supabase";
import { examReentryPrefix, readExamReentries, withExamWriteLock } from "../lib/examReentry";
import { examAttemptId, type ExamReentryGrant } from "../shared/examReentry";
import { submittedExamSections } from "../shared/examCompletion";

function applyReentry<T extends { sectionAccess: Record<AssessmentSection, boolean>; status: AssessmentStatus; allowCompletedAccess: boolean }>(assessment: T, grant?: ExamReentryGrant) {
    if (!grant?.remainingSections.length) return assessment;
    return { ...assessment, status: "open" as const, reentry: grant, sectionAccess: { english: grant.remainingSections.includes("english"), math: grant.remainingSections.includes("math") } };
}

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

    const personal = getUserRole(user) === "student" ? await assignedContentIds(user.id, "exam", true) : new Set<string>();
    const { grants } = await readExamReentries(user.id);
    response.json({ assessments: listStudentAssessments(classIds).map(assessment => applyReentry(personal.has(assessment.id) ? { ...assessment, status: "open" as const, allowCompletedAccess: true, sectionAccess: { english: true, math: true } } : assessment, grants[assessment.id])) });
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

    const personalAccess = getUserRole(user) === "student" && await hasAssignedContent(user.id, "exam", assessment.id, true);
    const { grants } = await readExamReentries(user.id);
    const reentry = grants[assessment.id];
    if (assessment.status !== "open" && !isTeacher && !personalAccess && !reentry?.remainingSections.length) {
        response.status(403).json({ message: "This exam is still locked by your teacher." });
        return;
    }

    response.json({ assessment: applyReentry(toStudentAssessmentDetail(personalAccess ? { ...assessment, status: "open", allowCompletedAccess: true, sectionAccess: { english: true, math: true } } : assessment, user.id), reentry) });
});

assessmentsRouter.route("/teacher/:assessmentId/reentry/:studentId")
    .all(async (request, response, next) => {
        const { error, user } = await getAuthenticatedUser(request.headers.authorization);
        if (error || !user) { response.status(401).json({ message: error }); return; }
        if (getUserRole(user) !== "teacher") { response.status(403).json({ message: "Teacher access is required." }); return; }
        response.locals.teacherId = user.id;
        const lookup = await supabase.auth.admin.getUserById(request.params.studentId);
        const student = lookup.data.user;
        const assessment = student && getUserRole(student) === "student" ? findAssessmentForStudent(request.params.assessmentId, getEnrolledClassIds(student.app_metadata)) : null;
        if (lookup.error || !student || !assessment) { response.status(404).json({ message: "This student is not enrolled for this assessment." }); return; }
        next();
    })
    .get(async (request, response) => {
        const { grants, records } = await readExamReentries(request.params.studentId);
        const result = records.get(request.params.assessmentId);
        response.json({ grant: grants[request.params.assessmentId] ?? null, hasSubmission: Boolean(result && submittedExamSections(result).length), completedSections: result ? submittedExamSections(result) : [] });
    })
    .put(async (request, response) => withExamWriteLock(request.params.studentId, request.params.assessmentId, async () => {
        const { sections, additionalMinutes = 0 } = request.body ?? {};
        if (!Array.isArray(sections) || !sections.length || sections.some(section => section !== "english" && section !== "math") || !Number.isInteger(additionalMinutes) || additionalMinutes < 0 || additionalMinutes > 180) {
            response.status(400).json({ message: "Choose English and/or Math and 0–180 additional minutes." }); return;
        }
        const { records, grants } = await readExamReentries(request.params.studentId);
        const original = records.get(request.params.assessmentId);
        if (!original || !submittedExamSections(original).length || original.source === "manual" || original.source === "answer_sheet" || !original.answers) {
            response.status(409).json({ message: "This student needs a submitted digital exam before it can be reopened." }); return;
        }
        const now = Date.now(), grantedAt = new Date(now).toISOString();
        const previousGrant = grants[request.params.assessmentId];
        const originalTimer = (previousGrant?.remainingSections.length && original.reentryGrantId !== previousGrant.id ? previousGrant.timerState : original.timerState) as ExamReentryGrant["timerState"] | undefined;
        const stop = originalTimer?.pausedAt ?? (Number.isFinite(Date.parse(String(original.completedAt))) ? Date.parse(String(original.completedAt)) : now);
        const elapsed = originalTimer && Number.isFinite(originalTimer.startedAt) && Number.isFinite(originalTimer.totalPausedMs)
            ? Math.max(0, stop - originalTimer.startedAt - originalTimer.totalPausedMs)
            : typeof original.totalTimeSeconds === "number" ? original.totalTimeSeconds * 1000 : 180 * 60_000;
        const grant: ExamReentryGrant = {
            id: randomUUID(), assessmentId: request.params.assessmentId, studentId: request.params.studentId,
            attemptId: examAttemptId(original, request.params.assessmentId), sections: [...new Set<AssessmentSection>(sections)], remainingSections: [...new Set<AssessmentSection>(sections)],
            grantedAt, grantedBy: response.locals.teacherId, additionalMinutes,
            draftsFrom: previousGrant?.remainingSections.length ? previousGrant.draftsFrom ?? previousGrant.grantedAt : grantedAt,
            timerState: { startedAt: now - elapsed, pausedAt: now, totalPausedMs: additionalMinutes * 60_000 },
        };
        const archived = await supabase.from("student_exam_results").upsert({ user_id: grant.studentId, assessment_id: `__exam_revision__:${grant.assessmentId}:${grant.id}`, result: original, completed_at: original.completedAt ?? grantedAt, updated_at: grantedAt }, { onConflict: "user_id,assessment_id" });
        if (archived.error) { response.status(503).json({ message: "Could not preserve the submitted answers. Try again." }); return; }
        const saved = await supabase.from("student_exam_results").upsert({ user_id: grant.studentId, assessment_id: `${examReentryPrefix}${grant.assessmentId}`, result: grant, completed_at: grantedAt, updated_at: grantedAt }, { onConflict: "user_id,assessment_id" });
        if (saved.error) { response.status(503).json({ message: "Could not save re-entry permission. Try again." }); return; }
        response.json({ grant });
    }))
    .delete(async (request, response) => withExamWriteLock(request.params.studentId, request.params.assessmentId, async () => {
        const { grants } = await readExamReentries(request.params.studentId);
        const previous = grants[request.params.assessmentId];
        if (!previous) { response.json({ grant: null }); return; }
        const revokedAt = new Date().toISOString(), grant = { ...previous, revokedAt, remainingSections: [] };
        const saved = await supabase.from("student_exam_results").upsert({ user_id: request.params.studentId, assessment_id: `${examReentryPrefix}${request.params.assessmentId}`, result: grant, completed_at: grant.grantedAt, updated_at: revokedAt }, { onConflict: "user_id,assessment_id" });
        if (saved.error) { response.status(503).json({ message: "Could not revoke re-entry permission. Try again." }); return; }
        response.json({ grant });
    }));

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
