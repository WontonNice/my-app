import type { ExamContent, ExamQuestion } from "../content/exams";

export type CategoryPlacements = Record<string, string>;
export type SelectedAnswer = string | string[] | CategoryPlacements;
export type SelectedAnswers = Record<string, SelectedAnswer>;

export type ExamTopicResult = {
  correct: number;
  topic: string;
  total: number;
};

export type ExamSubjectResult = {
  correct: number;
  subject: "English Language Arts" | "Mathematics";
  topics: ExamTopicResult[];
  total: number;
};

export type ExamPassageResult = {
  correct: number;
  id: string;
  label: string;
  title: string;
  total: number;
};

export type ExamResult = {
  assessmentId: string;
  completedAt: string;
  correct: number;
  passages: ExamPassageResult[];
  percentage: number;
  subjects: ExamSubjectResult[];
  title: string;
  topics: ExamTopicResult[];
  total: number;
};

const storagePrefix = "nathan-tutors:exam-results:v1";

export function getAllExamQuestions(examContent: ExamContent) {
  return [
    ...examContent.passageSets.flatMap((passageSet) => passageSet.questions),
    ...(examContent.standaloneSection?.questions ?? []),
    ...(examContent.mathSection?.questions ?? []),
  ];
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function getCategoryPlacements(answer: SelectedAnswer | undefined): CategoryPlacements {
  if (!answer || typeof answer === "string" || Array.isArray(answer)) {
    return {};
  }

  return answer;
}

function hasExactIds(actualIds: string[], expectedIds: string[]) {
  return (
    actualIds.length === expectedIds.length &&
    expectedIds.every((expectedId) => actualIds.includes(expectedId))
  );
}

export function isExamQuestionCorrect(question: ExamQuestion, answer: SelectedAnswer | undefined) {
  if (question.type === "multiple_choice" || question.type === "transition_drop") {
    return typeof answer === "string" && answer === question.correctChoiceId;
  }

  if (question.type === "multi_select") {
    return Array.isArray(answer) && hasExactIds(answer, question.correctChoiceIds ?? []);
  }

  if (question.type === "category_sort") {
    const placements = getCategoryPlacements(answer);
    const correctPlacements = question.correctPlacements ?? {};
    const requiredItemIds = Object.keys(correctPlacements);
    const requiredPlacements = question.requiredPlacements ?? requiredItemIds.length;

    return (
      requiredItemIds.length > 0 &&
      Object.keys(placements).length === requiredPlacements &&
      requiredItemIds.every((itemId) => placements[itemId] === correctPlacements[itemId])
    );
  }

  if (question.type === "inline_dropdown") {
    const dropdownAnswers = getCategoryPlacements(answer);
    const dropdowns = question.dropdowns ?? [];

    return (
      dropdowns.length > 0 &&
      dropdowns.every(
        (dropdown) =>
          Boolean(dropdown.correctChoiceId) && dropdownAnswers[dropdown.id] === dropdown.correctChoiceId,
      )
    );
  }

  if (["numeric_entry", "short_response", "grid_in"].includes(question.type)) {
    const acceptedAnswers = question.correctTextAnswers ?? [];

    return (
      typeof answer === "string" &&
      acceptedAnswers.some((acceptedAnswer) => normalizeText(answer) === normalizeText(acceptedAnswer))
    );
  }

  return false;
}

function scoreQuestions(questions: ExamQuestion[], answers: SelectedAnswers) {
  const topics = new Map<string, ExamTopicResult>();
  let correct = 0;

  questions.forEach((question) => {
    const isCorrect = isExamQuestionCorrect(question, answers[question.id]);
    const currentTopic = topics.get(question.topic) ?? {
      correct: 0,
      topic: question.topic,
      total: 0,
    };

    currentTopic.total += 1;
    currentTopic.correct += isCorrect ? 1 : 0;
    topics.set(question.topic, currentTopic);
    correct += isCorrect ? 1 : 0;
  });

  return {
    correct,
    topics: Array.from(topics.values()).sort((left, right) => left.topic.localeCompare(right.topic)),
    total: questions.length,
  };
}

export function createExamResult(examContent: ExamContent, answers: SelectedAnswers): ExamResult {
  const questions = getAllExamQuestions(examContent);
  const englishQuestions = [
    ...examContent.passageSets.flatMap((passageSet) => passageSet.questions),
    ...(examContent.standaloneSection?.questions ?? []),
  ];
  const mathQuestions = examContent.mathSection?.questions ?? [];
  const englishScore = scoreQuestions(englishQuestions, answers);
  const mathScore = scoreQuestions(mathQuestions, answers);
  const overallScore = scoreQuestions(questions, answers);
  const subjects: ExamSubjectResult[] = [
    ...(englishScore.total > 0
      ? [{ ...englishScore, subject: "English Language Arts" as const }]
      : []),
    ...(mathScore.total > 0 ? [{ ...mathScore, subject: "Mathematics" as const }] : []),
  ];
  const passages = examContent.passageSets.map((passageSet, index) => {
    const passageScore = scoreQuestions(passageSet.questions, answers);

    return {
      correct: passageScore.correct,
      id: passageSet.id,
      label: `Passage ${index + 1}`,
      title: passageSet.passage.title,
      total: passageScore.total,
    };
  });

  return {
    assessmentId: examContent.assessmentId,
    completedAt: new Date().toISOString(),
    correct: overallScore.correct,
    passages,
    percentage:
      overallScore.total > 0 ? Math.round((overallScore.correct / overallScore.total) * 100) : 0,
    subjects,
    title: examContent.title,
    topics: overallScore.topics,
    total: overallScore.total,
  };
}

function getStorageKey(userId: string) {
  return `${storagePrefix}:${userId}`;
}

export function getExamResults(userId: string): ExamResult[] {
  try {
    const storedResults = JSON.parse(window.localStorage.getItem(getStorageKey(userId)) ?? "[]") as unknown;

    if (!Array.isArray(storedResults)) {
      return [];
    }

    return (storedResults as ExamResult[]).map((result) => ({
      ...result,
      passages: Array.isArray(result.passages) ? result.passages : [],
      subjects: Array.isArray(result.subjects) ? result.subjects : [],
    }));
  } catch {
    return [];
  }
}

export function getExamResult(userId: string, assessmentId: string) {
  return getExamResults(userId).find((result) => result.assessmentId === assessmentId) ?? null;
}

export function saveExamResult(userId: string, result: ExamResult) {
  const otherResults = getExamResults(userId).filter(
    (storedResult) => storedResult.assessmentId !== result.assessmentId,
  );

  window.localStorage.setItem(getStorageKey(userId), JSON.stringify([result, ...otherResults]));
}
