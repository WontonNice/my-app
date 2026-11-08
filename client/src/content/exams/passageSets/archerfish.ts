import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const archerfishPassageText = "(1) Few fish find their food outside of the water. (2) Even fewer find their food several feet above the surface. (3) And only one fish hits its food with a concentrated stream of water, thereby knocking its prey into the water. (4) That fish is called the archerfish. (5) Archerfish are generally small, from five to ten centimeters, they are capable of growing as large as 40 centimeters.\n\n(6) The archerfish patrols the brackish waters of Southeast Asia and Australia and preys on insects such as moths, beetles, and grasshoppers that stray too close to the surface. (7) Lurking just below the surface, the archerfish uses its tongue to send a stream of water up into the air. (8) Elder archerfish have been documented hitting insects as far as six feet away.\n\n(9) The fact that archerfish can shoot a stream of water is impressive, but the accuracy of their shots is astounding. (10) Sending out an accurate shot means that the fish must compensate for both gravity and the refraction of light in water. (11) As you know, gravity is a constant, both underwater and on land; light, however, changes its wavelength as it enters the water. (12) An archerfish looking up at insects on a branch will not see them where they actually are. (13) Archerfish either compensate for the refraction or shoot from a position directly below an insect, thereby eliminating the angle of refraction altogether.\n\n(14) Interestingly, accurate aiming is not instinctual in the archerfish. (15) This is evidenced by the fact that young fish frequently miss the target. (16) To make it better, young fish hunt in small clumps to up the odds that at least one archerfish will be able to do a good job. (17) Archerfish hunting in schools are often far more successful than those that attempt lone pursuits. (18) Accuracy comes with experience, and in one study, accuracy was shown to be enhanced by watching older archerfish performing. (19) Archerfish have also been known to actually jump out of the water and catch prey with their mouths if the prey is within reach of how far the fish can jump to catch it. (20) The mantis shrimp is another animal which hunts in a strange way, using its powerful claws to smash its prey.";

const archerfishQuestions: ExamQuestion[] = [
  {
    "id": "archerfish-kaplan-archerfish-q15",
    "points": 1,
    "prompt": "How should sentence 5 be revised?",
    "promptHtml": "<p>How should sentence 5 be revised?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "Archerfish are generally small, from five to ten centimeters, they is capable of growing as large as 40 centimeters.",
        "text": "Archerfish are generally small, from five to ten centimeters, they is capable of growing as large as 40 centimeters."
      },
      {
        "id": "B",
        "html": "Archerfish are generally tiny, from five to ten centimeters, they are capable of growing as large as 40 centimeters.",
        "text": "Archerfish are generally tiny, from five to ten centimeters, they are capable of growing as large as 40 centimeters."
      },
      {
        "id": "C",
        "html": "Archerfish are generally small, from five to ten centimeters, but they are capable of growing as large as 40 centimeters.",
        "text": "Archerfish are generally small, from five to ten centimeters, but they are capable of growing as large as 40 centimeters."
      },
      {
        "id": "D",
        "html": "Fish are generally small, from five to ten centimeters, they are capable of growing as large as 40 centimeters.",
        "text": "Fish are generally small, from five to ten centimeters, they are capable of growing as large as 40 centimeters."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "archerfish-kaplan-archerfish-q16",
    "points": 1,
    "prompt": "Which revision of sentence 11 best maintains the style established in the passage?",
    "promptHtml": "<p>Which revision of sentence 11 <strong>best</strong> maintains the style established in the passage?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "As you may know, gravity is a constant, both underwater and on land; light, however, changes its wavelength as it enters the water.",
        "text": "As you may know, gravity is a constant, both underwater and on land; light, however, changes its wavelength as it enters the water."
      },
      {
        "id": "B",
        "html": "Gravity is a constant, both underwater and on land; light, however, changes its wavelength as it enters the water.",
        "text": "Gravity is a constant, both underwater and on land; light, however, changes its wavelength as it enters the water."
      },
      {
        "id": "C",
        "html": "It is known that gravity is a constant, both underwater and on land; light, however, changes its wavelength as it enters the water.",
        "text": "It is known that gravity is a constant, both underwater and on land; light, however, changes its wavelength as it enters the water."
      },
      {
        "id": "D",
        "html": "Gravity is a constant, both underwater and on land; you may know that light, however, changes its wavelength as it enters the water.",
        "text": "Gravity is a constant, both underwater and on land; you may know that light, however, changes its wavelength as it enters the water."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "archerfish-kaplan-archerfish-q17",
    "points": 1,
    "prompt": "Which transition word should be added to the beginning of sentence 12 to emphasize the relationship between sentences 11 and 12?",
    "instructions": "Move the correct answer to the box.",
    "instructionsHtml": "<p>Move the correct answer to the box.</p>",
    "promptHtml": "<p>Which transition word should be added to the beginning of sentence 12 to emphasize the relationship between sentences 11 and 12?</p><p></p>",
    "topic": "Topic & Transitions",
    "type": "transition_drop",
    "dragDropStyle": "outlined",
    "choices": [
      {
        "id": "A",
        "html": "Moreover,",
        "text": "Moreover,"
      },
      {
        "id": "B",
        "html": "Thus,",
        "text": "Thus,"
      },
      {
        "id": "C",
        "html": "However,",
        "text": "However,"
      },
      {
        "id": "D",
        "html": "Nevertheless,",
        "text": "Nevertheless,"
      }
    ],
    "dragDropContent": [
      "(12) {{blank-1}} an archerfish looking up at insects on a branch will not see them where they actually are."
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
    "id": "archerfish-kaplan-archerfish-q18",
    "points": 1,
    "prompt": "What is the best way to combine sentences 14 and 15 to clarify the relationship between the ideas?",
    "promptHtml": "<p>What is the <strong>best</strong> way to combine sentences 14 and 15 to clarify the relationship between the ideas?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "Interestingly, accurate aiming is not instinctual in the archerfish; as evidenced by young fish that frequently miss the target.",
        "text": "Interestingly, accurate aiming is not instinctual in the archerfish; as evidenced by young fish that frequently miss the target."
      },
      {
        "id": "B",
        "html": "Interestingly, accurate aiming is not instinctual in the archerfish but it is evidenced by young fish that frequently miss the target.",
        "text": "Interestingly, accurate aiming is not instinctual in the archerfish but it is evidenced by young fish that frequently miss the target."
      },
      {
        "id": "C",
        "html": "Interestingly, accurate aiming is not instinctual in the archerfish, as evidenced by young fish that frequently miss the target.",
        "text": "Interestingly, accurate aiming is not instinctual in the archerfish, as evidenced by young fish that frequently miss the target."
      },
      {
        "id": "D",
        "html": "Interestingly, accurate aiming is not instinctual in the archerfish, young fish frequently miss the target.",
        "text": "Interestingly, accurate aiming is not instinctual in the archerfish, young fish frequently miss the target."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "archerfish-kaplan-archerfish-q19",
    "points": 1,
    "prompt": "Which revision of sentence 16 uses the most precise language?",
    "promptHtml": "<p>Which revision of sentence 16 uses the <strong>most</strong> precise language?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "To make it better, young fish hunt in small groups to increase the odds that at least one archerfish will be able to do a good job.",
        "text": "To make it better, young fish hunt in small groups to increase the odds that at least one archerfish will be able to do a good job."
      },
      {
        "id": "B",
        "html": "To make it better, young fish hunt in small groups to increase the odds that at least one archerfish will be able to catch prey.",
        "text": "To make it better, young fish hunt in small groups to increase the odds that at least one archerfish will be able to catch prey."
      },
      {
        "id": "C",
        "html": "To compensate for this, young fish hunt in small clumps to up the odds that at least one archerfish will be able to do a good job.",
        "text": "To compensate for this, young fish hunt in small clumps to up the odds that at least one archerfish will be able to do a good job."
      },
      {
        "id": "D",
        "html": "To compensate for this, young fish hunt in small groups to increase the odds that at least one archerfish will be able to catch prey.",
        "text": "To compensate for this, young fish hunt in small groups to increase the odds that at least one archerfish will be able to catch prey."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "archerfish-kaplan-archerfish-q20",
    "points": 1,
    "prompt": "Which sentence presents information that shifts away from the main topic of the fourth paragraph and should be removed?",
    "promptHtml": "<p>Which sentence presents information that shifts away from the main topic of the fourth paragraph and should be removed?</p>",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "html": "sentence 17",
        "text": "sentence 17"
      },
      {
        "id": "B",
        "html": "sentence 18",
        "text": "sentence 18"
      },
      {
        "id": "C",
        "html": "sentence 19",
        "text": "sentence 19"
      },
      {
        "id": "D",
        "html": "sentence 20",
        "text": "sentence 20"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const archerfishPassageSet: ExamPassageSet = {
  id: "ela-archerfish",
  versionLabels: ["Kaplan Revising/Editing Set 1"],
  label: "Kaplan SHSAT — Passage-Based Revising/Editing",
  section: "revising_editing_a",
  questionCount: archerfishQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "archerfish",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    source: {"packageId":"23e8a83c2f71462a0001daf93c6406570ac1345aec8f2f4b1ae31fa2a2fdfe02"},
    title: "Archerfish",
    passageType: "informational",
    passageCategory: "kaplan",
    richText: "<p data-numbered=\"false\">(1) Few fish find their food outside of the water. (2) Even fewer find their food several feet above the surface. (3) And only one fish hits its food with a concentrated stream of water, thereby knocking its prey into the water. (4) That fish is called the archerfish. (5) Archerfish are generally small, from five to ten centimeters, they are capable of growing as large as 40 centimeters.</p>\n<p data-numbered=\"false\">(6) The archerfish patrols the brackish waters of Southeast Asia and Australia and preys on insects such as moths, beetles, and grasshoppers that stray too close to the surface. (7) Lurking just below the surface, the archerfish uses its tongue to send a stream of water up into the air. (8) Elder archerfish have been documented hitting insects as far as six feet away.</p>\n<p data-numbered=\"false\">(9) The fact that archerfish can shoot a stream of water is impressive, but the accuracy of their shots is astounding. (10) Sending out an accurate shot means that the fish must compensate for both gravity and the refraction of light in water. (11) As you know, gravity is a constant, both underwater and on land; light, however, changes its wavelength as it enters the water. (12) An archerfish looking up at insects on a branch will not see them where they actually are. (13) Archerfish either compensate for the refraction or shoot from a position directly below an insect, thereby eliminating the angle of refraction altogether.</p>\n<p data-numbered=\"false\">(14) Interestingly, accurate aiming is not instinctual in the archerfish. (15) This is evidenced by the fact that young fish frequently miss the target. (16) To make it better, young fish hunt in small clumps to up the odds that at least one archerfish will be able to do a good job. (17) Archerfish hunting in schools are often far more successful than those that attempt lone pursuits. (18) Accuracy comes with experience, and in one study, accuracy was shown to be enhanced by watching older archerfish performing. (19) Archerfish have also been known to actually jump out of the water and catch prey with their mouths if the prey is within reach of how far the fish can jump to catch it. (20) The mantis shrimp is another animal which hunts in a strange way, using its powerful claws to smash its prey.</p>",
    text: archerfishPassageText,
    versionLabel: "Kaplan Revising/Editing Set 1",
  }),
  questions: archerfishQuestions,
};
