# Content Studio redesign: final report

Date: 2026-11-17. Scope: the local Content Studio served by `tools/content-studio.mjs` on port 4319. Direction: "Teacher's Edition" (brief in `.impeccable/surfaces/tools-content-studio-html.md`). Baseline for all comparisons: commit `11ffd936`.

## Outcome

The editor was redesigned without changing what it does. Every control in the functional inventory is still present, the editable TestNav exam canvas is still the default view, and the editor test suites give the same results as before the work started.

## What changed, by step

| Step | Change | Files |
|---|---|---|
| 1 | Baseline: test suites run and recorded. | none |
| 2 | Theme: teal-black shell, teal for navigation, selection and primary actions, one answer-key magenta. Literal colors in the older style layers mapped to tokens. | all `tools/content-studio-*.css`, the style block of `tools/content-studio.html` |
| 3 | Navigation: a two-tier top bar replaces the side rail. | `content-studio-workspace.js` (30 lines added, 4 removed), `content-studio-workbench.css` |
| 4 | Passage and Part B editors: tighter header and toolbar, exam page as a sheet, support panel as the teacher's margin. | `content-studio-workbench.css` |
| 5 | Table screens share one page, filter and table style. | `content-studio-workbench.css`, `-english-review.css`, `-bank.css`, `-compare.css` |
| 6 | Math questions and the Exams/Worksheets builders. | `content-studio-workbench.css` |
| 7 | Dialogs share one frame; import review keeps its title and actions in view. | `content-studio-workbench.css` |
| 8 | Accessibility and responsive pass. | `content-studio-workbench.css`, `-english-review.css`, `-bank.css` |
| 9 | Verification and this report. | `docs/` |

Outside stylesheets, the only code change is in `tools/content-studio-workspace.js`: the navigation family label became a button, each family's workspace buttons got a wrapper, and `showNavFamily` decides which family's row is shown. `tools/content-studio.html` is byte-identical to the baseline outside its `<style>` block.

## Before and after

| Measure | Before | After |
|---|---|---|
| Main editor suite (`npm run content-editor:test`) | 128 of 128 | 128 of 128 |
| Supplementary shell and content tests | 38 of 39 | 38 of 39 (same failure) |
| Literal colors in editor styles | 761 (541 distinct) | 510 (383 distinct) |
| Uses of theme tokens | 239 | 621 |
| Lines of editor CSS | 2,858 | 3,071 |
| Exam page starts, 1440px wide | 364px from the top | 305px |
| Exam page starts, 1024px wide | about 448px | 327px (library closed) |
| Text contrast failures found by the audit | not measured | 0 across nine workspaces |
| Sideways scrolling at 768px and 390px | not measured | none |

The CSS grew by about 210 lines because the redesign overrides the older layers instead of deleting them; see "Remaining debt".

## Functional inventory check

Method: a script in the running editor looked up every selector below in each workspace and reported whether it was present and reachable. Nothing was missing. Interactions marked "exercised" were clicked and their effect asserted, then restored.

| Area | Controls checked | Result | Where it lives now |
|---|---|---|---|
| Shell | 12 workspace buttons, Math center and Answer sheets links (with `target` and `rel`), section picker, Library, Saved import drafts, Help, status region | all present | Top bar and workspace row; picker under 960px |
| Navigation | Family tab lists its workspaces without switching; click outside snaps back | exercised | Top bar |
| Library | Toggle, pin (and its saved preference), search, filters, bulk select, pager | toggle and pin exercised | Left column |
| Passage editor | 33 controls: save, student view, version, placement, formatting, question tools, answer summary, edit-mode select | all present | Item header and toolbar |
| TestNav default | Edit mode `exam`, canvas present, profile `testnav` | confirmed on load | Center sheet |
| Question navigation | Next and previous change the question picker | exercised | Toolbar, second row |
| Support panel | Opens from Answer summary, remembers its panel, closes on Escape | exercised | Teacher's margin, right |
| Student view | Dialog opens with a loaded frame and closes | exercised | Full-screen dialog |
| Rev/Edit A, SAT passages | Reuse the passage view; section is remembered | exercised | English and More content |
| Part B | 11 controls | all present | English > Standalone items |
| Math questions | 16 controls | all present | Math > Math questions |
| Exams (published) | 17 controls; section tabs and library search | tabs and search exercised | Manage > Exams |
| Exams (draft builder) | 14 controls: save draft, preview, publish, settings, question list actions | all present | Manage > Exams |
| Worksheets | Filters, new, all worksheets, search | all present | Manage > Worksheets |
| English center | 7 control groups; status filter (256 to 5 drafts and back) | filter exercised | English > English center |
| Question banks | 21 controls; bank tabs | tabs exercised | Top bar |
| Compare | Pickers, swap, run; a read-only comparison was run | exercised | Manage > Compare exams |
| SHSAT Lab bank | 10 controls | all present | Manage > Question bank |
| Regular practice | 11 controls | all present | More content > Practice |
| Dialogs | Six static dialogs present; nine opened and inspected | opened | Shared dialog frame |

Not exercised, because doing so writes content: every Save and Publish button, Ctrl/Cmd+S, the unsaved-changes prompts, and the delete actions. Their code is unchanged.

## Bugs found and deliberately not fixed

1. `tools/content-studio-library-refresh.test.mjs` fails with a null `querySelector` in `configureBuilderLibrary`. It failed the same way before the redesign.
2. Under 960px the workspace selector shows "Question banks" on first load while Reading passages is open. It corrects itself after the first switch.
3. Part B's "Source & details" panel shows a small empty white box under "Import details". Not confirmed whether it predates the redesign.
4. One "503 Service Unavailable" resource error appeared once in the browser console and did not recur.

## Remaining debt

- The older style layers (`content-studio-workspace.css`, 1,373 lines, and the 765-line style block in `content-studio.html`) are overridden, not removed. Deleting dead rules is a separate refactor.
- 510 literal colors remain, mostly in those layers and in rarely seen states.
- Four dialogs created in satellite scripts have no accessible name: math import, diagram batch, Part B import, Part B repeats.
- Bulk editing mode, focus mode, and an import-draft item in the passage editor were not opened during the redesign.
- No screen reader walkthrough and no Windows high-contrast check were done.
- The independent finish review called for by the design brief was not run, and the project-level `DESIGN.md` was left alone because it documents the student portal.

## Keeping it clean

- Take colors, radii and sizes from the tokens at the top of `tools/content-studio-workbench.css`. Do not add literal colors.
- Put shared styling in `content-studio-workbench.css`; keep per-screen layout in that screen's own file.
- Preserve element ids and `data-` attributes when changing presentation; scripts and tests depend on them.
- Leave the inline script in `content-studio.html` where it is; tests locate code in it by exact text and indentation.
- After any presentation change, run `npm run content-editor:test` and check the changed screen at 1440, 1024 and 390px.
- New asset files must be added to the server allowlist in `tools/content-studio.mjs`.
