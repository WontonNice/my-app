import { listTeacherAssessments } from "../config/assessments";
import type { CrystalCatalog, CrystalSource } from "../shared/crystalDefense";
import type { ExamQuestion } from "../shared/examTypes";
import type { GameQuestion } from "../shared/gameRooms";
import { bankPassage, canonicalElaTopic } from "../shared/questionBank";
import { getExamContent } from "./examContent";
import { playtestAnswer } from "./gameAnswerKey";
import { readQuestionBank } from "./questionBank";
import { generatePracticeQuestion, moduleGeneratorIds, practiceGenerators, practiceModules } from "../shared/infinitePractice";

const sourceError = (message: string) => Object.assign(new Error(message), { status: 400 });
const label = (value: string | undefined) => value?.trim() || "Unclassified";

/** A monster must have a usable, server-gradable answer before it can spawn. */
function gradable(question: ExamQuestion) {
  if (question.type === "essay") return false;
  try { playtestAnswer(question, true); } catch { return false; }
  const hasChoice = (id: string | undefined) => Boolean(id && question.choices?.some(choice => choice.id === id));
  if (question.type === "multiple_choice" || question.type === "transition_drop" && !question.dragDropSlots?.length) return hasChoice(question.correctChoiceId);
  if (question.type === "multi_select") return question.correctChoiceIds!.every(hasChoice);
  if (question.type === "graph_point_select") return question.correctPointIds!.every(id => question.graph?.points.some(point => point.id === id));
  if (question.type === "inline_dropdown") return question.dropdowns!.every(menu => menu.options.some(option => option.id === menu.correctChoiceId));
  if (question.type === "math_drag_drop" || question.type === "transition_drop") {
    const items = question.type === "transition_drop" ? question.choices : question.items;
    return question.dragDropSlots!.every(slot => items?.some(item => item.id === slot.correctItemId));
  }
  if (["category_sort", "matrix_choice", "table_match"].includes(question.type)) {
    return Object.entries(question.correctPlacements!).every(([id, category]) => question.items?.some(item => item.id === id) && question.categories?.some(item => item.id === category));
  }
  return true;
}

function uniqueQuestions(questions: GameQuestion[]) {
  return [...new Map(questions.map(item => [item.question.id, item])).values()];
}

function examSources() {
  return listTeacherAssessments().flatMap(assessment => {
    const questions = uniqueQuestions((getExamContent(assessment.id)?.mathSection?.questions ?? [])
      .filter(gradable).map(question => ({ question, subject: "Math" })));
    return questions.length ? [{ id: assessment.id, title: assessment.title, questions }] : [];
  });
}

function readingQuestions(): GameQuestion[] {
  return uniqueQuestions(readQuestionBank().questions
    .filter(question => question.subject === "English" && question.status === "published" && /shsat\s*lab/i.test(question.source))
    .map(question => ({
      question: {
        id: question.id, type: "multiple_choice" as const, topic: canonicalElaTopic(question.topic), prompt: question.prompt,
        choices: question.choices, correctChoiceId: question.correctChoiceId, explanation: question.explanation,
        ...(question.visualImage ? { image: question.visualImage } : {}),
      },
      subject: "English", ...(question.passage ? { passage: bankPassage(question) } : {}),
    })).filter(item => gradable(item.question)));
}

function topicCounts(questions: GameQuestion[]): CrystalCatalog["assessments"][number]["topics"] {
  const groups = new Map<string, { count: number; subtopics: Map<string, number> }>();
  for (const { question } of questions) {
    const topic = label(question.topic), subtopic = label(question.subtopic);
    const group = groups.get(topic) ?? { count: 0, subtopics: new Map<string, number>() };
    group.count++; group.subtopics.set(subtopic, (group.subtopics.get(subtopic) ?? 0) + 1); groups.set(topic, group);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([topic, group]) => ({
    topic, count: group.count,
    subtopics: [...group.subtopics].sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => ({ name, count })),
  }));
}

/** Counts and filters only: the catalog never includes question text or answer keys. */
export function crystalCatalog(): CrystalCatalog {
  const sources = examSources();
  const all = uniqueQuestions(sources.flatMap(source => source.questions));
  return {
    assessments: [{ id: "all", title: "All exams", questions: all }, ...sources]
      .map(source => ({ id: source.id, title: source.title, mathCount: source.questions.length, topics: topicCounts(source.questions) })),
    readingTopics: topicCounts(readingQuestions()).map(({ topic, count }) => ({ topic, count })),
    infiniteAvailable: practiceGenerators.length > 0,
    infiniteModules: practiceModules.map(module => ({ id: module.id, title: module.title, description: module.description,
      topics: topicCounts(moduleGeneratorIds(module).map(id => ({ subject: "Math", question: generatePracticeQuestion([id], 0, "crystal-catalog") }))),
    })).filter(module => module.topics.length > 0),
  };
}

function filterValue(value: unknown, name: string) {
  if (value === undefined || value === "") return undefined;
  if (typeof value !== "string" || !value.trim() || value.length > 160) throw sourceError(`Choose a valid ${name}.`);
  return value.trim();
}

export function crystalPracticeGeneratorIds(source: CrystalSource) {
  const moduleId = filterValue(source.moduleId, "practice module") ?? "all";
  const module = practiceModules.find(item => item.id === moduleId);
  if (!module) throw sourceError("Choose an available infinite practice module.");
  if (source.assessmentId) throw sourceError("Infinite practice uses practice modules, not exams.");
  const topic = filterValue(source.topic, "category"), subtopic = filterValue(source.subtopic, "subcategory");
  const ids = moduleGeneratorIds(module).filter(id => {
    const sample = generatePracticeQuestion([id], 0, "crystal-catalog");
    return (!topic || label(sample.topic) === topic) && (!subtopic || label(sample.subtopic) === subtopic) && gradable(sample);
  });
  if (!ids.length) throw sourceError("No practice generators match these filters. Choose another category or module.");
  return ids;
}

export function generateCrystalPractice(source: CrystalSource, index: number, seed: string): GameQuestion {
  return { subject: "Math", question: generatePracticeQuestion(crystalPracticeGeneratorIds(source), index, seed) };
}

/** Answer keys stay on the server. Infinite sources start with a validation sample;
 * each actual encounter gets a generated question from its durable sequence. */
export function loadCrystalQuestions(source: CrystalSource): { questions: GameQuestion[]; sourceTitle: string } {
  if (!source || typeof source !== "object" || Array.isArray(source)) throw sourceError("Choose a question source for Crystal Defense.");
  if (source.kind === "infinite-math") {
    const sample = generateCrystalPractice(source, 0, "crystal-preview");
    const module = practiceModules.find(item => item.id === (source.moduleId?.trim() || "all"))!;
    return { questions: [sample], sourceTitle: ["Infinite math", module.title, source.topic, source.subtopic].filter(Boolean).join(" · ") };
  }
  if (source.kind !== "exam-math" && source.kind !== "lab-reading") throw sourceError("Choose exam math or SHSAT Lab reading questions.");
  const topic = filterValue(source.topic, "topic"), subtopic = filterValue(source.subtopic, "subcategory");
  const assessmentId = filterValue(source.assessmentId, "exam");
  let pool: GameQuestion[], sourceTitle: string;
  if (source.kind === "exam-math") {
    const sources = examSources();
    const selected = assessmentId && assessmentId !== "all" ? sources.find(item => item.id === assessmentId) : undefined;
    if (assessmentId && assessmentId !== "all" && !selected) throw sourceError("Choose an available exam with math questions.");
    pool = selected?.questions ?? uniqueQuestions(sources.flatMap(item => item.questions));
    sourceTitle = `${selected?.title ?? "All exams"} · Math`;
  } else {
    if (assessmentId || subtopic) throw sourceError("SHSAT Lab reading uses reading topics, not exam or math subcategory filters.");
    pool = readingQuestions(); sourceTitle = "SHSAT Lab · Reading";
  }
  if (topic) pool = pool.filter(item => label(item.question.topic) === (source.kind === "lab-reading" ? canonicalElaTopic(topic) : topic));
  if (subtopic) pool = pool.filter(item => label(item.question.subtopic) === subtopic);
  if (!pool.length) throw sourceError("No published, automatically graded questions match these filters. Choose another topic or exam.");
  return { questions: structuredClone(pool), sourceTitle: [sourceTitle, topic, subtopic].filter(Boolean).join(" · ") };
}
