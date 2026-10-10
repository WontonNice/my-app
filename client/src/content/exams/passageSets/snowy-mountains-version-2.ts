import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const snowyMountainsVersion2PassageText = "\nHigher and still more high,\nPalaces made for cloud,\nAbove the dingy city-roofs\nBlue-white like angels with broad wings,\nPillars of the sky at rest\nThe mountains from the great plateau\nUprise.\n\nBut the world heeds them not;\nThey have been here now for too long a time.\nThe world makes war on them,\nTunnels their granite cliffs,\nSplits down their shining sides,\nPlasters their cliffs with soap-advertisements,\nDestroys the lonely fragments of their peace.\n\nVaster and still more vast,\nPeak after peak, pile after pile,\nWilderness still untamed,\nTo which the future is as was the past,\nBarrier spread by Gods,\nSunning their shining foreheads,\nBarrier broken down by those who do not need\nThe joy of time-resisting storm-worn stone,\nThe mountains swing along\nThe south horizon of the sky;\nWelcoming with wide floors of blue-green ice\nThe mists that dance and drive before the sun.\n";

const snowyMountainsVersion2Questions: ExamQuestion[] = [
  {
    "id": "snowy-mountains-version-2-1",
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
    "id": "snowy-mountains-version-2-9",
    "points": 1,
    "prompt": "Read line 5 from the poem.\nPillars of the sky at rest\nThe line helps develop the theme of the poem by suggesting that the mountains",
    "promptHtml": "Read line 5 from the poem.\n<strong>Pillars of the sky at rest</strong>\nThe line helps develop the theme of the poem by suggesting that the mountains",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "serve a noble and supportive purpose in the world.",
        "text": "serve a noble and supportive purpose in the world."
      },
      {
        "id": "B",
        "html": "attract the clouds with their strength and permanence.",
        "text": "attract the clouds with their strength and permanence."
      },
      {
        "id": "C",
        "html": "remain untamed through the ages.",
        "text": "remain untamed through the ages."
      },
      {
        "id": "D",
        "html": "provide protection for the people.",
        "text": "provide protection for the people."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-version-2-3",
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
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-version-2-4",
    "points": 1,
    "prompt": "How does the poet develop the speaker’s point of view in the second stanza (lines 8–14)?",
    "promptHtml": "How does the poet develop the speaker’s point of view in the second stanza (lines 8–14)?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "html": "by describing images of the mountains’ awe-inspiring size and strength",
        "text": "by describing images of the mountains’ awe-inspiring size and strength"
      },
      {
        "id": "B",
        "html": "by illustrating the differences among the various ways humans can affect the natural\nenvironment",
        "text": "by illustrating the differences among the various ways humans can affect the natural\nenvironment"
      },
      {
        "id": "C",
        "html": "by criticizing society for taking careless, harmful courses of action against nature",
        "text": "by criticizing society for taking careless, harmful courses of action against nature"
      },
      {
        "id": "D",
        "html": "by demonstrating how the mountains and the people are able to benefit from each other",
        "text": "by demonstrating how the mountains and the people are able to benefit from each other"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-version-2-10",
    "points": 1,
    "prompt": "Which line from the poem best supports the idea that people have sacrificed priceless natural beauty in order to make a profit?",
    "promptHtml": "Which line from the poem best supports the idea that people have sacrificed priceless natural beauty in order to make a profit?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "“Above the dingy city-roofs” (line 3",
        "text": "“Above the dingy city-roofs” (line 3"
      },
      {
        "id": "B",
        "html": "“The world makes war on them,” (line 10)",
        "text": "“The world makes war on them,” (line 10)"
      },
      {
        "id": "C",
        "html": "“Tunnels their granite cliffs,” (line 11)",
        "text": "“Tunnels their granite cliffs,” (line 11)"
      },
      {
        "id": "D",
        "html": "“Plasters their cliffs with soap-advertisements,” (line 13)",
        "text": "“Plasters their cliffs with soap-advertisements,” (line 13)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "snowy-mountains-version-2-2",
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
    "id": "snowy-mountains-version-2-5",
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
    "id": "snowy-mountains-version-2-6",
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
    "id": "snowy-mountains-version-2-7",
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
  }
];

export const snowyMountainsVersion2PassageSet: ExamPassageSet = {
  id: "ela-snowy-mountains-version-2",
  section: "reading",
  questionCount: snowyMountainsVersion2Questions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. As needed, you may use the online notepad tool or write on scrap paper to take notes. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question. Base your answers only on the content within the text."
},
  passage: createPlainTextPassage({
    id: "snowy-mountains-version-2",
    title: "Snowy Mountains",
    author: "John Gould Fletcher",
    passageType: "poem",
    passageCategory: "miscellaneous",
    sourceNote: "\"Snowy Mountains\" by John Gould Fletcher—Public Domain",
    text: snowyMountainsVersion2PassageText,
    versionLabel: "2020-2021 Form A",
  }),
  questions: snowyMountainsVersion2Questions,
};
