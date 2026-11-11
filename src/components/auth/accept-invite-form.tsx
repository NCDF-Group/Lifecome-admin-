"use client";

import { useState } from "react";

export function AcceptInviteForm({ token, email, defaultName }: { token: string; email: string; defaultName: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("password") !== form.get("confirm")) return setError("Passwords don’t match.");
    setBusy(true);
    setError("");
    const res = await fetch("/api/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name: form.get("name"), password: form.get("password") }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Couldn’t create your account.");
      setBusy(false);
      return;
    }
    window.location.assign(data.redirect ?? "/");
  }

  return (
    <form onSubmit={submit} className="a-form">
      <label>
        <span>Email</span>
        <input value={email} readOnly disabled />
      </label>
      <label>
        <span>Full name</span>
        <input name="name" defaultValue={defaultName} required autoComplete="name" autoFocus={!defaultName} />
      </label>
      <label>
        <span>Create password</span>
        <input name="password" type="password" required minLength={10} autoComplete="new-password" placeholder="At least 10 characters, with a number" />
      </label>
      <label>
        <span>Confirm password</span>
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" />
      </label>
      {error && <p className="a-error" role="alert">{error}</p>}
      <button className="c-btn primary lg" disabled={busy}>{busy ? "Creating account…" : "Create account & continue"}</button>
    </form>
  );
}
