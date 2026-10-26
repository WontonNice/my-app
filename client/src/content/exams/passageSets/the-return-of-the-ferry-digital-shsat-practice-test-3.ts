import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theReturnOfTheFerryDigitalShsatPracticeTest3PassageText = "For most of the twentieth century, the small towns strung along Fenwick Sound reached the mainland the same way: by bridge, or not at all. When the last swing bridge to Corbin Island rusted past repair in 2019, engineers offered the county two choices, and only two. A new bridge would cost an estimated forty-one million dollars and take six years to build. A passenger ferry, running four boats on a rotating schedule, would cost under three million dollars to launch and could begin service within a single season. The county chose the ferry, and in doing so it joined a small but growing number of coastal communities that are rediscovering a mode of transportation many assumed had been retired for good.\n\nThe economics of the choice are not as simple as the sticker price suggests. A bridge, once built, requires little beyond routine maintenance for decades. A ferry system needs fuel, crew wages, and dock upkeep every single day it runs, so its yearly operating cost can eventually rival what a bridge would have cost to build in the first place. What tips the balance for many small islands is not the ferry's cost but its flexibility: a ferry route can be shortened, lengthened, or rerouted entirely as a town's population shifts, while a bridge is fixed in place for the rest of its useful life, whether or not the traffic that justified it ever arrives.\n\nCorbin Island's new service illustrates the tradeoff plainly. Ridership in its first year fell forty percent short of the county's projections, largely because commuters accustomed to a fixed bridge schedule were slow to trust a boat timetable that could be delayed by fog or rough water. County planners responded not by abandoning the route but by adjusting it, adding a midday run for parents picking up children from school and cutting an underused late-night crossing. A bridge could not have been resized in this way; once poured, its two lanes serve the same traffic pattern in year thirty as they did in year one, useful or not.\n\nFerries also carry an ecological argument that a growing number of coastal planners find persuasive. A bridge permanently alters the tidal flow beneath it, since its pilings interrupt the natural movement of sediment along a channel floor, and the altered currents can erode nearby beaches over a period of years. A ferry route leaves the water itself untouched. For sounds and inlets that support commercial shellfish beds, this difference can matter more to a local economy than the convenience of driving straight across.\n\nNone of this makes ferries the obvious choice everywhere. A crossing longer than roughly three miles, or one that faces open ocean swell rather than a sheltered sound, quickly becomes unreliable in exactly the kind of weather when islanders most need to reach the mainland, for a medical emergency or a delivery of supplies. Corbin Island's route crosses just under two miles of a well-protected sound, conditions closer to a wide river than to open water, and that geography did as much to make the choice practical as the forty-million-dollar gap in cost.\n\nLocal reaction has shifted along with the schedule. Early complaints centered on the inconvenience of planning around tide tables instead of simply driving whenever one pleased, and a handful of residents pushed the county to revisit the bridge proposal even after construction bids came in. By the service's second year, however, county surveys showed a majority of year-round residents preferring the ferry to the bridge that had once seemed inevitable, citing the added midday run and the absence of the constant truck traffic a bridge would likely have brought to the island's single two-lane road.\n\nWhat the Corbin Island case suggests, and what several similar projects along the Atlantic and Gulf coasts have since confirmed, is that the old assumption — that a permanent link is always the more modern solution — deserves to be questioned rather than simply accepted. A ferry is not merely a temporary substitute for a bridge that a town cannot yet afford; for a community whose population, needs, and coastline keep shifting, it may be the more durable choice precisely because it is the one built to change.";

const theReturnOfTheFerryDigitalShsatPracticeTest3Questions: ExamQuestion[] = [
  {
    "id": "the-return-of-the-ferry-digital-shsat-practice-test-3-1",
    "explanation": "The passage traces Corbin Island's ferry decision through cost, flexibility, ecology, and resident reaction, and paragraph 6 ties these threads together by arguing that a ferry's ability to change with a community can make it the more durable choice, which is the passage's central idea rather than a blanket claim against bridges or about cost alone.",
    "explanationHtml": "<p>The passage traces Corbin Island's ferry decision through cost, flexibility, ecology, and resident reaction, and paragraph 6 ties these threads together by arguing that a ferry's ability to change with a community can make it the more durable choice, which is the passage's central idea rather than a blanket claim against bridges or about cost alone.</p>",
    "points": 1,
    "prompt": "Which statement best expresses the central idea of the passage?",
    "promptHtml": "Which statement best expresses the central idea of the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Corbin Island residents were, at first, strongly opposed to any change in how they reached the mainland.",
        "text": "Corbin Island residents were, at first, strongly opposed to any change in how they reached the mainland."
      },
      {
        "id": "B",
        "html": "Bridges are an outdated form of technology that every coastal community should quickly abandon.",
        "text": "Bridges are an outdated form of technology that every coastal community should quickly abandon."
      },
      {
        "id": "C",
        "html": "A flexible option like a ferry can suit a changing town better than a fixed, permanent bridge.",
        "text": "A flexible option like a ferry can suit a changing town better than a fixed, permanent bridge."
      },
      {
        "id": "D",
        "html": "Ferry systems are always cheaper to operate than bridges are over several decades of continuous service.",
        "text": "Ferry systems are always cheaper to operate than bridges are over several decades of continuous service."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "the-return-of-the-ferry-digital-shsat-practice-test-3-2",
    "explanation": "Paragraph 2 makes the general claim that a ferry route can be adjusted as needs change, and paragraph 3 develops that claim with a specific case — Corbin Island's schedule adjustments after low ridership — which functions as illustrating example rather than a counterargument, a shift in focus, or a repeat of the cost figures.",
    "explanationHtml": "<p>Paragraph 2 makes the general claim that a ferry route can be adjusted as needs change, and paragraph 3 develops that claim with a specific case — Corbin Island's schedule adjustments after low ridership — which functions as illustrating example rather than a counterargument, a shift in focus, or a repeat of the cost figures.</p>",
    "points": 1,
    "prompt": "How does paragraph 3 contribute to the development of ideas in the passage?",
    "promptHtml": "How does paragraph 3 contribute to the development of ideas in the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It introduces an example that illustrates the flexibility described just before it.",
        "text": "It introduces an example that illustrates the flexibility described just before it."
      },
      {
        "id": "B",
        "html": "It shifts the passage's focus away from Corbin Island toward coastal towns in general.",
        "text": "It shifts the passage's focus away from Corbin Island toward coastal towns in general."
      },
      {
        "id": "C",
        "html": "It presents a counterargument that the rest of the passage then goes on to disprove.",
        "text": "It presents a counterargument that the rest of the passage then goes on to disprove."
      },
      {
        "id": "D",
        "html": "It restates the financial comparison that was already made back in paragraph 1.",
        "text": "It restates the financial comparison that was already made back in paragraph 1."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-return-of-the-ferry-digital-shsat-practice-test-3-3",
    "explanation": "This sentence explicitly names the environmental mechanism — altered tidal flow and sediment movement caused by bridge pilings — while the other choices discuss cost, maintenance, or reliability rather than environmental effects.",
    "explanationHtml": "<p>This sentence explicitly names the environmental mechanism — altered tidal flow and sediment movement caused by bridge pilings — while the other choices discuss cost, maintenance, or reliability rather than environmental effects.</p>",
    "points": 1,
    "prompt": "Which sentence from the passage best supports the idea that a bridge can affect the natural environment around it?",
    "promptHtml": "Which sentence from the passage best supports the idea that a bridge can affect the natural environment around it?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "&quot;A bridge, once built, requires little beyond routine maintenance for decades. A ferry system needs fuel, crew wages, and dock upkeep every single day it runs.&quot; (paragraph 2)",
        "text": "\"A bridge, once built, requires little beyond routine maintenance for decades. A ferry system needs fuel, crew wages, and dock upkeep every single day it runs.\" (paragraph 2)"
      },
      {
        "id": "B",
        "html": "&quot;A crossing longer than roughly three miles, or one that faces open ocean swell...quickly becomes unreliable.&quot; (paragraph 5)",
        "text": "\"A crossing longer than roughly three miles, or one that faces open ocean swell...quickly becomes unreliable.\" (paragraph 5)"
      },
      {
        "id": "C",
        "html": "&quot;A new bridge would cost an estimated forty-one million dollars and take six years to build.&quot; (paragraph 1)",
        "text": "\"A new bridge would cost an estimated forty-one million dollars and take six years to build.\" (paragraph 1)"
      },
      {
        "id": "D",
        "html": "&quot;A bridge permanently alters the tidal flow beneath it, since its pilings interrupt the natural movement of sediment.&quot; (paragraph 4)",
        "text": "\"A bridge permanently alters the tidal flow beneath it, since its pilings interrupt the natural movement of sediment.\" (paragraph 4)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "the-return-of-the-ferry-digital-shsat-practice-test-3-4",
    "explanation": "Paragraph 5 specifically names distance beyond about three miles and exposure to open ocean swell, rather than a sheltered sound, as the conditions that make a ferry unreliable, so a crossing meeting both of those conditions is the one the passage's details most directly point to as a poor fit.",
    "explanationHtml": "<p>Paragraph 5 specifically names distance beyond about three miles and exposure to open ocean swell, rather than a sheltered sound, as the conditions that make a ferry unreliable, so a crossing meeting both of those conditions is the one the passage's details most directly point to as a poor fit.</p>",
    "points": 1,
    "prompt": "What do the details in paragraph 5 reveal about the kind of crossing that makes a ferry route a poor choice?",
    "promptHtml": "What do the details in paragraph 5 reveal about the kind of crossing that makes a ferry route a poor choice?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "They suggest that a crossing served by only one ferry boat instead of a rotating fleet is inherently unsafe.",
        "text": "They suggest that a crossing served by only one ferry boat instead of a rotating fleet is inherently unsafe."
      },
      {
        "id": "B",
        "html": "They indicate that a crossing under two miles long but through a busy shipping channel is well suited to a ferry.",
        "text": "They indicate that a crossing under two miles long but through a busy shipping channel is well suited to a ferry."
      },
      {
        "id": "C",
        "html": "They show that a crossing facing open ocean swell beyond roughly three miles is poorly suited to a ferry.",
        "text": "They show that a crossing facing open ocean swell beyond roughly three miles is poorly suited to a ferry."
      },
      {
        "id": "D",
        "html": "They imply that a crossing already connected by a single paved public road no longer needs a ferry at all.",
        "text": "They imply that a crossing already connected by a single paved public road no longer needs a ferry at all."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "the-return-of-the-ferry-digital-shsat-practice-test-3-5",
    "explanation": "The dollar amounts, ridership percentages, and mileage figures throughout the passage support and specify the larger argument about flexibility versus permanence rather than functioning as a critique of the decision, of residents, or as evidence about the town's wealth.",
    "explanationHtml": "<p>The dollar amounts, ridership percentages, and mileage figures throughout the passage support and specify the larger argument about flexibility versus permanence rather than functioning as a critique of the decision, of residents, or as evidence about the town's wealth.</p>",
    "points": 1,
    "prompt": "The author most likely includes the specific ridership and cost figures throughout the passage in order to",
    "promptHtml": "The author most likely includes the specific ridership and cost figures throughout the passage in order to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "openly criticize residents who doubted the new ferry schedule during its first year of service.",
        "text": "openly criticize residents who doubted the new ferry schedule during its first year of service."
      },
      {
        "id": "B",
        "html": "ground a broader argument about transportation flexibility in verifiable, concrete detail.",
        "text": "ground a broader argument about transportation flexibility in verifiable, concrete detail."
      },
      {
        "id": "C",
        "html": "suggest that Corbin Island is a notably wealthier community than most other coastal towns.",
        "text": "suggest that Corbin Island is a notably wealthier community than most other coastal towns."
      },
      {
        "id": "D",
        "html": "prove definitively that county planners made a financial mistake in choosing the ferry over a bridge.",
        "text": "prove definitively that county planners made a financial mistake in choosing the ferry over a bridge."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-return-of-the-ferry-digital-shsat-practice-test-3-6",
    "explanation": "The passage repeatedly returns to \"flexibility\" — a route that \"can be shortened, lengthened, or rerouted\" versus a bridge \"fixed in place\" — to ground its larger argument that an adjustable transportation option can serve a changing town better than a permanent one, not to describe constant unplanned changes, planners' regret, or a boat's physical construction.",
    "explanationHtml": "<p>The passage repeatedly returns to &quot;flexibility&quot; — a route that &quot;can be shortened, lengthened, or rerouted&quot; versus a bridge &quot;fixed in place&quot; — to ground its larger argument that an adjustable transportation option can serve a changing town better than a permanent one, not to describe constant unplanned changes, planners' regret, or a boat's physical construction.</p>",
    "points": 1,
    "prompt": "The word \"flexibility,\" repeated throughout the passage, is used mainly to",
    "promptHtml": "The word &quot;flexibility,&quot; repeated throughout the passage, is used mainly to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "suggest that Corbin Island's ferry schedule changes constantly without any real planning.",
        "text": "suggest that Corbin Island's ferry schedule changes constantly without any real planning."
      },
      {
        "id": "B",
        "html": "hint that ferries are physically more flexible boats than the ones used decades ago.",
        "text": "hint that ferries are physically more flexible boats than the ones used decades ago."
      },
      {
        "id": "C",
        "html": "underscore the argument that an adjustable option can outlast a fixed, permanent one.",
        "text": "underscore the argument that an adjustable option can outlast a fixed, permanent one."
      },
      {
        "id": "D",
        "html": "imply that county planners regret not building a bridge instead of a ferry route.",
        "text": "imply that county planners regret not building a bridge instead of a ferry route."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "the-return-of-the-ferry-digital-shsat-practice-test-3-7",
    "explanation": "After introducing Corbin Island's choice in paragraph 1, the passage examines it in turn through cost, flexibility, ecology, feasibility, and resident reaction before a concluding paragraph, an organization built around considerations rather than opposing experts, strict chronology, or comparison to other named towns.",
    "explanationHtml": "<p>After introducing Corbin Island's choice in paragraph 1, the passage examines it in turn through cost, flexibility, ecology, feasibility, and resident reaction before a concluding paragraph, an organization built around considerations rather than opposing experts, strict chronology, or comparison to other named towns.</p>",
    "points": 1,
    "prompt": "The passage as a whole is organized primarily by",
    "promptHtml": "The passage as a whole is organized primarily by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "presenting two opposing named experts and explaining why one expert's view is ultimately correct.",
        "text": "presenting two opposing named experts and explaining why one expert's view is ultimately correct."
      },
      {
        "id": "B",
        "html": "describing a single decision and then examining it in turn.",
        "text": "describing a single decision and then examining it in turn."
      },
      {
        "id": "C",
        "html": "comparing Corbin Island's ferry directly to the ferry systems used in several other named coastal towns.",
        "text": "comparing Corbin Island's ferry directly to the ferry systems used in several other named coastal towns."
      },
      {
        "id": "D",
        "html": "narrating events about the ferry service in strict chronological order, from its earliest days to today.",
        "text": "narrating events about the ferry service in strict chronological order, from its earliest days to today."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const theReturnOfTheFerryDigitalShsatPracticeTest3PassageSet: ExamPassageSet = {
  id: "ela-the-return-of-the-ferry-digital-shsat-practice-test-3",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: theReturnOfTheFerryDigitalShsatPracticeTest3Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "the-return-of-the-ferry-digital-shsat-practice-test-3",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "The Return of the Ferry",
    passageType: "informational",
    passageCategory: "prestige",
    richText: "<p>For most of the twentieth century, the small towns strung along Fenwick Sound reached the mainland the same way: by bridge, or not at all. When the last swing bridge to Corbin Island rusted past repair in 2019, engineers offered the county two choices, and only two. A new bridge would cost an estimated forty-one million dollars and take six years to build. A passenger ferry, running four boats on a rotating schedule, would cost under three million dollars to launch and could begin service within a single season. The county chose the ferry, and in doing so it joined a small but growing number of coastal communities that are rediscovering a mode of transportation many assumed had been retired for good.</p><p>The economics of the choice are not as simple as the sticker price suggests. A bridge, once built, requires little beyond routine maintenance for decades. A ferry system needs fuel, crew wages, and dock upkeep every single day it runs, so its yearly operating cost can eventually rival what a bridge would have cost to build in the first place. What tips the balance for many small islands is not the ferry's cost but its flexibility: a ferry route can be shortened, lengthened, or rerouted entirely as a town's population shifts, while a bridge is fixed in place for the rest of its useful life, whether or not the traffic that justified it ever arrives.</p><p>Corbin Island's new service illustrates the tradeoff plainly. Ridership in its first year fell forty percent short of the county's projections, largely because commuters accustomed to a fixed bridge schedule were slow to trust a boat timetable that could be delayed by fog or rough water. County planners responded not by abandoning the route but by adjusting it, adding a midday run for parents picking up children from school and cutting an underused late-night crossing. A bridge could not have been resized in this way; once poured, its two lanes serve the same traffic pattern in year thirty as they did in year one, useful or not.</p><p>Ferries also carry an ecological argument that a growing number of coastal planners find persuasive. A bridge permanently alters the tidal flow beneath it, since its pilings interrupt the natural movement of sediment along a channel floor, and the altered currents can erode nearby beaches over a period of years. A ferry route leaves the water itself untouched. For sounds and inlets that support commercial shellfish beds, this difference can matter more to a local economy than the convenience of driving straight across.</p><p>None of this makes ferries the obvious choice everywhere. A crossing longer than roughly three miles, or one that faces open ocean swell rather than a sheltered sound, quickly becomes unreliable in exactly the kind of weather when islanders most need to reach the mainland, for a medical emergency or a delivery of supplies. Corbin Island's route crosses just under two miles of a well-protected sound, conditions closer to a wide river than to open water, and that geography did as much to make the choice practical as the forty-million-dollar gap in cost.</p><p>Local reaction has shifted along with the schedule. Early complaints centered on the inconvenience of planning around tide tables instead of simply driving whenever one pleased, and a handful of residents pushed the county to revisit the bridge proposal even after construction bids came in. By the service's second year, however, county surveys showed a majority of year-round residents preferring the ferry to the bridge that had once seemed inevitable, citing the added midday run and the absence of the constant truck traffic a bridge would likely have brought to the island's single two-lane road.</p><p>What the Corbin Island case suggests, and what several similar projects along the Atlantic and Gulf coasts have since confirmed, is that the old assumption — that a permanent link is always the more modern solution — deserves to be questioned rather than simply accepted. A ferry is not merely a temporary substitute for a bridge that a town cannot yet afford; for a community whose population, needs, and coastline keep shifting, it may be the more durable choice precisely because it is the one built to change.</p>",
    text: theReturnOfTheFerryDigitalShsatPracticeTest3PassageText,
    versionLabel: "Digital SHSAT Practice Test 3",
  }),
  questions: theReturnOfTheFerryDigitalShsatPracticeTest3Questions,
};
