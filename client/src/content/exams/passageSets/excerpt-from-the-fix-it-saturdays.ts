import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheFixItSaturdaysPassageText = "On the second Saturday of every month, the folding tables in the Thistlewood Public Library meeting room fill up with objects that have stopped working: table lamps with frayed cords, jackets missing buttons, bicycles with bent wheels, board games with cracked hinges. Volunteers known locally as the \"fixers\" sit at each table with screwdrivers, needles, and patience, ready to repair whatever a neighbor carries through the door.\n\nThe program began three years ago when a retired electrician named Odell Fitch grew tired of watching perfectly repairable appliances end up at the curb. He asked the library for a spare room one Saturday a month and put up a hand-lettered sign. Fourteen people showed up the first time, most of them curious rather than committed. By the end of that afternoon, Fitch and two friends had fixed nine lamps and a toaster, and word began to spread. Within a year, the fixers had outgrown the small meeting room and moved to the library's larger community hall, where six tables now stand instead of two.\n\nToday the fixers keep a running log of what comes through the door, and the totals tell a story about which objects in a household are worth saving and which are not. Over the most recent ten sessions, volunteers examined 134 items in five broad categories. Clothing and textiles made up the largest single group, with 44 pieces brought in and 41 successfully mended, mostly torn seams, missing buttons, and broken zippers that take a skilled hand only minutes to fix. Lamps and small appliances came next, with 40 items and 34 repairs, the toasters and hair dryers usually failing for the same handful of reasons: a loose wire, a worn switch, a clogged heating coil.\n\nFurniture told a different story. Of the twelve chairs, stools, and small tables that arrived, only eight went home fixed. A wobbly leg or a split seat is often manageable, but a cracked frame or water-damaged wood asks more of a volunteer than an afternoon allows. Bicycles fell in the middle, with twelve out of fourteen restored to rolling condition, since flat tires and slipped chains rarely require a spare part the fixers do not already have in a labeled bin under the table. Toys and games were the trickiest small items: nineteen of twenty-four were saved, but the five failures were almost all battery-powered toys whose internal circuits had corroded beyond a hand tool's reach.\n\nFitch is careful not to call the sessions a repair service. \"We are not here because we are better with tools than anyone else,\" he says. \"We are here because most people never get five uninterrupted minutes to sit down with a torn sleeve and figure out where the thread is supposed to go.\" He keeps a small notebook of \"teaching moments,\" short lessons he gives to whoever waits nearest a table, on the theory that a fixer who explains a repair sends two things home: a working lamp, and someone who might not need the Fix-It Saturday next time.\n\nNot every object survives the visit. A cracked ceramic vase, a phone with a shattered screen, and a lawn mower with a seized engine have all been carried back out the door as they came in. But even a failed repair, Fitch insists, is not wasted effort: a volunteer can usually tell an owner whether an item is worth the cost of a professional repair, worth donating for parts, or simply worth letting go. That kind of honest assessment, he argues, is itself a service, one that a big-box return counter has no reason to offer.\n\nThe library has begun tracking a second number alongside repairs: how many items never came back for a second try. So far, of the items marked \"fixed\" in the log, only three have reappeared with the same problem, a rate Fitch is quietly proud of. \"A repair that doesn't hold is really just a delay,\" he says. \"We would rather tell someone the truth on the first Saturday than see the same lamp back on the table in March.\"\n\n\nThe sessions cost the library almost nothing to run. Fixers donate their own tools, and a hardware store two blocks away contributes spare screws, thread, and batteries whenever its bins run low. Fitch has turned down offers from a regional recycling nonprofit that wanted to expand the Fix-It Saturdays into a paid, weekly program with a rotating staff. He worries that paying fixers would change what the sessions are for. \"The whole thing works because nobody is in a hurry to move on to the next customer,\" he says. \"The day we start clocking hours is the day we stop teaching anybody anything.\"";

const excerptFromTheFixItSaturdaysQuestions: ExamQuestion[] = [
  {
    "id": "passage-1",
    "points": 1,
    "prompt": "By including Fitch's own words explaining why he refuses to turn Fix-It Saturdays into a paid, weekly program, the author most strongly emphasizes which aspect of the program?",
    "promptHtml": "By including Fitch's own words explaining why he refuses to turn Fix-It Saturdays into a paid, weekly program, the author&nbsp;<strong>most strongly</strong>&nbsp;emphasizes which aspect of the program?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "html": "That Fitch is mainly interested in personal profit and expansion",
        "text": "That Fitch is mainly interested in personal profit and expansion"
      },
      {
        "id": "B",
        "html": "That the informal pace matters most",
        "text": "That the informal pace matters most"
      },
      {
        "id": "C",
        "html": "That the recycling nonprofit's offer was disorganized and poorly planned",
        "text": "That the recycling nonprofit's offer was disorganized and poorly planned"
      },
      {
        "id": "D",
        "html": "That the library quietly disapproves of Fitch's overall leadership style",
        "text": "That the library quietly disapproves of Fitch's overall leadership style"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-2",
    "points": 1,
    "prompt": "Which choice most fully captures the central idea of the passage's account of the Fix-It Saturdays program?",
    "promptHtml": "Which choice&nbsp;<strong>most fully</strong>&nbsp;captures the central idea of the passage's account of the Fix-It Saturdays program?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Odell Fitch is more skilled at repairs than most professional technicians.",
        "text": "Odell Fitch is more skilled at repairs than most professional technicians."
      },
      {
        "id": "B",
        "html": "A monthly repair program succeeds by fixing objects and giving honest attention.",
        "text": "A monthly repair program succeeds by fixing objects and giving honest attention."
      },
      {
        "id": "C",
        "html": "Thistlewood's library struggles to find enough reliable volunteers for its programs.",
        "text": "Thistlewood's library struggles to find enough reliable volunteers for its programs."
      },
      {
        "id": "D",
        "html": "Clothing is easier to repair than furniture because it requires fewer tools.",
        "text": "Clothing is easier to repair than furniture because it requires fewer tools."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-3",
    "points": 1,
    "prompt": "What can reasonably be inferred about the three items that reappeared with the same problem?",
    "promptHtml": "What can reasonably be inferred about the three items that reappeared with the same problem?",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "They were fixed by volunteers who had less experience than Fitch.",
        "text": "They were fixed by volunteers who had less experience than Fitch."
      },
      {
        "id": "B",
        "html": "The library quietly removed those particular volunteers from the program.",
        "text": "The library quietly removed those particular volunteers from the program."
      },
      {
        "id": "C",
        "html": "Those items were furniture pieces that had already been marked beyond repair.",
        "text": "Those items were furniture pieces that had already been marked beyond repair."
      },
      {
        "id": "D",
        "html": "Even Fitch's fixers cannot guarantee that every repair holds permanently.",
        "text": "Even Fitch's fixers cannot guarantee that every repair holds permanently."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-4",
    "points": 1,
    "prompt": "What detail from the passage best supports the claim that Fitch values the informal pace of the sessions over their potential to grow?",
    "promptHtml": "What detail from the passage&nbsp;<strong>best</strong>&nbsp;supports the claim that Fitch values the informal pace of the sessions over their potential to grow?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“Fourteen people showed up the first time, most curious rather than committed.”",
        "text": "“Fourteen people showed up the first time, most curious rather than committed.”"
      },
      {
        "id": "B",
        "html": "“Clothing and textiles made up the largest group, with 44 pieces brought in.”",
        "text": "“Clothing and textiles made up the largest group, with 44 pieces brought in.”"
      },
      {
        "id": "C",
        "html": "“turned down offers to expand the Fix-It Saturdays into a paid, weekly program”",
        "text": "“turned down offers to expand the Fix-It Saturdays into a paid, weekly program”"
      },
      {
        "id": "D",
        "html": "“The library has begun tracking a second number alongside repairs made.”",
        "text": "“The library has begun tracking a second number alongside repairs made.”"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-6",
    "points": 1,
    "prompt": "Which best states the central idea of the passage's first paragraph?",
    "promptHtml": "Which&nbsp;<strong>best</strong>&nbsp;states the central idea of the passage's first paragraph?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Covey preferred to work far away from the fields he supervised.",
        "text": "Covey preferred to work far away from the fields he supervised."
      },
      {
        "id": "B",
        "html": "Covey relied on constant surveillance and fear of being caught, not presence.",
        "text": "Covey relied on constant surveillance and fear of being caught, not presence."
      },
      {
        "id": "C",
        "html": "Covey was well liked by the people who worked under him.",
        "text": "Covey was well liked by the people who worked under him."
      },
      {
        "id": "D",
        "html": "Covey rarely checked on the progress of the work being done.",
        "text": "Covey rarely checked on the progress of the work being done."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-5",
    "points": 1,
    "prompt": "Which choice most fully captures the central idea that ties together Douglass's description of the bay, the ships, and his own reflection?",
    "promptHtml": "Which choice&nbsp;<strong>most fully</strong>&nbsp;captures the central idea that ties together Douglass's description of the bay, the ships, and his own reflection?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Even under surveillance, the narrator held onto an active longing.",
        "text": "Even under surveillance, the narrator held onto an active longing."
      },
      {
        "id": "B",
        "html": "The narrator believed that Covey was secretly a kind man underneath his cruelty.",
        "text": "The narrator believed that Covey was secretly a kind man underneath his cruelty."
      },
      {
        "id": "C",
        "html": "The narrator's family lived quite comfortably and securely despite Covey's harsh methods.",
        "text": "The narrator's family lived quite comfortably and securely despite Covey's harsh methods."
      },
      {
        "id": "D",
        "html": "Ships sailing on the Chesapeake Bay were dangerous to the sailors aboard them.",
        "text": "Ships sailing on the Chesapeake Bay were dangerous to the sailors aboard them."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-7",
    "points": 1,
    "prompt": "What detail from the second paragraph best supports the idea that the sight of the ships caused the narrator pain rather than simple admiration?",
    "promptHtml": "What detail from the second paragraph&nbsp;<strong>best</strong>&nbsp;supports the idea that the sight of the ships caused the narrator pain rather than simple admiration?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“whose broad bosom was ever white with sails from every quarter of the habitable globe”",
        "text": "“whose broad bosom was ever white with sails from every quarter of the habitable globe”"
      },
      {
        "id": "B",
        "html": "“were to me so many shrouded ghosts, to torment me with thoughts of my condition”",
        "text": "“were to me so many shrouded ghosts, to torment me with thoughts of my condition”"
      },
      {
        "id": "C",
        "html": "“I have often, in the deep stillness of a summer’s Sabbath, stood all alone”",
        "text": "“I have often, in the deep stillness of a summer’s Sabbath, stood all alone”"
      },
      {
        "id": "D",
        "html": "“the countless number of sails moving off to the mighty ocean”",
        "text": "“the countless number of sails moving off to the mighty ocean”"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-8",
    "points": 1,
    "prompt": "Douglass most likely addresses the ships directly, in the form of an apostrophe, in order to",
    "promptHtml": "Douglass&nbsp;<strong>most likely</strong>&nbsp;addresses the ships directly, in the form of an apostrophe, in order to",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "html": "request that a specific ship's captain secretly help him escape northward.",
        "text": "request that a specific ship's captain secretly help him escape northward."
      },
      {
        "id": "B",
        "html": "give voice, privately, to feelings of longing he could not otherwise express.",
        "text": "give voice, privately, to feelings of longing he could not otherwise express."
      },
      {
        "id": "C",
        "html": "criticize the ship captains directly for ignoring enslaved people on the shore.",
        "text": "criticize the ship captains directly for ignoring enslaved people on the shore."
      },
      {
        "id": "D",
        "html": "describe, in technical detail, how ships of the period were built and sailed.",
        "text": "describe, in technical detail, how ships of the period were built and sailed."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-9",
    "points": 1,
    "prompt": "What can be reasonably inferred about the narrator's plans, based on the details in the quoted soliloquy?",
    "promptHtml": "What can be reasonably inferred about the narrator's plans, based on the details in the quoted soliloquy?",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "He intended to ask Covey directly for permission to travel north.",
        "text": "He intended to ask Covey directly for permission to travel north."
      },
      {
        "id": "B",
        "html": "He believed escape was impossible and had given up all hope of it.",
        "text": "He believed escape was impossible and had given up all hope of it."
      },
      {
        "id": "C",
        "html": "He planned to escape by secretly boarding one of the ships he watched.",
        "text": "He planned to escape by secretly boarding one of the ships he watched."
      },
      {
        "id": "D",
        "html": "He had already planned a route through Delaware and Pennsylvania.",
        "text": "He had already planned a route through Delaware and Pennsylvania."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-10",
    "points": 1,
    "prompt": "How does the passage's final paragraph function in relation to the soliloquy quoted just before it?",
    "promptHtml": "How does the passage's final paragraph function in relation to the soliloquy quoted just before it?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "It reveals that the soliloquy had actually been spoken aloud to another person nearby.",
        "text": "It reveals that the soliloquy had actually been spoken aloud to another person nearby."
      },
      {
        "id": "B",
        "html": "It directly contradicts the hope expressed at the end of the soliloquy.",
        "text": "It directly contradicts the hope expressed at the end of the soliloquy."
      },
      {
        "id": "C",
        "html": "It steps back to describe his ordinary state of mind.",
        "text": "It steps back to describe his ordinary state of mind."
      },
      {
        "id": "D",
        "html": "It introduces an entirely new setting far from the Chesapeake Bay.",
        "text": "It introduces an entirely new setting far from the Chesapeake Bay."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromTheFixItSaturdaysPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-fix-it-saturdays",
  questionCount: excerptFromTheFixItSaturdaysQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "excerpt-from-the-fix-it-saturdays",
    title: "Excerpt from \"The Fix-It Saturdays\"",
    author: "Odalys Ferreira",
    blurb: "Odalys Ferreira is a freelance journalist who covers community programs for regional newspapers. The following is adapted from a feature she wrote about a volunteer repair program in the town of Thistlewood.",
    image: {"alt":"Excerpt from \"The Fix-It Saturdays\" illustration","src":"/exam-images/excerpt-from-the-fix-it-saturdays-passage.png"},
    passageType: "informational",
    richText: "<p>On the second Saturday of every month, the folding tables in the Thistlewood Public Library meeting room fill up with objects that have stopped working: table lamps with frayed cords, jackets missing buttons, bicycles with bent wheels, board games with cracked hinges. Volunteers known locally as the \"fixers\" sit at each table with screwdrivers, needles, and patience, ready to repair whatever a neighbor carries through the door.</p><p>The program began three years ago when a retired electrician named Odell Fitch grew tired of watching perfectly repairable appliances end up at the curb. He asked the library for a spare room one Saturday a month and put up a hand-lettered sign. Fourteen people showed up the first time, most of them curious rather than committed. By the end of that afternoon, Fitch and two friends had fixed nine lamps and a toaster, and word began to spread. Within a year, the fixers had outgrown the small meeting room and moved to the library's larger community hall, where six tables now stand instead of two.</p><p>Today the fixers keep a running log of what comes through the door, and the totals tell a story about which objects in a household are worth saving and which are not. Over the most recent ten sessions, volunteers examined 134 items in five broad categories. Clothing and textiles made up the largest single group, with 44 pieces brought in and 41 successfully mended, mostly torn seams, missing buttons, and broken zippers that take a skilled hand only minutes to fix. Lamps and small appliances came next, with 40 items and 34 repairs, the toasters and hair dryers usually failing for the same handful of reasons: a loose wire, a worn switch, a clogged heating coil.</p><p>Furniture told a different story. Of the twelve chairs, stools, and small tables that arrived, only eight went home fixed. A wobbly leg or a split seat is often manageable, but a cracked frame or water-damaged wood asks more of a volunteer than an afternoon allows. Bicycles fell in the middle, with twelve out of fourteen restored to rolling condition, since flat tires and slipped chains rarely require a spare part the fixers do not already have in a labeled bin under the table. Toys and games were the trickiest small items: nineteen of twenty-four were saved, but the five failures were almost all battery-powered toys whose internal circuits had corroded beyond a hand tool's reach.</p><p>Fitch is careful not to call the sessions a repair service. \"We are not here because we are better with tools than anyone else,\" he says. \"We are here because most people never get five uninterrupted minutes to sit down with a torn sleeve and figure out where the thread is supposed to go.\" He keeps a small notebook of \"teaching moments,\" short lessons he gives to whoever waits nearest a table, on the theory that a fixer who explains a repair sends two things home: a working lamp, and someone who might not need the Fix-It Saturday next time.</p><p>Not every object survives the visit. A cracked ceramic vase, a phone with a shattered screen, and a lawn mower with a seized engine have all been carried back out the door as they came in. But even a failed repair, Fitch insists, is not wasted effort: a volunteer can usually tell an owner whether an item is worth the cost of a professional repair, worth donating for parts, or simply worth letting go. That kind of honest assessment, he argues, is itself a service, one that a big-box return counter has no reason to offer.</p><p>The library has begun tracking a second number alongside repairs: how many items never came back for a second try. So far, of the items marked \"fixed\" in the log, only three have reappeared with the same problem, a rate Fitch is quietly proud of. \"A repair that doesn't hold is really just a delay,\" he says. \"We would rather tell someone the truth on the first Saturday than see the same lamp back on the table in March.\"</p><p><br>The sessions cost the library almost nothing to run. Fixers donate their own tools, and a hardware store two blocks away contributes spare screws, thread, and batteries whenever its bins run low. Fitch has turned down offers from a regional recycling nonprofit that wanted to expand the Fix-It Saturdays into a paid, weekly program with a rotating staff. He worries that paying fixers would change what the sessions are for. \"The whole thing works because nobody is in a hurry to move on to the next customer,\" he says. \"The day we start clocking hours is the day we stop teaching anybody anything.\"</p>",
    text: excerptFromTheFixItSaturdaysPassageText,
  }),
  questions: excerptFromTheFixItSaturdaysQuestions,
};
