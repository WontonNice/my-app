# Continuing a saved exam

Continue now restores the last screen and question separately for English and Math, including passage, standalone and math questions. Choosing a subject intentionally restores that subject's position. Without a subject choice, the last active available subject is selected. Completed/locked sections still obey the existing access rules.

Positions use question and passage IDs instead of numeric offsets, so reordered content restores the same question. If a saved question is removed, or an older draft has no position, the student starts at the first unanswered question in that section. New attempts retain their introductions. Answers, completed sections and exam timer rules are preserved.

The browser saves position immediately alongside answers. Cloud autosave includes position after two seconds of navigation inactivity and retries every fifteen seconds; returning on another device uses the latest successful cloud save. Submission saves include the latest position. Teacher previews and game sessions do not save student positions.

## User-controlled rollout

Apply `supabase/migrations/202610280004_exam_navigation.sql` before deploying the updated server/client. It adds a nullable JSONB column to the existing session table and changes no existing answers or permissions. Existing sessions work without a saved position. Also follow `persistent-exam-access.md` for the earlier exam availability change. No migrations, production data changes, push or deployment were performed for this fix.

Verify locally with:

```
node --test tools/exam-resume.test.cjs tools/exam-session-view.test.cjs server/tests/exam-reentry.test.cjs server/tests/exam-section-progress.test.cjs server/tests/persistent-exam-access.test.cjs
```

The resume tests cover passage/question reordering, separate subject positions, standalone questions, missing questions, legacy drafts, empty-answer navigation, user/exam isolation, API round trips, invalid positions, newer fallback saves and old-client saves. Database tests use an isolated mock; the migration has not been executed against Postgres. The isolated browser fixture is `node tools/preview-exam-session.cjs`; append `/launch` to an exam URL to exercise the production Continue page. Browser verification confirmed Math question 3 survives reload and Continue English restores question 2 directly. Both TypeScript checks and lint on changed client files passed.
