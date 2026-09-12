import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const letterFromBrooklyn20252026FormBPassageText = "I can already see how this will end.\n\nHow I will grow tired of the bridge’s\n\nsteep incline, and the absent-minded tourists\n\nwandering into the bicycle path.\n\nThe weather will turn cold.\n\nBut that all happens later.\n\nFor now it is the early edge of fall,\n\nleaves green still while the air narrows,\n\nis slightly crisp, almost grazing\n\nthe hair of my arm like a passing stranger,\n\nas though the air has been forced into intimacy\n\nby the brevity of daylight.\n\nBut when it starts darkening at 4,\n\nthis closeness, I know, will be a felt distance,\n\nlike someone drawing your attention\n\nto their lack of intimacy.\n\nThese days I am still walking at a cathedral pace\n\nbeneath the branches bending across avenues,\n\nbrownstones like rows of lived-in chapels,\n\nlike a pop-up picture book I could have had as a child,\n\nbut didn’t. How Brooklyn makes me nostalgic\n\nfor the moment I am walking inside of.\n\nThese late afternoons filled\n\nwith a loneliness that makes me feel\n\ndistinctly myself, and an awareness\n\nof how rare that is.";

const letterFromBrooklyn20252026FormBQuestions: ExamQuestion[] = [
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-1",
    "points": 1,
    "prompt": "How does the structure of the poem affect the poem’s meaning?",
    "promptHtml": "How&nbsp;does the structure of the&nbsp;poem&nbsp;affect the poem’s meaning?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "The lack of a rhyming pattern suggests that the beauty of each passing day is unique.",
        "text": "The lack of a rhyming pattern suggests that the beauty of each passing day is unique."
      },
      {
        "id": "B",
        "html": "The lengths of the&nbsp;sentences&nbsp;represent the complexity of the thoughts being represented.",
        "text": "The lengths of the sentences represent the complexity of the thoughts being represented."
      },
      {
        "id": "C",
        "html": "The&nbsp;use&nbsp;of complete&nbsp;sentences&nbsp;implies the speaker’s appreciation for the clear&nbsp;beginning&nbsp;and ending of each season.",
        "text": "The use of complete sentences implies the speaker’s appreciation for the clear beginning and ending of each season."
      },
      {
        "id": "D",
        "html": "The single long&nbsp;stanza&nbsp;reflects the continuous flow of the speaker’s thoughts.",
        "text": "The single long stanza reflects the continuous flow of the speaker’s thoughts."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-2",
    "points": 1,
    "prompt": "Which lines support the idea that a change in the weather will lessen the speaker’s appreciation for the city?",
    "promptHtml": "Which&nbsp;lines&nbsp;support&nbsp;the idea that a change in the weather will lessen the speaker’s appreciation for the city?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“as though the air has been forced into intimacy / by the brevity of daylight.”&nbsp;(lines 11–12)",
        "text": "“as though the air has been forced into intimacy / by the brevity of daylight.” (lines 11–12)"
      },
      {
        "id": "B",
        "html": "“But when it starts darkening at 4, / this closeness, I know, will be a felt distance,”&nbsp;(lines 13–14)",
        "text": "“But when it starts darkening at 4, / this closeness, I know, will be a felt distance,” (lines 13–14)"
      },
      {
        "id": "C",
        "html": "“like someone drawing your attention / to their lack of intimacy.”&nbsp;(lines 15–16)",
        "text": "“like someone drawing your attention / to their lack of intimacy.” (lines 15–16)"
      },
      {
        "id": "D",
        "html": "“These days I am still walking . . . / beneath the branches bending across avenues,”&nbsp;(lines 17–18)",
        "text": "“These days I am still walking . . . / beneath the branches bending across avenues,” (lines 17–18)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-4",
    "points": 1,
    "prompt": "Read lines 5–6 from the poem.\nThe weather will turn cold.\nBut that all happens later.\nHow do the lines develop a central theme of the poem?",
    "promptHtml": "Read&nbsp;lines 5–6 from the&nbsp;poem.<br><strong>The weather will turn cold.</strong><br><strong>But that all happens later.</strong><br>How&nbsp;do the lines develop a central&nbsp;theme&nbsp;of the poem?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "They highlight a&nbsp;contrast&nbsp;between the different seasons.",
        "text": "They highlight a contrast between the different seasons."
      },
      {
        "id": "B",
        "html": "They&nbsp;show&nbsp;the&nbsp;sequence&nbsp;of the changes that are expected to occur.",
        "text": "They show the sequence of the changes that are expected to occur."
      },
      {
        "id": "C",
        "html": "They warn about a&nbsp;problem&nbsp;that requires thoughtful preparation.",
        "text": "They warn about a problem that requires thoughtful preparation."
      },
      {
        "id": "D",
        "html": "They emphasize the importance of valuing the present.",
        "text": "They emphasize the importance of valuing the present."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-5",
    "points": 1,
    "prompt": "Read lines 7–9 from the poem.\nFor now it is the early edge of fall,\nleaves green still while the air narrows,\nis slightly crisp,\nThe word choice in the lines helps convey the speaker’s belief that",
    "promptHtml": "Read&nbsp;lines 7–9 from the&nbsp;poem.<br><strong>For now it is the early edge of fall,</strong><br><strong>leaves green still while the air narrows,</strong><br><strong>is slightly crisp,</strong><br>The&nbsp;word&nbsp;choice in the lines&nbsp;helps&nbsp;convey the speaker’s belief that",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "the beauty of the current season should still be appreciated.",
        "text": "the beauty of the current season should still be appreciated."
      },
      {
        "id": "B",
        "html": "the changes in the weather signify the&nbsp;end&nbsp;of the&nbsp;most&nbsp;pleasant season.",
        "text": "the changes in the weather signify the end of the most pleasant season."
      },
      {
        "id": "C",
        "html": "the&nbsp;transition&nbsp;from one season to&nbsp;another&nbsp;happens&nbsp;swiftly and&nbsp;without&nbsp;warning.",
        "text": "the transition from one season to another happens swiftly and without warning."
      },
      {
        "id": "D",
        "html": "the change in the weather is so subtle that people rarely observe or feel it.",
        "text": "the change in the weather is so subtle that people rarely observe or feel it."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-6",
    "points": 1,
    "prompt": "The details in lines 9–12 convey a central idea of the poem by",
    "promptHtml": "The&nbsp;details&nbsp;in lines 9–12 convey a central idea of the&nbsp;poem&nbsp;by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "showing that the cool weather makes the speaker reflect more deeply on life.",
        "text": "showing that the cool weather makes the speaker reflect more deeply on life."
      },
      {
        "id": "B",
        "html": "suggesting that the speaker feels uncomfortable&nbsp;with&nbsp;what&nbsp;the coming weather signifies.",
        "text": "suggesting that the speaker feels uncomfortable with what the coming weather signifies."
      },
      {
        "id": "C",
        "html": "implying that the sensations the speaker experiences during the fall season are fleeting.",
        "text": "implying that the sensations the speaker experiences during the fall season are fleeting."
      },
      {
        "id": "D",
        "html": "suggesting that the thought of fall approaching increases the loneliness the speaker feels.",
        "text": "suggesting that the thought of fall approaching increases the loneliness the speaker feels."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-7",
    "points": 1,
    "prompt": "Which idea does the comparison of the brownstone houses to “a pop-up picture book I could have had as a child, / but didn’t” in lines 20–21 convey?",
    "promptHtml": "Which&nbsp;idea does the comparison of the brownstone houses to “a pop-up picture book I could have had as a&nbsp;child, /&nbsp;but didn’t” in&nbsp;lines 20–21&nbsp;convey?",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "html": "It reveals that some people are still influenced by powerful images from childhood.",
        "text": "It reveals that some people are still influenced by powerful images from childhood."
      },
      {
        "id": "B",
        "html": "It indicates that the neighborhood the speaker is walking&nbsp;through&nbsp;is charming and appealing.",
        "text": "It indicates that the neighborhood the speaker is walking through is charming and appealing."
      },
      {
        "id": "C",
        "html": "It suggests that the speaker has wanted to live in the neighborhood since childhood.",
        "text": "It suggests that the speaker has wanted to live in the neighborhood since childhood."
      },
      {
        "id": "D",
        "html": "It suggests that people&nbsp;often&nbsp;experience lingering regret from their past.",
        "text": "It suggests that people often experience lingering regret from their past."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-8",
    "points": 1,
    "prompt": "Read these lines from the poem.\nI can already see how this will end. (line 1)\nHow Brooklyn makes me nostalgic\nfor the moment I am walking inside of. (lines 21–22)\nThe lines develop a central idea of the poem by",
    "promptHtml": "Read&nbsp;these lines from the&nbsp;poem.<br><strong>I can already see how this will end.</strong>&nbsp;(line 1)<br><strong>How Brooklyn makes me&nbsp;nostalgic</strong><br><strong>for the moment I am walking inside of.</strong>&nbsp;(lines 21–22)<br>The lines develop a central idea of the poem by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "suggesting the speaker’s desire to find a way to break free from the repetitive pattern of daily life.",
        "text": "suggesting the speaker’s desire to find a way to break free from the repetitive pattern of daily life."
      },
      {
        "id": "B",
        "html": "revealing the speaker’s feelings of disappointment over the predictable change in season.",
        "text": "revealing the speaker’s feelings of disappointment over the predictable change in season."
      },
      {
        "id": "C",
        "html": "emphasizing the speaker’s awareness of the future&nbsp;significance&nbsp;of the present moment in the&nbsp;setting.",
        "text": "emphasizing the speaker’s awareness of the future significance of the present moment in the setting."
      },
      {
        "id": "D",
        "html": "showing the speaker’s anticipation of specific emotions caused by an intimate&nbsp;knowledge&nbsp;of the&nbsp;setting.",
        "text": "showing the speaker’s anticipation of specific emotions caused by an intimate knowledge of the setting."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-9",
    "points": 1,
    "prompt": "The speaker’s thoughts throughout the poem develop a theme by showing that",
    "promptHtml": "The speaker’s thoughts throughout the&nbsp;poem&nbsp;develop a&nbsp;theme&nbsp;by showing that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "although people may hold expectations for the future, some people long for present experiences while they are still happening.",
        "text": "although people may hold expectations for the future, some people long for present experiences while they are still happening."
      },
      {
        "id": "B",
        "html": "though people come from different places,&nbsp;most&nbsp;people feel drawn to the special charm a city holds.",
        "text": "though people come from different places, most people feel drawn to the special charm a city holds."
      },
      {
        "id": "C",
        "html": "although people can make decisions about their life, there will always be some things beyond their control.",
        "text": "although people can make decisions about their life, there will always be some things beyond their control."
      },
      {
        "id": "D",
        "html": "though general expectations exist, people have no way of knowing&nbsp;what&nbsp;a given day will actually bring.",
        "text": "though general expectations exist, people have no way of knowing what a given day will actually bring."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2025-2026-form-b-10",
    "points": 1,
    "prompt": "The poet develops the speaker’s point of view by",
    "promptHtml": "The poet develops the speaker’s&nbsp;point of view&nbsp;by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "providing&nbsp;details&nbsp;about the speaker’s longing to be in a different place.",
        "text": "providing details about the speaker’s longing to be in a different place."
      },
      {
        "id": "B",
        "html": "showing the speaker’s sense of unease about the passing seasons.",
        "text": "showing the speaker’s sense of unease about the passing seasons."
      },
      {
        "id": "C",
        "html": "including&nbsp;details&nbsp;about the speaker’s hope that life will remain unchanged.",
        "text": "including details about the speaker’s hope that life will remain unchanged."
      },
      {
        "id": "D",
        "html": "showing the speaker’s desire to treasure and appreciate the changes taking place.",
        "text": "showing the speaker’s desire to treasure and appreciate the changes taking place."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const letterFromBrooklyn20252026FormBPassageSet: ExamPassageSet = {
  id: "ela-letter-from-brooklyn-2025-2026-form-b",
  questionCount: letterFromBrooklyn20252026FormBQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createPlainTextPassage({
    id: "letter-from-brooklyn-2025-2026-form-b",
    title: "Letter from Brooklyn",
    author: "Jacob Scheier",
    passageType: "poem",
    richText: "<p>I can already see how this will end.</p><p>How I will grow tired of the bridge’s</p><p>steep incline, and the absent-minded tourists</p><p>wandering into the bicycle path.</p><p>The weather will turn cold.</p><p>But that all happens later.</p><p>For now it is the early edge of fall,</p><p>leaves green still while the air narrows,</p><p>is slightly crisp, almost grazing</p><p>the hair of my arm like a passing stranger,</p><p>as though the air has been forced into intimacy</p><p>by the&nbsp;brevity&nbsp;of daylight.</p><p>But when it starts darkening at 4,</p><p>this closeness, I know, will be a felt distance,</p><p>like someone drawing your attention</p><p>to their lack of intimacy.</p><p>These days I am still walking at a&nbsp;cathedral&nbsp;pace</p><p>beneath the branches bending across avenues,</p><p>brownstones like rows of lived-in&nbsp;chapels,</p><p>like a pop-up picture book I could have had as a child,</p><p>but didn’t. How Brooklyn makes me&nbsp;nostalgic</p><p>for the moment I am walking inside of.</p><p>These late afternoons filled</p><p>with a loneliness that makes me feel</p><p>distinctly myself, and an awareness</p><p>of how rare that is.</p><p>\n\n</p>",
    sourceNote: "“Letter from Brooklyn” from LETTER FROM BROOKLYN: POEMS by Jacob Scheier, published by ECW Press. Copyright © 2013 by Jacob Scheier. All rights reserved.",
    text: letterFromBrooklyn20252026FormBPassageText,
    versionLabel: "2025-2026 Form B",
  }),
  questions: letterFromBrooklyn20252026FormBQuestions,
};
