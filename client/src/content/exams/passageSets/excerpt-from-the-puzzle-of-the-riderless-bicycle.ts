import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromThePuzzleOfTheRiderlessBicyclePassageText = "Push a bicycle hard enough down a straight, empty road, let go of the handlebars, and something strange happens: the bicycle does not fall over. It wobbles for a moment, seems to correct itself, and rolls on for dozens of yards, steering itself around small disturbances in the pavement as if an invisible hand were holding the bars. Riders have relied on this behavior for more than a century without asking why it works. Only in the last few decades have physicists agreed on an answer, and the answer turned out to be more complicated, and more interesting, than anyone expected.\n\nFor most of the twentieth century, the standard explanation involved spinning wheels. A rotating bicycle wheel behaves like a small gyroscope, and gyroscopes resist being tipped out of the plane in which they spin. According to this account, a leaning bicycle generates a gyroscopic force that pushes the front wheel to turn in the direction of the lean, which steers the bicycle back underneath its own center of mass before it can topple. The explanation is tidy, it matches everyday intuition about spinning tops, and it appears in textbooks to this day.\n\nIn 2011, a team of engineers built a bicycle specifically designed to test that explanation, and the results overturned it. The researchers constructed a machine with two front wheels, spinning in opposite directions, so that their gyroscopic effects canceled each other out exactly. If the standard explanation were correct, this bicycle should have been unable to balance itself once released. Instead, it rolled down the test track and self-corrected just as an ordinary bicycle does. The gyroscopic effect, whatever role it plays, was clearly not the whole story.\n\nThe property that turned out to matter more is called trail, and it has nothing to do with spinning. Trail is the small horizontal distance between the point where an imaginary line through the steering axis touches the ground and the point where the front wheel actually touches the ground. On almost every bicycle, the fork is angled so that this contact point sits slightly behind the steering axis, the way a shopping cart's front wheels trail behind their pivot rather than sitting directly beneath it. When a bicycle leans to one side, the trail causes the front wheel to swivel, almost automatically, toward the direction of the lean. That swivel steers the wheel back underneath the frame, and the bicycle rights itself, no spinning required.\n\nTrail explains why a bicycle rolling at a good clip feels planted and predictable, and it also explains why a bicycle moving very slowly feels twitchy and hard to balance: at low speed, the same swivel happens too slowly to correct a lean before it grows. It is also why children's first bicycles, and shopping carts, and even some early \"safety bicycles\" from the 1890s were built with fork geometry that riders and engineers arrived at mostly through trial and error, long before anyone had measured the effect or given it a name.\n\nNone of this means the 2011 experiment settled the matter entirely. The two-front-wheel bicycle balanced itself, but researchers later built other configurations, including one with no trail at all and no counter-rotating wheels, that could also be tuned to balance under the right conditions by shifting weight to other parts of the frame. The emerging picture is that self-balancing is not the product of one dominant force but of several effects, trail chief among them, working together in a way that depends on speed, frame geometry, and the placement of mass across the whole machine. A bicycle, it turns out, is a far more delicately tuned instrument than its two-wheeled simplicity suggests.\n\nFor ordinary riders, none of this changes how a bicycle feels underfoot. But it does explain a small mystery that most people never think to ask about: why letting go of the handlebars, for a few careful seconds on a straight road, so often ends in nothing more dramatic than a bicycle rolling calmly on without you.\n\nThe trail effect also has limits worth noting, since it can make self-balancing sound more automatic than it really is. A bicycle released at a crawl, well below normal riding speed, will not correct itself no matter how well its fork is designed; the wheel simply cannot swivel fast enough to catch a lean that is growing at that speed. Above a certain speed, on the other hand, some bicycle and frame combinations become so stable that a rider trying to lean into a turn has to fight the frame's own tendency to straighten itself back up, which is one reason racing bicycles and delivery bicycles, built for very different speeds, often have noticeably different fork angles. Engineers sometimes describe this as a \"stable speed range,\" a window in which the geometry does most of the balancing work and the rider mostly steers, bounded on the low end by wobbling and on the high end by an almost stubborn resistance to leaning at all.\n\nThis is also why the riderless-bicycle demonstration only works within a narrow band of conditions that most people never notice they are relying on. Push the bicycle too gently and it will drift to a stop before trail has a chance to act; push it on a rutted or sloped surface and the same forces that would have corrected a small lean instead amplify it. The trick, in other words, is not that the bicycle balances itself under any circumstances, but that ordinary streets, ordinary speeds, and ordinary bicycles happen to sit comfortably inside the range where the geometry does the work quietly enough that riders never notice it is there at all.";

const excerptFromThePuzzleOfTheRiderlessBicycleQuestions: ExamQuestion[] = [
  {
    "id": "passage-1",
    "points": 1,
    "prompt": "The word choices in the first paragraph, such as describing the bicycle's self-balancing as 'something strange' guided by 'an invisible hand,' most clearly establish a tone of",
    "promptHtml": "The word choices in the first paragraph, such as describing the bicycle's self-balancing as 'something strange' guided by 'an invisible hand,'&nbsp;<strong>most clearly</strong>&nbsp;establish a tone of",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "skepticism that the phenomenon described is even real.",
        "text": "skepticism that the phenomenon described is even real."
      },
      {
        "id": "B",
        "html": "frustration at how difficult bicycles are to repair.",
        "text": "frustration at how difficult bicycles are to repair."
      },
      {
        "id": "C",
        "html": "genuine curiosity at an overlooked phenomenon.",
        "text": "genuine curiosity at an overlooked phenomenon."
      },
      {
        "id": "D",
        "html": "alarm about the dangers of riding without hands on the handlebars.",
        "text": "alarm about the dangers of riding without hands on the handlebars."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-puzzle-of-the-riderless-bicycle-2",
    "points": 1,
    "prompt": "What detail from the passage best supports the claim that the traditional gyroscopic explanation is not the whole story?",
    "promptHtml": "What detail from the passage&nbsp;<strong>best</strong>&nbsp;supports the claim that the traditional gyroscopic explanation is not the whole story?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“The gyroscopic effect, whatever role it plays, was clearly not the whole story.”",
        "text": "“The gyroscopic effect, whatever role it plays, was clearly not the whole story.”"
      },
      {
        "id": "B",
        "html": "“For most of the twentieth century, the standard explanation involved spinning wheels.”",
        "text": "“For most of the twentieth century, the standard explanation involved spinning wheels.”"
      },
      {
        "id": "C",
        "html": "“the results overturned it: the test bicycle still balanced itself when released.”",
        "text": "“the results overturned it: the test bicycle still balanced itself when released.”"
      },
      {
        "id": "D",
        "html": "“A bicycle is a far more delicately tuned instrument than it first appears.”",
        "text": "“A bicycle is a far more delicately tuned instrument than it first appears.”"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-puzzle-of-the-riderless-bicycle-3",
    "points": 1,
    "prompt": "The comparison of a bicycle's trail geometry to the way 'a shopping cart's front wheels trail behind their pivot rather than sitting directly beneath it' most strongly serves to",
    "promptHtml": "The comparison of a bicycle's trail geometry to the way 'a shopping cart's front wheels trail behind their pivot rather than sitting directly beneath it'&nbsp;<strong>most strongly</strong>&nbsp;serves to",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "html": "suggest that bicycles and shopping carts share the same manufacturer.",
        "text": "suggest that bicycles and shopping carts share the same manufacturer."
      },
      {
        "id": "B",
        "html": "make an abstract engineering concept concrete using a familiar object.",
        "text": "make an abstract engineering concept concrete using a familiar object."
      },
      {
        "id": "C",
        "html": "argue that shopping carts handle better than bicycles at high speed.",
        "text": "argue that shopping carts handle better than bicycles at high speed."
      },
      {
        "id": "D",
        "html": "criticize the design of most modern shopping carts today.",
        "text": "criticize the design of most modern shopping carts today."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-puzzle-of-the-riderless-bicycle-4",
    "points": 1,
    "prompt": "Which choice most fully captures the central idea of the passage's explanation of why a bicycle stays upright?",
    "promptHtml": "Which choice&nbsp;<strong>most fully</strong>&nbsp;captures the central idea of the passage's explanation of why a bicycle stays upright?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Bicycles built after 2011 are significantly safer than older models.",
        "text": "Bicycles built after 2011 are significantly safer than older models."
      },
      {
        "id": "B",
        "html": "Trail was invented by the engineers who built the two-front-wheel test bicycle.",
        "text": "Trail was invented by the engineers who built the two-front-wheel test bicycle."
      },
      {
        "id": "C",
        "html": "Gyroscopic effects have no influence on the behavior of any moving object.",
        "text": "Gyroscopic effects have no influence on the behavior of any moving object."
      },
      {
        "id": "D",
        "html": "A bicycle's self-balancing was long credited to spinning wheels, but trail matters more.",
        "text": "A bicycle's self-balancing was long credited to spinning wheels, but trail matters more."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-puzzle-of-the-riderless-bicycle-5",
    "points": 1,
    "prompt": "Which theme does the account of the 2011 experiment most strongly suggest?",
    "promptHtml": "Which theme does the account of the 2011 experiment&nbsp;<strong>most strongly</strong>&nbsp;suggest?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Engineers should generally avoid ever questioning explanations printed in respected textbooks.",
        "text": "Engineers should generally avoid ever questioning explanations printed in respected textbooks."
      },
      {
        "id": "B",
        "html": "Bicycles are too mechanically complicated for ordinary riders to ever understand.",
        "text": "Bicycles are too mechanically complicated for ordinary riders to ever understand."
      },
      {
        "id": "C",
        "html": "Accepted explanations can prove incomplete once tested directly.",
        "text": "Accepted explanations can prove incomplete once tested directly."
      },
      {
        "id": "D",
        "html": "Gyroscopic effects are irrelevant to the behavior of every mechanical device.",
        "text": "Gyroscopic effects are irrelevant to the behavior of every mechanical device."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-puzzle-of-the-riderless-bicycle-6",
    "points": 1,
    "prompt": "The paragraph beginning 'None of this means the 2011 experiment settled the matter entirely' primarily functions to",
    "promptHtml": "The paragraph beginning 'None of this means the 2011 experiment settled the matter entirely' primarily functions to",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "reverse the passage's earlier conclusion about trail completely.",
        "text": "reverse the passage's earlier conclusion about trail completely."
      },
      {
        "id": "B",
        "html": "introduce an entirely unrelated discussion of shopping carts.",
        "text": "introduce an entirely unrelated discussion of shopping carts."
      },
      {
        "id": "C",
        "html": "acknowledge additional research that complicates a simple, single-cause explanation.",
        "text": "acknowledge additional research that complicates a simple, single-cause explanation."
      },
      {
        "id": "D",
        "html": "summarize the claims made in the passage's introduction.",
        "text": "summarize the claims made in the passage's introduction."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-puzzle-of-the-riderless-bicycle-7",
    "points": 1,
    "prompt": "The author most likely ends the passage by returning to the image of 'a bicycle rolling calmly on without you' in order to",
    "promptHtml": "The author&nbsp;<strong>most likely</strong>&nbsp;ends the passage by returning to the image of 'a bicycle rolling calmly on without you' in order to",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "warn readers never to ride a bicycle without holding the handlebars.",
        "text": "warn readers never to ride a bicycle without holding the handlebars."
      },
      {
        "id": "B",
        "html": "introduce a new scientific study not discussed elsewhere in the passage.",
        "text": "introduce a new scientific study not discussed elsewhere in the passage."
      },
      {
        "id": "C",
        "html": "criticize riders who choose to let go of their handlebars.",
        "text": "criticize riders who choose to let go of their handlebars."
      },
      {
        "id": "D",
        "html": "connect the scientific explanation back to the everyday experience that opened the passage.",
        "text": "connect the scientific explanation back to the everyday experience that opened the passage."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-puzzle-of-the-riderless-bicycle-8",
    "points": 1,
    "prompt": "Given the passage's explanation of the 'stable speed range,' which inference about racing bicycles and delivery bicycles is most strongly supported by the text?",
    "promptHtml": "Given the passage's explanation of the 'stable speed range,' which inference about racing bicycles and delivery bicycles is&nbsp;<strong>most strongly</strong>&nbsp;supported by the text?",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "Delivery bicycles are not expected to balance on their own at any speed.",
        "text": "Delivery bicycles are not expected to balance on their own at any speed."
      },
      {
        "id": "B",
        "html": "Fork angle has no real effect on how a bicycle handles at any speed.",
        "text": "Fork angle has no real effect on how a bicycle handles at any speed."
      },
      {
        "id": "C",
        "html": "Racing bicycles are built with no trail in their fork geometry at all.",
        "text": "Racing bicycles are built with no trail in their fork geometry at all."
      },
      {
        "id": "D",
        "html": "Racing and delivery bicycles are ridden at different speeds, so their geometry differs.",
        "text": "Racing and delivery bicycles are ridden at different speeds, so their geometry differs."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const excerptFromThePuzzleOfTheRiderlessBicyclePassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-puzzle-of-the-riderless-bicycle",
  questionCount: excerptFromThePuzzleOfTheRiderlessBicycleQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "excerpt-from-the-puzzle-of-the-riderless-bicycle",
    title: "Excerpt from \"The Puzzle of the Riderless Bicycle\"",
    author: "Dr. Elena Kowalczyk",
    blurb: "Dr. Elena Kowalczyk is a mechanical engineer who writes about everyday physics for a general-audience science magazine. The following is adapted from her article on bicycle stability.",
    passageType: "informational",
    richText: "<p>\n\nPush a bicycle hard enough down a straight, empty road, let go of the handlebars, and something strange happens: the bicycle does not fall over. It wobbles for a moment, seems to correct itself, and rolls on for dozens of yards, steering itself around small disturbances in the pavement as if an invisible hand were holding the bars. Riders have relied on this behavior for more than a century without asking why it works. Only in the last few decades have physicists agreed on an answer, and the answer turned out to be more complicated, and more interesting, than anyone expected.</p><p>For most of the twentieth century, the standard explanation involved spinning wheels. A rotating bicycle wheel behaves like a small gyroscope, and gyroscopes resist being tipped out of the plane in which they spin. According to this account, a leaning bicycle generates a gyroscopic force that pushes the front wheel to turn in the direction of the lean, which steers the bicycle back underneath its own center of mass before it can topple. The explanation is tidy, it matches everyday intuition about spinning tops, and it appears in textbooks to this day.</p><p>In 2011, a team of engineers built a bicycle specifically designed to test that explanation, and the results overturned it. The researchers constructed a machine with two front wheels, spinning in opposite directions, so that their gyroscopic effects canceled each other out exactly. If the standard explanation were correct, this bicycle should have been unable to balance itself once released. Instead, it rolled down the test track and self-corrected just as an ordinary bicycle does. The gyroscopic effect, whatever role it plays, was clearly not the whole story.</p><p>The property that turned out to matter more is called&nbsp;trail, and it has nothing to do with spinning. Trail is the small horizontal distance between the point where an imaginary line through the steering axis touches the ground and the point where the front wheel actually touches the ground. On almost every bicycle, the fork is angled so that this contact point sits slightly behind the steering axis, the way a shopping cart's front wheels trail behind their pivot rather than sitting directly beneath it. When a bicycle leans to one side, the trail causes the front wheel to swivel, almost automatically, toward the direction of the lean. That swivel steers the wheel back underneath the frame, and the bicycle rights itself, no spinning required.</p><p>Trail explains why a bicycle rolling at a good clip feels planted and predictable, and it also explains why a bicycle moving very slowly feels twitchy and hard to balance: at low speed, the same swivel happens too slowly to correct a lean before it grows. It is also why children's first bicycles, and shopping carts, and even some early \"safety bicycles\" from the 1890s were built with fork geometry that riders and engineers arrived at mostly through trial and error, long before anyone had measured the effect or given it a name.</p><p>None of this means the 2011 experiment settled the matter entirely. The two-front-wheel bicycle balanced itself, but researchers later built other configurations, including one with no trail at all and no counter-rotating wheels, that could also be tuned to balance under the right conditions by shifting weight to other parts of the frame. The emerging picture is that self-balancing is not the product of one dominant force but of several effects, trail chief among them, working together in a way that depends on speed, frame geometry, and the placement of mass across the whole machine. A bicycle, it turns out, is a far more delicately tuned instrument than its two-wheeled simplicity suggests.</p><p>For ordinary riders, none of this changes how a bicycle feels underfoot. But it does explain a small mystery that most people never think to ask about: why letting go of the handlebars, for a few careful seconds on a straight road, so often ends in nothing more dramatic than a bicycle rolling calmly on without you.</p><p>The trail effect also has limits worth noting, since it can make self-balancing sound more automatic than it really is. A bicycle released at a crawl, well below normal riding speed, will not correct itself no matter how well its fork is designed; the wheel simply cannot swivel fast enough to catch a lean that is growing at that speed. Above a certain speed, on the other hand, some bicycle and frame combinations become so stable that a rider trying to lean into a turn has to fight the frame's own tendency to straighten itself back up, which is one reason racing bicycles and delivery bicycles, built for very different speeds, often have noticeably different fork angles. Engineers sometimes describe this as a \"stable speed range,\" a window in which the geometry does most of the balancing work and the rider mostly steers, bounded on the low end by wobbling and on the high end by an almost stubborn resistance to leaning at all.</p><p>This is also why the riderless-bicycle demonstration only works within a narrow band of conditions that most people never notice they are relying on. Push the bicycle too gently and it will drift to a stop before trail has a chance to act; push it on a rutted or sloped surface and the same forces that would have corrected a small lean instead amplify it. The trick, in other words, is not that the bicycle balances itself under any circumstances, but that ordinary streets, ordinary speeds, and ordinary bicycles happen to sit comfortably inside the range where the geometry does the work quietly enough that riders never notice it is there at all.\n\n</p>",
    text: excerptFromThePuzzleOfTheRiderlessBicyclePassageText,
  }),
  questions: excerptFromThePuzzleOfTheRiderlessBicycleQuestions,
};
