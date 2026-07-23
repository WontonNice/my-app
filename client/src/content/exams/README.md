# Exam Content

This folder keeps exam content modular:

- `tests/`: every assembled and registered exam definition.
- `passageSets/`: one file per passage and its related questions.
- `standaloneItems.ts`: the shared Revising/Editing Part B stand-alone question bank.
- `mathSets/`: one file per exam math section. Math questions stay exam-specific instead of shared.
- `index.ts`: registers each test by `assessmentId`.
- `formatters.ts`: turns plain passage text into the line format the exam player renders.
- Passage set labels are calculated from the order in the test file, so you do not need to add or update
  `label: "ELA - Passage Set X of Y"` inside passage files.

For the fastest authoring workflow, run `npm run exam-editor` from the repository
root. Exam Content Studio writes these TypeScript files for you and supports
passage images, author subtitles, rich-text formatting, a dedicated Part B
stand-alone question-bank creator for multiple-choice and one-box drag-and-drop items, multiple choice,
five-choice multi-select, both category-sort modes, table-match questions, and
a live student-view preview. Table match supports editable column headers,
one answer per row, and unused distractors. Passage images render after the
source/copyright footer.

Math prompts, directions, and student-readable answer choices use the same
rich-text toolbar as English while retaining the formula toolbar and KaTeX
preview for fractions, variables, and other notation.

To add a new passage set:

1. Add a file in `passageSets/`, such as `passageSets/newPassageName.ts`.
2. Paste the passage into a plain text string.
3. Add the related questions in the same file.
4. Use a formatter so title, byline, spacing, and line numbers are handled outside the passage text.
   - Poems: `createPlainTextPassage({ title, author, text })`
   - Prose: `createProsePassage({ header, title, author, text })`
   - Revising/editing: `createSentenceNumberedPassage({ title, text })`

To add or change a test:

1. Create or edit a test file in `tests/`, such as `tests/shsatDiagnostic1.ts`.
2. Import the passage set modules you want.
3. Arrange them in `passageSets` and use `passageSections` to classify each
   passage as `reading` or `revising_editing_a`. Teacher-assigned forms reorder
   only `reading` passages; Part A remains fixed afterward.
4. Build Revising/Editing Part B by pulling stand-alone questions from
   `standaloneItems.ts` with `getStandaloneItemsById([...])`. They appear after
   passage-based Part A.
5. Register the test file in `index.ts`.

Math TEIs can live directly inside the exam's math set. Use `type: "numeric_entry"` for a one-box
numeric fill-in item with `instructions: "Enter your answer in the space."`.

The exam player loads local content by `assessmentId`. If a local test file is not registered yet, it falls back to
the basic assessment data from the server.
