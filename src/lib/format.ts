const TZ = "Europe/London";

export function fmtDateTime(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: TZ }).format(ms);
}

export function fmtDate(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: TZ }).format(ms);
}

export function fmtDay(day: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(day + "T00:00:00Z"));
}

export function timeAgo(ms: number | null | undefined, now = Date.now()): string {
  if (!ms) return "Never";
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 14) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(ms);
}

export const pct = (n: number) => `${Math.round(n * 100)}%`;

export const ACTION_LABELS: Record<string, string> = {
  "auth.login": "Signed in",
  "auth.logout": "Signed out",
  "auth.login_failed": "Failed sign-in",
  "auth.login_blocked": "Blocked sign-in (disabled)",
  "invite.created": "Account created & invited",
  "invite.resent": "Invite re-sent",
  "invite.revoked": "Invite revoked",
  "invite.accepted": "Invite accepted",
  "user.role_changed": "Role changed",
  "user.disabled": "Account disabled",
  "user.enabled": "Account enabled",
  "system.seed": "Super administrator created",
  "auth.password_changed": "Password changed",
  "user.profile_updated": "Profile updated",
};
