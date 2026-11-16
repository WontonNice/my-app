import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const thePebbleAndTheAcornNathanSMockShsatPassageText = "“I am a Pebble! and yield to none!”\nWere swelling words of a tiny stone,\n“Nor time nor season can alter me;\nI am abiding, while ages flee.\nThe pelting hail and the drizzling rain\nHave tried to soften me, long, in vain;\nAnd the tender dew has sought to melt,\nOr touch my heart; but it was not felt.\nThere’s none that can tell about my birth,\nFor I’m as old as the big, round earth.\nThe children of men arise, and pass\nOut of the world, like the blades of grass;\nAnd many a foot on me has trod,\nThat’s gone from sight, and under the sod!\nI am a Pebble! but who art thou,\nRattling along from the restless bough?”\nThe Acorn was shocked at this rude salute,\nAnd lay for a moment abashed and mute;\nShe never before had been so near\nThis gravelly ball, the mundane sphere;\nAnd she felt for a time at a loss to know\nHow to answer a thing so coarse and low.\nBut to give reproof of a nobler sort\nThan the angry look, or the keen retort,\nAt length she said, in a gentle tone,\n“Since it has happened that I am thrown\nFrom the lighter element, where I grew,\nDown to another, so hard and new,\nAnd beside a personage so august,\nAbased, I will cover my head with dust,\nAnd quickly retire from the sight of one\nWhom time, nor season, nor storm, nor sun,\nNor the gentle dew, nor the grinding heel\nHas ever subdued, or made to feel!”\nAnd soon, in the earth, she sunk away\nFrom the comfortless spot where the Pebble lay.\nBut it was not long ere the soil was broke\nBy the peering head of an infant oak!\nAnd, as it arose and its branches spread,\nThe Pebble looked up, and wondering said,\n“A modest Acorn! never to tell\nWhat was enclosed in its simple shell;\nThat the pride of the forest was folded up\nIn the narrow space of its little cup!\nAnd meekly to sink in the darksome earth,\nWhich proves that nothing could hide her worth!\nAnd oh! how many will tread on me,\nTo come and admire the beautiful tree,\nWhose head is towering towards the sky,\nAbove such a worthless thing as I!\nUseless and vain, a cumberer here,\nI have been idling from year to year.\nBut never, from this, shall a vaunting word\nFrom the humbled Pebble again be heard,\nTill something without me or within,\nShall show the purpose for which I’ve been!”\nThe Pebble its vow could not forget,\nAnd it lies there wrapt in silence yet.";

const thePebbleAndTheAcornNathanSMockShsatQuestions: ExamQuestion[] = [
  {
    "id": "nms-pebble-acorn-1",
    "explanation": "“Swelling” goes with the Pebble’s proud “I am a Pebble! and yield to none!” B is wrong because the Pebble isn’t angry, just boastful. C takes the storm imagery literally. A assumes the Pebble is lying, and the poem never says that.",
    "points": 1,
    "prompt": "In line 2, the phrase “swelling words” mainly suggests that the Pebble",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "exaggerates its age to impress the Acorn."
      },
      {
        "id": "B",
        "text": "is angry that the Acorn has fallen near it."
      },
      {
        "id": "C",
        "text": "is trying to be heard over the sound of a storm."
      },
      {
        "id": "D",
        "text": "speaks with pride and self-importance."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-2",
    "explanation": "The hail, rain and dew all tried to change it “in vain.” B and C are about its age and long life, not about being unchangeable. D is just a question to the Acorn.",
    "points": 1,
    "prompt": "Which lines best support the Pebble’s claim that nothing can change it?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“The pelting hail and the drizzling rain / Have tried to soften me, long, in vain; / And the tender dew has sought to melt, / Or touch my heart; but it was not felt.” (lines 5–8)"
      },
      {
        "id": "B",
        "text": "“There’s none that can tell about my birth, / For I’m as old as the big, round earth.” (lines 9–10)"
      },
      {
        "id": "C",
        "text": "“And many a foot on me has trod, / That’s gone from sight, and under the sod!” (lines 13–14)"
      },
      {
        "id": "D",
        "text": "“I am a Pebble! but who art thou, / Rattling along from the restless bough?” (lines 15–16)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-3",
    "explanation": "People “arise, and pass” quickly, like grass, while the Pebble stays. D adds an emotion the Pebble never shows.",
    "points": 1,
    "prompt": "In lines 11–12, the comparison of people to “blades of grass” emphasizes the Pebble’s view that",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "people are too small and ordinary to notice it."
      },
      {
        "id": "B",
        "text": "human lives are brief compared with its own existence."
      },
      {
        "id": "C",
        "text": "people treat the natural world carelessly."
      },
      {
        "id": "D",
        "text": "it is lonely because everyone it once knew has died."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-4",
    "explanation": "She picks a “nobler” kind of reproof over “the angry look” or “keen retort.” B confuses being “abashed” with fear. D misses the criticism hidden in her reply.",
    "points": 1,
    "prompt": "Read lines 23–25.\n\nBut to give reproof of a nobler sort\nThan the angry look, or the keen retort,\nAt length she said, in a gentle tone,\n\nThese lines reveal that the Acorn",
    "promptHtml": "<p>Read lines 23–25.</p><blockquote><strong>But to give reproof of a nobler sort<br>Than the angry look, or the keen retort,<br>At length she said, in a gentle tone,</strong></blockquote><p>These lines reveal that the Acorn</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "chooses to respond with calm dignity rather than anger."
      },
      {
        "id": "B",
        "text": "is too frightened to defend herself against the Pebble."
      },
      {
        "id": "C",
        "text": "plans to leave without answering the Pebble at all."
      },
      {
        "id": "D",
        "text": "agrees with the Pebble’s opinion of itself."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-5",
    "explanation": "She echoes the Pebble’s own boasts back to it (“time, nor season…”). “Made to feel” is a quiet jab, because the Pebble bragged that even the dew couldn’t touch its heart. B takes her words at face value.",
    "points": 1,
    "prompt": "In lines 29–34, the Acorn’s description of the Pebble as “a personage so august” whom nothing has “ever subdued, or made to feel” is most likely meant to be",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "text": "confused, showing that she does not understand what the Pebble is."
      },
      {
        "id": "B",
        "text": "sincere, showing that she truly admires the Pebble’s strength."
      },
      {
        "id": "C",
        "text": "ironic, gently mocking the Pebble’s high opinion of itself."
      },
      {
        "id": "D",
        "text": "fearful, revealing that she believes the Pebble may harm her."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-6",
    "explanation": "“But it was not long ere…” is where the poem turns: the Acorn’s retreat grows into an oak. A fits only if a reader counts the oak as a new character, and the oak never speaks.",
    "points": 1,
    "prompt": "How do lines 37–38 contribute to the structure of the poem?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "They introduce a new character who settles the argument."
      },
      {
        "id": "B",
        "text": "They describe the setting where the conversation takes place."
      },
      {
        "id": "C",
        "text": "They repeat the Pebble’s boast from the beginning of the poem."
      },
      {
        "id": "D",
        "text": "They mark a turning point by revealing what the Acorn’s quiet retreat led to."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-7",
    "explanation": "A great tree was hidden inside a small, plain shell. A isn’t supported, and B and D read the lines too literally.",
    "points": 1,
    "prompt": "In lines 43–44, the image of “the pride of the forest” being “folded up / In the narrow space of its little cup” mainly conveys that",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "the Acorn was ashamed of its small size."
      },
      {
        "id": "B",
        "text": "oak trees grow best in narrow, protected spaces."
      },
      {
        "id": "C",
        "text": "the Acorn held great potential inside a humble appearance."
      },
      {
        "id": "D",
        "text": "the forest takes pride in the trees that grow there."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-8",
    "explanation": "The Pebble starts out bragging and ends up calling itself “useless and vain” and “idling.” C is a trap, because the Pebble never talks about wearing away.",
    "points": 1,
    "prompt": "Which statement best describes how the Pebble changes over the course of the poem?",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "It moves from boasting about its permanence to recognizing its own lack of purpose."
      },
      {
        "id": "B",
        "text": "It moves from distrusting the Acorn to becoming her loyal friend."
      },
      {
        "id": "C",
        "text": "It moves from fearing time to accepting that it will someday wear away."
      },
      {
        "id": "D",
        "text": "It moves from silence to speaking proudly about its long life."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-9",
    "explanation": "The poem’s lesson is that true worth shows itself through what you do, not through boasting. A and B state the Pebble’s mistaken view, and C is a minor detail.",
    "points": 1,
    "prompt": "Which line best conveys a theme of the poem?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "“I am abiding, while ages flee.” (line 4)"
      },
      {
        "id": "B",
        "text": "“The children of men arise, and pass” (line 11)"
      },
      {
        "id": "C",
        "text": "“Rattling along from the restless bough?” (line 16)"
      },
      {
        "id": "D",
        "text": "“Which proves that nothing could hide her worth!” (line 46)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-pebble-acorn-10",
    "explanation": "The Pebble vowed not to boast “till” its purpose is shown, and it lies “in silence yet.” B, D and A aren’t supported by the poem.",
    "points": 1,
    "prompt": "The final two lines of the poem (lines 57–58) suggest that the Pebble",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "regrets its vow and wishes it could boast again."
      },
      {
        "id": "B",
        "text": "has been buried beneath the roots of the growing oak."
      },
      {
        "id": "C",
        "text": "has kept its promise because it has not yet found a purpose worth speaking about."
      },
      {
        "id": "D",
        "text": "is waiting silently for the Acorn to return."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const thePebbleAndTheAcornNathanSMockShsatPassageSet: ExamPassageSet = {
  id: "ela-the-pebble-and-the-acorn-nathan-s-mock-shsat",
  versionLabels: ["Nathan's Mock SHSAT"],
  section: "reading",
  questionCount: thePebbleAndTheAcornNathanSMockShsatQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createPlainTextPassage({
    id: "the-pebble-and-the-acorn-nathan-s-mock-shsat",
    title: "The Pebble and the Acorn",
    author: "Hannah Flagg Gould",
    passageType: "poem",
    passageCategory: "miscellaneous",
    richText: "<p>“I am a Pebble! and yield to none!”</p><p>Were swelling words of a tiny stone,</p><p>“Nor time nor season can alter me;</p><p>I am abiding, while ages flee.</p><p>The pelting hail and the drizzling rain</p><p>Have tried to soften me, long, in vain;</p><p>And the tender dew has sought to melt,</p><p>Or touch my heart; but it was not felt.</p><p>There’s none that can tell about my birth,</p><p>For I’m as old as the big, round earth.</p><p>The children of men arise, and pass</p><p>Out of the world, like the blades of grass;</p><p>And many a foot on me has trod,</p><p>That’s gone from sight, and under the sod!</p><p>I am a Pebble! but who <span data-glossary-definition=\"are you\" role=\"link\" tabindex=\"0\">art thou</span>,</p><p>Rattling along from the restless bough?”</p><p>The Acorn was shocked at this rude salute,</p><p>And lay for a moment <span data-glossary-definition=\"embarrassed\" role=\"link\" tabindex=\"0\">abashed</span> and mute;</p><p>She never before had been so near</p><p>This gravelly ball, the <span data-glossary-definition=\"the earth\" role=\"link\" tabindex=\"0\">mundane sphere</span>;</p><p>And she felt for a time at a loss to know</p><p>How to answer a thing so coarse and low.</p><p>But to give <span data-glossary-definition=\"criticism or correction\" role=\"link\" tabindex=\"0\">reproof</span> of a nobler sort</p><p>Than the angry look, or the keen <span data-glossary-definition=\"a sharp reply\" role=\"link\" tabindex=\"0\">retort</span>,</p><p>At length she said, in a gentle tone,</p><p>“Since it has happened that I am thrown</p><p>From the lighter element, where I grew,</p><p>Down to another, so hard and new,</p><p>And beside a personage so <span data-glossary-definition=\"grand and important\" role=\"link\" tabindex=\"0\">august</span>,</p><p><span data-glossary-definition=\"lowered in dignity\" role=\"link\" tabindex=\"0\">Abased</span>, I will cover my head with dust,</p><p>And quickly retire from the sight of one</p><p>Whom time, nor season, nor storm, nor sun,</p><p>Nor the gentle dew, nor the grinding heel</p><p>Has ever <span data-glossary-definition=\"overcome\" role=\"link\" tabindex=\"0\">subdued</span>, or made to feel!”</p><p>And soon, in the earth, she sunk away</p><p>From the comfortless spot where the Pebble lay.</p><p>But it was not long <span data-glossary-definition=\"before\" role=\"link\" tabindex=\"0\">ere</span> the soil was broke</p><p>By the peering head of an infant oak!</p><p>And, as it arose and its branches spread,</p><p>The Pebble looked up, and wondering said,</p><p>“A modest Acorn! never to tell</p><p>What was enclosed in its simple shell;</p><p>That the pride of the forest was folded up</p><p>In the narrow space of its little cup!</p><p>And meekly to sink in the darksome earth,</p><p>Which proves that nothing could hide her worth!</p><p>And oh! how many will tread on me,</p><p>To come and admire the beautiful tree,</p><p>Whose head is towering towards the sky,</p><p>Above such a worthless thing as I!</p><p>Useless and vain, a <span data-glossary-definition=\"something that takes up space without being useful\" role=\"link\" tabindex=\"0\">cumberer</span> here,</p><p>I have been idling from year to year.</p><p>But never, from this, shall a <span data-glossary-definition=\"boastful\" role=\"link\" tabindex=\"0\">vaunting</span> word</p><p>From the humbled Pebble again be heard,</p><p>Till something without me or within,</p><p>Shall show the purpose for which I’ve been!”</p><p>The Pebble its vow could not forget,</p><p>And it lies there <span data-glossary-definition=\"wrapped\" role=\"link\" tabindex=\"0\">wrapt</span> in silence yet.</p>",
    sourceNote: "“The Pebble and the Acorn” by Hannah Flagg Gould—Public Domain",
    text: thePebbleAndTheAcornNathanSMockShsatPassageText,
    versionLabel: "Nathan's Mock SHSAT",
  }),
  questions: thePebbleAndTheAcornNathanSMockShsatQuestions,
};
