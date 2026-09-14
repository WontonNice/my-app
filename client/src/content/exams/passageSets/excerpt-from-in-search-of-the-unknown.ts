import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromInSearchOfTheUnknownPassageText = "It was at that time the policy of the trustees and officers of the Zoological Gardens neither to employ collectors nor to send out expeditions in search of specimens. The society decided to depend upon voluntary contributions, and I was always busy, part of the day, in dictating answers to correspondents who wrote offering their services as hunters of big game, collectors of all sorts of fauna, trappers, snarers, and also to those who offered specimens for sale, usually at exorbitant rates.\n\nTo the proprietors of . . . mangy lynxes, moth-eaten coyotes, and dancing bears I returned courteous but uncompromising refusals—of course, first submitting all such letters, together with my replies, to Professor Farrago.\n\nOne day towards the end of May, however, just as I was leaving Bronx Park to return to town, Professor Lesard, of the reptilian department, called out to me that Professor Farrago wanted to see me a moment; so I . . . retraced my steps to the temporary, wooden building occupied by Professor Farrago, general superintendent of the Zoological Gardens. The professor, who was sitting at his desk before a pile of letters and replies submitted for approval by me, pushed his glasses down and looked over them at me with a whimsical smile that suggested amusement, impatience, annoyance, and perhaps a faint trace of apology.\n\n“Now, here’s a letter,” he said, with a deliberate gesture towards a sheet of paper impaled on a file—“a letter that I suppose you remember.” He disengaged the sheet of paper and handed it to me.\n\n“Oh yes,” I replied, with a shrug; “of course the man is mistaken—or—”\n\n“Or what?” demanded Professor Farrago, tranquilly, wiping his glasses.\n\n“—Or a liar,” I replied.\n\n8 After a silence he leaned back in his chair and bade me read the letter to him again, and I did so with a contemptuous tolerance for the writer, who must have been either a very innocent victim or a very stupid swindler. I said as much to Professor Farrago, but, to my surprise, he appeared to waver.\n\n9 “I suppose,” he said, with his near-sighted, embarrassed smile, “that nine hundred and ninety-nine men in a thousand would throw that letter aside and condemn the writer as a liar or a fool?”\n\n10 “In my opinion,” said I, “he’s one or the other.”\n\n11 “He isn’t—in mine,” said the professor, placidly.\n\n12 “What!” I exclaimed. “Here is a man living all alone on a strip of rock and sand between the wilderness and the sea, who wants you to send somebody to take charge of a bird that doesn’t exist!”\n\n13 “How do you know,” asked Professor Farrago, “that the bird in question does not exist?”\n\n14 “It is generally accepted,” I replied, sarcastically, “that the great auk has been extinct for years. Therefore I may be pardoned for doubting that our correspondent possesses a pair of them alive.”\n\n“Oh, you young fellows,” said the professor, smiling wearily, “you embark on a theory for destinations that don’t exist.”\n\nHe leaned back in his chair, his amused eyes searching space for the imagery that made him smile.\n\n“Like swimming squirrels, you navigate with the help of Heaven and a stiff breeze, but you never land where you hope to—do you?”\n\nRather red in the face, I said: “Don’t you believe the great auk to be extinct?”\n\n“Audubon saw the great auk.”\n\n“Who has seen a single specimen since?”\n\n“Nobody—except our correspondent here,” he replied, laughing.\n\nI laughed, too, considering the interview at an end, but the professor went on, coolly:\n\n“Whatever it is that our correspondent has—and I am daring to believe that it is the great auk itself—I want you to secure it for the society.”\n\nWhen my astonishment subsided my first conscious sentiment was one of pity. Clearly, Professor Farrago was on the verge of dotage—ah, what a loss to the world!\n\nI believe now that Professor Farrago perfectly interpreted my thoughts, but he betrayed neither resentment nor impatience. I drew a chair up beside his desk—there was nothing to do but to obey, and this fool’s errand was none of my conceiving.\n\nTogether we made out a list of articles necessary for me and itemized the expenses I might incur, and I set a date for my return, allowing no margin for a successful termination to the expedition.\n\n“Never mind that,” said the professor. “What I want you to do is to get those birds here safely. Now, how many men will you take?”\n\n“None,” I replied, bluntly; “it’s a useless expense, unless there is something to bring back. If there is I’ll wire you, you may be sure.”\n\n“Very well,” said Professor Farrago, good-humoredly, “you shall have all the assistance you may require. Can you leave to-night?”\n\nThe old gentleman was certainly prompt. I nodded, half-sulkily, aware of his amusement.\n\n“So,” I said, picking up my hat, “I am to start north to find a place called Black Harbor, where there is a man named Halyard who possesses, among other household utensils, two extinct great auks—”\n\nWe were both laughing by this time. I asked him why on earth he credited the assertion of a man he had never before heard of.\n\n“I suppose,” he replied, with the same half-apologetic, half-humorous smile, “it is instinct. I feel, somehow, that this man Halyard has got an auk—perhaps two. I can’t get away from the idea that we are on the eve of acquiring the rarest of living creatures. It’s odd for a scientist to talk as I do; doubtless you’re shocked—admit it, now!”\n\nBut I was not shocked; on the contrary, I was conscious that the same strange hope that Professor Farrago cherished was beginning, in spite of me, to stir my pulses, too.\n\n“If he has—” I began, then stopped.\n\nThe professor and I looked hard at each other in silence.\n\n“Go on,” he said, encouragingly.\n\nBut I had nothing more to say, for the prospect of beholding with my own eyes a living specimen of the great auk produced a series of conflicting emotions within me which rendered speech profanely superfluous.";

const excerptFromInSearchOfTheUnknownQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-in-search-of-the-unknown-1",
    "points": 1,
    "prompt": "Read paragraph 2 from the excerpt.\nTo the proprietors of . . . mangy lynxes, moth-eaten coyotes, and dancing bears I returned courteous but uncompromising refusals—of course, first submitting all such letters, together with my replies, to Professor Farrago.\nThis paragraph helps develop the plot by establishing that the narrator",
    "promptHtml": "Read&nbsp;paragraph&nbsp;2 from the excerpt.<br><strong>To the proprietors of . . . mangy lynxes, moth-eaten coyotes, and dancing bears I returned courteous but uncompromising&nbsp;refusals—of course, first submitting all such letters, together with my replies, to&nbsp;Professor Farrago.</strong><br>This paragraph&nbsp;helps&nbsp;develop the&nbsp;plot&nbsp;by establishing that the&nbsp;narrator",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "dislikes writing refusal letters for the animals offered to the zoological society.",
        "text": "dislikes writing refusal letters for the animals offered to the zoological society."
      },
      {
        "id": "B",
        "html": "attempts to&nbsp;predict&nbsp;what&nbsp;the professor would say in the refusal letters.",
        "text": "attempts to predict what the professor would say in the refusal letters."
      },
      {
        "id": "C",
        "html": "believes that many of the animals offered are not acceptable for the zoological society.",
        "text": "believes that many of the animals offered are not acceptable for the zoological society."
      },
      {
        "id": "D",
        "html": "resents the professor’s insistence on reviewing the refusal letters.",
        "text": "resents the professor’s insistence on reviewing the refusal letters."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-in-search-of-the-unknown-2",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\nThe professor, who was sitting at his desk before a pile of letters and replies submitted for approval by me, pushed his glasses down and looked over them at me with a whimsical smile that suggested amusement, impatience, annoyance, and perhaps a faint trace of apology.\nWhat does the phrase “a faint trace of apology” convey about the professor?",
    "promptHtml": "Read&nbsp;this&nbsp;sentence&nbsp;from&nbsp;paragraph&nbsp;3.<br><strong>The professor, who was sitting at his desk before a pile of letters and replies submitted for approval by me, pushed his glasses down and looked over them at me with a whimsical smile that suggested amusement, impatience, annoyance, and perhaps a faint trace of apology.</strong><br>What&nbsp;does the&nbsp;phrase&nbsp;“a faint trace of apology” convey about the professor?",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "It indicates that the professor feels bad that he has to call the&nbsp;narrator&nbsp;to his office after work.",
        "text": "It indicates that the professor feels bad that he has to call the narrator to his office after work."
      },
      {
        "id": "B",
        "html": "It&nbsp;shows&nbsp;that the professor is hesitant to share his&nbsp;opinions&nbsp;with&nbsp;the&nbsp;narrator.",
        "text": "It shows that the professor is hesitant to share his opinions with the narrator."
      },
      {
        "id": "C",
        "html": "It implies that the professor is uncomfortable criticizing the&nbsp;narrator’s&nbsp;work.",
        "text": "It implies that the professor is uncomfortable criticizing the narrator’s work."
      },
      {
        "id": "D",
        "html": "It suggests that the professor knows that the conversation will be frustrating for the&nbsp;narrator.",
        "text": "It suggests that the professor knows that the conversation will be frustrating for the narrator."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-in-search-of-the-unknown-3",
    "points": 1,
    "prompt": "How does the exchange between the professor and the narrator in paragraphs 8–11 contribute to the development of the characters?",
    "promptHtml": "How&nbsp;does the exchange between the professor and the&nbsp;narrator&nbsp;in&nbsp;paragraphs&nbsp;8–11&nbsp;contribute to the development of the&nbsp;characters?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "It establishes the&nbsp;conflict&nbsp;between the professor and the&nbsp;narrator&nbsp;concerning the validity of&nbsp;the letter.",
        "text": "It establishes the conflict between the professor and the narrator concerning the validity of the letter."
      },
      {
        "id": "B",
        "html": "It suggests a&nbsp;theme&nbsp;of collaboration&nbsp;because&nbsp;the&nbsp;narrator&nbsp;and the professor regularly&nbsp;work together.",
        "text": "It suggests a theme of collaboration because the narrator and the professor regularly work together."
      },
      {
        "id": "C",
        "html": "It reveals the&nbsp;characters’ traits by contrasting the&nbsp;narrator’s&nbsp;distrust&nbsp;with&nbsp;how&nbsp;easily the professor is deceived by&nbsp;what&nbsp;he reads.",
        "text": "It reveals the characters’ traits by contrasting the narrator’s distrust with how easily the professor is deceived by what he reads."
      },
      {
        "id": "D",
        "html": "It hints that the&nbsp;resolution&nbsp;will involve the&nbsp;narrator&nbsp;accepting the professor’s&nbsp;opinion&nbsp;about the content of the letter.",
        "text": "It hints that the resolution will involve the narrator accepting the professor’s opinion about the content of the letter."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-in-search-of-the-unknown-4",
    "points": 1,
    "prompt": "The professor’s observations in paragraphs 15–17 create tension in the excerpt by causing the narrator to feel",
    "promptHtml": "The professor’s observations in&nbsp;paragraphs&nbsp;15–17&nbsp;create tension in the excerpt by causing the&nbsp;narrator&nbsp;to feel",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "flustered by the professor’s criticism of his logic.",
        "text": "flustered by the professor’s criticism of his logic."
      },
      {
        "id": "B",
        "html": "annoyed by the professor’s sarcasm about his inexperience.",
        "text": "annoyed by the professor’s sarcasm about his inexperience."
      },
      {
        "id": "C",
        "html": "confused by the professor’s lack of respect for his&nbsp;opinion.",
        "text": "confused by the professor’s lack of respect for his opinion."
      },
      {
        "id": "D",
        "html": "frustrated by the professor’s lack of interest in his theory.",
        "text": "frustrated by the professor’s lack of interest in his theory."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-in-search-of-the-unknown-5",
    "points": 1,
    "prompt": "How does the interaction between the narrator and the professor in paragraphs 26–28 contribute to the development of the theme?",
    "promptHtml": "How&nbsp;does the interaction between the&nbsp;narrator&nbsp;and the professor in&nbsp;paragraphs&nbsp;26–28&nbsp;contribute to the development of the&nbsp;theme?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It&nbsp;illustrates&nbsp;the professor’s patience as the&nbsp;narrator&nbsp;argues against making the expedition.",
        "text": "It illustrates the professor’s patience as the narrator argues against making the expedition."
      },
      {
        "id": "B",
        "html": "It reveals the&nbsp;narrator’s&nbsp;frustration&nbsp;with&nbsp;his limited&nbsp;role&nbsp;in making decisions for the&nbsp;zoological society.",
        "text": "It reveals the narrator’s frustration with his limited role in making decisions for the zoological society."
      },
      {
        "id": "C",
        "html": "It emphasizes the professor’s desire to acquire new specimens for the zoological society at&nbsp;any cost.",
        "text": "It emphasizes the professor’s desire to acquire new specimens for the zoological society at any cost."
      },
      {
        "id": "D",
        "html": "It&nbsp;shows&nbsp;the&nbsp;narrator’s&nbsp;acceptance of his assignment despite his personal objections.",
        "text": "It shows the narrator’s acceptance of his assignment despite his personal objections."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-in-search-of-the-unknown-6",
    "points": 1,
    "prompt": "Which sentence from the excerpt best explains why the professor is eager to send the narrator on an expedition?",
    "promptHtml": "Which&nbsp;sentence&nbsp;from the excerpt&nbsp;<strong>best</strong>&nbsp;explains&nbsp;why&nbsp;the professor is eager to send the&nbsp;narrator&nbsp;on an expedition?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“I believe now that&nbsp;Professor Farrago&nbsp;perfectly interpreted my thoughts, but he betrayed neither resentment nor impatience.”&nbsp;(paragraph&nbsp;25)",
        "text": "“I believe now that Professor Farrago perfectly interpreted my thoughts, but he betrayed neither resentment nor impatience.” (paragraph 25)"
      },
      {
        "id": "B",
        "html": "“Together we made out a list of articles necessary for me and itemized the expenses I might incur, and I set a date for my return, allowing no margin for a successful termination to the expedition.”&nbsp;(paragraph&nbsp;26)",
        "text": "“Together we made out a list of articles necessary for me and itemized the expenses I might incur, and I set a date for my return, allowing no margin for a successful termination to the expedition.” (paragraph 26)"
      },
      {
        "id": "C",
        "html": "“ ‘What I want you to do is to get those birds here&nbsp;safely.’ ”&nbsp;(paragraph&nbsp;27)",
        "text": "“ ‘What I want you to do is to get those birds here safely.’ ” (paragraph 27)"
      },
      {
        "id": "D",
        "html": "“ ‘I can’t get away from the idea that we are on the eve of acquiring the rarest of living&nbsp;creatures.’ ”&nbsp;(paragraph&nbsp;33)",
        "text": "“ ‘I can’t get away from the idea that we are on the eve of acquiring the rarest of living creatures.’ ” (paragraph 33)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-in-search-of-the-unknown-7",
    "points": 1,
    "prompt": "How does paragraph 34 help develop the plot of the excerpt?",
    "promptHtml": "How&nbsp;does&nbsp;paragraph&nbsp;34&nbsp;help&nbsp;develop the&nbsp;plot&nbsp;of the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "It&nbsp;shows&nbsp;that the&nbsp;narrator&nbsp;is&nbsp;beginning&nbsp;to consider the possibility of finding the great auks.",
        "text": "It shows that the narrator is beginning to consider the possibility of finding the great auks."
      },
      {
        "id": "B",
        "html": "It&nbsp;demonstrates&nbsp;that the&nbsp;narrator&nbsp;is struggling to understand&nbsp;why&nbsp;the professor thinks the great auks exist.",
        "text": "It demonstrates that the narrator is struggling to understand why the professor thinks the great auks exist."
      },
      {
        "id": "C",
        "html": "It establishes that the&nbsp;narrator&nbsp;is willing to let the professor overrule him about the great auks.",
        "text": "It establishes that the narrator is willing to let the professor overrule him about the great auks."
      },
      {
        "id": "D",
        "html": "It emphasizes that the&nbsp;narrator&nbsp;feels a sense of urgency to complete the expedition to locate the great auks.",
        "text": "It emphasizes that the narrator feels a sense of urgency to complete the expedition to locate the great auks."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-in-search-of-the-unknown-8",
    "points": 1,
    "prompt": "Which sentence best demonstrates the professional relationship between the narrator and the professor?",
    "promptHtml": "Which&nbsp;sentence&nbsp;<strong>best</strong>&nbsp;demonstrates&nbsp;the professional relationship between the&nbsp;narrator&nbsp;and the professor?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“He disengaged the sheet of paper and handed it to me.”&nbsp;(paragraph&nbsp;4)",
        "text": "“He disengaged the sheet of paper and handed it to me.” (paragraph 4)"
      },
      {
        "id": "B",
        "html": "“Clearly, Professor Farrago was on the verge of&nbsp;dotage—ah, what a loss to the world!”&nbsp;(paragraph&nbsp;24)",
        "text": "“Clearly, Professor Farrago was on the verge of dotage—ah, what a loss to the world!” (paragraph 24)"
      },
      {
        "id": "C",
        "html": "“I drew a chair up beside his desk—there was nothing to do but to obey, and this fool’s errand was none of my conceiving.”&nbsp;(paragraph&nbsp;25)",
        "text": "“I drew a chair up beside his desk—there was nothing to do but to obey, and this fool’s errand was none of my conceiving.” (paragraph 25)"
      },
      {
        "id": "D",
        "html": "“ ‘Very well,’ said Professor Farrago, good-humoredly, ‘you shall have all the assistance you may&nbsp;require.’ ”&nbsp;(paragraph&nbsp;29)",
        "text": "“ ‘Very well,’ said Professor Farrago, good-humoredly, ‘you shall have all the assistance you may require.’ ” (paragraph 29)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-in-search-of-the-unknown-9",
    "points": 1,
    "prompt": "How does the author develop the contrast between the narrator’s point of view and the professor’s point of view?",
    "promptHtml": "How&nbsp;does the&nbsp;author&nbsp;develop the&nbsp;contrast&nbsp;between the&nbsp;narrator’s&nbsp;point of view&nbsp;and the professor’s point of view?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "html": "by providing&nbsp;both&nbsp;the&nbsp;narrator’s&nbsp;and professor’s thoughts on&nbsp;how&nbsp;age and experience influence each other’s reasoning",
        "text": "by providing both the narrator’s and professor’s thoughts on how age and experience influence each other’s reasoning"
      },
      {
        "id": "B",
        "html": "by using the conversation between the&nbsp;narrator&nbsp;and the professor to emphasize their reactions to the letter",
        "text": "by using the conversation between the narrator and the professor to emphasize their reactions to the letter"
      },
      {
        "id": "C",
        "html": "by describing the professor’s persistent efforts to change the&nbsp;narrator’s&nbsp;mind about the letter",
        "text": "by describing the professor’s persistent efforts to change the narrator’s mind about the letter"
      },
      {
        "id": "D",
        "html": "by including&nbsp;dialogue&nbsp;that&nbsp;explains&nbsp;why&nbsp;the professor is the supervisor and the&nbsp;narrator&nbsp;is his subordinate",
        "text": "by including dialogue that explains why the professor is the supervisor and the narrator is his subordinate"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromInSearchOfTheUnknownPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-in-search-of-the-unknown",
  section: "reading",
  questionCount: excerptFromInSearchOfTheUnknownQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "excerpt-from-in-search-of-the-unknown",
    title: "Excerpt from In Search of the Unknown",
    author: "Robert W. Chambers",
    passageType: "informational",
    richText: "<p>It was at that time the policy of the trustees and officers of the Zoological Gardens neither to employ collectors nor to send out expeditions in search of specimens. The society decided to depend upon voluntary contributions, and I was always busy, part of the day, in dictating answers to correspondents who wrote offering their services as hunters of big game, collectors of all sorts of fauna, trappers, snarers, and also to those who offered specimens for sale, usually at exorbitant rates.</p><p>To the proprietors of . . . mangy lynxes, moth-eaten coyotes, and dancing bears I returned courteous but uncompromising&nbsp;refusals—of course, first submitting all such letters, together with my replies, to Professor Farrago.</p><p>One day towards the end of May, however, just as I was leaving Bronx Park to return to town, Professor Lesard, of the reptilian department, called out to me that Professor Farrago wanted to see me a moment; so&nbsp;I . . .&nbsp;retraced my steps to the temporary, wooden building occupied by Professor Farrago, general superintendent of the Zoological Gardens. The professor, who was sitting at his desk before a pile of letters and replies submitted for approval by me, pushed his glasses down and looked over them at me with a whimsical smile that suggested amusement, impatience, annoyance, and perhaps a faint trace of apology.</p><p>“Now, here’s a letter,” he said, with a deliberate gesture towards a sheet of paper impaled on a&nbsp;file—“a letter that I suppose you remember.” He disengaged the sheet of paper and handed it to me.</p><p>“Oh yes,” I replied, with a shrug; “of course the man is&nbsp;mistaken—or—”</p><p>“Or what?” demanded Professor Farrago, tranquilly, wiping his glasses.</p><p>“—Or&nbsp;a liar,” I replied.</p><p><strong>8</strong>&nbsp;After a silence he leaned back in his chair and bade me read the letter to him again, and I did so with a contemptuous tolerance for the writer, who must have been either a very innocent victim or a very stupid swindler. I said as much to Professor Farrago, but, to my surprise, he appeared to waver.</p><p><strong>9</strong>&nbsp;“I suppose,” he said, with his near-sighted, embarrassed smile, “that nine hundred and&nbsp;ninety-nine&nbsp;men in a thousand would throw that letter aside and condemn the writer as a liar or a fool?”</p><p><strong>10</strong>&nbsp;“In my opinion,” said I, “he’s one or the other.”</p><p><strong>11</strong>&nbsp;“He&nbsp;isn’t—in mine,” said the professor, placidly.</p><p><strong>12</strong>&nbsp;“What!” I exclaimed. “Here is a man living all alone on a strip of rock and sand between the wilderness and the sea, who wants you to send somebody to take charge of a bird that doesn’t exist!”</p><p><strong>13</strong>&nbsp;“How do you know,” asked Professor Farrago, “that the bird in question does not exist?”</p><p><strong>14</strong>&nbsp;“It is generally accepted,” I replied, sarcastically, “that the great auk has been extinct for years. Therefore I may be pardoned for doubting that our correspondent possesses a pair of them alive.”</p><p>“Oh, you young fellows,” said the professor, smiling wearily, “you embark on a theory for destinations that don’t exist.”</p><p>He leaned back in his chair, his amused eyes searching space for the imagery that made him smile.</p><p>“Like swimming squirrels, you navigate with the help of Heaven and a stiff breeze, but you never land where you hope&nbsp;to—do you?”</p><p>Rather red in the face, I said: “Don’t you believe the great auk to be extinct?”</p><p>“Audubon&nbsp;saw the great auk.”</p><p>“Who has seen a single specimen since?”</p><p>“Nobody—except our correspondent here,” he replied, laughing.</p><p>I laughed, too, considering the interview at an end, but the professor went on, coolly:</p><p>“Whatever it is that our correspondent&nbsp;has—and I am daring to believe that it&nbsp;<em>is</em>&nbsp;the great auk&nbsp;itself—I want you to secure it for the society.”</p><p>When my astonishment subsided my first conscious sentiment was one of pity. Clearly, Professor Farrago was on the verge of&nbsp;dotage—ah, what a loss to the world!</p><p>I believe now that Professor Farrago perfectly interpreted my thoughts, but he betrayed neither resentment nor impatience. I drew a chair up beside his&nbsp;desk—there was nothing to do but to obey, and this fool’s errand was none of my conceiving.</p><p>Together we made out a list of articles necessary for me and itemized the expenses I might incur, and I set a date for my return, allowing no margin for a successful termination to the expedition.</p><p>“Never mind that,” said the professor. “What I want you to do is to get those birds here safely. Now, how many men will you take?”</p><p>“None,” I replied, bluntly; “it’s a useless expense, unless there is something to bring back. If there is I’ll wire you, you may be sure.”</p><p>“Very well,” said Professor Farrago, good-humoredly, “you shall have all the assistance you may require. Can you leave&nbsp;to-night?”</p><p>The old gentleman was certainly prompt. I nodded, half-sulkily, aware of his amusement.</p><p>“So,” I said, picking up my hat, “I am to start north to find a place called Black Harbor, where there is a man named Halyard who possesses, among other household utensils, two extinct great&nbsp;auks—”</p><p>We were both laughing by this time. I asked him why on earth he credited the assertion of a man he had never before heard of.</p><p>“I suppose,” he replied, with the same half-apologetic, half-humorous smile, “it is instinct. I feel, somehow, that this man Halyard&nbsp;<em>has</em>&nbsp;got an&nbsp;auk—perhaps two. I can’t get away from the idea that we are on the eve of acquiring the rarest of living creatures. It’s odd for a scientist to talk as I do; doubtless you’re&nbsp;shocked—admit it, now!”</p><p>But I was not shocked; on the contrary, I was conscious that the same strange hope that Professor Farrago cherished was beginning, in spite of me, to stir my pulses, too.</p><p>“If he&nbsp;has—”&nbsp;I began, then stopped.</p><p>The professor and I looked hard at each other in silence.</p><p>“Go on,” he said, encouragingly.</p><p>But I had nothing more to say, for the prospect of beholding with my own eyes a living specimen of the great auk produced a series of conflicting emotions within me which rendered speech profanely superfluous.</p><p>\n\n</p>",
    sourceNote: "From IN SEARCH OF THE UNKNOWN by Robert W. Chambers—Public Domain",
    text: excerptFromInSearchOfTheUnknownPassageText,
    versionLabel: "2025-2026 Form B",
  }),
  questions: excerptFromInSearchOfTheUnknownQuestions,
};
