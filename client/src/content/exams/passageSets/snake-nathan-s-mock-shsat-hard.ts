import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const snakeNathanSMockShsatHardPassageText = "A snake came to my water-trough\nOn a hot, hot day, and I in pyjamas for the heat,\nTo drink there.\n\nIn the deep, strange-scented shade of the great dark carob tree\nI came down the steps with my pitcher\nAnd must wait, must stand and wait, for there he was at the trough before me.\n\nHe reached down from a fissure in the earth-wall in the gloom\nAnd trailed his yellow-brown slackness soft-bellied down, over the edge of the stone trough\nAnd rested his throat upon the stone bottom,\nAnd where the water had dripped from the tap, in a small clearness,\nHe sipped with his straight mouth,\nSoftly drank through his straight gums, into his slack long body,\nSilently.\n\nSomeone was before me at my water-trough,\nAnd I, like a second-comer, waiting.\n\nHe lifted his head from his drinking, as cattle do,\nAnd looked at me vaguely, as drinking cattle do,\nAnd flickered his two-forked tongue from his lips, and mused a moment,\nAnd stooped and drank a little more,\nBeing earth-brown, earth-golden from the burning bowels of the earth\nOn the day of Sicilian July, with Etna smoking.\n\nThe voice of my education said to me\nHe must be killed,\nFor in Sicily the black, black snakes are innocent, the gold are venomous.\n\nAnd voices in me said, If you were a man\nYou would take a stick and break him now, and finish him off.\n\nBut must I confess how I liked him,\nHow glad I was he had come like a guest in quiet, to drink at my water-trough\nAnd depart peaceful, pacified, and thankless,\nInto the burning bowels of this earth?\n\nWas it cowardice, that I dared not kill him?\nWas it perversity, that I longed to talk to him?\nWas it humility, to feel so honoured?\nI felt so honoured.\n\nAnd yet those voices:\nIf you were not afraid, you would kill him!\n\nAnd truly I was afraid, I was most afraid,\nBut even so, honoured still more\nThat he should seek my hospitality\nFrom out the dark door of the secret earth.\n\nHe drank enough\nAnd lifted his head, dreamily, as one who has drunken,\nAnd flickered his tongue like a forked night on the air, so black,\nSeeming to lick his lips,\nAnd looked around like a god, unseeing, into the air,\nAnd slowly turned his head,\nAnd slowly, very slowly, as if thrice adream,\nProceeded to draw his slow length curving round\nAnd climb again the broken bank of my wall-face.\n\nAnd as he put his head into that dreadful hole,\nAnd as he slowly drew up, snake-easing his shoulders, and entered farther,\nA sort of horror, a sort of protest against his withdrawing into that horrid black hole,\nDeliberately going into the blackness, and slowly drawing himself after,\nOvercame me now his back was turned.\n\nI looked round, I put down my pitcher,\nI picked up a clumsy log\nAnd threw it at the water-trough with a clatter.\n\nI think it did not hit him,\nBut suddenly that part of him that was left behind convulsed in an undignified haste,\nWrithed like lightning, and was gone\nInto the black hole, the earth-lipped fissure in the wall-front,\nAt which, in the intense still noon, I stared with fascination.\n\nAnd immediately I regretted it.\nI thought how paltry, how vulgar, what a mean act!\nI despised myself and the voices of my accursed human education.\n\nAnd I thought of the albatross,\nAnd I wished he would come back, my snake.\n\nFor he seemed to me again like a king,\nLike a king in exile, uncrowned in the underworld,\nNow due to be crowned again.\n\nAnd so, I missed my chance with one of the lords\nOf life.\nAnd I have something to expiate:\nA pettiness.";

const snakeNathanSMockShsatHardQuestions: ExamQuestion[] = [
  {
    "id": "nmsh-snake-1",
    "explanation": "“Must” signals obligation, and lines 14–15 (“like a second-comer”) confirm he’s waiting his turn out of courtesy. A is tempting but goes against the respectful tone. B is out-of-order: his fear comes up later.",
    "explanationHtml": "<p>“Must” signals obligation, and lines 14–15 (“like a second-comer”) confirm he’s waiting his turn out of courtesy. A is tempting but goes against the respectful tone. B is <em>out-of-order</em>: his fear comes up later.</p>",
    "points": 1,
    "prompt": "The repetition in line 6 (“must wait, must stand and wait”) mainly emphasizes",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "the speaker’s impatience at being delayed by the snake."
      },
      {
        "id": "B",
        "text": "the speaker’s fear of moving any closer to the snake."
      },
      {
        "id": "C",
        "text": "the speaker’s sense that waiting his turn is the proper response."
      },
      {
        "id": "D",
        "text": "how long the snake takes to finish drinking."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-2",
    "explanation": "“Burning bowels of the earth” and a smoking volcano link the snake to something ancient and powerful. A is true-but-irrelevant: it’s a hot day, but the imagery is doing more than that.",
    "explanationHtml": "<p>“Burning bowels of the earth” and a smoking volcano link the snake to something ancient and powerful. A is <em>true-but-irrelevant</em>: it’s a hot day, but the imagery is doing more than that.</p>",
    "points": 1,
    "prompt": "Lines 20–21 describe the snake as “earth-brown, earth-golden from the burning bowels of the earth / On the day of Sicilian July, with Etna smoking.” These details contribute to the poem mainly by",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "explaining why the snake is so thirsty."
      },
      {
        "id": "B",
        "text": "connecting the snake with deep, powerful forces of the natural world."
      },
      {
        "id": "C",
        "text": "warning the reader that a volcanic eruption is about to occur."
      },
      {
        "id": "D",
        "text": "showing that the speaker is a newcomer to Sicily."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-3",
    "explanation": "The rule judges by color, but the snake has done nothing threatening. B is the trap: the poem shows the speaker questioning this voice.",
    "explanationHtml": "<p>The rule judges by color, but the snake has done nothing threatening. B is the trap: the poem shows the speaker <em>questioning</em> this voice.</p>",
    "points": 1,
    "prompt": "Which statement best describes how line 24 (“For in Sicily the black, black snakes are innocent, the gold are venomous”) functions in the poem?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It gives the reasoning of the “voice of my education,” which judges the snake by a rule rather than by its behavior."
      },
      {
        "id": "B",
        "text": "It proves that this snake is dangerous and that the speaker should kill it."
      },
      {
        "id": "C",
        "text": "It shows that the speaker has carefully studied the snakes of Sicily."
      },
      {
        "id": "D",
        "text": "It explains why the speaker feels no fear of the snake."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-4",
    "explanation": "He’s “glad” it would leave owing him nothing, which makes him a host to a guest who needs nothing from him. A is the trap that reads “thankless” as a complaint.",
    "explanationHtml": "<p>He’s “glad” it would leave owing him nothing, which makes him a host to a guest who needs nothing from him. A is the trap that reads “thankless” as a complaint.</p>",
    "points": 1,
    "prompt": "In line 29, the speaker expects the snake to “depart peaceful, pacified, and thankless.” The word “thankless” suggests that the speaker",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "resents that the snake shows no gratitude for the water."
      },
      {
        "id": "B",
        "text": "thinks the snake was rude to drink before him."
      },
      {
        "id": "C",
        "text": "hopes the snake will return to thank him later."
      },
      {
        "id": "D",
        "text": "accepts that the snake owes him nothing, which makes the visit feel like an honor."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-5",
    "explanation": "It comes right after “I was most afraid” and says “even so,” so fear and honor appear together. A is half-right (honor only). B is the voices speaking, not his own feeling.",
    "explanationHtml": "<p>It comes right after “I was most afraid” and says “even so,” so fear and honor appear together. A is <em>half-right</em> (honor only). B is the voices speaking, not his own feeling.</p>",
    "points": 1,
    "prompt": "Which line best shows that the speaker’s sense of honor exists alongside his fear?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“I felt so honoured.” (line 34)"
      },
      {
        "id": "B",
        "text": "“If you were not afraid, you would kill him!” (line 36)"
      },
      {
        "id": "C",
        "text": "“Was it cowardice, that I dared not kill him?” (line 31)"
      },
      {
        "id": "D",
        "text": "“But even so, honoured still more” (line 38)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-6",
    "explanation": "The slow pace makes the “clatter” and “convulsed… haste” that follow more shocking. B and D are traps: “dreamily” signals calm, not weakness or menace.",
    "explanationHtml": "<p>The slow pace makes the “clatter” and “convulsed… haste” that follow more shocking. B and D are traps: “dreamily” signals calm, not weakness or menace.</p>",
    "points": 1,
    "prompt": "In lines 41–49, the repetition of “slowly” and the phrase “as if thrice adream” mainly serve to",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "stress the snake’s unhurried, dignified calm, which makes the speaker’s sudden act more jarring."
      },
      {
        "id": "B",
        "text": "suggest that the snake has been weakened by the heat."
      },
      {
        "id": "C",
        "text": "show that the speaker is growing bored as he watches."
      },
      {
        "id": "D",
        "text": "build suspense about whether the snake will attack."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-7",
    "explanation": "The horror is a “protest against his withdrawing into that horrid black hole.” C is outside-the-text: venom is never mentioned in this part.",
    "explanationHtml": "<p>The horror is a “protest against his withdrawing into that horrid black hole.” C is <em>outside-the-text</em>: venom is never mentioned in this part.</p>",
    "points": 1,
    "prompt": "In lines 50–54, the speaker calls the hole “dreadful” and “horrid.” These words suggest that his horror is caused mainly by",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "his worry that more snakes live inside the wall."
      },
      {
        "id": "B",
        "text": "the snake’s withdrawal into a darkness that seems frightening and unknown."
      },
      {
        "id": "C",
        "text": "his sudden realization that the snake is venomous."
      },
      {
        "id": "D",
        "text": "the damage the snake has done to his wall."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-8",
    "explanation": "He acted only once the snake was leaving and harmless, which sets up “paltry… mean.” A is reversed, since there was no threat. B contradicts “clumsy log.”",
    "explanationHtml": "<p>He acted only once the snake was leaving and harmless, which sets up “paltry… mean.” A is <em>reversed</em>, since there was no threat. B contradicts “clumsy log.”</p>",
    "points": 1,
    "prompt": "The detail that the horror overcame the speaker “now his back was turned” (line 54) affects the reader’s view of the speaker’s action mainly by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "showing that the speaker acted to protect himself."
      },
      {
        "id": "B",
        "text": "suggesting that the speaker had carefully planned the attack."
      },
      {
        "id": "C",
        "text": "emphasizing that the act was cowardly, since the snake posed no threat."
      },
      {
        "id": "D",
        "text": "explaining why the log failed to hit the snake."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-9",
    "explanation": "In lines 22–26 the voices push him, and in line 65 he despises them. B is a trap: his regret is about his own pettiness, not about whether the snake was venomous.",
    "explanationHtml": "<p>In lines 22–26 the voices push him, and in line 65 he despises them. B is a trap: his regret is about his own pettiness, not about whether the snake was venomous.</p>",
    "points": 1,
    "prompt": "In line 65, the speaker says he despised “the voices of my accursed human education.” This shows a change from lines 22–26 mainly because the speaker now",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "claims that he never believed the voices at all."
      },
      {
        "id": "B",
        "text": "concludes that the snake was harmless after all."
      },
      {
        "id": "C",
        "text": "rejects the voices that had earlier pressured him to act."
      },
      {
        "id": "D",
        "text": "blames the snake for making him listen to the voices."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-10",
    "explanation": "The poem ends on something small after the grand images of a king and “lords of life.” A is a word-match trap: “pettiness” names a small-minded act, not an unimportant one. B reads too much into the albatross allusion.",
    "explanationHtml": "<p>The poem ends on something small after the grand images of a king and “lords of life.” A is a <em>word-match</em> trap: “pettiness” names a small-minded act, not an unimportant one. B reads too much into the albatross allusion.</p>",
    "points": 1,
    "prompt": "The poem ends with the words “A pettiness” (line 74). Ending with this short phrase mainly",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "suggests that the speaker considers his mistake too minor to matter."
      },
      {
        "id": "B",
        "text": "reveals that the speaker expects to be punished, like the sailor in the albatross story."
      },
      {
        "id": "C",
        "text": "shows that the speaker has finally forgiven himself."
      },
      {
        "id": "D",
        "text": "sharpens the contrast between the snake’s grandeur as “one of the lords / Of life” and the smallness of the speaker’s act."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-snake-tei",
    "explanation": "Lines 23, 26 and 36 are what “the voice of my education” and the “voices in me” tell him to do. Lines 28, 34 and 67 are his own response: gladness, honor, and later longing for the snake to return.",
    "points": 1,
    "prompt": "Sort each line by whether it expresses the voices of the speaker’s education or the speaker’s own feelings.",
    "instructions": "Move each answer to the correct box.",
    "topic": "Author's Point of View",
    "categories": [
      {
        "id": "category-1",
        "title": "Voices of the Speaker’s Education"
      },
      {
        "id": "category-2",
        "title": "The Speaker’s Own Feelings"
      }
    ],
    "correctPlacements": {
      "item-1": "category-1",
      "item-2": "category-1",
      "item-3": "category-2",
      "item-4": "category-2",
      "item-5": "category-1",
      "item-6": "category-2"
    },
    "items": [
      {
        "id": "item-1",
        "text": "“He must be killed,” (line 23)"
      },
      {
        "id": "item-2",
        "text": "“You would take a stick and break him now, and finish him off.” (line 26)"
      },
      {
        "id": "item-3",
        "text": "“How glad I was he had come like a guest in quiet, to drink at my water-trough” (line 28)"
      },
      {
        "id": "item-4",
        "text": "“I felt so honoured.” (line 34)"
      },
      {
        "id": "item-5",
        "text": "“If you were not afraid, you would kill him!” (line 36)"
      },
      {
        "id": "item-6",
        "text": "“And I wished he would come back, my snake.” (line 67)"
      }
    ],
    "requiredPlacements": 6,
    "type": "category_sort"
  }
];

export const snakeNathanSMockShsatHardPassageSet: ExamPassageSet = {
  id: "ela-snake-nathan-s-mock-shsat-hard",
  versionLabels: ["Nathan's Mock SHSAT (Hard)"],
  section: "reading",
  questionCount: snakeNathanSMockShsatHardQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createPlainTextPassage({
    id: "snake-nathan-s-mock-shsat-hard",
    title: "Snake",
    author: "D. H. Lawrence",
    passageType: "poem",
    passageCategory: "miscellaneous",
    richText: "<p>A snake came to my water-trough</p><p>On a hot, hot day, and I in pyjamas for the heat,</p><p>To drink there.</p><p></p><p>In the deep, strange-scented shade of the great dark <span data-glossary-definition=\"a Mediterranean tree\" role=\"link\" tabindex=\"0\">carob</span> tree</p><p>I came down the steps with my pitcher</p><p>And must wait, must stand and wait, for there he was at the trough before me.</p><p></p><p>He reached down from a <span data-glossary-definition=\"a narrow crack\" role=\"link\" tabindex=\"0\">fissure</span> in the earth-wall in the gloom</p><p>And trailed his yellow-brown slackness soft-bellied down, over the edge of the stone trough</p><p>And rested his throat upon the stone bottom,</p><p>And where the water had dripped from the tap, in a small clearness,</p><p>He sipped with his straight mouth,</p><p>Softly drank through his straight gums, into his slack long body,</p><p>Silently.</p><p></p><p>Someone was before me at my water-trough,</p><p>And I, like a second-comer, waiting.</p><p></p><p>He lifted his head from his drinking, as cattle do,</p><p>And looked at me vaguely, as drinking cattle do,</p><p>And flickered his two-forked tongue from his lips, and mused a moment,</p><p>And stooped and drank a little more,</p><p>Being earth-brown, earth-golden from the burning bowels of the earth</p><p>On the day of Sicilian July, with <span data-glossary-definition=\"an active volcano in Sicily\" role=\"link\" tabindex=\"0\">Etna</span> smoking.</p><p></p><p>The voice of my education said to me</p><p>He must be killed,</p><p>For in Sicily the black, black snakes are innocent, the gold are venomous.</p><p></p><p>And voices in me said, If you were a man</p><p>You would take a stick and break him now, and finish him off.</p><p></p><p>But must I confess how I liked him,</p><p>How glad I was he had come like a guest in quiet, to drink at my water-trough</p><p>And depart peaceful, pacified, and thankless,</p><p>Into the burning bowels of this earth?</p><p></p><p>Was it cowardice, that I dared not kill him?</p><p>Was it <span data-glossary-definition=\"a desire to do the opposite of what is expected\" role=\"link\" tabindex=\"0\">perversity</span>, that I longed to talk to him?</p><p>Was it humility, to feel so honoured?</p><p>I felt so honoured.</p><p></p><p>And yet those voices:</p><p>If you were not afraid, you would kill him!</p><p></p><p>And truly I was afraid, I was most afraid,</p><p>But even so, honoured still more</p><p>That he should seek my hospitality</p><p>From out the dark door of the secret earth.</p><p></p><p>He drank enough</p><p>And lifted his head, dreamily, as one who has drunken,</p><p>And flickered his tongue like a forked night on the air, so black,</p><p>Seeming to lick his lips,</p><p>And looked around like a god, unseeing, into the air,</p><p>And slowly turned his head,</p><p>And slowly, very slowly, as if <span data-glossary-definition=\"deeply dreamy\" role=\"link\" tabindex=\"0\">thrice adream</span>,</p><p>Proceeded to draw his slow length curving round</p><p>And climb again the broken bank of my wall-face.</p><p></p><p>And as he put his head into that dreadful hole,</p><p>And as he slowly drew up, snake-easing his shoulders, and entered farther,</p><p>A sort of horror, a sort of protest against his withdrawing into that horrid black hole,</p><p>Deliberately going into the blackness, and slowly drawing himself after,</p><p>Overcame me now his back was turned.</p><p></p><p>I looked round, I put down my pitcher,</p><p>I picked up a clumsy log</p><p>And threw it at the water-trough with a clatter.</p><p></p><p>I think it did not hit him,</p><p>But suddenly that part of him that was left behind convulsed in an undignified haste,</p><p>Writhed like lightning, and was gone</p><p>Into the black hole, the earth-lipped fissure in the wall-front,</p><p>At which, in the intense still noon, I stared with fascination.</p><p></p><p>And immediately I regretted it.</p><p>I thought how <span data-glossary-definition=\"petty, worthless\" role=\"link\" tabindex=\"0\">paltry</span>, how <span data-glossary-definition=\"crude\" role=\"link\" tabindex=\"0\">vulgar</span>, what a mean act!</p><p>I despised myself and the voices of my accursed human education.</p><p></p><p>And I thought of the <span data-glossary-definition=\"a reference to the poem “The Rime of the Ancient Mariner,” in which a sailor needlessly kills an albatross and is cursed for it\" role=\"link\" tabindex=\"0\">albatross</span>,</p><p>And I wished he would come back, my snake.</p><p></p><p>For he seemed to me again like a king,</p><p>Like a king in exile, uncrowned in the underworld,</p><p>Now due to be crowned again.</p><p></p><p>And so, I missed my chance with one of the lords</p><p>Of life.</p><p>And I have something to <span data-glossary-definition=\"to make amends for\" role=\"link\" tabindex=\"0\">expiate</span>:</p><p>A pettiness.</p>",
    sourceNote: "“Snake” by D. H. Lawrence—Public Domain",
    text: snakeNathanSMockShsatHardPassageText,
    versionLabel: "Nathan's Mock SHSAT (Hard)",
  }),
  questions: snakeNathanSMockShsatHardQuestions,
};
