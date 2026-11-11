"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { INVITABLE_ROLES } from "@/lib/roles";
import { fmtDateTime, timeAgo } from "@/lib/format";
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
  status: string;
}

interface Issued {
  email: string;
  link: string;
  emailed: boolean;
  emailNote: string | null;
}

export function InviteManager({ invites, defaultRole }: { invites: Invite[]; defaultRole?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [issued, setIssued] = useState<Issued | null>(null);
  const [copied, setCopied] = useState(false);
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
      const data = await send("/api/invites", "POST", { email: fd.get("email"), name: fd.get("name"), role });
      setIssued(data);
      setCopied(false);
      form.reset();
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
        if (!confirm("Revoke this invite? The link will stop working.")) return;
        await send(`/api/invites/${id}`, "DELETE");
      } else {
        setIssued(await send(`/api/invites/${id}`, "POST"));
        setCopied(false);
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <div className="c-stack">
      <form onSubmit={create} className="c-card c-invite-form">
        <header className="c-card-head"><h2>Invite a team member</h2></header>
        <div className="c-card-body">
          <div className="c-form-grid">
            <label><span>Email address</span><input className="c-input" name="email" type="email" required placeholder="name@organisation.com" /></label>
            <label><span>Name <em>(optional)</em></span><input className="c-input" name="name" placeholder="Full name" /></label>
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
            <p>The invite link is valid for 7 days and works once.</p>
            <button className="c-btn primary" disabled={busy}><Icon name="mail" size={16} /> {busy ? "Creating…" : "Create invite"}</button>
          </div>
        </div>
      </form>

      {issued && (
        <div className="c-callout" role="status">
          <div>
            <strong>{issued.emailed ? `Invitation emailed to ${issued.email}` : `Invite link ready for ${issued.email}`}</strong>
            <p>{issued.emailed ? "You can also share the link directly." : issued.emailNote}</p>
            <code>{issued.link}</code>
          </div>
          <button className="c-btn secondary" onClick={() => copy(issued.link)}><Icon name={copied ? "check" : "copy"} size={16} /> {copied ? "Copied" : "Copy link"}</button>
        </div>
      )}

      <section className="c-card">
        <header className="c-card-head"><h2>All invites</h2><span className="c-muted">{invites.length} total</span></header>
        {invites.length === 0 ? (
          <div className="c-empty"><strong>No invites yet</strong><p>Create your first invite above to bring someone onto the platform.</p></div>
        ) : (
          <div className="c-table-wrap">
            <table className="c-table">
              <thead><tr><th>Invitee</th><th>Role</th><th>Status</th><th>Sent</th><th>Expires</th><th /></tr></thead>
              <tbody>
                {invites.map((i) => (
                  <tr key={i.id}>
                    <td><strong>{i.name || i.email}</strong>{i.name && <small>{i.email}</small>}</td>
                    <td><RoleTag role={i.role} /></td>
                    <td><StatusPill status={i.status} />{i.emailed_at && <small>Emailed</small>}</td>
                    <td>{timeAgo(i.created_at)}<small>{i.invited_by_name ? `by ${i.invited_by_name}` : ""}</small></td>
                    <td>{i.status === "pending" ? fmtDateTime(i.expires_at) : "—"}</td>
                    <td className="c-row-actions">
                      {i.status !== "accepted" && <button className="c-btn ghost sm" onClick={() => act(i.id, "resend")}>{i.status === "pending" ? "New link" : "Re-invite"}</button>}
                      {i.status === "pending" && <button className="c-btn ghost sm danger" onClick={() => act(i.id, "revoke")}>Revoke</button>}
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
