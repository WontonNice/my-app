import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheNeighborhoodNextDoorIsHotterThanYoursDigitalShsatPracticeTest2PassageText = "On a July afternoon when the official forecast reads ninety-two degrees, a single city can quietly contain half a dozen different climates. A dashboard thermometer crossing from a leafy residential street into a treeless commercial strip can climb several degrees in the space of a few blocks, without a cloud moving and without the sun getting any closer. Researchers who study this pattern call it the urban heat island effect, and one of the clearest predictors of how badly a given neighborhood suffers from it turns out to be a number city planners rarely mentioned until recently: the percentage of that neighborhood covered by tree canopy.\n\nThe physical mechanism is straightforward once it is spelled out. Pavement, roofing, and dark building materials absorb solar radiation efficiently and release it back as heat throughout the afternoon and evening, a process scientists call thermal mass. A mature tree canopy interrupts that cycle in two ways at once: its leaves intercept sunlight before it ever strikes the pavement below, and the tree continuously releases water vapor through its leaves in a cooling process called transpiration, which lowers the surrounding air temperature the way sweat cools skin. A block with dense tree cover is, in effect, running its own modest air-conditioning system for free, all day, without anyone flipping a switch.\n\nA research team studying temperature variation across one mid-sized city set out to measure how much difference canopy coverage actually made, rather than assume it from the general mechanism. Volunteers mounted temperature sensors on bicycles and rode fixed routes through six neighborhoods at the same hour on the same clear afternoon, chosen specifically to eliminate weather as a variable. Each neighborhood's canopy coverage had already been mapped separately using aerial imagery, so the team could compare temperature readings against a percentage figure for each area rather than a vague impression of \"leafy\" versus \"not leafy.\"\n\nThe results, summarized in the accompanying figure, showed a relationship too consistent to dismiss as coincidence. The neighborhood with the lowest canopy coverage recorded the highest average afternoon temperature of the six studied, while the neighborhood with the highest canopy coverage recorded the lowest, with the other four neighborhoods falling in between in almost the same order as their canopy percentages. The gap between the hottest and coolest neighborhoods that afternoon was large enough that a resident walking between them would notice it directly, without needing a thermometer to confirm what their own skin was already telling them.\n\nWhat surprised the research team was not that trees cooled their surroundings, which nobody seriously doubted going in, but how unevenly canopy coverage happened to be distributed across the city to begin with. The neighborhoods with the thinnest canopy were, disproportionately, the same neighborhoods with older industrial zoning, narrower residential lots, and fewer public parks, a pattern the team traced back to decisions about street width and lot planning made decades earlier, long before anyone involved in those decisions had heard the term urban heat island.\n\nThe consequences of that historical unevenness are not evenly distributed either. Higher afternoon and evening temperatures translate directly into higher electricity demand for air conditioning, which falls hardest on residents who can least afford a larger utility bill, and into greater heat-related health risk for anyone without reliable indoor cooling. A canopy gap that traces back to a decision made generations ago about how densely to build a neighborhood turns out to still be measurable in a modern resident's monthly bills and their risk during a heat wave, which is a much longer reach for an old zoning map than most people would expect.\n\nSeveral cities that have reviewed findings like these have begun treating tree planting less as a beautification project and more as a piece of infrastructure, budgeted and tracked the way a city tracks sewer lines or streetlights. Some now require a minimum canopy percentage for new residential developments, and a few have begun prioritizing new plantings specifically in the neighborhoods that measured hottest, rather than distributing new trees evenly across a city regardless of existing coverage. Advocates of this approach argue that an evenly distributed number of new trees, spread without regard for where the gaps already are, does little to close the specific gap that the temperature data revealed.\n\nNone of this makes a single newly planted tree an instant fix. A young sapling provides only a fraction of the shade and transpiration of the mature canopy that produced the readings described above, and that canopy took decades to grow. What the temperature data does offer is a more precise account of where the investment should go first, replacing the old assumption that shade was simply a pleasant extra with the more exact finding that its absence carries a measurable, mappable cost.";

const excerptFromTheNeighborhoodNextDoorIsHotterThanYoursDigitalShsatPracticeTest2Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2-passage-1",
    "explanation": "Correct Answer: A\nExplanation: Describing a tree as running an \"air-conditioning system for free\" is a light, appreciative turn of phrase, not an alarmed or purely technical one.\nA. Correct: Calling a tree's cooling effect a free \"air-conditioning system\" is an appreciative, slightly wry turn of phrase.\nB. Incorrect: The phrase is playful rather than alarming; it does not warn of urgent danger.\nC. Incorrect: Casting a tree's cooling as a \"system\" running \"for free\" treats the effect as real and valuable, not negligible.\nD. Incorrect: The phrase's playful comparison is far from formal or detached.",
    "explanationHtml": "<p>Correct Answer: A <br><br>\nExplanation: Describing a tree as running an &quot;air-conditioning system for free&quot; is a light, appreciative turn of phrase, not an alarmed or purely technical one. <br><br>\nA. Correct: Calling a tree's cooling effect a free &quot;air-conditioning system&quot; is an appreciative, slightly wry turn of phrase. <br><br>\nB. Incorrect: The phrase is playful rather than alarming; it does not warn of urgent danger. <br><br>\nC. Incorrect: Casting a tree's cooling as a &quot;system&quot; running &quot;for free&quot; treats the effect as real and valuable, not negligible. <br><br>\nD. Incorrect: The phrase's playful comparison is far from formal or detached.</p>",
    "points": 1,
    "prompt": "The author's word choice in describing a block with dense tree cover as running \"its own modest air-conditioning system for free\" most strongly conveys which tone?",
    "promptHtml": "The author's word choice in describing a block with dense tree cover as running &quot;its own modest air-conditioning system for free&quot; <strong>most strongly</strong> conveys which tone?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Appreciative and slightly wry, casting a tree's natural cooling effect as a clever, unpaid service.",
        "text": "Appreciative and slightly wry, casting a tree's natural cooling effect as a clever, unpaid service."
      },
      {
        "id": "B",
        "html": "Alarmed, warning readers urgently about a dangerous and increasingly unavoidable citywide problem that demands attention.",
        "text": "Alarmed, warning readers urgently about a dangerous and increasingly unavoidable citywide problem that demands attention."
      },
      {
        "id": "C",
        "html": "Dismissive, suggesting that a neighborhood's tree canopy makes little real difference to its temperature.",
        "text": "Dismissive, suggesting that a neighborhood's tree canopy makes little real difference to its temperature."
      },
      {
        "id": "D",
        "html": "Formal and detached, avoiding any personal judgment about the findings.",
        "text": "Formal and detached, avoiding any personal judgment about the findings."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2-passage-2",
    "explanation": "Correct Answer: A\nExplanation: The figure shows Riverside Flats at 8% canopy and 98°F, the lowest coverage paired with the highest temperature among the six neighborhoods.\nA. Correct: Riverside Flats has the lowest canopy coverage in the figure and the highest recorded afternoon temperature.\nB. Incorrect: The figure shows a clear inverse pattern between canopy coverage and temperature across the neighborhoods.\nC. Incorrect: The figure does not single out Cedar Grove as pairing the lowest canopy with the highest temperature; that pairing belongs to Riverside Flats.\nD. Incorrect: The figure shows meaningfully different temperatures across the six neighborhoods, not nearly identical readings.",
    "explanationHtml": "<p>Correct Answer: A <br><br>\nExplanation: The figure shows Riverside Flats at 8% canopy and 98°F, the lowest coverage paired with the highest temperature among the six neighborhoods. <br><br>\nA. Correct: Riverside Flats has the lowest canopy coverage in the figure and the highest recorded afternoon temperature. <br><br>\nB. Incorrect: The figure shows a clear inverse pattern between canopy coverage and temperature across the neighborhoods. <br><br>\nC. Incorrect: The figure does not single out Cedar Grove as pairing the lowest canopy with the highest temperature; that pairing belongs to Riverside Flats. <br><br>\nD. Incorrect: The figure shows meaningfully different temperatures across the six neighborhoods, not nearly identical readings.</p>",
    "points": 1,
    "prompt": "Based on the figure and the passage, which conclusion is best supported?",
    "promptHtml": "Based on the figure and the passage, which conclusion is <strong>best</strong> supported?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Riverside Flats, with the lowest canopy coverage, recorded the highest afternoon temperature of the six neighborhoods.",
        "text": "Riverside Flats, with the lowest canopy coverage, recorded the highest afternoon temperature of the six neighborhoods."
      },
      {
        "id": "B",
        "html": "Canopy coverage and afternoon temperature show no consistent relationship across the six neighborhoods.",
        "text": "Canopy coverage and afternoon temperature show no consistent relationship across the six neighborhoods."
      },
      {
        "id": "C",
        "html": "Cedar Grove's especially low canopy coverage directly and fully explains its unusually high recorded temperature.",
        "text": "Cedar Grove's especially low canopy coverage directly and fully explains its unusually high recorded temperature."
      },
      {
        "id": "D",
        "html": "All six neighborhoods recorded nearly identical afternoon temperatures despite differing canopy coverage.",
        "text": "All six neighborhoods recorded nearly identical afternoon temperatures despite differing canopy coverage."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2-passage-3",
    "explanation": "Correct Answer: C\nExplanation: The passage traces today's uneven heat exposure back to zoning and lot-planning decisions made decades earlier, long before urban heat islands were studied.\nA. Incorrect: The passage traces today's uneven heat exposure back to decisions made decades ago, not recent ones.\nB. Incorrect: The passage does not claim cities lack historical records; it describes zoning decisions that are traceable.\nC. Correct: Zoning decisions made long before urban heat islands were understood still shape who is most affected by heat today.\nD. Incorrect: The passage does not claim older neighborhoods are always better planned overall, only that some had less tree canopy built in.",
    "explanationHtml": "<p>Correct Answer: C <br><br>\nExplanation: The passage traces today's uneven heat exposure back to zoning and lot-planning decisions made decades earlier, long before urban heat islands were studied. <br><br>\nA. Incorrect: The passage traces today's uneven heat exposure back to decisions made decades ago, not recent ones. <br><br>\nB. Incorrect: The passage does not claim cities lack historical records; it describes zoning decisions that are traceable. <br><br>\nC. Correct: Zoning decisions made long before urban heat islands were understood still shape who is <strong>most</strong> affected by heat today. <br><br>\nD. Incorrect: The passage does not claim older neighborhoods are always better planned overall, only that some had less tree canopy built in.</p>",
    "points": 1,
    "prompt": "Which theme is most directly developed through the passage's discussion of old zoning decisions?",
    "promptHtml": "Which theme is <strong>most directly</strong> developed through the passage's discussion of old zoning decisions?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Environmental problems are usually caused mainly by decisions made recently rather than long ago in the past.",
        "text": "Environmental problems are usually caused mainly by decisions made recently rather than long ago in the past."
      },
      {
        "id": "B",
        "html": "Cities rarely have enough historical records to understand how their neighborhoods developed.",
        "text": "Cities rarely have enough historical records to understand how their neighborhoods developed."
      },
      {
        "id": "C",
        "html": "Decisions made long before a problem is understood can still shape who is most affected by it today.",
        "text": "Decisions made long before a problem is understood can still shape who is most affected by it today."
      },
      {
        "id": "D",
        "html": "Older neighborhoods are, generally speaking, always better planned and maintained than newly built ones today.",
        "text": "Older neighborhoods are, generally speaking, always better planned and maintained than newly built ones today."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2-passage-4",
    "explanation": "Correct Answer: B\nExplanation: The passage moves from the mechanism of cooling, through measured evidence, to the uneven historical distribution of canopy and its real consequences -- the throughline the whole piece develops.\nA. Incorrect: The passage does not call for halting new development; it focuses on the uneven distribution and effects of existing canopy.\nB. Correct: The passage traces tree canopy's measurable cooling effect and its uneven distribution to its real consequences for residents.\nC. Incorrect: The passage does not suggest the cooling benefit of trees is a brand-new discovery.\nD. Incorrect: The passage presents tree cover as a valuable complement to cooling, not as something air conditioning has made unnecessary.",
    "explanationHtml": "<p>Correct Answer: B <br><br>\nExplanation: The passage moves from the mechanism of cooling, through measured evidence, to the uneven historical distribution of canopy and its real consequences -- the throughline the whole piece develops. <br><br>\nA. Incorrect: The passage does not call for halting new development; it focuses on the uneven distribution and effects of existing canopy. <br><br>\nB. Correct: The passage traces tree canopy's measurable cooling effect and its uneven distribution to its real consequences for residents. <br><br>\nC. Incorrect: The passage does not suggest the cooling benefit of trees is a brand-new discovery. <br><br>\nD. Incorrect: The passage presents tree cover as a valuable complement to cooling, not as something air conditioning has made unnecessary.</p>",
    "points": 1,
    "prompt": "Which statement best expresses the central idea of the passage as a whole?",
    "promptHtml": "Which statement <strong>best</strong> expresses the central idea of the passage as a whole?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Cities should stop approving new residential developments until every neighborhood has exactly equal tree cover.",
        "text": "Cities should stop approving new residential developments until every neighborhood has exactly equal tree cover."
      },
      {
        "id": "B",
        "html": "Tree canopy affects neighborhood temperature, and its uneven distribution has real consequences felt unevenly by residents.",
        "text": "Tree canopy affects neighborhood temperature, and its uneven distribution has real consequences felt unevenly by residents."
      },
      {
        "id": "C",
        "html": "Scientists have only very recently discovered that trees provide any real cooling benefit at all.",
        "text": "Scientists have only very recently discovered that trees provide any real cooling benefit at all."
      },
      {
        "id": "D",
        "html": "Modern air conditioning technology has essentially made natural tree cover unnecessary for keeping neighborhoods cool today.",
        "text": "Modern air conditioning technology has essentially made natural tree cover unnecessary for keeping neighborhoods cool today."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2-passage-5",
    "explanation": "Correct Answer: A\nExplanation: This sentence directly connects higher temperatures to increased utility costs and specifically to the residents least able to absorb them.\nA. Correct: Higher temperatures raising electricity demand, a cost that falls hardest on residents who can least afford it, directly supports the financial-burden claim.\nB. Incorrect: This detail explains the mechanism of cooling, not the financial burden of higher temperatures.\nC. Incorrect: This detail describes the study's method of data collection, not a financial consequence of heat.\nD. Incorrect: This detail compares shade from saplings and mature trees, not financial burdens on residents.",
    "explanationHtml": "<p>Correct Answer: A <br><br>\nExplanation: This sentence directly connects higher temperatures to increased utility costs and specifically to the residents least able to absorb them. <br><br>\nA. Correct: Higher temperatures raising electricity demand, a cost that falls hardest on residents who can least afford it, directly supports the financial-burden claim. <br><br>\nB. Incorrect: This detail explains the mechanism of cooling, not the financial burden of higher temperatures. <br><br>\nC. Incorrect: This detail describes the study's method of data collection, not a financial consequence of heat. <br><br>\nD. Incorrect: This detail compares shade from saplings and mature trees, not financial burdens on residents.</p>",
    "points": 1,
    "prompt": "Which detail best supports the claim that higher neighborhood temperatures create financial burdens for residents?",
    "promptHtml": "Which detail <strong>best</strong> supports the claim that higher neighborhood temperatures create financial burdens for residents?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Higher temperatures raise electricity demand for air conditioning, a cost that falls hardest on residents who can least afford it.",
        "text": "Higher temperatures raise electricity demand for air conditioning, a cost that falls hardest on residents who can least afford it."
      },
      {
        "id": "B",
        "html": "The passage's early description of transpiration as a slow, gradual, natural cooling process occurring in leaves.",
        "text": "The passage's early description of transpiration as a slow, gradual, natural cooling process occurring in leaves."
      },
      {
        "id": "C",
        "html": "The passage's brief description of volunteers riding bicycles around town to collect temperature data each afternoon.",
        "text": "The passage's brief description of volunteers riding bicycles around town to collect temperature data each afternoon."
      },
      {
        "id": "D",
        "html": "The claim that a young, newly planted sapling provides noticeably less shade than a fully mature tree.",
        "text": "The claim that a young, newly planted sapling provides noticeably less shade than a fully mature tree."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2-passage-6",
    "explanation": "Correct Answer: C\nExplanation: The comparison uses a familiar bodily sensation to make the less familiar process of transpiration easier to grasp, not to claim the two processes are identical.\nA. Incorrect: The comparison is meant to aid understanding, not to claim the two cooling processes are scientifically identical.\nB. Incorrect: The comparison supports, rather than criticizes, the idea that trees provide a real cooling benefit.\nC. Correct: Comparing transpiration to sweat cooling skin makes an unfamiliar process easier to picture using something the reader has felt firsthand.\nD. Incorrect: The comparison relates to a term already used earlier, not one the passage defines afterward.",
    "explanationHtml": "<p>Correct Answer: C <br><br>\nExplanation: The comparison uses a familiar bodily sensation to make the less familiar process of transpiration easier to grasp, not to claim the two processes are identical. <br><br>\nA. Incorrect: The comparison is meant to aid understanding, not to claim the two cooling processes are scientifically identical. <br><br>\nB. Incorrect: The comparison supports, rather than criticizes, the idea that trees provide a real cooling benefit. <br><br>\nC. Correct: Comparing transpiration to sweat cooling skin makes an unfamiliar process easier to picture using something the reader has felt firsthand. <br><br>\nD. Incorrect: The comparison relates to a term already used earlier, not one the passage defines afterward.</p>",
    "points": 1,
    "prompt": "The comparison of tree transpiration to \"the way sweat cools skin\" serves mainly to do what?",
    "promptHtml": "The comparison of tree transpiration to &quot;the way sweat cools skin&quot; serves <strong>mainly to</strong> do what?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Suggest that trees and humans regulate their body temperature in scientifically identical, interchangeable ways.",
        "text": "Suggest that trees and humans regulate their body temperature in scientifically identical, interchangeable ways."
      },
      {
        "id": "B",
        "html": "Criticize the widespread idea that trees provide any meaningful cooling benefit to nearby neighborhoods at all.",
        "text": "Criticize the widespread idea that trees provide any meaningful cooling benefit to nearby neighborhoods at all."
      },
      {
        "id": "C",
        "html": "Make an unfamiliar process easier to picture by relating it to something the reader has felt firsthand.",
        "text": "Make an unfamiliar process easier to picture by relating it to something the reader has felt firsthand."
      },
      {
        "id": "D",
        "html": "Introduce a brand-new scientific term that the passage goes on to define later in more detail.",
        "text": "Introduce a brand-new scientific term that the passage goes on to define later in more detail."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2-passage-7",
    "explanation": "Mounting sensors and mapping canopy by aerial imagery describe how the study was conducted (method), while the temperature ranking and the link to zoning history describe what the study concluded (findings).",
    "explanationHtml": "<p>Mounting sensors and mapping canopy by aerial imagery describe how the study was conducted (method), while the temperature ranking and the link to zoning history describe what the study concluded (findings).</p>",
    "points": 1,
    "prompt": "For each statement, indicate whether it describes the research team's METHOD or one of its FINDINGS.",
    "instructions": "Move each answer to the correct box.",
    "promptHtml": "For each statement, indicate whether it describes the research team's METHOD or one of its FINDINGS.",
    "topic": "Central Idea & Theme",
    "categories": [
      {
        "id": "category-1",
        "title": "Method"
      },
      {
        "id": "category-2",
        "title": "Finding"
      }
    ],
    "correctPlacements": {
      "item-1": "category-1",
      "item-2": "category-2",
      "item-3": "category-1",
      "item-4": "category-2"
    },
    "items": [
      {
        "html": "Mounted temperature sensors on bicycles and rode fixed routes",
        "id": "item-1",
        "text": "Mounted temperature sensors on bicycles and rode fixed routes"
      },
      {
        "html": "The hottest and coolest neighborhoods followed canopy percentage almost exactly",
        "id": "item-2",
        "text": "The hottest and coolest neighborhoods followed canopy percentage almost exactly"
      },
      {
        "html": "Mapped canopy coverage separately using aerial imagery",
        "id": "item-3",
        "text": "Mapped canopy coverage separately using aerial imagery"
      },
      {
        "html": "Low-canopy neighborhoods traced back to older industrial zoning decisions",
        "id": "item-4",
        "text": "Low-canopy neighborhoods traced back to older industrial zoning decisions"
      }
    ],
    "requiredPlacements": 4,
    "type": "category_sort"
  },
  {
    "id": "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2-passage-8",
    "explanation": "Correct Answer: A\nExplanation: The final paragraph does not contradict the findings but adds an important qualification -- that a single new tree will not instantly close a gap decades in the making.\nA. Correct: The final paragraph qualifies the passage's claim by clarifying what tree planting can and cannot immediately accomplish.\nB. Incorrect: The final paragraph adds a qualification about tree planting, not a repeat of the study's methodology.\nC. Incorrect: The final paragraph adds a qualification to the passage's claim rather than introducing a contradiction to the study's findings.\nD. Incorrect: The final paragraph continues discussing tree planting and temperature, not a shift toward cost.",
    "explanationHtml": "<p>Correct Answer: A <br><br>\nExplanation: The final paragraph does not contradict the findings but adds an important qualification -- that a single new tree will not instantly close a gap decades in the making. <br><br>\nA. Correct: The final paragraph qualifies the passage's claim by clarifying what tree planting can and cannot immediately accomplish. <br><br>\nB. Incorrect: The final paragraph adds a qualification about tree planting, not a repeat of the study's methodology. <br><br>\nC. Incorrect: The final paragraph adds a qualification to the passage's claim rather than introducing a contradiction to the study's findings. <br><br>\nD. Incorrect: The final paragraph continues discussing tree planting and temperature, not a shift toward cost.</p>",
    "points": 1,
    "prompt": "How does the final paragraph function in relation to the rest of the passage?",
    "promptHtml": "How does the final paragraph function in relation to the rest of the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It qualifies the passage's claim by clarifying what tree planting can and cannot immediately fix.",
        "text": "It qualifies the passage's claim by clarifying what tree planting can and cannot immediately fix."
      },
      {
        "id": "B",
        "html": "It summarizes the study's original methodology again, this time in far more technical detail.",
        "text": "It summarizes the study's original methodology again, this time in far more technical detail."
      },
      {
        "id": "C",
        "html": "It introduces a brand-new counterargument that directly contradicts the study's earlier, carefully measured findings.",
        "text": "It introduces a brand-new counterargument that directly contradicts the study's earlier, carefully measured findings."
      },
      {
        "id": "D",
        "html": "It shifts the passage's entire focus away from temperature and toward cost and budgeting instead.",
        "text": "It shifts the passage's entire focus away from temperature and toward cost and budgeting instead."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromTheNeighborhoodNextDoorIsHotterThanYoursDigitalShsatPracticeTest2PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromTheNeighborhoodNextDoorIsHotterThanYoursDigitalShsatPracticeTest2Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from \"The Neighborhood Next Door Is Hotter Than Yours\"",
    author: "Dr. Camille Iversen",
    blurb: "Dr. Camille Iversen is an environmental scientist who studies urban climate patterns. The following is adapted from her article on the urban heat island effect.",
    passageType: "informational",
    passageCategory: "prestige",
    richText: "<p>On a July afternoon when the official forecast reads ninety-two degrees, a single city can quietly contain half a dozen different climates. A dashboard thermometer crossing from a leafy residential street into a treeless commercial strip can climb several degrees in the space of a few blocks, without a cloud moving and without the sun getting any closer. Researchers who study this pattern call it the urban heat island effect, and one of the clearest predictors of how badly a given neighborhood suffers from it turns out to be a number city planners rarely mentioned until recently: the percentage of that neighborhood covered by tree canopy.</p><p>The physical mechanism is straightforward once it is spelled out. Pavement, roofing, and dark building materials absorb solar radiation efficiently and release it back as heat throughout the afternoon and evening, a process scientists call thermal mass. A mature tree canopy interrupts that cycle in two ways at once: its leaves intercept sunlight before it ever strikes the pavement below, and the tree continuously releases water vapor through its leaves in a cooling process called transpiration, which lowers the surrounding air temperature the way sweat cools skin. A block with dense tree cover is, in effect, running its own modest air-conditioning system for free, all day, without anyone flipping a switch.</p><p>A research team studying temperature variation across one mid-sized city set out to measure how much difference canopy coverage actually made, rather than assume it from the general mechanism. Volunteers mounted temperature sensors on bicycles and rode fixed routes through six neighborhoods at the same hour on the same clear afternoon, chosen specifically to eliminate weather as a variable. Each neighborhood's canopy coverage had already been mapped separately using aerial imagery, so the team could compare temperature readings against a percentage figure for each area rather than a vague impression of &quot;leafy&quot; versus &quot;not leafy.&quot;</p><p>The results, summarized in the accompanying figure, showed a relationship too consistent to dismiss as coincidence. The neighborhood with the lowest canopy coverage recorded the highest average afternoon temperature of the six studied, while the neighborhood with the highest canopy coverage recorded the lowest, with the other four neighborhoods falling in between in almost the same order as their canopy percentages. The gap between the hottest and coolest neighborhoods that afternoon was large enough that a resident walking between them would notice it directly, without needing a thermometer to confirm what their own skin was already telling them.</p><p>What surprised the research team was not that trees cooled their surroundings, which nobody seriously doubted going in, but how unevenly canopy coverage happened to be distributed across the city to begin with. The neighborhoods with the thinnest canopy were, disproportionately, the same neighborhoods with older industrial zoning, narrower residential lots, and fewer public parks, a pattern the team traced back to decisions about street width and lot planning made decades earlier, long before anyone involved in those decisions had heard the term urban heat island.</p><p>The consequences of that historical unevenness are not evenly distributed either. Higher afternoon and evening temperatures translate directly into higher electricity demand for air conditioning, which falls hardest on residents who can least afford a larger utility bill, and into greater heat-related health risk for anyone without reliable indoor cooling. A canopy gap that traces back to a decision made generations ago about how densely to build a neighborhood turns out to still be measurable in a modern resident's monthly bills and their risk during a heat wave, which is a much longer reach for an old zoning map than most people would expect.</p><p>Several cities that have reviewed findings like these have begun treating tree planting less as a beautification project and more as a piece of infrastructure, budgeted and tracked the way a city tracks sewer lines or streetlights. Some now require a minimum canopy percentage for new residential developments, and a few have begun prioritizing new plantings specifically in the neighborhoods that measured hottest, rather than distributing new trees evenly across a city regardless of existing coverage. Advocates of this approach argue that an evenly distributed number of new trees, spread without regard for where the gaps already are, does little to close the specific gap that the temperature data revealed.</p><p>None of this makes a single newly planted tree an instant fix. A young sapling provides only a fraction of the shade and transpiration of the mature canopy that produced the readings described above, and that canopy took decades to grow. What the temperature data does offer is a more precise account of where the investment should go first, replacing the old assumption that shade was simply a pleasant extra with the more exact finding that its absence carries a measurable, mappable cost.</p>",
    text: excerptFromTheNeighborhoodNextDoorIsHotterThanYoursDigitalShsatPracticeTest2PassageText,
    versionLabel: "Digital SHSAT Practice Test 2",
  }),
  questions: excerptFromTheNeighborhoodNextDoorIsHotterThanYoursDigitalShsatPracticeTest2Questions,
};
