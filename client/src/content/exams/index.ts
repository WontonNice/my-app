import { createPlainTextPassage } from "./formatters";
import { formA2025_2026Content } from "./tests/formA2025_2026";
import { shsatDiagnostic1Content } from "./tests/shsatDiagnostic1";
import type {
  AssessmentContentSource,
  ExamChoice,
  ExamContent,
  ExamPassageSection,
  ExamPassageSet,
  ExamQuestion,
} from "./types";

const examContentByAssessmentId: Record<string, ExamContent> = {
  [formA2025_2026Content.assessmentId]: formA2025_2026Content,
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
  return !["numeric_entry", "short_response", "grid_in", "essay", "category_sort", "table_match", "inline_dropdown"].includes(
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
    const isCategorySort = question.type === "category_sort" || question.type === "table_match";
    const isTableMatch = question.type === "table_match";
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
      categoryCapacity: isTableMatch ? 1 : undefined,
      id: question.id || `question-${index + 1}`,
      instructions: isCategorySort
        ? isTableMatch
          ? "Move the correct answer to each box in the table."
          : "Move each answer to the correct box."
        : undefined,
      items: isCategorySort ? createCategoryItems(question.choices) : undefined,
      points: question.points,
      prompt: question.prompt,
      requiredSelections:
        question.type === "multi_select" ? Math.max(2, correctChoiceIds.length || 2) : undefined,
      tableHeaders: isTableMatch ? { answer: "Answer", row: "Rows" } : undefined,
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
  const content = examContentByAssessmentId[assessment.id] ?? createFallbackExamContent(assessment);
  const sectionFor = (passageSet: ExamPassageSet): ExamPassageSection =>
    content.passageSections?.[passageSet.passage.id] ??
    content.passageSections?.[passageSet.id] ??
    "reading";
  const readingPassageSets = content.passageSets.filter(
    (passageSet) => sectionFor(passageSet) === "reading",
  );
  const order = new Map(
    (assessment.passageOrder ?? []).map((passageId, index) => [passageId, index]),
  );
  const orderedReadingPassageSets = assessment.passageOrder?.length
    ? [...readingPassageSets].sort((left, right) => {
        const leftIndex = order.get(left.passage.id) ?? order.get(left.id) ?? Number.MAX_SAFE_INTEGER;
        const rightIndex = order.get(right.passage.id) ?? order.get(right.id) ?? Number.MAX_SAFE_INTEGER;
        return leftIndex - rightIndex;
      })
    : readingPassageSets;
  const fixedSection = (
    section: "revising_editing_a",
    title: string,
    breadcrumbLabel: string,
    body: string,
  ) =>
    content.passageSets
      .filter((passageSet) => sectionFor(passageSet) === section)
      .map((passageSet, index) => ({
        ...passageSet,
        directions: {
          body,
          breadcrumbLabel,
          subject: "English Language Arts",
          title,
        },
        label: "ELA - Revising/Editing Part A",
        section,
        showDirectionsBefore: index === 0,
      }));
  const revisingEditingPartA = fixedSection(
    "revising_editing_a",
    "REVISING/EDITING PART A",
    "ELA REV/EDIT A DIRECTIONS",
    "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  );
  return {
    ...content,
    passageSets: [
      ...orderedReadingPassageSets,
      ...revisingEditingPartA,
    ],
  };
}

export type { ExamChoice, ExamContent, ExamPassage, ExamPassageLine, ExamPassageSet, ExamQuestion } from "./types";
