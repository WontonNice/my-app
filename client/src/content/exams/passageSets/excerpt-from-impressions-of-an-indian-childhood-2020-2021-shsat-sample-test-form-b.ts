import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBPassageText = "Soon after breakfast Mother sometimes began her beadwork. On a bright, clear day, she pulled out the wooden pegs that pinned the skirt of our wigwam to the ground, and rolled the canvas part way up on its frame of slender poles. Then the cool morning breezes swept freely through our dwelling, now and then wafting the perfume of sweet grasses from newly burnt prairie.\n\nUntying the long tasseled strings that bound a small brown buckskin bag, my mother spread upon a mat beside her bunches of colored beads, just as an artist arranges the paints upon his palette. On a lapboard she smoothed out a double sheet of soft white buckskin; and drawing from a beaded case that hung on the left of her wide belt a long, narrow blade, she trimmed the buckskin into shape. Often she worked upon small moccasins for her small daughter. Then I became intensely interested in her designing. With a proud, beaming face, I watched her work. In [my] imagination, I saw myself walking in a new pair of snugly fitting moccasins. I felt the envious eyes of my playmates upon the pretty red beads decorating my feet.\n\nClose beside my mother I sat on a rug, with a scrap of buckskin in one hand and an awl in the other. This was the beginning of my practical observation lessons in the art of beadwork. From a skein of finely twisted threads of silvery sinews my mother pulled out a single one. With an awl she pierced the buckskin, and skillfully threaded it with the white sinew. Picking up the tiny beads one by one, she strung them with the point of her thread, always twisting it carefully after every stitch.\n\nIt took many trials before I learned how to knot my sinew thread on the point of my finger, as I saw her do. Then the next difficulty was in keeping my thread stiffly twisted, so that I could easily string my beads upon it. My mother required of me original designs for my lessons in beading. At first I frequently ensnared many a sunny hour into working a long design. Soon I learned from self-inflicted punishment to refrain from drawing complex patterns, for I had to finish whatever I began.\n\nAfter some experience I usually drew easy and simple crosses and squares. These were some of the set forms. My original designs were not always symmetrical nor sufficiently characteristic, two faults with which my mother had little patience. The quietness of her oversight made me feel strongly responsible and dependent upon my own judgment. She treated me as a dignified little individual as long as I was on my good behavior; and how humiliated I was when some boldness of mine drew forth a rebuke from her!\n\nIn the choice of colors she left me to my own taste. I was pleased with an outline of yellow upon a background of dark blue, or a combination of red and myrtle-green. There was another of red with a bluish-gray that was more conventionally used. When I became a little familiar with designing and the various pleasing combinations of color, a harder lesson was given me. It was the sewing on, instead of beads, some tinted porcupine quills, moistened and flattened between the nails of the thumb and forefinger. My mother cut off the prickly ends and burned them at once in the centre fire. These sharp points were poisonous, and worked into the flesh wherever they lodged. For this reason, my mother said, I should not do much alone in quills until I was as tall as my cousin Warca-Ziwin.\n\nAlways after these confining lessons I was wild with surplus spirits, and found joyous relief in running loose in the open again. Many a summer afternoon a party of four or five of my playmates roamed over the hills with me. We each carried a light sharpened rod about four feet long, with which we pried up certain sweet roots. When we had eaten all the choice roots we chanced upon, we shouldered our rods and strayed off into patches of a stalky plant under whose yellow blossoms we found little crystal drops of gum. Drop by drop we gathered this nature’s rock-candy, until each of us could boast of a lump the size of a small bird’s egg. Soon satiated with its woody flavor, we tossed away our gum, to return again to the sweet roots.";

const excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-1",
    "points": 1,
    "prompt": "In paragraph 1, the phrases “cool morning breezes swept freely” and “wafting the perfume of sweet grasses” affect the tone of the excerpt by suggesting",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "text": "the sadness that the author feels reflecting upon her former way of life."
      },
      {
        "id": "B",
        "text": "the enthusiasm with which the author approached her work indoors."
      },
      {
        "id": "C",
        "text": "the fond feelings that the author has toward her childhood experiences."
      },
      {
        "id": "D",
        "text": "the mix of emotions that the author feels toward her work and her mother."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-2",
    "points": 1,
    "prompt": "The phrase “just as an artist arranges the paints upon his palette” in paragraph 2 suggests that",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "beadwork is a true form of art."
      },
      {
        "id": "B",
        "text": "color is a source of artistic inspiration."
      },
      {
        "id": "C",
        "text": "all artistic activities begin with a series of steps."
      },
      {
        "id": "D",
        "text": "the beadworker tries to imitate art."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-3",
    "points": 1,
    "prompt": "The author’s use of sequence in paragraphs 1 and 2 contributes to the development of ideas in the excerpt by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "listing the many steps that are involved in the process of beading in order to explain its difficulty and complexity."
      },
      {
        "id": "B",
        "text": "conveying the importance of following the steps of the beading process in a precise order to work most efficiently."
      },
      {
        "id": "C",
        "text": "emphasizing the time required to fully prepare for and execute the many large and small tasks in the activity of beading."
      },
      {
        "id": "D",
        "text": "detailing each step in preparation for beading in order to highlight the author’s enthusiasm for the work."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-4",
    "points": 1,
    "prompt": "The details in paragraph 3 convey a central idea of the excerpt by suggesting that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "the author was interested in the work because she knew her mother was making something for her."
      },
      {
        "id": "B",
        "text": "the author had difficulty learning through observation but wanted to help her mother."
      },
      {
        "id": "C",
        "text": "the author was determined to behave according to her mother’s standards and sought her approval."
      },
      {
        "id": "D",
        "text": "the author had great admiration for her mother’s precision and mastery of her craft."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-5",
    "points": 1,
    "prompt": "Which sentence best summarizes the process of beading that is described in the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "Take a buckskin bag full of beads and spread them out on a mat in different colors like a paint palette; take a double sheet of buckskin and smooth it out on a table; take a sinew and awl and thread the beads onto the buckskin in a desired pattern."
      },
      {
        "id": "B",
        "text": "Cut the double sheet of buckskin into a shape; take a skein of sinew and pierce the buckskin with an awl; thread the sinew with beads of many different colors in a simple or complex pattern; twist the sinew to keep it tight after every stitch into the buckskin."
      },
      {
        "id": "C",
        "text": "Arrange the beads into groups of colors on a mat; smooth out a double sheet of buckskin and cut it to shape; take a single thread of sinew; pierce the buckskin with an awl; thread the buckskin with the sinew and string it with beads, carefully twisting after every stitch."
      },
      {
        "id": "D",
        "text": "Gather beads, buckskin, sinew, and awl and place them on a mat; cut the buckskin into the desired shape; decide on a pattern for the beads and create it using the sinews and the awl; thread the beads onto the sinew in the desired pattern and twist it tight."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-6",
    "points": 1,
    "prompt": "The idea that mastering moccasin design and creation requires experience is best illustrated in the excerpt through",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "the information about the advanced technique of incorporating porcupine quills into a design."
      },
      {
        "id": "B",
        "text": "the descriptions of the special materials that must be used to make decorated moccasins."
      },
      {
        "id": "C",
        "text": "the descriptions of the various color combinations that make an attractive moccasin design."
      },
      {
        "id": "D",
        "text": "the example of the author successfully and independently using a sharpened rod."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-7",
    "points": 1,
    "prompt": "How does the author distinguish her point of view from that of her mother?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "by describing their techniques for knotting sinew thread (paragraph 4)"
      },
      {
        "id": "B",
        "text": "by describing their approaches to beadwork design (paragraph 5)"
      },
      {
        "id": "C",
        "text": "by stating her mother’s instructions on working with quills (paragraph 6)"
      },
      {
        "id": "D",
        "text": "by stating her mother’s ideas about activities after lessons (paragraph 7)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-8",
    "points": 1,
    "prompt": "Read this sentence from paragraph 7.\n\nAlways after these confining lessons I was wild with surplus spirits, and found joyous relief in running loose in the open again.\n\nWhich sentence best describes how this sentence fits into the overall structure of the excerpt?",
    "promptHtml": "Read this sentence from paragraph 7.<br><strong>Always after these confining lessons I was wild with surplus spirits, and found joyous relief in running loose in the open again.</strong><br>Which sentence best describes how this sentence fits into the overall structure of the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It introduces a shift from the author’s demanding relationship with her mother to her more relaxed relationships with friends."
      },
      {
        "id": "B",
        "text": "It signals a change from the challenging aspects of life on the reservation to the advantages of living on the prairie."
      },
      {
        "id": "C",
        "text": "It highlights a contrast between the focus and control required while working and the freedom of having fun outside."
      },
      {
        "id": "D",
        "text": "It concludes the progression of events in the narrative by describing the sequence of events at the end of the author’s day."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b-9",
    "points": 1,
    "prompt": "The table after paragraph 7 expands upon a central idea in the excerpt because it shows that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "the craft that the author was learning was a tradition that endured through many generations and changes."
      },
      {
        "id": "B",
        "text": "the author’s family incorporated traditional materials into their craft as a way of resisting the influence from European traders."
      },
      {
        "id": "C",
        "text": "the uniqueness of the cultural tradition that the author learned as a child was eventually recognized in Europe."
      },
      {
        "id": "D",
        "text": "the author was able to incorporate color into her craftwork as a result of trade with other peoples."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createProsePassage({
    id: "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b",
    title: "Excerpt from “Impressions of an Indian Childhood”",
    author: "Zitkala-Sa",
    blurb: "Zitkala-Sa (Gertrude Simmons Bonnin) was a Native American writer, musician, teacher, and political activist who was raised on the Yankton Sioux Reservation in South Dakota. In 1900 she published “Impressions of an Indian Childhood” (the term Indian was commonly used at the time to refer to Native American people) to expose readers to what life is like on a reservation.",
    passageType: "literary",
    richText: "<p>Soon after breakfast Mother sometimes began her beadwork. On a bright, clear day, she pulled out the wooden pegs that pinned the skirt of our wigwam to the ground, and rolled the canvas part way up on its frame of slender poles. Then the cool morning breezes swept freely through our dwelling, now and then wafting the perfume of sweet grasses from newly burnt prairie.</p><p>Untying the long tasseled strings that bound a small brown buckskin bag, my mother spread upon a mat beside her bunches of colored beads, just as an artist arranges the paints upon his palette. On a lapboard she smoothed out a double sheet of soft white buckskin; and drawing from a beaded case that hung on the left of her wide belt a long, narrow blade, she trimmed the buckskin into shape. Often she worked upon small moccasins for her small daughter. Then I became intensely interested in her designing. With a proud, beaming face, I watched her work. In [my] imagination, I saw myself walking in a new pair of snugly fitting moccasins. I felt the envious eyes of my playmates upon the pretty red beads decorating my feet.</p><p>Close beside my mother I sat on a rug, with a scrap of buckskin in one hand and an awl in the other. This was the beginning of my practical observation lessons in the art of beadwork. From a skein of finely twisted threads of silvery sinews my mother pulled out a single one. With an awl she pierced the buckskin, and skillfully threaded it with the white sinew. Picking up the tiny beads one by one, she strung them with the point of her thread, always twisting it carefully after every stitch.</p><p>It took many trials before I learned how to knot my sinew thread on the point of my finger, as I saw her do. Then the next difficulty was in keeping my thread stiffly twisted, so that I could easily string my beads upon it. My mother required of me original designs for my lessons in beading. At first I frequently ensnared many a sunny hour into working a long design. Soon I learned from self-inflicted punishment to refrain from drawing complex patterns, for I had to finish whatever I began.</p><p>After some experience I usually drew easy and simple crosses and squares. These were some of the set forms. My original designs were not always symmetrical nor sufficiently characteristic, two faults with which my mother had little patience. The quietness of her oversight made me feel strongly responsible and dependent upon my own judgment. She treated me as a dignified little individual as long as I was on my good behavior; and how humiliated I was when some boldness of mine drew forth a rebuke from her!</p><p>In the choice of colors she left me to my own taste. I was pleased with an outline of yellow upon a background of dark blue, or a combination of red and myrtle-green. There was another of red with a bluish-gray that was more conventionally used. When I became a little familiar with designing and the various pleasing combinations of color, a harder lesson was given me. It was the sewing on, instead of beads, some tinted porcupine quills, moistened and flattened between the nails of the thumb and forefinger. My mother cut off the prickly ends and burned them at once in the centre fire. These sharp points were poisonous, and worked into the flesh wherever they lodged. For this reason, my mother said, I should not do much alone in quills until I was as tall as my cousin Warca-Ziwin.</p><p>Always after these confining lessons I was wild with surplus spirits, and found joyous relief in running loose in the open again. Many a summer afternoon a party of four or five of my playmates roamed over the hills with me. We each carried a light sharpened rod about four feet long, with which we pried up certain sweet roots. When we had eaten all the choice roots we chanced upon, we shouldered our rods and strayed off into patches of a stalky plant under whose yellow blossoms we found little crystal drops of gum. Drop by drop we gathered this nature’s rock-candy, until each of us could boast of a lump the size of a small bird’s egg. Soon satiated with its woody flavor, we tossed away our gum, to return again to the sweet roots.</p>",
    sourceNote: "From “Impressions of an Indian Childhood” by Zitkala-Sa—Public Domain",
    teacherSource: "20202021_form_b.pdf, printed pages 172–176, questions 42–50",
    text: excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBPassageText,
    versionLabel: "2020–2021 Form B",
  }),
  questions: excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBQuestions,
};
