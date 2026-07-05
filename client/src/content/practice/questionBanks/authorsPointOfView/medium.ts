import type { PracticeQuestion } from "../../types";

export const authorsPointOfViewMediumQuestions: PracticeQuestion[] = [
  {
    id: "pov-medium-1",
    difficulty: "medium",
    stimulus: "Some call the empty lot an eyesore. To the children who build snow forts there and the gardeners planning spring beds, however, it is a rare open space waiting for a purpose.",
    prompt: "Which statement best describes the author's perspective?",
    choices: [
      { id: "A", text: "The lot should immediately be covered with buildings." },
      { id: "B", text: "The lot has possibilities that its critics fail to recognize." },
      { id: "C", text: "Children should not be allowed to play in the lot." },
      { id: "D", text: "Gardening is the only suitable use for open land." },
    ],
    correctChoiceId: "B",
    explanation: "The contrast shows that the author sees potential where others see only a problem.",
  },
  {
    id: "pov-medium-2",
    difficulty: "medium",
    stimulus: "The museum's audio guide provides dates and names, but it cannot replace standing before a painting and noticing the brushstrokes for yourself.",
    prompt: "The author most likely believes that",
    choices: [
      { id: "A", text: "audio guides should be banned from museums." },
      { id: "B", text: "facts are more important than observation." },
      { id: "C", text: "direct observation offers something a guide cannot." },
      { id: "D", text: "paintings are easier to understand at home." },
    ],
    correctChoiceId: "C",
    explanation: "The author values firsthand attention to the artwork beyond factual information.",
  },
  {
    id: "pov-medium-3",
    difficulty: "medium",
    stimulus: `A school hallway at 7:30 a.m. can feel like a quiet storm. A few students
move slowly, heads bowed, backpacks sagging from tired shoulders. Others stare at
their phones, barely glancing up when the bell rings. It is not unusual to spot
someone nodding off during first-period math\u2014an image that would have seemed odd
to students a generation ago.

Today, most American teenagers are sleeping less than seven hours per night, well
below the nine hours doctors recommend. The reasons are many: homework piles up,
part-time jobs run late, and blue phone screens glow well past midnight. Some
parents try to enforce curfews or collect devices at bedtime, but many admit they
feel powerless against the endless scroll of messages and memes. Recent surveys
show that teens now sleep less than any previous generation.

The costs are not just about grogginess. Teachers notice students struggling to
keep their eyes open, grades slipping, and friendships fraying over small
misunderstandings. Accidents involving drowsy young drivers have risen. Even school
counselors speak of a steady uptick in students missing out on key moments\u2014from
morning announcements to after-school games\u2014simply because they are too tired to
care. In one classroom, a teacher quietly places a pillow behind a student's head
rather than waking him.

The hallway never quite shakes its morning fog, even as the sun rises higher. A
backpack slips from a tired hand and lands with a soft thud on the linoleum\u2014a sound
that seems to echo down the corridor, barely noticed, yet unmistakably there.`,
    prompt: "The author's word choice in paragraph 3 reveals that the author believes...",
    choices: [
      { id: "A", text: "the author is earnestly sympathetic" },
      { id: "B", text: "the author is deeply alarmed" },
      { id: "C", text: "the author is analytically detached" },
      { id: "D", text: "the author is casually dismissive" },
    ],
    correctChoiceId: "B",
    explanation:
      "Words such as 'costs,' 'struggling,' 'slipping,' and 'fraying,' along with " +
      "references to accidents and missed experiences, reveal deep alarm about the " +
      "effects of teen sleep loss.",
  },
];
