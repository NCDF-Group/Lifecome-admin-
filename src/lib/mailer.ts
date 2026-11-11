import { roleInfo, type RoleKey } from "./roles.ts";

export type MailResult = { sent: true } | { sent: false; reason: string };

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/** Sends through Resend when RESEND_API_KEY and MAIL_FROM are set; otherwise the caller shares the link manually. */
export async function sendInviteEmail(input: { to: string; link: string; role: RoleKey; name?: string | null; invitedBy?: string | null }): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) return { sent: false, reason: "Email isn’t configured. Copy the link and share it directly." };
  const role = roleInfo(input.role).label;
  const html = `<div style="font-family:Arial,sans-serif;color:#0b2540;max-width:480px">
<h2 style="margin:0 0 12px">You’re invited to LifeCome Health</h2>
<p>${input.invitedBy ? esc(input.invitedBy) + " has invited" : "You have been invited"} you${input.name ? ", " + esc(input.name) + "," : ""} to join as <b>${esc(role)}</b>.</p>
<p><a href="${esc(input.link)}" style="display:inline-block;background:#0667b8;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">Accept invitation</a></p>
<p style="color:#5b7083;font-size:13px">This link expires in 7 days and can be used once.</p></div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: input.to, subject: "You’re invited to LifeCome Health", html }),
    });
    return res.ok ? { sent: true } : { sent: false, reason: `Email provider returned ${res.status}.` };
  } catch {
    return { sent: false, reason: "Couldn’t reach the email provider." };
  }
}
