import fs from "node:fs";
import path from "node:path";

export type AssessmentStatus = "locked" | "open";
export type QuestionType =
    | "multiple_choice"
    | "multi_select"
    | "category_sort"
    | "inline_dropdown"
    | "numeric_entry"
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

export type Assessment = {
    classId: string;
    createdAt: string;
    description: string;
    durationMinutes: number;
    id: string;
    passages: AssessmentPassage[];
    questions: AssessmentQuestion[];
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
    status: AssessmentStatus;
    title: string;
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

        return Array.isArray(assessments) ? (assessments as Assessment[]) : [];
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
