import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const crossPurposesFormBPassageText = "What I am is built: concrete and steel.\n\nI defy gravity. I am what every athlete\n\nwants: to remain at the apex of the leap,\n\nup in the air. And yet I am useful, too:\n\ncars, trucks, people, even trains\n\nmake their way across my broad back.\n\nSwallows and ospreys1 nest in my trusses.\n\n\n\n\n                        What I am is motion. I am water, and I am older\n\n                        than anything else you know. No human\n\n                        built me. I am gravity’s best friend; I pool\n\n                        and flow wherever gravity takes me.\n\n                        I am the blood flowing in the runner’s chest,\n\n                        and I catch everything: from the hills,\n\n                        the mountains. It all washes down through me.\n\n\n\n\nWhat you are is an accident,\n\nwhat happens to rain when rain gives in\n\nto Earth’s gravitational pull.\n\nYou are some tears dribbling from a mountain’s\n\neye, running down the pavements\n\nof small towns, into the cities, to the sea.\n\nYou are the path of least resistance.\n\n\n\n\n                        What I am is power. You, of course,\n\n                        have none: you are a static lump, an artifact\n\n                        slowly decaying. But my regal flow\n\n                        nourishes grasses, permits empires to rise.\n\n                        Those who made you will break you,\n\n                        in time, replacing you with yet another\n\n                        clumsy structure. I have seen. I know.\n\n\n\n\n“Clumsy”? Being rebuilt makes me\n\na friend of time, does it not? And it means\n\nthat I have siblings—those “clumsy” structures,\n\nmy sisters and brothers.\n\nWe stitch across the rip you make.\n\nWe are steel thread to the human needle.\n\nWe bind you up. We sew you.\n\n\n\n\n                        And I sow into you; in every cranny\n\n                        of your superstructure my vapors cling.\n\n                        They bring out your softness, your rust.\n\n                        Boast your best, and boast better yet.\n\n                        I am listening to the bright hum\n\n                        of the wind in your wires. Because I am,\n\n                        above all else, patient. I will wait for you.\n\n\n\n\n1ospreys: large birds";

const crossPurposesFormBQuestions: ExamQuestion[] = [
  {
    "id": "cross-purposes-form-b-1",
    "points": 1,
    "prompt": "How does the similar construction of the sentence in line 1 and the sentence in line 8 contribute to the meaning of the poem?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It introduces the intended permanence of the structure and the ever-changing fluidity of the water."
      },
      {
        "id": "B",
        "text": "It shows that the structure can bridge the gap caused by the water."
      },
      {
        "id": "C",
        "text": "It suggests that the inflexible structure has more limitations than the adaptable water does."
      },
      {
        "id": "D",
        "text": "It contrasts the stability of the structure with the instability of the water."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "cross-purposes-form-b-2",
    "points": 1,
    "prompt": "Read lines 2–4 and lines 12–14 from the poem.\n\nI am what every athlete\nwants: to remain at the apex of the leap,\nup in the air.\n\nI am the blood flowing in the runner’s chest,\nand I catch everything: from the hills,\nthe mountains.\n\nHow do the lines contribute to the development of a central idea of the poem?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "They establish that both the structure and the water have endurance and control."
      },
      {
        "id": "B",
        "text": "They highlight that both the structure and the water are powerful and impressive."
      },
      {
        "id": "C",
        "text": "They suggest that the structure and the water are unaware of how similar they are."
      },
      {
        "id": "D",
        "text": "They reveal that the structure and the water are surprised that they are interrelated."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "cross-purposes-form-b-3",
    "points": 1,
    "prompt": "The use of the words “siblings” and “my sisters and brothers” in lines 31–32 conveys the idea that the",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "forms water can take are less diverse than the types of structures that exist."
      },
      {
        "id": "B",
        "text": "number of human-made structures is rapidly increasing."
      },
      {
        "id": "C",
        "text": "water passes under many similar-looking structures as it flows."
      },
      {
        "id": "D",
        "text": "structure is powerful because it is one of many."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "cross-purposes-form-b-4",
    "points": 1,
    "prompt": "The comparison to sewing in lines 33–35 helps show that the structure",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "enhances the beauty of the natural landscape."
      },
      {
        "id": "B",
        "text": "brings people together more effectively than nature does."
      },
      {
        "id": "C",
        "text": "provides clear boundaries for natural environments."
      },
      {
        "id": "D",
        "text": "serves as a means for people to overcome an obstacle created by nature."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "cross-purposes-form-b-5",
    "points": 1,
    "prompt": "The last stanza (lines 36–42) conveys a central idea of the poem by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "demonstrating that both the structure and the water depend on each other to fulfill their functions."
      },
      {
        "id": "B",
        "text": "implying that a stronger structure would be able to resist the degradation caused by the water."
      },
      {
        "id": "C",
        "text": "revealing that the passage of time will render both the structure and the water obsolete."
      },
      {
        "id": "D",
        "text": "suggesting that the water will eventually weaken the structure and will continue to exist after the structure is gone."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "cross-purposes-form-b-6",
    "points": 1,
    "prompt": "Read lines 41–42 from the poem.\n\nBecause I am,\nabove all else, patient. I will wait for you.\n\nWhich of the following supports what is implied in these lines?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“I am older / than anything else you know.” (lines 8–9)"
      },
      {
        "id": "B",
        "text": "“No human / built me.” (lines 9–10)"
      },
      {
        "id": "C",
        "text": "“It all washes down through me.” (line 14)"
      },
      {
        "id": "D",
        "text": "“Those who made you will break you,” (line 26)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "cross-purposes-form-b-7",
    "points": 1,
    "prompt": "How does the poet develop the points of view of the structure and the water?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "by giving an account of a discussion between them about the future of human civilization"
      },
      {
        "id": "B",
        "text": "by narrating a debate they have over their impact on the environment"
      },
      {
        "id": "C",
        "text": "by illustrating the unique power they each possess over nature"
      },
      {
        "id": "D",
        "text": "by using personification to allow them to debate who is more important"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "cross-purposes-form-b-8",
    "points": 1,
    "prompt": "How does the form of the poem contribute to its meaning?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "The use of an equal number of lines in each stanza emphasizes that both speakers are equally important."
      },
      {
        "id": "B",
        "text": "The use of italics in some of the stanzas indicates the increasing tension between the structure and the water."
      },
      {
        "id": "C",
        "text": "The alternating positions of the stanzas highlight the opposing points of view of the speakers."
      },
      {
        "id": "D",
        "text": "The lack of a regular rhyme scheme or meter reflects the way the water changes the structure and the way the water itself changes."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const crossPurposesFormBPassageSet: ExamPassageSet = {
  id: "ela-cross-purposes-form-b",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: crossPurposesFormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createPlainTextPassage({
    id: "cross-purposes-form-b",
    title: "Cross-Purposes",
    passageType: "poem",
    richText: "<p>What I am is <em>built</em>: concrete and steel.</p><p>I defy gravity. I am what every athlete</p><p>wants: to remain at the apex of the leap,</p><p><em>up in the air</em>. And yet I am useful, too:</p><p>cars, trucks, people, even trains</p><p>make their way across my broad back.</p><p>Swallows and ospreys<sup>1</sup> nest in my trusses.</p><p><br></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;What I am is motion. I am water, and I am older</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;than anything else you know. No human</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;built me. I am gravity’s best friend; I pool</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;and flow wherever gravity takes me.</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I am the blood flowing in the runner’s chest,</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;and I catch everything: from the hills,</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;the mountains. It all washes down through me.</em></p><p><br></p><p>What you are is an <em>accident</em>,</p><p>what happens to rain when rain gives in</p><p>to Earth’s gravitational pull.</p><p>You are some tears dribbling from a mountain’s</p><p>eye, running down the pavements</p><p>of small towns, into the cities, to the sea.</p><p>You are the path of least resistance.</p><p><br></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;What I am is power. You, of course,</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;have none: you are a static lump, an artifact</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;slowly decaying. But my regal flow</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nourishes grasses, permits empires to rise.</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Those who made you will break you,</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in time, replacing you with yet another</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clumsy structure. I have seen. I know.</em></p><p><br></p><p><em>“Clumsy”?</em> Being rebuilt makes me</p><p>a friend of time, does it not? And it means</p><p>that I have siblings—those “clumsy” structures,</p><p>my sisters and brothers.</p><p>We stitch across the rip you make.</p><p>We are steel thread to the human needle.</p><p>We bind you up. We sew you.</p><p><br></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;And I sow into you; in every cranny</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;of your superstructure my vapors cling.</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;They bring out your softness, your rust.</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Boast your best, and boast better yet.</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I am listening to the bright hum</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;of the wind in your wires. Because I am,</em></p><p><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;above all else, patient. I will wait for you.</em></p><p><br></p><p><sup>1</sup><em>ospreys</em>: large birds</p>",
    teacherSource: "crosspurposes.pdf, printed pages 168–171, questions 34–41",
    text: crossPurposesFormBPassageText,
    versionLabel: "2020-2021 Form B",
  }),
  questions: crossPurposesFormBQuestions,
};
