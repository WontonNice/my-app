import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromBrownWolfNathanSMockShsatHardPassageText = "SHE had delayed, because of the dew-wet grass, in order to put on her overshoes, and when she emerged from the house found her waiting husband absorbed in the wonder of a bursting almond-bud. She sent a questing glance across the tall grass and in and out among the orchard trees.\n\n“Where’s Wolf?” she asked.\n\n“He was here a moment ago.” Walt Irvine drew himself away with a jerk from the metaphysics and poetry of the organic miracle of blossom, and surveyed the landscape. “He was running a rabbit the last I saw of him.”\n\n“Wolf! Wolf! Here Wolf!” she called, as they left the clearing and took the trail that led down through the waxen-belled manzanita jungle to the county road.\n\nIrvine thrust between his lips the little finger of each hand and lent to her efforts a shrill whistling.\n\nShe covered her ears hastily and made a wry grimace.\n\n“My! for a poet, delicately attuned and all the rest of it, you can make unlovely noises. My ear-drums are pierced. You outwhistle—”\n\n“Orpheus.”\n\n“I was about to say a street-arab,” she concluded severely.\n\n“Poesy does not prevent one from being practical—at least it doesn’t prevent ME. Mine is no futility of genius that can’t sell gems to the magazines.”\n\nHe assumed a mock extravagance, and went on:\n\n“I am no attic singer, no ballroom warbler. And why? Because I am practical. Mine is no squalor of song that cannot transmute itself, with proper exchange value, into a flower-crowned cottage, a sweet mountain-meadow, a grove of red-woods, an orchard of thirty-seven trees, one long row of blackberries and two short rows of strawberries, to say nothing of a quarter of a mile of gurgling brook. I am a beauty-merchant, a trader in song, and I pursue utility, dear Madge. I sing a song, and thanks to the magazine editors I transmute my song into a waft of the west wind sighing through our redwoods, into a murmur of waters over mossy stones that sings back to me another song than the one I sang and yet the same song wonderfully—er—transmuted.”\n\n“O that all your song-transmutations were as successful!” she laughed.\n\n“Name one that wasn’t.”\n\n“Those two beautiful sonnets that you transmuted into the cow that was accounted the worst milker in the township.”\n\n“She was beautiful—” he began,\n\n“But she didn’t give milk,” Madge interrupted.\n\n“But she WAS beautiful, now, wasn’t she?” he insisted.\n\n“And here’s where beauty and utility fall out,” was her reply. “And there’s the Wolf!”\n\nFrom the thicket-covered hillside came a crashing of underbrush, and then, forty feet above them, on the edge of the sheer wall of rock, appeared a wolf’s head and shoulders. His braced fore paws dislodged a pebble, and with sharp-pricked ears and peering eyes he watched the fall of the pebble till it struck at their feet. Then he transferred his gaze and with open mouth laughed down at them.\n\n“You Wolf, you!” and “You blessed Wolf!” the man and woman called out to him.\n\nThe ears flattened back and down at the sound, and the head seemed to snuggle under the caress of an invisible hand.\n\nThey watched him scramble backward into the thicket, then proceeded on their way. Several minutes later, rounding a turn in the trail where the descent was less precipitous, he joined them in the midst of a miniature avalanche of pebbles and loose soil. He was not demonstrative. A pat and a rub around the ears from the man, and a more prolonged caressing from the woman, and he was away down the trail in front of them, gliding effortlessly over the ground in true wolf fashion.\n\nIn build and coat and brush he was a huge timber-wolf; but the lie was given to his wolfhood by his color and marking. There the dog unmistakably advertised itself. No wolf was ever colored like him. He was brown, deep brown, red-brown, an orgy of browns. Back and shoulders were a warm brown that paled on the sides and underneath to a yellow that was dingy because of the brown that lingered in it. The white of the throat and paws and the spots over the eyes was dirty because of the persistent and ineradicable brown, while the eyes themselves were twin topazes, golden and brown.\n\nThe man and woman loved the dog very much; perhaps this was because it had been such a task to win his love. It had been no easy matter when he first drifted in mysteriously out of nowhere to their little mountain cottage. Footsore and famished, he had killed a rabbit under their very noses and under their very windows, and then crawled away and slept by the spring at the foot of the blackberry bushes. When Walt Irvine went down to inspect the intruder, he was snarled at for his pains, and Madge likewise was snarled at when she went down to present, as a peace-offering, a large pan of bread and milk.\n\nA most unsociable dog he proved to be, resenting all their advances, refusing to let them lay hands on him, menacing them with bared fangs and bristling hair. Nevertheless he remained, sleeping and resting by the spring, and eating the food they gave him after they set it down at a safe distance and retreated. His wretched physical condition explained why he lingered; and when he had recuperated, after several days’ sojourn, he disappeared.\n\nAnd this would have been the end of him, so far as Irvine and his wife were concerned, had not Irvine at that particular time been called away into the northern part of the state. Riding along on the train, near to the line between California and Oregon, he chanced to look out of the window and saw his unsociable guest sliding along the wagon road, brown and wolfish, tired yet tireless, dust-covered and soiled with two hundred miles of travel.\n\nNow Irvine was a man of impulse, a poet. He got off the train at the next station, bought a piece of meat at a butcher shop, and captured the vagrant on the outskirts of the town. The return trip was made in the baggage car, and so Wolf came a second time to the mountain cottage. Here he was tied up for a week and made love to by the man and woman. But it was very circumspect love-making. Remote and alien as a traveller from another planet, he snarled down their soft-spoken love-words. He never barked. In all the time they had him he was never known to bark.\n\nTo win him became a problem. Irvine liked problems. He had a metal plate made, on which was stamped: RETURN TO WALT IRVINE, GLEN ELLEN, SONOMA COUNTY, CALIFORNIA. This was riveted to a collar and strapped about the dog’s neck. Then he was turned loose, and promptly he disappeared. A day later came a telegram from Mendocino County. In twenty hours he had made over a hundred miles to the north, and was still going when captured.";

const excerptFromBrownWolfNathanSMockShsatHardQuestions: ExamQuestion[] = [
  {
    "id": "nmsh-brown-wolf-1",
    "explanation": "He “assumed a mock extravagance,” so the bragging is a joke he’s in on. C is literal: it takes the mock-boast about “futility of genius” at face value. A is reversed.",
    "explanationHtml": "<p>He “assumed a mock extravagance,” so the bragging is a joke he’s in on. C is <em>literal</em>: it takes the mock-boast about “futility of genius” at face value. A is <em>reversed</em>.</p>",
    "points": 1,
    "prompt": "In paragraphs 10–12, Walt’s speech mainly reveals that he",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "is privately embarrassed that he must earn money from his poetry."
      },
      {
        "id": "B",
        "text": "takes pride, with self-mocking humor, in turning his poems into the comforts of their home."
      },
      {
        "id": "C",
        "text": "believes that poets who cannot sell their work lack real talent."
      },
      {
        "id": "D",
        "text": "hopes to persuade Madge that they should buy more land."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-2",
    "explanation": "Walt uses the word proudly, and Madge turns it against him with the sonnets and the cow. A and C are outside-the-text.",
    "explanationHtml": "<p>Walt uses the word proudly, and Madge turns it against him with the sonnets and the cow. A and C are <em>outside-the-text</em>.</p>",
    "points": 1,
    "prompt": "Forms of the word “transmute” are repeated throughout paragraphs 12–15. This repetition mainly",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "emphasizes how difficult it is for Walt to sell his poems."
      },
      {
        "id": "B",
        "text": "suggests that Madge does not understand Walt’s poetry."
      },
      {
        "id": "C",
        "text": "reveals that most of Walt’s poems are about nature."
      },
      {
        "id": "D",
        "text": "creates a running joke about turning poems into goods, which Madge then uses to tease Walt."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-3",
    "explanation": "The tone is light (“she laughed”), and the line sums up the cow joke. A is overstated (“every situation”). B is tempting because Wolf appears right after, but nothing calls him useless. C is wrong because it’s banter, not an argument.",
    "explanationHtml": "<p>The tone is light (“she laughed”), and the line sums up the cow joke. A is <em>overstated</em> (“every situation”). B is tempting because Wolf appears right after, but nothing calls him useless. C is wrong because it’s banter, not an argument.</p>",
    "points": 1,
    "prompt": "In paragraph 19, Madge says, “here’s where beauty and utility fall out.” This statement contributes to the excerpt mainly by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "revealing that Madge values usefulness over beauty in every situation."
      },
      {
        "id": "B",
        "text": "foreshadowing that Wolf will be beautiful but useless as a pet."
      },
      {
        "id": "C",
        "text": "ending the couple’s argument by proving that Walt was wrong."
      },
      {
        "id": "D",
        "text": "playfully summing up a tension between Walt’s ideals and the couple’s practical needs."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-4",
    "explanation": "“Laughed” gives the wolfish animal a human touch. B and C are literal readings. D is out-of-order: the snarling belongs to the flashback, not to this moment.",
    "explanationHtml": "<p>“Laughed” gives the wolfish animal a human touch. B and C are <em>literal</em> readings. D is <em>out-of-order</em>: the snarling belongs to the flashback, not to this moment.</p>",
    "points": 1,
    "prompt": "In paragraph 20, the detail that Wolf “with open mouth laughed down at them” primarily serves to",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "give Wolf a playful, almost human quality that contrasts with his wolfish appearance."
      },
      {
        "id": "B",
        "text": "suggest that Wolf is mocking Walt and Madge for their disagreement."
      },
      {
        "id": "C",
        "text": "show that Wolf is out of breath from chasing the rabbit."
      },
      {
        "id": "D",
        "text": "foreshadow the snarling with which Wolf first greeted the couple."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-5",
    "explanation": "He accepts the petting and then trots off, which shows both affection and restraint. A is half-right (affection only), and B and D are half-right too (restraint only).",
    "explanationHtml": "<p>He accepts the petting and then trots off, which shows both affection and restraint. A is <em>half-right</em> (affection only), and B and D are <em>half-right</em> too (restraint only).</p>",
    "points": 1,
    "prompt": "Which sentence best supports the idea that Wolf’s affection for the couple is real but restrained?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“The ears flattened back and down at the sound, and the head seemed to snuggle under the caress of an invisible hand.” (paragraph 22)"
      },
      {
        "id": "B",
        "text": "“He was not demonstrative.” (paragraph 23)"
      },
      {
        "id": "C",
        "text": "“A pat and a rub around the ears from the man, and a more prolonged caressing from the woman, and he was away down the trail in front of them . . .” (paragraph 23)"
      },
      {
        "id": "D",
        "text": "“He never barked.” (paragraph 28)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-6",
    "explanation": "The sentence links the couple’s love to how hard it was to win, then leads into how he arrived. D is tempting, but the narrator never blames Wolf.",
    "explanationHtml": "<p>The sentence links the couple’s love to how hard it was to win, then leads into how he arrived. D is tempting, but the narrator never blames Wolf.</p>",
    "points": 1,
    "prompt": "The first sentence of paragraph 25 (“The man and woman loved the dog very much; perhaps this was because it had been such a task to win his love”) mainly functions to",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "explain why Wolf eventually chose to stay at the cottage."
      },
      {
        "id": "B",
        "text": "reveal that Walt and Madge regretted the effort they spent on Wolf."
      },
      {
        "id": "C",
        "text": "introduce the flashback by suggesting that the struggle to win Wolf deepened the couple’s attachment."
      },
      {
        "id": "D",
        "text": "contrast the couple’s patience with Wolf’s lack of gratitude."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-7",
    "explanation": "He stays because he’s weak, then leaves once he’s recovered. B is reversed: he snarls at them the whole time. D is outside-the-text.",
    "explanationHtml": "<p>He stays because he’s weak, then leaves once he’s recovered. B is <em>reversed</em>: he snarls at them the whole time. D is <em>outside-the-text</em>.</p>",
    "points": 1,
    "prompt": "In paragraph 26, the narrator states that Wolf’s “wretched physical condition explained why he lingered.” This detail suggests that Wolf",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "had been mistreated by Walt and Madge before he left."
      },
      {
        "id": "B",
        "text": "stayed because he was beginning to trust the couple."
      },
      {
        "id": "C",
        "text": "stayed only out of necessity rather than any attachment to the couple."
      },
      {
        "id": "D",
        "text": "could not find food anywhere else in the mountains."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-8",
    "explanation": "The paradox puts his worn-out body against his relentless drive. D is a trap: he was clearly heading somewhere, more than 200 miles north. C is overstated.",
    "explanationHtml": "<p>The paradox puts his worn-out body against his relentless drive. D is a trap: he was clearly heading somewhere, more than 200 miles north. C is <em>overstated</em>.</p>",
    "points": 1,
    "prompt": "In paragraph 27, the description of Wolf as “tired yet tireless” mainly emphasizes",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "that Wolf’s journey was harder than the couple had realized."
      },
      {
        "id": "B",
        "text": "the contrast between Wolf’s physical exhaustion and his unstoppable drive."
      },
      {
        "id": "C",
        "text": "that Wolf was strong enough to travel without stopping to eat."
      },
      {
        "id": "D",
        "text": "that Wolf, though weakened, was wandering without a clear direction."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-9",
    "explanation": "He runs north every time he’s let go, and no one can explain why. B is outside-the-text: the excerpt never says he’s looking for anyone. D is reversed.",
    "explanationHtml": "<p>He runs north every time he’s let go, and no one can explain why. B is <em>outside-the-text</em>: the excerpt never says he’s looking for anyone. D is <em>reversed</em>.</p>",
    "points": 1,
    "prompt": "Paragraphs 27–29 develop Wolf’s character mainly by showing that he",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "is driven by a powerful, unexplained urge that resists every effort to keep him."
      },
      {
        "id": "B",
        "text": "is searching for the owner from whom he ran away."
      },
      {
        "id": "C",
        "text": "trusts Madge more than he trusts Walt."
      },
      {
        "id": "D",
        "text": "becomes more comfortable at the cottage each time he returns."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-10",
    "explanation": "Walt is “a man of impulse, a poet”: he jumps off a train, buys meat, has a collar made, and “liked problems,” all for a dog with no practical use. A is the main trap: Wolf is never called useless. B is reversed because Walt acts on impulse, not practicality. C is outside-the-text.",
    "explanationHtml": "<p>Walt is “a man of impulse, a poet”: he jumps off a train, buys meat, has a collar made, and “liked problems,” all for a dog with no practical use. A is the main trap: Wolf is never called useless. B is <em>reversed</em> because Walt acts on impulse, not practicality. C is <em>outside-the-text</em>.</p>",
    "points": 1,
    "prompt": "The opening conversation about beauty and utility connects to the account of Walt and Wolf mainly because",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "Wolf, like Walt’s sonnets, turns out to be beautiful but useless."
      },
      {
        "id": "B",
        "text": "Walt’s practical nature explains why he succeeds in capturing Wolf."
      },
      {
        "id": "C",
        "text": "Madge’s concern with usefulness explains why she cannot win Wolf over."
      },
      {
        "id": "D",
        "text": "Walt’s willingness to spend effort and money on something he values for its own sake shows in his pursuit of Wolf."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "nmsh-brown-wolf-tei",
    "explanation": "C shows Wolf refusing to be touched and threatening the couple, and E shows him leaving the moment he is free, even after being tied up and given a collar. A shows affection, not resistance. B shows his hunger, and D describes something Walt does, not Wolf.",
    "points": 1,
    "prompt": "Select the two sentences that best show Wolf resisting Walt and Madge’s efforts to keep him.",
    "promptHtml": "Select the <strong>two</strong> sentences that <strong>best</strong> show Wolf resisting Walt and Madge’s efforts to keep him.",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“The ears flattened back and down at the sound, and the head seemed to snuggle under the caress of an invisible hand.” (paragraph 22)"
      },
      {
        "id": "B",
        "text": "“Footsore and famished, he had killed a rabbit under their very noses and under their very windows . . .” (paragraph 25)"
      },
      {
        "id": "C",
        "text": "“A most unsociable dog he proved to be, resenting all their advances, refusing to let them lay hands on him, menacing them with bared fangs and bristling hair.” (paragraph 26)"
      },
      {
        "id": "D",
        "text": "“The return trip was made in the baggage car, and so Wolf came a second time to the mountain cottage.” (paragraph 28)"
      },
      {
        "id": "E",
        "text": "“Then he was turned loose, and promptly he disappeared.” (paragraph 29)"
      }
    ],
    "correctChoiceIds": [
      "C",
      "E"
    ],
    "requiredSelections": 2,
    "type": "multi_select"
  }
];

export const excerptFromBrownWolfNathanSMockShsatHardPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-brown-wolf-nathan-s-mock-shsat-hard",
  versionLabels: ["Nathan's Mock SHSAT (Hard)"],
  section: "reading",
  questionCount: excerptFromBrownWolfNathanSMockShsatHardQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createProsePassage({
    id: "excerpt-from-brown-wolf-nathan-s-mock-shsat-hard",
    title: "Excerpt from “Brown Wolf”",
    author: "Jack London",
    passageType: "literary",
    passageCategory: "miscellaneous",
    richText: "<p>SHE had delayed, because of the dew-wet grass, in order to put on her overshoes, and when she emerged from the house found her waiting husband absorbed in the wonder of a bursting almond-bud. She sent a questing glance across the tall grass and in and out among the orchard trees.</p><p>“Where’s Wolf?” she asked.</p><p>“He was here a moment ago.” Walt Irvine drew himself away with a jerk from the metaphysics and poetry of the organic miracle of blossom, and surveyed the landscape. “He was running a rabbit the last I saw of him.”</p><p>“Wolf! Wolf! Here Wolf!” she called, as they left the clearing and took the trail that led down through the waxen-belled manzanita jungle to the county road.</p><p>Irvine thrust between his lips the little finger of each hand and lent to her efforts a shrill whistling.</p><p>She covered her ears hastily and made a wry grimace.</p><p>“My! for a poet, delicately attuned and all the rest of it, you can make unlovely noises. My ear-drums are pierced. You outwhistle—”</p><p>“<span data-glossary-definition=\"a musician in Greek mythology whose music could charm animals\" role=\"link\" tabindex=\"0\">Orpheus</span>.”</p><p>“I was about to say a <span data-glossary-definition=\"an old term for a child who roams city streets\" role=\"link\" tabindex=\"0\">street-arab</span>,” she concluded severely.</p><p>“Poesy does not prevent one from being practical—at least it doesn’t prevent ME. Mine is no futility of genius that can’t sell gems to the magazines.”</p><p>He assumed a mock extravagance, and went on:</p><p>“I am no attic singer, no ballroom warbler. And why? Because I am practical. Mine is no squalor of song that cannot <span data-glossary-definition=\"to change from one form into another\" role=\"link\" tabindex=\"0\">transmute</span> itself, with proper exchange value, into a flower-crowned cottage, a sweet mountain-meadow, a grove of red-woods, an orchard of thirty-seven trees, one long row of blackberries and two short rows of strawberries, to say nothing of a quarter of a mile of gurgling brook. I am a beauty-merchant, a trader in song, and I pursue utility, dear Madge. I sing a song, and thanks to the magazine editors I transmute my song into a waft of the west wind sighing through our redwoods, into a murmur of waters over mossy stones that sings back to me another song than the one I sang and yet the same song wonderfully—er—transmuted.”</p><p>“O that all your song-transmutations were as successful!” she laughed.</p><p>“Name one that wasn’t.”</p><p>“Those two beautiful sonnets that you transmuted into the cow that was accounted the worst milker in the township.”</p><p>“She was beautiful—” he began,</p><p>“But she didn’t give milk,” Madge interrupted.</p><p>“But she WAS beautiful, now, wasn’t she?” he insisted.</p><p>“And here’s where beauty and utility fall out,” was her reply. “And there’s the Wolf!”</p><p>From the thicket-covered hillside came a crashing of underbrush, and then, forty feet above them, on the edge of the sheer wall of rock, appeared a wolf’s head and shoulders. His braced fore paws dislodged a pebble, and with sharp-pricked ears and peering eyes he watched the fall of the pebble till it struck at their feet. Then he transferred his gaze and with open mouth laughed down at them.</p><p>“You Wolf, you!” and “You blessed Wolf!” the man and woman called out to him.</p><p>The ears flattened back and down at the sound, and the head seemed to snuggle under the caress of an invisible hand.</p><p>They watched him scramble backward into the thicket, then proceeded on their way. Several minutes later, rounding a turn in the trail where the descent was less precipitous, he joined them in the midst of a miniature avalanche of pebbles and loose soil. He was not demonstrative. A pat and a rub around the ears from the man, and a more prolonged caressing from the woman, and he was away down the trail in front of them, gliding effortlessly over the ground in true wolf fashion.</p><p>In build and coat and <span data-glossary-definition=\"a bushy tail\" role=\"link\" tabindex=\"0\">brush</span> he was a huge timber-wolf; but the lie was given to his wolfhood by his color and marking. There the dog unmistakably advertised itself. No wolf was ever colored like him. He was brown, deep brown, red-brown, an orgy of browns. Back and shoulders were a warm brown that paled on the sides and underneath to a yellow that was dingy because of the brown that lingered in it. The white of the throat and paws and the spots over the eyes was dirty because of the persistent and ineradicable brown, while the eyes themselves were twin <span data-glossary-definition=\"golden-brown gemstones\" role=\"link\" tabindex=\"0\">topazes</span>, golden and brown.</p><p>The man and woman loved the dog very much; perhaps this was because it had been such a task to win his love. It had been no easy matter when he first drifted in mysteriously out of nowhere to their little mountain cottage. Footsore and famished, he had killed a rabbit under their very noses and under their very windows, and then crawled away and slept by the spring at the foot of the blackberry bushes. When Walt Irvine went down to inspect the intruder, he was snarled at for his pains, and Madge likewise was snarled at when she went down to present, as a peace-offering, a large pan of bread and milk.</p><p>A most unsociable dog he proved to be, resenting all their advances, refusing to let them lay hands on him, menacing them with bared fangs and bristling hair. Nevertheless he remained, sleeping and resting by the spring, and eating the food they gave him after they set it down at a safe distance and retreated. His wretched physical condition explained why he lingered; and when he had recuperated, after several days’ <span data-glossary-definition=\"a short stay\" role=\"link\" tabindex=\"0\">sojourn</span>, he disappeared.</p><p>And this would have been the end of him, so far as Irvine and his wife were concerned, had not Irvine at that particular time been called away into the northern part of the state. Riding along on the train, near to the line between California and Oregon, he chanced to look out of the window and saw his unsociable guest sliding along the wagon road, brown and wolfish, tired yet tireless, dust-covered and soiled with two hundred miles of travel.</p><p>Now Irvine was a man of impulse, a poet. He got off the train at the next station, bought a piece of meat at a butcher shop, and captured the vagrant on the outskirts of the town. The return trip was made in the baggage car, and so Wolf came a second time to the mountain cottage. Here he was tied up for a week and made love to by the man and woman. But it was very <span data-glossary-definition=\"careful, cautious\" role=\"link\" tabindex=\"0\">circumspect</span> love-making. Remote and alien as a traveller from another planet, he snarled down their soft-spoken love-words. He never barked. In all the time they had him he was never known to bark.</p><p>To win him became a problem. Irvine liked problems. He had a metal plate made, on which was stamped: RETURN TO WALT IRVINE, GLEN ELLEN, SONOMA COUNTY, CALIFORNIA. This was riveted to a collar and strapped about the dog’s neck. Then he was turned loose, and promptly he disappeared. A day later came a telegram from Mendocino County. In twenty hours he had made over a hundred miles to the north, and was still going when captured.</p>",
    sourceNote: "“Brown Wolf” by Jack London—Public Domain",
    text: excerptFromBrownWolfNathanSMockShsatHardPassageText,
    versionLabel: "Nathan's Mock SHSAT (Hard)",
  }),
  questions: excerptFromBrownWolfNathanSMockShsatHardQuestions,
};
