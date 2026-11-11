"use client";

import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Couldn’t sign in. Try again.");
      setBusy(false);
      return;
    }
    window.location.assign(data.redirect ?? "/");
  }

  return (
    <form onSubmit={submit} className="a-form" noValidate>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="username" required autoFocus placeholder="you@lifecome.health" />
      </label>
      <label>
        <span>Password</span>
        <div className="a-pw">
          <input name="password" type={show ? "text" : "password"} autoComplete="current-password" required placeholder="Your password" />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"}>{show ? "Hide" : "Show"}</button>
        </div>
      </label>
      {error && <p className="a-error" role="alert">{error}</p>}
      <button className="c-btn primary lg" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      <p className="a-note">Access is by invitation only. Ask your administrator for an invite link.</p>
    </form>
  );
}
