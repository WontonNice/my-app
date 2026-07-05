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
    type: "multiple_choice",
    prompt: "Which detail from the poem reflects the speaker’s view that people often fail to appreciate what is familiar?",
    correctChoiceId: "B",
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
    topic: "Author's Point of View",
    type: "multiple_choice",
    prompt: "How does isolating the word “Uprise” in line 7 affect the meaning of the poem?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "It creates a contrast between the great plateau and the city buildings." },
      { id: "B", text: "It reveals the similarity between the tall buildings in the city and the tall mountains on the horizon." },
      { id: "C", text: "It creates a vision of the region before people developed the land." },
      { id: "D", text: "It emphasizes that the mountains dominate the landscape." },
    ],
  },
  {
    id: "snowy-mountains-4",
    topic: "Author's Point of View",
    type: "multi_select",
    prompt: "In which **two** ways does the poet develop the speaker’s point of view in the second stanza (lines 8–14)?",
    instructions: "Select the **two** correct answers.",
    correctChoiceIds: ["B", "E"],
    requiredSelections: 2,
    points: 1,
    choices: [
      { id: "A", text: "by describing the mountains’ awe-inspiring size and strength" },
      { id: "B", text: "by comparing the various methods humans use to control nature" },
      { id: "C", text: "by criticizing the careless actions of humans that harm the natural environment" },
      { id: "D", text: "by demonstrating how the mountains and the people are able to benefit from each other" },
      { id: "E", text: "by depicting the unfortunate plight of the mountains with vivid details" },
    ],
  },
  {
    id: "snowy-mountains-5",
    topic: "Author's Point of View",
    type: "multiple_choice",
    prompt: "Read lines 21–22 from the poem.\n**Barrier broken down by those who do not need**\n**The joy of time-resisting storm-worn stone,**\nHow do the lines help convey the speaker’s point of view?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "They suggest that the speaker wants to remove the obstacles that prevent others from experiencing the wonders of nature." },
      { id: "B", text: "They reveal the speaker’s opinion that some people are too busy to appreciate natural beauty." },
      { id: "C", text: "They reflect the speaker’s dismay that people destroy the natural landscape without understanding the ramifications of their actions." },
      { id: "D", text: "They explain that the speaker is confident that nature will never be fully destroyed by people." },
    ],
  },
  {
    id: "snowy-mountains-6",
    topic: "Author's Point of View",
    type: "multiple_choice",
    prompt: "Read lines 21–22 from the poem.\n**Barrier broken down by those who do not need**\n**The joy of time-resisting storm-worn stone,**\nHow do the lines help convey the speaker’s point of view?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "gracious hosts who are untroubled by the actions of people." },
      { id: "B", text: "unaware of their coming destruction." },
      { id: "C", text: "lively entertainers who are amused by the everyday concerns of people." },
      { id: "D", text: "too proud to reveal their pain." },
    ],
  },
  {
    id: "snowy-mountains-7",
    topic: "Central Idea & Theme",
    type: "category_sort",
    prompt:
      "Which quotations from the poem support the theme that nature’s unspoiled beauty is splendid, and which quotations support the theme that human creations detract from natural wonder?",
    instructions: "Move each answer to the correct box.",
    points: 1,
    categories: [
      { id: "nature-persists", title: "Nature’s Unspoiled Beauty is Splendid" },
      { id: "city-hides-nature", title: "Human Creations Detract from Natural Wonder" },
    ],
    items: [
      {
        id: "quote-1",
        text: "“Above the dingy city-roofs /  Blue-white like angels with broad wings,”  (lines 3-4)",
      },
      {
        id: "quote-2",
        text: "“Wilderness still untamed, / To which the future is as was the past,”  (lines 17-18)",
      },
      {
        id: "quote-3",
        text: "“Pillars of the sky at rest / The mountains from the great plateau / Uprise.” (line 5-7)",
      },
      {
        id: "quote-4",
        text: "“Tunnels their granite cliffs, /  Splits down their shining sides,” (lines 11-12)",
      },
      {
        id: "quote-5",
        text: "“The south horizon of the sky; / Welcoming with wide floors of blue-green ice” (lines 24-25)",
      },
    ],
    correctPlacements: {
      "quote-1": "nature-persists",
      "quote-2": "city-hides-nature",
      "quote-3": "nature-persists",
      "quote-4": "city-hides-nature",
      "quote-5": "nature-persists",
    },
  }
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
