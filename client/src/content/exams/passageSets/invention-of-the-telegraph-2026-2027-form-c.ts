import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const inventionOfTheTelegraph20262027FormCPassageText = "Samuel Morse, an American inventor, is credited with creating the electronic telegraph, a communication device that allows users to send messages using a system of short and long pulses that represent letters, numbers, and punctuation. In 1844, the United States Congress passed the Telegraph Bill, which provided Morse with the funds to build an electric telegraph system.\nEarlier Signal Systems\nLong before Samuel F. B. Morse electrically transmitted his famous message “What hath God wrought?” from Washington to Baltimore on May 24, 1844, there were signaling systems that enabled people to communicate over distances. Most were visual or “semaphore” systems using flags or lights. In the eighteenth century, such systems used an observer who would decipher a signal from a high tower on a distant hill and then send it on to the next station. The young American republic wanted just such a system along its entire Atlantic coast and offered a prize of $30,000 for a workable proposal. The framers of this legislation had no way of knowing that when they used the word “telegraph” to refer to this visual semaphore system, they would be offered an entirely new and revolutionary means of communication—electricity.\nThe Growth of an Idea\nThe idea of using electricity to communicate over distance is said to have occurred to Morse during a conversation aboard ship when he was returning from Europe in 1832. Michael Faraday’s recently invented electromagnet was much discussed by the ship’s passengers, and when Morse came to understand how it worked, he speculated that it might be possible to send a coded message over a wire. While a student at Yale College years before, he had written his parents a letter about how interesting he found the lectures on electricity. Despite what he had learned at Yale, Morse found when he began to develop his idea that he had little real understanding of the nature of electricity, and after sporadic attempts to work with batteries, magnets, and wires, he finally turned for help to a colleague at the University of the City of New York, Leonard D. Gale.\nGale was a professor of chemistry and familiar with the electrical work of Princeton’s Joseph Henry, a true pioneer in the new field. Well before Morse had his shipboard idea about a telegraph, Henry rang a bell at a distance by opening and closing an electric circuit. In 1831, he had published an article, of which Morse was unaware, that contained details suggesting the idea of an electric telegraph. Gale’s help and his knowledge of this article proved crucial to Morse’s telegraph system because Gale not only pointed out flaws in the system but showed Morse how he could regularly boost the strength of a signal and overcome the distance problems he had encountered by using a relay system Henry had invented. Henry’s experiments, Gale’s assistance, and, soon after, hiring the young technician Alfred Vail were keys to Morse’s success.\nObstacles and Opportunities\nBy December 1837, Morse had enough confidence in his new system to apply for the federal government’s appropriation, and during the next year he conducted demonstrations of his telegraph both in New York and Washington.\nHowever, when the economic disaster known as the Panic of 1837 took hold of the nation and caused a long depression, Morse was forced to wait for better times. It was during this period that Morse visited Europe again and tried not only to secure patent protection overseas but to examine competing telegraph systems in England. . . .\nBy 1843, the country was beginning to recover economically, and Morse again asked Congress for the $30,000 that would allow him to build a telegraph line from Washington to Baltimore, forty miles away. The House of Representatives eventually passed the bill containing the Morse appropriation, and the Senate approved it in the final hours of that Congress’s last session. With President Tyler’s signature, Morse received the cash he needed and began to carry out plans for an underground telegraph line.\nRealizing a Great Invention\nMorse had hired the ingenious construction engineer Ezra Cornell to lay the pipe carrying the wire, and although Cornell did his job superbly, one of Morse’s partners, Congressman F. O. J. Smith, had purchased wire with defective insulation. Too much time had been wasted laying bad wire, and with the project on a rigid deadline, something had to be done quickly. Cornell suggested that the fastest and cheapest way of connecting Washington and Baltimore was to string wires overhead on trees and poles. The desperate Morse gave the go-ahead, and the line was completed in time for the dramatic and spectacularly successful link between the Supreme Court chamber of the Capitol building and the railroad station in Baltimore.\nSoon, as overhead wires connected cities up and down the Atlantic coast, the dots-and-dashes method that recorded messages on a long moving strip of paper was replaced by the operator’s ability to interpret the code in real time. . . . Telegraph lines soon extended westward, and within Morse’s own lifetime they connected the continents of Europe and America.";

const inventionOfTheTelegraph20262027FormCQuestions: ExamQuestion[] = [
  {
    "id": "invention-of-the-telegraph-2026-2027-form-c-official-shsat-2026-c-1",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "1"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-a28392262c07661d1e3f.png\" alt=\"Official explanation for question 1\">",
    "points": 1,
    "prompt": "The details of the section “The Growth of an Idea” convey a central idea of the passage by suggesting that",
    "promptHtml": "<p>The details of the section “The Growth of an Idea” convey a central idea of the passage by suggesting that</p>",
    "topic": "",
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
    "id": "invention-of-the-telegraph-2026-2027-form-c-official-shsat-2026-c-2",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "2"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-c1ec456f9e5083b71f12.png\" alt=\"Official explanation for question 2\">",
    "points": 1,
    "prompt": "Which sentence is the best summary of how Morse obtained the funding necessary to build his telegraph system?",
    "promptHtml": "<p>Which sentence is the <strong>best</strong> summary of how Morse obtained the funding necessary to build his telegraph system?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Morse’s application for a federal grant was delayed until 1843, so he spent time traveling in Europe, where he concentrated on obtaining a patent for his system.</p>",
        "text": "Morse’s application for a federal grant was delayed until 1843, so he spent time traveling in Europe, where he concentrated on obtaining a patent for his system."
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
    "id": "invention-of-the-telegraph-2026-2027-form-c-official-shsat-2026-c-3",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "3"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-7d777becd67ec7838709.png\" alt=\"Official explanation for question 3\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 7.\nThe desperate Morse gave the go-ahead, and the line was completed in time for the dramatic and spectacularly successful link between the Supreme Court chamber of the Capitol building and the railroad station in Baltimore.\nThe words “dramatic” and “spectacularly” in the sentence convey a",
    "promptHtml": "<p>Read this sentence from <span>paragraph 7.</span></p> <p data-align=\"indent\"><strong>The desperate Morse gave the go-ahead, and the line was completed in time for the dramatic and spectacularly successful link between the Supreme Court chamber of the Capitol building and the railroad station in Baltimore.</strong></p> <p>The words “dramatic” and “spectacularly” in the sentence convey a</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>sense of relief and fulfillment that the line was finished.</p>",
        "text": "sense of relief and fulfillment that the line was finished."
      },
      {
        "id": "B",
        "html": "<p>sense of wonder and celebration that the telegraph line was accomplished.</p>",
        "text": "sense of wonder and celebration that the telegraph line was accomplished."
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
    "id": "invention-of-the-telegraph-2026-2027-form-c-official-shsat-2026-c-4",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "4"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-b8b75a5e2af274f259f7.png\" alt=\"Official explanation for question 4\">",
    "points": 1,
    "prompt": "How does the graph support the ideas in paragraph 8?",
    "promptHtml": "<p>How does the graph support the ideas in <span>paragraph 8?</span></p>",
    "topic": "",
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
    "id": "invention-of-the-telegraph-2026-2027-form-c-official-shsat-2026-c-5",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "5"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-7553b1e9059efcec8d25.png\" alt=\"Official explanation for question 5\">",
    "points": 1,
    "prompt": "The idea that, in the mid-nineteenth century, the United States was mostly unaware of the possibilities of electricity is illustrated in the passage mainly through the",
    "promptHtml": "<p>The idea that, in the mid-nineteenth century, the United States was mostly unaware of the possibilities of electricity is illustrated in the passage <strong>mainly</strong> through the</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>description of the government’s initial desire to expand a semaphore signaling system that used either flags or lights along the Atlantic Coast.</p>",
        "text": "description of the government’s initial desire to expand a semaphore signaling system that used either flags or lights along the Atlantic Coast."
      },
      {
        "id": "B",
        "html": "<p>delay by the House of Representatives to pass the bill funding Morse’s telegraph line <span>six years</span> after he first applied for the appropriation.</p>",
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
    "id": "invention-of-the-telegraph-2026-2027-form-c-official-shsat-2026-c-6",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "6"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-318efa6ccd47ad050f9f.png\" alt=\"Official explanation for question 6\">",
    "points": 1,
    "prompt": "With which statement would the author most likely agree?",
    "promptHtml": "<p>With which statement would the author <strong>most likely</strong> agree?</p>",
    "topic": "",
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

export const inventionOfTheTelegraph20262027FormCPassageSet: ExamPassageSet = {
  id: "ela-invention-of-the-telegraph-2026-2027-form-c",
  versionLabels: ["2026-2027 Form C"],
  section: "reading",
  questionCount: inventionOfTheTelegraph20262027FormCQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "invention-of-the-telegraph-2026-2027-form-c",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Invention of the Telegraph",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"C","section":"ELA - Passage Set 1 of 7","packageId":"016047f1ee77cf5224e518fbc03509d368e26cfea7c195c4fd644de01b8ae8c4"},
    title: "Invention of the Telegraph",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p><em>Samuel Morse, an American inventor, is credited with creating the electronic telegraph, a communication device that allows users to send messages using a system of short and long pulses that represent letters, numbers, and punctuation. In 1844, the United States Congress passed the Telegraph Bill, which provided Morse with the funds to build an electric telegraph system.</em></p><p><strong>Earlier Signal Systems</strong></p> <p data-numbered=\"true\"> Long before Samuel F. B. Morse electrically transmitted his famous message “What hath God wrought?” from Washington to Baltimore on <span>May 24,</span> 1844, there were signaling systems that enabled people to communicate over distances. Most were visual or “semaphore” systems using flags or lights. In the eighteenth century, such systems used an observer who would decipher a signal from a high tower on a distant hill and then send it on to the next station. The young American republic wanted just such a system along its entire Atlantic coast and offered a prize of $30,000 for a workable proposal. The framers of this <span data-glossary-definition=\"Telegraph Bill\" role=\"link\" tabindex=\"0\">legislation</span> had no way of knowing that when they used the word “telegraph” to refer to this visual semaphore system, they would be offered an entirely new and revolutionary means of communication—electricity.</p> <p><strong>The Growth of an Idea</strong></p> <p data-numbered=\"true\"> The idea of using electricity to communicate over distance is said to have occurred to Morse during a conversation aboard ship when he was returning from Europe in 1832. Michael Faraday’s recently invented electromagnet was much discussed by the ship’s passengers, and when Morse came to understand how it worked, he speculated that it might be possible to send a coded message over a wire. While a student at Yale College years before, he had written his parents a letter about how interesting he found the lectures on electricity. Despite what he had learned at Yale, Morse found when he began to develop his idea that he had little real understanding of the nature of electricity, and after sporadic attempts to work with batteries, magnets, and wires, he finally turned for help to a colleague at the University of the City of New York, <span>Leonard D.</span> Gale.</p> <p data-numbered=\"true\"> Gale was a professor of chemistry and familiar with the electrical work of Princeton’s Joseph Henry, a true pioneer in the new field. Well before Morse had his shipboard idea about a telegraph, Henry rang a bell at a distance by opening and closing an electric circuit. In 1831, he had published an article, of which Morse was unaware, that contained details suggesting the idea of an electric telegraph. Gale’s help and his knowledge of this article proved crucial to Morse’s telegraph system because Gale not only pointed out flaws in the system but showed Morse how he could regularly boost the strength of a signal and overcome the distance problems he had encountered by using a relay system Henry had invented. Henry’s experiments, Gale’s assistance, and, soon after, hiring the young technician Alfred Vail were keys to Morse’s success.</p> <p><strong>Obstacles and Opportunities</strong></p> <p data-numbered=\"true\"> By December 1837, Morse had enough confidence in his new system to apply for the federal government’s appropriation, and during the next year he conducted demonstrations of his telegraph both in New York and Washington.</p> <p data-numbered=\"true\"> However, when the economic disaster known as the Panic of 1837 took hold of the nation and caused a long depression, Morse was forced to wait for better times. It was during this period that Morse visited Europe again and tried not only to secure patent protection overseas but to examine competing telegraph systems in <span>England. . . .</span></p> <p data-numbered=\"true\"> By 1843, the country was beginning to recover economically, and Morse again asked Congress for the $30,000 that would allow him to build a telegraph line from Washington to Baltimore, forty miles away. The House of Representatives eventually passed the bill containing the Morse appropriation, and the Senate approved it in the final hours of that Congress’s last session. With President Tyler’s signature, Morse received the cash he needed and began to carry out plans for an underground telegraph line.</p> <p><strong>Realizing a Great Invention</strong></p> <p data-numbered=\"true\"> Morse had hired the ingenious construction engineer Ezra Cornell to lay the pipe carrying the wire, and although Cornell did his job superbly, one of Morse’s partners, Congressman <span>F. O. J.</span> Smith, had purchased wire with defective insulation. Too much time had been wasted laying bad wire, and with the project on a rigid deadline, something had to be done quickly. Cornell suggested that the fastest and cheapest way of connecting Washington and Baltimore was to string wires overhead on trees and poles. The desperate Morse gave the go-ahead, and the line was completed in time for the dramatic and spectacularly successful link between the Supreme Court chamber of the Capitol building and the railroad station in Baltimore.</p> <p data-numbered=\"true\"> Soon, as overhead wires connected cities up and down the Atlantic coast, the <span data-glossary-definition=\"short and long pulses of Morse code\" role=\"link\" tabindex=\"0\">dots-and-dashes method</span> that recorded messages on a long moving strip of paper was replaced by the operator’s ability to interpret the code in real <span>time. . . .</span> Telegraph lines soon extended westward, and within Morse’s own lifetime they connected the continents of Europe and America.</p><p data-align=\"center\"><img src=\"/exam-images/official-shsat-2026-c-e1affdc6c5ef26b2b36d.png\" alt=\" \" width=\"398\"></p><p data-align=\"center\"><img src=\"/exam-images/official-shsat-2026-c-62350c0349e0a5f2aa4e.svg\" alt=\" \" width=\"397\"></p>",
    sourceNote: "“Invention of the Telegraph”—Public Domain/Library of Congress",
    text: inventionOfTheTelegraph20262027FormCPassageText,
    versionLabel: "2026-2027 Form C",
  }),
  questions: inventionOfTheTelegraph20262027FormCQuestions,
};
