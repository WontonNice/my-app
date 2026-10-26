import { Router, type ErrorRequestHandler, type Request } from "express";
import { createHash, randomBytes } from "node:crypto";
import { createClient, type User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getUserRole, isStudentArchived } from "../lib/auth";
import { accountMailReady, sendAccountMail } from "../lib/accountMail";
import { ACCOUNT_COLORS, accountColor, loginStreak } from "../shared/accountPreferences";

export const accountRouter = Router();
function fail(message: string, status = 400): never { throw Object.assign(new Error(message), { status }); }
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const storage = (error: unknown) => { if (error) fail("Account storage is unavailable. Apply migration 202610240004_account_profiles.sql.", 503); };
const normalizeEmail = (value: unknown) => {
  if (typeof value !== "string" || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || /\.local$/i.test(value.trim())) return fail("Enter a real email address that you can open.");
  return value.trim().toLowerCase();
};
const tokenHash = (value: unknown) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value) ? hash(value) : fail("This link is invalid or expired. Request a new one.");
async function limit(bucket: string, count: number, seconds: number) {
  const result = await supabase.rpc("claim_account_request", { p_bucket: hash(bucket), p_limit: count, p_seconds: seconds }); storage(result.error);
  if (!result.data) fail("Too many requests. Please try again later.", 429);
}
async function userFor(request: Request) {
  const token = request.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return fail("Sign in to manage your profile.", 401);
  const result = await supabase.auth.getUser(token), user = result.data.user;
  if (result.error || !user || user.is_anonymous) return fail("Sign in again to manage your profile.", 401);
  if (isStudentArchived(user)) return fail("This account is archived. Contact your teacher.", 403);
  return user;
}
async function profileFor(user: User) {
  const result = await supabase.from("account_profiles").select("*").eq("user_id", user.id).maybeSingle(); storage(result.error);
  return { id: user.id, name: String(user.user_metadata.full_name || user.user_metadata.name || "Student"), username: String(user.user_metadata.username || user.email?.split("@")[0] || ""), avatar: result.data?.avatar_data ?? null, email: result.data?.email ?? null, verifiedAt: result.data?.email_verified_at ?? null, pendingEmail: result.data?.pending_email ?? null, lastLoginAt: user.last_sign_in_at ?? null, emailDeliveryReady: accountMailReady(), themeColor: accountColor(result.data?.theme_color).id, streak: loginStreak(result.data) };
}
accountRouter.get("/profile", async (request, response) => response.json(await profileFor(await userFor(request))));
accountRouter.patch("/preferences", async (request, response) => {
  const user = await userFor(request), theme = request.body?.themeColor;
  if (!ACCOUNT_COLORS.some(color => color.id === theme)) fail("Choose one of the available colors.");
  await limit(`preferences:${user.id}`, 60, 3600);
  const saved = await supabase.from("account_profiles").upsert({ user_id: user.id, theme_color: theme, updated_at: new Date().toISOString() });
  storage(saved.error);
  response.json(await profileFor(user));
});
accountRouter.post("/check-in", async (request, response) => {
  const user = await userFor(request);
  await limit(`check-in:${user.id}`, 120, 3600);
  const result = await supabase.rpc("record_account_login", { p_user_id: user.id });
  if (result.error) fail("Your login streak could not be saved. Please try again later.", 503);
  response.json({ streak: loginStreak(result.data) });
});
accountRouter.patch("/profile", async (request, response) => {
  const user = await userFor(request), avatar = request.body?.avatar;
  await limit(`avatar:${user.id}`, 30, 3600);
  if (avatar !== null) {
    if (typeof avatar !== "string" || avatar.length > 180000 || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(avatar)) fail("Choose a PNG, JPEG or WebP image under 130 KB after resizing.");
    const bytes = Buffer.from(avatar.split(",")[1], "base64");
    const mime = avatar.slice(5, avatar.indexOf(";"));
    const valid = mime === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : mime === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 : bytes.subarray(0,4).toString() === "RIFF" && bytes.subarray(8,12).toString() === "WEBP";
    if (!valid) fail("That file is not a supported image.");
  }
  const saved = await supabase.from("account_profiles").upsert({ user_id: user.id, avatar_data: avatar, updated_at: new Date().toISOString() }); storage(saved.error);
  response.json(await profileFor(user));
});
accountRouter.post("/email", async (request, response) => {
  const user = await userFor(request), email = normalizeEmail(request.body?.email);
  if (!accountMailReady()) fail("Email delivery is not configured yet. Ask your teacher to connect the email service.", 503);
  await limit(`email:${user.id}`, 1, 60); await limit(`email-hour:${user.id}`, 5, 3600);
  const password = request.body?.password;
  if (typeof password !== "string" || !password || password.length > 256 || !user.email) fail("Enter your current password to add or change a recovery email.");
  // Use an isolated auth client: signing in must never replace the server's service-role session.
  const checker = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const checked = await checker.auth.signInWithPassword({ email: user.email, password });
  if (checked.error || checked.data.user?.id !== user.id) fail("Your current password was not accepted.", 403);
  if (checked.data.session) await checker.auth.signOut({ scope: "local" });
  const token = randomBytes(32).toString("hex"), token_hash = hash(token);
  const saved = await supabase.from("account_profiles").upsert({ user_id: user.id, pending_email: email, updated_at: new Date().toISOString() }); storage(saved.error);
  const inserted = await supabase.from("account_email_tokens").insert({ token_hash, user_id: user.id, email, purpose: "verify", expires_at: new Date(Date.now() + 3600000).toISOString() }); storage(inserted.error);
  try { await sendAccountMail(email, "verify", token); }
  catch (error) { await supabase.from("account_email_tokens").update({ used_at: new Date().toISOString() }).eq("token_hash", token_hash); throw error; }
  response.json({ message: "Verification email sent. Open the link to enable password recovery. Your username stays the same." });
});
accountRouter.post("/verify-email", async (request, response) => {
  await limit(`verify:${request.ip}`, 30, 3600);
  const result = await supabase.rpc("verify_account_email", { p_hash: tokenHash(request.body?.token) });
  if (result.error?.code === "23505") fail("This email is already connected to an account. Use a different email.");
  storage(result.error); if (!result.data) fail("This link is invalid, already used, or expired. Request a new verification email.");
  response.json({ message: "Email verified. You can now recover your password using this address." });
});
accountRouter.post("/forgot-password", async (request, response) => {
  const email = normalizeEmail(request.body?.email);
  await limit(`recovery-ip:${request.ip}`, 10, 3600); await limit(`recovery-email:${email}`, 3, 3600);
  const profile = await supabase.from("account_profiles").select("user_id,email_verified_at").eq("email", email).maybeSingle(); storage(profile.error);
  if (!profile.data?.email_verified_at) fail("Email not found. Enter an email verified in Profile settings.", 404);
  const target = await supabase.auth.admin.getUserById(profile.data.user_id);
  if (target.error) fail("Account recovery is temporarily unavailable. Please try again later.", 503);
  if (!target.data.user || isStudentArchived(target.data.user)) fail("Email not found. Enter an email verified in Profile settings.", 404);
  if (!accountMailReady()) fail("Email delivery is not configured yet. Contact your teacher for password help.", 503);
  const token = randomBytes(32).toString("hex"), token_hash = hash(token);
  const saved = await supabase.from("account_email_tokens").insert({ token_hash, user_id: profile.data.user_id, email, purpose: "recover", expires_at: new Date(Date.now() + 1800000).toISOString() }); storage(saved.error);
  try { await sendAccountMail(email, "recover", token); }
  catch (error) { await supabase.from("account_email_tokens").update({ used_at: new Date().toISOString() }).eq("token_hash", token_hash); throw error; }
  response.json({ message: "Password-reset email sent. Check your inbox and spam folder. The link expires in 30 minutes." });
});
accountRouter.post("/reset-password", async (request, response) => {
  await limit(`reset:${request.ip}`, 20, 3600);
  const password = request.body?.password;
  if (typeof password !== "string" || password.length < 12 || password.length > 256) fail("Use a password between 12 and 256 characters.");
  const consumed = await supabase.rpc("consume_account_recovery", { p_hash: tokenHash(request.body?.token) }); storage(consumed.error);
  if (!consumed.data) fail("This reset link is invalid, already used, or expired. Request a new one.");
  const target = await supabase.auth.admin.getUserById(consumed.data);
  if (!target.data.user || isStudentArchived(target.data.user)) fail("This account is unavailable. Contact your teacher.", 403);
  const saved = await supabase.auth.admin.updateUserById(consumed.data, { password });
  if (saved.error) fail("The password could not be updated. Request a new link and try again.", 503);
  const invalidated = await supabase.from("account_email_tokens").update({ used_at: new Date().toISOString() }).eq("user_id", consumed.data).eq("purpose", "recover"); storage(invalidated.error);
  response.json({ message: "Password updated. Sign in with your existing username and new password." });
});
accountRouter.post("/presence", async (request, response) => {
  const user = await userFor(request), clientId = request.body?.clientId;
  if (typeof clientId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clientId)) fail("Invalid browser session.");
  await limit(`presence:${user.id}`, 120, 60);
  const result = await supabase.from("account_presence").upsert({ user_id: user.id, client_id: clientId, last_seen_at: new Date().toISOString(), last_login_at: user.last_sign_in_at ?? null }); storage(result.error);
  response.json({ ok: true });
});
accountRouter.delete("/presence/:clientId", async (request, response) => {
  const user = await userFor(request);
  const result = await supabase.from("account_presence").delete().eq("user_id", user.id).eq("client_id", String(request.params.clientId)); storage(result.error); response.json({ ok: true });
});
accountRouter.get("/activity", async (request, response) => {
  const user = await userFor(request);
  if (!["teacher", "admin"].includes(getUserRole(user))) fail("Teacher access is required.", 403);
  const result = await supabase.from("account_presence").select("user_id,last_seen_at,last_login_at").gte("last_seen_at", new Date(Date.now() - 90000).toISOString()); storage(result.error);
  const onlineIds = [...new Set((result.data ?? []).map(row => row.user_id))];
  const lastLogins = Object.fromEntries((result.data ?? []).filter(row => row.last_login_at).sort((a, b) => Date.parse(a.last_login_at) - Date.parse(b.last_login_at)).map(row => [row.user_id, row.last_login_at]));
  response.json({ onlineIds, lastLogins, checkedAt: new Date().toISOString(), windowSeconds: 90 });
});
const errors: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) { next(error); return; }
  response.status(error?.status ?? 500).json({ message: error?.status ? error.message : "The account request could not be completed. Please try again." });
};
accountRouter.use(errors);
