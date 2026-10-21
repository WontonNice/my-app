import type { ExamContent, ExamPassage, ExamQuestion } from "./examTypes";
import { isExamQuestionCorrect, type ExamResult, type SelectedAnswer } from "./examGrading";

export type CorrectionStroke = { color: string; width: number; points: [number, number][] };
export const correctionInkColors = ["#173747", "#2563eb", "#dc2626"] as const;

export function normalizeCorrectionDrawing(value: unknown): CorrectionStroke[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > 150) throw new Error("The drawing has too many strokes. Simplify it before submitting.");
  let pointCount = 0;
  return value.map(stroke => {
    if (!stroke || !correctionInkColors.includes(stroke.color) || ![2, 4, 6].includes(stroke.width) || !Array.isArray(stroke.points) || stroke.points.length < 1) throw new Error("The correction drawing is invalid.");
    pointCount += stroke.points.length;
    if (pointCount > 6000) throw new Error("The drawing is too detailed. Simplify it before submitting.");
    const points: [number, number][] = stroke.points.map((point: unknown) => {
      if (!Array.isArray(point) || point.length !== 2 || point.some(n => typeof n !== "number" || !Number.isFinite(n)) || point[0] < 0 || point[0] > 900 || point[1] < 0 || point[1] > 360) throw new Error("The correction drawing contains an invalid point.");
      return [Math.round(point[0] * 10) / 10, Math.round(point[1] * 10) / 10];
    });
    return { color: stroke.color, width: stroke.width, points };
  });
}

export type CorrectionResponse = {
  questionId: string;
  whyChosenIncorrect: string;
  whyCorrectAnswerCorrect: string;
  understanding: number;
  questionType?: string;
  drawing?: CorrectionStroke[];
};
export type ReviewQuestion = {
  question: ExamQuestion;
  passage?: ExamPassage;
  number: number;
  section: "english" | "math";
  submittedAnswer?: SelectedAnswer;
  isCorrect: boolean;
};
export type CorrectionSubmission = {
  assessmentId: string;
  resultVersion: string;
  studentId: string;
  submittedAt: string;
  responses: CorrectionResponse[];
  questions: ReviewQuestion[];
};
export type ExamCorrectionView = {
  result: ExamResult;
  resultVersion: string;
  questions: ReviewQuestion[];
  submission: CorrectionSubmission | null;
  readOnly?: boolean;
};

export function reviewQuestions(content: ExamContent, result: ExamResult): ReviewQuestion[] {
  const sections = result.completedSections ?? (result.completionStatus === "english_complete" ? ["english"] : result.completionStatus === "math_complete" ? ["math"] : ["english", "math"]);
  const passageOrder = new Map((result.passages ?? []).map((passage, index) => [passage.id, index]));
  const passageSets = [...content.passageSets].sort((a, b) => (passageOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (passageOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER));
  const english = [
    ...passageSets.flatMap(set => set.questions.map(question => ({ question, passage: set.passage }))),
    ...(content.standaloneSection?.questions ?? []).map(question => ({ question, passage: undefined })),
  ];
  return [
    ...(sections.includes("english") ? english.map((item, index) => ({ ...item, number: index + 1, section: "english" as const })) : []),
    ...(sections.includes("math") ? (content.mathSection?.questions ?? []).map((question, index) => ({ question, number: index + 1, section: "math" as const })) : []),
  ].map(item => ({ ...item, submittedAnswer: result.answers?.[item.question.id], isCorrect: isExamQuestionCorrect(item.question, result.answers?.[item.question.id]) }));
}

export function validateCorrections(
  questions: ReviewQuestion[],
  input: unknown,
  { allowPartial = false }: { allowPartial?: boolean } = {},
): CorrectionResponse[] {
  if (!Array.isArray(input)) throw new Error(allowPartial ? "Submit at least one correction." : "Enter a correction for every incorrect question.");
  const incorrect = questions.filter(item => !item.isCorrect);
  const submittedIds = input.map(item => item?.questionId);
  const uniqueSubmittedIds = new Set(submittedIds);
  if (allowPartial) {
    const incorrectIds = new Set(incorrect.map(item => item.question.id));
    if (!input.length || uniqueSubmittedIds.size !== input.length || submittedIds.some(id => !incorrectIds.has(id))) {
      throw new Error("Submit each selected correction exactly once.");
    }
  } else if (input.length !== incorrect.length || uniqueSubmittedIds.size !== incorrect.length) {
    throw new Error("Enter a correction for every incorrect question exactly once.");
  }
  return incorrect.filter(item => uniqueSubmittedIds.has(item.question.id)).map(item => {
    const response = input.find(value => value?.questionId === item.question.id);
    const wrong = typeof response?.whyChosenIncorrect === "string" ? response.whyChosenIncorrect.trim() : "";
    const correct = typeof response?.whyCorrectAnswerCorrect === "string" ? response.whyCorrectAnswerCorrect.trim() : "";
    const drawing = item.section === "math" ? normalizeCorrectionDrawing(response?.drawing) : undefined;
    if ((!correct && !drawing?.length) || (item.section === "english" && !wrong)) {
      throw new Error(`${item.section === "english" ? "English" : "Math"} question ${item.number}: complete the required explanations.`);
    }
    if (correct.length > 10000 || wrong.length > 10000) throw new Error("Keep each explanation under 10,000 characters.");
    if (!Number.isInteger(response.understanding) || response.understanding < 1 || response.understanding > 5) {
      throw new Error(`Question ${item.number}: choose an understanding rating from 1 to 5.`);
    }
    const questionType = typeof response.questionType === "string" ? response.questionType.trim() : "";
    if (!questionType || questionType.length > 120) throw new Error(`Question ${item.number}: select a question type.`);
    return { questionId: item.question.id, whyChosenIncorrect: wrong, whyCorrectAnswerCorrect: correct, understanding: response.understanding, questionType, ...(drawing ? { drawing } : {}) };
  });
}
