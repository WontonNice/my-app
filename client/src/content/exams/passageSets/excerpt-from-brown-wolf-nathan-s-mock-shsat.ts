import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromBrownWolfNathanSMockShsatPassageText = "SHE had delayed, because of the dew-wet grass, in order to put on her overshoes, and when she emerged from the house found her waiting husband absorbed in the wonder of a bursting almond-bud. She sent a questing glance across the tall grass and in and out among the orchard trees.\n\n“Where’s Wolf?” she asked.\n\n“He was here a moment ago.” Walt Irvine drew himself away with a jerk from the metaphysics and poetry of the organic miracle of blossom, and surveyed the landscape. “He was running a rabbit the last I saw of him.”\n\n“Wolf! Wolf! Here Wolf!” she called, as they left the clearing and took the trail that led down through the waxen-belled manzanita jungle to the county road.\n\nIrvine thrust between his lips the little finger of each hand and lent to her efforts a shrill whistling.\n\nShe covered her ears hastily and made a wry grimace.\n\n“My! for a poet, delicately attuned and all the rest of it, you can make unlovely noises. My ear-drums are pierced. You outwhistle—”\n\n“Orpheus.”\n\n“I was about to say a street-arab,” she concluded severely.\n\n“Poesy does not prevent one from being practical—at least it doesn’t prevent ME. Mine is no futility of genius that can’t sell gems to the magazines.”\n\nHe assumed a mock extravagance, and went on:\n\n“I am no attic singer, no ballroom warbler. And why? Because I am practical. Mine is no squalor of song that cannot transmute itself, with proper exchange value, into a flower-crowned cottage, a sweet mountain-meadow, a grove of red-woods, an orchard of thirty-seven trees, one long row of blackberries and two short rows of strawberries, to say nothing of a quarter of a mile of gurgling brook. I am a beauty-merchant, a trader in song, and I pursue utility, dear Madge. I sing a song, and thanks to the magazine editors I transmute my song into a waft of the west wind sighing through our redwoods, into a murmur of waters over mossy stones that sings back to me another song than the one I sang and yet the same song wonderfully—er—transmuted.”\n\n“O that all your song-transmutations were as successful!” she laughed.\n\n“Name one that wasn’t.”\n\n“Those two beautiful sonnets that you transmuted into the cow that was accounted the worst milker in the township.”\n\n“She was beautiful—” he began,\n\n“But she didn’t give milk,” Madge interrupted.\n\n“But she WAS beautiful, now, wasn’t she?” he insisted.\n\n“And here’s where beauty and utility fall out,” was her reply. “And there’s the Wolf!”\n\nFrom the thicket-covered hillside came a crashing of underbrush, and then, forty feet above them, on the edge of the sheer wall of rock, appeared a wolf’s head and shoulders. His braced fore paws dislodged a pebble, and with sharp-pricked ears and peering eyes he watched the fall of the pebble till it struck at their feet. Then he transferred his gaze and with open mouth laughed down at them.\n\n“You Wolf, you!” and “You blessed Wolf!” the man and woman called out to him.\n\nThe ears flattened back and down at the sound, and the head seemed to snuggle under the caress of an invisible hand.\n\nThey watched him scramble backward into the thicket, then proceeded on their way. Several minutes later, rounding a turn in the trail where the descent was less precipitous, he joined them in the midst of a miniature avalanche of pebbles and loose soil. He was not demonstrative. A pat and a rub around the ears from the man, and a more prolonged caressing from the woman, and he was away down the trail in front of them, gliding effortlessly over the ground in true wolf fashion.\n\nIn build and coat and brush he was a huge timber-wolf; but the lie was given to his wolfhood by his color and marking. There the dog unmistakably advertised itself. No wolf was ever colored like him. He was brown, deep brown, red-brown, an orgy of browns. Back and shoulders were a warm brown that paled on the sides and underneath to a yellow that was dingy because of the brown that lingered in it. The white of the throat and paws and the spots over the eyes was dirty because of the persistent and ineradicable brown, while the eyes themselves were twin topazes, golden and brown.\n\nThe man and woman loved the dog very much; perhaps this was because it had been such a task to win his love. It had been no easy matter when he first drifted in mysteriously out of nowhere to their little mountain cottage. Footsore and famished, he had killed a rabbit under their very noses and under their very windows, and then crawled away and slept by the spring at the foot of the blackberry bushes. When Walt Irvine went down to inspect the intruder, he was snarled at for his pains, and Madge likewise was snarled at when she went down to present, as a peace-offering, a large pan of bread and milk.\n\nA most unsociable dog he proved to be, resenting all their advances, refusing to let them lay hands on him, menacing them with bared fangs and bristling hair. Nevertheless he remained, sleeping and resting by the spring, and eating the food they gave him after they set it down at a safe distance and retreated. His wretched physical condition explained why he lingered; and when he had recuperated, after several days’ sojourn, he disappeared.\n\nAnd this would have been the end of him, so far as Irvine and his wife were concerned, had not Irvine at that particular time been called away into the northern part of the state. Riding along on the train, near to the line between California and Oregon, he chanced to look out of the window and saw his unsociable guest sliding along the wagon road, brown and wolfish, tired yet tireless, dust-covered and soiled with two hundred miles of travel.\n\nNow Irvine was a man of impulse, a poet. He got off the train at the next station, bought a piece of meat at a butcher shop, and captured the vagrant on the outskirts of the town. The return trip was made in the baggage car, and so Wolf came a second time to the mountain cottage. Here he was tied up for a week and made love to by the man and woman. But it was very circumspect love-making. Remote and alien as a traveller from another planet, he snarled down their soft-spoken love-words. He never barked. In all the time they had him he was never known to bark.\n\nTo win him became a problem. Irvine liked problems. He had a metal plate made, on which was stamped: RETURN TO WALT IRVINE, GLEN ELLEN, SONOMA COUNTY, CALIFORNIA. This was riveted to a collar and strapped about the dog’s neck. Then he was turned loose, and promptly he disappeared. A day later came a telegram from Mendocino County. In twenty hours he had made over a hundred miles to the north, and was still going when captured.";

const excerptFromBrownWolfNathanSMockShsatQuestions: ExamQuestion[] = [
  {
    "id": "nms-brown-wolf-1",
    "explanation": "Walt is “absorbed in the wonder” of the bud and has to pull himself away from its “poetry.” C is the opposite: Madge is the one he’s waiting for. A and D aren’t supported.",
    "points": 1,
    "prompt": "In paragraphs 1 and 3, the details about Walt and the almond-bud mainly suggest that he",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "worries that the orchard trees will not produce fruit."
      },
      {
        "id": "B",
        "text": "is easily absorbed by the beauty of nature."
      },
      {
        "id": "C",
        "text": "is impatient to begin the walk down to the county road."
      },
      {
        "id": "D",
        "text": "pays closer attention to the land than Madge does."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-2",
    "explanation": "His “mock extravagance” (paragraph 11) shows he’s joking, and he frames poems as goods he trades for land and comforts. A misses the playful tone. C contradicts “thanks to the magazine editors.”",
    "points": 1,
    "prompt": "Read this sentence from paragraph 12.\n\nI am a beauty-merchant, a trader in song, and I pursue utility, dear Madge.\n\nWalt’s description of himself as a “beauty-merchant” mainly reveals that he",
    "promptHtml": "<p>Read this sentence from paragraph 12.</p><blockquote><strong>I am a beauty-merchant, a trader in song, and I pursue utility, dear Madge.</strong></blockquote><p>Walt’s description of himself as a “beauty-merchant” mainly reveals that he</p>",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "regrets that he must sell his poems in order to support himself."
      },
      {
        "id": "B",
        "text": "playfully presents himself as a practical businessman whose product is poetry."
      },
      {
        "id": "C",
        "text": "believes that magazine editors do not value his work."
      },
      {
        "id": "D",
        "text": "considers himself a more talented poet than other writers."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-3",
    "explanation": "The sonnets that turned into a cow that wouldn’t give milk show that beauty and usefulness “fall out.” C is too serious for the tone. B misreads Madge: she laughs, and the point is the cow, not the sonnets.",
    "points": 1,
    "prompt": "Paragraphs 13–19 contribute to the development of the excerpt mainly by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "explaining how Walt first began selling his poems to magazines."
      },
      {
        "id": "B",
        "text": "suggesting that Madge does not appreciate the beauty of Walt’s sonnets."
      },
      {
        "id": "C",
        "text": "revealing a serious disagreement between Walt and Madge about money."
      },
      {
        "id": "D",
        "text": "showing, through a humorous exchange, that Walt’s poetry does not always lead to useful results."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-4",
    "explanation": "His build says wolf, and his brown coloring “unmistakably” says dog. A is a trap, since the paragraph is about looks, not behavior. D borrows “lie” too literally.",
    "points": 1,
    "prompt": "In paragraph 24, the phrase “the lie was given to his wolfhood by his color and marking” suggests that",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "Wolf’s behavior is gentler than his appearance would lead people to expect."
      },
      {
        "id": "B",
        "text": "Wolf’s coloring shows he is a dog, even though his size and shape resemble a wolf’s."
      },
      {
        "id": "C",
        "text": "Wolf’s coat has faded from living in the warm California climate."
      },
      {
        "id": "D",
        "text": "Walt and Madge were deceived about where Wolf had come from."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-5",
    "explanation": "The narration moves from the present walk back to how Wolf first “drifted in.” A is wrong because winning Wolf over is still unfinished when the excerpt ends.",
    "points": 1,
    "prompt": "How does paragraph 25 fit into the overall structure of the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It introduces a new conflict that is fully resolved by the end of the excerpt."
      },
      {
        "id": "B",
        "text": "It shifts from the walk on the trail to a flashback that explains how Walt and Madge came to have Wolf."
      },
      {
        "id": "C",
        "text": "It shifts the point of view from Walt to Madge."
      },
      {
        "id": "D",
        "text": "It summarizes the events of the walk before the excerpt continues."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-6",
    "explanation": "He covers more than a hundred miles in twenty hours and is “still going,” which shows a compulsion. C gives the reason he stayed, not why he left. A and B show his temperament and hunger.",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that Wolf is driven by an urge he cannot resist?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“He was not demonstrative.” (paragraph 23)"
      },
      {
        "id": "B",
        "text": "“Footsore and famished, he had killed a rabbit under their very noses and under their very windows . . .” (paragraph 25)"
      },
      {
        "id": "C",
        "text": "“His wretched physical condition explained why he lingered; and when he had recuperated, after several days’ sojourn, he disappeared.” (paragraph 26)"
      },
      {
        "id": "D",
        "text": "“In twenty hours he had made over a hundred miles to the north, and was still going when captured.” (paragraph 29)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-7",
    "explanation": "The simile appears right where Wolf “snarled down their soft-spoken love-words,” so it’s about emotional distance. C takes “traveller” literally, and B focuses on looks.",
    "points": 1,
    "prompt": "In paragraph 28, the phrase “Remote and alien as a traveller from another planet” emphasizes that Wolf",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "remains distant and unresponsive to the couple’s affection."
      },
      {
        "id": "B",
        "text": "looks unlike any other animal Walt and Madge have seen."
      },
      {
        "id": "C",
        "text": "had traveled a great distance before reaching California."
      },
      {
        "id": "D",
        "text": "frightens visitors who come to the cottage."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-8",
    "explanation": "“Irvine liked problems.” He jumps off a train and has a collar made with an address plate. B is unsupported, and D mixes in a later part of the story.",
    "points": 1,
    "prompt": "Walt’s actions in paragraphs 28 and 29 mainly reveal that he",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "regrets bringing Wolf back to the cottage after the dog’s first escape."
      },
      {
        "id": "B",
        "text": "is more concerned with Wolf’s value than with the dog’s well-being."
      },
      {
        "id": "C",
        "text": "is determined to win Wolf over and enjoys the challenge of doing so."
      },
      {
        "id": "D",
        "text": "hopes to find the owner from whom Wolf escaped."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-9",
    "explanation": "Paragraph 25 says the couple loved the dog “perhaps” because his love was so hard to win. A oversimplifies the opening banter. B is too absolute, since the couple clearly does come to love and keep him.",
    "points": 1,
    "prompt": "Which statement best describes a theme developed in the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "Practical concerns are more important than beauty."
      },
      {
        "id": "B",
        "text": "Wild animals can never truly be tamed."
      },
      {
        "id": "C",
        "text": "Something that is difficult to win may be valued more deeply."
      },
      {
        "id": "D",
        "text": "Generosity toward strangers is always rewarded."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nms-brown-wolf-10",
    "explanation": "It covers both the present walk and the backstory. D treats the playful banter as an argument and stops partway through. B says Wolf “quickly” became affectionate, which contradicts the excerpt. C adds the Klondike detail, which comes later in the story, and the dog he sees from the train had already stayed at their cottage.",
    "points": 1,
    "prompt": "Which sentence is the best summary of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "As Walt and Madge walk down a mountain trail joking about Walt’s poetry, their dog Wolf joins them, and the narrator explains how the wild, independent dog kept fleeing north after first arriving at their cottage."
      },
      {
        "id": "B",
        "text": "A starving dog arrives at Walt and Madge’s cottage, and after they feed him and give him a collar, he quickly becomes a loyal and affectionate pet."
      },
      {
        "id": "C",
        "text": "Walt, a poet, spots a wolf from a train window and brings it home, where he and Madge learn that it is actually a dog from the Klondike."
      },
      {
        "id": "D",
        "text": "Walt and Madge argue about whether poetry is useful until Wolf interrupts them by knocking a pebble down from a rock wall above the trail."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromBrownWolfNathanSMockShsatPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-brown-wolf-nathan-s-mock-shsat",
  versionLabels: ["Nathan's Mock SHSAT"],
  section: "reading",
  questionCount: excerptFromBrownWolfNathanSMockShsatQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createProsePassage({
    id: "excerpt-from-brown-wolf-nathan-s-mock-shsat",
    title: "Excerpt from “Brown Wolf”",
    author: "Jack London",
    passageType: "literary",
    passageCategory: "miscellaneous",
    richText: "<p>SHE had delayed, because of the dew-wet grass, in order to put on her overshoes, and when she emerged from the house found her waiting husband absorbed in the wonder of a bursting almond-bud. She sent a questing glance across the tall grass and in and out among the orchard trees.</p><p>“Where’s Wolf?” she asked.</p><p>“He was here a moment ago.” Walt Irvine drew himself away with a jerk from the metaphysics and poetry of the organic miracle of blossom, and surveyed the landscape. “He was running a rabbit the last I saw of him.”</p><p>“Wolf! Wolf! Here Wolf!” she called, as they left the clearing and took the trail that led down through the waxen-belled manzanita jungle to the county road.</p><p>Irvine thrust between his lips the little finger of each hand and lent to her efforts a shrill whistling.</p><p>She covered her ears hastily and made a wry grimace.</p><p>“My! for a poet, delicately attuned and all the rest of it, you can make unlovely noises. My ear-drums are pierced. You outwhistle—”</p><p>“<span data-glossary-definition=\"a musician in Greek mythology whose music could charm animals\" role=\"link\" tabindex=\"0\">Orpheus</span>.”</p><p>“I was about to say a <span data-glossary-definition=\"an old term for a child who roams city streets\" role=\"link\" tabindex=\"0\">street-arab</span>,” she concluded severely.</p><p>“Poesy does not prevent one from being practical—at least it doesn’t prevent ME. Mine is no futility of genius that can’t sell gems to the magazines.”</p><p>He assumed a mock extravagance, and went on:</p><p>“I am no attic singer, no ballroom warbler. And why? Because I am practical. Mine is no squalor of song that cannot <span data-glossary-definition=\"to change from one form into another\" role=\"link\" tabindex=\"0\">transmute</span> itself, with proper exchange value, into a flower-crowned cottage, a sweet mountain-meadow, a grove of red-woods, an orchard of thirty-seven trees, one long row of blackberries and two short rows of strawberries, to say nothing of a quarter of a mile of gurgling brook. I am a beauty-merchant, a trader in song, and I pursue utility, dear Madge. I sing a song, and thanks to the magazine editors I transmute my song into a waft of the west wind sighing through our redwoods, into a murmur of waters over mossy stones that sings back to me another song than the one I sang and yet the same song wonderfully—er—transmuted.”</p><p>“O that all your song-transmutations were as successful!” she laughed.</p><p>“Name one that wasn’t.”</p><p>“Those two beautiful sonnets that you transmuted into the cow that was accounted the worst milker in the township.”</p><p>“She was beautiful—” he began,</p><p>“But she didn’t give milk,” Madge interrupted.</p><p>“But she WAS beautiful, now, wasn’t she?” he insisted.</p><p>“And here’s where beauty and utility fall out,” was her reply. “And there’s the Wolf!”</p><p>From the thicket-covered hillside came a crashing of underbrush, and then, forty feet above them, on the edge of the sheer wall of rock, appeared a wolf’s head and shoulders. His braced fore paws dislodged a pebble, and with sharp-pricked ears and peering eyes he watched the fall of the pebble till it struck at their feet. Then he transferred his gaze and with open mouth laughed down at them.</p><p>“You Wolf, you!” and “You blessed Wolf!” the man and woman called out to him.</p><p>The ears flattened back and down at the sound, and the head seemed to snuggle under the caress of an invisible hand.</p><p>They watched him scramble backward into the thicket, then proceeded on their way. Several minutes later, rounding a turn in the trail where the descent was less precipitous, he joined them in the midst of a miniature avalanche of pebbles and loose soil. He was not demonstrative. A pat and a rub around the ears from the man, and a more prolonged caressing from the woman, and he was away down the trail in front of them, gliding effortlessly over the ground in true wolf fashion.</p><p>In build and coat and <span data-glossary-definition=\"a bushy tail\" role=\"link\" tabindex=\"0\">brush</span> he was a huge timber-wolf; but the lie was given to his wolfhood by his color and marking. There the dog unmistakably advertised itself. No wolf was ever colored like him. He was brown, deep brown, red-brown, an orgy of browns. Back and shoulders were a warm brown that paled on the sides and underneath to a yellow that was dingy because of the brown that lingered in it. The white of the throat and paws and the spots over the eyes was dirty because of the persistent and ineradicable brown, while the eyes themselves were twin <span data-glossary-definition=\"golden-brown gemstones\" role=\"link\" tabindex=\"0\">topazes</span>, golden and brown.</p><p>The man and woman loved the dog very much; perhaps this was because it had been such a task to win his love. It had been no easy matter when he first drifted in mysteriously out of nowhere to their little mountain cottage. Footsore and famished, he had killed a rabbit under their very noses and under their very windows, and then crawled away and slept by the spring at the foot of the blackberry bushes. When Walt Irvine went down to inspect the intruder, he was snarled at for his pains, and Madge likewise was snarled at when she went down to present, as a peace-offering, a large pan of bread and milk.</p><p>A most unsociable dog he proved to be, resenting all their advances, refusing to let them lay hands on him, menacing them with bared fangs and bristling hair. Nevertheless he remained, sleeping and resting by the spring, and eating the food they gave him after they set it down at a safe distance and retreated. His wretched physical condition explained why he lingered; and when he had recuperated, after several days’ <span data-glossary-definition=\"a short stay\" role=\"link\" tabindex=\"0\">sojourn</span>, he disappeared.</p><p>And this would have been the end of him, so far as Irvine and his wife were concerned, had not Irvine at that particular time been called away into the northern part of the state. Riding along on the train, near to the line between California and Oregon, he chanced to look out of the window and saw his unsociable guest sliding along the wagon road, brown and wolfish, tired yet tireless, dust-covered and soiled with two hundred miles of travel.</p><p>Now Irvine was a man of impulse, a poet. He got off the train at the next station, bought a piece of meat at a butcher shop, and captured the vagrant on the outskirts of the town. The return trip was made in the baggage car, and so Wolf came a second time to the mountain cottage. Here he was tied up for a week and made love to by the man and woman. But it was very <span data-glossary-definition=\"careful, cautious\" role=\"link\" tabindex=\"0\">circumspect</span> love-making. Remote and alien as a traveller from another planet, he snarled down their soft-spoken love-words. He never barked. In all the time they had him he was never known to bark.</p><p>To win him became a problem. Irvine liked problems. He had a metal plate made, on which was stamped: RETURN TO WALT IRVINE, GLEN ELLEN, SONOMA COUNTY, CALIFORNIA. This was riveted to a collar and strapped about the dog’s neck. Then he was turned loose, and promptly he disappeared. A day later came a telegram from Mendocino County. In twenty hours he had made over a hundred miles to the north, and was still going when captured.</p>",
    sourceNote: "“Brown Wolf” by Jack London—Public Domain",
    text: excerptFromBrownWolfNathanSMockShsatPassageText,
    versionLabel: "Nathan's Mock SHSAT",
  }),
  questions: excerptFromBrownWolfNathanSMockShsatQuestions,
};
