"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
}

export function TeamTable({ members, currentUserId }: { members: Member[]; currentUserId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const shown = members.filter((m) => (m.name + m.email).toLowerCase().includes(query.toLowerCase()));

  async function patch(id: string, payload: object) {
    setError("");
    const res = await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) setError((await res.json().catch(() => ({}))).error ?? "Couldn’t update.");
    router.refresh();
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
          <thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Last sign-in</th><th /></tr></thead>
          <tbody>
            {shown.map((m) => {
              const locked = m.role === "superadmin" || m.id === currentUserId;
              return (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong><small>{m.email}</small></td>
                  <td>
                    {locked ? <RoleTag role={m.role} /> : (
                      <select className="c-input sm" value={m.role} aria-label={`Role for ${m.name}`} onChange={(e) => patch(m.id, { role: e.target.value })}>
                        {INVITABLE_ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
                      </select>
                    )}
                  </td>
                  <td><StatusPill status={m.status} /></td>
                  <td>{timeAgo(m.last_login_at)}</td>
                  <td className="c-row-actions">
                    {!locked && (
                      <button className={`c-btn ghost sm ${m.status === "active" ? "danger" : ""}`} onClick={() => patch(m.id, { status: m.status === "active" ? "disabled" : "active" })}>
                        {m.status === "active" ? "Disable" : "Enable"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <div className="c-empty"><strong>No matching team members</strong></div>}
      </div>
    </section>
  );
}
