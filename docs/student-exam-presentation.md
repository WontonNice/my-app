# Student exam presentation

The existing `ExamSessionPage` remains the exam engine. Assignment loading, the
content registry, answer state, local saves, the 15-second API autosave, timers,
section submission, grading, and corrections keep their existing integration.
No database migration or exam recreation is required.

## Reference observations

The authorized live TestNav practice environment was inspected beyond login:
reading and poetry, informational subheadings, paragraph numbering, multiple
choice, multi-select, category sort, math drag/drop, numeric entry, the equation
keypad, and the Review menu. Answers were entered and navigation was exercised.
No reference questions, passages, code, logos, or assets were imported.

At a 1280 × 720 viewport the observed reading document was about 1170 pixels
wide, with two 550-pixel columns separated by 30 pixels. Passage padding was
28 pixels and body text approximately 16/24 pixels. The equation keypad used
eight columns, five rows, and a separate row of cursor and editing controls.

## Changes

- Existing reading panes scroll independently. Changing a question resets its
  scroll position while retaining the position in the current passage.
- Prose numbers remain paragraph metadata and render inline. Subheadings and
  lists do not consume paragraph numbers. Poetry retains indentation, stanzas,
  and authored line breaks; numbered lines use the configured interval.
- The existing numeric/grid response renderer now uses the same MathLive
  dependency as the content editor, with bundled local fonts. It supports real
  fractions, powers, roots, variables, relations, and native editing history.
  Existing plain, fraction, and x-equals layouts remain supported.
- Responses retain their string contract. Numbers and simple fractions retain
  legacy values such as `16/15`; structured expressions use the existing math
  delimiters. Shared grading normalizes formatting without evaluating or
  simplifying answers. Teacher-authored alternatives remain authoritative.
- Review lists the current passage or section. Previous works for math and
  standalone revising/editing items. Leaving a section redirects to unanswered
  items when necessary; teacher preview retains its fast-forward controls.
- Category-sort targets support keyboard placement and returning a selected
  card to the bank. Existing TEI schemas and handlers are retained.
- Directions identify Nathan Tutors as unofficial practice and reflect the
  actual subjects present in the exam.

## Verification

Run the automated checks:

```sh
node --test server/tests/exam-presentation.test.cjs server/tests/exam-review.test.cjs
npm run content-editor:test
npm run content-editor:validate
npm run verify
```

For repeatable browser checks, run `node tools/preview-exam-session.cjs`. The
fixture serves the actual exam page, content registry, API client, saving logic,
and grader on port 4322. Only authentication and remote storage use isolated
test data. It has no production entry point and writes no student records.

- `/exams/2025-2026-form-a?subject=math`
- `/exams/2025-2026-form-b?subject=english`

Browser checks covered selection, Previous/Next/Review, reopening saved answers,
structured fraction/root/power entry, cursor movement, undo/redo, deletion,
local and API persistence, section result serialization, independent scrolling,
keyboard category placement, matrix selection, and a 760-pixel viewport.
Live authenticated database writes require a separately authenticated test account;
the browser fixture is deliberately isolated from real students.
