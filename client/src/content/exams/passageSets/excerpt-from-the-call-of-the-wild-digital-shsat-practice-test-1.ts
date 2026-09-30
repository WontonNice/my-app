import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheCallOfTheWildDigitalShsatPracticeTest1PassageText = "Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and with warm, long hair, from Puget Sound to San Diego. Because men, groping in the Arctic darkness, had found a yellow metal, and because steamship and transportation companies were booming the find, thousands of men were rushing into the Northland. These men wanted dogs, and the dogs they wanted were heavy dogs, with strong muscles by which to toil, and furry coats to protect them from the frost.\n\nBuck lived at a big house in the sun-kissed Santa Clara Valley. Judge Miller’s place, it was called. It stood back from the road, half hidden among the trees, through which glimpses could be caught of the wide cool veranda that ran around its four sides. The house was approached by gravelled driveways which wound about through wide-spreading lawns and under the interlacing boughs of tall poplars. At the rear things were on even a more spacious scale than at the front. There were great stables, where a dozen grooms and boys held forth, rows of vine-clad servants’ cottages, an endless and orderly array of outhouses, long grape arbors, green pastures, orchards, and berry patches. Then there was the pumping plant for the artesian well, and the big cement tank where Judge Miller’s boys took their morning plunge and kept cool in the hot afternoon.\n\nAnd over this great demesne Buck ruled. Here he was born, and here he had lived the four years of his life. It was true, there were other dogs. There could not but be other dogs on so vast a place, but they did not count. They came and went, resided in the populous kennels, or lived obscurely in the recesses of the house after the fashion of Toots, the Japanese pug, or Ysabel, the Mexican hairless,—strange creatures that rarely put nose out of doors or set foot to ground. On the other hand, there were the fox terriers, a score of them at least, who yelped fearful promises at Toots and Ysabel looking out of the windows at them and protected by a legion of housemaids armed with brooms and mops.\n\nBut Buck was neither house-dog nor kennel-dog. The whole realm was his. He plunged into the swimming tank or went hunting with the Judge’s sons; he escorted Mollie and Alice, the Judge’s daughters, on long twilight or early morning rambles; on wintry nights he lay at the Judge’s feet before the roaring library fire; he carried the Judge’s grandsons on his back, or rolled them in the grass, and guarded their footsteps through wild adventures down to the fountain in the stable yard, and even beyond, where the paddocks were, and the berry patches. Among the terriers he stalked imperiously, and Toots and Ysabel he utterly ignored, for he was king,—king over all creeping, crawling, flying things of Judge Miller’s place, humans included.\n\nHis father, Elmo, a huge St. Bernard, had been the Judge’s inseparable companion, and Buck bid fair to follow in the way of his father. He was not so large,—he weighed only one hundred and forty pounds,—for his mother, Shep, had been a Scotch shepherd dog. Nevertheless, one hundred and forty pounds, to which was added the dignity that comes of good living and universal respect, enabled him to carry himself in right royal fashion. During the four years since his puppyhood he had lived the life of a sated aristocrat; he had a fine pride in himself, was even a trifle egotistical, as country gentlemen sometimes become because of their insular situation. But he had saved himself by not becoming a mere pampered house-dog. Hunting and kindred outdoor delights had kept down the fat and hardened his muscles; and to him, as to the cold-tubbing races, the love of water had been a tonic and a health preserver.\n\nAnd this was the manner of dog Buck was in the fall of 1897, when the Klondike strike dragged men from all the world into the frozen North. But Buck did not read the newspapers, and he did not know that Manuel, one of the gardener’s helpers, was an undesirable acquaintance. Manuel had one besetting sin. He loved to play Chinese lottery. Also, in his gambling, he had one besetting weakness—faith in a system; and this made his damnation certain. For to play a system requires money, while the wages of a gardener’s helper do not lap over the needs of a wife and numerous progeny.\n\nThe Judge was at a meeting of the Raisin Growers’ Association, and the boys were busy organizing an athletic club, on the memorable night of Manuel’s treachery. No one saw him and Buck go off through the orchard on what Buck imagined was merely a stroll. And with the exception of a solitary man, no one saw them arrive at the little flag station known as College Park. This man talked with Manuel, and money chinked between them.";

const excerptFromTheCallOfTheWildDigitalShsatPracticeTest1Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1-1",
    "explanation": "The opening lines describe the Klondike gold rush and the coming demand for dogs before Buck's comfortable life is even introduced. Because Buck 'did not read the newspapers' and has no idea what is coming, the reader now knows more than Buck does — the definition of dramatic irony.",
    "points": 1,
    "prompt": "The author's decision to reveal, in the very first lines, that 'trouble was brewing' for tide-water dogs like Buck, before ever describing Buck's comfortable life at Judge Miller's estate, most strongly serves to",
    "promptHtml": "The author's decision to reveal, in the very first lines, that 'trouble was brewing' for tide-water dogs like Buck, before ever describing Buck's comfortable life at Judge Miller's estate, <strong>most strongly</strong> serves to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "explain why Judge Miller decided to sell Buck before the story begins."
      },
      {
        "id": "B",
        "text": "create dramatic irony, letting the reader anticipate danger Buck does not yet suspect."
      },
      {
        "id": "C",
        "text": "suggest that Buck's owners were secretly involved in the Klondike gold rush."
      },
      {
        "id": "D",
        "text": "establish that the narrator disapproves of how Buck is treated by the household."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1-2",
    "explanation": "Because readers already know from paragraph one that 'trouble was brewing,' the leisurely description of Judge Miller's estate that follows takes on added meaning: it describes exactly the comfortable life about to be disrupted, though Buck himself doesn't yet know it.",
    "points": 1,
    "prompt": "The passage opens with a paragraph warning that trouble is coming for dogs like Buck, and only afterward moves into a long paragraph describing Judge Miller's estate in loving detail. Which choice most accurately describes how these two paragraphs, taken together across nearly a full page, function within the passage as a whole?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "The first paragraph provides evidence that directly contradicts the description that follows it."
      },
      {
        "id": "B",
        "text": "The first paragraph and the estate description both take place after Buck has already left California."
      },
      {
        "id": "C",
        "text": "The first paragraph's warning makes the estate's comfort feel temporary rather than secure."
      },
      {
        "id": "D",
        "text": "The second paragraph resolves a conflict that was already fully explained in the first paragraph."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1-3",
    "explanation": "Words like 'sated,' 'egotistical,' and the direct comparison to 'country gentlemen' who grow vain 'because of their insular situation' create an affectionately mocking tone about Buck's overblown self-regard — not neutral reporting or real admiration.",
    "points": 1,
    "prompt": "In the description of Buck living 'the life of a sated aristocrat' with 'a fine pride in himself' and being 'even a trifle egotistical,' the word choice most strongly conveys",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "sincere admiration for Buck's noble bloodline and inherited good breeding"
      },
      {
        "id": "B",
        "text": "gentle mockery of Buck's pampered self-importance, likened to a vain country gentleman"
      },
      {
        "id": "C",
        "text": "concern that Buck is being seriously mistreated or neglected by the Miller family"
      },
      {
        "id": "D",
        "text": "flat, unemotional reporting of Buck's daily habits and physical appearance"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1-4",
    "explanation": "Calling Buck 'king' (not 'like a king') is a metaphor, not a simile, that captures how totally Buck believes he rules over animals and people alike on the estate.",
    "points": 1,
    "prompt": "Describing Buck as ruling as 'king,—king over all creeping, crawling, flying things of Judge Miller's place, humans included' is best understood as an example of",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "a metaphor showing how completely Buck believes he commands the whole estate."
      },
      {
        "id": "B",
        "text": "a simile directly comparing Buck to an actual, crowned ruling monarch."
      },
      {
        "id": "C",
        "text": "personification of the estate grounds themselves as a living kingdom."
      },
      {
        "id": "D",
        "text": "an idiom describing a common, everyday farm chore or task."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1-5",
    "explanation": "The narrator explicitly notes that Buck 'did not read the newspapers' and has no idea 'trouble was brewing,' despite his privileged status — suggesting that comfort and status can blind a creature to approaching danger rather than protect it from it.",
    "points": 1,
    "prompt": "Which best states a theme suggested by the passage as a whole?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "Wealth and comfort make a life, or a creature, immune from misfortune."
      },
      {
        "id": "B",
        "text": "Household pets are always fully aware of major world events."
      },
      {
        "id": "C",
        "text": "Gardeners are generally far more trustworthy than wealthy landowners."
      },
      {
        "id": "D",
        "text": "A creature accustomed to importance may not recognize danger even once announced."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1-6",
    "explanation": "The passage notes Manuel's 'one besetting sin,' his gambling and 'faith in a system,' and that 'the wages of a gardener's helper do not lap over the needs of a wife and numerous progeny' — details that together suggest financial desperation is his motive, not dislike of Buck or orders from the Judge.",
    "points": 1,
    "prompt": "Based on the description of Manuel in the passage, which inference about why he might be willing to become involved in a secret arrangement is most strongly supported by the text?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "Manuel dislikes Buck and wants to see him removed from the estate."
      },
      {
        "id": "B",
        "text": "Manuel's gambling debts and low wages leave him vulnerable to bribery."
      },
      {
        "id": "C",
        "text": "Manuel believes Buck would be genuinely happier living somewhere else entirely."
      },
      {
        "id": "D",
        "text": "Manuel is simply acting on direct orders given by Judge Miller."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1-7",
    "explanation": "This detail directly states that Buck's ignorance of the newspapers is exactly why he doesn't know 'trouble was brewing,' making it the clearest textual evidence that he has no sense of the change coming.",
    "points": 1,
    "prompt": "What detail from the passage best supports the idea that Buck has no idea anything is about to change in his life?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "“Buck did not read the newspapers, or he would have known that trouble was brewing”"
      },
      {
        "id": "B",
        "text": "“he had a fine pride in himself, was even a trifle egotistical, as gentlemen become”"
      },
      {
        "id": "C",
        "text": "“Manuel had one besetting sin. He loved to play at Chinese lottery.”"
      },
      {
        "id": "D",
        "text": "“the Judge himself was at a meeting of the Raisin Growers’ Association”"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromTheCallOfTheWildDigitalShsatPracticeTest1PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromTheCallOfTheWildDigitalShsatPracticeTest1Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createProsePassage({
    id: "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1",
    title: "Excerpt from \"The Call of the Wild\"",
    author: "Jack London",
    blurb: "Jack London (1876-1916) was an American novelist. The following is adapted from the opening of Chapter 1, \"Into the Primitive,\" of his 1903 novel The Call of the Wild, in which a large dog named Buck lives a comfortable life on a California estate before being sold away during the 1897 Klondike gold rush.",
    passageType: "literary",
    teacherSource: "Digital SHSAT Practice Test 1; English Language Arts; original questions 1, 2, 3, 4, 5, 6, 7; passage shsatEnglish1-P1v2; https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%201%20v2",
    text: excerptFromTheCallOfTheWildDigitalShsatPracticeTest1PassageText,
    versionLabel: "Digital SHSAT Practice Test 1",
  }),
  questions: excerptFromTheCallOfTheWildDigitalShsatPracticeTest1Questions,
};
