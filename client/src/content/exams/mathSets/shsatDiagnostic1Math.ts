import type { ExamMathSection } from "../types";

export const shsatDiagnostic1MathSection: ExamMathSection = {
  directions: {
    body:
      "Solve each problem. Select the answer from the choices given or enter your answer in the space provided. When you are solving problems, you can use the online notepad tool or write on the scrap paper given to you.",
    breadcrumbLabel: "MATH DIRECTIONS",
    notes: [
      "Formulas and definitions of mathematical terms and symbols are not provided.",
      "Diagrams other than graphs are not necessarily drawn to scale. Do not assume any relationship in a diagram unless it is specifically stated or can be determined from the information given.",
      "Assume that a diagram is in one plane unless the question specifically states that it is not.",
      "Graphs are drawn to scale. Unless stated otherwise, you can assume relationships according to appearance. For example, lines on a graph that appear to be parallel can be assumed to be parallel. This is also true for concurrent lines, straight lines, collinear points, right angles, etc.",
    ],
    subject: "MATHEMATICS",
    title: "IMPORTANT NOTES",
  },
  id: "shsat-diagnostic-1-math",
  label: "Math",
  questionCount: 10,
  questions: [
    {
      choices: [
        { id: "A", text: "5" },
        { id: "B", text: "6" },
        { id: "C", text: "7" },
        { id: "D", text: "8" },
      ],
      correctChoiceId: "C",
      id: "shsat-diagnostic-1-math-linear-equation",
      prompt: "If 3x + 7 = 28, what is the value of x?",
      type: "multiple_choice",
    },
    {
      choices: [
        { id: "A", math: "\\frac{55 \\cdot 5,280}{1}", text: "55 times 5,280 over 1" },
        { id: "B", math: "\\frac{55 \\cdot 5,280}{3,600}", text: "55 times 5,280 over 3,600" },
        { id: "C", math: "\\frac{55 \\cdot 3,600}{5,280}", text: "55 times 3,600 over 5,280" },
        { id: "D", math: "\\frac{55 \\cdot 5,280}{60}", text: "55 times 5,280 over 60" },
      ],
      correctChoiceId: "B",
      id: "shsat-diagnostic-1-math-car-speed-conversion",
      prompt:
        "A car is traveling 55 miles per hour, and 1 mile = 5,280 feet. Which of the following calculations would give the car's speed in **feet per second**?",
      type: "multiple_choice",
    },
    {
      choices: [
        { id: "A", text: "$45" },
        { id: "B", text: "$48" },
        { id: "C", text: "$54" },
        { id: "D", text: "$60" },
      ],
      correctChoiceId: "C",
      id: "shsat-diagnostic-1-math-percent-discount",
      prompt:
        "A jacket originally costs $60. During a sale, the price is reduced by 10%. What is the sale price of the jacket?",
      type: "multiple_choice",
    },
    {
      correctTextAnswers: ["-4"],
      id: "shsat-diagnostic-1-math-numeric-equation",
      instructions: "Enter your answer in the space.",
      prompt: "For what value of \\(w\\) is \\(4w = 2w - 8\\)?",
      type: "numeric_entry",
    },
    {
      dropdownContent: [
        "An equation that relates the number of stamps originally in Liam's and Kevin's collections is\n\\(L\\) = {{originalRelation}} \\(K\\).",
        "After Liam gives 8 stamps to Kevin, the equation becomes \\(L - 8\\) = {{afterTransfer}}.",
        "By solving the equation, it can be determined that Liam started with {{liamStart}} stamps.",
      ],
      dropdowns: [
        {
          correctChoiceId: "2",
          id: "originalRelation",
          options: [
            { id: "1/2", text: "1/2" },
            { id: "2", text: "2" },
            { id: "8", text: "8" },
            { id: "12", text: "12" },
          ],
        },
        {
          correctChoiceId: "k-plus-8-plus-12",
          id: "afterTransfer",
          options: [
            { id: "k-plus-8", math: "K + 8", text: "K + 8" },
            { id: "k-minus-8", math: "K - 8", text: "K - 8" },
            { id: "k-plus-8-plus-12", math: "K + 8 + 12", text: "K + 8 + 12" },
            { id: "k-minus-8-plus-12", math: "K - 8 + 12", text: "K - 8 + 12" },
          ],
        },
        {
          correctChoiceId: "56",
          id: "liamStart",
          options: [
            { id: "20", text: "20" },
            { id: "28", text: "28" },
            { id: "40", text: "40" },
            { id: "56", text: "56" },
          ],
        },
      ],
      id: "shsat-diagnostic-1-math-stamp-dropdowns",
      instructions: "Select the correct answer from each drop-down to complete the sentences.",
      prompt:
        "Liam and Kevin each collect stamps. Liam has twice as many stamps as Kevin. Liam gives 8 of his stamps to Kevin. Liam now has 12 more stamps than Kevin.\n\nHow many stamps did Liam start with?",
      type: "inline_dropdown",
    },
    {
      correctTextAnswers: ["18"],
      id: "shsat-diagnostic-1-math-parallelogram-pqrs",
      image: {
        alt: "Parallelogram PQRS with a 72 degree exterior angle at S and angle x marked near Q.",
        src: "/exam-images/math/image.png",
      },
      instructions: "Enter your answer in the space.",
      prompt: "In the figure above, \\(PQRS\\) is a parallelogram. What is the value of \\(x\\)?",
      type: "numeric_entry",
    },
    {
      choices: [
        { id: "A", text: "3" },
        { id: "B", text: "4" },
        { id: "C", text: "5" },
        { id: "D", text: "6" },
      ],
      correctChoiceId: "B",
      id: "shsat-diagnostic-1-math-rectangle-width",
      prompt:
        "A rectangle has an area of 48 square inches and a length of 12 inches. What is the width of the rectangle?",
      type: "multiple_choice",
    },
    {
      choices: [
        { id: "A", text: "1/6" },
        { id: "B", text: "1/4" },
        { id: "C", text: "1/3" },
        { id: "D", text: "1/2" },
      ],
      correctChoiceId: "B",
      id: "shsat-diagnostic-1-math-probability",
      prompt:
        "A bag contains 3 red marbles, 4 blue marbles, and 5 green marbles. If one marble is chosen at random, what is the probability that it is red?",
      type: "multiple_choice",
    },
    {
      choices: [
        { id: "A", text: "42" },
        { id: "B", text: "45" },
        { id: "C", text: "48" },
        { id: "D", text: "54" },
      ],
      correctChoiceId: "C",
      id: "shsat-diagnostic-1-math-ratio-total",
      prompt:
        "The ratio of boys to girls in a club is 5:3. If there are 30 boys in the club, how many students are in the club altogether?",
      type: "multiple_choice",
    },
    {
      choices: [
        { id: "A", math: "5 - n + 6n + 21 - 5n - 8", text: "5 minus n plus 6n plus 21 minus 5n minus 8" },
        { id: "B", math: "5 - n + 6n + 21 - 5n + 8", text: "5 minus n plus 6n plus 21 minus 5n plus 8" },
        { id: "C", math: "5 - n + 5n + 21 - 5n - 8", text: "5 minus n plus 5n plus 21 minus 5n minus 8" },
        { id: "D", math: "18 - n", text: "18 minus n" },
        { id: "E", math: "18", text: "18" },
        { id: "F", math: "34", text: "34" },
      ],
      correctChoiceIds: ["A", "E"],
      id: "shsat-diagnostic-1-math-expression-sum-equivalents",
      prompt:
        "Three expressions are given:\n\n\\(-2(2.5n + 4)\\)\n\\(5 - n\\)\n\\(3(2n + 7)\\)\n\nWhich of these are equivalent to the sum of these three expressions?",
      requiredSelections: 2,
      instructions: "Select the **two** correct answers.",
      type: "multi_select",
    },
  ],
};
