import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromATrampAbroad20182019FormAPassageText = "Now and then, while we rested, we watched the laborious ant at his work. I found nothing new in him—certainly nothing to change my opinion of him. It seems to me that in the matter of intellect the ant must be a strangely overrated bird. During many summers now I have watched him, when I ought to have been in better business, and I have not yet come across a living ant that seemed to have any more sense than a dead one. I refer to the ordinary ant, of course; I have had no experience of those wonderful Swiss and African ones which vote, keep drilled armies, . . . and dispute about religion. Those particular ants may be all that the naturalist paints them, but I am persuaded that the average ant is a sham.\n\nI admit his industry, of course; he is the hardest working creature in the world—when anybody is looking—but his leather-headedness is the point I make against him. He goes out foraging, he makes capture, and then what does he do? Go home? No; he goes anywhere but home. He doesn’t know where home is. His home may be only three feet away; no matter, he can’t find it. He makes his capture, as I have said; it is generally something which can be of no sort of use to himself or anybody else; it is usually seven times bigger than it ought to be; he hunts out the awkwardest place to take hold of it; h lifts it bodily up in the air by main force, and starts—not toward home, but in the opposite direction; not calmly and wisely, but with a frantic haste which is wasteful of his strength; he fetches up against a pebble, and, instead of going around it, he climbs over it backwards, dragging his booty after him, tumbles down on the other side, jumps up in a passion, kicks the dust off his clothes, moistens his hands, grabs his property viciously, yanks it this way, then that, shoves it ahead of him a moment, turns tail and lugs it after him another moment, gets madder and madder, then presently hoists it int the air and goes tearing away in an entirely new direction; comes to a weed; it never occurs to him to go around it. No; he must climb it, and he does climb it, dragging his worthless property to the top— which is as bright a thing to do as it would be for me to carry a sack of flour from Heidelberg to Paris by way of Strasburg steeple; when he gets up there he finds that that is not the place; takes a cursory glance at the scenery, and either climbs down again or tumbles down, and starts off once more—as usual, in a new direction. At the end of half an hour he fetches up within six inches of the place he started from, and lays his burden down. Meantime, he has been over all the ground for two yards around, and climbed all the weeds and pebbles he came across. Now he wipes the sweat from his brow, strokes his limbs, and then marches aimlessly off, in as violent a hurry as ever. He traverses a good deal of zig-zag country, and by and by stumbles on his same booty again. He does not remember to have ever seen it before; he looks around to see which is not the way home, grabs his bundle, and starts. He goes through the same adventures he had before; finally stops to rest, and a friend comes along.\n\nEvidently the friend remarks that a last year’s grasshopper leg is a very noble acquisition, and inquires where he got it. Evidently the proprietor does not remember exactly where he did get it, but thinks he got it “around here somewhere.” Evidently the friend contracts to help him freight it home. Then, with a judgment peculiarly antic (pun not intentional), they take hold of opposite ends of that grasshopper leg and begin to tug with all their might in opposite directions. Presently they take a rest and confer together. They decide that something is wrong, they can’t make out what. Then they go at i again, just as before. Same result. Mutual recriminations follow. Evidently each accuses the other of being an obstructionist. They warm up, and the dispute ends in a fight. They lock themselves together and chew each other’s jaws for a while; then they roll and tumble on the ground till one loses a horn or a leg and has to haul off for repairs. They make up and go to work again in the same old insane way, but the crippled ant is at a disadvantage; tug as he may, the other one drags off the booty and him at the end of it. Instead of giving up, he hangs on, and gets his shins bruised against every obstruction that comes in the way. By and by, when that grasshopper leg has been dragged all over the same old ground once more, it is finally dumped at about the spot where it originally lay. The two perspiring ants inspect it thoughtfully and decide that dried grasshopper legs are a poor sort of property after all, and then each starts off in a different direction to see if he can’t find an old nail or something else that is heavy enough to afford entertainment and at the same time valueless enough to make an ant want to own it. . . .\n\nScience has recently discovered that the ant does not lay up anything for winter use. . . . He does not work, except when people are looking, and only then when the observer has a green, naturalistic look, and seems to be taking notes. This amounts to deception, and will injure him for the Sunday schools. He has not judgment enough to know what is good to eat from what isn’t. This amounts to ignorance, and will impair the world’s respect for him. . . . He cannot stroll around a stump and find his way home again. This amounts to idiocy, and once the damaging fact is established, thoughtful people will cease to look up to him. It is strange beyond comprehension that so manifest a humbug as the ant has been able to fool so many nations and keep it up so many ages without being found out.";

const excerptFromATrampAbroad20182019FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q026",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "26",
      "pages": [
        18
      ]
    },
    "explanation": "26. (F) The question asks about the phrase, which highlights the behavior of ants from different parts of the world, and about what the inclusion of the phrase shows about the author. Option F is correct because the\n\nphrase is meant to communicate a caution that while the author believes most ants are foolish, his observations in the excerpt do not apply to all types of ants. Option E is incorrect because, in the excerpt, the author is comparing species of ants to one another and not to other living creatures. Option G is incorrect because the author never comments in the excerpt that challenging common or strongly held beliefs is, in general, difficult. Option H is incorrect because the author never expresses in the excerpt the idea that the conclusions drawn about the ants’ behavior are flawed; the reference to Swiss and African ants is meant to show that those ants are an exception.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q026-explanation-1.png\" alt=\"Supplied Form A explanation for question 26\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q026-explanation-2.png\" alt=\"Supplied Form A explanation for question 26\" width=\"351\"></p>",
    "points": 1,
    "prompt": "The phrase “those wonderful Swiss and African ones which vote, keep drilled armies, . . . and dispute about religion” in paragraph 1 shows that the author",
    "promptHtml": "<p>The phrase “those wonderful Swiss and African ones which vote, keep drilled armies, . . . and dispute about religion” in paragraph 1 shows that the author</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>believes that the behavior of the ants is reflected in other living creatures.</p>",
        "text": "believes that the behavior of the ants is reflected in other living creatures."
      },
      {
        "id": "B",
        "html": "<p>acknowledges that his observations of a few do not necessarily apply to all.</p>",
        "text": "acknowledges that his observations of a few do not necessarily apply to all."
      },
      {
        "id": "C",
        "html": "<p>knows that disproving a commonly held belief is challenging.</p>",
        "text": "knows that disproving a commonly held belief is challenging."
      },
      {
        "id": "D",
        "html": "<p>accepts that there are flaws in his interpretation of the behavior of the ants.</p>",
        "text": "accepts that there are flaws in his interpretation of the behavior of the ants."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q027",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "27",
      "pages": [
        18
      ]
    },
    "explanation": "27. (A) The question asks how the central idea that “the average ant is a sham” (paragraph 1) is expressed in the excerpt. The excerpt focuses on the author’s humorous explanation of the ineffective struggles of two ants to accomplish a task, and the excerpt concludes with the statement that ants are not as smart as people think: “the ant has been able to fool so many nations” (paragraph 4). This point is stated in Option A. Option B is incorrect because the reference to ants in other locations is a detail mentioned only in paragraph 1 and is not directly related to the central idea mentioned in the question. Option C is incorrect because, while the narrator does observe the ants, the observations made are highly opinionated and not characterized as especially insightful or perceptive. Option D refers to the detail in paragraph 2 that states that the objects ants seek out are “generally something which can be of no sort of use to himself or anybody else” (paragraph 2), but this is not the main way the author conveys the premise that ants are a sham or false, and therefore, Option D is incorrect.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q027-explanation-1.png\" alt=\"Supplied Form A explanation for question 27\" width=\"351\"></p>",
    "points": 1,
    "prompt": "The central idea that “the average ant is a sham” (paragraph 1) is conveyed mainly through the",
    "promptHtml": "<p>The central idea that “the average ant is a sham” (paragraph 1) is conveyed mainly through the</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>comical descriptions of the inability of the ants to accomplish the task at hand.</p>",
        "text": "comical descriptions of the inability of the ants to accomplish the task at hand."
      },
      {
        "id": "B",
        "html": "<p>comparison between ants from other countries and the ants being observed.</p>",
        "text": "comparison between ants from other countries and the ants being observed."
      },
      {
        "id": "C",
        "html": "<p>keen observations that the level of intelligence of ants is mostly overstated.</p>",
        "text": "keen observations that the level of intelligence of ants is mostly overstated."
      },
      {
        "id": "D",
        "html": "<p>conclusion that ants value objects that are of little practical use to them.</p>",
        "text": "conclusion that ants value objects that are of little practical use to them."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q028",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "28",
      "pages": [
        19
      ]
    },
    "explanation": "28. (H) The question asks for an explanation of how the words “grabs” “yanks,” and “tearing away” (paragraph 2) contribute to the meaning of the excerpt. Option H is correct because these words convey sudden movements as the ant becomes more upset in his efforts to transport the grasshopper leg. Option E is incorrect because the ant is never described in the excerpt as believing his work to be important. Option F is incorrect because the ant’s inability to make progress while transporting the grasshopper leg by himself demonstrates the ant’s inefficiency (paragraph 2: “At the end of half an hour he fetches up within six inches of the place he started from”). Option H is incorrect because the ant does not complete his tasks despite moving in a hurried and determined way (paragraph 2: “not calmly and wisely, but with a frantic haste which is wasteful of his strength”).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q028-explanation-1.png\" alt=\"Supplied Form A explanation for question 28\" width=\"351\"></p>",
    "points": 1,
    "prompt": "In paragraph 2, how do the words “grabs,” “yanks,” and “tearing away” contribute to the meaning of the excerpt?",
    "promptHtml": "<p>In paragraph 2, how do the words “grabs,” “yanks,” and “tearing away” contribute to the meaning of the excerpt?</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>They highlight the ant’s belief that his work is important.</p>",
        "text": "They highlight the ant’s belief that his work is important."
      },
      {
        "id": "B",
        "html": "<p>They illustrate that the ant is more efficient working on his own.</p>",
        "text": "They illustrate that the ant is more efficient working on his own."
      },
      {
        "id": "C",
        "html": "<p>They indicate the speed with which the ant completes his tasks.</p>",
        "text": "They indicate the speed with which the ant completes his tasks."
      },
      {
        "id": "D",
        "html": "<p>They emphasize the ant’s anxious efforts to be productive.</p>",
        "text": "They emphasize the ant’s anxious efforts to be productive."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q029",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "29",
      "pages": [
        19
      ]
    },
    "explanation": "29. (C) The question asks for an explanation of how the details in the sentence convey the central idea, which is that the ant makes poor choices because of his lack of intelligence and his inability to understand even the most basic problem or obstacle. Option C is correct because the author’s description of the ant climbing up and over the weed rather than simply going around the weed supports the central idea. Option A is incorrect because, although the ant does waste much of his strength, the idea conveyed in the sentences is more related to the ant’s inability to solve a problem in the simplest way (paragraph 2: “which is as bright a thing to do as it would be for me to carry a sack of flour from Heidelberg to Paris by way of Strasburg steeple”). Option B is incorrect because the idea that the ant is surprised by the amount of effort needed to carry the object is not a central idea of the excerpt; nor does the excerpt suggest that the ant is surprised by this in the first place. Option D is incorrect because the ant has already acquired the object, and the details in the sentence do not convey an idea about the ant’s unnecessary effort.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q029-explanation-1.png\" alt=\"Supplied Form A explanation for question 29\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Read this text from paragraph 2.\n\nHe . . . comes to a weed; it never occurs to him to go around it. No; he must climb it, and he does climb it, dragging his worthless property to the top—which is as bright a thing to do as it would be for me to carry a sack of flour from Heidelberg to Paris by way of Strasburg steeple;\n\nThese details convey the central idea in the excerpt by showing that the ant",
    "promptHtml": "<p>Read this text from paragraph 2.</p><p>He . . . comes to a weed; it never occurs to him to go around it. No; he must climb it, and he does climb it, dragging his worthless property to the top—which is as bright a thing to do as it would be for me to carry a sack of flour from Heidelberg to Paris by way of Strasburg steeple;</p><p>These details convey the central idea in the excerpt by showing that the ant</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>often wastes his strength when working on a task.</p>",
        "text": "often wastes his strength when working on a task."
      },
      {
        "id": "B",
        "html": "<p>is surprised by the effort he needs in order to move the object.</p>",
        "text": "is surprised by the effort he needs in order to move the object."
      },
      {
        "id": "C",
        "html": "<p>is oblivious to the most practical solution to his problem.</p>",
        "text": "is oblivious to the most practical solution to his problem."
      },
      {
        "id": "D",
        "html": "<p>focuses more on obtaining the object than getting it back home efficiently.</p>",
        "text": "focuses more on obtaining the object than getting it back home efficiently."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q030",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "30",
      "pages": [
        19
      ]
    },
    "explanation": "30. (H) The question asks for the text from the passage that explains why the author finds the behavior of the ants fascinating. The author’s purpose in describing the excessively foolish actions of the ants is to prove his argument that in spite of what people have long believed, ants are completely lacking in intelligence. Option H is correct because the quoted text in Option H shows the author’s interest in the difference between public opinion and observed truth. Option E is incorrect because the quoted text in Option E provides details that reflect the author’s basic interest, but this observation does not extend to the level of fascination. Option F is incorrect because the author’s main message in the excerpt is that the ant, however industrious, is foolish. Option G is incorrect because the quoted text in Option G also provides details that would reflect a basic interest and observation but that do not extend to fascination.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q030-explanation-1.png\" alt=\"Supplied Form A explanation for question 30\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which of the following best explains the author’s fascination with the ants?",
    "promptHtml": "<p>Which of the following best explains the author’s fascination with the ants?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>“During many summers now I have watched him, when I ought to have been in better business, and I have not yet come across a living ant that seemed to have any more sense than a dead one.” (paragraph 1)</p>",
        "text": "“During many summers now I have watched him, when I ought to have been in better business, and I have not yet come across a living ant that seemed to have any more sense than a dead one.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“I admit his industry, of course; he is the hardest working creature in the world—” (paragraph 2)</p>",
        "text": "“I admit his industry, of course; he is the hardest working creature in the world—” (paragraph 2)"
      },
      {
        "id": "C",
        "html": "<p>“Science has recently discovered that the ant does not lay up anything for winter use.” (paragraph 4)</p>",
        "text": "“Science has recently discovered that the ant does not lay up anything for winter use.” (paragraph 4)"
      },
      {
        "id": "D",
        "html": "<p>“It is strange beyond comprehension that so manifest a humbug as the ant has been able to fool so many nations and keep it up so many ages without being found out.” (paragraph 4)</p>",
        "text": "“It is strange beyond comprehension that so manifest a humbug as the ant has been able to fool so many nations and keep it up so many ages without being found out.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q031",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "31",
      "pages": [
        20
      ]
    },
    "explanation": "31. (B) The question asks how the sentence, which states that the ant ends up only six inches from his original starting point, contributes to the central idea of the excerpt. Option B is correct because it explains how the idea in the sentence supports the central idea that “the average ant is a sham” (paragraph 2) by emphasizing his lack of progress and wasted effort. Option A is incorrect because, while the author recognizes the pointlessness of the efforts, the ant never becomes aware that his efforts are purposeless. Option C is incorrect because the ant ending up only six inches from his starting point suggests pointless effort, not an industrious or productive attitude. Option D is incorrect because the emphasis of\n\nthe sentence is on the ant’s wasted effort, not the difficulty and time involved, which the ant never realizes or evaluates.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q031-explanation-1.png\" alt=\"Supplied Form A explanation for question 31\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q031-explanation-2.png\" alt=\"Supplied Form A explanation for question 31\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 2.\n\nAt the end of half an hour he fetches up within six inches of the place he started from, and lays his burden down.\n\nHow does the sentence contribute to the development of the central idea of the excerpt?",
    "promptHtml": "<p>Read this sentence from paragraph 2.</p><blockquote><strong>At the end of half an hour he fetches up within six inches of the place he started from, and lays his burden down.</strong></blockquote><p>How does the sentence contribute to the development of the central idea of the excerpt?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>It reveals that the ant is aware of the purposelessness of his efforts and that he does not enjoy his work.</p>",
        "text": "It reveals that the ant is aware of the purposelessness of his efforts and that he does not enjoy his work."
      },
      {
        "id": "B",
        "html": "<p>It highlights how little the ant accomplishes despite the great amount of effort he exerts.</p>",
        "text": "It highlights how little the ant accomplishes despite the great amount of effort he exerts."
      },
      {
        "id": "C",
        "html": "<p>It suggests that the ant has an industrious attitude and does not easily give up.</p>",
        "text": "It suggests that the ant has an industrious attitude and does not easily give up."
      },
      {
        "id": "D",
        "html": "<p>It emphasizes that the ant does not thoughtfully consider how difficult it would be to carry his capture for such a long period of time.</p>",
        "text": "It emphasizes that the ant does not thoughtfully consider how difficult it would be to carry his capture for such a long period of time."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q032",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "32",
      "pages": [
        20
      ]
    },
    "explanation": "32. (G) The question asks for a sentence in the excerpt that supports the idea that the ant’s “leather-headedness” (paragraph 4), or the ant’s stubborn determination to engage in foolish and worthless actions, amounts to ignorance and idiocy. Option G is correct because, in the sentence in Option G, the ant realizes he is in the wrong place only after wasting effort and strength, which reveals his stupidity and lack of awareness. Option E is incorrect because the sentence in Option E poses the question that the ant should ask himself and does not demonstrate the ant’s ignorance and idiocy. Option F is incorrect because the sentence in Option F simply describes the ant’s action of lifting the grasshopper leg into a position to carry it. Option H is incorrect because, while the sentence in Option H describes the ant’s exhaustion, which is caused by his stubborn determination, the sentence does not provide a connection to the ant’s leather-headedness.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q032-explanation-1.png\" alt=\"Supplied Form A explanation for question 32\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which sentence from paragraph 2 best supports the idea that sheer “leather-headedness” (paragraph 2) amounts to “ignorance” and “idiocy” (paragraph 4)?",
    "promptHtml": "<p>Which sentence from paragraph 2 best supports the idea that sheer “leather-headedness” (paragraph 2) amounts to “ignorance” and “idiocy” (paragraph 4)?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“He goes out foraging, he makes a capture, and then what does he do?”</p>",
        "text": "“He goes out foraging, he makes a capture, and then what does he do?”"
      },
      {
        "id": "B",
        "html": "<p>“He lifts it bodily up in the air by main force,”</p>",
        "text": "“He lifts it bodily up in the air by main force,”"
      },
      {
        "id": "C",
        "html": "<p>“When he gets up there he finds that that is not the place;”</p>",
        "text": "“When he gets up there he finds that that is not the place;”"
      },
      {
        "id": "D",
        "html": "<p>“Now he wipes the sweat from his brow, strokes his limbs, and then marches aimlessly off, in as violent a hurry as ever.”</p>",
        "text": "“Now he wipes the sweat from his brow, strokes his limbs, and then marches aimlessly off, in as violent a hurry as ever.”"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q033",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "33",
      "pages": [
        20
      ]
    },
    "explanation": "33. (B) The question asks for an explanation of how the sentence, which highlights the second ant’s interest in the grasshopper leg, fits into the structure of the excerpt. Option B is correct because the sentence shows a shift from paragraph 2, which analyzes the actions of the first ant alone, to paragraph 3, which comments on the conversation between the two ants and the ensuing efforts of the two ants together. Option A is incorrect because the idea that the ant seeks out worthless items, such as a grasshopper leg, is established in paragraph 2 (“it is generally something which can be of no sort of use to himself or anybody else”). Option C is incorrect because paragraph 3 is a continuation of the author’s tale and not an expansion of the focus of his commentary. Option D is incorrect because the author does not compare the purposefulness of the two ants.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q033-explanation-1.png\" alt=\"Supplied Form A explanation for question 33\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\nEvidently the friend remarks that a last year’s grasshopper leg is a very noble acquisition, and inquires where he got it.\n\nWhich statement best describes how the sentence fits into the overall structure of the excerpt?",
    "promptHtml": "<p>Read this sentence from paragraph 3.</p><blockquote><strong>Evidently the friend remarks that a last year’s grasshopper leg is a very noble acquisition, and inquires where he got it.</strong></blockquote><p>Which statement best describes how the sentence fits into the overall structure of the excerpt?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It indicates a shift to the realization that the ants place great importance on an item that has little value.</p>",
        "text": "It indicates a shift to the realization that the ants place great importance on an item that has little value."
      },
      {
        "id": "B",
        "html": "<p>It emphasizes a shift from an analysis of the actions of the individual ant to a commentary on the actions of the ants working together.</p>",
        "text": "It emphasizes a shift from an analysis of the actions of the individual ant to a commentary on the actions of the ants working together."
      },
      {
        "id": "C",
        "html": "<p>It introduces a transition to the idea that specific observations about one ant allow for generalizations about all ants.</p>",
        "text": "It introduces a transition to the idea that specific observations about one ant allow for generalizations about all ants."
      },
      {
        "id": "D",
        "html": "<p>It provides a transition to the observation that the ant’s friend is just as purposeful in his efforts toward a futile ending as the first ant.</p>",
        "text": "It provides a transition to the observation that the ant’s friend is just as purposeful in his efforts toward a futile ending as the first ant."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q034",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "34",
      "pages": [
        21
      ]
    },
    "explanation": "34. (E) The question asks for an explanation of how the word choice in the sentence adds to the meaning of the excerpt. The image the author creates of two sweating ants abandoning the grasshopper leg to look for “an old nail,” which an ant would want because it is “valueless,” is comical, as suggested in Option E. Option F is incorrect because it is a misinterpretation of the excerpt, as the ants are not confused but are acting decisively (paragraph 3: “Then they go at it again, just as before”). Option G is incorrect because the ants find moving heavy objects to be an amusing way to spend their time and are not aware enough to feel frustrated (paragraph\n\n3: “something else that is heavy enough to afford entertainment and at the same time valueless enough to make an ant want to own it”). Option H is incorrect because the ants are willingly giving up on their object (paragraph 3: “decide that dried grasshopper legs are a poor sort of property after all”).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q034-explanation-1.png\" alt=\"Supplied Form A explanation for question 34\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q034-explanation-2.png\" alt=\"Supplied Form A explanation for question 34\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\nThe two perspiring ants inspect it thoughtfully and decide that dried grasshopper legs are a poor sort of property after all, and then each starts off in a different direction to see if he can’t find an old nail or something else that is heavy enough to afford entertainment and at the same time valueless enough to make an ant want to own it.\n\nHow does the word choice in the sentence contribute to the overall meaning of the excerpt?",
    "promptHtml": "<p>Read this sentence from paragraph 3.</p><blockquote><strong>The two perspiring ants inspect it thoughtfully and decide that dried grasshopper legs are a poor sort of property after all, and then each starts off in a different direction to see if he can’t find an old nail or something else that is heavy enough to afford entertainment and at the same time valueless enough to make an ant want to own it.</strong></blockquote><p>How does the word choice in the sentence contribute to the overall meaning of the excerpt?</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>It creates a humorous critique of the ants’ intense attitude toward their pointless work.</p>",
        "text": "It creates a humorous critique of the ants’ intense attitude toward their pointless work."
      },
      {
        "id": "B",
        "html": "<p>It illustrates the ants’ confusion over their lack of positive results compared with their level of effort.</p>",
        "text": "It illustrates the ants’ confusion over their lack of positive results compared with their level of effort."
      },
      {
        "id": "C",
        "html": "<p>It highlights the ants’ frustration as they repeatedly chose a difficult task over one that could be accomplished more easily.</p>",
        "text": "It highlights the ants’ frustration as they repeatedly chose a difficult task over one that could be accomplished more easily."
      },
      {
        "id": "D",
        "html": "<p>It illustrates the ants’ stubborn determination to hold on to the worthless object.</p>",
        "text": "It illustrates the ants’ stubborn determination to hold on to the worthless object."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-tramp-abroad-2018-2019-form-a-pdf-shsat-2018-2019-a-q035",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "35",
      "pages": [
        21
      ]
    },
    "explanation": "35. (C) The question asks how the second ant, a friend, influences the first ant. Option C is correct because the friend’s complimentary remark about the grasshopper leg serves to encourage the first ant to continue his efforts to drag the useless object home (paragraph 2: “Evidently the friend remarks that a last year’s grasshopper leg is a very noble acquisition”). Option A is incorrect because the first ant does not know where his home is (paragraph 2: “He doesn’t know where home is. His home may be only three feet away; no matter, he can’t find it”). Option B is incorrect because, while the friend offers to help the first ant (paragraph 3: “Evidently the friend contracts to help him freight it home”), he does not inspire a new approach to resolving the situation. Option D is incorrect because, while the friend does make it difficult for the first ant to transport the grasshopper leg, the friend is not intentionally trying to prevent the first ant from reaching home (paragraph 3: “Then, with a judgment peculiarly antic [pun not intentional], they take hold of opposite ends of that grasshopper leg and begin to tug with all their might in opposite directions”).\n\nRuins of a Fabled City",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q035-explanation-1.png\" alt=\"Supplied Form A explanation for question 35\" width=\"348\"></p>",
    "points": 1,
    "prompt": "How does the presence of the friend in paragraph 3 influence the first ant’s behavior?",
    "promptHtml": "<p>How does the presence of the friend in paragraph 3 influence the first ant’s behavior?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>The friend distracts the ant from finding the correct path home.</p>",
        "text": "The friend distracts the ant from finding the correct path home."
      },
      {
        "id": "B",
        "html": "<p>The friend inspires the ant to consider a new approach to the situation.</p>",
        "text": "The friend inspires the ant to consider a new approach to the situation."
      },
      {
        "id": "C",
        "html": "<p>The friend encourages the ant to continue his worthless efforts.</p>",
        "text": "The friend encourages the ant to continue his worthless efforts."
      },
      {
        "id": "D",
        "html": "<p>The friend tries to prevent the ant from finishing his task.</p>",
        "text": "The friend tries to prevent the ant from finishing his task."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromATrampAbroad20182019FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-a-tramp-abroad-2018-2019-form-a",
  versionLabels: ["2018-2019 Form A"],
  label: "2018-2019 Form A",
  section: "reading",
  questionCount: excerptFromATrampAbroad20182019FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-a-tramp-abroad-2018-2019-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from A Tramp Abroad",
    sourceNoteHtml: "<p>From A TRAMP ABROAD by Mark Twain—Public Domain</p>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2018-2019 Form A","year":"2018-2019","form":"A","packageId":"62c32b0be11d7e87c41a85210539247ebd09577385a479a3bff2c1df4b4c718e"},
    title: "Excerpt from A Tramp Abroad",
    author: "Mark Twain",
    byline: "by Mark Twain",
    passageType: "literary",
    passageCategory: "official_handbook",
    richText: "<p>Now and then, while <span data-glossary-definition=\"the author and his fictional travel companion\" role=\"link\" tabindex=\"0\">we</span> rested, we watched the laborious ant at his work. I found nothing new in him—certainly nothing to change my opinion of him. It seems to me that in the matter of intellect the ant must be a strangely overrated bird. During many summers now I have watched him, when I ought to have been in better business, and I have not yet come across a living ant that seemed to have any more sense than a dead one. I refer to the ordinary ant, of course; I have had no experience of those wonderful Swiss and African ones which vote, keep drilled armies, . . . and dispute about religion. Those particular ants may be all that the naturalist paints them, but I am persuaded that the average ant is a sham.</p><p>I admit his industry, of course; he is the hardest working creature in the world—when anybody is looking—but his leather-headedness is the point I make against him. He goes out foraging, he makes capture, and then what does he do? Go home? No; he goes anywhere but home. He doesn’t know where home is. His home may be only three feet away; no matter, he can’t find it. He makes his capture, as I have said; it is generally something which can be of no sort of use to himself or anybody else; it is usually seven times bigger than it ought to be; he hunts out the awkwardest place to take hold of it; h lifts it bodily up in the air by main force, and starts—not toward home, but in the opposite direction; not calmly and wisely, but with a frantic haste which is wasteful of his strength; he fetches up against a pebble, and, instead of going around it, he climbs over it backwards, dragging his booty after him, tumbles down on the other side, jumps up in a passion, kicks the dust off his clothes, moistens his hands, grabs his property viciously, yanks it this way, then that, shoves it ahead of him a moment, turns tail and lugs it after him another moment, gets madder and madder, then presently hoists it int the air and goes tearing away in an entirely new direction; comes to a weed; it never occurs to him to go around it. No; he must climb it, and he does climb it, dragging his worthless property to the top— which is as bright a thing to do as it would be for me to carry a sack of flour from Heidelberg to Paris by way of Strasburg steeple; when he gets up there he finds that that is not the place; takes a cursory glance at the scenery, and either climbs down again or tumbles down, and starts off once more—as usual, in a new direction. At the end of half an hour he fetches up within six inches of the place he started from, and lays his burden down. Meantime, he has been over all the ground for two yards around, and climbed all the weeds and pebbles he came across. Now he wipes the sweat from his brow, strokes his limbs, and then marches aimlessly off, in as violent a hurry as ever. He traverses a good deal of zig-zag country, and by and by stumbles on his same booty again. He does not remember to have ever seen it before; he looks around to see which is not the way home, grabs his bundle, and starts. He goes through the same adventures he had before; finally stops to rest, and a friend comes along.</p><p>Evidently the friend remarks that a last year’s grasshopper leg is a very noble acquisition, and inquires where he got it. Evidently the proprietor does not remember exactly where he did get it, but thinks he got it “around here somewhere.” Evidently the friend contracts to help him freight it home. Then, with a judgment peculiarly antic (pun not intentional), they take hold of opposite ends of that grasshopper leg and begin to tug with all their might in opposite directions. Presently they take a rest and confer together. They decide that something is wrong, they can’t make out what. Then they go at i again, just as before. Same result. Mutual recriminations follow. Evidently each accuses the other of being an obstructionist. They warm up, and the dispute ends in a fight. They lock themselves together and chew each other’s jaws for a while; then they roll and tumble on the ground till one loses a horn or a leg and has to haul off for repairs. They make up and go to work again in the same old insane way, but the crippled ant is at a disadvantage; tug as he may, the other one drags off the booty and him at the end of it. Instead of giving up, he hangs on, and gets his shins bruised against every obstruction that comes in the way. By and by, when that grasshopper leg has been dragged all over the same old ground once more, it is finally dumped at about the spot where it originally lay. The two perspiring ants inspect it thoughtfully and decide that dried grasshopper legs are a poor sort of property after all, and then each starts off in a different direction to see if he can’t find an old nail or something else that is heavy enough to afford entertainment and at the same time valueless enough to make an ant want to own it. . . .</p><p>Science has recently discovered that the ant does not lay up anything for winter use. . . . He does not work, except when people are looking, and only then when the observer has a green, naturalistic look, and seems to be taking notes. This amounts to deception, and will injure him for the Sunday schools. He has not judgment enough to know what is good to eat from what isn’t. This amounts to ignorance, and will impair the world’s respect for him. . . . He cannot stroll around a stump and find his way home again. This amounts to idiocy, and once the damaging fact is established, thoughtful people will cease to look up to him. It is strange beyond comprehension that so manifest a humbug as the ant has been able to fool so many nations and keep it up so many ages without being found out.</p>",
    sourceNote: "From A TRAMP ABROAD by Mark Twain—Public Domain",
    text: excerptFromATrampAbroad20182019FormAPassageText,
    versionLabel: "2018-2019 Form A",
  }),
  questions: excerptFromATrampAbroad20182019FormAQuestions,
};
