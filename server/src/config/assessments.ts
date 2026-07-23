import fs from "node:fs";
import path from "node:path";

export type AssessmentStatus = "locked" | "open";
export type QuestionType =
    | "multiple_choice"
    | "multi_select"
    | "category_sort"
    | "table_match"
    | "inline_dropdown"
    | "numeric_entry"
    | "transition_drop"
    | "short_response"
    | "grid_in"
    | "essay";

export type AssessmentPassage = {
    id: string;
    imageUrl: string;
    text: string;
    title: string;
};

export type AssessmentQuestion = {
    answer: string;
    choices: string[];
    id: string;
    imageUrl: string;
    points: number;
    prompt: string;
    topic: string;
    type: QuestionType;
};

export type AssessmentForm = {
    id: string;
    label: string;
    passageOrder: string[];
};

export type Assessment = {
    classId: string;
    createdAt: string;
    description: string;
    durationMinutes: number;
    formAssignments: Record<string, string>;
    forms: AssessmentForm[];
    id: string;
    passages: AssessmentPassage[];
    questions: AssessmentQuestion[];
    split: boolean;
    status: AssessmentStatus;
    title: string;
    updatedAt: string;
};

export type AssessmentSummary = {
    classId: string;
    description: string;
    durationMinutes: number;
    id: string;
    passageCount: number;
    questionCount: number;
    questionTypes: QuestionType[];
    split: boolean;
    status: AssessmentStatus;
    title: string;
};

export type StudentAssessmentDetail = Omit<Assessment, "formAssignments" | "forms"> & {
    assignedFormId?: string;
    assignedFormLabel?: string;
    passageOrder?: string[];
};

export type CreateAssessmentInput = {
    classId: string;
    description: string;
    durationMinutes: number;
    imageUrl: string;
    passageText: string;
    passageTitle: string;
    questionAnswer: string;
    questionChoices: string[];
    questionPrompt: string;
    questionTopic: string;
    questionType: QuestionType;
    title: string;
};

const assessmentsFilePath = path.resolve(__dirname, "../../data/assessments.json");

function ensureAssessmentFile() {
    if (fs.existsSync(assessmentsFilePath)) {
        return;
    }

    fs.mkdirSync(path.dirname(assessmentsFilePath), { recursive: true });
    fs.writeFileSync(assessmentsFilePath, "[]\n", "utf8");
}

function readAssessments(): Assessment[] {
    ensureAssessmentFile();

    try {
        const contents = fs.readFileSync(assessmentsFilePath, "utf8");
        const assessments = JSON.parse(contents) as unknown;

        return Array.isArray(assessments)
            ? (assessments as Assessment[]).map((assessment) => ({
                  ...assessment,
                  formAssignments:
                      assessment.formAssignments && typeof assessment.formAssignments === "object"
                          ? assessment.formAssignments
                          : {},
                  forms: Array.isArray(assessment.forms) ? assessment.forms : [],
                  split: assessment.split === true,
              }))
            : [];
    } catch {
        return [];
    }
}

function writeAssessments(assessments: Assessment[]) {
    ensureAssessmentFile();
    fs.writeFileSync(assessmentsFilePath, `${JSON.stringify(assessments, null, 2)}\n`, "utf8");
}

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function toAssessmentSummary(assessment: Assessment): AssessmentSummary {
    return {
        classId: assessment.classId,
        description: assessment.description,
        durationMinutes: assessment.durationMinutes,
        id: assessment.id,
        passageCount: assessment.passages.length,
        questionCount: assessment.questions.length,
        questionTypes: Array.from(new Set(assessment.questions.map((question) => question.type))),
        split: assessment.split,
        status: assessment.status,
        title: assessment.title,
    };
}

export function listStudentAssessments(classIds: string[]) {
    const allowedClassIds = new Set(classIds);

    return readAssessments()
        .filter((assessment) => allowedClassIds.has(assessment.classId))
        .map(toAssessmentSummary);
}

export function listTeacherAssessments() {
    return readAssessments();
}

export function findAssessmentForStudent(assessmentId: string, classIds: string[]) {
    const allowedClassIds = new Set(classIds);

    return readAssessments().find(
        (assessment) => assessment.id === assessmentId && allowedClassIds.has(assessment.classId),
    );
}

export function createAssessment(input: CreateAssessmentInput) {
    const assessments = readAssessments();
    const timestamp = new Date().toISOString();
    const id = `${slugify(input.title) || "assessment"}-${Date.now().toString(36)}`;
    const assessment: Assessment = {
        classId: input.classId,
        createdAt: timestamp,
        description: input.description,
        durationMinutes: input.durationMinutes,
        formAssignments: {},
        forms: [],
        id,
        passages: input.passageText
            ? [
                  {
                      id: "passage-1",
                      imageUrl: input.imageUrl,
                      text: input.passageText,
                      title: input.passageTitle || "Untitled passage",
                  },
              ]
            : [],
        questions: input.questionPrompt
            ? [
                  {
                      answer: input.questionAnswer,
                      choices: input.questionChoices,
                      id: "question-1",
                      imageUrl: input.imageUrl,
                      points: 1,
                      prompt: input.questionPrompt,
                      topic: input.questionTopic || "Uncategorized",
                      type: input.questionType,
                  },
              ]
            : [],
        split: false,
        status: "locked",
        title: input.title,
        updatedAt: timestamp,
    };

    writeAssessments([assessment, ...assessments]);

    return assessment;
}

export function updateAssessmentStatus(assessmentId: string, status: AssessmentStatus) {
    let updatedAssessment: Assessment | null = null;
    const timestamp = new Date().toISOString();
    const assessments = readAssessments().map((assessment) => {
        if (assessment.id !== assessmentId) {
            return assessment;
        }

        updatedAssessment = {
            ...assessment,
            status,
            updatedAt: timestamp,
        };

        return updatedAssessment;
    });

    writeAssessments(assessments);

    return updatedAssessment;
}

export function updateAssessmentSplit(assessmentId: string, split: boolean) {
    let updatedAssessment: Assessment | null = null;
    const timestamp = new Date().toISOString();
    const assessments = readAssessments().map((assessment) => {
        if (assessment.id !== assessmentId) return assessment;
        updatedAssessment = { ...assessment, split, updatedAt: timestamp };
        return updatedAssessment;
    });

    writeAssessments(assessments);
    return updatedAssessment;
}

function isAssessmentForm(value: unknown): value is AssessmentForm {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const form = value as Record<string, unknown>;
    return (
        typeof form.id === "string" &&
        Boolean(form.id.trim()) &&
        typeof form.label === "string" &&
        Boolean(form.label.trim()) &&
        Array.isArray(form.passageOrder) &&
        form.passageOrder.every((passageId) => typeof passageId === "string" && Boolean(passageId.trim()))
    );
}

export function updateAssessmentForms(
    assessmentId: string,
    formsInput: unknown,
    assignmentsInput: unknown,
) {
    if (!Array.isArray(formsInput) || !formsInput.every(isAssessmentForm)) return null;
    if (!assignmentsInput || typeof assignmentsInput !== "object" || Array.isArray(assignmentsInput)) return null;

    const forms = formsInput.map((form) => ({
        id: form.id.trim(),
        label: form.label.trim(),
        passageOrder: Array.from(new Set(form.passageOrder.map((passageId) => passageId.trim()))),
    }));
    const formIds = new Set(forms.map((form) => form.id));
    if (formIds.size !== forms.length) return null;

    const formAssignments = Object.fromEntries(
        Object.entries(assignmentsInput as Record<string, unknown>).flatMap(([studentId, formId]) =>
            studentId.trim() && typeof formId === "string" && formIds.has(formId)
                ? [[studentId.trim(), formId]]
                : [],
        ),
    );

    let updatedAssessment: Assessment | null = null;
    const timestamp = new Date().toISOString();
    const assessments = readAssessments().map((assessment) => {
        if (assessment.id !== assessmentId) return assessment;
        const allowedPassageIds = new Set(assessment.passages.map((passage) => passage.id));
        if (
            forms.some(
                (form) =>
                    form.passageOrder.length !== allowedPassageIds.size ||
                    form.passageOrder.some((passageId) => !allowedPassageIds.has(passageId)),
            )
        ) {
            return assessment;
        }
        updatedAssessment = { ...assessment, formAssignments, forms, updatedAt: timestamp };
        return updatedAssessment;
    });

    if (!updatedAssessment) return null;
    writeAssessments(assessments);
    return updatedAssessment;
}

export function toStudentAssessmentDetail(
    assessment: Assessment,
    studentId: string,
): StudentAssessmentDetail {
    const { formAssignments: _formAssignments, forms: _forms, ...studentAssessment } = assessment;
    const assignedFormId = assessment.formAssignments[studentId];
    const assignedForm = assessment.forms.find((form) => form.id === assignedFormId);
    return {
        ...studentAssessment,
        assignedFormId: assignedForm?.id,
        assignedFormLabel: assignedForm?.label,
        passageOrder: assignedForm?.passageOrder,
    };
}
