# English passage organization

Passage source/collection is stored as `passageCategory`, separately from `passageType` (genre), rendering format, and each student's assignments. Allowed source options and labels live in `server/src/shared/passage-category-options.json` and the shared typed helper. No new database migration is needed for categories: this repository authors passages in TypeScript, and exports their metadata to the existing server catalogs.

## Classify existing content

Start/restart Content Studio with `npm run content-editor`. Open a passage's **Settings → Passage Category**, choose its source, and save normally. Both exam and advanced passages support this field.

For bulk updates, select the checkboxes in the existing passage library, open **Bulk categorization**, choose a category, and apply it. **Select this page** selects up to 50 matches, including folded versions; repeat across pages as needed. Bulk writes preflight every source hash, then atomically replace individual files, changing only the formatter's category metadata. Text, indentation, rich text, answer keys, questions, comments, IDs, and exam membership remain intact. If a write fails partway through a batch, the error reports how many files succeeded; reload before retrying.

Unclassified old content safely reads as **Miscellaneous**. No title-, genre-, or folder-based source guessing is performed. This fallback is persisted the next time a passage is saved/classified. Original import JSON remains compatible; `passageCategory` is optional and validated when supplied.

Content Studio refreshes both the exam and learning catalogs. Production deployments must rebuild the app/server to publish authored metadata changes; students' existing task/result records are not rewritten. Human-readable version labels now survive the passage formatters as well.

## English Study Hall

The reading catalog contains exactly the eight reading skill categories. Created practice sets appear inside the matching topic's **Practice** section, rather than becoming top-level topic cards. A separate **Revising & Editing** section contains the eight editing topics, their published practice sets, and a link to assigned revising/editing assessments.

The student **Single passages** shelf groups versions of the same title/author into one book. Questions are deduplicated by their authored content and grading meaning, including formatting and choice-order differences; distinct questions and conflicting answer keys remain separate. Each question retains its original passage context. The current 30 SHSAT version entries produce 25 shelf books. Collection, reading type, source category, sorting and clear controls are inside the **Library** UI. Books with multiple source categories match each represented category.

Combined books use a distinct `book-…` ID, so new attempts do not overwrite earlier version attempts. Existing version URLs continue to resolve their original questions and saved work, and combined readers provide links to those versions. Any original version's assignment or access code can authorize the combined book. New combined attempts are graded against the exported server-side book, ignoring submitted answer keys; completion evidence applies to the original version aliases. No student records, exam sets, or answer keys are migrated or rewritten.

`tools/export-learning-catalog.cjs` exports the combined book registry to `server/data/library-books.json` alongside the original source catalogs. Run `npm run test:study-hall` for grouping, grading, access preservation and offline rendered-page checks. `npm run preview:study-hall` serves the real English page and readers with a fictional session at port 4330; it never connects to Supabase. The browser tool failed to initialize during this check, so live visual acceptance remains unverified; the rendered page, API regressions, typecheck, lint and build were checked.

## Student record details

**Available content** combines source category, genre, subject, skill, search, and this student's actual current history status. Source inventory counts are unique passages: remaining = never assigned, used = previously issued or completed, completed = ever completed, including repeats with a currently active assignment. Planned-only reservations are not used. These historical counts can overlap current status counts; they are not attempt totals. The category buttons browse fresh content from that source.

**Passages & question types** preserves existing response counts and adds grouping by category or skill, independent filters, and two-direction sorting for name, accuracy, correct, tested, incorrect, unanswered, assessment count, category, and last actual attempt. Tested includes unanswered questions. Status metadata is reused from the plan's single indexed inventory request; unavailable status is never labeled never-assigned. Never-assigned material has no performance evidence and can be opened in the available-content workflow.

Category accuracy summaries require at least five verified question responses across two assessment records. Smaller samples expose counts, not a claimed category performance summary. Summary-only paper scores cannot contribute individual/category evidence. Category → passage → question → exact response uses the existing grading/review components. Sorting/filter/group state remains in component state during drills and while switching record workspaces; closing a question does not reset controls.

## Validation

`npm run test:passage-organization`, `npm run content-editor:test`, `npm run content-editor:validate`, `npm run test:learning-plan`, `npm run test:exam-review`, `npm run test:exam-presentation`, `npm run typecheck`, `npm run lint`, and `npm run build`.

The local analytics/learning-plan preview tools use explicitly fictional student data and illustrative categories. Those fixture classifications are not changes to the real library.

## Student progress: source and completion history

The teacher student-progress record includes a **Passage progress** analytics tab.
Each original source version has its own row, even when two versions share a title.
The table shows the source/version label, historical completion state, and latest
recorded completion date. **All passages**, **Completed passages**, and **Not yet
completed** filters combine with title/source search. A repeated assignment does
not erase earlier completion. Planned, assigned and in-progress work without a
completed result remains not yet completed.

Available content and passage response patterns also display source/version and
last-completed columns. The Available content completion filter clears the default
Never assigned status filter so completed work is visible. Completion dates come
from completed assignment records or saved passage attempts/results, never an
assignment/update timestamp. Missing or invalid dates display **No Data**; timestamps
use America/New_York, while explicit date-only records retain their calendar date.
In-progress and Math-only exam records do not establish English passage completion.
No Data is also used when no actual source/version label is recorded.

The teacher overview adds optional `lastCompletedAt` to each inventory row; no
database migration is required. `npm run test:passage-progress` verifies actual
completion dates, historical repeats, source versions, student isolation, missing
dates, incomplete exams, filtering and the rendered progress table.
