import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheStoryOfMyLifeDigitalShsatPracticeTest2PassageText = "The morning after my teacher came she led me into her room and gave me a doll. The little blind children at the Perkins Institution had sent it and Laura Bridgman had dressed it; but I did not know this until afterward. When I had played with it a little while, Miss Sullivan slowly spelled into my hand the word \"d-o-l-l.\" I was at once interested in this finger play and tried to imitate it. When I finally succeeded in making the letters correctly I was flushed with childish pleasure and pride. Running downstairs to my mother I held up my hand and made the letters for doll. I did not know that I was spelling a word or even that words existed; I was simply making my fingers go in monkey-like imitation. In the days that followed I learned to spell in this uncomprehending way a great many words, among them pin, hat, cup and a few verbs like sit, stand and walk. But my teacher had been with me several weeks before I understood that everything has a name.\n\nOne day, while I was playing with my new doll, Miss Sullivan put my big rag doll into my lap also, spelled \"d-o-l-l\" and tried to make me understand that \"d-o-l-l\" applied to both. Earlier in the day we had had a tussle over the words \"m-u-g\" and \"w-a-t-e-r.\" Miss Sullivan had tried to impress it upon me that \"m-u-g\" is mug and that \"w-a-t-e-r\" is water, but I persisted in confounding the two. In despair she had dropped the subject for the time, only to renew it at the first opportunity. I became impatient at her repeated attempts and, seizing the new doll, I dashed it upon the floor. I was keenly delighted when I felt the fragments of the broken doll at my feet. Neither sorrow nor regret followed my passionate outburst. I had not loved the doll. In the still, dark world in which I lived there was no strong sentiment or tenderness. I felt my teacher sweep the fragments to one side of the hearth, and I had a sense of satisfaction that the cause of my discomfort was removed. She brought me my hat, and I knew I was going out into the warm sunshine. This thought, if a wordless sensation may be called a thought, made me hop and skip with pleasure.\n\nWe walked down the path to the well-house, attracted by the fragrance of the honeysuckle with which it was covered. Some one was drawing water and my teacher placed my hand under the spout. As the cool stream gushed over one hand she spelled into the other the word water, first slowly, then rapidly. I stood still, my whole attention fixed upon the motions of her fingers. Suddenly I felt a misty consciousness as of something forgotten--a thrill of returning thought; and somehow the mystery of language was revealed to me. I knew then that \"w-a-t-e-r\" meant the wonderful cool something that was flowing over my hand. That living word awakened my soul, gave it light, hope, joy, set it free! There were barriers still, it is true, but barriers that could in time be swept away.\n\nI left the well-house eager to learn. Everything had a name, and each name gave birth to a new thought. As we returned to the house every object which I touched seemed to quiver with life. That was because I saw everything with the strange, new sight that had come to me. On entering the door I remembered the doll I had broken. I felt my way to the hearth and picked up the pieces. I tried vainly to put them together. Then my eyes filled with tears; for I realized what I had done, and for the first time I felt repentance and sorrow.\n\nI learned a great many new words that day. I do not remember what they all were; but I do know that mother, father, sister, teacher were among them--words that were to make the world blossom for me, \"like Aaron's rod, with flowers.\" It would have been difficult to find a happier child than I was as I lay in my crib at the close of that eventful day and lived over the joys it had brought me, and for the first time longed for a new day to come.";

const excerptFromTheStoryOfMyLifeDigitalShsatPracticeTest2Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2-passage-1",
    "explanation": "Correct Answer: D\nExplanation: The author describes the water moment as one that gave her soul \"light, hope, joy\" and made her eager to learn every subsequent name, showing how one moment reshaped her whole outlook.\nA. Incorrect: The passage emphasizes a single transformative moment rather than a pattern of gradual, repeated practice.\nB. Incorrect: The passage credits the teacher's guidance at the well-house, not the author's own trial and error, for the breakthrough.\nC. Incorrect: The passage does not compare the reliability of physical senses to emotional understanding; it describes a moment of intellectual and emotional awakening.\nD. Correct: The well-house moment gave her soul \"light, hope, joy, set it free,\" showing how one instant transformed her entire relationship with the world.",
    "explanationHtml": "<p>Correct Answer: D <br><br>\nExplanation: The author describes the water moment as one that gave her soul &quot;light, hope, joy&quot; and made her eager to learn every subsequent name, showing how one moment reshaped her whole outlook. <br><br>\nA. Incorrect: The passage emphasizes a single transformative moment rather than a pattern of gradual, repeated practice. <br><br>\nB. Incorrect: The passage credits the teacher's guidance at the well-house, not the author's own trial and error, for the breakthrough. <br><br>\nC. Incorrect: The passage does not compare the reliability of physical senses to emotional understanding; it describes a moment of intellectual and emotional awakening. <br><br>\nD. Correct: The well-house moment gave her soul &quot;light, hope, joy, set it free,&quot; showing how one instant transformed her entire relationship with the world.</p>",
    "points": 1,
    "prompt": "Which theme is most strongly developed through the author's account of the well-house?",
    "promptHtml": "Which theme is <strong>most strongly</strong> developed through the author's account of the well-house?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Learning often requires patient repetition and many small failures before any real breakthrough finally occurs.",
        "text": "Learning often requires patient repetition and many small failures before any real breakthrough finally occurs."
      },
      {
        "id": "B",
        "html": "Children generally learn best when they are simply allowed to make and learn from their own mistakes.",
        "text": "Children generally learn best when they are simply allowed to make and learn from their own mistakes."
      },
      {
        "id": "C",
        "html": "Physical senses, especially touch, are ultimately less reliable guides than purely emotional understanding of the world.",
        "text": "Physical senses, especially touch, are ultimately less reliable guides than purely emotional understanding of the world."
      },
      {
        "id": "D",
        "html": "A single moment of sudden understanding can transform a person's whole relationship with the world.",
        "text": "A single moment of sudden understanding can transform a person's whole relationship with the world."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2-passage-2",
    "explanation": "Correct Answer: D\nExplanation: The author explicitly notes she felt no sorrow at the time she broke the doll but wept over the same broken pieces once she understood language, underscoring the contrast the passage builds toward.\nA. Incorrect: The passage does not suggest she lacked any capacity for kindness; it shows she simply could not yet grasp the meaning of her actions.\nB. Incorrect: The passage does not criticize her teacher's early methods; it uses the doll to highlight the author's own changed understanding.\nC. Incorrect: The passage gives no indication that her teacher stopped giving her toys afterward.\nD. Correct: She felt no sorrow when she broke the doll but wept over the pieces afterward, highlighting how differently she experienced the world once she understood language.",
    "explanationHtml": "<p>Correct Answer: D <br><br>\nExplanation: The author explicitly notes she felt no sorrow at the time she broke the doll but wept over the same broken pieces once she understood language, underscoring the contrast the passage builds toward. <br><br>\nA. Incorrect: The passage does not suggest she lacked any capacity for kindness; it shows she simply could not yet grasp the meaning of her actions. <br><br>\nB. Incorrect: The passage does not criticize her teacher's early methods; it uses the doll to highlight the author's own changed understanding. <br><br>\nC. Incorrect: The passage gives no indication that her teacher stopped giving her toys afterward. <br><br>\nD. Correct: She felt no sorrow when she broke the doll but wept over the pieces afterward, highlighting how differently she experienced the world once she understood language.</p>",
    "points": 1,
    "prompt": "Why does the author most likely include the detail about breaking the doll before describing the well-house scene?",
    "promptHtml": "Why does the author <strong>most likely</strong> include the detail about breaking the doll before describing the well-house scene?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "To show that she had no capacity for kindness before she learned language.",
        "text": "To show that she had no capacity for kindness before she learned language."
      },
      {
        "id": "B",
        "html": "To suggest that her teacher's early methods were poorly suited to a child of her particular age and temperament.",
        "text": "To suggest that her teacher's early methods were poorly suited to a child of her particular age and temperament."
      },
      {
        "id": "C",
        "html": "To explain why her teacher eventually stopped giving her toys to play with.",
        "text": "To explain why her teacher eventually stopped giving her toys to play with."
      },
      {
        "id": "D",
        "html": "To highlight, through contrast, how differently she experienced the world once she grasped that things had names.",
        "text": "To highlight, through contrast, how differently she experienced the world once she grasped that things had names."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2-passage-3",
    "explanation": "Correct Answer: A\nExplanation: The figurative language describes an inner transformation, not a physical sensation, marking the instant she grasped that language could connect her to everything she touched.\nA. Correct: The figurative language marks the moment she realized that objects had names, finally giving her a way to connect her mind to the world.\nB. Incorrect: The passage centers on the author's realization about language and meaning, not a discovery about her teacher's feelings.\nC. Incorrect: The description is figurative, describing an inward realization, not an actual physical effect of the water itself.\nD. Incorrect: The passage does not suggest touch became unnecessary; touch remains central to how she learns and experiences the world.",
    "explanationHtml": "<p>Correct Answer: A <br><br>\nExplanation: The figurative language describes an inner transformation, not a physical sensation, marking the instant she grasped that language could connect her to everything she touched. <br><br>\nA. Correct: The figurative language marks the moment she realized that objects had names, finally giving her a way to connect her mind to the world. <br><br>\nB. Incorrect: The passage centers on the author's realization about language and meaning, not a discovery about her teacher's feelings. <br><br>\nC. Incorrect: The description is figurative, describing an inward realization, not an actual physical effect of the water itself. <br><br>\nD. Incorrect: The passage does not suggest touch became unnecessary; touch remains central to how she learns and experiences the world.</p>",
    "points": 1,
    "prompt": "What does the author most likely mean by describing the word \"water\" as something that \"awakened my soul, gave it light, hope, joy, set it free\"?",
    "promptHtml": "What does the author <strong>most likely</strong> mean by describing the word &quot;water&quot; as something that &quot;awakened my soul, gave it light, hope, joy, set it free&quot;?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Understanding that objects had names finally gave her a way to connect her mind to the world.",
        "text": "Understanding that objects had names finally gave her a way to connect her mind to the world."
      },
      {
        "id": "B",
        "html": "She realized for the first time that her teacher genuinely and deeply cared about her well-being.",
        "text": "She realized for the first time that her teacher genuinely and deeply cared about her well-being."
      },
      {
        "id": "C",
        "html": "The water itself had a genuinely calming, almost magical physical effect on her body and mind.",
        "text": "The water itself had a genuinely calming, almost magical physical effect on her body and mind."
      },
      {
        "id": "D",
        "html": "She no longer needed her sense of touch at all once she learned to spell out words.",
        "text": "She no longer needed her sense of touch at all once she learned to spell out words."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2-passage-4",
    "explanation": "Correct Answer: C\nExplanation: The passage moves chronologically from finger-spelling games through the broken doll to the well-house breakthrough, then briefly reflects on the day's lasting effect.\nA. Incorrect: The passage does not compare two teaching methods; it follows a single sequence of events leading to one breakthrough.\nB. Incorrect: The passage does not open with a general claim supported by statistics; it narrates a personal sequence of events.\nC. Correct: The passage narrates small events building toward the well-house breakthrough, then briefly reflects on what followed.\nD. Incorrect: The passage is told entirely from the author's own perspective, not alternating with her teacher's.",
    "explanationHtml": "<p>Correct Answer: C <br><br>\nExplanation: The passage moves chronologically from finger-spelling games through the broken doll to the well-house breakthrough, then briefly reflects on the day's lasting effect. <br><br>\nA. Incorrect: The passage does not compare two teaching methods; it follows a single sequence of events leading to one breakthrough. <br><br>\nB. Incorrect: The passage does not open with a general claim supported by statistics; it narrates a personal sequence of events. <br><br>\nC. Correct: The passage narrates small events building toward the well-house breakthrough, then briefly reflects on what followed. <br><br>\nD. Incorrect: The passage is told entirely from the author's own perspective, not alternating with her teacher's.</p>",
    "points": 1,
    "prompt": "Which choice best describes how the passage is primarily structured, from its opening description of finger-spelling games to its closing reflection on that day?",
    "promptHtml": "Which choice <strong>best</strong> describes how the passage is primarily structured, from its opening description of finger-spelling games to its closing reflection on that day?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It compares two entirely different teaching methods before concluding at the end which one actually worked better.",
        "text": "It compares two entirely different teaching methods before concluding at the end which one actually worked better."
      },
      {
        "id": "B",
        "html": "It presents a broad general claim about language and then supports that claim with detailed statistics.",
        "text": "It presents a broad general claim about language and then supports that claim with detailed statistics."
      },
      {
        "id": "C",
        "html": "It narrates a sequence of small events building toward one turning point, then briefly reflects on what followed.",
        "text": "It narrates a sequence of small events building toward one turning point, then briefly reflects on what followed."
      },
      {
        "id": "D",
        "html": "It moves back and forth repeatedly between the author's own perspective and her teacher's perspective on the same events.",
        "text": "It moves back and forth repeatedly between the author's own perspective and her teacher's perspective on the same events."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2-passage-5",
    "explanation": "Correct Answer: D\nExplanation: The passage states she learned to spell words \"in this uncomprehending way,\" imitating finger motions without knowing that words existed, which changes only at the well-house.\nA. Incorrect: Before the well-house scene, the passage indicates she did not yet grasp that words had meaning at all.\nB. Incorrect: The passage shows the author cooperating with her lessons, not refusing to participate.\nC. Incorrect: The passage never mentions reading; before the well-house scene she was only imitating finger spelling without understanding it.\nD. Correct: She spelled words \"in this uncomprehending way\" beforehand, imitating motions without yet grasping that they stood for objects.",
    "explanationHtml": "<p>Correct Answer: D <br><br>\nExplanation: The passage states she learned to spell words &quot;in this uncomprehending way,&quot; imitating finger motions without knowing that words existed, which changes only at the well-house. <br><br>\nA. Incorrect: Before the well-house scene, the passage indicates she did not yet grasp that words had meaning at all. <br><br>\nB. Incorrect: The passage shows the author cooperating with her lessons, not refusing to participate. <br><br>\nC. Incorrect: The passage never mentions reading; before the well-house scene she was only imitating finger spelling without understanding it. <br><br>\nD. Correct: She spelled words &quot;in this uncomprehending way&quot; beforehand, imitating motions without yet grasping that they stood for objects.</p>",
    "points": 1,
    "prompt": "What can be inferred about the author's understanding of language before the well-house scene?",
    "promptHtml": "What can be inferred about the author's understanding of language before the well-house scene?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "She understood that words carried meaning but stubbornly resisted learning any new ones from her teacher.",
        "text": "She understood that words carried meaning but stubbornly resisted learning any new ones from her teacher."
      },
      {
        "id": "B",
        "html": "She refused outright to cooperate with her teacher's lessons because she was frustrated and tired.",
        "text": "She refused outright to cooperate with her teacher's lessons because she was frustrated and tired."
      },
      {
        "id": "C",
        "html": "She had already learned to read simple full sentences well before this particular scene took place.",
        "text": "She had already learned to read simple full sentences well before this particular scene took place."
      },
      {
        "id": "D",
        "html": "She could spell many words already but did not yet grasp that the motions stood for real objects.",
        "text": "She could spell many words already but did not yet grasp that the motions stood for real objects."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2-passage-6",
    "explanation": "Correct Answer: D\nExplanation: The passage frames the realization as an abrupt shift -- a fleeting sensation followed at once by full understanding -- rather than a slow accumulation of knowledge.\nA. Incorrect: How long the teacher had already been present says nothing about whether the realization itself was sudden or gradual.\nB. Incorrect: Learning to spell words without understanding them describes the slow period before the breakthrough, not the speed of the breakthrough itself.\nC. Incorrect: The earlier struggle over \"m-u-g\" and \"w-a-t-e-r\" shows her confusion before the well-house, not how quickly her understanding arrived.\nD. Correct: The fleeting, misty sense of something forgotten followed immediately by full understanding shows the realization was sudden.",
    "explanationHtml": "<p>Correct Answer: D <br><br>\nExplanation: The passage frames the realization as an abrupt shift -- a fleeting sensation followed at once by full understanding -- rather than a slow accumulation of knowledge. <br><br>\nA. Incorrect: How long the teacher had already been present says nothing about whether the realization itself was sudden or gradual. <br><br>\nB. Incorrect: Learning to spell words without understanding them describes the slow period before the breakthrough, not the speed of the breakthrough itself. <br><br>\nC. Incorrect: The earlier struggle over &quot;m-u-g&quot; and &quot;w-a-t-e-r&quot; shows her confusion before the well-house, not how quickly her understanding arrived. <br><br>\nD. Correct: The fleeting, misty sense of something forgotten followed immediately by full understanding shows the realization was sudden.</p>",
    "points": 1,
    "prompt": "Which detail from the passage best supports the claim that the author's realization at the well-house was sudden rather than gradual?",
    "promptHtml": "Which detail from the passage <strong>best</strong> supports the claim that the author's realization at the well-house was sudden rather than gradual?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Her teacher had already been living and working with her for several weeks before this scene occurs.",
        "text": "Her teacher had already been living and working with her for several weeks before this scene occurs."
      },
      {
        "id": "B",
        "html": "In the days after the doll lesson, she learned to spell words such as pin, hat, and cup in an uncomprehending way.",
        "text": "In the days after the doll lesson, she learned to spell words such as pin, hat, and cup in an uncomprehending way."
      },
      {
        "id": "C",
        "html": "Earlier that same day, she and her teacher had struggled over the words &quot;m-u-g&quot; and &quot;w-a-t-e-r.&quot;",
        "text": "Earlier that same day, she and her teacher had struggled over the words \"m-u-g\" and \"w-a-t-e-r.\""
      },
      {
        "id": "D",
        "html": "She describes a fleeting, misty sense of something forgotten, then immediately knows what &quot;water&quot; meant.",
        "text": "She describes a fleeting, misty sense of something forgotten, then immediately knows what \"water\" meant."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2-passage-7",
    "explanation": "Correct Answer: B\nExplanation: The passage builds toward the well-house moment where language finally connects to meaning for the author, which is the central event the whole excerpt leads to and reflects on.\nA. Incorrect: The broken-doll detail is one supporting moment, not the passage's overall central idea.\nB. Correct: The passage centers on the teacher's patience finally helping the author grasp that words name real things, reshaping her experience of the world.\nC. Incorrect: Spelling words by imitation is an early step described in the passage, but the passage centers on the moment those words finally gained meaning.\nD. Incorrect: The passage does not describe any family separation or reunion.",
    "explanationHtml": "<p>Correct Answer: B <br><br>\nExplanation: The passage builds toward the well-house moment where language finally connects to meaning for the author, which is the central event the whole excerpt leads to and reflects on. <br><br>\nA. Incorrect: The broken-doll detail is one supporting moment, not the passage's overall central idea. <br><br>\nB. Correct: The passage centers on the teacher's patience finally helping the author grasp that words name real things, reshaping her experience of the world. <br><br>\nC. Incorrect: Spelling words by imitation is an early step described in the passage, but the passage centers on the moment those words finally gained meaning. <br><br>\nD. Incorrect: The passage does not describe any family separation or reunion.</p>",
    "points": 1,
    "prompt": "Which sentence best states the central idea of the passage?",
    "promptHtml": "Which sentence <strong>best</strong> states the central idea of the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "A young girl's frustration over a broken toy doll teaches her an early lesson about kindness.",
        "text": "A young girl's frustration over a broken toy doll teaches her an early lesson about kindness."
      },
      {
        "id": "B",
        "html": "A teacher's patient persistence finally helps a child grasp that words name real things around her.",
        "text": "A teacher's patient persistence finally helps a child grasp that words name real things around her."
      },
      {
        "id": "C",
        "html": "A child learns to spell many new words, such as pin, hat, and cup, by imitating her teacher's finger motions.",
        "text": "A child learns to spell many new words, such as pin, hat, and cup, by imitating her teacher's finger motions."
      },
      {
        "id": "D",
        "html": "A family is finally reunited after a long separation that was caused by a serious illness.",
        "text": "A family is finally reunited after a long separation that was caused by a serious illness."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromTheStoryOfMyLifeDigitalShsatPracticeTest2PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromTheStoryOfMyLifeDigitalShsatPracticeTest2Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from \"The Story of My Life\"",
    author: "Helen Keller",
    blurb: "Helen Keller (1880-1968) was an American author and lecturer who became deaf and blind in early childhood. The following is adapted from Chapter IV of her 1903 autobiography The Story of My Life, describing the day her teacher, Anne Sullivan, first taught her the connection between words and objects.",
    passageType: "informational",
    passageCategory: "prestige",
    richText: "<p>The morning after my teacher came she led me into her room and gave me a doll. The little blind children at the Perkins Institution had sent it and Laura Bridgman had dressed it; but I did not know this until afterward. When I had played with it a little while, Miss Sullivan slowly spelled into my hand the word &quot;d-o-l-l.&quot; I was at once interested in this finger play and tried to imitate it. When I finally succeeded in making the letters correctly I was flushed with childish pleasure and pride. Running downstairs to my mother I held up my hand and made the letters for doll. I did not know that I was spelling a word or even that words existed; I was simply making my fingers go in monkey-like imitation. In the days that followed I learned to spell in this uncomprehending way a great many words, among them pin, hat, cup and a few verbs like sit, stand and walk. But my teacher had been with me several weeks before I understood that everything has a name.</p><p>One day, while I was playing with my new doll, Miss Sullivan put my big rag doll into my lap also, spelled &quot;d-o-l-l&quot; and tried to make me understand that &quot;d-o-l-l&quot; applied to both. Earlier in the day we had had a tussle over the words &quot;m-u-g&quot; and &quot;w-a-t-e-r.&quot; Miss Sullivan had tried to impress it upon me that &quot;m-u-g&quot; is mug and that &quot;w-a-t-e-r&quot; is water, but I persisted in confounding the two. In despair she had dropped the subject for the time, only to renew it at the first opportunity. I became impatient at her repeated attempts and, seizing the new doll, I dashed it upon the floor. I was keenly delighted when I felt the fragments of the broken doll at my feet. Neither sorrow nor regret followed my passionate outburst. I had not loved the doll. In the still, dark world in which I lived there was no strong sentiment or tenderness. I felt my teacher sweep the fragments to one side of the hearth, and I had a sense of satisfaction that the cause of my discomfort was removed. She brought me my hat, and I knew I was going out into the warm sunshine. This thought, if a wordless sensation may be called a thought, made me hop and skip with pleasure.</p><p>We walked down the path to the well-house, attracted by the fragrance of the honeysuckle with which it was covered. Some one was drawing water and my teacher placed my hand under the spout. As the cool stream gushed over one hand she spelled into the other the word water, first slowly, then rapidly. I stood still, my whole attention fixed upon the motions of her fingers. Suddenly I felt a misty consciousness as of something forgotten--a thrill of returning thought; and somehow the mystery of language was revealed to me. I knew then that &quot;w-a-t-e-r&quot; meant the wonderful cool something that was flowing over my hand. That living word awakened my soul, gave it light, hope, joy, set it free! There were barriers still, it is true, but barriers that could in time be swept away.</p><p>I left the well-house eager to learn. Everything had a name, and each name gave birth to a new thought. As we returned to the house every object which I touched seemed to quiver with life. That was because I saw everything with the strange, new sight that had come to me. On entering the door I remembered the doll I had broken. I felt my way to the hearth and picked up the pieces. I tried vainly to put them together. Then my eyes filled with tears; for I realized what I had done, and for the first time I felt repentance and sorrow.</p><p>I learned a great many new words that day. I do not remember what they all were; but I do know that mother, father, sister, teacher were among them--words that were to make the world blossom for me, &quot;like Aaron's rod, with flowers.&quot; It would have been difficult to find a happier child than I was as I lay in my crib at the close of that eventful day and lived over the joys it had brought me, and for the first time longed for a new day to come.</p>",
    text: excerptFromTheStoryOfMyLifeDigitalShsatPracticeTest2PassageText,
    versionLabel: "Digital SHSAT Practice Test 2",
  }),
  questions: excerptFromTheStoryOfMyLifeDigitalShsatPracticeTest2Questions,
};
