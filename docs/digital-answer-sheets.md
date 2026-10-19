# Digital answer sheets

Students find **Answer sheets** in the student sidebar and directly on Home. The dedicated list shows Start, Continue, and View actions for their own assigned sheets.

Open **Teacher dashboard → Assessments → Digital answer sheets → Create Answer Sheet**. The teacher overview and each student's record also link here. The Content Studio navigation links to the same authenticated workflow.

## Teacher workflow

1. Enter a title, optional source/year/form, instructions, and optional existing PDF/source URL. A printed booklet alone works.
2. New sheets start with 20 single-choice rows. Edit question numbers, response types, labels, and selection limits directly in the table. Add more rows in batches or add sections. Labels can be A–D, E–H, A–E, or custom. Set equal minimum/maximum values for “exactly N.” Each section has independent numbering.
3. To change several rows before issue, select them and apply the row defaults, or remove them together. Preview the configured sheet. Instructions, a PDF link, and submission settings are optional and grouped together.
4. Save, select individual students, optionally set a due date, and assign. Existing homework views open the sheet in the platform. Assign again explicitly creates a distinct assignment/attempt while retaining earlier work.
5. Use **Student work** to inspect saved activity and exact responses. Add keys later in **Answer key**, grade/regrade the existing submission, enter manual points where necessary, then explicitly release results.

Issued structure is frozen, including source version, stable item IDs, response types, and option IDs. **Create revised copy** creates a new draft without changing existing assignments. Keys and grading can change with audit history. The UI supports 500 items across up to 20 named sections, 2–12 option labels, and 10,000 characters per short response. Input exceeding a limit is retained on the device and shown as unsaved until corrected; it is never silently truncated.

Keys are optional. Choice keys use the existing exam grading helper; multi-select uses exact-set matching, independent of selection order. Text keys explicitly choose exact text or existing case/whitespace normalization. Manual responses and missing keys remain pending; no final score is published while pending items remain. There is no AI grading and no inferred partial-credit policy. Teachers can explicitly assign manual points within the configured range.

Students enter responses in a compact table with section tabs below it. Single-choice cells are keyboard-friendly dropdowns, multi-select cells use checkboxes, and short answers remain text fields. **Paste answer column** previews one-column spreadsheet text before applying it. It validates configured labels, rejects extra columns or shifted rows, decodes quoted multiline TSV cells, and sends changes through the same autosave queue. Blank pasted rows clear responses. Ordinary paste into a short-answer field preserves line breaks. Alt + Up/Down moves between rows; Tab moves between controls.

## Persistence and concurrency

The feature reuses existing Supabase `student_practice_progress`, `student_assignments`, and `student_exam_results`. No new database migration is required beyond the platform's existing progress and learning-plan migrations.

Namespaced progress records hold sheet definitions and attempts. Definitions, keys, mappings, and private grading history are owned by the teacher. Student-owned attempt records contain only the public response structure, raw answers, flags, navigation state, editing lease, and immutable submission snapshots. Existing row-level security permits authenticated users to read their own progress; writes remain server-side. Generic progress and exam-result endpoints reject the protected answer-sheet namespaces.

Each assignment has exactly one durable active attempt record, protected by the existing `(user_id, topic_slug)` uniqueness constraint. Opening a sheet loads that record; it does not upsert an empty initial state. Responses use the existing `SelectedAnswers` representation: a string for single choice/text and an array of stable option IDs for multiple selection. Original labels are retained in the frozen structure.

The client sends targeted changed items. The server validates and merges those changes into the current JSON progress document, then commits with an atomic `progress->>revision` compare-and-swap filter. This uses the existing JSON-document storage architecture while rejecting stale whole-document writes. Client saves are serialized, bounded by item count and UTF-8 size, and use mutation identifiers for lost-acknowledgment retries. Older acknowledgments never replace newer visible typing.

A two-minute renewable server lease detects competing sessions. A different tab/device must explicitly take over while the lease is active; saves from the old session are rejected. Reloads reuse the tab's session identifier. Heartbeats keep an idle active editor's lease alive. A conflicting writer retains local work and must reopen/review recovery before continuing.

The page follows existing authentication token refreshes, reopening the same attempt and recovering pending edits rather than continuing to send an expired token. Signing out or switching accounts clears the rendered session and returns through the existing authentication flow.

Every edit is copied to a recovery queue scoped by authenticated student and stable attempt ID. Local recovery is supplemental; **Saved** means a server acknowledgment. Offline/failed saves stay visibly pending and retry. Recovery conflicting with a newer server response requires choosing server answers or explicitly applying recovered device answers. If another session has already submitted, differing device drafts remain visible as recovered-but-unsubmitted work and can be applied after a teacher reopens the attempt; they are never presented as part of the submitted snapshot. If recovery storage is unavailable, the page warns the student to keep it open until server confirmation.

Submission first drains saves, validates selection requirements and the unanswered policy, then commits a server snapshot under an idempotent submission ID. Offline submission stays pending. Repeated requests cannot create duplicate snapshots. Reopening retains earlier snapshots and appends an audit event.

## Results, mapping, and export

Submitted attempts can remain ungraded indefinitely. Teacher-only grading records retain each scoring revision and key version. Release writes a provenance-labeled result into existing student results and Student Insights. Existing totals-only paper scores are unchanged. Unmapped answer sheets contribute honest released totals, without invented skills, passages, question metadata, or solving times.

**Link questions** maps every stable source item to a specific digitized question ID, plus explicit option-ID mappings. Preview reports missing/duplicate questions, wrong source version, section/type mismatches, and incompatible options. Changed labels/order and unverifiable source titles require review and explicit acknowledgment. Applying the mapping stores a content snapshot and mapping audit entry. It does not mutate responses, create another attempt, import a key, or silently regrade.

After explicit grading/release, compatible automatically graded mapped items can provide verified question/skill evidence through the existing analytics engine. Manual points remain honest summary evidence. The mapped content snapshot and source key policy are preserved so later Content Studio edits cannot reinterpret earlier letters or text.

**Export exact responses (JSON)** produces `nathan-tutors-answer-sheet-v1`: stable student/assessment/assignment/attempt IDs, source version, section and displayed number, response type, original option IDs/labels, exact response strings/arrays, submissions, and grading history. JSON preserves multiline text and multi-select arrays unambiguously. Export does not mutate stored records. A CSV or bulk-key importer is not included; keys are entered in the structured key view.

After reopening, current draft responses have no current grade attached; earlier grades remain tied to immutable submissions in history. Linked analytics apply the original answer-sheet response type and explicit text-matching policy, including when the digitized question uses a different text interaction.

## Validation performed

`npm run test:answer-sheets` covers:

| Requested check | Coverage |
| --- | --- |
| A — create without content/key | Authenticated route creation, individual assignment, issue freeze, unkeyed submission and pending grading; browser creation/assignment/submission |
| B — all response types | Single/multiple/text changes, clears, flags, exact multiline text, refresh restoration; browser round trip |
| C — resume | Same attempt across reopen, independent editing session, scoped recovery; browser refresh and second-tab takeover |
| D — failure recovery | Storage failures, offline edits, lost acknowledgments, stale revisions, large Unicode queues, reconnect; browser simulated network interruption/recovery |
| E — submission race | Serialized final typing, immediate submission, pending offline submission, repeated submission ID; browser final characters verified in teacher review |
| F — multi-select | Partial selection persists, attention state, invalid submission blocked, exact-set grading; browser exactly-two configuration and attention/valid states |
| G — short answer | Zero, decimal, fraction text, symbols, line breaks, explicit exact/normalized policy, manual review, visible over-limit recovery |
| H — add key later | Key versions, grade existing immutable responses, private manual review, explicit release; browser key entry after submission and release |
| I — link later | Existing submitted attempt mapped by identities; source responses and attempt IDs unchanged; filtered linked metadata snapshot released for insights |
| J — isolation/regression | Foreign students/teachers, forged roles, protected namespaces, concurrent CAS, repeated assignments, reopening/history; browser competing tab and other-student denial |

Browser testing used Chrome with fictional teacher/student sessions, the real routes/UI, and an isolated database adapter. A downloaded browser JSON export was parsed and checked for multi-select arrays and the final multiline characters. Desktop and 480px layouts were inspected; the student page had no horizontal overflow and answer controls remained at least 42px tall.

The configured real Supabase project accepted the JSON revision filter in a read-only query for a deliberately nonexistent record. No real student records, keys, grants, or results were created during testing. Real-project write/resume tests, a physical second device, and a real sign-out/sign-in cycle were **not** exercised; independent fixture sessions and recovery tests cover the application contract, not those external environments.

Run `npm run preview:answer-sheets` for the isolated preview on port 4336. Its fictional database is process-local and intentionally discarded when the preview stops. Production uses durable Supabase storage; the preview is not a storage fallback.


### October 19 interface checks

The simplified editor was browser-tested with fictional users: create the default table, change a row to exactly-two selection and another to multiline text, save and assign, find it on student Home and the dedicated sidebar page, paste choices, edit multiline text, refresh, edit offline, reconnect, review, and submit before a key exists. Keyboard row movement worked; the 480px layout had no document horizontal overflow. Production student records were not changed. Column-paste tests also cover quoted multiline cells, raw zero/symbols/whitespace, partial selections, and rejecting extra columns or invalid labels.
