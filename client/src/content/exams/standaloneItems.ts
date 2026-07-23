import type { ExamQuestion } from "./types";

export const standaloneItems: ExamQuestion[] = [
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
    "topic": "Conventions & Grammar",
    "type": "multiple_choice"
  },
  {
    "id": "standalone-pangaea-sentence-structure-1",
    "topic": "Sentence Construction",
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
    "topic": "Sentence Construction",
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
  }
];

export function getStandaloneItemsById(ids: string[]) {
  return ids.map((id) => {
    const item = standaloneItems.find((candidate) => candidate.id === id);

    if (!item) {
      throw new Error(`Unknown standalone item: ${id}`);
    }

    return item;
  });
}
