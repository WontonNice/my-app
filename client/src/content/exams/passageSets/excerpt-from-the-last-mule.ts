import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheLastMulePassageText = "The Last Mule\n\n\nOttoline pulled a plow for eighteen years,\n\nlonger than either of my brothers had been alive,\n\nand when the tractor came up the drive on a flatbed truck,\n\ngleaming and orange and smelling of paint,\n\nmy father stood at the fence and did not go to meet it.\n\n\n\n\n\n\n\nHe fed her by hand that whole first week,\n\neven after the tractor sat ready in the barn,\n\neven after my mother said, plainly, that a mule\n\neats the same whether you love her or not.\n\nHe said he knew that. He kept feeding her by hand.\n\n\n\n\n\nThe tractor turned our ten acres in a single afternoon,\n\nwhat used to take Ottoline the better part of four days,\n\nand my father drove it well enough by the second week,\n\nsitting up on the metal seat like a man\n\nriding something he had not yet decided to trust.\n\n\nWe did not sell her. My father would not hear of selling her\n\n,and so she spent her last years doing nothing\n\na mule is supposed to do, standing in the near pasture\n\nwatching the tractor pass, ignoring it, the way\n\nan old dog ignores a younger one showing off.\n\n\n\n\nWhen she died that winter, my father dug the hole himself,\n\nthough the neighbors offered their tractor for it,\n\ntheirs being newer and stronger than ours,\n\nand he said no, thank you, some things\n\na man ought to do with his own two hands and a shovel.\n\n\n\n\nI did not understand it then, how a plow animal\n\ncould be worth more to him than the machine\n\nthat did her job in a quarter of the time.\n\nI understand it a little better now, the difference\n\nbetween a thing that serves you and a thing you owe.​";

const excerptFromTheLastMuleQuestions: ExamQuestion[] = [
  {
    "id": "passage-1",
    "points": 1,
    "prompt": "The poem's six stanzas move chronologically from the tractor's arrival, through the father's shifting relationship with the mule and the machine, to Ottoline's death and the speaker's later reflection. This structure most clearly emphasizes",
    "promptHtml": "The poem's six stanzas move chronologically from the tractor's arrival, through the father's shifting relationship with the mule and the machine, to Ottoline's death and the speaker's later reflection. This structure&nbsp;<strong>most clearly</strong>&nbsp;emphasizes",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "how the father's grief and loyalty toward Ottoline unfolded slowly, not all at once",
        "text": "how the father's grief and loyalty toward Ottoline unfolded slowly, not all at once"
      },
      {
        "id": "B",
        "html": "how quickly the speaker's father came to prefer the tractor over Ottoline",
        "text": "how quickly the speaker's father came to prefer the tractor over Ottoline"
      },
      {
        "id": "C",
        "html": "that the entire poem takes place within a single afternoon",
        "text": "that the entire poem takes place within a single afternoon"
      },
      {
        "id": "D",
        "html": "that Ottoline died before the tractor ever arrived on the farm",
        "text": "that Ottoline died before the tractor ever arrived on the farm"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-last-mule-2",
    "points": 1,
    "prompt": "Complete the statement below, which draws an inference from details across the whole poem, by dragging the correct word from the word bank into the blank.",
    "promptHtml": "Complete the statement below, which draws an inference from details across the whole poem, by dragging the correct word from the word bank into the blank.",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "obligation",
        "text": "obligation"
      },
      {
        "id": "B",
        "html": "indifference",
        "text": "indifference"
      },
      {
        "id": "C",
        "html": "resentment",
        "text": "resentment"
      },
      {
        "id": "D",
        "html": "curiosity",
        "text": "curiosity"
      }
    ],
    "correctChoiceId": "A",
    "instructions": "Move the correct answer to the box.",
    "transitionBlankAfter": "toward her that has nothing to do with how efficiently she can still work.",
    "transitionBlankBefore": "The father's decision to keep feeding Ottoline by hand even after the tractor arrived, and his refusal to let the neighbors' tractor dig her grave, both suggest that he feels a sense of",
    "type": "transition_drop"
  },
  {
    "id": "excerpt-from-the-last-mule-3",
    "points": 1,
    "prompt": "Which choice best states a theme that emerges from the father's decision to keep feeding Ottoline even after the tractor arrives?",
    "promptHtml": "Which choice&nbsp;<strong>best</strong>&nbsp;states a theme that emerges from the father's decision to keep feeding Ottoline even after the tractor arrives?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Machines are always more valuable than the living things they replace.",
        "text": "Machines are always more valuable than the living things they replace."
      },
      {
        "id": "B",
        "html": "Farming became impossible for most families after tractors were introduced.",
        "text": "Farming became impossible for most families after tractors were introduced."
      },
      {
        "id": "C",
        "html": "A relationship built on years of dependence can outlast its practical usefulness.",
        "text": "A relationship built on years of dependence can outlast its practical usefulness."
      },
      {
        "id": "D",
        "html": "Mules are generally more intelligent than horses on a working farm.",
        "text": "Mules are generally more intelligent than horses on a working farm."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-last-mule-4",
    "points": 1,
    "prompt": "Which choice most fully captures the central idea conveyed by the speaker's account of Ottoline's final years?",
    "promptHtml": "Which choice&nbsp;<strong>most fully</strong>&nbsp;captures the central idea conveyed by the speaker's account of Ottoline's final years?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "The poem argues that tractors should never have been allowed to replace mules on American farms.",
        "text": "The poem argues that tractors should never have been allowed to replace mules on American farms."
      },
      {
        "id": "B",
        "html": "The poem describes, in careful technical detail, how a gasoline tractor engine works.",
        "text": "The poem describes, in careful technical detail, how a gasoline tractor engine works."
      },
      {
        "id": "C",
        "html": "The poem is primarily concerned with a disagreement between the speaker's parents.",
        "text": "The poem is primarily concerned with a disagreement between the speaker's parents."
      },
      {
        "id": "D",
        "html": "The poem uses an aging mule's story to explore what serves us versus what we owe.",
        "text": "The poem uses an aging mule's story to explore what serves us versus what we owe."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-last-mule-5",
    "points": 1,
    "prompt": "In the context of the poem's portrayal of an aging, capable animal being quietly replaced by a machine, the comparison of Ottoline ignoring the tractor to 'the way an old dog ignores a younger one showing off' is best classified as what kind of literary device?",
    "promptHtml": "In the context of the poem's portrayal of an aging, capable animal being quietly replaced by a machine, the comparison of Ottoline ignoring the tractor to 'the way an old dog ignores a younger one showing off' is&nbsp;<strong>best</strong>&nbsp;classified as what kind of literary device?",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "html": "A metaphor claiming that Ottoline literally believed herself to be a dog",
        "text": "A metaphor claiming that Ottoline literally believed herself to be a dog"
      },
      {
        "id": "B",
        "html": "A simile casting the tractor as a rival Ottoline regards with weary indifference",
        "text": "A simile casting the tractor as a rival Ottoline regards with weary indifference"
      },
      {
        "id": "C",
        "html": "Personification of the tractor's engine as if it were a living creature",
        "text": "Personification of the tractor's engine as if it were a living creature"
      },
      {
        "id": "D",
        "html": "An idiom with no real connection to the poem's subject matter",
        "text": "An idiom with no real connection to the poem's subject matter"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-last-mule-6",
    "points": 1,
    "prompt": "The understated, reflective word choices in the poem's final stanza, especially the phrase 'a thing that serves you and a thing you owe,' most strongly establish a tone of",
    "promptHtml": "The understated, reflective word choices in the poem's final stanza, especially the phrase 'a thing that serves you and a thing you owe,'&nbsp;<strong>most strongly</strong>&nbsp;establish a tone of",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "bitter anger at the father's decisions throughout the poem.",
        "text": "bitter anger at the father's decisions throughout the poem."
      },
      {
        "id": "B",
        "html": "lighthearted humor about everyday farm life.",
        "text": "lighthearted humor about everyday farm life."
      },
      {
        "id": "C",
        "html": "urgent warning about the dangers of operating old farm machinery.",
        "text": "urgent warning about the dangers of operating old farm machinery."
      },
      {
        "id": "D",
        "html": "quiet, mature understanding reached only after enough time has passed.",
        "text": "quiet, mature understanding reached only after enough time has passed."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const excerptFromTheLastMulePassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-last-mule",
  questionCount: excerptFromTheLastMuleQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createPlainTextPassage({
    id: "excerpt-from-the-last-mule",
    title: "Excerpt from \"The Last Mule\"",
    author: "Ruth Anne Calloway",
    blurb: "Ruth Anne Calloway grew up on a family farm in the American Midwest. \"The Last Mule\" first appeared in a 2019 chapbook about her childhood in the 1950s.",
    passageType: "poem",
    richText: "<p>The Last Mule</p><p><br>Ottoline pulled a plow for eighteen years,</p><p>longer than either of my brothers had been alive,</p><p>and when the tractor came up the drive on a flatbed truck,</p><p>gleaming and orange and smelling of paint,</p><p>my father stood at the fence and did not go to meet it.\n</p><p><br></p><p>\n\nHe fed her by hand that whole first week,</p><p>even after the tractor sat ready in the barn,</p><p>even after my mother said, plainly, that a mule</p><p>eats the same whether you love her or not.</p><p>He said he knew that. He kept feeding her by hand.<br><br></p><p>\n\nThe tractor turned our ten acres in a single afternoon,</p><p>what used to take Ottoline the better part of four days,</p><p>and my father drove it well enough by the second week,</p><p>sitting up on the metal seat like a man</p><p>riding something he had not yet decided to trust.<br>\n\nWe did not sell her. My father would not hear of selling her</p><p>,and so she spent her last years doing nothing</p><p>a mule is supposed to do, standing in the near pasture</p><p>watching the tractor pass, ignoring it, the way</p><p>an old dog ignores a younger one showing off.</p><p><br></p><p>When she died that winter, my father dug the hole himself,</p><p>though the neighbors offered their tractor for it,</p><p>theirs being newer and stronger than ours,</p><p>and he said no, thank you, some things</p><p>a man ought to do with his own two hands and a shovel.</p><p><br></p><p>I did not understand it then, how a plow animal</p><p>could be worth more to him than the machine</p><p>that did her job in a quarter of the time.</p><p>I understand it a little better now, the difference</p><p>between a thing that serves you and a thing you owe.​\n</p><p></p><p></p><p></p><p><br>\n\n\n\n</p>",
    text: excerptFromTheLastMulePassageText,
  }),
  questions: excerptFromTheLastMuleQuestions,
};
