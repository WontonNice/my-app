# Exam and question synchronization

Authored questions live in the existing passage files, math-section files, standalone bank, and imported SHSAT Lab bank. Exam modules reference those records. `tools/exam-catalog.cjs` resolves the same exam content as the student player and derives the assessment question summaries from it. Do not independently edit those summaries in `server/data/assessments.json` for registered exams.

The registry still owns assessment settings: access, assignments, forms, duration, and other operational metadata. Teacher-created assessments without an authored exam module retain their registry-based content.

## Checking and publishing

- `npm run content:sync:check` performs a read-only audit. It exits unsuccessfully for missing editor questions, inconsistent membership, duplicate bank IDs, invalid imported-set references, stale registry summaries, or a stale server export.
- `npm run content:sync` rebuilds the derived exam JSON and registry question summaries, then runs the audit. Use this after editing authored content directly.
- `npm run test:content-sync` tests reconciliation and the create → edit → find → assign workflow in an isolated fixture.
- `npm run verify` starts with the synchronization audit.

Content Studio publishes derived exam data before reporting a successful passage, math, standalone, exam, taxonomy, or bulk passage-category save. Bulk categorization also updates the learning catalog immediately. An editor refresh is no longer required to publish those changes. Re-running synchronization repairs an interrupted export. Each generated file is replaced atomically; the group of files is not a database transaction.

Existing legacy math categories with no subtopics may be retained unchanged while other topics are reorganized. They no longer block every taxonomy save. New empty categories and clearing all subtopics from a configured category are still rejected.

## Identity, order, and versions

A question ID identifies one authored bank record. Saving a standalone question cannot rename its ID. Passage, math, and standalone saves reject IDs already owned by another bank record. Reuse a question through exam references; create a distinct record when the question is genuinely different.

Exam position is derived from the existing `questionOrder` behavior used by the player. Sorting the catalog never changes exam order or identity. Retained standalone source versions keep their original IDs and content and expose their canonical relationship. Exam-specific presentation overrides continue to use the existing invalidation rules. Synchronization does not automatically merge similar-looking questions.

The full exam JSON retains response-format-specific answers, explanations, images, and passage context. The registry is a compact summary, not a replacement for the grading payload. Saved student attempts and their `analysisContent` snapshots are not rewritten or regraded by synchronization.

## Shared catalog API

Content Studio provides `GET /api/question-catalog`, an index of the existing authored and imported records. It does not create another editable bank. Each entry includes its stable ID, canonical ID, question data, editor location, exam appearances with position, and imported practice-set usage. Math classification metadata uses the same managed state as the math editor.

Filters: `id`, `canonicalId`, `subject`, `section`, `topic`, `subtopic`, `difficulty`, `type`, `kind`, `status`, `assessmentId`, and `search`. Use `id` for an exact lookup and `canonicalId` for a question's explicit source versions. Sort by `id`, `topic`, `subject`, or `type`, with ID as the stable tie-breaker. For example: `/api/question-catalog?subject=Math&topic=Algebra&sort=id`.

`GET /api/question-sync` returns the local audit report. These endpoints belong to the local Content Studio server and retain its existing origin restrictions. The existing SHSAT Lab tab remains its specialized import/review workflow; the shared catalog covers the other question sources as well.

## Audit and reconciliation: 2026-11-06

Checked 30 authored exams and 2,895 bank records: 1,452 math, 95 standalone (including retained source versions), 1,342 passage questions, and six imported questions in one practice set. Every current exam question was already discoverable by the editor's source parsers; no duplicate bank IDs were found.

The registry contained 218 stale question summaries, five missing entries, four obsolete entries, and two membership/order mismatches. Stale fields included prompts, choices, answer keys, topics, and skill metadata. Reconciliation now passes with zero audit issues.

The four obsolete registry IDs were `spirit-herd-1` through `spirit-herd-4`; the exam already used `spirit-of-the-herd-spirit-herd-1` through `spirit-of-the-herd-spirit-herd-4`. The fifth missing entry was `excerpt-from-the-fix-it-saturdays-7`. The repair used existing authored IDs without guessing a historical answer migration.

Byte comparisons immediately after reconciliation confirmed that the repair left `exam-content.json` and `math-import-review.json` unchanged. All assessment properties other than question summaries were unchanged. Recovery copies and detailed before/after reports are local in the ignored `artifacts/question-sync/` directory.

Two standalone records were subsequently added concurrently to `digital-shsat-practice-test-adaptive-10-hard`: `satcc-9cc827afe5f992f7af37-ela-48` and `satcc-9cc827afe5f992f7af37-ela-50`. The empty `grade-9-2018-2019` exam was also registered during validation. These additions were preserved, and the new exam's derived export was refreshed. The final audit covers 31 exams and 2,897 records, including 97 standalone records, and reports zero issues. Existing question contents and assessment settings are unchanged from the pre-repair snapshot; the concurrently edited exam's `updatedAt` also changed.

## Validation

- `npm run test:content-sync`: 10 passed, including immediate bulk-category publication and the create/edit/find/assign workflow.
- `npm run content-editor:test`: 117 passed, including the legacy empty-category regression.
- `npm run typecheck` and `npm run build`: passed.
- Targeted lint for `client/src/content/exams/index.ts` and `git diff --check`: passed.
- Repository-wide `npm run lint`: blocked by 19 existing errors and five warnings in unrelated React files; those files were not changed for this task.

Restart Content Studio once to load the updated save handlers. The changes are local and have not been committed or pushed.

## Save performance: 2026-11-06

The exam and learning exporters share a bounded cache of compiled TypeScript. Each load still reads the current source text; exact source changes invalidate cached compilation even when file size or timestamps do not change. Evaluated modules, question data, identity validation, and synchronized exports are not cached by this change.

An isolated full-project fixture measured three Part B save-and-refresh cycles with 31 exams. Original save processing: 8.0–8.4 seconds; cached compilation: 3.7–4.6 seconds. Complete save plus state refresh: 24.2–25.5 seconds before, 15.0–19.3 seconds after. These are local fixture measurements under current machine load, not a guaranteed browser latency. Cold startup still compiles source, and refreshing the complete editor library remains significant work.

Validation: the 10 synchronization tests and three new compilation-cache tests passed. The real audit passed for 31 exams and 2,910 records. Detailed timing logs are in the ignored artifacts/question-sync directory. Content Studio was restarted to activate the change.
