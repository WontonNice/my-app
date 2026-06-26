import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const cityCreekPassageText = `
Under the pavement, narrow and bright,
A thread of water remembers the rain;
It slips past roots in the hidden night,
And taps at stones with a silver refrain.
Above it, buses shudder and brake,
Crowds hurry over the covered stream;
Yet all day long, where the crosswalks shake,
The buried creek keeps carrying its dream.

No tower notices, no window hears,
The patient music below the street;
But after storms, in the park, it appears
Where grass grows suddenly dark and sweet.

Past cellar walls and iron rails,
Past painted signs and concrete seams,
The creek remembers older trails
And polishes them in its dreams.
`;

const cityCreekQuestions: ExamQuestion[] = [
  {
    id: "city-creek-1",
    type: "multiple_choice",
    prompt: "The description in the first stanza (lines 1-4) helps establish a central idea of the poem by",
    correctChoiceId: "B",
    points: 1,
    choices: [
      {
        id: "A",
        text: "showing that the city has completely erased the natural world beneath it.",
      },
      {
        id: "B",
        text: "contrasting the busy life of the city with the quiet persistence of nature below it.",
      },
      {
        id: "C",
        text: "explaining why people in the city should avoid walking after storms.",
      },
      {
        id: "D",
        text: "suggesting that modern buildings are stronger than older natural features.",
      },
    ],
  },
  {
    id: "city-creek-2",
    type: "multi_select",
    prompt: "In which two ways does the poet develop the speaker's point of view in the second stanza (lines 5-8)?",
    instructions: "Select the two correct answers.",
    correctChoiceIds: ["B", "E"],
    requiredSelections: 2,
    points: 1,
    choices: [
      { id: "A", text: "by describing the creek as louder than the traffic above it" },
      { id: "B", text: "by contrasting the activity of the city with the hidden movement of the creek" },
      { id: "C", text: "by explaining that the crosswalks were built to protect the stream" },
      { id: "D", text: "by showing that people are aware of the creek and try to preserve it" },
      { id: "E", text: "by personifying the creek as something that continues to carry a dream" },
    ],
  },
  {
    id: "city-creek-3",
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
    id: "city-creek-4",
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
    id: "city-creek-5",
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
    id: "city-creek-6",
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
    id: "city-creek-7",
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
  {
    id: "city-creek-8",
    type: "multiple_choice",
    prompt: "Which sentence best states a theme of the poem?",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "Nature can continue to exist even when people overlook it." },
      { id: "B", text: "Cities are always stronger than natural places." },
      { id: "C", text: "Storms are necessary for people to appreciate parks." },
      { id: "D", text: "People should avoid building roads near streams." },
    ],
  },
];

export const cityCreekPassageSet: ExamPassageSet = {
  id: "ela-passage-set-1",
  questionCount: cityCreekQuestions.length,
  directions: {
    subject: "English Language Arts",
    title: "READING COMPREHENSION",
    breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
    body:
      "Read each text and answer the related questions. As needed, you may use the online notepad tool or write on scrap paper to take notes. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question. Base your answers only on the content within the text.",
  },
  passage: createPlainTextPassage({
    id: "city-creek",
    title: "City Creek",
    author: "L. Rivera",
    sourceNote: "\"City Creek\" by L. Rivera",
    text: cityCreekPassageText,
  }),
  questions: cityCreekQuestions,
};
