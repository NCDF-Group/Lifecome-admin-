"use client";

import { useState, type FormEvent } from "react";
import { inputClass, sendProfileRequest, submitClass } from "./field";

/** Changes the signed-in staff member's password via `POST /api/profile/password`. The current
 * password is required by the backend; the confirm field is checked here only. */
export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ kind: "error" | "success"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ kind: "error", message: "The new passwords don't match." });
      return;
    }

    setSubmitting(true);
    const error = await sendProfileRequest(
      "/api/profile/password",
      "POST",
      { currentPassword, newPassword },
      "Could not change your password.",
    );
    setSubmitting(false);

    if (error) {
      setStatus({ kind: "error", message: error });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatus({ kind: "success", message: "Password changed. Use it next time you sign in." });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="current-password" className="text-sm font-medium text-ink">
          Current password
        </label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-password" className="text-sm font-medium text-ink">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            placeholder="At least 10 characters"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-ink">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {status && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`text-sm font-medium ${status.kind === "error" ? "text-destructive" : "text-positive"}`}
        >
          {status.message}
        </p>
      )}

      <button type="submit" disabled={submitting} className={submitClass}>
        {submitting ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}
