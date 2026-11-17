import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theStormIsOverNathanSMockShsatHardPassageText = "The storm is over, the land hushes to rest:\nThe tyrannous wind, its strength fordone,\nIs fallen back in the west\nTo couch with the sinking sun.\nThe last clouds fare\nWith fainting speed, and their thin streamers fly\nIn melting drifts of the sky.\nAlready the birds in the air\nAppear again; the rooks return to their haunt,\nAnd one by one,\nProclaiming aloud their care,\nRenew their peaceful chant.\nTorn and shattered trees their branches again reset,\nThey trim afresh the fair\nFew green and golden leaves withheld from the storm,\nAnd awhile will be handsome yet.\nTo-morrow’s sun shall caress\nTheir remnant of loveliness:\nIn quiet days for a time\nSad Autumn lingering warm\nShall humour their faded prime.\nBut ah! the leaves of summer that lie on the ground!\nWhat havoc! The laughing timbrels of June,\nThat curtained the birds’ cradles, and screened their song,\nThat sheltered the cooing doves at noon,\nOf airy fans the delicate throng,—\nTorn and scattered around:\nFar out afield they lie,\nIn the watery furrows die,\nIn grassy pools of the flood they sink and drown,\nGreen-golden, orange, vermilion, golden and brown,\nThe high year’s flaunting crown\nShattered and trampled down.\nThe day is done: the tired land looks for night:\nShe prays to the night to keep\nIn peace her nerves of delight:\nWhile silver mist upstealeth silently,\nAnd the broad cloud-driving moon in the clear sky\nLifts o’er the firs her shining shield,\nAnd in her tranquil light\nSleep falls on forest and field.\nSee! sleep hath fallen: the trees are asleep:\nThe night is come. The land is wrapt in sleep.";

const theStormIsOverNathanSMockShsatHardQuestions: ExamQuestion[] = [
  {
    "id": "nmsh-storm-is-over-1",
    "explanation": "All three words describe weakening or fading. C is out-of-order: the grief comes later, at line 22. D is literal.",
    "explanationHtml": "<p>All three words describe weakening or fading. C is <em>out-of-order</em>: the grief comes later, at line 22. D is <em>literal</em>.</p>",
    "points": 1,
    "prompt": "In lines 5–7, the words “fainting,” “thin,” and “melting” contribute to the poem mainly by",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "suggesting that a new storm is forming in the distance."
      },
      {
        "id": "B",
        "text": "reinforcing the idea that the storm’s power is fading away."
      },
      {
        "id": "C",
        "text": "creating a mood of grief over the end of summer."
      },
      {
        "id": "D",
        "text": "describing how the clouds change color at sunset."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-2",
    "explanation": "“Care” here means their concerns or business, and “peaceful chant” rules out alarm. A and B are traps that read “care” as worry.",
    "explanationHtml": "<p>“Care” here means their concerns or business, and “peaceful chant” rules out alarm. A and B are traps that read “care” as worry.</p>",
    "points": 1,
    "prompt": "In line 11, the phrase “Proclaiming aloud their care” most likely suggests that the rooks are",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "warning other birds that the storm may return."
      },
      {
        "id": "B",
        "text": "mourning the nests that the storm destroyed."
      },
      {
        "id": "C",
        "text": "noisily going about their usual concerns as normal life resumes."
      },
      {
        "id": "D",
        "text": "calling for the sun to return."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-3",
    "explanation": "“Awhile” points to something temporary. C is the trap: it’s from the same section, but “caress” is hopeful, not about limits.",
    "explanationHtml": "<p>“Awhile” points to something temporary. C is the trap: it’s from the same section, but “caress” is hopeful, not about limits.</p>",
    "points": 1,
    "prompt": "Which phrase from lines 13–21 best suggests that the trees’ recovery will not last?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“their branches again reset” (line 13)"
      },
      {
        "id": "B",
        "text": "“They trim afresh the fair” (line 14)"
      },
      {
        "id": "C",
        "text": "“To-morrow’s sun shall caress” (line 17)"
      },
      {
        "id": "D",
        "text": "“And awhile will be handsome yet.” (line 16)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-4",
    "explanation": "“Sad” knows the end is coming, and “lingering warm” puts off the cold, as in “humour their faded prime.” C is reversed: the leaves are “faded,” not renewed.",
    "explanationHtml": "<p>“Sad” knows the end is coming, and “lingering warm” puts off the cold, as in “humour their faded prime.” C is <em>reversed</em>: the leaves are “faded,” not renewed.</p>",
    "points": 1,
    "prompt": "In line 20, Autumn is described as “Sad” yet “lingering warm.” These words suggest that Autumn",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "senses that the trees’ beauty is ending but holds off the cold out of kindness."
      },
      {
        "id": "B",
        "text": "regrets having caused the storm that damaged the trees."
      },
      {
        "id": "C",
        "text": "will help the trees grow new leaves before winter."
      },
      {
        "id": "D",
        "text": "is a season the speaker dislikes because it follows summer."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-5",
    "explanation": "Lines 24–26 say what the “timbrels” did (curtained cradles, sheltered doves), which only leaves can do. A is the trap because the birds are close by in the same lines.",
    "explanationHtml": "<p>Lines 24–26 say what the “timbrels” did (curtained cradles, sheltered doves), which only leaves can do. A is the trap because the birds are close by in the same lines.</p>",
    "points": 1,
    "prompt": "The phrase “laughing timbrels of June” (line 23) most likely refers to",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "the birds that sang in the trees during summer."
      },
      {
        "id": "B",
        "text": "the sound of rain striking the leaves during the storm."
      },
      {
        "id": "C",
        "text": "the summer leaves, which rustled and shimmered like tambourines."
      },
      {
        "id": "D",
        "text": "the cheerful festivals held in the countryside in June."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-6",
    "explanation": "The poem describes what the leaves were so their loss hits harder. C is outside-the-text: the poem never mentions next summer.",
    "explanationHtml": "<p>The poem describes what the leaves <em>were</em> so their loss hits harder. C is <em>outside-the-text</em>: the poem never mentions next summer.</p>",
    "points": 1,
    "prompt": "Lines 23–26 describe what the summer leaves once did, and lines 27–33 describe their present condition. This contrast mainly serves to",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "explain why the birds have returned to their haunts."
      },
      {
        "id": "B",
        "text": "emphasize that the leaves’ bright colors mattered more than their usefulness."
      },
      {
        "id": "C",
        "text": "suggest that the damage, though severe, will be repaired by next summer."
      },
      {
        "id": "D",
        "text": "deepen the sense of loss by recalling the leaves’ former life and purpose."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-7",
    "explanation": "“High year” is midsummer, and “flaunting” means showy. B is reversed: a crown marks the high point, not the end.",
    "explanationHtml": "<p>“High year” is midsummer, and “flaunting” means showy. B is <em>reversed</em>: a crown marks the high point, not the end.</p>",
    "points": 1,
    "prompt": "In line 32, the fallen leaves are called “The high year’s flaunting crown.” This metaphor suggests that the leaves were",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "the proud, showy glory of the year at its peak."
      },
      {
        "id": "B",
        "text": "a sign that the year was coming to an end."
      },
      {
        "id": "C",
        "text": "more valuable than the trees that produced them."
      },
      {
        "id": "D",
        "text": "a reward the year had earned by surviving earlier storms."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-8",
    "explanation": "“Caress… loveliness” versus “What havoc!… drown… trampled.” C is reversed: the fallen leaves get the list of colors.",
    "explanationHtml": "<p>“Caress… loveliness” versus “What havoc!… drown… trampled.” C is <em>reversed</em>: the fallen leaves get the list of colors.</p>",
    "points": 1,
    "prompt": "Which statement best describes how the speaker’s treatment of the surviving leaves (lines 13–21) differs from the treatment of the fallen leaves (lines 22–33)?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "The surviving leaves are described with anger, while the fallen leaves are described with calm acceptance."
      },
      {
        "id": "B",
        "text": "The surviving leaves are viewed with gentle hope, while the fallen leaves are mourned with intense emotion."
      },
      {
        "id": "C",
        "text": "The surviving leaves are described more vividly, with more colors and images."
      },
      {
        "id": "D",
        "text": "The surviving leaves are seen as weak, while the fallen leaves are praised for resisting the storm."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-9",
    "explanation": "“Delight” is joy, and “nerves” suggests it has been stretched thin. A is the trap: the land does want peace, but “delight” isn’t fear.",
    "explanationHtml": "<p>“Delight” is joy, and “nerves” suggests it has been stretched thin. A is the trap: the land does want peace, but “delight” isn’t fear.</p>",
    "points": 1,
    "prompt": "In lines 35–36, the land “prays to the night to keep / In peace her nerves of delight.” The phrase “nerves of delight” most likely refers to",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "the land’s fear that the storm will return."
      },
      {
        "id": "B",
        "text": "the moonlight beginning to spread across the fields."
      },
      {
        "id": "C",
        "text": "the birds that have returned to their nests."
      },
      {
        "id": "D",
        "text": "the land’s capacity for joy, which the storm has strained."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-10",
    "explanation": "“Sleep” builds to stillness that answers the opening “hushes to rest.” A is a trap that reads sleep as death. D gets the time wrong: the rooks returned in the evening.",
    "explanationHtml": "<p>“Sleep” builds to stillness that answers the opening “hushes to rest.” A is a trap that reads sleep as death. D gets the time wrong: the rooks returned in the evening.</p>",
    "points": 1,
    "prompt": "The repetition of “sleep” in lines 41–43 contributes to the poem’s conclusion mainly by",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "suggesting that the land will never recover from the storm."
      },
      {
        "id": "B",
        "text": "emphasizing the speaker’s own exhaustion."
      },
      {
        "id": "C",
        "text": "creating a sense of complete calm that resolves the turmoil of the storm."
      },
      {
        "id": "D",
        "text": "contrasting the quiet night with the noisy birds of the morning."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-storm-is-over-tei",
    "skilled": "TBD",
    "explanation": "The surviving leaves will be “handsome yet,” and tomorrow’s sun “shall caress” them, which is a hopeful view. Starting with “But ah!” in line 22, the speaker grieves for the fallen leaves (“What havoc!”… “Shattered and trampled down”). The birds return in lines 8–12, not in this section.",
    "points": 1,
    "prompt": "Complete the sentence to describe how the speaker’s attitude shifts between two parts of the poem.",
    "promptHtml": "<p>Complete the sentence to describe how the speaker’s attitude shifts between two parts of the poem.</p>",
    "dropdownContentHtml": "<p>In lines 13–21, the speaker views the surviving leaves with {{dropdown-1}}, but in lines 22–33, the speaker {{dropdown-2}}.</p>",
    "topic": "Text Structure & Purpose",
    "dropdownContent": [
      "In lines 13–21, the speaker views the surviving leaves with {{dropdown-1}}, but in lines 22–33, the speaker {{dropdown-2}}."
    ],
    "dropdowns": [
      {
        "correctChoiceId": "option-1",
        "id": "dropdown-1",
        "options": [
          {
            "id": "option-1",
            "text": "gentle hope"
          },
          {
            "id": "option-2",
            "text": "bitter anger"
          },
          {
            "id": "option-3",
            "text": "quiet fear"
          },
          {
            "id": "option-4",
            "text": "careless indifference"
          }
        ]
      },
      {
        "correctChoiceId": "option-3",
        "id": "dropdown-2",
        "options": [
          {
            "id": "option-1",
            "text": "celebrates the power of the storm"
          },
          {
            "id": "option-2",
            "text": "looks forward to the coming winter"
          },
          {
            "id": "option-3",
            "text": "mourns the destroyed summer leaves"
          },
          {
            "id": "option-4",
            "text": "describes the return of the birds"
          }
        ]
      }
    ],
    "type": "inline_dropdown"
  }
];

export const theStormIsOverNathanSMockShsatHardPassageSet: ExamPassageSet = {
  id: "ela-the-storm-is-over-nathan-s-mock-shsat-hard",
  versionLabels: ["Nathan's Mock SHSAT (Hard)"],
  section: "reading",
  questionCount: theStormIsOverNathanSMockShsatHardQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createPlainTextPassage({
    id: "the-storm-is-over-nathan-s-mock-shsat-hard",
    title: "The Storm Is Over",
    author: "Robert Bridges",
    passageType: "poem",
    passageCategory: "miscellaneous",
    richText: "<p>The storm is over, the land hushes to rest:</p><p>The <span data-glossary-definition=\"cruel, harshly powerful\" role=\"link\" tabindex=\"0\">tyrannous</span> wind, its strength <span data-glossary-definition=\"used up, exhausted\" role=\"link\" tabindex=\"0\">fordone</span>,</p><p>Is fallen back in the west</p><p>To <span data-glossary-definition=\"lie down to rest\" role=\"link\" tabindex=\"0\">couch</span> with the sinking sun.</p><p>The last clouds <span data-glossary-definition=\"travel\" role=\"link\" tabindex=\"0\">fare</span></p><p>With fainting speed, and their thin streamers fly</p><p>In melting drifts of the sky.</p><p>Already the birds in the air</p><p>Appear again; the <span data-glossary-definition=\"large black birds related to crows\" role=\"link\" tabindex=\"0\">rooks</span> return to their <span data-glossary-definition=\"a place often visited\" role=\"link\" tabindex=\"0\">haunt</span>,</p><p>And one by one,</p><p>Proclaiming aloud their care,</p><p>Renew their peaceful chant.</p><p>Torn and shattered trees their branches again reset,</p><p>They trim afresh the fair</p><p>Few green and golden leaves withheld from the storm,</p><p>And awhile will be handsome yet.</p><p>To-morrow’s sun shall caress</p><p>Their remnant of loveliness:</p><p>In quiet days for a time</p><p>Sad Autumn lingering warm</p><p>Shall <span data-glossary-definition=\"to treat kindly, indulge\" role=\"link\" tabindex=\"0\">humour</span> their faded <span data-glossary-definition=\"best time\" role=\"link\" tabindex=\"0\">prime</span>.</p><p>But ah! the leaves of summer that lie on the ground!</p><p>What havoc! The laughing <span data-glossary-definition=\"tambourines\" role=\"link\" tabindex=\"0\">timbrels</span> of June,</p><p>That curtained the birds’ cradles, and screened their song,</p><p>That sheltered the cooing doves at noon,</p><p>Of airy fans the delicate throng,—</p><p>Torn and scattered around:</p><p>Far out afield they lie,</p><p>In the watery <span data-glossary-definition=\"grooves plowed in a field\" role=\"link\" tabindex=\"0\">furrows</span> die,</p><p>In grassy pools of the flood they sink and drown,</p><p>Green-golden, orange, <span data-glossary-definition=\"bright red\" role=\"link\" tabindex=\"0\">vermilion</span>, golden and brown,</p><p>The high year’s <span data-glossary-definition=\"showy\" role=\"link\" tabindex=\"0\">flaunting</span> crown</p><p>Shattered and trampled down.</p><p>The day is done: the tired land looks for night:</p><p>She prays to the night to keep</p><p>In peace her nerves of delight:</p><p>While silver mist <span data-glossary-definition=\"creeps upward\" role=\"link\" tabindex=\"0\">upstealeth</span> silently,</p><p>And the broad cloud-driving moon in the clear sky</p><p>Lifts o’er the <span data-glossary-definition=\"evergreen trees\" role=\"link\" tabindex=\"0\">firs</span> her shining shield,</p><p>And in her tranquil light</p><p>Sleep falls on forest and field.</p><p>See! sleep hath fallen: the trees are asleep:</p><p>The night is come. The land is <span data-glossary-definition=\"wrapped\" role=\"link\" tabindex=\"0\">wrapt</span> in sleep.</p>",
    sourceNote: "“The storm is over, the land hushes to rest” by Robert Bridges—Public Domain",
    text: theStormIsOverNathanSMockShsatHardPassageText,
    versionLabel: "Nathan's Mock SHSAT (Hard)",
  }),
  questions: theStormIsOverNathanSMockShsatHardQuestions,
};
