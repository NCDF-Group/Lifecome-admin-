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

/** Invitee flow: step 1 confirms the default password, step 2 sets their own. */
export function AcceptInviteForm({ token, email, defaultName }: { token: string; email: string; defaultName: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setBusy(true);
    setError("");
    try {
      await post("/api/invites/verify", { token, password });
      setCurrent(password);
      setStep(2);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function finish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("newPassword") !== form.get("confirm")) return setError("New passwords don’t match.");
    setBusy(true);
    setError("");
    try {
      const data = await post("/api/invites/accept", { token, currentPassword: current, name: form.get("name"), newPassword: form.get("newPassword") });
      window.location.replace(data.redirect ?? "/");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <>
      <Steps current={step} />
      {step === 1 ? (
        <form onSubmit={verify} className="a-form" key="verify">
          <label>
            <span>Email</span>
            <input value={email} readOnly disabled />
          </label>
          <label>
            <span>Default password</span>
            <div className="a-pw">
              <input name="password" type={show ? "text" : "password"} required autoComplete="current-password" placeholder="The password your administrator gave you" autoFocus />
              <button type="button" onClick={() => setShow((v) => !v)}>{show ? "Hide" : "Show"}</button>
            </div>
          </label>
          {error && <p className="a-error" role="alert">{error}</p>}
          <button className="c-btn primary lg" disabled={busy}>{busy ? "Checking…" : "Continue"}</button>
        </form>
      ) : (
        <form onSubmit={finish} className="a-form" key="finish">
          <NewPasswordFields defaultName={defaultName} />
          {error && <p className="a-error" role="alert">{error}</p>}
          <button className="c-btn primary lg" disabled={busy}>{busy ? "Setting up…" : "Set password & continue"}</button>
          <button type="button" className="a-back" onClick={() => { setStep(1); setError(""); }}>← Back</button>
        </form>
      )}
    </>
  );
}
