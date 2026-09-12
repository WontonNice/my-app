import { Router } from "express";
import { createHash } from "node:crypto";
import { findAssessmentForStudent, listTeacherAssessments, updateAssessmentCorrectionsAccess } from "../config/assessments";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole } from "../lib/auth";
import { getExamContent } from "../lib/examContent";
import { supabase } from "../lib/supabase";
import { createExamResult, getAllExamQuestions, type ExamResult, type SelectedAnswers } from "../shared/examGrading";
import { reviewQuestions, validateCorrections, type CorrectionSubmission } from "../shared/examCorrections";
import { getDatabaseProgress } from "./progress";

export const correctionPrefix = "__exam_corrections__:";
export const examReviewRouter = Router();
const isStaff = (role: string) => role === "teacher" || role === "admin";

examReviewRouter.use(async (request, response, next) => {
    const auth = await getAuthenticatedUser(request.headers.authorization);
    if (!auth.user) { response.status(401).json({ message: auth.error }); return; }
    response.locals.user = auth.user;
    next();
});

examReviewRouter.patch("/teacher/:assessmentId/access", (request, response) => {
    if (!isStaff(getUserRole(response.locals.user))) { response.status(403).json({ message: "Teacher access is required." }); return; }
    if (typeof request.body?.open !== "boolean") { response.status(400).json({ message: "Choose open or locked." }); return; }
    const assessment = updateAssessmentCorrectionsAccess(request.params.assessmentId, request.body.open);
    if (!assessment) { response.status(404).json({ message: "Exam not found." }); return; }
    response.json({ assessment });
});

examReviewRouter.get("/teacher/:assessmentId/submissions", async (request, response) => {
    if (!isStaff(getUserRole(response.locals.user))) { response.status(403).json({ message: "Teacher access is required." }); return; }
    const assessment = listTeacherAssessments().find(item => item.id === request.params.assessmentId);
    const content = assessment ? getExamContent(assessment.id) : null;
    if (!assessment || !content) { response.status(404).json({ message: "Exam content was not found." }); return; }
    const storagePrefix = `${correctionPrefix}${assessment.id}:`;
    const correctionRows = await supabase.from("student_exam_results").select("user_id,result")
        .gte("assessment_id", storagePrefix)
        .lt("assessment_id", `${storagePrefix}\uffff`);
    if (correctionRows.error) { response.status(503).json({ message: "Correction submissions could not be loaded. Try again." }); return; }
    const studentIds = [...new Set((correctionRows.data ?? []).map(row => String(row.user_id)))];
    const resultRows = studentIds.length
        ? await supabase.from("student_exam_results").select("user_id,result").eq("assessment_id", assessment.id).in("user_id", studentIds)
        : { data: [], error: null };
    if (resultRows.error) { response.status(503).json({ message: "Correction submissions could not be loaded. Try again." }); return; }
    const resultsByStudent = new Map((resultRows.data ?? []).map(row => [String(row.user_id), row.result as ExamResult]));
    const submissions = (correctionRows.data ?? []).flatMap(row => {
        const stored = row.result && typeof row.result === "object" && !Array.isArray(row.result) ? row.result as Partial<CorrectionSubmission> : null;
        if (!stored || !Array.isArray(stored.responses) || typeof stored.submittedAt !== "string" || typeof stored.resultVersion !== "string") return [];
        const studentResult = resultsByStudent.get(String(row.user_id));
        const questions = Array.isArray(stored.questions) ? stored.questions : studentResult ? reviewQuestions(content, studentResult) : [];
        return [{ ...stored, assessmentId: assessment.id, studentId: String(row.user_id), questions } as CorrectionSubmission];
    });
    response.json({ submissions });
});

examReviewRouter.post("/teacher/:assessmentId/answers/:studentId", async (request, response) => {
    const teacher = response.locals.user;
    if (!isStaff(getUserRole(teacher))) { response.status(403).json({ message: "Teacher access is required." }); return; }
    const studentLookup = await supabase.auth.admin.getUserById(request.params.studentId);
    const student = studentLookup.data.user;
    const assessment = listTeacherAssessments().find(item => item.id === request.params.assessmentId);
    if (!student || getUserRole(student) !== "student" || !assessment || !getEnrolledClassIds(student.app_metadata).includes(assessment.classId)) {
        response.status(404).json({ message: "Choose a student enrolled in this exam's class." }); return;
    }
    const content = getExamContent(assessment.id);
    if (!content) { response.status(409).json({ message: "Save the exam content before entering answers." }); return; }
    const { answers, completedDate, completedSections } = request.body ?? {};
    if (!answers || typeof answers !== "object" || Array.isArray(answers) || !Array.isArray(completedSections) || !completedSections.length || completedSections.some(section => section !== "english" && section !== "math") || new Set(completedSections).size !== completedSections.length) {
        response.status(400).json({ message: "Choose the completed sections and enter student answers." }); return;
    }
    if (typeof completedDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(completedDate) || !Number.isFinite(Date.parse(completedDate)) || new Date(`${completedDate}T12:00:00Z`).toISOString().slice(0, 10) !== completedDate) {
        response.status(400).json({ message: "Enter a valid test date." }); return;
    }
    const assignedForm = assessment.forms.find(form => form.id === assessment.formAssignments[student.id]);
    const order = new Map((assignedForm?.passageOrder ?? []).map((id, index) => [id, index]));
    const orderedContent = { ...content, passageSets: [...content.passageSets].sort((a, b) => (order.get(a.passage.id) ?? order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.passage.id) ?? order.get(b.id) ?? Number.MAX_SAFE_INTEGER)) };
    const result = createExamResult(orderedContent, answers as SelectedAnswers, completedSections);
    if (result.total === getAllExamQuestions(content).length) result.completionStatus = "complete";
    const questions = reviewQuestions(content, result);
    const questionIds = new Set(questions.map(item => item.question.id));
    const validAnswer = (answer: unknown) => typeof answer === "string" || (Array.isArray(answer) ? answer.every(value => typeof value === "string") : answer !== null && typeof answer === "object" && Object.values(answer).every(value => typeof value === "string"));
    if (!questions.length || Object.entries(answers).some(([id, answer]) => !questionIds.has(id) || !validAnswer(answer))) {
        response.status(400).json({ message: "Answers must belong to questions in the selected sections." }); return;
    }
    result.source = "manual";
    result.completedAt = `${completedDate}T12:00:00.000Z`;
    // Insert only: entering a past test must never replace existing student work.
    const progress = await getDatabaseProgress(student);
    if (progress.examResults.some(item => item.assessmentId === assessment.id)) {
        response.status(409).json({ message: "This student already has a result for this exam. Existing answers were kept." }); return;
    }
    const saved = await supabase.from("student_exam_results").insert({ user_id: student.id, assessment_id: assessment.id, result, completed_at: result.completedAt, updated_at: new Date().toISOString() });
    if (saved.error) { response.status(saved.error.code === "23505" ? 409 : 503).json({ message: saved.error.code === "23505" ? "This student already has a result for this exam." : "Answers could not be saved. Try again." }); return; }
    response.status(201).json({ result });
});

examReviewRouter.all("/student/:assessmentId", async (request, response) => {
    if (request.method !== "GET" && request.method !== "POST") { response.sendStatus(405); return; }
    const user = response.locals.user;
    if (getUserRole(user) !== "student") { response.status(403).json({ message: "Sign in as a student to open corrections." }); return; }
    const assessment = findAssessmentForStudent(request.params.assessmentId, getEnrolledClassIds(user.app_metadata));
    if (!assessment) { response.status(404).json({ message: "Exam not found." }); return; }
    if (!assessment.correctionsOpen) { response.status(403).json({ message: "Your teacher has not opened corrections for this exam." }); return; }
    const progress = await getDatabaseProgress(user);
    const result = progress.examResults.find(item => item.assessmentId === assessment.id) as ExamResult | undefined;
    if (!result || !result.answers) { response.status(409).json({ message: "Individual submitted answers are needed before corrections can open." }); return; }
    const content = getExamContent(assessment.id);
    if (!content) { response.status(409).json({ message: "The exam content is unavailable. Ask your teacher to save the exam." }); return; }
    const questions = reviewQuestions(content, result);
    const resultVersion = createHash("sha256").update(JSON.stringify({ result, questions })).digest("hex");
    const storageId = `${correctionPrefix}${assessment.id}:${resultVersion}`;
    const existing = await supabase.from("student_exam_results").select("result").eq("user_id", user.id).eq("assessment_id", storageId).maybeSingle();
    if (existing.error) { response.status(503).json({ message: "Corrections could not be loaded. Try again." }); return; }
    const storedSubmission = existing.data?.result && typeof existing.data.result === "object" && !Array.isArray(existing.data.result)
        ? existing.data.result as Partial<CorrectionSubmission>
        : null;
    const existingSubmission = storedSubmission
        ? { ...storedSubmission, assessmentId: assessment.id, studentId: user.id, resultVersion, questions } as CorrectionSubmission
        : null;
    if (request.method === "GET") { response.json({ result, questions, resultVersion, submission: existingSubmission }); return; }
    if (request.body?.resultVersion !== resultVersion) { response.status(409).json({ message: "The exam or your answers changed. Reload corrections before submitting." }); return; }
    if (existing.data) { response.status(409).json({ message: "You already submitted these corrections." }); return; }
    let responses;
    try { responses = validateCorrections(questions, request.body?.responses); }
    catch (error) { response.status(400).json({ message: error instanceof Error ? error.message : "Complete all required fields." }); return; }
    const submittedAt = new Date().toISOString();
    if (!findAssessmentForStudent(assessment.id, getEnrolledClassIds(user.app_metadata))?.correctionsOpen) {
        response.status(403).json({ message: "Your teacher has locked corrections. Your draft is still available." }); return;
    }
    const submission: CorrectionSubmission = { assessmentId: assessment.id, studentId: user.id, resultVersion, submittedAt, responses, questions };
    const compactSubmission = { assessmentId: assessment.id, resultVersion, submittedAt, responses };
    const saved = await supabase.from("student_exam_results").insert({ user_id: user.id, assessment_id: storageId, result: compactSubmission, completed_at: submittedAt, updated_at: submittedAt });
    if (saved.error) { response.status(saved.error.code === "23505" ? 409 : 503).json({ message: saved.error.code === "23505" ? "You already submitted these corrections." : "Corrections could not be saved. Your draft is still available; try again." }); return; }
    response.status(201).json({ submission });
});

