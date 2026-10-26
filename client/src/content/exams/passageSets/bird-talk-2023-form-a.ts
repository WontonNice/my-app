import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const birdTalk2023FormAPassageText = "And now when the branches were beginning to be heavy,\nIt was the time when they once had said, “This is the\n    beginning of summer.”\nThe shrilling of the frogs was not so shrill as in the\n    first weeks after the broken winter;\nThe birds took their hops and zigzags a little more\n    anxious; a home is a home; worms are worms.\nThe yellow spreads of the dandelions and buttercups\n    reached across the green pastures.\nTee whee and tee whee came on the breezes, and the grackles\n    chuzzled their syllables.\nAnd it was the leaves with a strong soft wind over them\n    that talked most of all and said more than any others\n    though speaking the fewest words.\nIt was the green leaves trickling out the gaunt nowhere\n    of winter, out on the gray hungry branches—\nIt was the leaves on the branches, beginning to be heavy,\n    who said as they said one time before, “This is the be-\n    ginning of summer.”\n\nWe shall never blame the birds who come\n    where the river and the road make the Grand Crossing\n    and talk there, sitting in circles talking bird talk.\nIf they ask in their circles as to who is here\n    and as to who is not here and who used to be here,\nOr if instead of counting up last year as against\n    this year, they count up this year as against next\n    year, and have their bird chatter about who is here\n    this year who won’t be here next year,\nWe shall never blame the birds.\n\nIf I have put your face among leaf faces, child,\nOr if I have put your voice among bird voices,\nBlame me no more than the bluejays.";

const birdTalk2023FormAQuestions: ExamQuestion[] = [
  {
    "id": "bird-talk-2023-form-a-2023-form-a-q44",
    "explanation": "The question asks how lines 6-7 from the poem develop an idea from the second stanza.\n\nA. Incorrect. In lines 2-3, the tree branches exclaim that “ ‘This is the / beginning of summer,’ ” and the birds respond by taking “their hops and zigzags a little more / anxious” (lines 6-7); however, the birds’ eager reaction to the return of warmer weather is not referenced in the second stanza of the poem, which is more about the nature of birds generally than the changing of the seasons.\n\nB. Incorrect. Birds are more likely to thrive in warmer weather as evidenced by some birds’ migration to a warmer climate during winter, and the creatures in the first stanza are responding to the “ ‘beginning of summer’ ” (line 3) in their own way, such as the birds who are taking “their hops and zigzags a little more / anxious” (lines 6-7). However, the thriving of birds during a particular season is not the focus of the second stanza; rather, it is focused on the general nature of birds.\n\nC. CORRECT. The birds are taking “their hops and zigzags a little more / anxious” (lines 6-7) in light of warmer weather, but they are not making a big to-do of the change because “a home is a home; worms are worms” (line 7) any time of the year. Such a natural adjustment to seasonal changes is reflected in the second stanza, where the birds “count up this year as against next / year” (lines 26-27) because they are well accustomed to the cyclical nature of things.\n\nD. Incorrect. Although the birds’ actions of “hops and zigzags” (line 6) may indicate some sort of preparation, these actions are not preparation but rather the internalized cognizance of the change that has occurred with little conscious thought. As revealed in the second stanza, birds do not ponder much about past or future but rather adapt naturally as things change.",
    "points": 1,
    "prompt": "Read lines 6–7 from the poem.\n\nThe birds took their hops and zigzags a little more\n    anxious; a home is a home; worms are worms.\n\nWhat idea from the second stanza do the lines help develop?",
    "promptHtml": "<p>Read lines 6–7 from the poem.</p><blockquote><strong><strong>The birds took their hops and zigzags a little more<br>&nbsp;&nbsp;&nbsp;&nbsp;anxious; a home is a home; worms are worms.</strong></strong></blockquote><p>What idea from the second stanza do the lines help develop?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "The birds are eager for the return of warmer months."
      },
      {
        "id": "B",
        "text": "The birds are most likely to thrive during the spring."
      },
      {
        "id": "C",
        "text": "The birds naturally adjust to the seasonal changes."
      },
      {
        "id": "D",
        "text": "The birds instinctively prepare for the future."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "bird-talk-2023-form-a-2023-form-a-q45",
    "explanation": "This question asks for what a phrase reveals about the speaker’s perspective on the change in seasons.\n\nA. CORRECT. The first stanza of the poem establishes the way different parts of the natural world, including both plants and animals, respond to the change in season. These lines reflect the way the wind in the leaves is the best indication of the seasonal change because it is the wind in the leaves that “talked most of all and said more than any others / though speaking the fewest words” (lines 13-14).\n\nB. Incorrect. Although the sound of the wind is the most obvious sign of the seasonal change per the speaker, it is in response to the “ ‘beginning of summer’ ” (line 3) that the wind speaks through the leaves. The poem does not reveal that this figurative speech occurs throughout the seasons, only that it occurs during the transition to summer.\n\nC. Incorrect. While the language used by the speaker indicates a deep appreciation for the natural phenomenon being witnessed, the language used does not indicate a feeling of being overwhelmed but rather a feeling of awareness.\n\nD. Incorrect. Using the personification of the wind “speaking” (line 14) indicates an appreciation by the speaker for the power and volume of the wind’s voice, but only one instance of the wind’s speech, that which occurs at the ” ‘beginning of summer’ ” (line 3), is chronicled by the speaker in the poem.",
    "points": 1,
    "prompt": "Read lines 12–14 from the poem.\n\nAnd it was the leaves with a strong soft wind over them\n    that talked most of all and said more than any others\n    though speaking the fewest words.\n\nWhat does the phrase “talked most of all” in line 13 convey?",
    "promptHtml": "<p>Read lines 12–14 from the poem.</p><blockquote><strong><strong>And it was the leaves with a strong soft wind over them<br>&nbsp;&nbsp;&nbsp;&nbsp;that talked most of all and said more than any others<br>&nbsp;&nbsp;&nbsp;&nbsp;though speaking the fewest words.</strong></strong></blockquote><p>What does the phrase “talked most of all” in line 13 convey?</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "It establishes that the speaker thinks the sound of wind in the leaves is the best indication that the season is changing."
      },
      {
        "id": "B",
        "text": "It introduces the idea that the sound of the wind in the leaves remains constant throughout the seasons."
      },
      {
        "id": "C",
        "text": "It suggests that the speaker is overwhelmed by the sounds of nature that emerge as the season changes."
      },
      {
        "id": "D",
        "text": "It emphasizes that the sounds of nature enable the speaker to appreciate each season of the year."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "bird-talk-2023-form-a-2023-form-a-q46",
    "explanation": "The question asks how the repetition of a phrase contributes to the meaning of the poem in terms of conveying information about a cyclical event.\n\nA. CORRECT. This phrase is used twice verbatim, in both cases to show the figurative words spoken by the branches (lines 2-3) and the leaves on the branches (lines 18-19). Repetition of this phrase conveys the idea that the transition to summer occurs in the same manner each subsequent year and thus evokes the same response from nature.\n\nB. Incorrect. While living things—branches and leaves—both make identical figurative utterances, they do so not because they have prepared for such an event. Rather, these living things take the change in stride because of the sameness and expectedness of the seasonal shifts, which occur in the same way each time.\n\nC. Incorrect. Even though the branches and leaves have been imbued by the speaker with some degree of consciousness in their figurative ability to speak, they are not surprised by the change in seasons. They say the same thing each year because the same thing occurs each year in the same way.\n\nD. Incorrect. Certain lines of the poem do describe the natural world during the change of seasons, such as lines 8-9: “The yellow spreads of the dandelions and buttercups / reached across the green pastures.” However, this repeated phrase serves to evoke a sense of sameness and inevitability; it is not a phrase related to the physical appearance of the natural world, only the way the natural world responds to the seasonal change with simple acceptance for its sameness. The repeated lines do not hold any sort of expectation or anticipation for the coming of summer; they help relay observations made about the state of the season.",
    "points": 1,
    "prompt": "How does the repetition of “ ‘This is the beginning of summer’ ” in lines 2–3 and lines 18–19 contribute to the meaning of the poem?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It suggests that the shift to summer occurs in the same way each year."
      },
      {
        "id": "B",
        "text": "It emphasizes the idea that living things are prepared for the change of season."
      },
      {
        "id": "C",
        "text": "It highlights the idea that the first signs of summer are surprising each year."
      },
      {
        "id": "D",
        "text": "It builds expectations about what the natural world looks like during a change of season."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "bird-talk-2023-form-a-2023-form-a-q47",
    "explanation": "The question asks for the identification of a description that contrasts with the scarcity and bleakness of winter.\n\nA. Incorrect. These lines indicate that the frogs are first very excited about the shift from winter to spring, which causes them to make a loud “shrilling,” yet their sounds lessen after a time and grow weaker. As such, these lines contrast two periods of spring (early vs. later) and the response of the frogs to these two periods; the lines do not contrast the bleakness of winter with the abundance of spring or summer.\n\nB. CORRECT. During winter, there is scarcity of plant life and a bleak landscape: trees lose their leaves, snow covers the ground, and nature appears dark and shuttered. In contrast, these lines reveal the bright “yellow spreads” of flowers and the verdant “green pastures” that are signs that winter has abated.\n\nC. Incorrect. This description contrasts the sounds of “the breezes” of warmer air and the sounds made by grackles—a type of bird—rather than the bleakness and scarcity of winter and the abundance of the “ ‘beginning of summer’ ” (line 3).\n\nD. Incorrect. These lines show the contrast between the two ways of looking at things in terms of past vs. present or present vs. future; in this instance, the lines reveal the way birds naturally expect and adapt to the passing of time and the change of seasons. The lines do not present a contrast between winter and spring.",
    "points": 1,
    "prompt": "Which lines from the poem best contrast with the idea of winter’s scarcity and bleakness?",
    "promptHtml": "Which lines from the poem <strong>best</strong> contrast with the idea of winter’s scarcity and bleakness?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“The shrilling of the frogs was not so shrill as in the / first weeks after the broken winter;” (lines 4–5)"
      },
      {
        "id": "B",
        "text": "“The yellow spreads of the dandelions and buttercups / reached across the green pastures.” (lines 8–9)"
      },
      {
        "id": "C",
        "html": "“<em>Tee whee</em> and <em>tee whee</em> came on the breezes, and the grackles / chuzzled their syllables.” (lines 10–11)",
        "text": "“Tee whee and tee whee came on the breezes, and the grackles / chuzzled their syllables.” (lines 10–11)"
      },
      {
        "id": "D",
        "text": "“Or if instead of counting up last year as against / this year, they count up this year as against next” (lines 25–26)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "bird-talk-2023-form-a-2023-form-a-q48",
    "explanation": "This question asks how the description of the “bird talk” contributes to the central idea of the poem.\n\nA. Incorrect. The birds’ conversations may center around “who is here” and “who is not here and who used to be here” (lines 23-24), but the lines do not convey that the speaker feels a sense of loss, only that the birds have such figurative conversations in a direct way.\n\nB. Incorrect. Though the birds are described in these lines by the speaker as “talking bird talk” (line 22), it is not suggested that this talk occurs more frequently in one season versus another, only that it occurs year after year because birds encounter seasonal changes as a constant.\n\nC. CORRECT. In these lines, the birds gather, and some birds are not present but “used to be here” (line 24). These birds have likely succumbed to another of nature’s cycles: death, which affects all living things.\n\nD. Incorrect. Though the description in these lines is a vivid one and includes anthropomorphism in the birds asking about “who is here” (line 23) and “counting up last year as against / this year” (lines 25-26), it gives no indication of the speaker’s level of enjoyment in observing nature.",
    "points": 1,
    "prompt": "How do lines 23–28 contribute to a central idea of the poem?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "They suggest that the speaker is aware of what has been lost in the winter."
      },
      {
        "id": "B",
        "text": "They imply that the birds sing the most in the summer."
      },
      {
        "id": "C",
        "text": "They reveal that the birds are subject to the cycles of nature."
      },
      {
        "id": "D",
        "text": "They emphasize that the speaker enjoys observing nature."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "bird-talk-2023-form-a-2023-form-a-q49",
    "explanation": "This question asks for an explanation of how the poet conveys the speaker’s point of view on the natural world and the change of seasons as presented in the poem.\n\nA. Incorrect. Though in the first stanza the speaker describes various elements of nature such as branches, frogs, birds, flowers, and leaves, these elemental shifts are not precisely gradual and occur only in the first stanza. Further, the first stanza, though appreciative of the natural world, is primarily descriptive and does not develop the speaker's perspective to the degree that other parts of the poem do.\n\nB. Incorrect. While it may be inferred that the speaker describes the landscape to such a degree because it has revealed a seasonal shift, that this is indeed the speaker’s motivation is never explicitly conveyed by the poet.\n\nC. Incorrect. Multiple seasons do not pass in the poem; only the shift to the “ ‘beginning of summer’ ” (line 3) occurs in an endless cycle. Further, the speaker does not reveal an emotional response; it is the responses of nature that the speaker describes.\n\nD. CORRECT. The first stanza is the speaker’s observations of the natural world embracing a new season. In the second stanza, the speaker begins to reflect on how the natural world, as embodied by the birds, calmly accepts seasonal change in its perpetual sameness. The reflection continues in the third stanza, where it is revealed that the speaker has been addressing these observations to a child.",
    "points": 1,
    "prompt": "Throughout the poem, the poet conveys the speaker’s point of view by",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "gradually moving the speaker’s attention from one element of nature to another."
      },
      {
        "id": "B",
        "text": "providing the speaker’s motivation for describing the landscape in great detail."
      },
      {
        "id": "C",
        "text": "highlighting the speaker’s emotional response as each season passes."
      },
      {
        "id": "D",
        "text": "shifting the speaker’s focus from external observations to personal reflection."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "bird-talk-2023-form-a-2023-form-a-q50",
    "explanation": "The question asks how the central idea about the natural acceptance of change by nature is developed by the speaker of the poem.\n\nA. Incorrect. The speaker is an observer of the changes in nature as propelled by the seasons and shows no personal eagerness for the end of winter. Further, even though nature rejoices at the end of winter as exemplified by “the shrilling of the frogs” (line 4), the speaker merely records this and does not share in this display.\n\nB. CORRECT. The response of nature to the “beginning of summer” (line 3) is the primary focus of the poem as revealed by the speaker through vivid descriptions of the sights, sounds, movements, and attitudes of the natural world.\n\nC. Incorrect. The second stanza of the poem begins a reflection on birds “sitting in circles talking bird talk” (line 22) and taking a sort of attendance of who is present, but this behavioral description is largely figurative and meant to illustrate a point about the way the birds adapt quickly to change, not to develop a central idea of the poem in terms of how nature responds generally.\n\nD. Incorrect. Seasonal changes are inevitable and cyclical per the speaker, but the speaker does not predict future changes to the landscape as a method of developing the central idea. Rather, the speaker describes nature’s response to changes that have already occurred.",
    "points": 1,
    "prompt": "Over the course of the poem, a central idea is developed mainly through the speaker’s",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "sense of eager anticipation as winter ends."
      },
      {
        "id": "B",
        "text": "description of the changes in nature as the seasons transition."
      },
      {
        "id": "C",
        "text": "observation of the birds’ behavior as summer begins."
      },
      {
        "id": "D",
        "text": "prediction of future alterations in the physical landscape."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const birdTalk2023FormAPassageSet: ExamPassageSet = {
  id: "ela-bird-talk-2023-form-a",
  section: "reading",
  questionCount: birdTalk2023FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "bird-talk-2023-form-a",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    title: "Bird Talk",
    author: "Carl Sandburg",
    byline: "by Carl Sandburg",
    passageType: "poem",
    passageCategory: "official_handbook",
    richText: "<div>And now when the branches were beginning to be heavy,<br>It was the time when they once had said, “This is the<br>&nbsp;&nbsp;&nbsp;&nbsp;beginning of summer.”<br>The shrilling of the frogs was not so shrill as in the<br>&nbsp;&nbsp;&nbsp;&nbsp;first weeks after the broken winter;<br>The birds took their hops and zigzags a little more<br>&nbsp;&nbsp;&nbsp;&nbsp;anxious; a home is a home; worms are worms.<br>The yellow spreads of the dandelions and buttercups<br>&nbsp;&nbsp;&nbsp;&nbsp;reached across the green pastures.<br><em>Tee whee</em> and <em>tee whee</em> came on the breezes, and the grackles<br>&nbsp;&nbsp;&nbsp;&nbsp;chuzzled their syllables.<br>And it was the leaves with a strong soft wind over them<br>&nbsp;&nbsp;&nbsp;&nbsp;that talked most of all and said more than any others<br>&nbsp;&nbsp;&nbsp;&nbsp;though speaking the fewest words.<br>It was the green leaves trickling out the gaunt nowhere<br>&nbsp;&nbsp;&nbsp;&nbsp;of winter, out on the gray hungry branches—<br>It was the leaves on the branches, beginning to be heavy,<br>&nbsp;&nbsp;&nbsp;&nbsp;who said as they said one time before, “This is the be-<br>&nbsp;&nbsp;&nbsp;&nbsp;ginning of summer.”</div><br><div>We shall never blame the birds who come<br>&nbsp;&nbsp;&nbsp;&nbsp;where the river and the road make the Grand Crossing<br>&nbsp;&nbsp;&nbsp;&nbsp;and talk there, sitting in circles talking bird talk.<br>If they ask in their circles as to who is here<br>&nbsp;&nbsp;&nbsp;&nbsp;and as to who is not here and who used to be here,<br>Or if instead of counting up last year as against<br>&nbsp;&nbsp;&nbsp;&nbsp;this year, they count up this year as against next<br>&nbsp;&nbsp;&nbsp;&nbsp;year, and have their bird chatter about who is here<br>&nbsp;&nbsp;&nbsp;&nbsp;this year who won’t be here next year,<br>We shall never blame the birds.</div><br><div>If I have put your face among leaf faces, child,<br>Or if I have put your voice among bird voices,<br>Blame me no more than the bluejays.</div>",
    sourceNote: "“Bird Talk” from THE COMPLETE POEMS OF CARL SANDBURG, published by Harcourt Brace & Company. Copyright © 1970, 1969 by Lilian Steichen Sandburg, Trustee.",
    text: birdTalk2023FormAPassageText,
    versionLabel: "2022-2023 Form A",
  }),
  questions: birdTalk2023FormAQuestions,
};
