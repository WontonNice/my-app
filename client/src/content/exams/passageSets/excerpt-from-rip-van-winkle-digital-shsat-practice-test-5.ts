import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromRipVanWinkleDigitalShsatPracticeTest5PassageText = "As he was about to descend, he heard a voice from a distance, hallooing: “Rip Van Winkle! Rip Van Winkle!” He looked round, but could see nothing but a crow winging its solitary flight across the mountain. He thought his fancy must have deceived him, and turned again to descend, when he heard the same cry ring through the still evening air: “Rip Van Winkle! Rip Van Winkle!” At the same time Wolf bristled up his back, and giving a low growl, skulked to his master’s side, looking fearfully down into the glen. Rip now felt a vague apprehension stealing over him; he looked anxiously in the same direction, and perceived a strange figure slowly toiling up the rocks, and bending under the weight of something he carried on his back. He was surprised to see any human being in this lonely and unfrequented place; but supposing it to be some one of the neighbourhood in need of his assistance, he hastened down to yield it.\n\nOn nearer approach he was still more surprised at the singularity of the stranger’s appearance. He was a short, square-built old fellow, with thick bushy hair, and a grizzled beard. His dress was of the antique Dutch fashion: a cloth doublet strapped round the waist—several pair of breeches, the outer one of ample volume, decorated with rows of buttons down the sides, and bunches at the knees. He bore on his shoulder a stout keg, that seemed full of liquor, and made signs for Rip to approach and assist him with the load. Though rather shy and distrustful of his new acquaintance, Rip complied with his usual alacrity; and mutually relieving one another, they clambered up a narrow gully, apparently the dry bed of a mountain torrent. As they ascended, Rip every now and then heard long, rolling peals, like distant thunder, that seemed to issue out of a deep ravine, or rather cleft, between lofty rocks, toward which their ragged path conducted. He paused for an instant, but supposing it to be the muttering of one of those transient thunder-showers which often take place in mountain heights, he proceeded. Passing through the ravine, they came to a hollow, like a small amphitheatre, surrounded by perpendicular precipices, over the brinks of which impending trees shot their branches, so that you only caught glimpses of the azure sky and the bright evening cloud. During the whole time Rip and his companion had laboured on in silence; for though the former marvelled greatly what could be the object of carrying a keg of liquor up this wild mountain, yet there was something strange and incomprehensible about the unknown, that inspired awe and checked familiarity.\n\nOn entering the amphitheatre, new objects of wonder presented themselves. On a level spot in the centre was a company of odd-looking personages playing at ninepins. They were dressed in a quaint, outlandish fashion; some wore short doublets, others jerkins, with long knives in their belts, and most of them had enormous breeches, of similar style with that of the guide’s. Their visages, too, were peculiar; one had a large beard, broad face, and small piggish eyes; the face of another seemed to consist entirely of nose, and was surmounted by a white sugar-loaf hat, set off with a little red cock’s tail. They all had beards, of various shapes and colours. There was one who seemed to be the commander. He was a stout old gentleman, with a weather-beaten countenance; he wore a laced doublet, broad belt and hanger, high-crowned hat and feather, red stockings, and high-heeled shoes, with roses in them. The whole group reminded Rip of the figures in an old Flemish painting, in the parlour of Dominie Van Shaick, the village parson, and which had been brought over from Holland at the time of the settlement.\n\nWhat seemed particularly odd to Rip was, that these folks were evidently amusing themselves, yet they maintained the gravest faces, the most mysterious silence, and were, withal, the most melancholy party of pleasure he had ever witnessed. Nothing interrupted the stillness of the scene but the noise of the balls, which, whenever they were rolled, echoed along the mountains like rumbling peals of thunder.\n\nAs Rip and his companion approached them, they suddenly desisted from their play, and stared at him with such fixed, statue-like gaze, and such strange, uncouth, lack-lustre countenances, that his heart turned within him, and his knees smote together. His companion now emptied the contents of the keg into large flagons, and made signs to him to wait upon the company. He obeyed with fear and trembling; they quaffed the liquor in profound silence, and then returned to their game.\n\nBy degrees Rip’s awe and apprehension subsided. He even ventured, when no eye was fixed upon him, to taste the beverage, which he found had much of the flavour of excellent Hollands. He was naturally a thirsty soul, and was soon tempted to repeat the draught. One taste provoked another; and he reiterated his visits to the flagon so often that at length his senses were overpowered, his eyes swam in his head, his head gradually declined, and he fell into a deep sleep.";

const excerptFromRipVanWinkleDigitalShsatPracticeTest5Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-rip-van-winkle-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-1",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "1"
    },
    "explanation": "Correct Answer: B\nExplanation: The stem asks which sentence best supports Rip's vague unease about his silent guide\nA. Incorrect: This sentence explains why Rip approaches the stranger in the first place; it shows surprise at meeting someone, not unease about the figure's strangeness.\nB. Correct: This sentence directly names the feeling the stem asks about: the companion's strangeness inspires awe in Rip and keeps him from acting familiar.\nC. Incorrect: This sentence only describes the stranger's actions; it does not describe any feeling Rip has about him.\nD. Incorrect: This sentence shows Rip's general shyness, but it credits his compliance to habit (\"his usual alacrity\"), not to unease about the stranger's strangeness.",
    "explanationHtml": "<p>Correct Answer: B</p><p>Explanation: The stem asks which sentence <strong>best</strong> supports Rip's vague unease about his silent guide</p><p>A. Incorrect: This sentence explains why Rip approaches the stranger in the first place; it shows surprise at meeting someone, not unease about the figure's strangeness.</p><p>B. Correct: This sentence directly names the feeling the stem asks about: the companion's strangeness inspires awe in Rip and keeps him from acting familiar.</p><p>C. Incorrect: This sentence only describes the stranger's actions; it does not describe any feeling Rip has about him.</p><p>D. Incorrect: This sentence shows Rip's general shyness, but it credits his compliance to habit (&quot;his usual alacrity&quot;), not to unease about the stranger's strangeness.</p>",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that Rip feels a vague unease about the silent stranger guiding him up the mountain?",
    "promptHtml": "<p>Which sentence from the excerpt <strong>best</strong> supports the idea that Rip feels a vague unease about the silent stranger guiding him up the mountain?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>&quot;He was surprised to see any human being in this lonely and unfrequented place; but supposing it to be some one of the neighbourhood in need of his assistance, he hastened down to yield it.&quot; (paragraph 1)</p>",
        "text": "\"He was surprised to see any human being in this lonely and unfrequented place; but supposing it to be some one of the neighbourhood in need of his assistance, he hastened down to yield it.\" (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>&quot;During the whole time Rip and his companion had laboured on in silence; for though the former marvelled greatly what could be the object of carrying a keg of liquor up this wild mountain, yet there was something strange and incomprehensible about the unknown, that inspired awe and checked familiarity.&quot; (paragraph 2)</p>",
        "text": "\"During the whole time Rip and his companion had laboured on in silence; for though the former marvelled greatly what could be the object of carrying a keg of liquor up this wild mountain, yet there was something strange and incomprehensible about the unknown, that inspired awe and checked familiarity.\" (paragraph 2)"
      },
      {
        "id": "C",
        "html": "<p>&quot;He bore on his shoulder a stout keg, that seemed full of liquor, and made signs for Rip to approach and assist him with the load.&quot; (paragraph 2)</p>",
        "text": "\"He bore on his shoulder a stout keg, that seemed full of liquor, and made signs for Rip to approach and assist him with the load.\" (paragraph 2)"
      },
      {
        "id": "D",
        "html": "<p>&quot;Though rather shy and distrustful of his new acquaintance, Rip complied with his usual alacrity.&quot; (paragraph 2)</p>",
        "text": "\"Though rather shy and distrustful of his new acquaintance, Rip complied with his usual alacrity.\" (paragraph 2)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-rip-van-winkle-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-2",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "2"
    },
    "explanation": "Correct Answer: D\nExplanation: The mismatch between the men's silence and their supposed amusement points to an activity that feels obligatory rather than enjoyable\nA. Incorrect: The passage never mentions how long the men have played or any fatigue with the game itself, only the mismatch between their silence and their supposed amusement.\nB. Incorrect: The men do not appear aware of Rip in paragraph 4 at all; their odd manner is described before Rip and his guide even approach them in paragraph 5.\nC. Incorrect: The only rule-like detail given is that \"nothing interrupted the stillness of the scene but the noise of the balls,\" which describes the game's sound, not a rule against noise.\nD. Correct: Paragraph 4 states that although the men are \"amusing themselves,\" they wear \"the gravest faces\" and are \"the most melancholy party of pleasure,\" suggesting the activity brings them no genuine enjoyment.",
    "explanationHtml": "<p>Correct Answer: D</p><p>Explanation: The mismatch between the men's silence and their supposed amusement points to an activity that feels obligatory rather than enjoyable</p><p>A. Incorrect: The passage never mentions how long the men have played or any fatigue with the game itself, only the mismatch between their silence and their supposed amusement.</p><p>B. Incorrect: The men do not appear aware of Rip in paragraph 4 at all; their odd manner is described before Rip and his guide even approach them in paragraph 5.</p><p>C. Incorrect: The only rule-like detail given is that &quot;nothing interrupted the stillness of the scene but the noise of the balls,&quot; which describes the game's sound, not a rule against noise.</p><p>D. Correct: Paragraph 4 states that although the men are &quot;amusing themselves,&quot; they wear &quot;the gravest faces&quot; and are &quot;the <strong>most</strong> melancholy party of pleasure,&quot; suggesting the activity brings them no genuine enjoyment.</p>",
    "points": 1,
    "prompt": "The narrator's description of the ninepins players in paragraph 4 most nearly suggests that",
    "promptHtml": "<p>The narrator's description of the ninepins players in paragraph 4 <strong>most nearly suggests</strong> that</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the men have grown tired of playing the same game for many years.</p>",
        "text": "the men have grown tired of playing the same game for many years."
      },
      {
        "id": "B",
        "html": "<p>the men are trying to intimidate Rip by ignoring his presence.</p>",
        "text": "the men are trying to intimidate Rip by ignoring his presence."
      },
      {
        "id": "C",
        "html": "<p>the men are following strict rules that forbid making unnecessary noise.</p>",
        "text": "the men are following strict rules that forbid making unnecessary noise."
      },
      {
        "id": "D",
        "html": "<p>the men are performing a ritual that gives them no real pleasure.</p>",
        "text": "the men are performing a ritual that gives them no real pleasure."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-rip-van-winkle-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-3",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "3"
    },
    "explanation": "Correct Answer: A\nExplanation: the stem asks how paragraph 2 builds the passage's mysterious atmosphere\nA. Correct: Paragraph 2 layers ominous physical details (the gully, the thunder-like peals) with the men's unexplained silence, building suspense before the amphitheatre is revealed.\nB. Incorrect: The paragraph never gives any personal history for the stranger; it stays focused on the physical climb Rip and the stranger share.\nC. Incorrect: No one in paragraph 2 explains the earlier voice calling Rip's name; that mystery is left unresolved.\nD. Incorrect: Paragraph 2 stays with the present climb; it does not flash back to any earlier scene in the village.",
    "explanationHtml": "<p>Correct Answer: A</p><p>Explanation: the stem asks how paragraph 2 builds the passage's mysterious atmosphere</p><p>A. Correct: Paragraph 2 layers ominous physical details (the gully, the thunder-like peals) with the men's unexplained silence, building suspense before the amphitheatre is revealed.</p><p>B. Incorrect: The paragraph never gives any personal history for the stranger; it stays focused on the physical climb Rip and the stranger share.</p><p>C. Incorrect: No one in paragraph 2 explains the earlier voice calling Rip's name; that mystery is left unresolved.</p><p>D. Incorrect: Paragraph 2 stays with the present climb; it does not flash back to any earlier scene in the village.</p>",
    "points": 1,
    "prompt": "How does paragraph 2 contribute to the development of the passage's atmosphere of mystery?",
    "promptHtml": "<p>How does paragraph 2 contribute to the development of the passage's atmosphere of mystery?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It builds suspense by pairing ominous physical details of the ascent with the men's uneasy silence.</p>",
        "text": "It builds suspense by pairing ominous physical details of the ascent with the men's uneasy silence."
      },
      {
        "id": "B",
        "html": "<p>It shifts the passage's focus away from Rip and onto the unnamed stranger's hidden personal history.</p>",
        "text": "It shifts the passage's focus away from Rip and onto the unnamed stranger's hidden personal history."
      },
      {
        "id": "C",
        "html": "<p>It resolves the mystery introduced in paragraph 1 by finally revealing who is calling Rip's name.</p>",
        "text": "It resolves the mystery introduced in paragraph 1 by finally revealing who is calling Rip's name."
      },
      {
        "id": "D",
        "html": "<p>It interrupts the steady climb with a lengthy flashback to Rip's earlier life in the village.</p>",
        "text": "It interrupts the steady climb with a lengthy flashback to Rip's earlier life in the village."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-rip-van-winkle-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-4",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "4"
    },
    "explanation": "Correct Answer: A\nExplanation: the stem asks for a theme suggested by Rip's strange encounter\nA. Correct: Rip repeatedly helps and follows the stranger even though he does not understand what he is witnessing, illustrating how curiosity draws him toward an experience whose significance he cannot yet grasp.\nB. Incorrect: Rip's willingness to help is not shown to earn him friendship; the strange men barely acknowledge him beyond a fixed stare.\nC. Incorrect: The danger in the excerpt comes from the uncanny men and the mysterious liquor, not from the mountain landscape itself.\nD. Incorrect: The passage does not comment on the wisdom of climbing alone; it focuses on what Rip experiences once he meets the stranger.",
    "explanationHtml": "<p>Correct Answer: A</p><p>Explanation: the stem asks for a theme suggested by Rip's strange encounter</p><p>A. Correct: Rip repeatedly helps and follows the stranger even though he does not understand what he is witnessing, illustrating how curiosity draws him toward an experience whose significance he cannot yet grasp.</p><p>B. Incorrect: Rip's willingness to help is not shown to earn him friendship; the strange men barely acknowledge him beyond a fixed stare.</p><p>C. Incorrect: The danger in the excerpt comes from the uncanny men and the mysterious liquor, not from the mountain landscape itself.</p><p>D. Incorrect: The passage does not comment on the wisdom of climbing alone; it focuses on what Rip experiences once he meets the stranger.</p>",
    "points": 1,
    "prompt": "Which statement best describes a theme suggested by Rip's encounter in the mountains?",
    "promptHtml": "<p>Which statement <strong>best</strong> describes a theme suggested by Rip's encounter in the mountains?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Curiosity can lead a person into an experience whose full meaning is not yet clear.</p>",
        "text": "Curiosity can lead a person into an experience whose full meaning is not yet clear."
      },
      {
        "id": "B",
        "html": "<p>Kindness shown to strangers is always rewarded with immediate and lasting friendship.</p>",
        "text": "Kindness shown to strangers is always rewarded with immediate and lasting friendship."
      },
      {
        "id": "C",
        "html": "<p>The natural world is always far more dangerous than any human community could be.</p>",
        "text": "The natural world is always far more dangerous than any human community could be."
      },
      {
        "id": "D",
        "html": "<p>Ordinary, cautious people should generally avoid climbing remote mountains entirely alone.</p>",
        "text": "Ordinary, cautious people should generally avoid climbing remote mountains entirely alone."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-rip-van-winkle-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-5",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "5"
    },
    "explanation": "Correct Answer: C\nExplanation: the stem asks what the fear-laden word choice in this sentence conveys\nA. Incorrect: The men are described as \"lack-lustre\" and statue-like, not angry, and nothing suggests the game is an important contest.\nB. Incorrect: The sentence describes the players fixing Rip with a stare and Rip's fearful physical reaction, not indifference on the players' part.\nC. Correct: Phrases such as \"statue-like gaze,\" \"lack-lustre countenances,\" \"his heart turned within him,\" and \"his knees smote together\" are visceral images of fear.\nD. Incorrect: This sentence does not mention the players' clothing at all; it focuses on their stare and Rip's physical reaction.",
    "explanationHtml": "<p>Correct Answer: C</p><p>Explanation: the stem asks what the fear-laden word choice in this sentence conveys</p><p>A. Incorrect: The men are described as &quot;lack-lustre&quot; and statue-like, not angry, and nothing suggests the game is an important contest.</p><p>B. Incorrect: The sentence describes the players fixing Rip with a stare and Rip's fearful physical reaction, not indifference on the players' part.</p><p>C. Correct: Phrases such as &quot;statue-like gaze,&quot; &quot;lack-lustre countenances,&quot; &quot;his heart turned within him,&quot; and &quot;his knees smote together&quot; are visceral images of fear.</p><p>D. Incorrect: This sentence does not mention the players' clothing at all; it focuses on their stare and Rip's physical reaction.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5:\n“As Rip and his companion approached them, they suddenly desisted from their play, and stared at him with such fixed, statue-like gaze, and such strange, uncouth, lack-lustre countenances, that his heart turned within him, and his knees smote together.”\nThe word choice in this sentence mainly conveys",
    "promptHtml": "<p>Read this sentence from paragraph 5:</p><p><strong>“As Rip and his companion approached them, they suddenly desisted from their play, and</strong> <strong>stared at him with such fixed, statue-like gaze, and such strange, uncouth, lack-lustre</strong> <strong>countenances, that his heart turned within him, and his knees smote together.”</strong></p><p>The word choice in this sentence <strong>mainly</strong> conveys</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the players' anger at being interrupted during an important contest.</p>",
        "text": "the players' anger at being interrupted during an important contest."
      },
      {
        "id": "B",
        "html": "<p>the players' calm indifference to strangers passing through their game.</p>",
        "text": "the players' calm indifference to strangers passing through their game."
      },
      {
        "id": "C",
        "html": "<p>Rip's mounting physical fear in the presence of the silent, statue-like men.</p>",
        "text": "Rip's mounting physical fear in the presence of the silent, statue-like men."
      },
      {
        "id": "D",
        "html": "<p>the narrator's admiration for the players' unusual style of dress.</p>",
        "text": "the narrator's admiration for the players' unusual style of dress."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-rip-van-winkle-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-6",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "6"
    },
    "explanation": "Correct Answer: C\nExplanation: the stem asks the purpose of the detailed clothing description\nA. Incorrect: Rip never mistakes the men for anyone he recognizes; the passage instead emphasizes how unfamiliar they are to him.\nB. Incorrect: The passage never discusses the wealth of the nearby village or frames the men's clothing as a sign of poverty.\nC. Correct: Details like the men's \"quaint, outlandish fashion,\" \"peculiar\" faces, and the comparison to figures in \"an old Flemish painting\" underscore how strange and otherworldly the men appear.\nD. Incorrect: The passage mentions the painting was \"brought over from Holland at the time of the settlement\" only as a passing comparison, not to teach the region's settlement history.",
    "explanationHtml": "<p>Correct Answer: C</p><p>Explanation: the stem asks the purpose of the detailed clothing description</p><p>A. Incorrect: Rip never mistakes the men for anyone he recognizes; the passage instead emphasizes how unfamiliar they are to him.</p><p>B. Incorrect: The passage never discusses the wealth of the nearby village or frames the men's clothing as a sign of poverty.</p><p>C. Correct: Details like the men's &quot;quaint, outlandish fashion,&quot; &quot;peculiar&quot; faces, and the comparison to figures in &quot;an old Flemish painting&quot; underscore how strange and otherworldly the men appear.</p><p>D. Incorrect: The passage mentions the painting was &quot;brought over from Holland at the time of the settlement&quot; only as a passing comparison, not to teach the region's settlement history.</p>",
    "points": 1,
    "prompt": "The author most likely describes the ninepins players' clothing and appearance in such close detail in order to",
    "promptHtml": "<p>The author <strong>most likely</strong> describes the ninepins players' clothing and appearance in such close detail in order to</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>explain why Rip initially mistakes the men for people he already knows.</p>",
        "text": "explain why Rip initially mistakes the men for people he already knows."
      },
      {
        "id": "B",
        "html": "<p>contrast the men's poverty with the wealth of the nearby village.</p>",
        "text": "contrast the men's poverty with the wealth of the nearby village."
      },
      {
        "id": "C",
        "html": "<p>emphasize how out of place and otherworldly the men seem compared to Rip.</p>",
        "text": "emphasize how out of place and otherworldly the men seem compared to Rip."
      },
      {
        "id": "D",
        "html": "<p>provide the reader with a detailed history of Dutch settlement in the region.</p>",
        "text": "provide the reader with a detailed history of Dutch settlement in the region."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-rip-van-winkle-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-7",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "7"
    },
    "explanation": "Correct Answer: A\nExplanation: the stem asks what the painting comparison mainly helps the reader do\nA. Correct: Comparing the group to figures in an old painting emphasizes how frozen-in-time and unreal the men appear, rather than presenting them as ordinary living people.\nB. Incorrect: The comparison is drawn from a painting Rip has seen in the village parson's parlour; it says nothing about Rip visiting galleries.\nC. Incorrect: The sentence is a comparison (\"reminded Rip of\") between the men and painted figures, not a literal claim that the men are portraits.\nD. Incorrect: The sentence only notes that the painting was brought over \"at the time of the settlement\"; it gives no specific date.",
    "explanationHtml": "<p>Correct Answer: A</p><p>Explanation: the stem asks what the painting comparison <strong>mainly</strong> helps the reader do</p><p>A. Correct: Comparing the group to figures in an old painting emphasizes how frozen-in-time and unreal the men appear, rather than presenting them as ordinary living people.</p><p>B. Incorrect: The comparison is drawn from a painting Rip has seen in the village parson's parlour; it says nothing about Rip visiting galleries.</p><p>C. Incorrect: The sentence is a comparison (&quot;reminded Rip of&quot;) between the men and painted figures, not a literal claim that the men are portraits.</p><p>D. Incorrect: The sentence only notes that the painting was brought over &quot;at the time of the settlement&quot;; it gives no specific date.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3:\n“The whole group reminded Rip of the figures in an old Flemish painting, in the parlour of Dominie Van Shaick, the village parson, and which had been brought over from Holland at the time of the settlement.”\nThis comparison mainly helps the reader",
    "promptHtml": "<p>Read this sentence from paragraph 3:</p><p><strong>“The whole group reminded Rip of the figures in an old Flemish painting, in the parlour of</strong> <strong>Dominie Van Shaick, the village parson, and which had been brought over from Holland at</strong> <strong>the time of the settlement.”</strong></p><p>This comparison <strong>mainly</strong> helps the reader</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>picture the men as strange, old-fashioned figures rather than living, ordinary people.</p>",
        "text": "picture the men as strange, old-fashioned figures rather than living, ordinary people."
      },
      {
        "id": "B",
        "html": "<p>understand that Rip has visited many art galleries in his travels.</p>",
        "text": "understand that Rip has visited many art galleries in his travels."
      },
      {
        "id": "C",
        "html": "<p>recognize that the men are actually painted portraits that have come to life.</p>",
        "text": "recognize that the men are actually painted portraits that have come to life."
      },
      {
        "id": "D",
        "html": "<p>learn the exact date when the Dutch settled the region.</p>",
        "text": "learn the exact date when the Dutch settled the region."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromRipVanWinkleDigitalShsatPracticeTest5PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-rip-van-winkle-digital-shsat-practice-test-5",
  versionLabels: ["Digital SHSAT Practice Test 5"],
  label: "Excerpt from “Rip Van Winkle”",
  section: "reading",
  questionCount: excerptFromRipVanWinkleDigitalShsatPracticeTest5Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-rip-van-winkle-digital-shsat-practice-test-5",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    source: {"sourceFamily":"sat_crash_course","sourceFormat":"web","playerProfile":"sat_crash_course","sourceId":"satcc-digital-shsat-practice-test-5-v2","label":"Digital SHSAT Practice Test 5","url":"https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2","form":"5 v2","packageId":"9999f10bf24ea2b36575242f1aec673e76fb7a1bdb6d7dfa035ee9dfdc45b0ac"},
    title: "Excerpt from “Rip Van Winkle”",
    author: "Washington Irving",
    byline: "by Washington Irving",
    blurb: "In this excerpt from an 1819 short story, Rip Van Winkle, a good-natured but idle villager in colonial New York, has wandered into the Catskill Mountains on a squirrel-hunting trip.",
    passageType: "long_reading",
    passageCategory: "prestige",
    richText: "<p>As he was about to descend, he heard a voice from a distance, hallooing: “Rip Van Winkle! Rip Van Winkle!” He looked round, but could see nothing but a crow winging its solitary flight across the mountain. He thought his fancy must have deceived him, and turned again to descend, when he heard the same cry ring through the still evening air: “Rip Van Winkle! Rip Van Winkle!” At the same time Wolf bristled up his back, and giving a low growl, skulked to his master’s side, looking fearfully down into the glen. Rip now felt a vague apprehension stealing over him; he looked anxiously in the same direction, and perceived a strange figure slowly toiling up the rocks, and bending under the weight of something he carried on his back. He was surprised to see any human being in this lonely and unfrequented place; but supposing it to be some one of the neighbourhood in need of his assistance, he hastened down to yield it.</p><p>On nearer approach he was still more surprised at the singularity of the stranger’s appearance. He was a short, square-built old fellow, with thick bushy hair, and a grizzled beard. His dress was of the antique Dutch fashion: a cloth <span data-glossary-definition=\"a man's snug, hip-length jacket, worn as part of old-fashioned dress\" role=\"link\" tabindex=\"0\">doublet</span> strapped round the waist—several pair of breeches, the outer one of ample volume, decorated with rows of buttons down the sides, and bunches at the knees. He bore on his shoulder a stout keg, that seemed full of liquor, and made signs for Rip to approach and assist him with the load. Though rather shy and distrustful of his new acquaintance, Rip complied with his usual alacrity; and mutually relieving one another, they clambered up a narrow gully, apparently the dry bed of a mountain torrent. As they ascended, Rip every now and then heard long, rolling peals, like distant thunder, that seemed to issue out of a deep ravine, or rather cleft, between lofty rocks, toward which their ragged path conducted. He paused for an instant, but supposing it to be the muttering of one of those transient thunder-showers which often take place in mountain heights, he proceeded. Passing through the ravine, they came to a hollow, like a small amphitheatre, surrounded by perpendicular precipices, over the brinks of which impending trees shot their branches, so that you only caught glimpses of the azure sky and the bright evening cloud. During the whole time Rip and his companion had laboured on in silence; for though the former marvelled greatly what could be the object of carrying a keg of liquor up this wild mountain, yet there was something strange and incomprehensible about the unknown, that inspired awe and checked familiarity.</p><p>On entering the amphitheatre, new objects of wonder presented themselves. On a level spot in the centre was a company of odd-looking personages playing at <span data-glossary-definition=\"an old form of bowling played with nine wooden pins\" role=\"link\" tabindex=\"0\">ninepins</span>. They were dressed in a quaint, outlandish fashion; some wore short doublets, others jerkins, with long knives in their belts, and most of them had enormous breeches, of similar style with that of the guide’s. Their visages, too, were peculiar; one had a large beard, broad face, and small piggish eyes; the face of another seemed to consist entirely of nose, and was surmounted by a white sugar-loaf hat, set off with a little red cock’s tail. They all had beards, of various shapes and colours. There was one who seemed to be the commander. He was a stout old gentleman, with a weather-beaten countenance; he wore a laced doublet, broad belt and <span data-glossary-definition=\"a short sword worn at the belt\" role=\"link\" tabindex=\"0\">hanger</span>, high-crowned hat and feather, red stockings, and high-heeled shoes, with roses in them. The whole group reminded Rip of the figures in an old Flemish painting, in the parlour of Dominie Van Shaick, the village parson, and which had been brought over from Holland at the time of the settlement.</p><p>What seemed particularly odd to Rip was, that these folks were evidently amusing themselves, yet they maintained the gravest faces, the most mysterious silence, and were, withal, the most melancholy party of pleasure he had ever witnessed. Nothing interrupted the stillness of the scene but the noise of the balls, which, whenever they were rolled, echoed along the mountains like rumbling peals of thunder.</p><p>As Rip and his companion approached them, they suddenly desisted from their play, and stared at him with such fixed, statue-like gaze, and such strange, uncouth, lack-lustre countenances, that his heart turned within him, and his knees smote together. His companion now emptied the contents of the keg into large flagons, and made signs to him to wait upon the company. He obeyed with fear and trembling; they quaffed the liquor in profound silence, and then returned to their game.</p><p>By degrees Rip’s awe and apprehension subsided. He even ventured, when no eye was fixed upon him, to taste the beverage, which he found had much of the flavour of excellent Hollands. He was naturally a thirsty soul, and was soon tempted to repeat the draught. One taste provoked another; and he reiterated his visits to the flagon so often that at length his senses were overpowered, his eyes swam in his head, his head gradually declined, and he fell into a deep sleep.</p>",
    text: excerptFromRipVanWinkleDigitalShsatPracticeTest5PassageText,
    versionLabel: "Digital SHSAT Practice Test 5",
  }),
  questions: excerptFromRipVanWinkleDigitalShsatPracticeTest5Questions,
};
