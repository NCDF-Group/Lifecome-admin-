"use client";

import { useState } from "react";

export function SetPasswordForm({ email }: { email: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("newPassword") !== form.get("confirm")) return setError("New passwords don’t match.");
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Couldn’t update your password.");
      setBusy(false);
      return;
    }
    window.location.replace(data.redirect ?? "/");
  }

  return (
    <form onSubmit={submit} className="a-form">
      <label>
        <span>Email</span>
        <input value={email} readOnly disabled />
      </label>
      <label>
        <span>Default password</span>
        <div className="a-pw">
          <input name="currentPassword" type={show ? "text" : "password"} required autoComplete="current-password" placeholder="The password you signed in with" autoFocus />
          <button type="button" onClick={() => setShow((v) => !v)}>{show ? "Hide" : "Show"}</button>
        </div>
      </label>
      <label>
        <span>New password</span>
        <input name="newPassword" type="password" required minLength={10} autoComplete="new-password" placeholder="At least 10 characters, with a number" />
      </label>
      <label>
        <span>Confirm new password</span>
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" />
      </label>
      {error && <p className="a-error" role="alert">{error}</p>}
      <button className="c-btn primary lg" disabled={busy}>{busy ? "Saving…" : "Save password & continue"}</button>
    </form>
  );
}
