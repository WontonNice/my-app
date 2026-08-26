import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const winterWheatPassageText = "I love Dad’s way of talking that makes him seem different from other ranchers. He’s lived here twenty-three years, but he still says “back East where I come from.” He’s the one who gets excited when I do about spring coming or a serial running in the magazine we’re both reading, but it’s what Mom says that I depend on. When Mom used to say “Don’t worry” about my pet chicken or dog or new calf, it always got well. Dad is always talking of going some place, not now, but next year, maybe. Mom seems to think of nothing farther away than today or perhaps yesterday or tomorrow morning.\n\nMom folded the ironing board and put it inside their bedroom that was just off the kitchen. She carried in the freshly ironed clothes. Dad went back to his paper. When Mom came back she took beans from the cupboard to soak for tomorrow. Dad always said Mom could make all the dishes he’d had back in Vermont as well as though she were a New Englander herself, instead of a Russian. All of a sudden, I realized that tomorrow when those beans would be ready to eat I’d be going away. It gave me a funny feeling.\n\n“I’ll be taking the train tomorrow night,” I said aloud, more to hear it myself.\n\n“We can drive you into town in the afternoon,” Dad said, dropping his paper on the floor.\n\n“There’s no need to go to town; she can catch the train at Gotham just as well. We haven’t nothing to take us into town for,” Mom said.\n\n“Well, we don’t have to decide tonight,” Dad said, but I knew he wanted to go into Clark City. It wouldn’t be so flat as just seeing me go off on the train from Gotham. My going away was hard on both of them; they were so different—and I was part of them both. It made me uncomfortable to think of leaving them.\n\nWhile I was getting ready for bed in my room that’s off the front room, I saw how it would be if I left from town. We’d go in right after dinner and go around to the stores, Dad going one way and Mom and I another. Dad would probably have his hair cut at the barbershop and stop in the bank and meet someone he knew to talk to. Then we’d meet at the big store on the corner and go to the cafeteria for supper. The train stops ten minutes or so at the station in town and there are other people and excitement and you have time to wave from the platform and then again from your window by your seat. We went to the station in Clark City to see the Goodals off when they went back to Iowa.\n\nIf I left from Gotham, we’d just drive down in the truck and wait till the train came. It only stops long enough for you to get on and you hardly have time to taste the flavor of going away.\n\nI sat on the bed in my pyjamas with my arms around my knees. I couldn’t keep from thinking of that time Dad went back East. I tried to, and then I just sat still and looked straight at it. Sometimes that’s better than working so hard to keep from looking at what’s in your mind.\n\nDad went all the way back to Vermont. . . . It was in November and it was already dark when the train came through Gotham. Even now, I could feel how cold and dark it was. I held Mom’s hand. Dad was so dressed-up he seemed strange. . . . We stood there without saying anything until Dad told Mom to remember to call Mr. Bardich, our neighbor, if the cow didn’t calve tomorrow.\n\n“I’ll manage,” Mom snapped back.\n\n“I wish you could go, Anna,” Dad said to Mom, “and we could take Ellen.” . . .\n\n“Good-by, Anna Petrovna,” he said, looking at Mom. I had never heard him call her by two names before.\n\n“Good-by,” Mom said, standing still, without smiling.\n\nThen he was gone and the crossroads were darker than ever. The train light shone on the high window in the top of the grain elevator for a moment and then that too was dark. We got into our old Ford and Mom drove back to the house. My throat ached all the way. The name Dad had called Mom kept saying itself in my ears: “Anna Petrovna, Anna Petrovna.” . . .\n\nOur house seemed lonely when we came back to it. It seemed to be hiding under the coulee. I went with Mom to put the truck in the barn that was bigger than the house. I think Mom was prouder of our barn than the house, anyway. We walked back to look at the cow that was going to calve. She was just a big light blob in the dark, waiting. I had thought she was exciting this morning, but now she seemed sad, too.\n\nThe wind blew when we walked across the open space to the house and I couldn’t help shivering with the cold. Inside the house it was warm, but empty.\n\n“Bring your nightgown in here and I heat you some milk,” Mom said.\n\nI drank the milk sitting on a stool in front of the stove. It tasted good, but the lonely ache in my throat was still there. I picked up my clothes and hung them neatly behind the stove and put my cup on the sink board. Mom was fixing oatmeal for tomorrow morning.\n\n“Good night, Mom,” I said almost timidly, standing beside her. She seemed wrapped around in a kind of strangeness. Then she turned around and drew me to her. The front of her dress was warm from the stove. I felt the comfortable heat through my gown. She laid her hand against my face and it felt rough and hard but firm. I dared ask her something I wanted to know.\n\n“Mom, was that really your name—what Dad called you?”\n\nHer voice sounded surprised. “Why, Yeléna, you know that; Anna Petrovna. You know I am born in Russia, in Seletskoe.”\n\n“Yes, but I didn’t know your other name,” I said.\n\n“Anna Petrovna Webb.” She pronounced it slowly. “Once I think what a funny name Ben Webb is!” She laughed. Her laugh was warm and low like our kitchen, and comfortable. The house seemed natural and right again. . . .\n\nBut now that I am grown, I feel the wall of strangeness between them, more than when I was a child. I wondered how they would get along without me.";

const winterWheatQuestions: ExamQuestion[] = [
  {
    "id": "winter-wheat-1",
    "points": 1,
    "prompt": "Which sentence from the excerpt supports the idea that Ellen understands what her father is really thinking, and which sentence supports the idea that Ellen and her father share similar interests?",
    "topic": "Central Idea & Theme",
    "categories": [
      {
        "id": "category-1",
        "title": "Supports the idea that Ellen understands what her father is really thinking"
      },
      {
        "id": "category-2",
        "title": "Supports the idea that Ellen and her father share similar interests"
      }
    ],
    "categoryCapacity": 1,
    "correctPlacements": {
      "item-2": "category-2",
      "item-3": "category-1"
    },
    "instructions": "Move the correct answer to each box.",
    "items": [
      {
        "id": "item-1",
        "text": "“I love Dad’s way of talking that makes him seem different from other ranchers.” (paragraph 1)"
      },
      {
        "id": "item-2",
        "text": "“He’s the one who gets excited when I do about spring coming or a serial running in the magazine we’re both reading” (paragraph 1)"
      },
      {
        "id": "item-3",
        "text": "“Well, we don’t have to decide tonight,” Dad said, but I knew he wanted to go into Clark City.” (paragraph 6)"
      },
      {
        "id": "item-4",
        "text": "“We’d go in right after dinner and go around to the stores, Dad going one way and Mom and I another.” (paragraph 7)"
      }
    ],
    "requiredPlacements": 2,
    "type": "category_sort"
  },
  {
    "id": "winter-wheat-2",
    "points": 1,
    "prompt": "Read these sentences from paragraph 2.\n\nDad always said Mom could make all the dishes he’d had back in Vermont as well as though she were a New Englander herself, instead of a Russian. All of a sudden, I realized that tomorrow when those beans would be ready to eat I’d be going away. It gave me a funny feeling.\n\nThe sentences help develop a theme of the excerpt by",
    "promptHtml": "Read these sentences from paragraph 2.<br><strong>Dad always said Mom could make all the dishes he’d had back in Vermont as well as though she were a New Englander herself, instead of a Russian. All of a sudden, I realized that tomorrow when those beans would be ready to eat I’d be going away. It gave me a funny feeling.</strong><br>The sentences help develop a theme of the excerpt by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "suggesting that life presents people with many challenges."
      },
      {
        "id": "B",
        "text": "implying that the stress of major life events can cause confusion."
      },
      {
        "id": "C",
        "text": "demonstrating that moving on from the familiar is a common human experience."
      },
      {
        "id": "D",
        "text": "emphasizing the idea that people can easily learn the routines of being part of a new culture."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "winter-wheat-3",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\n“I’ll be taking the train tomorrow night,” I said aloud, more to hear it myself.\n\nThis remark contributes to the conflict in the excerpt by",
    "promptHtml": "Read this sentence from paragraph 3.<br><strong>“I’ll be taking the train tomorrow night,” I said aloud, more to hear it myself.</strong><br>This remark contributes to the conflict in the excerpt by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "revealing Dad’s reasons for wanting to drive to the city.",
        "text": "revealing Dad’s reasons for wanting to drive to the city."
      },
      {
        "id": "B",
        "html": "causing tension between Mom and Dad.",
        "text": "causing tension between Mom and Dad."
      },
      {
        "id": "C",
        "html": "leading Ellen to distance herself from both Mom and Dad.",
        "text": "leading Ellen to distance herself from both Mom and Dad."
      },
      {
        "id": "D",
        "html": "showing Mom’s reluctance to plan that far in advance.",
        "text": "showing Mom’s reluctance to plan that far in advance."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "winter-wheat-4",
    "points": 1,
    "prompt": "Read this sentence from paragraph 9.\n\nI tried to, and then I just sat still and looked straight at it.\n\nHow does the phrase “looked straight at it” contribute to the meaning of the excerpt?",
    "promptHtml": "Read this sentence from paragraph 9.<br><strong>I tried to, and then I just sat still and looked straight at it.</strong><br>How does the phrase “looked straight at it” contribute to the meaning of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It shows that Ellen is willing to deal with a problem directly instead of ignoring it.",
        "text": "It shows that Ellen is willing to deal with a problem directly instead of ignoring it."
      },
      {
        "id": "B",
        "html": "It suggests that Ellen studies all parts of an issue and not just its surface.",
        "text": "It suggests that Ellen studies all parts of an issue and not just its surface."
      },
      {
        "id": "C",
        "html": "It illustrates that Ellen examines both sides of an argument.",
        "text": "It illustrates that Ellen examines both sides of an argument."
      },
      {
        "id": "D",
        "html": "It implies that Ellen is eager to seek wisdom from past experiences.",
        "text": "It implies that Ellen is eager to seek wisdom from past experiences."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "winter-wheat-5",
    "points": 1,
    "prompt": "The words “cold” and “dark” affect the tone in paragraph 10 by",
    "promptHtml": "The words “cold” and “dark” affect the tone in paragraph 10 by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "highlighting the feeling of unpredictability among the family members.",
        "text": "highlighting the feeling of unpredictability among the family members."
      },
      {
        "id": "B",
        "html": "showing the feelings of anger and resentment Ellen directs toward her parents.",
        "text": "showing the feelings of anger and resentment Ellen directs toward her parents."
      },
      {
        "id": "C",
        "html": "exaggerating the feeling of regret Dad experiences when leaving his family.",
        "text": "exaggerating the feeling of regret Dad experiences when leaving his family."
      },
      {
        "id": "D",
        "html": "emphasizing the feelings of separation and loss that Ellen feels.",
        "text": "emphasizing the feelings of separation and loss that Ellen feels."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "winter-wheat-6",
    "points": 1,
    "prompt": "Read these sentences from the excerpt.\n\nMom seems to think of nothing farther away than today or perhaps yesterday or tomorrow morning. (paragraph 1)\n\nMom was fixing oatmeal for tomorrow morning. (paragraph 19)\n\nThe sentences help develop a central idea of the excerpt by",
    "promptHtml": "Read these sentences from the excerpt.<br><strong>Mom seems to think of nothing farther away than today or perhaps yesterday or tomorrow morning.</strong> (paragraph 1)<br><strong>Mom was fixing oatmeal for tomorrow morning.</strong> (paragraph 19)<br>The sentences help develop a central idea of the excerpt by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "suggesting that practical people focus on current needs rather than worrying about the future.",
        "text": "suggesting that practical people focus on current needs rather than worrying about the future."
      },
      {
        "id": "B",
        "html": "showing that parents tend to consider the needs of their children before thinking of themselves.",
        "text": "showing that parents tend to consider the needs of their children before thinking of themselves."
      },
      {
        "id": "C",
        "html": "revealing that it is sometimes important to plan ahead.",
        "text": "revealing that it is sometimes important to plan ahead."
      },
      {
        "id": "D",
        "html": "illustrating that dreaming about the future is a waste of time.",
        "text": "illustrating that dreaming about the future is a waste of time."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "winter-wheat-7",
    "points": 1,
    "prompt": "The flashback in paragraphs 10–24 affects the plot by",
    "promptHtml": "The flashback in paragraphs 10–24 affects the plot by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "showing that the departure of one member of the family makes extra work for those left on the farm.",
        "text": "showing that the departure of one member of the family makes extra work for those left on the farm."
      },
      {
        "id": "B",
        "html": "showing that the bond within the family persists even when its members are apart.",
        "text": "showing that the bond within the family persists even when its members are apart."
      },
      {
        "id": "C",
        "html": "explaining why Ellen fears that leaving her parents will be too difficult.",
        "text": "explaining why Ellen fears that leaving her parents will be too difficult."
      },
      {
        "id": "D",
        "html": "illustrating the close connection Ellen has with both of her parents.",
        "text": "illustrating the close connection Ellen has with both of her parents."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "winter-wheat-8",
    "points": 1,
    "prompt": "Which sentence from the excerpt provides evidence that Mom wants Ellen to understand the family’s heritage?",
    "promptHtml": "Which sentence from the excerpt provides evidence that Mom wants Ellen to understand the family’s heritage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "“Mom folded the ironing board and put it inside their bedroom that was just off the kitchen.” (paragraph 2)",
        "text": "“Mom folded the ironing board and put it inside their bedroom that was just off the kitchen.” (paragraph 2)"
      },
      {
        "id": "B",
        "html": "“ ‘There’s no need to go to town; she can catch the train at Gotham just as well.’ ” (paragraph 5)",
        "text": "“ ‘There’s no need to go to town; she can catch the train at Gotham just as well.’ ” (paragraph 5)"
      },
      {
        "id": "C",
        "html": "“We’d go in right after dinner and go around to the stores, Dad going one way and Mom and I another.” (paragraph 7)",
        "text": "“We’d go in right after dinner and go around to the stores, Dad going one way and Mom and I another.” (paragraph 7)"
      },
      {
        "id": "D",
        "html": "“ ‘Why, Yeléna, you know that; Anna Petrovna.’ ” (paragraph 22)",
        "text": "“ ‘Why, Yeléna, you know that; Anna Petrovna.’ ” (paragraph 22)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "winter-wheat-9",
    "points": 1,
    "prompt": "What is Ellen’s primary mood at key points in the excerpt?",
    "promptHtml": "What is Ellen’s primary mood at key points in the excerpt?",
    "topic": "Central Idea & Theme",
    "categories": [
      {
        "id": "row-1",
        "title": "1–2"
      },
      {
        "id": "row-2",
        "title": "7–8"
      },
      {
        "id": "row-3",
        "title": "9–10"
      }
    ],
    "categoryCapacity": 1,
    "correctPlacements": {
      "item-2": "row-1",
      "item-3": "row-3",
      "item-5": "row-2"
    },
    "instructions": "Move the correct answer to each box in the table.",
    "items": [
      {
        "html": "Calm",
        "id": "item-1",
        "text": "Calm"
      },
      {
        "html": "Affectionate",
        "id": "item-2",
        "text": "Affectionate"
      },
      {
        "html": "Worried",
        "id": "item-3",
        "text": "Worried"
      },
      {
        "html": "Jealous",
        "id": "item-4",
        "text": "Jealous"
      },
      {
        "html": "Wishful",
        "id": "item-5",
        "text": "Wishful"
      }
    ],
    "requiredPlacements": 3,
    "tableHeaders": {
      "answer": "Ellen’s Primary Mood",
      "row": "Paragraphs"
    },
    "type": "table_match"
  }
];

export const winterWheatPassageSet: ExamPassageSet = {
  id: "ela-winter-wheat",
  questionCount: winterWheatQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "winter-wheat",
    passageType: "literary",
    title: "Excerpt from Winter Wheat",
    author: "Mildred Walker",
    blurb: "Ellen, the narrator, is preparing to leave her parents and the family farm for college the next day.",
    sourceNote: "From WINTER WHEAT by Mildred Walker, published by University of Nebraska Press. Copyright © 1944 by Harcourt, Brace and Company, Inc. Copyright renewed 1971 by Mildred Walker. All rights reserved.",
    text: winterWheatPassageText,
  }),
  questions: winterWheatQuestions,
};
