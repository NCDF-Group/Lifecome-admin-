"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { INVITABLE_ROLES } from "@/lib/roles";
import { timeAgo } from "@/lib/format";
import { Icon } from "./icon";
import { RoleTag, StatusPill } from "./ui";

interface Invite {
  id: string;
  email: string;
  name: string | null;
  role: string;
  invited_by_name: string | null;
  created_at: number;
  expires_at: number;
  emailed_at: number | null;
  activated: number;
  status: string;
}

interface Issued {
  email: string;
  link: string;
  emailed: boolean;
  emailNote: string | null;
}

function suggestPassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const c = Array.from(bytes, (b) => alphabet[b % alphabet.length]);
  c[0] = "ABCDEFGHJKMNPQRSTUVWXYZ"[bytes[0] % 23];
  c[1] = String(2 + (bytes[1] % 8));
  return `${c.slice(0, 4).join("")}-${c.slice(4, 8).join("")}-${c.slice(8).join("")}`;
}

export function InviteManager({ invites, defaultRole }: { invites: Invite[]; defaultRole?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [issued, setIssued] = useState<Issued | null>(null);
  const [copied, setCopied] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(true);
  const [role, setRole] = useState(INVITABLE_ROLES.some((r) => r.key === defaultRole) ? (defaultRole as string) : INVITABLE_ROLES[0].key);

  async function send(url: string, method: string, payload?: unknown) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: payload ? JSON.stringify(payload) : undefined });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
    return data;
  }

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    setError("");
    try {
      const data = await send("/api/invites", "POST", { email: fd.get("email"), name: fd.get("name"), role, password });
      setIssued(data);
      setCopied("");
      form.reset();
      setPassword("");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function act(id: string, kind: "resend" | "revoke") {
    setError("");
    try {
      if (kind === "revoke") {
        if (!confirm("Revoke this invite? The link stops working and the account, if never activated, is removed.")) return;
        await send(`/api/invites/${id}`, "DELETE");
      } else {
        setIssued(await send(`/api/invites/${id}`, "POST", {}));
        setCopied("");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
  }

  return (
    <div className="c-stack">
      <form onSubmit={create} className="c-card c-invite-form">
        <header className="c-card-head"><h2>Add a team member</h2></header>
        <div className="c-card-body">
          <div className="c-form-grid three">
            <label><span>Email address</span><input className="c-input" name="email" type="email" required placeholder="name@organisation.com" /></label>
            <label><span>Full name</span><input className="c-input" name="name" placeholder="Full name" /></label>
            <label>
              <span>Default password</span>
              <div className="c-input-group">
                <input
                  className="c-input"
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type one or click Generate"
                  required
                  autoComplete="off"
                  minLength={10}
                />
                <button type="button" className="c-btn ghost sm" onClick={() => setShowPw((v) => !v)}>{showPw ? "Hide" : "Show"}</button>
                <button type="button" className="c-btn secondary sm" onClick={() => setPassword(suggestPassword())}>Generate</button>
              </div>
            </label>
          </div>
          <fieldset className="c-roles">
            <legend>Role</legend>
            {INVITABLE_ROLES.map((r) => (
              <label key={r.key} className={role === r.key ? "on" : ""} style={{ ["--tag" as string]: r.color }}>
                <input type="radio" name="role" value={r.key} checked={role === r.key} onChange={() => setRole(r.key)} />
                <strong>{r.label}</strong>
                <small>{r.description}</small>
              </label>
            ))}
          </fieldset>
          {error && <p className="c-error" role="alert">{error}</p>}
          <div className="c-form-foot">
            <p>Share the default password with them. They confirm it, then choose their own password on first sign-in.</p>
            <button className="c-btn primary" disabled={busy}><Icon name="plus" size={16} /> {busy ? "Creating…" : "Create account & invite"}</button>
          </div>
        </div>
      </form>

      {issued && (
        <div className="c-callout" role="status">
          <div className="c-callout-main">
            <strong>{issued.emailed ? `Invitation emailed to ${issued.email}` : `Account created for ${issued.email}`}</strong>
            <p>{issued.emailed ? "They can also use the link below." : "Copy the invite link and send it to them with their default password."}</p>
            <code>{issued.link}</code>
          </div>
          <button className="c-btn secondary" onClick={() => copy("link", issued.link)}><Icon name={copied === "link" ? "check" : "copy"} size={16} /> {copied === "link" ? "Copied" : "Copy link"}</button>
        </div>
      )}

      <section className="c-card">
        <header className="c-card-head"><h2>All invites</h2><span className="c-muted">{invites.length} total</span></header>
        {invites.length === 0 ? (
          <div className="c-empty"><strong>No invites yet</strong><p>Add your first team member above.</p></div>
        ) : (
          <div className="c-table-wrap">
            <table className="c-table">
              <thead><tr><th>Invitee</th><th>Role</th><th>Link</th><th>Account</th><th>Sent</th><th /></tr></thead>
              <tbody>
                {invites.map((i) => (
                  <tr key={i.id}>
                    <td><strong>{i.name || i.email}</strong>{i.name && <small>{i.email}</small>}</td>
                    <td><RoleTag role={i.role} /></td>
                    <td><StatusPill status={i.status} /></td>
                    <td>{i.activated ? <span className="c-pill active">Activated</span> : i.status === "revoked" ? <span className="c-muted">—</span> : <span className="c-pill pending">Awaiting new password</span>}</td>
                    <td>{timeAgo(i.created_at)}<small>{i.invited_by_name ? `by ${i.invited_by_name}` : ""}</small></td>
                    <td className="c-row-actions">
                      {!i.activated && i.status !== "revoked" && <button className="c-btn ghost sm" onClick={() => act(i.id, "resend")}>New link</button>}
                      {!i.activated && i.status !== "revoked" && i.status !== "accepted" && <button className="c-btn ghost sm danger" onClick={() => act(i.id, "revoke")}>Revoke</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
