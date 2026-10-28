# Ordering another meal

After the teacher marks a request ordered, the student can choose **Start another request** while ordering is open. This opens an empty selection, with a separate **Send another request** action. Discarding that draft leaves the ordered request intact. Previously ordered items are never copied into the next selection automatically.

Submitting the next request atomically snapshots the earlier order into `classroom_meal_order_history` and creates a new pending request in the student's current slot. Students and teachers can expand earlier requests to see items, customizations, notes, estimate and the saved update time. Teacher combined estimates include both current requests and earlier ordered meals. Cancelling, removing or denying the current request does not erase earlier orders. Replacing an ordered request that a teacher removed also archives its snapshot.

Existing rules still apply: ordering must be open; a denied request needs teacher restoration; ordered items cannot be edited or cancelled by a student. A separate pending request can be updated or cancelled. Menu and request revision checks, session/row locks and the history primary key prevent stale writes, duplicate requests and double archiving. The API computes prices and takes student identity from authentication.

## User-controlled rollout

Apply `supabase/migrations/202610280005_repeat_meal_requests.sql` before deploying the updated server and client. It creates a service-role-only history table and a new transaction function; no existing requests are rewritten. The older save function remains available during a rolling code update. No migration, push, production data change or deployment was performed for this change.

Rolling back code hides the new action/history views, but leaves the additive table and its records intact. An older client/server will continue blocking additional requests after ordered.

## Local verification

All 17 tests in `node --test server/tests/classroom-updates.test.cjs` passed. They cover multiple repeat requests, preserving snapshots, edits/cancellation of the current request, student/teacher isolation, closed menus, denials, malformed intent, stale teacher changes, duplicate submissions, removed ordered requests, pricing and existing menu/homework behavior. These route tests mock the persistence boundary. Postgres is unavailable locally; the migration has not been executed against a database. The fictional browser preview follows the same request contract, without connecting to Supabase. Browser checks confirmed an empty new selection, discard without changing the earlier order, a successful second request, and the first request's original items/note in both student and teacher history. Desktop and phone layouts, client/server TypeScript checks, and lint on changed client files passed.
