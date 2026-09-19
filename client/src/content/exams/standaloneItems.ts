import type { ExamQuestion } from "./types";

export const standaloneItems: (ExamQuestion & { versionLabel?: string })[] = [
  {
    "id": "standalone-vague-pronoun-1",
    "topic": "Pronouns",
    "type": "multiple_choice",
    "prompt": "Which sentence of the paragraph should be revised to correct a vague pronoun?",
    "stimulus": "(1) Eliza and Brianna have been singing in their school chorus since they were in fourth grade.  (2) The girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events.  (3) Outside of school, she also sings in a choir made up of young and old members of her community.  (4) Both girls hope that they will be able to continue singing for many more years.",
    "correctChoiceId": "C",
    "points": 1,
    "choices": [
      {
        "id": "A",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "text": "sentence 4"
      }
    ]
  },
  {
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Delete the comma after&nbsp;<strong><em>Yalina</em></strong>, AND change&nbsp;<em><strong>their</strong></em>&nbsp;to&nbsp;<strong>her</strong>.",
        "text": "Sentence 1: Delete the comma after \nYalina\n, AND change \ntheir\n to \nher\n."
      },
      {
        "id": "B",
        "html": "Sentence 2: Change&nbsp;<em><strong>is</strong></em>&nbsp;to&nbsp;<strong>are</strong>, AND delete the comma after&nbsp;<em><strong>bowl</strong></em>.",
        "text": "Sentence 2: Change \nis\n to \nare\n, AND delete the comma after \nbowl\n."
      },
      {
        "id": "C",
        "html": "Sentence 3: Change&nbsp;<em><strong>it&nbsp;is</strong></em>&nbsp;to&nbsp;<strong>they&nbsp;are</strong>, AND delete the comma after&nbsp;<em><strong>smooth</strong></em>.",
        "text": "Sentence 3: Change \nit \nis\n to \nthey \nare\n, AND delete the comma after \nsmooth\n."
      },
      {
        "id": "D",
        "html": "Sentence 4: Change&nbsp;<em><strong>they&nbsp;start</strong></em>&nbsp;to&nbsp;<strong>it&nbsp;starts</strong>, AND insert a comma after&nbsp;<em><strong>sweet</strong></em>.",
        "text": "Sentence 4: Change \nthey \nstart\n to \nit \nstarts\n, AND insert a comma after \nsweet\n."
      }
    ],
    "correctChoiceId": "D",
    "id": "standalone-pancakes-1",
    "points": 1,
    "prompt": "Which pair of revisions is needed to correct the errors in the paragraph?",
    "stimulus": "(1) Yalina, Michael, and Malcolm love making pancakes with their granddad on Saturday mornings.  (2) Yalina's job is to open the box and pour the pancake mix into a bowl, slowly adding water, eggs, melted butter, and blueberries.  (3) Michael uses a wooden spoon to vigorously stir the mixture until it is smooth, and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time.  (4) Granddad turns each pancake when they start to bubble, while all three siblings get the table ready for a sweet delicious breakfast.",
    "stimulusHtml": "(1) <u>Yalina,</u> Michael, and Malcolm love making pancakes with <u>their</u> granddad on Saturday mornings. (2) Yalina’s job is to open the box and pour the pancake mix into a <u>bowl,</u> slowly adding water, eggs, melted butter, <u>and</u> blueberries. (3) Michael uses a wooden spoon to vigorously stir the mixture until it is <u>smooth,</u> and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time. (4) Granddad turns each pancake when <u>they start</u> to bubble, while all three siblings get the table ready for a <u>sweet</u> delicious breakfast.",
    "topic": "Pronouns",
    "type": "multiple_choice"
  },
  {
    "id": "standalone-pangaea-sentence-structure-1",
    "topic": "Sentence Structure",
    "type": "multiple_choice",
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?",
    "stimulus": "The land on Earth has not always been separated into the seven continents, at one time a massive supercontinent, known as Pangaea, covered one-third of Earth's surface. Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth's Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth's crust. In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.",
    "stimulusHtml": "The land on Earth has not always been separated into the seven <u>continents, at</u> one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s <u>surface. Additionally,</u> the supercontinent was surrounded by ocean waters called <u>Panthalassa, much</u> of which were in Earth’s Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s <u>crust. In fact,</u> experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.",
    "correctChoiceId": "A",
    "points": 1,
    "choices": [
      {
        "id": "A",
        "text": "continents. At"
      },
      {
        "id": "B",
        "text": "surface; additionally,"
      },
      {
        "id": "C",
        "text": "Panthalassa. Much"
      },
      {
        "id": "D",
        "text": "crust, in fact,"
      }
    ]
  },
  {
    "id": "standalone-blobfish-construction-1",
    "topic": "Pronouns",
    "type": "category_sort",
    "prompt": "Which sentence in the paragraph contains an error in construction?",
    "stimulus": "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh.  (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor.  (3) It must wait patiently for whatever edible matter might float by its mouth.  (4) The blobfish's downturned mouth, slimy skin, and pale coloring caused them to be voted the World's Ugliest Animal in 2013.",
    "instructions": "Move the answer to the box. There is only one error in construction.",
    "correctPlacements": {
      "sentence-4": "construction-error"
    },
    "points": 1,
    "requiredPlacements": 1,
    "categories": [
      {
        "id": "construction-error",
        "title": "Contains an error in construction"
      }
    ],
    "items": [
      {
        "id": "sentence-1",
        "text": "Sentence 1"
      },
      {
        "id": "sentence-2",
        "text": "Sentence 2"
      },
      {
        "id": "sentence-3",
        "text": "Sentence 3"
      },
      {
        "id": "sentence-4",
        "text": "Sentence 4"
      }
    ]
  },
  {
    "id": "part-b-question-5",
    "points": 1,
    "prompt": "Read these sentences.\nWhat is the best way to combine the sentences to clarify the relationship between the ideas?",
    "promptHtml": "Read these sentences.\nWhat is the best way to combine the sentences to clarify the relationship between the ideas?",
    "stimulus": "(1) Flyby missions near Jupiter have been happening since 1973.\n\n\n\n(2) Flyby missions allow scientists to collect data about Jupiter and its moons.",
    "stimulusHtml": "(1) Flyby missions near Jupiter have been happening since 1973.\n<br>\n<br>(2) Flyby missions allow scientists to collect data about Jupiter and its moons.",
    "topic": "Sentence Structure",
    "versionLabel": "2025-2026 Form B",
    "choices": [
      {
        "id": "A",
        "html": "While flyby missions near Jupiter have been happening since 1973, scientists collect data about the planet and its moons.",
        "text": "While flyby missions near Jupiter have been happening since 1973, scientists collect data about the planet and its moons."
      },
      {
        "id": "B",
        "html": "Although&nbsp;there&nbsp;have&nbsp;been&nbsp;flyby&nbsp;missions&nbsp;near&nbsp;Jupiter&nbsp;since&nbsp;1973,&nbsp;they&nbsp;have&nbsp;allowed&nbsp;scientists&nbsp;to&nbsp;collect&nbsp;data&nbsp;about&nbsp;the&nbsp;planet&nbsp;and&nbsp;its&nbsp;moons.",
        "text": "Although there have been flyby missions near Jupiter since 1973, they have allowed scientists to collect data about the planet and its moons."
      },
      {
        "id": "C",
        "html": "Flyby&nbsp;missions&nbsp;near&nbsp;Jupiter,&nbsp;which&nbsp;allow&nbsp;scientists&nbsp;to&nbsp;collect&nbsp;data&nbsp;about&nbsp;the&nbsp;planet&nbsp;and&nbsp;its&nbsp;moons,&nbsp;have&nbsp;been&nbsp;happening&nbsp;since&nbsp;1973.",
        "text": "Flyby missions near Jupiter, which allow scientists to collect data about the planet and its moons, have been happening since 1973."
      },
      {
        "id": "D",
        "html": "Flyby&nbsp;missions&nbsp;have&nbsp;been&nbsp;happening&nbsp;near&nbsp;Jupiter,&nbsp;but&nbsp;scientists&nbsp;have&nbsp;been&nbsp;collecting&nbsp;data&nbsp;about&nbsp;the&nbsp;planet&nbsp;and&nbsp;its&nbsp;moons&nbsp;since&nbsp;1973.",
        "text": "Flyby missions have been happening near Jupiter, but scientists have been collecting data about the planet and its moons since 1973."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "part-b-question-6",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction and should be revised?",
    "promptHtml": "Which&nbsp;sentence&nbsp;in&nbsp;the&nbsp;paragraph&nbsp;contains&nbsp;an&nbsp;error&nbsp;in&nbsp;construction&nbsp;and&nbsp;should&nbsp;be&nbsp;revised?",
    "stimulus": "(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City.  (2) Leaving approximately 73,000 residents without electricity for three long hours, lights did not function, refrigerators did not stay cold, and air conditioners did not work.  (3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier—on the exact same day!  (4) The famous New York City Blackout of 1977, which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.",
    "stimulusHtml": "(1)&nbsp;On&nbsp;the&nbsp;evening&nbsp;of&nbsp;July&nbsp;13,&nbsp;2019,&nbsp;a&nbsp;major&nbsp;power&nbsp;outage&nbsp;affected&nbsp;the&nbsp;Upper&nbsp;West&nbsp;Side&nbsp;of&nbsp;Manhattan&nbsp;in&nbsp;New&nbsp;York&nbsp;City. &nbsp;(2)&nbsp;Leaving&nbsp;approximately&nbsp;73,000&nbsp;residents&nbsp;without&nbsp;electricity&nbsp;for&nbsp;three&nbsp;long&nbsp;hours,&nbsp;lights&nbsp;did&nbsp;not&nbsp;function,&nbsp;refrigerators&nbsp;did&nbsp;not&nbsp;stay&nbsp;cold,&nbsp;and&nbsp;air&nbsp;conditioners&nbsp;did&nbsp;not&nbsp;work. &nbsp;(3)&nbsp;Longtime&nbsp;city&nbsp;residents&nbsp;were&nbsp;particularly&nbsp;confused&nbsp;because&nbsp;an&nbsp;eerily&nbsp;similar&nbsp;event&nbsp;had&nbsp;occurred&nbsp;years&nbsp;earlier—on&nbsp;the&nbsp;exact&nbsp;same&nbsp;day! &nbsp;(4)&nbsp;The&nbsp;famous&nbsp;New&nbsp;York&nbsp;City&nbsp;Blackout&nbsp;of&nbsp;1977,&nbsp;which&nbsp;lasted&nbsp;for&nbsp;25&nbsp;hours,&nbsp;also&nbsp;happened&nbsp;on&nbsp;July&nbsp;13,&nbsp;an&nbsp;odd&nbsp;coincidence&nbsp;to&nbsp;say&nbsp;the&nbsp;least.",
    "topic": "Modifiers",
    "versionLabel": "2025-2026 Form B",
    "categories": [
      {
        "id": "answer-box",
        "title": "Contains an error in construction"
      }
    ],
    "categoryCapacity": 1,
    "correctPlacements": {
      "answer-card-2": "answer-box"
    },
    "instructions": "Move the answer to the box. There is only one correct answer.",
    "items": [
      {
        "id": "answer-card-1",
        "text": "Sentence 1"
      },
      {
        "id": "answer-card-2",
        "text": "Sentence 2"
      },
      {
        "id": "answer-card-3",
        "text": "Sentence 3"
      },
      {
        "id": "answer-card-4",
        "text": "Sentence 4"
      }
    ],
    "requiredPlacements": 1,
    "type": "category_sort"
  },
  {
    "id": "part-b-question-7",
    "points": 1,
    "prompt": "How should the paragraph be revised?",
    "promptHtml": "How&nbsp;should&nbsp;the&nbsp;paragraph&nbsp;be&nbsp;revised?",
    "stimulus": "(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.",
    "stimulusHtml": "(1)&nbsp;Danielle&nbsp;<u>spent</u>&nbsp;several&nbsp;hours&nbsp;preparing&nbsp;for&nbsp;an&nbsp;upcoming&nbsp;audition&nbsp;for&nbsp;a&nbsp;<u>play</u>&nbsp;at&nbsp;the&nbsp;community&nbsp;theater. (2)&nbsp;First&nbsp;she&nbsp;<u>did</u>&nbsp;vocal&nbsp;exercises&nbsp;to&nbsp;practice&nbsp;her&nbsp;diction&nbsp;and&nbsp;<u>projection</u>&nbsp;so&nbsp;that&nbsp;her&nbsp;words&nbsp;would&nbsp;carry&nbsp;clearly&nbsp;throughout&nbsp;the&nbsp;large&nbsp;auditorium. (3)&nbsp;Then&nbsp;she&nbsp;<u>studies</u>&nbsp;the&nbsp;text&nbsp;of&nbsp;the&nbsp;monologue&nbsp;to&nbsp;better&nbsp;understand&nbsp;the&nbsp;<u>emotions,</u>&nbsp;and&nbsp;motivations&nbsp;of&nbsp;the&nbsp;character&nbsp;she&nbsp;plans&nbsp;to&nbsp;portray. (4)&nbsp;Finally&nbsp;she&nbsp;<u>recited</u>&nbsp;her&nbsp;monologue&nbsp;in&nbsp;front&nbsp;of&nbsp;a&nbsp;mirror&nbsp;many&nbsp;<u>times,</u>&nbsp;making&nbsp;slight&nbsp;adjustments&nbsp;and&nbsp;improvements&nbsp;to&nbsp;her&nbsp;performance&nbsp;each&nbsp;time.",
    "topic": "Verbs",
    "versionLabel": "2025-2026 Form B",
    "choices": [
      {
        "id": "A",
        "html": "Sentence&nbsp;1:&nbsp;Change&nbsp;<em><strong>spent</strong></em>&nbsp;to&nbsp;<strong>had&nbsp;spent</strong>,&nbsp;AND&nbsp;insert&nbsp;a&nbsp;comma&nbsp;after&nbsp;<em><strong>play</strong></em>.",
        "text": "Sentence 1: Change \nspent\n to \nhad spent\n, AND insert a comma after \nplay\n."
      },
      {
        "id": "B",
        "html": "Sentence&nbsp;2:&nbsp;Change&nbsp;<em><strong>did</strong></em>&nbsp;to&nbsp;<strong>does</strong>,&nbsp;AND&nbsp;insert&nbsp;a&nbsp;comma&nbsp;after&nbsp;<em><strong>projection</strong></em>.",
        "text": "Sentence 2: Change \ndid\n to \ndoes\n, AND insert a comma after \nprojection\n."
      },
      {
        "id": "C",
        "html": "Sentence&nbsp;3:&nbsp;Change&nbsp;<em><strong>studies</strong></em>&nbsp;to&nbsp;<strong>studied</strong>,&nbsp;AND&nbsp;delete&nbsp;the&nbsp;comma&nbsp;after&nbsp;<em><strong>emotions</strong></em>.",
        "text": "Sentence 3: Change \nstudies\n to \nstudied\n, AND delete the comma after \nemotions\n."
      },
      {
        "id": "D",
        "html": "Sentence&nbsp;4:&nbsp;Change&nbsp;<em><strong>recited</strong></em>&nbsp;to&nbsp;<strong>recites</strong>,&nbsp;AND&nbsp;delete&nbsp;the&nbsp;comma&nbsp;after&nbsp;<em><strong>times</strong></em>.",
        "text": "Sentence 4: Change \nrecited\n to \nrecites\n, AND delete the comma after \ntimes\n."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export function getStandaloneItemsById(ids: string[]) {
  return ids.map((id) => {
    const item = standaloneItems.find((candidate) => candidate.id === id);

    if (!item) {
      throw new Error(`Unknown standalone item: ${id}`);
    }

    const studentQuestion: ExamQuestion = { ...item };
    delete (studentQuestion as ExamQuestion & { versionLabel?: string }).versionLabel;
    return studentQuestion;
  });
}
