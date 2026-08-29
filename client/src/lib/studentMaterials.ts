import { advancedPracticePassages } from "../content/advancedPractice";
import { examPassageLibrary } from "../content/exams/passageLibrary";
import { formA2025_2026Content } from "../content/exams/tests/formA2025_2026";
import { practiceTopics } from "../content/practice";

export type MaterialSubject = "English" | "Math";

export type ReadingCollection = "Advanced Reading" | "SHSAT";
export type ReadingFormat = "Informational" | "Literary" | "Long reading" | "Poem";

export type StudentMaterial = {
  author?: string;
  category: string;
  coverAlt?: string;
  coverImage?: string;
  description: string;
  href: string;
  id: string;
  kind: "Assessment" | "Long reading" | "Passage practice" | "Practice set" | "Study guide";
  libraryCollection?: ReadingCollection;
  questionCount: number;
  questionType: string;
  readingFormat?: ReadingFormat;
  subject: MaterialSubject;
  title: string;
  tone?: "blue" | "coral" | "emerald" | "gold";
};

const readingPracticeMaterials: StudentMaterial[] = practiceTopics.map((topic) => ({
  category: "Reading comprehension",
  description: topic.description,
  href: `/study-hall/shsat/topics/${topic.slug}`,
  id: `practice-${topic.slug}`,
  kind: "Practice set",
  questionCount: topic.questionBank.length,
  questionType: topic.title,
  subject: "English",
  title: topic.title,
}));

const advancedPassageMaterials: StudentMaterial[] = advancedPracticePassages.map((passage) => ({
  author: getPassageAuthor(passage.passageSet.passage.lines) || "Nathan Tutors Editorial",
  category: "Reading comprehension",
  coverAlt: passage.thumbnail
    ? passage.thumbnailAlt
    : passage.passageSet.passage.coverImage?.alt ?? getPassageCover(passage.passageSet.passage.lines)?.alt ?? passage.thumbnailAlt,
  coverImage: passage.thumbnail ?? passage.passageSet.passage.coverImage?.src ?? getPassageCover(passage.passageSet.passage.lines)?.src,
  description: passage.excerpt,
  href: `/advanced-practice/${passage.id}`,
  id: `passage-${passage.id}`,
  kind: "Passage practice",
  libraryCollection: "Advanced Reading",
  questionCount: passage.passageSet.questionCount,
  questionType: passage.genre,
  readingFormat: passage.genre === "Fiction" ? "Literary" : "Informational",
  subject: "English",
  title: passage.passageSet.passage.title,
  tone: passage.tone,
}));

const shsatPassageFormats: Record<string, ReadingFormat> = {
  "a-miracle-mile": "Informational",
  "dothemnoharm": "Literary",
  "form-a-raven-plans": "Informational",
  "indoor-plants": "Informational",
  "massachusetts": "Informational",
  "scribe-like-an-egyptian": "Informational",
  "snowy-mountains": "Poem",
  "spirit-of-the-herd": "Literary",
  "winter-wheat": "Literary",
};

const coverTones = ["gold", "blue", "coral", "emerald"] as const;

const readingFormatLabels: Record<NonNullable<(typeof examPassageLibrary)[number]["passage"]["passageType"]>, ReadingFormat> = {
  informational: "Informational",
  literary: "Literary",
  long_reading: "Long reading",
  poem: "Poem",
};

const shsatPassageMaterials: StudentMaterial[] = examPassageLibrary
  .map((passageSet, index) => {
    const coverImage = passageSet.passage.coverImage ?? getPassageCover(passageSet.passage.lines);
    const readingFormat = passageSet.passage.passageType
      ? readingFormatLabels[passageSet.passage.passageType]
      : shsatPassageFormats[passageSet.passage.id] ?? "Informational";
    return {
      author: getPassageAuthor(passageSet.passage.lines) || "SHSAT Library",
      category: "Reading comprehension",
      coverAlt: coverImage?.alt,
      coverImage: coverImage?.src,
      description: getPassageDescription(passageSet.passage.lines),
      href: `/study-hall/shsat/library/${passageSet.passage.id}`,
      id: `shsat-passage-${passageSet.passage.id}`,
      kind: readingFormat === "Long reading" ? "Long reading" : "Passage practice",
      libraryCollection: "SHSAT",
      questionCount: passageSet.questionCount,
      questionType: readingFormat,
      readingFormat,
      subject: "English" as const,
      title: passageSet.passage.title,
      tone: coverTones[index % coverTones.length],
    };
  });

function getPassageAuthor(lines: { kind?: string; text: string }[]) {
  return lines.find((line) => line.kind === "byline")?.text.replace(/^by\s+/i, "").trim() ?? "";
}

function getPassageCover(lines: { image?: { alt: string; src: string } }[]) {
  return lines.find((line) => line.image)?.image;
}

function getPassageDescription(lines: { kind?: string; text: string }[]) {
  const description = lines
    .filter((line) => !line.kind && line.text.trim())
    .map((line) => line.text.trim())
    .join(" ");
  return description.length > 180 ? `${description.slice(0, 177).trimEnd()}…` : description;
}

// Add teacher-uploaded books here as they become available. They automatically
// appear on the dedicated Long reading shelf and use coverImage when supplied.
export const longReadingMaterials: StudentMaterial[] = [];

export const englishLibraryMaterials: StudentMaterial[] = [
  ...shsatPassageMaterials,
  ...advancedPassageMaterials,
  ...longReadingMaterials,
];

export function getLibraryBookId(material: StudentMaterial) {
  return material.href.split("/").filter(Boolean).at(-1) ?? material.id;
}

export function getEnglishLibraryMaterial(bookId: string) {
  return englishLibraryMaterials.find((material) => getLibraryBookId(material) === bookId);
}

const revisingEditingMaterial: StudentMaterial = {
  category: "Revising & editing",
  description: "Practice grammar, sentence construction, usage, and organization in the assigned SHSAT form.",
  href: "/study-hall/shsat/assessments",
  id: "form-a-revising-editing",
  kind: "Assessment",
  questionCount:
    (formA2025_2026Content.standaloneSection?.questionCount ?? 0) +
    formA2025_2026Content.passageSets
      .filter((passageSet) => passageSet.section === "revising_editing_a")
      .reduce((total, passageSet) => total + passageSet.questionCount, 0),
  questionType: "Grammar, usage, and organization",
  subject: "English",
  title: "Form A Revising & Editing",
};

const mathTopicCounts = new Map<string, number>();
formA2025_2026Content.mathSection?.questions.forEach((question) => {
  mathTopicCounts.set(question.topic, (mathTopicCounts.get(question.topic) ?? 0) + 1);
});

const mathMaterials: StudentMaterial[] = [...mathTopicCounts.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([topic, count]) => ({
    category: getMathCategory(topic),
    description: `Practice ${topic.toLowerCase()} questions from the assigned SHSAT form.`,
    href: "/study-hall/shsat/assessments",
    id: `math-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    kind: "Assessment",
    questionCount: count,
    questionType: topic,
    subject: "Math",
    title: topic,
  }));

function getMathCategory(topic: string) {
  const normalized = topic.toLowerCase();
  if (normalized.includes("geometry") || normalized.includes("area") || normalized.includes("volume")) return "Geometry";
  if (normalized.includes("stat") || normalized.includes("probability") || normalized.includes("data")) return "Data analysis";
  if (normalized.includes("ratio") || normalized.includes("rate") || normalized.includes("percent") || normalized.includes("arithmetic")) return "Number & operations";
  return "Algebra";
}

export const studentMaterials: StudentMaterial[] = [
  ...readingPracticeMaterials,
  ...shsatPassageMaterials,
  ...advancedPassageMaterials,
  ...longReadingMaterials,
  revisingEditingMaterial,
  ...mathMaterials,
];

export function getMaterialCategories(subject: MaterialSubject) {
  return [...new Set(studentMaterials.filter((material) => material.subject === subject).map((material) => material.category))];
}
