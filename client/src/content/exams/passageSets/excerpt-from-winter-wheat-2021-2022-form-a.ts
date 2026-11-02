import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromWinterWheat20212022FormAPassageText = "I love Dad’s way of talking that makes him seem different from other ranchers. He’s lived here twenty-three years, but he still says “back East where I come from.” He’s the one who gets excited when I do about spring coming or a serial running in the magazine we’re both reading, but it’s what Mom says that I depend on. When Mom used to say “Don’t worry” about my pet chicken or dog or new calf, it always got well. Dad is always talking of going some place, not now, but next year, maybe. Mom seems to think of nothing farther away than today or perhaps yesterday or tomorrow morning.\n\nMom folded the ironing board and put it inside their bedroom that was just off the kitchen. She carried in the freshly ironed clothes. Dad went back to his paper. When Mom came back she took beans from the cupboard to soak for tomorrow. Dad always said Mom could make all the dishes he’d had back in Vermont as well as though she were a New Englander herself, instead of a Russian. All of a sudden, I realized that tomorrow when those beans would be ready to eat I’d be going away. It gave me a funny feeling.\n\n“I’ll be taking the train tomorrow night,” I said aloud, more to hear it myself.\n\n“We can drive you into town in the afternoon,” Dad said, dropping his paper on the floor.\n\n“There’s no need to go to town; she can catch the train at Gotham just as well. We haven’t nothing to take us into town for,” Mom said.\n\n“Well, we don’t have to decide tonight,” Dad said, but I knew he wanted to go into Clark City. It wouldn’t be so flat as just seeing me go off on the train from Gotham. My going away was hard on both of them; they were so different—and I was part of them both. It made me uncomfortable to think of leaving them.\n\nWhile I was getting ready for bed in my room that’s off the front room, I saw how it would be if I left from town. We’d go in right after dinner and go around to the stores, Dad going one way and Mom and I another. Dad would probably have his hair cut at the barbershop and stop in the bank and meet someone he knew to talk to. Then we’d meet at the big store on the corner and go to the cafeteria for supper. The train stops ten minutes or so at the station in town and there are other people and excitement and you have time to wave from the platform and then again from your window by your seat. We went to the station in Clark City to see the Goodals off when they went back to Iowa.\n\nIf I left from Gotham, we’d just drive down in the truck and wait till the train came. It only stops long enough for you to get on and you hardly have time to taste the flavor of going away.\n\nI sat on the bed in my pyjamas with my arms around my knees. I couldn’t keep from thinking of that time Dad went back East. I tried to, and then I just sat still and looked straight at it. Sometimes that’s better than working so hard to keep from looking at what’s in your mind.\n\nDad went all the way back to Vermont. . . . It was in November and it was already dark when the train came through Gotham. Even now, I could feel how cold and dark it was. I held Mom’s hand. Dad was so dressed-up he seemed strange. . . . We stood there without saying anything until Dad told Mom to remember to call Mr. Bardich, our neighbor, if the cow didn’t calve tomorrow.\n\n“I’ll manage,” Mom snapped back.\n\n“I wish you could go, Anna,” Dad said to Mom, “and we could take Ellen.” . . .\n\n“Good-by, Anna Petrovna,” he said, looking at Mom. I had never heard him call her by two names before.\n\n“Good-by,” Mom said, standing still, without smiling.\n\nThen he was gone and the crossroads were darker than ever. The train light shone on the high window in the top of the grain elevator for a moment and then that too was dark. We got into our old Ford and Mom drove back to the house. My throat ached all the way. The name Dad had called Mom kept saying itself in my ears: “Anna Petrovna, Anna Petrovna.” . . .\n\nOur house seemed lonely when we came back to it. It seemed to be hiding under the coulee. I went with Mom to put the truck in the barn that was bigger than the house. I think Mom was prouder of our barn than the house, anyway. We walked back to look at the cow that was going to calve. She was just a big light blob in the dark, waiting. I had thought she was exciting this morning, but now she seemed sad, too.\n\nThe wind blew when we walked across the open space to the house and I couldn’t help shivering with the cold. Inside the house it was warm, but empty.\n\n“Bring your nightgown in here and I heat you some milk,” Mom said.\n\nI drank the milk sitting on a stool in front of the stove. It tasted good, but the lonely ache in my throat was still there. I picked up my clothes and hung them neatly behind the stove and put my cup on the sink board. Mom was fixing oatmeal for tomorrow morning.\n\n“Good night, Mom,” I said almost timidly, standing beside her. She seemed wrapped around in a kind of strangeness. Then she turned around and drew me to her. The front of her dress was warm from the stove. I felt the comfortable heat through my gown. She laid her hand against my face and it felt rough and hard but firm. I dared ask her something I wanted to know.\n\n“Mom, was that really your name—what Dad called you?”\n\nHer voice sounded surprised. “Why, Yeléna, you know that; Anna Petrovna. You know I am born in Russia, in Seletskoe.”\n\n“Yes, but I didn’t know your other name,” I said.\n\n“Anna Petrovna Webb.” She pronounced it slowly. “Once I think what a funny name Ben Webb is!” She laughed. Her laugh was warm and low like our kitchen, and comfortable. The house seemed natural and right again. . . .\n\nBut now that I am grown, I feel the wall of strangeness between them, more than when I was a child. I wondered how they would get along without me.";

const excerptFromWinterWheat20212022FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-winter-wheat-2021-2022-form-a-pdf-shsat-2021-2022-a-q018",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "18",
      "pages": [
        13
      ]
    },
    "explanation": "The question asks how the sentences in paragraph 2 help develop a theme of the excerpt.\nE. Incorrect. Although the sentences from paragraph 2 describe Ellen’s “funny feeling” upon\nrealizing that she will no longer be home when the beans that her mother is making are\nready to eat, the details do not show that life presents many challenges. Additionally, the\ntheme that life presents people with many challenges is not a theme found in the excerpt.\nF. Incorrect. The sentences from paragraph 2 state that Ellen has “a funny feeling” while\nawaiting a major life event, but they do not indicate that she is confused or stressed. The\ndetails in the sentences convey a sense of wistfulness, but the theme that the stress of major\nlife events causes confusion is not found in the excerpt.\nG. CORRECT. The sentences from paragraph 2 show that Ellen’s mother has moved on from the\nfamiliar and left her childhood home behind, just as Ellen is about to do. This information\nlinks the experiences of parent and child and helps develop the theme that moving beyond\nthe familiar is a common human experience.\nH. Incorrect. Although the sentences from paragraph 2 show that Ellen’s mother has learned to\ncook New England food very well (“as though she were a New Englander herself”), they do\nnot provide information about how easy or difficult it was for Ellen’s mother to learn a new\nway of cooking. The theme that people can easily learn the routines of a new culture is not a\ntheme found in the excerpt.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q018-explanation-1.png\" alt=\"Official explanation for source question 18; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "Read these sentences from paragraph 2.\n\nDad always said Mom could make all the dishes he’d had back in Vermont as well as though she were a New Englander herself, instead of a Russian. All of a sudden, I realized that tomorrow when those beans would be ready to eat I’d be going away. It gave me a funny feeling.\n\nThe sentences help develop a theme of the excerpt by",
    "promptHtml": "<p>Read these sentences from paragraph 2.</p><blockquote><strong>Dad always said Mom could make all the dishes he’d had back in Vermont as well as though she were a New Englander herself, instead of a Russian. All of a sudden, I realized that tomorrow when those beans would be ready to eat I’d be going away. It gave me a funny feeling.</strong></blockquote><p>The sentences help develop a theme of the excerpt by</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggesting that life presents people with many challenges.</p>",
        "text": "suggesting that life presents people with many challenges."
      },
      {
        "id": "B",
        "html": "<p>implying that the stress of major life events can cause confusion.</p>",
        "text": "implying that the stress of major life events can cause confusion."
      },
      {
        "id": "C",
        "html": "<p>demonstrating that moving on from the familiar is a common human experience.</p>",
        "text": "demonstrating that moving on from the familiar is a common human experience."
      },
      {
        "id": "D",
        "html": "<p>emphasizing the idea that people can easily learn the routines of being part of a new culture.</p>",
        "text": "emphasizing the idea that people can easily learn the routines of being part of a new culture."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-winter-wheat-2021-2022-form-a-pdf-shsat-2021-2022-a-q019",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "19",
      "pages": [
        13
      ]
    },
    "explanation": "The question asks how the sentence from paragraph 3 contributes to the conflict in the excerpt.\nA. Incorrect. Although Ellen's father does want to drive to the city, this sentence does not reveal\nhis reasons for wanting to do so. Ellen’s father’s wish to drive to the city is important to the\nconflict of the excerpt not because of his underlying reasons but because his wish differs\nfrom Ellen’s mother’s wish to take Ellen to the train at Gotham—a difference of opinion that\nintroduces tension between the parents.\nB. CORRECT. The sentence causes Ellen’s parents to propose competing options for taking her\nto the train, and the resulting conversation recalls fraught memories of an earlier leave-\ntaking in the family. The disagreement between Ellen’s mother and father over where to take\nEllen to catch the train heightens the tension between them. Because the primary conflict of\nthe excerpt is Ellen’s anxiety about the effect her leaving will have on the relationship\nbetween her parents, this remark contributes to the conflict by bringing her parents’\ndisagreement into view.\nC. Incorrect. Although Ellen will put physical distance between herself and her parents on the\nfollowing day, the remark she makes does not lead her to emotionally distance herself from\nher parents. Moreover, the emotional distance between Ellen and her parents is not the\nprimary source of conflict in the excerpt.\nD. Incorrect. While paragraph 1 states that Ellen’s mother “seems to think of nothing farther\naway than today or perhaps yesterday or tomorrow morning,” the sentence in paragraph 3\ndoes not show any reluctance to plan far in advance. Moreover, planning for the future is not\na source of conflict in the excerpt.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q019-explanation-1.png\" alt=\"Official explanation for source question 19; original printed answer labels retained.\" width=\"689\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\n“I’ll be taking the train tomorrow night,” I said aloud, more to hear it myself.\n\nThis remark contributes to the conflict in the excerpt by",
    "promptHtml": "<p>Read this sentence from paragraph 3.</p><blockquote><strong>“I’ll be taking the train tomorrow night,” I said aloud, more to hear it myself.</strong></blockquote><p>This remark contributes to the conflict in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>revealing Dad’s reasons for wanting to drive to the city.</p>",
        "text": "revealing Dad’s reasons for wanting to drive to the city."
      },
      {
        "id": "B",
        "html": "<p>causing tension between Mom and Dad.</p>",
        "text": "causing tension between Mom and Dad."
      },
      {
        "id": "C",
        "html": "<p>leading Ellen to distance herself from both Mom and Dad.</p>",
        "text": "leading Ellen to distance herself from both Mom and Dad."
      },
      {
        "id": "D",
        "html": "<p>showing Mom’s reluctance to plan that far in advance.</p>",
        "text": "showing Mom’s reluctance to plan that far in advance."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-winter-wheat-2021-2022-form-a-pdf-shsat-2021-2022-a-q020",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "20",
      "pages": [
        14
      ]
    },
    "explanation": "The question asks how the phrase “looked straight at it” in paragraph 9 contributes to the\nmeaning of the excerpt.\nE. CORRECT. The phrase shows Ellen deciding to directly confront the memory even though\nshe initially wanted to ignore it (“I couldn’t keep from thinking of that time Dad went back\nEast. I tried to” [paragraph 9]). Though the memory is emotionally fraught for Ellen, the\nphrase “looked straight at it” shows that she is willing to face problems—such as a painful\nfamily memory—head on,\nF. Incorrect. The phrase in paragraph 9 does not show Ellen studying all parts of an issue but\nrather forcing herself to focus on something she would have preferred not to think about.\nG. Incorrect. In looking “straight at” the memory, Ellen is not considering both sides of an\nargument. Instead, she is making herself think about an uncomfortable memory that she had\nbeen trying to avoid revisiting. The phrase indicates that she is finally willing to directly\nconfront an unsettling recollection.\nH. Incorrect. Given the detail in paragraph 9 that Ellen initially attempted to keep from thinking\nabout her father’s trip to Vermont, the phrase “looked straight at it” indicates a willingness,\nbut not an eagerness, to seek wisdom from reflecting on past experiences.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q020-explanation-1.png\" alt=\"Official explanation for source question 20; original printed answer labels retained.\" width=\"690\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 9.\n\nI tried to, and then I just sat still and looked straight at it.\n\nHow does the phrase “looked straight at it” contribute to the meaning of the excerpt?",
    "promptHtml": "<p>Read this sentence from paragraph 9.</p><blockquote><strong>I tried to, and then I just sat still and looked straight at it.</strong></blockquote><p>How does the phrase “looked straight at it” contribute to the meaning of the excerpt?</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>It shows that Ellen is willing to deal with a problem directly instead of ignoring it.</p>",
        "text": "It shows that Ellen is willing to deal with a problem directly instead of ignoring it."
      },
      {
        "id": "B",
        "html": "<p>It suggests that Ellen studies all parts of an issue and not just its surface.</p>",
        "text": "It suggests that Ellen studies all parts of an issue and not just its surface."
      },
      {
        "id": "C",
        "html": "<p>It illustrates that Ellen examines both sides of an argument.</p>",
        "text": "It illustrates that Ellen examines both sides of an argument."
      },
      {
        "id": "D",
        "html": "<p>It implies that Ellen is eager to seek wisdom from past experiences.</p>",
        "text": "It implies that Ellen is eager to seek wisdom from past experiences."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-winter-wheat-2021-2022-form-a-pdf-shsat-2021-2022-a-q021",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "21",
      "pages": [
        14
      ]
    },
    "explanation": "The question asks how the words “cold” and “dark” affect the tone in paragraph 10.\nA. Incorrect. The mood of paragraph 10 is primarily one of sadness as Ellen says goodbye to her\nfather at the train station. The words “cold” and “dark” do not convey unpredictability but\nrather emphasize Ellen’s feeling of loss over the departure of her father.\nB. Incorrect. Although the father’s departure causes tension with his wife (“ ‘I'll manage,’\nMom snapped back” [paragraph 11]), Ellen does not display anger or resentment toward\nher parents.\nC. Incorrect. Although Ellen's father states that he wishes his family could come with him on the\ntrip to Vermont (“ ‘I wish you could go, Anna,’ Dad said to Mom, ‘and we could take Ellen’ ”\n[paragraph 12]), the words “cold” and “dark” describe Ellen’s perspective on her father’s\ndeparture. They create a tone of sadness from Ellen at being left behind rather than a tone of\nregret from her father because he has to leave.\nD. CORRECT. In paragraph 10, Ellen states, “I could feel how cold and dark it was.” The words\n“cold” and “dark” highlight her emotional response to the departure of her father,\nemphasizing the almost physical sense of grief she feels at being separated from someone so\nprecious to her.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q021-explanation-1.png\" alt=\"Official explanation for source question 21; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "The words “cold” and “dark” affect the tone in paragraph 10 by",
    "promptHtml": "<p>The words “cold” and “dark” affect the tone in paragraph 10 by</p>",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "<p>highlighting the feeling of unpredictability among the family members.</p>",
        "text": "highlighting the feeling of unpredictability among the family members."
      },
      {
        "id": "B",
        "html": "<p>showing the feelings of anger and resentment Ellen directs toward her parents.</p>",
        "text": "showing the feelings of anger and resentment Ellen directs toward her parents."
      },
      {
        "id": "C",
        "html": "<p>exaggerating the feeling of regret Dad experiences when leaving his family.</p>",
        "text": "exaggerating the feeling of regret Dad experiences when leaving his family."
      },
      {
        "id": "D",
        "html": "<p>emphasizing the feelings of separation and loss that Ellen feels.</p>",
        "text": "emphasizing the feelings of separation and loss that Ellen feels."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-winter-wheat-2021-2022-form-a-pdf-shsat-2021-2022-a-q022",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "22",
      "pages": [
        14
      ]
    },
    "explanation": "The question asks which sentence from the excerpt provides evidence that Ellen has a lot in\ncommon with her father.\nE. CORRECT. This sentence from paragraph 1 shows that Ellen and her father both get excited\nabout the coming of spring and share an interest in reading magazine serials (stories\npublished in serial installments). The sentence implies that Ellen and her father have shared\nlikes and interests, and therefore, it provides clear evidence that they have a lot in common.\nF. Incorrect. While this sentence from paragraph 4 highlights the warm relationship between\nEllen and her father and shows that he would like to take her to the train station in town, it\ndoes not provide clear evidence that they share a lot in common.\nG. Incorrect. Although this sentence from paragraph 6 implies that Ellen understands her father\nwell enough to intuit his preference to go to the train station in town (“but I knew he wanted\nto go into Clark City”), their closeness is not clear evidence that Ellen and her father have a\nlot in common.\nH. Incorrect. While this sentence from paragraph 25 shows Ellen's concern about the effect that\nher leaving the farm will have on her parents, it does not provide clear evidence that Ellen\nand her father have a lot in common.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q022-explanation-1.png\" alt=\"Official explanation for source question 22; original printed answer labels retained.\" width=\"686\"></p>",
    "points": 1,
    "prompt": "Which sentence from the excerpt provides evidence that Ellen has a lot in common with her father?",
    "promptHtml": "<p>Which sentence from the excerpt provides evidence that Ellen has a lot in common with her father?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“He’s the one who gets excited when I do about spring coming or a serial running in the magazine we’re both reading. . . .” (paragraph 1)</p>",
        "text": "“He’s the one who gets excited when I do about spring coming or a serial running in the magazine we’re both reading. . . .” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“ ‘We can drive you into town in the afternoon,’ Dad said, dropping his paper on the floor.” (paragraph 4)</p>",
        "text": "“ ‘We can drive you into town in the afternoon,’ Dad said, dropping his paper on the floor.” (paragraph 4)"
      },
      {
        "id": "C",
        "html": "<p>“ ‘Well, we don’t have to decide tonight,’ Dad said, but I knew he wanted to go into Clark City.” (paragraph 6)</p>",
        "text": "“ ‘Well, we don’t have to decide tonight,’ Dad said, but I knew he wanted to go into Clark City.” (paragraph 6)"
      },
      {
        "id": "D",
        "html": "<p>“I wondered how they would get along without me.” (paragraph 25)</p>",
        "text": "“I wondered how they would get along without me.” (paragraph 25)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-winter-wheat-2021-2022-form-a-pdf-shsat-2021-2022-a-q023",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "23",
      "pages": [
        15
      ]
    },
    "explanation": "The question asks how the sentences from paragraph 1 and paragraph 19 help develop a central\nidea of the excerpt.\nA. CORRECT. The sentences illustrate a practical aspect of Ellen’s mother’s personality and\nshow that she is concerned with an immediate task that needs to be completed. The details\nin these sentences help develop the central idea that practical people focus on current\nneeds—such as preparing food for the following day—rather than worrying about the future.\nB. Incorrect. These sentences do not show Ellen’s mother focusing on her daughter’s needs\nbefore her own, and the idea that parents consider their own needs only after considering\nthose of their children is not a central idea of the excerpt.\nC. Incorrect. Although the sentence from paragraph 19 shows Ellen’s mother planning a few\nhours ahead by preparing the next morning's breakfast, the idea that it is sometimes\nimportant to plan ahead is not a central idea of the excerpt, nor is it supported by the\nsentence from paragraph 1.\nD. Incorrect. The details in the sentences do not show that it is a waste of time to dream about\nthe future. The sentences highlight the tendency of Ellen’s mother to focus her attention on\nthe practical necessities of the moment, but the idea that dreaming about the future is a\nwaste of time is not a central idea of the excerpt.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q023-explanation-1.png\" alt=\"Official explanation for source question 23; original printed answer labels retained.\" width=\"686\"></p>",
    "points": 1,
    "prompt": "Read these sentences from the excerpt.\n\nMom seems to think of nothing farther away than today or perhaps yesterday or tomorrow morning. (paragraph 1)\n\nMom was fixing oatmeal for tomorrow morning. (paragraph 19)\n\nThe sentences help develop a central idea of the excerpt by",
    "promptHtml": "<p>Read these sentences from the excerpt.</p><blockquote><strong>Mom seems to think of nothing farther away than today or perhaps yesterday or tomorrow morning.</strong> (paragraph 1)<strong><br><br>Mom was fixing oatmeal for tomorrow morning.</strong> (paragraph 19)</blockquote><p>The sentences help develop a central idea of the excerpt by</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggesting that practical people focus on current needs rather than worrying about the future.</p>",
        "text": "suggesting that practical people focus on current needs rather than worrying about the future."
      },
      {
        "id": "B",
        "html": "<p>showing that parents tend to consider the needs of their children before thinking of themselves.</p>",
        "text": "showing that parents tend to consider the needs of their children before thinking of themselves."
      },
      {
        "id": "C",
        "html": "<p>revealing that it is sometimes important to plan ahead.</p>",
        "text": "revealing that it is sometimes important to plan ahead."
      },
      {
        "id": "D",
        "html": "<p>illustrating that dreaming about the future is a waste of time.</p>",
        "text": "illustrating that dreaming about the future is a waste of time."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-winter-wheat-2021-2022-form-a-pdf-shsat-2021-2022-a-q024",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "24",
      "pages": [
        15
      ]
    },
    "explanation": "The question asks how the flashback in paragraphs 10-24 affects the plot of the excerpt.\nE. Incorrect. The flashback does not show that Ellen and her mother faced extra work as a\nresult of the father’s trip to Vermont. Although paragraph 19 describes Ellen’s mother making\noatmeal for the next day’s breakfast, this task was not extra work.\nF. Incorrect. Although the flashback highlights Ellen’s fondness for each of her parents, it\ndescribes her father’s initial departure only and does not show what happened to the familial\nbond while he is away.\nG. Incorrect. Although Ellen describes the memory of her father’s departure as something she\nwanted to avoid thinking about, she does not fear that it will be too difficult to leave her\nparents. Instead, she is concerned about what will happen to her parents’ relationship when\nshe is no longer there.\nH. CORRECT. The flashback illustrates the close connection that Ellen has with her parents by\ndescribing her sadness over the departure of her father (“My throat ached all the way”\n[paragraph 15]) and presenting a moment of comfort and reassurance between Ellen and her\nmother (“She laid her hand against my face and it felt rough and hard but firm”\n[paragraph 20]).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q024-explanation-1.png\" alt=\"Official explanation for source question 24; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "The flashback in paragraphs 10–24 affects the plot by",
    "promptHtml": "<p>The flashback in paragraphs 10–24 affects the plot by</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>showing that the departure of one member of the family makes extra work for those left on the farm.</p>",
        "text": "showing that the departure of one member of the family makes extra work for those left on the farm."
      },
      {
        "id": "B",
        "html": "<p>showing that the bond within the family persists even when its members are apart.</p>",
        "text": "showing that the bond within the family persists even when its members are apart."
      },
      {
        "id": "C",
        "html": "<p>explaining why Ellen fears that leaving her parents will be too difficult.</p>",
        "text": "explaining why Ellen fears that leaving her parents will be too difficult."
      },
      {
        "id": "D",
        "html": "<p>illustrating the close connection Ellen has with both of her parents.</p>",
        "text": "illustrating the close connection Ellen has with both of her parents."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-winter-wheat-2021-2022-form-a-pdf-shsat-2021-2022-a-q025",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "25",
      "pages": [
        15
      ]
    },
    "explanation": "The question asks which sentence from the excerpt provides evidence that Mom wants Ellen to\nunderstand the family’s heritage.\nA. Incorrect. Although this sentence from paragraph 2 describes a domestic moment that takes\nplace within the family home, it does not relate to the heritage of either parent and therefore\ndoes not provide evidence that her mother wants Ellen to understand the family’s heritage.\nB. Incorrect. Although this sentence from paragraph 5 provides the name of the train station\nclosest to Ellen’s family’s farm, the train stop at Gotham is not related to the family’s\nheritage. Therefore, this sentence does not provide clear evidence that her mother wants\nEllen to understand the family’s heritage.\nC. Incorrect. Although this sentence from paragraph 7 describes an aspect of the family\ndynamic (Ellen predicts that while browsing in stores in town, “Dad [would go] one way and\nMom and I another”), their shopping habits do not provide clear evidence that her mother\nwants Ellen to understand the family’s heritage.\nD. CORRECT. In this sentence from paragraph 22, Ellen’s mother addresses her by the Russian\nversion of her name (Yeléna) and repeats her own Russian name (Anna Petrovna). The choice\nto call her daughter Yeléna instead of Ellen follows immediately after Ellen asks, “Mom, was\nthat really your name—what Dad called you?” (paragraph 21), and the mother's surprised\nresponse provides evidence that she both wants and expects Ellen to understand the family's\nRussian heritage.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q025-explanation-1.png\" alt=\"Official explanation for source question 25; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "Which sentence from the excerpt provides evidence that Mom wants Ellen to understand the family’s heritage?",
    "promptHtml": "<p>Which sentence from the excerpt provides evidence that Mom wants Ellen to understand the family’s heritage?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“Mom folded the ironing board and put it inside their bedroom that was just off the kitchen.” (paragraph 2)</p>",
        "text": "“Mom folded the ironing board and put it inside their bedroom that was just off the kitchen.” (paragraph 2)"
      },
      {
        "id": "B",
        "html": "<p>“ ‘There’s no need to go to town; she can catch the train at Gotham just as well.’ ” (paragraph 5)</p>",
        "text": "“ ‘There’s no need to go to town; she can catch the train at Gotham just as well.’ ” (paragraph 5)"
      },
      {
        "id": "C",
        "html": "<p>“We’d go in right after dinner and go around to the stores, Dad going one way and Mom and I another.” (paragraph 7)</p>",
        "text": "“We’d go in right after dinner and go around to the stores, Dad going one way and Mom and I another.” (paragraph 7)"
      },
      {
        "id": "D",
        "html": "<p>“ ‘Why, Yeléna, you know that; Anna Petrovna.’ ” (paragraph 22)</p>",
        "text": "“ ‘Why, Yeléna, you know that; Anna Petrovna.’ ” (paragraph 22)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const excerptFromWinterWheat20212022FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-winter-wheat-2021-2022-form-a",
  versionLabels: ["2021-2022 Form A"],
  label: "2021-2022 Form A",
  section: "reading",
  questionCount: excerptFromWinterWheat20212022FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-winter-wheat-2021-2022-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from <em>Winter Wheat</em>",
    blurbHtml: "<p><em>Ellen, the narrator, is preparing to leave her parents and the family farm for college the next</em> <em>day.</em></p>",
    sourceNoteHtml: "<p>From WINTER WHEAT by Mildred Walker, published by University of Nebraska Press. Copyright © 1944 by Harcourt, Brace and Company, Inc. Copyright renewed 1971 by Mildred Walker. All rights reserved.</p>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2021-2022-form-a","label":"2021-2022 Form A","year":"2021-2022","form":"A","packageId":"3a50329f5d7caa20b2af717889b7df6fb3382428c8b28c2eb547ccf876e28de2"},
    title: "Excerpt from Winter Wheat",
    author: "Mildred Walker",
    byline: "by Mildred Walker",
    blurb: "Ellen, the narrator, is preparing to leave her parents and the family farm for college the next day.",
    passageType: "literary",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">I love Dad’s way of talking that makes him seem different from other ranchers. He’s lived here twenty-three years, but he still says “back East where I come from.” He’s the one who gets excited when I do about spring coming or a <span data-glossary-definition=\"story published in short segments at regular intervals\" role=\"link\" tabindex=\"0\">serial</span> running in the magazine we’re both reading, but it’s what Mom says that I depend on. When Mom used to say “Don’t worry” about my pet chicken or dog or new calf, it always got well. Dad is always talking of going some place, not now, but next year, maybe. Mom seems to think of nothing farther away than today or perhaps yesterday or tomorrow morning.</p><p data-numbered=\"true\">Mom folded the ironing board and put it inside their bedroom that was just off the kitchen. She carried in the freshly ironed clothes. Dad went back to his paper. When Mom came back she took beans from the cupboard to soak for tomorrow. Dad always said Mom could make all the dishes he’d had back in Vermont as well as though she were a New Englander herself, instead of a Russian. All of a sudden, I realized that tomorrow when those beans would be ready to eat I’d be going away. It gave me a funny feeling.</p><p data-numbered=\"true\">“I’ll be taking the train tomorrow night,” I said aloud, more to hear it myself.</p><p data-numbered=\"true\">“We can drive you into town in the afternoon,” Dad said, dropping his paper on the floor.</p><p data-numbered=\"true\">“There’s no need to go to town; she can catch the train at Gotham just as well. We haven’t nothing to take us into town for,” Mom said.</p><p data-numbered=\"true\">“Well, we don’t have to decide tonight,” Dad said, but I knew he wanted to go into Clark City. It wouldn’t be so flat as just seeing me go off on the train from Gotham. My going away was hard on both of them; they were so different—and I was part of them both. It made me uncomfortable to think of leaving them.</p><p data-numbered=\"true\">While I was getting ready for bed in my room that’s off the front room, I saw how it would be if I left from town. We’d go in right after dinner and go around to the stores, Dad going one way and Mom and I another. Dad would probably have his hair cut at the barbershop and stop in the bank and meet someone he knew to talk to. Then we’d meet at the big store on the corner and go to the cafeteria for supper. The train stops ten minutes or so at the station in town and there are other people and excitement and you have time to wave from the platform and then again from your window by your seat. We went to the station in Clark City to see the Goodals off when they went back to Iowa.</p><p data-numbered=\"true\">If I left from Gotham, we’d just drive down in the truck and wait till the train came. It only stops long enough for you to get on and you hardly have time to taste the flavor of going away.</p><p data-numbered=\"true\">I sat on the bed in my pyjamas with my arms around my knees. I couldn’t keep from thinking of that time Dad went back East. I tried to, and then I just sat still and looked straight at it. Sometimes that’s better than working so hard to keep from looking at what’s in your mind.</p><p data-numbered=\"true\">Dad went all the way back to Vermont. . . . It was in November and it was already dark when the train came through Gotham. Even now, I could feel how cold and dark it was. I held Mom’s hand. Dad was so dressed-up he seemed strange. . . . We stood there without saying anything until Dad told Mom to remember to call Mr. Bardich, our neighbor, if the cow didn’t calve tomorrow.</p><p data-numbered=\"true\">“I’ll manage,” Mom snapped back.</p><p data-numbered=\"true\">“I wish you could go, Anna,” Dad said to Mom, “and we could take Ellen.” . . .</p><p data-numbered=\"true\">“Good-by, Anna Petrovna,” he said, looking at Mom. I had never heard him call her by two names before.</p><p data-numbered=\"true\">“Good-by,” Mom said, standing still, without smiling.</p><p data-numbered=\"true\">Then he was gone and the crossroads were darker than ever. The train light shone on the high window in the top of the grain elevator for a moment and then that too was dark. We got into our old Ford and Mom drove back to the house. My throat ached all the way. The name Dad had called Mom kept saying itself in my ears: “Anna Petrovna, Anna Petrovna.” . . .</p><p data-numbered=\"true\">Our house seemed lonely when we came back to it. It seemed to be hiding under the <span data-glossary-definition=\"small gulch or ravine\" role=\"link\" tabindex=\"0\">coulee</span>. I went with Mom to put the truck in the barn that was bigger than the house. I think Mom was prouder of our barn than the house, anyway. We walked back to look at the cow that was going to calve. She was just a big light blob in the dark, waiting. I had thought she was exciting this morning, but now she seemed sad, too.</p><p data-numbered=\"true\">The wind blew when we walked across the open space to the house and I couldn’t help shivering with the cold. Inside the house it was warm, but empty.</p><p data-numbered=\"true\">“Bring your nightgown in here and I heat you some milk,” Mom said.</p><p data-numbered=\"true\">I drank the milk sitting on a stool in front of the stove. It tasted good, but the lonely ache in my throat was still there. I picked up my clothes and hung them neatly behind the stove and put my cup on the sink board. Mom was fixing oatmeal for tomorrow morning.</p><p data-numbered=\"true\">“Good night, Mom,” I said almost timidly, standing beside her. She seemed wrapped around in a kind of strangeness. Then she turned around and drew me to her. The front of her dress was warm from the stove. I felt the comfortable heat through my gown. She laid her hand against my face and it felt rough and hard but firm. I dared ask her something I wanted to know.</p><p data-numbered=\"true\">“Mom, was that really your name—what Dad called you?”</p><p data-numbered=\"true\">Her voice sounded surprised. “Why, Yeléna, you know that; Anna Petrovna. You know I am born in Russia, in Seletskoe.”</p><p data-numbered=\"true\">“Yes, but I didn’t know your other name,” I said.</p><p data-numbered=\"true\">“Anna Petrovna Webb.” She pronounced it slowly. “Once I think what a funny name Ben Webb is!” She laughed. Her laugh was warm and low like our kitchen, and comfortable. The house seemed natural and right again. . . .</p><p data-numbered=\"true\">But now that I am grown, I feel the wall of strangeness between them, more than when I was a child. I wondered how they would get along without me.</p>",
    sourceNote: "From WINTER WHEAT by Mildred Walker, published by University of Nebraska Press. Copyright © 1944 by Harcourt, Brace and Company, Inc. Copyright renewed 1971 by Mildred Walker. All rights reserved.",
    text: excerptFromWinterWheat20212022FormAPassageText,
    versionLabel: "2021-2022 Form A",
  }),
  questions: excerptFromWinterWheat20212022FormAQuestions,
};
