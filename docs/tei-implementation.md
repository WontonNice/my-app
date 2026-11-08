# TEI implementation and verification

TestNav is the presentation authority: https://nycshsat.myassessmentsupport.com/practice-tests/.
Prestige/SAT Crash Course and other imports provide content, source metadata and
verified keys. Their widgets, CSS and event handlers do not define the player UI.

## Format map

`server/src/shared/teiFormats.json` inventories the persisted types, display names,
variants, renderer, response shape, answer-key fields and publication support.
The import contract consumes this map in both Node and Content Studio; the shared
response dispatcher uses it to reject unsupported rendering. It references the
existing validators and grader rather than introducing a second grading system.

Hot Text and Hot Spot are variants of choice questions. Equation Editor retains
numeric/expression entry types and its existing mode setting. These are not new
persisted answer formats. Essay and unknown interactions remain drafts.

## Rendering and editing

`client/src/components/ExamResponse.tsx` dispatches to existing TestNav controls.
SentenceDragDrop is the compatibility adapter to MathDragDropResponse. Matrix
Choice uses MatrixChoiceResponse in both subjects. CategoryResponse extracts the
exam's category/table controls and uses the existing placement rules.

SentenceDragDrop scopes ordinary inline text flow through `exam-sentence-response`.
Keep sentence fragments and their answer boxes in the same text flow; flex rows
treat the remainder of a sentence as a single item and force it below the blank.
Math equations and tables retain their existing layout. Do not insert source line
breaks to compensate for a renderer layout bug. The sentence-layout regression in
`test:tei` covers modern, legacy, multiple-blank and filled-answer rendering.
For visual checks, verify the first word after the blank shares its line at desktop
and 390px widths, wraps naturally, and still allows placement and keyboard return.

Reading, Part A and Part B retain their shared authoring shell, question inspector,
rich-text toolbar, answer summary and explanations. Their response region mounts
ExamResponse through `tools/question-response-preview.tsx`; it no longer creates
its own TEI markup or movement scripts. Teacher controls edit the question data;
trying an interaction changes only ephemeral preview state. Math keeps the existing
React student preview and uses the same response components.

The authoring passage shell still adds editable passage blocks, and ordinary
exam-choice markup retains the player's highlighting/eliminator integration.
These are intentional editing/player wrappers, not alternative TEI controls.

## Compatibility and imports

No content/attempt migration is required. Keep question, choice, slot and menu IDs,
keys, existing string answers and structured response maps. A legacy sentence blank
accepts its saved string answer; multiple blanks retain their slot map. The original
grading functions remain unchanged.

The import validator checks duplicate IDs, matching plain/rich response placeholders,
Hot Text targets and Hot Spot geometry in addition to existing key/content checks.
Failures retain the source in the draft and explain the repair. Never infer a missing
key or silently substitute a new interaction. Existing draft revision checks prevent
overwriting a more recent edit.

## Regression workflow

- `npm run test:tei`: format coverage, import validation, grading compatibility,
  source adapters and actual draft-store save/reopen/stale-write checks.
- `npm run test:tei:browser`: real Content Studio canvas versus student preview for
  all supported response families, placement/keyboard return and screenshots.
  Requires Playwright with Edge. Blocks API writes and closes its local QA server.
- Run client typecheck and the existing exam-presentation checks after changing a
  shared component. Do not regenerate visual goldens to hide differences.

`tools/tei-fixtures.cjs` selects real authored official questions from Forms A–D,
the grade 9 mini form and Winter Wheat. Indoor Plants is the approved outlined
sentence-drag reference. The fixture set also includes the Prestige Hot Spot and
explicit legacy/multiple-blank compatibility cases. These checks prove reuse and
contract preservation; an all-items pixel-equivalence claim requires separate
comparison with the corresponding live TestNav items at matching viewport sizes.

For a new interaction: identify its TestNav reference, update the map, extend an
existing component where possible, add the source-to-data mapping and a fixture,
verify editor/student behavior and save/reopen/grading, then remove any superseded
implementation. Do not introduce an importer-specific renderer.

## Validation of this change

- 25 TEI contract/import/grading/draft-persistence checks passed.
- 19 browser fixtures passed editor/student response-structure comparisons,
  multi-blank placement and keyboard return, direct prompt editing, Hot Text
  selection and Inline Choice. The comma-splice blank's dimensions and borders
  match the Indoor Plants reference. Screenshots are in `artifacts/tei-consolidation`.
- 12 existing Part B and exam-presentation checks passed, including registered
  exam resolution and grading of authored keys. Client typecheck passed.
- Broader workspace tests still fail in the existing passage-deletion and startup
  mocks. Repository-wide lint reports existing violations outside the changed
  components. Optional captured-TestNav package tests were skipped because their
  source/DOM environment paths were not configured.
