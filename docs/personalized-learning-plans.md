# Personalized learning plans

## Entry points

Teacher dashboard → SHSAT student progress → select a student. The existing record now includes Progress & insights, Learning plan, Available content, Weekly schedule, and Homework history. Analytics, exam evidence, paper scores, and saved sessions remain in the original Progress view.

Available content defaults to never-assigned passages **for the selected student**. Select up to 30 real content references, assign or reserve them, and optionally set dates, instructions, and an expected duration. Repeats require an explicit confirmation; they create new history records rather than replacing old work. Source/version labels distinguish similarly titled question sets. Content identity follows the existing IDs, not title matching.

“Find unassigned work for this skill” in question evidence opens the same student's inventory filtered by existing skill metadata. Math is currently available through exams or custom/offline homework; this feature does not invent a standalone Math practice module.

Student home, Assignments, and topic homework show actual published work. Static example assignments, progress percentages, and activity were removed. Teacher student previews are read-only and show published work only; generic previews ask the teacher to select a student.

## Persistence and deployment

The migration was installed in Nathan Tutors (`juxcuposhxsmokqrszbh`) on October 6, 2026, with explicit user approval. Both learning-plan tables passed a read-only availability check. For another project, apply `supabase/migrations/202610040001_personalized_learning_plans.sql` before using the feature; application builds do not automatically install it.

The audit found auth.users, class membership, exam/form access configuration, results, practice progress, and library attempts, but no persistent generic student homework table. The former homework page was static. Two necessary tables therefore reference the existing student IDs:

- `student_assignments`: normalized content references or flexible external/offline tasks, real assigned/completed timestamps, due/planned dates, duration, completion evidence, revision, and append-only lifecycle events.
- `student_learning_plans`: per-student explicit passage pace, generic target date, and timestamped teacher-only notes.

RLS is enabled and direct anon/authenticated table access is revoked. Authenticated API routes enforce teacher role and active SHSAT student selection, or use the authenticated student's own identity. The existing service-role database client performs writes. Students cannot switch identity through request bodies or see drafts, planning notes, or teacher event actors. Revision-checked updates prevent concurrent edits from silently overwriting history; deterministic batch IDs make submission retries idempotent.

Missing migration/storage gives a visible plan error; existing analytics and content saves/access still work. Cancelling/skipping retains records. No delete-task endpoint was introduced. Existing account deletion remains an explicit, separate account-management action.

## Completion and historical use

- Passage attempts use the existing library submission and grading workflow. Assigned passages grant access only to that student without changing book codes for others.
- Full exams use existing saved results. Partial English/Math results do not complete a full-exam task. Personal exam access does not open the global assessment or change other students' gates. Completed assigned content remains accessible in homework history.
- Practice targets count new saved answers beyond the baseline captured when work is published. No target means the teacher verifies completion. Existing difficulty/progress logic is unchanged.
- External and offline work supports URLs or no URL. Student reporting changes it to Awaiting review; the teacher verifies completion. There is no claimed Khan Academy integration.
- Evidence predating an assignment cannot automatically complete it. Reconciliation repairs deferred completion hooks from canonical saved results.
- Existing exam passage results and library attempts inform inventory and duplicate warnings. They are labeled existing results, not backfilled assignments, and do not acquire invented assigned dates. Missing timestamps are shown as unknown.

Inventory is derived, not stored a second time. Current active work takes precedence, then a reservation, completed work/existing attempts, previously issued work, and never assigned. Each content item contributes to exactly one current inventory status; repeated attempts remain in history.

## Dates, workload and supply

Due dates are calendar dates. Overdue means active and due before today in America/New_York. Weeks are Monday–Sunday. Undated tasks stay in the task list and are not silently scheduled on their assigned date. Planned work schedules on its planned date; issued work schedules on its due date. Dates can be changed with a retained event. Planned work must be published before it can be marked started/completed.

Duration totals include only teacher-entered estimates and display how many tasks have estimates. No estimated time is fabricated from question count or exam timers.

Fresh supply = never-assigned passages ÷ configured passages/week (rounded to one decimal). Target need = ceiling(weeks until target × pace); surplus/shortfall compares that with fresh supply. Reserved content is excluded from fresh supply. Neither an exam date nor a schedule is inferred.

## Efficiency and verification

Student English topic hubs list published question-bank practice sets under **Practice**, alongside the built-in practice module. Sets are matched using the topics of their included questions, with legacy labels such as **Supporting Evidence** mapped to **Evidence & Support**. A mixed-topic set appears in each represented topic; drafts, empty/incomplete sets, unrelated topics and Math sets are excluded. Cards keep the existing library practice viewer and assignment/code access rules, including teacher preview links. The overview and Practice navigation count activities. The localhost Evidence & Support page was verified with the existing **test** set (six questions); 17 question-bank/catalog/access tests passed.

Initial overview returns compact summary/inventory metadata, not full instructions or lifecycle events for every historical task. Compact metadata is read in bounded batches to avoid Supabase's default result cap; teacher roster reads are batched across students. Task/content histories paginate at 50. Full detail/events load on demand. Week queries filter on the server, show at most 500 tasks, and disclose truncation. Student/status/due, content, creation, and planned-date indexes support these paths.

Run `npm run test:learning-plan`, `npm run test:exam-review`, `npm run test:exam-presentation`, and `npm run verify`. Learning-plan tests use the real API routes and a local database adapter, not production records. They cover permission boundaries, no assignments, mixed/external/offline work, planned privacy, duplicates/repeats, lifecycle/history, CAS conflicts, invalid inputs, actual library completion, per-student exam gates, practice baselines, missing migration, and more than 1,000 completed tasks.

`node tools/preview-learning-plan.cjs` provides an isolated browser QA harness at `http://127.0.0.1:4324`; it uses actual authored catalog metadata but fictional, memory-only students/tasks. It is not included in production routing. Browser checks covered passage assignment with a date, overview, duplicate warning, completion/history, external homework, student review, future reservations, weekly workload, settings persistence and responsive layouts. The Nathan Tutors migration is installed; deployment configuration and full live assignment acceptance remain required.
