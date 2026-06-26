# Exam Content

This folder keeps exam content modular:

- `passageSets/`: one file per passage and its related questions.
- `standaloneItems.ts`: one shared bank for ELA stand-alone questions.
- `mathSets/`: one file per exam math section. Math questions stay exam-specific instead of shared.
- `shsatDiagnostic1.ts` and other test files: assemble passage sets into a test.
- `index.ts`: registers each test by `assessmentId`.
- `formatters.ts`: turns plain passage text into the line format the exam player renders.
- Passage set labels are calculated from the order in the test file, so you do not need to add or update
  `label: "ELA - Passage Set X of Y"` inside passage files.

To add a new passage set:

1. Add a file in `passageSets/`, such as `passageSets/newPassageName.ts`.
2. Paste the passage into a plain text string.
3. Add the related questions in the same file.
4. Use a formatter so title, byline, spacing, and line numbers are handled outside the passage text.
   - Poems: `createPlainTextPassage({ title, author, text })`
   - Prose: `createProsePassage({ header, title, author, text })`
   - Revising/editing: `createSentenceNumberedPassage({ title, text })`

To add or change a test:

1. Create or edit a test file, such as `shsatDiagnostic1.ts`.
2. Import the passage set modules you want.
3. Arrange them in `passageSets`.
4. Pull stand-alone questions from `standaloneItems.ts` with `getStandaloneItemsById([...])`.
5. Register the test file in `index.ts`.

Math TEIs can live directly inside the exam's math set. Use `type: "numeric_entry"` for a one-box
numeric fill-in item with `instructions: "Enter your answer in the space."`.

The exam player loads local content by `assessmentId`. If a local test file is not registered yet, it falls back to
the basic assessment data from the server.
