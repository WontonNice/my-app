# Math Question Screenshot Import

The Content Studio accepts one JSON object at a time. In **Exam math**, choose
an exam, select **Import KaTeX question**, paste the JSON, and choose
**Validate and review**. The question is rendered for review before it can be
added to the unsaved exam draft. It is not written to source until you choose
**Write Math section into code**.

## Prompt to give ChatGPT

Upload the screenshot to ChatGPT and paste this prompt:

```text
Convert the attached math-question screenshot into Nathan Tutors Math Import JSON.

Return ONLY one valid JSON object. Do not use Markdown fences or add commentary outside the JSON.

Use this exact envelope:
{
  "format": "nathan-tutors-math-question-v1",
  "question": {
    "id": "short-descriptive-lowercase-id",
    "type": "multiple_choice",
    "topic": "Algebra",
    "points": 1,
    "instructions": "",
    "prompt": "Question text with inline math such as \\(x^2+3x\\) and display math such as \\[\\frac{a}{b}\\].",
    "choices": [
      { "id": "A", "text": "accessible spoken/plain-text answer", "math": "\\frac{1}{2}" },
      { "id": "B", "text": "accessible spoken/plain-text answer", "math": "2" },
      { "id": "C", "text": "accessible spoken/plain-text answer", "math": "3" },
      { "id": "D", "text": "accessible spoken/plain-text answer", "math": "4" }
    ],
    "correctChoiceId": "A"
  },
  "reviewNotes": ["List anything uncertain or inferred here."],
  "imageDescription": ""
}

Rules:
- Transcribe every visible word, number, symbol, unit, and answer choice accurately.
- Solve the problem and provide the correct answer key. If uncertain, explain why in reviewNotes.
- JSON backslashes MUST be escaped. For example, write "\\frac{1}{2}", not "\frac{1}{2}".
- In prompt and instructions, wrap inline KaTeX in \\(...\\) and display KaTeX in \\[...\\].
- In each choice, "math" is raw KaTeX without \\(...\\); "text" is a readable/accessibility equivalent.
- Omit "math" when a choice is ordinary text.
- For a generated number-line choice, omit "math" and add "numberLine" with: min, max, tickStep, labelStep, solutionStart, solutionEnd, startClosed, endClosed, extendLeft, and extendRight.
- Use true for startClosed or endClosed when the endpoint is a filled circle; use false for an open circle. Use extendLeft or extendRight for a solution ray.
- If an answer choice must remain a PNG or SVGZ, do not invent an image URL. Describe each image choice in its "text" field and mention in reviewNotes that its file must be uploaded in the Studio.
- Allowed topics: Arithmetic, Algebra, Geometry, Measurement, Number Sense, Percent, Probability & Statistics, Rates & Unit Conversion, Ratios & Proportions, Uncategorized.
- Allowed types:
  - multiple_choice: choices plus correctChoiceId.
  - multi_select: choices plus correctChoiceIds and requiredSelections.
  - short_response: correctTextAnswers and a plain response box.
  - numeric_entry: correctTextAnswers and entryLayout (plain, x_equals, or fraction) for the on-screen keypad.
  - math_drag_drop: items, dragDropSlots, dragDropContent, and allowReuse.
  - graph_point_select: graph points and correctPointIds.
  - number_line_response: numberLineResponse settings.
  - inline_dropdown: dropdownContent and dropdowns; each sentence must contain exactly one matching {{menu-id}} placeholder.
- Use lowercase letters, numbers, and hyphens for the question id.
- Never invent an image URL. If a diagram, graph, table, or other visual is required, describe it precisely in imageDescription and mention it in reviewNotes. The original image will be uploaded separately in the Studio.
- Preserve multi-line expressions and all important layout information using KaTeX.
- Do not include fields that are not part of this format.
```

The same prompt is available from the Studio with **Copy ChatGPT screenshot
prompt**.

## Other supported answer formats

Multi-select:

```json
{
  "format": "nathan-tutors-math-question-v1",
  "question": {
    "id": "equivalent-expressions",
    "type": "multi_select",
    "topic": "Algebra",
    "points": 1,
    "instructions": "Select the two correct answers.",
    "prompt": "Which expressions are equivalent to \\(2(x+3)\\)?",
    "choices": [
      { "id": "A", "text": "2x plus 6", "math": "2x+6" },
      { "id": "B", "text": "2x plus 3", "math": "2x+3" },
      { "id": "C", "text": "x plus 6", "math": "x+6" },
      { "id": "D", "text": "6 plus 2x", "math": "6+2x" }
    ],
    "correctChoiceIds": ["A", "D"],
    "requiredSelections": 2
  },
  "reviewNotes": [],
  "imageDescription": ""
}
```

Calculator input:

```json
{
  "format": "nathan-tutors-math-question-v1",
  "question": {
    "id": "solve-for-x",
    "type": "numeric_entry",
    "topic": "Algebra",
    "points": 1,
    "instructions": "Enter your answer in the space.",
    "prompt": "Solve \\(3x+4=19\\).",
    "entryLayout": "x_equals",
    "correctTextAnswers": ["5"]
  },
  "reviewNotes": [],
  "imageDescription": ""
}
```

Generated number-line choice:

```json
{
  "id": "C",
  "text": "open interval from negative eight to four",
  "numberLine": {
    "min": -10,
    "max": 10,
    "tickStep": 1,
    "labelStep": 5,
    "solutionStart": -8,
    "solutionEnd": 4,
    "startClosed": false,
    "endClosed": false,
    "extendLeft": false,
    "extendRight": false
  }
}
```

Every import is normalized and checked for required fields, supported question
types, valid answer keys, duplicate IDs, and matching drop-down placeholders.
