# Nathan Tutors Content Studio

Run the centralized local editor from the repository root:

```powershell
npm run content-editor
```

The Studio opens at `http://127.0.0.1:4319` and provides six connected
workspaces:

- **Exam passages** opens the first passage immediately in a compact,
  sectioned editor with persistent actions and a sticky student preview. It
  creates and edits passage sets in `client/src/content/exams/passageSets`.
  Each passage has a Study Hall type (Informational, Literary, Poem, or Long
  reading); saving a new passage automatically registers it in the student
  library, where its cover opens the matching passage and questions. A separate
  book-cover upload controls the Study Hall card without replacing an image
  shown inside the passage. Covers use a 3:4 portrait ratio; 900 × 1200 pixels
  is the recommended upload size. Passage and passage-set IDs are generated
  internally from the title; existing IDs stay stable when titles are edited.
- **Exam Part B** manages the reusable Revising/Editing Part B bank. Exam
  passages, Advanced practice, and Part B share an in-editor Topic manager
  that can add, rename, reorder, and safely remove unused topics. Renames are
  applied to existing question records and the ordered registry is stored in
  `tools/content-topics.json`.
- **Exam builder** assembles English sections and synchronizes assessment data.
  **+ New exam** creates a named exam with a duration and description. New exams
  start with both sections and corrections locked. Empty exams can be saved
  while you assemble English and Math. The option for a previously taken test
  points to answer entry in the teacher dashboard after the answer key is ready.
- **Exam math** creates each exam's math section with rich text, directly editable
  equations, answer keys, drop-downs, question and answer-choice images (including
  SVGZ), generated number lines, drag-and-drop question ordering, and a
  screenshot-to-JSON import review flow.
- **Advanced practice** creates and edits the library card, passage, and
  question set in `client/src/content/advancedPractice/passageSets`. New
  passages are registered in the advanced-practice index automatically.
- **Regular practice** accepts a complete question or one-box paste, previews
  the generated TypeScript, and writes it to the selected topic and difficulty
  bank in `client/src/content/practice/questionBanks`. Its in-editor topic
  manager can add, rename, describe, reorder, and safely remove empty topics;
  the ordered topic registry is stored in `tools/practice-topics.json`.

The existing `npm run exam-editor` and `npm run question-editor` commands are
compatibility aliases that open this same centralized Studio.

The content model, validation, and file writes live in `tools/content-studio.mjs`
and `tools/content-studio.html`. Layout and navigation are separated into
`tools/content-studio-workspace.js` and `tools/content-studio-workspace.css`.
Visual math authoring lives in `tools/content-studio-math.js` and
`tools/content-studio-math.css`. Its pinned MathLive dependency and fonts are
served locally from `node_modules`; authoring does not require a CDN.
Restart an already-running Studio after updating these files so its server can
serve the workspace assets, then refresh the browser.

## Editing workflow

- **Passage / Questions / Settings / Media** switches the active editing panel
  while retaining the entire draft. Passage text opens first; Settings contains
  introductory text, formatting, categorization, and advanced card fields.
- **Questions** opens one complete question editor at a time. Use Previous / Next,
  the question dropdown, or the expandable outline to navigate. **All questions**
  restores editing of the whole set. Reordering keeps the selected question in
  focus; adding a question opens it immediately. Student view opens the selected
  question when launched from this panel.
- **Library** and **Hide preview** free up writing space. On desktop, the library,
  editor, and preview scroll independently while primary actions stay visible.
  Narrow screens stack the panels and keep save controls accessible.
- Passage and Part B libraries have search, type filters, source/alphabetical
  sorting, result counts, and pages of 50 records. Passage search also finds
  question prompts and topics. Exam lists and assembly libraries have search.
- **Exam builder** places the ordered section beside its source library. Reading,
  Part A, Part B, and All sections views retain all assignment, ordering, removal,
  and answer-key controls.
- **Exam math** separates Question, Answers & scoring, and Live preview. Type,
  topic, and points stay together. Directions and image settings expand on demand;
  formula tools, choice images, number lines, all interaction types, and keyboard
  or pointer reordering remain available. Import opens a review dialog. Search
  by number (for example `#38`), prompt, or type to find a question.
- **Regular practice** separates question authoring from explanations, with an
  All fields option. One-box paste and Publish preview share a tools panel.
  Validation opens the required fields and automatically shows a successful
  preview; publishing still requires the existing validated-draft step.
- **Ctrl+S / Cmd+S** invokes the active workspace's save action. In Regular
  practice it validates first when no publishable preview is available. Existing
  confirmation and validation behavior still applies.

## Visual math authoring

Write ordinary text in the question and use **ƒx** (Ctrl/Cmd+M) for inline math,
or **Block equation** (Ctrl/Cmd+Shift+M) for a centered equation. The same visual
input works in supporting text, formula answers, text answers, dropdown sentences,
and drag-and-drop answers and layouts. Native dropdown menu options and accepted
numeric/text scoring answers remain literal values, preserving their display and
the existing matching rules.

- **Fraction**, **Exponent**, and **Root** insert editable structures directly.
  Click inside any equation to edit its numerator, denominator, scripts, cells,
  or terms. Tab/Shift+Tab move between placeholders; arrows move within math.
  Enter returns to text; Shift+Enter adds a matrix row. The equation's menu has
  matrix row/column editing controls. **Keyboard** opens an on-screen math keypad,
  including on touch devices; **Done** returns to text and hides it.
- Select text or part of an equation before inserting a structure to use the
  selection inside it. Fraction uses the selection as its numerator, Root as its
  radicand, and Exponent as its exponent. Parentheses and brackets wrap selections.
- **Insert math** opens a searchable palette organized into Basic, Algebra,
  Calculus, Geometry, Statistics, Greek, Symbols, and Templates. At the start of
  a word or in an empty math placeholder, `/frac`, `/sqrt`, `/matrix`, or
  `/integral` followed by Enter inserts that structure. Ctrl/Cmd+K opens the
  palette from anywhere in an authoring field. Within an existing equation,
  `x/2` retains MathLive's fraction shortcut. LaTeX commands such as `\theta`
  followed by Space work directly inside equations.
- **Visual / LaTeX** synchronizes the active equation with its exact source and
  shows a student-rendered preview. Invalid LaTeX and unfinished placeholders
  receive inline feedback. Existing source is retained until edited, including
  unsupported notation; it is never silently discarded by the visual parser.
- **Duplicate**, **Inline ⇄ Block**, and **Remove** act on the active equation.
  Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z undo and redo text, equation, and structural
  edits within the active field. Undo history is local to that editing session;
  switching questions or rebuilding a question starts a new field history.
- Pasted `\(...\)`, `\[...\]`, and `$$...$$` become editable equations. Ordinary
  currency amounts are kept as text. Source files still contain the existing
  HTML and LaTeX delimiters, and student rendering still uses KaTeX. Incomplete
  placeholders show as squares in the draft preview; fill them before saving.

Run notation compatibility, transformation, navigation, and large-library checks with:

```powershell
npm run content-editor:test
```

For the exact screenshot conversion prompt and import schemas, see
`tools/MATH_QUESTION_IMPORT.md`. The same prompt can be copied from the Math
workspace.

Validate every connected content source without opening the browser:

```powershell
npm run content-editor:validate
```

All write requests are restricted to localhost and protected by a new random
edit token each time the Studio starts. In a GitHub Codespace, writes also allow
the authenticated private forwarded-port origin for that exact Codespace.

## Continue from another computer

The teacher dashboard's **Content Studio** link opens or resumes a private GitHub
Codespace for this repository. The repository configuration installs dependencies,
starts the Studio, and opens its forwarded port automatically. GitHub authenticates
the Codespace and keeps port 4319 private to its owner.

Before changing computers, validate, commit, and push the work from the current
computer. Uncommitted files exist only on that computer. In the Codespace, save
through the Studio, run `npm run content-editor:validate`, review the Source
Control list, commit, and sync the commit to GitHub. Stop the Codespace when the
session is finished. Back on another clone, begin by pulling the latest commit;
commit or stash local work before pulling if that clone is not clean.

## Exam corrections and paper answers

In **Teacher dashboard → Assessments & insights**, each exam now has **Open
corrections / Lock corrections**, **View correction submissions**, and **Enter
student answers**. Select an enrolled student, enter the original test date and
answers for the completed sections, review the score, then save. Numbering follows
the student's assigned passage form. Existing results cannot be replaced by this
entry flow. The older total-score entry remains available for tests without an
authored question set.

Students open **Results → Corrections** after the teacher unlocks that exam.
Incorrect questions appear red in the numbered navigator. English requires an
explanation of both the wrong and correct answers; Math requires the correct
reasoning only. Every incorrect question requires a 1–5 understanding rating.
Drafts are saved on the device, and **Submit corrections** sends the completed
work to the teacher. Submitted work is read-only. Both opening and submitting are
checked against the current teacher lock on the server.

Exam types and grading are shared in `server/src/shared`. The Studio refreshes
`server/data/exam-content.json` from the authored sources when reloading its
content state; server development and production builds also regenerate it.
Deploy the client and server together. Corrections use reserved
`__exam_corrections__:` records in the existing `student_exam_results` table,
separate from scores and excluded from progress statistics. No new table is
required. Submissions retain the questions and answers reviewed at submission
time, and are tied to the saved result and content version.

Run `npm run test:exam-review` for server access, validation, grading, and
duplicate-submission checks. `npm run content-editor:test` includes isolated
exam-creation and source-registration checks. For visual QA with sample data
only, run `node tools/preview-exam-review.cjs` and open
`http://127.0.0.1:4321/results/test-exam/corrections` or `/teacher`.
