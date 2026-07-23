# Exam Content Studio

Run this from the repository root:

```powershell
npm run exam-editor
```

The browser editor opens at `http://127.0.0.1:4319`.

- **Passage library** creates and edits TypeScript passage-set files in
  `client/src/content/exams/passageSets`.
- **Part B question bank** creates and edits reusable Revising/Editing Part B
  multiple-choice and one-answer-box drag-and-drop questions. Paste the
  question paragraph and answers, retain bold, italic, and underlined
  formatting, mark the key with a scantron bubble, and inspect a student-style
  preview before writing the question into code.
- **English test creator** selects an existing assessment, writes its ordered
  passage imports to `client/src/content/exams/tests`, and synchronizes
  `server/data/assessments.json`. Passages are assigned to Reading
  Comprehension or Revising/Editing Part A. Only Reading Comprehension
  passages are included in teacher-assigned shuffled forms; Part A stays
  fixed afterward. Revising/Editing Part B is built from stand-alone
  questions selected and ordered as the final English section.
- **Math question creator** starts by selecting an exam, then creates or edits
  that exam's unique Math section in `client/src/content/exams/mathSets`.
  Multiple-choice and multi-select answers use scantron-style answer keys.
  Short-answer and numeric-entry questions support one or more accepted
  responses. Inline drop-down questions use a sentence builder: write the text
  before and after each menu, add its options, and mark the correct option with
  a bubble.
- The Math editor includes one-click fraction, exponent, square-root, and
  symbol insertion plus the same bold, italic, underline, superscript,
  subscript, undo, and clear-formatting toolbar used by English. Rich formatting
  works in math prompts, directions, and student-readable answer choices, with
  live KaTeX rendering, preserved prompt line breaks, and optional
  question-image uploads with accessible descriptions and captions.
  Existing TEI formats remain intact so more friendly TEI editors can be added
  later.
- Poem mode preserves every pasted line and blank line. Prose and
  sentence-numbered modes preserve paragraph boundaries.
- Passage details include an optional italic blurb above the title, an optional
  subtitle/author, and an optional image upload with accessibility text and a
  caption. The Passage ID can be generated from the title with one click.
  Uploaded images are copied into `client/public/exam-images` and appear below
  the passage source/copyright footer.
- The passage, question prompt, answer choice, and category-card fields include
  familiar bold, italic, underline, strikethrough, superscript, subscript,
  undo, redo, and clear-formatting controls. Pasting directly into these fields
  retains supported formatting from online sources and document editors.
- **Open student exam preview** displays the current unsaved draft with the
  real exam-player styling, rich passage formatting, passage images, question
  navigation, and selectable answer choices.
- Questions can be authored as multiple choice, multi-select, or category
  sort. Multi-select questions may add a fifth choice (E), and all available
  choices receive scantron-style correct-answer bubbles. Category sort includes
  both multiple-answers-per-box and one-answer-per-box versions. In the
  one-answer-per-box version, extra cards can be marked **Not used** as
  distractors; only one correct card is assigned to each category.
- English questions also support **table match**. Authors can edit both column
  headers, add or remove labeled rows, create a bank of answer cards, assign
  exactly one correct card per row, and leave extra cards unused as
  distractors.
- The editor binds write requests to localhost and uses a new random edit token
  each time it starts.

Validate that the editor can read every current passage and test without
starting the browser UI:

```powershell
npm run exam-editor:validate
```
