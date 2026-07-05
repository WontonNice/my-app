import { createProsePassage } from "../../exams/formatters";
import type { ExamQuestion } from "../../exams/types";
import type { AdvancedPracticePassage } from "../types";

const passageText = `
Every afternoon, Lena stopped beneath the clockmaker's window, though the clocks inside never agreed on the hour. One hurried ahead; another lingered behind. A brass watch no larger than a coin rested in the center, its hands perfectly still.

The shop had been closed since Mr. Vale left town in early spring. Dust gathered around the doorframe, yet the display changed from week to week. A silver alarm clock appeared beside the brass watch. Then a wooden metronome arrived, angled toward the street as though listening for footsteps.

Lena told herself that a relative must be tending the shop. Still, she began arriving earlier, hoping to catch the person at work. On the fourth day, she noticed a folded card beneath the motionless watch. Her name was written across it in the narrow handwriting her grandfather had taught her to recognize.

She did not enter. Instead, Lena stood on the sidewalk until the town clock struck four. At the final chime, the little brass watch shivered and began to tick. The sound was too faint to hear through the glass, but she saw the second hand move and understood that the invitation would wait until she was ready.
`;

const questions: ExamQuestion[] = [
  {
    id: "clockmaker-1",
    topic: "Tone & Mood",
    type: "multiple_choice",
    prompt: "How does the description of the clocks in paragraph 1 contribute to the mood?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "It creates a cheerful mood by showing a busy shop." },
      { id: "B", text: "It creates a mysterious mood by presenting objects that behave in unusual ways." },
      { id: "C", text: "It creates an angry mood by emphasizing Lena's impatience." },
      { id: "D", text: "It creates a peaceful mood by showing that time has stopped." },
    ],
  },
  {
    id: "clockmaker-2",
    topic: "Inference",
    type: "multiple_choice",
    prompt: "Which inference about Lena is best supported by paragraph 2?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "She believes Mr. Vale has returned to town." },
      { id: "B", text: "She plans to purchase the brass watch." },
      { id: "C", text: "She is curious about who continues to arrange the closed shop." },
      { id: "D", text: "She is responsible for cleaning the shop window." },
    ],
  },
  {
    id: "clockmaker-3",
    topic: "Supporting Evidence",
    type: "multiple_choice",
    prompt: "Which detail most strongly connects the card to Lena's family?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      { id: "A", text: "The card is folded beneath the watch." },
      { id: "B", text: "Lena arrives earlier on the fourth day." },
      { id: "C", text: "The watch is no larger than a coin." },
      { id: "D", text: "The name is written in handwriting Lena's grandfather taught her to recognize." },
    ],
  },
  {
    id: "clockmaker-4",
    topic: "Vocabulary in Context",
    type: "multiple_choice",
    prompt: "As used in the final sentence, the word *invitation* most nearly refers to",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "an opportunity for Lena to enter the shop when she feels prepared." },
      { id: "B", text: "a request for Lena to repair the town clock." },
      { id: "C", text: "an order for Lena to leave the sidewalk immediately." },
      { id: "D", text: "a promise that Mr. Vale will return that afternoon." },
    ],
  },
  {
    id: "clockmaker-5",
    topic: "Text Structure & Purpose",
    type: "multiple_choice",
    prompt: "Why does the author wait until paragraph 3 to reveal the card?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "To prove that the shop has never been closed" },
      { id: "B", text: "To build curiosity about the changing display before giving Lena a personal reason to respond" },
      { id: "C", text: "To explain how each clock in the window was made" },
      { id: "D", text: "To show that Lena has forgotten her grandfather" },
    ],
  },
  {
    id: "clockmaker-6",
    topic: "Central Idea & Theme",
    type: "multiple_choice",
    prompt: "Which theme is best developed in the story?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "People should avoid mysteries they cannot immediately solve." },
      { id: "B", text: "Time always moves at the same pace for everyone." },
      { id: "C", text: "A meaningful opportunity can wait until a person is ready to accept it." },
      { id: "D", text: "Old objects are more valuable than new ones." },
    ],
  },
  {
    id: "clockmaker-7",
    topic: "Author's Point of View",
    type: "multiple_choice",
    prompt: "What does the final paragraph suggest about Lena's decision not to enter the shop?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      { id: "A", text: "The author views it as proof that Lena is no longer curious." },
      { id: "B", text: "The author views it as a mistake that cannot be corrected." },
      { id: "C", text: "The author views it as evidence that Lena dislikes clocks." },
      { id: "D", text: "The author views it as a thoughtful choice rather than a refusal." },
    ],
  },
];

export const clockmakersWindow: AdvancedPracticePassage = {
  id: "the-clockmakers-window",
  genre: "Fiction",
  excerpt:
    "Every afternoon, Lena stopped beneath the clockmaker's window, though the clocks inside never agreed on the hour.",
  thumbnailAlt: "An old clockmaker shop window filled with antique clocks",
  tone: "coral",
  passageSet: {
    id: "advanced-clockmakers-window",
    questionCount: questions.length,
    directions: {
      subject: "English Language Arts",
      title: "READING COMPREHENSION",
      breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
      body: "Read the text and answer the related questions. Base your answers only on the content within the text.",
    },
    passage: createProsePassage({
      id: "clockmakers-window",
      title: "The Clockmaker's Window",
      author: "Mara Ellison",
      sourceNote: '"The Clockmaker\'s Window" by Mara Ellison',
      text: passageText,
    }),
    questions,
  },
};
