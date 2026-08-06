import type { PracticeQuestion } from "../../types";

export const centralIdeaThemeMediumQuestions: PracticeQuestion[] = [
  {
    id: "central-medium-1",
    difficulty: "medium",
    stimulus: `The empty lot on Alder Street had been a patch of wildness for as long as anyone could remember. In summer, it sprouted tall weeds and the occasional burst of goldenrod. Sometimes, a soccer ball sailed in from the curb, lost until a brave kid went digging through nettles. Old Mrs. Lopez said she once saw a fox dart through at dawn.

When construction crews finally arrived, neighbors watched from their porches. The city posted signs announcing a new community garden, with bright sketches of benches and flower beds. Some cheered, eager for a place to plant tomatoes. Others hesitated, recalling the quiet mornings when the lot belonged to sparrows and dandelions. The first shovels brought a whiff of change, both welcome and uneasy.

By midsummer, raised beds lined the paths, and sunflowers stood taller than the fence. The garden became a meeting spot: teens played chess under the pergola, while toddlers chased each other around the compost bins. But the lot’s familiar wildness was gone, and so were the fox and the bursts of goldenrod. The new garden drew more people into the neighborhood, but parking became tight, and the alley behind the fence grew noisy at night.

Some families joined the garden’s planning committee, debating how to share plots and water. Others drifted away, missing the old shortcuts and the hush that used to settle after rain. One afternoon, Mr. Patel stood at the corner, watching a group of strangers photograph the sunflowers. He waved, uncertain whether to feel proud or left out, and wondered what the lot would become next spring.`,
    prompt: "Which choice best states the main point the author makes in this passage?",
    choices: [
      { id: "A", text: "Turning a vacant lot into a community garden created a gathering place, offering new opportunities for neighbors to meet and socialize." },
      { id: "B", text: "Progress in a community can bring unexpected drawbacks, as improvements to a neighborhood may benefit some while creating new problems or losses for others." },
      { id: "C", text: "Children now play where weeds once grew, reflecting how a once-forgotten lot has become a lively center of neighborhood activity." },
      { id: "D", text: "All change in urban neighborhoods brings harm to everyone involved, leaving residents worse off despite improvements to public spaces." },
    ],
    correctChoiceId: "B",
    explanation: "This question asks you to identify the main point the author makes about change in the community. The best answer recognizes that although the new garden brings positive changes, it also leads to complicated feelings and some losses. The passage describes both gains and challenges as the lot transforms, showing that progress affects neighbors in different ways. - The passage describes the lot first as a wild, natural area enjoyed by some neighbors and wildlife. - When the garden is built, it creates a new gathering place for the community, but also brings new problems: the loss of wildness, tighter parking, and more noise. - Some people join the new activities, while others miss the old quiet and familiar paths. - The final lines focus on mixed emotions, as Mr. Patel feels both proud and left out, showing that not everyone benefits in the same way. So the answer is Progress in a community can bring unexpected drawbacks, as improvements to a neighborhood may benefit some while creating new problems or losses for others.",
    incorrectChoiceExplanations: {
      A: "This choice only mentions the positive aspect (a new gathering place) and ignores the people who feel uneasy or left out by the change.",
      C: "This choice focuses on children playing and increased activity, missing the main theme about mixed reactions and loss.",
      D: "This choice is incorrect because the passage does not say that everyone is harmed or left worse off; instead, it shows both benefits and drawbacks.",
    },
  },
  {
    id: "central-medium-2",
    difficulty: "medium",
    stimulus: `A pale candle flickered in a chilly workshop as a craftsman carved lines into a block of wood. Each careful cut would soon become part of an image—one that would travel farther than the artist himself ever would. In fifteenth-century Europe, before the invention of the printing press, such woodcuts and engravings made it possible for pictures and ideas to cross borders, carried in the hands of merchants or slipped between the pages of letters.

These early prints did more than record events; they shaped what people remembered. For example, a single depiction of a dramatic religious procession in one city might be recreated by artists in distant towns, changing colors, faces, or details with each new copy. Before long, the memory of the event was less about what actually happened and more about what was shown in the widely shared image. In this way, printmaking turned memory into something collective yet unstable, altered with every retelling.

Some woodcuts, such as those produced in the busy Venetian workshops, featured images of rulers or maps of legendary battles. Although these prints aimed to document history, they often blended fact with rumor. As prints spread from city to city, their stories shifted, sometimes making heroes out of ordinary people or inventing details that would stick in people's minds for generations. Looking back, historians find it difficult to separate actual events from the legacy of these images.

As the carved block is inked and pressed onto paper, the lines blur just slightly, never producing the same picture twice. Memory, too, is printed and reprinted, never quite as clear as the original moment, always shaped by those who choose which parts to show.`,
    prompt: "Which choice best states the main point the author makes in this passage?",
    choices: [
      { id: "A", text: "Early printmaking changed how one city’s religious events were remembered, reshaping stories through repeated copying." },
      { id: "B", text: "Printmaking enabled people to share and reshape memories, changing how the past was recalled." },
      { id: "C", text: "All European history became dependent on printmaking, which determined everything remembered about the past." },
      { id: "D", text: "Techniques like woodcuts in Venice preserved specific images, making technical skill the main influence on memory." },
    ],
    correctChoiceId: "B",
    explanation: "This question asks for the main point of the passage about early printmaking. The author explains how printmaking helped spread images and ideas—but also changed how people remembered events. The main idea is that sharing prints let people reshape and sometimes distort memories of the past. The passage shows that woodcuts and engravings spread widely, letting “ideas cross borders, carried in the hands of merchants.” It explains that these prints “shaped what people remembered,” and that memory of events could become “less about what actually happened and more about what was shown in the widely shared image.” The last paragraph connects printmaking directly to memory, saying, “Memory, too, is printed and reprinted, never quite as clear as the original moment, always shaped by those who choose which parts to show.” These lines show the author believes printmaking changed both how memories were shared and how history was recalled. So the answer is Printmaking enabled people to share and reshape memories, changing how the past was recalled..",
    incorrectChoiceExplanations: {
      A: "This focuses only on religious events and one city, but the passage is about the broader effect of printmaking across many places and subjects.",
      C: "The passage never says that \"all European history became dependent on printmaking\" or that printmaking \"determined everything remembered\"—that’s too extreme.",
      D: "The passage does mention \"Venetian workshops,\" but does not say that technical skill was the main influence on memory; instead, it focuses on how prints changed memories themselves.",
    },
  },
  {
    id: "central-medium-3",
    difficulty: "medium",
    stimulus: `The bell rang, and the students filed into their seats, pencils sharpened and answer sheets stacked neatly on each desk. Tomorrow was the annual standardized test, and the classroom buzzed with reminders to review vocabulary lists and practice filling in bubbles quickly. The teacher explained, yet again, that mastering the test format could mean the difference between advancing to honors classes or not.

Yet, as the morning sunlight crept across the chalkboard, I wondered if knowing how to eliminate the wrong answer out of four truly meant a student was prepared for the world outside of school. After all, the most interesting discoveries in history came not from following directions, but from asking the questions nobody thought to ask. A scientist peering at mold in a petri dish or a reporter digging into an unexpected lead—their breakthroughs did not come from memorizing steps, but from wondering what would happen if they tried something new.

Standardized tests reward students for finding the right answer as quickly as possible, but rarely for exploring alternative explanations or challenging the question itself. In classes focused on test preparation, time once spent on debates or open-ended projects is now given over to speed drills and sample tests. Some students learn to excel at multiple choice, but others, who might shine in creative projects or by asking questions, feel left behind.

One student once asked, halfway through a test prep session, 'Why do we always need to choose just one answer?' The teacher paused, smiled, and replied, 'Sometimes, that's the real question.' The conversation drifted away as the lesson continued, but I still think about it whenever the test papers appear: are we measuring what matters most?`,
    prompt: "Which choice best states the main point the author makes in this passage?",
    choices: [
      { id: "A", text: "Emphasizing test strategies in schools can limit opportunities for students to engage in deeper thinking, making preparation the main focus." },
      { id: "B", text: "While standardized tests can measure how well students prepare for exams, truly meaningful learning comes from curiosity and questioning." },
      { id: "C", text: "Test anxiety can affect students, especially when they feel uncertain about unexpected questions on standardized tests." },
      { id: "D", text: "All forms of assessment suppress curiosity and questioning, preventing students from ever developing their own ideas." },
    ],
    correctChoiceId: "B",
    explanation: "This question asks for the passage's main point. The author argues that focusing on test strategies may oversimplify learning, while real growth comes from curiosity and asking questions. The main idea is that test prep is less valuable than developing deeper thinking skills. The narrator questions whether standardized test preparation truly helps students be ready for life outside of school, using examples like scientists and reporters making discoveries by trying new things. The passage contrasts “speed drills and sample tests” with activities like debates and open-ended projects, suggesting that meaningful learning doesn’t come from just finding the right answer quickly. The last paragraph emphasizes questioning what is truly important in education. So the answer is While standardized tests can measure how well students prepare for exams, truly meaningful learning comes from curiosity and questioning.",
    incorrectChoiceExplanations: {
      A: "This option focuses too much on the shift to test prep and doesn’t mention the value of curiosity and exploration, which are central to the author’s point.",
      C: "There is no discussion in the passage about test anxiety or uncertainty affecting students.",
      D: "The passage critiques standardized tests specifically, not all forms of assessment, and does not claim curiosity is “prevented.”",
    },
  },
];
