import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheSpiritOfTheHerd20262027FormAPassageText = "Along with the wagon had come the fresh horses—one of them being Peroxide Jim, a supple, powerful, clean-limbed buckskin, a horse, I think, that had as fine and intelligent an animal-face as any creature I ever saw. Wade had been saving this horse for emergency work. And why should he not have been saved fresh for just such a need as this? Are there not superior horses as well as superior men—a Peroxide Jim to complement a Wade?\nThe horse knew the cattle business and knew his rider perfectly; and though there was nothing like sentiment about the boss of the P Ranch riders, his faith in Peroxide Jim was complete. . . .\nThe desert, where the herd was camped, was one of the highest of a series of tablelands, or benches; it lay as level as a floor, rimmed by sheer rock, from which there was a drop to the bench of sage below. The herd when overtaken by the dusk had been headed for a pass descending to the next lower bench, but was now halted within a mile of the rim rock on the east, where there was a perpendicular fall of about three hundred feet. . . .\nIn the taut silence of the stirless desert night, with the tension of the herd at the snapping-point, any quick, unwonted sight or sound would stampede them. The sneezing of a horse, the flare of a match, would be enough to send the whole four thousand headlong—blind, frenzied, trampling—till spent and scattered over the plain.\nAnd so, as he rode, Wade began to sing. The rider ahead of him took up the air and passed it on until, above the stepping stir of the hoofs rose the faint voices of the men, and all the herd was bound about by the slow plaintive measures of some old song. It was not to soothe their savage breasts that the riders sang to the cattle, but rather to preempt the dreaded silence, to relieve the tension, and so to prevent the shock of any sudden startling noise.\nSo they sang and rode and the night wore on to one o’clock, when Wade, coming up on the rim-rock side, felt a cool breeze fan his face, and caught a breath of fresh, moist wind with the taste of water in it.\nHe checked his horse instantly, listening as the wind swept past him over the cattle. But they must already have smelled it, for they had ceased their milling, the whole herd standing motionless, the indistinct forms close to him in the dark showing their bald faces lifted to drink the sweet wet breath that came over the rim. Then they started on again, but faster, and with a rumbling now from their hoarse throats that tightened Wade’s grip on the reins.\nThe sound seemed to come out of the earth, a low, rumbling mumble, as dark as the night and as wide as the plain, a thick, inarticulate bellow that stood every rider stiff in his stirrups. . . .\nThen the breeze caught the dust and carried it back from the gray-coated, ghostly shapes, and Wade saw that the animals were still moving in a circle. He must keep them going. He touched his horse to ride on with them, when across the black sky flashed a vivid streak of lightning.\nThere was a snort from the steers, a quick clap of horns and hoofs from far within the herd, a tremor of the plain, a roar, a surging mass—and Wade was riding the flank of a wild stampede. Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on, and bearing him on, by the heave of the galloping herd.\nWade was riding for his life. He knew it. His horse knew it. He was riding to turn the herd, too, back from the rim, as the horse also knew. The cattle were after water—water-mad—ready to go over the precipice to get it, carrying horse and rider with them. Wade was the only rider between the herd and the rim. It was black as death. He could see nothing in the sage, could scarcely discern the pounding, panting shadows at his side. He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.\nTo outrun the herd was his only chance for life. If he could come up with the leaders he might not only escape, but even stand a chance of heading them off upon the plain and saving the herd. There were cattle still ahead of him; how many, what part of them all, he could not make out in the dark. But the horse knew. The reins hung on his straight neck, where his rider had dropped them, as, yelling and firing over the wild herd, he had given this horse the race to win, to lose.\nThey were riding the rim. Close on their left bore down the flank of the herd, and on their right, under their very feet, was a precipice, so close that they felt its blackness—its three hundred feet of fall! . . .\n. . . Then Wade found himself racing neck and neck with a big white steer, which the horse, with marvelous instinct, seemed to pick out from a bunch, and to cling to, forcing him gradually ahead, till, cutting him free from the bunch entirely, he bore him off into the swishing sage.\nThe steers coming on close behind followed their leader, and in, after them, swung others. The tide was turning from the rim. More and more were veering, and within a short time the whole herd, bearing off from the cliffs, was pounding over the open plains.\nWhose race was it? It was Peroxide Jim’s, according to Wade, for not by word or by touch of hand or knee had the horse been directed in the run. From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.";

const excerptFromTheSpiritOfTheHerd20262027FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-spirit-of-the-herd-2026-2027-form-a-official-shsat-2026-a-29",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "29"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-25f6cc94193515828d51.png\" alt=\"Official explanation for question 29\">",
    "points": 1,
    "prompt": "Which sentence from the excerpt best explains why Wade reserved Peroxide Jim for “emergency work” (paragraph 1)?",
    "promptHtml": "<p><span>Which</span> <span>sentence</span> from the excerpt <span><strong>best</strong></span> <span>explains</span> <span>why</span> Wade reserved Peroxide Jim for “emergency work” <span>(<span>paragraph</span> 1)?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>“Are there not superior horses as well as superior men—a Peroxide Jim to complement a Wade?” <span>(<span>paragraph</span> 1)</span></p>",
        "text": "“Are there not superior horses as well as superior men—a Peroxide Jim to complement a Wade?” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on, and bearing him on, by the heave of the galloping herd.” <span>(<span>paragraph</span> 10)</span></p>",
        "text": "“Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on, and bearing him on, by the heave of the galloping herd.” (paragraph 10)"
      },
      {
        "id": "C",
        "html": "<p>“He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.” <span>(<span>paragraph</span> 11)</span></p>",
        "text": "“He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.” (paragraph 11)"
      },
      {
        "id": "D",
        "html": "<p>“From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.” <span>(<span>paragraph</span> 16)</span></p>",
        "text": "“From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.” (paragraph 16)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-spirit-of-the-herd-2026-2027-form-a-official-shsat-2026-a-30",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "30"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-e86f0ea80e833112cb39.png\" alt=\"Official explanation for question 30\">",
    "points": 1,
    "prompt": "Paragraphs 1–2 contribute to the development of the central idea of the excerpt by",
    "promptHtml": "<p><span>Paragraphs</span> 1–2 contribute to the development of the central idea of the excerpt by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>revealing the respect Wade had for his horse.</p>",
        "text": "revealing the respect Wade had for his horse."
      },
      {
        "id": "B",
        "html": "<p>emphasizing Wade’s high expectations of his horse and himself.</p>",
        "text": "emphasizing Wade’s high expectations of his horse and himself."
      },
      {
        "id": "C",
        "html": "<p>indicating that Wade and his horse understood the cattle business.</p>",
        "text": "indicating that Wade and his horse understood the cattle business."
      },
      {
        "id": "D",
        "html": "<p>demonstrating Wade’s ability to gauge a horse’s competence.</p>",
        "text": "demonstrating Wade’s ability to gauge a horse’s competence."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-spirit-of-the-herd-2026-2027-form-a-official-shsat-2026-a-31",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "31"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-09020a08ddc253a646cb.png\" alt=\"Official explanation for question 31\">",
    "points": 1,
    "prompt": "How does paragraph 3 convey the effect of the setting on the cattle drive?",
    "promptHtml": "<p><span>How</span> does <span><span>paragraph</span> 3</span> convey the <span>effect</span> of the <span>setting</span> on the cattle drive?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It <span>shows</span> <span>how</span> the growing darkness created challenges for the riders in getting the herd to move.</p>",
        "text": "It shows how the growing darkness created challenges for the riders in getting the herd to move."
      },
      {
        "id": "B",
        "html": "<p>It <span>describes</span> <span>how</span> the changing elevation contributed to the dangerousness of the environment.</p>",
        "text": "It describes how the changing elevation contributed to the dangerousness of the environment."
      },
      {
        "id": "C",
        "html": "<p>It <span>describes</span> <span>how</span> the desert created an uncomfortable feeling of isolation for the riders and the cattle.</p>",
        "text": "It describes how the desert created an uncomfortable feeling of isolation for the riders and the cattle."
      },
      {
        "id": "D",
        "html": "<p>It <span>shows</span> <span>how</span> the steep terrain made it difficult for the cattle to keep moving forward.</p>",
        "text": "It shows how the steep terrain made it difficult for the cattle to keep moving forward."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-spirit-of-the-herd-2026-2027-form-a-official-shsat-2026-a-32",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "32"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-0da676b00f82ce2272e2.png\" alt=\"Official explanation for question 32\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 13.\nClose on their left bore down the flank of the herd, and on their right, under their very feet, was a precipice, so close that they felt its blackness—its three hundred feet of fall!\nThe phrase “bore down the flank of the herd” conveys that Wade",
    "promptHtml": "<p><span>Read</span> this <span>sentence</span> from <span><span>paragraph</span> 13.</span></p> <p data-align=\"indent\"><strong>Close on their left bore down the flank of the herd, and on their right, under their very feet, was a precipice, so close that they felt its <span>blackness—</span>its <span>three hundred</span> feet of fall!</strong></p> <p>The <span>phrase</span> “bore down the flank of the herd” conveys that Wade</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>struggled to see the front of the herd.</p>",
        "text": "struggled to see the front of the herd."
      },
      {
        "id": "B",
        "html": "<p>had to ride quickly to keep up <span>with</span> the herd.</p>",
        "text": "had to ride quickly to keep up with the herd."
      },
      {
        "id": "C",
        "html": "<p>was forced to ride between the edge of the cliff and the herd.</p>",
        "text": "was forced to ride between the edge of the cliff and the herd."
      },
      {
        "id": "D",
        "html": "<p>knew that the drop of the cliff would frighten the herd.</p>",
        "text": "knew that the drop of the cliff would frighten the herd."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-spirit-of-the-herd-2026-2027-form-a-official-shsat-2026-a-33",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "33"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-78cdb104741049ad64dd.png\" alt=\"Official explanation for question 33\">",
    "points": 1,
    "prompt": "Read these sentences from the excerpt.\nHe was riding to turn the herd, too, back from the rim, as the horse also knew. (paragraph 11)\nIt was Peroxide Jim’s, according to Wade, for not by word or by touch of hand or knee had the horse been directed in the run. (paragraph 16)\nHow do these sentences develop a central idea in the excerpt?",
    "promptHtml": "<p><span>Read</span> these <span>sentences</span> from the excerpt.</p> <p data-align=\"indent\"><strong>He was riding to turn the herd, too, back from the rim, as the horse also knew.</strong> <span>(<span>paragraph</span> 11)</span></p> <p data-align=\"indent\"><strong>It was Peroxide Jim’s, according to Wade, for not by word or by touch of hand or knee had the horse been directed in the run. </strong><span>(paragraph 16)</span></p> <p><span>How</span> do these sentences develop a central idea in the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>They suggest that Wade would have been unable to save the herd <span>without</span> Peroxide Jim.</p>",
        "text": "They suggest that Wade would have been unable to save the herd without Peroxide Jim."
      },
      {
        "id": "B",
        "html": "<p>They imply that Wade spent many hours training Peroxide Jim to herd cattle.</p>",
        "text": "They imply that Wade spent many hours training Peroxide Jim to herd cattle."
      },
      {
        "id": "C",
        "html": "<p>They <span>show</span> that Peroxide Jim was able to understand a situation and take <span>action</span>.</p>",
        "text": "They show that Peroxide Jim was able to understand a situation and take action."
      },
      {
        "id": "D",
        "html": "<p>They indicate that Peroxide Jim was unafraid of the dangers presented by the stampede and <span>the cliff.</span></p>",
        "text": "They indicate that Peroxide Jim was unafraid of the dangers presented by the stampede and the cliff."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-spirit-of-the-herd-2026-2027-form-a-official-shsat-2026-a-34",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "34"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-77d0c813eb0c3ce045b2.png\" alt=\"Official explanation for question 34\">",
    "points": 1,
    "prompt": "How do the details in paragraphs 14–16 help convey a central idea of the excerpt?",
    "promptHtml": "<p><span>How</span> do the <span>details</span> in <span><span>paragraphs</span> 14–16</span> <span>help</span> convey a central idea of the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>They highlight Peroxide Jim’s natural ability to control the herd.</p>",
        "text": "They highlight Peroxide Jim’s natural ability to control the herd."
      },
      {
        "id": "B",
        "html": "<p>They emphasize the danger of the situation from <span>which</span> Peroxide Jim rescued the herd.</p>",
        "text": "They emphasize the danger of the situation from which Peroxide Jim rescued the herd."
      },
      {
        "id": "C",
        "html": "<p>They <span>show</span> that Peroxide Jim’s physical strength allowed him to force the herd to <span>turn</span>.</p>",
        "text": "They show that Peroxide Jim’s physical strength allowed him to force the herd to turn."
      },
      {
        "id": "D",
        "html": "<p>They indicate that Peroxide Jim anticipated the herd’s stampede <span>before</span> the men did.</p>",
        "text": "They indicate that Peroxide Jim anticipated the herd’s stampede before the men did."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-spirit-of-the-herd-2026-2027-form-a-official-shsat-2026-a-35",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "35"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-eb7ffe07e603786c486c.png\" alt=\"Official explanation for question 35\">",
    "points": 1,
    "prompt": "Which sentence from the excerpt best reveals the mood on the drive before the lightning struck?",
    "promptHtml": "<p><span>Which</span> <span>sentence</span> from the excerpt <span><strong>best</strong></span> reveals the <span>mood</span> on the drive <span>before</span> the lightning struck?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>“The herd when overtaken by the dusk had been headed for a pass descending to the next lower bench, but was now halted within a mile of the rim rock on the east, where there was a perpendicular fall of about three hundred feet.” <span>(<span>paragraph</span> 3)</span></p>",
        "text": "“The herd when overtaken by the dusk had been headed for a pass descending to the next lower bench, but was now halted within a mile of the rim rock on the east, where there was a perpendicular fall of about three hundred feet.” (paragraph 3)"
      },
      {
        "id": "B",
        "html": "<p>“It was not to soothe their savage breasts that the riders sang to the cattle, but rather to preempt the dreaded silence, to relieve the tension, and so to prevent the shock of any sudden startling noise.” <span>(<span>paragraph</span> 5)</span></p>",
        "text": "“It was not to soothe their savage breasts that the riders sang to the cattle, but rather to preempt the dreaded silence, to relieve the tension, and so to prevent the shock of any sudden startling noise.” (paragraph 5)"
      },
      {
        "id": "C",
        "html": "<p>“He checked his horse instantly, listening as the wind swept past him over the cattle.” <span>(<span>paragraph</span> 7)</span></p>",
        "text": "“He checked his horse instantly, listening as the wind swept past him over the cattle.” (paragraph 7)"
      },
      {
        "id": "D",
        "html": "<p>“Then the breeze caught the dust and carried it back from the gray-coated, ghostly shapes, and Wade saw that the animals were still moving in a circle.” <span>(<span>paragraph</span> 9)</span></p>",
        "text": "“Then the breeze caught the dust and carried it back from the gray-coated, ghostly shapes, and Wade saw that the animals were still moving in a circle.” (paragraph 9)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromTheSpiritOfTheHerd20262027FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-spirit-of-the-herd-2026-2027-form-a",
  versionLabels: ["2026-2027 Form A"],
  section: "reading",
  questionCount: excerptFromTheSpiritOfTheHerd20262027FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-spirit-of-the-herd-2026-2027-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from “The Spirit of the Herd”",
    blurbHtml: "<em>In this excerpt, published in 1914, author and professor Dallas Lore Sharp describes a summer cattle roundup in Oregon. The heat and dust had been relentless for three days. The cowboys were exhausted, and the cattle were restless. The ranch boss, Wade, had led the drive to a watering place, only to find <span>it empty.</span></em>",
    bylineHtml: "by Dallas Lore Sharp",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"A","section":"ELA - Passage Set 5 of 7","packageId":"8b22d7862905bcb9acca0c839f2a92159fd22f10ef3d639cc703e76d3ffc1ee3"},
    title: "Excerpt from “The Spirit of the Herd”",
    author: "Dallas Lore Sharp",
    byline: "by Dallas Lore Sharp",
    blurb: "In this excerpt, published in 1914, author and professor Dallas Lore Sharp describes a summer cattle roundup in Oregon. The heat and dust had been relentless for three days. The cowboys were exhausted, and the cattle were restless. The ranch boss, Wade, had led the drive to a watering place, only to find it empty.",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\"> Along with the wagon had come the fresh <span>horses—</span>one of them being Peroxide Jim, a supple, powerful, clean-limbed buckskin, a horse, I think, that had as fine and intelligent an animal-face as any creature I ever saw. Wade had been saving this horse for emergency work. And why should he not have been saved fresh for just such a need as this? Are there not superior horses as well as superior <span>men—</span>a Peroxide Jim to complement a Wade?</p> <p data-numbered=\"true\"> The horse knew the cattle business and knew his rider perfectly; and though there was nothing like sentiment about the boss of the <span>P Ranch</span> riders, his faith in Peroxide Jim was <span>complete. . . .</span></p> <p data-numbered=\"true\"> The desert, where the herd was camped, was one of the highest of a series of tablelands,&nbsp;or benches; it lay as level as a floor, rimmed by sheer rock, from which there was a drop to the bench of sage below. The herd when overtaken by the dusk had been headed for a pass descending to the next lower bench, but was now halted within a mile of the rim rock on the east, where there was a perpendicular fall of about <span>three hundred</span> <span>feet. . . .</span></p> <p data-numbered=\"true\"> In the taut silence of the stirless desert night, with the tension of the herd at the snapping-point, any quick, unwonted sight or sound would stampede them. The sneezing of a horse, the flare of a match, would be enough to send the whole <span>four thousand</span> <span>headlong—</span>blind, frenzied, <span>trampling—</span>till spent and scattered over the plain.</p> <p data-numbered=\"true\"> And so, as he rode, Wade began to sing. The rider ahead of him took up the air and passed it on until, above the stepping stir of the hoofs rose the faint voices of the men, and all the herd was bound about by the slow plaintive measures of some old song. It was not to soothe their savage breasts that the riders sang to the cattle, but rather to preempt the dreaded silence, to relieve the tension, and so to prevent the shock of any sudden startling noise.</p> <p data-numbered=\"true\"> So they sang and rode and the night wore on to <span>one o’clock,</span> when Wade, coming up on the rim-rock side, felt a cool breeze fan his face, and caught a breath of fresh, moist wind with the taste of water <span>in it.</span></p> <p data-numbered=\"true\"> He checked his horse instantly, listening as the wind swept past him over the cattle. But they must already have smelled it, for they had ceased their milling, the whole herd standing motionless, the indistinct forms close to him in the dark showing their bald faces lifted to drink the sweet wet breath that came over the rim. Then they started on again, but faster, and with a rumbling now from their hoarse throats that tightened Wade’s grip on the reins.</p> <p data-numbered=\"true\"> The sound seemed to come out of the earth, a low, rumbling mumble, as dark as the night and as wide as the plain, a thick, inarticulate bellow that stood every rider stiff in his <span>stirrups. . . .</span></p> <p data-numbered=\"true\"> Then the breeze caught the dust and carried it back from the gray-coated, ghostly shapes, and Wade saw that the animals were still moving in a circle. He must keep them going. He touched his horse to ride on with them, when across the black sky flashed a vivid streak of lightning.</p> <p data-numbered=\"true\"> There was a snort from the steers, a quick clap of horns and hoofs from far within the herd, a tremor of the plain, a roar, a surging <span>mass—</span>and Wade was riding the flank of a wild stampede. Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on, and bearing him on, by the heave of the galloping herd.</p> <p data-numbered=\"true\"> Wade was riding for his life. He knew it. His horse knew it. He was riding to turn the herd, too, back from the rim, as the horse also knew. The cattle were after <span>water—</span><span>water-mad—</span>ready to go over the precipice to get it, carrying horse and rider with them. Wade was the only rider between the herd and the rim. It was black as death. He could see nothing in the sage, could scarcely discern the pounding, panting shadows at his side. He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos&nbsp;and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.</p> <p data-numbered=\"true\"> To outrun the herd was his only chance for life. If he could come up with the leaders he might not only escape, but even stand a chance of heading them off upon the plain and saving the herd. There were cattle still ahead of him; how many, what part of them all, he could not make out in the dark. But the horse knew. The reins hung on his straight neck, where his rider had dropped them, as, yelling and firing over the wild herd, he had given this horse the race to win, to lose.</p> <p data-numbered=\"true\"> They were riding the rim. Close on their left bore down the flank of the herd, and on their right, under their very feet, was a precipice, so close that they felt its <span>blackness—</span>its <span>three hundred</span> feet of <span>fall! . . .</span></p> <p data-numbered=\"true\"> . . . Then Wade found himself racing neck and neck with a big white steer, which the horse, with marvelous instinct, seemed to pick out from a bunch, and to cling to, forcing him gradually ahead, till, cutting him free from the bunch entirely, he bore him off into the swishing sage.</p> <p data-numbered=\"true\"> The steers coming on close behind followed their leader, and in, after them, swung others. The tide was turning from the rim. More and more were veering, and within a short time the whole herd, bearing off from the cliffs, was pounding over the open plains.</p> <p data-numbered=\"true\"> Whose race was it? It was Peroxide Jim’s, according to Wade, for not by word or by touch of hand or knee had the horse been directed in the run. From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.</p>",
    sourceNote: "From “The Spirit of the Herd” by Dallas Lore Sharp—Public Domain",
    text: excerptFromTheSpiritOfTheHerd20262027FormAPassageText,
    versionLabel: "2026-2027 Form A",
  }),
  questions: excerptFromTheSpiritOfTheHerd20262027FormAQuestions,
};
