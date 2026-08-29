import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheCallOfTheWildPassageText = "Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and with warm, long hair, from Puget Sound to San Diego. Because men, groping in the Arctic darkness, had found a yellow metal, and because steamship and transportation companies were booming the find, thousands of men were rushing into the Northland. These men wanted dogs, and the dogs they wanted were heavy dogs, with strong muscles by which to toil, and furry coats to protect them from the frost.\n\nBuck lived at a big house in the sun-kissed Santa Clara Valley. Judge Miller’s place, it was called. It stood back from the road, half hidden among the trees, through which glimpses could be caught of the wide cool veranda that ran around its four sides. The house was approached by gravelled driveways which wound about through wide-spreading lawns and under the interlacing boughs of tall poplars. At the rear things were on even a more spacious scale than at the front. There were great stables, where a dozen grooms and boys held forth, rows of vine-clad servants’ cottages, an endless and orderly array of outhouses, long grape arbors, green pastures, orchards, and berry patches. Then there was the pumping plant for the artesian well, and the big cement tank where Judge Miller’s boys took their morning plunge and kept cool in the hot afternoon.\n\nAnd over this great demesne Buck ruled. Here he was born, and here he had lived the four years of his life. It was true, there were other dogs. There could not but be other dogs on so vast a place, but they did not count. They came and went, resided in the populous kennels, or lived obscurely in the recesses of the house after the fashion of Toots, the Japanese pug, or Ysabel, the Mexican hairless,—strange creatures that rarely put nose out of doors or set foot to ground. On the other hand, there were the fox terriers, a score of them at least, who yelped fearful promises at Toots and Ysabel looking out of the windows at them and protected by a legion of housemaids armed with brooms and mops.\n\nBut Buck was neither house-dog nor kennel-dog. The whole realm was his. He plunged into the swimming tank or went hunting with the Judge’s sons; he escorted Mollie and Alice, the Judge’s daughters, on long twilight or early morning rambles; on wintry nights he lay at the Judge’s feet before the roaring library fire; he carried the Judge’s grandsons on his back, or rolled them in the grass, and guarded their footsteps through wild adventures down to the fountain in the stable yard, and even beyond, where the paddocks were, and the berry patches. Among the terriers he stalked imperiously, and Toots and Ysabel he utterly ignored, for he was king,—king over all creeping, crawling, flying things of Judge Miller’s place, humans included.\n\nHis father, Elmo, a huge St. Bernard, had been the Judge’s inseparable companion, and Buck bid fair to follow in the way of his father. He was not so large,—he weighed only one hundred and forty pounds,—for his mother, Shep, had been a Scotch shepherd dog. Nevertheless, one hundred and forty pounds, to which was added the dignity that comes of good living and universal respect, enabled him to carry himself in right royal fashion. During the four years since his puppyhood he had lived the life of a sated aristocrat; he had a fine pride in himself, was even a trifle egotistical, as country gentlemen sometimes become because of their insular situation. But he had saved himself by not becoming a mere pampered house-dog. Hunting and kindred outdoor delights had kept down the fat and hardened his muscles; and to him, as to the cold-tubbing races, the love of water had been a tonic and a health preserver.\n\nAnd this was the manner of dog Buck was in the fall of 1897, when the Klondike strike dragged men from all the world into the frozen North. But Buck did not read the newspapers, and he did not know that Manuel, one of the gardener’s helpers, was an undesirable acquaintance. Manuel had one besetting sin. He loved to play Chinese lottery. Also, in his gambling, he had one besetting weakness—faith in a system; and this made his damnation certain. For to play a system requires money, while the wages of a gardener’s helper do not lap over the needs of a wife and numerous progeny.\n\nThe Judge was at a meeting of the Raisin Growers’ Association, and the boys were busy organizing an athletic club, on the memorable night of Manuel’s treachery. No one saw him and Buck go off through the orchard on what Buck imagined was merely a stroll. And with the exception of a solitary man, no one saw them arrive at the little flag station known as College Park. This man talked with Manuel, and money chinked between them.";

const excerptFromTheCallOfTheWildQuestions: ExamQuestion[] = [
  {
    "id": "passage-1",
    "points": 1,
    "prompt": "The author's decision to reveal, in the very first lines, that 'trouble was brewing' for tide-water dogs like Buck, before ever describing Buck's comfortable life at Judge Miller's estate, most strongly serves to",
    "promptHtml": "The author's decision to reveal, in the very first lines, that 'trouble was brewing' for tide-water dogs like Buck, before ever describing Buck's comfortable life at Judge Miller's estate,&nbsp;<strong>most strongly</strong>&nbsp;serves to",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "explain why Judge Miller decided to sell Buck before the story begins.",
        "text": "explain why Judge Miller decided to sell Buck before the story begins."
      },
      {
        "id": "B",
        "html": "create dramatic irony, letting the reader anticipate danger Buck does not yet suspect.",
        "text": "create dramatic irony, letting the reader anticipate danger Buck does not yet suspect."
      },
      {
        "id": "C",
        "html": "suggest that Buck's owners were secretly involved in the Klondike gold rush.",
        "text": "suggest that Buck's owners were secretly involved in the Klondike gold rush."
      },
      {
        "id": "D",
        "html": "establish that the narrator disapproves of how Buck is treated by the household.",
        "text": "establish that the narrator disapproves of how Buck is treated by the household."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-2",
    "points": 1,
    "prompt": "The passage opens with a paragraph warning that trouble is coming for dogs like Buck, and only afterward moves into a long paragraph describing Judge Miller's estate in loving detail. Which choice most accurately describes how these two paragraphs, taken together across nearly a full page, function within the passage as a whole?",
    "promptHtml": "The passage opens with a paragraph warning that trouble is coming for dogs like Buck, and only afterward moves into a long paragraph describing Judge Miller's estate in loving detail. Which choice&nbsp;<strong>most accurately</strong>&nbsp;describes how these two paragraphs, taken together across nearly a full page, function within the passage as a whole?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "The first paragraph provides evidence that directly contradicts the description that follows it.",
        "text": "The first paragraph provides evidence that directly contradicts the description that follows it."
      },
      {
        "id": "B",
        "html": "The first paragraph and the estate description both take place after Buck has already left California.",
        "text": "The first paragraph and the estate description both take place after Buck has already left California."
      },
      {
        "id": "C",
        "html": "The first paragraph's warning makes the estate's comfort feel temporary rather than secure.",
        "text": "The first paragraph's warning makes the estate's comfort feel temporary rather than secure."
      },
      {
        "id": "D",
        "html": "The second paragraph resolves a conflict that was already fully explained in the first paragraph.",
        "text": "The second paragraph resolves a conflict that was already fully explained in the first paragraph."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-3",
    "points": 1,
    "prompt": "In the description of Buck living 'the life of a sated aristocrat' with 'a fine pride in himself' and being 'even a trifle egotistical,' the word choice most strongly conveys",
    "promptHtml": "In the description of Buck living 'the life of a sated aristocrat' with 'a fine pride in himself' and being 'even a trifle egotistical,' the word choice&nbsp;<strong>most strongly</strong>&nbsp;conveys",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "html": "sincere admiration for Buck's noble bloodline and inherited good breeding",
        "text": "sincere admiration for Buck's noble bloodline and inherited good breeding"
      },
      {
        "id": "B",
        "html": "gentle mockery of Buck's pampered self-importance, likened to a vain country gentleman",
        "text": "gentle mockery of Buck's pampered self-importance, likened to a vain country gentleman"
      },
      {
        "id": "C",
        "html": "concern that Buck is being seriously mistreated or neglected by the Miller family",
        "text": "concern that Buck is being seriously mistreated or neglected by the Miller family"
      },
      {
        "id": "D",
        "html": "flat, unemotional reporting of Buck's daily habits and physical appearance",
        "text": "flat, unemotional reporting of Buck's daily habits and physical appearance"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-4",
    "points": 1,
    "prompt": "Describing Buck as ruling as 'king,—king over all creeping, crawling, flying things of Judge Miller's place, humans included' is best understood as an example of",
    "promptHtml": "Describing Buck as ruling as 'king,—king over all creeping, crawling, flying things of Judge Miller's place, humans included' is&nbsp;<strong>best</strong>&nbsp;understood as an example of",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "html": "a metaphor showing how completely Buck believes he commands the whole estate.",
        "text": "a metaphor showing how completely Buck believes he commands the whole estate."
      },
      {
        "id": "B",
        "html": "a simile directly comparing Buck to an actual, crowned ruling monarch.",
        "text": "a simile directly comparing Buck to an actual, crowned ruling monarch."
      },
      {
        "id": "C",
        "html": "personification of the estate grounds themselves as a living kingdom.",
        "text": "personification of the estate grounds themselves as a living kingdom."
      },
      {
        "id": "D",
        "html": "an idiom describing a common, everyday farm chore or task.",
        "text": "an idiom describing a common, everyday farm chore or task."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-5",
    "points": 1,
    "prompt": "Which best states a theme suggested by the passage as a whole?",
    "promptHtml": "Which&nbsp;<strong>best</strong>&nbsp;states a theme suggested by the passage as a whole?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Wealth and comfort make a life, or a creature, immune from misfortune.",
        "text": "Wealth and comfort make a life, or a creature, immune from misfortune."
      },
      {
        "id": "B",
        "html": "Household pets are always fully aware of major world events.",
        "text": "Household pets are always fully aware of major world events."
      },
      {
        "id": "C",
        "html": "Gardeners are generally far more trustworthy than wealthy landowners.",
        "text": "Gardeners are generally far more trustworthy than wealthy landowners."
      },
      {
        "id": "D",
        "html": "A creature accustomed to importance may not recognize danger even once announced.",
        "text": "A creature accustomed to importance may not recognize danger even once announced."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-6",
    "points": 1,
    "prompt": "Based on the description of Manuel in the passage, which inference about why he might be willing to become involved in a secret arrangement is most strongly supported by the text?",
    "promptHtml": "Based on the description of Manuel in the passage, which inference about why he might be willing to become involved in a secret arrangement is&nbsp;<strong>most strongly</strong>&nbsp;supported by the text?",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "Manuel dislikes Buck and wants to see him removed from the estate.",
        "text": "Manuel dislikes Buck and wants to see him removed from the estate."
      },
      {
        "id": "B",
        "html": "Manuel's gambling debts and low wages leave him vulnerable to bribery.",
        "text": "Manuel's gambling debts and low wages leave him vulnerable to bribery."
      },
      {
        "id": "C",
        "html": "Manuel believes Buck would be genuinely happier living somewhere else entirely.",
        "text": "Manuel believes Buck would be genuinely happier living somewhere else entirely."
      },
      {
        "id": "D",
        "html": "Manuel is simply acting on direct orders given by Judge Miller.",
        "text": "Manuel is simply acting on direct orders given by Judge Miller."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-7",
    "points": 1,
    "prompt": "What detail from the passage best supports the idea that Buck has no idea anything is about to change in his life?",
    "promptHtml": "What detail from the passage&nbsp;<strong>best</strong>&nbsp;supports the idea that Buck has no idea anything is about to change in his life?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“Buck did not read the newspapers, or he would have known that trouble was brewing”",
        "text": "“Buck did not read the newspapers, or he would have known that trouble was brewing”"
      },
      {
        "id": "B",
        "html": "“he had a fine pride in himself, was even a trifle egotistical, as gentlemen become”",
        "text": "“he had a fine pride in himself, was even a trifle egotistical, as gentlemen become”"
      },
      {
        "id": "C",
        "html": "“Manuel had one besetting sin. He loved to play at Chinese lottery.”",
        "text": "“Manuel had one besetting sin. He loved to play at Chinese lottery.”"
      },
      {
        "id": "D",
        "html": "“the Judge himself was at a meeting of the Raisin Growers’ Association”",
        "text": "“the Judge himself was at a meeting of the Raisin Growers’ Association”"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-8",
    "points": 1,
    "prompt": "The contrast between furniture's repair rate and clothing's repair rate most directly supports which idea developed in the passage?",
    "promptHtml": "The contrast between furniture's repair rate and clothing's repair rate&nbsp;<strong>most directly</strong>&nbsp;supports which idea developed in the passage?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "Some categories of household objects are inherently easier to fix than others.",
        "text": "Some categories of household objects are inherently easier to fix than others."
      },
      {
        "id": "B",
        "html": "Fitch believes clothing repairs are more valuable to the community than furniture repairs.",
        "text": "Fitch believes clothing repairs are more valuable to the community than furniture repairs."
      },
      {
        "id": "C",
        "html": "The library plans to stop accepting furniture donations at future sessions entirely.",
        "text": "The library plans to stop accepting furniture donations at future sessions entirely."
      },
      {
        "id": "D",
        "html": "Volunteers are generally better trained in sewing repairs than in woodworking repairs.",
        "text": "Volunteers are generally better trained in sewing repairs than in woodworking repairs."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-9",
    "points": 1,
    "prompt": "Sort each statement from the passage into the category that best describes it.",
    "promptHtml": "Sort each statement from the passage into the category that&nbsp;<strong>best</strong>&nbsp;describes it.",
    "topic": "Figurative Language & Imagery",
    "categories": [
      {
        "id": "category-1",
        "title": "Literal Statement"
      },
      {
        "id": "category-2",
        "title": "Figurative Language"
      }
    ],
    "correctPlacements": {
      "item-1": "category-1",
      "item-2": "category-1",
      "item-3": "category-2",
      "item-4": "category-2"
    },
    "instructions": "Move each answer to the correct box.",
    "items": [
      {
        "html": "<strong>Fitch grew tired of watching repairable appliances end up at the curb.</strong>",
        "id": "item-1",
        "text": "Fitch grew tired of watching repairable appliances end up at the curb."
      },
      {
        "html": "<strong>Volunteers examined 134 items in five broad categories.</strong>",
        "id": "item-2",
        "text": "Volunteers examined 134 items in five broad categories."
      },
      {
        "html": "<strong>By the end of that afternoon, word began to spread.</strong>",
        "id": "item-3",
        "text": "By the end of that afternoon, word began to spread."
      },
      {
        "html": "<strong>A repair that doesn't hold is really just a delay.</strong>",
        "id": "item-4",
        "text": "A repair that doesn't hold is really just a delay."
      }
    ],
    "requiredPlacements": 4,
    "type": "category_sort"
  },
  {
    "id": "excerpt-from-the-call-of-the-wild-10",
    "points": 1,
    "prompt": "The sentence 'Furniture told a different story,' which opens the paragraph about the twelve chairs, stools, and small tables the fixers examined, most directly serves to signal a shift from the passage's earlier examples toward information that complicates its optimistic pattern of high repair rates.",
    "promptHtml": "The sentence 'Furniture told a different story,' which opens the paragraph about the twelve chairs, stools, and small tables the fixers examined,&nbsp;<strong>most directly</strong>&nbsp;serves to signal a shift from the passage's earlier examples toward information that complicates its optimistic pattern of high repair rates.",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "to announce that the library will stop accepting all furniture donations soon",
        "text": "to announce that the library will stop accepting all furniture donations soon"
      },
      {
        "id": "B",
        "html": "to contradict Fitch's claim that a failed repair is not wasted effort",
        "text": "to contradict Fitch's claim that a failed repair is not wasted effort"
      },
      {
        "id": "C",
        "html": "to introduce a category fixers cannot always repair",
        "text": "to introduce a category fixers cannot always repair"
      },
      {
        "id": "D",
        "html": "to shift the passage's entire focus permanently away from the volunteer program",
        "text": "to shift the passage's entire focus permanently away from the volunteer program"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromTheCallOfTheWildPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-call-of-the-wild",
  questionCount: excerptFromTheCallOfTheWildQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "excerpt-from-the-call-of-the-wild",
    title: "Excerpt from \"The Call of the Wild\"",
    author: "Jack London",
    blurb: "Jack London (1876-1916) was an American novelist. The following is adapted from the opening of Chapter 1, \"Into the Primitive,\" of his 1903 novel The Call of the Wild, in which a large dog named Buck lives a comfortable life on a California estate before being sold away during the 1897 Klondike gold rush.",
    coverImage: {"alt":"Excerpt from \"The Call of the Wild\" book cover","src":"/exam-images/excerpt-from-the-call-of-the-wild-cover.jpg"},
    passageType: "literary",
    richText: "<p>\n\nBuck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and with warm, long hair, from Puget Sound to San Diego. Because men, groping in the Arctic darkness, had found a yellow metal, and because steamship and transportation companies were booming the find, thousands of men were rushing into the Northland. These men wanted dogs, and the dogs they wanted were heavy dogs, with strong muscles by which to toil, and furry coats to protect them from the frost.</p><p>Buck lived at a big house in the sun-kissed Santa Clara Valley. Judge Miller’s place, it was called. It stood back from the road, half hidden among the trees, through which glimpses could be caught of the wide cool veranda that ran around its four sides. The house was approached by gravelled driveways which wound about through wide-spreading lawns and under the interlacing boughs of tall poplars. At the rear things were on even a more spacious scale than at the front. There were great stables, where a dozen grooms and boys held forth, rows of vine-clad servants’ cottages, an endless and orderly array of outhouses, long grape arbors, green pastures, orchards, and berry patches. Then there was the pumping plant for the artesian well, and the big cement tank where Judge Miller’s boys took their morning plunge and kept cool in the hot afternoon.</p><p>And over this great demesne Buck ruled. Here he was born, and here he had lived the four years of his life. It was true, there were other dogs. There could not but be other dogs on so vast a place, but they did not count. They came and went, resided in the populous kennels, or lived obscurely in the recesses of the house after the fashion of Toots, the Japanese pug, or Ysabel, the Mexican hairless,—strange creatures that rarely put nose out of doors or set foot to ground. On the other hand, there were the fox terriers, a score of them at least, who yelped fearful promises at Toots and Ysabel looking out of the windows at them and protected by a legion of housemaids armed with brooms and mops.</p><p>But Buck was neither house-dog nor kennel-dog. The whole realm was his. He plunged into the swimming tank or went hunting with the Judge’s sons; he escorted Mollie and Alice, the Judge’s daughters, on long twilight or early morning rambles; on wintry nights he lay at the Judge’s feet before the roaring library fire; he carried the Judge’s grandsons on his back, or rolled them in the grass, and guarded their footsteps through wild adventures down to the fountain in the stable yard, and even beyond, where the paddocks were, and the berry patches. Among the terriers he stalked imperiously, and Toots and Ysabel he utterly ignored, for he was king,—king over all creeping, crawling, flying things of Judge Miller’s place, humans included.</p><p>His father, Elmo, a huge St. Bernard, had been the Judge’s inseparable companion, and Buck bid fair to follow in the way of his father. He was not so large,—he weighed only one hundred and forty pounds,—for his mother, Shep, had been a Scotch shepherd dog. Nevertheless, one hundred and forty pounds, to which was added the dignity that comes of good living and universal respect, enabled him to carry himself in right royal fashion. During the four years since his puppyhood he had lived the life of a sated aristocrat; he had a fine pride in himself, was even a trifle egotistical, as country gentlemen sometimes become because of their insular situation. But he had saved himself by not becoming a mere pampered house-dog. Hunting and kindred outdoor delights had kept down the fat and hardened his muscles; and to him, as to the cold-tubbing races, the love of water had been a tonic and a health preserver.</p><p>And this was the manner of dog Buck was in the fall of 1897, when the Klondike strike dragged men from all the world into the frozen North. But Buck did not read the newspapers, and he did not know that Manuel, one of the gardener’s helpers, was an undesirable acquaintance. Manuel had one&nbsp;besetting&nbsp;sin. He loved to play Chinese lottery. Also, in his gambling, he had one besetting weakness—faith in a system; and this made his damnation certain. For to play a system requires money, while the wages of a gardener’s helper do not lap over the needs of a wife and numerous progeny.</p><p>The Judge was at a meeting of the Raisin Growers’ Association, and the boys were busy organizing an athletic club, on the memorable night of Manuel’s treachery. No one saw him and Buck go off through the orchard on what Buck imagined was merely a stroll. And with the exception of a solitary man, no one saw them arrive at the little flag station known as College Park. This man talked with Manuel, and money chinked between them.\n\n</p>",
    text: excerptFromTheCallOfTheWildPassageText,
  }),
  questions: excerptFromTheCallOfTheWildQuestions,
};
