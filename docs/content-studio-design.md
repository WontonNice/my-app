# Content Studio workbench

This design applies only to the local Content Studio at port 4319. Student exam previews keep their own rendering and typography.

The editor uses a light workbench with a persistent, grouped navigation rail, a contextual library button, and one active editing surface. English review is a filterable table with status, exam usage, and bulk review actions. Its records remain the existing canonical content inventory.

The theme lives in `tools/content-studio-workbench.css`, loaded after the legacy surface styles. It owns shell geometry, typography, control treatments, responsive navigation, and shared colors. English review owns its table layout in `tools/content-studio-english-review.css`. Both use the workbench's tokens. The restrained blue accent marks selection and primary actions; green, amber, and red carry existing status meanings. The system font keeps the local tool usable offline.

Exams and Worksheets are distinct navigation entries and libraries. Both reuse the existing assembly editor, importer, and student player. `studyHallWorksheet` determines placement; switching libraries retains independent selections, filters, and unsaved drafts. Worksheets have subject, category, and source filters, search across title and placement, and 30-item pages. Creation saves Study Hall placement immediately, so a new worksheet never appears temporarily among assessments. Publication and math editing also separate their destination libraries. Changing placement does not change IDs, content, attempts, or progress history.

Desktop has a 204px navigation rail and a 64px header. Under 960px the native section selector replaces the rail. Below 600px the library occupies the active area until dismissed, keeping both navigation and editing reachable. Review rows become labelled blocks under 650px.

Scroll ownership is explicit: the shell stays within the viewport; every active view permits vertical scrolling; compound editors own their individual pane scrollers. The English review table has `min-height: 0` and `overflow: auto` in a bounded flex layout. On small screens the view scrolls the stacked records instead. Do not make an ancestor clip overflowing content unless a descendant provides a reachable scroller.

Preserve existing element IDs, data attributes, save flows, draft guards, shortcuts, and student-rendering frames when changing presentation. The sidebar groups existing navigation buttons rather than replacing their handlers. The header library control delegates to the existing pin/open behavior and mirrors its accessibility state.

Exam and worksheet builders expose an “All exams” / “All worksheets” return button next to the page title. It clears the active library's search, filters, and page, pins the list open, and preserves the selected draft and unsaved edits. Entering either builder from navigation also opens its library.

Assembly builders put publication status, Save draft, Student preview, review confirmation, and Publish together before the question list. Desktop keeps this workflow visible while the builder scrolls; phones use ordinary document flow so the actions do not cover the preview. Feedback and a guarded “Reload saved draft” recovery action appear beside these controls. Preview content and validation results open directly below them. The review checkbox requires a preview, and editing settings or question membership clears the current preview confirmation. Server validation and immutable publication remain authoritative.

Existing assemblies collapse their title, timing, classification, and source settings into a disclosure; new assemblies open it. Invalid required fields expand it before browser validation. The builder uses a single gutter, a grouped question toolbar, and compact question actions. Below 960px, opening an assembly closes the library so the active editor is reachable; the Library and All worksheets/exams controls reopen it.

Library passage types follow their section: Revising/Editing Part A always displays and saves `revising_editing` (“Revising/Editing”). Reading retains Informational, Literary, and Poem. Long reading is retired from choices, filters, and import prompts; legacy values remain readable and normalize on import/load/save. Passage format (prose, poetry, sentence-numbered prose) remains separate from this library classification.

Authoring frames wait for the shared response renderer's `exam-response-ready` event (or its ready flag if already rendered) before binding editable choices. The iframe load event alone is insufficient because the response bundle loads dynamically. Superseded frame documents must not bind to a newer draft.

Validation: run `node --test tools/content-studio-workspace.test.mjs tools/content-studio-math.test.mjs tools/content-review.test.cjs tools/content-studio-workbench.test.mjs`. In the browser check English review at the first and last records, filter results, open editors, toggle the library, and confirm reachable save and inspector controls on desktop and at 390px.

## Redesign verification

Hallmark 2.0.0 is installed in the user's global Codex skills folder. The app uses the selected clean, light direction, with Refract's restrained light surfaces adapted to a working editor.

The two new/replaced styles pass Hallmark's static app-scope checks: 0 failures, 0 reflex findings, 0 warnings. Browser verification used the connected Chrome tools rather than Hallmark's separate Puppeteer renderer.

The editor, math, review, and shell tests pass (72 tests). The content synchronization suite also passes (21 tests, including 8 review tests shared with the first group): 85 unique targeted tests.

Desktop and 390px checks confirmed that the English center reaches its last question, search finds all five gelato matches, header controls fit, libraries open and close, and formatting tools open on mobile while question navigation stays visible. Math rows have enough height for their full labels and review badges. No exam questions or review completion statuses were changed during UI verification.

Hallmark's independent finish review identified three usability issues. All were resolved: passage-title width, mobile formatting/navigation hierarchy, and short mobile workspace names. Student preview rendering and the persistence/synchronization behavior remain separate from the new presentation layer.
