import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const spiritOfTheHerdHeader =
  "In this excerpt, published in 1914, author and professor Dallas Lore Sharp describes a summer cattle roundup in Oregon. The heat and dust had been relentless for three days. The cowboys were exhausted, and the cattle were restless. The ranch boss, Wade, had led the drive to a watering place, only to find it empty.";

const spiritOfTheHerdPassageText = `
Along with the wagon had come the fresh horses, one of them being Peroxide Jim, a supple, powerful, clean-limbed buckskin, a horse, I think, that had as fine and intelligent an animal-face as any creature I ever saw. Wade had been saving this horse for emergency work. And why should he not have been saved fresh for just such a need as this? Are there not superior horses as well as superior men, a Peroxide Jim to complement a Wade?

The horse knew the cattle business and knew his rider perfectly, and though there was nothing like sentiment about the boss of the P Ranch riders, his faith in Peroxide Jim was complete. He had watched the horse in hard places before, when a sudden turn or a burst of speed had meant the difference between order and disaster.

The herd had found no water and had begun to mill in the dust. The cattle pressed close, their sides heaving, their horns tossing above the gray cloud they had trampled from the earth. A weaker horse might have been swallowed in the crush or turned aside by the weight of the moving mass.

Wade swung himself into the saddle and gave Peroxide Jim his head. The buckskin went forward as if the confusion had a path through it that only he could see. Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on and bearing him on, by the heave of the galloping herd.

He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks. Still the horse kept his feet, answered the bit, and held the line Wade asked of him.

From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear. When the dust lifted, Wade loosened the reins, and Peroxide Jim stood trembling but steady, as if he understood exactly what he had done.
`;

const spiritOfTheHerdQuestions: ExamQuestion[] = [
  {
    id: "spirit-herd-1",
    topic: "Supporting Evidence",
    type: "multiple_choice",
    prompt:
      "Which sentence from the excerpt **best** explains why Wade reserved Peroxide Jim for \"emergency work\" (paragraph 1)?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      {
        id: "A",
        text: "\"Are there not superior horses as well as superior men, a Peroxide Jim to complement a Wade?\" (paragraph 1)",
      },
      {
        id: "B",
        text: "\"Before him, behind him, beside him, pressing hard upon his horse, galloped the frenzied steers, and beyond them a multitude borne on and bearing him on, by the heave of the galloping herd.\" (paragraph 4)",
      },
      {
        id: "C",
        text: "\"He knew that he was being borne toward the rim, how fast he could not tell, but he knew by the swish of the brush against his tapaderos and the plunging of the horse that the ground was growing stonier, that they were nearing the rocks.\" (paragraph 5)",
      },
      {
        id: "D",
        text: "\"From the flash of the lightning the horse had taken the bit, had covered an indescribably perilous path at top speed, had outrun the herd and turned it from the edge of the rim rock, without a false step or a tremor of fear.\" (paragraph 6)",
      },
    ],
  },
  {
    id: "spirit-herd-2",
    topic: "Inference",
    type: "multiple_choice",
    prompt: "Which detail best shows that Peroxide Jim understands the work expected of him?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "He arrives with the wagon and the fresh horses." },
      { id: "B", text: "He moves through the confused herd as if he can find a path." },
      { id: "C", text: "He stands still after the dust has lifted." },
      { id: "D", text: "He is described as a clean-limbed buckskin." },
    ],
  },
  {
    id: "spirit-herd-3",
    topic: "Vocabulary in Context",
    type: "multiple_choice",
    prompt: "As used in paragraph 3, the word crush most nearly means",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "a sudden feeling of admiration." },
      { id: "B", text: "a tool used to hold cattle still." },
      { id: "C", text: "a dangerous crowd pressing together." },
      { id: "D", text: "a loud sound made by rocks." },
    ],
  },
  {
    id: "spirit-herd-4",
    topic: "Character & Relationships",
    type: "multiple_choice",
    prompt: "Which statement best describes the relationship between Wade and Peroxide Jim?",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "They rely on each other during a dangerous task." },
      { id: "B", text: "They compete to control the cattle." },
      { id: "C", text: "They are both frightened by the other horses." },
      { id: "D", text: "They avoid difficult work until the herd calms down." },
    ],
  },
];

export const spiritOfTheHerdPassageSet: ExamPassageSet = {
  id: "spirit-of-the-herd",
  questionCount: spiritOfTheHerdQuestions.length,
  directions: {
    subject: "English Language Arts",
    title: "READING COMPREHENSION",
    breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
    body:
      "Read each text and answer the related questions. As needed, you may use the online notepad tool or write on scrap paper to take notes. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question. Base your answers only on the content within the text.",
  },
  passage: createProsePassage({
    author: "Dallas Lore Sharp",
    header: spiritOfTheHerdHeader,
    id: "spirit-of-the-herd",
    sourceNote: "\"The Spirit of the Herd\" by Dallas Lore Sharp",
    text: spiritOfTheHerdPassageText,
    title: "Excerpt from \"The Spirit of the Herd\"",
  }),
  questions: spiritOfTheHerdQuestions,
};
