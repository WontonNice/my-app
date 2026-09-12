import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theEndOfAnEraPassageText = "(1) In 2004, the National Aeronautics and Space Administration (NASA) landed a rover, or robotic vehicle, named Opportunity on the surface of Mars.  (2) The rover’s mission was to search for evidence of water and life on the planet.  (3) The rover was designed to gather data on Mars for about 90 days, but Opportunity’s assignment did not come to an end until nearly 15 years later in 2019.\n\n(4) During the rover’s mission, a high-resolution camera on the rover’s robotic arm took magnified photographs of the surface of Mars.  (5) The photographs revealed small round rocks scattered across the surface of the planet.  (6) The scientists nicknamed these rocks “blueberries” based on the rocks’ resemblance to the fruit.  (7) These rocks were important because their spherical shape suggested that liquid water may have flowed over them for a substantial amount of time.\n\n(8) Opportunity continued to provide valuable data about craters and other surface features.  (9) Throughout the mission, the rover traveled a total of 28.06 miles across Mars’ surface.  (10) When Opportunity had traveled nearly the length of a marathon, scientists celebrated the accomplishment by naming the valley that the rover was in Marathon Valley.  (11) However, in 2018, a dust storm spread all over the planet, putting the rover’s progress on hold.\n\n(12) Prior to this planet-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover.  (13) These prevented it from charging its batteries.  (14) Scientists then had to rely on the passing winds and dust devils to clean off the solar panels.  (15) After the massive 2018 dust storm subsided, scientists expected to be able to reestablish communication with Opportunity.  (16) They made repeated attempts but to no avail.  (17) In 2019, NASA finally declared Opportunity’s mission complete.\n\n(18) Opportunity was an important asset in scientists’ study of Mars; it returned valuable data about our neighbor planet and survived powerful dust storms.  (19) NASA described the mission of Opportunity as “one of the most successful and enduring feats of interplanetary exploration.”  (20) Even though this rover’s journey ended, other rovers still roam the surface of Mars.";

const theEndOfAnEraQuestions: ExamQuestion[] = [
  {
    "id": "the-end-of-an-era-1",
    "points": 1,
    "prompt": "Which sentence should follow sentence 3 to best introduce the topic of the passage?",
    "promptHtml": "Which&nbsp;sentence&nbsp;should&nbsp;follow&nbsp;sentence&nbsp;3&nbsp;to&nbsp;<strong>best</strong>&nbsp;introduce&nbsp;the&nbsp;topic&nbsp;of&nbsp;the&nbsp;passage?",
    "topic": "Revising & Editing",
    "choices": [
      {
        "id": "A",
        "html": "Despite&nbsp;the&nbsp;challenges&nbsp;of&nbsp;operating&nbsp;on&nbsp;the&nbsp;surface&nbsp;of&nbsp;another&nbsp;planet,&nbsp;the&nbsp;<em>Opportunity</em>&nbsp;rover&nbsp;made&nbsp;many&nbsp;valuable&nbsp;contributions&nbsp;to&nbsp;the&nbsp;field&nbsp;of&nbsp;space&nbsp;research.",
        "text": "Despite the challenges of operating on the surface of another planet, the Opportunity rover made many valuable contributions to the field of space research."
      },
      {
        "id": "B",
        "html": "The&nbsp;<em>Opportunity</em>&nbsp;rover&nbsp;mission&nbsp;was&nbsp;a&nbsp;success&nbsp;because&nbsp;it&nbsp;informed&nbsp;NASA&nbsp;scientists&nbsp;about&nbsp;how&nbsp;water&nbsp;might&nbsp;have&nbsp;existed&nbsp;on&nbsp;Mars.",
        "text": "The Opportunity rover mission was a success because it informed NASA scientists about how water might have existed on Mars."
      },
      {
        "id": "C",
        "html": "Throughout&nbsp;the&nbsp;historic&nbsp;mission&nbsp;of&nbsp;the&nbsp;<em>Opportunity</em>&nbsp;rover,&nbsp;NASA&nbsp;scientists&nbsp;had&nbsp;to&nbsp;overcome&nbsp;challenges&nbsp;created&nbsp;by&nbsp;the&nbsp;flaws&nbsp;in&nbsp;the&nbsp;rover’s&nbsp;design.",
        "text": "Throughout the historic mission of the Opportunity rover, NASA scientists had to overcome challenges created by the flaws in the rover’s design."
      },
      {
        "id": "D",
        "html": "The&nbsp;<em>Opportunity</em>&nbsp;rover&nbsp;mission&nbsp;surpassed&nbsp;the&nbsp;original&nbsp;timeline&nbsp;of&nbsp;the&nbsp;assignment&nbsp;and&nbsp;allowed&nbsp;scientists&nbsp;to&nbsp;collect&nbsp;additional&nbsp;data&nbsp;about&nbsp;the&nbsp;planet&nbsp;Mars.",
        "text": "The Opportunity rover mission surpassed the original timeline of the assignment and allowed scientists to collect additional data about the planet Mars."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-2",
    "points": 1,
    "prompt": "Which word should be added to the beginning of sentence 8 to provide a better transition to the third paragraph (sentences 8–11)?",
    "promptHtml": "Which&nbsp;word&nbsp;should&nbsp;be&nbsp;added&nbsp;to&nbsp;the&nbsp;beginning&nbsp;of&nbsp;sentence&nbsp;8&nbsp;to&nbsp;provide&nbsp;a&nbsp;better&nbsp;transition&nbsp;to&nbsp;the&nbsp;third&nbsp;paragraph&nbsp;(sentences&nbsp;8–11)?",
    "topic": "Revising & Editing",
    "choices": [
      {
        "id": "A",
        "html": "Overall,",
        "text": "Overall,"
      },
      {
        "id": "B",
        "html": "Furthermore,",
        "text": "Furthermore,"
      },
      {
        "id": "C",
        "html": "Meanwhile,",
        "text": "Meanwhile,"
      },
      {
        "id": "D",
        "html": "Consequently,",
        "text": "Consequently,"
      }
    ],
    "correctChoiceId": "C",
    "instructions": "Move the correct answer to the box.",
    "transitionBlankAfter": "Opportunity continued to provide valuable data about craters and other surface features.",
    "transitionBlankBefore": "",
    "transitionSentenceNumber": "(8)",
    "type": "transition_drop"
  },
  {
    "id": "the-end-of-an-era-3",
    "points": 1,
    "prompt": "Which revision of sentence 11 best maintains the formal style established in the passage?",
    "promptHtml": "Which&nbsp;revision&nbsp;of&nbsp;sentence&nbsp;11&nbsp;<strong>best</strong>&nbsp;maintains&nbsp;the&nbsp;formal&nbsp;style&nbsp;established&nbsp;in&nbsp;the&nbsp;passage?",
    "topic": "Revising & Editing",
    "choices": [
      {
        "id": "A",
        "html": "However,&nbsp;in&nbsp;2018,&nbsp;a&nbsp;dust&nbsp;storm&nbsp;covered&nbsp;the&nbsp;planet,&nbsp;bringing&nbsp;the&nbsp;rover’s&nbsp;progress&nbsp;to&nbsp;a&nbsp;standstill.",
        "text": "However, in 2018, a dust storm covered the planet, bringing the rover’s progress to a standstill."
      },
      {
        "id": "B",
        "html": "However,&nbsp;in&nbsp;2018,&nbsp;a&nbsp;dust&nbsp;storm&nbsp;shrouded&nbsp;the&nbsp;planet,&nbsp;impermanently&nbsp;halting&nbsp;the&nbsp;rover’s&nbsp;progress.",
        "text": "However, in 2018, a dust storm shrouded the planet, impermanently halting the rover’s progress."
      },
      {
        "id": "C",
        "html": "However,&nbsp;in&nbsp;2018,&nbsp;a&nbsp;dust&nbsp;storm&nbsp;enveloped&nbsp;the&nbsp;whole&nbsp;of&nbsp;the&nbsp;planet,&nbsp;arresting&nbsp;the&nbsp;rover’s&nbsp;progress&nbsp;for&nbsp;a&nbsp;time.",
        "text": "However, in 2018, a dust storm enveloped the whole of the planet, arresting the rover’s progress for a time."
      },
      {
        "id": "D",
        "html": "However,&nbsp;in&nbsp;2018,&nbsp;a&nbsp;dust&nbsp;storm&nbsp;covered&nbsp;up&nbsp;the&nbsp;whole&nbsp;planet,&nbsp;which&nbsp;quickly&nbsp;brought&nbsp;a&nbsp;stop&nbsp;to&nbsp;the&nbsp;progress&nbsp;of&nbsp;the&nbsp;rover.",
        "text": "However, in 2018, a dust storm covered up the whole planet, which quickly brought a stop to the progress of the rover."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-4",
    "points": 1,
    "prompt": "Read this sentence.\nOne of Opportunity’s major contributions was finding possible evidence of the presence of water on Mars.\nWhere should the sentence be added to the passage?",
    "promptHtml": "Read&nbsp;this&nbsp;sentence.<br>One&nbsp;of&nbsp;<em>Opportunity</em>’s&nbsp;major&nbsp;contributions&nbsp;was&nbsp;finding&nbsp;possible&nbsp;evidence&nbsp;of&nbsp;the&nbsp;presence&nbsp;of&nbsp;water&nbsp;on&nbsp;Mars.<br>Where&nbsp;should&nbsp;the&nbsp;sentence&nbsp;be&nbsp;added&nbsp;to&nbsp;the&nbsp;passage?",
    "topic": "Revising & Editing",
    "choices": [
      {
        "id": "A",
        "html": "between&nbsp;sentences&nbsp;2&nbsp;and&nbsp;3",
        "text": "between sentences 2 and 3"
      },
      {
        "id": "B",
        "html": "at&nbsp;the&nbsp;beginning&nbsp;of&nbsp;the&nbsp;second&nbsp;paragraph&nbsp;(before&nbsp;sentence&nbsp;4)",
        "text": "at the beginning of the second paragraph (before sentence 4)"
      },
      {
        "id": "C",
        "html": "at&nbsp;the&nbsp;end&nbsp;of&nbsp;the&nbsp;second&nbsp;paragraph&nbsp;(after&nbsp;sentence&nbsp;7)",
        "text": "at the end of the second paragraph (after sentence 7)"
      },
      {
        "id": "D",
        "html": "between&nbsp;sentences&nbsp;8&nbsp;and&nbsp;9",
        "text": "between sentences 8 and 9"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-end-of-an-era-5",
    "points": 1,
    "prompt": "What is the best way to combine sentences 12 and 13?",
    "promptHtml": "What&nbsp;is&nbsp;the&nbsp;<strong>best</strong>&nbsp;way&nbsp;to&nbsp;combine&nbsp;sentences&nbsp;12&nbsp;and&nbsp;13?",
    "topic": "Revising & Editing",
    "choices": [
      {
        "id": "A",
        "html": "Preventing&nbsp;the&nbsp;rover&nbsp;from&nbsp;charging&nbsp;its&nbsp;batteries,&nbsp;minor&nbsp;dust&nbsp;storms&nbsp;had&nbsp;periodically&nbsp;deposited&nbsp;a&nbsp;layer&nbsp;of&nbsp;dust&nbsp;onto&nbsp;the&nbsp;solar&nbsp;panels&nbsp;of&nbsp;the&nbsp;rover&nbsp;prior&nbsp;to&nbsp;this&nbsp;planet-wide&nbsp;dust&nbsp;storm.",
        "text": "Preventing the rover from charging its batteries, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover prior to this planet-wide dust storm."
      },
      {
        "id": "B",
        "html": "Periodically&nbsp;depositing&nbsp;a&nbsp;layer&nbsp;of&nbsp;dust&nbsp;onto&nbsp;the&nbsp;solar&nbsp;panels&nbsp;of&nbsp;the&nbsp;rover&nbsp;prior&nbsp;to&nbsp;this&nbsp;planet-wide&nbsp;dust&nbsp;storm,&nbsp;minor&nbsp;dust&nbsp;storms&nbsp;had&nbsp;prevented&nbsp;it&nbsp;from&nbsp;charging&nbsp;its&nbsp;batteries.",
        "text": "Periodically depositing a layer of dust onto the solar panels of the rover prior to this planet-wide dust storm, minor dust storms had prevented it from charging its batteries."
      },
      {
        "id": "C",
        "html": "Minor&nbsp;dust&nbsp;storms,&nbsp;prior&nbsp;to&nbsp;this&nbsp;planet-wide&nbsp;dust&nbsp;storm,&nbsp;prevented&nbsp;the&nbsp;rover&nbsp;from&nbsp;charging&nbsp;its&nbsp;batteries&nbsp;because&nbsp;they&nbsp;had&nbsp;periodically&nbsp;deposited&nbsp;a&nbsp;layer&nbsp;of&nbsp;dust&nbsp;onto&nbsp;the&nbsp;solar&nbsp;panels&nbsp;of&nbsp;the&nbsp;rover.",
        "text": "Minor dust storms, prior to this planet-wide dust storm, prevented the rover from charging its batteries because they had periodically deposited a layer of dust onto the solar panels of the rover."
      },
      {
        "id": "D",
        "html": "Prior&nbsp;to&nbsp;this&nbsp;planet-wide&nbsp;dust&nbsp;storm,&nbsp;minor&nbsp;dust&nbsp;storms&nbsp;had&nbsp;periodically&nbsp;deposited&nbsp;a&nbsp;layer&nbsp;of&nbsp;dust&nbsp;onto&nbsp;the&nbsp;solar&nbsp;panels&nbsp;of&nbsp;the&nbsp;rover,&nbsp;preventing&nbsp;it&nbsp;from&nbsp;charging&nbsp;its&nbsp;batteries.",
        "text": "Prior to this planet-wide dust storm, minor dust storms had periodically deposited a layer of dust onto the solar panels of the rover, preventing it from charging its batteries."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const theEndOfAnEraPassageSet: ExamPassageSet = {
  id: "ela-the-end-of-an-era",
  section: "revising_editing_a",
  questionCount: theEndOfAnEraQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createProsePassage({
    id: "the-end-of-an-era",
    title: "The End of an Era",
    passageType: "informational",
    richText: "<p>(1)&nbsp;In&nbsp;2004,&nbsp;the&nbsp;National&nbsp;Aeronautics&nbsp;and&nbsp;Space&nbsp;Administration&nbsp;(NASA)&nbsp;landed&nbsp;a&nbsp;rover,&nbsp;or&nbsp;robotic&nbsp;vehicle,&nbsp;named&nbsp;<em>Opportunity</em>&nbsp;on&nbsp;the&nbsp;surface&nbsp;of&nbsp;Mars.&nbsp;&nbsp;(2)&nbsp;The&nbsp;rover’s&nbsp;mission&nbsp;was&nbsp;to&nbsp;search&nbsp;for&nbsp;evidence&nbsp;of&nbsp;water&nbsp;and&nbsp;life&nbsp;on&nbsp;the&nbsp;planet.&nbsp;&nbsp;(3)&nbsp;The&nbsp;rover&nbsp;was&nbsp;designed&nbsp;to&nbsp;gather&nbsp;data&nbsp;on&nbsp;Mars&nbsp;for&nbsp;about&nbsp;90&nbsp;days,&nbsp;but&nbsp;<em>Opportunity</em>’s&nbsp;assignment&nbsp;did&nbsp;not&nbsp;come&nbsp;to&nbsp;an&nbsp;end&nbsp;until&nbsp;nearly&nbsp;15&nbsp;years&nbsp;later&nbsp;in&nbsp;2019.</p><p>(4)&nbsp;During&nbsp;the&nbsp;rover’s&nbsp;mission,&nbsp;a&nbsp;high-resolution&nbsp;camera&nbsp;on&nbsp;the&nbsp;rover’s&nbsp;robotic&nbsp;arm&nbsp;took&nbsp;magnified&nbsp;photographs&nbsp;of&nbsp;the&nbsp;surface&nbsp;of&nbsp;Mars.&nbsp;&nbsp;(5)&nbsp;The&nbsp;photographs&nbsp;revealed&nbsp;small&nbsp;round&nbsp;rocks&nbsp;scattered&nbsp;across&nbsp;the&nbsp;surface&nbsp;of&nbsp;the&nbsp;planet.&nbsp;&nbsp;(6)&nbsp;The&nbsp;scientists&nbsp;nicknamed&nbsp;these&nbsp;rocks&nbsp;“blueberries”&nbsp;based&nbsp;on&nbsp;the&nbsp;rocks’&nbsp;resemblance&nbsp;to&nbsp;the&nbsp;fruit.&nbsp;&nbsp;(7)&nbsp;These&nbsp;rocks&nbsp;were&nbsp;important&nbsp;because&nbsp;their&nbsp;spherical&nbsp;shape&nbsp;suggested&nbsp;that&nbsp;liquid&nbsp;water&nbsp;may&nbsp;have&nbsp;flowed&nbsp;over&nbsp;them&nbsp;for&nbsp;a&nbsp;substantial&nbsp;amount&nbsp;of&nbsp;time.</p><p>(8)&nbsp;<em>Opportunity</em>&nbsp;continued&nbsp;to&nbsp;provide&nbsp;valuable&nbsp;data&nbsp;about&nbsp;craters&nbsp;and&nbsp;other&nbsp;surface&nbsp;features.&nbsp;&nbsp;(9)&nbsp;Throughout&nbsp;the&nbsp;mission,&nbsp;the&nbsp;rover&nbsp;traveled&nbsp;a&nbsp;total&nbsp;of&nbsp;28.06&nbsp;miles&nbsp;across&nbsp;Mars’&nbsp;surface.&nbsp;&nbsp;(10)&nbsp;When&nbsp;<em>Opportunity</em>&nbsp;had&nbsp;traveled&nbsp;nearly&nbsp;the&nbsp;length&nbsp;of&nbsp;a&nbsp;marathon,&nbsp;scientists&nbsp;celebrated&nbsp;the&nbsp;accomplishment&nbsp;by&nbsp;naming&nbsp;the&nbsp;valley&nbsp;that&nbsp;the&nbsp;rover&nbsp;was&nbsp;in&nbsp;Marathon&nbsp;Valley.&nbsp;&nbsp;(11)&nbsp;However,&nbsp;in&nbsp;2018,&nbsp;a&nbsp;dust&nbsp;storm&nbsp;spread&nbsp;all&nbsp;over&nbsp;the&nbsp;planet,&nbsp;putting&nbsp;the&nbsp;rover’s&nbsp;progress&nbsp;on&nbsp;hold.</p><p>(12)&nbsp;Prior&nbsp;to&nbsp;this&nbsp;planet-wide&nbsp;dust&nbsp;storm,&nbsp;minor&nbsp;dust&nbsp;storms&nbsp;had&nbsp;periodically&nbsp;deposited&nbsp;a&nbsp;layer&nbsp;of&nbsp;dust&nbsp;onto&nbsp;the&nbsp;solar&nbsp;panels&nbsp;of&nbsp;the&nbsp;rover.&nbsp;&nbsp;(13)&nbsp;These&nbsp;prevented&nbsp;it&nbsp;from&nbsp;charging&nbsp;its&nbsp;batteries.&nbsp;&nbsp;(14)&nbsp;Scientists&nbsp;then&nbsp;had&nbsp;to&nbsp;rely&nbsp;on&nbsp;the&nbsp;passing&nbsp;winds&nbsp;and&nbsp;dust&nbsp;devils&nbsp;to&nbsp;clean&nbsp;off&nbsp;the&nbsp;solar&nbsp;panels.&nbsp;&nbsp;(15)&nbsp;After&nbsp;the&nbsp;massive&nbsp;2018&nbsp;dust&nbsp;storm&nbsp;subsided,&nbsp;scientists&nbsp;expected&nbsp;to&nbsp;be&nbsp;able&nbsp;to&nbsp;reestablish&nbsp;communication&nbsp;with&nbsp;<em>Opportunity</em>.&nbsp;&nbsp;(16)&nbsp;They&nbsp;made&nbsp;repeated&nbsp;attempts&nbsp;but&nbsp;to&nbsp;no&nbsp;avail.&nbsp;&nbsp;(17)&nbsp;In&nbsp;2019,&nbsp;NASA&nbsp;finally&nbsp;declared&nbsp;<em>Opportunity</em>’s&nbsp;mission&nbsp;complete.</p><p>(18)&nbsp;<em>Opportunity</em>&nbsp;was&nbsp;an&nbsp;important&nbsp;asset&nbsp;in&nbsp;scientists’&nbsp;study&nbsp;of&nbsp;Mars;&nbsp;it&nbsp;returned&nbsp;valuable&nbsp;data&nbsp;about&nbsp;our&nbsp;neighbor&nbsp;planet&nbsp;and&nbsp;survived&nbsp;powerful&nbsp;dust&nbsp;storms.&nbsp;&nbsp;(19)&nbsp;NASA&nbsp;described&nbsp;the&nbsp;mission&nbsp;of&nbsp;<em>Opportunity</em>&nbsp;as&nbsp;“one&nbsp;of&nbsp;the&nbsp;most&nbsp;successful&nbsp;and&nbsp;enduring&nbsp;feats&nbsp;of&nbsp;interplanetary&nbsp;exploration.”&nbsp;&nbsp;(20)&nbsp;Even&nbsp;though&nbsp;this&nbsp;rover’s&nbsp;journey&nbsp;ended,&nbsp;other&nbsp;rovers&nbsp;still&nbsp;roam&nbsp;the&nbsp;surface&nbsp;of&nbsp;Mars.</p><p>\n\n</p>",
    text: theEndOfAnEraPassageText,
    versionLabel: "2025-2026 Form B",
  }),
  questions: theEndOfAnEraQuestions,
};
