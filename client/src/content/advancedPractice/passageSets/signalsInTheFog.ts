import { createProsePassage } from "../../exams/formatters";
import type { ExamQuestion } from "../../exams/types";
import type { AdvancedPracticePassage } from "../types";

const passageText = `
At the entrance to one of the world's busiest harbors, a narrow tower flashes a white light into the fog. The light is useful, but it is no longer the harbor's only warning system. Small weather stations now measure wind, moisture, and temperature every few seconds, sending their readings to ships before the shoreline becomes visible.

Fog forms when water vapor cools into tiny droplets suspended near the ground. Because the change can happen quickly, a clear channel may become difficult to navigate within minutes. Older forecasts described conditions across an entire region. The newer sensors collect information from precise locations, allowing crews to compare the air near open water with the air beside cliffs and docks.

The sensors do not steer ships or replace experienced pilots. Instead, they reveal patterns that would otherwise remain hidden. A sudden temperature drop at one station, for example, can warn pilots that dense fog may soon move across the channel. That extra time gives a crew a chance to reduce speed and prepare its instruments.

Researchers are now testing whether the same network can predict other hazards, including strong crosswinds. Their goal is not to make the harbor effortless to navigate. It is to give skilled people better evidence at the moment when good judgment matters most.
`;

const questions: ExamQuestion[] = [
  {
    id: "signals-fog-1",
    topic: "Central Idea & Theme",
    type: "multiple_choice",
    prompt: "Which statement best expresses the central idea of the passage?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "Traditional harbor lights are no longer useful to modern ships." },
      { id: "B", text: "Local sensor networks give skilled crews earlier and more precise warnings about changing hazards." },
      { id: "C", text: "Fog is the most dangerous condition that ships encounter near a harbor." },
      { id: "D", text: "Automated systems will soon replace pilots in crowded harbors." },
    ],
  },
  {
    id: "signals-fog-2",
    topic: "Supporting Evidence",
    type: "multiple_choice",
    prompt: "Which detail best supports the idea that the sensors provide information older forecasts could not?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "A tower flashes a white light into the fog." },
      { id: "B", text: "Fog consists of tiny droplets near the ground." },
      { id: "C", text: "The sensors compare conditions at exact locations around the harbor." },
      { id: "D", text: "Researchers are studying strong crosswinds." },
    ],
  },
  {
    id: "signals-fog-3",
    topic: "Vocabulary in Context",
    type: "multiple_choice",
    prompt: "As used in paragraph 2, the word *precise* most nearly means",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "exact." },
      { id: "B", text: "distant." },
      { id: "C", text: "dangerous." },
      { id: "D", text: "temporary." },
    ],
  },
  {
    id: "signals-fog-4",
    topic: "Text Structure & Purpose",
    type: "multiple_choice",
    prompt: "Why does the author explain how fog forms in paragraph 2?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      { id: "A", text: "To argue that fog should be studied only by weather scientists" },
      { id: "B", text: "To compare fog with strong crosswinds" },
      { id: "C", text: "To describe why harbor towers use white lights" },
      { id: "D", text: "To show why crews need information that can update quickly" },
    ],
  },
  {
    id: "signals-fog-5",
    topic: "Inference",
    type: "multiple_choice",
    prompt: "What can be inferred about the author's view of experienced harbor pilots?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "Their judgment is less reliable than an automated system." },
      { id: "B", text: "Their judgment remains important even when technology supplies better evidence." },
      { id: "C", text: "They should avoid harbors whenever fog is predicted." },
      { id: "D", text: "They are responsible for maintaining weather stations." },
    ],
  },
  {
    id: "signals-fog-6",
    topic: "Author's Point of View",
    type: "multiple_choice",
    prompt: "Which statement would the author most likely agree with?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "Technology is valuable only when it removes the need for human decisions." },
      { id: "B", text: "Regional forecasts contain more useful information than local measurements." },
      { id: "C", text: "Technology is most useful when it helps people make informed decisions." },
      { id: "D", text: "Harbor navigation should become effortless before sensors are considered successful." },
    ],
  },
  {
    id: "signals-fog-7",
    topic: "Central Idea & Theme",
    type: "multiple_choice",
    prompt: "How does the title *Signals in the Fog* contribute to the passage?",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "It refers to the different warnings that help crews understand conditions they cannot clearly see." },
      { id: "B", text: "It suggests that fog itself sends messages to researchers." },
      { id: "C", text: "It emphasizes that ships communicate only by flashing lights." },
      { id: "D", text: "It shows that the passage is mainly about repairing harbor towers." },
    ],
  },
];

export const signalsInTheFog: AdvancedPracticePassage = {
  id: "signals-in-the-fog",
  genre: "Science",
  excerpt:
    "Along crowded coastlines, a new generation of sensors is helping ships read weather that human eyes cannot yet see.",
  thumbnailAlt: "A harbor signal light standing above a foggy coastline",
  tone: "blue",
  passageSet: {
    id: "advanced-signals-in-the-fog",
    questionCount: questions.length,
    directions: {
      subject: "English Language Arts",
      title: "READING COMPREHENSION",
      breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
      body: "Read the text and answer the related questions. Base your answers only on the content within the text.",
    },
    passage: createProsePassage({
      id: "signals-in-the-fog",
      title: "Signals in the Fog",
      author: "Nathan Tutors Editorial",
      sourceNote: '"Signals in the Fog" by Nathan Tutors Editorial',
      text: passageText,
    }),
    questions,
  },
};
