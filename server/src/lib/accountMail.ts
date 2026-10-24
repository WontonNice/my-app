import nodemailer from "nodemailer";

export function accountMailReady() {
  return Boolean(process.env.APP_PUBLIC_URL && ((process.env.RESEND_API_KEY && process.env.EMAIL_FROM) || (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_FROM)));
}
export async function sendAccountMail(email: string, purpose: "verify" | "recover", token: string) {
  if (!accountMailReady()) throw Object.assign(new Error("Email delivery is not configured yet. Ask your teacher to connect the email service."), { status: 503 });
  const base = new URL(process.env.APP_PUBLIC_URL!);
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname))) throw Object.assign(new Error("Email links need a secure APP_PUBLIC_URL."), { status: 503 });
  const url = new URL(purpose === "verify" ? "/account/verify-email" : "/reset-password", base);
  // Fragments keep recovery secrets out of server access logs and Referer headers.
  url.hash = `token=${token}`;
  const subject = purpose === "verify" ? "Verify your Nathan Tutors email" : "Reset your Nathan Tutors password";
  const text = `${purpose === "verify" ? "Confirm this email address for your Nathan Tutors account" : "Choose a new password for your Nathan Tutors account"}:\n\n${url.toString()}\n\nThis link expires in ${purpose === "verify" ? "60" : "30"} minutes and works once. If you did not request it, ignore this message. Your username stays the same.`;
  // Render's free instances block ordinary SMTP ports; HTTPS delivery works there.
  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    try {
      const result = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [email], subject, text }), signal: AbortSignal.timeout(15000) });
      if (!result.ok) throw new Error("Email rejected");
      return;
    } catch { throw Object.assign(new Error("The email could not be sent. Ask your teacher to check the email provider and verified sending domain."), { status: 503 }); }
  }
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_PORT === "465", requireTLS: process.env.SMTP_PORT !== "465", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }, connectionTimeout: 10000, socketTimeout: 15000 });
  try {
    const result = await transport.sendMail({ from: process.env.SMTP_FROM, to: email, subject, text });
    if (!result.accepted?.length) throw new Error("Delivery rejected");
  } catch {
    throw Object.assign(new Error("The email could not be sent. Try again later or ask your teacher to check email delivery."), { status: 503 });
  } finally { transport.close(); }
}
