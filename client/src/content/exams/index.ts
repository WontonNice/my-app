import { shsatDiagnostic1Content } from "./shsatDiagnostic1";
import { createPlainTextPassage } from "./formatters";
import type {
  AssessmentContentSource,
  ExamChoice,
  ExamContent,
  ExamQuestion,
} from "./types";

const examContentByAssessmentId: Record<string, ExamContent> = {
  [shsatDiagnostic1Content.assessmentId]: shsatDiagnostic1Content,
};

function createChoices(choices: string[]): ExamChoice[] {
  return choices.map((choice, index) => ({
    id: String.fromCharCode(65 + index),
    text: choice,
  }));
}

function createCategoryItems(choices: string[]) {
  return choices.map((choice, index) => ({
    id: String.fromCharCode(65 + index),
    text: choice,
  }));
}

function parseAnswerIds(answer: string) {
  return answer
    .split(/[\n,]/)
    .map((answerId) => answerId.trim().toUpperCase())
    .filter(Boolean);
}

function isChoiceBasedQuestion(question: AssessmentContentSource["questions"][number]) {
  return !["numeric_entry", "short_response", "grid_in", "essay", "category_sort", "inline_dropdown"].includes(
    question.type,
  );
}

function createFallbackQuestions(assessment: AssessmentContentSource): ExamQuestion[] {
  if (assessment.questions.length === 0) {
    return [
      {
        choices: [
          { id: "A", text: "Choice A" },
          { id: "B", text: "Choice B" },
          { id: "C", text: "Choice C" },
          { id: "D", text: "Choice D" },
        ],
        id: "question-1",
        prompt: "Question content has not been added for this assessment yet.",
        topic: "Uncategorized",
        type: "multiple_choice",
      },
    ];
  }

  return assessment.questions.map((question, index) => {
    const correctChoiceIds = question.type === "multi_select" ? parseAnswerIds(question.answer) : [];
    const isCategorySort = question.type === "category_sort";
    const isTextEntry = ["numeric_entry", "short_response", "grid_in"].includes(question.type);

    return {
      categories: isCategorySort
        ? [
            { id: "category-1", title: "Category 1" },
            { id: "category-2", title: "Category 2" },
          ]
        : undefined,
      choices: isChoiceBasedQuestion(question) ? createChoices(question.choices) : undefined,
      correctChoiceIds: correctChoiceIds.length > 0 ? correctChoiceIds : undefined,
      correctTextAnswers: isTextEntry && question.answer ? [question.answer] : undefined,
      id: question.id || `question-${index + 1}`,
      instructions: isCategorySort
        ? "Move each answer to the correct box."
        : question.type === "multi_select"
          ? "Select the two correct answers."
          : undefined,
      items: isCategorySort ? createCategoryItems(question.choices) : undefined,
      points: question.points,
      prompt: question.prompt,
      requiredSelections:
        question.type === "multi_select" ? Math.max(2, correctChoiceIds.length || 2) : undefined,
      topic: question.topic || "Uncategorized",
      type: question.type,
    };
  });
}

function createFallbackExamContent(assessment: AssessmentContentSource): ExamContent {
  const firstPassage = assessment.passages[0];
  const questions = createFallbackQuestions(assessment);

  return {
    assessmentId: assessment.id,
    title: assessment.title,
    passageSets: [
      {
        id: firstPassage?.id || "passage-set-1",
        label: firstPassage?.title || "Passage Set 1",
        questionCount: questions.length,
        directions: {
          subject: "English Language Arts",
          title: "READING COMPREHENSION",
          body:
            "Read the text and answer the related questions. Base your answers only on the content within the text.",
        },
        passage: createPlainTextPassage({
          id: firstPassage?.id || "passage-1",
          text: firstPassage?.text || "",
          title: firstPassage?.title || "Untitled Passage",
        }),
        questions,
      },
    ],
  };
}

export function resolveExamContent(assessment: AssessmentContentSource) {
  return examContentByAssessmentId[assessment.id] ?? createFallbackExamContent(assessment);
}

export type { ExamChoice, ExamContent, ExamPassage, ExamPassageLine, ExamPassageSet, ExamQuestion } from "./types";
