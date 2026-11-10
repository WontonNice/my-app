# Student corrections

Results links open `/study-hall/shsat/corrections/:assessmentId`. The old `/results/:assessmentId/corrections` URL remains supported. Navigation encodes assessment IDs, preserves the selected student/preview parameters, and resolves correction routes before the general student dashboard. Back to Results preserves the same preview context.

Student-view previews load the selected student's results through authenticated, trusted teacher/admin endpoints. They show a read-only correction workspace; teachers cannot submit student responses. Preview requests validate the target student's role, active status and enrollment. Exam correction locks and library first-attempt/perfect-score gates still apply.

Library/passages use dedicated `/study-hall/shsat/library/:bookId/corrections` and `/advanced-practice/:bookId/corrections` pages instead of swapping the reader screen in place. Their workspace presents one question at a time, previous/next and question selection, local drafts scoped to the signed-in user/book/first attempt, and submission of all missed-question corrections. Back returns to the passage. Already submitted library corrections stay immutable.

Each new correction requires a student-selected **Question type**, interpreted as the skill/topic being tested (such as Evidence & Support, Inference or Algebra). Options use the English taxonomy or the exam's Math topics. This is the student's classification, not a change to the authored topic, response format or grading key. The selected value is stored with explanations and shown in teacher review. Existing submissions without this field remain readable; no database migration is needed because correction responses already use JSON storage.

Submitted Study Hall worksheets open results and corrections immediately, including one-subject worksheets and skipped questions. Students see their submitted answer, the correct answer, and any authored explanation without opening Exhibits. The first missed question is selected initially. Correction work leaves the original worksheet score intact. Unsubmitted attempts stay locked, access is scoped to the student's own submission, and the existing exam release rules remain in place.

Run `npm run test:corrections`, `npm run test:learning-management`, and `npm run verify`. These cover preview routing, ownership, worksheet release with skipped answers, exam locks, classification validation/persistence, grading, and rendered forms. `npm run preview:learning-management` provides isolated worksheet results with fictional accounts for browser checks.
