# Classroom tools

## Teacher controls

- **Assessments & insights → Reopen an exam for an individual student**: select an assessment and student, choose English/Math, optionally add time, then allow re-entry. The same tool appears in the student's progress record. See [exam-reentry.md](exam-reentry.md) for the saved-answer and permission rules.
- **Class timer**: appears across the main teacher dashboard workspaces. It supports 1–720 minutes, start/pause/reset, and an enlarged display. It defaults to three hours. The deadline is saved per teacher in browser storage; refresh, background tabs, and switching dashboard workspaces do not reset it. Browser tabs synchronize changes through storage events. The teacher display is separate from each student's exam timer and does not submit or pause student exams.
- **Game rooms**: host a live lobby and share its six-character code with students. Students open the new Game rooms navigation tab to join or reconnect. See [game-rooms.md](game-rooms.md).
- **Achievements**: edit the perfect-Math badge title, description, icon, accent color, picture, and card style. Preview earned/in-progress states before saving. The save applies to all students; simultaneous edits from another teacher return a conflict instead of overwriting the other teacher's changes.

## Perfect Math achievement

The trophy-room interface has a collectible shield badge, unlocked/in-progress filters, a collection summary, and 25/50/75/100% checkpoints based on the student's best submitted Math score. These checkpoints show progress toward the existing perfect-Math achievement; they do not invent additional awards. The teacher studio previews the same gallery with explicitly labeled sample progress and preserves custom pictures, accent colors, icons, and card styles.

The student Achievements tab shows a progress bar using the best submitted Math percentage from saved exam results and recorded retakes. The award requires every question correct in one submitted Math test or full Math section. A submitted Math section counts even if English remains pending. Practice fragments, unfinished sections, invalid scores, and digital answer-sheet records do not count. Teacher-entered paper Math scores do count. When the stored exam snapshot is available, the Math total must match its entire Math section.

The earned date uses the Math section's completion timestamp where available, falling back to the exam completion date for older records. No attempt count or timing data is invented. Only the authenticated student's results are returned. Changing the visual design does not alter the award rule. Pictures accept PNG/JPEG/WebP, resize to fit 640px, and are saved with the design; SVG and arbitrary external image URLs are not accepted.

## Installation and validation

Apply these migrations through the normal Supabase deployment process before releasing the new tabs:

1. `supabase/migrations/202610240001_live_game_rooms.sql`
2. `supabase/migrations/202610240003_achievements.sql`

Both migrations were applied to the configured Nathan Tutors Supabase project through its SQL Editor on October 24, 2026, followed by `notify pgrst, 'reload schema'`. Verification confirmed successful game-room and achievement API queries, RLS enabled, server access granted, and direct browser/anonymous reads denied. The local Game rooms and Achievements pages loaded successfully afterward.

The tables use RLS with browser access revoked. Authenticated Express endpoints use the server service role and enforce teacher/student permissions. Existing deployments without these migrations receive a setup error; the UI does not silently substitute unsaved in-memory production data. Re-entry uses the existing exam-results table and needs no new migration.

Run `npm run test:classroom`, `npm run test:question-bank`, `npm run typecheck`, `npm run lint`, and the production build. The preview commands `npm run preview:assessments` and `npm run preview:games` use fictional students and isolated in-memory APIs, without production credentials or records.

The SHSAT Lab import/compact builder workflow is documented in [CONTENT_STUDIO.md](../tools/CONTENT_STUDIO.md) and the [capture extension README](../extensions/shsatlab-ela-reader/README.md).
