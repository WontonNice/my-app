import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theStormIsOverNathanSMockShsatPassageText = "The storm is over, the land hushes to rest:\nThe tyrannous wind, its strength fordone,\nIs fallen back in the west\nTo couch with the sinking sun.\nThe last clouds fare\nWith fainting speed, and their thin streamers fly\nIn melting drifts of the sky.\nAlready the birds in the air\nAppear again; the rooks return to their haunt,\nAnd one by one,\nProclaiming aloud their care,\nRenew their peaceful chant.\nTorn and shattered trees their branches again reset,\nThey trim afresh the fair\nFew green and golden leaves withheld from the storm,\nAnd awhile will be handsome yet.\nTo-morrow’s sun shall caress\nTheir remnant of loveliness:\nIn quiet days for a time\nSad Autumn lingering warm\nShall humour their faded prime.\nBut ah! the leaves of summer that lie on the ground!\nWhat havoc! The laughing timbrels of June,\nThat curtained the birds’ cradles, and screened their song,\nThat sheltered the cooing doves at noon,\nOf airy fans the delicate throng,—\nTorn and scattered around:\nFar out afield they lie,\nIn the watery furrows die,\nIn grassy pools of the flood they sink and drown,\nGreen-golden, orange, vermilion, golden and brown,\nThe high year’s flaunting crown\nShattered and trampled down.\nThe day is done: the tired land looks for night:\nShe prays to the night to keep\nIn peace her nerves of delight:\nWhile silver mist upstealeth silently,\nAnd the broad cloud-driving moon in the clear sky\nLifts o’er the firs her shining shield,\nAnd in her tranquil light\nSleep falls on forest and field.\nSee! sleep hath fallen: the trees are asleep:\nThe night is come. The land is wrapt in sleep.";

const theStormIsOverNathanSMockShsatQuestions: ExamQuestion[] = [
  {
    "id": "nms-storm-is-over-1",
    "explanation": "The wind’s “strength [is] fordone,” and it lies down (“couch”) with the setting sun. D is a trap: lying down with the sun isn’t the same as being beaten by it. A ignores “The storm is over.”",
    "points": 1,
    "prompt": "In lines 2–4, the description of the wind mainly creates an image of",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "a dangerous force that is waiting to return."
      },
      {
        "id": "B",
        "text": "a powerful force that has worn itself out and gone to rest."
      },
      {
        "id": "C",
        "text": "a gentle breeze that cools the land at sunset."
      },
      {
        "id": "D",
        "text": "a force that the sun has defeated in battle."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-2",
    "explanation": "The birds “appear again,” “return” and “renew their peaceful chant.” C misreads “care” as worry about another storm. Nothing in the lines suggests one is coming.",
    "points": 1,
    "prompt": "Lines 8–12 contribute to the poem mainly by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "showing that ordinary life is returning now that the storm has passed."
      },
      {
        "id": "B",
        "text": "contrasting the noisy birds with the silent, damaged trees."
      },
      {
        "id": "C",
        "text": "suggesting that the birds are warning one another about another storm."
      },
      {
        "id": "D",
        "text": "explaining why the rooks had abandoned their haunt."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-3",
    "explanation": "The trees “reset” their branches and “trim afresh” their leaves, the way someone would straighten up after a struggle. A is wrong because the leaves were “withheld from the storm,” so nothing new is growing.",
    "points": 1,
    "prompt": "In lines 13–16, the trees are described as if they were",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "gardeners planting new growth to replace what was damaged."
      },
      {
        "id": "B",
        "text": "mourners grieving for the leaves they have lost."
      },
      {
        "id": "C",
        "text": "soldiers preparing for another battle."
      },
      {
        "id": "D",
        "text": "people tidying their appearance after a struggle."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-4",
    "explanation": "The leaves get a “remnant of loveliness” for “a time,” in their “faded prime.” D contradicts “for a time.” B misreads “caress,” which is gentle.",
    "points": 1,
    "prompt": "Read lines 17–21.\n\nTo-morrow’s sun shall caress\nTheir remnant of loveliness:\nIn quiet days for a time\nSad Autumn lingering warm\nShall humour their faded prime.\n\nThese lines suggest that the leaves that survived the storm",
    "promptHtml": "<p>Read lines 17–21.</p><blockquote><strong>To-morrow’s sun shall caress<br>Their remnant of loveliness:<br>In quiet days for a time<br>Sad Autumn lingering warm<br>Shall humour their faded prime.</strong></blockquote><p>These lines suggest that the leaves that survived the storm</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "will enjoy a brief period of beauty before they fade."
      },
      {
        "id": "B",
        "text": "will be harmed by the heat of the next day’s sun."
      },
      {
        "id": "C",
        "text": "are more beautiful than the summer leaves had been."
      },
      {
        "id": "D",
        "text": "will remain on the trees through the winter."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-5",
    "explanation": "“But ah!” turns from the surviving leaves to the fallen ones (“What havoc!”). D describes line 34, not line 22.",
    "points": 1,
    "prompt": "How does line 22 contribute to the structure of the poem?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It shifts from what survived the storm to a lament for what was lost."
      },
      {
        "id": "B",
        "text": "It introduces the storm that the rest of the poem describes."
      },
      {
        "id": "C",
        "text": "It returns to the image of the wind from the opening lines."
      },
      {
        "id": "D",
        "text": "It marks the change from evening to night."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-6",
    "explanation": "“Laughing” shows their liveliness, and lines 24–25 show they sheltered birds. C is a trap: the leaves protected the birds, but they aren’t being compared to them.",
    "points": 1,
    "prompt": "In lines 23–26, the poet calls the summer leaves “laughing timbrels of June” and “airy fans” mainly to",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "suggest that the leaves were never strong enough to survive."
      },
      {
        "id": "B",
        "text": "emphasize the liveliness and usefulness the leaves once had."
      },
      {
        "id": "C",
        "text": "compare the leaves to the birds that nested among them."
      },
      {
        "id": "D",
        "text": "describe the sound the leaves made as the storm tore them away."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-7",
    "explanation": "It ends the lament with images of ruin. B and A are about recovery, and D is about the peaceful night.",
    "points": 1,
    "prompt": "Which line best conveys the speaker’s sense of loss over the destruction of the summer leaves?",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "text": "“Renew their peaceful chant.” (line 12)"
      },
      {
        "id": "B",
        "text": "“And awhile will be handsome yet.” (line 16)"
      },
      {
        "id": "C",
        "text": "“Shattered and trampled down.” (line 33)"
      },
      {
        "id": "D",
        "text": "“Lifts o’er the firs her shining shield,” (line 39)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-8",
    "explanation": "The “tired land” prays for peace. A is wrong because the storm is over. B and D give the land feelings the lines don’t show.",
    "points": 1,
    "prompt": "In lines 34–36, the land is personified mainly to convey",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "its fear that the storm will return during the night."
      },
      {
        "id": "B",
        "text": "its anger at the damage the storm has caused."
      },
      {
        "id": "C",
        "text": "its exhaustion and its longing for peace after the storm."
      },
      {
        "id": "D",
        "text": "its pride at having survived the storm."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-9",
    "explanation": "A shield protects. The moon’s light is “tranquil,” and the scene is one of sleep, not battle, so D is wrong.",
    "points": 1,
    "prompt": "The image of the moon lifting “her shining shield” (line 39) suggests that the moon",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "reflects the colors of the fallen leaves."
      },
      {
        "id": "B",
        "text": "protects the land as it rests."
      },
      {
        "id": "C",
        "text": "hides itself behind the clouds."
      },
      {
        "id": "D",
        "text": "prepares to battle the returning wind."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-storm-is-over-10",
    "explanation": "The poem moves from aftermath (lines 1–21) to lament (lines 22–33) to nightfall (lines 34–43). A is wrong because the poem opens after the storm is already over.",
    "points": 1,
    "prompt": "Which statement best describes the overall structure of the poem?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It describes a storm’s arrival, its most violent moment, and its slow retreat."
      },
      {
        "id": "B",
        "text": "It moves from the calm after a storm, to a lament for the storm’s damage, to the peace of nightfall."
      },
      {
        "id": "C",
        "text": "It moves from night to morning as the land slowly recovers."
      },
      {
        "id": "D",
        "text": "It compares a summer storm with an autumn storm."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const theStormIsOverNathanSMockShsatPassageSet: ExamPassageSet = {
  id: "ela-the-storm-is-over-nathan-s-mock-shsat",
  versionLabels: ["Nathan's Mock SHSAT"],
  section: "reading",
  questionCount: theStormIsOverNathanSMockShsatQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createPlainTextPassage({
    id: "the-storm-is-over-nathan-s-mock-shsat",
    title: "The Storm Is Over",
    author: "Robert Bridges",
    passageType: "poem",
    passageCategory: "miscellaneous",
    richText: "<p>The storm is over, the land hushes to rest:</p><p>The <span data-glossary-definition=\"cruel, harshly powerful\" role=\"link\" tabindex=\"0\">tyrannous</span> wind, its strength <span data-glossary-definition=\"used up, exhausted\" role=\"link\" tabindex=\"0\">fordone</span>,</p><p>Is fallen back in the west</p><p>To <span data-glossary-definition=\"lie down to rest\" role=\"link\" tabindex=\"0\">couch</span> with the sinking sun.</p><p>The last clouds <span data-glossary-definition=\"travel\" role=\"link\" tabindex=\"0\">fare</span></p><p>With fainting speed, and their thin streamers fly</p><p>In melting drifts of the sky.</p><p>Already the birds in the air</p><p>Appear again; the <span data-glossary-definition=\"large black birds related to crows\" role=\"link\" tabindex=\"0\">rooks</span> return to their <span data-glossary-definition=\"a place often visited\" role=\"link\" tabindex=\"0\">haunt</span>,</p><p>And one by one,</p><p>Proclaiming aloud their care,</p><p>Renew their peaceful chant.</p><p>Torn and shattered trees their branches again reset,</p><p>They trim afresh the fair</p><p>Few green and golden leaves withheld from the storm,</p><p>And awhile will be handsome yet.</p><p>To-morrow’s sun shall caress</p><p>Their remnant of loveliness:</p><p>In quiet days for a time</p><p>Sad Autumn lingering warm</p><p>Shall <span data-glossary-definition=\"to treat kindly, indulge\" role=\"link\" tabindex=\"0\">humour</span> their faded <span data-glossary-definition=\"best time\" role=\"link\" tabindex=\"0\">prime</span>.</p><p>But ah! the leaves of summer that lie on the ground!</p><p>What havoc! The laughing <span data-glossary-definition=\"tambourines\" role=\"link\" tabindex=\"0\">timbrels</span> of June,</p><p>That curtained the birds’ cradles, and screened their song,</p><p>That sheltered the cooing doves at noon,</p><p>Of airy fans the delicate throng,—</p><p>Torn and scattered around:</p><p>Far out afield they lie,</p><p>In the watery <span data-glossary-definition=\"grooves plowed in a field\" role=\"link\" tabindex=\"0\">furrows</span> die,</p><p>In grassy pools of the flood they sink and drown,</p><p>Green-golden, orange, <span data-glossary-definition=\"bright red\" role=\"link\" tabindex=\"0\">vermilion</span>, golden and brown,</p><p>The high year’s <span data-glossary-definition=\"showy\" role=\"link\" tabindex=\"0\">flaunting</span> crown</p><p>Shattered and trampled down.</p><p>The day is done: the tired land looks for night:</p><p>She prays to the night to keep</p><p>In peace her nerves of delight:</p><p>While silver mist <span data-glossary-definition=\"creeps upward\" role=\"link\" tabindex=\"0\">upstealeth</span> silently,</p><p>And the broad cloud-driving moon in the clear sky</p><p>Lifts o’er the <span data-glossary-definition=\"evergreen trees\" role=\"link\" tabindex=\"0\">firs</span> her shining shield,</p><p>And in her tranquil light</p><p>Sleep falls on forest and field.</p><p>See! sleep hath fallen: the trees are asleep:</p><p>The night is come. The land is <span data-glossary-definition=\"wrapped\" role=\"link\" tabindex=\"0\">wrapt</span> in sleep.</p>",
    sourceNote: "“The storm is over, the land hushes to rest” by Robert Bridges—Public Domain",
    text: theStormIsOverNathanSMockShsatPassageText,
    versionLabel: "Nathan's Mock SHSAT",
  }),
  questions: theStormIsOverNathanSMockShsatQuestions,
};
