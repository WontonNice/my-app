---
na_heuristics: 
total_score: 22
p0_count: 0
target: Content Editor and Importer audit with verification follow-up
p1_count: 4
max_score: 40
target_identity: "file:C:\\Users\\minio\\Documents\\Codex\\my-app\\tools\\content-studio.html"
target_fingerprint: "sha256:65dc1af13be71f0a1aa07a79f1921a55ae64eca0ed15ed4250d13cec1ab5b919"
target_path: "C:\\Users\\minio\\Documents\\Codex\\my-app\\tools\\content-studio.html"
timestamp: 2026-10-30T00-00-37Z
slug: tools-content-studio-html
---
# Content Editor and Importer — audit and verification follow-up

Date: October 29, 2026 (America/New_York)
Target: tools/content-studio.html, with content-studio-documents.js, content-studio-workspace.js, content-studio.mjs and shared import/render/history code.
Method: two independent usability/evidence reviewers, parent source and saved-data review, focused tests, isolated failure injection, and native Chrome viewport/keyboard checks. Live production student records were not read or changed.

## Assessment and design specificity

The exam canvas, passage/question layout, answer-key controls and student preview fit educational authoring well. The main weakness is the transition between extraction, draft review, editing, duplicate resolution and publication. Different representations and save conventions make source fidelity harder to verify.

The following 22/40 score is the earlier independent manual usability baseline. It was not recomputed or inflated after the three recovery fixes. It is not an automated accessibility score or a certification.

| Heuristic | Score / 4 | Evidence |
|---|---:|---|
| System status | 3 | Saved state visible; source-verified state unclear. |
| Familiar terminology | 2 | JSON/repository vocabulary enters teacher work. |
| Control and freedom | 2 | Review navigation has inconsistent save/dismiss behavior. |
| Consistency | 2 | Main editor and draft review differ. |
| Error prevention | 2 | Passage and Math readiness policies differ. |
| Recognition over recall | 2 | Source verification requires external context. |
| Efficiency | 3 | Search and shortcuts help; draft queue is less capable. |
| Minimalism | 2 | Long repeated warnings and dense controls. |
| Error recovery | 2 | Conflict and issue repair paths need better guidance. |
| Help | 2 | Import steps exist; version/fidelity decisions need guidance. |
| Total | 22/40 | Manual baseline, all ten criteria apply. |

## Strengths

- Direct editing and Student view use the real exam presentation. The observed At Dusk question renders "best" in bold.
- Rich fields support emphasis, boxed excerpts, poetry, math, source images and multiple response types. The initial problem is not a lack of every formatting capability.
- Private drafts, source references, answer-key controls, source-hash checks and snapshot-backed score history provide a useful foundation.

## Priority findings awaiting broader application approval

1. P1 — The first import review uses escaped plain text and wraps the whole prompt in bold rather than displaying the rich source structure. It cannot verify the emphasis, boxes, images or formulas the teacher is being asked to approve. Use the student renderer during first review, with the source page/crop beside the selected item. Evidence: content-studio-documents.js renderImportReview.
2. P1 — Passage publication explicitly permits unresolved checks while Math generally blocks them. At the original review, all 16 published document entries retained unchecked source-review flags and unresolved notes. Some published images existed despite stale warnings; this is unreliable status, not proof that every passage is defective. Distinguish informational provenance, actionable issues, verification and successful exam assignment.
3. P1 — Review is an excessively long form rather than a focused repair queue. Bird Talk showed 22 issues, including notes about other passages; the expanded modal was about 6,435px tall inside a 648px viewport. Group issues by affected item, add Next unresolved, collapse empty optional metadata, and fix rich-field repair selectors.
4. P1 — Duplicate identity differs across import, publication, Part B and student-library aggregation. Initial fingerprints omit changed answer keys; publication comparison can ignore changed underline targets and stanza breaks. At Dusk has an alias plus two active source-labelled records, all considered equivalent by the current comparator. Preserve ordered question-set versions, explain differences, and treat source appearances as tags. Do not merge historical identities without a migration plan.
5. P2 — Reading controls clip on narrow screens, and the collapsed library's hover/click behavior conflicts. A 390px reading view puts Save passage at x=553–651. At 768px More formatting extends to x=858. At 1280px the observed layout fits. The review dialog also lacks an accessible name. Fix responsive controls and accessible naming as a separate approved UI change.

Additional reproduced fidelity limits: ordinary hyperlinks lose destinations; table cells can concatenate; a standalone inline image between paragraphs can be dropped by the passage formatter; answer-choice blank spacing is collapsed. Supported semantic formatting should survive uniformly, while unsupported structures should be retained and explicitly flagged. Original full Form A PDFs/answer guides were not available in the reviewed project/chat files; screenshots alone cannot certify all pages.

## Approved recovery fixes completed

The user explicitly approved the following three fixes after isolated tests reproduced them:

- Open-editor draft saves now use the revision originally loaded with that content. Refreshing library state cannot silently upgrade that revision. A rejected stale save keeps the local edits and dirty state.
- Passage content, identical-import source tags and passage-registry changes now use the existing atomic temporary-file/rename writer. Interrupted writes preserve the previous complete file.
- Retrying a publication that wrote its source but failed registration now repairs registration before marking the draft published. Repeated retries do not duplicate membership.

These changes are narrow; they do not implement the earlier proposed full source model, identity migration, transactional database, or mobile redesign.

## Completed verification

- Impeccable engine 0.1.5 installed in the writable Documents/Codex tools cache. The downloaded Windows x64 binary matches the official SHA-256: 477e544fc8880a5e82e427490cb9a5f5adab480c0e02966d33fd50772b531c71.
- Added tools/impeccable.ps1, which verifies that checksum, and tools/check-content-editor-design.mjs, which scans a retained source snapshot plus all nine CSS routes served by the running editor.
- Complete static detector result: 204 findings, comprising 34 primary warnings and 170 advisories; engine exit 2 means completed with findings, not clean. No linked stylesheet was missing in this completed scan.
- The static findings are candidates, not 204 verified defects. Typography and palette advisories are affected by DESIGN.md's broader student-portal scope. Consolas in JSON/code fields and symbol fonts are purposeful; hidden/legacy templates and runtime classes require live confirmation. No detector rules were suppressed to manufacture a pass.
- Real Chrome checks covered 390x844, 768x1024 and 1280x900. Mobile import and draft dialogs fit; reading-editor controls clip at the two smaller widths. Keyboard opening/closing and focus return worked in the unedited dialogs; this does not verify loss protection for edited modal content.
- Direct recovery suite: 12/12 passed. It covers stale saves, failed requests, temporary-write failures, transient/persistent locks, interrupted source/tag writes, source-hash conflicts, repeated registry repair failures and retries, and exam assignment retry.
- Existing document-import suite: 13/13 passed, including its real isolated HTTP import/edit/save/reload/publish integration case (approximately 110 seconds).
- History rehearsal: 3 current contracts passed, 1 future migration contract remains an executed TODO. Snapshot-backed synthetic attempts preserve scores, dates, all 14 question records, answer distinctions, ordering, timing and corrections.
- The pending legacy counterexample retains scores but loses original answer interpretation when IDs are naively replaced without a snapshot. Its evidence is recorded as passed:false. Marking it TODO does not certify a migration; no production identity migration exists or was run.
- The recovery checks verified 170 protected authored content files and assessment definitions remained unchanged; destructive operations were confined to disposable fixtures.

## Remaining verification limits

The engine's managed headless Chrome/Edge launch fails in this environment, including a Chrome Crashpad named-pipe failure. The successful static scan is supplemented by separate real-browser checks, not presented as a rendered detector scan.

Windows Narrator was genuinely launched and observed. Native control then failed because window geometry was unavailable and a screenshot disagreed with the accessibility target. Interaction stopped; Narrator was exited and process absence verified. Spoken output and Narrator navigation remain unverified. Accessibility-tree checks are not a substitute for a human-observed screen-reader walkthrough.

Production migration still requires an approved ID mapping, durable backup/snapshots, historically valid content for legacy attempts, rollback design and per-attempt reconciliation. No real student database was accessed.

## Workflow and fidelity tradeoffs

Preserve meaning-bearing formatting (emphasis, underlined targets, mathematical structure, stanza/sentence references, boxes, order and image relationships) while allowing ordinary fonts/margins/wrapping to adapt to the player. Retain original pages as evidence. Use structured editable content where supported and source crops with descriptions for unsupported visuals. Tables ultimately need real cell structure rather than silent text flattening.

For first-time teachers, external extraction and several meanings of review/preview create avoidable context switching. For frequent users, a flat draft queue and repeated note acknowledgements create unnecessary work. For keyboard and assistive-technology users, predictable naming, focus and dismissal are essential.

## Suggested next approval decisions

Prioritize fidelity/readiness/duplicate safeguards, or the combined review and library workflow. Decide whether missing essential content/keys/images must block publication or allow an explicit recorded teacher override. These broader changes remain separate from the three approved recovery fixes.

## Reproducible commands

From C:\Users\minio\Documents\Codex\my-app:

    .\tools\impeccable.ps1 engine-probe
    node tools/check-content-editor-design.mjs
    node --test tools/editor-recovery.test.mjs tools/editor-recovery-history.test.cjs
    node --test tools/document-import.test.mjs

The history command intentionally reports one pending migration contract. Do not describe a successful process exit as proof that this pending condition passed.
