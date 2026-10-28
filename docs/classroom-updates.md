# Classroom updates — October 27, 2026

Status: deployed to production on October 28, 2026. Render release `20f09ebf` succeeded at approximately 6:55 AM EDT. Both migration scripts completed and the new schema passed service-role read-only checks.

## Release order

1. Apply `supabase/migrations/202610280001_infinite_homework.sql` and `supabase/migrations/202610280002_classroom_meals.sql` to the intended Supabase environment before deploying this code. They add a nullable streak target and three private feature tables. The meal submission function serializes updates against menu closure and price changes. They do not delete existing student results.
2. Run `npm run build`. The build includes client and server type checking and regenerates server exam content from repository sources.
3. Deploy the client and API together through the existing Render release process. Verify the deployed commit and hashed client chunks; the live exam chunks observed during diagnosis were older than the checkout's reentry implementation.
4. Test with designated teacher/student accounts: reopen Test 3, choose English explicitly, see the current published English wording, submit, and reopen while teacher access remains open. Close Math and confirm access stays closed. Confirm a submitted closed section retains its saved grading content.
5. Assign a published infinite module in a student's learning plan with a streak target. Confirm a wrong answer resets the streak, refreshing resumes it, and reaching the target automatically completes the assignment.
6. Open Classroom meals in teacher navigation. Create a session, enter restaurant/menu prices, tax percentage and per-student fees, then open ordering. Students use Wonton → Uber Eats from their overview. Close ordering before transferring requests into the teacher's Uber Eats checkout; marking ordered records the teacher's action only.

Rollback: redeploy the previous application commit; retain the additive database schema and saved records. Do not drop feature tables to roll back code.

## Behavior and limits

- Explicit subject choice travels in the exam URL. Optional device storage failures cannot interrupt the updated exam launch/save paths.
- Open exam sections use current published questions; completion checks question IDs and supports single-subject tests. Submitted closed sections remain protected.
- Login offers remembered Water ripples and Meadow & deer scenes plus a motion toggle. System reduced-motion preferences are honored initially.
- Results display submission times in New York time with inclusive date, test-name and score filters. The page filters the saved result records already exposed by the progress API; this release does not create an archive browser for previous retakes.
- Infinite homework is student-specific, server-graded, revision-checked and persistent. A started session snapshots generator definitions so a later catalog edit cannot change an unanswered question's grading. Targets are 1–100 consecutive correct answers.
- Meal totals are teacher estimates. Item prices and totals are recomputed by the server; students cannot choose another student's identity or write a fabricated quote. Notes and snapshots are visible to teachers/admins. Existing estimates remain attached to saved requests when menu prices change.
- This release does not call Uber's menu/cart APIs, place orders, store payment details, or claim real-time Uber checkout totals.

## Uber access

With the user's explicit approval, Uber API Terms were accepted and **Nathan Tutors Classroom Meals** was created under Nathan Tutors using the available 3PL Consumer APIs suite. The dashboard reported sandbox access granted. Application ID: `VITh7ZfuBGbmX-9v_MZPkfnaowYBEuIh`.

The scopes shown were `partner-loyalty.link-account`, `partner-loyalty.flight-bookings`, and `partner-loyalty.unlink-account`. These do not supply restaurant menus or carts. [Uber's Consumer Delivery documentation](https://developer.uber.com/docs/consumer-delivery/introduction) describes separate, case-by-case early access. Its linked [intake form](https://uber.surveymonkey.com/r/consumerdeliveryintake) was closed when checked. No production API access was granted, and no secret was added to this repository.

Suggested request for the user's Uber contact (not sent): “Nathan Tutors requests Consumer Delivery early access for application VITh7ZfuBGbmX-9v_MZPkfnaowYBEuIh. Our tutoring classroom lets students select menu items while the teacher reviews and places a combined order. We need merchant discovery, menus/customizations, and cart quotes including tax and fees. The dashboard currently exposes loyalty scopes only and the public intake form is closed. Please advise eligibility, required review, sandbox scopes and integration documentation. Students will not provide payment credentials.”

## Verification

- 40 targeted tests passed: exam reentry and section submission, learning-plan lifecycle, result dates/order, equal-count question replacement, blocked browser storage, homework authorization/streak/reset/retry/concurrency, and server-priced meal requests.
- ESLint passed for all changed TypeScript/TSX files. Full-repository lint has existing failures in unrelated game and Practice Studio files.
- Browser checks used fictional local fixtures, never student production data. Screenshots are in `.impeccable/review/`. The local harness is `node tools/preview-classroom-updates.cjs --port=4336`.
- Both migrations were executed successfully against Nathan Tutors production on October 28, 2026. All three new tables have RLS enabled and deny direct reads to anon/authenticated roles; the meal-save function permits service_role execution only.
- Render confirmed release `20f09ebf` live. Production health returned 200; unauthenticated feature routes returned 401; new client chunks and Wonton asset returned 200. The authenticated teacher meals page loaded its empty state, and the live login displayed both scenery options. No student production records were changed for acceptance testing.
- Render remains on its existing free instance, which can delay the first request by 50 seconds or more after inactivity.

Wonton provenance: `client/public/images/wontonrobot.png` is an unchanged copy of the user's supplied image. No generated replacement was used.
