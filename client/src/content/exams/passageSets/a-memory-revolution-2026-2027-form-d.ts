import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const aMemoryRevolution20262027FormDPassageText = "A high school senior logs on to a computer at the library to double-check the application due date listed on a college admissions website. Nearby, a librarian helps a group of biology students use a database to search for recent studies about mammals. In the past few decades, the Internet has become an integral component of daily life for many people. The seemingly limitless power of search engines made the Internet search extremely common, and today people increasingly rely on the Internet’s vast accumulation of sources to access all types of information. Scientists are beginning to examine how this reliance is modifying the strategies people use to store and prioritize information in their mind.\nA Dependable and Valuable Asset\nPsychologist Benjamin Storm from the University of California, Santa Cruz, and researchers Sean Stone and Aaron Benjamin devised an experiment to study students’ tendency to depend on the Internet for facts. To begin, the scientists divided sixty participants into multiple groups, including an “Internet” group and a “memory” group, and placed them in front of computers. The Internet group was required to use the search engine Google to answer eight challenging trivia questions. In contrast, participants in the memory group were permitted to use only their personal knowledge to answer the questions. In the second round, the researchers administered notably easier questions. This time, they allowed each group the option of using Google as they answered. Their results showed that 83 percent of the Internet group continued to consult Google in the second round, while only 63 percent of the memory group chose to do so.\nPeople’s growing inclination to rely on the Internet in order to retrieve information, particularly facts and figures, is called cognitive offloading. Canadian researcher Evan F. Risko and British researcher Sam Gilbert, who have written extensively about the topic, say a similar process has been taking place for centuries. In the past, people used resources like encyclopedias to assist their memories; however, today the Internet, serving as a vast extended memory, allows people to digitally access and retrieve much larger volumes of information. Consequently, people’s minds are free for other cognitive feats, such as connecting data, learning new information, or solving problems.\nFiling Information Away\nThe use of the Internet also appears to be modifying the strategies people use to store information in their mind. Researchers Betsy Sparrow from Columbia University, Jenny Liu from the University of Wisconsin-Madison, and Daniel Wegner from Harvard University conducted several studies to discover how people efficiently manage their information intake.\nTo begin, the researchers examined how people evaluate which information deserves their effort to remember. For this experiment, participants read forty trivia facts, such as “An ostrich’s eye is bigger than its brain,” and typed the statements into a computer file. Half the participants had been previously told the file would be saved, while half believed it would be erased. Next, the participants wrote down every fact they could recall. Those who believed the information would be erased and no longer available could recall 40 percent more facts than those who thought the information would be saved.\nIn another experiment, the same researchers tested the ability of study participants to remember where to access information. For this trial, participants read and typed trivia statements, which they saved in folders with generic names such as “Facts” and “Items.” After spending ten minutes writing down all the facts they could recall from memory, participants were asked which folder contained a particular fact based on a keyword. For example, “Which folder has the fact about ostriches?” Overall, participants recalled the information’s location more often than the content itself, correctly identifying 49 percent of the folders for specific facts while remembering only 23 percent of the actual trivia. The researchers concluded that our memory is adapting to the Internet age by prioritizing where to locate information even when the specific details are forgotten. According to Sparrow, the Internet has become an important form of transactive memory, an external source of the recollections and associative networks that constitute memory.\nAs the Internet’s resources continue to expand our “external” memory, some question whether the process may cause people to depend too heavily on technology. However, Steven Pinker, a professor of psychology at Harvard University, says, “Knowledge is increasing exponentially; human brainpower and waking hours are not. Fortunately, the Internet and information technologies are helping us manage, search and retrieve our collective intellectual output at different scales, from Twitter and previews to e-books and online encyclopedias. Far from making us stupid, these technologies are the only things that will keep us smart.”";

const aMemoryRevolution20262027FormDQuestions: ExamQuestion[] = [
  {
    "id": "a-memory-revolution-2026-2027-form-d-official-shsat-2026-d-1",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "1"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-8f2d3188c006b14f6866.png\" alt=\"Official explanation for question 1\">",
    "points": 1,
    "prompt": "The details in paragraph 3 about cognitive offloading convey a central idea of the passage by",
    "promptHtml": "<p>The details in paragraph 3 about cognitive offloading convey a central idea of the passage by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggesting that reliance on the Internet for information is inevitable.</p>",
        "text": "suggesting that reliance on the Internet for information is inevitable."
      },
      {
        "id": "B",
        "html": "<p>demonstrating how the methods used to store and find information have changed over time.</p>",
        "text": "demonstrating how the methods used to store and find information have changed over time."
      },
      {
        "id": "C",
        "html": "<p>explaining how encyclopedias and the Internet are similar sources of information.</p>",
        "text": "explaining how encyclopedias and the Internet are similar sources of information."
      },
      {
        "id": "D",
        "html": "<p>implying that more information can be understood now than ever before.</p>",
        "text": "implying that more information can be understood now than ever before."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "a-memory-revolution-2026-2027-form-d-official-shsat-2026-d-2",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "2"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-8612243912a99ef9e355.png\" alt=\"Official explanation for question 2\">",
    "points": 1,
    "prompt": "How do the details about the experiment described in paragraph 5 convey a central idea of the passage?",
    "promptHtml": "<p>How do the details about the experiment described in <span>paragraph 5</span> convey a central idea of the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>They suggest that the act of repeating information by typing it on a keyboard may improve a person’s memory.</p>",
        "text": "They suggest that the act of repeating information by typing it on a keyboard may improve a person’s memory."
      },
      {
        "id": "B",
        "html": "<p>They explain that a person will forget information faster if the information is considered unimportant.</p>",
        "text": "They explain that a person will forget information faster if the information is considered unimportant."
      },
      {
        "id": "C",
        "html": "<p>They indicate that a person may start to forget details when the amount of information becomes overwhelming.</p>",
        "text": "They indicate that a person may start to forget details when the amount of information becomes overwhelming."
      },
      {
        "id": "D",
        "html": "<p>They suggest that memory is affected by whether a person expects to have access to the information in the future.</p>",
        "text": "They suggest that memory is affected by whether a person expects to have access to the information in the future."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "a-memory-revolution-2026-2027-form-d-official-shsat-2026-d-3",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "3"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-2e737f84277fa278aff6.png\" alt=\"Official explanation for question 3\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 7.\n\nAs the Internet’s resources continue to expand our “external” memory, some question whether the process may cause people to depend too heavily on technology.\n\nHow does the sentence contribute to the structure and development of ideas in the passage?",
    "promptHtml": "<p>Read this sentence from paragraph 7.</p><blockquote><strong><strong>As the Internet’s resources continue to expand our “external” memory, some question whether the process may cause people to depend too heavily on technology.</strong></strong></blockquote><p>How does the sentence contribute to the structure and development of ideas in the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It presents a claim about the risks of relying on the Internet that prompted the research described in <span>paragraphs 2</span> and 6.</p>",
        "text": "It presents a claim about the risks of relying on the Internet that prompted the research described in paragraphs 2 and 6."
      },
      {
        "id": "B",
        "html": "<p>It contrasts a disadvantage of relying on the Internet with the benefits of Internet use that are described in <span>paragraphs 2</span> and 6.</p>",
        "text": "It contrasts a disadvantage of relying on the Internet with the benefits of Internet use that are described in paragraphs 2 and 6."
      },
      {
        "id": "C",
        "html": "<p>It signals a shift from a neutral viewpoint in <span>paragraphs 2</span> and 6 to a presentation of an argument and a counterargument.</p>",
        "text": "It signals a shift from a neutral viewpoint in paragraphs 2 and 6 to a presentation of an argument and a counterargument."
      },
      {
        "id": "D",
        "html": "<p>It introduces a counterargument and marks a transition from an optimistic tone in <span>paragraphs 2</span> and 6 to a cautious tone as the counterargument is developed.</p>",
        "text": "It introduces a counterargument and marks a transition from an optimistic tone in paragraphs 2 and 6 to a cautious tone as the counterargument is developed."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-memory-revolution-2026-2027-form-d-official-shsat-2026-d-4",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "4"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-19234285c23c133192af.png\" alt=\"Official explanation for question 4\">",
    "points": 1,
    "prompt": "The study described in paragraph 6 influenced researchers’ ideas about memory in the digital age by",
    "promptHtml": "<p>The study described in <span>paragraph 6</span> influenced researchers’ ideas about memory in the digital age by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>highlighting instances when organizing detailed information made it easier to remember.</p>",
        "text": "highlighting instances when organizing detailed information made it easier to remember."
      },
      {
        "id": "B",
        "html": "<p>confirming that keywords can be remembered more easily than large amounts of information.</p>",
        "text": "confirming that keywords can be remembered more easily than large amounts of information."
      },
      {
        "id": "C",
        "html": "<p>identifying a shift in focus from remembering specific information to knowing where to find it.</p>",
        "text": "identifying a shift in focus from remembering specific information to knowing where to find it."
      },
      {
        "id": "D",
        "html": "<p>emphasizing that remembering a basic idea is more important than storing detailed information.</p>",
        "text": "emphasizing that remembering a basic idea is more important than storing detailed information."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-memory-revolution-2026-2027-form-d-official-shsat-2026-d-5",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "5"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-a2cd46000d6c2321e29a.png\" alt=\"Official explanation for question 5\">",
    "points": 1,
    "prompt": "How does the diagram provide additional support for the topic presented in the passage?",
    "promptHtml": "<p>How does the diagram provide additional support for the topic presented in the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It reveals why human brains must adapt to obtaining information from the Internet as opposed to other sources.</p>",
        "text": "It reveals why human brains must adapt to obtaining information from the Internet as opposed to other sources."
      },
      {
        "id": "B",
        "html": "<p>It indicates how people can use the Internet to help improve their long-term recollection of information.</p>",
        "text": "It indicates how people can use the Internet to help improve their long-term recollection of information."
      },
      {
        "id": "C",
        "html": "<p>It shows how study participants’ brains distinguished between important and unimportant details.</p>",
        "text": "It shows how study participants’ brains distinguished between important and unimportant details."
      },
      {
        "id": "D",
        "html": "<p>It depicts the idea that repetition and rehearsal are necessary to recall information when tools such as search engines are unavailable.</p>",
        "text": "It depicts the idea that repetition and rehearsal are necessary to recall information when tools such as search engines are unavailable."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "a-memory-revolution-2026-2027-form-d-official-shsat-2026-d-6",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "6"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-5c81e4d6c92a509697c4.png\" alt=\"Official explanation for question 6\">",
    "points": 1,
    "prompt": "Which evidence from the passage is most relevant to the claim in paragraph 7 that “ ‘far from making us stupid, these technologies are the only things that will keep us smart’ ”?",
    "promptHtml": "<p>Which evidence from the passage is <strong>most</strong> relevant to the claim in <span>paragraph 7</span> that <span>“ ‘far</span> from making us stupid, these technologies are the only things that will keep us <span>smart’ ”?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the revelation that most people opted to use the Internet to answer relatively easy trivia questions rather than relying on their own brainpower (paragraph 2)</p>",
        "text": "the revelation that most people opted to use the Internet to answer relatively easy trivia questions rather than relying on their own brainpower (paragraph 2)"
      },
      {
        "id": "B",
        "html": "<p>the assertion that the storage of information on the Internet frees people to focus on higher-order tasks such as problem solving (paragraph 3)</p>",
        "text": "the assertion that the storage of information on the Internet frees people to focus on higher-order tasks such as problem solving (paragraph 3)"
      },
      {
        "id": "C",
        "html": "<p>the connection between how people organize information in their mind and their ability to recall that information (paragraph 5)</p>",
        "text": "the connection between how people organize information in their mind and their ability to recall that information (paragraph 5)"
      },
      {
        "id": "D",
        "html": "<p>the description of transactive memory as an expansive external source that people can use to store information (paragraph 6)</p>",
        "text": "the description of transactive memory as an expansive external source that people can use to store information (paragraph 6)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "a-memory-revolution-2026-2027-form-d-official-shsat-2026-d-7",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 1 of 7",
      "sourceQuestion": "7"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-b13ab089a126135f0429.png\" alt=\"Official explanation for question 7\">",
    "points": 1,
    "prompt": "The effect of the Internet on a person’s memory is illustrated in the passage through the presentation of studies that",
    "promptHtml": "<p>The effect of the Internet on a person’s memory is illustrated in the passage through the presentation of studies that</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>examine how the use of search engines changes the way people evaluate and store information for future access.</p>",
        "text": "examine how the use of search engines changes the way people evaluate and store information for future access."
      },
      {
        "id": "B",
        "html": "<p>highlight the difference between the capacity of the Internet and the ability of the human brain to locate information.</p>",
        "text": "highlight the difference between the capacity of the Internet and the ability of the human brain to locate information."
      },
      {
        "id": "C",
        "html": "<p>compare the type of information that can be obtained from the Internet with the type of information that is stored in the human brain.</p>",
        "text": "compare the type of information that can be obtained from the Internet with the type of information that is stored in the human brain."
      },
      {
        "id": "D",
        "html": "<p>emphasize the ease of obtaining information through search engines rather than remembering it without assistance.</p>",
        "text": "emphasize the ease of obtaining information through search engines rather than remembering it without assistance."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const aMemoryRevolution20262027FormDPassageSet: ExamPassageSet = {
  id: "ela-a-memory-revolution-2026-2027-form-d",
  versionLabels: ["2026-2027 Form D"],
  section: "reading",
  questionCount: aMemoryRevolution20262027FormDQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "a-memory-revolution-2026-2027-form-d",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "A Memory Revolution",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"D","section":"ELA - Passage Set 1 of 7","packageId":"f2ea66b7a8e43d451156378ca62ee0b997192df6a0156b3122227c5b4e26f7d8"},
    title: "A Memory Revolution",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\"> A high school senior logs on to a computer at the library to double-check the application due date listed on a college admissions website. Nearby, a librarian helps a group of biology students use a database to search for recent studies about mammals. In the past few decades, the Internet has become an integral component of daily life for many people. The seemingly limitless power of search engines made the Internet search extremely common, and today people increasingly rely on the Internet’s vast accumulation of sources to access all types of information. Scientists are beginning to examine how this reliance is modifying the strategies people use to store and prioritize information in their mind.</p> <h3>A Dependable and Valuable Asset</h3> <p data-numbered=\"true\"> Psychologist Benjamin Storm from the University of California, Santa Cruz, and researchers Sean Stone and Aaron Benjamin devised an experiment to study students’ tendency to depend on the Internet for facts. To begin, the scientists divided sixty participants into multiple groups, including an “Internet” group and a “memory” group, and placed them in front of computers. The Internet group was required to use the search engine Google to answer eight challenging trivia questions. In contrast, participants in the memory group were permitted to use only their personal knowledge to answer the questions. In the second round, the researchers administered notably easier questions. This time, they allowed each group the option of using Google as they answered. Their results showed that <span>83 percent</span> of the Internet group continued to consult Google in the second round, while only <span>63 percent</span> of the memory group chose to do so.</p> <p data-numbered=\"true\"> People’s growing inclination to rely on the Internet in order to retrieve information, particularly facts and figures, is called cognitive offloading. Canadian researcher Evan F. Risko and British researcher Sam Gilbert, who have written extensively about the topic, say a similar process has been taking place for centuries. In the past, people used resources like encyclopedias to assist their memories; however, today the Internet, serving as a vast extended memory, allows people to digitally access and retrieve much larger volumes of information. Consequently, people’s minds are free for other cognitive feats, such as connecting data, learning new information, or solving problems.</p> <h3>Filing Information Away</h3> <p data-numbered=\"true\"> The use of the Internet also appears to be modifying the strategies people use to store information in their mind. Researchers Betsy Sparrow from Columbia University, Jenny Liu from the University of Wisconsin-Madison, and Daniel Wegner from Harvard University conducted several studies to discover how people efficiently manage their information intake.</p> <p data-numbered=\"true\"> To begin, the researchers examined how people evaluate which information deserves their effort to remember. For this experiment, participants read forty trivia facts, such as “An ostrich’s eye is bigger than its brain,” and typed the statements into a computer file. Half the participants had been previously told the file would be saved, while half believed it would be erased. Next, the participants wrote down every fact they could recall. Those who believed the information would be erased and no longer available could recall <span>40 percent</span> more facts than those who thought the information would be saved.</p> <p data-numbered=\"true\"> In another experiment, the same researchers tested the ability of study participants to remember where to access information. For this trial, participants read and typed trivia statements, which they saved in folders with generic names such as “Facts” and “Items.” After spending ten minutes writing down all the facts they could recall from memory, participants were asked which folder contained a particular fact based on a keyword. For example, “Which folder has the fact about ostriches?” Overall, participants recalled the information’s location more often than the content itself, correctly identifying <span>49 percent</span> of the folders for specific facts while remembering only <span>23 percent</span> of the actual trivia. The researchers concluded that our memory is adapting to the Internet age by prioritizing where to locate information even when the specific details are forgotten. According to Sparrow, the Internet has become an important form of transactive memory, an external source of the recollections and associative networks that constitute memory.</p> <p data-numbered=\"true\"> As the Internet’s resources continue to expand our “external” memory, some question whether the process may cause people to depend too heavily on technology. However, Steven Pinker, a professor of psychology at Harvard University, says, “Knowledge is increasing exponentially; human brainpower and waking hours are not. Fortunately, the Internet and information technologies are helping us manage, search and retrieve our collective intellectual output at different scales, from Twitter and previews to e-books and online encyclopedias. Far from making us stupid, these technologies are the only things that will keep us smart.”</p><p data-align=\"center\"><img src=\"/exam-images/official-shsat-2026-d-6a5720a12061e95f5878.svg\" alt=\"A flow chart titled How Memory Works shows how new information is processed by sensory memory, short-term memory, and long-term memory. In short-term memory, information is maintained through repetition, while unrehearsed information is forgotten. Long-term memory is retrieved into short-term memory as needed. Information that is unretrieved may be forgotten over time.\" width=\"393\"></p>",
    text: aMemoryRevolution20262027FormDPassageText,
    versionLabel: "2026-2027 Form D",
  }),
  questions: aMemoryRevolution20262027FormDQuestions,
};
