# Nathan Tutors Content Studio

Passage editing opens directly in the shared student presentation. Click passage
text, the question prompt, or a choice to edit it in place. Answer bubbles are
read-only while authoring. **Answer summary** shows every question
key in one panel. Choose **Change answer**, select the key, then **Apply key**;
Cancel leaves the current draft key unchanged. Complex interaction keys open the
question options. The correct row stays highlighted in the preview.
**Question options** keeps type, topic, points, interaction configuration,
and explanation together beside the preview. **Passage options** groups details,
formatting, images, definitions, and review in one panel. There is no separate
bulk-editing mode. **Student view** opens the read-only player in the same window.
The library docks beside the canvas on desktop, and its controls wrap within the
sidebar rather than clipping or covering passage text.

The exam builder library separates **Official practice** from **Other exams**
and custom labels. Year/form exams retain their existing official grouping;
custom exams default to Other exams. Set an **Exam section / label** when creating
an exam, or change the selected exam's label with **Save label**. Labels persist
with the assessment and do not change its questions, access, or source identity.
**+ Label** creates a named section immediately, including an empty section
before any exams are assigned. The catalog persists in `tools/exam-labels.json`;
labels also appear in the new-exam and existing-exam label fields. Library search
also matches labels.


To move a math diagram into the prompt, use **Move question image between text
lines** below the question prompt, or **Move between text lines** in Question
image. Choose an entry in **Image position**, then click **Place image here**.
For a precise position within a sentence, click that spot in the prompt while
the placement panel is open. Click an image already in the prompt to resize,
describe, remove, or move it again. Save the Math section to keep the placement.

Run the centralized local editor from the repository root:

```powershell
npm run content-editor
```

The Studio opens at `http://127.0.0.1:4319` and provides seven connected
workspaces:

The same navigation bar stays at the top of all seven workspaces. Direct links
switch editors on desktop; a workspace selector serves smaller screens. Library,
saved import drafts and Help keep the same position. The passage catalog puts
search first, with Reading/Revising shortcuts and on-demand Filters and Select
menus. Search matches separate words across titles, IDs, versions, sources and
questions, prioritizing title matches and ignoring accents.

Math questions use **Main category** (`topic`) for sorting and **Specific topic**
(`subtopic`) for detailed analysis. Choose both for every new question. Specific
topics belong to their main category; changing the main category clears the
specific choice. Existing unclassified questions stay editable and are marked
**Unclassified** until reviewed. Their original main categories are preserved.

In **Math → Manage categories**, add, rename or remove unused main categories
and specific topics. Renaming updates existing math source labels, the matching
assessment registry and generated extraction prompts. Used labels must be
reassigned before removal. Save the current question draft before managing this
shared taxonomy. The lists live in `tools/math-topics.json`.

The math question outline supports search, question-number jumps and filters for
both categories or **Needs classification**. Question type and points live in
**Question settings**; MathLive, formulas, images, answer keys, structured
responses, reordering and Student view retain their existing editors. Analytics
offers **Group by → Math specific topic** and an evidence filter that opens the
matching responses. Main skill summaries remain compatible with older results.

- **Exam passages** opens the first passage in the editable exam presentation,
  using the same document, content dimensions, and stylesheet as Student view.
  The item bar retains version, save state, and saving. **Passage options**
  groups passage details, formatting, definitions, images, and review.
  **Question options** keeps the selected question's type, topic, points,
  interaction settings, ordering, and explanation beside the live canvas.
  Passage sets are saved in `client/src/content/exams/passageSets`.
  Each passage has a Study Hall type (Informational, Literary, Poem, or Long
  reading); saving a new passage automatically registers it in the student
  library, where its cover opens the matching passage and questions. A separate
  book-cover upload controls the Study Hall card without replacing an image
  shown inside the passage. Covers use a 3:4 portrait ratio; 900 × 1200 pixels
  is the recommended upload size. Passage and passage-set IDs are generated
  internally from the title; existing IDs stay stable when titles are edited.
- **Exam Part B** manages the reusable Revising/Editing Part B bank. Question
  topics are section-specific: Reading Comprehension and Advanced practice use
  the first eight topics in `tools/content-topics.json`; Revising/Editing Part A
  and Part B use only the remaining topics. The Topic manager displays this
  boundary and applies renames to existing question records.
- **Exam builder** assembles English sections and synchronizes assessment data.
  **+ New exam** creates a named exam with a duration and description. New exams
  start with both sections and corrections locked. Empty exams can be saved
  while you assemble English and Math. The option for a previously taken test
  points to answer entry in the teacher dashboard after the answer key is ready.
- **Exam math** creates each exam's math section with rich text, directly editable
  equations, answer keys, drop-downs, question and answer-choice images (including
  SVGZ), generated number lines, drag-and-drop question ordering, and a
  screenshot-to-JSON import review flow.
- **SAT passages** creates and edits the library card, passage, and
  question set in `client/src/content/advancedPractice/passageSets`. New
  passages are registered automatically and appear in **English Study Hall →
  Advanced readings**, with search, genre filters, and title sorting. Existing
  passage IDs and student URLs remain stable. **Delete passage** removes a saved
  SAT passage and its questions after confirmation; stale editor copies cannot
  delete a changed passage.
- **Regular practice** accepts a complete question or one-box paste, previews
  the generated TypeScript, and writes it to the selected topic and difficulty
  bank in `client/src/content/practice/questionBanks`. Its in-editor topic
  manager can add, rename, describe, reorder, and safely remove empty topics;
  the ordered topic registry is stored in `tools/practice-topics.json`.
- **Question Bank · SHSAT Lab** retains capture imports, draft review, publication,
  filters, bulk publication and fixed practice sets for learning-plan assignments.

Choose a section from the header's **Workspace** selector. **Saved import drafts**
stays in the header. See [the capability map and validation notes](CONTENT_STUDIO_REDESIGN.md)
for the complete workspace inventory and remaining manual checks.

The existing `npm run exam-editor` and `npm run question-editor` commands are
compatibility aliases that open this same centralized Studio.

The content model, validation, and file writes live in `tools/content-studio.mjs`
and `tools/content-studio.html`. Layout and navigation are separated into
`tools/content-studio-workspace.js` and `tools/content-studio-workspace.css`.

In a passage's **Questions** tab, **Copy for ChatGPT** copies every question,
answer option, and correct answer from the current draft together with a prompt
that asks ChatGPT to classify each item using only the topics allowed for that
passage's section.

In **Exam passages** or **SAT passages**, **Import documents** copies the universal extraction prompt
and accepts one or multiple complete passages and independent English/Math
questions. **Save all as review drafts** stores teacher-only drafts that survive
restarts. **Saved import drafts** in the top bar opens source references, classification confidence,
answers, explanations, completeness checks and required-image uploads. Reviewed
English content publishes to the collection where the import was started; that
destination survives saving and reopening drafts. SAT review also includes genre
and card excerpt fields. **Import SAT Crash Course** is available in both passage
collections. Math publishes
into a selected exam through the existing Math writer. Missing source keys and
explanations are never generated by the extraction prompt. See
`tools/DOCUMENT_IMPORT.md`; copy the complete ready-to-use prompt from
`tools/DOCUMENT_EXTRACTION_PROMPT.txt`.

Visual math authoring lives in `tools/content-studio-math.js` and
`tools/content-studio-math.css`. Its pinned MathLive dependency and fonts are
served locally from `node_modules`; authoring does not require a CDN.
Restart an already-running Studio after updating these files so its server can
serve the workspace assets, then refresh the browser.

## Editing workflow

- **Passage / Questions** switches the main editing task while retaining the
  entire draft. Settings, Media, Definitions and Review open one supporting panel
  at a time. Settings retains introductory text, formatting type, categorization,
  source information and advanced card fields. Definitions has Locate, Edit and
  Remove controls for each annotated occurrence.
- The question dropdown and Previous / Next controls switch the question in the
  editable student canvas. Reordering follows the selected question; adding a
  question opens it immediately. **Question options** also provides topic
  management and copying questions for ChatGPT classification.
- **Student view** opens a read-only player in the same window. The authoring
  canvas remains the default editing surface. Supporting panels resize with
  pointer or keyboard and dock beside the preview on desktop. Small screens
  use an overlay. Library, preview, and options scroll independently.
- Answer explanations are inside **Question options**, beside the question.
- Existing versions are selected in the item header. **More** holds creation of
  another version and confirmed passage deletion. The library's **Import** menu
  holds document import and SAT Crash Course import.
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
  In an imported review draft, the shortcut saves the private draft. Publication
  remains an explicit separate action. Failed saves retain dirty work; saving
  prevents duplicate requests and edits being overwritten by a response.

For browser QA with disposable content and the real writers/renderers:

```powershell
node tools/preview-content-studio.mjs
```

This uses port 4320 and an isolated copy under ignored `tools/.content-drafts/qa-*`.
It never edits the authored source records. `--baseline --port=4322` opens the Git
HEAD UI against another disposable copy for before/after comparisons.

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

In prose passage text, click inside a paragraph (or select several) and choose
**Number paragraph**, **No paragraph number**, or **Subheading** in the passage
formatting toolbar. Subheadings and excluded paragraphs stay unnumbered and do
not consume a number. The setting survives save/reload and appears consistently
in live preview, full Student view, and student exam content.

## Math Study Hall hierarchy

Student Math Study Hall uses the same `tools/math-topics.json` category source
as Manage categories. Main category cards lead to specific topics. Topic URLs
retain both category and topic and preserve teacher preview context; breadcrumbs
and browser Back/Forward support returning through the hierarchy. Empty topics
remain visible. Removed categories/topics show a return to the current catalog.

Each topic reserves separate **Worksheets** and **Infinite practice** sections.
They currently show honest empty states. Worksheet publishing, template schema,
question generation, scoring, and the final module layout await the user's next
instructions; no generated question content or live practice engine is supplied.

Math also has a section-wide **Answer summary**. Math key fields are locked
while editing question content. Choice keys use the same staged **Change answer**
and **Apply key** workflow. Other math interactions open explicit key editing;
**Finish key editing** locks those controls again. **Save math section** persists
the draft using the existing writer. Student-player response controls remain
interactive and independent of teacher answer keys.
