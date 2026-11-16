---
version: 1
slug: "tools-content-studio-html"
primary_target: "tools/content-studio.html"
related_targets: ["tools/content-studio-workbench.css","tools/content-studio-workspace.css","tools/content-studio-workspace.js"]
---

# Content Studio (local editor, port 4319)

Scope: the whole local Content Studio served by `tools/content-studio.mjs`. Visitor mode: Operate.

Audience and job: Nathan and teaching staff authoring SHSAT/SAT passages, questions, answer keys, math items, and assembling exams and worksheets, usually at a desk monitor for long sessions while checking against a source booklet or PDF.

Task: edit content directly in the exam presentation, key answers, classify, review, and publish, without losing work.

Constraints:
- Presentation only. Every element id, data attribute, handler, save flow, unsaved-changes guard, localStorage key, Ctrl/Cmd+S and Escape behavior stays as is.
- The editable TestNav exam canvas (`#studio-exam-canvas`, "Edit exam" mode) stays the default view. Student preview documents keep their own exam typography and markup.
- The inline script in `tools/content-studio.html` is located by tests through exact anchor text and indentation; do not move or reindent it.
- No new dependencies and no web fonts; the tool must work offline.
- New asset files must be added to the server allowlist in `tools/content-studio.mjs`.

Chosen by the user on 2026-11-16: Teacher's Edition. The earlier Hallmark "light workbench" look is retired.

Unresolved: whether the legacy style layers (inline style block and `content-studio-workspace.css`) are cleaned up or only overridden; treat as a separate refactor decision.

## Direction contract

THESIS: The student page sits in the middle exactly as students see it; everything a teacher adds lives in a margin beside it, in a second ink. Refuses the grey sidebar-plus-blue-accent admin workbench.

OWN-WORLD: Deep teal-black top bar; white working surfaces on a cool grey-blue desk; teal for navigation, selection and primary actions; one answer-key magenta reserved for teacher annotations (answer keys, the margin rule, key flags); pale tinted margin panel. System sans throughout; mono only for ids.

STORY: The teacher sees the real exam page, knows what is theirs to add, and trusts that what they see is what students get.

FIRST VIEWPORT: 52px top bar with brand, five workspace families, and Library / Saved import drafts / Help on the right; a 44px row of the active family's workspaces with save state at its right end; slim library column on the left; the TestNav exam page centered under the item title and formatting toolbar; the teacher's margin (the existing support panel) docked right. Primary action "Save passage" sits at the right end of the item title row.

FORM: Annotated teacher's-edition textbook, position 1 on the grounded list, chosen by the user over the roll. seed:d8189f32907edca7. Signature move: answer-key ink in the margin, tied to the student page.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
