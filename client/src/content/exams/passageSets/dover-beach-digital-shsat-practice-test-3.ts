import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const doverBeachDigitalShsatPracticeTest3PassageText = "The sea is calm tonight.\nThe tide is full, the moon lies fair\nUpon the straits; on the French coast the light\nGleams and is gone; the cliffs of England stand,\nGlimmering and vast, out in the tranquil bay.\nCome to the window, sweet is the night-air!\nOnly, from the long line of spray\nWhere the sea meets the moon-blanched land,\nListen! you hear the grating roar\nOf pebbles which the waves draw back, and fling,\nAt their return, up the high strand,\nBegin, and cease, and then again begin,\nWith tremulous cadence slow, and bring\nThe eternal note of sadness in.\nSophocles long ago\n\nHeard it on the Ægean, and it brought\nInto his mind the turbid ebb and flow\nOf human misery; we\nFind also in the sound a thought,\nHearing it by this distant northern sea.\nThe Sea of Faith\n\nWas once, too, at the full, and round earth’s shore\nLay like the folds of a bright girdle furled.\nBut now I only hear\nIts melancholy, long, withdrawing roar,\nRetreating, to the breath\nOf the night-wind, down the vast edges drear\nAnd naked shingles of the world.\nAh, love, let us be true\n\nTo one another! for the world, which seems\nTo lie before us like a land of dreams,\nSo various, so beautiful, so new,\nHath really neither joy, nor love, nor light,\nNor certitude, nor peace, nor help for pain;\nAnd we are here as on a darkling plain\nSwept with confused alarms of struggle and flight,\nWhere ignorant armies clash by night.";

const doverBeachDigitalShsatPracticeTest3Questions: ExamQuestion[] = [
  {
    "id": "dover-beach-digital-shsat-practice-test-3-passage-1",
    "explanation": "The poem moves from a calm seaside scene, to the retreat of the \"Sea of Faith,\" to a world that seems beautiful but actually lacks \"joy,\" \"love,\" or \"certitude,\" ending with the speaker asking his companion to \"be true\" to one another amid that uncertainty, which supports a theme about declining faith and certainty leaving human love as a remaining comfort, not a claim about the sea's destructiveness or ancient wisdom.",
    "explanationHtml": "<p>The poem moves from a calm seaside scene, to the retreat of the &quot;Sea of Faith,&quot; to a world that seems beautiful but actually lacks &quot;joy,&quot; &quot;love,&quot; or &quot;certitude,&quot; ending with the speaker asking his companion to &quot;be true&quot; to one another amid that uncertainty, which supports a theme about declining faith and certainty leaving human love as a remaining comfort, not a claim about the sea's destructiveness or ancient wisdom.</p>",
    "points": 1,
    "prompt": "Which statement best expresses a theme developed over the course of the poem?",
    "promptHtml": "Which statement best expresses a theme developed over the course of the poem?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Faith and certainty have grown rare, leaving human love as one steady comfort.",
        "text": "Faith and certainty have grown rare, leaving human love as one steady comfort."
      },
      {
        "id": "B",
        "html": "Ancient civilizations understood the true sound of the sea far better than any modern observer possibly could.",
        "text": "Ancient civilizations understood the true sound of the sea far better than any modern observer possibly could."
      },
      {
        "id": "C",
        "html": "Calm scenery in a poem typically reflects the exact emotional state of whoever happens to be observing it.",
        "text": "Calm scenery in a poem typically reflects the exact emotional state of whoever happens to be observing it."
      },
      {
        "id": "D",
        "html": "The sea is simply a destructive force that poets should generally avoid trying to describe.",
        "text": "The sea is simply a destructive force that poets should generally avoid trying to describe."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "dover-beach-digital-shsat-practice-test-3-passage-2",
    "explanation": "Describing faith as once lying \"like the folds of a bright girdle furled\" around the earth, and now producing only a \"melancholy, long, withdrawing roar,\" extends the sea image into a metaphor for religious certainty that has ebbed away, not a literal location, a claim that faith is stronger now, or a comment about sailors.",
    "explanationHtml": "<p>Describing faith as once lying &quot;like the folds of a bright girdle furled&quot; around the earth, and now producing only a &quot;melancholy, long, withdrawing roar,&quot; extends the sea image into a metaphor for religious certainty that has ebbed away, not a literal location, a claim that faith is stronger now, or a comment about sailors.</p>",
    "points": 1,
    "prompt": "The extended metaphor of the \"Sea of Faith\" in lines 21–23 is used mainly to",
    "promptHtml": "The extended metaphor of the &quot;Sea of Faith&quot; in lines 21–23 is used mainly to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "describe an actual, specific body of water that the speaker once visited earlier in his life.",
        "text": "describe an actual, specific body of water that the speaker once visited earlier in his life."
      },
      {
        "id": "B",
        "html": "argue that religious faith is, in fact, stronger today than it has ever been before now.",
        "text": "argue that religious faith is, in fact, stronger today than it has ever been before now."
      },
      {
        "id": "C",
        "html": "compare a decline in religious certainty to a tide that was full but is now withdrawing.",
        "text": "compare a decline in religious certainty to a tide that was full but is now withdrawing."
      },
      {
        "id": "D",
        "html": "criticize sailors of an earlier era for disrespecting the genuine dangers of the open ocean.",
        "text": "criticize sailors of an earlier era for disrespecting the genuine dangers of the open ocean."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "dover-beach-digital-shsat-practice-test-3-passage-3",
    "explanation": "In context, \"naked shingles\" continues the poem's beach imagery, and pairing \"shingles\" (loose shoreline stones) with \"naked\" emphasizes just how bare and exposed the tide-stripped coast appears, a sense distinct from roofing material, signage, or an illness.",
    "explanationHtml": "<p>In context, &quot;naked shingles&quot; continues the poem's beach imagery, and pairing &quot;shingles&quot; (loose shoreline stones) with &quot;naked&quot; emphasizes just how bare and exposed the tide-stripped coast appears, a sense distinct from roofing material, signage, or an illness.</p>",
    "points": 1,
    "prompt": "The poet's use of the word \"shingles\" in line 28 (\"naked shingles of the world\") is most likely intended to",
    "promptHtml": "The poet's use of the word &quot;shingles&quot; in line 28 (&quot;naked shingles of the world&quot;) is most likely intended to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "emphasize the bare, exposed shoreline the retreating tide leaves behind.",
        "text": "emphasize the bare, exposed shoreline the retreating tide leaves behind."
      },
      {
        "id": "B",
        "html": "suggest that the speaker is now standing on the roof of a house near the shore.",
        "text": "suggest that the speaker is now standing on the roof of a house near the shore."
      },
      {
        "id": "C",
        "html": "imply that someone has posted warning signs along the rocky coastline nearby.",
        "text": "imply that someone has posted warning signs along the rocky coastline nearby."
      },
      {
        "id": "D",
        "html": "describe an illness that has left the speaker's skin raw and painful.",
        "text": "describe an illness that has left the speaker's skin raw and painful."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "dover-beach-digital-shsat-practice-test-3-passage-4",
    "explanation": "\"Where the sea meets the moon-blanched land\" and \"Begin, and cease, and then again begin\" both use concrete, sensory description of the tide's motion against the shore, while the remaining lines either state a plain fact, reference a historical figure, or address the speaker's companion rather than depicting the sea's movement.",
    "explanationHtml": "<p>&quot;Where the sea meets the moon-blanched land&quot; and &quot;Begin, and cease, and then again begin&quot; both use concrete, sensory description of the tide's motion against the shore, while the remaining lines either state a plain fact, reference a historical figure, or address the speaker's companion rather than depicting the sea's movement.</p>",
    "points": 1,
    "prompt": "Select the two lines that together best illustrate the poem's use of imagery to describe the movement of the sea.",
    "promptHtml": "Select the two lines that together best illustrate the poem's use of imagery to describe the movement of the sea.",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "&quot;The sea is calm tonight.&quot;",
        "text": "\"The sea is calm tonight.\""
      },
      {
        "id": "B",
        "html": "&quot;Where the sea meets the moon-blanched land,&quot;",
        "text": "\"Where the sea meets the moon-blanched land,\""
      },
      {
        "id": "C",
        "html": "&quot;Begin, and cease, and then again begin,&quot;",
        "text": "\"Begin, and cease, and then again begin,\""
      },
      {
        "id": "D",
        "html": "&quot;Sophocles long ago&quot;",
        "text": "\"Sophocles long ago\""
      },
      {
        "id": "E",
        "html": "&quot;Ah, love, let us be true / To one another!&quot;",
        "text": "\"Ah, love, let us be true / To one another!\""
      }
    ],
    "correctChoiceIds": [
      "B",
      "C"
    ],
    "requiredSelections": 2,
    "type": "multi_select"
  },
  {
    "id": "dover-beach-digital-shsat-practice-test-3-passage-5",
    "explanation": "The poem opens with a placid description of a calm sea and a fair moon, but by its final lines the speaker describes the world as a \"darkling plain\" swept by \"confused alarms,\" a shift from calm observation to anxious uncertainty rather than protest fading to indifference, sustained cheer, or a move toward resolved clarity.",
    "explanationHtml": "<p>The poem opens with a placid description of a calm sea and a fair moon, but by its final lines the speaker describes the world as a &quot;darkling plain&quot; swept by &quot;confused alarms,&quot; a shift from calm observation to anxious uncertainty rather than protest fading to indifference, sustained cheer, or a move toward resolved clarity.</p>",
    "points": 1,
    "prompt": "How does the tone of the poem shift between its opening lines and its closing lines?",
    "promptHtml": "How does the tone of the poem shift between its opening lines and its closing lines?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It shifts from angry, open protest to a mood of complete indifference.",
        "text": "It shifts from angry, open protest to a mood of complete indifference."
      },
      {
        "id": "B",
        "html": "It remains cheerful and celebratory throughout the entire course of the poem.",
        "text": "It remains cheerful and celebratory throughout the entire course of the poem."
      },
      {
        "id": "C",
        "html": "It shifts from early confusion to a mood of total clarity and resolved certainty.",
        "text": "It shifts from early confusion to a mood of total clarity and resolved certainty."
      },
      {
        "id": "D",
        "html": "It shifts from calm, quiet description to anxious, uncertain reflection.",
        "text": "It shifts from calm, quiet description to anxious, uncertain reflection."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "dover-beach-digital-shsat-practice-test-3-passage-6",
    "explanation": "Asking his companion to \"be true / To one another\" immediately after describing a world with \"neither joy, nor love, nor light\" and \"confused alarms\" suggests the speaker is seeking steadiness in their bond precisely because he no longer trusts the wider world's promise of beauty and certainty, rather than trying to distract her, dismissing the view, or affirming that the world truly is beautiful.",
    "explanationHtml": "<p>Asking his companion to &quot;be true / To one another&quot; immediately after describing a world with &quot;neither joy, nor love, nor light&quot; and &quot;confused alarms&quot; suggests the speaker is seeking steadiness in their bond precisely because he no longer trusts the wider world's promise of beauty and certainty, rather than trying to distract her, dismissing the view, or affirming that the world truly is beautiful.</p>",
    "points": 1,
    "prompt": "What does the final stanza reveal about why the speaker turns to his companion?",
    "promptHtml": "What does the final stanza reveal about why the speaker turns to his companion?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It shows that he believes their love can offer stability in a world he now sees as uncertain.",
        "text": "It shows that he believes their love can offer stability in a world he now sees as uncertain."
      },
      {
        "id": "B",
        "html": "It indicates that he is now certain the world truly is as beautiful as it first appears to be.",
        "text": "It indicates that he is now certain the world truly is as beautiful as it first appears to be."
      },
      {
        "id": "C",
        "html": "It implies that he wants to distract her from noticing the sound of the slowly retreating tide.",
        "text": "It implies that he wants to distract her from noticing the sound of the slowly retreating tide."
      },
      {
        "id": "D",
        "html": "It suggests that he has decided the view from the window is simply no longer worth watching.",
        "text": "It suggests that he has decided the view from the window is simply no longer worth watching."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const doverBeachDigitalShsatPracticeTest3PassageSet: ExamPassageSet = {
  id: "ela-dover-beach-digital-shsat-practice-test-3",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: doverBeachDigitalShsatPracticeTest3Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "dover-beach-digital-shsat-practice-test-3",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    title: "Dover Beach",
    author: "Matthew Arnold",
    blurb: "“Dover Beach” is a lyric poem first published in 1867, spoken by someone standing at a window overlooking the English Channel.",
    passageType: "poem",
    passageCategory: "prestige",
    richText: "<p>The sea is calm tonight.</p><p>The tide is full, the moon lies fair</p><p>Upon the straits; on the French coast the light</p><p>Gleams and is gone; the cliffs of England stand,</p><p>Glimmering and vast, out in the tranquil bay.</p><p>Come to the window, sweet is the night-air!</p><p>Only, from the long line of spray</p><p>Where the sea meets the moon-blanched land,</p><p>Listen! you hear the grating roar</p><p>Of pebbles which the waves draw back, and fling,</p><p>At their return, up the high strand,</p><p>Begin, and cease, and then again begin,</p><p>With tremulous cadence slow, and bring</p><p>The eternal note of sadness in.</p><p>Sophocles long ago</p><p><br></p><p>Heard it on the Ægean, and it brought</p><p>Into his mind the turbid ebb and flow</p><p>Of human misery; we</p><p>Find also in the sound a thought,</p><p>Hearing it by this distant northern sea.</p><p>The Sea of Faith</p><p><br></p><p>Was once, too, at the full, and round earth’s shore</p><p>Lay like the folds of a bright girdle furled.</p><p>But now I only hear</p><p>Its melancholy, long, withdrawing roar,</p><p>Retreating, to the breath</p><p>Of the night-wind, down the vast edges drear</p><p>And naked shingles of the world.</p><p>Ah, love, let us be true</p><p><br></p><p>To one another! for the world, which seems</p><p>To lie before us like a land of dreams,</p><p>So various, so beautiful, so new,</p><p>Hath really neither joy, nor love, nor light,</p><p>Nor certitude, nor peace, nor help for pain;</p><p>And we are here as on a darkling plain</p><p>Swept with confused alarms of struggle and flight,</p><p>Where ignorant armies clash by night.</p>",
    text: doverBeachDigitalShsatPracticeTest3PassageText,
    versionLabel: "Digital SHSAT Practice Test 3",
  }),
  questions: doverBeachDigitalShsatPracticeTest3Questions,
};
