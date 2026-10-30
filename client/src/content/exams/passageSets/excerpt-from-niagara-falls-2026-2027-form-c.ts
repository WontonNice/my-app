import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromNiagaraFalls20262027FormCPassageText = "The real secret of the beauty and terror of the Falls is not their height or width, but the feeling of colossal power and of unintelligible disaster caused by the plunge of that vast body of water. If that were taken away, there would be little visible change, but the heart would be gone.\nThe American Falls do not inspire this feeling in the same way as the Canadian. It is because they are less in volume, and because the water does not fall so much into one place. By comparison their beauty is almost delicate and fragile. They are extraordinarily level, one long curtain of lacework and woven foam. Seen from opposite, when the sun is on them, they are blindingly white, and the clouds of spray show dark against them. With both Falls the colour of the water is the ever-altering wonder. Greens and blues, purples and whites, melt into one another, fade, and come again, and change with the changing sun. Sometimes they are as richly diaphanous as a precious stone, and glow from within with a deep, inexplicable light. Sometimes the white intricacies of dropping foam become opaque and creamy. And always there are the rainbows. If you come suddenly upon the Falls from above, a great double rainbow, very vivid, spanning the extent of spray from top to bottom, is the first thing you see. If you wander along the cliff opposite, a bow springs into being in the American Falls, accompanies you courteously on your walk, dwindles and dies as the mist ends, and awakens again as you reach the Canadian tumult. And the bold traveller who attempts the trip under the American Falls sees, when he dare open his eyes to anything, tiny baby rainbows, some four or five yards in span, leaping from rock to rock among the foam, and gambolling beside him, barely out of hand’s reach, as he goes. One I saw in that place was a complete circle, such as I have never seen before, and so near that I could put my foot on it. It is a terrifying journey, beneath and behind the Falls. The senses are battered and bewildered by the thunder of the water and the assault of wind and spray; or rather, the sound is not of falling water, but merely of falling; a noise of unspecified ruin. So, if you are close behind the endless clamour, the sight cannot recognise liquid in the masses that hurl past. You are dimly and pitifully aware that sheets of light and darkness are falling in great curves in front of you. Dull omnipresent foam washes the face. Farther away, in the roar and hissing, clouds of spray seem literally to slide down some invisible plane of air.\nBeyond the foot of the Falls the river is like a slipping floor of marble, green with veins of dirty white, made by the scum that was foam. It slides very quietly and slowly down for a mile or two, sullenly exhausted. Then it turns to a dull sage green, and hurries more swiftly, smooth and ominous. As the walls of the ravine close in, trouble stirs, and the waters boil and eddy. These are the lower rapids, a sight more terrifying than the Falls, because less intelligible. Close in its bands of rock the river surges tumultuously forward, writhing and leaping as if inspired by a demon. It is pressed by the straits into a visibly convex form. Great planes of water slide past. Sometimes it is thrown up into a pinnacle of foam higher than a house, or leaps with incredible speed from the crest of one vast wave to another, along the shining curve between, like the spring of a wild beast. Its motion continually suggests muscular action. The power manifest in these rapids moves one with a different sense of awe and terror from that of the Falls. Here the inhuman life and strength are spontaneous, active, almost resolute. . . . A place of fear.\nOne is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent. The Victorian lies very close below the surface in every man. There one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara. I could not get out of my mind the thought of a friend, who said that the rainbows over the Falls were like the arts and beauty and goodness, with regard to the stream of life—caused by it, thrown upon its spray, but unable to stay or direct or affect it, and ceasing when it ceased. In all comparisons that rise in the heart, the river, with its multitudinous waves and its single current, likens itself to a life, whether of an individual or of a community. A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they. In such places, one is aware, with an almost insupportable and yet comforting certitude, that both men and nations are hurried onwards to their ruin or ending as inevitably as this dark flood. Some go down to it unreluctant, and meet it, like the river, not without nobility. And as incessant, as inevitable, and as unavailing as the spray that hangs over the Falls, is the white cloud of human crying. . . . With some such thoughts does the platitudinous heart win from the confusion and thunder of a Niagara peace that the quietest plains or most stable hills can never give.";

const excerptFromNiagaraFalls20262027FormCQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-niagara-falls-2026-2027-form-c-official-shsat-2026-c-7",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "7"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-ab5fdba4ef9beaec665a.png\" alt=\"Official explanation for question 7\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 2.\nThey are extraordinarily level, one long curtain of lacework and woven foam.\nWhat is the effect of comparing the American Falls to a “long curtain of lacework and woven foam”?",
    "promptHtml": "<p>Read this sentence from <span>paragraph 2.</span></p> <p data-align=\"indent\"><strong>They are extraordinarily level, one long curtain of lacework and woven foam.</strong></p> <p>What is the effect of comparing the American Falls to a “long curtain of lacework and woven foam”?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It demonstrates the timelessness of the American Falls.</p>",
        "text": "It demonstrates the timelessness of the American Falls."
      },
      {
        "id": "B",
        "html": "<p>It conveys the secretive nature of the American Falls.</p>",
        "text": "It conveys the secretive nature of the American Falls."
      },
      {
        "id": "C",
        "html": "<p>It illustrates the elegant uniformity of the American Falls.</p>",
        "text": "It illustrates the elegant uniformity of the American Falls."
      },
      {
        "id": "D",
        "html": "<p>It communicates the intense strength of the American Falls.</p>",
        "text": "It communicates the intense strength of the American Falls."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2026-2027-form-c-official-shsat-2026-c-8",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "8"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-867ba82eade7f806a653.png\" alt=\"Official explanation for question 8\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\nThese are the lower rapids, a sight more terrifying than the Falls, because less intelligible.\nWhich statement best describes how the sentence fits into the overall structure of the excerpt?",
    "promptHtml": "<p>Read this sentence from <span>paragraph 3.</span></p> <p data-align=\"indent\"><strong>These are the lower rapids, a sight more terrifying than the Falls, because less intelligible.</strong></p> <p>Which statement <strong>best</strong> describes how the sentence fits into the overall structure of the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It signals a change from the positive aspects of the Falls to the negative aspects.</p>",
        "text": "It signals a change from the positive aspects of the Falls to the negative aspects."
      },
      {
        "id": "B",
        "html": "<p>It indicates a progression from the literal description of the water to a discussion of timeless truths.</p>",
        "text": "It indicates a progression from the literal description of the water to a discussion of timeless truths."
      },
      {
        "id": "C",
        "html": "<p>It reinforces a shift from the qualities of the Falls to the qualities of the river.</p>",
        "text": "It reinforces a shift from the qualities of the Falls to the qualities of the river."
      },
      {
        "id": "D",
        "html": "<p>It introduces a contrast between the obvious and the hidden features of the rapids.</p>",
        "text": "It introduces a contrast between the obvious and the hidden features of the rapids."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2026-2027-form-c-official-shsat-2026-c-9",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "9"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-b9823c1828cd99457558.png\" alt=\"Official explanation for question 9\">",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that the essence of the Falls lies in their emotional impact?",
    "promptHtml": "<p>Which sentence from the excerpt <strong>best</strong> supports the idea that the essence of the Falls lies in their emotional impact?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>“If that were taken away, there would be little visible change, but the heart would be gone.” <span>(paragraph 1)</span></p>",
        "text": "“If that were taken away, there would be little visible change, but the heart would be gone.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“By comparison their beauty is almost delicate and fragile.” <span>(paragraph 2)</span></p>",
        "text": "“By comparison their beauty is almost delicate and fragile.” (paragraph 2)"
      },
      {
        "id": "C",
        "html": "<p>“One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent.” <span>(paragraph 4)</span></p>",
        "text": "“One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent.” (paragraph 4)"
      },
      {
        "id": "D",
        "html": "<p>“A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they.” <span>(paragraph 4)</span></p>",
        "text": "“A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2026-2027-form-c-official-shsat-2026-c-10",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "10"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-574a3581a205f2b07c08.png\" alt=\"Official explanation for question 10\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\nThere one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara.\nThe sentence most contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>Read this sentence from <span>paragraph 4.</span></p> <p data-align=\"indent\"><strong>There one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara.</strong></p> <p>The sentence <strong>most</strong> contributes to the development of ideas in the excerpt by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggesting that viewing the Falls can be a life-changing experience.</p>",
        "text": "suggesting that viewing the Falls can be a life-changing experience."
      },
      {
        "id": "B",
        "html": "<p>showing that the cliffs of the Falls are a good place for self-examination.</p>",
        "text": "showing that the cliffs of the Falls are a good place for self-examination."
      },
      {
        "id": "C",
        "html": "<p>emphasizing that the grandeur of the Falls seems impossible to grasp.</p>",
        "text": "emphasizing that the grandeur of the Falls seems impossible to grasp."
      },
      {
        "id": "D",
        "html": "<p>highlighting the type of reflection that is inspired by a visit to the Falls.</p>",
        "text": "highlighting the type of reflection that is inspired by a visit to the Falls."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2026-2027-form-c-official-shsat-2026-c-11",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "11"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-23531545a404fed915df.png\" alt=\"Official explanation for question 11\">",
    "points": 1,
    "prompt": "In paragraph 4, the idea that human life and history ultimately end in the same way is illustrated mainly through",
    "promptHtml": "<p>In paragraph 4, the idea that human life and history ultimately end in the same way is illustrated <strong>mainly</strong> through</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the discussion of how the rainbows visible in the Falls are like the art and beauty created by humankind.</p>",
        "text": "the discussion of how the rainbows visible in the Falls are like the art and beauty created by humankind."
      },
      {
        "id": "B",
        "html": "<p>the comparison between the movement of water in the Falls and the human experience.</p>",
        "text": "the comparison between the movement of water in the Falls and the human experience."
      },
      {
        "id": "C",
        "html": "<p>the inclusion of details that show that every observer’s experience with the Falls is different.</p>",
        "text": "the inclusion of details that show that every observer’s experience with the Falls is different."
      },
      {
        "id": "D",
        "html": "<p>the acknowledgment that contemplating the Falls at night sparks an awareness of humankind’s destiny.</p>",
        "text": "the acknowledgment that contemplating the Falls at night sparks an awareness of humankind’s destiny."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2026-2027-form-c-official-shsat-2026-c-12",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "12"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-e202943f458eebc4d5c5.png\" alt=\"Official explanation for question 12\">",
    "points": 1,
    "prompt": "With which statement would the author of this excerpt most likely agree?",
    "promptHtml": "<p><span>With</span> <span>which</span> <span>statement</span> would the <span>author</span> of this excerpt <span><strong>most likely</strong></span> agree?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>A sense of ease and assurance comes with accepting one’s fate.</p>",
        "text": "A sense of ease and assurance comes with accepting one’s fate."
      },
      {
        "id": "B",
        "html": "<p>No matter where one’s path goes in life, one will always have regrets.</p>",
        "text": "No matter where one’s path goes in life, one will always have regrets."
      },
      {
        "id": "C",
        "html": "<p>The best way to overcome fear is to recognize it and then defy it.</p>",
        "text": "The best way to overcome fear is to recognize it and then defy it."
      },
      {
        "id": "D",
        "html": "<p>Reason will die out with humanity, but art will remain immortal.</p>",
        "text": "Reason will die out with humanity, but art will remain immortal."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromNiagaraFalls20262027FormCPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-niagara-falls-2026-2027-form-c",
  versionLabels: ["2026-2027 Form C"],
  section: "reading",
  questionCount: excerptFromNiagaraFalls20262027FormCQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-niagara-falls-2026-2027-form-c",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from “Niagara Falls”",
    bylineHtml: "by Rupert Brooke",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"C","section":"ELA - Passage Set 2 of 7","packageId":"135b3f9730ceb9588717d968769b3cb619dff86957bb8a09022f41765068a58c"},
    title: "Excerpt from “Niagara Falls”",
    author: "Rupert Brooke",
    byline: "by Rupert Brooke",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\"> The real secret of the beauty and terror of the Falls is not their height or width, but the feeling of colossal power and of unintelligible disaster caused by the plunge of that vast body of water. If that were taken away, there would be little visible change, but the heart would be gone.</p> <p data-numbered=\"true\"> The American Falls do not inspire this feeling in the same way as the Canadian. It is because they are less in volume, and because the water does not fall so much into one place. By comparison their beauty is almost delicate and fragile. They are extraordinarily level, one long curtain of lacework and woven foam. Seen from opposite, when the sun is on them, they are blindingly white, and the clouds of spray show dark against them. With both Falls the colour of the water is the ever-altering wonder. Greens and blues, purples and whites, melt into one another, fade, and come again, and change with the changing sun. Sometimes they are as richly <span data-glossary-definition=\"sheer, translucent\" role=\"link\" tabindex=\"0\">diaphanous</span> as a precious stone, and glow from within with a deep, inexplicable light. Sometimes the white intricacies of dropping foam become opaque and creamy. And always there are the rainbows. If you come suddenly upon the Falls from above, a great double rainbow, very vivid, spanning the extent of spray from top to bottom, is the first thing you see. If you wander along the cliff opposite, a bow springs into being in the American Falls, accompanies you courteously on your walk, dwindles and dies as the mist ends, and awakens again as you reach the Canadian tumult. And the bold traveller who attempts the trip under the American Falls sees, when he dare open his eyes to anything, tiny baby rainbows, some four or <span>five yards</span> in span, leaping from rock to rock among the foam, and gambolling beside him, barely out of hand’s reach, as he goes. One I saw in that place was a complete circle, such as I have never seen before, and so near that I could put my foot on it. It is a terrifying journey, beneath and behind the Falls. The senses are battered and bewildered by the thunder of the water and the assault of wind and spray; or rather, the sound is not of falling water, but merely of falling; a noise of unspecified ruin. So, if you are close behind the endless clamour, the sight cannot recognise liquid in the masses that hurl past. You are dimly and pitifully aware that sheets of light and darkness are falling in great curves in front of you. Dull omnipresent foam washes the face. Farther away, in the roar and hissing, clouds of spray seem literally to slide down some invisible plane of air.</p> <p data-numbered=\"true\"> Beyond the foot of the Falls the river is like a slipping floor of marble, green with veins of dirty white, made by the scum that was foam. It slides very quietly and slowly down for a mile or two, sullenly exhausted. Then it turns to a dull sage green, and hurries more swiftly, smooth and ominous. As the walls of the ravine close in, trouble stirs, and the waters boil and eddy. These are the lower rapids, a sight more terrifying than the Falls, because less intelligible. Close in its bands of rock the river surges tumultuously forward, writhing and leaping as if inspired by a demon. It is pressed by the straits into a visibly convex form. Great planes of water slide past. Sometimes it is thrown up into a pinnacle of foam higher than a house, or leaps with incredible speed from the crest of one vast wave to another, along the shining curve between, like the spring of a wild beast. Its motion continually suggests muscular action. The power manifest in these rapids moves one with a different sense of awe and terror from that of the Falls. Here the inhuman life and strength are spontaneous, active, almost resolute. . . . A place of fear.</p> <p data-numbered=\"true\"> One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent. The Victorian lies very close below the surface in every man. There one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara. I could not get out of my mind the thought of a friend, who said that the rainbows over the Falls were like the arts and beauty and goodness, with regard to the stream of <span>life—</span>caused by it, thrown upon its spray, but unable to stay or direct or affect it, and ceasing when it ceased. In all comparisons that rise in the heart, the river, with its multitudinous waves and its single current, likens itself to a life, whether of an individual or of a community. A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they. In such places, one is aware, with an almost insupportable and yet comforting certitude, that both men and nations are hurried onwards to their ruin or ending as inevitably as this dark flood. Some go down to it unreluctant, and meet it, like the river, not without nobility. And as incessant, as inevitable, and as unavailing as the spray that hangs over the Falls, is the white cloud of human <span>crying. . . .</span> With some such thoughts does the <span data-glossary-definition=\"clichéd, common\" role=\"link\" tabindex=\"0\">platitudinous</span> heart win from the confusion and thunder of a Niagara peace that the quietest plains or most stable hills can never give.</p>",
    sourceNote: "From LETTERS FROM AMERICA by Rupert Brooke—Public Domain",
    text: excerptFromNiagaraFalls20262027FormCPassageText,
    versionLabel: "2026-2027 Form C",
  }),
  questions: excerptFromNiagaraFalls20262027FormCQuestions,
};
