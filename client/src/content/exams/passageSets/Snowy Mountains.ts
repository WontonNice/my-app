import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const SnowyMountainsPassageText = `
Higher and still more high,
Palaces made for cloud,
Above the dingy city-roofs
Blue-white like angels with broad wings,
Pillars of the sky at rest
The mountains from the great plateau
Uprise.

But the world heeds them not;
They have been here now for too long a time.
The world makes war on them,
Tunnels their granite cliffs,
Splits down their shining sides,
Plasters their cliffs with soap-advertisements,
Destroys the lonely fragments of their peace.

Vaster and still more vast,
Peak after peak, pile after pile,
Wilderness still untamed,
To which the future is as was the past,
Barrier spread by Gods,
Sunning their shining foreheads,
Barrier broken down by those who do not need
The joy of time-resisting storm-worn stone,
The mountains swing along
The south horizon of the sky;
Welcoming with wide floors of blue-green ice
The mists that dance and drive before the sun.
`;

const SnowyMountainsQuestions: ExamQuestion[] = [
  {
    id: "snowy-mountains-1",
    topic: "Central Idea & Theme",
    type: "multiple_choice",
    prompt: "The description in the first stanza (lines 1–7) helps establish a central idea of the poem by",
    correctChoiceId: "B",
    points: 1,
    choices: [
      {
        id: "A",
        text: "comparing the length of time the mountains have existed with the length of time the city has existed.",
      },
      {
        id: "B",
        text: "contrasting the grandeur of the mountains with the structures in the city below them.",
      },
      {
        id: "C",
        text: "implying that the mountains are a source of inspiration to the people in the city below.",
      },
      {
        id: "D",
        text: "suggesting that the mountains are larger than the people in the city realize.",
      },
    ],
  },
  {
    id: "snowy-mountains-2",
    topic: "Author's Point of View",
    type: "multi_select",
    prompt: "Which detail from the poem reflects the speaker’s view that people often fail to appreciate what is familiar?",
    instructions: "Select the two correct answers.",
    correctChoiceIds: ["B", "E"],
    requiredSelections: 2,
    points: 1,
    choices: [
      { id: "A", text: "“The mountains from the great plateau” (line 6)" },
      { id: "B", text: "“They have been here now for too long a time.” (line 9)" },
      { id: "C", text: "“Splits down their shining sides,” (line 12)" },
      { id: "D", text: "“To which the future is as was the past,” (line 18)" },
    ],
  },
  {
    id: "snowy-mountains-3",
    topic: "Central Idea & Theme",
    type: "category_sort",
    prompt:
      "Which quotations from the poem support the theme that nature persists beneath the city, and which quotations support the theme that city life hides natural wonder?",
    instructions: "Move each answer to the correct box.",
    points: 1,
    categories: [
      { id: "nature-persists", title: "Nature Persists Beneath the City" },
      { id: "city-hides-nature", title: "City Life Hides Natural Wonder" },
    ],
    items: [
      {
        id: "quote-1",
        text: "\"Under the pavement, narrow and bright, / A thread of water remembers the rain;\" (lines 1-2)",
      },
      {
        id: "quote-2",
        text: "\"Above it, buses shudder and brake, / Crowds hurry over the covered stream;\" (lines 5-6)",
      },
      {
        id: "quote-3",
        text: "\"The buried creek keeps carrying its dream.\" (line 8)",
      },
      {
        id: "quote-4",
        text: "\"No tower notices, no window hears, / The patient music below the street;\" (lines 10-11)",
      },
      {
        id: "quote-5",
        text: "\"The creek remembers older trails / And polishes them in its dreams.\" (lines 15-16)",
      },
    ],
    correctPlacements: {
      "quote-1": "nature-persists",
      "quote-2": "city-hides-nature",
      "quote-3": "nature-persists",
      "quote-4": "city-hides-nature",
      "quote-5": "nature-persists",
    },
  },
  {
    id: "snowy-mountains-4",
    topic: "Vocabulary in Context",
    type: "multiple_choice",
    prompt: "As used in line 10, the word patient most nearly suggests that the creek is",
    correctChoiceId: "D",
    points: 1,
    choices: [
      { id: "A", text: "difficult to locate." },
      { id: "B", text: "easily disturbed." },
      { id: "C", text: "recently discovered." },
      { id: "D", text: "quietly enduring." },
    ],
  },
  {
    id: "snowy-mountains-5",
    topic: "Figurative Language & Imagery",
    type: "multiple_choice",
    prompt: "The phrase silver refrain most likely emphasizes the creek's",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "musical, repeated movement." },
      { id: "B", text: "dangerous speed during storms." },
      { id: "C", text: "value to people in the city." },
      { id: "D", text: "connection to tall buildings." },
    ],
  },
  {
    id: "snowy-mountains-6",
    topic: "Text Structure & Purpose",
    type: "multiple_choice",
    prompt: "What is the most likely purpose of the second stanza?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "To explain why city traffic is dangerous" },
      { id: "B", text: "To show the contrast between city activity and the creek's hidden path" },
      { id: "C", text: "To describe a park after a storm" },
      { id: "D", text: "To introduce a speaker who is walking through the city" },
    ],
  },
  {
    id: "snowy-mountains-7",
    topic: "Tone & Mood",
    type: "multiple_choice",
    prompt: "Which statement best describes the speaker's attitude toward the creek?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "The speaker is annoyed that the creek floods the city." },
      { id: "B", text: "The speaker is confused by the creek's location." },
      { id: "C", text: "The speaker admires the creek's quiet persistence." },
      { id: "D", text: "The speaker believes the creek should be removed." },
    ],
  },
];

export const SnowyMountainsPassageSet: ExamPassageSet = {
  id: "ela-passage-set-1",
  questionCount: SnowyMountainsQuestions.length,
  directions: {
    subject: "English Language Arts",
    title: "READING COMPREHENSION",
    breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
    body:
      "Read each text and answer the related questions. As needed, you may use the online notepad tool or write on scrap paper to take notes. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question. Base your answers only on the content within the text.",
  },
  passage: createPlainTextPassage({
    id: "snowy-mountains",
    title: "Snowy Mountains",
    author: "John Gould Fletcher",
    sourceNote: "\"Snowy Mountains\" by John Gould Fletcher—Public Domain",
    text: SnowyMountainsPassageText,
  }),
  questions: SnowyMountainsQuestions,
};
