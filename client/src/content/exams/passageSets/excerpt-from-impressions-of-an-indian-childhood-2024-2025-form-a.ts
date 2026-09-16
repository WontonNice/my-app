import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromImpressionsOfAnIndianChildhood20242025FormAPassageText = "Soon after breakfast Mother sometimes began her beadwork. On a bright, clear day, she pulled\nout the wooden pegs that pinned the skirt of our wigwam to the ground, and rolled the canvas\npart way up on its frame of slender poles. Then the cool morning breezes swept freely through\nour dwelling, now and then wafting the perfume of sweet grasses from newly burnt prairie.\n\n\n Untying the long tasseled strings that bound a small brown buckskin bag, my mother spread\nupon a mat beside her bunches of colored beads, just as an artist arranges the paints upon his\npalette. On a lapboard she smoothed out a double sheet of soft white buckskin; and drawing from\na beaded case that hung on the left of her wide belt a long, narrow blade, she trimmed the\nbuckskin into shape. Often she worked upon small moccasins for her small daughter. Then I\nbecame intensely interested in her designing. With a proud, beaming face, I watched her work.\nIn [my] imagination, I saw myself walking in a new pair of snugly fitting moccasins. I felt the\nenvious eyes of my playmates upon the pretty red beads decorating my feet.\n\n\nClose beside my mother I sat on a rug, with a scrap of buckskin in one hand and an awl in the\nother. This was the beginning of my practical observation lessons in the art of beadwork. From a\nskein of finely twisted threads of silvery sinews my mother pulled out a single one. With an awl\nshe pierced the buckskin, and skillfully threaded it with the white sinew. Picking up the tiny beads\none by one, she strung them with the point of her thread, always twisting it carefully after\nevery stitch.\n\n\nIt took many trials before I learned how to knot my sinew thread on the point of my finger, as I\nsaw her do. Then the next difficulty was in keeping my thread stiffly twisted, so that I could\neasily string my beads upon it. My mother required of me original designs for my lessons in\nbeading. At first I frequently ensnared many a sunny hour into working a long design. Soon I\nlearned from self- inflicted punishment to refrain from drawing complex patterns, for I had to\nfinish whatever I began.\n\n\n\n\nAfter some experience I usually drew easy and simple crosses and squares. These were some of\nthe set forms. My original designs were not always symmetrical nor sufficiently characteristic, two\nfaults with which my mother had little patience. The quietness of her oversight made me feel\nstrongly responsible and dependent upon my own judgment. She treated me as a dignified little\nindividual as long as I was on my good behavior; and how humiliated I was when some boldness\nof mine drew forth a rebuke from her!\n\n\n\nIn the choice of colors she left me to my own taste. I was pleased with an outline of yellow upon\na background of dark blue, or a combination of red and myrtle- green. There was another of red\nwith a bluish- gray that was more conventionally used. When I became a little familiar with\ndesigning and the various pleasing combinations of color, a harder lesson was given me. It was\nthe sewing on, instead of beads, some tinted porcupine quills, moistened and flattened between\nthe nails of the thumb and forefinger. My mother cut off the prickly ends and burned them at\nonce in the centre fire. These sharp points were poisonous, and worked into the flesh wherever\nthey lodged. For this reason, my mother said, I should not do much alone in quills until I was as\ntall as my cousin Warca-Ziwin.\n\n\nAlways after these confining lessons I was wild with surplus spirits, and found joyous relief in\nrunning loose in the open again. Many a summer afternoon a party of four or five of my\nplaymates roamed over the hills with me. We each carried a light sharpened rod about four feet\nlong, with which we pried up certain sweet roots. When we had eaten all the choice roots we\nchanced upon, we shouldered our rods and strayed off into patches of a stalky plant under whose\nyellow blossoms we found little crystal drops of gum. Drop by drop we gathered this nature’s\nrock- candy, until each of us could boast of a lump the size of a small bird’s egg. Soon satiated\nwith its woody flavor, we tossed away our gum, to return again to the sweet roots.";

const excerptFromImpressionsOfAnIndianChildhood20242025FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-impressions-of-an-indian-childhood-2024-2025-form-a-1",
    "points": 1,
    "prompt": "In paragraph 1, the phrases “cool morning breezes swept freely” and “wafting the perfume of sweet grasses” affect the tone of the excerpt by suggesting",
    "promptHtml": "In paragraph 1, the phrases “cool morning breezes swept freely” and “wafting the perfume of sweet grasses” affect the tone of the excerpt by suggesting",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "the sadness that the author feels reflecting upon her former way of life.",
        "text": "the sadness that the author feels reflecting upon her former way of life."
      },
      {
        "id": "B",
        "html": "the enthusiasm with which the author approached her work indoors.",
        "text": "the enthusiasm with which the author approached her work indoors."
      },
      {
        "id": "C",
        "html": "the fond feelings that the author has toward her childhood experiences.",
        "text": "the fond feelings that the author has toward her childhood experiences."
      },
      {
        "id": "D",
        "html": "the mix of emotions that the author feels toward her work and her mother.",
        "text": "the mix of emotions that the author feels toward her work and her mother."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromImpressionsOfAnIndianChildhood20242025FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-impressions-of-an-indian-childhood-2024-2025-form-a",
  section: "reading",
  questionCount: excerptFromImpressionsOfAnIndianChildhood20242025FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createProsePassage({
    id: "excerpt-from-impressions-of-an-indian-childhood-2024-2025-form-a",
    title: "Excerpt from “Impressions of an Indian Childhood”",
    author: "Zitkala- Sa",
    blurb: "Zitkala- Sa (Gertrude Simmons Bonnin) was a Native American writer, musician, teacher, and\npolitical activist who was raised on the Yankton Sioux Reservation in South Dakota. In 1900 she\npublished “Impressions of an Indian Childhood” (the term Indian was commonly used at the time\nto refer to Native American people) to expose readers to what life is like on a reservation.",
    image: {"alt":"Excerpt from “Impressions of an Indian Childhood” illustration","src":"/exam-images/excerpt-from-impressions-of-an-indian-childhood-passage.png"},
    passageType: "literary",
    richText: "<p>Soon after breakfast Mother sometimes began her beadwork. On a bright, clear day, she pulled\nout the wooden pegs that pinned the skirt of our wigwam to the ground, and rolled the canvas\npart way up on its frame of slender poles. Then the cool morning breezes swept freely through\nour dwelling, now and then wafting the perfume of sweet grasses from newly burnt prairie.</p><p>\n Untying the long tasseled strings that bound a small brown buckskin bag, my mother spread\nupon a mat beside her bunches of colored beads, just as an artist arranges the paints upon his\npalette. On a lapboard she smoothed out a double sheet of soft white buckskin; and drawing from\na beaded case that hung on the left of her wide belt a long, narrow blade, she trimmed the\nbuckskin into shape. Often she worked upon small moccasins for her small daughter. Then I\nbecame intensely interested in her designing. With a proud, beaming face, I watched her work.\nIn [my] imagination, I saw myself walking in a new pair of snugly fitting moccasins. I felt the\nenvious eyes of my playmates upon the pretty red beads decorating my feet.</p><p>\nClose beside my mother I sat on a rug, with a scrap of buckskin in one hand and an awl in the\nother. This was the beginning of my practical observation lessons in the art of beadwork. From a\nskein of finely twisted threads of silvery sinews my mother pulled out a single one. With an awl\nshe pierced the buckskin, and skillfully threaded it with the white sinew. Picking up the tiny beads\none by one, she strung them with the point of her thread, always twisting it carefully after\nevery stitch.</p><p>\nIt took many trials before I learned how to knot my sinew thread on the point of my finger, as I\nsaw her do. Then the next difficulty was in keeping my thread stiffly twisted, so that I could\neasily string my beads upon it. My mother required of me original designs for my lessons in\nbeading. At first I frequently ensnared many a sunny hour into working a long design. Soon I\nlearned from self- inflicted punishment to refrain from drawing complex patterns, for I had to\nfinish whatever I began.</p><p><br></p><p>After some experience I usually drew easy and simple crosses and squares. These were some of\nthe set forms. My original designs were not always symmetrical nor sufficiently characteristic, two\nfaults with which my mother had little patience. The quietness of her oversight made me feel\nstrongly responsible and dependent upon my own judgment. She treated me as a dignified little\nindividual as long as I was on my good behavior; and how humiliated I was when some boldness\nof mine drew forth a rebuke from her!\n<br></p><p>In the choice of colors she left me to my own taste. I was pleased with an outline of yellow upon\na background of dark blue, or a combination of red and myrtle- green. There was another of red\nwith a bluish- gray that was more conventionally used. When I became a little familiar with\ndesigning and the various pleasing combinations of color, a harder lesson was given me. It was\nthe sewing on, instead of beads, some tinted porcupine quills, moistened and flattened between\nthe nails of the thumb and forefinger. My mother cut off the prickly ends and burned them at\nonce in the centre fire. These sharp points were poisonous, and worked into the flesh wherever\nthey lodged. For this reason, my mother said, I should not do much alone in quills until I was as\ntall as my cousin Warca-Ziwin.</p><p>\nAlways after these confining lessons I was wild with surplus spirits, and found joyous relief in\nrunning loose in the open again. Many a summer afternoon a party of four or five of my\nplaymates roamed over the hills with me. We each carried a light sharpened rod about four feet\nlong, with which we pried up certain sweet roots. When we had eaten all the choice roots we\nchanced upon, we shouldered our rods and strayed off into patches of a stalky plant under whose\nyellow blossoms we found little crystal drops of gum. Drop by drop we gathered this nature’s\nrock- candy, until each of us could boast of a lump the size of a small bird’s egg. Soon satiated\nwith its woody flavor, we tossed away our gum, to return again to the sweet roots.\n</p>",
    sourceNote: "From “Impressions of an Indian Childhood” by Zitkala- Sa— Public Domain",
    text: excerptFromImpressionsOfAnIndianChildhood20242025FormAPassageText,
    versionLabel: "2024-2025 Form A",
  }),
  questions: excerptFromImpressionsOfAnIndianChildhood20242025FormAQuestions,
};
