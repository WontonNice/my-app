import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheWorldHasAnEWasteProblem20222023FormBPassageText = "As a tech-hungry nation... gets ready to upgrade to the next generation of lightning-fast 5G devices, there is a surprising environmental cost to be reckoned with: a fresh mountain of obsolete1 gadgets. About 6 million pounds of discarded electronics are already processed monthly at recycling giant ERI’s Fresno plant. Pallets2 of once beloved but now outdated devices... arrive here daily. Workers with hammers hack at the bulkiest devices, while others remove dangerous components like lithium-ion batteries. The scene is like a twisted... movie, with doomed gadgets riding an unrelenting conveyor belt into a machine that shreds them into piles of copper, aluminum and steel.\n\n“In our society, we always have to have the new, best product,” said Aaron Blum, the co-founder and chief operating officer of ERI, on a tour of the facility. Americans spent $71 billion on telephone and communication equipment in 2017, nearly five times what they spent in 2010 even when adjusted for inflation, according to the Bureau of Economic Analysis.... When we buy something new, we get rid of what’s old. That cycle of consumption has made electronics waste the world’s fastest-growing solid-waste stream.\n\nThat stream is expected to turn into a torrent3 as the world upgrades to 5G, the next big step in wireless technology. 5G promises faster speeds and other benefits. But experts say it will also result in a dramatic increase in e-waste, as millions of smartphones, modems and other gadgets incompatible with 5G networks are made obsolete. “I don’t think people understand the magnitude of the transition,” says ERI co-founder and executive chairman John Shegerian. “This is bigger than the change of black-and-white to color, bigger than analog to digital, by many multitudes.”\n\n... Less than a quarter of all U.S. electronic waste is recycled, according to a United Nations estimate. The rest is incinerated or ends up in landfills. That’s bad news, as e-waste can contain harmful materials like mercury and beryllium that pose environmental risks.\n\nPart of the problem is regulatory. Only 19 states have laws banning electronics from the regular trash. In states without such rules, like Nevada, electronics often end up in garbage and recycling bins, said Jeremy Walters, a community-relations manager for waste collector Republic Services. Environmental concerns aside, compacting flammable lithium-ion batteries with paper recycling can be dangerous; recycling centers have reported an uptick in fires.\n\nEven when e-waste rules exist, it’s left up to consumers to handle their old devices properly. But recycling them can be a pain. Rather than just drop a used phone in a bin outside their homes, lots of people have to take their electronics to a store, which may pay them for it but could also charge them to get rid of it. Many consumers, paralyzed by the hassle or put off by the expense, simply throw their devicesinto the trash or stash them in a drawer, hoping they’ll just disappear. “We don’t necessarily have the measures to make sure people aren’t throwing it away,” Walters said.\n\nOne solution is to make electronics last as long as they once did. At ERI’s facility, Shegerian showed TIME [magazine] dozens of televisions from the 1970s and 1980s that stopped working only recently. Yet instead, technology companies are speeding the pace of obsolescence. Most smartphone batteries can’t be easily replaced when they stop holding a charge, new laptops don’t accept old cables, and software companies push upgrades that won’t run on old devices. “Our products today don’t last as long as they used to, and it’s a strategy by manufacturers to force us into shorter and shorter upgrade cycles,” said Kyle Wiens, the founder of iFixit, which publishes do-it-yourself repair guides....\n\nSome environmental groups say multibillion-dollar companies... should pick up the cost of recycling the devices they sell. Lawmakers in parts of Europe and Canada and in some U.S. states have passed so-called Extended Producer Responsibility (EPR) laws, which require manufacturers to establish and fund systems to recycle or collect obsolete products....\n\n... Some companies are increasing their recycling efforts on their own, whether for the economic benefit or the public relations boost.";

const excerptFromTheWorldHasAnEWasteProblem20222023FormBQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b-1",
    "explanation": "The question asks about the effect of the words “twisted,” “doomed,” and “unrelenting” on the last sentence of paragraph 1.\n\nA. CORRECT. Paragraph 1 first describes the problem of discarded devices in terms of the scope of the problem (“about 6 million pounds . . . processed monthly”). The author then elaborates on the problem with a vivid description of the actual process; it is unfortunate that this process is necessary because, even though they are relatively new, these devices are no longer useful. These particular words emphasize the process of a once-useful device becoming a part of a “twisted . . . movie,” and “doomed” to be recycled by going through an “unrelenting” or never-ending conveyor belt.\n\nB. Incorrect. In the excerpt, the author does express concern about the amount of waste from discarded devices, but this particular sentence is about what happens to the devices and the perspective that one has while watching the devices as they are being processed. In this description, the once-beloved devices have been destroyed, with only some useful parts being retained.\n\nC. Incorrect. Although there is an indication in paragraphs 4-6 that some obsolete devices are disposed of inappropriately, this description is of an appropriate disposal—a recycling center developed specifically for these types of devices.\n\nD. Incorrect. At this juncture in the excerpt, the author has not yet mentioned solving the problem of discarded devices; rather, the author is describing what happens to discarded devices that are appropriately recycled.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 1.\n\nThe scene is like a twisted . . . movie, with doomed gadgets riding an unrelenting conveyor belt into a machine that shreds them into piles of copper, aluminum and steel.\n\nThe words “twisted,” “doomed,” and “unrelenting” most affect the sentence by",
    "promptHtml": "<p>Read this sentence from paragraph 1.</p><blockquote><strong>The scene is like a twisted . . . movie, with doomed gadgets riding an unrelenting conveyor belt into a machine that shreds them into piles of copper, aluminum and steel.</strong></blockquote><p>The words “twisted,” “doomed,” and “unrelenting” most affect the sentence by</p>",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "text": "emphasizing that discarded devices are condemned to an unfortunate fate."
      },
      {
        "id": "B",
        "text": "expressing a sense of desperation about the amount of waste from discarded devices."
      },
      {
        "id": "C",
        "text": "implying that discarded devices are often disposed of in an inappropriate manner."
      },
      {
        "id": "D",
        "text": "suggesting a feeling of doubt about solving the problem of discarded devices."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b-2",
    "explanation": "The question asks how paragraph 2 expands upon the reader’s understanding from paragraph 1.\n\nA. CORRECT. Paragraph 1 describes massive amounts of recycling (“about 6 million pounds... processed monthly”). Paragraph 2 then explains the underlying reason for so much electronics recycling, using a quote from a resource: “ ‘we always have to have the new, best product,’ ” so we buy new electronic products and “get rid of what’s old.”\n\nB. Incorrect. The trend outlined in paragraph 2 is not one of the past but rather one that is ongoing and even increasing at an alarming rate; in only seven years, American consumers quintupled their spending on “telephone and communication equipment.”\n\nC. Incorrect. While it is true that paragraph 2 presents a statistic about American consumer patterns from 2010 to 2017, the spending on these items does not directly support any claims about waste problems. Specific statistics about waste generation, as opposed to this statistic related only to spending, would better support this type of claim.\n\nD. Incorrect. Although paragraph 2 mentions that consumers “get rid of what’s old” once “we buy something new,” this is merely a statement of fact and not a judgment about this behavior.",
    "points": 1,
    "prompt": "How does paragraph 2 build on what the reader learns in paragraph 1?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "Paragraph 2 explains the underlying cause of the massive amounts of recycling that are described in paragraph 1."
      },
      {
        "id": "B",
        "text": "Paragraph 2 discusses the past trends that have led to the technological innovation mentioned in paragraph 1."
      },
      {
        "id": "C",
        "text": "Paragraph 2 cites statistics that support the claim about technology that is stated at the beginning of paragraph 1."
      },
      {
        "id": "D",
        "text": "Paragraph 2 expresses disapproval of the consumers who throw away the products that are discussed in paragraph 1."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b-3",
    "explanation": "This question asks for the best support from the excerpt for the idea that electronic devices are purposely designed to be disposed of after a short time.\n\nA. Incorrect. This statement actually contradicts the notion that it is the manufacturers who are at fault for designing products to only last a short while, as it suggests that the desire for upgrading electronic devices comes directly from consumers themselves.\n\nB. Incorrect. Though this explains a problem that occurs after the devices have already been upgraded, it provides no support for the idea that these devices are intentionally designed to become obsolete quickly.\n\nC. CORRECT. This explains the techniques manufacturers of these devices implement to make the devices unusable after a short time. They cannot easily be repaired; they cannot be integrated with legacy components, and older devices are unable to run with new software.\n\nD. Incorrect. This sentence explains that some people feel that these companies should accept responsibility for creating such short-lived devices, but it does not directly indicate that they intentionally make devices to become useless after only a short time.",
    "points": 1,
    "prompt": "Which sentence from the excerpt suggests that electronic devices are purposely designed to be disposed of after a short time?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“ ‘In our society, we always have to have the new, best product,’ said Aaron Blum, the co-founder and chief operating officer of ERI, on a tour of the facility.” (paragraph 2)"
      },
      {
        "id": "B",
        "text": "“Even when e-waste rules exist, it’s left up to consumers to handle their old devices properly.” (paragraph 6)"
      },
      {
        "id": "C",
        "text": "“Most smartphone batteries can’t be easily replaced when they stop holding a charge, new laptops don’t accept old cables, and software companies push upgrades that won’t run on old devices.” (paragraph 7)"
      },
      {
        "id": "D",
        "text": "“Some environmental groups say multibillion-dollar companies . . . should pick up the cost of recycling the devices they sell.” (paragraph 8)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b-4",
    "explanation": "The question asks how paragraphs 4-5 develop a central idea of the excerpt.\n\nA. Incorrect. Though “e-waste can contain harmful materials like mercury and beryllium” (paragraph 4) and recycling it “can be dangerous” (paragraph 5), the reluctance of recyclers to take e-waste is not a central idea of the excerpt. The excerpt indicates that some recycling companies, like ERI, take electronics and process many of them.\n\nB. Incorrect. It is true that “only 19 states” have laws about not putting old electronics in the trash (paragraph 5), but these paragraphs do not discuss any other approaches that certain communities across the country have tried to implement.\n\nC. CORRECT. These paragraphs highlight problems that already exist and that have been made worse by increasing amounts of e-waste: too much e-waste that is “incinerated or ends up in landfills” and the environmental problems this creates (paragraph 4), as well as the fact that “electronics often end up in garbage and recycling bins” even though they do not belong there (paragraph 5). This develops the central idea in that increasing e-waste is yet another human-made environmental problem that adds layers to the existing problems with too much trash and environmental degradation.\n\nD. Incorrect. There is some indication in these paragraphs that disposing of e-waste creates new and specific problems. However, this is not one of the central ideas of the excerpt, as the problem is more complex than this and involves the design of these devices as well as people’s lack of knowledge and willingness to dispose of these devices appropriately.",
    "points": 1,
    "prompt": "The details in paragraphs 4-5 develop a central idea of the excerpt mainly by suggesting that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "the toxic components of e-waste make waste collectors reluctant to process electronic devices."
      },
      {
        "id": "B",
        "text": "communities across the nation have taken different approaches to the management of e-waste."
      },
      {
        "id": "C",
        "text": "increased amounts of e-waste will further intensify a problem that is already inadequately addressed."
      },
      {
        "id": "D",
        "text": "the methods that are used for disposing of non-electronic waste are inefficient for e-waste."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b-5",
    "explanation": "The question asks about the role of paragraphs 7-9 in the overall organization of the excerpt.\n\nA. Incorrect. These paragraphs make proposals for new efforts to regulate electronic waste, such as producing devices that last longer and having device-producing companies pay to have the devices recycled; however, no claims are made about these efforts being successful.\n\nB. Incorrect. Paragraph 7 does suggest that today’s devices do not “last as long as they once did,” but it does not indicate that in the past electronic devices led to less pollution. Presumably, technology related to electronics recycling has improved in recent years.\n\nC. Incorrect. While it is true that paragraphs 8 and 9 suggest that electronics manufacturers, who are part of the problem, will also need to be part of the solution, there is no call for regulations in these paragraphs, as it was previously established in paragraph 5 that such regulations do not yet widely exist.\n\nD. CORRECT. Paragraph 6 references consumers who may be “paralyzed by the hassle or put off by the expense” and thus do not recycle their devices correctly. Paragraphs 7-9 then shift the focus from individual consumer behaviors to the responsibility of the manufacturers of these devices, who might take action either by making their devices “last as long as they once did” (paragraph 7) or by making efforts to “recycle or collect obsolete products” (paragraph 8).",
    "points": 1,
    "prompt": "What is the role of paragraphs 7-9 in the organization of the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "They emphasize the contrast between successful and unsuccessful efforts to regulate electronic waste."
      },
      {
        "id": "B",
        "text": "They suggest that the electronic devices that were manufactured in the past created less pollution."
      },
      {
        "id": "C",
        "text": "They imply that manufacturers are willing to comply with regulations that protect the environment."
      },
      {
        "id": "D",
        "text": "They shift the focus from a discussion of individual behavior to a discussion of corporate responsibility."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b-6",
    "explanation": "The question asks how a point about the ineffectiveness of e-waste regulations is conveyed in the excerpt.\n\nA. Incorrect. Paragraph 5 indicates that “only 19 states have laws banning electronics from the regular trash,” but this statistic does not reveal how effective or ineffective these regulations are.\n\nB. CORRECT. Paragraph 6 explains that “even when e-waste rules exist,” it is possible consumers will not follow them, because they have to return their electronics to a store and could be charged. Because it is such a “hassle,” they will “simply throw their devices into the trash or stash them in a drawer, hoping they'll just disappear” (paragraph 6).\n\nC. Incorrect. While stores may charge people “to get rid of” old devices (paragraph 6), the fee will simply cover expenses incurred by the store to properly dispose of the devices. Stores could actually succeed in getting some devices recycled appropriately, but overall, the excerpt states that consumers’ frustration over the process means most are discarded improperly (paragraph 6).\n\nD. Incorrect. Paragraph 9 explains that “some companies are increasing their recycling efforts on their own,” but this does not mean that regulations are ineffective, only that some manufacturers are taking action even without regulations.",
    "points": 1,
    "prompt": "The idea that e-waste regulations can be ineffective is conveyed in the excerpt through",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "a statistic indicating that only a few states have chosen to adopt e-waste regulations."
      },
      {
        "id": "B",
        "text": "an observation about typical consumer behavior in response to e-waste regulations."
      },
      {
        "id": "C",
        "text": "an acknowledgment that electronics stores sometimes profit from e-waste regulations."
      },
      {
        "id": "D",
        "text": "a comment that manufacturers are making an effort to recycle even without e-waste regulations."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b-7",
    "explanation": "The question asks how the diagram after paragraph 9 supports the claim in paragraph 4 about environmental risks from e-waste.\n\nA. Incorrect. The diagram includes an image of people as well as an “unlined landfill,” but it contains no information about the volume of e-waste that people place in the landfill. Rather, it seeks to show how waste in landfills impacts the environment in a broader sense through “air emissions” and “groundwater” contamination.\n\nB. CORRECT. The diagram shows that toxic chemicals that are placed into an “unlined landfill” can produce “air emissions” that may affect rain and trees. These toxic chemicals may also seep into the soil and then, eventually, into the “groundwater” and “surface water.”\n\nC. Incorrect. While it is true that the landfill in the diagram is labeled an “unlined landfill,” which presumably would allow more pollutants to seep into the soil, no claim is made in paragraph 4 about landfill design.\n\nD. Incorrect. The diagram shows that water sources near landfills are at risk of pollution by anything in the landfill, but the diagram makes no mention of e-waste in particular. Excerpt from The Highest Tide",
    "points": 1,
    "prompt": "How does the diagram after paragraph 9 most support the claim made in paragraph 4?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "The diagram suggests that people send large amounts of recyclable e-waste to landfills."
      },
      {
        "id": "B",
        "text": "The diagram emphasizes that toxic chemicals in e-waste can easily spread from landfills."
      },
      {
        "id": "C",
        "text": "The diagram implies that most landfills are poorly designed to accommodate e-waste."
      },
      {
        "id": "D",
        "text": "The diagram shows that water sources near landfills are endangered by e-waste."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromTheWorldHasAnEWasteProblem20222023FormBPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b",
  label: "2023 Form B",
  section: "reading",
  questionCount: excerptFromTheWorldHasAnEWasteProblem20222023FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from “The World Has an E-Waste Problem”",
    author: "Alana Semuels",
    byline: "by Alana Semuels",
    image: {"alt":"Excerpt from “The World Has an E-Waste Problem” illustration","src":"/exam-images/excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b-passage.png"},
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">As a tech-hungry nation... gets ready to upgrade to the next generation of lightning-fast 5G devices, there is a surprising environmental cost to be reckoned with: a fresh mountain of <span data-glossary-definition=\"outdated and no longer useful\" role=\"link\" tabindex=\"0\">obsolete</span><sup>1</sup> gadgets. About 6 million pounds of discarded electronics are already processed monthly at recycling giant ERI’s Fresno plant. <span data-glossary-definition=\"wooden platforms used to store or transport materials in a warehouse\" role=\"link\" tabindex=\"0\">Pallets</span><sup>2</sup> of once beloved but now outdated devices... arrive here daily. Workers with hammers hack at the bulkiest devices, while others remove dangerous components like lithium-ion batteries. The scene is like a twisted... movie, with doomed gadgets riding an unrelenting conveyor belt into a machine that shreds them into piles of copper, aluminum and steel.</p><p data-numbered=\"true\">“In our society, we always have to have the new, best product,” said Aaron Blum, the co-founder and chief operating officer of ERI, on a tour of the facility. Americans spent $71 billion on telephone and communication equipment in 2017, nearly five times what they spent in 2010 even when adjusted for inflation, according to the Bureau of Economic Analysis.... When we buy something new, we get rid of what’s old. That cycle of consumption has made electronics waste the world’s fastest-growing solid-waste stream.</p><p data-numbered=\"true\">That stream is expected to turn into a <span data-glossary-definition=\"an outpouring\" role=\"link\" tabindex=\"0\">torrent</span><sup>3</sup> as the world upgrades to 5G, the next big step in wireless technology. 5G promises faster speeds and other benefits. But experts say it will also result in a dramatic increase in e-waste, as millions of smartphones, modems and other gadgets incompatible with 5G networks are made obsolete. “I don’t think people understand the magnitude of the transition,” says ERI co-founder and executive chairman John Shegerian. “This is bigger than the change of black-and-white to color, bigger than analog to digital, by many multitudes.”</p><p data-numbered=\"true\">... Less than a quarter of all U.S. electronic waste is recycled, according to a United Nations estimate. The rest is incinerated or ends up in landfills. That’s bad news, as e-waste can contain harmful materials like mercury and beryllium that pose environmental risks.</p><p data-numbered=\"true\">Part of the problem is regulatory. Only 19 states have laws banning electronics from the regular trash. In states without such rules, like Nevada, electronics often end up in garbage and recycling bins, said Jeremy Walters, a community-relations manager for waste collector Republic Services. Environmental concerns aside, compacting flammable lithium-ion batteries with paper recycling can be dangerous; recycling centers have reported an uptick in fires.</p><p data-numbered=\"true\">Even when e-waste rules exist, it’s left up to consumers to handle their old devices properly. But recycling them can be a pain. Rather than just drop a used phone in a bin outside their homes, lots of people have to take their electronics to a store, which may pay them for it but could also charge them to get rid of it. Many consumers, paralyzed by the hassle or put off by the expense, simply throw their devicesinto the trash or stash them in a drawer, hoping they’ll just disappear. “We don’t necessarily have the measures to make sure people aren’t throwing it away,” Walters said.</p><p data-numbered=\"true\">One solution is to make electronics last as long as they once did. At ERI’s facility, Shegerian showed TIME [magazine] dozens of televisions from the 1970s and 1980s that stopped working only recently. Yet instead, technology companies are speeding the pace of obsolescence. Most smartphone batteries can’t be easily replaced when they stop holding a charge, new laptops don’t accept old cables, and software companies push upgrades that won’t run on old devices. “Our products today don’t last as long as they used to, and it’s a strategy by manufacturers to force us into shorter and shorter upgrade cycles,” said Kyle Wiens, the founder of iFixit, which publishes do-it-yourself repair guides....</p><p data-numbered=\"true\">Some environmental groups say multibillion-dollar companies... should pick up the cost of recycling the devices they sell. Lawmakers in parts of Europe and Canada and in some U.S. states have passed so-called Extended Producer Responsibility (EPR) laws, which require manufacturers to establish and fund systems to recycle or collect obsolete products....</p><p data-numbered=\"true\">... Some companies are increasing their recycling efforts on their own, whether for the economic benefit or the public relations boost.</p>",
    sourceNote: "From “The World Has an E-Waste Problem” by Alana Semuels from TIME Magazine, June 3, 2019. Copyright © 2019 TIME USA, LLC.",
    text: excerptFromTheWorldHasAnEWasteProblem20222023FormBPassageText,
    versionLabel: "2022-2023 Form B",
  }),
  questions: excerptFromTheWorldHasAnEWasteProblem20222023FormBQuestions,
};
