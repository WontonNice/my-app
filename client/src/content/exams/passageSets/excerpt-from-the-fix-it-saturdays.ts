import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheFixItSaturdaysPassageText = "On the second Saturday of every month, the folding tables in the Thistlewood Public Library meeting room fill up with objects that have stopped working: table lamps with frayed cords, jackets missing buttons, bicycles with bent wheels, board games with cracked hinges. Volunteers known locally as the \"fixers\" sit at each table with screwdrivers, needles, and patience, ready to repair whatever a neighbor carries through the door.\n\nThe program began three years ago when a retired electrician named Odell Fitch grew tired of watching perfectly repairable appliances end up at the curb. He asked the library for a spare room one Saturday a month and put up a hand-lettered sign. Fourteen people showed up the first time, most of them curious rather than committed. By the end of that afternoon, Fitch and two friends had fixed nine lamps and a toaster, and word began to spread. Within a year, the fixers had outgrown the small meeting room and moved to the library's larger community hall, where six tables now stand instead of two.\n\nToday the fixers keep a running log of what comes through the door, and the totals tell a story about which objects in a household are worth saving and which are not. Over the most recent ten sessions, volunteers examined 134 items in five broad categories. Clothing and textiles made up the largest single group, with 44 pieces brought in and 41 successfully mended, mostly torn seams, missing buttons, and broken zippers that take a skilled hand only minutes to fix. Lamps and small appliances came next, with 40 items and 34 repairs, the toasters and hair dryers usually failing for the same handful of reasons: a loose wire, a worn switch, a clogged heating coil.\n\nFurniture told a different story. Of the twelve chairs, stools, and small tables that arrived, only eight went home fixed. A wobbly leg or a split seat is often manageable, but a cracked frame or water-damaged wood asks more of a volunteer than an afternoon allows. Bicycles fell in the middle, with twelve out of fourteen restored to rolling condition, since flat tires and slipped chains rarely require a spare part the fixers do not already have in a labeled bin under the table. Toys and games were the trickiest small items: nineteen of twenty-four were saved, but the five failures were almost all battery-powered toys whose internal circuits had corroded beyond a hand tool's reach.\n\nFitch is careful not to call the sessions a repair service. \"We are not here because we are better with tools than anyone else,\" he says. \"We are here because most people never get five uninterrupted minutes to sit down with a torn sleeve and figure out where the thread is supposed to go.\" He keeps a small notebook of \"teaching moments,\" short lessons he gives to whoever waits nearest a table, on the theory that a fixer who explains a repair sends two things home: a working lamp, and someone who might not need the Fix-It Saturday next time.\n\nNot every object survives the visit. A cracked ceramic vase, a phone with a shattered screen, and a lawn mower with a seized engine have all been carried back out the door as they came in. But even a failed repair, Fitch insists, is not wasted effort: a volunteer can usually tell an owner whether an item is worth the cost of a professional repair, worth donating for parts, or simply worth letting go. That kind of honest assessment, he argues, is itself a service, one that a big-box return counter has no reason to offer.\n\nThe library has begun tracking a second number alongside repairs: how many items never came back for a second try. So far, of the items marked \"fixed\" in the log, only three have reappeared with the same problem, a rate Fitch is quietly proud of. \"A repair that doesn't hold is really just a delay,\" he says. \"We would rather tell someone the truth on the first Saturday than see the same lamp back on the table in March.\"\n\n\nThe sessions cost the library almost nothing to run. Fixers donate their own tools, and a hardware store two blocks away contributes spare screws, thread, and batteries whenever its bins run low. Fitch has turned down offers from a regional recycling nonprofit that wanted to expand the Fix-It Saturdays into a paid, weekly program with a rotating staff. He worries that paying fixers would change what the sessions are for. \"The whole thing works because nobody is in a hurry to move on to the next customer,\" he says. \"The day we start clocking hours is the day we stop teaching anybody anything.\"";

const excerptFromTheFixItSaturdaysQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-fix-it-saturdays-a",
    "points": 1,
    "prompt": "The contrast between furniture's repair rate and clothing's repair rate most directly supports which idea developed in the passage?",
    "promptHtml": "The contrast between furniture's repair rate and clothing's repair rate most directly supports which idea developed in the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Some categories of household objects are inherently easier to fix than others.",
        "text": "Some categories of household objects are inherently easier to fix than others."
      },
      {
        "id": "B",
        "html": "Fitch believes clothing repairs are more valuable to the community than furniture repairs.",
        "text": "Fitch believes clothing repairs are more valuable to the community than furniture repairs."
      },
      {
        "id": "C",
        "html": "The library plans to stop accepting furniture donations at future sessions entirely.",
        "text": "The library plans to stop accepting furniture donations at future sessions entirely."
      },
      {
        "id": "D",
        "html": "Volunteers are generally better trained in sewing repairs than in woodworking repairs.",
        "text": "Volunteers are generally better trained in sewing repairs than in woodworking repairs."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-fix-it-saturdays-b",
    "points": 1,
    "prompt": "The sentence 'Furniture told a different story,' which opens the paragraph about the twelve chairs, stools, and small tables the fixers examined, most directly serves to signal a shift from the passage's earlier examples toward information that complicates its optimistic pattern of high repair rates.",
    "promptHtml": "The sentence 'Furniture told a different story,' which opens the paragraph about the twelve chairs, stools, and small tables the fixers examined, most directly serves to signal a shift from the passage's earlier examples toward information that complicates its optimistic pattern of high repair rates.",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "to announce that the library will stop accepting all furniture donations soon",
        "text": "to announce that the library will stop accepting all furniture donations soon"
      },
      {
        "id": "B",
        "html": "to contradict Fitch's claim that a failed repair is not wasted effort",
        "text": "to contradict Fitch's claim that a failed repair is not wasted effort"
      },
      {
        "id": "C",
        "html": "to introduce a category fixers cannot always repair",
        "text": "to introduce a category fixers cannot always repair"
      },
      {
        "id": "D",
        "html": "to shift the passage's entire focus permanently away from the volunteer program",
        "text": "to shift the passage's entire focus permanently away from the volunteer program"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
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
