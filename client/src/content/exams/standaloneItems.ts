import type { ExamQuestion } from "./types";

export const standaloneItems: ExamQuestion[] = [
  {
    id: "standalone-vague-pronoun-1",
    type: "multiple_choice",
    prompt: "Which sentence of the paragraph should be revised to correct a vague pronoun?",
    stimulus:
      "(1) Eliza and Brianna have been singing in their school chorus since they were in fourth grade.  (2) The girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events.  (3) Outside of school, she also sings in a choir made up of young and old members of her community.  (4) Both girls hope that they will be able to continue singing for many more years.",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "sentence 1" },
      { id: "B", text: "sentence 2" },
      { id: "C", text: "sentence 3" },
      { id: "D", text: "sentence 4" },
    ],
  },
  {
    id: "standalone-pancakes-1",
    type: "multiple_choice",
    prompt: "Which pair of revisions is needed to correct the errors in the paragraph?",
    stimulus:
      "(1) Yalina, Michael, and Malcolm love making pancakes with their granddad on Saturday mornings.  (2) Yalina's job is to open the box and pour the pancake mix into a bowl, slowly adding water, eggs, melted butter, and blueberries.  (3) Michael uses a wooden spoon to vigorously stir the mixture until it is smooth, and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time.  (4) Granddad turns each pancake when they start to bubble, while all three siblings get the table ready for a sweet delicious breakfast.",
    correctChoiceId: "D",
    points: 1,
    choices: [
      {
        id: "A",
        text: "Sentence 1: Delete the comma after **Yalina,** AND change **their** to her.",
      },
      {
        id: "B",
        text: "Sentence 2: Change **is** to **are,** AND delete the comma after **bowl.**",
      },
      {
        id: "C",
        text: "Sentence 3: Change **it is** to **they are,** AND delete the comma after **smooth.**",
      },
      {
        id: "D",
        text: "Sentence 4: Change **they start** to **it starts,** AND insert a comma after **sweet.**",
      },
    ],
  },
  {
    id: "standalone-blobfish-construction-1",
    type: "category_sort",
    prompt: "Which sentence in the paragraph contains an error in construction?",
    stimulus:
      "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh.  (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor.  (3) It must wait patiently for whatever edible matter might float by its mouth.  (4) The blobfish's downturned mouth, slimy skin, and pale coloring caused them to be voted the World's Ugliest Animal in 2013.",
    instructions: "Move the answer to the box. There is only one error in construction.",
    correctPlacements: {
      "sentence-4": "construction-error",
    },
    points: 1,
    requiredPlacements: 1,
    categories: [
      {
        id: "construction-error",
        title: "Contains an error in construction",
      },
    ],
    items: [
      { id: "sentence-1", text: "Sentence 1" },
      { id: "sentence-2", text: "Sentence 2" },
      { id: "sentence-3", text: "Sentence 3" },
      { id: "sentence-4", text: "Sentence 4" },
    ],
  },
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
