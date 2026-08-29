import { createProsePassage } from "../../exams/formatters";
import type { ExamQuestion } from "../../exams/types";
import type { AdvancedPracticePassage } from "../types";

const passageText = `
When construction crews began digging New York's early subway tunnels, they encountered a crowded underground landscape. Water pipes, gas lines, building foundations, and old streams occupied the space below the pavement. Engineers could not simply draw a straight route from one station to the next.

Surveyors created detailed maps showing both the planned tunnels and the obstacles around them. Some records were remarkably precise, while others relied on notes made decades earlier. When a map proved incomplete, crews dug narrow test shafts to learn what lay below before opening a larger section of street.

These maps were working documents rather than finished works of art. Engineers crossed out routes, added measurements, and attached sheets of tracing paper as plans changed. The marks reveal how often construction depended on revision. A tunnel's final path was not always the first path imagined by its designers.

Today, historians study the maps for a different reason. Beyond explaining where tunnels were built, the documents preserve evidence of neighborhoods transformed by construction. They show vanished buildings, redirected waterways, and street names that no longer appear above ground.
`;

const questions: ExamQuestion[] = [
  {
    id: "city-maps-1",
    topic: "Central Idea & Theme",
    type: "multiple_choice",
    prompt: "Which statement best expresses the central idea of the passage?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "Early subway engineers preferred maps that looked like works of art." },
      { id: "B", text: "Most early subway routes were built in perfectly straight lines." },
      { id: "C", text: "Subway maps helped engineers adapt construction plans and now preserve evidence of a changing city." },
      { id: "D", text: "Historians study subway maps mainly to restore old street names." },
    ],
  },
  {
    id: "city-maps-2",
    topic: "Evidence & Support",
    type: "multiple_choice",
    prompt: "Which detail best supports the idea that underground construction required flexibility?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "Some records contained notes made decades earlier." },
      { id: "B", text: "Engineers crossed out routes and added measurements as plans changed." },
      { id: "C", text: "Historians continue to study the maps today." },
      { id: "D", text: "Street names appeared on the maps." },
    ],
  },
  {
    id: "city-maps-3",
    topic: "Vocabulary in Context",
    type: "multiple_choice",
    prompt: "What does the phrase *working documents* in paragraph 3 suggest about the maps?",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "They were revised and used throughout construction." },
      { id: "B", text: "They were displayed only after the tunnels were complete." },
      { id: "C", text: "They were created mainly for museum visitors." },
      { id: "D", text: "They contained no measurements or written notes." },
    ],
  },
  {
    id: "city-maps-4",
    topic: "Text Structure & Purpose",
    type: "multiple_choice",
    prompt: "How is paragraph 2 mainly organized?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      { id: "A", text: "As a comparison between two subway systems" },
      { id: "B", text: "As a chronological history of every subway station" },
      { id: "C", text: "As an argument against using older records" },
      { id: "D", text: "As a description of a problem and the method crews used to reduce uncertainty" },
    ],
  },
  {
    id: "city-maps-5",
    topic: "Inference",
    type: "multiple_choice",
    prompt: "Why did crews dig narrow test shafts before opening a larger section of street?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "To create entrances for future subway stations" },
      { id: "B", text: "To remove every old pipe below the pavement" },
      { id: "C", text: "To identify hidden obstacles before committing to more disruptive construction" },
      { id: "D", text: "To prove that the original maps were always inaccurate" },
    ],
  },
  {
    id: "city-maps-6",
    topic: "Author's Point of View",
    type: "multiple_choice",
    prompt: "How does the author's focus shift in the final paragraph?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "From praising engineers to criticizing historians" },
      { id: "B", text: "From the maps' practical use during construction to their value as historical evidence" },
      { id: "C", text: "From subway tunnels to modern gas lines" },
      { id: "D", text: "From precise records to records that contain no useful information" },
    ],
  },
  {
    id: "city-maps-7",
    topic: "Text Structure & Purpose",
    type: "multiple_choice",
    prompt: "Which statement best describes the purpose of the passage?",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "To explain how subway maps served both engineering and historical purposes" },
      { id: "B", text: "To persuade readers that subways should no longer be expanded" },
      { id: "C", text: "To provide directions for drawing an underground map" },
      { id: "D", text: "To compare New York's subway with systems in other cities" },
    ],
  },
];

export const mapsBeneathTheCity: AdvancedPracticePassage = {
  id: "maps-beneath-the-city",
  genre: "History",
  excerpt:
    "Before subway maps became familiar, engineers had to chart a second city beneath the streets people already knew.",
  thumbnailAlt: "Historic engineering maps spread across a drafting table",
  tone: "gold",
  passageSet: {
    id: "advanced-maps-beneath-the-city",
    questionCount: questions.length,
    directions: {
      subject: "English Language Arts",
      title: "READING COMPREHENSION",
      breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
      body: "Read the text and answer the related questions. Base your answers only on the content within the text.",
    },
    passage: createProsePassage({
      id: "maps-beneath-the-city",
      title: "Maps Beneath the City",
      author: "Nathan Tutors Editorial",
      sourceNote: '"Maps Beneath the City" by Nathan Tutors Editorial',
      text: passageText,
    }),
    questions,
  },
};
