# Reading and Revising/Editing libraries

Content Studio has separate **Reading** and **Part A** workspaces. Each has its
own passage list, search, filters, pagination, last selected passage, and in-memory
unsaved draft. Switching libraries retains edits until the page is refreshed or
closed; use Save passage to persist them.

Existing passage IDs, source files, exam assignments, wording, and keys are
preserved. Library membership follows the passage's `section`. Older passages
without a section use the existing sentence-prose/directions inference. Passage
options can change the section; saving then opens the matching library.

New Part A passages default to Part A, sentence-numbered formatting, and the first
Part A question topic. SAT Crash Course imports default to the active library.
Document drafts and Exam Builder shortcuts open the passage's matching library.

Reading, Part A, and Part B question-topic lists are stored independently in
`tools/content-topic-sections.json`. Manage topics in the question options for
the current workspace. Additions, order changes, and renames affect only that
library. Renames update the matching question IDs and assessment metadata;
question text and answer keys remain intact. Used topics cannot be removed.
Revision checks reject stale managers or concurrent source edits.

The legacy `content-topics.json` seeds these lists for checkouts that do not yet
have the new configuration. Part A initially copies the previous editing topics,
so existing classifications remain valid. The extraction prompt generator and
document importer use the section lists. SAT reading shares Reading topics.
