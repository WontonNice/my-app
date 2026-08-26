import { centralIdeaThemeQuestions } from "./questionBanks/centralIdeaTheme/index";
import { authorsPointOfViewQuestions } from "./questionBanks/authorsPointOfView/index";
import { wordPhraseMeaningQuestions } from "./questionBanks/wordPhraseMeaning/index";
import { figurativeLanguageImageryQuestions } from "./questionBanks/figurativeLanguageImagery/index";
import { toneMoodQuestions } from "./questionBanks/toneMood/index";
import { textStructureQuestions } from "./questionBanks/textStructure/index";
import { evidenceSupportQuestions } from "./questionBanks/evidenceSupport/index";
import { inferenceQuestions } from "./questionBanks/inference/index";
import type { PracticeTopic } from "./types";

export const practiceTopics: PracticeTopic[] = [
  {
    description: "Find the main idea, recurring themes, and the best summary of a passage.",
    key: "Central Idea & Theme",
    questionBank: centralIdeaThemeQuestions,
    slug: "central-idea-theme",
    title: "Central Idea & Theme",
  },
  {
    description: "Determine the author's perspective, attitude, purpose, and beliefs.",
    key: "Author's Point of View",
    questionBank: authorsPointOfViewQuestions,
    slug: "authors-point-of-view",
    title: "Author's Point of View",
  },
  {
    description: "Use context clues to interpret precise words and phrases in a passage.",
    key: "Vocabulary in Context",
    questionBank: wordPhraseMeaningQuestions,
    slug: "word-phrase-meaning",
    title: "Word & Phrase Meaning",
  },
  {
    description: "Analyze similes, metaphors, personification, and imagery for meaning.",
    key: "Figurative Language & Imagery",
    questionBank: figurativeLanguageImageryQuestions,
    slug: "figurative-language-imagery",
    title: "Figurative Language & Imagery",
  },
  {
    description: "Recognize tone and mood through word choice, syntax, and atmosphere.",
    key: "Tone & Mood",
    questionBank: toneMoodQuestions,
    slug: "tone-mood",
    title: "Tone & Mood",
  },
  {
    description: "Analyze how paragraphs and sentences build ideas and support purpose.",
    key: "Text Structure & Purpose",
    questionBank: textStructureQuestions,
    slug: "text-structure",
    title: "Text Structure",
  },
  {
    description: "Choose the quotation or detail that best supports a stated claim.",
    key: "Supporting Evidence",
    questionBank: evidenceSupportQuestions,
    slug: "evidence-support",
    title: "Evidence & Support",
  },
  {
    description: "Draw logical conclusions from implied details and character actions.",
    key: "Inference",
    questionBank: inferenceQuestions,
    slug: "inference",
    title: "Inference",
  },
];

export function getPracticeTopicBySlug(slug: string) {
  return practiceTopics.find((topic) => topic.slug === slug) ?? null;
}

export type { PracticeDifficulty, PracticeQuestion, PracticeTopic } from "./types";
