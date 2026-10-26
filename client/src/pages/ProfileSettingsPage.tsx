import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { accountCall, useAccountProfile } from "../features/account/account";
import { LoginStreak } from "../features/account/LoginStreak";
import { ACCOUNT_COLORS, type AccountColor } from "../../../server/src/shared/accountPreferences";
import { getSupabaseClient } from "../lib/supabase";
import { getDashboardPath, getUserRole } from "../lib/auth";
import "../styles/profile-settings.css";

async function resizeAvatar(file: File) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) throw new Error("Choose a PNG, JPEG or WebP image under 8 MB.");
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas"); canvas.width = 256; canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const size = Math.min(image.width, image.height);
  context.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, 256, 256); image.close();
  return canvas.toDataURL("image/webp", .85);
}
export function ProfileSettingsPage() {
  const { profile, signedIn, loading, error, refresh } = useAccountProfile();
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => { if (!loading && !signedIn) window.location.replace("/login"); }, [loading, signedIn]);
  async function token() { const { data } = await getSupabaseClient().auth.getSession(); if (!data.session) { window.location.assign("/login"); throw new Error("Sign in to manage your profile."); } return data.session.access_token; }
  async function saveAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    setBusy(true); setMessage("");
    try { const avatar = await resizeAvatar(file); await accountCall("/profile", await token(), "PATCH", { avatar }); await refresh(); setMessage("Profile picture saved."); }
    catch (error) { setMessage((error as Error).message); } finally { setBusy(false); event.target.value = ""; }
  }
  async function verify(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { const result = await accountCall<{ message: string }>("/email", await token(), "POST", { email, password }); setPassword(""); setMessage(result.message); await refresh(); }
    catch (error) { setMessage((error as Error).message); } finally { setBusy(false); }
  }
  async function saveColor(themeColor: AccountColor) {
    setBusy(true); setMessage("");
    try { await accountCall("/preferences", await token(), "PATCH", { themeColor }); await refresh(); setMessage("Your color is saved."); }
    catch (error) { setMessage((error as Error).message); } finally { setBusy(false); }
  }
  async function back() { const { data } = await getSupabaseClient().auth.getSession(); window.location.assign(data.session ? getDashboardPath(getUserRole(data.session.user)) : "/login"); }
  if (!profile) return <main className="profile-settings"><a href="/">← Back</a><h1>Profile settings</h1>{error ? <><p role="alert">{error}</p><button disabled={busy} onClick={() => { setBusy(true); void refresh().catch(failure => setMessage(failure.message)).finally(() => setBusy(false)); }}>Try again</button>{message && <p role="status">{message}</p>}</> : <p role="status">Loading your profile…</p>}</main>;
  return <main className="profile-settings"><button className="profile-back" onClick={() => { void back(); }}>← Back to dashboard</button><header><span>YOUR ACCOUNT</span><h1>Make yourself at home</h1><p>Your picture, email and account security in one place.</p></header>{message && <p className="profile-message" role="status">{message}</p>}
    <section className="profile-card"><div className="profile-large-avatar">{profile?.avatar ? <img src={profile.avatar} alt="Your profile" /> : profile?.name.slice(0, 1) ?? "?"}</div><div><h2>{profile?.name ?? "Profile settings"}</h2><p>Username: <strong>{profile?.username ?? "Loading…"}</strong></p><label className="profile-upload">{busy ? "Saving…" : "Choose profile picture"}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={event => { void saveAvatar(event); }} /></label>{profile?.avatar && <button disabled={busy} onClick={() => { setBusy(true); void token().then(value => accountCall("/profile", value, "PATCH", { avatar: null })).then(refresh).catch(error => setMessage(error.message)).finally(() => setBusy(false)); }}>Remove picture</button>}<small>Square crop · PNG, JPEG or WebP · Up to 8 MB</small></div></section>
    <section className="profile-card profile-color-section"><div><span className="profile-kicker">MAKE IT YOURS</span><h2>Your portal color</h2><p>Choose an accent for your dashboard. The warm paper background stays familiar.</p></div><div className="profile-color-grid" role="group" aria-label="Portal color">{ACCOUNT_COLORS.map(color => <button className="profile-color-option" key={color.id} type="button" aria-pressed={profile.themeColor === color.id} disabled={busy} onClick={() => { void saveColor(color.id); }}><span className="profile-color-swatch" style={{ background: color.accent }}>{profile.themeColor === color.id ? "✓" : ""}</span><strong>{color.name}</strong><small>{profile.themeColor === color.id ? "Selected" : "Choose color"}</small></button>)}</div></section>
    <LoginStreak />
    <section className="profile-card profile-email"><div><span className="profile-kicker">STAY CONNECTED</span><h2>Email & recovery</h2><p>Add an email you can open, verify it, and use it if you forget your password.</p>{profile?.email && <p className="profile-verified">✓ Verified: <strong>{profile.email}</strong></p>}{profile?.pendingEmail && <p>Awaiting verification: <strong>{profile.pendingEmail}</strong>. Enter it below to resend.</p>}{profile && !profile.emailDeliveryReady && <p className="profile-message">Email delivery setup is pending. Your teacher needs to connect the email service before verification or recovery messages can be sent.</p>}</div><form onSubmit={verify}><label>Email address<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder={profile?.email ?? "you@example.com"} /></label><label>Current password<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></label><button className="profile-primary" disabled={busy || !profile?.emailDeliveryReady}>Send verification email</button><small>Your login username stays the same. Recovery becomes available after you verify the email.</small></form><a href="/forgot-password">Forgot your password?</a></section></main>;
}

export function AccountEmailPage({ mode }: { mode: "verify" | "forgot" | "reset" }) {
  const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "");
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [confirm, setConfirm] = useState(""), [message, setMessage] = useState(""), [busy, setBusy] = useState(false), [done, setDone] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (mode === "reset" && password !== confirm) { setMessage("The passwords do not match."); return; }
    setBusy(true); setMessage("");
    try { const result = await accountCall<{ message: string }>(mode === "verify" ? "/verify-email" : mode === "reset" ? "/reset-password" : "/forgot-password", "", "POST", mode === "forgot" ? { email } : { token, password }); setMessage(result.message); setDone(true); window.history.replaceState({}, "", window.location.pathname); }
    catch (error) { setMessage((error as Error).message); } finally { setBusy(false); }
  }
  return <main className="profile-settings profile-email-flow"><a href="/login">← Back to login</a><header><span>ACCOUNT SECURITY</span><h1>{mode === "verify" ? "Verify your email" : mode === "reset" ? "Choose a new password" : "Forgot your password?"}</h1><p>{mode === "forgot" ? "Enter the email you verified in Profile settings. Your teacher can help if you have not added one yet." : mode === "verify" ? "Confirm this address to enable password recovery for your account." : "Use at least 12 characters. Your username will stay the same."}</p></header>{message && <p className="profile-message" role="status">{message}</p>}{!done ? <form className="profile-card" onSubmit={submit}>{mode === "forgot" ? <label>Verified email<input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></label> : mode === "reset" ? <><label>New password<input type="password" required minLength={12} maxLength={256} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} /></label><label>Confirm new password<input type="password" required minLength={12} autoComplete="new-password" value={confirm} onChange={event => setConfirm(event.target.value)} /></label></> : null}{mode !== "forgot" && !token && <p>This link is missing its verification code. Open the complete link from your email or request another.</p>}<button className="profile-primary" disabled={busy || mode !== "forgot" && !token}>{busy ? "Please wait…" : mode === "verify" ? "Verify email" : mode === "reset" ? "Save new password" : "Send reset link"}</button></form> : <a className="profile-primary" href={mode === "verify" ? "/profile" : "/login"}>{mode === "verify" ? "Return to profile" : "Return to login"}</a>}</main>;
}
