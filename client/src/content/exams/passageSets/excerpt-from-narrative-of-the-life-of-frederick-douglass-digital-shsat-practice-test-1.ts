import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1PassageText = "Covey would be out with us. The way he used to stand it, was this. He would spend the most of his afternoons in bed. He would then come out fresh in the evening, ready to urge us on with his words, example, and frequently with the whip. Mr. Covey was one of the few slaveholders who could and did work with his hands. He was a hard-working man. He knew by himself just what a man or a boy could do. There was no deceiving him. His work went on in his absence almost as well as in his presence; and he had the faculty of making us feel that he was ever present with us. This he did by surprising us. He seldom approached the spot where we were at work openly, if he could do it secretly. He always aimed at taking us by surprise. Such was his cunning, that we used to call him, among ourselves, “the snake.” When we were at work in the cornfield, he would sometimes crawl on his hands and knees to avoid detection, and all at once he would rise nearly in our midst, and scream out, “Ha, ha! Come, come! Dash on, dash on!” This being his mode of attack, it was never safe to stop a single minute. His comings were like a thief in the night. He appeared to us as being ever at hand. He was under every tree, behind every stump, in every bush, and at every window, on the plantation. Again, he would sometimes walk up to us, and give us orders as though he was upon the point of starting on a long journey, turn his back upon us, and make as though he was going to the house to get ready; and, before he would get half way thither, he would turn short and crawl into a fence-corner, or behind some tree, and there watch us till the going down of the sun.\n\nOur house stood within a few rods of the Chesapeake Bay, whose broad bosom was ever white with sails from every quarter of the habitable globe. Those beautiful vessels, robed in purest white, so delightful to the eye of freemen, were to me so many shrouded ghosts, to terrify and torment me with thoughts of my wretched condition. I have often, in the deep stillness of a summer’s Sabbath, stood all alone upon the lofty banks of that noble bay, and traced, with saddened heart and tearful eye, the countless number of sails moving off to the mighty ocean. The sight of these always affected me powerfully. My thoughts would compel utterance; and there, with no audience but the Almighty, I would pour out my soul’s complaint, in my rude way, with an apostrophe to the moving multitude of ships:—\n\n“You are loosed from your moorings, and are free; I am fast in my chains, and am a slave! You move merrily before the gentle gale, and I sadly before the bloody whip! You are freedom’s swift-winged angels, that fly round the world; I am confined in bands of iron! O that I were free! O, that I were on one of your gallant decks, and under your protecting wing! Alas! betwixt me and you, the turbid waters roll. Go on, go on. O that I could also go! Could I but swim! If I could fly! O, why was I born a man, of whom to make a brute! The glad ship is gone; she hides in the dim distance. I am left in the hottest hell of unending slavery. O God, save me! God, deliver me! Let me be free! Is there any God? Why am I a slave? I will run away. I will not stand it. Get caught, or get clear, I’ll try it. I had as well die with ague as the fever. I have only one life to lose. I had as well be killed running as die standing. Only think of it; one hundred miles straight north, and I am free! Try it? Yes! God helping me, I will. It cannot be that I shall live and die a slave. I will take to the water. This very bay shall yet bear me into freedom. The steamboats steered in a north-east course from North Point. I will do the same; and when I get to the head of the bay, I will turn my canoe adrift, and walk straight through Delaware into Pennsylvania. When I get there, I shall not be required to have a pass; I can travel without being disturbed. Let but the first opportunity offer, and, come what will, I am off. Meanwhile, I will try to bear up under the yoke. I am not the only slave in the world. Why should I fret? I can bear as much as any of them. Besides, I am but a boy, and all boys are bound to some one. It may be that my misery in slavery will only increase my happiness when I get free. There is a better day coming.”\n\nThus I used to think, and thus I used to speak to myself; goaded almost to madness at one moment, and at the next reconciling myself to my wretched lot.";

const excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1-passage-1",
    "explanation": "The paragraph describes Covey's cunning tactics — crawling to avoid detection, pretending to leave, hiding behind trees — showing that he ruled through the constant possibility of being watched, not simply by standing over the workers.",
    "points": 1,
    "prompt": "Which best states the central idea of the passage's first paragraph?",
    "promptHtml": "Which <strong>best</strong> states the central idea of the passage's first paragraph?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "Covey preferred to work far away from the fields he supervised."
      },
      {
        "id": "B",
        "text": "Covey relied on constant surveillance and fear of being caught, not presence."
      },
      {
        "id": "C",
        "text": "Covey was well liked by the people who worked under him."
      },
      {
        "id": "D",
        "text": "Covey rarely checked on the progress of the work being done."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1-passage-2",
    "explanation": "The surveillance described in paragraph one and the longing for freedom voiced in paragraphs two through four are two faces of the same experience: constant control paired with an unbroken inner resolve toward escape.",
    "points": 1,
    "prompt": "Which choice most fully captures the central idea that ties together Douglass's description of the bay, the ships, and his own reflection?",
    "promptHtml": "Which choice <strong>most fully</strong> captures the central idea that ties together Douglass's description of the bay, the ships, and his own reflection?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "Even under surveillance, the narrator held onto an active longing."
      },
      {
        "id": "B",
        "text": "The narrator believed that Covey was secretly a kind man underneath his cruelty."
      },
      {
        "id": "C",
        "text": "The narrator's family lived quite comfortably and securely despite Covey's harsh methods."
      },
      {
        "id": "D",
        "text": "Ships sailing on the Chesapeake Bay were dangerous to the sailors aboard them."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1-passage-3",
    "explanation": "This detail explicitly states that the ships 'terrify and torment' the narrator, unlike the other choices, which are largely neutral, descriptive details about the ships and the setting.",
    "points": 1,
    "prompt": "What detail from the second paragraph best supports the idea that the sight of the ships caused the narrator pain rather than simple admiration?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "“whose broad bosom was ever white with sails from every quarter of the habitable globe”"
      },
      {
        "id": "B",
        "text": "“were to me so many shrouded ghosts, to torment me with thoughts of my condition”"
      },
      {
        "id": "C",
        "text": "“I have often, in the deep stillness of a summer’s Sabbath, stood all alone”"
      },
      {
        "id": "D",
        "text": "“the countless number of sails moving off to the mighty ocean”"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1-passage-4",
    "explanation": "He explains that he 'would pour out my soul's complaint, in my rude way,' with 'no audience but the Almighty' — the ships become a safe, private target for an outpouring of feeling he could never voice aloud to another person.",
    "points": 1,
    "prompt": "Douglass most likely addresses the ships directly, in the form of an apostrophe, in order to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "request that a specific ship's captain secretly help him escape northward."
      },
      {
        "id": "B",
        "text": "give voice, privately, to feelings of longing he could not otherwise express."
      },
      {
        "id": "C",
        "text": "criticize the ship captains directly for ignoring enslaved people on the shore."
      },
      {
        "id": "D",
        "text": "describe, in technical detail, how ships of the period were built and sailed."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1-passage-5",
    "explanation": "He names a specific route — turning his canoe adrift at the head of the bay and walking 'straight through Delaware into Pennsylvania' — showing this was more than vague longing; he had thought through an actual path.",
    "points": 1,
    "prompt": "What can be reasonably inferred about the narrator's plans, based on the details in the quoted soliloquy?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "He intended to ask Covey directly for permission to travel north."
      },
      {
        "id": "B",
        "text": "He believed escape was impossible and had given up all hope of it."
      },
      {
        "id": "C",
        "text": "He planned to escape by secretly boarding one of the ships he watched."
      },
      {
        "id": "D",
        "text": "He had already planned a route through Delaware and Pennsylvania."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1-passage-6",
    "explanation": "After the intense, first-person outburst, the final paragraph pulls back to a calmer, habitual description — 'goaded almost to madness at one moment, and at the next reconciling myself' — returning from one dramatized moment to a repeated pattern of feeling.",
    "points": 1,
    "prompt": "How does the passage's final paragraph function in relation to the soliloquy quoted just before it?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "It reveals that the soliloquy had actually been spoken aloud to another person nearby."
      },
      {
        "id": "B",
        "text": "It directly contradicts the hope expressed at the end of the soliloquy."
      },
      {
        "id": "C",
        "text": "It steps back to describe his ordinary state of mind."
      },
      {
        "id": "D",
        "text": "It introduces an entirely new setting far from the Chesapeake Bay."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from \"Narrative of the Life of Frederick Douglass\"",
    author: "Frederick Douglass",
    blurb: "Frederick Douglass (1818-1895) escaped slavery in Maryland and became a leading writer and orator in the movement to abolish it. The following two excerpts are adapted from his 1845 autobiography. In the first, he describes the constant, watchful cunning of an overseer named Mr. Covey; in the second, written about the same period, he describes standing at the edge of the Chesapeake Bay and watching the ships sail free while he could not.",
    passageType: "informational",
    passageCategory: "prestige",
    text: excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1PassageText,
    versionLabel: "Digital SHSAT Practice Test 1",
  }),
  questions: excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1Questions,
};
