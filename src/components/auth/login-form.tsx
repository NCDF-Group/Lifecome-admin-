"use client";

import { useState } from "react";
import { NewPasswordFields } from "./new-password-fields";
import { Steps } from "./steps";

async function post(url: string, payload: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data;
}

/**
 * Sign in. Someone still on a default password (e.g. their invite link expired) goes straight to
 * step 2 to choose their own password before continuing.
 */
export function LoginForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const data = await post("/api/auth/login", { email: form.get("email"), password: form.get("password") });
      if (data.user?.mustChangePassword) {
        setCurrent(String(form.get("password") ?? ""));
        setStep(2);
        setBusy(false);
        return;
      }
      window.location.replace(data.redirect ?? "/");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  async function setPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("newPassword") !== form.get("confirm")) return setError("New passwords don’t match.");
    setBusy(true);
    setError("");
    try {
      const data = await post("/api/auth/password", { currentPassword: current, newPassword: form.get("newPassword") });
      window.location.replace(data.redirect ?? "/");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  if (step === 2) {
    return (
      <>
        <Steps current={2} />
        <p className="a-sub">You signed in with a default password. Choose your own to continue.</p>
        <form onSubmit={setPassword} className="a-form" key="set">
          <NewPasswordFields />
          {error && <p className="a-error" role="alert">{error}</p>}
          <button className="c-btn primary lg" disabled={busy}>{busy ? "Saving…" : "Save password & continue"}</button>
        </form>
      </>
    );
  }

  return (
    <form onSubmit={signIn} className="a-form" noValidate key="signin">
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
      <p className="a-note">New here? Use the invite link your administrator sent, or sign in with your email and default password.</p>
    </form>
  );
}
