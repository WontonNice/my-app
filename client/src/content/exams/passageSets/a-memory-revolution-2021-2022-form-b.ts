import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const aMemoryRevolution20212022FormBPassageText = "A high school senior logs on to a computer at the library to double-check the application due date listed on a college admissions website. Nearby, a librarian helps a group of biology students use a database to search for recent studies about mammals. In the past few decades, the Internet has become an integral component of daily life for many people. The seemingly limitless power of search engines made the Internet search extremely common, and today people increasingly rely on the Internet’s vast accumulation of sources to access all types of information. Scientists are beginning to examine how this reliance is modifying the strategies people use to store and prioritize information in their mind.\n\nA Dependable and Valuable Asset\n\nPsychologist Benjamin Storm from the University of California, Santa Cruz, and researchers Sean Stone and Aaron Benjamin devised an experiment to study students’ tendency to depend on the Internet for facts. To begin, the scientists divided sixty participants into multiple groups, including an “Internet” group and a “memory” group, and placed them in front of computers. The Internet group was required to use the search engine Google to answer eight challenging trivia questions. In contrast, participants in the memory group were permitted to use only their personal knowledge to answer the questions. In the second round, the researchers administered notably easier questions. This time, they allowed each group the option of using Google as they answered. Their results showed that 83 percent of the Internet group continued to consult Google in the second round, while only 63 percent of the memory group chose to do so.\n\nPeople’s growing inclination to rely on the Internet in order to retrieve information, particularly facts and figures, is called cognitive offloading. Canadian researcher Evan F. Risko and British researcher Sam Gilbert, who have written extensively about the topic, say a similar process has been taking place for centuries. In the past, people used resources like encyclopedias to assist their memories; however, today the Internet, serving as a vast extended memory, allows people to digitally access and retrieve much larger volumes of information. Consequently, people’s minds are free for other cognitive feats, such as connecting data, learning new information, or solving problems.\n\nFiling Information Away\n\nThe use of the Internet also appears to be modifying the strategies people use to store information in their mind. Researchers Betsy Sparrow from Columbia University, Jenny Liu from the University of Wisconsin-Madison, and Daniel Wegner from Harvard University conducted several studies to discover how people efficiently manage their information intake.\n\nTo begin, the researchers examined how people evaluate which information deserves their effort to remember. For this experiment, participants read forty trivia facts, such as “An ostrich’s eye is bigger than its brain,” and typed the statements into a computer file. Half the participants had been previously told the file would be saved, while half believed it would be erased. Next, the participants wrote down every fact they could recall. Those who believed the information would be erased and no longer available could recall 40 percent more facts than those who thought the information would be saved.\n\nIn another experiment, the same researchers tested the ability of study participants to remember where to access information. For this trial, participants read and typed trivia statements, which they saved in folders with generic names such as “Facts” and “Items.” After spending ten minutes writing down all the facts they could recall from memory, participants were asked which folder contained a particular fact based on a keyword. For example, “Which folder has the fact about ostriches?” Overall, participants recalled the information’s location more often than the content itself, correctly identifying 49 percent of the folders for specific facts while remembering only 23 percent of the actual trivia. The researchers concluded that our memory is adapting to the Internet age by prioritizing where to locate information even when the specific details are forgotten. According to Sparrow, the Internet has become an important form of transactive memory, an external source of the recollections and associative networks that constitute memory.\n\nAs the Internet’s resources continue to expand our “external” memory, some question whether the process may cause people to depend too heavily on technology. However, Steven Pinker, a professor of psychology at Harvard University, says, “Knowledge is increasing exponentially; human brainpower and waking hours are not. Fortunately, the Internet and information technologies are helping us manage, search and retrieve our collective intellectual output at different scales, from Twitter and previews to e-books and online encyclopedias. Far from making us stupid, these technologies are the only things that will keep us smart.”";

const aMemoryRevolution20212022FormBQuestions: ExamQuestion[] = [
  {
    "id": "a-memory-revolution-2021-2022-form-b-pdf-shsat-2021-2022-b-q050",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "50",
      "pages": [
        34
      ]
    },
    "explanation": "The question asks how the details in paragraph 3 about cognitive offloading convey a central\nidea of the passage.\nE. Incorrect. Although paragraph 3 describes the Internet as “a vast extended memory,” it does\nnot discuss reliance on the Internet for information. The paragraph states that the Internet\n“allows people to digitally access and retrieve much larger volumes of information” and\nindicates that this benefit leaves people free to focus on “connecting data, learning new\ninformation, or solving problems.” However, these details about the benefits of the Internet\ndo not express an opinion about the inevitability of Internet reliance.\nF. CORRECT. A central idea of the passage is that the Internet is changing how people retain\ninformation. Paragraph 3 supports this idea by stating that “a similar process has been taking\nplace for centuries” and that “in the past,” resources such as encyclopedias were used to\nstore and find information. The details provided in paragraph 3 about encyclopedias and the\nInternet show that people have always used resources to remember information and that\nthese resources change over time as people develop new ways to “assist their memories.”\nG. Incorrect. While paragraph 3 does compare the use of encyclopedias to obtain information in\nthe past with the use of today’s Internet, this comparison fails to convey the central idea of\nthe passage that the Internet is changing how people remember information.\nH. Incorrect. Although paragraph 3 states that “much larger volumes of information” are\navailable on the Internet than what has been available in previous methods of information\nstorage, such as encyclopedias, this fact does not relate to an increase in the ability to\nunderstand that information and is not a central idea of the passage.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q050-explanation-1.png\" alt=\"Official explanation for source question 50; original printed answer labels retained.\" width=\"690\"></p>",
    "points": 1,
    "prompt": "The details in paragraph 3 about cognitive offloading convey a central idea of the passage by",
    "promptHtml": "<p>The details in paragraph 3 about cognitive offloading convey a central idea of the passage by</p>",
    "topic": "Central Idea & Theme",
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
    "id": "a-memory-revolution-2021-2022-form-b-pdf-shsat-2021-2022-b-q051",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "51",
      "pages": [
        35
      ]
    },
    "explanation": "The question asks how the details of the experiment described in paragraph 5 convey a central\nidea of the passage.\nA. Incorrect. Although paragraph 5 states that participants read the trivia facts and then “typed\nthe statements into a computer file,” it does not explain the impact of repetition on memory,\nnor does this convey a central idea of the passage.\nB. Incorrect. Paragraph 5 acknowledges that people evaluate which information is important\nenough to remember, but it does not describe the rate at which people forget unimportant\ninformation. According to the paragraph, information is considered less important to\nremember if a person believes that he or she will be able to retrieve that information easily in\nthe future. This does not mean the information is unimportant but rather that it is readily\navailable for future access.\nC. Incorrect. Paragraph 5 specifies the number of trivia facts that study participants were given\nto read (forty), but it does not describe the amount of information as a factor in the\nparticipants’ memory performance. According to the paragraph, it was not the amount of\ninformation but rather the expectation of future availability that affected how much\ninformation participants were able to recall.\nD. CORRECT. A central idea of the passage is that the way the human memory stores\ninformation is changing because of the Internet. The details of the experiment support this\nidea by indicating that study participants remembered different amounts of information\nbased on whether they “thought the information would be saved” (paragraph 5). Those who\n“believed the information would be erased and no longer available” (paragraph 5)\nremembered 40 percent more than those who expected to be able to access the information\nagain in a saved computer file. Therefore, paragraph 5 conveys the central idea that the\nexpectation of future access to information is a key element in “how people evaluate which\ninformation deserves their effort to remember.”",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q051-explanation-1.png\" alt=\"Official explanation for source question 51; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "How do the details about the experiment described in paragraph 5 convey a central idea of the passage?",
    "promptHtml": "<p>How do the details about the experiment described in paragraph 5 convey a central idea of the passage?</p>",
    "topic": "Central Idea & Theme",
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
    "id": "a-memory-revolution-2021-2022-form-b-pdf-shsat-2021-2022-b-q052",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "52",
      "pages": [
        35
      ]
    },
    "explanation": "The question asks how the sentence from paragraph 7 contributes to the structure and\ndevelopment of ideas in the passage.\nE. Incorrect. Although the studies showed, in part, that reliance on the Internet is increasing\n(“participants recalled the information’s location more often than the content itself”\n[paragraph 6]), the studies were not conducted in order to determine the risks of Internet\nuse. The claim in the sentence did not prompt the research described in paragraphs 2 and 6.\nF, Incorrect. While the sentence in paragraph 7 poses a question about the disadvantages of\nrelying on the Internet, paragraphs 2 and 6 present the study data on Internet use and\nmemory in a neutral tone (“correctly identifying 49 percent of the folders for specific facts\nwhile remembering only 23 percent of the actual trivia” [paragraph 6]). Neither study\ndescribes the availability of information on the Internet as an advantage or a disadvantage.\nG. CORRECT. Paragraphs 2 and 6 describe the results of experiments related to the Internet’s\neffect on memory without commenting on the advantages or disadvantages of relying on that\ntechnology, and the sentence in paragraph 7 presents a questioning viewpoint that moves\naway from the neutral perspective of the broader passage. The opinion in the sentence is\ndirectly argued against in the three sentences that follow it, which present an extended quote\nfrom Steven Pinker, a psychology professor at Harvard University. Pinker refutes the idea\nexpressed by the sentence, stating that “knowledge is increasing exponentially; human\nbrainpower and waking hours are not.” He adds that technologies such as the Internet “are\nthe only things that will keep us smart.”\nH. Incorrect. Although the sentence in paragraph 7 expresses caution about the possible effects\nof the Internet on memory, the passage does not shift from an optimistic tone to a cautious\ntone. Actually, paragraph 6 provides the data on Internet use and memory in a neutral tone.\nThe argument expressed by the sentence is also not elaborated on in the sentences that\nfollow, but is immediately argued against by Steven Pinker, a professor of psychology. The\nlast sentence of paragraph 7 in fact refutes the culled sentence: “ ‘Far from making us stupid,\nthese technologies are the only things that will keep us smart.’ ”",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q052-explanation-1.png\" alt=\"Official explanation for source question 52; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 7.\n\nAs the Internet’s resources continue to expand our “external” memory, some question whether the process may cause people to depend too heavily on technology.\n\nHow does the sentence contribute to the structure and development of ideas in the passage?",
    "promptHtml": "<p>Read this sentence from paragraph 7.</p><blockquote><strong>As the Internet’s resources continue to expand our “external” memory, some question whether the process may cause people to depend too heavily on technology.</strong></blockquote><p>How does the sentence contribute to the structure and development of ideas in the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It presents a claim about the risks of relying on the Internet that prompted the research described in paragraphs 2 and 6.</p>",
        "text": "It presents a claim about the risks of relying on the Internet that prompted the research described in paragraphs 2 and 6."
      },
      {
        "id": "B",
        "html": "<p>It contrasts a disadvantage of relying on the Internet with the benefits of Internet use that are described in paragraphs 2 and 6.</p>",
        "text": "It contrasts a disadvantage of relying on the Internet with the benefits of Internet use that are described in paragraphs 2 and 6."
      },
      {
        "id": "C",
        "html": "<p>It signals a shift from a neutral viewpoint in paragraphs 2 and 6 to a presentation of an argument and a counterargument.</p>",
        "text": "It signals a shift from a neutral viewpoint in paragraphs 2 and 6 to a presentation of an argument and a counterargument."
      },
      {
        "id": "D",
        "html": "<p>It introduces a counterargument and marks a transition from an optimistic tone in paragraphs 2 and 6 to a cautious tone as the counterargument is developed.</p>",
        "text": "It introduces a counterargument and marks a transition from an optimistic tone in paragraphs 2 and 6 to a cautious tone as the counterargument is developed."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-memory-revolution-2021-2022-form-b-pdf-shsat-2021-2022-b-q053",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "53",
      "pages": [
        35
      ]
    },
    "explanation": "The question asks how the study described in paragraph 6 influenced researchers’ ideas about\nmemory in the digital age.\nA. Incorrect. The study required participants to organize information into folders, but the results\nsuggest that organizing the information did not make the information easier to remember;\ninstead, participants remembered the folder in which to find the information but forgot the\ninformation itself.\nB. Incorrect. Although the participants in the study were given a keyword, such as “ostrich,”\nwhen asked to remember “which folder contained a particular fact,” the study was significant\nfor researchers because it demonstrated that “our memory is adapting to the Internet age by\nprioritizing where to locate information even when the specific details are forgotten”\n(paragraph 6). The study confirmed that participants were remembering where the\ninformation was stored, because they were able to provide the name of the folder (keyword)\nwhere the information was stored.\nC. CORRECT. The study in paragraph 6 demonstrated that participants were better able to\nrecall where to find certain information than to recall the information itself. This influenced\nresearchers’ ideas about memory in the digital age: “Overall, participants recalled the\ninformation’s location more often than the content itself, correctly identifying 49 percent of\nthe folders for specific facts while remembering only 23 percent of the actual trivia”\n(paragraph 6).\nD. Incorrect. The study did not examine the relative importance of remembering basic\ninformation or storing detailed information. It examined the effect of the Internet on the\ninformation that people remember and concluded that human memory “is adapting to the\nInternet age by prioritizing where to locate information” (paragraph 6).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q053-explanation-1.png\" alt=\"Official explanation for source question 53; original printed answer labels retained.\" width=\"690\"></p>",
    "points": 1,
    "prompt": "The study described in paragraph 6 influenced researchers’ ideas about memory in the digital age by",
    "promptHtml": "<p>The study described in paragraph 6 influenced researchers’ ideas about memory in the digital age by</p>",
    "topic": "Inference",
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
    "id": "a-memory-revolution-2021-2022-form-b-pdf-shsat-2021-2022-b-q054",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "54",
      "pages": [
        36
      ]
    },
    "explanation": "The question asks how the diagram provides additional support for the topic presented in\nthe passage.\nE. Incorrect. While the diagram indicates that the human brain has the ability to maintain\ndifferent types of memory, the diagram does not show the need for the brain to adapt to\nobtaining information from the Internet rather than from other sources.\nF. Incorrect. The diagram enhances the reader’s understanding of how long-term memories are\nformed, but it does not provide details about how the Internet can be used to improve long-\nterm recollection of information.\nG. Incorrect. The diagram provides an understanding of how details that are important to people\ncan become stored because of an effort made to recall them. However, the diagram does not\nshow how people decide which information is important and which is not.\nH. CORRECT. The diagram depicts the connections that the human brain maintains between the\ndifferent forms of memory. It also illustrates the idea that repetition and rehearsal are\nimportant steps in creating memories, as unrehearsed information will be forgotten. This\nsupports the passage by highlighting the idea that access to search engines and other tools\nleads people to skip rehearsal and repetition steps that create memories, because people\nknow that the information is readily accessible.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q054-explanation-1.png\" alt=\"Official explanation for source question 54; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "How does the diagram provide additional support for the topic presented in the passage?",
    "promptHtml": "<p>How does the diagram provide additional support for the topic presented in the passage?</p>",
    "topic": "Text Structure & Purpose",
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
    "id": "a-memory-revolution-2021-2022-form-b-pdf-shsat-2021-2022-b-q055",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "55",
      "pages": [
        36
      ]
    },
    "explanation": "The question asks for the evidence from the passage that is most relevant to the claim in\nparagraph 7 that “ ‘far from making us stupid, these technologies are the only things that will\nkeep us smart.’ ”\nA. Incorrect. Whether the participants decided to use the Internet to answer easy trivia\nquestions varied based on the options that the participants were given during the first part of\nthe experiment and, therefore, cannot be relevant to the claim in paragraph 7. Even when\ngiven the option of using the Internet, some participants chose to recall information from\nmemory instead.\nB. CORRECT. The assertion made in paragraph 3 that states that cognitive offloading allows for\n“people’s minds [to be] free for other cognitive feats, such as connecting data, learning new\ninformation, or solving problems” is relevant to the claim in paragraph 7 because it indicates\nthat the ability to store large amounts of information within the brain does not necessarily\nmake someone smart. It also suggests that if people did not have to use so much effort\nsimply organizing and storing information, their brain would be free to conduct higher-order\ntasks: “the Internet, serving as a vast extended memory, allows people to digitally access\nand retrieve much larger volumes of information. Consequently, people’s minds are free for\nother cognitive feats, such as connecting data, learning new information, or solving\nproblems” (paragraph 3).\nC. Incorrect. The discussion in the passage connecting how people organize information in their\nmind and their ability to recall that information focuses on the process of organizing\ninformation within human memory rather than on how technology helps keep people’s minds\navailable for complex thoughts.\nD. Incorrect. Although the passage provides an accurate description of transactive memory, it\nprovides no indication of how using such memory would advance a person’s ability to\nmaintain or improve intelligent thought.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q055-explanation-1.png\" alt=\"Official explanation for source question 55; original printed answer labels retained.\" width=\"690\"></p>",
    "points": 1,
    "prompt": "Which evidence from the passage is most relevant to the claim in paragraph 7 that “ ‘far from making us stupid, these technologies are the only things that will keep us smart’ ”?",
    "promptHtml": "<p>Which evidence from the passage is most relevant to the claim in paragraph 7 that “ ‘far from making us stupid, these technologies are the only things that will keep us smart’ ”?</p>",
    "topic": "Evidence & Support",
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
    "id": "a-memory-revolution-2021-2022-form-b-pdf-shsat-2021-2022-b-q056",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "56",
      "pages": [
        37
      ]
    },
    "explanation": "The question asks which sentence from the passage suggests that using Internet search engines\nmay lead people to rely less on their own ability to recall information.\nE. Incorrect. While the sentence in paragraph 1 refers to the increase in use that has made the\nInternet “an integral component” of everyday life for many people, it does not address\nmemory or explain the effect of Internet use on a person’s ability to recall information.\nF. Incorrect. Although the sentence in paragraph 2 refers to research that was conducted to\ndetermine how the use of the Internet affects a person’s memory, the sentence simply\nexplains one guideline of the study. The fact that the study required one group of participants\nto use Google does not indicate whether using a search engine affects the degree to which\npeople rely on their own ability to recall information.\nG. CORRECT. The sentence in paragraph 2 reveals the results of a study that allowed half the\nparticipants to use Google to obtain answers to trivia questions and initially required the\nother half to use only their memory to answer questions. The sentence states that\n“83 percent of the Internet group continued to consult Google in the second round” and that\n“only 63 percent of the memory group chose to do so.” These statistics demonstrate that\nusing Google in the first round resulted in participants in the Internet group relying more\nheavily on the Internet search engine to recall information in the second round, whereas\nparticipants who had not used Google in the first round were more likely to rely on their own\nability to recall information.\nH. Incorrect. The sentence in paragraph 5 describes a task presented to participants in a\nresearch study. Although the study was designed to examine “how people evaluate which\ninformation deserves their effort to remember” (paragraph 5), the sentence does not indicate\nthat use of Internet search engines prompted people to rely less on their own ability to recall\ninformation.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q056-explanation-1.png\" alt=\"Official explanation for source question 56; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "Which sentence from the passage suggests that using Internet search engines may lead people to rely less on their own ability to recall information?",
    "promptHtml": "<p>Which sentence from the passage suggests that using Internet search engines may lead people to rely less on their own ability to recall information?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>“In the past few decades, the Internet has become an integral component of daily life for many people.” (paragraph 1)</p>",
        "text": "“In the past few decades, the Internet has become an integral component of daily life for many people.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“The Internet group was required to use the search engine Google to answer eight challenging trivia questions.” (paragraph 2)</p>",
        "text": "“The Internet group was required to use the search engine Google to answer eight challenging trivia questions.” (paragraph 2)"
      },
      {
        "id": "C",
        "html": "<p>“Their results showed that 83 percent of the Internet group continued to consult Google in the second round, while only 63 percent of the memory group chose to do so.” (paragraph 2)</p>",
        "text": "“Their results showed that 83 percent of the Internet group continued to consult Google in the second round, while only 63 percent of the memory group chose to do so.” (paragraph 2)"
      },
      {
        "id": "D",
        "html": "<p>“For this experiment, participants read forty trivia facts, such as ‘An ostrich’s eye is bigger than its brain,’ and typed the statements into a computer file.” (paragraph 5)</p>",
        "text": "“For this experiment, participants read forty trivia facts, such as ‘An ostrich’s eye is bigger than its brain,’ and typed the statements into a computer file.” (paragraph 5)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-memory-revolution-2021-2022-form-b-pdf-shsat-2021-2022-b-q057",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "57",
      "pages": [
        37
      ]
    },
    "explanation": "The question asks how the studies presented in the passage are used to illustrate the effect of\nthe Internet on a person’s memory.\nA. CORRECT. The study described in paragraph 5 examined the effect of computer use on the\nway people evaluate information, specifically “which information deserves their effort\nto remember,” and determined that “those who believed the information would be erased\nand no longer available could recall 40 percent more facts than those who thought the\ninformation would be saved.” The study described in paragraph 2 established that the use of\nInternet search engines increases the “inclination to rely on the Internet in order to retrieve\ninformation” (paragraph 3), and the study in paragraph 6 examined how this reliance on\ntechnology affects the way people store information: “Overall, participants recalled the\ninformation’s location more often than the content itself.”\nB. Incorrect. Although a difference in the ability of the human brain and the capacity of the\nInternet to locate information might seem evident, the studies cited in the passage did not\nexamine the ability or the capacity of either. The studies did not measure what the human\nbrain is capable of but rather how memory is affected by the use of the Internet.\nC. Incorrect. While the studies explored the Internet’s effect on the way information is stored in\nhuman memory, the type of information was not described or compared. Instead, the studies\nindicated that location is the main difference between the information stored in the Internet\nand the information stored in human memory, noting that the Internet has become “an\nexternal source of the recollections and associative networks that constitute memory”\n(paragraph 6).\nD. Incorrect. Although it is increasingly common to use the Internet to obtain information\n(paragraph 2) rather than try to memorize information (paragraph 5), the studies did not\nexamine the difficulty or ease of obtaining/recalling information using either method.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q057-explanation-1.png\" alt=\"Official explanation for source question 57; original printed answer labels retained.\" width=\"689\"></p>",
    "points": 1,
    "prompt": "The effect of the Internet on a person’s memory is illustrated in the passage through the presentation of studies that",
    "promptHtml": "<p>The effect of the Internet on a person’s memory is illustrated in the passage through the presentation of studies that</p>",
    "topic": "Inference",
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

export const aMemoryRevolution20212022FormBPassageSet: ExamPassageSet = {
  id: "ela-a-memory-revolution-2021-2022-form-b",
  versionLabels: ["2021-2022 Form B"],
  label: "2021-2022 Form B",
  section: "reading",
  questionCount: aMemoryRevolution20212022FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "a-memory-revolution-2021-2022-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "A Memory Revolution",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2021-2022-form-b","label":"2021-2022 Form B","year":"2021-2022","form":"B","packageId":"6248d78c0e22a3960fbca838c5f1494de00c969a089f4c878b37ea53f6d173cb"},
    title: "A Memory Revolution",
    image: {"alt":"How Memory Works: information passes through sensory, short-term, and long-term memory, with rehearsal, storage, and retrieval.","src":"/exam-images/pdf-2021-2022-b-q050-memory-diagram.png"},
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">A high school senior logs on to a computer at the library to double-check the application due date listed on a college admissions website. Nearby, a librarian helps a group of biology students use a database to search for recent studies about mammals. In the past few decades, the Internet has become an integral component of daily life for many people. The seemingly limitless power of search engines made the Internet search extremely common, and today people increasingly rely on the Internet’s vast accumulation of sources to access all types of information. Scientists are beginning to examine how this reliance is modifying the strategies people use to store and prioritize information in their mind.</p><h3>A Dependable and Valuable Asset</h3><p data-numbered=\"true\">Psychologist Benjamin Storm from the University of California, Santa Cruz, and researchers Sean Stone and Aaron Benjamin devised an experiment to study students’ tendency to depend on the Internet for facts. To begin, the scientists divided sixty participants into multiple groups, including an “Internet” group and a “memory” group, and placed them in front of computers. The Internet group was required to use the search engine Google to answer eight challenging trivia questions. In contrast, participants in the memory group were permitted to use only their personal knowledge to answer the questions. In the second round, the researchers administered notably easier questions. This time, they allowed each group the option of using Google as they answered. Their results showed that 83 percent of the Internet group continued to consult Google in the second round, while only 63 percent of the memory group chose to do so.</p><p data-numbered=\"true\">People’s growing inclination to rely on the Internet in order to retrieve information, particularly facts and figures, is called cognitive offloading. Canadian researcher Evan F. Risko and British researcher Sam Gilbert, who have written extensively about the topic, say a similar process has been taking place for centuries. In the past, people used resources like encyclopedias to assist their memories; however, today the Internet, serving as a vast extended memory, allows people to digitally access and retrieve much larger volumes of information. Consequently, people’s minds are free for other cognitive feats, such as connecting data, learning new information, or solving problems.</p><h3>Filing Information Away</h3><p data-numbered=\"true\">The use of the Internet also appears to be modifying the strategies people use to store information in their mind. Researchers Betsy Sparrow from Columbia University, Jenny Liu from the University of Wisconsin-Madison, and Daniel Wegner from Harvard University conducted several studies to discover how people efficiently manage their information intake.</p><p data-numbered=\"true\">To begin, the researchers examined how people evaluate which information deserves their effort to remember. For this experiment, participants read forty trivia facts, such as “An ostrich’s eye is bigger than its brain,” and typed the statements into a computer file. Half the participants had been previously told the file would be saved, while half believed it would be erased. Next, the participants wrote down every fact they could recall. Those who believed the information would be erased and no longer available could recall 40 percent more facts than those who thought the information would be saved.</p><p data-numbered=\"true\">In another experiment, the same researchers tested the ability of study participants to remember where to access information. For this trial, participants read and typed trivia statements, which they saved in folders with generic names such as “Facts” and “Items.” After spending ten minutes writing down all the facts they could recall from memory, participants were asked which folder contained a particular fact based on a keyword. For example, “Which folder has the fact about ostriches?” Overall, participants recalled the information’s location more often than the content itself, correctly identifying 49 percent of the folders for specific facts while remembering only 23 percent of the actual trivia. The researchers concluded that our memory is adapting to the Internet age by prioritizing where to locate information even when the specific details are forgotten. According to Sparrow, the Internet has become an important form of transactive memory, an external source of the recollections and associative networks that constitute memory.</p><p data-numbered=\"true\">As the Internet’s resources continue to expand our “external” memory, some question whether the process may cause people to depend too heavily on technology. However, Steven Pinker, a professor of psychology at Harvard University, says, “Knowledge is increasing exponentially; human brainpower and waking hours are not. Fortunately, the Internet and information technologies are helping us manage, search and retrieve our collective intellectual output at different scales, from Twitter and previews to e-books and online encyclopedias. Far from making us stupid, these technologies are the only things that will keep us smart.”</p>",
    text: aMemoryRevolution20212022FormBPassageText,
    versionLabel: "2021-2022 Form B",
  }),
  questions: aMemoryRevolution20212022FormBQuestions,
};
