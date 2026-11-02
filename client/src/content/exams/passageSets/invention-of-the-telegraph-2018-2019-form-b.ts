import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const inventionOfTheTelegraph20182019FormBPassageText = "Earlier Signal Systems\n\nLong before Samuel F. B. Morse electrically transmitted his famous message “What hath God wrought?” from Washington to Baltimore on May 24, 1844, there were signaling systems that enabled people to communicate over distances. Most were visual or “semaphore” systems using flags or lights. In the eighteenth century, such systems used an observer who would decipher a signal from a high tower on a distant hill and then send it on to the next station. The young American republic wanted just such a system along its entire Atlantic coast and offered a prize of $30,000 for a workable proposal. The framers of this legislation had no way of knowing that when they used the word “telegraph” to refer to this visual semaphore system, they would be offered an entirely new and revolutionary means of communication—electricity.\n\nThe Growth of an Idea\n\nThe idea of using electricity to communicate over distance is said to have occurred to Morse during a conversation aboard ship when he was returning from Europe in 1832. Michael Faraday’s recently invented electromagnet was much discussed by the ship’s passengers, and when Morse came to understand how it worked, he speculated that it might be possible to send a coded message over a wire. While a student at Yale College years before, he had written his parents a letter about how interesting he found the lectures on electricity. Despite what he had learned at Yale, Morse found when he began to develop his idea that he had little real understanding of the nature of electricity, and after sporadic attempts to work with batteries, magnets, and wires, he finally turned for help to a colleague at the University of the City of New York, Leonard D. Gale.\n\nGale was a professor of chemistry and familiar with the electrical work of Princeton’s Joseph Henry, a true pioneer in the new field. Well before Morse had his shipboard idea about a telegraph, Henry rang a bell at a distance by opening and closing an electric circuit. In 1831, he had published an article, of which Morse was unaware, that contained details suggesting the idea of an electric telegraph. Gale’s help and his knowledge of this article proved crucial to Morse’s telegraph system because Gale not only pointed out flaws in the system but showed Morse how he could regularly boost the strength of a signal and overcome the distance problems he had encountered by using a relay system Henry had invented. Henry’s experiments, Gale’s assistance, and, soon after, hiring the young technician Alfred Vail were keys to Morse’s success.\n\nObstacles and Opportunities\n\nBy December 1837, Morse had enough confidence in his new system to apply for the federal government’s appropriation, and during the next year he conducted demonstrations of his telegraph both in New York and Washington. However, when the economic disaster known as the Panic of 1837 took hold of the nation and caused a long depression, Morse was forced to wait for better times. It was during this period that Morse visited Europe again and tried not only to secure patent protection overseas but to examine competing telegraph systems in England. . . .\n\nBy 1843, the country was beginning to recover economically, and Morse again asked Congress for the $30,000 that would allow him to build a telegraph line from Washington to Baltimore, forty miles away. The House of Representatives eventually passed the bill containing the Morse appropriation, and the Senate approved it in the final hours of that Congress’s last session. With President Tyler’s signature, Morse received the cash he needed and began to carry out plans for an underground telegraph line.\n\nRealizing a Great Invention\n\nMorse had hired the ingenious construction engineer Ezra Cornell to lay the pipe carrying the wire, and although Cornell did his job superbly, one of Morse’s partners, Congressman F. O. J. Smith, had purchased wire with defective insulation. Too much time had been wasted laying bad wire, and with the project on a rigid deadline, something had to be done quickly. Cornell suggested that the fastest and cheapest way of connecting Washington and Baltimore was to string wires overhead on trees and poles. The desperate Morse gave the go-ahead, and the line was completed in time for the dramatic and spectacularly successful link between the Supreme Court chamber of the Capitol building and the railroad station in Baltimore.\n\nSoon, as overhead wires connected cities up and down the Atlantic coast, the dots-and-dashes method that recorded messages on a long moving strip of paper was replaced by the operator’s ability to interpret the code in real time. . . . Telegraph lines soon extended westward, and within Morse’s own lifetime they connected the continents of Europe and America.";

const inventionOfTheTelegraph20182019FormBQuestions: ExamQuestion[] = [
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q048",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "48",
      "pages": [
        34
      ]
    },
    "explanation": "48. (H) The question asks for the best explanation of how the use of problem-solution in paragraph 2 helps develop the ideas in the passage. Option H is correct because it explains that Morse realized his problem was that he was not knowledgeable enough to continue his experimentation without help, so the solution was to seek help from a colleague. Option E is incorrect because, while the discussion on the ship fascinated Morse and reminded him of the lectures he had attended at Yale College, it was his failed attempts with electricity that caused him to reach out to Gail for help. Option F is incorrect because, while “Morse found when he began to develop his idea that he had little real understanding of the nature of electricity” (paragraph 3), the paragraph does not state that he was discouraged; it was his failed experimentation that resulted in him first realizing that he needed help. Option G is incorrect because the paragraph states that “Morse came to understand how [Faraday’s electromagnet] worked,” and that understanding is what caused him to think about sending messages over a wire; Also, Morse’s difficulty was in understanding the properties of electricity in general once he began his experimentation.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q048-explanation-1.png\" alt=\"Supplied Form B explanation for question 48\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which statement describes how the author’s use of problem-solution in paragraph 2 contributes to the development of ideas in the passage?",
    "promptHtml": "<p>Which statement describes how the author’s use of problem-solution in paragraph 2 contributes to the development of ideas in the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>Morse’s discussion on a ship about Faraday’s electromagnet reminded him of the Yale College lectures on electricity, which he had enjoyed but had not fully understood, inspiring him to learn more about electricity from his colleague Gale.</p>",
        "text": "Morse’s discussion on a ship about Faraday’s electromagnet reminded him of the Yale College lectures on electricity, which he had enjoyed but had not fully understood, inspiring him to learn more about electricity from his colleague Gale."
      },
      {
        "id": "B",
        "html": "<p>Morse’s discouragement over his lack of knowledge of electricity prompted him to experiment with batteries, magnets, and wires, which led to the development of a new long-distance communication system.</p>",
        "text": "Morse’s discouragement over his lack of knowledge of electricity prompted him to experiment with batteries, magnets, and wires, which led to the development of a new long-distance communication system."
      },
      {
        "id": "C",
        "html": "<p>Morse’s difficulty in understanding how Faraday’s electromagnet worked was frustrating, and it pushed him to create a system for sending signals over wires.</p>",
        "text": "Morse’s difficulty in understanding how Faraday’s electromagnet worked was frustrating, and it pushed him to create a system for sending signals over wires."
      },
      {
        "id": "D",
        "html": "<p>Morse’s longtime fascination was not enough to make up for his lack of knowledge about electricity, so he eventually sought help from Gale.</p>",
        "text": "Morse’s longtime fascination was not enough to make up for his lack of knowledge about electricity, so he eventually sought help from Gale."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q049",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "49",
      "pages": [
        34
      ]
    },
    "explanation": "49. (B) The question asks how the use of sequencing, or arranging in chronological order, in paragraph 3 contributes to the overall structure of the passage. Paragraph 3 outlines the information that Gale knew who Henry was (“Well before Morse had his shipboard idea about a telegraph, Henry rang a bell at a distance by opening and closing an electric circuit”) and that Gale told Morse. Gale’s input was “crucial to Morse’s telegraph system,” and hiring Vail was an additional and necessary help. Therefore, Option B is correct because the creation of Morse’s telegraph involved a series of steps that each built upon earlier ideas and inventions from others, such as Henry, Gale, and Vail. Option A is incorrect because, although the inventions and advancements of others assisted in the development of the telegraph, the passage does not suggest that the other men were attempting to create their own telegraph systems. Option C is incorrect because the only other long-distance communication system mentioned in the passage is the outdated semaphore system discussed in paragraph 1. Option D is incorrect because the telegraph system was in\n\ndevelopment for more than ten years because of the lack of funding and the need for further experimentation.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q049-explanation-1.png\" alt=\"Supplied Form B explanation for question 49\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q049-explanation-2.png\" alt=\"Supplied Form B explanation for question 49\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which statement describes how the author’s use of sequencing in paragraph 3 contributes to the overall structure of the passage?",
    "promptHtml": "<p>Which statement describes how the author’s use of sequencing in paragraph 3 contributes to the overall structure of the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It shows that several people were simultaneously attempting to create an electric telegraph.</p>",
        "text": "It shows that several people were simultaneously attempting to create an electric telegraph."
      },
      {
        "id": "B",
        "html": "<p>It shows how the invention of the electric telegraph depended on information and techniques discovered by others.</p>",
        "text": "It shows how the invention of the electric telegraph depended on information and techniques discovered by others."
      },
      {
        "id": "C",
        "html": "<p>It shows that multiple means of long-distance communication were being used at the same time.</p>",
        "text": "It shows that multiple means of long-distance communication were being used at the same time."
      },
      {
        "id": "D",
        "html": "<p>It shows how quickly long-distance communication changed from visual signals to electrical signals.</p>",
        "text": "It shows how quickly long-distance communication changed from visual signals to electrical signals."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q050",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "50",
      "pages": [
        34
      ]
    },
    "explanation": "50. (F) The question asks what the words “dramatic” and “spectacularly” convey in the sentence. Morse and Cornell rushed to post the wires overhead, and the “rigid deadline” (paragraph 7) was successfully met. The words have a positive and victorious tone that is consistent with the feeling of wonder that it worked and of celebration that the construction was completed, making Option F correct. Option E is incorrect because, while there may have been some feelings of relief and fulfilment that the lines were in place, the passage does not say so, and instead it focuses on the wonder and joy Morse and Cornell felt overcoming setbacks and completing the construction of Morse’s telegraph system. Option G is incorrect because the passage does not share whether Morse or Cornell considered the future possibilities of the telegraph, only that the finished product was “dramatic,” implying it was amazing to see. Option H is incorrect because, while the passage later discusses the expansion of overhead wires “up and down the Atlantic coast” and how they “connected the continents of Europe and America” (paragraph 8), there is no evidence shared in the passage that Morse planned to continue his work with electricity.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q050-explanation-1.png\" alt=\"Supplied Form B explanation for question 50\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 7.\n\nThe desperate Morse gave the go-ahead, and the line was completed in time for the dramatic and spectacularly successful link between the Supreme Court chamber of the Capitol building and the railroad station in Baltimore.\n\nThe words “dramatic” and “spectacularly” in the sentence convey a",
    "promptHtml": "<p>Read this sentence from paragraph 7.</p><blockquote><strong>The desperate Morse gave the go-ahead, and the line was completed in time for the dramatic and spectacularly successful link between the Supreme Court chamber of the Capitol building and the railroad station in Baltimore.</strong></blockquote><p>The words “dramatic” and “spectacularly” in the sentence convey a</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>sense of relief and fulfillment that the line was finished.</p>",
        "text": "sense of relief and fulfillment that the line was finished."
      },
      {
        "id": "B",
        "html": "<p>sense of wonder and of celebration that the telegraph line was completed on time.</p>",
        "text": "sense of wonder and of celebration that the telegraph line was completed on time."
      },
      {
        "id": "C",
        "html": "<p>feeling of excitement about the future possibilities of the telegraph.</p>",
        "text": "feeling of excitement about the future possibilities of the telegraph."
      },
      {
        "id": "D",
        "html": "<p>feeling of confidence about being able to continue the work.</p>",
        "text": "feeling of confidence about being able to continue the work."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q051",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "51",
      "pages": [
        35
      ]
    },
    "explanation": "51. (A) The question asks for support from the passage for the idea that Morse was aware of his limitations. Option A is correct because the sentence from paragraph 2 details the materials with which Morse experimented unsuccessfully before turning to others for assistance. Option B is incorrect because, although the sentence from paragraph 3 notes that Gale provided necessary assistance, it makes no reference to Morse admitting defeat and requesting his help. Option C is incorrect because, although the sentence from paragraph 3 makes it clear that Henry, Gail, and Vail contributed to Morse’s success, the sentence does not specifically say that Morse realized that he needed assistance to succeed. Option D is incorrect because the sentence from paragraph 7 refers to Morse seeking help from Ezra Cornell in constructing his system, not in developing a way to make it work.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q051-explanation-1.png\" alt=\"Supplied Form B explanation for question 51\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which excerpt from the passage supports the idea that Morse was aware of his limitations?",
    "promptHtml": "<p>Which excerpt from the passage supports the idea that Morse was aware of his limitations?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>“After sporadic attempts to work with batteries, magnets, and wires, he finally turned for help to a colleague.” (paragraph 2)</p>",
        "text": "“After sporadic attempts to work with batteries, magnets, and wires, he finally turned for help to a colleague.” (paragraph 2)"
      },
      {
        "id": "B",
        "html": "<p>“Gale’s help and his knowledge of this article proved crucial to Morse’s telegraph system.” (paragraph 3)</p>",
        "text": "“Gale’s help and his knowledge of this article proved crucial to Morse’s telegraph system.” (paragraph 3)"
      },
      {
        "id": "C",
        "html": "<p>“Henry’s experiments, Gale’s assistance, and, soon after, hiring the young technician Alfred Vail were keys to Morse’s success.” (paragraph 3)</p>",
        "text": "“Henry’s experiments, Gale’s assistance, and, soon after, hiring the young technician Alfred Vail were keys to Morse’s success.” (paragraph 3)"
      },
      {
        "id": "D",
        "html": "<p>“Morse had hired the ingenious construction engineer Ezra Cornell to lay the pipe carrying the wire.” (paragraph 7)</p>",
        "text": "“Morse had hired the ingenious construction engineer Ezra Cornell to lay the pipe carrying the wire.” (paragraph 7)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q052",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "52",
      "pages": [
        35
      ]
    },
    "explanation": "52. (F) The question asks how a passage section helps convey a central idea of the passage. Paragraph 3 states that “Henry’s experiments, Gale’s assistance, and, soon after, hiring the young technician Alfred Vail were keys to Morse’s success.” The level of interest inspired Morse and others to work together to find a way to use electricity to send long-distance messages. Option F is correct; the section helps convey a central idea\n\nbecause, overall, the section focuses on what fascinated Morse enough to begin his work and how others were just as interested and willing to work to achieve this goal. Option E is incorrect because, although the word collaborative suggests that multiple people contributed to the telegraph’s success, the option does not clarify the research and effort needed in order to understand how to use electricity to send signals. Option G is incorrect because when Morse came to understand how Faraday’s electromagnet worked, Morse wondered if it might be possible to send a coded message over a wire, but that thought later evolved into the telegraph only after more research and experimentation. Option H is incorrect because the influence of what Morse learned at Yale was only a minor factor in his development of the telegraph.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q052-explanation-1.png\" alt=\"Supplied Form B explanation for question 52\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q052-explanation-2.png\" alt=\"Supplied Form B explanation for question 52\" width=\"351\"></p>",
    "points": 1,
    "prompt": "The details of the section “The Growth of an Idea” convey a central idea of the passage by suggesting that",
    "promptHtml": "<p>The details of the section “The Growth of an Idea” convey a central idea of the passage by suggesting that</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>the collaborative efforts of colleagues resulted in successful communication over a wire.</p>",
        "text": "the collaborative efforts of colleagues resulted in successful communication over a wire."
      },
      {
        "id": "B",
        "html": "<p>a great deal of interest and work was devoted to understanding how to use electricity to send signals.</p>",
        "text": "a great deal of interest and work was devoted to understanding how to use electricity to send signals."
      },
      {
        "id": "C",
        "html": "<p>Faraday’s invention of the electromagnet inspired the invention of the telegraph.</p>",
        "text": "Faraday’s invention of the electromagnet inspired the invention of the telegraph."
      },
      {
        "id": "D",
        "html": "<p>colleges like Yale played a great role in making new discoveries about electricity and its applications.</p>",
        "text": "colleges like Yale played a great role in making new discoveries about electricity and its applications."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q053",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "53",
      "pages": [
        35
      ]
    },
    "explanation": "53. (B) The question asks how the graph supports the ideas in paragraph 8. The graph shows the number of messages transmitted from 1870 to 1920. In 1920 almost 160 million messages were transmitted, showing a “dramatic”—almost double—increase from 1910, which makes Option B the correct answer. Option A is incorrect because, while it can be implied from the expansion shown on the graph that people possibly welcomed the improvement in long-distance communication, the graph does not state this explicitly. Option C is incorrect because the graph does not show how many people used the telegraph, but rather it shows the number of messages sent. Additionally, paragraph 8 provides no details about hesitation on the part of individuals. Option D is incorrect because, while improvements in recording and interpreting code were made, the graph does not show the effect of this advancement on the speed or number of messages being transmitted.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q053-explanation-1.png\" alt=\"Supplied Form B explanation for question 53\" width=\"351\"></p>",
    "points": 1,
    "prompt": "How does the graph support the ideas in paragraph 8?",
    "promptHtml": "<p>How does the graph support the ideas in paragraph 8?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>It indicates how welcome the improvement of long-distance communication was in the United States.</p>",
        "text": "It indicates how welcome the improvement of long-distance communication was in the United States."
      },
      {
        "id": "B",
        "html": "<p>It provides evidence of the dramatic increase in the number of telegraph messages as Morse’s system expanded across the United States.</p>",
        "text": "It provides evidence of the dramatic increase in the number of telegraph messages as Morse’s system expanded across the United States."
      },
      {
        "id": "C",
        "html": "<p>It reveals that by the twentieth century millions of people had used the telegraph despite earlier hesitations about the system.</p>",
        "text": "It reveals that by the twentieth century millions of people had used the telegraph despite earlier hesitations about the system."
      },
      {
        "id": "D",
        "html": "<p>It shows how improvements that allowed Morse code to be read in real time made relaying telegraph messages faster and increased the system’s usage.</p>",
        "text": "It shows how improvements that allowed Morse code to be read in real time made relaying telegraph messages faster and increased the system’s usage."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q054",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "54",
      "pages": [
        36
      ]
    },
    "explanation": "54. (G) The question asks for the best summary of Morse’s efforts to fund the construction of his telegraph system. Option G is correct because it details all the steps that resulted in Morse obtaining the appropriation, or $30,000 needed. Option E is incorrect because it focuses on what Morse did while his application for the funding was delayed. Option F is incorrect because, while it begins with Morse applying for the grant, it focuses on the process required for the government to approve the appropriation. Option H is incorrect because it relates how Morse worked with others to develop his ideas about the telegraph before applying for funding for its construction.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q054-explanation-1.png\" alt=\"Supplied Form B explanation for question 54\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which sentence is the best summary of how Morse obtained the funding necessary to build his telegraph system?",
    "promptHtml": "<p>Which sentence is the best summary of how Morse obtained the funding necessary to build his telegraph system?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>Morse applied for a federal grant that was delayed until 1843, so he spent time traveling in Europe, where he concentrated on obtaining a patent for his system.</p>",
        "text": "Morse applied for a federal grant that was delayed until 1843, so he spent time traveling in Europe, where he concentrated on obtaining a patent for his system."
      },
      {
        "id": "B",
        "html": "<p>Morse applied for a government grant that required both houses of Congress and the president to pass a bill awarding him $30,000 for his telegraph project.</p>",
        "text": "Morse applied for a government grant that required both houses of Congress and the president to pass a bill awarding him $30,000 for his telegraph project."
      },
      {
        "id": "C",
        "html": "<p>Morse applied for a government appropriation and conducted telegraph demonstrations to show that his system could work, and after a delay caused by a financial depression, Congress approved the $30,000 appropriation in 1843.</p>",
        "text": "Morse applied for a government appropriation and conducted telegraph demonstrations to show that his system could work, and after a delay caused by a financial depression, Congress approved the $30,000 appropriation in 1843."
      },
      {
        "id": "D",
        "html": "<p>Working with Gale and Vail allowed Morse to find flaws in Henry’s work and to develop his own ideas before applying for the federal government appropriation.</p>",
        "text": "Working with Gale and Vail allowed Morse to find flaws in Henry’s work and to develop his own ideas before applying for the federal government appropriation."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q055",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "55",
      "pages": [
        36
      ]
    },
    "explanation": "55. (A) The question asks how the map provides additional support for a central idea of the passage. The map shows the telegraph line crossing continents in 1902, just forty-four years after the first message\n\nwas sent in 1858. This is a much greater distance than the first line Morse built between “the Supreme Court chamber of the Capitol building and the railroad station in Baltimore” (paragraph 7), making Option A correct. Option B is incorrect because the map shows the distance the line covers; it does not indicate Morse’s lack of foresight in seeking patents only in North America. Option C is incorrect because, while Gale’s advice was crucial to Morse’s success, the map shows the physical line stretching across continents many years later, after their initial work. Option D is incorrect because, while it can be inferred that the telegraph had influence across the world, the amount of influence cannot be determined.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q055-explanation-1.png\" alt=\"Supplied Form B explanation for question 55\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q055-explanation-2.png\" alt=\"Supplied Form B explanation for question 55\" width=\"348\"></p>",
    "points": 1,
    "prompt": "How does the map provide additional support for a central idea of the passage?",
    "promptHtml": "<p>How does the map provide additional support for a central idea of the passage?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>by demonstrating that Morse’s telegraph system greatly exceeded the limitations of previous long-distance communication systems</p>",
        "text": "by demonstrating that Morse’s telegraph system greatly exceeded the limitations of previous long-distance communication systems"
      },
      {
        "id": "B",
        "html": "<p>by indicating that Morse was lacking foresight by seeking a patent only in North America</p>",
        "text": "by indicating that Morse was lacking foresight by seeking a patent only in North America"
      },
      {
        "id": "C",
        "html": "<p>by proving that Gale’s advice helped Morse extend the telegraph’s range much farther than first thought possible</p>",
        "text": "by proving that Gale’s advice helped Morse extend the telegraph’s range much farther than first thought possible"
      },
      {
        "id": "D",
        "html": "<p>by providing a graphic that shows the surprisingly immense influence Morse’s telegraph had across the world</p>",
        "text": "by providing a graphic that shows the surprisingly immense influence Morse’s telegraph had across the world"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q056",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "56",
      "pages": [
        36
      ]
    },
    "explanation": "56. (E) The question asks for information that conveys the idea that the United States was mostly unaware of the possibilities of electricity in the mid-nineteenth century. The passage states that most signaling systems at the time were “visual or ‘semaphore’ systems using flags or lights” (paragraph 1) and that the United States was looking for “just such a system along its entire Atlantic coast” (paragraph 1). Option E is correct because waving lights and flags reveals how limiting and simple the system of the time was, and Option E states that the United States wanted to expand this system, not improve upon it. Option F is incorrect because the delay in funding had to do with the Panic of 1837 and the “long depression” (paragraph 5), not because the House of Representatives was not aware or ready for innovation in the use of electricity. Option G is incorrect because it focuses on what prompted Morse to consider an electronic wire-based communications system. Option H is incorrect because it describes a basic aspect of an early electrical discovery that demonstrated the interest of scientists in the possibilities of electricity, not the United States as a whole.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q056-explanation-1.png\" alt=\"Supplied Form B explanation for question 56\" width=\"348\"></p>",
    "points": 1,
    "prompt": "The idea that, in the mid-nineteenth century, the United States was mostly unaware of the possibilities of electricity is illustrated in the passage mainly through the",
    "promptHtml": "<p>The idea that, in the mid-nineteenth century, the United States was mostly unaware of the possibilities of electricity is illustrated in the passage mainly through the</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>description of the government’s initial desire to expand a semaphore signaling system that used either flags or lights along the Atlantic Coast.</p>",
        "text": "description of the government’s initial desire to expand a semaphore signaling system that used either flags or lights along the Atlantic Coast."
      },
      {
        "id": "B",
        "html": "<p>delay by the House of Representatives to pass the bill funding Morse’s telegraph line six years after he first applied for the appropriation.</p>",
        "text": "delay by the House of Representatives to pass the bill funding Morse’s telegraph line six years after he first applied for the appropriation."
      },
      {
        "id": "C",
        "html": "<p>discussions of the newly invented electromagnet that sparked the idea of sending codes through wires.</p>",
        "text": "discussions of the newly invented electromagnet that sparked the idea of sending codes through wires."
      },
      {
        "id": "D",
        "html": "<p>description of how an electric circuit could be closed to ring a bell at a distance.</p>",
        "text": "description of how an electric circuit could be closed to ring a bell at a distance."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "invention-of-the-telegraph-2018-2019-form-b-pdf-shsat-2018-2019-b-q057",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "57",
      "pages": [
        36
      ]
    },
    "explanation": "57. (D) The question asks which statement best represents a viewpoint held by the author of the passage. Paragraph 8 states that “Telegraph lines soon extended westward, and within Morse’s own lifetime they connected the continents of Europe and America.” Therefore, Option D is correct because the author presents Morse’s telegraph as a great leap in the ability to quickly communicate messages over distances never before imagined. Option A is incorrect because the author explains that the aboveground wiring was used only because “Cornell suggested that [it was] the fastest and cheapest way” (paragraph 7), not because it would be more successful. Option B is incorrect because the author conveys the importance of this advancement in communication without providing detailed information about electrical systems. Option C is incorrect because,\n\nwhile the Panic of 1837 caused a delay in Morse’s funding, the author shows that Morse received the appropriation in 1843 and was able to overcome the financial setback he faced.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q057-explanation-1.png\" alt=\"Supplied Form B explanation for question 57\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q057-explanation-2.png\" alt=\"Supplied Form B explanation for question 57\" width=\"351\"></p>",
    "points": 1,
    "prompt": "With which statement would the author most likely agree?",
    "promptHtml": "<p>With which statement would the author most likely agree?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>Morse’s telegraph was successful because the wires were strung aboveground rather than underground as originally planned.</p>",
        "text": "Morse’s telegraph was successful because the wires were strung aboveground rather than underground as originally planned."
      },
      {
        "id": "B",
        "html": "<p>Understanding the importance of Morse’s telegraph requires detailed knowledge of electrical systems.</p>",
        "text": "Understanding the importance of Morse’s telegraph requires detailed knowledge of electrical systems."
      },
      {
        "id": "C",
        "html": "<p>The implementation of Morse’s telegraph system was overly influenced by economic factors.</p>",
        "text": "The implementation of Morse’s telegraph system was overly influenced by economic factors."
      },
      {
        "id": "D",
        "html": "<p>Morse’s invention of the telegraph made a great stride toward better connecting people across the United States and across the world.</p>",
        "text": "Morse’s invention of the telegraph made a great stride toward better connecting people across the United States and across the world."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const inventionOfTheTelegraph20182019FormBPassageSet: ExamPassageSet = {
  id: "ela-invention-of-the-telegraph-2018-2019-form-b",
  versionLabels: ["2018-2019 Form B"],
  label: "2018-2019 Form B",
  section: "reading",
  questionCount: inventionOfTheTelegraph20182019FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "invention-of-the-telegraph-2018-2019-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Invention of the Telegraph",
    blurbHtml: "<p>Samuel Morse, an American inventor, is credited with creating the electronic telegraph, a communication device that allows users to send messages using a system of short and long pulses that represent letters, numbers, and punctuation. In 1844 the United States Congress passed the Telegraph Bill, which provided Morse with the funds to build an electric telegraph system.</p>",
    sourceNoteHtml: "<p>“Invention of the Telegraph”—Public Domain/Library of Congress</p>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2018-2019 Form B","year":"2018-2019","form":"B","packageId":"82a187b0503bd94c3897cb85ef0ea56f4ef9ff2b46d9dc07d03468ab84cbff9a"},
    title: "Invention of the Telegraph",
    blurb: "Samuel Morse, an American inventor, is credited with creating the electronic telegraph, a communication device that allows users to send messages using a system of short and long pulses that represent letters, numbers, and punctuation. In 1844 the United States Congress passed the Telegraph Bill, which provided Morse with the funds to build an electric telegraph system.",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>Earlier Signal Systems</p><p>Long before Samuel F. B. Morse electrically transmitted his famous message “What hath God wrought?” from Washington to Baltimore on May 24, 1844, there were signaling systems that enabled people to communicate over distances. Most were visual or “semaphore” systems using flags or lights. In the eighteenth century, such systems used an observer who would decipher a signal from a high tower on a distant hill and then send it on to the next station. The young American republic wanted just such a system along its entire Atlantic coast and offered a prize of $30,000 for a workable proposal. The framers of this <span data-glossary-definition=\"Telegraph Bill\" role=\"link\" tabindex=\"0\">legislation</span> had no way of knowing that when they used the word “telegraph” to refer to this visual semaphore system, they would be offered an entirely new and revolutionary means of communication—electricity.</p><p>The Growth of an Idea</p><p>The idea of using electricity to communicate over distance is said to have occurred to Morse during a conversation aboard ship when he was returning from Europe in 1832. Michael Faraday’s recently invented electromagnet was much discussed by the ship’s passengers, and when Morse came to understand how it worked, he speculated that it might be possible to send a coded message over a wire. While a student at Yale College years before, he had written his parents a letter about how interesting he found the lectures on electricity. Despite what he had learned at Yale, Morse found when he began to develop his idea that he had little real understanding of the nature of electricity, and after sporadic attempts to work with batteries, magnets, and wires, he finally turned for help to a colleague at the University of the City of New York, Leonard D. Gale.</p><p>Gale was a professor of chemistry and familiar with the electrical work of Princeton’s Joseph Henry, a true pioneer in the new field. Well before Morse had his shipboard idea about a telegraph, Henry rang a bell at a distance by opening and closing an electric circuit. In 1831, he had published an article, of which Morse was unaware, that contained details suggesting the idea of an electric telegraph. Gale’s help and his knowledge of this article proved crucial to Morse’s telegraph system because Gale not only pointed out flaws in the system but showed Morse how he could regularly boost the strength of a signal and overcome the distance problems he had encountered by using a relay system Henry had invented. Henry’s experiments, Gale’s assistance, and, soon after, hiring the young technician Alfred Vail were keys to Morse’s success.</p><p>Obstacles and Opportunities</p><p>By December 1837, Morse had enough confidence in his new system to apply for the federal government’s appropriation, and during the next year he conducted demonstrations of his telegraph both in New York and Washington. However, when the economic disaster known as the Panic of 1837 took hold of the nation and caused a long depression, Morse was forced to wait for better times. It was during this period that Morse visited Europe again and tried not only to secure patent protection overseas but to examine competing telegraph systems in England. . . .</p><p>By 1843, the country was beginning to recover economically, and Morse again asked Congress for the $30,000 that would allow him to build a telegraph line from Washington to Baltimore, forty miles away. The House of Representatives eventually passed the bill containing the Morse appropriation, and the Senate approved it in the final hours of that Congress’s last session. With President Tyler’s signature, Morse received the cash he needed and began to carry out plans for an underground telegraph line.</p><p>Realizing a Great Invention</p><p>Morse had hired the ingenious construction engineer Ezra Cornell to lay the pipe carrying the wire, and although Cornell did his job superbly, one of Morse’s partners, Congressman F. O. J. Smith, had purchased wire with defective insulation. Too much time had been wasted laying bad wire, and with the project on a rigid deadline, something had to be done quickly. Cornell suggested that the fastest and cheapest way of connecting Washington and Baltimore was to string wires overhead on trees and poles. The desperate Morse gave the go-ahead, and the line was completed in time for the dramatic and spectacularly successful link between the Supreme Court chamber of the Capitol building and the railroad station in Baltimore.</p><p>Soon, as overhead wires connected cities up and down the Atlantic coast, the <span data-glossary-definition=\"the short and long pulses of Morse code that are sent and received by telegraph operators\" role=\"link\" tabindex=\"0\">dots-and-dashes method</span> that recorded messages on a long moving strip of paper was replaced by the operator’s ability to interpret the code in real time. . . . Telegraph lines soon extended westward, and within Morse’s own lifetime they connected the continents of Europe and America.</p><p data-numbered=\"false\"><img src=\"/exam-images/pdf-2018-2019-b-passage-1-figure-1.png\" alt=\"British All-Red Telegraph Line, 1902 map and growth of telegraph communication chart\" width=\"684\"></p>",
    sourceNote: "“Invention of the Telegraph”—Public Domain/Library of Congress",
    text: inventionOfTheTelegraph20182019FormBPassageText,
    versionLabel: "2018-2019 Form B",
  }),
  questions: inventionOfTheTelegraph20182019FormBQuestions,
};
