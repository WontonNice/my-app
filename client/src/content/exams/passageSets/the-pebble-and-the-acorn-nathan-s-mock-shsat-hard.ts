import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const thePebbleAndTheAcornNathanSMockShsatHardPassageText = "“I am a Pebble! and yield to none!”\nWere swelling words of a tiny stone,\n“Nor time nor season can alter me;\nI am abiding, while ages flee.\nThe pelting hail and the drizzling rain\nHave tried to soften me, long, in vain;\nAnd the tender dew has sought to melt,\nOr touch my heart; but it was not felt.\nThere’s none that can tell about my birth,\nFor I’m as old as the big, round earth.\nThe children of men arise, and pass\nOut of the world, like the blades of grass;\nAnd many a foot on me has trod,\nThat’s gone from sight, and under the sod!\nI am a Pebble! but who art thou,\nRattling along from the restless bough?”\nThe Acorn was shocked at this rude salute,\nAnd lay for a moment abashed and mute;\nShe never before had been so near\nThis gravelly ball, the mundane sphere;\nAnd she felt for a time at a loss to know\nHow to answer a thing so coarse and low.\nBut to give reproof of a nobler sort\nThan the angry look, or the keen retort,\nAt length she said, in a gentle tone,\n“Since it has happened that I am thrown\nFrom the lighter element, where I grew,\nDown to another, so hard and new,\nAnd beside a personage so august,\nAbased, I will cover my head with dust,\nAnd quickly retire from the sight of one\nWhom time, nor season, nor storm, nor sun,\nNor the gentle dew, nor the grinding heel\nHas ever subdued, or made to feel!”\nAnd soon, in the earth, she sunk away\nFrom the comfortless spot where the Pebble lay.\nBut it was not long ere the soil was broke\nBy the peering head of an infant oak!\nAnd, as it arose and its branches spread,\nThe Pebble looked up, and wondering said,\n“A modest Acorn! never to tell\nWhat was enclosed in its simple shell;\nThat the pride of the forest was folded up\nIn the narrow space of its little cup!\nAnd meekly to sink in the darksome earth,\nWhich proves that nothing could hide her worth!\nAnd oh! how many will tread on me,\nTo come and admire the beautiful tree,\nWhose head is towering towards the sky,\nAbove such a worthless thing as I!\nUseless and vain, a cumberer here,\nI have been idling from year to year.\nBut never, from this, shall a vaunting word\nFrom the humbled Pebble again be heard,\nTill something without me or within,\nShall show the purpose for which I’ve been!”\nThe Pebble its vow could not forget,\nAnd it lies there wrapt in silence yet.";

const thePebbleAndTheAcornNathanSMockShsatHardQuestions: ExamQuestion[] = [
  {
    "id": "nmsh-pebble-acorn-1",
    "explanation": "Being unable to be “touched” is a boast, but it also means having no feeling. The Acorn picks up on this later with “made to feel.” B is outside-the-text.",
    "explanationHtml": "<p>Being unable to be “touched” is a boast, but it also means having no feeling. The Acorn picks up on this later with “made to feel.” B is <em>outside-the-text</em>.</p>",
    "points": 1,
    "prompt": "In lines 7–8, the Pebble boasts that the dew “sought to melt, / Or touch my heart; but it was not felt.” This boast reveals more about the Pebble than it intends because it",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "shows that the Pebble is older than the dew."
      },
      {
        "id": "B",
        "text": "suggests that the Pebble is secretly afraid of being softened."
      },
      {
        "id": "C",
        "text": "proves that the Pebble is stronger than the Acorn."
      },
      {
        "id": "D",
        "text": "presents as a strength what could also be seen as an inability to feel."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-2",
    "explanation": "The Pebble means it as proof of endurance, but being trod on is also lowly, and the poem comes back to this in lines 47–50. C is outside-the-text, and A is reversed in tone.",
    "explanationHtml": "<p>The Pebble means it as proof of endurance, but being trod on is also lowly, and the poem comes back to this in lines 47–50. C is <em>outside-the-text</em>, and A is <em>reversed</em> in tone.</p>",
    "points": 1,
    "prompt": "In lines 13–14, the Pebble mentions the “many a foot on me has trod, / That’s gone from sight” mainly to show its",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "sympathy for the people who have died."
      },
      {
        "id": "B",
        "text": "endurance, although the image also reveals that it has long been treated as something lowly."
      },
      {
        "id": "C",
        "text": "pride in serving a useful purpose as part of a path."
      },
      {
        "id": "D",
        "text": "fear that it will someday be buried like those people."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-3",
    "explanation": "“Restless” and “rattling” set against “abiding” is a put-down. C is the main trap: the line is a question, but a dismissive one. B and D are literal.",
    "explanationHtml": "<p>“Restless” and “rattling” set against “abiding” is a put-down. C is the main trap: the line is a question, but a dismissive one. B and D are <em>literal</em>.</p>",
    "points": 1,
    "prompt": "The phrase “Rattling along from the restless bough” (line 16) contributes to the Pebble’s speech mainly by",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "contrasting the Acorn’s unsettled origin with the Pebble’s own permanence."
      },
      {
        "id": "B",
        "text": "describing the sound the Acorn made when it struck the Pebble."
      },
      {
        "id": "C",
        "text": "revealing the Pebble’s genuine curiosity about where the Acorn came from."
      },
      {
        "id": "D",
        "text": "suggesting that a strong wind caused the Acorn to fall."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-4",
    "explanation": "She’d “never before” been so near the ground and was “at a loss” how to answer something “so coarse.” B is reversed: she finds the Pebble rude, not convincing.",
    "explanationHtml": "<p>She’d “never before” been so near the ground and was “at a loss” how to answer something “so coarse.” B is <em>reversed</em>: she finds the Pebble rude, not convincing.</p>",
    "points": 1,
    "prompt": "Lines 19–22 suggest that the Acorn is silent at first mainly because she",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "fears that the Pebble might harm her."
      },
      {
        "id": "B",
        "text": "suspects that the Pebble is right about its own importance."
      },
      {
        "id": "C",
        "text": "is shocked to learn how old the earth is."
      },
      {
        "id": "D",
        "text": "is unfamiliar with the ground and unsure how to answer such rudeness."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-5",
    "explanation": "Light and growing versus hard, a contrast of natures. D is a word-match trap on “new” (the ground is new to her). A adds an emotion the lines don’t show.",
    "explanationHtml": "<p>Light and growing versus hard, a contrast of natures. D is a <em>word-match</em> trap on “new” (the ground is new <em>to her</em>). A adds an emotion the lines don’t show.</p>",
    "points": 1,
    "prompt": "In lines 27–28, the Acorn contrasts “the lighter element, where I grew” with “another, so hard and new.” This contrast mainly emphasizes",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "her regret at having fallen from the tree."
      },
      {
        "id": "B",
        "text": "that the ground is more dangerous than the tree."
      },
      {
        "id": "C",
        "text": "the difference between her own nature and the harsh world of the Pebble."
      },
      {
        "id": "D",
        "text": "that she is much younger than the Pebble."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-6",
    "explanation": "Repeating the Pebble’s list back to it (“time, nor season…”) ends with “made to feel,” a gentle jab. B takes her polite words at face value.",
    "explanationHtml": "<p>Repeating the Pebble’s list back to it (“time, nor season…”) ends with “made to feel,” a gentle jab. B takes her polite words at face value.</p>",
    "points": 1,
    "prompt": "The Acorn’s words in lines 31–34 echo the Pebble’s boasts in lines 3–8. The main effect of this echo is to",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "turn the Pebble’s own claims into a quiet criticism of its hardness."
      },
      {
        "id": "B",
        "text": "show that the Acorn has been persuaded by the Pebble’s argument."
      },
      {
        "id": "C",
        "text": "suggest that the Acorn, too, cannot be changed by time or weather."
      },
      {
        "id": "D",
        "text": "reveal that the Acorn misunderstood what the Pebble said."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-7",
    "explanation": "Her burial leads to growth. A is the main trap: it only describes her sinking, which is the retreat. D is part of the retreat itself.",
    "explanationHtml": "<p>Her burial leads to growth. A is the main trap: it only describes her sinking, which <em>is</em> the retreat. D is part of the retreat itself.</p>",
    "points": 1,
    "prompt": "Which lines best show that the Acorn’s decision to “cover my head with dust” (line 30) is more than a retreat?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“And soon, in the earth, she sunk away / From the comfortless spot where the Pebble lay.” (lines 35–36)"
      },
      {
        "id": "B",
        "text": "“But it was not long ere the soil was broke / By the peering head of an infant oak!” (lines 37–38)"
      },
      {
        "id": "C",
        "text": "“And lay for a moment abashed and mute;” (line 18)"
      },
      {
        "id": "D",
        "text": "“And quickly retire from the sight of one” (line 31)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-8",
    "explanation": "Her worth showed itself by growing. D is a word-match trap on “nothing could hide,” since the poem stresses that she was “never to tell.” A misreads “hide.”",
    "explanationHtml": "<p>Her worth showed itself by growing. D is a <em>word-match</em> trap on “nothing could hide,” since the poem stresses that she was “never to tell.” A misreads “hide.”</p>",
    "points": 1,
    "prompt": "In lines 45–46, the Pebble says the Acorn’s sinking into the earth “proves that nothing could hide her worth.” This statement suggests that the Pebble now believes that",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "the Acorn had been hiding from the Pebble out of fear."
      },
      {
        "id": "B",
        "text": "the Acorn will return to the surface in its original form."
      },
      {
        "id": "C",
        "text": "true worth is revealed by what one becomes, even when it begins humbly and unseen."
      },
      {
        "id": "D",
        "text": "the Acorn’s worth was obvious to everyone from the start."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-9",
    "explanation": "In lines 13–14 the trampling was a boast, and here it’s a humiliation. C is outside-the-text.",
    "explanationHtml": "<p>In lines 13–14 the trampling was a boast, and here it’s a humiliation. C is <em>outside-the-text</em>.</p>",
    "points": 1,
    "prompt": "The Pebble’s realization in lines 47–50 that people “will tread on me, / To come and admire the beautiful tree” is ironic mainly because",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "text": "the Pebble once said that trees were less important than stones."
      },
      {
        "id": "B",
        "text": "the Pebble is now afraid of the people it once ignored."
      },
      {
        "id": "C",
        "text": "the tree will eventually be cut down, while the Pebble will last."
      },
      {
        "id": "D",
        "text": "being walked on, which the Pebble once offered as proof of its endurance, now shows how lowly it is."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-10",
    "explanation": "“Till” leaves room for a purpose that hasn’t shown up yet. A is the trap: “worthless” in line 50 is how the Pebble feels at that moment, but “till” points ahead. D is reversed: “it lies there wrapt in silence yet.”",
    "explanationHtml": "<p>“Till” leaves room for a purpose that hasn’t shown up yet. A is the trap: “worthless” in line 50 is how the Pebble feels at that moment, but “till” points ahead. D is <em>reversed</em>: “it lies there wrapt in silence yet.”</p>",
    "points": 1,
    "prompt": "How do lines 55–56 (“Till something without me or within, / Shall show the purpose for which I’ve been!”) affect the meaning of the poem’s ending?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "They suggest that the Pebble has given up hope of ever having a purpose."
      },
      {
        "id": "B",
        "text": "They leave open the possibility that the Pebble has a purpose not yet revealed, even as it stays silent."
      },
      {
        "id": "C",
        "text": "They show that the Pebble plans to bury itself as the Acorn did."
      },
      {
        "id": "D",
        "text": "They reveal that the Pebble will soon break its vow of silence."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-pebble-acorn-tei",
    "explanation": "In lines 1–16 the Pebble brags that it will “yield to none.” In lines 39–46 it looks up “wondering” and praises the Acorn’s hidden worth. In lines 51–56 it calls itself “useless and vain” and vows never to boast again. The poem never shows the Pebble as fearful or jealous.",
    "points": 1,
    "prompt": "What is the Pebble’s attitude at key points in the poem?",
    "instructions": "Move the correct answer to each box in the table.",
    "topic": "Tone & Mood",
    "categories": [
      {
        "id": "row-1",
        "title": "1–16"
      },
      {
        "id": "row-2",
        "title": "39–46"
      },
      {
        "id": "row-3",
        "title": "51–56"
      }
    ],
    "categoryCapacity": 1,
    "correctPlacements": {
      "item-1": "row-1",
      "item-3": "row-2",
      "item-5": "row-3"
    },
    "items": [
      {
        "id": "item-1",
        "text": "Boastful"
      },
      {
        "id": "item-2",
        "text": "Fearful"
      },
      {
        "id": "item-3",
        "text": "Admiring"
      },
      {
        "id": "item-4",
        "text": "Jealous"
      },
      {
        "id": "item-5",
        "text": "Humbled"
      }
    ],
    "requiredPlacements": 3,
    "tableHeaders": {
      "answer": "The Pebble’s Attitude",
      "row": "Lines"
    },
    "type": "table_match"
  }
];

export const thePebbleAndTheAcornNathanSMockShsatHardPassageSet: ExamPassageSet = {
  id: "ela-the-pebble-and-the-acorn-nathan-s-mock-shsat-hard",
  versionLabels: ["Nathan's Mock SHSAT (Hard)"],
  section: "reading",
  questionCount: thePebbleAndTheAcornNathanSMockShsatHardQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createPlainTextPassage({
    id: "the-pebble-and-the-acorn-nathan-s-mock-shsat-hard",
    title: "The Pebble and the Acorn",
    author: "Hannah Flagg Gould",
    passageType: "poem",
    passageCategory: "miscellaneous",
    richText: "<p>“I am a Pebble! and yield to none!”</p><p>Were swelling words of a tiny stone,</p><p>“Nor time nor season can alter me;</p><p>I am abiding, while ages flee.</p><p>The pelting hail and the drizzling rain</p><p>Have tried to soften me, long, in vain;</p><p>And the tender dew has sought to melt,</p><p>Or touch my heart; but it was not felt.</p><p>There’s none that can tell about my birth,</p><p>For I’m as old as the big, round earth.</p><p>The children of men arise, and pass</p><p>Out of the world, like the blades of grass;</p><p>And many a foot on me has trod,</p><p>That’s gone from sight, and under the sod!</p><p>I am a Pebble! but who <span data-glossary-definition=\"are you\" role=\"link\" tabindex=\"0\">art thou</span>,</p><p>Rattling along from the restless bough?”</p><p>The Acorn was shocked at this rude salute,</p><p>And lay for a moment <span data-glossary-definition=\"embarrassed\" role=\"link\" tabindex=\"0\">abashed</span> and mute;</p><p>She never before had been so near</p><p>This gravelly ball, the <span data-glossary-definition=\"the earth\" role=\"link\" tabindex=\"0\">mundane sphere</span>;</p><p>And she felt for a time at a loss to know</p><p>How to answer a thing so coarse and low.</p><p>But to give <span data-glossary-definition=\"criticism or correction\" role=\"link\" tabindex=\"0\">reproof</span> of a nobler sort</p><p>Than the angry look, or the keen <span data-glossary-definition=\"a sharp reply\" role=\"link\" tabindex=\"0\">retort</span>,</p><p>At length she said, in a gentle tone,</p><p>“Since it has happened that I am thrown</p><p>From the lighter element, where I grew,</p><p>Down to another, so hard and new,</p><p>And beside a personage so <span data-glossary-definition=\"grand and important\" role=\"link\" tabindex=\"0\">august</span>,</p><p><span data-glossary-definition=\"lowered in dignity\" role=\"link\" tabindex=\"0\">Abased</span>, I will cover my head with dust,</p><p>And quickly retire from the sight of one</p><p>Whom time, nor season, nor storm, nor sun,</p><p>Nor the gentle dew, nor the grinding heel</p><p>Has ever <span data-glossary-definition=\"overcome\" role=\"link\" tabindex=\"0\">subdued</span>, or made to feel!”</p><p>And soon, in the earth, she sunk away</p><p>From the comfortless spot where the Pebble lay.</p><p>But it was not long <span data-glossary-definition=\"before\" role=\"link\" tabindex=\"0\">ere</span> the soil was broke</p><p>By the peering head of an infant oak!</p><p>And, as it arose and its branches spread,</p><p>The Pebble looked up, and wondering said,</p><p>“A modest Acorn! never to tell</p><p>What was enclosed in its simple shell;</p><p>That the pride of the forest was folded up</p><p>In the narrow space of its little cup!</p><p>And meekly to sink in the darksome earth,</p><p>Which proves that nothing could hide her worth!</p><p>And oh! how many will tread on me,</p><p>To come and admire the beautiful tree,</p><p>Whose head is towering towards the sky,</p><p>Above such a worthless thing as I!</p><p>Useless and vain, a <span data-glossary-definition=\"something that takes up space without being useful\" role=\"link\" tabindex=\"0\">cumberer</span> here,</p><p>I have been idling from year to year.</p><p>But never, from this, shall a <span data-glossary-definition=\"boastful\" role=\"link\" tabindex=\"0\">vaunting</span> word</p><p>From the humbled Pebble again be heard,</p><p>Till something without me or within,</p><p>Shall show the purpose for which I’ve been!”</p><p>The Pebble its vow could not forget,</p><p>And it lies there <span data-glossary-definition=\"wrapped\" role=\"link\" tabindex=\"0\">wrapt</span> in silence yet.</p>",
    sourceNote: "“The Pebble and the Acorn” by Hannah Flagg Gould—Public Domain",
    text: thePebbleAndTheAcornNathanSMockShsatHardPassageText,
    versionLabel: "Nathan's Mock SHSAT (Hard)",
  }),
  questions: thePebbleAndTheAcornNathanSMockShsatHardQuestions,
};
