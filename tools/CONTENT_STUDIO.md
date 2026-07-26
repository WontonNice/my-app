# Nathan Tutors Content Studio

Run the centralized local editor from the repository root:

```powershell
npm run content-editor
```

The Studio opens at `http://127.0.0.1:4319` and provides six connected
workspaces:

- **Exam passages** creates and edits passage sets in
  `client/src/content/exams/passageSets`.
- **Exam Part B** manages the reusable Revising/Editing Part B bank.
- **Exam builder** assembles English sections and synchronizes assessment data.
- **Exam math** creates each exam's math section with rich text, formulas,
  answer keys, drop-downs, question and answer-choice images (including SVGZ), editable
  generated number lines, an expanded KaTeX formula library, selected
  text-to-variable formatting, drag-and-drop question ordering, and a
  screenshot-to-JSON import review flow.
- **Advanced practice** creates and edits the library card, passage, and
  question set in `client/src/content/advancedPractice/passageSets`. New
  passages are registered in the advanced-practice index automatically.
- **Regular practice** accepts a complete question or one-box paste, previews
  the generated TypeScript, and writes it to the selected topic and difficulty
  bank in `client/src/content/practice/questionBanks`.

The existing `npm run exam-editor` and `npm run question-editor` commands are
compatibility aliases that open this same centralized Studio.

The implementation is consolidated into `tools/content-studio.mjs` and
`tools/content-studio.html`; the former standalone exam and question-bank
editor files are no longer needed.

For the exact screenshot conversion prompt and import schemas, see
`tools/MATH_QUESTION_IMPORT.md`. The same prompt can be copied from the Math
workspace.

Validate every connected content source without opening the browser:

```powershell
npm run content-editor:validate
```

All write requests are restricted to localhost and protected by a new random
edit token each time the Studio starts.
