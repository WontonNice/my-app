# Persistent exam access

Teacher-controlled availability was stored in `server/data/assessments.json`, a deployment file. Redeploying a checkout or replacing that file could restore authored locked values, losing a teacher's runtime changes. There was no automatic expiry timer in the access controls.

Availability now lives in the private Supabase `assessment_access` table, keyed by stable exam ID. English, Math, completed-attempt access and corrections are independent settings. Atomic partial updates preserve the other settings when separate requests change different controls. Exam catalog edits never overwrite a saved access row. There is no expiry or automatic close; only an explicit access change closes a section. Individual attempt timers and student-specific reentry permissions retain their existing behavior.

Assessment lists/details, draft/result writes, corrections and board content access resolve database settings. Metadata-only catalogs (question names and assignment catalogs) continue using authored files. Database failures return an unavailable error rather than substituting locked settings or acknowledging an unsaved open action.

## Manual rollout — not applied by this change

1. Apply `supabase/migrations/202610280003_persistent_exam_access.sql` to the intended environment before running the updated API. RLS is enabled; browser roles cannot read/write the table or call the function. The server service role has access.
2. To preserve exams currently open under the old code, capture that environment's current runtime `server/data/assessments.json` (or the authenticated teacher assessments response) **before replacing/redeploying the running instance**. A checked-in/local catalog is not a substitute for production runtime settings.
3. Validate the snapshot with `node tools/backfill-exam-access.cjs --file=/path/to/snapshot.json`. Then run the same command with `--apply` and the intended environment's Supabase service credentials. Existing persistent settings are never overwritten; the import can be retried. This tool was prepared but no live import or migration was performed.
4. Deploy/restart the application yourself. If no old snapshot is available, explicitly reopen the desired exams once after rollout; subsequent access changes are durable. Exams without a saved access row initially use their authored defaults. The first access change snapshots their other current settings.
5. Verify opening English/Math, restart the API, confirm they remain open, explicitly close one section and confirm the other stays open, and confirm closing both blocks students. A failed storage write must show an error, not a success message.

Rollback: old code reads file-based settings again. Keep the additive table; rolling back code does not delete the durable settings.

Verification uses a mocked database to test module restarts/catalog replacement, independent changes, initial snapshots, explicit close persistence, and failure behavior. Actual Postgres execution and production restart acceptance require the user's manual rollout; they have not been represented as completed local tests.

Local checks: 50 focused tests passed across persistence, exam reentry, section progress, corrections/review and boards; server TypeScript check passed. A broader learning-plan run had one unrelated fixture-count failure (`3 !== 2` in the combined-book version alias test) amid ongoing library-content changes; it was left untouched. The backfill validation ran in dry-run mode only.
