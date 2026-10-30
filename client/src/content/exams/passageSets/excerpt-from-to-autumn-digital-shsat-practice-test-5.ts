import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromToAutumnDigitalShsatPracticeTest5PassageText = "Season of mists and mellow fruitfulness,\nClose bosom-friend of the maturing sun;\nConspiring with him how to load and bless\nWith fruit the vines that round the thatch-eves run;\nTo bend with apples the moss’d cottage-trees,\nAnd fill all fruit with ripeness to the core;\nTo swell the gourd, and plump the hazel shells\nWith a sweet kernel; to set budding more,\nAnd still more, later flowers for the bees,\nUntil they think warm days will never cease,\nFor summer has o’er-brimm’d their clammy cells.\n\nWho hath not seen thee oft amid thy store?\nSometimes whoever seeks abroad may find\nThee sitting careless on a granary floor,\nThy hair soft-lifted by the winnowing wind;\nOr on a half-reap’d furrow sound asleep,\nDrows’d with the fume of poppies, while thy hook\nSpares the next swath and all its twined flowers:\nAnd sometimes like a gleaner thou dost keep\nSteady thy laden head across a brook;\nOr by a cyder-press, with patient look,\nThou watchest the last oozings hours by hours.\n\nWhere are the songs of spring? Ay, where are they?\nThink not of them, thou hast thy music too,–\nWhile barred clouds bloom the soft-dying day,\nAnd touch the stubble-plains with rosy hue;\nThen in a wailful choir the small gnats mourn\nAmong the river sallows, borne aloft\nOr sinking as the light wind lives or dies;\nAnd full-grown lambs loud bleat from hilly bourn;\nHedge-crickets sing; and now with treble soft\nThe red-breast whistles from a garden-croft;\nAnd gathering swallows twitter in the skies.";

const excerptFromToAutumnDigitalShsatPracticeTest5Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-to-autumn-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-35",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "35"
    },
    "explanation": "Correct Answer: A\nExplanation: the stem asks for a theme of the poem\nA. Correct: The final stanza asks \"Where are the songs of spring?\" and answers that autumn \"hast thy music too,\" affirming autumn's own distinct beauty rather than mourning spring's absence.\nB. Incorrect: The poem instead emphasizes ripeness, abundance, and autumn's own music, without dwelling on loss or fear of winter.\nC. Incorrect: The poem addresses autumn itself directly (\"thou\") rather than farmers, and celebrates the season's natural abundance.\nD. Incorrect: The poem argues the opposite, that autumn possesses its own beauty and music distinct from spring's.",
    "explanationHtml": "<p>Correct Answer: A</p><p>Explanation: the stem asks for a theme of the poem</p><p>A. Correct: The final stanza asks &quot;Where are the songs of spring?&quot; and answers that autumn &quot;hast thy music too,&quot; affirming autumn's own distinct beauty rather than mourning spring's absence.</p><p>B. Incorrect: The poem instead emphasizes ripeness, abundance, and autumn's own music, without dwelling on loss or fear of winter.</p><p>C. Incorrect: The poem addresses autumn itself directly (&quot;thou&quot;) rather than farmers, and celebrates the season's natural abundance.</p><p>D. Incorrect: The poem argues the opposite, that autumn possesses its own beauty and music distinct from spring's.</p>",
    "points": 1,
    "prompt": "Which statement best expresses a theme of the poem?",
    "promptHtml": "<p>Which statement <strong>best</strong> expresses a theme of the poem?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Autumn holds its own quiet fullness and beauty, even without the songs associated with spring.</p>",
        "text": "Autumn holds its own quiet fullness and beauty, even without the songs associated with spring."
      },
      {
        "id": "B",
        "html": "<p>Autumn is a season defined mainly by loss and the fear of the coming winter.</p>",
        "text": "Autumn is a season defined mainly by loss and the fear of the coming winter."
      },
      {
        "id": "C",
        "html": "<p>Farmers and their harvests are more important to celebrate than nature itself.</p>",
        "text": "Farmers and their harvests are more important to celebrate than nature itself."
      },
      {
        "id": "D",
        "html": "<p>The changing seasons prove that beauty is possible only in springtime.</p>",
        "text": "The changing seasons prove that beauty is possible only in springtime."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-to-autumn-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-36",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "36"
    },
    "explanation": "The word \"Conspiring\" personifies autumn as a willing partner scheming together with the sun to ripen the harvest, an active role that \"bless,\" \"run,\" and \"fill\" do not carry on their own; those words describe the results of the ripening, not autumn's active partnership with the sun.",
    "explanationHtml": "<p>The word &quot;Conspiring&quot; personifies autumn as a willing partner scheming together with the sun to ripen the harvest, an active role that &quot;bless,&quot; &quot;run,&quot; and &quot;fill&quot; do not carry on their own; those words describe the results of the ripening, not autumn's active partnership with the sun.</p>",
    "points": 1,
    "prompt": "Click on the word in these lines that most directly presents autumn as an active partner working alongside the sun, rather than a season the sun simply affects.",
    "promptHtml": "<p>Click on the word in these lines that <strong>most directly</strong> presents autumn as an active partner working alongside the sun, rather than a season the sun simply affects.</p>",
    "selectionHtml": "<p>Season of mists and mellow fruitfulness, / Close bosom-friend of the maturing sun; / <span data-choice-id=\"A\">Conspiring</span> with him how to load and <span data-choice-id=\"B\">bless</span> / With fruit the vines that round the thatch-eves <span data-choice-id=\"C\">run</span>; / To bend with apples the moss'd cottage-trees, / And <span data-choice-id=\"D\">fill</span> all fruit with ripeness to the core;</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "Conspiring",
        "text": "Conspiring"
      },
      {
        "id": "B",
        "html": "bless",
        "text": "bless"
      },
      {
        "id": "C",
        "html": "run",
        "text": "run"
      },
      {
        "id": "D",
        "html": "fill",
        "text": "fill"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-to-autumn-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-37",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "37"
    },
    "explanation": "Correct Answer: D\nExplanation: the stem asks for the best overall summary of the poem\nA. Incorrect: The poem does not compare autumn's value to other seasons or discuss farmers' economic interests; it addresses autumn itself directly.\nB. Incorrect: The poem personifies autumn itself performing the harvest tasks (sitting, gleaning, watching the cyder-press), rather than following a human farmer's day.\nC. Incorrect: Winter is never mentioned in the poem; the final stanza contrasts autumn's sounds with the \"songs of spring,\" not winter's silence.\nD. Correct: Each stanza develops a different aspect of autumn in turn: ripening fruit in the first, harvest labor in the second, and the season's own sounds in the third.",
    "explanationHtml": "<p>Correct Answer: D</p><p>Explanation: the stem asks for the <strong>best</strong> overall summary of the poem</p><p>A. Incorrect: The poem does not compare autumn's value to other seasons or discuss farmers' economic interests; it addresses autumn itself directly.</p><p>B. Incorrect: The poem personifies autumn itself performing the harvest tasks (sitting, gleaning, watching the cyder-press), rather than following a human farmer's day.</p><p>C. Incorrect: Winter is never mentioned in the poem; the final stanza contrasts autumn's sounds with the &quot;songs of spring,&quot; not winter's silence.</p><p>D. Correct: Each stanza develops a different aspect of autumn in turn: ripening fruit in the first, harvest labor in the second, and the season's own sounds in the third.</p>",
    "points": 1,
    "prompt": "What is the best summary of the poem?",
    "promptHtml": "<p>What is the <strong>best</strong> summary of the poem?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The poem argues that autumn's harvest is more valuable to farmers than any other season's produce.</p>",
        "text": "The poem argues that autumn's harvest is more valuable to farmers than any other season's produce."
      },
      {
        "id": "B",
        "html": "<p>The poem describes a farmer's daily labor from sunrise to sunset during the harvest season.</p>",
        "text": "The poem describes a farmer's daily labor from sunrise to sunset during the harvest season."
      },
      {
        "id": "C",
        "html": "<p>The poem contrasts the sounds of autumn with the silence of winter that follows it.</p>",
        "text": "The poem contrasts the sounds of autumn with the silence of winter that follows it."
      },
      {
        "id": "D",
        "html": "<p>The poem moves through a single autumn day, admiring its ripened fruit, harvest labor, and sounds.</p>",
        "text": "The poem moves through a single autumn day, admiring its ripened fruit, harvest labor, and sounds."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-to-autumn-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-38",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "38"
    },
    "explanation": "Correct Answer: C\nExplanation: the stem asks what the bosom-friend personification suggests\nA. Incorrect: The lines describe a warm friendship and shared purpose, not fear on the sun's part.\nB. Incorrect: The lines credit the sun, autumn's companion, with contributing warmth; they do not claim the vines produce their own warmth.\nC. Correct: Calling autumn the sun's \"bosom-friend\" who is \"conspiring with him\" personifies the two as close companions working together to ripen the fruit.\nD. Incorrect: \"Bosom-friend\" and \"conspiring with him\" describe cooperation, not competition, between autumn and the sun.",
    "explanationHtml": "<p>Correct Answer: C</p><p>Explanation: the stem asks what the bosom-friend personification suggests</p><p>A. Incorrect: The lines describe a warm friendship and shared purpose, not fear on the sun's part.</p><p>B. Incorrect: The lines credit the sun, autumn's companion, with contributing warmth; they do not claim the vines produce their own warmth.</p><p>C. Correct: Calling autumn the sun's &quot;bosom-friend&quot; who is &quot;conspiring with him&quot; personifies the two as close companions working together to ripen the fruit.</p><p>D. Incorrect: &quot;Bosom-friend&quot; and &quot;conspiring with him&quot; describe cooperation, not competition, between autumn and the sun.</p>",
    "points": 1,
    "prompt": "Read these lines from the poem:\n“Close bosom-friend of the maturing sun; / Conspiring with him how to load and bless / With fruit the vines that round the thatch-eves run;”\nThe personification in these lines suggests that",
    "promptHtml": "<p>Read these lines from the poem:</p><p><strong>“Close bosom-friend of the maturing sun; / Conspiring with him how to load and bless / With</strong> <strong>fruit the vines that round the thatch-eves run;”</strong></p><p>The personification in these lines suggests that</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the sun is frightened of autumn's approach each year.</p>",
        "text": "the sun is frightened of autumn's approach each year."
      },
      {
        "id": "B",
        "html": "<p>autumn's warmth comes entirely from the vines themselves.</p>",
        "text": "autumn's warmth comes entirely from the vines themselves."
      },
      {
        "id": "C",
        "html": "<p>autumn and the sun work together, almost like companions, to ripen the harvest.</p>",
        "text": "autumn and the sun work together, almost like companions, to ripen the harvest."
      },
      {
        "id": "D",
        "html": "<p>autumn competes with the sun for control over the season's weather.</p>",
        "text": "autumn competes with the sun for control over the season's weather."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-to-autumn-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-39",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "39"
    },
    "explanation": "Correct Answer: A\nExplanation: the stem asks how the final stanza develops the poem\nA. Correct: The stanza opens by asking about the \"songs of spring\" and then answers its own question by cataloguing autumn's distinct sounds, gnats, lambs, crickets, a robin, and swallows, moving the poem's focus from the visual imagery of the earlier stanzas to sound.\nB. Incorrect: The final stanza introduces new imagery centered on sound; it does not repeat the granary and cyder-press scenes from the second stanza.\nC. Incorrect: The sun's role in ripening the fruit is introduced in the first stanza, not the final one.\nD. Incorrect: The final stanza continues to celebrate autumn's richness through its sounds, rather than contradicting the fullness described earlier.",
    "explanationHtml": "<p>Correct Answer: A</p><p>Explanation: the stem asks how the final stanza develops the poem</p><p>A. Correct: The stanza opens by asking about the &quot;songs of spring&quot; and then answers its own question by cataloguing autumn's distinct sounds, gnats, lambs, crickets, a robin, and swallows, moving the poem's focus from the visual imagery of the earlier stanzas to sound.</p><p>B. Incorrect: The final stanza introduces new imagery centered on sound; it does not repeat the granary and cyder-press scenes from the second stanza.</p><p>C. Incorrect: The sun's role in ripening the fruit is introduced in the first stanza, not the final one.</p><p>D. Incorrect: The final stanza continues to celebrate autumn's richness through its sounds, rather than contradicting the fullness described earlier.</p>",
    "points": 1,
    "prompt": "How does the final stanza (lines 23-33) contribute to the development of the poem as a whole?",
    "promptHtml": "<p>How does the final stanza (lines 23-33) contribute to the development of the poem as a whole?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It answers the poem's own question about spring by showing autumn has its own distinct music.</p>",
        "text": "It answers the poem's own question about spring by showing autumn has its own distinct music."
      },
      {
        "id": "B",
        "html": "<p>It repeats the description of the harvest labor already detailed in the second stanza.</p>",
        "text": "It repeats the description of the harvest labor already detailed in the second stanza."
      },
      {
        "id": "C",
        "html": "<p>It introduces the poem's only direct mention of the sun's role in ripening the fruit.</p>",
        "text": "It introduces the poem's only direct mention of the sun's role in ripening the fruit."
      },
      {
        "id": "D",
        "html": "<p>It contradicts the earlier claim that autumn is a season of real fullness and abundance.</p>",
        "text": "It contradicts the earlier claim that autumn is a season of real fullness and abundance."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-to-autumn-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-40",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "40"
    },
    "explanation": "Correct Answer: C\nExplanation: the stem asks what the word bloom mainly conveys\nA. Incorrect: \"Bloom\" is used figuratively here to describe the clouds' color at sunset, not literal flowers blooming.\nB. Incorrect: The gentle imagery of clouds \"blooming\" the \"soft-dying day\" conveys calm appreciation, not fear or urgency.\nC. Correct: \"Bloom\" here describes the clouds coloring the sky with a soft, warm glow as day ends, echoing the poem's gentle, admiring tone.\nD. Incorrect: The line's tone, paired with \"soft-dying,\" conveys a gentle close to the day, not the arrival of a harsh storm.",
    "explanationHtml": "<p>Correct Answer: C</p><p>Explanation: the stem asks what the word bloom <strong>mainly</strong> conveys</p><p>A. Incorrect: &quot;Bloom&quot; is used figuratively here to describe the clouds' color at sunset, not literal flowers blooming.</p><p>B. Incorrect: The gentle imagery of clouds &quot;blooming&quot; the &quot;soft-dying day&quot; conveys calm appreciation, not fear or urgency.</p><p>C. Correct: &quot;Bloom&quot; here describes the clouds coloring the sky with a soft, warm glow as day ends, echoing the poem's gentle, admiring tone.</p><p>D. Incorrect: The line's tone, paired with &quot;soft-dying,&quot; conveys a gentle close to the day, not the arrival of a harsh storm.</p>",
    "points": 1,
    "prompt": "Read this line from the poem:\n“While barred clouds bloom the soft-dying day,”\nThe word “bloom” in this line mainly conveys",
    "promptHtml": "<p>Read this line from the poem:</p><p><strong>“While barred clouds bloom the soft-dying day,”</strong></p><p>The word “bloom” in this line <strong>mainly</strong> conveys</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the literal blooming of garden flowers late into the autumn season.</p>",
        "text": "the literal blooming of garden flowers late into the autumn season."
      },
      {
        "id": "B",
        "html": "<p>the speaker's growing fear that the day is ending too quickly.</p>",
        "text": "the speaker's growing fear that the day is ending too quickly."
      },
      {
        "id": "C",
        "html": "<p>a soft, warm beauty in the sky as an autumn day comes to a close.</p>",
        "text": "a soft, warm beauty in the sky as an autumn day comes to a close."
      },
      {
        "id": "D",
        "html": "<p>a harsh, sudden storm approaching from the barred clouds overhead.</p>",
        "text": "a harsh, sudden storm approaching from the barred clouds overhead."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromToAutumnDigitalShsatPracticeTest5PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-to-autumn-digital-shsat-practice-test-5",
  versionLabels: ["Digital SHSAT Practice Test 5"],
  label: "Excerpt from “To Autumn”",
  section: "reading",
  questionCount: excerptFromToAutumnDigitalShsatPracticeTest5Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-to-autumn-digital-shsat-practice-test-5",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    source: {"sourceFamily":"sat_crash_course","sourceFormat":"web","playerProfile":"sat_crash_course","sourceId":"satcc-digital-shsat-practice-test-5-v2","label":"Digital SHSAT Practice Test 5","url":"https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2","form":"5 v2","packageId":"6a3884a5568a09948642eed31734d8e962735d32ee945cd0218b524d1f10d357"},
    title: "Excerpt from “To Autumn”",
    author: "John Keats",
    byline: "by John Keats",
    blurb: "Keats wrote this ode after a walk near Winchester, England, in September 1819, inspired by the ripening fields and harvest he saw along the way.",
    passageType: "poem",
    passageCategory: "prestige",
    richText: "<div>Season of mists and mellow fruitfulness,<br>Close bosom-friend of the maturing sun;<br>Conspiring with him how to load and bless<br>With fruit the vines that round the thatch-eves run;<br>To bend with apples the moss’d cottage-trees,<br>And fill all fruit with ripeness to the core;<br>To swell the gourd, and plump the hazel shells<br>With a sweet kernel; to set budding more,<br>And still more, later flowers for the bees,<br>Until they think warm days will never cease,<br>For summer has o’er-brimm’d their clammy cells.</div><div>Who hath not seen thee oft amid thy store?<br>Sometimes whoever seeks abroad may find<br>Thee sitting careless on a granary floor,<br>Thy hair soft-lifted by the winnowing wind;<br>Or on a half-reap’d furrow sound asleep,<br>Drows’d with the fume of poppies, while thy hook<br>Spares the next swath and all its twined flowers:<br>And sometimes like a gleaner thou dost keep<br>Steady thy laden head across a brook;<br>Or by a cyder-press, with patient look,<br>Thou watchest the last oozings hours by hours.</div><div>Where are the songs of spring? Ay, where are they?<br>Think not of them, thou hast thy music too,–<br>While barred clouds bloom the soft-dying day,<br>And touch the stubble-plains with rosy hue;<br>Then in a wailful choir the small gnats mourn<br>Among the river sallows, borne aloft<br>Or sinking as the light wind lives or dies;<br>And full-grown lambs loud bleat from hilly bourn;<br>Hedge-crickets sing; and now with treble soft<br>The red-breast whistles from a garden-croft;<br>And gathering swallows twitter in the skies.</div>",
    text: excerptFromToAutumnDigitalShsatPracticeTest5PassageText,
    versionLabel: "Digital SHSAT Practice Test 5",
  }),
  questions: excerptFromToAutumnDigitalShsatPracticeTest5Questions,
};
