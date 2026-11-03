import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const readingPassage120172018FormBPassageText = "On Monday evening, September 26, 1960, seventy million Americans turned on their TV sets to view the first televised political debate in a campaign for the presidency of the United States. As of that date, it was by far the largest number ever to witness a political discussion. The novelty of the event drew even those with little or no interest in politics.\n\nThe candidates, Republican Vice President Richard M. Nixon and Democratic Senator John F. Kennedy, had agreed to face each other and the nation in four one-hour sessions that the press dubbed the “Great Debates.” Many expected Vice President Nixon to win the debates easily. He was ahead in the newspaper polls, he was an experienced public speaker, and he had served as vice president for nearly eight years. Senator Kennedy was less well- known and, at forty-three, was the youngest man ever to run for president. Throughout the presidential race, his opponents criticized him for his relative youth and inexperience.\n\nBy mutual agreement, the first session was limited to domestic issues within the United States. Each candidate was given eight minutes to make his opening remarks. During the remainder of the hour, the candidates took turns responding to questions posed by selected reporters. Both Kennedy and Nixon dealt with the issues calmly and carefully. Viewers who expected to see a free-for-all were disappointed. The way the two men appeared on the television screen, however, may have been as important as what they said. Kennedy looked at the camera while answering questions, appearing to speak directly to his viewers and give them straight answers. Nixon was recovering from a severe bout of influenza, and he appeared tense and tired. He looked at the reporters who asked the questions instead of at the camera, giving some viewers the impression that he avoided eye contact with his audience and thus suggesting that he was not trustworthy. Most commentators agreed that Kennedy gained from the encounter: many viewers who had previously thought he lacked the maturity necessary to be president were won over by his charm, poise, and confident manner.\n\nWhile far fewer people watched the three later sessions, much discussion ensued regarding the influence of the Great Debates on the outcome of the 1960 presidential election. Some feared that the better TV performer was bound to come across as being the better candidate. “Is this a good way to judge a person’s ability to serve as president of the United States?” they asked.\n\nKennedy ultimately won the election, but it was by the narrowest popular vote margin in more than eighty years. Some observers concluded that, had the Great Debates been broadcast on radio and not on television, Nixon would have won.";

const readingPassage120172018FormBQuestions: ExamQuestion[] = [
  {
    "id": "reading-passage-1-2017-2018-form-b-pdf-shsat-2017-2018-b-q021",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "21",
      "pages": [
        11
      ]
    },
    "explanation": "21. (C) The passage is primarily about the participants in the first televised presidential debate (lines 10−24), details about how both Nixon and Kennedy acted during the debate (lines 25−47), and the impact of the debate (lines 47−61). All of these details are best stated by Option C. The reasons Nixon was expected to win (Option A), the discussion of domestic issues (Option B), and the qualifications of each candidate (Option D) are important details related to the debates but are not the overall topic.",
    "explanationHtml": "<p>21. (C) The passage is primarily about the participants in the first televised presidential debate (lines 10−24), details about how both Nixon and Kennedy acted during the debate (lines 25−47), and the impact of the debate (lines 47−61). All of these details are best stated by Option C. The reasons Nixon was expected to win (Option A), the discussion of domestic issues (Option B), and the qualifications of each candidate (Option D) are important details related to the debates but are not the overall topic.</p>",
    "points": 1,
    "prompt": "Which of the following best tells what this passage is about?",
    "promptHtml": "<p>Which of the following best tells what this passage is about?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>the reasons Nixon was expected to defeat Kennedy in the 1960 election</p>",
        "text": "the reasons Nixon was expected to defeat Kennedy in the 1960 election"
      },
      {
        "id": "B",
        "html": "<p>the discussion of domestic issues in the 1960 presidential debates</p>",
        "text": "the discussion of domestic issues in the 1960 presidential debates"
      },
      {
        "id": "C",
        "html": "<p>the events related to the first televised presidential debate</p>",
        "text": "the events related to the first televised presidential debate"
      },
      {
        "id": "D",
        "html": "<p>the qualifications of Nixon and Kennedy for the role of president</p>",
        "text": "the qualifications of Nixon and Kennedy for the role of president"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-1-2017-2018-form-b-pdf-shsat-2017-2018-b-q022",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "22",
      "pages": [
        11
      ]
    },
    "explanation": "22. (F) Some observers suggested that had the debate not been on television, it is more likely that Nixon, not Kennedy, would have won the election (lines 64−67), which is Option F. The passage states that Nixon was well known, ahead in the polls, and more experienced than Kennedy (lines 16−20), so it is unlikely that Kennedy would have won anyway (Option E) or that the\n\nelection results would have been closer (Option G). The idea that the debates would not have become a tradition (Option H) is not supported by the passage.",
    "explanationHtml": "<p>22. (F) Some observers suggested that had the debate not been on television, it is more likely that Nixon, not Kennedy, would have won the election (lines 64−67), which is Option F. The passage states that Nixon was well known, ahead in the polls, and more experienced than Kennedy (lines 16−20), so it is unlikely that Kennedy would have won anyway (Option E) or that the</p><p>election results would have been closer (Option G). The idea that the debates would not have become a tradition (Option H) is not supported by the passage.</p>",
    "points": 1,
    "prompt": "Which of the following would have been the most likely result if the candidates had not debated on television in 1960?",
    "promptHtml": "<p>Which of the following would have been the most likely result if the candidates had <strong>not</strong> debated on television in 1960?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>Kennedy would have won the election anyway.</p>",
        "text": "Kennedy would have won the election anyway."
      },
      {
        "id": "B",
        "html": "<p>Nixon would have had a better chance of winning the election.</p>",
        "text": "Nixon would have had a better chance of winning the election."
      },
      {
        "id": "C",
        "html": "<p>The election results would have been much closer.</p>",
        "text": "The election results would have been much closer."
      },
      {
        "id": "D",
        "html": "<p>The debates would not have become a tradition.</p>",
        "text": "The debates would not have become a tradition."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-1-2017-2018-form-b-pdf-shsat-2017-2018-b-q023",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "23",
      "pages": [
        11
      ]
    },
    "explanation": "23. (C) The answer to this question can be found in the fourth paragraph. Lines 57–59 state that “Some feared that the better TV performer was bound to come across as being the better candidate.” This concern is best reflected in Option C. The less well-known candidates have to encounter more experienced candidates whether the political debates are televised or not, which rules out Option A. While certain candidates may be uncomfortable on live television, this was not the main concern described in the fourth paragraph, ruling out Option B. Multiple debates were planned before the first debate took place, so the idea in Option D would not be considered an undesirable consequence of televised debates.",
    "explanationHtml": "<p>23. (C) The answer to this question can be found in the fourth paragraph. Lines 57–59 state that “Some feared that the better TV performer was bound to come across as being the better candidate.” This concern is best reflected in Option C. The less well-known candidates have to encounter more experienced candidates whether the political debates are televised or not, which rules out Option A. While certain candidates may be uncomfortable on live television, this was not the main concern described in the fourth paragraph, ruling out Option B. Multiple debates were planned before the first debate took place, so the idea in Option D would not be considered an undesirable consequence of televised debates.</p>",
    "points": 1,
    "prompt": "Which of the following did critics in 1960 think could be an undesirable consequence of televised presidential debates?",
    "promptHtml": "<p>Which of the following did critics in 1960 think could be an undesirable consequence of televised presidential debates?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>Candidates who are less well-known would have to debate experienced politicians.</p>",
        "text": "Candidates who are less well-known would have to debate experienced politicians."
      },
      {
        "id": "B",
        "html": "<p>Candidates might have difficulty overcoming the pressure of being on live television.</p>",
        "text": "Candidates might have difficulty overcoming the pressure of being on live television."
      },
      {
        "id": "C",
        "html": "<p>Candidates would be evaluated based on their performance rather than their positions.</p>",
        "text": "Candidates would be evaluated based on their performance rather than their positions."
      },
      {
        "id": "D",
        "html": "<p>Candidates would need to participate in multiple televised debates to fully cover important issues.</p>",
        "text": "Candidates would need to participate in multiple televised debates to fully cover important issues."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-1-2017-2018-form-b-pdf-shsat-2017-2018-b-q024",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "24",
      "pages": [
        11
      ]
    },
    "explanation": "24. (F) Details in lines 49−52 show that the televised debates benefitted Kennedy by allowing him to display his “charm, poise, and confident manner,” which were favorable characteristics that convinced viewers he had the maturity to be president. This benefit is summarized by Option F. Option E is incorrect because it can be inferred that both candidates appeared to have an equal understanding of domestic issues since they are described as having “dealt with the issues calmly and carefully” (lines 31–33). Both Nixon and Kennedy took questions from reporters (lines 29−31), but there is no indication that Kennedy had a better relationship with reporters than Nixon did, which rules out Option G. The debate may have persuaded some viewers to agree with Kennedy’s positons on domestic issues (Option H), but the passage does not support that this was an advantage for Kennedy because of the debates being televised.",
    "explanationHtml": "<p>24. (F) Details in lines 49−52 show that the televised debates benefitted Kennedy by allowing him to display his “charm, poise, and confident manner,” which were favorable characteristics that convinced viewers he had the maturity to be president. This benefit is summarized by Option F. Option E is incorrect because it can be inferred that both candidates appeared to have an equal understanding of domestic issues since they are described as having “dealt with the issues calmly and carefully” (lines 31–33). Both Nixon and Kennedy took questions from reporters (lines 29−31), but there is no indication that Kennedy had a better relationship with reporters than Nixon did, which rules out Option G. The debate may have persuaded some viewers to agree with Kennedy’s positons on domestic issues (Option H), but the passage does not support that this was an advantage for Kennedy because of the debates being televised.</p>",
    "points": 1,
    "prompt": "How did Kennedy benefit from the debates?",
    "promptHtml": "<p>How did Kennedy benefit from the debates?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>He was able to prove that he knew more about domestic issues than Nixon did.</p>",
        "text": "He was able to prove that he knew more about domestic issues than Nixon did."
      },
      {
        "id": "B",
        "html": "<p>He was able to display favorable personal characteristics despite his inexperience.</p>",
        "text": "He was able to display favorable personal characteristics despite his inexperience."
      },
      {
        "id": "C",
        "html": "<p>He was able to show that he had a more positive relationship with reporters than Nixon did.</p>",
        "text": "He was able to show that he had a more positive relationship with reporters than Nixon did."
      },
      {
        "id": "D",
        "html": "<p>He was able to persuade viewers to agree with his positions on domestic issues.</p>",
        "text": "He was able to persuade viewers to agree with his positions on domestic issues."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-1-2017-2018-form-b-pdf-shsat-2017-2018-b-q025",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "25",
      "pages": [
        11
      ]
    },
    "explanation": "25. (D) The detail in Option D supports the last sentence of the passage: Nixon’s greater experience (lines 16–20) may have been more apparent to radio listeners who would not have been distracted by his poor television appearance. While lines 53−54 state that fewer people watched the later debates (Option A), this does not support the idea that Nixon would have won had the debates not been televised. The idea that both Nixon and Kennedy responded to questions calmly and carefully (lines 31−33) also does not indicate that Nixon would have won, ruling out Option B. While Nixon was ill just before the debate (lines 40−41), this does not support the idea that Nixon was the favorite to win before the debate, ruling out Option C.",
    "explanationHtml": "<p>25. (D) The detail in Option D supports the last sentence of the passage: Nixon’s greater experience (lines 16–20) may have been more apparent to radio listeners who would not have been distracted by his poor television appearance. While lines 53−54 state that fewer people watched the later debates (Option A), this does not support the idea that Nixon would have won had the debates not been televised. The idea that both Nixon and Kennedy responded to questions calmly and carefully (lines 31−33) also does not indicate that Nixon would have won, ruling out Option B. While Nixon was ill just before the debate (lines 40−41), this does not support the idea that Nixon was the favorite to win before the debate, ruling out Option C.</p>",
    "points": 1,
    "prompt": "What evidence does the author provide to support the last sentence of the passage?",
    "promptHtml": "<p>What evidence does the author provide to support the last sentence of the passage?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>Kennedy and Nixon drew much smaller audiences for their later debates.</p>",
        "text": "Kennedy and Nixon drew much smaller audiences for their later debates."
      },
      {
        "id": "B",
        "html": "<p>Kennedy and Nixon responded to questions calmly and carefully.</p>",
        "text": "Kennedy and Nixon responded to questions calmly and carefully."
      },
      {
        "id": "C",
        "html": "<p>Nixon participated in the debate despite having been recently ill.</p>",
        "text": "Nixon participated in the debate despite having been recently ill."
      },
      {
        "id": "D",
        "html": "<p>Nixon was more experienced and well-known than Kennedy.</p>",
        "text": "Nixon was more experienced and well-known than Kennedy."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-1-2017-2018-form-b-pdf-shsat-2017-2018-b-q026",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "26",
      "pages": [
        11
      ]
    },
    "explanation": "26. (F) The answer is given in lines 3–9, which explains that the debates of 1960 were the first time presidential debates were broadcast on television and reached a greater audience than ever before, including people who were not interested in politics. This is summarized in Option F. Option E is a true statement, but it does not explain why people not interested in politics would have watched the debates. The text does not indicate that Kennedy’s youth and charisma were the main reasons people watched the debates, ruling out Option G. The idea that people wanted to verify the newspaper polls (Option H) is not supported by the passage.",
    "explanationHtml": "<p>26. (F) The answer is given in lines 3–9, which explains that the debates of 1960 were the first time presidential debates were broadcast on television and reached a greater audience than ever before, including people who were not interested in politics. This is summarized in Option F. Option E is a true statement, but it does not explain why people not interested in politics would have watched the debates. The text does not indicate that Kennedy’s youth and charisma were the main reasons people watched the debates, ruling out Option G. The idea that people wanted to verify the newspaper polls (Option H) is not supported by the passage.</p>",
    "points": 1,
    "prompt": "Why did people who were not normally interested in politics tune in to the first of the Great Debates?",
    "promptHtml": "<p>Why did people who were not normally interested in politics tune in to the first of the Great Debates?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>Vice President Nixon was a popular politician.</p>",
        "text": "Vice President Nixon was a popular politician."
      },
      {
        "id": "B",
        "html": "<p>Television had never before been used in this way.</p>",
        "text": "Television had never before been used in this way."
      },
      {
        "id": "C",
        "html": "<p>They had heard that Kennedy was young and charismatic.</p>",
        "text": "They had heard that Kennedy was young and charismatic."
      },
      {
        "id": "D",
        "html": "<p>They wanted to see whether the newspaper polls were correct.</p>",
        "text": "They wanted to see whether the newspaper polls were correct."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const readingPassage120172018FormBPassageSet: ExamPassageSet = {
  id: "ela-reading-passage-1-2017-2018-form-b",
  versionLabels: ["2017-2018 Form B"],
  label: "2017-2018 Form B",
  section: "reading",
  questionCount: readingPassage120172018FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "reading-passage-1-2017-2018-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Reading Passage 1",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2017-2018-form-b","label":"2017-2018 Form B","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf","year":"2017-2018","form":"B","packageId":"7a2d7d6a39d44530af4a2496c5862d1dc01b2a3c74dd33b4699a5e02d444e0a3"},
    title: "Reading Passage 1",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">On Monday evening, September 26, 1960, seventy million Americans turned on their TV sets to view the first televised political debate in a campaign for the presidency of <sup>5</sup> the United States. As of that date, it was by far the largest number ever to witness a political discussion. The novelty of the event drew even those with little or no interest in politics.</p><p data-numbered=\"false\"><sup>10</sup> The candidates, Republican Vice President Richard M. Nixon and Democratic Senator John F. Kennedy, had agreed to face each other and the nation in four one-hour sessions that the press dubbed the “Great <sup>15</sup> Debates.” Many expected Vice President Nixon to win the debates easily. He was ahead in the newspaper polls, he was an experienced public speaker, and he had served as vice president for nearly <sup>20</sup> eight years. Senator Kennedy was less well- known and, at forty-three, was the youngest man ever to run for president. Throughout the presidential race, his opponents criticized him for his relative youth and inexperience.</p><p data-numbered=\"false\"><sup>25</sup> By mutual agreement, the first session was limited to domestic issues within the United States. Each candidate was given eight minutes to make his opening remarks. During the remainder of the hour, the <sup>30</sup> candidates took turns responding to questions posed by selected reporters. Both Kennedy and Nixon dealt with the issues calmly and carefully. Viewers who expected to see a free-for-all were disappointed. The way <sup>35</sup> the two men appeared on the television screen, however, may have been as important as what they said. Kennedy looked at the camera while answering questions, appearing to speak directly to his viewers and give <sup>40</sup> them straight answers. Nixon was recovering from a severe bout of influenza, and he appeared tense and tired. He looked at the reporters who asked the questions instead of at the camera, giving some viewers the <sup>45</sup> impression that he avoided eye contact with his audience and thus suggesting that he was not trustworthy. Most commentators agreed that Kennedy gained from the encounter: many viewers who had previously thought he <sup>50</sup> lacked the maturity necessary to be president were won over by his charm, poise, and confident manner.</p><p data-numbered=\"false\">While far fewer people watched the three later sessions, much discussion ensued <sup>55</sup> regarding the influence of the Great Debates on the outcome of the 1960 presidential election. Some feared that the better TV performer was bound to come across as being the better candidate. “Is this a good way to <sup>60</sup> judge a person’s ability to serve as president of the United States?” they asked.</p><p data-numbered=\"false\">Kennedy ultimately won the election, but it was by the narrowest popular vote margin in more than eighty years. Some observers <sup>65</sup> concluded that, had the Great Debates been broadcast on radio and not on television, Nixon would have won.</p>",
    text: readingPassage120172018FormBPassageText,
    versionLabel: "2017-2018 Form B",
  }),
  questions: readingPassage120172018FormBQuestions,
};
