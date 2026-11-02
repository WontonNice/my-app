import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theEndOfAnEra20232024FormBPassageText = "(1) In 2004, the National Aeronautics and Space Administration (NASA) landed a rover, or robotic vehicle, named Opportunity on the surface of Mars. (2) The rover’s mission was to search for evidence of water and life on the planet. (3) The rover was designed to gather data on Mars for about 90 days, but Opportunity’s assignment did not come to an end until nearly 15 years later in 2019.\n\n(4) During the rover’s mission, a high-resolution camera on the rover’s robotic arm took magnified photographs of the surface of Mars. (5) The photographs revealed small round rocks scattered across the surface of the planet. (6) The scientists nicknamed these rocks “blueberries” based on the rocks’ resemblance to the fruit. (7) These rocks were important because their spherical shape suggested that liquid water may have flowed over them for a substantial amount of time.\n\n(8) Opportunity continued to provide valuable data about craters and other surface features. (9) Throughout the mission, the rover traveled a total of 28.06 miles across Mars’ surface. (10) When Opportunity had traveled nearly the length of a marathon, scientists celebrated the accomplishment by naming the valley that the rover was in Marathon Valley. (11) However, in 2018, a dust storm spread all over the planet, putting the rover’s progress on hold.\n\n(12) Prior to this planet-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover. (13) These prevented it from charging its batteries. (14) Scientists then had to rely on the passing winds and dust devils to clean off the solar panels. (15) After the massive 2018 dust storm subsided, scientists expected to be able to reestablish communication with Opportunity. (16) They made repeated attempts but to no avail. (17) In 2019, NASA finally declared Opportunity’s mission complete.\n\n(18) Opportunity was an important asset in scientists’ study of Mars; it returned valuable data about our neighbor planet and survived powerful dust storms. (19) NASA described the mission of Opportunity as “one of the most successful and enduring feats of interplanetary exploration.” (20) Even though this rover’s journey ended, other rovers still roam the surface of Mars.";

const theEndOfAnEra20232024FormBQuestions: ExamQuestion[] = [
  {
    "id": "the-end-of-an-era-2023-2024-form-b-pdf-shsat-2023-2024-b-q004",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "4",
      "pages": [
        5
      ]
    },
    "explanation": "The question asks for the sentence that should follow sentence 3 to best introduce the topic of\n\nthe passage.\n\nE. CORRECT. This sentence best introduces the passage’s topic: the Opportunity rover had many accomplishments on its mission, despite numerous challenges. Some of those accomplishments include providing high-resolution photographs (paragraph 2), traveling long distances (paragraph 3), and providing data about craters and other surface features (paragraph 3). F. Incorrect. Although paragraph 2 discusses how photographs taken by the rover showed rocks that may have been shaped by water, this idea alone is not the topic of the entire passage. G. Incorrect. While this sentence incorporates ideas about difficulties the scientists encountered because of the Opportunity rover’s design (paragraph 4), the main topic of the passage is not the design flaws and obstacles scientists encountered throughout the mission. The passage primarily focuses on the achievements of the mission. H. Incorrect. While it is true that the Opportunity rover mission lasted much longer than planned (sentence 3), this fact is a supporting detail of the passage, not the main topic of the passage; surpassing the original timeline is only one of the rover’s many achievements mentioned in the passage.",
    "explanationHtml": "<p>The question asks for the sentence that should follow sentence 3 to <strong>best </strong>introduce the topic of</p><p>the passage.</p><p><strong>E. CORRECT. </strong>This sentence best introduces the passage’s topic: the <em>Opportunity </em>rover had many accomplishments on its mission, despite numerous challenges. Some of those accomplishments include providing high-resolution photographs (paragraph 2), traveling long distances (paragraph 3), and providing data about craters and other surface features (paragraph 3). <strong>F. </strong>Incorrect. Although paragraph 2 discusses how photographs taken by the rover showed rocks that may have been shaped by water, this idea alone is not the topic of the entire passage. <strong>G. </strong>Incorrect. While this sentence incorporates ideas about difficulties the scientists encountered because of the <em>Opportunity </em>rover’s design (paragraph 4), the main topic of the passage is not the design flaws and obstacles scientists encountered throughout the mission. The passage primarily focuses on the achievements of the mission. <strong>H. </strong>Incorrect. While it is true that the <em>Opportunity </em>rover mission lasted much longer than planned (sentence 3), this fact is a supporting detail of the passage, not the main topic of the passage; surpassing the original timeline is only one of the rover’s many achievements mentioned in the passage.</p>",
    "points": 1,
    "prompt": "Which sentence should follow sentence 3 to best introduce the topic of the passage?",
    "promptHtml": "<p>Which sentence should follow sentence 3 to <strong>best </strong>introduce the topic of the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>Despite the challenges of operating on the surface of another planet, the <em>Opportunity </em>rover made many valuable contributions to the field of space research.</p>",
        "text": "Despite the challenges of operating on the surface of another planet, the Opportunity rover made many valuable contributions to the field of space research."
      },
      {
        "id": "B",
        "html": "<p>The <em>Opportunity </em>rover mission was a success because it informed NASA scientists about how water might have existed on Mars.</p>",
        "text": "The Opportunity rover mission was a success because it informed NASA scientists about how water might have existed on Mars."
      },
      {
        "id": "C",
        "html": "<p>Throughout the historic mission of the <em>Opportunity </em>rover, NASA scientists had to overcome challenges created by the flaws in the rover’s design.</p>",
        "text": "Throughout the historic mission of the Opportunity rover, NASA scientists had to overcome challenges created by the flaws in the rover’s design."
      },
      {
        "id": "D",
        "html": "<p>The <em>Opportunity </em>rover mission surpassed the original timeline of the assignment and allowed scientists to collect additional data about the planet Mars.</p>",
        "text": "The Opportunity rover mission surpassed the original timeline of the assignment and allowed scientists to collect additional data about the planet Mars."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2023-2024-form-b-pdf-shsat-2023-2024-b-q005",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "5",
      "pages": [
        5
      ]
    },
    "explanation": "The question asks for the word that should be added to the beginning of sentence 8 to provide\n\na better transition to the third paragraph.\n\nA. Incorrect. While sentence 8 is a more general statement than sentence 7, the word “Overall” would imply that all of the third paragraph features general information about the Opportunity rover. Instead, paragraphs 2 and 3 both describe specific accomplishments of the Opportunity rover (the discovery of possible water on Mars and the distance the rover traveled), so these paragraphs require a word between them that does not transition from the specific to the general. B. Incorrect. The word “Furthermore” would suggest that the author is making an argument in paragraph 2 that is further developed by the statement in sentence 8 and the rest of paragraph 3. Because this is not the case, the word “Furthermore\" is not a suitable transition from one paragraph to the next. C. CORRECT. The word “Meanwhile” is an appropriate transition to add before sentence 8, since the actions of the Opportunity rover in paragraph 2 (taking photographs) and in paragraph 3 (traveling long distances) happened at the same time and both served critical functions to the overall mission. D. Incorrect. The word “Consequently” would create a cause-and-effect relationship that does not exist between the paragraphs. The passage gives no indication that the rover’s actions in the third paragraph (traveling a far distance) resulted from the actions in the second",
    "explanationHtml": "<p>The question asks for the word that should be added to the beginning of sentence 8 to provide</p><p>a better transition to the third paragraph.</p><p><strong>A. </strong>Incorrect. While sentence 8 is a more general statement than sentence 7, the word “Overall” would imply that all of the third paragraph features general information about the <em>Opportunity </em>rover. Instead, paragraphs 2 and 3 both describe specific accomplishments of the <em>Opportunity </em>rover (the discovery of possible water on Mars and the distance the rover traveled), so these paragraphs require a word between them that does not transition from the specific to the general. <strong>B. </strong>Incorrect. The word “Furthermore” would suggest that the author is making an argument in paragraph 2 that is further developed by the statement in sentence 8 and the rest of paragraph 3. Because this is not the case, the word “Furthermore&quot; is not a suitable transition from one paragraph to the next. <strong>C. CORRECT. </strong>The word “Meanwhile” is an appropriate transition to add before sentence 8, since the actions of the <em>Opportunity </em>rover in paragraph 2 (taking photographs) and in paragraph 3 (traveling long distances) happened at the same time and both served critical functions to the overall mission. <strong>D. </strong>Incorrect. The word “Consequently” would create a cause-and-effect relationship that does not exist between the paragraphs. The passage gives no indication that the rover’s actions in the third paragraph (traveling a far distance) resulted from the actions in the second</p>",
    "points": 1,
    "prompt": "Which word should be added to the beginning of sentence 8 to provide a better transition to the third paragraph (sentences 8–11)?",
    "promptHtml": "<p>Which word should be added to the beginning of sentence 8 to provide a better transition to the third paragraph (sentences 8–11)?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>Overall,</p>",
        "text": "Overall,"
      },
      {
        "id": "B",
        "html": "<p>Furthermore,</p>",
        "text": "Furthermore,"
      },
      {
        "id": "C",
        "html": "<p>Meanwhile,</p>",
        "text": "Meanwhile,"
      },
      {
        "id": "D",
        "html": "<p>Consequently,</p>",
        "text": "Consequently,"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2023-2024-form-b-pdf-shsat-2023-2024-b-q006",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "6",
      "pages": [
        5
      ]
    },
    "explanation": "The question asks for the revision of sentence 11 that best maintains the formal style\n\nestablished in the passage.\n\nE. CORRECT. This sentence uses clear and formal writing throughout. The phrase “covered the planet” is accurate and formal without being overly poetic, and “standstill” is a precise word for putting something “on hold,” as expressed by the original sentence, while maintaining the formal style of the passage. F. Incorrect. Although the sentence is formal in style, the word “shrouded” is overly poetic, and the phrase “impermanently halting” is too stilted and formal for the style and tone of the passage. G. Incorrect. Although the sentence is formal in style, the words “enveloped” and “arresting” are overly poetic, especially when used in the same sentence, and the phrases “the whole of the planet” and “for a time” are needlessly wordy and imprecise, compared with the formal scientific language of the passage. H. Incorrect. The phrases “covered up the whole planet” and “quickly brought a stop to the progress of the rover” are less formal and unnecessarily wordy, compared with the formal style established by the rest of the passage.",
    "explanationHtml": "<p>The question asks for the revision of sentence 11 that <strong>best </strong>maintains the formal style</p><p>established in the passage.</p><p><strong>E. CORRECT. </strong>This sentence uses clear and formal writing throughout. The phrase “covered the planet” is accurate and formal without being overly poetic, and “standstill” is a precise word for putting something “on hold,” as expressed by the original sentence, while maintaining the formal style of the passage. <strong>F. </strong>Incorrect. Although the sentence is formal in style, the word “shrouded” is overly poetic, and the phrase “impermanently halting” is too stilted and formal for the style and tone of the passage. <strong>G. </strong>Incorrect. Although the sentence is formal in style, the words “enveloped” and “arresting” are overly poetic, especially when used in the same sentence, and the phrases “the whole of the planet” and “for a time” are needlessly wordy and imprecise, compared with the formal scientific language of the passage. <strong>H. </strong>Incorrect. The phrases “covered up the whole planet” and “quickly brought a stop to the progress of the rover” are less formal and unnecessarily wordy, compared with the formal style established by the rest of the passage.</p>",
    "points": 1,
    "prompt": "Which revision of sentence 11 best maintains the formal style established in the passage?",
    "promptHtml": "<p>Which revision of sentence 11 <strong>best </strong>maintains the formal style established in the passage?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "<p>However, in 2018, a dust storm covered the planet, bringing the rover’s progress to a standstill.</p>",
        "text": "However, in 2018, a dust storm covered the planet, bringing the rover’s progress to a standstill."
      },
      {
        "id": "B",
        "html": "<p>However, in 2018, a dust storm shrouded the planet, impermanently halting the rover’s progress.</p>",
        "text": "However, in 2018, a dust storm shrouded the planet, impermanently halting the rover’s progress."
      },
      {
        "id": "C",
        "html": "<p>However, in 2018, a dust storm enveloped the whole of the planet, arresting the rover’s progress for a time.</p>",
        "text": "However, in 2018, a dust storm enveloped the whole of the planet, arresting the rover’s progress for a time."
      },
      {
        "id": "D",
        "html": "<p>However, in 2018, a dust storm covered up the whole planet, which quickly brought a stop to the progress of the rover.</p>",
        "text": "However, in 2018, a dust storm covered up the whole planet, which quickly brought a stop to the progress of the rover."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2023-2024-form-b-pdf-shsat-2023-2024-b-q007",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "7",
      "pages": [
        6
      ]
    },
    "explanation": "The question asks for the best way to combine sentences 12 and 13.\n\nA. Incorrect. The phrase “this planet-wide dust storm” in the original sentence 12 makes a direct reference to sentence 11 and therefore acts as a transition that should be kept at the beginning. In this sentence, the transition phrase is placed at the end of the sentence, making the phrase confusing. In addition, the sentence is unnecessarily repetitive and wordy. B. Incorrect. This combination unnecessarily turns sentence 12 into an overly long dependent clause, making the connection between “it” and its antecedent, “the rover,” unclear and distracting from the subject of the sentence, “minor dust storms.” C. Incorrect. Not only does this combination move the reference to “this planet-wide dust storm” farther from sentence 11, but it is also unnecessarily wordy, adding “because” and repeating “the rover.” D. CORRECT. This sentence efficiently and accurately adds sentence 13 to sentence 12 as a dependent clause by changing “These prevented” to “preventing,” while also retaining the meanings of the original sentences 12 and 13.",
    "explanationHtml": "<p>The question asks for the <strong>best </strong>way to combine sentences 12 and 13.</p><p><strong>A. </strong>Incorrect. The phrase “this planet-wide dust storm” in the original sentence 12 makes a direct reference to sentence 11 and therefore acts as a transition that should be kept at the beginning. In this sentence, the transition phrase is placed at the end of the sentence, making the phrase confusing. In addition, the sentence is unnecessarily repetitive and wordy. <strong>B. </strong>Incorrect. This combination unnecessarily turns sentence 12 into an overly long dependent clause, making the connection between “it” and its antecedent, “the rover,” unclear and distracting from the subject of the sentence, “minor dust storms.” <strong>C. </strong>Incorrect. Not only does this combination move the reference to “this planet-wide dust storm” farther from sentence 11, but it is also unnecessarily wordy, adding “because” and repeating “the rover.” <strong>D. CORRECT. </strong>This sentence efficiently and accurately adds sentence 13 to sentence 12 as a dependent clause by changing “These prevented” to “preventing,” while also retaining the meanings of the original sentences 12 and 13.</p>",
    "points": 1,
    "prompt": "What is the best way to combine sentences 12 and 13?",
    "promptHtml": "<p>What is the <strong>best </strong>way to combine sentences 12 and 13?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>Preventing the rover from charging its batteries, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover prior to this planet-wide dust storm.</p>",
        "text": "Preventing the rover from charging its batteries, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover prior to this planet-wide dust storm."
      },
      {
        "id": "B",
        "html": "<p>Periodically depositing a layer of dust onto the solar panels of the rover prior to this planet-wide dust storm, minor dust storms had prevented it from charging its batteries.</p>",
        "text": "Periodically depositing a layer of dust onto the solar panels of the rover prior to this planet-wide dust storm, minor dust storms had prevented it from charging its batteries."
      },
      {
        "id": "C",
        "html": "<p>Minor dust storms, prior to this planet-wide dust storm, prevented the rover from charging its batteries because they had periodically deposited a layer of dust onto the solar panels of the rover.</p>",
        "text": "Minor dust storms, prior to this planet-wide dust storm, prevented the rover from charging its batteries because they had periodically deposited a layer of dust onto the solar panels of the rover."
      },
      {
        "id": "D",
        "html": "<p>Prior to this planet-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover, preventing it from charging its batteries.</p>",
        "text": "Prior to this planet-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover, preventing it from charging its batteries."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2023-2024-form-b-pdf-shsat-2023-2024-b-q008",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "8",
      "pages": [
        6
      ]
    },
    "explanation": "The question asks where the sentence should be added to the passage.\n\nE. Incorrect. While sentence 2 refers to Opportunity’s mission to search for evidence of water, sentence 3 mentions the rover lasting much longer than anticipated. Placing the sentence between these two ideas, rather than at the start of the second paragraph, where it introduces the topic of the paragraph, would create a disjointed and confusing experience for the reader. F. CORRECT. The sentence introduces the idea of finding possible evidence of water on Mars, which is the main topic of the second paragraph. G. Incorrect. The sentence sets up the main idea of paragraph 2, which is the possibility of water on Mars. As a concluding sentence, it would be repetitive and confusing. H. Incorrect. The sentence introduces the possibility of water on Mars, while sentences 8 and 9 discuss other surface features and the distance traveled by the rover. Adding the sentence here would create a disorganized paragraph.",
    "explanationHtml": "<p>The question asks where the sentence should be added to the passage.</p><p><strong>E. </strong>Incorrect. While sentence 2 refers to <em>Opportunity’</em>s mission to search for evidence of water, sentence 3 mentions the rover lasting much longer than anticipated. Placing the sentence between these two ideas, rather than at the start of the second paragraph, where it introduces the topic of the paragraph, would create a disjointed and confusing experience for the reader. <strong>F. CORRECT. </strong>The sentence introduces the idea of finding possible evidence of water on Mars, which is the main topic of the second paragraph. <strong>G. </strong>Incorrect. The sentence sets up the main idea of paragraph 2, which is the possibility of water on Mars. As a concluding sentence, it would be repetitive and confusing. <strong>H. </strong>Incorrect. The sentence introduces the possibility of water on Mars, while sentences 8 and 9 discuss other surface features and the distance traveled by the rover. Adding the sentence here would create a disorganized paragraph.</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nOne of Opportunity’s major contributions was finding possible evidence of the presence of water on Mars.\n\nWhere should the sentence be added to the passage?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\">One of <em>Opportunity</em>’s major contributions was finding possible evidence of the presence of water on Mars.</blockquote><p>Where should the sentence be added to the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>between sentences 2 and 3</p>",
        "text": "between sentences 2 and 3"
      },
      {
        "id": "B",
        "html": "<p>at the beginning of the second paragraph (before sentence 4)</p>",
        "text": "at the beginning of the second paragraph (before sentence 4)"
      },
      {
        "id": "C",
        "html": "<p>at the end of the second paragraph (after sentence 7)</p>",
        "text": "at the end of the second paragraph (after sentence 7)"
      },
      {
        "id": "D",
        "html": "<p>between sentences 8 and 9</p>",
        "text": "between sentences 8 and 9"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2023-2024-form-b-pdf-shsat-2023-2024-b-q009",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "9",
      "pages": [
        6
      ]
    },
    "explanation": "The question asks for the concluding sentence that should be added after sentence 20 to best\n\nsupport the information presented in the passage.\n\nA. Incorrect. The sentence does not summarize or make reference to the focus of the passage, which is the Opportunity rover. B. CORRECT. This sentence summarizes the ideas about the Opportunity rover while also extending those ideas to future research, an effective combination for a sentence that concludes a piece about a scientific topic. C. Incorrect. This sentence not only begins with the phrase “And in conjunction,” which is repetitive, but also introduces an entirely new idea (Mars Odyssey) instead of concluding on the main topic of the passage (the Opportunity rover). D. Incorrect. This sentence puts emphasis on Mars’s characteristics and makes a conclusion about “today’s rovers,” instead of referring back to the Opportunity rover, the main focus of the passage.",
    "explanationHtml": "<p>The question asks for the concluding sentence that should be added after sentence 20 to <strong>best</strong></p><p>support the information presented in the passage.</p><p><strong>A. </strong>Incorrect. The sentence does not summarize or make reference to the focus of the passage, which is the <em>Opportunity </em>rover. <strong>B. CORRECT. </strong>This sentence summarizes the ideas about the <em>Opportunity </em>rover while also extending those ideas to future research, an effective combination for a sentence that concludes a piece about a scientific topic. <strong>C. </strong>Incorrect. This sentence not only begins with the phrase “And in conjunction,” which is repetitive, but also introduces an entirely new idea (<em>Mars Odyssey</em>) instead of concluding on the main topic of the passage (the <em>Opportunity </em>rover). <strong>D. </strong>Incorrect. This sentence puts emphasis on Mars’s characteristics and makes a conclusion about “today’s rovers,” instead of referring back to the <em>Opportunity </em>rover, the main focus of the passage.</p>",
    "points": 1,
    "prompt": "Which concluding sentence should be added after sentence 20 to best support the information\n\npresented in the passage?",
    "promptHtml": "<p>Which concluding sentence should be added after sentence 20 to <strong>best </strong>support the information</p><p>presented in the passage?</p>",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "html": "<p>These rovers, including one named <em>Curiosity</em>, will help scientists answer their lingering questions about the planet.</p>",
        "text": "These rovers, including one named Curiosity, will help scientists answer their lingering questions about the planet."
      },
      {
        "id": "B",
        "html": "<p>Today’s rovers continue to add to <em>Opportunity</em>’s discoveries and will help us learn even more about the planet.</p>",
        "text": "Today’s rovers continue to add to Opportunity’s discoveries and will help us learn even more about the planet."
      },
      {
        "id": "C",
        "html": "<p>And in conjunction with these rovers, NASA is using other resources, including an orbiting spacecraft known as <em>Mars Odyssey</em>, for the exploration of the planet.</p>",
        "text": "And in conjunction with these rovers, NASA is using other resources, including an orbiting spacecraft known as Mars Odyssey, for the exploration of the planet."
      },
      {
        "id": "D",
        "html": "<p>With its red dust, rocky surface, and freezing temperatures, Mars will continue to be a challenging environment for today’s rovers.</p>",
        "text": "With its red dust, rocky surface, and freezing temperatures, Mars will continue to be a challenging environment for today’s rovers."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const theEndOfAnEra20232024FormBPassageSet: ExamPassageSet = {
  id: "ela-the-end-of-an-era-2023-2024-form-b",
  versionLabels: ["2023-2024 Form B"],
  label: "2023-2024 Form B",
  section: "revising_editing_a",
  questionCount: theEndOfAnEra20232024FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "the-end-of-an-era-2023-2024-form-b",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    titleHtml: "The End of an Era",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2023-2024-form-b","label":"2023-2024 Form B","year":"2023-2024","form":"B","packageId":"99cf8d7dae0050ba0dfbeca7ab7aa1503ec479b8058672391d419347a4594ac2"},
    title: "The End of an Era",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) In 2004, the National Aeronautics and Space Administration (NASA) landed a rover, or robotic vehicle, named <em>Opportunity </em>on the surface of Mars. (2) The rover’s mission was to search for evidence of water and life on the planet. (3) The rover was designed to gather data on Mars for about 90 days, but <em>Opportunity</em>’s assignment did not come to an end until nearly 15 years later in 2019.</p><p>(4) During the rover’s mission, a high-resolution camera on the rover’s robotic arm took magnified photographs of the surface of Mars. (5) The photographs revealed small round rocks scattered across the surface of the planet. (6) The scientists nicknamed these rocks “blueberries” based on the rocks’ resemblance to the fruit. (7) These rocks were important because their spherical shape suggested that liquid water may have flowed over them for a substantial amount of time.</p><p>(8) <em>Opportunity </em>continued to provide valuable data about craters and other surface features. (9) Throughout the mission, the rover traveled a total of 28.06 miles across Mars’ surface. (10) When <em>Opportunity </em>had traveled nearly the length of a marathon, scientists celebrated the accomplishment by naming the valley that the rover was in Marathon Valley. (11) However, in 2018, a dust storm spread all over the planet, putting the rover’s progress on hold.</p><p>(12) Prior to this planet-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover. (13) These prevented it from charging its batteries. (14) Scientists then had to rely on the passing winds and dust devils to clean off the solar panels. (15) After the massive 2018 dust storm subsided, scientists expected to be able to reestablish communication with <em>Opportunity</em>. (16) They made repeated attempts but to no avail. (17) In 2019, NASA finally declared <em>Opportunity</em>’s mission complete.</p><p>(18) <em>Opportunity </em>was an important asset in scientists’ study of Mars; it returned valuable data about our neighbor planet and survived powerful dust storms. (19) NASA described the mission of <em>Opportunity </em>as “one of the most successful and enduring feats of interplanetary exploration.” (20) Even though this rover’s journey ended, other rovers still roam the surface of Mars.</p>",
    text: theEndOfAnEra20232024FormBPassageText,
    versionLabel: "2023-2024 Form B",
  }),
  questions: theEndOfAnEra20232024FormBQuestions,
};
