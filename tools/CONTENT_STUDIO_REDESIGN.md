# Content Editor workspace audit and validation

## Scope and implementation

The existing local Content Studio is the editor (`npm run content-editor`,
`http://127.0.0.1:4319/`). This change reorganizes that application. The React
student portal, student routes, content schemas, source writers, IDs, grading,
assignment APIs, access permissions, and import contracts are retained.

The implementation follows this sequence: inventory existing workspaces and
writers; capture the original browser UI; introduce shared navigation and
interaction conventions; reorganize passage tasks and supporting tools; repair
save/navigation/annotation regressions; compare the browser at matching sizes;
run editor, import, bank, and student-renderer regression suites.

`content-studio-workspace.js` manages workspace state and moves the **existing
DOM controls** into their new places. The new rules in `content-studio-workspace.css` are scoped to
the teacher body's `studio-authoring` class. Student markup and styles remain
inside the existing preview frames. Direct authoring adapts that existing exam
document into editable fields and commits to the existing draft and source
controls. The complete rich forms remain available in Bulk editing. There is no
second student-content renderer or save contract.

## Capability map

| Existing workspace/capabilities | Location and behavior after redesign | Existing storage and consumers |
| --- | --- | --- |
| Exam passages; reading and Revising/Editing Part A; versions | Universal navigation → Library. Search first; All/Reading/Revising shortcuts; category, format and sort under Filters; checkboxes and category actions under Select. Expandable version families and 50-record pages remain. The item header names the selected version; **More → Create another version** is separate. | `/api/passages` → `client/src/content/exams/passageSets`, passage library registration, exam exports, Study Hall and exams. |
| Passage title, author, rich text, paragraph styles, formatting and undo/redo | **Edit exam** is the default. Edit title and source blocks directly in the shared exam document. Select text for paragraph style, bold/italic/underline, definitions, undo/redo. Author/introduction and other metadata remain in Tools → Settings. **Bulk editing** retains all formatting options and substantial structural edits. | Existing `text`, `richText`, HTML numbering attributes, source hashes and formatters. |
| Word definitions and occurrence annotations | Select exam text → **Definition** opens the existing compact dialog. Tools → **Definitions · N** lists Locate, Edit and Remove. Selection and scroll survive closing the inspector. Original inline `data-glossary-definition` annotations remain attached to occurrences. | Original rich text annotations → source writer → glossary/student formatter and existing glossary module. |
| Questions, response formats, choices, answer keys, topics, points, order | **Questions**: focused navigator, expandable outline, All questions, source-order move controls, Remove, Add question, topic manager and Copy for ChatGPT. Answer keys stay blank when absent. | Existing question objects and passage relationships. No answer/skill/category/difficulty reinterpretation. |
| Explanations and batch explanation editing | **Question details** opens the inspector on the passage side, keeping the actual question visible. **Bulk editing → Questions → Batch explanations** edits the same fields for the entire set. | Existing `explanation` and `explanationHtml`; original save/export flows. |
| Identity, introductions, source/classification metadata | **Settings** supporting panel. Subject/section, collection category, passage type, prose/poem/sentence format, version/source fields remain distinct. Official Handbook, Prestige and Miscellaneous are unchanged. | Existing metadata; no category reassignment or migration. |
| Book covers, passage images, alt text and captions | **Media** supporting panel. Separate cover and inside-passage image controls, with existing upload/remove behavior. | Original image endpoints and `/exam-images/` references. |
| Draft preview and full Student view | **Edit exam** is the actual presentation with editing adapters. **Student view** opens the same document without teacher editing, answers, or explanations. One resizable overlay inspector; opening it leaves the internal exam viewport unchanged. At narrow widths the exam keeps its minimum viewport and can be panned horizontally. | Original student passage markup/stylesheet and full Student view. Preview does not publish or include teacher answer keys. |
| Part B multiple-choice and one-box drag-and-drop bank | **Exam Part B**; compact Question properties disclosure for ID/type/topic/points/version, with comfortable prompt/stimulus/choice editors. Save state and actions share the item header; existing preview is optional. Library, scoring and topic management remain. | `/api/standalone-items` → `standaloneItems.ts` → exam builder, exam rendering and grading. |
| Exam assembly, Reading, Part A, Part B, source selection and ordering | **Exam builder** retains specialized assembly/source columns and section navigation, new exams, answer-key disclosure and teacher answer-entry link. Assembly changes now have an unsaved flag and an item-change/refresh guard. | `/api/exams`, `/api/tests` → test sources, exam index and assessment registry. Existing locked-exam rules remain. |
| Exam math, MathLive visual editing and LaTeX | **Exam math → Question & answers** keeps the prompt and response authoring together; Student preview is an explicit mode. Metadata uses related compact controls; optional directions/images remain disclosures. MathLive, palette, templates, keyboard, images, number lines, dropdowns, drag/drop, graphs and ordering remain. | `/api/math` and existing image/import endpoints → math sets and assessments; existing KaTeX/student grading. |
| SAT library cards and passages | **SAT passages** uses the passage workspace. Settings retains card ID, genre, excerpt, tone, thumbnail and accessibility fields. | `/api/advanced-passages` → `advancedPractice/passageSets` and registry → Advanced readings. |
| Practice authoring, one-box paste, explanations, topic manager, validation and publication | **Regular practice** retains Question & answers / Explanations / All fields and One-box paste / Publish preview. Local recovery stays labeled as device-local; publication keeps its existing validation gate. | Existing localStorage recovery and `/api/practice/preview` → `/api/practice/questions` → topic/difficulty TS banks. |
| SHSAT Lab capture imports, filtering, review, bulk publication, random selection and fixed practice sets | **Question Bank · SHSAT Lab** in the workspace selector. Original English/source/section/topic/difficulty/status filters, 50-record paging, publication confirmations, immutable published records and set builder remain. | `question-bank.js/mjs` and `server/data/question-bank.json` → learning-plan practice assignments and original server grading. |
| Document import and SAT Crash Course import | Library **Import** menu exposes both workflows. **Saved import drafts** remains in the global header. No extraction prompt/schema changes. | Existing DocumentImport contract and `.content-drafts` store; review → explicit publication through the original passage/math writers. |
| Import warnings, missing keys/explanations, classification and required visuals | **Review · N** supporting panel; saved draft review has an expandable issue summary with direct navigation to the relevant answer, explanation, classification or image input. Existing passage-versus-Math publication rules are stated and unchanged. | Original `DocumentImport.issues`, source references, review flags, visual records and publication endpoints. |
| Bulk passage categories | **Library → Select**, checkboxes and category actions. “Select this page” applies to the visible filtered page; selected IDs can include other pages. | Original conflict-checked metadata-only category endpoint. |

Save actions remain explicit. A successful response plus state reload precedes
“Saved”; failures retain dirty work. Shared busy handling prevents edits and
duplicate saves during a request. Ctrl/Cmd+S calls the real action; on an imported
review draft it saves the private draft rather than publishing it. Version/item
changes use existing discard confirmation, section changes retain their in-memory
drafts, and refresh/close guards include the exam builder. Layout width, library
visibility, filters, selected IDs and passage tasks are stored as UI preferences;
content is not silently autosaved or migrated.

## Data flow

```text
Existing editor draft
  → explicit existing save/publish endpoint (token/origin and source-hash checks)
  → existing TS content/registry or teacher-only import-draft storage
  → /api/state reload and stable-ID selection
  → original student passage markup / full Student view
  → existing built student portal, assignments and server grading
```

Source edits require the normal build/deployment to reach a deployed student
portal. Saving a review draft is private; previewing never publishes. Existing
passage publication permits unresolved review notes, while Math retains its
publication checks. Those rules have not been tightened by the new review UI.

## Validation and remaining limits

Results: **37/37 editor regressions**, **10/10 document import and student-renderer
regressions**, and **49/49 question-bank regressions** passed. Client and server
TypeScript checks passed. The content validator passed against 36 exam passages,
1 SAT passage, 32 practice banks, 3 math sections, 4 tests and 4 assessments.
`git diff --check` passed. No authored content files were changed by QA.

Automated regression suites cover editor selection/pagination, a 1,003-item
library, source/answer fidelity, version creation, source hashes, category changes,
MathLive/KaTeX compatibility, import persistence and publication, glossary/student
rendering, metadata privacy, question-bank publication, assignments and grading.
New regressions cover stable-ID task restoration, missing-key review without
fabrication, failed-save feedback, unavailable browser storage, math page adapters,
and an unavailable UI asset returning failure without crashing the local server.
The exam-creation fixture now lives under ignored `.content-drafts` to keep its
generated content out of the watched working folders; the complete suite passed
after intermittent Windows rename locks during earlier runs.

Chrome validation uses `node tools/preview-content-studio.mjs`: a disposable copy
of content beneath ignored `tools/.content-drafts/qa-*`, with live repository UI
assets and real writers. `--baseline --port=4322` serves the Git HEAD UI for matching
screenshots. `POST /__qa/fail-next-save` exists **only in this disposable helper**;
it produces one local save failure. It is not part of the Content Studio API.

Browser checks performed: search and category filtering; version selection;
passage/title editing; paragraph-to-heading conversion and undo; repeated-word
definition creation/editing; preceding text insertion; annotated cut/paste;
defined-text deletion and undo; question/prompt/choice/explanation edits and
question switching; explicit save and reload; failed save retention; Edit/Split/
Student view; poetry; specialized Part B, exam builder, SAT, practice, bank and
Math screens; Math question/scoring navigation and save; import missing-key issue
navigation and private draft saving. The image upload endpoint was verified
separately against disposable content.

Full Student view now uses a native modal dialog for keyboard focus containment;
opening and closing it was checked on the original `4319` editor route.

Matched before/after screenshots were captured at 1366×768, 1440×900 and 1920×1080.
A 1024×768 check exposed and verified the single-panel CSS correction. Keyboard
selection, native select controls, undo and editor shortcuts were exercised.

Remaining manual coverage: exhaustive interaction testing of every math response
type; a real student assignment session; manual screen-reader testing; all
native browser close/back/version-confirmation paths. Browser file upload initially failed because Chrome's extension
file-URL permission was disabled; no security settings were changed by the agent.
Do not treat the API upload test as a passed browser file-picker test.

## Space optimization follow-up (prior layout pass)

| Area / frequency | Size matched to the task |
| --- | --- |
| Passage/SAT content and questions — frequent | Shared exam document is primary; no full form beside it. One item/navigation bar and one contextual editing row. Canvas starts at 110 CSS px at 1366×768, leaving 658 px for the exam workspace. |
| Item/version/save/workspace changes — frequent | Compact header; inline title editing in the exam; version selector and explicit save remain visible in Focus mode. Focus removes the formatting row while retaining workspace, library and question navigation, expanding the canvas from 658 to 710 px at 1366×768. Editing tools opens the same controls as a temporary overlay. Library filters and selection remain intact. |
| Paragraph style, occurrence definition, correct answer — frequent small actions | Contextual selector, existing compact definition dialog, and explicit authoring answer bubbles. Content is never regenerated from inferred answers. |
| Classification, source notes, media, definitions — occasional | One organized overlay inspector, 320–560 px with pointer and keyboard resizing. Settings share a grid, media retains original controls, definitions use compact rows. No separate metadata pages. |
| Question properties and long explanation — occasional/substantial | Same inspector on the passage side so the question stays visible. Explanation can grow vertically and inspector width can expand. Private properties do not rebuild the active exam iframe. |
| Bulk question structures / explanations — substantial | Deliberate Bulk editing mode retains all original structures, topic manager, sorting, copying, formatting, and batch fields. Returning restores the exam context. |
| Part B and math — frequent, sometimes complex | Part B metadata disclosure, shared save header, optional preview. Math prompt and answer authoring share one task; full MathLive and specialized response controls retain room. |
| Exam assembly, practice, bank — substantial | Existing large working areas retained. Compact shared headers, grouped metadata/filter controls, purposeful disclosures; practice and math modes retain scroll instead of resetting to the beginning. |
| Document/import review, topics, confirmations — occasional | Substantial imports and topic lists keep their larger review dialogs; unresolved issues remain visible via Review count. The existing native confirmations remain compact. No new empty screens. |

New browser validation used disposable content exclusively. Direct text, title,
choice, key, definition, paragraph-style and undo edits were checked through the
existing save flow. A poem round trip changed only the requested text and retained
all **56 original newline characters**. Generated sentence labels are marked
separately from literal source numbers and never enter saved content.
An inserted paragraph retained keyboard focus, exposed a comfortable empty hit
area, saved the expected paragraph separators, and undid back to the original
heading. A seeded list fixture retained one list wrapper, both list items,
neighboring paragraphs, and exact plain-text separators after direct edits.

At the 1366×768 browser viewport, matching authoring and Student view exam surfaces
both measured **1170×543 px**, **475 px passage text width**, **16 px body text**,
and **24 px line height**. Opening/closing the inspector retained the measured
1170 px width and passage scroll position (1654 px). The inspector uses overlays
instead of shrinking student columns. Typing does not replace the active exam
document. Private topic/points/explanation edits do not replace it either.

Chrome's real **125% zoom** was set and reset by the user because browser security
blocks Chrome settings URLs. The zoom check exposed a hidden navigation row;
it was corrected and rechecked. Workspace/library/save controls stayed reachable,
and keyboard inspector resizing worked. Native selects, text selection, undo,
definition insertion, panel closure, Focus mode, and all seven workspaces were
exercised. This is keyboard smoke coverage, not a screen-reader certification.

The chat's `space-optimization` artifact folder contains matched before/after
screenshots at 1366×768, 1440×900 and 1920×1080, plus zoom, inspector, Part B,
math, and failed-save evidence. These follow-up “before” images show the editor
as it stood at the start of this request; the older screenshot set uses Git HEAD.

## Universal navigation and compact catalog follow-up

The universal bar is now a single persistent navigation landmark above all seven workspaces. Desktop links, Library, saved import drafts and Help retain their positions; smaller screens use the same workspace selector and retain draft access. No global controls are moved into a passage-specific header. Saving disables both navigation forms, and the existing unsaved-work guards remain in force.

The 360 px passage drawer uses two-line catalog rows, grouped versions, search, All/Reading/Revising shortcuts, and compact Filters and Select disclosures. Filters combine category and format with the original sort options. Search matches separate terms across title, version, ID, source, topic and question text, ignores accents and ranks title hits first. Checkbox selection survives searches and pages. Escape closes catalog menus with focus restoration, then closes the drawer.

Browser checks exercised all seven navigation links at an unchanged 54 px header height, multi-term search, version groups, quick sections, category plus format filters, bulk selection across searches, reset/empty results, Focus question controls and the compact selector. Layouts were inspected at 1366×768, 1440×900, 1920×1080, 1093×614 and 480×800. The new universal bar intentionally remains visible in Focus mode: at 1366×768 the canvas begins at y=164 with 604 px available normally and y=112 with 656 px in Focus. Earlier layout metrics above describe the previous pass. Screenshots are in the chat artifact folder `universal-navigation`.

Validation for this follow-up: 37 editor tests, 17 board tests and both client/server TypeScript checks passed. The new board tests cover two students and one teacher editing concurrently, per-student discovery and content authorization, viewer restrictions, removal and archival. Browser verification used isolated fictional board accounts and observed a second student’s note synchronize to the first student. The existing participant schema needs no migration. See `docs/collaborative-boards.md` for sharing and deployment details.

## Math classification and authoring follow-up

Math now follows the universal navigation and compact catalog layout, with a searchable question outline and an uncluttered command bar. The main and specific topic selectors remain beside the question; response type and points are in Question settings. Filters support both labels and missing classification. The original MathLive editor, choice/answer editors, all specialized response controls and student preview remain in use.

`topic` remains the main sorting key; optional `subtopic` extends the shared question and assessment types for backwards compatibility. Every new math question must have a configured main category and a specific topic within it before saving. Older questions missing that detail are explicitly marked Unclassified and remain editable; no skills are inferred or silently reassigned. Changing a category requires choosing its specific topic again.

Math category management supports adding labels, renaming used labels and removing unused labels. Source edits use TypeScript syntax ranges, retaining unrelated text and formatting. Category revisions include source hashes, changes are staged with stale-write checks and rollback, and math saves share the mutation queue with taxonomy updates. The matching assessment registry and generated extraction contract stay in sync. Imports preserve subtopics and require review when classification is absent.

Exam results retain main-topic totals and add parent-plus-specific math totals. Analytics response patterns and question evidence support the detailed topic, keeping identical skill names under different parents separate. Blank responses and older unclassified questions remain explicit. Existing historical score summaries are not rewritten; question evidence uses the current matching content, as before.

Validation: 42 editor tests, 10 import/render tests, 9 exam-review tests and 11 passage/analytics organization tests passed, plus client/server TypeScript checks. Browser QA exercised classification/save/reload, an in-use main/specific rename, combined filters, previews, desktop and narrow layouts, and detailed analytics drill-down using isolated data. A 40-question save retained every original field, answer, formula and visual. The local editor was restarted to activate the new API; deployed student analytics requires the normal app deployment.

## Math media, import and shared player follow-up

Math Student view, the inline preview and import-review preview now load the actual
`ExamMathQuestion` and `ExamToolbar` components with the student stylesheet.
Plain-text emphasis, formulas, structured responses and inline images share the
same rendering functions. Authoring preview navigation remains free to move among
questions; normal student Math navigation requires an answer and proceeds forward.

The supplied TestNav practice reference was inspected through its directions and
first four math items. Corrections include toolbar spacing, disabled Previous in
normal student Math, hiding review/bookmarks there, disabling answer elimination
for non-choice responses, and matching the 104 by 32 px short-answer field. The
shared number line now supports pointer dragging and keyboard arrow/Home/End
movement. Selection limits provide feedback in both preview and student Math.
This is not an exhaustive visual/functional certification of every TestNav item,
accommodation, browser or exam lifecycle screen.

Manage categories now supports removal of used labels with an explicit main/detail
destination. The existing revision-checked transaction updates only classification
fields and matching registry entries. Math image uploads accept clipboard files;
inline uploads use content-hashed filenames so multiple images do not overwrite
one another. Local sanitized `<img>` markup retains its position, description and
width. The save flow waits for image uploads. No database migration is required.

Imports support all nine math type names (including the grid-in alias), with
`short_answer` normalized to `short_response`. Numeric-to-short conversion retains
accepted answers and removes keypad layout. Structured keys are validated without
forcing every dropdown onto a separate line. The extraction prompt and contract
were regenerated using the current teacher-managed taxonomy.

Validation: 44 editor tests, 12 import/render tests and 7 exam presentation tests
passed; client production build, server TypeScript and full content validation
passed. The build retains its existing large-chunk warnings. Disposable browser
data verified used/unused category removal, numeric/short conversion, short-answer
JSON import, clipboard image insertion between lines, save/reload, and preserved
image description. Live shared-preview checks covered choice limits, dropdown
state, click-to-place drag answers, graph selection, numeric keypad entry and
number-line keyboard movement. Pointer dragging is implemented but was not
separately exercised by the browser tool. The preview and actual student question
both measured 1132 px inner content width, 16 px text, 23.2 px line height and a
104 px short-answer input at the matching 1920 px browser viewport. Screenshots
are in the chat artifact folder `math-authoring`. Production content was not used
for test edits. The local editor runs the updated backend at port 4319; publishing
the student app still requires its normal deployment.

## Math layout correction: editor and preview together

The Math workspace now keeps its question outline visible and shows editing and
the live student preview in the same view. The separate Question & answers /
Student preview tabs have been removed. Wide workspaces use two columns; when the
available content width falls below 1000 px, the preview follows the editor on
the same page. Expand preview opens the existing dialog in the current page.
The editor retains side padding in every mode, and selecting another question
returns its heading and classification controls to the top.

Rich math HTML now follows normal HTML whitespace rules. Bare newline characters
copied from PDF lines wrap naturally; explicit `<br>`, paragraphs, formulas and
images retain their structure. The same rule applies to the student renderer and
authoring fields. Existing content files were not rewritten for this correction.
Compact student toolbars and breadcrumbs wrap within their available width, and
Exhibits remains reachable without covering the question.

The preview loads the existing student bootstrap document after layout setup and
uses the shared student bundle inside the embedded document. This avoids a blank
initial preview when a navigating iframe is moved. Ready/load messages still
check the sender and origin. Detached or superseded preview loads are ignored;
failed loads show a message and permit retry. Editing a question retains the
answer currently entered in its preview.

Validation for this correction: 36 targeted editor/math tests and 12 import/render
tests passed, including two asynchronous preview-loading regression tests. The
client production build passed with its existing chunk-size warning. Browser
checks covered the reported Form B question, live edits with an entered answer,
explicit line breaks, save/reload, images, formulas, question switching, expanded
preview and automatic preview startup after refresh. A disposable five-question
save changed only the edited question's prompt and rich HTML, preserving all
other fields and its answer key. Widths of 1920, 1440, 1366, 1093 and 480 px were
checked; parent and preview scroll widths stayed within their respective viewport
widths. Matched and final screenshots are in the chat artifact folder
`math-layout-fix`. No data/API schema changes or migration were needed.

## Numeric keypad reference correction

Inspected the user's open TestNav question (the equation `6x = 9x + 13`) and
exercised its numeric keyboard, fraction and mixed-number templates, cursor
arrows, undo, redo and clear. `MathEntryResponse`, shared by the real student
player and both preview sizes, now uses the reference's three five-key rows and
six round editing controls. The 612 px response has a 50 px initial field, 45 px
editing toolbar, 147 px keypad, 70 × 40 px number keys and 38 × 32 px tool buttons.
It includes the protected `x =` prefix inside the field, dotted empty slots,
fraction/mixed-number icons, white symbol keys and the blue keypad outline.
The response narrows with the preview while retaining all controls.

Fractions use the selected or preceding number as their numerator. Numeric
keyboard input rejects letters and expression operators; arrows, selection,
undo/redo, backspace and the slash fraction shortcut remain available. The
existing structured-answer serialization and grading are unchanged. MathLive
options requiring a mounted field are set after mounting.

Validation: browser checks covered `13/3`, `-13/3`, `4 1/3`, `12.5%`, cursor
insertion (`12` → `132`), backspace, undo/redo, clear and rejected letter/plus
keys. Checked the expanded player and embedded preview at 1920, 1366 and 480 px;
the compact preview has no horizontal overflow. Client build, component ESLint,
seven presentation/grading tests and diff whitespace checks passed. Screenshots
are in the chat artifact folder `numeric-keypad`. Saved exam content was not
modified, and the reference question's initially blank response was restored.

The subsequent sign audit found that TestNav's Negative key prefixes the current
entry even when the caret follows digits; it does not insert subtraction or add
duplicate signs. Numerator and denominator slots are independent. The shared
player now uses that operation for keypad, keyboard and single-character input
events, retaining the cursor/selection and native undo history. Seven regression
tests cover trailing/middle insertion, backwards selections, duplicate signs,
fraction slots, blank/mixed-number roots and input events. Together with the
existing presentation/grading suite, all 14 tests pass. Browser checks also
confirmed sign insertion after `77`, repeated signs, keyboard minus, fraction
denominators and continued cursor editing. The user's original reference answer
`−77` was restored after comparison. No saved questions were changed.

## Visible image placement and student countdown

Existing question images now expose **Move question image between text lines**
under the prompt and **Move between text lines** in the Question image panel.
The placement panel offers positions before/after text lines and a cursor option
for splitting a sentence at an exact point. Images already in rich question text
have the same move action in their click inspector. A move reuses the asset,
preserves its description, removes the old separate image reference, and stores
its position in prompt HTML. Captions move with their figure. The sanitizer keeps
safe figure/caption markup and continues stripping unsafe attributes and URLs.

The student dashboard now includes a live days/hours countdown to
`2026-11-18T00:00:00-05:00` (midnight in New York). It refreshes after focus or
visibility changes, handles the DST transition by measuring actual elapsed
hours, and stops at zero without rolling over to a new year.

Validation: 41 targeted editor/countdown tests, 12 import/render tests, client
build and changed client files' ESLint checks passed. Disposable editor checks
covered moving separate and existing inline images, exact cursor placement,
cancel, captions, and save/reload; the universal preview rendered one image in
the requested position. Student countdown was checked on the real dashboard at
desktop and 480 px with no horizontal overflow. Screenshots are in the chat
artifact folder `image-countdown`. Only disposable exam content was edited.
