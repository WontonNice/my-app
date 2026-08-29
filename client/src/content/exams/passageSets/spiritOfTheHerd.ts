import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const spiritOfTheHerdPassageText = "Along with the wagon had come the fresh horses—one of them being Peroxide Jim, a supple, powerful, clean-limbed buckskin, a horse, I think, that had as fine and intelligent an animal-face as any creature I ever saw. Wade had been saving this horse for emergency work. And why should he not have been saved fresh for just such a need as this? Are there not superior horses as well as superior men—a Peroxide Jim to complement a Wade?\n\nThe horse knew the cattle business and knew his rider perfectly; and though there was nothing like sentiment about the boss of the P Ranch riders, his faith in Peroxide Jim was complete. . . .\n\nThe desert, where the herd was camped, was one of the highest of a series of tablelands, or benches; it lay as level as a floor, rimmed by sheer rock, from which there was a drop to the bench of sage below. The herd when overtaken by the dusk had been headed for a pass descending to the next lower bench, but was now halted within a mile of the rim rock on the east, where there was a perpendicular fall of about three hundred feet. . . .\n\nIn the taut silence of the stirless desert night, with the tension of the herd at the snapping-point, any quick, unwonted sight or sound would stampede them. The sneezing of a horse, the flare of a match, would be enough to send the whole four thousand headlong—blind, frenzied, trampling—till spent and scattered over the plain.\n\nAnd so, as he rode, Wade began to sing. The rider ahead of him took up the air and passed it on until, above the stepping stir of the hoofs rose the faint voices of the men, and all the herd was bound about by the slow plaintive measures of some old song. It was not to soothe their savage breasts that the riders sang to the cattle, but rather to preempt the dreaded silence, to relieve the tension, and so to prevent the shock of any sudden startling noise.\n\nSo they sang and rode and the night wore on to one o’clock, when Wade, coming up on the rim-rock side, felt a cool breeze fan his face, and caught a breath of fresh, moist wind with the taste of water in it.\n\nHe checked his horse instantly, listening as the wind swept past him over the cattle. But they must already have smelled it, for they had ceased their milling, the whole herd standing motionless, the indistinct forms close to him in the dark showing their bald faces lifted to drink the sweet wet breath that came over the rim. Then they started on again, but faster, and with a rumbling now from their hoarse throats that tightened Wade’s grip on the reins.\n\nThe sound seemed to come out of the earth, a low, rumbling mumble, as dark as the night and as wide as the plain, a thick, inarticulate bellow that stood every rider stiff in his stirrups. . . .\n\nThen the breeze caught the dust and carried it back from the gray-coated, ghostly shapes, and Wade saw that the animals were still moving in a circle. He must keep them going. He touched his horse to ride on with them, when across the black sky flashed a vivid streak of lightning.\n\nThere was a snort from the steers, a quick clap of horns and hoofs from far within the herd, a tremor of the plain, a roar, a surging mass—and Wade was riding the flank of a wild stampede. Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on, and bearing him on, by the heave of the galloping herd.\n\nWade was riding for his life. He knew it. His horse knew it. He was riding to turn the herd, too, back from the rim, as the horse also knew. The cattle were after water—water-mad—ready to go over the precipice to get it, carrying horse and rider with them. Wade was the only rider between the herd and the rim. It was black as death. He could see nothing in the sage, could scarcely discern the pounding, panting shadows at his side. He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.\n\nTo outrun the herd was his only chance for life. If he could come up with the leaders he might not only escape, but even stand a chance of heading them off upon the plain and saving the herd. There were cattle still ahead of him; how many, what part of them all, he could not make out in the dark. But the horse knew. The reins hung on his straight neck, where his rider had dropped them, as, yelling and firing over the wild herd, he had given this horse the race to win, to lose.\n\nThey were riding the rim. Close on their left bore down the flank of the herd, and on their right, under their very feet, was a precipice, so close that they felt its blackness—its three hundred feet of fall! . . .\n\n. . . Then Wade found himself racing neck and neck with a big white steer, which the horse, with marvelous instinct, seemed to pick out from a bunch, and to cling to, forcing him gradually ahead, till, cutting him free from the bunch entirely, he bore him off into the swishing sage.\n\nThe steers coming on close behind followed their leader, and in, after them, swung others. The tide was turning from the rim. More and more were veering, and within a short time the whole herd, bearing off from the cliffs, was pounding over the open plains.\n\nWhose race was it? It was Peroxide Jim’s, according to Wade, for not by word or by touch of hand or knee had the horse been directed in the run. From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.";

const spiritOfTheHerdQuestions: ExamQuestion[] = [
  {
    "id": "spirit-herd-1",
    "points": 1,
    "prompt": "Which sentence from the excerpt best explains why Wade reserved Peroxide Jim for “emergency work” (paragraph 1)?",
    "promptHtml": "Which sentence from the excerpt <strong>best</strong> explains why Wade reserved Peroxide Jim for “emergency work” (paragraph 1)?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“Are there not superior horses as well as superior men—a Peroxide Jim to complement a Wade?” (paragraph 1)",
        "text": "“Are there not superior horses as well as superior men—a Peroxide Jim to complement a Wade?” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "“Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on, and bearing him on, by the heave of the galloping herd.” (paragraph 10)",
        "text": "“Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on, and bearing him on, by the heave of the galloping herd.” (paragraph 10)"
      },
      {
        "id": "C",
        "html": "“He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.” (paragraph 11)",
        "text": "“He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.” (paragraph 11)"
      },
      {
        "id": "D",
        "html": "“From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.” (paragraph 16)",
        "text": "“From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.” (paragraph 16)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "spirit-herd-2",
    "points": 1,
    "prompt": "Paragraphs 1–2 contribute to the development of the central idea of the excerpt by",
    "promptHtml": "Paragraphs 1–2 contribute to the development of the central idea of the excerpt by",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "revealing the respect Wade had for his horse.",
        "text": "revealing the respect Wade had for his horse."
      },
      {
        "id": "B",
        "html": "emphasizing Wade’s high expectations of his horse and himself.",
        "text": "emphasizing Wade’s high expectations of his horse and himself."
      },
      {
        "id": "C",
        "html": "indicating that Wade and his horse understood the cattle business.",
        "text": "indicating that Wade and his horse understood the cattle business."
      },
      {
        "id": "D",
        "html": "demonstrating Wade’s ability to gauge a horse’s competence.",
        "text": "demonstrating Wade’s ability to gauge a horse’s competence."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "spirit-herd-3",
    "points": 1,
    "prompt": "How does paragraph 3 convey the effect of the setting on the cattle drive?",
    "promptHtml": "How does paragraph 3 convey the effect of the setting on the cattle drive?",
    "topic": "Vocabulary in Context",
    "choices": [
      {
        "id": "A",
        "html": "It shows how the growing darkness created challenges for the riders in getting the herd to move.",
        "text": "It shows how the growing darkness created challenges for the riders in getting the herd to move."
      },
      {
        "id": "B",
        "html": "It describes how the changing elevation contributed to the dangerousness of the environment.",
        "text": "It describes how the changing elevation contributed to the dangerousness of the environment."
      },
      {
        "id": "C",
        "html": "It describes how the desert created an uncomfortable feeling of isolation for the riders and the cattle.",
        "text": "It describes how the desert created an uncomfortable feeling of isolation for the riders and the cattle."
      },
      {
        "id": "D",
        "html": "It shows how the steep terrain made it difficult for the cattle to keep moving forward.",
        "text": "It shows how the steep terrain made it difficult for the cattle to keep moving forward."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "spirit-herd-4",
    "points": 1,
    "prompt": "How does paragraph 9 fit into the overall structure of the excerpt?",
    "promptHtml": "How does paragraph 9 fit into the overall structure of the excerpt?",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "It hints at the change in the setting that caused Wade to suddenly become alert.",
        "text": "It hints at the change in the setting that caused Wade to suddenly become alert."
      },
      {
        "id": "B",
        "html": "It creates a false sense of calm that shows how unprepared the men were for what was about to happen.",
        "text": "It creates a false sense of calm that shows how unprepared the men were for what was about to happen."
      },
      {
        "id": "C",
        "html": "It introduces the idea that Wade was a skillful leader in unpredictable circumstances.",
        "text": "It introduces the idea that Wade was a skillful leader in unpredictable circumstances."
      },
      {
        "id": "D",
        "html": "It presents the incident that caused the main conflict Wade and Peroxide Jim addressed.",
        "text": "It presents the incident that caused the main conflict Wade and Peroxide Jim addressed."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "spirit-of-the-herd-5",
    "points": 1,
    "prompt": "Read this sentence from paragraph 13.\n\nClose on their left bore down the flank of the herd, and on their right, under their very feet, was a precipice, so close that they felt its blackness—its three hundred feet of fall!\n\nThe phrase “bore down the flank of the herd” conveys that Wade",
    "promptHtml": "Read this sentence from paragraph 13.<br><strong>Close on their left bore down the flank of the herd, and on their right, under their very feet, was a precipice, so close that they felt its blackness—its three hundred feet of fall!</strong><br>The phrase “bore down the flank of the herd” conveys that Wade",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "struggled to see the front of the herd.",
        "text": "struggled to see the front of the herd."
      },
      {
        "id": "B",
        "html": "had to ride quickly to keep up with the herd.",
        "text": "had to ride quickly to keep up with the herd."
      },
      {
        "id": "C",
        "html": "was forced to ride between the edge of the cliff and the herd.",
        "text": "was forced to ride between the edge of the cliff and the herd."
      },
      {
        "id": "D",
        "html": "knew that the drop of the cliff would frighten the herd.",
        "text": "knew that the drop of the cliff would frighten the herd."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "spirit-of-the-herd-6",
    "points": 1,
    "prompt": "Read these sentences from the excerpt.\n\nHe was riding to turn the herd, too, back from the rim, as the horse also knew. (paragraph 11)\n\nIt was Peroxide Jim’s, according to Wade, for not by word or by touch of hand or knee had the horse been directed in the run. (paragraph 16)\n\nHow do these sentences develop a central idea in the excerpt?",
    "promptHtml": "Read these sentences from the excerpt.<br><strong>He was riding to turn the herd, too, back from the rim, as the horse also knew.</strong> (paragraph 11)<br><strong>It was Peroxide Jim’s, according to Wade, for not by word or by touch of hand or knee had the horse been directed in the run. </strong>(paragraph 16)<br>How do these sentences develop a central idea in the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "They suggest that Wade would have been unable to save the herd without Peroxide Jim.",
        "text": "They suggest that Wade would have been unable to save the herd without Peroxide Jim."
      },
      {
        "id": "B",
        "html": "They imply that Wade spent many hours training Peroxide Jim to herd cattle.",
        "text": "They imply that Wade spent many hours training Peroxide Jim to herd cattle."
      },
      {
        "id": "C",
        "html": "They show that Peroxide Jim was able to understand a situation and take action.",
        "text": "They show that Peroxide Jim was able to understand a situation and take action."
      },
      {
        "id": "D",
        "html": "They indicate that Peroxide Jim was unafraid of the dangers presented by the stampede and the cliff.",
        "text": "They indicate that Peroxide Jim was unafraid of the dangers presented by the stampede and the cliff."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "spirit-of-the-herd-7",
    "points": 1,
    "prompt": "How do the details in paragraphs 14–16 help convey a central idea of the excerpt?",
    "promptHtml": "How do the details in paragraphs 14–16 help convey a central idea of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "They highlight Peroxide Jim’s natural ability to control the herd.",
        "text": "They highlight Peroxide Jim’s natural ability to control the herd."
      },
      {
        "id": "B",
        "html": "They emphasize the danger of the situation from which Peroxide Jim rescued the herd.",
        "text": "They emphasize the danger of the situation from which Peroxide Jim rescued the herd."
      },
      {
        "id": "C",
        "html": "They show that Peroxide Jim’s physical strength allowed him to force the herd to turn.",
        "text": "They show that Peroxide Jim’s physical strength allowed him to force the herd to turn."
      },
      {
        "id": "D",
        "html": "They indicate that Peroxide Jim anticipated the herd’s stampede before the men did.",
        "text": "They indicate that Peroxide Jim anticipated the herd’s stampede before the men did."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "spirit-of-the-herd-8",
    "points": 1,
    "prompt": "Which sentence from the excerpt best reveals the mood on the drive before the lightning struck?",
    "promptHtml": "Which sentence from the excerpt <strong>best</strong> reveals the mood on the drive before the lightning struck?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "“The herd when overtaken by the dusk had been headed for a pass descending to the next lower bench, but was now halted within a mile of the rim rock on the east, where there was a perpendicular fall of about three hundred feet.” (paragraph 3)",
        "text": "“The herd when overtaken by the dusk had been headed for a pass descending to the next lower bench, but was now halted within a mile of the rim rock on the east, where there was a perpendicular fall of about three hundred feet.” (paragraph 3)"
      },
      {
        "id": "B",
        "html": "“It was not to soothe their savage breasts that the riders sang to the cattle, but rather to preempt the dreaded silence, to relieve the tension, and so to prevent the shock of any sudden startling noise.” (paragraph 5)",
        "text": "“It was not to soothe their savage breasts that the riders sang to the cattle, but rather to preempt the dreaded silence, to relieve the tension, and so to prevent the shock of any sudden startling noise.” (paragraph 5)"
      },
      {
        "id": "C",
        "html": "“He checked his horse instantly, listening as the wind swept past him over the cattle.” (paragraph 7)",
        "text": "“He checked his horse instantly, listening as the wind swept past him over the cattle.” (paragraph 7)"
      },
      {
        "id": "D",
        "html": "“Then the breeze caught the dust and carried it back from the gray-coated, ghostly shapes, and Wade saw that the animals were still moving in a circle.” (paragraph 9)",
        "text": "“Then the breeze caught the dust and carried it back from the gray-coated, ghostly shapes, and Wade saw that the animals were still moving in a circle.” (paragraph 9)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const spiritOfTheHerdPassageSet: ExamPassageSet = {
  id: "spirit-of-the-herd",
  questionCount: spiritOfTheHerdQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. As needed, you may use the online notepad tool or write on scrap paper to take notes. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "spirit-of-the-herd",
    passageType: "literary",
    title: "Excerpt from \"The Spirit of the Herd\"",
    author: "Dallas Lore Sharp",
    blurb: "In this excerpt, published in 1914, author and professor Dallas Lore Sharp describes a summer cattle roundup in Oregon. The heat and dust had been relentless for three days. The cowboys were exhausted, and the cattle were restless. The ranch boss, Wade, had led the drive to a watering place, only to find it empty.",
    richText: "<p>Along with the wagon had come the fresh horses—one of them being Peroxide Jim, a supple, powerful, clean-limbed buckskin, a horse, I think, that had as fine and intelligent an animal-face as any creature I ever saw. Wade had been saving this horse for emergency work. And why should he not have been saved fresh for just such a need as this? Are there not superior horses as well as superior men—a Peroxide Jim to complement a Wade?</p><p>The horse knew the cattle business and knew his rider perfectly; and though there was nothing like sentiment about the boss of the P Ranch riders, his faith in Peroxide Jim was complete. . . .</p><p>The desert, where the herd was camped, was one of the highest of a series of tablelands, or benches; it lay as level as a floor, rimmed by sheer rock, from which there was a drop to the bench of sage below. The herd when overtaken by the dusk had been headed for a pass descending to the next lower bench, but was now halted within a mile of the rim rock on the east, where there was a perpendicular fall of about three hundred feet. . . .</p><p>In the taut silence of the stirless desert night, with the tension of the herd at the snapping-point, any quick, unwonted sight or sound would stampede them. The sneezing of a horse, the flare of a match, would be enough to send the whole four thousand headlong—blind, frenzied, trampling—till spent and scattered over the plain.</p><p>And so, as he rode, Wade began to sing. The rider ahead of him took up the air and passed it on until, above the stepping stir of the hoofs rose the faint voices of the men, and all the herd was bound about by the slow plaintive measures of some old song. It was not to soothe their savage breasts that the riders sang to the cattle, but rather to preempt the dreaded silence, to relieve the tension, and so to prevent the shock of any sudden startling noise.</p><p>So they sang and rode and the night wore on to one o’clock, when Wade, coming up on the rim-rock side, felt a cool breeze fan his face, and caught a breath of fresh, moist wind with the taste of water in it.</p><p>He checked his horse instantly, listening as the wind swept past him over the cattle. But they must already have smelled it, for they had ceased their milling, the whole herd standing motionless, the indistinct forms close to him in the dark showing their bald faces lifted to drink the sweet wet breath that came over the rim. Then they started on again, but faster, and with a rumbling now from their hoarse throats that tightened Wade’s grip on the reins.</p><p>The sound seemed to come out of the earth, a low, rumbling mumble, as dark as the night and as wide as the plain, a thick, inarticulate bellow that stood every rider stiff in his stirrups. . . .</p><p>Then the breeze caught the dust and carried it back from the gray-coated, ghostly shapes, and Wade saw that the animals were still moving in a circle. He must keep them going. He touched his horse to ride on with them, when across the black sky flashed a vivid streak of lightning.</p><p>There was a snort from the steers, a quick clap of horns and hoofs from far within the herd, a tremor of the plain, a roar, a surging mass—and Wade was riding the flank of a wild stampede. Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on, and bearing him on, by the heave of the galloping herd.</p><p>Wade was riding for his life. He knew it. His horse knew it. He was riding to turn the herd, too, back from the rim, as the horse also knew. The cattle were after water—water-mad—ready to go over the precipice to get it, carrying horse and rider with them. Wade was the only rider between the herd and the rim. It was black as death. He could see nothing in the sage, could scarcely discern the pounding, panting shadows at his side. He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.</p><p>To outrun the herd was his only chance for life. If he could come up with the leaders he might not only escape, but even stand a chance of heading them off upon the plain and saving the herd. There were cattle still ahead of him; how many, what part of them all, he could not make out in the dark. But the horse knew. The reins hung on his straight neck, where his rider had dropped them, as, yelling and firing over the wild herd, he had given this horse the race to win, to lose.</p><p>They were riding the rim. Close on their left bore down the flank of the herd, and on their right, under their very feet, was a precipice, so close that they felt its blackness—its three hundred feet of fall! . . .</p><p>. . . Then Wade found himself racing neck and neck with a big white steer, which the horse, with marvelous instinct, seemed to pick out from a bunch, and to cling to, forcing him gradually ahead, till, cutting him free from the bunch entirely, he bore him off into the swishing sage.</p><p>The steers coming on close behind followed their leader, and in, after them, swung others. The tide was turning from the rim. More and more were veering, and within a short time the whole herd, bearing off from the cliffs, was pounding over the open plains.</p><p>Whose race was it? It was Peroxide Jim’s, according to Wade, for not by word or by touch of hand or knee had the horse been directed in the run. From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.</p>",
    sourceNote: "From “The Spirit of the Herd” by Dallas Lore Sharp—Public Domain",
    text: spiritOfTheHerdPassageText,
  }),
  questions: spiritOfTheHerdQuestions,
};
