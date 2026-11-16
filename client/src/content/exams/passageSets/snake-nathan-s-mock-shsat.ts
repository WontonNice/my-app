import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const snakeNathanSMockShsatPassageText = "A snake came to my water-trough\nOn a hot, hot day, and I in pyjamas for the heat,\nTo drink there.\n\nIn the deep, strange-scented shade of the great dark carob tree\nI came down the steps with my pitcher\nAnd must wait, must stand and wait, for there he was at the trough before me.\n\nHe reached down from a fissure in the earth-wall in the gloom\nAnd trailed his yellow-brown slackness soft-bellied down, over the edge of the stone trough\nAnd rested his throat upon the stone bottom,\nAnd where the water had dripped from the tap, in a small clearness,\nHe sipped with his straight mouth,\nSoftly drank through his straight gums, into his slack long body,\nSilently.\n\nSomeone was before me at my water-trough,\nAnd I, like a second-comer, waiting.\n\nHe lifted his head from his drinking, as cattle do,\nAnd looked at me vaguely, as drinking cattle do,\nAnd flickered his two-forked tongue from his lips, and mused a moment,\nAnd stooped and drank a little more,\nBeing earth-brown, earth-golden from the burning bowels of the earth\nOn the day of Sicilian July, with Etna smoking.\n\nThe voice of my education said to me\nHe must be killed,\nFor in Sicily the black, black snakes are innocent, the gold are venomous.\n\nAnd voices in me said, If you were a man\nYou would take a stick and break him now, and finish him off.\n\nBut must I confess how I liked him,\nHow glad I was he had come like a guest in quiet, to drink at my water-trough\nAnd depart peaceful, pacified, and thankless,\nInto the burning bowels of this earth?\n\nWas it cowardice, that I dared not kill him?\nWas it perversity, that I longed to talk to him?\nWas it humility, to feel so honoured?\nI felt so honoured.\n\nAnd yet those voices:\nIf you were not afraid, you would kill him!\n\nAnd truly I was afraid, I was most afraid,\nBut even so, honoured still more\nThat he should seek my hospitality\nFrom out the dark door of the secret earth.\n\nHe drank enough\nAnd lifted his head, dreamily, as one who has drunken,\nAnd flickered his tongue like a forked night on the air, so black,\nSeeming to lick his lips,\nAnd looked around like a god, unseeing, into the air,\nAnd slowly turned his head,\nAnd slowly, very slowly, as if thrice adream,\nProceeded to draw his slow length curving round\nAnd climb again the broken bank of my wall-face.\n\nAnd as he put his head into that dreadful hole,\nAnd as he slowly drew up, snake-easing his shoulders, and entered farther,\nA sort of horror, a sort of protest against his withdrawing into that horrid black hole,\nDeliberately going into the blackness, and slowly drawing himself after,\nOvercame me now his back was turned.\n\nI looked round, I put down my pitcher,\nI picked up a clumsy log\nAnd threw it at the water-trough with a clatter.\n\nI think it did not hit him,\nBut suddenly that part of him that was left behind convulsed in an undignified haste,\nWrithed like lightning, and was gone\nInto the black hole, the earth-lipped fissure in the wall-front,\nAt which, in the intense still noon, I stared with fascination.\n\nAnd immediately I regretted it.\nI thought how paltry, how vulgar, what a mean act!\nI despised myself and the voices of my accursed human education.\n\nAnd I thought of the albatross,\nAnd I wished he would come back, my snake.\n\nFor he seemed to me again like a king,\nLike a king in exile, uncrowned in the underworld,\nNow due to be crowned again.\n\nAnd so, I missed my chance with one of the lords\nOf life.\nAnd I have something to expiate:\nA pettiness.";

const snakeNathanSMockShsatQuestions: ExamQuestion[] = [
  {
    "id": "nms-snake-1",
    "explanation": "“Someone was before me” treats the snake like a person who got there first, and the speaker waits his turn. A is wrong because he never shows resentment. The waiting is courtesy, not fear, so B is wrong too.",
    "points": 1,
    "prompt": "In lines 14–15, the speaker’s description of himself as “a second-comer, waiting” suggests that he",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "resents having to wait for an animal to finish drinking."
      },
      {
        "id": "B",
        "text": "is too frightened to approach the water-trough."
      },
      {
        "id": "C",
        "text": "accepts that the snake has a rightful claim to the water."
      },
      {
        "id": "D",
        "text": "arrived late because the heat made him move slowly."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-2",
    "explanation": "Cattle drinking is a peaceful, ordinary image. A reads “vaguely” as a sign of stupidity. B isn’t supported, since the snake comes “from the burning bowels of the earth,” not from a farm.",
    "points": 1,
    "prompt": "In lines 16–17, the comparison of the snake to drinking cattle mainly serves to",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "suggest that the snake is slow and unintelligent."
      },
      {
        "id": "B",
        "text": "show that the snake is tame and used to people."
      },
      {
        "id": "C",
        "text": "present the snake as calm and unthreatening."
      },
      {
        "id": "D",
        "text": "emphasize the snake’s large size."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-3",
    "explanation": "“Education” means beliefs he was taught, and “If you were a man” points to what society expects. B is the main trap: the poem sets these voices against his own instinct, which is to like the snake.",
    "points": 1,
    "prompt": "In lines 22–26, “the voice of my education” and the “voices in me” mainly represent",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "memories of a time when the speaker was bitten by a snake."
      },
      {
        "id": "B",
        "text": "the speaker’s natural instinct that the snake is dangerous."
      },
      {
        "id": "C",
        "text": "warnings from other people who are watching the snake."
      },
      {
        "id": "D",
        "text": "beliefs the speaker has learned from society about how he should act."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-4",
    "explanation": "He weighs cowardice, perversity and humility, then says simply “I felt so honoured.” B and A get the audience of the questions wrong, and C is the opposite.",
    "points": 1,
    "prompt": "How do the questions in lines 31–33 contribute to the development of the poem?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "They challenge the reader to defend the snake."
      },
      {
        "id": "B",
        "text": "They show the speaker demanding an explanation from the snake."
      },
      {
        "id": "C",
        "text": "They reveal that the speaker has already decided to kill the snake."
      },
      {
        "id": "D",
        "text": "They show the speaker struggling to understand his own conflicting feelings."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-5",
    "explanation": "“Like a god” shows reverence directly. B shows fear, not reverence, and A and D are neutral details.",
    "points": 1,
    "prompt": "Which line best supports the idea that the speaker views the snake with reverence?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“He sipped with his straight mouth,” (line 11)"
      },
      {
        "id": "B",
        "text": "“And truly I was afraid, I was most afraid,” (line 37)"
      },
      {
        "id": "C",
        "text": "“And looked around like a god, unseeing, into the air,” (line 45)"
      },
      {
        "id": "D",
        "text": "“I picked up a clumsy log” (line 56)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-6",
    "explanation": "“A sort of horror, a sort of protest… overcame me.” C is wrong because the snake is turned away from him. D is wrong because the snake has already “drunk enough.” B isn’t stated, and he regrets the act right away.",
    "points": 1,
    "prompt": "Lines 50–54 suggest that the speaker throws the log mainly because he",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "is suddenly overcome by horror as the snake withdraws into the darkness."
      },
      {
        "id": "B",
        "text": "has finally been convinced that the snake is venomous."
      },
      {
        "id": "C",
        "text": "sees the snake preparing to strike at him."
      },
      {
        "id": "D",
        "text": "wants to stop the snake from drinking more of his water."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-7",
    "explanation": "Before this, the snake moves “slowly,” “dreamily,” “like a god.” Now it moves in “undignified haste.” A contradicts “I think it did not hit him.”",
    "points": 1,
    "prompt": "The description of the snake in line 59 (“convulsed in an undignified haste”) contrasts with earlier descriptions of the snake mainly by",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "revealing that the log has wounded the snake."
      },
      {
        "id": "B",
        "text": "suggesting that the snake had only been pretending to be calm."
      },
      {
        "id": "C",
        "text": "proving that the snake was dangerous all along."
      },
      {
        "id": "D",
        "text": "showing that the speaker’s act has destroyed the snake’s calm, dignified manner."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-8",
    "explanation": "Like the sailor in the Coleridge poem, he struck at a creature for no reason, and that is what he feels he must “expiate.” The other choices don’t match the allusion.",
    "points": 1,
    "prompt": "The reference to the albatross in line 66 suggests that the speaker",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "wishes that he could escape as easily as the snake did."
      },
      {
        "id": "B",
        "text": "fears he has needlessly harmed a creature and will suffer for it."
      },
      {
        "id": "C",
        "text": "realizes that snakes and birds are natural enemies."
      },
      {
        "id": "D",
        "text": "expects the snake to return and take revenge."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-9",
    "explanation": "He “missed [his] chance” with a royal, lordly creature, and he blames his own pettiness. C is wrong because “I wished he would come back” shows longing, not fear. B is wrong because he isn’t relieved.",
    "points": 1,
    "prompt": "In lines 68–72, the speaker’s description of the snake as “a king in exile” and “one of the lords / Of life” mainly conveys his belief that",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "the snake deserved an honor and respect that he failed to give it."
      },
      {
        "id": "B",
        "text": "he is relieved that such a powerful creature has left."
      },
      {
        "id": "C",
        "text": "the snake will return to punish him."
      },
      {
        "id": "D",
        "text": "the snake ruled over the other animals in the area."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-snake-10",
    "explanation": "He’s honored (lines 27–40), throws the log (lines 55–57), then regrets it (lines 63–74). D leaves out the attack, and C leaves out the regret.",
    "points": 1,
    "prompt": "Which statement best describes how the speaker’s attitude changes over the course of the poem?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "He moves from hatred of the snake to admiration of its courage."
      },
      {
        "id": "B",
        "text": "He moves from honoring the snake, to acting against it out of learned fear, to regretting his own pettiness."
      },
      {
        "id": "C",
        "text": "He moves from calm, to anger, to relief that the snake is gone."
      },
      {
        "id": "D",
        "text": "He moves from fear of the snake, to curiosity about it, to friendship with it."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const snakeNathanSMockShsatPassageSet: ExamPassageSet = {
  id: "ela-snake-nathan-s-mock-shsat",
  versionLabels: ["Nathan's Mock SHSAT"],
  section: "reading",
  questionCount: snakeNathanSMockShsatQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createPlainTextPassage({
    id: "snake-nathan-s-mock-shsat",
    title: "Snake",
    author: "D. H. Lawrence",
    passageType: "poem",
    passageCategory: "miscellaneous",
    richText: "<p>A snake came to my water-trough</p><p>On a hot, hot day, and I in pyjamas for the heat,</p><p>To drink there.</p><p></p><p>In the deep, strange-scented shade of the great dark <span data-glossary-definition=\"a Mediterranean tree\" role=\"link\" tabindex=\"0\">carob</span> tree</p><p>I came down the steps with my pitcher</p><p>And must wait, must stand and wait, for there he was at the trough before me.</p><p></p><p>He reached down from a <span data-glossary-definition=\"a narrow crack\" role=\"link\" tabindex=\"0\">fissure</span> in the earth-wall in the gloom</p><p>And trailed his yellow-brown slackness soft-bellied down, over the edge of the stone trough</p><p>And rested his throat upon the stone bottom,</p><p>And where the water had dripped from the tap, in a small clearness,</p><p>He sipped with his straight mouth,</p><p>Softly drank through his straight gums, into his slack long body,</p><p>Silently.</p><p></p><p>Someone was before me at my water-trough,</p><p>And I, like a second-comer, waiting.</p><p></p><p>He lifted his head from his drinking, as cattle do,</p><p>And looked at me vaguely, as drinking cattle do,</p><p>And flickered his two-forked tongue from his lips, and mused a moment,</p><p>And stooped and drank a little more,</p><p>Being earth-brown, earth-golden from the burning bowels of the earth</p><p>On the day of Sicilian July, with <span data-glossary-definition=\"an active volcano in Sicily\" role=\"link\" tabindex=\"0\">Etna</span> smoking.</p><p></p><p>The voice of my education said to me</p><p>He must be killed,</p><p>For in Sicily the black, black snakes are innocent, the gold are venomous.</p><p></p><p>And voices in me said, If you were a man</p><p>You would take a stick and break him now, and finish him off.</p><p></p><p>But must I confess how I liked him,</p><p>How glad I was he had come like a guest in quiet, to drink at my water-trough</p><p>And depart peaceful, pacified, and thankless,</p><p>Into the burning bowels of this earth?</p><p></p><p>Was it cowardice, that I dared not kill him?</p><p>Was it <span data-glossary-definition=\"a desire to do the opposite of what is expected\" role=\"link\" tabindex=\"0\">perversity</span>, that I longed to talk to him?</p><p>Was it humility, to feel so honoured?</p><p>I felt so honoured.</p><p></p><p>And yet those voices:</p><p>If you were not afraid, you would kill him!</p><p></p><p>And truly I was afraid, I was most afraid,</p><p>But even so, honoured still more</p><p>That he should seek my hospitality</p><p>From out the dark door of the secret earth.</p><p></p><p>He drank enough</p><p>And lifted his head, dreamily, as one who has drunken,</p><p>And flickered his tongue like a forked night on the air, so black,</p><p>Seeming to lick his lips,</p><p>And looked around like a god, unseeing, into the air,</p><p>And slowly turned his head,</p><p>And slowly, very slowly, as if <span data-glossary-definition=\"deeply dreamy\" role=\"link\" tabindex=\"0\">thrice adream</span>,</p><p>Proceeded to draw his slow length curving round</p><p>And climb again the broken bank of my wall-face.</p><p></p><p>And as he put his head into that dreadful hole,</p><p>And as he slowly drew up, snake-easing his shoulders, and entered farther,</p><p>A sort of horror, a sort of protest against his withdrawing into that horrid black hole,</p><p>Deliberately going into the blackness, and slowly drawing himself after,</p><p>Overcame me now his back was turned.</p><p></p><p>I looked round, I put down my pitcher,</p><p>I picked up a clumsy log</p><p>And threw it at the water-trough with a clatter.</p><p></p><p>I think it did not hit him,</p><p>But suddenly that part of him that was left behind convulsed in an undignified haste,</p><p>Writhed like lightning, and was gone</p><p>Into the black hole, the earth-lipped fissure in the wall-front,</p><p>At which, in the intense still noon, I stared with fascination.</p><p></p><p>And immediately I regretted it.</p><p>I thought how <span data-glossary-definition=\"petty, worthless\" role=\"link\" tabindex=\"0\">paltry</span>, how <span data-glossary-definition=\"crude\" role=\"link\" tabindex=\"0\">vulgar</span>, what a mean act!</p><p>I despised myself and the voices of my accursed human education.</p><p></p><p>And I thought of the <span data-glossary-definition=\"a reference to the poem “The Rime of the Ancient Mariner,” in which a sailor needlessly kills an albatross and is cursed for it\" role=\"link\" tabindex=\"0\">albatross</span>,</p><p>And I wished he would come back, my snake.</p><p></p><p>For he seemed to me again like a king,</p><p>Like a king in exile, uncrowned in the underworld,</p><p>Now due to be crowned again.</p><p></p><p>And so, I missed my chance with one of the lords</p><p>Of life.</p><p>And I have something to <span data-glossary-definition=\"to make amends for\" role=\"link\" tabindex=\"0\">expiate</span>:</p><p>A pettiness.</p>",
    sourceNote: "“Snake” by D. H. Lawrence—Public Domain",
    text: snakeNathanSMockShsatPassageText,
    versionLabel: "Nathan's Mock SHSAT",
  }),
  questions: snakeNathanSMockShsatQuestions,
};
