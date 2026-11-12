"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { INVITABLE_ROLES } from "@/lib/roles";
import { timeAgo } from "@/lib/format";
import { RoleTag, StatusPill } from "./ui";

interface Member {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  created_at: number;
  last_login_at: number | null;
  must_change_password: number;
  title: string | null;
  bio: string | null;
  languages: string | null;
  show_in_app: number;
  app: { visible: boolean; reason: string };
}

export function TeamTable({ members, currentUserId }: { members: Member[]; currentUserId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const shown = members.filter((m) => (m.name + m.email).toLowerCase().includes(query.toLowerCase()));

  async function patch(id: string, payload: object) {
    setError("");
    const res = await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Couldn’t update.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function saveProfile(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    const ok = await patch(id, {
      name: f.get("name"),
      title: f.get("title"),
      languages: f.get("languages"),
      bio: f.get("bio"),
      showInApp: f.get("showInApp") === "on",
    });
    setSaving(false);
    if (ok) setEditing(null);
  }

  return (
    <section className="c-card">
      <header className="c-card-head">
        <h2>Team members</h2>
        <input className="c-input sm" placeholder="Search name or email" aria-label="Search team" value={query} onChange={(e) => setQuery(e.target.value)} />
      </header>
      {error && <p className="c-error pad" role="alert">{error}</p>}
      <div className="c-table-wrap">
        <table className="c-table">
          <thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Patient app</th><th>Last sign-in</th><th /></tr></thead>
          <tbody>
            {shown.map((m) => {
              const locked = m.role === "superadmin" || m.id === currentUserId;
              const open = editing === m.id;
              return (
                <Fragment key={m.id}>
                  <tr>
                    <td><strong>{m.name}</strong><small>{m.title ? `${m.title} · ` : ""}{m.email}</small></td>
                    <td>
                      {locked ? <RoleTag role={m.role} /> : (
                        <select className="c-input sm" value={m.role} aria-label={`Role for ${m.name}`} onChange={(e) => patch(m.id, { role: e.target.value })}>
                          {INVITABLE_ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
                        </select>
                      )}
                    </td>
                    <td>{m.must_change_password && m.status === "active" ? <span className="c-pill pending">Awaiting new password</span> : <StatusPill status={m.status} />}</td>
                    <td>{m.role === "superadmin" ? <span className="c-muted">—</span> : <span className={`c-app ${m.app.visible ? "on" : ""}`}><i />{m.app.reason}</span>}</td>
                    <td>{timeAgo(m.last_login_at)}</td>
                    <td className="c-row-actions">
                      {m.role !== "superadmin" && <button className="c-btn ghost sm" onClick={() => setEditing(open ? null : m.id)} aria-expanded={open}>{open ? "Close" : "Profile"}</button>}
                      {!locked && (
                        <button className={`c-btn ghost sm ${m.status === "active" ? "danger" : ""}`} onClick={() => patch(m.id, { status: m.status === "active" ? "disabled" : "active" })}>
                          {m.status === "active" ? "Disable" : "Enable"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {open && (
                    <tr className="c-edit-row">
                      <td colSpan={6}>
                        <form className="c-profile-form" onSubmit={(e) => saveProfile(e, m.id)}>
                          <p className="c-muted">This is what patients see in the LifeCome Health app.</p>
                          <div className="c-form-grid">
                            <label><span>Display name</span><input className="c-input" name="name" defaultValue={m.name} required minLength={2} maxLength={120} /></label>
                            <label><span>Title</span><input className="c-input" name="title" defaultValue={m.title ?? ""} maxLength={80} placeholder="e.g. GP · online and in-clinic" /></label>
                            <label><span>Languages</span><input className="c-input" name="languages" defaultValue={m.languages ?? ""} maxLength={120} placeholder="e.g. English, Yoruba" /></label>
                            <label className="c-check"><input type="checkbox" name="showInApp" defaultChecked={m.show_in_app === 1} /><span>Show in the patient app</span></label>
                          </div>
                          <label className="c-block"><span>About</span><textarea className="c-input" name="bio" rows={3} maxLength={600} defaultValue={m.bio ?? ""} placeholder="A short introduction for patients" /></label>
                          <div className="c-form-foot">
                            <p>{m.app.visible ? "Visible to patients now." : `Not visible yet: ${m.app.reason.toLowerCase()}.`}</p>
                            <button className="c-btn primary sm" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <div className="c-empty"><strong>No matching team members</strong></div>}
      </div>
    </section>
  );
}
