import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theEndOfAnEra20262027FormBPassageText = "(1) In 2004, the National Aeronautics and Space Administration (NASA) landed a rover, or robotic vehicle, named Opportunity on the surface of Mars. (2) The rover’s mission was to search for evidence of water and life on the planet. (3) The rover was designed to gather data on Mars for about 90 days, but Opportunity’s assignment did not come to an end until nearly 15 years later in 2019.\n(4) During the rover’s mission, a high-resolution camera on the rover’s robotic arm took magnified photographs of the surface of Mars. (5) The photographs revealed small round rocks scattered across the surface of the planet. (6) The scientists nicknamed these rocks “blueberries” based on the rocks’ resemblance to the fruit. (7) These rocks were important because their spherical shape suggested that liquid water may have flowed over them for a substantial amount of time.\n(8) Opportunity continued to provide valuable data about craters and other surface features. (9) Throughout the mission, the rover traveled a total of 28.06 miles across Mars’ surface. (10) When Opportunity had traveled nearly the length of a marathon, scientists celebrated the accomplishment by naming the valley that the rover was in Marathon Valley. (11) However, in 2018, a dust storm spread all over the planet, putting the rover’s progress on hold.\n(12) Prior to this planet-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover. (13) These prevented it from charging its batteries. (14) Scientists then had to rely on the passing winds and dust devils to clean off the solar panels. (15) After the massive 2018 dust storm subsided, scientists expected to be able to reestablish communication with Opportunity. (16) They made repeated attempts but to no avail. (17) In 2019, NASA finally declared Opportunity’s mission complete.\n(18) Opportunity was an important asset in scientists’ study of Mars; it returned valuable data about our neighbor planet and survived powerful dust storms. (19) NASA described the mission of Opportunity as “one of the most successful and enduring feats of interplanetary exploration.” (20) Even though this rover’s journey ended, other rovers still roam the surface of Mars.";

const theEndOfAnEra20262027FormBQuestions: ExamQuestion[] = [
  {
    "id": "the-end-of-an-era-2026-2027-form-b-official-shsat-2026-b-42",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "42"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-d2f582b39512d1f9630a.png\" alt=\"Official explanation for question 42\">",
    "points": 1,
    "prompt": "Which sentence should follow sentence 3 to best introduce the topic of the passage?",
    "promptHtml": "<p><span><span>Which</span> <span>sentence</span> should follow <span>sentence 3</span> to <span><strong>best</strong></span> <span>introduce</span> the <span>topic</span> of the <span>passage</span>?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>Despite the challenges of operating on the surface of <span>another</span> planet, the <em>Opportunity</em> rover made many valuable contributions to the field of space <span>research</span>.</span></p>",
        "text": "Despite the challenges of operating on the surface of another planet, the Opportunity rover made many valuable contributions to the field of space research."
      },
      {
        "id": "B",
        "html": "<p><span>The <em>Opportunity</em> rover mission was a success <span>because</span> it informed NASA scientists about <span>how</span> water might have existed on Mars.</span></p>",
        "text": "The Opportunity rover mission was a success because it informed NASA scientists about how water might have existed on Mars."
      },
      {
        "id": "C",
        "html": "<p><span>Throughout the historic mission of the <em>Opportunity</em> rover, NASA scientists had to overcome challenges created by the flaws in the rover’s design.</span></p>",
        "text": "Throughout the historic mission of the Opportunity rover, NASA scientists had to overcome challenges created by the flaws in the rover’s design."
      },
      {
        "id": "D",
        "html": "<p><span>The <em>Opportunity</em> rover mission surpassed the original timeline of the assignment and allowed scientists to collect additional data about the planet Mars.</span></p>",
        "text": "The Opportunity rover mission surpassed the original timeline of the assignment and allowed scientists to collect additional data about the planet Mars."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2026-2027-form-b-official-shsat-2026-b-43",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "43"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-14f57f69cad0d996fca4.png\" alt=\"Official explanation for question 43\">",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Which word should be added to the beginning of sentence 8 to provide a better transition to the third paragraph (sentences 8–11)?\nMove the correct answer to the box.",
    "promptHtml": "<p><span><span>Which</span> <span>word</span> should be added to the <span>beginning</span> of <span>sentence</span> 8 to provide a better <span>transition</span> to the third <span>paragraph</span> (sentences </span><span>8–11)?</span></p> <p><span>Move the correct <span>answer</span> to the box.</span></p>",
    "dragDropContentHtml": "<p><span>(8) </span>{{slot-1}} <span><em>Opportunity</em> continued to provide valuable data about craters and other surface features.</span></p>",
    "topic": "Uncategorized",
    "allowReuse": false,
    "dragDropStyle": "outlined",
    "dragDropContent": [
      "(8) {{slot-1}} Opportunity continued to provide valuable data about craters and other surface features."
    ],
    "dragDropSlots": [
      {
        "correctItemId": "item-3",
        "id": "slot-1"
      }
    ],
    "items": [
      {
        "id": "item-1",
        "text": "Overall,"
      },
      {
        "id": "item-2",
        "text": "Furthermore,"
      },
      {
        "id": "item-3",
        "text": "Meanwhile,"
      },
      {
        "id": "item-4",
        "text": "Consequently,"
      }
    ],
    "type": "math_drag_drop"
  },
  {
    "id": "the-end-of-an-era-2026-2027-form-b-official-shsat-2026-b-44",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "44"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-ee8d5d4619a3b49f0732.png\" alt=\"Official explanation for question 44\">",
    "points": 1,
    "prompt": "Which revision of sentence 11 best maintains the formal style established in the passage?",
    "promptHtml": "<p><span><span>Which</span> <span>revision</span> of <span>sentence</span> 11 <span><strong>best</strong></span> maintains the formal style established in the <span>passage</span>?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>However</span>, in 2018, a dust storm covered the planet, bringing the rover’s progress to a standstill.</span></p>",
        "text": "However, in 2018, a dust storm covered the planet, bringing the rover’s progress to a standstill."
      },
      {
        "id": "B",
        "html": "<p><span><span>However</span>, in 2018, a dust storm shrouded the planet, impermanently halting the rover’s progress.</span></p>",
        "text": "However, in 2018, a dust storm shrouded the planet, impermanently halting the rover’s progress."
      },
      {
        "id": "C",
        "html": "<p><span><span>However</span>, in 2018, a dust storm enveloped the whole of the planet, arresting the rover’s progress for a time.</span></p>",
        "text": "However, in 2018, a dust storm enveloped the whole of the planet, arresting the rover’s progress for a time."
      },
      {
        "id": "D",
        "html": "<p><span><span>However</span>, in 2018, a dust storm covered up the whole planet, <span>which</span> quickly brought a stop to the progress of the rover.</span></p>",
        "text": "However, in 2018, a dust storm covered up the whole planet, which quickly brought a stop to the progress of the rover."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2026-2027-form-b-official-shsat-2026-b-45",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "45"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-4cc62d6418163433c10c.png\" alt=\"Official explanation for question 45\">",
    "points": 1,
    "prompt": "Read this sentence.\nOne of Opportunity’s major contributions was finding possible evidence of the presence of water on Mars.\nWhere should the sentence be added to the passage?",
    "promptHtml": "<p><span><span>Read</span> this <span>sentence</span>.</span></p> <blockquote data-boxed=\"true\"><span>One of </span><span><em>Opportunity</em>’s </span><span>major contributions was finding possible evidence of the presence of water on Mars.</span></blockquote> <p><span><span>Where</span> should the sentence be added to the <span>passage</span>?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>between <span>sentences</span> 2 and 3</span></p>",
        "text": "between sentences 2 and 3"
      },
      {
        "id": "B",
        "html": "<p><span>at the <span>beginning</span> of the second <span>paragraph</span> (<span>before</span> </span><span><span><span>sentence</span> 4)</span></span></p>",
        "text": "at the beginning of the second paragraph (before sentence 4)"
      },
      {
        "id": "C",
        "html": "<p><span>at the <span>end</span> of the second <span>paragraph</span> (after </span><span><span><span>sentence</span> 7)</span></span></p>",
        "text": "at the end of the second paragraph (after sentence 7)"
      },
      {
        "id": "D",
        "html": "<p><span>between <span>sentences</span> 8 and 9</span></p>",
        "text": "between sentences 8 and 9"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2026-2027-form-b-official-shsat-2026-b-46",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "46"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-7712050674c6600a8f1e.png\" alt=\"Official explanation for question 46\">",
    "points": 1,
    "prompt": "What is the best way to combine sentences 12 and 13?",
    "promptHtml": "<p><span><span>What</span> is the <span><strong>best</strong></span> way to combine </span><span><span><span>sentences</span> 12</span></span> <span>and 13?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>Preventing the rover from charging its batteries, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover prior to this planet<span></span>-wide dust storm.</span></p>",
        "text": "Preventing the rover from charging its batteries, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover prior to this planet-wide dust storm."
      },
      {
        "id": "B",
        "html": "<p><span>Periodically depositing a layer of dust onto the solar panels of the rover prior to this planet<span></span>-wide dust storm, minor dust storms had prevented it from charging its batteries.</span></p>",
        "text": "Periodically depositing a layer of dust onto the solar panels of the rover prior to this planet-wide dust storm, minor dust storms had prevented it from charging its batteries."
      },
      {
        "id": "C",
        "html": "<p><span>Minor dust storms, prior to this planet<span></span></span><span>-wide</span><span> dust storm, prevented the rover from charging its batteries <span>because</span> they had periodically deposited a layer of dust onto the solar panels of the rover.</span></p>",
        "text": "Minor dust storms, prior to this planet-wide dust storm, prevented the rover from charging its batteries because they had periodically deposited a layer of dust onto the solar panels of the rover."
      },
      {
        "id": "D",
        "html": "<p><span>Prior to this planet<span></span>-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover, preventing it from charging its batteries.</span></p>",
        "text": "Prior to this planet-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover, preventing it from charging its batteries."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const theEndOfAnEra20262027FormBPassageSet: ExamPassageSet = {
  id: "ela-the-end-of-an-era-2026-2027-form-b",
  versionLabels: ["2026-2027 Form B"],
  section: "revising_editing_a",
  questionCount: theEndOfAnEra20262027FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "the-end-of-an-era-2026-2027-form-b",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    titleHtml: "<span>The End of an Era</span>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"B","section":"ELA - Passage Set 7 of 7","packageId":"a27b560cd6e3131d2bc0ce42375905c4993b4543c4ce9d237ecf6dfb01b1441e"},
    title: "The End of an Era",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p><span>(1) In </span><span>2004,</span><span> the National Aeronautics and Space Administration (NASA) landed a rover, or robotic vehicle, named <em>Opportunity</em> on the surface of Mars.&nbsp; <span>(2) The</span> rover’s mission was to search for evidence of water and life on the planet.&nbsp; <span>(3) The</span> rover was designed to gather data on Mars for about <span>90 days,</span> but </span><span><em>Opportunity</em>’s</span><span> assignment did not come to an end until nearly <span>15 years</span> later in </span><span>2019.</span></p> <p><span>(4) During the rover’s mission, a high-resolution camera on the rover’s robotic arm took magnified photographs of the surface of Mars.&nbsp; <span>(5) The</span> photographs revealed small round rocks scattered across the surface of the planet.&nbsp; <span>(6) The</span> scientists nicknamed these rocks “blueberries” based on the rocks’ resemblance to the fruit.&nbsp; <span>(7) These</span> rocks were important because their spherical shape suggested that liquid water may have flowed over them for a substantial amount of time.</span></p> <p><span>(8) <em>Opportunity</em> continued to provide valuable data about craters and other surface features.&nbsp; <span>(9) Throughout</span> the mission, the rover traveled a total of <span>28.06 miles</span> across Mars’ surface.&nbsp; <span>(10) When</span> <em>Opportunity</em> had traveled nearly the length of a marathon, scientists celebrated the accomplishment by naming the valley that the rover was in Marathon Valley.&nbsp; <span>(11) However,</span> in </span><span>2018,</span><span> a dust storm spread all over the planet, putting the rover’s progress on hold.</span></p> <p><span>(12) Prior to this planet<span></span></span><span>-wide</span><span> dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover.&nbsp; <span>(13) These</span> prevented it from charging its batteries.&nbsp; <span>(14) Scientists</span> then had to rely on the passing winds and dust devils to clean off the solar panels.&nbsp; <span>(15) After</span> the massive </span><span>2018</span><span> dust storm subsided, scientists expected to be able to reestablish communication with <em>Opportunity</em>.&nbsp; <span>(16) They</span> made repeated attempts but to no avail.&nbsp; <span>(17) In</span> 2019, NASA finally declared </span><span><em>Opportunity</em>’s</span><span> mission complete.</span></p> <p><span>(18) <em>Opportunity</em> was an important asset in scientists’ study of Mars; it returned valuable data about our neighbor planet and survived powerful dust storms.&nbsp; <span>(19) NASA</span> described the mission of <em>Opportunity</em> as “one of the most successful and enduring feats of interplanetary exploration.”&nbsp; <span>(20) Even</span> though this rover’s journey ended, other rovers still roam the surface of Mars.</span></p>",
    text: theEndOfAnEra20262027FormBPassageText,
    versionLabel: "2026-2027 Form B",
  }),
  questions: theEndOfAnEra20262027FormBQuestions,
};
