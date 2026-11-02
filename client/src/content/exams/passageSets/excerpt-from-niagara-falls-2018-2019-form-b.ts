import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromNiagaraFalls20182019FormBPassageText = "The real secret of the beauty and terror of the Falls is not their height or width, but the feeling of colossal power and of unintelligible disaster caused by the plunge of that vast body of water. If that were taken away, there would be little visible change, but the heart would be gone.\n\nThe American Falls do not inspire this feeling in the same way as the Canadian. It is because they are less in volume, and because the water does not fall so much into one place. By comparison their beauty is almost delicate and fragile. They are extraordinarily level, one long curtain of lacework and woven foam. Seen from opposite, when the sun is on them, they are blindingly white, and the clouds of spray show dark against them. With both Falls the colour of the water is the ever-altering wonder. Greens and blues, purples and whites, melt into one another, fade, and come again, and change with the changing sun. Sometimes they are as richly diaphanous as a precious stone, and glow from within with a deep, inexplicable light. Sometimes the white intricacies of dropping foam become opaque and creamy. And always there are the rainbows. If you come suddenly upon the Falls from above, a great double rainbow, very vivid, spanning the extent of spray from top to bottom, is the first thing you see. If you wander along the cliff opposite, a bow springs into being in the American Falls, accompanies you courteously on your walk, dwindles and dies as the mist ends, and awakens again as you reach the Canadian tumult. And the bold traveller who attempts the trip under the American Falls sees, when he dare open his eyes to anything, tiny baby rainbows, some four or five yards in span, leaping from rock to rock among the foam, and gambolling beside him, barely out of hand’s reach, as he goes. One I saw in that place was a complete circle, such as I have never seen before, and so near that I could put my foot on it. It is a terrifying journey, beneath and behind the Falls. The senses are battered and bewildered by the thunder of the water and the assault of wind and spray; or rather, the sound is not of falling water, but merely of falling; a noise of unspecified ruin. So, if you are close behind the endless clamour, the sight cannot recognise liquid in the masses that hurl past. You are dimly and pitifully aware that sheets of light and darkness are falling in great curves in front of you. Dull omnipresent foam washes the face. Farther away, in the roar and hissing, clouds of spray seem literally to slide down some invisible plane of air.\n\nBeyond the foot of the Falls the river is like a slipping floor of marble, green with veins of dirty white, made by the scum that was foam. It slides very quietly and slowly down for a mile or two, sullenly exhausted. Then it turns to a dull sage green, and hurries more swiftly, smooth and ominous. As the walls of the ravine close in, trouble stirs, and the waters boil and eddy. These are the lower rapids, a sight more terrifying than the Falls, because less intelligible. Close in its bands of rock the river surges tumultuously forward, writhing and leaping as if inspired by a demon. It is pressed by the straits into a visibly convex form. Great planes of water slide past. Sometimes it is thrown up into a pinnacle of foam higher than a house, or leaps with incredible speed from the crest of one vast wave to another, along the shining curve between, like the spring of a wild beast. Its motion continually suggests muscular action. The power manifest in these rapids moves one with a different sense of awe and terror from that of the Falls. Here the inhuman life and strength are spontaneous, active, almost resolute. . . . A place of fear. One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent. The Victorian lies very close below the surface in every man. There one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara. I could not get out of my mind the thought of a friend, who said that the rainbows over the Falls were like the arts and beauty and goodness, with regard to the stream of life—caused by it, thrown upon its spray, but unable to stay or direct or affect it, and ceasing when it ceased. In all comparisons that rise in the heart, the river, with its multitudinous waves and its single current, likens itself to a life, whether of an individual or of a community. A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they. In such places, one is aware, with an almost insupportable and yet comforting certitude, that both men and nations are hurried onwards to their ruin or ending as inevitably as this dark flood. Some go down to it unreluctant, and meet it, like the river, not without nobility. And as incessant, as inevitable, and as unavailing as the spray that hangs over the Falls, is the white cloud of human crying. . . . With some such thoughts does the platitudinous2 heart win from the confusion and thunder of a Niagara peace that the quietest plains or most stable hills can never give.";

const excerptFromNiagaraFalls20182019FormBQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-niagara-falls-2018-2019-form-b-pdf-shsat-2018-2019-b-q025",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "25",
      "pages": [
        20
      ]
    },
    "explanation": "25. (D) The question asks for a specific detail from paragraph 2 that conveys the central idea that the Falls communicates a feeling of “unintelligible disaster” (paragraph 1). The sound of falling is described in paragraph 2 as “a noise of unspecified ruin,” so Option D is correct because it best connects with the idea of “unintelligible disaster” mentioned in paragraph 1. Option A is incorrect because, although the water is described as “diaphanous as a precious stone” in paragraph 2 because of the “glow” coming from the interaction of the light, there are no stones within the water. Option B is incorrect because the details in paragraph 2 about the flow of colors in the water are described as an “ever-altering wonder,” which conveys a sense of beauty and not a sense of disaster. Option C is incorrect because the rainbows in paragraph 2 are described as “vivid” and accompanying someone “courteously” while he or she walks, which contributes to the idea that the appearance and disappearance of the rainbows are a pleasant experience and not disastrous.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q025-explanation-1.png\" alt=\"Supplied Form B explanation for question 25\" width=\"351\"></p>",
    "points": 1,
    "prompt": "The central idea that the Falls communicate a feeling of “unintelligible disaster” (paragraph 1) is conveyed in paragraph 2 through a description of",
    "promptHtml": "<p>The central idea that the Falls communicate a feeling of “unintelligible disaster” (paragraph 1) is conveyed in paragraph 2 through a description of</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>the glow of the precious stones visible within the water.</p>",
        "text": "the glow of the precious stones visible within the water."
      },
      {
        "id": "B",
        "html": "<p>the dynamic flow of the colors that are visible in the water.</p>",
        "text": "the dynamic flow of the colors that are visible in the water."
      },
      {
        "id": "C",
        "html": "<p>the sudden appearance and disappearance of rainbows.</p>",
        "text": "the sudden appearance and disappearance of rainbows."
      },
      {
        "id": "D",
        "html": "<p>the sounds associated with a sense of falling.</p>",
        "text": "the sounds associated with a sense of falling."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2018-2019-form-b-pdf-shsat-2018-2019-b-q026",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "26",
      "pages": [
        20
      ]
    },
    "explanation": "26. (G) The question asks for the effect of the comparison being made in the sentence in paragraph 2. The word “lacework” in the sentence suggests an elegant piece of craftsmanship, and the “one long curtain” and “extraordinarily level” aspects of the Falls mean that the Falls are uniform or consistent; therefore, Option G is correct. Option E is incorrect because neither “lacework and woven foam,” nor the quality of being\n\nextremely level, are related to timelessness. Option F is incorrect because, while a curtain may suggest the idea of something being hidden or secret, the description of a delicate “lacework” curtain does not suggest this purpose. Option H is incorrect because “lacework” is generally fragile and does not suggest great strength.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q026-explanation-1.png\" alt=\"Supplied Form B explanation for question 26\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q026-explanation-2.png\" alt=\"Supplied Form B explanation for question 26\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 2.\n\nThey are extraordinarily level, one long curtain of lacework and woven foam.\n\nWhat is the effect of comparing the American Falls to a “long curtain of lacework and woven foam”?",
    "promptHtml": "<p>Read this sentence from paragraph 2.</p><blockquote><strong>They are extraordinarily level, one long curtain of lacework and woven foam.</strong></blockquote><p>What is the effect of comparing the American Falls to a “long curtain of lacework and woven foam”?</p>",
    "topic": "Inference",
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
    "id": "excerpt-from-niagara-falls-2018-2019-form-b-pdf-shsat-2018-2019-b-q027",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "27",
      "pages": [
        21
      ]
    },
    "explanation": "27. (C) The question asks for the statement that best describes how the sentence from paragraph 3 fits into the overall structure of the excerpt. The first sentence of paragraph 3 moves the description “beyond the foot of the Falls” to “the river” and then begins to describe this location before confirming it again with the words “these are the lower rapids.” This emphasis on the shift in location is best stated in Option C, making it the correct response. Option A is incorrect because, as the first sentence in paragraph 3 states, the paragraph describes the river and not aspects of the Falls. Option B is incorrect because the entire paragraph describes only the literal movements of the river. Option D is incorrect because the features of the rapids, as described in paragraph 3, are all obvious and not hidden.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q027-explanation-1.png\" alt=\"Supplied Form B explanation for question 27\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\nThese are the lower rapids, a sight more terrifying than the Falls, because less intelligible.\n\nWhich statement best describes how the sentence fits into the overall structure of the excerpt?",
    "promptHtml": "<p>Read this sentence from paragraph 3.</p><blockquote><strong>These are the lower rapids, a sight more terrifying than the Falls, because less intelligible.</strong></blockquote><p>Which statement best describes how the sentence fits into the overall structure of the excerpt?</p>",
    "topic": "Text Structure & Purpose",
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
        "html": "<p>It highlights a shift from the qualities of the Falls to the qualities of the river.</p>",
        "text": "It highlights a shift from the qualities of the Falls to the qualities of the river."
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
    "id": "excerpt-from-niagara-falls-2018-2019-form-b-pdf-shsat-2018-2019-b-q028",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "28",
      "pages": [
        21
      ]
    },
    "explanation": "28. (E) The question asks for the sentence from the excerpt that best supports the idea that the essence of the Falls lies in their emotional impact. The first sentence in the excerpt establishes the “real secret of the beauty and terror of the Falls . . . lies in the feeling of colossal power and unintelligible disaster.” Option E is correct because the sentence in Option A best supports this notion by identifying these qualities as “the heart,” or essence, of the Falls. While “delicate” and “fragile” are words that can be connected with certain kinds of emotions, in the sentence in Option F, they are connected with physical beauty, so Option F is incorrect. Option G is incorrect because, while the sentence in Option G describes the power of the Falls’ to engage one in thought, it does not best support the idea that the essence of the Falls lies in their emotional impact. Option H is incorrect because the sentence in Option H describes thoughts one may have while watching the Falls and is not focused on the Falls’ emotional impact.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q028-explanation-1.png\" alt=\"Supplied Form B explanation for question 28\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that the essence of the Falls lies in their emotional impact?",
    "promptHtml": "<p>Which sentence from the excerpt best supports the idea that the essence of the Falls lies in their emotional impact?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“If that were taken away, there would be little visible change, but the heart would be gone.” (paragraph 1)</p>",
        "text": "“If that were taken away, there would be little visible change, but the heart would be gone.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“By comparison their beauty is almost delicate and fragile.” (paragraph 2)</p>",
        "text": "“By comparison their beauty is almost delicate and fragile.” (paragraph 2)"
      },
      {
        "id": "C",
        "html": "<p>“One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent.” (paragraph 4)</p>",
        "text": "“One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent.” (paragraph 4)"
      },
      {
        "id": "D",
        "html": "<p>“A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they.” (paragraph 4)</p>",
        "text": "“A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-niagara-falls-2018-2019-form-b-pdf-shsat-2018-2019-b-q029",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "29",
      "pages": [
        21
      ]
    },
    "explanation": "29. (D) The question asks how the sentence from paragraph 4 contributes to the development of ideas in the excerpt. The description of “cloudy thoughts of destiny and the passage of empires” in the sentence refers to the types of thoughts a person might have while observing the Falls, as stated in Option D. Option A is incorrect because the sentence focuses on the idea that the Falls are a place of great contemplation but does not clarify that these thoughts are life-changing. Option\n\nB is incorrect because the sentence does not describe focused thoughts of a personal nature; the grand, sweeping nature of the falls inspire thoughts of the same caliber as “the passage of empires.” Option C is incorrect because the sentence is about how the Falls inspire great thoughts but is not about how difficult it is to grasp the grandeur of the Falls.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q029-explanation-1.png\" alt=\"Supplied Form B explanation for question 29\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q029-explanation-2.png\" alt=\"Supplied Form B explanation for question 29\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nThere one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara.\n\nThe sentence most contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>Read this sentence from paragraph 4.</p><blockquote><strong>There one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara.</strong></blockquote><p>The sentence most contributes to the development of ideas in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
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
    "id": "excerpt-from-niagara-falls-2018-2019-form-b-pdf-shsat-2018-2019-b-q030",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "30",
      "pages": [
        22
      ]
    },
    "explanation": "30. (F) The question asks how the discussion of human life and history is illustrated in paragraph 4 of the excerpt. The author concludes in paragraph 4 that the Falls can be compared to people and history by writing, “both men and nations are hurried onwards to their ruin or ending as inevitably as this dark flood,” making Option F correct. Option E is incorrect because the discussion of rainbows in paragraph 4 focuses on the fate of art and beauty, not of humanity (“I could not get out of my mind the thought of a friend, who said that the rainbows over the Falls were like the arts and beauty and goodness, with regard to the stream of life—caused by it, thrown upon its spray, but unable to stay or direct or affect it, and ceasing when it ceased”). Option G is incorrect because, in paragraph 4, the author talks about people in general when discussing “men and nations” and provides no evidence of the differences in specific individuals’ experience of the Falls. Option H is incorrect because, while the setting at night does provide a place of contemplation, the author notes the “dark flood” as the overall illustration of the human experience.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q030-explanation-1.png\" alt=\"Supplied Form B explanation for question 30\" width=\"351\"></p>",
    "points": 1,
    "prompt": "In paragraph 4, the idea that human life and history travel toward the same ending is illustrated mainly through",
    "promptHtml": "<p>In paragraph 4, the idea that human life and history travel toward the same ending is illustrated mainly through</p>",
    "topic": "Inference",
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
    "id": "excerpt-from-niagara-falls-2018-2019-form-b-pdf-shsat-2018-2019-b-q031",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "31",
      "pages": [
        22
      ]
    },
    "explanation": "31. (A) The question asks for the statement the author would agree with most. In paragraph 4, the author states that the Falls make a person feel “with an almost insupportable and yet comforting certitude, that both men and nations are hurried onwards to their ruin or ending.” Later, the final sentence says, “With some such thoughts does the platitudinous heart win from the confusion and thunder of a Niagara peace.” This sentence supports the author’s belief that a person can find peace in accepting the certainty of his or her own ending, as expressed in Option A. Option B is incorrect because the author does not discuss regrets in the excerpt. Option C is incorrect because, while the excerpt discusses fear when looking at the power of the Falls, the excerpt does not support the idea that one should defy fear. Option D is incorrect because the excerpt states in paragraph 4 that art is “unable to stay.”\n\nUncovering the Past",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q031-explanation-1.png\" alt=\"Supplied Form B explanation for question 31\" width=\"351\"></p>",
    "points": 1,
    "prompt": "With which statement would the author of this excerpt most likely agree?",
    "promptHtml": "<p>With which statement would the author of this excerpt most likely agree?</p>",
    "topic": "Inference",
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

export const excerptFromNiagaraFalls20182019FormBPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-niagara-falls-2018-2019-form-b",
  versionLabels: ["2018-2019 Form B"],
  label: "2018-2019 Form B",
  section: "reading",
  questionCount: excerptFromNiagaraFalls20182019FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-niagara-falls-2018-2019-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from “Niagara Falls”",
    sourceNoteHtml: "<p>From LETTERS FROM AMERICA by Rupert Brooke—Public Domain</p>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2018-2019 Form B","year":"2018-2019","form":"B","packageId":"82a187b0503bd94c3897cb85ef0ea56f4ef9ff2b46d9dc07d03468ab84cbff9a"},
    title: "Excerpt from “Niagara Falls”",
    author: "Rupert Brooke",
    byline: "by Rupert Brooke",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>The real secret of the beauty and terror of the Falls is not their height or width, but the feeling of colossal power and of unintelligible disaster caused by the plunge of that vast body of water. If that were taken away, there would be little visible change, but the heart would be gone.</p><p>The American Falls do not inspire this feeling in the same way as the Canadian. It is because they are less in volume, and because the water does not fall so much into one place. By comparison their beauty is almost delicate and fragile. They are extraordinarily level, one long curtain of lacework and woven foam. Seen from opposite, when the sun is on them, they are blindingly white, and the clouds of spray show dark against them. With both Falls the colour of the water is the ever-altering wonder. Greens and blues, purples and whites, melt into one another, fade, and come again, and change with the changing sun. Sometimes they are as richly <span data-glossary-definition=\"sheer, translucent\" role=\"link\" tabindex=\"0\">diaphanous</span> as a precious stone, and glow from within with a deep, inexplicable light. Sometimes the white intricacies of dropping foam become opaque and creamy. And always there are the rainbows. If you come suddenly upon the Falls from above, a great double rainbow, very vivid, spanning the extent of spray from top to bottom, is the first thing you see. If you wander along the cliff opposite, a bow springs into being in the American Falls, accompanies you courteously on your walk, dwindles and dies as the mist ends, and awakens again as you reach the Canadian tumult. And the bold traveller who attempts the trip under the American Falls sees, when he dare open his eyes to anything, tiny baby rainbows, some four or five yards in span, leaping from rock to rock among the foam, and gambolling beside him, barely out of hand’s reach, as he goes. One I saw in that place was a complete circle, such as I have never seen before, and so near that I could put my foot on it. It is a terrifying journey, beneath and behind the Falls. The senses are battered and bewildered by the thunder of the water and the assault of wind and spray; or rather, the sound is not of falling water, but merely of falling; a noise of unspecified ruin. So, if you are close behind the endless clamour, the sight cannot recognise liquid in the masses that hurl past. You are dimly and pitifully aware that sheets of light and darkness are falling in great curves in front of you. Dull omnipresent foam washes the face. Farther away, in the roar and hissing, clouds of spray seem literally to slide down some invisible plane of air.</p><p>Beyond the foot of the Falls the river is like a slipping floor of marble, green with veins of dirty white, made by the scum that was foam. It slides very quietly and slowly down for a mile or two, sullenly exhausted. Then it turns to a dull sage green, and hurries more swiftly, smooth and ominous. As the walls of the ravine close in, trouble stirs, and the waters boil and eddy. These are the lower rapids, a sight more terrifying than the Falls, because less intelligible. Close in its bands of rock the river surges tumultuously forward, writhing and leaping as if inspired by a demon. It is pressed by the straits into a visibly convex form. Great planes of water slide past. Sometimes it is thrown up into a pinnacle of foam higher than a house, or leaps with incredible speed from the crest of one vast wave to another, along the shining curve between, like the spring of a wild beast. Its motion continually suggests muscular action. The power manifest in these rapids moves one with a different sense of awe and terror from that of the Falls. Here the inhuman life and strength are spontaneous, active, almost resolute. . . . A place of fear. One is drawn back, strangely, to a contemplation of the Falls, at every hour, and especially by night, when the cloud of spray becomes an immense visible ghost, straining and wavering high above the river, white and pathetic and translucent. The Victorian lies very close below the surface in every man. There one can sit and let great cloudy thoughts of destiny and the passage of empires drift through the mind; for such dreams are at home by Niagara. I could not get out of my mind the thought of a friend, who said that the rainbows over the Falls were like the arts and beauty and goodness, with regard to the stream of life—caused by it, thrown upon its spray, but unable to stay or direct or affect it, and ceasing when it ceased. In all comparisons that rise in the heart, the river, with its multitudinous waves and its single current, likens itself to a life, whether of an individual or of a community. A man’s life is of many flashing moments, and yet one stream; a nation’s flows through all its citizens, and yet is more than they. In such places, one is aware, with an almost insupportable and yet comforting certitude, that both men and nations are hurried onwards to their ruin or ending as inevitably as this dark flood. Some go down to it unreluctant, and meet it, like the river, not without nobility. And as incessant, as inevitable, and as unavailing as the spray that hangs over the Falls, is the white cloud of human crying. . . . With some such thoughts does the <span data-glossary-definition=\"clichéd, common\" role=\"link\" tabindex=\"0\">platitudinous</span><sup>2</sup> heart win from the confusion and thunder of a Niagara peace that the quietest plains or most stable hills can never give.</p>",
    sourceNote: "From LETTERS FROM AMERICA by Rupert Brooke—Public Domain",
    text: excerptFromNiagaraFalls20182019FormBPassageText,
    versionLabel: "2018-2019 Form B",
  }),
  questions: excerptFromNiagaraFalls20182019FormBQuestions,
};
