import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const whatTheCubeTaughtMeDigitalShsatPracticeTest3PassageText = "(1) Six weeks ago, I could not solve a Rubik's cube in under ten minutes, and most of those minutes were spent turning the same two corners back and forth without any real plan. (2) Then a classmate started a lunchtime cube club, and I decided, mostly out of boredom, to give it one more try. (3) The club meets every Tuesday in Ms. Alvarez's room, and on the first day about a dozen students showed up, most of them just curious what all the clicking noises were about.\n\n(4) The first thing I learned is that solving a cube quickly has almost nothing to do with luck. (5) It depends on memorizing a set of short move sequences, called algorithms, and knowing exactly when to apply each one. (6) A beginner solves the cube layer by layer, checking after each stage before moving on. (7) A more advanced solver looks at the whole cube at once and predicts several moves ahead, the way a chess player reads a board rather than one square at a time. (8) Our club's fastest member, a seventh grader named Deshawn, can finish a scrambled cube in under twenty seconds, and watching his hands blur through a sequence is honestly a little bit like watching a magic trick you already know the secret to.\n\n(9) What surprised me most was how much the practice carried over into other parts of school. (10) Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — turned out to be a habit I started using on math homework and long reading assignments too. (11) I stopped staring at a whole page of fractions and started asking myself which single step I could finish first.\n\n(12) By the end of the sixth week, my best time had dropped to fifty-eight seconds, which felt impossible on the first Tuesday I ever showed up. (13) Deshawn says the club is planning to enter a regional speedcubing meet in the spring. (14) I'm not sure I'll be fast enough to compete by then, but I've stopped worrying so much about the stopwatch. (15) The part that keeps me coming back is not the speed, it's the small, satisfying click of the last layer locking into place.";

const whatTheCubeTaughtMeDigitalShsatPracticeTest3Questions: ExamQuestion[] = [
  {
    "id": "what-the-cube-taught-me-digital-shsat-practice-test-3-1",
    "explanation": "Sentence 4 states that solving quickly \"has almost nothing to do with luck,\" and sentence 5 replaces that ruled-out explanation with the real one — memorizing move sequences and knowing when to apply them — so \"Instead,\" correctly signals that one explanation is being swapped in for another. \"Similarly,\" wrongly implies sentence 5 restates a comparable idea rather than replacing it, \"For example,\" wrongly implies sentence 5 is a specific instance of sentence 4 rather than the actual explanation, and \"As a result,\" wrongly implies sentence 5 is a consequence of sentence 4 rather than what sentence 4 says is not the case.",
    "explanationHtml": "<p>Sentence 4 states that solving quickly &quot;has almost nothing to do with luck,&quot; and sentence 5 replaces that ruled-out explanation with the real one — memorizing move sequences and knowing when to apply them — so &quot;Instead,&quot; correctly signals that one explanation is being swapped in for another. &quot;Similarly,&quot; wrongly implies sentence 5 restates a comparable idea rather than replacing it, &quot;For example,&quot; wrongly implies sentence 5 is a specific instance of sentence 4 rather than the actual explanation, and &quot;As a result,&quot; wrongly implies sentence 5 is a consequence of sentence 4 rather than what sentence 4 says is not the case.</p>",
    "points": 1,
    "prompt": "Which transition word or phrase should be added to the beginning of sentence 5 to emphasize the relationship between sentences 4 and 5?",
    "promptHtml": "Which transition word or phrase should be added to the beginning of sentence 5 to emphasize the relationship between sentences 4 and 5?",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "Instead,",
        "text": "Instead,"
      },
      {
        "id": "B",
        "html": "As a result,",
        "text": "As a result,"
      },
      {
        "id": "C",
        "html": "For example,",
        "text": "For example,"
      },
      {
        "id": "D",
        "html": "Similarly,",
        "text": "Similarly,"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "what-the-cube-taught-me-digital-shsat-practice-test-3-2",
    "explanation": "The surrounding sentences describe general truths about the cube-solving process in the simple present tense (\"A more advanced solver looks... and predicts...\"), so \"solves\" keeps sentence 6 consistent with that habitual, general-truth register. \"Solve\" is the base form and doesn't agree with the singular subject \"a beginner,\" and \"is solving\" is grammatically legal on its own but shifts to the present-progressive tense, breaking consistency with the simple-present style used throughout the paragraph to describe what solvers generally do.",
    "explanationHtml": "<p>The surrounding sentences describe general truths about the cube-solving process in the simple present tense (&quot;A more advanced solver looks... and predicts...&quot;), so &quot;solves&quot; keeps sentence 6 consistent with that habitual, general-truth register. &quot;Solve&quot; is the base form and doesn't agree with the singular subject &quot;a beginner,&quot; and &quot;is solving&quot; is grammatically legal on its own but shifts to the present-progressive tense, breaking consistency with the simple-present style used throughout the paragraph to describe what solvers generally do.</p>",
    "points": 1,
    "prompt": "Select the correct answer from the drop-down to complete sentence 6.",
    "instructions": "Move the correct answer to the box.",
    "promptHtml": "Select the correct answer from the drop-down to complete sentence 6.",
    "topic": "Sentence Structure",
    "type": "transition_drop",
    "choices": [
      {
        "id": "A",
        "html": "solve",
        "text": "solve"
      },
      {
        "id": "B",
        "html": "solves",
        "text": "solves"
      },
      {
        "id": "C",
        "html": "is solving",
        "text": "is solving"
      }
    ],
    "dragDropContent": [
      "A beginner {{blank-1}} the cube layer by layer, checking after each stage before moving on."
    ],
    "dragDropSlots": [
      {
        "id": "blank-1",
        "correctItemId": "B"
      }
    ],
    "allowReuse": false
  },
  {
    "id": "what-the-cube-taught-me-digital-shsat-practice-test-3-3",
    "explanation": "Sentences 9 and 11 both use simple past tense (\"was,\" \"stopped,\" \"started\") to narrate what already happened over the six weeks, so sentence 10 needs to match with \"turned out\" and \"started using.\" Choice A shifts to present tense, breaking the paragraph's past-tense frame. Choice C shifts to future tense, which contradicts sentences 9 and 11 describing something that had already occurred by the time of writing. Choice D mixes past perfect and present perfect, an inconsistent combination that doesn't match the simple past used everywhere else in the paragraph.",
    "explanationHtml": "<p>Sentences 9 and 11 both use simple past tense (&quot;was,&quot; &quot;stopped,&quot; &quot;started&quot;) to narrate what already happened over the six weeks, so sentence 10 needs to match with &quot;turned out&quot; and &quot;started using.&quot; Choice A shifts to present tense, breaking the paragraph's past-tense frame. Choice C shifts to future tense, which contradicts sentences 9 and 11 describing something that had already occurred by the time of writing. Choice D mixes past perfect and present perfect, an inconsistent combination that doesn't match the simple past used everywhere else in the paragraph.</p>",
    "points": 1,
    "prompt": "Which version of sentence 10 keeps its verb tense consistent with the simple past tense used throughout the surrounding paragraph (sentences 9–11)?",
    "promptHtml": "Which version of sentence 10 keeps its verb tense consistent with the simple past tense used throughout the surrounding paragraph (sentences 9–11)?",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — will turn out to be a habit I will start using on math homework and long reading assignments too.",
        "text": "Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — will turn out to be a habit I will start using on math homework and long reading assignments too."
      },
      {
        "id": "B",
        "html": "Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — turned out to be a habit I started using on math homework and long reading assignments too.",
        "text": "Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — turned out to be a habit I started using on math homework and long reading assignments too."
      },
      {
        "id": "C",
        "html": "Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — had turned out to be a habit I have started using on math homework and long reading assignments too.",
        "text": "Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — had turned out to be a habit I have started using on math homework and long reading assignments too."
      },
      {
        "id": "D",
        "html": "Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — turns out to be a habit I start using on math homework and long reading assignments too.",
        "text": "Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — turns out to be a habit I start using on math homework and long reading assignments too."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "what-the-cube-taught-me-digital-shsat-practice-test-3-4",
    "explanation": "A semicolon correctly and unambiguously joins the two independent clauses without a coordinating conjunction, fixing the splice. Choice A places only a comma before the conjunctive adverb \"however,\" which still leaves a comma splice, since a conjunctive adverb needs a semicolon (or period) before it, not just a comma. Choice C turns the second clause into a relative clause with \"which,\" but \"which it's...\" doesn't attach to any noun and isn't a grammatical way to join the two ideas. Choice D turns the second clause into a participial phrase beginning with \"being,\" which leaves the sentence without a proper independent second clause and creates a fragment-like error.",
    "explanationHtml": "<p>A semicolon correctly and unambiguously joins the two independent clauses without a coordinating conjunction, fixing the splice. Choice A places only a comma before the conjunctive adverb &quot;however,&quot; which still leaves a comma splice, since a conjunctive adverb needs a semicolon (or period) before it, not just a comma. Choice C turns the second clause into a relative clause with &quot;which,&quot; but &quot;which it's...&quot; doesn't attach to any noun and isn't a grammatical way to join the two ideas. Choice D turns the second clause into a participial phrase beginning with &quot;being,&quot; which leaves the sentence without a proper independent second clause and creates a fragment-like error.</p>",
    "points": 1,
    "prompt": "Which revision of sentence 15 corrects the comma splice?",
    "promptHtml": "Which revision of sentence 15 corrects the comma splice?",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "The part that keeps me coming back is not the speed, which it's the small, satisfying click of the last layer locking into place.",
        "text": "The part that keeps me coming back is not the speed, which it's the small, satisfying click of the last layer locking into place."
      },
      {
        "id": "B",
        "html": "The part that keeps me coming back is not the speed; it's the small, satisfying click of the last layer locking into place.",
        "text": "The part that keeps me coming back is not the speed; it's the small, satisfying click of the last layer locking into place."
      },
      {
        "id": "C",
        "html": "The part that keeps me coming back is not the speed, being the small, satisfying click of the last layer locking into place.",
        "text": "The part that keeps me coming back is not the speed, being the small, satisfying click of the last layer locking into place."
      },
      {
        "id": "D",
        "html": "The part that keeps me coming back is not the speed, however, it's the small, satisfying click of the last layer locking into place.",
        "text": "The part that keeps me coming back is not the speed, however, it's the small, satisfying click of the last layer locking into place."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "what-the-cube-taught-me-digital-shsat-practice-test-3-5",
    "explanation": "Subordinating the first clause with \"Although\" cleanly signals the contrast between the club's plan and the writer's uncertainty in a single fluent sentence. Choice A opens with the participial phrase \"Planning to enter a regional speedcubing meet in the spring,\" which as written modifies \"I,\" wrongly suggesting the writer, not the club, is the one planning to enter the meet. Choice C joins the clauses with a comma and \"and,\" which misrepresents a contrast as a simple addition, and adds an unnecessary comma around \"by then\" that disrupts the sentence's flow. Choice D breaks the original sentence apart with misplaced commas and drops the logical connection between the plan and the writer's doubt altogether.",
    "explanationHtml": "<p>Subordinating the first clause with &quot;Although&quot; cleanly signals the contrast between the club's plan and the writer's uncertainty in a single fluent sentence. Choice A opens with the participial phrase &quot;Planning to enter a regional speedcubing meet in the spring,&quot; which as written modifies &quot;I,&quot; wrongly suggesting the writer, not the club, is the one planning to enter the meet. Choice C joins the clauses with a comma and &quot;and,&quot; which misrepresents a contrast as a simple addition, and adds an unnecessary comma around &quot;by then&quot; that disrupts the sentence's flow. Choice D breaks the original sentence apart with misplaced commas and drops the logical connection between the plan and the writer's doubt altogether.</p>",
    "points": 1,
    "prompt": "What is the best way to combine sentences 13 and 14?",
    "promptHtml": "What is the best way to combine sentences 13 and 14?",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "Deshawn says the club is planning to enter a regional speedcubing meet in the spring, and I'm not sure I'll be fast enough to compete, by then, either.",
        "text": "Deshawn says the club is planning to enter a regional speedcubing meet in the spring, and I'm not sure I'll be fast enough to compete, by then, either."
      },
      {
        "id": "B",
        "html": "Although Deshawn says the club is planning to enter a regional speedcubing meet in the spring, I'm not sure I'll be fast enough to compete by then.",
        "text": "Although Deshawn says the club is planning to enter a regional speedcubing meet in the spring, I'm not sure I'll be fast enough to compete by then."
      },
      {
        "id": "C",
        "html": "Planning to enter a regional speedcubing meet in the spring, I'm not sure I'll be fast enough to compete by then, Deshawn says.",
        "text": "Planning to enter a regional speedcubing meet in the spring, I'm not sure I'll be fast enough to compete by then, Deshawn says."
      },
      {
        "id": "D",
        "html": "The club is planning, Deshawn says, to enter a regional speedcubing meet, in the spring I'm not sure I'll be fast enough.",
        "text": "The club is planning, Deshawn says, to enter a regional speedcubing meet, in the spring I'm not sure I'll be fast enough."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "what-the-cube-taught-me-digital-shsat-practice-test-3-6",
    "explanation": "This sentence ties together the passage's two threads — the writer's growth as a cuber and the broader lesson about breaking problems into steps described in paragraph 3 — into a fitting conclusion, while the other choices introduce logistical, historical, or comparative details that were not developed earlier in the passage.",
    "explanationHtml": "<p>This sentence ties together the passage's two threads — the writer's growth as a cuber and the broader lesson about breaking problems into steps described in paragraph 3 — into a fitting conclusion, while the other choices introduce logistical, historical, or comparative details that were not developed earlier in the passage.</p>",
    "points": 1,
    "prompt": "Which concluding sentence should follow sentence 15 to best support the information presented in the passage?",
    "promptHtml": "Which concluding sentence should follow sentence 15 to best support the information presented in the passage?",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "Whatever happens at the meet, I've already gotten better at breaking big problems into small steps.",
        "text": "Whatever happens at the meet, I've already gotten better at breaking big problems into small steps."
      },
      {
        "id": "B",
        "html": "Cube club meets every Tuesday, and Ms. Alvarez always brings extra cubes for anyone who forgets theirs.",
        "text": "Cube club meets every Tuesday, and Ms. Alvarez always brings extra cubes for anyone who forgets theirs."
      },
      {
        "id": "C",
        "html": "Rubik's cubes were invented decades before speedcubing competitions became popular around the world.",
        "text": "Rubik's cubes were invented decades before speedcubing competitions became popular around the world."
      },
      {
        "id": "D",
        "html": "Deshawn's twenty-second solve time is faster than most competitors his own age at regional meets.",
        "text": "Deshawn's twenty-second solve time is faster than most competitors his own age at regional meets."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const whatTheCubeTaughtMeDigitalShsatPracticeTest3PassageSet: ExamPassageSet = {
  id: "ela-what-the-cube-taught-me-digital-shsat-practice-test-3",
  label: "ELA - Reading Comprehension",
  section: "revising_editing_a",
  questionCount: whatTheCubeTaughtMeDigitalShsatPracticeTest3Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "what-the-cube-taught-me-digital-shsat-practice-test-3",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "What the Cube Taught Me",
    passageType: "informational",
    passageCategory: "prestige",
    richText: "<p>(1) Six weeks ago, I could not solve a Rubik's cube in under ten minutes, and most of those minutes were spent turning the same two corners back and forth without any real plan. (2) Then a classmate started a lunchtime cube club, and I decided, mostly out of boredom, to give it one more try. (3) The club meets every Tuesday in Ms. Alvarez's room, and on the first day about a dozen students showed up, most of them just curious what all the clicking noises were about.</p><p>(4) The first thing I learned is that solving a cube quickly has almost nothing to do with luck. (5) It depends on memorizing a set of short move sequences, called algorithms, and knowing exactly when to apply each one. (6) A beginner solves the cube layer by layer, checking after each stage before moving on. (7) A more advanced solver looks at the whole cube at once and predicts several moves ahead, the way a chess player reads a board rather than one square at a time. (8) Our club's fastest member, a seventh grader named Deshawn, can finish a scrambled cube in under twenty seconds, and watching his hands blur through a sequence is honestly a little bit like watching a magic trick you already know the secret to.</p><p>(9) What surprised me most was how much the practice carried over into other parts of school. (10) Breaking a big, confusing problem into smaller stages — get the first layer solved, then worry about the second — turned out to be a habit I started using on math homework and long reading assignments too. (11) I stopped staring at a whole page of fractions and started asking myself which single step I could finish first.</p><p>(12) By the end of the sixth week, my best time had dropped to fifty-eight seconds, which felt impossible on the first Tuesday I ever showed up. (13) Deshawn says the club is planning to enter a regional speedcubing meet in the spring. (14) I'm not sure I'll be fast enough to compete by then, but I've stopped worrying so much about the stopwatch. (15) The part that keeps me coming back is not the speed, it's the small, satisfying click of the last layer locking into place.</p>",
    text: whatTheCubeTaughtMeDigitalShsatPracticeTest3PassageText,
    versionLabel: "Digital SHSAT Practice Test 3",
  }),
  questions: whatTheCubeTaughtMeDigitalShsatPracticeTest3Questions,
};
