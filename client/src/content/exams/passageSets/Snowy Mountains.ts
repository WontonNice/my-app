import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const snowyMountainsPassageText = "\nHigher and still more high,\nPalaces made for cloud,\nAbove the dingy city-roofs\nBlue-white like angels with broad wings,\nPillars of the sky at rest\nThe mountains from the great plateau\nUprise.\n\nBut the world heeds them not;\nThey have been here now for too long a time.\nThe world makes war on them,\nTunnels their granite cliffs,\nSplits down their shining sides,\nPlasters their cliffs with soap-advertisements,\nDestroys the lonely fragments of their peace.\n\nVaster and still more vast,\nPeak after peak, pile after pile,\nWilderness still untamed,\nTo which the future is as was the past,\nBarrier spread by Gods,\nSunning their shining foreheads,\nBarrier broken down by those who do not need\nThe joy of time-resisting storm-worn stone,\nThe mountains swing along\nThe south horizon of the sky;\nWelcoming with wide floors of blue-green ice\nThe mists that dance and drive before the sun.\n";

const snowyMountainsQuestions: ExamQuestion[] = [
  {
    "id": "snowy-mountains-1",
    "points": 1,
    "prompt": "The description in the first stanza (lines 1–7) helps establish a central idea of the poem by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "comparing the length of time the mountains have existed with the length of time the city has existed."
      },
      {
        "id": "B",
        "text": "contrasting the grandeur of the mountains with the structures in the city below them."
      },
      {
        "id": "C",
        "text": "implying that the mountains are a source of inspiration to the people in the city below."
      },
      {
        "id": "D",
        "text": "suggesting that the mountains are larger than the people in the city realize."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-2",
    "points": 1,
    "prompt": "Which detail from the poem reflects the speaker’s view that people often fail to appreciate what is familiar?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "“The mountains from the great plateau” (line 6)"
      },
      {
        "id": "B",
        "text": "“They have been here now for too long a time.” (line 9)"
      },
      {
        "id": "C",
        "text": "“Splits down their shining sides,” (line 12)"
      },
      {
        "id": "D",
        "text": "“To which the future is as was the past,” (line 18)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-3",
    "points": 1,
    "prompt": "How does isolating the word “Uprise” in line 7 affect the meaning of the poem?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "It creates a contrast between the great plateau and the city buildings."
      },
      {
        "id": "B",
        "text": "It reveals the similarity between the tall buildings in the city and the tall mountains on the horizon."
      },
      {
        "id": "C",
        "text": "It creates a vision of the region before people developed the land."
      },
      {
        "id": "D",
        "text": "It emphasizes that the mountains dominate the landscape."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-4",
    "points": 1,
    "prompt": "In which two ways does the poet develop the speaker’s point of view in the second stanza (lines 8–14)? \nSelect the two correct answers.",
    "promptHtml": "In which <strong>two</strong> ways does the poet develop the speaker’s point of view in the second stanza (lines 8–14)?<br>Select the <strong>two</strong> correct answers.",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "by describing the mountains’ awe-inspiring size and strength"
      },
      {
        "id": "B",
        "text": "by comparing the various methods humans use to control nature"
      },
      {
        "id": "C",
        "text": "by criticizing the careless actions of humans that harm the natural environment"
      },
      {
        "id": "D",
        "text": "by demonstrating how the mountains and the people are able to benefit from each other"
      },
      {
        "id": "E",
        "html": "by depicting the unfortunate plight of the mountains with vivid details",
        "text": "by depicting the unfortunate plight of the mountains with vivid details"
      }
    ],
    "correctChoiceIds": [
      "B",
      "E"
    ],
    "requiredSelections": 2,
    "type": "multi_select"
  },
  {
    "id": "snowy-mountains-5",
    "points": 1,
    "prompt": "How do the details in the third stanza (lines 15–26) **most** contribute to the development of a theme of the poem?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "by reflecting nature’s capacity to resist change"
      },
      {
        "id": "B",
        "text": "by showing that nature is capable of influencing human will"
      },
      {
        "id": "C",
        "text": "by exposing how a lack of awareness leads to nature’s ruin"
      },
      {
        "id": "D",
        "text": "by explaining why people must respect nature"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-6",
    "points": 1,
    "prompt": "Read lines 21–22 from the poem.\n**Barrier broken down by those who do not need**\n**The joy of time-resisting storm-worn stone,**\nHow do the lines help convey the speaker’s point of view?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "They suggest that the speaker wants to remove the obstacles that prevent others from experiencing the wonders of nature."
      },
      {
        "id": "B",
        "text": "They reveal the speaker’s opinion that some people are too busy to appreciate natural beauty."
      },
      {
        "id": "C",
        "text": "They reflect the speaker’s dismay that people destroy the natural landscape without understanding the ramifications of their actions."
      },
      {
        "id": "D",
        "text": "They explain that the speaker is confident that nature will never be fully destroyed by people."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-8",
    "points": 1,
    "prompt": "Read lines 23–26 from the poem.\n\n**The mountains swing along\nThe south horizon of the sky;\nWelcoming with wide floors of blue-green ice\nThe mists that dance and drive before the sun.**\n\nThe personification in these concluding lines of the poem suggests that the mountains are",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "gracious hosts who are untroubled by the actions of people."
      },
      {
        "id": "B",
        "text": "unaware of their coming destruction."
      },
      {
        "id": "C",
        "text": "lively entertainers who are amused by the everyday concerns of people."
      },
      {
        "id": "D",
        "text": "too proud to reveal their pain."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-7",
    "points": 1,
    "prompt": "Which quotations from the poem support the theme that nature’s unspoiled beauty is splendid, and which quotations support the theme that human creations detract from natural wonder?",
    "topic": "Central Idea & Theme",
    "categories": [
      {
        "id": "nature-persists",
        "title": "Nature’s Unspoiled Beauty is Splendid"
      },
      {
        "id": "city-hides-nature",
        "title": "Human Creations Detract from Natural Wonder"
      }
    ],
    "correctPlacements": {
      "quote-1": "city-hides-nature",
      "quote-2": "nature-persists",
      "quote-3": "nature-persists",
      "quote-4": "city-hides-nature",
      "quote-5": "nature-persists"
    },
    "instructions": "Move each answer to the correct box.",
    "items": [
      {
        "id": "quote-1",
        "text": "“Above the dingy city-roofs /  Blue-white like angels with broad wings,”  (lines 3-4)"
      },
      {
        "id": "quote-2",
        "text": "“Wilderness still untamed, / To which the future is as was the past,”  (lines 17-18)"
      },
      {
        "id": "quote-3",
        "text": "“Pillars of the sky at rest / The mountains from the great plateau / Uprise.” (line 5-7)"
      },
      {
        "id": "quote-4",
        "text": "“Tunnels their granite cliffs, /  Splits down their shining sides,” (lines 11-12)"
      },
      {
        "id": "quote-5",
        "text": "“The south horizon of the sky; / Welcoming with wide floors of blue-green ice” (lines 24-25)"
      }
    ],
    "requiredPlacements": 5,
    "type": "category_sort"
  }
];

export const SnowyMountainsPassageSet: ExamPassageSet = {
  id: "ela-passage-set-1",
  questionCount: snowyMountainsQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. As needed, you may use the online notepad tool or write on scrap paper to take notes. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question. Base your answers only on the content within the text."
},
  passage: createPlainTextPassage({
    id: "snowy-mountains",
    title: "Snowy Mountains",
    sourceNote: "\"Snowy Mountains\" by John Gould Fletcher—Public Domain",
    text: snowyMountainsPassageText,
  }),
  questions: snowyMountainsQuestions,
};
