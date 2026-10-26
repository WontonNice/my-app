import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAPassageText = "About forty-five hundred years ago, not long after the completion of the Great Pyramid at Giza, a seed of Pinus longaeva, the Great Basin bristlecone pine, landed on a steep slope in what are now known as the White Mountains, in eastern California. The seed may have travelled there on a gust of wind, its flight aided by a winglike attachment to the nut. Or it could have been planted by a bird known as the Clark’s nutcracker, which likes to hide pine seeds in caches; nutcrackers have phenomenal spatial1 memory and can recall thousands of such caches. This seed, however, lay undisturbed. On a moist day in fall, or in the wake of melting snows in spring, a seedling appeared above ground—a stubby one-inch stem with a tuft of bright-green shoots.\n\nMost seedlings die within a year; the mortality rate is more than ninety-nine percent. The survivors are sometimes seen growing in the shadow of a fallen tree. The landscape of the Ancient Bristlecone Pine Forest, as this area of the White Mountains is called, is littered with fragments of dead trees—trunks, limbs, roots, and smaller chunks. Pinus longaeva grows exclusively in subalpine regions of the Great Basin, which stretches from the eastern slopes of the Sierra Nevada to the Wasatch Range, in Utah. Conditions are generally too arid for the dead wood to rot; instead, it erodes, sanded down like rock. The remnants may harbor nutrients and fungi that help new trees grow. Bristlecones rise from the bones of their ancestors—a city within a cemetery.\n\nCoast redwoods and giant sequoias, California’s gargantuan world-record-holding trees, can grow fifty feet or more in their first twenty years. Bristlecones rise agonizingly slowly. After four or five years, the seedling on the steep slope would have been just a few inches higher, sprouting needles in place of the embryonic shoots. The needles are a deep green, tough, resinous, and closely bunched in groups of five. On a mature tree, they live for fifty years or more. Decades may have passed before the tree was human height, and decades more before it resembled a conventional pine. Bristlecone saplings grow straight up, with relatively sparse foliage, looking like undernourished Christmas trees. After a few hundred years—by which time the Old Kingdom of Egypt had fallen—it was probably forty or fifty feet in height.\n\nMany tree species live for hundreds of years. A smaller but not inconsiderable number, including the sequoias and certain yews, oaks, cypresses, and junipers, survive for thousands. Once a bristlecone has established itself in the unforgiving conditions of the White Mountains, it can last almost indefinitely. The trees tend to grow some distance from one another, so fires almost never destroy an entire stand. Because only a few other plant species can handle the dry, cold climate, the bristlecones face little competition. Unlike most plants, they tolerate dolomite soil, which is composed of a chalky type of limestone that is heavily alkaline and low in nutrients. As for insect threats, bristlecone wood is so dense that mountain-pine beetles and other pests can rarely burrow their way into it.\n\nEmpires rose and fell; wars raged; . . . and the tree from 2500 B.C. continued its implacable slow-motion existence, adding about two-hundredths of an inch to the diameter of its trunk each year. Minute changes in the tree-ring record make bristlecones an exceptionally useful source of data about changing conditions on Earth. When rains are heavier than normal, the rings widen. When volcanic eruptions cause global cooling, frost rings make the anomaly2 visible. . . .\n\nAs the millennia go by, bristlecones become contorted and wraithlike.3 The main stem, or leader, dies back. Entire branches, even the trunk itself, become fossils. At first glance, the tree may look dead. Such is the case of the forty-five-hundred-year-old tree that clings to life near the tourist path that now runs through the Ancient Bristlecone Pine Forest. Spears of dead wood jut into the air. The trunk is a marbled hulk stripped of bark, like driftwood thrown from a vanished ocean. A ribbon of live bark runs up one side, funneling water and nutrients to clumps of green needles high above. All told, the tree is an unprepossessing specimen; most people march past it without giving it a second glance. . . .\n\n. . . No two super-elderly trees look alike, to the point where they have acquired the characteristics of individuals. Trees are prone to anthropomorphism; we project our dreams and our anxieties onto them. Bristlecones have been called elders, sentinels, sages. The possibility that climate change will cause their extinction has inspired a spate4 of alarmed news stories, although tree scientists tend to discount the idea that the bristlecones are in immediate danger. They have survived any number of catastrophes in the past; they may survive humanity.";

const excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a-2023-form-a-q37",
    "explanation": "The question asks what the effect is of comparing groups of bristlecone pines to “a city within a cemetery” (paragraph 2).\n\nA. Incorrect. The reference to “a city within a cemetery” describes how new trees use the remnants of their “ancestors” (paragraph 2) and makes no comment on the appearance of young versus mature trees.\n\nB. CORRECT. The “cemetery” contains “the bones of their ancestors” (paragraph 2)—“ancestors” being earlier generations of bristlecone pines—which provide some of the nutrients that the new trees need.\n\nC. Incorrect. The reference to “a cemetery” is not a comment on how long bristlecone pines can live; rather, it illustrates that the new pines are using remnants of their “ancestors” (paragraph 2) to grow.\n\nD. Incorrect. Although the climate is mentioned in paragraph 2, it is not the reason for the comparison to “a city within a cemetery.” The comment is intended to illustrate how the new trees use nutrients left behind by the old ones.",
    "points": 1,
    "prompt": "What is the effect of comparing groups of bristlecone pines to “a city within a cemetery” (paragraph 2)?",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "It illustrates that the new tree’s appearance is markedly different from that of mature bristlecone pines."
      },
      {
        "id": "B",
        "text": "It emphasizes the new tree’s ability to use resources left by prior generations of bristlecone pines."
      },
      {
        "id": "C",
        "text": "It highlights the tree’s capacity for a long life if it is able to survive to maturity."
      },
      {
        "id": "D",
        "text": "It reveals that the tree’s dense growth patterns are unusual in arid conditions."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a-2023-form-a-q38",
    "explanation": "The question asks how paragraph 4 conveys the idea that the bristlecone pine can withstand difficult conditions.\n\nA. Incorrect. While paragraph 4 does mention the bristlecone pine in conjunction with other long-living trees, this does not explain in any way how the bristlecone pine can survive difficult conditions.\n\nB. CORRECT. Paragraph 4 mentions several qualities that help the bristlecone pine survive a difficult environment: it can survive in a “dry, cold climate” as few plants can, it tolerates a soil that is heavily alkaline and low in nutrients, and the density of its wood protects it from insects.\n\nC. Incorrect. Paragraph 4 focuses on the qualities of the bristlecone pine that make it well suited to the White Mountains rather than why the White Mountains are well suited to bristlecone pines.\n\nD. Incorrect. While paragraph 4 does acknowledge that the bristlecone pine has few competitors because the pine can stand conditions few other plants can stand, it is the examination of the pine’s unique qualities that explains how the pine survives those conditions.",
    "points": 1,
    "prompt": "In paragraph 4, the idea that the bristlecone pine can withstand difficult conditions is illustrated mainly through",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "a comparison of the bristlecone pine with similar trees that are known for their long lives."
      },
      {
        "id": "B",
        "text": "a description of specific qualities of the bristlecone pine that make it suited to its environment."
      },
      {
        "id": "C",
        "text": "an explanation of why the White Mountains are the best place for the bristlecone pine to grow."
      },
      {
        "id": "D",
        "text": "an examination of why the bristlecone pine has few competitors in the White Mountains."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a-2023-form-a-q39",
    "explanation": "The question asks how the first sentence from paragraph 5 contributes to the development of ideas in the excerpt.\n\nA. Incorrect. While “two-hundredths of an inch” is a reference to the bristlecone pine’s growth pattern, the point of the reference—and of the entire sentence—is to emphasize the incredibly slow pace of the pine’s life cycle.\n\nB. Incorrect. While “wars raged” is a threat that empires face, the point of mentioning wars and the rise and fall of empires is to emphasize the bristlecone pine’s slow-paced life cycle by contrasting its slowness with the big, dramatic changes taking place in human history at the same time.\n\nC. CORRECT. Making reference to huge changes in human history such as the rise and fall of empires and the raging of wars provides a sharp contrast to the incredibly slow growth of the bristlecone pine.\n\nD. Incorrect. This sentence describes how slowly the bristlecone pine grows in contrast to how dramatically human history changes in the same time span but never explains the reasons for the pine’s longevity.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nEmpires rose and fell; wars raged; . . . and the tree from 2500 B.C. continued its implacable slow-motion existence, adding about two-hundredths of an inch to the diameter of its trunk each year.\n\nThe sentence contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong><strong>Empires rose and fell; wars raged; . . . and the tree from 2500 B.C. continued its implacable slow-motion existence, adding about two-hundredths of an inch to the diameter of its trunk each year.</strong></strong></blockquote><p>The sentence contributes to the development of ideas in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "emphasizing the bristlecone pine’s precise growth pattern."
      },
      {
        "id": "B",
        "text": "suggesting that things that seem well established face threats."
      },
      {
        "id": "C",
        "text": "describing the pace of the life cycle of the bristlecone pine."
      },
      {
        "id": "D",
        "text": "explaining the reason for the bristlecone pine’s longevity."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a-2023-form-a-q40",
    "explanation": "The question asks what the phrases “clings to life” and “stripped of bark” in paragraph 6 are used to emphasize.\n\nA. Incorrect. While these two phrases are suggestive of the tree’s fragility, nothing in this paragraph suggests that the tree needs help to avoid extinction.\n\nB. Incorrect. While the tree may be misunderstood to be dead because it is “stripped of bark,” the phrase “clings to life” emphasizes the fact that the tree is not dead but manages to survive.\n\nC. Incorrect. The paragraph says that far from being interested in the tree’s unusual appearance, “most people march past it without giving it a second glance” (paragraph 6).\n\nD. CORRECT. The phrase “clings to life” emphasizes that the tree is still surviving even though it is partially fossilized, as shown by its “marbled hulk stripped of bark” (paragraph 6).",
    "points": 1,
    "prompt": "The phrases “clings to life” and “stripped of bark” in paragraph 6 are used to highlight",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "that the tree is fragile and needs help to avoid becoming extinct."
      },
      {
        "id": "B",
        "text": "how the tree can be misunderstood because of its appearance."
      },
      {
        "id": "C",
        "text": "how the tree interests observers with its unusual appearance."
      },
      {
        "id": "D",
        "text": "that the tree manages to survive even when partially fossilized."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a-2023-form-a-q41",
    "explanation": "The question asks which central idea of the excerpt is supported by the details in paragraph 7.\n\nA. Incorrect. While paragraph 7 mentions the pines’ ability to survive climate change, the central idea is about the trees' longevity. Surviving climate change is a part of the pines' longevity, but just surviving climate change does not fully encompass the central idea of the excerpt.\n\nB. Incorrect. Although the paragraph mentions that the “super-elderly trees” are each unique in appearance, their appearance does not directly connect to their ability to survive. The details in paragraph 7 emphasize the durability and longevity of the trees.\n\nC. Incorrect. While the beginning of paragraph 7 expresses the idea that each bristlecone pine appears to be a unique individual and supports the idea that humans relate to the pines, the paragraph expresses a stronger central idea in the last two sentences about the pines’ survival.\n\nD. CORRECT. The longevity of bristlecone pines is a central idea of the excerpt. Experts are encouraged that bristlecone pines have survived many catastrophes, and the details in the second half of paragraph 7 draw direct attention to the trees’ longevity.",
    "points": 1,
    "prompt": "The details in paragraph 7 convey a central idea of the excerpt by suggesting that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "the success of the bristlecone pine lies in its ability to resist climate change."
      },
      {
        "id": "B",
        "text": "the uncommon appearance of the bristlecone pine is related to its ability to survive."
      },
      {
        "id": "C",
        "text": "the attachment that humans have to the bristlecone pine is understandable."
      },
      {
        "id": "D",
        "text": "the longevity of the bristlecone pine continues to encourage experts."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a-2023-form-a-q42",
    "explanation": "The question asks how the author conveys his point of view throughout the excerpt.\n\nA. CORRECT. The author clearly conveys his interest in and admiration of the bristlecone pine by sharing many details throughout the excerpt that show how unusual the tree is; these include details about the tree using remnants from previous generations (paragraph 2), details about the “agonizingly” slow growth rate (paragraph 3), and details about the incredibly difficult growing conditions that the tree thrives in (paragraph 4).\n\nB. Incorrect. While the author does briefly compare the bristlecone pine to global empires (paragraphs 1, 3, and 5), he mainly offers many details throughout the excerpt about what makes the bristlecone pine so unusual.\n\nC. Incorrect. While paragraph 6 largely focuses on the contrast of the pine’s sickly appearance with its ability to survive, this is just one detail about the pine that makes it unusual. The author offers many such details throughout the excerpt.\n\nD. Incorrect. The author suggests in paragraph 7 that the bristlecone pine “may survive humanity,” but this is just one detail about the bristlecone that the author offers in an excerpt full of details, each of which contributes to an understanding of how unusual this tree is.",
    "points": 1,
    "prompt": "Throughout the excerpt, the author conveys his point of view mainly by",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "sharing details about the qualities of the bristlecone pine that make it an unusual tree."
      },
      {
        "id": "B",
        "text": "comparing the bristlecone pine to global empires that lasted thousands of years before falling."
      },
      {
        "id": "C",
        "text": "explaining the way the seemingly sickly appearance of the bristlecone pine contrasts with its ability to survive."
      },
      {
        "id": "D",
        "text": "arguing that the bristlecone pine has survived past threats to its survival and will continue to thrive."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a-2023-form-a-q43",
    "explanation": "The question asks for a summary of the bristlecone pine’s life cycle.\n\nA. Incorrect. Though the summary in this option covers key points in the life cycle, it focuses on minor details (“stubby seedling” and “alkaline soil”) while leaving out major details in the life cycle (for example, the fact that parts of the trees become fossilized over time).\n\nB. Incorrect. The answer addresses the unique quality of the pine growing from “fragments of its dead ancestors”; however, it does not address the fossilization phase, which is a major part of the life cycle. In addition, this option incorrectly states that the tree continues to funnel nutrients to its stem.\n\nC. CORRECT. The option describes the key phases of the pine’s life cycle without focusing on minor details. The organization of the summary is chronological, and the information presented is accurate.\n\nD. Incorrect. The option focuses more on the location and the appearance of the pine than on the phases of the pine’s life cycle. The option contains an accurate description of the pine’s appearance but provides little information about the main phases of its life cycle.",
    "points": 1,
    "prompt": "What is the best summary of the bristlecone pine’s life cycle?",
    "promptHtml": "What is the <strong>best</strong> summary of the bristlecone pine’s life cycle?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "The bristlecone pine takes root as a stubby seedling in the mountains. Over time, it grows slowly in a hostile environment with alkaline soil that ensures little competition from other trees."
      },
      {
        "id": "B",
        "text": "The bristlecone pine grows up slowly from the fragments of its dead ancestors. Over time, it begins to become contorted in appearance but continues to funnel water and nutrients to its stem."
      },
      {
        "id": "C",
        "text": "The bristlecone pine grows slowly in an environment hostile to other trees. Over time, its trunk and some branches fossilize, but it funnels water and nutrients to other parts that are still alive."
      },
      {
        "id": "D",
        "text": "The bristlecone pine grows only in one location in the mountains. Over time, it develops sparse foliage that fossilizes slowly, but the trunk and branches stay alive as revealed by ribbons of live bark."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a",
  section: "reading",
  questionCount: excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from “The Past and the Future of the Earth’s Oldest Trees”",
    author: "Alex Ross",
    byline: "by Alex Ross",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">About forty-five hundred years ago, not long after the completion of the Great Pyramid at Giza, a seed of <em>Pinus longaeva</em>, the Great Basin bristlecone pine, landed on a steep slope in what are now known as the White Mountains, in eastern California. The seed may have travelled there on a gust of wind, its flight aided by a winglike attachment to the nut. Or it could have been planted by a bird known as the Clark’s nutcracker, which likes to hide pine seeds in caches; nutcrackers have phenomenal <span data-glossary-definition=\"relating to physical space\" role=\"link\" tabindex=\"0\">spatial</span><sup>1</sup> memory and can recall thousands of such caches. This seed, however, lay undisturbed. On a moist day in fall, or in the wake of melting snows in spring, a seedling appeared above ground—a stubby one-inch stem with a tuft of bright-green shoots.</p><p data-numbered=\"true\">Most seedlings die within a year; the mortality rate is more than ninety-nine percent. The survivors are sometimes seen growing in the shadow of a fallen tree. The landscape of the Ancient Bristlecone Pine Forest, as this area of the White Mountains is called, is littered with fragments of dead trees—trunks, limbs, roots, and smaller chunks. <em>Pinus longaeva</em> grows exclusively in subalpine regions of the Great Basin, which stretches from the eastern slopes of the Sierra Nevada to the Wasatch Range, in Utah. Conditions are generally too arid for the dead wood to rot; instead, it erodes, sanded down like rock. The remnants may harbor nutrients and fungi that help new trees grow. Bristlecones rise from the bones of their ancestors—a city within a cemetery.</p><p data-numbered=\"true\">Coast redwoods and giant sequoias, California’s gargantuan world-record-holding trees, can grow fifty feet or more in their first twenty years. Bristlecones rise agonizingly slowly. After four or five years, the seedling on the steep slope would have been just a few inches higher, sprouting needles in place of the embryonic shoots. The needles are a deep green, tough, resinous, and closely bunched in groups of five. On a mature tree, they live for fifty years or more. Decades may have passed before the tree was human height, and decades more before it resembled a conventional pine. Bristlecone saplings grow straight up, with relatively sparse foliage, looking like undernourished Christmas trees. After a few hundred years—by which time the Old Kingdom of Egypt had fallen—it was probably forty or fifty feet in height.</p><p data-numbered=\"true\">Many tree species live for hundreds of years. A smaller but not inconsiderable number, including the sequoias and certain yews, oaks, cypresses, and junipers, survive for thousands. Once a bristlecone has established itself in the unforgiving conditions of the White Mountains, it can last almost indefinitely. The trees tend to grow some distance from one another, so fires almost never destroy an entire stand. Because only a few other plant species can handle the dry, cold climate, the bristlecones face little competition. Unlike most plants, they tolerate dolomite soil, which is composed of a chalky type of limestone that is heavily alkaline and low in nutrients. As for insect threats, bristlecone wood is so dense that mountain-pine beetles and other pests can rarely burrow their way into it.</p><p data-numbered=\"true\">Empires rose and fell; wars raged; . . . and the tree from 2500 B.C. continued its implacable slow-motion existence, adding about two-hundredths of an inch to the diameter of its trunk each year. Minute changes in the tree-ring record make bristlecones an exceptionally useful source of data about changing conditions on Earth. When rains are heavier than normal, the rings widen. When volcanic eruptions cause global cooling, frost rings make the <span data-glossary-definition=\"oddity\" role=\"link\" tabindex=\"0\">anomaly</span><sup>2</sup> visible. . . .</p><p data-numbered=\"true\">As the millennia go by, bristlecones become contorted and <span data-glossary-definition=\"ghostly\" role=\"link\" tabindex=\"0\">wraithlike</span>.<sup>3</sup> The main stem, or leader, dies back. Entire branches, even the trunk itself, become fossils. At first glance, the tree may look dead. Such is the case of the forty-five-hundred-year-old tree that clings to life near the tourist path that now runs through the Ancient Bristlecone Pine Forest. Spears of dead wood jut into the air. The trunk is a marbled hulk stripped of bark, like driftwood thrown from a vanished ocean. A ribbon of live bark runs up one side, funneling water and nutrients to clumps of green needles high above. All told, the tree is an unprepossessing specimen; most people march past it without giving it a second glance. . . .</p><p data-numbered=\"true\">. . . No two super-elderly trees look alike, to the point where they have acquired the characteristics of individuals. Trees are prone to anthropomorphism; we project our dreams and our anxieties onto them. Bristlecones have been called elders, sentinels, sages. The possibility that climate change will cause their extinction has inspired a <span data-glossary-definition=\"sudden abundance\" role=\"link\" tabindex=\"0\">spate</span><sup>4</sup> of alarmed news stories, although tree scientists tend to discount the idea that the bristlecones are in immediate danger. They have survived any number of catastrophes in the past; they may survive humanity.</p>",
    sourceNote: "From “The Past and the Future of the Earth’s Oldest Trees” by Alex Ross from THE NEW YORKER, January 20, 2020. Copyright © 2020 by Condé Nast. All rights reserved.",
    text: excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAPassageText,
    versionLabel: "2023 Form A",
  }),
  questions: excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAQuestions,
};
