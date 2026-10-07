# Student corrections

Results links open `/study-hall/shsat/corrections/:assessmentId`. The old `/results/:assessmentId/corrections` URL remains supported. Navigation encodes assessment IDs, preserves the selected student/preview parameters, and resolves correction routes before the general student dashboard. Back to Results preserves the same preview context.

Student-view previews load the selected student's results through authenticated, trusted teacher/admin endpoints. They show a read-only correction workspace; teachers cannot submit student responses. Preview requests validate the target student's role, active status and enrollment. Exam correction locks and library first-attempt/perfect-score gates still apply.

Library/passages use dedicated `/study-hall/shsat/library/:bookId/corrections` and `/advanced-practice/:bookId/corrections` pages instead of swapping the reader screen in place. Their workspace presents one question at a time, previous/next and question selection, local drafts scoped to the signed-in user/book/first attempt, and submission of all missed-question corrections. Back returns to the passage. Already submitted library corrections stay immutable.

Each new correction requires a student-selected **Question type**, interpreted as the skill/topic being tested (such as Evidence & Support, Inference or Algebra). Options use the English taxonomy or the exam's Math topics. This is the student's classification, not a change to the authored topic, response format or grading key. The selected value is stored with explanations and shown in teacher review. Existing submissions without this field remain readable; no database migration is needed because correction responses already use JSON storage.

Run `npm run test:corrections` and `npm run verify`. The 17 focused checks cover preview routing, encoded IDs, exact student selection, locks, read-only permissions, classification validation/persistence, grading, and offline rendered forms. Live browser verification was unavailable because the browser tool failed to initialize its kernel assets; localhost client/API health checks succeeded.
