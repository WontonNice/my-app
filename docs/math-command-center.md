# Math Command Center

Math Command Center organizes the existing math library, connects saved student evidence to practice selection, and creates assignments in the existing learning plan. Classification, search, duplicate checks, statistics, and selection rules use ordinary application code. There is no AI service, model request, token budget, or AI API key to configure.

For storage, concurrency, readiness, standards, and duplicate-method details, see [Math Command Center data and validation](math-command-center-data.md).

## Open it

From the repository root, start the existing local Content Editor:

```sh
npm run content-editor
```

Open the address printed by the command, normally `http://127.0.0.1:4319`, and choose **Math Command Center**. This local workspace manages the same existing math sources and metadata as the teacher application. The existing **Exam Math** preview remains the question editing surface; its **Math inspector** provides contextual classification and review controls.

For student evidence and assignments, start the existing application:

```sh
npm run dev
```

Sign in with the existing teacher account, then open **Math Command Center** from the teacher dashboard, or visit `/teacher/math-command`. The link from an individual student's **Student Insights** opens the workspace with that student selected. The ordinary application still uses its existing authentication and saved student data; zero AI dependency does not mean that student records are stored in the local editor.

## Organize questions efficiently

The local editor's **Open teacher Math Command Center** button resolves a running Nathan Tutors Vite app (including fallback ports) and opens it in the same tab. If none is running, it starts the existing `npm run dev` command and waits for the app. Startup errors remain visible; logs are in `tools/.content-drafts/teacher-workspace.log`. To use a hosted teacher app instead, set `CONTENT_STUDIO_TEACHER_URL=https://your-existing-app.example` in the root `.env`. Teacher sign-in retains the Math Center destination. This does not bypass authentication or install the hosted metadata migration.

**Open in exam player** on a bank row or inspector opens the existing math question renderer at that question. **View bank in exam player** follows every matching question in the current filter/sort order, across table pages. Use Previous/Next, Alt + arrow keys, numbered groups of 20, or Go to question. Answers and optional key reveal are preview-only. Closing the viewer restores the bank's filters and position. The viewer loads one full question at a time.

## Infinite practice modules

Student practice uses the shared exam player, including its navigation, notepad, pencil, answer eliminator, and question rendering. The Next arrow checks an answer once and reveals feedback; selecting it again advances. The toolbar shows the current consecutive-correct streak and session accuracy (correct / checked); unanswered questions do not affect accuracy. These counters survive refresh. Template details, seeds, and session-reset controls are not shown inside the player. **User menu → End practice** opens the session summary.

Open **Infinite practice** in Math Center, **Practice unlimited variants** on `2022-2023-form-a-q71`, or the student's Math Study Hall module link. The student route is `/math-practice/infinite`; `/math-practice/inequalities` remains an alias.

The picker includes **Foundation Building**, **All Question Types**, and a **Targeted practice** section. Currently available generators are easy positive-division inequalities (coefficients 2–5, endpoints 1–8, products at most 40) and the original one-step inequalities including sign flips. All Question Types means all registered generators, not every question format in the exam catalog. No AI is used.

The summary shows accuracy, longest consecutive-correct streak, average answering time for checked questions, and total visible practice time. Feedback time and unfinished-question time count toward the total only. Hidden-tab time, time away after closing the page, module selection, and the summary itself do not count. Ending without checked answers shows an em dash for accuracy and average time. The active session and final summary use tab session storage; these are not saved as graded exam results. V2 modular sessions start separately from older sessions, which did not track timing or longest streak.

To expand, add a stable, versioned generator to `server/src/shared/infinitePractice.ts` that returns an `ExamQuestion` with a valid answer key and explanation. All Question Types picks it up automatically. Set `foundation: true` only for introductory questions. Add a targeted module to `practiceModules` with a stable ID, title, description, and `selection` containing generator IDs. No player component changes are needed: answers and grading use the shared exam contracts. A running session snapshots its generator IDs so newly added types do not change its current question; new sessions use the expanded list. Preserve generator IDs/versions for resumable sessions, and add arithmetic/answer-key tests for each new generator.

The versioned `one-step-inequalities-v1` template follows the original `−12 > 6x` question: choose a coefficient `a` from ±2…±12 and a nonzero integer boundary `k` from −12…12, set `b = a × k`, and present `b < ax` or `b > ax`. Every division is exact; products have magnitude at most 144. Four distinct choices include the correct boundary/direction and sign/coefficient distractors. Explanations are written by arithmetic rules; no inference or network service generates them.

A seed determines a permutation of all **1,056 distinct inequalities**. Practice continues after that pool cycles; it is not an infinite supply of unique small-number stems. Each check counts once, then reveals the explanation. The current seed, question, answer and session score resume in the same browser tab when session storage is available. These are self-practice results, not saved graded exam results or canonical question-bank additions. The original question and answer key remain unchanged.

The exhaustive generator test independently compares every answer's truth set against its inequality, including negative division, strict endpoints, uniqueness and all answer positions. Run `node --test tools/inequality-practice.test.cjs`.

## Bulk classification

1. Open **Question bank** and combine category, subcategory, difficulty, readiness, and the additional filters. Multiple selected values within one filter are alternatives; different filters apply together.
2. Select the relevant rows. Selection can span pages; check the selected-record count before acting.
3. Choose the classification action and enable only the properties you intend to change. Choose a diagnostic skill compatible with the primary category and subcategory, or explicitly clear a previous skill when moving a question.
4. Review the table of question IDs, properties, previous values, and new values. Apply the preview to save metadata.
5. Use **Undo bulk changes** when appropriate. If another edit changed those questions after your action, undo refuses to overwrite that newer work.

Bulk changes preserve question wording, answer keys, source references, and saved student results. They do not rewrite explanations or solve questions. Continue editing question content through the existing exam preview.

Use **Saved view** for a reusable combination of filters and sorting. Use a **Collection** to save selected question references. Collections do not copy questions. CSV exports use the current filtered inventory. Settings contains saved-view and collection management, inventory targets, the teacher's practice pace, and diagnostic-skill prerequisite definitions.

## Read coverage and review counts

**Overview** summarizes the actual library. **Curriculum coverage** expands a main category into its subcategories; click a count or subcategory to open its questions. Sort by inventory, readiness, review issues, or difficulty shortages. Gap buttons show the ready questions available against the configured target.

Targets are teacher planning preferences. A default of ten questions per subcategory and difficulty is configurable and is not a claim about an official SHSAT distribution. Missing difficulty remains unclassified. A question is not automatically assigned a topic, diagnostic skill, difficulty, or verified standard.

**Review queue** groups missing or invalid metadata, incomplete content, import drafts, and duplicate warnings. The same question may appear in more than one group. Fixing a single issue does not necessarily make it ready: a question with a newly assigned difficulty may still lack an explanation or have an unresolved import status. Completing a duplicate review does not publish a red imported draft; finish that question in the existing editor.

Use the duplicate comparison to inspect both questions and their test references. **Exact** means matching normalized content and interaction structure; check the keys as well. **Possible** is a review suggestion. **Template** means similar wording with changed numbers and represents a practice variant. Nothing is automatically deleted or merged.

Standards mappings are entered and verified by the teacher. Provide a source reference when marking a mapping verified. The NYSED domain reference catalog is a navigation aid; it does not certify question alignment.

## Inspect student evidence

Choose a student and open **Student math insights**. The skill matrix shows all scored responses, recent performance, distinct question counts, assessment evidence, and progression. Click a skill to inspect the underlying questions, saved student answers, keys, dates, sources, and correctness. Filter evidence to correct, incorrect, unanswered, recent, or previously attempted responses; export the current evidence when needed.

Unanswered scored questions count in accuracy. Pending grading is excluded from the scored denominator. All-attempt accuracy and first-attempt-per-question accuracy are separate. Missing evidence appears as unavailable rather than an invented score. Historical snapshots retain their original question content and keys; legacy results without snapshots require an explicitly identified current-content fallback.

Weakness flags explain the configured threshold and evidence requirements. A prerequisite link invites the teacher to inspect that skill's evidence; it does not diagnose a missing prerequisite. Practice supply estimates divide available unseen questions by the teacher's weekly pace and describe inventory, not predicted student mastery.

Remaining inventory can be examined by category/subcategory, difficulty, and primary source. Availability uses a defined order so a question occupies one inventory state: assigned but incomplete, planned, previously seen, completed without question-level evidence, unused and ready, or unready. The independent history filters still retain every applicable fact, such as previously incorrect and currently assigned.

The first question-performance request after a server restart can take longer while the process reads historical results and builds its cache. A local catalog timing test is not a measurement of a full production-history refresh. Storage errors are reported as unavailable evidence and should not be interpreted as zero attempts.

## Build and complete practice

From a student skill, choose **Assign practice**, or browse the bank with a student selected. Keep the relevant filters and select questions manually or request a count. A difficulty quota such as **2 Easy / 4 Medium / 3 Hard / 1 Expert** uses the stored teacher classifications. Previously seen or assigned questions are excluded by default; intentional review is an explicit choice.

Review the proposed questions before confirming. Preview individual questions, remove or replace items, and reorder the list. After changing the list, review the updated selection. If eligible inventory is insufficient, the preview reports the shortage instead of adding unrelated content or invented questions.

Confirming creates a practice item in that student's existing learning plan. Students open it there, answer through the existing math-question renderer, save or resume responses, and submit for the existing deterministic grading. Completed results feed back into teacher evidence and the student's question history. No separate student profile, question database, or assignment system is introduced.

## Validation record

Inventory and student figures below refer to the clearly labeled synthetic QA fixture, not the user's library or real student results. The native Content Studio check used the existing Question 5 and reverted its temporary metadata change. Browser verification, automated checks, and the read-only deployment check are identified separately. No production data was written.

| Workflow | Automated coverage | Observed verification |
|---|---|---|
| Combined category, subcategory, diagnostic-skill, difficulty, source, year/form, and readiness filters | Catalog filter tests, sorting, pagination, and a 5,000-question fixture | Verified: Medium + Hard Linear Equations returned 42 matching fixture questions |
| Bulk classification without content changes | Thirty-record preview/apply/undo; canonical source bytes, prompts, choices, keys, and source IDs preserved | Verified: previewed and applied 30 records, then undid; Medium/Hard coverage changed 26/18 → 38/6 → 26/18 |
| Metadata concurrency and validation | Preview actor/workspace/expiry/revision/content guards; exclusive lock; stale undo protection; native-save revision guards | Stale-window and failed-write cases are covered by automated tests; no browser fault-injection result is claimed |
| Readiness, coverage, and duplicate review | Missing metadata/keys/explanations/required diagrams; imported drafts; exact, possible, and template groups; configurable targets | Browser verified: exact-duplicate fixture questions 63 and 64 displayed side by side with their actual rendered questions and source references; failure cases are covered by automated tests |
| Student evidence and progression | Historical snapshots, released answer sheets, pending grades, repeat attempts, sample thresholds, and permission checks | Verified: selected fixture student showed 12 response records, 5 correct, 6 distinct questions, 2 assessments, and progression from about 17% to 67% |
| Personalized assignment selection | Deterministic quotas, seen/assigned exclusions, explicit selection, shortfalls, content guards, and existing-assignment integration | Browser verified: ten unseen questions with 2/4/3/1 difficulty quotas were previewed, reordered, replaced, and assigned through the existing learning plan. The replacement picker retained unseen matching Easy questions. In a separate preview, removing one item and choosing **Review updated selection** produced 9 requested / 9 selected / 0 shortfall with confirmation enabled; no extra assignment was confirmed |
| Student practice save, resume, submit, and feedback | Ownership, hidden answer keys, response revision checks, grading, result/history preservation, and idempotent assignment creation | Verified: nine answers autosaved and survived reload; one unanswered warning appeared; submission scored 8/10 (80%); teacher evidence preserved the original 12 records and grew to 22 records, 13 correct, 16 distinct questions, and 3 assessments |
| Remaining inventory after assignment | Student-specific history, exclusion rules, and inventory aggregation | Browser verified after completion: 44 available unseen questions, comprising 8 Easy, 16 Medium, 15 Hard, and 5 Expert; a pace of 25 questions/week persisted after reload and displayed 2 weeks of supply |
| Settings, collections, and exports | Reference-only collections, saved-filter validation, targets, skill prerequisites, CSV escaping, and persisted preferences | Browser verified: saved view persisted and reloaded its 42 matches; collection “QA Algebra trio” contained q003–q005 and filtered to 3 questions; CSV export was clicked without error. CSV contents were verified by automated tests, not by inspecting a downloaded browser file |
| Existing Content Editor behavior | Math preview/answer controls; direct imports/retries; red-draft completion; source editing; category changes and stale-save guards | Browser verified: existing Question 5 retained its Calculator Input (Advanced) renderer; the inspector previewed and applied Medium difficulty, and native **Save math section** succeeded. The temporary QA metadata change was reverted |
| Hosted metadata readiness | Durable restart/redeploy preservation, compare-and-swap conflicts, seed-only initialization, API persistence, and missing-storage failures | Read-only `npm run seed:math-command` using the configured credentials confirmed that the metadata table is not installed. The migration remains unapplied; the check made no production writes |
| No model or AI runtime dependency | Management operations exercised with network access disabled; runtime modules checked for model clients and inference endpoints | No AI credentials requested by the verified workflows |

Client and server production builds and TypeScript checks passed. Focused feature lint passed. The final focused Math Command Center run passed all 47 tests, and all 76 existing editor, workspace, import, and taxonomy regression tests passed. Repository-wide lint remains blocked by pre-existing game/world issues: nine errors and two warnings; the full repository release gate is therefore not reported as passing.

Run the focused suite with:

```sh
npm run test:math-command
```

Relevant existing-editor regressions can be run with:

```sh
node --test tools/content-studio-math.test.mjs tools/content-studio-workspace.test.mjs tools/math-import-batch.test.mjs tools/math-topic-editor.test.mjs
npm run typecheck
```

For isolated visual verification, `npm run preview:math-command` starts the synthetic fixture. Its content, students, and in-memory assignment storage are test data and must not be treated as production results.

## Deployment and durable metadata

The repository's Render configuration uses an ephemeral application filesystem. Hosted metadata must therefore use Supabase; production enforces this automatically. Before deploying the hosted workspace, apply `supabase/migrations/202610260001_math_command_metadata.sql` using the existing Supabase migration process. The table stores management metadata and question references only. Row-level security denies direct anonymous/authenticated browser access; the existing server service-role connection and teacher/admin API checks govern access.

The migration is prepared in this change; it has not been applied to the production database by the development or fixture tests. Until it is installed, the hosted Math Command Center returns an explicit setup error and does not save to ephemeral local files.

To preview the first publication of local classification metadata using the existing configured Supabase credentials:

```sh
npm run seed:math-command
```

This reads the local sidecar and the remote state, reports whether an initial row is needed, and writes nothing. After verifying the intended project and metadata, publish the initial state with:

```sh
npm run seed:math-command -- --apply
```

The helper inserts only when the remote record is absent. It never updates or overwrites an existing hosted record. If no explicit seed is made, the first hosted metadata mutation uses the deployed sidecar as its initial baseline, or defaults when that file is absent. Back up the durable metadata alongside the existing Supabase data.

Local Content Studio continues to edit local files. By default, `npm run dev` shares those local files. Set `MATH_COMMAND_STORAGE=supabase` on the development server only when you intentionally want that server to use the configured remote metadata. Content Studio remains local even then. There is no automatic local-to-hosted or hosted-to-local metadata synchronization after initial publication; subsequent hosted classification changes should be made through the hosted teacher workspace. Publishing native question changes still follows the existing content export and deployment process.

Deploy the full repository/build layout, including `tools/math-topics.json`, `server/data/exam-content.json`, `server/data/question-bank.json`, the exported `server/data/math-import-review.json`, and the compiled client/server output. The configured Render build already retains this layout. Copying only `server/dist` omits required canonical content and taxonomy. No additional question database or student assignment table is required by this migration.
