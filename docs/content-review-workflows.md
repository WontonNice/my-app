# Content review workflows

## Math: finish a group

Open a test in Math and expand **Finish multiple questions** in the question editor.

- **Mark all … finished** finishes every question currently marked Needs editing in that test.
- **Mark range finished** accepts displayed math question numbers such as `1-5, 8, 10-12`. Numbers refer to the full math section, even when its question list is filtered.
- The action saves current math edits once. Existing validation and stale-source checks still apply. If validation or saving fails, review flags are restored and edits remain available.
- Completing review does not approve Math Command Center classifications; those controls remain separate.

## English command center

Choose **English center** in the navigation or **English command center** in the mobile workspace selector. It covers saved Rev/Edit A questions, canonical standalone items with retained source versions, and unpublished imports for these sections.

Search question wording, separate stimuli, passage context, source labels, IDs, or exam titles. Filter by section, exam, topic, review status, or possible repeats. Select saved rows or all shown saved questions, then use **Mark selected finished** or **Mark needs review**. Selection clears when filters change. Drafts cannot be marked finished here; open their editor to review and publish them individually.

**Open editor** returns to the existing authoring workflow. **Possible repeats** narrows the table to related copies for inspection. These are candidates, including embedded versus separate paragraph layouts, not automatic merges; inspect formatting and source context in the editor before combining anything.

Finished status applies to the current saved question and its passage context or retained source versions. Content changes return it to Needs review. No previous English question is assumed to be reviewed. Status is saved in `server/data/english-review.json`, separate from question content, so it can travel with the repository between PCs. The endpoint checks the review revision and selected content hashes before writing; stale, missing, duplicate, or draft selections fail without partial updates.

## Validation

`npm run test:content-sync` includes range parsing, bulk math save/rollback, English filtering, grouped usage, draft protection, review invalidation, and authenticated HTTP update tests. Existing workspace and math tests also passed. Desktop and mobile browser checks covered layout, filters, navigation, and invalid-range feedback. No real questions were marked finished during testing.
# Library book review

The Study Hall catalog and book player link to `/teacher/library/:bookId#book-settings`. Teachers select library questions there and open the existing Content Studio cover uploader through a passage-specific link. Source exams retain their original membership. An explicit `coverImage` is the only catalog cover; passage illustrations never become covers.

Library sessions use `ExamSessionPage` through `LibraryBookSession`, which adapts answers to the existing library attempt API. It does not write assessment results. Student progress lists library attempts separately. Original-version links and frozen historical question/passage snapshots remain available.

Teacher selections are stored in the existing server-write-only `student_practice_progress` library namespace: `english-library:settings:<bookId>` identifies the current selection, and `english-library:edition:<revision>` retains each saved selection. Launches carry their edition and source fingerprint so a later selection change cannot regrade an in-flight attempt against different questions. New source questions require teacher review; existing selected IDs remain selected. Cover-only changes do not invalidate question review.

