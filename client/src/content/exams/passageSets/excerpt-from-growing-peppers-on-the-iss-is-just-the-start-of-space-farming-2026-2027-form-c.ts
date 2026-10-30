import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCPassageText = "The author, Melanie Canales, is a first-generation Peruvian American farmer and beekeeper based in Virginia’s Shenandoah Valley, on lands of the indigenous Monacan and Manahoac tribes. Her work focuses on creating healthy relationships between people and their surrounding ecosystems.\nUnburdened by the constraints of gravity, red and green peppers jut out at 45-degree angles inside the Advanced Plant Habitat (APH), a sort of space terrarium not much larger than a microwave. Four chile pepper plants stand effortlessly upright, despite the dozens of glossy fruits weighing them down. These plants have lived entirely in space; their leaves have never been chewed on by insects or rustled by a summer breeze, [and] their stems are unfamiliar with bending toward the sun’s arc across the sky. Scissors glint under the tank’s white and blue lights as astronaut Mark Vande Hei and his team snip the stems of those that are ready for harvest. The peppers whirl around their heads until the astronauts catch them and tape them against a board to photograph.\nBack on Earth, the Plant Habitat-04 team of engineers and plant scientists are observing and conferring with the astronauts. Of the 26 peppers in this batch, only the 14 finest will stay on the International Space Station [ISS] for consumption. The rest will be wrapped in foil, sealed in a Ziploc bag, then frozen at a brisk −80 degrees, until they can come roaring back to Earth in the next cargo capsule to be studied later. Now, after a 137-day growth cycle, the astronauts remove the plants from the module and trash them. Project Plant Habitat-04 is complete. It’s taco night on the ISS.\nSince 2014, NASA has experimented with growing lettuces, brassicas, and zinnias in space, an endeavor that relies on highly specialized technology over 50 years in the making. [Fall 2021’s] two successful pepper harvests . . . will provide data on the nutritional and psychological benefits of growing vegetables on-craft, as well as a crop’s ability to reliably produce long-term in microgravity. While controlled environmental agriculture is not new, the APH experiment represents an evolution in specialized growth habitats. It doesn’t aim to re-create Earth’s conditions, but to perfect each isolated variable of plant growth in the clinical environment of a spaceship.\n“The Advanced Plant Habitat is the most complex plant growth system on orbit today,” says Lashelle Spencer, a plant scientist at NASA’s Kennedy Space Center. Its more than 180 sensors control and monitor temperature, humidity, and carbon dioxide. The astronauts can adjust the color and intensity of the light, and how much moisture the plants’ roots are getting. It waters itself.\nIt’s the day after Thanksgiving, and Spencer has been at Kennedy since 5 a.m. to facilitate the peppers’ final harvest. As part of the project team, she played a crucial role in preparing the seeds that were sent hurtling into space in June and guiding the astronauts through maintaining the plants in orbit. . . . Though astronauts can spend upwards of 100 days in space, their on-mission meals come dehydrated and pre-packaged; their vitamins and minerals are isolated in supplements, which lose nutritional value the longer they’re stored. Spencer’s goal is to create the conditions necessary for cultivating healthy plants in space, so those plants can sustain healthy astronauts on long-term missions. Astronaut food is great, she says—“especially the shrimp cocktail. But you’re missing that crunch. You’re missing that fresh pop of flavor, the green flavor that’s not there in that packaged food.”\nThe sensory experience of growing productive crops can also help mitigate the psychological effects of long-term space travel. . . . Spencer says the team cracked open the door of the APH every day to observe their vegetable companions with all the tenderness of home gardeners. When harvest day came, they batted their bounty around the ISS, taking selfies and delighting in watching the fruits pirouetting around the spacecraft. . . .\n“We were thinking no heat, so that [the peppers] wouldn’t be dangerous, but maybe the astronauts need a little spice in their life,” says Paul Bosland, who along with his colleagues at the Chile Pepper Institute genetically engineered the NuMex Española Improved chile pepper seeds grown in Plant Habitat-04. . . .\nWorking with NASA, Bosland cultivated a variety that could accommodate both the nutritional needs of astronauts as well as the logistics of growing a plant in space. . . .\n. . . The experiment is helping gather the data necessary to determine the nutritional content of crops grown in space, and therefore how many people they can feed, and for how long. Though much is still unknown, Spencer is certain of one thing that future astronauts will need to do: “I think in an optimal world, a scientist like me would say that they would be growing plants from day one. From the day they left to the day they came back, they would be growing them.”";

const excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-34",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "34"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-66d7b2dca845e63a5539.png\" alt=\"Official explanation for question 34\">",
    "points": 1,
    "prompt": "What is the best summary of the astronauts’ process for Project Plant Habitat-04?",
    "promptHtml": "<p>What is the <strong>best</strong> summary of the astronauts’ process for Project Plant <span>Habitat-04?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>After a 137-day growth cycle, the astronauts harvest the peppers while being observed and advised by plant scientists. The astronauts remove the peppers from the APH and photograph them before eating the most nutritious ones.</p>",
        "text": "After a 137-day growth cycle, the astronauts harvest the peppers while being observed and advised by plant scientists. The astronauts remove the peppers from the APH and photograph them before eating the most nutritious ones."
      },
      {
        "id": "B",
        "html": "<p>The astronauts confer with plant scientists and engineers before selecting the 14 finest peppers to keep aboard the ISS for consumption. The remaining peppers are wrapped in foil and sent back to Kennedy Space Center to be studied.</p>",
        "text": "The astronauts confer with plant scientists and engineers before selecting the 14 finest peppers to keep aboard the ISS for consumption. The remaining peppers are wrapped in foil and sent back to Kennedy Space Center to be studied."
      },
      {
        "id": "C",
        "html": "<p>With the help of plant scientists, the astronauts carefully control and monitor the growing conditions in the APH, ultimately harvesting the peppers after a <span>137-day</span> growth cycle. The astronauts choose 14 of the peppers for consumption and send the rest back to be studied.</p>",
        "text": "With the help of plant scientists, the astronauts carefully control and monitor the growing conditions in the APH, ultimately harvesting the peppers after a 137-day growth cycle. The astronauts choose 14 of the peppers for consumption and send the rest back to be studied."
      },
      {
        "id": "D",
        "html": "<p>Astronauts use specialized tools to plant and maintain genetically modified peppers aboard the ISS. After harvesting the fruit, the astronauts tape the peppers to a board to prevent them from floating around the module.</p>",
        "text": "Astronauts use specialized tools to plant and maintain genetically modified peppers aboard the ISS. After harvesting the fruit, the astronauts tape the peppers to a board to prevent them from floating around the module."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-35",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "35"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-953691953d2d7144c6ee.png\" alt=\"Official explanation for question 35\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\nThough astronauts can spend upwards of 100 days in space, their on-mission meals come dehydrated and pre-packaged; their vitamins and minerals are isolated in supplements, which lose nutritional value the longer they’re stored.\nThe sentence contributes to the overall meaning of the excerpt by",
    "promptHtml": "<p>Read this sentence from <span>paragraph 5.</span></p> <p data-align=\"indent\"><strong>Though astronauts can spend upwards of <span>100 days</span> in space, their <span>on-mission</span> meals come dehydrated and pre-packaged; their vitamins and minerals are isolated in supplements, which lose nutritional value the longer they’re stored.</strong></p> <p>The sentence contributes to the overall meaning of the excerpt by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>indicating that the attempt to grow crops aboard the ISS is an important endeavor.</p>",
        "text": "indicating that the attempt to grow crops aboard the ISS is an important endeavor."
      },
      {
        "id": "B",
        "html": "<p>describing the health effects of spending a significant length of time in space.</p>",
        "text": "describing the health effects of spending a significant length of time in space."
      },
      {
        "id": "C",
        "html": "<p>revealing why certain kinds of foods are more appealing in space than on Earth.</p>",
        "text": "revealing why certain kinds of foods are more appealing in space than on Earth."
      },
      {
        "id": "D",
        "html": "<p>emphasizing the difficulty of preserving the nutrients in the crops grown in space.</p>",
        "text": "emphasizing the difficulty of preserving the nutrients in the crops grown in space."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-36",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "36"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-9913611befa6dcbc8a32.png\" alt=\"Official explanation for question 36\">",
    "points": 1,
    "prompt": "Which statement best explains why Lashelle Spencer is a relevant source of information for the excerpt?",
    "promptHtml": "<p>Which statement <strong>best</strong> explains why Lashelle Spencer is a relevant source of information for the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>She works at NASA’s Kennedy Space Center.</p>",
        "text": "She works at NASA’s Kennedy Space Center."
      },
      {
        "id": "B",
        "html": "<p>She is part of the APH project team.</p>",
        "text": "She is part of the APH project team."
      },
      {
        "id": "C",
        "html": "<p>She is sensitive to the astronauts’ need for healthy food in space.</p>",
        "text": "She is sensitive to the astronauts’ need for healthy food in space."
      },
      {
        "id": "D",
        "html": "<p>She witnessed how astronauts aboard the APH responded when harvesting their food.</p>",
        "text": "She witnessed how astronauts aboard the APH responded when harvesting their food."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-37",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "37"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-96cbf627543120671422.png\" alt=\"Official explanation for question 37\">",
    "points": 1,
    "prompt": "How does the author support the claim in paragraph 4 that the APH is a complex plant growth system?",
    "promptHtml": "<p>How does the author support the claim in <span>paragraph 4</span> that the APH is a complex plant growth system?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>by indicating how many sensors help control the variables of plant growth</p>",
        "text": "by indicating how many sensors help control the variables of plant growth"
      },
      {
        "id": "B",
        "html": "<p>by detailing how the method of growing plants has been adapted to the conditions of space</p>",
        "text": "by detailing how the method of growing plants has been adapted to the conditions of space"
      },
      {
        "id": "C",
        "html": "<p>by explaining the steps required to package and return the plants to Earth</p>",
        "text": "by explaining the steps required to package and return the plants to Earth"
      },
      {
        "id": "D",
        "html": "<p>by describing how NASA has spent years experimenting with plants grown in a controlled environment</p>",
        "text": "by describing how NASA has spent years experimenting with plants grown in a controlled environment"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-38",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "38"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-6217c5f14324d8488939.png\" alt=\"Official explanation for question 38\">",
    "points": 1,
    "prompt": "Which two sentences in paragraphs 5–9 best support the idea that the astronauts working in space enjoyed participating in the food-growing experiment?\nSelect the two correct answers.",
    "promptHtml": "<p>Which <strong>two </strong>sentences in paragraphs 5–9 <strong>best</strong> support the idea that the astronauts working in space enjoyed participating in the food-growing experiment?</p> <p>Select the <strong>two </strong>correct answers.</p><div>\n\n\t\n\n</div>",
    "selectionHtml": "<p><strong>5</strong>  It’s the day after Thanksgiving, and Spencer has been at Kennedy since <span>5 a.m.</span> to facilitate the peppers’ final harvest. As part of the project team, she played a crucial role in preparing the seeds that were sent hurtling into space in June and guiding the astronauts through maintaining the plants in <span>orbit. . . .</span> Though astronauts can spend upwards of <span>100 days</span> in space, their <span>on-mission</span> meals come dehydrated and pre-packaged; their vitamins and minerals are isolated in supplements, which lose nutritional value the longer they’re stored. Spencer's goal is to create the conditions necessary for cultivating healthy plants in space, so those plants can sustain healthy astronauts on long-term missions.&nbsp;Astronaut food is great, she <span>says—</span>“especially the shrimp cocktail. <span data-choice-id=\"A\">But you're missing that crunch. You're missing that fresh pop of flavor, the green flavor that's not there in that packaged food.”</span></p><p><strong>6</strong>  The sensory experience of growing productive crops can also help mitigate the psychological effects of long-term space <span>travel. . . .</span> <span data-choice-id=\"B\">Spencer says the team cracked open the door of the APH every day to observe their vegetable companions with all the tenderness of home gardeners.</span>&nbsp;<span data-choice-id=\"C\">When harvest day came, they batted their bounty around the ISS, taking selfies and delighting in watching the fruits pirouetting around the spacecraft.</span><span>. . .</span></p><p><strong>7</strong> <span data-choice-id=\"D\"> “We were thinking no heat, so that [the peppers] wouldn’t be dangerous, but maybe the astronauts need a little spice in their life,” says Paul Bosland</span>, who along with his colleagues at the Chile Pepper Institute genetically engineered the NuMex Española Improved chile pepper seeds grown in Plant <span>Habitat-04. . . .</span></p><p><strong>8</strong>  Working with NASA, Bosland cultivated a variety that could accommodate both the nutritional needs of astronauts as well as the logistics of growing a plant in space. . . .</p><p><strong>9</strong>  . . . The experiment is helping gather the data necessary to determine the nutritional content of crops grown in space, and therefore how many people they can feed, and for how long.&nbsp;Though much is still unknown, Spencer is certain of one thing that future astronauts will need to do: <span data-choice-id=\"E\">“I think in an optimal world, a scientist like me would say that they would be growing plants from day one</span>. From the day they left to the day they came back, they would be growing them.”</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "But you're missing that crunch. You're missing that fresh pop of flavor, the green flavor that's not there in that packaged food.”",
        "text": "But you're missing that crunch. You're missing that fresh pop of flavor, the green flavor that's not there in that packaged food.”"
      },
      {
        "id": "B",
        "html": "Spencer says the team cracked open the door of the APH every day to observe their vegetable companions with all the tenderness of home gardeners.",
        "text": "Spencer says the team cracked open the door of the APH every day to observe their vegetable companions with all the tenderness of home gardeners."
      },
      {
        "id": "C",
        "html": "When harvest day came, they batted their bounty around the ISS, taking selfies and delighting in watching the fruits pirouetting around the spacecraft.",
        "text": "When harvest day came, they batted their bounty around the ISS, taking selfies and delighting in watching the fruits pirouetting around the spacecraft."
      },
      {
        "id": "D",
        "html": "“We were thinking no heat, so that [the peppers] wouldn’t be dangerous, but maybe the astronauts need a little spice in their life,” says Paul Bosland",
        "text": "“We were thinking no heat, so that [the peppers] wouldn’t be dangerous, but maybe the astronauts need a little spice in their life,” says Paul Bosland"
      },
      {
        "id": "E",
        "html": "“I think in an optimal world, a scientist like me would say that they would be growing plants from day one",
        "text": "“I think in an optimal world, a scientist like me would say that they would be growing plants from day one"
      }
    ],
    "correctChoiceIds": [
      "B",
      "C"
    ],
    "requiredSelections": 2,
    "type": "multi_select"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-39",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "39"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-77ffab3d9c994bdb46fe.png\" alt=\"Official explanation for question 39\">",
    "points": 1,
    "prompt": "The description in paragraph 5 of Lashelle Spencer’s goal develops a central idea of the excerpt by",
    "promptHtml": "<p>The description in paragraph 5 of Lashelle Spencer’s goal develops a central idea of the excerpt by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>illustrating that certain types of packaged foods available in space lack particular flavors.</p>",
        "text": "illustrating that certain types of packaged foods available in space lack particular flavors."
      },
      {
        "id": "B",
        "html": "<p>supporting the notion that spending more than <span>100 days</span> in space is detrimental to astronauts’ health.</p>",
        "text": "supporting the notion that spending more than 100 days in space is detrimental to astronauts’ health."
      },
      {
        "id": "C",
        "html": "<p>offering an example of how the limited selection of <span>on-mission</span> meals becomes less appealing over time.</p>",
        "text": "offering an example of how the limited selection of on-mission meals becomes less appealing over time."
      },
      {
        "id": "D",
        "html": "<p>making an important point about the astronauts’ current reliance on supplements for vitamins and minerals.</p>",
        "text": "making an important point about the astronauts’ current reliance on supplements for vitamins and minerals."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-40",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "40"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-8617356e8372bb8e2f47.png\" alt=\"Official explanation for question 40\">",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "What is the relationship between the scientists and the astronauts in carrying out the plant-growing experiments?\nMove the correct answer to each box.",
    "promptHtml": "<p>What is the relationship between the scientists and the astronauts in carrying out the plant-growing experiments?</p> <p>Move the correct answer to each box.</p>",
    "dragDropContentHtml": "<p>Scientists on earth are primarily responsible for&nbsp;{{slot-1}} for conducting plant experiments in space, while the astronauts aboard the International Space Station are responsible for&nbsp;{{slot-2}} for the experiment.</p>",
    "topic": "Uncategorized",
    "allowReuse": false,
    "dragDropStyle": "outlined",
    "dragDropContent": [
      "Scientists on earth are primarily responsible for {{slot-1}} for conducting plant experiments in space, while the astronauts aboard the International Space Station are responsible for {{slot-2}} for the experiment."
    ],
    "dragDropSlots": [
      {
        "correctItemId": "item-4",
        "id": "slot-1"
      },
      {
        "correctItemId": "item-1",
        "id": "slot-2"
      }
    ],
    "items": [
      {
        "id": "item-1",
        "text": "growing the plants to harvest"
      },
      {
        "id": "item-2",
        "text": "documenting the nutritional goals"
      },
      {
        "id": "item-3",
        "text": "analyzing the environment"
      },
      {
        "id": "item-4",
        "text": "developing the materials and systems"
      },
      {
        "id": "item-5",
        "text": "determining the most nutritional plants"
      }
    ],
    "type": "math_drag_drop"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-41",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "41"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-847bc290c15a1dc489d0.png\" alt=\"Official explanation for question 41\">",
    "points": 1,
    "prompt": "How is the quotation from Lashelle Spencer at the end of paragraph 9 relevant to the discussion of the peppers referred to in paragraph 2?",
    "promptHtml": "<p>How is the quotation from Lashelle Spencer at the end of <span>paragraph 9</span> relevant to the discussion of the peppers referred to in <span>paragraph 2?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The quotation indicates that larger batches of peppers need to be grown during future missions and suggests a slight criticism of the astronauts discussed in <span>paragraph 2</span> for not dedicating more of their time to growing peppers during their mission.</p>",
        "text": "The quotation indicates that larger batches of peppers need to be grown during future missions and suggests a slight criticism of the astronauts discussed in paragraph 2 for not dedicating more of their time to growing peppers during their mission."
      },
      {
        "id": "B",
        "html": "<p>The quotation explains why the <span>137-day</span> growth cycle mentioned in <span>paragraph 2</span> is necessary and provides a suggestion on how to grow more peppers during the same growth cycle in future missions.</p>",
        "text": "The quotation explains why the 137-day growth cycle mentioned in paragraph 2 is necessary and provides a suggestion on how to grow more peppers during the same growth cycle in future missions."
      },
      {
        "id": "C",
        "html": "<p>The quotation helps explain why some of the peppers discussed in <span>paragraph 2</span> needed to be sent back to Earth and that increasing the overall number of peppers grown in space will be important in future missions.</p>",
        "text": "The quotation helps explain why some of the peppers discussed in paragraph 2 needed to be sent back to Earth and that increasing the overall number of peppers grown in space will be important in future missions."
      },
      {
        "id": "D",
        "html": "<p>The quotation provides context for understanding why the peppers discussed in <span>paragraph 2</span> must be sealed and frozen prior to their return to Earth and suggests how this method might be improved in upcoming missions.</p>",
        "text": "The quotation provides context for understanding why the peppers discussed in paragraph 2 must be sealed and frozen prior to their return to Earth and suggests how this method might be improved in upcoming missions."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-42",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "42"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-7864b6e507101862624a.png\" alt=\"Official explanation for question 42\">",
    "points": 1,
    "prompt": "How is the discussion of the genetic engineering of the peppers consumed on the ISS (paragraphs 7–8) important to the excerpt as a whole?",
    "promptHtml": "<p>How is the discussion of the genetic engineering of the peppers consumed on the ISS <span>(paragraphs 7–8)</span> important to the excerpt as a whole?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It provides a detail that helps the reader identify a particular variety of pepper consumed on the ISS.</p>",
        "text": "It provides a detail that helps the reader identify a particular variety of pepper consumed on the ISS."
      },
      {
        "id": "B",
        "html": "<p>It indicates that the peppers eaten on the ISS resulted from a collaboration between scientists and astronauts.</p>",
        "text": "It indicates that the peppers eaten on the ISS resulted from a collaboration between scientists and astronauts."
      },
      {
        "id": "C",
        "html": "<p>It allows the reader to understand how the peppers consumed on the ISS differ from most peppers grown on Earth.</p>",
        "text": "It allows the reader to understand how the peppers consumed on the ISS differ from most peppers grown on Earth."
      },
      {
        "id": "D",
        "html": "<p>It suggests that the peppers consumed on the ISS are of a type that could be grown in natural conditions.</p>",
        "text": "It suggests that the peppers consumed on the ISS are of a type that could be grown in natural conditions."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c-official-shsat-2026-c-43",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "43"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-e6327c7021b786942b9d.png\" alt=\"Official explanation for question 43\">",
    "points": 1,
    "prompt": "With which statement would the author most likely agree?",
    "promptHtml": "<p>With which statement would the author <strong>most likely</strong> agree?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Some plants are better adapted for growing in space than on Earth, and focus should be placed on them.</p>",
        "text": "Some plants are better adapted for growing in space than on Earth, and focus should be placed on them."
      },
      {
        "id": "B",
        "html": "<p>Attempting to grow plants in space the same way they are grown on Earth would not result in success.</p>",
        "text": "Attempting to grow plants in space the same way they are grown on Earth would not result in success."
      },
      {
        "id": "C",
        "html": "<p>Plants grown in space provide better nutritional value than plants grown on Earth.</p>",
        "text": "Plants grown in space provide better nutritional value than plants grown on Earth."
      },
      {
        "id": "D",
        "html": "<p>Successfully growing plants in space is a challenge, so more research must first be completed on plants grown on Earth.</p>",
        "text": "Successfully growing plants in space is a challenge, so more research must first be completed on plants grown on Earth."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c",
  versionLabels: ["2026-2027 Form C"],
  section: "reading",
  questionCount: excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from “Growing Peppers on the ISS Is Just the Start of Space Farming”",
    bylineHtml: "by Melanie Canales",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"C","section":"ELA - Passage Set 6 of 7","packageId":"3b8d826de4eb19dc46f8d06d44c281548ac5555336d298dd98f85f72e1ec83b9"},
    title: "Excerpt from “Growing Peppers on the ISS Is Just the Start of Space Farming”",
    author: "Melanie Canales",
    byline: "by Melanie Canales",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p><em>The author, Melanie Canales, is a first-generation Peruvian American farmer and beekeeper based in Virginia’s Shenandoah Valley, on lands of the indigenous Monacan and Manahoac tribes. Her work focuses on creating healthy relationships between people and their surrounding ecosystems.</em></p> <p data-numbered=\"true\"> Unburdened by the constraints of gravity, red and green peppers jut out at <span>45-degree</span> angles inside the Advanced Plant Habitat (APH), a sort of space terrarium not much larger than a microwave. Four chile pepper plants stand effortlessly upright, despite the dozens of glossy fruits weighing them down. These plants have lived entirely in space; their leaves have never been chewed on by insects or rustled by a summer breeze, [and] their stems are unfamiliar with bending toward the sun’s arc across the sky. Scissors glint under the tank’s white and blue lights as astronaut Mark Vande Hei and his team snip the stems of those that are ready for harvest. The peppers whirl around their heads until the astronauts catch them and tape them against a board to photograph.</p> <p data-numbered=\"true\"> Back on Earth, the Plant <span>Habitat-04</span> team of engineers and plant scientists are observing and conferring with the astronauts. Of the 26 peppers in this batch, only the 14 finest will stay on the International Space Station [ISS] for consumption. The rest will be wrapped in foil, sealed in a Ziploc bag, then frozen at a brisk <span>−80 degrees,</span> until they can come roaring back to Earth in the next cargo capsule to be studied later. Now, after a <span>137-day</span> growth cycle, the astronauts remove the plants from the module and trash them. Project Plant <span>Habitat-04</span> is complete. It’s taco night on the ISS.</p> <p data-numbered=\"true\"> Since 2014, <span data-glossary-definition=\"National Aeronautics and Space Administration\" role=\"link\" tabindex=\"0\">NASA</span> has experimented with growing lettuces, <span data-glossary-definition=\"a large genus of herbs, such as broccoli and cabbage\" role=\"link\" tabindex=\"0\">brassicas,</span> and <span data-glossary-definition=\"a genus of herbs and low shrubs that have flowers at their heads\" role=\"link\" tabindex=\"0\">zinnias</span> in space, an endeavor that relies on highly specialized technology over <span>50 years</span> in the making. [Fall 2021’s] two successful pepper <span>harvests . . .</span> will provide data on the nutritional and psychological benefits of growing vegetables <span>on-craft,</span> as well as a crop’s ability to reliably produce long-term in microgravity. While controlled environmental agriculture is not new, the APH experiment represents an evolution in specialized growth habitats. It doesn’t aim to <span>re-create</span> Earth’s conditions, but to perfect each isolated variable of plant growth in the clinical environment of a spaceship.</p> <p data-numbered=\"true\"> “The Advanced Plant Habitat is the most complex plant growth system on orbit today,” says Lashelle Spencer, a plant scientist at NASA’s Kennedy Space Center. Its more than 180 sensors control and monitor temperature, humidity, and carbon dioxide. The astronauts can adjust the color and intensity of the light, and how much moisture the plants’ roots are getting. It waters itself.</p> <p data-numbered=\"true\"> It’s the day after Thanksgiving, and Spencer has been at Kennedy since <span>5 a.m.</span> to facilitate the peppers’ final harvest. As part of the project team, she played a crucial role in preparing the seeds that were sent hurtling into space in June and guiding the astronauts through maintaining the plants in <span>orbit. . . .</span> Though astronauts can spend upwards of <span>100 days</span> in space, their <span>on-mission</span> meals come dehydrated and pre-packaged; their vitamins and minerals are isolated in supplements, which lose nutritional value the longer they’re stored. Spencer’s goal is to create the conditions necessary for cultivating healthy plants in space, so those plants can sustain healthy astronauts on long-term missions. Astronaut food is great, she <span>says—</span>“especially the shrimp cocktail. But you’re missing that crunch. You’re missing that fresh pop of flavor, the green flavor that’s not there in that packaged food.”</p> <p data-numbered=\"true\"> The sensory experience of growing productive crops can also help <span data-glossary-definition=\"to make something less severe or harmful\" role=\"link\" tabindex=\"0\">mitigate</span> the psychological effects of long-term space <span>travel. . . .</span> Spencer says the team cracked open the door of the APH every day to observe their vegetable companions with all the tenderness of home gardeners. When harvest day came, they batted their bounty around the ISS, taking selfies and delighting in watching the fruits pirouetting around the <span>spacecraft. . . .</span></p> <p data-numbered=\"true\"> “We were thinking no heat, so that [the peppers] wouldn’t be dangerous, but maybe the astronauts need a little spice in their life,” says Paul Bosland, who along with his colleagues at the Chile Pepper Institute <span data-glossary-definition=\"combined parts of DNA from different plants to produce a new plant\" role=\"link\" tabindex=\"0\">genetically engineered</span> the NuMex Española Improved chile pepper seeds grown in Plant <span>Habitat-04. . . .</span></p> <p data-numbered=\"true\"> Working with NASA, Bosland cultivated a variety that could accommodate both the nutritional needs of astronauts as well as the logistics of growing a plant in <span>space. . . .</span></p> <p data-numbered=\"true\"> . . . The experiment is helping gather the data necessary to determine the nutritional content of crops grown in space, and therefore how many people they can feed, and for how long. Though much is still unknown, Spencer is certain of one thing that future astronauts will need to do: “I think in an optimal world, a scientist like me would say that they would be growing plants from day one. From the day they left to the day they came back, they would be growing them.”</p>",
    sourceNote: "From “Growing Peppers on the ISS Is Just the Start of Space Farming” by Melanie Canales from WIRED, December 21, 2021. Copyright © 2021 Condé Nast. All rights reserved.",
    text: excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCPassageText,
    versionLabel: "2026-2027 Form C",
  }),
  questions: excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCQuestions,
};
