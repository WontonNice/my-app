import { createPlainTextPassage } from "./formatters";
import { digitalShsatPracticeTest6Content } from "./tests/digital-shsat-practice-test-6";
import { digitalShsatPracticeTest5Content } from "./tests/digital-shsat-practice-test-5";
import { digitalShsatPracticeTest4Content } from "./tests/digital-shsat-practice-test-4";
import { digitalShsatPracticeTest3Content } from "./tests/digital-shsat-practice-test-3";
import { content20262027FormDContent } from "./tests/2026-2027-form-d";
import { content20262027FormCContent } from "./tests/2026-2027-form-c";
import { content20262027FormBContent } from "./tests/2026-2027-form-b";
import { content20262027FormAContent } from "./tests/2026-2027-form-a";
import { content20242025FormBContent } from "./tests/2024-2025-form-b";
import { content20242025FormAContent } from "./tests/2024-2025-form-a";
import { content20192020FormBContent } from "./tests/2019-2020-form-b";
import { content20192020FormAContent } from "./tests/2019-2020-form-a";
import { content20182019FormBContent } from "./tests/2018-2019-form-b";
import { content20182019FormAContent } from "./tests/2018-2019-form-a";
import { content20172018FormBContent } from "./tests/2017-2018-form-b";
import { content20172018FormAContent } from "./tests/2017-2018-form-a";
import { content20232024FormBContent } from "./tests/2023-2024-form-b";
import { content20232024FormAContent } from "./tests/2023-2024-form-a";
import { content20212022FormBContent } from "./tests/2021-2022-form-b";
import { content20222023FormBContent } from "./tests/2022-2023-form-b";
import { content20222023FormAContent } from "./tests/2022-2023-form-a";
import { digitalShsatPracticeTest2Content } from "./tests/digital-shsat-practice-test-2";
import { digitalShsatPracticeTest1Content } from "./tests/digital-shsat-practice-test-1";
import { content20212022FormAContent } from "./tests/2021-2022-form-a";
import { content20202021FormAContent } from "./tests/2020-2021-form-a";
import { content20202021FormBContent } from "./tests/2020-2021-form-b";
import { content20252026FormBContent } from "./tests/2025-2026-form-b";
import { formA2025_2026Content } from "./tests/formA2025_2026";
import type {
  AssessmentContentSource,
  ExamChoice,
  ExamContent,
  ExamPassageSection,
  ExamPassageSet,
  ExamQuestion,
} from "./types";

const examContentByAssessmentId: Record<string, ExamContent> = {
  [digitalShsatPracticeTest6Content.assessmentId]: digitalShsatPracticeTest6Content,
  [digitalShsatPracticeTest5Content.assessmentId]: digitalShsatPracticeTest5Content,
  [digitalShsatPracticeTest4Content.assessmentId]: digitalShsatPracticeTest4Content,
  [digitalShsatPracticeTest3Content.assessmentId]: digitalShsatPracticeTest3Content,
  [content20262027FormDContent.assessmentId]: content20262027FormDContent,
  [content20262027FormCContent.assessmentId]: content20262027FormCContent,
  [content20262027FormBContent.assessmentId]: content20262027FormBContent,
  [content20262027FormAContent.assessmentId]: content20262027FormAContent,
  [content20242025FormBContent.assessmentId]: content20242025FormBContent,
  [content20242025FormAContent.assessmentId]: content20242025FormAContent,
  [content20192020FormBContent.assessmentId]: content20192020FormBContent,
  [content20192020FormAContent.assessmentId]: content20192020FormAContent,
  [content20182019FormBContent.assessmentId]: content20182019FormBContent,
  [content20182019FormAContent.assessmentId]: content20182019FormAContent,
  [content20172018FormBContent.assessmentId]: content20172018FormBContent,
  [content20172018FormAContent.assessmentId]: content20172018FormAContent,
  [content20232024FormBContent.assessmentId]: content20232024FormBContent,
  [content20232024FormAContent.assessmentId]: content20232024FormAContent,
  [content20212022FormBContent.assessmentId]: content20212022FormBContent,
  [content20222023FormBContent.assessmentId]: content20222023FormBContent,
  [content20222023FormAContent.assessmentId]: content20222023FormAContent,
  [digitalShsatPracticeTest2Content.assessmentId]: digitalShsatPracticeTest2Content,
  [digitalShsatPracticeTest1Content.assessmentId]: digitalShsatPracticeTest1Content,
  [content20212022FormAContent.assessmentId]: content20212022FormAContent,
  [content20202021FormAContent.assessmentId]: content20202021FormAContent,
  [content20202021FormBContent.assessmentId]: content20202021FormBContent,
  [content20252026FormBContent.assessmentId]: content20252026FormBContent,
  [formA2025_2026Content.assessmentId]: formA2025_2026Content,
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
  return ![
    "short_response",
    "numeric_entry",
    "expression_entry",
    "grid_in",
    "essay",
    "category_sort",
    "matrix_choice",
    "table_match",
    "inline_dropdown",
    "math_drag_drop",
    "graph_point_select",
    "number_line_response",
  ].includes(question.type);
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
    const isCategorySort = question.type === "category_sort" || question.type === "matrix_choice" || question.type === "table_match";
    const isTableMatch = question.type === "table_match";
    const isMatrixChoice = question.type === "matrix_choice";
    const isTextEntry = ["short_response", "numeric_entry", "expression_entry", "grid_in"].includes(question.type);

    return {
      categories: isCategorySort
        ? [
            { id: "category-1", title: "Category 1" },
            { id: "category-2", title: "Category 2" },
          ]
        : undefined,
      choices: isChoiceBasedQuestion(question) ? createChoices(question.choices) : undefined,
      correctChoiceId: ["multiple_choice", "transition_drop"].includes(question.type) ? question.answer.trim() : undefined,
      correctChoiceIds: correctChoiceIds.length > 0 ? correctChoiceIds : undefined,
      correctTextAnswers: isTextEntry && question.answer ? [question.answer] : undefined,
      categoryCapacity: isTableMatch ? 1 : undefined,
      id: question.id || `question-${index + 1}`,
      instructions: isCategorySort
        ? isMatrixChoice
          ? "Select one answer in each row."
          : isTableMatch
          ? "Move the correct answer to each box in the table."
          : "Move each answer to the correct box."
        : undefined,
      items: isCategorySort ? createCategoryItems(question.choices) : undefined,
      points: question.points,
      prompt: question.prompt,
      requiredSelections:
        question.type === "multi_select" ? Math.max(2, correctChoiceIds.length || 2) : undefined,
      tableHeaders: isTableMatch || isMatrixChoice ? { answer: "Answer", row: isMatrixChoice ? "Sentence" : "Rows" } : undefined,
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
          passageCategory: firstPassage?.passageCategory,
          versionLabel: firstPassage?.versionLabel,
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
    passageSet.section ??
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

export type {
  ExamChoice,
  ExamContent,
  ExamNumberLine,
  ExamPassage,
  ExamPassageLine,
  ExamPassageSet,
  ExamQuestion,
} from "./types";
