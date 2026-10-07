import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromNiagaraFalls20202021ShsatSampleTestFormBPassageText = "The real secret of the beauty and terror of the Falls is not their height or width, but the feeling of colossal power and of unintelligible disaster caused by the plunge of that vast body of water. If that were taken away, there would be little visible change, but the heart would be gone.\n\nThe American Falls do not inspire this feeling in the same way as the Canadian. It is because they are less in volume, and because the water does not fall so much into one place. By comparison their beauty is almost delicate and fragile. They are extraordinarily level, one long curtain of lacework and woven foam. Seen from opposite, when the sun is on them, they are blindingly white, and the clouds of spray show dark against them. With both Falls the colour of the water is the ever-altering wonder. Greens and blues, purples and whites, melt into one another, fade, and come again, and change with the changing sun. Sometimes they are as richly diaphanous as a precious stone, and glow from within with a deep, inexplicable light. Sometimes the white intricacies of dropping foam become opaque and creamy. And always there are the rainbows. If you come suddenly upon the Falls from above, a great double rainbow, very vivid, spanning the extent of spray from top to bottom, is the first thing you see. If you wander along the cliff opposite, a bow springs into being in the American Falls, accompanies you courteously on your walk, dwindles and dies as the mist ends, and awakens again as you reach the Canadian tumult. And the bold traveller who attempts the trip under the American Falls sees, when he dare open his eyes to anything, tiny baby rainbows, some four or five yards in span, leaping from rock to rock among the foam, and gambolling beside him, barely out of hand’s reach, as he goes. One I saw in that place was a complete circle, such as I have never seen before, and so near that I could put my foot on it. It is a terrifying journey, beneath and behind the Falls. The senses are battered and bewildered by the thunder of the water and the assault of wind and spray; or rather, the sound is not of falling water, but merely of falling; a noise of unspecified ruin. So, if you are close behind the endless clamour, the sight cannot recognise liquid in the masses that hurl past. You are dimly and pitifully aware that sheets of light and darkness are falling in great curves in front of you. Dull omnipresent foam washes the face. Farther away, in the roar and hissing, clouds of spray seem literally to slide down some invisible plane of air.\n\nBeyond the foot of the Falls the river is like a slipping floor of marble, green with veins of dirty white, made by the scum that was foam. It slides very quietly and slowly down for a mile or two, sullenly exhausted. Then it turns to a dull sage green, and hurries more swiftly, smooth and ominous. As the walls of the ravine close in, trouble stirs, and the waters boil and eddy. These are the lower rapids, a sight more terrifying than the Falls, because less intelligible. Close in its bands of rock the river surges tumultuously forward, writhing and leaping as if inspired by a demon. It is pressed by the straits into a visibly convex form. Great planes of water slide past. Sometimes it is thrown up into a pinnacle of foam higher than a house, or leaps with incredible speed from the crest of one vast wave to another, along the shining curve between, like the spring of a wild beast. Its motion continually suggests muscular action. The power manifest in these rapids moves one with a different sense of awe and terror from that of the Falls. Here the inhuman life and strength are spontaneous, active, almost resolute. . . . A place of fear.\n\n4 One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent. The Victorian lies very close below the surface in every man. There one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara. I could not get out of my mind the thought of a friend, who said that the rainbows over the Falls were like the arts and beauty and goodness, with regard to the stream of life—caused by it, thrown upon its spray, but unable to stay or direct or affect it, and ceasing when it ceased. In all comparisons that rise in the heart, the river, with its multitudinous waves and its single current, likens itself to a life, whether of an individual or of a community. A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they. In such places, one is aware, with an almost insupportable and yet comforting certitude, that both men and nations are hurried onwards to their ruin or ending as inevitably as this dark flood. Some go down to it unreluctant, and meet it, like the river, not without nobility. And as incessant, as inevitable, and as unavailing as the spray that hangs over the Falls, is the white cloud of human crying. . . . With some such thoughts does the platitudinous heart win from the confusion and thunder of a Niagara peace that the quietest plains or most stable hills can never give.";

const excerptFromNiagaraFalls20202021ShsatSampleTestFormBQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b-1",
    "points": 1,
    "prompt": "The central idea that the Falls communicate a feeling of “unintelligible disaster” (paragraph 1) is conveyed in paragraph 2 through a description of",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "the glow of the precious stones visible within the water."
      },
      {
        "id": "B",
        "text": "the dynamic flow of the colors that are visible in the water."
      },
      {
        "id": "C",
        "text": "the sudden appearance and disappearance of rainbows."
      },
      {
        "id": "D",
        "text": "the sounds associated with a sense of falling."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b-2",
    "points": 1,
    "prompt": "Read this sentence from paragraph 2.\n\nThey are extraordinarily level, one long curtain of lacework and woven foam.\n\nWhat is the effect of comparing the American Falls to a “long curtain of lacework and woven foam”?",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "It demonstrates the timelessness of the American Falls."
      },
      {
        "id": "B",
        "text": "It conveys the secretive nature of the American Falls."
      },
      {
        "id": "C",
        "text": "It illustrates the elegant uniformity of the American Falls."
      },
      {
        "id": "D",
        "text": "It communicates the intense strength of the American Falls."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b-3",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\nThese are the lower rapids, a sight more terrifying than the Falls, because less intelligible.\n\nWhich statement best describes how the sentence fits into the overall structure of the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It signals a change from the positive aspects of the Falls to the negative aspects."
      },
      {
        "id": "B",
        "text": "It indicates a progression from the literal description of the water to a discussion of timeless truths."
      },
      {
        "id": "C",
        "text": "It reinforces a shift from the qualities of the Falls to the qualities of the river."
      },
      {
        "id": "D",
        "text": "It introduces a contrast between the obvious and the hidden features of the rapids."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b-4",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that the essence of the Falls lies in their emotional impact?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“If that were taken away, there would be little visible change, but the heart would be gone.” (paragraph 1)"
      },
      {
        "id": "B",
        "text": "“By comparison their beauty is almost delicate and fragile.” (paragraph 2)"
      },
      {
        "id": "C",
        "text": "“One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent.” (paragraph 4)"
      },
      {
        "id": "D",
        "text": "“A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b-5",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nThere one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara.\n\nThe sentence most contributes to the development of ideas in the excerpt by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "suggesting that viewing the Falls can be a life-changing experience."
      },
      {
        "id": "B",
        "text": "showing that the cliffs of the Falls are a good place for self-examination."
      },
      {
        "id": "C",
        "text": "emphasizing that the grandeur of the Falls seems impossible to grasp."
      },
      {
        "id": "D",
        "text": "highlighting the type of reflection that is inspired by a visit to the Falls."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b-6",
    "points": 1,
    "prompt": "In paragraph 4, the idea that human life and history travel toward the same ending is illustrated mainly through",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "the discussion of how the rainbows visible in the Falls are like the art and beauty created by humankind."
      },
      {
        "id": "B",
        "text": "the comparison between the movement of water in the Falls and the human experience."
      },
      {
        "id": "C",
        "text": "the inclusion of details that show that every observer’s experience with the Falls is different."
      },
      {
        "id": "D",
        "text": "the acknowledgment that contemplating the Falls at night sparks an awareness of humankind’s destiny."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b-7",
    "points": 1,
    "prompt": "With which statement would the author of this excerpt most likely agree?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "A sense of ease and assurance comes with accepting one’s fate."
      },
      {
        "id": "B",
        "text": "No matter where one’s path goes in life, one will always have regrets."
      },
      {
        "id": "C",
        "text": "The best way to overcome fear is to recognize it and then defy it."
      },
      {
        "id": "D",
        "text": "Reason will die out with humanity, but art will remain immortal."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromNiagaraFalls20202021ShsatSampleTestFormBPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromNiagaraFalls20202021ShsatSampleTestFormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createProsePassage({
    id: "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b",
    title: "Excerpt from “Niagara Falls”",
    author: "Rupert Brooke",
    passageType: "literary",
    passageCategory: "official_handbook",
    richText: "<p>The real secret of the beauty and terror of the Falls is not their height or width, but the feeling of colossal power and of unintelligible disaster caused by the plunge of that vast body of water. If that were taken away, there would be little visible change, but the heart would be gone.</p><p>The American Falls do not inspire this feeling in the same way as the Canadian. It is because they are less in volume, and because the water does not fall so much into one place. By comparison their beauty is almost delicate and fragile. They are extraordinarily level, one long curtain of lacework and woven foam. Seen from opposite, when the sun is on them, they are blindingly white, and the clouds of spray show dark against them. With both Falls the colour of the water is the ever-altering wonder. Greens and blues, purples and whites, melt into one another, fade, and come again, and change with the changing sun. Sometimes they are as richly diaphanous as a precious stone, and glow from within with a deep, inexplicable light. Sometimes the white intricacies of dropping foam become opaque and creamy. And always there are the rainbows. If you come suddenly upon the Falls from above, a great double rainbow, very vivid, spanning the extent of spray from top to bottom, is the first thing you see. If you wander along the cliff opposite, a bow springs into being in the American Falls, accompanies you courteously on your walk, dwindles and dies as the mist ends, and awakens again as you reach the Canadian tumult. And the bold traveller who attempts the trip under the American Falls sees, when he dare open his eyes to anything, tiny baby rainbows, some four or five yards in span, leaping from rock to rock among the foam, and gambolling beside him, barely out of hand’s reach, as he goes. One I saw in that place was a complete circle, such as I have never seen before, and so near that I could put my foot on it. It is a terrifying journey, beneath and behind the Falls. The senses are battered and bewildered by the thunder of the water and the assault of wind and spray; or rather, the sound is not of falling water, but merely of falling; a noise of unspecified ruin. So, if you are close behind the endless clamour, the sight cannot recognise liquid in the masses that hurl past. You are dimly and pitifully aware that sheets of light and darkness are falling in great curves in front of you. Dull omnipresent foam washes the face. Farther away, in the roar and hissing, clouds of spray seem literally to slide down some invisible plane of air.</p><p>Beyond the foot of the Falls the river is like a slipping floor of marble, green with veins of dirty white, made by the scum that was foam. It slides very quietly and slowly down for a mile or two, sullenly exhausted. Then it turns to a dull sage green, and hurries more swiftly, smooth and ominous. As the walls of the ravine close in, trouble stirs, and the waters boil and eddy. These are the lower rapids, a sight more terrifying than the Falls, because less intelligible. Close in its bands of rock the river surges tumultuously forward, writhing and leaping as if inspired by a demon. It is pressed by the straits into a visibly convex form. Great planes of water slide past. Sometimes it is thrown up into a pinnacle of foam higher than a house, or leaps with incredible speed from the crest of one vast wave to another, along the shining curve between, like the spring of a wild beast. Its motion continually suggests muscular action. The power manifest in these rapids moves one with a different sense of awe and terror from that of the Falls. Here the inhuman life and strength are spontaneous, active, almost resolute. . . . A place of fear.</p><p>4 One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent. The Victorian lies very close below the surface in every man. There one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara. I could not get out of my mind the thought of a friend, who said that the rainbows over the Falls were like the arts and beauty and goodness, with regard to the stream of life—caused by it, thrown upon its spray, but unable to stay or direct or affect it, and ceasing when it ceased. In all comparisons that rise in the heart, the river, with its multitudinous waves and its single current, likens itself to a life, whether of an individual or of a community. A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they. In such places, one is aware, with an almost insupportable and yet comforting certitude, that both men and nations are hurried onwards to their ruin or ending as inevitably as this dark flood. Some go down to it unreluctant, and meet it, like the river, not without nobility. And as incessant, as inevitable, and as unavailing as the spray that hangs over the Falls, is the white cloud of human crying. . . . With some such thoughts does the platitudinous heart win from the confusion and thunder of a Niagara peace that the quietest plains or most stable hills can never give.</p>",
    sourceNote: "From LETTERS FROM AMERICA by Rupert Brooke—Public Domain",
    teacherSource: "20202021_form_b.pdf, printed pages 178–181, questions 51–57",
    text: excerptFromNiagaraFalls20202021ShsatSampleTestFormBPassageText,
    versionLabel: "2020–2021 Form B",
  }),
  questions: excerptFromNiagaraFalls20202021ShsatSampleTestFormBQuestions,
};
