import type { PracticeQuestion } from "../../types";

export const authorsPointOfViewEasyQuestions: PracticeQuestion[] = [
  {
    id: "pov-easy-1",
    difficulty: "easy",
    stimulus: "Our city should add protected bike lanes. They make streets safer for riders and encourage people to choose a cleaner form of transportation.",
    prompt: "What is the author's point of view?",
    choices: [
      { id: "A", text: "Bike lanes are too expensive to maintain." },
      { id: "B", text: "Protected bike lanes would benefit the city." },
      { id: "C", text: "Cars should be removed from every street." },
      { id: "D", text: "Most people dislike riding bicycles." },
    ],
    correctChoiceId: "B",
    explanation: "The author directly argues that protected bike lanes improve safety and transportation.",
  },
  {
    id: "pov-easy-2",
    difficulty: "easy",
    stimulus: "The new playground may be smaller, but its shaded benches, accessible ramps, and imaginative climbing wall make it a welcome improvement.",
    prompt: "How does the author view the new playground?",
    choices: [
      { id: "A", text: "Mostly positively" },
      { id: "B", text: "Completely negatively" },
      { id: "C", text: "With confusion" },
      { id: "D", text: "With no clear opinion" },
    ],
    correctChoiceId: "A",
    explanation: "The phrase 'welcome improvement' and the list of benefits reveal a positive view.",
  },
  {
    id: "pov-easy-3",
    difficulty: "easy",
    stimulus: `Marcus stepped onto the stage, blinking at the bright lights. The theater was full, yet he could sense the silence was heavier than usual. He played with a tightness in his jaw, his notes sharper than they had been in rehearsals. Each mistake seemed louder, every hesitation more obvious. He knew this would be his last concert before deafness ended his career.

As the music continued, Marcus glanced at the conductor. The timing was off. He tried to adjust, but the orchestra felt distant, almost out of reach. He remembered all the concerts he had given before, but tonight he struggled to feel the same connection. Sweat dripped onto the keys. The melody wavered.

The audience gave a standing ovation, but Marcus only nodded. Backstage, he removed his hearing aid and sat quietly, listening to the muffled sounds of applause fading away. A stagehand asked if he wanted to say anything to the crowd. Marcus just shrugged, watching the empty piano bench under the harsh glare of the lights.`,
    prompt: "Which statement best reflects the author's attitude toward the subject?",
    choices: [
      { id: "A", text: "sympathetic toward Marcus's struggle, emphasizing his perseverance and courage in the face of loss." },
      { id: "B", text: "critical of Marcus's final performance, highlighting the imperfections and awkward moments on stage." },
      { id: "C", text: "neutral, simply reporting the events as they happened without judgment or opinion." },
      { id: "D", text: "nostalgic for Marcus's earlier performances, focusing on memories of the past concerts." },
    ],
    correctChoiceId: "B",
    explanation: "The question asks for the author's attitude about Marcus's experience. The author focuses on Marcus's mistakes and struggles during his last concert, showing a critical tone about the performance. The author describes how each mistake \"seemed louder, every hesitation more obvious,\" and notes that \"the orchestra felt distant, almost out of reach.\" Even as the audience applauds, Marcus \"just shrugged,\" hinting at disappointment and a sense of things not going right. The focus on \"the tightness in his jaw,\" \"sweat dripped onto the keys,\" and the \"melody wavered\" shows attention to awkward and imperfect moments, supporting criticism rather than admiration or nostalgia. So the answer is critical of Marcus's final performance, highlighting the imperfections and awkward moments on stage.",
    incorrectChoiceExplanations: {
      A: "The passage does not emphasize Marcus's perseverance or courage—they highlight his mistakes and challenges.",
      C: "The writing is not neutral—the word choices express disappointment and struggle, not a simple report of facts.",
      D: "The author briefly mentions Marcus thinking about previous concerts, but most details focus on this difficult final performance, not on nostalgia for the past.",
    },
  },
];
