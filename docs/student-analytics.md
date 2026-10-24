# Student analytics workstation

Student Progress is an evidence workspace for the teacher. It provides scores, original responses, comparisons and exports; the teacher decides what to teach.

## Roster and student record

- The searchable, sortable roster shows independent latest English and Math scores with correct/tested counts and section dates, full-exam averages, assessment counts, response coverage, assessment activity, account login and assigned/overdue work counts.
- Full-exam averages are arithmetic means of submitted English + Math exam percentages. Practice, library passages and pending sections do not enter this mean. A missing subject is unknown, never zero. A section-only Math score is available immediately.
- Student filters cover activity, evidence source, subject, date window and all/first/latest/repeated dated response attempts. Filters and named views are saved locally per student. Date windows use America/New_York; literal test dates are preserved. Undated history stays visible all-time and is excluded from bounded windows and dated attempt ordering.
- Detailed analysis groups verified evidence by skill, Math subtopic, passage/version, response format or source, keeping activity types separate. Each group includes correct, incorrect, unanswered, tested accuracy, attempted accuracy, distinct question versions, contributing records, first/last dates, sample context and recorded timing coverage.
- Assessment-by-skill matrix cells and count links open their exact response rows. Two date windows show raw counts, percentage-point differences, shared question versions and overlapping-window context. These are descriptive comparisons, not difficulty-adjusted or calibrated mastery estimates.
- Timing includes positive stored values only, with coverage, mean, median, bins and position within the submitted section. Elapsed timing is not an estimate of active work or a diagnosis of error causes.
- The question inspector preserves table position and shows full available question/passage content, exact submitted response, recorded result/key, content provenance, authored explanations and matching student corrections, ratings and drawings.
- Roster, breakdown and filtered response CSV exports quote values and neutralize spreadsheet formula prefixes. Print uses the current student workspace. Long response/group tables and the matrix paginate and scroll inside their containers.
- Existing paper-score entry, saved sessions, practice summaries, passage inventory and assignment workspaces remain accessible. Score entry/source tools sit below the analytics in a collapsed section.

## Evidence and historical limits

| Evidence | Availability and treatment |
| --- | --- |
| New exam results | Store an immutable question-content snapshot, original answers, subject scope, section completion dates, attempt ID and available timing. Later content edits do not reinterpret these responses. |
| Answer sheets | Use their stored analysis snapshot when available. |
| Older exam results | Use matching current content with an explicit provenance warning. Changed membership cannot manufacture historical blank answers. Scope-unknown summaries remain in history without inventing a subject. |
| Paper totals | Remain summary-only; question outcomes, blanks and timing are not invented. Available stored topic totals remain identifiable as summary evidence. |
| Library/question-bank attempts | One teacher-only, student-scoped paginated endpoint loads native and compatibility history and deduplicates real attempt IDs. Original stored grades and answer keys take precedence over current grading. Missing question metadata stays unclassified. |
| Corrections | Attach to the matching attempt/version; they do not overwrite the original grade. |
| Retakes | New stable attempt IDs archive the previous result before replacement. Submitting the second subject updates the same attempt. Earlier results overwritten before this feature cannot be recovered. |
| Missing raw practice answers | Existing totals remain in Practice progress, without fictional question evidence. |

Question identity for first/latest/repeated exposure includes ID, prompt, choices and answer key. Stable attempt/submission IDs deduplicate mirrors; matching timestamps alone do not establish a duplicate. Different exams, sample sizes and content versions can differ in difficulty. No scaled-score conversion, admissions probability, invented difficulty or automatic lesson plan is generated.

## Split exam across class meetings

1. The student chooses **Submit Math** or **Submit English** in the exam toolbar. Confirmation lists answered and unanswered questions. Only blanks in the section explicitly being submitted count as incorrect.
2. The result is saved before success is shown. The teacher immediately sees the submitted section score. The other subject's drafts remain pending and excluded from grades.
3. The student can **Save & exit** or continue the other section when access permits. The shared three-hour budget pauses between meetings; changing subjects does not grant another three hours.
4. Reopening resumes the unfinished subject with the remaining budget. Submitted answers remain protected, including when an older session writes stale data. The final section confirmation says it finishes the exam; both submitted subjects then constitute one full exam.

A save failure leaves a retryable error rather than claiming success. A session-sync failure after the result is saved cannot erase the submitted section; the durable result contains its answers and paused timer for recovery.

## Verification

- `npm run test:student-analytics`
- `npm run test:corrections`, `npm run test:exam-presentation`, `npm run test:answer-sheets`, `npm run test:learning-plan`
- `npm run typecheck`, `npm run lint:client`, `npm run build`
- `node tools/preview-student-analytics.cjs` serves isolated fictional records at `http://127.0.0.1:4323`; `/legacy` provides the earlier dashboard comparison and `/roster` the roster fixture.
- `node tools/preview-exam-sections.cjs` serves the real player with a tiny fictional Math/English exam and an in-memory API at `http://127.0.0.1:4339/exam/qa-section-exam/session?as=student`. `/qa/status` exposes only that fixture's stored result/session for verification.

Browser QA uses fictional identities and local storage, without writing real student results. Deployment and production mutations are outside this verification.
