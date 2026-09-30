# Official Math Question Importer

In **Exam math**, select the destination exam and choose **Import official PDF
question**. Enter one source question number, copy the prompt, attach the official
PDF in ChatGPT, and paste the returned raw JSON into the importer. The question
is validated and rendered for review before it is added to the unsaved exam
draft. Source code is not changed until **Write Math section into code** is used.

## Prompt to give ChatGPT

Replace `[ENTER ONE QUESTION NUMBER]` once. The Studio copy button fills in both
the selected exam title and question number automatically.

```text
You are converting exactly ONE math question from an old official paper SHSAT into my existing Nathan Tutors digital SHSAT Content Studio.

SOURCE / EXAM: 2020-2021 Form B
TARGET QUESTION: [ENTER ONE QUESTION NUMBER]

The old PDF is the authority for question content. My current digital platform is the authority for presentation and interaction. Inspect both the PDF text layer and the visibly rendered page containing the target question. When they disagree, trust the visible page. Do not process neighboring questions.

Return ONLY one valid raw JSON object. Do not use Markdown fences. Do not add any text before or after the JSON.

Use this exact envelope for a multiple-choice question:
{
  "format": "nathan-tutors-math-question-v1",
  "question": {
    "id": "2020-2021-form-b-q63",
    "type": "multiple_choice",
    "topic": "Algebra",
    "points": 1,
    "instructions": "",
    "prompt": "Exact question wording with inline math such as \\(x^2+3x\\) and display math such as \\[\\frac{a}{b}\\].",
    "choices": [
      { "id": "A", "text": "accessible spoken/plain-text answer", "math": "\\frac{1}{2}" },
      { "id": "B", "text": "accessible spoken/plain-text answer", "math": "2" },
      { "id": "C", "text": "accessible spoken/plain-text answer", "math": "3" },
      { "id": "D", "text": "accessible spoken/plain-text answer", "math": "4" }
    ],
    "correctChoiceId": "A"
  },
  "reviewNotes": ["Source: 2020-2021 Form B, question [ENTER ONE QUESTION NUMBER]."],
  "imageDescription": ""
}

For an old paper grid-in, use this question shape instead of choices:
{
  "id": "2020-2021-form-b-q58",
  "type": "numeric_entry",
  "topic": "Algebra",
  "points": 1,
  "instructions": "Enter your answer.",
  "prompt": "Exact question wording with properly formatted KaTeX.",
  "entryLayout": "plain",
  "correctTextAnswers": ["-0.8"]
}

Conversion rules:
1. Process exactly the target question. Transcribe every word, value, variable, symbol, answer choice, label, and unit that belongs to it. Preserve the original mathematics and choice order. Do not simplify, modernize, or rewrite the task.
2. Remove paper-only mechanics: answer-sheet directions, bubble/grid directions, page numbers, column rules, booklet letters, and “continue” text. Do not reproduce the paper grid. Keep any instruction that is mathematically part of the question.
3. Old paper multiple choice becomes "multiple_choice" with "choices" and exactly one "correctChoiceId". Preserve the printed answer-choice letters exactly (A-D or E-H) as choice IDs.
4. Old paper grid-in becomes "numeric_entry", never "grid_in" and never "short_response". Use "entryLayout": "plain" for ordinary numbers, decimals, or general math; "fraction" only when a two-part numerator/denominator entry is truly appropriate; or "x_equals" only when the response should visibly be entered after x =. There is no separate equation-entry type: mathematical expressions use "numeric_entry" plus KaTeX-compatible "correctTextAnswers".
5. The grader performs format normalization, not algebraic evaluation. Put the canonical correct response first in "correctTextAnswers", then list every other representation that should intentionally receive credit, such as ["1/2", "0.5"]. Do not add a mathematically nonequivalent variant.
6. Solve the question independently and verify the stored answer against the visible source. For multiple choice, "correctChoiceId" must name one visible choice. If any source element or answer is genuinely uncertain, do not silently guess: describe the exact uncertainty in "reviewNotes".
7. Allowed topics are exactly: "Arithmetic", "Algebra", "Geometry", "Measurement", "Number Sense", "Percent", "Probability & Statistics", "Rates & Unit Conversion", "Ratios & Proportions", or "Uncategorized".
8. Use only lowercase letters, numbers, and hyphens in the question "id". Include the exam, form, and source question number when known, for example "2020-2021-form-b-q63". Do not invent a source-metadata field; this schema has none. Put the human-readable source reference in "reviewNotes".

Math and JSON rules:
9. JSON backslashes must be escaped. The JSON text for a fraction is "\\frac{1}{2}", never "\frac{1}{2}". The final response must parse as strict JSON: double quotes, no comments, no trailing commas, and no Markdown fence.
10. In "prompt" and "instructions", wrap inline KaTeX in \\(...\\) and display KaTeX in \\[...\\]. Use proper KaTeX for stacked fractions, mixed numbers, exponents, radicals, absolute value, inequalities, repeating decimals, and grouped expressions. Example mixed number: \\(4\\frac{2}{3}\\).
11. For a choice that is primarily a formula, include raw KaTeX in "math" without \\(...\\), plus a meaningful accessible "text" equivalent. A choice may use only one of "math", "image", or "numberLine". Omit "math" for ordinary prose or a value that should simply remain text.

Visual rules:
12. Keep question wording and answer interactions native digital content. Never use a screenshot of the whole question or page.
13. A static line graph, coordinate graph, labeled-points number line, geometry figure, 3D solid, probability diagram, or source table should remain a tightly cropped high-fidelity visual when the existing schema cannot reproduce it exactly. Do not invent an image URL and do not add an "image" object. Instead, give a precise, accessibility-ready description in top-level "imageDescription" and add a "reviewNotes" item saying which source figure must be cropped and uploaded as the question image in Content Studio.
14. If separate answer choices are visual (for example, the table choices in question 87 or a disjoint-union number-line choice), give each choice a precise accessible "text", omit "image" from the JSON, and list each required choice-image crop in "reviewNotes". The files will be uploaded to the choices after import.
15. Use a structured "numberLine" choice only for one continuous interval, segment, or ray that this schema can represent exactly. Its exact fields are:
{
  "id": "E",
  "text": "open interval from negative one to two",
  "numberLine": {
    "min": -3,
    "max": 3,
    "tickStep": 1,
    "labelStep": 1,
    "solutionStart": -1,
    "solutionEnd": 2,
    "startClosed": false,
    "endClosed": false,
    "extendLeft": false,
    "extendRight": false
  }
}
Use a filled endpoint for true and an open endpoint for false. A ray uses "extendLeft" or "extendRight". Do not misuse this continuous-range shape for two disjoint rays; use separately uploaded choice images in that case.
16. Do not use "graph_point_select" for a source graph that the student only reads. That type is an interactive response and would change the question. A read-only source graph stays a visual attached to an otherwise faithful multiple-choice question.
17. If no visual is required, return an empty "imageDescription" string. If a visual is required, the description must include every relevant label, coordinate, dimension, endpoint style, tick value, row/column heading, and spatial relationship visible in the source.

Final verification before responding:
- Exactly one import object and exactly one question.
- "format" is exactly "nathan-tutors-math-question-v1".
- "type" is either "multiple_choice" or "numeric_entry" for this paper exam.
- Every visible answer choice is present in original order.
- All KaTeX backslashes are valid JSON escapes.
- The correct answer matches the transcribed question.
- No invented fields or image URLs.
- Any uncertainty or required manual visual upload is explicit in "reviewNotes".
```

## Verified mapping for 2020–2021 Form B

- Questions 58–62: `numeric_entry`; use the digital math keypad and omit the
  paper grid directions.
- Questions 63–114: `multiple_choice`; preserve the printed choice IDs and order.
- Source figures and tables: upload a tightly cropped question image after the
  JSON import. Question 87 needs individual choice images.
- Question 82 can use structured continuous-range `numberLine` choices.
  Question 110 contains disjoint solutions and therefore needs choice images.

The importer normalizes and checks required fields, supported types, answer
keys, duplicate IDs, KaTeX-bearing choices, number-line ranges, and accepted
numeric answers before the question can enter the unsaved draft.
