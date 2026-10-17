# English library access

Open **Teacher dashboard → English library → a book → Grant access** beside the student. The searchable roster supports enabled/not-enabled filters and revocation. Each combined book includes every version and every unique question. Older version links resolve to the same teacher dashboard; attempt history retains its original version, question set, score, timing, and corrections.

Students open enabled books directly. A locked book offers **Check access** after their teacher enables it. Existing valid assignment access, earlier unlocks, and completed attempts remain available until explicitly revoked. Revocation overrides those older access sources for the entire combined book, including original-version URLs, and is checked again on submission. Historical results remain readable.

The API stores a teacher-controlled access decision in `student_practice_progress` under the reserved `english-library:access:<canonical-book-id>` topic, separate from attempts and correction data. Existing database RLS permits students to select their own progress, with writes performed by the server. Generic practice-progress updates reject the entire `english-library:` namespace. No new database migration is required.

`PUT /api/library/teacher/books/:bookId/students/:studentId/access` accepts `{ "granted": true }` or `false`. It requires a trusted teacher/admin role and an active enrolled SHSAT student. Code creation and code-based unlocking return HTTP 410; codes in attempt payloads are ignored. The legacy book table is maintained solely for attempt foreign-key compatibility; its opaque placeholder value cannot authorize access.

Run `node --test server/tests/library-books.test.cjs server/tests/question-bank-routes.test.cjs server/tests/learning-plan.test.cjs tools/study-hall-view.test.cjs` for the main regression suite. Run `node tools/preview-teacher-library.cjs` for a fictional teacher/student preview on port 4334; it never contacts Supabase or changes real student access.
