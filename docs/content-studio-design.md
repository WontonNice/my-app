# Content Studio workbench

This design applies only to the local Content Studio at port 4319. Student exam previews keep their own rendering and typography.

The editor uses a light workbench with a persistent, grouped navigation rail, a contextual library button, and one active editing surface. English review is a filterable table with status, exam usage, and bulk review actions. Its records remain the existing canonical content inventory.

The theme lives in `tools/content-studio-workbench.css`, loaded after the legacy surface styles. It owns shell geometry, typography, control treatments, responsive navigation, and shared colors. English review owns its table layout in `tools/content-studio-english-review.css`. Both use the workbench's tokens. The palette is the "Teacher's Edition" direction (`.impeccable/surfaces/tools-content-studio-html.md`): a teal-black shell, teal for navigation, selection and primary actions, and one answer-key magenta (`--studio-key`) reserved for what the teacher adds, such as the Answer summary. Green, amber, and red carry existing status meanings. Legacy style layers reference these tokens rather than literal colors; use a token for any new color. The system font keeps the local tool usable offline.

Exams and Worksheets are distinct navigation entries and libraries. Both reuse the existing assembly editor, importer, and student player. `studyHallWorksheet` determines placement; switching libraries retains independent selections, filters, and unsaved drafts. Worksheets have subject, category, and source filters, search across title and placement, and 30-item pages. Creation saves Study Hall placement immediately, so a new worksheet never appears temporarily among assessments. Publication and math editing also separate their destination libraries. Changing placement does not change IDs, content, attempts, or progress history.

Desktop navigation is two tiers. A 52px top bar holds the brand, Question banks, and one tab per workspace family (English, Math, Manage, More content), with Library, Saved import drafts, and Help on the right. A 44px row below lists the workspaces of the shown family. A family tab only changes which workspaces are listed; it never switches workspace, so unsaved-change guards stay on the workspace buttons. Clicking outside the navigation, pressing Escape inside it, or switching workspace returns the row to the family that holds the open workspace. Question banks has no family, so its row collapses. Under 960px the native section selector replaces both tiers. Below 600px the library occupies the active area until dismissed, keeping both navigation and editing reachable. Review rows become labelled blocks under 650px.

The passage and Part B editor has three bands above the student page. The item header puts the title, version, and save state on one row and the tools, placement selects, and Save on the next. The toolbar puts formatting on its first row and the question tools after it; outside bulk editing its two wrapper elements are flattened with `display: contents` so the tools wrap as one run and the hint takes the end of the last line. Document order is unchanged, so focus order is too. The student page sits on the desk as a shadowed sheet. The support panel is the teacher's margin: a tinted ground with its title, the current answer row, and answer values in `--studio-key`.

The table screens (English center, Question banks, SHSAT Lab question bank, Compare) share one page pattern defined at the end of `tools/content-studio-workbench.css`: a white work surface, a 24px page title with a muted description, 12px field labels, and a tinted sticky table header in sentence case. Each screen keeps its layout rules in its own stylesheet. The small uppercase labels above the SHSAT Lab and Compare titles are hidden because the navigation already names the section.

Math questions uses the same item header as the passage editor. Its question outline is a compact flat list where only the open question is filled, the live student preview is a shadowed sheet, and the answer-key lock uses `--studio-key`. Exams and Worksheets sit flush under a slim page header instead of floating as cards: the library is a flat list, the builder header puts View exam and Edit math questions on the left with save state and Save on the right, and the Reading / Part A / Part B / All sections tabs are underlined like the navigation.

Dialogs share one frame: a 10px radius, the workbench shadow and overlay, an 18px title, and no small uppercase label above it. Checkboxes and radios inside dialogs keep their natural 16px size. In the import review dialog the title row and the action row stay in view while the form scrolls (the action row is static under 600px), and the document's classless buttons are styled there. The student preview header uses the shell color; the exam below it is untouched.

Scroll ownership is explicit: the shell stays within the viewport; every active view permits vertical scrolling; compound editors own their individual pane scrollers. The English review table has `min-height: 0` and `overflow: auto` in a bounded flex layout. On small screens the view scrolls the stacked records instead. Do not make an ancestor clip overflowing content unless a descendant provides a reachable scroller.

Preserve existing element IDs, data attributes, save flows, draft guards, shortcuts, and student-rendering frames when changing presentation. The sidebar groups existing navigation buttons rather than replacing their handlers. The header library control delegates to the existing pin/open behavior and mirrors its accessibility state.

Exam and worksheet builders expose an “All exams” / “All worksheets” return button next to the page title. It clears the active library's search, filters, and page, pins the list open, and preserves the selected draft and unsaved edits. Entering either builder from navigation also opens its library.

Assembly builders put publication status, Save draft, Student preview, review confirmation, and Publish together before the question list. Desktop keeps this workflow visible while the builder scrolls; phones use ordinary document flow so the actions do not cover the preview. Feedback and a guarded “Reload saved draft” recovery action appear beside these controls. Preview content and validation results open directly below them. The review checkbox requires a preview, and editing settings or question membership clears the current preview confirmation. Server validation and immutable publication remain authoritative.

New exam drafts use the same Library label and grouped exam list as existing exams. Labels such as Prestige organize the library independently of publication and student access. The draft builder saves that label with the exam; omitted label fields from older clients preserve the existing value. Draft exams show publication status and question counts in the library. Publish stays visible beside Save draft and Preview & review, with review and content checks controlling availability. Preview sections come from the assembled content, so math-only exams open Math and mixed exams offer both English and Math.

Exam publication does not require question category, source, or math topic metadata. Those fields can be completed later through the question bank. Prompt and answer-key validation, review of the current student preview, and worksheet publication requirements still apply.

Existing assemblies collapse their title, timing, classification, and source settings into a disclosure; new assemblies open it. Invalid required fields expand it before browser validation. The builder uses a single gutter, a grouped question toolbar, and compact question actions. Below 960px, opening an assembly closes the library so the active editor is reachable; the Library and All worksheets/exams controls reopen it.

Library passage types follow their section: Revising/Editing Part A always displays and saves `revising_editing` (“Revising/Editing”). Reading retains Informational, Literary, and Poem. Long reading is retired from choices, filters, and import prompts; legacy values remain readable and normalize on import/load/save. Passage format (prose, poetry, sentence-numbered prose) remains separate from this library classification.

Authoring frames wait for the shared response renderer's `exam-response-ready` event (or its ready flag if already rendered) before binding editable choices. The iframe load event alone is insufficient because the response bundle loads dynamically. Superseded frame documents must not bind to a newer draft.

Validation: run `node --test tools/content-studio-workspace.test.mjs tools/content-studio-math.test.mjs tools/content-review.test.cjs tools/content-studio-workbench.test.mjs`. In the browser check English review at the first and last records, filter results, open editors, toggle the library, and confirm reachable save and inspector controls on desktop and at 390px.

## Accessibility and responsive rules

- Text and background pairs on every workspace meet 4.5:1. New colors must come from the tokens in `tools/content-studio-workbench.css`; check any new pair before using it.
- Notes, counts and labels on the main screens are at least 12px. A few compact badges stay at 11px.
- Keyboard focus is a 2px outline: white on the dark bar, teal on light surfaces. Do not remove outlines without replacing them.
- Disclosure summaries are at least 24px tall. Toolbar controls are 32px; other buttons are 36px.
- No workspace scrolls sideways at 1440, 1024, 768 or 390px. The only horizontal scrollers are the tables that own one.
- Under 600px the question picker shrinks so previous, picker and next stay on one line with the answer summary.

Known gaps: several dialogs created in the satellite scripts (math import, diagram batch, Part B import and repeats) have no accessible name, and the phone workspace selector shows the first option instead of the open workspace on first load.

## Redesign verification

The Teacher's Edition redesign was verified in the running editor at 1440, 1024, 768 and 390px, workspace by workspace, with the editable TestNav exam canvas confirmed as the default view. Run `npm run content-editor:test` and the shell tests listed under Validation after any presentation change; `tools/content-studio-library-refresh.test.mjs` fails for a reason that predates the redesign.
