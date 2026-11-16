// Backfills app_metadata.role, the only role field the server trusts.
//
// Roles used to be read from user_metadata as a fallback, but users can edit their
// own user_metadata, so the server no longer reads it. This script:
//   * gives every account without a trusted role app_metadata.role = "student"
//     when user_metadata claims "student" or nothing at all;
//   * NEVER promotes accounts that claim teacher/admin/staff/store only in
//     user_metadata (that claim may be forged). They are listed for review, and
//     you promote the real ones explicitly with --promote.
//
// Usage (from the repo root, with SUPABASE_URL and SUPABASE_SERVICE_ROLE set):
//   node server/scripts/backfill-trusted-roles.mjs                 # dry run, changes nothing
//   node server/scripts/backfill-trusted-roles.mjs --apply         # write student backfill
//   node server/scripts/backfill-trusted-roles.mjs --apply --promote teacher@example.com=teacher
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const privilegedRoles = new Set(["admin", "staff", "store", "teacher"]);
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const promotions = new Map();
for (let index = 0; index < args.length; index += 1) {
  if (args[index] !== "--promote") continue;
  const [email, role] = String(args[index + 1] ?? "").split("=");
  if (!email || !privilegedRoles.has(role)) {
    throw new Error(`--promote expects email=role with role in: ${[...privilegedRoles].join(", ")}`);
  }
  promotions.set(email.trim().toLowerCase(), role);
}

const url = process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRole) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE are required.");
const admin = createClient(url, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });

async function listAllUsers() {
  const users = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}

async function setRole(user, role) {
  if (!apply) return;
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role },
  });
  if (error) throw new Error(`${user.email}: ${error.message}`);
}

const users = await listAllUsers();
const counts = { alreadyTrusted: 0, backfilledStudent: 0, promoted: 0 };
const needsReview = [];
const unmatchedPromotions = new Set(promotions.keys());

for (const user of users) {
  const email = (user.email ?? "").toLowerCase();
  const promoteTo = promotions.get(email);
  if (promoteTo) {
    unmatchedPromotions.delete(email);
    if (user.app_metadata?.role !== promoteTo) {
      await setRole(user, promoteTo);
      counts.promoted += 1;
      console.log(`${apply ? "Promoted" : "Would promote"} ${email} -> ${promoteTo}`);
      continue;
    }
  }

  if (typeof user.app_metadata?.role === "string" && user.app_metadata.role) {
    counts.alreadyTrusted += 1;
    continue;
  }

  const claimed = user.user_metadata?.role;
  if (privilegedRoles.has(claimed)) {
    needsReview.push({ email, claimed, created: user.created_at });
    continue;
  }

  await setRole(user, "student");
  counts.backfilledStudent += 1;
}

console.log(`\n${apply ? "Applied" : "Dry run (pass --apply to write)"} for ${users.length} users:`);
console.log(`  already had a trusted role: ${counts.alreadyTrusted}`);
console.log(`  ${apply ? "set" : "would set"} to student:       ${counts.backfilledStudent}`);
console.log(`  ${apply ? "promoted" : "would promote"}:              ${counts.promoted}`);
for (const email of unmatchedPromotions) console.warn(`  WARNING: --promote ${email} matched no user`);

if (needsReview.length) {
  console.log(`\n${needsReview.length} account(s) claim a privileged role ONLY in user-editable metadata.`);
  console.log("They are treated as students until you confirm them. Promote the real ones with --promote email=role:");
  for (const entry of needsReview) console.log(`  ${entry.email}  claims "${entry.claimed}"  (created ${entry.created})`);
}
