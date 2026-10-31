import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheHighestTide20262027FormDPassageText = "I rounded the oyster beds, to the far side. . . . It was low tide by then, and I saw the water hesitating at its apex, neither leaving nor returning, patiently waiting for the gravitational gears to shift. Dozens of anxious clams started squirting in unison like they did whenever vibrating grains of sand warned them predators were approaching. I stopped and waited with them, to actually see the moment when the tide started returning with its invisible buffet of plankton for the clams, oysters, mussels and other filter feeders. It was right then, ankle deep in the Sound, feet numbing, eyes relaxed, that I saw the nudibranch.\nIn all my time on the flats I’d never seen one before. I’d read about them, sure. I’d handled them at aquariums but never in the wild, and I’d never even seen a photo of one this stunning. It was just three inches long but with dozens of fluorescent, orange-tipped hornlike plumes jutting from the back of its see-through body that appeared to be lit from within.\nNudibranchs are often called the butterflies of the sea, but even that understates their dazzle. Almost everything else in the northern Pacific is dressed to blend with pale surroundings. Nudibranchs don’t bother, in part because they taste so lousy they don’t need camouflage to survive. But also, I decided right then, because their beauty is so startling it earns them a free pass, the same way everyday life brakes for peacocks, parade floats. . . .\nThe dark mudflats loomed like wet, flattened dunes stretching deep into Skookumchuck Bay in front of our house. From a distance, they looked too barren to support sea life. Up close, they still did, unless you knew where to find the hearty clams, worms and tiny creatures that flourish in mud. . . . I’m not sure why I decided to take a look. It was still an hour before sunrise, and I knew exactly what the bars looked like in the moonlight, but for some reason, I couldn’t resist.\nI heard it long before I saw it. It was an exhale, a release of sorts, and I instantly wondered if a whale was stranded again. We had a young minke stuck out there two summers prior, and it made similar noises until the tide rose high enough for rescuers to help free it. . . . I looked for a hulking silhouette but couldn’t find one. I waited, but there were no more sounds. Still, I went toward what I thought I’d heard, avoiding stepping into the mud until I had to. I knew the flats well enough to know I could get stuck just about anywhere. The general rule was you didn’t venture out past the shells and gravel with an incoming tide. I sank up to my knees twice, and numbing water filled my boots.\n. . . I kept stepping toward the one sound I’d heard, a growing part of me hoping I’d find nothing at all. When I stopped to rest and yank up my socks, my headlamp crossed it. My first thought? A giant octopus.\nPuget Sound has some of the biggest octopi in the world. They often balloon to a hundred pounds. Even the great Jacques Cousteau himself came to study them. But when I saw the long tubular shape of its upper body and the tangle of tentacles below it, I knew it was more than an octopus. I came closer, within fifty feet, close enough to see its large cylindrical siphon quiver. I couldn’t tell if it was making any sounds at that point, because it was impossible to hear anything over the blood in my ears. . . .\nThe creature’s body came to a triangular point above narrow fins that lay flat on the mud like wings, but it was hard to be sure exactly where it all began or ended, or how long its tentacles truly were, because I was afraid to pry my eyes off its jumble of arms for more than half a second. I didn’t know whether I was within reach, and its arms were as big around as my ankle and lined with suckers the size of half-dollars. If they even twitched I would have run. So, I was looking at it and not looking at it while my heart spangled my vision. I saw fragments, pieces, and tried to fuse them in my mind but couldn’t be certain of the whole. I knew what it had to be, but I wouldn’t allow myself to even think the two words. Then I gradually realized the dark shiny disc in the middle of the rubbery mass was too perfectly round to be mud or a reflection.\nIt was too late to smother my scream. Its eye was the size of a hubcap.";

const excerptFromTheHighestTide20262027FormDQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-highest-tide-2026-2027-form-d-official-shsat-2026-d-27",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "27"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-c72a90dcd8f7796b9157.png\" alt=\"Official explanation for question 27\">",
    "points": 1,
    "prompt": "In paragraph 3, the phrase “the butterflies of the sea” conveys the idea that",
    "promptHtml": "<p>In paragraph 3, the phrase “the butterflies of the sea” conveys the idea that</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>nudibranchs do not have to work as hard as other animals to survive in the ocean.</p>",
        "text": "nudibranchs do not have to work as hard as other animals to survive in the ocean."
      },
      {
        "id": "B",
        "html": "<p>nudibranchs have colorful features that make them stand out.</p>",
        "text": "nudibranchs have colorful features that make them stand out."
      },
      {
        "id": "C",
        "html": "<p>nudibranchs are delicate and have trouble adapting to their environment.</p>",
        "text": "nudibranchs are delicate and have trouble adapting to their environment."
      },
      {
        "id": "D",
        "html": "<p>nudibranchs are rare and difficult to find in the ocean.</p>",
        "text": "nudibranchs are rare and difficult to find in the ocean."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-highest-tide-2026-2027-form-d-official-shsat-2026-d-28",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "28"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-3fe5b14eebef28b0fd31.png\" alt=\"Official explanation for question 28\">",
    "points": 1,
    "prompt": "Read these sentences from paragraph 4.\nI’m not sure why I decided to take a look. It was still an hour before sunrise, and I knew exactly what the bars looked like in the moonlight, but for some reason, I couldn’t resist.\nThe sentences contribute to the overall structure of the excerpt by",
    "promptHtml": "<p>Read these sentences from <span>paragraph 4.</span></p> <p data-align=\"indent\"><strong>I’m not sure why I decided to take a look. It was still an hour before sunrise, and I knew exactly what the bars looked like in the moonlight, but for some reason, I couldn’t resist.</strong></p> <p>The sentences contribute to the overall structure of the excerpt by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>introducing the mysterious creature that the narrator discovers.</p>",
        "text": "introducing the mysterious creature that the narrator discovers."
      },
      {
        "id": "B",
        "html": "<p>indicating a shift from the narrator recalling the past to the narrator reflecting on the present.</p>",
        "text": "indicating a shift from the narrator recalling the past to the narrator reflecting on the present."
      },
      {
        "id": "C",
        "html": "<p>establishing a struggle with fear that the narrator must overcome.</p>",
        "text": "establishing a struggle with fear that the narrator must overcome."
      },
      {
        "id": "D",
        "html": "<p>building tension through indicating that the narrator is going to see something&nbsp;unexpected.</p>",
        "text": "building tension through indicating that the narrator is going to see something unexpected."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-highest-tide-2026-2027-form-d-official-shsat-2026-d-29",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "29"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-dd3e91cf235c3054dc8e.png\" alt=\"Official explanation for question 29\">",
    "points": 1,
    "prompt": "The narrator’s actions in paragraph 5 reveal that he is",
    "promptHtml": "<p>The narrator’s actions in paragraph 5 reveal that he is</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>expecting to see the familiar sight of a stranded minke.</p>",
        "text": "expecting to see the familiar sight of a stranded minke."
      },
      {
        "id": "B",
        "html": "<p>confident about exploring farther into the mudflats.</p>",
        "text": "confident about exploring farther into the mudflats."
      },
      {
        "id": "C",
        "html": "<p>unconcerned about becoming stuck in the mudflats.</p>",
        "text": "unconcerned about becoming stuck in the mudflats."
      },
      {
        "id": "D",
        "html": "<p>determined to discover the source of the sound.</p>",
        "text": "determined to discover the source of the sound."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-highest-tide-2026-2027-form-d-official-shsat-2026-d-30",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "30"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-fd45c3b8278bd8d2de53.png\" alt=\"Official explanation for question 30\">",
    "points": 1,
    "prompt": "How does the setting affect the plot of the excerpt?",
    "promptHtml": "<p>How does the setting affect the plot of the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The darkness of the mudflats before sunrise causes the narrator to pay close attention to his surroundings.</p>",
        "text": "The darkness of the mudflats before sunrise causes the narrator to pay close attention to his surroundings."
      },
      {
        "id": "B",
        "html": "<p>The rugged terrain of the mudflats makes it more difficult for the narrator to do his job.</p>",
        "text": "The rugged terrain of the mudflats makes it more difficult for the narrator to do his job."
      },
      {
        "id": "C",
        "html": "<p>The slow return of the tide along the mudflats forces the narrator to be patient during his journey.</p>",
        "text": "The slow return of the tide along the mudflats forces the narrator to be patient during his journey."
      },
      {
        "id": "D",
        "html": "<p>The barren appearance of the mudflats creates a sense of mystery that unsettles the narrator.</p>",
        "text": "The barren appearance of the mudflats creates a sense of mystery that unsettles the narrator."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-highest-tide-2026-2027-form-d-official-shsat-2026-d-31",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "31"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-509e361f556caf4877dd.png\" alt=\"Official explanation for question 31\">",
    "points": 1,
    "prompt": "Which sentence from paragraph 5 supports the idea that the narrator is taking a risk?",
    "promptHtml": "<p>Which sentence from paragraph 5 supports the idea that the narrator is taking a risk?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>“It was an exhale, a release of sorts, and I instantly wondered if a whale was stranded again.”</p>",
        "text": "“It was an exhale, a release of sorts, and I instantly wondered if a whale was stranded again.”"
      },
      {
        "id": "B",
        "html": "<p>“I looked for a hulking silhouette but couldn’t find one.”</p>",
        "text": "“I looked for a hulking silhouette but couldn’t find one.”"
      },
      {
        "id": "C",
        "html": "<p>“I waited, but there were no more sounds.”</p>",
        "text": "“I waited, but there were no more sounds.”"
      },
      {
        "id": "D",
        "html": "<p>“I knew the flats well enough to know I could get stuck just about anywhere.”</p>",
        "text": "“I knew the flats well enough to know I could get stuck just about anywhere.”"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-highest-tide-2026-2027-form-d-official-shsat-2026-d-32",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "32"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-3c9e409b7b8c6b00e422.png\" alt=\"Official explanation for question 32\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 6.\nI kept stepping toward the one sound I’d heard, a growing part of me hoping I’d find nothing at all.\nHow do the narrator’s actions develop a central idea of the excerpt?",
    "promptHtml": "<p>Read this sentence from <span>paragraph 6.</span></p> <p data-align=\"indent\"><strong>I kept stepping toward the one sound I’d heard, a growing part of me hoping I’d find nothing at all.</strong></p> <p>How do the narrator’s actions develop a central idea of the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The narrator’s concern about the origin of the noise shows dedication to helping preserve sea life in the mudflats.</p>",
        "text": "The narrator’s concern about the origin of the noise shows dedication to helping preserve sea life in the mudflats."
      },
      {
        "id": "B",
        "html": "<p>The narrator’s curiosity about the sea life in the mudflats outweighs any fear about the situation.</p>",
        "text": "The narrator’s curiosity about the sea life in the mudflats outweighs any fear about the situation."
      },
      {
        "id": "C",
        "html": "<p>The narrator’s knowledge about a variety of sea life encourages a search for more specimens to study.</p>",
        "text": "The narrator’s knowledge about a variety of sea life encourages a search for more specimens to study."
      },
      {
        "id": "D",
        "html": "<p>The narrator’s eagerness about new specimens of sea life outweighs the reality that the area is an unlikely place to find them.</p>",
        "text": "The narrator’s eagerness about new specimens of sea life outweighs the reality that the area is an unlikely place to find them."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-highest-tide-2026-2027-form-d-official-shsat-2026-d-33",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "33"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-616a6ce221050c8e23f7.png\" alt=\"Official explanation for question 33\">",
    "points": 1,
    "prompt": "Read these sentences from paragraph 8.\nSo, I was looking at it and not looking at it while my heart spangled my vision. I saw fragments, pieces, and tried to fuse them in my mind but couldn’t be certain of the whole.\nThe sensory language “spangled my vision,” “I saw fragments, pieces,” and “tried to fuse them in my mind” conveys the narrator’s",
    "promptHtml": "<p>Read these sentences from <span>paragraph 8.</span></p> <p data-align=\"indent\"><strong>So, I was looking at it and not looking at it while my heart spangled my vision. I saw fragments, pieces, and tried to fuse them in my mind but couldn’t be certain of the whole.</strong></p> <p>The sensory language “spangled my vision,” “I saw fragments, pieces,” and “tried to fuse them in my mind” conveys the narrator’s</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>extreme excitement about making a great discovery.</p>",
        "text": "extreme excitement about making a great discovery."
      },
      {
        "id": "B",
        "html": "<p>reluctant acceptance that he needs to leave the mudflats.</p>",
        "text": "reluctant acceptance that he needs to leave the mudflats."
      },
      {
        "id": "C",
        "html": "<p>terrified confusion about the creature in the mudflats.</p>",
        "text": "terrified confusion about the creature in the mudflats."
      },
      {
        "id": "D",
        "html": "<p>sudden concern about his personal safety.</p>",
        "text": "sudden concern about his personal safety."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-highest-tide-2026-2027-form-d-official-shsat-2026-d-34",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "34"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-146d611f6344c85081dd.png\" alt=\"Official explanation for question 34\">",
    "points": 1,
    "prompt": "The author develops the narrator’s point of view when the narrator sees the creature by",
    "promptHtml": "<p>The author develops the narrator’s point of view when the narrator sees the creature by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>describing the narrator’s movements as he approaches the creature.</p>",
        "text": "describing the narrator’s movements as he approaches the creature."
      },
      {
        "id": "B",
        "html": "<p>emphasizing the odds of finding the creature in an area inhabited by a rival species.</p>",
        "text": "emphasizing the odds of finding the creature in an area inhabited by a rival species."
      },
      {
        "id": "C",
        "html": "<p>showing the narrator’s growing realization of the creature’s identity.</p>",
        "text": "showing the narrator’s growing realization of the creature’s identity."
      },
      {
        "id": "D",
        "html": "<p>comparing the size of the creature to the size of a vehicle.</p>",
        "text": "comparing the size of the creature to the size of a vehicle."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromTheHighestTide20262027FormDPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-highest-tide-2026-2027-form-d",
  versionLabels: ["2026-2027 Form D"],
  section: "reading",
  questionCount: excerptFromTheHighestTide20262027FormDQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-highest-tide-2026-2027-form-d",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from <em>The Highest Tide</em>",
    blurbHtml: "<em>The narrator’s summer job is collecting marine specimens in Puget Sound, Washington. In this excerpt, he is looking for specimens in the mudflats before daybreak. Mudflats, or flats, are coastal landforms created when sediment and silt from tides are deposited as the tides recede.</em>",
    bylineHtml: "by Jim Lynch",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"D","section":"ELA - Passage Set 5 of 7","packageId":"534f5c8e46112fa95c0b21b03ec65c19e03f5f1196bc05776f626182f01caecd"},
    title: "Excerpt from The Highest Tide",
    author: "Jim Lynch",
    byline: "by Jim Lynch",
    blurb: "The narrator’s summer job is collecting marine specimens in Puget Sound, Washington. In this excerpt, he is looking for specimens in the mudflats before daybreak. Mudflats, or flats, are coastal landforms created when sediment and silt from tides are deposited as the tides recede.",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\"> I rounded the oyster beds, to the far <span>side. . . .</span> It was low tide by then, and I saw the water hesitating at its apex, neither leaving nor returning, patiently waiting for the gravitational gears to shift. Dozens of anxious clams started squirting in unison like they did whenever vibrating grains of sand warned them predators were approaching. I stopped and waited with them, to actually see the moment when the tide started returning with its invisible buffet of plankton for the clams, oysters, mussels and other filter feeders. It was right then, ankle deep in the Sound, feet numbing, eyes relaxed, that I saw the nudibranch.</p> <p data-numbered=\"true\"> In all my time on the flats I’d never seen one before. I’d read about them, sure. I’d handled them at aquariums but never in the wild, and I’d never even seen a photo of one this stunning. It was just three inches long but with dozens of fluorescent, orange-tipped hornlike plumes jutting from the back of its see-through body that appeared to be lit from within.</p> <p data-numbered=\"true\"> Nudibranchs are often called the butterflies of the sea, but even that understates their dazzle. Almost everything else in the northern Pacific is dressed to blend with pale surroundings. Nudibranchs don’t bother, in part because they taste so lousy they don’t need camouflage to survive. But also, I decided right then, because their beauty is so startling it earns them a free pass, the same way everyday life brakes for peacocks, parade <span>floats. . . .</span></p> <p data-numbered=\"true\"> The dark mudflats loomed like wet, flattened dunes stretching deep into Skookumchuck Bay in front of our house. From a distance, they looked too barren to support sea life. Up close, they still did, unless you knew where to find the hearty clams, worms and tiny creatures that flourish in <span>mud. . . .</span> I’m not sure why I decided to take a look. It was still an hour before sunrise, and I knew exactly what the <span data-glossary-definition=\"sandbars\" role=\"link\" tabindex=\"0\">bars</span> looked like in the moonlight, but for some reason, I couldn’t resist.</p> <p data-numbered=\"true\"> I heard it long before I saw it. It was an exhale, a release of sorts, and I instantly wondered if a whale was stranded again. We had a young <span data-glossary-definition=\"species of small whale\" role=\"link\" tabindex=\"0\">minke</span> stuck out there two summers prior, and it made similar noises until the tide rose high enough for rescuers to help free<span> it. . . .</span> I looked for a hulking silhouette but couldn’t find one. I waited, but there were no more sounds. Still, I went toward what I thought I’d heard, avoiding stepping into the mud until I had to. I knew the flats well enough to know I could get stuck just about anywhere. The general rule was you didn’t venture out past the shells and gravel with an incoming tide. I sank up to my knees twice, and numbing water filled my boots.</p> <p data-numbered=\"true\"> . . . I kept stepping toward the one sound I’d heard, a growing part of me hoping I’d find nothing at all. When I stopped to rest and yank up my socks, my headlamp crossed it. My first thought? A giant octopus.</p> <p data-numbered=\"true\"> Puget Sound has some of the biggest octopi in the world. They often balloon to a hundred pounds. Even the great <span data-glossary-definition=\"renowned French oceanographer\" role=\"link\" tabindex=\"0\">Jacques Cousteau</span> himself came to study them. But when I saw the long tubular shape of its upper body and the tangle of tentacles below it, I knew it was more than an octopus. I came closer, within fifty feet, close enough to see its large cylindrical <span data-glossary-definition=\"tube-like organ that is used for drawing in or removing fluids\" role=\"link\" tabindex=\"0\">siphon</span> quiver. I couldn’t tell if it was making any sounds at that point, because it was impossible to hear anything over the blood in my <span>ears. . . .</span></p> <p data-numbered=\"true\"> The creature’s body came to a triangular point above narrow fins that lay flat on the mud like wings, but it was hard to be sure exactly where it all began or ended, or how long its tentacles truly were, because I was afraid to pry my eyes off its jumble of arms for more than half a second. I didn’t know whether I was within reach, and its arms were as big around as my ankle and lined with suckers the size of half-dollars. If they even twitched I would have run. So, I was looking at it and not looking at it while my heart spangled my vision. I saw fragments, pieces, and tried to fuse them in my mind but couldn’t be certain of the whole. I knew what it had to be, but I wouldn’t allow myself to even think the two words. Then I gradually realized the dark shiny disc in the middle of the rubbery mass was too perfectly round to be mud or a reflection.</p> <p data-numbered=\"true\"> It was too late to smother my scream. Its eye was the size of a hubcap.</p>",
    sourceNote: "From THE HIGHEST TIDE by Jim Lynch. Copyright © 2005 by Jim Lynch. Used by permission of Bloomsbury USA. All rights reserved.",
    text: excerptFromTheHighestTide20262027FormDPassageText,
    versionLabel: "2026-2027 Form D",
  }),
  questions: excerptFromTheHighestTide20262027FormDQuestions,
};
