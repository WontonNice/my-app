import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromImpressionsOfAnIndianChildhood20262027FormCPassageText = "Zitkala-Sa (Gertrude Simmons Bonnin) was a Native American writer, musician, teacher, and political activist who was raised on the Yankton Sioux Reservation in South Dakota. In 1900 she published “Impressions of an Indian Childhood” (the term Indian was commonly used at the time to refer to Native American people) to expose readers to what life is like on a reservation.\nSoon after breakfast Mother sometimes began her beadwork. On a bright, clear day, she pulled out the wooden pegs that pinned the skirt of our wigwam to the ground, and rolled the canvas part way up on its frame of slender poles. Then the cool morning breezes swept freely through our dwelling, now and then wafting the perfume of sweet grasses from newly burnt prairie.\nUntying the long tasseled strings that bound a small brown buckskin bag, my mother spread upon a mat beside her bunches of colored beads, just as an artist arranges the paints upon his palette. On a lapboard she smoothed out a double sheet of soft white buckskin; and drawing from a beaded case that hung on the left of her wide belt a long, narrow blade, she trimmed the buckskin into shape. Often she worked upon small moccasins for her small daughter. Then I became intensely interested in her designing. With a proud, beaming face, I watched her work. In [my] imagination, I saw myself walking in a new pair of snugly fitting moccasins. I felt the envious eyes of my playmates upon the pretty red beads decorating my feet.\nClose beside my mother I sat on a rug, with a scrap of buckskin in one hand and an awl in the other. This was the beginning of my practical observation lessons in the art of beadwork. From a skein of finely twisted threads of silvery sinews my mother pulled out a single one. With an awl she pierced the buckskin, and skillfully threaded it with the white sinew. Picking up the tiny beads one by one, she strung them with the point of her thread, always twisting it carefully after every stitch.\nIt took many trials before I learned how to knot my sinew thread on the point of my finger, as I saw her do. Then the next difficulty was in keeping my thread stiffly twisted, so that I could easily string my beads upon it. My mother required of me original designs for my lessons in beading. At first I frequently ensnared many a sunny hour into working a long design. Soon I learned from self-inflicted punishment to refrain from drawing complex patterns, for I had to finish whatever I began.\nAfter some experience I usually drew easy and simple crosses and squares. These were some of the set forms. My original designs were not always symmetrical nor sufficiently characteristic, two faults with which my mother had little patience. The quietness of her oversight made me feel strongly responsible and dependent upon my own judgment. She treated me as a dignified little individual as long as I was on my good behavior; and how humiliated I was when some boldness of mine drew forth a rebuke from her!\nIn the choice of colors she left me to my own taste. I was pleased with an outline of yellow upon a background of dark blue, or a combination of red and myrtle-green. There was another of red with a bluish-gray that was more conventionally used. When I became a little familiar with designing and the various pleasing combinations of color, a harder lesson was given me. It was the sewing on, instead of beads, some tinted porcupine quills, moistened and flattened between the nails of the thumb and forefinger. My mother cut off the prickly ends and burned them at once in the centre fire. These sharp points were poisonous, and worked into the flesh wherever they lodged. For this reason, my mother said, I should not do much alone in quills until I was as tall as my cousin Warca-Ziwin.\nAlways after these confining lessons I was wild with surplus spirits, and found joyous relief in running loose in the open again. Many a summer afternoon a party of four or five of my playmates roamed over the hills with me. We each carried a light sharpened rod about four feet long, with which we pried up certain sweet roots. When we had eaten all the choice roots we chanced upon, we shouldered our rods and strayed off into patches of a stalky plant under whose yellow blossoms we found little crystal drops of gum. Drop by drop we gathered this nature’s rock-candy, until each of us could boast of a lump the size of a small bird’s egg. Soon satiated with its woody flavor, we tossed away our gum, to return again to the sweet roots.";

const excerptFromImpressionsOfAnIndianChildhood20262027FormCQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c-official-shsat-2026-c-13",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "13"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-2bf823473c61ed39a346.png\" alt=\"Official explanation for question 13\">",
    "points": 1,
    "prompt": "In paragraph 1, the phrases “cool morning breezes swept freely” and “wafting the perfume of sweet grasses” affect the tone of the excerpt by suggesting",
    "promptHtml": "<p>In paragraph 1, the phrases “cool morning breezes swept freely” and “wafting the perfume of sweet grasses” affect the tone of the excerpt by suggesting</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the sadness that the author feels reflecting upon her former way of life.</p>",
        "text": "the sadness that the author feels reflecting upon her former way of life."
      },
      {
        "id": "B",
        "html": "<p>&nbsp;the enthusiasm with which the author approached her work indoors.</p>",
        "text": "the enthusiasm with which the author approached her work indoors."
      },
      {
        "id": "C",
        "html": "<p>the fond feelings that the author has toward her childhood experiences.</p>",
        "text": "the fond feelings that the author has toward her childhood experiences."
      },
      {
        "id": "D",
        "html": "<p>the mix of emotions that the author feels toward her work and her mother.</p>",
        "text": "the mix of emotions that the author feels toward her work and her mother."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c-official-shsat-2026-c-14",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "14"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-bc4d4cb5d57ef7dc8de4.png\" alt=\"Official explanation for question 14\">",
    "points": 1,
    "prompt": "The phrase “just as an artist arranges the paints upon his palette” in paragraph 2 suggests that",
    "promptHtml": "<p>The phrase “just as an artist arranges the paints upon his palette” in <span>paragraph 2</span> suggests that</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>beadwork is a true form of art.</p>",
        "text": "beadwork is a true form of art."
      },
      {
        "id": "B",
        "html": "<p>color is a source of artistic inspiration.</p>",
        "text": "color is a source of artistic inspiration."
      },
      {
        "id": "C",
        "html": "<p>all artistic activities begin with a series of steps.</p>",
        "text": "all artistic activities begin with a series of steps."
      },
      {
        "id": "D",
        "html": "<p>the beadworker tries to imitate art.</p>",
        "text": "the beadworker tries to imitate art."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c-official-shsat-2026-c-15",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "15"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-8ae7d57bf02855b3dedc.png\" alt=\"Official explanation for question 15\">",
    "points": 1,
    "prompt": "The author’s use of sequence in paragraphs 1 and 2 contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>The author’s use of sequence in paragraphs 1 and 2 contributes to the development of ideas in the excerpt by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>listing the many steps that are involved in the process of beading in order to explain its difficulty and complexity.</p>",
        "text": "listing the many steps that are involved in the process of beading in order to explain its difficulty and complexity."
      },
      {
        "id": "B",
        "html": "<p>conveying the importance of following the steps of the beading process in a precise order to work most efficiently.</p>",
        "text": "conveying the importance of following the steps of the beading process in a precise order to work most efficiently."
      },
      {
        "id": "C",
        "html": "<p>emphasizing the time required to fully prepare for and execute the many large and small tasks in the activity of beading.</p>",
        "text": "emphasizing the time required to fully prepare for and execute the many large and small tasks in the activity of beading."
      },
      {
        "id": "D",
        "html": "<p>detailing each step in preparation for beading in order to highlight the author’s enthusiasm for the work.</p>",
        "text": "detailing each step in preparation for beading in order to highlight the author’s enthusiasm for the work."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c-official-shsat-2026-c-16",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "16"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-eb86416b43aa1fc7544a.png\" alt=\"Official explanation for question 16\">",
    "points": 1,
    "prompt": "Which sentence best summarizes the process of beading that is described in the excerpt?",
    "promptHtml": "<p>Which sentence <strong>best</strong> summarizes the process of beading that is described in the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Take a buckskin bag full of beads and spread them out on a mat in different colors like a paint palette; take a double sheet of buckskin and smooth it out on a table; take a sinew and awl and thread the beads onto the buckskin in a desired pattern.</p>",
        "text": "Take a buckskin bag full of beads and spread them out on a mat in different colors like a paint palette; take a double sheet of buckskin and smooth it out on a table; take a sinew and awl and thread the beads onto the buckskin in a desired pattern."
      },
      {
        "id": "B",
        "html": "<p>Cut the double sheet of buckskin into a shape; take a skein of sinew and pierce the buckskin with an awl; thread the sinew with beads of many different colors in a simple or complex pattern; twist the sinew to keep it tight after every stitch into the buckskin.</p>",
        "text": "Cut the double sheet of buckskin into a shape; take a skein of sinew and pierce the buckskin with an awl; thread the sinew with beads of many different colors in a simple or complex pattern; twist the sinew to keep it tight after every stitch into the buckskin."
      },
      {
        "id": "C",
        "html": "<p>Arrange the beads into groups of colors on a mat; smooth out a double sheet of buckskin and cut it to shape; take a single thread of sinew; pierce the buckskin with an awl; thread the buckskin with the sinew and string it with beads, carefully twisting after every stitch.</p>",
        "text": "Arrange the beads into groups of colors on a mat; smooth out a double sheet of buckskin and cut it to shape; take a single thread of sinew; pierce the buckskin with an awl; thread the buckskin with the sinew and string it with beads, carefully twisting after every stitch."
      },
      {
        "id": "D",
        "html": "<p>Gather beads, buckskin, sinew, and awl and place them on a mat; cut the buckskin into the desired shape; decide on a pattern for the beads and create it using the sinews and the awl; thread the beads onto the sinew in the desired pattern and twist it tight.</p>",
        "text": "Gather beads, buckskin, sinew, and awl and place them on a mat; cut the buckskin into the desired shape; decide on a pattern for the beads and create it using the sinews and the awl; thread the beads onto the sinew in the desired pattern and twist it tight."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c-official-shsat-2026-c-17",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "17"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-895aeb2e0bd567125502.png\" alt=\"Official explanation for question 17\">",
    "points": 1,
    "prompt": "The idea that mastering moccasin design and creation requires experience is best illustrated in the excerpt through",
    "promptHtml": "<p>The idea that mastering moccasin design and creation requires experience is <strong>best</strong> illustrated in the excerpt through</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the information about the advanced technique of incorporating porcupine quills into a design.</p>",
        "text": "the information about the advanced technique of incorporating porcupine quills into a design."
      },
      {
        "id": "B",
        "html": "<p>the descriptions of the special materials that must be used to make decorated moccasins.</p>",
        "text": "the descriptions of the special materials that must be used to make decorated moccasins."
      },
      {
        "id": "C",
        "html": "<p>the descriptions of the various color combinations that make an attractive moccasin design.</p>",
        "text": "the descriptions of the various color combinations that make an attractive moccasin design."
      },
      {
        "id": "D",
        "html": "<p>the example of the author successfully and independently using a sharpened rod.</p>",
        "text": "the example of the author successfully and independently using a sharpened rod."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c-official-shsat-2026-c-18",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "18"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-4584e63418250ef14579.png\" alt=\"Official explanation for question 18\">",
    "points": 1,
    "prompt": "How does the author distinguish her point of view from that of her mother?",
    "promptHtml": "<p>How does the author distinguish her point of view from that of her mother?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>by describing their techniques for knotting sinew thread (paragraph 4)</p>",
        "text": "by describing their techniques for knotting sinew thread (paragraph 4)"
      },
      {
        "id": "B",
        "html": "<p>by describing their approaches to beadwork design (paragraph 5)</p>",
        "text": "by describing their approaches to beadwork design (paragraph 5)"
      },
      {
        "id": "C",
        "html": "<p>by stating her mother’s instructions on working with quills (paragraph 6)</p>",
        "text": "by stating her mother’s instructions on working with quills (paragraph 6)"
      },
      {
        "id": "D",
        "html": "<p>by stating her mother’s ideas about activities after lessons (paragraph 7)</p>",
        "text": "by stating her mother’s ideas about activities after lessons (paragraph 7)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c-official-shsat-2026-c-19",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "19"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-2fd55313c435057a0efa.png\" alt=\"Official explanation for question 19\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 7.\n\nAlways after these confining lessons I was wild with surplus spirits, and found joyous relief in running loose in the open again.\n\nWhich sentence best describes how this sentence fits into the overall structure of the excerpt?",
    "promptHtml": "<p>Read this sentence from paragraph 7.</p><blockquote><strong><strong>Always after these confining lessons I was wild with surplus spirits, and found joyous relief in running loose in the open again.</strong></strong></blockquote><p>Which sentence <strong>best</strong> describes how this sentence fits into the overall structure of the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It introduces a shift from the author’s demanding relationship with her mother to her more relaxed relationships with friends.</p>",
        "text": "It introduces a shift from the author’s demanding relationship with her mother to her more relaxed relationships with friends."
      },
      {
        "id": "B",
        "html": "<p>It signals a change from the challenging aspects of life on the reservation to the advantages of living on the prairie.</p>",
        "text": "It signals a change from the challenging aspects of life on the reservation to the advantages of living on the prairie."
      },
      {
        "id": "C",
        "html": "<p>It highlights a contrast between the focus and control required while working and the freedom of having fun outside.</p>",
        "text": "It highlights a contrast between the focus and control required while working and the freedom of having fun outside."
      },
      {
        "id": "D",
        "html": "<p>It concludes the progression of events in the narrative by describing the sequence of events at the end of the author’s day.</p>",
        "text": "It concludes the progression of events in the narrative by describing the sequence of events at the end of the author’s day."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromImpressionsOfAnIndianChildhood20262027FormCPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c",
  versionLabels: ["2026-2027 Form C"],
  section: "reading",
  questionCount: excerptFromImpressionsOfAnIndianChildhood20262027FormCQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from “Impressions of an Indian Childhood”",
    bylineHtml: "by Zitkala-Sa",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"C","section":"ELA - Passage Set 3 of 7","packageId":"469a6dc1bad1df9caae12acc03df0f3ebfc3e20c557ee0b59c0b62967a2e955c"},
    title: "Excerpt from “Impressions of an Indian Childhood”",
    author: "Zitkala-Sa",
    byline: "by Zitkala-Sa",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p><em>Zitkala-Sa (Gertrude Simmons Bonnin) was a Native American writer, musician, teacher, and political activist who was raised on the Yankton Sioux Reservation in South Dakota. In 1900 she published “Impressions of an Indian Childhood” (the term </em>Indian<em> was commonly used at the time to refer to Native American people) to expose readers to what life is like on a reservation.</em></p> <p data-numbered=\"true\"> Soon after breakfast Mother sometimes began her beadwork. On a bright, clear day, she pulled out the wooden pegs that pinned the skirt of our <span data-glossary-definition=\"hut with an arched framework of poles covered with bark, mats, or animal hides\" role=\"link\" tabindex=\"0\">wigwam</span> to the ground, and rolled the canvas part way up on its frame of slender poles. Then the cool morning breezes swept freely through our dwelling, now and then wafting the perfume of sweet grasses from newly burnt prairie.</p> <p data-numbered=\"true\"> Untying the long tasseled strings that bound a small brown <span data-glossary-definition=\"leather made from the skin of a male deer\" role=\"link\" tabindex=\"0\">buckskin</span> bag, my mother spread upon a mat beside her bunches of colored beads, just as an artist arranges the paints upon his palette. On a lapboard she smoothed out a double sheet of soft white buckskin; and drawing from a beaded case that hung on the left of her wide belt a long, narrow blade, she trimmed the buckskin into shape. Often she worked upon small moccasins for her small daughter. Then I became intensely interested in her designing. With a proud, beaming face, I watched her work. In [my] imagination, I saw myself walking in a new pair of snugly fitting moccasins. I felt the envious eyes of my playmates upon the pretty red beads decorating my feet.</p> <p data-numbered=\"true\"> Close beside my mother I sat on a rug, with a scrap of buckskin in one hand and an awl in the other. This was the beginning of my practical observation lessons in the art of beadwork. From a <span data-glossary-definition=\"coiled length of yarn or other thread loosely wound on a reel\" role=\"link\" tabindex=\"0\">skein</span> of finely twisted threads of silvery sinews my mother pulled out a single one. With an awl she pierced the buckskin, and skillfully threaded it with the white sinew. Picking up the tiny beads one by one, she strung them with the point of her thread, always twisting it carefully after&nbsp;every stitch.</p> <p data-numbered=\"true\"> It took many trials before I learned how to knot my sinew thread on the point of my finger, as I saw her do. Then the next difficulty was in keeping my thread stiffly twisted, so that I could easily string my beads upon it. My mother required of me original designs for my lessons in beading. At first I frequently ensnared many a sunny hour into working a long design. Soon I learned from self-inflicted punishment to refrain from drawing complex patterns, for I had to finish whatever I began.</p> <p data-numbered=\"true\"> After some experience I usually drew easy and simple crosses and squares. These were some of the set forms. My original designs were not always symmetrical nor sufficiently characteristic, two faults with which my mother had little patience. The quietness of her oversight made me feel strongly responsible and dependent upon my own judgment. She treated me as a dignified little individual as long as I was on my good behavior; and how humiliated I was when some boldness of mine drew forth a rebuke from her!</p> <p data-numbered=\"true\"> In the choice of colors she left me to my own taste. I was pleased with an outline of yellow upon a background of dark blue, or a combination of red and myrtle-green. There was another of red with a bluish-gray that was more conventionally used. When I became a little familiar with designing and the various pleasing combinations of color, a harder lesson was given me. It was the sewing on, instead of beads, some tinted porcupine quills, moistened and flattened between the nails of the thumb and forefinger. My mother cut off the prickly ends and burned them at once in the centre fire. These sharp points were poisonous, and worked into the flesh wherever they lodged. For this reason, my mother said, I should not do much alone in quills until I was as tall as my cousin <span>Warca-Ziwin.</span></p> <p data-numbered=\"true\"> Always after these confining lessons I was wild with surplus spirits, and found joyous relief in running loose in the open again. Many a summer afternoon a party of four or five of my playmates roamed over the hills with me. We each carried a light sharpened rod about <span>four feet</span> long, with which we pried up certain sweet roots. When we had eaten all the choice roots we chanced upon, we shouldered our rods and strayed off into patches of a stalky plant under whose yellow blossoms we found little crystal drops of gum. Drop by drop we gathered this nature’s rock-candy, until each of us could boast of a lump the size of a small bird’s egg. Soon satiated with its woody flavor, we tossed away our gum, to return again to the sweet roots.</p> <p>&nbsp;</p><p data-align=\"center\"><img src=\"/exam-images/official-shsat-2026-c-91bcf5ecc076fba2499d.svg\" alt=\"A BRIEF HISTORY OF BEADWORK IN SOUTH DAKOTA 1500s, The Dakota use beads made from bones, shells, stones, and animal teeth.  European traders bring glass beads to North America.  Late 1600s, The Dakota begin trading with the French in Minnesota. 1830s, The Dakota begin using glass beads in clothing, artwork, and decorations in place of Native-made beads. 1862–1865, The Dakota are expelled from their homelands in Minnesota as a result of the U.S.-Dakota War.  1900s–1920s, The Dakota create items to sell outside their community. \" width=\"385\"></p>",
    sourceNote: "From “Impressions of an Indian Childhood” by Zitkala-Sa—Public Domain",
    text: excerptFromImpressionsOfAnIndianChildhood20262027FormCPassageText,
    versionLabel: "2026-2027 Form C",
  }),
  questions: excerptFromImpressionsOfAnIndianChildhood20262027FormCQuestions,
};
