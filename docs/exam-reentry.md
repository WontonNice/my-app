# Individual exam re-entry

Teachers can reopen English, Math, or both for one enrolled student from the assessment library or the student's progress details. Students see “Reopened for you” on their assessment card. A permission works even when that exam is locked for the rest of the class.

Re-entry resumes saved answers and the original attempt. It does not create a retake or add another completed exam to averages. Each reopened section becomes locked again when the student resubmits it. The teacher can revoke or replace permission while a student's tab is open; subsequent saves and submissions check the current permission on the server. Other sections' submitted answers are protected, and grading uses the saved exam content.

The timer retains the remaining shared three-hour allowance. Teachers may explicitly add 0–180 minutes. Older results with no usable recorded timer or time-spent total receive no inferred remaining time; the teacher can add an allowance. The existing exam timer supports overtime and is not a server-enforced deadline.

Grant/revoke routes are under `/api/assessments/teacher/:assessmentId/reentry/:studentId` (GET, PUT, DELETE). PUT accepts `sections` and `additionalMinutes`. Only teachers can grant access, and the student must be enrolled in the exam's class and already have submitted digital answers. The student sends `reentryGrantId` when saving drafts or results. Results with a stale, revoked, mismatched, or consumed grant cannot change answers. Retried identical submissions are idempotent.

No schema migration is needed. Permissions are stored in service-written `student_exam_results` rows prefixed `__exam_reentry__:`; snapshots of original submissions are preserved with `__exam_revision__:` before permission is issued. Existing progress/analytics exclude these reserved rows from normal results and exam history. Grant/revoke and result/session writes for a student's exam are serialized within the server process. Deployments with multiple API writer processes would need database-level serialization for the same guarantee across processes.

Regression coverage: `node --test server/tests/exam-reentry.test.cjs server/tests/exam-section-progress.test.cjs`.
