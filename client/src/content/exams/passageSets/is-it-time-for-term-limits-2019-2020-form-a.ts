import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const isItTimeForTermLimits20192020FormAPassageText = "In 1799, when George Washington’s supporters asked him to consider serving a third term as president of the United States, he declared, “Prudence on my part must arrest any attempt at the well meant, but mistaken views of my friends, to introduce me again into the Chair of Government.” Even though some of his contemporaries advocated for a lifetime appointment for presidents, Washington thought that government officials should not seek to gain unfair power. Only one president has been elected to four terms: Franklin Delano Roosevelt. He was elected to a third term in 1940 and a fourth in 1944 due to the challenges of the Great Depression and World War II. This departure from the rule worried some, and on March 21, 1947, Congress passed the Twenty-Second Amendment to the Constitution, legally limiting the office of president to two four-year terms.\n\nPresidential terms are clearly limited in the Constitution, but for people serving in Congress, this is not the case. Currently, members of the House of Representatives, who serve two-year terms, and Senators, who serve six-year terms, can run for reelection an unlimited number of times. Because of the possibility of unlimited reelections, many people are beginning to believe that limiting congressional terms would benefit our government. Modern surveys conducted by multiple firms consistently show that American citizens of a variety of backgrounds and political leanings approve of the idea of setting term limits for members of Congress.\n\nAmerican citizens are not the only supporters of term limits for Congress. Even some members of Congress themselves have spoken out in support of this change. Former Senator Joe Lieberman, upon his retirement, suggested that Congress “might be healthier and less partisan1 and less rigid if it turned over more often, and term limits are one way to do that.” Michael Olson and Jon Rogowski state in their article “Legislative Term Limits and Polarization” that “proponents of term limits argue that limiting the number of terms legislators can serve in office would reduce the level of partisan conflict, encourage compromise and cooperation, and improve the quality of representation.”\n\nExperienced politicians certainly can build on years of knowledge, but term limit supporters point out that career politicians may base key decisions on their own personal long-term goals. In the article “Term Limitations and the Myth of the Citizen-Legislator,” author Elizabeth Garrett states that “under term limits, a careerist needs to move up the political opportunity structure to remain in elected office, but the probability of unimpeded upward movement decreases as the number of available positions that are perceived as advancements decline.”\n\nWhile challenging the career politician’s path is seen as a benefit to term limit supporters, there is a possibility that a Congress mostly composed of newcomers could severely affect policy making. Experienced politicians have a deep knowledge of congressional processes, and in addition, politicians who have served together for extended periods have a chance to develop trusting relationships, even across party lines. Molly Reynolds, a congressional expert for the Brookings Institution, says that members who are restricted by term limits “have neither the time nor the incentive to develop the relevant expertise they need to be good at their jobs. If members don’t have that expertise themselves, they’re more likely to rely on outsiders, including lobbyists, to replace that expertise.”\n\nIn fact, first-time politicians’ susceptibilities to lobbyists, or groups seeking to influence legislators, have actually been put to the test on the state level. In 2006, the National Conference of State Legislators Study revealed that term limits may increase the influence of lobbyists. In the 1990s, more than twenty states implemented term limits within their state governments. The inexperienced state lawmakers began depending on special-interest groups for their expertise on issues. In the end, many people believed that implementing term limits in the state legislature caused problems, and since then, six states have repealed the limits.\n\nAdditionally, those who oppose term limits maintain that the turnover rate in Congress is sufficient. Thomas E. Mann, Senior Fellow in governance studies at the Brookings Institution, notes that every decade, new members replace at least half the members of the House and the Senate, due to retirement or elections. Still, the average length of time in office has mushroomed. For example, the 65th Congress (1917–1919) had an average service time of 5.3 years for members of the House of Representatives and 5.7 years for Senate members. The 114th Congress (2015–2017) had an average of 8.8 years for members of the House and 9.7 years for senators.\n\nShould Congress pass a constitutional amendment to institute congressional term limits? Perhaps one day people will have a chance to vote on the issue.";

const isItTimeForTermLimits20192020FormAQuestions: ExamQuestion[] = [
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q49",
    "skilled": "TBD",
    "explanation": "The question asks for the best summary of the discussion of congressional term policy outlined in paragraph 2.\n\nD: Correct. The summary of paragraph 2 accurately presents the idea that members of Congress, in contrast to the president, do not have term limits and calls out the idea that recent surveys show that some Americans think this should change.\n\nA: Incorrect. The summary focuses on term lengths that members of the House of Representatives and of the Senate serve rather than on term limits.\n\nB: Incorrect. The summary incorrectly places an emphasis on the idea that some Americans are troubled by the discrepancy between the president having term limits and members of Congress not having term limits. However, it is not the discrepancy that troubles people; it is the fact that members of Congress can be reelected an unlimited number of times.\n\nC: Incorrect. While the summary mentions increased support for term limits, it neglects to mention the contrast between the president having term limits and members of Congress not having term limits.",
    "points": 1,
    "prompt": "What is the best summary of the discussion of congressional term policy outlined in paragraph 2?",
    "promptHtml": "<p>What is the best summary of the discussion of congressional term policy outlined in paragraph 2?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "While all members of Congress can be reelected an unlimited number of times, members of the House of Representatives and of the Senate serve different term lengths; this inequity has become troubling to many American citizens in recent years."
      },
      {
        "id": "B",
        "text": "The discrepancy between the president having term limits and members of Congress having unlimited terms has come to seem like a governmental flaw to many American citizens, and this flaw could be remedied by imposing congressional term limits."
      },
      {
        "id": "C",
        "text": "Support for congressional term limits is increasing, as shown by recent surveys indicating that American citizens of different backgrounds and political beliefs are beginning to favor implementation of term limits for members of Congress."
      },
      {
        "id": "D",
        "text": "While the Constitution sets a term limit for the office of president, no such limit exists for members of Congress; however, recent surveys show that many American citizens are now in favor of term limits for members of Congress."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q50",
    "skilled": "TBD",
    "explanation": "The question asks which sentence from the passage supports the idea that congressional term limits would “benefit our government” (paragraph 2).\n\nG: Correct. Joe Lieberman’s comments in paragraph 3 strongly suggest that Congress is currently too partisan and rigid and that term limits would help correct this, thus benefiting our government.\n\nE: Incorrect. The sentence from paragraph 2 states the fact that members of Congress can run for reelection an unlimited number of times; it does not suggest that this is unhealthy.\n\nF: Incorrect. While the sentence from paragraph 2 shows that many Americans believe that term limits would be beneficial, it offers no actual evidence to support this idea.\n\nH: Incorrect. The sentence from paragraph 7 offers a statistic regarding how frequently members of Congress are replaced. However, no suggestion is made as to whether the situation is good or bad or whether term limits would be healthy.",
    "points": 1,
    "prompt": "Which sentence from the passage supports the idea that congressional term limits would “benefit our government” (paragraph 2)?",
    "promptHtml": "<p>Which sentence from the passage supports the idea that congressional term limits would “benefit our government” (paragraph 2)?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“Currently, members of the House of Representatives, who serve two-year terms, and Senators, who serve six-year terms, can run for reelection an unlimited number of times.” (paragraph 2)"
      },
      {
        "id": "B",
        "text": "“Modern surveys conducted by multiple firms consistently show that American citizens of a variety of backgrounds and political leanings approve of the idea of setting term limits for members of Congress.” (paragraph 2)"
      },
      {
        "id": "C",
        "text": "“Former Senator Joe Lieberman, upon his retirement, suggested that Congress ‘might be healthier and less partisan and less rigid if it turned over more often, and term limits are one way to do that.’ ” (paragraph 3)"
      },
      {
        "id": "D",
        "text": "“Thomas E. Mann, Senior Fellow in governance studies at the Brookings Institution, notes that every decade, new members replace at least half the members of the House and the Senate, due to retirement or elections.” (paragraph 7)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q51",
    "skilled": "TBD",
    "explanation": "The question asks how the quotations in paragraph 3 convey a central idea of the passage.\n\nA: Correct. The quotations in paragraph 3 from former Senator Joe Lieberman and the writers Olson and Rogowski focus on how term limits might help members of Congress work together more cooperatively, even across party lines, “ ‘and improve the quality of representation. ’ ”\n\nB: Incorrect. The fact that politicians and law experts have opinions about term limits is not a central idea of the passage, though those opinions can be used to support arguments for or against term limits.\n\nC: Incorrect. While paragraph 3 begins with the idea that “American citizens are not the only supporters of term limits for Congress,” the quotations do not suggest that citizens tend to agree with expert opinions on term limits; the expert opinions in paragraph 3 are simply offered as further support for term limits.\n\nD: Incorrect. The implication that term limits could “ ‘encourage compromise’ ” by affecting how members of Congress campaign and vote is a supporting detail and not a central idea of the passage.",
    "points": 1,
    "prompt": "The quotations in paragraph 3 convey a central idea of the passage by",
    "promptHtml": "<p>The quotations in paragraph 3 convey a central idea of the passage by</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "emphasizing some of the possible effects term limits would have on how Congress functions."
      },
      {
        "id": "B",
        "text": "showing that both politicians and law experts have strong opinions about congressional term limits."
      },
      {
        "id": "C",
        "text": "suggesting that citizens defer to career politicians and law experts on issues such as congressional term limits."
      },
      {
        "id": "D",
        "text": "implying that term limits would affect the ways that members of Congress campaign and vote."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q52",
    "skilled": "TBD",
    "explanation": "The question asks which statement best describes how the sentence in paragraph 5 fits into the overall structure of the passage.\n\nH: Correct. The author uses the sentence in paragraph 5 to demonstrate a transition from the benefits of term limits to the idea that newcomers could have a severe effect on policies.\n\nE: Incorrect. While the sentence in paragraph 5 does imply that term limits are controversial, it merely begins to suggest one of the reasons for the controversy without offering actual evidence.\n\nF: Incorrect. The sentence in paragraph 5 does not offer ideas complete enough to constitute a summary of the consequences of term limits.\n\nG: Incorrect. Before paragraph 5, the passage explores possible effects of term limits on the ability of Congress to function.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nWhile challenging the career politician’s path is seen as a benefit to term limit supporters, there is a possibility that a Congress mostly composed of newcomers could severely affect policy making.\n\nWhich statement best describes how the sentence fits into the overall structure of the passage?",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>While challenging the career politician’s path is seen as a benefit to term limit supporters, there is a possibility that a Congress mostly composed of newcomers could severely affect policy making.</strong></blockquote><p>Which statement best describes how the sentence fits into the overall structure of the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It provides evidence for the idea that term limits are controversial."
      },
      {
        "id": "B",
        "text": "It summarizes the consequences of having term limits."
      },
      {
        "id": "C",
        "text": "It begins to explore the effects of instituting term limits."
      },
      {
        "id": "D",
        "text": "It shifts from the arguments for to the arguments against term limits."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q53",
    "skilled": "TBD",
    "explanation": "The question asks how, according to paragraph 5, serving more terms improves politicians’ effectiveness.\n\nC: Correct. Paragraph 5 makes it clear that “experienced politicians have a deep knowledge of congressional processes, and in addition, politicians who have served together for extended periods have a chance to develop trusting relationships, even across party lines. ” Therefore, serving more terms helps experienced politicians gain expertise.\n\nA: Incorrect. Paragraph 5 does not say that serving more terms motivates politicians to learn congressional processes, only that politicians restricted by term limits are not motivated to gain expertise.\n\nB: Incorrect. While paragraph 5 states that serving more terms helps a politician “develop trusting relationships, even across party lines,” it does not explain how serving more terms improves politicians’ effectiveness.\n\nD: Incorrect. While paragraph 4 states that “term limit supporters point out that career politicians may base key decisions on their own personal long-term goals,” paragraph 5 does not mention this idea or state that creating new policies while fostering their own careers would improve their effectiveness.",
    "points": 1,
    "prompt": "According to paragraph 5, serving more terms improves politicians’ effectiveness by",
    "promptHtml": "<p>According to paragraph 5, serving more terms improves politicians’ effectiveness by</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "motivating them to learn the congressional processes necessary to create legislation."
      },
      {
        "id": "B",
        "text": "encouraging them to collaborate with politicians of the opposing party in order to pass legislation."
      },
      {
        "id": "C",
        "text": "allowing them to gain expertise and develop strong political relationships."
      },
      {
        "id": "D",
        "text": "enabling them to create new policies while fostering their own careers."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q54",
    "skilled": "TBD",
    "explanation": "The question asks why setting term limits for members of Congress potentially increases the influence of special-interest groups.\n\nE: Correct. The passage explains in paragraphs 5 and 6 that representatives who lack experience might end up relying on lobbyists’ expertise. Paragraph 6 uses information from the National Conference of State Legislators Study, which indicated that state lawmakers were “depending on special-interest groups for their expertise on issues. ” This example on a state level is used to show that “term limits may increase the influence of lobbyists” (paragraph 6).\n\nF: Incorrect. While lobbyists can work with representatives, it is not required. The passage implies that some of the deep knowledge many politicians gain is from spending time in office and from developing “trusting relationships” (paragraph 5) with colleagues.\n\nG: Incorrect. The passage does discuss the drawbacks of forcing experienced representatives from their seats, but it does not provide support for the idea that new representatives will focus on the agendas of special-interest groups.\n\nH: Incorrect. The passage states that experienced representatives “have a deep knowledge of congressional processes, and in addition, politicians who have served together for extended periods have a chance to develop trusting relationships, even across party lines” (paragraph 5). The author states that the concern is only for new representatives who might seek help or guidance from lobbyists.",
    "points": 1,
    "prompt": "According to the passage, why would setting term limits for members of Congress potentially increase the influence of special-interest groups?",
    "promptHtml": "<p>According to the passage, why would setting term limits for members of Congress potentially increase the influence of special-interest groups?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "Term limits would lead to a greater number of new representatives who rely on guidance and support from special-interest groups early in their terms."
      },
      {
        "id": "B",
        "text": "Term limits would create a situation in which special-interest groups have to work more closely with the new representatives who replace experienced representatives."
      },
      {
        "id": "C",
        "text": "Term limits would force experienced representatives out of their seats and bring in new representatives who focus on the agendas of special-interest groups."
      },
      {
        "id": "D",
        "text": "Term limits would result in both new and experienced representatives looking to special-interest groups in order to influence decisions made in legislature."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q55",
    "skilled": "TBD",
    "explanation": "The question asks how the author of the passage mainly develops the idea that congressional term limits might have negative effects.\n\nB: Correct. In paragraphs 5 and 6, the author discusses the fact that members of Congress who lack experience might fail to develop good political relationships, fail to learn processes, and rely too much on lobbyists. For example, paragraph 6 uses information from the National Conference of State Legislators Study, which reveals that “term limits may increase the influence of lobbyists. ”\n\nA: Incorrect. While the author states that “politicians who have served together for extended periods have a chance to develop trusting relationships, even across party lines” (paragraph 5), it is never stated in the passage how long it takes politicians to build connections with one another.\n\nC: Incorrect. The author does introduce the idea that new politicians are “ ‘more likely to rely on outsiders, including lobbyists, to replace that expertise’ ” (paragraph 5), but the passage does not present the ways that lobbyists seek to influence the decisions of new representatives.\n\nD: Incorrect. Paragraph 7 does give statistics on turnover rates: “Thomas E. Mann, Senior Fellow in governance studies at the Brookings Institution, notes that every decade, new members replace at least half the members of the House and the Senate, due to retirement or elections. ” However, this information does not support the idea that term limits might have negative effects.",
    "points": 1,
    "prompt": "The author of the passage develops the idea that congressional term limits might have negative effects mainly by",
    "promptHtml": "<p>The author of the passage develops the idea that congressional term limits might have negative effects mainly by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "describing the amount of time it takes for new representatives to build connections with experienced representatives."
      },
      {
        "id": "B",
        "text": "explaining why members of Congress need experience in order to govern well."
      },
      {
        "id": "C",
        "text": "illustrating the various ways lobbyists seek to influence the decisions of new members of Congress."
      },
      {
        "id": "D",
        "text": "revealing the statistics on the turnover rates for representatives."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q56",
    "skilled": "TBD",
    "explanation": "The question asks with which statement the author of the passage would most likely agree.\n\nG: Correct. Given that the author presents strong arguments and supporting evidence both for and against setting term limits, the author would most likely agree that both sides have compelling reasons supporting their positions. The passage ends with the author’s suggestions that “perhaps one day people will have a chance to vote on the issue” (paragraph 8). The author never argues for a particular side of the argument.\n\nE: Incorrect. While the author presents a good description of why expertise is important for lawmakers, the author does not give this argument greater weight than other arguments in the passage.\n\nF: Incorrect. While paragraph 2 does state that “modern surveys conducted by multiple firms consistently show that American citizens of a variety of backgrounds and political leanings approve of the idea of setting term limits for members of Congress,” the author never suggests that term limits are the most pressing issue facing voters today and never compares this issue to any other issues.\n\nH: Incorrect. While the author discusses in paragraphs 5 and 6 the dangers of special-interest groups having excessive influence on lawmakers, the author never suggests that special-interest groups may influence the issue of term limits itself.",
    "points": 1,
    "prompt": "With which statement would the author of the passage most likely agree?",
    "promptHtml": "<p>With which statement would the author of the passage most likely agree?</p>",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "The expertise of lawmakers should outweigh other considerations when it comes to deciding about term limits."
      },
      {
        "id": "B",
        "text": "The decision to institute term limits for Congress is the most pressing issue facing American voters today."
      },
      {
        "id": "C",
        "text": "There are compelling reasons both for and against setting term limits for Congress."
      },
      {
        "id": "D",
        "text": "Special-interest groups are likely to have a huge influence on whether term limits are set."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "is-it-time-for-term-limits-2019-2020-form-a-2019-form-a-ela-q57",
    "skilled": "TBD",
    "explanation": "The question asks how the tables at the end of the passage contribute to the development of ideas in paragraph 7.\n\nA: Correct. The tables show that members of Congress have a greater chance of getting reelected today than they did in 1950, supporting the idea from paragraph 7 that the average length of time in office has increased: “Still, the average length of time in office has mushroomed. For example, the 65th Congress (1917–1919) had an average service time of 5. 3 years for members of the House of Representatives and 5. 7 years for Senate members. The 114th Congress (2015–2017) had an average of 8. 8 years for members of the House and 9. 7 years for senators. ”\n\nB: Incorrect. While the tables suggest that the reelection rate for members of Congress has shifted upward since 1950 as explained in paragraph 7, the tables do not provide details about the number of times congresspeople have been reelected throughout their careers.\n\nC: Incorrect. While the tables indicate that the reelection rates between the House and the Senate differ somewhat, the distinction between reelection rates of the two parts of Congress is unrelated to the main idea of paragraph 7 that “the average length of time in office has mushroomed. “\n\nD: Incorrect. The number of seats in the Senate is a minor detail that does not support an idea from paragraph 7, where the author focuses on current turnover “due to retirement or elections” and the fact that “the average length of time in office has mushroomed. ”",
    "points": 1,
    "prompt": "The tables at the end of the passage contribute to the development of ideas in paragraph 7 by",
    "promptHtml": "<p>The tables at the end of the passage contribute to the development of ideas in paragraph 7 by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "highlighting the idea that the number of members of Congress who are reelected in each election has increased substantially since 1950."
      },
      {
        "id": "B",
        "text": "demonstrating that the number of times members of Congress are reelected throughout their careers has shifted since 1950."
      },
      {
        "id": "C",
        "text": "showing that the reelection rate in the Senate differs from the reelection rate in the House."
      },
      {
        "id": "D",
        "text": "emphasizing the fact that the Senate has fewer seats but a greater reelection rate than the House."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const isItTimeForTermLimits20192020FormAPassageSet: ExamPassageSet = {
  id: "ela-is-it-time-for-term-limits-2019-2020-form-a",
  label: "2019–2020 Form A",
  section: "reading",
  questionCount: isItTimeForTermLimits20192020FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "is-it-time-for-term-limits-2019-2020-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Is It Time for Term Limits?",
    image: {"alt":"Is It Time for Term Limits? illustration","src":"/exam-images/is-it-time-for-term-limits-2019-2020-form-a-passage.png"},
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">In 1799, when George Washington’s supporters asked him to consider serving a third term as president of the United States, he declared, “Prudence on my part must arrest any attempt at the well meant, but mistaken views of my friends, to introduce me again into the Chair of Government.” Even though some of his contemporaries advocated for a lifetime appointment for presidents, Washington thought that government officials should not seek to gain unfair power. Only one president has been elected to four terms: Franklin Delano Roosevelt. He was elected to a third term in 1940 and a fourth in 1944 due to the challenges of the Great Depression and World War II. This departure from the rule worried some, and on March 21, 1947, Congress passed the Twenty-Second Amendment to the Constitution, legally limiting the office of president to two four-year terms.</p>\n<p data-numbered=\"true\">Presidential terms are clearly limited in the Constitution, but for people serving in Congress, this is not the case. Currently, members of the House of Representatives, who serve two-year terms, and Senators, who serve six-year terms, can run for reelection an unlimited number of times. Because of the possibility of unlimited reelections, many people are beginning to believe that limiting congressional terms would benefit our government. Modern surveys conducted by multiple firms consistently show that American citizens of a variety of backgrounds and political leanings approve of the idea of setting term limits for members of Congress.</p>\n<p data-numbered=\"true\">American citizens are not the only supporters of term limits for Congress. Even some members of Congress themselves have spoken out in support of this change. Former Senator Joe Lieberman, upon his retirement, suggested that Congress “might be healthier and less <span data-glossary-definition=\"showing a strong and sometimes blind adherence to a particular political party\" role=\"link\" tabindex=\"0\">partisan</span><sup>1</sup> and less rigid if it turned over more often, and term limits are one way to do that.” Michael Olson and Jon Rogowski state in their article “Legislative Term Limits and Polarization” that “proponents of term limits argue that limiting the number of terms legislators can serve in office would reduce the level of partisan conflict, encourage compromise and cooperation, and improve the quality of representation.”</p>\n<p data-numbered=\"true\">Experienced politicians certainly can build on years of knowledge, but term limit supporters point out that career politicians may base key decisions on their own personal long-term goals. In the article “Term Limitations and the Myth of the Citizen-Legislator,” author Elizabeth Garrett states that “under term limits, a careerist needs to move up the political opportunity structure to remain in elected office, but the probability of unimpeded upward movement decreases as the number of available positions that are perceived as advancements decline.”</p>\n<p data-numbered=\"true\">While challenging the career politician’s path is seen as a benefit to term limit supporters, there is a possibility that a Congress mostly composed of newcomers could severely affect policy making. Experienced politicians have a deep knowledge of congressional processes, and in addition, politicians who have served together for extended periods have a chance to develop trusting relationships, even across party lines. Molly Reynolds, a congressional expert for the Brookings Institution, says that members who are restricted by term limits “have neither the time nor the incentive to develop the relevant expertise they need to be good at their jobs. If members don’t have that expertise themselves, they’re more likely to rely on outsiders, including lobbyists, to replace that expertise.”</p>\n<p data-numbered=\"true\">In fact, first-time politicians’ susceptibilities to lobbyists, or groups seeking to influence legislators, have actually been put to the test on the state level. In 2006, the National Conference of State Legislators Study revealed that term limits may increase the influence of lobbyists. In the 1990s, more than twenty states implemented term limits within their state governments. The inexperienced state lawmakers began depending on special-interest groups for their expertise on issues. In the end, many people believed that implementing term limits in the state legislature caused problems, and since then, six states have repealed the limits.</p>\n<p data-numbered=\"true\">Additionally, those who oppose term limits maintain that the turnover rate in Congress is sufficient. Thomas E. Mann, Senior Fellow in governance studies at the Brookings Institution, notes that every decade, new members replace at least half the members of the House and the Senate, due to retirement or elections. Still, the average length of time in office has mushroomed. For example, the 65th Congress (1917–1919) had an average service time of 5.3 years for members of the House of Representatives and 5.7 years for Senate members. The 114th Congress (2015–2017) had an average of 8.8 years for members of the House and 9.7 years for senators.</p>\n<p data-numbered=\"true\">Should Congress pass a constitutional amendment to institute congressional term limits? Perhaps one day people will have a chance to vote on the issue.</p>",
    text: isItTimeForTermLimits20192020FormAPassageText,
    versionLabel: "2019–2020 Form A",
  }),
  questions: isItTimeForTermLimits20192020FormAQuestions,
};
