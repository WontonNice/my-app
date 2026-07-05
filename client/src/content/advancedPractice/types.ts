import type { ExamPassageSet } from "../exams/types";

export type AdvancedPassageGenre = "Fiction" | "History" | "Science" | "Social Science";

export type AdvancedPracticePassage = {
  excerpt: string;
  genre: AdvancedPassageGenre;
  id: string;
  passageSet: ExamPassageSet;
  thumbnail?: string;
  thumbnailAlt: string;
  tone: "blue" | "coral" | "emerald" | "gold";
};
